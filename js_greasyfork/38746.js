// ==UserScript==
// @name         [Mountyhall] Assistant Mélange Magique
// @namespace    Mountyhall
// @description  Assistant Mélange Magique & Affichage % de stabilisation des compos
// @author       Dabihul
// @version      2.3.3.0
// @include      */mountyhall/MH_Taniere/TanierePJ_o_Stock*
// @include      */mountyhall/MH_Comptoirs/Comptoir_o_Stock*
// @include      */mountyhall/MH_Follower/FO_Equipement*
// @include      */mountyhall/MH_Play/Play_e_follo*
// @include      */mountyhall/MH_Lieux/Lieu_TaniereAchat*
// @include      */mountyhall/View/TaniereDescription*
// @include      */mountyhall/MH_Play/Play_equipement*
// @include      */mountyhall/MH_Play/Actions/Play_a_ActionYY*
// @include      */mountyhall/MH_Play/Actions/Competences/Play_a_CompetenceYY*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38746/%5BMountyhall%5D%20Assistant%20M%C3%A9lange%20Magique.user.js
// @updateURL https://update.greasyfork.org/scripts/38746/%5BMountyhall%5D%20Assistant%20M%C3%A9lange%20Magique.meta.js
// ==/UserScript==


//---------------------- À l'intention des programmeurs ----------------------//
//
// À propos des types de variables :
// Lors d'une conversion en JSON, suivant le navigateur, les types string/number
// peuvent être permutés (y compris pour les keys). À manier avec précaution.
//
// Stockage des données de composants :
// localStorage["mmassistant.compos.numTroll"] (object) {
//   numCompo (string): {
//     mob    : libellé nom du monstre (string),
//     niveau : niveau du monstre (string),
//     qualite: libellé qualité (string),
//     bonus  : bonus total (number)
//   }
// }
//
// Stockage des données de potions :
// localStorage["mmassistant.popos.numTroll"] (object) {
//   numPopo (string): {
//     nom    : libellé nom de la potion (string),
//     effet  : libellé effet de la potion (string),
//    [niveau : "niveau" de la potion - cf. initMatos (string),]
//    [melange: 1 (number) - si la potion est un mélange,]
//    [GPT    : 1 (number) - si la potion est du type GPTJC,]
//    [zone   : 1 (number) - si la potion est de zone,]
//     risque : risque lié aux effets de la potion (number, flottant)
//   }
// }
//
//---------------------------- Variables Globales ----------------------------//

var
	// Options du Script:
	compos_par_bonus = true,
	popos_par_nom = true,
	refaire_mise_en_page = true,
	lancer_de_potions = true,
	utiliser_popo = true,

	// Activer les logs de débugage:
	MODE_DEBUG = false,

	// Défini dans le main avec getNumTroll():
	numTroll,

	// Globales dans tous les cas (mémoires ou extraites):
	objCompos = {},
	objPopos = {};

if(MODE_DEBUG) {
	var URL = window.location.pathname;
	window.console.debug("[mmassistant] script ON! sur : "+URL);
}

//----------------------------- Bases de données -----------------------------//

var NiveauDuMonstre = {
	"Abishaii Bleu": 19,
	"Abishaii Noir": 10,
	"Abishaii Rouge": 23,
	"Abishaii Vert": 15,
	"Ame-en-peine": 8,
	"Amibe Geante": 9,
	"Anaconda des Catacombes": 8,
	"Ankheg": 10,
	"Anoploure Purpurin": 36,
	"Aragnarok du Chaos": 16,
	"Araignee Geante": 2,
	"Ashashin": 35,
	"Balrog": 50,
	"Banshee": 16,
	"Barghest": 36,
	"Basilisk": 11,
	"Behemoth": 34,
	"Behir": 14,
	"Beholder": 50,
	"Boggart": 3,
	"Bondin": 9,
	"Bouj'Dla": 19,
	"Bouj'Dla Placide": 37,
	"Bulette": 19,
	"Caillouteux": 1,
	"Capitan": 35,
	"Carnosaure": 25,
	"Champi-Glouton": 3,
	"Chauve-Souris Geante": 4,
	"Cheval a Dents de Sabre": 23,
	"Chevalier du Chaos": 22,
	"Chimere": 13,
	"Chonchon": 24,
	"Coccicruelle": 22,
	"Cockatrice": 5,
	"Crasc": 10,
	"Crasc Maexus": 25,
	"Crasc Medius": 17,
	"Crasc Parasitus": 14,
	"Croquemitaine": 6,
	"Cube Gelatineux": 32,
	"Daemonite": 27,
	"Diablotin": 5,
	"Dindon du Chaos": 1,
	"Djinn": 29,
	"Ectoplasme": 18,
	"Effrit": 27,
	"Elementaire d'Air": 23,
	"Elementaire d'Eau": 17,
	"Elementaire de Feu": 21,
	"Elementaire de Terre": 21,
	"Elementaire du Chaos": 26,
	"Erinyes": 7,
	"Esprit-Follet": 16,
	"Essaim Craterien": 30,
	"Essaim Sanguinaire": 25,
	"Ettin": 8,
	"Familier": 1,
	"Fantome": 24,
	"Feu Follet": 20,
	"Flagelleur Mental": 33,
	"Foudroyeur": 38,
	"Fumeux": 22,
	"Fungus Geant": 9,
	"Fungus Violet": 4,
	"Furgolin": 10,
	"Gargouille": 3,
	"Geant de Pierre": 13,
	"Geant des Gouffres": 22,
	"Geck'oo Majestueux": 40,
	"Geck'oo": 15,
	"Glouton": 20,
	"Gnoll": 5,
	"Gnu Domestique": 1,
	"Gnu Sauvage": 1,
	"Goblin": 4,
	"Goblours": 4,
	"Golem d'Argile": 15,
	"Golem de cuir": 1,
	"Golem de Chair": 8,
	"Golem de Fer": 31,
	"Golem de metal": 1,
	"Golem de mithril": 1,
	"Golem de papier": 1,
	"Golem de Pierre": 23,
	"Gorgone": 11,
	"Goule": 4,
	"Gowap Apprivoise": 1,
	"Gowap Sauvage": 1,
	"Gremlins": 3,
	"Gritche": 39,
	"Grouilleux": 4,
	"Grylle": 31,
	"Harpie": 4,
	"Hellrot": 18,
	"Homme-Lezard": 4,
	"Hurleur": 8,
	"Hydre": 50,
	"Incube": 13,
	"Kobold": 2,
	"Labeilleux": 26,
	"Lezard Geant": 5,
	"Liche": 50,
	"Limace Geante": 10,
	"Loup-Garou": 8,
	"Lutin": 4,
	"Mante Fulcreuse": 30,
	"Manticore": 9,
	"Marilith": 33,
	"Meduse": 6,
	"Megacephale": 38,
	"Mille-Pattes Geant": 14,
	"Mimique": 6,
	"Minotaure": 7,
	"Mohrg": 35,
	"Molosse Satanique": 8,
	"Momie": 4,
	"Monstre Rouilleur": 3,
	"Mouch'oo Domestique": 14,
	"Mouch'oo Majestueux Sauvage": 33,
	"Mouch'oo Sauvage": 14,
	"Naga": 10,
	// "Na-Haniym-Heee":0,
	"Necrochore": 37,
	"Necromant": 39,
	"Necrophage": 8,
	"Nuage d'Insectes": 7,
	"Nuee de Vermine": 13,
	"Ogre": 7,
	"Ombre de Roches": 13,
	"Ombre": 2,
	"Orque": 3,
	"Ours-Garou": 18,
	"Palefroi Infernal": 29,
	"Phoenix": 32,
	// "Pititabeille":0,
	"Plante Carnivore": 4,
	"Pseudo-Dragon": 5,
	"Rat Geant": 2,
	"Rat-Garou": 3,
	"Rocketeux": 5,
	"Sagouin": 3,
	"Scarabee Geant": 4,
	"Scorpion Geant": 10,
	"Shai": 28,
	"Sirene": 8,
	"Slaad": 5,
	"Sorciere": 17,
	"Spectre": 14,
	"Sphinx": 30,
	"Squelette": 1,
	"Strige": 2,
	"Succube": 13,
	"Tertre Errant": 20,
	"Thri-kreen": 10,
	"Tigre-Garou": 12,
	"Titan": 26,
	"Trancheur": 35,
	"Tubercule Tueur": 14,
	"Tutoki": 4,
	"Vampire": 29,
	"Ver Carnivore Geant": 12,
	"Ver Carnivore": 11,
	"Veskan Du Chaos": 14,
	"Vouivre": 33,
	"Worg": 5,
	"Xorn": 14,
	"Yeti": 8,
	"Yuan-ti": 15,
	"Zombie": 2
};

