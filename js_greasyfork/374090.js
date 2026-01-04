// ==UserScript==
// @name           ♦HuntGold Master♦ [3.0]✔
// @namespace      https://greasyfork.org/users/171308
// @version        [3.0]✔ +6LiNe.imgur.com
// @description    Mode Roleplay,New map intelligente, Clavier Touch Hat Changer, Heal avec A et Click gauche et d'autres... (Mettre clavier en anglais et jouer zqsd)
// @author         ╲⎝⧹ScarL𝖎N𝖊⧸⎠╱#9238
// @match          *.moomoo.io/*
// @match          *://45.77.0.81/*
// @require        http://code.jquery.com/jquery-3.3.1.min.js
// @icon           https://i.imgur.com/jkFMhP3.png
// @downloadURL https://update.greasyfork.org/scripts/374090/%E2%99%A6HuntGold%20Master%E2%99%A6%20%5B30%5D%E2%9C%94.user.js
// @updateURL https://update.greasyfork.org/scripts/374090/%E2%99%A6HuntGold%20Master%E2%99%A6%20%5B30%5D%E2%9C%94.meta.js
// ==/UserScript==

/////////////////////////////////////////////////////////////////////////////////// ♦HuntGold Master♦ ✔ \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// http://keycode.info/
// https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes

// MĚNĚNÍ ČEPICE + KUPOVÁNÍ ║ \ [ < /git > / 226 ] ─ Kupování | Fn [ Toggle Touchpad / 255 ] ─ Nekupování | Shift [ 16 ] ─ Zrychlovací Čepice | B [ 66 ] ─ Bushido Zbroj | Caps Lock [ 20 ] ─ Zimní Čapka | Ctrl [ 17 ] ─ Tanková Výzbroj | F [ 70 ] ─ Samurajská Zbroj | V [ 86 ] ─ Rybí Čepice | Z [ 90 ] ─ Lékařská Výzbroj | Y [ 89 ] ─ Proti Zaměřovací Helma | Escape / 0 [ 27 / 96 ] ─ FΔZΣ | ; [ Grave Accent / Ñ / Æ ] ─ Barbarská Zbroj | Alt [ 18 ] ─ Býčí Helma \\
// CHANGE HAT + BUYING ║ \ [ < /git > / 226 ] ─ Fn | Y [ Toggle Touchpad / 255 ] ─ Not Buying | Shift [ 16 ] ─ Booster Hat | B [ 66 ] ─ Bushido Armor | Caps Lock [ 20 ] ─ Winter Cap | Ctrl [ 17 ] ─ Tank Gear | F [ 70 ] ─ Samurai Armor | V [ 86 ] ─ Flipper Hat | Z [ 90 ] ─ Medic Gear | Y [ 89 ] ─ Emp Helmet | Escape / 0 [ 27 / 96 ] ─ FΔZΣ | ; [ Grave Accent / Ñ / Æ ] ─ Barbarian Armor | Alt [ 18 ] ─ Bull Helmet | 1 [ Numpad 1 / 97 ] ─ Moo Head | 3 [ Numpad 3 / 99 ] ─ Pig Head | 2 [ Numpad 2 / 98 ] ─ Fluff Head | = [ equal sign / 187 ] ─ Pandou Head | P [ 80 ] ─ Bear Head | ´ [ forward slash / ç / 191 ] ─ Monkey Head | O [ 79 ] ─ Polar Head | 4 [ Numpad 4 / 100 ] ─ Fez Hat | 6 [ Numpad 6 / 102 ] ─ Enigma Hat | L [ 76 ] ─ Blitz Hat | ¨ [ back slash / 220 ] ─ Bob XIII Hat | § [ single quote / ø / ä / 222 ] ─ Bummle Hat | 7 [ Numpad 7 / 103 ] ─ Straw Hat | 8 [ Numpad 8 / 104 ] ─ Cowboy Hat | 9 [ Numpad 9 / 105 ] ─ Ranger Hat | 5 [ Numpad 5 / 101 ] ─ Explorer Hat | H [ 72 ] ─ Marksman Cap | . [ perid / 190 ] ─ Bush Gear | - [ dash / 189 ] ─ Halo | M [ 77 ] ─ Soldier Helmet | N [ 78 ] ─ Anti Venom Gear | , [ comma / 188 ] ─ Miners Helmet | J [ 74 ] ─ Musketeer Hat | G [ 71 ] ─ Plague Mask | U [ 85 ] ─ Bull Mask | K [ 75 ] ─ Windmill Hat | T [ 84 ] ─ Spike Gear | I [ 73 ] ─ Scavenger Gear \\

var Zf = [0,0],
    tN = [[12, "Booster Hat"], [16, "Bushido Armor"], [31, "Flipper Hat"], [13, "Medic Gear"], [15, "Winter Cap"], [22, "Emp Helmet"], [26, "Barbarian Armor"], [20, "Samurai Armor"], [40, "Tank Gear"], [7, "Bull Helmet"], [28, "Moo Head"], [29, "Pig Head"], [30, "Fluff Head"], [36, "Pandou Head"], [37, "Bear Head"], [38, "Monkey Head"], [44, "Polar Head"], [35, "Fez Hat"], [42, "Enigma Hat"], [43, "Blitz Hat"], [49, "Bob XIII Hat"], [8, "Bummle Hat"], [2, "Straw Hat"], [5, "Cowboy Hat"], [4, "Ranger Hat"], [18, "Explorer Hat"], [1, "Marksman Cap"], [10, "Bush Gear"], [48, "Halo"], [6, "Soldier Helmet"], [23, "Anti Venom Gear"], [9, "Miners Helmet"], [32, "Musketeer Hat"], [21, "Plague Mask"], [46, "Bull Mask"], [14, "Windmill Hat"], [11, "Spike Gear"], [27, "Scavenger Gear"]];

