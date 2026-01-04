// ==UserScript==
// @name			Aliexpress Shopping Card Editor
// @name:ru			Редактор корзины Aliexpress
// @version			1.4.3
// @description		Adds support to select items from the cart before ordering
// @description:ru	Добавляет возможность выбирать товары из корзины перед заказом
// @author			DeNcHiK3713
// @namespace		https://greasyfork.org/users/174390
// @match			*://*.aliexpress.com/*
// @run-at			document-end
// @require			https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require			https://cdnjs.cloudflare.com/ajax/libs/accounting.js/0.4.1/accounting.min.js
// @require			https://cdnjs.cloudflare.com/ajax/libs/money.js/0.2.0/money.min.js
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_registerMenuCommand
// @grant			GM_setClipboard
// @grant			GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/39396/Aliexpress%20Shopping%20Card%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/39396/Aliexpress%20Shopping%20Card%20Editor.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var cookie = false;
	if (document.cookie.match('affiliateKey[%a-fA-F0-9]+22jqf2Rf6')) {
		cookie = true;
	}
	var cashback = GM_config.getValue('cashback', false);
	if (cashback && !cookie) {
		location.href = 'http://shopeasy.by/redirect/cpa/o/o8barzkbzmcxdmf3n4as8uo2sv1uypnl/?to=' + encodeURIComponent(location.href);
	}
	var shoppingcart = false;
	if (/shoppingcart.aliexpress.com\/shopcart\/shopcartDetail.htm/.test(location.href)) {
		shoppingcart = true;
	}
	function CheckLanguage(lang) {
		switch (lang) {
			case 'en':
			break;
			case 'ru':
			break;
			default: {
				lang = 'en';
			}
		}
		return lang;
	}
	var Language = GM_config.getValue('Language', CheckLanguage(navigator.language.slice(0,2)));
	var dictionary = {};
	var fields = {};
	function ChangeLanguage() {
		switch (Language) {
			case 'ru':
				dictionary = {
					Settings: 'Настройки',
					title: 'Настройки редактора корзины Aliexpress',
					ChooseLanguage: 'Выберете язык',
					SaveButton: 'Сохранить',
					CloseButton: 'Закрыть',
					OKButton: 'Ок',
					CancelButton: 'Отмена',
					SelectAllButton: 'Выделить все',
					DeSelectAllButton: 'Снять выделение',
					RemoveSelected: 'Удалить выделеное',
					RestoreLabel: 'Восстановить стандартные настройки',
					DonateLabel: 'Пожертвовать',
					DonateCopy: 'Скопировать',
					DonateCopied: 'Скопировано!',
					CashbackLabel: 'Разрешить автору этого скрипта получать ваш кэшбэк',
					CashbackButton: 'Создайте свой кэшбэк аккаунт',
				};
			break;
			default:
				dictionary = {
					Settings: 'Settings',
					title: 'Aliexpress Shopping Card Editor Settings',
					ChooseLanguage: 'Choose Language',
					SaveButton: 'Save',
					CloseButton: 'Close',
					OKButton: 'OK',
					CancelButton: 'Cancel',
					SelectAllButton: 'Select All',
					DeSelectAllButton: 'Deselect All',
					RemoveSelected: 'Remove Selected',
					RestoreLabel: 'Restore default settings',
					DonateLabel: 'Donate',
					DonateCopy: 'Copy',
					DonateCopied: 'Copied!',
					CashbackLabel: 'Allow the author of this script to receive your cashback',
					CashbackButton: 'Create your cashback account',
				};
		}
		fields = {
			'Language': {
				'label': dictionary.ChooseLanguage,
				'type': 'select',
				'options': ['en', 'ru'],
				'save': false
			},
			'DonateLabel': {
				'label': dictionary.DonateLabel,
				'type': 'select',
				'options': ['WMB: B117755765458', 'WMR: R335930872834', 'WME: E178919901149', 'WMX: X280601043398', 'BTC: 1J7J5k9FfV9SVPkPkDZ1dgEtmmDKgrBJ7o'],
				'default': 'WMB: B117755765458',
				'save': false
			},
			'DonateCopy': {
				'label': dictionary.DonateCopy,
				'type': 'button',
				'click': function() {
					GM_setClipboard(GM_config.fields.DonateLabel.toValue().slice(5), 'text');
					alert(dictionary.DonateCopied);
				},
				'save': false
			},
			'CashbackCheckbox': {
				'label': dictionary.CashbackLabel,
				'type': 'checkbox',
				'save': false
			},'CashbackButton': {
				'label': dictionary.CashbackButton,
				'type': 'button',
				'click': function() {
					GM_openInTab('http://epnclick.ru/redirect/cpa/o/p625nuw7cj37ze0ixz5ilhcenq7205a1/', false);
				},
				'save': false
			}
		};
		if (shoppingcart) {
			var change_all_button = document.getElementsByClassName('change-all-button');
			if (change_all_button.length) {
				change_all_button[0].value = dictionary.SelectAllButton;
				change_all_button[1].value = dictionary.DeSelectAllButton;
			} else {
				var SelectAllButton = document.createElement('input');
				SelectAllButton.type = 'button';
				SelectAllButton.className = 'change-all-button';
				SelectAllButton.value = dictionary.SelectAllButton;
				SelectAllButton.onclick = function() {
					change_all(true);
				};
				var DeSelectAllButton = document.createElement('input');
				DeSelectAllButton.type = 'button';
				DeSelectAllButton.className = 'change-all-button';
				DeSelectAllButton.value = dictionary.DeSelectAllButton;
				DeSelectAllButton.onclick = function() {
					change_all(false);
				};
				var bp_banner_new = document.getElementsByClassName('bp-banner-new')[0];
				bp_banner_new.appendChild(SelectAllButton);
				bp_banner_new.appendChild(DeSelectAllButton);
			}
			document.getElementsByClassName('bottom-info-left')[0].getElementsByTagName('form')[0].getElementsByTagName('a')[0].textContent = dictionary.RemoveSelected;
		}
	}
	ChangeLanguage();
	var field_Language = [];
	GM_config.init({
		'id': 'AliexpressEditorConfig',
		'title': dictionary.title,
		'fields': fields,
		'events': {
			'init': function() {
				GM_config.fields.Language.value = Language;
				GM_config.fields.CashbackCheckbox.value = cashback;
			},
			'open': function(doc) {
				var config = this;
				doc.getElementById(config.id + '_saveBtn').textContent = dictionary.SaveButton;
				doc.getElementById(config.id + '_closeBtn').textContent = dictionary.CloseButton;
				doc.getElementById(config.id + '_resetLink').textContent = dictionary.RestoreLabel;
				field_Language = doc.getElementById(config.id + '_field_Language');
			},
			'save': function(values) {
				for (var id in values) {
					switch (id) {
						case 'Language':
							if (values[id] !== Language) {
								Language = values[id];
								ChangeLanguage();
								GM_config.fields.Language.value = Language;
								GM_config.init({
									'id': 'AliexpressEditorConfig',
									'title': dictionary.title,
									'fields': fields
								});
								GM_config.close();
								GM_config.open();
								GM_config.setValue('Language', Language);
							}
						break;
						case 'CashbackCheckbox':
							if (values[id] !== cashback) {
								cashback = values[id];
								GM_config.fields.CashbackCheckbox.value = cashback;
								GM_config.setValue('cashback', cashback);
								if (cashback && !cookie) {
									location.href = 'http://shopeasy.by/redirect/cpa/o/o8barzkbzmcxdmf3n4as8uo2sv1uypnl/?to=' + encodeURIComponent(location.href);
								}
							}
						break;
					}
				}
			},
			'reset': function() {
				Language = CheckLanguage(navigator.language.slice(0,2));
				field_Language.value = Language;
			}
		}
	});
	var MenuCommand = GM_registerMenuCommand(dictionary.Settings, function() {
		GM_config.open();
	});
	Node.prototype.insertAfter = function (refElem) {
		return refElem.parentNode.insertBefore(this, refElem.nextSibling);
	};
	function checkbox() {
		var checked = 0;
		var new_price = 0.0;
		var new_ship_price = 0.0;
		var new_total_price = 0.0;
		var new_bigsale_price = 0.0;
		var new_allproductids = '';
		var new_availableProductShopcartIds = '';
		var new_action = action.substr(0,action.indexOf('availableProductShopcartIds=') + 28);
		var checkbox_arr = document.getElementsByClassName('product-checkbox-checkbox');
		for (var i = 0; i < checkbox_arr.length; i++) {
			if (checkbox_arr[i].checked) {
				checked++;
				new_price += price[i];
				new_ship_price += ship_price[i];
				new_total_price += total_price[i];
				if (bigsale_price_enabled) {
					new_bigsale_price += bigsale_price[i];
				}
				new_allproductids += allproductids[i] + ',';
				new_availableProductShopcartIds += AllAvailableProductShopcartIds[i];
			}
		}
		if (action.length !== action.indexOf('&', action.indexOf('availableProductShopcartIds=') + 28) + 1) {
			new_action += new_availableProductShopcartIds + action.slice(action.indexOf('&', action.indexOf('availableProductShopcartIds=') + 28), -1);
		}
		document.getElementsByName('allProductShopcartIDs')[0].setAttribute('value',new_availableProductShopcartIds);
		form.setAttribute('allproductids',new_allproductids);
		form.setAttribute('action',new_action);
		var default_price = document.getElementsByClassName('default-price');
		default_price[0].textContent = accounting.formatMoney(new_price, price_sign);
		default_price[1].textContent = accounting.formatMoney(new_ship_price, price_sign);
		document.getElementsByClassName('total-price ui-cost')[0].getElementsByTagName('b')[0].textContent = accounting.formatMoney(new_total_price, price_sign);
		var bottom_info_right = document.getElementsByClassName('bottom-info-right-wrapper')[0].getElementsByTagName('li')[0];
		bottom_info_right.innerHTML = amount_sign.replace('amount', checked) + bottom_info_right.innerHTML.slice(bottom_info_right.innerHTML.indexOf(':'));
		if (bigsale_price_enabled) {
			document.getElementsByClassName('default-price')[2].textContent = accounting.formatMoney(new_bigsale_price + new_ship_price, price_sign);
		}
		if (multi_price_enabled) {
			var multi_price = document.getElementsByClassName('total-price-multi')[0];
			var multi_price_text = multi_price.textContent.replace(/[0-9]/gim,'num');
			multi_price_text = multi_price_text.slice(0,multi_price_text.indexOf('num')) + multi_price_text.slice(multi_price_text.lastIndexOf('num'));
			multi_price.textContent = multi_price_text.replace('num', 	accounting.format(fx.convert(new_total_price), multi_price_sign));
			if (bigsale_price_enabled) {
				bigsale_multi_price.textContent = multi_price_text.replace('num', 	accounting.format(fx.convert(new_bigsale_price + new_ship_price), multi_price_sign));
			}
		}
	}
	function change_all(check_state){
		var checkbox_arr = document.getElementsByClassName('product-checkbox-checkbox');
		for (var i = 0; i < c_amount; i++) {
			checkbox_arr[i].checked = check_state;
		}
		checkbox();
	}
	if (shoppingcart) {
		var currency = document.getElementsByClassName('currency')[0].textContent;
		var multi_price_enabled = false;
		var price_sign = {};
		var multi_price_sign = {};
		switch (currency) {
			case 'RUB':
				price_sign = {symbol : " руб.",	decimal : ",",	thousand: " ",	precision : 2,	format: "%v%s"};
			break;
			case 'GBP':
				price_sign = {symbol : "￡",	decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
			break;
			case 'BRL':
				price_sign = {symbol : "US $",	decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
				multi_price_enabled = true;
				fx.settings = { from: "USD", to: currency };
				multi_price_sign = {decimal : ",",	thousand: ".",	precision : 2,	format: "%s%v"};
			break;
			case 'CAD':
				price_sign = {symbol : "C$ ",	decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
			break;
			case 'AUD':
				price_sign = {symbol : "AU $",	decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
			break;
			case 'EUR':
				price_sign = {symbol : "€ ",	decimal : ",",	thousand: ".",	precision : 2,	format: "%s%v"};
			break;
			case 'INR':
				price_sign = {symbol : "US $",	decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
				multi_price_enabled = true;
				fx.settings = { from: "USD", to: currency };
				multi_price_sign = {decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
			break;
			case 'UAH':
				price_sign = {symbol : "US $",	decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
				multi_price_enabled = true;
				fx.settings = { from: "USD", to: currency };
				multi_price_sign = {decimal : ",",	thousand: " ",	precision : 2,	format: "%v%s"};
			break;
			case 'JPY':
				price_sign = {symbol : "¥ ",	decimal : "",	thousand: ",",	precision : 0,	format: "%s%v"};
			break;
			case 'MXN':
				price_sign = {symbol : " MXN$",	decimal : ".",	thousand: ",",	precision : 2,	format: "%v%s"};
			break;
			case 'IDR':
				price_sign = {symbol : "US $",	decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
				multi_price_enabled = true;
				fx.settings = { from: "USD", to: currency };
				multi_price_sign = {decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
			break;
			case 'TRY':
				price_sign = {symbol : "US $",	decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
				multi_price_enabled = true;
				fx.settings = { from: "USD", to: currency };
				multi_price_sign = {decimal : ".",	thousand: ",",	precision : 2,	format: "%v%s"};
			break;
			case 'SEK':
				price_sign = {symbol : "SEK ",	decimal : ",",	thousand: " ",	precision : 2,	format: "%s%v"};
			break;
			case 'CLP':
				price_sign = {symbol : "US $",	decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
				multi_price_enabled = true;
				fx.settings = { from: "USD", to: currency };
				multi_price_sign = {decimal : "",	thousand: ",",	precision : 0,	format: "%s%v"};
			break;
			case 'KRW':
				price_sign = {symbol : "₩ ", decimal : "",	thousand: ",",	precision : 0,	format: "%s%v"};
			break;
			case 'SGD':
				price_sign = {symbol : "SG$ ",	decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
			break;
			case 'NZD':
				price_sign = {symbol : "NZ$ ",	decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
			break;
			case 'CHF':
				price_sign = {symbol : "CHF ",	decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
			break;
			case 'PLN':
				price_sign = {symbol : " zł",	decimal : ",",	thousand: " ",	precision : 2,	format: "%v%s"};
			break;
			default:
				price_sign = {symbol : "US $",	decimal : ".",	thousand: ",",	precision : 2,	format: "%s%v"};
		}
		if (multi_price_enabled) {
			fx.base = "USD";
			fx.rates = {"USD" : 1,};
			fx.rates[currency] = accounting.parse(document.getElementsByClassName('total-price-multi')[0].textContent.replace(/[^.,0-9]/gim,''), multi_price_sign.decimal) / accounting.parse(document.getElementsByClassName('total-price ui-cost')[0].getElementsByTagName('b')[0].textContent, price_sign.decimal);
		}
		var bigsale_price_enabled = false;
		var bigsale_price = [];
		if (document.getElementsByClassName('bigsale-content-price').length) {
			bigsale_price_enabled = true;
			var li = document.createElement('li');
			li.textContent = document.getElementsByClassName('bigsale-sale')[0].textContent;
			var default_price = document.createElement('span');
			default_price.className = 'default-price';
			li.appendChild(default_price);
			if (multi_price_enabled) {
				var multi_price = document.getElementsByClassName('total-price-multi')[0];
				var multi_price_text = multi_price.textContent.replace(/[0-9]/gim,'num');
				multi_price_text = multi_price_text.slice(0,multi_price_text.indexOf('num')) + multi_price_text.slice(multi_price_text.lastIndexOf('num'));
				var bigsale_multi_price = document.createElement('div');
				bigsale_multi_price.className = 'bigsale-price-multi';
				li.appendChild(bigsale_multi_price);
			}
			document.getElementsByClassName('bottom-info-right-wrapper')[0].getElementsByTagName('ul')[0].appendChild(li);
		}
		var AllAvailableProductShopcartIds = [];
		for (var i = 0, item_gropup_wrapper = Array.from(document.getElementsByClassName('item-group-wrapper')), group_length = item_gropup_wrapper.length; i < group_length; i++) {
			var item_product = Array.from(item_gropup_wrapper[i].getElementsByTagName('tbody')[0].getElementsByClassName('item-product'));
			if (item_product.length > 1) {
				var href = item_gropup_wrapper[i].getElementsByClassName('ui-button ui-button-primary ui-button-medium product-buy-only')[0].getAttribute('href');
				var availableProductShopcartIds = href.slice(href.indexOf('availableProductShopcartIds=') + 28, -1).split(',');
				for (var x = 0; x < availableProductShopcartIds.length; x++) {
					availableProductShopcartIds[x] += ',';
				}
				AllAvailableProductShopcartIds = AllAvailableProductShopcartIds.concat(availableProductShopcartIds);
				href = href.slice(0, href.indexOf('availableProductShopcartIds=') + 28);
				for (var j = 0; j < item_product.length; j++) {
					item_product[j].remove();
				}
				for (var j = item_product.length - 1; j > 0; j--) {
					var copy = item_gropup_wrapper[i].cloneNode(true);
					var tbody = copy.getElementsByTagName('tbody')[0];
					tbody.appendChild(item_product[j]);
					var item_product_value = copy.getElementsByClassName('value');
					var price = accounting.parse(item_product_value[0].innerHTML, price_sign.decimal) * parseInt(copy.getElementsByClassName('product-quantity-input ui-textfield ui-textfield-system ')[0].getAttribute('value'));
					var ship_price = 0.0;
					if (item_product_value.length === 3) {
						item_product_value[1].innerHTML = accounting.formatMoney(price, price_sign);
						item_product_value[2].innerHTML = accounting.formatMoney(ship_price, price_sign);
					} else {
						ship_price = accounting.parse(item_product_value[1].innerHTML, price_sign.decimal);
						item_product_value[2].innerHTML = accounting.formatMoney(price, price_sign);
						item_product_value[3].innerHTML = accounting.formatMoney(ship_price, price_sign);
					}
					copy.getElementsByClassName('ui-button ui-button-primary ui-button-medium product-buy-only')[0].setAttribute('href', href + availableProductShopcartIds[j]);
					copy.getElementsByClassName('product-price-total ui-cost')[0].getElementsByTagName('b')[0].textContent = accounting.formatMoney(price + ship_price, price_sign);
					if (multi_price_enabled) {
						var multi_price = copy.getElementsByClassName('product-price-title-multi')[0];
						var multi_price_text = multi_price.textContent.replace(/[0-9]/gim,'num');
						multi_price_text = multi_price_text.slice(0,multi_price_text.indexOf('num')) + multi_price_text.slice(multi_price_text.lastIndexOf('num'));
						multi_price.textContent = multi_price_text.replace('num', accounting.format(fx.convert(price + ship_price), multi_price_sign));
					}
					copy.insertAfter(item_gropup_wrapper[i]);
				}
				item_gropup_wrapper[i].getElementsByTagName('tbody')[0].appendChild(item_product[0]);
				var item_product_value = item_gropup_wrapper[i].getElementsByClassName('value');
				var price = accounting.parse(item_product_value[0].innerHTML, price_sign.decimal) * parseInt(item_product[0].parentNode.getElementsByClassName('product-quantity-input ui-textfield ui-textfield-system ')[0].getAttribute('value'));
				var ship_price = 0.0;
				if (item_product_value.length === 3) {
					item_product_value[1].innerHTML = accounting.formatMoney(price, price_sign);
					item_product_value[2].innerHTML = accounting.formatMoney(ship_price, price_sign);
				} else {
					ship_price = accounting.parse(item_product_value[1].innerHTML, price_sign.decimal);
					item_product_value[2].innerHTML = accounting.formatMoney(price, price_sign);
					item_product_value[3].innerHTML = accounting.formatMoney(ship_price, price_sign);
				}
				item_gropup_wrapper[i].getElementsByClassName('product-price-total ui-cost')[0].getElementsByTagName('b')[0].textContent = accounting.formatMoney(price + ship_price, price_sign);
				if (multi_price_enabled) {
					var multi_price = item_gropup_wrapper[i].getElementsByClassName('product-price-title-multi')[0];
					var multi_price_text = multi_price.textContent.replace(/[0-9]/gim,'num');
					multi_price_text = multi_price_text.slice(0,multi_price_text.indexOf('num')) + multi_price_text.slice(multi_price_text.lastIndexOf('num'));
					multi_price.textContent = multi_price_text.replace('num', accounting.format(fx.convert(price + ship_price), multi_price_sign));
				}
				item_gropup_wrapper[i].getElementsByClassName('ui-button ui-button-primary ui-button-medium product-buy-only')[0].setAttribute('href', href + availableProductShopcartIds[0] + ',');
			} else {
				var href = item_gropup_wrapper[i].getElementsByClassName('ui-button ui-button-primary ui-button-medium product-buy-only')[0].getAttribute('href');
				AllAvailableProductShopcartIds.push(href.slice(href.indexOf('availableProductShopcartIds=') + 28));
			}
		}
		var list = document.getElementsByClassName('item-group');
		var c_amount = list.length;
		var price = [];
		var ship_price = [];
		var total_price = [];
		var bottom_info_right = document.getElementsByClassName('bottom-info-right-wrapper')[0].getElementsByTagName('li')[0];
		var amount_sign = bottom_info_right.innerHTML.slice(0, bottom_info_right.innerHTML.indexOf(':')).replace(c_amount.toString(), 'amount');
		var bottom_info_right = document.getElementsByClassName('bottom-info-right-wrapper')[0];
		for (var i = 0; i < c_amount; i++) {
			var price_info = list[i].getElementsByClassName('product-price-info-wrapper')[0];
			price.push(accounting.parse(price_info.getElementsByClassName('value')[0].textContent, price_sign.decimal));
			ship_price.push(accounting.parse(price_info.getElementsByClassName('value')[1].textContent, price_sign.decimal));
			total_price.push(accounting.parse(price_info.getElementsByTagName('b')[0].textContent, price_sign.decimal));
			var newElement = document.createElement('dt');
			newElement.className = 'product-checkbox';
			newElement.innerHTML = '<input type="checkbox" class="product-checkbox-checkbox">';
			newElement.onchange = checkbox;
			list[i].getElementsByTagName('dl')[0].insertBefore(newElement, list[i].getElementsByClassName('product-pic')[0]);
		}
		if (bigsale_price_enabled) {
			for (var i = 0, item_gropup_wrapper = document.getElementsByClassName('item-group-wrapper'); i < item_gropup_wrapper.length; i++) {
				var bigsale_content_price = item_gropup_wrapper[i].getElementsByClassName('bigsale-content-price');
				if (bigsale_content_price.length) {
					bigsale_price.push(accounting.parse(bigsale_content_price[0].textContent, price_sign.decimal) * parseInt(item_gropup_wrapper[i].getElementsByClassName('product-quantity-input ui-textfield ui-textfield-system ')[0].getAttribute('value')));
				} else {
					bigsale_price.push(price[i]);
				}
			}
		}
		var form = bottom_info_right.getElementsByTagName('form')[0];
		var allproductids = form.getAttribute('allproductids').slice(0,-1).split(',');
		var action = form.getAttribute('action');
		change_all(false);
	}
})();