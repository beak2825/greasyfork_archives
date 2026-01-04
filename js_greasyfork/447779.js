// ==UserScript==
// @name         9anime New Design - Classic Width
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      1.1
// @description  makes the new design more like the classic design
// @include      https://9anime.id/home
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon https://www.google.com/s2/favicons?sz=64&domain=9anime.id
// @downloadURL https://update.greasyfork.org/scripts/447779/9anime%20New%20Design%20-%20Classic%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/447779/9anime%20New%20Design%20-%20Classic%20Width.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function($){

    $("#recently-updated").detach().appendTo('.hotest.container')
    $(".container").css('maxWidth', '1280px')

})(jQuery);