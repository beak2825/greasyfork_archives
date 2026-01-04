    // ==UserScript==
    // @name         Fttronn -TesteScriptAlpha- PTC, Madfaucet, Shortlinks, Autofaucet 
    // @namespace    http://tampermonkey.net/
    // @version      1.1 
    // @author       M-B-I
    // @match        https://faucettronn.click/*
    // @match        https://adsy.pw/*
    // @match        https://coinsl.click/*
    // @match        https://g0.hatelink.me/*
    // @match        https://blogmado.com/*
    // @match        https://bitcrypto.info/*
    // @match        https://tii.la/*
    // @match        https://shrinke.me/*
    // @match        https://techgeek.digital/*
    // @match        https://terafly.me/*
    // @match        https://cryptosh.pro/*
    // @match        https://short.freeltc.top/*
    // @match        https://clik.pw/*
    // @match        https://go.theconomy.me/*
    // @match        https://www.google.com/undefined*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=faucettronn.click
    // @icon         *://*google.com/s2/favicons?sz=64&domain=cloudflare.com/*
    // @match        *://*challenges.cloudflare.com/*
    // @description  -TesteScriptAlpha- PTC, Madfaucet, Shortlinks, Autofaucet.
    // @license       MIT
    // @grant        GM_setValue
    // @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/473587/Fttronn%20-TesteScriptAlpha-%20PTC%2C%20Madfaucet%2C%20Shortlinks%2C%20Autofaucet.user.js
