// ==UserScript==
// @name         No Adult Verification
// @namespace    http://userscripts.org/users/92143
// @version      2.6
// @description  Skips adult verification of getchu.com and the like. 绕过Getchu等网站的成人检测。
// @include      /^http\:\/\/([^\.\/]+\.)?getchu\.com\//
// @include      /^http\:\/\/([^\.\/]+\.)?(dm5|jpmanga)\.com\//
// @include      /^http\:\/\/([^\.\/]+\.)?dlsite\.com\//
// @include      /^http\:\/\/([^\.\/]+\.)?amazon\.co\.jp\//
// @include      /^https?\:\/\/([^\.]*\.)?toranoana\.jp\//
// @include      /^http\:\/\/bt\.orzx\.im\/list\.php\?BoardID\=2\&ItemID\=17/
// @include      /^http\:\/\/rule34\.paheal\.net\//
// @include      /^https?\:\/\/(www\.)?a1c\.jp\/\~(chuchu|grandcru|majin|shelf)\/$/
// @include      /^https?\:\/\/(www\.)?a1c\.jp\/a1c\-ch\/$/
// @include      /^http\:\/\/(www\.)?(call\-it\-anything\.net|komagata\.biz|poro\.cc|suzukimirano\.com)\/$/
// @include      /^http\:\/\/(www\.)?chichinoya\.jp\/$/
// @include      /^http\:\/\/(www\.)?el-soft\.jp\/$/
// @include      /^http\:\/\/(www\.)?(lune\-soft\.jp\/lune\-pictures|ordin\-soft\.com)\/$/
// @include      /^https?\:\/\/(www\.)?mary\-jane\.biz\/$/
// @include      /^http\:\/\/(www\.)?ms\-pictures\.com\/$/
// @include      /^http\:\/\/(www\.)?(pashmina|vanilla)\-jp\.com\/$/
// @include      /^https?\:\/\/(www\.)?pinkpineapple\.co\.jp\/$/
// @include      /^http\:\/\/(www\.)?pixy\-soft\.com\/$/
// @include      /^http\:\/\/(www\.)?(sprechchor\.kir|milcan)\.jp\/$/
// @include      /^http\:\/\/(www\.)?world\-pg\.com\/$/
// @author       zanetu
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/40492/No%20Adult%20Verification.user.js
// @updateURL https://update.greasyfork.org/scripts/40492/No%20Adult%20Verification.meta.js
// ==/UserScript==

