// ==UserScript==
// @name         TORN Travel Hub - Standard Airfare ETA Adder
// @namespace    https://www.torn.com/factions.php?step=profile&ID=22887
// @version      1
// @description  Estimate some travel times
// @author       Ayelis
// @match        https://doctorn.rocks/travel-hub
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369876/TORN%20Travel%20Hub%20-%20Standard%20Airfare%20ETA%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/369876/TORN%20Travel%20Hub%20-%20Standard%20Airfare%20ETA%20Adder.meta.js
// ==/UserScript==

$(document).ready(function(){
    window.setInterval(function(){
      $('.mexico').parent().text('Mexico (26m)');
      $('.cayman-islands').parent().text('Caymans (35m)');
      $('.canada').parent().text('Canada (41m)');
      $('.hawaii').parent().text('Hawaii (2h14)');
      $('.uk').parent().text('UK (2h39)');
      $('.argentina').parent().text('Argentina (2h47)');
      $('.switzerland').parent().text('Switzerland (2h55)');
      $('.japan').parent().text('Japan (3h45)');
      $('.china').parent().text('China (4h02)');
      $('.uae').parent().text('UAE (4h31)');
      $('.south-africa').parent().text('South Africa (4h57)');
    }, 100);
});