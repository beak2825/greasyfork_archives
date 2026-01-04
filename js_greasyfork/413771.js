// ==UserScript==
// @name         Fantasypros Game Day More Play Delay Times
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fantasypros Game Day only offers 6 delay options, this allows for more finite control
// @author       Aaron Sewall
// @match        https://www.fantasypros.com/nfl/gameday.php
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/413771/Fantasypros%20Game%20Day%20More%20Play%20Delay%20Times.user.js
// @updateURL https://update.greasyfork.org/scripts/413771/Fantasypros%20Game%20Day%20More%20Play%20Delay%20Times.meta.js
// ==/UserScript==

var selectNode=$("#pick-delay");

selectNode.find ("option[value='0']")
          .after ('<option value="5">5 seconds</option>');
selectNode.find ("option[value='10']")
          .after ('<option value="15">15 seconds</option>');
selectNode.find ("option[value='20']")
          .after ('<option value="25">25 seconds</option>');
selectNode.find ("option[value='30']")
          .after ('<option value="55">55 seconds</option>')
          .after ('<option value="50">50 seconds</option>')
          .after ('<option value="45">45 seconds</option>')
          .after ('<option value="40">40 seconds</option>')
          .after ('<option value="35">35 seconds</option>');
selectNode.find ("option[value='60']")
          .after ('<option value="115">1 Minute 55 seconds</option>')
          .after ('<option value="110">1 Minute 50 seconds</option>')
          .after ('<option value="105">1 Minute 45 seconds</option>')
          .after ('<option value="100">1 Minute 40 seconds</option>')
          .after ('<option value="95">1 Minute 35 seconds</option>')
          .after ('<option value="90">1 Minute 30 seconds</option>')
          .after ('<option value="85">1 Minute 25 seconds</option>')
          .after ('<option value="80">1 Minute 20 seconds</option>')
          .after ('<option value="75">1 Minute 15 seconds</option>')
          .after ('<option value="70">1 Minute 10 seconds</option>')
          .after ('<option value="65">1 Minute 5 seconds</option>');
