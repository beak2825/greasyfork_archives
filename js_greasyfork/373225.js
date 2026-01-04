// ==UserScript==
// @name     leetcode英文版讨论区
// @version    0.0.5
// @description  中文区的讨论很少，点击查看英文区的讨论
// @author     1xin
// @require     http://code.jquery.com/jquery-latest.js
// @noframes
// @match    *://leetcode-cn.com/problems/*
// @grant    GM_addStyle
// @grant    GM.getValue
// @grant    GM_openInTab
// @grant    GM_notification
// @namespace https://greasyfork.org/users/183871
// @downloadURL https://update.greasyfork.org/scripts/373225/leetcode%E8%8B%B1%E6%96%87%E7%89%88%E8%AE%A8%E8%AE%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/373225/leetcode%E8%8B%B1%E6%96%87%E7%89%88%E8%AE%A8%E8%AE%BA%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var addNextButton={
        addButton:function(next_video_url){
            var next_btn_html = '';
            next_btn_html +='<button id="englishbutton" class="btn__r7r7 tools-btn__YErs">';
            next_btn_html +="<h3>";
            next_btn_html +='<font color="red">';
            next_btn_html +='查看英文区（leetcode.com）的讨论'
            next_btn_html +='</font>'
            next_btn_html +="</h3>";
            next_btn_html +='</button>';
            //增加下一个视频按钮
            var ul_tag = $("#app");
            if (ul_tag) {
                ul_tag.append(next_btn_html);
            }
            $("#englishbutton").click(function(){
                GM_openInTab(next_video_url);
            });
        }

    };
    var leetSite = window.location.href;
    var patt1=new RegExp("(?<=https://leetcode-cn.com/problems/)[^/]+");
    var text=patt1.exec(leetSite)
    var url_en="https://leetcode.com/problems/";
    url_en+=text;
    url_en+="/discuss/";
    //alert(url_en);
    addNextButton.addButton(url_en);
    // Your code here...
})();