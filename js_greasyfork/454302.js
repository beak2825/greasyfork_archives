// ==UserScript==
// @name         广商形势与政策
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  打开专题学习界面即可，不用点击学习，只要页面保证页面不关闭，全部专题学习完后，会有弹窗提醒！
// @author       aicon
// @match         http://xsyzc.gzcc.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/454302/%E5%B9%BF%E5%95%86%E5%BD%A2%E5%8A%BF%E4%B8%8E%E6%94%BF%E7%AD%96.user.js
// @updateURL https://update.greasyfork.org/scripts/454302/%E5%B9%BF%E5%95%86%E5%BD%A2%E5%8A%BF%E4%B8%8E%E6%94%BF%E7%AD%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var flag=false
    var second=0
    var catidArr=[134,135,136,137]
    var currIndex=0
    var onlineLearn = setInterval(()=>{
        if(flag==false&&second<=4800){
            $.ajax({
            url: "/index.php?m=member&c=study&a=enter",
            dataType: "json",
            type: "get",
            data: {
                catid: catidArr[currIndex],
            },
            success: function (res) {
                second=res.seconded
                if(res.onlining=="1"){
                    $.ajax({
                    url: "/index.php?m=member&c=study&a=close",
                    dataType: "json",
                    type: "get",
                    data: {
                        catid: catidArr[currIndex],
                        second: second
                    },
                    success: function () {
                        loadRecord(catidArr[currIndex])
                    }
                    });
                }
                flag=true
            }
            });
        }else if(second>4800){
            $.ajax({
                url: "/index.php?m=member&c=study&a=close",
                dataType: "json",
                type: "get",
                data: {
                    catid: catidArr[currIndex],
                    second: second
                },
                success: function () {
                    loadRecord(catidArr[currIndex])
                }
                });
            currIndex++;
            flag=false;
            second=0;
        }
        else if(currIndex==4){
            //清除定时
            clearInterval(onlineLearn)
            alert("全部看完了！")
        }
        else{
            second++;
        }
        console.log("当前秒数："+second)
    },1000)
})();