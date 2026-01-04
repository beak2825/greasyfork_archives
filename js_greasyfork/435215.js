// ==UserScript==
// ==UserLibrary==
// @name         libCtxtMenu
// @namespace    https://openuserjs.org/users/Anakunda
// @version      1.00.0
// @author       Anakunda
// @license      GPL-3.0-or-later
// @copyright    2021, Anakunda (https://openuserjs.org/users/Anakunda)
// ==/UserScript==
// ==/UserLibrary==

'use strict';

class ContextMenu {
	constructor(id, create = true) {
		if (!id) {
			let dt = new Date().getTime();
			this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				const r = (dt + Math.random() * 16) % 16 | 0;
				dt = Math.floor(dt / 16);
				return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			});
		}
		if (!(this.new = (this.menu = document.body.querySelector(`menu[type="context"][id="${id}"]`)) == null)) return;
		this.menu = document.createElement('MENU');
		this.menu.type = 'context';
		this.menu.id = id;
		if (create) this.create();
	}

	create() {
		if (this.menu.parentNode == null) document.body.append(this.menu);
	}
	destroy() {
		if (this.menu.parentNode != null) this.menu.parentNode.removeChild(this.menu);
	}
	addItem(caption, callback) {
		if (!this.new) return false;
		console.assert(this.menu instanceof HTMLMenuElement);
		const menuItem = document.createElement('MENUITEM');
		if (caption) menuItem.label = caption; else return;
		if (typeof callback == 'function') {
			menuItem.type = 'command';
			menuItem.onclick = evt => {
				console.assert(this.target instanceof HTMLElement);
				return this.target instanceof HTMLElement ? callback(this.target) : false; //callback.call(this.target, this.target)
			};
		}
		this.menu.append(menuItem);
		return true;
	}

	attach(element) {
		if (!(element instanceof HTMLElement)) throw 'Invalid argument';
		console.assert(this.menu instanceof HTMLMenuElement);
		this.create();
		element.setAttribute('contextmenu', this.menu.id);
		element.oncontextmenu = evt => { this.target = evt.currentTarget };
	}
	detach(element) {
		if (!(element instanceof HTMLElement)) throw 'Invalid argument';
		console.assert(this.menu instanceof HTMLMenuElement);
		if (element.getAttribute('contextmenu') != this.menu.id) return;
		element.oncontextmenu = null;
		element.removeAttribute('contextmenu');
	}
}
