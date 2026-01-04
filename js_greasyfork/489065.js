// ==UserScript==
// @name         Habilita Senha Salva no SEI- UFU
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Código para habilitar senha Salva no SEI
// @author       You
// @match        https://www.sei.ufu.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ufu.br
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489065/Habilita%20Senha%20Salva%20no%20SEI-%20UFU.user.js
// @updateURL https://update.greasyfork.org/scripts/489065/Habilita%20Senha%20Salva%20no%20SEI-%20UFU.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("pwdSenha").type = "password";
    // Your code here...
})();