var Qualites = {
	"Très Bonne": {
		bonus: 20,
		abbr: "TB"
	},
	"Bonne": {
		bonus: 16,
		abbr: "B"
	},
	"Moyenne": {
		bonus: 12,
		abbr: "Moy."
	},
	"Mauvaise": {
		bonus: 8,
		abbr: "Mauv."
	},
	"Très Mauvaise": {
		bonus: 4,
		abbr: "TM"
	},
	regex: "Très Bonne|Bonne|Moyenne|Très Mauvaise|Mauvaise"
};

var PotionsDeBase = {
	"Dover Powa" : {
		duree    : 2,
		magieMax : 100
	},
	"Elixir de Bonne Bouffe" : {
		duree  : 5,
		nivMax : 7
	},
	"Elixir de Corruption" : {
		duree  : 5,
		nivMax : 7
	},
	"Elixir de Fertilite" : {
		duree  : 5,
		nivMax : 7
	},
	"Elixir de Feu" : {
		duree  : 5,
		nivMax : 7
	},
	"Elixir de Longue-Vue" : {
		duree   : 3,
		niveaux : {
			1: 1,
			2: 1,
			3: 1,
			5: 1,
			8: 1
		}
	},
	"Essence de KouleMann" : {
		duree  : 4,
		nivMax : 5
	},
	"Extrait de DjhinTonik" : {
		duree  : 4,
		nivMax : 5
	},
	"Extrait du Glacier" : {
		duree  : 5,
		nivMax : 7
	},
	"Grippe en Conserve" : {
		duree  : 3,
		nivMax : 5
	},
	"Jus de Cervelle" : {
		duree  : 0,
		nivMax : 30
	},
	"Jus de Chronometre" : {
		duree  : 3,
		nivMax : 150
	},
	"Metomol" : {
		duree  : 2,
		nivMax : 10
	},
	"Pneumonie en Conserve" : {
		duree  : 3,
		nivMax : 5
	},
	"Potion de Guerison" : {
		duree  : 0,
		nivMax : 10
	},
	"Potion de Painture" : {
		duree  : 0,
		nivMax : 5
	},
	"PufPuff" : {
		duree  : 3
	},
	"Rhume en Conserve" : {
		duree  : 3,
		nivMax : 5
	},
	"Sang de Toh Reroh" : {
		duree  : 4,
		nivMax : 5
	},
	"Sinne Khole" : {
		duree    : 2,
		magieMax : 100
	},
	"Toxine Violente" : {
		duree  : 0,
		nivMax : 10
	},
	"Voi'Pu'Rin" : {
		duree  : 2,
		nivMax : 50
	},
	"Zet Crakdedand" : {
		duree  : 3,
		nivMax : 5
	}
};

//---------------------- Icone Mélange Magique (base64) ----------------------//

var iconeBase64 = "data:image/png;base64," +
	"iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAKT2lDQ1BQaG90b3Nob3AgSU" +
	"NDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkV" +
	"UcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzw" +
	"fACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNML" +
	"CADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAF" +
	"AtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJ" +
	"V2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uS" +
	"Q5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7O" +
	"No62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQL" +
	"UAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFH" +
	"BPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v" +
	"9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//Ueg" +
	"JQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCm" +
	"SAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHa" +
	"iAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygv" +
	"yGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgY" +
	"BzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE" +
	"7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMy" +
	"J7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnW" +
	"JAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJ" +
	"S6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK" +
	"+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+p" +
	"XlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvM" +
	"YgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0" +
	"TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0" +
	"onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9" +
	"L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjU" +
	"YPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb" +
	"15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rnt" +
	"Znw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7Ry" +
	"FDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lp" +
	"sbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+V" +
	"MGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8" +
	"Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4Kt" +
	"guXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3E" +
	"Nz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/8" +
	"7fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHc" +
	"JnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9" +
	"MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsm" +
	"dlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUF" +
	"K4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1Yf" +
	"qGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N" +
	"2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7h" +
	"t7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw62" +
	"17nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x" +
	"92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4yd" +
	"lZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdO" +
	"o8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+" +
	"cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY" +
	"+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl" +
	"/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5" +
	"jz/GMzLdsAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElN" +
	"RQfiAxkSIyf56Mf4AAACqUlEQVRYw82YT2sTQRjGn87srWAktFRi1YMgpDQEcvDoIRCwKI" +
	"J4VPADePNbiOeAR8Wb4EVyEBeCInioEFzSphrJwRBWQ0qaLeSgdjYewmwnk92Z2T9CB5bd" +
	"nZnd95nf++zMJMAZKStZvIQQMtP18X1fGcvKakTfn90Pri/dqOJd/WVwf6f+Xvu89b9JyH" +
	"2jyFhZBGOM4e+35wt1xdLFhXYAoJSmI6LDPhhNsaF43nY81Mq5ZKmJg/3KhXMAgB+/jgEA" +
	"B+4JcP1u0F4r50ApVRrW0iEHYIy93uijWimg2XKD9mqloBUBAEQ32sFoqmy3HS+4fnT7Mm" +
	"rlHKqVwgKN1PMIIWTGGIPteCgWrFPsQuHYORkunvfjQnRUiG4S4k6vN/o4cE/QbLnBwQNw" +
	"EZye2M+0GH01tXIOxYKFzfVVAAgCiKN92xqj2XKXPGI7Hm5W8lqPGKVG9kwYdsbYQlucLy" +
	"bWzDoYTbG5vhpgl43I08K9xFNkOx4YY6CUzlJ7xHY81Bt92I63hF02Kk9f5qsvT48KO5/I" +
	"uAjRtKYpskxFaLBD9lLYfKNKEYmDLyl2WUzY8kFMaUSJEKmkEUPSiEgqxsgjcUWEiXE/vp" +
	"lvGY6OQvt+HWDJL5ltFWUxXx5vRfYr5TeAWw+iPZKUhjJgSGmPh2afb3fSBgAMcX6pzZtM" +
	"AADHv8Oxv96FQCWFRwDgxZ8PuLp1DcBPAECv0w3axnuHyhfmt9dwDzsBkbDRK6d4npaH+0" +
	"+Wgs9FnQYSz3IRhZqKUM4jYnCZSH57TUtG5ZGw+kghKiJcjK60x8MgqHg2NmtmRJ7OTV/i" +
	"98JZXgAzJyLWU0ojD3nhI1FmG+8dotfp4vOrT+h1ugv1shjxLJLyfX8l6lDuR8K2hkmKyd" +
	"ZQuzGK8wsv6V8QZ7r8AzgV4fJtzqZQAAAAAElFTkSuQmCC";

