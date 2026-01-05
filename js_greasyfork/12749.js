// ==UserScript==
// @name        Free-SO
// @namespace   https://greasyfork.org/fr/scripts/12749
// @description Premium content without premium access for online french newspaper Sud Ouest
// @description:fr Accès aux articles réservés aux abonnés de Sud Ouest sans être connecté
// @include     http://www.sudouest.fr/*
// @require     http://code.jquery.com/jquery-latest.js
// @grant       none
// @version     2.1.1
// @license     Creative Commons BY-NC-SA
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/12749/Free-SO.user.js
// @updateURL https://update.greasyfork.org/scripts/12749/Free-SO.meta.js
// ==/UserScript==

(function () {
    function unHide () {
        $('.article .short').hide();
        $('.article .long').show();
        $('.article-premium-locked').hide();
    }
    unHide();
    $('.article .short').mouseover(unHide);
    $('.article .short').click(unHide);
})();
