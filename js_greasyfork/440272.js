// ==UserScript==
// @name         Heureka Watchdog Master
// @namespace    https://greasyfork.org/users/198317-trumpeta
// @run-at       document-idle
// @version      1.04.0
// @description  Nastaví hlídání ceny pro všechno zboží v kategorii
// @author       Trumpeta
// @copyright    2022, Trumpeta (https://greasyfork.org/cs/users/198317-trumpeta)
// @license      GPL-3.0-or-later
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAA/CAMAAABpakCXAAAAG1BMVEX2qWf8483/+fXzkz/6zKT////xehPvcAEAAABPZhGaAAAACXRSTlP//////////wBTT3gSAAAACXBIWXMAAC4jAAAuIwF4pT92AAADD0lEQVR4nJVX4cKrIAgVJfve/2mXE71WoqCu3fnLFScOcECHf2ZaFF10zoDJhggJ/GxyLZyB2Xvjrj0YxLJ9Q1rCB2ywdjZDY1+LxwM2IizZwZ4XaIkNMEUg0XF8K35/cspoN7ru2Nf+hDzXHoMCM5beAzQTGeOcooIajCtoDgDebuc22Og7HrMEV6yExoRdMN5gqVtDAwjwjY0dmtOmyRd4sK7ZH4Pfo5sfKxH42Pd7L9W5oc6JFvIuQcvK2oNJnk9ze0VrcSSZbbDCb/gGjbp8yI6LdWMcrVmtMH6RzbBEW7c5O7NazDgnpx2jiZzYdZOalpqE78ogs9/8zLjRKu9T3fpbIEjsDdaMuQinZvbquKYamXJOK2RPVDqpt6xeT5G9BVZFjI66uDhRd0ScLVf9cvKq8Wt3otd6oi7Z+krakZN+qy5uY4zXSxNY6MefsoKosCDZlBI6yTh3OdQH6sdQ3KtdOmN+SzLgcb4lVmhpl1baY9ld07ngOXewBculXaumTKDBMfK8hNZsC7FeOWO/fQ5ZHgz8SopVaQ9J67uwPgYqcoC1iBS2f3GP6usqUfXNXRVszHrWUB4RKlFcorsCyD+9GLyb+JAe+vVDtN1+a3QgM0ItZF1aFW7RJBO01MP0B3emKi3rrPY0tp4E2cCcL11arkXtV+zqsPKcgsuHZtzkXQHlLtKCAMHalUuLQXU0tYaMfT4DO66Nx+BB6gQcHQdXDJpjeU5Nq5/QLZBL0zx3jXtt62lpQmJolufReSIwnT3ScsIftkmkp/7CtnKePbngTXlr7SFSj9VdowruDXrMU+6HrGpI7lUh/3LMvIBnYMjZS22594Q12yE0D7vJb7pMx3kGwrBl2OmuBfxQLgEWXXtsj3fCGSy+vvca/h9YMvOljJ+EJWcYg7XtTpRX6JySFemo4MGyGBzZ6Yc54HmxjhN49rJfF9CS+LKnMsSp3i5xAi/j8/zYmq1bTODPTTevATzdu57BUgKQfsKaXYL9b1gFfvhX8xX8MKC+gn/228HH9ju2gLOHCJv7B4grHE5tMD9nAAAAAElFTkSuQmCC
// @match        https://*.heureka.cz/
// @match        https://*.heureka.cz/?*
// @match        https://*.heureka.cz/*/
// @match        https://*.heureka.cz/*/?*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      heureka.cz
// @require      https://openuserjs.org/src/libs/Anakunda/xhrLib.min.js
// @downloadURL https://update.greasyfork.org/scripts/440272/Heureka%20Watchdog%20Master.user.js
// @updateURL https://update.greasyfork.org/scripts/440272/Heureka%20Watchdog%20Master.meta.js
// ==/UserScript==

'use strict';

const isNumericInput = input => input instanceof HTMLInputElement && (input.type == 'number'
	|| input.type == 'text' && input.classList.contains('c-range-filter__input'));

