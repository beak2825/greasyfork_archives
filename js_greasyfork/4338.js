// ==UserScript==
// @name       Red Blue
// @version    0.1
// @description  Red to Blue
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @include      http://www.mturkgrind.com/*
// @copyright  2013+, You
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/4338/Red%20Blue.user.js
// @updateURL https://update.greasyfork.org/scripts/4338/Red%20Blue.meta.js
// ==/UserScript==
 
$("[color='blue'], [color='#0000FF']").each(function(){
       $(this).attr("color","red");
})