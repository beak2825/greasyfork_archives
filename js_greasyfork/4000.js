// ==UserScript==
// @name         LeekWars editor dark theme
// @namespace    leekwars-editor
// @version      0.9.18
// @match        http://leekwars.com/editor
// @description  This script change the color scheme of editor in leekwars.com game
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_addStyle
// @copyright    2014+, Sacha Stafyniak
// @downloadURL https://update.greasyfork.org/scripts/4000/LeekWars%20editor%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/4000/LeekWars%20editor%20dark%20theme.meta.js
// ==/UserScript==

var themeStyles = ".dark .CodeMirror-gutter {background-color: #2B2B2B !important;}";
themeStyles += ".dark .CodeMirror-linenumber{color: #6E674C !important;}";
themeStyles += ".dark .CodeMirror-lines{background-color: #232323 !important}";
themeStyles += ".dark .activeline.CodeMirror-linebackground{background-color: #303030 !important;}";
themeStyles += ".dark .cm-comment {color: #A78E53 !important;}";
themeStyles += ".dark .cm-keyword {color: #4E6875 !important;font-weight: bold !important;}";
themeStyles += ".dark .CodeMirror{color: #696968 !important;border: 1px solid #222 !important;background: none !important;}";
themeStyles += ".dark .cm-lsfunc{color: #FFFFFF; font-style: italic !important;}";
themeStyles += ".dark .cm-variable {color: #A9A9A8 !important;}";
themeStyles += ".dark .cm-variable-2 {color: #A9A9A8 !important;}";
themeStyles += ".dark .cm-lsconst {color: #A9A9A8 !important;}";
themeStyles += ".dark .cm-def {color: #A9A9A8 !important;}";
themeStyles += ".dark .CodeMirror-matchingbracket {color: #B9B9B9 !important; font-weight: bold !important;}";
themeStyles += ".dark .cm-number {color: #709254 !important;}";
themeStyles += ".dark .cm-string {color: #709254 !important;}";
themeStyles += ".dark .cm-error{color: #FF901E !important;font-style: italic !important;font-weight: bold !important;}";
themeStyles += ".dark .CodeMirror-gutters{left: 1px !important;border: medium none !important;}";
themeStyles += ".dark .CodeMirror-cursor{color: #FFFFFF !important;border-left: 1px solid white !important;}";
themeStyles += ".dark .cm-lsfunc {color: #FFFFFF !important; font-style: italic !important;}";

themeStyles += ".dark .CodeMirror-hints { border: 1px solid #232323 !important; background: #303030 !important; }";
themeStyles += ".dark .CodeMirror-hint { color: #999 !important; }";
themeStyles += ".dark .CodeMirror-hint-active { background: #4E6875 !important; color: white !important; }";
themeStyles += ".dark .CodeMirror-selected, .dark .CodeMirror-focused .CodeMirror-selected { background: #444 !important; }";

themeStyles += ".dark #ai-list { background-color: #202020 !important;border: solid 1px #202020 !important;border-right: 0px !important;}";
themeStyles += ".dark #ai-list .ai { padding: 3px 0px 1px 3px !important; margin: 0px !important; border-right: 2px solid #202020 !important;}";
themeStyles += ".dark #ai-list .ai:hover {background: #2b2b2b; !important; color: #999 !important; border-right: 2px solid #2b2b2b !important;}";
themeStyles += ".dark #ai-list .ai.selected {background: #38393A; !important; color: #777 !important; border: 0px !important; border-right: 2px solid #04AADB !important;}";
themeStyles += ".dark #ai-list .ai.modified {color: #A78E53 !important;}";


themeStyles += ".dark #ai-stats { padding: 8px !important;  margin: 0px !important; margin-top: 2px !important; background-color: #202020 !important; color: #777 !important; }";
themeStyles += ".dark #ai-stats span { color: #709254 !important; }";

themeStyles += ".dark #ai-name { color: #DDD !important; padding-top: 7px !important; }";


themeStyles += ".dark .button { background: #404040 !important; color: #888 !important; border: solid 1px #393939 !important; -webkit-box-shadow: 0 3px 0 #393939 !important; -moz-box-shadow: 0 3px 0 #393939 !important; box-shadow: 0 3px 0 #393939 !important; margin: 5px 5px 10px 5px !important;;}";

themeStyles += ".modal-dark {position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: black; opacity: 0.8; z-index: 6;}";
console.log(themeStyles);
GM_addStyle(themeStyles);

var $editors = jQuery("#editors");
var $aiList = jQuery("#ai-list");
var $body = jQuery("body");
var $modal = jQuery("<div>")
	.addClass("modal-dark");

var theme = "light";
var $toggleThemeButton = jQuery('<div>', 
    {
        "id": "toggle-theme-button"
    })
    .text("Theme dark")
    .addClass("button")
    .on("click", function() {
        if (theme == "light") {
            $toggleThemeButton.text("Theme light");
            $body.prepend($modal);
            theme = "dark";
        }
        else {
            $toggleThemeButton.text("Theme dark");
            $modal.detach();
            theme = "light";
        }
        $body.toggleClass("dark");
        
        return false;
    });




jQuery("#buttons").prepend($toggleThemeButton);