// ==UserScript==
// @name         Melvor MakeX
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Make X Crafts
// @author       Breindahl#2660
// @match        https://*.melvoridle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408741/Melvor%20MakeX.user.js
// @updateURL https://update.greasyfork.org/scripts/408741/Melvor%20MakeX.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(main => {
    var script = document.createElement('script');
    script.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {

// Note that this script is made for MelvorIdle version 0.16.3

// Loading script
console.log('Melvor MakeX Loaded');

// Function to send notifications
function notify(msg) {
	One.helpers('notify', {
		type: 'dark',
		from: 'bottom',
		align: 'center',
		message: msg
	});
}

// Funtion to check if task is complete
function taskComplete() {
    if (window.makeLeft === 0) {
        notify("Task Done");
        console.log('task done');
        let ding = new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect.mp3");
        ding.volume=0.1;
        ding.play();
	window.makeLeft = Infinity;
	}
}

const skillVerbs = [
  // {name: 'Woodcutting', verb: 'Cut', selected: 'Log'},
  // {name: 'Fishing', verb: 'Fish', selected: 'Fish'},
  // {name: 'Cooking', verb: 'Cook', selected: 'Food'},
  // {name: 'Mining', verb: 'Mine', selected: 'Food'},
  {name: 'Smithing', verb: 'Smith', selected: 'Smith'},
  // {name: 'Thieving', verb: 'Thieve', selected: 'Thieve'},
  {name: 'Fletching', verb: 'Fletch', selected: 'Fletch'},
  {name: 'Crafting', verb: 'Craft', selected: 'Craft'},
  {name: 'Runecrafting', verb: 'Create', selected: 'Runecraft'},
  {name: 'Magic', verb: 'Cast', selected: 'AltMagic'},
  {name: 'Herblore', verb: 'Brew', selected: 'Herblore'}
];


let TempContainerMakeX = ['<small class="mr-2" id="','"><button type="button" class="btn btn-warning m-3" onclick="setMakeX(',');">','</button></small>'];
$("#craft-item-have").parent().parent().parent().children().last().children().first().children().first().after(TempContainerMakeX[0]+"CraftX"+TempContainerMakeX[1]+"'Crafting'"+TempContainerMakeX[2]+"Craft X"+TempContainerMakeX[3]);
$("#smith-item-have").parent().parent().parent().children().last().children().first().children().first().after(TempContainerMakeX[0]+"SmithX"+TempContainerMakeX[1]+"'Smithing'"+TempContainerMakeX[2]+"Smith X"+TempContainerMakeX[3]);
$("#fletch-item-have").parent().parent().parent().children().last().children().first().children().first().after(TempContainerMakeX[0]+"FletchX"+TempContainerMakeX[1]+"'Fletching'"+TempContainerMakeX[2]+"Fletch X"+TempContainerMakeX[3]);
$("#runecraft-item-have").parent().parent().parent().children().last().children().first().children().first().after(TempContainerMakeX[0]+"CreateX"+TempContainerMakeX[1]+"'Runecrafting'"+TempContainerMakeX[2]+"Create X"+TempContainerMakeX[3]);
$("#herblore-item-have").parent().parent().parent().children().last().children().first().children().first().after(TempContainerMakeX[0]+"BrewX"+TempContainerMakeX[1]+"'Herblore'"+TempContainerMakeX[2]+"Brew X"+TempContainerMakeX[3]);
$("#magic-item-have").parent().parent().parent().children().last().children().first().children().first().after(TempContainerMakeX[0]+"CastX"+TempContainerMakeX[1]+"'Magic'"+TempContainerMakeX[2]+"Cast X"+TempContainerMakeX[3]);
// $("#skill-cooking-food-selected-qty").after(TempContainer[0] + "timeLeftCooking" + TempContainer[1]);
// $("#skill-fm-logs-selected-qty").after(TempContainer[0] + "timeLeftFiremaking" + TempContainer[1]);



window.makeLeft = Infinity;

function makeX(clicked,currentSkill) {
	let verb = skillVerbs.find( ({ name }) => name === currentSkill ).verb;
	if (eval("!is"+currentSkill) && clicked) {
		window.makeLeft = Infinity;
		$("#"+verb+"X").children().first().html(verb + " X");
	}
	if(makeLeft != Infinity && !clicked) {
		window.makeLeft -= 1;
		$("#"+verb+"X").children().first().html(makeLeft + " left");
	}
	console.log('makeLeft: '+ makeLeft);
	if (window.makeLeft === 0) {
		taskComplete();
		if(currentSkill==="Magic") {
			castMagicRef2(true);
		}
		else {
			eval("start"+currentSkill+"Ref2(true);");
		}
		$("#"+verb+"X").children().first().html(verb + " X");
	}
	
}

window.setMakeX = function(currentSkill) {
	let verb = skillVerbs.find( ({ name }) => name === currentSkill ).verb;
	let selected = skillVerbs.find( ({ name }) => name === currentSkill ).selected;
	if (eval("selected"+selected) !== undefined) {
		if (makeLeft===Infinity) {
			let SetMakeX = prompt('How many would you like to make?');
			if (SetMakeX !== null) {
				window.makeLeft = SetMakeX;
				$("#"+verb+"X").children().first().html(makeLeft + " left");
				console.log('makeLeft: '+ makeLeft);
			}
		}
		else{
			window.makeLeft = Infinity;
			$("#"+verb+"X").children().first().html(verb+" X");
		}
		if(currentSkill==="Magic") {
			castMagic(true);
		}
		else {
			eval("start"+currentSkill+"(true);");
		}	
	}
};

// ## CRAFTING ##
var startCraftingRef2 = startCrafting;
window.startCrafting = function(...args) {
	startCraftingRef2(...args);
	makeX(arguments[0],"Crafting");
};

// ## SMITHING ##
var startSmithingRef2 = startSmithing;
window.startSmithing = function(...args) {
	startSmithingRef2(...args);
	makeX(arguments[0],"Smithing");
};

// ## RUNECRAFTING ##
var startRunecraftingRef2 = startRunecrafting;
window.startRunecrafting = function(...args) {
	startRunecraftingRef2(...args);
	makeX(arguments[0],"Runecrafting");
};

// ## FLETCHING ##
var startFletchingRef2 = startFletching;
window.startFletching = function(...args) {
	startFletchingRef2(...args);
	makeX(arguments[0],"Fletching");
};

// ## HERBLORE ##
var startHerbloreRef2 = startHerblore;
window.startHerblore = function(...args) {
	startHerbloreRef2(...args);
	makeX(arguments[0],"Herblore");
};

// ## MAGIC ##
var castMagicRef2 = castMagic;
window.castMagic = function(...args) {
	castMagicRef2(...args);
	makeX(arguments[0],"Magic");
};

});