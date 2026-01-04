// ==UserScript==
// @name         gamedev.ru - better youtube
// @namespace    gamedev.ru
// @description  better youtube
// @version      0.4
// @author       entryway
// @include      /^https?:\/\/(www.)?gamedev\.ru\/.*$/
// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/465053/gamedevru%20-%20better%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/465053/gamedevru%20-%20better%20youtube.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function() {
	'use strict';

	const settings = {
		// https://console.developers.google.com/
		youtube_api_key: 'xxx-xxx-xxx',
	};

	if (['interactive', 'complete'].includes(document.readyState)) {
		jsStuff();
	} else {
		addEventListener('DOMContentLoaded', jsStuff);
	}

	function jsStuff() {
		betterYoutube(settings.youtube_api_key);
	}

	function betterYoutube(YOUTUBE_API_KEY) {
		/**
		 * @typedef {Object} YoutubeItem
		 * @property {string} id
		 * @property {string} snippet.title
		 * @property {string} snippet.channelId
		 * @property {string} snippet.channelTitle
		 * @property {string} snippet.publishedAt
		 * @property {string} snippet.thumbnails
		 * @property {string} snippet.description
		 * @property {number} statistics.viewCount
		 * @property {string} contentDetails.duration
		 * @property {string} contentDetails.regionRestriction
		 */

		/**
		 * @typedef {Object} YoutubeComment
		 * @property {string} nextPageToken
		 * @property {string} items.snippet.topLevelComment.snippet.publishedAt
		 * @property {string} items.snippet.topLevelComment.snippet.authorDisplayName
		 * @property {string} items.snippet.topLevelComment.snippet.textDisplay
		 */

		function queryParams(params) {
			return Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
		}

		function formatDuration(duration) {
			let time = [];
			const matches = /^PT((?<h>\d+)H)?((?<m>\d+)M)?((?<s>\d+)S)?$/.exec(duration);
			if (matches !== null) {
				if (matches.groups.h) {
					time.push(matches.groups.h);
				}
				let minutes = matches.groups.m ?? '0';
				if (matches.groups.m) {
					minutes = minutes.padStart(2, '0');
				}
				time.push(minutes);
				time.push((matches.groups.s ?? '0').padStart(2, '0'));
			}
			return time.join(':').trim();
		}

		function formatCount(count) {
			return new Intl.NumberFormat('en-US', {
				maximumFractionDigits: 1,
				notation: 'compact',
				compactDisplay: 'short',
			}).format(count);
		}

		function formatDate(date) {
			const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
			const units = {
				year  : 24 * 60 * 60 * 1000 * 365,
				month : 24 * 60 * 60 * 1000 * 365/12,
				day   : 24 * 60 * 60 * 1000,
				hour  : 60 * 60 * 1000,
				minute: 60 * 1000,
				second: 1000
			};
			const elapsed = date - new Date();
			for (const u in units) {
				if (Math.abs(elapsed) > units[u] || u === 'second') {
					return rtf.format(Math.round(elapsed/units[u]), u);
				}
			}
		}

		function posterOnClickHandler(id, unique_poster_id, url){
			const poster = document.getElementById(unique_poster_id);
			poster.addEventListener('click', (e) => {
				if(document.getElementById(`${'title_' + id}`).contains(e.target)){
					e.stopPropagation();
					return;
				}
				const yt = document.createElement('iframe');
				yt.className = 'yt_iframe';
				yt.src = url;// + (params ? '&' : '?') + 'rel=0&autoplay=1';
				yt.setAttribute('allowFullScreen', '');
				poster.replaceWith(yt);
			});
		}

		async function queryInfo(id_array_chunk){
			const api_url = 'https://www.googleapis.com/youtube/v3';
			const params = {
				key: YOUTUBE_API_KEY,
				id: id_array_chunk.join(','),
				part: 'snippet,statistics,contentDetails',
				//part: 'contentDetails,id,localizations,player,snippet,statistics,status,topicDetails'
				fields: 'items(id,snippet(title,channelId,channelTitle,publishedAt,thumbnails,description),statistics,contentDetails(duration,regionRestriction))',
			};
			const info_url = `${api_url}/videos?${queryParams(params)}`;
			var response = await fetch(info_url);
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response.json();
		}

		function setDescription(item){
			for (const div of document.querySelectorAll('#description_' + item.id)) {
				div.innerText = item.snippet.description;
			}
		}

		function setDuration(item){
			const duration = formatDuration(item.contentDetails.duration);
			for (const div_duration of document.querySelectorAll('#duration_' + item.id)) {
				div_duration.innerHTML = `<div style="padding:2px 4px;">${duration}</div>`;
			}
		}

		function setTitle(item){
			for (const div_title of document.querySelectorAll('#title_' + item.id)) {
				const viewCount = formatCount(item.statistics.viewCount);
				const viewCountStr = viewCount + (viewCount === '1' ? ' view' : ' views');

				let div_hint = Object.assign({}, item);
				delete div_hint.snippet.thumbnails;
				delete div_hint.snippet.description;
				div_title.title = JSON.stringify(div_hint, null, '\t');
				div_title.dataset.info = div_title.title;

				const publishedAt = new Intl.DateTimeFormat('en-US', {
					day: '2-digit',
					month: 'long',
					year: 'numeric',
				}).format(new Date(item.snippet.publishedAt));

				div_title.innerHTML = `
					<div style="padding:2px 4px;">
					<div>${item.snippet.title}
					<div>
						<div style="font-size:70%">
							<a dir="auto" style="color:inherit;overflow-wrap:anywhere;" href="https://www.youtube.com/channel/${item.snippet.channelId}">${item.snippet.channelTitle}</a>
							• ${viewCountStr}
							• ${publishedAt}
						</div>
					</div>
				`;
			}
		}

		async function fetchYoutubeComments(video_id, max_results, page_token) {
			const api_url = 'https://www.googleapis.com/youtube/v3';
			let params = {
				key: YOUTUBE_API_KEY,
				videoId: video_id,
				textFormat: 'plainText',
				part: 'snippet',
				order: 'relevance',
				fields: 'nextPageToken,items(snippet(topLevelComment(snippet(publishedAt,authorDisplayName,textDisplay))))',
				maxResults: max_results,
			};
			if (page_token) {
				params.pageToken = page_token;
			}

			const url = `${api_url}/commentThreads?${queryParams(params)}`;
			const response = await fetch(url);
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response.json();
		}

		async function getYoutubeCommentsHtml(video_id, max_results, page_token) {
			const data = await fetchYoutubeComments(video_id, max_results, page_token);
			const comments = data.items.map(item => {
				const snippet = item.snippet.topLevelComment.snippet;
				const relativeDate = formatDate(+new Date(snippet.publishedAt));
				return `<div><b>${snippet.authorDisplayName}</b><span style="font-size:smaller">, ${relativeDate}</span></div><div>${snippet.textDisplay}</div><p></p>`;
			});
			if (data.nextPageToken) {
				const next = `<a href="javascript:void(0)" onclick="youtubeNextComments(this, '${video_id}', ${max_results}, '${data.nextPageToken}')">more...</a>`;
				comments.push(next);
			}
			return comments.join('');
		}

		function getYoutubeReplacerHtml(id, unique_poster_id){
			return `
				<table class="my_yt"><tr>
				<td>
					<div class="yt_poster_container" id="${unique_poster_id}">
						<img class="yt_poster" id="${'poster_' + id}" alt="" src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" onload="youtubeReplacerOnLoad(this, '${id}')">
						<div class="yt_title" id="${'title_' + id}"></div>
						<div class="yt_duration" id="${'duration_' + id}"></div>
					</div>
				<td>&nbsp;
				<td style="width:100%">
					<div class="yt_comment">
						<div id="${'comments_' + id}"></div>
						<hr>
						<div id="${'description_' + id}"></div>
					</div>
				</tr></table>
			`;
		}

		function youtubeReplacerOnLoadHandler(){
			window.youtubeReplacerOnLoad = function(img, id) {
				img.onload = null;
				if (img.naturalWidth < 1280) {
					img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
				}
			};
		}

		function youtubeNextCommentsHandler(){
			window.youtubeNextComments = async function(a, video_id, max_results, page_token) {
				const comments = await getYoutubeCommentsHtml(video_id, max_results, page_token);
				const div = document.createElement('div');
				div.innerHTML = comments;
				a.replaceWith(div);
			};
		}

		function fetchNextCommentsHandler(id_array){
			id_array.forEach(async (video_id) => {
				const max_results = 25;
				try {
					const comments = `<a href="javascript:void(0)" onclick="youtubeNextComments(this, '${video_id}', ${max_results}, null)">load comments</a>`;
					for (const div of document.querySelectorAll('#comments_' + video_id)) {
						div.innerHTML = comments;
					}
				} catch (err) {
					console.log(err);
				}
			});
		}

		async function processYoutubeVideos(id_array){
			if (YOUTUBE_API_KEY && id_array.length > 0) {
				const id_array_copy = [...id_array];
				while (id_array_copy.length) {
					const id_array_chunk = id_array_copy.splice(0, 50);
					let data = await queryInfo(id_array_chunk);
					if (data.items) {
						data.items.forEach(item => {
							setDescription(item);
							setDuration(item);
							setTitle(item);
						});
					}
				}
				youtubeNextCommentsHandler();
				fetchNextCommentsHandler(id_array);
			}
		}

		function youtubeReplacer(container, id, params) {
			id_array.push(id);

			const div = document.createElement('div');
			const unique_poster_id = 'poster_' + id + '_' + id_array.length;
			div.innerHTML = getYoutubeReplacerHtml(id, unique_poster_id);
			container.replaceWith(div);

			params = params.replace(/^[?&]+/, '');
			const url = `//www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1&${params}`;
			posterOnClickHandler(id, unique_poster_id, url);
		}

		function replaceLinks(){
			[
				{selector: 'a[href^="https://www.youtube.com/watch"]', getId: url=>url.searchParams.get('v')},
				{selector: 'a[href^="https://m.youtube.com/watch"]', getId: url=>url.searchParams.get('v')},
				{selector: 'a[href^="https://youtu.be/"]', getId: url=>url.pathname.replace(/^\//, '')},
				{selector: 'a[href^="https://youtube.com/shorts/"]', getId: url=>url.pathname.replace(/^\/shorts\//, '')},
				{selector: 'a[href^="https://www.youtube.com/shorts/"]', getId: url=>url.pathname.replace(/^\/shorts\//, '')},
			].forEach(function({selector, getId}){
				document.querySelectorAll(selector).forEach(function(a){
					const url = new URL(a.href);
					const id = getId(url);
					const m = a.href.match(/[#?&]t=(\d+)/);
					const params = (m ? 'start=' + m[1] : '');
					const div = document.createElement('div');
					a.parentNode.insertBefore(div, a.nextSibling);
					youtubeReplacer(div, id, params);
				});
			});
		}

		function replaceIframes(){
			[
				['iframe[src*=youtube]', /^.+?\/embed\/([^?&]+)(.*)$/],
				['embed[src*=youtube]', /^.+?\/v\/([^?&]+)(.*)$/],
			].forEach(([selector, regexp]) => {
				for (const iframe of document.querySelectorAll(selector)) {
					const m = iframe.src.match(regexp);
					if (m) {
						youtubeReplacer(iframe, m[1], m[2]);
					}
				}
			});
		}

		function replaceInternalYoutube(){
			for (const div_yt of document.querySelectorAll('div.youtube')) {
				if ('value' in div_yt.dataset) {
					const m = div_yt.dataset.value.match(/^([^?&]+)(.*)$/);
					if (m) {
						youtubeReplacer(div_yt, m[1], m[2]);
					}
				}
			}
		}

		function addCss(){
			/** @lang CSS */
			const css = `
				div.youtube_container {
					max-width: none !important;
				}
				.my_yt .yt_poster_container {
					position: relative;
					width: 640px;
				}
				.my_yt .yt_iframe {
					width: 640px;
					height: 360px;
					border: 0;
					max-width: none !important;
				}
				.my_yt .yt_poster {
					width: 640px;
					height: 360px;
				}
				.my_yt .yt_title {
					position: absolute;
					left: 4px;
					top: 2px;
					background-color: rgba(0,0,0,0.5);
					color: white;
					border-radius: 2px;
				}
				.my_yt .yt_duration {
					position: absolute;
					right: 4px;
					bottom: 6px;
					background-color: black;
					color: white;
					border-radius: 2px;
				}
				.my_yt .yt_comment {
					font-size: 10px;
					color: #808080;
					overflow-wrap: anywhere;
					height: 360px;
					overflow-y: auto;
				}
			`;

			const style = document.createElement('style');
			style.innerHTML = css;
			document.head.appendChild(style);
		}

		var id_array = [];

		addCss();
		youtubeReplacerOnLoadHandler();
		replaceLinks();
		replaceIframes();
		replaceInternalYoutube();
		processYoutubeVideos(id_array).then();
	}
})();
