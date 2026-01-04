// ==UserScript==
// @name        截取页面长图，网页长图
// @namespace   www.miw.cn
// @description 只为了截页面保存图片，超级简单，截取页面长图，网页长图，截图不会包含本按钮。
// @match       *://*/*
// @grant       none
// @version     1.2
// @author      hello@miw.cn
// @license MIT
//
// @require https://update.greasyfork.org/scripts/457525/1134363/html2canvas%20141.js
// @downloadURL https://update.greasyfork.org/scripts/510880/%E6%88%AA%E5%8F%96%E9%A1%B5%E9%9D%A2%E9%95%BF%E5%9B%BE%EF%BC%8C%E7%BD%91%E9%A1%B5%E9%95%BF%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/510880/%E6%88%AA%E5%8F%96%E9%A1%B5%E9%9D%A2%E9%95%BF%E5%9B%BE%EF%BC%8C%E7%BD%91%E9%A1%B5%E9%95%BF%E5%9B%BE.meta.js
// ==/UserScript==
;
const cat_body=()=>{
  html2canvas(document.querySelector('body')).then(canvas=>{
  var picName = document.title || '页面截图';
	var link = document.createElement('a');
    link.download = `${picName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}
const show_tool=()=>{
  const elements = document.getElementsByTagName('*');
  let zIndex=0;
  for(e of elements){
    let s=window.getComputedStyle(e);
    if(s.zIndex && s.zIndex!='auto') {
      try{
        let t = parseInt(s.zIndex);
        zIndex = t>zIndex?t:zIndex;
      }catch(e){}
    }
  }
  var body = document.body;
  var btn = document.createElement("button");
        btn.textContent = '截长图';
        btn.classList.add('__doit');
        btn.addEventListener('click', function() {
          cat_body();
        });
  btn.style.cssText = `position:fixed;right:0;top:0;z-index:${zIndex+1};`;
  console.log(btn.style.cssText);
  body.parentNode.insertBefore(btn, body);
}

(function () {
  show_tool();

})()
;