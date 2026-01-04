// ==UserScript==
// @name         Remove annoying stuff from Elden Ring Wiki Interactive Map
// @namespace    http://your.namespace.com
// @version      1.0
// @description  Removes annoying stuff
// @author       OpheOphe
// @match        https://eldenring.wiki.fextralife.com/Interactive+Map
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501105/Remove%20annoying%20stuff%20from%20Elden%20Ring%20Wiki%20Interactive%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/501105/Remove%20annoying%20stuff%20from%20Elden%20Ring%20Wiki%20Interactive%20Map.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#sidebar-wrapper').hide();
    $('.navbar').removeClass('visible-lg');
    $('.row').hide();
    $('.titlearea').hide();
    $('.hidden-xs').hide();
    $('.footer-sticky').hide();
    $('.navbar').hide();
    $('#wrapper').css('padding-left', '0');
    $('.fex-main').css('max-width', '100%');
    $('#ximap0').attr('style', 'height: 1200px');
    $('#ximap1').attr('style', 'height: 1200px');
    $('#ximap2').attr('style', 'height: 1200px');
    $('#ximap3').attr('style', 'height: 1200px');
    $('#mapD').attr('style', '');
    $('#mapC').attr('style', '');
    $('#mapB').attr('style', '');
    $('#mapA').attr('style', '');

    $('html, body').animate({
        scrollTop: $('#mapD').offset().top
    }, 500);
})();
