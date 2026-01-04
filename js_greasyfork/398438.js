// ==UserScript==
// @name         The Weather Channel定位
// @namespace    http://caiyh.xyz/
// @version      0.1
// @description  天气预报GPS定位
// @author       sky
// @match        https://weather.com/zh-CN/weather/today/l/CHXX0008:1:CH
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398438/The%20Weather%20Channel%E5%AE%9A%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/398438/The%20Weather%20Channel%E5%AE%9A%E4%BD%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var geo = getLocation()
    function getLocation(){
        if(navigator.geolocation){
            //判断是否有这个对象
            navigator.geolocation.getCurrentPosition(function(pos){
                window.location.replace("https://weather.com/zh-CN/weather/today/l/"+pos.coords.latitude+","+pos.coords.longitude)
            })
        }else{
            console.log("当前系统不支持GPS API")
        }
    }
})();