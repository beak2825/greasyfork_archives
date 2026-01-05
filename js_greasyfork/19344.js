// ==UserScript==
// @name        Revolvy.com tracking
// @description Eliminate "disable tracking" alert on Firefox when Tracking Protection or Adblock/uBlock is turned on
// @version     1.0.0
// @include     http://www.revolvy.com/*
// @grant       none
// @author      xul_runner
// @license     MIT
// @namespace https://greasyfork.org/users/41691
// @downloadURL https://update.greasyfork.org/scripts/19344/Revolvycom%20tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/19344/Revolvycom%20tracking.meta.js
// ==/UserScript==
// jshint esnext:true, moz:true, globalstrict:true, browser:true, jquery:true
'use strict';

function init_facebook_events()
{
  $("body").data("fb_init", 1);
  return true;
}

addJS_Node (init_facebook_events);

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}