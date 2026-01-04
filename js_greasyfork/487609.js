// ==UserScript==
// @name         Hostloc Mobile
// @namespace    http://tampermonkey.net/
// @version      9
// @description  Better experience on phones
// @author       duoduo
// @match        https://hostloc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hostloc.com
// @grant        GM_addStyle
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.7.1.min.js
// @sandbox      DOM
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487609/Hostloc%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/487609/Hostloc%20Mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 重定向到简易版
    let search = new URLSearchParams(location.search);
    if (search.get("mobile") !== "1") {
        search.set("mobile", "1");
        location.search = search.toString();
        return;
    }

    if (!search.get("mobile")) {
        return;
    }

    // 修复页面宽度
    $("body").css("width", "100vw");
    $("meta[name=\"viewport\"]").attr("content", "width=" + window.screen.width + ", initial-scale=1, maximum-scale=1, minimum-scale=1");

    // 默认字体大小
    $("*").css("font-size", "large");

    const smiley = [["yc002t","static/image/smiley/yct/002.gif"],["yc012t","static/image/smiley/yct/012.gif"],["yc006t","static/image/smiley/yct/006.gif"],["yc011t","static/image/smiley/yct/011.gif"],["yc004t","static/image/smiley/yct/004.gif"],["yc005t","static/image/smiley/yct/005.gif"],["yc018t","static/image/smiley/yct/018.gif"],["yc021t","static/image/smiley/yct/021.gif"],["yc015t","static/image/smiley/yct/015.gif"],["yc008t","static/image/smiley/yct/008.gif"],["yc017t","static/image/smiley/yct/017.gif"],["yc010t","static/image/smiley/yct/010.gif"],["yc022t","static/image/smiley/yct/022.gif"],["yc013t","static/image/smiley/yct/013.gif"],["yc009t","static/image/smiley/yct/009.gif"],["yc014t","static/image/smiley/yct/014.gif"],["yc007t","static/image/smiley/yct/007.gif"],["yc020t","static/image/smiley/yct/020.gif"],["yc001t","static/image/smiley/yct/001.gif"],["yc019t","static/image/smiley/yct/019.gif"],["yc003t","static/image/smiley/yct/003.gif"],["yc016t","static/image/smiley/yct/016.gif"],[":)","static/image/smiley/default/smile.gif"],[":(","static/image/smiley/default/sad.gif"],[":D","static/image/smiley/default/biggrin.gif"],[":'(","static/image/smiley/default/cry.gif"],[":@","static/image/smiley/default/huffy.gif"],[":o","static/image/smiley/default/shocked.gif"],[":P","static/image/smiley/default/tongue.gif"],[":$","static/image/smiley/default/shy.gif"],[";P","static/image/smiley/default/titter.gif"],[":L","static/image/smiley/default/sweat.gif"],[":Q","static/image/smiley/default/mad.gif"],[":lol","static/image/smiley/default/lol.gif"],[":hug:","static/image/smiley/default/hug.gif"],[":victory:","static/image/smiley/default/victory.gif"],[":time:","static/image/smiley/default/time.gif"],[":kiss:","static/image/smiley/default/kiss.gif"],[":handshake","static/image/smiley/default/handshake.gif"],[":call:","static/image/smiley/default/call.gif"],[":loveliness:","static/image/smiley/default/loveliness.gif"],[":funk:","static/image/smiley/default/funk.gif"]];

    // 表情
    $("textarea").before(function() {

        let textarea = $(this);

        let div = $("<div></div>");
        div.hide();

        smiley.forEach(each => {
            $("<img></img>").attr("src", each[1]).css("width", "25px").css("height", "25px").on("click", function() {
                textarea.val(textarea.val() + " " + each[0]);
            }).appendTo(div);
        });

        $(this).after(div);

        let a = $("<a>添加表情</a>");
        $(this).after(a);
        a.on("click", function() {
            div.toggle();
        });
    });

    // 隐藏自定义页码
    $("input[name='custompage']").parent().hide();

    // 按钮 / 下拉选项
    $("input[type='submit'], button").css("background", "#2A6EB4").css("border", "none").css("padding", "2px").css("color", "white").css("border-radius", "5px");
    $("select").css("background", "white").css("border", "2px solid #2A6EB4").css("padding", "2px").css("color", "black").css("border-radius", "5px");

    // 投票
    $("form[name='poll']").css("background", "rgb(251, 251, 255)");

    // 引用
    $(".quote").css("background", "rgb(251, 251, 255)");

    // 隐藏连接
    $(".bm_user > a:contains('发消息')").hide();
    $(".bm_user > a:contains('只看他')").hide();

    // 回复按钮
    $(".mbn").parent().prev().find("a").not(".xg1").after(function() {
        let a = $(this).closest(".bm_c").next().find("a:contains('回复')");
        let href = a.attr("href");
        a.parent().hide();
        return $("<a> 回复</a>").attr("href", href).css("color", "#999999");
    });

    // 图片链接
    $(".postmessage > img").wrap(function() {
        return $("<a target=\"_blank\"></a>").attr("href", $(this).attr("src"));
    });


})();