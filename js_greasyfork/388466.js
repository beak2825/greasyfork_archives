// ==UserScript==
// @name       noRedirect
// @namespace  https://gist.github.com/piqus/4ea4664519a83d7fb073
// @version    0.1
// @description  Prevent redirecting JS feature. Packed in user.js
// @match      *
// @copyright  2014+, Piotr Kubisa
/// @link: http://stackoverflow.com/questions/5225964/jquery-disable-all-redirections-links-form-submissions-window-location-change
// @downloadURL https://update.greasyfork.org/scripts/388466/noRedirect.user.js
// @updateURL https://update.greasyfork.org/scripts/388466/noRedirect.meta.js
// ==/UserScript==


window.onbeforeunload = function(e){
  var e = e || window.event;
  // For IE and Firefox (prior to 4)
  if (e){
    e.returnValue = 'Do you want to leave this page?';
  }
  // For Safari and Chrome
  return "Do you want to leave this page?";
};
