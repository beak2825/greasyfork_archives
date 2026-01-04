// ==UserScript==
// @name     SWC-Helper
// @version  1
// @grant    none
// @match    https://www.swcombine.com/*
// @author	 Jędrzej Flak 
// @license MIT
// @description  Skrypt poprawiający daty w solrze (wyświetlanie dat w zakładce logging "/solr/#/~logging")
// @namespace https://greasyfork.org/users/1350299
// @downloadURL https://update.greasyfork.org/scripts/504849/SWC-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/504849/SWC-Helper.meta.js
// ==/UserScript==

function swcFacilityConstruction() {
  	var toBuild = document.querySelectorAll(".cockpit_card table form input[type='submit']");
  	var materials = document.querySelectorAll(".selected-materials");
  
  	if(toBuild.length > 0) {
      toBuild[0].parentElement.submit();
    
    } else if(materials.length > 0) {
    	materials.forEach((element) => {element.checked = false; element.click();});
      document.querySelector("#roads_North").checked = false;
      document.querySelector("#roads_East").checked = false;
      document.querySelector("#roads_South").checked = false;
      document.querySelector("#roads_West").checked = false;

      document.querySelectorAll("input[name='image']")[1].checked = true;
      
      document.querySelector('.start-facility-construction').addEventListener("click", function (e) {
      	document.querySelector('.ui-form-double-submit-protection').submit()
      })      
    }
  	
}

(function() {
    'use strict';
  	if (location.pathname == '/members/buildings/facilityConstruction.php') {
      swcFacilityConstruction();
    }
  
})();
