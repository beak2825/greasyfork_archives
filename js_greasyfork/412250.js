// ==UserScript==
// @name         河畔跳蚤查找器
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  try to take over the world!
// @author       sheldon coulson
// @match        https://bbs.uestc.edu.cn/forum.php?mod=forumdisplay&fid=61*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/412250/%E6%B2%B3%E7%95%94%E8%B7%B3%E8%9A%A4%E6%9F%A5%E6%89%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/412250/%E6%B2%B3%E7%95%94%E8%B7%B3%E8%9A%A4%E6%9F%A5%E6%89%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let li = document.getElementsByClassName("s xst")
    let links = new Array
    let count = 0
    let flag = 0
    let normalThread = 0
    let check = "";

    //Change the text between the forward slashes to things you wanna search.
    //e.g. /aaa/i => /bbb/i
    const x = /switch/i

    for (let i = 0; i < li.length; i++){
        check = li[i].parentNode.parentNode.parentNode.id.slice(0, 5);
        if(check == "stick"){
            normalThread++;
        }
    }
    for (let i = normalThread; i < li.length; i++){
        let str = li[i].innerHTML;
        if(str.search(x)!=-1){
            links.push(li[i].href);
            count++;
        }
    }
    if(count){
        if(flag = confirm("本页有关于\""+x.source+"\"的"+count+"条相关信息，是否查看？")){
            for(let j = count-1; j >= 0;j--){
                window.open(links[j], "_blank");
            }
        }flag = 0;
    }else{
        confirm("本页暂时没有关于\""+x.source+"\"的任何信息。")
    }

    //for(let i = 1; i <= 20; i++){
    //    window.open("https://bbs.uestc.edu.cn/forum.php?mod=forumdisplay&fid=61&page="+i, "_blank");
    //}
})();