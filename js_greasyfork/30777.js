// ==UserScript==  
// @name         fuck百度搜索右侧推广  
// @namespace    http://kongpingfan.com/  
// @version      0.1.2
// @description  将百度右侧的结果屏蔽掉。  
// @author       pyufftj  
// @match        *://*.baidu.com/*  
// @grant        none  
// @downloadURL https://update.greasyfork.org/scripts/30777/fuck%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8F%B3%E4%BE%A7%E6%8E%A8%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/30777/fuck%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%8F%B3%E4%BE%A7%E6%8E%A8%E5%B9%BF.meta.js
// ==/UserScript==    
(function() {  
    'use strict';  
  
    if (location.hostname=="www.baidu.com"){  
        var auto = setInterval(function() {  
            if (document.getElementById('content_right')){  
                document.getElementById('content_right').style.display="none";  
            }  
            if(document.getElementById('rrecom-container')){  
                document.getElementById('rrecom-container').style.display="none";  
            }  
            if(document.getElementsByClassName("opr-recommends-merge-content")[0]){  
                document.getElementsByClassName("opr-recommends-merge-content")[0].style.display="none";  
              
            }  
        }, 500);  
    }  
  
})();  