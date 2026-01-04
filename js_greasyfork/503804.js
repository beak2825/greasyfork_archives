// ==UserScript==
// @name         济宁工业技师学院继续教育
// @namespace    https://jngyjs.qzjystudy.com/
// @version      1.0.0
// @description  自动播放视频
// @author       小然
// @match        https://jngyjs.qzjystudy.com/site-jngyjs/node/988
// @match        https://jnzjstu.qzjystudy.com/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503804/%E6%B5%8E%E5%AE%81%E5%B7%A5%E4%B8%9A%E6%8A%80%E5%B8%88%E5%AD%A6%E9%99%A2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/503804/%E6%B5%8E%E5%AE%81%E5%B7%A5%E4%B8%9A%E6%8A%80%E5%B8%88%E5%AD%A6%E9%99%A2%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    setTimeout(function(){
        if(window.location.href == 'https://jngyjs.qzjystudy.com/site-jngyjs/node/988'){
            var iframe = document.getElementById('myIframe').src;
            window.location.href = iframe;
            GM_setValue("courseIndex",-1);
        }
        var videoList = document.getElementsByClassName('videoList')[0];
        //console.log(videoList)
        if (videoList) {
            var index = GM_getValue("courseIndex");
            if(index === undefined){
                index = 0;
            }else if(videoList.children.length > index){
                index = parseInt(index) + 1;
            }
            console.log(index)
            var videos = videoList.children;
            var d = setInterval(function() {
                //console.log(videos[index])
                var progrss = videos[index].querySelector('div > div').innerText;
                //console.log(videos[index].querySelector('div > div').innerText);
                if (progrss.indexOf("100%") != -1) {
                    clearTimeout(d);
                    //console.log(progrss.indexOf("100%"))
                    //GM_setValue("courseIndex",index);
                    setTimeout(function(){
                        index++;
                        videos[index].click()
                    },4000)
                }
            }, 10000);
        }
    },2000)
})();