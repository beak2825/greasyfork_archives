// ==UserScript==
// @version 1.0
// @name           RuCiWanRemoveAD
// @namespace     RuCiWanRemoveAD
// @author	      fengguan.ld@gmail.com
// @description    循环执行删除如此玩页面上太多的广告区, RuCiWanRemoveAD tool
// @include        https://www.ruciwan.com/forum.php?*
// @include        https://www.ruciwan.com/thread-*.html
// @encoding       utf-8
// @grant          unsafeWindow
// @license FG developer
// grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/495764/RuCiWanRemoveAD.user.js
// @updateURL https://update.greasyfork.org/scripts/495764/RuCiWanRemoveAD.meta.js
// ==/UserScript==
//

window.onload = function(){
  console.log("暴力猴脚本宣称: 页面加载完成====》onload");

  setInterval(function() {
    document.body.style.background = 'none';
    var dom = document.querySelector('.a_mu');
    document.querySelector("#hd > div.wp > div > h2").style.display="none";
    dom.parentNode.removeChild(dom);
      //console.log("这条信息会每隔1秒显示一次");
  }, 200);
}



   //setInterval(function() {
   //    var currentTime = new Date();
   //    $('#scbar_txt').text(currentTime.toLocaleTimeString());
   //}, 1000);