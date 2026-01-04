// ==UserScript==
// @name         ZhiyuanRankGen
// @namespace    http://straydragon.github.io/
// @version      0.02
// @description  Pick zhiyuan reference rank (JiQiao Version)
// @author       StrayDragon
// @match        http://gps2.bjzhiyuan.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407787/ZhiyuanRankGen.user.js
// @updateURL https://update.greasyfork.org/scripts/407787/ZhiyuanRankGen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var div = document.getElementById('ctl00_ContentPlaceHolderMain_DataListUniv_ctl00_PanelNewGaokao');
        var res = 0;
        var s = div.innerHTML.toString();
        var a = s.match(/原理科排名：(\d+)/)
        //console.log(a);
        var b = s.match(/原文科排名：(\d+)/)
        //console.log(b);
        var like = 0.0
        var wenke = 0.0
        if (a && a.length === 2){
            like = parseFloat(a[1]);
        }
        //console.log(like);
        if (b && b.length === 2){
            wenke = parseFloat(b[1]);
        }
        //console.log(wenke);
        res = like * 0.8 + wenke;
        if (like === 0.0 || wenke == 0.0){
            res = "缺失数据";
        }else{
            res = Math.floor(res);
        }

        setTimeout(()=>{
            div.insertAdjacentHTML("beforeend","<b>新排名和: " + res.toString() + "</b>");
        },300);
    }
)();