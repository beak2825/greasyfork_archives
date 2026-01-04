// ==UserScript==
// @name         获取店匠product id
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  xxx
// @author       You
// @match        https://www.xxx.com/collections*
// @match        https://www.xxx.com/search*
// @icon         https://www.google.com/s2/favicons?domain=tasiliya.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431989/%E8%8E%B7%E5%8F%96%E5%BA%97%E5%8C%A0product%20id.user.js
// @updateURL https://update.greasyfork.org/scripts/431989/%E8%8E%B7%E5%8F%96%E5%BA%97%E5%8C%A0product%20id.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function getId(){
          let ps = document.querySelectorAll(".product-snippet")
          function insertP(chNode){
              var p = document.createElement("div")
              p.classList.add("hahaha")
              if (!chNode.contains(chNode.querySelector(".hahaha"))){
                  chNode.insertBefore(p, chNode.firstElementChild)
                  p.innerText = chNode.dataset.trackId
              }
          }
        ps.forEach((i)=>{
            insertP(i)})
    }

    setInterval(()=>{
      getId()
    },1000)
})();