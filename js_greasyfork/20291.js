// ==UserScript==
// @name        Monza
// @namespace   http://nokilab.com
// @include     http://seiga.nicovideo.jp/my/clip/*
// @version     1.0
// @description A
// @downloadURL https://update.greasyfork.org/scripts/20291/Monza.user.js
// @updateURL https://update.greasyfork.org/scripts/20291/Monza.meta.js
// ==/UserScript==

(function(){
  main();
})();

function main(){
  
  var elements = document.getElementsByClassName("illust_list_img");
  //console.log(elements);
  
  for(var i=0;i<elements.length;i++){
    var center = elements[i].children[0];
    var ancer = center.children[0];
    var img = ancer.children[0];
    //console.log(img);
    
    elements[i].style.backgroundColor = "#EEE"
    center.style.width = "auto";
    center.style.height = "auto";
    ancer.style.width = "auto";
    ancer.style.height = "auto";
    img.style.width = "auto";
    img.style.height = "auto";
    img.style.maxWidth  = "100%";
    img.style.maxHeight = "100%";
    
    var imgUrl = ancer.getAttribute("href");
    //console.log(imgUrl);
    
    var imgId = "";
    for(var j=imgUrl.length;j>=0;j--){
      if(imgUrl.charAt(j)=="m"){
        break;
      }
      imgId += imgUrl.charAt(j);
    }
    imgId = imgId.split("").reverse().join("");
    //console.log(imgId);
    img.setAttribute("src","http://lohas.nicoseiga.jp/thumb/"+imgId+"i");
    ancer.setAttribute("href","http://seiga.nicovideo.jp/image/source/"+imgId);
  }
  
  
  
}