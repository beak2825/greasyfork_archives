// ==UserScript==
// @name        AniCHAT - Discuss Anime Episodes
// @namespace   https://greasyfork.org/en/users/781076-jery-js
// @version     2.6.4
// @description Get discussions from popular sites like MAL and Reddit for the anime you are watching right below your episode
// @icon        https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ
// @author      Jery
// @license     MIT
// @match       https://yugenanime.*/*
// @match       https://yugenanime.tv/*
// @match       https://yugenanime.sx/*
// @match       https://animepahe.*/*
// @match       https://animepahe.si/*/
// @match       https://anitaku.*/*
// @match       https://anitaku.bz/*
// @match       https://gogoanime.*/*
// @match       https://gogoanime.to/*
// @match       https://gogoanime3.*/*
// @match       https://gogoanime3.co/*
// @match       https://aniwave.*/watch/*
// @match       https://aniwave.to/watch/*
// @match       https://aniwave.vc/watch/*
// @match       https://aniwave.ti/watch/*
// @match       https://aniwatchtv.*/watch/*
// @match       https://aniwatchtv.to/watch/*
// @match       https://hianime.*/watch/*
// @match       https://hianime.to/watch/*
// @match       https://kayoanime.*/*
// @match       https://kayoanime.com/*
// @match       https://kaas.*/*/*
// @match       https://kaas.to/*/*
// @match       https://kickassanimes.*/*/*
// @match       https://kickassanimes.io/*/*
// @match       https://*.kickassanime.*/*/*
// @match       https://*.kickassanime.mx/*/*
// @match       https://anix.*/*/*/*
// @match       https://anix.to/*/*/*
// @match       https://anix.ac/*/*/*
// @match       https://anix.vc/*/*/*
// @match       https://animeflix.*/watch/*
// @match       https://animeflix.live/watch/*
// @match       https://animehub.*/watch/*
// @match       https://animehub.ac/watch/*
// @match       https://animesuge.*/anime/*
// @match       https://animesuge.to/anime/*
// @match       https://*.miruro.*/*
// @match       https://*.miruro.tv/watch?id=*
// @match       https://*.miruro.to/watch?id=*
// @match       https://*.miruro.online/watch?id=*
// @match       https://animez.org/*/epi-*
// @match       https://animekai.to/watch/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_notification
// @grant       GM.xmlHttpRequest
// @require     https://unpkg.com/axios/dist/axios.min.js
//				Using GM_fetch for bypassing CORS
// @require     https://cdn.jsdelivr.net/npm/@trim21/gm-fetch@0.2.1
// @downloadURL https://update.greasyfork.org/scripts/485793/AniCHAT%20-%20Discuss%20Anime%20Episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/485793/AniCHAT%20-%20Discuss%20Anime%20Episodes.meta.js
// ==/UserScript==

/**************************
 * CONSTANTS
 ***************************/
// seconds to wait before loading the discussions (to avoid spamming the service)
const TIMEOUT = 30000; // in milliseconds

/***************************************************************
 * ANIME SITES & SERVICES
 ***************************************************************/
