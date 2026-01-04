// ==UserScript==
// @name        Target
// @namespace   Target
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @include 	https://www.target.com/p/playstation-5-digital-edition-console*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/417853/Target.user.js
// @updateURL https://update.greasyfork.org/scripts/417853/Target.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.target.com/p/playstation-5-digital-edition-console/-/A-81114596?clkid=8e7bbd14N33f511eb8e7c42010a246e32&lnm=81938&afid=PopFindr&ref=tgt_adv_xasd0002
var player = document.createElement('audio');
player.src = 'https://sz-download-ipv6.ftn.qq.com/ftn_handler/d965ee3cb857415f66646c80501b31d5b498831712a07163ec7526269aa3802f7df615a99146df6defef0938031ad721546b9239ee994e468f7643646de7b4d8/?fname=eventually-590.mp3'
player.preload = 'auto';

if (/\Pick it up/i.test (document.body.innerHTML) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 4*1000);
}