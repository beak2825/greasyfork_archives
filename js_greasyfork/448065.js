/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               薰匪烤师
// @name:zh-CN         薰匪烤师
// @name:en            Fuck Ifly Freedom(FIF).js
// @namespace          Fuck-Ifly-Freedom
// @version            0.3
// @description        讯飞考试，既然都网页端了那还监考个鬼啊…
// @description:zh-CN  讯飞考试，既然都网页端了那还监考个鬼啊…
// @description:en     说实话，我不觉得讯飞考试有外国用户
// @author             PY-DNG
// @license            GPL-license
// @match              http*://assess.fifedu.com/testcenter/examPaper/toExamMain*
// @match              https://assess.fifedu.com/testcenter/login/home
// @icon               https://static.fifedu.com/static/fiftest//images/favicon.ico
// @grant              none
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/448065/%E8%96%B0%E5%8C%AA%E7%83%A4%E5%B8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/448065/%E8%96%B0%E5%8C%AA%E7%83%A4%E5%B8%88.meta.js
// ==/UserScript==

(function() {
	// Fuck Ifly Freedom(FIF).js, By PY-DNG
	// Make sure this code is executed before ifly code

	const Angels = {
		setTimeout: window.setTimeout
	}
	const Evils = [{
			target: window,
			name: "topOnFocus",
			value: function topOnFocus() {}
		},{
			target: window,
			name: "topOnBlur",
			value: function topOnBlur() {}
		},{
			target: window,
			name: "setTimeout",
			value: function setTimeout(func, interval) {
				// Filter all evil functions
				const filters = ['focusFlag', 'collectOralInfo', 'switchPageNum']
				for (const filter of filters) {
					if (func.toString().includes(filter)) {return;}
				}
				// Permit others
				const args = Array.from(arguments)
				return Angels.setTimeout.apply(null, args)
			}
		},{
			target: window,
			name: "focusFlag",
			value: true
		},{
			target: window,
			name: "switchPageNum",
			value: -1
		},{
			target: window,
			name: "switchPageIn",
			value: function switchPageIn() {}
		},{
			target: window,
			name: "isLeavingPage",
			value: false
		},{
			target: document,
			name: 'oncontextmenu',
			value: function() {},
			iframe: true
		},{
			target: document,
			name: 'ondragstart',
			value: function() {},
			iframe: true
		},{
			target: document,
			name: 'onselectstart',
			value: function() {},
			iframe: true
		},{
			target: document,
			name: 'onselect',
			value: function() {},
			iframe: true
		},{
			target: document,
			name: 'oncopy',
			value: function() {},
			iframe: true
		},{
			target: document,
			name: 'onpaste',
			value: function() {},
			iframe: true
		},{
			target: document,
			name: 'onbeforecopy',
			value: function() {},
			iframe: true
		},{
			target: document,
			name: 'ontouchmove',
			value: function() {},
			iframe: true
		},{
			target: document,
			name: 'onkeydown',
			value: function() {},
			iframe: true
		},{
			target: document,
			name: 'onkeyup',
			value: function() {},
			iframe: true
		}
	]
	const ITM = new IntervalTaskManager();

	for (const evil of Evils) {
		const target = evil.target;
		const name = evil.name;
		const value = evil.value;
		const iframe = evil.iframe;
		console.log('hooking ' + name);
		try {
			typeof value !== 'function' && Freeze_FIF_Variable(target, name, value);
			ITM.addTask(function() {target[name] = value;});
			if (iframe) {
				ITM.addTask(function() {
					const targets = [document].concat(Array.from(document.querySelectorAll('iframe')).map((iframe) => (target === document ? iframe.contentDocument : iframe.contentWindow)));
					targets.forEach((t) => {t[name] = value;});
				});
			}
		} catch(e) {
			debugger;
			throw e;
		}
		console.log('hooked', target[name], target[name] === value);
	}

	allowSelect();
	ITM.addTask(allowSelect);

	allowpaste();
	ITM.addTask(allowpaste);


	ITM.start();

	function Freeze_FIF_Variable(target, varname, value) {
		defineProperty(target, varname, {
			value: value,
			writable: false
		});
	}

	function allowSelect() {
		const docs = [document].concat(Array.from(document.querySelectorAll('iframe')).map((iframe) => (iframe.contentDocument)))
		docs.forEach((doc) => (Array.from(doc.querySelectorAll('style')).filter((s) => (s.innerHTML.includes('user-select'))).forEach((s) => (s.parentElement.removeChild(s)))));
	}

	function allowpaste() {
		const docs = [document].concat(Array.from(document.querySelectorAll('iframe')).map((iframe) => (iframe.contentDocument)));
		docs.forEach((doc) => (Array.from(doc.querySelectorAll('textarea')).forEach((t) => {t.onpaste = null;})));

	}

	function IntervalTaskManager() {
		const tasks = this.tasks = [];
		this.time = 500;
		this.interval = -1;
		defineProperty(this, 'working', {
			get: () => (this.interval >= 0)
		});

		this.addTask = function(fn) {
			tasks.push(fn);
		}

		this.removeTask = function(fn_idx) {
			const idx = typeof fn_idx === 'number' ? fn_idx : tasks.indexOf(fn_idx)
			tasks.splice(idx, 1)
		}

		this.clearTasks = function() {
			tasks.splice(0, Infinity)
		}

		this.start = function() {
			if (!this.working) {
				this.interval = setInterval(this.do, this.time);
				return true;
			} else {
				return false;
			}
		}

		this.stop = function() {
			if (this.working) {
				clearInterval(this.interval);
				this.interval = -1;
				return true;
			} else {
				return false;
			}
		}

		this.do = function() {
			for (const task of tasks) {
				task();
			}
		}
	}

	function defineProperty(obj, prop, desc) {
		desc.configurable = false;
		desc.enumerable = true;
		Object.defineProperty(obj, prop, desc);
	}
}) ();