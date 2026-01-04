// ==UserScript==
// @name         Calm Vk Comment Loader
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Calmly load comments from vk post, not forgetting to clear memory on the way
// @author       You
// @match        https://vk.com/vop_ru
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415666/Calm%20Vk%20Comment%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/415666/Calm%20Vk%20Comment%20Loader.meta.js
// ==/UserScript==

var total_text = "";

var tolerance = 0.95;
function Very_Calmly_Get_First_Post(){ return $(".post:has(div)").first() }
function Very_Calmly_Get_Post_Expansion_Buttons(post) { return [$(post).find(".replies_next.replies_next_main"), $(post).find(".replies_short_deep"), $(post).find(".replies_next.replies_next_deep")] }
function Very_Calmly_Get_Post_Comment_Count(post) {
 var comment_count = $(post).find(".like_btn.comment._comment._reply_wrap")
 if(comment_count.length == 0) return 0

 comment_count = parseInt($(comment_count).first().text().replaceAll(",", "").replaceAll(".",""))
 if(isNaN(comment_count)) return 0
 return comment_count
}
function Very_Calmly_Get_Available_Comment_Count_For_Post(post) { return $(post).find(".reply_content").length }
function Very_Calmly_Append_Available_Comments_To_Total_Text(post) { $(post).find(".wall_reply_text").each(function(){total_text += $(this).text().replaceAll("\n", " ").trim() + "\n" }) }
function Very_Calmly_Put_Everything_Together()
{
   var post = Very_Calmly_Get_First_Post()

   var comment_count = Very_Calmly_Get_Post_Comment_Count(post)
   if(comment_count == 0) { $(post).empty(); return; }

    var available_comments_count = Very_Calmly_Get_Available_Comment_Count_For_Post(post)
    if(available_comments_count >= comment_count*tolerance) { tolerance = 0.95; Very_Calmly_Append_Available_Comments_To_Total_Text(post); $(post).empty(); return; }

    var expansion_buttons = Very_Calmly_Get_Post_Expansion_Buttons(post)
    $(expansion_buttons[0]).click()
    $(expansion_buttons[1]).click()
    $(expansion_buttons[2]).click()
    tolerance -= 0.01
    navigator.clipboard.writeText(total_text)
}

(function() {
    'use strict';
    $("#wall_fixed").empty()
    setInterval(Very_Calmly_Put_Everything_Together, 300)
    setInterval(function(){window.scrollBy(0, 100); setTimeout(function(){window.scrollBy(0, -100)}, 300);}, 600)
})();