// ==UserScript==
// @name         IBoys blur remover
// @version      0.1
// @description  Removes blur from iBoys
// @description:de  Macht unkenntliche profilbilder wieder sichtbar
// @author       You
// @match        https://www.iboys.at/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/750796
// @downloadURL https://update.greasyfork.org/scripts/487327/IBoys%20blur%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/487327/IBoys%20blur%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.blur').removeClass('blur');
})();