//-------------------------- Utilitaires génériques --------------------------//

// Gestion des objets pour Storage
// https://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage#answer-3146971
Storage.prototype.setObject = function(key, value) {
	this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
	var value = this.getItem(key);
	return value && JSON.parse(value);
};

Storage.prototype.removeObject = function(key) {
	this.removeItem(key);
};

function epure(texte) {
	return texte.
		replace(/[àâä]/g,"a").replace(/Â/g,"A").
		replace(/[ç]/g,"c").
		replace(/[éêèë]/g,"e").
		replace(/[ïî]/g,"i").
		replace(/[ôöõ]/g,"o").
		replace(/[ùûü]/g,"u");
}

function getNumTroll() {
// Récupère le num de trõll dans la frame Menu
// Menu = top.frames["Sommaire"].document
// onclick du nom du trõll: "EnterPJView(numTroll,750,550)"
	var liens, str;
	try {
		liens = top.frames["Sommaire"].document.getElementsByTagName("a");
		if(liens.length>0 && liens[0].onclick!==void(0)) {
			str = liens[0].onclick.toString();
			numTroll = parseInt(/\d+/.exec(str)[0]);
			if (MODE_DEBUG) {
				window.console.debug("[mmassistant] numTroll = "+numTroll);
			}
		}
	} catch(e) {
		window.console.warn(
			"[mmassistant] Aucun numéro de troll trouvé : choix par défaut"
		);
		numTroll = window.localStorage.getItem("mmassistant.lastNumTroll") || "defaut";
	}
	window.localStorage.setItem("mmassistant.lastNumTroll", numTroll);
}

//------------------------------ Gestion du DOM ------------------------------//

function appendText(paren, text, bold) {
	if(bold) {
		var b = document.createElement("span");
		b.style.fontWeight = "bold";
		b.appendChild(document.createTextNode(text));
		paren.appendChild(b);
	} else {
		paren.appendChild(document.createTextNode(text));
	}
}

function ajouteBouton(node, value) {
	var input = document.createElement("input");
	input.type = "button";
	input.className = "mh_form_submit";
	if(value) {
		input.value = value;
	}
	node.appendChild(input);
	return input;
}

function ajouteCheckboxMelange(row, num, typeItem) {
	var cell = row.insertCell(0),
		input = document.createElement("input");
	cell.style = "width:12px;display:none;";
	input.type = "checkbox";
	input.className = "mmassistant_"+typeItem;
	input.num = num;
	input.typeItem = typeItem;
	input.onchange = refreshMelangeur;
	cell.appendChild(input);
	return input;
}

function creeIconeMelange() {
// Prépare l'icône à afficher pour les infos MM
	var img = new Image();
	img.src = iconeBase64;
	img.alt = "Mélange_Magique";
	img.style.height = "20px";
	img.style.verticalAlign = "middle";
	return img;
}

function ajouteInfosDuCompo(node, compo) {
// Ajoute un span img + % avec titre d'infos de compo à la fin de node
	var
		span = document.createElement("span"),
		str;
	appendText(node," ");
	span.className = "mmassistant_infos";
	span.appendChild(creeIconeMelange());
	appendText(span," [-"+compo.bonus+" %]");
	switch(compo.mob[0]) {
		case "A":
		case "E":
		case "I":
		case "O":
		case "U":
			str = "Compo d'";
			break;
		default:
			str = "Compo de ";
	}
	span.title =
		str+compo.mob+" : -"+compo.niveau+
		"\nQualité "+compo.qualite+" : -"+Qualites[compo.qualite].bonus;
	node.appendChild(span);
}

function ajouteInfosDeLaPopo(node, popo) {
// Ajoute une img avec titre d'infos de popo à la fin de node
	var
		img = creeIconeMelange(),
		titre = "Caracs: +"+popo.risque;
	if(popo.melange) {
		titre += "\nMélangée: +15";
	}
	if(popo.zone) {
		titre += "\nDe Zone: +40";
	}
	if(popo.duree!==void(0)) {
		if(popo.GPT) {
			titre += "\nFamille GPTJC: +40";
		}
		titre += "\nDurée: +"+popo.duree;
	} else {
		titre += "\nFamille GPTJC? +40";
		titre += "\nDurée? +1-5";
	}
	img.title = titre;
	appendText(node," ");
	node.appendChild(img);
}

//------------------- Calculateur de risque (standardisé) --------------------//

