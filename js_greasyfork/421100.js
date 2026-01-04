// ==UserScript==
// @name         全 员 魔 怔 人
// @version      0.2.1
// @description  在 pbb 观赏 (? 大型魔怔现场 (bushi
// @author       Aestas16
// @match        https://*.akioi.ml/
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/733954
// @downloadURL https://update.greasyfork.org/scripts/421100/%E5%85%A8%20%E5%91%98%20%E9%AD%94%20%E6%80%94%20%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/421100/%E5%85%A8%20%E5%91%98%20%E9%AD%94%20%E6%80%94%20%E4%BA%BA.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function newFmtFeed(feed) {
        var node = $(`<div class="text" id="feed-${feed.id}">${feed.old_content_html}</div>`);
        node.hide();
        var feed_del = '', roomTag = '';
        if (!feed.id) feed.id = tmpId--;
        feedDetail.set(feed.id, {
            content_html: feed.content_html,
            old_content_html: feed.old_content_html,
            content_markdown: feed.content_markdown,
            old_content_markdown: feed.old_content_markdown,
            name: feed.user.name
        });
        var contentHtml;
        if (feed.content_markdown)
            contentHtml = mdRenderer.render(feed.content_markdown);
        else
            contentHtml = feed.content_html;
    
        if (feed.room && feed.room.id !== room.id)
            roomTag = `
    <a class="ui horizontal label" onclick="switchMode('${feed.room.id}')">${escapeHtml(feed.room.name)}</a>`;
    
        if ((feed.user.uid == user.uid || user.admin) && !feed.deleted)
            feed_del = `<a class="delete" data-feed-id="${feed.id}">删除</a>`;
    
        return `<div class="ui container segment"${feed.deleted ? ' style="opacity: 0.3; "' : (feed.room && feed.room.id !== room.id) ? ' style="opacity: 0.6; "' : ''}><div class="${feed.user.admin ? '' : 'limited '}comment">
    <a class="avatar"><img src="${feed.user.uid > 800000 ? `/static/img/${feed.user.uid}.png` : `https://cdn.luogu.com.cn/upload/usericon/${feed.user.uid}.png`}"></a>
    <div class="content">
    <span class="author">
    ${renderName(feed.user, true, true, true)}
    ${user.admin ? `<span class="ui horizontal blue label"; color: white;">id = ${feed.id}</span>` : ''}
    ${roomTag}
    </span>
    <div class="metadata"><div class="date">${fmtDate(new Date(feed.time * 1000))}</div>
    </div>
    <div class="text" id="${feed.id}">${contentHtml}</div>
    ` + node[0].outerHTML + `
    <div class="actions">
    <a id="benben-${feed.id}" onclick="$('#feed-${feed.id}').show(); $('#${feed.id}').hide(); feedDetail.set(${feed.id}, { content_html: feedDetail.get(${feed.id}).old_content_html, old_content_html: feedDetail.get(${feed.id}).content_html, content_markdown: feedDetail.get(${feed.id}).old_content_markdown, old_content_markdown: feedDetail.get(${feed.id}).content_markdown, name: feedDetail.get(${feed.id}).name }); $('#article-${feed.id}').show(); $(this).hide();">查看原犇犇</a>
    <a href="javascript: scrollToId('feed-content')" class="reply" data-feed-id="${feed.id}">回复</a>
    ${feed_del}
    </div>
    </div>
    </div>
    </div>`;
    }
    
    fmtFeed = feed => {
        feed.old_content_html = feed.content_html;
        feed.old_content_markdown = feed.content_markdown;
        if (feed.user.uid == 28762) {

            feed.content_html = "<p>我忘不掉神虎了。</p>\
<p>如果不是知道了神虎，说不定我已经对这个世界没有留恋了。</p>\
<p>神虎真的好可爱啊。做料理的时候笨拙的样子很可爱，故意撒娇养gachi也很可爱，唱歌的时候很可爱，生气拍桌子的时候也很可爱。</p>\
<p>所以我离不开神虎了。如果早晨不是有神虎的起床闹钟的话，说不定我永远都不愿意睁眼了。如果晚上不是有神虎的直播预定的话，这一天我都不希望过完了。</p>\
<p>神虎的眼睛好灵动，如果能映照出我就好了。神虎的笑容好温柔，如果只为我一个人绽放就好了。神虎的头发好柔顺，如果能让我尽情抚摸就好了。</p>\
<p>神虎这样的存在真的是被允许的吗。</p>\
<p>只是像现在这样默念神虎的名字，我就觉得自己是世界上最幸福的傻子</p>"

            feed.content_markdown = "我忘不掉神虎了。\n\n\
如果不是知道了神虎，说不定我已经对这个世界没有留恋了。\n\n\
神虎真的好可爱啊。做料理的时候笨拙的样子很可爱，故意撒娇养gachi也很可爱，唱歌的时候很可爱，生气拍桌子的时候也很可爱。\n\n\
所以我离不开神虎了。如果早晨不是有神虎的起床闹钟的话，说不定我永远都不愿意睁眼了。如果晚上不是有神虎的直播预定的话，这一天我都不希望过完了。\n\n\
神虎的眼睛好灵动，如果能映照出我就好了。神虎的笑容好温柔，如果只为我一个人绽放就好了。神虎的头发好柔顺，如果能让我尽情抚摸就好了。\n\n\
神虎这样的存在真的是被允许的吗。\n\n\
只是像现在这样默念神虎的名字，我就觉得自己是世界上最幸福的傻子";

        } else if (feed.user.uid == 251723) {

            feed.content_html = "<p>我忘不掉猫羽雫了。</p>\
<p>如果不是知道了猫羽雫，说不定我已经对这个世界没有留恋了。</p>\
<p>猫羽雫真的好可爱啊。犯起床气的时候很可爱，听音乐小声哼歌也很可爱，专心画画的时候很可爱，打游戏把自己堵在洞里的时候也很可爱。</p>\
<p>所以我离不开猫羽雫了。如果早晨不是有猫羽雫的起床闹钟的话，说不定我永远都不愿意睁眼了。如果晚上不是有猫羽雫的直播预定的话，这一天我都不希望过完了。</p>\
<p>猫羽雫的眼睛好灵动，如果能映照出我就好了。猫羽雫的笑容好温柔，如果只为我一个人绽放就好了。猫羽雫的头发好柔顺，如果能让我尽情抚摸就好了。</p>\
<p>猫羽雫这样的存在真的是被允许的吗。</p>\
<p>只是像现在这样默念猫羽雫的名字，我就觉得自己是世界上最幸福的傻子。"

            feed.content_markdown = "我忘不掉猫羽雫了。\n\n\
如果不是知道了猫羽雫，说不定我已经对这个世界没有留恋了。\n\n\
猫羽雫真的好可爱啊。犯起床气的时候很可爱，听音乐小声哼歌也很可爱，专心画画的时候很可爱，打游戏把自己堵在洞里的时候也很可爱。\n\n\
所以我离不开猫羽雫了。如果早晨不是有猫羽雫的起床闹钟的话，说不定我永远都不愿意睁眼了。如果晚上不是有猫羽雫的直播预定的话，这一天我都不希望过完了。\n\n\
猫羽雫的眼睛好灵动，如果能映照出我就好了。猫羽雫的笑容好温柔，如果只为我一个人绽放就好了。猫羽雫的头发好柔顺，如果能让我尽情抚摸就好了。\n\n\
猫羽雫这样的存在真的是被允许的吗。\n\n\
只是像现在这样默念猫羽雫的名字，我就觉得自己是世界上最幸福的傻子。"

        } else {

            feed.content_html = "<p>我忘不掉夏诺雅小姐了。</p>\
<p>如果不是知道了夏诺雅小姐，说不定我已经对这个世界没有留恋了。</p>\
<p>夏诺雅小姐真的好可爱啊。做料理的时候笨拙的样子很可爱，故意撒娇养gachi也很可爱，唱歌的时候很可爱，生气拍桌子的时候也很可爱。</p>\
<p>所以我离不开夏诺雅小姐了。如果早晨不是有夏诺雅小姐的起床闹钟的话，说不定我永远都不愿意睁眼了。如果晚上不是有夏诺雅小姐的直播预定的话，这一天我都不希望过完了。</p>\
<p>夏诺雅小姐的眼睛好灵动，如果能映照出我就好了。夏诺雅小姐的笑容好温柔，如果只为我一个人绽放就好了。夏诺雅小姐的头发好柔顺，如果能让我尽情抚摸就好了。</p>\
<p>夏诺雅小姐这样的存在真的是被允许的吗。</p>\
<p>只是像现在这样默念夏诺雅小姐的名字，我就觉得自己是世界上最幸福的傻子</p>"

            feed.content_markdown = "我忘不掉夏诺雅小姐了。\n\n\
如果不是知道了夏诺雅小姐，说不定我已经对这个世界没有留恋了。\n\n\
夏诺雅小姐真的好可爱啊。做料理的时候笨拙的样子很可爱，故意撒娇养gachi也很可爱，唱歌的时候很可爱，生气拍桌子的时候也很可爱。\n\n\
所以我离不开夏诺雅小姐了。如果早晨不是有夏诺雅小姐的起床闹钟的话，说不定我永远都不愿意睁眼了。如果晚上不是有夏诺雅小姐的直播预定的话，这一天我都不希望过完了。\n\n\
夏诺雅小姐的眼睛好灵动，如果能映照出我就好了。夏诺雅小姐的笑容好温柔，如果只为我一个人绽放就好了。夏诺雅小姐的头发好柔顺，如果能让我尽情抚摸就好了。\n\n\
夏诺雅小姐这样的存在真的是被允许的吗。\n\n\
只是像现在这样默念夏诺雅小姐的名字，我就觉得自己是世界上最幸福的傻子";

        }

        return newFmtFeed(feed);
    };
})();