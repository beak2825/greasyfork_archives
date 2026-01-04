// ==UserScript==
// @name          兔区&闲情助手
// @author        岚浅浅
// @description   查房(贴内发言人数统计)/白名单(高亮贴子和楼层)/屏蔽词(屏蔽贴子和楼层)/换肤/去广告/楼层记忆/标记楼主
// @namespace     http://tampermonkey.net/
// @homepageURL   https://github.com/LanQianqian/greasyForkScripts
// @version       2.0.3
// @include       *://bbs.jjwxc.net*
// @license       GPL-3.0 License
// @require       https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require       https://cdn.bootcdn.net/ajax/libs/underscore.js/1.13.1/underscore.min.js
// @downloadURL https://update.greasyfork.org/scripts/436030/%E5%85%94%E5%8C%BA%E9%97%B2%E6%83%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/436030/%E5%85%94%E5%8C%BA%E9%97%B2%E6%83%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// jshint esversion: 6

$(function () {
    if (location.href.search(/.*:\/\/bbs.jjwxc.net.*/i) < 0) {
        return;
    }

    const SEPARATOR = ' ';

    const JS = ['https://cdn.bootcdn.net/ajax/libs/underscore.js/1.13.1/underscore.min.js'];

    const SKIN_CSS_MAP = new Map([['0', ''], ['1', `
                /* 背景颜色 */
                body, td, input, textarea {
                    background-color: #2F393C !important;
                }
                /* 字体颜色 */
                * {
                    color: #616161;
                }
                #msgsubject, #topic, .replybodyinner, .landlord, a, span, input, textarea {
                    color: #A8C023 !important;
                }
                /* 边框颜色 */
                input, table[border="4"] {
                    border: solid 1px;
                }
                /* 修改头像 */
                .image1, .image2, .image6, .image7, .image8, .image9, .image10, .image12, .image13, .image14, .image15, .image16 {
                    background-image: url(https://i.loli.net/2018/08/28/5b84af69b2b16.png) !important;
                }
                .image17, .image18, .image19, .image20, .image21, .image22, .image23, .image24 {
                    background-image: url(https://i.loli.net/2018/08/28/5b84af682e7eb.png) !important;
                }
            `]]);
    const MOBILE_SKIN_CSS_MAP = new Map([['BOARD', `
                .boardlist > td:nth-child(2) > table {
                    width: 800px
                }
                .subjecttd a {
                    font-size: 36px;
                }
            `], ['POST', `
                .read div {
                    width: 360px;
                    overflow-x: auto !important;
                }
            `], ['SEARCH', `
                td {
                    white-space: normal;
                }
                td a {
                    font-size: 36px;
                }
            `]]);

    const TOOLBAR_CSS = `
            .clickable {
                z-index: 999999;
                position: fixed;
                right: 10px;
                width: 180px;
                display: flex;
                flex-direction: column;
                opacity: 0.6;
                border: 1px solid #a38a54;
                border-radius: 3px;
            }
            .clickable div {
                margin: 2px auto;
            }
            .clickable a {
                margin: auto;
                cursor: pointer;
            }
            #toolbar-0 {
                top: 10px;
                width: 40px;
                font-size: 36px;
            }
            #toolbar-1 {
                top: 10px;
            }
            #toolbar-1 input {
                padding-left: 3px;
                width: 120px;
                height: 20px;
                font-size: 10px;
            }
            .add-spam-post-btn, .board-report-btn {
                font-size: small;
            }
            #white-keywords-wrapper, #spam-keywords-wrapper {
                display: none;
            }
            #white-keywords-wicket, #spam-keywords-wicket {
                top: 180px;
                max-height: 600px;
                overflow-y: auto;
            }
            #white-keywords-wicket::-webkit-scrollbar, #spam-keywords-wicket::-webkit-scrollbar {
                display: none;
            }
            .keyword-wicket {
                width: 180px;
            }
            .keyword-wicket label {
                margin-left: 8px;
            }
            .keyword-operation-wicket {
                display: inline;
                float: right;
                margin-right: 8px !important;
            }
            .keyword-operation {
                font-size: small;
            }
        `;
    const MOBILE_TOOLBAR_CSS = `
            #toolbar-1, #toolbar-1 input, #white-keywords-wicket, #spam-keywords-wicket {
                background-color: white !important;
            }
        `;

    const TOOLBAR_HTML_MAP = new Map([['BOARD', [{
        id: '0', html: `
                <div id="toolbar-0" class="clickable">
                    <div>
                        <a id="toolbar-switcher">助</a>
                    </div>
                </div>
            `
    }, {
        id: '1', html: `
                <div id="toolbar-1" class="clickable">
                    <div>
                        <a id="skin-switcher">换肤</a>
                        <a id="toolbar-switcher">隐藏助手</a>
                    </div>
                    <div>
                        <a id="go-top-btn">到顶部</a>
                        <a id="go-bottom-btn">到底部</a>
                    </div>
                    <div>
                        <input id="jump-post-inputbox" placeholder="输入贴子ID,直接跳转">
                        <a id="jump-post-btn">跳转</a>
                    </div>
                    <div>
                        <input id="add-white-keywords-inputbox" placeholder="添加白名单,空格隔开">
                        <a id="add-white-keyword-btn">确定</a>
                    </div>
                    <div>
                        <input id="add-spam-keywords-inputbox" placeholder="添加屏蔽词,空格隔开">
                        <a id="add-spam-keyword-btn">确定</a>
                    </div>
                    <div>
                        <a id="white-keywords-wicket-toggler">查看白名单</a>
                        <a id="spam-keywords-wicket-toggler">查看屏蔽词</a>
                    </div>
                </div>
                <div id="white-keywords-wrapper">
                    <div id="white-keywords-wicket" class="clickable"></div>
                </div>
                <div id="spam-keywords-wrapper">
                    <div id="spam-keywords-wicket" class="clickable"></div>
                </div>
            `
    }]], ['POST', [{
        id: '0', html: `
                <div id="toolbar-0" class="clickable">
                    <div>
                        <a id="toolbar-switcher">助</a>
                    </div>
                </div>
            `
    }, {
        id: '1', html: `
                <div id="toolbar-1" class="clickable">
                    <div>
                        <a id="skin-switcher">换肤</a>
                        <a id="toolbar-switcher">隐藏助手</a>
                    </div>
                    <div>
                        <a id="go-top-btn">到顶部</a>
                        <a id="go-bottom-btn">到底部</a>
                        <a id="count-btn">查房</a>
                    </div>
                    <div>
                        <input id="add-white-keywords-inputbox" placeholder="添加白名单,空格隔开">
                        <a id="add-white-keyword-btn">确定</a>
                    </div>
                    <div>
                        <input id="add-spam-keywords-inputbox" placeholder="添加屏蔽词,空格隔开">
                        <a id="add-spam-keyword-btn">确定</a>
                    </div>
                    <div>
                        <a id="white-keywords-wicket-toggler">查看白名单</a>
                        <a id="spam-keywords-wicket-toggler">查看屏蔽词</a>
                    </div>
                    <div>
                        <a id="white-keywords-highlight-toggler">贴内高亮</a>
                        <a id="go-pre-white-keyword-btn">前一个</a>
                        <a id="go-next-white-keyword-btn">后一个</a>
                    </div>
                </div>
                <div id="white-keywords-wrapper">
                    <div id="white-keywords-wicket" class="clickable"></div>
                </div>
                <div id="spam-keywords-wrapper">
                    <div id="spam-keywords-wicket" class="clickable"></div>
                </div>
            `
    }]]]);

    const IS_MOBILE = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    const DEFAULT_SKIN_ID = '1';
    const DEFAULT_TOOLBAR_ID = IS_MOBILE ? '0' : '1';

    const IS_BOARD_PAGE = location.href.indexOf('board.php') > 0;
    const IS_POST_PAGE = location.href.indexOf('showmsg.php') > 0;
    const IS_SEARCH_PAGE = location.href.indexOf('search.php') > 0;
    const PAGE_TYPE = IS_BOARD_PAGE ? 'BOARD' : (IS_POST_PAGE ? 'POST' : (IS_SEARCH_PAGE ? 'SEARCH' : ''));

    const BOARD_ID = IS_BOARD_PAGE || IS_POST_PAGE ? getParamValue('board') : '';
    const POST_ID = IS_POST_PAGE ? getParamValue('id') : '';
    const PAGE_ID = getParamValue('page') || (IS_BOARD_PAGE ? '1' : '0');

    const MATCHES = IS_POST_PAGE ? $('#msgsubject').text().match(/主题：(.*)\[\d+\]/) : '';
    const PREFIX = IS_POST_PAGE ? BOARD_ID + '_' + POST_ID + '_' + MATCHES[1].trim() : '';

    let Skin = {
        init() {
            Skin.initSkin();
            Skin.initAdBlock();
        }, initSkin() {
            addScript(JS);
            addStyle(SKIN_CSS_MAP.get(getConfig('SkinId', DEFAULT_SKIN_ID)));
            addStyle(IS_MOBILE ? MOBILE_SKIN_CSS_MAP.get(PAGE_TYPE) : null);
        }, initAdBlock() {
            if (IS_BOARD_PAGE || IS_SEARCH_PAGE) {
                $('.width_300').hide();
                $('.width_468').hide();
            } else if (IS_POST_PAGE) {
                $('#imgurl').hide();
                $('#bbs_top_360').hide();
            }
        }, switchSkin() {
            let oldSkinId = parseInt(getConfig('SkinId', DEFAULT_SKIN_ID));
            let newSkinId = (oldSkinId + 1) % SKIN_CSS_MAP.size;
            setConfig('SkinId', newSkinId);
            location.reload();
        }
    };

    let Toolbar = {
        init() {
            if (!IS_BOARD_PAGE && !IS_POST_PAGE) {
                return;
            }
            Toolbar.initToolbar();
            Toolbar.registerEvent();
        }, initToolbar() {
            addStyle(TOOLBAR_CSS);
            addStyle(IS_MOBILE ? MOBILE_TOOLBAR_CSS : '');
            TOOLBAR_HTML_MAP.get(PAGE_TYPE).forEach(function (item) {
                $('body').append(item.html);
                $('#toolbar-' + item.id).hide();
            });
            if (IS_MOBILE) {
                deleteConfig('ToolbarId');
            }
            let toolbarId = getConfig('ToolbarId', DEFAULT_TOOLBAR_ID);
            $('#toolbar-' + toolbarId).show();
        }, switchToolbar() {
            let oldToolbarId = parseInt(getConfig('ToolbarId', DEFAULT_TOOLBAR_ID));
            let newToolbarId = (oldToolbarId + 1) % TOOLBAR_HTML_MAP.get(PAGE_TYPE).length;
            setConfig('ToolbarId', newToolbarId);
            $('#toolbar-' + oldToolbarId).hide();
            $('#toolbar-' + newToolbarId).show();
        }, jumpPost() {
            let jumpPostInputbox = $('#jump-post-inputbox');
            let postId = jumpPostInputbox.val().trim().replace(/\s+/g, SEPARATOR);
            if (!postId) {
                alert('请输入要跳转的贴子ID！');
                return;
            }
            jumpPostInputbox.val('');
            window.open(`https://bbs.jjwxc.net/showmsg.php?board=${BOARD_ID}&id=${postId}`);
        }, registerEvent() {
            $(document).on('click', '#skin-switcher', function () {
                Skin.switchSkin();
            });
            $(document).on('click', '#toolbar-switcher', function () {
                Toolbar.switchToolbar();
            });

            $(document).on('keypress', '#jump-post-inputbox', function (event) {
                if (event.keyCode === 13) {
                    Toolbar.jumpPost();
                }
            });
            $(document).on('click', '#jump-post-btn', function () {
                Toolbar.jumpPost();
            });

            $(document).on('click', '#go-top-btn', function () {
                scrollTo(0);
            });
            $(document).on('click', '#go-bottom-btn', function () {
                scrollTo($(document).height());
            });
        }
    };

    let KeyWord = {
        whiteKeywordsWicketStatus: false, spamKeywordsWicketStatus: false, init() {
            if (!IS_BOARD_PAGE && !IS_POST_PAGE) {
                return;
            }
            KeyWord.initBoardKeywords();
            KeyWord.initPostKeywords();
            KeyWord.registerEvent();
        }, initBoardKeywords() {
            if (!IS_BOARD_PAGE) {
                return;
            }
            let whiteKeywords = getConfigItems('WhiteKeywords');
            let spamKeywords = getConfigItems('SpamKeywords');
            let spamPosts = getConfigItems('SpamPosts');
            let nodes = $('#msglist').children().children().toArray();
            nodes.shift();
            for (let node of nodes) {
                let reportNode = $(node).find('td')[1];
                let titleNode = $(node).find('td')[3];
                let url = $(titleNode).children().attr('href');
                let id = getParamValue('id', url);
                $(reportNode).append(`<a class="add-spam-post-btn" id="${id}" href="javascript:void(0);">屏蔽</a>`);
                let title = titleNode.innerText;
                let needHighlight = false;
                for (let whiteKeyword of whiteKeywords) {
                    if (title.indexOf(whiteKeyword) >= 0) {
                        $(node).css('opacity', '0.75');
                        needHighlight = true;
                        console.log(`已高亮(${whiteKeyword})：${title}`);
                        break;
                    }
                }
                if (!needHighlight) {
                    for (let spamKeyword of spamKeywords) {
                        if (title.indexOf(spamKeyword) >= 0) {
                            $(node).remove();
                            console.log(`已过滤(${spamKeyword})：${title}`);
                            break;
                        }
                    }
                }
                for (let spamPost of spamPosts) {
                    if (spamPost === id) {
                        $(node).remove();
                        console.log(`已过滤：${title}`);
                        break;
                    }
                }
            }
        }, initPostKeywords() {
            if (!IS_POST_PAGE) {
                return;
            }
            let whiteKeywords = getConfigItems('WhiteKeywords');
            let whiteKeywordsCloseInPost = getConfigItems('WhiteKeywordsCloseInPost');
            let spamKeywordsOpenInPost = getConfigItems('SpamKeywordsOpenInPost');
            let nodes = $('#topic, .quotebodyinner, .replybodyinner').toArray();
            for (let node of nodes) {
                for (let whiteKeyword of whiteKeywords) {
                    if (whiteKeywordsCloseInPost.indexOf(whiteKeyword) < 0) {
                        $(node).html($(node).html().replace(new RegExp(whiteKeyword, 'g'), `<span class="highlight-keyword">${whiteKeyword}</span>`));
                    }
                }
                for (let spamKeywordOpenInPost of spamKeywordsOpenInPost) {
                    if (node.innerText.indexOf(spamKeywordOpenInPost) >= 0) {
                        $(node).parent().remove();
                        break;
                    }
                }
            }
            if (getPostConfig('WhiteKeywordsHighlight')) {
                this.showWhiteKeywordsHighlight();
            }
        }, addKeyword(inputbox, configName) {
            let keyword = inputbox.val().trim().replace(/\s+/g, SEPARATOR);
            if (keyword === '') {
                alert('请输入要添加的关键词！');
                return;
            }
            addConfigItem(configName, keyword);
            inputbox.val('');
        }, addWhiteKeyword() {
            KeyWord.addKeyword($('#add-white-keywords-inputbox'), 'WhiteKeywords');
            KeyWord.showWhiteKeywordsWicket();
        }, addSpamKeyword() {
            KeyWord.addKeyword($('#add-spam-keywords-inputbox'), 'SpamKeywords');
            KeyWord.showSpamKeywordsWicket();
        }, deleteWhiteKeyword(node) {
            let keyword = node.rel;
            removeConfigItem('WhiteKeywords', keyword);
            removeConfigItem('WhiteKeywordsCloseInPost', keyword);
            KeyWord.showWhiteKeywordsWicket();
        }, deleteSpamKeyword(node) {
            let keyword = node.rel;
            removeConfigItem('SpamKeywords', keyword);
            removeConfigItem('SpamKeywordsOpenInPost', keyword);
            KeyWord.showSpamKeywordsWicket();
        }, toggleKeywordInpost(node, configName) {
            let keyword = node.rel;
            if (getConfigItems(configName).indexOf(keyword) < 0) {
                addConfigItem(configName, keyword);
            } else {
                removeConfigItem(configName, keyword);
            }
        }, toggleWhiteKeywordInpost(node) {
            KeyWord.toggleKeywordInpost(node, 'WhiteKeywordsCloseInPost');
            KeyWord.showWhiteKeywordsWicket();
        }, toggleSpamKeywordInpost(node) {
            KeyWord.toggleKeywordInpost(node, 'SpamKeywordsOpenInPost');
            KeyWord.showSpamKeywordsWicket();
        }, showWhiteKeywordsHighlight() {
            $('.highlight-keyword').css('cssText', 'color: #BC3F3C !important');
            $('#white-keywords-highlight-toggler').text('取消高亮');
            setPostConfig('WhiteKeywordsHighlight', true);
        }, hideWhiteKeywordsHighlight() {
            $('.highlight-keyword').css('cssText', 'color: ;');
            $('#white-keywords-highlight-toggler').text('贴内高亮');
            deletePostConfig('WhiteKeywordsHighlight');
        }, toggleWhiteKeywordsHighlight() {
            if (!getPostConfig('WhiteKeywordsHighlight')) {
                KeyWord.showWhiteKeywordsHighlight();
            } else {
                KeyWord.hideWhiteKeywordsHighlight();
            }
        }, goPreWhiteKeyword() {
            if (!getPostConfig('WhiteKeywordsHighlight')) {
                KeyWord.showWhiteKeywordsHighlight();
            }
            let scrollTop = $(document).scrollTop();
            let nodes = $('.highlight-keyword').toArray();
            for (let i = nodes.length - 1; i >= 0; i--) {
                let node = nodes[i];
                let nodeTop = $(node).parents('tr').parents('tr').prev().offset().top;
                if (nodeTop < scrollTop) {
                    scrollTo(nodeTop);
                    return;
                }
            }
        }, goNextWhiteKeyword() {
            if (!getPostConfig('WhiteKeywordsHighlight')) {
                KeyWord.showWhiteKeywordsHighlight();
            }
            let scrollTop = $(document).scrollTop();
            let nodes = $('.highlight-keyword').toArray();
            for (let node of nodes) {
                let nodeTop = $(node).parents('tr').parents('tr').prev().offset().top;
                if (nodeTop - scrollTop > window.innerHeight) {
                    $('html, body').animate({scrollTop: nodeTop}, 1000);
                    return;
                }
            }
        }, renderWhiteKeywordsWicket() {
            refreshConfigItems('WhiteKeywords');
            refreshConfigItems('WhiteKeywordsCloseInPost');
            let whiteKeywords = getConfigItems('WhiteKeywords');
            let whiteKeywordsCloseInPost = getConfigItems('WhiteKeywordsCloseInPost');
            let html = whiteKeywords.map(whiteKeyword => {
                return `
                    <div class='keyword-wicket'>
                        <label>${whiteKeyword}</label>
                        <div class='keyword-operation-wicket'>
                            <a class='keyword-operation white-keyword-inpost-toggler' rel='${whiteKeyword}' title='设置该白名单是否在贴内高亮，默认高亮'>贴内${whiteKeywordsCloseInPost.indexOf(whiteKeyword) >= 0 ? '-' : '+'}</a>
                            <a class='keyword-operation delete-white-keyword-btn' rel='${whiteKeyword}'>删除</a>
                        </div>
                    </div>
                `;
            }).join('') + `
                    <div class='keyword-operation-wicket'>
                        <a class='keyword-operation export-all-white-keywords-btn' title='导出结果会显示在白名单输入框中'>导出全部</a>
                        <a class='keyword-operation delete-all-white-keywords-btn'>删除全部</a>
                    </div>
            `;
            $('#white-keywords-wicket').html(html);
        }, showWhiteKeywordsWicket() {
            KeyWord.renderWhiteKeywordsWicket();
            $('#white-keywords-wrapper').show();
            $('#spam-keywords-wrapper').hide();
            $('#white-keywords-wicket-toggler').text('隐藏白名单');
            $('#spam-keywords-wicket-toggler').text('查看屏蔽词');
            KeyWord.whiteKeywordsWicketStatus = true;
            KeyWord.spamKeywordsWicketStatus = false;
        }, hideWhiteKeywordsWicket() {
            $('#white-keywords-wrapper').hide();
            $('#white-keywords-wicket-toggler').text('查看白名单');
            KeyWord.whiteKeywordsWicketStatus = false;
        }, toggleWhiteKeywordsWicket() {
            if (!KeyWord.whiteKeywordsWicketStatus) {
                KeyWord.showWhiteKeywordsWicket();
            } else {
                KeyWord.hideWhiteKeywordsWicket();
            }
        }, renderSpamKeywordsWicket() {
            refreshConfigItems('SpamKeywords');
            refreshConfigItems('SpamKeywordsOpenInPost');
            let spamKeywords = getConfigItems('SpamKeywords');
            let spamKeywordsOpenInPost = getConfigItems('SpamKeywordsOpenInPost');
            let html = spamKeywords.map(spamKeyword => {
                return `
                    <div class='keyword-wicket'>
                        <label>${spamKeyword}</label>
                        <div class='keyword-operation-wicket'>
                            <a class='keyword-operation spam-keyword-inpost-toggler' rel='${spamKeyword}' title='设置该屏蔽词是否在贴内生效，默认不屏蔽'>贴内${spamKeywordsOpenInPost.indexOf(spamKeyword) >= 0 ? '-' : '+'}</a>
                            <a class='keyword-operation delete-spam-keyword-btn' rel='${spamKeyword}'>删除</a>
                        </div>
                    </div>
                `;
            }).join('') + `
                    <div class='keyword-operation-wicket'>
                        <a class='keyword-operation export-all-spam-keywords-btn' title='导出结果会显示在屏蔽词输入框中'>导出全部</a>
                        <a class='keyword-operation delete-all-spam-keywords-btn'>删除全部</a>
                    </div>
            `;
            $('#spam-keywords-wicket').html(html);
        }, showSpamKeywordsWicket() {
            KeyWord.renderSpamKeywordsWicket();
            $('#white-keywords-wrapper').hide();
            $('#spam-keywords-wrapper').show();
            $('#white-keywords-wicket-toggler').text('查看白名单');
            $('#spam-keywords-wicket-toggler').text('隐藏屏蔽词');
            KeyWord.whiteKeywordsWicketStatus = false;
            KeyWord.spamKeywordsWicketStatus = true;
        }, hideSpamKeywordsWicket() {
            $('#spam-keywords-wrapper').hide();
            $('#spam-keywords-wicket-toggler').text('查看屏蔽词');
            KeyWord.spamKeywordsWicketStatus = false;
        }, toggleSpamKeywordsWicket() {
            if (!KeyWord.spamKeywordsWicketStatus) {
                KeyWord.showSpamKeywordsWicket();
            } else {
                KeyWord.hideSpamKeywordsWicket();
            }
        }, addSpamPost(node) {
            let id = $(node).attr('id');
            addConfigItem('SpamPosts', id);
            $('#boardtr_' + id).remove();
        }, registerEvent() {
            $(document).on('keypress', '#add-white-keywords-inputbox', function (event) {
                if (event.keyCode === 13) {
                    KeyWord.addWhiteKeyword();
                }
            });
            $(document).on('click', '#add-white-keyword-btn', function () {
                KeyWord.addWhiteKeyword();
            });

            $(document).on('keypress', '#add-spam-keywords-inputbox', function (event) {
                if (event.keyCode === 13) {
                    KeyWord.addSpamKeyword();
                }
            });
            $(document).on('click', '#add-spam-keyword-btn', function () {
                KeyWord.addSpamKeyword();
            });

            $(document).on('click', '.delete-white-keyword-btn', function () {
                KeyWord.deleteWhiteKeyword(this);
            });
            $(document).on('click', '.delete-spam-keyword-btn', function () {
                KeyWord.deleteSpamKeyword(this);
            });

            $(document).on('click', '.export-all-white-keywords-btn', function () {
                $('#add-white-keywords-inputbox').val(getConfig('WhiteKeywords'));
            });
            $(document).on('click', '.export-all-spam-keywords-btn', function () {
                $('#add-spam-keywords-inputbox').val(getConfig('SpamKeywords'));
            });

            $(document).on('click', '.delete-all-white-keywords-btn', function () {
                deleteConfig('WhiteKeywords');
                deleteConfig('WhiteKeywordsCloseInPost');
                KeyWord.showWhiteKeywordsWicket();
            });
            $(document).on('click', '.delete-all-spam-keywords-btn', function () {
                deleteConfig('SpamKeywords');
                deleteConfig('SpamKeywordsOpenInPost');
                KeyWord.showSpamKeywordsWicket();
            });

            $(document).on('click', '.white-keyword-inpost-toggler', function () {
                KeyWord.toggleWhiteKeywordInpost(this);
            });
            $(document).on('click', '.spam-keyword-inpost-toggler', function () {
                KeyWord.toggleSpamKeywordInpost(this);
            });

            $(document).on('click', '#white-keywords-highlight-toggler', function () {
                KeyWord.toggleWhiteKeywordsHighlight();
            });
            $(document).on('click', '#go-pre-white-keyword-btn', function () {
                KeyWord.goPreWhiteKeyword();
            });
            $(document).on('click', '#go-next-white-keyword-btn', function () {
                KeyWord.goNextWhiteKeyword();
            });

            $(document).on('click', '#white-keywords-wicket-toggler', function () {
                KeyWord.toggleWhiteKeywordsWicket();
            });
            $(document).on('click', '#spam-keywords-wicket-toggler', function () {
                KeyWord.toggleSpamKeywordsWicket();
            });

            $(document).on('click', '.add-spam-post-btn', function () {
                KeyWord.addSpamPost(this);
            });
        }
    };

    let Floor = {
        init() {
            if (!IS_POST_PAGE) {
                return;
            }
            Floor.initFloor();
            Floor.initLandlordMarker();
            Floor.initMyUsername();
            Floor.registerEvent();
        }, initFloor() {
            let floor = parseInt(getPostConfig('Floor', '0'));
            if (floor) {
                let pageId = Math.floor((floor - 1) / 300);
                if (pageId === parseInt(PAGE_ID)) {
                    let node = $('.authorname').toArray().filter(e => parseInt($(e).find('font')[0].innerText.substring(1)) === floor);
                    scrollTo($(node).parent().prev().prev().offset().top);
                    deletePostConfig('Floor');
                } else {
                    window.open(`https://bbs.jjwxc.net/showmsg.php?board=${BOARD_ID}&id=${POST_ID}&page=${pageId}`);
                }
            }
        }, initLandlordMarker() {
            let landlord = $('.authorname').eq(0).find('font').eq(2).text();
            if (landlord === '于') {
                return;
            }
            $('font').each(function () {
                if ($(this).text() === landlord) {
                    $(this).parent().find('font').eq(1).after('<span class="landlord">[楼主]</span>');
                }
            });
        }, initMyUsername() {
            $('input[name="username"]').val(getConfig('Username') || '= =');
        }, registerEvent() {
            window.onbeforeunload = function () {
                if (!getPostConfig('Floor')) {
                    let currentFloor = getCurrentFloor();
                    if (currentFloor > 10 && (currentFloor - 1) % 300 < 290) {
                        setPostConfig('Floor', currentFloor);
                    }
                }
            };

            $(document).on('click', 'a[class^="quotereply"]', function () {
                setPostConfig('Floor', $(this).parent().prev().find('font')[0].innerText.substring(1));
            });

            $('input[name="username"]').bind('input propertychange', function () {
                setConfig('Username', $('input[name="username"]').val());
            });
        }
    };

    let Other = {
        init() {
            Other.registerEvent();
        }, count() {
            let countBtn = $('#count-btn');
            if (countBtn.text() === '查房中..') {
                alert('查房中，请耐心等待');
                return;
            }
            countBtn.text('查房中..');
            let peopleBriefs = [];
            let currentPageId = 0;
            let maxPageId = parseInt(PAGE_ID);
            let callback = function (response, status) {
                if (status === "success") {
                    let peopleStrs = response.match(/<font color=#999999>.*?<\/font>/g);
                    if (peopleStrs) {
                        _.each(peopleStrs, function (s) {
                            let peopleId = s.replace('<font color=#999999>', '').replace('</font>', '');
                            let peopleBrief = _.find(peopleBriefs, function (b) {
                                return b.peopleId === peopleId;
                            });
                            if (peopleBrief) {
                                peopleBrief.replies.push('');
                            } else {
                                peopleBriefs.push({peopleId: peopleId, replies: ['']});
                            }
                        });
                    }
                    if (currentPageId === maxPageId) {
                        let size1 = _.filter(peopleBriefs, function (b) {
                            return b.replies.length === 1;
                        }).length;
                        let size2 = _.filter(peopleBriefs, function (b) {
                            return b.replies.length <= 3;
                        }).length;
                        let size3 = _.filter(peopleBriefs, function (b) {
                            return b.replies.length >= 10;
                        }).length;
                        alert(`截至第${maxPageId + 1}页，该贴共${peopleBriefs.length}人发言。\n其中，${size1}人仅发言1次，${size2}人发言次数<=3，${size3}人发言次数>=10。`);
                        $('#count-btn').text('查房');
                    } else {
                        console.log(`第${currentPageId++}次统计，人数为${peopleBriefs.length}`);
                    }
                }
            };
            for (let i = 0; i <= maxPageId; i++) {
                getRequest(`https://bbs.jjwxc.net/showmsg.php?board=${BOARD_ID}&id=${POST_ID}&page=${i}`, callback);
            }
        }, registerEvent() {
            $(document).on('click', '#count-btn', function () {
                Other.count();
            });
        }
    };

    Skin.init();
    Toolbar.init();
    KeyWord.init();
    Floor.init();
    Other.init();

    function getParamValue(key, url) {
        let query = url ? url.split('?')[1] : location.search.substring(1);
        let params = query.split('&');
        for (let param of params) {
            let pair = param.split('=');
            if (pair[0] === key) {
                return pair[1];
            }
        }
        return ('');
    }

    function getRequest(url, callback) {
        $.ajax({
            type: 'GET', url: url, xhrFields: {
                withCredentials: true
            }, success: callback
        });
    }

    function addScript(js) {
        if (!js) {
            return;
        }
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = js;
        document.head.appendChild(script);
    }

    function addStyle(css) {
        if (!css) {
            return;
        }
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    function getConfig(name, defaultValue) {
        return localStorage.getItem(name) || defaultValue || '';
    }

    function setConfig(name, value) {
        localStorage.setItem(name, value);
    }

    function deleteConfig(name) {
        localStorage.removeItem(name);
    }

    function getPostConfig(name, defaultValue) {
        return getConfig(PREFIX + '_' + name, defaultValue);
    }

    function setPostConfig(name, value) {
        setConfig(PREFIX + '_' + name, value);
    }

    function deletePostConfig(name) {
        deleteConfig(PREFIX + '_' + name);
    }

    function getConfigItems(name) {
        let config = getConfig(name).trim();
        return config ? config.split(SEPARATOR) : [];
    }

    function addConfigItem(name, item) {
        setConfig(name, getConfig(name) + SEPARATOR + item);
    }

    function removeConfigItem(name, item) {
        setConfig(name, (SEPARATOR + getConfig(name) + SEPARATOR).replace(SEPARATOR + item + SEPARATOR, SEPARATOR));
    }

    function refreshConfigItems(name) {
        let items = Array.from(new Set(getConfigItems(name)));
        setConfig(name, items.join(SEPARATOR));
    }

    function getCurrentFloor() {
        let scrollTop = $(document).scrollTop();
        let nodes = $('.authorname').toArray();
        for (let node of nodes) {
            let nodeTop = $(node).parent().prev().prev().offset().top;
            if (nodeTop > scrollTop) {
                return parseInt($(node).find('font')[0].innerText.substring(1));
            }
        }
        return parseInt($(nodes.pop()).find('font')[0].innerText.substring(1));
    }

    function scrollTo(height) {
        $('html, body').animate({scrollTop: height}, 1000);
    }
});
