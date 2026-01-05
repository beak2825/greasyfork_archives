// ==UserScript==
// @name          reklamvpn
// @description   reklam
// @version       1.0
// @namespace     https://openuserjs.org/users/Dio1453
// @include       *trafficmonsoon.com/*
// @include       *useclix.com/*
// @include       *lotraffic.com/*
// @include       *littlebux.com/*
// @include       *wsbux.com/*
// @include       *lucrebux.com.br/*
// @include       *poproche.com/*
// @include       *takiplekazan.net/*
// @include       *extratraffic.net/*
// @include       *ebpaidrev.com/*
// @include       *plutonbux.com/*
// @exclude       *blogger.com/*
// @exclude       *google.com/*
// @exclude       */clixgrid.php?do=surf&x=*
// @exclude       */ptcwall.php
// @exclude       */clixwall.php
// @exclude       *crowdflower.com/*
// @exclude       *gelirkapisi.com/*
// @exclude       *matomy.com/*
// @exclude       *dizibox.com/*
// @exclude       *littlebux.com/viewads
// @exclude       *cinstaller.com/*
// @exclude       *cc.cc/*
// @exclude       *skybtc.com/*
// @exclude       *apinio.com/*
// @exclude       *myptc4life.com/*
// @exclude       *ultimategpt.net/*
// @exclude       *epay.info/*
// @exclude       *funcaptcha.com/*
// @exclude       *samabtc.com/*
// @downloadURL https://update.greasyfork.org/scripts/14278/reklamvpn.user.js
// @updateURL https://update.greasyfork.org/scripts/14278/reklamvpn.meta.js
// ==/UserScript==

/*
$("#preloader").remove();
$(".banner").remove();
$("#timeframe").remove();
*/

//-----------------iFrame Killer---------------------

while((el=document.getElementsByTagName('iframe')).length){el[0].parentNode.removeChild(el[0]);}
while((el1=document.getElementsByTagName('timeframe')).length){el1[0].parentNode.removeChild(el1[0]);}



//-----------------Anti Focus------------------------

document.hasFocus = function () {return true;};
