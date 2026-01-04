// ==UserScript==
// @name         aluno01
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  teste
// @author       testante
// @require      https://greasyfork.org/scripts/461948-fbase-lib/code/FBase%20Lib.js?version=1224586
// @match        https://profit-pie.com/*
// @icon         https://profit-pie.com/resources/style/img/logo-letter.svg
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/472152/aluno01.user.js
// @updateURL https://update.greasyfork.org/scripts/472152/aluno01.meta.js
// ==/UserScript==
// Register here: https://profit-pie.com?aff=11691

(function() {
    'use strict';
    const EMAIL = 'seu -email';
    const PASSWORD = 'sua senha';

	const FAST_MODE = false; // rndInt(1, 10) < 8;

    // TODO: language validation.. for now warning...
    setTimeout(() => {
        if (document.querySelector('.skiptranslate iframe[style="visibility:visible"]')) {
            window.alert('Warning: the script will not work properly if the site is translated.\nPlease disable Google Translation.');
        }
    }, rndInt(2000, 5000));

    const PAGE = {
        UNKNOWN: 'Unknown',
        HOME: 'Home',
        DASHBOARD: 'dashboard.php',
        LOGIN: 'login.php',
        OVEN: 'ovens.php',
        TREE: 'apple-tree.php',
        BAKERY: 'bakery.php',
    };
    let current = PAGE.UNKNOWN;
    let nextRoll = GM_getValue('nextRoll') || Date.now();

    async function doLogin() {
        let email = document.querySelector('input[name="email"]');
        let pass = document.querySelector('input[name="password"]');
        let loginBtn = document.querySelector('button[name="login"]');
        let captcha = new RecaptchaWidget();
        if (!email || !pass || !loginBtn || !captcha) {
            await wait(3000);
            return doLogin();
        }

        if (email.value != EMAIL) {
            email.value = EMAIL;
            await wait(100);
        }
        if (pass.value != PASSWORD) {
            pass.value = PASSWORD;
            await wait(100);
        }

        await captcha.isSolved();
        loginBtn.click(); // triggerClick(loginBtn);
    }

    function readNextRoll() {
        let timer = document.querySelector('#time');
        let val = false;
        if (timer && timer.isVisible()) {
            try {
                let mins = +timer.innerText.match(/.*h\:(.*)m/)[1];
                val = Date.now() + (mins * 60000) + rndInt(60000, 70000);
            } catch (err) {}
        }
        return val;
    }

    async function firstTimeTree() {
        let btn = [...document.querySelectorAll('a[href="?free"]')].filter(x => x.isVisible());
        if (btn.length > 0) {
            btn[0].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
            await wait(400, 600);
            btn[0].click(); // triggerClick(bakeBtn[0]);
            return;
        }
    }

    async function collectTree() {
        await wait(2000, 8000);
        await firstTimeTree();
        let time = document.querySelector('#time');
        let collectButton = document.querySelector('a[href="?collect"]');
        if (time && time.isVisible() && time.innerText.toLowerCase() == 'ready to collect'
            && collectButton && collectButton.isVisible()) {
            GM_setValue('nextRoll', Date.now() + 60 * 60000 + rndInt(60000, 70000));
            collectButton.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
            await wait(1300, 1800);
            collectButton.click(); // triggerClick(collectButton);
            return;
        } else {
            if (Date.now() > nextRoll) {
                let newNextRoll = readNextRoll();
                GM_setValue('nextRoll', newNextRoll || Date.now() + 5 * 60000);
            }
        }
        await wait(12000, 18000);
        return collectTree;
    }

    async function firstTimeOvens() {
        let btn = [...document.querySelectorAll('a[href="?freeOven"]')].filter(x => x.isVisible());
        if (btn.length > 0) {
            btn[0].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
            await wait(400, 600);
            btn[0].click(); // triggerClick(bakeBtn[0]);
            return;
        }
    }

    function canCook(cost) {
        let availableApples = 0;
        try {
            let balance = [...document.querySelectorAll('h5')].filter(x => x.innerText.toLowerCase().includes('apples'));
            if (balance.length > 0) {
                availableApples = +balance[0].nextElementSibling.innerText;
            }
        } catch (err) {}
        return cost <= availableApples;
    }

    async function doOvens() {
        await wait(2000, 8000);
        await firstTimeOvens();
        let bakeBtn = [...document.querySelectorAll('a.btn-warning')].filter(x => x.isVisible() && x.href.includes('?bake'));
        if (bakeBtn.length > 0) {
            let pieCost;
            try {
                pieCost = +bakeBtn[0].nextElementSibling.innerText.match(/(\d+)/)[0];
            } catch (err) { pieCost = 12; }
            if (!canCook(pieCost)) {
                return;
            }
            bakeBtn[0].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
            await wait(400, 600);
            bakeBtn[0].click(); // triggerClick(bakeBtn[0]);
            return;
        }
        let collectBtn = [...document.querySelectorAll('a[id^=btnCollect],a[href^="?collect"]')].filter(x => x.isVisible());
        if (collectBtn.length > 0) {
            collectBtn[0].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
            await wait(400, 600);
            collectBtn[0].click(); // triggerClick(collectBtn[0]);
            return;
        }
        if (!FAST_MODE) {
            await wait(12000, 17000);
        }
        return doOvens();
    }

    async function doBakery() {
        await wait(2000, 8000);
        let sellBtn = [...document.querySelectorAll('a[href="?sell"]')].filter(x => x.isVisible());
        if (sellBtn.length > 0) {
            sellBtn[0].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
            await wait(400, 600);
            sellBtn[0].click(); // triggerClick(sellBtn[0]);
            return;
        }
        if (!FAST_MODE) {
            await wait(12000, 17000);
        }
        return doBakery();
    }

    // popup closer
    setInterval(() => {
        let closePopup = document.querySelector('.swal2-confirm.swal2-styled');
        if (closePopup && closePopup.isVisible()) {
            closePopup.click();
            return;
        }
    }, rndInt(2000, 3000));

    async function crawler() {
        let nextPage;
        const rndNumber = rndInt(1, 10);

        switch(current) {
            case PAGE.TREE:
                nextPage = rndNumber < 9 ? PAGE.OVEN : PAGE.BAKERY;
                break;
            case PAGE.OVEN:
                nextPage = rndNumber < 10 ? PAGE.OVEN : PAGE.BAKERY;
                break;
            case PAGE.BAKERY:
                nextPage = rndNumber < 9 ? PAGE.OVEN : PAGE.TREE;
                break;
        }

        if (!nextPage || Date.now() > nextRoll + rndInt(10000, 120000)) {
            nextPage = PAGE.TREE;
        }
        if (!SOLVING_CAPTCHA) {
            location.replace(nextPage);
        }
    }

    // some movement
    async function moveY() {
        let yMovement = Math.floor(document.body.getBoundingClientRect().height) * Math.random()/1.7;
        window.scrollTo({
            top: yMovement,
            behavior: "smooth"
        });
    }

    async function start() {
        if (location.href.includes('/index.php') || location.pathname == '/') {
            current = PAGE.HOME;
            doHome();
            return;
        }
        if (location.href.includes('/login.php')) {
            let hasSetup = EMAIL && EMAIL != 'YOUR_EMAIL' && PASSWORD && PASSWORD != 'YOUR_PASSWORD';
            if (!hasSetup) {
                window.alert('You need to setup your email and password in the script');
                return;
            }
            current = PAGE.LOGIN;
            doLogin();
            return;
        }

        if (location.href.includes(PAGE.DASHBOARD)) {
            current = PAGE.DASHBOARD;
            location.replace(PAGE.TREE);
            setTimeout(() => { moveY(); }, rndInt(8000, 28000));
            setInterval(() => { crawler(); }, rndInt(35000, 60000));
            return;
        } else if (location.href.includes(PAGE.TREE)) {
            current = PAGE.TREE;
            collectTree();
            setTimeout(() => { moveY(); }, rndInt(8000, 28000));
            setInterval(() => { crawler(); }, rndInt(35000, 60000));
            return;
        } else if (location.href.includes(PAGE.OVEN)) {
            current = PAGE.OVEN;
            doOvens();
            setTimeout(() => { moveY(); }, rndInt(8000, 28000));
            setInterval(() => { crawler(); }, rndInt(65000, 75000));
            return;
        } else if (location.href.includes(PAGE.BAKERY)) {
            current = PAGE.BAKERY;
            doBakery();
            setTimeout(() => { moveY(); }, rndInt(8000, 28000));
            setInterval(() => { crawler(); }, rndInt(35000, 60000));
            return;
        }

    }

    let SOLVING_CAPTCHA = false;
    async function submitCaptcha() {
        let captcha = new RecaptchaWidget();
        let captchaButton = [...document.querySelectorAll("button")].filter(x => x.isVisible() && x.innerText.toLowerCase().includes('send'));
        if (captcha && captchaButton.length > 0) {
            SOLVING_CAPTCHA = true;
            await captcha.isSolved();
            if (captchaButton.length > 0) {
                captchaButton[0].click();
                SOLVING_CAPTCHA = false;
                return;
            }
        }
        await wait(4000, 6000);
    }
    submitCaptcha();

    async function doHome() {
        await wait(10000);
        let loginBtn = [...document.querySelectorAll('a[href="login.php"]')].filter(x => x.isVisible());
        let needToLogin = loginBtn.length > 0;
        if (needToLogin) {
            loginBtn[0].click();
            return;
        } else {
            location.replace(PAGE.TREE);
            return;
        }
        return doHome();
    }

    start();
})();