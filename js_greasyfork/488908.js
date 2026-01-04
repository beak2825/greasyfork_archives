// ==UserScript==
// @name         bilibili批量黑名单
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在哔哩哔哩搜索页批量管理黑名单。
// @author       zyb
// @match        https://search.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488908/bilibili%E6%89%B9%E9%87%8F%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/488908/bilibili%E6%89%B9%E9%87%8F%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 搜索列表结果页用户的className常量
    const FID_CLASSNAME = '.search-content .media-list .b-user-info-card a.p_relative';
    const TOPBTNBOX_CLASSNAME = '.search-content .search-page-wrapper .search-conditions .conditions-order';
    const BTNBOX_CLASSNAME = '.search-content .media-list .b-user-info-card .user-content .user-actions';
    const LISTDOM_CLASSNAME = '.search-content';
    // const LISTDOM_CLASSNAME = '#i_cecream';

    class AddBlacklist {

        constructor() {
            this.init();
        }

        init() {
            // 判断当前页是否在用户下
            if (location.pathname.slice(1) !== 'upuser') {
                return;
            }

            // 判断是否已经添加过黑名单按钮
            if (document.querySelectorAll('.addBlacklist_topBtnBox')[0]) {
                return;
            }
            // 暂存this
            const _this = this;
            // 事件托管
            const listDom = document.querySelectorAll(LISTDOM_CLASSNAME)[0];
            listDom && (listDom.onclick = function (e) {
                const targetDom = e.target;
                // 获取自定义数据
                const fid = targetDom?.dataset?.fid;
                let blackflag = +targetDom?.dataset?.blackflag;
                // 判断当前dom节点是否是添加黑名单按钮
                if (fid) {
                    // 原先不在黑名单中
                    if (!blackflag) {
                        // 添加用户到黑名单
                        _this.addToBlack(fid);
                        // 更新按钮文本和数据
                        targetDom.innerHTML = '移除出黑名单';
                        targetDom.dataset.blackflag = 1
                    }
                    // 原先在黑名单中
                    else {
                        // 从黑名单移除该用户
                        _this.removeFromBlack(fid);
                        // 更新按钮文本和数据
                        targetDom.innerHTML = '添加至黑名单';
                        targetDom.dataset.blackflag = 0

                    }
                }
            })
            // 创建管理按钮
            this.createTopBtnElement();
        }

        /**
         * 根据字段获取对应cookie值
         * @param {string} cookieName
         * @returns {string}
         */
        getCookieValue(cookieName) {
            let name = cookieName + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let cookieArray = decodedCookie.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
                let cookie = cookieArray[i].trim();
                if (cookie.indexOf(name) == 0) {
                    return cookie.substring(name.length, cookie.length);
                }
            }
            return "";
        }

        /**
         * bilibili黑名单api
         * @param {string} fid 用户id
         * @param {string} action 行为类型
         * @returns {Promise}
         */
        controlBlackListfetch(fid, action = 'add') {
            if (!fid) {
                return;
            }
            const act = {
                add: 5,
                remove: 6
            }[action];
            const csrf = this.getCookieValue('bili_jct');

            return fetch("https://api.bilibili.com/x/relation/modify", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                },
                "body": `fid=${fid}&act=${act}&re_src=11&gaia_source=web_main&csrf=${csrf}`,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
        }

        /**
         * 添加用户到黑名单
         * @param {string} fid 用户id
         * @returns {Promise}
         */
        addToBlack(fid = '') {
            return this.controlBlackListfetch(fid, 'add');
        }

        /**
         * 从黑名单移除该用户
         * @param {string} fid 用户id
         * @returns {Promise}
         */
        removeFromBlack(fid = '') {
            return this.controlBlackListfetch(fid, 'remove');
        }

        /**
         * 获取搜索页用户的数据
         * @returns {Array}
         */
        getUserList() {
            const listDom = document.querySelectorAll(FID_CLASSNAME);
            return Array.from(listDom).map((dom) => {
                return {
                    href: dom.href,
                    fid: dom.pathname.slice(1),
                    title: dom.title,
                    text: dom.text,
                    pathName: dom.pathname
                }
            })
        }
        /**
         * 创建css样式
         * @param {string} styleStr css样式
         */
        createStyleFuc(styleStr = "") {
            // 创建style节点
            const style = document.createElement("style");
            style.setAttribute("type", "text/css");
            style.appendChild(document.createTextNode(styleStr));
            document.head.appendChild(style);
        }

        /**
         * 批量创建 添加至黑名单 按钮
         */
        createBtnElement() {
            this.userList = this.getUserList();
            Array.from(document.querySelectorAll(BTNBOX_CLASSNAME)).forEach((dom, index) => {
                const btnDom = document.createElement('button');
                btnDom.setAttribute('class', 'addBlacklist_btnBox');
                btnDom.setAttribute('data-fid', this.userList[index].fid);
                btnDom.setAttribute('data-blackflag', 0);
                btnDom.innerHTML = `添加至黑名单`;
                dom.appendChild(btnDom)
            });
        }

        /**
         * 创建 批量控制黑名单 按钮
         */
        createTopBtnElement() {
            const _this = this;

            this.createStyleFuc(`
                .addBlacklist_topBtnBox,
                .addBlacklist_btnBox {
                    width: 100px;
                    height: 32px;
                    color: #18191c;
                    background: #ffffff;
                    border: 1px solid #e3e5e7;
                    padding: 0;
                    border-radius: 6px;
                    font-size: 14px;
                    line-height: 1;
                    white-space: nowrap;
                    user-select: none;
                    cursor: pointer;
                    margin-left: 10px;
                }

                .addBlacklist_topBtnBox {
                    width: 120px;
                }
            `)

            const btnDom = document.createElement('button');
            btnDom.setAttribute('class', 'addBlacklist_topBtnBox');
            btnDom.innerHTML = `批量控制黑名单`;

            btnDom.onclick = function (e) {
                if (document.querySelectorAll('.addBlacklist_btnBox').length === 0) {
                    _this.createBtnElement();
                }
            }

            document.querySelectorAll(TOPBTNBOX_CLASSNAME)[0].appendChild(btnDom)
        }
    }

    class ListenHref {
        href = location.href;
        timeId = null;

        constructor() {
        }

        setInterval(time = 100, callback) {
            this.timeId = setInterval(() => {
                if (location.href !== this.href) {
                    console.log('------------------href改变了---------------------');
                    if (callback) {
                        callback();
                    }
                    this.href = location.href;
                }
            }, time)
            return this.timeId;
        }

        clearInterval(timeId = this.timeId) {
            this.clearInterval(timeId);
        }
    }

    const blackList = new AddBlacklist();
    const listenHref = new ListenHref();
    listenHref.setInterval(100, () => {
        blackList.init();
    })
})();