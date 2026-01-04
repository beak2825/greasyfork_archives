// ==UserScript==
// @name         Kana Convert Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script randomly converts kanji on webpages to hiragana.
// @author       Wantitled
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        https://www3.nhk.or.jp/*
// @match        https://ja.wikipedia.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448048/Kana%20Convert%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/448048/Kana%20Convert%20Script.meta.js
// ==/UserScript==

// ============================= Config =============================

// APIKEY is a personal key which can be created via the steps listed here: https://labs.goo.ne.jp/apiusage/
const APIKEY = '';

// probability sets the amount of kanji on a page that will be converted, which goes up to 100 for all kanji (although most likely not all kanji will be converted).
// The API calls can be quite slow so above 50 is not recommended.
const probability = 30;

// leftHighlight and rightHighlight highlight where the converted kana is and can be left blank
const leftHighlight = "";
const rightHighlight = "";

// maxChunkSize determines the maximumm size of a chunk of text that will be converted
const maxChunkSize = 30;

// ==================================================================

(function() {
    'use strict';
    const textReg1 = / \\+ /g;
    const textReg2 = /[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[a-zA-Z0-9]+|[ａ-ｚＡ-Ｚ０-９]+|[々〆〤ヶ]+/u;
    let convertedText;

    var convertText = (text) => {
        return $.ajax({
            url: "https://labs.goo.ne.jp/api/hiragana",
            type: "POST",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify({
                                  'app_id': APIKEY,
                                  'sentence':text,
                                  'output_type':'hiragana'
                                 }),
            success: function (result){
                return result.converted;
            },
            error: function(error){
                console.log("Error: ", error);
            }
        }).responseJSON.converted;
    }

    var decideConvert = (val) => {
        return Math.floor(Math.random() * 100) <= val;
    }

    var convertSection = (text) => {
        let textArr = text.split(/(?![一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[a-zA-Z0-9]+|[ａ-ｚＡ-Ｚ０-９]+|[々〆〤ヶ]+)/u);
        let returnArr = [];
        for (let i = 0; i < textArr.length; i++){
            if (decideConvert(probability) && textArr[i].length <= maxChunkSize && /[一-龠]+/u.test(textArr[i])){
                convertedText = convertText(textArr[i]);
                if (convertedText !== undefined){
                    textArr[i] = leftHighlight+convertedText+rightHighlight;
                }
            }
        }
        return textArr.join("");
    }

    $(document).ready(function(){

        (function() {
            var treeWalker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                { acceptNode: function(node) { return NodeFilter.FILTER_ACCEPT; } }
            );
            var currentNode = treeWalker.currentNode;
            while(currentNode) {
                if (currentNode.nodeType == 3
                    && !textReg1.test(currentNode.textContent) && textReg2.test(currentNode.textContent)){
                    if (currentNode.parentNode.nodeName !== "SCRIPT"
                        && currentNode.parentNode.nodeName !== "IMG"
                        && currentNode.parentNode.nodeName !== "CITE"
                        && currentNode.parentNode.nodeName !== "STYLE"
                        && currentNode.parentNode.nodeName !== "IMG"
                        && currentNode.parentNode.nodeName !== "NOSCRIPT"
                       ){
                        if(decideConvert(probability)){
                            currentNode.textContent = convertSection(currentNode.textContent);
                        }
                    }
                }
                currentNode = treeWalker.nextNode();
            }
        })()
     })

})();

