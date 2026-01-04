// ==UserScript==
// @name         Humblebundle Steam library checker
// @version      0.65
// @description  Will check your steam library and color game title and add a steam link to tell you if you already own this game.
// @author       Zeper
// @match        https://www.humblebundle.com/downloads?key=*
// @match        https://www.humblebundle.com/home/keys*
// @match        https://www.humblebundle.com/games/*
// @match        https://www.humblebundle.com/yogscast/*
// @connect      https://api.steampowered.com*
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/191481
// @downloadURL https://update.greasyfork.org/scripts/375160/Humblebundle%20Steam%20library%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/375160/Humblebundle%20Steam%20library%20checker.meta.js
// ==/UserScript==

var xhr = new XMLHttpRequest();
var debug = false;
//if(debug){console.log("");}

var Key = [];
//where key will be stored

var Games = [];
//where games will be stored

var App = [];
//where all steam app will be stored

var curlocation = window.location.pathname.split("/");
var ActualPageType;
//type 0 is a non suported page (such as shop)
//type 1 is https://www.humblebundle.com/downloads?key=*
//type 2 is https://www.humblebundle.com/home/keys*
//type 3 is https://www.humblebundle.com/games/*
//type 4 is https://www.humblebundle.com/yogscast/*

var YourAPIKey = "";
//Find your API key here https://steamcommunity.com/dev/apikey

var YourSteamID = "";
//Find your steam ID on https://steamdb.info/calculator/

// YOUR GAME PRIVACY MUST BE SET TO EVERYONE
// https://steamcommunity.com/my/edit/settings


function parsekey(pagetype){
	Key = [];
	if (pagetype == 3 || pagetype == 4) {var GameField = document.getElementsByClassName("game-boxes");} else {var GameField = document.getElementsByClassName("keyfield-value");}
	for (var index in GameField) {
	   if (GameField.hasOwnProperty(index)) {
			switch (pagetype){
				case 1:
				    var Obj = GameField[index];
					var NameObj = Obj.parentNode.parentNode.parentNode.children[0];
					var IsSteamKey = Boolean(Obj.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("hb-steam")[0]);
                    var Name = NameObj.innerText;
					break;
				case 2:
					var Obj = GameField[index];
					var NameObj = Obj.parentNode.parentNode.parentNode.parentNode.parentNode.children[1].children[0];
					var IsSteamKey = Boolean(Obj.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName("hb-steam")[0]);
                    var Name = NameObj.innerText;
					break;
				case 3:
					var Obj = GameField[index];
					var NameObj = Obj.getElementsByClassName("dd-image-box-text")[0];
					var IsSteamKey = Boolean(Obj.getElementsByClassName("hb-steam")[0]);
                    var Name = NameObj.getElementsByClassName("front-page-art-image-text")[0].innerText;
					break;
				case 4:
					var Obj = GameField[index];
					var NameObj = Obj.getElementsByClassName("dd-image-box-text")[0];
					var IsSteamKey = Boolean(Obj.getElementsByClassName("hb-steam")[0]);
                    var Name = NameObj.innerText;
					break;
				default:
					var Obj = new Object();
					var NameObj = new Object();
					var IsSteamKey = false;
                    var Name = NameObj.innerText;
			}
			if (Obj.parentNode.className == "keyfield redeemed enabled"){
			var Reveal = true;
			} else {var Reveal = false;}
			Key.push({OBJ: Obj , NAMEOBJ: NameObj ,NAME: Name ,REAVEAL: Reveal ,STEAM: IsSteamKey ,STATUS: 0 });
		}
	}
	if(debug){console.log(Key);}
}

function getownedgame(APIkey,steamid,callback,callback2){
	Games = [];
	xhr.open('GET', "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key="+APIkey+"&steamid="+steamid+"&include_appinfo=1&format=json", true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
			var response = JSON.parse(xhr.response)
			for (var index in response.response.games){
				Games.push(response.response.games[index].name);
			}
			if(debug){console.log(Games);}
			callback();
			callback2();
		}
	}
}