const animeSites = [
	{
		name: "yugenanime",
		url: ["yugenanime.tv", "yugenanime.sx"],
		chatArea: ".box.m-10-t.m-25-b.p-15",
		getAnimeTitle: () => document.querySelector(".ani-info-ep a > h1").textContent,
		getEpTitle: () => document.querySelector("h1.text-semi-bold.m-5-b").textContent,
		getEpNum: () => window.location.href.split("/")[6],
		styles: null,
	},
	{
		name: "animepahe",
		url: ["animepahe.si", "animepahe"],
		chatArea: ".theatre",
		getAnimeTitle: () => document.querySelector(".theatre-info > h1 > a").textContent.split(' - ')[0],
		getEpTitle: () => document.querySelector(".theatre-info > h1 > a").textContent.split(' - ')[0],
		getEpNum: () =>  document.querySelector(".dropup.episode-menu > button").innerText.split("Episode ")[1],
		styles: '.discussion-area { max-width:1100px; margin:15px auto 0; }',
	},
	{
		name: "gogoanime",
		url: ['gogoanime3', 'gogoanimehd', 'gogoanime', 'anitaku'],
		chatArea: ".anime_video_body_comment_center",
		getAnimeTitle: () => document.querySelector(".anime-info > a").textContent,
		getEpTitle: () => document.querySelector(".anime-info > a").textContent,
		getEpNum: () => window.location.href.split("-episode-")[1],
		styles: `.chat-msg { color: white; font-size: 14px; } .discussion-title > a { font-size: 24px; color: goldenrod; }`
	},
	{
		name: "aniwave",
		url: ['aniwave', 'lite.aniwave'],
		chatArea: "#comments",
		getAnimeTitle: () => document.querySelector(".name .title").textContent,
		getEpTitle: () => document.querySelector(".name .title").textContent,
		getEpNum: () => window.location.href.split("/ep-")[1],
	},
	{
		name: "hianime",
		url: ["aniwatchtv", "hianime.to", "hianime.nz", "hianime.mm", "hianime.sx", "hianime"],
		chatArea: ".show-comments",
		getAnimeTitle: () => document.querySelector("h2.film-name > a").textContent,
		getEpTitle: () => document.querySelector("div.ssli-detail > .ep-name").textContent,
		getEpNum: () => waitForElm(".ssl-item.ep-item.active > .ssli-order").then(elm => elm.textContent),
		styles: `.chat-row .user-avatar { width: auto; overflow: visible; }`
	},
	{
		name: "kayoanime",
		url: ["kayoanime.com"],
		chatArea: "#the-post",
		getAnimeTitle: () => document.querySelector("h1.entry-title").textContent.split(/Episode \d+ English.+/)[0].trim(),
		getEpTitle: () => document.querySelector(".toggle-head").textContent.trim(),
		getEpNum: () => document.querySelector("h1.entry-title").textContent.split(/Episode (\d+) English.+/)[1],
	},
	{
		name: "kickassanime",
		url: ["kaas", "kickassanimes", "kickassanime"],
		chatArea: () => document.querySelector("#disqus_thread").parentElement,
		getAnimeTitle: () => document.querySelector(".text-h6").textContent,
		getEpTitle: () => document.querySelector(".text-h6").textContent,
		getEpNum: () => document.querySelector(".d-block .text-overline").textContent.split("Episode")[1].trim(),
	},
	{
		name: "anix",
		url: ["anix"],
		chatArea: () => document.querySelector("#disqus_thread").parentElement,
		getAnimeTitle: () => document.querySelector(".ani-name").textContent,
		getEpTitle: () => document.querySelector(".ani-name").textContent,
		getEpNum: () => window.location.href.split("/ep-")[1],
	},
	{
		name: "animeflix",
		url: ["animeflix"],
		chatArea: 'main',
		getAnimeTitle: () => document.querySelector(".details .title").textContent,
		getEpTitle: () => document.querySelector(".details .title").textContent,
		getEpNum: () => window.location.href.split("-episode-")[1],
	},
	{
		name: "animehub",
		url: ["animehub"],
		chatArea: 'mawdawin',
		getAnimeTitle: () => document.querySelector(".dc-title").textContent,
		getEpTitle: () => document.querySelector(".dc-title").textContent,
		getEpNum: () => document.querySelector("#current_episode_name").textContent.split("Episode")[1].trim(),
	},
	{
		name: "animesuge",
		url: ["animesuge.to", "animesuge"],
        chatArea: '#comment',
        getAnimeTitle: () => document.querySelector("#media-info .maindata > h1").textContent,
        getEpTitle: () => document.querySelector("#media-info .maindata > h1").textContent,
        getEpNum: () => window.location.href.split("/ep-")[1],
	},
	{
		name: "miruro",
		url: ["miruro.tv", "miruro.to", "miruro.online"],
		chatArea: ".App + div > div > div + div > div",
		getAnimeTitle: () => document.querySelector(".anime-title > a").textContent.trim(),
		getEpTitle: () => document.querySelector(".title-container .ep-title").textContent.trim(),
		getEpNum: () => location.href.split('&ep=')[1],
		styles: `#AniCHAT a:-webkit-any-link { color: lightblue; } ul.discussion-list { padding-inline-start: 0px; }`,
		initDelay: 5000,	// Time to wait (for page to load) before attaching the discussion area
	},
	{
		name: "animez",
		url: ["animez.org"],
		chatArea: '#box_right_watch',
		getAnimeTitle: () => document.querySelector("#title-detail-manga").textContent,
		getEpTitle: () => document.querySelector("#title-detail-manga").textContent,
		getEpNum: () => document.querySelector(".wp-manga-chapter.active").textContent.replace("-Dub", "").trim(),
	},
	{
		name: "animekai",
		url: ["animekai.to"],
		chatArea: ".scontent",
		getAnimeTitle: () => document.querySelector(".title").textContent,
		getEpTitle: () => document.querySelector(".eplist a > span").textContent,
		getEpNum: () => document.querySelector(".eplist a.active").getAttribute("num"),
		initDelay: 1000,	// Time to wait (for page to load) before attaching the discussion area
	},
];

