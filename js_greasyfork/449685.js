// ==UserScript==
// @name 美化字体, 滚动条, 指向图片发光, 文本选中样式BY_江小白
// @description 美化字体, 滚动条, 指向图片发光, 文本选中样式。
// @author jxb
// @version 1.7
// @match *://*/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @noframes
// @run-at document-body
// @namespace https://greasyfork.org/users/694396
// @downloadURL https://update.greasyfork.org/scripts/449685/%E7%BE%8E%E5%8C%96%E5%AD%97%E4%BD%93%2C%20%E6%BB%9A%E5%8A%A8%E6%9D%A1%2C%20%E6%8C%87%E5%90%91%E5%9B%BE%E7%89%87%E5%8F%91%E5%85%89%2C%20%E6%96%87%E6%9C%AC%E9%80%89%E4%B8%AD%E6%A0%B7%E5%BC%8FBY_%E6%B1%9F%E5%B0%8F%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/449685/%E7%BE%8E%E5%8C%96%E5%AD%97%E4%BD%93%2C%20%E6%BB%9A%E5%8A%A8%E6%9D%A1%2C%20%E6%8C%87%E5%90%91%E5%9B%BE%E7%89%87%E5%8F%91%E5%85%89%2C%20%E6%96%87%E6%9C%AC%E9%80%89%E4%B8%AD%E6%A0%B7%E5%BC%8FBY_%E6%B1%9F%E5%B0%8F%E7%99%BD.meta.js
// ==/UserScript==


