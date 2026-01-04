// ==UserScript==
// @name         tmpr2
// @namespace    http://tampermonkey.net/
// @version      2025-06-06
// @description  Create an account at tribal wars and send the login to via discord hook. Do not use, only for myself :)
// @author       You
// @match        https://www.divokekmeny.cz/page/new
// @icon         https://www.google.com/s2/favicons?sz=64&domain=divokekmeny.cz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538609/tmpr2.user.js
// @updateURL https://update.greasyfork.org/scripts/538609/tmpr2.meta.js
// ==/UserScript==
(async () => {

    async function sendDcNotification(login) {
        const webhookUrl = "https://discord.com/api/webhooks/1380535378460803123/qnSsHee3hfLHi4KccUP4txG972loimes3uUHVHHj1wgz1I6SWMhIODy6y74EOAAbZd6s";
        const payload = {
            content: `New registration: \`${login}\``
        };
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                console.error('Error sending webhook:', response.statusText);
            } else {
                console.log('Webhook sent successfully');
            }
        } catch (error) {
            console.error('Error sending webhook:', error);
        }
    }

    const sleep = async () => await new Promise(r => setTimeout(r, Math.floor(Math.random() * 301) + 300));

    async function getRandomWord() {
        //const response = await fetch("https://random-word-api.herokuapp.com/word?number=1");
        const response = await fetch("https://random-word.ryanrk.com/api/en/word/random");
        const data = await response.json();
        return data[0];
    }

    const login = await getRandomWord();
    const shuffleLogin = () => login.split('').sort(() => Math.random() - 0.5).join('');
    console.log(login);

    document.querySelector('#register_username').value = login;
    await sleep();
    document.querySelector('#register_password').value = "4ak94s99*";
    await sleep();
    document.querySelector('#register_email').value = `${shuffleLogin()}@${shuffleLogin()}.com`;
    await sleep();
    document.querySelector('#terms').click();
    await sleep();
    document.querySelector('a.btn-register').click();
    await sendDcNotification(login);
})();