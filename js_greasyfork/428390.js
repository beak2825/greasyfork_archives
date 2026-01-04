// ==UserScript==
// @name           Retour à lavydavant DELUXE - Logo et icones
// @version        1.0
// @description    Comme demander un full retour a lavidavan va avec l'user style https://userstyles.world/style/208/jeuxvideo-com-ancien-theme.
// @include        http://www.jeuxvideo.com/*
// @include        https://www.jeuxvideo.com/*
// @namespace https://greasyfork.org/users/786584
// @downloadURL https://update.greasyfork.org/scripts/428390/Retour%20%C3%A0%20lavydavant%20DELUXE%20-%20Logo%20et%20icones.user.js
// @updateURL https://update.greasyfork.org/scripts/428390/Retour%20%C3%A0%20lavydavant%20DELUXE%20-%20Logo%20et%20icones.meta.js
// ==/UserScript==


//Favicon JVC
function fixicon(){var favicon = document.querySelector('link[rel~="icon"]');
    var clone = favicon.cloneNode(!0);
    clone.href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAA3NCSVQICAjb4U/gAAAAIVBMVEUDRWQAKlf/Vy7/PAD/WCj/8e8AAEvJz9P/////AADi5ecUYSeIAAAAAWJLR0QAiAUdSAAAAEhJREFUGJWlzzkSwDAIA0BkmcP+/4OjcdzRJXQs12B2Y4437BMgAgfIA8iqhIDuEuUb2InJ5b44LEr9qFB9idihjbSl/ez/Xx5OgQJ5H5o9RwAAAABJRU5ErkJggg==";
    favicon.parentNode.removeChild(favicon);
    document.head.appendChild(clone);}

//Logo JVC en texte et non image
function fixlogo(){
  var logodiv = document.getElementsByClassName("jv-global-web");
  var HTMLlogoOriginal = "<span class='logo'><a href='https://www.jeuxvideo.com' class='xXx logo-link'><i class='nav-icon-jeuxvideo'></i><i class='nav-icon-com'></i></a></span>"
  logodiv[0].innerHTML = HTMLlogoOriginal;
}

//load les function
window.addEventListener('load', function() {
    fixicon();
    fixlogo();
}, false);