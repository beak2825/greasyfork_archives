// ==UserScript==
// @name         关闭腾讯课堂正在观看弹幕以及暂停的版权说明
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  腾讯课堂播放器神烦，老是提示一些无关紧要的东西，看视频学习时总觉得很烦，又没地方关，也没地方反馈。
// @author       felix
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460053/%E5%85%B3%E9%97%AD%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E6%AD%A3%E5%9C%A8%E8%A7%82%E7%9C%8B%E5%BC%B9%E5%B9%95%E4%BB%A5%E5%8F%8A%E6%9A%82%E5%81%9C%E7%9A%84%E7%89%88%E6%9D%83%E8%AF%B4%E6%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/460053/%E5%85%B3%E9%97%AD%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E6%AD%A3%E5%9C%A8%E8%A7%82%E7%9C%8B%E5%BC%B9%E5%B9%95%E4%BB%A5%E5%8F%8A%E6%9A%82%E5%81%9C%E7%9A%84%E7%89%88%E6%9D%83%E8%AF%B4%E6%98%8E.meta.js
// ==/UserScript==

var intervalFlag;
var hasAI;

(function() {
    'use strict';

    intervalFlag = setInterval(clearDamu,300);
})();

function clearDamu() {
    var container1=$("div[class^='copyright-marquee-tips-container']");
    if(container1) container1.css("opacity","0")
    var container2=document.getElementById("video-container");
    if(container2){
        var scrollQQ=container2.lastElementChild;
        //console.log("scrollQQ:"+scrollQQ.innerHTML)
        if(scrollQQ.class==undefined){
            scrollQQ.innerHTML="";
            //console.log("scrollQQ2:"+scrollQQ.class)
            //scrollQQ.css("opacity","0")
        }
    }
//     var loki=$("div[class^='loki-interact loki-control autohide']");
//     var aiChild= $("div[class^='loki-interact loki-subtitle-button']");
//     var ai='<button class="loki-interact loki-subtitle-button" title="AI字幕"><img class="subtitle-button-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASVSURBVHgB7Zy/axRBFMffShRFwdgoWK2WYuGPxs4TLQQjptVCEYztJRaJGDAbwZDY5GKpYE7EH2UCESwSEu3F/AVeKiFp7oqIkUSf790e+bG782tvN8mc84Fhczs7w8x3Z96+fTsTAIfD4XA4bMWDFCBiOx2KlAqU/EbajdQozVOaoDTped4C5AkJ41OaRXsZp+RDHlDFRUpVtB/uQzdkCVU4gK3HAGQBhiOnVVGOJE8hjk+Hb5TaoTVhI342tfEmgcoS9XkuB5QKsEuhtp1R9IGZhTRg+MQSUcG8ngY50OhLRdIf8xnC81NSoQ+W0RBJ9BQOwBQU+zvjYCkYmoQkzKeZRO0zYCnU9oKgTxVRGU9SGSYWIMBiTPu1BxxSnEAKnEAKnEAKnEAKnEAKchMIwxBJ1Jfi36Mpy4rQqjNzRK3RLDuq6FTQRFnjOiP1G/UrF0eRilZBHiKpUTVHUpY1rjNSv3MUsyQvgcYU+a+bKJumzuwxnasJ5UuYbKSDlGVFaNW5qe6dt0G7GWeDMsYJpMAJpMAJpMAJpMAJpOB/FOgsZOFUmjpUtoHhd7Jy6n41KxDaELKA9Q+kVTClGYEw55BF1qDkS/FOhTtEaIUstpM2aAE6u7F9bR8U6XYX6K763saayfU1itTRyYkR82UueY2ggA5pVnCNUfXay+M6+9BfA+C1AgWd66lD5b0AgyZC5fY2T8VLdLgDelON7zSLE4AmHX3Iq2wDMJ/KNerZ4MdnXknnYivDHR29OEAtD6AZEILDB2Dw7aC8O9Y5ivWR06w4DNVR+wXdQSB/MFslENscgAzEaUBzYWB+BU7IrrFKoFVMZXPg4H6A0yfDY4T2NYRXslFkjQ1qPLEqpuWOklf1vBiKs0Te2dM3AN9/bL1m+TccmSt5taTy1owgGj2dkIKh+xsjh8W6eTl+zaF9IHQtrBGIxu2NpPOS6QOXzwMc0/HLPbgoyrLJk46tjZRNn/pouRKv5OVU/Jwn2a1kk5GOGeeujq3TZ6gL4OTx8PetK/HRM/M1FDIKtohASg4eCEW6cCqcXpthYd5NgzEygRaSTuIObT3AhPa8nwH4ubL1HIvUfztensVZEkd9aqIMY4FA88Uwa7yE9rC9efQiLlKUxWo4vSTMizJkAn0WnC/iTmxF+JvcHh2ROF8GeXyTojyZQKK3XTaWs9stUtuqsD3rIi0niCQyzJv5s6e+pzURoUDkMPO8nBNk+5QqGO4B3ZatCRMlaXvqIvVHRFrUMMw0dcufhsXxod26oe4S3aC56Mmr9LrRpmgPP+7vXQ///jAdf62IUF3z4FxqgRgMty1u9xeHMgl0NynjWi92k1edSXvI9vSoAme60cEA0oVQm+GEaKskxYQCOjyGlPv+gb0GD55MDasjmFqOYiMU2gMSfyEHhPvSpka8gO7+A/rT/HsWleGyOuIw2p40icRDMZvPtnoUULIrmacG2w8aC2Wo+5Gg+mbH+bNcRjcezaT91xQ+HfjtmkMQ/BTLy4jziGWDPS+76OpDMt5Yb8+Nze1h77vuYHrwhZ5uJVHMx+FwOByO1uQfpFsB+pYJBF4AAAAASUVORK5CYII="><div>AI字幕</div><div class="loki-tips"><div class="loki-tips-container"></div><div class="loki-tip-message fade"></div></div></button>';
//     if(loki && !hasAI) {
//         hasAI=true;
//         loki.append(ai);
//     }

}