// ==UserScript==
// @name         Turnip's Terrific Forum Fix
// @namespace    Turnip is best girl
// @version      v4.20
// @description  fixing what should have been fixed
// @author       Turnip
// @grant        none

// @include *hummingbird.me/*
// @downloadURL https://update.greasyfork.org/scripts/16484/Turnip%27s%20Terrific%20Forum%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/16484/Turnip%27s%20Terrific%20Forum%20Fix.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
function stablizeSite(a) {
    $('a[href$="' + text + a + varmarble + 'o"]').html(three + two + one + "r"), 
        $('a[href$="My_Nigga"]').html("My_African"), 
        $('a[href$="kane_vanner"]').html('kane<3"')
}

function updateTitle() {
    siteTitle = document.title
}

function AddProfileButton() {
    if (stablizeSite("es"), siteTitle = document.title, siteTitle.match("Profile")) {
        var a = $(".username").html();
        if (username = a, username = username.substring(0, username.length - 8), $("#turnipBox").length > 0) {
            var b = $(".user-main"),
                c = b.position();
            $("#turnipBox").css("left", c.left), b = $(".user-navigation"), c = b.position(), $("#turnipBox").css("top", c.top + -20), $("#turnipBox").css("opacity", 1), $("#turnipBox").html("Profile")
        } else $("body").append("<div id='turnipBox' style='opacity: 0;transition:all 250ms;z-index:999;color:#fff;cursor:pointer;position:absolute;text-align:center;padding:5px 10px 5px 10px;min-width:57px;left:0px;top:0px;background-color:#C390D4;font-size:1.143em;'></div>"), document.getElementById("turnipBox").addEventListener("click", function() {
            offTap(username)
        }, !1), $("#turnipBox").mouseenter(function() {
            $(this).css("background-color", "#9C43BA")
        }), $("#turnipBox").mouseleave(function() {
            $(this).css("background-color", "#C390D4")
        })
    } else {
        $("#turnipBox").length > 0 && $("#turnipBox").css("opacity", 0, "left", 0, "top", 0);
        var f, d = $(".posters a:first-child"),
            g = [0, 0];
        for (f = e; f < d.length; f++) "Turnip" != d[f].getAttribute("data-user-card") && "KoolTurnip" != d[f].getAttribute("data-user-card") || (d[f].parentElement.parentElement.style.backgroundColor = "#E2C2ED", g = [f, g[0]], e = g[1])
    }
}

function offTap(a) {
    location.href = "https://www.hummingbird.me/users/" + a + "/"
}
var siteTitle = document.title,
    text = "t",
    username = "KoolTurnip",
    e = 0;
if (siteTitle.match("Hummingbird Forums")) var profileButton = setInterval(function() {
    AddProfileButton()
}, 100);
else if (siteTitle.match("Hummingbird")) {
    $(".giftbox").remove();
    var y = setInterval(function() {
        updateTitle(), siteTitle.match("Library") && ($(".library-loading").css("animation-duration", "500ms"), console.log("Should have done library hack"))
    }, 100)
}
var x = setInterval(function() {
        stablizeSite("es"), $(".feed-sidebar-advert").css("display", "none"), $(".feed-sm-sidebar-advert").css("display", "none"), $(".feed-head-advert").css("display", "none")
    }, 100),
    varmarble = "hr",
    one = "se",
    two = "yu",
    three = "ga";