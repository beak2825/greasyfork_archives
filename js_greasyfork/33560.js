// ==UserScript==
// @name         Wykop Obrazki
// @namespace    http://lodkut.as/
// @version      1.2.2
// @description  Przywraca obrazki na wortalu Wykop.pl dopóki ktoś z góry nie zechce ich naprawić
// @author       SweetNight
// @match        *://*.wykop.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33560/Wykop%20Obrazki.user.js
// @updateURL https://update.greasyfork.org/scripts/33560/Wykop%20Obrazki.meta.js
// ==/UserScript==

(function() {
    'use strict';

	const updatePics = function (){
		$(".hide-image").each(function(){
			const imageElement = $("<img />");
			const imageUrl = $(this).find("a").attr("href");
			const imageThumbUrl = imageUrl.substr(0, imageUrl.length-4) + ",w400.jpg";
			$(imageElement).attr("src", imageThumbUrl);
			//$(this).find("a").append("<br>");
			$(this).find("a").empty();
			$(this).find("a").append(imageElement);
		});
	};
	
	//Dla ajaxowej aktualizacji postow na mirko
	$("#newEntriesCounter").click(function(){
		setTimeout(updatePics, 1000);
	});
	
	//Po rozwinieciu komentarzy
	$(".more").click(function(){
		setTimeout(updatePics, 1000);
	});
	
	$(document).ready(function(){
		updatePics();
	});
	

})();