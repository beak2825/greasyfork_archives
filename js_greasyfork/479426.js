// ==UserScript==
// @name         NodeSeek X
// @namespace    http://www.nodeseek.com/
// @version      0.3-beta.22
// @description  【原NodeSeek增强】自动签到、无缝翻页帖子评论、快捷回复、代码高亮、屏蔽用户、屏蔽帖子、楼主低等级提醒
// @author       dabao
// @match        *://www.nodeseek.com/*
// @match        *://www.deepflood.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACz0lEQVR4Ae3B32tVdQAA8M85u7aVHObmzJVD0+ssiphstLEM62CBlCBEIAYhUoGGD/kiRUo+9CIEElFZgZJFSApBVhCUX2WFrVQKf5Qy26SgdK4pN7eZu+cbtyfJ/gLx83HD9SAhlEyXupiPhUSTeonRfNw1ws2aRJeN5jHcolFhJJ9M8Zj99piDTnv12SjzfzIb9dmrC7Pttt8ykjDVLsu8ZZ1GH1oqeDofJLtJh4fMEw3Y72jlCuEO2+W+sNJFr3vOZ1YIi8NIGA29hDWhGgZDJ2Rt2ZvZSBazmMUsZsPZ1qwVQmcYDNWwhtAbRsNIWJx6WLPDfgxNVkm9nR8hm+XduLba7F9RtcXztmUzyY/YJrUqNPvBYc0eSS3CwXxMl4WG7CarsyEuvU2HOkRNujSw3PosxR6DFurKxx3E/akFohPo0aDfEO61os5LdrtLVWG1TzxokifdiSH9GnTjuGhBqsWE39GOo3kVi8wsmeVW00SJ200zA9r0kFcdQzv+MKElVW/S+L5EE86pmUth3BV/SzCOCUjMVXMWzfsSYybVl1SlSlESkagpuOI1nzshFX1gyAF1UKhJEKOkJFVNXVBv+pJoBK1qBkh86z1/SaR+9o5zEgoDaloxsiSart6F1Bkl83ESHWEKvvEbqZJETaokgSH9hCk6cBLtSs6kDqEb/cZ0K+MnO0X/VdhRGUBZjzH9uA+HUl+a0BvmO+J7bVZSKWz1kehqhfe9oWalNoccDmW9JnyV+toxsy3PK3aY9Gx4gMp567ziV4WawpCXra+MEhZ5xqTtecVycxzXlxA22OK4ZYbt9LjvrM5PkNUp6zVPdNpBv1QKwt126Paxp8zwqXu8kG8pYZdHlT2Rvxo2aVG2ObyYn65UnXLKVULZZrP02ZRfCms1OmAXCSHRYqrLzuZFaDFV6s/8omuERs0Kl/LzITVTvTHDeXTD9eAftAsSYhXYOWUAAAAASUVORK5CYII=
// @require      https://s4.zstatic.net/ajax/libs/layui/2.9.9/layui.min.js
// @resource     highlightStyle https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css
// @resource     highlightStyle_dark https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getResourceURL
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-idle
// @license      GPL-3.0
// @supportURL   https://www.nodeseek.com/post-36263-1
// @homepageURL  https://www.nodeseek.com/post-36263-1
// @downloadURL https://update.greasyfork.org/scripts/479426/NodeSeek%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/479426/NodeSeek%20X.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const { version, author, name, icon } = GM_info.script;

    const BASE_URL = location.origin;

    const SITE_MAP = {
        "www.nodeseek.com": { code: "ns", name: "NodeSeek", url: "https://www.nodeseek.com/" },
        "www.deepflood.com": { code: "df", name: "DeepFlood", url: "https://www.deepflood.com/" }
    };

    class BroadcastManager {
        static instances = new Map();

        constructor(channelName = "nsx_channel") {
            if (BroadcastManager.instances.has(channelName)) {
                return BroadcastManager.instances.get(channelName);
            }

            this.channelName = channelName;
            this.myId = `${Date.now()}-${Math.random()}`;
            this.receivers = [];
            this.ch = new BroadcastChannel(channelName);
            this.KEY = `only_last_tab_${channelName}`;

            // 广播接收
            this.ch.onmessage = e => this.receivers.forEach(fn => fn(e.data));

            // 主控权管理
            localStorage.setItem(this.KEY, this.myId);
            this.updateActive();

            // 事件监听
            addEventListener("storage", e => {
                if (e.key === this.KEY) {
                    e.newValue || localStorage.setItem(this.KEY, this.myId);
                    this.updateActive();
                }
            });

            addEventListener("beforeunload", () => {
                this.active && localStorage.removeItem(this.KEY);
            });

            BroadcastManager.instances.set(channelName, this);
        }

        updateActive() {
            this.active = localStorage.getItem(this.KEY) === this.myId;
        }

        registerReceiver(fn) {
            this.receivers.push(fn);
        }

        broadcast(data) {
            const message = { sender: this.myId, data };
            this.ch.postMessage(message);
            this.receivers.forEach(fn => fn(message));
        }

        startTask(taskFn, interval) {
            setInterval(async () => {
                if (this.active) {
                    try {
                        this.broadcast(await taskFn());
                    } catch (err) {
                        console.error(`[Tab ${this.myId}] 任务出错:`, err);
                    }
                }
            }, interval);
        }
    }

    const util = {
        clog:(c) => {
            console.group(`%c %c [${name}]-v${version} by ${author}`, `background:url(${icon}) center/12px no-repeat;padding:3px`, "");
            console.log(c);
            console.groupEnd();
        },
        getValue: (name, defaultValue) => GM_getValue(name, defaultValue),
        setValue: (name, value) => GM_setValue(name, value),
        sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.head.querySelector(`#${id}`);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.head.appendChild(style);
        },
        removeStyle(id,tag){
            tag = tag || 'style';
            let doc = document, styleDom = doc.head.querySelector(`#${id}`);
            if (styleDom) { doc.head.removeChild(styleDom) };
        },
        getAttrsByPrefix(element, prefix) {
            return Array.from(element.attributes).reduce((acc, { name, value }) => {
                if (name.startsWith(prefix)) acc[name] = value;
                return acc;
            }, {});
        },
        data(element, key, value) {
            if (arguments.length < 2) return undefined;
            if (value !== undefined) element.dataset[key] = value;
            return element.dataset[key];
        },
        async post(url, data, headers, responseType = 'json') {
            return this.fetchData(url, 'POST', data, headers, responseType);
        },
        async get(url, headers, responseType = 'json') {
            return this.fetchData(url, 'GET', null, headers, responseType);
        },
        async fetchData(url, method='GET', data=null, headers={}, responseType='json') {
            const options = {
                method,
                headers: { 'Content-Type':'application/json',...headers},
                body: data ? JSON.stringify(data) : undefined
            };
            const response = await fetch(url.startsWith("http") ? url : BASE_URL + url, options);
            const result = await response[responseType]().catch(() => null);
            return response.ok ? result : Promise.reject(result);
        },
        getCurrentDate() {
            const localTimezoneOffset = (new Date()).getTimezoneOffset();
            const beijingOffset = 8 * 60;
            const beijingTime = new Date(Date.now() + (localTimezoneOffset + beijingOffset) * 60 * 1000);
            const timeNow = `${beijingTime.getFullYear()}/${(beijingTime.getMonth() + 1)}/${beijingTime.getDate()}`;
            return timeNow;
        },
        createElement(tagName, options = {}, childrens = [], doc = document, namespace = null) {
            if (Array.isArray(options)) {
                if (childrens.length !== 0) {
                    throw new Error("If options is an array, childrens should not be provided.");
                }
                childrens = options;
                options = {};
            }

            const { staticClass = '', dynamicClass = '', attrs = {}, on = {} } = options;

            const ele = namespace ? doc.createElementNS(namespace, tagName) : doc.createElement(tagName);

            if (staticClass) {
                staticClass.split(' ').forEach(cls => ele.classList.add(cls.trim()));
            }
            if (dynamicClass) {
                dynamicClass.split(' ').forEach(cls => ele.classList.add(cls.trim()));
            }

            Object.entries(attrs).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.entries(value).forEach(([styleKey, styleValue]) => {
                        ele.style[styleKey] = styleValue;
                    });
                } else {
                    if (value !== undefined) ele.setAttribute(key, value);
                }
            });

            Object.entries(on).forEach(([event, handler]) => {
                ele.addEventListener(event, handler);
            });

            childrens.forEach(child => {
                if (typeof child === 'string') {
                    child = doc.createTextNode(child);
                }
                ele.appendChild(child);
            });

            return ele;
        },
        b64DecodeUnicode(str) {
            // Going backwards: from bytestream, to percent-encoding, to original string.
            return decodeURIComponent(atob(str).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }
    };

    const opts = {
        curSite : SITE_MAP[location.host] || null,
        post: {
            pathPattern: /^\/(categories\/|page|award|search|$)/,
            scrollThreshold: 1500,
            nextPagerSelector: '.nsk-pager a.pager-next',
            postListSelector: 'ul.post-list:not(.topic-carousel-panel)',
            topPagerSelector: 'div.nsk-pager.pager-top',
            bottomPagerSelector: 'div.nsk-pager.pager-bottom',
        },
        comment: {
            pathPattern: /^\/post-/,
            scrollThreshold: 690,
            nextPagerSelector: '.nsk-pager a.pager-next',
            postListSelector: 'ul.comments',
            topPagerSelector: 'div.nsk-pager.post-top-pager',
            bottomPagerSelector: 'div.nsk-pager.post-bottom-pager',
        },
        settings:{
            "version": version,
            "sign_in": {"ns":{ "enabled": true, "method": 0, "last_date": "", "ignore_date": "" },"df":{ "enabled": true, "method": 0, "last_date": "", "ignore_date": "" }},
            "signin_tips": { "enabled": true },
            "re_signin": { "enabled": true },
            "auto_jump_external_links": { "enabled": true },
            "loading_post": { "enabled": true },
            "loading_comment": { "enabled": true },
            "quick_comment": { "enabled": true },
            "open_post_in_new_tab": { "enabled": false },
            "block_members": { "enabled": true },
            "block_posts": { "enabled": true,"keywords":[] },
            "level_tag": { "enabled": true, "low_lv_alarm":false, "low_lv_max_days":30 },
            "code_highlight": { "enabled": true },
            "image_slide":{ "enabled":true },
            "visited_links":{ "enabled": true, "link_color":"","visited_color":"","dark_link_color":"","dark_visited_color":"" },
            "user_card_ext": { "enabled":true }
        }
    };
    layui.use(function () {
        const layer = layui.layer;
        const dropdown = layui.dropdown;
        const message = {
            info: (text) => message.__msg(text, { "background-color": "#4D82D6" }),
            success: (text) => message.__msg(text, { "background-color": "#57BF57" }),
            warning: (text) => message.__msg(text, { "background-color": "#D6A14D" }),
            error: (text) => message.__msg(text, { "background-color": "#E1715B" }),
            __msg: (text, style) => { let index = layer.msg(text, { offset: 't', area: ['100%', 'auto'], anim: 'slideDown' }); layer.style(index, Object.assign({ opacity: 0.9 }, style)); }
        };

        const Config = {
            // 初始化配置数据
            initializeConfig() {
                const defaultConfig = opts.settings;
                if (!util.getValue('settings')) {
                    util.setValue('settings', defaultConfig);
                    return;
                }
                if(this.getConfig('version')===version) return;
                // 从存储中获取当前配置
                let storedConfig = util.getValue('settings');

                // 递归地删除不在默认配置中的项
                const cleanDefaults = (stored, defaults) => {
                    Object.keys(stored).forEach(key => {
                        if (defaults[key] === undefined) {
                            delete stored[key]; // 如果默认配置中没有这个键，删除它
                        } else if (typeof stored[key] === 'object' && stored[key] !== null && !(stored[key] instanceof Array)) {
                            cleanDefaults(stored[key], defaults[key]); // 递归检查
                        }
                    });
                };

                // 递归地将默认配置中的新项合并到存储的配置中
                const mergeDefaults = (stored, defaults) => {
                    Object.keys(defaults).forEach(key => {
                        if (typeof defaults[key] === 'object' && defaults[key] !== null && !(defaults[key] instanceof Array)) {
                            if (!stored[key]) stored[key] = {};
                            mergeDefaults(stored[key], defaults[key]);
                        } else {
                            if (stored[key] === undefined) {
                                stored[key] = defaults[key];
                            }
                        }
                    });
                };

                mergeDefaults(storedConfig, defaultConfig);
                //...这里将旧设置项的值迁移到新设置项
                cleanDefaults(storedConfig, defaultConfig);
                storedConfig.version = version;
                util.setValue('settings',storedConfig);
            },updateConfig(path, value) {
                let config = util.getValue('settings');
                let keys = path.split('.');
                let lastKey = keys.pop();
                let lastObj = keys.reduce((obj, key) => obj[key], config);
                lastObj[lastKey] = value;
                util.setValue('settings', config);
            },getConfig(path) {
                let config = GM_getValue('settings');
                let keys = path.split('.');
                return keys.reduce((obj, key) => obj[key], config);
            }
        };

        const FeatureFlags={
            isEnabled(featureName) {
                if (Config.getConfig(featureName)) {
                    return Config.getConfig(`${featureName}.enabled`);
                } else {
                    console.error(`Feature '${featureName}' does not exist.`);
                    return false;
                }
            }
        };

        const main = {
            loginStatus: false,
            //检查是否登陆
            checkLogin() {
                if (unsafeWindow.__config__ && unsafeWindow.__config__.user) {
                    this.loginStatus = true;
                    util.clog(`当前登录用户 ${unsafeWindow.__config__.user.member_name} (ID ${unsafeWindow.__config__.user.member_id})`);
                }
            },
            // 自动签到
            autoSignIn(rand) {
                if(!FeatureFlags.isEnabled(`sign_in.${opts.curSite.code}`)) return;

                if (!this.loginStatus) return
                if (Config.getConfig(`sign_in.${opts.curSite.code}.enabled`) === false) return;

                rand = rand || (Config.getConfig(`sign_in.${opts.curSite.code}.method`) === 1);

                let timeNow = util.getCurrentDate(),
                    timeOld = Config.getConfig(`sign_in.${opts.curSite.code}.last_date`);
                if (!timeOld || timeOld != timeNow) { // 是新的一天
                    Config.updateConfig(`sign_in.${opts.curSite.code}.last_date`, timeNow);
                    this.signInRequest(rand);
                }
            },
            // 重新签到
            reSignIn() {
                if (!this.loginStatus) return;
                if (Config.getConfig(`sign_in.${opts.curSite.code}.enabled`) === false) {
                    unsafeWindow.mscAlert('提示', this.getMenuStateText(this._menus[0], 0) + ' 状态时不支持重新签到！');
                    return;
                }

                Config.updateConfig(`sign_in.${opts.curSite.code}.last_date`, '1753/1/1');
                location.reload();
            },
            addSignTips() {
                if(!FeatureFlags.isEnabled('signin_tips')) return;

                if (!this.loginStatus) return
                if (Config.getConfig(`sign_in.${opts.curSite.code}.enabled`) !== false) return;

                const timeNow = util.getCurrentDate();
                const timeIgnore = Config.getConfig(`sign_in.${opts.curSite.code}.ignore_date`);
                const timeOld = Config.getConfig(`sign_in.${opts.curSite.code}.last_date`);

                if (timeNow === timeIgnore || timeNow === timeOld) return;

                const _this = this;
                let tip = util.createElement("div", { staticClass: 'nsplus-tip' });
                let tip_p = util.createElement('p');
                tip_p.innerHTML = '今天你还没有签到哦！&emsp;【<a class="sign_in_btn" data-rand="true" href="javascript:;">随机抽个鸡腿</a>】&emsp;【<a class="sign_in_btn" data-rand="false" href="javascript:;">只要5个鸡腿</a>】&emsp;【<a id="sign_in_ignore" href="javascript:;">今天不再提示</a>】';
                tip.appendChild(tip_p);
                tip.querySelectorAll('.sign_in_btn').forEach(function (item) {
                    item.addEventListener("click", function (e) {
                        const rand = util.data(this, 'rand');
                        _this.signInRequest(rand);
                        tip.remove();
                        Config.updateConfig(`sign_in.${opts.curSite.code}.last_date`, timeNow);
                    })
                });
                tip.querySelector('#sign_in_ignore').addEventListener("click", function (e) {
                    tip.remove();
                    Config.updateConfig(`sign_in.${opts.curSite.code}.ignore_date`, timeNow);
                });

                document.querySelector('header').append(tip);
            },
            async signInRequest(rand) {
                await util.post('/api/attendance?random=' + (rand || false), {}, { "Content-Type": "application/json" }).then(json => {
                    if (json.success) {
                        message.success(`签到成功！今天午饭+${json.gain}个鸡腿; 积攒了${json.current}个鸡腿了`);
                    }
                    else {
                        message.info(json.message);
                    }
                }).catch(error => {
                    message.info(error.message || "发生未知错误");
                    util.clog(error);
                });
                util.clog(`[${name}] 签到完成`);
            },
            is_show_quick_comment: false,
            quickComment() {
                if (!this.loginStatus || !opts.comment.pathPattern.test(location.pathname)) return;
                if (Config.getConfig('loading_comment.enabled') === false) return;

                const _this = this;


                const onClick = (e) => {
                    if (_this.is_show_quick_comment) {
                        return;
                    }
                    e.preventDefault();

                    const mdEditor = document.querySelector('.md-editor');
                    const clientHeight = document.documentElement.clientHeight, clientWidth = document.documentElement.clientWidth;
                    const mdHeight = mdEditor.clientHeight, mdWidth = mdEditor.clientWidth;
                    const top = (clientHeight / 2) - (mdHeight / 2), left = (clientWidth / 2) - (mdWidth / 2);
                    //mdEditor.style.cssText = `position: fixed; top: ${top}px; left: ${left}px; margin: 30px 0px; width: 100%; max-width: ${mdWidth}px; z-index: 999;`;
                    mdEditor.style.cssText = `position: fixed; bottom: 0px; margin: 0px 0px; width: 100%; max-width: ${mdWidth}px; z-index: 999;`;
                    //                     const moveEl = mdEditor.querySelector('.tab-select.window_header');
                    //                     moveEl.style.cursor = "move";
                    //                     moveEl.addEventListener('mousedown', startDrag);
                    addEditorCloseButton();
                    _this.is_show_quick_comment = true;
                };
                const commentDiv = document.querySelector('#fast-nav-button-group #back-to-parent').cloneNode(true);
                commentDiv.id = 'back-to-comment';
                commentDiv.innerHTML = '<svg class="iconpark-icon" style="width: 24px; height: 24px;"><use href="#comments"></use></svg>';
                commentDiv.addEventListener("click", onClick);
                document.querySelector('#back-to-parent').before(commentDiv);
                document.querySelectorAll('.nsk-post .comment-menu,.comment-container .comments').forEach(x=>x.addEventListener("click",(event) =>{ if(!["引用", "回复", "编辑"].includes(event.target.textContent)) return; onClick(event);},true));//使用冒泡法给按钮引用、回复添加事件

                function addEditorCloseButton() {
                    const fullScreenToolbar = document.querySelector('#editor-body .window_header > :last-child');
                    const cloneToolbar = fullScreenToolbar.cloneNode(true);
                    cloneToolbar.setAttribute('title', '关闭');
                    cloneToolbar.querySelector('span').classList.replace('i-icon-full-screen-one', 'i-icon-close');
                    cloneToolbar.querySelector('span').innerHTML = '<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><path d="M8 8L40 40" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 40L40 8" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
                    cloneToolbar.addEventListener("click", function (e) {
                        const mdEditor = document.querySelector('.md-editor');
                        mdEditor.style = "";
                        const moveEl = mdEditor.querySelector('.tab-select.window_header');
                        moveEl.style.cursor = "";
                        moveEl.removeEventListener('mousedown', startDrag);

                        this.remove();
                        _this.is_show_quick_comment = false;
                    });
                    fullScreenToolbar.after(cloneToolbar);
                }
                function startDrag(event) {
                    if (event.button !== 0) return;

                    const draggableElement = document.querySelector('.md-editor');
                    const parentMarginTop = parseInt(window.getComputedStyle(draggableElement).marginTop);
                    const initialX = event.clientX - draggableElement.offsetLeft;
                    const initialY = event.clientY - draggableElement.offsetTop + parentMarginTop;
                    document.onmousemove = function (event) {
                        const newX = event.clientX - initialX;
                        const newY = event.clientY - initialY;
                        draggableElement.style.left = newX + 'px';
                        draggableElement.style.top = newY + 'px';
                    };
                    document.onmouseup = function () {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                }
            },
            // 切换官方打开链接设置
            async switchOpenPostInNewTab(stateName, states){
                try {
                    unsafeWindow.indexedDB.open('ns-preference-db').onsuccess = e => {
                        const db = e.target.result;
                        const store = db.transaction('ns-preference-store', 'readwrite').objectStore('ns-preference-store');
                        store.get('configuration').onsuccess = e => {
                            const cfg = e.target.result || { openPostInNewPage: false };
                            cfg.openPostInNewPage = !cfg.openPostInNewPage;
                            store.put(cfg, 'configuration');
                            Config.updateConfig(`${stateName}.enabled`, cfg.openPostInNewPage);
                            this.registerMenus();
                            unsafeWindow.mscAlert(`已${cfg.openPostInNewPage?'开启':'关闭'}新标签页打开链接`);
                        };
                    };
                } catch (error) {
                    console.error(error);
                }
            },
            //自动点击跳转页链接
            autoJump() {
                document.querySelectorAll('a[href*="/jump?to="]').forEach(link => {
                    try {
                        const urlObj = new URL(link.href);
                        const encodedUrl = urlObj.searchParams.get('to');
                        if (encodedUrl) {
                            const decodedUrl = decodeURIComponent(encodedUrl);
                            link.href = decodedUrl;
                        }
                    } catch (e) {
                        console.error('处理链接时出错:', e);
                    }
                });
                if (!/^\/jump/.test(location.pathname)) return;
                document.querySelector('.btn').click();
            },
            blockPost(ele) {
                ele = ele || document;
                ele.querySelectorAll('.post-title>a[href]').forEach(function (item) {
                    if (item.textContent.toLowerCase().includes("__keys__")) {
                        item.closest(".post-list-item").classList.add('blocked-post')
                    }
                });
            },
            blockPostsByViewLevel(ele) {
                ele = ele || document;
                let level=0;
                if (this.loginStatus) level = unsafeWindow.__config__.user.rank;
                [...ele.querySelectorAll('.post-list-item use[href="#lock"]')].forEach(el => {
                    const n = +el.closest('span')?.textContent.match(/\d+/)?.[0] || 0;
                    if (n > level) el.closest('.post-list-item')?.classList.add('blocked-post');
                });
            },
            //屏蔽用户
            blockMemberDOMInsert() {
                if (!this.loginStatus) return;

                const _this = this;
                Array.from(document.querySelectorAll(".post-list .post-list-item,.content-item")).forEach((function (t, n) {
                    var r = t.querySelector('.avatar-normal');
                    r.addEventListener("click", (function (n) {
                        n.preventDefault();
                        let intervalId = setInterval(async () => {
                            const userCard = document.querySelector('div.user-card.hover-user-card');
                            const pmButton = document.querySelector('div.user-card.hover-user-card a.btn');
                            if (userCard && pmButton) {
                                clearInterval(intervalId);
                                const dataVAttrs = util.getAttrsByPrefix(userCard, 'data-v');
                                const userName = userCard.querySelector('a.Username').textContent;
                                dataVAttrs.style = "float:left; background-color:rgba(0,0,0,.3)";
                                const blockBtn = util.createElement("a", {
                                    staticClass: "btn", attrs: dataVAttrs, on: {
                                        click: function (e) {
                                            e.preventDefault();
                                            unsafeWindow.mscConfirm(`确定要屏蔽“${userName}”吗？`, '你可以在本站的 设置=>屏蔽用户 中解除屏蔽', function () { blockMember(userName); })
                                        }
                                    }
                                }, ["屏蔽"]);
                                pmButton.after(blockBtn);
                            }
                        }, 50);
                    }))
                }))
                function blockMember(userName) {
                    util.post("/api/block-list/add", { "block_member_name": userName }, { "Content-Type": "application/json" }).then(function (data) {
                        if (data.success) {
                            let msg = '屏蔽用户【' + userName + '】成功！';
                            unsafeWindow.mscAlert(msg);
                            util.clog(msg);
                        } else {
                            let msg = '屏蔽用户【' + userName + '】失败！' + data.message;
                            unsafeWindow.mscAlert(msg);
                            util.clog(msg);
                        }
                    }).catch(function (err) {
                        util.clog(err);
                    });
                }
            },
            addImageSlide() {
                if (!opts.comment.pathPattern.test(location.pathname)) return;

                const posts = document.querySelectorAll('article.post-content');
                posts.forEach(function (post, i) {
                    const images = post.querySelectorAll('img:not(.sticker)');
                    if (images.length === 0) return;

                    images.forEach(function (image, i) {
                        const newImg = image.cloneNode(true);
                        image.parentNode.replaceChild(newImg, image);
                        newImg.addEventListener('click', function (e) {
                            e.preventDefault();
                            const imgArr = Array.from(post.querySelectorAll('img:not(.sticker)'));
                            const clickedIndex = imgArr.indexOf(this);
                            const photoData = imgArr.map((img, i) => ({ alt: img.alt, pid: i + 1, src: img.src }));
                            layer.photos({ photos: { "title": "图片预览", "start": clickedIndex, "data": photoData } });
                        }, true);
                    });
                });
            },
            addLevelTag() {//添加等级标签
                if (!this.loginStatus) return;
                if (!opts.comment.pathPattern.test(location.pathname)) return;
                let _this=this;
                this.getUserInfo(unsafeWindow.__config__.postData.op.uid).then((user) => {
                    let warningInfo = '';
                    const daysDiff = Math.floor((new Date() - new Date(user.created_at)) / (1000 * 60 * 60 * 24));
                    if (daysDiff < 30) {
                        warningInfo = `⚠️`;
                    }
                    console.log(user);
                    let rank = _this.getRankByCoin(user.coin);
                    const span = util.createElement("span", { staticClass: `nsk-badge role-tag user-level user-lv${rank}`, on: { mouseenter: function (e) { layer.tips(`注册 <span class="layui-badge">${daysDiff}</span> 天；帖子 ${user.nPost}；评论 ${user.nComment}`, this, { tips: 3, time: 0 }); }, mouseleave: function (e) { layer.closeAll(); } } }, [util.createElement("span", [`${warningInfo}Lv ${rank}`])]);

                    const authorLink = document.querySelector('#nsk-body .nsk-post .nsk-content-meta-info .author-info>a');
                    if (authorLink != null) {
                        authorLink.after(span);
                    }
                });
            },
            getUserInfo(uid) {
                return new Promise((resolve, reject) => {
                    util.get(`/api/account/getInfo/${uid}`, {}, 'json').then((data) => {
                        if (!data.success) {
                            util.clog(data);
                            return;
                        }
                        resolve(data.detail);
                    }).catch((err) => reject(err));
                })
            },
            getRankByCoin(coin){
                // 处理无效值：负数、NaN、undefined 都返回 0
                if (!coin || coin < 0) {
                    return 0;
                }
                return Math.floor(Math.sqrt(coin) / 10);
            },
            fakeLevel(){
                let coin = unsafeWindow.__config__.user.coin;
                if(coin < 4900) return;//不足7级直接返回
                let rank = this.getRankByCoin(coin);
                const userCard = document.querySelector(".user-card .user-stat");
                userCard.querySelector('use[href="#level"]').closest('svg').nextElementSibling.innerText='等级 Lv '+ rank;
            },
            userCardEx() {
                if (!this.loginStatus) return;
                if (!(opts.post.pathPattern.test(location.pathname)|| opts.comment.pathPattern.test(location.pathname))) return;

                const bn = new BroadcastManager("notification_sync");

                const updateNotificationElement = (element, href, iconHref, text, count) => {
                    element.querySelector("a").setAttribute("href", `${href}`);
                    element.querySelector("a > svg > use").setAttribute("href", `${iconHref}`);
                    element.querySelector("a > :nth-child(2)").textContent = `${text} `;
                    element.querySelector("a > :last-child").textContent = count;
                    const countEl = element.querySelector("a > :last-child");
                    countEl.classList.toggle("notify-count", count > 0);

                    // 通知
                    if (count > 0 && bn.active) {
                        return;
                        GM_notification({
                            text: `你有 ${count} 条新 ${text === '我' ? '@' : text}，点击查看`,
                            tag: 'notice_count',
                            onclick: e => (e.preventDefault(), GM_openInTab(`${BASE_URL}${href}`, {active: true}))
                        });
                    }

                    return element;
                };

                const userCard = document.querySelector(".user-card .user-stat");
                const lastElement = userCard.querySelector(".stat-block:first-child > :last-child");

                const atMeElement = lastElement.cloneNode(true);
                const msgElement = lastElement.cloneNode(true);

                lastElement.after(atMeElement);
                userCard.querySelector(".stat-block:last-child").append(msgElement);

                // 初始化通知显示
                const updateAllCounts = (counts) => {
                    updateNotificationElement(atMeElement, "/notification#/atMe", "#at-sign", "我", counts.atMe);
                    updateNotificationElement(msgElement, "/notification#/message?mode=list", "#envelope-one", "私信", counts.message);
                    updateNotificationElement(lastElement, "/notification#/reply", "#remind-6nce9p47", "回复", counts.reply);
                };

                // 注册数据接收器
                bn.registerReceiver(({ sender, data }) => {
                    if (data.type === 'unreadCount' && data.counts) {
                        console.log(`接收到来自 ${sender} 的广播数据：${JSON.stringify(data.counts)}`, new Date(data.timestamp).toLocaleString());
                        updateAllCounts(data.counts);
                    }
                });

                // 首次加载
                bn.broadcast({ type: 'unreadCount', counts: unsafeWindow.__config__.user.unViewedCount, timestamp: Date.now() });

                let interval = 5000;
                // 启动定时任务（只在主控标签页执行）
                bn.startTask(async () => {
                    const response = await fetch("/api/notification/unread-count", { credentials: "include" });

                    if (!response.ok) throw new Error(response.status);

                    const data = await response.json();
                    if (data.success && data.unreadCount) {
                        console.log(`${bn.myId} 发送一条广播数据：${JSON.stringify(data.unreadCount)}`);
                        return {
                            type: 'unreadCount',
                            counts: data.unreadCount,
                            timestamp: Date.now()
                        };
                    }
                    throw new Error('Invalid response');
                }, interval);
            },
            // 自动翻页
            autoLoading() {
                if (Config.getConfig('loading_post.enabled') === false && Config.getConfig('loading_comment.enabled') === false) return;
                let opt = {};
                if (opts.post.pathPattern.test(location.pathname)) { opt = opts.post; }
                else if (opts.comment.pathPattern.test(location.pathname)) { opt = opts.comment; }
                else { return; }
                let is_requesting = false;
                let _this = this;
                this.windowScroll(function (direction, e) {
                    if (direction === 'down') { // 下滑才准备翻页
                        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
                        if (document.documentElement.scrollHeight <= document.documentElement.clientHeight + scrollTop + opt.scrollThreshold && !is_requesting) {
                            if (!document.querySelector(opt.nextPagerSelector)) return;
                            let nextUrl = document.querySelector(opt.nextPagerSelector).attributes.href.value;
                            is_requesting = true;
                            util.get(nextUrl, {}, 'text').then(function (data) {
                                let doc = new DOMParser().parseFromString(data, "text/html");
                                _this.blockPost(doc);//过滤帖子
                                _this.blockPostsByViewLevel(doc);
                                if (opts.comment.pathPattern.test(location.pathname)){
                                    // 取加载页的评论数据追加到原评论数据
                                    let el = doc.getElementById('temp-script')
                                    let jsonText = el.textContent;
                                    if (jsonText) {
                                        let conf = JSON.parse(util.b64DecodeUnicode(jsonText))
                                        unsafeWindow.__config__.postData.comments.push(...conf.postData.comments);
                                    }
                                }
                                document.querySelector(opt.postListSelector).append(...doc.querySelector(opt.postListSelector).childNodes);
                                document.querySelector(opt.topPagerSelector).innerHTML = doc.querySelector(opt.topPagerSelector).innerHTML;
                                document.querySelector(opt.bottomPagerSelector).innerHTML = doc.querySelector(opt.bottomPagerSelector).innerHTML;
                                history.pushState(null, null, nextUrl);
                                // 评论菜单条
                                if (opts.comment.pathPattern.test(location.pathname)){
                                    const vue = document.querySelector('.comment-menu').__vue__;
                                    Array.from(document.querySelectorAll(".content-item")).forEach(function (t,e) {
                                        var n = t.querySelector(".comment-menu-mount");
                                        if(!n) return;
                                        let o = new vue.$root.constructor(vue.$options);
                                        o.setIndex(e);
                                        o.$mount(n);
                                    });
                                }
                                is_requesting = false;
                            }).catch(function (err) {
                                is_requesting = false;
                                util.clog(err);
                            });
                        }
                    }
                });
            },
            // 滚动条事件
            windowScroll(fn1) {
                let beforeScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
                    fn = fn1 || function () { };
                setTimeout(function () { // 延时执行，避免刚载入到页面就触发翻页事件
                    window.addEventListener('scroll', function (e) {
                        const afterScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
                              delta = afterScrollTop - beforeScrollTop;
                        if (delta == 0) return false;
                        fn(delta > 0 ? 'down' : 'up', e);
                        beforeScrollTop = afterScrollTop;
                    }, false);
                }, 1000)
            },
            // 平滑滚动
            smoothScroll(){
                const scroll = (selector, top = 0) => {
                    const btn = document.querySelector(selector);
                    if (btn) {
                        // 移除现有事件监听器
                        btn.onclick = null;
                        btn.removeAttribute('onclick');
                        // 添加新的事件处理器
                        btn.addEventListener('click', e => {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            if(e.target.querySelector('use[href="#down"]')){
                                top = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
                            }
                            window.scrollTo({ top, behavior: 'smooth' });
                        }, true);
                    }
                };
                scroll('#back-to-top', 0);
                scroll('#back-to-bottom');
            },            
            history: ()=>{
                const STORAGE_KEY = 'nsx_browsing_history';
                const PAGE_SIZE = 10;
                let saveLimit = 'all';

                const POST_URL_PATTERN = /\/post-(\d+)-\d+.*$/;
                const getCurrentTime = () => layui.util.toDateString(new Date(),"yyyy-MM-ddTHH:mm:ss.SSS");

                const getBrowsingHistory = () => {
                    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                };

                const saveBrowsingHistory = (history) => {
                    if (saveLimit !== 'all') {
                        history = history.slice(-saveLimit);
                    }
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
                };

                const addOrUpdateHistory = (url, title) => {
                    const match = url.match(POST_URL_PATTERN);
                    if (!match) return; // 只保存匹配的帖子记录

                    const normalizedUrl = `/post-${match[1]}-1`; // 只判断第1页，即不区分页码
                    const history = getBrowsingHistory();
                    const index = history.findIndex(item => item.url === normalizedUrl);
                    const entry = { url: normalizedUrl, title, time: getCurrentTime() };
                    if (index > -1) {
                        history[index] = entry;
                    }
                    else {
                        history.push(entry);
                    }
                    saveBrowsingHistory(history);
                };

                const getHistory = (page = 1) => {
                    const history = getBrowsingHistory();
                    const totalPages = Math.ceil(history.length / PAGE_SIZE);
                    const sortedData = history.sort((a, b) => new Date(b.time) - new Date(a.time));
                    if(page===0) return sortedData;
                    return sortedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
                };

                const showHistory = (page = 1) => {
                    const history = getBrowsingHistory();
                    const totalPages = Math.ceil(history.length / PAGE_SIZE);
                    const pageHistory = history.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
                    console.clear();
                    console.log(`浏览历史 - 第 ${page} 页，共 ${totalPages} 页`);
                    pageHistory.forEach((item, i) => {
                        console.log(`${(page - 1) * PAGE_SIZE + i + 1}. [${item.time}] ${item.title} - ${item.url}`);
                    });
                    if (page < totalPages) {
                        console.log(`输入 showHistory(${page + 1}) 查看下一页`);
                    }
                };

                const setSaveLimit = (limit) => {
                    if (typeof limit === 'number' && limit > 0 || limit === 'all') {
                        saveLimit = limit;
                        console.log(`保存限制已设置为：${limit === 'all' ? '全部' : `最近 ${limit} 条`}`);
                    }
                    else {
                        console.error('无效的保存限制。请输入正整数或 "all"');
                    }
                };

                const injectDom=()=>{
                    const svg = util.createElement("svg", { staticClass: "iconpark-icon", attrs: { "style": "width: 17px;height: 17px;" }},[ util.createElement("use",{ attrs: { "href": "#history"} }, [], document, "http://www.w3.org/2000/svg") ], document, "http://www.w3.org/2000/svg");
                    const originalSwitcher = document.querySelector('#nsk-head .color-theme-switcher');
                    if (originalSwitcher) {
                        const svgWrap = originalSwitcher.cloneNode();
                        svgWrap.classList.replace('color-theme-switcher', 'history-dropdown-on');
                        svgWrap.setAttribute('lay-options', '{trigger:"hover"}');

                        // 判断是否为移动端（li 元素）并移除 SVG 的 style 属性
                        if (originalSwitcher.tagName.toLowerCase() === 'li') {
                            svg.removeAttribute('style');
                        }

                        svgWrap.appendChild(svg);
                        originalSwitcher.insertAdjacentElement('beforebegin', svgWrap);
                    }

                    const history=getHistory(0);
                    const maxLength=20;
                    // 按天分组
                    const grouped = history.reduce((result, item, i) => {
                        const date = item.time.split("T")[0];
                        if (!result[date]) {
                            result[date] = [];
                        }
                        const truncatedTitle = item.title.length > maxLength
                        ? item.title.slice(0, maxLength) + "..."
                        : item.title;
                        result[date].push({
                            id: 1000+i+1,
                            title: `${truncatedTitle}(${layui.util.toDateString(item.time,'HH:mm')})`,
                            href: item.url,
                            time: item.time
                        });
                        return result;
                    }, {});

                    // 转换为目标结构
                    const result = Object.entries(grouped).map(([day, items], index) => ({
                        id: index + 1,
                        title: day,
                        type: "group",
                        child: items // 将子项包裹在数组中
                    }));

                    // console.log(result);

                    dropdown.render({
                        elem: '.history-dropdown-on',
                        // trigger: 'click' // trigger 已配置在元素 `lay-options` 属性上
                        data: result,
                        style: 'width: 370px; height: 200px;'
                    });
                };

                addOrUpdateHistory(window.location.href, document.title);
                injectDom();
            },
            initInstantPage:() => {
                const prefetchedUrls = new Set(); // 用于存储已经尝试预加载的 URL
                let prefetcher = document.createElement('link');
                prefetcher.rel = 'prefetch';

                document.body.addEventListener('mouseover', (event) => {
                    const target = event.target.closest('a');

                    if (!target || !target.href || target.hasAttribute('data-no-instant')) {
                        return;
                    }

                    const href = target.href;

                    if (!href.startsWith(`${BASE_URL}/post-`)) {
                        return;
                    }

                    if (prefetchedUrls.has(href)) {
                        console.log('跳过已预加载链接：', href);
                        return;
                    }

                    setTimeout(() => {
                        if (target.matches(':hover')) {
                            prefetcher.href = href;
                            document.head.appendChild(prefetcher);
                            prefetchedUrls.add(href);
                            console.log('预加载链接已启动：', href);
                        }
                    }, 65); // 65毫秒延迟
                });
            },
            switchMultiState(stateName, states) {//多态顺序切换
                // 处理不同类型的菜单配置
                if (stateName === 'sign_in') {
                    let currState = Config.getConfig(`sign_in.${opts.curSite.code}.method`);
                    currState = (currState + 1) % states.length;
                    Config.updateConfig(`sign_in.${opts.curSite.code}.enabled`, currState !== 0);
                    Config.updateConfig(`sign_in.${opts.curSite.code}.method`, currState);
                } else if (stateName === 'loading_post') {
                    let currState = Config.getConfig('loading_post.enabled');
                    Config.updateConfig('loading_post.enabled', !currState);
                    Config.updateConfig('loading_comment.enabled', !currState);
                } else {
                    // 通用切换
                    let currState = Config.getConfig(`${stateName}.enabled`);
                    Config.updateConfig(`${stateName}.enabled`, !currState);
                }
                this.registerMenus();
            },
            getMenuStateText(menu, stateVal) {
                return `${menu.states[stateVal].s1} ${menu.text}（${menu.states[stateVal].s2}）`;
            },
            _menus: [
                { name: 'sign_in', callback: (name, states) => main.switchMultiState(name, states), accessKey: '', text: '自动签到', states: [{ s1: '❌', s2: '关闭' }, { s1: '🎲', s2: '随机🍗' }, { s1: '📌', s2: '5个🍗' }] },
                { name: 're_sign_in', callback: (name, states) => main.reSignIn(), accessKey: '', text: '🔂 重试签到', states: [] },
                { name: 'loading_post', callback: (name, states) => main.switchMultiState(name, states), accessKey: '', text: '下拉加载翻页', states: [{ s1: '❌', s2: '关闭' }, { s1: '✅', s2: '开启' }] },
                { name: 'open_post_in_new_tab', callback: (name, states) => main.switchOpenPostInNewTab(name, states), accessKey: '', text: '新标签页打开帖子', states: [{ s1: '❌', s2: '关闭' }, { s1: '✅', s2: '开启' }]},
                { name: 'advanced_settings', callback: (name, states) => main.advancedSettings(), accessKey: '', text: '⚙️ 高级设置', states: [] },
                { name: 'feedback', callback: (name, states) => GM_openInTab('https://greasyfork.org/zh-CN/scripts/479426/feedback', { active: true, insert: true, setParent: true }), accessKey: '', text: '💬 反馈 & 建议', states: [] }
            ],
            _menuIds: [],
            registerMenus() {
                this._menuIds.forEach(function (id) {
                    GM_unregisterMenuCommand(id);
                });
                this._menuIds = [];

                const _this = this;
                this._menus.forEach(function (menu) {
                    let k = menu.text;
                    if (menu.states.length > 0) {
                        let stateVal = 0;
                        if (menu.name === 'sign_in') {
                            stateVal = Config.getConfig(`sign_in.${opts.curSite.code}.method`);
                        } else {
                            stateVal = Config.getConfig(`${menu.name}.enabled`) === false ? 0 : 1;
                        }
                        k = _this.getMenuStateText(menu, stateVal);
                    }
                    let autoClose = menu.hasOwnProperty('autoClose') ? menu.autoClose : true;
                    let menuId = GM_registerMenuCommand(k, function () { menu.callback(menu.name, menu.states) }, { autoClose: autoClose });
                    menuId = menuId || k;
                    _this._menuIds.push(menuId);
                });
            },
            advancedSettings() {
                let layerWidth = layui.device().mobile ? '100%' : '620px';
                layer.open({
                    type: 1,
                    offset: 'r',
                    anim: 'slideLeft', // 从右往左
                    area: [layerWidth, '100%'],
                    scrollbar: false,
                    shade: 0.1,
                    shadeClose: false,
                    btn: ["保存设置"],
                    btnAlign: 'r',
                    title: 'NodeSeek X 设置',
                    id: 'setting-layer-direction-r',
                    content: `<div class="layui-row" style="display:flex;height:100%">
  <div class="layui-panel layui-col-xs3 layui-col-sm3 layui-col-md3" id="demo-menu">
    <ul class="layui-menu" lay-filter="demo"></ul>
  </div>
  <div class="layui-col-xs9 layui-col-sm9 layui-col-md9" style="overflow-y: auto; padding-left: 10px" id="demo-content">
    <fieldset id="group1" class="layui-elem-field layui-field-title">
      <legend>基本设置</legend>
    </fieldset>
    <div style="height: 500px;">Content for Group 1</div>
    <fieldset id="group2" class="layui-elem-field layui-field-title">
      <legend>扩展设置</legend>
    </fieldset>
    <div style="height: 500px;">Content for Group 2</div>
    <fieldset id="group3" class="layui-elem-field layui-field-title">
      <legend>实验设置</legend>
    </fieldset>
    <div style="height: 500px;">Content for Group 3</div>
  </div>
</div>
<script>
  document.querySelectorAll('#demo-content > fieldset').forEach(function (el, i) {
    let li = document.createElement('li');
    if (i === 0) li.classList = 'layui-menu-item-checked';
    let div = document.createElement('div');
    div.classList = 'layui-menu-body-title';
    let a = document.createElement('a');
    a.href = '#' + el.id;
    a.textContent = el.textContent;
    a.addEventListener('click', aClick);
    li.append(div);
    div.append(a);
    document.querySelector('#demo-menu>ul').append(li);
  });
  const docContent = document.querySelector('#demo-content');
  docContent.addEventListener('scroll', function (e) {
    var scrollPos = docContent.scrollTop;
    console.log(scrollPos);
    docContent.querySelectorAll('fieldset').forEach(function (el) {
      var topPos = el.offsetTop - 10;
      if (scrollPos >= topPos) {
        var id = el.getAttribute('id');
        document.querySelectorAll('.layui-menu > li.layui-menu-item-checked').forEach(function (navItem) {
          navItem.classList.remove('layui-menu-item-checked');
        });
        var navItem = document.querySelector('.layui-menu > li a[href="#' + id + '"]').closest('li');
        navItem.classList.add('layui-menu-item-checked');
      }
    });
  });
  function aClick(e) {
    e.preventDefault();
    var id = this.getAttribute('href');
    var target = document.querySelector(id);
    docContent.scrollTo({
      top: target.offsetTop - 10,
//       behavior: 'smooth'
    });
  }
<\/script>`,
                    yes: function(index, layero, that){
                        layer.msg('111');
                        layer.close(index); // 关闭弹层
                    }
                });
            },
            addCodeHighlight() {
                const codes = document.querySelectorAll(".post-content pre code");
                if (codes) {
                    codes.forEach(function (code) {
                        const copyBtn = util.createElement("span", { staticClass: "copy-code", attrs: { title: "复制代码" }, on: { click: copyCode } }, [util.createElement("svg", { staticClass: 'iconpark-icon' }, [util.createElement("use", { attrs: { href: "#copy" } }, [], document, "http://www.w3.org/2000/svg")], document, "http://www.w3.org/2000/svg")]);
                        code.after(copyBtn);
                    });
                }
                function copyCode(e) {
                    const pre = this.closest('pre');
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(pre.querySelector("code"));
                    selection.removeAllRanges();
                    selection.addRange(range);
                    document.execCommand('copy');
                    selection.removeAllRanges();
                    updateCopyButton(this);
                    layer.tips(`复制成功`, this, { tips: 4, time: 1000 })
                }
                function updateCopyButton(ele) {
                    ele.querySelector("use").setAttribute("href", "#check");
                    util.sleep(1000).then(() => ele.querySelector("use").setAttribute("href", "#copy"));
                }
            },
            addPluginStyle() {
                let style = `
                :root { --link-visited-color: #afb9c1 }
                body.dark-layout { --link-visited-color: #393f4e; }
            .nsplus-tip { background-color: rgba(255, 217, 0, 0.8); border: 0px solid black;  padding: 3px; text-align: center;animation: blink 5s cubic-bezier(.68,.05,.46,.96) infinite;}
            /* @keyframes blink{ 0%{background-color: red;} 25%{background-color: yellow;} 50%{background-color: blue;} 75%{background-color: green;} 100%{background-color: red;} } */
            .nsplus-tip p,.nsplus-tip p a { color: #f00 }
            .nsplus-tip p a:hover {color: #0ff}
            #back-to-comment{display:flex;}
            #fast-nav-button-group .nav-item-btn:nth-last-child(4){bottom:120px;}

            header div.history-dropdown-on { color: var(--link-hover-color); cursor: pointer; padding: 0 5px; position: absolute; right: 50px}

            .post-list .post-title a:visited{color:var(--link-visited-color)}

            /* Lv0 - Lv2: 灰到橙 */
            .role-tag.user-level.user-lv0 {background-color: #c7c2c2; border: 1px solid #c7c2c2; color: #fafafa;}
            .role-tag.user-level.user-lv1 {background-color: #ffb74d; border: 1px solid #ffb74d; color: #fafafa;}
            .role-tag.user-level.user-lv2 {background-color: #ff9400; border: 1px solid #ff9400; color: #fafafa;}
            /* Lv3 - Lv4: 红到深红 */
            .role-tag.user-level.user-lv3 {background-color: #ff5252; border: 1px solid #ff5252; color: #fafafa;}
            .role-tag.user-level.user-lv4 {background-color: #e53935; border: 1px solid #e53935; color: #fafafa;}
            /* Lv5 - Lv6: 紫到深紫 */
            .role-tag.user-level.user-lv5 {background-color: #ab47bc; border: 1px solid #ab47bc; color: #fafafa;}
            .role-tag.user-level.user-lv6 {background-color: #8e24aa; border: 1px solid #8e24aa; color: #fafafa;}
            /* Lv7 - Lv8: 蓝到深蓝 */
            .role-tag.user-level.user-lv7 {background-color: #42a5f5; border: 1px solid #42a5f5; color: #fafafa;}
            .role-tag.user-level.user-lv8 {background-color: #1e88e5; border: 1px solid #1e88e5; color: #fafafa;}
            /* Lv9 - Lv10: 绿到深绿 */
            .role-tag.user-level.user-lv9 {background-color: #66bb6a; border: 1px solid #66bb6a; color: #fafafa;}
            .role-tag.user-level.user-lv10 {background-color: #2e7d32; border: 1px solid #2e7d32; color: #fafafa;}
            /* Lv11 - Lv12: 金橙到深金橙 */
            .role-tag.user-level.user-lv11 {background-color: #ffca28; border: 1px solid #ffca28; color: #fafafa;}
            .role-tag.user-level.user-lv12 {background-color: #ffb300; border: 1px solid #ffb300; color: #fafafa;}
            /* Lv13 - Lv14: 紫金到深紫金 */
            .role-tag.user-level.user-lv13 {background-color: #b388ff; border: 1px solid #b388ff; color: #fafafa;}
            .role-tag.user-level.user-lv14 {background-color: #7c4dff; border: 1px solid #7c4dff; color: #fafafa;}
            /* Lv15: 黑金至尊 */
            .role-tag.user-level.user-lv15 {background-color: #000000; border: 1px solid #000000; color: #ffd700;}

            .post-content pre { position: relative; }
            .post-content pre span.copy-code { position: absolute; right: .5em; top: .5em; cursor: pointer;color: #c1c7cd;  }
            .post-content pre .iconpark-icon {width:16px;height:16px;margin:3px;}
            .post-content pre .iconpark-icon:hover {color:var(--link-hover-color)}
            .dark-layout .post-content pre code.hljs { padding: 1em !important; }
`;
                if (document.head) {
                    util.addStyle('nsplus-style', 'style', style);
                    util.addStyle('layui-style', 'link', 'https://s.cfn.pp.ua/layui/2.9.9/css/layui.css');
                    util.addStyle('hightlight-style', 'link', GM_getResourceURL("highlightStyle"));
                }
            },
            addPluginScript() {
                GM_addElement(document.body, 'script', {
                    src: 'https://s4.zstatic.net/ajax/libs/highlight.js/11.9.0/highlight.min.js'
                });
                GM_addElement(document.body, 'script', {
                    textContent: 'window.onload = function(){hljs.highlightAll();}'
                });
                GM_addElement(document.body, "script", { textContent: `!function(e){var t,n,d,o,i,a,r='<svg><symbol id="envelope-one" viewBox="0 0 48 48" fill="none"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M36 16V8H4v24h8" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-width="4" stroke="currentColor" d="M12 40h32V16H12v24Z" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="m12 16 16 12 16-12" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M32 16H12v15" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M44 31V16H24" data-follow-stroke="currentColor"/></symbol><symbol id="at-sign" viewBox="0 0 48 48" fill="none"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M44 24c0-11.046-8.954-20-20-20S4 12.954 4 24s8.954 20 20 20v0c4.989 0 9.55-1.827 13.054-4.847" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-width="4" stroke="currentColor" d="M24 32a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M32 24a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6m-12 1v-9" data-follow-stroke="currentColor"/></symbol><symbol id="copy" viewBox="0 0 48 48" fill="none"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M13 12.432v-4.62A2.813 2.813 0 0 1 15.813 5h24.374A2.813 2.813 0 0 1 43 7.813v24.375A2.813 2.813 0 0 1 40.187 35h-4.67" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-width="4" stroke="currentColor" d="M32.188 13H7.811A2.813 2.813 0 0 0 5 15.813v24.374A2.813 2.813 0 0 0 7.813 43h24.375A2.813 2.813 0 0 0 35 40.187V15.814A2.813 2.813 0 0 0 32.187 13Z" data-follow-stroke="currentColor"/></symbol><symbol id="history" viewBox="0 0 48 48" fill="none"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M5.818 6.727V14h7.273" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="M4 24c0 11.046 8.954 20 20 20v0c11.046 0 20-8.954 20-20S35.046 4 24 4c-7.402 0-13.865 4.021-17.323 9.998" data-follow-stroke="currentColor"/><path stroke-linejoin="round" stroke-linecap="round" stroke-width="4" stroke="currentColor" d="m24.005 12-.001 12.009 8.48 8.48" data-follow-stroke="currentColor"/></symbol></svg>';function c(){i||(i=!0,d())}t=function(){var e,t,n;(n=document.createElement("div")).innerHTML=r,r=null,(t=n.getElementsByTagName("svg")[0])&&(t.setAttribute("aria-hidden","true"),t.style.position="absolute",t.style.width=0,t.style.height=0,t.style.overflow="hidden",e=t,(n=document.body).firstChild?(t=n.firstChild).parentNode.insertBefore(e,t):n.appendChild(e))},document.addEventListener?["complete","loaded","interactive"].indexOf(document.readyState)>-1?setTimeout(t,0):(n=function(){document.removeEventListener("DOMContentLoaded",n,!1),t()},document.addEventListener("DOMContentLoaded",n,!1)):document.attachEvent&&(d=t,o=e.document,i=!1,(a=function(){try{o.documentElement.doScroll("left")}catch(e){return void setTimeout(a,50)}c()})(),o.onreadystatechange=function(){"complete"==o.readyState&&(o.onreadystatechange=null,c())})}(window);` });
            },
            darkMode(){
                // 选择要监视的目标元素（body元素）
                const targetNode = document.querySelector('body');
                // 进入页面时判断是否是深色模式
                if(targetNode.classList.contains('dark-layout')){
                    util.addStyle('layuicss-theme-dark','link','https://s.cfn.pp.ua/layui/theme-dark/2.9.7/css/layui-theme-dark.css');
                    util.removeStyle('hightlight-style');
                    util.addStyle('hightlight-style', 'link', GM_getResourceURL("highlightStyle_dark"));
                }

                // 配置MutationObserver的选项
                const observerConfig = {
                    attributes: true, // 监视属性变化
                    attributeFilter: ['class'], // 只监视类属性
                };

                // 创建一个新的MutationObserver，并指定触发变化时的回调函数
                const observer = new MutationObserver((mutationsList, observer) => {
                    for(let mutation of mutationsList) {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            if(targetNode.classList.contains('dark-layout')){
                                util.addStyle('layuicss-theme-dark','link','https://s.cfn.pp.ua/layui/theme-dark/2.9.7/css/layui-theme-dark.css');
                                util.removeStyle('hightlight-style');
                                util.addStyle('hightlight-style', 'link', GM_getResourceURL("highlightStyle_dark"));
                            }else{
                                util.removeStyle('layuicss-theme-dark');
                                util.removeStyle('hightlight-style');
                                util.addStyle('hightlight-style', 'link', GM_getResourceURL("highlightStyle"));
                            }
                        }
                    }
                });

                // 使用给定的配置选项开始观察目标节点
                observer.observe(targetNode, observerConfig);
            },
            callout(){
                if (!opts.comment.pathPattern.test(location.pathname) && !(/^\/new-discussion/.test(location.pathname))) return;
                
                const CSS = `
.post-content blockquote{border-left: none;border-radius: 4px;box-shadow: inset 4px 0 0 0 rgba(0, 0, 0, .1);}
.callout{--c:8,109,221;overflow:hidden;border-radius:4px;margin:1em;background:rgba(var(--c),.1);padding:12px 12px 12px 24px!important;box-shadow:inset 4px 0 0 0 rgba(var(--c),.5)}
.callout.is-collapsible .callout-title{cursor:pointer}
.callout-title{display:flex;gap:4px;color:rgb(var(--c));line-height:1.3;align-items:flex-start}
.callout-content{overflow-x:auto}.callout-content .callout{margin-top:20px}
.callout-icon{flex:0 0 auto;display:flex;align-items:center}
.callout-icon .svg-icon,.callout-fold .svg-icon{color:rgb(var(--c));height:18px;width:18px}
.callout-title-inner{font-weight:600}
.callout-fold{display:flex;align-items:center;padding-inline-end:8px}
.callout-fold .svg-icon{transition:transform .1s}
.callout-fold.is-collapsed .svg-icon{transform:rotate(-90deg)}
.callout.is-collapsed .callout-content{display:none}
.callout[data-callout="abstract"],.callout[data-callout="summary"],.callout[data-callout="tldr"]{--c:83,223,221}
.callout[data-callout="info"],.callout[data-callout="todo"]{--c:8,109,221}
.callout[data-callout="tip"],.callout[data-callout="hint"],.callout[data-callout="important"]{--c:83,223,221}
.callout[data-callout="success"],.callout[data-callout="check"],.callout[data-callout="done"]{--c:68,207,110}
.callout[data-callout="question"],.callout[data-callout="help"],.callout[data-callout="faq"]{--c:236,117,0}
.callout[data-callout="warning"],.callout[data-callout="caution"],.callout[data-callout="attention"]{--c:236,117,0}
.callout[data-callout="failure"],.callout[data-callout="fail"],.callout[data-callout="missing"]{--c:233,49,71}
.callout[data-callout="danger"],.callout[data-callout="error"]{--c:233,49,71}
.callout[data-callout="bug"]{--c:233,49,71}
.callout[data-callout="example"]{--c:120,82,238}
.callout[data-callout="quote"],.callout[data-callout="cite"]{--c:158,158,158}
.callout-inserter-wrapper{position:relative;display:inline-flex;align-items:center}
.callout-inserter-btn{padding:0;border:none;background:0 0;cursor:pointer;display:flex;color:currentColor}
.callout-inserter-btn:hover{opacity:.7}
.callout-inserter-dropdown{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:8px;background:#fff;border:1px solid #e0e0e0;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.15);z-index:1000;min-width:140px;display:none;overflow:hidden}
.callout-inserter-dropdown.show{display:block}
.callout-inserter-item{padding:8px 12px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:13px;transition:background .15s}
.callout-inserter-item:hover{background:#f5f5f5}
.callout-inserter-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
@media(prefers-color-scheme:dark){.callout-inserter-dropdown{background:#2d2d2d;border-color:#444}.callout-inserter-item{color:#ddd}.callout-inserter-item:hover{background:#3d3d3d}}`;

                const ICONS = {
                    note: 'M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5zm-6.17-1.81 4 4',
                    abstract: 'M8 2h8v4H8zM16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01',
                    info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 14v-4m0-4h.01',
                    todo: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-3 10 2 2 4-4',
                    tip: 'M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4',
                    success: 'M20 6 9 17l-5-5',
                    question: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01',
                    warning: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4m0 4h.01',
                    failure: 'M18 6 6 18M6 6l12 12',
                    danger: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z',
                    bug: 'M12 20v-9m2-6a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4zM14.12 3.88 16 2M8 2l1.88 1.88M9 7.13V6a3 3 0 1 1 6 0v1.13',
                    example: 'M3 5h.01M3 12h.01M3 19h.01M8 5h13M8 12h13M8 19h13',
                    quote: 'M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2zM5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z',
                    fold: 'm6 9 6 6 6-6'
                };

                const TYPE_MAP = {
                    summary:'abstract',tldr:'abstract',hint:'tip',important:'tip',check:'success',done:'success',
                    help:'question',faq:'question',caution:'warning',attention:'warning',
                    fail:'failure',missing:'failure',error:'danger',cite:'quote'
                };

                const MENU_TYPES = [
                    { k: 'note', n: '笔记', c: '8,109,221', show: 1 },
                    { k: 'abstract', n: '摘要', c: '83,223,221', show: 1 },
                    { k: 'summary', n: '总结', c: '83,223,221' },
                    { k: 'tldr', n: 'TL;DR', c: '83,223,221' },
                    { k: 'info', n: '信息', c: '8,109,221', show: 1 },
                    { k: 'todo', n: '待办', c: '8,109,221', show: 1 },
                    { k: 'tip', n: '提示', c: '83,223,221', show: 1 },
                    { k: 'hint', n: '线索', c: '83,223,221' },
                    { k: 'important', n: '重要', c: '83,223,221', show: 1 },
                    { k: 'success', n: '成功', c: '68,207,110', show: 1 },
                    { k: 'check', n: '检查', c: '68,207,110' },
                    { k: 'done', n: '完成', c: '68,207,110' },
                    { k: 'question', n: '问题', c: '236,117,0', show: 1 },
                    { k: 'help', n: '帮助', c: '236,117,0' },
                    { k: 'faq', n: 'FAQ', c: '236,117,0' },
                    { k: 'warning', n: '警告', c: '236,117,0', show: 1 },
                    { k: 'caution', n: '注意', c: '236,117,0' },
                    { k: 'attention', n: '注意', c: '236,117,0' },
                    { k: 'failure', n: '失败', c: '233,49,71', show: 1 },
                    { k: 'fail', n: '失败', c: '233,49,71' },
                    { k: 'missing', n: '缺失', c: '233,49,71' },
                    { k: 'danger', n: '危险', c: '233,49,71', show: 1 },
                    { k: 'error', n: '错误', c: '233,49,71' },
                    { k: 'bug', n: 'Bug', c: '233,49,71', show: 1 },
                    { k: 'example', n: '示例', c: '120,82,238', show: 1 },
                    { k: 'quote', n: '引用', c: '158,158,158' },
                    { k: 'cite', n: '引述', c: '158,158,158' }
                ];

                const $ = (s, p = document) => p.querySelector(s);
                const $$ = (s, p = document) => p.querySelectorAll(s);
                const el = (t, c, h) => { const e = document.createElement(t); if(c) e.className = c; if(h) e.innerHTML = h; return e; };
                const svg = d => `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon"><path d="${d}"/></svg>`;
                const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
                const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
                const getVAttr = e => e && [...e.attributes].find(a => a.name.startsWith('data-v-'))?.name;
                const RE = /^\[!(\w+)\]([+-])?(?:\s+([^<\n]+))?(?:<br\s*\/?>)?([\s\S]*)$/i;

                function render(bq) {
                    if (bq.classList.contains('oc-done')) return;
                    bq.classList.add('oc-done');
                    bq.querySelectorAll(':scope > blockquote').forEach(render);

                    const p = bq.querySelector(':scope > p');
                    const m = (p?.innerHTML.trim() || '').match(RE);
                    if (!m) return;

                    const [, type, fold, title, content] = m;
                    const t = type.toLowerCase();
                    const base = TYPE_MAP[t] || t;
                    const icon = ICONS[base] || ICONS.note;
                    const isCollapsible = fold === '+' || fold === '-';
                    const isCollapsed = fold === '-';

                    const wrap = el('div', `callout ${isCollapsible ? 'is-collapsible' : ''} ${isCollapsed ? 'is-collapsed' : ''}`);
                    wrap.dataset.callout = t;

                    const titleEl = el('div', 'callout-title');
                    titleEl.appendChild(el('div', 'callout-icon', svg(icon)));
                    titleEl.appendChild(el('div', 'callout-title-inner', title?.trim() || cap(type)));

                    if (isCollapsible) {
                        const foldEl = el('div', `callout-fold ${isCollapsed ? 'is-collapsed' : ''}`, svg(ICONS.fold));
                        titleEl.appendChild(foldEl);
                        titleEl.onclick = e => { if (!e.target.closest('a,button')) { wrap.classList.toggle('is-collapsed'); foldEl.classList.toggle('is-collapsed'); } };
                    }
                    wrap.appendChild(titleEl);

                    const cont = el('div', 'callout-content');
                    if (content?.trim()) cont.appendChild(el('p', '', content.trim()));

                    // Move all siblings after the first p into content
                    let sibling = p.nextSibling;
                    while (sibling) {
                        const next = sibling.nextSibling;
                        cont.appendChild(sibling);
                        sibling = next;
                    }

                    if (cont.childNodes.length) wrap.appendChild(cont);

                    bq.replaceWith(wrap);
                }

                // ==================== 编辑器 ====================
                function insertCallout(editor, type) {
                    try {
                        const cm = $('.CodeMirror', editor)?.CodeMirror;
                        if (!cm) return;
                        const doc = cm.getDoc();
                        let cur = doc.getCursor();
                        const lvl = (doc.getLine(cur.line).match(/^(>\s*)+/)?.[0].match(/>/g) || []).length;

                        if (lvl > 0) {
                            let last = cur.line;
                            for (let i = cur.line + 1; i < doc.lineCount(); i++) {
                                if (doc.getLine(i).match(/^>\s*/)) last = i; else break;
                            }
                            cur = { line: last, ch: doc.getLine(last).length };
                        }

                        const pre = lvl > 0 ? '>'.repeat(lvl + 1) + ' ' : '> ';
                        doc.replaceRange((lvl > 0 ? '\n' : '') + `${pre}[!${type}] \n${pre}`, cur);
                        doc.setCursor({ line: cur.line + (lvl > 0 ? 1 : 0), ch: `${pre}[!${type}] `.length });
                        cm.focus();
                    } catch (e) { console.error('[Callout]', e); }
                }

                let clickBound = false;
                function createInserter(editor) {
                    const bar = $('.mde-toolbar', editor);
                    if (!bar || $('.callout-inserter-wrapper', bar)) return;

                    const vAttr = getVAttr($('.toolbar-item', bar));
                    const setV = e => vAttr && e.setAttribute(vAttr, '');

                    const wrap = el('span', 'callout-inserter-wrapper toolbar-item');
                    wrap.title = 'Callout - NodeSeek X'; setV(wrap);

                    const btn = el('span', 'callout-inserter-btn i-icon', `<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><path d="M44 8H4v30h15l5 5 5-5h15V8Z" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 18v10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="33" r="2" fill="currentColor"/></svg>`);
                    setV(btn);

                    const drop = el('div', 'callout-inserter-dropdown');
                    MENU_TYPES.forEach(t => {
                        if(!t.show) return;
                        const item = el('div', 'callout-inserter-item', `<span class="callout-inserter-dot" style="background:rgb(${t.c})"></span>${t.n}[${t.k}]`);
                        item.onclick = e => { e.stopPropagation(); insertCallout(editor, t.k); drop.classList.remove('show'); };
                        drop.appendChild(item);
                    });

                    btn.onclick = e => { e.stopPropagation(); $$('.callout-inserter-dropdown.show').forEach(d => d !== drop && d.classList.remove('show')); drop.classList.toggle('show'); };
                    if (!clickBound) { document.addEventListener('click', () => $$('.callout-inserter-dropdown.show').forEach(d => d.classList.remove('show'))); clickBound = true; }

                    const sep = el('div', 'sep'); setV(sep);
                    wrap.append(btn, drop);
                    bar.append(sep, wrap);
                }

                // ==================== 初始化 ====================
                const s = el('style', '', CSS); document.head.appendChild(s);

                const runRender = () => $$('.post-content blockquote:not(.oc-done)').forEach(bq => { if (!bq.closest('blockquote.oc-done')) render(bq); });
                const update = debounce(() => { runRender(); const e = $('.md-editor'); if (e) createInserter(e); }, 100);

                update();
                new MutationObserver(update).observe($('.nsk-post-wrapper,.post-content,#editor-body') || document.body, { childList: true, subtree: true });
            },
            init() {
                Config.initializeConfig();
                this.addPluginStyle();
                this.checkLogin();
                const codeMirrorElement = document.querySelector('.CodeMirror');
                if (codeMirrorElement) {
                    const codeMirrorInstance = codeMirrorElement.CodeMirror;
                    if (codeMirrorInstance) {
                        let btnSubmit = document.querySelector('.md-editor button.submit.btn.focus-visible');
                        btnSubmit.innerText=btnSubmit.innerText+'(Ctrl+Enter)';
                        codeMirrorInstance.addKeyMap({"Ctrl-Enter":function(cm){ btnSubmit.click();}});
                    }
                }
                this.callout();
                this.autoSignIn();//自动签到
                this.addSignTips();//签到提示
                this.autoJump();//自动点击跳转页
                this.autoLoading();//无缝加载帖子和评论
                this.blockMemberDOMInsert();//屏蔽用户
                this.blockPost();//屏蔽帖子
                this.blockPostsByViewLevel();
                this.quickComment();//快捷评论
                this.addLevelTag();//添加等级标签
                this.userCardEx();//用户卡片扩展
                //this.fakeLevel();
                this.registerMenus();
                this.addPluginScript();
                this.addCodeHighlight();
                this.addImageSlide();
                this.darkMode();
                this.history();
                this.initInstantPage();
                this.smoothScroll();
            }
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main.init);
        } else {
            main.init();
        }
    });
})();