// ==UserScript==
// @name           Kaskus Spoiler Alert
// @namespace      http://userscripts.org/scripts/show/73498
// @description    add a warning message when a spoiler contains hidden link
// @include        *.kaskus.*/thread/*
// @include        *.kaskus.*/post/*
// @include        *.kaskus.*/product/*
// @include        *.kaskus.*/show_post/*
// @include        *.kaskus.*/group/discussion/*
// @include        *.kaskus.co.id/thread/*
// @include        *.kaskus.co.id/post/*
// @include        *.kaskus.co.id/product/*
// @include        *.kaskus.co.id/show_post/*
// @include        *.kaskus.co.id/group/discussion/*
// @version        2.66
// @author         arifhn
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/2182/Kaskus%20Spoiler%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/2182/Kaskus%20Spoiler%20Alert.meta.js
// ==/UserScript==
/**
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Changelog:
 * ==========
 *
 * 2.6
 * - fix new kaskus
 * - add setting key into greasemonkey/tampermonkey menu
 * - add 'Show All' menu to 'Thread Tools'
 * - fix group page
 *
 * 2.5
 * - fix button width on kaskus beta
 *
 * 2.4
 * - support livebeta.kaskus.us
 *
 * 2.3
 * - change shortcut for setting, now use Ctrl+Alt+S
 * - fix update notification
 *
 * 2.2
 * - add settings for enable/disable link preview
 * - add close button to popup box
 *
 * 2.1 fix bug on Firefox 3.6.x
 *
 * 2.0
 * - rewrite source code
 * - support Firefox 6 - support IDWS
 *
 * 1.20
 * add button 'Show All' at top & bottom thread.
 * This button can show/hide all spoiler in current page
 *
 * 1.19
 *  - add browser support Firefox 5.x
 *  - add html tag id (now easy to identify html tag created by KSA)
 *
 * 1.18
 * fix bug: hidden link not detected if bbcode contains space/text between
 * URL and SPOILER, sample bbcode:
 * [URL=http://www.foo.com/#] extra space
 * [SPOILER=bar]lol[/SPOILER][/URL]
 * thanks to tuxie.forte
 *
 * 1.17
 * add new feature: preview URL (title + original link)
 *
 * 1.16
 * add browser support Firefox 4.x
 *
 * 1.15
 * - support any standard vbulletin forum (tested on kaskus.us, indoforum.org)
 * - change all warning messages to english - add script update notification
 *
 * 1.14
 * support google chrome
 *
 * 1.13
 * add http://www.kaskus.us/group.php* to @include and
 * change the script to support it
 *
 * 1.12
 * fix bug: link alert (too sensitive, now only check domain name)
 *
 * 1.11
 * - scroll page to closed spoiler after 'Hide All' clicked
 * - hide button Show/Hide All if post contains 1 spoiler
 * - add new feature: fake link alert (show info if link text not equal to
 *   link url)
 *
 * 1.10
 * add http://www.kaskus.us/showpost.php* to @include,
 * thanks to hermawanadhis
 *
 * 1.9
 * revert back to 1.7 design with two button ('Show All' and 'Show') and
 * remove the popup menu
 *
 * 1.8
 * - move 'Show All' and 'Show Children' button into popup menu
 * - fixed bug: button label 'Show'/'Hide'
 *
 * 1.7
 * - change button 'Show All' -> 'Show Children' (open/close child spoiler)
 * - add button 'Show All' (open/close all spoilers)
 *
 * 1.6
 * add button 'Show All' to open/close all child spoiler
 *
 * 1.5
 * exclude kaskus smiley from picture counter
 *
 * 1.4
 * add new feature: show how many picture and spoiler inside spoiler
 *
 * 1.3
 * rewrite link detection thanks to "p1nk3d_books"
 *
 * 1.2
 * fixed bug, hidden link not detected if font color changed thanks to
 * "p1nk3d_books"
 *
 * 1.1
 * remove link from spoiler and show the hidden link thanks to "firo sXe"
 * (kaskusid 650045)
 *
 * 1.0
 * first release
 *
 */