function Rt(sE){
    if(Zf[0] === 0){
        storeEquip(tN[sE][0]);
        document.title = tN[sE][1];
        Zf[1] = 90;
        revertTitle();
    } else {
        storeBuy(tN[sE][0]);
        Zf[0] = 0;
        Zf[1] = 180;
        document.title = "Už Koupeno┃Málo Zlata";
        revertTitle();
    }
}

document.addEventListener('keydown', function(kfc) {
    if(!$(':focus').length) {
        switch (kfc.keyCode) {
            case 226: Zf[0] = 1; Zf[1] = 300; document.title = "Kupování...."; kfc.preventDefault(); break;                      // Kupování.... / Buying....   = \ [ < /git > / 226 ]
            case 255: if(Zf[0] === 1){Zf[1] = 120; document.title = "Nekupování....";}  Zf[0] = 0; kfc.preventDefault(); break;  // Nekupování.... / Not Buying = Fn [ Toggle Touchpad / 255 ]
            case 27,96: storeEquip(45); kfc.preventDefault(); break;  // FΔZΣ / FΔZΣ                         = Escape / 0 [ 27 / 96 ]
            case 16: Rt(0); kfc.preventDefault(); break;              // Booster Hat / Zrychlovací Čepice    = Shift [ 16 ]
            case 66: Rt(1); kfc.preventDefault(); break;              // Bushido Armor / Bushido Zbroj       = B [ 66 ]
            case 86: Rt(2); kfc.preventDefault(); break;              // Flipper Hat / Rybí Čepice           = V [ 86 ]
            case 90: Rt(3); kfc.preventDefault(); break;              // Medic Gear / Lékařská Výzbroj       = Z [ 90 ]
            case 20: Rt(4); kfc.preventDefault(); break;              // Winter Cap / Zimní Čapka            = Caps Lock [ 20 ]
            case 89: Rt(5); kfc.preventDefault(); break;              // Emp Helmet / Proti Zaměřovací Helma = Y [ 89 ]
            case 192: Rt(6); kfc.preventDefault(); break;             // Barbarian Armor / Barbarská Zbroj   = ; [ Grave Accent / Ñ / Æ ]
            case 70: Rt(7); kfc.preventDefault(); break;              // Samurai Armor / Samurajská Zbroj    = F [ 70 ]
            case 17: Rt(8); kfc.preventDefault(); break;              // Tank Gear / Tanková Výzbroj         = Ctrl [ 17 ]
            case 18: Rt(9); kfc.preventDefault(); break;              // Bull Helmet / Býčí Helma            = Alt [ 18 ]
            case 97: Rt(10); kfc.preventDefault(); break;             // Moo Head                            = 1 [ Numpad 1 / 97 ]
            case 99: Rt(11); kfc.preventDefault(); break;             // Pig Head                            = 3 [ Numpad 3 / 99 ]
            case 98: Rt(12); kfc.preventDefault(); break;             // Fluff Head                          = 2 [ Numpad 2 / 98 ]
            case 187: Rt(13); kfc.preventDefault(); break;            // Pandou Head                         = = [ equal sign / 187 ]
            case 80: Rt(14); kfc.preventDefault(); break;             // Bear Head                           = P [ 80 ]
            case 191: Rt(15); kfc.preventDefault(); break;            // Monkey Head                         = ´ [ forward slash / ç / 191 ]
            case 79: Rt(16); kfc.preventDefault(); break;             // Polar Head                          = O [ 79 ]
            case 100: Rt(17); kfc.preventDefault(); break;            // Fez Hat                             = 4 [ Numpad 4 / 100 ]
            case 102: Rt(18); kfc.preventDefault(); break;            // Enigma Hat                          = 6 [ Numpad 6 / 102 ]
            case 76: Rt(19); kfc.preventDefault(); break;             // Blitz Hat                           = L [ 76 ]
            case 220: Rt(20); kfc.preventDefault(); break;            // Bob XIII Hat                        = ¨ [ back slash / 220 ]
            case 222: Rt(21); kfc.preventDefault(); break;            // Bummle Hat                          = § [ single quote / ø / ä / 222 ]
            case 103: Rt(22); kfc.preventDefault(); break;            // Straw Hat                           = 7 [ Numpad 7 / 103 ]
            case 104: Rt(23); kfc.preventDefault(); break;            // Cowboy Hat                          = 8 [ Numpad 8 / 104 ]
            case 105: Rt(24); kfc.preventDefault(); break;            // Ranger Hat                          = 9 [ Numpad 9 / 105 ]
            case 101: Rt(25); kfc.preventDefault(); break;            // Explorer Hat                        = 5 [ Numpad 5 / 101 ]
            case 72: Rt(26); kfc.preventDefault(); break;             // Marksman Cap                        = H [ 72 ]
            case 190: Rt(27); kfc.preventDefault(); break;            // Bush Gear                           = . [ perid / 190 ]
            case 189: Rt(28); kfc.preventDefault(); break;            // Halo                                = - [ dash / 189 ]
            case 77: Rt(29); kfc.preventDefault(); break;             // Soldier Helmet                      = M [ 77 ]
            case 78: Rt(30); kfc.preventDefault(); break;             // Anti Venom Gear                     = N [ 78 ]
            case 188: Rt(31); kfc.preventDefault(); break;            // Miners Helmet                       = , [ comma / 188 ]
            case 74: Rt(32); kfc.preventDefault(); break;             // Musketeer Hat                       = J [ 74 ]
            case 71: Rt(33); kfc.preventDefault(); break;             // Plague Mask                         = G [ 71 ]
            case 85: Rt(34); kfc.preventDefault(); break;             // Bull Mask                           = U [ 85 ]
            case 75: Rt(35); kfc.preventDefault(); break;             // Windmill Hat                        = K [ 75 ]
            case 84: Rt(36); kfc.preventDefault(); break;             // Spike Gear                          = T [ 84 ]
            case 73: Rt(37); kfc.preventDefault(); break;             // Scavenger Gear                      = I [ 73 ]
          }
	}
});

