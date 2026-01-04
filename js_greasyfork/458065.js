// ==UserScript==
// @name        Empire Outlaw Assistant
// @namespace   https://greasyfork.org/users/1802-wes-pardus
// @author      Wes R  (Artemis)
// @description This script will check the Empire's list of Outlaw pilots against your foes list, and will create a list of who you have not foelisted and display it beneath the lookup button for easy selection and foelisting.
// @match     http://artemis.pardus.at/diplomacy.php
// @match     https://artemis.pardus.at/diplomacy.php
// @version     1.101
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458065/Empire%20Outlaw%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/458065/Empire%20Outlaw%20Assistant.meta.js
// ==/UserScript==
//
//v1.1
//added Lancasto, River Tam
//v1.041
//added Frank The Tank, Tworb, Cake
//v1.03
//added Kolger and Daekan
//v1.02
//Script Launch

/*This finds the foes option list*/
var selectTables = document.getElementsByTagName("select");
var currentFoes = selectTables[selectTables.length-7];
var drawLocation = document.getElementsByTagName("form");

/*Our current list of Outlaws, shoved into an Array.*/
var Outlaws = new Array();
var removeOutlaws = new Array();

var h3 = document.getElementsByTagName("h3");
var inners = h3[5].innerHTML;

/*If for some reason you are not going to foe a pilot, just replace their name with another outlaw in the list.*/

//WAR
Outlaws[0] = "Azul Thanatos";
Outlaws[1] = "Shadow";
Outlaws[2] = "Erius Suire";
Outlaws[3] = "Ashley";
Outlaws[4] = "Warson";
Outlaws[5] = "Rekcah";
Outlaws[6] = "Sifrons";
Outlaws[7] = "Ranker Five";
Outlaws[8] = "Glove";
Outlaws[9] = "Stijenaa";
Outlaws[10] = "Dallas";
Outlaws[11] = "Helio Feld";
Outlaws[12] = "Rocco Bonnaro";
Outlaws[13] = "Zinnath";
Outlaws[14] = "Elinwar";
Outlaws[15] = "Jinx";
Outlaws[16] = "John Wick";
Outlaws[17] = "Spectrum";
Outlaws[18] = "Demonswrath";
Outlaws[19] = "Lilu";
Outlaws[20] = "Unethical";
Outlaws[21] = "Novo";
Outlaws[22] = "Ancient Polia";
Outlaws[23] = "Kilgore Trout";
Outlaws[24] = "One two";
Outlaws[25] = "Karl the Lion";
Outlaws[26] = "Imafool";
Outlaws[27] = "Kolger";
Outlaws[28] = "Daekan";
Outlaws[29] = "Frank The Tank";
Outlaws[30] = "Tworb";
Outlaws[31] = "Cake";
Outlaws[32] = "Lancasto";
Outlaws[33] = "River Tam";
//Outlaws[] = "";
Outlaws.sort();

//removeOutlaws[0] = "";




/*function check outlaws with current foes this function will find who you have not foelisted, and add them to the list of who to foe				                      																	*/ //if(inners.match(/[A-Za-z0-9\/.:='"<_]*Inner Assembly/g) == "Inner Assembly"){}else{Outlaws = new Array();}

/*this will be the position in the outlaw array*/
var x = 0;
var Rx = 0;

/*position to look in the foes array*/
var position = 0;
var Rposition = 0;

/*position to add foesNeeded*/
var f = 0;
var foesNeeded = new Array();

while(x<Outlaws.length){

	/*this will be the position in the foes array*/
	var y = position;

	while(y<currentFoes.length){
		if(Outlaws[x] == currentFoes[y].value){
			currentFoes[y].setAttribute('style', "color:red");
			position = y;
			y += 9999;
		}else{
			++y;
		}
	}

	/*if y is less than the length, a match was not found, adds x to the foesNeeded array.*/
	if(y < currentFoes.length+2){
		foesNeeded[f] = Outlaws[x];
		++f;
	}

	++x;
}

var focus = true;
var removeCount = 0;

while(Rx<removeOutlaws.length){

	/*this will be the position in the foes array*/
	var Ry = Rposition;

	while(Ry<currentFoes.length){
		if(removeOutlaws[Rx] == currentFoes[Ry].value){
			currentFoes[Ry].setAttribute('style', "color:blue");
			if(focus == true){
				currentFoes[Ry].setAttribute('selected', true);
				focus = false;
			}

			if(currentFoes[Ry].value == removeOutlaws[0]){
				alert("Aah Chu is not a foe and may have been added incorrectly.  Be sure to select a foe from the list prior to looking up a pilot's name.");
			}
			Rposition = Ry;
			Ry += 9999;
			++removeCount;
		}else{
			++Ry;
		}
	}
	++Rx;
}

/*if there are no pilots to foe, we really don't need all this stuff so don't do it*/
if(f > 0){

	var drawList = document.createElement("select");
	var optionList = document.createElement("option");

	var counter = 0;

	while(counter < foesNeeded.length){

		optionList = document.createElement("option");
		optionList.setAttribute('value', foesNeeded[counter]);
		drawList.appendChild(optionList);
		drawList.options[drawList.length-1].text = foesNeeded[counter];
		++counter;
	}

	drawList.setAttribute("name", "outlawList");
	drawList.setAttribute("id", "outlawList");
	drawList.setAttribute("onclick", "document.dipl_lookup.lookup_name.value = (outlawList.options[outlawList.options.selectedIndex].value)");
	drawList.setAttribute("size", f);
	drawList.setAttribute("style", "width:4.5cm");


	var drawText = document.createElement("h7");

	if(removeCount > 0){
		drawText.innerHTML = removeCount + " pilots can be removed from your foes lists.";
	}
	else{
		drawText.innerHTML = "These (" + f + ") pilots are not foelisted:";
	}
	drawLocation[0].parentNode.appendChild(drawText);
	drawLocation[0].parentNode.appendChild(drawList);

}else{

	var outlawsLabel = document.createElement("h7");

	if(removeCount > 0){
		outlawsLabel.innerHTML = "Empire enemies are all foelisted.<br>" + removeCount + " pilots can be removed from your foes lists.";
	}
	else{
		outlawsLabel.innerHTML = "Empire enemies are all foelisted.";
	}

	drawLocation[0].parentNode.appendChild(outlawsLabel);
}