// ==UserScript==
// @name         Freedom for our brothers
// @description  Freedom for our brothers !!!
// @version      0.1
// @author       Friends
// @match        https://www.erepublik.com/*
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/739348
// @downloadURL https://update.greasyfork.org/scripts/422075/Freedom%20for%20our%20brothers.user.js
// @updateURL https://update.greasyfork.org/scripts/422075/Freedom%20for%20our%20brothers.meta.js
// ==/UserScript==
 
(async function() {
    'use strict';
 
    const getRandomTimeout = (min, max) => {
        // return Math.floor(Math.random() * (max - min) ) + min
        return Math.random() * (max - min) + min
    }
 
    const postMessageOnWall = async () => {
        await fetch("https://www.erepublik.com/en/main/wall-post/create/json", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en-GB,en;q=0.9,en-US;q=0.8,bg;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest"
            },
            "referrer": "https://www.erepublik.com/en",
            "referrerPolicy": "same-origin",
            "body": "post_as=0&post_message=FREEDOM+FOR+OUR+BROTHERS%0D%0A%0D%0Atinyurl.com%2F52998hg6%0D%0Atinyurl.com%2F1ckm0yin%0D%0Atinyurl.com%2Fy88dp8bb%0D%0Atinyurl.com%2F33pqndll%0D%0Atinyurl.com%2F1lrf5jv4%0D%0Atinyurl.com%2F55pse8cc%0D%0Atinyurl.com%2F2jorl45z%0D%0Atinyurl.com%2Fy42un6nz%0D%0Atinyurl.com%2Fyqm3rp5k&_token=" + unsafeWindow.SERVER_DATA.csrfToken,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        })
    }
    if (window.top === window.self) {
        setTimeout(postMessageOnWall, getRandomTimeout(5, 20) * 1000)
        setInterval(function postWall() {
            let rand = getRandomTimeout(5, 10)
            setTimeout(function() {
                postMessageOnWall()
            }, rand * 60 * 1000)
        }, 60 * 1000)
    }
})();