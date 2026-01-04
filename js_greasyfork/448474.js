// ==UserScript==
// @name        woiden.id Renew Simplified
// @name:zh-CN  woiden.id 续期助手
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Simplify the renew process for woiden.id
// @description:zh-cn   简化woiden.id续期操作,只需输入验证码即可
// @author      Koyang
// @match       https://woiden.id/vps-renew/
// @grant       none
// @license     AGPL License
// @downloadURL https://update.greasyfork.org/scripts/448474/woidenid%20Renew%20Simplified.user.js
// @updateURL https://update.greasyfork.org/scripts/448474/woidenid%20Renew%20Simplified.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fill text input
    document.getElementById('web_address').value='Woiden.id';
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