var url = location.href
//year 2038 problem
var EXPIRATION = 'expires=Tue, 19 Jan 2038 03:14:07 GMT;'
var dataArray = [{
	site: /^http\:\/\/([^\.]*\.)?getchu\.com\//, 
	cookies: ['getchu_adalt_flag=getchu.com;path=/;' + EXPIRATION], 
	flagOrPath: 'getchu_adalt_flag='
}, {
	site: /^http\:\/\/([^\.]*\.)?dl\.getchu\.com\//, 
	cookies: ['ADULT_GATE=1;path=/;domain=.getchu.com;' + EXPIRATION], 
	flagOrPath: 'ADULT_GATE='
}, {
	site: /^http\:\/\/([^\.]*\.)?(dm5|jpmanga)\.com\//, 
	cookies: ['isAdult=1;path=/;' + EXPIRATION], 
	flagOrPath: 'isAdult='
}, {
	site: /^http\:\/\/([^\.]*\.)?dlsite\.com\//, 
	cookies: ['adultchecked=1;path=/;' + EXPIRATION], 
	flagOrPath: 'adultchecked='
}, {
	site: /^https?\:\/\/([^\.]*\.)?toranoana\.jp\//, 
	cookies: ['afg=0;path=/;domain=toranoana.jp;' + EXPIRATION], 
	flagOrPath: 'afg='
}, {
	site: /^http\:\/\/bt\.orzx\.im\/list\.php\?BoardID\=2\&ItemID\=17/, 
	cookies: ['An_x18c=1;path=/;' + EXPIRATION], 
	flagOrPath: 'An_x18c='
}, {
	site: /^http\:\/\/rule34\.paheal\.net\//, 
	cookies: ['ui-tnc-agreed=true;path=/;' + EXPIRATION], 
	flagOrPath: 'ui-tnc-agreed='
}, {
	//a1c
	site: /^https?\:\/\/(www\.)?a1c\.jp\/\~(chuchu|grandcru|majin|shelf)\/$/, 
	cookies: [], 
	flagOrPath: 'top.html'
}, {
	//a1c
	site: /^https?\:\/\/(www\.)?a1c\.jp\/a1c\-ch\/$/, 
	cookies: [], 
	flagOrPath: 'main.htm'
}, {
	//a1c
	site: /^http\:\/\/(www\.)?(call\-it\-anything\.net|komagata\.biz|poro\.cc|suzukimirano\.com)\/$/, 
	cookies: [], 
	flagOrPath: 'top.html'
}, {
	//chichinoya
	site: /^http\:\/\/(www\.)?chichinoya\.jp\/$/, 
	cookies: [], 
	flagOrPath: 'chichi/index.html'
}, {
	//l.
	site: /^http\:\/\/(www\.)?el-soft\.jp\/$/, 
	cookies: [], 
	flagOrPath: 'top'
}, {
	//lune-pictures, valkyria, etc
	site: /^http\:\/\/(www\.)?(lune\-soft\.jp\/lune\-pictures|ordin\-soft\.com)\/$/, 
	cookies: [], 
	flagOrPath: 'top.html'
}, {
	//mary-jane
	site: /^https?\:\/\/(www\.)?mary\-jane\.biz\/$/, 
	cookies: [], 
	flagOrPath: 'mysite1/index.html'
}, {
	//animan, bootleg, milky, platinum milky, etc
	site: /^http\:\/\/(www\.)?ms\-pictures\.com\/$/, 
	cookies: [], 
	flagOrPath: 'top.html'
}, {
	//pashmina, vanilla, etc
	site: /^http\:\/\/(www\.)?(pashmina|vanilla)\-jp\.com\/$/, 
	cookies: [], 
	flagOrPath: 'top/top.html'
}, {
	//pinkpineapple
	site: /^https?\:\/\/(www\.)?pinkpineapple\.co\.jp\/$/, 
	cookies: [], 
	flagOrPath: 'index.php'
}, {
	//pixy
	site: /^http\:\/\/(www\.)?pixy\-soft\.com\/$/, 
	cookies: [], 
	flagOrPath: 'home/index.html'
}, {
	//sprechchor, milcan, etc
	site: /^http\:\/\/(www\.)?(sprechchor\.kir|milcan)\.jp\/$/, 
	cookies: [], 
	flagOrPath: 'top.html'
}, {
	//world-pg
	site: /^http\:\/\/(www\.)?world\-pg\.com\/$/, 
	cookies: [], 
	flagOrPath: 'new_products/index.html'
}]
var i = dataArray.length
while(i--) {
	var site = dataArray[i].site
	if(site && site.test(url)) {
		var fOrP = dataArray[i].flagOrPath
		if(fOrP) {
			var siteCookies = dataArray[i].cookies
			if(!siteCookies.length) {
				location.replace(url + fOrP)
			}
			else {
				var isNew = (-1 === document.cookie.indexOf(fOrP))
				if(isNew) {
					var j = siteCookies.length
					while(j--) {
						document.cookie = siteCookies[j]
					}
					//work around first-time redirection
					location.reload()
				}
			}
		}
		break
	}
}

document.addEventListener('DOMContentLoaded', function() {
	if(/^http\:\/\/([^\.\/]+\.)?amazon\.co\.jp/.test(url)) {
		processAmazonCoJp()
	}
}, false)

function processAmazonCoJp() {
	var yes = $('a[href^="/gp/product/black-curtain-redirect.html"]').get(0)
	if(yes) {
		yes.click()
	}
	else {
		var u = $('img[src*="/warning-adult-item"]').closest('a').attr('href')
		if(u) {
			GM_xmlhttpRequest({
				method: 'GET', 
				url: u, 
				onload: function(r1) {
					var m = /href\=\"(\/gp\/product\/black\-curtain\-redirect\.html.*?)\"/.exec(r1.responseText)
					if(m && m[1]) {
						GM_xmlhttpRequest({
							method: 'HEAD', 
							url: 'http://www.amazon.co.jp' + m[1], 
							onload: function(r2) {
								location.reload()
							}
						})
					}
				}
			})
		}
	}
}