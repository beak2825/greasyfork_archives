// ==UserScript==
// @name        UVa CCU login helper
// @namespace   tag:brainonfire.net,2014-08-24:uvaccu-login-helper
// @description Adds form wrapper and field names to login screen so that Firefox password manager (along with Secure Login and Saved Password Editor) can detect it.
// @include     https://online.uvacreditunion.org/UVACCUOnline_40/uux.aspx#/login
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4492/UVa%20CCU%20login%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/4492/UVa%20CCU%20login%20helper.meta.js
// ==/UserScript==

if ('undefined' == typeof __PAGE_SCOPE_RUN__) {
  (function page_scope_runner() {
    // If we're _not_ already running in the page, grab the full source
    // of this script.
    var my_src = "(" + page_scope_runner.caller.toString() + ")();";

    // Create a script node holding this script, plus a marker that lets us
    // know we are running in the page scope (not the Greasemonkey sandbox).
    // Note that we are intentionally *not* scope-wrapping here.
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.textContent = "var __PAGE_SCOPE_RUN__ = true;\n" + my_src;

    // Insert the script node into the page, so it will run, and immediately
    // remove it to clean up.  Use setTimeout to force execution "outside" of
    // the user script scope completely.
    setTimeout(function() {
          document.body.appendChild(script);
          document.body.removeChild(script);
        }, 0);
  })();

  // Stop running, because we know Greasemonkey actually runs us in
  // an anonymous wrapper.
  return;
}

console.debug("uvaccu helper activated");

var pseudoform = jQuery('.login-form.loginFormArea');
// Unwrap no-op form around password field
var passform = pseudoform.find('.password.field form');
if (passform.size() === 1) {
  passform.children().appendTo(passform.parent());
  passform.remove();
}
// Make pseudoform a real form
pseudoform.find('.username.field .login-field').attr('name', 'username').removeAttr('autocomplete');
pseudoform.find('.password.field .login-field').attr('name', 'password').removeAttr('autocomplete');
pseudoform.wrap('<form action="" method="post"></form>');

console.debug("uvaccu helper completed");
