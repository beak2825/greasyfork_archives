// ==UserScript==
// @name         Birdreport Semi-auto Importer
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description  Using with commonBird, report converting function from eBird to Birdreport-cn.
// @author       CK Rainbow
// @match        https://www.birdreport.cn/member/reports/create.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=birdreport.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524704/Birdreport%20Semi-auto%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/524704/Birdreport%20Semi-auto%20Importer.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Create and insert the file input element into the page
    const input = document.createElement('input');

    input.textContent = 'Click Me';
    input.type = 'file';
    input.style.position = 'fixed'; // Fix the button position
    input.style.top = '10px'; // Distance from top
    input.style.right = '10px'; // Distance from right
    input.style.zIndex = 1000; // Ensure it is on top of other elements
    input.style.padding = '10px 15px';
    input.style.fontSize = '14px';
    input.style.backgroundColor = '#007BFF';
    input.style.color = '#FFF';
    input.style.border = 'none';
    input.style.borderRadius = '5px';
    input.style.cursor = 'pointer';
    input.accept = ".json"

    document.body.appendChild(input);

    // Add a change event listener to handle the file selection
    input.addEventListener('change', handleFileSelect, false);

    function handleFileSelect(event) {
        const doc = document;

        const file = event.target.files[0];
        if (!file) {
            alert("No file selected");
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            const content = e.target.result;
            console.log("File content:", content);

            const data = JSON.parse(content);
            const hotspot = doc.querySelector("input#addressText")
            const map = doc.querySelector("input#searchText")
            const comment = doc.querySelector("textarea")
            const start_time = doc.querySelector("input[name=start_time]")
            const end_time = doc.querySelector("input[name=end_time]")
            const xm_select = doc.querySelector("xm-select")
            const xm_options = xm_select.getElementsByClassName("xm-option-content")
            let danian = undefined;
            for(let i = 0; i < xm_options.length; i++) {
                if (xm_options[i].innerText === "2025年团队观鸟大年")
                {
                    danian = xm_options[i];
                }
            }


            hotspot.value = data.location;
            const event = new Event('input', { bubbles: true });
            hotspot.dispatchEvent(event);

            comment.value = `The report is converted from eBird checklist ${data.subid}`;
            comment.dispatchEvent(event);

            start_time.value = data.start_time;
            start_time.dispatchEvent(event);

            end_time.value = data.end_time;
            end_time.dispatchEvent(event);

            xm_select.click();
            setTimeout(() => {
                danian.click(); // Select the option
            }, 500);
        };

        reader.onerror = function(e) {
            console.error("File could not be read!");
            console.error(e.target.error);
        };

        reader.readAsText(file);
    }
})();