// MĚNIČ ČEPIC ║ Zvířata Zdarma ─ F5 [ 116 ] | Panda / Medvěd / Opice / Polární Medvěd ─  F9 [ 120 ] | Kráva / Prase / Ovce / Býk ─ F10 [ 121 ] | Zdarma ─ Tab [ 9 ] | Zvířata ─ F6 [ 117 ] | Červená / Modrá ─ F1 [ 112 ] | Všechny Postupně ─ F3 [ 114 ] | ? ─ Windows Menu [ Right ⌘ / 93 ] \\
// CHANGER HATS ║ Animals Free ─ F5 [ 116 ] | Panda / Bear / Monkey / Polar Bear ─ F9 [ 120 ] | Pig / Cow / Sheep / Bull ─ F10 [ 121 ] | Free ─ Tab [ 9 ] | Animals ─ F6 [ 117 ] | Blue / Red ─ F1 [ 122 ] | All Gradually ─ F3 [ 114 ] | ? ─ Windows Menu [ Right ⌘ / 93 ] \\

// Zvířata Zdarma ─ F5 [ 116 ] \\
// Animals Free ─ F5 [ 116 ] \\

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
    var můjVar5;
    var můjVar6;
    var můjVar7;
	var změna = true;
    var ID_FΔZΣ = 45;
    var ID_Moo_Head = 28;
	var ID_Pig_Head = 29;
    var ID_Fluff_Head = 30;
    var ID_Pandou_Head = 36;
    var ID_Bear_Head = 37;
    var ID_Monkey_Head = 38;
    var ID_Polar_Head = 44;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 116) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Moo_Head);
            můjVar = setTimeout(function(){ h1(); }, 270);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            clearTimeout(můjVar5);
            clearTimeout(můjVar6);
            clearTimeout(můjVar7);
            storeEquip(ID_FΔZΣ);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 270);
    }
    function h2() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 270);
    }
    function h3() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 270);
    }
    function h4() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 270);
    }
    function h5() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 270);
    }
    function h6() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 270);
    }
    function h7() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar7);
    můjVar = setTimeout(function(){ h1(); }, 270);
    }
})();

// Panda / Medvěd / Opice / Polární Medvěd ─ F9 [ 120 ] \\
// Panda / Bear / Monkey / Polar Bear ─ F9 [ 120 ] \\

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
	var změna = true;
    var ID_FΔZΣ = 45;
    var ID_Pandou_Head = 36;
    var ID_Bear_Head = 37;
    var ID_Monkey_Head = 38;
    var ID_Polar_Head = 44;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 120) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Pandou_Head);
            můjVar = setTimeout(function(){ h1(); }, 270);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            storeEquip(ID_FΔZΣ);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 270);
    }
    function h2() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 270);
    }
    function h3() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 270);
    }
    function h4() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar4);
    můjVar = setTimeout(function(){ h1(); }, 270);
    }
})();

// Kráva / Prase / Ovce / Býk ─ F10 [ 121 ] \\
// Pig / Cow / Sheep / Bull ─ F10 [ 121 ] \\

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
	var změna = true;
    var ID_FΔZΣ = 45;
    var ID_Moo_Head = 28;
	var ID_Pig_Head = 29;
    var ID_Fluff_Head = 30;
    var ID_Bull_Mask = 46;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 121) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Moo_Head);
            můjVar = setTimeout(function(){ h1(); }, 270);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            storeEquip(ID_FΔZΣ);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 270);
    }
    function h2() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 270);
    }
    function h3() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 270);
    }
    function h4() {
    storeEquip(ID_Bull_Mask);
    clearTimeout(můjVar4);
    můjVar = setTimeout(function(){ h1(); }, 270);
    }
})();

