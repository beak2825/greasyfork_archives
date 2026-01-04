 // ==UserScript==
// @name         LL do Purple NI
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Motyw NI
// @author       Mateoo
// @match        https://*.margonem.pl/
// @match        https://*.margonem.com/
// @icon
// @downloadURL https://update.greasyfork.org/scripts/525986/LL%20do%20Purple%20NI.user.js
// @updateURL https://update.greasyfork.org/scripts/525986/LL%20do%20Purple%20NI.meta.js
// ==/UserScript==
(function() {
  'use strict';
if (getCookie('interface') === 'ni'){
  $(`<style>

/*Import czcionek*/
 @import url('https://fonts.cdnfonts.com/css/Futura');
 @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&display=swap');
 @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');



.cll-alert{border: 2px solid #310853;box-shadow: 0px 0px 1px 2px #4c2985 !important;background: #110b17; color: #7540a1;font-family: 'Futura' !important;text-shadow: 0 0 0.3px #9174c1;}
.cll-alert button{background: #4c287b;box-shadow: 0px 0px 2px 2px #4d425c;margin-right: 6px;color: #cba1e2;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
.cll-alert button:hover{background: #a57cc1;color: white;}
.cll-min-lvl, .cll-max-lvl{background: #887198;color: white;text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
.gargonem-current-cll.gargonem-cll-transparent .cll-timer {background: #1f043470 !important;}
.cll-timer{background: #1f043470;border: 1px solid rgb(38 4 70);box-shadow: 2px 2px 5px rgb(41 21 59 / 70%);}
.cll-timer-monster{color:rgb(186 152 255);}
.gargonem-cll-list .gargonem-cll-button.selected, .gargonem-cll-list .gargonem-cll-button:hover{background: #d8bcffb0;}
.gargonem-cll-list .gargonem-cll-button{background: #a26fe973;}
body.cll-catcher-portal-active .gargonem-cll-list{color: #edd1fd;text-shadow: -1px -1px 0 #000000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;}
.cll-menu{background: #d8bcffb0;}
.cll-menu-item{border-top: 1px solid #3e0062;border-bottom: 1px solid #3e0062;color: #2b033c;font-weight: bold;}
.cll-menu-item:hover{background: #694685;border-color: #7719ae;font-weight: bold;color: #e2dae8;}
.cll-alert-content{background: #3b2e53;color: #decaef;text-shadow: -1px 1px black;}
</style>`).appendTo('body');
}
})();