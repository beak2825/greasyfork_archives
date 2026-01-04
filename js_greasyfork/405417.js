// ==UserScript==
// @name         ogs 8-bit style
// @version      0.3
// @description  8-bit style on OGS, based on Hayauchi super igo
// @author       michiakig
// @match        https://online-go.com/*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/592542
// @downloadURL https://update.greasyfork.org/scripts/405417/ogs%208-bit%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/405417/ogs%208-bit%20style.meta.js
// ==/UserScript==

(function() {
    function ready() {
        const result = typeof data !== "undefined" &&
            typeof GoThemes !== "undefined" &&
            document.querySelector("div.theme-set div.selector") != null;// &&
            //document.querySelector("button.color-reset") != null;
        console.log('[ogs 8-bit style] ready?', result);
        return result;
    }

    function setup() {
        console.log('[ogs 8-bit style] setup');
        const white = "#ffffff";
        const black = "#000000";
        const brown = "#a15c14"; // board
        const darkBlue = "#074f5b"; // background

        data.set("custom.black", black);
        data.set("custom.white", white);
        data.setDefault("custom.board", brown);
        data.setDefault("custom.line", black);

        // custom place stone function for pixel art stones
        GoThemes.white.Plain.prototype.placeWhiteStone = function(ctx, shadow_ctx, stone, cx, cy, radius) {
            // one unit is one pixel length
            const unit = radius / 4;

            // stone
            ctx.fillStyle = white;
            ctx.fillRect(cx - 3.5 * unit, cy - 2 * unit, 7 * unit, 3 * unit);
            ctx.fillRect(cx - 2.5 * unit, cy + 1 * unit, 6 * unit, 1 * unit);
            ctx.fillRect(cx - 2.5 * unit, cy - 3 * unit, 4 * unit, 5 * unit);
            ctx.fillRect(cx + 1.5 * unit, cy - 3 * unit, 1 * unit, 5 * unit);
            ctx.fillRect(cx - 1.5 * unit, cy - 4 * unit, 3 * unit, 7 * unit);

            // shadoow
            ctx.fillStyle = black;
            ctx.fillRect(cx - 0.5 * unit, cy + 3 * unit, 3 * unit, 1 * unit);
            ctx.fillRect(cx + 1.5 * unit, cy + 2 * unit, 1 * unit, 2 * unit);
            ctx.fillRect(cx + 2.5 * unit, cy + 1 * unit, 1 * unit, 2 * unit);
        };

        GoThemes.black.Plain.prototype.placeBlackStone = function(ctx, shadow_ctx, stone, cx, cy, radius) {
            // one unit is one pixel length
            const unit = radius / 4;

            // stone
            ctx.fillStyle = black;
            ctx.fillRect(cx - 2.5 * unit, cy - 3 * unit, 5 * unit, 5 * unit);
            ctx.fillRect(cx - 1.5 * unit, cy - 4 * unit, 3 * unit, 7 * unit);
            ctx.fillRect(cx - 3.5 * unit, cy - 2 * unit, 7 * unit, 3 * unit);

            // shine
            ctx.fillStyle = white;
            ctx.fillRect(cx - 2.5 * unit, cy - 2 * unit, 1 * unit, 2 * unit);
            ctx.fillRect(cx - 1.5 * unit, cy - 3 * unit, 1 * unit, 1 * unit);
        };

        // inject CSS
        const style = document.createElement('style');
        style.textContent = `
        /* background colors */
        div.MainGobanView {
            background-color: #074f5b !important;
        }
        div.MainGobanView.zen {
            background-color: #074f5b !important;
        }
        /* drop shadow behind board */
        div.Goban {
            box-shadow: 20px 20px black !important;
        }
        `;
        document.head.append(style);

        const themeSet = document.querySelector("div.theme-set div.selector");
        //const colorSet = document.querySelector("button.color-reset");

        // click the theme selector which will trigger a redraw
        themeSet.click();
        // click color reset too to redraw the board
        //colorSet.click()

        return true;
    };

    // set up the mutation observer
    // altho this should be installed with @run-at idle, I still saw the code run prior to these globals being available, so just watch the page for updates until they are present
    var observer = new MutationObserver(function (mutations, me) {
        if (ready()) {
            try {
              if (setup()) {
                me.disconnect(); // stop observing
              }
            } catch (e) {
                me.disconnect(); // stop observing
            }
        }
    });

    // start observing
    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();
