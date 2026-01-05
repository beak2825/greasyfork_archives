// ==UserScript==
// @name            Vote Explosion Effect
// @namespace       voteexplosion
// @description     Robi BUUUM.
// @include         http://*.wykop.pl/*
// @include         https://*.wykop.pl/*
// @version         2.8.5
// @downloadURL https://update.greasyfork.org/scripts/16867/Vote%20Explosion%20Effect.user.js
// @updateURL https://update.greasyfork.org/scripts/16867/Vote%20Explosion%20Effect.meta.js
// ==/UserScript==

/*jslint browser: true*/
/*jslint plusplus: true */
/*jshint multistr: true */
/*jslint es5: true */
/*global $, jQuery, alert*/

//                                     88
//                                     ""
//
//   ,adPPYba,  8b,dPPYba,   ,adPPYba, 88  ,adPPYba,
//  a8"     "8a 88P'    "8a a8"     "" 88 a8P_____88
//  8b       d8 88       d8 8b         88 8PP"""""""
//  "8a,   ,a8" 88b,   ,a8" "8a,   ,aa 88 "8b,   ,aa
//   `"YbbdP"'  88`YbbdP"'   `"Ybbd8"' 88  `"Ybbd8"'
//              88                    ,88
//              88                  888P"


var options = {
        particleSpread:     150,
        particleCount:      20,
        version: '2.8.1.4',
        velocity: false
    },
    voteCount = {
        VOTEplus:       0,
        VOTEminus:      0,
        VOTEsub:        0,
        VOTEfav:        0,
        VOTEblock:      0,
        VOTEdigg:       0,
        VOTEbury:       0,
    };

var head = document.getElementsByTagName('head')[0],
    velocity = document.createElement('script');
velocity.type = 'text/javascript';
velocity.onload = function () {
    'use strict';
    options.velocity = true;
};
velocity.src = 'https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js';
head.appendChild(velocity);

// ustawienia

if (localStorage.getItem("particleSpread")) {
    options.particleSpread = localStorage.getItem("particleSpread");
}

if (localStorage.getItem("particleCount")) {
    options.particleCount = localStorage.getItem("particleCount");
}

// liczba głosów
function updateVoteCount() {
    'use strict';
    if (localStorage.getItem("VOTEplus")) {
        voteCount.VOTEplus = localStorage.getItem("VOTEplus");
    } else {
        localStorage.setItem("VOTEplus", 0);
    }

    if (localStorage.getItem("VOTEminus")) {
        voteCount.VOTEminus = localStorage.getItem("VOTEminus");
    } else {
        localStorage.setItem("VOTEminus", 0);
    }

    if (localStorage.getItem("VOTEsub")) {
        voteCount.VOTEsub = localStorage.getItem("VOTEsub");
    } else {
        localStorage.setItem("VOTEsub", 0);
    }

    if (localStorage.getItem("VOTEfav")) {
        voteCount.VOTEfav = localStorage.getItem("VOTEfav");
    } else {
        localStorage.setItem("VOTEfav", 0);
    }

    if (localStorage.getItem("VOTEblock")) {
        voteCount.VOTEblock = localStorage.getItem("VOTEblock");
    } else {
        localStorage.setItem("VOTEblock", 0);
    }

    if (localStorage.getItem("VOTEdigg")) {
        voteCount.VOTEdigg = localStorage.getItem("VOTEdigg");
    } else {
        localStorage.setItem("VOTEdigg", 0);
    }

    if (localStorage.getItem("VOTEbury")) {
        voteCount.VOTEbury = localStorage.getItem("VOTEbury");
    } else {
        localStorage.setItem("VOTEbury", 0);
    }

    if (localStorage.getItem("liveEntries")) {
        voteCount.liveEntries = localStorage.getItem("liveEntries");
    } else {
        localStorage.setItem("liveEntries", 0);
    }
}

function incVoteCount(countName) {
    'use strict';
    var thisVoting = localStorage.getItem(countName);
    thisVoting++;
    localStorage.setItem(countName, thisVoting);
}

function decVoteCount(countName) {
    'use strict';
    var thisVoting = localStorage.getItem(countName);
    thisVoting--;
    if (thisVoting < 0) {
        thisVoting = 0;
    }
    localStorage.setItem(countName, thisVoting);
}