const services = [
	{
		name: "MyAnimeList",
		icon: "https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ",
		url: "https://myanimelist.net/",
		_clientId: "dbe5cec5a2f33fdda148a6014384b984",
		async getDiscussion(animeTitle, epNum) {
			let animeId, topic, url, response, data;
			let headers = {headers: {"X-MAL-CLIENT-ID": this._clientId, 'x-requested-with': 'XMLHttpRequest', 'origin': window.location.origin}};
			// get the anime's MAL id using MAL API (or use Jikan API if title is too long)
			try {
				if (animeTitle.length > 500) {
					url = `https://api.myanimelist.net/v2/anime?q=${animeTitle}&limit=1`;
					response = await GM_fetch(url, headers);
					data = await response.json();
					animeId = data.data[0].node.id;
				} else {
					url = `https://api.jikan.moe/v4/anime?q=${animeTitle}&limit=1`;
					animeId = GM_getValue('cachedId_'+url, null);
					if (!animeId) {
						response = await GM_fetch(url, headers);
						data = await response.json();
						animeId = data.data[0].mal_id;
						GM_setValue('cachedId_'+url, animeId);
					}
				}
				console.log(`animeId: ${animeId}`);
			} catch (e) {
				throw new Error(`Couldn't find the anime id. Retry after a while or switch to another service.\n${e.code} : ${e}`);
			}
			// get the discussion url from the anime
			try {
				url = `https://api.jikan.moe/v4/anime/${animeId}/forum`;
				response = await GM_fetch(url, headers);
				data = await response.json();
				topic = data.data.find(it => it.title.includes(`Episode ${epNum} Discussion`));
				console.log(`topic: ${topic}`);
			} catch (e) {
				throw new Error(`No discussion found. Retry after a while or switch to another service.\n${e.code} : ${e}`);
			}
			// get the forum page
			try {
				url = `https://api.myanimelist.net/v2/forum/topic/${topic.mal_id}?limit=100`;
				response = await GM_fetch(url, headers);
				data = await response.json();
				console.log(`data: ${data}`);
			} catch (e) {
				throw new Error(`Error getting the discusssion (${topic}). Retry after a while or switch to another service.\n${e.code} : ${e}`);
			}

			let chats = [];
			data.data.posts.forEach((post) => {
				const user = post.created_by.name;
				const userLink = "https://myanimelist.net/profile/" + user;
				const avatar = post.created_by.forum_avator;
				const msg = this._parseBBCode(post.body);
				const timestamp = new Date(post.created_at).getTime();
				const postId = data.data.posts.indexOf(post) + 1;
				const postLink = `https://myanimelist.net/forum/?goto=post&topicid=${topic.mal_id}&id=${post.id}`;
				chats.push(new Chat(user, userLink, avatar, msg, timestamp, null, postId, postLink));
			});

			const discussion = new Discussion(topic.title, topic.url, chats);
			return discussion;
		},
		_parseBBCode(bbcode) {
			const mappings = [
				{ bbcode: /\[b\](.*?)\[\/b\]/g, html: "<strong>$1</strong>" },
				{ bbcode: /\[i\](.*?)\[\/i\]/g, html: "<em>$1</em>" },
				{ bbcode: /\[u\](.*?)\[\/u\]/g, html: "<u>$1</u>" },
				{ bbcode: /\[s\](.*?)\[\/s\]/g, html: "<s>$1</s>" },
				{ bbcode: /\[url=(.*?)\](.*?)\[\/url\]/g, html: '<a href="$1">$2</a>' },
				{ bbcode: /\[img.*?\](.*?)\[\/img\]/g, html: '<img src="$1" alt="">' },
				{ bbcode: /\[code\]([\s\S]*?)\[\/code\]/g, html: "<code>$1</code>" },
				{ bbcode: /\[quote\]/g, html: '<blockquote class="quote" style="font-size: 90%; border: 1px solid; padding: 5px;">' },
				{ bbcode: /\[quote=(.*?)\s*(message=\d+)?\]/g, html: '<blockquote class="quote" style="font-size: 90%; border: 1px solid; padding: 5px;"><h4>$1 Said:</h4>' },
				{ bbcode: /\[\/quote\]/g, html: '</blockquote>' },
				{ bbcode: /\[color=(.*?)\](.*?)\[\/color\]/g, html: '<span style="color: $1;">$2</span>' },
				{ bbcode: /\[size=(.*?)\](.*?)\[\/size\]/g, html: '<span style="font-size: $1;">$2</span>' },
				{ bbcode: /\[center\](.*?)\[\/center\]/g, html: '<div style="text-align: center;">$1</div>' },
				{ bbcode: /\[list\](.*?)\[\/list\]/g, html: "<ul>$1</ul>" },
				{ bbcode: /\[list=(.*?)\](.*?)\[\/list\]/g, html: '<ol start="$1">$2</ol>' },
				{ bbcode: /\[\*\](.*?)\[\/\*\]/g, html: "<li>$1</li>" },
				{ bbcode: /\[spoiler\]([\s\S]*?)\[\/spoiler\]/g, html: '<div class="spoiler"><input type="button" onclick="this.nextSibling.style.display=\'inline-block\';this.style.display=\'none\';" value="Show spoiler" style="display: inline-block;"><span class="spoiler_content" style="display: none;"><input type="button" onclick="this.parentNode.style.display=\'none\';this.parentNode.parentNode.childNodes[0].style.display=\'inline-block\';" value="Hide spoiler">$1</span></div>' },
				{ bbcode: /\[spoiler=(.*?)\]([\s\S]*?)\[\/spoiler\]/g, html: '<div class="spoiler"><input type="button" onclick="this.nextSibling.style.display=\'inline-block\';this.style.display=\'none\';" value="Show $1" style="display: inline-block;"><span class="spoiler_content" style="display: none;"><input type="button" onclick="this.parentNode.style.display=\'none\';this.parentNode.parentNode.childNodes[0].style.display=\'inline-block\';" value="Hide $1">$2</span></div>' },
				{ bbcode: /\[yt\](.*?)\[\/yt\]/g, html: '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>' },
				{ bbcode: /\[yt\](.*?)\?(start|end)=(\d+)\[\/yt\]/g, html: '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1?$2=$3" frameborder="0" allowfullscreen></iframe>' },
				{ bbcode: /\[yt\](.*?)\?start=(\d+)&end=(\d+)\[\/yt\]/g, html: '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1?start=$2&end=$3" frameborder="0" allowfullscreen></iframe>' },
				{ bbcode: /@(\S+)/g, html: '<a href="https://myanimelist.net/profile/$1" target="_blank">@$1</a>' },
			];
			let html = bbcode;
			for (const mapping of mappings) { html = html.replace(mapping.bbcode, mapping.html); }
			return html;
		}
	},
	{
		name: "Reddit",
		icon: "https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png",
		url: "https://www.reddit.com/",
		_clientId: "dbe5cec5a2f33fdda148a6014384b984",
		async getDiscussion(animeTitle, epNum) {
			let animeId, topic, url, response, posts;
			let headers = {headers: {'x-requested-with': 'XMLHttpRequest', 'origin': window.location.origin}};
			// get the anime's MAL id
			try {
				url = `https://api.jikan.moe/v4/anime?q=${animeTitle}&limit=1`;
				animeId = GM_getValue('cachedId_'+url, '');
				if (animeId == '') {
					response = await GM_fetch(url, headers);
					data = await response.json();
					if (data.data.length > 0) {
						animeId = data.data[0].mal_id;
						GM_setValue('cachedId_'+url, animeId);
					}
				}
			} catch (e) {
				throw new Error(`Couldn't find the anime id. Retry after a while or switch to another service.\n${e.code} : ${e.message}`);
			}
			// Get the discussion
			try {
				url = `https://api.reddit.com/r/anime/search.json?q=${animeTitle}+-+Episode+${epNum}+discussion+author:AutoLovepon&restrict_sr=on&include_over_18=on&sort=relevance&limit=50`;
				response = await axios.get(url);
				topic = response.data.data.children.find(it => it.data.title.includes(` - Episode ${epNum} discussion`) && it.data.selftext.includes(`[MyAnimeList](https://myanimelist.net/anime/${animeId}`))?.data;
			} catch (e) {
				throw new Error(`No discussion found. Retry after a while or switch to another service. (You are probably being rate limited)\n${e.code} : ${e.message}`);
			}
			// get the comments in the discussion
			try {
				url = topic.url.replace('www.reddit.com', 'api.reddit.com');
				response = await axios.get(url);
				posts = response.data[1].data.children;
				if (posts[0].data.author == "AutoModerator") posts.shift();	// skip the first bot post
			} catch (e) {
				throw new Error(`Error getting the discusssion. Retry after a while or switch to another service.\n${e.code} : ${e.message}`);
			}

			let chats = [];
			for (let post of posts) chats.push(this._processPost(post.data));

			const discussion = new Discussion(topic.title, topic.url, chats);
			return discussion;
		},
		_processPost(post) {
			const user = post.author;
			const userLink = "https://www.reddit.com/user/" + user;
			const avatar = axios.get(`https://api.reddit.com/user/${user}/about`).then(r=>r.data.data.icon_img.split('?')[0]);
			const msg = ((el) => { el.innerHTML = post.body_html; return el.value; })(document.createElement('textarea'));
			const timestamp = post.created_utc * 1000;
			let replies = [];
			if (post.replies && post.replies.data)
				for (let reply of post.replies.data.children)
					if(reply.data?.body_html) replies.push(this._processPost(reply.data));
			return new Chat(user, userLink, avatar, msg, timestamp, replies, post.id, "https://www.reddit.com"+post.permalink);
		}
	},
];