function risqueExplo(popo1, popo2, compo) {
// Calcul les risques min & max d'explosion et génère le texte explicatif
// pour un Mélange à partir des 2 ou 3 ingrédients fournis.
	// Risque de base
	var
		risque = 33,
		details = "Risque de base: +33",
		risqueMax, popoInconnue, dureeMin, texte;

	// Malus de caracs
	risque += popo1.risque;
	details += "\nEffet popo 1: +"+popo1.risque+" ("+risque+")";
	risque += popo2.risque;
	details += "\nEffet popo 2: +"+popo2.risque+" ("+risque+")";
	risque = Math.round(risque);

	// Malus de popo mélangée, Bonus popos de base identiques & Mini-mélange
	if(popo1.melange || popo2.melange) {
		risque += 15;
		details += "\nMalus mélange: +15 ("+risque+")";
	} else if(
		popo1.nom in PotionsDeBase &&
		popo2.nom in PotionsDeBase &&
		(
			popo1.nom==popo2.nom ||
			(
				// Famille 'en Conserve': considrérées comme identiques
				/Conserve/.test(popo1.nom) && /Conserve/.test(popo2.nom)
			)
		)
	) {
		risque -= 15;
		details += "\nBonus popo id.: -15 ("+risque+")";
		if(
			(
				// Cas standard (parseInt pour les Corruptions)
				PotionsDeBase[popo1.nom].nivMax &&
				parseInt(popo1.niveau)+parseInt(popo2.niveau) <=
					PotionsDeBase[popo1.nom].nivMax
			) || (
				// Elixir de Longue-Vue
				PotionsDeBase[popo1.nom].niveaux &&
				Number(popo1.niveau)+Number(popo2.niveau) in
					PotionsDeBase[popo1.nom].niveaux
			) || (
				// Dover / Sinne
				PotionsDeBase[popo1.nom].magieMax &&
				Number(popo1.MM)+Number(popo2.MM) <=
					PotionsDeBase[popo1.nom].magieMax &&
				Number(popo1.RM)+Number(popo2.RM) <=
					PotionsDeBase[popo1.nom].magieMax
			)
			// PufPuff sans spec limite: exclue de mini-mélange
		) {
				risque -= 20;
				details += "\nBonus popo ex.: -20 ("+risque+")";
		}
	}

	// Malus de Zone
	if(popo1.zone || popo2.zone) {
		risque += 40;
		details += "\nMalus zone: +40 ("+risque+")";
	}

	// Malus mélange hétérogène GPTJC (Guérison/Painture/Toxine/Jus de Cervelle)
	popoInconnue = popo1.duree==void(0) || popo2.duree==void(0);
	risqueMax = risque+5;
	if((popo1.GPT?1:0)^(popo2.GPT?1:0)) { // ^ = XOR binaire
		risque += 40;
		risqueMax += 40;
		details += "\nMalus hétérogène GPTJC: +40 ("+risque+")";
	} else if(popoInconnue) {
		// En cas de popo inconnue, on envisage le pire
		risqueMax += 40;
		details += "\nMalus hétérogène GPTJC: +40 ??";
	}

	// Malus durée
	dureeMin = popo1.duree ? popo1.duree : 0;
	dureeMin = popo2.duree ? Math.max(dureeMin, popo2.duree) : dureeMin;
	risque += dureeMin;
	if(!popoInconnue) {
		risqueMax = risque;
	}
	if(!popoInconnue || dureeMin==5) {
		details += "\nMalus de durée: +"+dureeMin+" ("+risque+")";
	} else {
		details += "\nMalus de durée: de +"+dureeMin+" à +5";
	}

	// Bonus de compo
	if(compo) {
		risque -= compo.bonus;
		risqueMax -= compo.bonus;
		details += "\nBonus compo: -"+compo.bonus+" ("+risque+")";
	}

	// Affichage
	if(risqueMax<16) {
		texte = "15 %";
	} else if(risque==risqueMax) {
		texte = risque+" %";
	} else {
		texte = "de "+Math.max(risque, 15)+" à "+risqueMax+" %";
	}

	return {
		texte: texte,
		details: details
	}
}

//-------------------- Traitement de la page d'équipement --------------------//

function initMatos() {
	var
		// Si pas de compos / popos, on mime une HTMLCollection vide
		tablePopos = tableCompos = {rows:[]},
		titrePopos, div;
	try {
		// Recherche d'éventuels compos
		div = document.getElementById("mh_objet_hidden_"+numTroll+"_Composant");
		if(div) {
			tableCompos = div.getElementsByTagName("table")[0];
		} else {
			window.console.warn("[mmassistant] Aucun composant trouvé");
		}

		// Recherche d'éventuelles popos
		div = document.getElementById("mh_objet_hidden_"+numTroll+"_Potion");
		if(div) {
			tablePopos = div.getElementsByTagName("table")[0];

			// Récupération de la ligne de titre des popos
			// titrePopos.cells:
			// 0: [+] / [-]
			// 1: "Potion"
			// 2: nb popos
			// 3: poids total
			titrePopos = document.evaluate(
				"(./preceding-sibling::table)[last()]//tr[1]",
				div, null, 9, null
			).singleNodeValue;
		} else {
			window.console.warn("[mmassistant] Aucune potion trouvée");
		}
	} catch(e) {
		window.console.error(
			"[mmassistant] Erreur durant l'analyse de l'équipement", e
		);
		return;
	}
	if(MODE_DEBUG) {
		window.console.debug("[mmassistant] Lancement initMatos");
	}
	var
		row, insertNode, mob, niveau, qualite,
		nom, num, effetTotal, effets, effet, racine,
		risque, magie, nb, carac;

	// Récupération & Stockage des données des Composants
	// tableCompos.row.cells:
	// 0: menu contextuel
	// 1: numéro
	// 2: nom | emplacement | qualité
	// 3: effet (aucun)
	// 4: usure
	// 5: poids
	// 6: ceinture
	for(row of tableCompos.rows) {
		insertNode = row.cells[2];
		mob = insertNode.textContent;
		mob = mob.slice(mob.indexOf("d'un")+5)
			.split("de Qualit")[0]
			.trim();
		niveau = NiveauDuMonstre[epure(mob)];
		qualite = insertNode.textContent.match(Qualites.regex);
		num = String(row.cells[1].textContent.match(/\d+/));
		if(niveau && qualite) {
			objCompos[num] = {
				mob: mob,
				niveau: niveau,
				qualite: qualite,
				bonus: niveau+Qualites[qualite].bonus
			}
			ajouteInfosDuCompo(insertNode, objCompos[num]);
		}

		// Ajout de la checkbox de mélange
		ajouteCheckboxMelange(row, num, "compo");
	}
	if(MODE_DEBUG) {
		window.console.debug(objCompos);
	}
	window.localStorage.setObject("mmassistant.compos."+numTroll, objCompos);

	// Récupération & Stockage des données des Potions
	// tablePopos.rows.cells [ intialement ] :
	// 0: menu contextuel
	// 1: numéro
	// 2: nom
	// 3: effets
	// 4: usure
	// 5: poids
	// 6: ceinture
	// [ +1 après insertion de la checkbox de mélange ]
	for(row of tablePopos.rows) {
		nom = epure(row.cells[2].textContent.trim());
		num = String(row.cells[1].textContent.match(/\d+/));

		// Ajout de la checkbox de mélange
		ajouteCheckboxMelange(row, num, "popo");

		// Si popo non identifiée, pas de traitement
		if(nom=="Potion") { continue; }

		// Sinon début du stockage
		effetTotal = row.cells[4].textContent.trim();
		effets = effetTotal.split(" | ");
		objPopos[num] = {
			nom: nom,
			effet: effetTotal
		};

		// Malus Mélange (& extraction racine)
		if(nom.indexOf(" Melangees")!=-1) {
		// Si popo issue d'un mélange de 2 popos de base de même famille,
		// on récupère ladite famille pour computer durée+type (GPTJC/autre)
		// Si mélange niv sup, on récupère "Potions", sans effet.
			racine = nom.slice(0, nom.indexOf(" Melangees"));
			objPopos[num].melange = 1;
		} else if(nom.indexOf(" (Niv")!=-1) {
		// Ajustement pour les anciennes popos de painture
			racine = nom.slice(0, nom.indexOf(" (Niv"));
		} else {
			racine = nom;
		}

		// Durée (extrapolée à partir de la racine)
		if(racine in PotionsDeBase) {
		// Si popo d'une famille connue:
			// Ajout de la durée
			objPopos[num].duree = PotionsDeBase[racine].duree;

			// Attribution d'un "niveau" (pour affichage)
			// Par défaut, niveau = valeur du 1er effet
			niveau = effetTotal.match(/\d+/);
			// Cas particuliers:
			switch(racine) {
				case "Dover Powa":
				case "Sinne Khole":
					// "niveau" = MM/RM
					niveau = effetTotal.match(/\d+/g).join("/");
					break;
				case "Metomol":
					// niveau = malus armure
					niveau = effets[1].match(/\d+/);
					break;
				case "Zet Crakdedand":
					// niveau = bonus PV
					niveau = effets[effets.length-1].match(/\d+/);
					break;
				case "PufPuff":
					// niveau = malus Vue
					// Si malus PV, on ajoute "Tox."
					niveau = effets.length>4 ?
						"3 Tox." : effets[effets.length-2].match(/\d+/);
					break;
				case "Elixir de Corruption":
					// niveau = niveau + MM/RM
					if(effets.length>6) {
						niveau += " ("+
							effets[6].match(/\d+/)+"/"+
							effets[7].match(/\d+/)+")";
					}
			}
			if(niveau) {
				// Force le cast du array["number"] en string:
				objPopos[num].niveau = String(niveau);
			}
		}

		// Malus GPTJC
		if([
			"Potion de Guerison",
			"Toxine Violente",
			"Potion de Painture",
			"Jus de Cervelle"
		].includes(racine)) {
			objPopos[num].GPT = 1;
		}

		// Calcul du risque associé aux effets de la popo
		risque=0;
		magie=0;
		for(effet of effets) {
			nb = effet.match(/\d+/);
			if(nb) {
				carac = effet.split(":")[0].trim();
				if(carac=="RM" || carac=="MM") {
					// Si MM/RM, on attrape le signe pour faire la somme
					// algébrique et on divise la carac par 10
					nb = effet.match(/-?\d+/);
					magie = magie ? magie+nb/10 : nb/10;
					// Mini-mélange: on stocke la valeur pour le cap
					objPopos[num][carac] = Math.abs(nb);
				} else if(carac=="TOUR") {
					// Si effet de durée, malus = nb de 1/2 h
					risque += nb/30;
				} else if(carac.indexOf("Pàïntûré")!=-1) {
					// Si Painture, malus = niv x 10
					risque += nb*10;
				} else {
					risque += Number(nb);
				}
			} else if(/[Z,z]one/.test(effet)) {
				// Malus de Zone
				objPopos[num].zone = 1;
			} else {
				window.console.warn("[mmassistant] Effet inconnu:", effet);
			}
		}
		if(magie) {
			// Si MM/RM, on vire le signe final de la somme algébrique
			risque += Math.abs(magie);
		}
		objPopos[num].risque = Math.round(10*risque)/10;

		ajouteInfosDeLaPopo(row.cells[3], objPopos[num]);
	}
	if(MODE_DEBUG) {
		window.console.debug(objPopos);
	}
	window.localStorage.setObject("mmassistant.popos."+numTroll, objPopos);

	// Ajout du bouton de Mélange
	if(!div) { return; }
	titrePopos.cells[1].style.width = "100px";
	td = titrePopos.insertCell(2);
	td.id = "mmassistant_tdmelange";
	btn = ajouteBouton(td, "Mélanger...");
	btn.id = "mmassistant_btnmelange";
	btn.onclick = activeMelangeur;
	if(MODE_DEBUG) {
		window.console.debug("[mmassistant] initMatos réussi");
	}
}

