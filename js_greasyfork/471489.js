

    // ==UserScript==
    // @name         Youtube Player perf
    // @version      0.7
    // @description  Optimizes animation calls for lower GPU/CPU consumption
    // @namespace    nopeless.github.io
    // @author       nopeless
    // @match        https://www.youtube.com/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
    // @grant        none
    // @run-at       document-start
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471489/Youtube%20Player%20perf.user.js
// @updateURL https://update.greasyfork.org/scripts/471489/Youtube%20Player%20perf.meta.js
    // ==/UserScript==

    /* global _yt_player */

    (() => {
        "use strict";

        const scaleX0 = Symbol("scaleX(0)");
        const scaleX1 = Symbol("scaleX(1)");

        const PLAYER_CONSTRUCTOR = "sV";
        const ATTR_UPDATE = "yo";
        const UPDATE_INTERNAL = "v";

        function scaleX(el) {
            el.style.transform = "scaleX(0)";
            el[scaleX0] = true;
            el[scaleX1] = false;
        }

        function checks(ytp) {
            // .u
            // updating method
            return ytp[UPDATE_INTERNAL] && ytp[PLAYER_CONSTRUCTOR] && ytp[ATTR_UPDATE];
        }

        function modifyBase() {
            console.log("Overriding _yt_player methods");

            if (!window._yt_player) return console.error("YT player not avaliable, load order is wrong");

            if (!checks(window._yt_player)) alert("YouTube Player Perf will not work in this version of youtube. Disable it. Leave a kind comment on https://greasyfork.org/en/scripts/471489-youtube-player-perf");

            const PlayerConstructor = _yt_player[PLAYER_CONSTRUCTOR];

            // save the original prototype
            const PlayerConstructorPrototype = _yt_player[PLAYER_CONSTRUCTOR].prototype;

            let dirty = false;

            let chapterCount = 0;

            function update(a) {
                // 2023-08-02
                // .u -> .v
                for (var b = _yt_player[UPDATE_INTERNAL](Object.keys(a)), c = b.next(); !c.done; c = b.next()) {
                    c = c.value;

                    if (this.__updateCache.get(c) !== a[c]) {
                        // console.log("updating", c, a[c]);
                        this.updateValue(c, a[c]);
                        dirty = true;
                        this.__updateCache.set(c, a[c]);
                    }
                }
            }

            // use ToolTip for checking
            let ytpToolTip = null;
            let ytpToolTipPreviousValue = null;

            _yt_player[PLAYER_CONSTRUCTOR] = function (...args) {
                // debugger;
                // YouTube base.js update approx 2023-07-28
                // this -> args[0]
                // const a = args[0];
                // This was reverted approx 2023-08-02

                PlayerConstructor.call(this, ...args);

                this.__updateCache = new Map();

                // console.log(this.update);

                // override update
                // debugger;
                this.update = update;
            };

            _yt_player[PLAYER_CONSTRUCTOR].prototype = Object.create(PlayerConstructorPrototype);
            _yt_player[PLAYER_CONSTRUCTOR].prototype.constructor = _yt_player[PLAYER_CONSTRUCTOR];

            const attributeUpdate = _yt_player[ATTR_UPDATE];
            let headUpdateElement = null;
            let loopLatch = false;

            // YouTube base.js update approx 2023-07-28
            // Nn => Un

            // if ('string' === typeof b)
            _yt_player[ATTR_UPDATE] = (a, b, c) => {
                // don't do excessive progress bar updates
                if (b === "transform") {
                    let ih;

                    if (dirty || (ih = (ytpToolTip ??= document.querySelector("span.ytp-tooltip-text"))?.innerHTML) !== ytpToolTipPreviousValue) {
                        // first call after dirty
                        headUpdateElement = a;

                        dirty = false;
                        loopLatch = true;

                        ytpToolTipPreviousValue = ih;
                    } else if (a === headUpdateElement) {
                        headUpdateElement = null;
                        loopLatch = false;
                        return;
                    } else if (!loopLatch) return;

                    // scalex(0) is almost useless after initial load
                    if (c === "scalex(0)") {
                        if (a[scaleX0]) return;
                        a[scaleX0] = true;
                        a[scaleX1] = false;
                    } else if (c === "scalex(1)") {
                        if (a[scaleX1]) return;
                        a[scaleX0] = false;
                        a[scaleX1] = true;
                    } else {
                        a[scaleX0] = false;
                        a[scaleX1] = false;
                    }
                }
                attributeUpdate(a, b, c);
            };
        }

        window.__modifyBase = modifyBase;

        const ob = new MutationObserver(mrs => {
            const l = mrs.map(mr => mr.addedNodes[0]).find(node => node && node.nodeName === "SCRIPT" && node.src && node.src.match(/\/base\.js$/));

            if (!l) return;

            l.setAttribute("onload", "__modifyBase()");

            ob.disconnect();
        });

        console.log("watching for script changes");
        ob.observe(document, { attributes: false, childList: true, subtree: true });
    })();

/* For internal use. Not relevant to script

2023-08-05

61267
    sRa = function (a) {
      return a.N(
        'embeds_web_enable_video_data_refactoring_offline_and_progress_bar'
      )
    };
    g.NV = function (a, b) {
      g.XQ.call(
        this,
        {
          G: 'div',
          S: 'ytp-progress-bar-container',
          Y: {
            'aria-disabled': 'true'
          },

12653
    co = function (a, b) {
      return a == b ? !0 : a &&
      b ? a.left == b.left &&
      a.width == b.width &&
      a.top == b.top &&
      a.height == b.height : !1
    };
    g.ro = function (a, b, c) {
      if ('string' === typeof b) (b = qo(a, b)) &&
      (a.style[b] = c);
       else for (var d in b) {
        c = a;
        var e = b[d],
        f = qo(c, d);

g.v should be found from call stack

*/
