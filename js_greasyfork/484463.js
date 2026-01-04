// ==UserScript==
// @name         ChatGPT to PDF by PDFCrowd
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Turn your chats into neatly formatted PDF.
// @author       PDFCrowd (https://pdfcrowd.com/)
// @match        https://chatgpt.com/*
// @match        https://chat.com/*
// @icon64       https://github.com/pdfcrowd/save-chatgpt-as-pdf/raw/master/icons/icon64.png
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      api.pdfcrowd.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484463/ChatGPT%20to%20PDF%20by%20PDFCrowd.user.js
// @updateURL https://update.greasyfork.org/scripts/484463/ChatGPT%20to%20PDF%20by%20PDFCrowd.meta.js
// ==/UserScript==
/* globals pdfcrowdChatGPT */

// do not modify or delete the following line, it serves as a placeholder for
// the common.js contents which is copied here by "make build-userscript-single-file"
//
// shared.js placeholder
'use strict';

const pdfcrowdShared = {};

pdfcrowdShared.defaultOptions = {
    margins: '',
    theme: '',
    zoom: 100,
    no_questions: false,
    q_color: 'default',
    q_color_picker: '#ecf9f2',
    q_fg_color: 'default',
    q_fg_color_picker: '#000',
    title_mode: '',
    margin_left: '0.4in',
    margin_right: '0.4in',
    margin_top: '0.4in',
    margin_bottom: '0.4in',
    page_break: '',
    toc: '',
    no_icons: false,
    model_name: false,
    datetime_format: 'none',
    q_align: 'justified',
    q_rounded: false
}

pdfcrowdShared.version = 'v3.6';

pdfcrowdShared.rateUsLink = '#';
pdfcrowdShared.hasOptions = true;
if (typeof GM_info !== 'undefined') {
    pdfcrowdShared.rateUsLink = 'https://greasyfork.org/en/scripts/484463-save-chatgpt-as-pdf/feedback#post-discussion';
    pdfcrowdShared.hasOptions = false;
} else if (navigator.userAgent.includes('Edg/')) {
    pdfcrowdShared.rateUsLink = 'https://microsoftedge.microsoft.com/addons/detail/save-chatgpt-as-pdf/fjlfcopnobjbkjiclieaopipchijelmj';
} else if (navigator.userAgent.includes("Chrome")) {
    pdfcrowdShared.rateUsLink = 'https://chromewebstore.google.com/detail/save-chatgpt-as-pdf/ccjfggejcoobknjolglgmfhoeneafhhm/reviews';
} else if (navigator.userAgent.includes("Firefox")) {
    pdfcrowdShared.rateUsLink = 'https://addons.mozilla.org/en-US/firefox/addon/save-chatgpt-as-pdf/reviews/';
}

pdfcrowdShared.helpContent = `
<div class="pdfcrowd-help-content">
<div class="pdfcrowd-category-title">
    Support
</div>

<div style="line-height:1.5">
    Feel free to contact us with any questions or for assistance. We're always happy to help!
    <br>
    Email us at <strong>support@pdfcrowd.com</strong> or use our
    <a href="https://pdfcrowd.com/contact/?ref=chatgpt&amp;pr=save-chatgpt-as-pdf-pdfcrowd" title="Contact us" target="_blank">
        contact form</a>.
    <br>
    <span class="popup-hidden">
    Please <a href="${pdfcrowdShared.rateUsLink}">rate us</a> if you like the extension. It helps a lot!
    </span>
</div>

<div class="pdfcrowd-category">
  <div class="pdfcrowd-category-title">
    Note
  </div>
  <div>
    All generated PDFs include a banner which cannot be removed.
    <br>
    Purchasing a PDFCrowd license does not remove the banner.
  </div>
</div>


<div class="pdfcrowd-category">
    <div class="pdfcrowd-category-title">
        Tips
    </div>
    <ul>
        <li>
            You can download a specific part of the chat by selecting it.
        </li>
        <li>
            If images are missing in the PDF, reload the page and try downloading the PDF again.
        </li>
        <li>
            Customize the PDF file via addon
            <a class="options-link">options</a>.
        </li>
    </ul>
</div>

<div class="pdfcrowd-category">
    <div class="pdfcrowd-category-title">
        Links
    </div>
    <ul>
        <li>
            ChatGPT to PDF by PDFCrowd
            <a href="https://pdfcrowd.com/save-chatgpt-as-pdf/" target="_blank">homepage</a>
        </li>
        <li>
            Visit <a href="https://pdfcrowd.com/" target="_blank">PDFCrowd</a>
            to learn more about our tool and services.
        </li>
        <li>
            Discover how our
            <a href="https://pdfcrowd.com/api/html-to-pdf-api/" target="_blank">HTML to PDF API</a>
            can enhance your projects.
        </li>
    </ul>
</div>
</div>
`;

pdfcrowdShared.getOptions = function(callback) {
    if(typeof chrome === 'undefined') {
        callback(pdfcrowdShared.defaultOptions);
    } else {
        try {
            chrome.storage.sync.get('options', function(obj) {
                let rv = {};
                Object.assign(rv, pdfcrowdShared.defaultOptions);
                if(obj.options) {
                    Object.assign(rv, obj.options);
                }
                callback(rv);
            });
        } catch(error) {
            console.error(error);
            callback(pdfcrowdShared.defaultOptions);
        }
    }
}

