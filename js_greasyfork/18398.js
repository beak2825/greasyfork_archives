// ==UserScript==
// @name        Hide applause-tutorial on pixiv
// @name:ja     Hide applause-tutorial on pixiv
// @namespace   https://greasyfork.org/ja/users/24052-granony
// @description Just hide applause-tutorial on pixiv.
// @description:ja pixiv の拍手機能のチュートリアル表示を抑制します．
// @include     http://www.pixiv.net/*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18398/Hide%20applause-tutorial%20on%20pixiv.user.js
// @updateURL https://update.greasyfork.org/scripts/18398/Hide%20applause-tutorial%20on%20pixiv.meta.js
// ==/UserScript==
(function(){
  var at=document.getElementById("applause_tutorial");
  
  var remove =function(){
    at.style.display = "none";
    at.style.visibility = "hidden";
    at.setAttribute("class","");
  }
  
  var wait = function(){
    if(at.getAttribute("class")=="visible"){
      remove(at);
    }else{
      setTimeout(wait,500);
    }
  }
  wait();
})();