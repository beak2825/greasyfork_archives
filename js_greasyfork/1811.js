// ==UserScript==
// @name        Howrse Menu Click Not Hover
// @namespace   hmcnh
// @include    	http://*.howrse.*/*
// @require  	http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require     https://greasyfork.org/scripts/1003-wait-for-key-elements/code/Wait%20for%20key%20elements.js?version=2765
// @version     1.2
// @author      Janiss
// @description Changes the menu to on mouse click instead of hover.
// @downloadURL https://update.greasyfork.org/scripts/1811/Howrse%20Menu%20Click%20Not%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/1811/Howrse%20Menu%20Click%20Not%20Hover.meta.js
// ==/UserScript==

waitForKeyElements ("#menu", menu, true);

function menu()
{
   $("#menu a[class*='highlight']").each(function(){ $(this).attr('onclick', $(this).attr('onmouseover')); $(this).removeAttr('onmouseover'); });
}