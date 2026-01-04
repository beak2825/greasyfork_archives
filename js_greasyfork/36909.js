// ==UserScript==
// @name        粤语审音配词字库播放器替换
// @namespace   yhj.com
// @include     http://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/search.php*
// @include     https://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/search.php*
// @version     1.03
// @grant       none
// @description 把文字读音播放软件从QuickTime替换为浏览器内置播放器，无须安装QuickTime即可播放读音
// @downloadURL https://update.greasyfork.org/scripts/36909/%E7%B2%A4%E8%AF%AD%E5%AE%A1%E9%9F%B3%E9%85%8D%E8%AF%8D%E5%AD%97%E5%BA%93%E6%92%AD%E6%94%BE%E5%99%A8%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/36909/%E7%B2%A4%E8%AF%AD%E5%AE%A1%E9%9F%B3%E9%85%8D%E8%AF%8D%E5%AD%97%E5%BA%93%E6%92%AD%E6%94%BE%E5%99%A8%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

var d = document;
var alist = d.querySelectorAll('a[target="sound"]');
for(var i = 0;i<alist.length;i++){
  let player = d.createElement('audio');
  player.preload = "none";
  player.src = "/Lexis/lexi-can/sound/" + alist[i].href.match(/=(.+)$/)[1] + ".wav";
  player.volume = 1;
  alist[i].parentNode.appendChild(player,alist[i]);
  alist[i].onclick = function(e){
    player.play();
    return false;
  }
}
