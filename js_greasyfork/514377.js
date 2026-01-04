// ==UserScript==
// @name       Koszowiec
// @namespace  http://mongla.net
// @description Custom sidebar for easier navigation, based on https://greasyfork.org/pl/scripts/399783-koszowiec 
// @version    0.1
// @match      https://ufs.pt/index.php?threads*
// @require    https://code.jquery.com/jquery-3.5.1.min.js
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/514377/Koszowiec.user.js
// @updateURL https://update.greasyfork.org/scripts/514377/Koszowiec.meta.js
// ==/UserScript==

(function() {
var css = `
    @import url(https://fonts.googleapis.com/css?family=Roboto:300,500&subset=latin-ext);
    @import url(https://fonts.googleapis.com/icon?family=Material+Icons);
    .ufs-mod {
        position: fixed;
        top: 0;
        right: 0;
        width: 40px;  /* Default width when hidden */
        height: 100%;
        z-index: 9999; /* Ensure it's on top of other elements */
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        transition: all ease-out 0.1s;
        pointer-events: none; /* Make hidden sidebar non-interactive */
    }
    .width {
        width: 390px;
        transition: all ease-in 0.1s;
        pointer-events: auto; /* Enable interaction when opened */

    }
    .ufs-mod_desc {
        position: relative;
        width: 360px;
        height: 100%;
        background: #1b1b1b;
        margin: 0 0 0 30px;
        padding: 0;
        box-shadow: 0 14px 28px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.22);
        overflow-y: auto;
        transition: all ease-in 0.2s;
        z-index: 9999; /* Ensure dropdowns are also on top */
    }
    .ufs-mod_container {
        box-sizing: border-box;
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        align-content: center;
        align-items: center;
        font-family: 'Roboto';
        margin: 30px auto;
        text-align: center;
    }
    .ufs-mod_flex_wrap-first, .ufs-mod_flex_wrap {
        display: flex;
        width: 90%;
        justify-content: center;
        background: #222;
    }
    .ufs-mod_button {
        display: inline-block;
        position: relative;
        flex: 1 auto;
        height: 36px;
        width: auto;
        border-radius: 2px;
        font-size: 14px;
        font-weight: 500;
        line-height: 36px;
        text-align: center;
        text-decoration: none;
        text-transform: uppercase;
        overflow: hidden;
        vertical-align: middle;
        cursor: pointer;
        box-sizing: border-box;
        background: #222;
        color: rgba(255,255,255,.47);
        transition: all ease-in-out .2s;
    }
    .ufs-mod_button:hover {
        color: rgba(254,128,3,.57);
        transition: all ease-in-out 0.2s;
    }
    .ufs-mod_dropdown_title {
        display: flex;
        justify-content: flex-end;
        align-content: flex-end;
        position: relative;
        color: rgba(254,128,3,.57);
        font-family: 'Impact', sans-serif;
        font-size: 18px;
        letter-spacing: 3px;
        font-weight: 400;
        text-transform: uppercase;
        line-height: 36px;
        width: 90%;
        overflow: hidden;
        cursor: pointer;
        transition: all ease-in-out .2s;
    }
    .ufs-mod_dropdown_title:hover {
        color: rgba(255,255,255,.57);
        transition: all ease-in-out 0.2s;
    }
    .ufs-mod_button-circle {
        position: absolute;
        top: 15%;
        left: 0;
        width: 50px;
        height: 50px;
        cursor: pointer;
        font-size: 48px;
        color: rgba(255,255,255,.57);
        z-index: 10;
        pointer-events: auto; /* Always allow interaction with the button */
    }
    .material-ripple {
        position: relative;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
    }
    .material-ripple > span {
        position: relative;
        display: block;
        padding: 15px 25px;
    }
    .material-ink {
        position: absolute;
        background: #bdc3c7;
        border-radius: 50%;
        transform: scale(0);
        opacity: .4;
    }
    .material-ink.animate {
        animation: ripple ease-in 375ms;
    }
    @keyframes ripple {
        100% {
            transform: scale(3,3);
            opacity: 0;
        }
    }`;

    if (typeof GM_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(css));
            heads[0].appendChild(node);
        }
    }
})();

