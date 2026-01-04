// ==UserScript==
// @name        乐天
// @namespace   乐天)
// @description Play a sound if Ring Fit Adventure is in stock
// @version     1
// @include 	https://books.rakuten.co.jp/rb/16462860*
// @author      Xavier

// @downloadURL https://update.greasyfork.org/scripts/417568/%E4%B9%90%E5%A4%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/417568/%E4%B9%90%E5%A4%A9.meta.js
// ==/UserScript==

//LOAD LEAVE THE BROWSER ON THIS PAGE: https://books.rakuten.co.jp/rb/16462860/?bkts=1&l-id=search-c-item-text-10

var player = document.createElement('audio');
player.src = 'https://sz-download-ipv6.ftn.qq.com/ftn_handler/d965ee3cb857415f66646c80501b31d5b498831712a07163ec7526269aa3802f7df615a99146df6defef0938031ad721546b9239ee994e468f7643646de7b4d8/?fname=eventually-590.mp3'
player.preload = 'auto';

if (/\買い物かごに入れる/i.test (document.body.innerHTML) )
{
  document.title = "MATCH";
  player.play()
}
else {
setTimeout(function(){ location.reload(); }, 5*1000);
}