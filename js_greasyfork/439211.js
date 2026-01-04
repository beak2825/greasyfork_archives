// ==UserScript==
// @name             一键批量打开谷歌必应搜索前2的n次方项搜索结果
// @name:zh          Alt + 123... 一键批量打开谷歌必应搜索前2的n次方项搜索结果
// @name:en          Alt + 123... One-click batch open Google Bing search first 2 n-th power search results
// @namespace        https://userscript.snomiao.com/
// @version          0.0.8
// @description:en   To quickly understand a field, press Alt+1 ...2,3,4...Alt+5 on the search page of Google or Bing to open the search results of the first 2 nth power items and copy the opened ones link. Currently supports: Google, Bing, Zhihu.
// @description:zh   快速了解一个领域用，在谷歌或必应的搜索页面 按 Alt+1 ...2,3,4... Alt+5  将会打开前2的n次方项的搜索结果，并复制打开的链接。目前支持：谷歌、必应、知乎。
// @author           snomiao@gmail.com
// @match            https://www.google.com/search?*
// @match            https://www.google.com.*/search?*
// @match            https://*.bing.com/search?*
// @match            https://www.zhihu.com/search?*
// @grant            none
// @contributionURL  https://snomiao.com/donate
// @supportURL       https://github.com/snomiao/userscript.js/issues
// @deprecated       go to my new user-script [SNOLAB] Alt + 123... Searching Results Links List Batch Open
// @description To quickly understand a field, press Alt+1 ...2,3,4...Alt+5 on the search page of Google or Bing to open the search results of the first 2 nth power items and copy the opened ones link. Currently supports: Google, Bing, Zhihu.
// @downloadURL https://update.greasyfork.org/scripts/439211/%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E8%B0%B7%E6%AD%8C%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%89%8D2%E7%9A%84n%E6%AC%A1%E6%96%B9%E9%A1%B9%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/439211/%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E8%B0%B7%E6%AD%8C%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%89%8D2%E7%9A%84n%E6%AC%A1%E6%96%B9%E9%A1%B9%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

// History:
// (20200217)兼容 Google News
//
(function () {
    "use strict";
    var 已打开过的链接 = {};
    r;
    var open = (url) => {
        if (!已打开过的链接[url]) {
            window.open(url);
        }
        已打开过的链接[url] = 1;
    };

    var 复制文本 = (content) => {
        const input = document.createElement("textarea");
        input.setAttribute("readonly", "readonly");
        input.setAttribute("value", content);
        input.innerHTML = content;
        input.setAttribute(
            "style",
            "position: fixed; top:0; left:0;z-index: 9999"
        );
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);
        if (document.execCommand("copy")) {
            document.execCommand("copy");
            console.log(`长度为${content.length}的内容已复制`);
            //alert(`长度为${content.length}的内容已复制`);
        }
        document.body.removeChild(input);
    };
    var 获取没有打开过的链接 = (需要的链接条数) => {
        var lsa = "";
        if (
            location
                .toString()
                .match(/^https\:\/\/www.google\.com(\.\w+)?\/search/)
        ) {
            // 谷歌
            lsa = [...document.querySelectorAll("h3>a, a>h3")].map(
                (e) => (e.tagName == "A" && e) || e.parentElement
            );
        }
        if (location.toString().match(/^https:\/\/\w+\.bing\.com\/search/)) {
            // 必应
            lsa = [...document.querySelectorAll("h2")].map((h2) =>
                h2.querySelector("a")
            );
        }
        if (location.toString().match(/^https:\/\/\w+\.zhihu\.com\/search/)) {
            // 知乎
            lsa = [...document.querySelectorAll("h2")].map((h2) =>
                h2.querySelector("a")
            );
        }
        return lsa
            .filter((a) => a && a.href && a.textContent)
            .map((a) => ({
                title: a.textContent,
                href: a.href,
            }))
            .slice(0, 需要的链接条数)
            .reverse();
    };
    var 打开一定数量链接 = (数量) => {
        // 复制文字
        复制文本(
            获取没有打开过的链接(数量)
                .map((link) => "#" + link.title + "\n" + link.href)
                .join("\n\n")
        );
        // 打开连接
        获取没有打开过的链接(数量)
            .map((link) => link.href)
            .map(open);
    };
    window.addEventListener("keydown", (e) => {
        if (!e.ctrlKey && !e.shiftKey && e.altKey && e.key.match(/[1-9]/)) {
            var 打开数量 = Math.pow(2, parseInt(e.key));
            打开一定数量链接(打开数量);
        }
    });
    console.log("loading: 谷歌一键打开前N项搜索结果");
})();
