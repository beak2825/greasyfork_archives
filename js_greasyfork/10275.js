// ==UserScript==
// @name         Attack on tounge Shingeki no cat
// @icon          http://1-ps.googleusercontent.com/x/www.catgifpage.com/lh4.ggpht.com/_zLwHwqx7gy4/TEHsskE0vAI/AAAAAAAAFf8/zzjWPfd5xAc/catgifpage90.gif.pagespeed.ce.4hOru5AjmcA_19m091HB.gif
// @description	  Attack on tounge Shingeki no cat -
// @namespace     https://github.com/tangxiadi/Google-Hestia-Anime
// @author       NightStud1OS
// @homepage      -
// @include       http://www.google*
// @include       http://images.google*
// @include       http://news.google*
// @include       http://blogsearch.google*
// @include       http://books.google*
// @include       http://209.85.165.104*
// @include       http://translate.google*
// @include       http://video.google*
// @include       https://translate.google*
// @include       https://encrypted.google*
// @include       https://www.google*
// @include       https://www.google*
// @include       https://images.google*
// @include       https://news.google*
// @include       https://blogsearch.google*
// @include       https://books.google*
// @include       https://209.85.165.104*
// @include       https://translate.google*
// @include       https://video.google*
// @include       http://i.imgur.com*
// @include       http://imgur.com*
// @include       http://osu.ppy.sh*
// @grant         unsafeWindow
// @grant         GM_xmlhttpRequest
// @run-at        document-start
// @version       3.5.5
// @date          6-5-15
// @license      
// @downloadURL https://update.greasyfork.org/scripts/10275/Attack%20on%20tounge%20Shingeki%20no%20cat.user.js
// @updateURL https://update.greasyfork.org/scripts/10275/Attack%20on%20tounge%20Shingeki%20no%20cat.meta.js
// ==/UserScript==

(function() {var css = [
	"img#hplogo {",
	"  box-sizing: border-box;",
	"  background: url(\"http://1-ps.googleusercontent.com/x/www.catgifpage.com/lh4.ggpht.com/_zLwHwqx7gy4/TEHsskE0vAI/AAAAAAAAFf8/zzjWPfd5xAc/catgifpage90.gif.pagespeed.ce.4hOru5AjmcA_19m091HB.gif\") center no-repeat !important;",
	"  padding-left: 521px;",
	"  bottom: 155px;",
    "  z-index: -999;",
	"  position: relative;",
	"  padding-bottom: 335px;",
	"  margin: auto;",
	"}",
	"#gt-src-wrap {",
	"  background: url(\"http://1-ps.googleusercontent.com/x/www.catgifpage.com/lh4.ggpht.com/_zLwHwqx7gy4/TEHsskE0vAI/AAAAAAAAFf8/zzjWPfd5xAc/catgifpage90.gif.pagespeed.ce.4hOru5AjmcA_19m091HB.gif\") 44% 37% no-repeat;",
	"  background-attachment: fixed;",
	"}",
	"#hplogo > div {",
	"display:none;",
	"}",
	"div#hplogo[style] {",
	"position:relative;",
	"top: -213px;",
	"}",
	"#hplogo {text-indent: -9000px !important;white-space: nowrap;}",
	"textarea { color:#fff;}",
	".mw {",
	"background: url(\"http://1-ps.googleusercontent.com/x/www.catgifpage.com/lh4.ggpht.com/_zLwHwqx7gy4/TEHsskE0vAI/AAAAAAAAFf8/zzjWPfd5xAc/catgifpage90.gif.pagespeed.ce.4hOru5AjmcA_19m091HB.gif\") 80% 100% no-repeat;",
	"background-attachment: fixed;",
	"}",
	"#logo img {",
	"background: url(\"http://1-ps.googleusercontent.com/x/www.catgifpage.com/lh4.ggpht.com/_zLwHwqx7gy4/TEHsskE0vAI/AAAAAAAAFf8/zzjWPfd5xAc/catgifpage90.gif.pagespeed.ce.4hOru5AjmcA_19m091HB.gif\") 17% 13% no-repeat !important;",
	"}",
	"div#hplogo {",
	" box-sizing: border-box;",
	" background: url(\"http://1-ps.googleusercontent.com/x/www.catgifpage.com/lh4.ggpht.com/_zLwHwqx7gy4/TEHsskE0vAI/AAAAAAAAFf8/zzjWPfd5xAc/catgifpage90.gif.pagespeed.ce.4hOru5AjmcA_19m091HB.gif\") center no-repeat !important;",
	"  padding-left: 521px;",
	"  bottom: 101px;",
    "  z-index: -999;",
	"  position: relative;",
	"  padding-bottom: 335px;",
	"  margin: auto;",
	"}",
	".sbibod, .jhp input[type=\"submit\"] {",
	"  opacity: 0.7;",
	"}"
].join("\n");

if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node); 
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();