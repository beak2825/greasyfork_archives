// ==UserScript==
// @name         小红书帖子链接爬取
// @namespace    https://stay.app/
// @version      0.1
// @description  Template userscript created by Stay
// @author       Aikn
// @match        *://*xiaohongshu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461696/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%B8%96%E5%AD%90%E9%93%BE%E6%8E%A5%E7%88%AC%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/461696/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%B8%96%E5%AD%90%E9%93%BE%E6%8E%A5%E7%88%AC%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("脚本启动成果");

    var elemsBody = document.getElementsByTagName("body");
    var display = document.getElementsByClassName("user-desc");
    var output = [];
    display[0].innerHTML = "";
  
    function main(){
        console.log("链接总数目：" + output.length);

        var elemsFooter = document.getElementsByClassName("footer");
        var start = 0;

        //比较进程
        for(let i = 0; i<elemsFooter.length; i++){
            for(let j = 0; j<output.length; j++){
                if(elemsFooter[i].firstChild.href == output[j].firstChild.href){
                    start ++;
                    break;
                }
            }
        }
        for(let i = start; i<elemsFooter.length; i++){
            output.push(elemsFooter[i]);    
        }

        // 在控制台输出链接
        for(let i = start; i<elemsFooter.length; i++){
            console.log(elemsFooter[i].firstChild.href);
            console.log(elemsFooter[i].firstChild.firstChild.innerHTML);
        }

        // 在网页输出链接
        for(let i = start; i<elemsFooter.length; i++){
            display[0].innerHTML += ("<p>" + elemsFooter[i].firstChild.href + "<p>" + "<p>" + elemsFooter[i].firstChild.firstChild.innerHTML + "<p>");
        }
    }

    // 页面滚动时函数
    elemsBody[0].onscroll = function(){
      main();
    }
})();