// Zdarma ─ Tab [ 9 ] \\
// Free ─ Tab [ 9 ] \\

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
    var můjVar5;
    var můjVar6;
    var můjVar7;
    var můjVar8;
    var můjVar9;
    var můjVar10;
    var můjVar11;
	var změna = true;
    var ID_FΔZΣ = 45;
    var ID_Moo_Head = 28;
	var ID_Pig_Head = 29;
    var ID_Fluff_Head = 30;
    var ID_Pandou_Head = 36;
    var ID_Bear_Head = 37;
    var ID_Monkey_Head = 38;
    var ID_Polar_Head = 44;
    var ID_Fez_Hat = 35;
    var ID_Enigma_Hat = 42;
    var ID_Blitz_Hat = 43;
    var ID_Bob_XIII_Hat = 49;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 9) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Moo_Head);
            můjVar = setTimeout(function(){ h1(); }, 180);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            clearTimeout(můjVar5);
            clearTimeout(můjVar6);
            clearTimeout(můjVar7);
            clearTimeout(můjVar8);
            clearTimeout(můjVar9);
            clearTimeout(můjVar10);
            clearTimeout(můjVar11);
            storeEquip(ID_FΔZΣ);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 180);
    }
    function h2() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 180);
    }
    function h3() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 180);
    }
    function h4() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 180);
    }
    function h5() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 180);
    }
    function h6() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 180);
    }
    function h7() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar7);
    můjVar8 = setTimeout(function(){ h8(); }, 180);
    }
    function h8() {
    storeEquip(ID_Fez_Hat);
    clearTimeout(můjVar8);
    můjVar9 = setTimeout(function(){ h9(); }, 180);
    }
    function h9() {
    storeEquip(ID_Enigma_Hat);
    clearTimeout(můjVar9);
    můjVar10 = setTimeout(function(){ h10(); }, 180);
    }
    function h10() {
    storeEquip(ID_Blitz_Hat);
    clearTimeout(můjVar10);
    můjVar11 = setTimeout(function(){ h11(); }, 180);
    }
    function h11() {
    storeEquip(ID_Bob_XIII_Hat);
    clearTimeout(můjVar11);
    můjVar = setTimeout(function(){ h1(); }, 180);
    }
})();

// Zvířata ─ F6 [ 117 ] \\
// Animals ─ F6 [ 117 ] \\

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
    var můjVar5;
    var můjVar6;
    var můjVar7;
    var můjVar8;
    var můjVar9;
	var změna = true;
    var ID_FΔZΣ = 45;
    var ID_Moo_Head = 28;
	var ID_Pig_Head = 29;
    var ID_Fluff_Head = 30;
    var ID_Pandou_Head = 36;
    var ID_Bear_Head = 37;
    var ID_Monkey_Head = 38;
    var ID_Polar_Head = 44;
    var ID_Flipper_Hat = 31;
    var ID_Bull_Mask = 46;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 117) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Moo_Head);
            můjVar = setTimeout(function(){ h1(); }, 270);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            clearTimeout(můjVar5);
            clearTimeout(můjVar6);
            clearTimeout(můjVar7);
            clearTimeout(můjVar8);
            clearTimeout(můjVar9);
            storeEquip(ID_FΔZΣ);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 270);
    }
    function h2() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 270);
    }
    function h3() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 270);
    }
    function h4() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 270);
    }
    function h5() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 270);
    }
    function h6() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 270);
    }
    function h7() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar7);
    můjVar8 = setTimeout(function(){ h8(); }, 270);
    }
    function h8() {
    storeEquip(ID_Flipper_Hat);
    clearTimeout(můjVar8);
    můjVar9 = setTimeout(function(){ h9(); }, 270);
    }
    function h9() {
    storeEquip(ID_Bull_Mask);
    clearTimeout(můjVar9);
    můjVar = setTimeout(function(){ h1(); }, 270);
    }
})();

// Červená / Modrá ─ F1 [ 112 ] \\
// Red / Blue ─ F1 [ 112 ] \\

(function() {
    var můjVar;
    var můjVar2;
	var změna = true;
	var ID_Bummle_Hat = 8;
    var ID_FΔZΣ = 45;
	var ID_Winter_Cap = 15;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 112) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_Bummle_Hat);
            můjVar = setTimeout(function(){ h1(); }, 125);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            storeEquip(ID_FΔZΣ);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_Bummle_Hat);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 125);
    }
    function h2() {
    storeEquip(ID_Winter_Cap);
    clearTimeout(můjVar2);
    můjVar = setTimeout(function(){ h1(); }, 125);
    }
})();

