// ==UserScript==
// @name        4chan GhostPostMixer round 2 (full FIXED HTML backlink function +mobile+flagfix)
// @namespace   Violentmonkey Scripts
// @match       https://boards.4channel.org/*/thread/*
// @match       https://boards.4chan.org/*/thread/*
// @version     1.4.6
// @author      anon && a random husky connoisseur from /an/
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @description Interleave ghost posts from the archives into 4chan threads.  This is a prototype.
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/494699/4chan%20GhostPostMixer%20round%202%20%28full%20FIXED%20HTML%20backlink%20function%20%2Bmobile%2Bflagfix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494699/4chan%20GhostPostMixer%20round%202%20%28full%20FIXED%20HTML%20backlink%20function%20%2Bmobile%2Bflagfix%29.meta.js
// ==/UserScript==

// Based on https://gist.github.com/g-gundam/8f9985e6aaa0dab6eecc556ddcbca370

// templates
    const template = dedent(`<div class="postContainer replyContainer {{postClass}}" id="pc{{postId}}">
    <div class="sideArrows" id="sa{{postId}}">&gt;&gt;</div>
    <div id="p{{postId}}" class="post reply {{replyClass}}">
        <div class="postInfoM mobile" id="pim{{postId}}">
             <span class="nameBlock"><span class="name">{{authorName}} </span><span class="posteruid id">{{posterHash}} </span>{{actualflag}} <br /></span>
            <span class="dateTime postNum" data-utc="{{timestamp}}">{{mobiledate}}&nbsp;<a href="#p{{postId}}" title="Link to this post">No.</a><a href="javascript:quote('{{postId}}');" title="Reply to this post">{{postId}}</a></span>
        </div>
        <div class="postInfo desktop" id="pi{{postId}}">
             <span class="nameBlock"><span class="name">{{authorName}} </span><span class="posteruid id">{{posterHash}} </span>{{actualflag}} </span> {{timeHtml}}&nbsp;
            <span class="postNum desktop"><a href="#p{{postId}}" title="Link to this post">No.</a><a href="javascript:quote('{{postId}}');" title="Reply to this post">{{postId}}</a></span>
        </div>
        {{fileBlock}}
        <blockquote class="postMessage" id="m{{postId}}">{{contentHtml}}</blockquote>
    </div>
    </div>`);

const fileTemplate = dedent(`<div class="file" id="f{{postId}}">
<div class="fileText" id="fT{{postId}}">File: <a title="{{fileName}}" href="{{fileUrl}}" target="_blank">{{fileNameShort}}</a> ({{fileMeta}})</div>
<a class="fileThumb" href="{{fileUrl}}" target="_blank">
	<img src="{{fileThumbUrl}}" style="height: {{filePreviewheight}}px; width: {{filePreviewWidth}}px;" data-md5="{{fileMd5}}" loading="lazy"/>
	<div data-tip="" data-tip-cb="mShowFull" class="mFileInfo mobile">{{fileMeta}}</div>
</a>
</div>`);

const backLinkTemplate = dedent(`<a href="#p{{postId}}" class="quotelink" data-function="highlight" data-backlink="true" data-board="an" data-post="{{postId}}">&gt;&gt;{{postId}}</a>`);

// consts
const apis = turnObjectInsideOut({
   "thebarchive.com": ["b"],
	"desuarchive.org": ["a", "aco", "an", "c", "cgl", "co", "d", "fit", "g", "gif", "his", "int", "k", "m", "mlp", "mu", "q", "qa", "r9k", "tg", "trash", "vr", "wsg"],
	"archive.4plebs.org": ["adv", "f", "hr", "mlpol", "mo", "o", "pol", "s4s", "sp", "trv", "tv", "x"],
	"archived.moe": ["3", "asp", "bant", "biz", "can", "ck", "cm", "cock", "con", "diy", "e", "fa", "fap", "fitlit", "gd", "h", "hc", "hm", "i", "ic", "jp", "lgbt", "lit", "mtv", "n", "news", "out", "outsoc", "p", "po", "pw", "qb", "qst", "r", "s", "sci", "soc", "spa", "t", "toy", "u", "v", "vg", "vint", "vip", "vmg", "vp", "vrpg", "vt", "w", "wg", "wsr", "xs", "y"]
});

let lastModified = 0;
const SHOULD_CONVERT_URLS = true;
const SHOULD_SORT_COMMENTS = false;

