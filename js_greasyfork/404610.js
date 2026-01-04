// ==UserScript==
// @name         WordPress Blog: Kopie článku do schránky
// @version      1.04
// @match        https://www.pravyprostor.net/*
// @match        https://pravyprostor.net/*
// @match        https://www.pravyprostor.cz/*
// @match        https://pravyprostor.cz/*
// @match        https://www.novarepublika.online/*
// @match        https://novarepublika.online/*
// @match        https://www.novarepublika.cz/*
// @match        https://novarepublika.cz/*
// @match        https://vlkovobloguje.wordpress.com/*
// @match        https://www.svobodny-svet.cz/*
// @match        https://svobodny-svet.cz/*
// @match        https://www.litterate.cz/*
// @match        https://web.litterate.cz/*
// @match        https://litterate.cz/*
// @match        https://www.aeronet.news/*
// @match        https://aeronet.news/*
// @match        https://www.pokec24.cz/*
// @match        https://pokec24.cz/*
// @match        https://www.zvedavec.news/*
// @match        https://zvedavec.news/*
// @match        https://www.michalapetr.com/*
// @match        https://michalapetr.com/*
// @match        https://www.kechlibar.net/*
// @match        https://kechlibar.net/*
// @match        https://www.prvnizpravy.cz/*
// @match        https://prvnizpravy.cz/*
// @match        https://www.casopisargument.cz/*
// @match        https://casopisargument.cz/*
// @match        https://www.protiproud.info/*
// @match        https://protiproud.info/*
// @match        https://www.protiproud.cz/*
// @match        https://protiproud.cz/*
// @match        https://www.epochtimes.cz/*
// @match        https://epochtimes.cz/*
// @match        https://cnn.iprima.cz/nazory
// @match        https://cnn.iprima.cz/komentar-*
// @match        https://www.ac24.cz/*
// @match        https://ac24.cz/*
// @match        https://www.iportal24.cz/*
// @match        https://iportal24.cz/*
// @match        https://www.institutvk.cz/*
// @match        https://institutvk.cz/*
// @run-at       document-end
// @namespace    https://greasyfork.org/users/198317
// @description  Kopíruje pouze obsah článku bez vložených reklam a dalšího balastu
// @author       Trumpeta
// @iconURL      https://s0.wp.com/i/favicon.ico
// @copyright    2024, Trumpeta (https://greasyfork.org/users/198317)
// @license      GPL-3.0-or-later
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/490257/WordPress%20Blog%3A%20Kopie%20%C4%8Dl%C3%A1nku%20do%20schr%C3%A1nky.user.js
// @updateURL https://update.greasyfork.org/scripts/490257/WordPress%20Blog%3A%20Kopie%20%C4%8Dl%C3%A1nku%20do%20schr%C3%A1nky.meta.js
// ==/UserScript==

'use strict';

if (typeof GM_setClipboard != 'function') throw 'GM extensions not available';

