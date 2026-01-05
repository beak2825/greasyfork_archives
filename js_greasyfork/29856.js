// ==UserScript==
// @name        BigBro
// @namespace   Mana
// @author      Lúthien Sofea Elenassë
// @description Surveille l'activité d'un forum en temps réel
// @include     http://www.jeuxvideo.com/forums/0-*.htm
// @version     1
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/29856/BigBro.user.js
// @updateURL https://update.greasyfork.org/scripts/29856/BigBro.meta.js
// ==/UserScript==

// Extern
var controlWindow;
var gmCallerKey = "externalGMCaller";
(function () {
	var bGreasemonkeyServiceDefined = false;
	try {
		if (typeof Components.interfaces.gmIGreasemonkeyService === "object") {
			bGreasemonkeyServiceDefined = true;
		}
	} catch (err) {
		console.error(err);
	}
	if ( typeof(unsafeWindow)=== "undefined" || ! bGreasemonkeyServiceDefined) {
		controlWindow = (( function () {
			var dummyElem = document.createElement("p");
			dummyElem.setAttribute ("onclick", "return window;");
			return dummyElem.onclick ();
		})());
	} else {
        controlWindow = unsafeWindow;
    }
    return;
})();
function extern () {
	if (arguments.length > 0 && controlWindow.hasOwnProperty(gmCallerKey) && controlWindow[gmCallerKey].hasOwnProperty(arguments[0])) {
		return controlWindow[gmCallerKey][arguments[0]].apply(null, Array.prototype.slice.call(arguments, 1));
	}
}
// Creator
((function () {
	function Creator(doc) {
		this.doc = function () {
			return doc;
		};
	}
	Creator.prototype.fuse = function (attributes, base) {
		var key, result;
		if (!base) {
			return attributes;
		}
		if (!attributes) {
			return base;
		}
		result = {};
		for (key in base) {
			if (base.hasOwnProperty(key)) {
				result[key] = base[key];
			}
		}
		for (key in attributes) {
			if (attributes.hasOwnProperty(key)) {
				result[key] = attributes[key];
			}
		}
		return result;
	};
	Creator.prototype.text = function (text) {
		return this.doc().createTextNode(text);
	};
	Creator.prototype.element = function (tag, attributes, content, listeners) {
		var element, key, i;
		element = this.doc().createElement(tag);
		if (attributes) {
			for (key in attributes) {
				if (attributes.hasOwnProperty(key)) {
					element.setAttribute(key, attributes[key]);
				}
			}
		}
		for (i = 0; content && i < content.length; i += 1) {
			element.appendChild(content[i]);
		}
		if (listeners) {
			for (key in listeners) {
				if (listeners.hasOwnProperty(key)) {
					element.addEventListener(key, listeners[key], false);
				}
			}
		}
		return element;
	};
	Creator.prototype.input = function (type, attributes, content, listeners) {
		return this.element("input", this.fuse({type:type}, attributes), content, listeners);
	};
	Creator.prototype.script = function (content, id, attributes) {
		return this.element("script", this.fuse((id ? {id:id} : {}), attributes), [this.text(content)], {});
	};
	Creator.prototype.style = function (content, id, attributes) {
		return this.element("style", this.fuse((id ? {id:id} : {}), attributes), [this.text(content)], {});
	};
	Creator.prototype.audio = function (url, type, id, attributes) {
		return this.element("audio", this.fuse((id ? {id:id} : {}), attributes), [this.element("source", {src:url, type:"audio/" + type})], {});
	};
	Creator.prototype.br = function () {
		return this.element("br");
	};
	Creator.prototype.xhr = function (url, stateChange, output, attributes, error) {
		var xhr, attr, method;
		method = "GET";
		xhr = new XMLHttpRequest();
		if (attributes && attributes.method) {
			method = attributes.method;
		}
		xhr.open(method, url, true);
		if (attributes) {
			for(attr in attributes) {
				if (attr.toLowerCase() != "method") {
					xhr.setRequestHeader(attr, attributes[attr]);
				}
			}
		}
		xhr.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200 || !this.status) {
					if (stateChange) {
						stateChange(this.responseText, this);
					}
				} else {
					if (error) {
						error(this);
					}
				}
			}
		};
		xhr.send(output);
	};
	Creator.prototype.extern = function (id, key, fun, self) {
		var old, that;
		if (!controlWindow.hasOwnProperty(gmCallerKey)) {
			controlWindow[gmCallerKey] = {};
		}
		if (!controlWindow[gmCallerKey].hasOwnProperty(id)) {
			controlWindow[gmCallerKey][id] = function () {};
		}
		if (controlWindow[gmCallerKey].hasOwnProperty(id)) {
			old = controlWindow[gmCallerKey][id];
			that = self ? self : null;
			controlWindow[gmCallerKey][id] = function () {
				if (arguments.length > 0 && arguments[0] === key) {
					return fun.apply(that, Array.prototype.slice.call(arguments, 1));
				} else {
					return old.apply(that, arguments);
				}
			};
		} else {
			console.error(id, key, "not created");
		}
	};
	if (!controlWindow.hasOwnProperty(gmCallerKey)) {
		Creator.prototype.extern("Constructor", "Create", function (doc) {return new Creator(doc);}, null);
	}
})());
// BigBro
((function () {
	var bigbro = {};
	//
	bigbro.create = extern("Constructor", "Create", document);
	bigbro.name = "BigBro";
	bigbro.nForum = 52;
	bigbro.debug = false;
	bigbro.launchDate = new Date();
	bigbro.rewind = 6 * 60 * 60 * 1000;
	bigbro.delay = 10 * 1000;
	bigbro.mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
	bigbro.rssReg = new RegExp("Topic: (.*) \\(([0-9]+) réponses\\) - Auteur du topic: (.*)", "i");
	bigbro.rssDateReg = new RegExp("([0-9]{2}) (" + bigbro.mois.join("|") + ") ([0-9]{4}) à ([0-9]{2}):([0-9]{2}):([0-9]{2})", "i");
	bigbro.paginationReg = new RegExp("(<[^<>]*)class=\"(([^\"]*)pagi-(fin|precedent)-actif([^\"]*))\"([^>]*>)", "i");
	bigbro.urlReg = new RegExp("^(.*/)(([0-9]+)-([0-9]+)-([0-9]+)-([0-9]+)-[^-]*-([0-9]+)-[^-]*-[^\\.]*\\.htm)((\\?|#).*)?$", "i");
	bigbro.postHead = "<span id=\"post_";
	bigbro.postEnd = "<div class=\"bloc-pagi-default\">";
	bigbro.postEnd2 = "<div class=\"bloc-outils-plus-modo";
	bigbro.callCount = 0;
	bigbro.maxCallCount = 10;
	bigbro.nextCall = [];
	bigbro.listen = function (key, fun) {
		this.create.extern(this.name, key, fun, this);
	};
	bigbro.callList = {};
	bigbro.call = function () {
		if (!this.callList.hasOwnProperty(arguments[0])) {
			this.callList[arguments[0]] = 1;
		};
		return extern(this.name, arguments[0], Array.prototype.slice.call(arguments, 1));
	};
	bigbro.console = function() {
		if (this.debug) {
			console.debug(arguments);
		}
	};
	bigbro.error = function() {
		console.error(arguments);
	};
	bigbro.regToDate = function (reg) {
		var i, mois;
		if (!reg) {
			return;
		}
		for (i = 0; i < this.mois.length; i += 1) {
			if (this.mois[i] === reg[2]) {
				mois = i;
			}
		}
		return new Date(
				parseInt(reg[3], 10),
				mois,
				parseInt(reg[1], 10),
				parseInt(reg[4], 10),
				parseInt(reg[5], 10),
				parseInt(reg[6], 10));
	};
	bigbro.readJvCare = function (l) {
		var t, r, a, s, c, g, y, j;
		g = "0A12B34C56D78E9F";
		y = "";
		j = 0;
		try {
			c = l.indexOf(" ");
			j = l.indexOf(" ", c + 1);
			j = j === -1 ? l.length : j;
			if (/[0A12B34C56D78E9F]+/.test(l.substr(c + 1, j - c - 1))) {
				y = "";
				if (c > 0) {
					t = l.substr(c + 1, j - c - 1);
					for (s = 0; s < t.length; s += 2) {
						r = g.indexOf(t.charAt(s));
						a = g.indexOf(t.charAt(s + 1));
						y += String.fromCharCode(16 * r + a);
					}
				}
			}
		} catch (x) {
			console.error(x);
		}
		return y;
	};
	bigbro.mute = function mute(input, audioId) {
		var state, audio;
		audio = document.getElementById(audioId);
		if (audio) {
			state = !input.getAttribute("state");
			input.setAttribute("state", state ? "1" : "");
			input.value = state ? "Sound" : "Mute";
			audio.muted = !state;
		}
	};
	bigbro.filter = function filter(filterType, value) {
		var filterOn, filters, list, i, j, type, val, res;
		filterOn = document.getElementById("filter-" + filterType);
		if (filterOn) {
			filterOn.value = filterOn.value === value ? "" : value;
			filters = document.getElementsByClassName("bigbro-filter");
			list = document.getElementsByClassName("bigbro-message");
			for (i = 0; i < list.length; i += 1) {
				res = true;
				for (j = 0; res && j < filters.length; j += 1) {
					type = filters[j].getAttribute("target");
					val = list[i].getAttribute(type);
					res = val === filters[j].value || filters[j].value === "";
				}
				list[i].style.display = res ? "block" : "none";
			}
		}
	};
	bigbro.toggleVisibilityMess = function toggleVisibilityMess(button) {
		var bloc, id, state;
		if (button) {
			id = button.getAttribute("target");
		}
		if (id) {
			bloc = document.getElementById(id);
		}
		if (bloc) {
			bloc = bloc.parentNode.getElementsByClassName("bloc-contenu")[0];
		}
		if (bloc) {
			state = bloc.style.display === "none";
			if (state) {
				bloc.style.display = "";
				button.className = "picto-msg-tronche";
				button.title = "Masquer";
			} else {
				bloc.style.display = "none";
				button.className = "picto-msg-quote";
				button.title = "Afficher";
			}
		}
	};
	bigbro.toggleDataVisible = function toggleDataVisible(chainMess) {
		var i, key;
		if (chainMess) {
			key = "data-visible";
			i = chainMess.getAttribute(key);
			chainMess.setAttribute(key, i === "1" ? "0" : "1");
		}
	};
	bigbro.initFilter = function (div, filterType, value) {
		var filterOn;
		filterOn = document.getElementById("filter-" + filterType);
		if (filterOn) {
			div.style.display = (value === filterOn.value || filterOn.value === "") ? "block" : "none";
		}
	};
	bigbro.addOneToPseudo = function(name, date) {
		var nl, id, bloc, elem, content, i, className;
		this.console("addOneToPseudo", arguments, this);
		className = "bigbro-pseudo";
		nl = name.toLowerCase();
		id = "pseudo_" + nl;
		bloc = document.getElementById(id);
		if (!bloc) {
			bloc = this.create.element("li", {id: id, style:"padding:0", "class": className, date: date.getTime()});
			bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"width: 50%;"}, [this.create.text("")]));
			bloc.appendChild(this.create.text("\t"));
			bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"cursor: pointer;width: 15%", onclick: "filter('pseudo', '" + nl + "');"}, [this.create.text(name)]));
			bloc.appendChild(this.create.text("\t"));
			bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"width: 5%"}, [this.create.text(0)]));
			bloc.appendChild(this.create.text("\t"));
			bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"width: 30%", date: date.getTime()}, [this.create.text(date.toLocaleString())]));
			bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"float: none; clear: left;"}));
		}
		content = bloc.getElementsByTagName("span");
		if (content && content.length > 2) {
			elem = content[2];
			if (elem && elem.firstChild) {
				i = parseInt(elem.firstChild.nodeValue, 10);
				elem.firstChild.nodeValue = i + 1;
			}
			elem = content[3];
			if (elem && elem.getAttribute("date") && elem.getAttribute("date") < date.getTime()) {
				elem.setAttribute("date", date.getTime());
				bloc.setAttribute("date", date.getTime());
				elem.firstChild.nodeValue = date.toLocaleString();
			}
		}
		date = parseInt(bloc.getAttribute("date"), 10);
		content = document.getElementsByClassName(className);
		i = 0;
		while (i < content.length && date < parseInt(content[i].getAttribute("date"), 10)) {
			i += 1;
		}
		if (i < content.length) {
			content[i].parentNode.insertBefore(bloc, content[i]);
		} else {
			this.pseudos.appendChild(bloc);
		}
	};
	bigbro.addOneToTopic = function(item, date) {
		var id, bloc, elem, content, i, className;
		this.console("addOneToTopic", arguments, this);
		className = "bigbro-topic";
		id = "topic_" + item.id;
		bloc = document.getElementById(id);
		if (!bloc) {
			bloc = this.create.element("li", {id: id, style:"padding:0", "class": className, date: date.getTime()});
			bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"cursor: pointer;width: 50%", onclick: "filter('topic', '" + item.id + "');"}, [this.create.text(item.title)]));
			bloc.appendChild(this.create.text("\t"));
			bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"cursor: pointer;width: 15%", onclick: "filter('pseudo', '" + item.author.toLowerCase() + "');"}, [this.create.text(item.author)]));
			bloc.appendChild(this.create.text("\t"));
			bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"width: 5%"}, [this.create.text(0)]));
			bloc.appendChild(this.create.text("\t"));
			bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"width: 30%", date: date.getTime()}, [this.create.text(date.toLocaleString())]));
			bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"float: none; clear: left;"}));
		}
		content = bloc.getElementsByTagName("span");
		if (content && content.length > 3) {
			elem = content[2];
			if (elem && elem.firstChild) {
				i = parseInt(elem.firstChild.nodeValue, 10);
				elem.firstChild.nodeValue = i + 1;
			}
			elem = content[3];
			if (elem && elem.getAttribute("date") && elem.getAttribute("date") < date.getTime()) {
				elem.setAttribute("date", date.getTime());
				bloc.setAttribute("date", date.getTime());
				elem.firstChild.nodeValue = date.toLocaleString();
			}
		}
		date = parseInt(bloc.getAttribute("date"), 10);
		content = document.getElementsByClassName(className);
		i = 0;
		while (i < content.length && date < parseInt(content[i].getAttribute("date"), 10)) {
			i += 1;
		}
		if (i < content.length) {
			content[i].parentNode.insertBefore(bloc, content[i]);
		} else {
			this.forum.appendChild(bloc);
		}
	};
	bigbro.readMessage = function (messAsText, item, page, i) {
		var reg, id, date, div, nb, ref, list, n, temp, bloc, filters, j, res;
		this.console("readMessage", arguments, this);
		j = messAsText.indexOf("\"") + 1;
		id = messAsText.substring(j, j + messAsText.substring(j).indexOf("\""));
		if (id && document.getElementById(id)) {
			return false;
		}
		reg = this.rssDateReg.exec(messAsText);
		if (reg) {
			date = this.regToDate(reg);
		}
		if (date && this.thread) {
			if (date >= this.launchDate) {
				div = this.create.element("div", {"date": date.getTime(), "class": "bigbro-message", topic:item.id, mess:0});
				div.innerHTML = messAsText;
				nb = 0;//TODO
				this.initFilter(div);
				list = div.getElementsByClassName("JvCare");
				for (n = list.length - 1; n >= 0; n--) {
					temp = this.readJvCare(list[n].className);
					if (temp.substring(0,4).toLowerCase() !== "http") {
						if (temp.substring(0,1) === "/") {
							if (temp.substring(1,2) === "/") {
								temp = "http:" + temp;
							} else {
								temp = "http://www.jeuxvideo.com" + temp;
							}
						}
					}
					bloc = this.create.element("a", {href:temp, target:"_blank"});
					list[n].parentNode.insertBefore(bloc, list[n]);
					bloc.appendChild(list[n]);
				}
				bloc = div.getElementsByClassName("txt-msg")[0];
				if (bloc) {
					list = bloc.getElementsByClassName("JvCare");
					for (n = list.length - 1; n >= 0; n--) {
						while (list[n].firstChild) {
							list[n].parentNode.appendChild(list[n].firstChild);
						}
					}
				}
				list = div.getElementsByClassName("bloc-message-forum");
				if (list[0]) {
					div.setAttribute("mess", list[0].getAttribute("data-id"));
				}
				list = div.getElementsByClassName("bloc-options-msg");
				if (list[0]) {
					bloc = this.create.text("Afficher/Masquer");
					temp = bloc;
					bloc = this.create.element("span", {}, [temp]);
					temp = bloc;
					bloc = this.create.element("span", {"class": "picto-msg-tronche", title: "Masquer", style:"cursor:pointer;", target:id, onclick:"toggleVisibilityMess(this);"}, [temp]);
					temp = bloc;
					bloc = this.create.element("div", {"class":"bloc-mp-pseudo bigbro-visibility"}, [temp]);
					list[0].parentNode.insertBefore(bloc, list[0]);
					//
					bloc = this.create.element("span", {topic:item.id, style:"overflow:hidden;", title: item.title, onclick: "filter('topic', '" + item.id + "');"});
					bloc.appendChild(this.create.text(item.title.substring(0, Math.min(item.title.length, 30))));
					temp = bloc;
					bloc = this.create.element("div", {"class":"bloc-options-msg bigbro-thread-name"}, [temp]);
					list[0].parentNode.insertBefore(bloc, list[0].nextSibling);
					list[0].style.maxWidth = "50%";
				}
				filters = document.getElementsByClassName("bigbro-filter");
				list = div.getElementsByClassName("bloc-date-msg");
				if (list[0]) {
					bloc = this.create.text("Accès direct");
					temp = bloc;
					bloc = this.create.element("span", {}, [temp]);
					temp = bloc;
					bloc = this.create.element("span", {"class": "picto-msg-restaurer", title: "Accès direct"}, [temp]);
					temp = bloc;
					bloc = this.create.element("a", {"href": "", target: "_blank"}, [temp]);
					list[0].insertBefore(bloc, list[0].firstChild);
					list[0].style.maxWidth = "50%";
					temp = "http:" + item.link + "#post_" + div.getAttribute("mess");
					reg = this.urlReg.exec(temp);
					if (reg) {
						temp = temp.split(reg[5] + "-" + reg[6]).join(reg[5] + "-" + page);
						bloc.href = temp;
					}
				}
				list = div.getElementsByClassName("blockquote-jv");
				for (j = 0; j < list.length; j += 1) {
					list[j].setAttribute("onclick", "toggleDataVisible(this);");
				}
				res = true;
				for (j = 0; res && j < filters.length; j += 1) {
					type = filters[j].getAttribute("target");
					val = div.getAttribute(type);
					res = val === filters[j].value || filters[j].value === "";
				}
				div.style.display = res ? "block" : "none";
				ref = this.thread.firstChild;
				while (ref && ref.getAttribute("date") > date.getTime()) {
					ref = ref.nextSibling;
				}
				while (ref && ref.getAttribute("date") == date.getTime() && ref.getAttribute("nb") > nb) {
					ref = ref.nextSibling;
				}
				// console.debug([i, date, item.id, item, this.info]);
				this.thread.insertBefore(div, ref);
				this.addOneToTopic(item, date);
				bloc = div.getElementsByClassName("bloc-pseudo-msg")[0];
				if (bloc && bloc.firstChild && bloc.firstChild.nodeValue) {
					div.setAttribute("pseudo", bloc.firstChild.nodeValue.trim().toLowerCase());
					bloc.parentNode.parentNode.insertBefore(bloc, bloc.parentNode);
					bloc.style.cursor = "pointer";
					bloc.setAttribute("onclick", "filter('pseudo', '" + bloc.firstChild.nodeValue.trim().toLowerCase() + "');");
					this.addOneToPseudo(bloc.firstChild.nodeValue.trim(), date);
				}
				if (item.maxDate < date) {
					item.maxDate = date;
				}
				if (this.info.maxDate < date) {
					this.info.maxDate = date;
				}
				if (this.alert.paused && !this.alert.muted) {
					this.alert.play();
				}
				this.call("alterMess", div);
				return true;
			}
		} else {
			this.error("KO-E", reg, arguments);
		}
		return false;
	};
	bigbro.askPrevPage = function (reg, mess) {
		var n, prefix, suffix;
		this.console("askPrevPage", arguments, this);
		if (reg && reg[6]) {
			n = parseInt(reg[6], 10) - 1;
			if (n > 0) {
				prefix = [reg[3], reg[4], reg[5], ""].join("-");
				suffix = reg[2].substring(prefix.length + reg[6].length);
				this.create.xhr(reg[1] + prefix + n + suffix, bigbro.onLastPageEntry, null, {});
			}
		} else {
			this.error("KO-F", reg, mess, this.info);
		}
	};
	bigbro.onLastPage = function (responseText, xhr) {
		var reg, item, text, i, list, mess, page;
		this.console("onLastPage", arguments, this);
		reg = this.urlReg.exec(xhr.responseURL);
		if (reg) {
			item = this.info.list[reg[4] + reg[5]];
			page = reg[6];
		}
		if (item) {
			text = responseText;
			i = text.indexOf(this.postHead);
			text = text.substring(i);
			i = text.indexOf(this.postEnd2);
			if (i < 0 || i >= text.length) {
				i = text.indexOf(this.postEnd);
			}
			text = text.substring(0, i);
			list = text.split(this.postHead);
			list.shift();
			for (i = 0; i < list.length; i += 1) {
				if (this.readMessage(this.postHead + list[i].trim(), item, page, i) && i === 0) {
					this.askPrevPage(reg, item);
				}
			}
		} else {
			this.error("KO-C", reg, item, this.info);
		}
	};
	bigbro.onLastPageEntry = function (responseText, xhr) {
		bigbro.onLastPage(responseText, xhr);
	};
	bigbro.onFirstPage = function (responseText, xhr) {
		var reg, lastPageUrl, item;
		this.console("onFirstPage", arguments, this);
		this.extractAjax(responseText);
		reg = this.paginationReg.exec(responseText);
		if (reg) {
			lastPageUrl = this.readJvCare(reg[2]);
		}
		if (lastPageUrl) {
			reg = [];
			reg.push(this.urlReg.exec(lastPageUrl));
			reg.push(this.urlReg.exec(xhr.responseURL));
			if (reg[0] && reg[0][2] && reg[1] && reg[1][1]) {
				item = this.info.list[reg[0][4] + reg[0][5]];
				if (item) {
					item.lastKnownPage = reg[0][6];
				} else {
					this.error("KO-A", reg[0], this.info);
				}
				this.create.xhr(reg[1][1] + reg[0][2], bigbro.onLastPageEntry, null, {});
			} else {
				this.error(["KO-B", reg]);
			}
		} else {
			this.onLastPage(responseText, xhr);
		}
	};
	bigbro.onFirstPageEntry = function (responseText, xhr) {
		bigbro.onFirstPage(responseText, xhr);
	};
	bigbro.fuseItem = function (id, newItem, oldItem) {
		this.console("fuseItem", arguments, this);
		if (!oldItem || oldItem.maxDate < newItem.date) {
			newItem.refDate = oldItem ? oldItem.maxDate : 0;
			this.create.xhr("http:" + newItem.link, bigbro.onFirstPageEntry, null, {});
		}
	};
	bigbro.fuse = function (oldData, newData) {
		var id, list, val;
		this.console("fuse", arguments, this);
		if (oldData.maxDate < newData.maxDate) {
			for (id in oldData.list) {
				oldData.list[id].refDate = oldData.list[id].maxDate;
			}
			for (id in newData.list) {
				this.fuseItem(id, newData.list[id], oldData.list[id]);
				if (!oldData.hasOwnProperty(id)) {
					this.info.list[id] = {};
					for (val in newData.list[id]) {
						if (newData.list[id].hasOwnProperty(val)) {
							this.info.list[id][val] = newData.list[id][val];
						}
					}
					this.info.list[id].maxDate= 0;
				}
			}
		}
		return oldData;
	};
	bigbro.readRssItem = function (item, i, data) {
		var info, bloc, reg, mois;
		this.console("readRssItem", arguments, this);
		info = {};
		bloc = item.getElementsByTagName("description")[0];
		if (bloc && bloc.firstChild && bloc.firstChild.nodeValue) {
			reg = this.rssReg.exec(bloc.firstChild.nodeValue.trim());
			if (reg) {
				info.title = reg[1];
				info.nb = parseInt(reg[2], 10);
				info.author = reg[3];
			}
		}
		bloc = item.getElementsByTagName("link")[0];
		if (bloc && bloc.nextSibling && bloc.nextSibling.nodeValue) {
			info.link = bloc.nextSibling.nodeValue.trim();
			reg = this.urlReg.exec(info.link);
			if (reg) {
				info.id = reg[4] + reg[5];
			}
		}
		if (!info.id) {
			if (bloc && bloc.firstChild && bloc.firstChild.nodeValue) {
				info.id = bloc.firstChild.nodeValue;
			} else {
				info.id = 0;
			}
		}
		bloc = item.getElementsByTagName("pubdate")[0];
		if (bloc && bloc.firstChild && bloc.firstChild.nodeValue) {
			reg = this.rssDateReg.exec(bloc.firstChild.nodeValue.trim());
			if (reg) {
				info.date = this.regToDate(reg);
				if (data.maxDate < info.date) {
					data.maxDate = info.date;
				}
				if (data.hasOwnProperty("refDate")) {
					info.next = data.refDate < info.date;
				}
			}
		}
		bloc = item.getElementsByTagName("guid")[0];
		data.list[info.id] = info;
		if (data.refDate) {
			info.refDate = data.refDate < info.date ? data.refDate : info.date;
		} else {
			info.refDate = info.date;
		}
	};
	bigbro.readRss = function (responseText, xhr) {
		var bloc, data, list, i;
		this.console("readRss", arguments, this);
		bloc = this.create.element("div");
		bloc.innerHTML = responseText;
		data = {maxDate: 0, when:new Date(), list:{}};
		if (this.hasOwnProperty("info")) {
			this.info.refDate = this.info.maxDate;
			data.refDate = this.info.maxDate;
		} else {
			data.refDate = this.launchDate;
		}
		list = bloc.getElementsByTagName("item");
		for (i = 0; i < list.length; i += 1) {
			this.readRssItem(list[i], i, data);
		}
		if (!this.hasOwnProperty("info")) {
			this.info = {maxDate: data.refDate, when:data.refDate, refDate:data.refDate, list: {}};
		}
		this.info = this.fuse(this.info, data);
		list = bloc.getElementsByTagName("link");
		if (list.length > 0 && list[0].nextSibling && list[0].nextSibling.nodeValue) {
			document.getElementById("link-forum").href = list[0].nextSibling.nodeValue.trim();
			document.getElementById("link-forum").style.display = "inline-block";
		}
		setTimeout(callRss, this.delay);
	};
	bigbro.readRssEntry = function (responseText, xhr) {
		bigbro.callCount = 0;
		bigbro.readRss(responseText);
	};
	bigbro.extractAjax = function (content) {
		var ajax, list, el, i;
		ajax = [];
		list = content ? content.split("data-url") : [""];
		list.shift();
		while (list.length > 0) {
			el = list.shift();
			i = el.indexOf("\"") + 1;
			ajax.push(el.substring(i, i + el.substring(i).indexOf("\"")));
		}
		while (ajax.length > 0) {
			el = ajax.pop();
			try {
				this.ajax[el.toLowerCase().split("/").pop().split(".php").shift()] = location.origin + el;
			} catch (e) {
				this.ajax[el.toLowerCase()] = location.origin + el;
			}
		}
	};
	bigbro.init = function () {
		var input, bloc, text;
		var highestTimeoutId = setTimeout(";");
		for (var i = 0 ; i < highestTimeoutId ; i++) {
			clearInterval(i); 
		}	
		this.call("beforeInit");
		this.launchDate.setTime(this.launchDate.getTime() - this.rewind);
		document.head.appendChild(this.create.style(".bigbro-table-cell {display:block;overflow:hidden;float:left;}"));
		document.head.appendChild(this.create.style(".bigbro-table-head {z-index:1;}"));
		document.head.appendChild(this.create.script(this.filter.toString(), "bigbro-filter", {}));
		document.head.appendChild(this.create.script(this.mute.toString(), "bigbro-mute", {}));
		document.head.appendChild(this.create.script(this.toggleVisibilityMess.toString(), "bigbro-toggleVisibilityMess", {}));
		document.head.appendChild(this.create.script(this.toggleDataVisible.toString(), "bigbro-toggleDataVisible", {}));
		this.ajax = {};
		this.extractAjax(document.getElementsByTagName("body")[0].innerHTML);
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
		this.header = this.create.element("div", {style: "position:fixed; top: 0; left: 0;z-index: 99999;"});
		document.body.appendChild(this.header);
		bloc = this.create.element("div", {style:"display: none;"});
		this.header.appendChild(bloc);
		this.alert = this.create.audio("http://soundbible.com/mp3/Blop-Mark_DiAngelo-79054334.mp3", "mpeg", "bigbro-blop");
		this.alert.muted = true;
		bloc.appendChild(this.alert);
		bloc = this.create.element("div", {"class": "bigbro-generic", style:"display: inline;"});
		this.header.appendChild(bloc);
		bloc.appendChild(this.create.element("input", {type:"hidden", id:"filter-topic", target:"topic", "class":"bigbro-filter"}));
		bloc.appendChild(this.create.element("input", {type:"hidden", id:"filter-pseudo", target:"pseudo", "class":"bigbro-filter"}));
		input = this.create.element("input", {type:"button", value:"Debug : " + bigbro.debug});
		input.addEventListener("click", function () {bigbro.debug = !bigbro.debug;this.value = "Debug : " + bigbro.debug;}, false);
		bloc.appendChild(input);
		input = this.create.element("input", {type:"button", value:"info"});
		input.addEventListener("click", function () {console.debug(bigbro);}, false);
		bloc.appendChild(input);
		input = this.create.element("input", {type:"button", value:"Live", id:"cont"});
		input.addEventListener("click", function () {
				if (this.value === "Stopped") {
					this.value = "Live";
					bigbro.callCount = 0;
					callRss();
				} else {
					this.value = "Stopping";
				}
			}, false);
		bloc.appendChild(input);
		input = this.create.element("input", {type:"button", value:"Mute", state:"", onclick:"mute(this, \"" + this.alert.id + "\");"});
		bloc.appendChild(input);
		this.forum = this.create.element("ul", {style:"margin-top: 30px;margin-left: 5px;", "class": "bigbro-generic topic-list"});
		document.body.appendChild(this.forum);
		bloc = this.create.element("li", {style:"padding:0", "class": "bigbro-table-head topic-head"});
		bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"cursor: pointer;width: 50%", onclick: "filter('topic', '');"}, [this.create.text("SUJET")]));
		bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"cursor: pointer;width: 15%", onclick: "filter('pseudo', '');"}, [this.create.text("AUTEUR")]));
		bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"width: 5%"}, [this.create.text("NB")]));
		bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"width: 30%"}, [this.create.text("DATE")]));
		bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"clear: left;"}));
		this.forum.appendChild(bloc);
		this.thread = this.create.element("div", {"class": "bigbro-generic topic-head"});
		document.body.appendChild(this.thread);
		this.pseudos = this.create.element("ul", {style:"margin-top: 30px;margin-left: 5px;", "class": "bigbro-generic topic-list"});
		document.body.appendChild(this.pseudos);
		bloc = this.create.element("li", {style:"padding:0", "class": "bigbro-table-head topic-head"});
		bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"width: 50%"}, [this.create.text("")]));
		bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"cursor: pointer;width: 15%", onclick: "filter('pseudo', '');"}, [this.create.text("AUTEUR")]));
		bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"width: 5%"}, [this.create.text("NB")]));
		bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"width: 30%"}, [this.create.text("DATE")]));
		bloc.appendChild(this.create.element("span", {"class": "bigbro-table-cell", style:"clear: left;"}));
		this.pseudos.appendChild(bloc);
		
		this.rssUrl = "http://www.jeuxvideo.com/rss/forums/" + this.nForum + ".xml";
		callRss();
		bloc = document.head.getElementsByTagName("title")[0];
		if (bloc && bloc.firstChild && bloc.firstChild.nodeValue) {
			text = bloc.firstChild.nodeValue.split(" - ")[0].substring(6);
			bloc.firstChild.nodeValue = "Big Bro' " + text;
			this.header.appendChild(this.create.element("a", {id:"link-forum", href:"#", target: "_blank", style:"display:none;background-color:#FFF;border: 2px solid #000;padding: 2px;"}, [this.create.text(text)]));
		}
		this.call("afterInit");
	};
	bigbro.launch = function () {
		this.init();
	};
	bigbro.entryPoint = function () {
		var input, reg;
		bigbro.listen("get", function () {return bigbro;});
		input = this.create.element("input", {value: "OFF"});
		reg = this.urlReg.exec(location.href);
		if (reg) {
			input.value = "Launch";
			this.nForum = reg[4];
			input.addEventListener("click", moar, false);
			return input;
		}
	};
	function callRss() {
		if (bigbro.callCount < bigbro.maxCallCount && document.getElementById("cont").value == "Live") {
			bigbro.callCount += 1;
			bigbro.create.xhr(bigbro.rssUrl + "?" + new Date().getTime(), bigbro.readRssEntry, null, {}, callRss);
		} else {
			bigbro.callCount = 0;
			document.getElementById("cont").value = "Stopped";
		}
	}
	function moar() {
		var r = prompt("Rewind ? (min)", "60");
		try {
			if (r) {
				bigbro.rewind = parseInt(r, 10) * 60 * 1000;
				bigbro.launch();
			}
		} catch (x) {
		}
	}
	document.body.appendChild(bigbro.entryPoint());
})());