function convert4pcdnURLs() {
    if (!SHOULD_CONVERT_URLS) {
        return;
    }

    let images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.src.startsWith('https://i.4pcdn.org/')) {
            img.src = img.src.replace('https://i.4pcdn.org/', 'https://i.not4pcdn.org/');
        }
    });

    let links = document.querySelectorAll('a.fileThumb');
    links.forEach(link => {
        if (link.href.startsWith('https://i.4pcdn.org/')) {
            link.href = link.href.replace('https://i.4pcdn.org/', 'https://i.not4pcdn.org/');
        }
    });
}

const sortComments = (sortingRule) => {
  if (!SHOULD_SORT_COMMENTS) {
    return;
  }

  let thread = document.querySelector(".thread");
  if (!thread) return;
  let comments = [...thread.children];

  comments.shift(); // ignore OP
  comments.sort(sortingRule);
  comments.forEach(comment => {
    thread.appendChild(comment);
  });
};

const byDeletedPostsFirst = (a, b) => {
  const isDeletedA = a.classList.contains("post-deleted");
  const isDeletedB = b.classList.contains("post-deleted");

  return isDeletedB - isDeletedA;
};



// utils
// https://gist.github.com/GitHub30/59e002a5f57a4df0decbd7ac23290f77
async function get(url, headers) {
	return new Promise((resolve) => {
		GM.xmlHttpRequest({
			method: "GET",
			url,
			headers,
			onload: resolve,
		});
	});
}

// this is the worst name for a function, but a friend suggested it...
function turnObjectInsideOut(obj) {
	return Object.fromEntries(Object.entries(obj).flatMap(([k, vs]) => vs.map((v) => [v, k])))
}

// remove all indentations from templates. 4chan native extension breaks if there's a text node as first child in some cases (like image expansion)
function dedent(str) {
	return str.split(/\r?\n/).map((line) => line.replace(/^\s+/g, '').trim()).filter(Boolean).join('');
}

function interpolateTemplateString(template, data) {
	if (!template) throw new Error("No template provided");
	return template.replace(/{{([^}]+)}}/g, (_, key) => data[key] ?? '');
}

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
}

function renderTemplate(template, data) {
	data = data || {};
	return htmlToElement(interpolateTemplateString(template, data));
}

// https://stackoverflow.com/questions/61774434/how-to-wait-for-element-to-load-completely-into-dom
// https://stackoverflow.com/questions/15875128/is-there-element-rendered-event
// https://stackoverflow.com/questions/220188/how-can-i-determine-if-a-dynamically-created-dom-element-has-been-added-to-the-d
function elementReady(container, element) {
	return new Promise((resolve, reject) => {
		let el = container.contains(element);
		if (el) {
			resolve(element);
			return
		}

		new MutationObserver((_, observer) => {
			if (container.contains(element)) {
				console.log('[GhostPostMixer-elementReady] observer reported element ready');
				resolve(element);
				observer.disconnect();
			}
		}).observe(container, {
			childList: true,
			subtree: true
		});
	});
}

function getFucking4chanTime(d) {
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var hour = d.getHours();
	var minute = d.getMinutes();
	var second = d.getSeconds();
	var year = d.getFullYear();
	return month.toString().padStart(2, '0') + "/" + day.toString().padStart(2, '0') + "/" + year.toString().slice(-2) + "(" + ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()] + ")" + hour.toString().padStart(2, '0') + ":" + minute.toString().padStart(2, '0') + ":" + second.toString().padStart(2, '0');
}

