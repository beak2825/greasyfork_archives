// ==UserScript==
// @namespace    Xortrox/UserScripts/Notifications
// @name         UserScript Notification Framework
// @version      0.3
// @description  This script is intended to work with @require only. Exposes an instance of the Notifications class of this script to window.UserScript.Notifications
// @author       Xortrox, Puls3
// @match        *
// @esversion:   6
// @license MIT
// ==/UserScript==

class Notifications {

    /** Should always be awaited before you use notifications. */
    askPermission() {
        return this.hasPermission();
    }

    notify(title, text, icon) {
        this.hasPermission().then(function (result) {
            if (result === true) {
                let popup = new window.Notification(title, { body: text, icon: icon });
                popup.onclick = function () {
                    window.focus();
                }
            }
        });
    }

    hasPermission() {
        return new Promise(function (resolve) {
            if ('Notification' in window) {
                if (window.Notification.permission === 'granted') {
                    resolve(true);
                } else {
                    window.Notification.requestPermission().then(function (permission) {
                        if (permission === 'granted') {
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    });
                }
            } else {
                resolve(true);
            }
        });
    }
}

if (!window.UserScript) {
    window.UserScript = {};
}
window.UserScript.Notifications = new Notifications();
