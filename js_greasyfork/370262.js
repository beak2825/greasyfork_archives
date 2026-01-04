// ==UserScript==
// @name        HorribleSubs Enhancements
// @namespace   Violentmonkey Scripts
// @version     1.2.2
// @description Restores the download links in the latest releases on the front page. More to come?
// @author      Hajile-Haji
// @homepage    https://github.com/Hajile-Haji/HorribleSubs-Enhancments
// @match       https://horriblesubs.info/
// @downloadURL https://update.greasyfork.org/scripts/370262/HorribleSubs%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/370262/HorribleSubs%20Enhancements.meta.js
// ==/UserScript==

const releases = document.querySelector('.latest-releases');
const css = `.latest-releases .appended-links{background-color:#FFF;box-shadow:0 3px 5px -4px rgba(0,0,0,.4) inset}.latest-releases .appended-links a{color:#DA4453;display:inline;padding:0}.latest-releases .appended-links a:hover{background-color:transparent!important;color:#DADADA}.loader,.loader:after,.loader:before{border-radius:50%;width:2.5em;height:2.5em;-webkit-animation:load7 1.8s infinite ease-in-out;animation:load7 1.8s infinite ease-in-out}.loader{color:#AAA;font-size:10px;margin:5px auto;position:relative;text-indent:-9999em;-webkit-transform:translate(0,-2.5em);-ms-transform:translateZ(0);transform:translate(0,-2.5em);-webkit-animation-delay:-.16s;animation-delay:-.16s;z-index:0}.loader::after,.loader::before{content:'';position:absolute;top:0}.loader::before{left:-3.5em;-webkit-animation-delay:-.32s;animation-delay:-.32s}.loader::after{left:3.5em}@-webkit-keyframes load7{0%,100%,80%{box-shadow:0 2.5em 0 -1.3em}40%{box-shadow:0 2.5em 0 0}}@keyframes load7{0%,100%,80%{box-shadow:0 2.5em 0 -1.3em}40%{box-shadow:0 2.5em 0 0}}`;

let initialLoad = true;

const setupObserver = () => {
	const config = {
		attributes: false,
		childList: true,
		subtree: false
	};
	const callback = mutations => {
		for (let mutation of mutations) {
			if (mutation.type == 'childList') {
				setup();
			}
		}
	};
	const observer = new MutationObserver(callback);

	observer.observe(releases, config);
};

const setup = () => {
	if (initialLoad) {
		initialLoad = false;
		injectCSS();
	}

	processLinks();

	// For some reason HS thought that putting ads in the list was a good idea (<ul><div>adszzzz</div></ul>), so let's remove those.
	releases.querySelectorAll('ul > div').forEach(i => i.remove());
};

const injectCSS = () => {
	const style = document.createElement('style');

	style.innerText = css;
	releases.parentNode.appendChild(style);
};

const processLinks = () => {
	const triggers = releases.querySelectorAll('ul > li:not([data-processed]) > a');

	triggers.forEach(trigger => {
		const data = trigger.parentNode.dataset;

		data.processed = '';
		data.clicked = false;
		data.openState = false;

		bindClick(trigger);
	});
};

const bindClick = item => {
	item.addEventListener('click', e => {
		e.preventDefault();

		const link = e.target.closest('a');
		const episodeNumber = link.hash.match(/\d+-?\d+/g)[0];
		const parent = link.parentNode;
		const data = parent.dataset;

		if (data.clicked.toBool()) {
			toggleShowState(parent);
		} else {
			const loader = injectLoader(parent);

			data.clicked = true;

			setupSeriesContent(link.pathname, episodeNumber, parent)
				.then(() => loader.remove());
		}
	});
};

const setupSeriesContent = (seriesUrl, episodeNumber, parent) => {
	return new Promise((resolve, reject) => {
		getSeriesPage(seriesUrl).then(seriesElements => {
			const seriesID = getSeriesID(seriesElements);
			const seriesContent = getSeriesContent(seriesElements);

			// Add Episode number to series title
			seriesContent.querySelector('h3').append(` - ${episodeNumber.replace(/-/, '.')}`);
			// Added event listener to more link
			seriesContent.querySelector('.series-link')
				.addEventListener('click', e => window.location = seriesUrl);

			getEpisodesList(seriesID).then(linkElements => {
				const linkContent = getDownloadLinks(linkElements, episodeNumber);
				linkContent.classList.remove('rls-links-container');
				linkContent.classList.add('appended-links');

				linkContent.insertBefore(seriesContent.firstChild, linkContent.firstChild);
				linkContent.appendChild(renderStringToHTML('<br>'));
				parent.appendChild(linkContent);
				resolve();
			});
		});
	});
};

