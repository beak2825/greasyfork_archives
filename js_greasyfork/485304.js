// ==UserScript==
// @name         TokenLoging
// @name:en      TokenLoging
// @namespace    https://discord.com/invite/zPxF4DPnrY
// @version      1.0
// @description  Этот скрипт позволяет вам войти прямо через страницу входа через токен! Просто введите токен в специальное поле, и вы получите мгновенный доступ к своей учетной записи.
// @description:en  This script allows you to log in directly to the login page via a token! Simply provide the token in the designated field, and you'll gain instant access to your account.
// @author       000sunray000
// @match        *://discord.com/login
// @icon         https://discord.com/assets/images/favicon.ico
// @grant        none
// @license      000SunRay000
// @downloadURL https://update.greasyfork.org/scripts/485304/TokenLoging.user.js
// @updateURL https://update.greasyfork.org/scripts/485304/TokenLoging.meta.js
// ==/UserScript==

(function() {
    function loginWithToken(token) {
        setInterval(() => {
            document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage.token = `"${token}"`
        }, 50);
        setTimeout(() => {
            location.reload();
        }, 2500);
    }
    function loaded() {
        alert('TokenLoging is loaded! Author discord: 000sunray000')
        const tokenInput = document.createElement('input');
        tokenInput.setAttribute('type', 'text');
        tokenInput.setAttribute('placeholder', 'Enter token');
        const loginButton = document.createElement('button');
        loginButton.textContent = 'Login';
        const loginDiv = document.querySelector('#app-mount > div.appAsidePanelWrapper__714a6 > div.notAppAsidePanel__9d124 > div.app_b1f720 > div > div > div > div > form > div.centeringWrapper__319b0 > div > div.mainLoginContainer__58502 > div.block__8bc50.marginTop20_d88ee7');
        if (loginDiv) {
            loginDiv.appendChild(tokenInput);
            loginDiv.appendChild(loginButton);
            loginButton.addEventListener('click', function() {
                loginWithToken(tokenInput.value);
            });
        }
    }
    setTimeout(loaded, 5000);
})();