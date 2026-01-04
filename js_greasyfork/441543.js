// ==UserScript==
// @name     Gitlab raw commit adder
// @description Replace the mangled commit message with the full patch, which is in general more useful to the experienced git user than the web UI, where you have to change views multiple time to see the contents of a commit and it's impossible to get the raw patch (other than appending .patch to the URL).
// @version  1.2
// @include  /^https://gitlab.com/.*/commit/[0-9A-Fa-f]{6}[0-9A-Fa-f]*$/
// @icon     https://git-scm.com/favicon.ico
// @grant    none
// @namespace de.hostalia.user-scripts
// @license  GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/441543/Gitlab%20raw%20commit%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/441543/Gitlab%20raw%20commit%20adder.meta.js
// ==/UserScript==
// Copyright 2022 Marcus Müller <marcus_grease@hostalia.de>
// SPDX-License-Identifier: GPL-2.0
/*
 * CHANGELOG
 * 1.0: initial release
 * 1.2: shorten to message by default, allow display of full commit on clicking
 */
var url = document.documentURI + '.patch';

fetch(url)
  .then(function(response) {
      response.text().then(function(text) {
      done(text);
    });
  });

function done(text) {
    var elem = document.querySelector(".commit-description");
    if(elem !== undefined) {
        elem = document.createElement("pre");
        elem.classList.add("commit-description");
        document.querySelector(".commit-box").appendChild(elem);
    }
    var position = text.indexOf("\n---\n");
    var shorttext = text;
    var fulltext = text;
    if(position !== -1) {
        shorttext = text.substring(0, position);
    }
    elem.textContent = shorttext;
    elem.onclick = function(event) {
        elem.textContent = fulltext;
    }
}
