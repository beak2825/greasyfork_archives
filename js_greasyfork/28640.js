// ==UserScript==
// @name         Imgur Album Slideshow
// @version      2017.03.05.02
// @description  Adds a menu to Imgur albums to start a slideshow
// @author       Withaika
// @match        *://imgur.com/a/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.5/jquery-ui.min.js
// @namespace    https://greasyfork.org/users/94615
// @downloadURL https://update.greasyfork.org/scripts/28640/Imgur%20Album%20Slideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/28640/Imgur%20Album%20Slideshow.meta.js
// ==/UserScript==

(function() {
	$("#right-content").prepend("<div id='ssMenu' style='box-sizing: border-box;width: 300px;padding: 8px;background-color: #2c2f34;border-radius: 4px;height: 135px;'><center><p style='display:inline-block;padding-bottom:10px;'>Delay (s):</p><input value='3' style='display:inline-block;width:30px;margin-bottom:10px;'id='ssSec'></input></center><center><p style='margin-top:-5px;'>Randomize:</p><label class='switch'><input id='randomize' type='checkbox'><div class='slider round'></div></label></center><center style='margin-top:5px;'><button id='ssStart' style='text-align: center;cursor: pointer;padding-left: 8px;height: 36px;box-sizing: border-box;padding-right: 8px;background: #5c69ff;border: none;color: #F2F2F2;text-decoration: none;outline: 0;-webkit-user-select: none;user-select: none;cursor: pointer; display: inline-block;border-radius: 2px;font-size: 14px;border: none;font-family: \"Open Sans\",sans-serif;'>Start Slideshow</button><div id='restart' style='display:none'><p style='display:inline-block'>       </p><button id='ssReStart' style='text-align: center;cursor: pointer;padding-left: 8px;height: 36px;box-sizing: border-box;padding-right: 8px;background: #ed6d6d;border: none;color: #F2F2F2;text-decoration: none;outline: 0;-webkit-user-select: none;user-select: none;cursor: pointer; display: inline-block;border-radius: 2px;font-size: 14px;border: none;font-family: \"Open Sans\",sans-serif;'>Restart Slideshow</button></div></center></div>");
    $('body').prepend('<style>.switch { position: relative; display: inline-block; width: 45px; height: 20px; }.switch input {display:none;}.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; } .slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 4px; bottom: 4px; background-color: white; -webkit-transition: .4s; transition: .4s; } input:checked + .slider { background-color: #2196F3; } input:focus + .slider { box-shadow: 0 0 1px #2196F3; } input:checked + .slider:before { -webkit-transform: translateX(26px); -ms-transform: translateX(26px); transform: translateX(26px); } .slider.round { border-radius: 34px; } .slider.round:before { border-radius: 50%; }</style>');
})();

var slideIndex = 1;
var Images=[];

function plusDivs(n) {
	showDivs(slideIndex += n);
}

function showDivs(n) {
	var i;
	var x = Images;
	if (n > x.length) {slideIndex = 1;} 
	if (n < 1) {slideIndex = x.length;}
	document.getElementById("FSSI").src=x[slideIndex-1]; 
}

function startSlide(){
	document.getElementById("restart").style.display="inline-block";
	if (document.getElementById("randomize").checked){undefinedImages = _widgetFactory._.config.gallery.image.album_images.randomize();}else{undefinedImages = _widgetFactory._.config.gallery.image.album_images;}
	for (i=0;i<undefinedImages.length;i++){
		ext=undefinedImages[i].ext;
		hsh=undefinedImages[i].hash;
		Images.push("https://i.imgur.com/"+hsh+ext);
	}
	var delay = parseInt(document.getElementById("ssSec").value);
	var isPaused=false; 
	$("body").append("<div id='ss' style='background:#000;width:100%;height:auto;position:relative;'><button id='manualBack' style='position:absolute;float:right;top:50%;left:0;z-index:3;font-size:40px;background-color:rgba(0, 0, 0, 0.0);;color:#FFF;border:none;-moz-transform: scale(-1, 1);-webkit-transform: scale(-1, 1);-o-transform: scale(-1, 1);-ms-transform: scale(-1, 1);transform: scale(-1, 1);'>&#9658;</button><center><img id='FSSI' style='width:auto;height:100%;' src=''></center><button id='manualForward' style='position:absolute;float:right;top:50%;left:96.5%;z-index:3;font-size:40px;background-color:rgba(0, 0, 0, 0.0);color:#FFF;border:none;'>&#9658;</button></div>");
	document.getElementById("manualBack").addEventListener("click", function(){
		isPaused=true;
		plusDivs(-1);
	});
	document.getElementById("manualForward").addEventListener("click", function(){
		isPaused=true;
		plusDivs(1);
	});
	$(document).keydown(function(e) {
		switch(e.which) {
			case 37: // left
				plusDivs(-1);
				break;
			case 38: // up
				delay--;
				break;
			case 39: // right
				plusDivs(1);
				break;
			case 40: // down
				delay++;
				break;
			case 32: // space
				if (isPaused){isPaused=false;}else{isPaused=true;}
				break;
			case 27: // escape
				FSTog(document.getElementById("ss"));
				clearInterval(intID);
				break;
			default: return;
		}
		e.preventDefault();
	});
	showDivs(slideIndex);
	FSTog(document.getElementById("ss"));
	var intID=window.setInterval(function(){
		if(!isPaused) {
			plusDivs(1);
		}
	}, delay*1000);
}

function FSTog(element) {
	if (!element.fullscreenElement && !element.mozFullScreenElement && !element.webkitFullscreenElement && !element.msFullscreenElement ) {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if (element.exitFullscreen) {
			element.exitFullscreen();
		} else if (element.msExitFullscreen) {
			element.msExitFullscreen();
		} else if (element.mozCancelFullScreen) {
			element.mozCancelFullScreen();
		} else if (element.webkitExitFullscreen) {
			element.webkitExitFullscreen();
		}
	}
}

Array.prototype.randomize = function() {
	array=this;
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
};

document.getElementById("ssStart").addEventListener("click", function(){
	startSlide();
});
document.getElementById("ssReStart").addEventListener("click", function(){
	startSlide();
	slideIndex = 1;
});