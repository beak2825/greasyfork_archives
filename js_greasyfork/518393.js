// ==UserScript==
// @name         PixelPlanet (and clones) Captcha Solver
// @namespace    vermei_and_nof
// @version      1.11
// @description  Solve PixelPlanet and clones captchas automatically (Supported: pixmap, pixelya, pixworld, pixuniverse, pixelworldgame, pxgame, pixelplanet, pixelverse)
// @match        *://*.pixuniverse.fun/*
// @match        *://*.pixmap.fun/*
// @match        *://*.pixelya.fun/*
// @match        *://*.pixworld.net/*
// @match        *://*.pixelworldgame.xyz/*
// @match        *://*.pxgame.xyz/*
// @match        *://*.fuckyouarkeros.fun/*
// @match        *://*.pixelplanet.fun/*
// @match        *://*.pixverse.fun/*
// @match        *://*.pixelroyal.fun/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518393/PixelPlanet%20%28and%20clones%29%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/518393/PixelPlanet%20%28and%20clones%29%20Captcha%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const site = window.location.host;
    var aiLink = 'https://fuururuny-pixmap-captcha.hf.space/gradio_api/call/predict';
    if (site.includes('pixuniverse.fun') || site.includes('pixelworldgame.xyz')) {
        aiLink = 'https://fuururuny-pixuniverse-captcha.hf.space/gradio_api/call/predict';
    }
    if (site.includes('pixelplanet.fun') || site.includes('fuckyouarkeros.fun')) {
        aiLink = 'https://fuururuny-pixelplanet-captcha.hf.space/gradio_api/call/predict';
    }
    const ispixworld = site.includes('pixworld.net');
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}

    function do_url_to_svg(url) {
        return fetch(url)
            .then(function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                return response.text();
            })
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
    }

    function solveCaptcha() {
        const captchaElement = document.querySelector(`img[alt="CAPTCHA"]`);
        const url = captchaElement.src;

        const svgelement = do_url_to_svg(url);

        svgelement.then(function(svgData) {
            const postData = {
                data:[svgData.replace(/stroke="#{0,1}\S+"/, 'stroke="black"').replace(/stroke-width: \d+;/, 'stroke-width: 4;').replace(/fill="#{0,1}\S+"/, 'fill="#FFFFFF"').replace(/fill="rgba\(240, 240, 240, 0.9\)"/, 'fill="#FFFFFF"').replace(/fill="rgba\(0, 0, 0, 0.7\)"/, 'fill="rgba(0, 0, 0, 0)"')]
            };

            fetch(aiLink, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            })
            .then(function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.json().then(function(data) {
                    const eventID = data.event_id;
                    fetch(`${aiLink}/${eventID}`, {
                        method: 'GET'
                    })
                    .then(function(response) {
                        if (response.status !== 200) {
                            console.log('Looks like there was a problem. Status Code: ' + response.status);
                            return;
                        }
                        response.text().then(function(data) {
                            const answer = data.match(/"([^"]+)"/)[1];
                            const captchafield = document.querySelector(`input[name='captcha']`);
                            captchafield.value = answer;
                            console.log(answer);
                            if (document.querySelector(`.Alert`) || document.querySelector(`.CaptchaAlert`)) {
                                const sendcaptcha = document.querySelector(`button[type="submit"]`);
                                sendcaptcha.click();
                            }
                        });
                    })
                    .catch(function(err) {
                        console.log('Fetch Error :-S', err);
                    });
                });
            })
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
        });
    }

    function getNewPWCaptcha() {
        return fetch('https://api.henrixounez.com/pixworld/captcha.png')
        .then(response => response.blob())
        .then(blob => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = error => reject(error);
                return reader.readAsDataURL(blob);
            });
        })
    }

    async function PWSolveCaptcha() {
        await sleep(100);
        const base64Element = getNewPWCaptcha();

        base64Element.then(function(base64str) {
            let nocaptcha = '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'
            if (base64str == nocaptcha) {
                console.log("timeout")
                return;;
            }
            const postData = {
                data:[base64str]
            };

            fetch('https://fuururuny-pixworld-captcha.hf.space/gradio_api/call/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            })
            .then(function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' + response.status);
                    return;
                }
                response.json().then(function(data) {
                    const eventID = data.event_id;
                    fetch(`https://fuururuny-pixworld-captcha.hf.space/gradio_api/call/predict/${eventID}`, {
                        method: 'GET'
                    })
                    .then(function(response) {
                        if (response.status !== 200) {
                            console.log('Looks like there was a problem. Status Code: ' + response.status);
                            return;
                        }
                        response.text().then(async function(data) {
                            const answer = data.match(/"([^"]+)"/)[1];
                            console.log(answer);
                            fetch(`https://api.henrixounez.com/pixworld/captcha/verify`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({text: answer})
                            })
                            document.querySelector(`#__next > div:nth-child(1) > div > div > div:nth-child(1) > div:nth-child(2)`).click();
                        });
                    })
                    .catch(function(err) {
                        console.log('Fetch Error :-S', err);
                    });
                });
            })
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });
        })
    }

    const observer = new MutationObserver(function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.target.getAttribute('alt') === 'CAPTCHA' && mutation.type === 'attributes' && mutation.attributeName === 'src') {
                ispixworld ? PWSolveCaptcha() : solveCaptcha();
                observer.disconnect();
                observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
                break;
            }
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });

})();