const getSeriesPage = url => {
	return new Promise((resolve, reject) => {
		getDocumentBody(url).then(res => resolve(renderStringToHTML(res)));
	});
};

const getSeriesID = elements => {
	const scriptElements = Array.from(elements.querySelectorAll('script'));
	return scriptElements.filter(s => s.innerText.includes('hs_showid'))[0].innerText.match(/\d+/g)[0];
};

const getEpisodesList = seriesID => {
	return new Promise((resolve, reject) => {
		getDocumentBody(`/api.php?method=getshows&type=show&showid=${seriesID}`)
			.then(response => resolve(renderStringToHTML(response)));
	});
};

const getDownloadLinks = (elements, episodeNumber) => {
	return elements
		.getElementById(episodeNumber)
		.querySelector('.rls-links-container');
};

const getCharCode = (str, start) => {
	const subStr = str.substr(start, 2);

	return parseInt(subStr, 16);
}

const decodeCFEmail = str => {
	const a = getCharCode(str, 0);
	let newStr = '';

	for (let counter = 2; counter < str.length; counter += 2) {
		const charCode = getCharCode(str, counter) ^ a;

		newStr += String.fromCharCode(charCode);
	}

	return newStr;
}

const fixCFEmailCrap = ele => {
	Array.from(ele.children).forEach(element => {
		if (element.classList.contains('__cf_email__')) {
			const text = decodeCFEmail(element.dataset.cfemail);
			const textNode = document.createTextNode(text);
			element.parentNode.replaceChild(textNode, element);
		}
	});
};

const getSeriesInfo = elements => {
	const imageUrl = elements.querySelector('.series-image img').src;
	const oldDescription = elements.querySelector('.series-desc');
	const description = Array.from(oldDescription.children)
		// Get all items in description other than "description" title
		.filter(i => i !== oldDescription.firstElementChild)
		.map(x => {
			fixCFEmailCrap(x);

			return x;
		})
		// Get all other items as strings
		.map(i => i.outerHTML)
		.join('')
		// Remove tabs, newlines, returns, and multiple spaces.
		.replace(/\t|\n|\r|  +/gm, '')
		.trim();
	let title = elements.querySelector('h1.entry-title');
	fixCFEmailCrap(title);
	title = title.textContent;

	return {
		title,
		description,
		imageUrl
	}
};

const getSeriesContent = elements => {
	// <div class="container-fluid">
	//     <br>
	//     <div class="row">
	//         <div class="col-md-4"><img src=""></div>
	//         <div class="col-md-8">
	//             <!-- Description Here -->
	//             <p><input type="button" class="series-link btn btn-primary" value="More Episodes"></p>
	//         </div>
	//     </div>
	//     <h4 class="text-center">Downloads</h4>
	// </div>
	const info = getSeriesInfo(elements);
	const template =
		`<div class="container-fluid"><br><div class="row"><div class="col-md-4"><img src="${info.imageUrl}"></div>` +
		`<div class="col-md-8"><h3 style="margin-top: 0;">${info.title}</h3>${info.description}` +
		`<p><input type="button" class="series-link btn btn-primary" value="More Episodes"></p></div></div><h4 class="text-center">Downloads</h4></div>`;

	return renderStringToHTML(template);
};

const injectLoader = parent => {
	const loader = document.createElement('div');

	loader.classList.add('loader');
	loader.innerText = 'Loading...';
	parent.appendChild(loader);
	parent.dataset.openState = true;

	return loader;
};

const toggleShowState = parent => {
	if (parent.dataset.openState.toBool()) {
		parent.dataset.openState = false;
		parent.lastElementChild.classList.add('hide');
	} else {
		parent.dataset.openState = true;
		parent.lastElementChild.classList.remove('hide');
	}
};

const renderStringToHTML = data => {
	return document
		.createRange()
		.createContextualFragment(data);
};

const getDocumentBody = url => {
	return new Promise((resolve, reject) => {
		fetch(url)
			.then(response => response.text())
			.then(body => resolve(body))
			.catch(error => {
				throw Error(error);
			});
	});
};

String.prototype.toBool = function() {
	let bool = undefined;
	if (this.toLowerCase() === 'true') bool = true;
	if (this.toLowerCase() === 'false') bool = false;
	if (typeof bool === 'boolean') return bool;
	throw Error('String is not a boolean.');
};

setupObserver();