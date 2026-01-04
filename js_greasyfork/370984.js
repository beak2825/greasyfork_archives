// ==UserScript==
// @name         汤不热首页只显示视频，并去掉推荐内容(Tumblr Show only video on the Dashboard and remove the recommended content)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  首页只显示视频，并去掉推荐内容(Tumblr Show only video on the Dashboard and remove the recommended content)
// @author       Frank
// @match        https://www.tumblr.com/dashboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370984/%E6%B1%A4%E4%B8%8D%E7%83%AD%E9%A6%96%E9%A1%B5%E5%8F%AA%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91%EF%BC%8C%E5%B9%B6%E5%8E%BB%E6%8E%89%E6%8E%A8%E8%8D%90%E5%86%85%E5%AE%B9%28Tumblr%20Show%20only%20video%20on%20the%20Dashboard%20and%20remove%20the%20recommended%20content%29.user.js
// @updateURL https://update.greasyfork.org/scripts/370984/%E6%B1%A4%E4%B8%8D%E7%83%AD%E9%A6%96%E9%A1%B5%E5%8F%AA%E6%98%BE%E7%A4%BA%E8%A7%86%E9%A2%91%EF%BC%8C%E5%B9%B6%E5%8E%BB%E6%8E%89%E6%8E%A8%E8%8D%90%E5%86%85%E5%AE%B9%28Tumblr%20Show%20only%20video%20on%20the%20Dashboard%20and%20remove%20the%20recommended%20content%29.meta.js
// ==/UserScript==

var $ = window.jQuery;

var liAmount = 0;
var tutorial1 = '<a href="https://mp.weixin.qq.com/s?__biz=MzI5MDMzODAxMw==&mid=100000611&idx=1&sn=136b2098615aba641745be086c2df3b4&chksm=6c2026d15b57afc72761ca22c981221e20f0b7b382173a8ae5c405ad067d148a016f2e36dc6f&mpshare=1&scene=1&srcid=0731alSomHhi9bDz37l3MDCs#rd">翻墙教程一（使用VPN）</a>';
var tutorial2 = '<a href="https://mp.weixin.qq.com/s?__biz=MzI5MDMzODAxMw==&mid=2247484278&idx=1&sn=304a65eb059e9e8704e5fd2ca3b887e8&chksm=ec2026c4db57afd2ca32f5bd9552d85e0fabb0ef5bf4ed444b1451533b870aab2b2bce397096&scene=21#wechat_redirect">翻墙教程二（搭建ssr）</a>';
var tutorial = '<p>'+tutorial1+'<br>'+tutorial2+'</p>';

$(document).ready(function(){
    hidePhotoDiv();
    $(window).scroll(function(event){
        var newLiAmount = $( "#posts li.post_container" ).length;
        if (newLiAmount > liAmount) {
            liAmount = newLiAmount;
            hidePhotoDiv();
        }
    });
});

function hidePhotoDiv() {
    $( "#posts li.post_container div.post_full" ).each(function( index, element ) {
      if (index > 0){
            var dataType = $(this).attr('data-type');
            var isRecommend = $(this).attr('data-is_recommended');
            if (dataType !== 'video' || isRecommend === '1') {
                // remove有时会失效，使用hide
                $(this).parent().hide();
            }
        }
    });
    showVpnTutorial();
}
function showVpnTutorial() {
    var firstBlog = $( "#posts li.post_container div.is_video:eq(0) div.post_content_inner");
    var comment = firstBlog.find("div.reblog-content");
    if(comment.length === 0) {
        firstBlog.append('<div class="reblog-list-item contributed-content"><div class="reblog-content">'+tutorial+'</div></div>');
    } else {
        $(comment[0]).html(tutorial);
    }

}