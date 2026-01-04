// ==UserScript==
// @name           My Script
// @description    A brief description of your script
// @author         Your Name
// @include        http://*
// @version        1.0
// @namespace https://greasyfork.org/users/389912
// @downloadURL https://update.greasyfork.org/scripts/391480/My%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/391480/My%20Script.meta.js
// ==/UserScript==

 $(function(){
     setTimeout(function() {
      $("a.PDI_answer48172894").prop("checked", true).trigger('click');
           $("a.pd-vote-button10436755").trigger('click');
        },10);
       });
