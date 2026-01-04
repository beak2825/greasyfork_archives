// ==UserScript==
// @name ReadTools
// @namespace github.com/ileler
// @description **在 屏幕左侧 右击 触发 上一页 按钮，在 屏幕右侧 右击 触发 下一页 按钮；“扩大”翻页的区域，提高翻页效率，提升阅读体验**
// @version 0.1
// @author kerwin612
// @license MIT
// @include *
// @require https://greasyfork.org/scripts/404294-kerwin612/code/Kerwin612.js?version=810055
// @run-at document-start
// @grant GM.getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/404296/ReadTools.user.js
// @updateURL https://update.greasyfork.org/scripts/404296/ReadTools.meta.js
// ==/UserScript==

config.funcConfig = {
	"http://www.duokan.com/reader/www/app.html":
		"function() {\
			return {\
					prevLink: document.getElementsByClassName('j-pageup')[0],\
					nextLink: document.getElementsByClassName('j-pagedown')[0]\
			};\
		}",
	"^.*gitbook\\.io.*$": 
		"function() {\
			let loopEle = function(ele, classNamePattern) {\
				if (new RegExp(classNamePattern).test(ele.className)) return ele;\
				let rst = null;\
				for (let i = 0; i < ele.children.length; i++) {\
					if ((rst = loopEle(ele.children[i], classNamePattern))) break;\
				}\
				return rst;\
			};\
			let classBase;\
			let navPagesLinks;\
			let resultObj = {};\
			if ((classBase = document.getElementById('__GITBOOK__ROOT__CLIENT__').firstChild.className.split('--')[0]) && (navPagesLinks = loopEle(document.getElementById('__GITBOOK__ROOT__CLIENT__'), '^'+ classBase + '--navPagesLinks-.+$'))) {\
				navPagesLinks.children.forEach((val) => {\
					if (new RegExp('^'+ classBase + '.*--cardPrevious-.+$').test(val.className)) resultObj.prevLink = val;\
					if (new RegExp('^'+ classBase + '.*--cardNext-.+$').test(val.className)) resultObj.nextLink = val;\
				});\
			}\
			return resultObj;\
		}",
}

func(
	//startup: url匹配上时就会执行的方法，无须返回值，仅执行一次
	(ctx) => {
		let url = window.location.href;
		for (let [k, v] of Object.entries(config.funcConfig)) {
			if ((url === k || url.startsWith(k) || new RegExp(k).test(url))) {
				ctx.findEleFunc = config.funcConfig[k];
				break;
			}
		}
		if (!ctx.findEleFunc) return;
		ctx.bindEle = function() {
			try {
				delete ctx.prevLink;
				delete ctx.nextLink;

				let findEle = Function('return (' + ctx.findEleFunc + ')')()();
				if (!findEle) return false;
				ctx.prevLink = findEle.prevLink;
				ctx.nextLink = findEle.nextLink;

				if (ctx.prevLink) {
					ctx.prevLink.oldclick = ctx.prevLink.oldclick || ctx.prevLink.onclick;
					ctx.prevLink.onclick = function() {
						console.log('prev-click', ctx);
						ctx.prevLink.oldclick && ctx.prevLink.oldclick();
					}
				}

				if (ctx.nextLink) {
					ctx.nextLink.oldclick = ctx.nextLink.oldclick ||  ctx.nextLink.onclick;
					ctx.nextLink.onclick = function() {
						console.log('next-click', ctx);
						ctx.nextLink.oldclick && ctx.nextLink.oldclick();
					}
				}
				return true;
			} catch(error) {}
			return false;
		}
	}, 
	//ready: url匹配上时就会执行的方法，返回bool类型的值，每30ms执行一次，直至此方法返回true后就不再执行
	(ctx) => {
		return !ctx.findEleFunc || ctx.bindEle();
	}, 
	//run: url匹配上且以上的ready方法返回true后执行的方法，无须返回值，仅执行一次
	(ctx) => {
		if (!ctx.findEleFunc) return;
		window.oncontextmenu = function(e) {
			if (e.screenY < document.body.clientHeight / 3 || !ctx.bindEle()) return true;
			e.preventDefault();

			if (e.screenX > document.body.clientWidth / 2) {
				ctx.nextLink && ctx.nextLink.click();
			} else {
				ctx.prevLink && ctx.prevLink.click();
			}
			return false;     // cancel default menu
		}
	}
);