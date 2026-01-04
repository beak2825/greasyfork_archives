// ==UserScript==
// @name        Batch Georeferencing - Randomly Select Batch
// @description Add shuffle button to Symbiota "Batch Georeferencing Tools" page
// @namespace   symbiota.user.batchgeoref.rsb
// @include     */batchgeoreftool.php
// @author      Jack Willis
// @version     1.0
// @grant       none
// @license     MIT; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/30434/Batch%20Georeferencing%20-%20Randomly%20Select%20Batch.user.js
// @updateURL https://update.greasyfork.org/scripts/30434/Batch%20Georeferencing%20-%20Randomly%20Select%20Batch.meta.js
// ==/UserScript==

$(function() {
  function sample(array) { return array[(Math.random() * array.length) | 0]; }
  
  var shuffleButton = $("<a>")
  .html("&#x1F500;") // shuffle emoji
  .css("margin-left", "10px").css("font-size", "18px")
  .hover(function() {
    $(this).css("cursor", "pointer").css("text-decoration", "none");  
  }).click(function(event) {
    event.preventDefault();
    $("#locallist option:selected").prop("selected", false); // deselect all batches
    $(sample($("#locallist option"))).prop("selected", true); // select random batch
  });
  
   // inject shuffle button in the panel above the <select>
  $("form[name=georefform] > div:first-child").append(shuffleButton);
});