// ==UserScript==
// @name         众播课---zhongbke
// @namespace    代刷vx：shuake345
// @version      0.1
// @description  自动播放课程|自动切换课程|秒刷代刷vx：shuake345
// @author       代刷vx：shuake345
// @match        https://www.zhongbke.com/*
// @icon         https://www.zhongbke.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476281/%E4%BC%97%E6%92%AD%E8%AF%BE---zhongbke.user.js
// @updateURL https://update.greasyfork.org/scripts/476281/%E4%BC%97%E6%92%AD%E8%AF%BE---zhongbke.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function spbofang(){
    if(document.getElementsByTagName('video').length==1){//have vid
        if(document.getElementsByTagName('video')[0].paused==false){//ing
            setTimeout(sxrefere,5000)
        }
    }
    }
    setInterval(spbofang,12000)

    function sxrefere() {
		if(document.getElementsByClassName('section-cur section')[0].nextElementSibling.querySelector('i')==null){//nextis no vid
            document.getElementsByClassName('section-cur section')[0].nextElementSibling.nextElementSibling.querySelector('a').click()
        }else {document.getElementsByClassName('section-cur section')[0].nextElementSibling.querySelector('a').click()}
	}
})();