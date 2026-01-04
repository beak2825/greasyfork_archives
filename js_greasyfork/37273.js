// ==UserScript==
// @name        Underdollar jQuery replacement
// @namespace   https://greasyfork.org
// @include     https://sellers.shopgoodwill.com/*
// @version     1.1
// @description Replaces jQuery, which causes lots of conflicts, with a framework that is largely cross-compatible
// @grant       none
// ==/UserScript==

console.log('ostrich');

class underdollar {
    constructor(selector) {
		this.is_$ = true;
		var singleNode = (function () {
			// make an empty node list to inherit from
			var nodelist = document.createDocumentFragment().childNodes;
			// return a function to create object formed as desired
			return function (node) {
				return Object.create(nodelist, {
					'0': {value: node, enumerable: true},
					'length': {value: 1},
					'item': {
						"value": function (i) {
							return this[+i || 0];
						},
						enumerable: true
					}
				}); // return an object pretending to be a NodeList
			};
		}());

		if (arguments.length < 1 || typeof selector == 'undefined') {
			this.nodeList = 'empty';
		} else {
			if (selector instanceof Element) {
				this.nodeList = singleNode(selector);
			} else if (selector instanceof NodeList || selector instanceof HTMLCollection) {
				this.nodeList = selector;
			} else if (selector instanceof Array) {
				selector.forEach(function(el) {
					if (el instanceof Element) {
						el.classList.add('udTempClassSelector');
					}
				});
				this.nodeList = _$('.udTempClassSelector').nodeList;
				Array.prototype.forEach.call(_$('.udTempClassSelector').nodeList, function(el) {
					el.classList.remove('udTempClassSelector');
				});
			} else {
				this.nodeList = document.querySelectorAll(selector);
			}
			this.selector = selector;
		}
		Array.prototype.forEach.call(document.querySelectorAll('.udTempClassSelector'), function(el) {
			el.classList.remove('.udTempClassSelector');
		});

		this.length = this.nodeList.length;
		
		var nodeArray = [];
		for (var i=0; i<this.length; i++) {
			this[i] = this.nodeList[i];
		}
	}

// selection functions

	parent() {
		if (this.nodeList instanceof NodeList) {
			var myParent = this.nodeList[0].parentNode;
			return _$(myParent);
		}
	}

	children() {
		return _$(this.nodeList[0].children);
	}

	first() {
		if (this.nodeList instanceof NodeList) {
			return _$(this.nodeList[0]);
		} else {
			return _$(this.selector);
		}
	}

	last() {
		if (this.nodeList instanceof NodeList) {
			var length = this.nodeList.length;
			this.nodeList[length-1].classList.add('udLastTempClass');
			var returnThis = _$('.udLastTempClass');
			_$('.udLastTempClass').removeClass('.udLastTempClass');
			return returnThis;
		} else {
			return _$(this.selector);
		}
	}

	nth(pos) { // Takes 1-indexed values
		pos -= 1;
		return _$(this[pos]);
	}
	
	index(pos) { // Takes 0-indexed values
		return _$(this[pos]);
	}
	
	next() {
		return _$(this[this.length-1].nextElementSibling);
	}
	
	contents() {
//		var frame = document.getElementById('myframe');
//		var c = frame.contentDocument || frame.contentWindow.document;
		return this.nodeList[0].contentDocument || this.nodeList[0].contentWindow.document;
	}



// display functions

	css(arg1, arg2){
		var me = this;
		if (typeof arg1 == 'string' && typeof arg2 == 'string') {
			Array.prototype.forEach.call(this.nodeList, function(el){
				el.style[arg1] = arg2;
			});
		} else if (arg1 instanceof Object) {
			Array.prototype.forEach.call(this.nodeList, function(el) {
				_$().each(arg1, function(styleName, styleValue) {
					el.style[styleName] = styleValue;
				});
			});
		}

		return _$(this.selector);
	}

	hide() {
		this.css('display', 'none');
		return _$(this.selector);
	}

	show() {
		this.css('display', '');
		return _$(this.selector);
	}

