// ==UserScript==
// @name        哔哩哔哩屏蔽增强器改：评论区广告水军标记
// @namespace   http://tampermonkey.net/
// @license     Apache-2.0
// @version     2.4
// @author      byhgz
// @description 对B站视频或评论进行标记，支持关键词模糊正则等，支持时长播放弹幕过滤等，如视频、评论、动态、直播间的评论等，详情可看下面支持的屏蔽类型
// @icon        https://static.hdslb.com/images/favicon.ico
// @noframes
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_unregisterMenuCommand
// @grant       GM_registerMenuCommand
// @exclude     *://message.bilibili.com/pages/nav/header_sync
// @exclude     *://message.bilibili.com/pages/nav/index_new_pc_sync
// @exclude     *://live.bilibili.com/blackboard/dropdown-menu.html
// @exclude     *://live.bilibili.com/p/html/live-web-mng/*
// @exclude     *://www.bilibili.com/correspond/*
// @match       *://search.bilibili.com/*
// @match       *://www.bilibili.com/v/food/*
// @match       *://message.bilibili.com/*
// @match       *://www.bilibili.com/read/*
// @match       *://www.bilibili.com/v/topic/detail/?topic_id=*
// @match       *://www.bilibili.com/v/kichiku/*
// @match       *://t.bilibili.com/*
// @match       *://space.bilibili.com/*
// @match       *://www.bilibili.com/video/*
// @match       *://live.bilibili.com/?spm_id_from=*
// @match       *://live.bilibili.com/p/eden/area-tags?*
// @match       *://live.bilibili.com/*
// @match       *://www.bilibili.com/opus/*
// @match       *://www.bilibili.com/*
// @require     https://cdn.jsdelivr.net/npm/vue@2
// @require     https://update.greasyfork.org/scripts/517928/gz_ui_css-v1.js
// @require     https://update.greasyfork.org/scripts/521941/about_and_feedback_components.js
// @require     https://greasyfork.org/scripts/462234-message/code/Message.js
// @require     https://update.greasyfork.org/scripts/449512/Xtiper.js
// @require     https://update.greasyfork.org/scripts/516282/Drawer_gz%E9%A1%B5%E9%9D%A2%E4%BE%A7%E8%BE%B9%E6%8A%BD%E5%B1%89%E7%BB%84%E4%BB%B6.js
// @require     https://update.greasyfork.org/scripts/517538/DynamicTabs_gz.js
// @downloadURL https://update.greasyfork.org/scripts/523177/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B1%8F%E8%94%BD%E5%A2%9E%E5%BC%BA%E5%99%A8%E6%94%B9%EF%BC%9A%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%B9%BF%E5%91%8A%E6%B0%B4%E5%86%9B%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/523177/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B1%8F%E8%94%BD%E5%A2%9E%E5%BC%BA%E5%99%A8%E6%94%B9%EF%BC%9A%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%B9%BF%E5%91%8A%E6%B0%B4%E5%86%9B%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==
"use strict";
(function (Vue) {
    'use strict';
    var gmUtil = {
        setData(key, content) {
            GM_setValue(key, content);
        },
        getData(key, defaultValue) {
            return GM_getValue(key, defaultValue);
        },
        delData(key) {
            if (!this.isData(key)) {
                return false;
            }
            GM_deleteValue(key);
            return true;
        },
        isData(key) {
            return this.getData(key) !== undefined;
        },
        addStyle(style) {
            GM_addStyle(style);
        },
        addGMMenu(text, func, shortcutKey = null) {
            return GM_registerMenuCommand(text, func, shortcutKey);
        },
    };
    const setBorderColor = (color) => {
        gmUtil.setData("borderColor", color);
    };
    const defBorderColor = "rgb(0, 243, 255)";
    const getBorderColor = () => {
        return gmUtil.getData("borderColor", defBorderColor)
    };
    const setOutputInformationFontColor = (color) => {
        gmUtil.setData("output_information_font_color", color);
    };
    const defOutputInformationFontColor = "rgb(119,128,248)";
    const getOutputInformationFontColor = () => {
        return gmUtil.getData("output_information_font_color", defOutputInformationFontColor)
    };
    const setHighlightInformationColor = (color) => {
        gmUtil.setData("highlight_information_color", color);
    };
    const defHighlightInformationColor = "rgb(234, 93, 93)";
    const getHighlightInformationColor = () => {
        return gmUtil.getData("highlight_information_color", defHighlightInformationColor);
    };
    const setDefaultColorInfo = () => {
        setBorderColor(defBorderColor);
        setOutputInformationFontColor(defOutputInformationFontColor);
        setHighlightInformationColor(defHighlightInformationColor);
    };
    const setBOnlyTheHomepageIsBlocked = (bool) => {
        gmUtil.setData("bOnlyTheHomepageIsBlocked", bool === true);
    };
    const getBOnlyTheHomepageIsBlocked = () => {
        return gmUtil.getData("bOnlyTheHomepageIsBlocked", false);
    };
    const getAdaptationBAppCommerce = () => {
        return gmUtil.getData("adaptation-b-app-recommend", false) === true;
    };
    const setAdaptationBAppCommerce = (bool) => {
        gmUtil.setData("adaptation-b-app-recommend", bool === true);
    };
    const isHideMainButSwitch = () => {
        return gmUtil.getData("hideMainButSwitch", false) === true;
    };
    const setHideMainButSwitch = (bool) => {
        gmUtil.setData("hideMainButSwitch", bool === true);
    };
    const isHideRightTopMainButSwitch = () => {
        return gmUtil.getData("hideRightTopMainButSwitch", true) === true;
    };
    const setHideRightTopMainButSwitch = (bool) => {
        gmUtil.setData("hideRightTopMainButSwitch", bool === true);
    };
    const isCompatible_BEWLY_BEWLY = () => {
        return gmUtil.getData("compatible_BEWLY_BEWLY", false) === true;
    };
    const setCompatible_BEWLY_BEWLY = (bool) => {
        gmUtil.setData("compatible_BEWLY_BEWLY", bool === true);
    };
    const setDiscardOldCommentAreas = (bool) => {
        gmUtil.setData("discardOldCommentAreas", bool === true);
    };
    const isDiscardOldCommentAreas = () => {
        return gmUtil.getData("discardOldCommentAreas", false) === true;
    };
    var localMKData = {
        setBorderColor,
        getBorderColor,
        setOutputInformationFontColor,
        getOutputInformationFontColor,
        setHighlightInformationColor,
        getHighlightInformationColor,
        setBOnlyTheHomepageIsBlocked,
        getBOnlyTheHomepageIsBlocked,
        getAdaptationBAppCommerce,
        setAdaptationBAppCommerce,
        setDefaultColorInfo,
        isHideMainButSwitch,
        setHideMainButSwitch,
        isCompatible_BEWLY_BEWLY,
        setCompatible_BEWLY_BEWLY,
        setDiscardOldCommentAreas,
        isDiscardOldCommentAreas,
        isHideRightTopMainButSwitch,
        setHideRightTopMainButSwitch
    };
    const mainDrawer = new Drawer_gz({
        show: false,
        height: "50vh",
        headerShow: false,
        title: "屏蔽器主面板",
        direction: "top",
        externalButtonText: "屏蔽器",
        externalButtonWidth: "80px",
        externalButtonShow: !localMKData.isHideMainButSwitch(),
        zIndex: 9000,
        drawerBorder: `1px solid ${localMKData.getBorderColor()}`,
        bodyHtml: `<div id="shield"></div>`,
    });
    const options = {
        styles: `
                .my-custom-tab-button {
                    font-size: 16px;
                }
                .my-custom-tab-content {
                    background-color: #f9f9f9;
                }
            `,
        classes: {
            tabButton: 'my-custom-tab-button',
            tabButtonActive: 'my-custom-tab-button-active',
            tabContent: 'my-custom-tab-content',
            tabContentActive: 'my-custom-tab-content-active'
        },
        backgroundColor: '#eee',
        borderColor: '#ddd',
        textColor: '#333',
        fontWeight: 'bold',
        activeBackgroundColor: '#0056b3',
        activeTextColor: '#fff',
        contentBorderColor: '#bbb',
        contentBackgroundColor: '#ffffff',
        onTabClick: (id, title, content) => {
            const tab = tabsConfig.find(item => item.title === title);
            const height = tab.height;
            mainDrawer.setHeight(height ? height : '50vh');
        },
    };
    const tabsConfig = [
        {
            id: 'tab01',
            title: '面板设置',
            content: '<div id="panel_settings_vue"></div>',
            height: "23vh",
        },
        {
            id: 'tab02',
            title: '规则管理',
            content: '<div id="rule_management_vue"></div>',
            height: "96vh"
        },
        {
            id: 'tab03',
            title: '其他参数过滤',
            content: `<div id="other_parameter_filter"></div>`,
        },
        {
            id:'id04',
            title: '兼容设置',
            content: `<div id="compatible_setting"></div>`,
        },
        {
            id: 'tab05',
            title: '输出信息',
            content: `<div id="output_information">
<button gz_type>清空消息</button>
<ol class="info">
</ol>
</div>`,
            height: "96vh"
        },
        {
            id: 'tab06',
            title: '支持打赏',
            content: '<div id="station_b_shield_donate"></div>',
            height: "80vh"
        },
        {
            id: 'tab07',
            title: '关于和问题反馈',
            content: `<div id="station_b_shield_problem_feedback"></div>`,
            height: '53vh'
        }
    ];
    new DynamicTabs_gz('#shield', tabsConfig,
        options
    );
    class EventEmitter {
        constructor() {
            this.events = {}; // 存储事件和回调函数
            this.handlers = {}; // 存储事件处理函数
        }
        on(eventName, callback) {
            if (!this.events[eventName]) {
                this.events[eventName] = [];
            }
            this.events[eventName].push(callback);
        }
        once(eventName, callback) {
            const onceCallback = (...args) => {
                callback(...args);
                this.off(eventName, onceCallback);
            };
            this.on(eventName, onceCallback);
        }
        emit(eventName, data) {
            if (this.events[eventName]) {
                this.events[eventName].forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.error(`Error in event listener for "${eventName}":`, error);
                    }
                });
                return
            }
            throw new Error(`No event listeners registered for "${eventName}"`);
        }
        off(eventName, callback) {
            if (this.events[eventName]) {
                this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
            }
        }
        removeAllListeners(eventName) {
            if (eventName) {
                delete this.events[eventName];
                delete this.handlers[eventName];
            } else {
                this.events = {};
                this.handlers = {};
            }
        }
        listenerCount(eventName) {
            return this.events[eventName] ? this.events[eventName].length : 0;
        }
        handle(eventName, handler) {
            this.handlers[eventName] = handler;
        }
        invoke(eventName, data) {
            if (this.handlers[eventName]) {
                return this.handlers[eventName](data);
            }
            return null;
        }
    }
    const eventEmitter = new EventEmitter();
    const returnVue$4 = () => {
        return new Vue({
            template: `
          <div>
            <div>
              选色器:<input type="color" v-model="input_color">
            </div>
            <button gz_type @click="setBorderColorBut">设置边框色</button>
            <button gz_type @click="setDefFontColorForOutputInformationBut">设置输出信息默认字体色</button>
            <button gz_type @click="setTheFontColorForOutputInformationBut">设置输出信息高亮字体色</button>
            <button title="刷新页面生效" gz_type @click="setDefInfoBut">恢复默认</button>
            <div gz_bezel>
              <div>
                <label>
                  <input type="checkbox" v-model="hideMainButSwitch">隐藏主面板开关按钮
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" v-model="hideRightTopMainButSwitch">隐藏右上角圆形主面板开关按钮
                </label>
              </div>
            </div>
            <hr>
            <div>
              <h4>说明</h4>
              <ol>
                <li>按键盘tab键上的~键为展开关闭主面板</li>
              </ol>
            </div>
          </div>`,
            el: '#shield #panel_settings_vue',
            data() {
                return {
                    input_color: "",
                    hideMainButSwitch: localMKData.isHideMainButSwitch(),
                    hideRightTopMainButSwitch: localMKData.isHideRightTopMainButSwitch()
                }
            },
            methods: {
                setBorderColorBut() {
                    console.log(this.input_color);
                    xtip.confirm("是要否设置面板边框颜色吗？", {
                        icon: "a",
                        btn1: () => {
                            localMKData.setBorderColor(this.input_color);
                            xtip.alert("已设置面板边框颜色，刷新生效");
                        }
                    });
                },
                setDefFontColorForOutputInformationBut() {
                    xtip.confirm("是要否设置输出信息默认字体颜色吗？", {
                        icon: "a",
                        btn1: () => {
                            localMKData.setOutputInformationFontColor(this.input_color);
                            xtip.alert("已设置输出信息默认字体颜色，刷新生效");
                        }
                    });
                },
                setTheFontColorForOutputInformationBut() {
                    xtip.confirm("是要否设置输出信息高亮字体颜色吗？", {
                        icon: "a",
                        btn1: () => {
                            localMKData.setHighlightInformationColor(this.input_color);
                            xtip.alert("已设置输出信息高亮字体颜色，刷新生效");
                        }
                    });
                },
                setDefInfoBut() {
                    localMKData.setDefaultColorInfo();
                    xtip.alert("已恢复默认颜色，刷新生效");
                }
            },
            watch: {
                hideMainButSwitch(newVal) {
                    localMKData.setHideMainButSwitch(newVal);
                    mainDrawer.externalButtonShow(!newVal);
                },
                hideRightTopMainButSwitch(newVal) {
                    localMKData.setHideRightTopMainButSwitch(newVal);
                    eventEmitter.emit('右上角开关按钮显隐', newVal);
                }
            }
        });
    };
    const wait = (milliseconds = 1000) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };
    const fileDownload = (content, fileName) => {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    const toTimeString = () => {
        return new Date().toLocaleString();
    };
    function smoothScroll(toTop = false, duration = 1000) {
        return new Promise((resolve) => {
            const start = window.scrollY;
            const end = toTop ? 0 : document.documentElement.scrollHeight - window.innerHeight;
            const change = end - start;
            const startTime = performance.now();
            function animateScroll(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                const easeInOutQuad = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
                window.scrollTo(0, start + change * easeInOutQuad);
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                } else {
                    resolve();
                }
            }
            requestAnimationFrame(animateScroll);
        });
    }
    function debounce(func, wait=1000) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    function debounceAsync(asyncFunc, wait=1000) {
        let timeout;
        let pendingPromise;
        return async function(...args) {
            const context = this;
            if (pendingPromise) {
                clearTimeout(timeout);
                await pendingPromise;
            }
            pendingPromise = new Promise((resolve) => {
                timeout = setTimeout(() => {
                    pendingPromise = null; // 清除引用
                    resolve(asyncFunc.apply(context, args));
                }, wait);
            });
            return pendingPromise;
        };
    }
    function throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    function throttleAsync(asyncFunc, limit) {
        let isThrottled = false;
        let pendingArgs = null;
        let pendingContext = null;
        let timeoutId;
        let pendingPromiseResolve;
        const throttled = async function (...args) {
            const context = this;
            if (isThrottled) {
                return new Promise((resolve) => {
                    pendingArgs = args;
                    pendingContext = context;
                    pendingPromiseResolve = resolve;
                });
            }
            isThrottled = true;
            try {
                return await asyncFunc.apply(context, args);
            } finally {
                timeoutId = setTimeout(() => {
                    isThrottled = false;
                    if (pendingArgs) {
                        throttled.apply(pendingContext, pendingArgs).then(pendingPromiseResolve);
                        pendingArgs = null;
                        pendingContext = null;
                        pendingPromiseResolve = null;
                    }
                }, limit);
            }
        };
        throttled.cancel = () => {
            clearTimeout(timeoutId);
            isThrottled = false;
            pendingArgs = null;
            pendingContext = null;
            pendingPromiseResolve = null;
        };
        return throttled;
    }
    const parseUrl = (urlString) => {
        const url = new URL(urlString);
        const pathSegments = url.pathname.split('/').filter(segment => segment !== '');
        const searchParams = new URLSearchParams(url.search.slice(1));
        const queryParams = {};
        for (const [key, value] of searchParams.entries()) {
            queryParams[key] = value;
        }
        return {
            protocol: url.protocol,
            hostname: url.hostname,
            port: url.port,
            pathname: url.pathname,
            pathSegments,
            search: url.search,
            queryParams,
            hash: url.hash
        };
    };
    var defUtil = {
        wait,
        fileDownload,
        toTimeString,
        smoothScroll,
        debounce,
        debounceAsync,
        throttle,
        throttleAsync,
        parseUrl
    };
    const ruleKeyListData = [
        {
            key: "name",
            name: "用户名黑名单(模糊匹配)",
            oldKey: "userNameKeyArr",
            oldName: "用户名黑名单模式(模糊匹配)"
        },
        {
            key: "precise_name",
            name: "用户名黑名单(精确匹配)",
            oldKey: "userNameArr",
            oldName: "用户名黑名单模式(精确匹配)"
        }, {
            key: "nameCanonical",
            name: "用户名黑名单(正则匹配)"
        },
        {
            key: "precise_uid",
            name: "用户uid黑名单(精确匹配)",
            oldKey: "userUIDArr",
            oldName: "用户uid黑名单模式(精确匹配)"
        },
        {
            key: "precise_uid_white",
            name: "用户uid白名单(精确匹配)",
            oldKey: "userWhiteUIDArr",
            oldName: "用户uid白名单模式(精确匹配)"
        }, {
            key: "title",
            name: "标题黑名单(模糊匹配)",
            oldKey: "titleKeyArr",
            oldName: "标题黑名单模式(模糊匹配)"
        }, {
            key: "titleCanonical",
            name: "标题黑名单(正则匹配)",
            oldKey: "titleKeyCanonicalArr",
            oldName: "标题黑名单模式(正则匹配)"
        }, {
            key: "commentOn",
            name: "评论关键词黑名单(模糊匹配)",
            oldKey: "commentOnKeyArr",
            oldName: "评论关键词黑名单模式(模糊匹配)"
        }, {
            key: "commentOnCanonical",
            name: "评论关键词黑名单(正则匹配)",
            oldKey: "contentOnKeyCanonicalArr",
            oldName: "评论关键词黑名单模式(正则匹配)"
        }, {
            key: "contentOn",
            name: "评论内容黑名单(模糊匹配)",
            oldKey: "contentOnKeyArr",
            oldName: "评论内容黑名单模式(模糊匹配)"
        }, {
            key: "precise_fanCard",
            name: "粉丝牌黑名单(精确匹配)",
            oldKey: "fanCardArr",
            oldName: "粉丝牌黑名单模式(精确匹配)"
        }, {
            key: "dynamic",
            name: "动态关键词黑名单(模糊匹配)",
            oldKey: "dynamicArr",
            oldName: "动态关键词内容黑名单模式(模糊匹配)"
        }, {
            key: "precise_tag",
            name: "话题tag标签黑名单(精确匹配)",
        }
        , {
            key: "tag",
            name: "话题tag标签黑名单(模糊匹配)",
        }, {
            key: "tagCanonical",
            name: "话题tag标签黑名单(正则匹配)"
        }, {
            key: "precise_partition",
            name: "直播分区黑名单(精确匹配)"
        }
    ];
    const getRuleKeyListData = () => {
        return ruleKeyListData;
    };
    const getNameArr = () => {
        return gmUtil.getData("name", []);
    };
    const getPreciseNameArr = () => {
        return gmUtil.getData("precise_name", []);
    };
    const getNameCanonical = () => {
        return gmUtil.getData("nameCanonical", []);
    };
    const getPreciseUidArr = () => {
        return gmUtil.getData("precise_uid", []);
    };
    const getPreciseUidWhiteArr = () => {
        return gmUtil.getData("precise_uid_white", []);
    };
    const getTitleArr = () => {
        return gmUtil.getData("title", []);
    };
    const getTitleCanonicalArr = () => {
        return gmUtil.getData("titleCanonical", []);
    };
    const getCommentOnArr = () => {
        return gmUtil.getData("commentOn", []);
    };
    const getCommentOnCanonicalArr = () => {
        return gmUtil.getData("commentOnCanonical", []);
    };
    const getPreciseTagArr = () => {
        return gmUtil.getData("precise_tag", []);
    };
    const getTagArr = () => {
        return gmUtil.getData("tag", []);
    };
    const getTagCanonicalArr = () => {
        return gmUtil.getData("tagCanonical", []);
    };
    const getPreciseFanCardArr = () => {
        return gmUtil.getData("precise_fanCard", []);
    };
    const getPrecisePartitionArr=()=>{
        return gmUtil.getData("precise_partition", []);
    };
    var ruleKeyListData$1 = {
        getNameArr,
        getPreciseNameArr,
        getNameCanonical,
        getPreciseUidArr,
        getPreciseUidWhiteArr,
        getTitleArr,
        getTitleCanonicalArr,
        getCommentOnArr,
        getCommentOnCanonicalArr,
        getRuleKeyListData,
        getPreciseTagArr,
        getTagArr,
        getTagCanonicalArr,
        getPreciseFanCardArr,
        getPrecisePartitionArr
    };
    const verificationInputValue = (ruleValue, type) => {
        if (ruleValue === null) return null;
        if (type === "precise_uid" || type === "precise_uid_white") {
            ruleValue = parseInt(ruleValue);
            if (isNaN(ruleValue)) {
                Qmsg.info('请输入数字!');
                return null;
            }
        } else {
            ruleValue.trim();
        }
        if (ruleValue === '') {
            Qmsg.info('内容为空');
            return null;
        }
        return ruleValue;
    };
    const addRule = (ruleValue, type) => {
        const inputValue = verificationInputValue(ruleValue, type);
        return new Promise((resolve, reject) => {
                if (inputValue === null) {
                    reject('取消添加');
                    return;
                }
                const arr = gmUtil.getData(type, []);
                if (arr.includes(inputValue)) {
                    reject('已存在此内容');
                    return;
                }
                arr.push(inputValue);
                gmUtil.setData(type, arr);
                resolve('添加成功');
            }
        )
    };
    const showAddRuleInput = (type) => {
        const ruleValue = window.prompt('请输入要添加的规则内容', '');
        return addRule(ruleValue, type);
    };
    const showDelRuleInput = (type) => {
        let prompt = window.prompt('请输入要移除的规则内容', '');
        const inputValue = verificationInputValue(prompt, type);
        return new Promise((resolve, reject) => {
            if (inputValue === null) {
                reject('取消添加');
                return;
            }
            const arr = gmUtil.getData(type, []);
            const indexOf = arr.indexOf(inputValue);
            if (indexOf === -1) {
                reject('不存在此内容');
                return;
            }
            arr.splice(indexOf, 1);
            gmUtil.setData(type, arr);
            resolve('移除成功');
        })
    };
    const showSetRuleInput = (type) => {
        let prompt = window.prompt('请输入要修改的规则内容', '');
        const inputValue = verificationInputValue(prompt, type);
        return new Promise((resolve, reject) => {
            if (inputValue === null) return;
            const arr = gmUtil.getData(type, []);
            const indexOf = arr.indexOf(inputValue);
            if (indexOf === -1) {
                reject('不存在此内容');
                return;
            }
            prompt = window.prompt('请输入要修改的内容', '');
            const newInputValue = verificationInputValue(prompt, type);
            if (newInputValue === null) return;
            if (arr.includes(newInputValue)) {
                reject('已存在要修改过后的值内容');
                return;
            }
            arr[indexOf] = newInputValue;
            gmUtil.setData(type, arr);
            resolve('修改成功');
        })
    };
    const getRuleContent = (space = 0) => {
        const ruleMap = {};
        for (let ruleKeyListDatum of ruleKeyListData$1.getRuleKeyListData()) {
            const key = ruleKeyListDatum.key;
            ruleMap[key] = gmUtil.getData(key, []);
        }
        return JSON.stringify(ruleMap, null, space);
    };
    const verificationRuleMap = (keyArr, content) => {
        let parse;
        try {
            parse = JSON.parse(content);
        } catch (e) {
            alert('规则内容有误');
            return false;
        }
        const newRule = {};
        for (let key of keyArr) {
            if (!Array.isArray(parse[key])) {
                continue;
            }
            if (parse[key].length === 0) {
                continue;
            }
            newRule[key] = parse[key];
        }
        if (Object.keys(newRule).length === 0) {
            alert('规则内容为空');
            return false;
        }
        return newRule;
    };
    const overwriteImportRules = (keyArr, content) => {
        const map = verificationRuleMap(keyArr, content);
        if (map === false) return false;
        for (let key of Object.keys(map)) {
            gmUtil.setData(key, map[key]);
        }
        return true;
    };
    const appendImportRules = (keyArr, content) => {
        const map = verificationRuleMap(keyArr, content);
        if (map === false) return false;
        for (let key of Object.keys(map)) {
            const arr = gmUtil.getData(key, []);
            for (let item of map[key]) {
                if (!arr.includes(item)) {
                    arr.push(item);
                }
            }
            gmUtil.setData(key, arr);
        }
        return true;
    };
    const getNewRuleKeyList = () => {
        return ruleKeyListData$1.getRuleKeyListData();
    };
    const overwriteImportRulesV1 = (content) => {
        let parse;
        try {
            parse = JSON.parse(content);
        } catch (e) {
            alert('规则内容有误');
            return false;
        }
        for (let ruleKeyListDatum of ruleKeyListData$1.getRuleKeyListData()) {
            const name = ruleKeyListDatum.oldName;
            const jsonRuleList = parse[name];
            if (!jsonRuleList) {
                continue;
            }
            if (jsonRuleList.length === 0) {
                continue;
            }
            gmUtil.setData(ruleKeyListDatum.key, jsonRuleList);
        }
        return true;
    };
    const addRulePreciseUid = (uid) => {
        return addRule(uid, "precise_uid").then(msg => {
            xtip.msg(msg, {icon: 's'});
        }).catch(msg => {
            xtip.msg(msg, {icon: 'e'});
        })
    };
    const addRulePreciseName= (name) => {
        return addRule(name, "precise_name").then(msg => {
            xtip.msg(msg, {icon: 's'});
        }).catch(msg => {
            xtip.msg(msg, {icon: 'e'});
        })
    };
    var ruleUtil = {
        addRule,
        showAddRuleInput,
        showDelRuleInput,
        showSetRuleInput,
        getRuleContent,
        overwriteImportRules,
        appendImportRules,
        overwriteImportRulesV1,
        getNewRuleKeyList,
        addRulePreciseUid,
        addRulePreciseName
    };
    const oldToNewRule = () => {
        const listData = ruleKeyListData$1.getRuleKeyListData().filter(item => item.oldKey);
        for (let data of listData) {
            const oldKeyDataArr = gmUtil.getData(data.oldKey, []);
            if (oldKeyDataArr.length === 0) {
                continue
            }
            const newKeyDataArr = gmUtil.getData(data.key, []);
            if (newKeyDataArr.length === 0) {
                gmUtil.setData(data.key, oldKeyDataArr);
                gmUtil.delData(data.oldKey);
                continue
            }
            for (let v of oldKeyDataArr) {
                const isExist = newKeyDataArr.find(item => item === v);
                if (!isExist) {
                    newKeyDataArr.push(v);
                }
            }
            gmUtil.setData(data.key, newKeyDataArr);
        }
    };
    var ruleConversion = {
        oldToNewRule
    };
    const returnVue$3 = () => {
        return new Vue({
            template: `
          <div style="display: flex">
            <div style="width: 84%;" gz_bezel>
              <h4>使用说明</h4>
              <ol>
                <li>脚本中会对要匹配的内容进行去除空格和转成小写，比如有个内容是【不 要 笑 挑 战
                  ChallEnGE】，会被识别称为【不要笑挑战challenge】
                </li>
                <li>在上述一点的情况下，模糊匹配和正则匹配的方式时不用考虑要匹配的内容中大写问题</li>
                <li>大部分情况下模糊匹配比精确匹配好用</li>
                <li>如果用户要添加自己的正则匹配相关的规则时，建议先去该网址进行测试再添加，避免浪费时间
                  <a href="https://www.jyshare.com/front-end/854/" target="_blank">>>>正则表达式在线测试<<<</a>
                </li>
                <li>
                  如果更新脚本之后规则全吗，没了请点击下面的【旧规则自动转新规则】按钮，进行转换，如不行请通过关于和问题反馈选项卡中的反馈渠道联系作者
                </li>
              </ol>
              <div>
                <!--                <h3>指定类型批量添加</h3>-->
                <!--                <span>指定类型批量添加，每个规则空格分割</span>-->
                <!--                <textarea-->
                <!--                    style="width: 100%"-->
                <!--                    cols="30" rows="5" placeholder="匹配添加内容时规则内容" v-model="inputVal"/>-->
              </div>
              <div>
                <label>
                  <input type="checkbox" v-model="bOnlyTheHomepageIsBlocked">仅首页屏蔽生效屏蔽
                </label>
              </div>
              <div>
                <select v-model="selectVal">
                  <option v-for="item in ruleInfoArr" :value="item.type">{{ item.name }}</option>
                </select>
                《====可点击切换条件
              </div>
              <button gz_type @click="operationBut('add')">添加{{ selectText }}</button>
              <button gz_type @click="operationBut('del')">移除{{ selectText }}</button>
              <button gz_type @click="operationBut('set')">修改{{ selectText }}</button>
              <button gz_type="info" @click="operationBut('del_all')">全部移除</button>
              <div>
                <h2>导出规则</h2>
                <button gz_type @click="ruleOutToFIleBut">导出到文件</button>
                <button gz_type>导出到编辑框</button>
                <button gz_type @click="ruleOutToConsoleBut">导出到控制台</button>
              </div>
              <hr>
              <div>
                <h2>导入规则</h2>
                <div style="display: flex;justify-content:space-between;">
                  <ol>
                    <li>规则内容请在下面编辑框中导入</li>
                    <li>旧版本的需要使用下面的v1旧版本导入规则</li>
                    <li>旧版本的只能覆盖导入</li>
                    <li>v1之后的版本可以选择覆盖和追加</li>
                  </ol>
                  <ol>
                    <li v-for="item in ruleReference">
                      <button gz_type='info' @click="xtipAlertBut(item.content,item.title)">
                        {{ item.title }}
                      </button>
                    </li>
                  </ol>
                </div>
                <button gz_type @click="overwriteImportRulesBut">覆盖导入规则</button>
                <button gz_type @click="appendImportRulesBut">追加导入规则</button>
                <button gz_type @click="overwriteImportRulesV1But">v1旧版本覆盖导入规则</button>
                <button gz_type @click="ruleOldToNewBut">旧规则自动转新规则</button>
                <div>
                  <textarea cols="30" rows="10" placeholder="要导入的规则内容" style="width: 100%"
                            v-model="ruleContentImport"></textarea>
                </div>
              </div>
            </div>
            <div style="width: 15%;" gz_bezel>
              <h2>规则信息</h2>
              <button gz_type @click="refreshInfoBut">刷新信息</button>
              <div v-for="item in ruleInfoArr">{{ item.name }}
                <button gz_type>{{ item.len }}</button>
                个
              </div>
            </div>
          </div>`,
            el: '#shield #rule_management_vue',
            data() {
                return {
                    selectVal: 'name',
                    selectText: "",
                    ruleContentImport: "",
                    ruleActions: [
                        {
                            type: "uid",
                            name: "uid(精确)",
                        }
                    ],
                    ruleKeyArr: [],
                    ruleInfoArr: [],
                    ruleReference: [
                        {
                            title: "旧版本规则参考",
                            content: ` {"用户名黑名单模式(精确匹配)":["账号已注销"],"BV号黑名单模式(精确匹配)":[],
                        "用户名黑名单模式(模糊匹配)":["bili_","_bili"],"用户uid黑名单模式(精确匹配)":[442010132,76525078,225219967,3493283164588093],
                        "用户uid白名单模式(精确匹配)":[344490740,1861980711],"标题黑名单模式(模糊匹配)":["激励计划","蚌不住","手游激励","游戏活动打卡"],
                        "标题黑名单模式(正则匹配)":["感觉.*不如","不要笑.*挑战"],"评论关键词黑名单模式(模糊匹配)":["感觉不如","差不多的了"],
                        "评论关键词黑名单模式(正则匹配)":["这不.+吗","玩.*的","不要笑.*挑战"],"粉丝牌黑名单模式(精确匹配)":[],
                        "专栏关键词内容黑名单模式(模糊匹配)":[],"动态关键词内容黑名单模式(模糊匹配)":["拼多多","京东红包","京东618红包","618活动"]}`
                        },
                        {
                            title: "新版本规则参考",
                            content: "待补充"
                        }
                    ],
                    bOnlyTheHomepageIsBlocked: localMKData.getBOnlyTheHomepageIsBlocked()
                }
            },
            methods: {
                operationBut(model) {
                    const type = this.selectVal;
                    if (model === "add") {
                        ruleUtil.showAddRuleInput(type).then((msg) => {
                            this.refreshInfoBut();
                            alert(msg);
                        }).catch(errMsg => {
                            Qmsg.info(errMsg);
                        });
                    }
                    if (model === "del") {
                        ruleUtil.showDelRuleInput(type).then((msg) => {
                            this.refreshInfoBut();
                            alert(msg);
                        }).catch(errMsg => {
                            Qmsg.info(errMsg);
                        });
                    }
                    if (model === "set") {
                        ruleUtil.showSetRuleInput(type).then((msg) => {
                            this.refreshInfoBut();
                            alert(msg);
                        }).catch(errMsg => {
                            Qmsg.info(errMsg);
                        });
                    }
                    if (model === "del_all") {
                        if (!window.confirm("确定要删除所有规则吗？")) {
                            Qmsg.info('取消删除全部操作');
                            return;
                        }
                        for (let x of this.ruleKeyArr) {
                            gmUtil.delData(x);
                        }
                        alert("删除全部规则成功");
                        this.refreshInfoBut();
                    }
                },
                ruleOutToFIleBut() {
                    const ruleContent = ruleUtil.getRuleContent(4);
                    let fileName = "b站屏蔽器规则-" + defUtil.toTimeString();
                    const s = prompt("保存为", fileName);
                    if (s === null) return;
                    if (!(s.includes(" ") || s === "" || s.length === 0)) fileName = s;
                    defUtil.fileDownload(ruleContent, fileName + ".json");
                },
                ruleOutToConsoleBut() {
                    xtip.msg('已导出到控制台上！', {icon: 's'});
                    console.log(ruleUtil.getRuleContent());
                },
                refreshInfoBut() {
                    for (let x of this.ruleInfoArr) {
                        x.len = gmUtil.getData(x.type, []).length;
                    }
                    Qmsg.info('已刷新规则信息');
                },
                overwriteImportRulesBut() {
                    const trim = this.ruleContentImport.trim();
                    if (ruleUtil.overwriteImportRules(this.ruleKeyArr, trim)) {
                        xtip.msg('已导入成功！', {icon: 's'});
                        this.refreshInfoBut();
                    }
                },
                appendImportRulesBut() {
                    const trim = this.ruleContentImport.trim();
                    if (ruleUtil.appendImportRules(this.ruleKeyArr, trim)) {
                        xtip.msg('已导入成功！', {icon: 's'});
                        this.refreshInfoBut();
                    }
                },
                overwriteImportRulesV1But() {
                    const trim = this.ruleContentImport.trim();
                    if (ruleUtil.overwriteImportRulesV1(trim)) {
                        xtip.msg('已导入成功！', {icon: 's'});
                        this.refreshInfoBut();
                    }
                },
                xtipAlertBut(content, title) {
                    xtip.alert(content,
                        {title: title});
                },
                ruleOldToNewBut() {
                    ruleConversion.oldToNewRule();
                    this.refreshInfoBut();
                    xtip.msg('已转换成功！', {icon: 's'});
                }
            },
            watch: {
                bOnlyTheHomepageIsBlocked(newVal) {
                    localMKData.setBOnlyTheHomepageIsBlocked(newVal);
                },
                selectVal(newVal) {
                    console.log(newVal);
                    const find = this.ruleInfoArr.find(item => item.type === newVal);
                    this.selectText = find.name;
                }
            },
            created() {
                for (let newRuleKeyListElement of ruleUtil.getNewRuleKeyList()) {
                    this.ruleKeyArr.push(newRuleKeyListElement.key);
                    this.ruleInfoArr.push({
                        type: newRuleKeyListElement.key,
                        name: newRuleKeyListElement.name,
                        len: 0
                    });
                }
                const find = this.ruleInfoArr.find(item => item.type === this.selectVal);
                this.selectText = find.name;
                this.refreshInfoBut();
            }
        });
    };
    const returnVue$2 = () => {
        return new Vue({
            el: "#station_b_shield_donate",
            template: `<div>
          <div style="border: 3px solid #000;">
            <div style="display: flex;align-items: center;">
              <h2>零钱赞助</h2>
              <ul>
                <li>1元不嫌少，10元不嫌多哦！感谢支持！</li>
                <li>生活不易，作者叹息</li>
                <li>您的支持是我最大的更新动力</li>
              </ul>
            </div>
            <hr>
            <div style="display: flex;justify-content: center;">
              <div v-for="item in list" :title="item.name"><img :src="item.src" :alt="item.alt"
                                                                style="max-height: 500px;">
                <span style="display: flex;justify-content: center;">{{ item.name }}</span>
              </div>
            </div>
            <hr>
            <h1 style=" display: flex; justify-content: center;">打赏点猫粮</h1>
          </div>
        </div>`,
            data: {
                list: [
                    {
                        name: "支付宝赞助",
                        alt: "支付宝支持",
                        src: "https://www.mikuchase.ltd/img/paymentCodeZFB.webp"
                    },
                    {name: "微信赞助", alt: "微信支持", src: "https://www.mikuchase.ltd/img/paymentCodeWX.webp"},
                    {name: "QQ赞助", alt: "QQ支持", src: "https://www.mikuchase.ltd/img/paymentCodeQQ.webp"},
                ]
            }
        });
    };
    const returnVue$1 = () => {
        return new Vue({
            el: '#other_parameter_filter',
            template: `
          <div style="display: flex">
            <div style="width: 70vw">
              <div>
                <h2>使用说明</h2>
                <ol>
                  <li>如设置时长相关单位为秒</li>
                  <li>如设置播放量和弹幕量相关单位为个</li>
                  <li>设置最小播放量则小于该值的视频会屏蔽</li>
                  <li>设置最大播放量则大于该值的视频会屏蔽</li>
                  <li>设置最小弹幕量则小于该值的视频会屏蔽</li>
                  <li>设置最大弹幕量则大于该值的视频会屏蔽</li>
                  <li>设置最小时长则小于该值的视频会屏蔽</li>
                  <li>设置最大时长则大于该值的视频会屏蔽</li>
                  <li>设置评论区最小用户等级则小于该值的会屏蔽，低于该值的会屏蔽掉</li>
                  <li>设置评论区最大用户等级则大于该值的会屏蔽，高于该值的会屏蔽掉</li>
                  <li>取消相关限制条件则不做限制处理</li>
                  <li>右侧信息关键条件-1则为未做任何限制处理</li>
                  <li>最后因为设置限制条件冲突或限制太多，视频未能限制的情况下，请按需设置限制条件</li>
                </ol>
              </div>
              <input gz_type type="number" :min="inputMin" :max="inputMax" v-model="index">
              <select v-model="selectValue">
                <option :value="item.value" v-for="item in selectList">{{ item.name }}</option>
              </select>
              《====可点击切换限制条件
              <div>
                <button @click="okVideoSelectBut" gz_type>设置</button>
                <button @click="cancelBut" gz_type>取消</button>
                <button gz_type @click="allCancelBut">全部取消</button>
              </div>
            </div>
            <div>
              <button @click="updateInfoBut">刷新</button>
              <div v-for="item in selectList">
                {{ item.name }}
                <button gz_type>{{ item.defVal }}</button>
                {{ item.name.includes('时长') ? '秒' : '' }}
              </div>
            </div>
          </div>`,
            data() {
                return {
                    index: 0,
                    selectList: [
                        {
                            name: '最小播放量',
                            value: 'nMinimumPlay',
                            associated: 'nMaximumPlayback',
                            defVal: -1
                        },
                        {
                            name: '最大播放量',
                            value: 'nMaximumPlayback',
                            associated: 'nMinimumPlay',
                            bLarge: true,
                            defVal: -1
                        },
                        {
                            name: '最小弹幕数',
                            value: 'nMinimumBarrage',
                            associated: 'nMaximumBarrage',
                            defVal: -1
                        },
                        {
                            name: '最大弹幕数',
                            value: 'nMaximumBarrage',
                            associated: 'nMinimumBarrage',
                            bLarge: true,
                            defVal: -1
                        },
                        {
                            name: '最小时长',
                            value: 'nMinimumDuration',
                            associated: 'nMaximumDuration',
                            defVal: -1
                        },
                        {
                            name: '最大时长',
                            value: 'nMaximumDuration',
                            associated: 'nMinimumDuration',
                            bLarge: true,
                            defVal: -1
                        },
                        {
                            name: '评论区最小用户等级过滤',
                            value: 'nMinimumLevel',
                            associated: 'nMaximumLevel',
                            defVal: -1
                        },
                        {
                            name: '评论区最大用户等级过滤',
                            value: 'nMaximumLevel',
                            associated: 'nMinimumLevel',
                            bLarge: true,
                            defVal: -1
                        }
                    ],
                    selectValue: 'nMinimumPlay',
                    inputMax: '',
                    inputMin: '0'
                }
            },
            methods: {
                okVideoSelectBut() {
                    const find = this.selectList.find(item => item.value === this.selectValue);
                    const associatedVal = gmUtil.getData(find.associated, -1);
                    const associatedFind = this.selectList.find(item => item.value === find.associated);
                    if (this.index > associatedVal && associatedVal !== -1) {
                        if (associatedFind.bLarge) {
                            xtip.alert(`要设置的${find.name}值不能大于${associatedFind.name}的值`);
                            return
                        }
                        console.log('正常修改');
                    }
                    xtip.alert(`已设置${find.name}，值为${this.index}`);
                    gmUtil.setData(this.selectValue, this.index);
                    this.updateInfo();
                },
                cancelBut() {
                    gmUtil.setData(this.selectValue, -1);
                    const find = this.selectList.find(item => item.value === this.selectValue);
                    xtip.alert(`已取消${find.name}的限制`);
                    this.updateInfo();
                },
                allCancelBut() {
                    for (let item of this.selectList) {
                        gmUtil.setData(item.value, -1);
                    }
                    this.updateInfo();
                },
                updateInfo() {
                    for (let item of this.selectList) {
                        item.defVal = gmUtil.getData(item.value, -1);
                    }
                },
                updateInfoBut() {
                    this.updateInfo();
                    xtip.alert('已刷新');
                },
            },
            watch: {
                selectValue(newVal) {
                    const find = this.selectList.find(item => item.value === newVal);
                    if (find.name.includes('用户等级')) {
                        this.inputMin = 3;
                        this.inputMax = 6;
                        if (this.index > 6) {
                            this.index = 6;
                        }
                        if (this.index < 3) {
                            this.index = 3;
                        }
                    } else {
                        this.inputMin = 0;
                        this.inputMax = '';
                    }
                }
            },
            created() {
                this.updateInfo();
            }
        })
    };
    const returnVue = () => {
        return new Vue({
            el: "#shield #compatible_setting",
            template: `
          <div>
            <div>
              <label>
                <input type="checkbox" v-model="adaptationBAppRecommend">首页屏蔽适配Bilibili-Gate脚本(bilibili-app-recommend)
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" v-model="compatible_BEWLY_BEWLY">兼容BewlyBewly插件
              </label>
              <div title="使用之后需刷新对应页面才可生效，勾选即评论区使用新版获取方式，不再使用旧版方式">
                <label>
                  <input type="checkbox" v-model="discardOldCommentAreasV">弃用旧版评论区处理
                </label>
              </div>
            </div>
          </div>`,
            data() {
                return {
                    adaptationBAppRecommend: localMKData.getAdaptationBAppCommerce(),
                    compatible_BEWLY_BEWLY: localMKData.isCompatible_BEWLY_BEWLY(),
                    discardOldCommentAreasV:localMKData.isDiscardOldCommentAreas()
                }
            },
            watch:{
                adaptationBAppRecommend(newVal) {
                    localMKData.setAdaptationBAppCommerce(newVal);
                },
                compatible_BEWLY_BEWLY(newVal) {
                    localMKData.setCompatible_BEWLY_BEWLY(newVal);
                },
                discardOldCommentAreasV(newVal) {
                    localMKData.setDiscardOldCommentAreas(newVal);
                }
            }
        })
    };
    document.querySelector("#output_information button")?.addEventListener("click", () => {
        olEL.innerHTML = "";
        alert("已清空消息");
    });
    const olEL = document.querySelector("#output_information>.info");
    const addInfo = (content) => {
        const liEL = document.createElement("li");
        liEL.innerHTML = content;
        olEL.appendChild(liEL);
    };
    const outputInformationFontColor = localMKData.getOutputInformationFontColor();
    const highlightInformationColor = localMKData.getHighlightInformationColor();
    eventEmitter.on('正则匹配时异常', (errorData) => {
        const {msg, e} = errorData;
        addInfo(msg);
        console.log(msg);
        throw new Error(e)
    });
    const getVideoInfoHtml = (type, matching, videoData) => {
        const toTimeString = defUtil.toTimeString();
        const {name, uid, title, videoUrl} = videoData;
        return `<b style="color: ${outputInformationFontColor}; " gz_bezel>
${toTimeString}-根据${type}-${matching ? `<b style="color: ${highlightInformationColor}">【${matching}】</b>` : ""}-屏蔽用户【${name}】uid=
            <a href="https://space.bilibili.com/${uid}"
            style="color: ${highlightInformationColor}"
            target="_blank">【${uid}】</a>
            标题【<a href="${videoUrl}" target="_blank" style="color: ${highlightInformationColor}">${title}</a>】
            </b>`
    };
    const getCommentInfoHtml = (type, matching, commentData) => {
        const toTimeString = defUtil.toTimeString();
        const {name, uid, content} = commentData;
        return `<b style="color: ${outputInformationFontColor}; " gz_bezel>
${toTimeString}-根据${type}-${matching ? `<b style="color: ${highlightInformationColor}">【${matching}】</b>` : ""}-屏蔽用户【${name}】uid=
            <a href="https://space.bilibili.com/${uid}"
            style="color: ${highlightInformationColor}"
            target="_blank">【${uid}】</a>
            评论【${content}】
            </b>`
    };
    const getLiveRoomCommentInfoHtml = (type, matching, commentData) => {
        const toTimeString = defUtil.toTimeString();
        const {name, uid, content} = commentData;
        return `<b style="color: ${outputInformationFontColor}; " gz_bezel>
${toTimeString}-根据${type}-${matching ? `<b style="color: ${highlightInformationColor}">【${matching}】</b>` : ""}-屏蔽用户【${name}】uid=
            <a href="https://space.bilibili.com/${uid}"
            style="color: ${highlightInformationColor}"
            target="_blank">【${uid}】</a>
            直播评论【${content}】
            </b>`
    };
    const getDynamicContentInfoHtml = (type, matching, dynamicData) => {
        const toTimeString = defUtil.toTimeString();
        const {name, uid, content} = dynamicData;
        return `<b style="color: ${outputInformationFontColor}; " gz_bezel>
${toTimeString}-根据${type}-${matching ? `<b style="color: ${highlightInformationColor}">【${matching}】</b>` : ""}-屏蔽用户【${name}】uid=
            <a href="https://space.bilibili.com/${uid}"
            style="color: ${highlightInformationColor}"
            target="_blank">【${uid}】</a>
            动态【${content}】
            </b>`
    };
    const getLiveRoomInfoHtml = (type, matching, liveRoomData) => {
        const toTimeString = defUtil.toTimeString();
        const {name = null, uid = -1, title, liveUrl} = liveRoomData;
        return `<b style="color: ${outputInformationFontColor};" gz_bezel>
${toTimeString}-根据${type}${matching ? `<b style="color: ${highlightInformationColor}">【${matching}】</b>` : ""}-屏蔽用户【${name === null ? '' : name}】${uid === -1 ? "" : `uid=
            <a href="https://space.bilibili.com/${uid}"
            style="color: ${highlightInformationColor}"
            target="_blank">【${uid}】</a>`}
            直播间标题【<a href="${liveUrl}" target="_blank" style="color: ${highlightInformationColor}">${title}</a>】
</b>`
    };
    var output_informationTab = {
        addInfo,
        getVideoInfoHtml,
        getCommentInfoHtml,
        getLiveRoomCommentInfoHtml,
        getDynamicContentInfoHtml,
        getLiveRoomInfoHtml
    };
    var css = `button {
    position: fixed;
    right: 5%;
    top: 13%;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border-width: 0;
    cursor: pointer;
    background: #0056b3;
}
`;
    const addLayout = () => {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.zIndex = '9001';
        div.style.display = localMKData.isHideRightTopMainButSwitch() ? 'none' : '';
        const but = document.createElement('button');
        but.textContent = '屏蔽器';
        const shadowRoot = div.attachShadow({mode: 'open'});
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        shadowRoot.appendChild(but);
        shadowRoot.appendChild(styleElement);
        document.querySelector('body').appendChild(div);
        but.addEventListener('click', () => mainDrawer.showDrawer());
        eventEmitter.on('右上角开关按钮显隐', (loop) => {
            div.style.display = !loop ? '' : 'none';
        });
    };
    var externalHoverSwitchPanelButton = {
        addLayout
    };
    returnVue$4();
    returnVue$3();
    returnVue$2();
    returnVue$1();
    returnVue();
    installAboutAndFeedbackComponentsVue('#station_b_shield_problem_feedback',
        {
            title: 'B站屏蔽增强器',
            gfFeedbackUrl: 'https://greasyfork.org/zh-CN/scripts/461382'
        }
    );
    gmUtil.addStyle(`
[gz_bezel]{
border:1px solid ${localMKData.getBorderColor()}
}
`);
    externalHoverSwitchPanelButton.addLayout();
    const getUrlUID = (url) => {
        let uid;
        if (url.startsWith('http')) {
            const parseUrl = defUtil.parseUrl(url);
            uid = parseUrl.pathSegments[0]?.trim();
            return parseInt(uid)
        }
        const isDoYouHaveAnyParameters = url.indexOf('?');
        const lastIndexOf = url.lastIndexOf("/");
        if (isDoYouHaveAnyParameters === -1) {
            if (url.endsWith('/')) {
                const nTheIndexOfTheLastSecondOccurrenceOfTheSlash = url.lastIndexOf('/', url.length - 2);
                uid = url.substring(nTheIndexOfTheLastSecondOccurrenceOfTheSlash + 1, url.length - 1);
            } else {
                uid = url.substring(lastIndexOf + 1);
            }
        } else {
            uid = url.substring(lastIndexOf + 1, isDoYouHaveAnyParameters);
        }
        return parseInt(uid);
    };
    const eventRegistry = new Map();
    function addEventListenerWithTracking(element, eventName, handler) {
        if (!eventRegistry.has(element)) {
            eventRegistry.set(element, new Map());
        }
        const elementEvents = eventRegistry.get(element);
        if (!elementEvents.has(eventName)) {
            elementEvents.set(eventName, new Set());
        }
        elementEvents.get(eventName).add(handler);
        element.addEventListener(eventName, handler);
    }
    function findElementUntilFound(selector, config = {}) {
        const defConfig = {doc: document, interval: 1000};
        config = {...defConfig, ...config};
        return new Promise((resolve) => {
            const i1 = setInterval(() => {
                const element = config.doc.querySelector(selector);
                if (element) {
                    resolve(element);
                    clearInterval(i1);
                }
            }, config.interval);
        });
    }
    function findElementsUntilFound(selector, config = {}) {
        const defConfig = {doc: document, interval: 1000};
        config = {...defConfig, ...config};
        return new Promise((resolve) => {
            function attemptToFind() {
                const elements = config.doc.querySelectorAll(selector);
                if (elements.length > 0) {
                    resolve(elements);
                } else {
                    setTimeout(attemptToFind, config.interval);
                }
            }
            attemptToFind();
        });
    }
    function findElementWithTimeout(selector, config = {}) {
        const defConfig = {
            doc: document,
            interval: 1000,
            timeout: 60000
        };
        config = {...defConfig, ...config};
        return new Promise((resolve) => {
            let intervalId;
            function attemptToFind() {
                const element = config.doc.querySelector(selector);
                if (element) {
                    clearInterval(intervalId);
                    resolve({
                        state: true,
                        msg: "已找到元素",
                        el: element
                    });
                }
            }
            intervalId = setInterval(attemptToFind, config.interval);
            const timeout = setTimeout(() => {
                clearInterval(intervalId);
                resolve({
                    state: false,
                    msg: "已超时:" + config.timeout
                }); // 超时后提示信息
                clearTimeout(timeout);
            }, config.timeout);
            attemptToFind(); // 立即尝试一次
        });
    }
    function findElementsWithTimeout(selector, config = {}) {
        const defConfig = {
            doc: document,
            interval: 1000,
            timeout: 60000
        };
        config = {...defConfig, ...config};
        return new Promise((resolve, reject) => {
            let timer;
            let intervalId;
            function attemptToFind() {
                const elements = config.doc.querySelectorAll(selector);
                if (elements.length > 0) {
                    clearTimeout(timer);
                    clearInterval(intervalId);
                    resolve(elements);
                }
            }
            intervalId = setInterval(attemptToFind, config.interval);
            timer = setTimeout(() => {
                clearInterval(intervalId);
                reject(null); // 超时后返回 null
            }, config.timeout);
            attemptToFind(); // 立即尝试一次
        });
    }
    const findElementsAndBindEvents = (css, callback, config = {}) => {
        config = {
            ...{
                interval: 2000,
                timeOut: 3000
            }, config
        };
        setTimeout(() => {
            findElementUntilFound(css, {interval: config.interval}).then((el) => {
                el.addEventListener("click", () => {
                    callback();
                });
            });
        }, config.timeOut);
    };
    var elUtil = {
        getUrlUID,
        addEventListenerWithTracking,
        findElementUntilFound,
        findElementWithTimeout,
        findElementsUntilFound,
        findElementsWithTimeout,
        findElementsAndBindEvents
    };
    const exactMatch = (ruleList, value) => {
        if (ruleList === null || ruleList === undefined) return false;
        if (!Array.isArray(ruleList)) return false
        return ruleList.some(item => item === value);
    };
    const regexMatch = (ruleList, value) => {
        if (ruleList === null || ruleList === undefined) return null;
        if (!Array.isArray(ruleList)) return null
        value = value.toLowerCase();
        value = value.split(/[\t\r\f\n\s]*/g).join("");
        const find = ruleList.find(item => {
            try {
                return value.search(item) !== -1;
            } catch (e) {
                const msg = `正则匹配失败，请检查规则列表中的正则表达式是否正确，错误信息：${e.message}`;
                eventEmitter.emit('正则匹配时异常', {e, msg});
                return false;
            }
        });
        return find === undefined ? null : find;
    };
    const fuzzyMatch = (ruleList, value) => {
        if (ruleList === null || ruleList === undefined) return null;
        if (!Array.isArray(ruleList)) return null
        const find = ruleList.find(item => value.includes(item));
        return find === undefined ? null : find;
    };
    var ruleMatchingUtil = {
        exactMatch,
        regexMatch,
        fuzzyMatch
    };
    const  Tip = {
        success(text, config) {
            Qmsg.success(text, config);
        },
        successBottomRight(text) {
            this.success(text, {position: "bottomright"});
        },
        videoBlock(text) {//屏蔽了视频的提示
            this.success(text, {position: "bottomright"});
        },
        info(text, config) {
            Qmsg.info(text, config);
        },
        infoBottomRight(text) {
            this.info(text, {position: "bottomright"});
        },
        error(text, config) {
            Qmsg.error(text, config);
        },
        errorBottomRight(text) {
            this.error(text, {position: "bottomright"});
        },
        warning(text, config) {
            Qmsg.warning(text, config);
        },
        config(cfg) {//设置全局Tip配置
            Qmsg.config(cfg);
        },
        loading(text, config) {
            return Qmsg.loading(text, config);
        },
        close(loading) {
            try {
                loading.close();
            } catch (e) {
                console.error(e);
                this.error("loading关闭失败！");
            }
        },
        printLn(content) {
            Util.printElement("#outputInfo", `<dd>${content}</dd>`);
        },
        printVideo(color, content, name, uid, title, videoHref) {
            Util.printElement("#outputInfo", `
        <dd><b
            style="color: ${color}; ">${Util.toTimeString()}${content}屏蔽用户【${name}】uid=<a href="https://space.bilibili.com/${uid}" target="_blank">【${uid}】</a>标题【<a href="${videoHref}" target="_blank">${title}</a>】</b>
        </dd>`);
        },
        printCommentOn(color, content, name, uid, primaryContent) {
            Util.printElement("#outputInfo", `
        <dd>
        <b  style="color: ${color}; ">${Util.toTimeString()}${content} 屏蔽用户【${name}】uid=<a href="https://space.bilibili.com/${uid}" target="_blank">【${uid}】</a>
   原言论=【${primaryContent}】</b>
</dd>`);
        }
    };
    const isTopicDetailPage = (url) => {
        return url.includes("//www.bilibili.com/v/topic/detail/")
    };
    const getDataList$1 = async () => {
        const elList = await elUtil.findElementsUntilFound(".list__topic-card");
        const list = [];
        for (let el of elList) {
            const name = el.querySelector(".bili-dyn-title").textContent.trim();
            const uidEl = el.querySelector(".bili-dyn-item__following");
            const uid = parseInt(uidEl.getAttribute("data-mid"));
            const judgmentEl = el.querySelector(".bili-dyn-card-video__title");
            const data = {name, uid, el, judgmentVideo: judgmentEl !== null};
            if (judgmentEl !== null) {
                data.title = judgmentEl.textContent.trim();
                data.videoUrl = el.querySelector(".bili-dyn-card-video").href;
                data.insertionPositionEl = el.querySelector(".bili-dyn-content__orig");
                data.explicitSubjectEl = data.insertionPositionEl;
            } else {
                const dynTitle = el.querySelector(".dyn-card-opus__title");
                const contentTitle = dynTitle === null ? "" : dynTitle.textContent.trim();
                const contentBody = el.querySelector(".bili-rich-text>div").textContent.trim();
                data.insertionPositionEl = el.querySelector(".dyn-card-opus");
                data.explicitSubjectEl = data.insertionPositionEl;
                data.content = contentTitle + contentBody;
            }
            list.push(data);
        }
        return list;
    };
    const __shieldingVideo = (videoData) => {
        if (shielding.shieldingVideoDecorated(videoData)) {
            return;
        }
        shielding.addTopicDetailVideoBlockButton({data: videoData, maskingFunc: startShielding});
    };
    const __shieldingDynamic = (dynamicData) => {
        if (shielding.shieldingCommentDecorated(dynamicData)) {
            return;
        }
        shielding.addTopicDetailContentsBlockButton({data: dynamicData, maskingFunc: startShielding});
    };
    const startShielding = async () => {
        const list = await getDataList$1();
        const css = {width: "100%"};
        for (let data of list) {
            data.css = css;
            if (data.judgmentVideo) {
                __shieldingVideo(data);
            } else {
                __shieldingDynamic(data);
            }
        }
    };
    var topicDetail = {
        isTopicDetailPage,
        startShielding
    };
    const getUrlUserLevel = (src) => {
        const levelMath = src?.match(/level_(.+)\.svg/) || null;
        let level = -1;
        if (levelMath !== null) {
            const levelRow = levelMath[1];
            if (levelRow === 'h') {
                level = 7;
            } else {
                level = parseInt(levelRow);
            }
        }
        return level;
    };
    const getOldUserLevel = (iEl) => {
        let level = -1;
        const levelCLassName = iEl.classList[1];
        if (levelCLassName === 'level-hardcore') {
            level = 7;
        } else {
            const levelMatch = levelCLassName.match(/level-(.+)/)?.[1] || '';
            level = parseInt(levelMatch);
        }
        return level
    };
    const getCommentSectionList = async () => {
        const commentApp = await elUtil.findElementUntilFound("bili-comments",
            {interval: 500});
        const comments = await elUtil.findElementsUntilFound("#feed>bili-comment-thread-renderer",
            {doc: commentApp.shadowRoot, interval: 500});
        const commentsData = [];
        let isLoaded = false;
        for (let el of comments) {
            const theOPEl = el.shadowRoot.getElementById("comment").shadowRoot;
            const theOPUserInfo = theOPEl.querySelector("bili-comment-user-info")
                .shadowRoot.getElementById("info");
            const userNameEl = theOPUserInfo.querySelector("#user-name>a");
            const userLevelSrc = theOPUserInfo.querySelector('#user-level>img')?.src || null;
            const level = getUrlUserLevel(userLevelSrc);
            isLoaded = theOPEl.querySelector("#content>bili-rich-text")
                .shadowRoot.querySelector("#contents>*") !== null;
            if (!isLoaded) {
                break;
            }
            const theOPContentEl = theOPEl.querySelector("#content>bili-rich-text")
                .shadowRoot.querySelector("#contents");
            const theOPContent = theOPContentEl.textContent.trim();
            const userName = userNameEl.textContent.trim();
            const userUrl = userNameEl.href;
            const uid = elUtil.getUrlUID(userUrl);
            const replies = [];
            commentsData.push({
                name: userName,
                userUrl,
                uid,
                level,
                content: theOPContent,
                replies,
                el,
                insertionPositionEl: theOPUserInfo,
                explicitSubjectEl: theOPEl.querySelector("#body")
            });
            const inTheBuildingEls = el.shadowRoot.querySelector("bili-comment-replies-renderer")
                .shadowRoot.querySelectorAll("bili-comment-reply-renderer");
            for (let inTheBuildingEl of inTheBuildingEls) {
                const inTheContentEl = inTheBuildingEl.shadowRoot;
                const biliCommentUserInfo = inTheContentEl.querySelector("bili-comment-user-info");
                biliCommentUserInfo.style.display = 'block';
                const inTheBuildingUserInfo = biliCommentUserInfo.shadowRoot.getElementById("info");
                const inTheBuildingUserNameEl = inTheBuildingUserInfo.querySelector("#user-name>a");
                const inTheBuildingUserName = inTheBuildingUserNameEl.textContent.trim();
                const inTheBuildingUserUrl = inTheBuildingUserNameEl.href;
                const inTheBuildingUid = elUtil.getUrlUID(inTheBuildingUserUrl);
                const biliRichTextEL = inTheContentEl.querySelector("bili-rich-text");
                const inTheBuildingContent = biliRichTextEL.shadowRoot.getElementById("contents").textContent.trim();
                const userLevelSrc = inTheBuildingUserInfo.querySelector('#user-level>img')?.src || null;
                const level = getUrlUserLevel(userLevelSrc);
                replies.push({
                    name: inTheBuildingUserName,
                    userUrl: inTheBuildingUserUrl,
                    uid: inTheBuildingUid,
                    level,
                    content: inTheBuildingContent,
                    el: inTheBuildingEl,
                    insertionPositionEl: inTheBuildingUserInfo,
                    explicitSubjectEl: inTheContentEl
                });
            }
        }
        if (!isLoaded) {
            await defUtil.wait(500);
            return getCommentSectionList()
        }
        return commentsData;
    };
    const getOldCommentSectionList = async () => {
        const results = await elUtil.findElementsWithTimeout(".reply-list>.reply-item");
        if (results === null) {
            return [];
        }
        const commentsData = [];
        for (let el of results) {
            const theOPEl = el.querySelector(".root-reply-container");
            const theOPUserInfoEl = theOPEl.querySelector(".user-name");
            const userName = theOPUserInfoEl.textContent.trim();
            const uid = parseInt(theOPUserInfoEl.getAttribute("data-user-id"));
            const userUrl = `https://space.bilibili.com/${uid}`;
            const theOPContent = theOPEl.querySelector(".reply-content").textContent.trim();
            const userInfoEl = el.querySelector(".user-info");
            const iEl = userInfoEl.querySelector('i');
            const level = getOldUserLevel(iEl);
            const replies = [];
            commentsData.push({
                name: userName,
                userUrl,
                uid,
                content: theOPContent,
                level,
                replies,
                el,
                insertionPositionEl: userInfoEl,
                explicitSubjectEl: el.querySelector(".content-warp")
            });
            const inTheBuildingEls = el.querySelectorAll(".sub-reply-container>.sub-reply-list>.sub-reply-item");
            for (let inTheBuildingEl of inTheBuildingEls) {
                const subUserNameEl = inTheBuildingEl.querySelector(".sub-user-name");
                const uid = parseInt(subUserNameEl.getAttribute("data-user-id"));
                const userName = subUserNameEl.textContent.trim();
                const userUrl = `https://space.bilibili.com/${uid}`;
                const subContent = inTheBuildingEl.querySelector(".reply-content").textContent.trim();
                const subUserInfoEl = inTheBuildingEl.querySelector(".sub-user-info");
                const iEl = subUserInfoEl.querySelector('i');
                const level = getOldUserLevel(iEl);
                const replyContentContainerEl = inTheBuildingEl.querySelector('span.reply-content-container');
                replyContentContainerEl.style.display = 'block';
                replies.push({
                    name: userName,
                    userUrl,
                    uid,
                    level,
                    content: subContent,
                    el: inTheBuildingEl,
                    insertionPositionEl: subUserInfoEl,
                    explicitSubjectEl: inTheBuildingEl
                });
            }
        }
        return commentsData;
    };
    const startShieldingComments = async () => {
        let list;
        const href = window.location.href;
        if (localMKData.isDiscardOldCommentAreas()) {
            list = await getCommentSectionList();
        } else if (href.includes("https://space.bilibili.com/") || topicDetail.isTopicDetailPage(href)) {
            list = await getOldCommentSectionList();
        } else {
            list = await getCommentSectionList();
        }
        shielding.shieldingComments(list);
    };
    var commentSectionModel = {
        startShieldingComments
    };
    const addBlockButton = (data, tagCss, position = []) => {
        const {insertionPositionEl, explicitSubjectEl, css} = data.data;
        if (insertionPositionEl.querySelector("." + tagCss)) return;
        const buttonEL = document.createElement("button");
        buttonEL.setAttribute("gz_type", "");
        buttonEL.className = tagCss;
        buttonEL.textContent = "标记";
        if (position.length !== 0) {
            buttonEL.style.position = "absolute";
        }
        if (position.includes("right")) {
            buttonEL.style.right = "0";
        }
        if (position.includes("bottom")) {
            buttonEL.style.bottom = "0";
        }
        if (css !== undefined) {
            for (let key of Object.keys(css)) {
                buttonEL.style[key] = css[key];
            }
        }
        buttonEL.style.display = "none";
        elUtil.addEventListenerWithTracking(explicitSubjectEl, "mouseover", () => buttonEL.style.display = "");
        elUtil.addEventListenerWithTracking(explicitSubjectEl, "mouseout", () => buttonEL.style.display = "none");
        insertionPositionEl.appendChild(buttonEL);
        buttonEL.addEventListener("click", (event) => {
            event.stopImmediatePropagation(); // 阻止事件冒泡和同一元素上的其他事件处理器
            event.preventDefault(); // 阻止默认行为
            const {uid, name} = data.data;
            console.log("该选项数据:", data);
            xtip.sheet({
                btn: [`uid精确屏蔽-用户uid=${uid}-name=${name}`, `用户名精确屏蔽(不推荐)-用户name=${name}`],
                btn1: () => {
                    if (uid === -1) {
                        Tip.error("该页面数据不存在uid字段");
                        return;
                    }
                    ruleUtil.addRule(uid, "precise_uid").then(msg => {
                        xtip.msg(msg);
                        data.maskingFunc();
                    }).catch(msg => {
                        xtip.alert(msg, {icon: 'e'});
                    });
                },
                btn2: () => {
                    if (!name) {
                        alert("该页面数据不存在name字段" + name);
                        return;
                    }
                    if (!window.confirm('不推荐用户使用精确用户名来屏蔽，确定继续吗？')) return
                    ruleUtil.addRulePreciseName(name);
                },
            });
        });
    };
    const addVideoBlockButton$1 = (data) => {
        addBlockButton(data, "gz_shielding_button", ["right"]);
    };
    const addPopularVideoBlockButton = (data) => {
        addBlockButton(data, "gz_shielding_button", ["right", "bottom"]);
    };
    const addTopicDetailVideoBlockButton = (data) => {
        addBlockButton(data, "gz_shielding_button");
    };
    const addTopicDetailContentsBlockButton = (data) => {
        const position = data.data.position;
        const loop = position !== undefined;
        addBlockButton(data, "gz_shielding_topic_detail_button", loop ? position : []);
    };
    const addCommentBlockButton = (commentsData) => {
        const data = {
            data: commentsData,
            maskingFunc: commentSectionModel.startShieldingComments
        };
        addBlockButton(data, "gz_shielding_comment_button");
    };
    const addLiveContentBlockButton = (commentsData) => {
        addBlockButton(commentsData, "gz_shielding_live_danmaku_button");
    };
    const shieldingVideo = (videoData) => {
        const {
            title, uid = -1,
            name, nDuration = -1,
            nBulletChat = -1, nPlayCount = -1
        } = videoData;
        if (ruleMatchingUtil.exactMatch(ruleKeyListData$1.getPreciseUidWhiteArr(), uid)) {
            return {state: false};
        }
        if (ruleMatchingUtil.exactMatch(ruleKeyListData$1.getPreciseUidArr(), uid)) {
            return {state: true, type: "精确匹配uid"};
        }
        let matching = ruleMatchingUtil.fuzzyMatch(ruleKeyListData$1.getTitleArr(), title);
        if (matching !== null) {
            return {state: true, type: "模糊匹配标题", matching};
        }
        matching = ruleMatchingUtil.regexMatch(ruleKeyListData$1.getTitleCanonicalArr(), title);
        if (matching !== null) {
            return {state: true, type: "正则匹配标题", matching};
        }
        if (ruleMatchingUtil.exactMatch(ruleKeyListData$1.getPreciseNameArr(), name)) {
            return {state: true, type: "精确匹配用户名"};
        }
        matching = ruleMatchingUtil.fuzzyMatch(ruleKeyListData$1.getNameArr(), name);
        if (matching !== null) {
            return {state: true, type: "模糊匹配用户名", matching};
        }
        matching = ruleMatchingUtil.regexMatch(ruleKeyListData$1.getNameCanonical(), name);
        if (matching !== null) {
            return {state: true, type: "正则用户名", matching};
        }
        if (nDuration !== -1) {
            const min = gmUtil.getData('nMinimumDuration', -1);
            if (min > nDuration && min !== -1) {
                return {state: true, type: '最小时长', matching: min}
            }
            const max = gmUtil.getData('nMaximumDuration', -1);
            if (max < nDuration && max !== -1) {
                return {state: true, type: '最大时长', matching: max}
            }
        }
        if (nBulletChat !== -1) {
            const min = gmUtil.getData('nMinimumBarrage', -1);
            if (min > nBulletChat && min !== -1) {
                return {state: true, type: '最小弹幕数', matching: min}
            }
            const max = gmUtil.getData('nMaximumBarrage', -1);
            if (max < nBulletChat && max !== -1) {
                return {state: true, type: '最大弹幕数', matching: max}
            }
        }
        if (nPlayCount !== -1) {
            const min = gmUtil.getData('nMinimumPlay', -1);
            if (min > nPlayCount && min !== -1) {
                return {state: true, type: '最小播放量', matching: min}
            }
            const max = gmUtil.getData('nMaximumPlayback', -1);
            if (max < nPlayCount && max !== -1) {
                return {state: true, type: '最大播放量', matching: max}
            }
        }
        return {state: false};
    };
    const shieldingVideoDecorated = (videoData, method = "remove") => {
        const {el} = videoData;
        if (el.style.display === "none") {
            return true
        }
        const {state, type, matching = null} = shieldingVideo(videoData);
        if (state) {
            if (method === "remove") {
                el?.remove();
            } else {
                el.style.display = "none";
            }
            Tip.successBottomRight("屏蔽了视频");
            const videoInfoHtml = output_informationTab.getVideoInfoHtml(type, matching, videoData);
            output_informationTab.addInfo(videoInfoHtml);
        }
        return state;
    };
    const shieldingDynamic = (dynamicData) => {
        const {
            content = null,
            el,
            title = null,
            tag = null
        } = dynamicData;
        let matching = null;
        if (content !== null) {
            matching = ruleMatchingUtil.fuzzyMatch(ruleKeyListData$1.getCommentOnArr(), content);
            if (matching !== null) {
                el?.remove();
                return {state: true, type: "评论模糊内容", matching};
            }
            matching = ruleMatchingUtil.regexMatch(ruleKeyListData$1.getCommentOnCanonicalArr(), content);
            if (matching !== null) {
                el?.remove();
                return {state: true, type: "评论正则内容", matching};
            }
        }
        if (title !== null) {
            matching = ruleMatchingUtil.fuzzyMatch(ruleKeyListData$1.getTitleArr(), title);
            if (matching !== null) {
                el?.remove();
                return {state: true, type: "模糊标题", matching};
            }
            matching = ruleMatchingUtil.regexMatch(ruleKeyListData$1.getTitleCanonicalArr(), title);
            if (matching !== null) {
                el?.remove();
                return {state: true, type: "正则标题", matching};
            }
        }
        if (tag !== null) {
            if (ruleMatchingUtil.exactMatch(ruleKeyListData$1.getPreciseTagArr(), tag)) {
                el?.remove();
                return {state: true, type: "精确tag"};
            }
            matching = ruleMatchingUtil.fuzzyMatch(ruleKeyListData$1.getTagArr(), tag);
            if (matching !== null) {
                el?.remove();
                return {state: true, type: "模糊tag", matching};
            }
            matching = ruleMatchingUtil.regexMatch(ruleKeyListData$1.getTagCanonicalArr(), tag);
            if (matching !== null) {
                el?.remove();
                return {state: true, type: "正则tag", matching};
            }
        }
        return {state: false}
    };
    const shieldingDynamicDecorated = (dynamicData) => {
        const {state, type, matching} = shieldingDynamic(dynamicData);
        if (state) {
            Tip.successBottomRight("屏蔽了视频");
            output_informationTab.addInfo(output_informationTab.getDynamicContentInfoHtml(type, matching, dynamicData));
        }
        return state;
    };
    const shieldingComment = (commentsData) => {
        const {content, uid, name, level = -1} = commentsData;
        if (ruleMatchingUtil.exactMatch(ruleKeyListData$1.getPreciseUidWhiteArr(), uid)) {
            return {state: false};
        }
        if (ruleMatchingUtil.exactMatch(ruleKeyListData$1.getPreciseUidArr(), uid)) {
            return {state: true, type: "精确匹配uid"};
        }
        if (ruleMatchingUtil.exactMatch(ruleKeyListData$1.getPreciseNameArr(), name)) {
            return {state: true, type: "精确用户名"};
        }
        let matching = ruleMatchingUtil.fuzzyMatch(ruleKeyListData$1.getNameArr(), name);
        if (matching !== null) {
            return {state: true, type: "模糊匹配用户名", matching};
        }
        matching = ruleMatchingUtil.regexMatch(ruleKeyListData$1.getNameCanonical(), name);
        if (matching !== null) {
            return {state: true, type: "正则用户名", matching};
        }
        matching = ruleMatchingUtil.fuzzyMatch(ruleKeyListData$1.getCommentOnArr(), content);
        if (matching !== null) {
            return {state: true, type: "模糊评论内容", matching};
        }
        matching = ruleMatchingUtil.regexMatch(ruleKeyListData$1.getCommentOnCanonicalArr(), content);
        if (matching !== null) {
            return {state: true, type: "正则评论内容", matching};
        }
        if (level !== -1) {
            const min = gmUtil.getData('nMinimumLevel', -1);
            if (min > level) {
                return {state: true, type: "评论区最小用户等级过滤", matching: min};
            }
            const max = gmUtil.getData('nMaximumLevel', -1);
            if (max > level) {
                return {state: true, type: "评论区最大用户等级过滤", matching: max};
            }
        }
        return {state: false};
    };
    const shieldingCommentDecorated = (commentsData) => {
        const {state, type, matching} = shieldingComment(commentsData);
        if (state) {
          const {el} = commentsData;
            el.style.backgroundColor = "rgba(255, 255, 0, 0.4)"; // 设置背景颜色
            el.style.display = "block";
            Tip.successBottomRight("已标记广告水军用户");
            output_informationTab.addInfo(output_informationTab.getCommentInfoHtml(type, matching, commentsData));
        }
        return state;
    };
    const shieldingLiveRoomContentDecorated = (liveRoomContent) => {
        let {state, type, matching} = shieldingComment(liveRoomContent);
        const {el, fansMedal} = liveRoomContent;
        if (fansMedal !== null) {
            if (ruleMatchingUtil.exactMatch(ruleKeyListData$1.getPreciseFanCardArr(), fansMedal)) {
                el?.remove();
                state = true;
                type = "精确粉丝牌";
            }
        }
        if (state) {
            el?.remove();
            Tip.successBottomRight("屏蔽了直播间评论");
        }
        if (type) {
            output_informationTab.addInfo(output_informationTab.getLiveRoomCommentInfoHtml(type, matching, liveRoomContent));
        }
        return state;
    };
    const shieldingComments = (commentsDataList) => {
        for (let commentsData of commentsDataList) {
            if (shieldingCommentDecorated(commentsData)) continue;
            addCommentBlockButton(commentsData);
            const {replies = []} = commentsData;
            if (replies.length === 0) continue;
            for (let reply of replies) {
                if (shieldingCommentDecorated(reply)) continue;
                addCommentBlockButton(reply);
            }
        }
    };
    const shieldingLiveRoom = (liveRoomData) => {
        const {name = null, title, partition, uid = -1} = liveRoomData;
        if (uid !== -1) {
            if (ruleMatchingUtil.exactMatch(ruleKeyListData$1.getPreciseUidWhiteArr(), uid)) {
                return {state: false};
            }
            if (ruleMatchingUtil.exactMatch(ruleKeyListData$1.getPreciseUidArr(), uid)) {
                return {state: true, type: "精确用户uid"};
            }
        }
        let matching;
        if (name !== null) {
            if (ruleMatchingUtil.exactMatch(ruleKeyListData$1.getPreciseNameArr(), name)) {
                return {state: true, type: "精确用户名"};
            }
            matching = ruleMatchingUtil.fuzzyMatch(ruleKeyListData$1.getNameArr(), name);
            if (matching) {
                return {state: true, type: "模糊用户名", matching};
            }
        }
        matching = ruleMatchingUtil.exactMatch(ruleKeyListData$1.getTitleArr(), title);
        if (matching) {
            return {state: true, type: "模糊标题", matching};
        }
        matching = ruleMatchingUtil.fuzzyMatch(ruleKeyListData$1.getTitleCanonicalArr(), title);
        if (matching) {
            return {state: true, type: "正则标题", matching};
        }
        if (ruleMatchingUtil.exactMatch(ruleKeyListData$1.getPrecisePartitionArr(), partition)) {
            return {state: true, type: "精确直播分区"};
        }
        return {state: false};
    };
    const shieldingLiveRoomDecorated = (liveRoomData) => {
        const {state, type, matching = null} = shieldingLiveRoom(liveRoomData);
        if (state) {
            liveRoomData.el?.remove();
            Tip.successBottomRight("屏蔽了直播间");
            output_informationTab.addInfo(output_informationTab.getLiveRoomInfoHtml(type, matching, liveRoomData));
        }
        return state;
    };
    const intervalExecutionStartShieldingVideoInert = (func, name = '') => {
        let i1 = -1;
        const start = () => {
            if (i1 !== -1) {
                return
            }
            console.log('开始执行屏蔽' + name);
            i1 = setInterval(() => {
                func();
                console.log(`执行屏蔽${name}列表-定时器正在执行`);
            }, 1500);
        };
        const stop = () => {
            if (i1 === -1) {
                return
            }
            clearInterval(i1);
            console.log(`已停止执行屏蔽${name}列表`);
            i1 = -1;
        };
        return {start, stop}
    };
    var shielding = {
        shieldingVideoDecorated,
        shieldingDynamicDecorated,
        shieldingCommentDecorated,
        shieldingLiveRoomDecorated,
        shieldingComments,
        addVideoBlockButton: addVideoBlockButton$1,
        addCommentBlockButton,
        shieldingLiveRoomContentDecorated,
        addLiveContentBlockButton,
        addPopularVideoBlockButton,
        addTopicDetailVideoBlockButton,
        addTopicDetailContentsBlockButton,
        intervalExecutionStartShieldingVideoInert,
        addBlockButton
    };
    const toPlayCountOrBulletChat = (str) => {
        if (!str) {
            return -1
        }
        str = str.split(/[\t\r\f\n\s]*/g).join("");
        const replace = str.replace(/[^\d.]/g, '');
        if (str.endsWith('万') || str.endsWith('万次') || str.endsWith('万弹幕')) {
            return parseFloat(replace) * 10000;
        }
        if (str.endsWith('次') || str.endsWith('弹幕')) {
            return parseInt(replace);
        }
        return parseInt(str)
    };
    const timeStringToSeconds = (timeStr) => {
        if (!timeStr) {
            return -1
        }
        const parts = timeStr.split(':');
        switch (parts.length) {
            case 1: // 只有秒
                return Number(parts[0]);
            case 2: // 分钟和秒
                return Number(parts[0]) * 60 + Number(parts[1]);
            case 3: // 小时、分钟和秒
                return Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
            default:
                throw new Error('Invalid time format');
        }
    };
    var sFormatUtil = {
        toPlayCountOrBulletChat,
        timeStringToSeconds
    };
    const isHome = (url, title) => {
        if (title !== "哔哩哔哩 (゜-゜)つロ 干杯~-bilibili") {
            return false
        }
        if (url === 'https://www.bilibili.com/') {
            return true
        }
        return url.includes('https://www.bilibili.com/?spm_id_from=')
    };
    const adaptationBAppCommerce$1 = localMKData.getAdaptationBAppCommerce();
    const deDesktopDownloadTipEl = async () => {
        const el = await elUtil.findElementUntilFound(".desktop-download-tip");
        el?.remove();
        const log = "已删除下载提示";
        Tip.infoBottomRight(log);
        console.log(log, el);
    };
    const getChangeTheVideoElList = async () => {
        const elList = await elUtil.findElementsUntilFound(".container.is-version8>.feed-card");
        const list = [];
        for (let el of elList) {
            try {
                const tempData = getVideoData(el);
                const {userUrl} = tempData;
                const videoUrl = el.querySelector(".bili-video-card__info--tit>a").href;
                if (!userUrl.includes("//space.bilibili.com/")) {
                    el?.remove();
                    const log = "遍历换一换视频列表中检测到异常内容，已将该元素移除";
                    Tip.infoBottomRight(log);
                    console.log(log, el);
                    continue;
                }
                list.push({
                    ...tempData, ...{
                        videoUrl,
                        el,
                        insertionPositionEl: el.querySelector(".bili-video-card__info--bottom"),
                        explicitSubjectEl: el.querySelector(".bili-video-card__info")
                    }
                });
            } catch (e) {
                el.remove();
                Qmsg.error("获取视频信息失败");
            }
        }
        return list
    };
    const getVideoData = (el) => {
        const title = el.querySelector(".bili-video-card__info--tit").title;
        const name = el.querySelector(".bili-video-card__info--author").textContent.trim();
        let nPlayCount = el.querySelector('.bili-video-card__stats--text')?.textContent.trim();
        nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
        let nBulletChat = el.querySelector('.bili-video-card__stats--text')?.textContent.trim();
        nBulletChat = sFormatUtil.toPlayCountOrBulletChat(nBulletChat);
        let nDuration = el.querySelector('.bili-video-card__stats__duration')?.textContent.trim();
        nDuration = sFormatUtil.timeStringToSeconds(nDuration);
        const userUrl = el.querySelector(".bili-video-card__info--owner").getAttribute("href");
        const uid = elUtil.getUrlUID(userUrl);
        return {
            title,
            name,
            uid,
            nPlayCount,
            nBulletChat,
            nDuration,
            userUrl
        }
    };
    const getHomeVideoELList = async () => {
        const elList = await elUtil.findElementsUntilFound(".container.is-version8>.bili-video-card");
        let list = [];
        for (let el of elList) {
            try {
                const tempData = getVideoData(el);
                const {userUrl} = tempData;
                if (!userUrl.includes("//space.bilibili.com/")) {
                    el?.remove();
                    const log = "遍历换一换视频列表下面列表时检测到异常内容，已将该元素移除";
                    Tip.infoBottomRight(log);
                    console.log(log, el);
                    continue;
                }
                list.push({
                    ...tempData, ...{
                        videoUrl: el.querySelector(".bili-video-card__info--tit>a").href,
                        el,
                        insertionPositionEl: el.querySelector(".bili-video-card__info--bottom"),
                        explicitSubjectEl: el.querySelector(".bili-video-card__info")
                    }
                });
            } catch (e) {
                el?.remove();
                Tip.infoBottomRight("遍历视频列表中检测到异常内容，已将该元素移除;");
            }
        }
        return list;
    };
    const getGateActivatedTab = async () => {
        const el = await elUtil.findElementUntilFound(".ant-radio-group>.ant-radio-button-wrapper-checked .css-1k4kcw8");
        return el?.textContent.trim();
    };
    const getGateDataList = async () => {
        const elList = await elUtil.findElementsUntilFound(".bilibili-gate-video-grid>[data-bvid].bili-video-card");
        const list = [];
        for (let el of elList) {
            const tempData = getVideoData(el);
            const videoUrl = el.querySelector("a.css-feo88y").href;
            const insertionPositionEl = el.querySelector(".bili-video-card__info--owner");
            list.push({
                ...tempData, ...{
                    videoUrl,
                    el,
                    insertionPositionEl,
                    explicitSubjectEl: el
                }
            });
        }
        return list;
    };
    const startShieldingGateVideoList = async () => {
        const list = await getGateDataList();
        for (let videoData of list) {
            if (shielding.shieldingVideoDecorated(videoData, "hide")) {
                continue;
            }
            shielding.addVideoBlockButton({data: videoData, maskingFunc: startShieldingGateVideoList});
        }
    };
    const startIntervalShieldingGateVideoList = () => {
        const throttle = defUtil.throttle(startShieldingGateVideoList, 2000);
        setInterval(async () => {
            await getGateActivatedTab();
            throttle();
        }, 1500);
    };
    const startClearExcessContentList = () => {
        if (adaptationBAppCommerce$1) return;
        setInterval(() => {
            const otherElList = document.querySelectorAll(".floor-single-card");
            const liveList = document.querySelectorAll(".bili-live-card");
            const elList = [...otherElList, ...liveList];
            for (let el of elList) {
                el?.remove();
            }
        }, 1000);
        console.log("已启动每秒清理首页视频列表中多余的内容");
    };
    const startShieldingChangeVideoList = async () => {
        const list = await getChangeTheVideoElList();
        for (let videoData of list) {
            if (shielding.shieldingVideoDecorated(videoData)) {
                continue;
            }
            shielding.addVideoBlockButton({data: videoData, maskingFunc: startShieldingChangeVideoList});
        }
    };
    const startDebounceShieldingChangeVideoList = defUtil.debounce(startShieldingChangeVideoList, 200);
    const startShieldingHomeVideoList = async () => {
        const homeVideoELList = await getHomeVideoELList();
        for (const videoData of homeVideoELList) {
            if (shielding.shieldingVideoDecorated(videoData)) {
                continue;
            }
            shielding.addVideoBlockButton({data: videoData, maskingFunc: startShieldingHomeVideoList});
        }
    };
    const startDebounceShieldingHomeVideoList = defUtil.debounce(startShieldingHomeVideoList, 500);
    const scrollMouseUpAndDown = async () => {
        if (adaptationBAppCommerce$1) return;
        await defUtil.smoothScroll(false, 100);
        return defUtil.smoothScroll(true, 600);
    };
    var bilibiliHome = {
        isHome,
        startClearExcessContentList,
        startDebounceShieldingChangeVideoList,
        startDebounceShieldingHomeVideoList,
        scrollMouseUpAndDown,
        deDesktopDownloadTipEl,
        startIntervalShieldingGateVideoList
    };
    const isSearch = (url) => {
        return url.includes("search.bilibili.com")
    };
    const getVideoList$1 = async (css) => {
        const elList = await elUtil.findElementsWithTimeout(css);
        const list = [];
        for (let el of elList) {
            const title = el.querySelector(".bili-video-card__info--tit").title;
            const userEl = el.querySelector(".bili-video-card__info--owner");
            let userUrl;
            try {
                userUrl = userEl.getAttribute("href");
            } catch (e) {
                console.error(e);
            }
            if (!userUrl.includes("//space.bilibili.com/")) {
                el?.remove();
                Tip.infoBottomRight("移除了非视频内容");
                console.log("移除了非视频内容", userUrl, el);
                continue;
            }
            const uid = elUtil.getUrlUID(userUrl);
            const name = userEl.querySelector(".bili-video-card__info--author").textContent.trim();
            const bili_video_card__stats_item = el.querySelectorAll('.bili-video-card__stats--item');
            let nPlayCount = bili_video_card__stats_item[0]?.textContent.trim();
            nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
            let nBulletChat = bili_video_card__stats_item[1]?.textContent.trim();
            nBulletChat = sFormatUtil.toPlayCountOrBulletChat(nBulletChat);
            let nDuration = el.querySelector('.bili-video-card__stats__duration')?.textContent.trim();
            nDuration = sFormatUtil.timeStringToSeconds(nDuration);
            list.push({
                title,
                userUrl,
                name,
                uid,
                nPlayCount,
                nBulletChat,
                nDuration,
                el,
                videoUrl: el.querySelector(".bili-video-card__info--right>a").href,
                insertionPositionEl: el.querySelector(".bili-video-card__info--bottom"),
                explicitSubjectEl: el.querySelector(".bili-video-card__info")
            });
        }
        return list;
    };
    const getTabComprehensiveSortedVideoList = () => {
        return getVideoList$1(".video.i_wrapper.search-all-list>.video-list>div");
    };
    const getOtherVideoList = () => {
        return getVideoList$1(".search-page.search-page-video>.video-list.row>div");
    };
    const startShieldingVideoList$6 = () => {
        getTabComprehensiveSortedVideoList().then(list => {
            for (let videoData of list) {
                if (shielding.shieldingVideoDecorated(videoData)) {
                    continue;
                }
                shielding.addVideoBlockButton({data: videoData, maskingFunc: startShieldingVideoList$6});
            }
            console.log("搜索页综合选项卡中的综合排序视频列表已处理完成");
        });
        getOtherVideoList().then(list => {
            for (let videoData of list) {
                if (shielding.shieldingVideoDecorated(videoData)) {
                    continue;
                }
                shielding.addVideoBlockButton({data: videoData, maskingFunc: startShieldingVideoList$6});
            }
        });
    };
    const startDebounceShieldingVideoList$1 = defUtil.debounce(startShieldingVideoList$6, 500);
    var searchModel = {
        isSearch,
        startDebounceShieldingVideoList: startDebounceShieldingVideoList$1
    };
    const getData = (key,defValue=null) => {
        const el = document.querySelector('#mk_data');
        if (el === null) {
            return defValue
        }
        const text = el.textContent.trim();
        const parse = JSON.parse(text);
        if (parse[key]) {
            return parse[key]
        }
        return defValue
    };
    const addData = (key, value) => {
        const el = document.querySelector('#mk_data');
        if (el === null) {
            const mk_data = document.createElement('div');
            mk_data.id = 'mk_data';
            mk_data.style.display = 'none';
            document.head.appendChild(mk_data);
            mk_data.textContent = JSON.stringify({[key]: value});
            return
        }
        const txt = el.textContent.trim();
        const parse = JSON.parse(txt);
        parse[key] = value;
        el.textContent = JSON.stringify(parse);
    };
    const setData = (key, value) => {
        addData(key, value);
    };
    var elData = {
        addData,
        getData,
        setData
    };
    const isVideoPlayPage = (url) => {
        return url.includes("www.bilibili.com/video");
    };
    const installSingleUserCreatorButton = async () => {
        const el = await elUtil.findElementUntilFound('.up-info-container');
        const installPositionEl = el.querySelector('.up-info--right');
        const butEl = document.createElement("button");
        butEl.setAttribute("gz_type", "");
        butEl.textContent = "屏蔽";
        butEl.style.width = "100%";
        butEl.style.display = 'none';
        const nameEl = installPositionEl.querySelector('a.up-name');
        butEl.addEventListener('click', () => {
            const name = nameEl.textContent.trim();
            const userUrl = nameEl.href;
            const uid = elUtil.getUrlUID(userUrl);
            console.log('点击了屏蔽按钮', name, userUrl, uid);
            xtip.confirm(`用户uid=${uid}-name=${name}`, {
                title: "uid精确屏蔽方式", icon: "a",
                btn1: () => {
                    if (uid === -1) {
                        Tip.error("该页面数据不存在uid字段");
                        return;
                    }
                    ruleUtil.addRulePreciseUid(uid);
                }
            });
        });
        elUtil.addEventListenerWithTracking(installPositionEl, 'mouseover', () => butEl.style.display = '');
        elUtil.addEventListenerWithTracking(installPositionEl, 'mouseout', () => butEl.style.display = 'none');
        installPositionEl.appendChild(butEl);
        Tip.infoBottomRight(`单作者添加屏蔽按钮成功`);
    };
    const creationTeamInsertsShieldButton = async () => {
        const elList = await elUtil.findElementsUntilFound('.container>.membersinfo-upcard-wrap>.membersinfo-upcard');
        for (let item of elList) {
            const butEL = document.createElement('button');
            butEL.className = "gz_button gz_demo";
            butEL.textContent = "屏蔽";
            butEL.style.display = 'none';
            const userUrl = item.querySelector('.avatar').href;
            const uid = elUtil.getUrlUID(userUrl);
            const name = item.querySelector('.staff-name').textContent.trim();
            butEL.addEventListener('click', () => {
                xtip.confirm(`uid=${uid}-name=${name}`, {
                    title: "uid精确屏蔽方式", icon: "a",
                    btn1: () => {
                        if (uid === -1) {
                            Tip.error("该页面数据不存在uid字段");
                            return;
                        }
                        ruleUtil.addRulePreciseUid(uid);
                    }
                });
            });
            item.appendChild(butEL);
            elUtil.addEventListenerWithTracking(item, 'mouseover', () => butEL.style.display = '');
            elUtil.addEventListenerWithTracking(item, 'mouseout', () => butEL.style.display = 'none');
        }
        Tip.infoBottomRight(`创作团队添加屏蔽按钮成功`);
    };
    const execAuthorAddBlockButton = () => {
        elUtil.findElementWithTimeout('.header.can-pointer', {timeout: 4000}).then(res => {
            if (res.state) {
                creationTeamInsertsShieldButton();
                elData.setData('isSingleAuthor', false);
                return
            }
            if (elData.getData('isSingleAuthor', false)) {
                return;
            }
            elData.setData('isSingleAuthor', true);
            installSingleUserCreatorButton();
        });
    };
    const getGetTheVideoListOnTheRight$1 = async () => {
        await elUtil.findElementUntilFound(".video-page-card-small .b-img img");
        const elList = await elUtil.findElementsUntilFound(".video-page-card-small", {interval: 50});
        const list = [];
        for (let el of elList) {
            try {
                const elInfo = el.querySelector(".info");
                const title = elInfo.querySelector(".title").title;
                const name = elInfo.querySelector(".upname .name").textContent.trim();
                const userUrl = elInfo.querySelector(".upname>a").href;
                const uid = elUtil.getUrlUID(userUrl);
                const playInfo = el.querySelector('.playinfo').innerHTML.trim();
                let nPlayCount = playInfo.match(/<\/svg>(.*)<svg/s)?.[1].trim();
                nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
                let nBulletChat = playInfo.match(/class="dm".+<\/svg>(.+)$/s)?.[1].trim();
                nBulletChat = sFormatUtil.toPlayCountOrBulletChat(nBulletChat);
                let nDuration = el.querySelector('.duration')?.textContent.trim();
                nDuration = sFormatUtil.timeStringToSeconds(nDuration);
                list.push({
                    title,
                    userUrl,
                    name,
                    uid,
                    nPlayCount,
                    nBulletChat,
                    nDuration,
                    el,
                    videoUrl: el.querySelector(".info>a").href,
                    insertionPositionEl: el.querySelector(".playinfo"),
                    explicitSubjectEl: elInfo
                });
            } catch (e) {
                console.error("获取右侧视频列表失败:", e);
            }
        }
        return list;
    };
    const startShieldingVideoList$5 = () => {
        getGetTheVideoListOnTheRight$1().then((videoList) => {
            for (let videoData of videoList) {
                if (shielding.shieldingVideoDecorated(videoData)) {
                    continue;
                }
                shielding.addVideoBlockButton({data: videoData, maskingFunc: startShieldingVideoList$5});
            }
        });
    };
    const findTheExpandButtonForTheListOnTheRightAndBindTheEvent$2 = () => {
        setTimeout(() => {
            elUtil.findElementUntilFound(".rec-footer", {interval: 2000}).then((el) => {
                console.log("找到右侧视频列表的展开按钮");
                console.log(el);
                el.addEventListener("click", () => {
                    startShieldingVideoList$5();
                });
            });
        }, 3000);
    };
    var videoPlayModel = {
        isVideoPlayPage,
        startShieldingVideoList: startShieldingVideoList$5,
        findTheExpandButtonForTheListOnTheRightAndBindTheEvent: findTheExpandButtonForTheListOnTheRightAndBindTheEvent$2,
        execAuthorAddBlockButton
    };
    const getPlayCountAndBulletChatAndDuration = (el) => {
        const playInfo = el.querySelector('.playinfo').innerHTML.trim();
        let nPlayCount = playInfo.match(/<\/svg>(.*)<svg/s)?.[1].trim();
        nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
        let nBulletChat = playInfo.match(/class="dm-icon".+<\/svg>(.+)$/s)?.[1].trim();
        nBulletChat = sFormatUtil.toPlayCountOrBulletChat(nBulletChat);
        let nDuration = el.querySelector('.duration')?.textContent.trim();
        nDuration = sFormatUtil.timeStringToSeconds(nDuration);
        return {
            nPlayCount, nBulletChat, nDuration
        }
    };
    var generalFuc = {getPlayCountAndBulletChatAndDuration};
    const iscCollectionVideoPlayPage = (url) => {
        return url.includes("www.bilibili.com/list/ml")
    };
    const getGetTheVideoListOnTheRight = async () => {
        const elList = await elUtil.findElementsUntilFound(".recommend-list-container>.video-card");
        const list = [];
        for (let el of elList) {
            const title = el.querySelector(".title").title;
            const name = el.querySelector(".name").textContent.trim();
            const userUrl = el.querySelector(".upname").href;
            const uid = elUtil.getUrlUID(userUrl);
            list.push({
                ...generalFuc.getPlayCountAndBulletChatAndDuration(el), ...{
                    title,
                    name,
                    userUrl,
                    videoUrl: el.querySelector(".info>a").href,
                    uid,
                    el,
                    insertionPositionEl: el.querySelector(".playinfo"),
                    explicitSubjectEl: el.querySelector(".info")
                }
            });
        }
        return list;
    };
    const startShieldingVideoList$4 = () => {
        getGetTheVideoListOnTheRight().then((videoList) => {
            const css = {right: "123px"};
            for (let videoData of videoList) {
                if (shielding.shieldingVideoDecorated(videoData)) continue;
                videoData.css = css;
                shielding.addVideoBlockButton({data: videoData, maskingFunc: startShieldingVideoList$4});
            }
        });
    };
    const findTheExpandButtonForTheListOnTheRightAndBindTheEvent$1 = () => {
        setTimeout(() => {
            elUtil.findElementUntilFound(".rec-footer", {interval: 2000}).then((el) => {
                el.addEventListener("click", () => {
                    startShieldingVideoList$4();
                });
            });
        }, 3000);
    };
    var collectionVideoPlayPageModel = {
        iscCollectionVideoPlayPage,
        startShieldingVideoList: startShieldingVideoList$4,
        findTheExpandButtonForTheListOnTheRightAndBindTheEvent: findTheExpandButtonForTheListOnTheRightAndBindTheEvent$1
    };
    const addEventListenerUrlChange = (callback) => {
        let oldUrl = window.location.href;
        setInterval(() => {
            const newUrl = window.location.href;
            if (oldUrl === newUrl) return;
            oldUrl = newUrl;
            const title = document.title;
            callback(newUrl, oldUrl, title);
        }, 1000);
    };
    const addEventListenerNetwork = (callback) => {
        new PerformanceObserver(() => {
            const entries = performance.getEntriesByType('resource');
            const windowUrl = window.location.href;
            const winTitle = document.title;
            for (let entry of entries) {
                const url = entry.name;
                const initiatorType = entry.initiatorType;
                if (initiatorType === "img" || initiatorType === "css" || initiatorType === "link" || initiatorType === "beacon") {
                    continue;
                }
                callback(url, windowUrl,winTitle, initiatorType);
            }
            performance.clearResourceTimings();//清除资源时间
        }).observe({entryTypes: ['resource']});
    };
    function watchElementListLengthWithInterval(selector, callback, config={}) {
        const defConfig = {};
        config = {...defConfig, ...config};
        let previousLength = -1;
        const timer = setInterval(() => {
                if (previousLength === -1) {
                    previousLength = document.querySelectorAll(selector).length;
                    return
                }
                const currentElements = document.querySelectorAll(selector);
                const currentLength = currentElements.length;
                if (currentLength !== previousLength) {
                    previousLength = currentLength;
                    callback({
                            action: currentLength > previousLength ? 'add' : 'del',
                            elements: currentElements,
                            length: currentLength
                        }
                    );
                }
            },
            config.interval
        );
        return stop = () => {
            clearInterval(timer);
        };
    }
    var watch = {
        addEventListenerUrlChange,
        addEventListenerNetwork,
        watchElementListLengthWithInterval
    };
    const isLiveRoom = (url) => {
        return url.search('/live.bilibili.com/\\d+') !== -1;
    };
    const getChatItems = async () => {
        const elList = await elUtil.findElementsUntilFound("#chat-items>div");
        if (elList.length >= 200) {
            for (let i = 0; i < 100; i++) {
                elList[i]?.remove();
            }
            console.log("弹幕列表超过200，已删除前100条");
        }
        const list = [];
        for (let el of elList) {
            if (el.className === "chat-item  convention-msg border-box") {
                continue;
            }
            if (el.className === "chat-item misc-msg guard-buy") {
                continue;
            }
            const name = el.getAttribute("data-uname");
            if (name === null) {
                continue;
            }
            const uid = el.getAttribute("data-uid");
            const content = el.getAttribute("data-danmaku");
            const timeStamp = el.getAttribute("data-timestamp");
            const fansMedalEl = el.querySelector(".fans-medal-content");
            const fansMedal = fansMedalEl === null ? null : fansMedalEl.textContent.trim();
            list.push({
                name,
                uid,
                content,
                timeStamp,
                fansMedal,
                el,
                insertionPositionEl: el,
                explicitSubjectEl: el
            });
        }
        return list;
    };
    const startShieldingLiveChatContents = async () => {
        const commentsDataList = await getChatItems();
        for (let commentsData of commentsDataList) {
            if (shielding.shieldingLiveRoomContentDecorated(commentsData)) {
                continue;
            }
            shielding.addLiveContentBlockButton({data: commentsData, maskingFunc: startShieldingLiveChatContents});
        }
    };
    const addWatchLiveRoomChatItemsListener = () => {
        const throttle = defUtil.throttle(startShieldingLiveChatContents, 1000);
        watch.watchElementListLengthWithInterval("#chat-items>div", throttle);
    };
    var liveRoomModel = {
        isLiveRoom,
        addWatchLiveRoomChatItemsListener
    };
    const getVideDataList = async (isWeekly = false) => {
        const css = isWeekly ? ".video-list>.video-card" : ".card-list>.video-card";
        const elList = await elUtil.findElementsUntilFound(css);
        const list = [];
        for (let el of elList) {
            const videoCardInfoEl = el.querySelector(".video-card__info");
            const title = videoCardInfoEl.querySelector(".video-name").title.trim();
            const name = videoCardInfoEl.querySelector(".up-name__text").title;
            let nPlayCount = el.querySelector('.play-text').textContent.trim();
            nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
            let nBulletChat = el.querySelector('.like-text').textContent.trim();
            nBulletChat = sFormatUtil.toPlayCountOrBulletChat(nBulletChat);
            list.push({
                el,
                title,
                name,
                uid: -1,
                nPlayCount,
                nBulletChat,
                nDuration: -1,
                insertionPositionEl: videoCardInfoEl.querySelector("div"),
                explicitSubjectEl: videoCardInfoEl
            });
        }
        return list;
    };
    const startShieldingVideoList$3 = async (isWeekly = false) => {
        const list = await getVideDataList(isWeekly);
        for (let videoData of list) {
            if (shielding.shieldingVideoDecorated(videoData)) {
                continue;
            }
            shielding.addPopularVideoBlockButton({data: videoData, maskingFunc: startShieldingVideoList$3});
        }
    };
    var popularAll = {
        startShieldingVideoList: startShieldingVideoList$3
    };
    const generalUrl=[
        "popular/rank/all",
        "popular/rank/douga",
        "popular/rank/music",
        "popular/rank/dance",
        "popular/rank/game",
        "popular/rank/knowledge",
        "popular/rank/tech",
        "popular/rank/sports",
        "popular/rank/car",
        "popular/rank/life",
        "popular/rank/food",
        "popular/rank/animal",
        "popular/rank/kichiku",
        "popular/rank/fashion",
        "popular/rank/ent",
        "popular/rank/cinephile",
        "popular/rank/origin",
        "popular/rank/rookie"
    ];
    const isPopularHistory = (url) => {
        return url.includes("popular/history")
    };
    const isPopularAllPage = (url) => {
        return url.includes("www.bilibili.com/v/popular/all");
    };
    const isPopularWeeklyPage = (url) => {
        return url.includes("www.bilibili.com/v/popular/weekly");
    };
    const isGeneralPopularRank=(url)=>{
        return generalUrl.some(itemUrl => url.includes(itemUrl));
    };
    const getVideoDataList$2 = async () => {
        const elList = await elUtil.findElementsUntilFound(".rank-list>li");
        const list = [];
        for (let el of elList) {
            const title = el.querySelector(".title").textContent.trim();
            const userUrl = el.querySelector(".detail>a").href;
            const uid = elUtil.getUrlUID(userUrl);
            const name = el.querySelector(".up-name").textContent.trim();
            const detailStateEls = el.querySelectorAll('.detail-state>.data-box');
            let nPlayCount = detailStateEls[0].textContent.trim();
            nPlayCount = sFormatUtil.toPlayCountOrBulletChat(nPlayCount);
            let nBulletChat = detailStateEls[1].textContent.trim();
            nBulletChat = sFormatUtil.toPlayCountOrBulletChat(nBulletChat);
            list.push({
                title,
                userUrl,
                uid,
                name,
                nPlayCount,
                nBulletChat,
                nDuration: -1,
                el,
                insertionPositionEl: el.querySelector(".detail-state"),
                explicitSubjectEl: el.querySelector(".info")
            });
        }
        return list;
    };
    const startShieldingRankVideoList = async () => {
        const list = await getVideoDataList$2();
        for (let videoData of list) {
            if (shielding.shieldingVideoDecorated(videoData)) {
                continue;
            }
            shielding.addPopularVideoBlockButton({data: videoData, maskingFunc: startShieldingRankVideoList});
        }
    };
    var popular = {
        isPopularHistory,
        isPopularAllPage,
        isGeneralPopularRank,
        isPopularWeeklyPage,
        startShieldingRankVideoList,
    };
    const cacheData = {
        isPersonalHomepage: null,
    };
    const isSpacePage = (url) => {
        return url.startsWith('https://space.bilibili.com/')
    };
    const isPersonalHomepage = async () => {
        if (cacheData.isPersonalHomepage !== null) {
            return cacheData.isPersonalHomepage;
        }
        const {state} = await elUtil.findElementWithTimeout(".h-action", {timeout: 2000, interval: 200});
        const res = !state;
        cacheData.isPersonalHomepage = res;
        return res;
    };
    const isThrottleAsyncPersonalHomepage = defUtil.throttleAsync(isPersonalHomepage, 2000);
    const __insertButton = (el, label, callback = null) => {
        const liEl = document.createElement("li");
        liEl.textContent = label;
        liEl.className = 'be-dropdown-item';
        el.insertAdjacentElement('afterbegin', liEl);
        liEl.addEventListener('click', callback);
    };
    const initializePageBlockingButton = async () => {
        const is = await isThrottleAsyncPersonalHomepage();
        if (is) return
        const el = await elUtil.findElementUntilFound('.be-dropdown-menu.menu-align-');
        const urlUID = elUtil.getUrlUID(window.location.href);
        const nameEl = await elUtil.findElementUntilFound('#h-name');
        if (ruleKeyListData$1.getPreciseUidArr().includes(urlUID)) {
            console.log('当前用户为已标记uid黑名单');
            return
        }
        const name = nameEl.textContent;
        const name_label = '用户名精确屏蔽';
        __insertButton(el, name_label, () => {
            xtip.confirm(`屏蔽的对象为${urlUID}【${name}】`, {
                title: name_label, icon: "a",
                btn1: () => {
                    ruleUtil.addRulePreciseName(name);
                }
            });
        });
        const uid_label = 'uid精确屏蔽';
        __insertButton(el, uid_label, () => {
            xtip.confirm(`屏蔽的对象为${urlUID}【${name}】`, {
                title: uid_label, icon: "a",
                btn1: () => {
                    ruleUtil.addRulePreciseUid(urlUID);
                }
            });
        });
        Tip.infoBottomRight('用户空间页面屏蔽按钮插入成功');
    };
    var space = {
        isThrottleAsyncPersonalHomepage,
        initializePageBlockingButton,
        isSpacePage
    };
    const isDynamicPage = (url) => {
        return url.search("space.bilibili.com/\\d+/dynamic") !== -1;
    };
    const getDataList = async () => {
        const elList = await elUtil.findElementsUntilFound(".bili-dyn-list__items>.bili-dyn-list__item");
        const list = [];
        for (let el of elList) {
            const videoCardEl = el.querySelector(".bili-dyn-card-video__title");
            const name = el.querySelector(".bili-dyn-title").textContent.trim();
            const tagEl = el.querySelector(".bili-dyn-topic__text");
            const data = {el, name};
            if (tagEl !== null) {
                data.tag = tagEl.textContent.trim();
            }
            data.judgmentVideo = videoCardEl !== null;
            if (data.judgmentVideo) {
                data.title = videoCardEl.textContent.trim();
            } else {
                const contentTitleEL = el.querySelector(".dyn-card-opus>.dyn-card-opus__title");
                const contentTitle = contentTitleEL === null ? "" : contentTitleEL.textContent.trim();
                const contentElBody = el.querySelector(".bili-rich-text").textContent.trim();
                data.content = contentTitle + contentElBody;
            }
            list.push(data);
        }
        return list;
    };
    const startShieldingDynamicContent = async () => {
        const personalHomepage = await space.isThrottleAsyncPersonalHomepage();
        if (personalHomepage) return;
        const list = await getDataList();
        for (let dynamicContent of list) {
            shielding.shieldingDynamicDecorated(dynamicContent);
        }
    };
    const startThrottleShieldingDynamicContent = defUtil.throttle(startShieldingDynamicContent, 2000);
    var dynamic = {
        isDynamicPage,
        startThrottleShieldingDynamicContent
    };
    const isVideoPlayWatchLaterPage = (url) => {
        return url.startsWith("https://www.bilibili.com/list/watchlater")
    };
    const getRightVideoDataList = async () => {
        const elList = await elUtil.findElementsUntilFound(".recommend-video-card.video-card");
        const list = [];
        for (let el of elList) {
            const title = el.querySelector(".title").textContent.trim();
            const userInfoEl = el.querySelector(".upname");
            const name = userInfoEl.querySelector(".name").textContent.trim();
            const userUrl = userInfoEl.href;
            const uid = elUtil.getUrlUID(userUrl);
            list.push({
                ...generalFuc.getPlayCountAndBulletChatAndDuration(el), ...{
                    title,
                    name,
                    userUrl,
                    videoUrl: el.querySelector(".info>a").href,
                    uid,
                    el,
                    insertionPositionEl: el.querySelector(".playinfo"),
                    explicitSubjectEl: el.querySelector(".info")
                }
            });
        }
        return list;
    };
    const startShieldingVideoList$2 = async () => {
        const videoList = await getRightVideoDataList();
        const css = {right: "123px"};
        for (let videoData of videoList) {
            videoData.css = css;
            if (shielding.shieldingVideoDecorated(videoData)) continue;
            shielding.addVideoBlockButton({data: videoData, maskingFunc: startShieldingVideoList$2});
        }
    };
    const startDebounceShieldingVideoList = defUtil.debounce(startShieldingVideoList$2, 1000);
    const findTheExpandButtonForTheListOnTheRightAndBindTheEvent = () => {
        elUtil.findElementsAndBindEvents(".rec-footer", startDebounceShieldingVideoList);
    };
    var videoPlayWatchLater = {
        isVideoPlayWatchLaterPage,
        startDebounceShieldingVideoList,
        findTheExpandButtonForTheListOnTheRightAndBindTheEvent
    };
    const isLiveSection = (url) => {
        return url.includes("live.bilibili.com/p/eden/area-tags")
    };
    const getRoomCardDataList = async () => {
        const elList = await elUtil.findElementsUntilFound("#room-card-list>div");
        const list = [];
        for (let el of elList) {
            const liveUrl = el.querySelector("#card").href;
            const name = el.querySelector(".Item_nickName_KO2QE").textContent.trim();
            const title = el.querySelector(".Item_roomTitle_ax3eD").textContent.trim();
            const partition = el.querySelector(".Item_area-name_PXDG4")?.textContent.trim() || null;
            const popularity = el.querySelector(".Item_onlineCount_FmOW6").textContent.trim();
            list.push({liveUrl, name, title, partition, popularity, el});
        }
        return list;
    };
    const startShieldingLiveRoom$1 = async () => {
        const liveList = await getRoomCardDataList();
        for (let liveData of liveList) {
            shielding.shieldingLiveRoomDecorated(liveData);
        }
    };
    var liveSectionModel = {
        isLiveSection,
        startShieldingLiveRoom: startShieldingLiveRoom$1
    };
    const isLiveHomePage = (url) => {
        return url.includes("https://live.bilibili.com/?spm_id_from=333.1007.0.0") ||
            url === "https://live.bilibili.com/"
    };
    const getTopLiveRoomDataList = async () => {
        const verification = await elUtil.findElementUntilFound(".v-top>.aside-item .t-left.aside-item-tips.p-absolute.w-100.border-box");
        if (verification.textContent.trim() === "--") {
            return await getTopLiveRoomDataList();
        }
        const elList = await elUtil.findElementsUntilFound(".v-top>.aside-item", {interval: 2000});
        const list = [];
        for (let el of elList) {
            const classList = el.classList;
            const active = classList.contains("active");
            const title = el.getAttribute("title");
            const {up_id: uid, room_id} = JSON.parse(el.getAttribute("data-report"));
            const liveUrl = `https://live.bilibili.com/${room_id}`;
            list.push({title, uid, active, liveUrl, el});
        }
        return list;
    };
    const getLiveRoomDataList = async () => {
        const elList = await elUtil.findElementsUntilFound(".room-card-wrapper.p-relative.dp-i-block");
        const list = [];
        for (let el of elList) {
            const cardEl = el.querySelector(".room-card-ctnr.p-relative.w-100");
            const cardData = JSON.parse(cardEl.getAttribute("data-bl-report-click") || "");
            const {up_id: uid, room_id} = cardData.msg;
            const liveUrl = `https://live.bilibili.com/${room_id}`;
            const name = el.querySelector(".room-anchor>span").textContent.trim();
            const title = el.querySelector(".room-title.card-text").textContent.trim();
            const partition = el.querySelector(".area-name").textContent.trim();
            const popularity = el.querySelector(".room-anchor .v-middle").textContent.trim();
            list.push({name, title, partition, popularity, liveUrl, uid, el});
        }
        return list;
    };
    const startShieldingLiveRoom = async () => {
        const list = await getLiveRoomDataList();
        for (let liveData of list) {
            shielding.shieldingLiveRoomDecorated(liveData);
        }
    };
    const startShieldingTopLiveRoom = async () => {
        const list = await getTopLiveRoomDataList();
        for (let liveData of list) {
            shielding.shieldingLiveRoomDecorated(liveData);
        }
    };
    var liveHome = {
        isLiveHomePage,
        startShieldingLiveRoom,
        startShieldingTopLiveRoom
    };
    const getBewlyEl = async () => {
        let el = await elUtil.findElementUntilFound('#bewly', {interval: 500});
        return el.shadowRoot;
    };
    const isBEWLYPage = (url) => {
        return url.includes('www.bilibili.com/?page=') ||
            url === 'https://www.bilibili.com/'
            || url.startsWith('https://www.bilibili.com/?spm_id_from=')
    };
    const getVideoList = async () => {
        const beEl = await getBewlyEl();
        const elList = await elUtil.findElementsUntilFound('.video-card.group', {doc: beEl});
        const list = [];
        for (let el of elList) {
            const parentElement = el.parentElement.parentElement;
            const title = el.querySelector('.keep-two-lines>a[title]').textContent.trim();
            const userUrlEl = el.querySelector('.channel-name');
            const userUrl = userUrlEl.href;
            const uid = elUtil.getUrlUID(userUrl);
            const name = userUrlEl.textContent.trim();
            const playInfoEl = el.querySelector('[flex="~ items-center gap-1 wrap"]>div');
            let playCount = playInfoEl.querySelector('span:first-child')?.textContent.trim() || null;
            playCount = sFormatUtil.toPlayCountOrBulletChat(playCount);
            let bulletChat = playInfoEl.querySelector('span:last-of-type')?.textContent.trim() || null;
            if (playInfoEl.querySelectorAll('span').length < 2) {
                bulletChat = -1;
            } else {
                bulletChat = sFormatUtil.toPlayCountOrBulletChat(bulletChat);
            }
            let nDuration = el.querySelector('[class*="group-hover:opacity-0"]')?.textContent.trim() || null;
            nDuration = sFormatUtil.timeStringToSeconds(nDuration);
            const videoUrl = el.querySelector('[href*="https://www.bilibili.com/video"]')?.href || null;
            const insertionPositionEl = el.querySelector('[class="group/desc"]');
            list.push({
                title,
                name,
                uid,
                userUrl,
                videoUrl,
                playCount,
                bulletChat,
                nDuration,
                el: parentElement,
                insertionPositionEl,
                explicitSubjectEl: parentElement
            });
        }
        return list
    };
    const getRightTabs = async () => {
        const beEl = await getBewlyEl();
        const els = await elUtil.findElementsUntilFound(".dock-content-inner>.b-tooltip-wrapper", {doc: beEl});
        const list = [];
        for (let el of els) {
            const label = el.querySelector('.b-tooltip').textContent.trim();
            const active = !!el.querySelector('.dock-item.group.active');
            list.push({label, active, el});
        }
        return list;
    };
    const getHistoryVideoDataList = async () => {
        const beEL = await getBewlyEl();
        const elList = await elUtil.findElementsUntilFound("a.group[flex][cursor-pointer]", {doc: beEL});
        const list = [];
        for (let el of elList) {
            const titleEl = el.querySelector('h3.keep-two-lines');
            const videoUrlEl = titleEl.parentElement;
            const userEl = videoUrlEl.nextElementSibling;
            const videoUrl = videoUrlEl.href;
            const userUrl = userEl.href;
            const uid = elUtil.getUrlUID(userUrl);
            const name = userEl.textContent.trim();
            const title = titleEl?.textContent.trim();
            const tempTime = el.querySelector('div[pos][rounded-8]')?.textContent.trim().split(/[\t\r\f\n\s]*/g).join("");
            const match = tempTime?.match(/\/(.*)/);
            let nDuration = match?.[1];
            nDuration = sFormatUtil.timeStringToSeconds(nDuration);
            list.push({
                title,
                userUrl,
                name,
                uid,
                videoUrl,
                nDuration,
                el,
                insertionPositionEl: videoUrlEl.parentElement,
                explicitSubjectEl: el
            });
        }
        return list
    };
    const startShieldingHistoryVideoList = async () => {
        const list = await getHistoryVideoDataList();
        for (let videoData of list) {
            if (shielding.shieldingVideoDecorated(videoData)) {
                continue
            }
            shielding.addVideoBlockButton({data: videoData, maskingFunc: startShieldingHistoryVideoList});
        }
    };
    const startShieldingVideoList$1 = async () => {
        const list = await getVideoList();
        for (let videoData of list) {
            if (shielding.shieldingVideoDecorated(videoData)) {
                continue
            }
            addVideoBlockButton({data: videoData, maskingFunc: startShieldingVideoList$1});
        }
    };
    const intervalExecutionStartShieldingVideo$2 = () => {
        const res = shielding.intervalExecutionStartShieldingVideoInert(startShieldingVideoList$1, '视频');
        return () => {
            return res
        }
    };
    const intervalExecutionStartShieldingHistoryVideo = () => {
        const res = shielding.intervalExecutionStartShieldingVideoInert(startShieldingHistoryVideoList, '历史记录');
        return () => {
            return res
        }
    };
    const startShieldingVideo$1 = intervalExecutionStartShieldingVideo$2();
    const startShieldingHistoryVideo = intervalExecutionStartShieldingHistoryVideo();
    const rightTabsInsertListener = () => {
        getRightTabs().then(list => {
                for (let {el, label, active} of list) {
                    el.addEventListener('click', () => {
                            console.log('右侧选项卡栏点击了' + label, active);
                            if (label === '首页') {
                                homeTopTabsInsertListener();
                                startShieldingVideo$1().start();
                            } else {
                                startShieldingVideo$1().stop();
                            }
                            if (label === '观看历史') {
                                startShieldingHistoryVideo().start();
                            } else {
                                startShieldingHistoryVideo().stop();
                            }
                        }
                    );
                }
            }
        );
    };
    const getHomeTopTabs = async () => {
        const beEl = await getBewlyEl();
        const els = beEl.querySelectorAll('.home-tabs-inside>[data-overlayscrollbars-contents]>button');
        const list = [];
        for (let el of els) {
            const label = el.textContent.trim();
            const active = el.classList.contains('tab-activated');
            list.push({label, active, el});
        }
        if (list.some(tab => tab.active === true)) {
            return list
        }
        return await getHomeTopTabs()
    };
    const excludeTabNames = ['正在关注', '订阅剧集', '直播'];
    const excludeRankingLeftTabNames = ['番剧', '综艺', '电视剧', '纪录片', '中国动画'];
    const homeTopTabsInsertListener = () => {
        getHomeTopTabs().then(list => {
            for (let {el, label} of list) {
                el.addEventListener('click', () => {
                    console.log('点击了' + label);
                    if (excludeTabNames.includes(label)) {
                        startShieldingVideo$1().stop();
                        return
                    }
                    if (label === '排行') {
                        rankingLeftTabsInsertListener();
                    }
                    startShieldingVideo$1().start();
                });
            }
        });
    };
    const getRankingLeftTabs = async () => {
        const beEl = await getBewlyEl();
        const elList = await elUtil.findElementsUntilFound('ul[flex="~ col gap-2"]>li', {doc: beEl});
        const list = [];
        for (let el of elList) {
            const label = el.textContent.trim();
            list.push({label, el});
        }
        return list
    };
    const rankingLeftTabsInsertListener = () => {
        getRankingLeftTabs().then(list => {
            for (let {el, label} of list) {
                el.addEventListener('click', () => {
                    console.log('点击了' + label);
                    if (excludeRankingLeftTabNames.includes(label)) {
                        startShieldingVideo$1().stop();
                        return
                    }
                    startShieldingVideo$1().start();
                });
            }
        });
    };
    const addVideoBlockButton = (data) => {
        shielding.addBlockButton(data, "gz_shielding_button", ["right", 'bottom']);
    };
    const installBEWLStyle = () => {
        getBewlyEl().then(el => {
            gz_ui_css.addStyle(el, el);
        });
    };
    const searchBoxInsertListener = async () => {
        const beEl = await getBewlyEl();
        const input = await elUtil.findElementUntilFound('[placeholder="搜索观看历史"]', {doc: beEl});
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.keyCode === 13) {
                console.log('回车键被按下');
                if (input['value'].length === 0) return
                setTimeout(startShieldingHistoryVideoList, 1500);
            }
        });
    };
    const startRun$1 = async (url) => {
        const parseUrl = defUtil.parseUrl(url);
        const {page} = parseUrl.queryParams;
        installBEWLStyle();
        if (page === 'Home' || url === 'https://www.bilibili.com/') {
            startShieldingVideo$1().start();
            homeTopTabsInsertListener();
        }
        if (page === 'History') {
            startShieldingHistoryVideo().start();
            searchBoxInsertListener();
        }
        rightTabsInsertListener();
    };
    var compatibleBewlyBewly = {
        startRun: startRun$1,
        isBEWLYPage,
    };
    const isNewHistoryPage = (url) => {
        return url.includes('://www.bilibili.com/history')
    };
    const getDuration = (str) => {
        if (str === null) {
            return -1
        }
        if (str.includes('已看完') || str === '') {
            return -1
        } else {
            const match = str?.match(/\/(.*)/);
            if (match) {
                return sFormatUtil.timeStringToSeconds(match[1]);
            }
        }
        return -1
    };
    const getVideoDataList$1 = async () => {
        const elList = await elUtil.findElementsUntilFound('.section-cards.grid-mode>div');
        const list = [];
        for (let el of elList) {
            const titleEl = el.querySelector('.bili-video-card__title');
            const title = titleEl.textContent.trim();
            const videoUrl = titleEl.firstElementChild.href;
            const userEl = el.querySelector('.bili-video-card__author');
            const cardTag = el.querySelector('.bili-cover-card__tag')?.textContent.trim() || null;
            const name = userEl.textContent.trim();
            const userUrl = userEl.href;
            const uid = elUtil.getUrlUID(userUrl);
            let nDuration = -1;
            if (cardTag !== '专栏') {
                nDuration = el.querySelector('.bili-cover-card__stat')?.textContent.trim() || null;
                nDuration = getDuration(nDuration);
            }
            const tempEL = el.querySelector('.bili-video-card__details');
            list.push({
                title,
                videoUrl,
                name,
                userUrl,
                nDuration,
                uid,
                el,
                insertionPositionEl: tempEL,
                explicitSubjectEl: tempEL
            });
        }
        return list
    };
    const startShieldingVideoList = async () => {
        const list = await getVideoDataList$1();
        for (let videoData of list) {
            if (shielding.shieldingVideoDecorated(videoData)) {
                continue;
            }
            shielding.addBlockButton({data: videoData, maskingFunc: startShieldingVideoList}, "gz_shielding_button");
        }
    };
    const intervalExecutionStartShieldingVideo$1 = () => {
        const res = shielding.intervalExecutionStartShieldingVideoInert(startShieldingVideoList, '历史记录项');
        return () => {
            return res
        }
    };
    const executionStartShieldingVideo = intervalExecutionStartShieldingVideo$1();
    const getTopFilterLabel = async () => {
        const el = await elUtil.findElementUntilFound('.radio-filter>.radio-filter__item--active');
        return el.textContent?.trim()
    };
    const topFilterInsertListener = () => {
        elUtil.findElementUntilFound('.radio-filter').then((el => {
            el.addEventListener('click', (e) => {
                const target = e.target;
                const label = target.textContent?.trim();
                console.log(`点击了${label}`);
                if (label === '直播') {
                    executionStartShieldingVideo().stop();
                    return
                }
                executionStartShieldingVideo().start();
            });
        }));
    };
    const startRun = () => {
        getTopFilterLabel().then(label => {
            if (label === '直播') {
                return
            }
            executionStartShieldingVideo().start();
        });
        topFilterInsertListener();
    };
    var newHistory = {
        isNewHistoryPage,
        intervalExecutionStartShieldingVideo: intervalExecutionStartShieldingVideo$1,
        startRun
    };
    const isOldHistory = (url) => {
        return url.includes('https://www.bilibili.com/account/history')
    };
    const getVideoDataList = async () => {
        const elList = await elUtil.findElementsUntilFound('#history_list>.history-record');
        const list = [];
        for (let el of elList) {
            const labelEL = el.querySelector('.cover-contain>.label');
            if (labelEL !== null) {
                const label = labelEL.textContent.trim();
                console.log(`排除${label}`);
                continue
            }
            const titleEl = el.querySelector('.title');
            const userEl = el.querySelector('.w-info>span>a');
            const title = titleEl.textContent.trim();
            const videoUrl = titleEl.href;
            const name = userEl.textContent.trim();
            const userUrl = userEl.href;
            const uid = elUtil.getUrlUID(userUrl);
            list.push({
                title,
                videoUrl,
                name,
                userUrl,
                uid,
                el,
                explicitSubjectEl: el.querySelector('.r-txt'),
                insertionPositionEl: el.querySelector('.subtitle')
            });
        }
        return list
    };
    const startShieldingVideo = async () => {
        console.log('开始屏蔽旧版历史记录视频列表');
        const list = await getVideoDataList();
        const css = {right: "45px"};
        for (let videoData of list) {
            if (shielding.shieldingVideoDecorated(videoData)) {
                continue;
            }
            videoData.css = css;
            shielding.addVideoBlockButton({data: videoData, maskingFunc: startShieldingVideo});
        }
        console.log('屏蔽旧版历史记录视频列表完成');
    };
    const intervalExecutionStartShieldingVideo = () => {
        setInterval(startShieldingVideo, 2000);
    };
    var oldHistory = {
        isOldHistory,
        intervalExecutionStartShieldingVideo
    };
    const bOnlyTheHomepageIsBlocked$1 = localMKData.getBOnlyTheHomepageIsBlocked();
    const adaptationBAppCommerce = localMKData.getAdaptationBAppCommerce();
    const compatible_BEWLY_BEWLY$1 = localMKData.isCompatible_BEWLY_BEWLY();
    const staticRoute = (title, url) => {
        console.log("静态路由", title, url);
        if (compatible_BEWLY_BEWLY$1 && compatibleBewlyBewly.isBEWLYPage(url)) {
            compatibleBewlyBewly.startRun(url);
            return;
        }
        if (bilibiliHome.isHome(url, title)) {
            if (compatible_BEWLY_BEWLY$1) {
                return;
            }
            if (adaptationBAppCommerce) {
                bilibiliHome.startIntervalShieldingGateVideoList();
            }
            bilibiliHome.scrollMouseUpAndDown().then(() => bilibiliHome.startDebounceShieldingChangeVideoList());
            bilibiliHome.startClearExcessContentList();
            bilibiliHome.deDesktopDownloadTipEl();
            bilibiliHome.startDebounceShieldingHomeVideoList();
        }
        if (bOnlyTheHomepageIsBlocked$1) return;
        if (searchModel.isSearch(url)) {
            searchModel.startDebounceShieldingVideoList();
        }
        if (videoPlayModel.isVideoPlayPage(url)) {
            videoPlayModel.startShieldingVideoList();
            videoPlayModel.findTheExpandButtonForTheListOnTheRightAndBindTheEvent();
            videoPlayModel.execAuthorAddBlockButton();
        }
        if (collectionVideoPlayPageModel.iscCollectionVideoPlayPage(url)) {
            collectionVideoPlayPageModel.startShieldingVideoList();
            collectionVideoPlayPageModel.findTheExpandButtonForTheListOnTheRightAndBindTheEvent();
        }
        if (liveRoomModel.isLiveRoom(url)) {
            liveRoomModel.addWatchLiveRoomChatItemsListener();
        }
        if (popular.isPopularAllPage(url) || popular.isPopularHistory(url)) {
            popularAll.startShieldingVideoList();
        }
        if (popular.isPopularWeeklyPage(url)) {
            popularAll.startShieldingVideoList(true);
        }
        if (popular.isGeneralPopularRank(url)) {
            popular.startShieldingRankVideoList();
        }
        if (topicDetail.isTopicDetailPage(url)) {
            topicDetail.startShielding();
        }
        if (dynamic.isDynamicPage(url)) {
            dynamic.startThrottleShieldingDynamicContent();
        }
        if (videoPlayWatchLater.isVideoPlayWatchLaterPage(url)) {
            videoPlayWatchLater.startDebounceShieldingVideoList();
            videoPlayWatchLater.findTheExpandButtonForTheListOnTheRightAndBindTheEvent();
        }
        if (liveSectionModel.isLiveSection(url)) {
            liveSectionModel.startShieldingLiveRoom();
        }
        if (liveHome.isLiveHomePage(url)) {
            liveHome.startShieldingLiveRoom();
            liveHome.startShieldingTopLiveRoom();
        }
        if (newHistory.isNewHistoryPage(url)) {
            newHistory.startRun();
        }
        if (oldHistory.isOldHistory(url)) {
            oldHistory.intervalExecutionStartShieldingVideo();
        }
        if (space.isSpacePage(url)) {
            space.initializePageBlockingButton();
        }
    };
    const dynamicRouting = (title, url) => {
        console.log("动态路由", title, url);
        if (bOnlyTheHomepageIsBlocked$1) return;
        if (searchModel.isSearch(url)) {
            searchModel.startDebounceShieldingVideoList();
        }
        if (videoPlayModel.isVideoPlayPage(url)) {
            videoPlayModel.startShieldingVideoList();
            videoPlayModel.execAuthorAddBlockButton();
        }
        if (popular.isPopularAllPage(url) || popular.isPopularHistory(url)) {
            popularAll.startShieldingVideoList();
        }
        if (popular.isPopularWeeklyPage(url)) {
            popularAll.startShieldingVideoList(true);
        }
        if (popular.isGeneralPopularRank(url)) {
            popular.startShieldingRankVideoList();
        }
        if (dynamic.isDynamicPage(url)) {
            dynamic.startThrottleShieldingDynamicContent();
        }
    };
    var router = {
        staticRoute,
        dynamicRouting
    };
    const bOnlyTheHomepageIsBlocked = localMKData.getBOnlyTheHomepageIsBlocked();
    const compatible_BEWLY_BEWLY = localMKData.isCompatible_BEWLY_BEWLY();
    const observeNetwork = (url, windowUrl,winTitle, initiatorType) => {
        if (bOnlyTheHomepageIsBlocked) {
            if (!bilibiliHome.isHome(windowUrl, winTitle)) {
                return;
            }
        }
        if (url.startsWith("https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd?web_location=")) {
            if (compatible_BEWLY_BEWLY) {
                return;
            }
            bilibiliHome.startDebounceShieldingChangeVideoList();
            bilibiliHome.startDebounceShieldingHomeVideoList();
            console.log("检测到首页加载了换一换视频列表和其下面的视频列表");
            return;
        }
        if (url.startsWith("https://api.bilibili.com/x/v2/reply/wbi/main?oid=")) {
            console.log("检测到评论区楼主评论加载了");
            commentSectionModel.startShieldingComments();
            return;
        }
        if (url.startsWith("https://api.bilibili.com/x/v2/reply/reply?oid=")) {
            console.log("检测到评论区楼主层中的子层评论列表加载了");
            commentSectionModel.startShieldingComments();
        }
        if (url.startsWith("https://api.bilibili.com/x/web-interface/popular?ps=")) {
            popularAll.startShieldingVideoList();
        }
        if (url.startsWith("https://api.bilibili.com/x/web-interface/popular/series/one?number=")) {
            popularAll.startShieldingVideoList(true);
        }
        if (url.startsWith("https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?offset=")) {
            console.log("检测到用户动态加载了");
            dynamic.startThrottleShieldingDynamicContent();
        }
        if (url.startsWith("https://api.live.bilibili.com/xlive/web-interface/v1/second/getList?platform=web&parent_area_id=")) {
            console.log("检测到直播间加载了分区下的房间列表");
            liveSectionModel.startShieldingLiveRoom();
        }
        if (url.startsWith("https://api.live.bilibili.com/xlive/web-interface/v1/index/getList?platform=web")) {
            console.log("检测到直播间加载了推荐房间列表");
            liveHome.startShieldingLiveRoom();
        }
    };
    var observeNetwork$1 = {
        observeNetwork
    };
    router.staticRoute(document.title, window.location.href);
    watch.addEventListenerUrlChange((newUrl, oldUrl, title) => {
        router.dynamicRouting(title, newUrl);
    });
    watch.addEventListenerNetwork((url, windowUrl, winTitle, initiatorType) => {
        observeNetwork$1.observeNetwork(url, windowUrl, winTitle, initiatorType);
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === "`") {
            mainDrawer.showDrawer();
        }
    });
})(Vue);
