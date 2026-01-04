// ==UserScript==
// @name     Youtube Better UI Identifier
// @description Better Youtube Yo
// @version  1
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant    none
// @match https://www.youtube.com/*
// @run-at      document-idle
// @namespace https://greasyfork.org/users/177087
// @downloadURL https://update.greasyfork.org/scripts/41036/Youtube%20Better%20UI%20Identifier.user.js
// @updateURL https://update.greasyfork.org/scripts/41036/Youtube%20Better%20UI%20Identifier.meta.js
// ==/UserScript==

var items = document.getElementsByClassName("style-scope yt-img-shadow");

var newHTML         = document.createElement ('div');
newHTML.innerHTML   = '             \
    <div>             \
        Logged as <img src=\" ' + items[1].src + '\" width="30" height="30" style=\"vertical-align: middle;margin-left: auto;margin-right: auto;\" > \
    </div>                          \
';

newHTML.setAttribute("style", "width: 135px;font-size:20px;position:absolute;top:10px;left:350px;color:#008000;background-color:#232323;border-style:dashed;;border-color:#008000;font-family:OpenSans-Light,Arial,Helvetica,sans-serif;");
document.getElementById("masthead-container").appendChild(newHTML); 