//                                88
//              ,d                88
//              88                88
//  ,adPPYba, MM88MMM 8b       d8 88  ,adPPYba,
//  I8[    ""   88    `8b     d8' 88 a8P_____88
//   `"Y8ba,    88     `8b   d8'  88 8PP"""""""
//  aa    ]8I   88,     `8b,d8'   88 "8b,   ,aa
//  `"YbbdP"'   "Y888     Y88'    88  `"Ybbd8"'
//                        d8'
//                       d8'


$('head')
    .append(`
<style type="text/css">
    .particleGreen {
        color: #3b915f;
    }
    .particleGray {
        color: #999;
    }
    .particleGold {
        color: #c7a054;
    }
    .particleRed {
        color: #c0392b;
    }
    .particle {
        position: absolute;
        pointer-events: none;
        z-index: 16669;
        -webkit-transform: translateZ(0);
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        -o-transform: translateZ(0);
        transform: translateZ(0);
    }
    .particle i.fa {
        font-size: 1.5rem;
    }
    .optionsHalf {
        float:left;
    }
    body li.entry ul.responsive-menu b a.affect {
        color: #c0392b !important;
    }
    body li.entry .lcontrast:hover ul.responsive-menu b a.affect {
        color: #c0392b !important;
    }
    .voteCount {
        margin-top: 10px;
        display: inline-block;
        font-size: 20px;
        font-weight: 700;
    }
    .saveState.optionsActive {
        transform: scale(1);
        border: 1px solid rgba(255,255,255,1);
        color: white !important;
    }
    .saveState {
        border-radius: 5px;
        transition: 0.2s all;
        transform: scale(0.8);
        cursor: pointer;
        display: inline-block;
        margin: 0 3px;
        padding: 15px 0;
        width: 55px;
        border: 1px solid rgba(150,150,150,0.1);
    }
    input[type="number"] {
        padding: 1rem .6rem;
        width: 100%;
        border: 1px solid rgba(155,155,155,0.5);
        background-color: transparent;
    }
</style>`
);



//     ad88                         88                  88
//    d8"                           88                  ""
//    88                            88
//  MM88MMM 88       88 8b,dPPYba,  88   ,d8  ,adPPYba, 88  ,adPPYba,
//    88    88       88 88P'   `"8a 88 ,a8"  a8"     "" 88 a8P_____88
//    88    88       88 88       88 8888[    8b         88 8PP"""""""
//    88    "8a,   ,a88 88       88 88`"Yba, "8a,   ,aa 88 "8b,   ,aa
//    88     `"YbbdP'Y8 88       88 88   `Y8a `"Ybbd8"' 88  `"Ybbd8"'
//                                                     ,88
//                                                   888P"

function getParticlePosition(x, y, direction) {

    'use strict';

    var spread = Math.floor((Math.random() * options.particleSpread) + 1 - (options.particleSpread / 2)),
        randomX = x - spread,
        randomY = y - spread,
        randomDirection = Math.floor((Math.random() * 200) + 1);

    if (direction === 'down') {
        randomY = randomY + randomDirection;
    } else {
        randomY = randomY - randomDirection;
    }

    return [randomX, randomY];
}

function randomRotate() {
    'use strict';
    return Math.floor((Math.random() * 360) + 1);
}

function randomZoom() {
    'use strict';
    return 2 - (Math.floor((Math.random() * 200) + 1) / 100);
}

function particleExplode(iconClass, colorClass, direction, click) {

    'use strict';

    var bodyElemsVote = document.getElementsByTagName("body"),
        bodyVote = bodyElemsVote[0],
        posX = click.pageX,
        posY = click.pageY,
        particleRandomClass = 'particle_' + Math.random().toString(36).substring(4),
        particlesArray = [],
        particle = '';

    for (var i = 0; i < options.particleCount; i++) {
        var particleID = 'particle_' + Math.random().toString(36).substring(4),
            particleClass = 'particle ' + colorClass + ' ' + particleRandomClass,
            particleStyle = 'top: ' + posY + 'px; left: ' + posX + 'px;',
            particle = particle + '<div class="' + particleClass + '" style="' + particleStyle + '" id="' + particleID + '"><i class="fa ' + iconClass + '"></i></div>';

            particlesArray[i] = particleID;
    }

    document.body.insertAdjacentHTML('beforeend', particle);

    for (var i = 0; i < options.particleCount; i++) {
        var particlePosition = getParticlePosition(posX, posY, direction),
            fadeOutTime = 500 + Math.floor((Math.random() * 500) + 1),
            animOptions = {
                easing: [0,.84,.25,.99],
                duration: fadeOutTime,
                queue: false
            },
            particle = $('#' + particlesArray[i]),
            particleID = particle.attr('id');

            particle.velocity({   top: particlePosition[1],
                                                    left: particlePosition[0],
                                                    rotateZ: randomRotate(),
                                                    scale: randomZoom() }, animOptions)
                                        .velocity('fadeOut', fadeOutTime, { queue: false })
                                        .velocity({function(){
                var thisParticle = document.getElementById($(this).attr('id'));
                thisParticle.remove();
            }}, {delay: fadeOutTime}, { queue: false });
    }
}

