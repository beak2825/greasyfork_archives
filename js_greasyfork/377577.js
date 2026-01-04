// ==UserScript==
// @name           GomTV Webtoon Download
// @description    Extract image link for GomTV Webtoon
// @namespace https://greasyfork.org/users/3920
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20200316111612
// @downloadURL https://update.greasyfork.org/scripts/377577/GomTV%20Webtoon%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/377577/GomTV%20Webtoon%20Download.meta.js
// ==/UserScript==

(function () {
function addimg(url, savename) {
	var downbtn = document.createElement('a');
	downbtn.setAttribute('href', url+"&title="+encodeURIComponent(savename).replace(/'/g, "%27"));
	downbtn.setAttribute('download', savename);
	downbtn.setAttribute('style', 'display:block;');
	downbtn.innerText = savename;

	var savepage = document.getElementById('savepage');
	if(savepage === undefined || savepage === null)
	{
		savepage = document.createElement('div');
		savepage.setAttribute('id', 'savepage');
		savepage.setAttribute('style', 'width:100%;position:absolute;z-index:1000;padding:50px;');
		document.body.parentElement.insertBefore(savepage, document.body);
	}
	savepage.appendChild(downbtn);
}

function savetoon() {
	var title = document.getElementsByClassName('title');
	var maintitle = title[0].textContent;

	var desc = document.getElementsByClassName('desc');
	var ep = desc[0].textContent;

	var page = 1;

	var imglist = document.getElementsByClassName('c_img');
	[].forEach.call(imglist, function (el) {
		var img = el.getElementsByTagName('img');
		[].forEach.call(img, function (el) {
			addimg(el.src, maintitle + ' ' + ep + '_' + page);
			++page;
		});
	});
}
savetoon();
})();