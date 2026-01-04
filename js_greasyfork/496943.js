// ==UserScript==
// @name         bangumi评论区评论倒序
// @version      0.2
// @description  在bangumi包含#comment_list的地方增加倒序功能
// @author       kedvfu
// @include     http*://bgm.tv/*
// @include     http*://chii.in/*
// @include     http*://bangumi.tv/*
// @license     MIT
// @namespace https://greasyfork.org/users/1302565
// @downloadURL https://update.greasyfork.org/scripts/496943/bangumi%E8%AF%84%E8%AE%BA%E5%8C%BA%E8%AF%84%E8%AE%BA%E5%80%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/496943/bangumi%E8%AF%84%E8%AE%BA%E5%8C%BA%E8%AF%84%E8%AE%BA%E5%80%92%E5%BA%8F.meta.js
// ==/UserScript==


let isReverse = false;
let isDefaultReversal = (getCookie('defaultReversal') === 'true');
function reverseComments() {

    const commentList = document.getElementById('comment_list');
    const reverseCommentButton = document.getElementById('reverseCommentButton');

    let list = Array.from(commentList.children);

    list.reverse();
    while (commentList.firstChild) {
        commentList.removeChild(commentList.firstChild);
    }

    list.forEach(function (child) {
        const replyList = child.querySelector(".topic_sub_reply");
        if (replyList) {
            let replys = Array.from(replyList.children);
            replys.reverse();
            while (replyList.firstChild) {
                replyList.removeChild(replyList.firstChild);
            }
            replys.forEach(function (replyChild) {
                replyList.appendChild(replyChild);
            });
        }
        commentList.appendChild(child);
    });
    if (!isReverse) {
        reverseCommentButton.innerHTML = '评论倒序：开';
    } else {
        reverseCommentButton.innerHTML = '评论倒序：关';
    }
    isReverse = !isReverse;

}
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function changeDefaultReversal() {
    const defaultReversal = document.getElementById('defaultReversal');
    defaultReversal.checked = isDefaultReversal;
    if(isDefaultReversal){
        reverseComments();
    }
    defaultReversal.addEventListener('change', function() {
        isDefaultReversal = this.checked;
        setCookie('defaultReversal', (this.checked ? 'true' : 'false'), 10000);
    });
}
function getLatestComment() {
    const latestCommentButton = document.getElementById('latestCommentButton');
    const commentList = document.getElementById('comment_list');
    let list = Array.from(commentList.children);
    let latestId = '0';
    list.forEach(function (child) {
        const replyList = child.querySelector(".topic_sub_reply");
        if (replyList) {
            let replys = Array.from(replyList.children);
            replys.forEach(function (replyChild) {
                let replyId = parseInt(replyChild.id.substring(5));

                if (replyId > latestId) {
                    latestId = replyId;
                }
            });
        }
        let commentId = parseInt(child.id.substring(5));
        if (commentId > latestId) {
            latestId = commentId;
        }
    });
    latestCommentButton.href=location.pathname+`#post_${latestId}`;
    const latestComment = document.getElementById(`post_${latestId}`);
    latestComment.classList.add('reply_highlight')
}

$('#comment_list').before(`<div class="section_line clear"></div><a href='javascript:void(0);' id='reverseCommentButton' class="chiiBtn">评论倒序：关</a><a href='javascript:void(0);' target="_self" id='latestCommentButton' class="chiiBtn">最新回复</a><input type="checkbox" id="defaultReversal"/><span class="tip"> 默认倒序</span>`);
changeDefaultReversal();
$('#reverseCommentButton').on('click', reverseComments);
$('#latestCommentButton').on('click', getLatestComment);
