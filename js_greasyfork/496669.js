// ==UserScript==
// @name         b站搜索添加循环历史
// @namespace    qwq0
// @version      0.1
// @description  b站搜索添加循环历史按钮
// @author       qwq0
// @match        https://search.bilibili.com/all?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496669/b%E7%AB%99%E6%90%9C%E7%B4%A2%E6%B7%BB%E5%8A%A0%E5%BE%AA%E7%8E%AF%E5%8E%86%E5%8F%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/496669/b%E7%AB%99%E6%90%9C%E7%B4%A2%E6%B7%BB%E5%8A%A0%E5%BE%AA%E7%8E%AF%E5%8E%86%E5%8F%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function parseHtmlString(htmlString)
    {
        let wrapper = document.createElement('div');
        wrapper.innerHTML = htmlString;
        return wrapper.firstChild;
    }

    function loop()
    {
        let searchInputWrap = document.getElementsByClassName("search-input-wrap")[0];
        if(searchInputWrap)
        {
            let button = parseHtmlString(`<button class="vui_button vui_button--blue vui_button--lg search-button">循环历史</button>`);
            searchInputWrap.firstChild.before(button);
            button.addEventListener("click", () =>
            {
                let storageIframe = Array.from(document.getElementsByTagName("iframe")).filter(o => o.src.indexOf("https://s1.hdslb.com/bfs/seed/jinkela/short/cols/iframe") == 0)[0];
                storageIframe.contentWindow.postMessage({
                    type: "COLS_GET",
                    id: "obtain-search-history-39571",
                    key: "search_history:search_history"
                }, "*");
            });
            window.addEventListener("message", e => {
                if(e.data.id != "obtain-search-history-39571")
                    return;
                let searchInputEl = document.getElementsByClassName("search-input-el")[0];
                let searchHistory = JSON.parse(e.data.value);
                searchInputEl.value = searchHistory[searchHistory.length - 1].value;
                searchInputEl.dispatchEvent(new InputEvent("input"));
                let searchButton = searchInputWrap.getElementsByTagName("button")[1];
                if(searchButton.innerText == "搜索")
                {
                    searchButton.click();
                }
            });
        }
        else
            setTimeout(loop, 600);
    }
    loop();

})();