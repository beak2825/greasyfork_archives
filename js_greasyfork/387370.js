// ==UserScript==
// @name         扇贝搜索
// @version     2019.07.12.0
// @description
// @author       Aaron Liu
// @supportURL   https://gitee.com/xiaobai-aaron/shanbeizhushousousuo
// @license      MIT
// @date         2019-6-25
// @modified     2019-7-10
// @match        *://www.shanbay.com/team/detail/*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at            document-end
// @grant             unsafeWindow
// @grant             GM_setClipboard
// @grant             GM_xmlhttpRequest
// @namespace undefined
// @description It's a helper tool for adding search function of the posts in Shanbay
// @downloadURL https://update.greasyfork.org/scripts/387370/%E6%89%87%E8%B4%9D%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/387370/%E6%89%87%E8%B4%9D%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const ipp = 20;

	/.+\/(\d+)\//.test(window.location.pathname);
	const groupId = RegExp.$1;

	let oldGroupId = window.localStorage['groupId'];
	let disableSelf = false;

	// const cachedPageIndex = window.localStorage['pageIndex'] || 0;

	// if (oldGroupId !== groupId && cachedPageIndex > 0) {
	// 	if (confirm('发现你进入了一个新的小组的页面，请问需要在这个新的小组里使用帖子搜索插件吗？')) {
	// 		window.localStorage.clear();
	// 		oldGroupId = undefined;
	// 	} else {
	// 		return;
	// 	}
	// }

	if (!oldGroupId) {
		window.localStorage['groupId'] = groupId;
	} else if (oldGroupId !== groupId) {
		// As you've step into another group, disable this plugin until you try to use it, as we don't know if you want to use it in this group for now.
		disableSelf = true;
	}

	let postBaseUrl = `https://www.shanbay.com/team/thread/${groupId}/`;

	const EVENT_BEGIN_LOAD_DATA = 'EVENT_BEGIN_LOAD_DATA';
	const EVENT_GOT_DATA = 'GOT_DATA';
	const EVENT_COMPLETE_LOAD_DATA = 'EVENT_COMPLETE_LOAD_DATA';

	let delayHandler;
	const delay = (t = 500) => {
		return new Promise(r => {
			if (delayHandler) {
				clearTimeout(delayHandler);
			}

			delayHandler = setTimeout(() => {
				r();
			}, t);
		});
	};

	class EventDispatcher {

		constructor() {
			this.eventsMap = {};
		}

		addEvent(event, handler) {
			if (this.eventsMap[event]) {
				this.eventsMap[event].push(handler);
			} else {
				this.eventsMap[event] = [handler];
			}
		}

		offEvent(event, handler) {
			if (this.eventsMap[event]) {
				if (handler) {
					const indexOfHandler = this.eventsMap[event].indexOf(handler);

					if (indexOfHandler > -1) {
						this.eventsMap[event].splice(indexOfHandler, 1);
					}
				} else {
					this.eventsMap[event] = [];
				}

			}
		}

		raiseEvent(event, args) {
			if (this.eventsMap[event]) {
				this.eventsMap[event].forEach(v => v(args));
			}
		}

		registerEventGotData(handler) {
			this.addEvent(EVENT_GOT_DATA, handler);
		}

		registerBeginLoadData(handler) {
			this.addEvent(EVENT_BEGIN_LOAD_DATA, handler);
		}

		registerCompleteLoadData(handler) {
			this.addEvent(EVENT_COMPLETE_LOAD_DATA, handler);
		}

		raiseEventGotData(args) {
			return this.raiseEvent(EVENT_GOT_DATA, args);
		}

		raiseEventBeginLoadData(args) {
			return this.raiseEvent(EVENT_BEGIN_LOAD_DATA, args);
		}

		raiseEventCompleteLoadData(args) {
			return this.raiseEvent(EVENT_COMPLETE_LOAD_DATA, args);
		}

		dispose() {
			this.eventsMap.forEach(v => v = []);
		}

	}

	class Cache {
		constructor() {
			this.usingCache = window.localStorage;
			this.initValue = () => {
				return { user: {}, posts: [], starredPosts: [] };
			};

			this.getPostsGroupName = isStarred => isStarred ? 'starredPosts' : 'posts';
			this.cacheEntryMap = this.initValue();
			this.cachedPageIndex = 0;
			this.cachedStarredPageIndex = 0;
		}

		onGotData(data /**postsData, pageIndex, total, isStarred */) {
			const { pageIndex, users, isStarred } = data;

			users.forEach(u => {
				const oldUser = this.getUser(u.id);

				if (!oldUser || oldUser.username !== u.username) {
					this.addUser(u.id, u);
				}
			});


			const cpi = isStarred ? this.cachedStarredPageIndex : this.cachedPageIndex;

			if (pageIndex > cpi) {
				this.addPosts(data);

				if (isStarred) this.cachedStarredPageIndex = pageIndex;
				else this.cachedPageIndex = pageIndex;

			} else if (pageIndex === 0) {
				this.addCache(this.getPostsGroupName(isStarred), data.postsData.concat(this.getPosts(isStarred)));
			}
		};

		addCache(group, value, key) {
			if (key) {
				this.cacheEntryMap[group][key] = value;
			} else {
				this.cacheEntryMap[group] = value;
			}

			this.usingCache[group] = JSON.stringify(this.cacheEntryMap[group]);
		}

		clearCache(group) {
			if (group) {
				if (this.cacheEntryMap[group]) {
					const initValue = this.initValue();
					this.cacheEntryMap[group] = initValue[group];
					this.usingCache[group] = initValue[group];
				}
			} else {
				this.cacheEntryMap = this.initValue();
			}

			this.saveAllCache();
		}

		readAllCache() {
			for (let key in this.cacheEntryMap) {
				const value = this.cacheEntryMap[key];

				if (this.usingCache[key]) {
					this.cacheEntryMap[key] = JSON.parse(this.usingCache[key]);
				}
			}
		}

		saveAllCache() {
			for (let key in this.cacheEntryMap) {
				const value = this.cacheEntryMap[key];
				this.usingCache[key] = JSON.stringify(value);
			}
		}

		addUser(id, value) {
			this.addCache('user', value, id);
		}

		getUser(id) {
			return this.cacheEntryMap['user'][id];
		}

		getUsers() {
			return this.cacheEntryMap['user'];
		}

		addPosts(posts) {
			const { postsData, pageIndex, total, isStarred } = posts;
			this.saveCachedPageIndex(pageIndex, isStarred);
			this.saveTotalPostsCount(total, isStarred);
			this.addCache(this.getPostsGroupName(isStarred), this.getPosts(isStarred).concat(postsData));
		}

		getPosts(isStarred) {
			return this.cacheEntryMap[this.getPostsGroupName(isStarred)] || {};
		}

		saveTotalPostsCount(total, isStarred) {
			this.usingCache[isStarred ? 'starredPostsCount' : 'postsCount'] = total;
		}

		getTotalPostsCount(isStarred) {
			return this.usingCache[isStarred ? 'starredPostsCount' : 'postsCount'] || 0;
		}

		saveCachedPageIndex(index, isStarred) {
			this.usingCache[isStarred ? 'starredPageIndex' : 'pageIndex'] = index;
		}

		getCachedPageIndex(isStarred) {
			return this.usingCache[isStarred ? 'starredPageIndex' : 'pageIndex'] || 0;
		}
	}

	class DataService {
		constructor() {
			this.maxPageIndex = 500;
			this.requestInterval = 1200; // in milliseconds
			this.starredKey = 'starred';

			this.onLoadData = () => { };
			this.onBeginLoadData = () => { };
			this.onCompleteLoadData = () => { };

			if (!disableSelf) {
				setTimeout(() => {
					this.initData(groupId);
				}, 300);
			}

		}

		initData(groupId) {
			this.pageUrl = `https://www.shanbay.com/api/v1/team/${groupId}/thread/?ipp=20&page=`;
			this.starredPageUrl = `https://www.shanbay.com/api/v1/team/${groupId}/thread/?ipp=20&starred&page=`;

			cache.readAllCache();

			let getStarredPagePromise = Promise.resolve(true);

			const starredTotalPostsCount = cache.getTotalPostsCount(true) || 0;
			const starredPageIndex = cache.getCachedPageIndex(true) || 0;
			if (starredPageIndex === 0 || starredPageIndex * ipp < starredTotalPostsCount) {
				getStarredPagePromise = this.getPageDataFromAPI(parseInt(starredPageIndex) + 1, true);
			}

			return getStarredPagePromise.then(() => {
				console.log('complete load starred posts');

				return Promise.resolve(true);
			}).then(() => {
				const pageIndex = cache.getCachedPageIndex();
				if (pageIndex < this.maxPageIndex) {
					return this.getPageDataFromAPI(parseInt(pageIndex) + 1);
				}

				return Promise.resolve(true);

			}).then(() => {
				console.log('complete load normal posts');

				// check new posts
				return this.requestNewPosts(1, cache.getPosts(true), true).then(() => {
					return this.requestNewPosts(1, cache.getPosts());
				});

			}).then(() => {
				console.log('complete loaded data ');
				this.onCompleteLoadData();
			});
		}

		parsePostData(responseText) {
			const json = JSON.parse(responseText);
			const data = json && json.data;
			const total = data && data.total;
			const objects = data && data.objects || [];

			const postsData = [];
			const users = [];
			objects.forEach((o, i) => {
				users.push(o.author);

				postsData.push({
					time: o.topic_post_time, // use create time here
					title: o.title,
					posts: o.posts,
					authorId: o.author && o.author.id,
					id: o.id
				});
			});

			return { postsData, total, users };
		}

		requestNewPosts(pageIndex, postsData, isStarred) {
			let maxComparePostsCount = 100;

			return this.requestPosts(pageIndex, isStarred).then(data => {
				const { postsData: newPostsData, total, users } = data;

				const newPosts = [];
				let newUsers = [].concat(users);

				newPostsData.forEach((post) => {
					let isHit = false;
					for (let i = 0; i < maxComparePostsCount && i < postsData.length; i++) {
						if (postsData[i].id === post.id) {
							isHit = true;
							break;
						}
					}

					if (!isHit) {
						newPosts.push(post);
					}
				});

				if (newPosts.length > 0) {
					this.onLoadData({ postsData: newPosts, pageIndex: 0, total, isStarred, users: newUsers });

					return this.requestNewPosts(pageIndex + 1, postsData, isStarred);
				}
			});

		}

		async requestPosts(index, isStarred) {
			const pageUrl = `https://www.shanbay.com/api/v1/team/${groupId}/thread/?ipp=20${isStarred ? '&' + this.starredKey : ''}&page=`;
			const pageIndex = index;

			const targetUrl = pageUrl + index;
			const nowStamp = Date.now();

			return new Promise(resolve => {
				GM_xmlhttpRequest({
					method: "GET",
					url: targetUrl + '&_=' + nowStamp,
					onload: (response) => {
						const { postsData, total, users } = this.parsePostData(response.responseText);

						const returnData = { postsData, pageIndex, total, isStarred, users };


						const timePassed = Date.now() - nowStamp;

						if (timePassed < this.requestInterval) {
							setTimeout(() => {
								resolve(returnData);
							}, this.requestInterval - timePassed);
						} else {
							resolve(returnData);
						}
					}
				});
			});
		};

		getPageDataFromAPI(fromPageIndex, isStarred) {
			let maxPageIndex = this.maxPageIndex;
			if (isStarred) {
				if (this.starredPageCount) {
					maxPageIndex = this.starredPageCount;
				}
			}

			this.onBeginLoadData({ percent: Math.round(100 * fromPageIndex / maxPageIndex), isStarred });

			return this.requestPosts(fromPageIndex, isStarred).then(returnData => {
				if (isStarred && !this.starredPageCount) {
					this.starredPageCount = Math.ceil(returnData.total / ipp);
				}

				this.onLoadData(returnData);

				if (ipp * fromPageIndex < returnData.total && fromPageIndex < this.maxPageIndex) {
					return this.getPageDataFromAPI(fromPageIndex + 1, isStarred);
				}
			});
		};

		getUser(userName) {
			if (!userName) return;

			const users = cache.getUsers() || {};
			for (let uid in users) {
				if (users[uid].nickname === userName) {
					return users[uid];
				}
			}
		}

		getAllData() {

		}

	}

	const cache = new Cache();
	const ed = new EventDispatcher();
	const dataService = new DataService();

	dataService.onLoadData = (data) => {
		ed.raiseEventGotData(data);
	};

	dataService.onBeginLoadData = (data) => {
		ed.raiseEventBeginLoadData(data);
	};

	dataService.onCompleteLoadData = () => {
		ed.raiseEventCompleteLoadData();
	};


	const onBeginLoadData = ({ percent, isStarred }) => {
		showStatus(`正在加载${isStarred ? '精华帖' : '数据'} ${percent}%`, percent);
	};

	const onCompleteLoadData = (isStarred) => {
		showStatus('数据已更新', 100);
	};

	const onGotData = (data /**postsData, pageIndex, total, isStarred */) => {
		cache.onGotData(data);

		// update ui
		const { searchValue, authorValue, starred, old_new } = getUserInput();
		doSearch(authorValue, searchValue, starred, old_new, data.postsData);
	};

	ed.registerBeginLoadData(onBeginLoadData);
	ed.registerCompleteLoadData(onCompleteLoadData);
	ed.registerEventGotData(onGotData);

	const searchBtnClass = 'search-btn';

	const tabSearch = `
			<li class="search-btn"><a href="#search-topic" data-toggle="tab"><i class="icon-search"></i> 搜索</a></li>
		`;

	const initSearchTab = () => {
		if ($(`.${searchBtnClass}`).length === 0) {
			$('#threads').append(tabSearch);
		}

		$('#threads li').on('click', () => {
			$('.seek-container').removeClass('show');
		});

		$(`.${searchBtnClass}`).off('click').on('click', () => {
			$('.seek-container').addClass('show');
		});
	};

	const initControls = () => {
		if ($('.seek-container').length === 0) {
			const $header = $('#threads').parent().find('>div').eq(1);
			$header.css('position', 'relative');
			$header.append(`
				<div class='seek-container'>
        <style>
            label {
                display: inline;
            }
            .seek-container {
				height: 34px;
				padding: 5px;
				position: absolute;
				bottom: -60px;
				right: 0;
				opacity: 0;
				display: none;
			}
			
			.seek-container.show {
				opacity: 1;
				bottom: 0;
				display: block;

				animation: showSeekBarAnimation;
				animation-duration: 0.5s;
				animation-timing-function: cubic-bezier(1, 0, 0, 1);
				animation-iteration-count: 1;
				animation-fill-mode: both;
			}

			.seek-status {
				width: 100%;
				position: relative;
				margin-left: -20px;
				padding-left: 20px;
				background: white;
			}

			progress {display: inline-block;width:100%;height: 5px;border-radius: 5px; margin: 2px;overflow: hidden;float: left;} 
			progress ie {display:block;height: 100%;background: #ff8a00; } 
			progress::-moz-progress-bar { background: #ff8a00; } 
			progress::-webkit-progress-bar { background: #e5e5e5; } 
			progress::-webkit-progress-value { background: #ff8a00; }

			.seek-container input {
				height: 16px;
				margin: 0;
				font-size: 80%;
				vertical-align: middle;
			}

			#seek-container-seek-button {
				height: 24px;
			}

			.seek-container-display {
				position: relative;
			}

			.seek-container-input-author, .seek-container-input-text {
				width: 100px;
			}
			#seek-container-input-starred, #seek-container-input-sort {
				width:20px;
				height:20px;
			}

			.markdown-check {
				height: 20px;
				width: 20px !important;
				vertical-align: middle;
			}

			.seek-status-actions {
				float: right;
				margin-top: -18px;
				display: none;
			}
			.seek-status .action-btn {
				height: 24px;
				color: black;
			}

			
@keyframes showSeekBarAnimation {
	0% {
		opacity: 0;
		bottom: -60px;
	}
	100% {
		opacity: 1;
		bottom: 0;
	}
}

        </style>
        <div class="seek-container-input">
            <label>昵称</label>
            <input type="text" class="seek-container-input-author">
            <label>标题</label>
			<input type="text" class="seek-container-input-text">
			<input type="checkbox" id="seek-container-input-starred" value="starred">精华帖</input>
			<input type="checkbox" id="seek-container-input-sort" value="old_new">顺序排列</input>
			<div class="seek-status">
				<progress id="seek-status-percent" value='0' max='100'></progress>
				<div class="seek-status-text"></div>
				<div class="seek-status-actions">
					<input type="button" class="action-btn" id="seek-container-check-all" value="全部选中">
					<input type="button" class="action-btn" id="seek-container-markdown" value="生成Markdown">
				</div>
			</div>
		</div>
	</div>
    </div>
				`);
		}
	};

	const initSearchResult = () => {
		$('.tab-content').append(`
			<div class="tab-pane" id="search-topic">
				<h3>请输入用户名或搜索内容以开始搜索</h3>
				<div class="seek-container-display">
					<div class="seek-container-result"></div>
				</div>
			</div>
			`);

	};

	initSearchTab();
	initControls();
	initSearchResult();

	const $userMsg = $('#search-topic >h3');
	const $m = $('.seek-container-result');
	const $st = $('.seek-status-text');
	const $sp = $('#seek-status-percent');

	const showStatus = (msg, percent) => {
		$st.text(msg);

		if (percent) {
			$sp.attr('value', percent);
		}
	};

	const showMsg = (msg, level) => {
		const color = level < 10 ? 'red' : level < 20 ? 'yellow' : 'white';
		$m.append(`<div style="color:${color}">${msg}</div>`);
	};

	const showUserMsg = (msg, autoHide) => {
		if (msg) {
			$userMsg.text(msg);
			$userMsg.show();
		}

		if (autoHide) {
			setTimeout(() => {
				$userMsg.text('');
				$userMsg.hide();
			}, 1000);
		}
	}

	const hideUserMsg = () => {
		$userMsg.hide();
	}

	const showLink = (post) => {
		const author = cache.getUser(post.authorId) || {};
		const absolute_url = postBaseUrl + post.id;

		const content = `<div class="row thread">
        <div class="span">
            <img src="${author.avatar}" class="" alt="${author.nickname}" width="40" height="40"/>
            
        </div>
        <div class="span7 title">
            <div class="row">
                <div class="span7">
                    <h4>
                        <a href="${absolute_url}" target="_blank">${post.title}</a>
                    </h4>
                    ${post.starred ? '<span class="label label-info">精华帖</span>' : ''}
                </div>
            </div>
            <div class="row">
                <div class="span6 thread_author">
                    <a href="/user/list/${author.username}/" target="_blank">${author.nickname}</a> • ${post.time.slice(0, 10)}
                </div>
                <div class="span1 pull-right replies">
                    <div class="pull-right">
                        <input class="markdown-check" type="checkbox" value="check"></input>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <hr></hr>`;

		showMsg(content, 30);

		if ($('.seek-status-actions:visible').length === 0) {
			$('.seek-status-actions').show();
		}

	};

	const doSearch = (author, searchContent, starred, old_new, sourceData) => {

		if (!author && !searchContent) {
			return;
		}

		let user;
		if (author) {
			user = dataService.getUser(author);

			if (!user) {
				showUserMsg('查无此人，请确定用户名是否输入正确');

				return;
			}
		}

		let result; // use these code for better debugging experience
		// const result = sourceData || cache.getPosts(starred);
		if (sourceData) {
			result = sourceData;
		} else {
			result = cache.getPosts(starred);;
		}

		if (user) {
			result = result.filter(d => {
				return d.authorId === user.id;
			});
		}

		if (searchContent) {
			const searchKeys = searchContent.split(' ');

			result = result.filter(d => {
				let searchBegin = 0;
				let isHit = false;
				for (let i = 0; i < searchKeys.length; i++) {
					const k = searchKeys[i].trim();
					if (!k) continue;

					const index = d.title.indexOf(k, searchBegin);
					if (index >= 0) {
						isHit = true;
						searchBegin = index + k.length;
					} else {
						isHit = false;
						break;
					}
				}

				return isHit;

			});
		}

		if (starred) {
			result = result.map(d => {
				d.starred = true;

				return d;
			});
		}

		if (old_new) {
			result.sort((a, b) => {
				if (a.time == b.time) return 0;

				if (a.time < b.time) {
					if (old_new) return -1;
					return 1;
				}

				if (old_new) return -1;
				return 1

			});
		}

		result.forEach(o => showLink(o));
	}

	const $c = $('.seek-container');

	let isTyping = false;
	$c.find('input').on('input', () => {
		console.log('input');
		delay().then(() => {
			const { searchValue, authorValue, starred, old_new } = getUserInput();

			$m.empty();
			checkAllButton.val('全部选中');
			$('.seek-status-actions').hide();

			if (authorValue || searchValue) {
				if (disableSelf) {
					if (confirm('发现你进入了一个新的小组的页面，请问需要在这个新的小组里使用帖子搜索插件吗？')) {
						disableSelf = false;
						window.localStorage.clear();

						window.localStorage['groupId'] = groupId;
						postBaseUrl = `https://www.shanbay.com/team/thread/${groupId}/`;

						dataService.initData(groupId);
					} else {
						return;
					}
				} else {
					hideUserMsg();
					doSearch(authorValue, searchValue, starred, old_new);
				}
			} else {
				showUserMsg('请输入扇贝昵称或搜索内容以开始搜索');
			}
		});
	}).on('compositionstart', () => {
		console.log('compositionstart');
		isTyping = true;
	}).on('compositionend', () => {
		console.log('compositionend');
		isTyping = false;
	});

	const getUserInput = () => {
		if (isTyping) {
			return { searchValue: '', authorValue: '' };
		}

		const searchValue = $c.find('.seek-container-input-text').val().trim();
		const author = $c.find('.seek-container-input-author').val().trim();
		const starred = $c.find('#seek-container-input-starred')[0].checked;
		const old_new = $c.find('#seek-container-input-sort')[0].checked;
		const authorValue = author || !searchValue && $c.find('.seek-container-input-author').attr('placeholder');

		return { searchValue, authorValue, starred, old_new };
	};

	const checkAllButton = $('#seek-container-check-all');

	checkAllButton.on('click', () => {
		if (checkAllButton.val() === '全部选中') {
			checkAllButton.val('全部取消选中');
			$('.seek-container-result .row.thread input').each((i, e) => e.checked = true);
		} else {
			checkAllButton.val('全部选中');
			$('.seek-container-result .row.thread input').each((i, e) => {
				e.checked = false;
			});
		}
	});

	$('#seek-container-markdown').on('click', () => {
		// const allCheckbox = $('.seek-container-result .row.thread input');
		const allCheckedItem = $('.seek-container-result .row.thread input:checked').parent().parent().parent().parent().parent();
		if (allCheckedItem.length === 0) {
			showUserMsg('请选中至少一个帖子', true);

			return;
		} else {
			const items = [];
			allCheckedItem.each((i, e) => {
				const $node = $(e).find('a').eq(0);
				const title = $node.text();
				const href = $node.attr('href');

				items.push({ title, href });
			});

			let markdownContent = '';
			items.forEach(v => {
				markdownContent += `[${v.title}](${v.href})` + '  \r\n  \r\n';
			});

			makeCopyMarkdownUI(markdownContent);
		}
	});

	function makeCopyMarkdownUI(data) {
		const textInput = `<textarea id="copy-text-id" style={width:0;height:0}>${data}</textarea>`;
		$('.seek-status-actions').append(textInput);

		$('.seek-status-actions #copy-text-id')[0].select();
		document.execCommand('Copy');
		alert('Markdown 内容已经复制');

		$('.seek-status-actions #copy-text-id').remove();
	}
})();