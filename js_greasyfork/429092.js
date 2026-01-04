// ==UserScript==
// @name                Twitter video loop
// @namespace           https://greasyfork.org/en/users/791693-danielajones86ny
// @version             0.1.0
// @description         Make twitter videos autoplay looped with sound, at highest video quality
// @author              daniel a jones
// @match               https://twitter.com/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/429092/Twitter%20video%20loop.user.js
// @updateURL https://update.greasyfork.org/scripts/429092/Twitter%20video%20loop.meta.js
// ==/UserScript==
/* jshint esversion:6 */

(function() {
    'use strict';
    
    // default Config
    const SET_VOLUME = 1.0; // 0.0 to 1.0
    const SET_LOOPED = true; 
    const SET_MUTED = false; 
    
    
    
    
    
    var realOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function() {
        var url = arguments['1'];
        var reg = /^https:\/\/video\.twimg\.com\/.+m3u8\?.*tag=/i;
        if (reg.test(url)) {
            this.addEventListener('readystatechange', function(e) {
                if ( this.readyState === 4 ) {
                    var originalText = e.target.responseText;
                    var lines = originalText.split(new RegExp('\\r?\\n'));
                    var modifiedText = lines[0] + '\r\n' 
                                    + lines[1] + '\r\n' 
                                    + lines[lines.length - 3] + '\r\n' 
                                    + lines[lines.length - 2] + '\r\n';
                    Object.defineProperty(this, 'response',     {writable: true});
                    Object.defineProperty(this, 'responseText', {writable: true});
                    this.response = this.responseText = modifiedText;
                }
            });
        }
        return realOpen.apply(this, arguments);
    };

    // add a mark helps identify if userscript loaded successfully
    var disableHQ = localStorage.getItem('vqfft-disablehq');
    if(!disableHQ) {
        var mark = document.createElement('button');
        mark.innerText = 'HQ';
        mark.style = "position: fixed;right: 5px;top: 5px;color: white;border-width: 0px;border-radius: 5px;background-color: gray;opacity: 0.5;";
        mark.onclick = function() {
            if(confirm('Do not display HQ mark anymore?')){
                localStorage.setItem('vqfft-disablehq', 'true');
                mark.remove();
            }
        };
        document.body.appendChild(mark);
    }

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var observer = new MutationObserver(function(mutations, observer) {
        // fired when a mutation occurs

        const player = document.querySelectorAll('video');
        for (let i=0; i < player.length; i++) {
            player[i].setAttribute("autoplay","");
            player[i].loop = SET_LOOPED
            player[i].muted = SET_MUTED
            player[i].volume = SET_VOLUME
        }

    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(document, {
        attributes: false,
        childList: true,
        characterData: false,
        subtree: true
        //...
    });
})();