function setInputValue(input, value) {
	if (!(input instanceof HTMLInputElement)) return false;
	const prototype = Object.getPrototypeOf(input);
	const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
	if (valueSetter != null) {
		if (value != undefined) valueSetter.call(input, value);
		return input.dispatchEvent(new Event('input', { bubbles: true }));
	} else {
		if (!('_valueTracker' in input)) return false;
		if (value != undefined) input.value = value;
		if (typeof input._valueTracker.setValue == 'function') input._valueTracker.setValue(input.value);
		const findProperty = pattern => pattern && (pattern = Object.keys(input).find(key =>
			key.startsWith(`__react${pattern}$`))) && input[pattern];
		const evt = new Event('change');
		Object.defineProperty(evt, 'target', { writable: false, value: input });
		Object.defineProperty(evt, 'currentTarget', { writable: false, value: input });
		let prop;
		for (let pattern of ['EventHandlers', 'Props']) if (prop = findProperty(pattern)) {
			if (typeof prop.onChange == 'function') return prop.onChange(evt);
		}
		for (let pattern of ['Fiber']) if (prop = findProperty(pattern)) {
			for (let key of ['memoizedProps', 'pendingProps'])
				if (key in prop && typeof prop[key].onChange == 'function') return prop.onChange(evt);
		}
		return false;
	}
}

function getPreloadedReduxState(document = window.document) {
	for (let script of document.body.getElementsByTagName('SCRIPT')) {
		let __PRELOADED_REDUX_STATE = /\b(?:__PRELOADED_REDUX_STATE)\s*=\s*({.+});\s*$/m.exec(script.text);
		if (__PRELOADED_REDUX_STATE == null) continue;
		try { __PRELOADED_REDUX_STATE = eval('(' + __PRELOADED_REDUX_STATE[1] + ')') } catch(e) { console.warn(e) }
		if (__PRELOADED_REDUX_STATE) return __PRELOADED_REDUX_STATE;
	}
	return null;
}
// const __PRELOADED_REDUX_STATE = getPreloadedReduxState();
// if (!__PRELOADED_REDUX_STATE || !__PRELOADED_REDUX_STATE.cookies.heureka_uz) return;

const findStates = document => (document instanceof Document ? Promise.resolve(document)
		: localXHR(window.document.URL)).then(function(document) {
	let data = [ ];
	for (let script of document.querySelectorAll('script[type="application/json"]'))
		try { data.push(JSON.parse(script.text)) } catch(e) { }
	// let data = ['category-search-config', 'category-search-state'].map(function(id) {
	// 	id = document.getElementById(id);
	// 	if (id != null) try { return JSON.parse(id.text) } catch(e) { }
	// }).filter(Boolean);
	data = data.length > 0 ? Object.assign.apply({ }, data) : null;
	return data && data.cookies && data.filters ? data : Promise.reject('Unexpected document structure');
});

function wheelControlLinear(evt, stepV = 1, stepH = stepV, minValue, maxValue) {
	if (!(stepV > 0)) return false;
	if (!isFinite(minValue)) minValue = parseFloat(evt.currentTarget.min);
	if (!isFinite(minValue)) minValue = 0;
	if (!isFinite(maxValue)) maxValue = parseFloat(evt.currentTarget.max);
	if (maxValue < minValue) maxValue = minValue;
	const value = parseFloat(evt.currentTarget.value) || 0;
	let newValue = value;
	if (stepH > 0 && stepH != stepV) switch (Math.sign(evt.deltaX)) {
		case +1: newValue += stepH - newValue % stepH; break;
		case -1: newValue -= newValue % stepH || stepH; break;
	}
	switch (Math.sign(evt.deltaY)) {
		case -1: newValue += stepV - newValue % stepV; break;
		case +1: newValue -= newValue % stepV || stepV; break;
	}
	if (isFinite(newValue = Math.round(newValue)) && newValue < minValue) newValue = minValue;
	if (isFinite(maxValue) && newValue > maxValue) newValue = maxValue;
	if (newValue == value) return false;
	setInputValue(evt.currentTarget, newValue);
	return false;
}

