// ==UserScript==
// @name         今日热榜界面简化
// @namespace    http://tampermonkey.net/
// @version      2.4.2.2
// @description  仅适用于未登录状态的主界面（摸鱼向，仅为简化） 自定义背景颜色 卡片颜色 文字颜色 卡片圆角 卡片高度 修改了图标和标题 自定义卡片布局 去广告
// @author       Yesaye
// @match        *://tophub.today/
// @icon         https://www.google.com/s2/favicons?domain=tophub.today
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @run-at       document-start
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/431421/%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/431421/%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C%E7%95%8C%E9%9D%A2%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {

    // 页面样式
    let style = `
    .abcdefg{display: none;}.
    bc > :nth-child(-n+2) {display: none;}
    .nano{transition: all 500ms;}
    #appbar {display: none !important;}
    #tabbar {display: none !important;}
    .cq {display: none !important;}
    .alert {display: none !important;}
    .eb-fb {display: none !important;}
    .c-d {padding: 0px !important;}
    .cc-cd-lb>img {display: none !important;}
    .cc-cd-lb>span,
    .cc-cd-sb-st {font-weight:1 !important;color:#666666}
    .cc-cd {transition: all 500ms;margin-bottom:1%}
    body {transition: all 500ms; padding: 20px 0 0 0}
    .mp::after {border-bottom:none}
    .cc-cd-ih {border-bottom:none}
    .cc-cd-if {border-top:none}
    .bc > div:nth-child(-n+2) {display: none;}
    .bc-tc {display:none}
    .bc-cc {padding-bottom: 0;padding-top:0}
    `;
    addStyle(style, "setTotalStyle");

    style = "";
    var backgroundColor = GM_getValue("today_BackgroundColor_value")
    var cardColor = GM_getValue("today_CardColor_value")
    var textColor = GM_getValue("today_TextColor_value")
    var cardRadius = GM_getValue("today_CardRadius_value");
    var cardHeight = GM_getValue("today_CardHeight_value");
    var lingShowNum = GM_getValue("today_LineShow_value");
    if (backgroundColor != null) {
        style += "body {background-color: " + backgroundColor + " !important;}";
    }
    if (cardColor != null) {
        style += ".cc-cd {background-color: " + cardColor + " !important;}";
    }
    if (textColor != null) {
        style += ".cc-cd-cb .cc-cd-cb-l .cc-cd-cb-ll .t {color:" + textColor + "} .cc-cd-cb .cc-cd-cb-l .cc-cd-cb-ll .s {color:" + textColor + "} .cc-cd-cb .cc-cd-cb-l .cc-cd-cb-ll .s.h {color:" + textColor + "} .cc-cd-cb .cc-cd-cb-l .cc-cd-cb-ll .e {color:" + textColor + "} .cc-cd-if .i-h {color:" + textColor + "} .cc-cd-if .i-o {color:" + textColor + "} .cc-cd-lb>span, .cc-cd-sb-st {color:" + textColor + "}";
    }
    addStyle(style, "setColorStyle");
    style = "";
    if (cardRadius != null) {
        style += ".cc-cd {border-radius:" + cardRadius + "px !important;}";
    }
    if (cardHeight != null) {
        style += ".nano {height:" + cardHeight + "px !important;}";
    }
    addStyle(style, "setRadiusStyle");
    addStyle(style, "setHeightStyle");
    if (lingShowNum != null) {
        changeLineShow(lingShowNum);
    }

    // 更换图标
    changeFavicon("https://www.baidu.com/favicon.ico");
    // 更换标题
    document.title = "百度一下";

    function addStyle(style, clazz) {
        let style_Add = document.createElement('style');
        style_Add.className = clazz;
        if (document.lastChild) {
            document.lastChild.appendChild(style_Add).textContent = style;
        } else { // 避免网站加载速度太慢的备用措施
            let timer1 = setInterval(function () { // 每 10 毫秒检查一下 html 是否已存在
                if (document.lastChild) {
                    clearInterval(timer1); // 取消定时器
                    document.lastChild.appendChild(style_Add).textContent = style;
                }
            });
        }
    }

    function setStyle(style, clazz) {
        // 先删掉原来的
        removeStyle(clazz);
        addStyle(style, clazz);
    }

    function removeStyle(clazz) {
        document.querySelectorAll('.' + clazz).forEach((v) => { v.remove() });
    }

    // 更换图标
    function changeFavicon(link) {
        let $favicon = document.querySelectorAll('link[rel*="icon"]');
        // If a <link rel="icon"> element already exists,
        // change its href to the given link.
        if ($favicon && $favicon.length != 0) {
            $favicon.forEach(x => {
                x.href = link;
            })
        } else {
            $favicon = document.createElement("link");
            $favicon.rel = "icon";
            $favicon.href = link;
            document.head.appendChild($favicon);
        }
    };

    // 更改卡片布局
    function changeLineShow(num) {
        var lineShowNum = (100 - num) / num;
        GM_setValue("today_LineShow_value", num);
        setStyle(".cc-cd {width: " + lineShowNum + "% !important;}", "setLineShowStyle");
        if (num == 2) {
            twoLineStyle();
        }
        if (num == 4) {
            fourLineStyle();
        }
    }
    function twoLineStyle() {
        var style = "#twoLineShow {color: #ffffff; background: #37c375; border: none; border-radius: 5px; margin: 2px 0 2px 2px; cursor: pointer;}";
        removeStyle("setFourLineButtonStyle");
        setStyle(style, "setTwoLineButtonStyle");
    }
    function fourLineStyle() {
        var style = "#fourLineShow {color: #ffffff; background: #37c375; border: none; border-radius: 5px; margin: 2px 0 2px 2px; cursor: pointer;}";
        removeStyle("setTwoLineButtonStyle");
        setStyle(style, "setFourLineButtonStyle");
    }

    // 菜单
    var menu_ALL = [
        ['today_ChangeColor', '主题', '修改页面主题样式', '']
    ], menu_ID = [];
    for (let i = 0; i < menu_ALL.length; i++) { // 如果读取到的值为 null 就写入默认值
        if (GM_getValue(menu_ALL[i][0]) == null) { GM_setValue(menu_ALL[i][0], menu_ALL[i][3]) };
    }
    registerMenuCommand();

    // 注册脚本菜单
    function registerMenuCommand() {
        if (menu_ID.length > menu_ALL.length) { // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
            for (let i = 0; i < menu_ID.length; i++) {
                GM_unregisterMenuCommand(menu_ID[i]);
            }
        }
        for (let i = 0; i < menu_ALL.length; i++) { // 循环注册脚本菜单
            menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
            GM_registerMenuCommand(`${menu_ALL[i][1]}`, function () {
                menu_setting('checkbox', menu_ALL[i][1], menu_ALL[i][2], [menu_ALL[i + 1], menu_ALL[i + 2], menu_ALL[i + 3], menu_ALL[i + 4]])
            });
        }
    }

    // 脚本设置
    function menu_setting(type, title, tips, menu) {
        let _html = `<style class="today_SettingStyle">
        .today_SettingRoot {
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            width: auto;
            min-width: 400px;
            max-width: 600px;
            height: auto;
            min-height: 150px;
            max-height: 400px;
            color: #535353;
            background-color: #fff;
            border-radius: 3px;
        }

        .today_SettingBackdrop_1 {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 203;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            overflow-x: hidden;
            overflow-y: auto;
            -webkit-transition: opacity .3s ease-out;
            transition: opacity .3s ease-out;
        }

        .today_SettingBackdrop_2 {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 0;
            background-color: rgba(18, 18, 18, 0);
            -webkit-transition: background-color .3s ease-out;
            transition: background-color .3s ease-out;
        }

        .today_SettingRoot .today_SettingHeader {
            padding: 10px 20px;
            color: #fff;
            font-weight: bold;
            background-color: #f0816e;
            border-radius: 3px 3px 0 0;
        }

        .today_SettingRoot .today_SettingMain {
            padding: 10px 20px;
            border-radius: 0 0 3px 3px;
        }

        .today_SettingHeader span {
            float: right;
            cursor: pointer;
        }

        .today_SettingMain input {
            margin: 10px 6px 10px 0;
            cursor: pointer;
            vertical-align: middle
        }

        .today_SettingMain label {
            margin-right: 20px;
            user-select: none;
            cursor: pointer;
            vertical-align: middle
        }

        .today_SettingMain hr {
            border: 0.5px solid #f4f4f4;
        }

        [data-theme="dark"] .today_SettingRoot {
            color: #adbac7;
            background-color: #343A44;
        }

        [data-theme="dark"] .today_SettingHeader {
            color: #d0d0d0;
            background-color: #2D333B;
        }

        [data-theme="dark"] .today_SettingMain hr {
            border: 0.5px solid #2d333b;
        }

        .today_SettingClose .Zi--Close{
            transition: transform 1.8s ease-out;
        }

        .today_SettingClose:hover .Zi--Close {
            transform: /*scale(1.5)*/ rotate(900deg)
        }
    </style>
    <div class="today_SettingBackdrop_1">
        <div class="today_SettingBackdrop_2"></div>
        <div class="today_SettingRoot">
            <div class="today_SettingHeader">${title}
                <span class="today_SettingClose" title="点击关闭">
                    <svg class="Zi Zi--Close Modal-closeIcon" fill="currentColor" viewBox="0 0 24 24" width="24"
                        height="24">
                        <path
                            d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z"
                            fill-rule="evenodd">
                        </path>
                    </svg>
                </span>
            </div>
            <div class="today_SettingMain">
                <div id="today_BackgroundColor_box">
                    背景色<input id="pickColor_BackgroundColor" type="color" value="${backgroundColor}">
                </div>
                <div id="today_CardColor_box">
                    卡片色<input id="pickColor_CardColor" type="color" value="${cardColor}">
                </div>
                <div id="today_CardColor_box">
                    文字色<input id="pickColor_TextColor" type="color" value="${textColor}">
                </div>
                <button id="resetColor">重置颜色</button>
                <hr/>
                <div id="today_CardRadius_box">
                    卡片圆角<input type="range" min="0" max="200" value="${cardRadius}" id="today_CardRadius">
                </div>
                <button id="resetRadius">重置圆角</button>
                <div id="today_CardHeight_box">
                    卡片高度<input type="range" min="0" max="2000" value="${cardHeight}" id="today_CardHeight">
                </div>
                <button id="resetHeight">重置高度</button>
                <hr/>
                <div id="showTypeBox">
                    <button id="twoLineShow">双列显示</button>
                    <button id="fourLineShow">四列显示</button>
                </div>
            </div>
        </div>
    </div>`;

        document.body.insertAdjacentHTML('beforeend', _html); // 插入网页末尾
        setTimeout(function () { // 延迟 100 毫秒，避免太快
            // 关闭按钮 点击事件
            document.querySelector('.today_SettingClose').onclick = function () { this.parentElement.parentElement.parentElement.remove(); document.querySelector('.today_SettingStyle').remove(); }
            // 点击周围空白处 = 点击关闭按钮
            document.querySelector('.today_SettingBackdrop_2').onclick = function (event) { if (event.target == this) { document.querySelector('.today_SettingClose').click(); }; }

            // 选取背景色
            document.getElementById("pickColor_BackgroundColor").addEventListener("change", function (e) {
                if (e.target.tagName == "INPUT") {
                    addStyle("body {background-color: " + e.target.value + " !important;}", "setColorStyle");
                    GM_setValue("today_BackgroundColor_value", e.target.value);
                    backgroundColor = e.target.value;
                }
            })
            // 选取卡片色
            document.getElementById("pickColor_CardColor").addEventListener("change", function (e) {
                if (e.target.tagName == "INPUT") {
                    addStyle(".cc-cd {background-color: " + e.target.value + " !important;}", "setColorStyle");
                    GM_setValue("today_CardColor_value", e.target.value);
                    cardColor = e.target.value;
                }
            })
            // 选取文字色
            document.getElementById("pickColor_TextColor").addEventListener("change", function (e) {
                if (e.target.tagName == "INPUT") {
                    addStyle(".cc-cd-cb .cc-cd-cb-l .cc-cd-cb-ll .t {color:" + e.target.value + "} .cc-cd-cb .cc-cd-cb-l .cc-cd-cb-ll .s {color:" + e.target.value + "} .cc-cd-cb .cc-cd-cb-l .cc-cd-cb-ll .s.h {color:" + e.target.value + "} .cc-cd-cb .cc-cd-cb-l .cc-cd-cb-ll .e {color:" + e.target.value + "} .cc-cd-if .i-h {color:" + e.target.value + "} .cc-cd-if .i-o {color:" + e.target.value + "} .cc-cd-lb>span, .cc-cd-sb-st {color:" + e.target.value + "}", "setColorStyle");
                    GM_setValue("today_TextColor_value", e.target.value);
                    textColor = e.target.value;
                }
            })
            // 重置背景色和卡片色和文字色
            document.getElementById("resetColor").onclick = function () {
                GM_setValue("today_BackgroundColor_value", null);
                GM_setValue("today_CardColor_value", null);
                document.getElementById("pickColor_BackgroundColor").value = "#000000";
                document.getElementById("pickColor_CardColor").value = "#000000";
                document.getElementById("pickColor_TextColor").value = "#000000";
                removeStyle('setColorStyle');
            }

            // 设置卡片圆角
            document.getElementById("today_CardRadius_box").addEventListener("mousedown", f1, false)
            function f1() {
                document.getElementById("today_CardRadius_box").addEventListener("mousemove", f2, false);
                document.getElementById("today_CardRadius_box").addEventListener("click", f2, false);
            }
            function f2(e) {
                cardRadius = document.getElementById("today_CardRadius").value;
                GM_setValue("today_CardRadius_value", cardRadius);
                setStyle(".cc-cd {border-radius:" + cardRadius + "px !important;}", "setRadiusStyle");
            }
            document.getElementById("today_CardRadius_box").addEventListener("mouseup", function (e) {
                document.getElementById("today_CardRadius_box").removeEventListener("mousemove", f2, false);
            })
            // 重置卡片圆角
            document.getElementById("resetRadius").onclick = function () {
                GM_setValue("today_CardRadius_value", null);
                document.getElementById("today_CardRadius").value = "100";
                removeStyle('setRadiusStyle');
            }
            // 设置卡片高度
            document.getElementById("today_CardHeight_box").addEventListener("mousedown", f12, false)
            function f12() {
                document.getElementById("today_CardHeight_box").addEventListener("mousemove", f22, false);
                document.getElementById("today_CardHeight_box").addEventListener("click", f22, false);
            }
            function f22(e) {
                cardHeight = document.getElementById("today_CardHeight").value;
                GM_setValue("today_CardHeight_value", cardHeight);
                setStyle(".nano {height:" + cardHeight + "px !important;}", "setHeightStyle");
            }
            document.getElementById("today_CardHeight_box").addEventListener("mouseup", function (e) {
                document.getElementById("today_CardHeight_box").removeEventListener("mousemove", f22, false);
            })
            // 重置卡片高度
            document.getElementById("resetHeight").onclick = function () {
                GM_setValue("today_CardHeight_value", 300);
                document.getElementById("today_CardHeight").value = "300";
                removeStyle('setHeightStyle');
            }

            // 双列显示和四列显示
            document.getElementById("twoLineShow").onclick = function () {
                changeLineShow(2);
                twoLineStyle();
            }
            document.getElementById("fourLineShow").onclick = function () {
                changeLineShow(4);
                fourLineStyle();
            }
        }, 100)
    }

})();