function comparekey2game(){
	for (var index in Key) {
		if (Key[index].STEAM){
			var KeyName = Key[index].NAME.toLowerCase().replace(/\s/g, "").replace(/([:℠™®©,_-])/g, "");
            if (KeyName.length < 1) {if(debug){console.error("KeyName too short\nKey["+index+"].NAME : "+Key[index].NAME+"\nKeyName : "+KeyName+"\nKeyName length : "+KeyName.length);} else {console.exception("=== Humblebundle Steam library checker === \n\nWrong game name.\nUpdate game name parsing.");}break;}
			for (var g in Games) {
				var GamesName = Games[g].toLowerCase().replace(/\s/g, "").replace(/([:℠™®©,_-])/g, "")
				if (KeyName == GamesName) {
					Key[index].NAMEOBJ.style["color"] = "red";
					Key[index].NAMEOBJ.title = 'This color mean that you already own the game.\n\nRelated game in your Steam library:\n"'+ Games[g] + '"';
					Key[index].STATUS = 4;
					if(debug){console.log("Game found "+ Games[g]+" ( "+KeyName+" == "+GamesName+" ) Status : "+Key[index].STATUS);}
				} else if (KeyName.includes(GamesName)){
					if ((Key[index].NAMEOBJ.title === Key[index].NAME || !Key[index].NAMEOBJ.title) && Key[index].STATUS < 3) {
						Key[index].NAMEOBJ.title = 'This color mean that you may already had a version of this game.\n\nRelated game in your Steam library:\n"'+ Games[g] + '"';
					} else {
						Key[index].NAMEOBJ.title = Key[index].NAMEOBJ.title +'\n"'+ Games[g] + '"';
					}
					if (Key[index].STATUS < 3) {
						Key[index].STATUS = 3;
						Key[index].NAMEOBJ.style["color"] = "orange";
					}
					if(debug){console.log("Game maybe found "+ Games[g]+" ( "+KeyName+" includes "+GamesName+" ) Status : "+Key[index].STATUS);}
				} else if (GamesName.includes(KeyName)){
					if ((Key[index].NAMEOBJ.title === Key[index].NAME || !Key[index].NAMEOBJ.title) && Key[index].STATUS < 2) {
						Key[index].NAMEOBJ.title = 'This color mean that you own games with similar names.\n\nRelated game in your Steam library:\n"'+ Games[g] + '"';
					} else {
						Key[index].NAMEOBJ.title = Key[index].NAMEOBJ.title +'\n"'+ Games[g] + '"';
					}
					if (Key[index].STATUS < 2) {
						Key[index].STATUS = 2;
						Key[index].NAMEOBJ.style["color"] = "fuchsia";
					}
					if(debug){console.log("Game maybe found "+ Games[g]+" ( "+GamesName+" includes "+KeyName+" ) Status : "+Key[index].STATUS);}

				}
			}
			if (!Key[index].STATUS) {
                Key[index].STATUS = 1;
                Key[index].NAMEOBJ.style["color"] = "green";
				Key[index].NAMEOBJ.title = 'This color mean that you do not own this game.';
            }
		}
	}
    addsteamlink();
}

function steamapp(){
	App = [];
	xhr.open('GET', "https://api.steampowered.com/ISteamApps/GetAppList/v2/", true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
			var response = JSON.parse(xhr.response);
            App = response.applist.apps;
			if(debug){console.log(App);}
            addsteamlink();
		}
	}
}

function addsteamlink(){
    for (var index in Key) {
        if (Key[index].STEAM){
            var KeyName = Key[index].NAME.toLowerCase().replace(/\s/g, "").replace(/([:℠™®©,_-])/g, "");
            Key[index].NAMEOBJ.setAttribute("onclick", "javascript:window.open('https://store.steampowered.com/search/?term=" + Key[index].NAME.replace(/\s/g, " ").replace(/([:℠™®©'",_-])/g, "")+"')");
            Key[index].NAMEOBJ.style["cursor"] = "pointer";
            for (var g in App) {
                var GamesName = App[g].name.toLowerCase().replace(/\s/g, "").replace(/([:℠™®©,_-])/g, "")
                if (KeyName == GamesName) {
                    var storelink = "https://store.steampowered.com/app/" + App[g].appid;
                    Key[index].NAMEOBJ.setAttribute("onclick", "javascript:window.open('"+storelink+"')");
                    if(debug){console.log("Steam page link added for "+ Key[index].NAME +" : "+ storelink);}
                }
            }
        }
    }
}

function init(){
    parsekey(ActualPageType);
    comparekey2game();
}

const observer = new MutationObserver(function () {init();});
if (curlocation[1] == "home") {curlocation = curlocation[1] + "/" + curlocation[2];} else { curlocation = curlocation[1]; }
switch (curlocation){
	case "downloads":
		ActualPageType = 1;
        observer.observe(document.querySelector("div[class='key-container']"), {childList: true});
		break;
	case "home/keys":
		ActualPageType = 2;
		observer.observe(document.querySelector('tbody'), {childList: true});
		break;
	case "games":
		ActualPageType = 3;
		break;
	case "yogscast":
		ActualPageType = 4;
		break;
	default:
		ActualPageType = 0;
}

getownedgame(YourAPIKey,YourSteamID,init,steamapp);