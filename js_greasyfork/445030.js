// ==UserScript==
// @name         [Deprecated] Advanced Mention Name Reminder
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.1
// @description  Shows the title of each advanced mention’s target entity in Summernote, next to the entity ID (or in a tooltip on hover).
// @author       Salvatos
// @match        https://kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      kanka.io
// @downloadURL https://update.greasyfork.org/scripts/445030/%5BDeprecated%5D%20Advanced%20Mention%20Name%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/445030/%5BDeprecated%5D%20Advanced%20Mention%20Name%20Reminder.meta.js
// ==/UserScript==

// Get campaign ID from URL
var campaignID = window.location.href.match(/campaign\/(\d+)/);
campaignID = campaignID[1].split("/")[0];

function addMentionName (thisEditor, entityId) {
    var apiURL = `https://kanka.io/en/campaign/${campaignID}/entities/${entityId}/json-export`;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiURL, true);
    xhr.responseType = 'json';
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                //console.log(xhr.response);
                // Set dfn title to entity name for all mentions to this ID
                thisEditor.find( "dfn[entity-id='" + entityId + "']" ).attr("title", xhr.response.data.name);
            } else {
                console.error(entityId + " returned an error: " + xhr.statusText);
                thisEditor.find( "dfn[entity-id='" + entityId + "']" ).attr("title", "Unknown");
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xhr.send(null);
}

// Wait for Summernote to initialize
$('.html-editor').on('summernote.init', function() {
    // optimization (use $this in subsequent selectors so it doesn’t search the whole DOM multiple times, but don’t create a new $(object) every time)
    let $thisEditor = $( this ).siblings(".note-editor").find(".note-editable");
    // Track IDs so we only process each once
    let entityIDs = [];

    // Wrap the entity part of mentions in <dfn>s and replace editor content
    $thisEditor.html( $thisEditor.html().replaceAll(/\[(\w+:)(\d+)(.*?)\]/g, "[<dfn entity-id='$2'>$1$2</dfn>$3]") );

    // Fetch the name of each dfn’s entity id
    $thisEditor.find( "dfn" ).each(function() {
        let entityId = $( this ).attr("entity-id");

        // If we haven’t seen this ID yet, add its title to all relevant mentions, and mark it done
        if ($.inArray(entityId, entityIDs) == -1) {
            addMentionName($thisEditor, entityId);
            entityIDs.push(entityId);
        }
    }, $thisEditor, entityIDs); // (pass $thisEditor along so the function doesn’t look for the editor in the DOM every time it’s called)
});

GM_addStyle ( `
	.note-editable dfn {
		font-style: normal;
	}
	.note-editable dfn::after {
		content: " ("attr(title)") ";
		vertical-align: super;
		font-size: 11px;
	}
    /* Uncomment this to show only a tooltip, and no superscript
    .note-editable dfn {
		text-decoration: underline dotted;
	}
    .note-editable dfn::after {
         content: "";
    }
    */
` );