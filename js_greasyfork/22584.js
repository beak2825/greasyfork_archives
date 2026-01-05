// ==UserScript==
// @name         Get lost loading message
// @namespace    Sam Pittman
// @version      0.0.1
// @description  Remove loading message from slack. Adapted from "Get lost giphy!" by Christopher Gervais.
// @author       Sam Pittman
// @include      https://*.slack*.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22584/Get%20lost%20loading%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/22584/Get%20lost%20loading%20message.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//console.log('= prepare slack GLLM =');

$(function($) {
  // On page load
  //console.log('= running slack GLLM =');
  
  $("#loading_message").css('display', 'none');

  // When new post is added
  $("#loading_message").on('DOMSubtreeModified propertychange', function() {
      $("#loading_message").css('display', 'none');
  })  
})
