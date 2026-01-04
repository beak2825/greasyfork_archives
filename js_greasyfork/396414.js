// ==UserScript==
// @name         bangumi屏蔽较少人数的评分
// @namespace    http://tampermonkey.net/
// @description  block scores rated by less than 30 people or broadcasted less than 30 days
// @version      0.1
// @author       /
// @match        *://bgm.tv/subject/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396414/bangumi%E5%B1%8F%E8%94%BD%E8%BE%83%E5%B0%91%E4%BA%BA%E6%95%B0%E7%9A%84%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/396414/bangumi%E5%B1%8F%E8%94%BD%E8%BE%83%E5%B0%91%E4%BA%BA%E6%95%B0%E7%9A%84%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

(function () {
    var subject_id = window.location.href.split("/")[4];
    var httprequest = new XMLHttpRequest();
    var url = "https://api.bgm.tv/subject/" + subject_id;
    httprequest.open("GET",url,true);
    httprequest.onload = function(e) {
        //var response = httprequest.responseText;
        var response = JSON.parse(httprequest.response);
        var airDate = new Date(response.air_date);
        var currDate = new Date();
        var dateDiff = (currDate.getTime() - airDate.getTime()) / (1000 * 60 * 60 * 24);
        if(response.rating.total < 30 || dateDiff < 30){
            var ratingPanel = window.document.getElementById("panelInterestWrapper").getElementsByClassName("SidePanel png_bg")[0];
            var rating = ratingPanel.children[ratingPanel.childElementCount - 1].getElementsByClassName("global_score")[0];
            for(var i = 0; i < rating.childElementCount; i++){
                var item = rating.children[i];
                if(item.tagName.toLowerCase() == "span"){
                    item.style.visibility = "hidden";
                }
            }
        }
    };
    httprequest.send();
})();