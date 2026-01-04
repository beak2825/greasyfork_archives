// ==UserScript==
// @name        hax.co.id Renew Simplified
// @name:zh-CN  hax.co.id 续期助手
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Simplify the renew process for hax.co.id
// @description:zh-cn   简化hax.co.id续期操作
// @author      SemiZhang
// @match       https://hax.co.id/vps-renew/
// @icon        https://www.google.com/s2/favicons?sz=64&domain=co.id
// @grant       none
// @license     AGPL License
// @downloadURL https://update.greasyfork.org/scripts/448102/haxcoid%20Renew%20Simplified.user.js
// @updateURL https://update.greasyfork.org/scripts/448102/haxcoid%20Renew%20Simplified.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fill text input
    document.getElementById('web_address').value='hax.co.id';
    // Check agreement checkbox
    document.getElementsByName('agreement')[0].checked=true;
    // Ready to fill captcha
    document.getElementById('captcha').focus();
    // Submit when press 'Enter' after filling captcha
    document.getElementById('captcha').onkeydown=function(e){
        var keyNum=window.event ? e.keyCode :e.which;
        if(keyNum==13){
            document.getElementsByName('submit_button')[0].click();
        }
    };
})();