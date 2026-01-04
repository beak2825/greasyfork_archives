// ==UserScript==
// @name           WME Notes
// @description    Simple space to keep notes
// @namespace      https://www.waze.com/user/editor/Craig24x7
// @version        0.3
// @match           *://*.waze.com/*editor*
// @exclude         *://*.waze.com/user/editor*
// @author         Craig24x7
// @grant          GM_setValue
// @grant          GM_getValue
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/473973/WME%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/473973/WME%20Notes.meta.js
// ==/UserScript==

/* global W */
/* global I18n */
/* global $ */

(function() {

    'use strict';
    const debug = false;

    document.addEventListener("wme-ready", initWMENotes, { once: true });

    function initWMENotes() {
        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wme-note");
        var lastPage = GM_getValue("wmenotesLastPage");
        if (isNaN(lastPage)) { lastPage = 1; }
        var lastNoteValue = GM_getValue("wmenotes" + GM_getValue("wmenotesLastPage"));
        if (lastNoteValue == undefined) { lastNoteValue = ""; }
        tabLabel.innerText = '📑';
        tabLabel.title = 'WME Notes';
        tabPane.id = 'sidepanel-wme-notes';
        tabPane.innerHTML = "<h2>WME Notes";
        tabPane.innerHTML += '<input type="button" style="width:40%; font-size:1.5em; height:25px; transform:scale(-1,1);" value="&#x27A6;" id="wme-notes-prev" /><div id="wme-notes-current" style="max-width:10%; font-size:1.2em; height:25px; width:10%; overflow:hidden; display:inline-block; text-align:center; vertical-align:middle; font-weight:bold;">'+lastPage+'</div><input type="button" style="width:40%; height:25px; font-size:1.5em;" value="&#x27A6;" id="wme-notes-next" />';
        tabPane.innerHTML += '<textarea id="wme-notes" style="width:90%; height:640px; font-size:12px; padding:10px;">' + lastNoteValue + '</textarea>';
        if (lastPage < 2) { $('#wme-notes-prev').prop('disabled', true); }
        if (lastPage > 9) { $('#wme-notes-next').prop('disabled', true); }
        console.log('WME Notes: Loaded');
    }

    $(document).on('keyup', '#wme-notes', function() {
        var currentNote = parseInt($('#wme-notes-current').text(),10);
        GM_setValue('wmenotes'+currentNote, $('#wme-notes').val());
    });

    $(document).on('click', '#wme-notes-next', function() {
        var currentNote = parseInt($('#wme-notes-current').text(),10);
        var nextNote = currentNote+1;
        if (nextNote > 10) { return; }
        if (nextNote == 10) { $('#wme-notes-next').prop('disabled', true); }
        if (nextNote < 10) { $('#wme-notes-prev').prop('disabled', false); }
        $('#wme-notes-current').text(nextNote);
        $('#wme-notes').val(GM_getValue('wmenotes'+nextNote));
        GM_setValue('wmenotesLastPage', nextNote);
    });

    $(document).on('click', '#wme-notes-prev', function() {
        var currentNote = parseInt($('#wme-notes-current').text(),10);
        var prevNote = currentNote-1;
        if (prevNote < 1) { return; }
        if (prevNote == 1) { $('#wme-notes-prev').prop('disabled', true); }
        if (prevNote > 1) { $('#wme-notes-next').prop('disabled', false); }
        $('#wme-notes-current').text(prevNote);
        $('#wme-notes').val(GM_getValue('wmenotes'+prevNote));
        GM_setValue('wmenotesLastPage', prevNote);
    });

})();