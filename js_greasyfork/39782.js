// ==UserScript==
// @name 巴哈浮動影片
// @namespace https://home.gamer.com.tw/Mogeko12345
// @version 1.0.1
// @description 在巴哈姆特影片加入浮動視窗按鈕
// @author mogeko12345
// @match https://forum.gamer.com.tw/C.php*
// @grant unsafeWindow
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @require https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @downloadURL https://update.greasyfork.org/scripts/39782/%E5%B7%B4%E5%93%88%E6%B5%AE%E5%8B%95%E5%BD%B1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/39782/%E5%B7%B4%E5%93%88%E6%B5%AE%E5%8B%95%E5%BD%B1%E7%89%87.meta.js
// ==/UserScript==

(function(){
  var style = document.createElement("style");
  style.textContent = ".float-video{position:fixed;left:5px;bottom:5px;width:16vw;height:9vw;padding-bottom:0%;z-index:100;}.float-button{position:absolute;top:0px;right:0px;width:26px;height:26px;font-size:24px;font-weight:bold;color:#ffffff;opacity:0.9;background-color:transparent;border:0;}.float-video .float-button{width:20px;height:20px;font-size:18px;}";
  document.getElementsByTagName("head")[0].appendChild(style);

  var current = null;

  function clickButton(){
    var parent = this.parentElement;
    if(parent.classList.contains("float-video")){
      parent.classList.toggle("float-video");
      this.textContent = (this.textContent === "↙") ? "↗" : "↙";
      current = null;
    }
    else{
      if(current){
        current.parentElement.classList.toggle("float-video");
        current.textContent = (current.textContent === "↙") ? "↗" : "↙";
      }
      parent.classList.toggle("float-video");
      this.textContent = (this.textContent === "↙") ? "↗" : "↙";
      current = this;
    }
  }

  function addButton(node){
    var n = node[0];
    var button = document.createElement("button");
    button.className = "float-button";
    button.textContent = "↙";
    button.addEventListener("click", clickButton);
    n.appendChild(button);
  }

  waitForKeyElements(".videoWrapper.video-youtube", addButton);
})();