function wheelControlExp(evt, minValue, maxValue) {
	if (!isFinite(minValue)) minValue = parseFloat(evt.currentTarget.min);
	if (!isFinite(minValue)) minValue = 0;
	if (!isFinite(maxValue)) maxValue = parseFloat(evt.currentTarget.max);
	if (maxValue < minValue) maxValue = minValue;
	const value = parseFloat(evt.currentTarget.value) || 0;
	let newValue = value, step;
	switch (Math.sign(evt.deltaX)) {
		case +1:
			if (newValue < 10) newValue = 10; else {
				step = Math.pow(10, Math.floor(Math.log10(newValue)));
				newValue += step - newValue % step;
			}
			break;
		case -1:
			if (newValue <= 10) break;
			step = Math.pow(10, Math.ceil(Math.log10(newValue)) - 1);
			newValue -= newValue % step || step;
			break;
	}
	switch (Math.sign(evt.deltaY)) {
		case -1:
			step = newValue < 10 ? 1 : Math.pow(10, Math.floor(Math.log10(newValue)) - 1);
			newValue += step - newValue % step;
			break;
		case +1:
			if (newValue < 2) break;
			step = newValue <= 10 ? 1 : Math.pow(10, Math.ceil(Math.log10(newValue)) - 2);
			newValue -= newValue % step || step;
			break;
	}
	if (isFinite(newValue = Math.round(newValue)) && newValue < minValue) newValue = minValue;
	if (isFinite(maxValue) && newValue > maxValue) newValue = maxValue;
	if (newValue == value) return false;
	setInputValue(evt.currentTarget, newValue);
	return false;
}

function formSubmitHandler(evt) {
	if (!(evt.currentTarget instanceof HTMLFormElement)) return;
	for (let input of evt.currentTarget.getElementsByTagName('INPUT'))
		if (isNumericInput(input)) setInputValue(input);
	return true;
}

function addInputHandlers(form) {
	if (!(form instanceof HTMLFormElement)) return -1;
	for (let input of form.getElementsByTagName('INPUT')) {
		if (!isNumericInput(input)) continue;
		input.step = 1;
		input.onmousewheel = input.onwheel = evt => wheelControlExp(evt, 0);
		input.ondblclick = evt => { setInputValue(evt.currentTarget, evt.currentTarget.max ? 1 : '') };
	}
	//form.onsubmit = formSubmitHandler;
}

let ref = document.body.querySelector('div#root aside > div.l-sidebar__content');
if (ref == null) {
	for (let div of document.body.querySelectorAll('div.c-offscreen > aside > div.c-new-offscreen'))
		new MutationObserver(function(ml, mo) {
			for (let mutation of ml) for (let node of mutation.addedNodes) if (node.nodeName == 'FORM') {
				const input = node.querySelector('input#c-form-cell__watchdog-price');
				console.assert(input != null, 'input == null');
				if (input == null) continue;
				let span = document.body.querySelector('div.c-price-watch-block > button > span');
				console.debug('span:', span, span.textContent);
				if (span != null && (span = /\bUpravit hlídanou cenu:\s*([\d\.\,\s]+)/.exec(span.textContent)) != null) {
					const watchedPrice = Math.floor(parseFloat(span[1].replace(/\s+/g, '')));
					//input._valueTracker.setValue(watchedPrice);
					setInputValue(input, watchedPrice);
				} else if ((span = parseFloat(input.max)) > 0) {
					const price = Math.floor(span);
					input.value = Math.max(price < span ? price : price - 1, 1);
				}
				addInputHandlers(node);
			}
		}).observe(div, { childList: true });
	return;
}