function init() {
    let elem = document.getElementById('version');
    if(elem) {
        elem.innerHTML = pdfcrowdShared.version;
    }

    elem = document.getElementById('help');
    if(elem) {
        elem.innerHTML = pdfcrowdShared.helpContent;
    }
}

document.addEventListener('DOMContentLoaded', init);
// common.js placeholder
const pdfcrowdChatGPT = {};

pdfcrowdChatGPT.pdfcrowdAPI = 'https://api.pdfcrowd.com/convert/24.04/';
pdfcrowdChatGPT.username = 'chat-gpt';
pdfcrowdChatGPT.apiKey = '29d211b1f6924c22b7a799b4e8fecb7e';

pdfcrowdChatGPT.init = function() {
    if(document.querySelectorAll('.pdfcrowd-convert').length > 0) {
        // avoid double init
        return;
    }

    // remote images live at least 1 minute
    const minImageDuration = 60000;

    const buttonIconFill = (typeof GM_xmlhttpRequest !== 'undefined')
        ? '#A72C16' : '#EA4C3A';

    const blockStyle = document.createElement('style');
    blockStyle.textContent = `
 .pdfcrowd-block {
     position: fixed;
     height: 36px;
     top: 10px;
     right: 180px;
 }

 @media (max-width: 767px) {
     .pdfcrowd-lg {
         display: none;
     }

     .pdfcrowd-sm {
         display: block;
     }
 }

 .pdfcrowd-lg {
     display: block;
 }

 .pdfcrowd-sm {
     display: none;
 }

 .pdfcrowd-btn-smaller .pdfcrowd-lg {
     display: none;
 }

 .pdfcrowd-btn-smaller .pdfcrowd-sm {
     display: block;
 }

 .pdfcrowd-btn-smallest .pdfcrowd-lg, .pdfcrowd-btn-smallest .pdfcrowd-sm {
     display: none;
 }

 .pdfcrowd-btn-xs-small .pdfcrowd-lg, .pdfcrowd-btn-xs-small .pdfcrowd-sm {
     display: none;
 }

 .pdfcrowd-btn-xs-small .btn-small {
     background: none;
     border: none;
 }

 .pdfcrowd-btn-xs-small svg {
     margin: 0;
 }

 svg.pdfcrowd-btn-content {
     width: 1rem;
     height: 1rem;
 }

 #pdfcrowd-convert-main {
     padding-right: 0;
 }

 #pdfcrowd-convert-main:disabled {
     cursor: wait;
     filter: none;
     opacity: 1;
 }

 .pdfcrowd-dropdown-arrow::after {
     display: inline-block;
     width: 0;
     height: 0;
     vertical-align: .255em;
     content: "";
     border-top: .3em solid;
     border-right: .3em solid transparent;
     border-bottom: 0;
     border-left: .3em solid transparent;
 }

 .pdfcrowd-fs-small {
     font-size: 14px;
     line-height: 1.25rem;
 }

 #pdfcrowd-more {
     cursor: pointer;
     padding: .5rem;
     border-top-right-radius: .5rem;
     border-bottom-right-radius: .5rem;
 }

 #pdfcrowd-more:hover {
     background-color: rgba(0,0,0,.1);
 }

 #pdfcrowd-extra-btns {
     border: 1px solid rgba(0,0,0,.1);
     background-color: #fff;
     color: #000;
 }

 .pdfcrowd-extra-btn:hover {
     background-color: rgba(0,0,0,.1);
 }

 .pdfcrowd-extra-btn {
     width: 100%;
     text-align: start;
     display: block;
 }

 .pdfcrowd-hidden {
     display: none;
 }

 #pdfcrowd-spinner {
     position: absolute;
     width: 100%;
     height: 100%;
 }

 .pdfcrowd-spinner {
     border: 4px solid #ccc;
     border-radius: 50%;
     border-top: 4px solid #ffc107;
     width: 1.5rem;
     height: 1.5rem;
     -webkit-animation: spin 1.5s linear infinite;
     animation: spin 1.5s linear infinite;
 }

 @-webkit-keyframes spin {
     0% { -webkit-transform: rotate(0deg); }
     100% { -webkit-transform: rotate(360deg); }
 }

 @keyframes spin {
     0% { transform: rotate(0deg); }
     100% { transform: rotate(360deg); }
 }

 .pdfcrowd-invisible {
     visibility: hidden;
 }

 .pdfcrowd-overlay {
     z-index: 10000;
     display: none;
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background: rgba(0, 0, 0, 0.5);
     justify-content: center;
     align-items: center;
     color: #000;
 }

 .pdfcrowd-dialog {
     background: #fff;
     padding: 0;
     margin: 0.5em;
     border-radius: 5px;
     box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
     text-align: start;
 }

 .pdfcrowd-dialog a {
     color: revert;
 }

 .pdfcrowd-dialog-body {
     padding: 0 2em;
     line-height: 2;
 }

 .pdfcrowd-dialog-footer {
     text-align: center;
     margin: .5em;
     position: relative;
 }

 .pdfcrowd-dialog-header {
     background-color: #eee;
     font-size: 1.25em;
     padding: .5em;
     border-top-left-radius: 10px;
     border-top-right-radius: 10px;
 }

 .pdfcrowd-help-content {
     max-width: 660px;
 }

 .pdfcrowd-version {
     position: absolute;
     bottom: 0;
     right: 0;
     font-size: .65em;
     color: #777;
 }

 .pdfcrowd-dialog ul {
     list-style: disc;
     margin: 0;
     padding: 0 0 0 2em;
 }

 .pdfcrowd-close-x {
     cursor: pointer;
     float: right;
     color: #777;
 }

 #pdfcrowd-help {
     cursor: pointer;
 }

 .pdfcrowd-py-1 {
     padding-bottom: 0.25rem;
     padding-top: 0.25rem;
 }

 .pdfcrowd-px-2 {
     padding-left: 0.5rem;
     padding-right: 0.5rem;
 }

 .pdfcrowd-mr-1 {
     margin-right: 0.25rem;
 }

 .pdfcrowd-mr-4 {
     margin-right: 1rem;
 }

 .pdfcrowd-justify-center {
     justify-content: center;
 }

 .pdfcrowd-items-center {
     align-items: center;
 }

 .pdfcrowd-flex {
     display: flex;
 }

 .pdfcrowd-text-left {
     text-align: left;
 }

 .pdfcrowd-text-right {
     text-align: right;
 }

 .pdfcrowd-h-9 {
     height: 2.25rem;
 }

 #pdfcrowd-title {
     margin-top: 1em !important;
     margin-bottom: .5em !important;
     padding: .5em !important;
     border: revert !important;
     visibility: revert !important;
     display: revert !important;
     color: revert !important;
     background: revert !important;
     width: 360px;
     border-radius: 5px;
 }

 .pdfcrowd-category {
     line-height: normal;
     margin-top: 1em;
 }

 .pdfcrowd-category-title {
     font-size: larger;
     font-weight: bold;
 }
`;
    document.head.appendChild(blockStyle);

    const pdfcrowdBlockHtml = `
    <button
        id="pdfcrowd-convert-main"
        type="button"
        role="button"
        tabindex="0"
        aria-label="Save as PDF"
        data-conv-options='{"page_size": "a4"}'
        class="btn btn-secondary btn-small pdfcrowd-h-9 pdfcrowd-convert pdfcrowd-fs-small">
        <svg class="pdfcrowd-mr-1 pdfcrowd-btn-content" version="1.1" viewBox="0 0 30 30" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><polyline clip-rule="evenodd" fill="${buttonIconFill}" fill-rule="evenodd" points="30,30 0,30 0,0 30,0 30,30 "/><path d="M15.372,4.377  c0.452,0.213,0.358,0.489,0.219,1.793c-0.142,1.345-0.618,3.802-1.535,6.219c-0.918,2.413-2.28,4.784-3.467,6.539  c-1.186,1.756-2.201,2.897-2.975,3.556c-0.777,0.659-1.314,0.835-1.665,0.893c-0.348,0.058-0.506,0-0.6-0.177  c-0.094-0.176-0.127-0.466-0.046-0.82c0.079-0.35,0.268-0.76,0.804-1.285c0.541-0.527,1.426-1.172,2.661-1.771  c1.235-0.6,2.817-1.156,4.116-1.537c1.299-0.379,2.311-0.585,3.197-0.746c0.888-0.162,1.647-0.277,2.391-0.337  c0.744-0.056,1.474-0.056,2.186,0c0.712,0.06,1.408,0.175,2.011,0.323c0.6,0.146,1.108,0.321,1.551,0.601  c0.442,0.276,0.823,0.657,1.012,1.083c0.192,0.423,0.192,0.893,0.033,1.228c-0.158,0.337-0.476,0.541-0.839,0.66  c-0.364,0.115-0.775,0.144-1.267,0c-0.49-0.148-1.062-0.47-1.662-0.894c-0.601-0.425-1.235-0.952-2.057-1.771  c-0.824-0.819-1.838-1.93-2.692-3.013c-0.854-1.083-1.553-2.136-2.028-3.029c-0.473-0.893-0.727-1.624-0.933-2.355  c-0.206-0.733-0.364-1.464-0.427-2.122S13.326,6.17,13.39,5.701c0.063-0.466,0.16-0.82,0.317-1.055  c0.158-0.23,0.381-0.35,0.539-0.408s0.254-0.058,0.348-0.073c0.094-0.015,0.188-0.044,0.333,0c0.138,0.042,0.321,0.154,0.504,0.268" fill="none" stroke="#FFFFFF" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.4"/></svg>
        <div class="pdfcrowd-lg pdfcrowd-btn-content">
            Save as PDF
        </div>
        <div class="pdfcrowd-sm pdfcrowd-btn-content">
            PDF
        </div>
        <div id="pdfcrowd-more" class="pdfcrowd-dropdown-arrow">
        </div>
        <div id="pdfcrowd-spinner" class="pdfcrowd-hidden">
            <div class="pdfcrowd-flex pdfcrowd-justify-center pdfcrowd-items-center pdfcrowd-mr-4" style="height: 100%;">
                <div class="pdfcrowd-spinner">
                </div>
            </div>
        </div>
    </button>

    <div id="pdfcrowd-extra-btns" class="pdfcrowd-hidden pdfcrowd-text-left">
        <button
            id="pdfcrowd-extra-a4p"
            type="button"
            role="button"
            tabindex="0"
            aria-label="Save as A4 portrait PDF"
            data-conv-options='{"page_size": "a4"}'
            class="pdfcrowd-extra-btn pdfcrowd-convert pdfcrowd-fs-small pdfcrowd-px-2 pdfcrowd-py-1">
            A4 Portrait
        </button>
        <button
            id="pdfcrowd-extra-a4l"
            type="button"
            role="button"
            tabindex="0"
            aria-label="Save as A4 landscape PDF"
            class="pdfcrowd-extra-btn pdfcrowd-convert pdfcrowd-fs-small pdfcrowd-px-2 pdfcrowd-py-1"
            data-conv-options='{"orientation": "landscape", "viewport_width": 1200, "page_size": "a4"}'>
            A4 Landscape
        </button>
        <button
            id="pdfcrowd-extra-lp"
            type="button"
            role="button"
            tabindex="0"
            aria-label="Save as letter portrait PDF"
            data-conv-options='{"page_size": "letter"}'
            class="pdfcrowd-extra-btn pdfcrowd-convert pdfcrowd-fs-small pdfcrowd-px-2 pdfcrowd-py-1">
            Letter Portrait
        </button>
        <button
            id="pdfcrowd-extra-ll"
            type="button"
            role="button"
            tabindex="0"
            aria-label="Save as letter landscape PDF"
            class="pdfcrowd-extra-btn pdfcrowd-convert pdfcrowd-fs-small pdfcrowd-px-2 pdfcrowd-py-1"
            data-conv-options='{"orientation": "landscape", "viewport_width": 1200, "page_size": "letter"}'>
            Letter Landscape
        </button>
        <button
            id="pdfcrowd-extra-single-a4p"
            type="button"
            role="button"
            tabindex="0"
            aria-label="Save as single page"
            data-conv-options='{"page_height": "-1"}'
            class="pdfcrowd-extra-btn pdfcrowd-convert pdfcrowd-fs-small pdfcrowd-px-2 pdfcrowd-py-1">
            Single Page
        </button>
        <hr>
        <a id="pdfcrowd-options" href="#"
           aria-label="ChatGPT to PDF by PDFCrowd options"
           class="pdfcrowd-extra-btn pdfcrowd-fs-small pdfcrowd-px-2 pdfcrowd-py-1">
            Options
        </a>
        <button
            id="pdfcrowd-help"
            type="button"
            role="button"
            aria-label="ChatGPT to PDF by PDFCrowd help"
            class="pdfcrowd-extra-btn pdfcrowd-fs-small pdfcrowd-px-2 pdfcrowd-py-1">
            Help
        </button>
        <a href="${pdfcrowdShared.rateUsLink}" aria-label="Rate the Extension"
           class="pdfcrowd-extra-btn pdfcrowd-fs-small pdfcrowd-px-2 pdfcrowd-py-1">
            Rate the Extension
        </a>
    </div>

    <div class="pdfcrowd-overlay" id="pdfcrowd-error-overlay">
        <div class="pdfcrowd-dialog">
            <div class="pdfcrowd-dialog-header">
                Error occurred
                <span class="pdfcrowd-close-x pdfcrowd-close-btn">&times;</span>
            </div>
            <div class="pdfcrowd-dialog-body" style="text-align: center;">
                <p id="pdfcrowd-error-message"></p>
            </div>
            <div class="pdfcrowd-dialog-footer">
                <button class="btn btn-secondary pdfcrowd-close-btn">Close</button>
                <div class="pdfcrowd-version">${pdfcrowdShared.version}</div>
            </div>
        </div>
    </div>

    <div class="pdfcrowd-overlay" id="pdfcrowd-title-overlay">
        <div class="pdfcrowd-dialog">
            <div class="pdfcrowd-dialog-header">
                Enter title
                <span class="pdfcrowd-close-x pdfcrowd-close-btn">&times;</span>
            </div>
            <div class="pdfcrowd-dialog-body" style="text-align: center;">
                <input id="pdfcrowd-title" name="pdfcrowd-title-ch" autocomplete="off" autocapitalize="off">
            </div>
            <div class="pdfcrowd-dialog-footer">
                <button id="pdfcrowd-title-convert" class="btn btn-secondary"
                    style="margin-right: .5em">
                    Save PDF
                </button>
                <button class="btn btn-secondary pdfcrowd-close-btn"
                    style="margin-left: .5em">
                    Cancel
                </button>
            </div>
        </div>
    </div>

    <div class="pdfcrowd-overlay" id="pdfcrowd-help-overlay">
        <div class="pdfcrowd-dialog">
            <div class="pdfcrowd-dialog-header">
                ChatGPT to PDF by PDFCrowd
                <span class="pdfcrowd-close-x pdfcrowd-close-btn">&times;</span>
            </div>
            <div class="pdfcrowd-dialog-body">
                ${pdfcrowdShared.helpContent}
            </div>

            <div class="pdfcrowd-dialog-footer">
                <button class="btn btn-secondary pdfcrowd-close-btn">Close</button>
                <div class="pdfcrowd-version">${pdfcrowdShared.version}</div>
            </div>
        </div>
    </div>
`;

    function findRow(element) {
        return element.closest('article');
    }

    function hasParent(element, parent) {
        while(element) {
            if(element === parent) {
                return true;
            }
            element = element.parentElement;
        }
        return false;
    }

    function addImgBase64Src(element) {
        const images = element.querySelectorAll('img');

        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const src = img.getAttribute('src');

            if (!src ||
                !src.startsWith('https://chatgpt.com/backend-api/') ||
                img.hasAttribute('data-pdfcrowd-img-src')) {
                continue;
            }

            // Skip if image is not yet loaded
            if (!img.complete || img.naturalWidth === 0) {
                continue;
            }

            const canvas = document.createElement('canvas');
            canvas.classList.add('pdfcrowd-img-canvas');
            canvas.style.setProperty('display', 'none', 'important');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            img.setAttribute('data-pdfcrowd-img-src', canvas.toDataURL());
        }
    }

    function applyDataSrcBase(element) {
        const images = element.querySelectorAll('img[data-pdfcrowd-img-src]');

        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const dataSrc = img.getAttribute('data-pdfcrowd-img-src');

            if (dataSrc) {
                img.setAttribute('src', dataSrc);
            }
        }
    }

    function prepareSelection(element) {
        addImgBase64Src(element);

        const selection = window.getSelection();
        if(!selection.isCollapsed) {
            const rangeCount = selection.rangeCount;
            if(rangeCount > 0) {
                const startElement = findRow(
                    selection.getRangeAt(0).startContainer.parentElement);
                if(startElement && hasParent(startElement, element)) {
                    // selection is in the main block
                    const endElement = findRow(
                        selection.getRangeAt(
                            rangeCount-1).endContainer.parentElement);

                    const newContainer = document.createElement('main');
                    newContainer.classList.add('h-full', 'w-full');
                    let currentElement = startElement;
                    while(currentElement) {
                        const child_clone = currentElement.cloneNode(true);
                        newContainer.appendChild(child_clone);
                        persistCanvases(currentElement, child_clone);
                        if(currentElement === endElement) {
                            break;
                        }
                        currentElement = currentElement.nextElementSibling;
                    }
                    return newContainer;
                }
            }
        }
        let element_clone = element.cloneNode(true);
        persistCanvases(element, element_clone);
        applyDataSrcBase(element_clone);

        if(element_clone.tagName.toLowerCase() !== 'main') {
            // add main element as it's not presented in a shared chat
            const main = document.createElement('main');
            main.classList.add('h-full', 'w-full');
            main.appendChild(element_clone);
            element_clone = main;
        }
        return element_clone;
    }

    function prepareContent(element) {
        element = prepareSelection(element);

        // fix nested buttons error
        element.querySelectorAll('button button').forEach(button => {
            button.parentNode.removeChild(button);
        });

        // remove scripts, styles, and unnecessary elements
        element.querySelectorAll(
            'script, style, .absolute.z-0, .absolute.z-1, #AIPRM__sidebar'
        ).forEach(el => el.remove());

        // solve expired images
        element.querySelectorAll('.grid img').forEach(img => {
            img.setAttribute(
                'alt', 'The image has expired. Refresh ChatGPT page and retry saving to PDF.');
        });

        element.classList.add('chat-gpt-custom');

        return element;
    }

    function showHelp() {
        document.getElementById('pdfcrowd-extra-btns').classList.add(
            'pdfcrowd-hidden');

        document.getElementById('pdfcrowd-help-overlay').style.display = 'flex';
    }

    function addPdfExtension(filename) {
        return filename.replace(/\.*$/, '') + '.pdf';
    }

    function isLight(body) {
        return window.getComputedStyle(document.body).backgroundColor != 'rgb(33, 33, 33)';
    }

    function isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return (
            style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                element.offsetWidth > 0 &&
                element.offsetHeight > 0 &&
                style.opacity !== '0'
        );
    }

    function styleCanvasArea(element, stop_element) {
        while(element) {
            if(element == stop_element) {
                // canvas parent area not found
                return;
            }

            const style_height = element.style.height;
            if(style_height &&
               style_height !== 'auto' &&
               style_height !== 'initial') {
                element.style.height = '';
                return;
            }

            element = element.parentElement;
        }
    }

    function persistCanvases(orig_element, new_element) {
        const items = [];
        const orig_canvases = orig_element.querySelectorAll('canvas');
        const new_canvases = new_element.querySelectorAll('canvas');
        if(orig_canvases.length !== new_canvases.length) {
            return;
        }
        for(let i = 0; i < orig_canvases.length; i++) {
            const orig_canvas = orig_canvases[i];
            if(isElementVisible(orig_canvas)) {
                const new_canvas = new_canvases[i];
                const img = new_canvas.ownerDocument.createElement('img');
                img.src = orig_canvas.toDataURL();
                img.classList.add('pdfcrowd-canvas-img');
                new_canvas.parentNode.replaceChild(img, new_canvas);

                styleCanvasArea(img, new_element);
            }
        }
    }

    function getTitle() {
        let title = '';
        const chatTitle = document.querySelector(
            `nav a[href="${window.location.pathname}"]`);
        if(chatTitle) {
            // use chat title 1st as it does not contain model name in it
            title = chatTitle.textContent.trim();
        }
        if(!title) {
            const titles = document.getElementsByTagName('title');
            if(titles.length > 0) {
                title = titles[0].textContent.trim();
            }
        }
        return title;
    }

    function applyQuestionStyles(main_clone, options) {
        let questions = null;

        if(options.q_color !== 'default') {
            questions = main_clone.querySelectorAll(
                '[data-message-author-role="user"]');
            const color_val = options.q_color === 'none'
                  ? 'unset' : options.q_color_picker;
            questions.forEach(function(question) {
                question.style.backgroundColor = color_val;
                if(color_val === 'unset') {
                    question.style.paddingLeft = 0;
                    question.style.paddingRight = 0;
                }
            });
        }

        if(options.q_fg_color !== 'default') {
            if(!questions) {
                questions = main_clone.querySelectorAll(
                    '[data-message-author-role="user"]');
            }
            questions.forEach(function(question) {
                question.style.color = options.q_fg_color_picker;
            });
        }
    }

    function getTriggerButton(event) {
        let trigger = event.target;
        if(trigger.id) {
            localStorage.setItem('pdfcrowd-btn', trigger.id);
        } else {
            const lastBtn = localStorage.getItem('pdfcrowd-btn');
            if(lastBtn) {
                const btnElement = document.getElementById(lastBtn);
                if(btnElement) {
                    trigger = btnElement;
                }
            }
        }
        return trigger;
    }

    function applyConversionOptions(data, trigger) {
        const convOptions = JSON.parse(
            trigger.dataset.convOptions || '{}');

        let singlePagePrint = false;
        for(let key in convOptions) {
            const convOptionValue = convOptions[key];
            data[key] = convOptionValue;
            if(key === 'page_height' && convOptionValue === '-1') {
                singlePagePrint = true;
            }
        }

        if(!('viewport_width' in convOptions)) {
            data.viewport_width = 800;
        }

        return singlePagePrint;
    }

    function applyMarginSettings(data, options) {
        switch(options.margins) {
        case 'minimal':
            data.no_margins = true;
            break;
        case 'custom':
            data.margin_left = options.margin_left || 0;
            data.margin_right = options.margin_right || 0;
            data.margin_top = options.margin_top || 0;
            data.margin_bottom = options.margin_bottom || 0;
            break;
        default:
            data.margin_bottom = '12px';
        }
    }

    function buildCssClasses(options, singlePagePrint) {
        let classes = singlePagePrint ? 'pdfcrowd-single-page ' : '';

        if(options.theme === 'dark' ||
           (options.theme === '' && !isLight(document.body))) {
            classes += 'pdfcrowd-dark ';
        }

        if(options.no_questions) {
            classes += 'pdfcrowd-no-questions ';
        }

        if(options.no_icons) {
            classes += 'pdfcrowd-no-icons ';
        }

        if(options.page_break === 'after' && !singlePagePrint) {
            classes += 'pdfcrowd-break-after ';
        }

        if(options.q_align) {
            classes += 'pdfcrowd-q-align-' + options.q_align + ' ';
        }

        if(options.q_rounded) {
            classes += 'pdfcrowd-q-rounded ';
        }

        if(options.toc && !options.no_questions) {
            if(options.toc === 'numbering') {
                classes += 'pdfcrowd-use-toc-numbering ';
            }
        }

        return classes;
    }

    function buildTocHtml(options) {
        if(options.toc && !options.no_questions) {
            return '<div id="pdfcrowd-toc"></div>';
        }
        return '';
    }

    function buildDatetimeHtml(options) {
        if(options.datetime_format &&
            options.datetime_format !== 'none') {
            const now = new Date();
            const datetimeStr =
                  options.datetime_format === 'date_only'
                  ? now.toLocaleDateString()
                  : now.toLocaleString();
            return `<div class="pdfcrowd-datetime">${datetimeStr}</div>`;
        }
        return '';
    }

    function extractModelName(element) {
        function traverse(node) {
            let text = '';

            node.childNodes.forEach(child => {
                let childText = '';
                if (child.nodeType === Node.TEXT_NODE) {
                    childText = child.textContent.trim();
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    childText = traverse(child);
                }

                if(childText) {
                    if(text) {
                        text += ' - ';
                    }
                    text += childText;
                }
            });

            return text;
        }

        return traverse(element).trim();
    }

    function buildModelNameHtml(options) {
        if(options.model_name) {
            const model_el = document.querySelector(
                '#page-header .text-lg');
            if(model_el) {
                return '<div class="pdfcrowd-model-name">' +
                    extractModelName(model_el) +
                    '</div>';
            }
        }
        return '';
    }

    function convert(event) {
        document.getElementById('pdfcrowd-extra-btns').classList.add(
            'pdfcrowd-hidden');

        const btnConvert = document.getElementById(
            'pdfcrowd-convert-main');
        btnConvert.disabled = true;
        const spinner = document.getElementById('pdfcrowd-spinner');
        spinner.classList.remove('pdfcrowd-hidden');
        const btnElems = document.getElementsByClassName(
            'pdfcrowd-btn-content');
        for(let i = 0; i < btnElems.length; i++) {
            btnElems[i].classList.add('pdfcrowd-invisible');
        }

        setTimeout(function() {
            pdfcrowdShared.getOptions(function(options) {
                let main = document.getElementsByTagName('main');
                main = main.length ? main[0] :
                    document.querySelector('div.grow');
                const main_clone = prepareContent(main);

                applyQuestionStyles(main_clone, options);

                let title = getTitle();
                let filename = title;

                function cleanup() {
                    btnConvert.disabled = false;
                    spinner.classList.add('pdfcrowd-hidden');
                    for(let i = 0; i < btnElems.length; i++) {
                        btnElems[i].classList.remove('pdfcrowd-invisible');
                    }
                }

                function doConvert() {

                    const data = {
                        jpeg_quality: 70,
                        image_dpi: 150,
                        convert_images_to_jpeg: 'all',
                        title: title,
                        rendering_mode: 'viewport',
                        smart_scaling_mode: 'viewport-fit'
                    };

                    const trigger = getTriggerButton(event);
                    const singlePagePrint = applyConversionOptions(
                        data,
                        trigger
                    );
                    applyMarginSettings(data, options);

                    const classes = buildCssClasses(options, singlePagePrint);
                    if(options.theme === 'dark' ||
                       (options.theme === '' && !isLight(document.body))) {
                        data.page_background_color = '333333';
                    }

                    if(options.zoom) {
                        data.scale_factor = options.zoom;
                    }

                    const toc = buildTocHtml(options);
                    const datetimeHtml = buildDatetimeHtml(options);
                    const h1_style = options.title_mode === 'none'
                        ? 'hidden' : '';
                    const body = `<h1 class="main-title ${h1_style}">` +
                        `${title}</h1>` + datetimeHtml + toc +
                        main_clone.outerHTML;

                    const model_name = buildModelNameHtml(options);
                    const direction = document.documentElement.getAttribute(
                        'dir') || 'ltr';

                    const htmlContent = `<!DOCTYPE html><html><head>` +
                        `<meta charSet="utf-8"/></head>` +
                        `<body class="${classes}" dir="${direction}">` +
                        `${model_name}${body}</body>`;

                    pdfcrowdChatGPT.doRequest(
                        htmlContent,
                        data,
                        addPdfExtension(filename),
                        cleanup
                    );
                }

                if(options.title_mode === 'ask') {
                    const dlgTitle = document.getElementById(
                        'pdfcrowd-title-overlay');
                    const titleInput = document.getElementById('pdfcrowd-title');
                    titleInput.value = title;
                    dlgTitle.style.display = 'flex';
                    titleInput.focus();
                    document.getElementById('pdfcrowd-title-convert')
                        .onclick = function() {
                            dlgTitle.style.display = 'none';
                            title = titleInput.value.trim();
                            if(title) {
                                filename = title;
                            }
                            doConvert();
                        };
                    const titleCancelBtns = dlgTitle.querySelectorAll(
                        '.pdfcrowd-close-btn');
                    titleCancelBtns.forEach(btn => {
                        btn.onclick = function() {
                            dlgTitle.style.display = 'none';
                            cleanup();
                        };
                    });
                } else {
                    doConvert();
                }
            });
        }, 0);
    }

    function addPdfcrowdBlock() {
        const container = document.createElement('div');
        container.innerHTML = pdfcrowdBlockHtml;
        container.classList.add(
            'pdfcrowd-block', 'pdfcrowd-text-right', 'pdfcrowd-hidden');
        document.body.appendChild(container);

        let buttons = document.querySelectorAll('.pdfcrowd-convert');
        buttons.forEach(element => {
            element.addEventListener('click', convert);
        });

        document.getElementById('pdfcrowd-help').addEventListener(
            'click', event => {
                showHelp();
            });

        document.getElementById('pdfcrowd-more').addEventListener('click', event => {
            event.stopPropagation();
            const moreButtons = document.getElementById(
                'pdfcrowd-extra-btns');
            if(moreButtons.classList.contains('pdfcrowd-hidden')) {
                moreButtons.classList.remove('pdfcrowd-hidden');
            } else {
                moreButtons.classList.add('pdfcrowd-hidden');
            }
        });

        document.addEventListener('click', event => {
            const moreButtons = document.getElementById('pdfcrowd-extra-btns');

            if (!moreButtons.contains(event.target)) {
                moreButtons.classList.add('pdfcrowd-hidden');
            }
        });

        buttons = document.querySelectorAll('.pdfcrowd-close-btn');
        buttons.forEach(element => {
            element.addEventListener('click', () => {
                element.closest('.pdfcrowd-overlay').style.display = 'none';
            });
        });

        return container;
    }

    const pdfcrowd_block = addPdfcrowdBlock();

    const BUTTON_MARGIN = -2;
    const WIDTHS = [{
        width: 135,
        cls: null
    }, {
        width: 85,
        cls: 'pdfcrowd-btn-smaller'
    }, {
        width: 58,
        cls: 'pdfcrowd-btn-smallest'
    }, {
        width: 30,
        cls: 'pdfcrowd-btn-xs-small'
    }];

    // Find rightmost visible content inside an element
    function findRightmostContent(container) {
        const elements = container.querySelectorAll('button, a, [role="button"], [type="button"]');
        let rightmost = null;
        let maxRight = 0;

        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.width > 0 && rect.right > maxRight) {
                maxRight = rect.right;
                rightmost = el;
            }
        });

        return rightmost;
    }

    let prevClass = null;

    function changeButtonPosition() {
        const header = document.getElementById('page-header');

        if(header) {
            const children = header.querySelectorAll(':scope > div');
            if(children.length >= 3) {
                const leftContainer = children[1];
                const rightContainer = children[2];
                const leftContent = findRightmostContent(leftContainer);
                const rightRect = rightContainer.getBoundingClientRect();

                if(leftContent) {
                    const leftContentRect = leftContent.getBoundingClientRect();
                    const gapStart = leftContentRect.right;
                    const gapEnd = rightRect.left;
                    const availableSpace = gapEnd - gapStart;

                    // Try each button size
                    for(let j = 0; j < WIDTHS.length; j++) {
                        const width = WIDTHS[j];
                        if(availableSpace >= width.width + BUTTON_MARGIN * 2) {
                            const rightPos = Math.round(
                                window.innerWidth - gapEnd + BUTTON_MARGIN
                            ) + 'px';
                            const newClass = width.cls;

                            if(rightPos !== pdfcrowd_block.style.right ||
                               prevClass !== newClass) {
                                pdfcrowd_block.style.right = rightPos;
                                pdfcrowd_block.style.top = '10px';
                                prevClass = newClass;
                                pdfcrowd_block.classList.remove(
                                    'pdfcrowd-btn-smaller',
                                    'pdfcrowd-btn-smallest',
                                    'pdfcrowd-btn-xs-small');
                                if(newClass) {
                                    pdfcrowd_block.classList.add(newClass);
                                }
                            }
                            return;
                        }
                    }
                }
            }
        }

        // Fallback position
        pdfcrowd_block.style.right = '18px';
        pdfcrowd_block.style.top = '44px';
        pdfcrowd_block.classList.remove(
            'pdfcrowd-btn-smaller',
            'pdfcrowd-btn-smallest',
            'pdfcrowd-btn-xs-small');
        pdfcrowd_block.classList.add('pdfcrowd-btn-smaller');
        prevClass = 'pdfcrowd-btn-smaller';
    }

    function checkForContent() {
        const validUrl = !window.location.href.startsWith(
            'https://chatgpt.com/gpts/editor');

        if(validUrl && document.querySelector('[data-message-author-role="user"]')) {
            changeButtonPosition();

            pdfcrowd_block.classList.remove('pdfcrowd-hidden');
            // fix conflict with other extensions which remove the button
            if(!pdfcrowd_block.isConnected) {
                console.warn('Extension conflict, another extension deleted PDFCrowd HTML, disable other extensions to fix it.\ncreating the Save as PDF button...');
                document.body.appendChild(pdfcrowd_block);
            }
            if(!blockStyle.isConnected) {
                console.warn('Extension conflict, another extension deleted PDFCrowd HTML, disable other extensions to fix it.\ncreating the button style...');
                document.head.appendChild(blockStyle);
            }
        } else {
            pdfcrowd_block.classList.add('pdfcrowd-hidden');
        }
    }

    const options_el = document.getElementById('pdfcrowd-options');
    if(pdfcrowdShared.hasOptions) {
        options_el.addEventListener('click', function() {
            chrome.runtime.sendMessage({action: "open_options_page"});
        });
    } else {
        options_el.remove();
    }

    setInterval(checkForContent, 1000);
}

