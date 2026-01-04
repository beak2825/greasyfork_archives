// ==UserScript==
// @name         整理資訊
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  整理 Pixiv 資訊
// @author       BeenYan
// @match        https://www.pixiv.net/artworks/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        GM_addStyle
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/475817/%E6%95%B4%E7%90%86%E8%B3%87%E8%A8%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/475817/%E6%95%B4%E7%90%86%E8%B3%87%E8%A8%8A.meta.js
// ==/UserScript==

GM_addStyle(`
#ctm-info {
    width: 100%;
    height: 13rem;
    color: #eee;
    background: #1F1F1F;
}
`);

function setContent(node) {
    const title = document.querySelector('h1').textContent;
    const content = [...document.querySelector('h1').nextElementSibling.children[0].children[0].childNodes].map(node => node.nodeName === 'BR'? '\n': node.textContent).join('');
    const tag = [...document.querySelectorAll('.gtm-new-work-tag-event-click')].map(x => '#' + x.text).join(' ');

    node.value = `${title}\n\n${content}\n\n${tag}`;
}

(() => {
    const textArea = document.createElement('textarea');
    textArea.id = 'ctm-info';

    const observer = new MutationObserver(() => setContent(textArea));
    const asideObserver = new MutationObserver((mutations, owner) => {
        let image = document.querySelector('.gtm-expand-full-size-illust');
        if (image === null) return;

        console.log('Watch start', image);
        observer.observe(image, {
            childList: true,
            attributes: true,
        });

        const sections = document.querySelectorAll('section');
        setContent(textArea);
        sections[sections.length - 2].append(textArea);
        asideObserver.disconnect();
    });

    asideObserver.observe(document.body, { childList: true });
})();