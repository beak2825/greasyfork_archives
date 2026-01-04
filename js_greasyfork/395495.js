// ==UserScript==
// @name Visière
// @namespace InGame
// @author Yaga
// @version 1.1
// @include https://www.dreadcast.net/Main
// @include https://www.dreadcast.eu/Main
// @compat Firefox, Chrome
// @description Ajoute la visière en jeu
// @downloadURL https://update.greasyfork.org/scripts/395495/Visi%C3%A8re.user.js
// @updateURL https://update.greasyfork.org/scripts/395495/Visi%C3%A8re.meta.js
// ==/UserScript==



    var $carte_fond = $('#carte');
    var $visiere = $('<div id="visi_fond" style="background:url(https://nsa40.casimages.com/img/2020/01/14/200114021421128475.png) no-repeat scroll 0 0;"></div> />').appendTo($carte_fond);
     $visiere.css({
            "left": '0',
            "top": '0',
            width: '525px',
            height: '525px',
            position: 'absolute',
            "margin-top": '0px',
            "margin-left": '0px',
            "z-index": '101',
     });