// ==UserScript==
// @name         ELPais unlocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Para ver todos los artículos que quieras
// @author       LuisMayo gracias a la comunidad y al equipo de desarrollo de el país por no comprobar en backend 
// @match        https://elpais.com/*
// @downloadURL https://update.greasyfork.org/scripts/404731/ELPais%20unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/404731/ELPais%20unlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(localStorage) {
        const serializedArcp = localStorage.getItem('ArcP');
        if (serializedArcp && serializedArcp.length > 0) {
            const arcp = JSON.parse(serializedArcp);
            arcp.anonymous.rc['8'].c = -500;
            localStorage.setItem('ArcP', JSON.stringify(arcp));
        }
    }
})();