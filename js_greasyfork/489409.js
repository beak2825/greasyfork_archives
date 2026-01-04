// ==UserScript==
// @name         Translate Discord Messages
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Translate Discord messages and display them under the original text
// @author       CrankyBookworm
// @match        https://*.discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @esversion    11
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489409/Translate%20Discord%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/489409/Translate%20Discord%20Messages.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

const translateTo = "en";

let httpRequest;
if (typeof GM < "u" && GM.xmlHttpRequest) {
    httpRequest = GM.xmlHttpRequest;
}
else if (typeof GM < "u" && GM_xmlhttpRequest) {
    httpRequest = GM_xmlhttpRequest;
}
else if (typeof GM_xmlhttpRequest < "u") {
    httpRequest = GM_xmlhttpRequest;
}
else if (typeof GM < "u" && GM.xmlHttpRequest) {
    httpRequest = GM.xmlHttpRequest;
}
else {
    httpRequest = fetch;
    console.error("No HttpRequest Permission");
}

class TranslationResult {
    constructor() {
        /**
         * Translated Text.
         * @var {string?}
         */
        this.resultText = "";
        /**
         * Alternative translation results.
         * @var {string}
         */
        this.candidateText = "";
        /**
         * Translated from.
         * @var {string}
         */
        this.sourceLanguage = "";
        /**
         * Translation accuracy.
         * @var {float}
         */
        this.percentage = 0;
        /**
         * Is Error.
         * @var {bool}
         */
        this.isError = !1;
        /**
         * Error Message.
         * @var {string}
         */
        this.errorMessage = "";
    }
}

(function () {
    'use strict';

    const horizontalLine = document.createElement("hr");
    horizontalLine.style = "border: 0; padding-top: 1px; background: linear-gradient(to right, transparent, #d0d0d5, transparent);";

    const translateMsgElementTemplate = document.createElement("span");
    translateMsgElementTemplate.className = "myTranslateMsg";
    translateMsgElementTemplate.style = "color:#a4a9ab;";
    translateMsgElementTemplate.lang = translateTo;
    translateMsgElementTemplate.innerText = "Testing";


    /**
     * Translates a message
     * @param {string} textToTranslate Text that needs to be translated
     * @param {string?} fromLang Language to translate from
     * @param {string?} toLang Language to translate to
     * @returns {TranslationResult} Translation Result
     */
    async function translateText(textToTranslate, fromLang, toLang) {
        fromLang = fromLang ?? "auto";
        toLang = toLang ?? translateTo;
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(textToTranslate)}`;

        var request = {
            "method": "GET",
            "timeout" : 6e4,
            "url": url,
            "synchronous" : !1,
        };

        /** @type {Response} */
        const response = await httpRequest(request).catch((e => e.response));
        const json_data = JSON.parse(await response.responseText);
        var result = new TranslationResult();

        // console.log(`response: Type: ${typeof response}. Value: ${response}`);
        if (response && 200 === (null == response ? void 0 : response.status)) {
            console.log(`json_data: Type: ${typeof json_data}. Value: ${json_data}`);
            result.sourceLanguage = json_data.src;
            result.percentage = json_data.ld_result.srclangs_confidences[0];
            result.resultText = json_data.sentences.map((e => e.trans)).join("");
            if(json_data.dict){
                result.candidateText = json_data.dict.map(
                    (e => `${e.pos}${"" != e.pos ? ": " : ""}${e.terms.join(", ")}\n`).join("")
                );
            }
        }
        else {
            result.isError = !0;
            if (response && 0 !== response.status) {
                if (429 === response.status || 503 === response.status) {
                    result.errorMessage = "Translation Service unavailable";
                }
                else {
                    result.errorMessage = `UnknownError occurred: [${null == response ? void 0 : response.status} ${null == response ? void 0 : response.statusText}]`;
                }
            }
            console.error("sendRequest()", result, response);
        }
        return result;
    }

    var observer = new MutationObserver(function (mutations) {
        /** @type {Array<Element>} */
        var messageElms = [];
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement) {
                    messageElms = messageElms.concat(
                        Array.from(node.querySelectorAll('[aria-roledescription="Message"]'))
                    );
                }
            });
        });

        // console.log(`node: Type: ${typeof node}. Value: ${node}`);
        messageElms.forEach(async (messageElm) => {
            const msgContentElm = messageElm.querySelector('[class^="contents_"] [id^="message-content-"]');
            if (!msgContentElm.querySelector(".myTranslateMsg")) {
                const translation = await translateText(msgContentElm.innerText);
                if(translation.sourceLanguage === translateTo ||
                   translation.resultText === msgContentElm.innerText){
                    return;
                }

                // Create translation element template
                var msgTranslationText = document.createTextNode(translation.isError ? translation.errorMessage : translation.resultText);
                const msgTranslationElm = translateMsgElementTemplate.cloneNode();
                msgTranslationElm.appendChild(msgTranslationText);

                // Add Translation to end of message
                msgContentElm.appendChild(horizontalLine.cloneNode());
                msgContentElm.appendChild(msgTranslationElm);
            }
        });
    });

    // Start observing the target node for configured mutations
    observer.observe(document, { attributes: true, childList: true, subtree: true });
})();