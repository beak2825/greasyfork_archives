// ==UserScript==
// @name         百度贴吧净化器
// @version      0.2.1
// @description  在访问百度贴吧时，对包含关键字的帖子或用户的帖子进行屏蔽，也可以高亮显示。控制面板可以添加或删除关键字、用户名，净化方式。
// @author       yu4n
// @license      MIT
// @match        *://tieba.baidu.com/f?*
// @match        *://tieba.baidu.com/p/*
// @grant        window.onurlchange
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1323535
// @downloadURL https://update.greasyfork.org/scripts/498830/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%87%80%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/498830/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%87%80%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // #region 本地数据处理
    let keywordList, usernameList, cleanseMethod;

    function handleOldVersionData() {
        let t = localStorage.getItem('titleKeywords');
        let u = localStorage.getItem('usernameKeywords');
        let c = localStorage.getItem('cleanseType');
        if(t != null) {
            localStorage.setItem('keywordList', t);
            localStorage.removeItem('titleKeywords');
        }
        if(u != null) {
            localStorage.setItem('usernameList', u);
            localStorage.removeItem('usernameKeywords');
        }
        if(c != null)  {
            localStorage.setItem('cleanseMethod', c);
            localStorage.removeItem('cleanseType');
        }
    }

    handleOldVersionData();

    function loadLocalStorage() {

        keywordList = mySplit(localStorage.getItem('keywordList'), ',');
        usernameList = mySplit(localStorage.getItem('usernameList'), ',');
        cleanseMethod = localStorage.getItem('cleanseMethod') == null ? 'shield' : localStorage.getItem('cleanseMethod');

        function mySplit(str1, str2) {
            if (str1 == null || '' == str1) return [];
            return str1.split(str2);
        }
    }

    function saveLocalStorage() {
        localStorage.setItem('keywordList', keywordList.join());
        localStorage.setItem('usernameList', usernameList.join());
        localStorage.setItem('cleanseMethod', cleanseMethod);
    }
    // #endregion

    // #region 页面数据处理
    const pageData = {
        f: {
                name: 'frs',
                description: '某个吧的主页',
                getAllPost() { // 获取所有帖子
                    return document.getElementById('thread_list').childNodes;
                },
                // getTopPostList() { // 获取置顶帖
                //     return document.getElementById('thread_top_list').childNodes;
                // },
                getGeneralPostList() { // 获取正常帖
                    return document.getElementById('thread_list').querySelectorAll(':scope > li.j_thread_list.clearfix.thread_item_box');
                },
                getAdPostList() { // 获取广告帖
                    return document.getElementById('thread_list').querySelectorAll(':scope > div');
                },
                getPostId(post) { // 获取正常帖的id
                    return post.dataset.tid;
                },
                getPostTitle(post) { // 获取正常帖的标题
                    return post.querySelector('a.j_th_tit').innerText;
                },
                getPostAuthor(post) { // 获取正常帖的作者
                    return post.querySelector('a.frs-author-name.j_user_card').innerText;
                },
                getPostAuthorId(post) { // 获取正常帖的作者id
                    return parseInt(post.querySelector('span.tb_icon_author').dataset.field.substring(11));
                },
                getPostAuthorLv(post) { // 获取用户等级，未找到方法
                    return 0;
                },
                getPostContent(post) { // 获取正常帖的内容
                    return post.querySelector('div.threadlist_abs.threadlist_abs_onlyline').innerText;
                },
                shieldPost(post) { // 屏蔽帖子
                    post.style.display = 'none';
                },
                highLightPost(post) { // 高亮显示帖子
                    post.style.backgroundColor = 'rgba(255, 0, 0, 0.15)';
                },
                recoverPost(post) { // 复原帖子
                    post.style.display = 'list-item';
                    post.style.backgroundColor = '#fff';
                }
        },
        p: {
                name: 'post',
                description: '帖子详情页',
                getAllPost() { // 获取所有帖子
                    return document.getElementById('j_p_postlist').childNodes;
                },
                getGeneralPostList() { // 获取正常帖
                    let l = document.getElementById('j_p_postlist');
                    if(l.firstElementChild.id == 'j_p_postlist') {
                        return l.firstElementChild.querySelectorAll(':scope > div.l_post.l_post_bright.j_l_post.clearfix');
                    }
                    return l.querySelectorAll(':scope > div.l_post.l_post_bright.j_l_post.clearfix');
                },
                getAdPostList() { // 获取广告帖
                    let l = document.getElementById('j_p_postlist');
                    if(l.firstElementChild.id == 'j_p_postlist') {
                        return l.firstElementChild.querySelectorAll(':scope > div:not([data-pid])');
                    }
                    return l.querySelectorAll(':scope > div:not([data-pid])');
                },
                getPostId(post) { // 获取帖的id
                    return post.dataset.pid;
                },
                getPostTitle(post) { // 获取帖的标题
                    return '';
                },
                getPostAuthor(post) { // 获取帖的作者
                    return post.querySelector('a.p_author_name.j_user_card').innerText;
                },
                getPostAuthorId(post) { // 获取帖的作者id
                    return parseInt(post.querySelector('d_name').dataset.field.substring(11));
                },
                getPostAuthorLv(post) { // 获取用户等级
                    return parseInt(post.querySelector('div.d_badge_lv').innerText);
                },
                getPostContent(post) { // 获取帖的内容
                    return post.querySelector('div.d_post_content.j_d_post_content').innerText;
                },
                shieldPost(post) { // 屏蔽帖子
                    post.style.display = 'none';
                },
                highLightPost(post) { // 高亮显示帖子
                    post.style.background = 'rgba(255, 0, 0, 0.15) url()';
                    post.lastElementChild.style.backgroundColor = 'transparent';
                },
                recoverPost(post) { // 复原帖子样式
                    post.style.display = 'block';
                    post.style.background = '#fff url(//tb2.bdstatic.com/tb/static-pb/widget/post_list/img/bg_ba2195f.jpg)';
                }
        }
    };

    let page, generalPostList, adPostList;

    // 加载页面信息
    function loadPageInfo() {
        page = pageData[window.location.href.split('/')[3].substring(0, 1)];
        generalPostList = page.getGeneralPostList() == null ? [] : page.getGeneralPostList();
        adPostList = page.getAdPostList() == null ? [] : page.getAdPostList();
    }
    // #endregion

    // #region 净化
    let cleansePostList;

    // 移除广告
    function removeAds() {
        adPostList.forEach( (item) => {
            item.remove();
        });
    }

    // 净化帖子
    function cleansing() {

        cleansePostList = [];
        // 通过帖子信息（标题、作者、内容）判定是否需要屏蔽
        generalPostList.forEach( (item) => {
            try {
                let title = page.getPostTitle(item);
                let author = page.getPostAuthor(item);
                let content = page.getPostContent(item);
                let postText = `${title}${content}`;
                if(usernameList.includes(author) || _includes(postText, keywordList)) {
                    cleansePostList.push(item);
                }
            } catch (error) {
                item.remove();
            }
        });

        switch (cleanseMethod) {
            case 'shield':
                cleansePostList.forEach( (item) => { page.shieldPost(item); });
                break;
            case 'highLight':
                cleansePostList.forEach( (item) => { page.highLightPost(item); });
                break;
            default:
                break;
        }

        function _includes(str, arr) {
            for (let i = 0; i < arr.length; i++) {
                if(str.includes(arr[i])) return true;
            }
            return false;
        }

    }

    // 复原帖子
    function recoverPageUI() {
        if(cleansePostList != null && cleansePostList.length >= 1) {
            cleansePostList.forEach( (item) => { page.recoverPost(item); });
        }
    }
    // #endregion

    // #region 控制面板
    function createCleanseControlPanel() {

        // 面板按钮
        let ul = document.querySelector('ul.tbui_aside_float_bar');
        let li = document.createElement('li');
        li.style = 'height: 52px';
        li.className = 'tbui_aside_fbar_button';
        let div = document.createElement('div');
        div.id = 'ce_cleanseEntrance';
        div.style = 'background-color: #fff; padding: 5px; height: 35px; cursor: pointer';
        div.innerHTML = `<svg t="1719153331127" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11652" width="35" height="35"><path d="M1012.297519 561.529003s-36.97919 12.388029-51.70153 94.389383-83.203178 202.114386-287.23586 119.673904c0 0-67.46391-76.708708-3.073895-177.107209 55.491897-86.485081 131.045005-105.205796 342.011285-36.956078z" fill="#4cd362" p-id="11653"></path><path d="M717.134246 1024h-140.197355c25.839209-314.323117-205.257617-669.76247-205.257618-669.76247s328.167201 218.408342 345.454973 669.76247z" fill="#4cd362" p-id="11654"></path><path d="M187.176226 146.137137c90.321672 3.212567 171.028755 14.005868 240.364737 32.148784 66.701214 17.472667 122.655351 41.740261 166.406355 72.086308 35.962262 25.007177 63.627319 54.336298 82.278699 87.201553a244.409335 244.409335 0 0 1-33.48928 283.052589 254.717284 254.717284 0 0 1-186.51379 81.284883c-8.089198 0-16.317068-0.392904-24.429378-1.1556a279.655126 279.655126 0 0 1-60.992551-12.850269c-99.381574-32.772807-163.471133-85.814833-195.596804-162.223085-34.228863-81.37733-26.856137-173.98709-14.653005-237.337065 11.047533-57.271521 19.783867-104.350652 26.625017-142.208098M71.385137 0S60.152708 76.570036 24.35223 262.113122c-39.082382 202.85397-0.670248 457.617478 303.044463 557.507516a417.079041 417.079041 0 0 0 91.407936 19.206067q18.836275 1.756512 37.372094 1.756512c220.580869 0 405.8235-183.763463 387.957929-413.265563-17.264659-221.482237-209.81068-413.70469-688.991649-420.638288C128.055746 4.137047 100.182682 1.918295 71.338913 0.046224z" fill="#4cd362" p-id="11655"></path><path d="M617.174872 644.616621a254.832844 254.832844 0 0 1-88.126032 46.616891 1122.06419 1122.06419 0 0 1 34.922222 134.326909 393.2968 393.2968 0 0 0 108.811267-49.921907 870.097233 870.097233 0 0 0-55.607457-131.021893z" fill="#4cd362" p-id="11656"></path></svg>`;
        li.appendChild(div);
        ul.insertBefore(li, ul.children[0]);

        // 控制面板CSS
        GM_addStyle('#ce_panel { display: none; z-index: 10001; position: fixed; left: 50%; top: 15px; margin-left: -300px; width: 550px; padding: 10px 25px; background-color: #333; border-radius: 25px; color: #ccc; box-shadow: 0 0 15px black;}');
        GM_addStyle('#ce_panel ul { padding-left: 0; }');
        GM_addStyle('.ce_ranks>li { margin-top: 10px; }');
        GM_addStyle('.ce_vertical_scroll { height:100px; overflow-y: scroll; background-color: #ccc; border-radius: 10px;}');
        GM_addStyle('.ce_vertical_scroll::-webkit-scrollbar { width: 15px;}');
        GM_addStyle('.ce_vertical_scroll::-webkit-scrollbar-button { display: none; }');
        GM_addStyle('.ce_vertical_scroll::-webkit-scrollbar-track { display: none; }');
        GM_addStyle('.ce_vertical_scroll::-webkit-scrollbar-thumb { background: #333; border: 3px solid #ccc; border-radius: 15px; }');
        GM_addStyle('.ce_vertical_scroll>li { height: 24px; display: inline-block; margin: 5px; padding: 0 10px; background-color: #666; color: #ccc; border-radius: 15px;}');
        GM_addStyle('.ce_btn { display: inline-block; text-align: center; vertical-align: middle; cursor: pointer; }');
        GM_addStyle('.ce_btn_a { width: 15px; height: 15px; margin-left: 5px; border-radius: 15px; background-color: red; color: white; line-height: 15px; font-size: 18px; }');
        GM_addStyle('.ce_btn_b { width: 50px; background-color: green; color: white;}');
        GM_addStyle('.ce_btn_c { padding: 0 5px; background-color: rgb(200, 130, 0); color: white; border-radius: 5px; line-height: 38px; font-size: 22px; letter-spacing: 0.5rem;}');
        GM_addStyle('.ce_input_text { color: #333; -webkit-text-fill-color: #333;');

        // 控制面板
        let panel = document.createElement('div');
        panel.id = 'ce_panel';
        panel.innerHTML = `
            <ul class="ce_ranks">
                <li><h1>百度贴吧净化器控制面板</h1></li>
                <li><hr></li>
                <li><h3>关键字列表</h3></li>
                <li><ul id="ce_keywordsUl" class="ce_vertical_scroll"></ul></li>
                <li><input id="ce_keyword" class="ce_input_text" type="text"><span id="ce_keyword_append" class="ce_btn ce_btn_b">添加</span></li>
                <li><h3>用户名列表</h3></li>
                <li><ul id="ce_usernameUl" class="ce_vertical_scroll"></ul></li>
                <li><input id="ce_username" class="ce_input_text" type="text"><span id="ce_username_append" class="ce_btn ce_btn_b">添加</span></li>
                <li>
                    <span>将包含关键字的帖子和这些用户的帖子：</span>
                    <span>
                        <input type="radio" id="ce_cleanseMethodChoice1" name="cleanseMethod" value="shield">
                        <label for="ce_cleanseMethodChoice1">屏蔽</label>
                        <input type="radio" id="ce_cleanseMethodChoice2" name="cleanseMethod" value="highLight">
                        <label for="ce_cleanseMethodChoice2">高亮显示</label>
                    </span>
                </li>
                <li><hr></li>
                <li>
                    <span id="ce_save" class="ce_btn ce_btn_c">保存</span>
                    <span id="ce_undo" class="ce_btn ce_btn_c">撤销</span>
                    <span id="ce_close" class="ce_btn ce_btn_c">关闭</span>
                </li>
            </ul>`;
        document.body.appendChild(panel);
        return panel;
    }

    window.addEventListener('load', function() {

        let panel = createCleanseControlPanel();

        // 开关
        document.getElementById('ce_cleanseEntrance').addEventListener('click', function() {
            if (panel.style.display != 'block') {
                updateKeywordsUI();
                updateUsernameUI();
                updateCleanseMethodUI();
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        });

        // 保存应用
        document.getElementById('ce_save').addEventListener('click', function() {
            if (document.getElementById('ce_cleanseMethodChoice1').checked) {
                cleanseMethod = 'shield';
            } else if (document.getElementById('ce_cleanseMethodChoice2').checked) {
                cleanseMethod = 'highLight';
            }
            saveLocalStorage();
            recoverPageUI();
            cleansing();
            panel.style.display = 'none';
        });

        // 撤销修改
        document.getElementById('ce_undo').addEventListener('click', function() {
            loadLocalStorage();
            updateKeywordsUI();
            updateUsernameUI();
            updateCleanseMethodUI();
        });

        // 关闭页面
        document.getElementById('ce_close').addEventListener('click', function() {
            panel.style.display = 'none';
        });

        // 添加关键字
        document.getElementById('ce_keyword_append').addEventListener('click', function() {
            keywordList.push(document.getElementById('ce_keyword').value);
            document.getElementById('ce_keyword').value = '';
            updateKeywordsUI();
        });

        // 添加用户名
        document.getElementById('ce_username_append').addEventListener('click', function() {
            usernameList.push(document.getElementById('ce_username').value);
            document.getElementById('ce_username').value = '';
            updateUsernameUI();
        });

        function updateKeywordsUI() {
            let titleUl = document.getElementById('ce_keywordsUl');
            let str = '';
            if (keywordList != null) {
                keywordList.forEach( (item, index) => {
                    str += `<li><span>${item}</span><span class="ce_btn ce_btn_a" data-index="${index}">×</span></li>`;
                });
            }
            titleUl.innerHTML = str;
            setTimeout(null, 250);
            titleUl.querySelectorAll('.ce_btn_a').forEach( (item) => {
                item.addEventListener('click', function() {
                    keywordList.splice(Number(item.dataset.index), 1);
                    updateKeywordsUI();
                });
            });
        }

        function updateUsernameUI() {
            let usernameUl = document.getElementById('ce_usernameUl');
            let str = '';
            if (usernameList != null) {
                usernameList.forEach( (item, index) => {
                    str += `<li><span>${item}</span><span class="ce_btn ce_btn_a" data-index="${index}">×</span></li>`;
                });
            }
            usernameUl.innerHTML = str;
            setTimeout(null, 250);
            usernameUl.querySelectorAll('.ce_btn_a').forEach( (item) => {
                item.addEventListener('click', function() {
                    usernameList.splice(Number(item.dataset.index), 1);
                    updateUsernameUI();
                });
            });
        }

        function updateCleanseMethodUI() {
            if(cleanseMethod == 'shield') {
                document.getElementById('ce_cleanseMethodChoice1').checked = true;
            } else if(cleanseMethod == 'highLight') {
                document.getElementById('ce_cleanseMethodChoice2').checked = true;
            }
        }

    });
    // #endregion

    // #region 入口
    // 页面加载完毕
    window.addEventListener('load', function() {
        loadLocalStorage();
        loadPageInfo();
        removeAds();
        cleansing();
    });

    // 翻页时等到广告出现，清除广告净化帖子
    let setIntervalId;
    window.addEventListener('urlchange', function() {
        setIntervalId = setInterval(() => {
            if (page.getAdPostList() != null && page.getAdPostList().length >= 1) {
                loadPageInfo();
                setTimeout(null, 250);
                loadPageInfo();
                removeAds();
                cleansing();
                clearInterval(setIntervalId);
            }
        }, 1000);
    });

    // 关闭页面时清除循环计时器
    window.addEventListener('unload', function() {
        if (setIntervalId != null) clearInterval(setIntervalId);
    });
    // #endregion

})();