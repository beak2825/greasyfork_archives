// ==UserScript==
// @name           Archetype on Replay
// @namespace      pbr/aosp
// @include        https://glb.warriorgeneral.com/game/replay.pl?game_id=*
// @copyright      2025, PeeJJK
// @version        1.1
// @description    Adds Archetype Images to Replay Screen
// @license        MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/529626/Archetype%20on%20Replay.user.js
// @updateURL https://update.greasyfork.org/scripts/529626/Archetype%20on%20Replay.meta.js
// ==/UserScript==

window.setTimeout( function() {

    var breath = /^breathcon/;
    var breathBars=[],els=document.getElementsByTagName('*');
    for (var i=els.length;i--;) if (breath.test(els[i].id)) breathBars.push(els[i]);
    for ( var d=0; d<breathBars.length; d++ ) {
        breathBars[d].remove();
    }
    var morale = /^mor/;
    var moraleBars=[],els2=document.getElementsByTagName('*');
    for (var j=els2.length;j--;) if (morale.test(els2[j].id)) moraleBars.push(els2[j]);
    for ( var e=0; e<moraleBars.length; e++ ) {
        moraleBars[e].remove();
    }

    var styles = `
    .archetype {
        display: none;
    }
    .archetype img {
        margin-top: 4px;
        margin-right: 0px;
        margin-left: 2px;
    }
    #defense_container .archetype img {
        margin-top: 7px;
        margin-right: -2px;
        height: 20px;
        width: 20px;
    }
    #defense_container .players li .player_name {
        width: 145px;
        padding-left: 17px;
        margin-right: -5px;
    }
    `;
    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    var team1 = document.getElementsByClassName('secondary_container')[0].textContent;
    var team2 = document.getElementsByClassName('secondary_container')[1].textContent;
    //window.alert(team2);

    main(team1,team2);

}, 1);

function main(team1,team2) {
    var a = document.getElementsByTagName("a");
    //window.alert(a[33]);
    if ( team1 == 'Alamo City Spurs' ) {
        for (var z=45; z<56; z++) {
            if (a[z].href.toString().indexOf("/game/player.pl") != -1) {
                getInetPage(a[z].href.toString(),handlePlayerDefense);
            }
        }
    }
    if ( team2 == 'Alamo City Spurs' ) {
        for (var x=33; x<44; x++) {
            if (a[x].href.toString().indexOf("/game/player.pl") != -1) {
                getInetPage(a[x].href.toString(),handlePlayerOffense);
            }
        }
    }
    if ( team1 != 'Alamo City Spurs' && team2 != 'Alamo City Spurs' ) {
        for (var y=33; y<44; y++) {
            if (a[y].href.toString().indexOf("/game/player.pl") != -1) {
                getInetPage(a[y].href.toString(),handlePlayerOffense);
            }
        }
        for (var w=45; w<56; w++) {
            if (a[w].href.toString().indexOf("/game/player.pl") != -1) {
                getInetPage(a[w].href.toString(),handlePlayerDefense);
            }
        }
    }
}

function handlePlayerOffense(address, page) {
    var div = document.createElement("div");
    div.innerHTML = page.responseText.replace(/<img/g,"<div").replace(/\/img/g,"/div>");

	var a = div.innerHTML.split('src="/images/game/archetypes/');
	if (a.length > 1) {
		var arch = '<img src="/images/game/archetypes/'+a[1].split("</div>")[0]+"</img>";
	}

    var a2 = document.getElementsByTagName("a");
    for (var i=33; i<44; i++) {
        if (a2[i].href.toString() == address) {
            var newDiv = document.createElement("div");
            newDiv.innerHTML = "<div class='archetype'>"+arch+"</div>";
            a2[i].parentNode.insertBefore(newDiv, a2[i].parentNode.lastChild.previousSibling.previousSibling);
        }
    }
}

function handlePlayerDefense(address, page) {
    var div = document.createElement("div");
    div.innerHTML = page.responseText.replace(/<img/g,"<div").replace(/\/img/g,"/div>");

	var a = div.innerHTML.split('src="/images/game/archetypes/');
	if (a.length > 1) {
		var arch = '<img src="/images/game/archetypes/'+a[1].split("</div>")[0]+"</img>";
	}

    var a2 = document.getElementsByTagName("a");
    for (var i=45; i<56; i++) {
        if (a2[i].href.toString() == address) {
            var newDiv = document.createElement("div");
            newDiv.innerHTML = "<div class='archetype'>"+arch+"</div>";
            a2[i].parentNode.insertBefore(newDiv, a2[i].parentNode.lastChild.previousSibling.previousSibling);
        }
    }
}

function getInetPage(address, func) {
    var req = new XMLHttpRequest();
	req.open( 'GET', address, true );
	req.onload = function() {
		if (this.status != 200) {
			alert("pbr gm script: Error "+this.status+" loading "+address);
		}
		else {
			func(address,this);
		}
	};
	req.send(null);
	return req;
}

window.setTimeout( function() {
var styles = `
    .archetype {
        display: block;
    }`;
var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
}, 4500);