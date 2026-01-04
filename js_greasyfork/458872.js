// ==UserScript==
// @name         e-Gov法令検索に掲載されている法令の条文の簡便な読解の用に供する電子計算機に対する指令の組合せ（以下「e-Govで法令を読むのに便利なスクリプト」という。）
// @namespace    https://www.e-gov.go.jp/
// @version      1.0
// @description  e-Govで法令を読むのに便利なスクリプト
// @author       Romeo H.
// @match        https://elaws.e-gov.go.jp/document?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-gov.go.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458872/e-Gov%E6%B3%95%E4%BB%A4%E6%A4%9C%E7%B4%A2%E3%81%AB%E6%8E%B2%E8%BC%89%E3%81%95%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E6%B3%95%E4%BB%A4%E3%81%AE%E6%9D%A1%E6%96%87%E3%81%AE%E7%B0%A1%E4%BE%BF%E3%81%AA%E8%AA%AD%E8%A7%A3%E3%81%AE%E7%94%A8%E3%81%AB%E4%BE%9B%E3%81%99%E3%82%8B%E9%9B%BB%E5%AD%90%E8%A8%88%E7%AE%97%E6%A9%9F%E3%81%AB%E5%AF%BE%E3%81%99%E3%82%8B%E6%8C%87%E4%BB%A4%E3%81%AE%E7%B5%84%E5%90%88%E3%81%9B%EF%BC%88%E4%BB%A5%E4%B8%8B%E3%80%8Ce-Gov%E3%81%A7%E6%B3%95%E4%BB%A4%E3%82%92%E8%AA%AD%E3%82%80%E3%81%AE%E3%81%AB%E4%BE%BF%E5%88%A9%E3%81%AA%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E3%80%8D%E3%81%A8%E3%81%84%E3%81%86%E3%80%82%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/458872/e-Gov%E6%B3%95%E4%BB%A4%E6%A4%9C%E7%B4%A2%E3%81%AB%E6%8E%B2%E8%BC%89%E3%81%95%E3%82%8C%E3%81%A6%E3%81%84%E3%82%8B%E6%B3%95%E4%BB%A4%E3%81%AE%E6%9D%A1%E6%96%87%E3%81%AE%E7%B0%A1%E4%BE%BF%E3%81%AA%E8%AA%AD%E8%A7%A3%E3%81%AE%E7%94%A8%E3%81%AB%E4%BE%9B%E3%81%99%E3%82%8B%E9%9B%BB%E5%AD%90%E8%A8%88%E7%AE%97%E6%A9%9F%E3%81%AB%E5%AF%BE%E3%81%99%E3%82%8B%E6%8C%87%E4%BB%A4%E3%81%AE%E7%B5%84%E5%90%88%E3%81%9B%EF%BC%88%E4%BB%A5%E4%B8%8B%E3%80%8Ce-Gov%E3%81%A7%E6%B3%95%E4%BB%A4%E3%82%92%E8%AA%AD%E3%82%80%E3%81%AE%E3%81%AB%E4%BE%BF%E5%88%A9%E3%81%AA%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E3%80%8D%E3%81%A8%E3%81%84%E3%81%86%E3%80%82%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const supTemplate = function(str1, str2) {
        return `${str1}</span><sup>[${str2}]</sup>`;
    };

    const patternTemplate = function(str) {
        return [new RegExp(`${str}(|.*?同じ。)）`, 'g'), supTemplate(str + "$1", str.charAt(0))];
    };

    const patterns = [
        [new RegExp("（(?![０-９ａ-ｚ]+）)", 'g'), "<span> "],
        patternTemplate("という。"),
        patternTemplate("をいう。"),
        patternTemplate("含む。"),
        patternTemplate("除く。"),
        patternTemplate("限る。"),
        [new RegExp("(?<!（[０-９ａ-ｚ]+)）", 'g'), supTemplate(" ", "！")]
    ];

    const applyPatterns = function(str) {
        let tmp = str;
        patterns.forEach(pattern => {
            tmp = tmp.replaceAll(pattern[0], pattern[1]);
        });
        return tmp;
    };

    const transformHTML = function(target) {
        for (let child of target.childNodes) {
            if (child.nodeName == "#text" && child.textContent == "　削除") {
                target.style.color = "lightgray";
                target.style.fontSize = "50%";
                return;
            }
        }

        target.innerHTML = applyPatterns(target.innerHTML);
        target.querySelectorAll("sup").forEach(sup => {
            const supStyle = sup.style;
            supStyle.color = "red";
            supStyle.fontSize = "50%";
            supStyle.verticalAlign = "super";

            const spanStyle = sup.previousElementSibling.style;
            spanStyle.display = "none";
            spanStyle.color = "gray";
            spanStyle.fontSize = "90%";

            sup.addEventListener("mouseover", () => {
                if (spanStyle.display == "none") {
                    supStyle.color = "blue";
                    spanStyle.display = "initial";
                } else {
                    supStyle.color = "red";
                    spanStyle.display = "none";
                }
            }, false);
        });
    };

    const selector = "._div_ArticleTitle, ._div_ParagraphSentence, ._div_ItemSentence, .col-pad";

    const observer = new MutationObserver(records => {
        // performance.mark('performanceMarkStart');
        records.forEach(record => record.target.querySelectorAll(selector).forEach(it => transformHTML(it)));
        // performance.mark('performanceMarkEnd');
        // performance.measure('performanceMeasured', 'performanceMarkStart', 'performanceMarkEnd');
        // const results = performance.getEntriesByName('performanceMeasured');
        // console.log(results[0]);
        observer.disconnect();
    });
    observer.observe(document.getElementById("lawArea"), {attributes: true, childList: true, subtree: true});
})();