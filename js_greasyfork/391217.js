// ==UserScript==
// @name         小融盒子激活码抢购
// @namespace    www.xiaorongbox.com
// @version      1.1
// @description  小融盒子X86激活码抢购
// @author       zsy19860820@sohu.com
// @license      
// @match        https://www.xiaorongbox.com/mall/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391217/%E5%B0%8F%E8%9E%8D%E7%9B%92%E5%AD%90%E6%BF%80%E6%B4%BB%E7%A0%81%E6%8A%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/391217/%E5%B0%8F%E8%9E%8D%E7%9B%92%E5%AD%90%E6%BF%80%E6%B4%BB%E7%A0%81%E6%8A%A2%E8%B4%AD.meta.js
// ==/UserScript==
setInterval(
function () {
//     var timestamp=Date.now();//定义时间戳获取当前时间
//     var date = new Date(timestamp );//时间戳为10位需*1000，时间戳为13位的话不需乘1000
//     var Y = date.getFullYear() + '-';
//     var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
//     var D = date.getDate() + ' ';
//     var h = date.getHours() + ':';
//     var m = date.getMinutes() + ':';
//     var s = date.getSeconds();
//     var time = h+m+s;
//     if(time=="10:0:0"||time=="10:0:1"||time=="10:0:2"||time=="10:0:3"||time=="10:0:4"||time=="10:0:5"){
        var aElements=document.getElementsByClassName('np-add');//所有a标签元素
        var bElements=document.getElementsByClassName('btn-np');
        var aEle=[];//内容矩阵
        var bEle=[];
        try{for(var i=0;i<aElements.length;i++)
            {
                aEle.push( aElements[i] );
            }
        for(var j=0;j<5;j++)
            {
               aEle[0].click();
            }
             }catch(e){
 	console.log(e);
	}
        for(var k=0;k<bElements.length;k++)
            {
                bEle.push( bElements[k] );
            }
    try{
    bEle[0].click();
        }catch(e){
 	console.log(e);
	}
// }
// location.reload();
},200);