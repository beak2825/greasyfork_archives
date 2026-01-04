// ==UserScript==
// @name         避免误发帖
// @namespace    https://fang.blog.miri.site
// @version      0.1
// @description  防止手残点到发帖按钮
// @author       Mr_Fang
// @match        https://www.mcbbs.net/forum.php?mod=post*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425244/%E9%81%BF%E5%85%8D%E8%AF%AF%E5%8F%91%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/425244/%E9%81%BF%E5%85%8D%E8%AF%AF%E5%8F%91%E5%B8%96.meta.js
// ==/UserScript==

(function() {
    jq('head').append('<style>input[type="checkbox"]{zoom: 150%;} button#postsubmit{width: 100px; height: 30px;}</style>');
    jq('button[name="topicsubmit"]').hide();
    jq('button[name="editsubmit"]').hide();
    jq('div.pnpost').before('<div style="padding: 10px 0px 0px 20px;"><label id="postlock"><input type="checkbox" name="postlock" id="postlock" class="pc">发布帖子</label></div>');
    jq("input#postlock").change(function() {
        if(jq("input#postlock").is(':checked') == true){
            jq('button[name="topicsubmit"]').show();
            jq('button[name="editsubmit"]').show();
        }else{
            jq('button[name="topicsubmit"]').hide();
            jq('button[name="editsubmit"]').hide();
        }
    });
})();