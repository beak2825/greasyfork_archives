// ==UserScript==
// @name     GitHub地址表单自动填写
// @version      2024-07-02
// @description  自动填写美国真实街道地址
// @author       ripper
// @license MIT
// @grant    GM_xmlhttpRequest
// @match  https://github.com/settings/billing/payment_information
// @namespace https://github.com/ripperts
// @downloadURL https://update.greasyfork.org/scripts/499536/GitHub%E5%9C%B0%E5%9D%80%E8%A1%A8%E5%8D%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/499536/GitHub%E5%9C%B0%E5%9D%80%E8%A1%A8%E5%8D%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function fillForm2(data) {
        document.querySelector('input[name="account_screening_profile[first_name]"]').value = data.firstname;
        document.querySelector('input[name="account_screening_profile[last_name]"]').value = data.lastname;
        document.querySelector('input[name="account_screening_profile[address1]"]').value = data.address;
        document.querySelector('input[name="account_screening_profile[city]"]').value = data.city;
        //document.querySelector('input[name="account_screening_profile[region]"]').value = data.address.State_Full;
        document.querySelector('input[name="account_screening_profile[postal_code]"]').value = data.zip;
        let countrySelect2 = document.querySelector('select[name="account_screening_profile[country_code]"]');
        for(let i=0; i<countrySelect2.options.length; i++){
            if(countrySelect2.options[i].innerText === 'United States of America'){
                countrySelect2.value = countrySelect2.options[i].value;
                break;
            }
        }
        
        // todo: 无法自动选择州
        let stateSelect = document.querySelector('select[name="account_screening_profile[region]"]');
        stateSelect.value = data.region;

        let checkElement = document.querySelector('h4.mb-3');
        if(checkElement && checkElement.innerText.trim() === 'Payment method') {
            return;
        } else {
            let saveButton = document.querySelector('button[name="submit"][type="submit"]');
            // if (saveButton) saveButton.click();
        }
    }
    window.onload = () => {
        // The URL you want to fetch content from
        const url = 'https://shenfendaquan.com/Index/index/get_zhenshi';
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    // You can now process the response as needed
                    // For example, parsing the HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    // Extract values from input fields
                    const inputs = doc.querySelectorAll('input[type="text"]');
                    const values = Array.from(inputs)
                                        .map(input => input.value)
                                        .filter(value => value.trim() !== '');

                    console.log('Extracted Values:', values);

                    const resultData = {
                        "firstname": values[0],
                        "lastname": values[1],
                        "address": values[3],
                        "city": values[4],
                        "region": values[6],
                        "zip": values[7],
                        "phone": values[8]
                    }

                    console.log("街道信息详情:",resultData)

                    fillForm2(resultData);

                } else {
                    // Handle the error
                    console.error('Failed to fetch content. Status:', response.status);
                }
            },
            onerror: function(error) {
                // Handle the error
                console.error('Request failed:', error);
            }
        });
    };

})();
