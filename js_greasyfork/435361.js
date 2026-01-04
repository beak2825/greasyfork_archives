// ==UserScript==
// @name                Post image lightbox for DEV.to
// @name:hi             DEV.to के लिए पोस्ट-इमेज लाइट बॉक्स
// @name:ja             DEV.to 用ポストイメージライトボックス
// @name:ko             DEV.to 위한 이미지 후 라이트 박스
// @name:ru             Пост-имиджевый световой короб для DEV.to
// @namespace           https://sharadcodes.github.io
// @version             1.0.1
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @description         Adds lightbox to post pages so now you don't need to close tabs again & again.
// @description:hi      पोस्ट पेजों में लाइटबॉक्स जोड़ता है इसलिए अब आपको टैब को फिर से और फिर से बंद करने की आवश्यकता नहीं है।
// @description:ja      ポストページにライトボックスを追加するので、タブをもう一度閉じる必要はありません。
// @description:ko      이제 다시 탭을 닫을 필요가 없도록 페이지를 게시할 라이트박스를 추가합니다.
// @description:ru      Добавляет лайтбокс к страницам публикаций, поэтому теперь вам не нужно закрывать вкладки снова и снова.
// @author              sharadcodes
// @supportURL          https://github.com/sharadcodes/UserScripts/issues
// @match               https://dev.to/*
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/435361/Post%20image%20lightbox%20for%20DEVto.user.js
// @updateURL https://update.greasyfork.org/scripts/435361/Post%20image%20lightbox%20for%20DEVto.meta.js
// ==/UserScript==

(function(){
  var lb_style = document.createElement('style')
  lb_style.innerHTML = '#dev-to-post-dev_to_lightbox{position:fixed;z-index:10000;inset:0;background-color:rgba(0, 0, 0, 0.6);display:none;visibility:hidden}#dev-to-post-dev_to_lightbox.active{display:flex;visibility:visible;justify-content:center;align-items:center}#dev-to-post-dev_to_lightbox img{height:95vh;background-color:#333}.dev-to-lb-post-image{cursor:zoom-in}'
  
  var dev_to_lightbox = document.createElement("div");
  dev_to_lightbox.id = "dev-to-post-dev_to_lightbox";
  document.body.appendChild(dev_to_lightbox)
  document.head.appendChild(lb_style)
  
  var anchors = document.querySelectorAll('#article-show-container a');
  anchors.forEach(function(a){
    var test = a.href.includes('jpeg') || a.href.includes('jpg') || a.href.includes('png') || a.href.includes('gif')
    if(test){
      // Removing a tag
      var img = document.createElement('img');
      img.src = a.href;
      img.className = 'dev-to-lb-post-image'
      img.alt = 'Missing image (-.-)'
      a.parentNode.insertBefore(img, a.nextSibling);
      a.parentNode.removeChild(a);
      // Adding listner
      img.addEventListener("click", function(e){
        dev_to_lightbox.classList.add("active");
        var lb_img = document.createElement("img");
        lb_img.src = img.src;
        while (dev_to_lightbox.firstChild) {
          dev_to_lightbox.removeChild(dev_to_lightbox.firstChild);
        }
        lb_img.style.setProperty("cursor", "not-allowed");
        dev_to_lightbox.appendChild(lb_img);
        dev_to_lightbox.style.setProperty("cursor", "zoom-out");
      });
    }
  })
  
  dev_to_lightbox.addEventListener("click", function (e){
    if (e.target !== e.currentTarget) return;
    dev_to_lightbox.classList.remove("active");
  });
}
)()