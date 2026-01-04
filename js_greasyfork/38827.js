// ==UserScript==
// @name        Internet Positif Redirect
// @namespace   https://github.com/ditdot
// @description Handle Internet Positif redirected (blocked) page
// @author      Dit Dot <ditdotx@gmail.com>
// @include     *://internetpositif.uzone.id/*
// @version     0.1
// @grant       none
// @run-at      document-start
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/38827/Internet%20Positif%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/38827/Internet%20Positif%20Redirect.meta.js
// ==/UserScript==
 
'use strict';
 
(function (location) {
  location.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(
    '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head><title>Blocked by Internet Positif</title></head>' +
    '<body>' +
    '<h1>Blocked by Internet Positif</h1>' +
    '<h3>' + document.referrer + '</h3>' +
    '</body>' +
    '</html>'
  )
}) (window.location);