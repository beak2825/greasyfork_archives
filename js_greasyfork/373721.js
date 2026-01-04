// ==UserScript==
// @name         Facebook "Sponsor" Block | Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Simply block Facebook Sponsor BS | Ad Blocker
// @author       NAN
// @match        https://www.facebook.com/
// @downloadURL https://update.greasyfork.org/scripts/373721/Facebook%20%22Sponsor%22%20Block%20%7C%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/373721/Facebook%20%22Sponsor%22%20Block%20%7C%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

setInterval(function(){for(var b=document.getElementsByClassName("g_1e44m9_-b0"),a=0;a<b.length;++a)b[a].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.innerHTML="";document.getElementById("pagelet_ego_pane").innerHTML='<ul class="dnate"><li><form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank"><input type="hidden" name="cmd" value="_donations"><input type="hidden" name="business" value="CVCG3YKNFLFPJ"><input type="hidden" name="lc" value="US"><input type="hidden" name="currency_code" value="USD"><input type="hidden" name="bn" value="PP-DonationsBF:btn_donate_SM.gif:NonHosted"><input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"><img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form></li><li><div id="dnatet">to Facebook "Sponser" Block</div></li></ul><style>#dnatet {padding-left:3px;}.dnate {padding-top: 7%; padding-bottom: 10%; padding-left: 9%;} .dnate li {display:inline-block;vertical-align: top;float: Left;}</style>'},
1E3);

})();