// ==UserScript==
// @name         [Premium] Shortlink Maker by Andrewblood
// @namespace    https://greasyfork.org/users/1162863
// @version      2.0.3
// @description  Automatically clicks the most Shortlinks for Firefaucet, Viefaucet, and Dutchycorp. Cryptowidget is not supported due to excessive security measures.
// @author       Andrewblood
// @match        *://*/*
// @icon         https://warchol.at/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.min.js
// @grant        window.focus
// @grant        window.close
// @grant        GM_openInTab
// @antifeature  referral-link     Referral-Link is in this Script integrated.
// @license      Copyright Andrewblood
// @downloadURL https://update.greasyfork.org/scripts/489437/%5BPremium%5D%20Shortlink%20Maker%20by%20Andrewblood.user.js
// @updateURL https://update.greasyfork.org/scripts/489437/%5BPremium%5D%20Shortlink%20Maker%20by%20Andrewblood.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const titles = [
        'Just a moment',
        '稍等片刻',
        'Een ogenblik',
        'Un instant',
        'Nur einen Moment',
        'Un momento',
        'Um momento',
        'Bir an'
    ];

    if (titles.some(title => document.title.includes(title))) {

        console.log('Cloudflare-Challenger-Seite erkannt. Skript wird nicht ausgeführt.');
        window.focus();

    } else {

        if (window.location.href.includes("btcnews.site") ||
            window.location.href.includes("blog.adlink.click") ||
            window.location.href.includes("danangtravelguide.top") ||
            window.location.href.includes("hanoitravelguide.top") ||
            window.location.href.includes("horoscop.xyz") ||
            window.location.href.includes("linksfly.online") ||
            window.location.href.includes("azlinks.top") ||
            window.location.href.includes("aysolink.online") ||
            window.location.href.includes("shortlinks.info") ||
            window.location.href.includes("gplinks.co") ||
            window.location.href.includes("moneyfree.top") ||
            window.location.href.includes("lkfms.pro") ||
            window.location.href.includes("saigontravelguide.top")) {
            clickByText("Get Link");
        }
        if (window.location.href.includes("droplink.site")) {
            clickByText("Get Link");
        }
        if (window.location.href.includes("cb.rjseahost.com")) {
            clickByText("Get Link");
        }
        if (window.location.href.includes("linkrex.net")) {
            clickByText("Get Link");
        }
        if (window.location.href.includes("www.sonjuegosgratis.com")) {
            clickByText("Get link");
        }
        if (window.location.href.includes("shortox.com")) {
            clickByText("Get Link");
        }
        if (window.location.href.includes("linkpay.top")) {
            clickByText("Get Link");
        }
        if (window.location.href.includes("en.mrproblogger.com")) {
            clickByText("Get Link");
        }
        if (window.location.href.includes("bestlinks.online")) {
            clickByText("Get Link");
        }

        if (window.location.href.includes("azlinks.top")) {
            clickByText("Click here to continue");
        }
        if (window.location.href.includes("shortlinks.info")) {
            clickByText("Click here to continue");
        }

        if (window.location.href.includes("forex-trnd.com")) {
            clickByClass("g-recaptcha btn btn-primary");
            clickByText("GET LINK");
        }
        if (window.location.href.includes("oii.la") ||
            window.location.href.includes("tpi")) {
            clickByText("Continue");
            clickByText("Get Link");
            clickByText("ABLEHNEN");
        }
        if (window.location.href.includes("wyqe.online")) {
            clickByText("Continue");
            clickById("closeButton");
            clickByText("I am not a robot");
            clickByText("Get Link");
        }
        if (window.location.href.includes("blogmado.com")) {
            clickByText(" Click here to continue");
            clickByText(" Get Link");
        }

        if (window.location.href.includes("autodime.com")) {
            clickByText("Show Captcha Verification");
            clickByText("  Step 2/4 ");
            clickByText(" Step 3/4");
        }
        if (window.location.href.includes("cryptorex.net")) {
            clickByText(" Step 3/4");
        }
        if (window.location.href.includes("linkss.rcccn.in")) {
            clickByText("Step One (0/1)");
            clickByText("Step Two (0/1)");
            clickById("close-droplink-step-one");
        }
        if (window.location.href.includes("cointox.net")) {
            clickByText("Show Captcha Verification");
            clickByText("  Step 2/4 ");
        }

        if (window.location.href.includes("coincroco.com")) {
            clickByText(" Step 3/4");
        }

        if (window.location.href.includes("mitly.us")) {
            clickByText("Click here to continue");
            clickByText("Get Link");
        }

        if (window.location.href.includes("blogsward.com") ||
            window.location.href.includes("coinjest.com")) {
            clickByText("Begin");
            clickByText("Continue");
        }

        if (window.location.href.includes("shrinkme.ink")) {
            clickByText("Click here to continue");
        }

        if (window.location.href.includes("themezon.net")) {
            clickByText("Click To Verify");
            clickByText("Continue...");
            clickByText("Continue");
            clickByText("Generate Link");
            clickByText("Go To Url");
        }
        if (window.location.href.includes("healthfirstweb.com") ||
            window.location.href.includes("mythvista.com") ||
            window.location.href.includes("ss7.info") ||
            window.location.href.includes("howifx.com")) {
            clickByText("Continue...");
            clickByText("Next");
        }
        if (window.location.href.includes("dekhe.click")) {
            clickByText("To proceed, please click here");
            clickByText("SKIP AD");
        }
        if (window.location.href.includes("paycut.pro") ||
            window.location.href.includes("coinads.online") ||
            window.location.href.includes("dgbmining.online") ||
            window.location.href.includes("freeltc.link") ||
            window.location.href.includes("beycoin.xyz")) {
            clickByText("NEXT");
            clickByText("Get Link");
        }
        if (window.location.href.includes("ouo.press") ||
            window.location.href.includes("ouo.io")) {
            clickByText("I'M A HUMAN");
            clickByText("GET LINK");
        }
        if (window.location.href.includes("tech.dutchycorp.space") ||
            window.location.href.includes("movies.dutchycorp.space") ||
            window.location.href.includes("anime.dutchycorp.space")) {
            clickByText("CLICK 1");
            clickByText("CLICK 2");
        }

        if (window.location.href.includes("2wheelslife.com") ||
            window.location.href.includes("finance240.com")) {
            clickByClass("bbm-close");
            clickByClass("bbm-close");
            clickByClass("bbm-close");
            var intervalLinksflameAd = setInterval(() => {
                if (document.querySelector("#formButtomMessage") && document.querySelector("#formButtomMessage").innerText == "Well done! You're ready to continue!"){
                    clearInterval(intervalLinksflameAd);
                    clickByText("NEXT ARTICLE");
                    clickById("cbt");
                }

                if (document.querySelector("#formButtomMessage") && document.querySelector("#formButtomMessage").innerText == 'Waiting for ad click!'){
                    clearInterval(intervalLinksflameAd);
                    clickByClass("bbm-footer");
                    const currentTab = window;
                    const newTab = GM_openInTab("https://warchol.at/shortlink_maker_ad_page.html", { active: true });
                    setTimeout(() => {
                        currentTab.focus()
                        setTimeout(() => {
                            clickByText("NEXT ARTICLE");
                        }, 3000);
                    }, 1000);
                    window.addEventListener("beforeunload", function () {
                        currentTab.focus();
                        if (newTab && !newTab.closed) {
                            newTab.close();
                        }
                    });
                }
            }, 3000);
        }

        if (window.location.href.includes("fc-lc.xyz")) {
            clickByText("Click here to continue");
        }
        if (window.location.href.includes("labgame.io") ||
            window.location.href.includes("jobzhub.store")) {
            clickByText("Click here to verify");
            clickByText("Continue...");
            clickById("glink");
            clickByText("Get Link");
        }

        if (window.location.href.includes("exnion.com")){
            clickByText("Continue");
            clickByText("I am not a robot");
            clickByText("Get Link");
        }

        if (window.location.href.includes("oii.io")){
            clickByText("Click here to continue");
            clickByText("VERIFY");
        }

        if (window.location.href.includes("sabkiyojana.com") ||
            window.location.href.includes("airchartersteb.com") ||
            window.location.href.includes("odiafm.com")){
            clickByText("CONTINUE");
            clickByText("VERIFY");
        }

        if (window.location.href.includes("hosttbuzz.com") ||
            window.location.href.includes("policiesreview.com") ||
            window.location.href.includes("insurancemyst.com") ||
            window.location.href.includes("healthylifez.com")){
            clickByText("Continue...");
            clickByText("Get Link");
        }
        if (window.location.href.includes("wordcount.im")){
            clickByText("CLICK HERE TO CONTINUE");
            clickByText("Get Link");
        }

        if (window.location.href.includes("ziggame.com") ||
            window.location.href.includes("gamezizo.com") ||
            window.location.href.includes("gamezigg.com")){
            clickById("subBtn");
            clickById("continueBtn");
            clickByText("Click To Verify");
            clickByText("Continue...");
            clickByText("Click here to continue");
            clickByText("Click here to Unlock Link");
            clickByText("Click to watch the video on YouTube");
            clickByText("Getlink");
            clickByText("Get Link");
            window.onbeforeunload = function() {
                if (unsafeWindow.myWindow) {
                    unsafeWindow.myWindow.close();
                }
                if (unsafeWindow.coinwin) {
                    var tmp = unsafeWindow.coinwin;
                    unsafeWindow.coinwin = {};
                    tmp.close();
                }
            };
        }

        if (window.location.href.includes("get.megafly.in")) {
            clickByText("Click here to continue");
            clickByText("Get Link");
        }

        if (window.location.href.includes("get.linkbulks.com")){
            clickByText("Click here to continue");
            clickByText("Click here to continue");
            clickByText("Get Link");
            clickByText("Get Link");
        }

        if (window.location.href.includes("dutchycorp.space")){
            clickByText("CLICK HERE TO CONTINUE");
            clickByText("GET LINK");
        }

        if (window.location.href.includes("adshnk.com")) {
            clickByText("Click here to Continue");
            clickByText("Continue (0/1)");
            clickByText("Continue (0/1)");
        }

        if (window.location.href.includes("bioinflu.com") ||
            window.location.href.includes("cryptosparatodos.com")) {
            clickBySelector("#wpsafelinkhuman > img");
            clickBySelector("#wpsafe-generate > a > img");
            clickBySelector("#wpsafe-link > a > img");
        }

        if (window.location.href.includes("tlin.me")) {
            clickByText("Click here to continue");
            clickByText("Get Link");
        }

        if (window.location.href.includes("wanderjourney.net")) {
            clickByText("✖");
        }

        if (window.location.href.includes("dailytech-news.eu")) {
            clickByText("Click Here To Start");
        }

        if (window.location.href.includes("go.tfly.link")) {
            clickByText("Click here to continue");
            clickByText("Get Link");
        }

        if (window.location.href.includes("cutynow.com")) {
            clickByText("Go ->");
            clickByText("Continue");
            clickByText("I am not a robot");
        }

        if (window.location.href.includes("aysodamag.com")){
            clickByText("ABLEHNEN");
            clickBySelector("#offer1Btn");
            clickBySelector("#offer2Btn");
            clickBySelector("#link1s-form > input:nth-of-type(2)");
            clickBySelector("#link1s-snp1");
        }

        if (window.location.href.includes("dutchycorp.ovh")) {
            let interval = setInterval(function() {
                let element = document.querySelectorAll("#click-btn > font")[0];
                let element2 = document.querySelectorAll("#click-btn > font")[1];
                if (element) {
                    element.click();
                    element2.click();
                    clearInterval(interval);
                }
            }, 1000);
            clickByText("CLICK HERE TO CONTINUE");
            clickByText("SKIP AD");
        }

        if (window.location.href.includes("videolyrics.in")) {
            let interval = setInterval(function() {
                let element = document.querySelectorAll(".py-2.px-4")[0];
                let element2 = document.querySelectorAll(".py-2.px-4")[1];
                if (element) {
                    element.click();
                    element2.click();
                    clearInterval(interval);
                }
            }, 1000);
            document.querySelectorAll("#click-btn > font")[1]
        }

        if (window.location.href.includes("www.diudemy.com") ||
            window.location.href.includes("www.maqal360.com")){
            clickByText("Click HERE");
            clickByText("Click Here");
            if (document.querySelector(".alertAd.alert.alert-primary")){
                const currentTab = window;
                const newTab = GM_openInTab("https://warchol.at/shortlink_maker_ad_page.html", { active: true });
                setTimeout(() => {
                    currentTab.focus();
                    setTimeout(() => {
                        newTab.focus();
                    }, 3000);
                }, 1000);
                window.addEventListener("beforeunload", function () {
                    currentTab.focus();
                    if (newTab && !newTab.closed) {
                        newTab.close();
                    }
                });
            }
        }

        if (window.location.href.includes("worldwallpaper.top") ||
            window.location.href.includes("videoclip.info") ||
            window.location.href.includes("newscrypto.info")) {
            window.alert = function() {
            };
            setTimeout(() => {
                clickByText("PROCEED");
            }, 15000);
            clickByText("CLICK HERE TO CONTINUE");
            clickByText("PROCEED TO STEP 1");
            clickByText("PROCEED TO STEP 2");
            clickByText("PROCEED TO STEP 3");
            clickByText("PROCEED TO FINAL STEP");
            clickByText("GET THE LINK");
            const bypassAdInterval = setInterval(function() {
                if (document.querySelector("#plan1 > center > h3 > font") && document.querySelector("#plan1 > center > h3 > font").textContent.includes("CLICK ON") && document.querySelector("#plan1 > center > h3 > font").offsetHeight > 0){
                    clearInterval(bypassAdInterval);
                    document.querySelector("#plan2").style.display = "block";
                }
            }, 3000);
        }

        if (window.location.href.includes("danangtravel.top") ||
            window.location.href.includes("hanoitravel.xyz") ||
            window.location.href.includes("saigontravel.top")){
            setInterval(() => {
                const redX = document.querySelector("#ad");
                if (document.querySelector(".form-control").value.length > 0 && document.querySelector("#scrollMessage") && document.querySelector("#scrollMessage").offsetHeight > 0) {
                    clickByText("CONTINUE");
                    setTimeout(() => {
                        redX.click();
                    }, 3000);
                }
            }, 5000);

            // Captcha-Bild finden
            let captchaImage = document.querySelector(".input-group-prepend");
            if (captchaImage) {
                // Bild URL extrahieren
                let captchaSrc = captchaImage.lastElementChild.src;

                // Erstellt ein neues Canvas-Element zur Bildbearbeitung
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');

                // Lädt das Captcha-Bild
                let img = new Image();
                img.crossOrigin = "Anonymous"; // Umgehen von CORS-Problemen, falls nötig
                img.src = captchaSrc;
                img.onload = function() {
                    // Setzt die Größe des Canvas auf die Bildgröße
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Zeichnet das Bild auf das Canvas
                    ctx.drawImage(img, 0, 0);

                    // Schwellenwert-Anpassung (Thresholding)
                    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    let data = imageData.data;

                    // Schwellenwert für Bildbearbeitung (Threshold: 128)
                    let threshold = 80;
                    for (let i = 0; i < data.length; i += 4) {
                        let avg = (data[i] + data[i + 1] + data[i + 2]) / 3; // Durchschnitt der RGB-Werte
                        let value = avg < threshold ? 0 : 255;
                        data[i] = data[i + 1] = data[i + 2] = value; // Setzt R, G, B auf den Schwellenwert
                    }
                    ctx.putImageData(imageData, 0, 0); // Das bearbeitete Bild auf das Canvas anwenden

                    // Zeigt das bearbeitete Captcha-Bild rechts oben auf der Seite an
                    let processedImage = new Image();
                    processedImage.src = canvas.toDataURL(); // Erstellt eine Data-URL aus dem Canvas
                    processedImage.style.position = 'fixed';
                    processedImage.style.top = '10px';
                    processedImage.style.right = '10px';
                    processedImage.style.border = '2px solid black';
                    processedImage.style.zIndex = '1000';
                    document.body.appendChild(processedImage); // Fügt das bearbeitete Bild in den DOM ein

                    // Bereich für erkannte Zahlen und Berechnung
                    let resultDiv = document.createElement('div');
                    resultDiv.style.position = 'fixed';
                    resultDiv.style.top = '130px';
                    resultDiv.style.right = '10px';
                    resultDiv.style.backgroundColor = 'white';
                    resultDiv.style.border = '2px solid black';
                    resultDiv.style.padding = '10px';
                    resultDiv.style.zIndex = '1000';
                    document.body.appendChild(resultDiv);

                    Tesseract.recognize(
                        canvas,
                        'eng',
                        {
                            logger: info => console.log(info),
                        }
                    ).then(({ data: { text } }) => {
                        console.log('Erkannter Captcha-Text:', text.trim());

                        // Nur Ziffern (0–9) extrahieren
                        const digits = text.match(/\d/g); // NICHT \d+ → nur einzelne Ziffern

                        if (digits && digits.length >= 2) {
                            // Erste und letzte Ziffer
                            const zahl1 = parseInt(digits[0], 10);
                            const zahl2 = parseInt(digits[digits.length - 1], 10);
                            const ergebnis = zahl1 + zahl2;

                            console.log(`Berechnung: ${zahl1} + ${zahl2} = ${ergebnis}`);

                            resultDiv.innerHTML = `<strong>Erkannte Ziffern:</strong> ${zahl1} + ${zahl2}<br><strong>Ergebnis:</strong> ${ergebnis}`;

                            const captchaInput = document.querySelector(".form-control");
                            if (captchaInput) {
                                captchaInput.value = ergebnis;
                            }
                        } else {
                            resultDiv.innerHTML = "Fehler: Kein gültiges Captcha-Format erkannt.";
                            console.error('Fehler: Kein gültiges Captcha-Format erkannt.');
                            location.reload();
                        }
                    });

                };
            }

        }
    }

    function clickByText(text) {
        const interval = setInterval(function() {
            const captchaElement = document.querySelector(".captcha-modal, #captchaShortlink, .h-captcha, #captcha-holder, #g-recaptcha, .h-captcha.resolved"); // .g-recaptcha nicht wegen cutynow button
            const captchaResponse = document.querySelector("[name='h-captcha-response'], #g-recaptcha-response, .g-recaptcha-response, #recaptcha-token");
            const clickableElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
            for (let button of clickableElements) {
                if (button && button.innerText && button.innerText === text && button.offsetHeight > 0 && !button.hasAttribute('disabled') && !button.disabled) {
                    if (captchaElement && captchaElement.offsetHeight > 0) {
                        captchaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        if (captchaResponse && captchaResponse.value.length > 0) {
                            console.log("Captcha ausgefüllt gefunden. Klicke: " + button.innerText);
                            clearInterval(interval);
                            setTimeout(() => {
                                button.click();
                            }, 3000);
                            return;
                        } else {
                            console.log("Captcha gefunden, warte auf Lösung...");
                        }
                    } else {
                        console.log("Kein Captcha gefunden. Klicke: " + button.innerText);
                        clearInterval(interval);
                        button.click();
                        return;
                    }
                }
            }
        }, 2000);
    }

    function clickBySelector(selector) {
        const interval = setInterval(function() {
            const button = document.querySelector(selector);
            const captchaElement = document.querySelector(".captcha-modal, #captchaShortlink, .h-captcha, #captcha-holder, .safelink-recatpcha");
            const captchaResponse = document.querySelector("[name='h-captcha-response'], #g-recaptcha-response, .g-recaptcha-response, #recaptcha-token");
            if (button && button.offsetHeight > 0 && !button.hasAttribute('disabled') && !button.disabled) {
                if (captchaElement && captchaElement.offsetHeight > 0) {
                    captchaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    if (captchaResponse && captchaResponse.value.length > 0) {
                        console.log("Captcha ausgefüllt gefunden. Klicke: " + button);
                        clearInterval(interval);
                        button.click();
                        return;
                    } else {
                        console.log("Captcha gefunden, warte auf Lösung...");
                    }
                } else {
                    console.log("Kein Captcha gefunden. Klicke: " + button);
                    clearInterval(interval);
                    button.click();
                    return;
                }
            }

        }, 2000);
    }

    function clickById(id) {
        const selector = "#" + id;
        const interval = setInterval(function() {
            const button = document.querySelector(selector);
            const captchaElement = document.querySelector(".captcha-modal, #captchaShortlink, .h-captcha, #captcha-holder, .safelink-recatpcha");
            const captchaResponse = document.querySelector("[name='h-captcha-response'], #g-recaptcha-response, .g-recaptcha-response, #recaptcha-token");
            if (button && button.offsetHeight > 0 && !button.hasAttribute('disabled') && !button.disabled) {
                if (captchaElement && captchaElement.offsetHeight > 0) {
                    captchaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    if (captchaResponse && captchaResponse.value.length > 0) {
                        console.log("Captcha ausgefüllt gefunden. Klicke: " + button);
                        clearInterval(interval);
                        button.click();
                        return;
                    } else {
                        console.log("Captcha gefunden, warte auf Lösung...");
                    }
                } else {
                    console.log("Kein Captcha gefunden. Klicke: " + button);
                    clearInterval(interval);
                    button.click();
                    return;
                }
            }

        }, 2000);
    }

    function clickByClass(classNameString) {
        const selector = "." + classNameString.trim().replace(/\s+/g, '.');
        const interval = setInterval(function() {
            const button = document.querySelector(selector); // Angepasster Selektor
            const captchaElement = document.querySelector(".captcha-modal, #captchaShortlink, .h-captcha, #captcha-holder, .safelink-recatpcha");
            const captchaResponse = document.querySelector("[name='h-captcha-response'], #g-recaptcha-response, .g-recaptcha-response, #recaptcha-token");

            if (button && button.offsetHeight > 0 && !button.hasAttribute('disabled') && !button.disabled) {
                if (captchaElement && captchaElement.offsetHeight > 0) {
                    captchaElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    if (captchaResponse && captchaResponse.value.length > 0) {
                        console.log("Captcha ausgefüllt gefunden. Klicke Element mit Klassen: " + classNameString + button);
                        clearInterval(interval);
                        button.click();
                        return;
                    } else {
                        console.log("Captcha gefunden, warte auf Lösung...");
                    }
                } else {
                    console.log("Kein Captcha gefunden. Klicke Element mit Klassen: " + classNameString + button);
                    clearInterval(interval);
                    button.click();
                    return;
                }
            }
        }, 2000);
    }

    if (window.location.href === "https://faucetpay.io/" && !window.location.href.includes("2922788")) window.location.replace("https://faucetpay.io/?r=2922788");
    if (window.location.href.includes("https://freebitco.in/signup") && !window.location.href.includes("3595810")) window.location.replace("https://freebitco.in/signup/?op=s&r=3595810");
    if (window.location.href === "https://adbtc.top/") window.location.replace("https://adbtc.top/r/l/3828777");
    if (window.location.href.includes("https://www.coinpayu.com/register") && !window.location.href.includes("Andrewblood")) window.location.replace("https://www.coinpayu.com/register?r=Andrewblood");
    if (window.location.href.includes("https://autofaucet.dutchycorp.space/signup") && !window.location.href.includes("marcel6")) window.location.replace("https://autofaucet.dutchycorp.space/signup.php?r=marcel6");
    if (window.location.href === "https://autofaucet.dutchycorp.space/" && !window.location.href.includes("marcel6")) window.location.replace("https://autofaucet.dutchycorp.space/?r=marcel6");
    if (window.location.href === "https://viefaucet.com/" && !window.location.href.includes("64e3d92cc6440515b31dc7cb")) window.location.replace("https://viefaucet.com/?r=64e3d92cc6440515b31dc7cb");
    if (window.location.href.includes("https://viefaucet.com/register") && !window.location.href.includes("64e3d92cc6440515b31dc7cb")) window.location.replace("https://viefaucet.com/register?r=64e3d92cc6440515b31dc7cb");
    if (window.location.href.includes("https://viefaucet.com/login") && !window.location.href.includes("64e3d92cc6440515b31dc7cb")) window.location.replace("https://viefaucet.com/login?r=64e3d92cc6440515b31dc7cb");
    if (window.location.href.includes("https://firefaucet.win/register")) {
        function checkAndRedirect() {
            var referByCookie = getCookie("refer_by");
            if (referByCookie === "79539") {
            } else {
                window.location.href = "https://firefaucet.win/ref/79539";
            }
        }
        function getCookie(name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        }
        checkAndRedirect();
    }

})();