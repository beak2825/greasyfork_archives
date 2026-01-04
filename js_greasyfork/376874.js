// ==UserScript==
// @name         (Fix Gui) Moomoo, Finally added ★Change Hat Keys Are in Description
// @version       Version 0.4
// @namespace    원 아이 킹#3565 Hax
// @description  Ask permission Before putting/ Adding it on a Script add me on discord, name in description
// @author       원 아이 킹#3565
// @match        ://moomoo.io/*
// @match        http://sandbox.moomoo.io/*
// @grant        none
// @icon http://i.imgur.com/rJQ6lO6.png
// @downloadURL https://update.greasyfork.org/scripts/376874/%28Fix%20Gui%29%20Moomoo%2C%20Finally%20added%20%E2%98%85Change%20Hat%20Keys%20Are%20in%20Description.user.js
// @updateURL https://update.greasyfork.org/scripts/376874/%28Fix%20Gui%29%20Moomoo%2C%20Finally%20added%20%E2%98%85Change%20Hat%20Keys%20Are%20in%20Description.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //primary hats
    var ID_TankGear = 40; //[
    var ID_SoldierHelmet = 6; //-
    //Offensive
    var ID_BullHelmet = 7; //=
    var ID_EmpHelmet = 22; //]
    var ID_SpikeGear = 11; //b
    //Speed
    var ID_WinterCap = 15; //'
    var ID_BoosterHat = 12; //\

    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            // Primary
            case 219: storeEquip(ID_TankGear); break;
            case 189: storeEquip(ID_SoldierHelmet); break;
            // Offensive
            case 66: storeEquip(ID_SpikeGear); break;
            case 187: storeEquip(ID_BullHelmet); break;
            case 221: storeEquip(ID_EmpHelmet); break;
            case 86: storeEquip(ID_SamuraiArmor); break;
            // speed
            case 222: storeEquip(ID_WinterCap); break;
            case 220: storeEquip(ID_BoosterHat); break;
        }
    });

})();
 (function() {
	'use strict';

	var conf = {
		'map': {
			'w': '130',
			'h': '130',
			'top': '15',
			'left': '15'
		},
	};

	// Change Layout
	$('#mapDisplay').css({
		'top': conf.map.top + 'px',	// default 20px
		'left': conf.map.left + 'px',		// default 20px
		'width': conf.map.w + 'px',			// default 130px
		'height': conf.map.h + 'px'			// default 130px
	});
	$('#scoreDisplay').css({
		'bottom': '20px',					// default 20px
		'left': '20px'						// default 170px
	});
    $('#youtuberOf').remove('');
    $('#youtubeFollow').remove();
    $('#followText').remove();
    $('#adCard').remove();
    $('#downloadButtonContainer').remove();
    $('#promoImgHolder').remove();
    $('#linksContainer2').remove();
    $('#twitterFollow').remove();
    $('#mobileDownloadButtonContainer').remove();
    $('#altServer').remove();
    $('#errorNotification').remove();
    $("#mapDisplay").css("background", "url('http://wormax.org/chrome3kafa/moomooio-background.png')");
document.getElementById("allianceButton").style.color = "LightGreen";
document.getElementById("killCounter").style.color = "DarkRed";
document.getElementById("gameName").style.color = "DarkGrey";
document.getElementById("diedText").innerHTML = "You Got Oofed :("
document.getElementById("storeHolder").style = "height: 1500px; width: 450px;";

 })();
(function() {
	var leaderboard2 = document.getElementById("setupCard");
        var myCssText = "display:block;margin-top:10px;";
        splixDIV2.innerHTML = '</br>Right Click -> Apple: Not eat, auto get to hand</br>Right Click -> Cookie: auto eat, not get to hand';

 })();