/***************************************************************
 * Classes for handling various data like settings & discussions
 ***************************************************************/
// User settings
class UserSettings {
	constructor(usernames = {}) {
		this.usernames = usernames;
	}
	static load() {
		return GM_getValue("userSettings", new UserSettings());
	}
}

// Class to hold each row of a discussion
class Chat {
	constructor(user, userLink, avatar, msg, timestamp, replies, id, link) {
		this.user = user;
		this.userLink = userLink;
		this.avatar = avatar;
		this.msg = msg;
		this.timestamp = timestamp;
		this.replies = replies;
		this.id = id;
		this.link = link;
	}

	getRelativeTime() {
		const now = new Date().getTime();
		const diff = now - this.timestamp;

		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const weeks = Math.floor(days / 7);
		const months = Math.floor(days / 30);
		const years = Math.floor(days / 365);

		if (years > 0) {
			return `${years} ${years === 1 ? "year" : "years"} ago`;
		} else if (months > 0) {
			return `${months} ${months === 1 ? "month" : "months"} ago`;
		} else if (weeks > 0) {
			return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
		} else if (days > 0) {
			return `${days} ${days === 1 ? "day" : "days"} ago`;
		} else if (hours > 0) {
			return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
		} else if (minutes > 0) {
			return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
		} else {
			return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`;
		}
	}
}

// Class to hold the complete discussions
class Discussion {
	constructor(title, link, chats) {
		this.title = title;
		this.link = link;
		this.chats = chats;
	}
}

/***************************************************************
 * The UI elements
 ***************************************************************/
// generate the discussion area
async function generateDiscussionArea() {
	document.querySelector("#AniCHAT")?.remove();	// Remove existing discussion area (if it exists)

	const discussionArea = document.createElement("div");
	discussionArea.id = "AniCHAT";
	discussionArea.className = "discussion-area";

	const discussionTitle = document.createElement("h3");
	discussionTitle.className = "discussion-title";

	const discussionTitleText = document.createElement("a");
	discussionTitleText.textContent = `${await site.getAnimeTitle()} Episode ${await site.getEpNum()} Discussion`;
	discussionTitleText.title = "Click to view the original discussion";
	discussionTitleText.target = "_blank";
	discussionTitle.appendChild(discussionTitleText);

	const serviceSwitcher = buildServiceSwitcher();
	discussionTitle.appendChild(serviceSwitcher);

	const discussionList = document.createElement("ul");
	discussionList.className = "discussion-list";

	discussionArea.appendChild(discussionTitle);
	discussionArea.appendChild(discussionList);

	return discussionArea;
}

function buildServiceSwitcher() {
	const servicesArea = document.createElement('div');
	servicesArea.id = 'service-switcher';
	servicesArea.innerHTML = `<img class="service-icon selected" title="Powered by ${service.name}" src="${service.icon}"><a style="padding-right:5px">▶</a>`;
	services.forEach(it => {
		servicesArea.innerHTML += `<img class="service-icon other" data-opt="${services.indexOf(it)}" title="Switch to ${it.name}" src="${it.icon}" style="cursor:pointer;">`;
	});
	servicesArea.querySelectorAll('.other').forEach(it => {
		it.addEventListener('click', () =>{
			const serviceOpt = parseInt(it.getAttribute('data-opt'));
			console.log(serviceOpt);
			GM_setValue("service", serviceOpt);
			service = services[serviceOpt];
			run();
		});
	});
	return servicesArea;
}

// build a row for a single chat in the discussion
async function buildChatRow(chat) {
	const chatRow = document.createElement("li");
	chatRow.className = "chat-row";

	const chatContent = document.createElement("div");
	chatContent.className = "chat-content";

	const userAvatar = document.createElement("div");
	userAvatar.className = "user-avatar";
	userAvatar.innerHTML = `<img src="${service.icon}" alt="${chat.user}">`;
	if (chat.avatar instanceof Promise) chat.avatar.then(avatarUrl => userAvatar.firstChild.src = avatarUrl);
    else userAvatar.firstChild.src = chat.avatar;

	const userMsg = document.createElement("div");
	userMsg.className = "user-msg";

	const name = document.createElement("a");
	name.className = "chat-name";
	name.textContent = chat.user;
	name.href = chat.userLink;
	name.target = "_blank";

	const time = document.createElement("span");
	time.className = "chat-time";
	time.textContent = chat.getRelativeTime();
	time.title = new Date(chat.timestamp).toLocaleString(undefined, {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});

	const msg = document.createElement("span");
	msg.className = "chat-msg";
	msg.innerHTML = chat.msg;

	const chatId = document.createElement("a");
	chatId.className = "chat-id";
	chatId.textContent = `#${chat.id}`;
	chatId.href = chat.link;
	chatId.target = "_blank";

	userMsg.appendChild(chatId);
	userMsg.appendChild(name);
	userMsg.appendChild(time);
	userMsg.appendChild(msg);
	chatContent.appendChild(userAvatar);
	chatContent.appendChild(userMsg);
	chatRow.appendChild(chatContent);

	if (chat.replies && chat.replies.length > 0) {
		const repliesDiv = document.createElement("div");
		repliesDiv.className = "reply";
		for (let reply of chat.replies) {
			const replyRow = await buildChatRow(reply);
			repliesDiv.appendChild(replyRow);
		}
		chatRow.appendChild(repliesDiv);
	}

	return chatRow;
}

// Show countdown for loading the discussion.
function showLoading(timeout = TIMEOUT, onComplete) {
	const loadingArea = document.createElement("div");
	loadingArea.className = "loading-anichat";

	// Loading UI elements
	const loadingElement = document.createElement("div");
	loadingElement.innerHTML = `<img src="https://flyclipart.com/thumb2/explosion-gif-transparent-transparent-gif-sticker-741584.png" style="width: 150px; margin-right: 10px;">`;
	loadingElement.style.cssText = `display: flex; align-items: center;`;

	const progressBar = document.createElement("div");
	progressBar.className = "progress-bar";
	progressBar.style.cssText = `width: 100%; height: 10px; background-color: #ccc; position: relative; margin-bottom: 10px;`;

	const progressFill = document.createElement("div");
	progressFill.className = "progress-fill";
	progressFill.style.cssText = `width: 0%; height: 100%; background-color: #4CAF50; position: absolute; top: 0; left: 0; transition: width 0.1s linear;`;

	const message = document.createElement("span");
	message.textContent = `This ${timeout / 1000} secs timeout is set to reduce the load on the service`;
	message.style.cssText = "font-size: 14px; color: darkgrey;";

	const skipButton = document.createElement("button");
	skipButton.textContent = "Skip Waiting";
	skipButton.style.cssText = `background: #4CAF50; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: transform 0.2s ease; margin-top: 10px; align-self: start;`;
	skipButton.onmouseover = () => skipButton.style.transform = 'scale(1.1)';
	skipButton.onmouseout = () => skipButton.style.transform = 'scale(1)';

	const colDiv = document.createElement("div");
	colDiv.style.cssText = "display: flex; flex-direction: column; align-items: center;";
	colDiv.appendChild(message);
	colDiv.appendChild(skipButton);

	// Assemble UI
	progressBar.appendChild(progressFill);
	loadingElement.appendChild(colDiv);
	loadingArea.appendChild(loadingElement);
	loadingArea.appendChild(progressBar);

	// Loading logic
	let countdown = timeout;
	let skipRequested = false;

	const countdownInterval = setInterval(() => {
		if (!skipRequested) {
			countdown -= 100;
			progressFill.style.width = `${100 - (countdown / timeout) * 100}%`;
			if (countdown <= 0) complete();
		}
	}, 100);

	function complete() {
		clearInterval(countdownInterval);
		message.textContent = "Hold on tight~ The discussions are being loaded..."
		onComplete();
	}

	skipButton.onclick = () => {
		skipRequested = true;
		skipButton.remove();
		progressFill.style.width = '100%';
		complete();
	};
	if (!(document.body.isFirstLoad??true)) skipButton.click();	// Skip the loading timeout if not first load

	return loadingArea;
}

// Add CSS styles to the page
const styles = `
	.discussion-area {
		border-radius: 10px;
		padding: 10px;
	}

	.discussion-title {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.discussion-title > a {
		margin-right: 20px;
	}

	.service-icon {
		height: 25px;
		padding-right: 10px;
	}

	#service-switcher {
		width: 7%;
		transition: width 0.3s ease-in-out;
		overflow: hidden;
		display: flex;
	}
	#service-switcher:hover {
		width: ${8+5*services.length}%;
	}

	ul.discussion-list {
		overflow: auto;
		max-height: 90vh;
	}

	.chat-row {
		display: flex;
		flex-direction: column;
		padding: 10px 0;
		border-top: 1px solid #eee;
	}

	.chat-content {
		display: flex;
		flex-direction: row;
	}

	.chat-row > .reply {
		display: flex;
		flex-direction: column;
		padding-left: 55px;
		border-left: 0.7px solid #eee;
	}

	.user-avatar {
		width: 55px;
		height: 55px;
		margin-right: 10px;
	}

	.user-avatar > img {
		width: 55px;
		height: 55px;
		object-fit: cover;
		border-radius: 15px;
	}

	.user-msg {
		display: flex;
		width: 100%;
    	flex-direction: column;
	}

	.chat-id {
		margin-bottom: -20px;
		font-size: 16px;
		align-self: end;
		color: grey !important;
		opacity: 0.3;
		transition: opacity 0.2s;
	}
	.chat-id:hover {
		opacity: 1;
	}

	.chat-name {
		font-weight: bold;
		font-size: 15px;
    	align-self: start;
	}

	.chat-time {
		font-size: 12px;
		font-weight: bold;
		padding-top: 5px;
		color: darkgrey;
	}

	.chat-msg {
		padding: 10px 0;
	}

	.chat-msg img {
		max-width: 100%;
	}

	.error-message {
		color: red;
		white-space: pre-wrap;
	}
`;

/***************************************************************
 * Initialize all data and setup menu commands
 ***************************************************************/
// User settings
let userSettings = UserSettings.load();

// Site instance
let site = getCurrentSite();

// Service instance
let service = services[GM_getValue("service", 0)];

/***************************************************************
 * Functions for working of the script
 ***************************************************************/
// Returns a promise of the given element. Resolves when the element is found in the DOM.
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
			let elm = document.querySelector(selector);
			// console.log(`Element Found!!: ${elm.textContent}`);
            return resolve(elm);
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
				let elm = document.querySelector(selector);
              	// console.log(`Element Detected!: ${elm.textContent}`);
                resolve(elm);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// Get the current website based on the URL
function getCurrentSite() {
	const currentUrl = window.location.href.toLowerCase();
	return animeSites.find((website) => website.url.some((site) => currentUrl.includes(site)));
}

// Use IntersectionObserver to call the callback when the element is in view
function withIntersectionObserver(element, callback) {
	new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				callback();
				observer.disconnect();
			}
		});
	}, { threshold: 0.1 }).observe(element);
	if(!callback) return new Promise(r => callback=r);
}

