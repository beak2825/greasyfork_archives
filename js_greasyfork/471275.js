// ==UserScript==
// @name         Geoguessr Duels Notification
// @description  Plays a sound when you find a duel
// @version      1.2
// @author       Tyow#3742
// @match        *://*.geoguessr.com/*
// @license      MIT
// @namespace    https://greasyfork.org/users/1011193
// @downloadURL https://update.greasyfork.org/scripts/471275/Geoguessr%20Duels%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/471275/Geoguessr%20Duels%20Notification.meta.js
// ==/UserScript==

const audio = document.createElement('audio');

/* ############################################################################### */
/* ##### DON'T MODIFY ANYTHING ABOVE HERE UNLESS YOU KNOW WHAT YOU ARE DOING ##### */
/* ############################################################################### */

audio.volume = 0.5; // Can be replaced by any number between 0 and 1

// The below can be replaced by any link that goes directly to an mp3 file, to change the sound played on join
audio.src = 'https://www.dropbox.com/scl/fi/5lzk0a5gsh56l2nrqjy28/mixkit-alert-quick-chime-766.mp3?rlkey=mb2o7bde7zquyxbmxw84nx368&dl=1';

/* ############################################################################### */
/* ##### DON'T MODIFY ANYTHING BELOW HERE UNLESS YOU KNOW WHAT YOU ARE DOING ##### */
/* ############################################################################### */

audio.id = "duelSoundAudioPlayer";
audio.preload = 'auto';


const addAudio = () => {
    document.body.appendChild(audio);
}

const playSound = () => {
    audio.play();
}

/*
* Sound is played when inLobby is true and the game_layout class is visible
* This happens when you move from the lobby to a game
* When the sound is played, it sets inLobby to false, and played to true
* While the game_layout class is visible and played is true, nothing happens
* When game is no longer visible, played is reset to false
* Which brings the values of inLobby and played back to the original values
* Allowing for the next game
*/
let inLobby = false;
let played = false

const checkStatus = () => {
    let lobbyRoot = document.querySelector("[class^='matchmaking-lobby_queueRoot__']");
    let game = document.querySelector("[class^='duels_root__']");
    let finished = document.querySelector("[class^='game-finished-ranked_container__']");
    if (played && game) {
        return
    } else if (played) {
        played = false;
    }
     if (lobbyRoot && !inLobby) {
         console.log("primed");
         inLobby = true;
         played = false;
         addAudio();
         return;
     } else if (game && !finished && inLobby) {
         console.log("playing");
         playSound();
         played = true;
         inLobby = false;
    }
}

// For testing

//document.addEventListener('mousedown', () => {
//    addAudio();
//    playSound();
//});

new MutationObserver(async (mutations) => {
    checkStatus();
}).observe(document.body, { subtree: true, childList: true });