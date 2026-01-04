// ==UserScript==
// @name                Weibo Delete Comment
// @namespace           http://will66.me
// @version             0.1
// @description         清空您发过的所有微博评论
// @author              willhunger
// @match               http://weibo.com/comment/outbox*
// @require             http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.7.2.js
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/31905/Weibo%20Delete%20Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/31905/Weibo%20Delete%20Comment.meta.js
// ==/UserScript==

window.setInterval(function(){
    $('a[action-type="delComment"]')[0].click();
    $('a[action-type="ok"]')[0].click();
},5000);
//默认间隔5秒，可自助更改删除间隔