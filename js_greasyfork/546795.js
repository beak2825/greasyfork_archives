// ==UserScript==
// @name         安泰培训系统
// @namespace    vx:shuake345
// @version      0.1
// @description  vx:shuake345
// @author       vx:shuake345
// @match        https://zmhjap.yunkeonline.cn/usercenter/#/player/7520/342721?targetType=2&targetId=2119
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546795/%E5%AE%89%E6%B3%B0%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/546795/%E5%AE%89%E6%B3%B0%E5%9F%B9%E8%AE%AD%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
function fhback() {
		window.history.go(-1)
	}

	function gbclose() {
		window.close()
	}

	function sxrefere() {
		window.location.reload()
	}
    function miaoshua(){
        if(document.getElementsByTagName('video').length==1){
            document.getElementsByTagName('video')[0].play()
        document.getElementsByTagName('video')[0].currentTime=13600
        }else{//点击开始，还没进入课程播放
            document.querySelector("div.cell > button > span").click()
        }
    }
    setInterval(miaoshua,3121)
    setTimeout(sxrefere,300000)
    // Your code here...
})();