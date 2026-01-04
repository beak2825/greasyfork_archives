// ==UserScript==
// @name         Disable styles
// @namespace    disablestyles
// @version      0.1
// @description  title
// @match        http://www.neopets.com/guilds/guild.phtml?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36210/Disable%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/36210/Disable%20styles.meta.js
// ==/UserScript==

$('document').ready(function(){
  $('#neobdy').prepend('<button id="disable-style" style="position: fixed; top: 0px; right: 0px;">Disable style</button>');
  $('#disable-style').click(function(){disableStyle()});
});

function disableStyle() {
  //alert("style disabled");
  $('#content .content style').remove();
  $('#content .content *[style!=""]').attr("style","");
  $('#content .content img').remove();
}