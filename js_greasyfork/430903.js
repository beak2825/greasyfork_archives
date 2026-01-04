// ==UserScript==
// @name         AtCoderJudgeProgressColorizer
// @namespace    https://satanic0258.github.io/
// @version      1.0.0
// @description  Colorize the progress of judge in AtCoder's submissions pages.
// @author       satanic0258
// @match        https://atcoder.jp/contests/*/submissions*
// @icon         https://www.google.com/s2/favicons?domain=atcoder.jp
// @grant        none
// @copyright    2021, satanic0258 (https://satanic0258.github.io/)
// @license      MIT License; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/430903/AtCoderJudgeProgressColorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/430903/AtCoderJudgeProgressColorizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function colorize(target) {
        const res = /(\d+)\/(\d+) (.*)?/.exec(target.innerText);
        if(res) {
            const ratio = (parseInt(res[1]) - 1) / parseInt(res[2]) * 100;
            const ratioStr = ratio + "%";
            const color = (res[3]) ? "#f0ad4e" : "#777"; // ? WA : WJ
            target.style.background = "linear-gradient(to right, "+color+" 0%, "+color+" "+ratioStr+", rgba(0,0,0,0) "+ratioStr+", rgba(0,0,0,0) 100%)";
        }
    }

    // 変更があったら色付け
    const observer = new MutationObserver(records => {
        for(const record of records) {
            const target = record.target;
            if(target.tagName === "TD" && (target.classList.contains('waiting-judge') || target.id === "judge-status")){
                // WJ, 2/7, 2/7 WA,...
                colorize(target);
            }
            else if(target.tagName === "TR"){
                // ジャッジ終了時(提出一覧のみ)
                // 未定,正解/不正解の演出を入れるなどもできる
            }
        }
    });

    // 監視対象の要素
    let observeTarget = null;

    const url = window.location.href;
    if (url.match(new RegExp(/submissions\/(\d+)/)) != null) {
        // 個別の提出ページ
        const tables = document.getElementsByClassName("table");
        if(tables.length === 1) {
            // WJ中
            const td = document.getElementById("judge-status");
            colorize(td);
            observeTarget = td;
        }
    }
    else {
        // 提出一覧ページ
        const table = document.getElementsByClassName("table")[0];
        const thead = table.children[0];
        const baseLen = thead.children[0].children.length;
        const tbody = table.children[1];

        // 読み込んだものを色付け
        for(const obj of tbody.children) {
            if(obj.children.length !== baseLen){
                colorize(obj.children[obj.children.length-2]);
            }
        }
        // tbodyを監視
        observeTarget = tbody;
    }

    // 監視を開始
    if(observeTarget) {
        observer.observe(observeTarget, {
            childList: true,
            subtree: true
        });
    }
})();