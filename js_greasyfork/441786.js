// ==UserScript==
// @name  Arras.io Funni Name Generator
// @description A userscript that takes the player's current name input into the player name box, and then edits it to make it funni. The name is then copied to your clipboard.
// @author TheThreeBowlingBulbs
// @match  *://arras.io/*
// @version 1.0.2
// @namespace https://greasyfork.org/users/812261
// @downloadURL https://update.greasyfork.org/scripts/441786/Arrasio%20Funni%20Name%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/441786/Arrasio%20Funni%20Name%20Generator.meta.js
// ==/UserScript==

//Variables that will be used for our name. Edit the extr and spam variables if you want more to the name.
let funniName;
let extr = ['el pro', 'isyourmom', 'cock', 'longjohn', 'hentai'];
let extra = [];
let pickNameRandomizer;
let spam = ['!', '0', '1', '{'];
let randomVal;
let randomVal2;
let capsule;


/*First we take a random extra add on from our extra array as long as the player's name length plus the extra isn't too long. 
If it is, then the player will go without a randomizer.*/
function randomName() {

    /*This will give us our MOST current text value, something that it normally doesn't do. 
    Also helps because it saves me the work of having to make a whole other wanted name input, which would also kinda weird since there already is one.*/
    localStorage.playerNameInput = document.querySelector('input').value;

    funniName = localStorage.playerNameInput;
    for (let n in extr) {
        if (funniName.length + extr[n].length + 1 <= 24) {
            extra.push(extr[n]);
        }
    };

    if (extra.length > 0) {
        pickNameRandomizer = extra[Math.floor(Math.random() * extra.length)];
        funniName = funniName + ' ' + pickNameRandomizer;
    };


    /* If it's less than 24 characters even with the name randomizer (or just without but there's not enough room for a randomizer), add some 
       random spam in from our spam array. */
    if (funniName.length < 24) {
        for (let n = funniName.length; n < 24; n++) {
            funniName = funniName + spam[Math.floor(Math.random() * spam.length)];
        }
    };

    funniName = funniName.toLowerCase();
    /*Our random letter capitalizer. For scrapped purposes in my prototype version I actually had checks on whether the character was a letter or not, 
    however I decided I didn't need to do anything more, or at least for now*/
    for (let num = 0; num < funniName.length; num++) {
        randomVal2 = Math.random();
        capsule = funniName[num];
        if (randomVal2 > 0.5) {
            capsule = capsule.toUpperCase();
            funniName = funniName.slice(0, num) + capsule + funniName.slice(num + 1, funniName.length);
        }
    }
    document.querySelector('input').value = funniName;
};

//Some data for the button.
let nameButton = document.createElement("button");
nameButton.style = "position: fixed; float: left; top: 0; left: 0; visibility: visible;";
nameButton.innerText = 'Funny-ize name';
document.body.appendChild(nameButton);
nameButton.onclick = function() {
    randomName();
};

//By pressing k you can toggle the visibility of the button.
document.addEventListener("keydown", function(event) {
    if (event.code === 'KeyK' && event.target.id !== 'playerNameInput' && event.target.tagName.toLowerCase() !== 'textarea' && event.target.tagName.toLowerCase() !== 'input') {
        nameButton.style.visibility = nameButton.style.visibility == "hidden" ? "visible" : "hidden";
    }
});