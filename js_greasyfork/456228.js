// ==UserScript==
// @name         Absolute Visibility
// @namespace    https://naeembolchhi.github.io/
// @version      0.2
// @description  Makes tabs and windows think they're visible even when they're not.
// @author       NaeemBolchhi
// @license      Mozilla Public License 2.0
// @grant        none
// ==/UserScript==

const knife = `const script = document.currentScript;
const isFirefox = /Firefox/.test(navigator.userAgent) || typeof InstallTrigger !== 'undefined';

const block = e => {
	e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();
};

const once = {
	focus: true,
	visibilitychange: true,
	webkitvisibilitychange: true
};

/* visibility */
Object.defineProperty(document, 'visibilityState', {
	get() {
		return 'visible';
	}
});
if (isFirefox === false) {
	Object.defineProperty(document, 'webkitVisibilityState', {
		get() {
			return 'visible';
		}
	});
}
document.addEventListener('visibilitychange', e => {
	script.dispatchEvent(new Event('state'));
	if (script.dataset.visibility !== 'false') {
		if (once.visibilitychange) {
			once.visibilitychange = false;
			return;
		}
		return block(e);
	}
}, true);
document.addEventListener('webkitvisibilitychange', e => {
	if (script.dataset.visibility !== 'false') {
		if (once.webkitvisibilitychange) {
			once.webkitvisibilitychange = false;
			return;
		}
		return block(e);
	}
}, true);


window.addEventListener('pagehide', e => script.dataset.visibility !== 'false' && block(e), true);

/* hidden */
Object.defineProperty(document, 'hidden', {
	get() {
		return false;
	}
});
Object.defineProperty(document, isFirefox ? 'mozHidden' : 'webkitHidden', {
	get() {
		return false;
	}
});

/* focus */
Document.prototype.hasFocus = new Proxy(Document.prototype.hasFocus, {
	apply(target, self, args) {
		if (script.dataset.focus !== 'false') {
			return true;
		}
		return Reflect.apply(target, self, args);
	}
});

const onfocus = e => {
	if (script.dataset.focus !== 'false') {
		if (e.target === document || e.target === window) {
			if (once.focus && document.readyState === 'complete' && e.target === window) {
				once.focus = false;
				return;
			}
			return block(e);
		}
	}
};
// document.addEventListener('focus', onfocus, true);
window.addEventListener('focus', onfocus, true);


/* blur */
const onblur = e => {
	if (script.dataset.blur !== 'false') {
		if (e.target === document || e.target === window) {
			return block(e);
		}
	}
};
document.addEventListener('blur', onblur, true);
window.addEventListener('blur', onblur, true);

/* mouse */
window.addEventListener('mouseleave', e => {
	if (script.dataset.mouseleave !== 'false') {
		if (e.target === document || e.target === window) {
			return block(e);
		}
	}
}, true);

/* requestAnimationFrame */
let lastTime = 0;
window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
	apply(target, self, args) {
		if (script.dataset.hidden === 'true') {
			const currTime = Date.now();
			const timeToCall = Math.max(0, 16 - (currTime - lastTime));
			const id = window.setTimeout(function() {
				args[0](performance.now());
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		} else {
			return Reflect.apply(target, self, args);
		}
	}
});
window.cancelAnimationFrame = new Proxy(window.cancelAnimationFrame, {
	apply(target, self, args) {
		if (script.dataset.hidden === 'true') {
			clearTimeout(args[0]);
		}
		return Reflect.apply(target, self, args);
	}
});`;

(function eyeStabber() {
    let html, script;
    html = document.documentElement;
    if (!html) {window.location.reload();}
    script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.innerHTML = knife;
    html.appendChild(script);
    script.remove();
})();