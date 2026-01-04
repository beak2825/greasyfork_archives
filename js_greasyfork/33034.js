// ==UserScript==
// @name GM_context
// @version 0.2.1
// @description A html5 contextmenu library
// @supportURL https://github.com/eight04/GM_context/issues
// @license MIT
// @author eight04 <eight04@gmail.com> (https://github.com/eight04)
// @homepageURL https://github.com/eight04/GM_context
// @compatible firefox >=8
// @grant none
// @include *
// ==/UserScript==
var GM_context = (function (exports) {
	'use strict';

	const EDITABLE_INPUT = {text: true, number: true, email: true, search: true, tel: true, url: true};
	const PROP_EXCLUDE = {parent: true, items: true, onclick: true, onchange: true};

	let menus;
	let contextEvent;
	let contextSelection;
	let menuContainer;
	let isInit;
	let increaseNumber = 1;

	function objectAssign(target, ref, exclude = {}) {
		for (const key in ref) {
			if (!exclude[key]) {
				target[key] = ref[key];
			}
		}
		return target;
	}

	function init() {
		isInit = true;
		menus = new Set;
		document.addEventListener("contextmenu", e => {
			contextEvent = e;
			contextSelection = document.getSelection() + "";
			const context = getContext(e);
			const matchedMenus = [...menus]
				.filter(m => 
					(!m.context || m.context.some(c => context.has(c))) &&
					(!m.oncontext || m.oncontext(e) !== false)
				);
			if (!matchedMenus.length) return;
			const {el: container, destroy: destroyContainer} = createContainer(e);
			const removeMenus = [];
			for (const menu of matchedMenus) {
				if (!menu.isBuilt) {
					buildMenu(menu);
				}
				if (!menu.static) {
					updateLabel(menu.items);
				}
				removeMenus.push(appendMenu(container, menu));
			}
			setTimeout(() => {
				for (const removeMenu of removeMenus) {
					removeMenu();
				}
				destroyContainer();
			});
		});
	}

	function inc() {
		return increaseNumber++;
	}

	// check if there are dynamic label
	function checkStatic(menu) {
		return checkItems(menu.items);
		
		function checkItems(items) {
			for (const item of items) {
				if (item.label && item.label.includes("%s")) {
					return false;
				}
				if (item.items && checkItems(item.items)) {
					return false;
				}
			}
			return true;
		}
	}

	function updateLabel(items) {
		for (const item of items) {
			if (item.label && item.el) {
				item.el.label = buildLabel(item.label);
			}
			if (item.items) {
				updateLabel(item.items);
			}
		}
	}

	function createContainer(e) {
		let el = e.target;
		while (!el.contextMenu) {
			if (el == document.documentElement) {
				if (!menuContainer) {
					menuContainer = document.createElement("menu");
					menuContainer.type = "context";
					menuContainer.id = "gm-context-menu";
					document.body.appendChild(menuContainer);
				}
				el.setAttribute("contextmenu", menuContainer.id);
				break;
			}
			el = el.parentNode;
		}
		return {
			el: el.contextMenu,
			destroy() {
				if (el.contextMenu == menuContainer) {
					el.removeAttribute("contextmenu");
				}
			}
		};
	}

	function getContext(e) {
		const el = e.target;
		const context = new Set;
		if (el.nodeName == "IMG") {
			context.add("image");
		}
		if (el.closest("a")) {
			context.add("link");
		}
		if (el.isContentEditable ||
			el.nodeName == "INPUT" && EDITABLE_INPUT[el.type] ||
			el.nodeName == "TEXTAREA"
		) {
			context.add("editable");
		}
		if (!document.getSelection().isCollapsed) {
			context.add("selection");
		}
		if (!context.size) {
			context.add("page");
		}
		return context;
	}

	function buildMenu(menu) {
		const el = buildItems(null, menu.items);
		menu.startEl = document.createComment(`<menu ${menu.id}>`);
		el.insertBefore(menu.startEl, el.childNodes[0]);
		menu.endEl = document.createComment("</menu>");
		el.appendChild(menu.endEl);
		if (menu.static == null) {
			menu.static = checkStatic(menu);
		}
		menu.frag = el;
		menu.isBuilt = true;
	}

	function buildLabel(s) {
		return s.replace(/%s/g, contextSelection);
	}

	// build item's element
	function buildItem(parent, item) {
		let el;
		item.parent = parent;
		if (item.type == "submenu") {
			el = document.createElement("menu");
			objectAssign(el, item, PROP_EXCLUDE);
			el.appendChild(buildItems(item, item.items));
		} else if (item.type == "separator") {
			el = document.createElement("hr");
		} else if (item.type == "checkbox") {
			el = document.createElement("menuitem");
			objectAssign(el, item, PROP_EXCLUDE);
		} else if (item.type == "radiogroup") {
			el = document.createDocumentFragment();
			item.id = `gm-context-radio-${inc()}`;
			item.startEl = document.createComment(`<radiogroup ${item.id}>`);
			el.appendChild(item.startEl);
			el.appendChild(buildItems(item, item.items));
			item.endEl = document.createComment("</radiogroup>");
			el.appendChild(item.endEl);
		} else if (parent && parent.type == "radiogroup") {
			el = document.createElement("menuitem");
			item.type = "radio";
			item.radiogroup = parent.id;
			objectAssign(el, item, PROP_EXCLUDE);
		} else {
			el = document.createElement("menuitem");
			objectAssign(el, item, PROP_EXCLUDE);
		}
		if (item.type !== "radiogroup") {
			item.el = el;
			buildHandler(item);
		}
		item.isBuilt = true;
		return el;
	}

	function buildHandler(item) {
		if (item.type === "radiogroup") {
			if (item.onchange) {
				item.items.forEach(buildHandler);
			}
		} else if (item.type === "radio") {
			if (!item.el.onclick && (item.parent.onchange || item.onclick)) {
				item.el.onclick = () => {
					if (item.onclick) {
						item.onclick.call(item.el, contextEvent);
					}
					if (item.parent.onchange) {
						item.parent.onchange.call(item.el, contextEvent, item.value);
					}
				};
			}
		} else if (item.type === "checkbox") {
			if (!item.el.onclick && item.onclick) {
				item.el.onclick = () => {
					if (item.onclick) {
						item.onclick.call(item.el, contextEvent, item.el.checked);
					}
				};
			}
		} else {
			if (!item.el.onclick && item.onclick) {
				item.el.onclick = () => {
					if (item.onclick) {
						item.onclick.call(item.el, contextEvent);
					}
				};
			}
		}
	}

	// build items' element
	function buildItems(parent, items) {
		const root = document.createDocumentFragment();
		for (const item of items) {
			root.appendChild(buildItem(parent, item));
		}
		return root;
	}

	// attach menu to DOM
	function appendMenu(container, menu) {
		container.appendChild(menu.frag);
		return () => {
			const range = document.createRange();
			range.setStartBefore(menu.startEl);
			range.setEndAfter(menu.endEl);
			menu.frag = range.extractContents();
		};
	}

	// add a menu
	function add(menu) {
		if (!isInit) {
			init();
		}
		menu.id = inc();
		menus.add(menu);
	}

	// remove a menu
	function remove(menu) {
		menus.delete(menu);
	}

	// update item's properties. If @changes includes an `items` key, it would replace item's children.
	function update(item, changes) {
		if (changes.type) {
			throw new Error("item type is not changable");
		}
		if (changes.items) {
			if (item.isBuilt) {
				item.items.forEach(removeElement);
			}
			item.items.length = 0;
			changes.items.forEach(i => addItem(item, i));
			delete changes.items;
		}
		Object.assign(item, changes);
		if (item.el) {
			buildHandler(item);
			objectAssign(item.el, changes, PROP_EXCLUDE);
		}
	}

	// add an item to parent
	function addItem(parent, item, pos = parent.items.length) {
		if (parent.isBuilt) {
			const el = buildItem(parent, item);
			if (parent.el) {
				parent.el.insertBefore(el, parent.el.childNodes[pos]);
			} else {
				// search from end, so it would be faster to insert multiple item to end
				let ref = parent.endEl,
					i = pos < 0 ? -pos : parent.items.length - pos;
				while (i-- && ref) {
					ref = ref.previousSibling;
				}
				parent.startEl.parentNode.insertBefore(el, ref);
			}
		}
		parent.items.splice(pos, 0, item);
	}

	// remove an item from parent
	function removeItem(parent, item) {
		const pos = parent.items.indexOf(item);
		parent.items.splice(pos, 1);
		if (item.isBuilt) {
			removeElement(item);
		}
	}

	// remove item's element
	function removeElement(item) {
		if (item.el) {
			item.el.remove();
		} else {
			while (item.startEl.nextSibling != item.endEl) {
				item.startEl.nextSibling.remove();
			}
			item.startEl.remove();
			item.endEl.remove();
		}
	}

	exports.add = add;
	exports.addItem = addItem;
	exports.buildMenu = buildMenu;
	exports.remove = remove;
	exports.removeItem = removeItem;
	exports.update = update;

	return exports;

}({}));
