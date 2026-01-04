// ==UserScript==
// @name         百度搜索结果关键词屏蔽
// @namespace    https://greasyfork.org/zh-CN/scripts/369441
// @version      0.2.0
// @description  屏蔽烦人的推荐和关键词、以及一些烦人的明星
// @author       sunwukong
// @match        https://www.baidu.com/s*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369441/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/369441/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 要屏蔽的关键词
    var sbList = new Array("TFBOY","TFBOYS","王源","王俊凯","易烊千玺");

    // 执行过滤
    function doFilter(){

        // 相关人物
        var xgrw = document.querySelectorAll(".c-row.c-gap-top");
        for(var e = 0; e < xgrw.length; e++){
            var xgItems = xgrw[e].querySelectorAll(".opr-recommends-merge-item");
            for(var f = 0;f < xgItems.length; f++){
                var xgItem = xgItems[f];
                sbFilter(xgItem.querySelector(".c-gap-top-small").innerHTML)?killMySelf(xgItem):"";
            }
        }

        // 相关搜索
        var xg = document.getElementById("rs").querySelector("table").querySelector("tbody").querySelectorAll("tr");
        for(var b=0;b<xg.length;b++){
            var xgth = xg[b].querySelectorAll("th");
            for(var c=0;c<xgth.length;c++){
                sbFilter(xgth[c].querySelector("a").innerHTML)?killMySelf(xgth[c]):"";
            }
        }

        // 百科
        var opResult = document.querySelectorAll(".result-op.c-container");
        for( var a = 0;a<opResult.length;a++){
            var op = opResult[a];
            if(op.querySelector("h3")){
                var opContent = op.querySelector("h3").querySelector("a").innerHTML;
                sbFilter(opContent)?killMySelf(op):"";
            }
        }

        // 搜索结果
        var searchResult = document.querySelectorAll(".result.c-container");
        for( var i = 0 ; i < searchResult.length ; i++ ){
            var result = searchResult[i];
            sbFilter(result.querySelector("h3").querySelector("a").innerHTML)?killMySelf(result):"";
        }

        // 搜索热点
        var hotResult = document.querySelectorAll(".c-table.opr-toplist-table");
        for(var l = 0;l < hotResult.length;l++){
            var hotEmele = hotResult[l].querySelector("tbody").querySelectorAll("tr");
            for( var j = 0;j < hotEmele.length ; j++ ){
                var hot = hotEmele[j];
                sbFilter(hot.querySelector("td").querySelector("a").innerHTML)?killMySelf(hot):"";
            }
        }
    }

    // kill myself
    function killMySelf(obj){
        obj.parentNode.removeChild(obj);
    }

    // SB filter
    function sbFilter(content){
        content = content.replace(/<[^>]+>/g,"").toLowerCase();
        for (var i in sbList){
            if(content.indexOf(sbList[i].toLowerCase())>=0){
                return true;
            }
        }
        return false;
    }

    // 检测内容区域是否变化
    var len = document.getElementById("container").innerHTML.length;
    setInterval(function(){
        var newLen = document.getElementById("container").innerHTML.length;
        if(len!=newLen){
            len = newLen;
            doFilter();
        }
    },300);

    // Your code here...
})();