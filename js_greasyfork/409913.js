// ==UserScript==
// @name         Show not checked content
// @namespace    https://greasyfork.org/users/2205
// @version      0.7
// @description  Shows content hidden by Valve's automated content check system
// @author       Rudokhvist
// @license      Apache-2.0
// @match        https://steamcommunity.com/groups/*/discussions/*
// @match        https://steamcommunity.com/discussions/forum/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409913/Show%20not%20checked%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/409913/Show%20not%20checked%20content.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* global g_rgForumTopicCommentThreads */
    /* global g_rgForumTopics*/
    function GetText( gidTopic, gidComment )
    {
        var CommentThread = g_rgForumTopicCommentThreads[gidTopic];
        var rgRawComment;
        if ( gidComment && gidComment != -1 )
        {
            rgRawComment = CommentThread.GetRawComment( gidComment );
        }
        else
        {
            // topic quoting
            rgRawComment = g_rgForumTopics[gidTopic].m_rgRawData;
        }
        return rgRawComment.text;
    }

    function FormatBBCode(text){
        let re = /\[noparse\]([\s\S]*?)\[\/noparse\]/g;
        let noparse = text.match(re);
        re = /([^\]])\n([^\[])/g;
        text = text.replace(re, '$1<br>$2');
        re = /\[h1\]([\s\S]*?)\[\/h1\]/g;
        text = text.replace(re, '<div class="bb_h1">$1</div>');
        re = /\[b\]([\s\S]*?)\[\/b\]/g;
        text = text.replace(re, '<b>$1</b>');
        re = /\[u\]([\s\S]*?)\[\/u\]/g;
        text = text.replace(re, '<u>$1</u>');
        re = /\[i\]([\s\S]*?)\[\/i\]/g;
        text = text.replace(re, '<i>$1</i>');
        re = /\[strike\]([\s\S]*?)\[\/strike\]/g;
        text = text.replace(re, '<span class="bb_strike">$1</span>');
        re = /\[spoiler\]([\s\S]*)\[\/spoiler\]/g;
        text = text.replace(re, '<span class="bb_spoiler"><span>$1</span></span>');
        re = /\[url=(.*?)\]([\s\S]*?)\[\/url\]/g;
        text = text.replace(re, '<a class="bb_link" href="$1" target="_blank" rel="noreferrer">$2</a>');
        re = /([^>"]|^)https?:\/\/store\.steampowered\.com\/app\/(\d*)[^\s]*/g;
        text = text.replace(re, '$1<br/><iframe src="https://store.steampowered.com/widget/$2/?dynamiclink=1" width="100%" height="190" frameborder="0"></iframe>');
        re = /([^>"]|^)(http|https|ftp)(:\/\/[^\s]*)/g;
        text = text.replace(re, '$1<a class="bb_link" href="$2$3" target="_blank" rel="noreferrer">$2$3</a>');
        re = /\[quote=([^;]*?)\]([\s\S]*?)\[\/quote\]/g;
        text = text.replace(re, '<blockquote class="bb_blockquote with_author"><div class="bb_quoteauthor">Originally posted by <b>$1</b>:</div>$2</blockquote>');
        re = /\[quote=([^;]*?);(\d*)\]([\s\S]*?)\[\/quote\]/g;
        text = text.replace(re, '<blockquote class="bb_blockquote with_author"><div class="bb_quoteauthor">Originally posted by <b><a href="#c$2">$1</a></b>:</div>$3</blockquote>');
        re = /\[quote\]([\s\S]*?)\[\/quote\]/g;
        text = text.replace(re, '<blockquote class="bb_blockquote">$1</blockquote>');
        re = /\[code\]([\s\S]*?)\[\/code\]/g;
        text = text.replace(re, '<div class="bb_code">$1</div>');
        re = /\[list\]([\s\S]*?)\[\/list\]/gm;
        text = text.replace(re, '<ul class="bb_ul">$1</ul>');
        re = /\[olist\]([\s\S]*?)\[\/olist\]/gm;
        text = text.replace(re, '<ol>$1</ol>');
        re = /\[\*\]([\s\S]*?)$/gm;
        text = text.replace(re, '<li>$1</li>');
        let index = 0;
        re = /\[noparse\]([\s\S]*?)\[\/noparse\]/g;
        text = text.replace(re,() => noparse[index++]);
        return text;
    }

    function FixComments (comments){
        for (let i=comments.length-1; i>=0; i--) {
            let parent = comments[i].parentNode;
            let gidComment = parent.id.split('_')[2];
            parent.innerHTML = FormatBBCode(GetText( gidTopic, gidComment));
            //add a notice
            let noticeDiv = document.createElement("span");
            noticeDiv.className = "forum_comment_author_banned";
            noticeDiv.appendChild(document.createTextNode("(post awaiting analysis)"));
            parent.parentElement.querySelector("div.forum_author_menu").after(noticeDiv);
        }
    }

    let re = /.*discussions\/\d+\/(\d+)/g;
    let res = re.exec(document.URL);
    if (res===null){
        re = /.*forum\/\d+\/(\d+)/g;
        res = re.exec(document.URL);
    }
    let gidTopic = res[1];
    let comments = document.getElementsByClassName('needs_content_check');
    FixComments(comments);

    let mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach( function(currentValue, currentIndex, listObj) {
                if (currentValue.nodeType == Node.ELEMENT_NODE) {
                    let comments = currentValue.querySelectorAll("div[class^='needs_content_check']");
                    FixComments(comments);
                }
            });
        });
    });
    mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();