function updateSettings() {
    'use strict';
    $('.saveState').each(function(){
        var thisOptionName = $(this).attr('data-saveattr');
        if(localStorage['enabled_' + thisOptionName] == 'undefined') {
            localStorage['enabled_' + thisOptionName] = 'true';
        }
        if(localStorage['enabled_' + thisOptionName] == 'true') {
            $(this).addClass('optionsActive');
        }
    });
}




$('body').on('click', '.saveState', function() {
    'use strict';
    $(this).toggleClass('optionsActive');
    var thisOptionName = $(this).attr('data-saveattr');
    if(localStorage['enabled_' + thisOptionName] == 'true') {
        localStorage['enabled_' + thisOptionName] = false;
    } else {
        localStorage['enabled_' + thisOptionName] = true;
    }
});

function checkOption(thisOptionName) {
    'use strict';
    if(localStorage['enabled_' + thisOptionName] == 'false') {
        return false;
    } else {
        return true;
    }
}

function particleExplodeRemote(object, iconClass, colorClass, direction) {
    'use strict';
    var $this = $(object);
    var offset = $this.offset();
    var width = $this.width();
    var height = $this.height();

    var centerX = offset.left + width / 2;
    var centerY = offset.top + height / 2;
    var click = {
        pageX: centerX,
        pageY: centerY
    }
    particleExplode(iconClass, colorClass, direction, click);
}

//     ad88 88
//    d8"   ""
//    88
//  MM88MMM 88 8b,     ,d8 8b       d8
//    88    88  `Y8, ,8P'  `8b     d8'
//    88    88    )888(     `8b   d8'
//    88    88  ,d8" "8b,    `8b,d8'
//    88    88 8P'     `Y8     Y88'
//                             d8'
//                            d8'


$(document).ready(function(){
    'use strict';
    updateVoteCount();
});


//  88,dPYba,,adPYba,   ,adPPYba, 8b,dPPYba,  88       88
//  88P'   "88"    "8a a8P_____88 88P'   `"8a 88       88
//  88      88      88 8PP""""""" 88       88 88       88
//  88      88      88 "8b,   ,aa 88       88 "8a,   ,a88
//  88      88      88  `"Ybbd8"' 88       88  `"YbbdP'Y8


$('.dropdown.right.m-hide div ul li:last').before(`
    <li>
        <a href="#" title="" id="openSettingsWindow">
            <i class="fa fa-wrench"></i> <span>opcje skryptu</span>
        </a>
    </li>
`);

