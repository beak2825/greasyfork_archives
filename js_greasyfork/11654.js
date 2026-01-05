// ==UserScript==
// @name       Ren's custom header
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  Adds various shortcuts
// @match      http://*/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/11654/Ren%27s%20custom%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/11654/Ren%27s%20custom%20header.meta.js
// ==/UserScript==
var regex = /\(Unread(.*?)\)/;
var revised = "(Unread $1) | <a href='forumdisplay.php?fid=25'>Lounge</a> | <a href='forumdisplay.php?fid=230'>Archive</a> | <a href='forumdisplay.php?fid=133'>RMG</a> |  <a href='forumdisplay.php?fid=6'>Graphics</a> | <a href='forumdisplay.php?fid=219'>Graphics Market</a> | <a href='forumdisplay.php?fid=322'>PMI & Anonymity</a> |";
document.getElementById('panel').innerHTML= document.getElementById('panel').innerHTML.replace(regex,revised);