// ==UserScript==
// @name         Ce-M
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Valores CE
// @author       Leonardo Rigotti
// @match        https://www.mercante.transportes.gov.br/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409959/Ce-M.user.js
// @updateURL https://update.greasyfork.org/scripts/409959/Ce-M.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var v1 , v2 , v3 , v4 , result , td;

    if(document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(42) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td")){

        v3 = document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(42) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td > span.td2").textContent;
        v4 = document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(42) > fieldset:nth-child(16) > table > tbody > tr:nth-child(2) > td:nth-child(1) > span").textContent;
        v1 = parseFloat(v3.replace('.', '').replace(',', '.'));
        v2 = parseFloat(v4.replace('.', '').replace(',', '.'));
        result = v1 - v2;
        result = result.toFixed(2);
        td = document.createElement('span');
        td.setAttribute("class","td1");
        td.textContent = (result);
        document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(42) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td").appendChild(td);
        //document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(42) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td > span").textContent = (v3 + " - " + result);
        if(document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(42) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td > span.td1")){
            document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(42) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td > span.td1").style.color = '#000000';
            document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(42) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td > span.td1").style.paddingLeft = '100px';
            document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(42) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td > span.td1").style.fontSize = 'x-large';
        }
    }
   else if(document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(32) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td")){
        v3 = document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(32) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td > span.td2").textContent;
        v4 = document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(32) > fieldset:nth-child(16) > table > tbody > tr:nth-child(2) > td:nth-child(1) > span").textContent;
        v1 = parseFloat(v3.replace('.', '').replace(',', '.'));
        v2 = parseFloat(v4.replace('.', '').replace(',', '.'));
        result = v1 - v2;
        result = result.toFixed(2);
        td = document.createElement('span');
        td.setAttribute("class","td1");
        td.textContent = (result);
        document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(32) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td").appendChild(td);
        //document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(32) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td > span").textContent = (v3 + " - " + result);
        if(document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(32) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td > span.td1")){
            document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(32) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td > span.td1").style.color = '#000000';
            document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(32) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td > span.td1").style.paddingLeft = '100px';
            document.querySelector("body > fieldset:nth-child(26) > fieldset:nth-child(32) > fieldset:nth-child(16) > table > tbody > tr:nth-child(1) > td > span.td1").style.fontSize = 'x-large';
        }
    }

})();