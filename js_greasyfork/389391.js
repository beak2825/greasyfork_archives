// ==UserScript==
// @name         YT Channel Query Fix
// @namespace    youtube.scripts
// @version      1.8.1
// @description  Hide videos not belonging to the channel when searching in it.
// @match        *.youtube.com/user/*/search*
// @match        *.youtube.com/channel/*/search*
// @match        *.youtube.com/c/*/search*
// @downloadURL https://update.greasyfork.org/scripts/389391/YT%20Channel%20Query%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/389391/YT%20Channel%20Query%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INTERVAL=1000;

    const channel=document.querySelector('ytd-channel-name').innerText.trim()
    var index=1;
    setInterval(function(){
        var ns=document.querySelectorAll('#contents');
        for(let i=index;i<ns.length;i++){
                let name = ns[i].querySelector('#metadata a').innerText.trim();
                if(!ns[i].hidden && name!=channel) {
                    console.log('hide', name);
                    ns[i].hidden=true;
                }
        }
        index=ns.length;
    },INTERVAL);
})();