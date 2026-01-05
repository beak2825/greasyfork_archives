// ==UserScript==
// @name         解除限制
// @version      0.1
// @description  解除右键限制
// @include      *
// @namespace https://greasyfork.org/users/27635
// @downloadURL https://update.greasyfork.org/scripts/30233/%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/30233/%E8%A7%A3%E9%99%A4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
function avoiderr() {
	return true
}
onerror = avoiderr;

function handleevent() {
	if (event != null) {
		if (event.stopPropagation) {
			event.stopPropagation()
		} else {
			event.cancelBubble = true;
			event.returnValue = true
		}
		return true
	}
}
function handleobj(o) {
	try {
		o.onselect = handleevent;
		o.oncontextmenu = handleevent;
		o.ondragstart = handleevent;
		o.onselectstart = handleevent;
		o.onbeforecopy = handleevent;
		o.oncopy = handleevent;
		o.onmousedown = handleevent;
		o.onmousemove = handleevent;
		o.onmouseup = handleevent
	} catch (e) {}
}
function handleframes(obj) {
	try {
		var frs = obj.frames;
		if (frs != null) {
			for (var i = 0; i < frs.length; i++) {
				enableRight(frs[i].document)
			}
		} else {
			var fs = obj.getElementsByTagName("frame");
			if (fs != null) {
				for (var j = 0; j < fs.length; j++) {
					enableRight(fs[j].contentDocument)
				}
			}
			var ifs = obj.getElementsByTagName("iframe");
			if (ifs != null) {
				for (var j = 0; j < ifs.length; j++) {
					enableRight(ifs[j].contentDocument)
				}
			}
		}
	} catch (e) {}
}
function handlebody(d) {
	handleobj(d);
	handleobj(d.body)
}
function enableRight(d) {
	handleframes(d);
	handlebody(d)
}
var noMouseRestrict = {
	enableDefault: function(evt) {
		evt.stopPropagation()
	},
	addEvt2: function(obj, type, func) {
		obj.addEventListener(type, this.enableDefault, true)
	},
	apply: function(events, node) {
		var length = events.length;
		for (var i = 0; i < length; i++) {
			this.addEvt2(node, events[i], this.enableDefault)
		}
	},
	init: function(events) {
		this.apply(events, window);
		this.apply(events, document)
	}
};
var noMouseRestrict2 = function() {};
noMouseRestrict2.prototype.enableDefault = function(evt) {
	if (evt.stopPropagation) {
		evt.stopPropagation()
	} else {
		evt.cancelBubble = true;
		evt.returnValue = true
	}
};
noMouseRestrict2.prototype.addEvt = function(obj, type, func) {
	if (obj.addEventListener) {
		obj.addEventListener(type, func, false)
	} else {
		obj.attachEvent('on' + type, func)
	}
};
noMouseRestrict2.prototype.apply = function(events, node) {
	var length = events.length;
	for (var i = 0; i < length; i++) {
		this.addEvt(node, events[i], this.enableDefault)
	}
};
noMouseRestrict2.prototype.init = function(events) {
	this.apply(events, window);
	this.apply(events, document);
	var nodes = document.all,
		n = nodes.length;
	for (var i = 0; i < n; i++) {
		if (nodes[i].nodeType == 1) {
			this.apply(events, nodes[i])
		}
	}
};
if (window.addEventListener) {
	var noRestrict = Object.create(noMouseRestrict);
	noRestrict.init(['contextmenu', 'selectstart', 'select', 'copy', 'beforecopy', 'cut', 'beforecut', 'paste', 'beforepaste', 'dragstart', 'dragend', 'drag', 'mousedown', 'mouseup', 'mousemove']);
	((function() {
		var elem = document.createElement('style');
		elem.innerHTML = '* {-webkit-user-drag: auto !important; -webkit-user-select: text !important;' + '-moz-user-drag: auto !important; -moz-user-select: text !important;' + '-khtml-user-drag: auto !important; -khtml-user-select: text !important;' + 'user-drag: auto !important; user-select: text !important;}';
		document.head.appendChild(elem)
	})())
} else {
	var noRestrict = new noMouseRestrict2();
	noRestrict.init(['contextmenu', 'selectstart', 'select', 'copy', 'beforecopy', 'cut', 'beforecut', 'paste', 'beforepaste', 'dragstart', 'dragend', 'drag', 'mousedown', 'mouseup', 'mousemove'])
}
enableRight(document);