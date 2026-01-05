// ==UserScript==
// @name        Plater's NS Gates
// @namespace      http://kol.coldfront.net/thekolwiki/index.php/User:Plater
// @description Shows you the item to use for the gates (why doesny anyone do this??)
// @include     http://www.kingdomofloathing.com/lair1.php?action=gates
// @version     2
// @downloadURL https://update.greasyfork.org/scripts/4123/Plater%27s%20NS%20Gates.user.js
// @updateURL https://update.greasyfork.org/scripts/4123/Plater%27s%20NS%20Gates.meta.js
// ==/UserScript==


var DoDungPotConversion=true;
var DoWikiLinks=false;//not implemented

function GateEntry(GateName,GateEffect,GateChoices)
{
	//Gate of Hilarity 	Comic Violence 	gremlin juice
	switch(arguments.length) 
	{
		case 0: GateName = '';
		case 1: GateEffect = '';
		case 2: GateChoices = new Array();
		case 3: break;
		default: throw new Error('illegal argument count')
  }
	this.Gate = GateName;
	this.Effect = GateEffect;
	this.Choices = GateChoices;
} //end of class



var TheGates=new Array();
//TheGates.push(new GateEntry("","",[]));
// GATE ONE
TheGates.push(new GateEntry("Gate of Hilarity","Comic Violence",["gremlin juice"]));
TheGates.push(new GateEntry("Gate of Humility","Wussiness",["wussiness potion", "Yummy Tummy bean"]));
TheGates.push(new GateEntry("Gate of Morose Morbidity and Moping","Rainy Soul Miasma",["thin black candle", "Yummy Tummy bean", "picture of a dead guy's girlfriend"]));
TheGates.push(new GateEntry("Gate of Slack","Extreme Muscle Relaxation",["Mick's IcyVapoHotness Rub"]));
TheGates.push(new GateEntry("Gate of Spirit","Woad Warrior",["pygmy pygment"]));
TheGates.push(new GateEntry("Gate of the Porcupine","Spiky Hair",["super-spiky hair gel"]));
TheGates.push(new GateEntry("Gates of The Suc Rose","Sugar Rush",["Angry Farmer candy", "marzipan skull", "Tasty Fun Good rice candy", "Yummy Tummy bean", "stick of \"gum\"", "Breath mint or Daffy Taffy"]));
TheGates.push(new GateEntry("Gate of the Viper","Deadly Flashing Blade",["adder bladder"]));
TheGates.push(new GateEntry("Locked Gate","Locks Like the Raven",["Black No. 2"]));
// GATE TWO
TheGates.push(new GateEntry("Gate of Flame","Spicy Mouth",["jabañero-flavored chewing gum"]));
TheGates.push(new GateEntry("Gate of Intrigue","Mysteriously Handsome",["handsomeness potion"]));
TheGates.push(new GateEntry("Gate of Machismo","Engorged Weapon",["Meleegra™ pills"]));
TheGates.push(new GateEntry("Gate of Mystery","Mystic Pickleness",["pickle-flavored chewing gum"]));
TheGates.push(new GateEntry("Gate of the Dead","Hombre Muerto Caminando",["marzipan skull"]));
TheGates.push(new GateEntry("Gate of Torment","Tamarind Torment",["tamarind-flavored chewing gum"]));
TheGates.push(new GateEntry("Gate of Zest","Spicy Limeness",["lime-and-chile-flavored chewing gum"]));
// GATE THREE
TheGates.push(new GateEntry("Gate of Light","Izchak's Blessing",["Dungeons of Doom potion"]));
TheGates.push(new GateEntry("Gate of That Which is Hidden","Object Detection",["Dungeons of Doom potion"]));
TheGates.push(new GateEntry("Gate of the Mind","Strange Mental Acuity",["Dungeons of Doom potion"]));
TheGates.push(new GateEntry("Gate of the Ogre","Strength of Ten Ettins",["Dungeons of Doom potion"]));
TheGates.push(new GateEntry("Gate that is Not a Gate ","Teleportitis",["Dungeons of Doom potion","Typographical Clutter adventure", "Quantum Mechanic attack", "ring of teleportation"]));
// GATE BEES
TheGates.push(new GateEntry("Gate of Bees","Float Like a Butterfly, Smell Like a Bee",["honeypot"]));

//Dungeon Of Doom Potions
var DungPotions=["bubbly potion", "cloudy potion", "dark potion", "effervescent potion", "fizzy potion", "milky potion", "murky potion", "smoky potion", "swirly potion"];

function CheckForGateText()
{
	var wt1=document.body.innerHTML;
	//wt1=ReplaceByGateArray(wt1, TheGates);
	for(var i=0;i<TheGates.length;i++)	
	{	
		if(wt1.indexOf(	TheGates[i].Gate)!=-1)
		{				wt1=wt1.replace(TheGates[i].Gate,""+TheGates[i].Gate+" <span style=\"font-size:8pt;color:blue\">("+ConvertGateEntry(TheGates[i])+")</span>");			}
	}
	document.body.innerHTML=wt1;
}
function _ReplaceByGateArray(stText,GateArray)
{
	for(var i=0;i<GateArray.length;i++)	{		stText=stText.replace(GateArray[i].Gate,""+GateArray[i].Gate+" <span style=\"font-size:8pt;color:blue\">("+ConvertGateEntry(GateArray[i])+")</span>");	}
	return stText;
}

function ConvertGateEntry(myGateEntry)
{
	var retval="";
	var choicestr="";
	retval=myGateEntry.Effect+": ";
	for(var i=0;i<myGateEntry.Choices.length;i++)
	{
		if(DoDungPotConversion==true && myGateEntry.Choices[i]=="Dungeons of Doom potion" && myGateEntry.Choices.length==1)
		{			for(var c=0;c<DungPotions.length;c++){myGateEntry.Choices.push(""+DungPotions[c]);}		}
		else 
		{	
			if(DoWikiLinks) {	choicestr+="<a href=\"http://kol.coldfront.net/thekolwiki/index.php/"+myGateEntry.Choices[i]+"\">"+myGateEntry.Choices[i]+"</a>";	}
			else {	choicestr+=myGateEntry.Choices[i];	}
			if(i<myGateEntry.Choices.length-1) choicestr+=", ";
		}
	}
	retval+=choicestr;
	return retval;
}

CheckForGateText();
