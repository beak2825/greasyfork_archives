// ==UserScript==
// @name         tablefilter
// @namespace    crinfarr.io
// @version      2024-07-12
// @description  Adds filter dropdowns to the top row of any .table
// @author       Crinfarr
// @match        *://*/*
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/500373/tablefilter.user.js
// @updateURL https://update.greasyfork.org/scripts/500373/tablefilter.meta.js
// ==/UserScript==

(function() {
    for (let table of document.getElementsByClassName("table")) {
        let headers = table.getElementsByTagName('thead')[0].children[0].children;
        for (let headeridx in headers) {
            let ipt = document.createElement('input');
            ipt.type = 'text';
            ipt.addEventListener("change", () => {
                for (let row of table.getElementsByTagName('tbody')[0].children) {
                    if (ipt.value == '') {
                        row.hidden = false;
                    }
                    let cell = row.children[headeridx]
                    let filters = ipt.value.split(/(?!<\\)\|\|/gm).map(s => s.trim());
                    if (filters.some((filter) => {
                        return cell.innerText.includes(filter);
                    })) {
                        console.log(`${cell.innerText} contains ${filters}`);
                        row.hidden = false;
                    } else {
                        console.log(`${cell.innerText} does not contain ${filters}`);
                        row.hidden = true;
                    }
                }
            });
            headers[headeridx].appendChild(ipt);
        }
    }
})();