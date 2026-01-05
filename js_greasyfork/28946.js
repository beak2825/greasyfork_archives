// ==UserScript==
// @name           scrol1-滚动条自动隐藏变色及仿scrol1 style改写 
// @namespace     http://userstyles.org
// @description	  ios scroll bar for chrome
// @author        boogiefer
// @homepage      https://userstyles.org/styles/58438
// @include       http://*/*
// @include       https://*/*
// @run-at        document-start
// @require      http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.js
// @version       0.20111226011611
// @downloadURL https://update.greasyfork.org/scripts/28946/scrol1-%E6%BB%9A%E5%8A%A8%E6%9D%A1%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E5%8F%98%E8%89%B2%E5%8F%8A%E4%BB%BFscrol1%20style%E6%94%B9%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/28946/scrol1-%E6%BB%9A%E5%8A%A8%E6%9D%A1%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E5%8F%98%E8%89%B2%E5%8F%8A%E4%BB%BFscrol1%20style%E6%94%B9%E5%86%99.meta.js
// ==/UserScript==
(function() {var css = [
"::-webkit-scrollbar {",
    "   width:15px;",
     "  height:15px;",
 	"}",
"::-webkit-scrollbar-track-piece {",
"        background-color:#fff;",
"        opacity: 0;",
      "}",
"::-webkit-scrollbar-thumb:vertical{",
"  background-color:rgba(0,0,0,0.2);",
"  height:20px;",
"  border-right:4px solid #fff;",
"  border-left:4px solid #fff;",
     "}",
" ::-webkit-scrollbar-thumb:horizontal{", 
"  background-color:rgba(0,0,0,0.2);",
"  width:20px;",
"  border-top:4px solid #fff;",
"  border-bottom:4px solid #fff;",
   "}",
"::-webkit-scrollbar-thumb:hover{",
"  background-color:rgba(0,0,0,0.4);",
   "}",
 " body::-webkit-scrollbar{display:none;};",
  " html::-webkit-scrollbar{display:none;};",
 " .wsx_scroll{",
 " z-index:999999999999;",
 " width:30px;",
 " position: fixed;",
 " right: 0px;",
 " top: 0px;",
 " display:none;",
 " -webkit-user-select: none;",
 " trtransition:opacity 200ms linear;",
 "  padding:0;",
 "  margin:0;",
     "}",
" .wsx_scroll_bar{",
" position: relative;",
" height:100%; pointer-events: none;",
" - webkit-user-select: none;",
" padding:0;",
"  margin:0;",
 "}",
" .wsx_fade{",
" z-index:9999999999999;",
"  position: fixed;",
"  right: 0px;",
"  top: 0px;",
"   width: 45px;",
" display:block;",
"  height:100%;",
"  pointer-events: none;",
"  -webkit-user-select: none;",
"  padding:0;",
"  margin:0;",
"}",
	"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node); 
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
$(function(){
var config = {
	'backgroundColor': ['#f60', '#0A90CF', '#CC0F16', '#111', '#427700', '#E00'],
	'opacity': 0.6,
	'borderRadius': '3px',
	'width': '6px',
	'left': '19px'
     };
var rand = parseInt(6*Math.random());
$('<div class="wsx_fade"></div><div class="wsx_scroll"><div class="wsx_scroll_bar"></div></div>').appendTo('body');
$('.wsx_scroll_bar').css({'background-color': config.backgroundColor[rand], 'opacity': config.opacity, '-webkit-border-radius': config.borderRadius, 'width': config.width, 'left': config.left});


var content = document.documentElement?document.documentElement:document.body;
var change = $(window).height();
var scrollShow = false;
var wsx_t;

function upScrollHeight() {
	clearTimeout(wsx_t);
	var wHeight = $(window).height();
	//var docElemProp = window.document.documentElement.clientHeight;  
    //var wHeight = window.document.compatMode === "CSS1Compat" && docElemProp || window.document.body.clientHeight || docElemProp;  
	var dHeight = $(document).height();
	//var dHeight = window.document.height;
	var tmpScroll = $('.wsx_scroll');
	if(dHeight<=wHeight) {
		if (scrollShow === true) {
			tmpScroll.hide();
		}
		scrollShow = false;
    } else {
		tmpScroll.css({'display':'block', 'opacity':1 ,'pointer-events':'none'});
		scrollShow = true;
	}
	var scrollHeight = wHeight/dHeight*wHeight > 30 ? wHeight/dHeight*wHeight : 30;
	var top = $(document).scrollTop()/(dHeight-wHeight)*(wHeight-scrollHeight);
    tmpScroll.css({'top':top});
	tmpScroll.height(scrollHeight);

	wsx_t=setTimeout(function(){
		tmpScroll.css({'opacity':0, 'pointer-events':'none'});
		scrollShow = false;
	},500);
	//console.log(wHeight+' '+dHeight);
}
//setInterval use $().fadeOut() and i'll stop. why?
var init = window.setInterval(function() {
	if(change != content.scrollHeight) {
		change = content.scrollHeight;
		upScrollHeight();
	}
},100);

$(window).bind('scroll',function(){
	upScrollHeight();
});

$(window).bind('resize',function(){
	upScrollHeight();
});

var always;
var mousedown = false;
var in_mousedown = false;
var startY;
var Y;

$(window).bind('mousemove',function(event){
	if((content.clientWidth-event.clientX) < 40) {
	//console.log(content.clientWidth-event.clientX);
		if (scrollShow === false) {
			upScrollHeight();
		}
		clearTimeout(wsx_t);
		always = true;	
	} else {
		if (always === true) {
			//console.log('always:'+always);
			always = false;
			wsx_t=setTimeout(function(){
				$('.wsx_scroll').css({'opacity':0, 'pointer-events':'none'});
				scrollShow = false;
			},500);
		}
	}
	if (mousedown === true) {
	$('.wsx_fade').css({'pointer-events':'auto'});
		var endY=event.clientY;
		var top=endY-startY+Y;
		if(top<0){
			top=0;
		}
		var max_height=$(window).height()-$('.wsx_scroll').height();
		if(top>max_height){
			top=max_height;
		}
		var scroll_top=top/($(window).height()-$('.wsx_scroll').height())*($(document).height()-$(window).height());
		$(document).scrollTop(scroll_top);
	}

});

$(window).bind('mousedown',function(event){
	startY = event.clientY;
	Y=$(document).scrollTop()/($(document).height()-$(window).height())*($(window).height()-$('.wsx_scroll').height());
	if((content.clientWidth-event.clientX) < 40 && (content.clientWidth-event.clientX) >= 0) {		
		console.log(content.clientWidth-event.clientX);
		mousedown=true;
		window.document.onselectstart=function(){
			return false;
		};
	}
});
$(window).bind('mouseup',function(event){
	document.onselectstart=null;
	mousedown=false;
	$('.wsx_fade').css({'pointer-events':'none'});
});

});