const getArticleText = url => (url ? new Promise(function(resolve, reject) {
	const xhr = new XMLHttpRequest;
	xhr.open('GET', url, true);
	xhr.setRequestHeader('Accept', 'text/html');
	xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	xhr.responseType = 'document';
	xhr.onload = function() {
		if (this.status >= 200 && this.status < 400) resolve(this.response);
			else reject(`HTTP error ${this.status} (${this.statusText})`);
	};
	xhr.onerror = () => { reject(`HTTP error ${xhr.readyState}/${xhr.status} (${xhr.statusText})`) };
	xhr.ontimeout = () => { reject('HTTP timeout') };
	xhr.timeout = 60000;
	xhr.send();
}) : Promise.resolve(document)).then(function(document) {
	if (!(document instanceof HTMLDocument)) throw 'Assertion failed: not a document';
	if (!Array.isArray(siteConfig.articleSelectors)) throw 'Invalid article selectors';
	return [
		[/(?:\r?\n)*^(?:(Sledujte|Čtěte)(?: ZDE)?:.*|Zdroj\.)$/igm, ''], // ProtiProud
		[/(?:\r?\n)*^(?:ČTĚTE TAKÉ:|K TÉMATU:|MOHLO BY VÁS ZAJÍMAT:) .*$/igm, ''], // CNN Prima News
		[/(?:\r?\n)*^(?:Téma: Názory)$/gm, ''], // CNN Prima News
		[/^(?:KOMENTÁŘ: )/gm, ''], // CNN Prima News
		[/(?:\r?\n)*^Související články:$[\S\s]*/gm, ''], // PL
		[/(?:\r?\n)*^Psali jsme:$(?:\r?\n)+^.+$/gm, ''], // PL
	].reduce((result, args) => result.replace(...args), siteConfig.articleSelectors.map(selector => (function() {
		let ignoredStart = true, ignoredTail = false;
		return Array.prototype.filter.call(document.body.querySelectorAll(selector), function(elem) {
			ignoredStart = false;
			switch (elem.nodeName) {
				case 'DIV':
					if ([
						'abh_box', 'abh_box_down', 'abh_box_fancy', // PP
						'awac-wrapper', // S-S, kechlibar
						'cisBottom', // PP
						'wpdiscuz-post-rating-wrap',
					].some(DOMTokenList.prototype.contains.bind(elem.classList))) ignoredTail = true;
				case 'FOOTER':
					if (['entry-footer'].some(DOMTokenList.prototype.contains.bind(elem.classList))) ignoredTail = true;
					break;
			}
			return !ignoredStart && !ignoredTail;
		});
	})().map(function getNodeText(node) {
		const hasClass = (...classes) => classes.some(DOMTokenList.prototype.contains.bind(node.classList));
		const hasId = (...ids) => ids.includes(node.id);
		if (node instanceof Node) switch (node.nodeType) {
			case Node.TEXT_NODE:
				return node.wholeText/*.trim()*/;
			case Node.ELEMENT_NODE: {
				if ([
					'AUDIO', 'BASE', 'BUTTON', 'CANVAS', 'COL', 'COLGROUP', 'DATALIST', 'DETAILS', 'DIALOG', 'EMBED',
					'FIELDSET', 'FORM', 'HEAD', 'IMG', 'INPUT', 'LEGEND', 'LINK', 'MAP', 'META', 'METER', 'NOSCRIPT',
					'OBJECT', 'OPTGROUP', 'OPTION', 'PARAM', 'PROGRESS', 'SCRIPT', /*'SECTION', */'SELECT', 'SOURCE', 'STYLE',
					'SUMMARY', 'SVG', 'TEMPLATE', 'TEXTAREA', 'TITLE', 'TRACK', 'VIDEO', 'FOOTER',
				].includes(node.nodeName)) return;
				if (node.hidden || ['hidden', 'collapse'].includes(node.style.visibility) || node.style.display == 'none'
						|| node.parentNode == null) return;
				if (hasClass('wp-copy-btn', 'ads-intelaxa')) return;
				if (document.domain.includes('protiproud.')) {
					if (/^H\d$/.test(node.nodeName) && node.style.textAlign == 'center') return;
					if (node.nodeName == 'P' && node.style.textAlign == 'center' && node.childElementCount == 1
							&& node.firstElementChild.nodeName == 'A' && node.firstElementChild.hostname == window.document.location.hostname)
						return;
				}
				switch (node.nodeName) {
					case 'DIV':
						if (document.domain.includes('protiproud.')) {
							if (hasClass('clkInfoStrip', 'doporucujeme') || ['section no-brdr'].includes(node.className)
									|| /_reklamaWP1$/i.test(node.id)/* || node.id == 'kwsTags'*/) return;
						}
						if (document.domain == 'cnn.iprima.cz' && hasClass('infobox', 'play-video', 'related-article')) return;
						if (hasId('dpsp-content-bottom') || hasClass(
							'topad', 'addtoany_content_top', 'addtoany_share_save_container', 'social-sharing', // common ads & infotainment
							'cs-rating', 'pd-rating', 'sharedaddy', 'rating-msg', // KOSA distinct
							'wpdiscuz-post-rating-wrap', // www.pokec24.cz
							'adswrapper_post', // AC24
						)) return;
						var before = '\n\n', after;
						break;
					case 'P':
						if (hasClass('dpsp-share-text')) return;
						before = '\n\n';
						break;
					case 'SECTION':
						//if (hasClass('section-brown', 'related-articles')) return; // PL
					case 'TABLE':
					case 'H1': case 'H2': case 'H3': case 'H4': case 'H5': case 'H6':
					case 'UL': case 'OL':
						before = '\n\n';
						break;
					case 'DD': case 'TR': case 'BR': case 'HR': case 'LI':
						before = '\n';
						break;
					case 'SPAN':
						break;
				}
				return (before || '') + Array.from(node.childNodes, getNodeText).filter(Boolean).join('') + (after || '');
			}
		}
	}).filter(Boolean).map(text => [
		[/^[ \t\xA0]+/mg, ''],
		[/[ \t\xA0]+$/mg, ''],
		[/(?:[ \t\xA0]*\r?\n){3,}/mg, '\n\n'],
		[/[ \t\xA0]+/g, ' '],
	].reduce((result, args) => result.replace(...args), text.trim())).filter(Boolean).join('\n\n')).filter(Boolean).join('\n\n'));
});

