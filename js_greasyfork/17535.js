// ==UserScript==
// @name        ModdingHQ Shout Mod
// @namespace   https://moddinghq.com
// @description ModdingHQ Shout Box Plugin that adds shout Spamming and deleting features
// @include     https://moddinghq.com/shoutbox/
// @version     1.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17535/ModdingHQ%20Shout%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/17535/ModdingHQ%20Shout%20Mod.meta.js
// ==/UserScript==
$(document).ready(function(){var t=$("#taigachat_toolbar");sbAddButton='<input type="button" id="JimErase" value="Erase" class="button primary">',sbAddButton+='   <input type="button" id="SpamMessage" value="Spam" class="button primary">',t[0].innerHTML+=sbAddButton}),$("#JimErase").click(function(){$("#taigachat_box ol li").each(function(){41==$(this).attr("data-userid")&&XenForo.ajax("shoutbox/"+$(this).attr("data-messageid")+"/delete",{})})}),$("#SpamMessage").click(function(){var t=prompt("Enter a message to spam!",""),a=prompt("Enter the amount of times too spam","");for(i=0;i<a;i++)XenForo.ajax(taigachat.url_post,{message:t,sidebar:taigachat.sidebar?"1":"0",color:taigachat.customColor,room:taigachat.room})});