$('body').on('click', '#openSettingsWindow', function(){
    updateVoteCount();
    var userNick = $('.dropdown-show.auto > img.avatar').attr('alt');

    if(localStorage.getItem("particleSpread")) {
        var particleSpread = localStorage.getItem("particleSpread");
    } else {
        var particleSpread = options.particleSpread;
    }

    if(localStorage.getItem("particleCount")) {
        var particleCount = localStorage.getItem("particleCount");
    } else {
        var particleCount = options.particleCount;
    }

    var settingsForm = `<br>
                            <p><strong>Ustawienia skryptu</strong></p>
                            <p>Kliknij, by włączyć lub wyłączyć naliczanie oraz animacje po kliknięciu. Podświetlone na biało = włączone. Ostatni przycisk uruchamia funkcje Heartbeat (na bieżąco odświeża wartości plusów).</p>
                            <div><br \>
                                <div style="margin: 10px; text-align: center;">
                                    <div class="particleGreen saveState" data-saveattr="VOTEplus" data-value="0">
                                        <p><i class="fa fa-plus" style="font-size: 40px;"></i></p>
                                        <p class="voteCount">${voteCount.VOTEplus}</p>
                                    </div>
                                    <div class="particleRed saveState" data-saveattr="VOTEminus" data-value="0">
                                        <p><i class="fa fa-minus" style="font-size: 40px;"></i></p>
                                        <p class="voteCount">${voteCount.VOTEminus}</p>
                                    </div>
                                    <div class="particleGold saveState" data-saveattr="VOTEfav" data-value="0">
                                        <p><i class="fa fa-star" style="font-size: 40px;"></i></p>
                                        <p class="voteCount">${voteCount.VOTEfav}</p>
                                    </div>
                                    <div class="particleGreen saveState" data-saveattr="VOTEsub" data-value="0">
                                        <p><i class="fa fa-eye" style="font-size: 40px;"></i></p>
                                        <p class="voteCount">${voteCount.VOTEsub}</p>
                                    </div>
                                    <div class="particleRed saveState" data-saveattr="VOTEblock" data-value="0">
                                        <p><i class="fa fa-lock" style="font-size: 40px;"></i></p>
                                        <p class="voteCount">${voteCount.VOTEblock}</p>
                                    </div>
                                    <div class="particleGreen saveState" data-saveattr="VOTEdigg" data-value="0">
                                        <p><i class="fa fa-thumbs-up" style="font-size: 40px;"></i></p>
                                        <p class="voteCount">${voteCount.VOTEdigg}</p>
                                    </div>
                                    <div class="particleRed saveState" data-saveattr="VOTEbury" data-value="0">
                                        <p><i class="fa fa-thumbs-down" style="font-size: 40px;"></i></p>
                                        <p class="voteCount">${voteCount.VOTEbury}</p>
                                    </div>
                                    <div class="particleGold saveState" data-saveattr="liveEntries" data-value="0">
                                        <p><i class="fa fa-heart" style="font-size: 40px;"></i></p>
                                        <p class="voteCount">&nbsp;</p>
                                    </div>
                                </div>
                            </div>
                            <br>
                            <div class="optionsHalf" style="width: 49%; margin: 0 1% 0 0;">
                                <label for="particleSpread">wielkość wybuchu (px)</label>
                                <input type="number" min="0" step="5" class="form-control" id="particleSpread" value="${particleSpread}">
                            </div>
                            <div class="optionsHalf" style="width: 49%; margin: 0 0 0 1%;">
                                <label for="particleCount">ilość cząsteczek</label>
                                <input type="number" min="0" step="5" class="form-control" id="particleCount" value="${particleCount}">
                            </div>
                            <br>
                            <div style="clear:both;"><br></div>
                            <div style=" margin: 10px">
                                <div style="margin: 15px; text-align: center;" id="msgContainer">Zmiany zapisują się automatycznie.</div>
                            </div>`,
        settingsPropaganda = `<div style="clear:both;"><br></div>
                                <img src="http://xw.cdn03.imgwykop.pl/c3397992/Dreszczyk_WDOQLWuDSL,q48.jpg" style="float:left; margin-right: 10px;">Cześć ${userNick}. Tutaj twórca tego skryptu, @Dreszczyk. Jeżeli chcesz podziękować z ten skrypt, to wiedz, że bardzo lubie <a href="http://www.wykop.pl/ludzie/Dreszczyk/">subskrybowanie mojego profilu</a>.`,
        settingsWindow = `<div id="violationContainer">
                                <div class="overlay" style="display: block;"></div>
                                <div id="zgloszenie" style="display: none;" class="normal m-set-fullwidth m-reset-top m-reset-margin m-reset-left">
                                    <form id="scriptSettings">
                                        <div class="header">
                                            <a href="#" title="zamknij" class="fright close"><span class="icon inlblk mini closepreview"><i class="fa fa-times"></i></span></a>
                                            <span class="title">Vote Explosion Script - ustawienia (${options.version})</span>
                                        </div>
                                        <div class="view" style="max-height: initial;">${settingsForm}${settingsPropaganda}</div>
                                    </form>
                                </div>
                            </div>`;

    $('body').prepend(settingsWindow).find('#zgloszenie').fadeIn(250, function(){
        'use strict';
        updateSettings();
    });
});

$('body').on('click', 'div.overlay', function(){
    'use strict';
    $('#violationContainer').remove();
});