function setHoverHandler(elem, on = true) {
	if (elem instanceof HTMLElement) elem.onmouseenter = elem.onmouseleave = on ? function(evt) {
		if (evt.relatedTarget == evt.currentTarget || evt.currentTarget.disabled) return false;
		evt.currentTarget.style.backgroundColor = evt.type == 'mouseenter' ? 'darkorange'
			: evt.currentTarget.dataset.bgColor || null;
	} : null; else throw 'Invalid argument';
}
function createButton(content, url) {
	if (!content) return null;
	let span = Object.assign(document.createElement('span'), {
		style: 'display: inline-block; float: right; position: relative; top: 0; right: 0; padding: 0; margin: 0 0 0 5pt; border: none;',
		className: 'wp-copy-article-text',
	}), button = Object.assign(document.createElement('button'), {
		style: 'padding: 5px 8px; color: white; font: bold 10pt "Segoe UI", sans-serif; cursor: pointer; border: none; border-radius: 5pt; box-shadow: black 0px 0px 2pt; transition: background-color 250ms;',
		onclick: function(evt) {
			evt.stopPropagation();
			if ((button = evt.currentTarget).disabled) return false; else button.disabled = true;
			const animation = url ? button.animate([
				{ offset: 0.0, opacity: 1 },
				{ offset: 0.4, opacity: 1 },
				{ offset: 0.5, opacity: 0.1 },
				{ offset: 0.9, opacity: 0.1 },
			], { duration: 600, iterations: Infinity }) : null;
			setHoverHandler(button, false);
			button.style.backgroundColor = 'orange';
			button.style.cursor = 'wait';
			getArticleText(url).then(function(articleText) {
				GM_setClipboard(articleText + '\n\n' + '-'.repeat(80) + '\n\n', 'text');
				button.dataset.bgColor = button.style.backgroundColor = 'green';
			}, function(reason) {
				button.dataset.bgColor = button.style.backgroundColor = 'red';
				alert(reason);
			}).then(function() {
				button.style.cursor = 'pointer';
				setHoverHandler(button, true);
				if (animation != null) animation.cancel();
				button.disabled = false;
			});
			return false;
		},
		title: 'Zkopíruj text článku do schránky',
	});
	button.append(content);
	button.dataset.bgColor = button.style.backgroundColor = 'olive';
	setHoverHandler(button);
	span.append(button);
	return span;
}

