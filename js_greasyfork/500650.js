// ==UserScript==
// @name        e-hentai 搜索輔助 快速添加標籤
// @namespace   https://greasyfork.org/scripts/500650
// @version     1.3
// @description 點擊按鈕快速添加指定標籤至搜索框
// @author      fmnijk
// @match       https://e-hentai.org/*
// @match       https://exhentai.org/*
// @icon        https://www.google.com/s2/favicons?domain=e-hentai.org
// @grant       none
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/500650/e-hentai%20%E6%90%9C%E7%B4%A2%E8%BC%94%E5%8A%A9%20%E5%BF%AB%E9%80%9F%E6%B7%BB%E5%8A%A0%E6%A8%99%E7%B1%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/500650/e-hentai%20%E6%90%9C%E7%B4%A2%E8%BC%94%E5%8A%A9%20%E5%BF%AB%E9%80%9F%E6%B7%BB%E5%8A%A0%E6%A8%99%E7%B1%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var tags = {
        'language:chinese$': '中文',
        '-language:translated$': '-翻譯',
        '-language:korean$': '-韓國翻譯',
        'other:"full color$"': '全彩',
        'other:uncensored$': '無碼',
        '無修正': '無修正',
        '-other:"mosaic censorship$"': '-馬賽克',
        'DL版': 'DL版',
        'Digital': 'Digital',
        // 'female:prostitution$': '援交',
        '-pixiv': '-pixiv',
        'pixiv': 'pixiv',
        'fanbox': 'fanbox',
        'patreon': 'patreon',
        '-other:novel$': '-小說',
    };
    var nextline = [-1];

    function createButtons(targetElement) {
        var style = document.createElement('style');
        style.textContent = `
            .custom-button {
                color: #f1f1f1;
                border-color: #1357df;
                background: radial-gradient(#1357df, #3377FF) !important;
                padding: 2px 5px;
                border-radius: 3px;
                text-decoration: none;
                display: inline-block;
                margin: 1px 0;
            }
        `;
        document.head.appendChild(style);

        var fragment = document.createDocumentFragment();
        Object.entries(tags).forEach(function([tag, buttonText], index) {
            var span = document.createElement('span');
            span.innerHTML = '<a href="javascript:void(0);" class="custom-button">' + buttonText + '</a>';
            if (nextline.includes(index + 1) || (nextline.includes(-1) && index === Object.keys(tags).length - 1)) {
                span.innerHTML += '<br>';
            } else {
                span.innerHTML += ' &nbsp;';
            }
            span.querySelector('a').onclick = function(e) {
                e.preventDefault();
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                } else if (document.selection) {
                    document.selection.empty();
                }
                var searchInput = document.querySelector('#f_search');
                if (searchInput) {
                    var currentValue = searchInput.value;
                    var tagToCheck = tag.trim();
                    var tagWithoutMinus = tagToCheck.replace(/^-/, '');
                    if (currentValue.includes(tagWithoutMinus)) {
                        var regex = new RegExp("\\s?" + tagWithoutMinus.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\s?");
                        searchInput.value = currentValue.replace(regex, ' ').trim()
                    } else {
                        searchInput.value = (currentValue ? currentValue + ' ' : '') + tagToCheck;
                    }
                    // 移除多餘的連續重複空格
                    searchInput.value = searchInput.value.replace(/\s+/g, " ");
                    // 移除多餘的符號
                    searchInput.value = searchInput.value.replace(/(^| )(-|~)( |$)/g, " ");
                    // 移除開頭和結尾的空格
                    searchInput.value = searchInput.value.trim();
                }

                // 點擊搜索按鈕
                var searchButton = document.querySelector('#searchbox > form > div:nth-child(3) > input[type=submit]:nth-child(2)');
                if (searchButton) {
                    searchButton.click();
                } else {
                    console.log('搜索按鈕未找到');
                }
            };
            fragment.appendChild(span);
        });
        targetElement.insertBefore(fragment, targetElement.firstChild);
    }

    function checkForTargetElement() {
        var targetElement = document.querySelector('#searchbox > form > div:nth-child(4)');
        if (targetElement) {
            createButtons(targetElement);
            observer.disconnect();
        }
    }

    var observer = new MutationObserver(function(mutations) {
        checkForTargetElement();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始檢查
    checkForTargetElement();
})();