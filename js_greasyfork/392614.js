// ==UserScript==
// @name           Neopets - Custom Active Pet Sayings
// @version        4.1
// @namespace      http://www.neopets.com/
// @match          *.neopets.com/*
// @description    Make your active pet occasionally talk, just like in the old layout.
// @copyright      Lendri Mujina
// @license        MIT
// @icon           https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/392614/Neopets%20-%20Custom%20Active%20Pet%20Sayings.user.js
// @updateURL https://update.greasyfork.org/scripts/392614/Neopets%20-%20Custom%20Active%20Pet%20Sayings.meta.js
// ==/UserScript==

// Definitions used throughout the script
const random = (limit) => Math.ceil(Math.random() * limit);
function randomWords(list) {return list[random(list.length - 1)];}// Select a random word from a list
const defaultPhrases = ["Is it time for training yet?","A Tiki Tour sounds good right about now!","Why don't you just paint me grey if you're gonna leave me like this?","Seen any good concerts lately?","I think some strength training is in order, don't you?","Do you think you could buy me a toy? Please?","Destruct-O-Match sounds like fun right about now.","AH! BEHIND YOU! Just kidding!","*yawn* Is it nap time, yet?","* ho hum *","My puny arms can't even hold an Attack Pea!","* sigh *","Know anyone who's up for a fight?!","How can I show my face in the Battledome like this?","When's the last time we visited the Techo Master?","Today doesn't seem to be a very good day."]; //Phrases on the old site. Do not remove, as it's used for error catching.

/////////////////////////////////////////////////
	//CONFIGURATION - Settings and Style
/////////////////////////////////////////////////
// Phrase Activation Probability
// Default 7.5%, roughly the same as the site's built-in phrases
const phraseFrequency = 7.5;

// CSS Styles
const newTextStyle = "font-family: MuseoSansRounded500, Arial, sans-serif; width: 297px; margin: 6px 0 0 21px; color: black; text-align: center; font-weight: bold; word-wrap: break-word;";
const oldTextStyle = ""; // Allows customization for classic pages. If left blank, default site styles apply.
//////////////////////////////////////////////////
//==================================================
//If you have any special functions for phrases (e.g. arrays of changeable words, or special text effects), put them here. Some common lists have been provided for demonstration purposes; use or discard if desired.

const petSpecies=["Acara","Aisha","Blumaroo","Bori","Bruce","Buzz","Chia","Chomby","Cybunny","Draik","Elephante","Eyrie","Flotsam","Gelert","Gnorbu","Grarrl","Grundo","Hissi","Ixi","Jetsam","Jubjub","Kacheek","Kau","Kiko","Koi","Korbat","Kougra","Krawk","Kyrii","Lenny","Lupe","Lutari","Meerca","Moehog","Mynci","Nimmo","Ogrin","Peophin","Poogle","Pteri","Quiggle","Ruki","Scorchio","Shoyru","Skeith","Techo","Tonu","Tuskaninny","Uni","Usul","Vandagyre","Wocky","Xweetok","Yurble","Zafara"];

const neopianPlaces=["Altador","Brightvale","Darigan Citadel","Faerieland","Haunted Woods","Kiko Lake","Krawk Island","Kreludor","Lutari Island","Maraqua","Meridell","Moltara","Mystery Island","Neopia Central","Roo Island","Shenkuu","Terror Mountain","Lost Desert","Tyrannia","Virtupets Space Station","Dacardia"];

/////////////////////////////////////////////////
	//CONFIGURATION - YOUR PETS
/////////////////////////////////////////////////
const petList = [
  ["PETNAMEHERE",
 		randomWords(defaultPhrases),
	]
];

//Type all of your pets' names,
//followed by the phrases you want them to say, with a comma after each until the end of the list.\
//If you want the old phrases to be a part of their vocabulary, type "randomWordss(defaultPhrases)", without the quotes.
//Don't forget to put a "\" before apostrophes or quote marks if you want them to appear.
//See the following example for what I mean.

