// ==UserScript==
// @name         For most io sites Io Gaming Cursor
// @version      3.1
// @description  For MOST .IO SITES This one is even better Its sick! I helps see... I think commnets> just below For most io sites
// @author       enigMyth_Thunder
// @include      http://brutal.io/
// @namespace https://greasyfork.org/ja/users/161581
// @downloadURL https://update.greasyfork.org/scripts/374592/For%20most%20io%20sites%20Io%20Gaming%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/374592/For%20most%20io%20sites%20Io%20Gaming%20Cursor.meta.js
// ==/UserScript==
var cursorStyle = "https://pngimage.net/wp-content/uploads/2018/05/cool-cursor-png-4.png (images/cursor.png) x 256x y 256x, auto";
var cursorRefresh = function() { document.getElementById("https://pngimage.net/wp-content/uploads/2018/05/cool-cursor-png-4.png").style.cursor = cursorStyle; };
window.onmouseup = function() { cursorStyle = "https://pngimage.net/wp-content/uploads/2018/05/cool-cursor-png-4.png (https://pngimage.net/wp-content/uploads/2018/05/cool-cursor-png-4.png) x 256x y 256x, auto"; cursorRefresh(); };
window.onmousedown = function() { cursorStyle = "https://pngimage.net/wp-content/uploads/2018/05/cool-cursor-png-4.png (https://pngimage.net/wp-content/uploads/2018/05/cool-cursor-png-4.png) x 256x y 256x auto"; cursorRefresh(); };
window.onmousemove = function() { if ( document.getElementById("canvas").style.cursor = cursorStyle ) { cursorStyle = "https://pngimage.net/wp-content/uploads/2018/05/cool-cursor-png-4.png (https://pngimage.net/wp-content/uploads/2018/05/cool-cursor-png-4.png) x 256x y 256x, auto"; cursorRefresh(); } };