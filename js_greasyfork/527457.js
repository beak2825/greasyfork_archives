// ==UserScript==
// @name            TruyenFull downloader
// @name:vi         TruyenFull downloader
// @namespace       https://baivong.github.io/
// @description     Tải truyện từ TruyenFull định dạng EPUB.
// @description:vi  Tải truyện từ TruyenFull định dạng EPUB.
// @version         4.7.1
// @icon            https://i.imgur.com/FQY8btq.png
// @author          Maivl
// @oujs:author     Maivl
// @license         MIT; https://baivong.mit-license.org/license.txt
// @match           https://sstruyen.vn/*
// @require         https://code.jquery.com/jquery-3.6.3.min.js
// @require         https://unpkg.com/jszip@3.1.5/dist/jszip.min.js
// @require         https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @require         https://unpkg.com/ejs@2.7.4/ejs.min.js
// @require         https://unpkg.com/jepub@2.1.4/dist/jepub.min.js
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js?v=a834d46
// @noframes
// @connect         self
// @connect         8cache.com
// @supportURL      https://github.com/lelinhtinh/Userscript/issues
// @run-at          document-idle
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/527457/TruyenFull%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/527457/TruyenFull%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function fetchText(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: response => resolve(response.responseText),
                onerror: () => reject(`Lỗi tải: ${url}`)
            });
        });
    }

    async function getChapterList() {
        const doc = new DOMParser().parseFromString(await fetchText(location.href), "text/html");
        return [...doc.querySelectorAll(".list-chapter li a")].map(a => ({
            title: a.textContent.trim(),
            url: a.href
        }));
    }

    async function fetchChapterContent(chapter) {
        const doc = new DOMParser().parseFromString(await fetchText(chapter.url), "text/html");
        const content = doc.querySelector(".chapter-c")?.innerHTML.replace(/<[^>]*>/g, '') || "[Lỗi tải nội dung]";
        return `\n\n${chapter.title}\n${"=".repeat(50)}\n${content}`;
    }

    async function downloadNovel() {
        alert("Bắt đầu tải truyện, vui lòng chờ...");
        const chapters = await getChapterList();
        const contents = await Promise.all(chapters.map(fetchChapterContent));
        
        const blob = new Blob([contents.join("\n")], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = document.title.replace(/\s+/g, "_") + ".txt";
        link.click();
    }

    const btn = document.createElement("button");
    btn.textContent = "📥 Tải Truyện";
    btn.style.cssText = "position:fixed;top:10px;right:10px;padding:10px;background:#ff5722;color:white;border:none;cursor:pointer;z-index:1000;";
    btn.onclick = downloadNovel;
    document.body.appendChild(btn);
})();
