// ==UserScript==
// @name         水源审核公告直达
// @namespace    http://banson.moe/
// @version      2.4.2
// @description  简化公告流程 & 快速投票
// @author       kull, Banson
// @match        https://shuiyuan.sjtu.edu.cn/*
// @match        https://shuiyuanbeta.sjtu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530795/%E6%B0%B4%E6%BA%90%E5%AE%A1%E6%A0%B8%E5%85%AC%E5%91%8A%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/530795/%E6%B0%B4%E6%BA%90%E5%AE%A1%E6%A0%B8%E5%85%AC%E5%91%8A%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

(() => {
'use strict';

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function add_all_custom_review() {
	const poll_topic = {'shuiyuanbeta.sjtu.edu.cn': 13565, 'shuiyuan.sjtu.edu.cn': 386244};
	const custom_css = `div.custom-review .hide-list {
	display: none;
}
div.custom-review {
	gap: inherit;
}
div.custom-review .link-list {
	gap: inherit;
	display: flex;
	justify-content: space-between;
	flex: 1;
}`;

	const style = document.createElement('style');
	style.textContent = custom_css;
	document.head.appendChild(style);

	const MODE_OLD = 0, MODE_NEW = 1;
	// as for v3.6.0.beta3-2125b07e9286725cb6301146bb31bdc3e24a8225
	const cssSelector = {
		'reviewable': {
			[MODE_OLD]: '.reviewable-item.reviewable-flagged-post',
			[MODE_NEW]: '.review-item.reviewable-flagged-post'
		},
		'actions': {
			[MODE_OLD]: '.reviewable-actions',
			[MODE_NEW]: '.review-item__moderator-actions'
		}
	};

	async function create_custom_review(node, mode) {
		const url = node.querySelector('.title-text').href;
		const prefix_url = /^https:\/\/shuiyuan(beta)?\.sjtu\.edu\.cn\/t\/topic\//;
		if (!prefix_url.test(url)) {
			return;
		}
		const striped_url = url.replace(prefix_url, '');
		const authorId = node.querySelector('.created-by a').dataset['userCard'];
		const actions = node.querySelector(cssSelector.actions[mode]);
		if (actions === null) {
			console.log(`cannot query actions using ${mode} mode`);
			console.log(node);
			return;
		}
		if (actions.querySelectorAll('.custom-review').length > 0) {
			return;
		}
		{
			const extra_action_copy_info = document.createElement('div');
			extra_action_copy_info.classList.add('custom-review');
			extra_action_copy_info.style.display = 'inherit';
			extra_action_copy_info.innerHTML =
				`<div style="flex: 1"><button class="btn enable-btn">复制处罚信息</button></div>
<div class="goto-list hide-list"></div>`;
			const enable_btn = extra_action_copy_info.querySelector('button.enable-btn');
			enable_btn.dataset['authorId'] = authorId;
			enable_btn.dataset['postId'] = striped_url;

			enable_btn.addEventListener('click', (e) => {
				const btn = e.target;
				let post_id = btn.dataset['postId'];
				const author_id = btn.dataset['authorId'];
				let is_topic = false;
				const slash_pos = post_id.indexOf('/');
				if (slash_pos === -1) {
					is_topic = true;
				} else if (post_id.slice(slash_pos + 1) === '1') {
					post_id = post_id.slice(0, slash_pos);
					is_topic = true;
				}
				navigator.clipboard.writeText(`${is_topic ? '话题' : '帖子'}编号：${post_id}

账号：@${author_id}
`);
			});
			actions.appendChild(extra_action_copy_info);
		}
		{
			const extra_action_open_poll = document.createElement('div');
			extra_action_open_poll.classList.add('custom-review');
			extra_action_open_poll.style.display = 'inherit';
			extra_action_open_poll.innerHTML =
				`<div style="flex: 1"><button class="btn enable-btn">复制举报投票信息</button></div>
<div class="goto-list hide-list"></div>`;
			const enable_btn = extra_action_open_poll.querySelector('button.enable-btn');
			enable_btn.dataset['reviewId'] = node.dataset['reviewableId'];
			enable_btn.dataset['url'] = url;

			const list = extra_action_open_poll.querySelector('div.goto-list');
			const topic_id = poll_topic[location.host];
			const item = document.createElement('a');
			item.href = `/t/topic/${topic_id}/last`;
			item.classList.add('btn');
			item.innerText = '跳转投票';
			list.appendChild(item);

			enable_btn.addEventListener('click', (e) => {
				const btn = e.target;
				let url = btn.dataset['url'];
				const review_id = btn.dataset['reviewId'];
				navigator.clipboard.writeText(`${location.protocol}//${location.host}/review/${review_id}

${url}

[poll type="regular" results="always" public="true" chartType="bar"]
# 如何处理
* 删除
* 隐藏
* 拒绝/忽略
[/poll]

结论：
[] 删除
[] 隐藏
[] 拒绝/忽略
`);
				list.classList.replace('hide-list', 'link-list');
			});
			actions.appendChild(extra_action_open_poll);
		}
		{
			const act = document.createElement('div');
			act.classList.add('custom-review');
			act.style.display = 'inherit';
			act.innerHTML =
				`<div style="flex: 1"><button class="btn enable-btn">查看作者的...</button></div>
<div class="goto-list hide-list"></div>`;
			const enable_btn = act.querySelector('button.enable-btn');
			const list = act.querySelector('div.goto-list');
				const deleted_posts_a = document.createElement('a');
				deleted_posts_a.href = `/u/${authorId}/deleted-posts`;
				deleted_posts_a.classList.add('btn');
				deleted_posts_a.innerText = '删除记录';
				list.appendChild(deleted_posts_a);
				const review_a = document.createElement('a');
				review_a.href = `/review?status=all&type=ReviewableFlaggedPost&username=${encodeURIComponent(authorId)}`;
				review_a.classList.add('btn');
				review_a.innerText = '举报情况';
				list.appendChild(review_a);
			enable_btn.addEventListener('click', (e) => {
				list.classList.replace('hide-list', 'link-list');
			});
			actions.appendChild(act);
		}
	}

	async function create_custom_review_delay(node, mode) {
		delay(1000).then(() => {
			create_custom_review(node, mode);
		});
	}

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE &&
							node.classList.contains('reviewable-flagged-post')) {
						if (node.classList.contains('reviewable-item')) {
							create_custom_review_delay(node, MODE_OLD);
						} else if (node.classList.contains('review-item')) {
							create_custom_review_delay(node, MODE_NEW);
						}
					}
				});
			}
		});
	});

	observer.observe(document.querySelector('#main-outlet'), {
		childList: true, subtree: true,
		characterData: false, attributes: false });

	for (const [mode, selector] of Object.entries(cssSelector.reviewable)) {
		const reviewable_items = document.querySelectorAll(selector);
		reviewable_items.forEach((node) => {
			create_custom_review_delay(node, mode);
		});
	}
};

delay(1000).then(add_all_custom_review);
})();