// Všechny Postupně ─ F3 [ 114 ] \\
// All Gradually ─ F3 [ 114 ] \\

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
    var můjVar5;
    var můjVar6;
    var můjVar7;
    var můjVar8;
    var můjVar9;
    var můjVar10;
    var můjVar11;
    var můjVar12;
    var můjVar13;
    var můjVar14;
    var můjVar15;
    var můjVar16;
    var můjVar17;
    var můjVar18;
    var můjVar19;
    var můjVar20;
    var můjVar21;
    var můjVar22;
    var můjVar23;
    var můjVar24;
    var můjVar25;
    var můjVar26;
    var můjVar27;
    var můjVar28;
    var můjVar29;
    var můjVar30;
    var můjVar31;
    var můjVar32;
    var můjVar33;
    var můjVar34;
    var můjVar35;
    var můjVar36;
    var můjVar37;
    var můjVar38;
    var můjVar39;
	var změna = true;
    var ID_FΔZΣ = 45;
	var ID_Moo_Head = 28;
	var ID_Pig_Head = 29;
    var ID_Fluff_Head = 30;
    var ID_Pandou_Head = 36;
    var ID_Bear_Head = 37;
    var ID_Monkey_Head = 38;
    var ID_Polar_Head = 44;
	var ID_Fez_Hat = 35;
	var ID_Enigma_Hat = 42;
	var ID_Blitz_Hat = 43;
	var ID_Bob_XIII_Hat = 49;
	var ID_Bummle_Hat = 8;
	var ID_Straw_Hat = 2;
	var ID_Winter_Cap = 15;
	var ID_Cowboy_Hat = 5;
	var ID_Ranger_Hat = 4;
	var ID_Explorer_Hat = 18;
	var ID_Flipper_Hat = 31;
	var ID_Marksman_Cap = 1;
	var ID_Bush_Gear = 10;
    var ID_Halo = 48;
	var ID_Soldier_Helmet = 6;
	var ID_Anti_Venom_Gear = 23;
	var ID_Medic_Gear = 13;
	var ID_Miners_Helmet = 9;
	var ID_Musketeer_Hat = 32;
	var ID_Bull_Helmet = 7;
    var ID_Emp_Helmet = 22;
    var ID_Booster_Hat = 12;
    var ID_Barbarian_Armor = 26;
    var ID_Plague_Mask = 21;
    var ID_Bull_Mask = 46;
    var ID_Windmill_Hat = 14;
    var ID_Spike_Gear = 11;
    var ID_Samurai_Armor = 20;
    var ID_Bushido_Armor = 16;
    var ID_Scavenger_Gear = 27;
    var ID_Tank_Gear = 40;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 114) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_FΔZΣ);
            můjVar = setTimeout(function(){ h1(); }, 75);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            clearTimeout(můjVar5);
            clearTimeout(můjVar6);
            clearTimeout(můjVar7);
            clearTimeout(můjVar8);
            clearTimeout(můjVar9);
            clearTimeout(můjVar10);
            clearTimeout(můjVar11);
            clearTimeout(můjVar12);
            clearTimeout(můjVar13);
            clearTimeout(můjVar14);
            clearTimeout(můjVar15);
            clearTimeout(můjVar16);
            clearTimeout(můjVar17);
            clearTimeout(můjVar18);
            clearTimeout(můjVar19);
            clearTimeout(můjVar20);
            clearTimeout(můjVar21);
            clearTimeout(můjVar22);
            clearTimeout(můjVar23);
            clearTimeout(můjVar24);
            clearTimeout(můjVar25);
            clearTimeout(můjVar26);
            clearTimeout(můjVar27);
            clearTimeout(můjVar28);
            clearTimeout(můjVar29);
            clearTimeout(můjVar30);
            clearTimeout(můjVar31);
            clearTimeout(můjVar32);
            clearTimeout(můjVar33);
            clearTimeout(můjVar34);
            clearTimeout(můjVar35);
            clearTimeout(můjVar36);
            clearTimeout(můjVar37);
            clearTimeout(můjVar38);
            clearTimeout(můjVar39);
            storeEquip(ID_FΔZΣ);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_FΔZΣ);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 75);
    }
    function h2() {
    storeEquip(ID_Moo_Head);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 75);
    }
    function h3() {
    storeEquip(ID_Pig_Head);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 75);
    }
    function h4() {
    storeEquip(ID_Fluff_Head);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 75);
    }
    function h5() {
    storeEquip(ID_Pandou_Head);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 75);
    }
    function h6() {
    storeEquip(ID_Bear_Head);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 75);
    }
    function h7() {
    storeEquip(ID_Monkey_Head);
    clearTimeout(můjVar7);
    můjVar8 = setTimeout(function(){ h8(); }, 75);
    }
    function h8() {
    storeEquip(ID_Polar_Head);
    clearTimeout(můjVar8);
    můjVar9 = setTimeout(function(){ h9(); }, 75);
    }
    function h9() {
    storeEquip(ID_Fez_Hat);
    clearTimeout(můjVar9);
    můjVar10 = setTimeout(function(){ h10(); }, 75);
    }
    function h10() {
    storeEquip(ID_Enigma_Hat);
    clearTimeout(můjVar10);
    můjVar11 = setTimeout(function(){ h11(); }, 75);
    }
    function h11() {
    storeEquip(ID_Blitz_Hat);
    clearTimeout(můjVar11);
    můjVar12 = setTimeout(function(){ h12(); }, 75);
    }
    function h12() {
    storeEquip(ID_Bob_XIII_Hat);
    clearTimeout(můjVar12);
    můjVar13 = setTimeout(function(){ h13(); }, 75);
    }
    function h13() {
    storeEquip(ID_Bummle_Hat);
    clearTimeout(můjVar13);
    můjVar14 = setTimeout(function(){ h14(); }, 75);
    }
    function h14() {
    storeEquip(ID_Straw_Hat);
    clearTimeout(můjVar14);
    můjVar15 = setTimeout(function(){ h15(); }, 75);
    }
    function h15() {
    storeEquip(ID_Winter_Cap);
    clearTimeout(můjVar15);
    můjVar16 = setTimeout(function(){ h16(); }, 75);
    }
    function h16() {
    storeEquip(ID_Cowboy_Hat);
    clearTimeout(můjVar16);
    můjVar17 = setTimeout(function(){ h17(); }, 75);
    }
    function h17() {
    storeEquip(ID_Ranger_Hat);
    clearTimeout(můjVar17);
    můjVar18 = setTimeout(function(){ h18(); }, 75);
    }
    function h18() {
    storeEquip(ID_Explorer_Hat);
    clearTimeout(můjVar18);
    můjVar19 = setTimeout(function(){ h19(); }, 75);
    }
    function h19() {
    storeEquip(ID_Flipper_Hat);
    clearTimeout(můjVar19);
    můjVar20 = setTimeout(function(){ h20(); }, 75);
    }
    function h20() {
    storeEquip(ID_Marksman_Cap);
    clearTimeout(můjVar20);
    můjVar21 = setTimeout(function(){ h21(); }, 75);
    }
    function h21() {
    storeEquip(ID_Bush_Gear);
    clearTimeout(můjVar21);
    můjVar22 = setTimeout(function(){ h22(); }, 75);
    }
    function h22() {
    storeEquip(ID_Halo);
    clearTimeout(můjVar22);
    můjVar23 = setTimeout(function(){ h23(); }, 75);
    }
    function h23() {
    storeEquip(ID_Soldier_Helmet);
    clearTimeout(můjVar23);
    můjVar24 = setTimeout(function(){ h24(); }, 75);
    }
    function h24() {
    storeEquip(ID_Anti_Venom_Gear);
    clearTimeout(můjVar24);
    můjVar25 = setTimeout(function(){ h25(); }, 75);
    }
    function h25() {
    storeEquip(ID_Medic_Gear);
    clearTimeout(můjVar25);
    můjVar26 = setTimeout(function(){ h26(); }, 75);
    }
    function h26() {
    storeEquip(ID_Miners_Helmet);
    clearTimeout(můjVar26);
    můjVar27 = setTimeout(function(){ h27(); }, 75);
    }
    function h27() {
    storeEquip(ID_Musketeer_Hat);
    clearTimeout(můjVar27);
    můjVar28 = setTimeout(function(){ h28(); }, 75);
    }
    function h28() {
    storeEquip(ID_Bull_Helmet);
    clearTimeout(můjVar28);
    můjVar29 = setTimeout(function(){ h29(); }, 75);
    }
    function h29() {
    storeEquip(ID_Emp_Helmet);
    clearTimeout(můjVar29);
    můjVar30 = setTimeout(function(){ h30(); }, 75);
    }
    function h30() {
    storeEquip(ID_Booster_Hat);
    clearTimeout(můjVar30);
    můjVar31 = setTimeout(function(){ h31(); }, 75);
    }
    function h31() {
    storeEquip(ID_Barbarian_Armor);
    clearTimeout(můjVar31);
    můjVar32 = setTimeout(function(){ h32(); }, 75);
    }
    function h32() {
    storeEquip(ID_Plague_Mask);
    clearTimeout(můjVar32);
    můjVar33 = setTimeout(function(){ h33(); }, 75);
    }
    function h33() {
    storeEquip(ID_Bull_Mask);
    clearTimeout(můjVar33);
    můjVar34 = setTimeout(function(){ h34(); }, 75);
    }
    function h34() {
    storeEquip(ID_Windmill_Hat);
    clearTimeout(můjVar34);
    můjVar35 = setTimeout(function(){ h35(); }, 75);
    }
    function h35() {
    storeEquip(ID_Spike_Gear);
    clearTimeout(můjVar35);
    můjVar36 = setTimeout(function(){ h36(); }, 75);
    }
    function h36() {
    storeEquip(ID_Samurai_Armor);
    clearTimeout(můjVar36);
    můjVar37 = setTimeout(function(){ h37(); }, 75);
    }
    function h37() {
    storeEquip(ID_Bushido_Armor);
    clearTimeout(můjVar37);
    můjVar38 = setTimeout(function(){ h38(); }, 75);
    }
    function h38() {
    storeEquip(ID_Scavenger_Gear);
    clearTimeout(můjVar38);
    můjVar39 = setTimeout(function(){ h39(); }, 75);
    }
    function h39() {
    storeEquip(ID_Tank_Gear);
    clearTimeout(můjVar39);
    můjVar = setTimeout(function(){ h1(); }, 75);
    }
})();

