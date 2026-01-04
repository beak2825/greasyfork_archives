// ==UserScript==
// @name         spent time improvements
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  Enlarge the description space for time spent in myjetbrains.com. Also makes the description box fill the user adjustable area.
// @author       Patrick Moon
// @match        https://*.myjetbrains.com/youtrack/*
// @icon         https://www.google.com/s2/favicons?domain=myjetbrains.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/437712/spent%20time%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/437712/spent%20time%20improvements.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}

//new way for the updated interface (May 2023)
addGlobalStyle('.editorArea__e59 { min-height: 8em !important; }');
addGlobalStyle('.ring-ui-island_fdc4 { min-width: 60em !important; min-height: 20em !important; }');
addGlobalStyle('.editorArea__e59 > div { height: 7em !important; }');
addGlobalStyle('.editorArea__e59 > div > p { height: 7em !important; }');

//code for the old style of YouTrack
(function() {
    'use strict';
    $(document).ready(function(){
        var observer = new MutationObserver(function(mutations) {
            //allows the spent time comment to fill the space.
            if($(".yt-issue-stream-work__table_edit-cell_comment > yt-editor > .yt-issue-stream-work__wysiwyg > .prosemirror__afc > .ProseMirror ").length > 0){
                $(".yt-issue-stream-work__table_edit-cell_comment > yt-editor > .yt-issue-stream-work__wysiwyg").attr('style', function(i,s) { return (s || '') + "min-height: 8em !important;" });
                $(".yt-issue-stream-work__table_edit-cell_comment > yt-editor > .yt-issue-stream-work__wysiwyg > .prosemirror__afc > .ProseMirror ").attr('style', function(i,s) { return (s || '') + "height: auto !important;" });
            }
        });
        observer.observe(document.querySelector("body"), {
            subtree: true,
            childList: true,
            attributes: false,
            characterData: false,
            attributeOldValue: false,
            characterDataOldValue: false
        });
    });
})();