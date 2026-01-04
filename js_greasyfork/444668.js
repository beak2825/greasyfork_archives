// ==UserScript==
// @name         Hans5958's Follow Dashboard
// @namespace    Hans5958
// @version      1
// @description  A (ugly, but) convinent follow dashboard. Great for follow accounts. Visit scratch.mit.edu/follow to activate the dashboard. (Deprecated: Use at your own risk.)
// @copyright    Hans5958
// @license      MIT
// @match        https://scratch.mit.edu/follow
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @homepageURL  https://github.com/Hans5958/userscripts
// @supportURL   https://github.com/Hans5958/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/444668/Hans5958%27s%20Follow%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/444668/Hans5958%27s%20Follow%20Dashboard.meta.js
// ==/UserScript==

var userNow = Scratch.INIT_DATA.LOGGED_IN_USER.model.username;
var content = "<div id='content'><div class='container'><h1>Hans5958's Follow Dashboard</h1><table><tr><td style='padding: 2px; vertical-align: bottom;'></script><textarea placeholder='Username' rows='1' cols='40' id='user'></textarea></td><td style='padding: 2px; vertical-align: top;'><form id='form1' action='javascript:f()'><input type='submit' value='Follow' /></form></td><td style='padding: 2px; vertical-align: top;'><form style= id='form2' action='javascript:function f(){$.ajax({type:\x22PUT\x22,url:\x22https://scratch.mit.edu/site-api/users/followers/\x22+document.getElementById(\x22user\x22).value+\x22/add/\x22,data:{usernames:document.getElementById(\x22user\x22).value}}),parent.document.getElementById(\x22iframel\x22).src=\x22https://scratch.mit.edu/users/\x22+document.getElementById(\x22user\x22).value,Scratch.AlertView.msg($(\x22#alert-view\x22),{alert:\x22success\x22,msg:Scratch.ALERT_MSGS.followed+document.getElementById(\x22user\x22).value})}'><input type='submit' value='Declare'/></form></td></tr></table></div><iframe id='iframel' src='https://scratch.mit.edu' height='500' width='49.5%'></iframe><iframe id='iframer' height='500' width='49.5%'></iframe></body>/div>";
$("div#content").replaceWith(content);
parent.document.getElementById('iframer').src = 'https://scratch.mit.edu/users/' + userNow;
