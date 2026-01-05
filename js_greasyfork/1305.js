// ==UserScript==
// @name        Outlaw Assistant
// @namespace   https://greasyfork.org/users/1802-wes-pardus
// @description This script will check the Union's list of Outlaw pilots against your foes list, and will create a list of who you have not foelisted and display it beneath the lookup button for easy selection and foelisting.  If nobody needs foelisting a link to the Outlaw's List on the forums is displayed.
// @include     http://artemis.pardus.at/diplomacy.php
// @include     https://artemis.pardus.at/diplomacy.php
// @version     5.07
// @downloadURL https://update.greasyfork.org/scripts/1305/Outlaw%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/1305/Outlaw%20Assistant.meta.js
// ==/UserScript==

//v5.07 removed Antichrist
//v5.06 deactivated outlaws
//v5.05 Spacestormy
//v5.04 Darth Thrawn
//v5.03 OP traders
//v5.02 trimming
//v5.01
// war foes
//v5 War Approaches
// war foes adding
//
//v4.240
//72 added Barbarossa
//
//v4.239
//71 added Akira, Grace Broadbent, Lilu, Patto, The Master
//
//v4.238
//66 added Pac
//
//v4.237
//65 added John Sexton, Roger Dodger - removed Parnoidengy
//
//v4.236
//64 added Groparu, Chad Deoxy, Sextus Pompeius
//
//v4.235
//61 added Parnoidengy
//
//v4.234
//60 added Amir Ilberhe, Pacem rename to Snickers
//
//v4.233
//59 removed Xolarix(reps)
//
//v4.232
//60 added Nicotine
//
//v4.231
//59 removed Marcus (retired)
//
//v4.230
//60 removed Asriel
//
//v4.229
//61 added Asriel
//
//v4.228
//60 added Tatmara Nholl
//
//v4.227
//58 removed Dog - retired
//59 added Pretty Pretty Ricky
//
//v4.226
//59 added Dog
//
//v4.225
//57 removed Guilty Spark - retired
//58 added Salvation
//
//v4.224
//58 added Caliborne Escariot
//
//v4.223
//57 added Guilty Spark
//
//v4.222
//56 removed Blue Hero
//
//v4.22
//57 added Blue Hero
//
//v4.21
//56 removed Onishi - retired
//
//v4.20
//57 Kaji Meatsuna - Crusader
//
//v4.191 - fixed 4.19
//v4.19
//56 added Xikik
//
//v4.18
//55 added Edward Kenway
//
//v4.17
//54 added Sphex
//
//v4.16
//53 added Carimo
//
//v4.15
//52 added Onishi (crusader)
//
//v4.14
//51 added Ponies Curfin, Marcus, Marcus Tullius Cicer, Mephistoles, Xolarix
//
//v4.13
//46 removed Zed (retired)
//
//4.12
//47 removed Human Inside (retired)
//
//v4.11
//48 removed Vegas
//
//v4.10
//auto update prodding
//
//v4.09
//49 added Lupulsur, Zed
//
//v4.08
//rename Wild Gina is now known as Wild Chocolate
//
//v4.07
//47 removed Antibody
//
//v4.06
//48 Added Pacem
//
//v4.05
//47 added Khattie (Bloodred - Pacem scout)
//
//v4.04
//46 Edd Solo has retired.
//
//v4.03
//47 Locke
//
//v4.02
//46 Pukka Cheese
//
//v4.01
//45 Admiral James Kelly
//
//v4.00
//Rehosted, ready for launch - 44 Eddie B Lanner
//
//v3.07
//update test1
//
//v3.06
//rehosted to Greasy Fork - update testing
//
//v3.05
//43 Long Tom retired
//
//v3.04
//???
//
//v3.03
//44 removed Wormy ban hammers - Linda Lanner, Pandora, Silverclaw
//
//v3.02
//48 Sky Crossbones - pirate
//
//v3.01
//Celso renamed to Nugz
//
//v3.0
// added functionality to alert users when they foelist a pilot prior to selecting a provided name.
//
//v2.27
// 47 added Edd Solo, Teereere
//
//v2.26
// 45 removed Asteo - retired.
//
//v2.25
//46 Asteo, Tzenyetz The Third, Wormy - Thor Max DD peoples
//
//v2.24
//43 Flash Simmons - pirate 
//
//v2.23
//42 Bofa - pirate alliance/Unionite
//
//v2.22
//41 Celso - idiot/pirate
//
//v2.21
//40
// Stormer - UNR/URC pirate
//
//v2.20
//39 
// Antibody - Fed| PUC pirate
//
//v2.19
//38
// Telo (retired), Heredia Elhorriblay (paid reps) removed
//
//v2.18
//40 Telo
// Venom Einbein Dakker rename to Doctor Capaldi
//
//v2.17
//39 Tacoguy
//
//v2.16
//38 Human Inside
//
//v2.15 
//   removed Arrakis
//37 added Celestial 
//
//v2.14
//37 removed The Uncatchable
//
//v2.13
//38 added The Uncatchable
//
//v2.12
//37 removed Soulfly - terms
//
//v2.11
//38 removed Bullstuff - deleted
//
//v2.1
//39 Linda Lanner
//
//v2.0
//outlaw removals
//22 names come off and onto removeOutlaws
//38 outlaws remain
//
//v1.91
//disabled new requests for peace treaty removals.
//
//v1.81
//60 removed Jaya
//
//v1.8
//61 Narf Anisset, Oafman, Chunkie, Marathorn, Exon, Huckleberry, Durandal, Reiziger, Abominated
//
//v1.7
//51 Space Cowboy
//
//v1.61
//50 removed Lancelotv
//
//v1.6
//51 Warson
//
//v1.54
//50 Tro, Sony
//
//v1.53
//feature update fix
//48 Drendie, Akakios, Tealc, Alucard, Arteida, A Horse, Marathorn, Saint Bon, Jaya, Kilgore Trout, Vampyre, Larki
//
//v1.4
//improved algorithms 
//
//v1.3
//36 Tragic, Lancelotv, Hades, Rafe Deathbringer
//
//v1.21
//@updateURL and @downloadURL included
//
//v1.2
//32 - Aaronic has retired.
//
//v1.1 - 2013/3/15
//33 - added Vegas
//https support
//
//v1.0
//32 Outlaws on script launch 2013/3/14
//

