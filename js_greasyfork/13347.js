// ==UserScript==
// @name           pixiv_rm_sharebtn
// @namespace      http://shikato.org/pixiv_rm_likebtn
// @author         shikato
// @description    pixivの「いいね」などの危険なシェア系ボタンを削除します
// @version        0.0.2
// @include        https://www.pixiv.net/member_illust.php*
/* load jQuery */  
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/13347/pixiv_rm_sharebtn.user.js
// @updateURL https://update.greasyfork.org/scripts/13347/pixiv_rm_sharebtn.meta.js
// ==/UserScript==    
setInterval(function () {
  if (!$('._reaction-buttons-container').length) return;
  $('._reaction-buttons-container').remove();
}, 300);
 
