// ==UserScript==
// @name         Fast Down ATTACK Gobattle.io
// @namespace    http://tampermonkey.net/
// @version      1
// @description  When you enter the game press Q
// @author       You
// @match        https://gobattle.io/#!  https://alpha.gobattle.io/#!
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gobattle.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464251/Fast%20Down%20ATTACK%20Gobattleio.user.js
// @updateURL https://update.greasyfork.org/scripts/464251/Fast%20Down%20ATTACK%20Gobattleio.meta.js
// ==/UserScript==
 /*
This script is for educational purposes and written by Kuwazy.
It does not allow you to do the fastest attacks but aims to show you how to automate tasks on gobattle and emulate keyboard keys and execute attacks automatically.
Discord: Kuwazy#8194
*/

const aerial_down_attack_button = "q"; // The key to be pressed to execute the attack.
const attack_frequency = 700 // The attack frequency (in milliseconds).

const textfield = document.getElementById("shinobit-textfield"); // The chat input field (the place where you write the message you want to send).

/*
It will serve us to have a reference to this element that allows us to know if the user writes a message in the chat.
We want to prevent our attack from triggering when the user writes a message in the in-game messenger.
You will frequently press the attack button while writing a message. it is to avoid this jenr of conflict. :D
*/


let interval_id = null; // The identifier of the interval call. Will be developed below.

// When the user presses a button then...
document.addEventListener("keydown", event => {
    // ...we execute the code between the brackets.

    /* In this condition, we check if:
        The "aerial_down_attack_button" button is the pressed button
                                    AND
        We are not already performing the action.
                                    AND
        That the user does not write in the chat input field.
    */

    // If the condition is validated then...
    if (event.key === aerial_down_attack_button && !interval_id && textfield !== document.activeElement){
        // ...we execute the code between the brackets.

        // We execute a first attack to start. For this, we just need to call the "aerial_down_attack" function that we defined below in the code.
        aerial_down_attack();

        // Then we ask the script to execute this attack function several times using the "setInterval" method.
        // We also give the frequency at which we want this function to be called.
        // We also store the id of the setintervale call in a variable. It will be useful for us to cancel the set call interval later.
        interval_id = setInterval(aerial_down_attack, attack_frequency);
    }
});

// When the user releases a previously pressed button then...
document.addEventListener("keyup", event => {
    // ...we execute the code between the brackets.

    /* In this condition, we check if:
        The "aerial_down_attack_button" button is the pressed button
                                    AND
        That the user does not write in the chat input field.
    */

    // If the condition is validated then...
    if (event.key === aerial_down_attack_button && textfield !== document.activeElement){
        // ...we execute the code between the brackets.

        // We want to stop attacking. to do this, simply cancel the call to "setInterval".
        clearInterval(interval_id); // It is given the identifier of the "setInterval" to be cancelled.
        interval_id = null; // We return this variable to null to support the fact that we are no longer performing any action.
    }
});


// When this function is called, perform the "aerial_down_attack" attack.
function aerial_down_attack(){
    // This function itself includes the functions to be executed to perform the attack:

    jump();

    // X2
    temporarily_crouched();
    temporarily_crouched();

    sword_attack();
}


function jump(){
    //
    //   /|\                 _
    //    |        OR      | Z |
    //    |                  -
    //

    // We define the key to emulate.
    const event = {
        "key": "ArrowUp",
        "keyCode": 38,
        "which": 38,
        "code": "ArrowUp",
        "location": 0,
        "altKey": false,
        "ctrlKey": false,
        "metaKey": false,
        "shiftKey": false,
        "repeat": false
    };
    // We press the button.
    document.dispatchEvent(new KeyboardEvent("keydown", event));
    // Then we stop pressing.
    document.dispatchEvent(new KeyboardEvent("keyup", event));
}

function temporarily_crouched(){
    //
    //    |                  _
    //    |        OR      | S |
    //   \|/                 -
    //

    const event = {
        "key": "ArrowDown",
        "keyCode": 40,
        "which": 40,
        "code": "ArrowDown",
        "location": 0,
        "altKey": false,
        "ctrlKey": false,
        "metaKey": false,
        "shiftKey": false,
        "repeat": false
    };
    // We press the button.
    document.dispatchEvent(new KeyboardEvent("keydown", event));
    // Then we stop pressing.
    document.dispatchEvent(new KeyboardEvent("keyup", event));
}


function sword_attack(){
    //
    //     _
    //   | V |
    //     -
    //

    // We define the key to emulate.
    const event = {
        "key": "v",
        "keyCode": 86,
        "which": 86,
        "code": "KeyV",
        "location": 0,
        "altKey": false,
        "ctrlKey": false,
        "metaKey": false,
        "shiftKey": false,
        "repeat": false
    };
    // We press the button.
    document.dispatchEvent(new KeyboardEvent("keydown", event));
    // Then we stop pressing.
    document.dispatchEvent(new KeyboardEvent("keyup", event));
}