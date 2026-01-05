// ==UserScript==
// @name         Agar.io Skin Checker
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       Voakie
// @match        http://agar.io/skincheck
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/18322/Agario%20Skin%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/18322/Agario%20Skin%20Checker.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

window.jQuery;

var newhtml = "<h1>Agar.io Skin Checker</h1><p><i>by <b>Voakie</b></i></p><hr><p>1. Skin URL: </p><input type='url' placeholder='http://myskin.com/' class='url'><br><p>2. Cell name: </p><input type='text' placeholder='Name' class='name'><br><p>3. Name color: </p><input type='color' class='color' value='#ffffff'><br><button class='submit'>Submit</button>";

$("head").html("<link href='https://fonts.googleapis.com/css?family=Ubuntu' rel='stylesheet' type='text/css'><link rel='stylesheet' href='http://codepen.io/Voakie/pen/JXJvwq.css'><title>Agar.io Skin Checker</title><script src='http://codepen.io/Voakie/pen/JXJvwq.js'></script>");
$("body").html(newhtml);

alert("Agar.io Skin Checker by Voakie, thanks for using!");