// ==UserScript==
// @name         Course Offering
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Display more details for sections in KFUPM Course Offering webpage
// @author       mohalobaidi
// @license      MIT 
// @match        https://registrar.kfupm.edu.sa/course-offerings
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://registrar.kfupm.edu.sa/course-offerings&size=64
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/454942/Course%20Offering.user.js
// @updateURL https://update.greasyfork.org/scripts/454942/Course%20Offering.meta.js
// ==/UserScript==

(async function() {
    // Ignore this, (but its required, so do not remove it).
    await fetchBanner('/registration');
    'use strict';
    // Get the table displayed in the Course Offering page.
    const table = document.getElementById('data-table');
    // Get the table's header.
    const thead = table.querySelector('thead tr');
    // Insert a new column header (actually the row inside the header, but there is only one row).
    thead.innerHTML += '<th>Details</th>';
    // Get the table's body.
    const tbody = table.querySelector('tbody');
    // Get all rows in table body.
    const rows = [...tbody.querySelectorAll('tr')];
    // Loop through rows and for each row...
    for (let row of rows) {
        // Get the cells in the row and...
        const data = [...row.children]
             // map its content (Course-Sec, Activity, CRN, etc.)
            .map(c => c.innerText)
            // and remove spaces (to use it as params in Bannar without errors).
            .map(c => c.replace(/\s/g, ''));
        // Get the course name. (Insure to remove spaces).
        const course = data[0].split('-')[0];
        // Get section's CRN.
        const crn = data[2].trim();
        // Create a wrapper element for the button.
        const wrapper = document.createElement('td');
        // Create a button element.
        const button = document.createElement('span');
        // Create style for the button.
        const baseStyle = 'cursor: pointer;white-space: nowrap;text-decoration: underline;color: blue;'
        // Create style for the button to disable it.
        const disabledStyle = "opacity: 0.5;pointer-events: none;"
        // Edit button's style.
        button.style = baseStyle
        // Change button's text.
        button.innerHTML = 'Get details';
        // Insert the button in the wrapper.
         wrapper.appendChild(button);
        // Insert the wrapper in the row (now it should be displayed in the page).
        row.appendChild(wrapper);
        // Create new cell to store the details in.
        const details = document.createElement('td');
        // Create new row for the details' cell.
        const detailsRow = document.createElement('tr');
        // Insert the cell in the row.
        detailsRow.appendChild(details)

        // When the button gets clicked...
        button.onclick = async () => {
            // Wrap the code in a try/catch block (to capture any error any prevent our code from stopping).
            try {
                // Disable the button (but altering its style).
                button.style = baseStyle + disabledStyle
                // Change button's text.
                button.innerHTML = 'Fetching...';
                // Get section data from Banner.
                const data = await getDetails(course, crn);
                /*** since we are in an asynchronous block, the data has been received with no errors. So,... ***/
                // Change button's style back to normal
                button.style = baseStyle
                // Change button's text.
                button.innerHTML = 'Refresh';
                // Extract (Destructure) the data.
                const { enrollment, maximumEnrollment, seatsAvailable, waitAvailable, waitCapacity, linkIdentifier } = data
                // Edit the details cells with the data received.
                details.innerHTML = `
                    <ul>
                        ${linkIdentifier === 'CX' ? '<li><b>This course is part of a Consentration Program</b></li>' : ''}
                        ${linkIdentifier === 'LC' ? '<li><b>This section requires a <u>LAB</u> section to be able to register it.</b></li>' : ''}
                        ${linkIdentifier === 'LB' ? '<li><b>This section requires a <u>LEC</u> section to be able to register it.</b></li>' : ''}
                        <li><b>Enrollments:</b> ${enrollment} out of ${maximumEnrollment} students has already enrolled.</li>
                        <li><b>Availability:</b> There are ${seatsAvailable} seat(s) available.</li>
                        <li><b>Waitlist:</b> There are ${waitAvailable} spot(s) available in the waitlist (out of ${waitCapacity}).</li>
                    </ul>
                `
                // Inser details' row in the table (after the section's row)
                 tbody.insertBefore(detailsRow, row.nextSibling);
                // Make sure the details' cell is displayed correctly, (change its with to be 11 column to be as wide as the whole table).
                 details.setAttribute('colspan', 11);
            // When an error occurs...
            } catch {
                // Change button's style back to normal (since it was in a loading state).
                button.style = baseStyle
                // Change button's text.
                button.innerHTML = 'Try again';
            }
        }
    }
})()

async function getDetails (course, crn) {
    // Get term from dropdown menu in the course offering page.
    const term = document.getElementById('term_code').value
    // Pick the term (it is required by Banner to pick the term before getting sections data).
    await fetchBanner(`/term/search?${[
      `mode=courseSearch`, // Required by Banner.
      `term=${term}`,      // Required by Banner.
      `studyPath=`,        // Required by Banner.
      `studyPathText=`,    // Required by Banner.
      `startDatepicker=`,  // Required by Banner.
      `endDatepicker=`     // Required by Banner.
       // I actually didn't check if it's truly required or not. But if it works , it works...
    ].join('&')}`)
    // Get sections data of the selected course.
    const { data } = await fetchBanner(`/searchResults/searchResults?${[
      `txt_subjectcoursecombo=${course}`,
      `txt_term=${term}`,
      `startDatepicker=`,
      `endDatepicker=`,
      `pageOffset=0`,
      `pageMaxSize=500`,
      `sortColumn: subjectDescription`,
      `sortDirection: asc`
       // Same thing here...
    ].join('&')}`)
    // Find the section by CRN.
    const section = data.find(section => section.courseReferenceNumber === crn)
    // Return section's details.
    return section
}


async function fetchBanner (url) {
    // Create a new promise (to make it easier for us).
    return new Promise((resolve, reject) => {
        // Using GreaseMonkey's API that most UserScript managers use it. (See: https://wiki.greasespot.net/)
        GM.xmlHttpRequest({
            method: "GET",
            url: "https://banner9-registration.kfupm.edu.sa/StudentRegistrationSsb/ssb" + url,
            headers: {
                // Idk, I just copied it and... it works!
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,en-GB;q=0.8,ar;q=0.7",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\" Not;A Brand\";v=\"99\", \"Google Chrome\";v=\"97\", \"Chromium\";v=\"97\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': '',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            credentials: 'include',
            withCredentials: true,
            onload: function(res) {
                // If our request exuted as expected...
                if (res.status === 200) {
                    try {
                        // resolve the promise with the response's data.
                        resolve(JSON.parse(res.response))
                    } catch {
                        resolve(res.response)
                    }
                } else {
                    reject(res)
                }
            }
        })
    })
}