// ==UserScript==
// @name         洛谷luogu题解优化p
// @namespace    https://www.luogu.org/space/show?uid=80937
// @version      1.5.22342232
// @description  优化了洛谷的题解，事实上是增加了查看题解的前置要求
// @author       black_white_tony
// @match        https://www.luogu.org/problemnew/show/*
// @match        http://www.luogu.org/problemnew/show/*
// @match        https://www.luogu.org/problem/show/
// @match        http://www.luogu.org/problem/show/
// @match        https://www.luogu.org/space/*
// @match        http://www.luogu.org/space/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/387317/%E6%B4%9B%E8%B0%B7luogu%E9%A2%98%E8%A7%A3%E4%BC%98%E5%8C%96p.user.js
// @updateURL https://update.greasyfork.org/scripts/387317/%E6%B4%9B%E8%B0%B7luogu%E9%A2%98%E8%A7%A3%E4%BC%98%E5%8C%96p.meta.js
// ==/UserScript==


var tot = 2;

function anti_solve(plc) { window.event.returnValue = false; } // 完全禁用

function work() { // 主函数
    var plc = document.getElementsByClassName("am-btn am-btn-primary am-btn-sm")[0];
    var begin_time_ = Date.parse(new Date());
    plc.onclick = function () {
        if (GM_getValue("settings") == 1) {
            alert("题解禁用已生效，请再仔细思考再看题解！");
            anti_solve(plc);
        } else if (GM_getValue("settings") == 2) {
	    if ((Date.parse(new Date()) - begin_time_) / 1000 < GM_getValue("wait_time")) {
		alert("题解禁用已生效，还有" + String(GM_getValue("wait_time") - (Date.parse(new Date()) - begin_time_) / 1000) + " 秒即可查看题解");
		anti_solve(plc);
	    }
	}
    };
}


if (window.location.href.match(/space/) !== null) {
    $($("#mynotice_btn")).before("<p> <button class='am-btn am-btn-sm am-btn-primary' id= 'setting_solve'>题解优化设置</button></p>");
    $("#setting_solve").click(function() {
        alert("正在进行洛谷题解优化初次设置");
        var chs = prompt("请选择题解优化的方式：\n 1 : 完全禁用\n 2 : 限时禁用（所有难度统一时间）");
        while (chs > tot) {
            alert("其他优化方式正在努力开发中，请期待！")
            chs = prompt("请选择题解优化的方式：\n 1:完全禁用");
        }
        GM_setValue("settings", chs);
	if (chs == 2) {
	    var wait_time = prompt("请输入题解禁用时长（单位：秒）");
	    GM_setValue("wait_time", wait_time);
	    
	}
    });
    
}

if (window.location.href.match(/problem/) !== null) {
    work();
}

(function () {
    if (GM_getValue("settings") === null) GM_setValue("settings", -1)
})();

