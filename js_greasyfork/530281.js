// ==UserScript==
// @license MIT
// @name		        上下跳頁
// @author		      duola,Leadra
// @description	    頁面滾動
// @namespace       https://greasyfork.org/zh-TW/users/4839
// @version  3.3.3
// @match    *://*/*
// @grant		 none
// @icon     data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUBAMAAAByuXB5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURf///6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpshoL4AAAAIdFJOUwARM2aImczuGAB4owAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAE1JREFUGNNjYGDg6OjoaGAAAfJZHTDAEAFltDKwQFkODAwWYEYzUCFzBZDRbgDSqw5kFYFNYaroaFcAsxjEOhIhDAbGNAEGHABhG5wFAH6qMUfw6SaOAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/530281/%E4%B8%8A%E4%B8%8B%E8%B7%B3%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/530281/%E4%B8%8A%E4%B8%8B%E8%B7%B3%E9%A0%81.meta.js
// ==/UserScript==
//top按钮
function create_top_button() {
	var a = document.createElement('span');
	var c = 'opacity:0.05;-moz-transition-duration:0.0s;-webkit-transition-duration:0.0s;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUBAMAAAByuXB5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURf///6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpshoL4AAAAIdFJOUwARM2aImczuGAB4owAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAEZJREFUGNNj6IABBgQLB2BME4CyxDoSIQymio52BTBLHaixCMRgrgCy2g2ALAuwac0MDCxQgx0YIqCsVhTbOIBUA9gUslkA7dcxR/3Xli8AAAAASUVORK5CYII=") no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7);border-radius:5px 5px 5px 5px;cursor:pointer;position:fixed;bottom:50%;width:50%;height:30%;right:10%;z-index:9999';
	a.style.cssText = c;

	a.addEventListener('click', function(){ window.scrollBy(0,-window.innerHeight); }, false );
	document.body.appendChild(a);
};
if(self == top) create_top_button();
//bottom按钮
function create_bottom_button() {
    //var newHeight = document.body.scrollHeight + 9999999999;
	var b = document.createElement('span');
	var c = 'opacity:0.05;-moz-transition-duration:0.0s;-webkit-transition-duration:0.0s;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUBAMAAAByuXB5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURf///6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpshoL4AAAAIdFJOUwARM2aImczuGAB4owAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAE1JREFUGNNjYGDg6OjoaGAAAfJZHTDAEAFltDKwQFkODAwWYEYzUCFzBZDRbgDSqw5kFYFNYaroaFcAsxjEOhIhDAbGNAEGHABhG5wFAH6qMUfw6SaOAAAAAElFTkSuQmCC") no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7);border-radius:5px 5px 5px 5px;cursor:pointer;position:fixed;top:51%;width:50%;height:30%;right:10%;z-index:9999';
	b.style.cssText = c;

	b.addEventListener('click', function(){ window.scrollBy(0,window.innerHeight); }, false);
	document.body.appendChild(b);
};
if(self==top) create_bottom_button();