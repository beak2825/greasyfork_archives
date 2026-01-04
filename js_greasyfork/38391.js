// ==UserScript==
// @name           Sberbank Online Remove fake input fields
// @version        0.1.2
// @namespace      https://greasyfork.org/ru/scripts/9300-sberbank-online-remove-fake-input-fields  
// @author         IceCube
// @description    Sberbank Online Remove fake input fields to repair KeeFox
// @include        https://online.sberbank.ru/*
// @downloadURL https://update.greasyfork.org/scripts/38391/Sberbank%20Online%20Remove%20fake%20input%20fields.user.js
// @updateURL https://update.greasyfork.org/scripts/38391/Sberbank%20Online%20Remove%20fake%20input%20fields.meta.js
// ==/UserScript==

var el = document.getElementById('loginForm');
var newHTML = el.innerHTML;
var newHTML = newHTML.replace('<input style="display:none" name="fakeLogin" type="text">',"");
var newHTML = newHTML.replace('<input style="display:none" name="fakePassword" type="password">',"");
var newHTML = newHTML.replace('<input style="display: none; font-weight: 600; font-style: normal; color: rgb(204, 204, 255);" name="fakePassword" type="password">',"");
el.innerHTML = newHTML;
