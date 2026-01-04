// ==UserScript==
// @name         NPC Fight Alerts
// @namespace    WildHareTools
// @version      1.0.2
// @description  Watch attack join page for number of players joined. Keep a tab with the attack page open.
// @author       WildHare
// @match        *://*.torn.com/loader.php?sid=attack&user2ID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443021/NPC%20Fight%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/443021/NPC%20Fight%20Alerts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function askForPermission() {
        if (Notification.permission !== 'denied') {
            Notification.requestPermission(()=>{})
        }
    }

    /*
    function askForPermission() {
        if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
                if (permission === "granted") {
                    console.log("Permission Granted");
                }
            })
        }
    }
*/


    function _sendNotification(notification_text) {
        var options = {
              body: ""
          }
        var notification = new Notification(notification_text, options);
        document.getElementById('chat-beep-general').play();
    }

    function notifyMe(notification_text) {

        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }

        // Let's check whether notification permissions have alredy been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            // var notification = new Notification(notification_text, options);
            _sendNotification(notification_text);
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    // var notification = new Notification(notification_text, options);
                    _sendNotification(notification_text);
                }
            });
        }

        // At last, if the user has denied notifications, and you
        // want to be respectful there is no need to bother them any more.
    }

    function processNode(node) {
        let numberJoined = parseInt(node.data, 10);
        let defenderName = document.querySelector('#defender > div > div > .userName___u2JMQ').innerHTML;

        if(numberJoined > 10) {
            notifyMe(`Players Joining Attack on: ${defenderName}`);
        }

    }

    function watchPlayerJoins() {
        let target = document.querySelector('#stats-header > div.titleNumber___J1fui');
        let observer = new MutationObserver(function(mutations) {
            if(!document.querySelector('#joinedwatch_root > form > input:checked')) {
                return;
            }
            mutations.forEach(function(mutation) {
                let node = mutation.target
                processNode(node);
            });
        });
        let config = { attributes: false, childList: false, characterData: true, subtree: true };
        observer.observe(target, config);
    }

    function addForm() {
        var recent_div = document.querySelector('div.titleContainer___LJY0N');
        var newHTML = document.createElement ('div');
        newHTML.innerHTML = '<div id="joinedwatch_root"><form><input type="checkbox" name="Active" value="active" checked>Watch for joins<br></form></div>';
        recent_div.appendChild(newHTML);
    }
    function start() {
        watchPlayerJoins();
        addForm();
    }


(function init(){askForPermission();var counter = document.querySelector('#stats-header > div.titleNumber___J1fui');if (counter) {start();} else {setTimeout(init, 1000);}})()

    var joinedFunctions = window.joined = {};
    joinedFunctions.test = function () {console.log(notifyMe("Hello"));};
    joinedFunctions.processNode = processNode
})();