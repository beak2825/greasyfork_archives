// ==UserScript==
// @name         Lenin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Friend/Enemy Lenin
// @author       -zero [2669774]
// @match        https://www.torn.com/friendlist.php*
// @match        https://www.torn.com/blacklist.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460877/Lenin.user.js
// @updateURL https://update.greasyfork.org/scripts/460877/Lenin.meta.js
// ==/UserScript==

function add(){
    console.log($('.user-info-blacklist-wrap > li').length);
    if ($('.user-info-blacklist-wrap > li').length > 0){
        var container = $('.user-info-blacklist-wrap');
        container.children().each(function() {
            var child = $(this);
            var link = $('.user.name', child).attr('href');
            if (link){
                var id = link.split('=')[1];
                $('.status', child).wrap("<a href=https://www.torn.com/loader.php?sid=attack&user2ID="+id+" target='attack'></a>");
            }
        });
    }
    else{
        setTimeout(add, 1000);
    }


}

add();

$(window).on('hashchange', function(e){
    setTimeout(add, 400);
});