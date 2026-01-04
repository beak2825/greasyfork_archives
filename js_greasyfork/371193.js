// ==UserScript==
// @name        HIT Scraper Automator
// @description Automate certain things in HIT Scraper
// @version     0.2.0
// @author      parseHex
// @namespace   https://greasyfork.org/users/8394
// @include     /^https://w(ww|orker).mturk.com/.*hit[-_]?scraper/
// @grant       unsafeWindow
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/371193/HIT%20Scraper%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/371193/HIT%20Scraper%20Automator.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// @ts-ignore
	const HS_API = unsafeWindow.HS_API;

	// stopper kind of extends HS_API by allowing the stop command via localstorage
	let wasOn = false;
	const keyName = 'hit_scraper_disable';
	if (localStorage.getItem(keyName) === 'true') {
	    disable();
	}
	window.addEventListener('storage', function (event) {
	    if (event.key !== keyName)
	        return;
	    if (event.newValue === 'true') {
	        disable();
	    }
	    else if (event.newValue === 'false' && wasOn) {
	        enable();
	    }
	});
	function disable() {
	    wasOn = HS_API.search.isCruising();
	    HS_API.search.stop();
	}
	function enable() {
	    HS_API.search.start();
	    wasOn = false;
	}

	const state = {
	    defaultSettings: {},
	    running: false,
	    timerId: null,
	    cooldown: null,
	    payAdjusterEnabled: false,
	};

	const testRules = [
	    { frequency: 1, settings: { search: 'survey' } },
	    { frequency: 1, settings: { search: 'test' } },
	];
	const rules = [
	    {
	        frequency: 5,
	        settings: { search: 'survey', reward: 0.3 },
	    },
	    {
	        frequency: 2,
	        settings: { search: 'survey', reward: 0.2 },
	    },
	    {
	        frequency: 1,
	        settings: { search: 'survey', reward: 1 },
	    },
	    {
	        frequency: 1,
	        settings: { search: 'qual', reward: 0.01 },
	    },
	];
	var config = {
	    delay: location.hostname === 'localhost' ? 5 : 15,
	    random: location.hostname !== 'localhost',
	    rules: location.hostname === 'localhost' ? testRules : rules,
	};

	class StackRotator {
	    constructor(rules, noRandom) {
	        this.rules = [].concat(rules);
	        this.i = 0;
	        this.stack = [];
	        this.random = !noRandom;
	        this.shuffle();
	    }
	    /**
	     * Reshuffle the current stack. Generally you don't need to call this.
	     *
	     * If random is turned off this will just reset the current `i` position.
	     */
	    shuffle() {
	        // create a stack of ids that each occur `n` times where `n` is their frequency
	        this.stack = [];
	        this.i = 0;
	        for (let i = 0; i < this.rules.length; i++) {
	            for (let k = 0; k < this.rules[i].frequency; k++) {
	                this.stack.push(i);
	            }
	        }
	        if (!this.random)
	            return;
	        var j, x, i;
	        for (i = this.stack.length - 1; i > 0; i--) {
	            j = Math.floor(Math.random() * (i + 1));
	            x = this.stack[i];
	            this.stack[i] = this.stack[j];
	            this.stack[j] = x;
	        }
	    }
	    /**
	     * Get the next Rule.
	     */
	    next() {
	        if (this.i >= this.stack.length) {
	            this.shuffle();
	        }
	        return this.rules[this.stack[this.i++]];
	    }
	}

	const rotator = new StackRotator(config.rules, !config.random);
	function onClick() {
	    HS_API.search.stop();
	    state.cooldown = config.delay;
	    rotatorCountdown.text = '';
	    if (rotatorBtn.text === 'Stop Rotator') {
	        restoreSettings();
	        enableSettings();
	        HS_API.settings.enableAutosave();
	        state.running = false;
	        clearInterval(state.timerId);
	        state.timerId = null;
	        rotatorBtn.text = 'Start Rotator';
	    }
	    else {
	        disableSettings();
	        saveSettings();
	        HS_API.settings.disableAutosave();
	        rotator.shuffle();
	        // auto-refresh is handled in this script for now
	        HS_API.settings.set('refresh', 0);
	        state.running = true;
	        state.timerId = window.setInterval(stackLoop, 1000);
	        // setInterval doesn't run right away so call loop once
	        stackLoop(true);
	        rotatorBtn.text = 'Stop Rotator';
	    }
	}
	function stackLoop(force) {
	    if (!state.running)
	        return;
	    state.cooldown = state.cooldown <= 0 ? 0 : state.cooldown - 1;
	    rotatorCountdown.text = state.cooldown.toString();
	    if (state.cooldown > 0 && !force)
	        return;
	    const nextRule = rotator.next();
	    const settings = mergeSettings(nextRule.settings);
	    keysLoop((key) => { HS_API.settings.set(key, settings[key]); });
	    HS_API.search.start();
	    state.cooldown = config.delay;
	}
	function mergeSettings(settings) {
	    return Object.assign({}, state.defaultSettings, settings);
	}
	function disableSettings() {
	    keysLoop((key) => {
	        try {
	            const setting = document.getElementById(key);
	            setting.disabled = true;
	        }
	        catch (e) { }
	    }, ['settings']);
	    /*
	        mainBtn is kind of special here
	        HS_API internally calls .click() on it to start searching
	        the problem is that .click() doesn't work when .disabled = true
	        disable pointerEvents instead which prevents the user clicking the button
	        but still lets .click() get through
	    */
	    const mainBtn = document.getElementById('main');
	    mainBtn.style.pointerEvents = 'none';
	}
	function enableSettings() {
	    keysLoop((key) => {
	        try {
	            const setting = document.getElementById(key);
	            setting.disabled = true;
	        }
	        catch (e) { }
	    }, ['settings']);
	    const mainBtn = document.getElementById('main');
	    mainBtn.style.pointerEvents = 'auto';
	}
	function saveSettings() {
	    keysLoop((key) => { state.defaultSettings[key] = HS_API.settings.get(key); });
	}
	function restoreSettings() {
	    keysLoop((key) => { HS_API.settings.set(key, state.defaultSettings[key]); });
	}
	function keysLoop(callback, extraKeys) {
	    let keys = HS_API.settings.list;
	    if (extraKeys)
	        keys = [].concat(keys, extraKeys);
	    for (let i = 0; i < keys.length; i++) {
	        callback(keys[i]);
	    }
	}

	const pluginSection = HS_API.ui.createSection('block');
	pluginSection.title = 'Automator';
	const rotatorBtn = pluginSection.addButton();
	rotatorBtn.text = 'Start Rotator';
	rotatorBtn.onClick(onClick);
	rotatorBtn.disable(); // pay-adjuster doesnt work with rotator atm
	const rotatorCountdown = pluginSection.addText();
	rotatorCountdown.style.marginLeft = '2px';
	const payAdjusterBtn = pluginSection.addButton();
	payAdjusterBtn.text = 'Enable Pay Adjuster';
	payAdjusterBtn.onClick(onClick$1);

	function clamp(num, min, max) {
	    // https://stackoverflow.com/a/11410079
	    return num <= min ? min : num >= max ? max : num;
	}
	function fixFPE(num) {
	    return +num.toFixed(2);
	}

	const minPay = 0.05;
	const maxPay = 2;
	const adjAmount = 0.05; // $
	const lowerThreshold = 0.2; // 20%
	const lowerStreakThreshold = 2;
	const raiseStreakThreshold = 1;
	/**
	 * lower = not enough HITs (lower pay)
	 *
	 * raise = too many HITs (raise pay)
	 */
	let streakType;
	let streak = 0;
	let curPay;
	let originalPay;
	function onClick$1() {
	    state.payAdjusterEnabled = !state.payAdjusterEnabled;
	    if (state.payAdjusterEnabled) {
	        payAdjusterBtn.text = 'Disable Pay Adjuster';
	    }
	    else {
	        payAdjusterBtn.text = 'Enable Pay Adjuster';
	    }
	    if (!state.payAdjusterEnabled) {
	        // now disabled; revert pay
	        HS_API.settings.set('reward', originalPay);
	    }
	    else {
	        originalPay = +HS_API.settings.get('reward');
	        curPay = originalPay;
	    }
	}
	HS_API.search.listen(function (HITs, eventType) {
	    if (!state.payAdjusterEnabled)
	        return;
	    if (eventType !== 'add')
	        return;
	    const num = HITs.length;
	    updatePay(num);
	    HS_API.settings.set('reward', curPay);
	});
	function updatePay(results) {
	    const maxResults = +HS_API.settings.get('resultsPerPage');
	    const maxLower = maxResults - (maxResults * lowerThreshold);
	    // update streak
	    if (results < maxLower) {
	        changeStreakType('lower');
	        streak++;
	    }
	    else if (results >= maxResults) {
	        changeStreakType('raise');
	        streak++;
	    }
	    else {
	        // reset streak
	        changeStreakType(null);
	    }
	    // change pay according to current streak
	    // NOTE: anytime pay is raised/lowered the streak count should reset
	    // (to allow result counts to maybe stabilize before adjusting again)
	    if (streakType === null) {
	        curPay = curPay;
	    }
	    else if (streakType === 'lower' && streak >= lowerStreakThreshold) {
	        curPay -= adjAmount;
	        streak = 0;
	    }
	    else if (streakType === 'raise' && streak >= raiseStreakThreshold) {
	        curPay += adjAmount;
	        streak = 0;
	    }
	    curPay = clamp(curPay, minPay, maxPay);
	    curPay = fixFPE(curPay);
	}
	function changeStreakType(newStreakType) {
	    if (streakType !== newStreakType) {
	        streakType = newStreakType;
	        streak = 0;
	    }
	}

	// import './rotator';

}());
