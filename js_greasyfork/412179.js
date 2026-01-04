// ==UserScript==
// @name         MXM Lyrics Copier
// @version      0.1
// @description  Shift + C to copy the text lyrics on MXM website by frontend (Only the original version, translation not supported)
// @author       XMAnon
// @match        https://www.musixmatch.com/*
// @grant        none
// @namespace https://greasyfork.org/users/666548
// @downloadURL https://update.greasyfork.org/scripts/412179/MXM%20Lyrics%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/412179/MXM%20Lyrics%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";// Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");// Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }
    function getMXM(){
        var textLyricNodes = document.querySelectorAll("#site .mxm-lyrics__content");
        if (!textLyricNodes) {
                console.warn("lyric not found");
                return;}
        var lyricBlock = textLyricNodes.length;
        var textLyric ='';
        for(var i =0;i<lyricBlock;i++){
            textLyric = textLyric + '\n' + textLyricNodes[i].innerText;
        }
            copyToClipboard(textLyric);
            console.log(textLyric);
    }
    document.onkeydown = function(oEvent) {//Shift + C to trigger event
        oEvent = oEvent || window.oEvent;
        //get keyCode value
        var nKeyCode = oEvent.keyCode // || oEvent.which || oEvent.charCode;
        //get "shift" event property
        var bShiftKeyCode = oEvent.shiftKey //|| oEvent.metaKey;
        if(nKeyCode == 67 && bShiftKeyCode) {//shift + c :  shift(shiftKey) c(keyCode = 67; which = 67; charCode = 0 ) x(keyCode = 88;which = 88; charCode = 0 )
            //doSomeThing...
            //alert('you punched shift + c');
            getMXM();
        }
    }
})();