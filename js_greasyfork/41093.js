// ==UserScript==
// @name		rozwijane menu użytkownika 
// @namespace		http://www.wykop.pl/ludzie/wytrzzeszcz/
// @description		menu uzytkownika sie rozwija
// @author		wytrzeszcz
// @version		0.5
// @grant		none
// @include		http://www.wykop.pl/*
// @include		https://www.wykop.pl/*
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/41093/rozwijane%20menu%20u%C5%BCytkownika.user.js
// @updateURL https://update.greasyfork.org/scripts/41093/rozwijane%20menu%20u%C5%BCytkownika.meta.js
// ==/UserScript==
(function() {
var avek=document.getElementsByClassName("logged-user")[0].getElementsByTagName("a")[0];

    avek.addEventListener("click", function(){
    window.location.href=avek.href;
    });

    avek.addEventListener("mouseout", function(){
        avek.classList.remove("show-next-drop");
    });

    avek.addEventListener("mouseover", function(){
        avek.classList.toggle("show-next-drop");
    });

})();
