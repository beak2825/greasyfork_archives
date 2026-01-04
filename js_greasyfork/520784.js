// ==UserScript==
// @name         Sploop.io - Translator
// @namespace    Google Translator
// @version      1
// @description  Translate a text which any language to English whenever you want!
// @author       ilyax
// @match        https://sploop.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @grant        none
// @license      ilyax 2024 copyright.
// @downloadURL https://update.greasyfork.org/scripts/520784/Sploopio%20-%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/520784/Sploopio%20-%20Translator.meta.js
// ==/UserScript==


// Notifications are Forked From Lovey-mod which made by me!
let notifications = [];
function notif(mode, title, description, duration) {
    let style = `
            position: fixed;
            top: ${20 + notifications.length * 60}px;
            left: 10px;
            padding: 10px 20px;
            background-color: #f44336;
            color: white;
            border-radius: 5px;
            border: 10px solid white;
            opacity: 1;
            width: 20%;
            transition: opacity 0.5s ease-in-out;
            z-index: 99999999999999999999999999999999999999999999999999;

        `;
    let notification = document.createElement('div');
    notification.style = style;
    notification.innerHTML = `<h3>${title}</h3><p style="color: white">${description}</p>`;
    document.body.appendChild(notification);
    var notificationsound;
    if (mode == "info") { notificationsound = new Audio('https://cdn.glitch.global/4c998580-5aaf-4a1a-8da3-e0c6b9f241a7/Audio_-_notification3_-_Creator_Store%20(1).mp3') }
    else if (mode == "warning") { notificationsound = new Audio('https://cdn.glitch.global/ca081162-612b-4311-8a7d-7828f21c13e0/confirm.mp3?v=1723982480020') }
    else if (mode == "error") { notificationsound = new Audio('https://cdn.glitch.global/ca081162-612b-4311-8a7d-7828f21c13e0/48643e6a-f6d2-4462-acdc-2b2d2ccb14fa.beep-02.mp3?v=1724795422902') }
    if (mode == "none") return
    notificationsound.volume = 0.3;
    notificationsound.play();
    setTimeout(function() {
        notification.style.opacity = '0';
        setTimeout(function() {
            notification.remove();
            notifications.shift();
            updateNotificationPositions();
        }, 1000);
    }, duration);

    notifications.push(notification);
    updateNotificationPositions();
}

function updateNotificationPositions() {
    notifications.forEach(function(notification, index) {
        notification.style.top = `${20 + index * 135}px`;
    });
}

let handleTranslating = "none"
function translate(text) {
    if (text == null || text.trim() == "") {
        notif("warning", "Translate Case", "The text that was given is empty, please fill it to translate.", 5000);
        handleTranslating = "empty"
        return Promise.resolve(""); // Boş metin kontrolü
    }

    return fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`)
        .then(doors => {
        if (!doors.ok) {
            notif("warning", "Translate Failed", "Sorry but the translation failed due fetch. please report this to ilyax!", 5000);
            handleTranslating = "error"
        }
        return doors.json();
    })
        .then(translated => {
        const ae86 = translated[0][0][0];
        return ae86;
    })
}

document.addEventListener("keydown", event => {
    if (event.code === "Numpad1") {
        notif("info", "Translate Case", "Trying to translate, Wait a second.", 1000);
        let chatmsg = document.getElementById("chat").value;
        translate(chatmsg).then(translatedText => {
            if (handleTranslating != "empty" || handleTranslating != "error") { // wow!!!!!
                notif("info", "Translate Case", "Translated Succesfully!", 1000);
                document.getElementById("chat").value = translatedText;
            }
        });
    }
});


