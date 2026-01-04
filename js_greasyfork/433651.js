// ==UserScript==
// @name         Photopea.com 去广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Photopea.com 去广告 https://zee.kim
// @author       Zee Kim
// @match        https://www.photopea.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433651/Photopeacom%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/433651/Photopeacom%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {

setTimeout(function(){
    document.querySelector(".mainblock").style.flex=1;
    document.querySelector(".app>div").style.flex=1;
    document.querySelector(".app").removeChild(document.querySelector(".app > div:nth-child(2)"));
    document.querySelector(".fitem").parentNode.parentNode.removeChild(document.querySelector(".fitem").parentNode);
    document.querySelector(".fitem.bbtn").parentNode.removeChild(document.querySelector(".fitem.bbtn"));
    document.querySelectorAll(".top").forEach(v=>{
      v.parentNode.removeChild(v);
    })
},300);

})();