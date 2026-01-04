// ==UserScript==
// @icon   http://cdn.kesci.com/favicon.ico
// @name         科赛kesci个人提交排行
// @namespace    [url=mailto:modai_zhan@qq.com]modai_zhan@qq.com[/url]
// @version      0.3
// @author       modai
// @match        https://www.kesci.com/home/competition/*/submit
// @description  简单的给自己成绩排名
// @require      http://code.jquery.com/jquery-latest.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/386621/%E7%A7%91%E8%B5%9Bkesci%E4%B8%AA%E4%BA%BA%E6%8F%90%E4%BA%A4%E6%8E%92%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/386621/%E7%A7%91%E8%B5%9Bkesci%E4%B8%AA%E4%BA%BA%E6%8F%90%E4%BA%A4%E6%8E%92%E8%A1%8C.meta.js
// ==/UserScript==ccc

(function() {
    'use strict';
    function show(){
        var trlist = document.querySelectorAll('#app-root > div.container.root-router-view.with-sticky-nav > div > div:nth-child(1) > section.tab-content-view.block-bg > div > div.competition-submit-history-section > table>tr');
        //alert(trlist.length);
        var scores= new Array();
        scores[0]=-1;
        //添加”排名“
        trlist[0].querySelector('th:nth-child(6)').innerText='排名';
        for(var i=1;i<trlist.length;i++){
            var score = trlist[i].querySelector('td:nth-child(5) > div > div').innerText;
            try{
                scores[i] = eval(score);}
            catch(err){
                scores[i] = -1;
            }
        }
        var raw_scores = $.extend(true,[],scores);
        var up_down = scores.sort().reverse();
        var colors = ['#006400','#228B22','rgb(80, 202, 32)','#98FB98'];
        for(var j = 0;j<4;j++){
            var index = raw_scores.indexOf(up_down[j]);
            //    var index = j;
            //trlist[index].css('color','white');
            trlist[index].style.backgroundColor = colors[j];
            trlist[index].style.color ='white';
            trlist[index].querySelector('td:nth-child(6)').innerText = j+1;
        }
    }
    setTimeout(show,2000);

})();