// ==UserScript==
// @name         PHero Next Prev Button on Full Screen
// @version      1.0
// @description  This script adds next and previous buttons for the web.programmming-hero.com site.
// @author       Sakibul Hasan (https://github.com/sakibulhasaan)
// @match        https://web.programming-hero.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=programming-hero.com
// @namespace    https://github.com/SakibulHasaan
// @grant        none
// @run-at       document-start
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   edge
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482377/PHero%20Next%20Prev%20Button%20on%20Full%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/482377/PHero%20Next%20Prev%20Button%20on%20Full%20Screen.meta.js
// ==/UserScript==
(function () {
    "use strict";
    var setToLocalStorage = function (key, value) {
        localStorage.setItem(key, value);
    };
    window.addEventListener("load", function () {
        setToLocalStorage("canReload", "true");
    }, false);
    function checkUrlChange() {
        var currentURL = window.location.href;
        var previousURL = localStorage.getItem("previousURL");
        setToLocalStorage("previousURL", currentURL);
        var canReload = localStorage.getItem("canReload");
        return currentURL !== previousURL;
    }
    setInterval(function () {
        var result = checkUrlChange();
        var canReload = localStorage.getItem("canReload");
        if (result) {
            myScript("====called on url change=====");
            setToLocalStorage("canReload", "false");
        }
        else if (document.readyState === "complete" &&
            document.querySelector("video")) {
            if (canReload === "true") {
                setToLocalStorage("canReload", "false");
                myScript("====called on reload=====");
            }
        }
    }, 2000);
    var count = 0;
    function myScript(calledFrom) {
        var intervalId = setInterval(function () {
            var _a;
            var elem = (_a = document.querySelector("video")) !== null && _a !== void 0 ? _a : null;
            if (elem && (elem === null || elem === void 0 ? void 0 : elem.src)) {
                addButton(intervalId);
                clearInterval(intervalId);
            }
        }, 1000);
    }
    function addButton(intervalId) {
        clearInterval(intervalId);
        var _prev = document.querySelector("custom-next-button");
        var _next = document.querySelector("custom-prev-button");
        if (_prev) {
            _prev.remove();
        }
        if (_next) {
            _next.remove();
        }
        var nextBtn = document.createElement("button");
        var prevBtn = document.createElement("button");
        nextBtn.classList.add("custom-next-button");
        prevBtn.classList.add("custom-prev-button");
        nextBtn.innerHTML = "Next";
        prevBtn.innerHTML = "Prev";
        nextBtn.style.cssText = commonCss + " right: 0%; border-radius: 6px 0px 0px 6px;";
        prevBtn.style.cssText = commonCss + " left: 0%; border-radius: 0px 6px 6px 0px;";
        var nextBtnPH = document.querySelector("button.btn.next-button.text-white");
        var prevBtnPH = document.querySelector("button.btn.previous-button.mr-2");
        var container = document.querySelector(".shaka-controls-container");
        container.appendChild(nextBtn);
        container.appendChild(prevBtn);
        prevBtn.addEventListener("click", function () {
            prevBtnPH.click();
            setTimeout(clickFullScreenBtn, 2000);
        });
        nextBtn.addEventListener("click", function () {
            nextBtnPH.click();
            setTimeout(clickFullScreenBtn, 2000);
        });
        nextBtn.addEventListener("mouseover", function () {
            nextBtn.style.opacity = "1";
        });
        nextBtn.addEventListener("mouseout", function () {
            nextBtn.style.opacity = "0";
            nextBtn.style.borderRadius = "6px 0px 0px 6px";
        });
        prevBtn.addEventListener("mouseover", function () {
            prevBtn.style.opacity = "1";
            prevBtn.style.borderRadius = "0px 6px 6px 0px";
        });
        prevBtn.addEventListener("mouseout", function () {
            prevBtn.style.opacity = "0";
        });
    }
    function clickFullScreenBtn() {
        var fullScreenBtn = document.querySelector("button.shaka-fullscreen-button.material-icons-round.shaka-tooltip");
        fullScreenBtn.click();
    }
    var commonCss = "position: absolute; top: 50%; transform: translateY(-50%); z-index: 2; background-color: blue; color: white; height: 50%; width: 50px; opacity: 0;font-weight: 700;font-size: 16px;background: linear-gradient(97.64deg,#eaaaff 15.56%,#b5acff 92.85%);color: #010313!important;cursor: pointer; transition: all 0.3s ease;";
})();