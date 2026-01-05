// ==UserScript==
// @name        starfighter
// @include     https://www.starrepublik.com/*
// @version     1.03
// @grant       none
// @description starrepublik automated fighter
// @namespace https://greasyfork.org/users/2402
// @downloadURL https://update.greasyfork.org/scripts/17393/starfighter.user.js
// @updateURL https://update.greasyfork.org/scripts/17393/starfighter.meta.js
// ==/UserScript==

var hitsTimer = 3;
var health = 100;

var username = "";
var password = "";

function main() {
    var loginNeeded = $('*:contains("Sign In:")').length;

    if ($("#login").length) {
        setTimeout(function() {
            if (username.length > 0 && password.length > 0) {
                $("input[name=email]").val(username);
                $("input[name=password]").val(password);
            }
            $("#login").submit();
        }, 1000)
    }
    if ($("#login-form").length) {
        setTimeout(function() {
            if (username.length > 0 && password.length > 0) {
                $("input[name=email]").val(username);
                $("input[name=password]").val(password);
            }
            $("#login-form").submit();
        }, 1000)
    }


    var currentPower = $(".power .power-value").text().trim();
    var maxPower = $(".power .max-power").text();
    var powerValues = $("#power-to-restore .power-value").first().text();
    if (currentPower != maxPower && powerValues != 50) {
        $(".restore-power").first().trigger("click");
    }


    if (location.href.match("https://www.starrepublik.com/")) {
        if ($(".get-do-reward:visible").length) {
            setTimeout(function() {
                $(".get-do-reward").click();
                setTimeout(function() {
                    $(".ok-btn").click();
                }, 1000);
            }, 1000);
        }
    }
    if (location.href == "https://www.starrepublik.com/" && currentPower == health && powerValues >= (health - 10)) {
        $(".red-btn:contains('Fight')").first().click();
        $(".red-btn:contains('Бой')").first().click();
    }

    if (location.href.match("military\/battle")) {
        if ($(".red-btn:contains('Присъединете')")) {
            $(".red-btn:contains('Присъединете')").click();
        }
        if ($(".red-btn:contains('Join')")) {
            $(".red-btn:contains('Join')").click();
        }
        setTimeout(function() {
            i = 0;
            t = setInterval(function() {
                $(".red-btn").click();
                i++;
                if (i == hitsTimer) {
                    location.href = "https://www.starrepublik.com/";
                }
            }, 1000);
        }, 2000)
    }

}

setTimeout(function() {
    main();
}, 1000);
setTimeout(function() {
    location.href = "https://www.starrepublik.com/"
}, 60e3);
//setTimeout(function() {location.href = "https://www.starrepublik.com/"}, 1*60e3);