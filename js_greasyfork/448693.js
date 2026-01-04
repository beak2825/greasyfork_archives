// ==UserScript==
// @name         1首页跳转登录
// @version      0.1
// @description  第一步骤跳登陆
// @namespace    data
// @license      dats
// @match        https://m.xflapp.com/f100/main/owner-comments-activity*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/448693/1%E9%A6%96%E9%A1%B5%E8%B7%B3%E8%BD%AC%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/448693/1%E9%A6%96%E9%A1%B5%E8%B7%B3%E8%BD%AC%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".btn").click()

//     GM_xmlhttpRequest({
//         url:'https://api.miyun.pro/api/login?apiName=MY.3241539600&password=Aa11223344',
//         method :"GET",
//         headers: {
//             "Content-type": "application/x-www-form-urlencoded"
//         },
//         onload:function(xhr){
//             tk = JSON.parse(xhr.responseText).token
//             console.log(tk)
//             GM_xmlhttpRequest({
//                 url:"https://api.miyun.pro/api/get_mobile?token="+tk+"&project_id=13675&operator=4",
//                 method :"GET",
//                 headers: {
//                     "Content-type": "application/x-www-form-urlencoded"
//                 },
//                 onload:function(xhr){
//                     console.log(JSON.parse(xhr.responseText).mobile)
//                 }
//         });
//         }
//     });






//     var autoInterval;
//     autoInterval = mySetInterval();
//     //定义定时器
//     function mySetInterval(){
//         return setInterval(function (){

//         },1*200000); //秒
//     }
    //清除定时器
    //clearInterval(autoInterval);
})();