// @updateURL https://update.greasyfork.org/scripts/473587/Fttronn%20-TesteScriptAlpha-%20PTC%2C%20Madfaucet%2C%20Shortlinks%2C%20Autofaucet.meta.js
    // ==/UserScript==
    
    // Descrição: -TesteScriptAlpha-
    // Preenchimento de Login Automático: O script preenche automaticamente campos de login com as informações fornecidas.
    // Clique Automático em Botões: Clica automaticamente em botões específicos em intervalos definidos.
    // Remoção de Elementos: Remove áreas específicas da página.
    // Resolução de Captchas: Lida com vários tipos de captchas, incluindo "CloudFlare Challenge" para permitir a continuação do processo.
    // Contador de Recarregamento: Exibe um contador regressivo antes de recarregar a página para continuar as atividades automatizadas.
    // Redirecionamentos Inteligentes: Realiza redirecionamentos com base em condições, como limite diário alcançado ou falta de energia.
    
    
    
    (function() {
        'use strict';
        // Dados de login
        var email = 'yourname@gmail.com'; ////EXAMPLE@gmail.com////
        var password = 'password'; ////EXAMPLE@gmail.com////
    
        // Redirecionamento para o login com atraso de 3 segundos
        if (window.location.href === "https://faucettronn.click/") {
            setTimeout(function() {
                window.location.replace("https://faucettronn.click/login");
            }, 3000);
        }
    
        if(window.location.href.includes("https://faucettronn.click/login")){
            setInterval(function() {
                if (document.querySelector("input[name='email']")) {
                    document.querySelector("input[name='email']").value = email;
                }
                if (document.querySelector("input[name='password']")) {
                    document.querySelector("input[name='password']").value = password;
                }
                if (document.querySelector("button[type='submit']")) {
                    document.querySelector("button[type='submit']").click();
                }
            }, 15000);
        }
        var loadTimeout = 5000;
        function removeAreasByNames(names) {
            var elements = document.querySelectorAll('.col-lg-3 > .card');
            elements.forEach(function(element) {
                var elementText = element.textContent.trim();
                names.forEach(function(name) {
                    if (elementText.includes(name)) {
                        element.parentElement.remove();
                    }
                });
            });
        }
        var namesToRemove = [
            'Softindex.website', 'kingbit', 'Cpm', 'Clurl', 'Short1', 'Cutp', 'Exalink', 'Megaurl', 'Clicksfly.com',
            'Clks.pro', 'Oii.io', 'Shortox.com', 'Mtraffics.com', 'Upshrink.com', 'Fc-Lc', 'Ctr', 'Flyad', 'Insfly', 'Cuty',
            'Shortino.link', 'Promo-visits.site', 'Gain', 'Link4m.co', 'Link2m.com', 'Ez4short.com', 'Za.gl', 'Viply', 'Adlink.click',
            'Celinks.net', 'Exe', 'Ayelads.com',
            '1shorten.com', 'Adshort', //Temp...
            // ... (outras áreas a serem removidas)
        ];
        removeAreasByNames(namesToRemove);
        
        var dashboardLoaded = false;
        var dashboardInterval = setInterval(function() {
            if (dashboardLoaded || document.readyState !== 'complete') return;
            dashboardLoaded = true;
            clearInterval(dashboardInterval);
            if (window.location.href.includes("https://faucettronn.click/dashboard")) {
                window.location.replace("https://faucettronn.click/madfaucet");
            }
        }, loadTimeout);
         function performClick(selector) {
                    var element = document.querySelector(selector);
                    if (element) {
                        element.click();
                    }
                }
                setTimeout(function() {
                    performClick('body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled');
                }, 2500);
    
    
        const notificationElement = document.createElement('div');
        notificationElement.style.position = 'fixed';
        notificationElement.style.top = '0';
        notificationElement.style.left = '67%';
        notificationElement.style.width = '30%';
        notificationElement.style.backgroundColor = '#f0f0f0';
        notificationElement.style.padding = '10px';
        notificationElement.style.fontSize = '18px';
        notificationElement.style.textAlign = 'center';
        notificationElement.style.zIndex = '9999';
        notificationElement.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.2)';
        notificationElement.style.borderRadius = '0 0 5px 5px';
        notificationElement.style.display = 'none'; // Start hidden
        document.body.appendChild(notificationElement);
    
        function displayNotification(message, duration) {
            notificationElement.textContent = message;
            notificationElement.style.display = 'block';
            setTimeout(() => {
                notificationElement.style.display = 'none';
            }, duration);
        }
        let captchaResolved = false;
        let captchaNotFound = false;
    
        function verificaCloudflareCaptcha() {
            const captchaElement = document.querySelector("input[name='cf-turnstile-response']");
            if (captchaElement && !captchaResolved) {
                displayNotification("Turnstile Ok!", 3500);
                captchaResolved = true;
            }
            return captchaResolved;
        }
        function checkCaptcha() {
            return new Promise((resolve, reject) => {
                if (!captchaResolved && typeof grecaptcha !== "undefined" && typeof grecaptcha.getResponse === "function") {
                    const response = grecaptcha.getResponse();
                    if (response && response.length > 0) {
                        captchaResolved = true;
                        displayNotification("Captcha resolved!", 3500);
                        resolve(true);
                    } else {
                        if (captchaNotFound) {
                            captchaResolved = true;
                            resolve(true);
                        }
                        displayNotification("Waiting for captcha resolution..", 4500);
                        resolve(false);
                    }
                } else {
                    const cloudflareCaptchaResolved = verificaCloudflareCaptcha();
                    resolve(cloudflareCaptchaResolved);
                }
            });
        }
        let invalidCaptchaCount = 0;
        async function searchForInvalidCaptcha() {
            const searchText = "Invalid Captcha..";
            const maxSearchCount = 6;
            while (invalidCaptchaCount < maxSearchCount) {
                await new Promise(resolve => setTimeout(resolve, 7000));
                const pageText = document.body.innerText;
                if (pageText.includes(searchText)) {
                    invalidCaptchaCount++;
                    displayNotification(`Found "${searchText}" ${invalidCaptchaCount} Vezes.`);
                    if (invalidCaptchaCount >= maxSearchCount) {
                        displayNotification(`Found "${searchText}" ${maxSearchCount} Vezes. Parando o script.`);
                        return;
                    }
                }
            }
        }
        async function main() {
            const result = await checkCaptcha();
            if (result) {
                await searchForInvalidCaptcha();
            }
        }
        main();
        function showMessage(message) {
            var allowedPages = [
                "https://faucettronn.click/dashboard",
                "https://faucettronn.click/links",
                "https://faucettronn.click/madfaucet",
            ];
            if (allowedPages.includes(window.location.href)) {
                var messageDiv = document.createElement('div');
                messageDiv.textContent = message;
                messageDiv.style.position = 'fixed';
                messageDiv.style.top = '6%';
                messageDiv.style.left = '50%';
                messageDiv.style.transform = 'translate(-40%, -80%)';
                messageDiv.style.padding = '14px';
                messageDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
                messageDiv.style.color = 'white';
                messageDiv.style.zIndex = '9999';
                document.body.appendChild(messageDiv);
                setTimeout(function() {
                    document.body.removeChild(messageDiv);
                }, 6000);
            }
        }
        showMessage(" !! Active Script !!");
        var madfaucetFunctionsExecuted = false;
        if (window.location.href.includes("https://faucettronn.click/madfaucet")) {
            var faucetAttempts = 0;
            var maxFaucetAttempts = 5;
            // Redirecionar após recarregar se ainda houver tentativas sem sucesso
            var faucetRedirectionTimeout = setTimeout(function() {
                if (faucetAttempts >= maxFaucetAttempts) {
                    window.location.replace("https://faucettronn.click/ptc");
                }
            }, 3000 * maxFaucetAttempts + 2000);
            var faucetInterval = setInterval(function() {
                if (checkCaptcha()) {
                    var btnPrimary = document.querySelector(".btn.btn-primary.btn-lg");
                    var claimBtn = document.evaluate("/html/body/main/div[1]/div[2]/div/div/div[4]/div[1]/form/button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (btnPrimary) {
                        btnPrimary.click();
                    } else if (claimBtn) {
                        claimBtn.click();
                    }
                    faucetAttempts++;
                    // Verificar se o máximo de tentativas foi atingido
                    if (faucetAttempts >= maxFaucetAttempts) {
                        clearInterval(faucetInterval);
                        clearTimeout(faucetRedirectionTimeout);
                        madfaucetFunctionsExecuted = true;
                    }
                }
            }, 20000);
        }
        setTimeout(function() {
            if (madfaucetFunctionsExecuted) {
                window.location.replace("https://faucettronn.click/ptc");
            }
        }, 50000);
          ////////PTC//////
        if (window.location.href === "https://faucettronn.click/ptc") {
            if (document.querySelector(".btn.btn-primary.btn-block")) {
                setTimeout(function() {
                    var btnPrimary = document.querySelector(".btn.btn-primary.btn-block");
                    btnPrimary.click();
                    setTimeout(function() {
                        var notClick = !document.querySelector(".btn.btn-primary.btn-block");
                        if (notClick) {
                            window.location.replace("https://faucettronn.click/ptc");
                        }
                    }, 3500);
                }, 5000);
            }
        }
        ///// PTC VIEW//////
        function checkAndClick() {
            var recaptchaDiv = document.getElementById('ptcCountdown').innerText === "0 second";
            if (recaptchaDiv) {
                setTimeout(() => {
                    checkCaptcha().then(result => {
                        if (result) {
                            var btnPrimary = document.querySelector(".btn.btn-success.btn-block");
                            if (btnPrimary) {
                                btnPrimary.click();
                            }
                        }
                    });
                }, 1500);
            }
        }
        var maxTime = 50 * 1000;
        var startTime = Date.now();
        function checkLoop() {
            var currentTime = Date.now();
            if (currentTime - startTime >= maxTime) {
                clearInterval(interval);
                window.location.replace("https://faucettronn.click/ptc");
            } else {
                checkAndClick();
            }
        }
        ///// CloudFlare Challenge//////
        setInterval(function(){
            document.querySelector("#cf-stage > div.ctp-checkbox-container > label > span")?.click();
        },7500);
        setInterval(function(){
            document.querySelector("input[value='Verify you are human']")?.click();
            //document.querySelector('#challenge-stage')?.querySelector('input[type="checkbox"]')?.click();
            document.querySelector('.ctp-checkbox-label')?.click();
        },4000);
    
        if (window.location.href.includes("https://faucettronn.click/ptc/view")) {
            checkLoop();
            var interval = setInterval(checkLoop, 4500);
        }
        ////Redirecionamento////
        if (window.location.href.includes("https://faucettronn.click/madfaucet") && document.getElementById('second')) {
            setTimeout(function() {
                window.location.replace("https://faucettronn.click/ptc");
            }, 25000);
        }
        if (window.location.href.includes("https://faucettronn.click/ptc") && document.body.innerHTML.includes("There is PTC Ad left")){
            window.location.replace("https://faucettronn.click/links")}
        if (window.location.href.includes("https://faucettronn.click/links") && document.body.innerHTML.includes("There is no link left")){
            window.location.replace("https://faucettronn.click/madfaucet")}
        if(window.location.href.includes("https://faucettronn.click/madfaucet") && document.body.innerHTML.includes("Daily limit reached")){
            window.location.replace("https://faucettronn.click/auto")}
        if(window.location.href.includes("https://faucettronn.click/auto") && document.body.innerHTML.includes("You don't have enough energy for Auto Faucet!")){
            setTimeout(function() {
                window.location.replace("https://faucettronn.click/madfaucet");
            }, 10000);
        }
    
        var consecutiveChild1Count = 0;
        var maxConsecutiveChild1 = 5;
        var resetTimeLimit = 4 * 60 * 60 * 1000;
        function getCurrentTime() {
            return new Date().getTime();
        }
        function resetCounterAndMarkTime() {
            consecutiveChild1Count = 0;
            localStorage.setItem('resetTime', getCurrentTime());
        }
        function checkResetTime() {
            var resetTime = localStorage.getItem('resetTime');
            if (!resetTime || (getCurrentTime() - resetTime > resetTimeLimit)) {
                resetCounterAndMarkTime();
            }
        }
        if (window.location.href.includes("https://faucettronn.click/null")) {
            window.location.replace("https://faucettronn.click/auto");
        } else {
            setTimeout(function() {
                var randomChildIndex = Math.floor(Math.random() * 6) + 1;
                var button = document.querySelector(`.col-lg-3:nth-child(${randomChildIndex}) .btn`);
                if (!button) {
                    randomChildIndex = 1;
                    button = document.querySelector(`.col-lg-3:nth-child(${randomChildIndex}) .btn`);
                    if (consecutiveChild1Count >= maxConsecutiveChild1) {
                        showMessage(`Child(1) consecutivo: ${consecutiveChild1Count}`);
                        window.location.replace("https://faucettronn.click/auto");
                    } else {
                        consecutiveChild1Count++;
                    }
                } else {
                    consecutiveChild1Count = 0;
                }
                if (button) {
                    var link = button.getAttribute('href');
                    setTimeout(function() {
                        window.location.href = link;
                    }, 3500);
                    checkResetTime();
                }
            }, 8);
        }
        const allowedPages2 = [
            "https://adsy.pw/",
            'https://coinsl.click/',
            'https://g0.hatelink.me/',
            'https://blogmado.com/',
            'https://bitcrypto.info/',
            'https://tii.la/',
            'https://shrinke.me/',
            'https://techgeek.digital/',
            'https://terafly.me/',
            'https://cryptosh.pro/',
            'https://short.freeltc.top/',
            'https://clik.pw/',
            'https://go.theconomy.me/',
        ];
        let countdown = 75; // Inicializar o contador com 75 segundos
        function reloadPageAfterTimeout(timeout) {
            setTimeout(function() {
                location.reload();
            }, timeout);
        }
        function forceReload() {
            window.stop(); // Parar o carregamento atual
            location.reload();
        }
        function updateCounter() {
            displayNotification(`Reloading in  ${countdown} seconds...`, 1000);
            countdown--;
            if (countdown >= 0) {
                setTimeout(updateCounter, 1000);
            } else {
                forceReload();
            }
        }
        if (allowedPages2.some(url => window.location.href.includes(url))) {
            setTimeout(updateCounter, 5000);
            reloadPageAfterTimeout(90000);
        }
        const allowedPages3 = [
            "https://www.google.com/undefined",
            'https://techgeek.digital/',
        ];
        function goBackTwoPagesAfterTimeout(timeout) {
            setTimeout(function() {
                history.go(-2); // Voltar duas páginas
            }, timeout);
        }
        if (allowedPages3.some(url => window.location.href.includes(url))) {
            goBackTwoPagesAfterTimeout(15000);
        }
    
        // Lista de URLs das páginas que você deseja incluir
        const allowedPages4 = [
            "https://bitcrypto.info",
            "https://oko.sh/",
            "https://techgeek.digital/",
            "https://exego.app/"
            ];
        if (allowedPages4.some(url => window.location.href.includes(url))) {
            function performClick(selector) {
                var element = document.querySelector(selector);
                if (element) {
                    element.click();
                }
            }
            function clickIfCaptchaOK() {
                if (checkCaptcha()) {
                    performClick('#wpsafe-generate > a > img');
                    performClick('#wpsafe-link > a > imgg');
                    performClick('#outro-elemento > a > img');
                    performClick('#invisibleCaptchaShortlink');
                    performClick('.btn.main.get.link');
                    performClick('#before-captcha > div.flex > button');
                    performClick('//*[@id="invisibleCaptchaShortlink"]');
                    performClick('#wpsafe-link > a > imgg');
                    performClick('#wpsafe-link');
                    performClick('#overlay');
                    performClick('#surl1');
                }
            }
            setInterval(function() {
                clickIfCaptchaOK();
            }, 10000);
        }
        const allowedPages5 = [
            "https://bitcrypto.info",
            "https://oko.sh/",
            "https://techgeek.digital/",
            "https://blogmado.com/"
        ];
        if (allowedPages5.some(url => window.location.href.includes(url))) {
            function performClick(selector) {
                var element = document.querySelector(selector);
                if (element) {
                    element.click();
                }
            }
            function clickIfCaptchaOK2() {
                performClick('#wpsafe-generate > a > img');
                performClick('#wpsafe-link > a > img');
                performClick('#outro-elemento > a > img');
                performClick('#invisibleCaptchaShortlink');
                performClick('#other-element > a > img');
                performClick('#before-captcha > div.flex > button');
                performClick('#before-captcha > div.flex > button > svg');
                performClick('//*[@id="before-captcha"]/div[2]/button');
                performClick('#wpsafe-link');
                performClick('#overlay');
                performClick('#surl1');
                performClick('#link-view > a:nth-child(7) > img');
                performClick('#lview > form > center > button');
                performClick('#lview > form > center > button > i');
                performClick('//*[@id="lview"]/form/center/button/text(Click here to continue)');
                performClick('//*[@id="lview"]/form/center/button/text()');
            }
            setInterval(function() {
                clickIfCaptchaOK2();
            }, 10000);
        }
    
    })();
    
