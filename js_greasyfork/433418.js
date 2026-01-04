// ==UserScript==
// @name        校园wifi脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://blog.csdn.net/mukes/article/details/109727662
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @include     *
// @grant         GM.xmlHttpRequest
// @connect blxx.zhbit.com
// @connect 10.0.15.102
// @downloadURL https://update.greasyfork.org/scripts/433418/%E6%A0%A1%E5%9B%ADwifi%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/433418/%E6%A0%A1%E5%9B%ADwifi%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// http://blxx.zhbit.com/wifi.jhtml?loginurl&userid=*&ip=10.0.15.102:8080&unicom=0&username=&password=

const xhs = [
190301100858,
190301101106,
190301101236,
190301101899,
190301103112,
190301103195,
190301103373,
190301103458,
190301103586,
190301103721,
190301104241,
190301105105,
190301105470,
190811101305,
190301101483,
190301102393,
190301102735,
190301102840,
190301103108,
190301103226,
190301103398,
190301103540,
190301103664,
190301103678,
190301103766,
190301103894

];
//开始
 var wifi = document.createElement("div")
    wifi.innerHTML="<button id='wifi' style='position: absolute;right: 20px;top: 125px;border-radius: 17px;background-color: #fc5531;color: white;width: 97px;height: 35px;'>链接wifi</button>"
    document.getElementsByTagName("body")[0].appendChild(wifi)
    document.getElementById("wifi").onclick = tempConnect

 async function connectWifi(xh){
         const response = await GM.xmlHttpRequest({ method: "GET", url:`http://blxx.zhbit.com/wifi.jhtml?loginurl&userid=${xh}&ip=10.0.15.102:8080&unicom=0&username=&password=`, synchronous: true });
         console.log(response);
         const res = JSON.parse(response.response);

         const urls = res.urls;
         const url = urls[0];
         if(!url){
             return "失败";
         }
         const realResponse = await GM.xmlHttpRequest({ method: "GET", url:url, synchronous: true,headers:{
             'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,und;q=0.7,be;q=0.6'
             ,'Cache-Control': 'max-age=0'
             ,'Connection': 'keep-alive'
             ,'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
         }});
         console.log(realResponse.responseText)
     return realResponse.responseText;

 }
var isFirstConect = true;
async function tempConnect(){
    let i
    if(isFirstConect){
       let textParent = document.getElementById("wifi").parentNode
        textParent.innerHTML+=` <textarea id='textWifi' style='\
    position: absolute;\
    right: 30px;\
    top: 162px;\
    background-color: greenyellow;\
    text-align: center;\
    width: 305px;\
' > 正在认证中！</textarea>`;
        isFirstConect=false;
    }
    let isContinue = false;
    let textMode = document.getElementById("textWifi")
    for(i = 0;i<xhs.length;i++){
              const nxh = xhs[i];
              console.log(nxh);
        textMode.value+=nxh+"正在认证\n"
              const res = await connectWifi(nxh);
              if(/该用户正在认证过程中|用户已经在线/.test(res) || res.length==7){
                  textMode.value+=nxh+'链接成功\n'
                  alert(nxh+"链接成功"+res) ;
                      break;
              }
        textMode.value+=nxh+"认证失败\n"
              // const obj = JSON.parse(res.substr(res.indexOf("{")))
              // if(obj.portServIncludeFailedReason)
              //  textMode.value+=obj.portServIncludeFailedReason+'\n'

               if(!isContinue && /该用户正在认证过程中/.test()){
                     let ans = confirm("用户正在认证中....是否继续？")
                     if(ans){
                          isContinue = true;
                     }else{
                          break;
                     }

               }
    }
    if(i==xhs.length)
        alert("数据不够了呢！");
}
(function() {
    'use strict';

})();