// ? ─ Windows Menu [ Right ⌘ / 93 ] \\
// ? ─ Windows Menu [ Right ⌘ / 93 ] \\

(function() {
    var můjVar;
    var můjVar2;
    var můjVar3;
    var můjVar4;
    var můjVar5;
    var můjVar6;
    var můjVar7;
    var můjVar8;
    var můjVar9;
    var můjVar10;
    var můjVar11;
	var změna = true;
    var ID_0_0_0_0_0_0 = 0;
    var ID_17_17_17_17 = 17;
    var ID_24_24_24_24 = 24;
    var ID_33_33_33_33 = 33;
    var ID_34_34_34_34 = 34;
    var ID_39_39_39_39 = 39;
    var ID_41_41_41_41 = 41;
    var ID_45_45_45_45 = 45;
    var ID_47_47_47_47 = 47;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 93) {
			e.preventDefault();
			if (změna) {
            storeEquip(ID_0_0_0_0_0_0);
            můjVar = setTimeout(function(){ h1(); }, 180);
			} else {
            clearTimeout(můjVar);
            clearTimeout(můjVar2);
            clearTimeout(můjVar3);
            clearTimeout(můjVar4);
            clearTimeout(můjVar5);
            clearTimeout(můjVar6);
            clearTimeout(můjVar7);
            clearTimeout(můjVar8);
            clearTimeout(můjVar9);
            storeEquip(ID_0_0_0_0_0_0);
			}
			změna = !změna;
		}
	});

    function h1() {
    storeEquip(ID_0_0_0_0_0_0);
    clearTimeout(můjVar);
    můjVar2 = setTimeout(function(){ h2(); }, 180);
    }
    function h2() {
    storeEquip(ID_17_17_17_17);
    clearTimeout(můjVar2);
    můjVar3 = setTimeout(function(){ h3(); }, 180);
    }
    function h3() {
    storeEquip(ID_24_24_24_24);
    clearTimeout(můjVar3);
    můjVar4 = setTimeout(function(){ h4(); }, 180);
    }
    function h4() {
    storeEquip(ID_33_33_33_33);
    clearTimeout(můjVar4);
    můjVar5 = setTimeout(function(){ h5(); }, 180);
    }
    function h5() {
    storeEquip(ID_34_34_34_34);
    clearTimeout(můjVar5);
    můjVar6 = setTimeout(function(){ h6(); }, 180);
    }
    function h6() {
    storeEquip(ID_39_39_39_39);
    clearTimeout(můjVar6);
    můjVar7 = setTimeout(function(){ h7(); }, 180);
    }
    function h7() {
    storeEquip(ID_41_41_41_41);
    clearTimeout(můjVar7);
    můjVar8 = setTimeout(function(){ h8(); }, 180);
    }
    function h8() {
    storeEquip(ID_45_45_45_45);
    clearTimeout(můjVar8);
    můjVar9 = setTimeout(function(){ h9(); }, 180);
    }
    function h9() {
    storeEquip(ID_47_47_47_47);
    clearTimeout(můjVar9);
    můjVar10 = setTimeout(function(){ h10(); }, 180);
    }
})();

