// ==UserScript==
// @name       Bypass Safelinkreview
// @namespace  https://ecyber.biz
// @version    0.1
// @description  if you do not like Safelinkreview link or button does not work, this is the right script
// @include http://safelinkreview.com/*
// @include http://decrypt.safelinkconverter.com/*
// @copyright  siakbary
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/13116/Bypass%20Safelinkreview.user.js
// @updateURL https://update.greasyfork.org/scripts/13116/Bypass%20Safelinkreview.meta.js
// ==/UserScript==
if (window.location.origin === "http://decrypt.safelinkconverter.com") {
var idkbu = $('.redirect_url').find('a').attr('href');
    location.replace(idkbu);
    console.info(idkbu);
} else {
var idku = window.location.search.split('id=')[1];
    location.replace("http://decrypt.safelinkconverter.com/index.php?id="+idku);
    console.info(idku);
}
