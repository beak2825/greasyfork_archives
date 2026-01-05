// ==UserScript==
// @name     Растворялка
// @include  http://bkwar.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant    GM_addStyle

// @description Авторасторялка для Храма знаний
// @version 0.0.1.20161021123530
// @namespace https://greasyfork.org/users/10566
// @downloadURL https://update.greasyfork.org/scripts/24191/%D0%A0%D0%B0%D1%81%D1%82%D0%B2%D0%BE%D1%80%D1%8F%D0%BB%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/24191/%D0%A0%D0%B0%D1%81%D1%82%D0%B2%D0%BE%D1%80%D1%8F%D0%BB%D0%BA%D0%B0.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/

//--- Note that the contains() text is case-sensitive.
var TargetLink = $("a:contains('растворить')")

if (TargetLink.length)
   window.location.href = TargetLink[0].href
 
   var images = document.getElementsByTagName("img");
for (var i = 0; i < images.length; i++)
  images[i].src = "";