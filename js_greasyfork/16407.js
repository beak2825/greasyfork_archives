// ==UserScript==
// @name         JIRA-prevent "Crowd Administrator" reporter
// @namespace    https://jira.id.ubc.ca
// @version      0.2
// @description  Remind people to change the default issue reporter
// @author       Rod McFarland
// @match        https://jira.id.ubc.ca:8443/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16407/JIRA-prevent%20%22Crowd%20Administrator%22%20reporter.user.js
// @updateURL https://update.greasyfork.org/scripts/16407/JIRA-prevent%20%22Crowd%20Administrator%22%20reporter.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
setTimeout(function(){
  var reporter=document.getElementById(
    'issue_summary_reporter_admin'
  );

  if(reporter && reporter.textContent.match('Crowd')){
      reporter.style.backgroundColor="red";
    alert('Reporter is set to Crowd Administrator');
  }
  // auto-select lib-prog-web only when logging work
    jQuery('#log-work-link, #log-work').click(function(e){
        setTimeout(function(){
            jQuery('[name=commentLevel]').find('option[value="role:10210"]').attr('selected', true);
            jQuery('#log-work-dialog').find('span.current-level').text('lib-programming-web').css('color', 'red');
        },200);
   });
},2000);