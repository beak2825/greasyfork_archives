// ==UserScript==
// @name         Old Seek UI
// @version      0.2
// @description  Return the old YouTube video player seek UI, replacing the mobile-style ones they added circa 2021.
// @author       Taniko Yamamoto
// @author       https://github.com/YukisCoffee/yt-player-classicifier
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1132181
// @downloadURL https://update.greasyfork.org/scripts/471338/Old%20Seek%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/471338/Old%20Seek%20UI.meta.js
// ==/UserScript==

(function() {

    const ICONSET = {
        "back10": "M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z M 16.9,22 H 16 V 18.7 L 15,19 v -0.7 l 1.8,-0.6 h .1 V 22 z m 4.3,-1.8 c 0,.3 0,.6 -0.1,.8 l -0.3,.6 c 0,0 -0.3,.3 -0.5,.3 -0.2,0 -0.4,.1 -0.6,.1 -0.2,0 -0.4,0 -0.6,-0.1 -0.2,-0.1 -0.3,-0.2 -0.5,-0.3 -0.2,-0.1 -0.2,-0.3 -0.3,-0.6 -0.1,-0.3 -0.1,-0.5 -0.1,-0.8 v -0.7 c 0,-0.3 0,-0.6 .1,-0.8 l .3,-0.6 c 0,0 .3,-0.3 .5,-0.3 .2,0 .4,-0.1 .6,-0.1 .2,0 .4,0 .6,.1 .2,.1 .3,.2 .5,.3 .2,.1 .2,.3 .3,.6 .1,.3 .1,.5 .1,.8 v .7 z m -0.9,-0.8 v -0.5 c 0,0 -0.1,-0.2 -0.1,-0.3 0,-0.1 -0.1,-0.1 -0.2,-0.2 -0.1,-0.1 -0.2,-0.1 -0.3,-0.1 -0.1,0 -0.2,0 -0.3,.1 l -0.2,.2 c 0,0 -0.1,.2 -0.1,.3 v 2 c 0,0 .1,.2 .1,.3 0,.1 .1,.1 .2,.2 .1,.1 .2,.1 .3,.1 .1,0 .2,0 .3,-0.1 l .2,-0.2 c 0,0 .1,-0.2 .1,-0.3 v -1.5 z",
        "forward10": "m 10,19 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 h -2 c 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 0,-3.3 2.7,-6 6,-6 v 4 l 5,-5 -5,-5 v 4 c -4.4,0 -8,3.6 -8,8 z m 6.8,3 H 16 V 18.7 L 15,19 v -0.7 l 1.8,-0.6 h .1 V 22 z m 4.3,-1.8 c 0,.3 0,.6 -0.1,.8 l -0.3,.6 c 0,0 -0.3,.3 -0.5,.3 C 20,21.9 19.8,22 19.6,22 19.4,22 19.2,22 19,21.9 18.8,21.8 18.7,21.7 18.5,21.6 18.3,21.5 18.3,21.3 18.2,21 18.1,20.7 18.1,20.5 18.1,20.2 v -0.7 c 0,-0.3 0,-0.6 .1,-0.8 l .3,-0.6 c 0,0 .3,-0.3 .5,-0.3 .2,0 .4,-0.1 .6,-0.1 .2,0 .4,0 .6,.1 .2,.1 .3,.2 .5,.3 .2,.1 .2,.3 .3,.6 .1,.3 .1,.5 .1,.8 v .7 z m -0.8,-0.8 v -0.5 c 0,0 -0.1,-0.2 -0.1,-0.3 0,-0.1 -0.1,-0.1 -0.2,-0.2 -0.1,-0.1 -0.2,-0.1 -0.3,-0.1 -0.1,0 -0.2,0 -0.3,.1 l -0.2,.2 c 0,0 -0.1,.2 -0.1,.3 v 2 c 0,0 .1,.2 .1,.3 0,.1 .1,.1 .2,.2 .1,.1 .2,.1 .3,.1 .1,0 .2,0 .3,-0.1 l .2,-0.2 c 0,0 .1,-0.2 .1,-0.3 v -1.5 z",
        "back5": "M 18,11 V 7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z m -1.3,8.9 .2,-2.2 h 2.4 v .7 h -1.7 l -0.1,.9 c 0,0 .1,0 .1,-0.1 0,-0.1 .1,0 .1,-0.1 0,-0.1 .1,0 .2,0 h .2 c .2,0 .4,0 .5,.1 .1,.1 .3,.2 .4,.3 .1,.1 .2,.3 .3,.5 .1,.2 .1,.4 .1,.6 0,.2 0,.4 -0.1,.5 -0.1,.1 -0.1,.3 -0.3,.5 -0.2,.2 -0.3,.2 -0.4,.3 C 18.5,22 18.2,22 18,22 17.8,22 17.6,22 17.5,21.9 17.4,21.8 17.2,21.8 17,21.7 16.8,21.6 16.8,21.5 16.7,21.3 16.6,21.1 16.6,21 16.6,20.8 h .8 c 0,.2 .1,.3 .2,.4 .1,.1 .2,.1 .4,.1 .1,0 .2,0 .3,-0.1 L 18.5,21 c 0,0 .1,-0.2 .1,-0.3 v -0.6 l -0.1,-0.2 -0.2,-0.2 c 0,0 -0.2,-0.1 -0.3,-0.1 h -0.2 c 0,0 -0.1,0 -0.2,.1 -0.1,.1 -0.1,0 -0.1,.1 0,.1 -0.1,.1 -0.1,.1 h -0.7 z",
        "forward5": "m 10,19 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 h -2 c 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 0,-3.3 2.7,-6 6,-6 v 4 l 5,-5 -5,-5 v 4 c -4.4,0 -8,3.6 -8,8 z m 6.7,.9 .2,-2.2 h 2.4 v .7 h -1.7 l -0.1,.9 c 0,0 .1,0 .1,-0.1 0,-0.1 .1,0 .1,-0.1 0,-0.1 .1,0 .2,0 h .2 c .2,0 .4,0 .5,.1 .1,.1 .3,.2 .4,.3 .1,.1 .2,.3 .3,.5 .1,.2 .1,.4 .1,.6 0,.2 0,.4 -0.1,.5 -0.1,.1 -0.1,.3 -0.3,.5 -0.2,.2 -0.3,.2 -0.5,.3 C 18.3,22 18.1,22 17.9,22 17.7,22 17.5,22 17.4,21.9 17.3,21.8 17.1,21.8 16.9,21.7 16.7,21.6 16.7,21.5 16.6,21.3 16.5,21.1 16.5,21 16.5,20.8 h .8 c 0,.2 .1,.3 .2,.4 .1,.1 .2,.1 .4,.1 .1,0 .2,0 .3,-0.1 L 18.4,21 c 0,0 .1,-0.2 .1,-0.3 v -0.6 l -0.1,-0.2 -0.2,-0.2 c 0,0 -0.2,-0.1 -0.3,-0.1 h -0.2 c 0,0 -0.1,0 -0.2,.1 -0.1,.1 -0.1,0 -0.1,.1 0,.1 -0.1,.1 -0.1,.1 h -0.6 z",
        "backchapter": "m 16.436975,17.634454 c -0.573529,0 -1.191177,0.117647 -1.617647,0.441177 v 4.308938 c 0,0.191177 0.214706,0.132123 0.220588,0.132123 0.397059,-0.191176 0.970588,-0.323414 1.397059,-0.323414 0.57353,0 1.191177,0.117646 1.617647,0.441176 0.397059,-0.25 1.117648,-0.441176 1.617647,-0.441176 0.485295,0 0.985294,0.08846 1.397059,0.309053 0.120588,0.06177 0.220589,-0.05623 0.220589,-0.132698 v -4.294002 c -0.438235,-0.329412 -1.067647,-0.441177 -1.617648,-0.441177 -0.573529,0 -1.191176,0.117647 -1.617647,0.441177 -0.42647,-0.32353 -1.044117,-0.441177 -1.617647,-0.441177 z m 3.235294,0.588235 c 0.352942,0 0.705883,0.04411 1.029412,0.147059 v 3.382353 c -0.323529,-0.102941 -0.67647,-0.147059 -1.029412,-0.147059 -0.499999,0 -1.220588,0.191177 -1.617647,0.441177 v -3.382353 c 0.397059,-0.25 1.117648,-0.441177 1.617647,-0.441177 z m -0.674976,1.202322 v 1.303997 l 1.024241,-0.651999 z M 18,7 l -5,5 5,5 v -4 c 3.3,0 6,2.7 6,6 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 h -2 c 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 0,-4.4 -3.6,-8 -8,-8 z",
        "forwardchapter": "m 16.436975,17.634454 c -0.573529,0 -1.191177,0.117647 -1.617647,0.441177 v 4.308938 c 0,0.191177 0.214706,0.132123 0.220588,0.132123 0.397059,-0.191176 0.970588,-0.323414 1.397059,-0.323414 0.57353,0 1.191177,0.117646 1.617647,0.441176 0.397059,-0.25 1.117648,-0.441176 1.617647,-0.441176 0.485295,0 0.985294,0.08846 1.397059,0.309053 0.120588,0.06177 0.220589,-0.05623 0.220589,-0.132698 v -4.294002 c -0.438235,-0.329412 -1.067647,-0.441177 -1.617648,-0.441177 -0.573529,0 -1.191176,0.117647 -1.617647,0.441177 -0.42647,-0.32353 -1.044117,-0.441177 -1.617647,-0.441177 z m 3.235294,0.588235 c 0.352942,0 0.705883,0.04411 1.029412,0.147059 v 3.382353 c -0.323529,-0.102941 -0.67647,-0.147059 -1.029412,-0.147059 -0.499999,0 -1.220588,0.191177 -1.617647,0.441177 v -3.382353 c 0.397059,-0.25 1.117648,-0.441177 1.617647,-0.441177 z m -0.674976,1.202322 v 1.303997 l 1.024241,-0.651999 z M 18,7 v 4 c -4.4,0 -8,3.6 -8,8 0,4.4 3.6,8 8,8 4.4,0 8,-3.6 8,-8 h -2 c 0,3.3 -2.7,6 -6,6 -3.3,0 -6,-2.7 -6,-6 0,-3.3 2.7,-6 6,-6 v 4 l 5,-5 z"
    };
    const DEBUG = false;

    // Player API reference
    var api;
    var bezel;

    var animationStartTimer = 0;
    var animationShouldEndTimer = 0;

    function log(a)
    {
        if (DEBUG) console.log(a);
    }

    function getAnimationDuration(elm)
    {
        var prop = window.getComputedStyle(elm).animationDuration;

        switch (true)
        {
            case "ms" == prop.substr(-2):
                return +prop.replace("ms", "");
            case "s" == prop.substr(-1):
                return +(prop.replace("s", "")) * 1000;
        }
    }

    async function attemptEndAnimateBezel()
    {
        while (animationShouldEndTimer > Date.now())
        {
            await new Promise(r => requestAnimationFrame(r));
        }

        animationStartTimer = 0;
        animationShouldEndTimer = 0;
        bezel.style.display = "none";
    }

    function animateBezel()
    {
        var animationDuration = getAnimationDuration(bezel.querySelector(".ytp-bezel"));

        bezel.style.display = "";

        if (0 == animationShouldEndTimer)
        {
            animationStartTimer = Date.now();
            animationShouldEndTimer = animationStartTimer;
        }

        animationShouldEndTimer += animationDuration;

        attemptEndAnimateBezel();
    }

    function waitToAnimate()
    {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 10);
        });
    }

    function createBezel(direction, duration, text = "", chapter = false)
    {
        return new Promise(resolve => {
            log("Creating bezel");
            var bezelElm = api.querySelector(".ytp-bezel");
            bezel = bezelElm.parentNode;

            bezelElm.removeAttribute("aria-label");

            // Get the icon from the iconset
            var icon;
            if (chapter)
            {
                icon = ICONSET[direction + "chapter"];
            }
            else if (ICONSET[direction + duration])
            {
                icon = ICONSET[direction + duration];
            }
            else
            {
                icon = "";
            }

            var iconElm;
            if (iconElm = bezel.querySelector(".ytp-bezel-icon path"))
            {
                iconElm.setAttribute("d", icon);
            }
            else
            {
                bezel.querySelector(".ytp-bezel-icon").insertAdjacentHTML("beforeend",
                    `<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%">
                        <path class="ytp-svg-fill" d="${icon}"></path>
                    </svg>`
                );
            }

            if ("" === text)
            {
                bezel.setAttribute("class", "ytp-bezel-text-hide");
            }
            else
            {
                bezel.setAttribute("class", "");
                bezel.querySelector(".ytp-bezel-text").innerText = text;
            }

            bezel.style.display = "none";

            resolve();
        });
    }

    async function waitForElement(query, timeout = 500)
    {
        log("Waiting for element " + query + " with timeout in " + timeout + " ms.");
        var hasTimedOut = false;

        setTimeout(function() {
            log("Wait for element " + query + " has timed out.");
            hasTimedOut = true;
        }, timeout);

        while (null == document.querySelector(query) && !hasTimedOut)
        {
            await new Promise(r => requestAnimationFrame(r));
        }

        var a;
        if (a = document.querySelector(query))
        {
            return a;
        }
        else
        {
            return null;
        }
    }

    function handleSeekGui()
    {
        log("Handing seek GUI");
        var direction = this.dataset.side;
        var duration = this.querySelector(".ytp-doubletap-tooltip-label")
            .innerText.replace(/[\s|[A-Za-z]]*/g, "")
        ;
        var text = "";
        var isChapter = false;

        if (this.classList.contains("ytp-chapter-seek"))
        {
            var textContainer = this.querySelector(".ytp-chapter-seek-text-legacy")
            text = textContainer.innerText;
            duration = 0;
            isChapter = true;
        }

        createBezel(direction, duration, text, isChapter).then(waitToAnimate).then(animateBezel);
    }

    async function attemptHookPlayer()
    {
        log("Attempting to hook player");
        var playerApi = await waitForElement(".html5-video-player", 5000);

        if (playerApi)
        {
            log("Player API detected");
            api = playerApi;

            var doubleTapElm = api.querySelector(".ytp-doubletap-ui-legacy") ?? api.querySelector(".ytp-doubletap-ui") ?? null;

            if (doubleTapElm && !api.__oldSeekUi)
            {
                log("Doubletap detected: installing binding");
                (new MutationObserver(handleSeekGui.bind(doubleTapElm)))
                    .observe(doubleTapElm, {"subtree": true, "childList": true, "characterData": "true"});
                api.__oldSeekUi = true;
            }
        }
    }

    function insertContinuationEvent()
    {
        log("Inserting continuation events");
        if (window.ytspf && window.ytspf.enabled)
        {
            log("Inserted spf continuation events");
            document.addEventListener("spfdone", attemptHookPlayer);
        }
        else if (document.querySelector("ytd-app"))
        {
            log("Inserted kevlar continuation events");
            document.addEventListener("yt-page-data-updated", attemptHookPlayer);
        }
    }

    function installInitialStyles()
    {
        log("Installed initial styles");
        document.head.insertAdjacentHTML("beforeend",
            `<style>
                .ytp-doubletap-ui, .ytp-doubletap-ui-legacy
                {
                    display: none !important;
                }
            </style>`
        );
    }

    function handleDOMContentLoaded()
    {
        log("domcontentloaded event fired");
        installInitialStyles();
        document.removeEventListener("DOMContentLoaded", handleDOMContentLoaded);
    }

    async function main()
    {
        log("Old seek ui script loaded");

        document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

        // The player needs more time to init
        // So wait until a little while after page load to attempt
        // hooking the player
        window.addEventListener("load", function handleLoad() {
            log("load event fired");
            attemptHookPlayer();
            insertContinuationEvent();
            window.removeEventListener("load", handleLoad);
        });
    }

    main();

})();