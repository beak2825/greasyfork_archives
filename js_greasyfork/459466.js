// ==UserScript==
// @name         Cleaner NHK
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes all the clutter from NHK articles and turns it into a purer reading experience. Press F to toggle furigana.
// @author       Digicrest
// @match        https://www3.nhk.or.jp/news/easy/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhk.or.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459466/Cleaner%20NHK.user.js
// @updateURL https://update.greasyfork.org/scripts/459466/Cleaner%20NHK.meta.js
// ==/UserScript==

(function() {
    'use strict';
    removeElements();
    restyleElements();
    removeImagesFromArticle();
    registerFuriganaToggleKey();
    setPageZoom(200);
})();


function removeElements() {
    const elementsToRemove = [
        { name: 'share', selector: 'article > nav > div.share' },
        { name: 'color caution (hide)', selector: '.about-word-color__caution.hide-sp' },
        { name: 'color caution (show)', selector: '.about-word-color__caution.show-sp' },
        { name: 'video', selector: '#js-article-figure' },
        { name: "footer", selector: "#nhkfooter" },
        { name: "about-tab", selector: '#easy-wrapper > header > div.header-about-easy.js-accordion-wrapper' },
        { name: "sidebar", selector: "#easy-wrapper > div.l-container > aside" },
        { name: "header", selector: "#nhkheader" },
        { name: "header 2", selector: "#easy-wrapper > header" },
        { name: "original furigana toggle", selector: "#js-article-date" },
        { name: "survey", selector: "#easy-wrapper > div.l-container > main > section.enquete" },
        { name: "toggle colors", selector: "#easy-wrapper > div.l-container > main > article > div.article-main__colors" },
        { name: "tools container", selector: "#easy-wrapper > div.l-container > main > article > div.article-main__tools" },
        { name: "article navigation", selector: "#easy-wrapper > div.l-container > main > article > nav" },
    ];

    elementsToRemove.forEach(element => {
        const elementToRemove = document.querySelector(element.selector);

        if (elementToRemove) {
            elementToRemove.remove();
        } else {
            console.warn(`Element ${element.name} not found`);
        }
    });
}
function restyleElements() {
    const elementsToRestyle = [
        {
            name: "html",
            selector: "html",
            style: {
                "min-height": "100vh",
                "display": "flex",
            }
        },
        {
            name: "body",
            selector: "body",
            style: {
                "flex": "1",
                "max-width": "1080px",
                "margin": "0 auto",
                "font-family": "system-ui"
            }
        },
        {
            name: "main",
            selector: "#easy-wrapper .l-main",
            style: {
                "max-width": "none",
                "padding": "2em",
            }
        },
        {
            name: "container",
            selector: "#easy-wrapper .l-container",
            style: {
                "width": "auto",
                "padding": "0",
                "margin": "0",
            }
        },
        {
            name: "title",
            selector: "#easy-wrapper .article-main__title",
            style: {
                "padding": "0",
                "line-height": "1em",
                "font-family": "none",
                "text-align": "center",
                "font-size": "1.5em",
                "color": "#888"
            }
        },
        {
            name: "date",
            selector: "#easy-wrapper .article-main__date",
            style: {
                "text-align": "center",
                "-webkit-touch-callout": "none",
                "-webkit-user-select": "none",
                "-khtml-user-select": "none",
                "-moz-user-select": "none",
                "-ms-user-select": "none",
                "user-select": "none",
            }
        },
        {
            name: "colored text",
            selector: "#easy-wrapper :is(.colorN, .colorL, .colorC)",
            style: {
                "font-weight": "normal"
            },
            multiple: true
        }
    ];

    const restyleElement = (originalElement, newElement) => {
        if (originalElement && newElement) {
            Object.assign(originalElement.style, newElement.style);
        };
    };

    elementsToRestyle.forEach(element => {
        if (element.hasOwnProperty('multiple') && element.multiple) {
            const elementsToRestyle = document.querySelectorAll(element.selector);
            elementsToRestyle.forEach(elementToRestyle => restyleElement(elementToRestyle, element));
        } else {
            const elementToRestyle = document.querySelector(element.selector);
            restyleElement(elementToRestyle, element)
        };
    });
};

function registerFuriganaToggleKey(toggleKey="f") {
     const wrapper = document.querySelector("#easy-wrapper");

    if (wrapper) {
        document.addEventListener("keydown", (event) => {
            if (event.key === toggleKey) {
                wrapper.classList.toggle("is-no-ruby"); // toggle furigana
            }
        });
    } else {
        console.warn('No Wrapper found for #easy-wrapper');
    }
}
function removeImagesFromArticle() {
    const images = document.querySelectorAll("#js-article-body img");
    images.forEach(image => { image.remove(); });
}
function setPageZoom(percentage=100) {
    document.querySelector("body").style.zoom = `${percentage}%`;
}