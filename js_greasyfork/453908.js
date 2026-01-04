// ==UserScript==
// @name         TrollChess_HardMode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Pieces periodically get a new theme on chess.com
// @author       SimpleVar
// @match        https://www.chess.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453908/TrollChess_HardMode.user.js
// @updateURL https://update.greasyfork.org/scripts/453908/TrollChess_HardMode.meta.js
// ==/UserScript==

(() => {
const THEMES = ['neo','wood','8_bit','alpha','bases','book','cases','classic','club','condal','game_room','icy_sea',
	'lolz','marble','maya','modern','nature','neo','neo_wood','ocean','space','tournament','vintage','wood',
	'blindfold','bubblegum','dash','glass','gothic','graffiti','light','metal',
	'neon','newspaper','sky','tigers','3d_wood','3d_staunton','3d_plastic','3d_chesskid'];
bazinga()
function randItem(arr) { return arr[(Math.random() * arr.length)|0] }
function bazinga() {
	const pieces = document.querySelectorAll('.piece')
	const p = randItem(pieces)
	if (!p) { setTimeout(bazinga, 200); return }
	p.style.backgroundImage = "url('https://images.chesscomfiles.com/chess-themes/pieces/"+
		randItem(THEMES)+"/150/"+[...p.classList].find(w => w.length === 2)+".png')"
	setTimeout(bazinga, ((Math.random() * Math.random()) * 1000 + 50)|0)
}

})()