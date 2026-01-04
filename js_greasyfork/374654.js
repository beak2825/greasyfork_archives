// ==UserScript==
// @name         ScoreTeacher
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Score teacher automically
// @author       EugeneLiu
// @match        https://zhjw.neu.edu.cn/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/374654/ScoreTeacher.user.js
// @updateURL https://update.greasyfork.org/scripts/374654/ScoreTeacher.meta.js
// ==/UserScript==

(function() {
function sleep(ms){
  return new Promise((resolve)=>setTimeout(resolve,ms));
}
async function score(){
  localStorage.clear();
  var temple=await sleep(6000);
  var iframe2 = document.getElementsByTagName('iframe');
    console.log(iframe2);
if(iframe2 == null || iframe2 == '' || iframe2 == undefined || iframe2 == 'undefined'){
    return;
} else {
var obj = iframe2[0].contentWindow.document.getElementsByTagName("input");
var count = 0;
    for(var i=0; i<obj.length; i ++){
        if(obj[i].type == 'radio'){
			if(count == 1){
				if(obj[i].value == 75){obj[i].checked = "checked";  }
				count ++;
				continue;
			}
            if(obj[i].value == 85){
			count++;
			obj[i].checked = "checked";  }
        }
    };
    obj = iframe2[0].contentWindow.document.getElementsByTagName("input");
    count = 0;
    for( i=0; i<obj.length; i ++){
        if(obj[i].name == 'btSaveScore'){
			obj[i].click();
        }
    };
}
  return temple
}

score();


})();
