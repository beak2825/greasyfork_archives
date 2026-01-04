// ==UserScript==
// @name         Автовход
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Я не придумал описание
// @author       dayanabiliyorum
// @match        https://*/oauth/authorize/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitrix24.net
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485501/%D0%90%D0%B2%D1%82%D0%BE%D0%B2%D1%85%D0%BE%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/485501/%D0%90%D0%B2%D1%82%D0%BE%D0%B2%D1%85%D0%BE%D0%B4.meta.js
// ==/UserScript==

const token = '';
var portalUrl = '';
var login = '';
var password = '';

(function() {
    'use strict';

    const button = document.createElement("button");
    button.setAttribute('id', 'choose-all');
    button.classList.add('ui-btn', 'ui-btn-success');
    button.textContent = 'Автовход';

    document.querySelector('.b24-network-auth-cover-title').after(button);

    portalUrl = new URLSearchParams(window.location.search).get('redirect_uri');

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
        GM.xmlHttpRequest ({
            method:     "POST",
            url:        'https://sekvid.ru/up/uchet-app/token-access/get-auth-data?token=8d2d1613-a2e7-49e7-95aa-4fcf1962b001',
            data:       JSON.stringify({token: token, url: portalUrl}),
            headers:    {
                "Content-Type": "application/json"
            },
            onload:     function (response) {
                let authData = JSON.parse(response.response);
                login = authData.login;
                password = authData.password;

                resolve();
            }
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
        insertTo(password, 'password').then(() => clickSubmit());

        resolve();
    });
}

function insertTo(text = '', fieldId)
{
    var changeEvent = new Event('change', {
        bubbles: true,
        cancelable: true,
    });

    return new Promise((resolve, reject) => {
        if (document.querySelector('#' + fieldId) !== null) {
            document.querySelector('#' + fieldId).value = text;
            document.querySelector('#' + fieldId).dispatchEvent(changeEvent);

            delay(500).then(() => resolve());
        } else {
            resolve();
        }
  });
}

function clickSubmit()
{
    document.querySelector('button[data-action="submit"]').click();
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