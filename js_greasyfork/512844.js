// ==UserScript==
// @name         Tumblr: Activity# in tab title
// @namespace    http://yal.cc/
// @version      2024-10-16
// @description  Shows notification count instead of or combined with unread post count in Tumblr dashboard tab title
// @author       YellowAfterlife
// @match        https://www.tumblr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @run-at       document-start
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// @license      CC-NC-BY-SA
// @downloadURL https://update.greasyfork.org/scripts/512844/Tumblr%3A%20Activity%20in%20tab%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/512844/Tumblr%3A%20Activity%20in%20tab%20title.meta.js
// ==/UserScript==

(function() {
	'use strict';
	
	// storing the real console.log for later so that we don't send messages to Sentry
	const __console_log = console.log;
	function trace() {
		const args = Array.prototype.slice.call(arguments, 0);
		args.unshift("[yal/activity#]");
		__console_log.apply(console, args);
	}
	
	//
	const MODE_ACTIVITY = "Activity";
	const MODE_COMBINED = "Combined";
	let config = null;
	async function loadConfig() {
		config = {
			mode: await GM.getValue("mode", MODE_ACTIVITY),
		}
	}
	let menuCommands = null;
	async function updateSettingsUI() {
		// remove old menu items:
		if (menuCommands) {
			for (let cmd of menuCommands) await GM.unregisterMenuCommand(cmd);
		}
		
		//
		menuCommands = [];
		const addMenuCommand = async (label, getter, setter) => {
			let cmd = await GM.registerMenuCommand(label + ": " + getter(), async () => {
				await setter(getter());
				updateSettingsUI();
			});
			menuCommands.push(cmd);
		}
		
		//
		await addMenuCommand("Mode", () => {
			return config.mode;
		}, async (val) => {
			config.mode = val != MODE_ACTIVITY ? MODE_ACTIVITY : MODE_COMBINED;
			syncTitle();
			await GM.setValue("mode", config.mode);
		});
	}
	
	// just a little wrapper for a re-bindable MutationObserver
	class Watcher {
		constructor(finder, callback, observerOptions) {
			this.findElement = finder;
			this.callback = callback;
			this.observerCallback = e => {
				this.callback(this.element, e);
			};
			this.observerOptions = observerOptions;
			this.element = null;
			this.observer = null;
		}
		sync() {
			const element = this.findElement();
			if (element != null && element != this.element) {
				if (this.element) {
					trace("target changed from ", this.element, " to ", element);
				}
				if (this.observer) {
					this.observer.disconnect();
				}
				this.element = element;
				this.observer = new MutationObserver(this.callback);
				this.observer.observe(element, this.observerOptions);
				return true;
			}
			return false;
		}
		getNumber() {
			if (this.element == null) return 0;
			let text = this.element.innerHTML.trim();
			if (text == "") return "";
			if (text.includes("+")) return 100;
			let int = parseInt(text);
			if (isNaN(int)) return 0;
			return int;
		}
	}
	let activity, title, home;
	
	//
	const rxTitleNumber = new RegExp("^"
		+ "\\("
			+ "\\d+" // the number
			+ "\\+?" // an optional "+" for "99+"
		+ "\\)"
		+ "\\s*"
		+ "(.+)" // the rest of the title
	);
	function syncTitle() {
		let curr_title = document.title;
		let title = curr_title;
		
		// strip "(#) " prefix from the title:
		let mt = rxTitleNumber.exec(title);
		if (mt) title = mt[1];
		
		// count up the desired notifications:
		let count = 0;
		if (config.mode == MODE_COMBINED) {
			count += home.getNumber();
		}
		count += activity.getNumber();
		
		// prepend in the corrected prefix:
		if (count > 99) {
			title = "(99+) " + title;
		} else if (count > 0) {
			title = "(" + count + ") " + title;
		}
		
		//trace("title:", curr_title, "->", title);
		if (title != curr_title) {
			document.title = title;
		}
	}
	//
	window.addEventListener("load", async () => {
		await loadConfig();
		await updateSettingsUI();
		//
		const findIconCtr = (iconName) => {
			/* look up this kind of thing:
			<div>
				<svg role="presentation">
					<use href="#managed-icon__lightning"/>
				</svg>
				<div role="status">3</div> <- this is what we want
			</div>
			*/
			const icon = document.querySelector(`svg[role="presentation"] use[href="#managed-icon__${iconName}"]`);
			if (!icon) return null;
			const ctr = icon.parentElement.parentElement;
			return ctr.querySelector(`div[role="status"]`);
		}
		home = new Watcher(() => {
			return findIconCtr("home");
		}, syncTitle, { subtree: true, characterData: true });
		activity = new Watcher(() => {
			let status = findIconCtr("lightning");
			//if (!status) trace("no activity icons here..?");
			return status;
		}, syncTitle, { subtree: true, characterData: true });
		title = new Watcher(() => {
			return document.querySelector('title');
		}, syncTitle, { subtree: true, characterData: true, childList: true });
		//
		function syncObservers() {
			let update = false;
			if (home.sync()) update = true;
			if (activity.sync()) update = true;
			if (title.sync()) update = true;
			if (update) syncTitle();
		}
		window.setInterval(syncObservers, 500);
		syncObservers();
		//
		trace("ready!", activity, title);
	});
	trace("hello!");
})();