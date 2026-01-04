// ==UserScript==
// @name         DH3 Tick Pulse
// @namespace    com.anwinity.dh3
// @version      1.2.5
// @description  Pulses each tick to aid in counting various things (e.g. shark bite).
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412679/DH3%20Tick%20Pulse.user.js
// @updateURL https://update.greasyfork.org/scripts/412679/DH3%20Tick%20Pulse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PULSE_DURATION = 500;
    const KEY_TOP = "dh3-tick-pulse-top";
    const KEY_LEFT = "dh3-tick-pulse-left";

    function init() {
        if(!window.var_username) {
            setTimeout(init, 1000);
            return;
        }

        let animationStart = Date.now();

        let fontAwesome = document.createElement("script");
        fontAwesome.src = "https://kit.fontawesome.com/044e12ee28.js"
        fontAwesome.crossorigin = "anonymous";
        fontAwesome.type = "text/javascript";
        $("head").append(fontAwesome);

        let top = localStorage.getItem(KEY_TOP);
        let left = localStorage.getItem(KEY_LEFT);

        const styles = document.createElement("style");
        styles.textContent = `
          #dh3-tick-pulse {
            min-width: 50px;
            min-height: 50px;
            position: absolute;
            left: ${left}px;
            top: ${top}px;
            z-index: 9999;
            padding: 0.25em;
            border: 1px solid rgb(64, 64, 64);
            border-radius: 2px;
            background-color: rgb(26, 26, 26);
            padding: 0px;
            margin: 0px;
          }
          #dh3-tick-pulse-circle-container {
            width: 40px;
            height: 40px;
          }
          #dh3-tick-pulse.collapsed > #dh3-tick-pulse-circle-container {
            display: none;
          }
          #dh3-tick-pulse-circle-container > .circle {
            width: 0px;
            height: 0px;
            margin-top: 0px;
            margin-left: 0px;
            -webkit-border-radius: 20px;
            -moz-border-radius: 20px;
            border-radius: 20px;
            background: rgb(42, 200, 200);
            opacity: 1;
            position: absolute;
            top: calc(20px + 0.25em);
            left: 50%;
          }
          #dh3-tick-pulse-animation-info {
            padding: 0.25em;
            text-align: center;
            font-size: 18pt;
          }

        `;
        $("head").append(styles);

        $("body").prepend(`
          <div id="dh3-tick-pulse">
            <div id="dh3-tick-pulse-circle-container"></div>
            <div id="dh3-tick-pulse-animation-info"></div>
          </div>
        `);

        let el = $("#dh3-tick-pulse");
        el.draggable({
            appendTo: "body",
            containment: "document",
            cursor: "pointer"
        });
        el.on("dragstop", function(event, ui) {
            localStorage.setItem(KEY_TOP, ui.position.top);
            localStorage.setItem(KEY_LEFT, ui.position.left);
        });

        function pulse() {
            let container = $("#dh3-tick-pulse-circle-container");
            let circle = $('<div class="circle"></div>');
            circle.animate({
                "width": "40px",
                "height": "40px",
                "margin-top": "-20px",
                "margin-left": "-20px",
                "opacity": 0
            }, PULSE_DURATION, "swing");
            container.append(circle);
            setTimeout(function() {
                circle.remove();
            }, PULSE_DURATION);
        };

        setInterval(function() {
            let monsterObj = window[`${var_monsterName}MonsterObj`];
            if(monsterObj) {
                let animation = monsterObj.currentAnimation;
                let delta = Date.now() - animationStart;
                let info = `${animation.name}: ${Math.floor(delta/1000)}`;
                $("#dh3-tick-pulse-animation-info").text(info);
            }
        }, 100);

        const originalSetItems = window.setItems;
        window.setItems = function(data) {
            originalSetItems.apply(this, arguments);
            const hideOrShow = function() {
                let el = $("#dh3-tick-pulse");
                if(el.is(":hidden") && window.var_monsterName != "none") {
                    el.show();
                }
                else if(el.is(":visible") && window.var_monsterName == "none") {
                    el.hide();
                }
            };
            hideOrShow();
            setTimeout(hideOrShow, 1500);

            if(data && data.includes("playtime~")) {
                try {
                    pulse();
                }
                catch(err) {
                    console.log("DH3 TICK PULSE - Error occurred on pulse()", err);
                }
            }

        }

        const originalStartMonsterAnimation = window.startMonsterAnimation;
        window.startMonsterAnimation = function() {
            originalStartMonsterAnimation.apply(this, arguments);
            animationStart = Date.now();
        }
    }

    $(init);
})();