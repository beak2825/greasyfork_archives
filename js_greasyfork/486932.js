// ==UserScript==
// @name         Grundo's Cafe - Gallery AIO
// @version      1.0.1
// @description  Combines several aspects of gallery management into a more user-friendly interface.
// @author       Skyfia
// @namespace    https://pony.fyi
// @license      MIT
// @run-at       document-start
// @match        https://www.grundos.cafe/gallery/
// @match        https://www.grundos.cafe/gallery/?gallery_id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486932/Grundo%27s%20Cafe%20-%20Gallery%20AIO.user.js
// @updateURL https://update.greasyfork.org/scripts/486932/Grundo%27s%20Cafe%20-%20Gallery%20AIO.meta.js
// ==/UserScript==

(function() {
	'use strict';
	
	const ss = new CSSStyleSheet();
	ss.insertRule("#galleryUpgraded .categories {display: flex; flex-flow: row wrap; align-items: center; justify-content: space-evenly;}");
	ss.insertRule("#galleryUpgraded .categories > * {flex-grow: 1;}");
	ss.insertRule("#galleryUpgraded table {border-collapse: collapse;}");
	ss.insertRule(".item-upgraded .controls {width: 12ch;}");
	ss.insertRule(".item-upgraded .controls > button {width: 100%;}");
	ss.insertRule(".item-upgraded.selected {background-color: #00f3;}");
	ss.insertRule("#galleryUpgraded .item-upgraded button:is(.move-above, .move-below) {display: none;}");
	ss.insertRule("#galleryUpgraded.item-selected .item-upgraded button:is(.move-above, .move-below) {display: block;}");
	ss.insertRule("#galleryUpgraded.item-selected .item-upgraded button:is(.move-up, .move-down) {display: none;}");
	
	document.adoptedStyleSheets.push(ss);
	
	class GalleryMain extends HTMLDivElement {
		init = false;
		delaySelected = false;
		
		constructor() {
			super();
			
			this.load_data();
		}
		
		load_data() {
			const donor_root = document.querySelector("#galleryContent");
			
			{
				// Read header information
				const info_node = donor_root.querySelector("p");
				this.name = info_node.querySelector("strong").textContent;
				const params = new URLSearchParams(info_node.querySelector("a[href^='/gallery/view/']").href.split("?")[1]);
				this.owner = params.get("owner");
				this.gallery_id = params.get("gallery_id");
			}
			
			const main_root = donor_root.querySelector("hr + div.center");
			
			// Read available categories
			const categories = new Map();
			for (const node of main_root.querySelectorAll(`.flex-column > .links-flex > a[href^='/gallery/?gallery_id=${this.gallery_id}&category_id=']`)) {
				const category_name = node.textContent;
				const params = new URLSearchParams(node.href.split("?")[1]);
				const category_id = params.get("category_id");
				if (category_name && category_id) {
					categories.set(category_id, category_name);
				}
			}
			this.categories = categories;
			
			// Read CSRF token
			this.csrfToken = main_root.querySelector("form input[name='csrfmiddlewaretoken']").value;
			
			// Read items
			const items = new Map();
			const item_list = [];
			const cat_cache = new Map();
			let i = 0;
			for (const node of main_root.querySelectorAll("#gallery_items > .gallery_item")) {
				const item = new GalleryItem(this, node, i++);
				items.set(item.item_id, item);
				item_list.push(item);
				cat_cache.set(item.cat_field_name, item);
			}
			this.items = items;
			this.item_list = item_list;
			
			// Read category script
			{
				const cat_script = document.querySelector("#galleryContent + script");
				if (cat_script) {
					const script = cat_script.innerText;
					for (const match of script.matchAll(/\$\('\[name="(category\[[^\]]+\])"\]'\)\.val\(\[([^\]]+)\]\);/g)) {
						const name = match[1];
						const values = match[2].split(", ");
						const item = cat_cache.get(name);
						if (!item) {
							console.debug(`Can't find: ${name}`);
							continue;
						}
						for (const value of values) {
							item.categories.add(value);
						}
					}
				}
				
				// Freeze original categories
				for (const item of this.item_list) {
					item.original_categories = new Set(item.categories);
				}
			}
		}
		
		connectedCallback() {
			if (!this.init) {
				// Initialize UI
				this.init = true;
				this.id = "galleryUpgraded";
				
				{
					const root = document.createElement("p");
					const title_node = document.createElement("strong");
					title_node.textContent = this.name;
					root.append(title_node);
					root.append(document.createElement("br"));
					const guest_node = document.createElement("a");
					guest_node.textContent = "View gallery as guest";
					const params = new URLSearchParams();
					params.set("owner", this.owner);
					params.set("gallery_id", this.gallery_id);
					guest_node.href = `/gallery/view/?${params}`;
					root.append(guest_node)
					this.append(root);
				}
				
				this.append(document.createElement("hr"));
				
				{
					const root = document.createElement("div");
					const category_inputs = new Map();
					this.category_inputs = category_inputs;
					
					const head_container = document.createElement("div");
					head_container.classList.add("categories");
					{
						const row = document.createElement("tr");
						const input = document.createElement("input");
						input.id = `cat_all`;
						input.type = "checkbox";
						input.checked = true;
						input.addEventListener("change", (evt) => {
							if (input.checked) {
								// Uncheck all others
								for (const [id, input2] of category_inputs) {
									if (id != "*all") {
										input2.checked = false;
									}
								}
							} else {
								// Check all others
								for (const [id, input2] of category_inputs) {
									if (id != "*all") {
										input2.checked = true;
									}
								}
							}
							this.updateDisplayedItems();
						});
						this.category_inputs.set("*all", input);
						const label = document.createElement("label");
						label.textContent = "* All Items *";
						label.setAttribute("for", input.id);
						const input_cell = row.insertCell();
						input_cell.append(input);
						const label_cell = row.insertCell();
						label_cell.append(label);
						head_container.append(row);
					}
					
					{
						const row = document.createElement("tr");
						const input = document.createElement("input");
						input.id = `cat_nocat`;
						input.type = "checkbox";
						input.addEventListener("change", (evt) => {
							const all_input = category_inputs.get("*all");
							if (input.checked) {
								if (all_input.checked) {
									all_input.checked = false;
								}
							} else {
								let any_checked = false;
								for (const [id, input2] of category_inputs) {
									if (input2.checked) {
										any_checked = true;
										break;
									}
								}
								if (!any_checked) {
									all_input.checked = true;
								}
							}
							this.updateDisplayedItems();
						});
						this.category_inputs.set("*nocat", input);
						const label = document.createElement("label");
						label.textContent = "* Uncategorized *";
						label.setAttribute("for", input.id);
						const input_cell = row.insertCell();
						input_cell.append(input);
						const label_cell = row.insertCell();
						label_cell.append(label);
						head_container.append(row);
					}
					root.append(head_container);
					
					const container = document.createElement("div");
					container.classList.add("categories");
					for (const [category_id, category_name] of this.categories) {
						const row = document.createElement("tr");
						const input = document.createElement("input");
						input.id = `cat_${category_id}`;
						input.type = "checkbox";
						input.addEventListener("change", (evt) => {
							const all_input = category_inputs.get("*all");
							if (input.checked) {
								if (all_input.checked) {
									all_input.checked = false;
								}
							} else {
								let any_checked = false;
								for (const [id, input2] of category_inputs) {
									if (input2.checked) {
										any_checked = true;
										break;
									}
								}
								if (!any_checked) {
									all_input.checked = true;
								}
							}
							this.updateDisplayedItems();
						});
						this.category_inputs.set(category_id, input);
						const label = document.createElement("label");
						label.textContent = category_name;
						label.setAttribute("for", input.id);
						const input_cell = row.insertCell();
						input_cell.append(input);
						const label_cell = row.insertCell();
						label_cell.append(label);
						container.append(row);
					}
					root.append(container);
					
					this.append(root);
				}
				
				this.append(document.createElement("hr"));
				
				{
					const root = document.createElement("div");
					
					{
						const button = document.createElement("button");
						button.textContent = "Select All";
						button.addEventListener("click", (evt) => {
							this.delaySelected = true;
							for (const item of this.item_list) {
								if (!item.hidden) {
									item.selected = true;
								}
							}
							this.delaySelected = false;
							this.updateSelected();
						});
						root.append(button);
					}
					
					{
						const button = document.createElement("button");
						button.textContent = "Unselect All";
						button.addEventListener("click", (evt) => {
							this.delaySelected = true;
							for (const item of this.item_list) {
								if (!item.hidden) {
									item.selected = false;
								}
							}
							this.delaySelected = false;
							this.updateSelected();
						});
						root.append(button);
					}
					
					this.append(root);
				}
				
				{
					const table = document.createElement("table");
					table.style.width = "100%";
					const body = document.createElement("tbody");
					for (const [item_id, item] of this.items) {
						body.append(item);
					}
					table.append(body);
					this.append(table);
				}
				
				this.append(document.createElement("hr"));
				
				{
					const root = document.createElement("div");
					const update_button = document.createElement("button");
					update_button.textContent = "Submit Changes";
					update_button.addEventListener("click", (evt) => {
						setTimeout(async () => {
							await this.submitChanges();
							
							// Refresh page
							location = location;
						}, 0);
					});
					root.append(update_button);
					this.append(root);
				}
				
				this.updateSelected();
			}
		}
		
		async submitChanges() {
			console.debug("Preparing to submit changes");
			// Send updated categories
			const category_form = new FormData();
			const rank_form = new FormData();
			category_form.append("gallery_id", this.gallery_id);
			category_form.append("csrfmiddlewaretoken", this.csrfToken);
			rank_form.append("gallery_id", this.gallery_id);
			rank_form.append("sort_order", "");
			rank_form.append("csrfmiddlewaretoken", this.csrfToken);
			let category_changed = false;
			let rank_changed = false;
			let i = 0;
			for (const item of this.item_list) {
				if (item.deleted) continue;
				if (item.original_categories.size != item.categories.size) {
					category_changed = true;
				}
				for (const category of item.categories) {
					if (!item.original_categories.has(category)) {
						category_changed = true;
					}
					category_form.append(item.cat_field_name, category);
				}
				if (item.original_rank != item.rank) {
					rank_changed = true;
				}
				rank_form.append(`rank_${item.item_id}`, i++);
			}
			
			if (category_changed) {
				console.debug("Sending category updates");
				const category_response = await fetch(`/gallery/?gallery_id=${this.gallery_id}`, {
					method: "POST",
					body: category_form,
				});
				// We can re-use the csrf token for updating rank
			}
			if (rank_changed) {
				console.debug("Sending rank updates");
				const rank_response = await fetch(`/gallery/edit/rankings/?gallery_id=${this.gallery_id}`, {
					method: "POST",
					body: rank_form,
				});
			}
		}
		
		updateRanks() {
			for (let i=0;i<this.item_list.length;i++) {
				this.item_list[i].rank = i;
			}
		}
		
		updateSelected() {
			if (!this.init || this.delaySelected) return;
			let selected = false;
			for (const item of this.item_list) {
				if (item.selected) {
					selected = true;
					break;
				}
			}
			if (selected) {
				this.classList.add("item-selected");
			} else {
				this.classList.remove("item-selected");
			}
		}
		
		unselectAll() {
			const delayState = this.delaySelected;
			this.delaySelected = true;
			for (const item of this.item_list) {
				if (item.selected) {
					item.selected = false;
				}
			}
			this.delaySelected = delayState;
			this.updateSelected();
		}
		
		moveItem(target, down) {
			const target_i = this.item_list.indexOf(target);
			if (target_i < 0) return;
			this.item_list.splice(target_i, 1);
			let node;
			if (down) {
				this.item_list.splice(target_i + 1, 0, target);
				if (target.nextSibling) {
					target.nextSibling.after(target);
				}
			} else {
				this.item_list.splice(target_i - 1, 0, target);
				if (target.previousSibling) {
					target.previousSibling.before(target);
				}
			}
			this.updateRanks();
		}
		
		moveSelected(target, after) {
			const backup_list = this.item_list.slice();
			const batch = [];
			let target_i;
			for (let i=0;i<this.item_list.length;i++) {
				const item = this.item_list[i];
				if (item === target) {
					target_i = i;
					if (after) {
						++target_i;
					}
				}
				if (item.selected) {
					batch.push(item);
					this.item_list.splice(i, 1);
					--i;
				}
			}
			if (batch.length) {
				if (target_i != null) {
					const new_target = this.item_list[target_i];
					this.item_list.splice(target_i, 0, ...batch);
					if (!new_target) {
						const parent = target.parentElement;
						parent.append(...batch);
					} else {
						new_target.before(...batch);
					}
				} else {
					this.item_list = backup_list;
				}
			}
			this.updateRanks();
		}
		
		updateDisplayedItems() {
			const categories = new Set();
			for (const [id, input] of this.category_inputs) {
				if (input.checked) {
					categories.add(id);
				}
			}
			for (const item of this.item_list) {
				if (item.deleted) continue;
				let hide = true;
				if (categories.has("*all")) {
					hide = false;
				} else if (item.categories.size > 0) {
					for (const category of item.categories) {
						if (categories.has(category)) {
							hide = false;
							break;
						}
					}
				} else if (categories.has("*nocat")) {
					hide = false;
				}
				item.hidden = hide;
			}
		}
	}
	customElements.define("gallery-main", GalleryMain, {extends: "div"});
	
	class GalleryItem extends HTMLTableRowElement {
		init = false;
		
		constructor(gallery, node, rank) {
			super();
			
			this.gallery = gallery;
			this.original_rank = rank;
			this.rank = this.original_rank;
			this.selected = false;
			this.deleted = false;
			
			const img = node.querySelector("img[src]");
			this.image_url = img.src;
			this.description = img.alt;
			this.name = node.querySelector(".gallery-item-name").textContent;
			this.amount = Number.parseInt(node.querySelector(".gallery-item-qty").textContent.match(/Qty : ([\d,]+)/)[1].replace(/,/g, ""));
			this.item_id = node.querySelector(".gallery-remove-item > a[href]").href.match(/\/(\d+)\/$/)[1];
			
			const cat_select = node.querySelector("select.gallery-select-category");
			this.cat_field_name = cat_select.name;
			this.categories = new Set();
			// Only works after all scripts run
			for (const option of cat_select.children) {
				if (option.selected) {
					this.categories.add(option.value);
				}
			}
		}
		
		connectedCallback() {
			if (!this.init) {
				this.init = true;
				this.classList.add("item-upgraded");
				if (this.selected) {
					this.classList.add("selected");
				}
				if (this.deleted) {
					this.style.display = "none";
				}
				// this.addEventListener("click", (evt) => {
				// 	console.debug("Click!");
				// 	this.selected = !this.selected;
				// 	this.classList.toggle("selected");
				// });
				
				const image_cell = this.insertCell();
				const image = document.createElement("img");
				image.src = this.image_url;
				image.alt = this.description;
				image.title = this.description;
				image.classList.add("med-image");
				image_cell.append(image);
				
				const info_cell = this.insertCell();
				const name_node = document.createElement("span");
				name_node.textContent = this.name;
				info_cell.append(name_node);
				info_cell.append(document.createElement("br"));
				info_cell.append("Qty: ");
				const amount_node = document.createElement("span");
				amount_node.textContent = this.amount.toLocaleString();
				this.amount_node = amount_node;
				info_cell.append(amount_node);
				info_cell.append(document.createElement("br"));
				info_cell.append("Remove: ");
				const remove_one_button = document.createElement("a");
				remove_one_button.textContent = "One";
				remove_one_button.addEventListener("click", (evt) => {
					evt.stopPropagation();
					this.amount -= 1;
					setTimeout(async () => {
						const response = await fetch(`/gallery/removeitem/${this.gallery.gallery_id}/${this.item_id}/`, {
							redirect: "manual",
						});
					}, 0);
				});
				info_cell.append(remove_one_button);
				info_cell.append(" | ");
				const remove_all_button = document.createElement("a");
				remove_all_button.textContent = "All";
				remove_all_button.addEventListener("click", (evt) => {
					evt.stopPropagation();
					this.amount = 0;
					setTimeout(async () => {
						const response = await fetch(`/gallery/removeitemall/${this.gallery.gallery_id}/${this.item_id}/`, {
							redirect: "manual",
						});
					}, 0);
				});
				info_cell.append(remove_all_button);
				
				const cat_cell = this.insertCell();
				const cat_node = document.createElement("select");
				cat_node.multiple = true;
				// cat_node.name = this.cat_field_name;
				cat_node.addEventListener("click", (evt) => {
					evt.stopPropagation();
				});
				cat_node.addEventListener("change", (evt) => {
					this.categories.clear();
					for (const node of cat_node.children) {
						if (node.selected) {
							this.categories.add(node.value);
						}
					}
				});
				for (const [category_id, category_name] of this.gallery.categories) {
					const option = document.createElement("option");
					option.value = category_id;
					option.textContent = category_name;
					cat_node.append(option);
					if (this.categories.has(category_id)) {
						option.selected = true;
					}
				}
				this.category_node = cat_node;
				cat_cell.append(cat_node);
				
				const control_cell = this.insertCell();
				control_cell.classList.add("controls");
				const up_button = document.createElement("button");
				up_button.classList.add("move-up");
				up_button.textContent = "Move Up";
				up_button.addEventListener("click", (evt) => {
					evt.stopPropagation();
					this.gallery.moveItem(this, false);
				});
				control_cell.append(up_button);
				const down_button = document.createElement("button");
				down_button.classList.add("move-down");
				down_button.textContent = "Move Down";
				down_button.addEventListener("click", (evt) => {
					evt.stopPropagation();
					this.gallery.moveItem(this, true);
				});
				control_cell.append(down_button);
				
				const above_button = document.createElement("button");
				above_button.classList.add("move-above");
				above_button.textContent = "Move Above";
				above_button.addEventListener("click", (evt) => {
					evt.stopPropagation();
					this.gallery.moveSelected(this, false);
					this.gallery.unselectAll();
				});
				control_cell.append(above_button);
				const below_button = document.createElement("button");
				below_button.classList.add("move-below");
				below_button.textContent = "Move Below";
				below_button.addEventListener("click", (evt) => {
					evt.stopPropagation();
					this.gallery.moveSelected(this, true);
					this.gallery.unselectAll();
				});
				control_cell.append(below_button);
				
				const select_button = document.createElement("button");
				select_button.textContent = "Select";
				select_button.addEventListener("click", (evt) => {
					evt.stopPropagation();
					this.selected = !this.selected;
				});
				control_cell.append(select_button);
			}
		}
		
		get amount() {
			return this._amount;
		}
		
		set amount(value) {
			if (value != this.amount) {
				this._amount = value;
				if (value <= 0) {
					this.deleted = true;
					this.hidden = true;
				}
				if (this.init) {
					this.amount_node.textContent = value.toLocaleString();
					if (this.deleted) {
						this.style.display = "none";
					}
				}
			}
		}
		
		get selected() {
			return this._selected || false;
		}
		
		set selected(value) {
			value = !!value;
			if (value != this.selected) {
				this._selected = value;
				if (this.init) {
					if (value) {
						this.classList.add("selected");
					} else {
						this.classList.remove("selected");
					}
				}
				this.gallery.updateSelected();
			}
		}
		
		get hidden() {
			return this._hidden || false;
		}
		
		set hidden(value) {
			value = !!value;
			if (this.deleted) value = true;
			if (value != this.hidden) {
				this._hidden = value;
				this.selected = false;
				if (this.init) {
					if (value) {
						this.style.display = "none";
					} else {
						this.style.display = null;
					}
				}
			}
		}
	}
	customElements.define("gallery-item", GalleryItem, {extends: "tr"});
	
	function main() {
		const new_gallery = new GalleryMain();
		window.new_gallery = new_gallery;
		document.querySelector("#page_content").append(new_gallery);
		document.querySelector("#galleryContent").style.display = "none";
	}
	
	switch(document.readyState) {
		case "complete":
		case "interactive":
			main();
			break;
		case "loading":
		default:
			document.addEventListener("DOMContentLoaded", main);
	}
})();