function humanFileSize(size) {
	size = Math.abs(size);
	const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
	return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

function parsePostObject(post) {
    const postId = parseInt(post.num, 10);
    const contentText = post.comment_sanitized || '';
    const contentHtml = (post.comment_processed || '').replace(/https:\/\/.*?\/\w+\/thread\/\d+\/#(\d+)\/?/gi, '#p$1').replace(/backlink/gi, 'quotelink').replace(/\n/gm, '');

    const fileObj = {};
    const file = post.media;
    if (file && Object.keys(file).length) {
        fileObj.fileName = file.media_filename;
        fileObj.fileUrl = file.media_link;
        fileObj.fileThumbUrl = file.thumb_link;
        fileObj.filePreviewWidth = file.preview_w;
        fileObj.filePreviewHeight = file.preview_h;
        fileObj.fileSize = humanFileSize(parseInt(file.media_size, 10));
        fileObj.fileMeta = `${fileObj.fileSize}, ${file.media_w}x${file.media_h}`;
        fileObj.fileNameShort = file.media_filename_processed;
        fileObj.fileMd5 = file.media_hash;
    }

    const authorName = `${post.name} ${post.trip ?? ''}`.trim();
    const date = new Date(post.timestamp * 1000);
    const timeHtml = `<span class="dateTime" data-utc="${post.timestamp}">${getFucking4chanTime(date)}</span>`;
    const timestamp =  `${post.timestamp}`;
    const mobiledate = `${getFucking4chanTime(date)}`;

    const countryName = post.troll_country_name ? `(${post.troll_country_name})` :
                        (post.poster_country_name ? `[${post.poster_country_name}]` : '');

    let CountryCode = '';
    if (typeof post.poster_country === 'string') {
        CountryCode = post.poster_country.toLowerCase();
    }

    const countryflag = `<span title="${post.poster_country_name}" class="flag flag-${CountryCode}"></span>`;

    let actualflag = '';
    if (post.troll_country_code) {
        const trollCountryCode = post.troll_country_code.toLowerCase();
        actualflag = `<span title="${post.troll_country_name}" class="bfl bfl-${trollCountryCode}"></span>`;
    } else if (post.poster_country) {
        actualflag = countryflag;
    }

    const posterHash = post.poster_hash ? `(ID: ${post.poster_hash})` : '';

    return {
        postId,
        content: contentText,
        contentHtml,
        authorName,
        timeHtml,
        countryName,
        actualflag,
        mobiledate,
        timestamp,
        posterHash, // Added poster hash here
        ...fileObj
    };
}

// Create a new DOM element suitable for insertion into a 4chan thread.
function postTemplate(post, vars) {
	const data = parsePostObject(post);

	// set some conditional parameters (we could extract these from the posts but the original code does it this way)
	data.postId = vars.n ? `${vars.parentId}_${vars.n}` : vars.parentId;
	data.replyClass = vars.deleted ? 'del' : 'ghost';
	data.postClass = vars.deleted ? 'post-deleted' : 'post-ghost';

	if (data.fileUrl) {
		data.fileBlock = interpolateTemplateString(fileTemplate, data);
	}

	return renderTemplate(template, data);
}

// Go throught the entire thread and fix all dead links if we inserted a deleted posts from the archive
// This works with the built in extension
function fixBacklinks(postId) {
	const deadLinks = Array.from(document.body.querySelectorAll('.thread .deadlink')).filter(e => e.innerText == `>>${postId}`);
	for (const deadLink of deadLinks) {
		deadLink.replaceWith(renderTemplate(backLinkTemplate, { postId }));
	}
}


async function insertGhost(post, threadId) {
	const parentId = parseInt(post.num, 10);
	const n = parseInt(post.subnum, 10);
	//console.log('ag', {parentId, n})
	let parent = document.getElementById(`pc${parentId}`);

	if (parent) {
		const newPost = postTemplate(post, { parentId, n });
		parent.append(newPost);
		await elementReady(parent.parentNode, newPost);
	} else {
		console.error('Could not find parent for ghost post', post);
	}
}

async function insertDeleted(post, posts) {
	const postId = parseInt(post.num, 10);
	let i = posts.findIndex(e => e.num == post.num)
	if (i === -1) return;

	const newPost = postTemplate(post, { parentId: postId, n: 0, deleted: true });

	if (i === 0) {
		const target = document.querySelector('.opContainer');
		target.after(newPost);
		await elementReady(target.parentNode, newPost);
	} else {
		let before = posts[i - 1];
		let target;
		if (before) target = document.getElementById(`pc${before.num}`);
		if (target) {
			target.after(newPost);
			await elementReady(target.parentNode, newPost);
		}
	}

	fixBacklinks(postId);
}

function setLastModified(response) {
	try {
		const rawHeaders = response.responseHeaders;
		const headers = rawHeaders.split('\r\n').reduce((acc, line) => {
			const [key, value] = line.split(': ');
			if (!key) return acc;

			acc[key.toLowerCase()] = value;
			return acc;
		}, {});

		const lastModifiedHeader = headers['last-modified'];
		if (!lastModifiedHeader) return;

		const lastModifiedDate = new Date(lastModifiedHeader);
		if (isNaN(lastModifiedDate)) return;

		// if we call it with the same seconds as what we got from the API, it will return the entire obj... thanks cf/fooka
		lastModifiedDate.setSeconds(lastModifiedDate.getSeconds() + 1);

		lastModified = lastModifiedDate.toUTCString();
	} catch(e) {
		console.error(e);
		lastModified = 0; // reset it for safety in case of error
	}
}
let responseStatus = "...";
let responseStatusColor = 'red';
const deletedCount = "?";
const ghostCount = "?";
ensureStatsDisplayed();
async function getThread(api, board, threadId, retryCount = 0) {
	const url = `https://${api}/_/api/chan/thread/?board=${board}&num=${threadId}`;
	const headers = lastModified ? { 'if-modified-since': lastModified } : null;
	const response = await get(url, headers);
    responseStatus = response.status;
    const threadarchivelink = `https://${api}/${board}/thread/${threadId}`;
if (response.status === 404) {
            console.log('[GhostPostMixer-getThread] API returned 404, no retries scheduled.');
            return null; // Handle 404 without retrying.
        } else if (response.status === 429) {
            responseStatusColor = 'goldenrod'
            // API limit exceeded, calculate retry after based on the `retry-after` header or default to 60 seconds
            const retryAfter = response.responseHeaders.match(/retry-after: (\d+)/i);
            const retryInSeconds = retryAfter ? parseInt(retryAfter[1], 10) : 60;
            console.log(`[GhostPostMixer-getThread] API limit exceeded, retrying in ${retryInSeconds} seconds.`);
            // Display countdown in HTML element
            ensureStatsDisplayed();
            displayCountdown(retryInSeconds);
            return new Promise(resolve => setTimeout(() => resolve(getThread(api, board, threadId, retryCount)), retryInSeconds * 1000));
        } else if (response.status === 200) {
            responseStatus = `<a href="${threadarchivelink}" target="_blank">></a> ${api}`;
            responseStatusColor = 'green'
            console.log(`[GhostPostMixer-getThread] response: ${response.status}`);
            const json = JSON.parse(response.responseText);
            //console.log(json);
            setLastModified(response);
            return json;
        //wont be doing thread updates
        } else if (response.status === 304) {
            responseStatusColor = 'green'
            console.log(`[GhostPostMixer-getThread] response: ${response.status}`);
            console.log('[GhostPostMixer-getThread] Not modified since:', lastModified);
            return null;
        } else if (response.status === 403) {
            responseStatus = `<a href="${threadarchivelink}" target="_blank">></a><a href="${url}" target="_blank">></a> ${api}: ${response.status}`;
            console.log(`[GhostPostMixer-getThread] Must complete cloudflare captcha for ${url}: ${response.status}`);
            return null;
        } else {
            throw new Error(`[GhostPostMixer-getThread] Unexpected response status: ${response.status}`);
        }

	const json = JSON.parse(response.responseText);

	if (json.error) throw new Error(json.error);

	setLastModified(response);

	return json;
}

// Function to display countdown in responseStatus element
function displayCountdown(seconds) {
    const responseStatusElement = document.querySelector('.response-status');
    if (!responseStatusElement) return;

    let countdown = seconds;
    responseStatusElement.innerText = `${countdown}`; // Initial display

    const countdownInterval = setInterval(() => {
        countdown--;
        responseStatusElement.innerText = `${countdown}`;

        if (countdown <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);
}

function ensureStatsDisplayed() {
    const statsAreas = document.querySelectorAll('.thread-stats');

    const deletedCount = document.querySelectorAll('.post-deleted').length;
    const ghostCount = document.querySelectorAll('.post-ghost').length;

    statsAreas.forEach(statsArea => {
        let insertBeforeElement = statsArea.nextSibling; // Start with the next sibling

        // Loop to find the next element sibling or the <hr class="mobile"> to insert before it
        while (insertBeforeElement && insertBeforeElement.nodeType !== Node.ELEMENT_NODE) {
            insertBeforeElement = insertBeforeElement.nextSibling;
        }

        // Check if the next element is <hr class="mobile">, if so, adjust the insertBeforeElement to this
        if (insertBeforeElement && insertBeforeElement.classList.contains('mobile')) {
            // Insert before <hr class="mobile">
        } else {
            // No <hr class="mobile"> found, default to next sibling logic
            insertBeforeElement = getNextElementSibling(statsArea);
        }

        let statsContainer = getNextElementSibling(statsArea);

        if (!statsContainer || !statsContainer.classList.contains('gm-stats-container')) {
            const gmStats = document.createElement("div");
            gmStats.className = "gm-stats-container";
            gmStats.innerHTML = `<span class="text-muted"> [<span class="response-status" style="color: ${responseStatusColor}">${responseStatus}</span> | D: <span class="gm-stats-deleted">${deletedCount}</span> / G: <span class="gm-stats-ghost">${ghostCount}</span>]</span>`;
            statsArea.parentNode.insertBefore(gmStats, insertBeforeElement); // Adjusted insertion logic
        } else {
            statsContainer.innerHTML = `<span class="text-muted"> [<span class="response-status" style="color: ${responseStatusColor}">${responseStatus}</span> | D: <span class="gm-stats-deleted">${deletedCount}</span> / G: <span class="gm-stats-ghost">${ghostCount}</span>]</span>`;
        }
    });
}

function getNextElementSibling(element) {
    let nextSibling = element.nextSibling;
    while (nextSibling && nextSibling.nodeType !== Node.ELEMENT_NODE) {
        nextSibling = nextSibling.nextSibling;
    }
    return nextSibling;
}

function parseBackLinks(threadId, posts) {
	// if we have the native 4chan extension loaded and backlinks are enabled, parse the backlinks for the deleted posts
	if (unsafeWindow.Config && unsafeWindow.Config.backlinks && unsafeWindow.Parser) {
		const strThreadId = threadId.toString();
		for (const post of posts) {
			// XXX: backlinks will be out of order for now... is it worth fixing them?
			unsafeWindow.Parser.parseBacklinks(post.num, strThreadId)
		}
	}
}

function setLoader() {
	document.body.classList.add('interlacing-loader');
}

function unsetLoader() {
	document.body.classList.remove('interlacing-loader');
}

async function initThreadUpdatedPatch(api, board, threadId) {
	const TUUpdate = unsafeWindow.ThreadUpdater.update;
	unsafeWindow.ThreadUpdater.update = async function(e) {
		TUUpdate.call(this, e);

		try {
			setLoader();

			const res = await getThread(api, board, threadId, lastModified);
			if (!res?.[threadId]?.posts) return unsetLoader();

			const ghostPosts = Object.values(res[threadId].posts).filter(p => +p.subnum && !document.getElementById(`pc${p.num}_${p.subnum}`)).sort((a, b) => +a.num - +b.num || +a.subnum - +b.subnum);

			if (!ghostPosts.length) return unsetLoader();

			for (const post of ghostPosts) {
				await insertGhost(post, threadId);
			}

			console.log(`[GhostPostMixer-ThreadUpdater.update] interleaved ${ghostPosts.length} ghost posts`);
			document.body.querySelectorAll('.gm-stats-ghost').forEach(e => {e.innerText = +e.innerText + ghostPosts.length});
		} finally {
			unsetLoader();
		}
	}
}

async function init() {
	try {
		// Get thread id
		const parts = window.location.pathname.split("/");
		const threadId = parseInt(parts[3]);
		const boardId = parts[1];

		const api = apis[boardId];
		if (!api) throw new Error(`Unknown board: ${boardId}`);

		console.log('[GhostPostMixer-init] interleaving posts');
		//setLoader();

		// Fetch thread from archives
		const res = await getThread(api, boardId, threadId);
		if (!res?.[threadId]?.posts) throw new Error(`No posts found for thread ${threadId}`);

		const posts = Object.values(res[threadId].posts).sort((a, b) => +a.num - +b.num || +a.subnum - +b.subnum); // this sorting may be useless, but better be safe than sorry

		const ghosts = posts.filter(p => +p.subnum);
		const deleted = posts.filter(p => p.deleted === '1');

		for (const post of deleted) {
			await insertDeleted(post, posts);
		}
		parseBackLinks(threadId, deleted);

		for (const post of ghosts) {
			await insertGhost(post, threadId);
		}

		// we patch this late on purpose, in case someone presses update before we're done.
		if (unsafeWindow.ThreadUpdater) {
			//initThreadUpdatedPatch(api, boardId, threadId);
		}

		// Update the thread stats with what we interleaved
		console.log(`[GhostPostMixer-init] interleaved ${deleted.length} deleted posts and ${ghosts.length} ghost posts`);
	} finally {
		//unsetLoader()
        ensureStatsDisplayed();
        enforceBacklinks();
        sortComments(byDeletedPostsFirst);
        convert4pcdnURLs();
	}

}

// Define your function
function enforceBacklinks() {

    const isMobile = window.innerWidth <= 768; // Adjust this threshold as needed
    const postInfoSelector = isMobile ? '.postInfoM' : '.postInfo';
    checkDeletedPosts();

//removed waiting for posts with greater than 0 quotes disconnect, removed observer. calls after deleted post insertion and parsed backlinks, overwrites backlinks for delets posts
function checkDeletedPosts() {
    const deletedPosts = document.querySelectorAll('.postContainer.replyContainer.post-deleted');
    deletedPosts.forEach(deletedPost => {
        const deletedPostId = deletedPost.id.replace('pc', '');
        let backlinkContainer;
        if (isMobile) {
            // For mobile, backlink container should be placed after the post message block
            const postMessageBlock = deletedPost.querySelector('.postMessage');
            const nextSibling = postMessageBlock.nextElementSibling;
            if (!nextSibling || !nextSibling.classList.contains('backlink', 'mobile')) {
                backlinkContainer = document.createElement('div');
                backlinkContainer.className = 'backlink mobile';
                deletedPost.insertBefore(backlinkContainer, nextSibling);
            } else {
                backlinkContainer = nextSibling;
            }
        } else {
            // For desktop, backlink container should be under postInfo
            backlinkContainer = deletedPost.querySelector('.postInfo .backlink');
            if (!backlinkContainer) {
                backlinkContainer = document.createElement('div');
                backlinkContainer.className = 'backlink';
                deletedPost.querySelector('.postInfo').appendChild(backlinkContainer);
            }
        }

        const quotelinks = document.querySelectorAll(`.postMessage .quotelink[href="#p${deletedPostId}"]`);
        quotelinks.forEach(quote => {
            const postId = quote.closest('.postContainer').id.replace('pc', '');
            if (!backlinkContainer.querySelector(`a[href="#p${postId}"]`)) {
                console.log(`Adding backlink for post ${postId} in deleted post ${deletedPostId}`);
                const newLink = document.createElement('a');
                newLink.href = `#p${postId}`;
                newLink.className = 'quotelink';
                newLink.textContent = `>>${postId}`;
                const newSpan = document.createElement('span');
                newSpan.appendChild(newLink);
                backlinkContainer.appendChild(newSpan);
                const space = document.createTextNode(' ');
                newSpan.appendChild(space);
            }
        });

    });
}


}




// Add CSS
const css = `
div.post.ghost {
	background-color: #ddd;
}
div.post.del {
	background-color: #eab3b3;
}

.tomorrow div.post.ghost {
	background-color: #282a88;
}
.tomorrow div.post.del {
	background-color: #882a2e;
}

.text-muted {
	color: #6c757d!important;
}

.post-ghost {
	margin-left: 2em;
}

blockquote>span.greentext {
	color: #789922;
}

body.interlacing-loader::before {
	content: '';
	position: fixed;
	bottom: 0;
	left: 0;
	border-bottom: 0.4rem solid red;
	animation: loading 2s linear infinite;
}
    /* Default styles for all devices */
    .gm-stats-container {
        color: #c5c8c6;
        cursor: default;
        display: block; /* Makes the div a block-level element */
    }

    /* Mobile-specific styles (e.g., less than 600px wide) */
    @media (max-width: 600px) {
        .gm-stats-container {
            text-align: center;
        }
    }

    /* Desktop-specific styles (e.g., more than 601px wide) */
    @media (min-width: 601px) {
        .gm-stats-container {
            float: right; /* Align to the right */
            margin-right: 5px; /* Space from the right edge */
        }
    }
@keyframes loading {
	0% {
		left:0%;
		right:100%;
		width:0%;
	}
	10% {
		left:0%;
		right:75%;
		width:25%;
	}
	90% {
		right:0%;
		left:75%;
		width:25%;
	}
	100% {
		left:100%;
		right:0%;
		width:0%;
	}
}
`;

const style = document.createElement("style");
style.setAttribute('type', 'text/css')
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

init();