-function() {
	'use strict';
	try {
		if (self != top) {
			return false;
		} else {
			if (document.readyState || document.childNodes || document.onreadystatechange) {
				jiangxiaobai()
			} else {
				jiangxiaobai()
			}
			function jiangxiaobai() {
				let css = '', obj = location.host;
				function qhgdt() {
					try {
						if (GM_getValue('qhgdt') != "1") {
							GM_setValue('qhgdt', '1');
							alert('关闭--滚动条美化');
							location.reload();
						} else {
							GM_setValue('qhgdt', '0');
							alert('开启--滚动条美化');
							location.reload();
						}
					} catch (err) {}
				};
				function qhtp() {
					try {
						if (GM_getValue('qhtp') != "1") {
							GM_setValue('qhtp', '1');
							alert('关闭--指向图片发光');
							location.reload();
						} else {
							GM_setValue('qhtp', '0');
							alert('开启--指向图片发光');
							location.reload();
						}
					} catch (err) {}
				};
				function qhwb() {
					try {
						if (GM_getValue('qhwb') != "1") {
							GM_setValue('qhwb', '1');
							alert('关闭--文本选中样式');
							location.reload();
						} else {
							GM_setValue('qhwb', '0');
							alert('开启--文本选中样式');
							location.reload();
						}
					} catch (err) {}
				};
				function jxbgdta() {
					css += ['::-webkit-resizer,::-webkit-scrollbar-button,::-webkit-scrollbar-corner{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}::-webkit-scrollbar-track{border-left-color:transparent!important;background:transparent!important;-webkit-box-shadow:none!important;border:none!important;outline:none!important}::-webkit-full-screen{visibility:visible;max-width:none}::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-track-piece{-webkit-border-radius:10px;background-color:transparent!important}::-webkit-scrollbar-thumb:vertical{height:10px;-webkit-border-radius:10px;background-color:#d0aba8}::-webkit-scrollbar-thumb:horizontal{width:10px;-webkit-border-radius:10px;background-color:#d1ac96}::-webkit-scrollbar-track-piece:no-button,::-webkit-scrollbar-thumb{border-radius:10px;background-color:transparent}::-webkit-scrollbar-thumb:hover{background-color:red}::-webkit-scrollbar-thumb:active{background-color:#4caf50}::-webkit-scrollbar-button:horizontal,::-webkit-scrollbar-button:vertical{width:10px}::-webkit-scrollbar-button:horizontal:end:increment,::-webkit-scrollbar-button:horizontal:start:decrement,::-webkit-scrollbar-button:vertical:end:increment,::-webkit-scrollbar-button:vertical:start:decrement{background-color:transparent!important}::-moz-resizer,::-moz-scrollbar-button,::-moz-scrollbar-corner{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}::-moz-scrollbar-track{border-left-color:transparent!important;background:transparent!important;-moz-box-shadow:none!important;border:none!important;outline:none!important}::-moz-full-screen{visibility:visible;max-width:none}::-moz-scrollbar{width:10px;height:10px}::-moz-scrollbar-track-piece{-moz-border-radius:10px;background-color:transparent!important}::-moz-scrollbar-thumb:vertical{height:10px;-moz-border-radius:10px;background-color:#d0aba8}::-moz-scrollbar-thumb:horizontal{width:10px;-moz-border-radius:10px;background-color:#d1ac96}::-moz-scrollbar-track-piece:no-button,::-moz-scrollbar-thumb{border-radius:10px;background-color:transparent}::-moz-scrollbar-thumb:hover{background-color:red}::-moz-scrollbar-thumb:active{background-color:#4caf50}::-moz-scrollbar-button:horizontal,::-moz-scrollbar-button:vertical{width:10px}::-moz-scrollbar-button:horizontal:end:increment,::-moz-scrollbar-button:horizontal:start:decrement,::-moz-scrollbar-button:vertical:end:increment,::-moz-scrollbar-button:vertical:start:decrement{background-color:transparent!important}::-ms-resizer,::-ms-scrollbar-button,::-ms-scrollbar-corner{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}::-ms-scrollbar-track{border-left-color:transparent!important;background:transparent!important;-ms-box-shadow:none!important;border:none!important;outline:none!important}::-ms-full-screen{visibility:visible;max-width:none}::-ms-scrollbar{width:10px;height:10px}::-ms-scrollbar-track-piece{-ms-border-radius:10px;background-color:transparent!important}::-ms-scrollbar-thumb:vertical{height:10px;-ms-border-radius:10px;background-color:#d0aba8}::-ms-scrollbar-thumb:horizontal{width:10px;-ms-border-radius:10px;background-color:#d1ac96}::-ms-scrollbar-track-piece:no-button,::-ms-scrollbar-thumb{border-radius:10px;background-color:transparent}::-ms-scrollbar-thumb:hover{background-color:red}::-ms-scrollbar-thumb:active{background-color:#4caf50}::-ms-scrollbar-button:horizontal,::-ms-scrollbar-button:vertical{width:10px}::-ms-scrollbar-button:horizontal:end:increment,::-ms-scrollbar-button:horizontal:start:decrement,::-ms-scrollbar-button:vertical:end:increment,::-ms-scrollbar-button:vertical:start:decrement{background-color:transparent!important}::-o-resizer,::-o-scrollbar-button,::-o-scrollbar-corner{display:none!important;max-width:0!important;max-height:0!important;overflow:hidden!important;position:absolute;left:-102030px}::-o-scrollbar-track{border-left-color:transparent!important;background:transparent!important;-o-box-shadow:none!important;border:none!important;outline:none!important}::-o-full-screen{visibility:visible;max-width:none}::-o-scrollbar{width:10px;height:10px}::-o-scrollbar-track-piece{-o-border-radius:10px;background-color:transparent!important}::-o-scrollbar-thumb:vertical{height:10px;-o-border-radius:10px;background-color:#d0aba8}::-o-scrollbar-thumb:horizontal{width:10px;-o-border-radius:10px;background-color:#d1ac96}::-o-scrollbar-track-piece:no-button,::-o-scrollbar-thumb{border-radius:10px;background-color:transparent}::-o-scrollbar-thumb:hover{background-color:red}::-o-scrollbar-thumb:active{background-color:#4caf50}::-o-scrollbar-button:horizontal,::-o-scrollbar-button:vertical{width:10px}::-o-scrollbar-button:horizontal:end:increment,::-o-scrollbar-button:horizontal:start:decrement,::-o-scrollbar-button:vertical:end:increment,::-o-scrollbar-button:vertical:start:decrement{background-color:transparent!important}'].join('\n');
				};
				function jxbtpa() {
					css += ['.icon{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}img:hover{box-shadow:0 0 4px 4px rgba(130,190,10,0.6)!important;-moz-transition-property:box-shadow;-moz-transition-duration:.31s}img{-moz-transition-property:box-shadow;-moz-transition-duration:.31s}'].join('\n');
				};
				function jxbwba() {
					css += ['::selection{background:#333!important;color:#0f0!important}::-moz-selection{background:#333!important;color:#0f0!important}::-ms-selection{background:#333!important;color:#0f0!important}::-o-selection{background:#333!important;color:#0f0!important}'].join('\n');
				};
				if (!(obj.match(/(?:greasyfork|(?:\d{1,3}\.){3})\./i))) {
					function qhzt() {
						try {
							if (GM_getValue('qhzt') == null || GM_getValue('qhzt') == "0") {
								GM_setValue('qhzt', '1');
								alert('使用第一套字体');
								location.reload();
							} else if (GM_getValue('qhzt') == "1") {
								GM_setValue('qhzt', '2');
								alert('使用第二套字体');
								location.reload();
							} else {
								GM_setValue('qhzt', '0');
								alert('关闭了字体美化');
								location.reload();
							}
						} catch (err) {}
					};
					function jxbzta() {
						css += [':not([class*=-chevron-]):not([id*=-chevron-]):not([class*=Logo]):not([id*=Logo]):not([class*=ico]):not([id*=ico]):not([class*=ui]):not([id*=ui]):not([class*=font]):not([id*=font]):not([class*=logo]):not([id*=logo]):not([class*=pre]):not([id*=pre]):not([class*=next]):not([id*=next]):not([class*=close]):not([id*=close]):not([class*=_]):not([id*=_]):not(.fa):not(.fas):not(icon):not([src]):not(hr):not(br):not(ui):not(placeholder):not(iframe):not(embed):not(object):not(video):not(span):not(head):not(meta):not(title):not(link):not(script):not(style):not(img):not(svg):not(d):not(i):not(s):not(p){font-weight:bolder;font-family:Microsoft YaHei,VideoJS,Verdana,Roboto,arial,FontAwesome,YouTube Noto，myfont，Source Han Sans SC，Noto Sans CJK SC，HanHei SC，sans-serif，icomoon，Icons，brand-icons，Material Icons，Material Icons Extended，Glyphicons Halflings,simhei,Monaco,Courier New,Trebuchet MS,Time News Roman,Tahoma,Comic Sans MS,Impact,MingLiU,PMingLiU,MS UI Gothic,DengXian，Segoe UI，Lucida Grande，Helvetica，FreeSans，Arimo，Droid Sans，wenquanyi micro hei，Hiragino Sans GB，Hiragino Sans GB W3,Georgia;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}'].join('\n');
					};
					try {
						if (GM_getValue('qhzt') == null || GM_getValue('qhzt') == "1") {
							jxbzta();
						} else if (GM_getValue('qhzt') == "2") {
							css += ['html textarea{resize:both!important}textarea{background-image:none!important}body{text-rendering:optimizeLegibility}.foo{text-rendering:optimizeSpeed}.blink,[style*=blink],blink{text-decoration:inherit!important}:not([class*=-chevron-]):not([id*=-chevron-]):not([class*=Logo]):not([id*=Logo]):not([class*=ico]):not([id*=ico]):not([class*=ui]):not([id*=ui]):not([class*=font]):not([id*=font]):not([class*=logo]):not([id*=logo]):not([class*=pre]):not([id*=pre]):not([class*=next]):not([id*=next]):not([class*=close]):not([id*=close]):not([class*=_]):not([id*=_]):not(.fa):not(.fas):not([type]):not([viewBox]):not(icon):not([src]):not(hr):not(br):not(ui):not(section):not(article):not(small):not(placeholder):not(star-segements-guide):not(container):not(guide-container):not(danmu-guide):not(outer-bottom):not(iframe):not(embed):not(object):not(video):not(span):not(path):not(html):not(body):not(head):not(meta):not(title):not(aside):not(link):not(script):not(style):not(img):not(val):not(svg):not(symbol):not(d):not(i):not(s):not(p){font-weight:700;font-family:Georgia,Microsoft YaHei,serif;text-rendering:optimizeSpeed;filter:none!important}'].join('\n');
						} else {}
					} catch (err) {
						jxbzta();
					}
					try {
						if (GM_getValue('qhzt') == '1') {
							GM_registerMenuCommand("使用第二套字体", qhzt);
						} else if (GM_getValue('qhzt') == '2') {
							GM_registerMenuCommand("使用第一套字体", qhzt);
						} else {
							GM_registerMenuCommand("切换字体美化状态", qhzt);
						}
					} catch (err) {}
				} else {}
				try {
					if (GM_getValue('qhgdt') != "1") {
						GM_registerMenuCommand("关闭--滚动条美化", qhgdt);
						jxbgdta();
					} else {
						GM_registerMenuCommand("开启--滚动条美化", qhgdt);
					}
					if (GM_getValue('qhtp') != "1") {
						GM_registerMenuCommand("关闭--指向图片发光", qhtp);
						jxbtpa();
					} else {
						GM_registerMenuCommand("开启--指向图片发光", qhtp);
					}
					if (GM_getValue('qhwb') != "1") {
						GM_registerMenuCommand("关闭--文本选中样式", qhwb);
						jxbwba();
					} else {
						GM_registerMenuCommand("开启--文本选中样式", qhwb);
					}
				} catch (err) {
					jxbgdta();
					jxbtpa();
					jxbwba();
				}
				function stylusjiangxiaobai() {
					document.head.insertAdjacentHTML("beforeend", '<style id = "jiangxiaobaizitimeihua" type = "text/css" media = "all" class = "stylus">' + css + "</style>")
				};
				try {
					var stylusjiangxiaobaicss = document.querySelector("style#jiangxiaobaizitimeihua");
					if (stylusjiangxiaobaicss) {} else {
						stylusjiangxiaobai()
					}
				} catch (err) {
					stylusjiangxiaobai()
				}
			}
		}
	} catch (err) {
		return false;
	}
}(Object);