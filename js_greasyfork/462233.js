// ==UserScript==
// @name         Forum Focus
// @namespace    zero.forumfocus.ai
// @version      0.2
// @description  Removes likes and dislikes.
// @author       -zero [2669774]
// @match        https://www.torn.com/forums.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462233/Forum%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/462233/Forum%20Focus.meta.js
// ==/UserScript==



function remove(){
    var url = window.location.href;
    if (url.includes('p=main') || url == 'https://www.torn.com/forums.php'){
        return;
    }
    if (url.includes('p=forums')){
        if ($('.rating').length > 0){
            $('.rating').css('visibility','hidden');
        }
        else{
            setTimeout(remove, 300);
        }
    }
    else{
        if ($('.forum-button > .value').length > 0){
            $('.forum-button > .value').css('visibility','hidden');
        }
        else{
            setTimeout(remove, 300);
        }
    }


}

remove();
$(window).on('hashchange', function(e){
    remove();

});