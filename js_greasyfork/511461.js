// ==UserScript==
// @name         Shortlink Dodger
// @namespace    Shortlink Dodger
// @version      1.1
// @description  Quickly bypasses shortlinks to enhance your browsing experience. This script automatically navigates through common URL shorteners, saving you time and hassle with every click.
// @author       AmineDev
// @license      All Rights Reserved
// @icon         https://i.ibb.co/N3cwK3X/shortlink-dodger.png
// @match        *://*/recaptcha/*
// @match        *://tpi.li/*
// @match        *://blogmystt.com/*
// @match        *://cety.app/*
// @match        *://fc-lc.xyz/*
// @match        *://gamezizo.com/*
// @match        *://forex-trnd.com/*
// @match        *://falpus.com/*
// @match        *://oii.la/*
// @match        *://wp2hostt.com/*
// @match        *://expertvn.com/*
// @match        *://ielts-isa.edu.vn/*
// @match        *://handydecor.com.vn/*
// @match        *://top10cafe.se/*
// @match        *://*.mega*.in/*
// @match        *://mitly.us/*
// @match        *://*.sonjuegosgratis.com/*
// @match        *://autodime.com/*
// @match        *://linx.cc/*
// @match        *://surflink.tech/*
// @match        *://coincroco.com/*
// @match        *://sox.link/*
// @match        *://shrinkme.ink/*
// @match        *://themezon.net/*
// @match        *://en.mrproblogger.com/*
// @match        *://oii.io/*
// @match        *://tmail.io/*
// @match        *://*linksly.co/*
// @match        *://mrproblogger.com/*
// @match        *://m.imagenesderopaparaperros.com/*
// @match        *://fx4ever.com/*
// @match        *://fx-22.com/*
// @match        *://gold-24.net/*
// @match        *://forexrw7.com/*
// @match        *://linkjust.com/*
// @match        *://carewave.xyz/*
// @match        *://insfly.pw/*
// @match        *://pubprofit.in/*
// @match        *://worldnewsestate.com/*
// @match        *://sabarpratham.in/*
// @match        *://tlin.me/*
// @match        *://bioinflu.com/*
// @match        *://cryptosparatodos.com/*
// @match        *://go.tfly.link/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/511461/Shortlink%20Dodger.user.js
// @updateURL https://update.greasyfork.org/scripts/511461/Shortlink%20Dodger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const elementSelectors = [
        { domain: 'tpi.li', selectors: ['Continue', 'Get Link'] },
        { domain: 'blogmystt.com', selectors: ['Get link here'] },
        { domain: 'shrinkme.ink', selectors: ['Click here to continue'] },
        { domain: 'themezon.net', selectors: ['Continue', 'Go To Url'] },
        { domain: 'en.mrproblogger.com', selectors: ['Get Link'] },
        { domain: 'cety.app', selectors: ['Continue', 'I am not a robot', 'Go ->'] },
        { domain: 'fc-lc.xyz', selectors: ['Click here to continue'] },
        { domain: 'gamezizo.com', selectors: ['Click To Verify', 'Continue...'] },
        { domain: 'forex-trnd.com', selectors: ['[type="submit"][name="verify"]', 'Get Link'] },
        { domain: 'falpus.com', selectors: ['Continue', 'I am not a robot', 'Get Link'] },
        { domain: 'oii.la', selectors: ['Continue', 'Get Link'] },
        { domain: 'wp2hostt.com', selectors: ['Get link here'] },
        { domain: 'get.megaurl.in', selectors: ['Get Link'] },
        { domain: 'get.megafly.in', selectors: ['Get Link'] },
        { domain: 'www.sonjuegosgratis.com', selectors: ['#shortShort'] },
        { domain: 'autodime.com', selectors: ['Next - Continue', 'Click here to Continue'] },
        { domain: 'linx.cc', selectors: ['Get Link'] },
        { domain: 'sox.link', selectors: ['Get Link'] },
        { domain: 'linksly.co', selectors: ['Human Verification'] },
        { domain: 'go.linksly.co', selectors: ['Get Link'] },
        { domain: 'm.imagenesderopaparaperros.com', selectors: ['Get Link', 'Ir al enlace'] },
        { domain: 'linkjust.com', selectors: ['#click'] },
        { domain: 'insfly.pw', selectors: ['Get Link'] },
        { domain: 'bioinflu.com', selectors: ['[alt="generate text"]', '[alt="image3"]'] },
        { domain: 'cryptosparatodos.com', selectors: ['[alt="generate text"]', '[alt="image3"]'] },
        { domain: 'tlin.me', selectors: ['Get Link'] },
        { domain: 'go.tfly.link', selectors: ['Get Link'] },
    ];

    function autoClick() {
        const currentDomain = window.location.hostname;

        elementSelectors.forEach(item => {
            if (item.domain === currentDomain) {
                item.selectors.forEach(selector => {
                    if (selector.startsWith('#') || selector.startsWith('.') || selector.startsWith('[')) {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(element => {
                            if (element.tagName.toLowerCase() === 'input' && element.type === 'hidden') {
                                const shortLinkValue = element.value;
                                window.location.href = shortLinkValue;
                            } else {
                                const link = element.getAttribute('href');
                                if (link) {
                                    window.location.href = link;
                                } else {
                                    element.click();
                                }
                            }
                        });
                    } else {
                        const elements = [...document.body.querySelectorAll('*')].filter(el => el.textContent.trim() === selector);
                        elements.forEach(element => {
                            const link = element.getAttribute('href');
                            if (link) {
                                window.location.href = link;
                            } else {
                                element.click();
                            }
                        });
                    }
                });
            }
        });
    }

    function repeatedClick(selectorsWithInterval, targetDomain) {
        const currentDomain = window.location.hostname;

        if (currentDomain === targetDomain) {
            selectorsWithInterval.forEach(({ selector, interval }) => {
                const elements = document.querySelectorAll(selector);
                const clickInterval = setInterval(() => {
                    elements.forEach(element => {
                        element.click();
                    });
                }, interval);

                if (typeof selector === 'string' && !selector.startsWith('#') && !selector.startsWith('.') && !selector.startsWith('[')) {
                    const textElements = [...document.body.querySelectorAll('*')].filter(el => el.textContent.trim() === selector);
                    const textInterval = setInterval(() => {
                        textElements.forEach(element => {
                            element.click();
                        });
                    }, interval);
                }
            });
        }
    }

    function delayedClick(selectorsWithDelays, targetDomain) {
        const currentDomain = window.location.hostname;

        if (currentDomain === targetDomain) {
            selectorsWithDelays.forEach(({ selector, delay }) => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    setTimeout(() => {
                        const link = element.getAttribute('href');
                        if (link) {
                            window.location.href = link;
                        } else {
                            element.click();
                        }
                    }, delay);
                });

                if (typeof selector === 'string' && !selector.startsWith('#') && !selector.startsWith('.') && !selector.startsWith('[')) {
                    const textElements = [...document.body.querySelectorAll('*')].filter(el => el.textContent.trim() === selector);
                    textElements.forEach(element => {
                        setTimeout(() => {
                            const link = element.getAttribute('href');
                            if (link) {
                                window.location.href = link;
                            } else {
                                element.click();
                            }
                        }, delay);
                    });
                }
            });
        }
    }

    autoClick();

    repeatedClick([{ selector: 'a.btn.btn-sm.btn-success.m-2', interval: 5000 }], 'gamezizo.com');
    repeatedClick([{ selector: 'a.btn.btn-success.btn-lg.get-link', interval: 2000 }], 'mitly.us');
    repeatedClick([{ selector: 'Getlink', interval: 2000 }, { selector: 'Getlink', interval: 2000 }], 'handydecor.com.vn');
    repeatedClick([{ selector: 'Getlink', interval: 2000 }, { selector: 'Getlink', interval: 2000 }], 'expertvn.com');
    repeatedClick([{ selector: 'Getlink', interval: 2000 }, { selector: 'Getlink', interval: 2000 }], 'ielts-isa.edu.vn');

    delayedClick([{ selector: 'Click here to continue', delay: 17000 }], 'gamezizo.com');
    delayedClick([{ selector: 'Click here to continue', delay: 27000 }], 'handydecor.com.vn');
    delayedClick([{ selector: 'Click here to continue', delay: 27000 }], 'expertvn.com');
    delayedClick([{ selector: 'Click here to continue', delay: 27000 }], 'ielts-isa.edu.vn');
    delayedClick([{ selector: 'Click here to continue', delay: 30000 }, { selector: 'Continue', delay: 30000 }], 'pubprofit.in');
    delayedClick([{ selector: 'Click here to continue', delay: 30000 }, { selector: 'Continue', delay: 30000 }], 'worldnewsestate.com');
    delayedClick([{ selector: 'Click here to continue', delay: 30000 }, { selector: 'Continue', delay: 30000 }], 'sabarpratham.in');
    delayedClick([{ selector: 'Click here to continue', delay: 1000 }], 'mitly.us');
    delayedClick([{ selector: 'Show Captcha Verification', delay: 17000 }, { selector: '[onclick="redirectfex()"]', delay: 17000 }], 'surflink.tech');
    delayedClick([{ selector: '[onclick="redirectfex()"]', delay: 12000 }], 'coincroco.com');
    delayedClick([{ selector: '#btn2', delay: 5000 }, { selector: '#tp-snp2', delay: 5000 }], 'mrproblogger.com');
    delayedClick([{ selector: 'Next', delay: 5000 }], 'fx4ever.com');
    delayedClick([{ selector: '#nextbutton', delay: 5000 }], 'fx-22.com');
    delayedClick([{ selector: '#nextbutton', delay: 5000 }], 'gold-24.net');
    delayedClick([{ selector: '#nextbutton', delay: 5000 }], 'forexrw7.com');
    delayedClick([{ selector: '#ad', delay: 24000 }], 'carewave.xyz');

    function autoClickRecaptcha() {
        const recaptcha = document.querySelector('.recaptcha-checkbox-border');
        if (recaptcha) {
            recaptcha.click();
        }
    }

    function isTurnstilePresent() {
        return document.querySelector('.zone-name-title.h1') !== null;
    }

    const intervalId = setInterval(() => {
        if (isTurnstilePresent()) {
            clearInterval(intervalId);
            return;
        }

        const recaptcha = document.querySelector('.recaptcha-checkbox-border');
        if (recaptcha) {
            autoClickRecaptcha();
            if (grecaptcha && grecaptcha.getResponse().length > 0) {
                autoClick();
                clearInterval(intervalId);
            }
        } else {
            autoClick();
            delayedClick([{ selector: 'Click here to continue', delay: 100 }], 'get.megaurl.in');
            delayedClick([{ selector: 'Click here to continue', delay: 100 }], 'get.megafly.in');
            delayedClick([{ selector: 'Click here to continue', delay: 100 }], 'mitly.us');
            delayedClick([{ selector: '#invisibleCaptchaShortlink', delay: 100 }], 'm.imagenesderopaparaperros.com');
            delayedClick([{ selector: 'Click here to continue', delay: 100 }], 'tlin.me');
            delayedClick([{ selector: 'Click here to continue', delay: 100 }], 'go.tfly.link');
        }
    }, 3000);

})();

(function() {
    'use strict';

    const domainSelectors = {
        'tlin.me': [
            'html:nth-of-type(1) > body:nth-of-type(1) > div:nth-of-type(2)',
        ],
        'go.tfly.link': [
            'html:nth-of-type(1) > body:nth-of-type(1) > div:nth-of-type(2)',
        ]
    };

    function blockElements() {
        const currentDomain = window.location.hostname;
        const selectors = domainSelectors[currentDomain];

        if (selectors) {
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    element.remove();
                });
            });
        }
    }

    window.addEventListener('load', blockElements);
})();