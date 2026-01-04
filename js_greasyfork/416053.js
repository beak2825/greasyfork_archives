// ==UserScript==
// @name PC PartPicker Redirector to Canada website
// @description Auto redirect pcpartpicker.com domains to ca.pcpartpicker.com
// @namespace Mikhoul
// @version 0.1
// @author Mikhoul
// @license MIT License
// @run-at document-start
// @match *://pcpartpicker.com/*
// @downloadURL https://update.greasyfork.org/scripts/416053/PC%20PartPicker%20Redirector%20to%20Canada%20website.user.js
// @updateURL https://update.greasyfork.org/scripts/416053/PC%20PartPicker%20Redirector%20to%20Canada%20website.meta.js
// ==/UserScript==
"use strict";
window.location.replace(location.href.replace(location.hostname, "ca.pcpartpicker.com"));