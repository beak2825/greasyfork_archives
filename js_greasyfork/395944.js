// ==UserScript==
// @name         Disable audio processing on meet.jit.si
// @description  Automatically disables automatic gain control, noise suppression, echo cancellation and the highpass filter on Jitsi Meetings
// @namespace    greasyfork.org
// @version      1.0
// @include      *meet.jit.si*
// @downloadURL https://update.greasyfork.org/scripts/395944/Disable%20audio%20processing%20on%20meetjitsi.user.js
// @updateURL https://update.greasyfork.org/scripts/395944/Disable%20audio%20processing%20on%20meetjitsi.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loc = window.top.location.toString();
    if(loc.indexOf('config.disableAP=true')==-1){
        loc += '#config.disableAP=true'
        window.location.href = loc;
        window.location.reload(true)
    }

})();