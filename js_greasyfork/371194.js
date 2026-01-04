// ==UserScript==
// @name        MTurk Forum Tools
// @version     0.1.7
// @description A suite of tools to make browsing MTurk forums for HITs easier.
// @author      parseHex
// @namespace   https://greasyfork.org/users/8394
// @match       http*://www.mturkcrowd.com/threads/*
// @match       http*://forum.turkerview.com/threads/*
// @match       http*://turkernation.com/showthread.php?*
// @match       http*://mturkforum.com/index.php?threads/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_notification
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/371194/MTurk%20Forum%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/371194/MTurk%20Forum%20Tools.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const navSelectors = [
		'.crumbs .crust span', // turkerhub / mturkcrowd
		'.navbit a', // turkernation
		'a.crumb', // mturkforum
	].join(',');
	const dailyForumRegex = /(daily)|(great).+(hits)|(threads)/i;

	function forumInit() {
		const navs = document.querySelectorAll(navSelectors);

		let isWorkThread = false;
		for (let i = 0; i < navs.length; i++) {
			if (dailyForumRegex.test(navs[i].textContent)) {
				isWorkThread = true;
				break;
			}
		}

		return isWorkThread;
	}

	var constants = {
		panelID: 'mturk-forum-script-tools',
		closeBtnID: 'mturk-forum-script-tools-close',
	};

	const turkerhub = {
		'permalink': 'a.datePermalink',
		'msg': 'blockquote.messageText',
		'quoteContainer': '.bbCodeBlock.bbCodeQuote',
		'quote': 'blockquote.quoteContainer, .quote',
		'datetime': '.DateTime',
		'datetimeProp': 'title',
		'post': 'ol.messageList > li.message',
		'table': 'table.ctaBbcodeTable',
	};
	const turkernation = {
		'permalink': 'a.postcounter',
		'msg': 'blockquote.postcontent',
		'quoteContainer': '.bbcode_container',
		'quote': 'div.bbcode_container',
		'datetime': '.date',
		'datetimeProp': 'innerText',
		'post': 'ol#posts > li.postcontainer',
		'table': '' //TODO what was this for?
	};

	const siteSelectors = {
		'forum.turkerview.com': turkerhub,
		'www.mturkcrowd.com': Object.assign({}, turkerhub, {
			'link': '.discussionListItems > .discussionListItem .main .title a'
		}),
		'turkernation.com': turkernation,
		'mturkforum.com': Object.assign({}, turkerhub),
	};

	let host = window.location.host;
	if (window.location.hostname === 'localhost') {
		host = window.location.pathname.match(/\/([\w.]+)\//)[1];
	}

	var constants$1 = {
		hitHrefSelector: 'a[href*="mturk.com/mturk/preview"]',
		reqHrefSelector: 'a[href*="mturk.com/requesters/"]',
		idRegex: /mturk\.com\/projects\/([A-Z0-9]{30})/,
		rIdRegex: /mturk\.com\/requesters\/([\w\d]{13,14})/,
		qualRegex: /^(?:qualifications|requirements)(?:\:|\s?-\s?)(.*)/im,
		minusQualRegex: /([\W\D\S]*)(?:qualifications|requirements)(?:\:|\s?-\s?|)/im,
		timeRegex: /^(?:time|duration)(?:\:|\s?-\s?)(.*)/im,
		payRegex: /^(?:reward|pay)(?:\:|\s?-\s?)(.*)/im,
		payRegexBackup: /^\$([\d.]+)/im,
		availRegex: /^(?:hits) ?available(?:\:|\s?-\s?)(.*)/im,
		descRegex: /description(?:\:|\s?-\s?)(?!.*not available)(.*)/im,
		selectors: siteSelectors[host],

		containerID: 'stats-container',
		apprInputID: 'hits-approved-input',
		rateInputID: 'approval-rate-input',
		onlyQualifiedID: 'only-qualified-input',
		minFreshnessID: 'min-freshness-input',
		minPayID: 'min-pay-input',

		tvTitleRegex: /(.+) - \$\d+\.\d+/,
		freshness: {
			ROTTEN: 0,
			SMELLY: 1,
			EDIBLE: 2,
			FRESH: 3,
		},
	};

	var HITBoxCSS = `
	.hit-box {
		padding: 10px;
		margin: 5px 0;
		font-size: 1.05em;
		box-sizing: border-box;
		border: 2px solid #0D47A1;
		text-align: center;
		max-width: 95%;
    min-width: 80%;
	}
	.hit-box.not-qualified {
		background-color: #ff8e9a !important;
	}
	.hit-box.fresh {
		background-color: #effff0;
	}
	.hit-box.edible {
		background-color: #fffae5;
	}
	.hit-box.smelly {
		background-color: #ffe8d1;
	}
	.hit-box.rotten {
		background-color: #ffebea;
	}
	.hit-box > .item {
		display: inline-block;
		padding: 0 10px;
	}
	.hit-box > .item:not(:only-child):not(:last-child):not(.hit-title) {
		border-right: 1px solid #0D47A1;
	}
	.hit-box > .item.hit-title {
		display: block !important;
		font-weight: bold;
	}
	.hit-box > .item.hit-title a {
		color: #00897B;
	}

	#${constants$1.containerID} {
		font-size: 13px;
		text-align: right;
		background-color: #F3E5F5;
		padding: 5px;
	}
	#${constants$1.containerID} input {
		width: 50px;
		padding: 2px;
	}
	#${constants$1.containerID} br {
		font-size: 17px;
	}

	.PCSpanButtons {
		display: none !important;
	}
`;

	var constants$2 = {
		containerID: 'fm-ref-scrpt-container',
		labelID: 'fm-ref-scrpt-label',
		selectID: 'fm-ref-scrpt-select',
		buttonID: 'fm-ref-scpt-btn',

		autoStartID: 'fm-ref-sctp-auto-start',
		autoNextID: 'fm-ref-sctp-auto-next',

		durationKey: 'duration-' + window.location.host,
	};

	var refresherCSS = `
	#${constants$2.containerID} {
		font-size: 13px;
		text-align: right;
		background-color: #F1F8E9;
		padding: 5px;
	}
	#${constants$2.containerID} > button {
		transition: all 0.2s;
    padding: 3px 9px;
    border-radius: 4px;
    margin: 2px auto;
		display: block;
		outline: 0;
		border: 0;
		color: white;
	}
	button.mini-button.refresher {
		color: white;
	}
	button.start {
		background-color: #00897B;
	}
	button.start:hover {
		background-color: #00695C;
	}
	button.stop {
		background-color: #F4511E;
	}
	button.stop:hover {
		background-color: #D84315;
	}
`;

	var constants$3 = {
		showKey: 'hideNonHits - ' + window.location.host,
		showText: {
			all: 'Show HITs Only',
			hits: 'Show All Posts',
		},
		containerID: 'show-hide-btn-container',
		buttonID: 'show-hide-btn',
		postSelector: 'li[id^="post_"], li[id^="post-"]',
	};

	var showOnlyHITsCSS = `
	#${constants$3.containerID} {
		font-size: 15px;
	}
	#${constants$3.containerID} > button {
		transition: all 0.2s;
		padding: 5px;
		background-color: #1E88E5;
		color: white;
		border: 0;
		width: 100%;
	}
	#${constants$3.containerID} > button:hover {
		background-color: #1565C0;
	}
	#${constants$3.containerID} > button:focus {
		outline: none;
	}
`;

	var css = `
	#${constants.panelID} {
		position: fixed;
		top: 50px;
		right: 10px;
		z-index: 99999;
		text-align: right;
		transition: all 0.1s;
		border-radius: 4px;
		width: 225px;
	}
	#${constants.panelID}.closed {
		right: -225px;
	}

	#${constants.panelID} > .section {
		margin: 0;
	}

	#${constants.closeBtnID}, .mini-button {
		position: absolute;
		left: -26px;
		width: 26px;
		height: 26px;
		border: 0;
		border-radius: 5px 0 0 5px;
		font-weight: bold;
	}
	.mini-button {
		top: 28px;
	}
	#${constants.closeBtnID}:focus, .mini-button {
		outline: 0;
	}

	${HITBoxCSS}
	${refresherCSS}
	${showOnlyHITsCSS}
`;

	function next(el, idCont) {
		let cur = el.nextSibling;

		while (cur !== null) {
			if (cur.id && cur.id.indexOf(idCont) > -1) return cur;

			cur = cur.nextSibling;
		}

		return null;
	}
	function hasParent(el, selector) {
		let cur = el;

		while (cur !== null) {
			if (cur.matches(selector)) return true;

			cur = cur.parentElement;
		}

		return false;
	}
	function parent(el, selector) {
		let cur = el;

		while (cur !== null) {
			if (cur.matches(selector)) return cur;

			cur = cur.parentElement;
		}

		return null;
	}

	function match(str, regex) {
		try {
			let val = str.match(regex)[1].trim();
			return val;
		} catch (e) {
			return null;
		}
	}
	function pad(width, n, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

	/**
	 * Returns a Proxy for `saveStateObj` that saves value changes to storage.
	 * Prop values will be loaded from storage if present, or current values will be kept as defaults.
	 */
	function saveState(saveStateObj, prefix = '') {
		if (prefix !== '') prefix = prefix + '-';
		const obj = {};

		const keys = Object.keys(saveStateObj);
		for (let i = 0; i < keys.length; i++) {
			const keyName = keys[i];
			const defaultValue = saveStateObj[keyName];

			obj[keyName] = GM_getValue(prefix + keyName, defaultValue);
		}

		return saveStateProxy(obj, prefix);
	}
	function saveStateProxy(saveStateObj, prefix) {
		return new Proxy(saveStateObj, {
			set: function (obj, prop, value) {
				obj[prop] = value;
				GM_setValue(prefix + prop, value);

				return true;
			},
		});
	}

	/**
	 * Returns all HIT anchors in `el`.
	 */
	function getHITLinks(el) {
		const links = el.getElementsByTagName('a');
		const mturkLinks = [];

		for (let i = 0; i < links.length; i++) {
			if (constants$1.idRegex.test(links[i].href)) {
				mturkLinks.push(links[i]);
			}
		}
		return mturkLinks.filter((el) => {
			const isBlankText = el.innerText.trim().length === 0;
			const isSandbox = el.href.indexOf('workersandbox') > -1;

			// const isPandaText = el.innerText.toLowerCase() === 'panda';
			// const isPandaURL = /andaccept/i.test(el.href);

			return !isBlankText && !isSandbox;
		});
	}

	/**
	 * Convert a PandA URL to a normal Preview URL.
	 */
	function pandaToPreview(url) {
		return url.replace('previewandaccept', 'preview').replace('/accept_random', '');
	}

	/**
	 * Return an array of links without duplicate HIT URLs.
	 */
	function dedupLinks(linksOrig) {
		const { selectors } = constants$1;

		const links = linksOrig.slice();
		const ids = links.map((a) => getID(a.href));
		const posts = links.map((link) => parent(link, selectors.post));

		for (let i = links.length - 1; i >= 0; i--) {
			const post = posts[i];
			const thisID = getID(links[i].href);

			if (foundHIT(links, i, thisID, post)) {
				links.splice(i, 1);
				posts.splice(i, 1);
			}
		}

		return links;
	}

	function fixQualString(str) {
		if (constants$1.qualRegex.test(str) && !match(str, constants$1.qualRegex)) {
			let quals = str.replace(constants$1.minusQualRegex, '');
			str = str.replace(quals, '');

			quals = quals.split('\n').join(';');
			str = str + quals;
		}
		return str;
	}

	function foundHIT(allLinks, index, id, post) {
		// returns whether hit with id is found elsewhere in same post
		const { selectors } = constants$1;

		for (let i = index - 1; i >= 0; i--) {
			const thisPost = parent(allLinks[i], selectors.post);
			const thisID = getID(allLinks[i].href);

			// if allLinks[i] is in quote continue
			if (parent(allLinks[i], selectors.quoteContainer)) continue;
			if (thisPost !== post) continue;
			if (thisID === id) return true;
		}

		return false;
	}

	function getID(url) {
		return url.match(constants$1.idRegex)[1];
	}
	function getRID(url) {
		return url.match(constants$1.rIdRegex)[1];
	}

	function log(...things) {
		console.log('HIT Box:', ...things);
	}

	const months = [
		'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
	];
	function timeToMS(time) {
		if (time === null) return;

		let days = time.match(/(\d+) days?/);
		let hours = time.match(/(\d+) hours?/);
		let minutes = time.match(/(\d+) minutes?/);
		let seconds = time.match(/(\d+) seconds?/);

		let total = 0;

		if (days) {
			days = +days[1];
			total += days * 86400000;
		}
		if (hours) {
			hours = +hours[1];
			total += hours * 3600000;
		}
		if (minutes) {
			minutes = +minutes[1];
			total += minutes * 60000;
		}
		if (seconds) {
			seconds = +seconds[1];
			total += seconds * 1000;
		}

		if (total === 0 && /\d/.test(time)) {
			// time might not have time units, assume number is seconds
			total += (+time) * 1000;

			time = (time / 60) + ' minutes';
		}

		if (Number.isNaN(total)) {
			// time is probably messed up for some reason; just default to 60 minutes
			total = 3600000;
		}

		return total;
	}
	function time12to24(time12h) {
		const [time, modifier] = time12h.split(' ');
		let [hours, minutes] = time.split(':');

		if (hours === '12') {
			hours = '00';
		}
		if (modifier === 'PM') {
			hours = parseInt(hours, 10) + 12;
		}

		return hours + ':' + minutes;
	}
	function time24To12(hours) {
		return ((hours + 11) % 12 + 1);
	}
	function amORpm(hour) {
		if (hour >= 12) return 'PM';

		return 'AM';
	}

	function fixDate(date) {
		const correctDate = new Date(date);
		correctDate.setHours(correctDate.getHours() + 3);

		const month = months[correctDate.getMonth()];
		const day = pad(2, correctDate.getDate());
		const year = correctDate.getFullYear();
		const hour = pad(2, time24To12(correctDate.getHours()));
		const min = pad(2, correctDate.getMinutes());
		const ampm = amORpm(correctDate.getHours());

		return `${month} ${day}, ${year} at ${hour}:${min} ${ampm}`;
	}

	/**
	 * Returns a formatted date
	 *
	 * Example output: "2018-09-25T14:52"
	 */
	function formatDate(dateStr) {
		for (let k = 0; k < months.length; k++) {
			dateStr = dateStr.replace(months[k], pad(2, k + 1));
		}

		let dayRegex;

		const date = new Date();

		if (/today/i.test(dateStr)) {
			dayRegex = /today/i;
		} else if (/yesterday/i.test(dateStr)) {
			dayRegex = /yesterday/i;
			date.setDate(date.getDate() - 1);
		}
		const day = pad(2, date.getDate());
		const month = pad(2, date.getMonth() + 1);
		const year = date.getFullYear();

		dateStr = dateStr.replace(dayRegex, `${month}-${day}-${year}`);

		let hour = dateStr.match(/(\D)(\d)(\:\d\d [ap]m$)/i);
		if (hour !== null) {
			hour = pad(2, hour[2]);
			dateStr = dateStr.replace(/(\D)(\d)(\:\d\d [ap]m$)/i, '$1' + hour + '$3');
		}

		dateStr = dateStr.replace(/^(\d\d).(\d\d).+(\d{4}).+(\d\d)\:(\d\d).([ap]m)$/i, '$3-$1-$2T$4:$5 $6');
		let ct = time12to24(dateStr.substr(-8));
		dateStr = dateStr.substring(0, 11) + ct;

		return dateStr;
	}

	function makeTitle(hit) {
		let deleteTime = '';

		if (hit.time) {
			const now = new Date();

			const deleteDate = new Date();
			deleteDate.setHours(+hit.formattedPostDate.substr(-5, 2));
			deleteDate.setMinutes(+hit.formattedPostDate.substr(-2, 2));

			// should delete watcher after 2.25 times the hit's duration since it was posted
			deleteDate.setMilliseconds(hit.timeMS * 2.25);

			let day = '';
			if (deleteDate.getDate() !== now.getDate()) {
				day = `${deleteDate.getMonth() + 1}/${deleteDate.getDate()}-`;
			}

			const hours = pad(2, time24To12(deleteDate.getHours()));
			const minutes = pad(2, deleteDate.getMinutes());
			const ampm = amORpm(deleteDate.getHours());

			deleteTime = `[${day}${hours}:${minutes} ${ampm}] -- `;
		}

		let pay = '';
		if (hit.pay) {
			pay = hit.pay + ' -- ';
		}

		let title = hit.title.trim();
		// let title = hit.title.substr(0, 35).trim();
		if (title.length < hit.title.length) {
			title += '...';
		}

		return deleteTime + pay + title;
	}

	var state = {
		hits: [],
		links: [],
	};

	function getHits() {
		const { links } = state;

		const hits = [];

		// go through posts and try to get as much info as possible
		for (let i = 0; i < links.length; i++) {
			try {
				const hit = parseHit(links[i]);

				hits.push(hit);
			} catch (e) {
				log('Error:', e);
				log('Bad HIT. Link title:', links[i].innerText);
			}
		}

		return hits;
	}
	function parseHit(link) {
		const { selectors, reqHrefSelector } = constants$1;

		const text = link.parentElement.innerText.toLowerCase();
		const post = parent(link, selectors.post);
		const datetimeEl = post.querySelector(selectors.datetime);

		let hit;
		if (/full profile check out turkerview/i.test(text)) {
			hit = parseTurkerView(link, post);
		} else {
			// generally the export parser has been reliable so just use it for everything else
			hit = parseExport(link, post);
		}

		hit.post = post;

		hit.reqEl = link.parentElement.querySelector(reqHrefSelector);
		hit.id = getID(hit.href);
		try {
			hit.requesterID = getRID(hit.reqEl.href);
			hit.requesterName = hit.reqEl.textContent;
		} catch (e) { }
		hit.isQuote = hasParent(link, selectors.quoteContainer);

		hit.postDate = datetimeEl[selectors.datetimeProp];
		hit.formattedPostDate = formatDate(hit.postDate);

		const site = match(window.location.host, /(?:www\.)(\w+)\.com/);
		if (site === 'mturkcrowd') {
			// when logged out, the MTC post time is off by 3 hours, so fix that
			hit.postDate = fixDate(hit.formattedPostDate);
			hit.formattedPostDate = formatDate(hit.postDate);
		}

		if (hit.pay && hit.pay.indexOf('$') === -1) {
			hit.pay = '$' + hit.pay;
		}

		hit.timeMS = timeToMS(hit.time);
		hit.customTitle = makeTitle(hit);

		return hit;
	}

	function parseTurkerView(link, post) {

		const hit = {};
		const linkParent = link.parentElement;

		hit.titleEl = linkParent.querySelector('i');
		hit.title = match(hit.titleEl.innerText, constants$1.tvTitleRegex);
		hit.href = pandaToPreview(link.href);
		hit.pay = match(hit.titleEl.querySelector('span').innerText, /(\$\d+\.\d\d)/);
		hit.qualifications = match(TVqualtext(post), constants$1.qualRegex);

		const bonusInTitle = /bonus/i.test(hit.titleEl.firstChild.textContent);
		const bonusInPay = /bonus/i.test(hit.titleEl.querySelector('span').innerText);
		if (bonusInTitle || bonusInPay) {
			hit.pay += '+';
		}

		// turkerview doesn't export time...
		// pretend that the time is 60m since that's the average
		hit.time = '60 minutes';
		hit.description = null; // turkerview doesn't export description...
		hit.available = null; // turkerview doesn't export available...

		return hit;
	}
	function parseExport(link, post) {

		const hit = {};
		const linkParent = link.parentElement;

		const qualFixedText = fixQualString(linkParent.innerText);

		hit.titleEl = link;
		hit.href = hit.titleEl.href;
		hit.title = hit.titleEl.innerText.trim();
		hit.description = match(linkParent.innerText, constants$1.descRegex);
		hit.time = match(linkParent.innerText, constants$1.timeRegex) || '60 minutes';
		hit.pay = match(linkParent.innerText, constants$1.payRegex);
		hit.qualifications = match(qualFixedText, constants$1.qualRegex);
		hit.available = +match(linkParent.innerText, constants$1.availRegex);

		if (!hit.pay) {
			// couldn't find a pay
			// use a less strict (but probably inaccurate) regex to get it
			hit.pay = match(linkParent.innerText, constants$1.payRegexBackup);
		}

		const bonusInTitle = /bonus/i.test(hit.titleEl.innerText);
		if (bonusInTitle) {
			hit.pay += '+';
		}

		return hit;
	}

	function TVqualtext(post) {
		const qualLink = post.querySelector('a[href^="https://turkerview.com/requesters"]');
		const qualsEl = qualLink.parentElement.parentElement.parentElement;
		return qualsEl.innerText;
	}

	var sharedState = {
		hits: [],
	};

	function makeBoxes() {
		const { hits } = sharedState;
		const { selectors } = constants$1;

		for (let i = 0; i < hits.length; i++) {
			if (hits[i].isQuote) continue;

			const box = document.createElement('div');
			box.className = 'hit-box';

			const post = parent(hits[i].titleEl, selectors.msg);
			post.prepend(box);

			hits[i].box = box;

			hits[i].addToBox = addToBox.bind(box);
		}
	}

	function addToBox(el, position, className) {
		const div = document.createElement('div');
		div.className = 'item ' + (className ? className : '');
		div.appendChild(el);

		if (position === 'end') {
			this.appendChild(div, this.lastElementChild);
		} else {
			this.insertBefore(div, this.firstElementChild);
		}
	}

	function processFreshness() {
		const { hits } = sharedState;

		for (let i = 0; i < hits.length; i++) {
			const hit = hits[i];

			if (!hit.time || !/\d/.test(hit.time)) continue;

			const postedDate = new Date(hit.formattedPostDate).getTime();
			const now = new Date().getTime();

			const timeSince = now - postedDate;

			let hitTime = hit.timeMS;
			if (hit.available > 1) {
				// if there is more than 1 hit, add a little bit to the time since batches stick around sometimes
				hitTime += (hit.available * 0.007) * hitTime;
			}

			const freshness = timeSince / hitTime;

			const status = gradient(freshness);

			hits[i].freshness = status.value;

			if (!hits[i].isQuote) {
				const chanceSpan = document.createElement('span');
				chanceSpan.innerText = status.text;
				chanceSpan.style.fontWeight = 'bold';
				chanceSpan.style.color = status.color;

				hits[i].box.classList.add(status.text.toLowerCase());
				hits[i].addToBox(chanceSpan);
			}
		}
	}

	function gradient(freshness) {
		// freshness is a measure of how long since hit was posted
		// (in units equal to the hit's timer)
		if (freshness <= 1) {
			return {
				value: constants$1.freshness.FRESH,
				text: 'Fresh',
				color: '#4CAF50',
			};
		} else if (freshness <= 1.5) {
			return {
				value: constants$1.freshness.EDIBLE,
				text: 'Edible',
				color: '#FDD835',
			};
		} else if (freshness <= 2.25) {
			return {
				value: constants$1.freshness.SMELLY,
				text: 'Smelly',
				color: '#F57C00',
			};
		} else {
			return {
				value: constants$1.freshness.ROTTEN,
				text: 'Rotten',
				color: '#F44336',
			};
		}
	}

	var saveState$1 = saveState({
		hitsApproved: Infinity,
		approvalRate: Infinity,
		minPay: 0,
		minFreshness: constants$1.freshness.ROTTEN,
		onlyQualified: false,
	}, 'hit-box');

	const compare = {
		'<': (a, b) => a < b,
		'>': (a, b) => a > b,
		'<=': (a, b) => a <= b,
		'>=': (a, b) => a >= b,
		'===': (a, b) => a === b,
	};
	function checkApproved(str, value) {
		// given qual string, returns whether `value` of hits is qualified to do hit

		str = str.toLowerCase();
		str = str.replace(/not ?less ?than/, 'greaterthanorequalto');
		str = str.replace(/not ?greater ?than/, 'lessthanorequalto');

		let operation;
		if (/greater.+equal ?to/.test(str)) operation = '>=';
		else if (/greater ?/.test(str)) operation = '>';
		else if (/less.+equal ?to/.test(str)) operation = '<=';
		else if (/less ?than/.test(str)) operation = '<';
		else if (/equal ?to/.test(str)) operation = '===';

		if (!operation) {
			// turkerview uses op symbols (</>/etc) instead of words so extract it
			operation = str.match(/([<>=]+)/)[1];
		}

		const qualValue = +str.match(/\d+/)[0];

		return compare[operation](value, qualValue);
	}
	function notQualed(qualStr) {
		if (/masters/i.test(qualStr)) return true;
		if (!qualStr) return false;

		// go through each qual, return true (not qualified) if any fail
		const qualArr = qualStr.split(';');
		for (let i = 0; i < qualArr.length; i++) {
			// whether the qual is based on approval rate
			const approvalRate = /approval ?rate/i.test(qualArr[i]);

			// whether qual is based on number of hits approved
			const approved = /approved ?hits/i.test(qualArr[i]);

			if (approvalRate) {
				if (!checkApproved(qualArr[i], saveState$1.approvalRate)) return true;
			}
			if (approved) {
				if (!checkApproved(qualArr[i], saveState$1.hitsApproved)) return true;
			}
		}

		return false;
	}

	function processQualified() {
		const { hits } = sharedState;

		for (let i = 0; i < hits.length; i++) {
			const notQualified = notQualed(hits[i].qualifications);

			// set hit to qualified, only set it to false if we know we're not qualified
			hits[i].qualified = true;

			if (notQualified) hits[i].qualified = false;

			if (notQualified && !hits[i].isQuote) {
				const qualSpan = document.createElement('span');
				qualSpan.innerText = 'Not Qualified';
				qualSpan.style.fontWeight = 'bold';
				qualSpan.style.color = '#F44336';

				hits[i].addToBox(qualSpan);
				hits[i].box.classList.add('not-qualified');
			}
		}
	}

	function showPay() {
		const { hits } = sharedState;

		for (let i = 0; i < hits.length; i++) {
			if (hits[i].isQuote) continue;

			const hit = hits[i];

			const pay = document.createElement('span');
			pay.innerText = hit.pay;
			pay.style.fontWeight = 'bold';
			pay.style.color = '#66BB6A';
			pay.style.letterSpacing = '1px';

			hits[i].addToBox(pay);
		}
	}

	function showTitle() {
		const { hits } = sharedState;

		// add hit title+link to boxes

		for (let i = 0; i < hits.length; i++) {
			if (hits[i].isQuote) continue;

			const title = document.createElement('a');
			title.href = hits[i].href;
			title.textContent = hits[i].title;
			title.target = '_blank';

			hits[i].addToBox(title, null, 'hit-title');
		}
	}

	function makeLink(hit) {
		let url = 'https://worker.mturk.com/requesters/PandaCrazyOnce/projects?';
		url += 'JRGID=' + hit.id + '&';

		if (hit.requesterName) url += 'JRRName=' + encodeURIComponent(hit.requesterName) + '&';
		if (hit.requesterID) url += 'JRRID=' + hit.requesterID + '&';

		url += 'JRTitle=' + encodeURIComponent(hit.customTitle);

		return url;
	}

	function addButtons() {
		const { hits } = sharedState;

		for (let i = 0; i < hits.length; i++) {
			if (hits[i].isQuote) continue;

			const watchLink = document.createElement('a');
			watchLink.href = makeLink(hits[i]);
			watchLink.textContent = '[PC] Once';
			watchLink.target = '_blank';

			hits[i].addToBox(watchLink);
		}
	}

	function update() {
		const { hits } = sharedState;

		for (let i = 0; i < hits.length; i++) {
			if (!shouldHideHIT(hits[i]) || !shouldHidePost(i)) {
				hits[i].post.style.display = 'block';
				hits[i].hidden = false;
			} else {
				hits[i].post.style.display = 'none';
				hits[i].hidden = true;
			}
		}
	}

	function shouldHidePost(hitIndex) {
		const { hits } = sharedState;

		const hitPost = hits[hitIndex].post;

		for (let i = 0; i < hits.length; i++) {
			if (i === hitIndex) continue;
			if (hits[i].post !== hitPost) continue;

			// dont hide whole post if it contains a hit that shouldn't be hidden
			if (!shouldHideHIT(hits[i])) return false;
		}

		return true;
	}
	function shouldHideHIT(hit) {
		const { minFreshness, minPay, onlyQualified } = saveState$1;

		if (onlyQualified && !hit.qualified) return true;
		if (hit.freshness >= 0 && hit.freshness < minFreshness) return true;
		if (hit.pay && hit.pay.match(/[\d.]+/) < minPay) return true;
	}

	function initHITBox () {
		state.links = dedupLinks(getHITLinks(document));
		sharedState.hits = getHits();

		log('HITs: ', sharedState.hits);

		makeBoxes();
		addButtons();
		processFreshness();
		showPay();
		processQualified();
		showTitle();
		update();
	}

	var state$1 = {
		refreshed: false,
		refreshing: false,
		timerID: null,
		links: [],
		count: null,
		lastCount: null,
		newPage: false,
		newHITs: false,
		activeAlert: false,
		alert: '',
		off: false,
	};

	function checkNewHITs() {
		const { lastCount } = state$1;
		const { hits } = sharedState;

		if (hits.length <= lastCount) return false;

		// go through new of hits, ding if qualified (and not a quote) for any one of them
		// check hits after count-1 (don't set i less than 0)
		let i = lastCount > 0 ? lastCount : 0;
		for (; i < hits.length; i++) {
			const isQuote = hits[i].isQuote === true;
			const isQualified = hits[i].qualified === true;

			if (isQualified && !isQuote) return true;
		}

		return false;
	}

	function checkNewPage() {
		const { links } = state$1;

		for (let i = 0; i < links.length; i++) {
			if (/next >/i.test(links[i].innerText) || /next/i.test(links[i].title)) {
				return true;
			}
		}

		return false;
	}
	function goToNewPage() {
		const { links } = state$1;
		let nextPageUrl;

		for (let i = 0; i < links.length; i++) {
			if (/next >/i.test(links[i].innerText) || /next/i.test(links[i].title)) {
				nextPageUrl = links[i].href;
				break;
			}
		}

		setTimeout(function () {
			window.location.href = nextPageUrl;
		}, 3000);
	}

	const originalTitle = document.title;

	function listen() {
		// listen for page visibility change
		document.addEventListener('visibilitychange', function () {
			if (document.hidden) return;

			state$1.activeAlert = false;
			state$1.alert = false;
			revertTitle();
		});
	}

	function alertTitle(text) {
		document.title = text + ' | ' + originalTitle;
	}

	function revertTitle() {
		document.title = originalTitle;
	}

	const saveState$2 = {
		autoStart: false,
		autoNext: false,
	};
	saveState$2[constants$2.durationKey] = 60000; // default duration = 60s

	var saveState$3 = saveState(saveState$2, 'refresher');

	function startRefreshing(timerLength = saveState$3[constants$2.durationKey]) {
		if (state$1.refreshing) return;

		state$1.timerId = setTimeout(function () {
			revertTitle();
			updateState();

			window.location.reload();
		}, timerLength);

		state$1.refreshing = true;
	}

	function stopRefreshing() {
		if (!state$1.refreshing || state$1.timerId === null) return;

		clearTimeout(state$1.timerId);
		state$1.timerId = null;
		state$1.refreshing = false;
	}

	function changeDuration(newDuration) {
		saveState$3[constants$2.durationKey] = newDuration;

		// only restart refreshing if we already are refreshing
		if (!state$1.refreshing) return;

		stopRefreshing();
		startRefreshing();
	}

	function updateState(manual) {
		const newState = {
			refreshed: manual ? false : true,
			count: state$1.count,
			activeAlert: state$1.activeAlert,
			alert: state$1.alert,
			off: state$1.off,
		};

		window.history.pushState(
			newState,
			document.title
		);
	}

	const context = new AudioContext();
	let o = context.createOscillator();
	o.type = "sine";
	o.connect(context.destination);

	function speak(text) {
		let utter = new SpeechSynthesisUtterance(text);
		utter.volume = 1;

		speechSynthesis.speak(utter);
	}

	function initRefresher () {
		const { autoStart, autoNext } = saveState$3;
		const { hits } = sharedState;

		state$1.count = hits.length;
		state$1.links = document.getElementsByTagName('a');

		if (window.history.state && window.history.state.hasOwnProperty('refreshed')) {
			state$1.refreshed = window.history.state.refreshed;
			state$1.lastCount = window.history.state.count;
			state$1.off = window.history.state.off;

			if (document.hidden) {
				// page isn't visible; carry over any alerts from last refresh
				state$1.activeAlert = window.history.state.activeAlert;
				state$1.alert = window.history.state.alert;
			}
		}

		state$1.newHITs = checkNewHITs();
		state$1.newPage = checkNewPage();

		const visibleHITs = hits.reduce((a, v) => a + (v.hidden ? 0 : 1), 0);
		let dontSpeak = false;

		if ((state$1.refreshed && !state$1.newPage) || (autoStart && !state$1.off && !state$1.newPage)) {
			startRefreshing();
		} else if (autoNext && state$1.newPage && (state$1.count === 0 || visibleHITs === 0)) {
			goToNewPage();
			dontSpeak = true;
		}

		if (!dontSpeak && state$1.refreshed && state$1.newHITs) {
			say((state$1.count - state$1.lastCount) + ' New HITs');

			if (document.hidden) {
				state$1.activeAlert = true;
				state$1.alert = (state$1.count - state$1.lastCount) + ' NEW HITs';
			}
		}
		if (!dontSpeak && state$1.refreshed && state$1.newPage) {
			say('New page');

			if (document.hidden) {
				state$1.activeAlert = true;
				state$1.alert = 'NEW PAGE';
			}
		}

		if (!dontSpeak && state$1.activeAlert) {
			alertTitle(state$1.alert);
		}

		listen();

		// log('HITs: ', hits);
		// log('Last state: ', window.history.state);
		// log('Last HIT count: ' + state.lastCount);
		// log('New HIT Count: ' + state.count);
	}

	function say(text) {
		speak(text);
		GM_notification({
			title: 'MTurk Forum Tools',
			text: text + ' on ' + window.location.host,
		});
	}

	function getPosts() {
		let postObjects = document.querySelectorAll(constants$3.postSelector);

		postObjects = [...postObjects].map((postEl) => {
			const postObject = {
				isHit: false,
				element: postEl,
			};

			let hitLinks = getHITLinks(postEl);
			hitLinks = dedupLinks(hitLinks);

			if (hitLinks.length > 0) postObject.isHit = true;

			return postObject;
		});

		return postObjects;
	}

	const saveState$4 = {};
	saveState$4[constants$3.showKey] = 'all';

	var saveState$5 = saveState(saveState$4, 'show-only-hits');

	var state$2 = {
		posts: [],
	};

	function updateVisibility() {
		const { posts } = state$2;
		const visibility = saveState$5[constants$3.showKey];

		for (let i = 0; i < posts.length; i++) {
			if (posts[i].isHit) continue;

			const post = posts[i].element;

			post.style.display = visibility === 'all' ? 'block' : 'none';

			const postNum = post.id.match(/\d+/)[0];
			const postThanks = next(post, postNum);

			if (postThanks !== null) postThanks.style.display = 'none';
		}
	}

	function initShowOnlyHITs () {
		state$2.posts = getPosts();

		updateVisibility();
	}

	var state$3 = {
		panelCreated: false,

		panelElement: null,
		closeBtnElement: null,
	};

	var saveState$6 = saveState({
		panelClosed: false,
	}, 'helper');

	function createPanel() {
		if (state$3.panelCreated) return;

		const panelEl = document.createElement('div');
		panelEl.id = constants.panelID;
		panelEl.classList.toggle('closed', saveState$6.panelClosed);

		const closeBtn = document.createElement('button');
		closeBtn.addEventListener('click', onClick);
		closeBtn.id = constants.closeBtnID;
		state$3.closeBtnElement = closeBtn;
		updateBtn();
		updateMiniBtn();

		panelEl.appendChild(closeBtn);
		document.body.appendChild(panelEl);

		state$3.panelElement = panelEl;
	}

	function onClick() {
		saveState$6.panelClosed = !saveState$6.panelClosed;
		updateBtn();
		state$3.panelElement.classList.toggle('closed', saveState$6.panelClosed);

		updateMiniBtn();
	}

	function updateMiniBtn() {
		const miniButtons = document.getElementsByClassName('mini-button');

		for (let i = 0; i < miniButtons.length; i++) {
			miniButtons[i].style.display = saveState$6.panelClosed ? 'block' : 'none';
		}
	}

	function updateBtn() {
		const { panelClosed } = saveState$6;

		state$3.closeBtnElement.innerHTML = panelClosed ? '<' : '>';
		state$3.closeBtnElement.title = panelClosed ? 'Open Tools Panel' : 'Close Tools Panel';
		state$3.closeBtnElement.style.backgroundColor = panelClosed ? '#FFEB3B' : '#FBC02D';
	}

	function createSection() {
		const sectionDiv = document.createElement('div');
		sectionDiv.className = 'section';

		state$3.panelElement.appendChild(sectionDiv);

		return sectionDiv;
	}

	function addSection() {
		createPanel();
		state$3.panelCreated = true;

		return createSection();
	}

	function addMiniButton(label, onClick) {
		const btnEl = document.createElement('button');
		btnEl.className = 'mini-button';
		btnEl.textContent = label;
		btnEl.addEventListener('click', onClick);

		state$3.panelElement.appendChild(btnEl);

		updateMiniBtn();

		return btnEl;
	}

	function toggle() {
		const { showKey } = constants$3;

		const toggleBtn = document.getElementById(constants$3.buttonID);

		if (saveState$5[showKey] === 'all') {
			saveState$5[showKey] = 'hits';
		} else if (saveState$5[showKey] === 'hits') {
			saveState$5[showKey] = 'all';
		}
		updateVisibility();

		toggleBtn.textContent = constants$3.showText[saveState$5[showKey]];
	}

	function setupUI() {
		const { showKey } = constants$3;

		const toolsSection = addSection();

		const btnContainer = document.createElement('div');
		btnContainer.id = constants$3.containerID;

		const toggleBtn = document.createElement('button');
		toggleBtn.id = constants$3.buttonID;
		toggleBtn.type = 'button';
		toggleBtn.textContent = constants$3.showText[saveState$5[showKey]];
		toggleBtn.addEventListener('click', function () {
			toggle();
		});

		btnContainer.appendChild(toggleBtn);
		toolsSection.appendChild(btnContainer);
	}

	function label(text, htmlFor) {
		const labelEl = document.createElement('label');
		labelEl.htmlFor = htmlFor;
		labelEl.textContent = text;

		return returnObj(labelEl);
	}
	function br() {
		const brEl = document.createElement('br');

		return returnObj(brEl);
	}
	function hr() {
		const hrEl = document.createElement('hr');

		return returnObj(hrEl);
	}
	function div(id) {
		const divEl = document.createElement('div');
		divEl.id = id;

		return returnObj(divEl);
	}
	function input(id, type, value = '', step) {
		let valueProp = 'value';
		if (type === 'checkbox' || type === 'radio') valueProp = 'checked';

		const inputEl = document.createElement('input');
		inputEl.id = id;
		inputEl.type = type;
		inputEl[valueProp] = value;

		if (type === 'number' && step) inputEl.step = step;

		return returnObj(inputEl);
	}
	function select(id, options, value = '') {
		const selectEl = document.createElement('select');
		selectEl.id = id;

		for (let i = 0; i < options.length; i++) {
			const option = document.createElement('option');
			option.value = options[i].value;
			option.textContent = options[i].label;

			selectEl.appendChild(option);
		}

		selectEl.value = value;

		return returnObj(selectEl);
	}
	function button(label) {
		const buttonEl = document.createElement('button');
		buttonEl.textContent = label;
		buttonEl.type = 'button';

		return returnObj(buttonEl);
	}


	const proxyHandler = {
		get: function (target, name) {
			if (name.indexOf('on') !== 0 || name[2].toUpperCase() !== name[2]) return target[name];

			// key is in camelCase with 'on' at the beginning; assume it's to setup event listener
			const eventName = name.replace('on', '').toLowerCase();

			return function (listener) {
				target.element.addEventListener(eventName, listener);

				return target;
			};
		},
		set: function (target, name, newValue) {
			target[name] = newValue;
			return true;
		},
	};

	function returnObj(thisEl) {
		const obj = {
			element: thisEl,
			appendTo: function (el) {
				if (!el.nodeType) el = el.element;

				el.appendChild(this.element);

				return this;
			},
		};

		return new Proxy(obj, proxyHandler);
	}

	function setupUI$1() {
		const {
			hitsApproved,
			approvalRate,
			onlyQualified,
			minFreshness,
			minPay,
		} = saveState$1;

		const toolsSection = addSection();
		const statsContainer = div(constants$1.containerID);

		// stats
		label('HITs Approved: ', constants$1.apprInputID)
			.appendTo(statsContainer);
		input(constants$1.apprInputID, 'number', hitsApproved !== Infinity ? hitsApproved : 0)
			.onBlur(function () {
				saveState$1.hitsApproved = +this.value;
			})
			.appendTo(statsContainer);

		br().appendTo(statsContainer);

		label('Approval Rate: ', constants$1.rateInputID)
			.appendTo(statsContainer);
		input(constants$1.rateInputID, 'number', approvalRate !== Infinity ? approvalRate : 0)
			.onBlur(function () {
				saveState$1.approvalRate = +this.value;
			})
			.appendTo(statsContainer);

		hr().appendTo(statsContainer);

		// hide options
		label('Hide Not Qualified: ', constants$1.onlyQualifiedID)
			.appendTo(statsContainer);
		input(constants$1.onlyQualifiedID, 'checkbox', onlyQualified)
			.onChange(function () {
				saveState$1.onlyQualified = this.checked;

				update();
			})
			.appendTo(statsContainer);

		br().appendTo(statsContainer);

		const freshnessOptions = [
			{ label: 'Rotten', value: constants$1.freshness.ROTTEN },
			{ label: 'Smelly', value: constants$1.freshness.SMELLY },
			{ label: 'Edible', value: constants$1.freshness.EDIBLE },
			{ label: 'Fresh', value: constants$1.freshness.FRESH },
		];
		label('Minimum Freshness: ', constants$1.minFreshnessID)
			.appendTo(statsContainer);
		select(constants$1.minFreshnessID, freshnessOptions, minFreshness)
			.onChange(function () {
				saveState$1.minFreshness = this.value;

				update();
			})
			.appendTo(statsContainer);

		br().appendTo(statsContainer);

		label('Minimum Pay: ', constants$1.minPayID)
			.appendTo(statsContainer);
		input(constants$1.minPayID, 'number', minPay, 0.1)
			.onBlur(function () {
				saveState$1.minPay = +this.value;

				update();
			})
			.appendTo(statsContainer);

		statsContainer.appendTo(toolsSection);
	}

	let startButton, miniButton;

	function setupUI$2() {
		const toolsSection = addSection();

		const container = div(constants$2.containerID);

		label('Refresh thread: ', constants$2.selectID)
			.appendTo(container)
			.element.id = constants$2.labelID;

		const options = [
			{ label: '30 seconds', value: 30 },
			{ label: '60 seconds', value: 60 },
			{ label: '3 minutes', value: 180 },
			{ label: '5 minutes', value: 300 },
			{ label: '10 minutes', value: 600 },
		];

		select(constants$2.selectID, options, saveState$3[constants$2.durationKey] / 1000)
			.onChange(function () {
				let newValue = +this.value;

				changeDuration(newValue * 1000);
			}).appendTo(container);

		br().appendTo(container);

		label('Auto-start: ', constants$2.autoStartID)
			.appendTo(container);

		input(constants$2.autoStartID, 'checkbox', saveState$3.autoStart)
			.onChange(function (event) {
				saveState$3.autoStart = this.checked;
			})
			.appendTo(container);

		br().appendTo(container);

		label('Auto-next: ', constants$2.autoNextID)
			.appendTo(container)
			.element.title = 'Automatically go to the next page when there are no HITs';

		input(constants$2.autoNextID, 'checkbox', saveState$3.autoNext)
			.onChange(function (event) {
				saveState$3.autoNext = this.checked;
			})
			.appendTo(container);

		br().appendTo(container);

		startButton = button()
			.onClick(toggleClick)
			.appendTo(container);
		startButton.element.id = constants$2.buttonID;

		miniButton = addMiniButton('', toggleClick);
		miniButton.classList.add('refresher');
		miniButton.title = 'Refresher';

		updateBtn$1();

		container.appendTo(toolsSection);
	}

	function toggleClick() {
		if (state$1.refreshing) {
			stopRefreshing();

			// temporarily stop autostart if on
			state$1.off = true;

			updateState(true);
		} else {
			startRefreshing();

			state$1.off = false;

			updateState(true);
		}
		updateBtn$1();
	}
	function updateBtn$1() {
		if (state$1.refreshing) {
			startButton.element.textContent = 'Stop Refreshing';
			startButton.element.className = 'stop';

			miniButton.innerHTML = '&#9724;';
			miniButton.classList.remove('start');
			miniButton.classList.add('stop');
		} else {
			startButton.element.textContent = 'Start Refreshing';
			startButton.element.className = 'start';

			miniButton.innerHTML = '&#9658;';
			miniButton.classList.remove('stop');
			miniButton.classList.add('start');
		}
	}

	function start() {
		GM_addStyle(css);

		initHITBox();
		initRefresher();
		initShowOnlyHITs();

		setupUI();
		setupUI$1();
		setupUI$2();
	}

	if (forumInit()) {
		start();
	} else {
		console.log('Not running MTurk Forum Tools...');
	}

}());