$(document).ready(function () {
  $('<aside class="ufs-mod" id="ufs-mod"><div class="ufs-mod_button-circle ufs-mod_material_ripple material-icons">reply_all</div><section class="ufs-mod_desc"><div class="ufs-mod_container"><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="udp">Do Poprawy</div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="gry">Gry</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="grypl">PC PL</div><div class="ufs-mod_button ufs-mod_material_ripple" id="gryeng">PC ENG</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="filmypl">Filmy Polskie</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="plhq">HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="pl720">720p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="pl1080">1080p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="pl4k">4k</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="filmyld">Filmy Lektor&Dubbing</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="lekhq">HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="lek720">720p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="lek1080">1080p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="lek4k">4k</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="filmyz">Filmy Zagraniczne</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="zag">HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="zag720">720p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="zag1080">1080p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="zag4k">4k</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="filmya">Anime|Animowane|Bajki</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="anihq">HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="ani720">720p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="ani1080">1080p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="ani4k">4k</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="filmyp">Filmy Pozostałe | Sport</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="trzy">3D</div><div class="ufs-mod_button ufs-mod_material_ripple" id="dvdr">DVD-R</div><div class="ufs-mod_button ufs-mod_material_ripple" id="doku">Dokumentalne</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="kab">Kabarety | Stand-up</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sport">Sport</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="sezpl">Seriale Polskie</div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="serialeld">Seriale Lektor&Dub</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="sezld">HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sezld720">720p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sezld1080">1080p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sezld4k">4k</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="serialezag">Seriale Zagraniczne</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="sezzag">HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sezzag720">720p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sezzag1080">1080p</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sezzag4k">4k</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="serialeinne">SERIALE INNE</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="sinne">Dok | inne</div><div class="ufs-mod_button ufs-mod_material_ripple" id="sanime">Anime | Animowane | Bajki</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="muza">MUZYKA</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="muzyka">Muzyka</div><div class="ufs-mod_button ufs-mod_material_ripple" id="flac">FLAC</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="prog">PROGRAMY</div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="porno">PORNO</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="pornohq">XXX HQ</div><div class="ufs-mod_button ufs-mod_material_ripple" id="pornohd">XXX HD</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="inne">INNE</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="kursy">Kursy</div><div class="ufs-mod_button ufs-mod_material_ripple" id="ebook">E-Book</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="audbok">Audiobook</div><div class="ufs-mod_button ufs-mod_material_ripple" id="otrs">Inne</div></div><div class="ufs-mod_dropdown_title ufs-mod_material_ripple" id="koszyk">Dubel | Kosz</div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="kosz">Kosz</div><div class="ufs-mod_button ufs-mod_material_ripple" id="htp">Kosz HTTP</div></div><div class="ufs-mod_flex_wrap"><div class="ufs-mod_button ufs-mod_material_ripple" id="dubel">Dubel</div><div class="ufs-mod_button ufs-mod_material_ripple" id="udp">Poprawa</div></div></div></section></aside>'
  ).appendTo('body');

    $(".ufs-mod_material_ripple").click(function(event) {
        var surface = $(this);
        if (surface.find(".material-ink").length === 0) {
            surface.prepend("<div class='material-ink'></div>");
        }
        var ink = surface.find(".material-ink");
        ink.removeClass("animate");
        if (!ink.height() && !ink.width()) {
            var diameter = Math.max(surface.outerWidth(), surface.outerHeight());
            ink.css({ height: diameter, width: diameter });
        }
        var xPos = event.pageX - surface.offset().left - ink.width() / 2;
        var yPos = event.pageY - surface.offset().top - ink.height() / 2;
        var rippleColor = surface.css("color");
        ink.css({
            top: yPos + "px",
            left: xPos + "px",
            background: rippleColor
        }).addClass("animate");
    });

    $(".ufs-mod_dropdown_title").click(function() {
        $(this).nextUntil(".ufs-mod_dropdown_title").slideToggle();
    });

    $(".ufs-mod_flex_wrap").hide();
    //$(".ufs-mod").toggleClass("width");


$(".ufs-mod_button-circle").click(function(event) {
    event.stopPropagation();  

    const sidebar = $(".ufs-mod");
    const isOpen = sidebar.attr("data-isopen") === "true";  
    const overlayActive = $(".overlay-container.is-active").length > 0;

    // Toggle sidebar open/close logic
    if (isOpen) {
        sidebar.attr("data-isopen", "false");  
        sidebar.css("width", "40px");  
        sidebar.css("pointer-events", "none");  
    } else {
        sidebar.attr("data-isopen", "true");  
        sidebar.css("width", "390px");  
        sidebar.css("pointer-events", "auto");  
    }

    if (!overlayActive) {
        var moveLink = $("a.menu-linkRow:contains('Przenieś wątek')");

        if (moveLink.length > 0) {
            moveLink[0].click();  
        } else {
            console.error('Move link not found on this page.');
        }
    } else {
        console.log('Overlay is active, not clicking the link.');
    }
});


// Mapping of button IDs 
const buttonValueMap = {
    'kosz': "47",      // Kosz
    'htp': "48",      // Kosz HTTP
    'udp': "34",      // Niezatwierdzone
    'dubel': "33",    // Dubel
    'udp': "31",      // Poprawa
    'grypl': "51",     // Gry PC PL
    'gryeng': "52",    // Gry PC ENG
    'plhq': "54",     //  LQ
    'pl720': "55",    // 720p
    'pl1080': "56",   // 1080p
    'pl4k': "104",   // 4k
    'lekhq': "57",    // Lektor LQ
    'lek720': "58",   // Lektor 720p
    'lek1080': "59",  // Lektor 1080p
    'lek4k': "105",  // Lektor 4k
    'zag': "60",      // Zagraniczne LQ
    'zag720': "61",   // Zagraniczne 720p
    'zag1080': "62",  // Zagraniczne 1080p
    'zag4k': "106",  // Zagraniczne 4k
    'anihq': "63",    // Anime LQ
    'ani720': "64",   // Anime 720p
    'ani1080': "65",  // Anime 1080p
    'ani4k': "107",  // Anime 4k
    'trzy': "67",     // 3D
    'dvdr': "69",     // DVD-R
    'doku': "70",     // Dokumentalne
    'kab': "71",      // Kabarety
    'sport': "72",    // Sport
 // 'sezwt': "74",    // seriale w trakcie LQ
 // 'sezwt720': "75", // 720p
 // 'sezwt1080': "76",// 1080p
 // 'sezwt4k': "108",// 4k
    'sezpl': "78",    // HQ
    'sezld': "79",    // Lektor LQ
    'sezld720': "80", // Lektor 720p
    'sezld1080': "81",// Lektor 1080p
    'sezld4k': "109",// Lektor 4k
    'sezzag': "82",   // LQ
    'sezzag720': "83",// 720p
    'sezzag1080': "84",// 1080p
    'sezzag4k': "110",// 4k
    'sanime': "85",   // Anime
    'sinne': "86",    // Inne dok
    'muzyka': "87",   // Muzyka
    'flac': "88",     // FLAC
    'prog': "89",     // Programy
    'pornohq': "90",  // Porno LQ
    'pornohd': "91",  // Porno HD
    'kursy': "93",    // Kursy
    'ebook': "94",    // E-Book
    'audbok': "95",   // Audiobook
    'otrs': "96"      // Inne
};

// Button click handlers
$.each(buttonValueMap, function(buttonId, value) {
    $('#' + buttonId).click(function() {
        $("select[name='target_node_id']").val(value).trigger('change'); 
    });
});
    });
