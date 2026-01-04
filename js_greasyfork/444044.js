// ==UserScript==
// @name         js-domExtend
// @namespace    http://tampermonkey.net/
// @version      1.7.2
// @description  轻量级原生js增强插件，将部分原生dom对象方法模仿jQuery进行二次封装，便于使用
// @author       tutu辣么可爱(greasyfork)/IcedWatermelonJuice(github)
// @day          2022.5.27 GMT+0800 (中国标准时间)
// @license      MIT License
// @note         相关参考信息请前往greasyfork仓库或github仓库
// @note         greasyfork仓库:
// @note         github仓库:https://github.com/IcedWatermelonJuice/js-domExtend
// ==/UserScript==

function $ele(dom, dom2 = document) {
	if (typeof dom === "object") {
		return dom;
	} else if (!dom || typeof dom !== "string") {
		return document;
	} else if (dom.trim()[0] === "<" && dom.indexof(">") > 0 && dom.trim().length >= 3) {
		dom2 = document.createElement("div");
		dom2.innerHTML = dom;
		dom2 = dom2.childNodes;
	} else {
		dom2 = dom2.querySelectorAll(dom);
	}
	return dom2.length > 1 ? dom2 : dom2[0]
}

function $eleFn(dom, dom2 = document) {
	return {
		data: [dom, dom2],
		listen: function(callback, interval = 500) {
			if (typeof callback !== "function") {
				return null
			}
			var that = this;
			return setInterval(() => {
				let target = $ele(that.data[0], that.data[1]);
				if (target) {
					callback(target);
				}
			}, interval)
		},
		ready: function(callback, timeout = 3000) {
			var timer = this.listen((target) => {
				clearInterval(timer);
				callback(target);
			})
			setTimeout(() => {
				clearInterval(timer);
			}, timeout)
			return timer
		},
		copy: function(str) {
			var res = false;
			if (typeof str === "string" && str.trim()) {
				let text = $ele("body").insert(`<textarea style="opacity: 0"></textarea>`);
				text.value = str;
				text.select();
				res = document.execCommand("copy");
				text.remove();
			}
			return res;
		},
		ajax: function(options) {
			options.method = options.method || "GET";
			options.params = options.params || null;
			options.timeout = options.timeout || 60 * 1000;
			options.success = typeof options.success === "function" ? options.success : function() {};
			options.error = typeof options.error === "function" ? options.error : function() {};
			var xhr = new XMLHttpRequest();
			xhr.open(options.method, options.url);
			if (options.method.toLowerCase() !== 'get') { //判断请求方式
				xhr.setRequestHeader('Content-Type', "application / x - www - form - urlencoded");
				var str = "";
				for (p in options.params) {
					str += `${p}=${options.params[p]}&`;
				}
				options.params = str;
			}
			xhr.timeout = options.timeout;
			xhr.ontimeout = () => {
				options.error();
			}
			xhr.send(options.params);
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status >= 200 && xhr.status < 300) {
						options.success(xhr.responseText);
					} else {
						options.error();
					}
				}
			}
			return xhr
		}
	}
}

