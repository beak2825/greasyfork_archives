// ==UserScript==
// @name        Portraitify - Twitchls
// @namespace   lazi3b0y
// @description Twitchls portait resolution fix
// @include     *twitchls.com*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27162/Portraitify%20-%20Twitchls.user.js
// @updateURL https://update.greasyfork.org/scripts/27162/Portraitify%20-%20Twitchls.meta.js
// ==/UserScript==

var target = document.getElementsByClassName('main-container')[0];

console.log('Portait script: Creating observer.');
var observer = new MutationObserver(function () {
    console.log('Portait script: Mutation observed.');
    portaitify();
});

var config = {
    attributes: true,
    childList: true,
    characterData: true
};

observer.observe(target, config);
console.log('Portait script: Observer initialized.');

console.log('Portait script: Checking for objects to modify (In case you accessed the stream through a direct link).');
portaitify();

window.onresize = function () {
    console.log('Portait script: Window resize occurred.');
    portaitify();
}
console.log('Portait script: Listening for window resize events.');

function portaitify() {
    if (window.innerWidth < window.innerHeight) {
        console.log('Portait script: Portrait mode.');
        var player = document.getElementById('player');
        if (player !== undefined && player !== null) {
            console.log('Portait script: Modifying stream player.');
            player.style.float = 'none';
            player.style.bottom = 'auto';
            player.style.resize = 'none';
            player.style.height = '40vh';
            player.style.width = '100vw';
        }

        var chat = document.getElementById('chat');
        if (chat !== undefined && chat !== null) {
            console.log('Portait script: Modifying chat.');
            chat.style.left = 'auto';
            chat.style.right = 'auto';
            chat.style.float = 'none';
            chat.style.top = '40vh';
            chat.style.width = '100vw';
            chat.style.display = 'block';
        }

        var dragbar = document.getElementById('dragbar');
        if (dragbar !== undefined && dragbar !== null) {
            console.log('Portait script: Removing the chat dragbar.');
            dragbar.style.display = 'none';
        }

        var buttons = document.getElementById('buttons');
        if (buttons !== undefined && buttons !== null) {
            console.log('Portait script: Removing the top-right chat buttons.');
            buttons.style.display = 'none';
        }
    } else {
        console.log('Portait script: Landscape mode');
        revertChanges();
    }
}

function revertChanges() {
    var player = document.getElementById('player');
    if (player !== undefined && player !== null) {
        console.log('Portait script: Reverting stream player modifications.');
        player.removeAttribute('style');
    }

    var chat = document.getElementById('chat');
    if (chat !== undefined && chat !== null) {
        console.log('Portait script: Reverting chat modifications.');
        chat.removeAttribute('style');
    }

    var dragbar = document.getElementById('dragbar');
    if (dragbar !== undefined && dragbar !== null) {
        console.log('Portait script: Reverting chat dragbar modifications.');
        dragbar.removeAttribute('style');
    }

    var buttons = document.getElementById('buttons');
    if (buttons !== undefined && buttons !== null) {
        console.log('Portait script: Reverting top-right chat buttons modifications.');
        buttons.removeAttribute('style');
    }
}