// ==UserScript==
// @name        All In One Translator - Amazon
// @namespace   msumedhadmundhe
// @description Auto translates all Amazon market places, Argus dashboard as well as all the foreign language web pages required for external research to English. 
// @include     *://*/*
// @author      msumedha, dmundhe
// @run-at      document-body
// @exclude     /^.translate.googleapis.com./
// @exclude     /https://argus.aka.amazon.com/*
// @exclude     /https://www.amazon.com/*
// @exclude     /https://www.amazon.co.uk/*
// @exclude     /https://www.amazon.au/*
// @exclude     /https://www.amazon.ca/*
// @version     1.0
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/423548/All%20In%20One%20Translator%20-%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/423548/All%20In%20One%20Translator%20-%20Amazon.meta.js
// ==/UserScript==


var amazonDomain;
for (amazonDomain = window.location.hostname.split("."); 2 < amazonDomain.length;){
    amazonDomain.shift();
}

amazonDomain = ";domain=" + amazonDomain.join(".");

// domain cookie
document.cookie = "googtrans=/auto/en; expires=Thu, 07-Mar-2050 20:22:40 GMT; path=/" + amazonDomain;
document.cookie = "googtrans=/auto/en; expires=Thu, 07-Mar-2050 20:22:40 GMT; path=/";

var googleTranslateDivElement = document.createElement('div');
googleTranslateDivElement.id = 'google_translate_element';
googleTranslateDivElement.style.display='none';
document.body.insertBefore(googleTranslateDivElement, document.body.firstChild);

var translateElement = document.createElement('script');

translateElement.setAttribute('src','https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
translateElement.type = "text/javascript";
document.body.appendChild(translateElement);

var translateScript = document.createElement('script');
translateScript.type = "text/javascript";
translateScript.text = "function googleTranslateElementInit() { new google.translate.TranslateElement({pageLanguage: ''}, 'google_translate_element');}";

document.body.appendChild(translateScript);
