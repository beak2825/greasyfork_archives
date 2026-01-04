// ==UserScript==
// @name         Redirect from Embed openload to download page
// @namespace    ---
// @version      1.0
// @description  redirect openload
// @author       pkncsk
// @include        https://openload.co/embed/*
// @downloadURL https://update.greasyfork.org/scripts/35194/Redirect%20from%20Embed%20openload%20to%20download%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/35194/Redirect%20from%20Embed%20openload%20to%20download%20page.meta.js
// ==/UserScript==
var url             = window.location.href;               
window.location     = url.replace(/embed/, 'f');

