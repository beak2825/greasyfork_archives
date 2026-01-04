// ==UserScript==
// @name         Name/Price Swap
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  double swap error fixed.
// @author       -zero [2669774]
// @match        https://www.torn.com/imarket.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460876/NamePrice%20Swap.user.js
// @updateURL https://update.greasyfork.org/scripts/460876/NamePrice%20Swap.meta.js
// ==/UserScript==

var child;
var title;
var price;
var url = '';

function swap(){
    if($(url+'.m-items-list > li').length){
        $('.m-items-list').children().each(function() {
            child = $(this);
            title = $('.searchname', child).text();
            if (!title.includes('$')){
                price = $('.minprice', child).text();
                $('.searchname', child).html(price);
                $('.minprice', child).html(title);
            }

        });
    }
    else{
        setTimeout(swap, 500);
    }
}

swap();
$(window).on('hashchange', function(e){
    url = '#'+window.location.href.substring(47)+' > ';
    setInterval(swap, 500);

});
