// ==UserScript==
// @name         あぷサムネ表示 [仮]
// @description  あぷ/あぷ小の一覧表示にサムネイルを追加します。
// @version      1.5.1
// @match        *://dec.2chan.net/up/
// @match        *://dec.2chan.net/up/*.htm
// @match        *://dec.2chan.net/up2/
// @match        *://dec.2chan.net/up2/*.htm
// @icon         https://www.2chan.net/favicon.ico
// @grant        none
// @namespace    https://greasyfork.org/users/809755
// @downloadURL https://update.greasyfork.org/scripts/431563/%E3%81%82%E3%81%B7%E3%82%B5%E3%83%A0%E3%83%8D%E8%A1%A8%E7%A4%BA%20%5B%E4%BB%AE%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/431563/%E3%81%82%E3%81%B7%E3%82%B5%E3%83%A0%E3%83%8D%E8%A1%A8%E7%A4%BA%20%5B%E4%BB%AE%5D.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
    'use strict';

    function copyId(str) {
        const t = document.createElement("textarea");
        t.textContent = str;
        document.body.appendChild(t);
        t.select();
        const result = document.execCommand("copy");
        document.body.removeChild(t)
        return result;
    }

    function getSrc(a) {
        if (/\.(bmp|gif|jpe?g|png|webp)$/i.test(a.href)) {
            return `https://${a.host.replace(/\./g, '-')}.cdn.ampproject.org/ii/w128/s/${a.host}${a.pathname}`;
        }

        const filename = a.innerText;
        const ext = filename.split('.').pop().toLowerCase();
        const filebase = filename.replace(`.${ext}`, '');

        if (/\.(mp4|webm|mov)$/i.test(a.href)) {
            return `https://thumb.openis.ga/images/${filebase}.jpg`;
        }

        const iconUrls = {
            "mov": "data:image/png;base64,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",
            "mp3": "data:image/png;base64,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",
            "mp4": "data:image/png;base64,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",
            "webm": "data:image/png;base64,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",
            "unknown": "data:image/png;base64,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"
        };
        return ext in iconUrls ? iconUrls[ext] : iconUrls.unknown;

    }

    if (!/all\.htm$/.test(location.pathname)) {
        [...document.querySelectorAll('a[href*="src/"]')].splice(0, 50).forEach(a => {
            if (!/\.(bmp|gif|jpe?g|png|webp|webm|mp4|mov)$/i.test(a.href)) return;
            const parent = a.parentNode;
            const filename = a.innerText;
            const ext = filename.split('.').pop().toLowerCase();
            const src = getSrc(a);
            const img = document.createElement('img');
            img.src = src;
            img.height = 72;
            img.style.maxWidth = "256px";
            img.setAttribute("loading", "lazy");
            const btn = document.createElement('a');
            btn.href = "#";
            btn.innerText = "📝 copy";
            btn.onclick = () => {
                copyId(a.href.split('/').pop());
            }
            a.insertBefore(document.createElement('br'), a.firstChild);
            a.insertBefore(img, a.firstChild);
            parent.insertBefore(document.createElement('br'), null)
            parent.insertBefore(btn, null)
        })
    }

    async function showThumbnails(e) {
        document.querySelectorAll("div.thumb").forEach(div => div.remove());
        const tr = await async function () {
            const c = await fetch(`${location.origin}/${location.pathname.split("/")[1]}/all.htm`),
                d = new DOMParser().parseFromString((await c.text()), "text/html");
            try {
                return d.querySelectorAll('tr')
            } catch (a) { }
        }();

        const divMain = document.createElement('div');
        const table = document.querySelector(".files");
        const parent = table.parentNode;
        divMain.className = "thumb";
        parent.insertBefore(divMain, table);
        [...tr].filter(tr => tr.hasAttribute("class") && tr.querySelector('a')).slice(0, 20000).forEach(tr => {
            const a = tr.querySelector('a[href*="src/"]');
            const size = tr.querySelector('.fsz').innerHTML;
            const date = tr.querySelector('.fnw').innerHTML.replace(/^.*\/(\d+\/\d+)\(.*\)([\d:]+).*/, "$1 $2");
            const filename = a.innerText;
            const thumbUrl = getSrc(a);

            const ext = filename.split('.').pop().toLowerCase();
            if (this.onlyVideo && ext !== 'mp4' && ext !== 'webm' && ext !== 'mov') return;

            const div = document.createElement('div');
            const div2 = document.createElement('div');
            const span = document.createElement('span');
            span.innerText = filename;
            const span2 = document.createElement('span');
            span2.innerText = `${size} KB`;
            const span3 = document.createElement('span');
            span3.innerText = date;
            const link = document.createElement('a');
            link.href = a.href;
            link.setAttribute('target', '_blank');
            const center = document.createElement('center');
            const img = document.createElement('img');
            img.src = thumbUrl;
            img.height = img.width = 128;
            img.setAttribute("loading", "lazy");
            img.setAttribute("style", "object-fit: contain");
            const btn = document.createElement('a');
            btn.href = "#";
            btn.innerText = "📝 copy";
            btn.onclick = () => {
                copyId(a.href.split('/').pop());
            }
            div.insertBefore(center, null)
            center.insertBefore(link, null);
            link.insertBefore(div2, null);
            div2.insertBefore(img, null);
            link.insertBefore(span, null);
            center.insertBefore(document.createElement('br'), null);
            center.insertBefore(btn, null);
            center.insertBefore(document.createElement('br'), null);
            center.insertBefore(span2, null);
            center.insertBefore(document.createElement('br'), null);
            center.insertBefore(span3, null);
            div.style.display = "block";
            div.style.float = "left";
            div.style.fontSize = "x-small";
            div.style.margin = "10px";
            divMain.insertBefore(div, null);
        })

        const divDummy = document.createElement('div');
        divDummy.style.clear = "both";
        parent.insertBefore(divDummy, table);

        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }
    }


    document.querySelectorAll(".pagelink").forEach(span => {
        const btn = document.createElement('a');
        btn.href = "#";
        btn.innerText = "[📷]";
        btn.addEventListener('click', { onlyVideo: false, handleEvent: showThumbnails });
        span.insertBefore(btn, null)
    })

    document.querySelectorAll(".pagelink").forEach(span => {
        const btn = document.createElement('a');
        btn.href = "#";
        btn.innerText = "[📼]";
        btn.addEventListener('click', { onlyVideo: true, handleEvent: showThumbnails });
        span.insertBefore(btn, null)
    })
})();