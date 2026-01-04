// ==UserScript==
// @name   NAT_highlight_ticket_rows
// @version  1.0
// @description highlight_ticket_rows
// @grant    none
// @include     https://clients.netafraz.com/admin/supporttickets.php*
// @namespace https://greasyfork.org/users/1419751
// @downloadURL https://update.greasyfork.org/scripts/538058/NAT_highlight_ticket_rows.user.js
// @updateURL https://update.greasyfork.org/scripts/538058/NAT_highlight_ticket_rows.meta.js
// ==/UserScript==
// Programmed and developed by Farshad_Mehryar (https://t.me/farshad271)

setTimeout(async () => {
    const table2 = document.getElementById("sortabletbl2");
    if (!table2) {
        return;
    }

    let staffList;
    try {
        staffList = await waitForStaffContent();
    } catch (err) {
        console.warn("staff content not found after 10 attempts:", err.message);
        return;
    }

    const rows = [...table2.tBodies[0].rows];
    for (let i = rows.length - 1; i > 0; i--) {
        const [, , td2, td3] = rows[i].cells;
        const ticketDepAndEmployeeName = td2.innerText;
        const ticketSubject = td3.innerText;        

        const staffCheck = staffList.every(employee => {
            const employeeFullName = employee.innerText.trim();
            const match = ticketDepAndEmployeeName.includes(employeeFullName);
            return !match;
        });

        if (staffCheck && ticketDepAndEmployeeName.includes(')')) {
            for (const td of rows[i].cells) {
                td.style.backgroundColor = '#F5F5DC';
            }            
        }
    }

    async function waitForStaffContent() {
        console.log('Waiting for .staff--content elements...');
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 10;
            const interval = setInterval(() => {
                const staffContents = document.querySelectorAll(".staff--content");

                if (staffContents.length > 0) {
                    clearInterval(interval);
                    const allStaffNames = [];

                    for (const content of staffContents) {
                        const names = content.querySelectorAll(".staff--exact--name");
                        allStaffNames.push(...names);
                    }                    
                    resolve(allStaffNames);
                } else {
                    const icon = document.querySelector(".section--head > i");
                    if (icon) icon.click();                    
                    attempts++;
                    if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        reject(new Error("staff--content not found"));
                    }
                }
            }, 500);
        });
    }
}, 500);