pdfcrowdChatGPT.showError = function(status, text, hideContact) {
  let html;
  if (status == 432) {
    html = [
      "<strong>Fair Use Notice</strong><br>",
      "Current usage is over the limit. Please wait a while before trying again.<br><br>",
    ];
  } else {
      html = [];
      if (status) {
          if(status == 'network-error') {
              html.push('Network error while connecting to the conversion service');
          } else {
              html.push(`Code: ${status}`);
          }
          html.push(text);
          html.push('Please try again later');
      } else {
          html.push(text);
      }
      if(!hideContact) {
          html.push(`If the problem persists, contact us at
            <a href="mailto:support@pdfcrowd.com?subject=ChatGPT%20error">
              support@pdfcrowd.com
            </a>`);
      }
  }
  html = html.join('<br>');
  document.getElementById('pdfcrowd-error-overlay').style.display = 'flex';
  document.getElementById('pdfcrowd-error-message').innerHTML = html;
};

pdfcrowdChatGPT.saveBlob = function(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
    }, 100);
};

(function() {
    pdfcrowdChatGPT.doRequest = function(data, fileName, fnCleanup) {
        const formData = new FormData();
        for(let key in data) {
            formData.append(key, data[key]);
        }
        GM_xmlhttpRequest({
            url: pdfcrowdChatGPT.pdfcrowdAPI,
            method: 'POST',
            data: formData,
            responseType: 'blob',
            headers: {
                'Authorization': 'Basic ' + btoa(
                    pdfcrowdChatGPT.username + ':' + pdfcrowdChatGPT.apiKey),
            },
            onload: response => {
                fnCleanup();
                if(response.status == 200) {
                    const url = window.URL.createObjectURL(response.response);
                    pdfcrowdChatGPT.saveBlob(url, fileName);
                } else {
                    pdfcrowdChatGPT.showError(
                        response.status, response.responseText);
                }
            },
            onerror: error => {
                console.error('conversion error:', error);
                fnCleanup();
                pdfcrowdChatGPT.showError(500, error.responseText);
            }
        });
    };

    pdfcrowdChatGPT.init();
})();
