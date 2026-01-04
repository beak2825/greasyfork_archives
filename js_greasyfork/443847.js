// ==UserScript==
// @name         Fortnite Code Generator
// @namespace    https://spin.tk
// @license      GNU GPLv3
// @version      1.1
// @description  Despite how sketchy the name is, this is an actual code generator. The odds of getting an actual code is low but not zero.
// @author       Spinfal
// @match        https://www.epicgames.com/store/*
// @match        https://www.epicgames.com/id/login*
// @icon         https://www.google.com/s2/favicons?domain=epicgames.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/443847/Fortnite%20Code%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/443847/Fortnite%20Code%20Generator.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const controller = new AbortController();
    const signal = controller.signal;
    var running = false;
    if (sessionStorage['error'] !== undefined) {
        alert(sessionStorage['error']);
        sessionStorage.removeItem('error');
    }
    const Style = {
        base: [
            "color: #2ba9a9",
            "font-size: 30px",
            "background-color: #444",
            "padding: 2px 4px",
            "border-radius: 2px"
        ],
        secondary: [
            "font-size: 15px",
            "color: #eee",
            "background-color: #2b2b2b"
        ],
        success: [
            "font-size: 25px",
            "color: green",
            "background-color: #2b2b2b"
        ],
        error: [
            "font-size: 25px",
            "color: red",
            "background-color: #2b2b2b"
        ],
    }
    const log = (text, extra = []) => {
        let style = Style.base.join(';') + ';';
        style += extra.join(';'); // Add any additional styles
        console.log(`%c${text}`, style);
    }
 
    log("Please wait while Epic is done spamming the console with this shit");
    window.onload = () => {
        setImmediate(() => {
            const div = document.createElement('div');
            div.setAttribute('style', 'background-color: #0078F2; color: white; width: 16vh; border-radius: 4px; padding: 5px; cursor: default;');
            div.innerHTML = '<p>Open Developer Console for the code generator</p>';
            document.querySelector('[data-component=SiteNav]').appendChild(div);
            window.onkeydown = (event) => {
                console.clear();
                if (event.key === '/' && running === false) {
                    log("Starting generator...", Style.secondary);
                    setInterval(() => checkCodes(), 1000);
                } else if (running) {
                    log("Generator is already running!", Style.secondary);
                }
            }
            console.clear();
            log("Fortnite Code Generator");
            log("To run the generator, press the / key on your keyboard! (not in console)\nTo stop the generator, just reload your page.", Style.secondary);
        });
    }
 
    function makecode(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() *
                                                   charactersLength));
        }
        return result;
    }
 
    // res.json()).then(res => JSON.stringify(res)).then(res =>
    function checkCodes() {
        running = true;
        const giftCode = makecode(16);
 
        fetch(`https://www.epicgames.com/fortnite/en-US/api/posa/${giftCode}/status`, {
            signal: signal,
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-US,en;q=0.9",
                "sec-ch-ua": "\"Chromium\";v=\"96\", \"Google Chrome\";v=\"82\", \";Not A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://www.epicgames.com/fortnite/en-US/vbuckscard?fromCta=true",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(res => {
            switch (res?.status) {
                case 200:
                    log(giftCode + " is a valid code", Style.success);
                    break;
                case 404:
                    log(giftCode + " is not a valid code", Style.error);
                    break;
                case 401:
                    controller.abort();
                    location.reload();
                    sessionStorage['error'] = 'you are not logged in to an epicgames account!';
                    //alert("you are not logged in to an epicgames account!");
                    window.open('https://www.epicgames.com/id/login', '_self');
                    break;
                case 429:
                    controller.abort();
                    location.reload();
                    sessionStorage['error'] = 'you are being rate limited, try again later';
                    //alert("you are being rate limited, try again later");
                    break;
                default:
                    running = false;
                    controller.abort();
                    log("an error has occurred with the status code: " + res?.status);
            }
        }).catch(console.error);
    }
})();