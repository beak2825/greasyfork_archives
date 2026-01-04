// ==UserScript==
// @name         atcoder-keyboard-shortcuts
// @namespace    https://halmk.github.io/
// @version      0.1
// @description  atcoder keyboard shortcuts
// @author       springroll
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant         none
// @require       https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @downloadURL https://update.greasyfork.org/scripts/397575/atcoder-keyboard-shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/397575/atcoder-keyboard-shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var copySample = function(index) {
        window.getSelection().removeAllRanges();
        try {
            var range = document.createRange();
            range.selectNode($('#pre-sample'+(2*(index-1))).get(0));
            window.getSelection().addRange(range);
            document.execCommand('copy');
        } catch (err) {
            console.log(err);
        }
        alert("Copied Sample" + index + ".");
        window.getSelection().removeAllRanges();
    };

    var pasteSourceCode = function() {
        try {
            var pasteArea = document.getElementsByTagName('textarea')[0];
            pasteArea.focus();
            document.execCommand('paste');
        } catch (err) {
            console.log(err);
        }
    };

    var submitCode = function() {
        try {
            var btn = document.getElementById('submit');
            btn.click();
        } catch (err) {
            console.log(err);
        }
    };

    hotkeys('shift+1,shift+2,shift+3,shift+4,shift+5', function (event, handler){
        switch (handler.key) {
            case 'shift+1':
                copySample(1);
                break;
            case 'shift+2':
                copySample(2);
                break;
            case 'shift+3':
                copySample(3);
                break;
            case 'shift+4':
                copySample(4);
                break;
            case 'shift+5':
                copySample(5);
                break;
            default: alert(event);
        }
    });

    hotkeys('shift+a, cmd+shift+s', function (event, handler) {
        switch (handler.key) {
            case 'shift+a':
                pasteSourceCode();
                break;
            case 'cmd+shift+s':
                submitCode();
                break;
            default: alert(event);
        }
    });
})();
