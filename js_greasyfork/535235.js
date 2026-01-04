// ==UserScript==
// @name         Bilibili首页推荐屏蔽
// @namespace    https://github.com/nkx111
// @version      2.0
// @description  按关键词屏蔽B站首页推荐卡片，可以在展开菜单中管理关键词
// @author       nkx111
// @match        https://www.bilibili.com/
// @grant        none
// @license      MIT  
// @downloadURL https://update.greasyfork.org/scripts/535235/Bilibili%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/535235/Bilibili%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 初始化屏蔽关键词
    let blockedRegexs = JSON.parse(localStorage.getItem('blockedRegexs') || '[]').map(str => new RegExp(str));
    const updateBlockedRegexs = () => localStorage.setItem('blockedRegexs', JSON.stringify(blockedRegexs.map(regex => regex.source)));

    const testedCards = [];

    // old bilibili version
    const map1 = new Map([
        ['container', '.recommend-container__2-line:not([data-blocked])'],
        ['card', '.bili-video-card__wrap:not([data-blocked])'],
        ['title', '.bili-video-card__info--tit'],
        ['author', '.bili-video-card__info--author'],
        ['ad2','.bili-video-card__info--creative-ad'],
        ['ad','.bili-video-card__info--ad'],
        ['live','.floor-single-card']
    ]);

    // new bilibili version
    const map2 = new Map([
        ['container', '.recommended-container_floor-aside:not([data-blocked])'],
        ['card', '.feed-card:not([data-blocked])'],
        ['title', '.bili-video-card__info--tit'],
        ['author', '.bili-video-card__info--author'],
        ['ad2','.bili-video-card__info--creative-ad'],
        ['ad','.bili-video-card__info--ad'],
        ['live','.floor-single-card']
    ]);

    const getNameMapping = () => {
        const recoPanels1 = document.querySelectorAll('.recommend-container__2-line');
        if (recoPanels1.length > 0) {
            return map1;
        }
        const recoPanels2 = document.querySelectorAll('.recommended-container_floor-aside');
        if (recoPanels2.length > 0) {
            return map2;
        }
        return null;
    };

    let map = getNameMapping();

    const observer = new MutationObserver(async () => {
        if (!map) return;
        const recoPanels = document.querySelectorAll(map.get('container'));

        recoPanels.forEach(panel => {
            // const itemslive =  panel.querySelectorAll(map.get('live'));
            // itemslive.forEach(async item => {
            //     console.log(`Blocked (Live)`);
            //     item.style.display = 'none';
            //     item.dataset.blocked = true;
            //     return;
            // });

            const items = panel.querySelectorAll(map.get('card'));
            items.forEach(async item => {
                item.style.marginTop = '0px';

                const titleEl = item.querySelector(map.get('title'));
                const authorEl = item.querySelector(map.get('author'));
                const title = titleEl ? titleEl.innerText.toLowerCase() : '';
                const author = authorEl ? authorEl.innerText.toLowerCase() : '';
                // const ad = item.querySelector(map.get('ad'));
                // const ad2 = item.querySelector(map.get('ad2'));
                // if (ad || ad2){
                //     console.log(`Blocked (AD): ${title} (${author})`);
                //     item.style.display = 'none';
                //     item.dataset.blocked = true;
                //     return;
                // }

                const aTag = item.querySelector('a');
                if (!aTag || !aTag.getAttribute('href')) return;
                const href = aTag.getAttribute('href');
                const match = href.match(/\/(BV|bv)([a-zA-Z0-9]+)/);

                if (href.includes('cm.bilibili.com')){
                    console.log(`Blocked (AD): ${title} (${author})`);
                    item.style.display = 'none';
                    item.dataset.blocked = true;
                    return;
                }

                if (match && match.length > 2) {
                    const bvId = match[2];
                    if (testedCards.includes(bvId)) {
                        return;
                    } else {
                        testedCards.push(bvId);
                    }

                    // check title/author for blocking
                    for (let regex of blockedRegexs) {
                        if (regex.test(title) || regex.test(author)) {
                            console.log(`Blocked: ${title} (${author}) ${href}`);
                            item.style.display = 'none';
                            item.dataset.blocked = true;
                            return;
                        }
                    }

                    // also check tags for blocking
                    const apiUrl = `https://api.bilibili.com/x/tag/archive/tags?bvid=${bvId}`;
                    try {
                        const response = await fetch(apiUrl);
                        const data = await response.json();
                        if (data.code !== 0) {
                            console.error('Failed to fetch tags for BV:', bvId);
                        } else {
                            const tags = data.data.map(tag => tag.tag_name);

                            for (let tag of tags) {
                                for (let regex of blockedRegexs) {
                                    if (regex.test(tag)) {
                                        console.log(`Blocked: ${title} (${author}) ${href}`);
                                        item.style.display = 'none';
                                        item.dataset.blocked = true;
                                        return;
                                    }
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching tags:', error);
                    }
                } else {
                    return;
                }
            });
        });
    });

    if (map === null) {
        console.log('找不到B站首页推荐区域');
    } else {
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('B站首页推荐屏蔽正则表达式脚本已启用');
    }

    // 添加交互界面
    const button = document.createElement('button');
    button.textContent = '管理屏蔽关键词';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#ff6666';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    const modal = document.createElement('div');
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.bottom = '60px';
    modal.style.right = '20px';
    modal.style.zIndex = '9999';
    modal.style.padding = '20px';
    modal.style.backgroundColor = 'white';
    modal.style.border = '1px solid #ccc';
    modal.style.borderRadius = '5px';
    modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    modal.innerHTML = `
        <h4>管理屏蔽关键词</h4>
        <ul id="blocked-keywords-list"></ul>
        <input id="keyword-input" type="text" placeholder="输入新关键词" style="width: calc(100% - 20px); margin-bottom: 10px;" />
        <button id="add-keyword" style="padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">添加关键词</button>
    `;

    document.body.appendChild(button);
    document.body.appendChild(modal);

    const keywordList = modal.querySelector('#blocked-keywords-list');
    const keywordInput = modal.querySelector('#keyword-input');
    const addKeywordButton = modal.querySelector('#add-keyword');

    const refreshKeywordList = () => {
        keywordList.innerHTML = '';
        blockedRegexs.forEach((regex, index) => {
            const li = document.createElement('li');
            li.textContent = regex.source;
            li.style.marginBottom = '5px';
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '删除';
            deleteButton.style.marginLeft = '10px';
            deleteButton.style.padding = '2px 5px';
            deleteButton.style.backgroundColor = '#dc3545';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '3px';
            deleteButton.style.cursor = 'pointer';

            deleteButton.onclick = () => {
                blockedRegexs.splice(index, 1);
                updateBlockedRegexs();
                refreshKeywordList();
            };

            li.appendChild(deleteButton);
            keywordList.appendChild(li);
        });
    };

    button.onclick = () => {
        modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
        refreshKeywordList();
    };

    addKeywordButton.onclick = () => {
        const newKeyword = keywordInput.value.trim();
        if (newKeyword) {
            blockedRegexs.push(new RegExp(newKeyword));
            updateBlockedRegexs();
            refreshKeywordList();
            keywordInput.value = '';
        }
    };
})();
