// ==UserScript==
// @name        亚马逊
// @namespace   亚马逊
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @include 	https://www.amazon.com/dp/B08FC6MR62*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/417569/%E4%BA%9A%E9%A9%AC%E9%80%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/417569/%E4%BA%9A%E9%A9%AC%E9%80%8A.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://www.amazon.com/dp/B08FC6MR62/?coliid=I1BBC3MTR38MDM&colid=2HE0FTN5SWYUZ&psc=0&ref_=lv_ov_lig_dp_it&tag=knoa-20

var player = document.createElement('audio');
player.src = 'https://sz-download-ipv6.ftn.qq.com/ftn_handler/d965ee3cb857415f66646c80501b31d5b498831712a07163ec7526269aa3802f7df615a99146df6defef0938031ad721546b9239ee994e468f7643646de7b4d8/?fname=eventually-590.mp3'
player.preload = 'auto';

if (/\$399.99/i.test (document.body.innerHTML) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 5*1000);
}