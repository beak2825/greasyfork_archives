// ==UserScript==
// @name        JAIN - LMS - Auto Login
// @namespace   https://greasyfork.org/en/users/781076-jery-js
// @match       https://lms.futurense.com/login/index.php
// @match       https://lms.futurense.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     2.1
// @author      Jery
// @license     MIT
// @run-at      document-idle
// @description Adds a 'Remember Password' and 'Auto Login' button to Jain University's LMS login page so that you never have to hit the login button ever again!!!
// @downloadURL https://update.greasyfork.org/scripts/459363/JAIN%20-%20LMS%20-%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/459363/JAIN%20-%20LMS%20-%20Auto%20Login.meta.js
// ==/UserScript==


// create a new switch element for the auto login button and append it to the remember password switch
const alElem = document.createElement('div');
alElem.classList.add('form-check', 'form-switch');
alElem.innerHTML = `
    <input type="checkbox" name="autologin" role="switch" id="autologin" class="form-check-input" value="1">
    <label for="autologin">Auto Login</label>
`;
alElem.style.marginLeft = '-36px';
document.getElementById('rememberusername').parentElement.appendChild(alElem);


// Initialize Variables
let username = GM_getValue('username', "");
let password = GM_getValue('password', "");
var rpState = GM_getValue('rpState', false);       // Remember Password State
var alState = GM_getValue('alState', false);       // Auto Login State

// Initialize Constants
const usnm = document.getElementById('username');
const pswd = document.getElementById('password');
const rpSwitch = document.getElementById('rememberusername');    // Remember Password Switch
const alSwitch = document.getElementById('autologin');           // Auto Login Switch


// Change "Remember username" to "Remember password"
rpSwitch.nextElementSibling.textContent = 'Remember password';

// If Remember Password switch is checked, set the last known username and password
if (rpState) {
    rpSwitch.checked = true;
    usnm.value = username;
    pswd.value = password;
}
// Add event listener to remember password Switch
rpSwitch.addEventListener('change', function () {
    GM_setValue('rpState', rpSwitch.checked);
    if (rpSwitch.checked && usnm.value != "" && pswd.value != "") {
        showToast("Username and Password saved!!");
        GM_setValue('username', usnm.value);
        GM_setValue('password', pswd.value);
    }
    alSwitch.checked = false;
    if (rpSwitch.checked) { alElem.hidden = false; } else { alElem.hidden = true; }
});


// Hide the Auto Login Element if remember switch is unchecked
if (rpSwitch.checked) alElem.hidden = false; else alElem.hidden = true;
// set the auto login switch state based on the last saved state
if (alState) { alSwitch.checked = alState; }
// Add event listener to Auto login Switch
alSwitch.addEventListener('change', function () { GM_setValue('alState', alSwitch.checked); });


// Click the login button if
//     i) Remeber Password Switch is Checked
//    ii) Auto Login Switch is Checked
if (rpSwitch.checked && alSwitch.checked) {
    document.getElementById('loginbtn').click();
    showToast("Auto login success!", 3000);
}

// When 'Logout' button is clicked
document.querySelector('#actionmenuaction-6').addEventListener('click', function() {
	GM_setValue('rpState', false);       // Remember Password State
	GM_setValue('alState', false);       // Auto Login State
})


// Function to show toast
function showToast(message, timeout = 2000) {
    var x = document.createElement("div");
    x.innerHTML = message;
    x.style.backgroundColor = "lightgray";
    x.style.borderRadius = "10px";
    x.style.padding = "10px";
    x.style.position = "fixed";
    x.style.top = "20px";
    x.style.right = "20px";
    x.style.zIndex = "10000";
    x.style.fontSize = "large";
    document.body.appendChild(x);

    setTimeout(function () {
        x.style.display = "none";
    }, timeout);
}