// ==UserScript==
// @name         Vim Style Navigation
// @name:zh-CN   Vim风格导航
// @namespace    http://www.vatery.com/
// @version      1.1.2
// @description  Scroll smoothly. Use (h,j,k,l) to scroll around.  gg to go to top G to to bottom. d to PageDown u to PageUp.
// @description:zh-CN 顺滑的滚动；使用j/k上下滚动，gg到顶部，G到底部
// @author       y-not-u
// @license      MIT
// @match        http*://*
// @match		     *://*/*
// @match		     *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456709/Vim%20Style%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/456709/Vim%20Style%20Navigation.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var keyLog = []

	document.onkeypress = function (e) {
		// if user is typing inside of a text box return
    var nodeName = e.target.nodeName;
		if (nodeName == 'INPUT' || nodeName == 'TEXTAREA' ) return;
		// event
		e = e || window.event;
		// horizontal and vertical
		var h = 0;
		var v = 0;
		// scroll amount
		keyLog.push(e.keyCode)
// 		console.log(keyLog)
		var sa = 100;
		switch (e.keyCode){
			case 104:	// h
				h -= sa;
				keyLog = [];
				break;
			case 106:	// j
				v += sa;
				keyLog = [];
				break;
			case 107:	// k
				v -= sa;
				keyLog = [];
				break;
			case 108:	// l
				h += sa;
				keyLog = [];
				break;
            case 100: // d
				v = v + sa + 300;
				keyLog = [];
				break;
            case 117: // u
				v = v - sa - 300;
				keyLog = [];
				break;
            case 120: // x
                closeTab()
                window.close()
				break;
			case 103: // gg
				if (keyLog[keyLog.length-2] != 103) {
					break;
				}
				keyLog = [];
                scrollSmoothTo(0);
				return;
			case 71:	// G
                scrollSmoothTo(document.documentElement.scrollHeight)
				keyLog = [];
				return;
			default:
				keyLog = [];
				break;
		}
// 		window.scrollBy(h, v);
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    scrollSmoothTo(v + scrollTop)
	};
})();

var scrollSmoothTo = function (position) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            return setTimeout(callback, 17);
        };
    }
    // 当前滚动高度
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    // 滚动step方法
    var step = function () {
        // 距离目标滚动距离
        var distance = position - scrollTop;
        // 目标滚动位置
        scrollTop = scrollTop + distance / 5;
        if (Math.abs(distance) < 1) {
            window.scrollTo(0, position);
        } else {
            window.scrollTo(0, scrollTop);
            requestAnimationFrame(step);
        }
    };
    step();
};
