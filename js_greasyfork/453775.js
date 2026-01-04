// ==UserScript==
// @name                Pixiv-DeleteNoNeed
// @name:zh-CN          Pixiv-删除无用元素
// @name:ja             Pixiv-不要な要素を削除
// @namespace           https://github.com/TitanRGB
// @version             1.2
// @description         Hide no need iframe elements which looks like empty space with no meaning.
// @description:zh-CN   隐藏无用的、看起来意义不明的 iframe 元素造成的空白。
// @description:ja      無駄で意味不明に見えるiframe要素による空白を隠す。
// @author              https://github.com/TitanRGB
// @icon                data:image/png;base64,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
// @match               http*://pixiv.net
// @match               http*://pixiv.net/*
// @match               http*://www.pixiv.net
// @match               http*://www.pixiv.net/*
// @license             MPL-2.0
// @license^            Mozilla Public License 2.0
// @grant               unsafeWindow
// @homepageURL         https://github.com/SynRGB/Pixiv-DeleteNoNeed
// @contributionURL     https://github.com/SynRGB/Pixiv-DeleteNoNeed
// @copyright           Copyright © 2022-PRESENT, TitanRGB (https://github.com/TitanRGB)
// @charset             UTF-8
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/453775/Pixiv-DeleteNoNeed.user.js
// @updateURL https://update.greasyfork.org/scripts/453775/Pixiv-DeleteNoNeed.meta.js
// ==/UserScript==

let last_run_time = new Date().getTime();

let main = function () {
    let iframe = document.querySelectorAll('iframe');
    for (let i = 0; i < iframe.length; i++) {
        let parent = iframe[i].parentElement;
        if (parent.tagName === 'LI' && iframe[i].name === 'relatedworks') {
            parent.style.display = 'none';
        }
        if (parent.tagName === 'DIV' && iframe[i].name === 'header') {
            parent.style.display = 'none';
        }
    }

    const xpath = '//*[@id="root"]/div[2]/div/div[2]/div[2]';
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (element) {
        // 检查元素是否只包含空白字符或没有子元素
        if (!element.hasChildNodes() || /^\s*$/.test(element.innerHTML)) {
            element.parentNode.removeChild(element);
        }
    }

    last_run_time = new Date().getTime();
}

let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
        if (new Date().getTime() - last_run_time > 100) {
            main();
        }
    });
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log("JS script Pixiv-DeleteNoNeed (Pixiv-删除无用元素) loaded. See more details at https://github.com/SynRGB/Pixiv-DeleteNoNeed");