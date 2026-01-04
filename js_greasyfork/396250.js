// ==UserScript==
// @name        Remove unwanted results (incest edition)
// @namespace   Violentmonkey Scripts
// @match       https://kufirc.com/torrents.php*
// @grant       none
// @version     1.0
// @author      WolfyD
// @description 2/9/2020, 8:42:09 PM
// @downloadURL https://update.greasyfork.org/scripts/396250/Remove%20unwanted%20results%20%28incest%20edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/396250/Remove%20unwanted%20results%20%28incest%20edition%29.meta.js
// ==/UserScript==


var lst = [ "family",
"stepfamily",
"step dad",
"step mom",
"step sister",
"step brother",
"step father",
"step mother",
"step family",
"step daughter",
"step son",
"step-dad",
"step-mom",
"step-sister",
"step-brother",
"step-father",
"step-mother",
"step-family",
"step-daughter",
"step-son",
"step.dad",
"step.mom",
"step.sister",
"step.brother",
"step.father",
"step.mother",
"step.family",
"step.daughter",
"step.son",
"stepdad",
"stepmom",
"stepsister",
"stepbrother",
"stepfather",
"stepmother",
"stepdaughter",
"stepson",
"dad",
"mom",
"sister",
"brother",
"father",
"mother",
"twin",
"sis",
"bro",
"families",
"grandpa",
"grandma",
"grandfather",
"grandmother",
"uncle",
"niece",
"incest",
"incest.roleplay",
"cousin" ];

window.addEventListener("load", start());

function start(){
	var interval = setInterval(1000, Myloop());
}

function Myloop(){
	for(var loop = 0; loop < 30; loop++){
		var torrents = document.getElementsByClassName("torrent");
		for(var i = 0; i < torrents.length; i++){
			var taglist = (torrents[i].innerText.toLowerCase().split(" "));
			
			for(var tag = 0; tag < taglist.length; tag++){
				var txt = taglist[tag].toLowerCase();
				if(lst.indexOf(txt) > -1){
					torrents[i].parentNode.removeChild(torrents[i]);
				}
			}
		}
	}
}