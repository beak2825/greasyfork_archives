// ==UserScript==
// @name			玛雅BT种子下载去除弹窗广告
// @namespace   40c3ed83e9c7f608d44946a6ffd7a053
// @description		去除玛雅网网盘下载时的弹窗
// @author			me
// @match		http://*/link.php?ref=*
// @version			2016.09.08.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11760/%E7%8E%9B%E9%9B%85BT%E7%A7%8D%E5%AD%90%E4%B8%8B%E8%BD%BD%E5%8E%BB%E9%99%A4%E5%BC%B9%E7%AA%97%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/11760/%E7%8E%9B%E9%9B%85BT%E7%A7%8D%E5%AD%90%E4%B8%8B%E8%BD%BD%E5%8E%BB%E9%99%A4%E5%BC%B9%E7%AA%97%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


if ( document.body.innerHTML.indexOf("Characteristic Code") != -1 ){
	(function(){
		var f = document.getElementsByTagName('form');
		if (f) {
			f[0].setAttribute('onSubmit', '');
		}
	})();
}