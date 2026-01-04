// ==UserScript==
// @name         2022暑期教师研修
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       hui
// @description  autoplay
// @match        https://www.zxx.edu.cn/teacherTrainingNav/train
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448593/2022%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/448593/2022%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE.meta.js
// ==/UserScript==

window.onload = function () {
    var id=setInterval(function(){
        if (document.getElementsByClassName('index-module_processCMy_FniH-').length!=null & document.getElementsByClassName('index-module_processCMy_FniH-').length > 1){
                document.getElementById('rc-tabs-0-tab-fd556ee3-5e96-4901-966d-661027b77e8c').click()//点击【义务教育】
                setTimeout(function(){check()},1000)
                //alert("已完成7个专题，请手动点击【直播】专题")
                clearInterval(id);
            }
        }, 5 * 1000);//5秒检测一次
//检测是否完成
function check(){

    var list=[1,3,5,7,9,13,17]
    var num
    var i
    for (i = 0; i < list.length; i++){
       num=list[i];
       var listnum=Number(document.getElementsByClassName('index-module_processCMy_FniH-')[num].innerText)
       console.log(num)
       if(num==17 & listnum <2.999){
           document.getElementsByClassName('index-module_processCMy_FniH-')[17].click()
           clearInterval(id);
           window.close();
           break;
    }
       if(num!=17 & listnum <0.999){
           document.getElementsByClassName('index-module_processCMy_FniH-')[num].click()
           clearInterval(id);
           window.close();
           break;
    }
    };
    alert("已完成7个专题，请手动点击【直播】专题")
}
}