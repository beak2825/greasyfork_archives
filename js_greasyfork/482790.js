// ==UserScript==
// @name         LingHu's Collection Of Lightweight Plugins
// @version      0.1.3
// @author       LingHu
// @homepage     https://github.com/linghu-zhe/my-plug.git
// @namespace    https://github.com/linghu-zhe/my-plug.git
// @description  令狐的轻量插件合集-超链接悬浮增加红色下划线、右键清除浏览器缓存、右键清除浏览器缓存、右键移除页面元素
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzAzMDU3MTI2MjU5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEwNTI4IiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cGF0aCBkPSJNNjYuNzgyNjA5IDEwMDEuNzM5MTNoODk2Ljc3OTEzdi02Ni43ODI2MDhINjYuNzgyNjA5eiIgZmlsbD0iI0ZBNEU0RSIgcC1pZD0iMTA1MjkiPjwvcGF0aD48cGF0aCBkPSJNNTE1LjE2MTA0MyA4NDYuODQ4Yy0yMTAuMDc1ODI2IDAtMzgwLjk3MjUyMi0xNzAuODk2Njk2LTM4MC45NzI1MjEtMzgwLjk1MDI2MVYyMi4yNjA4N2g2Ni43ODI2MDh2NDQzLjYzNjg2OWMwIDE3My4yMzQwODcgMTQwLjk1NTgyNiAzMTQuMTY3NjUyIDMxNC4xODk5MTMgMzE0LjE2NzY1MiAxNzMuMjM0MDg3IDAgMzE0LjE4OTkxMy0xNDAuOTMzNTY1IDMxNC4xODk5MTQtMzE0LjE2NzY1MlYyMi4yNjA4N2g2Ni43ODI2MDh2NDQzLjYzNjg2OWMwIDIxMC4wNTM1NjUtMTcwLjg5NjY5NiAzODAuOTUwMjYxLTM4MC45NzI1MjIgMzgwLjk1MDI2MSIgZmlsbD0iIzRBNEE0QSIgcC1pZD0iMTA1MzAiPjwvcGF0aD48L3N2Zz4=
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      *
// @match        *://*/*
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/482790/LingHu%27s%20Collection%20Of%20Lightweight%20Plugins.user.js
// @updateURL https://update.greasyfork.org/scripts/482790/LingHu%27s%20Collection%20Of%20Lightweight%20Plugins.meta.js
// ==/UserScript==


function log(msg, type = "log") {
    console[type](msg)
}

// 清除所有Cookie
function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
        }
    }
}

(function() {
    'use strict';
    try {
        let external = `a.external:after { content:"";display:inline-flex;width:10px;height:10px;margin-left:4px;mask-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB2ElEQVR4nO2bPUoDQRiGHywsLCzsTGEhFsoqFjlFdkEhsVG8gN4hjRcQ8e8A3kHwDhaC6UQEfzqx0qBGWBlYYQluspPM7E5mvxe+cne/59m/mdkEJBKJRJKZGlC3XHMMzhSwACyOWIphpBwDcQHVA/YyelgCHgwc41wXvlYQ/F+9ZvRxYvAY6irKnaBgAbcZfRwYPMbqOAK6wLWlugTWMvqYBS6AO+A+R33YEtDB/TSAz6oKaAyB91rABvDV1+8P8F4FAeE/Z17B7yYPVq8FhAPg8V1AOATeawFRDnhvBUQ54b0UEGnAeycg0oT3SkAT+NaE90ZAc0R4LwQ0M+C3c25/07ftyiQJaI0Jr3Ka2vYFmJ4UAS0D8CozQBs4A5Z1mwhKEtAa4543mqAEAc7AlyFgyyX4ogU4B1+kACfhixKwmXwT6IffMbT/9aTvN2DfRQGPFuFVrlL77uX4AlWqANPwJD2nGRSTUwIawBPwnAx7qZoA2xEByBWA3ALIMwB5CCJvAeQ1iIwDkIEQGglkJIgMhWOZCyCToVhmg8h0OJb1AGRBpMPkRRZEMLgg0rX4Y2lb1TUpIPagtATMO9Cw6VJMWjlyoGlTdYjDf5qqWy7tMy+RSCRUJb/n5ktsX6quoAAAAABJRU5ErkJggg==");mask-size:cover;}`;
        GM_addStyle(external);

        // 超链接处理
        var aList = document.getElementsByTagName("a");
        if (aList && aList.length) {
            for (let i = 0; i < aList.length; i++) {
                let element = aList[i];

                // -------超链接悬浮增加红色下划线---------
                element.onmouseover = function () {
                    element.style.textDecoration = "underline red";
                }
                element.onmouseout = function () {
                    element.style.textDecoration = "unset";
                }

                // -------右键清除浏览器缓存---------
                /* 必应搜索结果的进一步探索点击直接覆盖当前页面，每次都需要右击选择新标签，非常不爽。 */
                /* element.onclick=(e) => {
                    e.preventDefault();

                    setTimeout(function() {
                        e.path.forEach(c => { if (c.nodeName === "A") { window.open(c.href); }})
                    }, 0);
                }; */
            }
        }

        // -------右键清除浏览器缓存---------
        GM_registerMenuCommand("清除所有", function () {
            localStorage.clear();
            sessionStorage.clear();
            clearAllCookie();
        });

        GM_registerMenuCommand("清除所有localStorage", function () {
            localStorage.clear();
        });

        GM_registerMenuCommand("清除所有sessionStorage", function () {
            sessionStorage.clear();
        });

        GM_registerMenuCommand("清除所有Cookie", function () {
            clearAllCookie();
        });

        // -------生成信息---------
        window.onload = () => {
            // log("欢迎使用令狐的轻量插件合集，脚本启动成功, 当前版本:0.2.0");
        }

        // -------右键移除页面元素(刷新就会恢复|只是删除当前)---------
        let event;
        window.addEventListener('contextmenu', function(eventC) {
            event = eventC;
        });
        GM_registerMenuCommand("右键移除页面元素(刷新恢复)", function () {
            if(event) {
                event.target.remove();
            }
        });

    } catch (error) {
        log(error);
    }
})();