function activeMelangeur() {
	var
		checkboxsCompo = document.querySelectorAll(".mmassistant_compo"),
		checkboxsPopo = document.querySelectorAll(".mmassistant_popo"),
		div = document.getElementById("mh_objet_hidden_"+numTroll+"_Potion"),
		plus = document.getElementById("mh_plus_"+numTroll+"_Potion"),
		btn = document.getElementById("mmassistant_btnmelange"),
		td = document.getElementById("mmassistant_tdmelange"),
		checkbox, span;
	if(div.style.display=="none") {
		plus.click();
	}
	for(checkbox of checkboxsCompo) {
		checkbox.parentElement.style.display = "";
	}
	for(checkbox of checkboxsPopo) {
		checkbox.parentElement.style.display = "";
	}
	btn.value = "Mélanger!!";
	btn.onclick = lanceMelange;

	appendText(td, " Risque: ", true);
	span = document.createElement("span");
	span.id = "mmassistant_risque";
	span.innerHTML = "Choisir 2 potions"
	td.appendChild(span);
}

function refreshMelangeur() {
	var
		checkboxsCompo = document.querySelectorAll(".mmassistant_compo"),
		checkboxsPopo = document.querySelectorAll(".mmassistant_popo"),
		td = document.getElementById("mmassistant_tdmelange"),
		span = document.getElementById("mmassistant_risque"),
		num = this.num,
		typeItem = this.typeItem,
		chercheMemoire = false,
		erreur = "",
		popos = [],
		checkbox, compo, risque;

	// Parsage des Compos
	for(checkbox of checkboxsCompo) {
		if(checkbox.checked) {
			if(typeItem=="popo" || checkbox.num==num) {
				// Sélection du compo actif
				if(checkbox.num in objCompos) {
					compo = objCompos[checkbox.num];
				} else {
					erreur = "Composant inconnu";
				}
			} else {
				// Nettoyage ancien compo
				checkbox.checked = false;
			}
		}
	}

	// Parsage des Popos
	if(typeItem=="popo" && (!numMemoire || num==numMemoire)) {
		chercheMemoire = true;
		numMemoire = 0;
	}
	for(checkbox of checkboxsPopo) {
		if(checkbox.checked) {
			if(chercheMemoire) {
				numMemoire = checkbox.num;
				chercheMemoire = false;
			}
			if(
				typeItem=="popo" &&
				checkbox.num!=num &&
				checkbox.num!=numMemoire
			) {
				checkbox.checked = false;
			} else {
				if(checkbox.num in objPopos) {
					popos.push(objPopos[checkbox.num]);
				} else {
					popos.push({});
					erreur += (erreur ? "\n" : "") + "Potion inconnue";
				}
			}
		}
	}
	if(popos.length<2) {
		erreur += (erreur ? "\n" : "") + "Nécessite 2 potions";
	}

	if(erreur) {
		td.title = erreur;
		span.innerHTML = /2/.test(erreur) ? "Choisir 2 potions" : "inconnu";
		return;
	}

	risque = risqueExplo(popos[0], popos[1], compo);
	span.innerHTML = risque.texte;
	td.title = risque.details;
}

