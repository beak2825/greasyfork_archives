// ==UserScript==
// @name         Appointments
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Save appointments into Excel file
// @author       Dorosh
// @match      https://app.zenmaid.com/appointments/list*
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/370939/Appointments.user.js
// @updateURL https://update.greasyfork.org/scripts/370939/Appointments.meta.js
// ==/UserScript==

const dropDownMenu = document.querySelector('ul[class="dropdown-menu"]');
dropDownMenu.innerHTML += '<li><button id="toExcelBtn" class="to-aside" style="background:none;border:none;">&nbsp &nbsp &nbsp &nbsp Export Excel</button></li>';
const toExcelBtn = dropDownMenu.querySelector('button[id="toExcelBtn"]');
toExcelBtn.addEventListener('click', exportAppointments);

async function exportAppointments()
{
    console.log('==> Export appointments <==');

    let result = '';

    const appointmentListObject = document.querySelector('div[id="appointments-list"]');
    const appointmentsPerDay = groupAppointmentsListObject(appointmentListObject);

    console.log(`Appointments days amount is ${appointmentsPerDay.length}`);
    console.log('Start reading...');

    const sidebarDiv = document.createElement( 'div' );
    sidebarDiv.id = 'response';
    sidebarDiv.style.display = 'none';

    for (let dayIndex = 0; dayIndex < appointmentsPerDay.length; dayIndex++) {
        const appointmentsGroup = appointmentsPerDay[dayIndex];
        const day = appointmentsGroup.head.querySelector('div[class="col-xs-12"]').querySelector('h3').textContent.trim();

        console.log(`Day ${dayIndex}`);
        console.log(`Date: ${day}`);
        console.log(`Appointments: ${appointmentsGroup.appointments.length}`);

        result += `${day}\n`;
        result += 'Day;Time;Client;Price;Address;Phone;Recurrence;Assigned to;Working Hours;Check;Credit Card;Cash;Invoice;Zelle;Notes\n';

        for (let appointmentIndex = 0; appointmentIndex < appointmentsGroup.appointments.length; appointmentIndex++) {
            const appointmentInfo = appointmentsGroup.appointments[appointmentIndex];

            const timeMap = appointmentInfo.querySelector('h4[class="appointment-time-list"]')
                                        .textContent.trim().split('\n');
            const time = timeMap[0].trim();
            const workingHours = timeMap[1].trim();

            const clientInfo = appointmentInfo.querySelector('div[class="col-xs-12 col-sm-8 col-lg-4 client_name"]');
            const clientName = clientInfo.querySelector('h3[class="mt-s"]').textContent;
            const address = clientInfo.querySelector('p').textContent.trim();
            const phones = clientInfo.querySelectorAll('a');
            const phoneNumbers = Array.from(phones)
                                    .filter(a => a.href.includes('tel:'))
                                    .map(function(a) { return a.href.replace('tel:', '');});
            const customerPhone = phoneNumbers.length > 0 ? phoneNumbers.join() : 'No phone';

            const price = parseInt(appointmentInfo.querySelector('div[class="charges-container"]')
                                        .querySelector('span').textContent.trim().replace('$', ''));
            
            result += `${day};${time};${clientName};${price};${address};${customerPhone};`;

            const appointmentId = appointmentInfo.querySelector('a[class="appointment-entry"]').getAttribute("data-appointment");

            const sidebarResponse = await makeGetRequest(`https://app.zenmaid.com/appointments/${appointmentId}/sidebar`);
            const sidebarJson = JSON.parse(sidebarResponse.response);
            sidebarDiv.innerHTML = sidebarJson.html;

            const recurrence = sidebarDiv.querySelector('div[class="sidebar-element border-b-partial recurrence-properties"]')
                                        .querySelector('div[class="sidebar-element-body"]')
                                        .childNodes[1].textContent.trim();

            const assignedToWidget = sidebarDiv.querySelector('div[class="assignment-widget"]');
            const assingmentData = JSON.parse(assignedToWidget.getAttribute('data-assignment-widget-data'));
            const assignments = assingmentData.assignments.map(function(a) { return a.name;});
            const assignedTo = assignments.length > 0 ? assignments.join() : 'No Assigned Cleaners';

            result += `${recurrence};${assignedTo};${workingHours};`;

            const customFields = sidebarDiv.querySelector('div[class="sidebar-section custom-fields"]')
                                            .querySelectorAll('div[class="sidebar-labeled-value-label"]');
            const customFieldsMap = {};
            customFields.forEach(function(field) {
                let name = field.innerText.trim();
                let value = field.nextElementSibling.innerText.trim();
                customFieldsMap[name] = value;
            });

            let check = '';
            if(customFieldsMap['Check'] && customFieldsMap['Check'] === "Yes") { check = price; }

            let creditCard = '';
            if(customFieldsMap['Credit Card'] && customFieldsMap['Credit Card'] === "Yes") { creditCard = price; }

            let cash = '';
            if(customFieldsMap['Cash'] && customFieldsMap['Cash'] === "Yes") { cash = price; }

            let invoice = '';
            if(customFieldsMap['Invoice'] && customFieldsMap['Invoice'] === "Yes") { invoice = price; }

            let zelle = '';
            if(customFieldsMap['Zelle'] && customFieldsMap['Zelle'] === "Yes") { zelle = price; }

            result += `${check};${creditCard};${cash};${invoice};${zelle};`;

            const notesResponse = await makeGetRequest(`https://app.zenmaid.com/appointments/${appointmentId}/notes.json`);
            const notesJson = JSON.parse(notesResponse.response);
            const notesArray = Array.from(notesJson).map(function(note) {
                return note.body.replace(/<br\s*[\/]?>/gi, ' -- ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(';', '\\').trim();
            });

            const notes = notesArray.length > 0 ? notesArray.join(' || ') : 'No notes recorded';

            result += `${notes};\n`;
        }
    }
    
    download(result);
}

function groupAppointmentsListObject(target) {
    console.log('== Parse appointments table object ==');

    let result = [];

    for(let childIndex in target.children) {
        const child = target.children[childIndex];

        if(child.tagName != 'DIV') { continue; }

        if(child.className == 'row appointment-date-list') {
            let newDayObject = {};
            newDayObject.head = child;
            newDayObject.appointments = []
            result.push(newDayObject);
        } else if(child.className == 'row') {
            result[result.length - 1].appointments.push(child);
        }
    }

    return result;
}

function download(stringResult) {
    console.log(stringResult);

    const currentDate = new Date();

    let a = document.createElement('a');
    a.href = `data:attachment/csv,${encodeURIComponent(stringResult)}`; //content
    a.target = '_blank';
    a.download = `${currentDate.toUTCString()}.csv`; //file name
    a.click();
}

function getHoursInterval(input) {
    let time = {};

    time.full = input.split(' ').join('');

    const startPart = time.full.substring(0, time.full.indexOf('-'));
    const endPart = time.full.substring(time.full.indexOf('-') + 1, time.full.length);

    time.begin = to24HoursFormat(startPart);
    time.end = to24HoursFormat(endPart);

    const dateBegin = new Date(2000, 1, 1, time.begin.hours, time.begin.minutes);
    const dateEnd = new Date(2000, 1, 1, time.end.hours, time.end.minutes);

    const hoursDiff = (dateEnd.getTime() - dateBegin.getTime()) / 3600000;

    return hoursDiff;
}

function to24HoursFormat(input) {
    let result = {};

    const dayPart = input.substring(5, 7);
    const hours = parseInt(input.substring(0, 2));

    result.hours = (dayPart === 'PM' && hours !== 12)
        ? (hours + 12)
        : hours;

    result.minutes = parseInt(input.substring(3, 5));

    return result;
}

function makeGetRequest(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function(response) {
        resolve(response);
      },
      onerror: function(error) {
        reject(error);
      }
    });
  });
}