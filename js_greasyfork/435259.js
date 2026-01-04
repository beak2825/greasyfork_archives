// ==UserScript==
// @name         里屋赞
// @namespace    http://253874.net/zen/
// @version      0.6
// @description  里屋点赞工具
// @author       You
// @match        https://www.253874.net/*
// @match        https://253874.net/*
// @icon         http://253874.net/favicon.ico
// @connect      gushijielong.cn
// @downloadURL https://update.greasyfork.org/scripts/435259/%E9%87%8C%E5%B1%8B%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/435259/%E9%87%8C%E5%B1%8B%E8%B5%9E.meta.js
// ==/UserScript==

/// @ts-check


//vote button
(function ()
{
	const TemplateString = {
		CSS: `
button.btn-vote2 {
	all: initial;
	user-select: none;
	cursor: pointer;
	display: inline-block;
	width: 18px;
	height: 18px;
	transition: all 200ms;
	color: red;
	background: none;
	box-shadow: none;
}
button.btn-vote2:hover:not(:disabled) {
	transform: scale(1.2);
	color: red;
	background: none;
	box-shadow: none;
}
button.btn-vote2:disabled{
	cursor: default;
}
button.btn-vote2 .wrap {
	position: relative;
	width: 100%;
	height: 100%;
}

button.btn-vote2 i {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	/* visibility: hidden;  */
	opacity: 0;
	
	scale: 0;
	transition: all 200ms ease-out;
}

button.btn-vote2.fill i.fill {
	visibility: visible;
	opacity: 1;
	scale: 1;
}

button.btn-vote2.outline i.outline {
	visibility: visible;
	opacity: 1;
	scale: 1;
}

button.btn-vote2.spin i.spin{
	visibility: visible;
	opacity: 1;
	scale: 1;
	transition-timing-function: ease-in;
	animation: spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
}
@keyframes spin {
	from {
		rotate: 0;
	}

	to {
		rotate: 360deg;
	}
}
@keyframes spin-rev {
	from {
		rotate: 360deg;
	}

	to {
		rotate: 0deg;
	}
}

button.btn-vote2.skull {
	color: gray!important;
}

button.btn-vote2.skull i.spin{
	animation-name: spin-rev;
}
`,
		heartButton: `
<button class="btn-vote2">
			<div class="wrap">
				<i class="fill">
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 16 16">
						<g fill="none">
							<path
								d="M7.541 3.948a3.25 3.25 0 0 0-4.595-.012a3.25 3.25 0 0 0 .012 4.595l4.707 4.708a.5.5 0 0 0 .707 0l4.683-4.68a3.25 3.25 0 0 0-.012-4.594a3.252 3.252 0 0 0-4.601-.012l-.447.448l-.454-.453z"
								fill="currentColor"></path>
						</g>
					</svg>
				</i>
				<i class="outline">
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 16 16">
						<g fill="none">
							<path
								d="M7.541 3.948a3.25 3.25 0 0 0-4.595-.012a3.25 3.25 0 0 0 .012 4.595l4.707 4.708a.5.5 0 0 0 .707 0l4.683-4.68a3.25 3.25 0 0 0-.012-4.594a3.252 3.252 0 0 0-4.601-.012l-.447.448l-.454-.453zm4.805 3.905L8.02 12.178L3.665 7.824a2.25 2.25 0 0 1-.012-3.18a2.25 2.25 0 0 1 3.181.01l.81.81a.5.5 0 0 0 .715-.008l.79-.796a2.252 2.252 0 0 1 3.186.012a2.25 2.25 0 0 1 .011 3.181z"
								fill="currentColor"></path>
						</g>
					</svg>
				</i>
				<i class="spin">
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 512 512">
						<path
							d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48s48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.491-48-48-48z"
							fill="currentColor"></path>
					</svg>
				</i>
			</div>
		</button>`,
		skullButton: `
		<button class="btn-vote2 skull">
		<div class="wrap">
			<i class="fill">
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 512 512">
					<path
						d="M256 16C141.31 16 48 109.31 48 224v154.83l82 32.81L146.88 496H192v-64h32v64h16v-64h32v64h16v-64h32v64h45.12L382 411.64l82-32.81V224c0-114.69-93.31-208-208-208zm-88 320a56 56 0 1 1 56-56a56.06 56.06 0 0 1-56 56zm51.51 64L244 320h24l24.49 80zM344 336a56 56 0 1 1 56-56a56.06 56.06 0 0 1-56 56zm104 32z"
						fill="currentColor"></path>
				</svg>
			</i>
			<i class="outline">
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 512 512">
					<path
						d="M448 225.64v99a64 64 0 0 1-40.23 59.42l-23.68 9.47A32 32 0 0 0 364.6 417l-10 50.14A16 16 0 0 1 338.88 480H173.12a16 16 0 0 1-15.69-12.86L147.4 417a32 32 0 0 0-19.49-23.44l-23.68-9.47A64 64 0 0 1 64 324.67V224c0-105.92 85.77-191.81 191.65-192S448 119.85 448 225.64z"
						fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10"
						stroke-width="32"></path>
					<circle cx="168" cy="280" r="40" fill="none" stroke="currentColor" stroke-linecap="round"
						stroke-miterlimit="10" stroke-width="32"></circle>
					<circle cx="344" cy="280" r="40" fill="none" stroke="currentColor" stroke-linecap="round"
						stroke-miterlimit="10" stroke-width="32"></circle>
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
						stroke-width="32" d="M256 336l-16 48h32l-16-48z"></path>
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
						stroke-width="32" d="M256 448v32"></path>
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
						stroke-width="32" d="M208 448v32"></path>
					<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
						stroke-width="32" d="M304 448v32"></path>
				</svg>
			</i>
			<i class="spin">
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 512 512">
					<path
						d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48s48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.491-48-48-48z"
						fill="currentColor"></path>
				</svg>
			</i>
		</div>
	</button>
`
	};

	/** @type {HTMLTemplateElement} */
	let heartButtonTemplate;
	/** @type {HTMLTemplateElement} */
	let skullButtonTemplate;
	function initAll()
	{
		let style = document.createElement('style');
		style.innerHTML = TemplateString.CSS;
		document.head.appendChild(style);

		heartButtonTemplate = document.createElement('template');
		heartButtonTemplate.innerHTML = TemplateString.heartButton;

		skullButtonTemplate = document.createElement('template');
		skullButtonTemplate.innerHTML = TemplateString.skullButton;
	}

	class VoteButton
	{
		constructor(initialState, template)
		{
			/** @type {HTMLButtonElement} */
			//@ts-ignore
			this.buttonElement = (template || heartButtonTemplate).content.firstElementChild.cloneNode(true);
			this.numberElement = document.createElement('span');
			this.element = document.createElement('span');
			this.element.appendChild(this.buttonElement);
			this.element.appendChild(this.numberElement);

			let btn = this.buttonElement;

			function setButtonClass(c)
			{
				btn.classList.toggle('spin', c === 'spin');
				btn.classList.toggle('fill', c === 'fill');
				btn.classList.toggle('outline', c === 'outline');
			}
			setButtonClass(initialState ? 'fill' : 'outline');
			btn.setAttribute('data-state', initialState ? '1' : '0');

			//am i voted
			this.setButtonState = function (state)
			{
				let wantState = state ? '1' : '0';
				let oldState = btn.getAttribute('data-state');
				if (wantState !== oldState)
				{
					btn.setAttribute('data-state', wantState);
					if (!btn.getAttribute('data-loading'))
					{
						setButtonClass(wantState === '1' ? 'fill' : 'outline');
					}
				}
			};
			//is show as loading
			this.setButtonLoading = function (loading)
			{
				btn.disabled = loading;
				if (loading)
				{
					btn.setAttribute('data-loading', '1');
					setButtonClass('spin');
				}
				else
				{
					btn.removeAttribute('data-loading');
					let state = btn.getAttribute('data-state');
					setButtonClass(state === '1' ? 'fill' : 'outline');
				}
			};
			//current vote count
			this.setVote = function (n)
			{
				this.numberElement.textContent = n === 0 ? '' : (n + '');
			};

			this.onClick = function (callback)
			{
				btn.addEventListener('click', callback);
			};
		}
	}


	function get_topic_id()
	{
		var url = window.location.href;
		var topic_id = url.substring(url.lastIndexOf('/') + 1);
		var m = /[0-9]+/.exec(topic_id);
		if (m) return m[0];
		return '';
	}

	async function queryUpVote(topicId, userId)
	{
		const url = `https://gushijielong.cn/api/253874/get_upvotes/${encodeURIComponent(topicId)}/?user_id=${encodeURIComponent(userId)}`;
		return (await fetch(url)).json();
	}

	async function upVote(topicId, userId, postId)
	{
		const url = `https://gushijielong.cn/api/253874/upvote/?topic_id=${topicId}&user_id=${encodeURIComponent(userId)}&post_id=${postId}`;
		return (await fetch(url)).json();
	}
	async function downVote(topicId, userId, postId)
	{
		const url = `https://gushijielong.cn/api/253874/downvote/?topic_id=${topicId}&user_id=${encodeURIComponent(userId)}&post_id=${postId}`;
		return (await fetch(url)).json();
	}


	function getUserId()
	{
		if (/t\/[0-9]+/.test(location.pathname))
		{
			const ps = document.querySelectorAll('p');
			for (const p of ps)
			{
				let firstNode = p.firstChild;
				if (firstNode && firstNode.nodeType === 3 && (firstNode.textContent || '').trim() === '回复内容:')
				{
					/** @type {any} */
					let next = firstNode.nextSibling;
					if (next && next.tagName === 'FONT' && next.color === 'white')
					{
						if (next.textContent)
							return next.textContent;
					}
				}
			}
		}

		// @ts-ignore
		const frames = window.top.frames;
		function getFrame(name)
		{
			for (let i = 0; i < frames.length; i++)
			{
				if (name === frames[i].name)
					return frames[i];
			}
		}
		let topframe = getFrame('gb_top');
		let u1, u2;
		if (topframe)
		{
			let elem = topframe.document.querySelector('.nav span');
			if (elem)
			{
				const m = /您好，(.+) \[退出\]/.exec(elem.textContent || '');
				if (m && m[1])
				{
					u1 = m[1].trim();
				}
			}
		}

		let leftframe = getFrame('gb_left');
		if (leftframe)
		{
			let elem = leftframe.document.querySelector('.credit span');
			if (elem)
			{
				const m = /(.+)加油！/.exec(elem.textContent || '');
				if (m && m[1])
				{
					u2 = m[1].trim();
				}
			}
		}
		//console.log('u1,u2=',JSON.stringify({u1,u2}));
		if (u1 === u2) return u1;
	}

	let userId;
	let loadingPostSet = new Set();
	let downVotingPostSet = new Set();
	async function main()
	{

		const postList = document.querySelectorAll('.post_list');
		if (postList.length <= 0)
		{
			console.debug('里屋赞：找不到帖子');
			return;
		}
		userId = getUserId();
		if (!userId)
		{
			console.debug('里屋赞：找不到当前用户名');
			return;
		}
		if (!get_topic_id())
		{
			console.debug('里屋赞：找不到当前帖子id');
			return;
		}
		console.debug('里屋赞：开始初始化，帖子id', get_topic_id());
		let data;
		try
		{
			data = await queryUpVote(get_topic_id(), userId);
		}
		catch (e)
		{
			console.error(e);
			return;
		}
		if (!Array.isArray(data))
		{
			return;
		}
		initAll();
		for (const post of postList)
		{
			let postId = post.getAttribute('id');
			if (postId) postId = postId.substring(3);
			if (!postId) continue;

			let obj = data.find(x => x.post_id + '' === postId + '');
			let voteButton = new VoteButton(obj && obj.user_upvoted);
			if (obj)
			{
				voteButton.setVote(obj.upvote_count);
			}
			voteButton.onClick(createClickFunction(postId, voteButton, loadingPostSet, upVote));
			post.lastElementChild && post.lastElementChild.appendChild(voteButton.element);

			let downButton = new VoteButton(obj && obj.user_downvoted, skullButtonTemplate);
			if (obj)
			{
				downButton.setVote(obj.downvote_count);
			}
			downButton.onClick(createClickFunction(postId, downButton, downVotingPostSet, downVote));
			post.lastElementChild && post.lastElementChild.appendChild(downButton.element);


		}
	}
	function wait(ms)
	{
		return new Promise(r => setTimeout(r, ms));
	}
	main();
	/**
	 * 
	 * @param {number|string} postId 
	 * @param {VoteButton} voteButton 
	 * @param {Set<any>} loadingSet 
	 * @param {(topicId,userId,postId)=>Promise<any>} func
	 * @returns 
	 */


	function createClickFunction(
		postId, voteButton, loadingSet, func)
	{
		return async function ()
		{
			if (loadingSet.has(postId))
				return;
			loadingSet.add(postId);
			voteButton.setButtonLoading(true);
			let data;
			try
			{
				let p = func(get_topic_id(), userId, postId);
				let arr = await Promise.all([p, wait(Math.random() * 2000)]);
				data = arr[0];
			}
			catch (e)
			{
				loadingSet.delete(postId);
				voteButton.setButtonLoading(false);
				console.error(e);
				return;
			}

			loadingSet.delete(postId);
			voteButton.setButtonLoading(false);

			if (data)
			{
				voteButton.setButtonState(data.status === 'success');
				if (typeof data.vote_count === 'number')
				{
					voteButton.setVote(data.vote_count);
				}
				else if (typeof data.downvote_count === 'number')
				{
					voteButton.setVote(data.downvote_count);
				}
			}

		};
	}
})();
