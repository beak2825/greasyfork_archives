// ==UserScript==
// @name         Images and Links
// @version      0.4.2
// @description  Easily comment with images and links
// @author       otro_user_gil
// @include      http://www.steamgifts.com/*
// @include      https://steamgifts.com/*
// @include      http://*.steamgifts.com/*
// @include      https://*.steamgifts.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/15121
// @downloadURL https://update.greasyfork.org/scripts/12323/Images%20and%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/12323/Images%20and%20Links.meta.js
// ==/UserScript==

var buttons = "<script type=\"text/javascript\">function image_up(){var img=prompt(\"Insert the link of your image here\",\"\");var link=\"![Cat](\"+img+\")\";if(img===null||img===\"\"){return img;}else{var textarea=document.getElementsByName(\"description\");for(var i=0;i<textarea.length;i++){textarea[i].value=textarea[i].value+link;}}}function link_up(){var link=prompt(\"Insert the URL link here\",\"\");if(link===null||link===\"\"){return link;}else{var texto=prompt(\"Custom Text\",\"\");if(texto===null||texto===\"\"){texto=link;var enlace=\"[\"+texto+\"](\"+link+\")\";var textarea=document.getElementsByName(\"description\");for(var i=0;i<textarea.length;i++){textarea[i].value=textarea[i].value+enlace;}}else{var enlace=\"[\"+texto+\"](\"+link+\")\";var textarea=document.getElementsByName(\"description\");for(var i=0;i<textarea.length;i++){textarea[i].value=textarea[i].value+enlace;}}}}</script><div style=\"position: relative; width: 65px; float: right; margin-left: 15px;\"> <input type=\"button\" value=\"Image\" onClick=\"image_up()\" style=\"position: absolute; cursor:pointer; margin-top: -14px;\"/> <input type=\"button\" onClick=\"link_up()\" value=\"Url\" style=\"margin-top: -14px; position: absolute; cursor:pointer; margin-left: 80px;\"/>  </div>";
$(".align-button-container").append(buttons);