function $domExtendJS() {
	//Element
	Element.prototype.attr = function(key, val) {
		if (typeof key === "string") {
			if (/string|boolean/.test(typeof val)) {
				if (!val && val !== false) {
					this.removeAttribute(key);
				} else {
					this.setAttribute(key, val);
				}
				return this;
			} else {
				return this.getAttribute(key);
			}
		}
	}
	Element.prototype.data = function(key, val) {
		this.dataAttrsMap = this.dataAttrsMap ? this.dataAttrsMap : {};
		for (let i = 0; i < this.attributes.length; i++) {
			let attr = this.attributes[i];
			if (/^data-/.test(attr.name)) {
				this.dataAttrsMap[attr.name] = attr.value;
			}
		}
		if (typeof key === "string") {
			key = `data-${key}`;
			if (/string|boolean/.test(typeof val)) {
				if (!val && val !== false) {
					delete this.dataAttrsMap[key];
					this.attr(key, "");
				} else {
					this.dataAttrsMap[key] = val;
					this.attr(key) !== null && this.attr(key, val);
				}
				return this;
			} else {
				return this.dataAttrsMap[key];
			}
		}
	}
	Element.prototype.css = function(key, val) {
		if (typeof key === "string") {
			if (/string|boolean/.test(typeof val)) {
				this.style.setProperty(key, val);
			} else if (!val) {
				return getComputedStyle(this)[key];
			}
		} else {
			for (let i in key) {
				this.style.setProperty(i, key[i]);
			}
		}
		if (this.style === "") {
			this.attr("style", "")
		}
		return this;
	}
	Element.prototype.hide = function() {
		this.data("displayBackup", this.css("display"));
		this.css("display", "none")
		return this;
	}
	Element.prototype.show = function() {
		var backup = this.data("displayBackup") || "";
		this.css("display", backup !== "none" ? backup : "");
		return this;
	}
	Element.prototype.insert = function(dom, position = "end", reNew = false) {
		dom = typeof dom === "string" ? $ele(dom) : dom;
		dom = (Array.isArray(dom) || dom instanceof NodeList) ? dom : [dom];
		switch (position) {
			case "start":
				Array.from(dom).reverse().forEach((e, i) => {
					this.insertBefore(e, this.firstChild);
				})
				break;
			case "end":
				dom.forEach((e, i) => {
					this.append(e);
				})
				break;
			case "before":
				Array.from(dom).reverse().forEach((e, i) => {
					this.parentElement.insertBefore(e, this);
				})
				break;
			case "after":
				if (this.parentElement.lastChild === this) {
					dom.forEach((e, i) => {
						this.append(e);
					})
				} else {
					let next = this.nextSilbing;
					Array.from(dom).reverse().forEach((e, i) => {
						this.parentElement.insertBefore(e, next);
					})
				}
				break;
		}
		if (reNew) {
			return dom.length > 1 ? dom : dom[0]
		} else {
			return this
		}
	}
	Element.prototype.replace = function(dom) {
		dom = this.insert(dom, "before", true);
		this.remove();
		return dom;
	}
	Element.prototype.findNode = function(nodeName) {
		var nodeArray = [];
		if (!this.firstChild) {
			return null
		}
		this.childNodes.forEach((e, i) => {
			if (new RegExp(`^${nodeName}$`, "i").test(e.nodeName)) {
				nodeArray.push(e);
			} else {
				let temp = e.findNode(nodeName);
				nodeArray = nodeArray.concat(Array.isArray(temp) ? temp : (temp ? [temp] : []));
			}
		})
		return nodeArray.length > 1 ? nodeArray : nodeArray[0]
	}
	Element.prototype.eleText = function(val, remainDom = false) {
		if (typeof val !== "string") {
			return this.innerText
		} else {
			if (remainDom) {
				var textNode = this.findNode("#text");
				if (Array.isArray(textNode)) {
					textNode.forEach((e, i) => {
						if (val === "") {
							e.nodeValue = "";
						} else {
							let textLength = i >= (textNode.length - 1) ? val.length : e.length;
							e.nodeValue = val.slice(0, textLength);
							val = val.slice(textLength);
						}
					})
				}
			} else {
				this.innerText = val;
			}
			return this
		}
	}
	Element.prototype.eleHTML = function(val) {
		if (typeof val !== "string") {
			return this.innerHTML
		} else {
			this.innerHTML = val;
			return this
		}
	}
	Element.prototype.eleVal = function(val) {
		if (typeof val !== "string" && typeof val !== "boolean") {
			return this.value
		} else {
			this.value = val;
			return this
		}
	}
	//NodeList
	NodeList.prototype.attr = function(key, val) {
		this.forEach((e, i) => {
			e.attr(key, val)
		})
		return this
	}
	NodeList.prototype.data = function(key, val) {
		this.forEach((e, i) => {
			e.data(key, val)
		})
		return this
	}
	NodeList.prototype.css = function(key, val) {
		this.forEach((e, i) => {
			e.css(key, val)
		})
		return this
	}
	NodeList.prototype.hide = function() {
		this.forEach((e, i) => {
			e.hide();
		})
		return this
	}
	NodeList.prototype.show = function() {
		this.forEach((e, i) => {
			e.show();
		})
		return this
	}
	NodeList.prototype.findNode = function(nodeName) {
		var nodeArray = []
		this.forEach((e, i) => {
			let temp = e.findNode(nodeName);
			nodeArray = nodeArray.concat(Array.isArray(temp) ? temp : []);
		})
		return nodeArray[0] ? nodeArray : null
	}
	NodeList.prototype.eleText = function(val, remainDom = false) {
		var res = "";
		this.forEach((e, i) => {
			let temp = e.eleText(val, remainDom)
			res += typeof temp === "string" ? temp : "";
		})
		return typeof val === "string" ? this : res
	}
	NodeList.prototype.eleHTML = function(val) {
		var res = "";
		this.forEach((e, i) => {
			let temp = e.eleHTML(val)
			res += typeof temp === "string" ? temp : "";
		})
		return typeof val === "string" ? this : res
	}
}
