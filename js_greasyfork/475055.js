// ==UserScript==
// @name         一个脚本
// @namespace    j
// @version      0.0.1
// @description  用于生成amzn-jp信息
// @author       JDWLL123
// @license      MIT
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.primevideo.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475055/%E4%B8%80%E4%B8%AA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/475055/%E4%B8%80%E4%B8%AA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    "use strict";
    let jsonArray = []

    const targetElement = document.querySelector('h1[data-automation-id="title"]');
    const movieName = targetElement.textContent.trim();

    const floatingButton = document.createElement('button');
    floatingButton.innerHTML = '下载 JSON';
    floatingButton.style.position = 'fixed';
    floatingButton.style.left = '10px';
    floatingButton.style.top = '50%';
    floatingButton.style.transform = 'translateY(-50%)';
    floatingButton.style.backgroundColor = '#0033cc';
    floatingButton.style.color = '#fff';
    floatingButton.style.padding = '10px 20px';
    floatingButton.style.cursor = 'pointer';
    floatingButton.style.zIndex = '9999';
    floatingButton.style.borderRadius = '50%';
    floatingButton.style.width = '80px';
    floatingButton.style.height = '80px';
    floatingButton.style.border = 'none';
    // 添加按钮到页面
    document.body.appendChild(floatingButton);

    const buttonPattern = /显示全部 \d+ 集/;
    const buttons = document.querySelectorAll('span');

    buttons.forEach(button => {
        const buttonText = button.textContent.trim();
        if (buttonPattern.test(buttonText)) {
            button.click();
        }
    });

    floatingButton.addEventListener('click', downloadJSON);

    let style = document.createElement("style");
    let styleText = document.createTextNode(`
.x-episode-asin {
    margin: 0.5em 0;
    color: #ff0000;
}

.x-page-asin {
    margin: 0.5em 0 1em 0;
    color: #ff0000;
}`);
    style.appendChild(styleText);
    document.head.appendChild(style);

    function addTitleASIN() {
        // Movie/series ASIN
        let asin = document.body.innerHTML.match(/"pageTitleId":"([^"]+)"/)[1];

        let asinEl = document.createElement("div");
        let text = document.createTextNode(asin);
        asinEl.className = "x-page-asin";
        asinEl.appendChild(text);

        let after = document.querySelector(".dv-dp-node-synopsis, .av-synopsis");
        after.parentNode.insertBefore(asinEl, after.nextSibling);
    }

    function addEpisodeASINs() {
        // Episode ASINs
        document.querySelectorAll("[id^='selector-'], [id^='av-episode-expand-toggle-']").forEach(el => {
            if (el.parentNode.querySelector(".x-episode-asin")) {
                // Already added ASIN
                return;
            }

            let asin = el.id.replace(/^(?:selector|av-episode-expand-toggle)-/, "");

            let asinEl = document.createElement("div");
            let text = document.createTextNode(asin);
            asinEl.className = "x-episode-asin";
            asinEl.appendChild(text);

            let epTitle = el.parentNode.querySelector("[data-automation-id^='ep-title']");
            const regex = /第 (\d+) 季第 (\d+) 集 - (.+)/;
            const match = epTitle.innerText.match(regex);
            const seasonNumber = match[1]; // 季数
            const episodeNumber = match[2]; // 集数
            const title = match[3].replace('Downloads','');
            const jsonObject = {
                movieName: movieName,
                asin: asin,
                season: seasonNumber,
                episode: episodeNumber,
                title: title
            };
            jsonArray.push(jsonObject);
            epTitle.parentNode.insertBefore(asinEl, epTitle.nextSibling);
            console.log(jsonObject)
        });
    }

    function downloadJSON() {
        const jsonString = JSON.stringify(jsonArray, null, 2);

        const blob = new Blob([jsonString], { type: 'application/json' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    addTitleASIN();
    // HACK: Using setTimeout() seems to prevent the ASIN from disappearing
    // Making it 100ms instead of 0ms seems to fix a weird episode duplication bug
    setTimeout(addEpisodeASINs, 100);

    new MutationObserver(function (mutationsList, observer) {
        setTimeout(addEpisodeASINs, 100);
    }).observe(document.body, { childList: true, subtree: true });
}());