// ==UserScript==
// @name       Scroll Up & Down Arrows
// @namespace  mypage
// @version    1.0
// @description  Scroll Up & Down arrows, if you leave mouse on arrow it will slowly scroll
// @include    *
// @copyright  2014, drakulaboy
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/1200/Scroll%20Up%20%20Down%20Arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/1200/Scroll%20Up%20%20Down%20Arrows.meta.js
// ==/UserScript==


var scroll_speed = 500;//The smaller, the faster.When you click the button, it works.
var move_speed = 50;//The smaller, the faster. When your mouse moves on the button, it works.
var toumingc_control = 1;//If you don't want to get the opacity(tou'ming in Chinese) changed, set it to 0;

//if(/https?:\/\/twitter\.com/i.test(window.location.href)) document.getElementById("doc").style.position = "static";

function up() {

    $(window).scrollTop($(window).scrollTop() - 1);
    fq = setTimeout(up, move_speed)
};

function dn() {

    $(window).scrollTop($(window).scrollTop() + 1);
    fq = setTimeout(dn, move_speed)
};

function create_button() {
	if(document.body){
		var a = document.createElement('span');
		var b = document.createElement('span');
		a.id = "shang";
		b.id = "xia";
		var css_a = 'opacity:1;-moz-transition-duration:0.2s;background:url(data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB+SURBVDhPY1i1atV/amAGahgCMoNhaIGlS5cKAp19BoRBbLJcj2QILDJINwzoAmMgfoclIkBixkS5DI8hMJcRNgxoSBoOl6CnNZBhaVhdBjWE1MSJahjQkA4KEmYH2GUrV66cSYEhYB+AzKBtFiHkQqKiH6Ro1CDCQTWgYQQAs81DU0G/83sAAAAASUVORK5CYII=) no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7);border-radius:5px 0 0 5px;cursor:pointer;height:36px;margin-top:-24px;width:36px;position:fixed;right:10px;bottom:53%;z-index:1';
		var css_b ='opacity:1;-moz-transition-duration:0.2s;background:url(data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACPSURBVDhPY2DAAlatWvUfH8amB6vYqEGEg2pgw4iQ7cTKM6xcuXImsYpxqQOZAQ4woIIOCgzrQAl1oEFpZBiWhitFgwx7R4SBIDXYDYGZDFRgTMAwkCHGhBMRJMxwGUa8ITCbli5dKgg08AySN8+AxIhyCboiJMPIN4Qsm6miiYioxltawvSDYogohYTUAQC80UNTOht/YwAAAABJRU5ErkJggg==) no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7);border-radius:5px 0 0 5px;cursor:pointer;height:36px;margin-top:-24px;width:36px;position:fixed;right:10px;top:53%;z-index:1';

		a.style.cssText = css_a;
		b.style.cssText = css_b;
		a.addEventListener('mouseover',up, false);
		b.addEventListener('mouseover',dn, false);
		a.addEventListener('mouseout',function(){clearTimeout(fq);},false);
		b.addEventListener('mouseout',function(){clearTimeout(fq);},false);
		a.addEventListener('click', function(){ $("html,body").animate({scrollTop:0},scroll_speed); }, false);
		b.addEventListener('click', function(){ $("html,body").animate({scrollTop:$(document).height()},scroll_speed); }, false);

		if(toumingc_control){
		$(window).scroll(function(){
			if($(window).scrollTop()){
				a.style.display = "";
			}
			else{
				a.style.display ="none";
			}
			a.style.opacity=($(window).scrollTop())/($(document).height()-$(window).height());
			b.style.opacity=1 - ( a.style.opacity );
		});
		}
		document.body.appendChild(a);
		document.body.appendChild(b);
	}
};
if(window != window.top) return 0;
if($(document).height()-$(window).height())	create_button();