/*This finds the foes option list*/
var selectTables = document.getElementsByTagName("select");
var currentFoes = selectTables[selectTables.length-7];
var drawLocation = document.getElementsByTagName("form");

/*Our current list of Outlaws, shoved into an Array.*/
var Outlaws = new Array();
var removeOutlaws = new Array();

var h3 = document.getElementsByTagName("h3");
var inners = h3[5].innerHTML;

/*If for some reason you are not going to foe a pilot, just replace their name with another outlaw in this list.*/
/*
Outlaws[0] = "A Horse";
Outlaws[1] = "Admiral James Kelly";
Outlaws[2] = "Alucard";
Outlaws[3] = "Amaya de Castro";
Outlaws[4] = "Antichrist";
Outlaws[5] = "Black Chocolate";
Outlaws[6] = "Bob Gramsci";
Outlaws[7] = "Bofa";
Outlaws[8] = "Brock Lesnar";
Outlaws[9] = "Carimo";
Outlaws[10] = "Celestial";
Outlaws[11] = "Curfin";
Outlaws[12] = "Doctor Capaldi";
Outlaws[13] = "Eddie B Lanner";
Outlaws[14] = "Edward Kenway";
Outlaws[15] = "Flash Simmons";
Outlaws[16] = "Ford Saw";
Outlaws[17] = "Hades";
Outlaws[18] = "Johndoe";
Outlaws[19] = "Kaji Meatsuna";
Outlaws[20] = "Khattie";
Outlaws[21] = "Locke";
Outlaws[22] = "Lupulsur";
Outlaws[24] = "Marcus Tullius Cicer";
Outlaws[25] = "Mephistoles";
Outlaws[26] = "Mev Einbein Dakker";
Outlaws[27] = "Mourning Storm";
Outlaws[28] = "Nugz";
Outlaws[29] = "Snickers";
Outlaws[30] = "Peter Griffin";
Outlaws[31] = "Pukka Cheese";
Outlaws[32] = "Rafe Deathbringer";
Outlaws[33] = "Relax";
Outlaws[34] = "Servitude";
Outlaws[35] = "Sky Crossbones";
Outlaws[36] = "Smiles";
Outlaws[37] = "Smurf Cloud";
Outlaws[38] = "Sony";
Outlaws[39] = "Sphex";
Outlaws[40] = "Stormer";
Outlaws[41] = "Sugar Eater";
Outlaws[42] = "Tacoguy";
Outlaws[43] = "Tealc";
Outlaws[44] = "Teereere";
Outlaws[45] = "The Clone Ranger";
Outlaws[46] = "The Purple Adder";
Outlaws[47] = "Tripod Mistress";
Outlaws[48] = "Tzenyetz The Third";
Outlaws[49] = "Urito";
Outlaws[50] = "War Emblem";
Outlaws[51] = "Warson";
Outlaws[52] = "Wild Chocolate";
Outlaws[53] = "Xikik";
Outlaws[55] = "Zetaka"; 
Outlaws[56] = "Salvation"; 
Outlaws[57] = "Caliborne Escariot";
Outlaws[23] = "Pretty Pretty Ricky";
Outlaws[54] = "Tatmara Nholl";
Outlaws[58] = "Nicotine";
Outlaws[59] = "Amir Ilberhe";
Outlaws[60] = "John Sexton";
Outlaws[61] = "Groparu";
Outlaws[62] = "Chad Deoxy";
Outlaws[63] = "Sextus Pompeius";
Outlaws[64] = "Roger Dodger";
*/


