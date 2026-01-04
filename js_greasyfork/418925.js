// ==UserScript==
// @name         Kancolle Scaler
// @namespace    http://hisaruki.tumblr.com/
// @version      2
// @description  艦これのゲーム画面をウィンドウと同じサイズに拡大/縮小
// @author       hisaruki
// @match        http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418925/Kancolle%20Scaler.user.js
// @updateURL https://update.greasyfork.org/scripts/418925/Kancolle%20Scaler.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $("*").css("overflow", "hidden");

    let d = $("<div></div>");
    $("body").append(d);
    d.css("background-size", "cover");
    d.css("width", "100%");
    d.css("height", "100%");
    d.css("position", "absolute");
    d.css("left", "0px");
    d.css("top", "0px");
    d.css("z-index", 2);
    d.css("background", "#fff");

    $("#game_frame").css("position", "fixed");
    $("#game_frame").css("left", "0px");
    $("#game_frame").css("top", "-16px");
    $("#game_frame").css("z-index", 3);
    $("#game_frame").css("transform-origin-x", "left");
    $("#game_frame").css("transform-origin-y", "top");
    $("#game_frame").css("height", "inherit");

    let resize = function(){
        let w = $("#game_frame").width();
        let h = $("#game_frame").height();
        w = 1200;
        //h = 860;
        h = 720;
        let scale = Math.min.apply(null, [
            window.innerWidth / w,
            window.innerHeight / h,
        ]);
        $("#game_frame").css("transform", "scale("+scale+")");
        let left = (window.innerWidth - ($("#game_frame").width() * scale))/2;
        let top = -16 * scale;
        $("#game_frame").css("left", left);
        $("#game_frame").css("top", top);
        return scale;
    }
    resize();
    $(window).resize(function() {
        resize();
    });
})();
