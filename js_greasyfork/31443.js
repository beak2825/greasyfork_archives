// ==UserScript==
// @name         Memrise Term Editor
// @namespace    https://techdavid.github.io/
// @version      0.3.2
// @description  Allow editing words without being a course owner.
// @author       David Bailey
// @license      MIT
// @match        https://www.memrise.com/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/31443/Memrise%20Term%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/31443/Memrise%20Term%20Editor.meta.js
// ==/UserScript==

$(function() {
    'use strict';

    // Term Editor [start]
    var edits = GM_getValue("edits", {});

    function getFullID() {
        var id = $(".question-row").data("thingId").toString();
        var colour = $(".graphic").attr("class").match(/colour-([0-9])/)[1];
        return `${id}-${colour}`;
    }

    function getAlternate() {
        return edits[getFullID()];
    }

    function replaceTerm(newTerm) {
        var original = $(".qquestion")[0].childNodes[0];
        $(".qquestion").data("originalDef", original.textContent.trim());
        original.replaceWith(newTerm);
    }

    function getOriginal() {
        return $(".qquestion").data("originalDef") || $(".qquestion")[0].childNodes[0].textContent.trim();
    }

    function revert() {
        $(".qquestion")[0].childNodes[0].replaceWith(getOriginal());
        $(".qquestion").removeData("originalDef");
    }

    if (location.href.match(/\/garden\//)) {
        var editButton = $("<p>Term Editor</p>").appendTo("#left-area");
        editButton.on("click", function() {
            $(".session-pause-wrapper .ico-pause").click();

            if ($("#edit-link")[0]) {
                var con = confirm("Warning: you have editing access to this course. " +
                                  "Press Cancel to edit the term with the standard editor instead, or OK to continue.");
                if (!con) {
                    $("#edit-link")[0].click();
                    return;
                }
            }
            var alternate = getAlternate();
            if (alternate) {
                let pr = prompt(`Replace "${alternate}" with:` + "\n" + `Press Cancel to revert to "${getOriginal()}"`, alternate);

                if (pr === null || pr === getOriginal()) {
                    revert();
                    delete edits[getFullID()];
                } else if (pr !== alternate[0]) {
                    replaceTerm(pr);
                    edits[getFullID()] = pr;
                }
            } else {
                let pr = prompt(`Replace "${getOriginal()}" with:`, getOriginal());

                if (pr !== null && pr !== getOriginal()) {
                    replaceTerm(pr);
                    edits[getFullID()] = pr;
                }
            }

            GM_setValue("edits", edits);
        });

        $("#boxes").on("DOMSubtreeModified", function() {
            if ($(".qquestion")[0] && (!$(".qquestion.modified")[0])) {
                $(".qquestion").addClass("modified");
                editButton.show();

                var alternate = getAlternate();
                if (alternate) {
                    replaceTerm(alternate);
                }
            } else if (!$(".qquestion")[0]) {
                editButton.hide();
            }
        });
    }

    function enableAdvancedFeatures() {
        GM_registerMenuCommand("Add edit manually", function() {
            var fullID = prompt("Full ID:");
            var newTerm = prompt("New term:");

            if (fullID && newTerm) {
                edits[fullID] = newTerm;
                GM_setValue("edits", edits);
            }
        });

        GM_registerMenuCommand("Delete edit manually", function() {
            var fullID = prompt("Full ID:");

            delete edits[fullID];
            GM_setValue("edits", edits);
        });

        GM_registerMenuCommand("Log edits", function() {
            console.log(edits);
        });

        GM_registerMenuCommand("Delete all edits", function() {
            if (confirm("Delete all edits?")) {
                edits = {};
                GM_setValue("edits", edits);
            }
        });

        GM_registerMenuCommand("Export all edits", function() {
            GM_setClipboard(JSON.stringify(edits));
            alert("Data copied to clipboard");
        });

        GM_registerMenuCommand("Import edits", function() {
            var pr = prompt("Paste data to import:");
            if (pr) {
                var check = confirm("Warning: Pressing OK will REPLACE ALL EXISTING DATA with the pasted data. Continue?");
                if (check) {
                    edits = JSON.parse(pr);
                    GM_setValue("edits", edits);
                }
            }
        });
    }

    GM_registerMenuCommand("Enable advanced features", enableAdvancedFeatures);
    // Term Editor [end]
});