// ==UserScript==
// @name	Scroll to Bottom or Top
// @author	midpoint
// @description	为网页增加滚到页首和页尾的按钮
// @version     2014.9.21
// @include     *
// @exclude     http://*facebook.com*
// @exclude     https://*facebook.com*
// @namespace https://greasyfork.org/users/5506
// @downloadURL https://update.greasyfork.org/scripts/5181/Scroll%20to%20Bottom%20or%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/5181/Scroll%20to%20Bottom%20or%20Top.meta.js
// ==/UserScript==

//top button
var a = document.createElement('span');
var c = 'opacity:0.5;-moz-transition-duration:0.2s;-webkit-transition-duration:0.2s;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUBAMAAAByuXB5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURf///6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpshoL4AAAAIdFJOUwARM2aImczuGAB4owAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAEZJREFUGNNj6IABBgQLB2BME4CyxDoSIQymio52BTBLHaixCMRgrgCy2g2ALAuwac0MDCxQgx0YIqCsVhTbOIBUA9gUslkA7dcxR/3Xli8AAAAASUVORK5CYII=") no-repeat scroll 50% 50% rgba(0, 152, 255, 1);border-radius:0px 0px 0px 0px;cursor:pointer;position:fixed;bottom:50%;width:36px;height:36px;right:10px;z-index:9999';
a.style.cssText = c; 
a.addEventListener('mouseover', function(){ a.style.opacity = 1;}, false);
a.addEventListener('mouseout', function(){ a.style.opacity = 0.5; }, false);
a.addEventListener('click', function(){ window.scrollTo(0,0); }, false);
//a.addEventListener('click', function(){ $("html,body").animate({scrollTop:"0px"},200); }, false );
document.body.appendChild(a);

//bottom button
var newHeight = document.body.scrollHeight;
var b = document.createElement('span');
var d = 'opacity:0.5;-moz-transition-duration:0.2s;-webkit-transition-duration:0.2s;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUBAMAAAByuXB5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURf///6qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqpshoL4AAAAIdFJOUwARM2aImczuGAB4owAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAE1JREFUGNNjYGDg6OjoaGAAAfJZHTDAEAFltDKwQFkODAwWYEYzUCFzBZDRbgDSqw5kFYFNYaroaFcAsxjEOhIhDAbGNAEGHABhG5wFAH6qMUfw6SaOAAAAAElFTkSuQmCC") no-repeat scroll 50% 50% rgba(0, 152, 255, 1);border-radius:0px 0px 0px 0px;cursor:pointer;position:fixed;bottom:45%;width:36px;height:36px;right:10px;z-index:9999';//top:52%;
b.style.cssText = d;   
b.addEventListener('mouseover', function(){ b.style.opacity = 1; }, false);
b.addEventListener('mouseout', function(){ b.style.opacity = 0.5; }, false);
b.addEventListener('click', function(){ window.scrollTo(0,newHeight); }, false);
document.body.appendChild(b);

//http://file.ithome.com/js/common.js
var lastScrollY=0;
(function gotop(){
	var diffY;
        diffY = document.documentElement.scrollTop+document.body.scrollTop;
	percent=.1*(diffY-lastScrollY);
	if(percent>0)percent=Math.ceil(percent);
	else percent=Math.floor(percent);
	lastScrollY=lastScrollY+percent;
	if(lastScrollY>100){
	a.style.display="block";b.style.display="block";
	} else {
        b.style.display="block";a.style.display="none";
	}
        setTimeout(gotop,1);
})();