function lanceMelange() {
	var
		checkboxsCompo = document.querySelectorAll(".mmassistant_compo"),
		checkboxsPopo = document.querySelectorAll(".mmassistant_popo"),
		utiliser = {
			popos: [],
			compo: ""
		},
		checkbox;

	// Récupération d'un éventuel compo
	// On s'arrête dès qu'on en trouve un
	for(checkbox of checkboxsCompo) {
		if(checkbox.checked) {
			utiliser.compo = checkbox.num;
			break;
		}
	}

	// Récupération des popos
	// On s'arrête à la 2e popo trouvée
	for(checkbox of checkboxsPopo) {
		if(checkbox.checked) {
			utiliser.popos.push(checkbox.num);
			if(utiliser.popos.length>=2) {
				break;
			}
		}
	}

	// Stockage temporaire des éléments à utiliser
	window.sessionStorage.setObject("mmassistant.utiliser", utiliser);

	// Lancement de la compétence Mélange
	top.frames["Main"].frames["Action"].location.assign(
		"Play_action.php?ai_ToDo=125&as_Action=ACTION!"
	);
}

// Traitement des pages Mélange Magique / Lancer de Potion / Utiliser un item //

function enrichitListeCompos() {
// Ajoute les infos de compos au menu déroulant lors d'un mélange
	if(!objCompos) { return; }
	var
		option, compo, i,
		optgroup = selectCompo.getElementsByTagName("optgroup")[0];

	selectCompo.style.maxWidth = "300px";

	for(option of selectCompo.options) {
		if(option.value in objCompos) {
			compo = objCompos[option.value];
			appendText(option, " (-"+compo.bonus+"%)");
		} else if(option.value!=0) {
			option.title = "Composant inconnu: ouvrez l'onglet Équipement";
		}
	}

	if(compos_par_bonus) {
		var
			composDispos = {},
			numCompos = [],
			num;
		for(i=selectCompo.options.length-1 ; i>=0 ; i--) {
			option = selectCompo.options[i];
			if(option.value) {
				composDispos[option.value] = option;
				if(option.value in objCompos) {
					selectCompo.remove(i);
				}
			}
		}

		for(num in objCompos) {
			if(num in composDispos) {
				numCompos.push(num);
			}
		}
		numCompos.sort(function(a, b) {
			if(objCompos[a].bonus==objCompos[b].bonus) {
				if(objCompos[a].mob==objCompos[b].mob) {
					// Tri 3: Par numéro de compo (numérique) croissant
					return Number(a)>Number(b);
				}
				// Tri 2: Par Nom de monstre (alpha) croissant
				return objCompos[a].mob>objCompos[b].mob;
			}
			// Tri 1: Par bonus (numérique) croissant
			return Number(objCompos[a].bonus)>Number(objCompos[b].bonus);
		});

		for(num of numCompos) {
			optgroup.appendChild(composDispos[num]);
		}
	}
}

function enrichitListePopos(select) {
// Ajoute les infos de popo à un menu déroulant lors d'un MM / LdP
	if(!objPopos) { return; }
	var
		i, option, popo,
		container = document.evaluate(
			"./optgroup[@label='Potion']",
			select, null, 9, null
		).singleNodeValue || select,
		initialValue = select.value;

	// Enrichissement de la liste (niveaux, effet en title)
	for(i=0 ; i<container.children.length ; i++) {
		option = container.children[i];
		if (!option.value) {
			// On saute l'option "choisir" pour LdP
			continue;
		}
		if(option.value in objPopos) {
			// Cas de Lancer de Potion:
			// on supprime la mention inutile " (Potion)"
			if(option.innerHTML.indexOf("(Potion)")!=-1) {
				option.innerHTML = option.textContent.slice(0,
					option.textContent.indexOf(" (Potion)")
				).trim();
			}

			popo = objPopos[option.value];
			if(popo.effet) {
				option.title = popo.effet;
			} else {
				option.title = "Aucune carac.";
			}
			if(popo.niveau) {
				appendText(option, " "+popo.niveau);
			}
			if(popo.zone) {
				appendText(option, " (Zone)");
			}
		} else {
			option.title = "Potion inconnue: ouvrez l'onglet Équipement";
		}
	}

	// Tri des potions (si l'option est activée)
	if(popos_par_nom) {
		var
			poposDispos = {},
			numPopos = [],
			num;

		// Sauvegarde et suppression des options
		for(i=container.children.length-1 ; i>=0 ; i--) {
			option = container.children[i];
			if(option.value) {
				poposDispos[option.value] = option;
				if(option.value in objPopos) {
					option.remove();
				}
			}
		}

		// Tri des options sauvegardées
		for(num in objPopos) {
			if(num in poposDispos) {
				numPopos.push(num);
			}
		}
		numPopos.sort(function(a, b) {
			if(objPopos[a].nom==objPopos[b].nom) {
				if(
					objPopos[a].niveau==void(0) ||
					objPopos[b].niveau==void(0) ||
					objPopos[a].niveau==objPopos[b].niveau
				) {
					// Tri 3: Par numéro de popo (numérique) croissant
					// S'applique directement si pas de niveau (e.g. Potions Mélangées)
					return Number(a)>Number(b);
				}
				// Tri 2: Par niveau (mixte) croissant
				if(isNaN(objPopos[a].niveau)) {
					if(isNaN(objPopos[b].niveau)) {
						// Si on est dans un cas alpha pur : DP/SK/Corruption
						// on range dans l'ordre lexicographique (numérique)
						var
							da = objPopos[a].niveau.match(/\d+/g),
							db = objPopos[a].niveau.match(/\d+/g);
						for(var i=0 ; i<da.length ; i++) {
							if(!db[i]) {
								// N'est pas censé se produire
								// Si b plus court que a, inverser
								return true;
							}
							if(da[i]!=db[i]) {
								return Number(da[i])>Number(db[i]);
							}
						}
						// N'est pas censé se produire.
						// Dans le doute, ne rien faire.
						return false;
					}
					// Si a = PufPuff Tox et b = PufPuff num, inversion
					return true;
				}
				return Number(objPopos[a].niveau)>Number(objPopos[b].niveau);
			}
			// Tri 1: Par nom de potion (alpha) croissant
			return objPopos[a].nom>objPopos[b].nom;
		});

		// Réinjection des options sauvegardées
		for(i=0 ; i<numPopos.length ; i++) {
			container.appendChild(poposDispos[numPopos[i]]);
		}

		// Resélection de l'élément précédemment sélectionné (JS call sur Use)
		// ou par défaut du nouveau premier élément de la liste
		if(initialValue>0) {
			select.value = initialValue;
		} else {
			select.selectedIndex = 0;
		}
	}
}

