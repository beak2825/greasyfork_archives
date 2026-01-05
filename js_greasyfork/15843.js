// ==UserScript==
// @name                        Openload.co show real download button
// @version                     0.0.1
// @grant                       none
// @description                 Hides the fake download button/timer and shows the real download button
// @include                     http://openload.co/*
// @include                     https://openload.co/*
// @author                      Jimmy
// @namespace                   https://greasyfork.org/users/5561
// @run-at						document-end
// @downloadURL https://update.greasyfork.org/scripts/15843/Openloadco%20show%20real%20download%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/15843/Openloadco%20show%20real%20download%20button.meta.js
// ==/UserScript==
$("#downloadTimer").slideUp();
$("#realdl").slideDown();