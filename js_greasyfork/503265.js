// ==UserScript==
// @name        mikanani过滤搜索链接
// @namespace   Violentmonkey Scripts
// @match       https://mikanani.me/*
// @grant       none
// @version     1.0
// @author      -
// @description 2024/8/11 12:57:21
// @run-at      document-body
// @license 111
// @downloadURL https://update.greasyfork.org/scripts/503265/mikanani%E8%BF%87%E6%BB%A4%E6%90%9C%E7%B4%A2%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/503265/mikanani%E8%BF%87%E6%BB%A4%E6%90%9C%E7%B4%A2%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
const titleElementClass = '.magnet-link-wrap';

const input = document.createElement('input');
const statusDiv = document.createElement('div');
const style1 = document.createElement('style');
document.body.appendChild(input);
document.body.appendChild(statusDiv);
document.body.appendChild(style1);


input.style = `
position: fixed;
    left: 10px;
    bottom: 0px;
    z-index: 999;
    width: 400px;
`;
statusDiv.style = `
position: fixed;
    left: 400px;
    bottom: 0px;
    z-index: 999;
    width: 200px;
    height: 40px;
    background-color: antiquewhite;
`;

style1.innerHTML = `
::highlight(type-a) {
    color: red;
    background-color: bisque;
}
`;


const highlight1 = new Highlight();
CSS.highlights.set(`type-a`, highlight1);

input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const allLinks = document.querySelectorAll(titleElementClass);
        const str = e.target.value;
        const matchedLinks = [...allLinks].filter(a => {
            return a.innerText.includes(str);
        });
        console.log(matchedLinks)
        const actualLinks = matchedLinks.map(a => a.nextElementSibling.dataset['clipboardText']);
        console.log('=== actualLinks', actualLinks)
        navigator.clipboard.writeText(actualLinks.join('\n'));
        statusDiv.innerHTML = `已复制 ${actualLinks.length}`
    } else {
        highlight1.clear();

        const allLinks = document.querySelectorAll(titleElementClass);
        const str = e.target.value;
        const matchedLinks = [...allLinks].filter(a => {
            return a.innerText.includes(str);
        });

        matchedLinks.forEach(a => {
            const range = new Range();
            const start = Math.max(a.innerText.indexOf(str), 0);
            range.setStart(a.firstChild, start);
            range.setEnd(a.firstChild, start + str.length);
            highlight1.add(range);
        });

    }
});




