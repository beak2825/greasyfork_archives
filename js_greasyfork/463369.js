// ==UserScript==
// @name           DuoLingots
// @namespace      https://github.com/liuch/duolingo-scripts
// @include        Https://*duolingo.com/*
// @include        https://forum.duolingo.com/*
// @version        0.2.0
// @grant          none
// @description    More duolingots!!!!1111
// @author         Maevings0
// @license        MIT License
// @downloadURL https://update.greasyfork.org/scripts/463369/DuoLingots.user.js
// @updateURL https://update.greasyfork.org/scripts/463369/DuoLingots.meta.js
// ==/UserScript==

function inject(f) { //Inject the script into the document idk
	var script;
	script = document.createElement('script');
	script.type = 'text/javascript';
	script.setAttribute('name', 'duogivelingots');
	script.textContent = '(' + f.toString() + ')()';
	document.head.appendChild(script);
}
inject(f);


function f() {

	var observe = {
		observer: null,
		root_el: null,
		p_func: null,

		set: function(func) {
			this.root_el = document.getElementsByTagName("body")[0];
			if (this.root_el) {
				this.p_func = func;
				this.observer = new MutationObserver(function(mutations) {
					if (observe.p_func) {
						observe.stop();
						observe.p_func()
						observe.start();
					}
				});
			}
		},

		start: function() {
			this.observer.observe(this.root_el, { childList: true, subtree: true });
		},

		stop: function() {
			this.observer.disconnect();
		}
	};

	var post_id = null;

	var update_comment = function(id, link_el) {
		var el = null;
		if (link_el.parentElement.parentElement.children.length == 2) {
			el = link_el.parentElement.parentElement.children[1];
		}
		else {
			var span1 = document.createElement("span");
			span1.setAttribute("class", "_5j_V-");
			var span2 = document.createElement("span");
			span2.setAttribute("class", "_2ySWm");
			var span3 = document.createElement("span");
			span3.setAttribute("class", "fl9X4");
			span3.appendChild(document.createTextNode("0"));
			span1.appendChild(span2);
			span1.appendChild(span3);
			link_el.parentElement.parentElement.appendChild(span1);
			el = span1;
		}
		if (el) {
			el.childNodes[1].childNodes[0].nodeValue = parseInt(el.childNodes[1].childNodes[0].nodeValue) + 1;
		}
	};

	function get_toolbar_element() {
		var el = document.querySelector("div._3mmdn>div>a.XHOsr._3xRJe");
		if (!el) {
			el = document.querySelector("div._1vD0u.H_C0j>span._2XMOE.dRGy3.H_C0j>span._2cbOJ._3MxB2"); // new design
			if (!el)
				console.warn("DuoMoreLingots: Cannot find a toolbar element");
		}
		return el;
	}

	function total_lingots() {
		var lingots = 0;
		var el = get_toolbar_element();
		if (el) {
			if (el.nodeName == "A")
				lingots = parseInt(el.childNodes[1].nodeValue);
			else
				lingots = parseInt(el.childNodes[0].nodeValue); // new design
		}
		return lingots;
	}

	function decrement_total_lingots() {
		var el = get_toolbar_element();
		if (el) {
			var num = total_lingots();
			if (num > 0) {
				num -= 1;
			}
			if (el.nodeName == "A")
				el.childNodes[1].nodeValue = num;
			else
				el.childNodes[0].nodeValue = num; // new design
		}
	}

	function update_view(id, el) {
		observe.stop()
		decrement_total_lingots();
		update_comment(id, el);
		observe.start();
	}

	var send_one = function(id, el) {
		if (total_lingots() > 0) {
			fetch("https://forum-api.duolingo.com/comments/" + id + "/love", {
				method: 'POST',
				credentials: 'include'
			}).then(function() {
				update_view(id, el);
			});
		}
	};

	function set_interval_limited(id, num, timeout, el) {
		if (num <= 0) {
			return;
		}
		setTimeout(function() {
			send_one(id, el);
			set_interval_limited(id, num - 1, timeout, el);
		}, timeout);
	}

	var lover = function(id, el) {
		var num = parseInt(prompt("How many lingots would you like to give away?", "1"));
		if (num > 0 && (num <= 10 || confirm("Do you really want to give " + num + " lingots away?"))) {
			set_interval_limited(id, num, 200, el);
		}
		return false;
	};

	var new_give_lingots = function(el) {
		var id = null;
		var e = el.closest("div.uMmEI>div[id]");
		if (e) {
			id = e.getAttribute("id");
		}
		else if (el.closest("div._3eQwU")) {
			id = post_id;
		}

		if (id) {
			lover(id, el);
		}
	};

	function capture_click() {
		document.addEventListener("click", function(event) {
			var el = event.target;
			if (el && el.nodeName == "A" && el.classList.contains("dml-givelingots")) {
				new_give_lingots(el);
				event.stopPropagation();
				event.preventDefault();
			}
		});
	}

	function remove_listener(el) {
		var parent = el.parentElement;
		var text = el.text;
		el.remove();
		el = document.createElement("a");
		el.setAttribute("href", "javascript:;");
		el.setAttribute("class", "_2xNPC dml-givelingots");
		el.appendChild(document.createTextNode(text));
		parent.appendChild(el);
	}

	var loc_reg = new RegExp("^/comment/([0-9]+)($|\\$)");

	function try_update() {
		var a = loc_reg.exec(document.location.pathname);
		if (a) {
			post_id = a[1];
			var el_list = document.querySelectorAll("span._5j_V->a._2xNPC:not(.dml-givelingots)");
			for (var i = 0; i < el_list.length; i++) {
				remove_listener(el_list[i]);
			}
		}
		else {
			post_id = null;
		}
	}

	setTimeout(function() {
		try_update();
		capture_click();
		observe.set(try_update);
		observe.start();
	}, 100);
}