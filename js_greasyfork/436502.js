// ==UserScript==
// @name         大众点评免费
// @namespace    http://menglunyang.ml/
// @version      1.1
// @description  大众点评免
// @author       menglunyang
// @match        https://m.dianping.com/freemeal/index?*
// @match        https://h5.dianping.com/app/app-community-free-meal/detail.html?offlineActivityId=*
// @match        https://m.dianping.com/mobile/dinendish/apply/*
// @match        https://m.dianping.com/mobile/dinendish/success/*
// @icon         https://www.google.com/s2/favicons?domain=dianping.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436502/%E5%A4%A7%E4%BC%97%E7%82%B9%E8%AF%84%E5%85%8D%E8%B4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/436502/%E5%A4%A7%E4%BC%97%E7%82%B9%E8%AF%84%E5%85%8D%E8%B4%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(/freemeal/.test(window.location.href)){//第一步
        //document.getElementsByClassName("nav-tab-span")[3].click();
        //setTimeout("document.getElementsByClassName('dropdown-item-region')[1].click()",1000);
        //setTimeout("document.getElementsByClassName('item-btn')[0].click()",2000);

        function find_activity(page) {
            var httpRequest = new XMLHttpRequest();
            //cityid=2 北京 filter=1 只看未抢 category=1 美食
            httpRequest.open('GET', 'https://m.dianping.com/astro-plat/freemeal/loadLotteryList?cityid=2&env=dp&filter=1&category=&type=1&page=' + page, true);
            httpRequest.send();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                    var json = httpRequest.responseText;
                    //获取到json字符串，还需解析
                    var obj = JSON.parse(json);
                    //console.log(obj.data.lotteryActivityList[0].detailUrl);
                    window.location.href=obj.data.lotteryActivityList[0].detailUrl;
                }
            }
            ;
        }
        setTimeout(find_activity(1), 1000)


    }

    if(/app-community-free-meal/.test(window.location.href)){//第二步
        setTimeout("document.getElementsByClassName('btn___3wXxj short_btn___D6F-E')[0].children[0].children[0].click()",1000);
    }
    if(/apply/.test(window.location.href)){//第三步
        setTimeout(function(){
            if(document.getElementsByClassName('md-select')[0]===undefined){
                document.getElementsByClassName('md-btn apply-btn md-btn-primary md-btn-block')[0].click();
            }
            if(document.getElementsByClassName('md-select')[0].length===2){
                document.getElementsByClassName('md-select')[0].selectedIndex=1;
                document.getElementsByClassName('md-btn apply-btn md-btn-primary md-btn-block')[0].click();
            }
        },1000);
    }

    if(/success/.test(window.location.href)){//第四步
        window.location.href="https://m.dianping.com/freemeal/index?notitlebar=1&cityid=2&latitude=&longitude=";

    }

    // Your code here...
})();