$('body').on('change', '#scriptSettings input', function(){
    'use strict';
    localStorage.setItem($(this).attr('id'), $(this).val());
    options[$(this).attr('id')] = $(this).val();
    $('#msgContainer').html('Zmiany zapisują się automatycznie.<br><b>zapisane</b>.');
});


//              88
//              88
//              88
//  8b,dPPYba,  88 88       88 ,adPPYba, 8b       d8
//  88P'    "8a 88 88       88 I8[    "" `8b     d8'
//  88       d8 88 88       88  `"Y8ba,   `8b   d8'
//  88b,   ,a8" 88 "8a,   ,a88 aa    ]8I   `8b,d8'
//  88`YbbdP"'  88  `"YbbdP'Y8 `"YbbdP"'     Y88'
//  88                                       d8'
//  88                                      d8'

$('body').on('click', 'a.button.mikro.ajax', function (click) {
    'use strict';

    var colorClass;

    if($(this).parent().find('.fa-minus').length) { // komentarz ze znaleziska
        if($(this).find('.fa-plus').length) { // dajemy plusa
            if(checkOption('VOTEPlus')) {
                if(!colorClass) {
                  colorClass = 'particleGreen';
                }
                particleExplode('fa-plus', colorClass, 'up', click);
                if($(this).parent().find('.disabled').length) { // dajemy plusa, a już daliśmy minusa
                    decVoteCount('VOTEminus');
                }
                incVoteCount('VOTEplus');
            }
        } else { // dajemy minusa
            if(checkOption('VOTEminus')) {
                if(!colorClass) {
                  colorClass = 'particleRed';
                }
                particleExplode('fa-minus', colorClass, 'down', click);
                if($(this).parent().find('.disabled').length) { // dajemy minusa, a już daliśmy plusa
                    decVoteCount('VOTEplus');
                }
                incVoteCount('VOTEminus');
            }
        }
    } else { // wpis na mikroblogu
        if($(this).parent().find('.voted').length) { // zabieramy plusa
            if(checkOption('VOTEminus')) {
                if(!colorClass) {
                  colorClass = 'particleRed';
                }
                particleExplode('fa-minus', colorClass, 'down', click);
                decVoteCount('VOTEplus');
            }
        } else {
            if(checkOption('VOTEplus')) {
                if(!colorClass) {
                  colorClass = 'particleGreen';
                }
                particleExplode('fa-plus', colorClass, 'up', click);
                incVoteCount('VOTEplus');
            }
        }
    }
});


//                             88
//                             88
//                             88
//       ,adPPYba, 88       88 88,dPPYba,
//       I8[    "" 88       88 88P'    "8a
//        `"Y8ba,  88       88 88       d8
//       aa    ]8I "8a,   ,a88 88b,   ,a8"
//       `"YbbdP"'  `"YbbdP'Y8 8Y"Ybbd8"'


$('body').on('click', 'a[title="Dodaj do obserwowanych"]', function (click) {
    'use strict';
    if(checkOption('VOTEsub')) {
        particleExplode('fa-eye', 'particleGreen', 'up', click);
        incVoteCount('VOTEsub');
    }
});

$('body').on('click', 'a[title="Usuń z obserwowanych"]', function (click) {
    'use strict';
    if(checkOption('VOTEsub')) {
        particleExplode('fa-eye-slash', 'particleGray', 'down', click);
        decVoteCount('VOTEsub');
    }
});


//           88 88
//           88 ""
//           88
//   ,adPPYb,88 88  ,adPPYb,d8
//  a8"    `Y88 88 a8"    `Y88
//  8b       88 88 8b       88
//  "8a,   ,d88 88 "8a,   ,d88
//   `"8bbdP"Y8 88  `"YbbdP"Y8
//                  aa,    ,88
//                   "Y8bbdP"

// niewykopany i niezakopany - wykopywanie i cofanie wykopu
$('body').on('click', '.diggbox:not(.burried) span', function (click) {
    'use strict';
    if($(this).parent().parent().hasClass('digout')) {
        if(checkOption('VOTEdigg')) {
            particleExplode('fa-thumbs-down', 'particleRed', 'down', click);
            decVoteCount('VOTEdigg');
        }
    } else {
        if(checkOption('VOTEdigg')) {
            particleExplode('fa-thumbs-up', 'particleGreen', 'up', click);
            incVoteCount('VOTEdigg');
        }
    }
});

