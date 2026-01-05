// ==UserScript==
// @name		forum
// @description	       添加表情 
// @author      by 太原FC
// @include		*trophymanager.com/forum/cn*
// @version             2017050605
// @namespace https://greasyfork.org/users/44444
// @downloadURL https://update.greasyfork.org/scripts/29536/forum.user.js
// @updateURL https://update.greasyfork.org/scripts/29536/forum.meta.js
// ==/UserScript==




    var textarea_icons = document.getElementsByClassName("textarea_icons").innerHTML;
    alert(textarea_icons);
    textarea_icons = textarea_icons+"<span id='routineToggle'><span >xxx</span></span>";

