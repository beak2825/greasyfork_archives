// ==UserScript==
// @name         Symbolab Pro
// @namespace    http://tampermonkey.net/
// @version      1.4.5
// @description  Symbolab pro for free
// @author       J. Lawrence Dev Pro Tips
// @match        https://www.symbolab.com/
// @include      *://*symbolab.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445923/Symbolab%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/445923/Symbolab%20Pro.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const VERSION = "1.4.5";

    console.log(`"Symbolab Pro" v${VERSION} loaded.`);

    // hide steps until full solution is loaded
    document.head.insertAdjacentHTML("beforeend", `<style id='hide_solution'>.solution_div { display: none; }</style>`);

    window.addEventListener("load", function () {
        // prevent paywall from appearing when verify button is clicked
        createUpgradeTooltip = () => null;

        // only run script if on a page with a solution
        if (typeof SYMBOLAB !== "undefined" && SYMBOLAB?.params?.query) {
            // initialize constants
            const url = location.href;
            const langMatch = url.match("//([a-z]{2}).symbolab");
            const lang = langMatch ? langMatch[1] : "en";
            const query = htmlDecode(SYMBOLAB.params.query);

            // reinitialize SymbolabSteps with subscribed set to true
            SYSTEPS = new SymbolabSteps(lang, "true", null, url);

            // reinitialize Solutions with subscribed set to true
            SOLUTIONS = new Solutions("", "step-by-step", query, "", 0, "", lang, "true");
            SOLUTIONS.init();

            console.log(`"Symbolab Pro" full step-by-step solutions initialized.`);
        }

        // if not signed in, create a warning next to the sign in link to tell the user they must log in
        if (!isUserLoggedIn()) {
            console.warn(`"Symbolab Pro" only works when signed in. You can create an account for free.`);
            const joinEl = document.getElementById("join");
            const warning = document.createElement("div");
            warning.id = "sign_in_warning";
            const warningStyles = {
                position: "fixed",
                top: "48px",
                right: "0px",
                width: "260px",
                height: "200px",
                backgroundColor: "rgb(255, 255, 255)",
                zIndex: "9999",
                padding: "1em",
                fontSize: "150%",
                lineHeight: "1.5em",
                border: "2px solid red",
            };
            Object.assign(warning.style, warningStyles);
            warning.innerHTML = `<p>Viewing step-by-step solutions for free is only possible when logged in.</p>
                <p style="font-size: 90%">Sign in or create a free account to continue.</p>
                <a href="https://greasyfork.org/en/scripts/407459-symbolab-pro" onclick="return false;" style="font-size: 75%">'Symbolab Pro' script v${VERSION}</a>`;
            // close button
            const closeButton = document.createElement("button");
            closeButton.innerHTML = "&times;";
            const closeStyles = {
                position: "absolute",
                top: "0px",
                right: "0px",
                fontSize: "150%",
                fontWeight: "bold",
                cursor: "pointer",
                background: "none",
                border: "none",
            };
            Object.assign(closeButton.style, closeStyles);
            closeButton.addEventListener("click", () => {
                warning.style.display = "none";
            });
            warning.appendChild(closeButton);
            if (joinEl) {
                joinEl.appendChild(warning);
            }
            // flash warning when show steps button is clicked since the content is locked
            document.body.addEventListener(
                "click",
                (e) =>
                    $(e.target).closest(".solution_title_container")[0] &&
                    $("#sign_in_warning").fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)
            );
        }

        // show solution
        document.getElementById("hide_solution").remove();
    });
})();
