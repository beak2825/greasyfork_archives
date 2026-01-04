// ==UserScript==
// @license MIT
// @name		        頁面捲動scroll快速鍵(L改)
// @author		      duola,Leadra
// @description	    頁面滾動scroll；上下左右移動；pageup,pagedown代替；頁首頁尾按鈕
// @namespace       https://greasyfork.org/zh-TW/users/4839
// @version  1.7.3
// @match    *://*/*
// @grant		 none
// @icon     data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUBAMAAAByuXB5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURf///6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpshoL4AAAAIdFJOUwARM2aImczuGAB4owAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAE1JREFUGNNjYGDg6OjoaGAAAfJZHTDAEAFltDKwQFkODAwWYEYzUCFzBZDRbgDSqw5kFYFNYaroaFcAsxjEOhIhDAbGNAEGHABhG5wFAH6qMUfw6SaOAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/440323/%E9%A0%81%E9%9D%A2%E6%8D%B2%E5%8B%95scroll%E5%BF%AB%E9%80%9F%E9%8D%B5%28L%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440323/%E9%A0%81%E9%9D%A2%E6%8D%B2%E5%8B%95scroll%E5%BF%AB%E9%80%9F%E9%8D%B5%28L%E6%94%B9%29.meta.js
// ==/UserScript==

/* ************************ 頁面效果 ************************ */
//topbottom按鈕最下方已註釋掉
//原作者-哆啦B梦的弟弟https://greasyfork.org/scripts/794
//Jump to Top/Bottom of page with hotkeys
(function () {
  //var newHeight = document.body.scrollHeight + 9999999999;
  //var newWidth = document.body.scrollWidth + 9999999999;

    var scroll = {

  //'j' : function() { scrollBy(0,  -400) },
	//'k'	: function() { scrollBy(0,  400) }, // 往下翻400px

	'4' : function() { scrollBy(-window.innerWidth/2 ,  0) },//往左
	'b' : function() { scrollBy(-window.innerWidth/2 ,  0) },
	'B' : function() { scrollBy(-window.innerWidth/2 ,  0) },

	'5' : function() { scrollBy(window.innerWidth/2 ,  0) },//往右
	'n' : function() { scrollBy(window.innerWidth/2 ,  0) },
	'N' : function() { scrollBy(window.innerWidth/2 ,  0) },

	'd' : function() { scrollBy(0,  window.innerHeight / 2) },//往下半
  'D' : function() { scrollBy(0,  window.innerHeight / 2) },
	'c' : function() { scrollBy(0,  window.innerHeight / 2) },
  'C' : function() { scrollBy(0,  window.innerHeight / 2) },
	'3' : function() { scrollBy(0,  window.innerHeight / 2) },

	'a' : function() { scrollBy(0, -window.innerHeight / 2) },//往上半
  'A' : function() { scrollBy(0, -window.innerHeight / 2) },
	'z' : function() { scrollBy(0, -window.innerHeight / 2) },
  'Z' : function() { scrollBy(0, -window.innerHeight / 2) },
	'1' : function() { scrollBy(0, -window.innerHeight / 2) },

	'f' : function() { scrollBy(0, -window.innerHeight) },//往上頁
  'F' : function() { scrollBy(0, -window.innerHeight) },

	'g' : function() { scrollBy(0, window.innerHeight) },//往下頁
	'G' : function() { scrollBy(0, window.innerHeight) },

	'w' : function() { scrollTo(0, 0) },//回頁首
	'W' : function() { scrollTo(0, 0) },

	's' : function() { scrollTo(0,document.body.scrollHeight) },//回頁尾
	'S' : function() { scrollTo(0,document.body.scrollHeight) },
    };
    var formElement = { 'input':true, 'button':true, 'select':true, 'textarea':true };
    window.addEventListener('keypress',
        function(e) {
            if (e.metaKey || e.ctrlKey || e.altKey ||
                formElement[e.target.tagName.toLowerCase()] || e.target.isContentEditable || document.designMode ==="on") {
                return; }
            var key = (e.shiftKey? 'S-' : '') + String.fromCharCode(e.charCode);
            if (scroll[key]) {
                scroll[key]();
                e.preventDefault();
                e.stopPropagation();
            }
        }, false);
})();
/*
//top按钮
function create_top_button() {
	var a = document.createElement('span');
	var c = 'opacity:0.1;-moz-transition-duration:0.0s;-webkit-transition-duration:0.0s;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUBAMAAAByuXB5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURf///6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpshoL4AAAAIdFJOUwARM2aImczuGAB4owAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAEZJREFUGNNj6IABBgQLB2BME4CyxDoSIQymio52BTBLHaixCMRgrgCy2g2ALAuwac0MDCxQgx0YIqCsVhTbOIBUA9gUslkA7dcxR/3Xli8AAAAASUVORK5CYII=") no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7);border-radius:5px 5px 5px 5px;cursor:pointer;position:fixed;bottom:50%;width:40px;height:40px;right:0px;z-index:9999';
	a.style.cssText = c;
	a.addEventListener('mouseover', function(){ a.style.opacity = 1;}, false);
	a.addEventListener('mouseout', function(){ a.style.opacity = 0.2; }, false);
	a.addEventListener('click', function(){ window.scrollTo(0,0); }, false );
	document.body.appendChild(a);
};
if(self == top) create_top_button();
//bottom按钮
function create_bottom_button() {
    //var newHeight = document.body.scrollHeight + 9999999999;
	var b = document.createElement('span');
	var c = 'opacity:0.1;-moz-transition-duration:0.0s;-webkit-transition-duration:0.0s;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUBAMAAAByuXB5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURf///6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpshoL4AAAAIdFJOUwARM2aImczuGAB4owAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAE1JREFUGNNjYGDg6OjoaGAAAfJZHTDAEAFltDKwQFkODAwWYEYzUCFzBZDRbgDSqw5kFYFNYaroaFcAsxjEOhIhDAbGNAEGHABhG5wFAH6qMUfw6SaOAAAAAElFTkSuQmCC") no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7);border-radius:5px 5px 5px 5px;cursor:pointer;position:fixed;top:51%;width:40px;height:40px;right:0px;z-index:9999';
	b.style.cssText = c;
	b.addEventListener('mouseover', function(){ b.style.opacity = 1; }, false);
	b.addEventListener('mouseout', function(){ b.style.opacity = 0.2; }, false);
	b.addEventListener('click', function(){ window.scrollTo(0,document.body.scrollHeight); }, false);
	document.body.appendChild(b);
};
if(self==top) create_bottom_button();
*/