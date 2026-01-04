// ==UserScript==
// @name           Plurk R18 Timeline
// @namespace      Plurk
// @version        0.1
// @include        http://www.plurk.com/*
// @include        https://www.plurk.com/*
// @description 噗浪 R18 河道
// @downloadURL https://update.greasyfork.org/scripts/422883/Plurk%20R18%20Timeline.user.js
// @updateURL https://update.greasyfork.org/scripts/422883/Plurk%20R18%20Timeline.meta.js
// ==/UserScript==

(function(file, isTop) {
	if (!(isTop && window != top)) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = file;
		document.body.appendChild(script);
	}
})("https://rawgit.com/stu43005/userscript/master/plurk/r18_timeline/r18_timeline.js", true);

/*
網址列(或書籤)用：
javascript:(function(d,f){var s=d.createElement('script');s.type='text/javascript';s.src=f;d.body.appendChild(s)})(document,"https://rawgit.com/stu43005/userscript/master/plurk/r18_timeline/r18_timeline.js")
*/
