// ==UserScript==
// @name         哔哩哔哩 - 屏蔽指定内容 - 改
// @namespace    https://greasyfork.org/zh-CN/users/981987-ztelliot
// @homepage     https://greasyfork.org/zh-CN/users/981987-ztelliot
// @version      5.0.0
// @description  实现对评论区中无意义的At或分别按用户名、关键字或正则表达式对视频(或直播间/相薄)和评论(或回复)进行屏蔽; 将鼠标移至网页右下角弹出悬浮按钮
// @author       pana, ztelliot
// @include      *://www.bilibili.com/*
// @include      *://search.bilibili.com/*
// @include      *://live.bilibili.com/*
// @include      *://space.bilibili.com/*
// @include      *://t.bilibili.com/*
// @include      *://h.bilibili.com/*
// @include      *://manga.bilibili.com/*
// @include      *://message.bilibili.com/*
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/minified/arrive.min.js
// @require      https://greasyfork.org/scripts/407543-block-obj/code/Block_Obj.js?version=963893
// @require      https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @license      GNU General Public License v3.0 or later
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_setClipboard
// @grant        GM.setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @run-at       document-start
// @noframes
// @note         更新记录:
// @note         ver.5.0.0  适配 ShadowRoot 评论区
// @note         ver.4.9.4  按钮样式适配新版播放页
// @note         ver.4.9.3  修复评论区评论匹配问题
// @note         ver.4.9.2  增加替换评论区关键词搜索
// @note         ver.4.9.1  修复新版播放页面下不能屏蔽含多个 At 评论的问题
// @note         ver.4.9.0  增加对新版播放页的支持
// @note         ver.4.8.1  增加屏蔽仅包含@他人的评论
// @downloadURL https://update.greasyfork.org/scripts/454637/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E5%86%85%E5%AE%B9%20-%20%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/454637/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E5%86%85%E5%AE%B9%20-%20%E6%94%B9.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    const OLD_URL = location.href;
    const MODULE = {
        USERNAME: {
            className: 'li_username',
        },
        WHITELIST: {
            className: 'li_whitelist',
        },
        VIDEO_KEYWORD: {
            className: 'li_video_keyword',
        },
        COMMENT_KEYWORD: {
            className: 'li_comment_keyword',
        },
    };
    const BASIC_STYLE = `
      .player-mode-webfullscreen,
      .mode-webfullscreen,
      .webfullscreen,
      .player-module {
          z-index: 100001 !important;
      }
      .bilibili_reply_bang_button,
      .bilibili_comment_bang_button,
      .bilibili_reply_user_block_button,
      .bilibili_comment_user_block_button {
          display: inline-block;
          padding: 0px 5px;
          border-radius: 4px;
          cursor: pointer;
      }
      .bilibili_reply_bang_button:hover,
      .bilibili_comment_bang_button:hover,
      .bilibili_reply_user_block_button:hover,
      .bilibili_comment_user_block_button:hover {
          color: #00a1d6;
          background-color: #e5e9ef;
      }
      .bilibili_reply_bang_button_new,
      .bilibili_comment_bang_button_new,
      .bilibili_reply_user_block_button_new,
      .bilibili_comment_user_block_button_new {
          display: inline-block;
          padding: 0px 15px;
          cursor: pointer;
      }
      .bilibili_reply_bang_button_new:hover,
      .bilibili_comment_bang_button_new:hover,
      .bilibili_reply_user_block_button_new:hover,
      .bilibili_comment_user_block_button_new:hover {
          color: #00a1d6;
      }
  `;
    const handler = [
        {
            index: '.video-card-common',
            user: ['a.up', 'a.ex-up'],
            text: ['a.title', 'p.ex-title'],
            method: 1,
        },
        {
            clientInformation: 0,
            index: '.video-card-reco',
            user: 'p.up',
            text: 'p.title',
        },
        {
            index: '.van-slide div.item',
            user: null,
            text: 'p.title',
        },
        {
            index: '.rank-wrap',
            user: 'span.name',
            text: ['p.f-title', 'p.title', 'div.txt a.link p'],
        },
        {
            index: '.article-card',
            user: 'a.up',
            text: 'a.title',
            method: 1,
        },
        {
            index: '.live-card',
            user: 'p.name',
            text: 'p.desc',
            method: 1,
            type: {
                live: true,
            },
        },
        {
            index: '.card-live-module',
            user: '.auther',
            text: 'p.t',
            method: 1,
            type: {
                live: true,
            },
        },
        {
            index: '.live-rank-item',
            user: 'div.txt > p',
            text: 'p.p2',
            method: 0,
            type: {
                live: true,
            },
        },
        {
            index: '.manga-card',
            user: null,
            text: 'p.manga-title',
            method: 1,
        },
        {
            index: '.manga-spread-module',
            user: null,
            text: 'p.t',
            method: 1,
        },
        {
            c: 1,
            index: '.groom-module',
            user: 'p.author',
            userReg: /^up主：/,
            text: 'p.title',
        },
        {
            index: 'ul.vd-list li',
            user: 'a.v-author',
            text: 'a.title',
        },
        {
            index: '.video-page-card, .video-page-operator-card',
            user: 'div.up',
            text: '.title',
        },
        {
            index: '.rank-list li.item',
            user: null,
            text: '> a',
        },
        {
            c: 2,
            index: '.storey-box .spread-module',
            bv: 'a',
            text: 'p.t',
        },
        {
            index: '.ebox',
            user: '.author',
            text: '.etitle',
            url: ['www.bilibili.com/video/', 'www.bilibili.com/bangumi/'],
            comment: true,
        },
        {
            index: '.article-list li',
            user: '.nick-name',
            text: '.article-title',
            url: 'www.bilibili.com/read/ranking',
        },
        {
            index: '.rank-video-card, .video-card',
            user: '.up-name',
            text: '.video-name',
            url: ['www.bilibili.com/v/channel', 'www.bilibili.com/v/popular'],
        },
        {
            index: '.video-item',
            user: 'a.up-name',
            text: 'a.title',
            url: 'search.bilibili.com',
        },
        {
            index: '.live-user-item',
            user: '.uname',
            text: null,
            method: 0,
            type: {
                live: true,
            },
            url: 'search.bilibili.com',
        },
        {
            index: '.live-room-item',
            user: '.uname span',
            text: '.item-title',
            method: 0,
            type: {
                live: true,
            },
            url: 'search.bilibili.com',
        },
        {
            index: '.photo-item',
            user: '.up-name',
            text: '.title',
            method: 0,
            type: {
                pic: true,
            },
            url: 'search.bilibili.com',
        },
        {
            index: '.rank-item',
            user: '.room-anchor',
            text: '.room-title',
            method: 0,
            type: {
                live: true,
            },
            url: 'live.bilibili.com',
            comment: true,
        },
        {
            index: '.room-card-wrapper',
            user: '.room-anchor > span',
            text: '.room-title',
            method: 0,
            type: {
                live: true,
            },
            url: 'live.bilibili.com',
        },
        {
            index: '.ysly-room-ctnr li',
            user: '.uname',
            text: '.room-name',
            method: 0,
            type: {
                live: true,
            },
            url: 'live.bilibili.com',
        },
        {
            index: 'ul.list li',
            user: '.room-anchor > span',
            text: '.room-title',
            method: 0,
            type: {
                live: true,
            },
            url: 'live.bilibili.com',
        },
        {
            index: '.card-items li',
            user: '.uname',
            text: '.room-name',
            method: 0,
            type: {
                live: true,
            },
        },
        {
            index: '.content li',
            user: '.user-container a span',
            text: '.article-title a',
            method: 0,
            type: {
                pic: true,
            },
            url: 'h.bilibili.com',
            comment: true,
        },
        {
            index: '.rank-list > div',
            user: ['.name', '.user-name'],
            text: ['.title', '.work-name'],
            method: 0,
            type: {
                pic: true,
            },
            url: 'h.bilibili.com',
        },
        {
            index: '.canvas-card',
            user: '.user-container a span',
            text: '.article-title a',
            method: 1,
            type: {
                pic: true,
            },
            url: 'h.bilibili.com',
        },
    ];
    let bilibiliConfig = {
        functionEnable: true,
        usernameEnable: true,
        keywordEnable: true,
        whitelistEnable: false,
        commentEnable: false,
        commentKeywordEnable: false,
        commentFans: false,
        commentSearch: false,
        commentAt: true,
        convertEmojiEnable: false,
        showBlockUserBtnEnable: false,
        showBangBtnEnable: false,
        liveEnable: false,
        picEnable: false,
        messageReplyEnable: false,
        messageReplyDelEnable: false,
        dynamicVideo: false,
        dynamicContent: false,
        usernameArray: [],
        keywordArray: [],
        commentArray: [],
        whitelistArray: [],
    };
    let infoRecord = [];
    const tempRecord = Block_Obj.GM.getValue('infoRecord', []);
    tempRecord.forEach(item => {
        if (dayjs().diff(item.time, 'd') <= 3) {
            infoRecord.push(item);
        }
    });
    let delNum = 0;
    let recordButton = [];
    let requestTotal = 0;
    let sendStatus = true;
    const INTERVAL_TIME = 100;
    if (typeof Block_Obj !== 'function') {
        alert('Block_Obj.js was not loaded successfully.');
    } else if (typeof Block_Obj.fn.compare !== 'function') {
        alert('The version of Block_Obj.js is too low.');
    }
    let blockObj = new Block_Obj('bilibili_config', [
        {
            key: 'keywordArray',
            ori: 'regArray',
        },
        {
            key: 'commentArray',
            ori: 'commentRegArray',
        },
    ]);
    await document.arrive('body', { fireOnAttributesModification: true, onceOnly: true, existing: true }, async function () {
        await blockObj.init({
            id: 'bilibiliConfig',
            menu: 'bilibili_屏蔽设置',
            style: BASIC_STYLE,
            field: [
                {
                    id: 'functionEnable',
                    label: '启用屏蔽功能',
                    title: '总开关',
                    type: 'c',
                    default: true,
                },
                {
                    id: 'whitelistEnable',
                    label: '启用白名单',
                    title: '白名单用户的视频(或直播间/相薄)以及评论(或回复)不会被屏蔽',
                    type: 'c',
                    default: false,
                    move_right: true,
                },
                {
                    label: '屏蔽视频(或直播间/相薄)：',
                    type: 's',
                },
                {
                    id: 'usernameEnable',
                    label: '按用户名',
                    title: '屏蔽指定用户发布的视频(或直播间/相薄)',
                    type: 'c',
                    default: true,
                },
                {
                    id: 'keywordEnable',
                    label: '按关键字或正则',
                    title: '屏蔽标题中包含指定关键字或匹配正则表达式的视频(或直播间/相薄)',
                    type: 'c',
                    default: true,
                    move_right: true,
                },
                {
                    id: 'liveEnable',
                    label: '直播间',
                    title: '扩展作用范围以同时允许屏蔽直播间',
                    type: 'c',
                    default: false,
                    move_right: true,
                },
                {
                    id: 'picEnable',
                    label: '相薄',
                    title: '扩展作用范围以同时允许屏蔽相薄',
                    type: 'c',
                    default: false,
                    move_right: true,
                },
                {
                    id: 'dynamicVideo',
                    label: '动态',
                    title: '允许屏蔽转发、分享指定用户的动态\n允许屏蔽视频标题匹配关键字或正则的动态',
                    type: 'c',
                    default: false,
                    move_right: true,
                },
                {
                    label: '屏蔽评论(或回复)：',
                    type: 's',
                },
                {
                    id: 'commentEnable',
                    label: '按用户名',
                    title: '屏蔽指定用户发布的评论(或回复)',
                    type: 'c',
                    default: false,
                },
                {
                    id: 'commentKeywordEnable',
                    label: '按关键字或正则',
                    title: '屏蔽内容中包含指定关键字或匹配正则表达式的评论(或回复)',
                    type: 'c',
                    default: false,
                    move_right: true,
                },
                {
                    id: 'commentFans',
                    label: '按粉丝勋章',
                    title: '屏蔽直播间中挂有指定粉丝勋章用户发布的弹幕评论\n屏蔽动态、视频播放等页面中挂有指定粉丝勋章用户发布的评论',
                    type: 'c',
                    default: false,
                    move_right: true,
                },
                {
                    id: 'dynamicContent',
                    label: '动态',
                    title: '允许屏蔽动态内容(包含转发、分享)匹配关键字或正则的动态',
                    type: 'c',
                    default: false,
                    move_right: true,
                },
                {
                    type: 'br',
                },
                {
                    id: 'convertEmojiEnable',
                    label: '表情转成文字',
                    title:
                    '判定时将表情包转换成对应的标识文字，例：[鸡腿]、[tv_白眼]等\n注意：使用关键字来匹配表情时，必须包含完整的中括号对；\n如 "鸡腿" 是无法匹配表情 [鸡腿] 的，需使用 "[鸡腿]" 进行匹配',
                    type: 'c',
                    default: false,
                },
                {
                    id: 'showBlockUserBtnEnable',
                    label: '显示屏蔽用户按钮',
                    title: '在评论在底部显示一个屏蔽该用户的按钮',
                    type: 'c',
                    default: false,
                    move_right: true,
                },
                {
                    id: 'showBangBtnEnable',
                    label: '显示"爆炸"按钮',
                    title: '在评论底部显示一个可以拆分并选择文本内容的按钮',
                    type: 'c',
                    default: false,
                    move_right: true,
                },
                {
                    type: 'br',
                },
                {
                    id: 'messageReplyEnable',
                    label: '消息中心里的回复',
                    title: '扩展作用范围以同时允许屏蔽消息中心里的回复',
                    type: 'c',
                    default: false,
                },
                {
                    id: 'messageReplyDelEnable',
                    label: '自动删除回复通知',
                    title: '同时将屏蔽的回复通知自动删除\n删除的记录可在控制台中查看\n请谨慎启用该选项，因为删除操作是不可逆的！',
                    type: 'c',
                    default: false,
                    move_right: true,
                },
                {
                    id: 'commentAt',
                    label: '评论区@',
                    title: '屏蔽评论区中无内容的@',
                    type: 'c',
                    default: false,
                    move_right: true,
                },
                {
                    type: 'br',
                },
                {
                    id: 'commentSearch',
                    label: '去除评论区关键词搜索',
                    title: '替换新版评论区的关键词搜索为普通文本',
                    type: 'c',
                    default: false
                },
                {
                    type: 's',
                },
                {
                    type: 's',
                    label: '白名单 (用户名)：',
                    classname: MODULE.WHITELIST.className,
                },
                {
                    id: 'whitelistInput',
                    label: '输入：',
                    placeholder: ' 同时输入多个时以半角逗号分隔 ',
                    type: 'i',
                    list_id: 'whitelistArray',
                    classname: MODULE.WHITELIST.className,
                },
                {
                    id: 'whitelistArray',
                    type: 'l',
                    default: [],
                    classname: MODULE.WHITELIST.className,
                },
                {
                    type: 's',
                },
                {
                    type: 's',
                    label: '黑名单 (用户名/粉丝勋章名)：',
                    classname: MODULE.USERNAME.className,
                },
                {
                    id: 'usernameInput',
                    label: '输入：',
                    placeholder: ' 同时输入多个时以半角逗号分隔 ',
                    type: 'i',
                    list_id: 'usernameArray',
                    classname: MODULE.USERNAME.className,
                },
                {
                    id: 'usernameArray',
                    type: 'l',
                    default: [],
                    classname: MODULE.USERNAME.className,
                },
                {
                    type: 's',
                },
                {
                    type: 's',
                    label: '视频(或直播间/相薄)关键字或正则：',
                    classname: MODULE.VIDEO_KEYWORD.className,
                },
                {
                    id: 'videoKeywordInput',
                    label: '输入：',
                    placeholder: ' 正则表达式格式: /Pattern/Modifier ',
                    type: 'i',
                    list_id: 'keywordArray',
                    classname: MODULE.VIDEO_KEYWORD.className,
                },
                {
                    id: 'keywordArray',
                    type: 'l',
                    default: [],
                    classname: MODULE.VIDEO_KEYWORD.className,
                },
                {
                    type: 's',
                },
                {
                    type: 's',
                    label: '评论(或回复)关键字或正则：',
                    classname: MODULE.COMMENT_KEYWORD.className,
                },
                {
                    id: 'commentKeywordInput',
                    label: '输入：',
                    placeholder: ' 正则表达式格式: /Pattern/Modifier ',
                    type: 'i',
                    list_id: 'commentArray',
                    classname: MODULE.COMMENT_KEYWORD.className,
                },
                {
                    id: 'commentArray',
                    type: 'l',
                    default: [],
                    classname: MODULE.COMMENT_KEYWORD.className,
                },
                {
                    type: 's',
                },
            ],
            events: {
                save: config => {
                    bilibiliConfig = config;
                    hideEvent();
                },
                change: config => {
                    bilibiliConfig = config;
                    hideEvent();
                },
            },
        });
        bilibiliConfig = blockObj.getConfig();
        if (/www\.bilibili\.com\/?(\/\?spm_id_from=.*)?$/.test(OLD_URL)) {
            document.querySelector('.btn.next') &&
                document.querySelector('.btn.next').addEventListener('click', () => {
                setTimeout(() => {
                    hideEvent();
                }, 250);
            });
            document.querySelector('.btn.prev') &&
                document.querySelector('.btn.prev').addEventListener('click', () => {
                setTimeout(() => {
                    hideEvent();
                }, 250);
            });
            document.body.arrive(
                '.manga-panel .btn-change',
                {
                    fireOnAttributesModification: true,
                    onceOnly: true,
                    existing: true,
                },
                item => {
                    item.addEventListener('click', () => {
                        setTimeout(() => {
                            hideEvent();
                        }, 1000);
                    });
                }
            );
            document.body.arrive(
                '.manga-panel .tab-switch-item',
                {
                    fireOnAttributesModification: true,
                    onceOnly: true,
                    existing: true,
                },
                item => {
                    item.addEventListener('click', () => {
                        setTimeout(() => {
                            hideEvent();
                        }, 1000);
                    });
                }
            );
        }
        if (/live\.bilibili\.com\/all/.test(OLD_URL)) {
            document.body.arrive(
                '.content-panel h1.title > span',
                {
                    fireOnAttributesModification: true,
                    onceOnly: true,
                    existing: true,
                },
                item => {
                    item.addEventListener('click', () => {
                        setTimeout(() => {
                            hideEvent();
                        }, 1000);
                    });
                }
            );
        }
        setInterval(() => {
            hideEvent();
        }, 1000);
    });
    function displayDel(panelId, num) {
        if (document.getElementById(panelId)) {
            document.getElementById(panelId).textContent = ' (自动删除了 ' + num + ' 条通知)';
        } else {
            const delPanel = document.createElement('span');
            delPanel.id = panelId;
            delPanel.textContent = ' (自动删除了 ' + num + ' 条通知)';
            document.querySelector('.space-right-top .title').appendChild(delPanel);
        }
    }
    function decideText(
    textValue,
     isComment = false,
     isLive = false,
     isPic = false,
     sourceText = null,
     isMessageReply = false,
     dynamicVideo = null,
     dynamic = null,
     repost = null,
     onlyAt = false,
    ) {
        let isDecide = false;
        let isDecideComment = false;
        let isDecideDynamic = false;
        let isDecideDynamicTitle = false;
        let isDecideDynamicContent = false;
        let isDecideDynamicRepost = false;
        if (bilibiliConfig.functionEnable) {
            if (textValue) {
                if (isComment) {
                    if (isMessageReply) {
                        if (bilibiliConfig.messageReplyEnable) {
                            isDecideComment = true;
                        }
                    } else {
                        isDecideComment = true;
                    }
                } else if (isLive) {
                    if (bilibiliConfig.liveEnable) {
                        isDecide = true;
                    }
                } else if (isPic) {
                    if (bilibiliConfig.picEnable) {
                        isDecide = true;
                    }
                } else {
                    isDecide = true;
                }
            } else {
                if (bilibiliConfig.dynamicVideo && dynamicVideo) {
                    isDecideDynamic = true;
                    isDecideDynamicTitle = true;
                }
                if (bilibiliConfig.dynamicContent && dynamic) {
                    isDecideDynamic = true;
                    isDecideDynamicContent = true;
                }
                if (bilibiliConfig.dynamicContent && repost) {
                    isDecideDynamic = true;
                    isDecideDynamicRepost = true;
                }
            }
        }
        if (isDecide) {
            if (bilibiliConfig.keywordEnable) {
                for (let k of bilibiliConfig.keywordArray) {
                    if (k) {
                        if (typeof k === 'string' && textValue.includes(k)) {
                            return true;
                        } else {
                            try {
                                if (textValue.match(k)) {
                                    return true;
                                }
                            } catch (e) {
                                console.error('存在错误的正则表达式: ', e);
                            }
                        }
                    }
                }
            }
            if (bilibiliConfig.commentAt && onlyAt) {
                return true;
            }
        } else if (isDecideComment) {
            if (bilibiliConfig.commentKeywordEnable) {
                for (let i of bilibiliConfig.commentArray) {
                    if (i) {
                        if (typeof i === 'string') {
                            if (textValue.includes(i)) {
                                if (sourceText) {
                                    if (sourceText.includes(i)) {
                                        return true;
                                    } else if (/\[.*\]/i.test(i)) {
                                        return true;
                                    }
                                } else {
                                    return true;
                                }
                            } else if (sourceText && /\[.*\]/i.test(i)) {
                                if (sourceText.includes(i)) {
                                    return true;
                                }
                            }
                        } else {
                            try {
                                if (textValue.match(i)) {
                                    return true;
                                } else if (sourceText.match(i)) {
                                    return true;
                                }
                            } catch (e) {
                                console.error('存在错误的正则表达式: ', e);
                            }
                        }
                    }
                }
            }
            if (bilibiliConfig.commentAt && onlyAt) {
                return true;
            }
        } else if (isDecideDynamic) {
            let dynamicStatus = false;
            if (isDecideDynamicTitle) {
                if (bilibiliConfig.keywordEnable) {
                    for (let o of bilibiliConfig.keywordArray) {
                        if (o) {
                            if (typeof o === 'string' && dynamicVideo.includes(o)) {
                                dynamicStatus = true;
                                break;
                            } else {
                                try {
                                    if (dynamicVideo.match(o)) {
                                        dynamicStatus = true;
                                        break;
                                    }
                                } catch (e) {
                                    console.error('存在错误的正则表达式: ', e);
                                }
                            }
                        }
                    }
                }
            }
            if (!dynamicStatus && dynamic.content && isDecideDynamicContent) {
                if (bilibiliConfig.commentKeywordEnable) {
                    for (const q of bilibiliConfig.commentArray) {
                        if (q) {
                            if (typeof q === 'string') {
                                if (dynamic.content.includes(q)) {
                                    if (dynamic.sourceContent) {
                                        if (dynamic.sourceContent.includes(q)) {
                                            dynamicStatus = true;
                                            break;
                                        } else if (/\[.*\]/i.test(q)) {
                                            dynamicStatus = true;
                                            break;
                                        }
                                    } else {
                                        dynamicStatus = true;
                                        break;
                                    }
                                } else if (dynamic.sourceContent && /\[.*\]/i.test(q)) {
                                    if (dynamic.sourceContent.includes(q)) {
                                        dynamicStatus = true;
                                        break;
                                    }
                                }
                            } else {
                                try {
                                    if (dynamic.content.match(q)) {
                                        dynamicStatus = true;
                                        break;
                                    } else if (dynamic.sourceContent.match(q)) {
                                        dynamicStatus = true;
                                        break;
                                    }
                                } catch (e) {
                                    console.error('存在错误的正则表达式: ', e);
                                }
                            }
                        }
                    }
                }
            }
            if (!dynamicStatus && repost.content && isDecideDynamicRepost) {
                if (bilibiliConfig.commentKeywordEnable) {
                    for (const r of bilibiliConfig.commentArray) {
                        if (r) {
                            if (typeof r === 'string') {
                                if (repost.content.includes(r)) {
                                    if (repost.sourceContent) {
                                        if (repost.sourceContent.includes(r)) {
                                            dynamicStatus = true;
                                            break;
                                        } else if (/\[.*\]/i.test(r)) {
                                            dynamicStatus = true;
                                            break;
                                        }
                                    } else {
                                        dynamicStatus = true;
                                        break;
                                    }
                                } else if (repost.sourceContent && /\[.*\]/i.test(r)) {
                                    if (repost.sourceContent.includes(r)) {
                                        dynamicStatus = true;
                                        break;
                                    }
                                }
                            } else {
                                try {
                                    if (repost.content.match(r)) {
                                        dynamicStatus = true;
                                        break;
                                    } else if (repost.sourceContent.match(r)) {
                                        dynamicStatus = true;
                                        break;
                                    }
                                } catch (e) {
                                    console.error('存在错误的正则表达式: ', e);
                                }
                            }
                        }
                    }
                }
            }
            return dynamicStatus;
        }
        return false;
    }
    function decideUsername(
    username,
     isComment = false,
     isLive = false,
     isPic = false,
     isMessageReply = false,
     trueLove = null,
     repostUser = null
    ) {
        let isDecide = false;
        if (bilibiliConfig.functionEnable && username) {
            if (isComment) {
                if (bilibiliConfig.commentEnable) {
                    if (isMessageReply) {
                        if (bilibiliConfig.messageReplyEnable) {
                            isDecide = true;
                        }
                    } else {
                        isDecide = true;
                    }
                }
            } else if (isLive) {
                if (bilibiliConfig.liveEnable) {
                    if (bilibiliConfig.usernameEnable) {
                        isDecide = true;
                    }
                }
            } else if (isPic) {
                if (bilibiliConfig.picEnable) {
                    if (bilibiliConfig.usernameEnable) {
                        isDecide = true;
                    }
                }
            } else {
                if (bilibiliConfig.usernameEnable) {
                    isDecide = true;
                }
            }
        }
        if (isDecide) {
            if (bilibiliConfig.usernameArray.includes(username)) {
                return true;
            }
        }
        if (bilibiliConfig.functionEnable) {
            if (bilibiliConfig.commentFans && trueLove) {
                if (bilibiliConfig.usernameArray.includes(trueLove)) {
                    return true;
                }
            }
            if (bilibiliConfig.dynamicVideo && repostUser) {
                if (bilibiliConfig.usernameArray.includes(repostUser)) {
                    return true;
                }
            }
        }
        return false;
    }
    function isWhitelist(username) {
        if (username && bilibiliConfig.functionEnable && bilibiliConfig.whitelistEnable) {
            if (bilibiliConfig.whitelistArray.includes(username)) {
                return true;
            }
        }
        return false;
    }
    function hideHandler(itemNode, username, textValue, method = 0, type = {}, remove = false) {
        if (username) {
            if (typeof username === 'object') {
                username = username.textContent;
            }
            username = username.trim();
        }
        if (textValue) {
            if (typeof textValue === 'object') {
                textValue = textValue.textContent;
            }
            textValue = textValue.trim();
        }
        const isComment = type.comment ? true : false;
        const isMessageReply = type.messageReply ? true : false;
        const delButton = type.delButton ? type.delButton : null;
        const isLive = type.live ? true : false;
        const isPic = type.pic ? true : false;
        const trueLove = type.trueLove ? type.trueLove.trim() : null;
        const dynamic = type.dynamic != null && typeof type.dynamic === 'object' ? type.dynamic : null;
        const dynamicVideo = type.dynamicVideo ? type.dynamicVideo.trim() : null;
        const repost = type.repost != null && typeof type.repost === 'object' ? type.repost : null;
        const repostUser = type.repostUser ? type.repostUser.trim() : null;
        const sourceText = type.sourceText ? type.sourceText : null;
        const onlyAt = type.onlyAt ? true : false;
        let hideStatus = false;
        if (isWhitelist(username)) {
            hideStatus = false;
        } else if (decideUsername(username, isComment, isLive, isPic, isMessageReply, trueLove, repostUser)) {
            hideStatus = true;
        } else if (decideText(textValue, isComment, isLive, isPic, sourceText, isMessageReply, dynamicVideo, dynamic, repost, onlyAt)) {
            hideStatus = true;
        } else {
            hideStatus = false;
        }
        if (itemNode.constructor == Array) {
            for (let eleNode of itemNode) {
                if (eleNode) {
                    if (remove && hideStatus) eleNode.remove();
                    else Block_Obj.fn.hideOperation(eleNode, hideStatus, method);
                }
            }
        } else {
            if (remove && hideStatus) itemNode.remove();
            else Block_Obj.fn.hideOperation(itemNode, hideStatus, method);
        }
        if (hideStatus) {
            if (delButton) {
                if (bilibiliConfig.messageReplyDelEnable && !recordButton.includes(delButton)) {
                    recordButton.push(delButton);
                    delButton.click();
                    console.info('%c自动删除通知:', 'color: purple;', '\n用户名:', username, '\n评论内容:', textValue);
                    delNum++;
                    displayDel('messageDelPanel', delNum);
                }
            }
        }
    }
    function extractEle(ele, selector) {
        let result = null;
        if (selector) {
            if (Array.isArray(selector)) {
                for (const e of selector) {
                    if (ele.querySelector(e)) {
                        result = ele.querySelector(e);
                        break;
                    }
                }
            } else {
                result = ele.querySelector(selector);
            }
        }
        return result;
    }
    function hideEvent() {
        handler.forEach(item => {
            const { c, index, user, text, method, type, userReg, url, comment, bv } = item;
            let status = false;
            if (url) {
                if (Array.isArray(url)) {
                    for (let u of url) {
                        if (OLD_URL.indexOf(u) !== -1) {
                            status = true;
                            break;
                        }
                    }
                } else {
                    status = OLD_URL.indexOf(url) !== -1;
                }
            } else {
                status = OLD_URL.indexOf('www.bilibili.com') !== -1;
            }
            if (status) {
                const all = document.querySelectorAll(index);
                for (const ele of all) {
                    if (c == 1) {
                        hideHandler(ele, extractEle(ele, user).textContent.replace(userReg, ''));
                    } else if (c == 2) {
                        const bvNum = getBvNumber(ele.querySelector(bv).href);
                        asyncUsernameHandle(bvNum, ele, extractEle(ele, text));
                    } else {
                        hideHandler(ele, extractEle(ele, user), extractEle(ele, text), method, type);
                    }
                }
                if (comment) {
                    hideComment();
                }
            }
        });
        if (OLD_URL.indexOf('www.bilibili.com') !== -1) {
            try {
                const carouselModulePanel = document.querySelector('.carousel-module .panel');
                if (carouselModulePanel) {
                    const carouselModulePanelTitle = carouselModulePanel.querySelectorAll('ul.title a');
                    const carouselModulePanelPic = carouselModulePanel.querySelectorAll('ul.pic li');
                    const carouselModulePanelTrig = carouselModulePanel.querySelectorAll('ul.trig span');
                    for (let panelIndex = 0; panelIndex < carouselModulePanelTitle.length; panelIndex++) {
                        hideHandler(
                            [carouselModulePanelTitle[panelIndex], carouselModulePanelPic[panelIndex], carouselModulePanelTrig[panelIndex]],
                            null,
                            carouselModulePanelTitle[panelIndex],
                            3
                        );
                    }
                }
            } catch (e) {
                console.error('bilibili_BLock: Variable carouselModulePanel is error.');
                console.error(e);
            }
            const rankItem = document.getElementsByClassName('rank-item');
            for (const rankItemEle of rankItem) {
                let textValue = '';
                if (rankItemEle.querySelector('p.ri-title')) {
                    textValue = rankItemEle.querySelector('p.ri-title');
                }
                if (rankItemEle.querySelector('a.title')) {
                    textValue = rankItemEle.querySelector('a.title');
                }
                if (rankItemEle.querySelector('.detail > a')) {
                    hideHandler(rankItemEle, rankItemEle.querySelector('.detail > a'), textValue);
                } else if (rankItemEle.querySelector('a')) {
                    const linkA = rankItemEle.querySelector('a');
                    const bvNum = getBvNumber(linkA.href);
                    asyncUsernameHandle(bvNum, rankItemEle, textValue);
                }
            }
            const recentHot = document.querySelectorAll('div#recent_hot li');
            for (const recentHotItem of recentHot) {
                const bvNum = getBvNumber(recentHotItem.querySelector('a').href);
                asyncUsernameHandle(bvNum, recentHotItem, recentHotItem.title);
            }
            const bilibiliPlayerRecommendVideo = document.getElementsByClassName('bilibili-player-recommend-video');
            for (const bilibiliPlayerRecommendVideoItem of bilibiliPlayerRecommendVideo) {
                const bvNum = getBvNumber(bilibiliPlayerRecommendVideoItem.href);
                asyncUsernameHandle(
                    bvNum,
                    bilibiliPlayerRecommendVideoItem,
                    bilibiliPlayerRecommendVideoItem.querySelector('.bilibili-player-recommend-title')
                );
            }
            const bilibiliPlayerEndingPanelBoxRecommend = document.querySelectorAll('a.bilibili-player-ending-panel-box-recommend');
            for (const bilibiliPlayerEndingPanelBoxRecommendItem of bilibiliPlayerEndingPanelBoxRecommend) {
                let bvNum = '';
                try {
                    bvNum = /(?:av|bv)(\w+)/i.exec(bilibiliPlayerEndingPanelBoxRecommendItem.getAttribute('data-bvid'))[1];
                } catch (e) {
                    bvNum = null;
                }
                if (!bvNum) {
                    try {
                        bvNum = getBvNumber(bilibiliPlayerEndingPanelBoxRecommendItem.href);
                    } catch (e) {
                        bvNum = null;
                    }
                }
                asyncUsernameHandle(
                    bvNum,
                    bilibiliPlayerEndingPanelBoxRecommendItem,
                    bilibiliPlayerEndingPanelBoxRecommendItem.querySelector('.bilibili-player-ending-panel-box-recommend-cover-title')
                );
            }
        } else if (/(t|manga|space)\.bilibili\.com/.test(OLD_URL)) {
            const card = document.querySelectorAll('div.card');
            for (const cardItem of card) {
                const contentFull = cardItem.querySelector('.content-full');
                let sourceContent = null;
                let convertText = null;
                if (contentFull && !contentFull.closest('.repost')) {
                    sourceContent = contentFull.textContent;
                    if (bilibiliConfig.convertEmojiEnable) {
                        convertText = getConvertText(contentFull.innerHTML);
                    }
                }
                const title = cardItem.querySelector('.title');
                let titleText = null;
                if (title) {
                    titleText = title.textContent;
                }
                let repostUser = cardItem.querySelector('.repost .username');
                repostUser = repostUser ? repostUser.textContent : null;
                let repostSourceText = null;
                let repostConvertText = null;
                const repostContent = cardItem.querySelector('.repost .content-full');
                if (repostContent) {
                    repostSourceText = repostContent.textContent;
                    if (bilibiliConfig.convertEmojiEnable) {
                        repostConvertText = getConvertText(repostContent.innerHTML);
                    }
                }
                if (bilibiliConfig.convertEmojiEnable) {
                    hideHandler(cardItem, null, null, 0, {
                        dynamicVideo: titleText,
                        dynamic: {
                            content: convertText,
                            sourceContent: sourceContent,
                        },
                        repostUser,
                        repost: {
                            content: repostConvertText,
                            sourceContent: repostSourceText,
                        },
                    });
                } else {
                    hideHandler(cardItem, null, null, 0, {
                        dynamicVideo: titleText,
                        dynamic: {
                            content: sourceContent,
                        },
                        repostUser,
                        repost: {
                            content: repostSourceText,
                        },
                    });
                }
            }
            hideComment();
        } else if (/message\.bilibili\.com\/#\/reply/.test(OLD_URL)) {
            const replyItem = document.getElementsByClassName('reply-item');
            for (const replyItemEle of replyItem) {
                let nextNode = null;
                if (replyItemEle.nextElementSibling) {
                    if (replyItemEle.nextElementSibling.classList.contains('divider')) {
                        nextNode = replyItemEle.nextElementSibling;
                    }
                }
                const sourceText = replyItemEle.querySelector('.text').textContent;
                if (bilibiliConfig.convertEmojiEnable) {
                    const convertText = replyItemEle.querySelector('.text span').innerHTML.replace(/<img.*alt="(.*)".*>/g, '$1');
                    hideHandler([replyItemEle, nextNode], replyItemEle.querySelector('.name-field a'), convertText, 0, {
                        comment: true,
                        messageReply: true,
                        sourceText: sourceText,
                        delButton: replyItemEle.querySelector('.bl-button--primary'),
                    });
                } else {
                    hideHandler([replyItemEle, nextNode], replyItemEle.querySelector('.name-field a'), sourceText, 0, {
                        comment: true,
                        messageReply: true,
                        delButton: replyItemEle.querySelector('.bl-button--primary'),
                    });
                }
            }
        } else if (/live\.bilibili\.com\/\d+/.test(OLD_URL)) {
            const chatItems = document.querySelectorAll('#chat-items .chat-item');
            chatItems.forEach(item => {
                const fansMedalContent = item.querySelector('.fans-medal-content');
                hideHandler(item, null, null, 0, {
                    trueLove: fansMedalContent ? fansMedalContent.textContent : null,
                });
            });
        }
    }
    function hideCommentHandler(commentRender, hideNode) {
        const commentUser = commentRender.querySelector('bili-comment-user-info').shadowRoot;
        const commentContent = commentRender.querySelector('bili-rich-text').shadowRoot;
        const commentButtons = commentRender.querySelector('bili-comment-action-buttons-renderer').shadowRoot;
        const commentNode = commentContent.querySelector("p");
        const sourceText = commentNode.textContent;
        const childNodes = commentNode.childNodes;
        let onlyAt = true;
        if (bilibiliConfig.commentAt) {
            let cCount = childNodes.length;
            childNodes.forEach((i, v) => { if (i.textContent === ' ' || (i.nodeName === 'A' && i?.dataset?.userProfileId)) cCount -= 1; });
            if (cCount) onlyAt = false;
        }
        // let trueLove = commentListItem.querySelector('.true-love');
        // trueLove = trueLove ? trueLove.firstChild.textContent : null;
        if (bilibiliConfig.commentSearch) {
            childNodes.forEach((i, v) => { if ((i.nodeName === 'A' || i.nodeName === 'I') && i?.dataset?.type === 'search') i.replaceWith(i.textContent); })
        }
        if (bilibiliConfig.convertEmojiEnable) {
            const convertText = getConvertText(commentNode.innerHTML);
            hideHandler(hideNode, commentUser.querySelector('#user-name'), convertText, 0, {
                comment: true,
                sourceText: sourceText,
                // trueLove,
                onlyAt,
            }, true);
        } else {
            hideHandler(hideNode, commentUser.querySelector('#user-name'), sourceText, 0, {
                comment: true,
                // trueLove,
                onlyAt,
            }, true);
        }
        const commentReplyBtn = commentButtons.querySelector('#reply');
        if (bilibiliConfig.showBlockUserBtnEnable) {
            commentReplyBtn &&
                !commentButtons.querySelector('.bilibili_comment_user_block_button_new') &&
                commentReplyBtn.after(
                blockObj.createBlockBtn(
                    commentUser.querySelector('#user-name').textContent,
                    'usernameArray',
                    'bilibili_comment_user_block_button_new',
                    'span',
                    '屏蔽',
                    '屏蔽该用户'
                )
            );
        } else {
            commentButtons.querySelector('.bilibili_comment_user_block_button_new') &&
                commentButtons.querySelector('.bilibili_comment_user_block_button_new').remove();
        }
        if (bilibiliConfig.showBangBtnEnable) {
            const commentBtn = commentButtons.querySelector('.bilibili_comment_user_block_button_new') || commentReplyBtn;
            commentBtn &&
                !commentButtons.querySelector('.bilibili_comment_bang_button_new') &&
                commentBtn.after(
                blockObj.createBigBangBtn(
                    sourceText,
                    'commentArray',
                    'bilibili_comment_bang_button_new',
                    'span',
                    '爆炸',
                    '拆分并选择文本内容进行屏蔽'
                )
            );
        } else {
            commentButtons.querySelector('.bilibili_comment_bang_button_new') &&
                commentButtons.querySelector('.bilibili_comment_bang_button_new').remove();
        }
    }
    function hideComment() {
        const commentsRoot = document.querySelector('bili-comments');
        if (commentsRoot) {
            commentsRoot.shadowRoot.querySelectorAll('bili-comment-thread-renderer').forEach((comment) => {
                hideCommentHandler(comment.shadowRoot.querySelector('bili-comment-renderer').shadowRoot, comment);
                comment.shadowRoot.querySelector('bili-comment-replies-renderer').shadowRoot.querySelectorAll('bili-comment-reply-renderer').forEach((reply) => {
                    hideCommentHandler(reply.shadowRoot, reply);
                })
            })
        } else {
            let commentList = document.querySelectorAll('.comment-list .list-item');
            let newPage = false;
            if (!commentList.length) {
                commentList = document.querySelectorAll('.reply-list .reply-item');
                newPage = true;
            }
            for (const commentListItem of commentList) {
                if (!newPage) {
                    const sourceText = commentListItem.querySelector('.con > p.text').textContent;
                    let atNum = 0;
                    commentListItem.querySelector('.con > p.text').getElementsByTagName('a').forEach((i, v) => { if (i.getAttribute('data-usercard-mid')) { atNum += 1; } })
                    let onlyAt = false;
                    if (commentListItem.querySelector('.con > p.text').childNodes.length == atNum) { onlyAt = true; }
                    let trueLove = commentListItem.querySelector('.true-love');
                    trueLove = trueLove ? trueLove.firstChild.textContent : null;
                    if (bilibiliConfig.convertEmojiEnable) {
                        const convertText = getConvertText(commentListItem.querySelector('.con > p.text').innerHTML);
                        hideHandler(commentListItem, commentListItem.querySelector('.con > .user a.name'), convertText, 0, {
                            comment: true,
                            sourceText: sourceText,
                            trueLove,
                            onlyAt: onlyAt,
                        });
                    } else {
                        hideHandler(commentListItem, commentListItem.querySelector('.con > .user a.name'), sourceText, 0, {
                            comment: true,
                            trueLove,
                            onlyAt: onlyAt,
                        });
                    }
                    const commentReplyBtn = commentListItem.querySelector('.reply.btn-hover');
                    if (bilibiliConfig.showBlockUserBtnEnable) {
                        commentReplyBtn &&
                            !commentListItem.querySelector('.bilibili_comment_user_block_button') &&
                            commentReplyBtn.after(
                            blockObj.createBlockBtn(
                                commentListItem.querySelector('.con > .user a.name').textContent,
                                'usernameArray',
                                'bilibili_comment_user_block_button',
                                'span',
                                '屏蔽',
                                '屏蔽该用户'
                            )
                        );
                    } else {
                        commentListItem.querySelector('.bilibili_comment_user_block_button') &&
                            commentListItem.querySelector('.bilibili_comment_user_block_button').remove();
                    }
                    if (bilibiliConfig.showBangBtnEnable) {
                        const commentBtn = commentListItem.querySelector('.bilibili_comment_user_block_button') || commentReplyBtn;
                        commentBtn &&
                            !commentListItem.querySelector('.bilibili_comment_bang_button') &&
                            commentBtn.after(
                            blockObj.createBigBangBtn(
                                sourceText,
                                'commentArray',
                                'bilibili_comment_bang_button',
                                'span',
                                '爆炸',
                                '拆分并选择文本内容进行屏蔽'
                            )
                        );
                    } else {
                        commentListItem.querySelector('.bilibili_comment_bang_button') &&
                            commentListItem.querySelector('.bilibili_comment_bang_button').remove();
                    }
                } else {
                    const sourceText = commentListItem.querySelector(".reply-content").textContent;
                    const childNodes = commentListItem.querySelector(".reply-content").childNodes;
                    let cCount = childNodes.length;
                    let onlyAt = true;
                    childNodes.forEach((i, v) => { if (i.data == ' ' || (i.nodeName == 'A' && i.classList.contains('user'))) { cCount -= 1; } })
                    if (cCount) { onlyAt = false; }
                    let trueLove = commentListItem.querySelector('.true-love');
                    trueLove = trueLove ? trueLove.firstChild.textContent : null;
                    if (bilibiliConfig.commentSearch) {
                        childNodes.forEach((i, v) => { if ((i.nodeName == 'A' || i.nodeName == 'I') && i.classList.contains('search-word')) { i.replaceWith(i.textContent); } })
                    }
                    if (bilibiliConfig.convertEmojiEnable) {
                        const convertText = getConvertText(commentListItem.querySelector('.reply-content').innerHTML);
                        hideHandler(commentListItem, commentListItem.querySelector('.content-warp > .user-info .user-name'), convertText, 0, {
                            comment: true,
                            sourceText: sourceText,
                            trueLove,
                            onlyAt: onlyAt,
                        });
                    } else {
                        hideHandler(commentListItem, commentListItem.querySelector('.content-warp > .user-info .user-name'), sourceText, 0, {
                            comment: true,
                            trueLove,
                            onlyAt: onlyAt,
                        });
                    }
                    const commentReplyBtn = commentListItem.querySelector('.reply-btn');
                    if (bilibiliConfig.showBlockUserBtnEnable) {
                        commentReplyBtn &&
                            !commentListItem.querySelector('.bilibili_comment_user_block_button_new') &&
                            commentReplyBtn.after(
                            blockObj.createBlockBtn(
                                commentListItem.querySelector('.content-warp > .user-info .user-name').textContent,
                                'usernameArray',
                                'bilibili_comment_user_block_button_new',
                                'span',
                                '屏蔽',
                                '屏蔽该用户'
                            )
                        );
                    } else {
                        commentListItem.querySelector('.bilibili_comment_user_block_button_new') &&
                            commentListItem.querySelector('.bilibili_comment_user_block_button_new').remove();
                    }
                    if (bilibiliConfig.showBangBtnEnable) {
                        const commentBtn = commentListItem.querySelector('.bilibili_comment_user_block_button_new') || commentReplyBtn;
                        commentBtn &&
                            !commentListItem.querySelector('.bilibili_comment_bang_button_new') &&
                            commentBtn.after(
                            blockObj.createBigBangBtn(
                                sourceText,
                                'commentArray',
                                'bilibili_comment_bang_button_new',
                                'span',
                                '爆炸',
                                '拆分并选择文本内容进行屏蔽'
                            )
                        );
                    } else {
                        commentListItem.querySelector('.bilibili_comment_bang_button_new') &&
                            commentListItem.querySelector('.bilibili_comment_bang_button_new').remove();
                    }
                }
            }

            if (!newPage) {
                const replyCommentList = document.querySelectorAll('.comment-list .reply-item');
                for (const replyCommentListItem of replyCommentList) {
                    const replySourceText = replyCommentListItem.querySelector('.reply-con .text-con').textContent;
                    if (bilibiliConfig.convertEmojiEnable) {
                        const replyConvertText = getConvertText(replyCommentListItem.querySelector('.reply-con .text-con').innerHTML);
                        hideHandler(replyCommentListItem, replyCommentListItem.querySelector('.reply-con .user a.name'), replyConvertText, 0, {
                            comment: true,
                            sourceText: replySourceText,
                        });
                    } else {
                        hideHandler(replyCommentListItem, replyCommentListItem.querySelector('.reply-con .user a.name'), replySourceText, 0, {
                            comment: true,
                        });
                    }
                    const replyBtn = replyCommentListItem.querySelector('.reply.btn-hover');
                    if (bilibiliConfig.showBlockUserBtnEnable) {
                        replyBtn &&
                            !replyCommentListItem.querySelector('.bilibili_reply_user_block_button') &&
                            replyBtn.after(
                            blockObj.createBlockBtn(
                                replyCommentListItem.querySelector('.reply-con .user a.name').textContent,
                                'usernameArray',
                                'bilibili_reply_user_block_button',
                                'span',
                                '屏蔽',
                                '屏蔽该用户'
                            )
                        );
                    } else {
                        replyCommentListItem.querySelector('.bilibili_reply_user_block_button') &&
                            replyCommentListItem.querySelector('.bilibili_reply_user_block_button').remove();
                    }
                    if (bilibiliConfig.showBangBtnEnable) {
                        const pBtn = replyCommentListItem.querySelector('.bilibili_reply_user_block_button') || replyBtn;
                        pBtn &&
                            !replyCommentListItem.querySelector('.bilibili_reply_bang_button') &&
                            pBtn.after(
                            blockObj.createBigBangBtn(
                                replySourceText,
                                'commentArray',
                                'bilibili_reply_bang_button',
                                'span',
                                '爆炸',
                                '拆分并选择文本内容进行屏蔽'
                            )
                        );
                    } else {
                        replyCommentListItem.querySelector('.bilibili_reply_bang_button') &&
                            replyCommentListItem.querySelector('.bilibili_reply_bang_button').remove();
                    }
                }
            } else {
                const replyCommentList = document.querySelectorAll('.sub-reply-list .sub-reply-item');
                for (const replyCommentListItem of replyCommentList) {
                    const replySourceText = replyCommentListItem.querySelector('.reply-content').textContent;
                    if (bilibiliConfig.convertEmojiEnable) {
                        const replyConvertText = getConvertText(replyCommentListItem.querySelector('.reply-content').innerHTML);
                        hideHandler(replyCommentListItem, replyCommentListItem.querySelector('.sub-user-info .sub-user-name'), replyConvertText, 0, {
                            comment: true,
                            sourceText: replySourceText,
                        });
                    } else {
                        hideHandler(replyCommentListItem, replyCommentListItem.querySelector('.sub-user-info .sub-user-name'), replySourceText, 0, {
                            comment: true,
                        });
                    }
                    const replyBtn = replyCommentListItem.querySelector('.sub-reply-btn');
                    if (bilibiliConfig.showBlockUserBtnEnable) {
                        replyBtn &&
                            !replyCommentListItem.querySelector('.bilibili_reply_user_block_button_new') &&
                            replyBtn.after(
                            blockObj.createBlockBtn(
                                replyCommentListItem.querySelector('.sub-user-info .sub-user-name').textContent,
                                'usernameArray',
                                'bilibili_reply_user_block_button_new',
                                'span',
                                '屏蔽',
                                '屏蔽该用户'
                            )
                        );
                    } else {
                        replyCommentListItem.querySelector('.bilibili_reply_user_block_button_new') &&
                            replyCommentListItem.querySelector('.bilibili_reply_user_block_button_new').remove();
                    }
                    if (bilibiliConfig.showBangBtnEnable) {
                        const pBtn = replyCommentListItem.querySelector('.bilibili_reply_user_block_button_new') || replyBtn;
                        pBtn &&
                            !replyCommentListItem.querySelector('.bilibili_reply_bang_button_new') &&
                            pBtn.after(
                            blockObj.createBigBangBtn(
                                replySourceText,
                                'commentArray',
                                'bilibili_reply_bang_button_new',
                                'span',
                                '爆炸',
                                '拆分并选择文本内容进行屏蔽'
                            )
                        );
                    } else {
                        replyCommentListItem.querySelector('.bilibili_reply_bang_button_new') &&
                            replyCommentListItem.querySelector('.bilibili_reply_bang_button_new').remove();
                    }
                }
            }
        }
    }
    function getConvertText(text) {
        return text
            .replace(/<img.*?alt="(.*?)".*?>/g, '$1')
            .replace(/<a.*?>(.*?)<\/\s*a>/g, '$1')
            .replace(/&nbsp;/g, ' ');
    }
    function asyncUsernameHandle(bvNum, mainEle, textValue, hideMethod = 0, typeInfo = {}) {
        let userName = '';
        if (bvNum) {
            let recordUser = false;
            infoRecord.forEach(item => {
                if (item.bv == bvNum) {
                    userName = item.user;
                    recordUser = true;
                }
            });
            if (recordUser) {
                hideHandler(mainEle, userName, textValue, hideMethod, typeInfo);
            } else {
                infoRecord.push({
                    bv: bvNum,
                    user: userName,
                    time: dayjs().format('YYYY-MM-DD'),
                });
                const apiUrl = bvNum.match(/^\d+$/)
                ? 'https://api.bilibili.com/x/web-interface/view?aid='
                : 'https://api.bilibili.com/x/web-interface/view?bvid=';
                const xhr = new XMLHttpRequest();
                xhr.open('GET', apiUrl + bvNum, true);
                xhr.responseType = 'json';
                xhr.onload = () => {
                    if (xhr.status == 200) {
                        if (xhr.response.data && xhr.response.data.owner && xhr.response.data.owner['name']) {
                            userName = xhr.response.data.owner['name'];
                        }
                    } else {
                        sendStatus = false;
                        console.info(apiUrl + bvNum + '\nresponse status: ' + xhr.status);
                    }
                    hideHandler(mainEle, userName, textValue, hideMethod, typeInfo);
                    infoRecord.forEach(item => {
                        if (item.bv == bvNum) {
                            item.user = userName;
                        }
                    });
                    Block_Obj.GM.setValue('infoRecord', infoRecord);
                };
                xhr.onerror = () => {
                    console.info(apiUrl + bvNum + '\nerror.');
                    hideHandler(mainEle, userName, textValue, hideMethod, typeInfo);
                };
                setTimeout(() => {
                    sendStatus && xhr.send();
                }, INTERVAL_TIME * requestTotal);
                requestTotal++;
            }
        } else {
            hideHandler(mainEle, userName, textValue, hideMethod, typeInfo);
        }
    }
    function getBvNumber(video_link) {
        let bvNum = '';
        try {
            bvNum = /\/video\/(?:av|bv)(\w+)/i.exec(video_link)[1];
        } catch (e) {
            bvNum = null;
        }
        return bvNum;
    }
})();