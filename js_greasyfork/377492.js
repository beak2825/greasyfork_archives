// Nothing much here ¯\_(ツ)_/¯

// ==UserScript==
// @name         OWOP Chat Notification
// @namespace    https://greasyfork.org/users/170702
// @version      0.2
// @description  See chat with Notification API
// @author       Nurutomo
// @match        *://*.ourworldofpixels.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377492/OWOP%20Chat%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/377492/OWOP%20Chat%20Notification.meta.js
// ==/UserScript==

if (typeof Notification == 'undefined') {
    alert('Please use a modern version of Chrome, Firefox, Opera or Safari.'); // Check if not supported
}

var i = 1; // Count
var last = "";
var on = (localStorage.on != undefined) ? localStorage.on.split('|') : [1, 1]; // Default is 1 (true)

function start() {
    Notification.requestPermission(function(permission) {
        if (permission !== 'granted') return; // Allowed?
        OWOP.chat.local('Notification Access Granted');

        function notif(text) {

            var nickname = text.split(": ")[0]; // Get id and/or nick
            var id = nickname.startsWith("[") ? nickname.split(" ")[0].slice(1, -1) : nickname; // Get id
            id = parseInt(id); // String to interger an id
            var message = text.slice(nickname.length + 2); // Get message

            if (!document.hasFocus() && on[0]) { // Check if window is not focused
                var audio = new Audio('https://ourworldofpixels.com/audio/click.mp3');
                if (on[1]) audio.play(); // Play 'click.mp3'
                var options;
                if (last != message) {
                    i = 1;
                    last = message;
                    options = {
                        icon: 'https://ourworldofpixels.com/img/owop.png', // OWOP Logo
                        body: message, // Text
                    }
                } else {
                    i++;
                    options = {
                        icon: 'https://ourworldofpixels.com/img/owop.png', // OWOP Logo
                        body: `${message} [x${i}]`, // Text
                        renotify: true
                    }
                }

                var notification = new Notification(nickname, options);

                notification.onclick = function() {
                    window.focus(); // Direct on the page on click
                };

                setTimeout(notification.close.bind(notification), 5000); // Close notification after 5 seconds
            }
        }

        OWOP.windowSys.addWindow(new OWOP.windowSys.class.window("Notification Settings", {}, (win) => {

            win.addObj(OWOP.util.mkHTML('button', {
                innerHTML: 'Toggle Notification',
                onclick: function() {
                    on[0] = !on[0]; // Toggle
                    OWOP.chat.local("Chat Notification: " + ((on[0]) ? "On" : "Off")); // Check
                    localStorage.on = on.join('|');
                }
            }));
            win.addObj(OWOP.util.mkHTML('button', {
                innerHTML: 'Toggle Audio',
                onclick: function() {
                    on[1] = !on[1]; // Toggle
                    OWOP.chat.local("Audio Notification: " + ((on[1]) ? "On" : "Off")); // Check
                    localStorage.on = on.join('|');
                }
            }));

            OWOP.chat.recvModifier = function(msg) {
                notif(msg); // Create Notification
                return msg; // <-- Do not remove
            }
        }).move(window.innerWidth - 310, 32)); // Move window
    });
}

var check = setInterval(function() { // Check if OWOP exist
    if (typeof OWOP != 'undefined') {
        setTimeout(() => start(), 3000); // Wait 3 second after OWOP object is defined
        clearInterval(check); // Stop check
    }
})