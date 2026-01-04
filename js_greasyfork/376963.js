// ==UserScript==
// @name         VIP2（自动播放）
// @namespace    http://shua.ccking.top//
// @version      1.0.3
// @description  try to take over the world!
// @author       You
// @match        **.chaoxing.com/mycourse/studentstudy?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376963/VIP2%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/376963/VIP2%EF%BC%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%EF%BC%89.meta.js
// ==/UserScript==
/**
 * 更新时间：2018-10-24
 * 协议方式：模拟页面操作
 * 风险等级：轻微
 * @author  Jokin
 * @version 2.0.1-beta
 * BY陳大飛 QQ154321630
 */
var fa = $("body");
var btn = $("<li></li>");
var json = {
    "background-color": "rgba(70, 196, 38, 0.8)",
    "height": "32px",
    "width": "284px",
    "padding": "8px",
    "border": "2px dashed rgb(0, 85, 68)",
    "z-index": 999999,
    "cursor": "pointer",
    "top": "50px",
    "left": "0px",
    "position": "fixed"
};
btn.css(json);
btn.html("<span id='lfsenior'><center>开启自动播放  BY陳大飛<br/>☞点击开始刷课</center></span>");
fa.append(btn);

btn.click(function () {

    setInterval(function () {
        //获取iframe
        var video = $("iframe").contents().find("iframe").contents();
        //播放函数
        var play = function () {
            video.find("#video > button").click();
            var jy = video.find("#video > div.vjs-control-bar > div.vjs-volume-panel.vjs-control.vjs-volume-panel-vertical > button");
            if (jy.attr("title") != "取消静音") {
                jy.click()
            }
        }
        //如果正在加载
        var load = video.find("#loading");
        if (load.css("visibility") != "hidden") {
            return;
        }
        //获取当前进度
        var spans = video.find("#video > div.vjs-control-bar > div.vjs-progress-control.vjs-control > div").attr("aria-valuenow");
        // 如果还没播放完
        if (spans != 100) {
            play();
        }
        //如果播放结束
        if (spans == 100) {
            var bs = false;
            $(".onetoone").find(".flush").each(function () {
                if (bs) {
                    $(this).prev("a").on('click', "#coursetree>ncells", function () {
                        console.log("已结束章节：" + $(this).prev("a").attr("title"))
                    })
                    var str = $(this).prev("a").attr("href");
                    str = str.match(/'(\S*)'/)[1];
                    var reg = new RegExp("'", "g");
                    str = str.replace(reg, "");
                    var href = str.split(",");
                    getTeacherAjax(href[0], href[1], href[2])
                    bs = false;
                }
                if ($(this).css("display") == "block") {
                    bs = true;
                }
            })
        }
        $("#lfsenior").html("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp自动模式已开启,本章进度:" + spans + "% <br/>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp——BY陳大飛");
    }, 100);

});