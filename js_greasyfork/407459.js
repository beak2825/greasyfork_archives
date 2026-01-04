// ==UserScript==
// @name         [PATCHED] Symbolab Pro
// @namespace    http://tampermonkey.net/
// @version      1.4.6
// @description  Symbolab Pro for free - unlock full steps and verify solutions
// @author       Jonah Lawrence - Dev Pro Tips
// @match        https://www.symbolab.com/
// @include      *://*symbolab.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/407459/%5BPATCHED%5D%20Symbolab%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/407459/%5BPATCHED%5D%20Symbolab%20Pro.meta.js
// ==/UserScript==

// jshint esversion: 6

(function () {
    "use strict";

    const VERSION = "1.4.6";

    console.log(`"Symbolab Pro" v${VERSION} loaded.`);

    // hide steps until full solution is loaded
    document.head.insertAdjacentHTML("beforeend", `<style id='hide_solution'>.solution_div { display: none; }</style>`);

    window.addEventListener("load", function () {
        // prevent subscribe popups from appearing
        window.showSubscription = () => null;
    
        // prevent paywall from appearing when verify button is clicked
        window.createUpgradeTooltip = () => null;

        // only run script if on a page with a solution
        if (typeof SYMBOLAB !== "undefined" && SYMBOLAB?.params?.query) {
            // initialize constants
            const url = location.href;
            const langMatch = url.match("//([a-z]{2}).symbolab");
            const lang = langMatch ? langMatch[1] : "en";
            const query = htmlDecode(SYMBOLAB.params.query);

            // reinitialize SymbolabSteps with subscribed set to true
            window.SYSTEPS = new SymbolabSteps(lang, "true", null, url);

            // reinitialize Solutions with subscribed set to true
            window.SOLUTIONS = new Solutions("", "step-by-step", query, "", 0, "", lang, "true");
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

        // improvements to dark mode
        const fixDarkMode = function () {
            // check if dark mode style element is on the page
            if ($("#invert-style").length > 0) {
                // replace the styling element with better styling
                var invertStyle = $("#invert-style")[0].innerHTML;
                $("#invert-style")[0].remove();
                document.head.insertAdjacentHTML(
                    "beforeend",
                    `<style type="text/css" id="invert-style">
                        ${invertStyle}
                        img,
                        #HomeTopNav svg,
                        button.btn.btn-large.btn-custom.search,
                        button.verify-button,
                        li#solutionsTopNav a span,
                        span.bloggerIcon,
                        a.show-hide-button.show-hide-plot.print-hide,
                        a.stepsPracticeLink span,
                        .m2u>li>a.active,
                        .m3u>li>a.active,
                        li a.nl-leftMenu span,
                        .nl-feedback.nl-redText.print-hide span {
                            filter: invert(1);
                        }

                        img.open,
                        img.close,
                        ul.solution-examples li svg,
                        a.nl-leftMenu.active span {
                            filter: invert(0);
                        }

                        button.btn.btn-large.btn-custom.search {
                            border: 1px solid black;
                        }

                        div#nl-subNav {
                            background-color: rgba(220, 220, 220, 1);
                        }

                        a.nl-topMenu span,
                        a.nl-topMenu.active .nl-topSubMenu span,
                        #nl-subNav ul li .nl-topSubMenu a:hover span {
                            color: #000000;
                        }

                        a.nl-topMenu.active span,
                        #nl-subNav ul li a:hover span {
                            color: #ffffff;
                        }

                        @-moz-document url-prefix() {
                            body {
                                background-color: #111111;
                            }
                        }
                    </style>`
                );
            }
        };
        // fix dark mode when the page loads
        fixDarkMode();
        // overwrite the toggle function to fix dark mode at end
        var oldLightsOut = lightsOut;
        window.lightsOut = function () {
            // call the original lightsOut function
            oldLightsOut();
            // fix dark mode
            fixDarkMode();
        };
    });
})();
