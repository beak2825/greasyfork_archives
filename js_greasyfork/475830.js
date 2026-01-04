// ==UserScript==
// @name         Blog24
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Faucet
// @author       White
// @match        https://blog24.me/ada/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blog24.me
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/475830/Blog24.user.js
// @updateURL https://update.greasyfork.org/scripts/475830/Blog24.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let email = "email";
    var multicoinmode = localStorage.getItem('multicoinmode') || "no";
    let claimCount = 0;
    let lastClaimCurrency = null;


    const claimUrls = ["btc","bch","doge","dgb","eth","ltc","sol","trx","bnb","zec","xrp","matic","fey","usdt","dash"]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const redirectToNextURL = async () => {
    const currentURL = window.location.pathname;
    const urlParts = currentURL.split('/');
    const lastPart = urlParts[urlParts.length - 1];

    if (!isNaN(lastPart)) {
        return;
    }

    for (let i = 0; i < claimUrls.length; i++) {
        if (currentURL.includes(claimUrls[i])) {
            const nextIndex = (i + 1) % claimUrls.length;
            const nextURL = claimUrls[nextIndex];
            try {
                await delay(5000);
                window.location.href = `https://blog24.me/ada/faucet/currency/${nextURL}`;

                salvarUltimaMoedaReivindicada(claimUrls[i]);
            } catch (error) {
                console.error('Error redirecting to the next URL:', error);
            }

            break;
        }
    }
};

function salvarUltimaMoedaReivindicada(moeda) {
    lastClaimCurrency = moeda;
    localStorage.setItem('lastClaimCurrency', lastClaimCurrency);
}
const checkPageAndRedirect = () => {
    const pageText = document.body.innerText.trim().toLowerCase();
    const errorMessage = ["please comeback again tomorrow.", "empty", "Empty", "wait"];
    const errorMessage1 = ["please comeback again tomorrow.", "empty", "Empty"];

    if (multicoinmode === "no" && errorMessage1.some(msg => pageText.includes(msg))) {
        redirectToNextURL();
    }

    if (multicoinmode === "yes" && errorMessage.some(msg => pageText.includes(msg))) {
        redirectToNextURL();
    }
};


const claimUrlPrefix = "https://blog24.me/ada/faucet/currency/";

