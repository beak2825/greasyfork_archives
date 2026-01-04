// ==UserScript==
// @name         Google Chat Alt landing page
// @author       Pavol Babinčák
// @description  Intercepts links to Google Chat in Browser to open them in Google Chat Alt
// @version      0.1
// @license      MIT
// @grant        none
// @match        https://mail.google.com/chat/*
// @run-at       document-start
// @noframes
// @namespace https://greasyfork.org/users/1229861
// @downloadURL https://update.greasyfork.org/scripts/481609/Google%20Chat%20Alt%20landing%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/481609/Google%20Chat%20Alt%20landing%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The parameter to check for
    const webUIflag = 'webUI';

    // Function to check if URL has the parameter
    function hasParameter(url, parameter) {
        return new URL(url).searchParams.has(parameter);
    }

    // Function to add parameter to the URL
    function addParameter(url, parameter) {
        let newUrl = new URL(url);
        newUrl.searchParams.set(parameter, 1);
        return newUrl.href;
    }

    const currentPageUrl = window.location.href;

    // Check if the URL lacks the required parameter
    if (!hasParameter(currentPageUrl, webUIflag) && currentPageUrl.startsWith("https://mail.google.com/chat/")) {
        const webUrl = addParameter(currentPageUrl, webUIflag);
        const protoUrl = new URL(currentPageUrl).href.replace('https://', 'gchat://');

        const redirHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Google Chat Alt landing page</title>
            <style>
              .redirect_body {
                height: 100%;
                text-align: center;
                width: 600px;
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
                margin-top: 200px;
              }
              .hidden {
                display: none;
                visibility: hidden;
              }
          </style>
          </head>
          <body>
            <div class="redirect_body">
              <h1>Launching Google Chat Alt</h1>
              <p>Click "<b>Open Google Chat Alt</b>" to launch the desktop app.<br>
              Not working? <a href="${protoUrl}">Try again</a> or you can also <a target="_self" href="${webUrl}">use Google Chat in your browser</a>.</p>

              <iframe class="hidden" src="${protoUrl}"></iframe>
            </div>
          </body>
        </html>
		`;

        document.write(redirHtml);
        document.close();
    }
})();