// ==UserScript==
// @name         客拼 → HagPinPlus
// @namespace    aiuanyu
// @version      3.0
// @description  將網頁上的客拼取代為 HagPinPlus（客拼乙式方案）更美觀。目前可處理代管當局教育部臺灣客語辭典網頁。
// @author       Aiuanyu 愛灣語
// @match        http*://hakkadict.moe.edu.tw/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/530928/%E5%AE%A2%E6%8B%BC%20%E2%86%92%20HagPinPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/530928/%E5%AE%A2%E6%8B%BC%20%E2%86%92%20HagPinPlus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rules = { /* HagPinPlus 腳本 v2 開始 */
        "ars to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)a([a-zA-Z]*)\\bˊ",
            "replace": "$1á$2",
            "flags": "g"
        },
        "ass to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)a([a-zA-Z]*)\\bˇ",
            "replace": "$1ǎ$2",
            "flags": "g"
        },
        "afs to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)a([a-zA-Z]*)\\bˋ",
            "replace": "$1à$2",
            "flags": "g"
        },
        "aplus to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)a([a-zA-Z]*)\\b⁺",
            "replace": "$1ā$2",
            "flags": "g"
        },
        "abigplus to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)a([a-zA-Z]*)\\b\\+",
            "replace": "$1ā$2",
            "flags": "g"
        },
        "acircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)a([a-zA-Z]*)\\bˆ",
            "replace": "$1â$2",
            "flags": "g"
        },
        "abigcircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)a([a-zA-Z]*)\\b\\^",
            "replace": "$1â$2",
            "flags": "g"
        },
        "ers to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)e([a-zA-Z]*)\\bˊ",
            "replace": "$1é$2",
            "flags": "g"
        },
        "ess to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)e([a-zA-Z]*)\\bˇ",
            "replace": "$1ě$2",
            "flags": "g"
        },
        "efs to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)e([a-zA-Z]*)\\bˋ",
            "replace": "$1è$2",
            "flags": "g"
        },
        "eplus to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)e([a-zA-Z]*)\\b⁺",
            "replace": "$1ē$2",
            "flags": "g"
        },
        "ebigplus to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)e([a-zA-Z]*)\\b\\+",
            "replace": "$1ē$2",
            "flags": "g"
        },
        "ecircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)e([a-zA-Z]*)\\bˆ",
            "replace": "$1ê$2",
            "flags": "g"
        },
        "ebigcircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)e([a-zA-Z]*)\\b\\^",
            "replace": "$1ê$2",
            "flags": "g"
        },
        "irs to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)i([a-zA-Z]*)\\bˊ",
            "replace": "$1í$2",
            "flags": "g"
        },
        "iss to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)i([a-zA-Z]*)\\bˇ",
            "replace": "$1ǐ$2",
            "flags": "g"
        },
        "ifs to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)i([a-zA-Z]*)\\bˋ",
            "replace": "$1ì$2",
            "flags": "g"
        },
        "iplus to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)i([a-zA-Z]*)\\b⁺",
            "replace": "$1ī$2",
            "flags": "g"
        },
        "ibigplus to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)i([a-zA-Z]*)\\b\\+",
            "replace": "$1ī$2",
            "flags": "g"
        },
        "icircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)i([a-zA-Z]*)\\bˆ",
            "replace": "$1î$2",
            "flags": "g"
        },
        "ibigcircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)i([a-zA-Z]*)\\b\\^",
            "replace": "$1î$2",
            "flags": "g"
        },
        "ors to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)o([a-zA-Z]*)\\bˊ",
            "replace": "$1ó$2",
            "flags": "g"
        },
        "oss to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)o([a-zA-Z]*)\\bˇ",
            "replace": "$1ǒ$2",
            "flags": "g"
        },
        "ofs to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)o([a-zA-Z]*)\\bˋ",
            "replace": "$1ò$2",
            "flags": "g"
        },
        "oplus to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)o([a-zA-Z]*)\\b⁺",
            "replace": "$1ō$2",
            "flags": "g"
        },
        "obigplus to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)o([a-zA-Z]*)\\b\\+",
            "replace": "$1ō$2",
            "flags": "g"
        },
        "ocircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)o([a-zA-Z]*)\\bˆ",
            "replace": "$1ô$2",
            "flags": "g"
        },
        "obigcircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)o([a-zA-Z]*)\\b\\^",
            "replace": "$1ô$2",
            "flags": "g"
        },
        "urs to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)u([a-zA-Z]*)\\bˊ",
            "replace": "$1ú$2",
            "flags": "g"
        },
        "uss to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)u([a-zA-Z]*)\\bˇ",
            "replace": "$1ǔ$2",
            "flags": "g"
        },
        "ufs to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)u([a-zA-Z]*)\\bˋ",
            "replace": "$1ù$2",
            "flags": "g"
        },
        "uplus to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)u([a-zA-Z]*)\\b⁺",
            "replace": "$1ū$2",
            "flags": "g"
        },
        "ubigplus to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)u([a-zA-Z]*)\\b\\+",
            "replace": "$1ū$2",
            "flags": "g"
        },
        "ucircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)u([a-zA-Z]*)\\bˆ",
            "replace": "$1û$2",
            "flags": "g"
        },
        "ubigcircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)u([a-zA-Z]*)\\b\\^",
            "replace": "$1û$2",
            "flags": "g"
        },
        "yrs to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)y([a-zA-Z]*)\\bˊ",
            "replace": "$1ý$2",
            "flags": "g"
        },
        "yss to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)y([a-zA-Z]*)\\bˇ",
            "replace": "$1y̌$2",
            "flags": "g"
        },
        "yfs to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)y([a-zA-Z]*)\\bˋ",
            "replace": "$1ỳ$2",
            "flags": "g"
        },
        "yplus to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)y([a-zA-Z]*)\\b⁺",
            "replace": "$1ȳ$2",
            "flags": "g"
        },
        "ybigplus to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)y([a-zA-Z]*)\\b\\+",
            "replace": "$1ȳ$2",
            "flags": "g"
        },
        "ycircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)y([a-zA-Z]*)\\bˆ",
            "replace": "$1ŷ$2",
            "flags": "g"
        },
        "ybigcircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)y([a-zA-Z]*)\\b\\^",
            "replace": "$1ŷ$2",
            "flags": "g"
        },
        "mss to HagPinPlus v2": {
            "find": "mˇ",
            "replace": "m̌",
            "flags": "g"
        },
        "mcircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)m([a-zA-Z]*)\\bˆ",
            "replace": "$1m̂$2",
            "flags": "g"
        },
        "mbigcircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)m([a-zA-Z]*)\\b\\^",
            "replace": "$1m̂$2",
            "flags": "g"
        },
        "nrs to HagPinPlus v2": {
            "find": "nˊ",
            "replace": "ń",
            "flags": "g"
        },
        "nss to HagPinPlus v2": {
            "find": "nˇ",
            "replace": "ň",
            "flags": "g"
        },
        "nfs to HagPinPlus v2": {
            "find": "nˋ",
            "replace": "ǹ",
            "flags": "g"
        },
        "nplus to HagPinPlus v2": {
            "find": "n⁺",
            "replace": "n̄",
            "flags": "g"
        },
        "nbigplus to HagPinPlus v2": {
            "find": "n\\+",
            "replace": "n̄",
            "flags": "g"
        },
        "ncircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)n([a-zA-Z]*)\\bˆ",
            "replace": "$1n̂$2",
            "flags": "g"
        },
        "nbigcircumflex to HagPinPlus v2": {
            "find": "\\b([a-zA-Z]*)n([a-zA-Z]*)\\b\\^",
            "replace": "$1n̂$2",
            "flags": "g"
        },
        "ngrs to HagPinPlus v2": {
            "find": "ngˊ",
            "replace": "ńg",
            "flags": "g"
        },
        "ngss to HagPinPlus v2": {
            "find": "ngˇ",
            "replace": "ňg",
            "flags": "g"
        },
        "ngfs to HagPinPlus v2": {
            "find": "ngˋ",
            "replace": "ǹg",
            "flags": "g"
        },
        "ngplus to HagPinPlus v2": {
            "find": "ng⁺",
            "replace": "n̄g",
            "flags": "g"
        },
        "ngbigplus to HagPinPlus v2": {
            "find": "ng\\+",
            "replace": "n̄g",
            "flags": "g"
        },
        "ngcircumflex to HagPinPlus v2": {
            "find": "ngˆ",
            "replace": "n̂g$1",
            "flags": "g"
        },
        "ngbigcircumflex to HagPinPlus v2": {
            "find": "ng^",
            "replace": "n̂g$1",
            "flags": "g"
        },
        "ii reversal for HagPinPlus v2":{
            "find": "i([íǐìîī])",
            "replace": "$1i",
            "flags": "g"
        }
    };

    function processNodes(node) {
        if ((node.nodeType === Node.ELEMENT_NODE && node.classList.contains('accent-data')) ||
            (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('everyday-word'))) {
            let htmlContent = node.innerHTML;

            // 先處理 <sup> 標籤，將其內容移到前面的文字後面並移除 <sup>
            htmlContent = htmlContent.replace(/([a-zA-Z]+)<sup>([ˊˇˋ⁺^])<\/sup>/g, '$1$2');
            htmlContent = htmlContent.replace(/([a-zA-Z]+)<sup>([\u02C8\u02C7\u02CB\u002B\u005E])<\/sup>/g, '$1$2'); // 包含 Unicode 符號

            // 然後應用其他的替換規則
            const ruleOrder = [
                "ars to HagPinPlus v2", "ass to HagPinPlus v2", "afs to HagPinPlus v2", "aplus to HagPinPlus v2", "abigplus to HagPinPlus v2", "acircumflex to HagPinPlus v2", "abigcircumflex to HagPinPlus v2",
                "ers to HagPinPlus v2", "ess to HagPinPlus v2", "efs to HagPinPlus v2", "eplus to HagPinPlus v2", "ebigplus to HagPinPlus v2", "ecircumflex to HagPinPlus v2", "ebigcircumflex to HagPinPlus v2",
                "ors to HagPinPlus v2", "oss to HagPinPlus v2", "ofs to HagPinPlus v2", "oplus to HagPinPlus v2", "obigplus to HagPinPlus v2", "ocircumflex to HagPinPlus v2", "obigcircumflex to HagPinPlus v2",
                "urs to HagPinPlus v2", "uss to HagPinPlus v2", "ufs to HagPinPlus v2", "uplus to HagPinPlus v2", "ubigplus to HagPinPlus v2", "ucircumflex to HagPinPlus v2", "ubigcircumflex to HagPinPlus v2",
                "irs to HagPinPlus v2", "iss to HagPinPlus v2", "ifs to HagPinPlus v2", "iplus to HagPinPlus v2", "ibigplus to HagPinPlus v2", "icircumflex to HagPinPlus v2", "ibigcircumflex to HagPinPlus v2",
                "yrs to HagPinPlus v2", "yss to HagPinPlus v2", "yfs to HagPinPlus v2", "yplus to HagPinPlus v2", "ybigplus to HagPinPlus v2", "ycircumflex to HagPinPlus v2", "ybigcircumflex to HagPinPlus v2",
                "mss to HagPinPlus v2", "mcircumflex to HagPinPlus v2", "mbigcircumflex to HagPinPlus v2",
                "nrs to HagPinPlus v2", "nss to HagPinPlus v2", "nfs to HagPinPlus v2", "nplus to HagPinPlus v2", "nbigplus to HagPinPlus v2", "ncircumflex to HagPinPlus v2", "nbigcircumflex to HagPinPlus v2",
                "ngrs to HagPinPlus v2", "ngss to HagPinPlus v2", "ngfs to HagPinPlus v2", "ngplus to HagPinPlus v2", "ngbigplus to HagPinPlus v2", "ngcircumflex to HagPinPlus v2", "ngbigcircumflex to HagPinPlus v2",
                "ii reversal for HagPinPlus v2"
            ];

            for (const ruleName of ruleOrder) {
                const rule = rules[ruleName];
                const regex = new RegExp(rule.find, rule.flags || 'g');
                htmlContent = htmlContent.replace(regex, rule.replace);
            }

            // 新增的取代規則
            htmlContent = htmlContent.replace(/ ，/g, ', ');

            node.innerHTML = htmlContent;
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
            for (let i = 0; i < node.childNodes.length; i++) {
                processNodes(node.childNodes[i]);
            }
        }
    }

    const observer = new MutationObserver(function(mutationsList, observer) {
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(processNodes);
            }
        });
    });

    window.addEventListener('load', function() {
        const targetElements = document.querySelectorAll('.accent-data, .everyday-word');
        targetElements.forEach(processNodes);

        const body = document.querySelector('body');
        if (body) {
            observer.observe(body, { childList: true, subtree: true });
            console.log("MutationObserver started on body.");
        }
        console.log("HakkaDict Replacer script finished loading.");
    });
})();