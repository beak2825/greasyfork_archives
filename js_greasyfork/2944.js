// ==UserScript==
// @name       xadamxk custom header
// @namespace  http://use.i.E.your.homepage/
// @version    1.1.6
// @description  Adds various shortcuts to the HF toolbar.
// @match      hackforums.net/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/2944/xadamxk%20custom%20header.user.js
// @updateURL https://update.greasyfork.org/scripts/2944/xadamxk%20custom%20header.meta.js
// ==/UserScript==
var regex = /\(Unread(.*?)\)/;
var revised = "(Unread $1) | <a href='forumdisplay.php?fid=25'>Lounge</a> | <a href='forumdisplay.php?fid=2'>RANF</a> | <a href='forumdisplay.php?fid=53'>Groups</a> | <a href='forumdisplay.php?fid=247'>Web Browsers</a> |  <a href='forumdisplay.php?fid=250'>Eclipse</a> | <a href='forumdisplay.php?fid=105'>Market</a> | <a href='forumdisplay.php?fid=137'>iOS & iDevices</a> | <a href='private.php?action=tracking'>PM Tracking</a> |";
document.getElementById('panel').innerHTML= document.getElementById('panel').innerHTML.replace(regex,revised);