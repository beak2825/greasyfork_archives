// ==UserScript==
// @name       change link colors for dark theme
// @version    0.1
// @require     http://code.jquery.com/jquery-latest.min.js
// @include      http://www.mturkgrind.com/*
// @copyright  2013+, You
// @description lol
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/4339/change%20link%20colors%20for%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/4339/change%20link%20colors%20for%20dark%20theme.meta.js
// ==/UserScript==

$('[id^="post_message"]').find('a').each(function(){
    if($(this).css('color') == 'rgb(153, 153, 153)')
       $(this).css('color', 'red')
});
