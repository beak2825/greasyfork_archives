// ==UserScript==
// @name         屏蔽開啓 APP
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  站長想要，我們不要
// @author       月退
// @run-at          document-end
// @match        https://m.gamer.com.tw/forum/*
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/446407/%E5%B1%8F%E8%94%BD%E9%96%8B%E5%95%93%20APP.user.js
// @updateURL https://update.greasyfork.org/scripts/446407/%E5%B1%8F%E8%94%BD%E9%96%8B%E5%95%93%20APP.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const removeElements = (selector) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.remove();
  });
};
// Remove boxes
removeElements('.wrapper.article-more2:nth-of-type(8)');
// Remove peaches
removeElements('#prjAcgEvent.themepage-entrance.peach');
// Remove apps
removeElements('.open-app');
//bottom按钮
function create_bottom_button() {
    var newHeight = document.body.scrollHeight + 9999999999;
	var b = document.createElement('span');
	var c = 'opacity:0.3;-moz-transition-duration:0.2s;-webkit-transition-duration:0.2s;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUBAMAAAByuXB5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURf///6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpshoL4AAAAIdFJOUwARM2aImczuGAB4owAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAE1JREFUGNNjYGDg6OjoaGAAAfJZHTDAEAFltDKwQFkODAwWYEYzUCFzBZDRbgDSqw5kFYFNYaroaFcAsxjEOhIhDAbGNAEGHABhG5wFAH6qMUfw6SaOAAAAAElFTkSuQmCC") no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7);border-radius:5px 5px 5px 5px;cursor:pointer;position:fixed;top:79%;width:40px;height:40px;right:0px;z-index:9999';
	b.style.cssText = c;
	b.addEventListener('mouseover', function(){ b.style.opacity = 1; }, false);
	b.addEventListener('mouseout', function(){ b.style.opacity = 0.3; }, false);
	b.addEventListener('click', function(){ window.scrollTo(0,document.body.scrollHeight-1300); }, false);
	document.body.appendChild(b);
};
if(self==top) create_bottom_button();
})();