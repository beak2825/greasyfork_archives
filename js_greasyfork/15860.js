// ==UserScript==
// @name         Activar registro
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Activa para poder registrarte en Taringa sin Facebook
// @author       You
// @match        http*://www.taringa.net/registro
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15860/Activar%20registro.user.js
// @updateURL https://update.greasyfork.org/scripts/15860/Activar%20registro.meta.js
// ==/UserScript==


 $('head').append('<style> .noCaptcha, .captcha, .divider { display: block !important;} </style>');