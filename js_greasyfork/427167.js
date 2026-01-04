// ==UserScript==
// @name         Cacher la bannière d'abonnement sur lemonde.fr
// @name:en      Hide subscription banner on lemonde.fr
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Suite au refus de la collecte de cookies à usage publicitaire, https://www.lemonde.fr affiche un encart envahissant invitant l'utilisateur à s'abonner. Ce script permet de le cacher.
// @description:en After denying ad targeting cookies use on https://www.lemonde.fr, an annoying message asks the user to subscribe. This simple script enables to hide it.
// @author       Alexandre LEBRUN
// @match        https://www.lemonde.fr/*
// @icon         https://www.google.com/s2/favicons?domain=lemonde.fr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427167/Cacher%20la%20banni%C3%A8re%20d%27abonnement%20sur%20lemondefr.user.js
// @updateURL https://update.greasyfork.org/scripts/427167/Cacher%20la%20banni%C3%A8re%20d%27abonnement%20sur%20lemondefr.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var register = document.getElementById('js-message-register');
    if(register != null && register != undefined) register.style.display = 'none';

})();