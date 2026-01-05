// ==UserScript==
// @name         BlackBoard dismiss all button
// @namespace    http://www.grappigegovert.com/
// @version      0.4
// @description  Adds a 'dismiss all' button to the blackboard announcement page
// @author       grappigegovert
// @match        https://blackboard.tudelft.nl/webapps/streamViewer*streamName=alerts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14144/BlackBoard%20dismiss%20all%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/14144/BlackBoard%20dismiss%20all%20button.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

window.setTimeout(function() {
    function dismissAll(zEvent) {        
        var alerts = stream.streamViewers["alerts"];
        for (var i = alerts.streamEntries.length-1; i >= 0; i--)
        {
            var entry = alerts.streamEntries[i];
            NautilusViewService.removeRecipient(entry.itemSpecificData.actorId);
            if (entry.entryDiv)
            {
                var parent = entry.entryDiv.parentNode;
                if (parent)
                {
                    parent.removeChild(entry.entryDiv);
                    entry.entryDiv = null;
                }
            }
        }
        alerts.streamEntries.splice(0, alerts.streamEntries.length);
        page.ContextMenu.closeAllContextMenus();
    }

    document.getElementById("stream_currentFilterText_alerts").outerHTML = "<div class=\"current_filter\" id=\"stream_currentFilterText_alerts\"><span>All</span><span class=\"stream_item\" style=\"border: none; padding: 0;\"><span class=\"stream_context\"><span class=\"inlineContextMenu\" style=\"margin-left: 5px;\"><a id=\"dismissall\" class=\"browse\" role=\"button\" href=\"#\" title=\"Dismiss all\">Dismiss all</a></span></span></span></div>";
    document.getElementById("dismissall").addEventListener("click", dismissAll , false);
}, 1000);