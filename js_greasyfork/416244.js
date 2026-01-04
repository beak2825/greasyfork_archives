// ==UserScript==
// @name         Browsing Reminder Client
// @namespace    JustSong
// @version      0.2
// @description  Remind you when you waste too much time on specified websites.
// @author       JustSong
// @require      https://cdn.jsdelivr.net/npm/toastify-js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10
// @match        https://www.zhihu.com/*
// @match        https://*.youtube.com/*
// @match        https://*.bilibili.com/*
// @match        https://*.reddit.com/*
// @match        https://zh.wikipedia.org/*
// @downloadURL https://update.greasyfork.org/scripts/416244/Browsing%20Reminder%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/416244/Browsing%20Reminder%20Client.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const serverUrl = "https://ping.iamazing.cn";
    const pingInterval = 60; // Unit is second.
    const maxMinutes = 10;
    const needConfirm = true;
    window.pingServer = function () {
        console.log("ping~");
        fetch(serverUrl, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Host: window.location.hostname
            })
        }).then(function (response) {
            return response.text().then(function (minutes) {
                let counter = parseInt(minutes);
                window.processRequest(counter);
            })
        }).catch(function (reason) {
            console.log(reason)
        })
    };
    window.processRequest = function (minutes) {
        window.toast(`You have wasted ${minutes} minutes.`);
        if (minutes >= maxMinutes) {
            if (needConfirm) {
                // choose = confirm(`You have wasted ${minutes} minutes in this site, would you like to close it?`);
                Swal.fire({
                    title: 'Notice',
                    text: `You have wasted ${minutes} minutes in this site, would you like to close it?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ok',
                    cancelButtonText: 'Nope'
                }).then((result) => {
                    if (result.dismiss === Swal.DismissReason.cancel) {
                        Swal.fire(
                            'Notice',
                            'The timer has been reset.',
                            'error'
                        )
                        fetch(`${serverUrl}/clear`, {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                Host: window.location.hostname
                            })
                        }).finally()
                    } else {
                        window.location.href = "https://google.com";
                    }
                })
            } else {
                window.location.href = "https://google.com";
            }
        }
    };
    window.insertCSS = function () {
        let head = document.getElementsByTagName('head')[0];
        let styleElement = document.createElement('style');
        styleElement.innerHTML = `.toastify{padding:12px 20px;color:#fff;display:inline-block;box-shadow:0 3px 6px -1px rgba(0,0,0,.12),0 10px 36px -4px rgba(77,96,232,.3);background:-webkit-linear-gradient(315deg,#73a5ff,#5477f5);background:linear-gradient(135deg,#73a5ff,#5477f5);position:fixed;opacity:0;transition:all .4s cubic-bezier(.215,.61,.355,1);border-radius:2px;cursor:pointer;text-decoration:none;max-width:calc(50% - 20px);z-index:2147483647}.toastify.on{opacity:1}.toast-close{opacity:.4;padding:0 5px}.toastify-right{right:15px}.toastify-left{left:15px}.toastify-top{top:-150px}.toastify-bottom{bottom:-150px}.toastify-rounded{border-radius:25px}.toastify-avatar{width:1.5em;height:1.5em;margin:-7px 5px;border-radius:2px}.toastify-center{margin-left:auto;margin-right:auto;left:0;right:0;max-width:fit-content;max-width:-moz-fit-content}@media only screen and (max-width:360px){.toastify-left,.toastify-right{margin-left:auto;margin-right:auto;left:0;right:0;max-width:fit-content}}`;
        head.appendChild(styleElement);
    }
    window.insertCSS();
    window.toast = function (message) {
        Toastify({
            text: message,
            duration: 5000,
            close: false,
            gravity: "bottom",
            position: "center",
            backgroundColor: "#ea4335",
            stopOnFocus: true,
        }).showToast();
    };
    window.pingServer();
    let timer = setInterval(window.pingServer, pingInterval * 1000);
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === 'visible') {
            window.pingServer();
            timer = setInterval(window.pingServer, pingInterval * 1000);
        } else {
            clearInterval(timer)
        }
    });
})();