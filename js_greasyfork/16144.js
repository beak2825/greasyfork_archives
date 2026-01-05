// ==UserScript==
// @name         Stop rollCycle
// @version      0.3
// @description  Anhalten der Bildwechselfunktion auf poppen.de
// @author       WSM
// @license      MPL 2.0
// @match        http://www.poppen.de
// @grant        none
// @namespace https://greasyfork.org/users/26919
// @downloadURL https://update.greasyfork.org/scripts/16144/Stop%20rollCycle.user.js
// @updateURL https://update.greasyfork.org/scripts/16144/Stop%20rollCycle.meta.js
// ==/UserScript==
'use strict';

var x = document.getElementsByClassName('fa-circle');
x[0].click();
var button = document.getElementsByClassName('circling-buttons');
var tour = button[1].getElementsByTagName('button');
tour[0].click();