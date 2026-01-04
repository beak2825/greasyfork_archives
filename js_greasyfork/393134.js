// ==UserScript==
// @name           Neopets - Active Pet Shuffle
// @version        2.0
// @namespace
// @include        http://www.neopets.com/*
// @include        https://www.neopets.com/*
// @description    Shuffles which pet appears in the sidebar.
// @copyright      Baffle Blend
// @grant          none
// @namespace https://greasyfork.org/users/394566
// @downloadURL https://update.greasyfork.org/scripts/393134/Neopets%20-%20Active%20Pet%20Shuffle.user.js
// @updateURL https://update.greasyfork.org/scripts/393134/Neopets%20-%20Active%20Pet%20Shuffle.meta.js
// ==/UserScript==
function id(el,id) {return el.getElementById(id);}
function cl(el,cls) {return el.getElementsByClassName(cls);}
function tg(el,tag) {return el.getElementsByTagName(tag);}
function at(el,att) {return el.getAttribute(att);}
function hide(el){el.style.display="none";}


var activePetModule = cl(document,"sidebarTable")[0]; //Grabs the module where the active pet's information is stored
var activePetImage = tg(activePetModule,"img")[0];
var activePetInfo = tg(activePetModule,"tr")[0];
var actpetname = tg(activePetModule,"b")[0].textContent; //Detects current active pet's name
var customizebar1 = cl(activePetModule,"activePet sf");
var customizebar2 = customizebar1[customizebar1.length-1];
var infotable = customizebar1[0].parentNode.nextSibling.nextSibling;
//Gets the "Species" part of the infobox so it will match the shuffled pet
var activeSpecies = infotable.firstChild.nextSibling.firstChild.nextSibling.firstChild.nextSibling.firstChild.lastChild.previousSibling.firstChild


function insertOldActive(module,html){
var oldActivePet = "<tr><td align=\"right\">Active:</td><td align=\"left\"> <b>" + actpetname + "</b></td></tr><br>";

module.insertAdjacentHTML('afterbegin',oldActivePet);
}


var petnames = [

/////////////////////////////////////////////////
//CONFIGURATION - YOUR PETS
/////////////////////////////////////////////////
//Type all of your pets' names.
//"Your_First_Main_Account_Pet,
//"Your_Second_Main_Account_Pet",
//"Your_Third_Main_Account_Pet",
//"Your_First_Side_Account_Pet", (etc...)
//
//NOTE:
//While it is technically possible to list pets that aren't your own,
//I ask for their owners' courtesy that you please don't do this.
//It won't affect them or the pet in question,
//but it just still isn't very nice.

    {name: "Your_First_Main_Account_Pet",
        species: "Shoyru",
        defaultimage: true,
        image: ""},
    {name: "Your_First_Side_Account_Pet",
        species: "Scorchio",
        defaultimage: true,
        image: ""},
    {name: "Pet that doesn't actually exist",
        species: "Cerpull",
        defaultimage: false,
        image: "http://i.imgur.com/zxgkk8c.gif"},

/////////////////////////////////////////////////
];
//Adds who the REAL active pet is to the info box because that is still important to know
var oldActivePet = "<tr><td align=\"right\">Active:</td><td align=\"left\"><b>" + actpetname + "</b></td></tr>";
insertOldActive(customizebar2.parentNode.firstChild.nextSibling,oldActivePet);
//activePetModule.nextElementSibling.insertAdjacentHTML('afterend',oldActivePet);
var listLength = petnames.length - 1;
var chosenPet = Math.ceil(Math.random() * listLength);
var chosenPetName = petnames[chosenPet].name;
if (petnames[chosenPet].defaultimage == true){petnames[chosenPet].image = "http://pets.neopets.com/cpn/" + chosenPetName + "/1/2.png";}
activePetImage.src = petnames[chosenPet].image;
activePetImage.style = "height:150px;width:150px;";
activeSpecies.textContent = petnames[chosenPet].species;
activePetModule.getElementsByTagName("b")[0].textContent = chosenPetName;