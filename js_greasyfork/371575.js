// ==UserScript==
// @name          WaniKani Distraction Free Mode
// @namespace     http://alsanchez.es/
// @description	  Hide stats from the review page
// @include       https://www.wanikani.com/review/session*
// @version       2
// @copyright     2018+, Alejandro Sánchez
// @license       GPL-3.0; https://opensource.org/licenses/GPL-3.0
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/371575/WaniKani%20Distraction%20Free%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/371575/WaniKani%20Distraction%20Free%20Mode.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {

    const settings = {
        Enabled: "wanikani-addon-distraction-free-mode-enabled"
    };

    const tooltips = [
        "Hide stats",
        "Show stats"
    ];

    const ui = {
        Body: document.body,
        Head: document.head,
        CustomStyle: createStyle(),
        Stats: document.getElementById("stats"),
        Toggle: createToggle()
    };

    var enabled = (localStorage.getItem(settings.Enabled) === "true");

    function initialize()
    {
        ui.Head.appendChild(ui.CustomStyle);
        ui.Stats.appendChild(ui.Toggle);

        ui.Toggle.addEventListener("click", function()
        {
            changeMode();
            enabled = !enabled;
            localStorage.setItem(settings.Enabled, enabled);
        });

        if(enabled)
        {
            changeMode();
        }
    }

    function changeMode()
    {
        ui.Body.classList.toggle("hidden-stats");
        ui.Toggle.classList.toggle("icon-eye-open");
        ui.Toggle.classList.toggle("icon-eye-close");
        ui.Toggle.title = tooltips.reverse()[0];
    }

    function createStyle()
    {
        const cssRules = `
            body.hidden-stats div#stats > span,
            body.hidden-stats div#stats > i:not(.distraction-free-mode-toggle),
            body.hidden-stats #wrap-up-countdown,
            body.hidden-stats div#reviews #progress-bar #bar
            {
                display: none !important;
            }
            .distraction-free-mode-toggle
            {
                opacity: 0.5;
                cursor: pointer;
                transition: opacity 0.3s;
            }
            .distraction-free-mode-toggle:hover
            {
                opacity: 1;
            }
        `;

        const styleNode = document.createElement("style");
        styleNode.type = "text/css";
        styleNode.appendChild(document.createTextNode(cssRules));
        return styleNode;
    }

    function createToggle()
    {
        const toggle = document.createElement("i");
        toggle.classList.add("distraction-free-mode-toggle", "icon-eye-close");
        toggle.title = tooltips[0];
        return toggle;
    }

    initialize();

})();