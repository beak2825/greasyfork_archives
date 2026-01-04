// ==UserScript==
// @name         GitHub FileSize Viewer Revised
// @namespace    https://github.com/mo-san/GitHub-FileSize-Viewer
// @version      0.9.12.2
// @description  Show the file size next to it on the website
// @author       nmaxcom (Original)
// @author       Masaki(mo-san)
// @license      MIT
// @match        https://*.github.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/373028/GitHub%20FileSize%20Viewer%20Revised.user.js
// @updateURL https://update.greasyfork.org/scripts/373028/GitHub%20FileSize%20Viewer%20Revised.meta.js
// ==/UserScript==

(function () {
    var TEXT_COLOR = '#6a737d'; // Default github style
    // var TEXT_COLOR = '#888'; // my dark github style
    const SHOW_BYTES = false; // false: always KB, i.e. '>1 KB'; true: i.e. '180 B' when less than 1 KB
    const ABSOLUTE_DATE = true; // shows commit datetime absolutely, otherwise originally relatively.

    var vars, response;
    const css = style => document.head.insertAdjacentHTML("beforeend", `<style>${style}</style>`);
    css(`
td.filesize { color: ${TEXT_COLOR}; text-align: right; 'padding-right: 50px !important; }
table.files td.message { max-width: 250px !important; }
`)
    XMLHttpRequest.prototype.open = () => {
        this.addEventListener('loadend', () => tableCheckandGo());
        XMLHttpRequest.prototype.open.apply(this, arguments);
    };
    tableCheckandGo();


    /*
     * Order of business:
     * - Detect table, if present, launch async API call and insert new blank cells
     * - Detect necessary info to make the async API call
     * - When promised is successful, change the blanks for the numbers
     * done: detect page change since github does that youtube thing
     */
    function tableCheckandGo() {
        if (!document.querySelector('table.files')) return;

        /*
         * GET must be implemented in the api: /repos/:owner/:repo/contents/:path?ref=branch
         * With this regex we capture the title: \w+(.*?)\sat\s(.*?)\s.*?(\w+)\/(\w+)
         * where (1) dir path, (2) branch, (3) owner, (4) repo;
         * That regex does not work in root
         */
        var title = document.title;
        // Root folder:
        var match3 = title.match(/.*?([\w\d.-]+)\/([\w\d.-]+):/i);
        // Non root folder, any branch:
        // Root folder, we'll extract branch from scrape
        var match2 = title.match(/.+?\/([\w\d.\/-]+).*?·\s([\w\d.-]+)\/([\w\d.\/-]+)/i);
        if (match3) {
            vars = {
                dir: "",
                owner: match3[1],
                repo: match3[2],
                branch: document.querySelector('.branch-select-menu button span').innerHTML
            };
        } else if (match2) {
            vars = {
                dir: match2[1],
                owner: match2[2],
                repo: match2[3],
                branch: document.querySelector('.branch-select-menu button span').innerHTML
            };
        };

        callGitHub().then((resp) => {
            insertBlankCells();
            fillTheBlanks(JSON.parse(resp.responseText));
        })
    }

    /*
     * API call
     *  We're forced to use GM_xmlhttpRequest to avoid Same Origin Policy issues
     */
    function callGitHub() {
        return new Promise((resolve, reject) =>
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.github.com/repos/${vars.owner}/${vars.repo}/contents/${vars.dir}?ref=${vars.branch}`,
                onload: (res) => resolve(res),
                onerror: (res) => reject(res)
            })
        );
    }

    /*
     * - Directories get new cellmate too
     *
     */
    function insertBlankCells() {
        const filenameCells = document.querySelectorAll('tr[class~="js-navigation-item"] > td.content');
        for (let cell of filenameCells) {
            const newtd = document.createElement('td');
            newtd.className = 'filesize';
            cell.parentNode.insertBefore(newtd, cell.nextSibling);
        }
    }

    /*
     * If we get the data, we insert it carefully so each filename gets matched
     * with the correct filesize.
     */
    function fillTheBlanks(JSONelements) {
        const nametds = document.querySelectorAll('tr[class~="js-navigation-item"] > td.content a');
        toploop:
        for (let element of JSONelements) {
            for (let td of nametds) {
                if (element.name !== td.innerHTML) continue;
                if (element.type !== 'file') continue;
                let sizeNumber = (element.size / 1024).toFixed(0);
                if (SHOW_BYTES) {
                    sizeNumber = sizeNumber < 1 ? element.size + ' B' : sizeNumber + ' KB';
                } else {
                    sizeNumber = sizeNumber < 1 ? '> 1 KB' : sizeNumber + ' KB';
                }
                td.parentNode.parentNode.nextSibling.innerHTML = sizeNumber;
            }
        }
    }


    /*
     * Shows commit time in absolute, instead of relative.
     */
    if (ABSOLUTE_DATE) {
        css(`
table.files td.age {
    padding: 0;
}
table.files td.age span.css-truncate {
    display: block;
}
td.age time-ago,
relative-time {
    font-size: 0;
}
td.age time-ago::before,
relative-time::before {
    content: attr(title);
    font-size: 14px;
}
`)
    }

})();
