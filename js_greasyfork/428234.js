// ==UserScript==
// @name         洛谷快捷键LuoguShortcutKeys
// @namespace    https://github.com/Aksadfjh/LuoguShortcutKeys
// @version      0.5
// @description  提供便捷的洛谷快捷键
// @author       Aksadfjh
// @match        https://www.luogu.com.cn/*
// @match        http://www.luogu.com.cn/*
// @match        https://www.luogu.org/*
// @match        http://www.luogu.org/*
// @match        https://blog.luogu.com.cn/*
// @match        http://blog.luogu.com.cn/*
// @match        https://blog.luogu.org/*
// @match        http://blog.luogu.org/*
// @icon         https://www.google.com/s2/favicons?domain=luogu.com.cn
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/428234/%E6%B4%9B%E8%B0%B7%E5%BF%AB%E6%8D%B7%E9%94%AELuoguShortcutKeys.user.js
// @updateURL https://update.greasyfork.org/scripts/428234/%E6%B4%9B%E8%B0%B7%E5%BF%AB%E6%8D%B7%E9%94%AELuoguShortcutKeys.meta.js
// ==/UserScript==

(function () {

    /////////////// 内测版 ///////////////
    // 提供最基本的快捷键Ctrl+Enter发送犇犇
    // 其他功能，敬请期待！
    //////////////   END  ////////////////

    /************* 更新日志 ************/
    // v0.1: 基础版本，发布最基础功能；
    // v0.5: 增加Ctrl+Enter发送帖子回复；全新键盘监听方式；全新console；
    /**********************************/

    console.clear();
    console.log('%c[Luogu Shortcut Keys]加载成功，欢迎使用！', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:2em;');
    console.log("[Luogu Shortcut Keys]作者：Aksadfjh, 当前版本：0.0.5, 项目地址：https://github.com/Aksadfjh/LuoguShortcutKeys, 油猴：https://greasyfork.org/zh-CN/scripts/428234");
    // console.log('%c[Luogu Shortcut Keys]加载成功，欢迎使用！', 'font-size:20px')
    // console.log("[Luogu Shortcut Keys]加载成功, 版本:0.5, 作者:Trotyl, 项目地址:https://github.com/Aksadfjh/LuoguShortcutKeys");

    var urlpath = window.location.pathname, url = window.location.href;

    function btnClick(btnid) {
        $("#" + btnid).click();
    }

    function hfiClick(herfid) {
        document.getElementById(herfid).click();
    }

    function hfnClick(herfname) {
        document.querySelector('[name=' + herfname + ']').click();
    }

    function msgConfirm(tip) {
        if (confirm(tip) == true) {
            return true;
        } else {
            return false;
        }
    }

    function tipShow(tip, type) {
        var $tip = $('#tip');
        if ($tip.length == 0) {
            $tip = $('<span id="tip" style="position:fixed; top:50px; left: 50%; z-index:9999; height: 35px; padding: 0 20px; line-height: 35px; background-color: white; color: red; border: 5px; opacity: 10%"></span>');
            $('body').append($tip);
        }
        $tip.stop(true).prop('class', 'alert alert-' + type).text(tip).css('margin-left', -$tip.outerWidth() / 2).fadeIn(250).delay(500).fadeOut(250);
    }

    function msgShow(msg) {
        tipShow(msg, 'info');
    }

    // var keybuf = {};

    function strIc(stra, strb) {
        if (stra.indexOf(strb) != -1) return true;
        return false;
    }

    function btnSendDsb() {
        if (strIc(urlpath, "discuss/show/")) {
            console.log(urlpath, strIc(urlpath, "discuss/show/"));
            hfiClick("submit-reply");
        }
        if (url == "https://www.luogu.com.cn/") {
            btnClick("feed-submit");
            console.log(url);
        }
    }

    function btnDeleteDsb() {
        if (strIc(urlpath, "discuss/show/")) {
            console.log(urlpath, strIc(urlpath, "discuss/show/"));
            hfnClick("delete-reply");
        }
        if (url == "https://www.luogu.com.cn/") {
            btnClick("feed-delete");
            console.log(url);
        }
    }

    function keyLis(sk) {
        var keys = {};

        $(document.body).keydown(function (event) {
            // save status of the button 'pressed' == 'true'
            for (i in sk) {
                if (event.keyCode == sk[i]) {
                    keys[sk[i]] = true;
                }
            }
            var f = true;
            for (i in sk) {
                if (!keys[sk[i]]) {
                    f = false;
                }
            }
            if (f) {
                btnSendDsb();
                msgShow("发送成功");
                return true;
            }
        });

        $(document.body).keyup(function (event) {
            // reset status of the button 'released' == 'false'
            for (i in sk) {
                if (event.keyCode == sk[i]) {
                    keys[sk[i]] = false;
                }
            }
        });
    }

    function twoKeyLis(a, b) {
        var keys = {};

        $(document.body).keydown(function (event) {
            // save status of the button 'pressed' == 'true'
            if (event.keyCode == a) {
                keys[a] = true;
            } else if (event.keyCode == b) {
                keys[b] = true;
            }
            if (keys[a] && keys[b]) {
                return true;
            }
        });

        $(document.body).keyup(function (event) {
            // reset status of the button 'released' == 'false'
            if (event.keyCode == a) {
                keys[a] = false;
            } else if (event.keyCode == b) {
                keys[b] = false;
            }
        });
    }

    function keyDtc() {
        // console.log(keyLis([17, 13]));
        keyLis([17, 13]);
    }

    // if (keyLis([17, 13])) {
    //     btnSendDsb();
    //     msgShow("发送成功");
    // }

    keyDtc();
})();