//["Your_First_Main_Account_Pet",
//		"A Tiki Tour sounds good right about now!",
//		"Why don\'t you just paint me grey if you're gonna leave me like this?",
//	],
//["Your_Second_Main_Account_Pet",
//		"Seen any good concerts lately?",
//		"I think some strength training is in order, don\'t you?",
//	],
//["Your_Third_Main_Account_Pet",
//		"Destruct-O-Match sounds like fun right about now.",
//		"AH! BEHIND YOU!<br>Just kidding!"
//["Your_First_Side_Account_Pet",
//		"When\'s the last time we visited the Techo Master?",
//		"Today doesn\'t seem to be a very good day."
//	]

/////////////////////////////////////////////////////

// Variables for active pet information
let activePetInfo, insertionPoint, actpetname, HTMLPhrase;
let pageContent, pageType;
const isBeta = document.querySelector('#container__2020') !== null;
const isClassic = document.querySelector('td.sidebar') !== null;

if (isBeta) {
  pageContent = document.querySelector('#container__2020');
  pageType = 0;
} else if (isClassic) {
  pageContent = document.querySelectorAll('div.content > td.content')[0];
  pageType = 1;
}

// Check if pet should speak on this page load
function shouldActivate() {
  return random(10000) <= (phraseFrequency * 100);
}

// Select phrase for the active pet, with a default fallback
function selectPhrase(list, petName) {
  for (const pet of list) {
    if (pet[0] === petName) {
      const petPhrases = pet.slice(1);
      if (petPhrases.length === 0) {
        // No custom phrases; fallback to default phrases
        return randomWords(defaultPhrases);
      }
      return randomWords(petPhrases); // Use user-specified phrases
    }
  }
  // If pet not found in list, randomly choose between default message or default phrases
  return Math.random() > 0.5
    ? "You haven’t set any phrases for me yet!"
    : randomWords(defaultPhrases);
}

// Inject the chosen phrase into the page
function insertPhrase(insertPoint, petName, currentPhrase) {
  const phraseHtml = pageType === 1
    ? `<tr><td class="neopetPhrase sf myPhrase" align="center"><b>${petName} says:</b><br><span style="${oldTextStyle || "inherit"}">${currentPhrase}</span></td></tr>`
    : `<div class="gQ_sprite" style="position: absolute; overflow-y:auto; display: block; height:100%; max-height: 66px; width:55%; max-width: 300px; left: 60px; top: 0; padding-right: 22px; background-image: url('http://images.neopets.com/bd2/ui/comment.png'); background-repeat: no-repeat; background-size: contain;" id="p1chat"><p style="${newTextStyle}">${currentPhrase}</p></div>`;

  insertPoint.insertAdjacentHTML(pageType === 1 ? 'beforebegin' : 'afterbegin', phraseHtml);
}

// Main script execution if activation succeeds
function mainScript() {
  if (isClassic) {
    actpetname = document.getElementsByClassName("sidebartable")[0].getElementsByTagName("b")[0].textContent;
    activePetInfo = Array.from(document.querySelectorAll(".sidebarModule > .sidebarTable > tbody > tr"));
    insertionPoint = activePetInfo[2];
  } else if (isBeta) {
    const navLogo = document.querySelector('.nav-logo__2020');
    if (navLogo) {
      navLogo.style.display = 'none';
    }
    actpetname = document.getElementsByClassName("profile-dropdown-link")[0].textContent;
    insertionPoint = document.querySelector(".nav-top__2020 > a");
  }

  const chosenPhrase = selectPhrase(petList, actpetname);
  insertPhrase(insertionPoint, actpetname, chosenPhrase);
}

// Remove existing server-side phrase and activate script if applicable
const existingPhrase = document.getElementsByClassName("neopetPhrase")[0];
if (existingPhrase) existingPhrase.remove();

if (shouldActivate()) mainScript();