	toggle() {
		if (this.nodeList instanceof NodeList) {
			this.each(function(el){
				if (el.style.display == 'none') {
					el.style.display = '';
				} else {
					el.style.display = 'none';
				}
			});
		}
		return _$(this.selector);
	}

// DOM functions

	before(htmlString) {
		this.each(function(el){
			el.insertAdjacentHTML('beforebegin', htmlString);
		});
		return _$(this.selector);
	}

	after(htmlString) {
		this.each(function(el){
			el.insertAdjacentHTML('afterend', htmlString);
		});
		return _$(this.selector);
	}

	append(something) {
		if (something instanceof Element) {
			this.each(function(el) {
				// how to function with appending one existing thing when there are multiple things to append to??
				el.appendChild(something);

			});
		} else if (something instanceof NodeList) {
			Array.prototype.forEach.call(something, function(el) {
				this.append(something);
			});
		} else if (typeof something == 'string') {
			this.each(function(el) {
				var newEl = document.createElement('text');
				newEl.innerHTML = something;
				el.appendChild(newEl)
			});
		} else if (something.hasOwnProperty('is_$')) {
			if (something.nodeList.length == 1) {
				this.each(function(el) {
					// how to function with appending one existing thing when there are multiple things to append to??
					el.appendChild(something.nodeList[0]);
				});
			} else if (something.nodeList.length > 1) {
				this.each(function(el) {
					// how to function with appending one existing thing when there are multiple things to append to??
					//el.appendChild(something.nodeList[0]);
					Array.prototype.forEach.call(something.nodeList, function(myNode, nodeIndex) {
						el.appendChild(myNode);
					});
				});
			}
		}
		return _$(this.selector);
	}

	prepend(something) {
		if (something instanceof Element) {
			this.each(function(el) {
				// how to function with appending one existing thing when there are multiple things to append to??
				el.insertBefore(something, el.firstChild);

			});
		} else if (something instanceof NodeList) {
			Array.prototype.forEach.call(something, function(el) {
				this.append(something, el.firstChild);
			});
		} else if (typeof something == 'string') {
			this.each(function(el) {
				var newEl = document.createElement('text');
				newEl.innerHTML = something;
				el.insertBefore(newEl, el.firstChild)
			});
		} else if (something.hasOwnProperty('is_$')) {
			if (something.nodeList.length == 1) {
				this.each(function(el) {
					// how to function with appending one existing thing when there are multiple things to append to??
					el.insertBefore(something.nodeList[0], el.firstChild);
				});
			} else if (something.nodeList.length > 1) {
				this.each(function(el) {
					// how to function with appending one existing thing when there are multiple things to append to??
					Array.prototype.forEach.call(something.nodeList, function(myNode, nodeIndex) {
						el.insertBefore(myNode, el.firstChild);
					});
				});
			}
		}
		return _$(this.selector);
	}

	remove() {
		this.each(function(el) {
			el.parentNode.removeChild(el);
		});
	}

	wrap(htmlString) {
		this.after(htmlString);
		var newEl = this.next();
		newEl.prepend(this);
	}
	
	wrapInner(htmlString) {
		this.after(htmlString);
		var newEl = this.next();
		console.dir(this.children());
		Array.prototype.forEach.call(this.children(), function(el) {
			newEl.prepend(el);
		});
		this.prepend(newEl);
		//this.children().wrap(htmlString);
	}
	
// other element property/content functions

	attr(arg1, arg2) {
		if (arguments.length < 2) {
			return this.nodeList[0].getAttribute(arg1);
		} else {
			this.each(function(el) {
				el.setAttribute(arg1, arg2);
			});
			return _$(this.selector);
		}
	}

	text(textString) {
		if (arguments.length < 1) {
			var myVal = '';
			this.each(function(el){
				myVal += el.textContent;
			});
			return myVal;
		} else {
			this.each(function(el){
				el.textContent = textString;
			});
			return _$(this.selector);
		}
	}

