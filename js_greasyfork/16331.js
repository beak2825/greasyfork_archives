/**
 *
 * This script was written for Greasemonkey, and must be run using a Greasemonkey-compatible browser.
 *
 * @author IagoNL @ FetLife
 */
// ==UserScript==
// @name           FetLife pop-up chat
// @author         IagoNL @ FetLife
// @version        1.1
// @description    An alternative view for the FetLife chat
// @namespace      https://fetlife.com/flpopupchat
// @run-at         document-idle
// @include        https://fetlife.com/*
// @exclude        https://fetlife.com/adgear/*
// @exclude        https://fetlife.com/chat/*
// @exclude        https://fetlife.com/polling/*
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/16331/FetLife%20pop-up%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/16331/FetLife%20pop-up%20chat.meta.js
// ==/UserScript==

FLpopupchat = {};
FLpopupchat.init = function() {
    btn_maximize = "<div class=\"btn_wrapper\"><a class=\"btn_toggle xs\" onclick=\"FLpopupchat.toggleChat();return false;\" href=\"#\">Maximize</a></div>";
    btn_toggle = "<div class=\"btn_wrapper\"><a class=\"btn_toggle header\" onclick=\"FLpopupchat.toggleChat();return false;\" href=\"#\">Maximize</a></div>";
    uw.$("#im .list > div > div.header").append(btn_toggle);
    uw.$("#im .list > a.closedtitle").append(btn_maximize);
};
FLpopupchat.showUserList = function() {
    if ( FLpopupchat.chat_fullscreen == true ) {
        if ( ! uw.$("#im.zoomScroll > .zoom > #chatbar > .list").hasClass("open") ) {
            uw.$("#im.zoomScroll > .zoom > #chatbar > .list").addClass("open");
        }
        setTimeout(function(){FLpopupchat.showUserList()}, 1000);
    }
};
FLpopupchat.toggleChat = function() {
    if ( FLpopupchat.chat_fullscreen == false ) {
        FLpopupchat.goFull();
        FLpopupchat.showUserList();
    }
    else {
        FLpopupchat.goSmall();
    }
};
FLpopupchat.goSmall = function() {
    FLpopupchat.chat_fullscreen = false;

    uw.$("#im .list > a.closedtitle .btn_wrapper > a.btn_toggle").text("Maximize");
    uw.$("body").css("overflow", "auto");
    uw.$("#im").removeClass("zoomScroll");
    uw.$("#im > div").removeClass("zoom");
    uw.$("#im > div").css("margin", FLpopupchat.im_div_margin);
};
FLpopupchat.goFull = function() {
    FLpopupchat.chat_fullscreen = true;
    FLpopupchat.im_div_margin = uw.$("#im > div").css("margin");

    uw.$("#im .list > div ul.kinksters li").click(FLpopupchat.showUserList());
    uw.$("#im .list > a.closedtitle .btn_wrapper > a.btn_toggle").text("Restore");
    uw.$("body").css("overflow", "hidden");
    uw.$("#im").addClass("zoomScroll");
    uw.$("#im > div").addClass("zoom");
    uw.$("#im > div").css("margin", ""); // Remove inline style
};

var uw = (unsafeWindow) ? unsafeWindow : window;        // Chrome compatibility
uw.FLpopupchat = cloneInto(FLpopupchat, uw, {cloneFunctions: true});

FLpopupchat.init();

GM_addStyle(' \
    #im.zoomScroll .zoom { position: fixed; left: 50%; margin: 20px -375px; bottom: 20px !important; top: 20px !important; } \
    #im.zoomScroll #chatbar { height: 100%; } \
    #im.zoomScroll #chatbar > span { position: relative; float: none; display: inline-block; height: 100%; width: 73%; clear: both; } \
    #im.zoomScroll #chatbar div.chat > div { display: none; position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; } \
    #im.zoomScroll #chatbar div.chat { margin: 0px; position: initial; width: 120px; } \
    #im.zoomScroll #chatbar div.chat span.newmsgcnt { right: initial; left: 95px; position: relative; } \
    #im.zoomScroll #chatbar div.chat.open a.closedtitle { display: inline-block; z-index: 1002; } \
    #im.zoomScroll #chatbar div.chat.open > div { z-index: 1001; display: block; top: 32px; left: 0px; right: 0px; bottom: 0px; width: initial; height: initial; position: absolute; } \
    #im.zoomScroll #chatbar div.chat.open > div .thread { position: absolute; top: 35px; bottom: 27px; left: 0; right: 0; height: initial; } \
    #im.zoomScroll #chatbar div.chat.open > div form { left: 0px; right: 0px; width: initial; } \
    #im.zoomScroll #chatbar div.chat.open > div form input { width: 100%; padding: 6px 0px; text-indent: 22px; } \
    #im.zoomScroll #chatbar div.chat a.closedtitle { position: absolute; margin-left: -1px; } \
    \
    #im.zoomScroll { height: auto; left: 0px; } \
    #im.zoomScroll .list { display: inline-block; float: right; position: relative; height: 100%; width: 25.5%; } \
    #im.zoomScroll .list:after { display: none; } \
    #im.zoomScroll .list > a { position: absolute; top: 0px; left: 0px; right: 0px; height: 30px } \
    #im.zoomScroll .list > div > div.header { display: none; } \
    #im.zoomScroll .list > div ul.kinksters { height: 100%; } \
    #im.zoomScroll .list > div { position: absolute; top: 30px; bottom: 0px; height: auto; } \
    #im .btn_wrapper { position: fixed; } \
    #im .btn_wrapper .btn_toggle { position: absolute; bottom: 20px; padding: 3px 10px 2px !important; border-radius: 15px 15px 0px 0px; background-color: #393939; } \
    #im .header:hover .btn_wrapper .btn_toggle { background-color: #070707; } \
    #im a.closedtitle .btn_wrapper .btn_toggle { bottom: 2em; color: inherit; } \
    #im a.closedtitle:hover .btn_wrapper .btn_toggle { background-color: #222; } \
');