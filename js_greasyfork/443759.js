// ==UserScript==
// @name        Quin Anti-Stall
// @namespace   Violentmonkey Scripts
// @match       http*://www.twitch.tv/*
// @grant       GM_notification
// @version     0.9.1
// @author      i made this :)
// @license     MIT
// @description No more 4 hours of the mind numbing drivel just to be butt bois'd after less than 1 hour of gaming. Just open the steam,switch tab/monitor and you will be alerted/unmuted when the stalling has ended. 
// @icon        https://cdn.betterttv.net/emote/5f77d7eaccde1f4a870c06c6/3x
// @downloadURL https://update.greasyfork.org/scripts/443759/Quin%20Anti-Stall.user.js
// @updateURL https://update.greasyfork.org/scripts/443759/Quin%20Anti-Stall.meta.js
// ==/UserScript==


//SETTINGS-------true = enabled---false = disabled---------------------------------------------------------------//

const ALERTS = true;                // Displays a notification when the streamer starts playing a game.
const AUTO_MUTE = false;            // Automatically mutes the stream when the streamer is stalling.
const AUTO_UNMUTE = true;           // Automatically unmutes the stream when the streamer starts playing a game.

// Hatewatch options, will affect viewer count.
const AUTO_PAUSE = true;            // Automatically pauses the stream while the streamer is stalling.
const AUTO_UNPAUSE = true;          // Automatically unpauses the stream when the streamer starts playing a game. Inconsistent when the tab is not visible.
//---------------------------------------------------------------------------------------------------------------//

const STALLING = "Just Chatting"; //TODO add list of stalling catergories

let stream_time = null; //currently unused
let live = null;        //acts as init detection bool
let current_game = null;
let streamer = null;

const callback = function (mutationsList) { //TODO clean this up
    if (!document.getElementsByClassName("channel-info-content")[0]) { //navigated away from stream pages
        observer.disconnect();
        setTimeout(start_observer, 100);
    }
    for (mutation in mutationsList) {
        let game_node = document.querySelectorAll("[data-a-target='stream-game-link']")[0];
        if (game_node) {
            if (document.getElementsByClassName("tw-channel-status-text-indicator")[0]) { //content has finished loading
                if (document.getElementsByClassName("tw-channel-status-text-indicator")[0].innerText == "LIVE") {

                    let new_streamer = document.getElementsByClassName("channel-info-content")[0].getElementsByClassName("tw-title")[0].innerText;
                    let new_game = game_node.innerText;
                    live = true;

                    if (new_streamer != streamer && streamer != null) {//switched streamer after loading
                        current_game = null;
                        if (AUTO_PAUSE&&new_game==STALLING) { // twitch likes to unpause you when the new stream loads
                            for(i = 1;i<11;i++){
                                setTimeout(function() {player_pause(true);},i*100); //need to find a way to wait for twitch to autoplay
                            }
                        }
                    }


                    if (current_game != new_game) { //game changed
                        if (new_game != STALLING && current_game == STALLING) { //stopped stalling  //TODO add new game to alert
                            if (ALERTS) {
                                if (!document.hasFocus()) {
                                    if (new_streamer == "Quin69") {
                                        alert("Clown69 has stopped stalling.");
                                        GM_notification("Clown69 has stopped stalling.", "Allo", "https://cdn.frankerfacez.com/emoticon/243789/4", null);
                                    } else {
                                        alert(streamer + " has stopped stalling.");
                                        GM_notification(streamer + " has stopped stalling.", "Allo", "https://cdn.frankerfacez.com/emoticon/243789/4", null);
                                    }

                                }
                            }
                            if (AUTO_UNMUTE) {
                                player_mute(false);
                            }
                            if (AUTO_UNPAUSE) {
                                if(!document.hasFocus()){
                                    location.reload();
                                }
                                else{
                                    player_pause(false);
                                }

                            }
                        } else if (new_game == STALLING && current_game != STALLING) { //stalling
                            if (AUTO_MUTE) {
                                player_mute(true);
                            }
                            if (AUTO_PAUSE) {
                                player_pause(true);
                            }
                        }
                        current_game = new_game;
                        let time_node = document.getElementsByClassName("live-time")[0];
                        if (!time_node) {
                            time_node = document.querySelectorAll("[data-key='uptime']")[0];
                        }
                        stream_time = time_node.innerText;
                        streamer = new_streamer;
                        console.group("QAS");
                        console.log("STREAMER: " + streamer);
                        console.log("CURRENT GAME: " + current_game);
                        console.log("LIVE: " + (document.getElementsByClassName("tw-channel-status-text-indicator")[0].innerText == "LIVE" ? "YES" : "NO"));
                        console.log("STREAM TIME: " + stream_time);
                        console.groupEnd();
                        break;
                    }
                } else {
                    if (live == true) { //stream ended
                        if (parseInt(stream_time.split(":")[0]) < 4) { //stream over in less than 4 hours
                            //add flavour alert "surely the vibe isnt off already"
                        } else {
                            //add flavour alert "the circus has closed"
                        }
                        live = false;
                    }
                }
            }
        }
    }
};
function player_mute(status) {
    const mute_node = document.querySelectorAll("[data-a-target='player-mute-unmute-button']")[0];
    const mute_status = (mute_node.ariaLabel == "Mute (m)" ? true : false)
    if (mute_status == status) {
        mute_node.click();
    }
}
function player_pause(status) {
    const play_node = document.querySelectorAll("[data-a-target='player-play-pause-button']")[0];
    const play_status = (play_node.attributes.getNamedItem("data-a-player-state").value == "playing" ? true : false);
    if (play_status == status) {
        play_node.click();
    }
}
function start_observer() {
    if (document.getElementsByClassName("channel-info-content")[0]) {
        observer.observe(document.getElementsByClassName("channel-info-content")[0], {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        })
    } else { //manages the user starting on non streamer pages, could not find an event to listen for url changes
        setTimeout(start_observer, 100);
    }
}
const observer = new MutationObserver(callback);
start_observer();