// ==UserScript==
// @name         北化网课雨
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  never try to take over the world!
// @author       Snowman
// @match        https://buct.yuketang.cn/pro/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461829/%E5%8C%97%E5%8C%96%E7%BD%91%E8%AF%BE%E9%9B%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461829/%E5%8C%97%E5%8C%96%E7%BD%91%E8%AF%BE%E9%9B%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class Utils {

        /** 页面环境 */
        static Environment = {
            UNKNOWN: 0,
            VIDEO: 1,
            SCORE: 2,
        }

        /** 获取当前环境，以决定启动哪些模块 */
        static GetEnvironment() {

            let path = location.pathname.split('/');

            if (path[path.length - 2] == 'video') {
                return Utils.Environment.VIDEO;
            }
            if (path[path.length - 1] == 'score') {
                return Utils.Environment.SCORE;
            }
            return Utils.Environment.UNKNOWN;

        }

        /** 关闭浏览器当前标签页 */
        static CloseWindow() {
            var userAgent = navigator.userAgent;
            if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1) {
                window.location.href = "about:blank";
                window.close();
            } else {
                window.opener = null;
                window.open("", "_self");
                window.close();
            }
        }

        /**
         * 向目标元素注入 CSS
         * @param {Element} target 注入目标
         * @param {string} css CSS 内容
         */
        static InsertCSS(target, css) {

            if (!target) return false;

            let style = document.createElement("style");
            let text = document.createTextNode(css);
            style.appendChild(text);
            target.appendChild(style);
            return true;

        }


        /**
         * 选择单个元素
         * @param {string} selector JS Selector 语句
         * @param {boolean} mustExist 元素是否必须存在
         * @returns {Function}
         */
        static SelectOne = (selector, mustExist = false) => {

            let _selector = selector;
            let _element = null;

            /** @returns {Element | null} */
            let f = function () {
                if (_element == null)
                    _element = document.querySelector(_selector);
                if (mustExist && _element == null)
                    throw { why: "错误：找不到元素", _selector };
                else
                    return _element;
            }
            return f;
        }


        /**
         * 选择所有元素
         * @param {string} selector JS Selector 语句
         * @param {boolean} mustExist 元素是否必须存在
         * @returns {Function}
         */
        static SelectAll = (selector, mustExist = true) => {

            let _selector = selector;
            let _elements = null;

            /** @returns {Element | null} */
            let f = function () {
                if (_elements == null)
                    _elements = document.querySelectorAll(_selector);
                if (mustExist && _elements == null)
                    throw { why: "错误：找不到元素", _selector };
                else
                    return _elements;
            }
            return f;
        }


        /**
         * 坚持不懈地尝试做一件事
         * @param {Function} task 要做的事，必须返回布尔值表示是否已成功完成
         * @param {number} maxTries 最大尝试次数
         * @param {number} interval 尝试间隔时间
         */
        static TryTryTry(task, maxTries = 5, interval = 1000) {

            let counter = 0;
            let result;

            let clock = setInterval(() => {

                // counter++，并检测是否超出尝试次数
                if (++counter > maxTries) {
                    clearInterval(clock);
                    console.warn("任务失败次数过多，超出尝试上限！", { maxTries, interval, task });
                    return;
                }

                try {
                    result = task();
                } catch (error) {
                    throw { why: "错误：任务执行时自身出错！", error };
                }

                if (typeof result !== 'boolean')
                    throw { why: "错误：任务返回值必须为布尔类型！", result };

                if (result) {
                    clearInterval(clock);
                    console.log("[Debug] 任务完成，尝试次数为 " + counter);
                    return;
                }

            }, interval);

        }

    }


    /** 若干功能模块 */
    class Modules {

        /** 被迫展示自己被黑化的事实 */
        static ShowBlacklized() {
            setTimeout(() => {
                ElementPool.title().innerHTML += `<div style="color:green;"><font>（已黑化）</font><font id="sg-rate"></font></div>`;
                console.log("完成了喵~");
            }, 1000);
        }

        /** 危险的多开 */
        static MultiWatch() {

            let input = prompt("请输入 limit (建议 1 ~ 5 ，默认 3)")
            let counter = 0;
            let limit = input == '' ? 3 : Number(input);
            if (isNaN(limit)) {
                alert("输入无效！");
                return;
            }

            let res = [];

            let els = document
                .querySelector('.right-content')
                .querySelectorAll('li.concrete-tr')

            for (const el of els) {
                if (el.querySelector('.complete-td>:first-child').innerText != "已完成") {
                    counter++;
                    res.push(el);
                    if (counter >= limit)
                        break;
                }
            }

            res.forEach(el => {
                el.querySelector('i+span').click();
            })
        }

        static FuckFocus() {
            document.hasFocus = el_psy_congroo => true;
        }

        static StartPlaying() {
            ElementPool.bigPlayBtn().click();
        }

        /** 更新进度信息的显示 */
        static UpdateProgress() {

            let prog = ElementPool.progress();

            if (prog == null) {
                document.title = "进度：<1%";
                ElementPool.rate().innerText = "暂未获取到视频进度";
                return;
            }

            let n = Number(prog.innerText.slice(4, -1));
            document.title = "进度：" + n + "%";

            if (n >= 100) {
                document.title = "已完成！";
                setTimeout(Utils.CloseWindow, 500);
            }

        }


        /** 转动分数之环(ring) */
        static RotateCircle() {

            Utils.TryTryTry(() => {

                let isCssDone = Utils.InsertCSS(document.body, `
                    circle {
                        animation: steins-gate-circle 1s infinite cubic-bezier(0.5,-0.52, 0.44, 1.61);
                    }

                    @keyframes steins-gate-circle {
                        from {
                            transform: rotate(0deg);
                            -webkit-transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                            -webkit-transform: rotate(360deg);
                        }
                }
                `)

                return isCssDone;
            });

        }

    }


    /**
     * DOM 元素池，使用方法如下：
     * - 取用元素：**作为函数调用**，例如：`ElementPool.title()`;
     * - 添加元素：为常用的 DOM 元素起别名作为属性名，并将
     *  `SelectOne` 或 `SelectAll` 对象作为属性的初始值
    */
    var ElementPool = {

        /** 视频标题，用于显示“已黑化” */
        title: Utils.SelectOne('.title-fl'),

        /** “已黑化”的插槽，用于在标题旁显示进度 */
        rate: Utils.SelectOne('#sg-rate'),

        /** “完成度”，用于获取观看进度 */
        progress: Utils.SelectOne('.el-tooltip>.text', false),

        /** 大播放按钮 */
        bigPlayBtn: Utils.SelectOne('.pause_show>.xt_video_bit_play_btn', false),

        /** 分数环 */
        circle: Utils.SelectOne('.progress-ring>circle'),

        /** 分数页面跳转的按钮 */
        scorePageBtn: Utils.SelectOne('.student-tabs1>:nth-child(4)'),
    };

    // TODO: Globalize
    let env;
    let updClock;

    /** 全てはこれから */
    function Init() {

        env = Utils.GetEnvironment();

        console.log("EnvState: " + env + "\nEnum: ", Utils.Environment);

        // 课程视频页面
        if (env == Utils.Environment.VIDEO) {

            Modules.FuckFocus();

            Modules.ShowBlacklized();

            updClock = setInterval(Modules.UpdateProgress, 1000);

        };

        // 课程分数页面
        if (env == Utils.Environment.SCORE) {

            Modules.RotateCircle();

            Utils.TryTryTry(
                () => {
                    ElementPool
                        ?.circle()
                        .addEventListener('click', Modules.MultiWatch);
                    return ElementPool.circle() != null;
                }
            );


        }

        // 主界面
        if (env == Utils.Environment.UNKNOWN) {

            // 更新环境
            setInterval(() => {
                let cur = Utils.GetEnvironment();
                if (cur != env) {
                    clearInterval(updClock);
                    Init();
                }
            }, 1000);

        }

    }

    Init();

    // Your code here...
})();