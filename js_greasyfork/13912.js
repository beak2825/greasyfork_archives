// ==UserScript==
// @name         Script-skorpion
// @namespace    https://greasyfork.org/es/scripts/13912-script-skorpion
// @version      1
// @description  bloqueo de barra de notificaciones
// @author       Luis Skorpion
// @include     http://apps.facebook.com/*
// @include     https://apps.facebook.com/*
// @grant       metadata
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @copyright   2015, Skorpion
// @downloadURL https://update.greasyfork.org/scripts/13912/Script-skorpion.user.js
// @updateURL https://update.greasyfork.org/scripts/13912/Script-skorpion.meta.js
// ==/UserScript==


jQuery(document).ready(function() {
jQuery("#blueBarDOMInspector").css("position","fixed","!important");
jQuery("#blueBarDOMInspector").css("z-index","1000");
jQuery("#blueBarDOMInspector").css("width","100%");
jQuery("div._lh-:nth-child(2)").css("margin-top","40px");
jQuery("#u_0_n").css("height","960px","!important");
jQuery("#rightCol").css("display","none");
});

