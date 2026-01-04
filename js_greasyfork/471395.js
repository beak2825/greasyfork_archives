// ==UserScript==
// @name         Steam2SteamDB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Imports Steam Wishlist to SteamDB Watchlist, albeit very slowly. Instructions below.
// @author       You
// @match        https://steamdb.info/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamdb.info
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471395/Steam2SteamDB.user.js
// @updateURL https://update.greasyfork.org/scripts/471395/Steam2SteamDB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('js-watch').click(); //clicks the Watch button
    setTimeout("self.close()", 5000 );           //closes tab after 5 seconds

})();

/*
Copy the following code into a text editor and save as an html:

!---------HTML Code Start---------!
<!doctype html>
<html>
<head>
<title>Open Windows</title>
<script>
function openWindow(){
    var x = document.getElementById('a').value.split('\n');
    atTime = 0;
    for (var i = 0; i < x.length; i++) {
      if (x[i].indexOf('.') > 0) {
        site = x[i];
        if (x[i].indexOf('://') < 0) { site = 'https://' + x[i]; }
        setTimeout("window.open('" + site + "')", atTime);
        atTime += 20000;
      }
    }
}
</script>
<style>
html, body
{
    height : 99%;
    width  : 99%;
}

textarea
{
    height : 80%;
    width  : 90%;
}
</style>
</head>
<body>
<textarea id="a"></textarea>
<br>
<input type="button" value="Open Windows" onClick="openWindow()">
<input type="button" value="Clear" onClick="document.getElementById('a').value=''">
</body>
</html>
!----------HTML Code End----------!

Using the Augmented Steam extension(https://augmentedsteam.com/), export your
wishlist as text type with the following text format: https://steamdb.info/app/%appid%

Click copy to clipboard.

Open and paste links in the text box from the previously created html page, click the
Open Window button, and let the magic begin.

If your browser warns or blocks any pop-ups created by the local html file, enable/allow them,
or this will not work.

To change the delay time to open links, edit the line in the html code: atTime += 20000;
The number is in milliseconds, so 20000 is 20 seconds, 1000ms is 1 second.

*/