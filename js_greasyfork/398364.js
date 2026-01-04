// ==UserScript==
// @name                自动登录
// @name:en             AutoLogin
// @description         自动登录各网站，仅供SAP内部使用。
// @description:en      Automatically Login to the websites. Only for SAP internal using.
// @namespace           https://greasyfork.org/zh-CN/users/331591
// @version             1.0.4
// @author              Hale Shaw
// @homepage            https://greasyfork.org/zh-CN/scripts/398364
// @supportURL          https://greasyfork.org/zh-CN/scripts/398364/feedback
// @icon                https://www.sap.com/favicon.ico
// @require             https://greasyfork.org/scripts/398010-commonutils/code/CommonUtils.js?version=781197
// @match               https://github.wdf.sap.corp/*
// @match               https://github.tools.sap/*
// @match               https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp/*
// @match               https://cx.wdf.sap.corp/CxWebClient/*
// @match               https://amalthea-cloud.cfapps.eu10.hana.ondemand.com/*
// @license             AGPL-3.0-or-later
// @compatible	        Chrome
// @run-at              document-idle
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/398364/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/398364/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const msg = 'Auto Login...';
    const urlGitHub1 = 'https://github.wdf.sap.corp';
    const urlGitHub2 = 'https://github.tools.sap';
    const urlJenkins = 'https://gkeselfbilljenkins.jaas-gcp.cloud.sap.corp';
    const urlCheckMarx = 'https://cx.wdf.sap.corp/CxWebClient';
    const urlAmalthea = 'https://amalthea-cloud.cfapps.eu10.hana.ondemand.com/login';

    setTimeout(function show() {
        if (isURL(urlGitHub1) || isURL(urlGitHub2)) {
            loginToGitHub();
            return;
        } else if (isURL(urlJenkins)) {
            loginToJenkins();
            return;
        } else if (isURL(urlCheckMarx)) {
            loginToCheckMarx();
            return;
        } else if (isURL(urlAmalthea)) {
            loginToAmalthea();
            return;
        }
    }, 1000);

    function loginToGitHub() {
        if (isValidByClassName('HeaderMenu-link no-underline mr-3')) {
            const btnLogin = document.getElementsByClassName(
                'HeaderMenu-link no-underline mr-3'
            )[0];
            const attr = '(Logged out) Header, clicked Sign in, text:sign-in';
            const innerText = 'Sign in';
            const tagName = 'A';
            if (
                attr == btnLogin.getAttribute('data-ga-click') &&
                innerText == btnLogin.innerText &&
                tagName == btnLogin.tagName
            ) {
                clickAndShow(btnLogin);
            }
        }
        if (isValidByClassName('btn btn-primary btn-block Details-content--shown')) {
            const btnLogin = document.getElementsByClassName(
                'btn btn-primary btn-block Details-content--shown'
            )[0];
            const innerText1 = 'Sign in with SAP ID';
            const innerText2 = 'Sign in with SAML';
            if (innerText1 == btnLogin.innerText || innerText2 == btnLogin.innerText) {
                clickAndShow(btnLogin);
            }
        }
    }

    function clickAndShow(ele) {
        ele.click();
        ele.innerText = msg;
        ele.style.color = 'red';
    }

    function loginToJenkins() {
        if (isValidByClassName('login')) {
            let btnLogin = document.getElementsByClassName('login')[0].children[1];
            if (btnLogin && 'log in' == btnLogin.children[0].textContent) {
                btnLogin.click();
                let msgEle = document.getElementsByClassName('call-to-action')[0];
                if (msgEle) {
                    msgEle.innerText = msg;
                    msgEle.style.color = 'red';
                }
            }
        }
    }

    function loginToCheckMarx() {
        if (isValidById('btnSSOLogin_input')) {
            document.getElementById('btnSSOLogin_input').click();
        }
    }

    function loginToAmalthea() {
        if (isValidById('login-gh-btn')) {
            let logonBtn = document.getElementById('login-gh-btn');
            logonBtn.click();
            logonBtn.text = msg;
            logonBtn.style.color = 'red';
            logonBtn.style.fontWeight = 'bolder';
        }
    }

    /**
     * check url.
     * @param {String} url
     */
    function isURL(url) {
        return window.location.href.indexOf(url) != -1;
    }
})();
