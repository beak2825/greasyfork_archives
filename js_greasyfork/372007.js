// ==UserScript==
// @name         JIRA Subtask Move Plugin
// @description  Plugin to allow moving of sub-tasks in JIRA
// @version      0.5.2
// @author       Max Schlüssel <lokoxe@gmail.com>
// @namespace    https://ghostkernel.org/
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/372007/JIRA%20Subtask%20Move%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/372007/JIRA%20Subtask%20Move%20Plugin.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    if($ == undefined) return;
    if(!$("body").is("#jira")) {
        return;
    }

    // Add styling for our dragging knob
    GM_addStyle("                                        \
        .issuerow .dragger {                             \
            display: block;                              \
            height: 10px;                                \
            margin-top: 15px;                            \
            margin-right: 5px;                           \
            border: none !important;                     \
            cursor: move;                                \
            background: repeating-linear-gradient(0,     \
                                transparent 0%,          \
                                transparent 2%, #aaa 2%, \
                                #aaa 3%, transparent 3%);\
        }                                                \
        .issuerow.dragged {                              \
            background-color: #eee !important;           \
        }                                                \
      ");

    $(document).ready(function() {
        var issueRows = $(".issuerow");

        var draggedRow = null;
        var dropSequence = null;
        var insertAfter = false;

        // Create a dragger knob on each issue row
        issueRows.each(function() {
            var issueRow = $(this);
            var dragger = $("<td>");
            dragger.addClass("dragger");
            issueRow.prepend(dragger);
            dropSequence = null;

            // Start dragging
            dragger.bind("mousedown.drag", function(e) {
                e.preventDefault();
                draggedRow = dragger.parent();
                draggedRow.addClass("dragged");
            });
        });

        // Update dragged row & move it to new position
        $(document).bind("mousemove.drag", function(e) {
            e.preventDefault();
            if(draggedRow == null) {
                return;
            }

            var el = $(e.target);
            var hoveredRow = el.closest(".issuerow");
            if(hoveredRow.length > 0) {
                if(!draggedRow.is(hoveredRow)) {
                    draggedRow.detach();
                    if(e.offsetY < 20) {
                        insertAfter = false;
                        draggedRow.insertBefore(hoveredRow);
                    } else {
                        insertAfter = true;
                        draggedRow.insertAfter(hoveredRow);
                    }
                }
                dropSequence = draggedRow.index();
            }
        });

        // Perform the actual task update
        $(document).bind("mouseup.drag", function(e) {
            if(draggedRow != null && dropSequence != null) {
                e.preventDefault();
                // Take original move URL & build update URL
                var moveUrl = draggedRow.find(".subtask-reorder a").first().attr("href");
                var currentSequence = moveUrl.substring(moveUrl.indexOf("&currentSubTaskSequence=") + "&currentSubTaskSequence=".length, moveUrl.indexOf("&subTaskSequence="));
                if(currentSequence != dropSequence) {
                    var id = moveUrl.substring(moveUrl.indexOf("id=") + "id=".length, moveUrl.indexOf("&currentSubTaskSequence="));
                    var newLink = "/secure/MoveIssueLink.jspa?id=" + id + "&currentSubTaskSequence=" + currentSequence + "&subTaskSequence=" + dropSequence + "#view-subtasks";
                    window.location = newLink;
                }

                // Reset dragged row
                draggedRow.removeClass("dragged");
                draggedRow = null;
            }
        });
    });
})($);
