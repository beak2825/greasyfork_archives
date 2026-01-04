// ==UserScript==
// @name        Private_Notes_4_Games
// @namespace   DanWL
// @description Makes it possible to write notes for games
// @include     https://www.warzone.com/MultiPlayer?GameID=*
// @version     1.0.0.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/377522/Private_Notes_4_Games.user.js
// @updateURL https://update.greasyfork.org/scripts/377522/Private_Notes_4_Games.meta.js
// ==/UserScript==

var GameID = location.href.split(/\?GameID=/i)[1];

function addButton(text, onclick, classes, cssObj) {
    cssObj = cssObj || {position: 'absolute', bottom: '7%', left:'4%', 'z-index': 3}
    let button = document.createElement('button'), btnStyle = button.style
    document.body.appendChild(button)
    button.innerHTML = text
    button.onclick = onclick
    button.className = classes
    Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
    return button
}

function duplicate(source) {
    var original = document.getElementById(source);
    var clone = original.cloneNode(true); // "deep" clone
   clone.id = "duplicater" + ++i; // there can only be one element with an ID
clone.innerHTML = 'CLONED'
    clone.onclick = duplicate; // event handlers are not cloned
    return clone;
}

function createUI()
{
	var multiplayer_dropdown = document.getElementById('#ujs_MenuBtn_btn');
	var GameNotesBtn = clone('ujs_MenuBtn_btn');

	multiplayer_dropdown.appendChild(GameNotesBtn);
}
createUI();
