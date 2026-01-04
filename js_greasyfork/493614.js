// ==UserScript==
// @name        Vote Reminder
// @description Get a notification when the timer of the opened page expire
// @namespace   Violentmonkey Scripts
// @match       https://serveur-prive.net/*/vote
// @icon        https://serveur-prive.net/img/favicon.png
// @version     2024.05.01
// @author      AFKonCore
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/493614/Vote%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/493614/Vote%20Reminder.meta.js
// ==/UserScript==
window.VoteReminder = {};

window.addEventListener('load', function(){ //wait for page load
    log('Loaded.');
    main();
});

//Language:
window.VoteReminder.Language = 'English'; // 'French' | 'English' | 'Spanish' | 'Portuguese'

switch(VoteReminder.Language){
    case 'French':
        window.VoteReminder.allowNotifNotice = 'Activez les notifications afin d\'être rappelé lorsque que vous pouvez à nouveau voter.';
        window.VoteReminder.allowNotifButton = 'Autoriser';
        window.VoteReminder.runningConfirmation = 'Vote Reminder vous notifiera ✔️';
        window.VoteReminder.notifMessage = 'Vous pouvez voter à nouveau !';
        break;
    case 'Spanish': //Note: Machine TransLated
        window.VoteReminder.allowNotifNotice = 'Active las notificaciones para que le recuerden cuándo puede volver a votar.';
        window.VoteReminder.allowNotifButton = 'Autorizar';
        window.VoteReminder.runningConfirmation = 'Vote Reminder te avisará ✔️';
        window.VoteReminder.notifMessage = '¡Puede volver a votar!';
        break;
    case 'Portuguese': //7-1 never forget. also MTL
        window.VoteReminder.allowNotifNotice = 'Ativar as notificações para ser lembrado de quando pode votar novamente.';
        window.VoteReminder.allowNotifButton = 'Permitir';
        window.VoteReminder.runningConfirmation = 'Vote Reminder notificá-lo-á ✔️';
        window.VoteReminder.notifMessage = 'Pode votar novamente!';
        break;
    case 'English':
    default:
        window.VoteReminder.allowNotifNotice = 'Enable notifications to be reminded when you can vote again.';
        window.VoteReminder.allowNotifButton = 'Allow';
        window.VoteReminder.runningConfirmation = 'Vote Reminder will notify you ✔️';
        window.VoteReminder.notifMessage = 'You can vote again!';
        break;
}

function notificationsAllowed(){
    if(Notification.permission != "granted"){
        //replace the page with a request to allow notifications
        //will reload the page once notifications are allowed
        //will 'brick' if notifications are set to 'blocked'.
        log('Asking for notifications to be allowed.');
        var html = '<div style="margin:10%;">';
        html += '<h3 style="padding-bottom:10px;">Vote Reminder (UserScript):</h3>';
        html += '<p style="padding-bottom:10px;">'+VoteReminder.allowNotifNotice+'</p>';
        html += '<button ';
        html += 'onclick="Notification.requestPermission().then((permission)=>{location.reload();});" ';
        html += 'style="border:2px solid #90EE90; color:#90EE90; padding:2px 5px;"';
        html += '>'+VoteReminder.allowNotifButton+'</button>';
        html += '</div>';
        document.getElementById("header").innerHTML = '';
        document.getElementById("vote").innerHTML = html;
        document.getElementById("footer").innerHTML = '';
        return false;
    }else{
        return true;
    }
}


function main(){
    if(!notificationsAllowed()) return;

    try {
        if(can_vote_date){ //get vote cooldown
                html = '<span style="padding:10px 0; background:green; border-radius:5px; display:inline-block; width:100%; font-size:16px; text-align:center;">'+VoteReminder.runningConfirmation+'</span>'
                document.getElementById("cooldown").querySelector('.counter').insertAdjacentHTML("afterend", html);

                 //Not that useful as the page auto-reloads at the end of the cooldown timer, but it does trigger the notification sooner than otherwise as the website timer is affected by lower cycle speed from being in the background
                    let voteCooldownInMS = Date.parse(new Date(can_vote_date - new Date()))+5000;
                    setTimeout(function(){
                        log('Timer ended.');
                        sendNotification();
                    }, voteCooldownInMS);
                    return log('Notification in '+readableTimeFromMS(voteCooldownInMS)+'.');
                //
            }

    }catch(e){ //no cooldown, look for vote button
        if(document.getElementById("voteBtn") != null){
                log('Found vote button.');
                setTimeout(function(){
                        log('One hour elapsed, refreshing the page.');
                        window.location.reload();
                }, 60*60*1000); //refresh the page in one hour. will send duplicate notifications if AFK :(
            return sendNotification();
        }

        try { //no vote button either, check if error page
            if(document.getElementById("error")){
                setTimeout(function(){
                    window.location.reload();
                }, 5*60*1000); //refresh the page in 5min, to check if the site is working again.
                return log('Error page, probably 405.');
            }

        }catch(e){ //at this point idk
            log('FAILED. \n Something wrong with the website or you encoutered some edge case I haven\'t met yet. Please let me know.');
        }
    }

    setTimeout(function(){
        log('Refreshing the page page every 1 hour'); //lazy way for the script to get the new timer after voting
        window.location.reload();
    }, 1*60*1000);
    return
}


function sendNotification(){

    if(checkCookieExists("VoteReminder_lastNotification") && new Date() - Date.parse(readCookie("VoteReminder_lastNotification")) < 5*60*1000){
        log('Skipped notification as one was already sent recently.');
        return; //do not sent a notification if a saved cookie says we sent one in the last 5min.
    }

	new Notification(VoteReminder.notifMessage, {requireInteraction:"true",icon:"https://serveur-prive.net/img/favicon.png"});
    setCookie("VoteReminder_lastNotification", new Date());
    return log('You can vote again!');
}

//Utils
function readableTimeFromMS(ms){
    let h = Math.floor(ms/1000/60/60);
    let m = Math.floor((ms/1000/60/60 - h)*60);
    let s = Math.floor(((ms/1000/60/60 - h)*60 - m)*60);

    res = '';
    if(h > 0){
        res+= h+'h ';
    }

    if(m > 0){
        if(m < 10 && h > 0) m ='0'+m;
        res+= m+'m ';
    }

    if(s < 10 && (h > 0 || m > 0) ) s ='0'+s;
    res+= s+'s';

    return res;
}

function log(s){
    console.log('Vote Reminder: '+s);
}

//Cookies. yum.
function readCookie(c){ //takes the string "cookieName" and return its value
    return document.cookie.split("; ").find((row) => row.startsWith(c+"="))?.split("=")[1];
}

function setCookie(c, value){
    document.cookie = c+"="+value;
    return;
}

function checkCookieExists(c) {
    if(document.cookie.split(";").some( (item) => item.trim().startsWith(c+"=") )) return true;
    else return false;
}

//TODO: add UI settings for language selection, possibly repeated reminder timer if you fail to vote immediatly
