// ==UserScript==
// @name         传智播客自动搜题
// @namespace    http://stu.ityxb.com/writePaper/busywork/*
// @version      3
// @description  try to take over the world!
// @author       广东东软学院林鑫松同学
// @match        http://stu.ityxb.com/writePaper/busywork/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/422839/%E4%BC%A0%E6%99%BA%E6%92%AD%E5%AE%A2%E8%87%AA%E5%8A%A8%E6%90%9C%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/422839/%E4%BC%A0%E6%99%BA%E6%92%AD%E5%AE%A2%E8%87%AA%E5%8A%A8%E6%90%9C%E9%A2%98.meta.js
// ==/UserScript==



var questionObj;
var radioDiv;
var total = 0;//题目总数
var index = 0;//搜题索引
window.onload = function(){
questionObj = document.getElementsByClassName("question-title-box");
total = questionObj.length;
find(questionObj[index].innerText);




var bgdiv = document.getElementById("writeQuestion");
bgdiv.style.background = "url('https://s1.ax1x.com/2020/10/09/0BX4xI.png')";


}
   



function find(q){
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://api.902000.xyz:88/wkapi.php',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            data: 'q='+ encodeURIComponent(q),
            timeout: 2000,
            onload:function(xhr)
            {
                var str = xhr.responseText;
                console.log(index+","+str);
                var open = str.indexOf("answer");
                str = str.substring(open);
                open = str.indexOf("answer") + 9;
                var end = str.indexOf(",") - 1;
                var ans = str.substring(open,end);
                questionObj[index].innerText += "答案:"+ans;
                questionObj[index].style.color = "red";
                questionObj[index].style.fontSize = "28px";
                if(index < total - 1)
                {
                  setTimeout(function (){
                      index = index + 1;
                      find(questionObj[index].innerText);
}, 1000);
                 
                }


            }
        })
    }