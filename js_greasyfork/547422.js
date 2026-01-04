// ==UserScript==
// @name         Xfinity Login Reminder
// @namespace    com.708newport.xfinitybs
// @version      1.0.0.20250826
// @description  Put a reminder prompt as to which account to use
// @author       You
// @match        https://login.xfinity.com/login*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xfinity.com
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/547422/Xfinity%20Login%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/547422/Xfinity%20Login%20Reminder.meta.js
// ==/UserScript==

var acct = 'CHANGEME';

$(document).ready(function() {
    GM_addStyle (`
div.loginremind {
  padding:5px 10px;
  border:1px solid #cc0;
  background-color:#ffc;
  border-radius:5px;
  font-size: 1.25em;
}

div.loginremind::before {
  content: '';
  background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAA/FBMVEUAAAD/1AD/1gD/1wL/1wX/1gBhoLL/1gChrIX/7lH/1gBjm67/1gA8TVH/1gD/1gBhmar/1gCLrq1Fh5h8rc7r2l9dlqjnvQ//5jb/1gD/4in/6UH/1gCAqqqIsLM2dINFfYz/4SL/1gDs1TTszho9TE82R0r/1gD/1gD/1gD/5mRema3//5D/52r/52j/3x7/2xrxwQCQsJOYsoX/8FrJrkj/2A3/2Ab80QDuvQBlpbhblaf//ok9d4X//IQ0cX//9Wn/8mH84VvAr1nBrVL83k//4D//6Tv93TvluzL/3ij/4CPtvxnsvBD4zwriqQbcmwPfngL90wD0xQD5dsP3AAAAKXRSTlMAFvdRS83++/PxvoN6cGdgVEY8FhD9/Pz57M7FxcLBuLd7c1lUICAQD5o9GeIAAAC7SURBVBjTVczVDsJQEEXRaYu7u/vUi7a4u/P//wIJvfSyniY7mQNfDOfzcQxQbFn3CdmczSqceyx2ETHNkcJkpuJcwQ87Q95SYveoqioiS16DykLhJZ7vIwbNFGYHfUni5QGyYbJlR1zK8obagoBTP2/3l6czAETTg8ZL09DTgp/y7qoZOlbAUo0fHvdbskaliGvV661dESrF8u1Op12IAcU7dAiCF2ghhzBKhIAWLc4mpSj8qfv9DfN8A7ImFkVg7/8FAAAAAElFTkSuQmCC);
  width: 18px;
  min-width: 18px !important;
  height: 18px;
  /*margin-top: 2px;*/
  margin-bottom: -1px;
  margin-right: 5px;
  display: inline-block;
}

div.loginremind span.account {
  font-weight:bold;
  font-family:monospace;
}
    `);
    var e = $('<div class="loginremind">');
    e.html('Use your <span class="account">'+acct+'</span> login');
    $('form[name="signin"] prism-text').first().after(e);
});