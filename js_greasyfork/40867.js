// ==UserScript==
// @name         巴哈黑名單、關鍵詞、字數過少隱藏顯示
// @namespace    https://home.gamer.com.tw/moontai0724
// @version      2.4.9
// @description  在巴哈姆將黑名單、關鍵詞、字數過少過濾文章留言，在頂端列可以開關過濾器（一次性）
// @author       moontai0724
// @match        https://forum.gamer.com.tw/B.php*
// @match        https://forum.gamer.com.tw/Bo.php*
// @match        https://forum.gamer.com.tw/C.php*
// @match        https://forum.gamer.com.tw/Co.php*
// @match        https://forum.gamer.com.tw/search.php*
// @grant        GM_xmlhttpRequest
// @connect      home.gamer.com.tw
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @supportURL   https://home.gamer.com.tw/moontai0724
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/40867/%E5%B7%B4%E5%93%88%E9%BB%91%E5%90%8D%E5%96%AE%E3%80%81%E9%97%9C%E9%8D%B5%E8%A9%9E%E3%80%81%E5%AD%97%E6%95%B8%E9%81%8E%E5%B0%91%E9%9A%B1%E8%97%8F%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/40867/%E5%B7%B4%E5%93%88%E9%BB%91%E5%90%8D%E5%96%AE%E3%80%81%E9%97%9C%E9%8D%B5%E8%A9%9E%E3%80%81%E5%AD%97%E6%95%B8%E9%81%8E%E5%B0%91%E9%9A%B1%E8%97%8F%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('Start, varsion: ' + GM_info.script.version + ', setting: ', localStorage.getItem("BLH_Setting"));
    if (!localStorage.getItem("BLH_Setting") || JSON.parse(localStorage.getItem("BLH_Setting")) == null)
        (localStorage.setItem("BLH_Setting", JSON.stringify({
            switch: {
                keywordPostFilter: true,
                keywordCommentFilter: true,
                blacklistPostFilter: true,
                blacklistCommentFilter: true,
                contentLengthPostFilter: false,
                contentLengthCommentFilter: false,
            },
            lengthLimit: {
                contentLengthPostLimit: 2,
                contentLengthCommentLimit: 2
            },
            data: {
                forceShowList: [],
                forceHideList: [],
                blockKeywordsPC: [],
                postBlockKeywordsPC: [],
                commentBlockKeywordsPC: [],
                blockKeywordsFC: [],
                postBlockKeywordsFC: [],
                commentBlockKeywordsFC: []
            }
        })), console.log('New Setting'));
    var setting = JSON.parse(localStorage.getItem("BLH_Setting"));

    // 加入隱藏切換
    jQuery('head').append('<style type="text/css" id="BLH_BlockHideCSS">.BlockHide { display: none !important; }</style>');
    jQuery('.BH-menuE').append('<li><a id="BLH_ShowBlock" href="javascript:;" style="display: block;" onclick="BlockDisplay(true);">關閉過濾器</a></li>');
    jQuery('.BH-menuE').append('<li><a id="BLH_HideBlock" href="javascript:;" style="display: none;" onclick="BlockDisplay(false);">開啟過濾器</a></li>');
    jQuery('.BH-menuE').append('<li><a id="BLH_FilterSetting" href="javascript:;" style="display: block;">過濾器設定</a></li>');
    jQuery('body').append('<script type="text/javascript">' + function BlockDisplay(status) {
        document.getElementById('BLH_HideBlock').style.display = status ? 'block' : 'none';
        document.getElementById('BLH_ShowBlock').style.display = status ? 'none' : 'block';
        document.getElementById('BLH_BlockHideCSS').innerHTML = document.getElementById('BLH_BlockHideCSS').innerHTML.replace(status ? 'BlockHide' : 'noBlockHide', status ? 'noBlockHide' : 'BlockHide');
    } + '</script>');
    document.getElementById('BLH_FilterSetting').onclick = () => openSettingWindow();

    // 將 blockKeywords 加入 postBlockKeywords 和 commentBlockKeywords 中
    for (let i = 0; i < setting.data.blockKeywordsPC.length; i++) setting.data.postBlockKeywordsPC[setting.data.postBlockKeywordsPC.length] = setting.data.commentBlockKeywordsPC[setting.data.commentBlockKeywordsPC.length] = setting.data.blockKeywordsPC[i];
    for (let i = 0; i < setting.data.blockKeywordsFC.length; i++) setting.data.postBlockKeywordsFC[setting.data.postBlockKeywordsFC.length] = setting.data.commentBlockKeywordsFC[setting.data.commentBlockKeywordsFC.length] = setting.data.blockKeywordsFC[i];

    //BC頁分開
    switch (location.pathname) {
        case '/B.php':
            console.group('Filter log message');
            setTimeout(() => console.groupEnd(), 200);

            // blacklist post filter
            if (setting.switch.blacklistPostFilter) startFilter('blacklist', 'post', '.b-list__count__user>a', '.b-list__row');
            // keywords post title filter
            if (setting.switch.keywordPostFilter) (startFilter('postBlockKeywordsPC', 'post', '.b-list__main__title', '.b-list__row'), startFilter('postBlockKeywordsFC', 'post', '.b-list__main__title', '.b-list__row'));
            // popular recommend title filter
            if (setting.switch.keywordPostFilter) (startFilter('postBlockKeywordsPC', 'post', '.popular .name', '.popular__item'), startFilter('postBlockKeywordsFC', 'post', '.popular .name', '.popular__item'));
            break;
        case '/C.php': case '/Co.php':
            console.group('Filter log message');
            setTimeout(() => console.groupEnd(), 200);
            // 擷取展開按鈕事件：當展開留言按鈕被點擊，執行原生展開留言指令並處理內容
            jQuery('body').append('<button id="extendCommentListener" style="display: none;"></button>');
            jQuery('.more-reply').each((index, element) => element.setAttribute("onclick", element.getAttribute("onclick") + " [document.getElementById('extendCommentListener').dataset.bsn, document.getElementById('extendCommentListener').dataset.postid] = [" + element.getAttribute('onclick').replace('extendComment(', '').replace(');', '').split(', ') + "]; jQuery('#Commendlist_" + element.getAttribute('onclick').replace('extendComment(', '').replace(');', '').split(', ')[1] + "').append('<div id=\"extendCommentAreaListener\"></div>'); document.getElementById('extendCommentListener').click();"));
            // 當按鈕點擊就執行
            document.getElementById('extendCommentListener').onclick = function () {
                let [bsn, postid] = [document.getElementById('extendCommentListener').dataset.bsn, document.getElementById('extendCommentListener').dataset.postid], times = 0, ms = 0;
                setTimeout(function restartFilter(ms) {
                    setTimeout(function () {
                        if (!document.getElementById('extendCommentAreaListener')) {
                            jQuery('#Commendlist_' + postid).each((index, element) => {
                                if (setting.switch.blacklistCommentFilter) {
                                    getBlackList().then(BlackList => jQuery(element).find('.reply-content__user').each((index, value) => {
                                        if (BlackList.includes(value.href.replace('https://home.gamer.com.tw/', '').toLowerCase())) {
                                            jQuery(value).parents('.c-reply__item').addClass('BlockHide');
                                            console.log('Hid a comment with block user: ' + value.innerText.toLowerCase(), jQuery(value).parents('.c-reply__item'));
                                        }
                                    }));
                                }
                                if (setting.switch.keywordCommentFilter) {
                                    jQuery(element).find('.reply-content__article').each((index, value) => {
                                        setting.data.commentBlockKeywordsPC.forEach(data => {
                                            if (value.innerText.toLowerCase().includes(data)) {
                                                jQuery(value).parents('.c-reply__item').addClass('BlockHide');
                                                console.log('Hid a post includes keyword: ' + data, jQuery(value).parents('.c-reply__item'));
                                            }
                                        });
                                        setting.data.commentBlockKeywordsFC.forEach(data => {
                                            if (value.innerText.toLowerCase() == data) {
                                                jQuery(value).parents('.c-reply__item').addClass('BlockHide');
                                                console.log('Hid a post includes keyword: ' + data, jQuery(value).parents('.c-reply__item'));
                                            }
                                        });
                                    });
                                }
                                if (setting.switch.contentLengthCommentFilter) {
                                    jQuery(element).find('.reply-content__article').each((index, value) => {
                                        let data = value.innerText.replace(/\s/g, '').length;
                                        if (data < setting.lengthLimit.contentLengthCommentLimit) {
                                            jQuery(value).parents('.c-reply__item').addClass('BlockHide');
                                            console.log('Hid a comment less then setting text totalLength limit: ' + setting.lengthLimit.contentLengthCommentLimit, data, jQuery(value).parents('.c-reply__item'));
                                        }
                                    });
                                }
                            });
                        } else if (times++ < 50) restartFilter(100);
                    }, ms);
                });
            };

            // blacklist post filter
            if (setting.switch.blacklistPostFilter) startFilter('blacklist', 'post', '.c-post__header__author>.userid', '.c-section');
            // blacklist comment filter
            if (setting.switch.blacklistCommentFilter) startFilter('blacklist', 'comment', '.reply-content__user', '.c-reply__item');
            // keywords post filter
            if (setting.switch.keywordPostFilter) (startFilter('postBlockKeywordsPC', 'post', '.c-article.FM-P2', '.c-section'), startFilter('postBlockKeywordsFC', 'post', '.c-article.FM-P2', '.c-section'));
            // keywords comment filter
            if (setting.switch.keywordCommentFilter) (startFilter('commentBlockKeywordsPC', 'post', '.reply-content__article', '.c-reply__item'), startFilter('commentBlockKeywordsFC', 'post', '.reply-content__article', '.c-reply__item'));
            // post content length filter
            if (setting.switch.contentLengthPostFilter) startFilter('contentLengthPostLimit', 'post', '.c-article.FM-P2', '.c-section');
            // comment content length filter
            if (setting.switch.contentLengthCommentFilter) startFilter('contentLengthCommentLimit', 'comment', '.reply-content__article', '.c-reply__item');
            // popular recommend title filter
            if (setting.switch.keywordPostFilter) (startFilter('postBlockKeywordsPC', 'post', '.popular .name', '.popular__item'), startFilter('postBlockKeywordsFC', 'post', '.popular .name', '.popular__item'));
            break;
        case '/Bo.php':
            console.group('Filter log message');
            setTimeout(() => console.groupEnd(), 200);
            // blacklist post filter
            if (setting.switch.blacklistPostFilter) startFilter('blacklist', 'post', '.FM-blist6>a[href*="home.gamer.com.tw"]', 'tr');
            // keywords post title filter
            if (setting.switch.keywordPostFilter) (startFilter('postBlockKeywordsPC', 'post', '.FM-blist3', 'tr'), startFilter('postBlockKeywordsFC', 'post', '.FM-blist3', 'tr'));
            break;
        case '/search.php':
            setTimeout(function restartFilter(ms) {
                setTimeout(() => {
                    if (jQuery('.gsc-table-cell-snippet-close').length > 0) {
                        console.group('Filter log message');
                        setTimeout(() => console.groupEnd(), 100);
                        if (setting.switch.keywordPostFilter) (startFilter('postBlockKeywordsPC', 'post', '.gsc-table-cell-snippet-close', '.gsc-result'), startFilter('postBlockKeywordsFC', 'post', '.gsc-table-cell-snippet-close', '.gsc-result'));
                    } else restartFilter(100);
                }, ms);
            });
            break;
    }

    function startFilter(filterType, elementType, target, hideClass) {
        if (filterType.includes('Keyword') && filterType.includes('PC')) {
            console.log('Keyword part compare filter start.');
            jQuery(target).each((index, element) => setting.data[filterType].forEach(value => {
                if (element.innerText.toLowerCase().replace(/\s/g, '').includes(value)) {
                    jQuery(element).parents(hideClass).addClass('BlockHide');
                    console.log('Hid a ' + elementType + ' includes keyword: ' + value, jQuery(element).parents(hideClass));
                }
            }));
        } else if (filterType.includes('Keyword') && filterType.includes('FC')) {
            console.log('Keyword full compare filter start.');
            jQuery(target).each((index, element) => setting.data[filterType].forEach(value => {
                if (element.innerText.toLowerCase().replace(/\s/g, '') == value) {
                    jQuery(element).parents(hideClass).addClass('BlockHide');
                    console.log('Hid a ' + elementType + ' includes keyword: ' + value, jQuery(element).parents(hideClass));
                }
            }));
        } else if (filterType.includes('blacklist')) {
            console.log('Blacklist filter start.');
            getBlackList().then(BlackList => jQuery(target).each((index, element) => {
                if (BlackList.includes(element.href.replace('https://home.gamer.com.tw/', '').toLowerCase())) {
                    jQuery(element).parents(hideClass).addClass('BlockHide');
                    console.log('Hid a ' + elementType + ' with block user: ' + element.href.replace('https://home.gamer.com.tw/', '').toLowerCase(), jQuery(element).parents(hideClass));
                }
            }));
        } else if (filterType.includes('Length')) {
            console.log('content length filter start.');
            jQuery(target).each((index, element) => {
                let value = element.innerText.replace(/\s/g, '').length;
                if (value < setting.lengthLimit[filterType]) {
                    jQuery(element).parents(hideClass).addClass('BlockHide');
                    console.log('Hid a ' + elementType + ' less then setting text totalLength limit: ' + setting.lengthLimit[filterType], value, jQuery(element).parents(hideClass));
                }
            });
        }
    }

    function BlackListHandle(BlackList) {
        let removeNum = [];
        setting.data.forceHideList.forEach(value => BlackList.includes(value.replace(/\s/g, '').toLowerCase()) ? void (0) : BlackList[BlackList.length] = value.replace(/\s/g, '').toLowerCase());
        BlackList.forEach((value, index) => setting.data.forceShowList.includes(value.toLowerCase()) ? removeNum[removeNum.length] = index : void (0));
        for (let i = removeNum.length - 1; i >= 0; i--) BlackList.splice(removeNum[i], 1);
        console.log('BlackList handle process over, returned blacklist: ', BlackList);
        return BlackList;
    }

    function getBlackList(forceReload) {
        return new Promise(resolve => {
            console.log('Received get blacklist request!');
            if (localStorage.getItem('BHBlackList') && !forceReload) {
                let BHBlackList = JSON.parse(localStorage.getItem('BHBlackList')), today = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate(), 0, 0, 0, 0);
                if (today.getTime() < BHBlackList.time && BHBlackList.time < today.getTime() + 86400000) {
                    console.log('Already requested blacklist today, resolve.');
                    resolve(BlackListHandle(BHBlackList.BlackList));
                } else {
                    console.log('Today not requested blacklist yet, start request.');
                    getBlackList(true).then(data => resolve(BlackListHandle(data)));
                }
            } else {
                console.log('Start get blacklist from Bahamut server.');
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://home.gamer.com.tw/ajax/friend_getData.php?here=0",
                    onload: data => {
                        console.log(data);
                        let list = data.responseText.match(/data\-gamercard\-userid\=\"[\s\S]*?\"/g);
                        let BlackList = list != (null || undefined) ? list.map(value => value.replace(/data\-gamercard\-userid\=\"|\"/g, '').toLowerCase()) : [];
                        console.log('Get blacklist data from Bahamut server.');
                        localStorage.setItem('BHBlackList', JSON.stringify({ time: new Date().getTime(), BlackList: BlackList }));
                        resolve(BlackListHandle(BlackList));
                    },
                    onerror: err => console.error('Responsed Error: ', err),
                    ontimeout: err => console.error('Response timeout: ', err)
                });
            }
        });
    }

    function openSettingWindow() {
        // black background
        let BLH_SW_Background = document.createElement("div");
        BLH_SW_Background.id = "BLH_SW_Background";
        BLH_SW_Background.setAttribute("onmousedown", "javascript:if(!jQuery(this).hasClass('mouseenter')) jQuery('#BLH_SW_Background').remove();");
        BLH_SW_Background.style = "background-color: rgba(0, 0, 0, 0.5); z-index: 95; position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px; width: 100%; height: 100%; padding-top: 35px;" +
            " border: 1px solid #a7c7c8;" +
            " display: flex; align-items: center; justify-content: center;" +
            " -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;";
        document.body.appendChild(BLH_SW_Background);

        // window case
        let BLH_SW_Case = document.createElement("div");
        BLH_SW_Case.id = "BLH_SW_Case";
        BLH_SW_Case.setAttribute("onmouseenter", "javascipt:jQuery('#BLH_SW_Background').addClass('mouseenter');");
        BLH_SW_Case.setAttribute("onmouseleave", "javascipt:jQuery('#BLH_SW_Background').removeClass('mouseenter');");
        BLH_SW_Case.style = "position: absolute; height: 80%; width: 90%; overflow: hidden;" +
            " display: flex; align-item: stretch; flex-direction: column;" +
            " background-color: #FFFFFF; border: 1px solid #a7c7c8;";
        document.getElementById("BLH_SW_Background").appendChild(BLH_SW_Case);

        // title
        let BLH_SW_Title = document.createElement("div");
        BLH_SW_Title.setAttribute("style", "display: flex; align-items: center; justify-content: center; width: 100%; min-height: 35px;" +
            " background-color: #E5F7F8; color: #484b4b;" +
            " font-size: 22px; font-weight: bold; font-family: '微軟正黑體', 'Microsoft JhengHei', '黑體-繁', '蘋果儷中黑', 'sans-serif';");
        BLH_SW_Title.innerHTML = "過濾器設定";
        document.getElementById("BLH_SW_Case").appendChild(BLH_SW_Title);

        // content
        let BLH_SW_Content = document.createElement("div");
        BLH_SW_Content.id = "BLH_SW_Content";
        BLH_SW_Content.setAttribute("style", "display: flex; align-items: center; justify-content: center; flex-flow: row wrap; flex-grow: 1; overflow: auto; padding: 10px;" +
            " background-color: #FFFFFF;" +
            " word-break: break-all; font-size: 16px; line-height: 150%; text-align: center; font-family: 微軟正黑體, Microsoft JhengHei, 黑體-繁, 蘋果儷中黑, sans-serif;" +
            " -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;");
        document.getElementById("BLH_SW_Case").appendChild(BLH_SW_Content);

        // bottom element
        let BLH_SW_BottomArea = document.createElement("div");
        BLH_SW_BottomArea.id = "BLH_SW_BottomArea";
        BLH_SW_BottomArea.style = "display: flex; align-items: center; justify-content: center;" +
            " background-color: #E5F7F8;" +
            " width: 100%; min-height: 35px;";
        document.getElementById('BLH_SW_Case').appendChild(BLH_SW_BottomArea);

        // close button
        let BLH_SW_CloseButton = document.createElement('button');
        BLH_SW_CloseButton.innerHTML = '完成';
        BLH_SW_CloseButton.setAttribute("onclick", "jQuery('#BLH_SW_Background').remove();");
        document.getElementById('BLH_SW_BottomArea').appendChild(BLH_SW_CloseButton);

        // content
        jQuery('#BLH_SW_Content').append(`
    <div style="padding: 10px; border: 1px solid; border-radius: 10px; margin: 10px; background: antiquewhite;">
        切換
        <div style="display: flex; align-items: center; justify-content: center; flex-flow: row wrap;">
            <div style="border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px; background: beige;">
                黑名單過濾
                <div style="display: flex; align-items: center; border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px;">
                    黑名單文章過濾：
                    <span id="blacklistPostFilter"></span>
                    <button style="margin: 5px;" onclick="BLH_switch('blacklistPostFilter');">切換</button>
                </div>
                <div style="display: flex; align-items: center; border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px;">
                    黑名單留言過濾：
                    <span id="blacklistCommentFilter"></span>
                    <button style="margin: 5px;" onclick="BLH_switch('blacklistCommentFilter');">切換</button>
                </div>
            </div>
            <div style="border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px; background: beige;">
                關鍵詞過濾
                <div style="display: flex; align-items: center; border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px;">
                    關鍵詞文章過濾：
                    <span id="keywordPostFilter"></span>
                    <button style="margin: 5px;" onclick="BLH_switch('keywordPostFilter');">切換</button>
                </div>
                <div style="display: flex; align-items: center; border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px;">
                    關鍵詞留言過濾：
                    <span id="keywordCommentFilter"></span>
                    <button style="margin: 5px;" onclick="BLH_switch('keywordCommentFilter');">切換</button>
                </div>
            </div>
            <div style="border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px; background: beige;">
                字數過濾
                <div style="display: flex; align-items: center; border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px;">
                    文章字數過濾：
                    <span id="contentLengthPostFilter"></span>
                    <button style="margin: 5px;" onclick="BLH_switch('contentLengthPostFilter');">切換</button>
                </div>
                <div style="display: flex; align-items: center; border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px;">
                    留言字數過濾：
                    <span id="contentLengthCommentFilter"></span>
                    <button style="margin: 5px;" onclick="BLH_switch('contentLengthCommentFilter');">切換</button>
                </div>
            </div>
            <div style="border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px; background: beige;">
                字數過濾
                <div style="display: flex; align-items: center; border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px;">
                    文章字數下限：
                    <span id="contentLengthPostLimit"></span>
                    <button style="margin: 5px;" onclick="BLH_lengthLimit('contentLengthPostLimit');">變更</button>
                </div>
                <div style="display: flex; align-items: center; border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px;">
                    留言字數下限：
                    <span id="contentLengthCommentLimit"></span>
                    <button style="margin: 5px;" onclick="BLH_lengthLimit('contentLengthCommentLimit');">變更</button>
                </div>
            </div>
        </div>
    </div>
    <div style="width: 100%; margin: 10px; padding: 10px; border: 1px solid; border-radius: 10px; background: antiquewhite;">
        部分符合關鍵詞封鎖（不分大小寫）<br>
        當設定在此處，文章或留言只要部分符合這個內容就會被過濾。<br>
        當設定在全域變數中，下方就不需再設定同樣的字詞（系統會體醒已在全域過濾清單中有）。<br>
        當文章與留言都有相同的變數，會自動改到全域變數中。
        <div style="display: flex; align-items: center; justify-content: center; flex-flow: row wrap;">
            <div style="border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px; width: 90%; background: beige;">
                <div style="display: flex; align-items: center; justify-content: center; flex-flow: row wrap;">
                    全域過濾關鍵詞（文章與留言皆會過濾）
                    <button style="margin: 5px;" onclick="BLH_addFilter('blockKeywordsPC');">新增</button>
                    <button style="margin: 5px;" onclick="BLH_removeFilter('blockKeywordsPC');">移除選取</button>
                </div>
                <div id="blockKeywordsPC" style="display: flex; flex-flow: row wrap; width: 90%; padding: 10px;">
                </div>
            </div>
            <div style="border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px; width: 45%; background: beige;">
                <div style="display: flex; align-items: center; justify-content: center; flex-flow: row wrap;">
                    文章過濾關鍵詞
                    <button style="margin: 5px;" onclick="BLH_addFilter('postBlockKeywordsPC');">新增</button>
                    <button style="margin: 5px;" onclick="BLH_removeFilter('postBlockKeywordsPC');">移除選取</button>
                </div>
                <div id="postBlockKeywordsPC" style="display: flex; flex-flow: row wrap; width: 90%; padding: 10px;">
                </div>
            </div>
            <div style="border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px; width: 45%; background: beige;">
                <div style="display: flex; align-items: center; justify-content: center; flex-flow: row wrap;">
                    留言過濾關鍵詞
                    <button style="margin: 5px;" onclick="BLH_addFilter('commentBlockKeywordsPC');">新增</button>
                    <button style="margin: 5px;" onclick="BLH_removeFilter('commentBlockKeywordsPC');">移除選取</button>
                </div>
                <div id="commentBlockKeywordsPC" style="display: flex; flex-flow: row wrap; width: 90%; padding: 10px;">
                </div>
            </div>
        </div>
    </div>
    <div style="width: 100%; margin: 10px; padding: 10px; border: 1px solid; border-radius: 10px; background: antiquewhite;">
        完全符合關鍵詞封鎖（不分大小寫）<br>
        當設定在此處，文章或留言必須完全符合這個內容才會被過濾。<br>
        當設定在全域變數中，下方就不需再設定同樣的字詞（系統會體醒已在全域過濾清單中有）。<br>
        當文章與留言都有相同的變數，會自動改到全域變數中。
        <div style="display: flex; align-items: center; justify-content: center; flex-flow: row wrap;">
            <div style="border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px; width: 90%; background: beige;">
                <div style="display: flex; align-items: center; justify-content: center; flex-flow: row wrap;">
                    全域過濾關鍵詞（文章與留言皆會過濾）
                    <button style="margin: 5px;" onclick="BLH_addFilter('blockKeywordsFC');">新增</button>
                    <button style="margin: 5px;" onclick="BLH_removeFilter('blockKeywordsFC');">移除選取</button>
                </div>
                <div id="blockKeywordsFC" style="display: flex; flex-flow: row wrap; width: 90%; padding: 10px;">
                </div>
            </div>
            <div style="border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px; width: 45%; background: beige;">
                <div style="display: flex; align-items: center; justify-content: center; flex-flow: row wrap;">
                    文章過濾關鍵詞
                    <button style="margin: 5px;" onclick="BLH_addFilter('postBlockKeywordsFC');">新增</button>
                    <button style="margin: 5px;" onclick="BLH_removeFilter('postBlockKeywordsFC');">移除選取</button>
                </div>
                <div id="postBlockKeywordsFC" style="display: flex; flex-flow: row wrap; width: 90%; padding: 10px;">
                </div>
            </div>
            <div style="border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px; width: 45%; background: beige;">
                <div style="display: flex; align-items: center; justify-content: center; flex-flow: row wrap;">
                    留言過濾關鍵詞
                    <button style="margin: 5px;" onclick="BLH_addFilter('commentBlockKeywordsFC');">新增</button>
                    <button style="margin: 5px;" onclick="BLH_removeFilter('commentBlockKeywordsFC');">移除選取</button>
                </div>
                <div id="commentBlockKeywordsFC" style="display: flex; flex-flow: row wrap; width: 90%; padding: 10px;">
                </div>
            </div>
        </div>
    </div>
    <div style="width: 100%; margin: 10px; padding: 10px; border: 1px solid; border-radius: 10px; background: antiquewhite;">
        ＩＤ封鎖（不分大小寫）<button onclick="localStorage.removeItem('BHBlackList'); location.reload();">強制重獲取黑名單</button><br>
        黑名單會自動獲取已經被黑名單的列表，但若要手動添加，可於上方參數進行添加。<br>
        可以添加強制顯示、強制隱藏，這兩個參數會優先於黑名單列表。<br>
        ＩＤ只能在強制顯示與強制隱藏其中一個清單內，不會有重複（輸入時會被提醒）。<br>
        輸入的ＩＤ不分大小寫。
        <div style="display: flex; align-items: center; justify-content: center; flex-flow: row wrap;">
            <div style="border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px; width: 45%; background: beige;">
                <div style="display: flex; align-items: center; justify-content: center; flex-flow: row wrap;">
                    顯示名單
                    <button style="margin: 5px;" onclick="BLH_addFilter('forceShowList');">新增</button>
                    <button style="margin: 5px;" onclick="BLH_removeFilter('forceShowList');">移除選取</button>
                </div>
                <div id="forceShowList" style="display: flex; flex-flow: row wrap; width: 90%; padding: 10px;">
                </div>
            </div>
            <div style="border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px; width: 45%; background: beige;">
                <div style="display: flex; align-items: center; justify-content: center; flex-flow: row wrap;">
                    隱藏名單
                    <button style="margin: 5px;" onclick="BLH_addFilter('forceHideList');">新增</button>
                    <button style="margin: 5px;" onclick="BLH_removeFilter('forceHideList');">移除選取</button>
                </div>
                <div id="forceHideList" style="display: flex; flex-flow: row wrap; width: 90%; padding: 10px;">
                </div>
            </div>
        </div>
    </div>
    <div style="margin: 10px; padding: 10px; border: 1px solid; border-radius: 10px; background: antiquewhite;">
        其他設定
        <div style="display: flex; align-items: center; justify-content: center; flex-flow: row wrap;">
            <div style="border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px; background: beige;">
                備份與還原
                <div style="display: flex; align-items: center; border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px;">
                    備份：
                    <input type="text" readonly="" name="BLH_Setting_backupText">
                    <button style="margin: 5px;" onclick="document.getElementsByName('BLH_Setting_backupText')[0].value = localStorage.getItem('BLH_Setting');">手動獲取</button>
                </div>
                <div style="display: flex; align-items: center; justify-content: center; border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px;">
                    還原：
                    <button style="margin: 5px;" onclick="localStorage.setItem('BLH_Setting', window.prompt('請貼上設定檔：（將重新整理）')); location.reload();">還原</button>
                </div>
                <div style="display: flex; align-items: center; justify-content: center; border: 1px solid; padding: 5px; margin: 10px; border-radius: 10px;">
                    還原初始設定：
                    <button style="margin: 5px;" onclick="if(window.confirm('確定要還原初始設定？還原後將重新整理。')) (localStorage.removeItem('BLH_Setting'), location.reload()); ">還原</button>
                </div>
            </div>
        </div>
    </div>
    `);
        let setting = JSON.parse(localStorage.getItem("BLH_Setting"));
        for (let key in setting.switch) {
            document.getElementById(key).innerHTML = (setting.switch[key] ? '開' : '關');
            document.getElementById(key).parentNode.style.color = setting.switch[key] ? 'olive' : 'crimson';
        }
        for (let key in setting.lengthLimit) document.getElementById(key).innerHTML = setting.lengthLimit[key];
        for (let key in setting.data) {
            for (let i = 0; i < setting.data[key].length; i++) {
                jQuery('#' + key).append(`<div style="margin: 10px;" data-value="` + encodeURIComponent(setting.data[key][i]) + `"><input type="checkbox"><span onclick="jQuery(this).parent().find('input').prop('checked', !jQuery(this).parent().find('input').prop('checked'));">` + setting.data[key][i] + `</span></div>`);
            }
        }
    }

    jQuery('body').append('<script type="text/javascript">' + function BLH_switch(key) {
        let setting = JSON.parse(localStorage.getItem("BLH_Setting"));
        setting.switch[key] = !setting.switch[key];
        localStorage.setItem('BLH_Setting', JSON.stringify(setting));
        document.getElementById(key).innerHTML = (setting.switch[key] ? '開' : '關');
        document.getElementById(key).parentNode.style.color = setting.switch[key] ? 'olive' : 'crimson';
        console.log('Switch ' + key + ' to ' + setting.switch[key]);
    } + function BLH_lengthLimit(key) {
        let lengthLimit = window.prompt('請輸入不小於２之過濾字數，若輸入５將過濾４字，５字不過濾。');
        console.log('Input: ' + lengthLimit);
        if (lengthLimit == null) return false;
        else lengthLimit = parseInt(lengthLimit);
        if (isNaN(lengthLimit)) (window.alert('請輸入半形數字。'), console.log('Input value is not a number'));
        else if (lengthLimit < 2) (window.alert('數值不得小於２'), console.log('Input value less then 2!'));
        else {
            let setting = JSON.parse(localStorage.getItem("BLH_Setting"));
            setting.lengthLimit[key] = lengthLimit;
            localStorage.setItem('BLH_Setting', JSON.stringify(setting));
            document.getElementById(key).innerHTML = lengthLimit;
            console.log('Set ' + key + ' to ' + lengthLimit);
        }
    } + function BLH_addFilter(key) {
        let setting = JSON.parse(localStorage.getItem("BLH_Setting"));
        let response = window.prompt('請輸入欲過濾' + (key.includes('force') ? '使用者ＩＤ（不分大小寫，非英數字會被過濾）' : '詞（不分大小寫，空白會被過濾。）'));
        console.log('Input: ' + response);
        if (response != null) response = key.includes('force') ? response.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : response.replace(/\s/g, '').toLowerCase();
        else return false;
        if (response != '' && response != null) {
            let listInfo = {
                forceShowList: {
                    id: 'forceShowList',
                    type: 'ＩＤ',
                    name: 'ＩＤ封鎖白名單',
                    equal: ['forceHideList']
                }, forceHideList: {
                    id: 'forceHideList',
                    type: 'ＩＤ',
                    name: 'ＩＤ封鎖黑名單',
                    equal: ['forceShowList']
                }, blockKeywordsPC: {
                    id: 'blockKeywordsPC',
                    type: '關鍵詞',
                    name: '全域關鍵詞部分符合封鎖清單',
                    equal: ['postBlockKeywordsPC', 'commentBlockKeywordsPC']
                }, postBlockKeywordsPC: {
                    id: 'postBlockKeywordsPC',
                    type: '關鍵詞',
                    name: '文章關鍵詞部分符合封鎖清單',
                    partner: 'commentBlockKeywordsPC',
                    parent: 'blockKeywordsPC'
                }, commentBlockKeywordsPC: {
                    id: 'commentBlockKeywordsPC',
                    type: '關鍵詞',
                    name: '留言關鍵詞部分符合封鎖清單',
                    partner: 'postBlockKeywordsPC',
                    parent: 'blockKeywordsPC'
                }, blockKeywordsFC: {
                    id: 'blockKeywordsFC',
                    type: '關鍵詞',
                    name: '全域關鍵詞完全符合封鎖清單',
                    equal: ['postBlockKeywordsFC', 'commentBlockKeywordsFC']
                }, postBlockKeywordsFC: {
                    id: 'postBlockKeywordsFC',
                    type: '關鍵詞',
                    name: '文章關鍵詞完全符合封鎖清單',
                    partner: 'commentBlockKeywordsFC',
                    parent: 'blockKeywordsFC'
                }, commentBlockKeywordsFC: {
                    id: 'commentBlockKeywordsFC',
                    type: '關鍵詞',
                    name: '留言關鍵詞完全符合封鎖清單',
                    partner: 'postBlockKeywordsFC',
                    parent: 'blockKeywordsFC'
                }
            };
            // 當清單中已經有的時候就提示並中止
            if (setting.data[key].includes(response)) {
                window.alert('清單中已經有此' + listInfo[key].type);
                console.log('"' + response + '" already exist in ' + key + '.');
                return false;
            }
            // 檢查其他清單中是不是已經有重複的
            for (let listnum in listInfo[key].equal) {
                if (setting.data[listInfo[key].equal[listnum]].includes(response)) {
                    if (window.confirm(listInfo[listInfo[key].equal[listnum]].name + ' 中已經有此' + listInfo[listInfo[key].equal[listnum]].type + '，是否從清單中移除並加到這個清單？')) {
                        setting.data[listInfo[key].equal[listnum]].splice(setting.data[listInfo[key].equal[listnum]].findIndex(element => element == response), 1);
                        jQuery('#' + listInfo[key].equal[listnum] + ' [data-value="' + encodeURIComponent(response) + '"]').remove();
                        console.log('Removed "' + response + '" from ' + listInfo[key].equal[listnum] + ' because it is ready to add to ' + key + '.');
                    } else {
                        console.log('"' + response + '" already exist in ' + listInfo[key].equal[listnum] + '.');
                        return false;
                    }
                }
            }
            // 如果同位的另一個清單中有了就上放到父清單中
            if (listInfo[key].partner && setting.data[listInfo[key].partner].includes(response)) {
                setting.data[listInfo[key].partner].splice(setting.data[listInfo[key].partner].findIndex(element => element == response), 1);
                jQuery('#' + listInfo[key].partner + ' [data-value="' + encodeURIComponent(response) + '"]').remove();
                key = listInfo[key].parent;
                console.log('Removed "' + response + '" from ' + listInfo[key].partner + ' because it is ready to add to ' + key + '.');
            }
            // 開始加入過濾詞
            setting.data[key][setting.data[key].length] = response;
            localStorage.setItem('BLH_Setting', JSON.stringify(setting));
            jQuery('#' + key).append(`<div style="margin: 10px;" data-value="` + encodeURIComponent(response) + `"><input type="checkbox"><span onclick="jQuery(this).parent().find('input').prop('checked', !jQuery(this).parent().find('input').prop('checked'));">` + response + `</span></div>`);
            console.log('Added ' + response + ' to ' + key + '.');
        } else window.alert('輸入的內容錯誤。');
    } + function BLH_removeFilter(key) {
        let setting = JSON.parse(localStorage.getItem("BLH_Setting"));
        let removeList = [];
        jQuery('#' + key + ' input:checked').each((index, element) => {
            console.log('Removed ' + jQuery(element).parent().attr('data-value') + ' from ' + key);
            setting.data[key].splice(setting.data[key].findIndex(element => element == jQuery(element).parent().attr('data-value')), 1);
            jQuery(element).parent().remove();
        });
        localStorage.setItem('BLH_Setting', JSON.stringify(setting));
    } + '</script>');
})();