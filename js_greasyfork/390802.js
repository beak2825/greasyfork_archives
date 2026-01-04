// ==UserScript==
// @name         shadowDomOpenMode
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      https://pan.baidu.com/play/video*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390802/shadowDomOpenMode.user.js
// @updateURL https://update.greasyfork.org/scripts/390802/shadowDomOpenMode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    Element.prototype._attachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function () {
        return this._attachShadow( { mode: "open" } );
    };

    document.getElementById('video-toolbar').querySelector('a').insertAdjacentHTML('beforebegin', '<a class="g-button" data-button-id="b1" data-button-index="1" href="javascript:document.getElementById(\'video-root\').shadowRoot.getElementById(\'html5player_html5_api\').playbackRate -= 0.5" title="速度 -0.5">速度 -0.5</a>');
    document.getElementById('video-toolbar').querySelector('a').insertAdjacentHTML('beforebegin', '<a class="g-button" data-button-id="b1" data-button-index="1" href="javascript:document.getElementById(\'video-root\').shadowRoot.getElementById(\'html5player_html5_api\').playbackRate += 0.5" title="速度 +0.5">速度 +0.5</a>');
    document.getElementById('video-toolbar').querySelector('a').insertAdjacentHTML('beforebegin', '<a class="g-button" data-button-id="b1" data-button-index="1" href="javascript:console.log(document.getElementById(\'video-root\').shadowRoot.getElementById(\'html5player_html5_api\').playbackRate);" title="当前播放速度">当前播放速度</a>');
})();