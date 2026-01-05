// ==UserScript==
// @name        Always desktop Wikipedia
// @version     1.0.1
// @description Redirect mobile Wikipedia to desktop
// @author      AgentRev
// @namespace   https://github.com/AgentRev
// @include     *://*.m.wikipedia.org/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22673/Always%20desktop%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/22673/Always%20desktop%20Wikipedia.meta.js
// ==/UserScript==

location.href = location.href.replace(".m.wikipedia.org/", ".wikipedia.org/");
