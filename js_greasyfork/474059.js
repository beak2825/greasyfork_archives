// ==UserScript==
// @name         Tasks Inject Link in Timesheets
// @namespace    com.firemonkey.co.talenta.hr
// @version      0.1
// @license      MIT
// @description  A Way to... well.. adding simple HTML link to tasks and project
// @author       Benyamin Limanto <me@benyamin.xyz>
// @match        *://hr.talenta.co/*
// @icon         https://www.google.com/s2/favicons?domain=hr.talenta.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474059/Tasks%20Inject%20Link%20in%20Timesheets.user.js
// @updateURL https://update.greasyfork.org/scripts/474059/Tasks%20Inject%20Link%20in%20Timesheets.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var linkTask = '<a data-v-1d6e5c48="" data-v-46a22fd4="" target="_blank" class="text-decoration-none" href="https://hr.talenta.co/tasks/index">' + 
      '<i class="ic ic-doc"></i> ' + 
      '<span class="text-body">Tasks</span></a>';
  var spanContainer = document.createElement('span');
  spanContainer.innerHTML = linkTask;
  var linkProject = ' &nbsp;&nbsp;<a target="_blank" class="text-decoration-none" href="https://hr.talenta.co/tasks/projects">' + 
      '<i class="ic ic-product"></i> ' + 
      '<span class="text-body">Projects</span></a>';
	spanContainer.innerHTML += linkProject;
  
  var timer = setInterval(function() {
    var actionContainer = document.querySelector(".tl-header__action");
    
    if (actionContainer !== null){
      console.log(actionContainer.children[0]);
      actionContainer.children[0].before(spanContainer);
      clearInterval(timer);
    }
  }, 1000);
  
})();