// ==UserScript==
// @name       B站动态广告、抽奖、关键字净化
// @namespace   https://t.bilibili.com/
// @match     https://t.bilibili.com/*
// @match     https://space.bilibili.com/*
// @description 自动屏蔽转发抽奖和UP主推荐的商品，且可设定自定义的屏蔽词
// @version     1.5
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/478174/B%E7%AB%99%E5%8A%A8%E6%80%81%E5%B9%BF%E5%91%8A%E3%80%81%E6%8A%BD%E5%A5%96%E3%80%81%E5%85%B3%E9%94%AE%E5%AD%97%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/478174/B%E7%AB%99%E5%8A%A8%E6%80%81%E5%B9%BF%E5%91%8A%E3%80%81%E6%8A%BD%E5%A5%96%E3%80%81%E5%85%B3%E9%94%AE%E5%AD%97%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    var blockedCounter = 0;

    function updateBlockedCounter() {
        var counter = document.getElementById('blocked-counter');
        if (counter) {
            counter.textContent = '已屏蔽 ' + blockedCounter + ' 条广告动态信息';
        }
    }

    function loadKeywords() {
        var keywords = localStorage.getItem('blockedKeywords');
        return keywords ? keywords.split(',') : [];
    }

    function saveKeywords(keywords) {
        localStorage.setItem('blockedKeywords', keywords.join(','));
    }

    function createToolbar() {
        var toolbar = document.createElement('div');
        toolbar.style.position = 'fixed';
        toolbar.style.top = '80px';
        toolbar.style.right = '10px';
        toolbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        toolbar.style.padding = '10px';
        toolbar.style.border = '1px solid #ccc';
        toolbar.style.borderRadius = '5px';
        toolbar.style.zIndex = '10000';

        var keywordInput = document.createElement('input');
        keywordInput.type = 'text';
        keywordInput.placeholder = '添加新关键词，用逗号分隔';
        toolbar.appendChild(keywordInput);

        var addButton = document.createElement('button');
        addButton.textContent = '添加';
        addButton.onclick = function() {
            var newKeywords = keywordInput.value.split(',').map(function(keyword) {
                return keyword.trim();
            });
            var keywords = loadKeywords().concat(newKeywords);
            saveKeywords(keywords);
            keywordInput.value = '';
        };
        toolbar.appendChild(addButton);

        var clearButton = document.createElement('button');
        clearButton.textContent = '清空关键词';
        clearButton.onclick = function() {
            saveKeywords([]);
        };
        toolbar.appendChild(clearButton);

        var counter = document.createElement('div');
        counter.id = 'blocked-counter';
        toolbar.appendChild(counter);

        document.body.appendChild(toolbar);
        updateBlockedCounter();
    }
    var observer = new MutationObserver(function(mutations) {
        var keywords = loadKeywords();
        mutations.forEach(function(mutation) {
            var items = document.querySelectorAll('.bili-dyn-list__item');
            items.forEach(function(item) {
                var contents = item.querySelectorAll('.bili-rich-text__content'); // 改为查询所有元素
                contents.forEach(function(content) { // 遍历所有找到的内容元素
                    if (content) {
                        var text = content.innerText || content.textContent;
                        var shouldBlock = keywords.some(function(keyword) {
                            return text.includes(keyword);
                        });
                        var hasGoodsSpan = content.querySelector('span[data-type="goods"]');
                        var hasLotterySpan = content.querySelector('span[data-type="lottery"]');
                        var hasVoteSpan = content.querySelector('span[data-type="vote"]');
                        if (shouldBlock || hasGoodsSpan || hasLotterySpan || hasVoteSpan) {
                            item.remove();
                            var dynId = item.querySelector('.dyn-card-opus').getAttribute('dyn-id');
                            var adlink = 'https://www.bilibili.com/opus/'+dynId ;
                            console.log('已屏蔽'+item.querySelector('div[data-module="title"]').innerText.trim(),adlink);
                            blockedCounter++;
                            updateBlockedCounter();
                        }
                    }
                });
            });
        });
    });


    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);
    createToolbar();
})();