//WAR
Outlaws[0] = "Pac";
/*
Outlaws[1] = "Akira";
Outlaws[2] = "Imafool";
Outlaws[3] = "Lilu";
Outlaws[4] = "Patto";
Outlaws[5] = "The Master";
Outlaws[6] = "Barbarossa";
Outlaws[7] = "Ron Ronson";
Outlaws[8] = "Shadow";
Outlaws[9] = "Drendie";
Outlaws[10] = "Kixx Alverado";
Outlaws[11] = "Sparkle";
Outlaws[12] = "Psychopathicyak";
Outlaws[13] = "Bethany";
Outlaws[14] = "Tro";
Outlaws[15] = "Wigham";
Outlaws[16] = "Darth Thrawn";
Outlaws[17] = "Spacestormy";
*/


//Outlaws[79] = "";
//Outlaws[80] = "";
//Outlaws[81] = "";


Outlaws.sort();
//Outlaws] = "";

removeOutlaws[0] = "Aah Chu";
removeOutlaws[1] = "Antichrist";
removeOutlaws[2] = "Vegas";
/*removeOutlaws[1] = "Akakios";
removeOutlaws[2] = "Arteida";
removeOutlaws[3] = "Chunkie";
removeOutlaws[4] = "Drendie";
removeOutlaws[5] = "Durandal";
removeOutlaws[6] = "Exon";
removeOutlaws[7] = "Huckleberry";
removeOutlaws[8] = "Jaya";
removeOutlaws[9] = "Lancelotv";
removeOutlaws[10] = "Kilgore Trout";
removeOutlaws[11] = "Larki";
removeOutlaws[12] = "Lun";
removeOutlaws[13] = "Marathorn";
removeOutlaws[14] = "Narf Anisset";
removeOutlaws[15] = "Oafman";
removeOutlaws[16] = "Reiziger";
removeOutlaws[17] = "Saint Bon";
removeOutlaws[18] = "Space Cowboy";
removeOutlaws[19] = "Tro";
removeOutlaws[20] = "Tragic";
removeOutlaws[21] = "Vampyre";*/
//removeOutlaws[22] = "";



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
		drawText.innerHTML = removeCount + " pilots can be removed from your foes lists.<br><a href = 'http://z9.invisionfree.com/Unionforum/index.php?showtopic=2053' target='_blank'>These (" + f + ") pilots</a> are not foelisted:";
	}
	else{
		drawText.innerHTML = "<a href = 'http://z9.invisionfree.com/Unionforum/index.php?showtopic=2053' target='_blank'>These (" + f + ") pilots</a> are not foelisted:";
	}
	drawLocation[0].parentNode.appendChild(drawText);
	drawLocation[0].parentNode.appendChild(drawList);

}else{

	var outlawsLabel = document.createElement("h7");
	
	if(removeCount > 0){
		outlawsLabel.innerHTML = "Union enemies are all foelisted.<br>" + removeCount + " pilots can be removed from your foes lists.<br><a href = 'http://z9.invisionfree.com/Unionforum/index.php?showtopic=2053' target='_blank'>A complete list with their crimes can be found here.</a>";
	}
	else{
		outlawsLabel.innerHTML = "Union enemies are all foelisted.<br><a href = 'http://z9.invisionfree.com/Unionforum/index.php?showtopic=2053' target='_blank'>A complete list with their crimes can be found here.</a>";
	}
	
	drawLocation[0].parentNode.appendChild(outlawsLabel);
}