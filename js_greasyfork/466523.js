// ==UserScript==
// @name         Zarrincha
// @namespace    zero.display-remove.torn
// @version      0.2
// @description  Autofills items in display remove
// @author       -zero [2669774]
// @match        https://www.torn.com/displaycase.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466523/Zarrincha.user.js
// @updateURL https://update.greasyfork.org/scripts/466523/Zarrincha.meta.js
// ==/UserScript==

function remove(){
    if ($('.dc-list > li').length == 0){
        setTimeout(remove, 300);
        return;
    }
    var items = $('.dc-list > li').each(function(){
        var item = $(this);
        console.log(item);
        var max = $('input',item).attr('data-max');
        console.log(max);
        $('input', item).attr('value', max );

    })
}

(function() {
    var url = window.location.href;
    console.log(url);
    if (url.includes('manage')){
        remove();
    }
})();
$(window).on('hashchange', function(e){

    setTimeout(remove,300);

});