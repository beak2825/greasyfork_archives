// ==UserScript==
// @name         PY脚本
// @description  1+X平台
// @version      1.0.0
// @author       Adler
// @include      https://192.168.10.*
// @namespace https://greasyfork.org/users/93520
// @downloadURL https://update.greasyfork.org/scripts/429111/PY%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/429111/PY%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var button1 = "<button id=\"oneKeyBoot\">一键启动</button>";
var button2 = "<button id=\"oneKeyShutdown\">一键熄火</button>";
var button3 = "<button id=\"oneKeyConnect\">一键连接</button>";
var button4 = "<button id=\"bootAndConnect\">启动并连接</button>";
var button5 = "<button id=\"toContent\">查看课件</button>";
var button6 = "<button id=\"toContent2\">新窗口查看课件</button>";
var button7 = "<button id=\"toVideo\">观看视频</button>";

var status_bar = "<br><div id=\"stas_bar\"></div>";
$(".course-name").after(button1 + button2 + button3 + button4 + button5 + button6 + button7 + status_bar);

$("#oneKeyBoot").click(allPowerOn);
$("#oneKeyShutdown").click(allPowerOff);
$("#oneKeyConnect").click(allConnect);
$("#bootAndConnect").click(PowerOnAndConnect);
$("#toContent").click(openSmallContent);
$("#toContent2").click(openContent);
$("#toVideo").click(watchVideo);

function allPowerOn() {
    $(".row")[1].click();
    $(".icon-power-on").click();
    status("虚拟机编号 1 已启动");
    for (var i = 2; i < $(".row").length; i++) {
        (function(e) {
            setTimeout(function() {
                $(".row")[e].click();
                $(".icon-power-on").click();
                status("虚拟机编号 " + e + " 已启动");
            }, (e - 1) * 3000);
        })(i);
    }
}

function allPowerOff() {
    $(".row")[1].click();
    $(".icon-power-off").click();
    status("虚拟机编号 1 已熄火");
    for (var i = 2; i < $(".row").length; i++) {
        (function(e) {
            setTimeout(function() {
                $(".row")[e].click();
                $(".icon-power-off").click();
                status("虚拟机编号 " + e + " 已熄火");
            }, (e - 1) * 3000);
        })(i);
    }
}

function allConnect() {
    $(".row")[1].click();
    $(".icon-forword").click()
    status("虚拟机编号 1 已连接");
    for (var i = 2; i < $(".row").length; i++) {
        (function(e) {
            setTimeout(function() {
                $(".row")[e].click();
                $(".icon-forword").click()
                status("虚拟机编号 " + e + " 已连接");
            }, (e - 1) * 5000);
        })(i);
    }
}

function PowerOnAndConnect() {
    allPowerOn();
    setTimeout(allConnect, ($(".row").length - 1) * 3000);
}

function openContent() {
    $(".sml_tab:contains('课件内容')").dblclick();
}

function openSmallContent() {
    $(".tab:contains('课程内容')").click();
    $(".sml_tab:contains('课件内容')").click();
}

function openAllContent() {
    openContent();
    openSmallContent();
}

function openVideo() {
    $(".tab:contains('课程内容')").click();
    $(".sml_tab:contains('视频解析')").click();
}

function watchVideo() {
    openVideo();
    setTimeout(function() {
        $("video").attr("style", "position: fixed; left: 0px; top: 0px; right: auto; bottom: auto; z-index: 1042; width: 612.562px;");
        $(".video-drag").attr("style", "left: 0px; top: 0px; width: 612.562px; height: 460.375px; right: auto; bottom: auto; z-index: 1043;");
        $(".video-play").click();
    }, 1000);
}

function status(statusText) {
    $("#stas_bar").text(statusText);
}