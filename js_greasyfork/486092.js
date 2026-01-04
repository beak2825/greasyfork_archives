

// ==UserScript==
// @name         Ailyze Upload Customization
// @namespace    http https://www.ailyze.com/ailyze/
// @version      0.1
// @description  Adds custom functions to Ailyze upload page
// @author       You
// @match        https://www.ailyze.com/ailyze/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486092/Ailyze%20Upload%20Customization.user.js
// @updateURL https://update.greasyfork.org/scripts/486092/Ailyze%20Upload%20Customization.meta.js
// ==/UserScript==

(function() {

  // Change analysis type on load
  document.querySelector('select[name="demo_choice"]').value = "yes";
  
  // Select summarization on analysis type page
  document.querySelector('button[value="Summarize"]').click();

  // Choose essay summary
  document.querySelector('select[id="id_summary"]').value = "Essay";

  // Select Portuguese language
  document.querySelector('select[id="id_language_options"]').value = "Portuguese";

  // Select long length
  document.querySelector('select[id="id_response_size"]').value = "Long";

  // Add instructions 
  document.querySelector('textarea[name="instruction"]').value = "Please provide a general summary of the main topics and viewpoints in the documents in bullet points/long format in Portuguese. If an error occurs, try a medium length summary in Portuguese.";

  // Submit form
  document.querySelector('button[type="submit"]').click();

})();
