// ==UserScript==
// @name         CopyFixerfix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Copy Title and URL by Ctrl-C
// @author       MSG
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423697/CopyFixerfix.user.js
// @updateURL https://update.greasyfork.org/scripts/423697/CopyFixerfix.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('keydown', copyfixer, true);

    function copyfixer(event) {
        if (event.keyCode != 67) return;
        var isWin = (navigator.platform.indexOf("Win") != -1);
        var isMac = (navigator.platform.indexOf("Mac") != -1);
        if ((! isMac && ! event.ctrlKey) || (isMac && ! event.metaKey)) return;
        if (isSelected()) return;
        var crlf = isWin ? "\r\n" : "\n";
        var txt = document.title + crlf + document.location.href + crlf + crlf;
        sendMessage(txt);
    }

    function isSelected() {
        var sel = window.getSelection();
        if (sel.rangeCount <= 0) return false;
        if (sel.rangeCount > 1) return true;

        var range = sel.getRangeAt(0);
        if (! range.collapsed) return true;
        if (range.startContainer != range.endContainer) return true;
        if (range.startOffset != range.endOffset) return true;
        if (document.activeElement.tagName.toLowerCase() != "body") return true;

        return false;
    }

    function sendMessage(data) {
        //if ( request.command != "copyfixerCopy" ) return;
        const textarea = document.createElement('textarea');
        textarea.style.position = 'fixed';
        textarea.style.opacity = 0;
        textarea.value = data;

        document.body.appendChild(textarea);

        textarea.select();
        document.execCommand('Copy');
    }

})();