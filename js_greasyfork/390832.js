// ==UserScript==
// @name         爱卡小助手
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动切换经典版和提供黑名单功能。
// @author       bg7lgb@gmail.com
// @match        https://www.xcar.com.cn/bbs/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.slim.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/390832/%E7%88%B1%E5%8D%A1%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/390832/%E7%88%B1%E5%8D%A1%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// ChangeLog:
// ------------------------------------------------------------
// 2019-10-7 v1.3 修复了刚刚一个手误
// 2019-10-7 v1.2 增加帖子回复过滤
// 2019-10-7 v1.1 修复打开帖子详情页后，无法加载黑名单列表的BUG
// ------------------------------------------------------------

// Todo
// ------------------------------------------------------------
// * 增加详情页中，回复内容的过滤功能
//
// 备注
// ------------------------------------------------------------
// 针对新版界面做过滤，看最下面的nodelistener相关
// 已经可以实现了，修改下面的代码就可以了

(function() {
    'use strict';

//     var $ = unsafeWindow.jQuery;

    const myScriptStyle =
          '.black-btn{height:36px;line-height:36px;text-align:center;color:#ccc}.black-btn.in-black{color:#000}.black-sidebar{position:fixed;width:240px;background:#2d303a;font-size: 16px;top:10%;right:0; border-radius:0 0 0 20px;padding:20px 20px 20px 0;z-index:999;transform:translate3d(100%,0,0);transition:transform .4s ease-out}.black-sidebar-show{transform:translate3d(0,0,0)}.hide-icon{display:none}.black-sidebar-show .hide-icon{display:initial}.black-sidebar-show .show-icon{display:none}.toggle{width:50px;padding:5px;background:#2d303a;position:absolute;top:0;left:-60px;color:#fff;border-radius:10px 0 0 10px;cursor:pointer}.black-sidebar ul{height:180px;padding-left:0;overflow-y:auto;overflow-x:hidden;margin:10px 0}.black-sidebar p{padding-left:20px;color:#0ebeff}.black-sidebar ul::-webkit-scrollbar{width:5px;height:5px}.black-sidebar ul::-webkit-scrollbar-thumb{background:rgba(220,220,220,0.5);border-radius:5px}.black-sidebar ul::-webkit-scrollbar-track{background:#201c29}.black-sidebar li{width:80%;font-size:16px;line-height:26px;color:#fff;font-weight:bold;list-style:none;cursor:pointer;padding-left:50px;position:relative;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.black-sidebar li:hover{background:#000}.black-sidebar li:hover::after{content:"删除";position:absolute;left:10px;font-size:12px;color:#ffdd40}.input-box input{width:82%;border:1px solid rgba(220,220,220,0.4);color:#fff;font-size:16px;line-height:26px;border-radius:4px;background:#262830;margin:5px 0 5px 22px;padding:0 5px}.btn-box{text-align:center}.btn-box span{color:#47cf73;cursor:pointer;margin:0 15px}';
    GM_addStyle(myScriptStyle);

    let authorBlackList ;
    
    //let isNewStyle = true;

    let isNewStyle = checkBBSStyle();

    // 切换回经典版
    if (isNewStyle) switchToClassicStyle();

    addBlackListSidebar();
    addBlackListBtn();

    const pathname = location.pathname.split('/')[1];
    // 原来打算把过滤的按钮加在用户页面，不影响主界面的布局，
    // 后来发现localStorage的跨域问题搞不定，只好把拉黑做到主界面帖子列表的时间栏上
    if (pathname === 'bbs') {
        // 论坛，过滤帖子
        console.log('过滤帖子');
        filterArticle();
    }

    // 检查当前版面的版本, true: new style, false: classic style
    function checkBBSStyle() {
        let items = $('.back_old_link');
        if (items.length > 0) {
            // 找到对应链接
            if (items[0].innerText.trim() == '返回经典版') {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    // 创建黑名单侧栏
    function addBlackListSidebar() {
        const sidebarHtml =
              '<div class="black-sidebar"><div class="toggle">小助手<span class="show-icon"></span><span class="hide-icon"><</span></div><div class="author"><p>作者</p><ul></ul></div><div class="input-box"><input type="text" /></div><div class="btn-box"><span data-type="author">+作者</span></div></div>';
        $('body').append($(sidebarHtml));
        $('.toggle').click(function() {
            $('.black-sidebar').toggleClass('black-sidebar-show');
        });
        updateSidebarList();
        

        // 黑名单删除点击处理
        $('.black-sidebar ul').on('click', 'li', function() {
            const item = $(this);
            blackAction('delete', item.data('type'), item.text());
            //item.remove();
        });

        // 手工输入黑名单
        $('.black-sidebar .btn-box span').click(function() {
            const input = $('.black-sidebar input');
            const value = $.trim(input.val());
            if (!value) return;
            const item = $(this);
            blackAction('add', item.data('type'), value);
            input.val('');
        });

    }

    // 更新侧栏黑名单的显示
    function updateSidebarList() {
        getBlackListFromLocalStorage();
        console.log('updateSidebarList length ' + authorBlackList.length);
        if (authorBlackList.length == 0) {
            console.log('空黑名单');
            $('.black-sidebar .author ul').empty()
            return;
        }
        const authorLi = authorBlackList.map(
            item => `<li data-type="author">${item}<li>`
        );
//         console.log(authorLi);

        $('.black-sidebar .author ul')
            .empty()
            .append(authorLi);

        filterArticle();
    }

    function getBlackListFromLocalStorage() {
        authorBlackList = JSON.parse(
            localStorage.getItem('authorBlackList') || '[]'
        );
    }

    // 添加拉黑按钮
    function addBlackListBtn() {
        if (isNewStyle) {
        } else {
            // 经典版
            console.log('classic style add button');
            let items = $('span.tdate');
            $('span.tdate').on('click', defriend);
        }

        // 添加黑名单
        function defriend() {

            let author;

            if (isNewStyle) {
            } else {
                // 经典版获取用户名
                author = this.previousElementSibling.innerText;

            }
            let arrIndex = authorBlackList.indexOf(author);
            let isInBlack = arrIndex >= 0;
            if (isInBlack) {
                // 已存在黑名单中，删除（其实不起作用，因为看不到）
                blackAction('delete', 'author', author, arrIndex);
            } else {
                // 添加黑名单
                blackAction('add', 'author', author);
            }
        }
    }

    // 黑名单添加和删除
    function blackAction(action, type, name, delIndex) {
        //const list = type === 'author' ? authorBlackList : keywordsBlackList;
        let list = authorBlackList;

        if (action === 'add') {
            if (list.indexOf(name) == -1) {
                list.push(name);
            }
        } else {
            const index = delIndex || list.indexOf(name);
//             console.log('del black , index '+ index);
//             console.log('list before del '+list);
            list.splice(index, 1);
//             console.log('list after del '+list);
        }
//         console.log(list);
        localStorage.setItem(`${type}BlackList`, JSON.stringify(list));
        updateSidebarList();
    }

    function getAuthor() {
        const authorBox = $('span.name');
        const author = authorBox.length ? authorBox[0].innerText : '';
        return author;
    }

    // 过滤帖子
    function filterArticle() {
        console.log('isNewStyle ' + isNewStyle);
        let container;

        if (isNewStyle) {
            container = $('.forum_left_item')[0];
        }else{
            container = $('.post-list')[0];
        }

        let list;
        const config = {
            childList: true,
            subtree: true
        };
        const handleLoad = mutationsList => {
            console.log('handleLoad running');
            for (let mutation of mutationsList) {
                let type = mutation.type;
                let addedNodes = mutation.addedNodes;
                console.log(addedNodes);
                console.log('mutations catch');
                switch (type) {
                    case 'childList':
                        console.log(addedNodes);
                        if (addedNodes.length > 0) {
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

        filterStatic();
//         const loadObserver = createNodeListener(
//             container,
//             config,
//             handleLoad
//         );

        function filterStatic() {
            // 过滤静态页面，对新版本的首页和经典版本的适用
            
//             console.log(authorBlackList);
            for (let i in authorBlackList){
//                 console.log(authorBlackList[i]);
                if (isNewStyle) {
                    // Todo：新版页面，未完成
                } else {
                    // 去掉通栏广告
                    let ads = $('div.sticker1200x60');

                    for (let l = 0; l<ads.length; l++) {
                        ads[l].style.display = 'none';
//                         console.log('去除通栏广告');
                    }

                    let pathname = location.pathname.split('/')[2];

                    if (pathname == 'forumdisplay.php') {
                        // 论坛首页

                        // 检查发帖人，在黑名单中则过滤其帖子
                        let posts = $('a.linkblack');
                        for (let j in posts){
                            if (posts[j].innerText == authorBlackList[i]) {
                                 posts[j].parentNode.parentNode.style.display = 'none';
                                 console.log('过滤 ' + authorBlackList[i] +  ' 的主题');
                            }
                        }
                    } else if (pathname == 'viewthread.php') {
                        // 帖子内容及回复页面
                        let users = $('p.name');
//                         console.log('users length '+users.length);
                        for (let k in users) {
                            if (users[k].firstChild == undefined ) {
                                continue;
                            }
//                             console.log(users[k].firstChild);
//                             console.log(users[k].firstChild.innerText);
                            if (users[k].firstChild.innerText == authorBlackList[i]) {
                                users[k].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
                                console.log('过滤 ' + authorBlackList[i] +  ' 的帖子');
                            }
                        }
                    } else {
                        console.log('filterStatic 未知页面');
                        return ;
                    }
                }
            }
        }


        function filter(articles) {
            console.log(articles);
            //             if (!(keywordsBlackList.length || authorBlackList.length)) return;
            //             articles.each(function () {
            //                 const info = $(this);
            //                 const author = info.find('.username').text();
            //                 const title = info.find('.title').text();
            //                 if (authorBlackList.includes(author) || testTitle(title)) {
            //                     $(this).hide();
            //                 }
            //             });
        }
    }

    function createNodeListener(node, config, mutationCallback) {
        console.log('createNodeListner running');
        console.log(node);
        const observer = new MutationObserver(mutationCallback);
        observer.observe(node, config);
        return observer;
    }

    // 切换回经典版
    function switchToClassicStyle() {
       var back_old_link =document.getElementsByClassName("back_old_link");

       if (back_old_link.length) {
           back_old_link[0].click();
       }
    }

})();