// ==UserScript==
// @name      P9工具包
// @namespace Violentmonkey Scripts
// @version   0.4.0
// @description psnine.com工具包，支持屏蔽站点上的特定id、关键字；可手动设置高亮的的id，并默认高亮了管理员；基因增加楼主发言标记；签到提示。
// @include		*psnine.com*
// @author youngjetzhao mordom0404
// @downloadURL https://update.greasyfork.org/scripts/29343/P9%E5%B7%A5%E5%85%B7%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/29343/P9%E5%B7%A5%E5%85%B7%E5%8C%85.meta.js
// ==/UserScript==
// 在第一行数组里加上要ban掉的id，在第二行数组里添加要ban掉的关键字，在第三行数组里添加要高亮的id。
// id或text在中括号中用英文引号括起来，以逗号隔开。
// 例子：第一行改为 var BanID = ["abc","def","efg"];可屏蔽abc、def和efg，第二、三行同理屏蔽关键字和ID。
(function() {
    var BanID = []; //屏蔽的ID
    var BanText = ["他妈", "你妈"]; //屏蔽的字符
    var HighLightID = ["mechille", "sai8808", "jimmyleo","jimmyleohk"]; //要高亮的ID

    var checkHome = window.location.href.match(/psnine\.com\/$/);//检查首页
    var checkGene = window.location.href.match(/psnine\.com\/gene\/(\d*)/);//检查基因页
    var checkTrophy = window.location.href.match(/psnine\.com\/trophy\/(\d*)/)//检查奖杯页
    var checkUserHome = window.location.href.match(/psnine\.com\/psnid\/(\d*)/)//检查个人首页
    var url = window.location.href;
    var d = url.indexOf("psnine.com");
    var h = url.substring(0, d);
    //Ban掉相关id
    if (checkGene || checkHome) {
        BanID.map(function(v, i) {
            $('[href="' + h + 'psnine.com/psnid/' + v + '"]').parent().hide();
        })
        BanText.map(function(v, i) {
            $('li:contains(' + v + ')').hide();
        })
    }
    //高亮id
    HighLightID.map(function(v, i) {
        $('.meta>[href="' + h + 'psnine.com/psnid/' + v + '"]').css({ "background-color": "#ffe600", "color": "#8f7600" })
    });
    //签到按钮增加动画
    var css = { width: 72, height: 72, fontSize: 40, lineHeight: 72 };
    var count = 5;
    $('.bottombar>a:not(#scrolltop)').css({ "border-radius": 36 });
    $('.bottombar').css({ display: "flex", "flex-direction": "column", "align-items": "flex-end", });
    $('.bottombar>a:not(#scrolltop)').animate(css, 2000, rowBack);

    function rowBack() {
        if (count > 0) {
            if (css.width === 72) {
                css = { width: 36, height: 36, fontSize: 14, lineHeight: 36 }
            } else if (css.width === 36) {
                css = { width: 72, height: 72, fontSize: 40, lineHeight: 72 }
            }
            count--;
            console.log(1)
            $('.bottombar>a:not(#scrolltop)').animate(css, 2000, rowBack);
        }
    }
    //基因增加楼主提示
    if (checkGene) {
        var lz = $($(".side>.box>p")[1]).find("a").text();
        var repoList = $($(".main>.box")[1]).find(".post .meta>a")
        repoList.map(function(i, v) {
            if ($(v).text() == lz) {
                $(v).after('<a href="javascript:void(0);" class="psnnode lz">楼主</a>')
            }
        })
        $(".lz").css({
            "background-color": "#3890ff",
            color: "#fff"
        })
    }
    //个人主页样式更新
    if (checkUserHome) {
    	$(".inav").css({ display: "flex" });
    	$(".inav li").css({ "flex-grow": 1 });
    }

    //奖杯tips文本编辑框变得更大且可拖动缩放大小
    if (checkTrophy) {
        $("#comment").attr("rows", 20).css("resize", "vertical");
        $($(".box")[1]).children(".pd10").children(".none").hide()
    }
    //首页及基因发帖框设置为可拖动缩放大小
    if (window.location.href.match(/psnine\.com\/node\/talk\/add/) || window.location.href.match(/psnine\.com\/set\/gene/)) {
    	$("#comment").css("resize", "vertical");
    	$(".pr20>textarea").css("resize", "vertical");
    }
})()
