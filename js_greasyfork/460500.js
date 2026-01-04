// ==UserScript==
// @name        New script - practicepal.co.uk
// @namespace   Violentmonkey Scripts
// @match       https://software.practicepal.co.uk/frmContact.aspx
// @grant       none
// @version     1.0
// @author      -
// @description 11/02/2023, 23:48:01
// @downloadURL https://update.greasyfork.org/scripts/460500/New%20script%20-%20practicepalcouk.user.js
// @updateURL https://update.greasyfork.org/scripts/460500/New%20script%20-%20practicepalcouk.meta.js
// ==/UserScript==

const a1 = document.getElementById('UcPxHeader1_RadNotification2_C_RadListBox2_i0');
const a2 = document.getElementById('UcPxHeader1_RadNotification2_C_RadListBox2_i1');
const a3 = document.getElementById('UcPxHeader1_RadNotification2_C_RadListBox2_i2');
const a4 = document.getElementById('UcPxHeader1_RadNotification2_C_RadListBox2_i3');
const a5 = document.getElementById('UcPxHeader1_RadNotification2_C_RadListBox2_i4');
const a6 = document.getElementById('UcPxHeader1_RadNotification2_C_RadListBox2_i5');
const a7 = document.getElementById('UcPxHeader1_RadNotification2_C_RadListBox2_i6');
const a8 = document.getElementById('UcPxHeader1_RadNotification2_C_RadListBox2_i7');
const a9 = document.getElementById('UcPxHeader1_RadNotification2_C_RadListBox2_i8');
const a10 = document.getElementById('UcPxHeader1_RadNotification2_C_RadListBox2_i9');

var output = '';

if (a1 != null && a1 != undefined){ output += a1.innerHTML + "\n"; }
if (a2 != null && a2 != undefined){ output += a2.innerHTML + "\n"; }
if (a3 != null && a3 != undefined){ output += a3.innerHTML + "\n"; }
if (a4 != null && a4 != undefined){ output += a4.innerHTML + "\n"; }
if (a5 != null && a5 != undefined){ output += a5.innerHTML + "\n"; }
if (a6 != null && a6 != undefined){ output += a6.innerHTML + "\n"; }
if (a7 != null && a7 != undefined){ output += a7.innerHTML + "\n"; }
if (a8 != null && a8 != undefined){ output += a8.innerHTML + "\n"; }
if (a9 != null && a9 != undefined){ output += a9.innerHTML + "\n"; }
if (a10 != null && a10 != undefined){ output += a10.innerHTML; }

if (output != '')
{
  alert(output);
}