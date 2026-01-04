// ==UserScript==
// @name         TORN Travel Hub - Private Island ETA Adder
// @namespace    https://www.torn.com/factions.php?step=profile&ID=22887
// @version      1
// @description  Estimate some travel times
// @author       Ayelis
// @match        https://doctorn.rocks/travel-hub
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369877/TORN%20Travel%20Hub%20-%20Private%20Island%20ETA%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/369877/TORN%20Travel%20Hub%20-%20Private%20Island%20ETA%20Adder.meta.js
// ==/UserScript==

$(document).ready(function(){
    window.setInterval(function(){
      $('.mexico').parent().text('Mexico (18m)');
      $('.cayman-islands').parent().text('Caymans (25m)');
      $('.canada').parent().text('Canada (29m)');
      $('.hawaii').parent().text('Hawaii (1h34)');
      $('.uk').parent().text('UK (1h51)');
      $('.argentina').parent().text('Argentina (1h57)');
      $('.switzerland').parent().text('Switzerland (2h03)');
      $('.japan').parent().text('Japan (2h38)');
      $('.china').parent().text('China (2h49)');
      $('.uae').parent().text('UAE (3h10)');
      $('.south-africa').parent().text('South Africa (3h28)');
    }, 100);
});