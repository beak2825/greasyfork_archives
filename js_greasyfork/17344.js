// ==UserScript==
// @name        Lexicon Shout Mod
// @namespace   http://lexicongta.com/
// @description Lexicon Shout Box Plugin that adds shout editing and deleting features
// @include     http://lexicongta.com/dashboard
// @version     1.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17344/Lexicon%20Shout%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/17344/Lexicon%20Shout%20Mod.meta.js
// ==/UserScript==
$(document).ready(function(){idle_time_limit = 2147483647;var t=document.getElementsByClassName("row");sbAddButton='<a id="JimErase" class="btn btn-info pull-right" style="margin-right: 5px">Erase</a>',sbAddButton+='<a id="EditShouts" class="btn btn-info pull-right" style="margin-right: 5px">Edit</a>',sbAddButton+='<a id="SpamMessage" class="btn btn-info pull-right" style="margin-right: 5px">Spam</a>',t[2].innerHTML+=sbAddButton}),$("#JimErase").click(function(){$("[ondblclick]").each(function(){var t=new XMLHttpRequest;t.open("GET","chat/engine.php?do=delete&id="+$(this).attr("id"),!0),t.send()})}),$("#EditShouts").click(function(){var t=prompt("Enter new message!","");null!=t&&$("[ondblclick]").each(function(){r=new XMLHttpRequest,r.open("GET","chat/engine.php?do=edit&id="+$(this).attr("id")+"&message="+t,!0),r.send()})}),$("#SpamMessage").click(function(){var t=new XMLHttpRequest,e=prompt("Enter a message to spam!",""),n=prompt("Enter the amount of times too spam",""),a=2100,s=0;leSBSpam=setInterval(function(){return s++,s>n?!1:void t.open("GET","chat/engine.php?do=send&message="+encodeURIComponent(e),!0),t.send()},a)});