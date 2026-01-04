// ==UserScript==
// @name         TUMANGAONLINE - CASCADE ALWAYS
// @namespace    
// @version      1
// @description  set cascade vide mode on tumangaonline on load page
// @author       chicoxin
// @match        https://www.tumangaonline.com/lector/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31284/TUMANGAONLINE%20-%20CASCADE%20ALWAYS.user.js
// @updateURL https://update.greasyfork.org/scripts/31284/TUMANGAONLINE%20-%20CASCADE%20ALWAYS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    angular.element($('body')).scope().lector.cambiarModo('cascada');
})();