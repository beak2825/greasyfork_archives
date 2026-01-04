// ==UserScript==
// @name         zhihu-simplification
// @namespace
// @version      1.0.7
// @description  a simplification version of zhihu homepage
// @author       Rika
// @match        *://*.zhihu.com/
// @grant        none
// @namespace https://greasyfork.org/users/165948
// @downloadURL https://update.greasyfork.org/scripts/37157/zhihu-simplification.user.js
// @updateURL https://update.greasyfork.org/scripts/37157/zhihu-simplification.meta.js
// ==/UserScript==

const block_keyword = [
	"你可能感兴趣",
	"热门内容",
	"广告",
];

const block_check_regex = new RegExp(block_keyword.
	map(k => '(?:'+k+')').
	join('|'));

(function() {
	let insertAfter = (function(el, referenceNode) {
		referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
	});

	let addGlobalStyle = (function(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	});

	let add_li = (function(container, icon, text, url, number) {
		let a = document.createElement("a");
		let span = document.createElement("span");
		let li = document.createElement("li");
		icon.setAttribute("style", "height:16px;width:16px;padding-left:1px;padding-right:1px;");
		span.innerText = text;
		a.className = "Button GlobalSideBar-navLink Button--plain";
		span.className = "GlobalSideBar-navText";
		li.className = "GlobalSideBar-navItem";
		a.appendChild(icon);
		a.appendChild(span);
		a.href = url;
		if(number)
		{
			let n = document.createElement("span");
			n.className = "GlobalSideBar-navNumber";
			n.innerText = number;
			a.appendChild(n);
		}
		li.appendChild(a);
		container.appendChild(li);
	});

	let move_TopstoryHeader_nav_element = (function()
	{
		try {
			let TopstoryHeader = document.querySelector("div.TopstoryHeader");
			if(TopstoryHeader) {
				TopstoryHeader.parentElement.hidden = true;
				const ul = document.querySelector("ul.GlobalSideBar-navList");
				const write = TopstoryHeader.querySelector("a[href$=\"//zhuanlan.zhihu.com/write\"] svg").cloneNode(true);
				add_li(ul, write, "写文章", "//zhuanlan.zhihu.com/write");
				const draft = TopstoryHeader.querySelector("a.TopstoryHeader-rightItem[href$=\"/draft\"]");
				if(draft) {
					const draft_number_match = draft.innerText.match(/\d+/);
					const draft_number =  draft_number_match ? draft_number_match[0] : undefined;
					const paper = TopstoryHeader.querySelector("a[href$=\"/question\"] svg").cloneNode(true);
					add_li(ul, paper, "草稿", "/draft", draft_number);
				}
			}
		} catch(e) {
			console.log(e);
		}
	});

	move_TopstoryHeader_nav_element();

	addGlobalStyle(`
		img.Avatar { border-radius: 12px; }
		a.AppHeader-navItem[href$="/topic"] { display:none; }
		div.Sticky div.Card:first-child, div.Sticky div.Card.Banner, div.Sticky footer{ display:none; }
		button.Button.FollowButton.ContentItem-action.Button--blue ~ .Popover.ContentItem-action { display:none; }
		div.RichContent.is-collapsed .Popover.ContentItem-action { display:none; }
		div.RichContent.is-collapsed .Button.VoteButton.VoteButton--down { display:none; }
		div.RichContent.is-collapsed .Button.VoteButton svg { fill: currentColor; margin-right: 6px; }
		div.RichContent.is-collapsed .Button.VoteButton { border: 0px; background:transparent; color: #8590a6; margin-left: -10px; margin-right: -12px;}
		div.RichContent.is-collapsed .Button.VoteButton:hover { background:transparent; color: #7a8599; }
		div.RichContent.is-collapsed .Button.VoteButton::after { content: " 赞同"; }
		div.RichContent.is-collapsed .Button.LikeButton.ContentItem-action svg { fill: currentColor; margin-right: 6px; }
		div.RichContent.is-collapsed .Button.LikeButton.ContentItem-action { border: 0px; background:transparent; color: #8590a6; margin-left: -10px; margin-right: -12px; }
		div.RichContent.is-collapsed .Button.LikeButton.ContentItem-action:hover { background:transparent; color: #7a8599; }
		div.RichContent.is-collapsed .Button.LikeButton.ContentItem-action::after { content: " 赞同"; }
		div.RichContent.is-collapsed .ContentItem-actions  { padding-bottom: 6px; }
		div.RichContent.is-collapsed .ContentItem-actions  { padding-bottom: 6px; }
		div.Card.TopstoryItem div.AuthorInfo { display:none; }
		div.Card.TopstoryItem div.AuthorInfo.shown { display:flex; }
		div.Card.TopstoryItem div.FeedSource .AuthorInfo-name { font-weight:normal; color:#8590a6; }
		div.Card.TopstoryItem div.FeedSource .UserLink-link { color:#8590a6; }
		li.GlobalSideBar-navItem.GlobalSideBar-serviceItem,
		li.GlobalSideBar-navItem.GlobalSideBar-publicEditItem,
		li.GlobalSideBar-navItem.GlobalSideBar-copyrightItem { display:none; }
	`);

	const mainFrame = document.querySelector(".TopstoryMain");
	const sticky = document.querySelector("div.Sticky");
	const draft = document.querySelector("div.TopstoryHeader a.TopstoryHeader-rightItem");

	document.querySelector("div.SearchBar-input input").placeholder='搜索知乎…';

	let ob_mainFrame = new MutationObserver(function (mutations) {
		try {
			mainFrame.querySelectorAll("div.Card.TopstoryItem").forEach(e => {
				if(e.classList.contains("moded")) {
					return;
				} else if (e.innerText.match(block_check_regex)) {
					e.classList.add("moded");
					e.hidden = true;
				} else {
					e.classList.add("moded");
					let author = e.querySelector("div.AuthorInfo");
					if(author)
					{
						author.setAttribute("style", "margin-top:14px; margin-bottom:-4px;");
						let ContentItem = e.querySelector("div.ContentItem");
						let RichContent = e.querySelector("div.RichContent");
						ContentItem.insertBefore(author,RichContent);

						let feed = e.querySelector("div.FeedSource .FeedSource-firstline");
						if(feed && feed.innerText.match(/赞同了|赞了|收藏了/))
						{
							let author_name = author.querySelector("span.AuthorInfo-name").cloneNode(true);
							let feed_message_node = [...feed.childNodes].find(e => e.nodeType == Node.TEXT_NODE && e.nodeValue.match(/赞同了|赞了|收藏了/));
							let feed_message = feed_message_node.nodeValue;
							let index = feed_message.indexOf("了");
							author_name.setAttribute("style", "margin-top:14px; display:inline-block; margin-left:4px; margin-right:4px; margin-top:0px;");
							let feed_message_1 = document.createTextNode(feed_message.substr(0, index + 1));
							let feed_message_2 = document.createTextNode('的' + feed_message.substr(index + 1));
							insertAfter(feed_message_2, feed_message_node);
							insertAfter(author_name, feed_message_node);
							insertAfter(feed_message_1, feed_message_node);
                            feed.removeChild(feed_message_node);
						} else if(feed) {
							let author_name = author.querySelector("span.AuthorInfo-name").cloneNode(true);
							author_name.setAttribute("style", "margin-top:14px; display:inline-block; margin-left:4px; margin-right:4px; margin-top:0px;");
							feed.appendChild(author_name);
							let feed_message = document.createTextNode('的' + (e.querySelector(".Button.VoteButton.VoteButton--up") ? '回答' : '文章'));
							feed.appendChild(feed_message);
						} else if(feed === null && author.innerText.match(/回答了问题|发表了文章/)) {
							let div = document.createElement("div");
							let feed_meta = author.querySelector("div.AuthorInfo-content").cloneNode(true);
							div.className = "AuthorInfo Feed-meta-author AuthorInfo--plain shown";
							div.appendChild(feed_meta);
							feed_meta.setAttribute("style", "display:flex; margin-left:0;");
							e.querySelector("div.FeedSource").appendChild(div);
							author.querySelector("div.FeedSource-meta").hidden=true;
						}
					}
				}
			});
		} catch(e) {
			console.log(e);
		}
	});

	let ob_ContentItem = new MutationObserver(function (mutations) {
		try {
			mutations.forEach(mutation => {
				let e = mutation.target;
				if(e.tagName == 'DIV' && e.className == "RichContent") {
					if(e.previousSibling.classList.contains("AuthorInfo")){
						let author = e.previousSibling;
						author.classList.add("shown");
					}
				} else if(e.tagName == 'DIV' && e.className == "RichContent is-collapsed") {
					if(e.previousSibling.classList.contains("AuthorInfo")){
						let author = e.previousSibling;
						author.classList.remove("shown");
					}
				}
			});
		} catch(e) {
			console.log(e);
		}
	});

	let ob_sticky = new MutationObserver(function (mutations) {
		try {
			mutations.forEach(mutation => {
				mutation.addedNodes.forEach(e => {
					if(e.tagName != 'SPAN')
						e.hidden = true;
				});
			});
		} catch(e) {
			console.log(e);
		}
	});

	let ob_draft = new MutationObserver(function (mutations) {
		try {
			const span = document.querySelector("ul.GlobalSideBar-navList li:last-child span.GlobalSideBar-navNumber");
			const draft_number = mutations[0].target.innerText.match(/\d+/)[0];
			if(!span) {
				let n = document.createElement("span");
				n.className = "GlobalSideBar-navNumber";
				n.innerText = draft_number;
				document.querySelector("ul.GlobalSideBar-navList li:last-child a").appendChild(n);
			} else {
				span.innerText = draft_number;
			}
		} catch(e) {
			console.log(e);
		}
	});

	ob_ContentItem.observe(mainFrame, {
		subtree: true,
		attributes: true,
		attributeFilter: ["class"],
	});
	ob_mainFrame.observe(mainFrame, {
		attributes: true,
		childList: true,
	});
	ob_sticky.observe(sticky, {
		subtree: true,
		childList: true,
	});
	ob_draft.observe(draft, {
		subtree: true,
		childList: true,
	});

}());