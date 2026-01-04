// ==UserScript==
// @name        browndust2.com news viewer
// @namespace   Violentmonkey Scripts
// @match       https://www.browndust2.com/robots.txt
// @grant       none
// @version     1.6.2
// @author      Rplus
// @description custom news viewer for sucking browndust2.com
// @require     https://unpkg.com/localforage@1.10.0/dist/localforage.min.js#sha384-MTDrIlFOzEqpmOxY6UIA/1Zkh0a64UlmJ6R0UrZXqXCPx99siPGi8EmtQjIeCcTH
// @require     https://unpkg.com/marked@16.1.2/lib/marked.umd.js#sha256-XF49G0iwZLps3m+Jg99uZv4DSzMQYF1NxTXcT0XXjmU=
// @require     https://unpkg.com/dompurify@1.0.8/dist/purify.min.js#sha256-WGpUzZ0j5KVvf7ufGyKpoVoWxa4B5dpoMFYoZh2+ndk=
// @@run-at     document-end
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/512750/browndust2com%20news%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/512750/browndust2com%20news%20viewer.meta.js
// ==/UserScript==

document.head.insertAdjacentHTML(
	'beforeend',
	`<link rel="icon" type="image/png" sizes="16x16" href="/img/seo/favicon.png">`
);

document.body.innerHTML = `
<form id="filterform">
	Filter
	<input type="search" name="q" tabindex="1" id="searchinput">
	<style id="filter_style"></style>
</form>

<div class="list" id="list" data-query=""></div>
<hr>
<input type="reset" value="Delete all cached data" id="delete_btn">

<select id="lang_select"></select>

<label class="showall-label">
	<input type="checkbox" class="showall" >
	show all list
</label>

<style>
*, *::before, *::after {
	box-sizing: border-box;
}
body {
	max-width: 1200px;
	margin: 0 auto;
	background-color: #e5cc9c;
	color: #111;
}

img {
	max-width: 100%;
}

h2 {
	display: inline;
	font-size: inherit;
	margin: 0;

	& span {
		font-weight: 400;
		font-size: smaller;
		vertical-align: middle;
		opacity: .5;
	}
}
@media (max-width:750px) {
	details summary {
		text-indent: -1.1em;
		padding-left: 1.5rem;
		padding: .8em .5em .5em 1.5em;

		&::marker {
			_font-size: smaller;
		}
	}
	h2 {
		position: relative;
	}
	h2 span {
		position: absolute;
		left: 1.2rem;
		bottom: 100%;
		font-size: 11px;
		opacity: .4;
	}
}

.ctx {
	background-color: #fff9;
	padding: 1em;

	p {
		white-space: pre-wrap;
	}

	& [style*="background-color"],
	& [style*="font-size"],
	& [style*="font-family"] {
		font-size: inherit !important;
		font-family: inherit !important;
		background-color: unset !important;
	}
}

.list {
	list-style: none;
	margin: 2em 0;
	padding-left: 50px;
}

summary {
	position: relative;
	top: 0;
	background-color: #dfb991;
	min-height: 50px;
	cursor: pointer;
	padding: .5em;
	place-content: center;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background-color: #fff1;
		pointer-events: none;
		opacity: 0;
		transition: opacity .1s;
	}

	:target & {
		box-shadow: inset 0 -.5em #0003;
	}

	&:hover::before {
		opacity: 1;
	}

	& > img {
		position: absolute;
		top: 0;
		right: 100%;
		width: 50px;
		height: 50px;
	}
}

summary a {
	color: inherit;
	text-decoration: none;
	pointer-events: none;

	&:visited {
		color: #633;
	}
}

details {
	margin-block-start: 1em;

	&[open] summary {
		position: sticky;
		background-color: #ceac71;
		box-shadow: inset 0 -.5em #0003;
	}
}

#filterform {
	position: fixed;
	top: 0;
	left: 0;
	transition: opacity .2s;
	opacity: .1;

	&:hover,
	&:focus,
	&:focus-within {
		opacity: 1;
	}
}

body:not(:has(.showall:checked))
	.list[data-query=""]
		details:nth-child(n + 20) {
	display: none;
}

.showall-label {
	position: sticky;
	bottom: 0;
	display: block;
	width: fit-content;
	margin: 0 1em 0 auto;
	padding: .25em 1em .25em .5em;
	background-color: #0002;
	border-radius: 1em 1em 0 0;
	cursor: pointer;
}
</style>
`;

let data = [];
let news_map = new Map();
let query_arr = [];
let id_arr = [];
const lang_map = {
	'en-us': {
		full: 'en-us',
		fn: 'en',
	},
	'zh-tw': {
		full: 'zh-tw',
		fn: 'tw',
	},
	'zh-cn': {
		full: 'zh-cn',
		fn: 'cn',
	},
	'ja-jp': {
		full: 'ja-jp',
		fn: 'jp',
	},
	'ko-kr': {
		full: 'ko-kr',
		fn: 'kr',
	},
};
let lang = get_lang();

function render(id) {
	list.innerHTML = data.map(i => {
		let info = i.attributes;
		// let ctx = info.NewContent || info.content;
		let time = format_time(info.publishedAt);
		return `
			<details name="item" data-id="${i.id}" id="news-${i.id}">
				<summary>
					<img src="https://www.browndust2.com/img/newsDetail/tag-${info.tag}.png" width="36" height="36" alt="${info.tag}" title="#${info.tag}">
					<h2>
						<span>
							#${i.id} -
							<time datetime="${info.publishedAt}" title="${info.publishedAt}">${time}</time>
						</span>
						<a href="?id=${i.id}#news-${i.id}" tabindex="-1">${info.subject}</a>
					</h2>
				</summary>
				<article class="ctx"></article>
			</details>
		`;
	}).join('');

	list.querySelectorAll('details').forEach(d => {
		d.addEventListener('toggle', show);
	});

	list.addEventListener('click', (e) => {
		if (e.target.tagName === 'A' && (e.target.tabIndex === -1)) {
			e.preventDefault();
			console.log(123, e.target, e.target.href);
			history.pushState('', null, e.target.href);
		}
	});

	if (id) {
		auto_show(id);
	}
}

