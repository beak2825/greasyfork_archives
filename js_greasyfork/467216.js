// ==UserScript==
// @name          预览Quicker链接
// @description  支持动作库，讨论区，子程序
// @namespace    HDG520
// @version      1.3
// @match    https://getquicker.net/QA
// @match    https://getquicker.net/Share/*
// @match    https://getquicker.net/Member/MyShare*
// @match    https://getquicker.net/Member/MyFavor
// @icon          https://files.getquicker.net/_icons/5E5C8C35FDA9E28D6E35D9C7E4EAA498A6069306.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/467216/%E9%A2%84%E8%A7%88Quicker%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/467216/%E9%A2%84%E8%A7%88Quicker%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

let previewWindow = null;
let isExpanded = false;
let FIRST_URI = '';
const WIDTH_PERCENT_EXPANDED = '50%';
const WIDTH_PERCENT_COLLAPSED = '0';
const HEIGHT_PERCENT = '100%';
const BUTTON_WIDTH_PERCENT = '1%';
const HOVER_TIME = 800;
const TRANSITION_SPEED = '0.5s';



if (window.location.href === 'https://getquicker.net/QA') {
    FIRST_URI = document.querySelector("body > div.body-wrapper > div > div.row.body.mt-0.pt-0 > div.col-12.col-md-10 > div.question-list > div:nth-child(7) > div.flex-grow-1.ml-1.d-flex.flex-column.justify-content-between > div:nth-child(1) > div > div.mt-0.question-title > a").href;
} else if (window.location.href.startsWith('https://getquicker.net/Share/SubPrograms')) {
    FIRST_URI = document.querySelector("body > div.body-wrapper > div > div > div > div.row.align-items-stretch > div.col-12.col-md-9.col-lg-10.font14 > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(2) > div > div > a.subprogram-title").href;
} else if (window.location.href.startsWith('https://getquicker.net/Share')) {
    FIRST_URI = document.querySelector("body > div.body-wrapper > div > div > div:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(2) > div > div > a").href;
} else if(window.location.href.startsWith("https://getquicker.net/Member/MyShare")) {
    FIRST_URI = document.querySelector("body > div.body-wrapper > div.container.mb-5.main > div.row > div > table > tbody > tr:nth-child(2) > td:nth-child(2) > a:nth-child(1)").href;
} else if(window.location.href === "https://getquicker.net/Member/MyFavor") {
    FIRST_URI = document.querySelector("body > div.body-wrapper > div.container.mb-5.main > div.row > div > div.pb-4 > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2) > div > div > a").href;
}

GM_addStyle(`
    #link-preview-window {
        position: fixed;
        top: 0;
        bottom: 0;
        width: ${WIDTH_PERCENT_EXPANDED};
        height: ${HEIGHT_PERCENT};
        right: -${WIDTH_PERCENT_COLLAPSED};
        background-color: white ;
        z-index: 9999;
        border: none;
        transition: width ${TRANSITION_SPEED} ease-in-out;
    }

    #preview-button {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        height: 15px;
        width: ${BUTTON_WIDTH_PERCENT};
        right: ${WIDTH_PERCENT_COLLAPSED};
        background-color: none;
        border: none;
        z-index: 9999;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        transition: right ${TRANSITION_SPEED} ease-in-out;
    }

    #preview-button:hover {
        background-color: none;
    }

    #preview-button.expanded::before {
        content: '▶';
    }

    #preview-button:not(.expanded)::before {
        content: '◀';
    }
`);

function createPreviewWindow() {
    previewWindow = document.createElement('div');
    previewWindow.id = 'link-preview-window';
    previewWindow.innerHTML = `<iframe frameborder="0" height="100%" width="100%" src="${FIRST_URI}"></iframe>`;
    document.body.appendChild(previewWindow);
    cleanBottom();


}

function togglePreviewWindow() {
    if (!previewWindow) {
        createPreviewWindow();
    }
    isExpanded = !isExpanded;

    previewWindow.style.width = isExpanded ? WIDTH_PERCENT_EXPANDED : WIDTH_PERCENT_COLLAPSED;
    document.getElementById('preview-button').style.right = isExpanded ? WIDTH_PERCENT_EXPANDED : WIDTH_PERCENT_COLLAPSED;
    document.getElementById('preview-button').classList.toggle('expanded', isExpanded);
}
function cleanBottom() {
    var previewIframe = previewWindow.querySelector('iframe');
    previewIframe.onload = () => {
        var a = previewIframe.contentDocument.querySelector('body > div.footer');
        var b = previewIframe.contentDocument.querySelector("#vue-app > div.row.font14 > div.col-lg-3.pt-3.bg-light.column-border.pb-4")
        if (a) {
            a.remove();
        }
        if(b){
            b.remove();
        }
    }
}
function updatePreviewWindow(url) {
    if (isExpanded && previewWindow) {
        previewWindow.innerHTML = `<iframe frameborder="0" height="100%" width="100%" src="${url}"></iframe>`;
        cleanBottom();
    }
}

let timeoutId = null;
document.addEventListener('mouseover', (event) => {
    clearTimeout(timeoutId);
    var uri = event.target.hrefurl
    if (event.target.tagName.toLowerCase() === 'a' && previewWindow.innerHTML.indexOf(event.target.href) === -1) {
        timeoutId = setTimeout(() => {
            updatePreviewWindow(event.target.href);
        }, HOVER_TIME);
    }
});

document.addEventListener('mouseout', () => {
    clearTimeout(timeoutId);
});

const previewButton = document.createElement('div');
previewButton.id = 'preview-button';
previewButton.onclick = togglePreviewWindow;

document.querySelector('body > div.body-wrapper > div > div').appendChild(previewButton);

window.addEventListener('resize', () => {
    if (isExpanded) {
        document.getElementById('preview-button').style.right = WIDTH_PERCENT_EXPANDED;
    }
});