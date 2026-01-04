// ==UserScript==
// @name         BME beléptető
// @namespace    http://abs.ezw.me
// @version      1.0
// @description  címtár – kinek van erre ideje?
// @author       ABS
// @match        https://login.bme.hu/idp/Authn/UserPassword
// @downloadURL https://update.greasyfork.org/scripts/381977/BME%20bel%C3%A9ptet%C5%91.user.js
// @updateURL https://update.greasyfork.org/scripts/381977/BME%20bel%C3%A9ptet%C5%91.meta.js
// ==/UserScript==

document.getElementById('login-form_username').value = 'felhasználónév';
document.getElementById('login-form_password').value = 'jelszó';
document.getElementById('login-form').submit();