// Run the script
async function run() {
    console.info(`Running AniCHAT on ${site.name}...`);
    const discussionArea = await generateDiscussionArea();

    // Add to page using fallback selectors
    const selectors = [
        { selector: () => site.chatArea && typeof site.chatArea === "string" ? document.querySelector(site.chatArea) : site.chatArea(), prepend: false },
        { selector: () => document.querySelector('#main > .container'), prepend: false },
        { selector: () => document.querySelector('#footer'), prepend: true },
        { selector: () => document.querySelector('footer'), prepend: true },
        { selector: () => document.body, prepend: false },
    ];
    for (let {selector, prepend} of selectors) {
        try {
            const element = selector();
            prepend ? element.prepend(discussionArea) : element.appendChild(discussionArea);
            break;
        } catch (error) { continue; }
    }

    // Add styles
    const styleElement = document.createElement("style");
    styleElement.textContent = styles + (site.styles || '');
    discussionArea.append(styleElement);

    // Loading and discussion loading logic
    const loadDiscussion = async () => {
		document.body.isFirstLoad = false;	// A flag to disable loading timeout on subsequent loads
        try {
            const discussion = await service.getDiscussion(await site.getAnimeTitle(), await site.getEpNum());
            discussion.chats.forEach(async chat => {
                discussionArea.querySelector("ul").appendChild(await buildChatRow(chat));
            });
            discussionArea.querySelector(".discussion-title a").href = discussion.link;
            discussionArea.querySelector(".discussion-title a").textContent = discussion.title;
        } catch (error) {
            console.error(error);
            const errorElement = document.createElement("span");
            errorElement.className = "error-message";
            errorElement.textContent = `AniCHAT:\n${error.stack}\n\nCheck the console logs for more detail.`;
            discussionArea.appendChild(errorElement);
        } finally {
			document.querySelector(".loading-anichat")?.remove();
		}
    };

    // Initial loading with timeout
    discussionArea.appendChild(showLoading(TIMEOUT, () => {
        withIntersectionObserver(discussionArea, loadDiscussion);
    }));
}

// Workaround for SPA sites like Miruro for which the script doesn't auto reload on navigation
function initScript() {
	const initDelay = site.initDelay || 0;
    setTimeout(run, initDelay);

    // Handle SPA navigation
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            console.log('URL changed, re-running AniCHAT');
			setTimeout(run, initDelay);
        }
    }).observe(document.querySelector('body'), { subtree: true, childList: true });
}

try {
	initScript();
} catch (e) {
	console.error(`${e.message}\n\n${e.stack}`);
}
