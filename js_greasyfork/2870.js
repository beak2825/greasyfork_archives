// ==UserScript==
// @name           Increasing Visited Count on Tetris Friends
// @description    Refreshes your profile page to increase the visited count.
// @include        http://www.tetrisfriends.com/users/profile.php*
// @version 0.0.1.20140807063011
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/2870/Increasing%20Visited%20Count%20on%20Tetris%20Friends.user.js
// @updateURL https://update.greasyfork.org/scripts/2870/Increasing%20Visited%20Count%20on%20Tetris%20Friends.meta.js
// ==/UserScript==

if(document.getElementById('container')==null) { setTimeout('location.reload()', 10000) } else { location.reload() }
