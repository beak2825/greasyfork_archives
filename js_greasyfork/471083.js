// ==UserScript==
// @name         B站大学课程辅助器
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  让你自律地看多集视频
// @author       zhuangjie
// @match        https://www.bilibili.com/video/**
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471083/B%E7%AB%99%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%BE%85%E5%8A%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/471083/B%E7%AB%99%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%BE%85%E5%8A%A9%E5%99%A8.meta.js
// ==/UserScript==
 
(async function() {
    'use strict';

    // ========== 公共工具函数区 ==========

    // 【url改变监听器】
    function onUrlChange(fun,isImmediately = false) {
        let initUrl = window.location.href.split("#")[0];
        function urlChangeCheck() {
            let currentUrl = window.location.href.split("#")[0];
            if (initUrl != currentUrl) {
                // 新的=>旧的
                initUrl = currentUrl;
                fun();
            }
        }
        if(isImmediately) fun();
        setInterval(urlChangeCheck, 460);
    }

    // 数据缓存器
    let cache = {
        get(key) {
            return GM_getValue(key);
        },
        set(key, value) {
            GM_setValue(key, value);
        },
        jGet(key) {
            let value = GM_getValue(key);
            if (value == null) return value;
            return JSON.parse(value);
        },
        jSet(key, value) {
            value = JSON.stringify(value);
            GM_setValue(key, value);
        },
        remove(key) {
            GM_deleteValue(key);
        },
        cookieSet(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + exdays);
            var expires = "expires=" + d.toGMTString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },
        cookieGet(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        }
    };

    // 防抖函数
    function debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                func.apply(context, args);
            }, delay);
        };
    }

    // 获取视频的ID
    function getVideoId() {
        let regex = /.*?video\/([^?\/]*).*/; // 匹配 /video/ 后面的字符，直到遇到 /
        let match = window.location.href.match(regex); // 使用正则表达式匹配
        if (match && match[1]) {
            let videoId = match[1];
            return videoId;
        } else {
            return null;
        }
    }

    // 获取指定属性data-开头的属性名-返回数组
    function getDataAttributes(element) {
        var dataAttributes = [];
        if (element && element.attributes) {
            var attributes = element.attributes;
            for (var i = 0; i < attributes.length; i++) {
                var attributeName = attributes[i].name;
                if (attributeName.startsWith('data-')) {
                    dataAttributes.push(attributeName);
                }
            }
        }
        return dataAttributes;
    }

    // 判断当前是否在iframe里面，
    function currentIsIframe() {
        if (self.frameElement && self.frameElement.tagName == "IFRAME") return true;
        if (window.frames.length != parent.frames.length) return true;
        if (self != top) return true;
        return false;
    }

    // ========== 程序业务函数区 ==========

    // 播放状态修改
    function getPlayStatus() { // 播放 true，暂停 false
        var element = document.querySelector('.bpx-player-state-play');
        var computedStyle = getComputedStyle(element);
        var display = computedStyle.getPropertyValue('display');
        var visibility = computedStyle.getPropertyValue('visibility');
        var isVisible = (display !== 'none' && visibility !== 'hidden');
        return !isVisible;
    }

    // 修改视频播放状态
    function play(isPlay = false) {
        if (getPlayStatus() == isPlay) return;
        // 如果状态不一致，让状态一致
        var button = document.getElementsByClassName("bpx-player-ctrl-play")[0];
        // 创建并初始化一个点击事件
        var clickEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true
        });
        // 派发(click)触发点击事件
        button.dispatchEvent(clickEvent);
    }

    // 监听某个元素内容变化
    let elementChange = {
        existCheck(select, timeout = 6000) {
            return new Promise((resolve, reject) => {
                let timer = null;
                timer = setInterval(() => {
                    let element = document.querySelector(select);
                    if (element != null) {
                        resolve(element);
                        clearInterval(timer);
                    }
                }, 200);
                setTimeout(() => { clearInterval(timer); }, timeout);
            });
        },
        hasContentCheck(select, count = 1, timeout = 6000) {
            return new Promise((resolve, reject) => {
                let timer = null;
                timer = setInterval(() => {
                    let element = document.querySelector(select);
                    let isHasContent = false;
                    if (element == null) return;
                    let innerText = element.innerText;
                    isHasContent = element.childNodes.length >= count && innerText != "" && !/^\s*<!--[^<>]*-->\s*$/.test(innerText);
                    if (isHasContent) {
                        resolve(element);
                        clearInterval(timer);
                    }
                }, 200);
                setTimeout(() => { clearInterval(timer); }, timeout);
            });
        }
    };

    // 全局变量，用于存放视图及缓存相关信息
    let pList = null;
    let TP_CACHE_KEY = null;
    let WHEN_SAVING_P_CACHE_KEY = null;
    let currentEpisodes = null;
    let controlElement = null; // 视图节点对象

    // 页面改变需要修改的元素选择器
    let pageElementSelector = {
        pListBox: ".rcmd-tab", // 集数列表盒子，脚本控制器会放在它上面
        p2: ".video-pod__body > div > div:nth-child(2)", //也决定了是否为多集视频
        currentP: ".amt" // innerHtml应是（n/m）这种才能解析，否则需要修改逻辑
    };

    // 刷新视频信息
    function refreshVideoInfo() {
        // 存放集列表的盒子，如果有证明是多集视频（page-change-change）
        // 脚本控制器将放在这上面，且证明是否多集
        pList = document.querySelector(pageElementSelector.pListBox);
        let oldVideoId = TP_CACHE_KEY;
        let currentVideoId = TP_CACHE_KEY = getVideoId();
        WHEN_SAVING_P_CACHE_KEY = TP_CACHE_KEY + ":WHEN_SAVING_P_CACHE_KEY";
        let isVideoChange = oldVideoId != currentVideoId;
    }

    // 视图初始化
    function initView() {
        // 之前的集数
        let tp = cache.get(TP_CACHE_KEY) ?? 0;
        let inputStyle = `
           height: 20px;
           border-radius: 5px;
           border: 1.5px solid pink;
           padding: 2px 5px;
           box-sizing: border-box;
           max-width: 60px;
        `;

        // 创建新的 <div> 元素
        controlElement = document.createElement('div');
        // 视图容器样式
        controlElement.style = `
               margin: 10px 0px;
               line-height:25px;
               color:#FB7299;
               font-weight: 500;
            `;

        // 加data就可以让内容可以选中使用，不然都不能选中，如input如何聚焦编辑
        let dataAttrName = getDataAttributes(pList)[0];
        controlElement.innerHTML = `
              <span >当前P<span id="current_episodes">--</span> , 本次目标P</span>
              <input type="number" style="${inputStyle}" value="${tp}" id="tp_input"  ${dataAttrName} />
              <span id="tp_msg">--</span>
        `;
        // 在目标元素前插入新的兄弟元素
        setTimeout(()=>{
            // 这里必须等待页面，否则页面将功能异常（由向页面插入元素引起）
            pList.before(controlElement);

            // 使用防抖修改内容
            let tpInput = document.querySelector('#tp_input');
            let refresh = debounce(() => {
                // 在这里编写输入值改变事件的处理逻辑
                cache.set(TP_CACHE_KEY, parseInt(tpInput.value));
                cache.set(WHEN_SAVING_P_CACHE_KEY, currentEpisodes);
                refreshViewState();
            }, 1000);
            refreshViewState();
            tpInput.addEventListener('input', () => refresh());
        },2000)
    }

    function refreshControlVisibility() {
        const p2 = document.querySelector(pageElementSelector.p2)
        if (p2 == null && controlElement != null) {
            console.log("1.1   refreshControlVistor")
            // 多集视频 -> 单视频  执行
            controlElement?.remove();
            controlElement = null;
        } else if(p2 != null && controlElement == null){
            console.log("1.2  refreshControlVistor")
            // 单视频 -> 多集视频时 执行
            initView();
        }
    }
    // 更新视图状态
    async function refreshViewState() {
        refreshVideoInfo();
        refreshControlVisibility();
        // 当前集数
        currentEpisodes = await new Promise((resolve, reject) => {
            let timer = null;
            timer = setInterval(() => {
                let activeItem = document.querySelector(pageElementSelector.currentP);
                if (activeItem == null) return;
                const text = activeItem.innerText;
                const regex = /(\d+)\/(\d+)/; // 提取分子和分母
                const match = text.match(regex);
                if (!match) return;

                const current = parseInt(match[1], 10); // 当前进度
                const total = parseInt(match[2], 10); // 总进度
                console.log(`当前进度: ${current}, 总进度: ${total}`);

                if (activeItem == null) {
                    clearInterval(timer);
                    resolve(null);
                    return;
                }
                if (current != null && current >= 1) {
                    clearInterval(timer);
                    resolve(current);
                }
            }, 200);
        });
        let tpInput = document.querySelector('#tp_input');
        let tp = cache.get(TP_CACHE_KEY) ?? 0;
        let tpMsg = document.querySelector('#tp_msg');
        let currentEpisodesElement = document.querySelector('#current_episodes');
        let residueP = tp - currentEpisodes;
        let whenSavingP = cache.get(WHEN_SAVING_P_CACHE_KEY);
        let sumP = whenSavingP === undefined ? "--" : (tp - whenSavingP + 1);
        let viewed = (typeof sumP === "string") ? "--" : (sumP - residueP - 1);
        if (tpInput == null) return;
        tpInput.value = tp;
        currentEpisodesElement.innerHTML = `${currentEpisodes}`;
        let statusMsg = (viewed >= sumP)
        ? (tp == 0 ? "第一步设置目标！" : "太棒了，任务完成了！")
        : "看完当前+1";
        tpMsg.innerHTML = ` , 进度 ${viewed}/${sumP}集！${statusMsg}`;
        debugger

        // 检查
        if (tp == 0) return; // 没有设置目标值
        if (currentEpisodes >= tp + 1) {
            setTimeout(() => {
                play(false);
                alert(`你已经达到本次任务！${currentEpisodes > tp + 1 ? "请更新目标" : ""}`);
            }, 100); // 设置状态为暂停
        }
    }

    // === 扩展功能-暂停与自动播放控制 ===
    function setupVisibilityChangeListener() {
        // 当页面失去焦点时暂停，活动时播放（前提是自动关闭的）
        document.addEventListener("visibilitychange", function() {
            if (document.visibilityState === "visible") {
                // 活动
                if (isIntervene) { // 只有干预过，才可自动恢复播放
                    play(true);
                    isIntervene = false; // 重置为未干预
                }
            } else if (getPlayStatus()) {
                // 不活动 & 在播放时
                isIntervene = true; // 设置为已干预
                play(false);
            }
        });
    }

    // 全局变量，用于扩展功能控制
    let isIntervene = false;

    // ========== 主函数区 ==========
    function main() {
        // 如果处于iframe内则不执行脚本
        if (currentIsIframe()) return;

        // 程序入口：等待集数目录加载完成-初始化视图
        window.onload = function() {
            // 集数目录加载完时，执行初始化视图（如果视图比集数目录显示在前面，可能集数行内容空白）
            onUrlChange(() => refreshViewState(),true)
        };

        // 设置扩展功能
        setupVisibilityChangeListener();
    }

    // 调用主函数启动程序
    main();

})();
