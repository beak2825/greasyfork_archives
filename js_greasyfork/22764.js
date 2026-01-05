// ==UserScript==
// @name         HTML5 Player for Ningmeng
// @namespace    userscripts@dearrrfish
// @version      0.1
// @description  Replace flash player with HTML5 audio tags for Ningmeng.name.
// @author       dearrrfish
// @homepage     https://github.com/dearrrfish/my-userscripts
// @match        http://www.ningmeng.name/?p=*
// @match        http://www.ningmeng.name
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22764/HTML5%20Player%20for%20Ningmeng.user.js
// @updateURL https://update.greasyfork.org/scripts/22764/HTML5%20Player%20for%20Ningmeng.meta.js
// ==/UserScript==

(function(ajaxOpen) {
    'use strict';
    var replaceFlashPlayer = function() {
        var flashObjects = document.getElementsByTagName('object');
        while(flashObjects.length) {
            var obj = flashObjects[0];
            var embed = obj.getElementsByTagName('embed')[0];
            if (embed && embed.src) {
                var audio = document.createElement('audio');
                audio.src = embed.src.match(/mp3=[^&]*/)[0].slice(4);
                audio.controls = true;
                audio.autoplay = false;

                obj.parentNode.replaceChild(audio, obj);
            }
        }
    };

    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            setTimeout(replaceFlashPlayer, 500);
        })
        ajaxOpen.apply(this, arguments);
    };

    replaceFlashPlayer();

})(XMLHttpRequest.prototype.open);
