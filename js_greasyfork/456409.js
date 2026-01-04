// ==UserScript==
// @name CMG Hacks for Safari
// @homepage http://youtube.com/theostechtips
// @author Theo's Tech Tips
// @description A port of my chrome extension (CMG Hacks) for Safari!
// @grant none
// @match *://www.coolmathgames.com/0-*
// @run-at document-start
// @version 3.2
// @license MIT
// @namespace https://greasyfork.org/users/995648
// @downloadURL https://update.greasyfork.org/scripts/456409/CMG%20Hacks%20for%20Safari.user.js
// @updateURL https://update.greasyfork.org/scripts/456409/CMG%20Hacks%20for%20Safari.meta.js
// ==/UserScript==
var randNum1 = Math.floor(Math.random() * 1000000000);
var randNum2 = Math.floor(Math.random() * 1000000000);
var browser = "safari"

if ($("#buttonsExist").length < 1) {
    $(".pane-title").append(`
        <a href='javascript:cmg_remove_madg();' id='${randNum1}' class='btn btn-primary btn-sm'>Skip Ad</a>
        <button id='${randNum2}' class='btn btn-primary btn-sm'>Fullscreen</button>
        <div style="display:none" id="buttonsExist"></div>
    `)
}

//Function to wait for elem
function waitForElm(document, selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

waitForElm(document, '.blocker-detected-2').then(function (elm) {
    $("#" + randNum1).click()
})

$("#" + randNum2).click(function () {
    var elem = document.getElementById("swfgamewrapper");

    if (elem.requestFullscreen) { //Chrome
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { //Safari
        elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) { //Firefox
        elem.mozRequestFullScreen();
    }
})

$("#" + randNum1).click(function () {
  if (document.body.contains($(".blocker-detected-2")[0])) {
    $(".blocker-detected-2").remove();
  }
 
  if ($("iframe[id='html5game']")[0]) { //Game already loaded. Skip ad mid-game instead.
    $("iframe[id='html5game']")[0].contentWindow.cmg_remove_madg();
  }
})

if (window.location.href.indexOf("https://www.coolmathgames.com/0-chess") > -1) {
    $("#" + randNum2).css("display", "none");
    $("#" + randNum1).css("display", "none");
}

//Code to set the cookie
if (browser == "safari") {
    document.cookie = "cmg_premium_play=true";
}