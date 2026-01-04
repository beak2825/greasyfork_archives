// ==UserScript==
// @name         网页视频生产力刷刷刷
// @version      1.1.2
// @description  简便刷浙江开放大学网页课程。
// @author       feifei
// @match        https://xlts.zjlll.net/*/*
// @license      MIT
// @namespace    https://greasyfork.org/users/1030542
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/469527/%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E7%94%9F%E4%BA%A7%E5%8A%9B%E5%88%B7%E5%88%B7%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/469527/%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E7%94%9F%E4%BA%A7%E5%8A%9B%E5%88%B7%E5%88%B7%E5%88%B7.meta.js
// ==/UserScript==
var videospeed=15; //修改视频加载速度
var videDelay=20; //卡顿刷新判断秒数
var videoNumber=0;//视频卡顿标识

setTimeout(function() {
    $(".xgplayer-start").click();
}, 2000);

jQuery(document).delegate('video', 'DOMNodeInserted', function() {

    var video= document.getElementById('player').children[0];

    video.playbackRate=videospeed;

    video.ontimeupdate = function() {myFunction()};
    function myFunction() {
        videoNumber=0;

    }
 
    var fp2 = setInterval(function () {
        videoNumber++;
        console.log("触发卡顿"+videoNumber);
        if(videoNumber>videDelay){
            videoNumber=0;
            location.reload();
        }

    }, 1000);

    video.addEventListener('ended', function () {
        for (var i = 1; i < $('.resource-box').length; i++) {
            if($('.resource-box')[i].className=="resource-box active-resource"){
                $(".resource-box")[i+1].click();
                setTimeout(function() {
                    $(".xgplayer-start").click();
                }, 2000);
            }
        }

	}, false);

});

