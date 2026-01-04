// ==UserScript==
// @name        Repeat Key
// @author      to
// @namespace   https://github.com/to
// @version     0.2
// @match       https://twitter.com/*
// @description jホールドでリピート開始/リピート中にjで加速/他キーで停止
// @icon        https://www.google.com/s2/favicons?domain=twitter.com
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/426820/Repeat%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/426820/Repeat%20Key.meta.js
// ==/UserScript==

(function() {
	const opt = {
		hold: 250,
		interval: 800,
		decrement: 200,
		min: 400,
		key: 'j',
	};
	// keypressイベントではcharCode(小文字)が使われる
	opt.charCode = opt.key.charCodeAt(0);
	opt.keyCode = opt.charCode - 32;

	var repeater = {
		onMouseDown: function name(params) {
			this.state.stop();
		},

		onKeyDown: function (e) {
			if (e.fake)
				return;

			// 対象外のキーか？
			if (e.keyCode != opt.keyCode) {
				this.state.stop();
				return;
			}

			if (e.repeat)
				repeater.cancelEvent(e);

			this.state.onKeyDown(e);
		},

		onKeyPress: function (e) {
			// 対象外のキーか？
			if (e.fake || e.keyCode != opt.charCode)
				return;

			this.state.onKeyPress(e);
		},

		onKeyUp: function (e) {
			// 対象外のキーか？
			if (e.fake || e.keyCode != opt.keyCode)
				return;

			this.state.onKeyUp(e);
		},

		startRepeat: function () {
			// 既存のリピートを停止する
			this.stopRepeat();
			this.timer = setInterval(() => {
				repeater.dispatchEvent();
			}, repeater.interval);
		},

		dispatchEvent: function () {
			document.dispatchEvent(repeater.createEvent('keydown'));
			document.dispatchEvent(repeater.createEvent('keypress'));
			document.dispatchEvent(repeater.createEvent('keyup'));
		},

		createEvent: function (type) {
			let event = new KeyboardEvent(type, {
				keyCode: type == 'keypress' ? opt.charCode : opt.keyCode,
				key: opt.key,
				bubbles: true,
			});

			// 生成したイベントにフラグを付加し、判別に用いる
			event.fake = true;
			return event;
		},

		stopRepeat: function () {
			clearInterval(this.timer);
		},

		cancelEvent: function (event) {
			// 他ハンドラも含めて伝播を完全に停止する
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
		},

		states: {
			normal: {
				onKeyDown: function (e) {
					// ホールド開始時刻を保存する
					repeater.start = Date.now();

					repeater.state = repeater.states.holding;
				},
				onKeyPress: function (e) { },
				onKeyUp: function (e) { },
				stop: function () { },
			},

			holding: {
				onKeyDown: function (e) {
					// ホールド開始から一定時間が経過していないか？
					if (Date.now() < (repeater.start + opt.hold))
						return;

					// リピート開始前にkeyupを発生させ、一連のキー押下を終わらせる
					document.dispatchEvent(repeater.createEvent('keyup'));

					repeater.interval = opt.interval;
					repeater.startRepeat();

					repeater.state = repeater.states.repeating;
				},
				onKeyPress: function e() { },
				onKeyUp: function (e) {
					repeater.state = repeater.states.normal;
				},
				stop: function () { },
			},

			repeating: {
				onKeyDown: function (e) {
					if (e.repeat)
						return;

					repeater.cancelEvent(e);

					// リピート間隔を減らす
					repeater.interval = Math.max(repeater.interval - opt.decrement, opt.min);
					repeater.startRepeat();
				},
				onKeyPress: function (e) {
					repeater.cancelEvent(e);
				},
				onKeyUp: function (e) {
					repeater.cancelEvent(e);
				},
				stop: function () {
					repeater.stopRepeat();

					repeater.state = repeater.states.normal;
				},
			},
		}
	};
	repeater.state = repeater.states.normal;

	document.addEventListener('keydown', repeater.onKeyDown.bind(repeater), true);
	document.addEventListener('keypress', repeater.onKeyPress.bind(repeater), true);
	document.addEventListener('keyup', repeater.onKeyUp.bind(repeater), true);
	document.addEventListener('mousedown', repeater.onMouseDown.bind(repeater), true);
})();