const siteConfig = { };
switch (document.domain) {
	case 'www.pravyprostor.net': case 'pravyprostor.net':
	case 'www.pravyprostor.cz': case 'pravyprostor.cz':
		Object.assign(siteConfig, {
			singlePostSelector: 'body.single-post div.single_post > header > h1.title',
			postsSelectors: [
				'article.post > header > h2.title',
				'ul.slides > li',
				'div.meta-cat > h2.title',
			],
			articleSelectors: [
				'article div.single_post > header > h1.title',
				'article div.single_post div.clanek-detail-zdroj',
				'article div.single_post span.post_author_create',
				'article div.post-single-content > *',
				//'article div.post-single-content > div.topad > *',
			],
		});
		break;
	case 'vlkovobloguje.wordpress.com':
		Object.assign(siteConfig, {
			singlePostSelector: 'body.single-post div#container > div#content > div.post > h2.entry-title',
			listBase: 'div#container > div#content',
			postsSelectors: 'div.post > h2.entry-title',
			articleSelectors: [
				'h2.entry-title',
				'div.entry-meta',
				'div.entry-content',
			],
		});
		break;
	case 'www.svobodny-svet.cz': case 'svobodny-svet.cz':
		Object.assign(siteConfig, {
			singlePostSelector: 'body.single-post div#main-content > article[id] > div.entry-content > div.addtoany_share_save_container',
			postsSelectors: 'article.post > div > header > h3.entry-title',
			articleSelectors: [
				'article header h1.entry-title',
				'article header span.entry-meta-date',
				'article div.entry-content > *',
			],
		});
		break;
	case 'www.pokec24.cz': case 'pokec24.cz':
		Object.assign(siteConfig, {
			singlePostSelector: 'body.single-post div#cm-content article div.cm-below-entry-meta',
			postsSelectors: 'article header.cm-entry-header > h2.cm-entry-title',
			articleSelectors: [
				'article header h1.cm-entry-title',
				'article div.cm-below-entry-meta > span.cm-post-date time:first-of-type',
				'article div.cm-below-entry-meta > span.cm-author',
				'article div.cm-entry-summary > *',
			],
		});
		break;
	case 'www.litterate.cz': case 'web.litterate.cz': case 'litterate.cz':
		Object.assign(siteConfig, {
			singlePostSelector: 'body.single-post main#main > article header > div.entry-meta',
			articleSelectors: [
				'article header h1.entry-title',
				'article header span.posted-on time.entry-date',
				'article header span.author',
				'article div.entry-content > *',
			],
			postsSelectors: 'article header.entry-header > h2.entry-title',
		});
		break;
	case 'www.novarepublika.online': case 'novarepublika.online':
	case 'www.novarepublika.cz': case 'novarepublika.cz':
		Object.assign(siteConfig, {
			singlePostSelector: 'body.single-post div#primary > article header h1.entry-title',
			articleSelectors: [
				'article > header h1.entry-title',
				'article > header div.post-meta-wrapper li.post-date > span.meta-text',
				'article > div.author-info-wrapper span.author-text-name',
				'article > header div.intro-text',
				'article div.entry-content > *',
			],
			postsSelectors: 'article h3',
		});
		break;
	case 'www.zvedavec.news': case 'zvedavec.news':
		siteConfig.singlePostSelector = 'article#clanek > h1';
		siteConfig.postsSelectors = 'article h3';
		siteConfig.articleSelectors = [
			'article > h1',
			'article span.detaily > span:first-of-type',
			'article > p.autor',
			'article > header div.intro-text',
			'article section.perex',
			'article section.clanek-obsah',
		];
		break;
	case 'www.aeronet.news': case 'aeronet.news':
		Object.assign(siteConfig, {
			singlePostSelector: 'body.single-post article > header > h1 + div.meta-info',
			postsSelectors: ['div.td-sbig-title-wrap', 'div.item-details > h3.entry-title'],
			articleSelectors: [
				'article > header > h1',
				'article > header > div.meta-info time.entry-date',
				'article > div.td-post-text-content > *',
			],
		});
		break;
	case 'www.michalapetr.com': case 'michalapetr.com':
		Object.assign(siteConfig, {
			singlePostSelector: 'body.single-post article  header > h1',
			articleSelectors: [
				'article header > h1',
				'article header > span.post-meta-infos',
				'article div.entry-content > *',
			],
			postsSelectors: 'article header.entry-content-header > h2.entry-title',
		});
		break;
	case 'www.kechlibar.net': case 'kechlibar.net':
		Object.assign(siteConfig, {
			singlePostSelector: 'body.single-post article div.post-header > div.post-meta',
			articleSelectors: [
				'article div.post-header > h1',
				'article div.post-header > div.post-meta',
				'article div.entry-content > *',
			],
			postsSelectors: 'article div.post-header > h2',
		});
		break;
	case 'www.prvnizpravy.cz': case 'prvnizpravy.cz':
		Object.assign(siteConfig, {
			singlePostSelector: 'div.zpravy_full > div.category',
			articleSelectors: [
				'div.zpravy_full > h1',
				'div.zpravy_full > div.time',
				'div.zpravy_full > p.description',
				'div.zpravy_full > div.text',
			],
			postsSelectors: 'a[class] > div.other > h2',
		});
		break;
	case 'www.casopisargument.cz': case 'casopisargument.cz':
		Object.assign(siteConfig, {
			singlePostSelector: 'body.single-post main#main.site-main > article > div.entry-content > div.addtoany_share_save_container',
			articleSelectors: [
				'main#main.site-main > article > header > h1',
				'main#main.site-main > article > header > div.entry-meta span.posted-on > time.updated',
				'main#main.site-main > article > header > div.entry-meta span.author',
				'main#main.site-main > article > div.entry-content > *',
			],
			postsSelectors: 'main#main.site-main > article > header.entry-header > div.entry-meta',
			postsArticleLinkSelector: 'h2.entry-title > a',
		});
		break;
	case 'www.protiproud.info': case 'protiproud.info':
	case 'www.protiproud.cz': case 'protiproud.cz':
		Object.assign(siteConfig, {
			singlePostSelector: 'div#Content > div#cphCONTENT_pnlTop div.clkSocIcons',
			articleSelectors: [
				'div#ArticleTop > h1',
				'div#ArticleTop > div.clkInfoStrip > p.clkDtm',
				'div#ArticleTop > p.clkPerex',
				'div#Article > *',
			],
			postsSelectors: 'div#Content div#Articles div.article > .clkLink',
			postsArticleLinkSelector: 'a.more',
		});
		break;
	case 'www.epochtimes.cz': case 'epochtimes.cz':
		Object.assign(siteConfig, {
			singlePostSelector: 'body.single-post main#main article.post div.container div.page-main div.d-flex',
			articleSelectors: [
				'main#main article.post div.container div.page-main header.page-header h1.page-title',
				'main#main article.post div.container div.page-main div.d-flex a.author',
				'main#main article.post div.container div.page-main div.d-flex span.text-secondary',
				'main#main article.post div.container div.page-main div.page-content',
			],
			postsSelectors: 'main#main div.articles > div.article *.post-title',
		});
		break;
	case 'cnn.iprima.cz':
		Object.assign(siteConfig, {
			singlePostSelector: 'div.main-container > div.content > article > header.main-article-header > ul',
			articleSelectors: [
				'div.main-container > div.content > article > header.main-article-header > h1',
				'div.main-container > div.content > article > header.main-article-header > ul > li',
				'div.main-container > div.content > article > div.article-detail > main > div.padding-wrapper > p.lead',
				'div.main-container > div.content > article > div.article-detail > main > div.padding-wrapper > div#article-inner-content',
			],
			postsSelectors: 'h3',
		});
		break;
	case 'www.ac24.cz': case 'ac24.cz':
		Object.assign(siteConfig, {
			singlePostSelector: 'body.single-post article > header div.entry-meta',
			articleSelectors: [
				'article > header h1',
				'article > header span.post-date > time.published',
				'article > header span.author.vcard',
				'article > div.post-content',
			],
			postsSelectors: ['article div.details-overlap', 'article div.entry-details'],
			postsArticleLinkSelector: 'h2.entry-title > a',
		});
		break;
	case 'www.iportal24.cz': case 'iportal24.cz':
		Object.assign(siteConfig, {
			singlePostSelector: 'body.single-post article div.tdb_single_post_share',
			articleSelectors: [
				'article div.tdb_title h1.tdb-title-text',
				'article div.tdb_single_author a.tdb-author-name',
				'article div.tdb_single_date time.entry-date.updated',
				'article div.tdb_single_content',
			],
			postsSelectors: 'h3.entry-title',
		});
		break;
	case 'www.institutvk.cz': case 'institutvk.cz':
		Object.assign(siteConfig, {
			singlePostSelector: 'div.clanek-detail > div.clanek-detail-titulek > div.podnadpis',
			articleSelectors: [
				'div.clanek-detail > div.clanek-detail-titulek',
				'div.clanek-detail div.clanek-autor2',
				'div.clanek-detail > div.clanek-detail-text',
			],
			postsSelectors: [
				'div.datum-line > div.datum-line-titulek1 > a > div.podnadpis',
				'div.clanek-vypis > a > div.clanek-vypis-titulek > div.podnadpis',
			],
		});
		break;
	default: throw 'Unsupported domain';
}

