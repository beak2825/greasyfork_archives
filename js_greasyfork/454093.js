// ==UserScript==
// @name         自用脚本
// @namespace    http://tampermonkey.net/
// @description  try to take over the world!自用
// @version      0.1.49
// @author       树
// @license      License
// @match        https://www.iopq.net/*
// @icon         https://www.iopq.net/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://unpkg.com/hotkeys-js@3.9.4/dist/hotkeys.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at 	     document-end
// @downloadURL https://update.greasyfork.org/scripts/454093/%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/454093/%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    //JS严格模式
    ("use strict");

    var $ = $ || window.$;
    var newTap;
    //主程序
    if (location.href.indexOf("login") >= 0) {
        console.log("检测到登陆网站");
        login();
    } else if (location.host.indexOf("iopq.net") >= 0) {
        console.log("检测到网站主页");
        iopq();
    } else {
        console.log("当前页面错误");
    }

    function iopq() {
        console.log("检查登陆状态");
        if ($("#ls_cookietime").length > 0) {
            console.log("登陆元素不存在");
            //先判断 是否登陆 没有登陆直接返回错误
            console.log("前往登陆页面");
            // location.href = "https://www.iopq.net/member.php?mod=logging&action=login";
            onpenNewTap();
            listenNewTap();
        } else {
            console.log("账号登陆中");
            console.log("签到开始");
            if ($("#g_upmine").length > 0) {
                $("#g_upmine").trigger("click");
                console.log("签到成功");
            } else {
                console.log("签到失败");
            }
        }
    }
    //登陆函数
    function login() {
        console.log("准备登陆");
        let timer1 = setTimeout(function() {
            const t1 = document.querySelector("input[name=password]");
            console.log(t1.value);
            // console.log($("[name=password]").val(), val);
            $("[name=password]").attr("onfocus", "");
            $(".c").parents(".cl").attr("autocomplete", "on");
            $("#scbar_txt").val("1");
            $("[name=password]").trigger("focus");
            // $("#wp>#ct>.mn>.bm").trigger("focus");
            $(".rfm>table>tbody>tr>td>label>input").prop("checked", true);
            // $(".cl>.cl").trigger("click");
            console.log("打勾");
        }, 3000);
        let timer2 = setTimeout(function() {
            $(".bw0>table>tbody>tr>td>button>strong").trigger("click");
            console.log("点击");
        }, 5000);
        // let timer3 = setTimeout(function() {
        //     $(document).trigger("focus");
        //     // console.log($(".bw0>table>tbody>tr>td>button>strong"));
        //     // $(".bw0>table>tbody>tr>td>button>strong").trigger("click");
        //     const pnc = document.querySelector(
        //         ".bw0>table>tbody>tr>td>button>strong"
        //     );
        //     pnc.click();
        //     console.log("点击1");
        // }, 10000);
        if ($("#hd .wp .hdc #um p .qq a").length > 0) {
            console.log("登陆成功");
            clearTimeout(timer1);
            clearTimeout(timer2);
            GM_setValue("newTapState", false);
            console.log("准备签到");
        } else {
            console.log("代码内部错误,请修改");
        }
    }

    //打开新页面
    function onpenNewTap() {
        newTap = GM_openInTab(
            "https://www.iopq.net/member.php?mod=logging&action=login", {
                active: true,
                setParent: true,
            }
        );
        GM_setValue("newTapState", true);
    }
    //关闭页面
    function closeNewTap() {
        newTap.close();
    }
    //监听新标签页的状态
    function listenNewTap() {
        GM_addValueChangeListener(
            "newTapState",
            function(name, old_value, new_value, remote) {
                if (new_value == false) {
                    closeNewTap();
                    iopq();
                }
            }
        );
    }
    // 仪表盘控制栏添加按钮
    GM_registerMenuCommand("点击签到", function() {
        iopq();
    });
    var shortCutString = "alt+W";
    if (GM_getValue("shortCutString") != undefined) {
        shortCutString = GM_getValue("shortCutString");
    }
    GM_registerMenuCommand("快捷签到", wrapper);
    hotkeys(shortCutString, wrapper);

    function wrapper() {
        iopq();
    }
})();