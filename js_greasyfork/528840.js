// ==UserScript==
// @name         Автовход 2
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Я не придумал описание
// @author       dayanabiliyorum
// @match        https://*/oauth/authorize/*
// @match        https://*/auth/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitrix24.net
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528840/%D0%90%D0%B2%D1%82%D0%BE%D0%B2%D1%85%D0%BE%D0%B4%202.user.js
// @updateURL https://update.greasyfork.org/scripts/528840/%D0%90%D0%B2%D1%82%D0%BE%D0%B2%D1%85%D0%BE%D0%B4%202.meta.js
// ==/UserScript==

const portals = {
    'default' : {
        'login' : 'login',
        'password' : 'password',
    },
    'portal.ru' : {
        'login' : 'login',
        'password' : 'password',
    }
}

var portalUrl = '';
var login = '';
var password = '';

(function() {
    'use strict';

    const button = document.createElement("button");
    button.setAttribute('id', 'autoLogin');
    button.setAttribute('style', 'margin-top: 10px');
    button.classList.add('b24net-text-btn', 'b24net-text-btn--change-account');
    button.textContent = 'Автовход';

    document.querySelector('.b24net-text-btn').after(button);

    portalUrl = new URLSearchParams(window.location.search).get('redirect_uri');

    console.log(portalUrl);

    button.addEventListener('click', function () {
        let changeAccountButton = getElementByInnerHtml('button', 'Сменить аккаунт');
        if (changeAccountButton !== null) {
            changeAccountButton.click();
        }

        getAuthData()
            .then(() => setLogin(login))
            .then(() => delay(1000))
            .then(() => setPassword(password));
    })
})();

function getAuthData() {
    return new Promise((resolve, reject) => {
        for (const [key, value] of Object.entries(portals)) {
            if (portalUrl.includes(key)) {
                login = value.login;
                password = value.password;

                resolve();
            }
        }

        delay(2000).then(() => {
            login = portals.default.login;
            password = portals.default.password;

            resolve();
        });
    });
}

function setLogin(login) {
    return new Promise((resolve, reject) => {
        insertTo(login, 'login').then(() => clickSubmit());

        resolve();
    });
}

function setPassword(password)
{
    return new Promise((resolve, reject) => {
        insertToType(password, 'password').then(() => clickSubmit());

        resolve();
    });
}

function insertTo(text = '', fieldId)
{
    var changeEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
    });

    return new Promise((resolve, reject) => {
        if (document.querySelector('#' + fieldId) !== null) {
            document.querySelector('#' + fieldId).dispatchEvent(changeEvent);
            document.querySelector('#' + fieldId).value = text;
            document.querySelector('#' + fieldId).dispatchEvent(changeEvent);

            delay(500).then(() => resolve());
        } else {
            resolve();
        }
    });
}

function insertToType(text = '', fieldId)
{
    var changeEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
    });

    return new Promise((resolve, reject) => {
        if (document.querySelector('input[type=' + fieldId + ']') !== null) {
            document.querySelector('input[type=' + fieldId + ']').dispatchEvent(changeEvent);
            document.querySelector('input[type=' + fieldId + ']').value = text;
            document.querySelector('input[type=' + fieldId + ']').dispatchEvent(changeEvent);

            delay(500).then(() => resolve());
        } else {
            resolve();
        }
    });
}

function clickSubmit()
{
    document.querySelector('button.ui-btn-success').click();
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function getElementByInnerHtml(elementName, html)
{
    for (let element of document.querySelectorAll(elementName)) {
        if (element.innerHTML == html) {
            return element
        }
    }

    return null;
}