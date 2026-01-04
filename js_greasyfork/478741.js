// ==UserScript==
// @name         startup script
// @include      https://*grepolis*
// @version      1.1.2
// @description  try to take over the world!
// @author       Who knows
// @run-at       document-idle
// @namespace https://greasyfork.org/users/984383
// @downloadURL https://update.greasyfork.org/scripts/478741/startup%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/478741/startup%20script.meta.js
// ==/UserScript==

(async function() {
    // wait for scripts to load
    const sleep = (n) => new Promise((res) => setTimeout(res, n));
    await sleep(3000);


    async function task_scheduler() {
        let href = window.location.href;
        if (href.startsWith("https://nl110.grepolis.com")) {
            await start_bots();
        } else if (href.startsWith("https://nl0.grepolis.com/") ) {
            await auto_login();
        } else if (href.startsWith("https://nl.grepolis.com")) {
            await full_login();
        }
    }

    async function auto_login() {
        let world = "METHONE";
        console.log("log out detected, logging in...");
        await sleep(1000 * 60 * 10);
        let xpath = `//div[contains(text(),'METHONE')]`;
        let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (matchingElement) {
            matchingElement.click();
            console.log(`logged into world !${world}!`);
        }
        
    }

    async function full_login() {
        console.log("full logout detected, logging in...");
        sleep(2000);

        let username = document.getElementById("login_userid");
        username.readonly = true;

        let password = document.getElementById("login_password");
        password.readonly = true;

        sleep(3000);

        let login = document.getElementById("login_Login");
        login.click();

        auto_login();
    }

    async function start_bots() {
        await sleep(5000);

        console.log("Starting bots...");
        captcha_bot.switch();
        console.log("Bots started.");
    }

    window.onload = task_scheduler();

})();