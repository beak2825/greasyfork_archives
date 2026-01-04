// ==UserScript==
// @name        UdGMoodle Printable Quiz
// @version     0.4.1
// @author      Antonio Bueno <antonio.bueno@udg.edu>
// @description Cleans/simplifies a Moodle Quiz to be printable
// @namespace   bueno.bcds.udg.edu
// @match       https://moodle.udg.edu/mod/quiz/attempt.php*
// @match       https://moodle2.udg.edu/mod/quiz/attempt.php*
// @icon        https://raw.githubusercontent.com/buenoudg/Ajudant-UdGMoodle/master/udgmoodle_44x44.png
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/toastify-js@1/src/toastify.min.js
// @resource    toastifyCSS https://cdn.jsdelivr.net/npm/toastify-js@1/src/toastify.css
// @grant       GM.getResourceUrl
// @downloadURL https://update.greasyfork.org/scripts/453479/UdGMoodle%20Printable%20Quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/453479/UdGMoodle%20Printable%20Quiz.meta.js
// ==/UserScript==

/*
 * Versions:
 *  - 0.4.0 (2023-09-16) Compatible amb el nou UdGMoodle
 *  - 0.4.1 (2023-10-19) Retocs estétics
 */

// jshint esversion: 8
(function () {
    "use strict";

    /*
     * DOM manipulations courtesy of jQuery
     */

    // Modificacions are applied once the DOM has been build (images may be still loading)
    $(document).ready(function () {

        // Makes clear that the script is running and its version
        notification(`${GM.info.script.name} ${GM.info.script.version}`, "hello", 3);

        // Technical info to console
        console.log(GM.info);

        // Trigger button
        $("#mod_quiz_navblock").prepend('<button id="printable">Fes-ho imprimible');
        // Button behavior
        $("#printable").on("click", function () {
            // Move quiz container to the top
            $("body").prepend($("#region-main"));
            // Add editable block with the quiz title at the beginning of the container
            $("#responseform").prepend('<div class="que"><div class="formulation"><div contenteditable="true"><h3>' +
                                       document.title +
                                       "</h3><i><b>Bloc editable</b> (també es pot enganxar des de Word i similars)</div>");
            // Modify webpage appearance
            let stylesheet = document.createElement("style");
            stylesheet.textContent = `
                /* Hide elements */
                nav, #nav-drawer, #nav-drawer-footer, .activity-navigation, .tertiary-navigation,
                #page-wrapper, #top-footer, .que .info, .submitbtns, .multichoice .prompt,
                .content input[type="submit"], .filemanager, .editor_atto_toolbar { display: none !important }

                /* Adjust spacing */
                body, .que .content, .que .ablock .answer>div:last-child { margin: 0 }
                #region-main>.card { border: none }
                .card-body { padding: 0 !important }
                .que { margin: 1em auto }
                .que .qtext { margin: 0 0 0.5em 1.7em }
                .que .ablock { margin: 0 0 0 0.5em }
                .que .qtext table td { padding: 0 0.25em }

                /* Question numbering */
                body { counter-reset: question }
                .que .qtext::before { counter-increment: question; content: counter(question) ". "; font-weight: bold; margin-left: -1.7em; float: left }

                /* Cosmetic details */
                .que .formulation { background-color: transparent }
                .editor_atto_content.form-control { border: 1px solid #ced4da }

                /* Usability */
                .editor_atto_content.form-control { min-height: 48px !important }
            `;
            document.documentElement.appendChild(stylesheet);
        });

    });

    // External CSS files
    (async function () {
        // Toastify CSS
        let externalFileURL = await GM.getResourceUrl("toastifyCSS");
        stylesheet = document.createElement("link");
        stylesheet.setAttribute("rel", "stylesheet");
        stylesheet.setAttribute("href", externalFileURL);
        document.documentElement.appendChild(stylesheet);
    })();

    // Inline CSS
    let stylesheet = document.createElement("style");
    stylesheet.textContent = `
        div.toastify { margin: inherit; padding-bottom: 20px; width: inherit; font-family:
            -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; }
        /* Trigger button appearance */
        #printable::before { content: "🖨 "; font-size: 200%; position: relative; top: 0.1em }
        #printable { border-color: lightgrey darkgrey darkgrey lightgrey; padding: 0em 1em 0.5em }
    `;
    document.documentElement.appendChild(stylesheet);

    /*
     * Notifications courtesy of Toastify JS (see https://apvarun.github.io/toastify-js/)
     */

    function notification(message, type = "info", timeout = 5) {
        // The "type" parameter accepts four values: "info", "warning", "error" and "hello"
        // The "timeout" parameter is expressed in seconds although Toastify uses milliseconds
        let color, icon;
        switch (type) {
            case "warning":
                color = "rgba(201, 201, 0, 0.8)";
                icon = "⚠️";
                break;
            case "error":
                color = "rgba(201, 51, 51, 0.8)";
                icon = "🛑";
                break;
            case "hello":
                color = "rgba(51, 153, 51, 0.8)";
                icon = "👋🏼";
                break;
            default:
                color = "rgba(51, 51, 153, 0.8)";
                icon = "ℹ️";
        }
        Toastify({
            text: icon + " " + message,
            duration: timeout * 1000,
            gravity: "bottom",
            style: {
                background: color,
            }
        }).showToast();
    }

})();
