// ==UserScript==
// @name         lanling one-click satisfy
// @namespace    lanling-one-click-satisfy.deuterium.wiki
// @version      2024-12-12
// @description  中文描述内容
// @description:zh-cn  中文描述内容
// @author       You
// @match        http://atxsz.atxsemicon.com/km/review/km_review_main/*
// @icon         http://atxsz.atxsemicon.com/favicon.ico
// @grant        none
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/520868/lanling%20one-click%20satisfy.user.js
// @updateURL https://update.greasyfork.org/scripts/520868/lanling%20one-click%20satisfy.meta.js
// ==/UserScript==

(function () {
    console.log("蓝凌 意见全部满意 by Hydro")
    const button = document.createElement('button');
    button.textContent = '一键满意';
    button.id = 'fixedButton';
    button.style.position = 'fixed';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';
    button.onclick = () => {document.querySelectorAll('input[type="radio"][value="10"]').forEach((radio)=>{radio.checked = true})};
    document.body.appendChild(button);
})();