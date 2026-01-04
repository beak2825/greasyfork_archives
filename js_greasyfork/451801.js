// ==UserScript==
// @name         Hitomi的MR小助手
// @namespace    https://github.com/iMortRex
// @version      0.0.71
// @description  汉化标签，优化布局，屏蔽标签，去除广告
// @author       Mort Rex
// @match        https://hitomi.la/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         http://www.google.com/s2/favicons?domain=hitomi.la
// @run-at       document-head
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451801/Hitomi%E7%9A%84MR%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/451801/Hitomi%E7%9A%84MR%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 油猴菜单
    // 模式 0.翻页 1.全加载
    if (GM_getValue('mode') == null) {
        GM_setValue('mode', 0);
    }
    // 折叠标签 0.折叠 1.不折叠
    if (!GM_getValue('foldTags') == null) {
        GM_setValue('foldTags', 1);
    }
    // 屏蔽标签 0.关闭 1.开启
    if (!GM_getValue('blockTags') == null) {
        GM_setValue('blockTags', 1);
    }
    // 屏蔽类型 0.关闭 1.开启
    if (!GM_getValue('blockTypes') == null) {
        GM_setValue('blockTypes', 1);
    }
    // 全加载模式折叠图片 0.关闭 1.开启
    if (!GM_getValue('foldImg') == null) {
        GM_setValue('foldImg', 0);
    }

    var modeText = '';
    if (GM_getValue('mode') == 0) {
        modeText = '翻页';
    } else {
        modeText = '全加载';
    }
    var foldTagsText = '';
    if (GM_getValue('foldTags') == 0) {
        foldTagsText = '折叠';
    } else {
        foldTagsText = '不折叠';
    }
    var blockTagsText = '';
    if (GM_getValue('blockTags') == 0) {
        blockTagsText = '关闭';
    } else {
        blockTagsText = '开启';
    }
    var blockTypesText = '';
    if (GM_getValue('blockTypes') == 0) {
        blockTypesText = '关闭';
    } else {
        blockTypesText = '开启';
    }
    var foldImgText = '';
    if (GM_getValue('foldImg') == 0) {
        foldImgText = '关闭';
    } else {
        foldImgText = '开启';
    }
    var modeMenu = GM_registerMenuCommand('[' + modeText + ']模式', function () {
        if (GM_getValue('mode') == 0) {
            GM_setValue('mode', 1);
            alert('切换为[全加载模式]');
            location.reload();
        } else if (GM_getValue('mode') == 1) {
            GM_setValue('mode', 0);
            alert('切换为[翻页模式]');
            location.reload();
        }
    });
    var foldTagsMenu = GM_registerMenuCommand('[' + foldTagsText + ']是否折叠标签', function () {
        if (GM_getValue('foldTags') == 0) {
            GM_setValue('foldTags', 1);
            alert('切换为[不折叠标签]');
            
        } else if (GM_getValue('foldTags') == 1) {
            GM_setValue('foldTags', 0);
            alert('切换为[折叠标签]');
            
        }
    });
    var blockTags = ['扶她X男人', 'dickgirl on male', '男3P', 'mmm threesome', '扶扶男3P', 'ttm threesome', '男同', 'yaoi', '纯男性⚣', 'males only', '男上扶', 'male on dickgirl', '兄弟', 'brother', '小说', 'novel'];
    var blockTagsMenu = GM_registerMenuCommand('[' + blockTagsText + ']屏蔽标签', function () {
        if (GM_getValue('blockTags') == 0) {
            GM_setValue('blockTags', 1);
            alert('切换为[开启]');
            location.reload();
        } else if (GM_getValue('blockTags') == 1) {
            GM_setValue('blockTags', 0);
            alert('切换为[关闭]');
            location.reload();
        }
    });
    var blockTypes = ['image set', '游戏CG', 'game CG', '画师CG', 'artist CG'];
    var blockTypesMenu = GM_registerMenuCommand('[' + blockTypesText + ']屏蔽类型', function () {
        if (GM_getValue('blockTypes') == 0) {
            GM_setValue('blockTypes', 1);
            alert('切换为[开启]');
            location.reload();
        } else if (GM_getValue('blockTypes') == 1) {
            GM_setValue('blockTypes', 0);
            alert('切换为[关闭]');
            location.reload();
        }
    });
    var foldImgMenu = GM_registerMenuCommand('[' + foldImgText + ']全加载模式折叠图片', function () {
        if (GM_getValue('foldImg') == 0) {
            GM_setValue('foldImg', 1);
            alert('切换为[开启]');
            location.reload();
        } else if (GM_getValue('foldImg') == 1) {
            GM_setValue('foldImg', 0);
            alert('切换为[关闭]');
            location.reload();
        }
    });

    /* GM_deleteValue('updateLock');
    GM_deleteValue('lastUpdateTime');
    GM_deleteValue('zhJson');
    localStorage.removeItem('updateLock');
    localStorage.removeItem('lastUpdateTime');
    localStorage.removeItem('zhJson'); */

    // 数据库加载锁
    if (!GM_getValue('updateLock')) {
        GM_setValue('updateLock', 0);
    }
    // 是否已缓存数据库
    if (!GM_getValue('zhJson')) {
        console.log('[通知]正在发起首次数据库加载请求');
    } else {
        console.log('[通知]已存在缓存的数据库\n数据库作者更新时间：' + $.parseJSON(GM_getValue('zhJson')).head.author.when + '\n数据库提交更新时间：' + $.parseJSON(GM_getValue('zhJson')).head.committer.when);
    }
    // 获取/更新数据库
    if (!GM_getValue('lastUpdateTime') || !GM_getValue('zhJson')) {
        GM_setValue('lastUpdateTime', new Date().getTime());
        GM_setValue('updateLock', 0);
    } else if (GM_getValue('lastUpdateTime') + (86400000 * 5) < new Date().getTime()) {
        GM_setValue('lastUpdateTime', new Date().getTime());
        GM_setValue('updateLock', 0);
    }
    if (GM_getValue('updateLock') == 0) {
        getData();
    }
    function getData() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://github.com/EhTagTranslation/Database/releases/latest/download/db.text.json',
            onload: function (res) {
                GM_setValue('updateLock', 1);
                // 加载数据库
                if (!GM_getValue('zhJson')) {
                    GM_setValue('zhJson', res.responseText);
                    console.log('[通知]首次加载数据库完毕' + '\n数据库文件大小：' + (res.responseText.length / 1024 / 1024).toString().substring(0, 4) + ' MB' + '\n数据库作者更新时间：' + $.parseJSON(GM_getValue('zhJson')).head.author.when + '\n数据库提交更新时间：' + $.parseJSON(GM_getValue('zhJson')).head.committer.when);
                    transformToZH();
                } else if ($.parseJSON(GM_getValue('zhJson')).head.author.when != $.parseJSON(res.responseText).head.author.when && $.parseJSON(GM_getValue('zhJson')).head.committer.when != $.parseJSON(res.responseText).head.committer.when) {
                    GM_setValue('zhJson', res.responseText);
                    console.log('[通知]已更新数据库' + '\n原数据库文件大小：' + (GM_getValue('zhJson').length / 1024 / 1024).toString().substring(0, 4) + ' MB' + '\n新数据库文件大小：' + (res.responseText.length / 1024 / 1024).toString().substring(0, 4) + ' MB' + '\n原数据库作者更新时间：' + $.parseJSON(GM_getValue('zhJson')).head.author.when + '\n新数据库作者更新时间：' + $.parseJSON(res.responseText).head.author.when + '\n原数据库提交更新时间：' + $.parseJSON(GM_getValue('zhJson')).head.committer.when + '\n新数据库提交更新时间：' + $.parseJSON(res.responseText).head.committer.when);
                } else {
                    console.log('[通知]已有数据库与加载数据库相同，无需更新');
                }
            },
            onabort: function () {
                console.log('[注意]数据库加载请求被终止');
            },
            onerror: function () {
                console.log('[警告]数据库加载失败');
            },
            onprogress: function (res) {
                console.log('[通知]正在加载数据库\n已加载：' + (res.responseText.length / 1024 / 1024).toString().substring(0, 4) + ' MB');
            }
        });
    }

    // 词语修正
    var wordFix = {
        // 标签
        'loli': 'lolicon',
        'shota': 'shotacon',
        // 类型
        'artist CG': 'artistcg',
        'game CG': 'gamecg'
    }
    // 词语替换
    var wordReplace = {
        // 标签
        'footjob': '足交🦶🏻',
        'food on body': '人体盛宴'
    }

    // 标签汉化
    var tagsZHLoopTimeout = 0;
    // 让脚本只执行一次的开关
    var tagsSwitch = 0;
    var postsSwitch = 0;
    var topTitleSwitch = 0;
    var artistNameSwitch = 0;
    var listTitleSwitch = 0;
    var orderSwitch = 0;
    var transformLock = 1;

    // 汉化
    var zhJson = '';
    var zhJsonData = '';
    transformToZH();
    function transformToZH() {
        if (GM_getValue('zhJson')) {
            zhJson = $.parseJSON(GM_getValue('zhJson'));
            zhJsonData = zhJson['data'];
            transformLock = 0;
            // 词语替换
            for (let i1 = 0; i1 < zhJsonData.length - 1; i1++) {
                for (let replaceI = 0; replaceI < Object.keys(wordReplace).length; replaceI++) {
                    if (zhJsonData[i1 + 1].data[Object.keys(wordReplace)[replaceI].toString()] && zhJsonData[i1 + 1].namespace != 'group' && zhJsonData[i1 + 1].namespace != 'artist') {
                        zhJsonData[i1 + 1].data[Object.keys(wordReplace)[replaceI].toString()].name = wordReplace[Object.keys(wordReplace)[replaceI].toString()];
                    }
                }
            }
        }
    }

    // 隐藏元素
    // 标记
    GM_addStyle('.badge {display: none !important;');

    let pageNumber = '';
    let pageNumberSwitch = 0;
    tagsZHLoop();
    function tagsZHLoop() {
        // 主页&搜索页&详情页
        function tagsEachFunction() {
            let tagMark = '';
            if (this.textContent.match('♀')) {
                tagMark = ' ♀';
            } else if (this.textContent.match('♂')) {
                tagMark = ' ♂';
            }
            let tagName = '';
            if (tagMark != '') {
                tagName = this.textContent.replace('♀', '').replace('♂', '').substring(0, this.textContent.length - 2);
            } else {
                tagName = this.textContent;
            }
            for (let replaceI = 0; replaceI < Object.keys(wordFix).length; replaceI++) {
                if (Object.keys(wordFix)[replaceI].toString() == tagName) {
                    tagName = wordFix[Object.keys(wordFix)[replaceI].toString()];
                }
            }
            for (let i1 = 0; i1 < zhJsonData.length - 1; i1++) {
                if (zhJsonData[i1 + 1].data[tagName] && zhJsonData[i1 + 1].namespace != 'group' && zhJsonData[i1 + 1].namespace != 'artist') {
                    tagsSwitch = 1;
                    this.textContent = zhJsonData[i1 + 1].data[tagName].name + tagMark;
                    return;
                }
            }
        }
        if (!document.getElementsByClassName('posts')[0] && tagsSwitch == 0 && transformLock == 0) {
            // 汉化body下所有textContent
            $('body a').each(tagsEachFunction);
            console.log('[通知]标签汉化中');
            let relateLoopTimeout = 0;
            relateLoop();
            function relateLoop() {
                if (document.getElementsByClassName('relatedtags')[0]) {
                    console.log('[通知]标签二次汉化中');
                    $('body a').each(tagsEachFunction);
                    // $('#related-content a').each(tagsEachFunction);
                } else if (relateLoopTimeout < 10000) {
                    relateLoopTimeout += 200;
                    setTimeout(relateLoop, 200);
                }
            }
        }
        // 增加展开按钮
        if (document.getElementsByClassName('relatedtags')[0]) {
            for (let i = 0; i < document.getElementsByClassName('relatedtags').length; i++) {
                if (document.getElementsByClassName('relatedtags')[i].children[0].children[document.getElementsByClassName('relatedtags')[i].children[0].children.length - 1] && document.getElementsByClassName('relatedtags')[i].children[0].children[document.getElementsByClassName('relatedtags')[i].children[0].children.length - 1].textContent == '...') {
                    document.getElementsByClassName('relatedtags')[i].children[0].children[document.getElementsByClassName('relatedtags')[i].children[0].children.length - 1].remove();
                    if (GM_getValue('foldTags') == 0) {
                        let openBtnLi = document.createElement('LI');
                        let openBtnA = document.createElement('A');
                        openBtnA.textContent = '展开⭐';

                        openBtnA.onclick = function () {
                            if (this.textContent == '展开⭐') {
                                this.textContent = '收起🌟';
                                for (let i1 = 0; i1 < this.parentNode.parentNode.children.length; i1++) {
                                    if (this.parentNode.parentNode.children[i1].className) {
                                        this.parentNode.parentNode.children[i1].style.cssText += 'display: inline-block !important;';
                                    }
                                }
                            } else {
                                this.textContent = '展开⭐';
                                for (let i1 = 0; i1 < this.parentNode.parentNode.children.length; i1++) {
                                    if (this.parentNode.parentNode.children[i1].className) {
                                        this.parentNode.parentNode.children[i1].style.cssText += 'display: none !important;';
                                    }
                                }
                            }
                        }
                        openBtnLi.appendChild(openBtnA);
                        document.getElementsByClassName('relatedtags')[i].children[0].appendChild(openBtnLi);
                    } else {
                        for (let i1 = 0; i1 < document.getElementsByClassName('relatedtags')[i].children[0].children.length; i1++) {
                            if (document.getElementsByClassName('relatedtags')[i].children[0].children[i1].className) {
                                document.getElementsByClassName('relatedtags')[i].children[0].children[i1].style.cssText += 'display: inline-block !important;';
                            }
                        }
                    }
                }
            }
        }
        // 标签页
        if (document.getElementsByClassName('posts')[0] && postsSwitch == 0 && transformLock == 0) {
            function postsEachFunction() {
                let tagMark = '';
                if (this.textContent.match('♀')) {
                    tagMark = ' ♀';
                } else if (this.textContent.match('♂')) {
                    tagMark = ' ♂';
                }
                let tagName = '';
                if (tagMark != '') {
                    tagName = this.textContent.replace('♀', '').replace('♂', '').substring(0, this.textContent.length - 2);
                } else {
                    tagName = this.textContent;
                }
                for (let replaceI = 0; replaceI < Object.keys(wordFix).length; replaceI++) {
                    if (Object.keys(wordFix)[replaceI].toString() == tagName) {
                        tagName = wordFix[Object.keys(wordFix)[replaceI].toString()];
                    }
                }
                for (let i1 = 0; i1 < zhJsonData.length - 1; i1++) {
                    if (zhJsonData[i1 + 1].data[tagName] && zhJsonData[i1 + 1].namespace != 'group' && zhJsonData[i1 + 1].namespace != 'artist') {
                        this.textContent = zhJsonData[i1 + 1].data[tagName].name + tagMark + ' ' + this.textContent.replace('♀', '').replace('♂', '');
                        return;
                    }
                }
            }
            $('.posts a').each(postsEachFunction);
            console.log('[通知]标签二次汉化中');
        }
        // 标签页目录修正
        if (document.getElementsByClassName('page-content')[0] && postsSwitch == 0) {
            document.getElementsByClassName('page-content')[0].style.cssText += 'overflow: auto hidden !important;';
            document.getElementsByClassName('page-content')[1].style.cssText += 'overflow: auto hidden !important; width: calc(100vw - 60px) !important;';
            document.getElementsByClassName('posts')[0].style.cssText += 'float: none !important; padding: 0px 0px 16px 16px !important;';
            document.getElementsByTagName('html')[0].style.cssText += 'overflow-x: hidden !important;';
            document.getElementsByTagName('body')[0].style.cssText += 'overflow-x: hidden !important;';
            GM_addStyle('.page-content ul li {margin: 0px 4px 0px 0px}');
            // 目录滚动到当前字母
            for (let i = 0; i < document.getElementsByClassName('page-content')[0].children[0].children.length; i++) {
                if (!document.getElementsByClassName('page-content')[0].children[0].children[i].children[0]) {
                    document.getElementsByClassName('page-content')[0].scroll(document.getElementsByClassName('page-content')[0].children[0].children[i].offsetLeft, 0);
                    document.getElementsByClassName('page-content')[1].scroll(document.getElementsByClassName('page-content')[0].children[0].children[i].offsetLeft, 0);
                }
            }
            // 标签标题
            document.getElementsByClassName('list-title')[0].children[0].textContent = document.getElementsByClassName('list-title')[0].children[0].textContent.replace('All tags', '所有标签');

            postsSwitch = 1;
        }
        // 主页标题
        // 页数
        if (document.getElementsByClassName('page-container')[0] && document.getElementsByClassName('page-container')[0].children[0] && document.getElementsByClassName('page-container')[0].children[0].children[0] && pageNumberSwitch == 0) {
            pageNumberSwitch = 1;
            for (let pageI = 0; pageI < document.getElementsByClassName('page-container')[0].children[0].children.length; pageI++) {
                if (!document.getElementsByClassName('page-container')[0].children[0].children[pageI].children[0] && document.getElementsByClassName('page-container')[0].children[0].children[pageI].textContent != '...') {
                    pageNumber = '' + document.getElementsByClassName('page-container')[0].children[0].children[pageI].textContent + '⚡️';
                    document.getElementsByClassName('page-container')[0].children[0].children[pageI].textContent = '［' + document.getElementsByClassName('page-container')[0].children[0].children[pageI].textContent + '］';
                    document.getElementsByClassName('page-container')[1].children[0].children[pageI].textContent = '［' + document.getElementsByClassName('page-container')[1].children[0].children[pageI].textContent + '］';
                    document.getElementsByClassName('page-container')[0].style.cssText += 'padding: 10px 30px 10px 30px;'
                    document.getElementsByClassName('gallery-content')[0].style.cssText += 'padding: 0px 10px 0px 10px;'
                    document.getElementsByClassName('page-container')[1].style.cssText += 'padding: 10px 30px 10px 30px;'
                }
            }
        }
        if (document.getElementById('artistname')) {
            function artistNameEachFunction() {
                let tagName = this.textContent;
                for (let replaceI = 0; replaceI < Object.keys(wordFix).length; replaceI++) {
                    if (Object.keys(wordFix)[replaceI].toString() == tagName) {
                        tagName = wordFix[Object.keys(wordFix)[replaceI].toString()];
                    }
                }
                for (let i1 = 0; i1 < zhJsonData.length - 1; i1++) {
                    if (zhJsonData[i1 + 1].data[tagName] && zhJsonData[i1 + 1].namespace != 'group' && zhJsonData[i1 + 1].namespace != 'artist') {
                        topTitleSwitch = 1;
                        this.textContent = zhJsonData[i1 + 1].data[tagName].name + ' ' + this.textContent;
                        return;
                    }
                }
            }
            // 背景
            if (document.getElementsByClassName('list-title')[0] && listTitleSwitch == 0) {
                document.getElementsByClassName('list-title')[0].style.cssText += 'height: 50px !important; overflow: auto hidden !important;';
                listTitleSwitch = 1;
            }
            // 标题
            if (document.getElementById('artistname') && artistNameSwitch == 0) {
                document.getElementById('artistname').style.cssText += 'top: 0 !important; padding: 6px 6px 0px 10px !important;';
                artistNameSwitch = 1;
            }
            // 排序
            if (document.getElementsByClassName('top-content')[0] && document.getElementById('orderbydropdown') && orderSwitch == 0) {
                document.getElementById('orderbydropdown').style.cssText += 'width: 100% !important;';
                document.getElementsByClassName('top-content')[0].appendChild(document.getElementById('orderbydropdown'));
                orderSwitch = 1;
            }
            if (topTitleSwitch == 0 && transformLock == 0) {
                if (document.getElementById('artistname').textContent == 'Recently Added') {
                    document.getElementById('artistname').textContent = '最近添加 ' + document.getElementById('artistname').textContent;
                } else {
                    $('#artistname').each(artistNameEachFunction);
                }
                if (pageNumberSwitch == 1) {
                    if (document.getElementById('artistname')) {
                        pageNumberSwitch = 2;
                        document.getElementById('artistname').textContent = pageNumber + document.getElementById('artistname').textContent;
                    }
                }
            }
        }

        if (tagsZHLoopTimeout < 2000) {
            // tagsZHLoopTimeout += 200;
            setTimeout(tagsZHLoop, 500);
        }
    }

    // 导航栏汉化
    var navBarZHLoopTimeout = 0;
    navBarZHLoop();
    function navBarZHLoop() {
        if (document.getElementsByClassName('navbar')[0]) {
            if (document.getElementsByClassName('navbar')[0].children[1].children[0].children[0]) {
                document.getElementsByClassName('navbar')[0].children[1].children[0].children[0].children[0].textContent = '标签';
            }
            if (document.getElementsByClassName('navbar')[0].children[1].children[0].children[1]) {
                document.getElementsByClassName('navbar')[0].children[1].children[0].children[1].children[0].textContent = '作者';
            }
            if (document.getElementsByClassName('navbar')[0].children[1].children[0].children[2]) {
                document.getElementsByClassName('navbar')[0].children[1].children[0].children[2].children[0].textContent = '系列';
            }
            if (document.getElementsByClassName('navbar')[0].children[1].children[0].children[3]) {
                document.getElementsByClassName('navbar')[0].children[1].children[0].children[3].children[0].textContent = '角色';
            }
            if (document.getElementsByClassName('navbar')[0].children[1].children[0].children[4]) {
                document.getElementsByClassName('navbar')[0].children[1].children[0].children[4].children[0].textContent = '语言✨';
            }
        } else if (navBarZHLoopTimeout < 2000) {
            navBarZHLoopTimeout += 200;
            setTimeout(navBarZHLoop, 200);
        }
    }

    // 去广告
    var adRemoveLoopTimeout = 0;
    var bodyElementsName = ['container', 'notice'];
    var containerElementsName = ['navbar', 'top-content', 'content', 'page-content', 'page-container', 'gallery-content', 'nozomi-link', 'bottom-content'];
    var topContentElementsName = ['list-title'];
    var contentElementsName = ['cover-column', 'gallery', 'gallery-preview'];
    adRemoveCheckLoop();
    function adRemoveCheckLoop() {
        // body广告
        if (document.getElementsByTagName('body')[0]) {
            for (let i = 0; i < document.getElementsByTagName('body')[0].children.length; i++) {
                if (document.getElementsByTagName('body')[0].children[i]) {
                    if (document.getElementsByTagName('body')[0].children[i].getAttribute('class')) {
                        let removeSwitch = 0;
                        for (let i2 = 0; i2 < bodyElementsName.length; i2++) {
                            if (!document.getElementsByTagName('body')[0].children[i].getAttribute('class').match(bodyElementsName[i2]) && !document.getElementsByTagName('body')[0].children[i].getAttribute('class').match('darkreader')) {
                                removeSwitch = 1;
                            } else {
                                removeSwitch = 0;
                                break;
                            }
                        }
                        if (removeSwitch == 1) {
                            console.log('[通知]移除广告：body   ' + document.getElementsByTagName('body')[0].children[i].getAttribute('class'));
                            document.getElementsByTagName('body')[0].children[i].remove();
                        }
                    } else if (document.getElementsByTagName('body')[0].children[i].getAttribute('id')) {
                        let removeSwitch = 0;
                        for (let i2 = 0; i2 < bodyElementsName.length; i2++) {
                            if (!document.getElementsByTagName('body')[0].children[i].getAttribute('id').match(bodyElementsName[i2])) {
                                removeSwitch = 1;
                            } else {
                                removeSwitch = 0;
                                break;
                            }
                        }
                        if (removeSwitch == 1) {
                            console.log('[通知]移除广告：body   ' + document.getElementsByTagName('body')[0].children[i].getAttribute('id'));
                            document.getElementsByTagName('body')[0].children[i].remove();
                        }
                    } else if (document.getElementsByTagName('body')[0].children[i].getAttribute('tabi') != 1 && document.getElementsByTagName('body')[0].children[i].getAttribute('type') != 'text/css') {
                        console.log('[通知]移除广告：body   ' + document.getElementsByTagName('body')[0].children[i].tagName);
                        document.getElementsByTagName('body')[0].children[i].remove();
                    }
                }
            }
        }

        if (document.getElementsByClassName('container')[0]) {
            for (let i = 0; i < document.getElementsByClassName('container')[0].children.length; i++) {
                if (document.getElementsByClassName('container')[0].children[i] && document.getElementsByClassName('container')[0].children[i].tagName == 'DIV') {
                    if (document.getElementsByClassName('container')[0].children[i].getAttribute('class')) {
                        let removeSwitch = 0;
                        for (let i2 = 0; i2 < containerElementsName.length; i2++) {
                            if (!document.getElementsByClassName('container')[0].children[i].getAttribute('class').match(containerElementsName[i2]) && !document.getElementsByClassName('container')[0].children[i].getAttribute('class').match('darkreader')) {
                                removeSwitch = 1;
                            } else {
                                removeSwitch = 0;
                                break;
                            }
                        }
                        if (removeSwitch == 1) {
                            console.log('[通知]移除广告：container   ' + document.getElementsByClassName('container')[0].children[i].getAttribute('class'));
                            document.getElementsByClassName('container')[0].children[i].remove();
                        }
                    } else if (document.getElementsByClassName('container')[0].children[i].getAttribute('id')) {
                        let removeSwitch = 0;
                        for (let i2 = 0; i2 < containerElementsName.length; i2++) {
                            if (!document.getElementsByClassName('container')[0].children[i].getAttribute('id').match(containerElementsName[i2])) {
                                removeSwitch = 1;
                            } else {
                                removeSwitch = 0;
                                break;
                            }
                        }
                        if (removeSwitch == 1) {
                            console.log('[通知]移除广告：container   ' + document.getElementsByClassName('container')[0].children[i].getAttribute('id'));
                            document.getElementsByClassName('container')[0].children[i].remove();
                        }
                    } else {
                        console.log('[通知]移除广告：container   ' + document.getElementsByClassName('container')[0].children[i].tagName);
                        document.getElementsByClassName('container')[0].children[i].remove();
                    }
                }
            }
        }

        if (document.getElementsByClassName('top-content')[0]) {
            for (let i = 0; i < document.getElementsByClassName('top-content')[0].children.length; i++) {
                if (document.getElementsByClassName('top-content')[0].children[i] && document.getElementsByClassName('top-content')[0].children[i].tagName == 'DIV') {
                    if (document.getElementsByClassName('top-content')[0].children[i].getAttribute('class')) {
                        let removeSwitch = 0;
                        for (let i2 = 0; i2 < topContentElementsName.length; i2++) {
                            if (!document.getElementsByClassName('top-content')[0].children[i].getAttribute('class').match(topContentElementsName[i2]) && !document.getElementsByClassName('container')[0].children[i].getAttribute('class').match('darkreader')) {
                                removeSwitch = 1;
                            } else {
                                removeSwitch = 0;
                                break;
                            }
                        }
                        if (removeSwitch == 1) {
                            console.log('[通知]移除广告：top-content   ' + document.getElementsByClassName('top-content')[0].children[i].getAttribute('class'));
                            document.getElementsByClassName('top-content')[0].children[i].remove();
                        }
                    } else if (document.getElementsByClassName('top-content')[0].children[i].getAttribute('id')) {
                        let removeSwitch = 0;
                        for (let i2 = 0; i2 < topContentElementsName.length; i2++) {
                            if (!document.getElementsByClassName('top-content')[0].children[i].getAttribute('id').match(topContentElementsName[i2])) {
                                removeSwitch = 1;
                            } else {
                                removeSwitch = 0;
                                break;
                            }
                        }
                        if (removeSwitch == 1) {
                            console.log('[通知]移除广告：top-content   ' + document.getElementsByClassName('top-content')[0].children[i].getAttribute('id'));
                            document.getElementsByClassName('top-content')[0].children[i].remove();
                        } else {
                            break;
                        }
                    } else {
                        console.log('通知]移除广告：top-content   ' + document.getElementsByClassName('top-content')[0].children[i].tagName);
                        document.getElementsByClassName('top-content')[0].children[i].remove();
                    }
                }
            }
        }

        if (document.getElementsByClassName('content')[0]) {
            for (let i = 0; i < document.getElementsByClassName('content')[0].children.length; i++) {
                if (document.getElementsByClassName('content')[0].children[i] && document.getElementsByClassName('content')[0].children[i].tagName == 'DIV') {
                    if (document.getElementsByClassName('content')[0].children[i].getAttribute('class')) {
                        let removeSwitch = 0;
                        for (let i2 = 0; i2 < contentElementsName.length; i2++) {
                            if (!document.getElementsByClassName('content')[0].children[i].getAttribute('class').match(contentElementsName[i2]) && !document.getElementsByClassName('container')[0].children[i].getAttribute('class').match('darkreader')) {
                                removeSwitch = 1;
                            } else {
                                removeSwitch = 0;
                                break;
                            }
                        }
                        if (removeSwitch == 1) {
                            console.log('[通知]移除广告：content   ' + document.getElementsByClassName('content')[0].children[i].getAttribute('class'));
                            document.getElementsByClassName('content')[0].children[i].remove();
                        }
                    } else if (document.getElementsByClassName('content')[0].children[i].getAttribute('id')) {
                        let removeSwitch = 0;
                        for (let i2 = 0; i2 < contentElementsName.length; i2++) {
                            if (!document.getElementsByClassName('content')[0].children[i].getAttribute('id').match(contentElementsName[i2])) {
                                removeSwitch = 1;
                            } else {
                                removeSwitch = 0;
                                break;
                            }
                        }
                        if (removeSwitch == 1) {
                            console.log('[通知]移除广告：content   ' + document.getElementsByClassName('content')[0].children[i].getAttribute('id'));
                            document.getElementsByClassName('content')[0].children[i].remove();
                        }
                    } else {
                        console.log('[通知]移除广告：content   ' + document.getElementsByClassName('content')[0].children[i].tagName);
                        document.getElementsByClassName('content')[0].children[i].remove();
                    }
                }
            }
        }

        // head广告
        if (document.head) {
            for (let i = 0; i < document.head.children.length; i++) {
                if (document.head.children[i].tagName == 'SCRIPT') {
                    if (document.head.children[i].src != '' && !document.head.children[i].src.match('hitomi') && !document.head.children[i].src.match('extension')) {
                        console.log('[通知]移除广告：head   ' + document.head.children[i].src);
                        document.head.children[i].src = '';
                    }
                }
            }
        }

        // html广告
        if (document.documentElement) {
            for (let i = 0; i < document.documentElement.children.length; i++) {
                if (document.documentElement.children[i].tagName == 'SCRIPT') {
                    if (document.documentElement.children[i].src != '' && !document.documentElement.children[i].src.match('hitomi') && !document.documentElement.children[i].src.match('extension')) {
                        console.log('[通知]移除广告：html   ' + document.documentElement.children[i].src);
                        document.documentElement.children[i].src = '';
                    }
                }
            }
        }

        if (adRemoveLoopTimeout < 10000) {
            adRemoveLoopTimeout += 200;
            setTimeout(adRemoveCheckLoop, 200);
        }
    }

    // 杂项功能
    var loopTimeout = 0;
    checkLoop();
    function checkLoop() {
        // 去除图片上方脚本
        if (document.getElementsByClassName('lazyload')) {
            for (let i = 0; i < document.getElementsByClassName('lazyload').length; i++) {
                if (document.getElementsByClassName('lazyload')[i] && document.getElementsByClassName('lazyload')[i].previousSibling) {
                    document.getElementsByClassName('lazyload')[i].previousSibling.remove();
                }
            }
        }

        // 改详情页布局
        // 上方整体左右空隙
        if (document.getElementsByClassName('container')[0]) {
            document.getElementsByClassName('container')[0].style.cssText = 'margin: 0px !important; padding: 0px !important; border: 0px !important; box-shadow: 0 0 0 !important;';
        }
        if (document.getElementsByClassName('content')[0]) {
            document.getElementsByClassName('content')[0].style.cssText = 'padding: 0px !important; overflow: unset !important;';
        }
        // 封面填满并居中
        if (document.getElementsByClassName('cover-column')[0]) {
            document.getElementsByClassName('cover-column')[0].style.cssText = 'float: revert !important; overflow: unset !important; margin: 0px !important; display: none !important;';
        }
        if (document.getElementsByClassName('cover')[0] && document.getElementsByClassName('cover')[0].children[0] && document.getElementsByClassName('cover')[0].children[0].children[0] && document.getElementsByClassName('cover')[0].children[0].children[0].children[1]) {
            document.getElementsByClassName('cover')[0].children[0].children[0].children[1].style.cssText = 'max-height: none !important; max-width: none !important; border: 0px !important;';
            document.getElementsByClassName('cover')[0].children[0].children[0].children[1].setAttribute('width', '100%');
            document.getElementsByClassName('cover')[0].children[0].children[0].children[1].setAttribute('height', 'auto');
        }
        // 图片填满
        if (document.getElementsByClassName('gallery-preview')[0]) {
            document.getElementsByClassName('gallery-preview')[0].style.cssText = 'padding: 0px !important;'
        }
        // 详情页底部标签修正
        if (document.getElementById('related') && document.getElementById('related-content') && document.getElementById('related-content').children[0] && document.getElementById('related-content').children[0].getAttribute('id') != 'related') {
            $('#related-content').prepend($('#related'));
        }
        // 详情页标签宽度修正
        if (document.getElementById('groups') && document.getElementById('groups').children[0]) {
            document.getElementById('groups').children[0].style.cssText += 'width: 290px !important;';
        } else if (document.getElementById('groups')) {
            document.getElementById('groups').style.cssText += 'width: 290px !important;';
        }
        if (document.getElementById('type') && document.getElementById('type').children[0]) {
            document.getElementById('type').children[0].style.cssText += 'width: 290px !important;';
        } else if (document.getElementById('type')) {
            document.getElementById('type').style.cssText += 'width: 290px !important;';
        }
        if (document.getElementById('language') && document.getElementById('language').children[0]) {
            document.getElementById('language').children[0].style.cssText += 'width: 290px !important;';
        } else if (document.getElementById('language')) {
            document.getElementById('language').style.cssText += 'width: 290px !important;';
        }
        if (document.getElementById('series') && document.getElementById('series').children[0]) {
            document.getElementById('series').children[0].style.cssText += 'width: 290px !important;';
        } else if (document.getElementById('series')) {
            document.getElementById('series').style.cssText += 'width: 290px !important;';
        }
        if (document.getElementById('characters') && document.getElementById('characters').children[0]) {
            document.getElementById('characters').children[0].style.cssText += 'width: 290px !important;';
        } else if (document.getElementById('characters')) {
            document.getElementById('characters').style.cssText += 'width: 290px !important;';
        }
        if (document.getElementById('tags')) {
            document.getElementById('tags').style.cssText += 'width: 290px !important;';
        }

        if (loopTimeout < 10000) {
            loopTimeout += 200;
            setTimeout(checkLoop, 200);
        }
    }
    // 屏蔽指定类型内容
    var blockTypesLoopTimeout = 0;
    if (GM_getValue('blockTypes') == 1) {
        blockTypesLoop();
    }
    function blockTypesLoop() {
        if (document.getElementsByClassName('relatedtags')[0]) {
            for (let i = 0; i < document.getElementsByClassName('relatedtags').length; i++) {
                let relatedTypesText = document.getElementsByClassName('relatedtags')[i].parentElement.parentElement.children[1].children[1].textContent;
                for (let i1 = 0; i1 < blockTypes.length; i1++) {
                    if (document.getElementsByClassName('relatedtags')[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.display != 'none') {
                    if (relatedTypesText == blockTypes[i1]) {
                            console.log('[通知]已移除类型为[' + relatedTypesText + ']的卡片');
                            // document.getElementsByClassName('relatedtags')[i].parentNode.parentNode.parentNode.parentNode.parentNode.remove();
                            document.getElementsByClassName('relatedtags')[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.cssText += 'display: none !important;';
                        }
                    }
                }
            }
        }
        if (blockTypesLoopTimeout < 10000 || true) {
            blockTypesLoopTimeout += 200;
            setTimeout(blockTypesLoop, 200);
        }
    }
    // 屏蔽指定标签内容
    var blockTagsLoopTimeout = 0;
    if (GM_getValue('blockTags') == 1) {
        blockTagsLoop();
    }
    function blockTagsLoop() {
        if (document.getElementsByClassName('relatedtags')[0]) {
            for (let i = 0; i < document.getElementsByClassName('relatedtags').length; i++) {
                let relatedTagsSplit = document.getElementsByClassName('relatedtags')[i].textContent.split('\n');
                for (let i1 = 0; i1 < blockTags.length; i1++) {
                    if (document.getElementsByClassName('relatedtags')[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.display != 'none') {
                        for (let i2 = 0; i2 < relatedTagsSplit.length; i2++) {
                            if (relatedTagsSplit[i2].replace(' ♀', '').replace(' ♂', '') == blockTags[i1]) {
                                console.log('[通知]已移除标签为[' + relatedTagsSplit[i2] + ']的卡片');
                                // document.getElementsByClassName('relatedtags')[i].parentNode.parentNode.parentNode.parentNode.parentNode.remove();
                                document.getElementsByClassName('relatedtags')[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.cssText += 'display: none !important;';
                            }
                        }
                    }
                }
            }
        }
        if (blockTagsLoopTimeout < 10000 || true) {
            blockTagsLoopTimeout += 200;
            setTimeout(blockTagsLoop, 200);
        }
    }

    // 改详情页布局
    // 图片左右缝隙
    GM_addStyle('.thumbnail-list {padding: 0px !important;}');
    // 图片填满
    GM_addStyle('.thumbnail-container {width: 100% !important; height: auto !important; margin: 0px 0px 0px 0px !important;}');
    // 让主页图片并排
    GM_addStyle('.dj-img-cont {padding: 0px 0px 0px 10px !important; width: calc(100% - 20px) !important; height: 224px !important; margin: 0px 0px 0px 14px !important; display: flex !important; justify-content: space-evenly !important;}');
    GM_addStyle('.dj-img1 {margin: 6px 0px 0px 0px !important; pointer-events: none !important; width: 157px !important; max-width: 100% !important; height: 222px !important; position: unset !important; border: 0 !important;}');
    GM_addStyle('.dj-img2 {margin: 6px 0px 0px 0px !important; width: 157px !important; max-width: 100% !important; height: 222px !important; pointer-events: none !important; position: unset !important; border: 0 !important;}');
    GM_addStyle('.dj-img-back {display: none !important;}');
    GM_addStyle('.cg-img1 {margin: 6px 0px 0px 0px !important; pointer-events: none !important; width: 157px !important; max-width: 100% !important; height: 222px !important; position: unset !important; border: 0 !important;}');
    GM_addStyle('.cg-img2 {margin: 6px 0px 0px 0px !important; pointer-events: none !important; width: 157px !important; max-width: 100% !important; height: 222px !important; position: unset !important; border: 0 !important;}');

    // 图片变高清杂项
    var imgHDLoopTimeout = 0;
    var imgHDPageNumber = 1;
    var imgHDImgNumber = 1;
    imgHDLoop();
    function imgHDLoop() {
        if (document.getElementsByClassName('thumbnail-container')[0]) {
            let imgHDImgCount = 1;
            for (let i = 0; i < document.getElementsByClassName('thumbnail-list')[0].children.length; i++) {
                if (imgHDImgCount <= 30) {
                    imgHDImgCount++;
                    imgHDImgNumber++;
                } else {
                    imgHDImgCount = 1;
                    imgHDPageNumber++;
                }
                // 图片挂载页数
                document.getElementsByClassName('thumbnail-list')[0].children[i].setAttribute('pagenumber', imgHDPageNumber);
                if (imgHDPageNumber != 1 || imgHDPageNumber != 1 && GM_getValue('foldImg') == 1 && GM_getValue('mode') == 1) {
                    document.getElementsByClassName('thumbnail-list')[0].children[i].style.cssText += 'display: none !important;';
                } else {
                    document.getElementsByClassName('thumbnail-list')[0].children[i].style.cssText += 'display: inline-block !important;';
                }
                let simplePagerPage;
                if (document.getElementsByClassName('lazyload')[i] && document.getElementsByClassName('lazyload')[i].parentNode.parentNode.parentNode.className.match('simplePagerPage')) {
                    simplePagerPage = document.getElementsByClassName('lazyload')[i].parentNode.parentNode.parentNode;
                } else if (document.getElementsByClassName('lazyload')[i] && document.getElementsByClassName('lazyload')[i].parentNode.parentNode.parentNode.parentNode.className.match('simplePagerPage')) {
                    simplePagerPage = document.getElementsByClassName('lazyload')[i].parentNode.parentNode.parentNode.parentNode;
                }
                document.getElementsByClassName('lazyload')[i].setAttribute('data-src', unsafeWindow.url_from_url_from_hash(galleryid, unsafeWindow.galleryinfo.files[i], 'webp', undefined, 'a'));
                document.getElementsByClassName('lazyload')[i].setAttribute('src', unsafeWindow.url_from_url_from_hash(galleryid, unsafeWindow.galleryinfo.files[i], 'webp', undefined, 'a'));
                document.getElementsByClassName('lazyload')[i].parentNode.parentNode.removeAttribute('href');
                simplePagerPage.style.cssText += 'width: 100% !important; height: auto !important;';
                simplePagerPage.children[0].style.cssText += 'pointer-events: none !important;';
                document.getElementsByClassName('lazyload')[i].style.cssText += 'width: 100% !important; height: auto !important; border: 0px !important; max-width: none !important; max-height: none !important; pointer-events: none !important;';
                document.getElementsByClassName('lazyload')[i].style.cssText += 'width: 100% !important; height: auto !important; border: 0px !important; max-width: none !important; max-height: none !important; pointer-events: none !important;';
                document.getElementsByClassName('lazyload')[i].addEventListener('error', function () {
                    console.log('图片重新加载');
                    for (let i = 0; i < unsafeWindow.galleryinfo.files.length; i++) {
                        if (document.getElementsByClassName('lazyload')[i] == this) {
                            this.setAttribute('src', unsafeWindow.url_from_url_from_hash(galleryid, unsafeWindow.galleryinfo.files[i], 'webp', undefined, 'a'));
                        };
                    };
                });
                simplePagerPage.addEventListener('click', function () {
                    console.log('图片重新加载');
                    noticeMain('图片重新加载');
                    let img = '';
                    if (this.children[0].children[0].children[0].children[0]) {
                        img = this.children[0].children[0].children[0].children[0];
                    } else {
                        img = this.children[0].children[0].children[0];
                    };
                    for (let i = 0; i < unsafeWindow.galleryinfo.files.length; i++) {
                        if (document.getElementsByClassName('lazyload')[i] == img) {
                            img.setAttribute('data-src', unsafeWindow.url_from_url_from_hash(galleryid, unsafeWindow.galleryinfo.files[i], 'webp', undefined, 'a'));
                            img.setAttribute('src', unsafeWindow.url_from_url_from_hash(galleryid, unsafeWindow.galleryinfo.files[i], 'webp', undefined, 'a'));
                        };
                    };
                });
            }
            if (document.getElementsByClassName('simplePagerNav')[0]) {
                document.getElementsByClassName('simplePagerNav')[0].remove();
            }
            // 翻页模式
            if (imgHDPageNumber > 1 && GM_getValue('mode') == 0) {
                // 翻页样式
                let pageSpaceStyle = 'display: flex; flex-wrap: wrap; justify-content: space-around; width: 100%; height: auto; padding: 0px; border: 0px; font-size: 20px;';
                // 下方翻页父容器
                let pageSpace1 = document.createElement('div');
                pageSpace1.setAttribute('class', 'pageSpace');
                pageSpace1.style.cssText += pageSpaceStyle;
                document.getElementsByClassName('simplePagerContainer')[0].appendChild(pageSpace1);
                // 上方翻页父容器
                let pageSpace2 = document.createElement('div');
                pageSpace2.setAttribute('class', 'pageSpace');
                pageSpace2.style.cssText += pageSpaceStyle;
                document.getElementsByClassName('simplePagerContainer')[0].insertBefore(pageSpace2, document.getElementsByClassName('simplePagerContainer')[0].children[0]);
                // 页数
                for (let i = 0; i < imgHDPageNumber; i++) {
                    // 下方翻页
                    let pageStyle = 'color: rgba(0, 0, 0, 1); width: 40px; height: 30px; margin: 0px 0px; border: 0px; font-size: 20px; background-color: rgba(0, 0, 0, 0);';
                    let page1 = document.createElement('button');
                    page1.setAttribute('class', 'pageButton');
                    page1.setAttribute('pageNumber', i + 1);
                    page1.style.cssText += pageStyle;
                    page1.textContent = i + 1;
                    page1.addEventListener('click', function () {
                        for (let i = 0; i < document.getElementsByClassName('pageButton').length; i++) {
                            document.getElementsByClassName('pageButton')[i].style.cssText += 'color: rgba(0, 0, 0, 1); pointer-events: auto;';
                        }
                        for (let i = 0; i < document.getElementsByClassName('pageButton').length; i++) {
                            if (document.getElementsByClassName('pageButton')[i].getAttribute('pageNumber') == this.getAttribute('pageNumber')) {
                                document.getElementsByClassName('pageButton')[i].style.cssText += 'color: rgba(200, 200, 200, 1); pointer-events: none;';
                            }
                        }
                        for (let i = 0; i < document.getElementsByClassName('thumbnail-list')[0].children.length; i++) {
                            if (document.getElementsByClassName('thumbnail-list')[0].children[i].getAttribute('pagenumber') == this.textContent) {
                                document.getElementsByClassName('thumbnail-list')[0].children[i].style.cssText += 'display: inline-block !important;';
                            } else {
                                document.getElementsByClassName('thumbnail-list')[0].children[i].style.cssText += 'display: none !important;';
                            }
                        }
                        window.scroll(0,document.getElementsByClassName('simplePagerContainer')[0].offsetTop);
                    });
                    pageSpace1.appendChild(page1);
                    // 上方页数
                    let page2 = document.createElement('button');
                    page2.setAttribute('class', 'pageButton');
                    page2.setAttribute('pageNumber', i + 1);
                    page2.style.cssText += pageStyle;
                    page2.textContent = i + 1;
                    page2.addEventListener('click', function () {
                        for (let i = 0; i < document.getElementsByClassName('pageButton').length; i++) {
                            document.getElementsByClassName('pageButton')[i].style.cssText += 'color: rgba(0, 0, 0, 1); pointer-events: auto;';
                        }
                        for (let i = 0; i < document.getElementsByClassName('pageButton').length; i++) {
                            if (document.getElementsByClassName('pageButton')[i].getAttribute('pageNumber') == this.getAttribute('pageNumber')) {
                                document.getElementsByClassName('pageButton')[i].style.cssText += 'color: rgba(200, 200, 200, 1); pointer-events: none;';
                            }
                        }
                        for (let i = 0; i < document.getElementsByClassName('thumbnail-list')[0].children.length; i++) {
                            if (document.getElementsByClassName('thumbnail-list')[0].children[i].getAttribute('pagenumber') == this.textContent) {
                                document.getElementsByClassName('thumbnail-list')[0].children[i].style.cssText += 'display: inline-block !important;';
                            } else {
                                document.getElementsByClassName('thumbnail-list')[0].children[i].style.cssText += 'display: none !important;';
                            }
                        }
                        window.scroll(0,document.getElementsByClassName('simplePagerContainer')[0].offsetTop);
                    });
                    pageSpace2.appendChild(page2);
                }
                // 第一次加载页面使1变灰
                for (let i = 0; i < document.getElementsByClassName('pageButton').length; i++) {
                            if (document.getElementsByClassName('pageButton')[i].getAttribute('pageNumber') == '1') {
                                document.getElementsByClassName('pageButton')[i].style.cssText += 'color: rgba(200, 200, 200, 1); pointer-events: none;';
                            }
                        }
            }
            // 全加载模式加载更多按钮
            if (imgHDPageNumber > 1 && GM_getValue('mode') == 1 && GM_getValue('foldImg') == 1) {
                let loadMoreBtn = document.createElement('button');
                loadMoreBtn.setAttribute('class', 'loadMore');
                var displayImgNumber = 30;
                var displayPageNumber = 1;
                loadMoreBtn.textContent = '加载更多, 剩余图片: ' + (imgHDImgNumber - displayImgNumber);
                loadMoreBtn.style.cssText += 'width: 100%; height: 100px; padding: 0px; border: 0px; font-size: 20px;';
                loadMoreBtn.addEventListener('click', function () {
                    for (let i = 0; imgHDImgNumber >= displayImgNumber && i < 30; i++) {
                        if (document.getElementsByClassName('thumbnail-list')[0].children[displayImgNumber + 1]) {
                            displayImgNumber++;
                            document.getElementsByClassName('thumbnail-list')[0].children[displayImgNumber].style.cssText += 'display: inline-block !important;';
                            let simplePagerPage;
                            if (document.getElementsByClassName('lazyload')[displayImgNumber] && document.getElementsByClassName('lazyload')[displayImgNumber].parentNode.parentNode.parentNode.className.match('simplePagerPage')) {
                                simplePagerPage = document.getElementsByClassName('lazyload')[displayImgNumber].parentNode.parentNode.parentNode;
                            } else if (document.getElementsByClassName('lazyload')[displayImgNumber] && document.getElementsByClassName('lazyload')[displayImgNumber].parentNode.parentNode.parentNode.parentNode.className.match('simplePagerPage')) {
                                simplePagerPage = document.getElementsByClassName('lazyload')[displayImgNumber].parentNode.parentNode.parentNode.parentNode;
                            }
                            document.getElementsByClassName('lazyload')[displayImgNumber].setAttribute('data-src', unsafeWindow.url_from_url_from_hash(galleryid, unsafeWindow.galleryinfo.files[displayImgNumber], 'webp', undefined, 'a'));
                            document.getElementsByClassName('lazyload')[displayImgNumber].setAttribute('src', unsafeWindow.url_from_url_from_hash(galleryid, unsafeWindow.galleryinfo.files[displayImgNumber], 'webp', undefined, 'a'));
                            document.getElementsByClassName('lazyload')[displayImgNumber].parentNode.parentNode.removeAttribute('href');
                            simplePagerPage.style.cssText += 'width: 100% !important; height: auto !important;';
                            document.getElementsByClassName('lazyload')[displayImgNumber].style.cssText += 'width: 100% !important; height: auto !important; border: 0px !important; max-width: none !important; max-height: none !important; pointer-events: none !important;';
                            document.getElementsByClassName('lazyload')[displayImgNumber].addEventListener('error', function () {
                                console.log('图片重新加载');
                                for (let i = 0; i < unsafeWindow.galleryinfo.files.length; i++) {
                                    if (document.getElementsByClassName('lazyload')[i] == this) {
                                        this.setAttribute('src', unsafeWindow.url_from_url_from_hash(galleryid, unsafeWindow.galleryinfo.files[i], 'webp', undefined, 'a'));
                                    };
                                };
                            });
                            simplePagerPage.addEventListener('click', function () {
                                console.log('图片重新加载');
                                noticeMain('图片重新加载');
                                let img = '';
                                if (this.children[0].children[0].children[0].children[0]) {
                                    img = this.children[0].children[0].children[0].children[0];
                                } else {
                                    img = this.children[0].children[0].children[0];
                                };
                                for (let i = 0; i < unsafeWindow.galleryinfo.files.length; i++) {
                                    if (document.getElementsByClassName('lazyload')[i] == img) {
                                        img.setAttribute('data-src', unsafeWindow.url_from_url_from_hash(galleryid, unsafeWindow.galleryinfo.files[i], 'webp', undefined, 'a'));
                                        img.setAttribute('src', unsafeWindow.url_from_url_from_hash(galleryid, unsafeWindow.galleryinfo.files[i], 'webp', undefined, 'a'));
                                    };
                                };
                            });
                        } else {
                            this.style.cssText += 'display: none';
                        }
                    }
                    loadMoreBtn.textContent = '加载更多, 剩余图片: ' + (imgHDImgNumber - displayImgNumber);
                    if (imgHDImgNumber <= displayImgNumber) {
                        loadMoreBtn.style.cssText += 'display: none;';
                        console.log('[通知]已加载全部图片');
                    } else {
                        console.log('[通知]加载更多图片');
                    }
                });
                document.getElementsByClassName('simplePagerContainer')[0].appendChild(loadMoreBtn);
            }
        } else if (imgHDLoopTimeout < 10000) {
            imgHDLoopTimeout += 20;
            setTimeout(imgHDLoop, 20);
        }
    }

    for (let i = 0; i < document.getElementsByClassName('lazyload').length; i++) {
        document.getElementsByClassName('lazyload')[i].style.cssText += 'display: block !important;';
    }

    // 通知
    var noticeElement = document.createElement('div');
    noticeElement.setAttribute('class', 'notice');
    noticeElement.style.cssText = 'position: fixed !important; width: 250px !important; height: 100px !important; color: #ffffff !important; background-color: rgba(0, 0, 0, 0.5) !important; border-radius: 30px !important; text-align: center !important; line-height: 100px !important; z-index: 999 !important; font-size: 30px !important; left: calc(50% - 125px) !important; top: calc(50% - 50px) !important; pointer-events: none !important;';
    noticeElement.style.opacity = 0;
    noticeElement.textContent = '';
    noticeLoop();
    function noticeLoop() {
        if (document.getElementsByTagName('body')[0]) {
            document.getElementsByTagName('body')[0].insertBefore(noticeElement, document.getElementsByTagName('body')[0].children[0]);
        } else {
            setTimeout(noticeLoop, 200);
        }
    }
    var noticeDisplayTime = 0;
    // 通知函数
    function noticeMain (text) {
        noticeElement.textContent = text;
        // noticeElement.style.opacity = 1;
        noticeDisplayTime = 1000;
    }
    // 通知渐变消失
    /* (function noticeFade() {
        if (noticeElement.style.opacity > 0) {
            noticeElement.style.opacity -= 0.02;
        } else if (noticeElement.style.opacity <= 0) {
            noticeElement.style.opacity = 0;
        }
        if (noticeDisplayTime > 0) {
            noticeDisplayTime -= 5;
        } else {
            noticeElement.style.opacity = 0;
        }
        setTimeout(noticeFade, 5);
    })(); */

    // 手势
    /* if (GM_getValue('viewMode') == 0) {
        var gestureTouchStartPoint = {};
        var gestureTouchEndPoint = {};
        document.addEventListener('touchstart', function (event) {
            gestureTouchStartPoint.x = event.changedTouches[0].clientX;
            gestureTouchStartPoint.y = event.changedTouches[0].clientY;
        })
        document.addEventListener('touchend', function (event) {
            gestureTouchEndPoint.x = event.changedTouches[0].clientX;
            gestureTouchEndPoint.y = event.changedTouches[0].clientY;
            if (document.getElementsByClassName('currentPage')[0]) {
                if (gestureTouchEndPoint.x - 50 > gestureTouchStartPoint.x && Math.abs(gestureTouchEndPoint.y - gestureTouchStartPoint.y) < 30) {
                    let pageNumber = parseInt(document.getElementsByClassName('currentPage')[0].className.replace('currentPage', '').replace('simplePageNav', '').replace(' ', ''));
                    if (pageNumber != 1) {
                        console.log('[通知]上一页');
                        document.getElementsByClassName('simplePageNav' + (pageNumber - 1))[0].children[0].click();
                        noticeElement.textContent = '⇠';
                        noticeElement.style.opacity = 1;
                        //noticeFade();

                    }
                } else if (gestureTouchEndPoint.x + 50 < gestureTouchStartPoint.x && Math.abs(gestureTouchEndPoint.y - gestureTouchStartPoint.y) < 30) {
                    let pageNumber = parseInt(document.getElementsByClassName('currentPage')[0].className.replace('currentPage', '').replace('simplePageNav', '').replace(' ', ''));
                    if (document.getElementsByClassName('simplePagerNav')[0] && pageNumber != document.getElementsByClassName('simplePagerNav')[0].children.length) {
                        if (document.getElementsByClassName('simplePageNav' + (pageNumber + 1))[0] && document.getElementsByClassName('simplePageNav' + (pageNumber + 1))[0].children[0]) {
                            console.log('[通知]下一页');
                            document.getElementsByClassName('simplePageNav' + (pageNumber + 1))[0].children[0].click();
                            noticeElement.textContent = '⇢';
                            noticeElement.style.opacity = 1;
                            //noticeFade();
                        }
                    }
                }
            }
        })
    } */
})();