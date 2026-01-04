// ==UserScript==
// @name         Youtube油管视频播放量优化显示
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @license	     MIT
// @description  Youtube 根据国人的使用习惯显示播放量，将【70,929,536,37】 转换为 【70.93亿次】观看，同时显示视频的具体发布时间
// @author       磊落不凡
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/448800/Youtube%E6%B2%B9%E7%AE%A1%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%87%8F%E4%BC%98%E5%8C%96%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/448800/Youtube%E6%B2%B9%E7%AE%A1%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%87%8F%E4%BC%98%E5%8C%96%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    //window.onload = function(){
        //457,806
    //1w以下 显示具体数字 9999
    //1w-1亿 显示w单位 10000 - 99999999
    //1亿+ 显示以为单位
    //num是一个字符串 例如："457,827次观看"


    // let r = toData("1,700,929,536,375次观看");
    // let r = toData("457,827次观看");
    // let r = `${toData("70,929,536,37")}`
    // console.log(r);
       

    //}
        //window.onload = () => {
            function toDataa(num){
                //if(num.indexOf(',')==-1){
                    //return num;
                //}
                let str = num.replace(/,/g,'')//'457827次观看'
                let n_str = parseInt(str)+''//'457827'
                let n = parseInt(str)
                if(n_str.length<=4){
                    return n_str + str.substr(n_str.length)
                }else if(n_str.length<=8){
                    return parseFloat((n/10000).toFixed(2))+'万' + str.substr(n_str.length)
                }else if(n_str.length<=12){
                    return parseFloat((n/100000000).toFixed(2))+'亿' + str.substr(n_str.length)
                }else{
                    //比亿亿还大的先按照亿的处理
                    return parseFloat((n/100000000).toFixed(2))+'亿' + str.substr(n_str.length)
                }
            }
            function isoTotime(iso8601String){
                let date = new Date(iso8601String);

                let year = date.getFullYear();
                let month = String(date.getMonth() + 1).padStart(2, "0");
                let day = String(date.getDate()).padStart(2, "0");
                let hours = String(date.getHours()).padStart(2, "0");
                let minutes = String(date.getMinutes()).padStart(2, "0");
                let seconds = String(date.getSeconds()).padStart(2, "0");

                let formattedTime = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
                return formattedTime
            }
            //console.log("Youtube油管视频播放量优化显示")https://www.youtube.com/watch?v=kJQP7kiw5Fk
            try {

                //setInterval
                let si = setInterval(()=>{
                    // 创建<span>元素
                    var spanElement = null;
                    if(!document.querySelector('#youtubeInfo_')){
                        // 获取<h1>元素
                        var h1Element = document.querySelector("#title h1");
                        spanElement = document.createElement("span");
                        spanElement.id="youtubeInfo_";
                        spanElement.style.fontSize = '14px';
                        // 将<span>元素插入到<h1>后面
                        h1Element.parentNode.insertBefore(spanElement, h1Element.nextSibling);
                    }else{
                        spanElement = document.querySelector('#youtubeInfo_')
                    }

                    let infoOBJ = document.querySelector('#microformat script');
                    if(infoOBJ){
                        let o = JSON.parse(infoOBJ.innerHTML);
                        spanElement.textContent = toDataa(o.interactionStatistic[0].userInteractionCount) + "次观看 " + isoTotime(o.uploadDate)
                    }

                },1000)

            } catch (error) {
                console.log("Youtube油管视频播放量优化显示错误：")
                console.log(error)
            }
        //}

    // Your code here...
})();