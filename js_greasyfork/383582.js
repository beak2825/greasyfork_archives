// ==UserScript==
// @name			什么值得黑
// @namespace		http://tampermonkey.net/
// @version			0.2
// @description		什么值得买网站助手 一键 收藏 点赞 评论 页面优化增强 兴趣使然的给张大妈擦屁股 :)
// @author			cuteribs
// @match			https://www.smzdm.com/
// @match			https://post.smzdm.com/*
// @match			https://test.smzdm.com/*
// @match			https://zhiyou.smzdm.com/*
// @grant			GM.xmlHttpRequest
// @icon 			https://www.smzdm.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/383582/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/383582/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E9%BB%91.meta.js
// ==/UserScript==

(function() {
	const addGlobalStyle = css => {
		$('<style type="text/css"></style>')
			.html(css)
			.appendTo($('head'));
	};

	const globalCss = `
* {
	font-family: 'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Open Sans',sans-serif
}
#global-search {
	height: auto;
}
#global-search .search-inner {
	padding: 0;
}
`;

	const www_smzdm_com_css = ``;

	// #region post_smzdm_com_css
	const post_smzdm_com_css = `
#sub-head {
	display: none;
}

.feed-hot-hits .feed-top-hot, .feed-hot-index .feed-top-hot {
	float: inherit;
}
.feed-top-hot {
	width: auto;
}
.feed-top-hot .feed-hot-wrap {
	height: auto;
	margin: 0 11px;
}
.feed-hot-hits .feed-hot-item, .feed-hot-index .feed-hot-item {
	height: auto;
}
.feed-top-hot .feed-hot-list {
    width: auto;
	height: auto;
}
.feed-hot-hits .feed-hot-list .slick-list, .feed-hot-index .feed-hot-list .slick-list {
    width: auto;
}
.feed-top-hot .feed-hot-list .feed-hot-card {
	width: 287px;
	margin-right: 10px;
}
.feed-hot-list .feed-hot-card .feed-hot-pic {
	width: auto;
	height: auto;
}
.feed-hot-list .feed-hot-card .feed-hot-pic img {
	max-width: 100%;
	max-height: 100%;
}
.feed-hot-wrap .z-slick-btn-next {
	right: 0;
}
.feed-hot-wrap .slick-arrow {
	top: 75px;
}
.feed-right-top {
	display: none;
}

.filter-feed-wrap {
	width: auto;
}
.filter-tab-wrap {
    width: auto;
}
.primary-filter-tab-wrapper {
	width: auto;
}
.primary-filter-tab {
	width: auto;
}
.feed-grid-wrap #feed-main-list {
	width: auto;
}
.feed-grid-wrap #feed-main-list .feed-row-wide {
	margin-right: 0;
	margin-left: 12px;
}
.feed-grid-wrap #feed-main-list .feed-row-wide:nth-child(4n+1) {
	margin-left: 0;
}
.feed-grid-wrap #feed-main-list .feed-row-wide .feed-block {
	width: 287px;
	border: solid 2px transparent;
	margin-left: 0;
	margin-right: 0;
}
.feed-grid-wrap #feed-main-list .z-feed-img {
	height: 164px;
}
.feed-grid-wrap #feed-main-list .z-feed-foot-l {
	top: 121px;
	width: 263px;
}
.feed-grid-wrap #feed-main-list .z-group-data {
	padding: 6px 0 6px 15px;
	margin: 0;
	width: 56px;
}
.feed-grid-wrap #feed-main-list .z-feed-foot-r {
	height: auto!important;
}
.blue-v {
	border-color: #eca250;
}
.yello-v {
	border-color: #de5a31;
}
.red-v {
	border-color: #2dadd4;
}
#feed-side {
	display: none;
}
	`;
	// #endregion

	// 调整社区首页
	const adjustPostList = () => {
		addGlobalStyle(post_smzdm_com_css);
		const hotPics = $(
			'.feed-hot-card.slick-slide .feed-hot-pic img'
		).toArray();

		for (let img of hotPics) {
			img.src = img.src.replace('_a200.jpg', '_c350.jpg');
		}

		const adjustListItem = item => {
			const $item = $(item);

			// 过滤媒体号...
			const vIcon = $item.find('img.feed-talent-ordinary').attr('src');

			if (vIcon) {
				if (vIcon.endsWith('chef_life_medal.gif')) {
					$item.addClass('yellow-v');
				} else if (vIcon.endsWith('media_medal.png')) {
					$item.addClass('red-v');
				} else if (vIcon.endsWith('ordinary_life_medal.png')) {
					$item.addClass('blue-v');
				}
			}

			// 添加热度
			const $icons = $item.find('.z-feed-foot-r');
			const amount = $icons
				.find('a.z-group-data')
				.toArray()
				.reduce(
					(n, a) => n + parseInt(a.lastElementChild.textContent),
					0
				);
			const $hot = $(
				`<a href="javascript:;" class="z-group-data" title="热度" style="color: #f00;"><i class="icon-fire-o"></i><span>${amount}</span></a>`
			);
			$icons.prepend($hot);
		};

		for (let t of $(
			'.feed-grid-wrap #feed-main-list .feed-row-wide'
		).toArray()) {
			adjustListItem(t);
		}

		new MutationObserver(records => {
			for (let r of records) {
				if (r.addedNodes.length > 0) {
					for (let n of r.addedNodes) {
						adjustListItem(n);
					}
				}
			}
		}).observe($('#feed-main-list')[0], { childList: true });
	};

	const adjustPostArticle = () => {
		addGlobalStyle(`
article {
	position: relative;
}
article > p > a > img {
	margin: 0;
	background-color: #fff;
	box-shadow: 0px 0px 5px 1px rgba(0,0,0,.5);
	transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}
article > p > a > img:hover {
	box-shadow: 0px 0px 10px 5px rgba(0,0,0,.3);
}
.comment_operate .comment_share {
	width: auto;
}
		`);
		// #region 提交一波流
		const $myButton = $(
			'<button type="button" class="btn_sub" style="margin-right: 10px;">提交一波流</button>'
		);
		$('#textCommentSubmit').after($myButton);

		$myButton.on('click', () => {
			// 收藏
			$('.experience-zan a[data-type="fav"]').click();

			// 点赞
			$('.experience-zan a[data-type="zan"]').click();

			// 关注作者
			if (
				$('.author-card-left .m-introduction h2 i')
					.text()
					.trim() === '可爱的排骨'
			) {
				const $focus = $('.author-card-left a[data-type="user"]');

				if ($focus.text().trim() == '+关注') {
					$focus.click();
				}
			}

			// 评论
			const userName = $('.nav-username.J_nav_username')
				.text()
				.trim();
			const $commentText = $('#textareaComment');

			if (
				$commentText.val().trim() === '' ||
				$commentText.val().trim() === $commentText.attr('default_data')
			) {
				$commentText.val(
					`${userName} 观察团路过到此一游, 紫苏布丁[观察]`
				);
			}

			$('#textCommentSubmit').click();
		});
		// #endregion

		// #region 鉴赏团一键占赞
		const oneKeyLike = url =>
			new Promise(resolve => {
				try {
					GM.xmlHttpRequest({
						method: 'GET',
						url: url,
						onload: res => {
							const $html = $(
								res.responseText.replace(/<img[^>]*>/g, '')
							);

							const articleId = $html.find('#articleID').val();

							if (articleId) {
								$.ajax({
									type: 'GET',
									url:
										'https://zhiyou.smzdm.com/user/rating/jsonp_add',
									data: {
										article_id: articleId,
										channel_id: $html
											.find('#channelID')
											.val(),
										rating: 1,
										client_type: 'PC',
										event_key: '点值',
										otype: '点赞',
										aid: articleId,
										p: '无',
										cid: '无',
										source: '无',
										atp: '无',
										tagID: '无',
										sourcePage: document.referrer || '无',
										sourceMode: '无'
									},
									dataType: 'jsonp',
									jsonp: 'callback'
								}).done(result =>
									resolve(result['error_code'] === 1)
								);
							} else {
								resolve(false);
							}
						}
					});
				} catch {
					resolve(false);
				}
			});

		const $title = $('#articleId h1.item-name');

		if ($title.text().includes('鉴赏团精选辑')) {
			const $oneButton = $(
				'<button type="button" class="corner-btn" style="cursor: pointer; padding: 6px 12px;font-size: 16px;">一键鉴赏占赞</button>'
			);
			$title.append($oneButton);
			$oneButton.on('click', () => {
				const links = $(
					'#articleId > p > a[href*="test.smzdm.com/pingce/"], #articleId > p > a[href*="post.smzdm.com/p/"]'
				)
					.toArray()
					.map(a => a.href);

				Promise.all(links.map(url => oneKeyLike(url))).then(results => {
					const succeeds = results.filter(r => r).length;
					alert(
						`点赞成功 ${succeeds} 个, 失败 ${results.length -
							succeeds} 个`
					);
				});
			});
		}
		// #endregion
	};

	const init = () => {
		addGlobalStyle(globalCss);

		if (
			$('meta[content="webpage"]').length > 0 &&
			location.href.includes('post.smzdm.com')
		) {
			// webpage
			adjustPostList();
		} else if ($('meta[content="article"]').length > 0) {
			adjustPostArticle();
		}
	};

	init();
})();
