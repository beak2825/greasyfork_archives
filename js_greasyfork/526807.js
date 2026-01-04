// ==UserScript==
// @name         神
// @namespace    http://tampermonkey.net/
// @version      2024-09-09
// @description  a
// @author       You
// @match        https://*.nuk.edu.tw/*/Insert0195*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526807/%E7%A5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/526807/%E7%A5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

 if(document.getElementById('senddata')){
         // 获取 ID 为 senddata 的按钮 並刪除
     // only ch page
     document.getElementById('senddata').removeAttribute('disabled');
        document.getElementById('agree').remove();

                                        }

let intervalId;
 document.Course_Form.total_count.value = 10;


intervalId = setInterval(() => {
        const now = new Date();

        // 判斷是否為12點30
        if (now.getSeconds()==59 && now.getHours() ==12 && now.getMinutes() == 29&& now.getMilliseconds()>999 ) {
           // validate(); // 執行 validate() 函數

// send Form
       document.Course_Form.submit();



            console.log("time到了, Submited. NOW:"+now.toISOString());
                clearInterval(intervalId);


   }

 //  console.log(hours+":"+minutes+ ":"+s+"."+ms);

console.log("NOW:"+now.toISOString());
    }, 5); // 6000 毫秒 = 1 s



})();