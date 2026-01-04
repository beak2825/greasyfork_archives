// ==UserScript==
// @name         V509Emoji
// @namespace    //
// @author       V509Cassiopeiae
// @description  Emoji
// @include      http://www.jeuxvideo.com/forums*
// @version      1
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/32534/V509Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/32534/V509Emoji.meta.js
// ==/UserScript==

var arr = ["?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?","?"];

(function() {
    'use strict';
    var emoji = document.createElement('button'),
        div = document.createElement('div');
    document.querySelector('.jv-editor-toolbar').appendChild(div);
    for (i = 0; i < arr.length; i++) {
        var span = document.createElement('span');
        div.appendChild(span);
        span.innerHTML += arr[i];
        span.onclick = function() {
            document.querySelector('.area-editor').innerHTML+= this.innerHTML;
        };
    }
})();
