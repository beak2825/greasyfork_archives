// ==UserScript==
// @name         ShyzosClicker Hack (EZ)
// @namespace   PermanovRuskyn
// @author      PermanovRuskyn
// @license MIT
// @version      0.1
// @description  Override ShyzosClicker data for educational purposes only (use this at your own risk) - There probably is no logger, but have fun!
// @description:fr Modifie les données de ShyzosClicker à des fins éducatives uniquement (utilisez ceci à vos propres risques) - Il n'y a probablement pas de logger, mais amusez-vous bien !
// @match        https://clicker.shyzos.xyz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515867/ShyzosClicker%20Hack%20%28EZ%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515867/ShyzosClicker%20Hack%20%28EZ%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let myNumber = 1.8e300

    let gameSave = JSON.parse(localStorage.getItem('gameSave'));
    gameSave.points += myNumber;
    gameSave.clicks += myNumber;
    gameSave.ppc += myNumber;
    gameSave.pps += myNumber;

    localStorage.setItem('gameSave', JSON.stringify(gameSave));
})();