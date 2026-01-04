// ==UserScript==
// @name Idle Quest RPG
// @namespace https://www.iqrpg.com/game.html
// @version 0.0.7
// @description Audio for Idle Quest RPG
// @author Grogu2484
// @match http://iqrpg.com/game.html
// @match https://iqrpg.com/game.html
// @match http://www.iqrpg.com/game.html
// @match https://www.iqrpg.com/game.html
// @match http://test.iqrpg.com/game.html
// @match https://test.iqrpg.com/game.html
// @require http://code.jquery.com/jquery-latest.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/463045/Idle%20Quest%20RPG.user.js
// @updateURL https://update.greasyfork.org/scripts/463045/Idle%20Quest%20RPG.meta.js
// ==/UserScript==

//default volume level 0-min 1-max

var masterAudioLevel = 1;

//Setting for auto alerts
var autoAudioAlert = true;
var autoAlertSoundURL = 'https://soundbible.com/mp3/Robot_blip_2-Marianne_Gagnon-299056732.mp3';
var autoAlertRepeatInSeconds = 2;
var autoAlertNumber = 2580;
var autoMaxNumberOfAudioAlerts = 0; //This setting applies to both autos and dungeons, if set to 0 it won't stop alerting till you restart autos.
var autoDesktopAlert = true;
//Settings for dungeon alerts
var dungeonAudioAlert = true;
var dungeonDesktopAlert = true;
//Settings for boss alerts
var bossAudioAlert = true;
var bossAlertSoundURL = 'https://soundbible.com/mp3/Air%20Horn-SoundBible.com-964603082.mp3';
var bossDefeatedSoundURL = 'https://ia801306.us.archive.org/32/items/FF7ACVictoryFanfareRingtoneperfectedMp3/FF7%20AC%20Victory%20Fanfare%20Ringtone%20%28perfected%20mp3%29.mp3';
var bossDesktopAlert = true;
//Settings for events
var eventDesktopAlert = true;
var eventAlert_Woodcutting = true;
var eventAlert_Quarrying = true;
var eventAlert_Mining = true;
var eventAudioAlert = true;
var eventAudioAlertFinished = false;
var eventAlertSoundURL = 'https://soundbible.com/mp3/sms-alert-2-daniel_simon.mp3';
//Settings for whispers
var whisperAudioAlert = true;
var whisperAlertOnlyWhenTabIsInactive = true;
var whisperAlertSoundURL = 'https://soundbible.com/mp3/service-bell_daniel_simion.mp3';
var whisperDesktopAlert = false;
//Settings for clans
var watchtowerAudioAlert = true;
var watchtowerAlertSoundURL = 'https://soundbible.com/mp3/sms-alert-1-daniel_simon.mp3';
var watchtowerDesktopAlert = true;
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
    console.log('IQRPG+ Socket Monitor Initilized...');
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
            case 'event':
                DebugInfo('Event Data:');
                DebugInfo(message);
                if(message.data.type == "woodcutting" && eventAlert_Woodcutting){
                    if(eventAudioAlert){
                        PlaySound(eventAlertSoundURL);
                    }
                    if(eventDesktopAlert){
                        notifyMe('IQRPG Event!', 'Woodcutting event has started!');
                    }
                    setTimeout(function(){
                        if(eventAudioAlertFinished){
                            PlaySound(eventAlertSoundURL);
                        }
                        if(eventDesktopAlert){
                            notifyMe('IQRPG Event Finished!', 'Woodcutting event has End!');
                        }
                    }, message.data.timeRemaining*10);
                } else if(message.data.type == "mining" && eventAlert_Mining){
                    if(eventAudioAlert){
                        PlaySound(eventAlertSoundURL);
                    }
                    if(eventDesktopAlert){
                        notifyMe('IQRPG Event!', 'Mining event has started!');
                    }
                    setTimeout(function(){
                        if(eventAudioAlertFinished){
                            PlaySound(eventAlertSoundURL);
                        }
                        if(eventDesktopAlert){
                            notifyMe('IQRPG Event Finished!', 'Mining event has End!');
                        }
                    }, message.data.timeRemaining*10);
                } else if(message.data.type == "quarrying" && eventAlert_Quarrying){
                    if(eventAudioAlert){
                        PlaySound(eventAlertSoundURL);
                    }
                    if(eventDesktopAlert){
                        notifyMe('IQRPG Event Started!', 'Quarrying event has started!');
                    }
                    setTimeout(function(){
                        if(eventAudioAlertFinished){
                            PlaySound(eventAlertSoundURL);
                        }
                        if(eventDesktopAlert){
                            notifyMe('IQRPG Event Finished!', 'Quarrying event has End!');
                        }
                    }, message.data.timeRemaining*10);
                } else {
                    DebugInfo('Unsupported Event - ' + message.data.type);
                }
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
                    case 'pm-from':
                        if (whisperAlertOnlyWhenTabIsInactive) {
                            if(document.hidden){
                                if(whisperAudioAlert){
                                    PlaySound(whisperAlertSoundURL);
                                }
                                if(whisperDesktopAlert){
                                    notifyMe('IQRPG Whisper!', message.data.username + ': '+ message.data.msg);
                                }
                            }
                        }else{
                            if(whisperAudioAlert){
                                PlaySound(whisperAlertSoundURL);
                            }
                            if(whisperDesktopAlert){
                                if(canSendDesktopAlert){
                                    notifyMe('IQRPG Whisper!', message.data.username + ': '+ message.data.msg);
                                    canSendDesktopAlert = false;
                                    setTimeout(()=>{ canSendDesktopAlert = true; }, 10000);
                                }
                            }
                        }
                        break;
                    case 'eventGlobal':
                        if(message.data.msg.startsWith('A rift to the dark realm has opened')){
                            if(eventAudioAlert){
                                PlaySound(bossAlertSoundURL);
                            }
                            if(eventDesktopAlert){
                                notifyMe('IQRPG Boss!', 'A rift to the dark realm has opened!');
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
            case 'boss':
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
}

$('body').on('click', "button:contains('Start Dungeon')", function(){
    stopAlert();
});

$(document).ready(function(){
    var MutationObserver    = window.MutationObserver || window.WebKitMutationObserver;
    var myObserver          = new MutationObserver (mutationHandler);
    var obsConfig           = { childList: true, characterData: true, attributes: true, subtree: true };

    function setupObserves(){
        myObserver.observe($("div.action-timer__text")[0], obsConfig);
        myObserver.observe($("head title")[0], obsConfig);
    }

    function mutationHandler (mutationRecords) {
        mutationRecords.forEach ( function (mutation) {
            if(mutation.type == "childList"){
                if(mutation.target.nodeName == "TITLE"){
                    switch(mutation.target.innerHTML){
                        case 'Dungeon Complete Idle Quest RPG':
                            if(dungeonDesktopAlert){
                                notifyMe('IQRPG Dungeon Alert!', 'You have completed your dungeon!');
                            }
                            if(!alerting && dungeonAudioAlert && (currAutoAudioPlays <= autoMaxNumberOfAudioAlerts || autoMaxNumberOfAudioAlerts == 0)){
                                startAlert();
                            }
                            break;
                        case 'Clan Boss Defeated Idle Quest RPG':
                            if(watchtowerDesktopAlert){
                                notifyMe('IQRPG Watchtower Alert!', 'Your clan has defeated the boss!');
                            }
                            if(watchtowerAudioAlert && (currAutoAudioPlays <= autoMaxNumberOfAudioAlerts || autoMaxNumberOfAudioAlerts == 0)){
                                PlaySound(bossDefeatedSoundURL);
                            }
                            break;
                        case 'All Mobs Defeated Idle Quest RPG':
                            if(watchtowerDesktopAlert){
                                notifyMe('IQRPG Watchtower Alert!', 'All mobs have been defeated!');
                            }
                            if(!alerting && watchtowerAudioAlert && (currAutoAudioPlays <= autoMaxNumberOfAudioAlerts || autoMaxNumberOfAudioAlerts == 0)){
                                startAlert();
                            }
                            break;
                        case 'Boss Defeated Idle Quest RPG':
                            if(bossDesktopAlert){
                                notifyMe('IQRPG Boss Alert!', 'The boss has been defeated!');
                            }
                            if(bossAudioAlert){
                                PlaySound(bossDefeatedSoundURL);
                            }
                            break;
                        case 'ALERT':
                            break;
                        default:
                            stopAlert();
                            currAutoAudioPlays = 0;
                    }
                }
            }
            if(mutation.type == "characterData"){
                var autosRemaining = parseInt(mutation.target.data.replace('Autos Remaining: ', ''));
                if((autosRemaining <= autoAlertNumber && autoAlertNumber)){
                    if(autosRemaining == autoAlertNumber && autoDesktopAlert){
                        notifyMe('IQRPG Auto Alert!', 'You have ' + autoAlertNumber + ' remaining!');
                    }
                    if(!alerting && (currAutoAudioPlays <= autoMaxNumberOfAudioAlerts || autoMaxNumberOfAudioAlerts == 0)){
                        startAlert();
                    }
                } else {
                    stopAlert();
                    currAutoAudioPlays = 0;
                }
            }
        } );
    }

    setTimeout(function(){
        setupObserves();
    }, 500);
});