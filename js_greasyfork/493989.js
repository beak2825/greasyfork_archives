// ==UserScript==
// @name         fixupx copy to clipboard button
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  add a copy to clipboard button to X posts that set it to fixupx.com instead of twitter.com
// @author       Sickerine
// @license      MIT
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493989/fixupx%20copy%20to%20clipboard%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/493989/fixupx%20copy%20to%20clipboard%20button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function apply(article) {
        if (article.tagName == 'DIV')
            article = article.querySelector('article') || article.closest('article');
        if (article.querySelector('.customCopyButton')) return;
        if (!article) return;
        try {
            const SVGStyle = `
                width="18"
                height="18"
                fill="rgb(113, 118, 123)"
            `
            const defaultSVG = `
                <svg
                    ${SVGStyle}
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>`

            const clickedSVG = `
            <svg
            ${SVGStyle}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM305 273L177 401c-9.4 9.4-24.6 9.4-33.9 0L79 337c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L271 239c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>

            `

            const firstIcon = article.querySelector('[aria-label="More"]');
            const sixthParent = firstIcon?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
            if (!sixthParent) return;
            article.classList.add('marked');
            const secondChild = sixthParent.children[1];
            const newDiv = document.createElement('div');
            newDiv.classList.add('customCopyButton');
            newDiv.style.marginLeft = 'auto';
            newDiv.style.marginRight = '4px';
            newDiv.style.cursor = 'pointer';
            newDiv.style.display = 'flex';
            newDiv.innerHTML = defaultSVG;
            newDiv.onclick = (e) => {
                e.preventDefault();
                let href = article.querySelector('a[href*="/status/"]').href;
                href = href.replace(/\/status\/(\d+).*/, '/status/$1')
                    .replace('twitter.com', 'fixupx.com')
                    .replace('x.com', 'fixupx.com');
                newDiv.innerHTML = clickedSVG;
                setTimeout(() => {
                    newDiv.innerHTML = defaultSVG;
                }, 1000);
                navigator.clipboard.writeText(href).then(() => {
                    console.log('Copied to clipboard: ' + href);
                }, (err) => {
                    console.error('Failed to copy to clipboard: ' + href, err);
                });
            };
            sixthParent.insertBefore(newDiv, secondChild);
        }
        catch (e) {
            console.error(e);
            console.log(article)
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName == 'ARTICLE' && node || node.tagName == 'DIV' && (node.querySelector('article') || node.closest('article'))) {
                    apply(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();