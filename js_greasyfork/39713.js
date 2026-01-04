// ==UserScript==
// @name 巴哈SauceNAO圖搜按鈕
// @namespace https://home.gamer.com.tw/Mogeko12345
// @version 1.0.3
// @description 在巴哈姆特的文章加入SauceNAO圖搜按鈕
// @author mogeko12345
// @match https://forum.gamer.com.tw/C.php*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/39713/%E5%B7%B4%E5%93%88SauceNAO%E5%9C%96%E6%90%9C%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/39713/%E5%B7%B4%E5%93%88SauceNAO%E5%9C%96%E6%90%9C%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function(){
  function hasClass(parent, className){
    return parent.getElementsByClassName(className).length === 0 ? false : true;
  }
  function search(){
    var article = document.getElementsByClassName("c-article FM-P2")[this.value];
    var img = hasClass(article, "photoswipe-image") ? article.getElementsByClassName("photoswipe-image") : article.getElementsByClassName("loadpic photoswipe-image-shrink");
    for(var ii = 0; ii < img.length; ii++){
     window.open("http://saucenao.com/search.php?db=999&url=" + img[ii].href, "_blank");
    }
  }
  var header = document.getElementsByClassName("c-post__header__tools");
  for(var i = 0; i < header.length; i++){
    var article = document.getElementsByClassName("c-article FM-P2")[i];
    if(hasClass(article, "photoswipe-image") || hasClass(article, "loadpic photoswipe-image-shrink")){
      var button = document.createElement("button");
      var inner = document.createElement("i");
      inner.className = "icon-font";
      inner.textContent = "搜";
      button.className = "ef-btn";
      button.value = i;
      button.addEventListener("click", search);
      button.appendChild(inner);
      header[i].appendChild(button);
    }
  }
})();