// ==UserScript==
// @name        2048 save game
// @description This script allows to save and restore any previous state of the popular 2048 game.
// @namespace   https://github.com/Lorentz83/
// @include     http://gabrielecirulli.github.io/2048/
// @version     1.0
// @grant       none
// @icon        https://raw.githubusercontent.com/Lorentz83/userscripts/master/2048SaveGame/icon.png
// @license     GPLv2; http://www.gnu.org/licenses/
// @downloadURL https://update.greasyfork.org/scripts/3189/2048%20save%20game.user.js
// @updateURL https://update.greasyfork.org/scripts/3189/2048%20save%20game.meta.js
// ==/UserScript==

var game = {
	stateBox : null,
    isOver : function() {
        var over = document.querySelector('div.game-message.game-over');
        return over !== null;
    },
	state : function() {
		var bk = window.localStorage.getItem('gameStateBK');
		var date = 'none';
		if ( bk !== null) {
			date = JSON.parse(bk).date;
		}
		game.stateBox.textContent = date;
	},
	save : function() {
        if ( game.isOver() ){
            alert('the game is over!');
            return;
        }
		var state = window.localStorage.getItem('gameState');
		var date = new Date();
		date = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();;
		var bk = {
			date : date,
			state : state
		}
		window.localStorage.setItem('gameStateBK', JSON.stringify(bk));
		game.state();
		this.blur();
	} ,
	restore : function() {
		var bk = window.localStorage.getItem('gameStateBK');
		if ( bk !== null) {
			window.localStorage.setItem('gameState', JSON.parse(bk).state);
			window.location.reload();
		}
        this.blur();
	}
}


var gc = document.querySelector('.game-container');
var saveBox = document.createElement('div');
gc.parentNode.insertBefore(saveBox, gc.nextSibling);


var saveBtn = document.createElement('input');
saveBtn.type='button';
saveBtn.value='save';
saveBtn.addEventListener('click', game.save);
saveBox.appendChild(saveBtn);

var restoreBtn = document.createElement('input');
restoreBtn.type='button';
restoreBtn.value='restore';
restoreBtn.addEventListener('click', game.restore);
saveBox.appendChild(restoreBtn);

var span = document.createElement('span');
saveBox.appendChild(span);
span.textContent = 'last saved: ';
game.stateBox = document.createElement('span');
span.appendChild(game.stateBox);

game.state();
