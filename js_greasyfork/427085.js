// ==UserScript==
// @name         谷歌搜索+百度（极简）
// @version      1.0.1
// @description  google with baidu
// @author       Janet
// @grant        GM_openInTab
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @resource    customCSS https://lib.baomitu.com/bttn.css/0.2.4/bttn.css
// @include      https://www.google.com*


// @namespace https://greasyfork.org/users/249577
// @downloadURL https://update.greasyfork.org/scripts/427085/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%2B%E7%99%BE%E5%BA%A6%EF%BC%88%E6%9E%81%E7%AE%80%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/427085/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%2B%E7%99%BE%E5%BA%A6%EF%BC%88%E6%9E%81%E7%AE%80%EF%BC%89.meta.js
// ==/UserScript==
(function() {
  'use strict';
  var newCSS = GM_getResourceText ("customCSS");
  GM_addStyle (newCSS);
  GM_addStyle (`
     #mybtn{
         line-height:10px;
     }
   `)

  function searchByBaidu(search_content) {
    return 'https://www.baidu.com/s?wd=' + search_content;
  }
  function baiduClick() {
    var search_content = document.querySelector('input.gLFyf').value;
    GM_openInTab( searchByBaidu(search_content), false);
  }
  let box = document.querySelector(".RNNXgb")
  let mybtn = document.createElement("button")
  mybtn.innerHTML="百度"
  mybtn.setAttribute("type", "reset")
  mybtn.setAttribute("id", "mybtn")
  mybtn.setAttribute("class", "bttn-pill bttn-md bttn-primary")
  box.appendChild(mybtn)

  mybtn.addEventListener("click",(e)=>{
    e.preventDefault()
    baiduClick()
  })

})();