// ==UserScript==
// @name        k站修改器
// @namespace   konachan
// @include     *://konachan*
// @license      MIT
// @grant       none
// @version     1.2
// @author      -
// @description 2022/7/26 10:49:34
// @downloadURL https://update.greasyfork.org/scripts/448471/k%E7%AB%99%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/448471/k%E7%AB%99%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==


(function () {
  
    function had_download(){
      this.childElements()[0].style.color="white"
    }
    
    console.log("run k")
  
  
    
  
    var l= document.getElementsByClassName("directlink largeimg")
    for(n=0;n<l.length;n++){l[n].download="";
                            l[n].style.height="20px";
                            l[n].onclick=had_download
                           }
  
    var l2=document.getElementsByClassName("directlink smallimg")
    for(n=0;n<l2.length;n++){l2[n].download="";
                             l2[n].style.height="20px";
                             l2[n].onclick=had_download
                            }
    
})();

