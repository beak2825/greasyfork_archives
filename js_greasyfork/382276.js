// ==UserScript==
// @author owl
// @name 百度不到？谷歌一下！
// @description 在百度搜索结果页的搜索按钮下方添加隐藏的谷歌搜索按钮，支持百度新版动态搜索
// @include https://www.baidu.com*
// @include http://www.baidu.com*
// @version 3.0
// @grant none
// @namespace https://greasyfork.org/users/295606
// @downloadURL https://update.greasyfork.org/scripts/382276/%E7%99%BE%E5%BA%A6%E4%B8%8D%E5%88%B0%EF%BC%9F%E8%B0%B7%E6%AD%8C%E4%B8%80%E4%B8%8B%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/382276/%E7%99%BE%E5%BA%A6%E4%B8%8D%E5%88%B0%EF%BC%9F%E8%B0%B7%E6%AD%8C%E4%B8%80%E4%B8%8B%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        inputStyles: 'color:white;background:#0aa858;width:50px;height:35px;border:1px solid;float:left;border-radius:20px;display:inline;cursor:pointer;margin-left:5px;z-index:999;',
        input2Styles: 'color:white;background:#DE5833;width:60px;height:35px;border:1px solid;float:left;border-radius:20px;display:inline;cursor:pointer;margin-left:5px;z-index:999;',
        targetBtnId: 'chat-submit-button'
    };

    function createButtons(searchBtn) {
        if (searchBtn.parentNode.querySelector('.my-google-search-btn')) return;

        var input = document.createElement('input');
        input.className = 'my-google-search-btn';
        input.style.cssText = config.inputStyles;
        input.value = '谷歌';
        input.type = 'button';
        input.style.display = 'none';

        var input2 = document.createElement('input');
        input2.className = 'my-duck-search-btn';
        input2.style.cssText = config.input2Styles;
        input2.value = 'DuckGo';
        input2.type = 'button';
        input2.style.display = 'none';

        searchBtn.parentNode.addEventListener('mouseenter', function() {
            var kw = document.getElementById('kw');
            var searchText = kw ? kw.value : '';

            if (searchText) {
                input.style.display = 'inline-block';
                input2.style.display = 'inline-block';

                input.onclick = function(e) {
                    e.preventDefault();
                    window.open('https://www.google.com/search?q=' + encodeURIComponent(searchText));
                };

                input2.onclick = function(e) {
                    e.preventDefault();
                    window.open('https://duckduckgo.com/?q=' + encodeURIComponent(searchText));
                };
            }
        });

        searchBtn.parentNode.addEventListener('mouseleave', function() {
            input.style.display = 'none';
            input2.style.display = 'none';
        });

        searchBtn.parentNode.appendChild(input);
        searchBtn.parentNode.appendChild(input2);
    }

    function checkAndAdd() {
        var searchBtn = document.getElementById(config.targetBtnId);
        if (!searchBtn) {
             searchBtn = document.querySelector('#form .s_btn');
        }

        if (searchBtn) {
            createButtons(searchBtn);
        }
    }

    checkAndAdd();

    var observer = new MutationObserver(function(mutations) {
        checkAndAdd();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();