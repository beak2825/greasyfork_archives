// ==UserScript==
// @name        Enhanced Workshop Unsubscriber
// @namespace   Violentmonkey Scripts
// @match       https://steamcommunity.com/id/*/myworkshopfiles*
// @grant       none
// @version     1.1
// @license		MIT
// @author      https://steamcommunity.com/id/Ozzymand
// @description Adds a button to help you unsub from workshop items by page. Useful if you wish to purge multiple pages of cities:skylines mods!
// @downloadURL https://update.greasyfork.org/scripts/439055/Enhanced%20Workshop%20Unsubscriber.user.js
// @updateURL https://update.greasyfork.org/scripts/439055/Enhanced%20Workshop%20Unsubscriber.meta.js
// ==/UserScript==

// MENU STRUCUTRE
//  menu_panel
//    rightSelectionHolder
//      rightDetailsBlock
//        btn_grey_steamui btn_medium

// the function to unsub, currently unused because JS DOESNT LET ME FUCKING APPEND A FUNCTION DECLARED LIKE THIS TO A ONCLICK FUNCTION.
function unsub(){
	let unsub = document.getElementsByClassName('general_btn subscribe  panelSwitch toggled');
	let i = 0;
	while(i < unsub.lenght)
		setTimeout(() => unsub[i].click(), 1000);
		i++;
}

// Appends a button to right side panel. (Where Unsub all is)
function appendButton(description){
  let panel = document.getElementsByClassName('primary_panel');
  let menu_panel = panel[0];
  let newDiv = document.createElement('div');
  newDiv.className = 'menu_panel';
  let newDiv1 = document.createElement('div');
  newDiv1.className = 'rightSectionHolder';
  let newDiv2 = document.createElement('div');
  newDiv2.className = 'rightDetailsBlock';
  let newSpan = document.createElement('span');
  newSpan.className = 'btn_grey_steamui btn_medium';
  newSpan.setAttribute('onClick', `
	let unsub = document.getElementsByClassName('general_btn subscribe  panelSwitch toggled');
	console.log('trying to unsub');
	for(let i = 0; i < 10; i++)
		setTimeout(() => unsub[i].click(), 1000);
					   `);
  let newSpan2 = document.createElement('span');
  newSpan2.innerHTML = `${description}`;
  // some fuckery i dont understand
  newDiv.appendChild(newDiv1);
  newDiv1.appendChild(newDiv2);
  newDiv2.appendChild(newSpan);
  newSpan.appendChild(newSpan2);
  menu_panel.appendChild(newDiv);
};

appendButton('Unsubscribe From Page');