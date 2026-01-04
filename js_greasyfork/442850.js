// ==UserScript==
// @name         蓝湖前端UI对比
// @namespace    https://lanhuapp.com/
// @version      0.1
// @description  蓝湖前端UI对比 通过scheme打开桌面app
// @author       You
// @match        https://lanhuapp.com/web/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442850/%E8%93%9D%E6%B9%96%E5%89%8D%E7%AB%AFUI%E5%AF%B9%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/442850/%E8%93%9D%E6%B9%96%E5%89%8D%E7%AB%AFUI%E5%AF%B9%E6%AF%94.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...


  window.addEventListener('load', ()=>{

    function openImageUrl(){
      var imageUrl = document.querySelector(".detail-image > div > img").src;
      console.log("imageUrl "+imageUrl);
        window.open("lanhuappview://"+imageUrl);
    }

    const ele = document.getElementsByClassName("operation-center")[0];
    const image = document.createElement("div");
    image.onclick = openImageUrl;
    image.style = 'float: right';
    image.innerText= "打开图片";
    ele.appendChild(image);
    console.log('ready');

  })


})();
