
// ==UserScript==
// @name         Relics of Avabur
// @namespace    https://avabur.com
// @version      0.0.1
// @description  Audio signals for various aspects of Relics of Avabur
// @author       Bunjo
// @match        https://avabur.com/game
// @match        http://avabur.com/game
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438615/Relics%20of%20Avabur.user.js
// @updateURL https://update.greasyfork.org/scripts/438615/Relics%20of%20Avabur.meta.js
// ==/UserScript==
 
//Settings for event realm alerts
var eventrealmAudioAlert = true;
var eventrealmAlertSoundURL = 'https://soundbible.com/mp3/Air%20Horn-SoundBible.com-964603082.mp3';
var eventrealmDesktopAlert = true;


//Settings for developers or anyone interested in log missing information from the websocket
var showDebugInfo = false;
/*
Do not edit below
*/
var alerting, alert, currAutoAudioPlays = 0, canSendDesktopAlert = true, audioRepeatLock = false, desktopNotificationOnCooldown = false;
const OldSocket = WebSocket;
 
//Browser will ask permission for showing notifications
if (Notification.permission !== "denied") { Notification.requestPermission(); }
 
window.WebSocket = function WebSocket(url, protocols) {
    console.log('Relics of Avabur Socket Monitor Initilized...');
    const socket = new OldSocket(...arguments);
    socket.addEventListener('message', function(event) {
        const message = JSON.parse(event.data);
        switch(message.type){
            case 'playersOnline':
            case 'loadMessages':
            case 'addItemsToUser':
            case 'notification':
            case 'bonus':
                break;
            case 'msg':
                switch(message.data.type){
                    case 'clanGlobal':
                        if(message.data.msg.startsWith('The watchtower')){
                            if(watchtowerAudioAlert){
                                PlaySound(watchtowerAlertSoundURL);
                            }
                            if(watchtowerDesktopAlert){
                                notifyMe('IQRPG Watchtower!', message.data.msg);
                            }
                        }
                        break;
                    case 'eventGlobal':
                        if(message.data.msg.startsWith('A rift to the dark realm has opened')){
                            if(eventAudioAlert){
                                PlaySound(eventrealmAlertSoundURL);
                            }
                            if(eventDesktopAlert){
                                notifyMe('Event Realm!', 'A rift to the event realm has opened!');
                            }
                        }
                        break;
                    case 'pm-to':
                    case 'msg':
                    case 'global':
                    case 'me':
                        break;
                    default:
                        DebugInfo('Unsupported msg type:' + message.data.type);
                        DebugInfo(message);
                        break;
                }
                break;
            case 'eventrealm':
                break;
            default:
                DebugInfo(message);
        }
    });
    return socket;
}
 
function DebugInfo(msg){
    if(showDebugInfo){
        console.log(msg);
    }
}
 
function notifyMe(title, text) {
    if(!desktopNotificationOnCooldown){
        desktopNotificationOnCooldown = true;
        setTimeout(()=>{ desktopNotificationOnCooldown = false; }, 7000);
        var notification;
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }
        else if (Notification.permission === "granted") {
            notification = new Notification(title, { body: text });
        }
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    notification = new Notification(title, { body: text });
                }
            });
        }
        notification.onclick = function () {
            window.focus();
            this.close();
        };
        setTimeout(notification.close.bind(notification), 7000);
    }
}
 
function PlaySound(sound){
    var audio = new Audio(sound);
    audio.play();
}
 
function startAlert() {
    if(!alerting && (currAutoAudioPlays != autoMaxNumberOfAudioAlerts || autoMaxNumberOfAudioAlerts == 0)){
        alerting = true; // we will fire this before the setInterval so it doesn't fire after 2 seconds
        currAutoAudioPlays = currAutoAudioPlays+1;
        PlaySound(autoAlertSoundURL);
        var repeatCalc = autoAlertRepeatInSeconds * 1000;
        alert = setInterval(() => {
            if((currAutoAudioPlays <= autoMaxNumberOfAudioAlerts || autoMaxNumberOfAudioAlerts == 0)){
                currAutoAudioPlays = currAutoAudioPlays+1;
                PlaySound(autoAlertSoundURL);
            }else{
                stopAlert();
            }
        }, 2000);
    }
};
 
function stopAlert(){
    alerting = false;
    clearInterval(alert);
};