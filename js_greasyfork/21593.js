// ==UserScript==
// @name        HS CB Floater
// @include     http://game.galaxywarfare.com*
// @description Adds the HS CB to GW
// @version     Public Beta 5.5
// @require     http://code.jquery.com/jquery-3.1.0.js
// @namespace   https://greasyfork.org/users/26728
// @downloadURL https://update.greasyfork.org/scripts/21593/HS%20CB%20Floater.user.js
// @updateURL https://update.greasyfork.org/scripts/21593/HS%20CB%20Floater.meta.js
// ==/UserScript==

var CB = document.createElement('div');
var missions = document.getElementById('missions');
missions.parentNode.insertBefore(CB, missions);

CB.innerHTML =''
+ '<div class="well well-small" id="CB1" style="display: none;">'
+ '<iframe src="http://v1.halosphere.net/shoutbox_frame.php?id=3839" style="border: 0px # none; width: 100%;" height="160px"></iframe>'
+ '</div>';

var CBC = document.createElement('span');
var chat = document.getElementById('halosphere');
chat.parentNode.insertBefore(CBC, chat.nextSibiling);

CBC.innerHTML ='<a href="javascript:;" style="display: inline; border-top-left-radius: 0px; border-bottom-left-radius: 0px;" onclick="$(\'#CB1\').toggle();" class="btn btn-mini togglebtn pull-right btn-primary">Toggle HS CB</a>';