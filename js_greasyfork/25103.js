// ==UserScript==
// @name          NeoLite
// @version       1.0.0.4
// @author        Quobi
// @description   Flat Theme for Cpaelites
// @include       www.cpaelites.com/*
// @include       https://www.cpaelites.com/*
// @include       https://cpaelites.com/*
// @exclude       https://www.cpaelites.com/tools/*
// @exclude       https://www.cpaelites.com/listings.php
// @require       https://code.jquery.com/jquery-2.1.4.min.js
// @resource      customCSS https://dl.dropboxusercontent.com/s/1bk6up4eieq699a/NeoLite.css
// @resource      anotherMenu https://dl.dropboxusercontent.com/s/ey30qrwhaq1ly8w/MeNu_v2.css
// @resource      anotherAlert https://dl.dropboxusercontent.com/s/kajnmpelpa8dg4u/Alerto_v2.css
// @resource      anotherNotify https://dl.dropboxusercontent.com/s/0323mas83lkk8un/Notify_v2.css
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @run-at        document-start
// @namespace     https://greasyfork.org/users/82626
// @downloadURL https://update.greasyfork.org/scripts/25103/NeoLite.user.js
// @updateURL https://update.greasyfork.org/scripts/25103/NeoLite.meta.js
// ==/UserScript==
// Implement Custom CSS

var newCSS = GM_getResourceText("customCSS");
GM_addStyle(newCSS);
var newMenu = GM_getResourceText("anotherMenu");
GM_addStyle(newMenu);
var newAlertStyle = GM_getResourceText("anotherAlert");
GM_addStyle(newAlertStyle);
var newNotificationStyle = GM_getResourceText("anotherNotify");
GM_addStyle(newNotificationStyle);
$(window).load(function() {
    document.getElementById("logo").src = "https://s21.postimg.org/w3eowmqfr/neolite.jpg";
    $(".expander").hide();
    if (window.location.href == "http://www.cpaelites.com/") {
        document.getElementById('container').setAttribute("style", "width:100%");
    } else {
        if (window.location.pathname == "/index.php") {
            document.getElementById('container').setAttribute("style", "width:100%");
        } else {
            document.getElementById('container').setAttribute("style", "width:90%");
        }
    }
    var anchors = document.getElementsByTagName("span");
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].style.fontWeight = "300";
    }
    var xo = document.getElementsByClassName('float_right')[0];
    xo.style.marginTop = "12px";
    var xo2 = document.getElementsByClassName('thead')[10];
    xo2.style.borderRadius = "0px";
    var xo3 = document.getElementsByClassName('thead')[10];
    xo3.style.borderRadius = "0px";
});

// Smooth Scroll
if (window.addEventListener) window.addEventListener('DOMMouseScroll', wheel, false);
window.onmousewheel = document.onmousewheel = wheel;
function wheel(event) {
    var delta = 0;
    if (event.wheelDelta) delta = event.wheelDelta / 120;
    else if (event.detail) delta = -event.detail / 3;
    handle(delta);
    if (event.preventDefault) event.preventDefault();
    event.returnValue = false;
}
var goUp = true;
var end = null;
var interval = null;
function handle(delta) {
    var animationInterval = 20;
    var scrollSpeed = 20;

    if (end === null) {
        end = $(window).scrollTop();
    }
    end -= 20 * delta;
    goUp = delta > 0;

    if (interval === null) {
        interval = setInterval(function() {
            var scrollTop = $(window).scrollTop();
            var step = Math.round((end - scrollTop) / scrollSpeed);
            if (scrollTop <= 0 ||
                scrollTop >= $(window).prop("scrollHeight") - $(window).height() ||
                goUp && step > -1 ||
                !goUp && step < 1) {
                clearInterval(interval);
                interval = null;
                end = null;
            }
            $(window).scrollTop(scrollTop + step);
        }, animationInterval);
    }
}