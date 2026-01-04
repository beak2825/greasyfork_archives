// ==UserScript==
// @name         南阳理工学院自动评教插件
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  南阳理工学院自动评教
// @author       KALA
// @match        https://zlpg.nyist.edu.cn/jxzl/feedback/zjw/toStuPage?isAuth=null
// @icon         https://www.google.com/s2/favicons?domain=nyist.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426930/%E5%8D%97%E9%98%B3%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/426930/%E5%8D%97%E9%98%B3%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    alert('若未自动填写表单，请在网页加载完毕后刷新。');
   var list=document.getElementById('evalUL');
//001
   var ls= list.getElementsByTagName('li');
   var i=0;
     for(i=0;i<ls.length-1;i++){
         ls[i].children[1].children[0].children[0].children[0].click();
         ls[i].children[1].children[1].children[0].children[0].value='符合';
         if(i==5)
         {
              ls[i].children[1].children[0].children[3].children[0].click();
         }
     }
    ls[24].children[1].children[0].value='无'

})();