(function() {
	var script = {
			putValue: function(key, value) {
				if(typeof window.localStorage != 'undefined') {
					localStorage[key] = value;
				}else {
					GM_setValue(key, value);
				}
			},

			getValue: function(key, defValue) {
				if(typeof window.localStorage != 'undefined') {
					ret = localStorage[key];
					if(ret == null) {
						ret = defValue;
					}
					return ret;
				}else {
					return GM_getValue(key, defValue);
				}
				return defValue;
			}
	};

	// returns true if string contains s
	String.prototype.contains = function(s) {
		return (this.indexOf(s) != -1);
	};

	// returns true if string starts with s
	String.prototype.startsWith = function(s) {
		return (this.substring(0, s.length) == s);
	};

	String.prototype.escapeHTML = function() {
		return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g,
		"&gt;");
	};
	/*
	 * // dont run in frames, prevents detection and misuse of unsafewindow try {
	 * var unsafeWindow = unsafeWindow || window.wrappedJSObject || window;
	 * if(unsafeWindow.frameElement != null) return; } catch(e) {}
	 */

	var URL = {
			// Returns the filename component of the path
			// + original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// * example 1: basename('/www/site/home.htm', '.htm'); // * returns 1:
			// 'home'
			// * example 2: basename('ecra.php?p=1');
			filename : function(path) {
				var suffix = null;
				var tailcut = "\\?";

				var b = path.replace(/^.*[\/\\]/g, '');
				if (typeof (suffix) == 'string'
					&& b.substr(b.length - suffix.length) == suffix)
					b = b.substr(0, b.length - suffix.length);
				if (typeof (tailcut) == 'string')
					b = b.replace(new RegExp(tailcut + ".*$", "g"), '');
				return b;
			},
			domain : function(url) {
				var m = url.match(/(http:\/\/[^?\/]+)/);
				if (m) {
					return m[1];
				}
				return null;
			}
	};

	function getCurrentYPos() {
		if (document.body && document.body.scrollTop)
			return document.body.scrollTop;
		if (document.documentElement && document.documentElement.scrollTop)
			return document.documentElement.scrollTop;
		if (window.pageYOffset)
			return window.pageYOffset;
		return 0;
	}

	function click(elm) {
		var evt = document.createEvent('MouseEvents');
		evt.initEvent('click', true, true);
		elm.dispatchEvent(evt);
	}

	// Utility function for mouseout listener
	function isChildOf(parent, child) {
		if (child != null) {
			while (child.parentNode) {
				if ((child = child.parentNode) == parent) {
					return true;
				}
			}
		}
		return false;
	}

	function getElement(q, root, single) {
		if (root && typeof root == 'string') {
			root = $(root, null, true);
			if (!root) {
				return null;
			}
		}
		root = root || document;
		if (q[0] == '#') {
			return root.getElementById(q.substr(1));
		} else if (q[0] == '/' || (q[0] == '.' && q[1] == '/')) {
			if (single) {
				return document.evaluate(q, root, null,
						XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			} else {
				var i, r = [], x = document.evaluate(q, root, null,
						XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
				while ((i = x.iterateNext()))
					r.push(i);
				return r;
			}
		} else if (q[0] == '.') {
			return root.getElementsByClassName(q.substr(1));
		}
		return root.getElementsByTagName(q);
	}

	function VBLink(el, parent, idx) {
		this.id = 'KSA-link-' + parent.id + '-' + idx;
		this.element = el;
		this.vbPost = parent;

		this.noPreviewURL = function() {
			var configLinkPreview = script.getValue("KSA_LINK_PREVIEW", "true");
			if(configLinkPreview == 'false') {
				return true;
			}
			var is_ff = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
			if (!is_ff) { // disable preview URL on browser other than firefox
				return true;
			}
			var url = this.element.href;
			var blacklist = new Array('/\.exe$/', '/\.rar$/', '/\.7z$/',
					'/\.mp3$/', '/\.zip$/',
			'/^http:\/\/report.kaskusnetworks.com\/index\.php\/laporhansip/');
			for ( var i = 0; i < blacklist.length; ++i) {
				var p = new RegExp(blacklist[i]);
				if (p.test(url)) {
					return true;
				}
			}
			var pid = this.vbPost.id.match(/([0-9]+)/)[1];
			if (url.contains(pid)) {
				return true;
			}
			if (url.contains('/member.php?')) {
				return true;
			}
			if (this.element.innerHTML
					.contains('http://static.kaskus.us/images/buttons/viewpost.gif')) {
				return true;
			}
			return false;
		};

		this.showPreview = function(event) {
			if (event.pageX || event.pageY) {
				posx = event.pageX;
				posy = event.pageY;
			} else if (event.clientX || e.clientY) {
				posx = event.clientX + document.body.scrollLeft
				+ document.documentElement.scrollLeft;
				posy = event.clientY + document.body.scrollTop
				+ document.documentElement.scrollTop;
			}
			var top = (posy + 20) + 'px';
			var left = (posx - 50) + 'px';
			if (!this.contentTitle) {
				GM_xmlhttpRequest( {
					vbLink : this,
					method : 'GET',
					url : this.element.href,
					onerror : function(rsp) {
						this.vbLink.contentTitle = 'Error';
						this.vbLink.contentURL = 'Invalid or blocked URL';
						VBPage.showPopup(left, top, this.vbLink.contentTitle,
								this.vbLink.contentURL + '<br/><br/><font color="red">You can disable this popup in Thread Tools menu</font>');
					},
					onload : function(rsp) {
						if (rsp.status == 200) {
							this.vbLink.contentTitle = rsp.finalUrl;
							this.vbLink.contentURL = rsp.finalUrl;
							var patt = new RegExp("<title>([^<]*)</title>", "i");
							var title = patt.exec(rsp.responseText);
							if (title) {
								this.vbLink.contentTitle = title[1];
							}
						} else {
							this.vbLink.contentTitle = 'Error';
							this.vbLink.contentURL = 'Invalid or blocked URL';
						}
						VBPage.showPopup(left, top, this.vbLink.contentTitle,
								this.vbLink.contentURL + '<br/><br/><font color="red">You can disable this popup in Thread Tools menu</font>');
					}
				});
			} else {
				VBPage.showPopup(left, top, this.contentTitle, this.contentURL + '<br/><br/><font color="red">You can disable this popup in Thread Tools menu</font>');
			}
		};

		this.hidePreview = function(event) {
			var a = this.element;
			var current_mouse_target = null;
			if (event.toElement) {
				current_mouse_target = event.toElement;
			} else if (event.relatedTarget) {
				current_mouse_target = event.relatedTarget;
			}
			// Code inside this if is executed when leaving the link and it's
			// children, for good
			if (a != current_mouse_target
					&& !isChildOf(a, current_mouse_target)) {
				VBPage.hidePopup();
			}
		};

		this.setupKSA = function(index) {
			var btn = getElement('.//input[@type="button" and @value="Show"]',
					this.element);
			if (btn.length > 0) { // kalau ada button 'Show' berarti spoiler
				// jebakan
				// move children element of the link to its parent node
				var achildren = this.element.childNodes;
				var n = achildren.length;
				for ( var k = 0; k < n; ++k) {
					this.element.parentNode.insertBefore(achildren[0],
							this.element);
				}
				// change link title to another text
				this.element.innerHTML = '&nbsp;&nbsp;Hidden Link >> ' + this.element.href
				.escapeHTML();
				this.element.style.color = 'red';
				this.element.style.textDecoration = 'none';
				this.element.id = this.id + '-trap';
				btn[0].parentNode.appendChild(this.element);
			} else {
				// cek link jebakan
				var patt = new RegExp("^\s*http:\/\/[^?\/]+", "i");
				this.title = patt.exec(this.element.innerHTML.trim());
				this.url = patt.exec(this.element.href);
				// kalo innerHTML starts with http dan gak sama dgn href
				if (this.title && this.url
						&& this.title.toString() != this.url.toString()) {
					// buat info link jebakan
					var info = document.createElement('span');
					info.id = this.id + '-info';
					info.className = 'smallfont';
					info.style.color = 'red';
					info.innerHTML = '&nbsp;&nbsp;Original Link >> ' + this.element.href;
					if (this.element.nextSibling) {
						this.element.parentNode.insertBefore(info,
								this.element.nextSibling); // add info to page
					} else {
						this.element.parentNode.appendChild(info);
					}
				}
				if (!this.noPreviewURL()) {
					this.element.vbLink = this;
					this.element.setAttribute('linkid', this.id);
					this.element.addEventListener('mouseover', function(event) {
						if (this.vbLink) {
							this.vbLink.showPreview(event);
						} else {
							VBPage.getLink(this.getAttribute('linkid'))
							.showPreview(event);
						}
					}, false);
					this.element.addEventListener('mouseout', function(event) {
						if (this.vbLink) {
							this.vbLink.hidePreview(event);
						} else {
							VBPage.getLink(this.getAttribute('linkid'))
							.hidePreview(event);
						}
					}, false);
				}
			}
		};
	}

	function VBSpoiler(el, parent, idx) {
		if (parent != 'none') {
			this.id = 'KSA-spoiler-' + parent.id + '-' + idx;
			el.id = 'KSA-spoiler-' + parent.id + '-' + idx;
		}
		this.element = el;
		this.vbPost = parent;
		this.content = getElement(
				'.//div//div[starts-with(@class,"content_spoiler")]', el, true);

		// check wether this is top spoiler in current post
		this.isTopSpoiler = function() {
			return null;// this.vbPost != 'none';
		};

		// +++++++++++++++++++++++++++++++++++++++++++++++++++ KSA functions

		this.showClick = function(str) {
			if (str == 'Show') {
				this.btShow.value = 'Hide';
				this.btShowAll.value = 'Hide All';
				this.content.style.display = '';
			} else {
				this.btShow.value = 'Show';
				this.btShowAll.value = 'Show All';
				this.content.style.display = 'none';
			}
			var bt = getElement('.//input[@type="button"]', this.element);
			for ( var i = 0; i < bt.length; ++i) {
				if (bt[i].value == str && bt[i] != this.btShow
						&& bt[i] != this.btShowAll) {
					click(bt[i]);
				}
			}
			/*
			 * if(str.contains('Hide') && this.isTopSpoiler) {
			 * this.element.scrollIntoView(true); }
			 */
		};

		this.setupKSA = function() {
			this.innerSpoilers = getElement(
					'.//div[contains(@id,"KSA-spoiler-")]', this.element).length;

			// get button Show
			var btShowOri = getElement(
					'.//input[@type="button" and @value="Show"]', this.element,
					true);
			if(btShowOri) {
				btShowOri.removeAttribute('onclick');
				this.btShow = btShowOri.cloneNode(true);
				btShowOri.parentNode.replaceChild(this.btShow, btShowOri);
			}else {
				var div = getElement('.//div[@class="smallfont"]', this.element, true);
				this.btShow = document.createElement('input');
				this.btShow.value = "Show";
				this.btShow.type = 'button';
				this.btShow.title = 'Show/Hide spoiler';
				div.appendChild(this.btShow);
				this.content.style.display = 'none';
			}
			this.btShow.vbSpoiler = this;
			this.btShow.setAttribute('spoilerid', this.id);
			this.btShow.removeAttribute('onclick');
			this.btShow.setAttribute('style', 'margin: 2px; font-size: 10px; padding: 2px; width: 60px !important');
			this.btShow.addEventListener('click', function() {
				if (this.vbSpoiler) {
					this.vbSpoiler.showClick(this.value);
				} else {
					VBPage.getSpoiler(this.getAttribute('spoilerid'))
					.showClick(this.value);
				}
			}, true);

			// add button Show All
			this.btShowAll = document.createElement('input');
			this.btShowAll.value = "Show All";
			this.btShowAll.type = 'button';
			this.btShowAll.title = 'Show/Hide all spoilers';
			this.btShowAll.setAttribute('style', 'margin: 2px; font-size: 10px; padding: 2px; width: 60px !important');
			this.btShowAll.vbPost = this.vbPost;
			this.btShowAll.setAttribute('postid', this.vbPost.id);
			this.btShowAll.addEventListener('click', function() {
				if (this.vbPost) {
					// substring to remove 'All'
					this.vbPost.showAllClick(this.value.substring(0, 4));
				} else {
					VBPage.getPost(this.getAttribute('postid')).showAllClick(
							this.value.substring(0, 4));
				}
			}, true);
			this.btShow.parentNode.insertBefore(this.btShowAll, this.btShow);

			var infoMsg = '';
			// cek jumlah gambar dalam spoiler
			var imgs = getElement('.//img', this.element);
			if (imgs.length > 0) {
				var maxSize = 0;
				var idx = -1;
				var totalGambar = 0;
				for ( var k = 0; k < imgs.length; ++k) {
					if (imgs[k].src
							.indexOf('http://static.kaskus.us/images/smilies') == -1) { // ignore
						// kaskus
						// smiley
						var size = imgs[k].width * imgs[k].height;
						if (size > 3000) { // ignore icon < 50x50
							if (maxSize < size) {
								maxSize = size;
								idx = k;
							}
							++totalGambar;
						}
					}
				}
				if (totalGambar > 0) {
					infoMsg = totalGambar + ' pics inside (max: '
					+ imgs[idx].width + 'x' + imgs[idx].height + ') ';
				}
			}
			if (this.innerSpoilers > 0) {
				if (infoMsg.length > 0) {
					infoMsg += ', ';
				}
				infoMsg += this.innerSpoilers + ' spoiler(s)';
			}
			// tampilkan info
			if (infoMsg.length > 0) {
				var info = document.createElement('span');
				info.id = this.id + '-info';
				info.className = 'smallfont';
				info.style.color = 'darkblue';
				info.innerHTML = infoMsg;
				var anchor = getElement('.//div[@class="alt2"]', this.element,
						true);

				this.element.insertBefore(info, anchor);
			}
		};
	}

	function VBPost(el) {
		this.id = el.id;
		this.element = el;

		// return all spoilers in this post
		this.getSpoilers = function() {
			var ret = [];
			var el = getElement('.//div[@class="spoiler"]', this.element);
			for ( var i = 0; i < el.length; ++i) {
				var sp = el[i];
				ret.push(new VBSpoiler(sp, this, i));
			}
			return ret;
		};

		this.getSpoiler = function(id) {
			for ( var i = 0; i < this.spoilers.length; ++i) {
				if (this.spoilers[i].id == id) {
					return this.spoilers[i];
				}
			}
		};

		this.getLinks = function() {
			var ret = [];
			var el = getElement('.//div[@class="entry"]//a', this.element);
			for ( var i = 0; i < el.length; ++i) {
				var l = el[i];
				ret.push(new VBLink(l, this, i));
			}
			return ret;
		};

		this.getLink = function(id) {
			for ( var i = 0; i < this.links.length; ++i) {
				if (this.links[i].id == id) {
					return this.links[i];
				}
			}
		};

		this.showAllClick = function(str) {
			for ( var i = 0; i < this.spoilers.length; ++i) {
				this.spoilers[i].showClick(str);
			}
			/*
			 * if(str.contains('Hide')) { this.element.scrollIntoView(true); }
			 */
		};

		this.setupKSA = function() {
			this.spoilers = this.getSpoilers();
			for ( var i = 0; i < this.spoilers.length; ++i) {
				this.spoilers[i].setupKSA(i);
			}
			if (this.spoilers.length == 1) {
				// hide btn 'show all' if there is only 1 spoiler
				this.spoilers[0].btShowAll.style.display = 'none';
			}
			this.links = this.getLinks();
			for ( var i = 0; i < this.links.length; ++i) {
				this.links[i].setupKSA(i);
			}
		};
	}

	// VBulletin page
	var VBPage = {
			getPosts : function() {
				var ret = [];
				if (location.href.contains('/group/discussion/')) {
					var el = getElement('.//section[@id="xxxxx-postNumberHere"]');
					for ( var i = 0; i < el.length; ++i) {
						var p = el[i].parentNode.parentNode;
						p.id = 'post_' + i;
						ret.push(new VBPost(p));
					}
				} else {
					var el = getElement('.//*[starts-with(@id,"post")]');
					var pattern = new RegExp('^post_?[0-9a-f]+$'); // match post1234abc or
					// post_1234
					for ( var i = 0; i < el.length; ++i) {
						if (pattern.test(el[i].id)) {
							ret.push(new VBPost(el[i]));
						}
					}
				}
				return ret;
			},

			getPost : function(id) {
				for ( var i = 0; i < this.posts.length; ++i) {
					if (this.posts[i].id == id) {
						return this.posts[i];
					}
				}
			},

			getSpoiler : function(id) {
				var ids = id.split('-');
				return this.getPost(ids[2]).getSpoiler(id);
			},

			getLink : function(id) {
				var ids = id.split('-');
				return this.getPost(ids[2]).getLink(id);
			},

			showPopup : function(x, y, title, content) {
				this.popup.style.top = y;
				this.popup.style.left = x;
				this.popup.innerHTML = '<table cellspacing="1" width="350px"><tr><td class="thead"><b>'
					+ title
					+ '</b><div style="float:right"><a id="ksaClosePopup">x</a></div></td></tr><tr><td class="vbmenu_option vbmenu_option_alink">'
					+ content + '</td></tr></table>';
				this.popup.style.display = '';

				getElement('#ksaClosePopup').addEventListener('click', function() {
					VBPage.hidePopup();
				}, true);
			},

			hidePopup : function() {
				this.popup.style.display = 'none';
			},

			showAllClick : function(item) {
				var str = item.getAttribute('ksa-action');
				if(str == null) {
					str = 'Show';
				}
				for ( var i = 0; i < this.posts.length; ++i) {
					this.posts[i].showAllClick(str);
				}
				var items = getElement('.//a[@ksa-tools-id="ksa-all-spoiler"]');
				for(var i = 0; i < items.length; ++i) {
					if(str == 'Show') {
						items[i].setAttribute('ksa-action', 'Hide');
						items[i].innerHTML = '<i class="fa fa-caret-down"></i> KSA - Hide all spoiler';
					}else {
						items[i].setAttribute('ksa-action', 'Show');
						items[i].innerHTML = '<i class="fa fa-caret-down"></i> KSA - Show all spoiler';
					}
				}
			},

			onKeyDown : function(event) {
				// Ctrl+Alt+S
				if (event.ctrlKey && event.altKey && event.keyCode == 83) {
					VBPage.openThreadTools();
				}
			},

			// because we only have one setting item then we use 'Thread Tools' menu for it
			openThreadTools : function() {
				var threadtools = getElement('.//div[contains(@class,"tools-panel dropdown")]', null, true);
				if(threadtools) {
					threadtools.setAttribute('class', threadtools.getAttribute('class') + ' open');
					document.documentElement.scrollTop = 0;
				}
			},

			closeThreadTools : function() {
				var threadtools = getElement('.//div[contains(@class,"tools-panel dropdown open")]', null, true);
				if(threadtools) {
					attr = threadtools.getAttribute('class');
					threadtools.setAttribute('class',attr.substring(0, attr.length - 5));
				}
			},

			addThreadTools : function(title, icon, id, callback) {
				var dropdown = getElement('.//ul[@aria-labelledby="thread-tools"]');
				if(dropdown && dropdown.length > 0) {
					for(var i = 0; i < dropdown.length; ++i) {
						var item = document.createElement('li');
						var link = document.createElement('a');
						link.href = '#';
						link.innerHTML = '<i class="fa '+icon+'"></i>'+title;
						link.addEventListener('click', callback);
						link.setAttribute('ksa-tools-id', id);
						item.appendChild(link);
						dropdown[i].appendChild(item);
					}
				}else {
					// try to set mobile site layout
					var tools = getElement('.//div[@class="tools"]', null, true);
					var item = document.createElement('span');
					item.setAttribute('class', 'p-right');
					item.innerHTML = '&nbsp;|&nbsp;';
					var link = document.createElement('a');
					link.href = '#';
					link.innerHTML = '<i class="fa '+icon+'"></i>'+title;
					link.addEventListener('click', callback);
					link.setAttribute('ksa-tools-id', id);
					item.insertBefore(link, item.firstChild);
					tools.appendChild(item);
				}
			},

			setupKSA : function() {
				this.posts = this.getPosts();
				for ( var i = 0; i < this.posts.length; ++i) {
					this.posts[i].setupKSA();
				}

				this.popup = document.createElement('div');
				this.popup.setAttribute('class', 'vbmenu_popup');
				this.popup.style.display = 'none';
				this.popup.style.position = 'absolute';
				this.popup.style.top = '50px';
				this.popup.style.left = '50px';
				this.popup.style.backgroundColor = '#eeeeee';
				getElement('body')[0].appendChild(this.popup);

				// setup show all spoiler
				this.addThreadTools(' KSA - Show all spoiler', 'fa-caret-down', 'ksa-all-spoiler', function() {
					VBPage.showAllClick(this);
					VBPage.closeThreadTools();
				});

				// add link preview setting to 'Thread Tools'
				var configLinkPreview = script.getValue("KSA_LINK_PREVIEW", 'true') == 'true'?' KSA - Hide link preview':' KSA - Show link preview';
				this.addThreadTools(configLinkPreview, 'fa-gear', 'ksa-link-preview', function() {
					var config = script.getValue("KSA_LINK_PREVIEW", 'true');
					if(config == 'true') {
						script.putValue("KSA_LINK_PREVIEW", 'false');
					}else {
						script.putValue("KSA_LINK_PREVIEW", 'true');
					}
					location.reload();
				});

				// add keyboard listener
				window.addEventListener('keydown', function(e) {
					VBPage.onKeyDown(e);
				}, true);

				if(GM_registerMenuCommand != 'undefined') {
					GM_registerMenuCommand("KSA Setting", VBPage.openThreadTools);
				}
			}
	};

	VBPage.setupKSA();
})();
