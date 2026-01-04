// ==UserScript==
// @name         mobileConnectionHyve
// @namespace    https://ete.yr-lejeu.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.jeuxvideo.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/32129/mobileConnectionHyve.user.js
// @updateURL https://update.greasyfork.org/scripts/32129/mobileConnectionHyve.meta.js
// ==/UserScript==

var link = [

"http://www.gbonus.fr/campaign/wa7gsQ/sa3axClODB ",
"http://www.gbonus.fr/campaign/wa7gsQ/Ais0gMLT6d ",
"http://www.gbonus.fr/campaign/wa7gsQ/dc3SvELxX0 ",

"http://www.gbonus.fr/campaign/wa7gsQ/UpHLAvmqUo ",
"http://www.gbonus.fr/campaign/wa7gsQ/BW3iYBgwRz" ,


"http://www.gbonus.fr/campaign/wa7gsQ/pnYM4mmv8C",
"http://www.gbonus.fr/campaign/wa7gsQ/nlt5RtuCfT",
"http://www.gbonus.fr/campaign/wa7gsQ/vrfsjrnsdU",

"http://www.gbonus.fr/campaign/wa7gsQ/AtqL416T8t",
"http://www.gbonus.fr/campaign/wa7gsQ/aHR7utEeML" ,
"http://www.gbonus.fr/campaign/wa7gsQ/UnBZBqHRZe" ,

"http://www.gbonus.fr/campaign/wa7gsQ/OQ0xHDbe1I",
"http://www.gbonus.fr/campaign/wa7gsQ/kDY7BEW0zI",
"http://www.gbonus.fr/campaign/KZwaPb/8GpUIdkNXg",
"http://www.gbonus.fr/campaign/wa7gsQ/rdT9RpAB15",
"http://www.gbonus.fr/campaign/wa7gsQ/dCZDgZtgCk",
"http://www.gbonus.fr/campaign/wa7gsQ/8vRlOzUxsj"] ;

setInterval(function(){ 

var b = GM_getValue("end", 0) ;
if(b=="end") {

    GM_setValue("end", ok);
var a = GM_getValue("value", 0) ;

if (a>16){a=0 ; }



window.open(link[a]);
//alert(link[a]) ; 
a++ ; 


GM_setValue("value", a);
}
    }, 3000);
