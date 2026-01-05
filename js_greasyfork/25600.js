// ==UserScript==
// @name         哈楼评分 V1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       蓝烟火蓝烟
// @include      http://www2.55188.com/*
// @include      http://www.55188.com/*
// @match
// @grant
// @downloadURL https://update.greasyfork.org/scripts/25600/%E5%93%88%E6%A5%BC%E8%AF%84%E5%88%86%20V10.user.js
// @updateURL https://update.greasyfork.org/scripts/25600/%E5%93%88%E6%A5%BC%E8%AF%84%E5%88%86%20V10.meta.js
// ==/UserScript==

//感谢哈师感谢各位师兄，是你们的精神支撑着我，让一位机械工程师完成了这段代码，最后感谢google

//             蓝烟火蓝烟  2016.12.11


(function() {

    var fen = 2;                   //要加的分数
    var liyou = "周末愉快";        //评分内容，修改引号中的内容"XXXX"
    var tongzhi = true;          //通知作者为true，不通知为false

    var class1 = document.getElementsByClassName("mainbox viewthread");
    var class2 = new Array(20);

    for (var i=0;i<class1.length;i++)
    {
        class2[i] = class1[i].getElementsByTagName("table")[0].getAttribute("id").slice(3);
    }
    //window.onclick = aaa;

    var lou1 = 0;
    document.getElementById("postmessage_"+class2[lou1]).onclick = function(){
        aaa(lou1,1);
    };

    var lou2 = 1;
    document.getElementById("postmessage_"+class2[lou2]).onclick = function(){
        aaa(lou2,1);
    };

    var lou3 = 2;
    document.getElementById("postmessage_"+class2[lou3]).onclick = function(){
        aaa(lou3,1);
    };

    var lou4 = 3;
    document.getElementById("postmessage_"+class2[lou4]).onclick = function(){
        aaa(lou4,1);
    };

    var lou5 = 4;
    document.getElementById("postmessage_"+class2[lou5]).onclick = function(){
        aaa(lou5,1);
    };

    var lou6 = 5;
    document.getElementById("postmessage_"+class2[lou6]).onclick = function(){
        aaa(lou6,1);
    };

    var lou7 = 6;
    document.getElementById("postmessage_"+class2[lou7]).onclick = function(){
        aaa(lou7,1);
    };

    var lou8 = 7;
    document.getElementById("postmessage_"+class2[lou8]).onclick = function(){
        aaa(lou8,1);
    };

    var lou9 = 8;
    document.getElementById("postmessage_"+class2[lou9]).onclick = function(){
        aaa(lou9,1);
    };

    var lou10 = 9;
    document.getElementById("postmessage_"+class2[lou10]).onclick = function(){
        aaa(lou10,1);
    };

        var lou11 = 10;
    document.getElementById("postmessage_"+class2[lou11]).onclick = function(){
        aaa(lou11,1);
    };

    var lou12 = 11;
    document.getElementById("postmessage_"+class2[lou12]).onclick = function(){
        aaa(lou12,1);
    };

    var lou13 = 12;
    document.getElementById("postmessage_"+class2[lou13]).onclick = function(){
        aaa(lou13,1);
    };

    var lou14 = 13;
    document.getElementById("postmessage_"+class2[lou14]).onclick = function(){
        aaa(lou14,1);
    };

    var lou15 = 14;
    document.getElementById("postmessage_"+class2[lou15]).onclick = function(){
        aaa(lou15,1);
    };

    var lou16 = 15;
    document.getElementById("postmessage_"+class2[lou16]).onclick = function(){
        aaa(lou16,1);
    };

    var lou17 = 16;
    document.getElementById("postmessage_"+class2[lou17]).onclick = function(){
        aaa(lou17,1);
    };

    var lou18 = 17;
    document.getElementById("postmessage_"+class2[lou18]).onclick = function(){
        aaa(lou18,1);
    };

    var lou19 = 18;
    document.getElementById("postmessage_"+class2[lou19]).onclick = function(){
        aaa(lou19,1);
    };

    var lou20 = 19;
    document.getElementById("postmessage_"+class2[lou20]).onclick = function(){
        aaa(lou20,1);
    };
        function aaa(a,b){
            var lc = document.getElementById("ajax_rate_"+class2[a]+"_menu");
            lc.getElementsByTagName("input")[3].value=2;
            lc.getElementsByTagName("textarea")[0].innerHTML = liyou+"..";
            lc.getElementsByTagName("input")[4].checked=tongzhi;

        }

    })();
