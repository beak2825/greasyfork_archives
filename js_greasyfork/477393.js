// ==UserScript==
// @name         halloween timer 2.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Affiche le temps restant jusqu'à Halloween
// @author       Elfen_lied + Porn
// @icon         https://image.noelshack.com/fichiers/2022/40/4/1665057946-jesuscitrouillerevenantgentil.png
// @grant        none
// @match        https://onche.org/forum/*
// @match        https://onche.org/topic/*
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @run-at document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/477393/halloween%20timer%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/477393/halloween%20timer%2020.meta.js
// ==/UserScript==

    //cree nouvel element
    $("#right").append($('<div class="bloc border hallorange"><div class="title halloweentitle">Timer Halloween </div><div class="content links pink"><a class="halloween">zebi</a></div></div></div>'))
    $('.halloweentitle').css('color', '#ff9900')
    $('head').append('<style>.bloc.border.hallorange:before{background: #ff9900;}</style>');

    // Timer Halloween
(function timer() {
    const currentYear = new Date().getFullYear();
    const halloweenDate = new Date(currentYear, 9, 31);
    const timeUntilHalloween = halloweenDate - $.now();
    $(".halloween")[0].innerText = `${Math.floor(timeUntilHalloween / (1000 * 60 * 60 * 24))}j, ${Math.floor((timeUntilHalloween % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}h, ${Math.floor((timeUntilHalloween % (1000 * 60 * 60)) / (1000 * 60))}min, ${Math.floor((timeUntilHalloween % (1000 * 60)) / 1000)}s`;
    setTimeout(timer, 1000);
})();


//Image Citrouille

$('<img />').attr('src', "https://image.noelshack.com/fichiers/2022/40/4/1665057946-jesuscitrouillerevenantgentil.png").width('25px').height('20px').appendTo($('.halloweentitle'));