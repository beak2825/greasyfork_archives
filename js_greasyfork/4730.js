// ==UserScript==
// @name        QuickAddCharacter
// @namespace   © Darklce ♜
// @description Gắn nhanh Character
// @include     http://*/admin/index.forum?mode=generate&part=modules&sub=roleplay&tid=*
// @exclude     http://nkdesign.forumvi.com
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4730/QuickAddCharacter.user.js
// @updateURL https://update.greasyfork.org/scripts/4730/QuickAddCharacter.meta.js
// ==/UserScript==

$(function(){
   $('#main-content > fieldset').after('<div class="center"><input value="Cập nhật đanh sách" id="k_QAC_update" type="submit" /></div>');
   $('#k_QAC_update').click(function(){
     var u_link = $('#main-content > fieldset').find('.forumline tbody > tr + tr > td + td > a').attr("href");
     $('#main-content > fieldset').css('opacity','0.5');
     $('#main-content > fieldset').load(u_link + " #main-content > fieldset", function(){
         var u_comp = $(this).html();
         $(this).after(u_comp).remove();
     });
   });
});