////////////////////////////////////////////////////////////////////////////////////// VYLEPŠENÍ \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////////////////////////////////////////////////////////////// IMPROVEMENTS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

$('#mapDisplay').css({'background': 'url("https://i.imgur.com/Zj0Dtyr.png")'});

(function() { var conf = {'map': {'w': '260','h': '260',},};

$('#mapDisplay').css({'width': conf.map.w + 'px','height': conf.map.h + 'px'});
$('#scoreDisplay').css({'bottom': '290px'});})();

var moomooVer = $('#linksContainer2 .menuLink').html(),
    hideSelectors = ['#mobileDownloadButtonContainer',
                     '#followText',
                     '#smallLinks',
                     '#linksContainer1',
                     '#twitterFollow',
                     '#youtubeFollow',
                     '#cdm-zone-02',
                     '#youtuberOf',
                     '#promoImg',
                     '#downloadButtonContainer',
                     '.menuHeader',
                     '.menuLink',
                     '.menuHeader:nth-child(5)',
                     '.menuHeader:nth-child(6)',
                     '.menuText'
                     ],

    css = '#rightCardHolder {display: block!important}',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

for ( let i = 0; i < hideSelectors.length; i++ ) {
    $(hideSelectors[i]).hide();
}

head.appendChild(style);
$('#linksContainer2').html('<a href="./docs/versions.txt" target="_blank" class="menuLink">' + moomooVer + '</a>');

document.getElementById('promoImgHolder').innerHTML = '</iframe><iframe width="420px" height="236.25px" src="https://www.youtube-nocookie.com/embed/vL7D4eU0lYE" frameborder="0" allowfullscreen></iframe>';
document.getElementById('adCard').innerHTML = '<iframe width="420px" height="236.25px" src="https://www.youtube-nocookie.com/embed/nM-fsCabIPc" frameborder="0" allowfullscreen></iframe>';
// document.getElementById('downloadButtonContainer').innerHTML = '</iframe><iframe width="420px" height="236.25px" src="http://icecast3.play.cz/evropa2-128.mp3"></iframe>';

// document.getElementById("gameUI").style.backgroundImage = "url('')";
// document.getElementById("mainMenu").style.backgroundImage = "url('')";
document.getElementById('enterGame').innerHTML = '♦ Restez en vie! ♦ √';
document.getElementById('loadingText').innerHTML = '♦HuntGold Masters♦ edition by:LiNe🤙';
document.getElementById('nameInput').placeholder = "Rejoignez le clan-> HONORis";
document.getElementById('chatBox').placeholder = "ChatBox RP";
document.getElementById('diedText').innerHTML = '💀Tu as été vaincu!💀..Te vengera-tu?';
document.getElementById('gameName').innerHTML = 'HONORIS:🐺♦HuntGold Masters♦🏆';

$('.menuCard').css({'white-space': 'normal',
                    'text-align': 'center',
                    'background-color': 'rgba(0, 0, 0, 0.74)',
                    '-moz-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    'box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-border-radius': '0px',
                    '-moz-border-radius': '0px',
                    'border-radius': '0px',
                    'margin': '15px',
                    'margin-top': '15px'});

$('#menuContainer').css({'white-space': 'normal'});

$('#nativeResolution').css({'cursor': 'pointer'});

$('#playMusic').css({'cursor': 'pointer'});

$('#guideCard').css({'overflow-y': 'hidden',
                     'margin-top': 'auto',
                     'margin-bottom': '30px'});

$('#serverSelect').css({'margin-bottom': '30.75px'});

$('#skinColorHolder').css({'margin-bottom': '30.75px'});

$('.settingRadio').css({'margin-bottom': '30.75px'});

$('#partyButton').css({'right': '67%',
                       'left': '13%',
                       'text-align': 'center',
                       'bottom': '415px',
                       'font-size': '24px',
                       'top': 'unset'});

$('#joinPartyButton').css({'right': '13%',
                           'left': '67%',
                           'text-align': 'center',
                           'bottom': '415px',
                           'font-size': '24px',
                           'top': 'unset'});

$('#linksContainer2').css({'-webkit-border-radius': '0px 0 0 0',
                           '-moz-border-radius': '0px 0 0 0',
                           'border-radius': '0px 0 0 0',
                           'right': '44%',
                           'left': '44%',
                           'background-color': 'rgba(0, 0, 0, 0.74)',
                           'text-align': 'center',
                           'bottom': '12px'});

$('#gameName').css({'color': '#FF0000',
                    'text-shadow': '0 1px 0 rgba(255, 255, 255, 0), 0 2px 0 rgba(255, 255, 255, 0), 0 3px 0 rgba(255, 255, 255, 0), 0 4px 0 rgba(255, 255, 255, 0), 0 5px 0 rgba(255, 255, 255, 0), 0 6px 0 rgba(255, 255, 255, 0), 0 7px 0 rgba(255, 255, 255, 0), 0 8px 0 rgba(255, 255, 255, 0), 0 9px 0 rgba(255, 255, 255, 0)',
                    'text-align': 'center',
                    'font-size': '156px',
                    'margin-bottom': '-30px'});

