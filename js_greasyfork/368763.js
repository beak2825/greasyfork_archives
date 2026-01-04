// ==UserScript==
// @name         第四届阿里中间件性能挑战赛-日志下载按钮
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  祝各位取得好成绩!
// @author       xiaobai050
// @match        https://tianchi.aliyun.com/*/uploadResult.htm*raceId=231657*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368763/%E7%AC%AC%E5%9B%9B%E5%B1%8A%E9%98%BF%E9%87%8C%E4%B8%AD%E9%97%B4%E4%BB%B6%E6%80%A7%E8%83%BD%E6%8C%91%E6%88%98%E8%B5%9B-%E6%97%A5%E5%BF%97%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/368763/%E7%AC%AC%E5%9B%9B%E5%B1%8A%E9%98%BF%E9%87%8C%E4%B8%AD%E9%97%B4%E4%BB%B6%E6%80%A7%E8%83%BD%E6%8C%91%E6%88%98%E8%B5%9B-%E6%97%A5%E5%BF%97%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(isTheFirstSeason()){
        var msg = $("#J_my_result > dd:nth-child(3) > span.evaluating").text().trim();
        if(isSuccessMsg(msg)){
            var kvs=msg.split(" ")[0].split(",");
            var taskId=kvs[0].split("=")[1];
            var teamId=kvs[1].split("=")[1];
            var theLastReview = $('#J_my_result > dd:nth-child(3)'); //"最后一次评测信息"这一行
            var url = 'https://middlewarerace2018.oss-cn-hangzhou.aliyuncs.com/'+teamId+'/'+taskId+'/logs.tar.gz';

            var myScoreDom = $('#J-tab-show > li:nth-child(2) > a');
            var myScoreUrl =  myScoreDom.attr("href");
            var res= $.get(myScoreUrl,function(data){
                var html=$.parseHTML(data);
                var resultFirst= html[35].children[4].children[1].children[2].children[0].children[2];
                var time = $(resultFirst.children[0]).text().trim().replace(" ",".");
                var score = $(resultFirst.children[1]).text().trim();
                var fileName =time+"["+score+"]"+".tar";
                // console.log(fileName);
                theLastReview.after("分数："+score);
                var downloadButton = '<a href='+url+' download='+fileName+' class="btn" style="background-color:#2d78f5; color:white;">下载log(鼠标中键戳我)<a/>';
                theLastReview.after(downloadButton);
            });
        }
    }
})();
function isSuccessMsg(msg){
    return (msg.indexOf("Success")>-1);
}
function isTheFirstSeason(){
    var season = $("body > div.detail-bg > div.detail-content.d-row.clearfix > div.detail-right > div.aliju-style > div > ul > li.cur-green.current").text().trim();
    return season=="第一赛季";
}