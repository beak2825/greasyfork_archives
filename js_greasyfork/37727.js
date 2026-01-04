// ==UserScript==
// @namespace ATGT
// @name     remove page limit
// @name:zh-CN     解除网页限制，网站列表请看代码，也可以添加自定义网站
// @description   Remove various page limit, check the code for website list, or add other websites
//    quora.com: Remove login page
//    other domains: Remove copy or select limit
// How to remove other web page's copy or select limit:
//    1. Add domain to @match *://*.your.domain/*
//    2. (Optional): Add your unlock handlers to variable `unlockPageHandlers' below
// @description:zh-CN   解除各种网页限制，网站列表请看代码，也可以添加自定义网站
//    quora.com: 移除登录页面
//    其它网站：解除选择和复制限制
// 怎么移除其它网页的限制：
//    1. 将域名加到 @match，格式如下：
//        // @match *://*.your.domain/*
//    2. （可选）：将解除限制的方法加到 `unlockPageHandlers' 这个数组
//
// @version  1.4.8
// @match    *://*.quora.com/*
// @match    *://*.360doc.com/*
// @match    *://*.baidu.com/*
// @match    *://*.sdifen.com/*
// @match    *://*.popbee.com/*
// @match    *://*.baikemy.com/*
// @exclude    *://pan.baidu.com/*
// @exclude    *://ditu.baidu.com/*
// @exclude    *://map.baidu.com/*
// @exclude    *://maps.baidu.com/*
// @run-at   document-start
// @downloadURL https://update.greasyfork.org/scripts/37727/remove%20page%20limit.user.js
// @updateURL https://update.greasyfork.org/scripts/37727/remove%20page%20limit.meta.js
// ==/UserScript==

/*
ChangeLog:
v1.4.8:
  5 Mar 2020, Delay before enable copy handler
v1.4.7:
  9 Nov 2019, Enable user select by css rules on '*' selector,
              Match baikemy.com
v1.4.6:
  16 Oct 2019, remove dead site, merge baidu handlers
v1.4.5:
  15 Oct 2019, skip hijack baidu login verify page
v1.4.4:
  18 Aug 2019, exclucde baidu map
v1.4.3:
  30 Jun 2019, Try remove all limit by default, may not work for all sites.
v1.4:
  27 Nov 2018, Add wenku.baidu.com
v1.3:
  29 Jan 2018, Added generic functions:
                1. Intercept event handlers.
                2. Wait for some node and do the unlock
v1.1:
  someday, Enable user select.
v1:
  someday, Remove quora login page.

*/

