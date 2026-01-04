// ==UserScript==
// @name         知乎屏蔽用户评论
// @namespace    Shurlormes
// @version      0.9
// @description  知乎屏蔽指定用户，将他的评论和回答隐藏。
// @author       Shurlormes
// @match        *://*.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/451472/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/451472/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //评论class
    const COMMENT_CONTENT_CLASS = 'CommentContent';
    const USER_COMPONENT_CLASS = 'shurlormes-user-component';
    const USER_RIGHT_COMPONENT_CLASS = 'shurlormes-user-right-component';
    const USER_NAME_COMPONENT_CLASS = 'shurlormes-user-name-component';
    const BTN_APPENDED_COMPONENT_CLASS = 'shurlormes-btn-appended-component';
    const USER_COMMENT_COMPONENT_CLASS = 'shurlormes-user-comment-component';
    const USER_COMMENT_COMPONENT_WITH_ID_CLASS = 'shurlormes-user-comment-component-';
    const HIDE_USER_COMMENT_COMPONENT_WITH_ID_CLASS = "shurlormes-hide-user-comment-component-";

    //回答class
    const USER_ANSWER_CLASS = 'AnswerItem';
    const USER_ANSWER_EXTRA_DATA_NAME = 'data-za-extra-module';
    const USER_ANSWER_COMPONENT_CLASS = 'shurlormes-answer-component';
    const USER_ANSWER_COMPONENT_WITH_ID_CLASS = 'shurlormes-answer-component-';

    const USER_ANSWER_AUTHOR_INFO_NAME_CLASS = 'AuthorInfo-name';
    const USER_ANSWER_AUTHOR_INFO_NAME_COMPONENT_CLASS = 'shurlormes-answer-author-info-name-component';

    const USER_ANSWER_RICH_CONTENT_INNER_CLASS = 'RichContent-inner';
    const USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_CLASS = 'shurlormes-answer-rich-content-inner-component';
    const USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_WITH_ID_CLASS = 'shurlormes-answer-rich-content-inner-component-';
    const HIDE_USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_WITH_ID_CLASS = "shurlormes-hide-answer-rich-content-inner-component-";

    //右下角固定容器
    const CORNER_BUTTONS_CLASS= 'CornerButtons';

    //屏蔽class
    const BLOCKED_CLASS = 'shurlormes-blocked';
    const BTN_GROUP_CLASS = 'shurlormes-btn-group';
    const BLOCK_BTN_CLASS = 'shurlormes-block-btn-';
    const CANCEL_BTN_CLASS = 'shurlormes-cancel-btn-';

    const ENUMS_CSS = {
        DISPLAY_NONE: 'shurlormes-display-none',
        SPLIT_LINE: 'shurlormes-split-line'
    }

    const ENUMS_STYLE = {
        BLOCK_BTN_ICON: 'cursor: pointer;position: relative;left: 2px;',
        TEXTAREA: 'resize: none;padding:5px;height:100%;width:98%;overflow:auto;',
        QUICK_BTN: 'padding: 0px;font-size: 14px;line-height: inherit;text-align: center;cursor: pointer;border: none;display: flex;-webkit-box-align: center;align-items: center;-webkit-box-pack: center;justify-content: center;background: rgb(255, 255, 255);border-radius: 4px;width: 40px;height: 40px;color: rgb(132, 147, 165);box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px;margin-bottom:10px;'
    }

    const ENUMS_ELEMENT_ID = {
        SPLIT_LINE: 'shurlormes-quick-split-line-btn',
        BLOCK_LEVEL: 'shurlormes-quick-block-level-btn',
        IMPORT_TEXTAREA: 'shurlormes-import-textarea'
    }

    const ENUMS_STORAGE_KEY = {
        BLOCK_LEVEL: 'shurlormes-block-level',
        SHOW_SPLIT_LINE: 'shurlormes-show-split-line',
        SHOW_QUICK_BUTTON: 'shurlormes-show-quick-button',
        SYNCED: 'shurlormes-synced',
        //作废的key前缀，用于迁移数据
        DEPRECATED_BLOCK_PREFIX: 'shurlormes-block-user-',
        //精简的新key前缀
        BLOCK_PREFIX: 'b-'
    }

    const ENUMS_ATTR = {
        USER_ID: 'shurlormes-user-id',
        KEY: 'shurlormes-key'
    }

    const ENUMS_BLOCK_BTN_TYPE = {
        BLOCK: 0,
        CANCEL: 1
    }

    const ENUMS_BLOCK_BTN_TXT = {
        BLOCK: '🚫',
        BLOCK_TITLE: '屏蔽用户',
        CANCEL: '🔘',
        CANCEL_TITLE: '取消屏蔽'
    }

    const TYPE_BTN_CLASS = [BLOCK_BTN_CLASS, CANCEL_BTN_CLASS];
    const TYPE_BTN_STYLE = [ENUMS_STYLE.BLOCK_BTN_ICON, ENUMS_STYLE.BLOCK_BTN_ICON];
    const TYPE_BTN_TXT = [ENUMS_BLOCK_BTN_TXT.BLOCK, ENUMS_BLOCK_BTN_TXT.CANCEL];
    const TYPE_BTN_TITLE_TXT = [ENUMS_BLOCK_BTN_TXT.BLOCK_TITLE, ENUMS_BLOCK_BTN_TXT.CANCEL_TITLE];

    //执行间隔，单位毫秒
    const INTERVAL_TIME = 500;

    //屏蔽替换文本
    const BLOCK_REPLACE_TXT = '[已屏蔽]';

    GM_addStyle(
        '.shurlormes-split-line {border-top: 1px dashed rgb(132, 147, 165);margin: 1px 0 1px 0;}'
    );
    GM_addStyle(
        '.shurlormes-display-none {display: none}'
    );

    GM_registerMenuCommand('导出屏蔽用户', function() {
        const blockUserKeys = [];
        if(localStorage.length > 0){
            for(let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if(key.indexOf(ENUMS_STORAGE_KEY.BLOCK_PREFIX) !== -1) {
                    blockUserKeys.push(key.replaceAll(ENUMS_STORAGE_KEY.BLOCK_PREFIX, ''));
                }
            }
        }

        let blockedUserInfo = blockUserKeys.length > 0 ? blockUserKeys.join(',') : '';
        let content = `
				<div>
				    <div style="margin-bottom: 5px;">请复制下方文本框中的内容</div>
					<div style="height:250px;width:100%;">
						<textarea readonly="readonly" style="${ENUMS_STYLE.TEXTAREA}">${blockedUserInfo}</textarea>
					</div>
				</div>
			`;
        popup.alert({title: '导出屏蔽用户', content: content})
    });

    GM_registerMenuCommand('导入屏蔽用户', function() {
        let content = `
				<div>
				    <div style="margin-bottom: 5px;">请将导出的文本粘贴至下方文本框</div>
					<div style="height:250px;width:100%;">
						<textarea id="${ENUMS_ELEMENT_ID.IMPORT_TEXTAREA}" style="${ENUMS_STYLE.TEXTAREA}"></textarea>
					</div>
				</div>
			`;
        popup.dialog({
            title: '导入屏蔽用户',
            content: content,
            confirmTxt: '导入',
            confirm: function () {
                const txt = document.getElementById(ENUMS_ELEMENT_ID.IMPORT_TEXTAREA).value;
                if(txt) {
                    let blockUserIds = txt.split(',');
                    if(blockUserIds.length > 0) {
                        for (let i = 0; i < blockUserIds.length; i++) {
                            localStorage.setItem(ENUMS_STORAGE_KEY.BLOCK_PREFIX + blockUserIds[i], 1);
                            //知乎屏蔽接口调用
                            setTimeout(() => {
                                blockUserToZhiHu(blockUserIds[i], 'POST');
                            }, 100);
                        }
                    }
                }
            }
        })
    });

    GM_registerMenuCommand('配置中心', function() {
        const blockLevelRadioName = 'blockLevelRadio';
        const showSplitLineRadioName = 'showSplitLineRadio';
        const showQuickBtnRadioName = 'showQuickBtnRadio';
        let content = `
				<div>
                    <div style="margin: 0 0 5px 0;"">切换屏蔽模式</div>
                    <div style="margin-bottom: 5px;width: 98%;display: flex;">
                        <div style="width: 30%">
                            <input type="radio" name="${blockLevelRadioName}" ${ENUMS_ATTR.KEY}="${ENUMS_STORAGE_KEY.BLOCK_LEVEL}" value="0" ${localStorage.getItem(ENUMS_STORAGE_KEY.BLOCK_LEVEL) ? '' : 'checked' }> 替换
                        </div>
                        <div style="width: 30%">
                            <input type="radio" name="${blockLevelRadioName}" ${ENUMS_ATTR.KEY}="${ENUMS_STORAGE_KEY.BLOCK_LEVEL}" value="1" ${localStorage.getItem(ENUMS_STORAGE_KEY.BLOCK_LEVEL) ? 'checked' : '' }> 删除
                        </div>
				    </div>

                    <div style="margin: 20px 0 5px 0;">删除模式下，被删除评论是否显示分割线</div>
                    <div style="margin-bottom: 5px;width: 98%;display: flex;">
                        <div style="width: 30%">
                            <input type="radio" name="${showSplitLineRadioName}" ${ENUMS_ATTR.KEY}="${ENUMS_STORAGE_KEY.SHOW_SPLIT_LINE}" value="0" ${localStorage.getItem(ENUMS_STORAGE_KEY.SHOW_SPLIT_LINE) ? '' : 'checked' }> 隐藏
                        </div>
                        <div style="width: 30%">
                            <input type="radio" name="${showSplitLineRadioName}" ${ENUMS_ATTR.KEY}="${ENUMS_STORAGE_KEY.SHOW_SPLIT_LINE}" value="1" ${localStorage.getItem(ENUMS_STORAGE_KEY.SHOW_SPLIT_LINE) ? 'checked' : '' }> 显示
                        </div>
                    </div>

                    <div style="margin: 20px 0 5px 0;">页面右下角是否显示快捷操作按钮</div>
                    <div style="margin-bottom: 5px;width: 98%;display: flex;">
                        <div style="width: 30%">
                            <input type="radio" name="${showQuickBtnRadioName}" ${ENUMS_ATTR.KEY}="${ENUMS_STORAGE_KEY.SHOW_QUICK_BUTTON}" value="0" ${localStorage.getItem(ENUMS_STORAGE_KEY.SHOW_QUICK_BUTTON) ? '' : 'checked' }> 隐藏
                        </div>
                        <div style="width: 30%">
                            <input type="radio" name="${showQuickBtnRadioName}" ${ENUMS_ATTR.KEY}="${ENUMS_STORAGE_KEY.SHOW_QUICK_BUTTON}" value="1" ${localStorage.getItem(ENUMS_STORAGE_KEY.SHOW_QUICK_BUTTON) ? 'checked' : '' }> 显示
                        </div>
                    </div>
				</div>
			`;
        popup.alert({title: '配置中心', content: content, width: 200});
        configCenterRadioEvent(blockLevelRadioName);
        configCenterRadioEvent(showSplitLineRadioName);
        configCenterRadioEvent(showQuickBtnRadioName);
    });

    let configCenterRadioEvent = function(radioName) {
        let radios = document.getElementsByName(radioName);
        for (let i = 0; i < radios.length; i++) {
            radios[i].addEventListener('change', function(e) {
                let target = e.target;
                if(target.value === '1') {
                    localStorage.setItem(target.getAttribute(ENUMS_ATTR.KEY), 1);
                } else {
                    localStorage.removeItem(target.getAttribute(ENUMS_ATTR.KEY));
                }
                toggleUserComponentVisibility();
                refreshQuickBtn();
            });
        }
    }

    let settingUserComponentVisibility = function(userComponent) {
        if(localStorage.getItem(ENUMS_STORAGE_KEY.BLOCK_LEVEL)) {
            if(localStorage.getItem(ENUMS_STORAGE_KEY.SHOW_SPLIT_LINE) && userComponent.getElementsByClassName(USER_COMMENT_COMPONENT_CLASS).length > 0) {
                userComponent.parentElement.classList.add(ENUMS_CSS.SPLIT_LINE);
            }
            if(!localStorage.getItem(ENUMS_STORAGE_KEY.SHOW_SPLIT_LINE) && userComponent.getElementsByClassName(USER_COMMENT_COMPONENT_CLASS).length > 0) {
                userComponent.parentElement.classList.remove(ENUMS_CSS.SPLIT_LINE);
            }
            userComponent.classList.add(ENUMS_CSS.DISPLAY_NONE);
        } else {
            userComponent.parentElement.classList.remove(ENUMS_CSS.SPLIT_LINE);
            userComponent.classList.remove(ENUMS_CSS.DISPLAY_NONE);
        }
    }

    let toggleUserComponentVisibility = function(obj) {
        if(obj) {
            //设置用户容器的可见性
            settingUserComponentVisibility(obj)
        } else {
            let userComponents = document.querySelectorAll(`.${USER_COMPONENT_CLASS}.${BLOCKED_CLASS}`)
            if(userComponents.length > 0) {
                for (let i = 0; i < userComponents.length; i++) {
                    //设置用户容器的可见性
                    settingUserComponentVisibility(userComponents[i])
                }
            }
        }
    }

    let markBlockedUserComponent = function(obj, isCancel) {
        let userComponent = obj.closest(`.${USER_COMPONENT_CLASS}`);
        if(userComponent) {
            if(isCancel) {
                userComponent.classList.remove(BLOCKED_CLASS);
            } else {
                userComponent.classList.add(BLOCKED_CLASS);
            }

            //屏蔽强度[删除]逻辑，处理用户容器的显示效果
            toggleUserComponentVisibility(userComponent);
        }
    }

    let showCancelUserContent = function(hideContentClassName, originContentClassName, cancelUserId) {
        let hideComponents = document.getElementsByClassName(hideContentClassName + cancelUserId);
        while (hideComponents.length > 0) {
            //将屏蔽时保存的原始内容替换现在内容，实现恢复
            let hideComponent = hideComponents[0];
            let commentComponents = hideComponent.parentElement.getElementsByClassName(originContentClassName);
            if(commentComponents.length > 0) {
                commentComponents[0].innerHTML = hideComponent.innerHTML;
                commentComponents[0].classList.remove(BLOCKED_CLASS);

                //标记屏蔽用户容器
                markBlockedUserComponent(commentComponents[0], true);
            }
            //将保存的原始内容删除
            hideComponent.remove();
        }
    }

    let hideAndStoreContent = function(components, hideComponentClassName) {
        if(components.length > 0) {
            for (let i = 0; i < components.length; i++) {
                let component = components[i];
                let userId = component.getAttribute(ENUMS_ATTR.USER_ID);
                let hasBlocked = localStorage.getItem(ENUMS_STORAGE_KEY.BLOCK_PREFIX + userId);
                //判断userId是否被屏蔽，并且判断用户内容容器是否已被处理，避免重复处理出现异常
                if(hasBlocked && component.className.indexOf(BLOCKED_CLASS) === -1) {
                    //创建一个隐藏的div，用来保存用户原始的内容，用于取消屏蔽后恢复
                    let hideComponent = document.createElement('div');
                    hideComponent.innerHTML = component.innerHTML;
                    hideComponent.hidden = true;
                    hideComponent.className = hideComponentClassName + userId;

                    //将用户的原始内容隐藏
                    component.innerText = BLOCK_REPLACE_TXT;
                    component.classList.add(BLOCKED_CLASS);
                    component.parentElement.appendChild(hideComponent);

                    //标记屏蔽用户容器
                    markBlockedUserComponent(component);
                }
            }
        }
    }

    let hideBlockedUserContent = function(blockUserId) {
        //没有传入userId，是第一次打开页面，或者是滚动追加，需要对整个页面做全局匹配
        if(!blockUserId) {
            //隐藏评论
            let commentComponents = document.querySelectorAll(`.${USER_COMMENT_COMPONENT_CLASS}:not(.${BLOCKED_CLASS})`)
            hideAndStoreContent(commentComponents, HIDE_USER_COMMENT_COMPONENT_WITH_ID_CLASS);

            //隐藏回答
            let blockUserAnswerRichContentInnerComponents = document.querySelectorAll(`.${USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_CLASS}:not(.${BLOCKED_CLASS})`)
            hideAndStoreContent(blockUserAnswerRichContentInnerComponents, HIDE_USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_WITH_ID_CLASS);
        } else {
            //有传入userId，是按钮触发，只需处理对应的用户内容容器

            //隐藏评论
            let blockUserCommentComponents = document.getElementsByClassName(USER_COMMENT_COMPONENT_WITH_ID_CLASS + blockUserId);
            hideAndStoreContent(blockUserCommentComponents, HIDE_USER_COMMENT_COMPONENT_WITH_ID_CLASS);

            //隐藏回答
            let blockUserAnswerRichContentInnerComponents = document.getElementsByClassName(USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_WITH_ID_CLASS + blockUserId);
            hideAndStoreContent(blockUserAnswerRichContentInnerComponents, HIDE_USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_WITH_ID_CLASS);
        }
    }

    let toggleBtn = function(userId, type) {
        let btns = document.getElementsByClassName(TYPE_BTN_CLASS[type] + userId);
        let revertBtns = document.getElementsByClassName(TYPE_BTN_CLASS[1 - type] + userId);
        for (let i = 0; i < btns.length; i++) {
            btns[i].hidden = true;
            revertBtns[i].hidden = false;
        }
    }

    //点击屏蔽、取消按钮时，调用知乎黑名单API
    let blockUserToZhiHu = function(userId, method) {
        try {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.zhihu.com/api/v4/members/${userId}`,
                onload: function (resp) {
                    let userInfo = JSON.parse(resp.response);
                    GM_xmlhttpRequest({method: method, url: `https://www.zhihu.com/api/v4/members/${userInfo.url_token}/actions/block`});
                },
                onerror: function (e) {
                    console.log(e);
                }
            });
        } catch (e) {
            console.log("blockUserToZhiHu error", e)
        }
    }

    //同步知乎黑名单至脚本
    let doSync = function(url) {
        try {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url ? url : `https://www.zhihu.com/api/v3/settings/blocked_users?offset=0&limit=100`,
                onload: function (resp) {
                    let blockedUsers = JSON.parse(resp.response);
                    let {data, paging} = blockedUsers;
                    let nextUrl = new window.URL(paging.next);
                    for (const blockedUser of data) {
                        localStorage.setItem(ENUMS_STORAGE_KEY.BLOCK_PREFIX + blockedUser.id, 1);
                    }
                    if(!paging.is_end) {
                        let progress = Math.round(nextUrl.searchParams.get('offset') / paging.totals * 100);
                        console.log(`知乎黑名单用户同步中...${progress}%`)

                        //下一页
                        doSync(nextUrl.toString());
                    } else {
                        localStorage.setItem(ENUMS_STORAGE_KEY.SYNCED, 1);
                        console.log(`知乎黑名单用户同步中...100%`)
                        console.log(`知乎黑名单用户同步完成`)
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
        if('www.zhihu.com' !== window.location.host) {
            return ;
        }

        //已完成同步，无需再同步了
        let synced = localStorage.getItem(ENUMS_STORAGE_KEY.SYNCED);
        if(synced) {
            return;
        }
        doSync();
    }
    syncBlockedUser();

    //迁移localStorage中屏蔽的用户key，精简key前缀
    let migrateBlockUser = function() {
        if(localStorage.length > 0){
            const blockUserIds = [];
            for(let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if(key.indexOf(ENUMS_STORAGE_KEY.DEPRECATED_BLOCK_PREFIX) !== -1) {
                    blockUserIds.push(key.replaceAll(ENUMS_STORAGE_KEY.DEPRECATED_BLOCK_PREFIX, ''));
                }
            }

            if(blockUserIds.length > 0) {
                for (let blockUserId of blockUserIds) {
                    localStorage.removeItem(ENUMS_STORAGE_KEY.DEPRECATED_BLOCK_PREFIX + blockUserId);
                    localStorage.setItem(ENUMS_STORAGE_KEY.BLOCK_PREFIX + blockUserId, 1);
                }
            }
        }
    }
    migrateBlockUser();

    let blockBtnClickEvent = function(e) {
        e.cancelBubble = true;
        e.stopPropagation();

        //保存屏蔽userId
        let userId = e.target.getAttribute(ENUMS_ATTR.USER_ID);
        localStorage.setItem(ENUMS_STORAGE_KEY.BLOCK_PREFIX + userId, 1);

        //隐藏用户内容
        hideBlockedUserContent(userId);

        //切换展示的按钮
        toggleBtn(userId, ENUMS_BLOCK_BTN_TYPE.BLOCK);

        //知乎屏蔽接口调用
        blockUserToZhiHu(userId, 'POST');
    }

    let cancelBtnClickEvent = function(e) {
        e.cancelBubble = true;
        e.stopPropagation();

        //删除屏蔽userId
        let userId = e.target.getAttribute(ENUMS_ATTR.USER_ID);
        localStorage.removeItem(ENUMS_STORAGE_KEY.BLOCK_PREFIX + userId);

        //显示用户内容
        showCancelUserContent(HIDE_USER_COMMENT_COMPONENT_WITH_ID_CLASS, USER_COMMENT_COMPONENT_CLASS, userId);
        showCancelUserContent(HIDE_USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_WITH_ID_CLASS, USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_CLASS, userId);

        //切换展示的按钮
        toggleBtn(userId, ENUMS_BLOCK_BTN_TYPE.CANCEL);

        //知乎屏蔽接口调用
        blockUserToZhiHu(userId, 'DELETE');
    }

    let markCommentComponents = function() {
        //评论内容
        let commentComponents = document.querySelectorAll(`.${COMMENT_CONTENT_CLASS}:not(.${USER_COMMENT_COMPONENT_CLASS})`)
        if(commentComponents.length > 0) {
            for (let i = 0; i < commentComponents.length; i++) {
                let commentComponent = commentComponents[i];
                //用户评论分为左侧的头像，和右侧的名称及评论内容
                //现在要通过评论的内容，向上找到整个评论容器

                //评论右侧的内容，包含名称、评论内容
                let userRightComponent = commentComponent.parentElement;
                //用户容器，包含头像、名称、评论内容
                let userComponent = userRightComponent.parentElement;

                if(userRightComponent.firstChild) {
                    //在右侧的容器中找到名称，后面会把屏蔽和取消按钮追加在这
                    let userNameComponent = userRightComponent.firstChild.firstChild;
                    if(userNameComponent) {
                        //名称超链
                        let aTag = userNameComponent.getElementsByTagName('a');
                        if(aTag.length > 0) {
                            //截取userId
                            let userHref = aTag[0].getAttribute('href');
                            let userId = userHref.substr(userHref.lastIndexOf("/") + 1)

                            //给这些元素添加自定义class，和userId，方便后面的操作
                            userNameComponent.classList.add(USER_NAME_COMPONENT_CLASS);
                            userNameComponent.setAttribute(ENUMS_ATTR.USER_ID, userId);

                            userRightComponent.classList.add(USER_RIGHT_COMPONENT_CLASS);
                            userRightComponent.setAttribute(ENUMS_ATTR.USER_ID, userId);

                            userComponent.classList.add(USER_COMPONENT_CLASS)

                            commentComponent.classList.add(USER_COMMENT_COMPONENT_CLASS);
                            commentComponent.classList.add(USER_COMMENT_COMPONENT_WITH_ID_CLASS + userId);
                            commentComponent.setAttribute(ENUMS_ATTR.USER_ID, userId);
                        }
                    }
                }
            }
        }
    }

    let markAnswerComponents = function() {
        //回答的容器
        let answerComponents = document.querySelectorAll(`.${USER_ANSWER_CLASS}:not(.${USER_ANSWER_COMPONENT_CLASS})`)
        if(answerComponents.length > 0) {
            for (let i = 0; i < answerComponents.length; i++) {
                let answerComponent = answerComponents[i];
                //回答的userId在该元素的属性上，是json格式，解析json，获取userId
                let extraStr = answerComponent.getAttribute(USER_ANSWER_EXTRA_DATA_NAME);
                if(extraStr) {
                    let extra = JSON.parse(extraStr);
                    let userId = extra.card.content.author_member_hash_id;

                    //回答中的用户信息，这里面有头像，名称等，后面会把屏蔽和取消按钮追加在这
                    let authorInfoNames = answerComponent.getElementsByClassName(USER_ANSWER_AUTHOR_INFO_NAME_CLASS);
                    //回答的内容
                    let richContentInner = answerComponent.getElementsByClassName(USER_ANSWER_RICH_CONTENT_INNER_CLASS);
                    //用户容器，包含用户的头像，名称，回答等用户信息
                    let userComponent = answerComponent.parentElement.parentElement;

                    //给这些元素添加自定义class，和userId，方便后面的操作
                    if(authorInfoNames.length > 0) {
                        authorInfoNames[0].classList.add(USER_ANSWER_AUTHOR_INFO_NAME_COMPONENT_CLASS);
                        authorInfoNames[0].setAttribute(ENUMS_ATTR.USER_ID, userId);
                    }
                    if(richContentInner.length > 0) {
                        richContentInner[0].classList.add(USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_CLASS);
                        richContentInner[0].classList.add(USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_WITH_ID_CLASS + userId);
                        richContentInner[0].setAttribute(ENUMS_ATTR.USER_ID, userId);
                    }

                    userComponent.classList.add(USER_COMPONENT_CLASS);

                    answerComponent.classList.add(USER_ANSWER_COMPONENT_CLASS);
                    answerComponent.classList.add(USER_ANSWER_COMPONENT_WITH_ID_CLASS + userId);
                    answerComponent.setAttribute(ENUMS_ATTR.USER_ID, userId);
                }
            }
        }
    }

    let collapsedAnswer = function() {
        let richContentInners = document.querySelectorAll(`.${USER_ANSWER_RICH_CONTENT_INNER_CLASS}:not(.${USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_CLASS})`);
        if(richContentInners.length) {
            for (let i = 0; i < richContentInners.length; i++) {
                let richContentInner = richContentInners[i];
                let answerComponent = richContentInner.closest(`.${USER_ANSWER_COMPONENT_CLASS}`);
                if(answerComponent) {
                    let userId = answerComponent.getAttribute(ENUMS_ATTR.USER_ID);
                    richContentInner.classList.add(USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_CLASS);
                    richContentInner.classList.add(USER_ANSWER_RICH_CONTENT_INNER_COMPONENT_WITH_ID_CLASS + userId);
                    richContentInner.setAttribute(ENUMS_ATTR.USER_ID, userId);
                }
            }
        }
    }

    let markComponents = function() {
        //标记评论
        markCommentComponents();
        //标记回答
        markAnswerComponents();
    }

    let appendBtn = function(component, type) {
        let userId = component.getAttribute(ENUMS_ATTR.USER_ID);
        let hasBlocked = localStorage.getItem(ENUMS_STORAGE_KEY.BLOCK_PREFIX + userId);
        //创建按钮元素
        let blockBtn = document.createElement("span");
        blockBtn.setAttribute(ENUMS_ATTR.USER_ID, userId);
        blockBtn.classList.add(BTN_GROUP_CLASS)
        blockBtn.classList.add(TYPE_BTN_CLASS[type] + userId)
        blockBtn.style = TYPE_BTN_STYLE[type];
        blockBtn.title = TYPE_BTN_TITLE_TXT[type];
        blockBtn.innerText = TYPE_BTN_TXT[type];
        blockBtn.onclick = type === 0 ? blockBtnClickEvent : cancelBtnClickEvent;
        blockBtn.hidden = type === 0 ? hasBlocked : !hasBlocked

        component.appendChild(blockBtn);
        component.classList.add(BTN_APPENDED_COMPONENT_CLASS);
    }

    let appendClickBtnByClassName = function(componentClassName) {
        //元素过滤
        let components = document.querySelectorAll(`.${componentClassName}:not(.${BTN_APPENDED_COMPONENT_CLASS})`);
        if(components.length > 0) {
            for (let i = 0; i < components.length; i++) {
                let component = components[i];
                if(component.getElementsByClassName(BTN_GROUP_CLASS).length === 0) {
                    //追加屏蔽按钮
                    appendBtn(component, ENUMS_BLOCK_BTN_TYPE.BLOCK);
                    //追加取消按钮
                    appendBtn(component, ENUMS_BLOCK_BTN_TYPE.CANCEL);
                }
            }
        }
    }

    let appendClickBtn = function() {
        //追加评论的屏蔽取消按钮
        appendClickBtnByClassName(USER_NAME_COMPONENT_CLASS);
        //追加回答的屏蔽取消按钮
        appendClickBtnByClassName(USER_ANSWER_AUTHOR_INFO_NAME_COMPONENT_CLASS);
    }

    //入口
    let mainEvent = function() {
        //标记需要处理元素，添加自定义的class，方便后面的操作
        markComponents();
        //添加屏蔽和取消屏蔽的按钮
        appendClickBtn();
        //第一次打开页面、滚动加载时，将屏蔽的用户内容隐藏
        hideBlockedUserContent();
        //处理收起的回答
        collapsedAnswer();
    }

    let refreshQuickBtn = function() {
        const showQuickButton = localStorage.getItem(ENUMS_STORAGE_KEY.SHOW_QUICK_BUTTON);
        const showSplitLine = localStorage.getItem(ENUMS_STORAGE_KEY.SHOW_SPLIT_LINE);
        const blockLevel = localStorage.getItem(ENUMS_STORAGE_KEY.BLOCK_LEVEL);

        const splitLineBtn = document.getElementById(ENUMS_ELEMENT_ID.SPLIT_LINE);
        splitLineBtn.innerText = `${showSplitLine ? '显示' : '隐藏'}分割`;
        splitLineBtn.style.display = (blockLevel && showQuickButton) ? 'flex' : 'none';

        const blockLevelBtn = document.getElementById(ENUMS_ELEMENT_ID.BLOCK_LEVEL);
        blockLevelBtn.innerText = `${blockLevel ? '删除' : '替换'}模式`;
        blockLevelBtn.style.display = showQuickButton ? 'flex' : 'none';
    }

    let quickBtnClickEvent = function (obj) {
        obj.addEventListener('click', function(e) {
            let target = e.target;
            let key = target.getAttribute(ENUMS_ATTR.KEY);
            localStorage.getItem(key) ? localStorage.removeItem(key) : localStorage.setItem(key, 1);
            toggleUserComponentVisibility();
            refreshQuickBtn();
        })
    }

    //右下角操作按钮
    let appendQuickButton = function() {
        let cornerButtonsComponent = document.getElementsByClassName(CORNER_BUTTONS_CLASS);
        if(cornerButtonsComponent.length > 0) {
            cornerButtonsComponent = cornerButtonsComponent[0];

            const blockLevelBtn = document.createElement("button");
            blockLevelBtn.id = ENUMS_ELEMENT_ID.BLOCK_LEVEL;
            blockLevelBtn.style = ENUMS_STYLE.QUICK_BTN;
            blockLevelBtn.setAttribute(ENUMS_ATTR.KEY, ENUMS_STORAGE_KEY.BLOCK_LEVEL);
            cornerButtonsComponent.insertBefore(blockLevelBtn, cornerButtonsComponent.firstChild);

            const splitLineBtn = document.createElement("button");
            splitLineBtn.id = ENUMS_ELEMENT_ID.SPLIT_LINE;
            splitLineBtn.style = ENUMS_STYLE.QUICK_BTN;
            splitLineBtn.setAttribute(ENUMS_ATTR.KEY, ENUMS_STORAGE_KEY.SHOW_SPLIT_LINE);
            cornerButtonsComponent.insertBefore(splitLineBtn, cornerButtonsComponent.firstChild);

            refreshQuickBtn();
            quickBtnClickEvent(splitLineBtn);
            quickBtnClickEvent(blockLevelBtn);
        }
    }
    appendQuickButton();

    setInterval(mainEvent, INTERVAL_TIME);

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
})();