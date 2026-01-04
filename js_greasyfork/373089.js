// ==UserScript==
// @name        qidian.read.fiximg
// @description fix images
// @namespace   zhang
// @include     http://www.qidian.com/BookReader/*,*.aspx
// @version 0.0.1.20181010033116
// @downloadURL https://update.greasyfork.org/scripts/373089/qidianreadfiximg.user.js
// @updateURL https://update.greasyfork.org/scripts/373089/qidianreadfiximg.meta.js
// ==/UserScript==
function fixChapterContent(html, cdImg) {
	var reg = /\s*\[\[\[CP\|W:(\d+)\|H:(\d+)\|A:(C|L|R|N)(\|U:([^\s\]]*))?\]\]\]/igm;
	var res = null;
	while ((res = reg.exec(html)) != null) {
		//alert(res.join("\n"));
		var aw = res[1] <= 900 ? res[1] : 900;
		var ah = res[2] <= 600 ? res[2] : 600;
		var ap = res[3];
		var ta = (ap == 'R') ? "right" : ((ap == 'C') ? "center" : ((ap == 'L') ? "left" : ""));
		var cImg = (res[5] == '' || res[5] == undefined) ? cdImg : res[5];
		var cA = (res[5] != '' && res[5] != undefined) ? true : false;
		if (!cA)
			html = html.replace(reg, "<p align='center'><img src='" + cImg + "' style='width:250px;height:190px'></p><P>  ");
		else if (ta == '')
			html = html.replace(reg, "<img src='" + cImg + "' style='width:" + aw + ";height:" + ah + "'>");
		else
			html = html.replace(reg, "<p align='" + ta + "'><img src='" + cImg + "' style='width:" + aw + ";height:" + ah + "'></p><P>  ");
	};
	return html;
};
var elm = document.getElementById('content');
elm.innerHTML = fixChapterContent(elm.innerHTML, "/Images/chapter/cs-1.gif");
