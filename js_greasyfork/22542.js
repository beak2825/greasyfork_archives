// ==UserScript==
// @name        iABW
// @namespace   http*www.wykop.pl/*
// @version     1.1
// @description Przerabia linki do kanału.
// @include     http://*wykop.pl/*
// @include     https://*wykop.pl/*
// @downloadURL https://update.greasyfork.org/scripts/22542/iABW.user.js
// @updateURL https://update.greasyfork.org/scripts/22542/iABW.meta.js
// ==/UserScript==

function abw() {
    console.log('Wybrano #');
    setTimeout(
        function(){
            $('.m-tag .menu-list > li > p:contains(w kanale) > a:last-child').each( function() {
            var a = $(this).attr('href');
            console.info('Zmieniono link  "'+a+'"!');
            a = a.split("/wpis/").pop();
            $(this).attr('href','http://wykop.pl/i/wpis/'+a);} );
        }, 450);
    }

  $('.m-tag a').click(abw);
