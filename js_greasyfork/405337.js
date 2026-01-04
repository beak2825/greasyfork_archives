// ==UserScript==
// @name         ogs flat style gokibitz
// @version      0.5
// @description  mimic GoKibitz style on OGS
// @author       michiakig
// @match        https://online-go.com/*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/592542
// @downloadURL https://update.greasyfork.org/scripts/405337/ogs%20flat%20style%20gokibitz.user.js
// @updateURL https://update.greasyfork.org/scripts/405337/ogs%20flat%20style%20gokibitz.meta.js
// ==/UserScript==

(function() {
    function ready() {
        return typeof data !== "undefined" &&
            typeof GoThemes !== "undefined" &&
            document.querySelector("div.theme-set div.selector") &&
            document.querySelector("button.color-reset");
    }

    function setup() {
        console.log("[ogs flat style gokibitz] setting up");
        // custom place stone function for flat edges
        var placeStoneFn = function(color) {
            return function(ctx, shadow_ctx, stone, cx, cy, radius) {
                let lineWidth = radius * 0.10;
                if (lineWidth < 0.3) {
                    lineWidth = 0;
                }
                ctx.fillStyle = color;
                ctx.strokeStyle = color; // changed to use same color as stone, instead of line color
                if (lineWidth > 0) {
                    ctx.lineWidth = lineWidth;
                }
                ctx.beginPath();
                ctx.arc(cx, cy, radius - lineWidth / 2, 0.001, 2 * Math.PI, false); /* 0.001 to workaround fucked up chrome bug */
                if (lineWidth > 0) {
                    ctx.stroke();
                }
                ctx.fill();
            };
        };

        var turquoise = "#1ABC9C";
        var sea = "#16A085";
        var emerald = "#2ECC71";
        var nephritis = "#27AE60";

        var line = "#847330";
        var board = "#e4bb67";
        var white = 'hsl(0, 0%, 95%)';
        var black = 'hsl(0, 0%, 20%)';


        data.set("custom.black", black);
        data.set("custom.white", white);
        data.setDefault("custom.board", board);
        data.setDefault("custom.line", line);

        GoThemes.white.Plain.prototype.placeWhiteStone = placeStoneFn(white);
        GoThemes.black.Plain.prototype.placeBlackStone = placeStoneFn(black);

        // inject CSS
        const style = document.createElement('style');
        style.textContent = `
        :root {
            --turquoise: #1ABC9C;
            --sea: #16A085;
        }

        /* background colors */
        div#NavBar {
            background-color: #16A085 !important;
        }
        div.Puzzle {
            background-color: var(--turquoise) !important;
        }
        div.MainGobanView {
            background-color: var(--turquoise) !important;
        }

        /* together these flatten the border between main view and top bar, and fix for zen mode */
/*
        div.Game.zen {
            top: 0rem; !important
        }
        div.Game {
            top: 2.0rem; !important
        }
        div.Puzzle {
            top: 2.0rem; !important
        }
*/
        /* remove shadow from board */
        body.light div.Goban {
            box-shadow: none !important;
        }

        /* fix so chat matches main theme */
        body.light div.GameChat {
            background-color:#fff;
        }
        body.dark div.GameChat {
            background-color:#1a1a1a;
        }

        /* fullscreen toggle icon */
        div.FullScreenToggle div {
            font-family: sans-serif;
            font-size: 2rem;
            font-weight: bold;
            color: #4d4d4d;
        }
        div.FullScreenToggle {
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            bottom: .5rem;
            left: .5rem;
            width: 2rem;
            height: 2rem;
        }
        `;
        document.head.append(style);

        // click the theme selector which will trigger a redraw
        document.querySelector("div.theme-set div.selector").click();

        console.log("[ogs flat style gokibitz] done");
    };

    // set up the mutation observer
    // altho this should be installed with @run-at idle, I still saw the code run prior to these globals being available, so just watch the page for updates until they are present
    var observer = new MutationObserver(function (mutations, me) {
        if (ready()) {
            setup();
            me.disconnect(); // stop observing
        } else {
            console.log("[ogs flat style gokibits] data or GoThemes not found, waiting...");
        }
    });

    // start observing
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();
