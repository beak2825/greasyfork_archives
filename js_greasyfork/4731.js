// ==UserScript==
// @name         CS_WH Editor
// @namespace    http://devs.forumvi.com/
// @version      0.9
// @description  Change The Character Sheet's Width and Height
// @copyright    2014+, NCat
// @icon         http://png-4.findicons.com/files/icons/2776/android_icons/48/ic_size_up.png
// @include      http://*/admin/index.forum*
// @include      *part=modules*
// @include      *sub=roleplay*
// @include      *mode=management*
// @include      *mod=edit*
// @match        http://*/admin/index.forum*
// @match        *part=modules*
// @match        *sub=roleplay*
// @match        *mode=management*
// @match        *mod=edit*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/4731/CS_WH%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/4731/CS_WH%20Editor.meta.js
// ==/UserScript==

$(".forumline .post:not([name='avatarurl'])").replaceWith(function(){
   return '<textarea class="post" name="' + this.name + '" style="with:98%;height:200px">' + this.value + '</textarea>';
});