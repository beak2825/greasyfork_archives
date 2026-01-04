// ==UserScript==
// @name         CSDN tools
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  download csdn page clearly!
// @author       youguess
// @include        *://blog.csdn.net/*
// @include        *://www.cnblogs.com/*
// @icon         https://img-home.csdnimg.cn/images/20201124032511.png
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/524173/CSDN%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/524173/CSDN%20tools.meta.js
// ==/UserScript==

var download = (function () {
    'use strict';

    // Your code here...、
    // get url to identify the page
    let url = window.location.href;
    // alert(url);

    function removeElementsForCSDN() {
        $("#side").remove();
        $("#comment_title, #comment_list, #comment_bar, #comment_form, .announce, #ad_cen, #ad_bot").remove();
        $(".nav_top_2011, #header, #navigator").remove();
        $(".p4course_target, .comment-box, .recommend-box, #csdn-toolbar, #tool-box").remove();
        $("aside").remove();
        $(".tool-box").remove();
        $("#toolBarBox").remove();
        $("main").css('display', 'content');
        $("main").css('float', 'left');
        $(".option-box").remove();
        $("body").css('min-width', 0);
        $(".option-box").remove();
        $("#copyright-box").remove();
        $("#blogExtensionBox").remove();
        $("#toolbarBox").remove();
        var right_content = document.getElementById("rightAsideConcision");
        console.log(right_content);
        if (right_content) {
            console.log("right_content cleared");
            right_content.remove();
        }

        var main_content = document.getElementsByClassName("blog-content-box");
        if (main_content) {
            main_content[0].style.margin = "0 auto";
            main_content[0].style.maxWidth = "800px";
        }

        //Auto expand the code of the article
        var code_expand_buttons = document.querySelectorAll(".look-more-preCode");
        if (code_expand_buttons) {
            code_expand_buttons.forEach(function (button) {
                button.click();
            })
        }


    }
    function removeElementsForCnblogs() {
        $("#navigator").remove();
        $("#cnblogs_ch").remove();
        $("#under_post_card2").remove();
        $("#under_post_card1").remove();
        $(".esa-catalog-contents").remove();
        $(".aplayer-body, #ap").remove();
        $("#scrollInfo").remove();
        $("#footer").remove();
        $(".login_tips").remove();
        $("#blog_c1").remove();
        $("#blog_post_info").remove();
        $(".postDesc").remove();
        $("#blog_post_info_block").remove();
    }

    if (url.match("/.*?csdn\.net*?/")) {
        // alert("csdn");
        window.onload = removeElementsForCSDN();
    }
    if (url.match("/.*?cnblogs.*?/")) {

        // alert("cnblogs");
        window.onload = removeElementsForCnblogs();
    }


})();