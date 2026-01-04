// ==UserScript==
// @name         航天云课堂小帮手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  跳过视频期间提醒继续学习的弹框,让学习更专注!
// @author       wecome
// @match        https://train.casicloud.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=casicloud.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454488/%E8%88%AA%E5%A4%A9%E4%BA%91%E8%AF%BE%E5%A0%82%E5%B0%8F%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454488/%E8%88%AA%E5%A4%A9%E4%BA%91%E8%AF%BE%E5%A0%82%E5%B0%8F%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    var s_count=0;
var c_count=0;
var t = setInterval(function(){
	if(!!document.getElementsByClassName('alert-shadow')[0]){
console.log(document.getElementsByClassName('alert-shadow')[0])
if(!!document.getElementsByClassName('alert-shadow')[0].style.display){
document.getElementById('D211btn-ok').click();
	c_count++
}
let referse_btns = document.getElementsByClassName('videojs-referse-btn');
  if(referse_btns.length > 0){
    document.getElementsByClassName('videojs-referse-btn')[0].click();
  }
}
	document.getElementById('D78searchContent').setAttribute('placeholder','当前持续时间:'+s_count+'秒,自动关闭次数:'+c_count+'次');
	s_count++
},1000)

})();