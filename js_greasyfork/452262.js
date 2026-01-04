// ==UserScript==
// @name         BOSS直聘简历投递折线图
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在简历投递页显示半透明浮层展示简历投递情况折线图
// @author       OOOvercast
// @match      https://www.zhipin.com/web/geek/jobsfromchat*
// @icon         https://static.zhipin.com/zhipin-geek/chat/v187/static/images/logo-2x.0bd629ae.png
// @grant        none
// @run-at     document-idle
// @require https://cdn.jsdelivr.net/npm/echarts@5.4.0/dist/echarts.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452262/BOSS%E7%9B%B4%E8%81%98%E7%AE%80%E5%8E%86%E6%8A%95%E9%80%92%E6%8A%98%E7%BA%BF%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/452262/BOSS%E7%9B%B4%E8%81%98%E7%AE%80%E5%8E%86%E6%8A%95%E9%80%92%E6%8A%98%E7%BA%BF%E5%9B%BE.meta.js
// ==/UserScript==

(function() {

    'use strict';
    let url = "https://www.zhipin.com/wapi/zprelation/resume/geekDeliverList?page="

    function getResumeHappenTimeList(cardList) { // get  happenTime
        let resumeHappenTimeList = []
        for (let j = 0; j < cardList.length; j++) {
            resumeHappenTimeList.push(cardList[j]["happenTime"]);
        }
        return resumeHappenTimeList;
    }

    function sortResumeHappenTimeList(resumeHappenTimeList) { // sort  happenTime
        resumeHappenTimeList = resumeHappenTimeList.map(element => (new Date(element)).Format("yyyy-MM-dd"));
        const happenTimeMap = new Map();
        for (let card of resumeHappenTimeList) {
            if (happenTimeMap.has(card)) {
                happenTimeMap.set(card, happenTimeMap.get(card) + 1);
            } else {
                happenTimeMap.set(card, 1);
            }
        }

        let newHappenTimeMap = new Map(
            [...happenTimeMap].sort().filter(([k,v]) => k.startsWith('2022'))
        );
        return newHappenTimeMap;
    }

    async function getResumeCount(url) {
        let cardList = [];
        let resumeHappenTimeList = []
        let itemtotalCount = await fetch(url);
        itemtotalCount = await itemtotalCount .json();
        console.log(itemtotalCount);
        itemtotalCount = await Number(itemtotalCount["zpData"]["totalCount"]);
        console.log("itemtotalCount is:"+itemtotalCount);
        let pageNume = await Math.ceil(itemtotalCount/15)+1;
        console.log("pageNume is:"+pageNume);

        for (let index = 1; index < pageNume; index++) {
            let response = await fetch(url+String(index));
            response = await response.json();
            cardList = await getResumeHappenTimeList(response["zpData"]["cardList"]);
            resumeHappenTimeList = await resumeHappenTimeList.concat(cardList);

        }
        await new Promise((resolve, reject) => setTimeout(resolve, 500*pageNume));
        let resumeHappenTimeMap = await sortResumeHappenTimeList(resumeHappenTimeList);
        console.log(resumeHappenTimeList);
        let keys = await [ ...resumeHappenTimeMap.keys() ] ;
        let values = await [ ...resumeHappenTimeMap.values() ] ;
        await draw(keys,values);
    }


    console.log("油猴 is runing" );
    getResumeCount(url);
    function draw(date,count) {
        $("body").append("<div id = 'draw' style='top: 100px;left: 100px;bottom: 10px;background: #f9fafbc4;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 900px;height: 400px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'></div>");
        var chartDom = document.getElementById('draw');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
            xAxis: {
                type: 'category',
                data:date
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data:count,
                    type: 'line'
                }
            ]
        };

        option && myChart.setOption(option);

    }
    //setTimeout(draw, 5000);








})();