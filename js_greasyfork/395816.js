// ==UserScript==
// @name         InoReader embed current article
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  restores the recently-removed (jan 29, 2020 (v13)) functionality to embed the full article page using the q shortcut-key
// @author       You
// @match        https://www.inoreader.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395816/InoReader%20embed%20current%20article.user.js
// @updateURL https://update.greasyfork.org/scripts/395816/InoReader%20embed%20current%20article.meta.js
// ==/UserScript==

const injectStyle = () => {
    const style = `
        .overlayContainer {
            width: 100vw;
            height: 100vh;
            background-color: rgba(0,0,0,0);
            position: absolute;
            cursor: pointer;
            z-index: 99999;
        }

        .embedOverlay {
            position: absolute;
            z-index: 999999;
            background-color: #484848;
            width: 90%;
            height: 95%;
            top: -100%;
            left: 5%;
            box-shadow: black 0px 0px 20px;
            -webkit-animation: slide 0.5s forwards;
            animation: slide 0.5s forwards;
        }

        @-webkit-keyframes slide {
            100% { top: 2.5%; }
        }

        @keyframes slide {
            100% { top: 2.5%; }
        }

        .closeControl {
            position: absolute;
            z-index: 9999999;
            cursor: pointer;
            right: 30px;
            top: 13px;
            font-size: 30px;
            background-color: white;
            border: 1px solid black;
            padding: 0 5px;
            box-shadow: black 0 0 3px;
        }

        .articleEmbed {
            width: 100%;
            height: calc(100% - 25px);
            height: 100%;
        }
    `;
    const injectedStyle = document.createElement(`style`);
    injectedStyle.innerHTML = style;
    document.body.appendChild(injectedStyle);
};

const hideOverlay = () => {
    document.body.removeChild(document.querySelector(`.overlayContainer`));
}

const showOverlay = () => {
    let selectedArticle;
    document.querySelectorAll(`.article_current a`).forEach(a => {
        if (!selectedArticle && a.href.startsWith(`http`)) {
            selectedArticle = a;
        }
    });
    if (!selectedArticle) {
        alert(`Cannot open embed article, because there is no active article selected`);
        return;
    }

    const overlayContainerElement = document.createElement(`div`);
    overlayContainerElement.className = `overlayContainer`;
    overlayContainerElement.onclick = hideOverlay;

    const overlayElement = document.createElement(`div`);
    overlayElement.className = `embedOverlay`;

    const closeElement = document.createElement(`div`);
    closeElement.className = `closeControl`;
    closeElement.onclick = (e) => { e.stopPropagation(); hideOverlay(); };
    closeElement.innerText = `⨯`;

    const iframeElement = document.createElement(`iframe`);
    iframeElement.className = `articleEmbed`;
    iframeElement.src = selectedArticle.href.replace(`http:`, `https:`);

    overlayElement.appendChild(closeElement);
    overlayElement.appendChild(iframeElement);
    overlayContainerElement.appendChild(overlayElement);

    document.body.insertBefore(overlayContainerElement, document.body.childNodes[0]);
}

const checkKey = (e) => {
    if (document.activeElement.tagName == 'TEXTAREA') {
        return;
    }
    if (event.keyCode == 81 && !event.ctrlKey && !event.shiftKey) { // q
        if (!document.querySelector(`.overlayContainer`)) {
            showOverlay();
        } else {
            hideOverlay();
        }
    }
}

const init = () => {
    injectStyle();
    document.addEventListener("keydown", checkKey);
};

init();