console.log(`=== unlock-page ${location.href} ===`);
(function () {
	var unlockPageHandlers = [
		/* !!! Need to add the global match to @include also */
		/* Formats:
		 *    [ /domain name regex/, [ selector-string or node-object, event-type, event-handler, delay-ms-before-run-event-handle, event-handler-parameter ] ]
		 *  -- or --
		 *    [ /domain name regex/, [ selector-string or node-object, event-type, event-handler, observed-object-to-be-added-dynamicly-before-run-event-handle, event-handler-parameter ] ]
		 *  -- or multiple handlers for the domain, syntax similar to previous ones --
		 *    [ /domain name regex/, [
		 *        [ selector-string or node-object, event-type, event-handler, delay or observed-object before run event handler, event-handler-parameter ],
		 *        [ selector-string or node-object, event-type, event-handler, delay or observed-object before run event handler, event-handler-parameter ], ]
		 *    ]
		 * Notes:
		 * 1. empty selector-string/node-object and event-type means run immediately/after-some-delay at document-start
		 * 2. some event does not need a node to run on, e.g. DOMContentLoaded
		 * 3. DOMContentLoaded is trigger before window's load event, since window's load event will trigger after external script/resource are loaded.
		 */
		[
			/quora\.com/,
			[ /* not needed for event DOMContentLoaded */, 'DOMContentLoaded', quoraHandler, 0]
		],
		[
			/360doc\.com/,
			[window, 'load', enableCopyHandler, 0]
		],
		[
			/popbee\.com/,
			[window, 'load', enableCopyHandler, 0]
		],
		[
			/wenku\.baidu\.com/,
			[
				[, , interceptJackEvent, 0], /* no selector/node and no event means run immediately at document-start */
				[window, 'load', enableCopyHandler, 0, '.bd.doc-reader'],
			]
		],
		[
			/^https?:\/\/([^/?&#%]*\.)?baidu\.com/,  // <=> http*://*.baidu.com
			[
				[, , interceptJackEvent, 0, '.vcode-body'],
				[, 'DOMContentLoaded', enableUserSelect, 0, 'body'],
				[window, 'load', enableCopyHandler, 0],
			]
		],
		[
			/sdifen\.com/,
			[
				[, , interceptJackEvent, 0],
				[, 'DOMContentLoaded', enableUserSelect, 0, 'body'],
				[window, 'load', enableCopyHandler, 0],
			]
		],
		[
			/.*/,
			[
				[, , interceptJackEvent, 0],
				[, 'DOMContentLoaded', enableUserSelect, 0, 'body'],
				[window, 'load', enableCopyHandler, 1000],
			]
		],
	];


	function quoraHandler() {
		console.log(new Date().toLocaleString(), ' ', arguments.callee.name);
		for (var d of document.body.childNodes) {
			if (/signup_wall_wrapper$/.test(d.id)) {
				d.remove();
				break;
			}
		}
		document.body.style.overflow = 'visible';
	}
	function replaceAddEventListener() {
		console.log('replaceAddEventListener');
		var r0_EventTargetRegFunc = EventTarget.prototype.addEventListener;
		//var r1_documentRegFunc = document.addEventListener;
		function dummyEvtRegFunc(type, listener, options) {
			//console.log('dummyEvtRegFunc', this, type, listener, options);
			var regFunc = r0_EventTargetRegFunc;
			if (window.ATGT_noHijackNodes) {
				let nhjk = document.querySelectorAll(window.ATGT_noHijackNodes);
				for (let n of nhjk) {
					if (n.contains(this)) {
						console.log('dummyEvtRegFunc skip hijack', this);
						regFunc.call(this, type, listener, options);
						return;
					}
				}
			}
			if (!this.ATGT_disabledEventHandlers)
				this.ATGT_disabledEventHandlers = {};
			if (!this.ATGT_enabledEventHandlers)
				this.ATGT_enabledEventHandlers = {};
			//console.log('window.ATGT_eventFilter', window.ATGT_eventFilter);
			if (window.ATGT_eventFilter && window.ATGT_eventFilter.test(type)) {
				console.log('dummyEvtRegFunc', this, type, listener, options);
				console.log('this event is %cdisabled.', 'color: red;');
				this.ATGT_disabledEventHandlers[type] = [listener, options];
			} else {
				//console.log('dummyEvtRegFunc', this, type, listener, options);
				//console.log('this event is %cregistered.', 'color: green;');
				this.ATGT_enabledEventHandlers[type] = [listener, options];
				regFunc.call(this, type, listener, options);
			}
		}
		EventTarget.prototype.addEventListener = dummyEvtRegFunc;
		if (document.addEventListener !== dummyEvtRegFunc)
			document.addEventListener = dummyEvtRegFunc;
	}

	function injectFunction(func) {
		var script = document.createElement('script');
		//script.appendChild(document.createTextNode('('+ func +')();'));
		script.appendChild(document.createTextNode('(function (){' + '(' + func + ')();' + '})();'));
		(document.body || document.head || document.documentElement).appendChild(script);
	}
	//console.log(''+injectFunction);
	injectFunction(replaceAddEventListener);

	function interceptJackEvent(noHijackNodes = '') {
		console.log(`interceptJackEvent noHijackNodes='${noHijackNodes}'`);
		var f = function setEventFilter() {
			var eventFilter = /copy|selectstart|mouseup|mousedown|contextmenu|keydown|keyup/;
			window.ATGT_eventFilter = eventFilter;
			window.ATGT_noHijackNodes = '__noHijackNodes__';
		};
		f = f.toString().replace('__noHijackNodes__', noHijackNodes);
		injectFunction(f);
	}
	function addStyleSheet(cssContent) {
		let cssid = `ATGT-remove-page-limit-css`;
		if (document.querySelector(`#${cssid}`))
			return;
		let style = document.createElement('STYLE');
		style.type = 'text/css';
		style.id = cssid;
		style.appendChild(document.createTextNode(cssContent));
		document.head.appendChild(style);
	}
	function enableUserSelect(sel) {
		console.log('enableUserSelect ', sel);
		var b = document.body;
		if (sel)
			b = document.querySelector(sel);
		var uselattrs = ['-webkit-touch-callout',
			'-webkit-user-select',
			'-khtml-user-select',
			'-moz-user-select',
			'-ms-user-select',
			'user-select',
		];
		for (var usel of uselattrs) {
			try {
				if (b && usel in b.style) {
					console.log('Found style user-select: ' + b.style[usel] + ', replace it.');
					b.style[usel] = 'text';
				}
			} catch (e) {
				console.log(e);
			}
		}
		console.log('add css rule to enable user select');
		addStyleSheet(`
			* {
				user-select: unset!important;
			}`);
	}

	function enableCopyHandler(sel) {
		var body = document.body || document.querySelector('body');
		var doc = document;
		console.log('enableCopyHandler', new Date().toLocaleString(), ' ', arguments.callee.name, body.oncopy, doc.oncopy);
		function replaceUserHandlers(n) {
			if (!n)
				return;
			if (n.onclick)
				n.onclick = null;
			if (n.oncontextmenu)
				n.oncontextmenu = null;
			if (n.oncopy)
				n.oncopy = null;
			if (n.onmouseup)
				n.onmouseup = null;
			if (n.onmousedown)
				n.onmousedown = null;
			if (n.onselectstart)
				n.onselectstart = null;
		}
		//console.log('body', body);
		replaceUserHandlers(body);
		replaceUserHandlers(doc);
		var node = document.querySelector(sel);
		//for (var n of nodes)
		console.log('sel', sel, '=>', node);
		replaceUserHandlers(node);
	}

	function waitForNode(targetSel, nodeFilter, nodeHandler, attrHandler) {
		console.log('waitForNode ', targetSel, nodeFilter, nodeHandler, attrHandler);
		// Select the node that will be observed for mutations
		var targetNode = document;
		if (typeof targetSel === 'object')
			targetNode = targetSel;
		else if (typeof targetSel === 'string')
			targetNode = document.querySelector(targetSel);

		// console.log('targetNode', targetNode);

		// Options for the observer (which mutations to observe)
		var config = {
			attributes: !!attrHandler,
			childList: !!nodeHandler,
			subtree: true,
		};

		// Callback function to execute when mutations are observed
		var callback = function (mutationsList) {
			for (var mutation of mutationsList) {
				if (nodeHandler && mutation.type == 'childList') {
					//console.log('A child node has been added ', mutation.addedNodes, ' or removed.');
					for (var node of mutation.addedNodes) {
						if (node.querySelector instanceof Function && node.querySelector(nodeFilter) || node === node.parentNode.querySelector(nodeFilter)) {
							setTimeout(nodeHandler, 0);
							this.disconnect();
							break;
						}
					}
				} else if (attrHandler && mutation.type == 'attributes') {
					//console.log('The ' + mutation.attributeName + ' attribute was modified.');
					setTimeout(attrHandler, 0);
				}
			}
		};

		// Create an observer instance linked to the callback function
		var observer = new MutationObserver(callback);
		// Start observing the target node for configured mutations
		observer.observe(targetNode, config);
		// Later, you can stop observing
		//observer.disconnect();
	}

	function runHandler(url, info) {
		try {
			console.log(new Date().toLocaleString(), ' handle ', url, ' with ', info);
			var nodeSel = info[0];
			var evt = info[1];
			var func = info[2];
			var delay_or_observe = info[3];
			var param = info[4];
			var node = document;
			var handler;
			if (typeof delay_or_observe === 'number') {
				handler = function () {
					setTimeout(func, delay_or_observe, param);
				};
			} else {
				handler = function () {
					waitForNode(delay_or_observe, param, function () { func(param); });
				};
			}
			if (typeof nodeSel === 'object')
				node = nodeSel;
			else if (typeof nodeSel === 'string')
				node = document.querySelector(nodeSel);
			console.info('nodeSel', nodeSel, 'node', node);
			if (evt)
				node && node.addEventListener(evt, () => { handler(param); });
			else
				handler(param);
		} catch (e) {
			console.log('Error handling ', url, ' ', e);
		}
	}

	for (var ph of unlockPageHandlers) {
		var url = ph[0];
		if (url.test(location.href)) {
			var info_list = ph[1];
			if (!(info_list[0] instanceof Array)) {
				try {
					runHandler(url, info_list);
				} catch (e) {
					console.log(e);
				}
			} else for (var info of info_list) {
				try {
					runHandler(url, info);
				} catch (e) {
					console.log(e);
				}
			}

			// only one rule runs on one site
			break;
		}
	}
})();

console.log(`=== /unlock-page ${location.href} ===`);