async function init() {
    const targetUrl = "https://blog24.me/ada/?r=744";

    if (window.location.href === targetUrl) {
        setTimeout(async () => {
            try {
                const loggedIn = await isLoggedIn();
                if (loggedIn) {
                    const currentCurrency = getCurrentCurrencyFromURL();
                    const lastClaimUrl = await getLastClaimUrl(currentCurrency);

                    if (lastClaimUrl) {
                        window.location.href = lastClaimUrl;
                    } else {
                        const claimUrl = localStorage.getItem('claimUrl');
                        if (claimUrl && claimUrl.startsWith(claimUrlPrefix)) {
                            window.location.href = claimUrl;
                        } else {
                            redirectToRandomURL();
                        }
                    }
                } else {
                    await handleLogin();
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }, 10000);
    }
}

function salvarUrl() {
    const url = window.location.href;

    const isClaimUrl = claimUrls.some(claimUrl => url.includes(`${claimUrlPrefix}${claimUrl}`));

    if (isClaimUrl) {

        localStorage.setItem('claimUrl', url);
    }
}
function getCurrentCurrencyFromURL() {
    const currentURL = window.location.href;
    const foundCurrency = claimUrls.find(currency => currentURL.includes(currency));
    return foundCurrency || null;
}

function redirectToRandomURL() {
    const randomIndex = Math.floor(Math.random() * claimUrls.length);
    const randomURL = `https://blog24.me/ada/faucet/currency/${claimUrls[randomIndex]}`;
    console.log("Redirecting to a random URL:", randomURL);
    window.location.href = randomURL;
}

async function isLoggedIn() {
    const logoutButton = document.querySelector("button[type='button'][data-toggle='modal'][data-target='#logoutModal'][class='btn btn-outline rounded-pill']");
    return logoutButton !== null;
}

async function getLastClaimUrl(currency) {
    return localStorage.getItem(`lastClaimUrl_${currency}`);
}

async function handleLogin() {
    const loginDelay = 5000
    const mailFormSelector = "input#InputEmail";
    const loginButtonSelector = "button[data-target='#login']:not(.rounded-pill)";
    const submitButtonSelector = "button[type='submit']:not(.rounded-pill)";

    await new Promise(resolve => setTimeout(resolve, loginDelay));

    const mailform = document.querySelector(mailFormSelector);
    const loginbutton = document.querySelector(loginButtonSelector);

    if (loginbutton) {
        loginbutton.click();

        await new Promise(resolve => setTimeout(resolve, loginDelay));

        if (mailform && mailform.value !== email) {
            mailform.value = email;

            await new Promise(resolve => setTimeout(resolve, loginDelay));

            if (mailform && mailform.value === email) {
                const loginbutton2 = document.querySelector(submitButtonSelector);
                loginbutton2.click();
            }
        }
    }
}
   async function firewall() {
    const intervalo = setInterval(async function() {
        if (window.location.href.includes("firewall")) {
            let firewallInterval = setInterval(function() {
                let recaptchav3 = document.querySelector("input#recaptchav3Token");
                let hcaptcha = document.querySelector('.h-captcha > iframe');
                let turnstile = document.querySelector('.cf-turnstile > input');
                let boton = document.querySelector("button[type='submit']");
                if (boton && ((hcaptcha && hcaptcha.hasAttribute('data-hcaptcha-response') && hcaptcha.getAttribute('data-hcaptcha-response').length > 0) || grecaptcha.getResponse().length > 0 || (recaptchav3 && recaptchav3.value.length > 0) || (turnstile && turnstile.value.length > 0))) {
                    boton.click();
                    clearInterval(firewallInterval);
                }
            }, 5000);
        }
    }, 5000);
}
async function Logic() {
    if (multicoinmode === "no") {
        let goclaim = setInterval(function() {
            let boton = document.querySelector("a.btn.btn-primary");
            if (boton && boton.innerText === "Go Claim") {
                setTimeout(() => {
                    window.location.reload();
                    clearInterval(goclaim);
                }, 2000);
            }
        }, 5000);
    }
}
    const toggleMulticoinMode = () => {
        multicoinmode = (multicoinmode === "yes") ? "no" : "yes";
        localStorage.setItem('multicoinmode', multicoinmode);
        console.log("Multicoin mode toggled to:", multicoinmode);

        const confirmationMessage = document.createElement('div');
        confirmationMessage.className = 'confirmation-message';
        confirmationMessage.textContent = `Multicoin mode set to: ${multicoinmode}`;
        document.body.appendChild(confirmationMessage);

        setTimeout(() => {
            confirmationMessage.remove();
        }, 3000);
    };


    const createToggleButton = () => {
        const button = document.createElement('button');
        button.textContent = 'Change Multicoin Mode';
        button.className = 'toggle-button';
        button.addEventListener('click', toggleMulticoinMode);
        return button;
    };

    const addButtonToPage = () => {
        const container = document.querySelector('body');
        const button = createToggleButton();
        container.appendChild(button);

        const styles = `
            .toggle-button {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 9999;
                padding: 10px 20px;
                font-size: 16px;
                background-color: #3498db;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }

            .toggle-button:hover {
                background-color: #2980b9;
            }

            .confirmation-message {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: rgba(0, 0, 0, 0.7);
                color: #fff;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 18px;
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    };
    function redirectIfNeeded() {
  const currentUrl = window.location.href;

  if (currentUrl === "https://blog24.me/ada/" || currentUrl === "https://blog24.me/ada") {
    window.location.href = " https://blog24.me/ada/?r=744";
  }
}
   const displayMetrics = () => {
    const metricsContainer = document.createElement('div');
    metricsContainer.id = 'metrics-container';
    metricsContainer.style.position = 'fixed';
    metricsContainer.style.bottom = '10px';
    metricsContainer.style.left = '10px';
    metricsContainer.style.backgroundColor = '#fff';
    metricsContainer.style.padding = '10px';
    metricsContainer.style.border = '1px solid #ccc';
    metricsContainer.style.borderRadius = '5px';

    metricsContainer.innerHTML = `
        <strong>Metrics:</strong><br>
        Total Claims: ${claimCount}<br>
        Last Claimed Currency: ${lastClaimCurrency || 'None'}
    `;

    document.body.appendChild(metricsContainer);
};
async function iniciarIntervalo(i) {
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.style.width = '0%';
    progressBar.style.height = '10px';
    progressBar.style.backgroundColor = '#3498db';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.zIndex = '9999';

    const loadingMessage = document.createElement('div');
    loadingMessage.id = 'loading-message';
    loadingMessage.style.position = 'fixed';
    loadingMessage.style.top = '15px';
    loadingMessage.style.left = '50%';
    loadingMessage.style.transform = 'translateX(-50%)';
    loadingMessage.style.color = '#3498db';
    loadingMessage.innerText = 'Waiting';

    document.body.appendChild(progressBar);
    document.body.appendChild(loadingMessage);

    const intervalo = setInterval(async () => {
        const boton = document.querySelector("button[id='subbut']");
        if (boton) {
            boton.scrollIntoView({ behavior: 'smooth' });
        }

        if (grecaptcha && grecaptcha.getResponse().length > 0) {
            const progressBarWidth = parseFloat(progressBar.style.width) + 10;
            progressBar.style.width = `${progressBarWidth}%`;

            if (progressBarWidth >= 100) {
                clearInterval(intervalo);
                progressBar.style.display = 'none';
                loadingMessage.innerText = 'Clicking';

                claimCount++;
                lastClaimCurrency = claimUrls[i];
                localStorage.setItem('claimCount', claimCount);
                localStorage.setItem('lastClaimCurrency', lastClaimCurrency);

                document.querySelector('form').submit();
            }
        }
    }, 500);
}
const styles = `
    /* ... (estilos existentes) */

    #progress-bar {
        transition: width 0.3s ease-in-out;
    }

    #loading-message {
        font-size: 16px;
        font-weight: bold;
        padding: 10px;
        background-color: #3498db;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        color: white !important;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
    let lastMidnight = new Date();

const checkAndResetCounter = () => {
    const now = new Date();
    if (now.getDate() !== lastMidnight.getDate()) {

        claimCount = 0;
        lastMidnight = now;
        localStorage.setItem('claimCount', claimCount);
    }
};
function scrollDown() {
    window.scrollBy(0, 100);
}
    const timeoutThreshold = 240000;
let timeoutInterval;

function resetAndReloadPage() {
    clearInterval(timeoutInterval);
    const timeoutContainer = document.createElement('div');
    timeoutContainer.id = 'timeout-container';
    timeoutContainer.style.position = 'fixed';
    timeoutContainer.style.top = '10px';
    timeoutContainer.style.right = '10px';
    timeoutContainer.style.backgroundColor = '#ff0000';
    timeoutContainer.style.color = '#ffffff';
    timeoutContainer.style.padding = '5px';
    timeoutContainer.style.borderRadius = '5px';
    document.body.appendChild(timeoutContainer);

    let timeoutRemaining = Math.ceil(timeoutThreshold / 1000);

    const updateTimeoutDisplay = () => {
        if (timeoutRemaining >= 0) {
            timeoutContainer.innerText = `Timeout in ${timeoutRemaining} seconds`;
            timeoutRemaining--;
        } else {
            window.location.reload();
        }
    };

    timeoutInterval = setInterval(updateTimeoutDisplay, 1000);
    updateTimeoutDisplay();
}

    window.addEventListener('load', () => {
        setInterval(checkAndResetCounter, 60000);
        claimCount = parseInt(localStorage.getItem('claimCount')) || 0;
    lastClaimCurrency = localStorage.getItem('lastClaimCurrency');
        displayMetrics();
        salvarUrl();
        redirectIfNeeded();
        init();
        checkPageAndRedirect();
        firewall();
        Logic();
        addButtonToPage();
        iniciarIntervalo();
        scrollDown();
        resetAndReloadPage();
    });
})();