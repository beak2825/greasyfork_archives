// ==UserScript==
// @id             neo-blacklist
// @name           NeoGAF: Blacklists
// @namespace      hateradio)))
// @author         hateradio
// @version        1.1
// @description    Experimental blocking based on user-set blacklists
// @include        http*://*.neogaf.com/forum/*
// @match          *://*.neogaf.com/forum/*
// @updated        28 Feb 2016
// @grant          unsafeWindow
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/17517/NeoGAF%3A%20Blacklists.user.js
// @updateURL https://update.greasyfork.org/scripts/17517/NeoGAF%3A%20Blacklists.meta.js
// ==/UserScript==
/*jslint indent: 4, maxerr: 50, browser: true, devel: true, sub: false, fragment: false, nomen: true, plusplus: true, bitwise: true, regexp: true, newcap: true */

//var blacklist = ['NSFW', 'G/A/F/?', 'Pop*', 'Ariana Grande', 'Iggy', 'Nicki', 'Police', 'WorldStar', 'OT', 'Do you*', 'Help me*', 'bug', '...', 'Florida', 'GAF, I just*', 'LTTP'];

(function () {

	'use strict';

	/** Array intersection */
	function intersectClassList(a, cl) {
		// console.log(a, cl);
		return a.filter(function (e) { return cl.contains(e); });
	}

	/** Basic functionallity to find an element's parent
	 * The parentTag can contain a CSS selector, but it has to match exactly
	 *
	 * Eg: 'div.post' and 'p.purple'
	 *
	 * A 'div' has to have 'post' as a class name
	 * A 'p' has to have a 'purple' class
	 *
	 * parentTag can also contiain multiple class names
	 *
	 * Eg: 'div.post.alt2'
	 * Where 'post' and 'alt2' are class selectors
	 */
	function findParent(el, parentTag) {
		var splits = parentTag.toLowerCase().split('.'),
			tag = splits[0].trim(),
			classList = splits.slice(1).filter(function (e) { return !!e.trim(); });

		// console.log("Tag:", tag, classList);
		function loop(parent) {
			var ptag = parent.tagName.toLowerCase(), inter;

			if (classList.length > 0) {
				inter = intersectClassList(classList, parent.classList);
				// console.log('Inter:', tag, inter);
				// console.log(parent, parent.tagName.toLowerCase() === tag, inter.length === classList.length);
				if (ptag === tag &&	inter.length === classList.length) {
					// console.log('found parent');
					return parent;
				}
			} else if (ptag === tag) {
				return parent;
			}

			if (parent.parentElement) {
				return loop(parent.parentElement);
			}

			return null;
		}

		return tag ? loop(el.parentElement) : null;
	}

	function Block(selector, parent, blacklist) {
		if (!selector) {
			return;
		}

		this.selector = selector;
		this.parent = parent;
		this.blacklist = blacklist;
	}

	Block.createFromBlacklist = function (set) {
		return new Block[set.type](set.selector, set.parent, set.blacklist);
	};

	Block.prototype.toggle = function (display) {
		display = !!display;

		var i, j, p, s = document.querySelectorAll(this.selector), style = display ? '' : 'none';

		for (i = 0; i < s.length; i++) {
			for (j = 0; j < this.blacklist.length; j++) {
				if (this.compare(s[i].textContent, this.blacklist[j])) {
					p = findParent(s[i], this.parent);
					// console.log(p);

					if (p) {
						p.style.display = style;
						p.dataset.gmhide = display;
					}
				}
			}
		}
	};

	Block.prototype.hide = function () {
		this.toggle(false);
	};

	Block.prototype.show = function () {
		this.toggle(true);
	};

	/** Only matches words that are identical to some text */
	Block.Exact = function (selector, parent, blacklist) {
		Block.call(this, selector, parent, blacklist);
	};

	/** Simply matches word "OT" inside of phrase "Marvel |OT| jk Marvel doesn't have an OT" */
	Block.Simple = function (selector, parent, blacklist) {
		Block.call(this, selector, parent, blacklist);
	};

	/** Uses RegExps to match text; plain text is converted to a RegExp */
	Block.Complex = function (selector, parent, blacklist) {
		Block.call(this, selector, parent, blacklist);
	};

	Block.Exact.prototype = new Block();
	Block.Simple.prototype = new Block();
	Block.Complex.prototype = new Block();

	Block.Exact.prototype.compare = function (text, word) {
		return text.trim() === word.trim();
	};

	Block.Simple.prototype.compare = function (text, word) {
		return text.trim().toLowerCase().contains(word.trim().toLowerCase());
	};

	Block.Complex.prototype.compare = function (text, regexp) {
		var r = regexp instanceof RegExp ? regexp : new RegExp(regexp, 'ig');
		return r.test(text);
	};

	/** Modify and add items to the set */
	var massBlock = {
		set: {
			userThreads: { // block threads from these users
				selector: '.threadbit.alt1 td[nowrap]:nth-child(3)',
				parent: 'tr', // hide the table row that the element belongs to
				blacklist: ['user1', 'user2', 'etc-users'], // Block some usernames
				type: 'Exact'
			},
			topics: { // block threads with these phrases
				selector: 'td[id^="td_threadtitle"]',
				parent: 'tr',
				blacklist: ['NSFW', 'G/A/F', 'Pop', 'Ariana Grande', 'Iggy', 'Nicki', 'Police', 'WorldStar', 'OT', 'Do you', 'Help me', 'bug', '...', 'Florida', 'GAF, I just', 'LTTP', 'Marvel'],
				type: 'Simple'
			},
			posts: { // block posts from these users
				selector: '.postbit-details-username a',
				parent: 'div.postbit',
				blacklist: ['user1', 'user2', 'etc-users'],
				type: 'Exact'
			},
			RegExample: { // block using regular expressions
				selector: '.RegExample',
				parent: 'div.RegExample',
				blacklist: [/badWord/ig, /an*/ig, /LOL/g],
				type: 'Complex'
			}
		},
		main: function () {
			var s;
			for (s in this.set) {
				if (this.set.hasOwnProperty(s)) {
					Block.createFromBlacklist(this.set[s]).hide();
				}
			}
		}
	};

	massBlock.main();

}());
