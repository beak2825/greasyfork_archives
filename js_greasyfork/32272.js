// ==UserScript==
// @name         Re-Mcbbs
// @namespace    undefined
// @version      0.3
// @description  the old
// @author       SettingDust
// @include      *mcbbs.net/*
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/32272/Re-Mcbbs.user.js
// @updateURL https://update.greasyfork.org/scripts/32272/Re-Mcbbs.meta.js
// ==/UserScript==

$(function () {
    var css = "";
    //修改标题
    document.title = " Minecraft(我的世界)中文论坛 - Mcbbs";
    $("[src='template/mcbbs/image/logo_sc.png']").attr("src", "http://i.imgur.com/8WUBLPS.png");
    //主体背景颜色
    css += [
        "#hd .wp {",
        "  background: none;",
        "}",
        "#ip_notice .bm{",
        "  background: #C5A97A;",
        "}",
        "#ip_notice{",
        "  background: none;",
        "  bottom: -9px;",
        "}",
        ".plugin .bm_h {",
        "  background: #D6BE96",
        "}"
    ].join("\n");

    //修改底部
    $("[style*='width:100%;margin-top:-20px;']").css("background", "rgba(0, 0, 0, 0.4) none repeat scroll 0 0");
    $("body").append($("[style*='width:100%;margin-top:-20px;']"));

    //修改顶部
    css += [
        "#toptb {",
        "  background: none 0px 0px repeat scroll rgba(0, 0, 0, 0.4);",
        "  line-height: 39px;",
        "  height: auto;",
        "}",
        "#toptb .z a {",
        "  height: 39px;",
        "}",
        "#toptb .z a:hover {",
        "  background: rgba(255, 255, 255, 0.2) none repeat scroll 0 0;",
        "  background-size: 100% 37px;",
        "  color: #fff;",
        "  text-decoration: none;",
        "}",
        "#um {",
        "  margin-right: 82px;",
        "}",
        ".mc_map_wp {",
        "  margin-top: -26px;",
        "}",
        ".z {",
        "   margin-left: 100px;",
        "}"
    ].join("\n");
    $(".hdc.cl > h2").css("margin-top", "-18px").css("margin-left", "130px");

    //边框修改
    css += [
        ".mc_map_border_top {",
        "  background: none;",
        "  height: 0;",
        "}",
        ".mc_map_border_right {",
        "  background: none",
        "}",
        ".mc_map_border_foot {",
        "  height: 0;",
        "  background: none",
        "}",
        ".mc_map_border_left {",
        "  background: none",
        "}",
        "#scrolltop .scrolltopa {",
        "  visibility: hidden;",
        "}"
    ].join("\n");

    //导航栏修改
    $(".nv_ul").css("background", "none");
    css += ["#nv .nv_ul li a {",
        "  width: 80px;",
        "  height: 57px;",
        "  padding: 0;",
        "  text-align: center;",
        "  font-size: 14px;",
        "  background: none !important;",
        "  border: none",
        "}",
        "#nv .nv_ul li a:hover {",
        "  background: none !important;",
        "  color: #ffff58;",
        "  text-decoration: underline;",
        "}",
        "#nv .nv_ul li {",
        "  width: 60px;",
        "  padding: 0;",
        "  height: 57px;",
        "  line-height: 56px;",
        "  background: none !important;",
        "}",
        "#nv .nv_ul li:last-child a {",
        "  border: none;",
        "}",
        "#nv .nv_ul li:first-child a:hover{",
        "  border: none;",
        "}",
        "#nv li#mn_N7844.hover a {",
        "  background: none !important;",
        "  color: #ffff58 !important;",
        "}",
        "#hd .h_pop {",
        "  border-top: 1px solid #b1a994;",
        "}",
        "#hd .p_pop a:hover {",
        "  color: #C5A97A;",
        "}"
    ].join("\n");
    $("#nv_right").remove();

    //修改搜索
    css += [
        ".y_search {",
        "  width: auto;",
        "  margin-top:4px;",
        "}",
        ".y_search_inp {",
        "  background: none;",
        "}"
    ].join("\n");
    $(".y_search_btn").remove();

    //分情况处理
    var url = document.URL;
    if (url.endsWith("forum.php") || url.endsWith("portal.php")) {
        //修改个人资料部分
        css += [
            ".special_info {",
            "  background: none !important;",
            "}",
            ".special_info_t {",
            "  background: none !important;",
            "}",
            ".special_info_i {",
            "  background: none !important;",
            "}",
        ].join("\n");
        $(".special_user_info").css("background-color", "#C5A97A");
        var avatar = $(".special_photo > img").attr("src");
        if (avatar !== undefined) {
            avatar = avatar.replace("big", "middle");
            $(".special_photo").css("background", "url(" + avatar + ") center no-repeat");
            $(".special_photo > img").remove();
        }

        //微博修改
        css += [
            "iframe {",
            "  height: 415px;",
            "  width: 264px;",
            "}"
        ].join("\n");

        //背景修改
        css += [
            "#wp {",
            "  background: none;",
            "}",
            "#nv_forum #ct {",
            "  background: none;",
            "}"
        ].join("\n");

        if (url.endsWith("portal.php")) {
            //背景修改
            css += [
                "#wp .wp {",
                "  background: none;",
                "}",
                ".portal_left_dev {",
                "  background: #D6BE96",
                "}"
            ].join("\n");
            //修改侧边栏
            css += [
                "#portal_index_right .block {",
                "  background: #C5A97A",
                "}",
                "#portal_index_right .frame {",
                "  background: none",
                "}",
                "#portal_index_right .portal_game {",
                "  width: auto;",
                "}",
                "#portal_index_right .portal_game {",
                "  padding: 0px 1px",
                "}"
            ].join("\n");
            $("#portal_block_737_content").attr("style", "margin: 0 !important;");

            //修改轮播
            css += [
                ".ss3_wrapper .slideshow_paging li {",
                "  background: none;",
                "}",
                ".ss3_wrapper .slideshow_paging a {",
                "  width: 90px;",
                "  height: 43px;",
                "  overflow: hidden;",
                "}",
                ".ss3_wrapper .slideshow_paging .activeSlide {",
                "  background-color: rgba(255,255,255,0.4);",
                "}",
                ".portal_wrapper4 .slideshow_paging li {",
                "  height: auto;",
                "}",
                "#portal_left .portal_txt {",
                "  margin: auto 8px;",
                "}",
                ".portal_wrapper .slideshow_paging a {",
                "  width: 73px;",
                "  height: 39px",
                "}",
                ".portal_wrapper .slideshow_paging li {",
                "   background: none;",
                "}",
                ".portal_wrapper .slideshow_paging .activeSlide {",
                "  background-color: rgba(255,255,255,0.6);",
                "}",
                "#slideshow_3 .slideshow_item .image a {",
                "  height: 320px;",
                "  width: 670px;",
                "  overflow: hidden;",
                "}"
            ].join("\n");
        }
        if (url === "http://www.mcbbs.net/forum.php") {
            //修改侧边栏
            css += [
                "#forum_index_right .frame {",
                "  background: none;",
                "}",
                "#forum_index_right .block {",
                "  background-color: #C5A97A !important;",
                "}"
            ].join("\n");
            $(".bm.bmw.cl").css("background", "#D6BE96");
        }
    } else if (url.includes("http://www.mcbbs.net/misc.php?mod=faq")) {
        //修改背景
        css += [
            "#wp .wp {",
            "  background: none;",
            "}",
            ".tbn {",
            "  background: #D6BE96",
            "}",
            ".lum ul {",
            "  background: #D6BE96 !important",
            "}"
        ].join("\n");
        if (url === "http://www.mcbbs.net/misc.php?mod=faq") {
            css += [
                ".bm {",
                "  background: none;",
                "}"
            ].join("\n");
        }
        if (new RegExp("mod=faq&action=faq&id=\d*").test(url)) {
            css += [
                ".bm {",
                "  background: #D6BE96;",
                "}"
            ].join("\n");
        }
    }
    $("<style></style>").text(css).appendTo($("head"));
});