// niewykopany i niezakopany - zakopywanie
$('body').on('click', '.diggbox .dropdown ul li a', function (click) {
    'use strict';
    if(checkOption('VOTEbury')) {
        particleExplode('fa-thumbs-down', 'particleRed', 'down', click);
        incVoteCount('VOTEbury');
    }
});

// zakopany - cofanie zakopu
$('body').on('click', '.diggbox.burried span', function (click) {
    'use strict';
    if(checkOption('VOTEbury')) {
        particleExplode('fa-thumbs-down', 'particleRed', 'down', click);
        decVoteCount('VOTEbury');
    }
});

//     ad88
//    d8"
//    88
//  MM88MMM ,adPPYYba, 8b       d8
//    88    ""     `Y8 `8b     d8'
//    88    ,adPPPPP88  `8b   d8'
//    88    88,    ,88   `8b,d8'
//    88    `"8bbdP"Y8     "8"

$('body').on('click', 'div.actions ul.responsive-menu a', function (click) {
    'use strict';
    if($(this).text() == ' ulubiony') {
        if(checkOption('VOTEfav')) {
            if($(this).parent().is('b')) {
                    particleExplode('fa-star-o', 'particleGray', 'down', click);
                    decVoteCount('VOTEfav');
            } else {
                particleExplode('fa-star', 'particleGold', 'up', click);
                incVoteCount('VOTEfav');
            }
        }
    }
});


//  88          88                        88
//  88          88                        88
//  88          88                        88
//  88,dPPYba,  88  ,adPPYba,   ,adPPYba, 88   ,d8
//  88P'    "8a 88 a8"     "8a a8"     "" 88 ,a8"
//  88       d8 88 8b       d8 8b         8888[
//  88b,   ,a8" 88 "8a,   ,a8" "8a,   ,aa 88`"Yba,
//  8Y"Ybbd8"'  88  `"YbbdP"'   `"Ybbd8"' 88   `Y8a


$('body').on('click', 'a[title="zablokuj użytkownika"]', function (click) {
    'use strict';
    if(checkOption('VOTEblock')) {
        particleExplode('fa-lock', 'particleRed', 'down', click);
        incVoteCount('VOTEblock');
    }
});

$('body').on('click', 'a[title="odblokuj użytkownika"]', function (click) {
    'use strict';
    if(checkOption('VOTEblock')) {
        particleExplode('fa-unlock', 'particleGray', 'up', click);
        decVoteCount('VOTEblock');
    }
});


//  88 88             88                                                                     88
//  88 ""             ""                                                    ,d               ""
//  88                                                                      88
//  88 88 8b       d8 88 8b,dPPYba,   ,adPPYb,d8     ,adPPYba, 8b,dPPYba, MM88MMM 8b,dPPYba, 88  ,adPPYba, ,adPPYba,
//  88 88 `8b     d8' 88 88P'   `"8a a8"    `Y88    a8P_____88 88P'   `"8a  88    88P'   "Y8 88 a8P_____88 I8[    ""
//  88 88  `8b   d8'  88 88       88 8b       88    8PP""""""" 88       88  88    88         88 8PP"""""""  `"Y8ba,
//  88 88   `8b,d8'   88 88       88 "8a,   ,d88    "8b,   ,aa 88       88  88,   88         88 "8b,   ,aa aa    ]8I
//  88 88     "8"     88 88       88  `"YbbdP"Y8     `"Ybbd8"' 88       88  "Y888 88         88  `"Ybbd8"' `"YbbdP"'
//                                    aa,    ,88
//                                     "Y8bbdP"

