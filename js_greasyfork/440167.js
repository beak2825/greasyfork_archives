///<reference path="XAutoPager.d.ts"/>
//@ts-check
// ==UserScript==
// @name         自动翻页X
// @version      0.0.1
// @description  A library for AutoPagerize
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace https://greasyfork.org/users/85611
// @downloadURL https://update.greasyfork.org/scripts/440167/%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5X.user.js
// @updateURL https://update.greasyfork.org/scripts/440167/%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5X.meta.js
// ==/UserScript==

const CSS_TEXT = `
.xx_seperator{
	text-align: center;
	background-color: green;
}
.xx_seperator:before,
.xx_seperator:after{
	background-color: #000;
	content: "";
	display: inline-block;
	height: 1px;
	position: relative;
	vertical-align: middle;
	width: 50%;
}
.xx_seperator:before {
	right: 0.5em;
	margin-left: -50%;
}

.xx_seperator:after {
	left: 0.5em;
	margin-right: -50%;
}
.xx_blink_loading {
	text-color: red;
}
`;

/** @typedef SiteConfig
 * @property {string} name
 * @property {string | RegExp | Array<string | RegExp>} host
 * @property {string | ((node: Document | Element) => string | null | undefined)} nextLink
 * @property {string | ((doc: Document | Element) => Element[] | null)} pageElements
 * @property {[string, number]} insertPosition
 */

const lib = {
	task: {
		/**@type {'idle' | 'fetching' | 'done' | 'error'} */
		status: 'idle',
		/**@type {SiteConfig} */
		site: null,
		/**@type {number} */
		nextPageIndex: 1,
		/**@type {string|null} */
		nextUrl: null,
		/**@type {SepeatorObject|null} */
		lastSeperator: null,
	},


	get site() { return this.task && this.task.site; },
	get lastSeperator() { return this.task && this.task.lastSeperator; },
	set lastSeperator(val) { this.task.lastSeperator = val; },
	get nextUrl() { return this.task.nextUrl; },
	set nextUrl(val) { this.task.nextUrl = val; },
	get status() { return this.task.status; },
	set status(val) { this.task.status = val; },

	init(site)
	{
		log('Start: ', site.name);
		this.task.site = site;
		GM_addStyle(CSS_TEXT);

		const insert = this.getInitialInsertPosition();
		if (!insert)
		{
			log('ERROR: 找不到插入位置');
			return;
		}


		const seperator = this.createSeperatorElement();
		seperator.setWait('等待');
		insert[0].insertAdjacentElement(insert[1], seperator.element);
		this.lastSeperator = seperator;
		//first next url
		const nextUrl = readNextLinkUrl(site, document);
		if (!nextUrl || nextUrl.length === 0)
		{
			this.lastSeperator.setDone('没有找到下一页链接');
			this.task.status = 'done';
			return;
		}
		this.nextUrl = nextUrl;
		this.task.status = 'idle';
		windowScroll(() =>
		{
			if (this.status !== 'idle') return;
			if (this.checkScrollBottom())
			{
				this._startLoad();
			}
		});
	},

	/** @returns {SepeatorObject} */
	createSeperatorElement()
	{
		let seperator = document.createElement('div');
		seperator.className = 'xx_seperator';
		return {
			element: seperator,
			setLoading(html)
			{
				seperator.innerHTML = html;
				seperator.classList.add('xx_blink_loading');
			},

			setSeperator(pageIndex, url)
			{
				seperator.classList.remove('xx_blink_loading');
				seperator.innerHTML = `<a href="${url}" target="_blank">page = ${pageIndex}</a>`;
			},

			setError(text)
			{
				seperator.classList.remove('xx_blink_loading');
				seperator.innerHTML = 'error: ' + text;
			},

			setDone(text)
			{
				seperator.classList.remove('xx_blink_loading');
				seperator.innerHTML = 'done: ' + text;
			},

			setWait(text)
			{
				seperator.classList.remove('xx_blink_loading');
				seperator.innerHTML = 'wait: ' + text;
			}
		};
	},
	//初始的插入位置。之后的位置，都是seperator的后面
	/** @returns {[Element,InsertPosition]} */
	getInitialInsertPosition()
	{
		const site = this.site;
		/**@type {Element} */
		let anchor;
		let type;
		if (site.insertPosition)
		{
			anchor = getOne(site.insertPosition[0], document);
			type = site.insertPosition[1];
			if (!(type >= 1 && type <= 4)) type = 4;
			if (anchor)
			{
				/**@type {InsertPosition[]} */
				const TP_WHERE = ['beforebegin', 'afterbegin', 'beforeend', 'afterend'];
				return [anchor, TP_WHERE[type - 1]];
			}
			else
			{
				log(`不能找到配置inserPosition中的插入位置([${site.insertPosition[0], site.insertPosition[1]}])，继续查找`);
			}
		}
		//如果找不到，或者没有配置。则自动找当前页面内容的后面。
		const elements = readPageContentElements(site, document);
		if (elements && elements.length > 0)
		{
			return [elements[elements.length - 1], 'afterend'];
		}
		return null;
	},

	/**@returns {Promise<Document>} */
	fetchPageContent(url)
	{
		return new Promise((resolve, reject) =>
		{
			GM_xmlhttpRequest({
				method: 'GET',
				url: url,
				overrideMimeType: 'text/html; charset=' + document.characterSet,
				onload: function (response)
				{
					if (response.status >= 200 && response.status < 300)
					{
						try
						{
							let doc = createDocumentByString(response.responseText);
							// @ts-ignore
							resolve(doc);
						}
						catch (e)
						{
							reject(new Error('failed to create html document'));
						}
					}
					else
					{
						reject(new Error('Error http status code: ' + response.status));
					}
				},
				onerror: function (response)
				{
					reject(new Error(response.error));
				},
				ontimeout: function (response)
				{
					reject(new Error('timeout'));
				},
			});

		});
	},
	//是否已经滚动到底部了
	checkScrollBottom()
	{
		const scrollD = 500;
		let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
		let viewHeight = window.innerHeight || document.documentElement.clientHeight;
		let scrollHeight = document.documentElement.scrollHeight;

		if (1 && scrollD > 0)
		{
			//return scrollHeight - viewHeight - scrollTop < scrollD;
		}
		if (this.task.lastSeperator)
		{
			let element = this.task.lastSeperator.element;
			const rect = element.getBoundingClientRect();
			const bottomToPageEnd = viewHeight - rect.bottom;
			//分隔符快要显示出来的时候
			if (bottomToPageEnd >= -300)
			{
				return true;
			}
		}
		return false;
	},

	_startLoad()
	{
		if (!this.nextUrl) throw new Error('no next url');
		if (this.status === 'fetching') throw new Error('already fetching');
		if (!this.lastSeperator) throw new Error('no last seperator');

		this.status = 'fetching';
		this.lastSeperator.setLoading('loading...');
		this.fetchPageContent(this.nextUrl).then(doc =>
		{
			const contents = readPageContentElements(this.site, doc);
			if (!contents || contents.length === 0)
			{
				this.status = 'error';
				this.lastSeperator.setError('没有在页面中找到内容');
				return;
			}
			//insert
			this.lastSeperator.setSeperator(this.task.nextPageIndex++, this.nextUrl);
			let last = this.lastSeperator.element;
			for (const elem of contents)
			{
				last.insertAdjacentElement('afterend', elem);
				last = elem;
			}

			//add new seperator
			this.lastSeperator = this.createSeperatorElement();
			this.lastSeperator.setWait('wait');
			last.insertAdjacentElement('afterend', this.lastSeperator.element);

			//set next url
			this.nextUrl = readNextLinkUrl(this.site, doc);
			if (!this.nextUrl)
			{
				this.lastSeperator.setDone('没有下一页了');
				this.status = 'done';
				return;
			}

			this.status = 'idle';

		}).catch(e =>
		{
			this.status = 'error';
			this.lastSeperator.setError('载入页面失败');
			log('Load Page Error:', e);
		});
	}
};


