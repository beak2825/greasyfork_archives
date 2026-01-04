// ==UserScript==
// @name         Auto Reload
// @name:zh-CN   自动刷新
// @namespace    http://tampermonkey.net/
// @description  网页定时自动刷新
// @description:zh-CN  网页定时自动刷新
// @author       XVCoder
// @license      GPL-3.0-only
// @create       2020-11-20
// @lastmodified 2021-03-02
// @version      0.10
// @match        http*://*/*
// @icon         https://blog.solutionx.top/assets/img/favicon.png
// @require      https://cdn.staticfile.org/vue/2.6.11/vue.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js
// @note         2021-03-02 v0.10 修复 自定义倒计时时间选项无效的bug
// @note         2020-11-23 v0.9 修复 倒计时bug
// @note         2020-11-21 v0.8 优化 显示效果
// @note         2020-11-20 v0.7 修改 信息完善，脚本源迁移到GitHub
// @note         2020-11-20 v0.6 修改 默认匹配所有网页，修改match以指定需要自动刷新的网页
// @note         2020-11-20 v0.5 新增 实现基本功能
// @home-url     https://greasyfork.org/zh-CN/scripts/416449-auto-reload
// @home-url2    https://github.com/XVCoder/UserScripts/blob/main/AutoReload/AutoReload.user.js
// @homepageURL  https://greasyfork.org/zh-CN/scripts/416449-auto-reload
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/416449/Auto%20Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/416449/Auto%20Reload.meta.js
// ==/UserScript==

