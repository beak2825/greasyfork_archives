// ==UserScript==
// @name         Rutracker Movies Images
// @namespace    https://rutracker.org/forum/tracker.php?type=movies
// @version      2024-06-27
// @description  Loads images from rutracker torrent description to the search page.
// @author       Rualark
// @license      MIT
// @match        *://rutracker.org/forum/tracker.php?type=movies*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/499080/Rutracker%20Movies%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/499080/Rutracker%20Movies%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getImages(html) {
        var rx = /var class="postImg[^"]*" title="([^"]*)"/g;
        let res = [];
        var m;
        while (m = rx.exec(html)) {
            if (m[1].includes('static.rutracker.org')) continue;
            //if (m[1].includes('.png')) continue;
            if (m[1].includes('.gif')) continue;
            if (m[1].includes('donate')) continue;
            res.push(m[1]);
            if (res.length > 3) break;
        }
        return res;
    }

    function insertRowAfter(existingRow, html) {
        if (!html) return;
        const newRow = document.createElement('tr');
        newRow.innerHTML = html;
        existingRow.insertAdjacentElement('afterend', newRow);
        return newRow;
    }

    function cutText(st) {
        return st.replace(/(\D)([0-9]{3,4}p)(\W)/g, "$1$3").replace(/, 4k/g, "");
    }

    function loadPages() {
        const els = document.querySelectorAll(".tLink");
        let opened = {};
        let i = 0;
        for (const el of els) {
            ++i;
            const st = el.innerHTML;
            const cut = cutText(st);
            if (cut in opened) continue;
            opened[cut] = true;
            setTimeout(() => {
                loadPage(el.href, el.parentElement.parentElement);
            }, 100*i);
        }
    }

    function loadPage(url, el) {
        var data = GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'text/xml'
            },
            onload: function (response) {
                let st = '';
                const html = response.responseText;
                if (html.includes('<a href="index.php?c=2">') || html.includes('<a href="viewforum.php?f=807">') || html.includes('<a href="index.php?c=18">')) {
                } else {
                    el.style.backgroundColor = '#ffcccc';
                }
                for (let img of getImages(html)) {
                    st += `<a target=_blank href="${img}"><img src="${img}" style="max-height: 200px; height: auto; object-fit: contain"></a>`;
                }
                if (st == '') return;
                st = `<td align=center colspan=10><div style="max-width: calc(100vw - 40px); overflow: hidden">${st}</div></td>`;
                insertRowAfter(el.parentElement, st);
            }
        });
    }

    loadPages();

})();
