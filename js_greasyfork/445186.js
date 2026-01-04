// ==UserScript==
// @name         Auto CAPTCHA Solver
// @namespace    https://greasyfork.org/en/users/160457-stan60250
// @version      1.0.3
// @description  Auto fill CAPTCHA on website.
// @author       MapleHuang(stan60250@gmail.com)
// @match        https://isafe.osha.gov.tw/*
// @match        https://nportal.ntut.edu.tw/index.do*
// @match        https://b2bank.yuantabank.com.tw/B2C*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/445186/Auto%20CAPTCHA%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/445186/Auto%20CAPTCHA%20Solver.meta.js
// ==/UserScript==

const LOG_TITLE = '[Auto CAPTCHA Solver]';
const API_URL = 'https://www.twsnail.com/nocaptcha';
const DOMAIN = window.location.hostname;

let captchaImage = undefined;
let textInput = undefined;
let dailogLogin = undefined;

let captchaObserver = undefined;

(function() {
    'use strict';

    logMessage("domain: " + DOMAIN);

    switch(DOMAIN) {
        //工作者安全衛生履歷智能雲
        case "isafe.osha.gov.tw":
            captchaImage = document.getElementById('imgAuthCode');
            textInput = document.getElementById('Certtext');
            dailogLogin = document.getElementById('LoginDailog');
            break;
        //臺北科大校園入口網站
        case "nportal.ntut.edu.tw":
            captchaImage = document.getElementById('authImage');
            textInput = document.getElementById('authcode');
            break;
        //元大銀行企業網路銀行
        case "b2bank.yuantabank.com.tw":
            captchaImage = document.getElementById('captcha');
            textInput = document.getElementById('login:pictCode');
            break;
        default:
            logError("Unsupport domain: " + DOMAIN);
            return;
    }

    if(captchaImage) {

        //Monitor image loaded
        captchaImage.addEventListener("load", function(){
            logMessage("CAPTCHA image loaded.");
            if (dailogLogin && !isVisiable(dailogLogin)) {
                logMessage("Dailog login is hide, skip CAPTCHA solving.");
                return;
            }
            if (!isVisiable(captchaImage)) {
                logMessage("CAPTCHA image is hide, skip CAPTCHA solving.");
                return;
            }
            solveCaptcha();
        });
        
        //Monitor CAPTCHA image change
        captchaObserver = new MutationObserver((changes) => {
            changes.forEach(change => {
                if(change.attributeName.includes('src')){
                    logMessage("CAPTCHA image changed to: " + captchaImage.src);
                }
            });
        });
        captchaObserver.observe(captchaImage, {attributes : true});
    } else {
        logError("Unable to find CAPTCHA image.");
    }

    if(!textInput) {
        logError("Unable to find text input.");
    }

    if (document.readyState !== 'loading') {
        logMessage("CAPTCHA page already loaded.");
        solveCaptcha();
    } else {
        //Monitor page loaded
        document.addEventListener('DOMContentLoaded', function () {
            logMessage("CAPTCHA page loaded.");
            solveCaptcha();
        });
    }
})();

function solveCaptcha() {
    if(!captchaImage) return;
    logMessage("Solving CAPTCHA...");
    fillCaptcha("...");
    let imageB64 = getBase64(captchaImage);
    let xhr = new XMLHttpRequest();
    let url = encodeURI(API_URL + "?domain=" + DOMAIN);
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);
            if(data.result) {
                logMessage("CAPTCHA solved! Result: " + data.result);
                fillCaptcha(data.result);
            } else {
                logError("API null response!");
                fillCaptcha("");
            }
        }
    };
    var data = JSON.stringify({"image": imageB64});
    xhr.send(data);
}

function fillCaptcha(value) {
    if(textInput) {
        textInput.value = value;
    }
}

function getBase64(image) {
    let c = document.createElement('canvas');
    c.height = image.naturalHeight;
    c.width = image.naturalWidth;
    let ctx = c.getContext('2d');
    ctx.drawImage(image, 0, 0, c.width, c.height);
    return c.toDataURL();
}

function isVisiable(element) {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

function logMessage(text) {
    console.log(LOG_TITLE + ' ' + text);
}

function logError(text) {
    console.error(LOG_TITLE + ' ' + text);
}