function auto_show(id) {
	let target = list.querySelector(`details[data-id="${id}"]`);
	if (target) {
		target.open = true;
		show({ target, });
	}
}

function show({ target, }) {
	if (!target.open) {
		target.scrollIntoView({behavior:'smooth', block: 'nearest'});
		return;
	}

	let id = +target.dataset.id;
	let ctx = target.querySelector(':scope > article.ctx');


	// target.scrollIntoView({behavior:'smooth', block: 'nearest'});
	let info = news_map.get(id)?.attributes;
	location.hash = `news-${id}`;
	history.pushState(`news-${id}`, null, `?id=${id}#news-${id}`);
	document.title = `#${id} - ${info.subject}`;

	if (!ctx || ctx.dataset?.init === '1' || !id) {
		return;
	}
	ctx.dataset.init = '1';

	let ori_link = `<a href="https://www.browndust2.com/${lang.full}/news/view?id=${id}" target="_bd2news" title="official link">#</a>`;
	if (!info) {
		ctx.innerHTML = ori_link;
		return;
	}

	let content = (info.NewContent || info.content);
	content = content.replace(/\<img\s/g, '<img loading="lazy" ');
	ctx.innerHTML = DOMPurify.sanitize(marked.parse(content + ori_link));
}

function format_time(time) {
	let _time = time ? new Date(time) : new Date();
	return _time.toLocaleString('zh-TW', {
		weekday: 'narrow',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
}

function query_kwd() {
	// console.time('query');
	let value = searchinput.value?.trim()?.toLowerCase();
	// console.log('query', value);
	if (!value) {
		filter_style.textContent = '';
		list.dataset.query = '';
		return;
	}

	let matched_ids = query_arr.map((i, index) => {
		let regex = new RegExp(value);
		return regex.test(i) ? id_arr[index] : null;
	})
	.filter(Boolean);

	if (matched_ids.length) {
		list.dataset.query = value;
	} else {
		list.dataset.query = '';
	}

	let selectors = matched_ids.map(i => `details[data-id="${i}"]`).join();
	filter_style.textContent = `
		details {display:none;}
		${selectors} { display: block; }
	`;
	// console.timeEnd('query');
}

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore?tab=readme-ov-file#_debounce
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		clearTimeout(timeout);
		if (immediate && !timeout) func.apply(context, args);
		timeout = setTimeout(function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
	};
}

function get_lang() {
	let matched_langs = [
		new URL(location.href)?.searchParams?.get('lang') || '',
		localStorage.getItem('lang') || '',
		navigator.language.toLowerCase() || '',
		...(navigator.languages?.map(s => s.toLowerCase()) || [])
	]
	.filter(i => lang_map[i]);
	return lang_map[matched_langs[0]] || lang_map['zh-tw'];
}

let data_url = `https://www.browndust2.com/api/newsData_${lang.fn}.json?${+new Date()}`;
if (window.test_data_url) {
	data_url = window.test_data_url;
}

async function get_data() {
	try {
		let cached_etag = await localforage.getItem(`etag-${lang.fn}`) || '';
		let response = await fetch(data_url, {
			method: 'GET',
			cache: 'no-store',
			headers: {
				'If-None-Match': cached_etag,
			}
		});
		let new_etag = response.headers.get('etag');

		console.log(response);
		console.log({cached_etag, new_etag});

		if (response.status === 304) { // cached
			return await localforage.getItem(`data-${lang.fn}`);
		} else if (!response.ok) {
			throw new Error('fetch error', response);
		}

		let json = await response.json();
		let _data = json.data.reverse();
		localforage.setItem(`etag-${lang.fn}`, new_etag);
		localforage.setItem(`data-${lang.fn}`, _data);
		return _data;
	} catch(e) {
		throw new Error(e);
	}
}

async function init() {
	let qs_lang = new URL(location.href)?.searchParams?.get('lang') || '';
	if (qs_lang) {
		localStorage.setItem('lang', qs_lang);
	}
	lang_select.innerHTML = Object.values(lang_map).map(i => `<option value="${i.full}" ${i.full === lang.full ? 'selected' : ''}>${i.full}</option>`).join('');

	list.innerHTML = 'loading...';
	data = await get_data();
	console.log({data});
	data.forEach(i => {
		let info = i.attributes;
		let string = [
			i.id,
			info.content,
			info.NewContent,
			`#${info.tag}`,
			info.subject,
		].join().toLowerCase();

		id_arr.push(i.id);
		news_map.set(i.id, i);
		query_arr.push(string);
	});

	let id = new URL(location.href)?.searchParams?.get('id') || data[data.length - 1].id;
	render(id);

}

init();

lang_select.addEventListener('change', e => {
	let url = new URL(location.href);
	url.searchParams.set('lang', e.target.value)
	location.search = url.search;
});
filterform.addEventListener('submit', e => e.preventDefault());
searchinput.addEventListener('input', debounce(query_kwd, 300));
delete_btn.addEventListener('click', () => {
	localforage.clear();
	location.reload();
});
