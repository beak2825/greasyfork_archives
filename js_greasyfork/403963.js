// ==UserScript==
// @name CF-Html-Viewer
// @version 0.3.2
// @description View html immediately
// @author Iverycool
// @namespace Cyberforum
// @match https://www.cyberforum.ru/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/403963/CF-Html-Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/403963/CF-Html-Viewer.meta.js
// ==/UserScript==
(function() {

const $ = (sec, node = document) => node.querySelector(sec);
const $$ = (sec, node = document) => node.querySelectorAll(sec);
const size = 1.4;
// const isFF = ~navigator.userAgent.search(/firefox/i);

const styles = {
	but: 'color: rgb(96, 96, 96); font-weight: normal; margin-left: 5px;',
	rightBut: 'color: rgb(96, 96, 96); font-weight: normal; float: right;',
	frame: 'display: block; width: 100%;',
	textarea: getStyleString({
		'position': 'absolute',
	    'margin': 0,
	    'padding': 0,
	    'border': 'transparent',
	    'background': 'transparent',
	    'color': 'transparent', 
	    'font-family': 'Consolas,Monaco,\'Andale Mono\',\'Ubuntu Mono\',monospace',
	    'font-size': '1em',
	    'line-height': size + ' !important',
	    'white-space': 'pre',
	    'caret-color': 'black',
	    'outline': 'none',
	    'resize': 'none'
	})
}
const sels = {
	codeFrame: 'div.codeframe',
	codePre: 'td.de1 > pre.de1',
	lnPre: 'td.ln > pre.de1'
}

document.addEventListener('DOMContentLoaded', () => {
	// debugger;
	init().then(() => $$('#posts div[id^="post_message_"]').forEach(register));
});


function init() {
	const prismStyle = createElem('link', document.head);
	prismStyle.rel = 'stylesheet';
	prismStyle.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/themes/prism.min.css';

	const myStyle = createElem('style', document.head);
	myStyle.innerHTML = 'pre.de1, pre.de1 * { line-height: ' + size + ' !important }' +
		['html5', 'phphtml', 'css', 'javascript'].map(name =>
			`table.${name} > tbody {background: #f5f2f0 !important}`
		).join('');

	const prismScript = createElem('script', document.head);
	prismScript.type = 'text/javascript';
	prismScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/prism.min.js';
	return new Promise(res => prismScript.onload = res);
}


function register(post) {
	const viewer = new Viewer();
	const htmlNodes = $$('table.html5, table.phphtml', post);
	const cssNodes = $$('table.css', post);
	const jsNodes = $$('table.javascript', post);

	htmlNodes.forEach(htmlNode => {
		makeViewerLink(viewer, htmlNode);
		makeEditableLink(viewer, htmlNode, 'html');
		stylize(htmlNode, 'html');
	});

	cssNodes.forEach(cssNode => {
		makeUseLink(viewer, cssNode, 'style');
		makeEditableLink(viewer, cssNode, 'css');
		stylize(cssNode, 'css');
	});

	jsNodes.forEach(jsNode => {
		createLink({
			parentNode: $('.head', jsNode),
			style: styles.but,
			text: 'Выполнить',
			onClick: () => eval($(sels.codePre, jsNode).innerText)
		});

		makeUseLink(viewer, jsNode, 'script');
		makeEditableLink(viewer, jsNode, 'js');
		stylize(jsNode, 'js');
	});
}


class Viewer {
	style = [];
	script = [];
	mounted = false;

	create(parent, htmlCode, onClose = () => {}) {
		this.clean();
		this.mounted = true;

		this.html = htmlCode.replace(/ /g, '');
		this.container = createElem('tfoot', parent);
		createLink({
			parentNode: this.container,
			style: styles.but,
			text: 'Открыть в новом окне',
			onClick: () => this.openInNewWin()
		});

		createLink({
			parentNode: this.container,
			style: styles.but,
			text: 'Скачать страницу',
			onClick: () => this.download()
		})

		createLink({
			parentNode: this.container,
			style: styles.rightBut,
			text: 'Закрыть',
			onClick: () => (this.clean(), onClose())
		});

		this.iframe = createElem('iframe', this.container);
		this.iframe.style = styles.frame;
		this.update();
	}

	clean() {
		if (this.container) this.container.remove();
		this.iframe = null;
		this.doc = null;
		this.html = '';
		this.mounted = false;
	}

	add(id, code, type) {
		if (!this.mounted) return false;
		const ind = this[type].findIndex(el => el[0] == id);
		if (~ind) {
			this[type].splice(ind, 1, [id, code.replace(/ /g, '')])
		} else {
			this[type].push([id, code.replace(/ /g, '')]);
		}		
		return this.update();
	}

	has(id, type) {
		return !!(~this[type].findIndex(el => el[0] == id));
	}

	remove(id, type) {
		const ind = this[type].findIndex(el => el[0] == id);
		const res = (~ind) ? !!this[type].splice(ind, 1) : false;
		this.update();
		return res;
	}

	update(code) {
		if (!this.mounted) return;
		if (code) this.html = code;
		const str = this._compile();

		this.iframe.src = 'about:blank';
		return new Promise(res => {
			this.iframe.onload = () => {
				this.doc = this.iframe.contentWindow.document;
				this.doc.write(str);
				this.doc.close();
				this.updateFrameHeight();
				res();
			}
		});
	}

	updateFrameHeight() {
		const coords = getCoords(this.doc.body.lastElementChild, this.iframe.contentWindow);
		const contentHeight = coords.top + coords.height;
		const frameHeight = (contentHeight > 500) ? '500px' : contentHeight + 16 + 'px';
		this.iframe.style.height = frameHeight;
	}

	openInNewWin() {
		const str = this._compile();
		const win = window.open('about:blank');
		win.onload = () => {
			win.document.write(str);
			win.document.close();
		}
	}

	download() {
		const str = this._compile();
		const id = this.container.parentElement.querySelector(sels.codeFrame).id;
		const a = createElem('a');
		a.download = `doc-${id}.html`;
		a.href = 'data:text/html;charset=UTF-8,' + str;
		a.click();
		a.remove();
	}

	_compile() {
		const wrap = (arr, type) => 
			arr.map(([,code]) => `<${type}>${code}</${type}>`).join('');
		return wrap(this.style, 'style') + wrap(this.script, 'script') + this.html;
	}
}

function stylize(node, type) {
	const pre = $(sels.codePre, node);
	const code = Prism.highlight(pre.innerText, Prism.languages[type]);
	pre.classList.add(`language-${type}`);
	pre.innerHTML = `<code class="language-${type}">${code}</code>`;
	updateCodeFrameHeight($(sels.codeFrame, node));
}

function updateCodeFrameHeight(div) {
	let conHeight = getCoords(div.firstChild).height;
	if (conHeight < 25) conHeight = div.style.height;
	div.style.height = ((conHeight > 570) ? 590 : conHeight + 20) + 'px';
}

function makeViewerLink(viewer, htmlNode) {
	const makeObj = {
		text: 'Показать viewer',
		onClick: function() {
			viewer.create(htmlNode, $(sels.codePre, htmlNode).innerText, () => {
				this.update(makeObj);
			});
			this.update(unMakeObj);
		}
	}

	const unMakeObj = {
		text: 'Обновить viewer',
		onClick: () => viewer.update($(sels.codePre, htmlNode).innerText)
	}

	createLink({
		parentNode: $('.head', htmlNode),
		style: styles.but,
		...makeObj
	});
}

function makeUseLink(viewer, codeNode, type) {
	const id = $(sels.codeFrame, codeNode).id;

	const useObj = {
		text: 'Использовать в viewer',
		onClick: function() {
			if (viewer.add(id, $(sels.codePre, codeNode).innerText, type)) {
				this.update(unUseObj);
			}
		}
	}

	const unUseObj = {
		text: 'Отвязать от viewer',
		onClick: function() {
			viewer.remove(id, type);
			this.update(useObj);
		}
	}

	createLink({
		parentNode: $('.head', codeNode),
		style: styles.but,
		...useObj
	});	
}

function makeEditableLink(viewer, node, type) {
	const id = $(sels.codeFrame, node).id;
	let textarea, autoReloadingLink;
	const makeObj = {
		text: 'Редактировать',
		onClick: function() {
			textarea = makeInput($(sels.codePre, node), type);
			this.update(unMakeObj);
			autoReloadingLink = makeAutoReloadingLink();
		}
	}
	const unMakeObj = {
		text: 'Отменить редактирование',
		onClick: function() {
			textarea.remove();
			autoReloadingLink.remove();
			this.update(makeObj);
		}
	}

	createLink({
		parentNode: $('.head', node),
		style: styles.but,
		...makeObj
	});

	function makeAutoReloadingLink() {
		const makeObj = {
			style: styles.but + 'color: rgb(130, 130, 130);',
			text: 'AutoReloading - off',
			onClick: function() {
				textarea.onInput = function(text) {
					if (type === 'html') {
						return viewer.update(text);
					} else {
						return viewer.add(id, text, type === 'js' ? 'script' : 'style');
					}
				}
				this.update(unMakeObj);
			}
		};
		const unMakeObj = {
			style: styles.but + 'color: green',
			text: 'AutoReloading - on',
			onClick: function() {
				textarea.onInput = null;
				this.update(makeObj);
			}
		};

		return createLink({
			parentNode: $('.head', node),
			...makeObj
		});
	}
}

function makeInput(pre, type, onInput = () => {}) {
	const div = pre.closest(sels.codeFrame);
	const lnPre = div.querySelector(sels.lnPre);
	const textarea = createElem('textarea', pre.parentElement);
	const divScroll = {
		left: div.scrollLeft,
		top: div.scrollTop
	}
	div.scrollTo(0, 0);

	const preCoords = getCoords(pre);
	const divCoords = getCoords(div);
	const paddingLeft = preCoords.left - divCoords.left;
	const paddingTop = preCoords.top - divCoords.top;

	textarea.style = styles.textarea + getStyleString({
		'padding-left': paddingLeft + 'px',
		'padding-top': paddingTop + 'px'
	});
	updateTextarea();
	textarea.spellcheck = false;

	textarea.value = pre.innerText;
	textarea.scrollTo(divScroll.left, divScroll.top);
	div.scrollTo(divScroll.left, divScroll.top);

	textarea.oninput = async () => {
		const text = textarea.value;
		const textLen = text.split('\n').length;
		const code = Prism.highlight(text, Prism.languages[type]);
		pre.innerHTML = `<code class="language-${type}">${code}</code>`;
		lnPre.innerText = new Array(textLen).fill(1).map((_, i) => i + 1).join('\n');

		await (textarea.onInput || onInput)(text);
		updateCodeFrameHeight(div);
		updateTextarea();
	}
	textarea.onscroll = () => div.scrollTo(textarea.scrollLeft, textarea.scrollTop);

	function updateTextarea() {
		const tStyle = textarea.style;
		const divCoords = getCoords(div);

		tStyle.width = divCoords.width - paddingLeft + 'px';
		tStyle.height = divCoords.height - paddingTop + 'px';
		tStyle.left = divCoords.left + 'px';
		tStyle.top = divCoords.top + 'px';
	}

	return textarea;
}

// Utils
function createElem(name, parentNode = document.documentElement) {
	const elem = document.createElement(name);
	parentNode.appendChild(elem);
	return elem;
}

function createLink({parentNode = document.documentElement, style, text, onClick = () => {}}) {
	const a = createElem('a', parentNode);
	a.style = style;
	a.href = '#';
	a.innerText = text;
	a.onclick = function(ev) {
		ev.preventDefault();
		onClick.call(a, ev);
	}

	a.update = function({style: newStyle, text: newText, onClick: newOnClick}) {
		a.style = newStyle || style;
		a.innerText = newText || text;
		a.onclick = function(ev) {
			ev.preventDefault();
			(newOnClick || onClick).call(a, ev);
		}
	}

	return a;
}

function getStyleString(obj) {
	return Object.entries(obj).reduce((str, [key, value]) => str + `${key}:${value};`, '');
}

function getCoords(elem, win = window) {
  const box = elem.getBoundingClientRect();

  return {
    top: box.top + win.pageYOffset,
    left: box.left + win.pageXOffset,
    width: box.width,
    height: box.height
  }
}

})();