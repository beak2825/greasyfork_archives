// ==UserScript==
// @name        muahahaha invidious
// @namespace   muahahaha
// @version     1.0.0
// @match       https://invidious.snopyta.org/watch?*
// @grant       unsafeWindow
// @description auto click to send msg
// @downloadURL https://update.greasyfork.org/scripts/409844/muahahaha%20invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/409844/muahahaha%20invidious.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        if(unsafeWindow.$){
            console.log('muahahaha invidious is ON');

            var $ = unsafeWindow.$;

            unsafeWindow.linkWithCurrentTime = function () {
                let time = Math.floor(document.querySelector('video').currentTime);
                return location.href.replace(/\?t=\d+/, '?t=' + time).replace(/\&t=\d+/, '&t=' + time);
            };

            $('#watch-on-youtube').after(''
                + '<form class="pure-form pure-form-stacked">'
                    + '<div class="pure-control-group">'
                        + '<label>Share with time:</label>'
                        + '<input value="' + unsafeWindow.linkWithCurrentTime() + '" onclick="this.value = linkWithCurrentTime(); this.select();" id="zzzzz" style="width: 100%;" />'
                    + '</div>'
                + '</form>'
            );
        }
        else{
            console.log('muahahaha invidious is OFF');

            setTimeout(main, 504);
        }
    }

    main();
})();