!function () {
    let isdebug = false;//是否为调试模式
    let isLocalDebug = isdebug || false;
    //调试模式时，使用「debug("message");」输出到Console中
    let debug = isdebug ? console.log.bind(console) : function () {
    };
    if (typeof (GM) === "undefined") {
        // 这个是ViolentMonkey的支持选项
        GM = {};
        GM.setValue = GM_setValue;
        GM.getValue = GM_getValue;
    }
    //默认配置
    let DefaultConfig = { countDown: 1, selectedOption: 5 };
    //可重载的配置文件
    let DBConfig = {};
    debug("============ Auto Load Start============");
    (function () {
        let needDisplayNewFun = true; // 本次更新是否有新功能需要展示
        if (window.NodeList && !NodeList.prototype.forEach) {
            NodeList.prototype.forEach = function (callback, thisArg) {
                thisArg = thisArg || window;
                for (var i = 0; i < this.length; i++) {
                    callback.call(thisArg, this[i], i, this);
                }
            };
        }
        /**初始化所有的设置**/
        Promise.all([GM.getValue("Config")]).then(function (data) {
            if (data[0] != null) {
                DBConfig = JSON.parse(data[0]);
            } else {
                DBConfig = DefaultConfig;
            }
            callback();
        }).catch(function (except) {
            console.log(except);
        });
        function callback() {
            //=============================================== 固定配置项  ↓↓↓↓↓
            //选项被选中时的标志
            let optSelectedMark = "✔";//✔
            //重载提示
            let reloadHint = "reload: ";//
            //播放符号
            let playMark = "▶";
            //暂停符号
            let pauseMark = "❙❙";
            //显示符号
            let visibleMark = "❮";//⍇⇱❮
            //隐藏符号
            let unvisibleMark = "❯";//⍈⇲❯
            //设置符号
            let settingMark = "⚙";//🕓⏱🛠⚙
            //设置选项圆角曲率（默认5）
            let settingOptsRadius = 3;
            //设置菜单宽度(单位px;默认45)
            let settingMenuWidth = 45;
            //用户脚本加载等待时间
            let loadTime = 200;
            //倒计时选项（时长：min  可为小数）
            let opts = {
                opt1: 5,
                opt2: 4,
                opt3: 3,
                opt4: 2,
                opt5: 1
            }
            //倒计时选项显示内容
            let optsDisplay = {
                opt1: opts.opt1 + "min ",
                opt2: opts.opt2 + "min ",
                opt3: opts.opt3 + "min ",
                opt4: opts.opt4 + "min ",
                opt5: opts.opt5 + "min ",
            };
            //=============================================== 固定配置项  ↑↑↑↑↑
            //页面重新加载倒计时（秒）
            let seconds = 0;
            //计时器
            let timer = null;
            //显示当前倒计时选项的配置
            switch (DBConfig.selectedOption) {
                case 1: {
                    //option1
                    optsDisplay.opt1 += optSelectedMark;
                    seconds = opts.opt1 * 60;
                    break;
                }
                case 2: {
                    //option2
                    optsDisplay.opt2 += optSelectedMark;
                    seconds = opts.opt2 * 60;
                    break;
                }
                case 3: {
                    //option3
                    optsDisplay.opt3 += optSelectedMark;
                    seconds = opts.opt3 * 60;
                    break;
                }
                case 4: {
                    //option4
                    optsDisplay.opt4 += optSelectedMark;
                    seconds = opts.opt4 * 60;
                    break;
                }
                case 5: {
                    //option5
                    optsDisplay.opt5 += optSelectedMark;
                    seconds = opts.opt5 * 60;
                    break;
                }
                default:
                    break;
            }

            setTimeout(function () {
                //===============================================================附加样式表=======================================================================
                var style = document.createElement("style");
                style.innerHTML =
                    ''
                    + '.leftTime {color:#00000077;font-size:12px;position:absolute;bottom:0px;right:25px;}'
                    + '.pauseBtn {position:absolute;bottom:0px;right:100px;background:transparent;display:inline-block;cursor:pointer;color:#666666;font-family:Arial;font-size:8px;font-weight:bold;padding:0px 1px;text-decoration:none;}'
                    + '.xDropdown {position:absolute;bottom:0px;right:120px;background:transparent;display:inline-block;}'
                    + '.settingBtn {cursor:pointer;color:#666666;line-height:17px;font-family:Arial;font-size:14px;font-weight:bold;text-decoration:none;cursor:pointer;}'
                    + '.xDropdown-content {display:none;position:absolute;border-radius:' + settingOptsRadius + 'px;background-color:#f9f9f9;box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);}'
                    + '.xDropdown-content div {-moz-user-select:none;-webkit-user-select:none;user-select:none;min-width:' + settingMenuWidth + 'px;padding:2px 10px 2px 14px;border-radius:' + settingOptsRadius + 'px;font-family:Arial;font-size:10px;corlor:00000077;text-decoration:none;display:block;cursor:arror;}'
                    + '.xDropdown-content div:hover {background-color:#B1B1B1;color:white}'
                    + '.xDropdown:hover .xDropdown-content {display:block;bottom:15px}'
                    + '.xDropdown:hover .settingBtn {color:orange;}'
                    + '.hiddenBtn {position:absolute;bottom:0px;right:140px;background:transparent;display:inline-block;cursor:pointer;color:#666666;font-family:Arial;font-size:8px;padding:0px 1px;text-decoration:none;}'
                    + ''
                    ;
                document.getElementsByTagName('HEAD').item(0).appendChild(style);

                //================================================================附加元素========================================================================
                //倒计时标签
                let leftTimeDiv = document.createElement("div");
                leftTimeDiv.setAttribute("id", "leftTime");
                leftTimeDiv.className = "leftTime";
                leftTimeDiv.innerHTML = reloadHint + Math.floor(seconds / 60).toString().padStart(2, '0') + ":" + (seconds % 60).toString().padStart(2, '0');
                document.body.appendChild(leftTimeDiv);
                //[暂停/继续]按钮
                let pauseBtn = document.createElement("div");
                pauseBtn.setAttribute("id", "pauseBtn");
                pauseBtn.className = "pauseBtn";
                pauseBtn.innerHTML = pauseMark;
                document.body.appendChild(pauseBtn);
                //下拉菜单区域
                let xDropdownDiv = document.createElement("div");
                xDropdownDiv.setAttribute("id", "xDropdown");
                xDropdownDiv.className = "xDropdown";
                document.body.appendChild(xDropdownDiv);
                //下拉菜单主体
                let xDropdownContentDiv = document.createElement("div");
                xDropdownContentDiv.setAttribute("id", "xDropdown-content");
                xDropdownContentDiv.className = "xDropdown-content";
                xDropdownContentDiv.innerHTML =
                    ""
                    + "<div id='opt1'>" + optsDisplay.opt1 + "</div>"
                    + "<div id='opt2'>" + optsDisplay.opt2 + "</div>"
                    + "<div id='opt3'>" + optsDisplay.opt3 + "</div>"
                    + "<div id='opt4'>" + optsDisplay.opt4 + "</div>"
                    + "<div id='opt5'>" + optsDisplay.opt5 + "</div>"
                    + "";
                xDropdownContentDiv.style.visibility = "hidden";
                xDropdownDiv.appendChild(xDropdownContentDiv);
                //设置按钮
                let settingBtn = document.createElement("div");
                settingBtn.setAttribute("id", "settingBtn");
                settingBtn.className = "settingBtn";
                settingBtn.style.visibility = "hidden";
                settingBtn.innerHTML = settingMark;
                xDropdownDiv.appendChild(settingBtn);
                //显示/隐藏按钮
                let hiddenBtn = document.createElement("div")
                hiddenBtn.setAttribute("id", "hiddenBtn");
                hiddenBtn.className = "hiddenBtn";
                hiddenBtn.style.visibility = "hidden";
                hiddenBtn.innerHTML = unvisibleMark;
                document.body.appendChild(hiddenBtn);

                //================================================================事件========================================================================
                /**
                 * 倒计时刷新
                 */
                timer = setInterval(function () {
                    if (seconds <= 0) {
                        //倒计时结束，重载页面
                        location.reload();
                    } else {
                        seconds--;
                        document.getElementById("leftTime").innerHTML = reloadHint + Math.floor(seconds / 60).toString().padStart(2, '0') + ":" + (seconds % 60).toString().padStart(2, '0');
                    }
                }, 1000);

                /**
                 * 显示隐藏按钮点击事件
                 */
                document.getElementById("hiddenBtn").addEventListener("click", (function () {
                    if (hiddenBtn.innerHTML == unvisibleMark) {//隐藏倒计时
                        hiddenBtn.innerHTML = visibleMark;
                        hiddenBtn.style.right = "20px";
                        pauseBtn.style.visibility = "hidden";
                        leftTimeDiv.style.visibility = "hidden";
                        settingBtn.style.visibility = "hidden";
                        xDropdownContentDiv.style.visibility = "hidden";
                    }
                    else {//显示倒计时
                        hiddenBtn.innerHTML = unvisibleMark;
                        hiddenBtn.style.right = "140px";
                        pauseBtn.style.visibility = "visible";
                        leftTimeDiv.style.visibility = "visible";
                        settingBtn.style.visibility = "visible";
                        xDropdownContentDiv.style.visibility = "visible";
                    }
                }));

                /**
                 * 设置按钮点击事件
                 */
                document.getElementById("settingBtn").addEventListener("click", (function () {
                    //切换倒计时的时长
                }));

                /**
                 * [暂停/继续]按钮点击事件
                 */
                document.getElementById("pauseBtn").addEventListener("click", (function () {
                    if (pauseBtn.innerHTML == pauseMark) {//暂停倒计时
                        pauseBtn.innerHTML = playMark;
                        pauseBtn.style.color = "salmon";
                        hiddenBtn.innerHTML = unvisibleMark;
                        hiddenBtn.style.visibility = "visible";
                        settingBtn.style.visibility = "visible";
                        xDropdownContentDiv.style.visibility = "visible";
                        clearInterval(timer);
                    }
                    else {//继续倒计时
                        pauseBtn.innerHTML = pauseMark;
                        pauseBtn.style.color = "#666666";
                        hiddenBtn.innerHTML = visibleMark;
                        hiddenBtn.style.visibility = "hidden";
                        settingBtn.style.visibility = "hidden";
                        xDropdownContentDiv.style.visibility = "hidden";
                        timer = setInterval(function () {
                            if (seconds <= 0) {
                                //倒计时结束，重载页面
                                location.reload();
                            } else {
                                seconds--;
                                document.getElementById("leftTime").innerHTML = reloadHint + Math.floor(seconds / 60).toString().padStart(2, '0') + ":" + (seconds % 60).toString().padStart(2, '0');
                            }
                        }, 1000);
                    }
                }));
                /**
                 * 选项1
                 */
                document.getElementById("opt1").addEventListener("click", (function (e) {
                    DBConfig.selectedOption = 1;
                    setCountDown(e, 1, opts.opt1);
                }));
                /**
                 * 选项2
                 */
                document.getElementById("opt2").addEventListener("click", (function (e) {
                    DBConfig.selectedOption = 2;
                    setCountDown(e, 2, opts.opt2);
                }));
                /**
                 * 选项3
                 */
                document.getElementById("opt3").addEventListener("click", (function (e) {
                    DBConfig.selectedOption = 3;
                    setCountDown(e, 3, opts.opt3);
                }));
                /**
                 * 选项4
                 */
                document.getElementById("opt4").addEventListener("click", (function (e) {
                    DBConfig.selectedOption = 4;
                    setCountDown(e, 4, opts.opt4);
                }));
                /**
                 * 选项5
                 */
                document.getElementById("opt5").addEventListener("click", (function (e) {
                    DBConfig.selectedOption = 5;
                    setCountDown(e, 5, opts.opt5);
                }));
                /**
                 * 设置倒计时
                 * @param e Element（选项标签）
                 * @param opt 选项
                 * @param newCountDown 倒计时时长
                 */
                function setCountDown(e, opt, newCountDown) {
                    //更新选中项
                    for (var key in optsDisplay) {
                        document.getElementById(key).innerHTML = optsDisplay[key] = optsDisplay[key].replace(optSelectedMark, "");
                    }
                    e.path[0].innerHTML = (optsDisplay["opt" + opt] += optSelectedMark);
                    debug("======================= change countdown =======================")
                    debug(e.path[0].innerHTML)
                    //更新倒计时
                    seconds = newCountDown * 60;
                    document.getElementById("leftTime").innerHTML = reloadHint + Math.floor(seconds / 60).toString().padStart(2, '0') + ":" + (seconds % 60).toString().padStart(2, '0');
                    DBConfig.countDown = newCountDown;
                    GM_setValue("Config", JSON.stringify(DBConfig));
                }
            }, 100);
        }
    })();
}();
