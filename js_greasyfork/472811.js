// ==UserScript==
// @name         Geoguessr Guess Sound
// @description  Plays a sound when you or your opponent guesses in duels
// @version      1.0.2
// @author       Tyow#3742
// @match        *://*.geoguessr.com/*
// @license      MIT
// @namespace    https://greasyfork.org/users/1011193
// @downloadURL https://update.greasyfork.org/scripts/472811/Geoguessr%20Guess%20Sound.user.js
// @updateURL https://update.greasyfork.org/scripts/472811/Geoguessr%20Guess%20Sound.meta.js
// ==/UserScript==

const audio = document.createElement('audio');

/* ############################################################################### */
/* ##### DON'T MODIFY ANYTHING ABOVE HERE UNLESS YOU KNOW WHAT YOU ARE DOING ##### */
/* ############################################################################### */

audio.volume = 1; // Can be replaced by any number between 0 and 1

// The below can be replaced by any link that goes directly to an mp3 file, to change the sound played on join
audio.src = "https://www.dropbox.com/scl/fi/bsp7jcylwl7b9iuvn80ge/A-Tone-His_Self-1266414414.mp3?rlkey=07w27nj2u6j77nmiwvwpiurin&dl=1"

let userGuess = false; // controls whether you hear the sound when you guess first.
// change 'false' to 'true' to hear a sound when you guess first

/* ############################################################################### */
/* ##### DON'T MODIFY ANYTHING BELOW HERE UNLESS YOU KNOW WHAT YOU ARE DOING ##### */
/* ############################################################################### */

audio.id = "guessSoundAudioPlayer";
audio.preload = 'auto';


const addAudio = () => {
    document.body.appendChild(audio);
}

const playSound = () => {
    audio.play();
}

/*
* When the timer element becomes visible
* If sound has not been played yet
* This will check if the guess was from the user or not
* Then it will check if "userGuess" is true, and play sound accordingly
*/

let played = false;

const checkTeamDuels = () => {
    if (!location.pathname.startsWith("/team-duels")) return false;

    const chatmsgs = document.querySelectorAll("[class^=chat-message_sharedRoot__]");

    for (const m of chatmsgs) {
        let isHidden = false; // Initialize the isHidden flag
        let isSystem = false;

        m.classList.forEach(c => {
            if (c.startsWith("chat-message_systemMessageRoot__")) {
                isSystem = true;
                isHidden = m.classList.contains("chat-message_isHidden__FnZCR"); // Check if the element has the hidden class
            }
        });

        if (isHidden === false && isSystem) {
            return true;
        }
    }

    return false;
}

const checkStatus = () => {
    if (!(location.pathname.startsWith("/duels") || location.pathname.startsWith("/team-duels"))) {
        return;
    }
    let timer = document.querySelector("[class^='clock-timer_timerContainer__']");
    let stress = document.querySelector("[class^='stress-indicator_container__']");
    if ((timer !== null) && !played && (userGuess ? true : (stress !== null || checkTeamDuels()))) {
        addAudio();
        playSound();
        played = true;
    } else if (timer == null) {
        played = false;
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