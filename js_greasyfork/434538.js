// ==UserScript==
// @name        New script - gzteacher.com
// @namespace   Violentmonkey Scripts
// @match       http://study.gzteacher.com/study/study
// @grant       none
// @version     1.0
// @author      -
// @description 2021/10/27 下午2:59:30
// @downloadURL https://update.greasyfork.org/scripts/434538/New%20script%20-%20gzteachercom.user.js
// @updateURL https://update.greasyfork.org/scripts/434538/New%20script%20-%20gzteachercom.meta.js
// ==/UserScript==

function checkNext(){
  console.log("checkNext...");
  var aa = document.getElementsByClassName("ant-modal-content");
  if(aa && aa.length>0){
    if(aa[0].innerText.indexOf('已完成')>0){    
      // 下一个
      console.log("playNext...");
      document.getElementsByClassName("ant-btn")[2].click();
    }
  }
}

 
console.log("auto...");
setInterval(checkNext, 5000);

