// ==UserScript==
// @name         暴力清除ClipConverter.cc这个下载Youtube视频的网页工具里的弹出广告
// @namespace    http://tampermonkey.net/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC4UlEQVQ4EVVTXUhTcRQ/5//f1W33+rHcpCFpzY+2XowVoeVDOcGyeuqhgp7Wh0XswaeIIih6KwiVaBn50oPFQBBMHyaRCQm5EAxGMtLIQoX5sd3Nu4+7/eN/vd7swNm5d5zzO+d3zu8iAABjjAAA6k6i0agUj8f7BEGYam1tfQsAVHeTHkt4HSIu8D/+s+npaUc6ne4FgBPFYnE5EokcrK6ujtfW1sp6Im/ETYvaD2OMRxIOh12KogQB4BDidh4iqoSQNUrpjMPhGPJ6vd8BQNgeAH8aAMPDwwcymUwIEZ16MfK4y5EQkhFF8WlnZ+eIDvDLoJBKpdRcLpfVZvvXfTcAUErNiqLcHxsbS3R1dX0weOgUIBgM1mWz2ReI2KwD8fHXCSEypdQCABUAUEYpjbe1tV1wu93zBgVewK2/v9+uL/GkIAhBj8czYLfb8/l8vjQej1dubGwclmX5liRJw36//5lG4ejXhfLIEVeSAwQCgbXBwcHupaWlPlVVV19XN1pVAStGjjXEACANAMsTExPfYrGYj+fz+0MmpXQ1T0Xb+TM3v9+/JYriHUmSwiu5QsNiIj9waXaxHgCKXDYdHR3LPp8vxHM1CvWjn49TNL0RzKYBivTjHixZtVlBzueK4u8t5ZycVJ6YK8U/+yTLjfEW96wuJn6lNWMHda9GQ0Q0n0GzAITSTUDcQmCWQiZfqSbTiCYKgq1ss6bcGpg85eUX4AAbBkD983eN6XRuHBD2AkVAIMCAAQLbGRSAUiipqijst9uuTJ5umUTEhKGDH7cvxpwPg5dz2dxLAGjSlsH1YGhC6wnq+nqyQIpc1hx5ewc7OuDvrnu9js2E7C8Ui2cZogsAJIZIeSohZLHJaeueuXtzTitGlA0KWkcdkAM9DIXo0Kf5mhVZbs+qap+J0jlPnfPal0c9C/oSGSLys2qfM/IpdCeMMbrjVVcf+ErOX3/f3PO4hjFWyhiz6G7ltX8BixAzGimtYEIAAAAASUVORK5CYII=
// @version      0.1
// @description  暴力清除ClipConverter.cc这个下载Youtube视频的网页工具里的弹出广告!
// @author       You
// @include      *.clipconverter.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386295/%E6%9A%B4%E5%8A%9B%E6%B8%85%E9%99%A4ClipConvertercc%E8%BF%99%E4%B8%AA%E4%B8%8B%E8%BD%BDYoutube%E8%A7%86%E9%A2%91%E7%9A%84%E7%BD%91%E9%A1%B5%E5%B7%A5%E5%85%B7%E9%87%8C%E7%9A%84%E5%BC%B9%E5%87%BA%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/386295/%E6%9A%B4%E5%8A%9B%E6%B8%85%E9%99%A4ClipConvertercc%E8%BF%99%E4%B8%AA%E4%B8%8B%E8%BD%BDYoutube%E8%A7%86%E9%A2%91%E7%9A%84%E7%BD%91%E9%A1%B5%E5%B7%A5%E5%85%B7%E9%87%8C%E7%9A%84%E5%BC%B9%E5%87%BA%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        var iframeNodes = document.querySelectorAll('iframe');
        for (var i = 0; i < iframeNodes.length; i++) {
            iframeNodes[i].remove();
        }
        var bdiNodes = document.querySelectorAll('bdi');
        for (var j = 0; j < bdiNodes.length; j++) {
            bdiNodes[j].remove();
        }
        if(document.querySelector('section')){
            document.querySelector('section').remove();
        }
        if(document.querySelector('a[rel="nofollow norefferer noopener"]')){
            document.querySelector('a[rel="nofollow norefferer noopener"]').remove();
        }
        if (document.querySelector('a[href*="weewhaik"]')){
            document.querySelector('a[href*="weewhaik"]').remove();
        }
    },20);
    // Your code here...
})();