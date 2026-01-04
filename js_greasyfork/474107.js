// ==UserScript==
// @name         B站屏蔽
// @namespace    Shurlormes
// @version      5.1
// @description  B站一键屏蔽指定用户评论、视频，首页视频标题关键词屏蔽。
// @author       Shurlormes
// @match        *://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/474107/B%E7%AB%99%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/474107/B%E7%AB%99%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ADD_BTN_STYLE = 'width: 55px; background-color: #056de8; border-radius: 4px; color: white; padding: 4px 11px 4px 9px; line-height: 16px; border: 0;';
    const REMOVE_BTN_STYLE = 'width: 55px; background-color: #FE2929; border-radius: 4px; color: white; padding: 4px 11px 4px 9px; line-height: 16px; border: 0;';
    const TEXTAREA_STYLE = 'resize: none;padding:5px;height:100%;width:98%;overflow:auto;';
    const INPUT_STYLE = 'border: 1px #6d757a solid; border-radius: 4px; line-height: 20px;';
    const STATIC_TD_STYLE = "border: 1px #6d757a solid; text-align: center; padding: 5px;";
    const BLOCK_BTN_STYLE = 'cursor: pointer; position: relative;left: 5px;';
    const LIVE_BLOCK_BTN_STYLE = 'cursor: pointer; position: relative; left: 5px; top: -5px;';
    const REPLY_BLOCK_BTN_STYLE = 'cursor: pointer; position: relative; font-size: 14px;';

    const BLOCK_BTN_TITLE = '屏蔽';
    const BLOCK_BTN_TXT = '🚫';

    const IMPORT_TEXTAREA_CLASS = 'shurlormes-import-textarea';

    const KEYWORD_BLOCK_INPUT_ID = 'shurlormes-keyword-block-input';
    const KEYWORD_BLOCK_ADD_BTN_ID = 'shurlormes-keyword-block-add-btn';
    const KEYWORD_BLOCK_INPUT_TYPE_ATTR = 'shurlormes-keyword-block-input-type';

    const BLOCK_DATA_TABLE_ID = 'shurlormes-block-data-table';
    const BLOCK_DATA_REMOVE_BTN_CLASS = 'shurlormes-block-data-remove-btn';
    const BLOCK_DATA_REMOVE_BTN_KEY_ATTR = 'shurlormes-block-data-remove-btn-key';
    const BLOCK_DATA_REMOVE_BTN_TYPE_ATTR = 'shurlormes-block-data-remove-btn-type';
    const APPENDED_BLOCK_BTN_CLASS = 'shurlormes-appended-block-btn';

    const USER_BLOCK_BTN_CLASS = 'shurlormes-user-block-btn';
    const USER_BLOCK_USER_ID_ATTR = 'shurlormes-user-block-user-id';
    const USER_BLOCK_USERNAME_ATTR = 'shurlormes-user-block-username';

    const TITLE_BLOCK_KEY_PREFIX = 'b-title-';
    const USER_BLOCK_KEY_PREFIX = 'b-user-';
    const USER_NAME_BLOCK_KEY_PREFIX = 'b-un-';

    const TYPE_BLACK_ENUMS = {
        TITLE_BLACK: 0,
        USER_BLACK: 1,
        USER_NAME_BLACK: 2,
    };

    const TITLE_BLACK_SET = new Set();
    const USER_BLACK_MAP = new Map();
    const USER_NAME_BLACK_SET = new Set();

    const TYPE_BLACK_DATA = [TITLE_BLACK_SET, USER_BLACK_MAP, USER_NAME_BLACK_SET]
    const TYPE_BLACK_PREFIX = [TITLE_BLOCK_KEY_PREFIX, USER_BLOCK_KEY_PREFIX, USER_NAME_BLOCK_KEY_PREFIX]


    //执行间隔，单位毫秒
    const INTERVAL_TIME = 500;
    //同步间隔，单位毫秒
    const SYNC_TIME = 500;

    //首页换一换
    const INDEX_FEED_CARD_CLASS = 'feed-card';
    //首页视频
    const INDEX_BILI_VIDEO_CARD_CLASS = 'bili-video-card is-rcmd';
    //首页视频 标题
    const INDEX_BILI_VIDEO_CARD_TITLE_CLASS = 'bili-video-card__info--tit';
    //首页视频 用户信息
    const INDEX_BILI_VIDEO_CARD_OWNER_CLASS = 'bili-video-card__info--owner';
    const INDEX_BILI_VIDEO_CARD_AUTHOR_CLASS = 'bili-video-card__info--author';

    const INDEX_BILI_VIDEO_CARD_AD_CLASS = 'bili-video-card__info--ad';

    //首页每层独立卡
    const INDEX_FLOOR_SINGLE_CARD_CLASS = 'floor-single-card';
    //首页每层独立卡 标题
    const INDEX_FLOOR_SINGLE_CARD_TITLE_CLASS = 'title';
    const INDEX_FLOOR_SINGLE_USER_TITLE_CLASS = 'sub-title';

    //首页直播
    const INDEX_BILI_LIVE_CARD_CLASS = 'bili-live-card is-rcmd';
    //首页直播标题
    const INDEX_BILI_LIVE_CARD_TITLE_CLASS = 'bili-live-card__info--tit';
    //首页直播用户信息
    const INDEX_BILI_LIVE_CARD_UNAME_CLASS = 'bili-live-card__info--uname';


    //视频回复
    const REPLAY_CLASS = 'reply-item';
    //层回复
    const ROOT_REPLY_CONTAINER_CLASS = 'root-reply-container';
    //层主信息
    const ROOT_REPLY_USER_INFO = 'user-info';
    //层主名称
    const ROOT_REPLY_USER_NAME = 'user-name';

    //层内回复
    const SUB_REPLY_CONTAINER_CLASS = 'sub-reply-container';
    //层内用户信息
    const SUB_REPLY_USER_INFO = 'sub-user-info'
    //层内用户名称
    const SUB_REPLY_USER_NAME = 'sub-user-name'

    //标记后的回复
    const MARKED_REPLY_CONTAINER = "shurlormes-reply-container";

    const ATTR_REPLAY_UER_ID = 'data-user-id';

    const TYPE_CARD_ENUMS = {
        VIDEO: 0,
        FLOOR: 1,
        LIVE: 2,
        REPLY: 3
    }

    const TYPE_CARD_CLASS = [INDEX_BILI_VIDEO_CARD_CLASS, INDEX_FLOOR_SINGLE_CARD_CLASS, INDEX_BILI_LIVE_CARD_CLASS, MARKED_REPLY_CONTAINER];
    const TYPE_TITLE_CLASS = [INDEX_BILI_VIDEO_CARD_TITLE_CLASS, INDEX_FLOOR_SINGLE_CARD_TITLE_CLASS, INDEX_BILI_LIVE_CARD_TITLE_CLASS, ''];
    const TYPE_USER_CLASS = [INDEX_BILI_VIDEO_CARD_OWNER_CLASS, INDEX_FLOOR_SINGLE_USER_TITLE_CLASS, INDEX_BILI_LIVE_CARD_UNAME_CLASS, ''];

    const SYNCED_KEY = 'shurlormes-synced';

    //b站API操作枚举
    const BILI_API_ACT = {
        BLACK: 5, //加入黑名单
        REMOVE: 6 //移除黑名单
    }

    const BILI_CSRF = document.cookie.match(/(?<=bili_jct=).+?(?=;)/)[0];

    let doBlockByType = function(type) {
        let cards = document.getElementsByClassName(TYPE_CARD_CLASS[type]);
        if(cards.length > 0) {
            let deleteArray = [];
            for (let i = 0; i < cards.length; i++) {
                let card = cards[i];
                //屏蔽过滤判断
                if(replyUserFilter(card) || isAd(card) || userFilter(card) || userNameFilter(card) || titleKeywordsFilter(card, type)) {
                    deleteArray.push(card);
                }
            }
            doBlock(deleteArray);
        }
    }

    let isAd = function(element) {
        return element.getElementsByClassName(INDEX_BILI_VIDEO_CARD_AD_CLASS).length > 0;
    }

    let userFilter = function(card) {
        let blockBtn = card.getElementsByClassName(USER_BLOCK_BTN_CLASS);
        if(blockBtn.length > 0) {
            return USER_BLACK_MAP.has(Number(blockBtn[0].getAttribute(USER_BLOCK_USER_ID_ATTR)));
        }
        return false;
    }

    let userNameFilter = function(card) {
        let blockBtn = card.getElementsByClassName(USER_BLOCK_BTN_CLASS);
        if(blockBtn.length > 0) {
            const username = blockBtn[0].getAttribute(USER_BLOCK_USERNAME_ATTR)
            for (let keywords of USER_NAME_BLACK_SET) {
                if(username.indexOf(keywords) !== -1) {
                    return true;
                }
            }
        }
        return false;
    }

    let titleKeywordsFilter = function(card, type) {
        let title = '';
        let cardTitle = card.getElementsByClassName(TYPE_TITLE_CLASS[type]);
        if(cardTitle.length > 0) {
            if(type === TYPE_CARD_ENUMS.VIDEO || type === TYPE_CARD_ENUMS.FLOOR) {
                let titleElement = cardTitle[0];
                title = titleElement.getAttribute('title')
            } else {
                let titleA = cardTitle[0].getElementsByTagName('a');
                if(titleA.length > 0) {
                    let titleElement = titleA[0].lastChild;
                    if(titleElement) {
                        title = titleElement.innerText;
                    }
                }
            }
        }
        for (let keywords of TITLE_BLACK_SET) {
            if(title.indexOf(keywords) !== -1) {
                return true;
            }
        }
        return false;
    }

    let replyUserFilter = function(card) {
        if(card.classList.contains(MARKED_REPLY_CONTAINER)) {
            let idFlag = USER_BLACK_MAP.has(Number(card.getAttribute(USER_BLOCK_USER_ID_ATTR)));
            if(idFlag) {
               return true;
            }

            const username = card.getAttribute(USER_BLOCK_USERNAME_ATTR)
            for (let keywords of USER_NAME_BLACK_SET) {
                if(username.indexOf(keywords) !== -1) {
                    return true;
                }
            }
            return false;
        }
    }

    let doBlock = function(deleteArray) {
        if(deleteArray.length > 0) {
            for (let i = 0; i < deleteArray.length; i++) {
                let deleteItem = deleteArray[i];
                let deleteItemParent = deleteItem.parentElement;
                if(deleteItemParent.className.indexOf(INDEX_FEED_CARD_CLASS) !== -1) {
                    deleteItemParent.remove();
                } else {
                    deleteItem.remove();
                }
            }
        }
    }

    let blockComponent = function() {
        doBlockByType(TYPE_CARD_ENUMS.VIDEO);
        doBlockByType(TYPE_CARD_ENUMS.FLOOR);
        doBlockByType(TYPE_CARD_ENUMS.LIVE);
        doBlockByType(TYPE_CARD_ENUMS.REPLY);
    }

    let fillBlackData = function() {
        if(localStorage.length > 0){
            for(let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if(key.indexOf(TITLE_BLOCK_KEY_PREFIX) !== -1) {
                    TITLE_BLACK_SET.add(key.replaceAll(TITLE_BLOCK_KEY_PREFIX, ''));
                } else if(key.indexOf(USER_BLOCK_KEY_PREFIX) !== -1) {
                    USER_BLACK_MAP.set(Number(key.replaceAll(USER_BLOCK_KEY_PREFIX, '')), localStorage.getItem(key));
                } else if(key.indexOf(USER_NAME_BLOCK_KEY_PREFIX) !== -1) {
                    USER_NAME_BLACK_SET.add(key.replaceAll(USER_NAME_BLOCK_KEY_PREFIX, ''));
                }
            }
        }
    }

    let appendUserBlockBtnByType = function(type) {
        let userATag = document.querySelectorAll(`.${TYPE_USER_CLASS[type]}:not(.${APPENDED_BLOCK_BTN_CLASS})`);
        if(userATag.length > 0) {
            for (let i = 0; i < userATag.length; i++) {
                let aTag = userATag[i];
                let href = aTag.getAttribute('href');
                if(href.indexOf('https:') === -1) {
                    href = 'https:' + href;
                }
                if(href.indexOf('https://space') === -1) {
                    continue;
                }
                const userUrl = new URL(href);
                const userId = userUrl.pathname.replace('/', '');
                let username = '';
                if(type === TYPE_CARD_ENUMS.VIDEO) {
                    let author = aTag.getElementsByClassName(INDEX_BILI_VIDEO_CARD_AUTHOR_CLASS);
                    if(author.length > 0) {
                        username = author[0].getAttribute('title');
                    }
                } else {
                    let author = aTag.lastChild;
                    username = author.innerText;
                }

                let blockBtn = generateUserBlockBtn(userId, username, (type !== TYPE_CARD_ENUMS.LIVE ? BLOCK_BTN_STYLE : LIVE_BLOCK_BTN_STYLE));

                aTag.parentElement.appendChild(blockBtn);
                aTag.classList.add(APPENDED_BLOCK_BTN_CLASS);
                if (type === TYPE_CARD_ENUMS.FLOOR) {
                    aTag.classList.remove('flex');
                }
            }
        }
    }

    let generateUserBlockBtn = function(userId, username, style) {
        let blockBtn = document.createElement("span");
        blockBtn.setAttribute(USER_BLOCK_USER_ID_ATTR, userId);
        blockBtn.setAttribute(USER_BLOCK_USERNAME_ATTR, username);
        blockBtn.style = style;
        blockBtn.title = BLOCK_BTN_TITLE;
        blockBtn.innerText = BLOCK_BTN_TXT;
        blockBtn.onclick = userBlockBtnClickEvent;
        blockBtn.classList.add(USER_BLOCK_BTN_CLASS);
        return blockBtn;
    }

    let userBlockBtnClickEvent = function(e) {
        const target = e.target;
        const userId = Number(target.getAttribute(USER_BLOCK_USER_ID_ATTR));
        const username = target.getAttribute(USER_BLOCK_USERNAME_ATTR);
        USER_BLACK_MAP.set(userId, username);
        localStorage.setItem(USER_BLOCK_KEY_PREFIX + userId, username);
        blockUserToBilibili(userId, BILI_API_ACT.BLACK);
    }

    let appendReplyUserBlockBtn = function() {
        const replyItems = document.getElementsByClassName(REPLAY_CLASS);
        if(replyItems.length > 0) {
            for (let i = 0; i < replyItems.length; i++) {
                const replyItem = replyItems[i];
                const rootReplyUserInfos = replyItem.getElementsByClassName(ROOT_REPLY_CONTAINER_CLASS)[0].querySelectorAll(`.${ROOT_REPLY_USER_INFO}:not(.${APPENDED_BLOCK_BTN_CLASS})`);
                if(rootReplyUserInfos.length > 0) {
                    const rootReplyUserInfo = rootReplyUserInfos[0]
                    const rootUserName = rootReplyUserInfo.getElementsByClassName(ROOT_REPLY_USER_NAME)[0];
                    const userId = rootUserName.getAttribute(ATTR_REPLAY_UER_ID);
                    const username = rootUserName.innerHTML;
                    const blockBtn = generateUserBlockBtn(userId, username, REPLY_BLOCK_BTN_STYLE);
                    rootReplyUserInfo.appendChild(blockBtn);
                    rootReplyUserInfo.classList.add(APPENDED_BLOCK_BTN_CLASS);

                    replyItem.setAttribute(USER_BLOCK_USER_ID_ATTR, userId);
                    replyItem.setAttribute(USER_BLOCK_USERNAME_ATTR, username);
                    replyItem.classList.add(MARKED_REPLY_CONTAINER);
                }

                const subReplyUserInfos = replyItem.getElementsByClassName(SUB_REPLY_CONTAINER_CLASS)[0].querySelectorAll(`.${SUB_REPLY_USER_INFO}:not(.${APPENDED_BLOCK_BTN_CLASS})`)
                if(subReplyUserInfos.length > 0) {
                    for (let j = 0; j < subReplyUserInfos.length; j++) {
                        const subReplyUserInfo = subReplyUserInfos[j]
                        const subUserName = subReplyUserInfo.getElementsByClassName(SUB_REPLY_USER_NAME)[0];
                        const userId = subUserName.getAttribute(ATTR_REPLAY_UER_ID);
                        const username = subUserName.innerHTML;
                        const blockBtn = generateUserBlockBtn(userId, username, REPLY_BLOCK_BTN_STYLE);
                        subReplyUserInfo.appendChild(blockBtn);
                        subReplyUserInfo.classList.add(APPENDED_BLOCK_BTN_CLASS);

                        subReplyUserInfo.parentElement.setAttribute(USER_BLOCK_USER_ID_ATTR, userId);
                        subReplyUserInfo.parentElement.setAttribute(USER_BLOCK_USERNAME_ATTR, username);
                        subReplyUserInfo.parentElement.classList.add(MARKED_REPLY_CONTAINER);
                    }
                }

            }
        }
    }


    let appendUserBlockBtn = function() {
        appendUserBlockBtnByType(TYPE_CARD_ENUMS.VIDEO);
        appendUserBlockBtnByType(TYPE_CARD_ENUMS.FLOOR);
        appendUserBlockBtnByType(TYPE_CARD_ENUMS.LIVE);
        appendReplyUserBlockBtn();
    }

    //入口
    let mainEvent = function() {
        fillBlackData();
        blockComponent();
        appendUserBlockBtn();
    }

    setInterval(mainEvent, INTERVAL_TIME);


    //同步知乎黑名单至脚本
    let doSync = function(page=1) {
        try {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/relation/blacks?csrf=${BILI_CSRF}&jsonp=jsonp&pn=${page}&ps=100&re_version=0`,
                onload: function (resp) {
                    const respInfo = JSON.parse(resp.response);
                    const blackUsers = respInfo.data.list;
                    const total = respInfo.data.total;

                    if(blackUsers.length > 0) {
                        for (const {mid, uname} of blackUsers) {
                            const userId = Number(mid);
                            USER_BLACK_MAP.set(userId, uname);
                            localStorage.setItem(USER_BLOCK_KEY_PREFIX + userId, uname);
                        }
                        let progress = Math.round(blackUsers.length * page / total * 100);
                        console.log(`B站黑名单用户同步中...${progress}%`)
                        //下一页
                        setTimeout(() => {
                            doSync(++page);
                        }, page * SYNC_TIME);
                    } else {
                        localStorage.setItem(SYNCED_KEY, 1);
                        console.log(`B站黑名单用户同步完成`)
                    }
                },
                onerror: function (e) {
                    console.log(e);
                }
            });
        } catch (e) {
            console.log("doSync error", e)
        }
    }
    let syncBlockedUser = function() {
        if('www.bilibili.com' !== window.location.host) {
            return ;
        }

        //已完成同步，无需再同步了
        let synced = localStorage.getItem(SYNCED_KEY);
        if(synced) {
            return;
        }
        doSync();
    }
    syncBlockedUser();

    //弹出层，代码参考：https://www.jianshu.com/p/79970121dbe2
    const popup = (function(){
        class Popup {
            // 构造函数中定义公共要使用的div
            constructor() {
                // 定义所有弹窗都需要使用的遮罩
                this.mask = document.createElement('div')
                // 设置样式
                this.setStyle(this.mask, {
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, .2)',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    'z-index': 999
                })
                // 创建中间显示内容的水平并垂直居中的div
                this.content = document.createElement('div')
                // 设置样式
                this.setStyle(this.content, {
                    width: '600px',
                    height: '400px',
                    backgroundColor: '#fff',
                    boxShadow: '0 0 2px #999',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%,-50%)',
                    borderRadius: '3px'
                })
                // 将这个小div放在遮罩中
                this.mask.appendChild(this.content)
            }
            // 中间有弹框的 - 适用于alert和confirm
            middleBox(param) {
                // 先清空中间小div的内容 - 防止调用多次，出现混乱
                this.content.innerHTML = ''
                // 定义标题和内容变量
                let title = param.title ? param.title : '默认标题内容';
                // 将遮罩放在body中显示
                document.body.appendChild(this.mask)
                // 给中间的小div设置默认的排版
                // 上面标题部分
                this.title = document.createElement('div')
                // 设置样式
                this.setStyle(this.title, {
                    width: '100%',
                    height: '50px',
                    borderBottom: '1px solid #ccc',
                    lineHeight: '50px',
                    paddingLeft: '20px',
                    boxSizing: 'border-box',
                    fontSize: '14px',
                    color: '#050505'
                })
                // 设置默认标题内容
                this.title.innerText = title
                // 将标题部分放在中间div中
                this.content.appendChild(this.title)
                // 关闭按钮
                this.closeBtn = document.createElement('a')
                // 设置内容
                this.closeBtn.innerText = '×'
                // 设置href属性
                this.closeBtn.setAttribute('href', 'javascript:;')
                // 设置样式
                this.setStyle(this.closeBtn, {
                    textDecoration: 'none',
                    color: '#666',
                    position: 'absolute',
                    right: '10px',
                    top: '6px',
                    fontSize: '25px'
                })
                // 将关闭按钮放在中间小div中
                this.content.appendChild(this.closeBtn)
                // 下面具体放内容的部分
                this.description = document.createElement('div')
                // 将默认内容放在中间的小div中
                this.content.appendChild(this.description)
                // 设置样式
                this.setStyle(this.description, {
                    color: '#666',
                    paddingLeft: '20px',
                    lineHeight: '50px'
                })
            }
            // 弹出提示框
            alert(param) {
                this.middleBox(param)
                this.dialogContent = document.createElement('div')
                this.setStyle(this.dialogContent,{
                    "font-size": "14px",
                    "padding":"15px",
                    "max-height":"400px"
                })
                this.dialogContent.innerHTML = param.content;
                this.content.appendChild(this.dialogContent);
                // 关闭按钮和确定按钮的点击事件
                this.closeBtn.onclick = () => this.close()
            }
            dialog(param) {
                this.middleBox(param)
                this.btn = document.createElement('button');
                // 添加内容
                this.btn.innerText = param.confirmTxt ? param.confirmTxt : '确定';
                // 设置内容
                this.setStyle(this.btn, {
                    backgroundColor: 'rgb(30, 159, 255)',
                    position: 'absolute',
                    right: '10px',
                    bottom: '10px',
                    outline: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '16px',
                    borderRadius: '2px',
                    padding: '0 10px',
                    height: '30px',
                    lineHeight: '30px'
                });

                // 右下角的确定按钮
                let confirm = function(){}
                if(param.confirm && {}.toString.call(param.confirm) === '[object Function]') {
                    confirm = param.confirm;
                }

                // 将按钮放在div中
                this.content.appendChild(this.btn)

                this.dialogContent = document.createElement('div')
                this.setStyle(this.dialogContent,{
                    "padding":"15px",
                    "max-height":"400px"
                })
                this.dialogContent.innerHTML = param.content;
                this.content.appendChild(this.dialogContent);
                // 确定按钮的点击事件
                this.btn.onclick = () => {
                    confirm()
                    this.close()
                }
                this.closeBtn.onclick = () => this.close()
            }
            close(timerId) {
                // 如果有定时器，就停止定时器
                if(timerId) clearInterval(timerId)
                // 将遮罩从body中删除
                document.body.removeChild(this.mask)
            }
            // 设置样式的函数
            setStyle(ele, styleObj) {
                for(let attr in styleObj){
                    ele.style[attr] = styleObj[attr];
                }
            }
        }
        let popup = null;
        return (function() {
            if(!popup) {
                popup = new Popup()
            }
            return popup;
        })()
    })()


    let generateTr = function(key, text, type) {
        let showText = `<span>${text}</span>`;
        if(type === TYPE_BLACK_ENUMS.USER_BLACK) {
            showText = `<a href="https://space.bilibili.com/${key}" target="_blank">${text}</a>`
        }
        return `<tr>
                    <td style="${STATIC_TD_STYLE}">
                        ${showText}
                    </td>
                    <td style="${STATIC_TD_STYLE}">
                        <button class="${BLOCK_DATA_REMOVE_BTN_CLASS}" ${BLOCK_DATA_REMOVE_BTN_KEY_ATTR}="${key}"
                            ${BLOCK_DATA_REMOVE_BTN_TYPE_ATTR}="${type}" style="${REMOVE_BTN_STYLE}">删除</button>
                    </td>
                </tr>`;
    }

    let generateTrFromBlackData = function(type) {
        let content = '';
        if(TYPE_BLACK_DATA[type].size > 0) {
            for (let data of TYPE_BLACK_DATA[type]) {
                if(type === TYPE_BLACK_ENUMS.TITLE_BLACK || type === TYPE_BLACK_ENUMS.USER_NAME_BLACK) {
                    content = content + generateTr(data, data, type);
                } else {
                    content = content + generateTr(Number(data[0]), data[1], type);
                }
            }
        }
        return content;
    }

    let keywordAddBtnClickEvent = function() {
        let keywordInput = document.getElementById(KEYWORD_BLOCK_INPUT_ID);
        let type = keywordInput.getAttribute(KEYWORD_BLOCK_INPUT_TYPE_ATTR);
        let text = keywordInput.value.trim();
        if(text.length < 1 || TYPE_BLACK_DATA[type].has(text)) {
            return ;
        }
        keywordInput.value = '';

        localStorage.setItem(TYPE_BLACK_PREFIX[type] + text, 1);
        TYPE_BLACK_DATA[type].add(text);

        let tr = generateTr(text, text, type);
        document.getElementById(BLOCK_DATA_TABLE_ID).innerHTML += tr;
        bindTitleBlockRemoveClickEvent();
    }

    let bindTitleBlockRemoveClickEvent = function() {
        let btns = document.getElementsByClassName(BLOCK_DATA_REMOVE_BTN_CLASS);
        for (let i = 0; i < btns.length; i++) {
            btns[i].addEventListener('click', function(e) {
                let target = e.target;
                let key = target.getAttribute(BLOCK_DATA_REMOVE_BTN_KEY_ATTR);
                let type = target.getAttribute(BLOCK_DATA_REMOVE_BTN_TYPE_ATTR);
                if(TYPE_BLACK_ENUMS.USER_BLACK === Number(type)) {
                    key = Number(key);
                    blockUserToBilibili(key, BILI_API_ACT.REMOVE);
                }
                localStorage.removeItem(TYPE_BLACK_PREFIX[type] + key);
                TYPE_BLACK_DATA[type].delete(key);
                target.parentElement.parentElement.remove();
            });
        }
    }

    let blockUserToBilibili = function(userId, act) {
        try {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `https://api.bilibili.com/x/relation/modify`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: `fid=${userId}&act=${act}&csrf=${BILI_CSRF}`,
                onload: function (resp) {
                    console.log(resp.response);
                },
                onerror: function (e) {
                    console.log(e);
                }
            });
        } catch (e) {
            console.log("blockUserToBilibili error", e)
        }
    }


    GM_registerMenuCommand('屏蔽用户', function() {
        let content = `
            <div>
                <div style="margin-top: 5px; height: 280px; overflow: auto">
                    <table id="${BLOCK_DATA_TABLE_ID}" style="width: 98%;">
                        <tr>
                            <th style="${STATIC_TD_STYLE}">用户名</th>
                            <th style="${STATIC_TD_STYLE} width: 80px;">操作</th>
                        </tr>`;

        content = content + generateTrFromBlackData(TYPE_BLACK_ENUMS.USER_BLACK) + `
                    </table>
                </div>
            </div>
			`;
        popup.alert({title: '已屏蔽用户', content: content});
        bindTitleBlockRemoveClickEvent();
    });


    GM_registerMenuCommand('屏蔽用户名关键词', function() {
        let content = `
            <div>
                <div>
                    <span>用户名包含关键词: </span>
                    <input id="${KEYWORD_BLOCK_INPUT_ID}" style="${INPUT_STYLE}" ${KEYWORD_BLOCK_INPUT_TYPE_ATTR}="${TYPE_BLACK_ENUMS.USER_NAME_BLACK}" />
                    <button id="${KEYWORD_BLOCK_ADD_BTN_ID}" style="${ADD_BTN_STYLE}">添加</button>
                </div>
                <div style="margin-top: 5px; height: 280px; overflow: auto">
                    <table id="${BLOCK_DATA_TABLE_ID}" style="width: 98%;">
                        <tr>
                            <th style="${STATIC_TD_STYLE}">关键词</th>
                            <th style="${STATIC_TD_STYLE} width: 80px;">操作</th>
                        </tr>`;

        content = content + generateTrFromBlackData(TYPE_BLACK_ENUMS.USER_NAME_BLACK) + `
                    </table>
                </div>
            </div>
			`;
        popup.alert({title: '已屏蔽关键词', content: content});
        bindTitleBlockRemoveClickEvent();
        document.getElementById(KEYWORD_BLOCK_ADD_BTN_ID).addEventListener('click', keywordAddBtnClickEvent);
    });

    GM_registerMenuCommand('屏蔽视频标题关键词', function() {
        let content = `
            <div>
                <div>
                    <span>标题包含关键词: </span>
                    <input id="${KEYWORD_BLOCK_INPUT_ID}" style="${INPUT_STYLE}" ${KEYWORD_BLOCK_INPUT_TYPE_ATTR}="${TYPE_BLACK_ENUMS.TITLE_BLACK}" />
                    <button id="${KEYWORD_BLOCK_ADD_BTN_ID}" style="${ADD_BTN_STYLE}">添加</button>
                </div>
                <div style="margin-top: 5px; height: 280px; overflow: auto">
                    <table id="${BLOCK_DATA_TABLE_ID}" style="width: 98%;">
                        <tr>
                            <th style="${STATIC_TD_STYLE}">关键词</th>
                            <th style="${STATIC_TD_STYLE} width: 80px;">操作</th>
                        </tr>`;

        content = content + generateTrFromBlackData(TYPE_BLACK_ENUMS.TITLE_BLACK) + `
                    </table>
                </div>
            </div>
			`;
        popup.alert({title: '已屏蔽关键词', content: content});
        bindTitleBlockRemoveClickEvent();
        document.getElementById(KEYWORD_BLOCK_ADD_BTN_ID).addEventListener('click', keywordAddBtnClickEvent);
    });

    GM_registerMenuCommand('导出屏蔽数据', function() {

        const exportData = {
            TITLE_BLACK_SET: [...TITLE_BLACK_SET],
            USER_NAME_BLACK_SET: [...USER_NAME_BLACK_SET],
            USER_BLACK_MAP: [...USER_BLACK_MAP]
        }

        let content = `
				<div>
				    <div style="margin-bottom: 5px;">请复制下方文本框中的内容</div>
					<div style="height:250px;width:100%;">
						<textarea readonly="readonly" style="${TEXTAREA_STYLE}">${JSON.stringify(exportData)}</textarea>
					</div>
				</div>
			`;
        popup.alert({title: '导出屏蔽数据', content: content})
    });

    GM_registerMenuCommand('导入屏蔽数据', function() {
        let content = `
				<div>
				    <div style="margin-bottom: 5px;">请将导出的文本粘贴至下方文本框</div>
					<div style="height:250px;width:100%;">
						<textarea class="${IMPORT_TEXTAREA_CLASS}" style="${TEXTAREA_STYLE}"></textarea>
					</div>
				</div>
			`;
        popup.dialog({
            title: '导入屏蔽数据',
            content: content,
            confirmTxt: '导入',
            confirm: function () {
                const txt = document.getElementsByClassName(IMPORT_TEXTAREA_CLASS)[0].value;
                if(txt) {
                    const importData = JSON.parse(txt);
                    for (const titleBlack of importData.TITLE_BLACK_SET) {
                        TITLE_BLACK_SET.add(titleBlack);
                        localStorage.setItem(TITLE_BLOCK_KEY_PREFIX + titleBlack, 1);
                    }
                    for (const userNameBlack of importData.USER_NAME_BLACK_SET) {
                        USER_NAME_BLACK_SET.add(userNameBlack);
                        localStorage.setItem(USER_NAME_BLOCK_KEY_PREFIX + userNameBlack, 1);
                    }
                    let timeout = 1;
                    for (const [k,v] of importData.USER_BLACK_MAP) {
                        const userId = Number(k);
                        USER_BLACK_MAP.set(userId, v);
                        localStorage.setItem(USER_BLOCK_KEY_PREFIX + userId, v);
                        setTimeout(() => {
                            blockUserToBilibili(userId, BILI_API_ACT.BLACK);
                        }, timeout * SYNC_TIME);
                        timeout++;
                    }
                }
            }
        })
    });

})();