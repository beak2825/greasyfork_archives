// ==UserScript==
// @name        superfish
// @namespace   whatever
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @include     https://www.mturkcontent.com/dynamic*
// @version     1
// @grant       none
// @description x
// @downloadURL https://update.greasyfork.org/scripts/2569/superfish.user.js
// @updateURL https://update.greasyfork.org/scripts/2569/superfish.meta.js
// ==/UserScript==

$('img').each(function(){
    $(this).click(function(){
        $(this).next().next().attr('checked',true);
    });
});