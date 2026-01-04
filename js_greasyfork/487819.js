// ==UserScript==
// @name     GitHub Auto-Fill Form
// @version      2024-02-25
// @description  github copilot 全自动输入美国地址信息
// @author       SMNET
// @license MIT
// @grant    GM_xmlhttpRequest
// @match  https://github.com/github-copilot/signup/billing?*
// @match  https://github.com/github-copilot/signup/success
// @match  https://github.com/github-copilot/signup/settings
// @match  https://github.com/join/welcome
// @namespace https://greasyfork.org/users/1218336
// @downloadURL https://update.greasyfork.org/scripts/487819/GitHub%20Auto-Fill%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/487819/GitHub%20Auto-Fill%20Form.meta.js
// ==/UserScript==
 
function fillForm3() {
    let summaryElement = document.querySelector('summary[data-view-component="true"]');
    if(summaryElement) {
        summaryElement.click();
        setTimeout(() => {
            let allowedButton = document.querySelector('button[value="allowed"]');
            if(allowedButton) {
                allowedButton.click();
                setTimeout(() => {
                    let saveButton = document.getElementById('copilot_settings_submit');
                    if(saveButton) {
                        saveButton.click();
                    } else {
                        console.error('Could not find the "Save and complete setup" button');
                    }
                }, 100);
            } else {
                console.error('Could not find the "Allowed" button');
            }
        }, 100);
    } else {
        console.error('Could not find the summary element');
    }
}
function fillForm1(data) {
    let firstName = data.address.Full_Name.split(" ")[0];
    let lastName = data.address.Full_Name.split(" ")[1] || firstName;
    document.querySelector('input[name="user_contact_info[first_name]"]').value = firstName;
    document.querySelector('input[name="user_contact_info[last_name]"]').value = lastName;
    let countrySelect1 = document.querySelector('select[name="user_contact_info[country]"]');
    for(let i=0; i<countrySelect1.options.length; i++){
        if(countrySelect1.options[i].innerText === 'United States of America'){
            countrySelect1.value = countrySelect1.options[i].value;
            break;
        }
    }
    let submitButton = document.querySelector('button.btn-primary.btn.width-full.mt-3');
    if(submitButton) {
        submitButton.click();
    } else {
        console.error('Could not find the "Submit" button');
    }
}
function fillForm2(data) {
    let firstName = data.address.Full_Name.split(" ")[0];
    let lastName = data.address.Full_Name.split(" ")[1] || firstName;
    document.querySelector('input[name="account_screening_profile[first_name]"]').value = firstName;
    document.querySelector('input[name="account_screening_profile[last_name]"]').value = lastName;
    document.querySelector('input[name="account_screening_profile[address1]"]').value = data.address.Address;
    document.querySelector('input[name="account_screening_profile[city]"]').value = data.address.City;
    document.querySelector('input[name="account_screening_profile[region]"]').value = data.address.State;
    document.querySelector('input[name="account_screening_profile[postal_code]"]').value = data.address.Zip_Code;
    let countrySelect2 = document.querySelector('select[name="account_screening_profile[country_code]"]');
    for(let i=0; i<countrySelect2.options.length; i++){
        if(countrySelect2.options[i].innerText === 'United States of America'){
            countrySelect2.value = countrySelect2.options[i].value;
            break;
        }
    }
    let checkElement = document.querySelector('h4.mb-3');
    if(checkElement && checkElement.innerText.trim() === 'Payment method') {
        return;
    } else {
        let saveButton = document.querySelector('button[name="submit"][type="submit"]');
        if (saveButton) saveButton.click();
    }
}
window.onload = () => {
    let currentUrl = window.location.href;
    let specificElement = document.querySelector('#copilot_settings_telemetry');
 
 
    if (currentUrl === "https://github.com/github-copilot/signup/settings") {
        window.location.href = "https://cocopilot.org/copilot/token";
    }
    else if (currentUrl === "https://github.com/join/welcome") {
        window.location.href = "https://github.com/github-copilot/signup/billing?payment_duration=monthly";
    }
    else if (specificElement) {
        return fillForm3();
    } else {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://www.meiguodizhi.com/api/v1/dz',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                "city": "",
                "path": "/",
                "method": "refresh"
            }),
            onload: (response) => {
                var data = JSON.parse(response.responseText);
                specificElement = document.querySelector('input[name="user_contact_info[first_name]"]');
                if (specificElement) {
                    fillForm1(data);
                } else {
                    fillForm2(data);
                }
            },
            onerror: (error) => {
                console.error('Error during request:', error);
            }
        });
    }
};