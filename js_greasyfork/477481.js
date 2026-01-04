// ==UserScript==
// @name               Noapte si zi
// @version            1.00
// @description        Noapte 
// @author             DEMENTU
// @include 	       https://*.the-west.*/game.php*
// @namespace https://greasyfork.org/users/1053629
// @downloadURL https://update.greasyfork.org/scripts/477481/Noapte%20si%20zi.user.js
// @updateURL https://update.greasyfork.org/scripts/477481/Noapte%20si%20zi.meta.js
// ==/UserScript==


(function() {

    TWNM = {
        version: '1.0',
        name: 'Noapte si zi',
        author: 'DEMENTU',
        minGame: '2.01',
        maxGame: Game.version.toString(),
    };

    TheWestApi.register('TWNM', TWNM.name, TWNM.minGame, TWNM.maxGame, TWNM.author, TWNM.website).setGui('Cu acest script, poți comuta jocul în modul noapte.');


    var rangeInput = document.createElement('input');
    rangeInput.type = 'range';
    rangeInput.min = 0;
    rangeInput.max = 100;
    rangeInput.value = 100;
    rangeInput.style.width = '100%';

    rangeInput.addEventListener('input', function() {
        var valoareStralucire = this.value;
        var stralucireTotala = "brightness(" + valoareStralucire + "%)";
        $("#map").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#ui_workcontainer").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#ui_bottomleft").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#ui_bottombar").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#ui_experience_bar").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#ui_topbar").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#ui_character_avatar_container").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#windows").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#ui_notibar").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#buffbars").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#ui_menubar").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#ui_right").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#ui_notifications").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#hiro_friends_container").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#custom_unit_counter_Easter_hasMousePopup_with_log").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#westforts_link_div").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#mpi-playerinfo").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#mission-map-container").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#popup_div_compare").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#popup").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $("#ui_windowdock").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".friendsbar").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".friendsbar-toggle").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".custom_unit_counter.Easter.hasMousePopup.with_log").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".tw2gui_selectbox").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".tw2gui_dialog").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".ui-loader-wrap").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".mpi-ui-topbar").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".mpi-abilities").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".mpi-timeline.animate.horizontal").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".teamlist.team-red.team-right").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".teamlist.team-blue.team-left").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".fancybanner.mpi-end-game-dialog").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".custom_unit_counter.Octoberfest.hasMousePopup.with_log").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".custom_unit_counter.Valentine.hasMousePopup.with_log").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".tw2gui_dialog_framefix").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
        $(".tw2gui_selectbox_header").css({ "filter": stralucireTotala, "-webkit-filter": stralucireTotala });
    });

    document.body.appendChild(rangeInput);
})();
