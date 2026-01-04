// ==UserScript==
// @name         AddAll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add all items of a book list to the lesson queue
// @author       This is your fault
// @match        https://floflo.moe/singles/
// @match        https://floflo.moe/alchemizer/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374657/AddAll.user.js
// @updateURL https://update.greasyfork.org/scripts/374657/AddAll.meta.js
// ==/UserScript==

var delay = 100;
var buttonHTML = '<div class="elementor-widget-container" style="margin-top: 10px; margin-left: auto; text-align: center;"><div class="elementor-button-wrapper"> <a class="elementor-button elementor-size-lg elementor-animation-grow" role="button"> <span class="elementor-button-content-wrapper"> <span class="elementor-button-icon elementor-align-icon-left"> <i class="fa fa-bomb" aria-hidden="true"></i> </span> <span class="elementor-button-text">add all</span> </span> </a></div></div>';

function chilling(callback){
    console.log("chilling");
  if ( window.vocabTable.loading ){
      setTimeout(function(){chilling(callback);},500);
  } else {
      callback();
  }
}

function addingAll(){
        var addButtons = jQuery('button.col-12.col-md').filter(function() {return jQuery(this).text() === 'Add';});
        var len = addButtons.length;
        addButtons.each(function(index) {
            var button = jQuery(this);
            setTimeout(function(){
                button.click();
                if (index >= len -1) {
                    window.vocabTable.refreshTable();
                    chilling(addingAll);
                }
            },index*delay);
        });
}

(function() {
    'use strict';

    var target = jQuery(".unfortunate_soul .col-4");
    target.append(buttonHTML);
    var addAllButton = jQuery(".elementor-widget-container .elementor-button-wrapper a");
    addAllButton.css("background-color","#ffe400");
    //Some weird stuff happen while the page is being loaded. Make sure we have the right guy
    setTimeout(function(){console.log("trying");jQuery(".elementor-widget-container .elementor-button-wrapper a").on('click',addingAll);},2000);
})();