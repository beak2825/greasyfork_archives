// ==UserScript==
// @name           Tyranu Evavu Player [T]
// @version        1.0
// @description    Autoplays Tyranu Evavu remembering which cards have been played, based on "Neopets: Tyranu Evavu Smart Player" but more clear and with no dependencies.
// @include        http://www.neopets.com/games/tyranuevavu.phtml*
// @author         Tobi
// @email          gabrieltubiass@gmail.com
// @language       en
// @namespace      https://greasyfork.org/users/208510
// @downloadURL https://update.greasyfork.org/scripts/371670/Tyranu%20Evavu%20Player%20%5BT%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/371670/Tyranu%20Evavu%20Player%20%5BT%5D.meta.js
// ==/UserScript==

var KEY_PLAY = 'playTyranuEvavu';
var KEY_CARDS = 'cards';

addToggleButton();

if (JSON.parse(localStorage.getItem(KEY_PLAY))) {
    setTimeout(execute, 1000 * (1 + Math.random()));
}

function execute() {
    startGame();
    playGame();
    endGame();
}

function addToggleButton() {
    var autoplayIsOn = !!JSON.parse(localStorage.getItem(KEY_PLAY));

    var toggleButton = document.createElement('button');
    toggleButton.id = 'autoplayer';
    toggleButton.style.display = 'block';
    toggleButton.style.margin = '0 auto';
    toggleButton.addEventListener('click', toggleAutoPlay);

    var content = document.getElementsByClassName('content')[0];
    content.prepend(toggleButton);
    updateButtonText();
}

function updateButtonText() {
    var autoplayIsOn = !!JSON.parse(localStorage.getItem(KEY_PLAY));
    document.getElementById('autoplayer').innerHTML = (autoplayIsOn ? 'Stop AP' : 'Start AP');
}

function toggleAutoPlay() {
    var autoplayIsOn = !!JSON.parse(localStorage.getItem(KEY_PLAY));
    localStorage.setItem(KEY_PLAY, !autoplayIsOn);
    updateButtonText();

    if (!autoplayIsOn) {
        execute();
    }
}

function startGame() {
    var form = document.querySelector('form[action="tyranuevavu.phtml"]');

    if (form && form.querySelector('input[name="type"][value="play"]')) {
        var suits = ['hearts', 'clubs', 'diamonds', 'spades'];
        var cards = [];

        for (var i = 2; i <= 14; i++) {
            for (var j = 0, len = suits.length; j < len; j++) {
                cards.push(i + '_' + suits[j]);
            }
        }

        localStorage.setItem('cards', JSON.stringify(cards));
        form.submit();
    }
}

function playGame() {
    var tyranuButton = document.querySelector('a[href^="tyranuevavu.phtml?type=play&action=higher"]');
    var evavuButton = document.querySelector('a[href^="tyranuevavu.phtml?type=play&action=lower"]');

    if (tyranuButton) {
        updateRound();

        var url = document.querySelector('img[src^="http://images.neopets.com/games/cards/"]').src;
        var card = url.match('cards\/(.+)\.gif');

        var cards = JSON.parse(localStorage.getItem(KEY_CARDS));
        var length = cards.length;
        var index = cards.indexOf(card[1]);

        cards.splice(index, 1);
        localStorage.setItem(KEY_CARDS, JSON.stringify(cards));

        if (length > 1) {
            if (index/(length - 1) > 0.5) {
                evavuButton.click();
            } else {
                tyranuButton.click();
            }
        } else {
            alert('You have won the game!');
        }
    }
}

function updateRound() {
    var content = document.getElementsByClassName('content')[0];
    var center = content.getElementsByTagName('center')[0];
    var b = center.getElementsByTagName('b')[0];
    var round = parseInt(b.innerHTML);
    document.title += ' (' + round + ')';
}

function endGame() {
    var form = document.querySelector('form[action="tyranuevavu.phtml"]');

    if (form && form.querySelector('input[name="type"][value="intro"]')) {
        form.submit();
    } else {
        limitReached();
    }
}

function limitReached() {
    var form = document.querySelector('form[action="/gameroom.phtml"]');

    if (form) {
        document.title += ' (Limit Reached)';
    }
}