// ==UserScript==
// @name         youtube playlist statitics
// @name:zh-CN   统计YouTube播放列表的时长
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  statirics the videos duration of youtube playlist video include total,longest,shortest time
// @description:zh-cn 统计YouTube播放列表的时长包括总时长,最长,最短,平均
// @author       Youer@https://github.com/youerning
// @match        https://www.youtube.com/playlist?list=*
// @grant        none
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/30723/youtube%20playlist%20statitics.user.js
// @updateURL https://update.greasyfork.org/scripts/30723/youtube%20playlist%20statitics.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    //var allSpan = document.getElementsByTagName("tbody")[0].getElementsByTagName("span");
    var allSpan = $("ul").find("tbody").find('span[aria-label]');
      // Total seconds
    var sumAll = 0;
    var vidTime = 0;
    var timeList = [];

    for(var i=0;i<allSpan.length;i++) {
      var sp = allSpan[i];
      var spText = sp.innerText;
      var sumOne = 0;
      if (spText.indexOf(":") >= 0) {
            var spTextLis = spText.split(":");
            var lg = spTextLis.length;
            for (var j=0; j < lg; j++){
                var m = Math.pow(60, (lg - 1 - j));
                vidTime = parseInt(spTextLis[j]) * m;
                sumOne += vidTime;
            }
        } else {
            vidTime = parseInt(spText);
            sumOne += vidTime;
      }
      timeList.push(sumOne);
      sumAll += sumOne;
    }
    // console somethings
    console.log("The playlist is total: " + (sumAll/3600).toFixed(2) + "hours");
    console.log("average time of all: " + (sumAll / (60 * allSpan.length)).toFixed(2) + "minutes");
    console.log("longest video time: " + (Math.max.apply(Math, timeList)) / 60 + "minutes");
    console.log("shortest video time: " + (Math.min.apply(Math, timeList)) / 60 + "minutes");
})();