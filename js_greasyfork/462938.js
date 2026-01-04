// ==UserScript==
// @name        MiniBeast TCL Recipe Exporter
// @version     7
// @description TCL Recipe importer for MiniBeast Enterprises.
// @namespace   minibeastofficial-app.com
// @license     none
// @grant       none
// @run-at      document-idle
// @include     https://app.thatcleanlife.com/*
// @downloadURL https://update.greasyfork.org/scripts/462938/MiniBeast%20TCL%20Recipe%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/462938/MiniBeast%20TCL%20Recipe%20Exporter.meta.js
// ==/UserScript==

(async function(){

	const IS_DEV = false;

	class APIRequest {

		constructor() {
			this.email = localStorage.getItem('mb-email');
			this.password = localStorage.getItem('mb-password');
			this.endpoint = IS_DEV ? "http://localhost/MB-Web/html/api/" : "https://minibeastofficial-app.com/api/";
			this.method_params = {};
		}

		set(method, param_name = null, param_value = null) {
			if (!this.method_params[method]) {
				this.method_params[method] = {};
			}
			if (param_name !== null && param_value !== null) {
				this.method_params[method][param_name] = param_value;
			}

			return this;
		}

		getQueryString() {
			return Object.keys(this.method_params).map(method => {
				const enc_method = encodeURIComponent(method);
				const method_keys = Object.keys(this.method_params[method]);
				if (!method_keys.length) return enc_method;
				return method_keys.map(param_name => {
					var param_value = this.method_params[method][param_name];
					const enc_param_name = encodeURIComponent(param_name);
					const enc_param_value = encodeURIComponent(param_value);
					return `${enc_method}[${enc_param_name}]=${enc_param_value}`;
				}).join('&');
			}).join('&');
		}

		async send() {
			Object.keys(this.method_params).forEach(p => {
				this.method_params[p]['email'] = this.email;
				this.method_params[p]['password'] = this.password;
			});

			var url = this.endpoint + "?" + this.getQueryString();
			var result;
			try {
				result = await fetch(url, {
					method: "POST"
				}).then(resp => resp.json());
			} catch (e) {
				console.error(e);
				result = {};
				Object.keys(this.method_params).forEach(method => {
					result[method] = {
						errors: [e.message]
					};
				});
			}
			if (result.login && result.login.errors && result.login.errors.length) {
				localStorage.removeItem('mb-email');
				localStorage.removeItem('mb-password');
			}
			return result;
		}
	}

	var CURR_URL = window.location.href;
	const run_if_recipe = () => {
		if(CURR_URL.match(/^https:\/\/app\.thatcleanlife\.com\/(box\/)?recipes\/\d+$/)){
			MBImportMain();
		}else{
			MBImportKill();
		}
	};

	run_if_recipe();
	setInterval(() => {
		if (CURR_URL !== window.location.href) {
			CURR_URL = window.location.href;
			run_if_recipe();
		}
	}, 10);

	function MBImportKill(){
		var element_ids = ['mb-overlay-modal', 'mb-export'];
		for(let i=0; i<element_ids.length; i++){
			if (document.getElementById(element_ids[i])) {
				document.getElementById(element_ids[i]).remove();
			}
		}
	}

	function modal(html) {
		if (document.getElementById('mb-overlay-modal')) {
			document.getElementById('mb-overlay-modal').remove();
		}

		document.body.insertAdjacentHTML('beforeend', `<div id='mb-overlay-modal'>
			<div style='padding: 1em;'>
				<img src='https://minibeastofficial-app.com/img/mb_abbrv_gray.png' /><br>
				${html}
			</div>
		</div>`);

		var modal = document.getElementById('mb-overlay-modal');
		Object.assign(modal.style, {
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100vw',
			height: '100vh',
			zIndex: 9999999999999,
			background: 'rgba(255, 255, 255, .9)',
			margin: 0,
			padding: 0
		});

		return function close() {
			modal.remove();
		}
	}

	function login() {
		return new Promise(done => {
			var html = `
				<div id='mb-login-error' style='font-weight: bold; font-size: 1.2em; color: red; display:none;'>
					Incorrect email or password, please try again.
				</div>
				<b>Login to your MiniBeast Admin account:</b><br>
				<input placeholder='email' type='text' id='mb-login-email'><br>
				<input placeholder='email' type='password' id='mb-login-password'><br>
				<button style='padding: 3px; color: black; border-color: black; margin-top: 3px;' id='mb-login-btn'>Login</button>
				<button style='padding: 3px; color: black; border-color: black; margin-top: 3px;' id='mb-login-cancel-btn'>Cancel</button>
			`;
			var close = modal(html);
			document.getElementById('mb-login-cancel-btn').addEventListener('click', function (e) {
				e.preventDefault();
				close();
				done(false);
			});
			document.getElementById('mb-login-btn').addEventListener('click', async function (e) {
				e.preventDefault();
				localStorage.setItem('mb-email', document.getElementById('mb-login-email').value);
				localStorage.setItem('mb-password', document.getElementById('mb-login-password').value);
				var request = new APIRequest();
				request.set('login');
				if ((await request.send()).login.errors.length) {
					document.getElementById('mb-login-error').style.display = 'block';
				} else {
					close();
					done(true);
				}
			});
		});
	}

	function selectStandardTags(current_tags = []) {
		return new Promise(done => {
			current_tags = current_tags.map(d => d.toUpperCase().trim());
			var html = `
				<div id='mb-category-error' style='font-weight: bold; font-size: 1.2em; color: red; display:none;'>
					Select at least one category
				</div>
				<b>Select at least one category for this recipe:</b><br>
				<label><input type='checkbox' class='mb-cat-cb' value='BREAKFAST' ${current_tags.includes('BREAKFAST') ? 'checked' : ''}> BREAKFAST</label><br>
				<label><input type='checkbox' class='mb-cat-cb' value='LUNCH' ${current_tags.includes('LUNCH') ? 'checked' : ''}> LUNCH</label><br>
				<label><input type='checkbox' class='mb-cat-cb' value='DINNER' ${current_tags.includes('DINNER') ? 'checked' : ''}> DINNER</label><br>
				<label><input type='checkbox' class='mb-cat-cb' value='SNACK' ${current_tags.includes('SNACK') ? 'checked' : ''}> SNACK</label><br>
				<label><input type='checkbox' class='mb-cat-cb' value='MEALPREP' ${current_tags.includes('MEALPREP') ? 'checked' : ''}> MEALPREP</label><br>
				<button style='padding: 3px; color: black; border-color: black; margin-top: 3px;' id='mb-continue-btn'>Continue</button>
		  	`;
			var close = modal(html);
			document.getElementById('mb-continue-btn').addEventListener('click', async function (e) {
				e.preventDefault();
				var cats = [...document.querySelectorAll(".mb-cat-cb")].filter(cb => cb.checked).map(cb => cb.value);
				if (!cats.length) {
					document.getElementById('mb-category-error').style.display = 'block';
				} else {
					close();
					done(cats);
				}
			});
		});
	}

	async function MBImportMain() {
		MBImportKill();

		// Not logged in, do that
		if (!localStorage.getItem('mb-email') || !localStorage.getItem('mb-password')) {
			document.body.insertAdjacentHTML('beforeend', `<button id='mb-export' style='position: fixed; top:1em; right: 1em; z-index: 9999999;'>
				<b>Login to MB</b>
			</button>`);
			var mb_export_btn = document.getElementById('mb-export');
			mb_export_btn.addEventListener('click', async function (e) {
				var logged_in = await login();
				if (logged_in) MBImportMain();
			});
			return;
		}
	
		const recipe_id = window.location.href.split('/').pop().trim();
		var exists_on_mb_server = await (async () => {
			var request = new APIRequest();
			request.set('checkTCLRecipeStatus', 'tcl_id', recipe_id);
			return (await request.send()).checkTCLRecipeStatus.data.exists;
		})();
	
		document.body.insertAdjacentHTML('beforeend', `<button id='mb-export' style='position: fixed; top:1em; right: 1em; z-index: 9999999;'>
			<b>${exists_on_mb_server ? 'Update MB Server' : 'Send to MB Server'}</b>
		</button>`);
	
		var mb_export_btn = document.getElementById('mb-export');
	
		var importing_in_progress = false;
		mb_export_btn.addEventListener('click', async function (e) {
			e.preventDefault();
	
			if (importing_in_progress) return;
			importing_in_progress = true;
	
			const wait = ms => new Promise(d => setTimeout(d, ms));
			var container = document.querySelector('#content-container .recipe-container .wrap.container-fluid .panel-container');
	
			var title = container.querySelector('.panel__header').innerText.trim();
			var time_to_complete = container.querySelectorAll('.panel__bar .panel__bar-text-content')[0].innerText
			var image_url = container.querySelector('figure div').style.backgroundImage;
			if (image_url === 'url("")') {
				image_url = null;
			} else {
				image_url = image_url.substring(5);
				image_url = image_url.substring(0, image_url.length - 2);
			}
	
			container.querySelector('div[data-action="directions"]').dispatchEvent(new Event('click'));
			await wait(10);
			var directions = [...container.querySelectorAll('ol.steps > li')].map(li => li.innerText.trim());
	
			container.querySelector('div[data-action="notes"]').dispatchEvent(new Event('click'));
			await wait(10);
			var notes = [...container.querySelectorAll('ul.notes > li')].map(li => li.innerHTML.trim());
	
			container.querySelector('div[data-action="ingredients"]').dispatchEvent(new Event('click'));
			await wait(10);
	
			var servings = +container.querySelector('aside .form__group .row').innerText.trim().match(/^([\d\.]*) servings?$/)[1];
			var ingredients = [...document.querySelectorAll('ul.ingredients li')].map(li => {
				var measurement = li.querySelector('h4').innerText;
				var [_, quantity, unit] = measurement.match(/^([\d\. \/]*)(.*)$/);
				if (!unit) unit = null;
				quantity = quantity.trim().split(' ').map(eval).reduce((s, a) => s + a, 0);
				if(isNaN(quantity) || !quantity) quantity = 0;
				var ingredient = li.querySelector('span').innerText;
				return { quantity, unit, ingredient };
			});
	
			container.querySelector('div[data-action="nutrition"]').dispatchEvent(new Event('click'));
			await wait(10);
			var [_, pcts, labels] = [...container.querySelectorAll(".panel__widget__content svg>g")];
			var percents = [...pcts.querySelectorAll('text')].map(t => t.innerHTML);
			var nutrients = [...labels.querySelectorAll('foreignObject>span')].map((label, index) => {
				var [nutrient, measurement] = [...label.querySelectorAll('text')].map(e => e.innerHTML);
				var [_, quantity, unit] = measurement.match(/^([\d\. \/]*)(.*)$/);
				return {
					nutrient,
					quantity: +quantity,
					unit: unit || null,
					pdv: +percents[index].substring(0, percents[index].length - 1)
				}
			}).reverse();
	
			container.querySelector('div[data-action="tags"]').dispatchEvent(new Event('click'));
			await wait(10);
			var tags = [...document.querySelectorAll('div.recipe__tags-item')].map(itm => itm.innerText.trim());
	
			var adtl_tags = await selectStandardTags(tags);
			for (let i = 0; i < adtl_tags.length; i++) if (!tags.includes(adtl_tags[i])) tags.push(adtl_tags[i]);
	
			var html = `<b>Uploading data to MiniBeast server, do not close this page.</b><br>
				<h1 id='mb-upload-status'>0% Complete</h1>
				<button style='padding: 3px; color: black; border-color: black; margin-top: 3px; display: none;' id='mb-cancel-btn'>Cancel</button>`;
			var close = modal(html);
			var cancel_btn = document.getElementById('mb-cancel-btn');
			cancel_btn.addEventListener('click', function (e) {
				e.preventDefault();
				MBImportMain();
				close();
			});
			var status_div = document.getElementById('mb-upload-status');
	
			var total_requests = 1 + tags.length + directions.length + ingredients.length + nutrients.length + notes.length;
			var requests_made = 0;
			mb_export_btn.innerHTML = `<b>${Math.floor(requests_made / total_requests * 100)}%</b>`;
			status_div.innerHTML = `${Math.floor(requests_made / total_requests * 100)}% Complete`;
	
			var request = new APIRequest();
			request.set('importRecipeBase', 'tcl_id', recipe_id);
			request.set('importRecipeBase', 'title', title);
			request.set('importRecipeBase', 'time', time_to_complete);
			request.set('importRecipeBase', 'servings', servings);
			if (image_url) {
				request.set('importRecipeBase', 'image_url', image_url);
			}
			var result = (await request.send()).importRecipeBase;
			requests_made++;
			mb_export_btn.innerHTML = `<b>${Math.floor(requests_made / total_requests * 100)}%</b>`;
			status_div.innerHTML = `${Math.floor(requests_made / total_requests * 100)}% Complete`;
			if (result.errors.length) {
				status_div.innerHTML = "Error: " + result.errors.join(". ");
				cancel_btn.style.display = null;
				return;
			}
	
			for (let i = 0; i < tags.length; i++) {
				var request = new APIRequest();
				request.set('importRecipeTag', 'tcl_id', recipe_id);
				request.set('importRecipeTag', 'tag', tags[i]);
				var result = (await request.send()).importRecipeTag;
				requests_made++;
				mb_export_btn.innerHTML = `<b>${Math.floor(requests_made / total_requests * 100)}%</b>`;
				status_div.innerHTML = `${Math.floor(requests_made / total_requests * 100)}% Complete`;
				if (result.errors.length) {
					status_div.innerHTML = "Error: " + result.errors.join(". ");
					cancel_btn.style.display = null;
					return;
				}
			}
	
			for (let i = 0; i < directions.length; i++) {
				var request = new APIRequest();
				request.set('importRecipeDirection', 'tcl_id', recipe_id);
				request.set('importRecipeDirection', 'direction', directions[i]);
				var result = (await request.send()).importRecipeDirection;
				requests_made++;
				mb_export_btn.innerHTML = `<b>${Math.floor(requests_made / total_requests * 100)}%</b>`;
				status_div.innerHTML = `${Math.floor(requests_made / total_requests * 100)}% Complete`;
				if (result.errors.length) {
					status_div.innerHTML = "Error: " + result.errors.join(". ");
					cancel_btn.style.display = null;
					return;
				}
			}
	
			for (let i = 0; i < ingredients.length; i++) {
				var request = new APIRequest();
				request.set('importRecipeIngredient', 'tcl_id', recipe_id);
				request.set('importRecipeIngredient', 'quantity', ingredients[i].quantity);
				request.set('importRecipeIngredient', 'unit', ingredients[i].unit);
				request.set('importRecipeIngredient', 'ingredient', ingredients[i].ingredient);
				var result = (await request.send()).importRecipeIngredient;
				requests_made++;
				mb_export_btn.innerHTML = `<b>${Math.floor(requests_made / total_requests * 100)}%</b>`;
				status_div.innerHTML = `${Math.floor(requests_made / total_requests * 100)}% Complete`;
				if (result.errors.length) {
					status_div.innerHTML = "Error: " + result.errors.join(". ");
					cancel_btn.style.display = null;
					return;
				}
			}
	
			for (let i = 0; i < nutrients.length; i++) {
				var request = new APIRequest();
				request.set('importRecipeNutrition', 'tcl_id', recipe_id);
				request.set('importRecipeNutrition', 'nutrient', nutrients[i].nutrient);
				request.set('importRecipeNutrition', 'quantity', nutrients[i].quantity);
				request.set('importRecipeNutrition', 'unit', nutrients[i].unit);
				request.set('importRecipeNutrition', 'pdv', nutrients[i].pdv);
				var result = (await request.send()).importRecipeNutrition;
				requests_made++;
				mb_export_btn.innerHTML = `<b>${Math.floor(requests_made / total_requests * 100)}%</b>`;
				status_div.innerHTML = `${Math.floor(requests_made / total_requests * 100)}% Complete`;
				if (result.errors.length) {
					status_div.innerHTML = "Error: " + result.errors.join(". ");
					cancel_btn.style.display = null;
					return;
				}
			}
	
			for (let i = 0; i < notes.length; i++) {
				var request = new APIRequest();
				request.set('importRecipeNote', 'tcl_id', recipe_id);
				request.set('importRecipeNote', 'note', notes[i]);
				var result = (await request.send()).importRecipeNote;
				requests_made++;
				mb_export_btn.innerHTML = `<b>${Math.floor(requests_made / total_requests * 100)}%</b>`;
				status_div.innerHTML = `${Math.floor(requests_made / total_requests * 100)}% Complete`;
				if (result.errors.length) {
					status_div.innerHTML = "Error: " + result.errors.join(". ");
					cancel_btn.style.display = null;
					return;
				}
			}
	
			status_div.innerHTML = "Import complete.";
			cancel_btn.style.display = null;
			cancel_btn.innerHTML = 'Close';
	
			mb_export_btn.innerHTML = `<b>Done!</b>`;
			await wait(2000);
	
			mb_export_btn.innerHTML = `<b>Update MB Server</b>`;
			importing_in_progress = false;
		});
	
	
	}

})();