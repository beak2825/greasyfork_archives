// ==UserScript==
// @name         人卫慕课瞎几把蒙
// @namespace    https://qinlili.bid/
// @version      0.2
// @description  蒙就完事了
// @author       琴梨梨
// @match        http://tk.pmphmooc.com/memberFront/paper.zhtml?*
// @icon         http://tk.pmphmooc.com/favicon.ico
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/441899/%E4%BA%BA%E5%8D%AB%E6%85%95%E8%AF%BE%E7%9E%8E%E5%87%A0%E6%8A%8A%E8%92%99.user.js
// @updateURL https://update.greasyfork.org/scripts/441899/%E4%BA%BA%E5%8D%AB%E6%85%95%E8%AF%BE%E7%9E%8E%E5%87%A0%E6%8A%8A%E8%92%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //allA:全部选A;random:随机
    const selectMode="allA"
    document.getElementById("beginBtn").click();
    const random=(min, max)=> {
        return Math.round(Math.random() * (max - min)) + min;
    }
    [].forEach.call(document.getElementsByTagName("dd"),single=>{
        switch(selectMode){
            case "random":{
                let list=single.getElementsByTagName("input");
                list[random(1,list.length)-1].click()
                break
            };
            case"allA":{
                let list=single.getElementsByTagName("input");
                list[0].click();
                break
            }
        }
    })

    document.querySelector("#buttons_ > span:nth-child(2) > input").click();
    document.querySelector("#z-dialog-1-OKButton").click();
})();