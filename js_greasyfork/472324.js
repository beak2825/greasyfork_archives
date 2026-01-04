// ==UserScript==
// @name         Better lootlog alerts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Zmienia wygląd Alertów Lootloga od Groove Armady.
// @author       Vigellal
// @match        https://*.margonem.pl/
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=margonem.pl
// @downloadURL https://update.greasyfork.org/scripts/472324/Better%20lootlog%20alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/472324/Better%20lootlog%20alerts.meta.js
// ==/UserScript==

(function() {
    'use strict';


$(`<style>


.cll-alert-content, .cll-alert {
  font-family: Arimo,Calibri,Segoe,"Segoe UI",Optima,Arial,sans-serif;
  font-size: 12.8px;
  cursor: url('https://www.margonem.pl/_i/pl/cursor/1.png?v=6'), pointer;
}

.cll-alert-content{
   background:none !important;
   color:white !important;
}

.cll-alert {
   background:rgba(0,0,0,.5) !important;
   color: white !important;
   border: 1px solid silver !important;
   border-radius: 5px !important;
}

.cll-alert-header{
   color: beige;
   font-size: 11px;
}

#cll-notify, #cll-confirm, #cll-reply{
    background-image: linear-gradient(to top,#12210d,#396b29);
    box-shadow: inset 0 0 1px 1px #cecece,inset 0 0 0 2px #0c0d0d;
    border-image: url(../img/gui/btn-small-inset.png?v=1690873569667) 15 repeat;
    font-family: Arimo,Calibri,Segoe,"Segoe UI",Optima,Arial,sans-serif;
    font-size: 13px;
    border-color: rgba(255,240,0,.5);
    cursor: url('https://www.margonem.pl/_i/pl/cursor/5.png?v=6'), pointer;
    color: #E6D6BF;
    border-radius: 6px;
}

#cll-ok, #cll-close-all{
    background-image: linear-gradient(to top, #310b0b, #831f1f);
    box-shadow: inset 0 0 1px 1px #cecece, inset 0 0 0 3px #0c0d0d;
    border-image: url(../img/gui/btn-small-inset.png?v=1690873569667) 15 repeat;
    font-family: Arimo,Calibri,Segoe,"Segoe UI",Optima,Arial,sans-serif;
    font-size: 13px;
    border-color: rgba(255,240,0,.5);
    cursor: url('https://www.margonem.pl/_i/pl/cursor/5.png?v=6'), pointer;
    color: #E6D6BF;
    border-radius: 6px;
}
#cll-ok:hover, #cll-notify:hover, #cll-confirm:hover, #cll-reply:hover, #cll-close-all{
    background: #2b2b2b;
}


.cll-timer.cll-timer-highlighted {
   background: rgb(31 25 118 / 50%);
}


.cll-timer{
    font-family: Arimo,Calibri,Segoe,"Segoe UI",Optima,Arial,sans-serif;
    margin: 1px;
    display: grid;
    background: rgba(86,86,86,.5);
    border: 1px solid rgb(19, 55, 62);
    cursor: pointer;
    box-shadow: 0 0 0 1px rgba(255,255,255,.23) inset, 0 0 0 1px rgba(0,0,0,.55);
    text-shadow: 1px 1px 2px black;
    width: 40px;
    height: auto;
    text-align: center;
}


.cll-timer-monster {
    color: white;
    margin-bottom: 5px;
    margin-top: 2px;
    pointer-events: none;
    font-weight: bold;
    font-size: 10px
}

.cll-timer-time {
    font-size: 11px;
    margin-bottom: 2px
}
</style>`).appendTo('html');


})();