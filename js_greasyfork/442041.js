// ==UserScript==
// @name        amiami extra sort options 
// @namespace   science
// @match       https://www.amiami.com/eng/search/list/*
// @grant       none
// @version     1.3
// @author      mad scientist
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @description Adds hidden sort options to amiami search results
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/442041/amiami%20extra%20sort%20options.user.js
// @updateURL https://update.greasyfork.org/scripts/442041/amiami%20extra%20sort%20options.meta.js
// ==/UserScript==

(function () {
  "use strict";
  
  const observer = new MutationObserver(obsFunc);
  const body = document.querySelector("body");
  const observerConfig = {
    childList: true,
    subtree: true,
    attributes: true
  };
  if (body !== null) {
    observer.observe(body, observerConfig);
  }
  
  let appended = false;
  
  function appendSelect()
  {
    let select = $(document).find('select[name="sorting"]');
    let selectValues = {"pricea" : "Lowest Price", "priced" : "Highest Price", "regtimed" : "Recently Updated Items"};
    
    if(select != undefined && select != null){
      if(select.length > 0) {
        $.each(selectValues, function(key, value) {   
          $(select).append($("<option></option>").attr("value", key).attr("class", "select-sorting__item").text(value)); 
        });
        return true;
      }
    }
    return false;
  }
  
  $(document).on('change','select[name="sorting"]',function() {
    appended = false;
  }); 
  $(document).on('click', 'a',function() {
    appended = false;
  });
  
  function obsFunc(mutations) {
    mutations.forEach(() => {
      if(!appended) {
        appended = appendSelect();
      }
    });
  }
  
})();
