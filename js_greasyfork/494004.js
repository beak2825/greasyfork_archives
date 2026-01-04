// ==UserScript==
// @name         old.reddit.com login form redirection fix
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a login form to the top right of old reddit and preserves the current page after login.
// @match        https://old.reddit.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494004/oldredditcom%20login%20form%20redirection%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/494004/oldredditcom%20login%20form%20redirection%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if an element with class "logout" exists
    if (document.querySelector('.logout') === null) {
        // Capture the current URL
        const currentURL = window.location.href;

        // Prepare the HTML form
        const formHTML = `
            <div id="login">
            <h1>Login</h1>
            <br>
              <form id="login-form" method="post" action="https://old.reddit.com/post/login" class="form-v2">
                  <input type="hidden" name="op" value="login">
                  <input type="hidden" name="dest" value="${currentURL}">
                  <div class="c-form-group">
                      <label for="user_login" class="screenreader-only">username:</label>
                      <input value="" name="user" id="user_login" class="c-form-control" type="text" maxlength="20" tabindex="3" placeholder="username" autofocus>
                  </div>
                  <div class="c-form-group">
                      <label for="passwd_login" class="screenreader-only">password:</label>
                      <input id="passwd_login" class="c-form-control" name="passwd" type="password" tabindex="3" placeholder="password">
                      <div class="c-form-control-feedback-wrapper">
                          <span class="c-form-control-feedback c-form-control-feedback-throbber"></span>
                          <span class="c-form-control-feedback c-form-control-feedback-error" title=""></span>
                          <span class="c-form-control-feedback c-form-control-feedback-success"></span>
                      </div>
                  </div>
                  <div class="c-checkbox">
                      <input type="checkbox" name="rem" id="rem_login" tabindex="3">
                      <label for="rem_login">remember me</label>
                      <a style="display:none;" href="https://old.reddit.com/password" class="c-pull-right">reset password</a>
                  </div>
                  <div class="spacer">
                      <div class="c-form-group g-recaptcha" data-sitekey="6LeTnxkTAAAAAN9QEuDZRpn90WwKk_R1TRW_g-JC"></div>
                      <span class="error BAD_CAPTCHA field-captcha" style="display:none"></span>
                  </div>
                  <div class="c-clearfix c-submit-group">
                      <span class="c-form-throbber"></span>
                      <button type="submit" class="c-btn c-btn-primary c-pull-right" tabindex="3">log in</button>
                  </div>
                  <div>
                      <div class="c-alert c-alert-danger"></div>
                  </div>
              </form>
            <div>
        `;

        // Find the element with the class "side" and prepend the form
        const sideElement = document.querySelector('.side');
        if (sideElement) {
            sideElement.insertAdjacentHTML('afterbegin', formHTML);
        }
        // Insert CSS styles into the document head
        const style = document.createElement('style');
        style.innerHTML = `
            #login .c-alert {
                display: none;
                font-size: 11px;
            }
            .c-alert-danger {
                background-color: #f9e7e6;
                border-color: #f7dfdd;
                color: #b73129 !important;
            }
            .c-alert {
                padding: 15px;
                margin: 8px 0 19px;
                border: 1px solid transparent;
                border-radius: 2px;
            }
            #login {
              padding: 15px;
              border: 1px solid #fff;
              margin-top: 15px;
              margin-bottom: 15px;
            }
        `;
        document.head.appendChild(style);
    }
})();
