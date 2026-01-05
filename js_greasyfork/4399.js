// ==UserScript==
// @name       HowSpectacular Facebook unforcer
// @author     jCuber
// @namespace  http://github.com/jCuber
// @version    1.1.01
// @description  Removes the forced Facebook Like prompt on HowSpectacular-posts
// @match      http://howspectacular.com/*
// @copyright  2014+, jCuber
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @license    MIT License
// @downloadURL https://update.greasyfork.org/scripts/4399/HowSpectacular%20Facebook%20unforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/4399/HowSpectacular%20Facebook%20unforcer.meta.js
// ==/UserScript==

$(".likebox_ct, #top_login, #post_login_ct").remove();
$("#post_hide").show();

// That's it folks!