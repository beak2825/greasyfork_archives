// ==UserScript==
// @name         IQRPG+
// @namespace    https://www.iqrpg.com/
// @version      0.1.7
// @description  Audio signals for various aspects of IQRPG
// @Author       Bunjo & vifs
// @match        http://iqrpg.com/game.php
// @match        https://iqrpg.com/game.php
// @match        http://www.iqrpg.com/game.php
// @match        https://www.iqrpg.com/game.php
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398028/IQRPG%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/398028/IQRPG%2B.meta.js
// ==/UserScript==

/*
    Shout out to Xortrox & euphone & Karubo for their contributions to the script.
*/

/*
    Edit the settings below. If you have questions, whisper Bunjo, if Bunjo does not answer, seek help in the help channel, someone else might know!
    I will try add comments to the settings from peoples questions, and hopefully I'll get the UI setup for this so we don't have to edit inline
	
	Whisper vifs for questions on newer features~~
*/

//default volume level 0-min 1-max
var masterAudioLevel = .3;
//AUTO
var autoAudioAlert = true;
var autoAlertSoundURL = 'https://www.pacdv.com/sounds/mechanical_sound_effects/gun-reload-1.wav';
var autoAlertRepeatInSeconds = 2;
var autoAlertNumber = 10;
var autoMaxNumberOfAudioAlerts = 2; //This setting applies to both autos and dungeons, if set to 0 it won't stop alerting till you restart autos.
var autoDesktopAlert = false;
//DUNGEON
var dungeonAudioAlert = true;
var dungeonDesktopAlert = false;
//BOSS
var bossAudioAlert = true;
var bossAlertSoundURL = 'https://www.pacdv.com/sounds/interface_sound_effects/sound8.mp3';
var bossDefeatedSoundURL = 'https://ia801306.us.archive.org/32/items/FF7ACVictoryFanfareRingtoneperfectedMp3/FF7%20AC%20Victory%20Fanfare%20Ringtone%20%28perfected%20mp3%29.mp3';
var bossDesktopAlert = false;
//EVENT
var eventDesktopAlert = false;
var eventAlertSoundURL = 'https://www.pacdv.com/sounds/interface_sound_effects/sound8.mp3';
var eventAlert_Woodcutting = true;
var eventAlert_Quarrying = true;
var eventAlert_Mining = true;
var eventAudioAlert = true;
var eventAudioAlertFinished = false;
//WHISPER
var whisperAudioAlert = true;
var whisperAlertSoundURL = 'https://www.pacdv.com/sounds/mechanical_sound_effects/spring_1.wav';
var whisperAlertOnlyWhenTabIsInactive = false;
var whisperDesktopAlert = false;
//LAND
var landAudioAlert = true;
var landAlertSoundURL = 'https://www.pacdv.com/sounds/mechanical_sound_effects/coins_4.wav';
//MASERTY
var masteryAudioAlert = true;
var masteryEveryXLevels = 50;
var masteryAlertSoundURL = 'https://ia801306.us.archive.org/32/items/FF7ACVictoryFanfareRingtoneperfectedMp3/FF7%20AC%20Victory%20Fanfare%20Ringtone%20%28perfected%20mp3%29.mp3';
//EFFECT
var effectAudioAlert = true;
var effectAutoLeft = 5;
var effectAlertSoundURL = 'https://www.pacdv.com/sounds/mechanical_sound_effects/hammer-1.mp3';
//CLAN
var watchtowerAudioAlert = false;
var watchtowerAlertSoundURL = 'https://www.pacdv.com/sounds/interface_sound_effects/sound8.mp3';
var watchtowerDesktopAlert = false;
//BONUS EXP
var bonusExpAudioAlert = true;
var bonusExpAlertSoundURL = 'https://www.pacdv.com/sounds/miscellaneous_sounds/magic-wand-1.wav';
//Settings for developers or anyone interested in log missing information from the websocket
var showDebugInfo = false;
/*
Do not edit below
*/
var alerting, alert, currAutoAudioPlays = 0, canSendDesktopAlert = true, audioRepeatLock = false, desktopNotificationOnCooldown = false, bonusExp = false;
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
                                PlaySound(bossAlertSoundURL, .1);
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

function PlaySound(sound, volume = null){
    var audio = new Audio(sound);
	if(volume == null) {
		volume = masterAudioLevel;
	}
    audio.volume = volume;
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
	var landObserver 		= new MutationObserver (landHandler);
	var masteryObserver		= new MutationObserver (masteryHandler);
	//var effectObserver		= new MutationObserver (effectHandler);
    var obsConfig           = { childList: true, characterData: true, attributes: true, subtree: true };


    function setupObserves(){
        myObserver.observe($("div.action-timer__text")[0], obsConfig);
        myObserver.observe($("head title")[0], obsConfig);
		if(landAudioAlert) {
			landObserver.observe($(".main-section")[2], obsConfig);
		}
		if(masteryAudioAlert) {
			var masteries = $(".clickable > .flex.space-between > .green-text");
			masteries.each( function(mastery) {
				masteryObserver.observe(masteries[mastery], obsConfig);
			});
		}
    }

    function mutationHandler (mutationRecords) {
		if(effectAudioAlert) {
			effectHandler();
		}
		if(bonusExpAudioAlert) {
			bonusExpHandler();
		}
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

	function landHandler(mutationRecords) {
        mutationRecords.forEach ( function (mutation) {
			if(mutation.type == 'characterData'){
				if(mutation.target.data == '00:00') {
					PlaySound(landAlertSoundURL);
				}
			}
		});
	}

	function masteryHandler(mutationRecords) {
        mutationRecords.forEach ( function (mutation) {
			if(mutation.type == 'characterData') {
				if(mutation.target.data % masteryEveryXLevels == 0) {
					PlaySound(masteryAlertSoundURL);
				}
			}
		});
	}

	function effectHandler(){
		var effects = $(".main-section__body > div > .flex.space-between > .green-text");
		effects.each(function(effect) {
			var effectLeft = $(effects[effect])[0].innerHTML;
			if(effectLeft == effectAutoLeft) {
				PlaySound(effectAlertSoundURL);
			}
		});
	}
	
	function bonusExpHandler(){
		var bonusExpSpan = $('.main-section__body> div > div > div > span.exp-text');
		if(bonusExpSpan != null && bonusExpSpan.length != 0) {
			if(!bonusExp) {
				bonusExp = true;
				PlaySound(bonusExpAlertSoundURL);
			}
		} else {
			if(bonusExp) {
				bonusExp = false;
			}
		}
	}

    setTimeout(function() {
        setupObserves();
    }, 500);
});

document.onkeyup = function(e) {
	if(e.altKey == true) {
		var index = -1;
		var channels = $('.chat-channels').children();
		if(isNaN(e.key)) {
			var direction = null;
			if(e.which == 38) {
				direction = true;
			} else if(e.which == 40) {
				direction = false;
			}
			if(direction != null) {
				var unread = false;
				if(e.shiftKey == true) {
					unread = true;
				}
				if(unread) {
					var channels = $('.chat-channels').children('.new-message, .active-channel');
				}
				index = channels.index($('.active-channel'));
				if(direction) {
					index--;
				} else {
					index++;
				}
			}
		} else {
			if(e.ctrlKey == true) {
				index = -1 + + e.key;
			}
		}
		if(index >= 0 && index <= 5) {
			channels[index].click();
			$('#chatInput').focus();
		}
	}
}