main();
function log()
{
	console.debug.call(null, '[XAutoPager]', ...arguments);
}
function main()
{
	const site = detectCurrentSite();
	if (!site) return;
	lib.init(site);
}

/** @returns {SiteConfig[]} */
function getSiteDB()
{
	/**@type {SiteConfig[]} */
	const DB = [
		// {
		// 	name: 'bbs.saraba1st.com',
		// 	host: /bbs.saraba1st.com/,
		// 	nextLink: 'css;.nxt',
		// 	pageElements: 'css;#threadlisttableid',
		// }
	];
	return DB;
}
/** @returns {SiteConfig | null} */
function detectCurrentSite()
{
	const DB = getSiteDB();
	const isMatch = host =>
	{
		if (typeof host === 'string' && host === location.hostname)
			return true;
		if (host instanceof RegExp && host.test(location.href))
			return true;
		return false;
	};
	for (const site of DB)
	{
		if (Array.isArray(site.host))
		{
			for (const host of site.host)
			{
				if (isMatch(host))
					return site;
			}
		}
		else
		{
			if (isMatch(site.host))
				return site;
		}
	}
	return null;
}

/**
 * 
 * @param {SiteConfig} site 
 * @param {Document} node
 * @returns {string|null}
 */
function readNextLinkUrl(site, node = document)
{
	if (!site.nextLink || !node) return null;
	let ret;
	if (typeof site.nextLink === 'function')
	{
		ret = site.nextLink(node);
	}
	else if (typeof site.nextLink === 'string')
	{
		ret = getOne(site.nextLink, node);
	}
	if (typeof ret === 'string' && ret.length > 0)
		return ret;
	if (ret)
	{
		if (ret.tagName === 'A' && ret.href && ret.href.length > 0)
			return ret.href;
		if (ret.querySelectorAll)
		{
			let aa = ret.querySelectorAll('a');
			for (let a of aa)
			{
				if (a.href && a.href.length > 0)
					return a.href;
			}
		}
	}
	return null;
}

