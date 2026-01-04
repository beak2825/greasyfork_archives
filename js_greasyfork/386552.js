// ==UserScript==
// @name         NGA ++
// @namespace    shfeat
// @author       shfeat
// @version      0.1.1
// @description  NGA 显示所有头像，屏蔽广告
// @include      http*://bbs.nga.cn/*
// @include      http*://nga.178.com/*
// @include      http*://ngabbs.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_addStyle
// @require      http://libs.baidu.com/jquery/2.1.3/jquery.min.js
// @homepageURL  https://greasyfork.org/zh-CN/scripts/386552-nga
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/386552/NGA%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/386552/NGA%20%2B%2B.meta.js
// ==/UserScript==

(function() {
	$(document).ready(function() {
        if(/adpage_insert/.test(window.location.href))
            getJump();

        $("#m_posts_c > table.postbox").each(function(i, el){
            var uid = $(el).find("a[name=uid]").text();
            if(uid && commonui.userInfo.users[uid].avatar) {
                var avatar_type = typeof(commonui.userInfo.users[uid].avatar);
                $(el).find('span.posterinfo > img').remove();
                if(avatar_type == 'object') {
                    for(i in commonui.userInfo.users[uid].avatar) {
                        if(/^http/.test(commonui.userInfo.users[uid].avatar[i])) {
                            $(el).find("a[name=uid]").parent().after('<img src="'+commonui.userInfo.users[uid].avatar[i]+'" style="max-width:180px;max-height:255px" class="avatar">');
                        }
                    }
                } else if(avatar_type == 'string') {
                    $(el).find("a[name=uid]").parent().after('<img src="'+commonui.userInfo.users[uid].avatar+'" style="max-width:180px;max-height:255px" class="avatar">');
                }
            }
        });

        $('#post1strow0 td.null').remove();
        $('#m_posts_c > span:eq(0)').remove();
        $('#fast_post_c tr.row1 td.c2:eq(1)').remove();
        $('#posterinfo0').css('min-height', '200px');
        $('.forumbox .postrow h3').css('font-size', '1.37em');

        //__COOKIE.setMiscCookieInSecond('pv_count_for_insad', 0);
    });
})();