function initCompetenceMelange() {
// Mise en place du calculateur de risque
	if(MODE_DEBUG) {
		window.console.debug("[mmassistant] Lancement initCompetenceMelange");
	}
	var
		divAction = document.querySelector("div.ActionFrame"),
		labels = document.evaluate(
			".//text()[contains(.,'Choisir')]",
			divAction, null, 7, null
		),
		titre4 = document.evaluate(
			"//div[@class='titre4' and contains(text(),'PA')]",
			document, null, 9, null
		).singleNodeValue,
		i, node, utiliser;

	if(refaire_mise_en_page) {
		// On vire tous les messages "Choisir un xxx:"
		for(i=0 ; i<labels.snapshotLength ; i++) {
			labels.snapshotItem(i).parentNode.removeChild(labels.snapshotItem(i));
		}

		// On étend les boîtes
		selectCompo.style.maxWidth = "300px";
		selectPopo1.style.maxWidth = "300px";
		selectPopo2.style.maxWidth = "300px";
	}

	// Insertion des infos dans les menus déroulants
	enrichitListeCompos();
	enrichitListePopos(selectPopo1);
	enrichitListePopos(selectPopo2);

	// Initialisation affichage Risques
	// On vire le message "[Portée : sur la zone uniquement]":
	titre4.innerHTML = "[2 PA] ";
	afficheRisque.innerHTML = "[Risque d'explosion : (nécessite 2 potions)]";
	titre4.appendChild(afficheRisque);
	selectPopo1.onchange = refreshRisqueExplo;
	selectPopo2.onchange = refreshRisqueExplo;
	selectCompo.onchange = refreshRisqueExplo;

	// Récupération des items à utiliser si activation via inventaire
	if(utiliser = window.sessionStorage.getObject("mmassistant.utiliser")) {
		if(MODE_DEBUG) {
			window.console.debug("Items à utiliser:", utiliser);
		}
		window.sessionStorage.removeObject("mmassistant.utiliser");
		if(utiliser.compo) {
			selectCompo.value = String(utiliser.compo);
			if(!selectCompo.value) {
				selectCompo.value = "0";
			}
		}
		if(utiliser.popos && utiliser.popos[0]) {
			selectPopo1.value = String(utiliser.popos[0]);
			if(!selectPopo1.value) {
				selectPopo1.selectedIndex = 0;
			}
			if(utiliser.popos[1]) {
				selectPopo2.value = String(utiliser.popos[1]);
				if(!selectPopo2.value) {
					selectPopo2.selectedIndex = 0;
				}
			}
		}
		window.console.log("[mmassistant] Items à utiliser appliqués");
		refreshRisqueExplo();
	}
	if(MODE_DEBUG) {
		window.console.debug("[mmassistant] initCompetenceMelange réussie");
	}
}

function refreshRisqueExplo() {
// Met à jour le risque d'explosion en fonction des popos/compos sélectionnés
	var popo1, popo2, compo, risque;

	// On vérifie si on a bien 2 popos connues sélectionnées
	afficheRisque.title = "";
	if(selectPopo1.value=="" || selectPopo2.value=="") {
		afficheRisque.innerHTML =
			"[Risque d'explosion : (nécessite 2 potions)]";
		return;
	}

	popo1 = objPopos[selectPopo1.value];
	popo2 = objPopos[selectPopo2.value];
	if(popo1==void(0) || popo2==void(0)) {
		afficheRisque.innerHTML =
			"[Potion inconnue : ouvrez l'onglet Équipement]";
		return;
	}

	if(selectCompo.value && selectCompo.value!=0) {
		if(objCompos[selectCompo.value]) {
			compo = objCompos[selectCompo.value];
		} else {
			afficheRisque.innerHTML =
				"[Composant inconnu : ouvrez l'onglet Équipement]";
			return;
		}
	}

	risque = risqueExplo(popo1, popo2, compo);
	afficheRisque.innerHTML = "[Risque d'explosion : "+risque.texte+"]";
	afficheRisque.title = risque.details;

	if(MODE_DEBUG) {
		window.console.debug("[mmassistant] refreshRisqueExplo réussi");
	}
}

//---------------------- Traitement des pages de stock -----------------------//

function traitementStockTaniere() {
// Traitement du stock d'une tanière perso (onglet tanière)
	if(MODE_DEBUG) {
		window.console.debug("[mmassistant] Lancement traitementStockTaniere");
	}
	try {
		// On récupère la liste des compos en stock
		var trCompos = document.evaluate(
			"//table[@id='stock']/tbody[position() mod 2 = 0]/tr/" +
			"td[position() = 4 and contains(text(),'Composant')]/..",
			document, null, 7, null
		);
	} catch(e) {
		window.console.warn(
			"[mmassistant] Aucun composant dans le stock", e
		);
		return;
	}

	var qte = 0;
	for(var i=0 ; i<trCompos.snapshotLength ; i++) {
		var tr = trCompos.snapshotItem(i);
		if (tr.getElementsByClassName("mmassistant_infos").length > 0) {
			continue;
		}
		var
			mob = tr.cells[2].textContent,
			qualite = tr.cells[2].textContent.match(Qualites.regex),
			niveau;
		mob = mob.slice(mob.indexOf("d'un")+5)
			.split("de Qualit")[0]
			.trim();
		niveau = NiveauDuMonstre[epure(mob)];
		if(niveau && qualite) {
			ajouteInfosDuCompo(tr.cells[2], {
				mob: mob,
				niveau: niveau,
				qualite: qualite,
				bonus: niveau+Qualites[qualite].bonus
			});
			qte++;
		}
	}

	window.console.log(
		"[mmassistant] traitementStockTaniere : " + qte +
		" composant(s) traité(s)"
	);
}

function traitementListeAchatTaniere() {
// Traitement de la liste d'Achat d'un lieu tanière (onglet lieu)
	if(MODE_DEBUG) {
		window.console.debug(
			"[mmassistant] Lancement traitementListeAchatTaniere"
		);
	}
	var divs = document.evaluate(
			"//div[contains(@id, 'Composant')]",
			document, null, 7, null
		),
		div, tableCompos,
		row, insertNode, mob, niveau, qualite;

	for(i=0; i<divs.snapshotLength; i++) {
		div = divs.snapshotItem(i);
		try {
			tableCompos = div.getElementsByTagName("table")[0];
		} catch(e) {
			window.console.error(
				"[mmassistant] Erreur durant le traitement de la liste d'achat",
				e
			);
			continue;
		}

		for(row of tableCompos.rows) {
			insertNode = row.cells[3];
			mob = insertNode.textContent;
			mob = mob.slice(mob.indexOf("d'un")+5)
				.split("de Qualit")[0]
				.trim();
			niveau = NiveauDuMonstre[epure(mob)];
			qualite = insertNode.textContent.match(Qualites.regex);
			if(niveau && qualite) {
				ajouteInfosDuCompo(insertNode, {
					mob: mob,
					niveau: niveau,
					qualite: qualite,
					bonus: niveau+Qualites[qualite].bonus
				});
			}
		}
	}

	if(MODE_DEBUG) {
		window.console.debug(
			"[mmassistant] traitementListeAchatTaniere réussi"
		);
	}
}

//-------------------------- Traitement des gowaps ---------------------------//

