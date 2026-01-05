// ==UserScript==
// @name         JS Bin Search
// @version      0.2
// @description  Add find and replace features in jsbin.com
// @author       himalay
// @namespace    https://himalay.com.np
// @include     *://jsbin.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/20383/JS%20Bin%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/20383/JS%20Bin%20Search.meta.js
// ==/UserScript==
//
// The keybindings
// ===============
// Ctrl-F / Cmd-F : Start searching
// Ctrl-G / Cmd-G : Find next
// Shift-Ctrl-G / Shift-Cmd-G : Find // previous
// Shift-Ctrl-F / Cmd-Option-F : Replace
// Shift-Ctrl-R / Shift-Cmd-Option-F : Replace all

(function () {
    ['//codemirror.net/addon/dialog/dialog.js', '//codemirror.net/addon/search/search.js'].forEach(function(scriptURL){
        document.body.appendChild(Object.assign(document.createElement('script'), {
            type: 'text/javascript',
            src: scriptURL
        }));
    });
})();

GM_addStyle('.CodeMirror-dialog{position:absolute;left:0;right:0;background:inherit;z-index:15000;padding:.1em .8em;overflow:hidden;color:inherit}' +
            '.CodeMirror-dialog-top{border-bottom:1px solid #eee;top:0}' +
            '.CodeMirror-dialog-bottom{border-top:1px solid #eee;bottom:0}' +
            '.CodeMirror-dialog input{border:none;outline:0;background:0 0;width:20em;color:inherit;font-family:monospace}' +
            '.CodeMirror-dialog button{font-size:70%}');
