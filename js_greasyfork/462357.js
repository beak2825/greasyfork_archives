// ==UserScript==
// @name         Brutum
// @namespace    zero.brutum.torn
// @version      0.2
// @description  Jail shortcut with arrows
// @author       You
// @match        https://www.torn.com/jailview.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462357/Brutum.user.js
// @updateURL https://update.greasyfork.org/scripts/462357/Brutum.meta.js
// ==/UserScript==

$(document).on('keypress',function(e) {
    if (e.which == 37){
        alert('left');}


    if(e.which < 58 && e.which > 48) {


        window.location.href = "https://www.torn.com/jailview.php#start="+(e.which-49)*50;
    }


});
$(document).on('keydown',function(e) {
    var url = window.location.href.split('start=');
    if (url.length == 1){
        url = [0,0]
    }
    url = parseInt(url[1]);

    if (e.which == 37){
        url -= 50;
        if (url < 0){return;}
         window.location.href = "https://www.torn.com/jailview.php#start="+url;
    }
    if (e.which == 39){
        url += 50;
         window.location.href = "https://www.torn.com/jailview.php#start="+url;
    }




});