$('#loadingText').css({'color': '#808080',
                       'background-color': 'rgba(0, 0, 0, 0.74)',
                       'padding': '8px',
                       'right': '150%',
                       'left': '150%',
                       'margin-top': '40px'});

$('.ytLink').css({'color': '#144db4',
                  'padding': '8px',
                  'background-color': 'rgba(0, 0, 0, 0.74)'});

$('.menuLink').css({'color': '#144db4'});

$('#nameInput').css({'border-radius': '0px',
                     '-moz-border-radius': '0px',
                     '-webkit-border-radius': '0px',
                     'border': 'hidden'});

$('#serverSelect').css({'cursor': 'pointer',
                        'color': '#FF0000',
                        'background-color': '#808080',
                        'border': 'hidden',
                        'font-size': '20px'});

$('.menuButton').css({'border-radius': '0px',
                      '-moz-border-radius': '0px',
                      '-webkit-border-radius': '0px'});

$('#promoImgHolder').css({'position': 'absolute',
                          'bottom': '-7%',
                          'left': '20px',
                          'width': '420px',
                          'height': '236.25px',
                          'padding-bottom': '18px',
                          'margin-top': '0px'});

$('#adCard').css({'position': 'absolute',
                  'bottom': '-7%',
                  'right': '20px',
                  'width': '420px',
                  'height': '236.25px',
                  'padding-bottom': '18px'});

     $('#mapDisplay').css({
		'background': 'url("https://i.imgur.com/OIPn5cG.png")'
	});

$('.menuHeader').css({'color': 'rgba(255, 255, 255, 1)'});

$('#killCounter').css({'color': '#ededed'});

$('#diedText').css({'background-color': 'rgba(0, 0, 0, 0.74)'});

$('#gameCanvas').css({'background-color': '#f4f4f4'});

$('#allianceButton').css({'color': 'rgba(0, 0, 0, 1)'});

$('#storeButton').css({'color': 'rgba(0, 0, 0, 1)'});

$('#chatButton').css({'color': 'rgba(0, 0, 0, 1)'});

$('.gameButton').css({'-webkit-border-radius': '0px 0 0 0',
                      '-moz-border-radius': '0px 0 0 0',
                      'border-radius': '0px 0 0 0',
                      'background-color': 'rgba(0, 0, 0, 0.4)'});

$('.uiElement, .resourceDisplay').css({'-webkit-border-radius': '0px',
                                       '-moz-border-radius': '0px',
                                       'border-radius': '0px',
                                       'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#chatBox').css({'-webkit-border-radius': '0px',
                   '-moz-border-radius': '0px',
                   'border-radius': '0px',
                   'background-color': 'rgba(0, 0, 0, 0.4)',
                   'text-align': 'center'});

$('#foodDisplay').css({'color': '#ae4d54'});

$('#woodDisplay').css({'color': '#758f58'});

$('#stoneDisplay').css({'color': '#818198'});

$('#scoreDisplay').css({'color': '#c2b17a'});

$('#leaderboard').css({'-webkit-border-radius': '0px',
                       '-moz-border-radius': '0px',
                       'border-radius': '0px',
                       'background-color': 'rgba(0, 0, 0, 0.4)',
                       'text-align': 'center'});

$('#ageText').css({'color': '#000'});

$('#ageBar').css({'-webkit-border-radius': '0px',
                  '-moz-border-radius': '0px',
                  'border-radius': '0px',
                  'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#ageBarBody').css({'-webkit-border-radius': '0px',
                      '-moz-border-radius': '0px',
                      'border-radius': '0px',
                      'background-color': '#FF0000'});

$('.storeTab').css({'-webkit-border-radius': '0px',
                    '-moz-border-radius': '0px',
                    'border-radius': '0px',
                    'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#storeHolder').css({'-webkit-border-radius': '0px',
                       '-moz-border-radius': '0px',
                       'border-radius': '0px',
                       'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#allianceHolder').css({'-webkit-border-radius': '0px',
                          '-moz-border-radius': '0px',
                          'border-radius': '0px',
                          'background-color': 'rgba(0, 0, 0, 0.4)'});

$('.actionBarItem').css({'-webkit-border-radius': '0px',
                         'border-radius': '0px',
                         'background-color': 'rgba(0, 0, 0, 0.4)'});

$('#itemInfoHolder').css({'text-align': 'center',
                          'top': '125px',
                          'left': '350px',
                          'right': '350px',
                          'max-width': '666px'});

// document.addEventListener("keydown", function(a) {if (a.keyCode == 8,9,13,16,17,18,19,20,27,33,34,35,36,37,38,39,40,45,46,48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,96,97,98,100,101,102,103,104,105,106,107,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,144,145,186,187,188,189,190,191,192,219,220,221,222) {document.getElementById("nameInput").value="FERANYZERIR BOT";}}, false);

var myElement = document.querySelector('#nameInput');
myElement.style.backgroundColor = "#808080";
myElement.style.color = "#FF0000";

var myElement = document.querySelector('#enterGame');
myElement.style.backgroundColor = "#FF0000";
myElement.style.color = "#808080";

$('#leaderboard').append('Pillez-les tous!');

addEventListener("click", function() { var Rf = document.documentElement, SfR = Rf.requestFullScreen || Rf.webkitRequestFullScreen || Rf.mozRequestFullScreen; SfR.call(Rf);});