	html(arg1) {
		if (arguments.length < 1) {
			var myVal = '';
			this.each(function(el){
				myVal += el.innerHTML;
			});
			return myVal;
		} else {
			this.each(function(el){
				el.innerHTML = arg1;
			});
			return _$(this.selector);
		}
	}

	val(arg1) {
		if (arguments.length < 1) {
			if (this.length > 1) {
				var myVals = [];
				this.each(function(el){
					myVals.push(el.value)
				});
				return myVals;
			} else if (this.length == 1) {
				return this.nodeList[0].value;
			}
		} else {
			this.each(function(el){
				el.value = arg1;
			});
			return _$(this.selector);
		}
	}

	isVisible() {
		if (this.length == 1) {
			return this.nodeList[0].offsetWidth !== 0 && this.nodeList[0].offsetHeight !== 0;
		} else if (this.length == 1) {
			var numVisible = 0;
			this.each(function(el){
				if (!(el.offsetWidth !== 0) || !(el.offsetHeight !== 0)) {
					numVisible++;
				}
			});
			return numVisible;
		}
	}

// class functions

	addClass(classNames) {
		var classNameList = classNames.split(/[ ,]/gim);
		this.each(function(el) {
			_$().each(classNameList, function(index, val) {
				if (val.length > 0) {
					el.classList.add(val);
				}
			});
		});
	}
	
	removeClass(classNames) {
		var classNameList = classNames.split(/[ ,]/gim);
		this.each(function(el) {
			_$().each(classNameList, function(index, val) {
				if (val.length > 0) {
					el.classList.remove(val);
				}
			});
		});
	}
	
	toggleClass(classNames) {
		var classNameList = classNames.split(/[ ,]/gim);
		this.each(function(el) {
			_$().each(classNameList, function(index, val) {
				if (val.length > 0) {
					el.classList.toggle(val);
				}
			});
		});
	}
	
	replaceClass(oldClass, newClass) {
		this.each(function(el) {
			el.classList.replace(oldClass, newClass);
		});
	}

// event functions

	bind(eventName, fn) {
		Array.prototype.forEach.call(this.nodeList, function(el) {
			el.addEventListener(eventName, fn);
		});

	}
	
	trigger(eventName) {
		var event = document.createEvent('HTMLEvents');
		event.initEvent(eventName, true, false);
		this.each(function(el){
			el.dispatchEvent(event);
		});
	}

// json functions

	getJSON(url, placeholder, fn) {
		var Httpreq = new XMLHttpRequest(); // a new request
		Httpreq.open("GET",url,false);
		Httpreq.send(null);
		var data = JSON.parse(Httpreq.responseText);
		if (arguments.length > 2) {
			fn(data);
		}
		return data;
	}
	
// utility functions

	filter(fn) {
		this.each(function(el){
			if (fn(el)) {
				el.classList.add('udFilterTempClass');
			}
		});
		var returnThis = _$('.udFilterTempClass');
		_$('.udFilterTempClass').each(function(el) {
			el.classList.remove('udFilterTempClass');
		});
		
		
//		var returnThis = Array.prototype.filter.call(this.nodeList, fn);
//		console.dir(returnThis);
		return returnThis;
	}

	each(arg1, arg2){
		if (arg1 instanceof Object && arg2 instanceof Function) {
				for (var p in arg1) {
					if (arg1.hasOwnProperty(p)) {
						arg2(p, arg1[p]);
					}
			}
		} else if (arg1 instanceof Array && arg2 instanceof Function) {
			Array.prototype.forEach.call(arg1, arg2);
		} else if (this.nodeList instanceof Array || this.nodeList instanceof NodeList) {
			Array.prototype.forEach.call(this.nodeList, arg1);
		}

		return _$(this.selector);
	}

	iterateOverObject(obj, fn) {
		if (obj instanceof Object) {
			for (var p in obj) {
				if (obj.hasOwnProperty(p)) {
					fn(p, obj[p]);
				}
			}
		}

		return _$(this.selector);
	}

}

function _$(selector) {
	return new underdollar(selector);
}