// ==UserScript==
// @name         My Vir Que
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Why Waiting Lets Go....
// @author       M C KRISH
// @match        https://tirupatibalaji.ap.gov.in/index.htm
// @match        https://online.tirupatibalaji.ap.gov.in/login.htm
// @match        https://ttdevasthanams.ap.gov.in/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MY OWN
// @downloadURL https://update.greasyfork.org/scripts/441838/My%20Vir%20Que.user.js
// @updateURL https://update.greasyfork.org/scripts/441838/My%20Vir%20Que.meta.js
// ==/UserScript==

(function() {
    'use strict';
localStorage.setItem("c_timer", "1");
    localStorage.setItem("user-access", '{"timeRemaining":1,"arjitha-seva":1,"pld":1,"apd":1,"sed":1,"acc":1,"spt":1}');

    if(location.pathname=="/index.htm"){
window.location.replace("https://tirupatibalaji.ap.gov.in/#/userLogin");
}if(location.pathname=="/sed.htm"){
    window.location.replace("https://ttdevasthanams.ap.gov.in/slot-booking?flow=sed&flowIdentifier=sed");
}if(location.pathname=="/acc.htm"){
 window.location.replace("https://ttdevasthanams.ap.gov.in/accommodation/slot-booking?flow=acc&flowIdentifier=acc");
}if(location.pathname=="/sevas.htm"){
 window.location.replace("https://ttdevasthanams.ap.gov.in/arjitha-seva/slot-booking?section=pilgrim-details&flowIdentifier=arjitha-seva&flow=arjitha-seva");
}

// Define an array of link objects
const links = [
  { text: 'Seva', url: 'https://ttdevasthanams.ap.gov.in/index.htm' },
  { text: 'SED', url: 'https://ttdevasthanams.ap.gov.in/sed.htm' },
  { text: 'ACC', url: 'https://ttdevasthanams.ap.gov.in/acc.htm' }
];

// Find all <div> elements with font-size 20px
const waitTimeDivs = document.querySelectorAll('div[style="font-size: 20px;"]');

// Loop through the <div> elements and inject the links
waitTimeDivs.forEach((waitTimeDiv) => {
  // Loop through the link objects and create a link for each one
  links.forEach((link) => {
    // Create a new <a> element
    const waitTimeLink = document.createElement('a');

    // Set the href attribute of the <a> element
    waitTimeLink.href = '#';

    // Set the text content of the <a> element
    waitTimeLink.textContent = link.text;

    // Add an event listener to the <a> element
    waitTimeLink.addEventListener('click', () => {
      window.location.href = link.url;
    });

    // Inject the <a> element into the <div> element
    waitTimeDiv.appendChild(document.createTextNode(' '));
    waitTimeDiv.appendChild(waitTimeLink);
  });
});


setInterval(function(){
  var checkbox = document.querySelector('img[src="/checkbox_unselect.png"]');
  if (checkbox) {
    checkbox.click();
  }

  var okButton = document.querySelector('.DialogBox_retryButton__c9eNG.DialogBox_marginBottom__1tN0k');
  if (okButton) {
    okButton.click();
  }

  var payNowButton = document.querySelector('button[style="background-color: var(--tdd-primary-color); color: rgb(255, 255, 255); padding: 7px 12px; font-size: 16px; border-radius: 0px; min-width: 127px; margin-left: 5px; border: none; width: 163px; height: 46px; cursor: pointer;"]');
  if (payNowButton) {
    payNowButton.click();
  }
// // Find the dropdown button element
// const dropdownButton = document.querySelector('.Dropdown_buttonContainer__EE-2X button');

// // Find all the options within the dropdown
// const dropdownOptions = document.querySelectorAll('.Dropdown_optionsCss__fjRZ9');

// // Find the age input element
// const ageInput = document.querySelector('.Textfield_textfield__2riqz[name="age"]');

// // Check if the age input value is equal to 55
// if (ageInput.value) {
//   // Loop through each option and find the one that contains "Aadhar Card"
//   dropdownOptions.forEach(option => {
//     if (option.textContent.includes('Aadhar Card')) {
//       // Click the option that contains "Aadhar Card"
//       option.click();
//     }
//   });
// }

}, 500);
function clickRefreshButton() {
        const refreshButton = document.querySelector('div[style*="display: flex; align-items: center; justify-content: center;"] > div');
        if (refreshButton) {
            refreshButton.click();
        }
    }
       // Set interval to click the button every 10 seconds
    setInterval(clickRefreshButton, 5000);
    // Function to check for the specified background color and play an alert
    function checkBackgroundColor() {
        const targetElement = document.querySelector('td[style*="background: rgb(255, 191, 0);"]');
        if (targetElement) {
            const alertSound = new Audio('https://www.soundjay.com/buttons/beep-08b.mp3'); // Replace with the path to your alert sound file
            alertSound.play();
        }
    }
    setInterval(checkBackgroundColor, 1000);
    function checkDialogBox() {
        const dialogBox = document.querySelector('.DialogBox_dialogContainer__10D3l');
        if (dialogBox) {
            const alertSound = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3'); // Replace with the path to your alert sound file
            alertSound.play();
        }
    }
setInterval(checkDialogBox, 2000);
})();