function setWatchdogs(evt) {
	evt.preventDefault();
	const button = evt.submitter || evt.explicitOriginalTarget;
	if (!(button instanceof HTMLInputElement)) {
		console.error('Unexpected form submit event:', evt);
		throw 'Assertion failed: can not determine button pressed';
	}
	const watchDogs = [parseInt(priceMin.value), parseInt(priceMax.value), parseFloat(pricePercent.value)];
	switch (button.id) {
		case 'watchdogs-add':
			if (!watchDogs.some(wd => wd > 0)) {
				alert('Alespoň jedna hodnota musí být nastavena');
				return false;
			} else if (watchDogs[0] > watchDogs[1]) {
				alert('Minimální fixní cena nesmí být vyšší');
				return false;
			} else if (watchDogs[2] <= 0 || watchDogs[2] >= 100) {
				alert('Procento z nejnižší ceny musí být v rozezí 0 < % < 100');
				return false;
			}
			if (!confirm(`
Tato akce nastaví hlídání ceny u veškerého zboží v aktuálním výpisu na tyto hodnoty

    Fixní cena (minimum): ${watchDogs[0] > 0 ? watchDogs[0] + ' Kč' : 'nenastaveno'}
    Fixní cena (maximum): ${watchDogs[1] > 0 ? watchDogs[1] + ' Kč' : 'nenastaveno'}
    Procento z nejnižší ceny: ${watchDogs[2] > 0 ? watchDogs[2] + '%' : 'nenastaveno'}

Po celou dobu nastavování neopouštějte aktuální stránku.
Ukončení hromadné operace bude oznámeno krátkou zprávou.
`)) return false;
			break;
		case 'watchdogs-remove':
			if (!confirm(`
Tato akce zruší hlídání ceny u veškerého zboží v aktuálním výpisu.
Po celou dobu odstraňování neopouštějte aktuální stránku.
Ukončení hromadné operace bude oznámeno krátkou zprávou.
`)) return false;
			break;
	}
	watchdogsAdd.disabled = watchdogsRemove.disabled = true;
	button.style.backgroundColor = 'red';
	button.value = 'Pracuji... [načítání]';
	button.title = 'Neopouštějte/nezavírejte tuto stránku dokud nebude operace skončena.\nSoučasně nepoužívejte web Heureky ani v jiném okně.';
	(function refreshState(retryCounter = 0) {
		localXHR(document.URL).then(document => findStates(document).then(function(categorySearchState) {
			if (!categorySearchState.cookies.heureka_uz) throw 'Nejsi přihlášen';
			const listSort = document.head.querySelector('meta[name="gtm:ecommerce:listSort"][content]')
				|| window.document.head.querySelector('meta[name="gtm:ecommerce:listSort"][content]');
			const payLoad = {
				category_slug: categorySearchState.categories.slug,
				active_filters: (e => {
					const hn = 'exact', pn = 'range', t = { };
					return Object.entries(e).forEach(e => {
						var [r, n] = e;
						n.forEach(e => {
							var { type: n, min: a, max: o, id: i } = e;
							if (n !== hn && n !== pn) throw new Error('Unknown filter type: '.concat(n));
							if (n === pn) {
								if (i) throw new Error('Id attribute is not allowed for this filter type: '.concat(n));
								a && o ? t[r] = { min: a, max: o } : a ? t[r] = { min: a } : o && (t[r] = { max: o })
							}
							if (n === hn) {
								if (!i) throw new Error('Id attribute is required for this filter type: '.concat(n));
								Array.isArray(t[r]) ? t[r].push(i) : t[r] = [ i ]
							}
						});
					}), t
				})(categorySearchState.filters.activeFilters),
				search_query: categorySearchState.filters.filterSearchQuery,
				order: listSort != null && listSort.content || 'rank:desc',
				user_id: categorySearchState.cookies.heureka_uz,
				user_id_zoe: categorySearchState.cookies._sa,
			};
			ref = wdForm.querySelector('input[name="on-existing"][type="radio"]:checked');
			console.assert(ref != null, 'input[name="on-existing"][type="radio"]:checked');
			const onExisting = ref != null && ref.value;
			ref = wdForm.querySelector('input[name="min-price-base"][type="radio"]:checked');
			console.assert(ref != null, 'input[name="min-price-base"][type="radio"]:checked');
			const minPriceBase = ref != null && ref.value;
			const start = [Date.now()];

			return (function getPage(page = 1) {
				payLoad.page = page;
				return globalXHR((categorySearchState.CASE_API_BASE_URL || 'https://api.heureka.cz/category-search') +
						'/products/', { responseType: 'json' }, payLoad).then(({response}) => response.pages_count > page ?
							getPage(page + 1).then(products => response.products.concat(products)) : response.products, function(reason) {
					console.warn('Načítání seznamu produktů skončilo chybou:', reason, '(' + page + ')');
					return Promise.reject(reason);
				});
			})().then(function(products) {
				function processProduct(product) {
					if (!product) throw 'Invalid argument';
					if (button.id == 'watchdogs-add' && watchDogs[0] > 0 && product.min_price <= watchDogs[0])
						return Promise.resolve(false);
					++requestCounter;
					const prodUrl = `https://${product.category_slug}.heureka.cz/${product.slug}/`,
								apiUrl = 'https://api.heureka.cz/product-detail-gateway/graphql';
					let payLoad = {
						operationName: 'PriceDetail',
						query: `
query PriceDetail($countryCode: CountryCode!, $categorySlug: String!, $productSlug: String!) {
	productDetail(countryCode: $countryCode, categorySlug: $categorySlug, productSlug: $productSlug) {
		product { id name minPrice avgPrice maxPrice priceHistory { date priceMin priceAvg } }
		user { isProductFavourite watchDog { price } }
		reviews { stats { rating ratingCount reviewCount } }
	}
}
`,
						variables: { countryCode: 'CZECH', categorySlug: product.category_slug, productSlug: product.slug },
					};
					return globalXHR(apiUrl, { responseType: 'json' }, payLoad).then(function({response}) {
						if (response.data) response = response.data.productDetail; else return Promise.reject(response.errors);
						switch (button.id) {
							case 'watchdogs-add': {
								let priceMin = response.product.minPrice;
								if (!(priceMin > 0)) priceMin = product.min_price;
								if (!(priceMin > 0) || (watchDogs[0] > 0 && priceMin <= watchDogs[0])) return false;
								const priceMinHist = Array.isArray(response.product.priceHistory) ?
									Math.min(...response.product.priceHistory.map(price => price.priceMin)) : NaN;
								if (priceMinHist > 0 && minPriceBase == 'historical' && priceMinHist < priceMin) priceMin = priceMinHist;
								let watchdog;
								if (watchDogs[2] > 0) watchdog = priceMin * watchDogs[2] / 100;
								if (watchDogs[0] > 0 && (!(watchdog > 0) || watchdog < watchDogs[0])) watchdog = watchDogs[0];
								if (watchDogs[1] > 0 && (!(watchdog > 0) || watchdog > watchDogs[1])) watchdog = watchDogs[1];
								if (watchdog > 0 && watchdog < priceMin) watchdog = Math.ceil(watchdog); else return false;
								if (response.user.watchDog && onExisting != 'overwrite') return false; // neměnit stávající hlídání
								payLoad = {
									operationName: 'addWatchDogSubscription',
									query: `
mutation addWatchDogSubscription($countryCode: CountryCode!, $email: String, $price: Float!, $productId: Int!) {
	addWatchDog(countryCode: $countryCode, email: $email, price: $price, productId: $productId) { item { price inStock } }
}
`,
									variables: { countryCode: 'CZECH', email: '', price: watchdog, productId: parseInt(response.product.id) },
								};
								return (function addWatchDog(retry = 0) {
									++watchdogCounter;
									return globalXHR(apiUrl, { responseType: 'json' }, payLoad).then(function({response}) {
										if (response.data && response.data.addWatchDog && response.data.addWatchDog.item.price == watchdog)
											return true;
										if (response.errors && response.errors.some(error => error.message.includes('StopIteration')) && retry < 20)
											return addWatchDog(retry + 1);
										return Promise.reject(response.errors);
									}).catch(function(reason) {
										let statusCode = /^HTTP error (\d+)\b/.exec(reason);
										if (statusCode != null && [0, 429].includes(statusCode = parseInt(statusCode[1])) && retry < 20) {
											const now = Date.now();
											console.log('Heureka API call rate limit exceeded:',
												statusCode, requestCounter, watchdogCounter, start.map(start => now - start));
											//return addWatchDog(retry + 1);
										}
										console.warn('Nastavení hlídání selhalo:', prodUrl, reason);
										return false;
									});
								})();
							}
							case 'watchdogs-remove': {
								if (!response.user.watchDog) return false;
								payLoad = {
									operationName: 'deleteWatchDogSubscription',
									query: `
mutation deleteWatchDogSubscription($countryCode: CountryCode!, $email: String, $productId: Int!) {
	deleteWatchDog(countryCode: $countryCode, email: $email, productId: $productId) { }
}
`,
									variables: {
										countryCode: 'CZECH',
										email: '',
										productId: parseInt(response.product.id),
									},
								};
								return (function deleteWatchDog(retry = 0) {
									++watchdogCounter;
									return globalXHR(apiUrl, { responseType: 'json' }, payLoad).then(function({response}) {
										if (!response.errors) return true;
										if (response.errors && response.errors.some(error => error.message.includes('StopIteration')) && retry < 20)
											return addWatchDog(retry + 1);
										return Promise.reject(response.errors);
									}).catch(function(reason) {
										let statusCode = /^HTTP error (\d+)\b/.exec(reason);
										if (statusCode != null && [0, 429].includes(statusCode = parseInt(statusCode[1])) && retry < 20) {
											const now = Date.now();
											console.log('Heureka API call rate limit exceeded:',
												statusCode, requestCounter, watchdogCounter, start.map(start => now - start));
											//return delete(retry + 1);
										}
										console.warn('Odstranění hlídání selhalo:', prodUrl, reason);
										return false;
									});
								})();
							}
						}
					}).catch(function(reason) {
						let statusCode = /^HTTP error (\d+)\b/.exec(reason);
						if (statusCode != null && [0, 429].includes(statusCode = parseInt(statusCode[1])))
							return processProduct(product);
						console.warn('Nepodařilo se zpracovat produkt', product, prodUrl, reason);
						return false;
					});
				}

				if (products.length <= 0) return;
				let requestCounter = 0, watchdogCounter = 0;
				start.push(Date.now());

				return (function watchProduct(index = 0) {
					if (!(index >= 0 && index < products.length)) return Promise.resolve(0);
					button.value = products.length < 1e4 ? `Pracuji... [${index + 1}/${products.length}]`
						: `Pracuji... [${Math.round(index * 1000 / products.length)}‰]`;
					return processProduct(products[index]).then(watchdogAdded =>
						watchProduct(index + 1).then(count => (watchdogAdded ? 1 : 0) + count));
				})().then(function(total) {
					alert(`Hotovo: celkem ${total} hlídání ceny ${button.id == 'watchdogs-add' ? 'nastaveno' : 'zrušeno'} u ${products.length} nalezených produktů`);
				});

				// button.value = `Pracuji... (${products.length})`;
				// return Promise.all(products.map(processProduct)).then(function(results) {
				// 	alert(`Hotovo, celkem ${results.filter(Boolean).length} hlídání ceny přidáno u ${products.length} nalezených produktů`);
				// });
			});
		}, function(reason) {
			if (retryCounter < 10) return refreshState(retryCounter + 1);
			throw 'categorySearchState nebyl nalezen nebo má chybnou strukturu. Zkuste prosím akci zopakovat.';
		}).catch(alert).then(function() {
			button.title = '';
			button.value = button.dataset.value;
			button.style.backgroundColor = button.dataset.bgColor;
			watchdogsAdd.disabled = false;
			watchdogsRemove.disabled = false;
		}));
	})();
	return false;
}

