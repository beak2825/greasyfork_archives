// ==UserScript==
// @name         360
// @namespace    https://greasyfork.org/vi/users/20451-anh-nguyen/
// @version      1.0
// @description  Edit UI https://my.jia.360.cn/web/myList
// @author       Paul Nguyen
// @grant        none

// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @include        /^https?://my\.jia\.360\.cn/.*$/

// @downloadURL https://update.greasyfork.org/scripts/391942/360.user.js
// @updateURL https://update.greasyfork.org/scripts/391942/360.meta.js
// ==/UserScript==

$(function() {
    $('body > div > div.header > div').css("display", "none");
    $('#nav_wrap').css("display", "none");

    $('#ipcs_list_box > ul > li:nth-child(1) > h4 > div').click(function(event) {
        var target = $(event.target);
        //target.css("border", "1px solid red");
        //target.parent().parent().css("background-color", "yellow");
        //target.parent().css("border", "1px solid red");
        var box = target.parent().parent().find('div:first-child > div.mv-box');
        //box.css("border", "1px solid red");
        box.css("position", "fixed");
        box.addClass("box");
        box.css("background-color", "black");
    });
});
$(document).keyup(function(e) {
     if (e.key === "Escape") {
         $('div.box').css("position", "");
    }
});