const singlePostContainer = document.body.querySelector(siteConfig.singlePostSelector);
if (singlePostContainer != null) {
	singlePostContainer.append(createButton('COPY'));
	if (['www.pravyprostor.net', 'pravyprostor.net', 'www.pravyprostor.cz', 'pravyprostor.cz'].includes(document.domain)) {
		const trolls = GM_getValue('trolls', [ ]);
		for (let elem of document.body.querySelectorAll('div#comments [id^="comment-"] > div.comment-author.vcard div.comment-metadata > span.fn')) {
			const userName = elem.textContent.trim();
			if (!userName) continue; // assertion failed
			if (trolls.some(function(trollDef) {
				if (/^\/(.+)\/([dgimsuy]*)$/i.test(trollDef)) try {
					return new RegExp(RegExp.$1, RegExp.$2).test(userName);
				} catch(e) { console.warn('Invalid regexdp', trollDef, e) }
				return userName.toLowerCase() == trollDef.toLowerCase();
			})) {
				elem.parentNode.parentNode.parentNode.style = 'background-color: #F002;';
				elem.textContent = '<<< TROLL >>>';
				elem.classList.add('troll');
				const avatar = elem.parentNode.parentNode.querySelector('img.avatar');
				if (avatar != null) {
					avatar.src = avatar.dataset.src = 'https://i.ibb.co/jRxyKT0/shit.png';
					avatar.style = 'object-fit: cover;';
					delete avatar.dataset.lazyLoaded;
				}
				elem.parentNode.querySelectorAll('span.reply, span.flag-as-troll')
					.forEach(elem => { elem.hidden = true });
				elem.parentNode.parentNode.parentNode.querySelectorAll('div.commentmetadata')
					.forEach(elem => { elem.hidden = true });
			} else if (!elem.classList.contains('troll') && elem.parentNode.querySelector('span.flag-as-troll') == null) {
				const elems = ['span', 'a'].map(Document.prototype.createElement.bind(document));
				elems[0].className = 'flag-as-troll';
				elems[0].style = 'float: right;';
				elems[0].append(elems[1]);
				elems[1].textContent = 'Troll?';
				elems[1].style = 'color: #38b7ee; margin-right: 10pt;';
				elems[1].href = '#';
				elems[1].onclick = function(evt) {
					if (trolls.some(troll => troll == userName)) return false;
					if (!confirm(`Přidat ${userName} do trollů?`)) return false;
					trolls.push(userName);
					GM_setValue('trolls', trolls);
					optOutTrolls();
					return false;
				};
				elem.parentNode.append(elems[0]);
			}
		}
	}
} else if (siteConfig.postsSelectors) {
	function addLinkButton(elem) {
		if (!(elem instanceof HTMLElement)) throw 'Invalid argument';
		if (elem.parentNode == null) return;
		const url = (function findURL(root) {
			if (root instanceof Node) do {
				const link = root.nodeName == 'A' ? root : root.querySelector(siteConfig.postsArticleLinkSelector || 'a');
				if (link != null) return link.href; else root = root.parentNode;
			} while (root != null);
			console.warn('Article link not found', elem, siteConfig.postsArticleLinkSelector || 'a');
		})(elem);
		if (!url) return;
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.style = 'vertical-align: middle; border: none; margin: 0; padding: 0; float: none;';
		svg.setAttribute('height', 16);
		svg.setAttribute('fill', 'white');
		svg.setAttribute('viewBox', '0 0 88 100');
		svg.innerHTML = `
 <path d="M4.55 81.93l13.66 0 0 13.66c0,2.51 2.03,4.55 4.55,4.55l60.69 0c2.51,0 4.55,-2.04 4.55,-4.55l0 -72.83c0,-2.52 -2.04,-4.55 -4.55,-4.55l-13.66 0 0 -13.66c0,-2.51 -2.03,-4.55 -4.55,-4.55l-60.69 0c-2.51,0 -4.55,2.04 -4.55,4.55l0 72.83c0,2.51 2.04,4.55 4.55,4.55zm74.35 9.1l-51.59 0 0 -63.72 51.59 0 0 63.72zm-69.8 -81.93l51.59 0 0 9.11 -37.93 0c-2.52,0 -4.55,2.03 -4.55,4.55l0 50.07 -9.11 0 0 -63.73z"/>
 <path d="M40.97 36.41c-2.52,0 -4.56,2.04 -4.56,4.56 0,2.51 2.04,4.55 4.56,4.55l24.27 0c2.52,0 4.55,-2.04 4.55,-4.55 0,-2.52 -2.03,-4.56 -4.55,-4.56l-24.27 0z"/>
 <path d="M65.24 54.62l-24.27 0c-2.52,0 -4.56,2.04 -4.56,4.55 0,2.52 2.04,4.55 4.56,4.55l24.27 0c2.52,0 4.55,-2.03 4.55,-4.55 0,-2.51 -2.03,-4.55 -4.55,-4.55z"/>
 <path d="M65.24 72.83l-24.27 0c-2.52,0 -4.56,2.04 -4.56,4.55 0,2.51 2.04,4.55 4.56,4.55l24.27 0c2.52,0 4.55,-2.04 4.55,-4.55 0,-2.51 -2.03,-4.55 -4.55,-4.55z"/>
`;
		elem.append(createButton(svg, url));
	}

	if (!Array.isArray(siteConfig.postsSelectors)) siteConfig.postsSelectors = [siteConfig.postsSelectors];
	for (let selector of siteConfig.postsSelectors) if (selector)
		document.body.querySelectorAll(siteConfig.listBase ? siteConfig.listBase + ' ' + selector : selector)
			.forEach(addLinkButton);
	const container = document.body.querySelector(siteConfig.listBase);
	if (container != null) new MutationObserver(function(mutationsList, mo) {
		for (let mutation of mutationsList) for (let node of mutation.addedNodes)
			for (let selector of siteConfig.postsSelectors) node.querySelectorAll(selector).forEach(addLinkButton);
	}).observe(container, { childList: true });
}

// switch (document.domain) {
// 	case 'www.pravyprostor.net': case 'pravyprostor.net':
// 	case 'www.pravyprostor.cz': case 'pravyprostor.cz': {
// 		const ref = document.body.querySelector('span.dwpb-close');
// 		if (ref != null) ref.click(); else {
// 			const mo = new MutationObserver(function(mutationsList) {
// 				mutationsList.forEach(function(mutation, mo) {
// 					if (mutation.type == 'childList') mutation.addedNodes.forEach(function(node) {
// 						if (node.nodeName != 'SPAN' || !node.classList.contains('dwpb-close')) return;
// 						mo.disconnect();
// 						clearTimeout(tmr);
// 						node.click();
// 					});
// 				});
// 			}), tmr = setTimeout(MutationObserver.prototype.disconnect.bind(mo), 30000);
// 			mo.observe(document.body, { childList: true });
// 		}
// 		break;
// 	}
// }
