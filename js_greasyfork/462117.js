// ==UserScript==
// @name         autofisting
// @namespace    http://tampermonkey.net/
// @version      9.0.1
// @description  lolostim hueta
// @match        https://zelenka.guru/threads/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/462117/autofisting.user.js
// @updateURL https://update.greasyfork.org/scripts/462117/autofisting.meta.js
// ==/UserScript==


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function check_button() {
    let i = 1
    //console.log(document.getElementsByClassName('LztContest--Participate button mn-15-0-0 primary'))
    if (document.getElementsByClassName('fl_r forumSearchThreads--Link')[0].getAttribute('href') != 'forums/contests/') return
    if (document.getElementsByClassName('LztContest--Participate button mn-15-0-0 primary').length == 0) return open(location, '_self').close()
    while (document.getElementsByClassName('LztContest--Participate button mn-15-0-0 primary')[0].getAttribute('href').includes('cf-turnstile-response') == false) {
        i++
        if (i == 20) open(location, '_self').close()
        console.log('captcha error')
        await delay(500)
    }
    console.log('captcha success')
    document.getElementsByClassName('LztContest--Participate button mn-15-0-0 primary')[0].click()
    console.log('participate')
    await delay(1000)
    open(location, '_self').close()
}

check_button()