const filterBar = document.body.querySelector('div > ul.l-sidebar__filters');
if (filterBar != null) {
	Array.prototype.forEach.call(filterBar.getElementsByTagName('FORM'), addInputHandlers);
	new MutationObserver(function(ml, mo) {
		for (let mutation of ml) for (let node of mutation.addedNodes) if (node.nodeType == Node.ELEMENT_NODE)
			Array.prototype.forEach.call(node.getElementsByTagName('FORM'), addInputHandlers);
	}).observe(filterBar, { childList: true, subtree: true });
}

const wdForm = document.createElement('FORM');
wdForm.style = 'margin-top: 3em; background-color: antiquewhite; padding: 7pt; font: 13pt "Segoe UI", Tahoma, sans-serif; border: solid 1px black;';
wdForm.innerHTML = `
<span style="font-weight: bold; color: maroon;">Hlídání ceny pro veškeré zboží v aktuálním výpisu</span>
<span style="display: block; margin-top: 1em;">Fixní cena</span>
<label style="display: block; margin-top: 0.5em;">
<span style="position: absolute;">Min:</span>
<input type="number" id="watchdog-price-min" style="margin-left: 3em !important; background-color: white; width: 5em; padding: 0px 4pt; display: inline; margin: 0 5pt; text-align: right; border: solid thin #AAA;" title="Cena, za kterou je pro mne zajímavý jakýkoliv produkt z aktuálního výpisu bez ohledu na parametry a běžnou cenu\nPrázdná hodnota = odvíjí se vždy od dynamické ceny" />
Kč
</label>
<label style="display: block; margin-top: 0.25em;">
<span style="position: absolute;">Max:</span>
<input type="number" id="watchdog-price-max" style="margin-left: 3em !important; background-color: white; width: 5em; padding: 0px 4pt; display: inline; margin: 0 5pt; text-align: right; border: solid thin #AAA;" title="Nejvyšší částka, jakou jsem ochoten investovat do jakéhokoliv produktu z aktuálního výpisu\nPrázdná hodnota = odvíjí se vždy od dynamické ceny"/>
Kč
</label>
<label style="display: block; margin-top: 1em;">
Dynamická cena<br>
<input type="number" id="watchdog-price-percent" style="background-color: white; width: 3em; padding: 0px 4pt; display: inline; margin: 0.5em 2pt 0 0; text-align: right; border: solid thin #AAA;" min="1" max="99" step="1" />
%
</label>
<label style="display: block; font-size: 9.5pt; margin-top: 0.5em;">
<input name="min-price-base" type="radio" value="current" style="display: inline; margin-right: 5pt; appearance: radio; overflow: auto;" />
Z aktuálně nejnižší ceny
</label>
<label style="display: block; font-size: 9.5pt; margin-top: 0.25em;">
<input name="min-price-base" type="radio" value="historical" style="display: inline; margin-right: 5pt; appearance: radio; overflow: auto;" />
Z historického minima
</label>
<span style="display: block; margin-top: 1em;">U existujících hlídání</span>
<label style="display: block; font-size: 9.5pt; margin-top: 0.5em;">
<input name="on-existing" type="radio" value="preserve" style="display: inline; margin-right: 5pt; appearance: radio; overflow: auto;" />
Zachovat stávající nastavení
</label>
<label style="display: block; font-size: 9.5pt; margin-top: 0.25em;">
<input name="on-existing" type="radio" value="overwrite" style="display: inline; margin-right: 5pt; appearance: radio; overflow: auto;" />
Nastavit aktuální hodnotu
</label>
<input type="submit" id="watchdogs-add" value="Nastav hlídání" style="display: block; width: 100%; margin-top: 1em; background-color: green; color: white; padding: 5pt; font-weight: bold;" data-bg-color="green" />
<input type="submit" id="watchdogs-remove" value="Odstraň hlídání" style="display: block; width: 100%; margin-top: 2pt; background-color: #f006; color: white; padding: 5pt; font-weight: bold;" data-bg-color="green" />
<input type="button" id="watchdog-save-defaults" value="Ulož jako výchozí" style="display: block; width: 100%; margin-top: 2pt; padding: 5pt; font-weight: normal;" />
`;
ref.append(wdForm);

