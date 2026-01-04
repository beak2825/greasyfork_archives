// ==UserScript==
// @name     koszykPGG - refr
// @namespace ssss
// @description Skrypt w przypadku niedostępności strony ładuje ją ponownie co jest przydatne na stronie PGG
// @license MIT
// @version  1.01
// @grant    none
// @include  *sklep.pgg.pl*
// @namespace https://greasyfork.org/users/952625
// @downloadURL https://update.greasyfork.org/scripts/451063/koszykPGG%20-%20refr.user.js
// @updateURL https://update.greasyfork.org/scripts/451063/koszykPGG%20-%20refr.meta.js
// ==/UserScript==
(function(){
'use strict';
for (const image of document.images){
if (image.src.indexOf("data:image/webp;base64")>-1){
image.style.border = "10px dotted black";
location.reload();
};
};
})()