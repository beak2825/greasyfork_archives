// ==UserScript==
// @name         广东省教师继续教育信息管理平台公需课自动过视频(自动看视频+自动答题+自动下一章)
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  广东省教师继续教育信息管理平台公需课自动过视频(自动看视频+自动答题+自动下一章)，只需打开公需课第一节视频然后挂着就行
// @author       You
// @match        https://jsxx.gdedu.gov.cn/*
// @icon         https://www.google.com/s2/favicons?domain=gdedu.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431206/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E8%BF%87%E8%A7%86%E9%A2%91%28%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%A7%86%E9%A2%91%2B%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%2B%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E7%AB%A0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/431206/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%BF%A1%E6%81%AF%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E8%BF%87%E8%A7%86%E9%A2%91%28%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%A7%86%E9%A2%91%2B%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%2B%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E7%AB%A0%29.meta.js
// ==/UserScript==


(function() {
    'use strict';
  var count=0;
    function play(){
        count=$(".g-study-prompt p input")[0].value;
        if(parseInt($(".g-study-prompt p span")[0].innerHTML)<=parseInt($(".g-study-prompt p input")[0].value))
        {
            console.log("nice matching000");
            $("#studySelectAct a")[1].click();
        }
        if(parseInt($(".g-study-prompt p span")[0].innerHTML)<=parseInt($("#viewTimeTxt")[0].innerHTML)||parseInt($(".g-study-prompt p span")[0].innerHTML)<=parseInt($(".g-study-prompt p input")[0].value))
        {
            console.log("nice matching");
            $("#studySelectAct a")[1].click();
        }
/*        else if($(".timetextchcotewuvbbd").text().substring(0,5)==$(".timetextchcotewuvbbd").text().substring(8))
        {
            console.log("Video viewing completed");
            $("#studySelectAct a")[1].click();
        }
*/
}
$(function(){
$('video')[0].autoplay='true';
var timeID=window.setInterval(function(){
    play();
    console.log('running');
    console.log($(".g-study-prompt p span")[0].innerHTML);
    console.log($(".g-study-prompt p input")[0].value+"input's value");
    console.log($("#viewTimeTxt")[0].innerHTML+"spanID's value");
    if($("input[name='response']").length>0)
    {
        console.log('1');
        var x=0,y=$("input[name='response']").length;
        var index=parseInt(Math.random()*y);
        $("input[name='response']")[index].checked='true';
        $('.m-common-btn .m-reExam-btn a button').click()
    }

}, 1000);
});

    // Your code here...

})();