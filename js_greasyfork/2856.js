// ==UserScript==
// @name superfish
// @description supefish
// @namespace whatever
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @include https://www.mturkcontent.com/dynamic*
// @version 1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/2856/superfish.user.js
// @updateURL https://update.greasyfork.org/scripts/2856/superfish.meta.js
// ==/UserScript==

$('img').each(function(){
$(this).click(function(){
    var cur = $(this).next().next();
	cur.attr("checked", !cur.prop("checked"));
});
}); 

document.onkeydown = showkeycode;
function showkeycode(evt){
var keycode = evt.keyCode;
switch (keycode) {
case 13: //enter
document.getElementById("mturk_form").submit();
break;
}
}