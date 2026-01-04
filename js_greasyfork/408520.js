// ==UserScript==
// @name         Alarm for Torn Faction Bankers
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  When faction chat is open, highlights keywords and optionally will play a sound, create a popup, and/or create a notification for incoming messages
// @author       Xeno2
// @match        https://www.torn.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/408520/Alarm%20for%20Torn%20Faction%20Bankers.user.js
// @updateURL https://update.greasyfork.org/scripts/408520/Alarm%20for%20Torn%20Faction%20Bankers.meta.js
// ==/UserScript==
var keywords = ["bank"]; // you can add your name/nickname here, ex: ["bank", "xeno"], case doesn't matter
var usePopup = true; // set to false if you don't want a popup
var useSound = true; // set to false if you don't want a ding
var useNotifications = true; // set to false if you don't want notifications

(function() {
    'use strict';
    var intervalID;
    //GM_setValue('notificationSent', Date.now()); // in case this is not cleared properly
    GM_setValue('audioPlayed', false); // in case this is not cleared properly
    var lastMessageName = GM_getValue('lastMessageName');
    //console.log('lastMessageName: ', lastMessageName);
    var matchingMessages = [];
    var target = document.querySelector('div[class^="_chat-box"][class*="faction"]');
    var observer = new MutationObserver(function(mutations) {
        var found = false;
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach((e) => {
                e.querySelectorAll('div[class^="_chat-box"][class*="faction"] > div > div > div > div[class^="_message"] > span').forEach((n) => {
                    keywords.forEach(function(v) {
                        if (!found && n.innerText.toLowerCase().includes(v)) {
                            found = true;
                            highlight();
                            if (lastMessageName == getMatchingMessages()) // returns the value of the name attribute of the last message - so only new messages continue
                                return;
                            GM_setValue('lastMessageName', lastMessageName = matchingMessages[matchingMessages.length - 1].attributes[1].value);
                            if (useSound && !GM_getValue('audioPlayed')) {
                                GM_setValue("stopAudio", false);
                                x.play();
                                GM_setValue('audioPlayed', true)
                                setTimeout(() => GM_setValue('audioPlayed', false), 2000); // this is for when there are multiple tabs we don't want 5 staggered dings at once
                            }
                            if (usePopup) {
                                GM_setValue("hidePopup", false);
                                popup();
                            }
                            if (useNotifications)
                                sendNotification();
                        }
                    });
                });
            });
        });
    });
    var config = { attributes: true, childList: true, characterData: true, subtree: true };
    observer.observe(target, config);

    function getMatchingMessages() {
        matchingMessages = [];
        $('div[class^="_chat-box"][class*="faction"] > div > div > div > div[class^="_message"] > span').each((i,e) => {
            keywords.forEach((v) => {
                if (e.innerText.toLowerCase().includes(v.toLowerCase()) && !matchingMessages.includes(e.parentNode))
                    matchingMessages.push(e.parentNode);
            });
        });
        return matchingMessages[matchingMessages.length - 1].attributes[1].value; // this attribute is the 'name' of the message which will be checked against lastMessageName
    }

    function sendNotification() {
        // a random timeout is needed because when there are multiple tabs open they will access notificationSent at the EXACT same time resulting in multiple notifications
        var rand = Math.floor(Math.random() * 3000);
        setTimeout(() => {
            //console.log(Date.now(), GM_getValue('notificationSent'), Math.abs(Date.now() - GM_getValue('notificationSent')));
            if (Math.abs(Date.now() - GM_getValue('notificationSent')) < 3100)
                return;
            GM_setValue('notificationSent', Date.now());
            let e = matchingMessages[matchingMessages.length - 1];
            GM_notification({text:e.children[1].innerText, title:e.children[0].innerText});
        }, rand);
    }

    var x = document.createElement("AUDIO");
    x.setAttribute("src","http://soundbible.com/mp3/Air%20Plane%20Ding-SoundBible.com-496729130.mp3");
    document.addEventListener("mousemove", stopAudio, true);
    document.addEventListener("keypress", stopAudio, true);
    function stopAudio() {
        x.pause();
        x.currentTime = 0;
        GM_setValue("stopAudio", true);
    }

    // case insensitive contains
    jQuery.expr[':'].icontains = (a, i, m) => jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;

    function highlight() {
        keywords.forEach((v) => {
            $('div[class^="_chat-box"][class*="faction"] > div > div > div > div[class^="_message"] > span:icontains(' + v + ')').css("background-color", "yellow");
        });
    }

    $("body").append('<div id="popupBox"></div>');
    $("#popupBox").click(hidePopup);
    function hidePopup() {
        GM_setValue("hidePopup", true);
        $("#popupBox").empty().hide();
        clearInterval(intervalID);
    }
    function popup() {
        $("#popupBox").empty()
        var s = '<table>';
        matchingMessages.forEach((e) => {
            let timestamp = e.attributes[1].value.split('-')[0];
            s += '<tr><td class="time" time="' + timestamp + '">' + timeDiff(timestamp) + '</td><td class="name">' + e.children[0].innerText + '</td><td>' + highlightText(e.children[1].innerText) + '</td></tr>';
        });
        s += '</table>';
        $("#popupBox").show().append(s);
        intervalID = setInterval(() => {
            $("#popupBox .time").each((i,e) => {
                e.innerText = timeDiff(e.attributes[1].value);
            });
        }, 1000);
    }

    function timeDiff(t) {
        const date1 = t * 1000;
        const date2 = Date.now();
        t = Math.abs(date1 - date2);
        const h = Math.floor(t / (1000*60*60));
        t = t % (1000*60*60);
        const m = Math.floor(t / (1000*60));
        t = t % (1000*60);
        const s = Math.floor(t / (1000));
        return (h ? h + 'h' : '') + (m ? m + 'm' : '') + s + 's';
    }

    // if one tab closes the popup or turns off the sound these lines will allow another tab to detect it and follow suit
    GM_addValueChangeListener("hidePopup", function() { if (arguments[2]) hidePopup(); });
    GM_addValueChangeListener("stopAudio", function() { if (arguments[2]) stopAudio(); });
    GM_addValueChangeListener("lastMessageName", function() { lastMessageName = arguments[2] });

    function highlightText(s) {
        keywords.forEach((v) => {
            let i = s.toLowerCase().indexOf(v.toLowerCase());
            if (i >= 0)
                s = s.substring(0, i) + "<span class='HL'>" + s.substring(i, i + v.length) + "</span>" + s.substring(i + v.length);
        });
        return s;
    }
    GM_addStyle ( `
#popupBox {
	display: none;
	position: fixed;
	top: 10%;
	left: 10%;
	width: 55%;
	padding: 10px;
	background: white;
	border: 13px solid red;
	border-radius: 10px;
	z-index: 10000;
}
#popupBox table {
	width: 100%;
}
#popupBox td {
	font: 13px arial;
	border-bottom:1px solid red;
	padding: 9px 3px 9px 5px;
}
#popupBox .name {
	font:bold 14px arial;
}
#popupBox .HL {
	background: yellow;
}
` );
})();