if(window.location.href.indexOf("wykop.pl/wpis") > -1) {
    setInterval(function(){
        if(localStorage.getItem("enabled_liveEntries") == 'true') {
            $.ajax({
                url: window.location.href
            })
            .done(function(data) {
                var explosions = 0;
                $(data).find('div.wblock.dC').each(function(index, el) {
                    'use strict';
                    var voteCountObj = $(el).find('p.vC');
                    var voteCount = voteCountObj.attr('data-vc');
                    var entryID = $(el).attr('data-id');

                    var voteCurrent = $('div.wblock.dC[data-id="' + entryID + '"]');
                    var voteCurrentCountObj = voteCurrent.find('p.vC');
                    var voteCurrentCount = voteCurrentCountObj.attr('data-vc');

                    if(voteCount !== voteCurrentCount) {
                        var explosionTimeout = explosions * 1500;
                        explosions++;
                        if(voteCount > voteCurrentCount) {
                            setTimeout(function() {
                                voteCurrentCountObj.attr('data-vc', voteCount);
                                voteCurrent.find('p.vC').html(voteCountObj.html());
                                particleExplodeRemote(voteCurrentCountObj.find('b.plus'), 'fa-plus', 'particleGreen', 'up');
                            }, explosionTimeout);
                        } else {
                            setTimeout(function() {
                                voteCurrentCountObj.attr('data-vc', voteCount);
                                voteCurrent.find('p.vC').html(voteCountObj.html());
                                particleExplodeRemote(voteCurrentCountObj.find('b.plus'), 'fa-minus', 'particleRed', 'down');
                            }, explosionTimeout);
                        }
                    }

                });
            });
        }
    }, 10000);
}

    //                        ,,#%%%%#,,                                 ,,%%%%%#,,
    //         %%/        .#@@@@@@@%%&@@@@(        #%%#.             .#@@@@@@@%%&@@@@(
    //       *@@(       .@@#@@/  (@@      (@%.     &@@@.           .@@#@@/  (@@   .@@@@%.
    //      *@@%           ,@%    &@,              &@@@.              ,@%    &@,   %@@/
    //     *@@@.            /@@%%@@%               &@@@@@#             /@@%&@@%    .&@@/
    //     &@@@              ./%%*                 #%%@@@@&.            ./%%*       (@@&.
    //     @@@%                                        .&@@@.                       ,@@@/
    //    .@@@(                                         (@@@*                       .&@@#
    //    .@@@#                                         (@@@*                       .&@@(
    //     @@@%                                @@@(    /@@@#                        ,@@@,
    //     %@@@                                /@@@@@@@@@@(                         (@@%
    //      &@@*                                  *#%%%*.                          ,@@&.
    //      .@@&                           .&@%              (@@/                  %@@,
    //        %@&.                            *@@@@%%%%%%@@@@(.                   *@@/
    //         ,,.                               .,#%%%%%*,                       ,,.

(() => {
    let aprilFools = new Date(2017,3,1).setHours(0,0,0,0).toString();
    let today = new Date().setHours(0,0,0,0).toString();
    if (
        aprilFools === today &&
        !localStorage.getItem("funDisable")
    ) {
        if(!localStorage.getItem("funSize")) {
            localStorage.setItem("funSize", 0);
        } else {
            let blur = 'blur(' + localStorage.getItem("funSize") + 'px)';
            $('div#footer, div#site, ul.mainnav, div.doodle')
                      .hide()
                      .css('filter', blur)
                      .css('webkitFilter', blur)
                      .css('mozFilter', blur)
                      .css('oFilter', blur)
                      .css('msFilter', blur)
                      .css('transition', 'all 30s')
                      .show();
            console.log('( ͡° ͜ʖ ͡°) śmieszkowanie z siłą ' + localStorage.getItem("funSize") + ' pikseli');
        }
        let increaseFun = () => {
            let newFun = Number(localStorage.getItem("funSize")) + 0.1;
            let blur = 'blur(' + newFun + 'px)';
            localStorage.setItem("funSize", newFun);
            $('div#footer, div#site, ul.mainnav, div.doodle').css('filter', blur)
                      .css('webkitFilter', blur)
                      .css('mozFilter', blur)
                      .css('oFilter', blur)
                      .css('msFilter', blur)
                      .css('transition', 'all 10s');
            console.log('( ͡° ͜ʖ ͡°) śmieszkowanie z siłą ' + newFun + ' pikseli');
            return newFun;
        }
        setInterval(() => {
            increaseFun();
        }, 30000);
        $('.dropdown.right.m-hide div ul li:last').before(`
            <li>
                <a href="" id="funDisable">
                    <i class="fa fa-smile-o"></i> <span>prima aprillis!</span>
                </a>
            </li>
        `);
        $('body').on('click', '#funDisable', (e) => {
            e.preventDefault();
            localStorage.setItem("funDisable", 1);
            window.location.href = 'http://www.wykop.pl/wpis/23037911';
        });
    }
})();
