// ==UserScript==
// @name        大喜利PHP 残り時間補正
// @namespace   https://greasyfork.org/ja/scripts/14145
// @description 大喜利PHPで予定締め切り時刻通りに残り時間を表示
// @include     http://oogiri.symphonic-net.com/one/select.php*
// @include     http://oogiri.symphonic-net.com/special/select.php*
// @include     http://oogiri.symphonic-net.com/cs_sekigahara/*/select.php*
// @version     0.1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14145/%E5%A4%A7%E5%96%9C%E5%88%A9PHP%20%E6%AE%8B%E3%82%8A%E6%99%82%E9%96%93%E8%A3%9C%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/14145/%E5%A4%A7%E5%96%9C%E5%88%A9PHP%20%E6%AE%8B%E3%82%8A%E6%99%82%E9%96%93%E8%A3%9C%E6%AD%A3.meta.js
// ==/UserScript==

(function(){
  if(document.getElementById("tokei")||document.getElementsByName("tokei")[0]) {
    var timeNode = document.createElement("script");
    timeNode.setAttribute("type","text/javascript");
    timeNode.innerHTML = `
      <!--
      (function(){
        var left_t;
        var end_t = Date.now()+Number(lefttime)*1000;
        var intervalID = setInterval(function () {
          if (lefttime >= 0) {
            left_t = end_t - Date.now();
            lefttime = Math.floor(left_t/1000);
          } else
            clearInterval(intervalID);
        }, 1000);
      })();
      -->`;
    document.head.appendChild(timeNode);
  }
  if(location.pathname.match(/\/cs_sekigahara\/..*\/select\.php.*/)) {
    var reloadNode = document.getElementsByTagName("script");
    for(var i=0; i<reloadNode.length; i++) {
      if(reloadNode[i].innerHTML.indexOf("window.location.reload(true)")>=0) {
        var attr = document.body.getAttribute("onload").split("(");
        document.body.setAttribute("onload", "");
        var reloadClone = document.createElement("script");
        reloadClone.setAttribute("type", "text/javascript");
        reloadClone.innerHTML = `${
          reloadNode[i].innerHTML
          .replace("window.location.reload\(true\)", "location.href = location")
          .replace("-->", attr[0]+"(); // -->")
        }`;
        document.head.appendChild(reloadClone);
        break;
      }
    }
  }
})();