function traitementListeGowaps() {
	if(MODE_DEBUG) {
		window.console.debug("[mmassistant] Lancement traitementListeGowaps");
	}
	var
		titresGogos = document.getElementsByClassName("mh_tdtitre_fo"),
		titre, numGogo, div, tableCompos,
		row, insertNode, mob, niveau, qualite;
	for(titre of titresGogos) {
		numGogo = titre.textContent.match(/\d+/);
		try {
			// Recherche d'éventuels compos
			div = document.getElementById(
				"mh_objet_hidden_"+numGogo+"_Composant"
			);
			if(div) {
				tableCompos = div.getElementsByTagName("table")[0];
			} else {
				window.console.warn(
					"[mmassistant] Aucun composant trouvé sur le gowap " +
					numGogo
				);
				continue;
			}
		} catch(e) {
			window.console.error(
				"[mmassistant] Erreur durant l'analyse des gowaps", e
			);
			return;
		}

		// Traitement des Composants
		// tableCompos.row.cells:
		// 0: numéro
		// 1: nom | emplacement | qualité
		// 2: effet (aucun)
		// 3: usure
		// 4: poids
		// 5: [en gueule]
		for(row of tableCompos.rows) {
			insertNode = row.cells[1];
			mob = insertNode.textContent;
			mob = mob.slice(mob.indexOf("d'un")+5)
				.split("de Qualit")[0]
				.trim();
			niveau = NiveauDuMonstre[epure(mob)];
			qualite = insertNode.textContent.match(Qualites.regex);
			if(niveau && qualite) {
				ajouteInfosDuCompo(insertNode, {
					mob: mob,
					niveau: niveau,
					qualite: qualite,
					bonus: niveau+Qualites[qualite].bonus
				});
			}
		}
	}

	if(MODE_DEBUG) {
		window.console.debug("[mmassistant] traitementListeGowaps réussi");
	}
}

function traitementEquipementGowap() {
	if(MODE_DEBUG) {
		window.console.debug(
			"[mmassistant] Lancement traitementEquipementGowap"
		);
	}
	var
		urlParams = new URLSearchParams(window.location.search),
		numGogo = urlParams.get('ai_IdFollower'),
		div = document.getElementById(
			"mh_objet_hidden_"+numGogo+"_Composant"
		),
		tableCompos, row, insertNode, mob, niveau, qualite;
	if(div) {
		tableCompos = div.getElementsByTagName("table")[0];
	} else {
		window.console.warn(
			"[mmassistant] Aucun composant trouvé sur le gowap " + numGogo
		);
		return;
	}

	// Traitement des Composants
	// tableCompos.row.cells:
	// 0: numéro
	// 1: nom | emplacement | qualité
	// 2: effet (aucun)
	// 3: usure
	// 4: poids
	// 5: [en gueule]
	for(row of tableCompos.rows) {
		insertNode = row.cells[1];
		mob = insertNode.textContent;
		mob = mob.slice(mob.indexOf("d'un")+5)
			.split("de Qualit")[0]
			.trim();
		niveau = NiveauDuMonstre[epure(mob)];
		qualite = insertNode.textContent.match(Qualites.regex);
		if(niveau && qualite) {
			ajouteInfosDuCompo(insertNode, {
				mob: mob,
				niveau: niveau,
				qualite: qualite,
				bonus: niveau+Qualites[qualite].bonus
			});
		}
	}

	if(MODE_DEBUG) {
		window.console.debug("[mmassistant] traitementEquipementGowap réussi");
	}
}

//------------------------------ Main Dispatch -------------------------------//

function isPage(url) {
	return window.location.pathname.indexOf('/mountyhall/'+url) == 0;
}

if(
	isPage("MH_Taniere/TanierePJ_o_Stock") ||
	isPage("MH_Comptoirs/Comptoir_o_Stock")
) {
	// Ajout du bouton Relaunch (utile si +500 compos)
	var footer = document.getElementById("footer1"),
		relaunchButton = document.createElement("input");
	relaunchButton.type = "button";
	relaunchButton.className = "mh_form_submit";
	relaunchButton.value = "Réanalyser les Composants";
	relaunchButton.onmouseover = function() {
		this.style.cursor="pointer";
	};
	relaunchButton.onclick = traitementStockTaniere;
	footer.parentNode.insertBefore(relaunchButton, footer);

	traitementStockTaniere();
} else if (isPage("MH_Lieux/Lieu_TaniereAchat")) {
	traitementListeAchatTaniere();
} else if (isPage("MH_Play/Play_e_follo")) {
	traitementListeGowaps();
} else if (isPage("MH_Follower/FO_Equipement")) {
	traitementEquipementGowap();
} else if(isPage("MH_Play/Play_equipement")) {
	// Page d'équipement
	getNumTroll();
	initMatos();
} else if(
	utiliser_popo &&
	isPage("MH_Play/Actions/Play_a_ActionYY") &&
	document.body.id=="p_utiliserunepotionouunparchemin"
) {
	// Utiliser une popo / parcho
	window.console.log("[mmassistant] Utiliser une potion");
	getNumTroll();
	var run = true;
	try {
		var
			select = document.getElementsByTagName("select")[0],
			objPopos = window.localStorage.getObject("mmassistant.popos."+numTroll);
	} catch(e) {
		window.console.error(
			"[mmassistant] Erreur durant l'initialisation - OFF", e
		);
		run = false;
	}
	if (run) {
		enrichitListePopos(select);
	}
} else if(isPage("MH_Play/Actions/Competences/Play_a_CompetenceYY")) {
	if(lancer_de_potions && document.body.id=="p_competencelancerdepotions") {
		// Lancer de Potion
		window.console.log("[mmassistant] Compétence : Lancer de potion");
		getNumTroll();
		var run = true;
		try {
			var
				selectPopo = document.getElementById("potion"),
				objPopos = window.localStorage.getObject("mmassistant.popos."+numTroll);
		} catch(e) {
			window.console.error(
				"[mmassistant] Erreur durant l'initialisation - OFF", e
			);
			run = false;
		}
		if (run) {
			enrichitListePopos(selectPopo);
		}
	} else if(document.body.id=="p_competencemlangemagique") {
		// Mélange Magique
		window.console.log("[mmassistant] Compétence : Mélange Magique");
		getNumTroll();
		var run = true;
		try {
			var
				selectPopo1 = document.getElementById("potion1"),
				selectPopo2 = document.getElementById("potion2"),
				selectCompo = document.getElementById("cible"),
				numMemoire, afficheRisque;
			objCompos =
				window.localStorage.getObject("mmassistant.compos."+numTroll);
			objPopos =
				window.localStorage.getObject("mmassistant.popos."+numTroll);
		} catch(e) {
			window.console.error(
				"[mmassistant] Erreur durant l'initialisation du calculateur", e
			);
			run = false;
		}
		if (run) {
			afficheRisque = document.createElement("span");
			initCompetenceMelange();
		}
	} else {
		window.console.warn("[mmassistant] Compétence non reconnue - OFF");
	}
}

if(MODE_DEBUG) {
	window.console.debug("[mmassistant] script OFF sur : "+URL);
}