const priceMin = document.getElementById('watchdog-price-min'),
			priceMax = document.getElementById('watchdog-price-max'),
			pricePercent = document.getElementById('watchdog-price-percent'),
			watchdogsAdd = document.getElementById('watchdogs-add'),
			watchdogsRemove = document.getElementById('watchdogs-remove'),
			saveDefaults = document.getElementById('watchdog-save-defaults');
priceMin.value = GM_getValue('default_price_min') || '';
priceMax.value = GM_getValue('default_price_max') || '';
pricePercent.value = GM_getValue('default_price_percent') || '';
ref = wdForm.querySelector(`input[name="on-existing"][type="radio"][value="${GM_getValue('default_existing_action', 'preserve')}`);
if (ref != null) ref.checked = true;
ref = wdForm.querySelector(`input[name="min-price-base"][type="radio"][value="${GM_getValue('min_price_base', 'current')}`);
if (ref != null) ref.checked = true;
priceMin.ondblclick = priceMax.ondblclick = pricePercent.ondblclick = evt => { evt.currentTarget.value = '' };
priceMin.onwheel = priceMin.onmousewheel = evt => wheelControlExp(evt, 0, parseFloat(priceMax.value));
priceMax.onwheel = priceMax.onmousewheel = evt => wheelControlExp(evt, parseFloat(priceMin.value));
pricePercent.onwheel = pricePercent.onmousewheel = evt => wheelControlLinear(evt, 1, 5, 0, 100);
watchdogsAdd.dataset.value = watchdogsAdd.value;
watchdogsAdd.dataset.bgColor = 'green';
watchdogsRemove.dataset.value = watchdogsRemove.value;
watchdogsRemove.dataset.bgColor = '#f006';
saveDefaults.onclick = function(evt) {
	GM_setValue('default_price_min', priceMin.value);
	GM_setValue('default_price_max', priceMax.value);
	GM_setValue('default_price_percent', pricePercent.value);
	ref = wdForm.querySelector('input[name="on-existing"][type="radio"]:checked');
	console.assert(ref != null, 'input[name="on-existing"][type="radio"]:checked');
	if (ref != null) GM_setValue('default_existing_action', ref.value);
	ref = wdForm.querySelector('input[name="min-price-base"][type="radio"]:checked');
	console.assert(ref != null, 'input[name="min-price-base"][type="radio"]:checked');
	if (ref != null) GM_setValue('min_price_base', ref.value);
	evt.currentTarget.style.color = 'green';
	setTimeout(elem => { elem.style.color = null }, 1000, evt.currentTarget);
	return false;
};

wdForm.onsubmit = setWatchdogs;
