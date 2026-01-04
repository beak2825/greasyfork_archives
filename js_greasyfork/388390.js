// ==UserScript==
// @name         掘金文章黑名单
// @namespace    https://github.com/hoc2019/blackList
// @version      1.0
// @description  掘金文章黑名单过滤脚本
// @author       wangzy
// @e-mail       sl2782087@163.com
// @match        https://juejin.im/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/388390/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/388390/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    const myScriptStyle =
        '.black-btn{height:36px;line-height:36px;text-align:center;color:#ccc}.black-btn.in-black{color:#000}.black-sidebar{position:fixed;width:240px;background:#2d303a;font-size: 16px;top:10%;border-radius:0 0 20px 0;padding:20px 20px 20px 0;z-index:999;transform:translate3d(-100%,0,0);transition:transform .4s ease-out}.black-sidebar-show{transform:translate3d(0,0,0)}.hide-icon{display:none}.black-sidebar-show .hide-icon{display:initial}.black-sidebar-show .show-icon{display:none}.toggle{width:50px;padding:5px;background:#2d303a;position:absolute;top:0;right:-60px;color:#fff;border-radius:0 10px 10px 0;cursor:pointer}.black-sidebar ul{height:80px;padding-left:0;overflow-y:auto;overflow-x:hidden;margin:10px 0}.black-sidebar p{padding-left:20px;color:#0ebeff}.black-sidebar ul::-webkit-scrollbar{width:5px;height:5px}.black-sidebar ul::-webkit-scrollbar-thumb{background:rgba(220,220,220,0.5);border-radius:5px}.black-sidebar ul::-webkit-scrollbar-track{background:#201c29}.black-sidebar li{width:80%;font-size:16px;line-height:26px;color:#fff;font-weight:bold;list-style:none;cursor:pointer;padding-left:50px;position:relative;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.black-sidebar li:hover{background:#000}.black-sidebar li:hover::after{content:"删除";position:absolute;left:10px;font-size:12px;color:#ffdd40}.input-box input{width:82%;border:1px solid rgba(220,220,220,0.4);color:#fff;font-size:16px;line-height:26px;border-radius:4px;background:#262830;margin:5px 0 5px 22px;padding:0 5px}.btn-box{text-align:center}.btn-box span{color:#47cf73;cursor:pointer;margin:0 15px}';
    GM_addStyle(myScriptStyle);

    let authorBlackList = [];
    let keywordsBlackList = [];

    getBlackListFromLocalStorage();
    addBlackListSidebar();

    const pathname = location.pathname.split('/')[1];
    if (pathname === 'timeline' || pathname === 'search') {
        filterArticle(pathname === 'timeline' ? 'entry-list' : 'main-list');
    } else {
        addBlackListBtn();
    }

    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            updateSidebarList();
            if (pathname === 'post') {
                const author = getAuthor();
                const isInBlack = authorBlackList.includes(author);
                console.log(isInBlack);
                if (isInBlack) {
                    $('.panel-btn.black-btn').addClass('in-black');
                } else {
                    $('.panel-btn.black-btn').removeClass('in-black');
                }
            }
        }
    });

    function addBlackListSidebar() {
        const sidebarHtml =
            '<div class="black-sidebar"><div class="toggle">Black<br />List<span class="show-icon">></span><span class="hide-icon"><</span></div><div class="author"><p>作者</p><ul></ul></div><div class="keywords"><p>关键字</p><ul></ul></div><div class="input-box"><input type="text" /></div><div class="btn-box"><span data-type="author">+作者</span><span data-type="keywords">+关键字</span></div></div>';
        $('body').append($(sidebarHtml));
        $('.toggle').click(function() {
            $('.black-sidebar').toggleClass('black-sidebar-show');
        });
        updateSidebarList();
        $('.black-sidebar ul').on('click', 'li', function() {
            const item = $(this);
            blackAction('delete', item.data('type'), item.text());
            item.remove();
        });
        $('.black-sidebar .btn-box span').click(function() {
            const input = $('.black-sidebar input');
            const value = $.trim(input.val());
            if (!value) return;
            const item = $(this);
            blackAction('add', item.data('type'), value);
            input.val('');
        });
    }

    function updateSidebarList() {
        getBlackListFromLocalStorage();
        const authorLi = authorBlackList.map(
            item => `<li data-type="author">${item}<li>`
        );
        const keywordsLi = keywordsBlackList.map(
            item => `<li data-type="keywords">${item}<li>`
        );
        $('.black-sidebar .author ul')
            .empty()
            .append(authorLi);
        $('.black-sidebar .keywords ul')
            .empty()
            .append(keywordsLi);
    }

    function addBlackListBtn() {
        const container = $('#juejin');
        const config = {
            childList: true,
            subtree: true
        };
        let blackBtn;
        const handleLoad = mutationsList => {
            for (let mutation of mutationsList) {
                let type = mutation.type;
                let addedNodes = mutation.addedNodes;
                switch (type) {
                    case 'childList':
                        if (addedNodes.length > 0) {
                            const username = $('.author-info-block .username');
                            if (username.text()) {
                                loadObserver.disconnect();
                                addBtn();
                                return;
                            }
                        }
                        break;
                }
            }
        };
        const loadObserver = createNodeListener(
            container[0],
            config,
            handleLoad
        );
        function addBtn() {
            const box = $('.article-suspended-panel');
            const btn = $('.share-btn.wechat-btn');
            const author = getAuthor();
            const isInBlack = authorBlackList.includes(author);
            blackBtn = btn.clone();
            blackBtn
                .attr('class', 'panel-btn black-btn')
                .text('黑')
                .click(defriend);
            isInBlack && blackBtn.addClass('in-black');
            box.append(blackBtn);
        }
        function defriend() {
            const author = getAuthor();
            const arrIndex = authorBlackList.indexOf(author);
            const isInBlack = arrIndex >= 0;
            if (isInBlack) {
                blackBtn.removeClass('in-black');
                blackAction('delete', 'author', author, arrIndex);
            } else {
                blackBtn.addClass('in-black');
                blackAction('add', 'author', author);
            }
        }
    }

    function filterArticle(articleBox) {
        const container = $('#juejin');
        let list;
        const config = {
            childList: true,
            subtree: true
        };
        const handleLoad = mutationsList => {
            for (let mutation of mutationsList) {
                let type = mutation.type;
                let addedNodes = mutation.addedNodes;
                switch (type) {
                    case 'childList':
                        if (addedNodes.length > 0) {
                            list = $(`.${articleBox}`);
                            if (list.children().length) {
                                loadObserver.disconnect();
                                const articles = $(`.${articleBox}>.item`);
                                filter(articles);
                                createNodeListener(list[0], config, updateLoad);
                            }
                        }
                        break;
                }
            }
        };
        const updateLoad = mutationsList => {
            for (let mutation of mutationsList) {
                let type = mutation.type;
                let addedNodes = mutation.addedNodes;
                switch (type) {
                    case 'childList':
                        if (addedNodes.length > 0) {
                            filter($(addedNodes));
                        }
                        break;
                }
            }
        };
        const loadObserver = createNodeListener(
            container[0],
            config,
            handleLoad
        );
        function filter(articles) {
            if (!(keywordsBlackList.length || authorBlackList.length)) return;
            articles.each(function() {
                const info = $(this);
                const author = info.find('.username').text();
                const title = info.find('.title').text();
                if (authorBlackList.includes(author) || testTitle(title)) {
                    $(this).hide();
                }
            });
        }
        function testTitle(title) {
            const titleRegex = new RegExp(keywordsBlackList.join('|'));
            if (!keywordsBlackList.length) return false;
            return titleRegex.test(title);
        }
    }

    function getBlackListFromLocalStorage() {
        authorBlackList = JSON.parse(
            localStorage.getItem('authorBlackList') || '[]'
        );
        keywordsBlackList = JSON.parse(
            localStorage.getItem('keywordsBlackList') || '[]'
        );
    }

    function blackAction(action, type, name, delIndex) {
        const list = type === 'author' ? authorBlackList : keywordsBlackList;
        if (action === 'add') {
            const node = `<li data-type="${type}">${name}<li>`;
            $(`.black-sidebar .${type} ul`).append(node);
            list.push(name);
        } else {
            const index = delIndex || list.indexOf(name);
            index >= 0 &&
                list.splice(index, 1) &&
                $(`.black-sidebar .${type} li`)
                    .eq(index)
                    .remove();
        }
        localStorage.setItem(`${type}BlackList`, JSON.stringify(list));
    }
    function getAuthor() {
        const authorBox = $('.author-info-block .username').eq(0);
        const author = authorBox.length ? authorBox.text() : '';
        return author;
    }

    function createNodeListener(node, config, mutationCallback) {
        const observer = new MutationObserver(mutationCallback);
        observer.observe(node, config);
        return observer;
    }
})();
