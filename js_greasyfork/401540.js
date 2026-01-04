// ==UserScript==
// @name				tinyurl.com - URL shorten button
// @name:zh-TW			tinyurl.com 縮短網址按鈕
// @name:zh-CN			tinyurl.com 缩短网址按钮
// @description			Add a URL shorten button to the bottom left corner. Click it to get a shortened URL (by tinyurl.com) of current page.
// @description:zh-TW	在頁面左下角設置一個縮短網址的按鈕，點按即可從 tinyurl.com 取得目前頁面的縮址
// @description:zh-CN	在页面左下角设置一个缩短网址的按钮，点按即可从 tinyurl.com 取得当前页面的缩址
// @namespace			https://greasyfork.org/zh-TW/users/393133-evan-tseng
// @version				0.41
// @author				Evan Tseng
// @match				*://*/*
// @grant				none
// @run-at				document-end
// @license				MIT
// @downloadURL https://update.greasyfork.org/scripts/401540/tinyurlcom%20-%20URL%20shorten%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/401540/tinyurlcom%20-%20URL%20shorten%20button.meta.js
// ==/UserScript==

(function() {
	'use strict';
	if(location.hostname == "tinyurl.com") {
		var url = new URL(location.href);
		if(url.searchParams.get("trigger") == "shortenButton") {
			var tu = document.body.innerText;
			document.body.innerHTML = "";
			document.write(`<style>
html, body { overflow:hidden }
body { max-width:240pt; height:24pt; font:400 12pt/1.4 sans-serif; text-align:center; padding:0 2pt; margin:0; vertical-align:middle }
.wrap { display:flex; }
.errMsg { font-weight:600; line-height:24pt; }
#sUrl, #ccBtn { font:400 12pt/20pt sans-serif; height:auto; text-align:center; vertical-align:middle; padding:0 .5em; margin:2pt 0; border:none; border-radius:5pt; }
#sUrl { flex:1 1 auto; width:auto; }
#ccBtn { flex:0 0 4em; width:auto; margin-left:1mm; cursor:pointer }
input, button { outline:none }
input:focus, button:focus { box-shadow:0 0 1mm 1px #08f!important }
@media (prefers-color-scheme: light) {
	html, body { color:#333; background:#bbb }
	.errMsg { color:#620 }
	#sUrl, #ccBtn { color:#333; background:#eee; box-shadow:0 0 0 1px #888 }
	#ccBtn:hover { background: #fff }
	#ccBtn:active { color:#800; background: #aaa }
}
@media (prefers-color-scheme: dark) {
	html, body { color:#ccc; background:#444 }
	.errMsg { color:#c83 }
	#sUrl, #ccBtn { color:#ccc; background:#222; box-shadow:0 0 0 1px #666 }
	#ccBtn:hover { background: #333 }
	#ccBtn:active { color:#fa8; background: #000 }
}

</style>`);
			if(tu.match(/^https?:\/\/tinyurl\.com\/\w+$/)) {
				document.write('<div class="wrap"><input id="sUrl" value="' + tu + '" readonly/> <button id="ccBtn" tabindex="1" onclick="copyUrl()">Copy</button></div>');
				document.write(`<script>
function copyUrl() {
	let txtBox = document.querySelector("#sUrl");
	txtBox.focus();
	txtBox.select();
	document.execCommand("copy");
	txtBox.setSelectionRange(0,0)
	document.querySelector("#ccBtn").focus();
}
</script>`);
			}
			else document.write('<div class="errMsg">Error! Unable to shorten this URL.</div>');
		}
	}
	else if(window.self === window.top) {
		(function(){
			const TUcss = `
@media screen {
	.__TUwrap__ { position:fixed!important; left:0!important; bottom:33mm!important; width:0!important; min-width:0!important; margin:0!important; z-index:2147483647!important }
	.__TUbg__ { position:fixed; top:0; left:0; background:rgba(0,0,0,.5); width:100vw; height:100vh; z-index:-1; backdrop-filter:blur(3mm); -webkit-backdrop-filter:blur(3mm); visibility:hidden; opacity:0; transition:.5s, width 0s, height 0s }
	.__TUbg__.show { visibility:visible; opacity:1 }
	.__TUbtn__ { position:absolute; left:.2em; transform:rotate(90deg); width:64pt; height:2em; font:400 12pt/1.4 arial!important; text-align:center!important; padding:0!important; margin:0 -32pt!important; border-radius:5px 5px 0 0; opacity:.4; white-space:nowrap; cursor:pointer; transition:.3s,left .5s .5s; }
	.__TUbtn__.active, .__TUbtn__:hover { left:.9em; opacity:1; transition:.1s;}
	.__TUbtn__:active { box-shadow: inset 1px 0 1mm 1px rgba(0,0,0,.5); transition:0s}
	.__TUbox__ { position:absolute; left:12mm; top:-3mm; display:none; box-sizing:content-box; width:244pt; height:24pt; padding:3mm; border-radius:3mm; backdrop-filter:blur(3mm); -webkit-backdrop-filter:blur(3mm)}
	.__TUbox__.show { display:block; }
	.__TUbox__ .msg { text-align:center; font-size:10pt; line-height: 24pt }
	.__TUbox__::before { position:absolute; top:50%; left:-6px; display:block; content:""; margin:-6px 0; border-top:6px solid transparent;border-bottom:6px solid transparent; z-index:2 }
	.__TUbox__::after { position:absolute; top:50%; left:-7px; display:block; content:""; margin:-6px 0; border-top:6px solid transparent;border-bottom:6px solid transparent; border-right:6px solid #777; z-index:-1 }
	.__TUpage__ { display:block!important; width:244pt; height:24pt; background:transparent; background-image:none; border:none; }
}
@media (prefers-color-scheme: light) {
	.__TUbtn__ { color:#333!important; background:#bbb!important; border:1px solid #999; box-shadow:0 0 0 1px rgba(0,0,0,.3) }
	.__TUbtn__:hover { background:#ddd!important; box-shadow: 2px 0 2mm 1px rgba(0,0,0,.5) }
	.__TUbtn__:active { color:#eee!important; background:#777!important }
	.__TUbox__ { color:#333!important; background:#bbb!important; box-shadow:0 0 0 1px #777, 0 1mm 5mm rgba(0,0,0,.3) }
	.__TUbox__::before { border-right:6px solid #bbb }
}
@media (prefers-color-scheme: dark) {
	.__TUbtn__ { color:#ccc!important; background:#444!important; border:1px solid #555; box-shadow:0 0 0 1px rgba(255,255,255,.3) }
	.__TUbtn__:hover { background:#333!important; box-shadow: 2px 0 2mm 1px rgba(255,255,255,.5) }
	.__TUbtn__:active { color:#ddd!important; background:#222!important; }
	.__TUbox__ { color:#ccc!important; background:#444!important; box-shadow:0 0 0 1px #777, 0 1mm 5mm rgba(255,255,255,.3); }
	.__TUbox__::before { border-right:6px solid #444; }
}
@media print {
	.__TUwrap__ { display: none }
}`;

			let cssStyle = document.createElement('style');
			if(cssStyle.styleSheet)	cssStyle.styleSheet.cssText = TUcss;
			else	cssStyle.appendChild(document.createTextNode(TUcss));
			document.querySelector('head').appendChild(cssStyle);

			var TUwrap = null,
				TUbtn = null,
				TUbg = null,
				TUbox = null,
				TUpage = null;

			function query(theUrl){
				close();
				let queryURL = 'https://tinyurl.com/api-create.php?trigger=shortenButton&url=' + encodeURIComponent(theUrl);
				TUpage = document.createElement('iframe');
				TUpage.classList.add('__TUpage__');
				TUpage.src = queryURL;
				TUbox.appendChild(TUpage);
				TUbox.classList.add('show');
				TUbg.classList.add('show');
				TUbtn.classList.add('active');
			}

			function close(){
				if(TUpage) {
					TUbtn.classList.remove('active');
					TUbox.classList.remove('show');
					TUpage.remove();
					TUpage = null;
				}
				TUbg.classList.remove('show')
			}

			(function initialize(){
				TUwrap = document.createElement('div');
				TUwrap.classList.add('__TUwrap__');
				TUbg = document.createElement('div');
				TUbg.classList.add('__TUbg__');
				TUbtn = document.createElement('button');
				TUbtn.classList.add('__TUbtn__');
				TUbtn.innerText = "TinyURL"
				TUbox = document.createElement('div');
				TUbox.classList.add('__TUbox__');

				document.documentElement.appendChild(TUwrap);
				TUwrap.appendChild(TUbg);
				TUwrap.appendChild(TUbtn);
				TUwrap.appendChild(TUbox);
				TUbg.addEventListener('click', close );
				TUbtn.addEventListener('click', function(){ query(window.location.href); });

				document.addEventListener("securitypolicyviolation", (e) => {
			  		if(e.violatedDirective == "frame-src") {
						if(TUbox) TUbox.innerHTML = '<div class="msg">Sorry, TinyURL iframe is blocked on this site!</div>';
					}
				});

			})();
		})();
	}

})();