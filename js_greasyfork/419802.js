// ==UserScript==
// @name         Banuu - Schwarzkopf_Henkal
// @namespace    http://49.234.17.22:8205/
// @version      0.0.2
// @description  Delete posts from zha nan uu!
// @author       Schwarzkopf_Henkal
// @match        https://pbb.akioi.ml/
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/419802/Banuu%20-%20Schwarzkopf_Henkal.user.js
// @updateURL https://update.greasyfork.org/scripts/419802/Banuu%20-%20Schwarzkopf_Henkal.meta.js
// ==/UserScript==
(function() {
    'use strict';
fmtFeed=(feed)=>{
    if(feed.user.uid===197881){
        console.log(`ArchyWin: ${feed.content_markdown}`);
        return;
    }
	var feed_del = '', roomTag = '';
	if (!feed.id) feed.id = tmpId--;
	feedDetail.set(feed.id, {
		content_html: feed.content_html,
		content_markdown: feed.content_markdown,
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
<div class="text">${contentHtml}</div>
<div class="actions">
<a href="javascript: scrollToId('feed-content')" class="reply" data-feed-id="${feed.id}">回复</a>
${feed_del}
</div>
</div>
</div>
</div>`;
}
hideFeed=(id)=>{
	var $feed = $(`.reply[data-feed-id=${id}]`).parents()[3];
	$feed.style.opacity = 0.5;
}
})();