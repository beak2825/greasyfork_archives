// ==UserScript==
// @name         Okoun.cz admin ban button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds Banuj button for Okoun
// @author       eso
// @include        https://*.okoun.cz/boards/*
// @include        https://*.okoun.cz/updateBoard.jsp*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426256/Okouncz%20admin%20ban%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/426256/Okouncz%20admin%20ban%20button.meta.js
// ==/UserScript==

$( document ).ready(function() {

    var okounUsSetLink = $('div.settings a').filter(function(index) { return $(this).text() === "Nastavení klubu"; }).attr("href");

    if (okounUsSetLink !== undefined) {
        $( "div.meta span.user" ).each(function( index ) {
            var item = $( this );
            item.before( '<span class="yui-button"><a href="' + okounUsSetLink + '&uuName=' + item.text() +'&uuAction=banishHim" target="_blank">Banuj!</a></span>' );
        });
    }

    if (window.location.href.indexOf('okoun.cz/updateBoard.jsp?boardId=') !== -1) {

        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('uuAction') == 'banishHim') {

            $('input[name="newPermUserLogin[0]"]').val(urlParams.get('uuName'));
            $('input[name="newPermRead[0]"]').prop('checked', false);
            $('input[name="newPermWrite[0]"]').prop('checked', false);
            $('input[name="newPermDeleteOwn[0]"]').prop('checked', false)

            $('html, body').animate({scrollTop: $(document).height()},500);

            $('fieldset#owners button.submit').stop().css("background-color", "#ff0000")
                .animate({ backgroundColor: ''}, 1500);

        }
    }

});
