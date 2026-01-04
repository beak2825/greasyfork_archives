// ==UserScript==
// @name         Log in
// @version      0.2
// @namespace https://triburile.ro
// @description  login and logout
// @author       fp
// @include https://*?screen=overview&intro*
// @include https://www.triburile.ro*
// @require https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/438481/Log%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/438481/Log%20in.meta.js
// ==/UserScript==
var url = "https://ro86.triburile.ro/game.php?village=*&screen=main";
var world = "ro86";
const chooseWorldPage = "";
const loggedIn = "?screen=overview&intro";
var expiredSession = "/?session_expired=1"
var delay = randomMinutes(3, 5);

$(window).load(function () {
    var currentUrl = window.location.href;
    setInterval(function(){
        if (currentUrl.indexOf(chooseWorldPage) !== -1) {
            console.log("choose the world you want to log into");
            accessWorld();
        }
    }, delay);

    setInterval(function(){
        if (currentUrl.indexOf(loggedIn) !== -1) {
            console.log("going to main");
            window.location.href = url;
        }
    }, randomSeconds(10, 15));

    if (currentUrl.indexOf(expiredSession) !== -1) {
        setInterval(function(){
            console.log("session expired. access world");
            accessWorld();
        }, delay);
    }
});

function accessWorld() {
    //loop through all "worls" available
    $("a").each(function () {
        if (this.href.endsWith(world)) {
            window.location.href = this.href;
        }
    });
}

function randomMinutes(min, max) {
    return randomSeconds(min, max) * 60;
}

function randomSeconds(min, max) {
    return randomNumber(min, max) * 1000;
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}