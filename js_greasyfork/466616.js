// ==UserScript==
// @name         小黑盒
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  小黑盒跳转社区，搜索部分社区，自动翻页
// @match       *.xiaoheihe.cn/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466616/%E5%B0%8F%E9%BB%91%E7%9B%92.user.js
// @updateURL https://update.greasyfork.org/scripts/466616/%E5%B0%8F%E9%BB%91%E7%9B%92.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Add dark mode style
    GM_addStyle(`
        .dark-mode {
            background-color: black;
            color: white;
        }
    `);

    // Create buttons
    var communities = [
        { name: 'PC游戏', url: 'https://www.xiaoheihe.cn/community/1/list/' },
        { name: '盒友杂谈', url: 'https://www.xiaoheihe.cn/community/7214/list/' },
        { name: '沙雕日常', url: 'https://www.xiaoheihe.cn/community/73907/list/' },
        { name: 'roll区', url: 'https://www.xiaoheihe.cn/community/486554/list/' },
        { name: 'roll专区', url: 'https://www.xiaoheihe.cn/community/54539/list/' },
        { name: '情投一盒', url: 'https://www.xiaoheihe.cn/community/416158/list/' },
        { name: 'gal游戏综合区', url: 'https://www.xiaoheihe.cn/community/53182/list/' },
        { name: '主机游戏', url: 'https://www.xiaoheihe.cn/community/23563/list/' },
        { name: '数码硬件', url: 'https://www.xiaoheihe.cn/community/18745/list/' },
        { name: 'switch', url: 'https://www.xiaoheihe.cn/community/66738/list/' },
        { name: '英雄联盟', url: 'https://www.xiaoheihe.cn/community/55058/list/' },
        { name: 'CS：GO', url: 'https://www.xiaoheihe.cn/community/43/list/' },
        { name: '永劫无间', url: 'https://www.xiaoheihe.cn/community/72984/list/' }
    ];
// Add more communities here...

    var buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '10px';
    buttonContainer.style.left = '10px';
    buttonContainer.style.zIndex = '9999';

    // Auto click next page function
var interval;
var autoClickNextPage = false;
var autoClickButton = createButton('开启/关闭自动翻页', null);
autoClickButton.onclick = function() {
    autoClickNextPage = !autoClickNextPage;
    if (autoClickNextPage) {
        interval = setInterval(function() {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                var nextPageButton = document.querySelector('.page-item.btn-next');
                if (nextPageButton) {
                    nextPageButton.click();
                } else {
                    clearInterval(interval);
                }
            }
        }, 500);
    } else {
        clearInterval(interval);
    }
};
buttonContainer.appendChild(autoClickButton);


    var searchInput = document.createElement('input');
    searchInput.placeholder = '搜索社区';
    searchInput.style.marginBottom = '5px';
    searchInput.addEventListener('keyup', function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchCommunity();
        }
    });
    buttonContainer.appendChild(searchInput);

    var searchButton = createButton('搜索', null);
    searchButton.onclick = searchCommunity;
    buttonContainer.appendChild(searchButton);

    var buttonTop = createButton('回到顶部', '#top');
    buttonContainer.appendChild(buttonTop);

    for (var i = 0; i < communities.length; i++) {
        var community = communities[i];
        var button = createButton(community.name, community.url);
        buttonContainer.appendChild(button);
    }

    document.body.appendChild(buttonContainer);

    // Function to create a button
    function createButton(text, url) {
        var button = document.createElement('button');
        button.innerHTML = text;
        button.style.display = 'block';
        button.style.marginBottom = '5px';
        button.style.padding = '5px';
        button.style.border = 'none';
        button.style.backgroundColor = '#f2f2f2';
        button.style.color = '#000000';
        button.style.cursor = 'pointer';
        if (url) {
            button.onclick = function() {
                window.location.href = url;
            };
        }
        return button;
    }

    // Toggle dark mode function
    function toggleDarkMode() {
        var body = document.querySelector('body');
        body.classList.toggle('dark-mode');
    }

        // Search community function
    function searchCommunity() {
        var searchText = searchInput.value;
        if (searchText.trim() !== '') {
            var community = communities.find(function(item) {
                return item.name.includes(searchText);
            });
            if (community) {
                window.location.href = community.url;
            }
        }
    }
})();
