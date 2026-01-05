// ==UserScript==
// @name 优酷页面精简
// @namespace Violentmonkey Scripts
// @grant none
// @description         精简优酷视频播放页面，还给你一个干净的看片环境！
// @match       *://v.youku.com/*
// @version 0.1.5
// @downloadURL https://update.greasyfork.org/scripts/29341/%E4%BC%98%E9%85%B7%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/29341/%E4%BC%98%E9%85%B7%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==
// 作者：@mordom0404
(function(){
    var fobiddenlist = [".list_ad_wrap", ".sideCol", "#module_basic_relationleft", "#module_basic_comment", "#module_basic_comment", "#sideTool","#timeline",".vpactionv5_iframe_wrap",".g-w1",".g-w2",".g-w3",".g-w4","#qnotice","#vpofficiallistv5_wrap>.textlists:nth-child(2)",".video-pv"];
    var removeadd = [],time = [];
    fobiddenlist.map(function(v, i) {
    	time[i] = 10;
    	removeadd[i] = window.setInterval(function() {
    	    if ($(v).remove().length > 0) {
    	        window.clearInterval(removeadd[i])
    	    }
    	    if (time[i] === 0) {
    	        window.clearInterval(removeadd[i])
    	    }
    	    time[i]--;
    	    console.log(v)
    	}, 1000)
    })
    var removeadd2 = [],time2 = [];
    var moduleadd = $("[id^=module_ad]")
    moduleadd.map(function(m, j) {
    	time2[m] = 10;
    	removeadd2[m] = window.setInterval(function() {
    	    if ($(j).remove().length > 0) {
    	        window.clearInterval(removeadd2[m])
    	    }
    	    if (time2[m] === 0) {
    	        window.clearInterval(removeadd2[m])
    	    }
    	    time2[m]--;
    	    console.log(j)
        },1000)
    })
})()
