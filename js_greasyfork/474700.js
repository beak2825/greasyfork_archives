// ==UserScript==
// @name         Torn City Employee Effectiveness
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Show Employee Effectiveness for All Users
// @author       ErrorNullTag
// @match        https://www.torn.com/companies.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/474700/Torn%20City%20Employee%20Effectiveness.user.js
// @updateURL https://update.greasyfork.org/scripts/474700/Torn%20City%20Employee%20Effectiveness.meta.js
// ==/UserScript==

(function() {
    // Function to get User ID from the page
    function getUserIdFromPage() {
        const menuValue = document.querySelector('.menu-value___gLaLR');
        if (menuValue) {
            const href = menuValue.getAttribute('href');
            if (href) {
                const id = href.split('=')[1];
                return id;
            }
        }
        return null;
    }

    const id = getUserIdFromPage();

    // Retrieve or prompt for API key
    let key = GM_getValue('API_KEY', '');
    if (!key) {
        key = prompt("Enter your API Key:");
        GM_setValue('API_KEY', key);
    }

    if (id) {
        fetch(`https://api.torn.com/company/?selections=employees&key=${key}`)
        .then(response => response.json())
        .then(apiJson => {
            var res = apiJson;
            if (res.company_employees) {
                // Create the container box
                const box = document.createElement('div');
                box.style.position = 'fixed';
                box.style.top = '0';
                box.style.right = '0';
                box.style.zIndex = '1000';
                box.style.backgroundColor = 'black';
                box.style.color = 'green';
                box.style.padding = '20px';
                box.style.border = '3px solid green';
                box.style.borderRadius = '10px';
                box.style.overflow = 'auto';
                box.style.maxHeight = '400px';
                box.style.fontFamily = "'Arial', monospace";

                // Create the title
                const title = document.createElement('h1');
                title.innerText = 'Phantom Scripting';
                title.style.color = 'gold';
                title.style.marginBottom = '20px';
                title.style.fontSize = '24px';

                // Append title to box
                box.appendChild(title);

                // Loop over each employee and append their data to the box
                for (let employeeId in res.company_employees) {
                    let employee = res.company_employees[employeeId];
                    const p = document.createElement('p');
                    p.style.marginBottom = '10px';
                    p.style.fontSize = '18px';

                    const effectivenessSpan = document.createElement('span');
                    effectivenessSpan.innerText = employee.effectiveness.total;
                    effectivenessSpan.style.color = 'gold';

                    p.innerHTML = `${employee.name}: Effectiveness = `;
                    p.appendChild(effectivenessSpan);

                    box.appendChild(p);
                }

                // Append the box to the body
                document.body.appendChild(box);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
    } else {
        console.error("User ID could not be determined.");
    }
})();

