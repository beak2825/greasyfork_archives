// ==UserScript==
// @name         Hybrid Project Page
// @version      10
// @description  none
// @author       Tehapollo
// @include      *gethybrid.io*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @namespace    tehapollo
// @downloadURL https://update.greasyfork.org/scripts/382462/Hybrid%20Project%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/382462/Hybrid%20Project%20Page.meta.js
// ==/UserScript==
(function() {
  var a = document.createElement('a');
  var text = document.createTextNode("Pins Page");
  a.appendChild(text);
  a.title = "Pins Page";
  a.href = "https://www.gethybrid.io/workers/projects?pinterest=1";
  document.getElementsByClassName('nav navbar-nav')[0].appendChild(a);




})();