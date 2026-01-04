// ==UserScript==
// @name         河北农业大学教务系统评估填写
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  解放双手！再也不用一个个点击了！！
// @author       Slunger
// @match        http://urp.hebau.edu.cn*/jxpgXsAction.do
// @icon         https://www.google.com/s2/favicons?domain=hebau.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436426/%E6%B2%B3%E5%8C%97%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E4%BC%B0%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/436426/%E6%B2%B3%E5%8C%97%E5%86%9C%E4%B8%9A%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E4%BC%B0%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //$(document).ready(function(){
    //window.alert = function() {
   // return false;}
   // })
    setTimeout(function () {
         var bb=document.getElementsByTagName('input');
    for(var a=0;a<32;a+=5)
    {
        bb[a].click();
    }
    for(var a=35;a<42;a+=2)
    {
        bb[a].click();
    }
    document.getElementsByTagName("textarea")[0].innerText="老师治学严谨，对学生严格要求。课堂中，他循循善诱，强调独立思考，引导学生进行启发是思维。在这门课中，同学们体会到了学习的乐趣，在解决问题的过程中更懂得了科学探索的艰辛。"
    document.getElementsByTagName("img")[1].click();
}, 100);
    setTimeout(function () {
   document.getElementById('printInfo').click();
        var alert=function(){return 1}
}, 5000);

})();