// ==UserScript==
// @name        Redirect to latest release - docs.rs
// @namespace   Violentmonkey Scripts
// @match       https://docs.rs/*
// @grant       none
// @version     1.0
// @author      Blusk
// @description 6/19/2022, 8:12:26 PM
// @run-at        document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446737/Redirect%20to%20latest%20release%20-%20docsrs.user.js
// @updateURL https://update.greasyfork.org/scripts/446737/Redirect%20to%20latest%20release%20-%20docsrs.meta.js
// ==/UserScript==

const path = window.location.pathname.split("/");
const version = path[2]

if (version !== "latest" && /^[\d\.]+$/.test(version)) {
  path[2] = "latest";
  window.location.pathname = path.join("/");
}