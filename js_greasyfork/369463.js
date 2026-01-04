// ==UserScript==
// @name         Proxer-Galerie-18+
// @namespace    
// @version      0.21
// @description  Stellt die Thumbnails bei "NSFW"-Bildern dar
// @author       Xenris
// @include      *proxer.me*
// @include      http*://*proxer.me*
// @run-at       document-end
// @require      https://greasyfork.org/scripts/12981-proxer-userscript-anker/code/Proxer-Userscript-Anker.js?version=108560
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/369463/Proxer-Galerie-18%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/369463/Proxer-Galerie-18%2B.meta.js
// ==/UserScript==

//############################# Einbinden des Userscript Anker #############################
function changeGal(change) //Ist das Script aktiviert?
{
    if(GM_getValue("proxGal",0) == 1 ) //aktiviert
    {
		$(document).ready(function() { //Sobald Seite geladen wurde
		    var curhref = window.location.href;
		    var scriptfin = false;
		    setInterval(function(){ //Prüfung, ob Seite gewechselt wurde
		         var lastSegment = window.location.href;
		        var regex = /https:\/\/proxer.me\/gallery/;
		        if ((lastSegment.search(regex) > -1) && scriptfin == false){ //Skript wurde noch nicht ausgeführt
		            curhref = window.location.href;
		            init();
		        }
		        else{
		            if(window.location.href != curhref){ //Seite wurde gewechselt
		                curhref = window.location.href;
		                scriptfin = false;
		            }
		        }
		    }, 1000);

			function init(){ //wird ausgeführt, wenn Skript noch nicht ausgeführt wurde
			/*var url_string = window.location.href;
			var surl = new URL(url_string);
			var cid = surl.searchParams.get("id");
			var cname; //Anime und Manga, Games, Fanmade, etc
			var subcname; // One Piece, Bleach, Naruto, Header, etc*/

			var url_string = new URL(curhref);
			var cid = url_string.searchParams.get("id");
			var cname; //Anime und Manga, Games, Fanmade, etc
			var subcname; // One Piece, Bleach, Naruto, Header, etc

			switch(cid){ //Events nicht inbegriffen, da vermutlich ohnehin kein NSFW vorhanden
				case "3": //vocaloid
					cname = "vocaloid_3"; break;
				case "4": //wallpapers
					cname = "wallpapers_4"; break;
				case "5": //selbst gezeichnet
					cname = "selbst_gezeichnet_5"; break;
				case "9": //games
					cname = "games_9"; break;
				case "16": //Fanmade
					cname = "fanmade_16"; break;
				case "17": //other stuff and memes
					cname = "other_stuff__memes_17"; break;
				case "52": //anime und manga
					cname = "anime_und_manga_52"; break;
				case "74": //advent
					cname = "advent"; break;
				case "6": //one piece
					cname = "anime_und_manga_52"; subcname = "one_piece_6"; break;
				case "7": //bleach
					cname = "anime_und_manga_52"; subcname = "bleach_7"; break;
				case "8": //naruto
					cname = "anime_und_manga_52"; subcname = "naruto_8"; break;
				case "19": //animeszenen und failsubs
					cname = "anime_und_manga_52"; subcname = "animeszenen__failsubs_19"; break;
			 	case "21": //render
			 		cname = "anime_und_manga_52"; subcname = "render_21"; break;
				case "22": //ecchi
					cname = "anime_und_manga_52"; subcname = "pantsu_22"; break;
				case "23": //yaoi
					cname = "anime_und_manga_52"; subcname = "yaoi_23"; break;
				case "24": //yuri
					cname = "anime_und_manga_52"; subcname = "yuri_24"; break;
				case "28": //fairy tail
					cname = "anime_und_manga_52"; subcname = "fairy_tail_28"; break;
				case "41": //sao
					cname = "anime_und_manga_52"; subcname = "sword_art_online_41"; break;
				case "10": //touhou
					cname = "games_9"; subcname = "touhou_10"; break;
				case "11": //minecraft
					cname = "games_9"; subcname = "minecraft_11"; break;
				case "25": //final fantasy
					cname = "games_9"; subcname = "final_fantasy_25"; break;
				case "26": //screenshots
					cname = "games_9"; subcname = "screenshots_26"; break;
				case "35": //borderlands
					cname = "games_9"; subcname = "borderlands_35"; break;
				case "39": //moba's
					cname = "games_9"; subcname = "mobas_39"; break;
				case "36": //cosplay
					cname = "fanmade_16"; subcname = "cosplay_36"; break;
				case "37": //gfx
					cname = "other_stuff__memes_17"; subcname = "signaturen_37"; break;
				case "63": //header
					cname = "other_stuff__memes_17"; subcname = "63"; break;
				case "93": //challenge me's
					cname = "fanmade_16"; subcname = "93"; break;
				case "80": //drawing of the month
					cname = "selbst_gezeichnet_5"; subcname = "80"; break;
				case "30": //cons, festivals und co
					cname = "other_stuff_memes_17"; subcname = "cons_festivals__co_30"; break;
				case "29": //my little pony: friendship is magic
					cname = "other_stuff_memes_17"; subcname = "my_little_pony_friendship_is_magic_29"; break;
				case "27": //demotivational
					cname = "other_stuff_memes_17"; subcname = "demotivational_27"; break;
				case "76": //weihnachtsgebäck 2016
					cname = "advent"; subcname = "76"; break;
				case "77": //wichteln 2015
					cname = "advent"; subcname = "77"; break;
				default: //fallback
					cname = ""; subcname = "";
			}

			var list = document.getElementsByClassName("galgrid"); //Liste erstellen mit allen Bildern
			for (var i = 0; i < list.length; i++){ //Jedes Bild einzeln durchlaufen
				var url = list[i].style.backgroundImage; //url("...") checken
				if (url.includes("explicit")){ //"NSFW"-Vorschaubild?
					var bildid = list[i].id.substring(5); //id auslesen
					if (cname){
						cname += "/";
					}
					else{
						cname = "";
					}
					if (subcname){
						subcname += "/";
					}
					else{
						subcname = "";
					}
					list[i].style.backgroundImage = "url(//cdn.proxer.me/gallery/details/" + cname + subcname + bildid + ")"; //richtiges Vorschaubild setzen
				}
			}
			scriptfin = true;
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', function(event) {
    //addAnkerMember(id, modulname, modus, changefunction, memoryName, memoryDefault, zusatz);
    addAnkerMember("GalerieAnker","Galerie 18+",3,changeGal,"proxGal");
});