// ==UserScript==
// @name         IF视频自动跳集
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  Auto next
// @author       Xiaoke
// @match        https://www.ifsp.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422005/IF%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/422005/IF%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E9%9B%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    ////////////////////////////////////////////////
    ///////            utils               /////////
    ////////////////////////////////////////////////
    // define location change event
    history.pushState = (f => function pushState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = (f => function replaceState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'))
    });

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }

    ////////////////////////////////////////////////
    ///////            logic               /////////
    ////////////////////////////////////////////////

    // when location change test the new url
    const playPageMatcher = new RegExp("https://www.ifsp.tv/play*");
    var autoNextFlag = true;
    window.addEventListener('locationchange', function () {
        if (playPageMatcher.test(window.location.href)) {
            bindVideoEndEvent().then(
                function (value) {
                    console.log("Auto next enabled");
                }
            )
        }
    });

    const switchButtonId = "autoNextSwitchButton";
    function testSwitchButton() {
        var result = document.getElementById(switchButtonId);
        return Boolean(result);
    }



    function addSwitchButton() {
        const actionPanel = document.querySelector(".control-left");
        var switchButton = createElementFromHTML(
            '<button class="btn btn-primary btn-sm m-2">自动跳集</button>'
        );
        switchButton.id = switchButtonId;
        switchButton.addEventListener('click', () => {
            if (switchButton.classList.contains("btn-outline-light")) {
                switchButton.classList.replace("btn-outline-light", "btn-primary");
                autoNextFlag = true;
                console.log("Auto next enabled");
            } else {
                switchButton.classList.replace("btn-primary", "btn-outline-light");
                autoNextFlag = false;
                console.log("Auto next disabled");
            }
        });
        actionPanel.append(switchButton)
    }

    // poll to bind the event listener
    async function bindVideoEndEvent() {
        const interval = 500;
        const timeoutValue = 10; // in seconds
        var loopCounter = 0;
        var videoElem;

        var timer = setInterval(() => {
            videoElem = document.getElementById("video_player");
            loopCounter++;
            if (loopCounter > timeoutValue * 1000 / interval || !(videoElem === undefined || videoElem === null)) {
                clearInterval(timer);
                if (!testSwitchButton()) {
                    addSwitchButton();
                }
                videoElem.addEventListener("ended", function (e) {
                    if (autoNextFlag) {
                        console.log("video ended");
                        document.querySelector(".iconfont.iconxiayiji").click();
                    }
                }, false);
            }
        }, interval);

    }


})();