/**
 * 
 * @param {SiteConfig} site 
 * @param {Document} node 
 * @returns {Array<Element> | null}
 */
function readPageContentElements(site, node = document)
{
	if (!site.pageElements || !node)
		return null;
	if (typeof site.pageElements === 'function')
		return site.pageElements(node);
	if (typeof site.pageElements === 'string')
		return getAll(site.pageElements, node);
	return null;
}

function windowScroll(fn1)
{
	var beforeScrollTop = document.documentElement.scrollTop || document.body.scrollTop,
		fn = fn1 || function () { };
	setTimeout(function ()
	{ // 延时 1 秒执行，避免刚载入到页面就触发翻页事件
		window.addEventListener('scroll', function (e)
		{
			var afterScrollTop = document.documentElement.scrollTop || document.body.scrollTop,
				delta = afterScrollTop - beforeScrollTop;
			if (delta == 0) return false;
			fn(delta > 0 ? 'down' : 'up', e);
			beforeScrollTop = afterScrollTop;
		}, { capture: false, passive: true });
	}, 1000);
}


function getCSS(css, contextNode = document)
{
	return contextNode.querySelector(css);
}

function getAllCSS(css, contextNode = document)
{
	return [...contextNode.querySelectorAll(css)];
}

function getXpath(xpath, contextNode, doc = document)
{
	contextNode = contextNode || doc;
	try
	{
		const result = doc.evaluate(xpath, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
		// 应该总是返回一个元素节点
		return result.singleNodeValue && result.singleNodeValue.nodeType === 1 && result.singleNodeValue;
	}
	catch (err)
	{
		throw new Error(`无效 Xpath: ${xpath}`);
	}
}
function getAllXpath(xpath, contextNode, doc = document)
{
	contextNode = contextNode || doc;
	const result = [];
	try
	{
		const query = doc.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (let i = 0; i < query.snapshotLength; i++)
		{
			const node = query.snapshotItem(i);
			// 如果是 Element 节点
			if (node.nodeType === 1) result.push(node);
		}
	} catch (err)
	{
		throw new Error(`无效 Xpath: ${xpath}`);
	}
	return result;
}


function getOne(selector, contextNode = undefined, doc = document)
{
	if (!selector) return;
	contextNode = contextNode || doc;
	if (selector.search(/^css;/i) === 0)
	{
		return getCSS(selector.slice(4), contextNode);
	}
	else
	{
		return getXpath(selector, contextNode, doc);
	}
}

function getAll(selector, contextNode = undefined, doc = document)
{
	if (!selector) return [];
	contextNode = contextNode || doc;
	if (selector.search(/^css;/i) === 0)
	{
		return getAllCSS(selector.slice(4), contextNode);
	}
	else
	{
		return getAllXpath(selector, contextNode, doc);
	}
}


function createDocumentByString(e)
{
	if (e)
	{
		if ('HTML' !== document.documentElement.nodeName)
			return (new DOMParser).parseFromString(e, 'application/xhtml+xml');
		var t;
		try 
		{
			t = (new DOMParser).parseFromString(e, 'text/html');
		}
		catch (e) 
		{

		}
		if (t) return t;
		if (document.implementation.createHTMLDocument)
		{
			t = document.implementation.createHTMLDocument('ADocument');
		}
		else
		{
			//@ts-ignore
			try { ((t = document.cloneNode(!1)).appendChild(t.importNode(document.documentElement, !1)), t.documentElement.appendChild(t.createElement('head')), t.documentElement.appendChild(t.createElement('body'))); } catch (e) { }
		}
		if (t)
		{
			var r = document.createRange(),
				n = r.createContextualFragment(e);
			r.selectNodeContents(document.body);
			//@ts-ignore
			t.body.appendChild(n);
			//@ts-ignore
			for (var a, o = { TITLE: !0, META: !0, LINK: !0, STYLE: !0, BASE: !0 }, i = t.body, s = i.childNodes, c = s.length - 1; c >= 0; c--) o[(a = s[c]).nodeName] && i.removeChild(a);
			return t;
		}
	}
	else 
	{
		console.error('没有找到要转成 DOM 的字符串');
	}
}