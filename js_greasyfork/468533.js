// ==UserScript==
// @name         天津高校教师岗前培训-enetedu-1.0
// @namespace    配合软件秒刷
// @version      0.1
// @description  自动答题|秒刷视频|可免费测试|代刷VX：shuake345
// @author       vx:shuake345
// @match        *.enetedu.com/Course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enetedu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468533/%E5%A4%A9%E6%B4%A5%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%B2%97%E5%89%8D%E5%9F%B9%E8%AE%AD-enetedu-10.user.js
// @updateURL https://update.greasyfork.org/scripts/468533/%E5%A4%A9%E6%B4%A5%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%B2%97%E5%89%8D%E5%9F%B9%E8%AE%AD-enetedu-10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.alert = function() {};
	window.onbeforeunload = true
	window.confirm = function() {
		return true
	}
    function DT(){
        if(document.getElementsByTagName('video')[0].playbackRate!==16){
        document.getElementsByTagName('video')[0].playbackRate=16
            window.alert = function() {};
        }

        var XZt=document.querySelector('iframe').contentWindow.document.querySelectorAll('[type="radio"]')
        var DXZt=document.querySelector('iframe').contentWindow.document.querySelectorAll('[type="checkbox"]')
        if(XZt!==null){
            for (var i = 0; i < XZt.length; i++) {
                XZt[i].click()
            }
        }
        if(DXZt!==null){
            for (var l = 0; l < DXZt.length;l++) {
                DXZt[l].click()
            }
        }
            setTimeout(next,254)

        if(document.getElementsByTagName('video')[0].paused==true){
        document.querySelector('[style="background-color:#F2F2F2"]').querySelector('a').click()
        }
    }
    setInterval(DT,1421)

    function xiayigeshipin(){
        document.querySelector('[style="background-color:#F2F2F2"]').querySelector('a').click()
    }
    setInterval(xiayigeshipin,8421)
    function next(){
        window.alert = function() {};
        if(document.querySelector('iframe').contentWindow.document.querySelector('[name="next_1"]')!==null){
            window.alert = function() {};
            var NEXtext=document.querySelector('iframe').contentWindow.document.querySelector('[name="next_1"]').innerText
            //下一题
            if(NEXtext=='下一题'){
            document.querySelector('iframe').contentWindow.document.querySelector('[name="next_1"]').click()
            }
        }
        var lenths=document.querySelector('iframe').contentWindow.document.getElementsByClassName('TestNextPage').length-1
        if(lenths!==-1){
        document.querySelector('iframe').contentWindow.document.getElementsByClassName('TestNextPage')[lenths].querySelector('a').click()
        }
    }

})();