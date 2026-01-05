// ==UserScript==
// @id             mirtesen.ru
// @name           mirtesen.ru
// @version        1.0
// @author         greenjoker
// @namespace      http://greenjoker.point.im/
// @description    Скрипт удаляет окно на регистрации на mirtesen.ru.
// @homepage       https://greasyfork.org/scripts/3802-mirtesen-ru
// @include        *://mirtesen.ru/*
// @match          *://mirtesen.ru/*
// @run-at         window-load
// @downloadURL https://update.greasyfork.org/scripts/3802/mirtesenru.user.js
// @updateURL https://update.greasyfork.org/scripts/3802/mirtesenru.meta.js
// ==/UserScript==

(function(window, undefined ){

if (window.self != window.top){
	return;
}

function removeClass(obj, cls) {
	var arr = (obj.className)? obj.className.split(' ') : [];
	var i = 0;
	while ( i < arr.length) {
		(arr[i]===cls) ? arr.splice(i,1) : i++;
	}
	obj.className=arr.join(' ');
}

var supercontainer = document.getElementById('supercontainer'),
t_s_headers = document.getElementById('theme_selection_headers');
removeClass(supercontainer ,'blur');
removeClass(t_s_headers ,'blur');

var popups = document.getElementsByClassName('popup-not-logged'),
overlays = document.getElementsByClassName('overlay');
if (popups.length){
	for ( var i=0; i<popups.length; i++ ){
		var popup = popups[i],
		popupholder = popup.parentNode;
		popupholder.removeChild(popup);
	}
}
if (overlays.length){
	for ( var i=0; i<overlays.length; i++ ){
		var overlay = overlays[i],
		overlayholder = overlay.parentNode;
		overlayholder.removeChild(overlay);
	}
}

})(window);