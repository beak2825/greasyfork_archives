// ==UserScript==
// @name         Facebook Fullscreen Photos
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Hide comments side bar when browsing photos on Facebook.
// @author       Tomas Kohout
// @match  https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413657/Facebook%20Fullscreen%20Photos.user.js
// @updateURL https://update.greasyfork.org/scripts/413657/Facebook%20Fullscreen%20Photos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var buttonNode
    var buttonTextNode
    var isRealFullScreenOn = false
    var timerId

    console.log("Facebook fullscreen starting")

    createFullScreenButton()

    setInterval(displayButton, 1000)

    function toggleRealFullScreen() {
        isRealFullScreenOn = !isRealFullScreenOn

        if (isRealFullScreenOn) {
            buttonTextNode.nodeValue = "Set fullscreen off"
            hideComments()
            timerId = setInterval(hideComments, 1000);
        } else {
            buttonTextNode.nodeValue = "Set fullscreen on"
            showComments()
            clearInterval(timerId);
        }
    }

    function createFullScreenButton() {
        //var node = document.createElement("div");
        var a = document.createElement("a");

        a.className = "real_fullscreen_button"
        a.style.position = "absolute"
        a.style.left = "50px"
        a.style.bottom = "50px"
        a.style.fontSize = "15px"
        a.style.borderRadius = "10px"
        a.style.background = "var(--secondary-button-background)"
        a.style.padding = "10px"
        a.style.opacity = "0.7"
        a.style.textDecoration = "none"
        var textnode = document.createTextNode("Set fullscreen on");
        a.appendChild(textnode);
        a.style.color = "var(--primary-text)"
        a.onclick = toggleRealFullScreen
        a.onmouseenter = function() {
            a.style.opacity = "1"
        }
        a.onmouseleave = function() {
            a.style.opacity = "0.7"
        }
        document.body.appendChild(a)

        buttonTextNode = textnode
        buttonNode = a
    }

    function displayButton() {
        var photosRegex = /.*\/photos\/.*/
        var photoRegex = /\/photo.*/
        if (photoRegex.test(location.pathname)|| photosRegex.test(location.pathname)) {
            buttonNode.style.display = "block"
        } else {
            buttonNode.style.display = "none"
        }
    }

    function setComplementaryVisibility(isVisible) {
        var complementary = document.querySelectorAll('[role="complementary"]')
        if (complementary.length > 0) {
            complementary.forEach(function(c) {
                c.style.display = isVisible ? "block" : "none"
            })
        }
    }

    function hideComments() {
        setComplementaryVisibility(false)
    }

    function showComments() {
        setComplementaryVisibility(true)
    }


})();