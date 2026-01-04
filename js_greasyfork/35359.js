// ==UserScript==
// @name          Amazon a Pesos Argentos
// @version       1.4.0
// @author        DSR!
// @namespace     dsr-amazon-pesos-argentos
// @description   Mostrar precios en pesos argentinos y comparador de precios con MercadoLibre y otras tiendas de amazon
// @grant         GM_xmlhttpRequest
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js#sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=
// @require       https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js#sha256-iaqfO5ue0VbSGcEiQn+OeXxnxAMK2+QgHXIDA5bWtGI=
// @include       *amazon.com/*
// @include       *amazon.co.uk/*
// @include       *amazon.ca/*
// @include       *amazon.es/*
// @include       *amazon.de/*
// @include       *amazon.fr/*
// @include       *amazon.it/*
// @connect       amazon.com
// @connect       amazon.co.uk
// @connect       amazon.ca
// @connect       amazon.es
// @connect       amazon.de
// @connect       amazon.fr
// @connect       amazon.it
// @connect       geeklab.com.ar
// @connect       europa.eu
// @connect       mercadolibre.com
// @run-at        document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/35359/Amazon%20a%20Pesos%20Argentos.user.js
// @updateURL https://update.greasyfork.org/scripts/35359/Amazon%20a%20Pesos%20Argentos.meta.js
// ==/UserScript==

var BANNER = "[ARG-LOG]";
var LAST_RUN = "last_run_";
var CURRENCY_RATE = "currency_rate_";
var CURRENCY_RATE_EUR = "currency_rate_eur_";
var decimalPlaces = 2;
var prefixCurrencySymbol = true;
var taxPorcentage = 0; //3.6; //no se de donde es esto
var currencyToSymbol = 'ARS&nbsp;$';

// estos shims son de https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js
function GM_addStyle(aCss) {
	'use strict';
	let head = document.getElementsByTagName('head')[0];
	if (head) {
		let style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		style.textContent = aCss;
		head.appendChild(style);
		return style;
	}
	return null;
}

function GM_getValue(aKey, aDefault) {
	'use strict';
	let val = localStorage.getItem('dsr-amazon-pesos-argentos_config' + aKey)
	if (null === val && 'undefined' != typeof aDefault) return aDefault;
	return val;
}

function GM_setValue(aKey, aVal) {
	'use strict';
	localStorage.setItem('dsr-amazon-pesos-argentos_config' + aKey, aVal);
}



// bloque principal
(function() {
	if (typeof jQuery === 'undefined') {
		console.log(BANNER, 'jQuery === undefined');
		return;
	}

	/*
	if (jQuery('#dsr-amazon-pesos-argentos-start-flag')) {
		console.log(BANNER, 'Already start', jQuery('#dsr-amazon-pesos-argentos-start-flag'));
		return;
	}
	*/

	console.log(BANNER, 'principal');

	//jQuery('body').append('<input id="dsr-amazon-pesos-argentos-start-flag" type="hidden">');
	
	GM_addStyle('.price-ars{color:green;display:inline-block;margin:0 8px;background:linear-gradient(to bottom,#add8e6,#fff,#add8e6);border-radius:8px;padding:0 6px}'+
			'#sc-buy-box .price-ars{font-size:12px;display:block;padding:0;margin:0;background:0 0}div#sc-buy-box{margin-bottom:-14px}#orderDetails{width: 1200px;}#od-subtotals{width: 350px!important;margin-right:-350px!important;}');
	GM_addStyle('#snoop-icon{margin-left:4px;width:30px;height:20px}#snoop-placeholder{width:32px}div.snoop-loader{width:13px;height:13px}div.snoop-tooltip,div.snoop-tooltip-ml{display:none;font-size:13px;border-image:none;letter-spacing:0}'+
			'div.snoop-tooltip div.entry,div.snoop-tooltip-ml div.entry{padding-top:5px}span.snoop-price{color:#900;font-size:1em;font-weight:700}span.snoop-warning{color:#C60!important}.snoop-not-found{text-decoration:line-through}'+
			'span.snoop-on{color:#000;font-weight:400}span.back-link{line-height:0;margin-left:1px;top:-10px;position:relative}'+
			'span.back-link>img{top:1;position:relative}span.back-link>a{font-size:1em;text-decoration:none!important}#snoop-icon-ml{margin-left:10px}');
	GM_addStyle('#pesos-carrito-html{width:400px;min-height:34px;margin:0 auto;left:calc(80% - 200px);top:150px;background:white;position: fixed;z-index:1000000;padding:20px;border:1px solid black;border-radius:8px;box-shadow: 0px 0px 40px black;}#pesos-carrito-html .price-ars{text-align: right; margin: 0;}');

  
	var domainData = {
		com: {
			withVAT: false,
			vat: 0,
			symbol: "$",
			priceRegex: /\$\s*([\d,.]+\d)/,
			currencyFrom: "USD"
		},
		ca: {
			withVAT: false,
			vat: 0,
			symbol: "CDN$ ",
			priceRegex: /CDN\$\s*([\d,.]+\d)/,
			currencyFrom: "CAD"
		},
		uk: {
			withVAT: true,
			vat: 1.20,
			symbol: "£",
			priceRegex: /£\s*([\d,.]+\d)/,
			currencyFrom: "GBP"
		},
		es: {
			withVAT: true,
			vat: 1.21,
			symbol: "EUR ",
			priceRegex: /EUR\s*([\s\d,.]+\d)/,
			currencyFrom: "EUR"
		},
		de: {
			withVAT: true,
			vat: 1.19,
			symbol: "EUR ",
			priceRegex: /EUR\s*([\s\d,.]+\d)/,
			currencyFrom: "EUR"
		},
		fr: {
			withVAT: true,
			vat: 1.20,
			symbol: "EUR ",
			priceRegex: /EUR\s*([\s\d,.]+\d)/,
			currencyFrom: "EUR"
		},
		it: {
			withVAT: true,
			vat: 1.22,
			symbol: "EUR ",
			priceRegex: /EUR\s*([\s\d,.]+\d)/,
			currencyFrom: "EUR"
		},
		parseLinks: GM_getValue('parseLinks', true)
	};

	var domain = document.domain.substr(document.domain.lastIndexOf('.') + 1);
	var rounding = Math.pow(10, decimalPlaces);
	var rate = GM_getValue(CURRENCY_RATE + domainData[domain].currencyFrom);
	var lastRun = GM_getValue(LAST_RUN, false);
	var showVAT = GM_getValue('show_vat', true);


	function regularPriceParser(price, currency) {
		price = price.replace(/\s/g, '');
		var regex = /^[\d.]+,[\d]{2}$/;
		var needProperPrice = regex.exec(price);
		if (needProperPrice) {
			price = price.replace(/\./g, '').replace(/,/, '.');
		} else {
			price = price.replace(/\,/g, '');
		}
		return parseFloat(price);
	}

	function fetchCurrencyData(callback) {
		jQuery.getJSON(
			"https://dolarapi.com/v1/dolares/oficial"
		).done(
			function(data) {
				console.log(BANNER, data);
				GM_setValue(CURRENCY_RATE + 'USD', data.venta);

				callback();
			}
		);
	}

	function appendConversionNoVAT(price, matched, offset, string) {
		return appendConversion(price, matched, offset, string, true);
	}

	function appendConversion(price, matched, offset, string, novat, customvat) {
		var originalPrice = regularPriceParser(matched, domainData[domain].currencyFrom);
		if (isNaN(originalPrice)) {
			return price;
		}
		if (novat !== true) {
			if (customvat > 1) {
				originalPrice /= customvat;
			} else if (customvat === undefined && domainData[domain].withVAT) {
				originalPrice /= domainData[domain].vat;
			}
		}

		if (isNaN(rate)) {
			rate = GM_getValue(CURRENCY_RATE + domainData[domain].currencyFrom);
			console('fix?', rate);
		}

		var converted = formatCurrency(originalPrice * (rate * (taxPorcentage / 100 + 1)), rounding, currencyToSymbol, prefixCurrencySymbol);
		if (showVAT && novat !== true && (customvat > 1 || (customvat === undefined && domainData[domain].withVAT))) {
			originalPrice = formatCurrency(originalPrice, rounding, domainData[domain].symbol, prefixCurrencySymbol);
			return '<span title="Original: ' + price + (customvat > 1 ? ' - VAT: ' + Math.round((customvat - 1) * 100) + '%' : '') + '">' + originalPrice + '<div class="price-ars">' + converted + '</div></span>';
		} else {
			return price + '<div class="price-ars">' + converted + '</div>';
		}
	}

	function formatCurrency(num, rounding, symbol, prefix) {
		sign = (num == (num = Math.abs(num)));
		num = Math.floor(num * rounding + 0.50000000001);
		cents = num % rounding;
		num = Math.floor(num / rounding).toString();
		if (cents < 10) {
			cents = "0" + cents;
		}
		for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
			num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
		}
		if (prefix) {
			return (symbol + ((sign) ? '' : '-') + num + '.' + cents);
		} else {
			return (((sign) ? '' : '-') + num + '.' + cents + symbol);
		}
	}
	convertCurrency = function(carrito, vat) {
		switch (carrito) {
			case 1:
				if (jQuery('.a-size-base.a-text-bold:contains(Order summary)').length === 0 && 
					jQuery('.a-size-base.a-text-bold:contains(Récapitulatif de commande)').length === 0 && 
					jQuery('.a-size-base.a-text-bold:contains(Riepilogo ordine)').length === 0 && 
					jQuery('.a-size-base.a-text-bold:contains(Resumen del pedido)').length === 0 && 
					jQuery('.a-size-base.a-text-bold:contains(Zusammenfassung der Bestellung)').length === 0 && 
					jQuery('.ap_popover.ap_popover_sprited.snoop-tooltip').length === 0) {
					return false;
				} else {
					if (jQuery('#sc-buy-box.price-ars-cart').length === 0) {
						jQuery('#sc-buy-box').addClass('price-ars-cart');
					} else {
						return false;
					}
				}
				break;
			case 2:
				if (jQuery('.entry.snoop-price:not(.snoop-warning):not(.price-ars-cart)').length === 0) {
					return false;
				}
				break;
			default:
				break;
		}
		
		console.log(BANNER, 'Cambiando precios', carrito);
		jQuery('.a-column.a-span3.a-text-right.a-span-last.sc-value').removeClass('a-span3').addClass('a-span4');
		jQuery('.a-column.a-span9.sc-text').removeClass('a-span9').addClass('a-span8');
		jQuery('a.a-popover-trigger.a-declarative:contains(Estimated)').html('Shipping & handling <i class="a-icon a-icon-popover"></i>');
		if (carrito == 2) {
			jQuery('.entry.snoop-price:not(.snoop-warning)').each(function() {
				var text = jQuery(this).text();
				if (jQuery(this).children().length === 0 && text.indexOf(domainData[domain].symbol) != -1 && text.indexOf('ARS') == -1) {
					jQuery(this).addClass('price-ars-cart').html(text.replace(domainData[domain].priceRegex, appendConversion));
				}
			});
		} else {
			jQuery('span:not(:has(*))').each(function(){
				var parent = false;
				var text = jQuery(this).text();
				if( jQuery(this).hasClass('a-price-symbol') ){
					parent = true;
					text = jQuery(this).parent().text();
				}
				if( jQuery(this).children().length === 0 && domainData[domain].priceRegex.test(text) && text.indexOf('ARS') == -1){
					if( jQuery(this).parents('#sc-buy-box').length == 1 ||
					   jQuery(this).parents('#pesos-carrito-html').length == 1 ||
					   window.location.href.indexOf("/gp/css/summary/") > -1 ||
					   window.location.href.indexOf("/order-details") > -1 ||
					   window.location.href.indexOf("/order-history") > -1 ||
					   window.location.href.indexOf("/shipoptionselect/") > -1
					  ){
						if(parent){
							jQuery(this).closest('.a-price').html( text.replace(domainData[domain].priceRegex, appendConversionNoVAT) );
						}else{
							jQuery(this).html( text.replace(domainData[domain].priceRegex, appendConversionNoVAT) );
						}
					}else{
						var customVAT = function(price, matched, offset, string){
							return appendConversion(price, matched, offset, string, false, vat);
						};
						if(parent){
							jQuery(this).closest('.a-price').html( text.replace(domainData[domain].priceRegex, customVAT) );
						}else{
							jQuery(this).html( text.replace(domainData[domain].priceRegex, customVAT) );
						}
					}
				}
			});
		}
	};

	function parseLinks() {
		jQuery('head').append('<meta name="referrer" content="no-referrer">');
		jQuery('a[href*="/dp/"]:not([href*="?tag="])').each(function(i, item) {
			jQuery(item).attr('href', jQuery(item).attr('href').replace('?', '?tag=' + domainData[domain].tag + '&'));
		});
	}

	var running_convert_1 = false;
	var running_convert_2 = false;
	jQuery(document).ready(function() {
		console.log(BANNER, 'onReady');
		// como no uso lo de los referidos esto no va
		//jQuery('#nav-tools').prepend('<a href="javascript:void(0)" id="pesos-config" class="nav-a nav-a-2 nav-truncate"><span class="nav-line-1">Configurar Script</span><span class="nav-line-2"><img src="https://i.imgur.com/qa5ZXdT.png" width="95"></span></a>');
		//if (domainData.parseLinks) {
		//	parseLinks();
		//}

		var ageInHours = lastRun ? (new Date() - new Date(lastRun)) / 1000 / 60 / 60 : false;
		if (isNaN(rate) || ageInHours === false || ageInHours > 3) {
			console.log(BANNER, 'Refreshing conversion rates...', ageInHours);
			fetchCurrencyData(function () {
				refreshRates(function () {
					lastRun = new Date().toISOString();
					GM_setValue(LAST_RUN, lastRun);
					convertCurrency();
				});
			});
		} else {
			console.log(BANNER, 'Currency rate from cache: ', rate, ' LastRun:', lastRun);
			convertCurrency();
		}

		// esto vino del 5.1
		jQuery('#pesos-carrito').click(function(){
			jQuery('body').append('<div id="pesos-carrito-html"><img src="https://i.imgur.com/Dp92MjH.gif" /> Cargando...</div>');
				P.when("LUXController").execute(function(LUXController){
					var addressId = LUXController.getLocationData().obfuscatedId;
					if(addressId !== undefined){
						//GM_setClipboard(addressId+(16*8),"text");
						console.log(BANNER, addressId);
						$.get("/gp/cart/view.html/ref=nav_cart", function(){
							$.getJSON("/gp/cart/ajax-load-flc.html/ref=flc-for-enable-flc",{addressId: addressId, flcExpanded: 1}, function(result){
								var cartTotal = jQuery(result.features["buy-box"].featurehtml).find('#a-popover-vat_breakdown,.sc-subtotal-detail');
								jQuery('#pesos-carrito-html').html(cartTotal.html());
								jQuery('#pesos-carrito-html span').removeClass("a-nowrap");
								jQuery('#pesos-carrito-html span.sc-importfee').addClass("a-spacing-small");
								convertCurrency();
							});
						});
					}
			});
		});

		jQuery('.a-fixed-right-grid-col.a-col-right').bind("DOMSubtreeModified", function(e) {
			if (running_convert_1 === false) {
				console.log(BANNER, 'Auto 1');
				running_convert_1 = true;
				setTimeout(function() {
					convertCurrency(1);
					running_convert_1 = false;
				}, 1000);
			}
		});

		// este es el contenedor donde se ve el precio del producto
		jQuery('#priceblock_ourprice').bind("DOMSubtreeModified", function(e) {
			if (running_convert_2 === false) {
				console.log(BANNER, 'Auto 2');
				running_convert_2 = true;
				setTimeout(function() {
					convertCurrency(2);
					running_convert_2 = false;
				}, 1000);
			}
		});

		var asin = jQuery('#ASIN').val();
		if (asin === undefined) {
			return;
		}

		snoop.initialize(asin, domainData, domain);
	});
})();



// helpers

/**
 * Brief: jQuery.get-like cross-domain GET using GM_xmlhttpRequest
 * @param {string} url - Resource URL
 * @returns {{ done: function(Function):this, fail: function(Function):this }}
 */
function gmGet(url) {
  const cbs = { done: [], fail: [] };
  GM_xmlhttpRequest({
    method: 'GET',
    url,
    onload(response) {
      if (response.status >= 200 && response.status < 300) {
        // pass responseText and full response
        cbs.done.forEach(cb => cb(response.responseText, response));
      } else {
        cbs.fail.forEach(cb => cb(response, response.status, response.statusText));
      }
    },
    onerror(response) {
      cbs.fail.forEach(cb => cb(response, response.status, response.statusText));
    }
  });
  return {
    done(cb) { cbs.done.push(cb); return this; },
    fail(cb) { cbs.fail.push(cb); return this; }
  };
}



var settings;

function refreshRates(callback) {
	jQuery.get(
		'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml'
	).done(function(data) {
		var $document = jQuery(data);

		// cotizaciones
		var usdToEur = parseFloat($document.find('Cube[currency="USD"]').attr('rate'));
		var gbpToEur = parseFloat($document.find('Cube[currency="GBP"]').attr('rate'));
		GM_setValue(CURRENCY_RATE_EUR + 'USD', usdToEur);
		GM_setValue(CURRENCY_RATE_EUR + 'GBP', gbpToEur);
		GM_setValue(CURRENCY_RATE_EUR + 'EUR', 1);

		var arsToUsd = GM_getValue(CURRENCY_RATE + 'USD');
		var arsToEur = arsToUsd * usdToEur;

		// pesificaciones
		GM_setValue(CURRENCY_RATE + 'GBP', (1 / gbpToEur) * arsToEur);
		GM_setValue(CURRENCY_RATE + 'EUR', arsToEur);

		callback();
	});
}

var Money = function(amount, currency, currency_symbol, extraAmount) {
	this.amount = amount;
	this.extraAmount = extraAmount;
	this.currency = currency;
	this.currency_symbol = currency_symbol;
};

Money.prototype.for = function(currency, currency_symbol) {
	var rate = GM_getValue(CURRENCY_RATE_EUR + this.currency);

	// fix eur to gbp
	if (this.currency === 'EUR' && currency === 'GBP') {
		rate = GM_getValue(CURRENCY_RATE_EUR + 'GBP');
	}

	if (rate === undefined) {
		return this;
	}

	// fix gbp to eur
	if (this.currency === 'GBP' && currency === 'EUR') {
		rate = 1 / rate;
	}

	console.log(BANNER, this.currency, rate, currency);

	var convertedAmount = this.amount * rate;
	var convertedExtraAmount = this.extraAmount !== undefined ? this.extraAmount * rate : undefined;

	return new Money(convertedAmount, currency, currency_symbol, convertedExtraAmount);
};

Money.prototype.toString = function() {
	if (this.extraAmount === undefined){
		return this.currency_symbol + (this.amount.toFixed(2));
	}

    return this.currency_symbol + (this.amount.toFixed(2)) + ' - ' + this.currency_symbol + (this.extraAmount.toFixed(2));
};

Number.prototype.formatMoney = function(c, d, t) {
	var n = this;
	c = isNaN(c = Math.abs(c)) ? 2 : c;
	d = d === undefined ? "." : d;
	t = t === undefined ? "," : t;
	var s = n < 0 ? "-" : "",
		i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;

	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

var Shop = function(id, title, domain, base_url, currency, currency_symbol, vat, seller) {
	this.id = id;
	this.title = title;
	this.domain = domain;
	this.base_url = base_url;
	this.url = this.base_url;
	this.currency = currency;
	this.currency_symbol = currency_symbol;
	this.vat = vat;
	this.seller = seller;
	this.setAsin = function(asin) {
		this.url = this.urlFor(asin);
	};
	this.urlFor = function(asin) {
		return this.base_url.replace('{asin}', asin);
	};
	this.moneyFrom = function(amount) {
		console.log(BANNER, 'moneyfrom()', amount);
		var culture = this.culture;
		if (amount.indexOf('-') == -1) {
			var sanitizedAmount = amount.replace(/[^\d^,^.]/g, '');
			var regex = /^[\d.]+,[\d]{2}$/;
			var needProperPrice = regex.exec(sanitizedAmount);
			if (needProperPrice) {
				sanitizedAmount = sanitizedAmount.replace(/\./g, '').replace(/,/, '.');
			} else {
				sanitizedAmount = sanitizedAmount.replace(/\,/g, '');
			}

			return new Money(sanitizedAmount, this.currency);
		}

		var sanitizedAmounts = amount.split('-').map(function(a) {
			return a.replace(/[^\d^,^.]/g, '');
		});
		return new Money(sanitizedAmounts[0], this.currency, sanitizedAmounts[1]);
	};
};

var Settings = function(asin, domainData, domain) {
	console.log(BANNER, 'Settings()', asin);
	this.asin = asin;
	this.shops = [
        new Shop(1, 'amazon.co.uk', 'www.amazon.co.uk', 'https://www.amazon.co.uk/dp/{asin}?smid=A3P5ROKL5A1OLE', 'GBP', '£', domainData.uk.vat, 'Dispatched from and sold by Amazon|Dispatched and sold by Amazon'),
        new Shop(2, 'amazon.de', 'www.amazon.de', 'https://www.amazon.de/dp/{asin}?smid=A3JWKAKR8XB7XF', 'EUR', 'EUR ', domainData.de.vat, 'Verkauf und Versand durch Amazon|Versandt und verkauft von Amazon|Dispatched from and sold by Amazon|Dispatched and sold by Amazon'),
        new Shop(3, 'amazon.es', 'www.amazon.es', 'https://www.amazon.es/dp/{asin}?smid=A1AT7YVPFBWXBL', 'EUR', 'EUR ', domainData.es.vat, 'Vendido y enviado por Amazon'),
        new Shop(4, 'amazon.fr', 'www.amazon.fr', 'https://www.amazon.fr/dp/{asin}?smid=A1X6FK5RDHNB96', 'EUR', 'EUR ', domainData.fr.vat, 'Expédié et vendu par Amazon'),
        new Shop(5, 'amazon.it', 'www.amazon.it', 'https://www.amazon.it/dp/{asin}?smid=A11IL2PNWYJU7H', 'EUR', 'EUR ', domainData.it.vat, 'Venduto e spedito da Amazon'),
        new Shop(6, 'amazon.com', 'www.amazon.com', 'https://www.amazon.com/dp/{asin}?smid=ATVPDKIKX0DER', 'USD', '$', domainData.com.vat, 'Ships from and sold by Amazon.com'),
        new Shop(7, 'amazon.ca', 'www.amazon.ca', 'https://www.amazon.ca/dp/{asin}?smid=ATVPDKIKX0DER', 'CAD', 'CDN$', domainData.ca.vat, 'Ships from and sold by Amazon.ca')
	];
	this.shops.forEach(function(shop) {
		shop.setAsin(asin);
	});
	this.currentShop = this.shops.filter(function(shop) {
		return shop.domain == document.domain;
	})[0];
	this.desiredCurrency = this.currentShop.currency;
	if (this.currentShop.currency != this.desiredCurrency) {
		this.filteredShops = this.shops;
	} else {
		this.filteredShops = this.shops.filter(function(shop) {
			return shop.domain != document.domain;
		});
	}
	this.shop = function(id) {
		var shopById = this.shops.filter(function(shop) {
			return shop.id == id;
		});
		if (shopById.length == 1) return shopById[0];
		return null;
	};
};

// este es el callback que revisa si encontre el producto en la pagina de otro amazon
var PageScraper = {
	warning: {
		networkError: 'Error al consultar',
		unavailable: 'No disponible',
		wrongSeller: 'No vendido por Amazon',
		notFound: 'No encontrado',
		multipleOptions: 'Opciones multiples'
	},
	getPriceOn: function(shop, displayPriceCB, displayWarningCB) {
		console.log(BANNER, 'PageScraper.getPriceOn()')
		gmGet(
			shop.url
		).done(function(data) {
			var regex = /[nb]\s*?id="priceblock_[\w]*?price".*?>(.*?)</img;
			var price = regex.exec(data);
			if (price === null || price.length != 2) {
				displayWarningCB(PageScraper.warning.unavailable, false);
				return;
			}

			regex = new RegExp(shop.seller);
			var seller = regex.exec(data);
			if (seller === null) {
				displayWarningCB(PageScraper.warning.wrongSeller, false);
				return;
			}

			displayPriceCB(price[1]);
		}).fail(function(jqXHR) {
			if (jqXHR.status == 404) {
				displayWarningCB(PageScraper.warning.notFound, true);
			} else {
				displayWarningCB(PageScraper.warnings.networkError, false);
			}
		});
	}
};

var tooltip = {
	_mouseIsOnIcon: false,
	_mouseIsOnTooltip: false,
	registerShowHideHandlers: function() {
		this._genericRegisterShowHideHandlers(jQuery('.snoop-tooltip'), function(on) {
			tooltip._mouseIsOnTooltip = on;
		});
		this._genericRegisterShowHideHandlers(jQuery('#snoop-icon'), function(on) {
			tooltip._mouseIsOnIcon = on;
		});
	},
	_genericRegisterShowHideHandlers: function($selector, isOn) {
		$selector.mouseenter(function() {
			jQuery('.snoop-tooltip').show();
			isOn(true);
		}).mouseleave(function() {
			isOn(false);
			setTimeout(function() {
				if (!tooltip._mouseIsOnIcon && !tooltip._mouseIsOnTooltip) jQuery('.snoop-tooltip').hide();
			}, 100);
		});
	}
};

var tooltipML = {
	_mouseIsOnIcon: false,
	_mouseIsOnTooltip: false,
	registerShowHideHandlers: function() {
		this._genericRegisterShowHideHandlers(jQuery('.snoop-tooltip-ml'), function(on) {
			tooltipML._mouseIsOnTooltip = on;
		});
		this._genericRegisterShowHideHandlers(jQuery('#snoop-icon-ml'), function(on) {
			tooltipML._mouseIsOnIcon = on;
		});
	},
	_genericRegisterShowHideHandlers: function($selector, isOn) {
		$selector.mouseenter(function() {
			jQuery('.snoop-tooltip-ml').show();
			isOn(true);
		}).mouseleave(function() {
			isOn(false);
			setTimeout(function() {
				if (!tooltipML._mouseIsOnIcon && !tooltipML._mouseIsOnTooltip) jQuery('.snoop-tooltip-ml').hide();
			}, 100);
		});
	}
};

var tooltipSettings = {
	_mouseIsOnIcon: false,
	_mouseIsOnTooltip: false,
	registerShowHideHandlers: function() {
		this._hookSettings();
		this._genericRegisterShowHideHandlers(jQuery('.snoop-tooltip-settings'), function(on) {
			tooltipSettings._mouseIsOnTooltip = on;
		});
		this._genericRegisterShowHideHandlers(jQuery('#pesos-config'), function(on) {
			tooltipSettings._mouseIsOnIcon = on;
		});
	},
	_genericRegisterShowHideHandlers: function($selector, isOn) {
		$selector.mouseenter(function() {
			jQuery('.snoop-tooltip-settings').show();
			isOn(true);
		}).mouseleave(function() {
			isOn(false);
			setTimeout(function() {
				if (!tooltipSettings._mouseIsOnIcon && !tooltipSettings._mouseIsOnTooltip) {
					jQuery('.snoop-tooltip-settings').hide();
				}
			}, 100);
		});
	},
	_hookSettings: function() {
		var showVAT = GM_getValue('show_vat', true);
		var parseLinks = GM_getValue('parseLinks', true);
		jQuery('#pesos-config-vat').prop('checked', showVAT);
		jQuery('#pesos-config-parse').prop('checked', !parseLinks);
		jQuery('#pesos-config-vat').change(function() {
			GM_setValue('show_vat', jQuery('#pesos-config-vat').is(':checked'));
			location.reload();
		});
		jQuery('#pesos-config-parse').change(function() {
			GM_setValue('parseLinks', !jQuery('#pesos-config-parse').is(':checked'));
			location.reload();
		});
	}
};

var tooltipTemplate = '<div class="ap_popover ap_popover_sprited snoop-tooltip" surround="6,16,18,16" tabindex="0" style="z-index: 200; width: 375px;"><div class="ap_header"><div class="ap_left"></div>' + '<div class="ap_middle"></div><div class="ap_right"></div></div><div class="ap_body"><div class="ap_left"></div><div class="ap_content" style="padding-left: 17px; padding-right: 17px; padding-bottom: 8px; ">' + '<div class="tmm_popover" >{{#shops}}<div class="entry title" style=""><span id="snoop-shop-{{id}}" class="entry snoop-price"><img class="snoop-loader" src="{{loader_url}}" /></span>' + '<span class="snoop-on"> en </span><a href="{{base_url}}&snoop-from={{from_shop}}&snoop-from-asin={asin}" class="snoop-link">{{title}}</a></div>{{/shops}}</div></div><div class="ap_right"></div></div>' + '<div class="ap_footer"><div class="ap_left"></div><div class="ap_middle"></div><div class="ap_right"></div></div></div>';

var Page = {
	addTooltipToPage: function(tooltipMarkup) {
		console.log(BANNER, 'Page.addTooltipToPage()');

		var $placeholderMarkup = jQuery('<img id="snoop-placeholder" src="https://i.imgur.com/7vqGfyT.png" alt="Placeholder" />');
		var $imageMarkup = jQuery('<img id="snoop-icon" src="https://i.imgur.com/lTWMEoH.png" />');
		var $imageMarkupMELI = jQuery('<img id="snoop-icon-ml" src="https://i.imgur.com/mxQjoLn.png" />');
		var $container = this.findAppropriateTooltipContainer();
		var $settings = '<a href="javascript:void(0)" id="pesos-config" class="nav-a nav-a-2 nav-truncate"><span class="nav-line-1">Configurar Script</span><span class="nav-line-2"><img src="https://i.imgur.com/qa5ZXdT.png" width="95"></span></a>';
		var $containerHeader = jQuery('#nav-tools');
		var tooltipTemplateML = '<div class="ap_popover ap_popover_sprited snoop-tooltip-ml" surround="6,16,18,16" tabindex="0" style="z-index: 200; width: 700px;"><div class="ap_header"><div class="ap_left"></div>' + '<div class="ap_middle"></div><div class="ap_right"></div></div><div class="ap_body"><div class="ap_left"></div><div class="ap_content" style="padding-left: 17px; padding-right: 17px; padding-bottom: 8px; ">' + '<div class="tmm_popover"><img class="snoop-loader" src="https://i.imgur.com/Dp92MjH.gif" /> Cargando...</div></div><div class="ap_right"></div></div><div class="ap_footer"><div class="ap_left"></div><div class="ap_middle"></div><div class="ap_right"></div></div></div>';
		var tooltipTemplateSettings = '<div class="ap_popover ap_popover_sprited snoop-tooltip-settings" surround="6,16,18,16" tabindex="0" style="z-index: 200; width: 350px; margin-top: 50px; display: none"><div class="ap_header"><div class="ap_left"></div>' + '<div class="ap_middle"></div><div class="ap_right"></div></div><div class="ap_body"><div class="ap_left"></div><div class="ap_content" style="padding-left: 17px; padding-right: 17px; padding-bottom: 8px; ">' + '<div class="tmm_popover">' + '<div class="a-checkbox"><label for="pesos-config-vat"><input type="checkbox" id="pesos-config-vat" style="vertical-align: 0%;"><span class="a-label a-checkbox-label">Restar VAT de los precios automáticamente<span></label></div><br>' + '<div class="a-checkbox"><label for="pesos-config-parse"><input type="checkbox" id="pesos-config-parse" style="vertical-align: 0%;"><span class="a-label a-checkbox-label">Deshabilitar referidos del script<span></label></div>' + '</div></div><div class="ap_right"></div></div><div class="ap_footer"><div class="ap_left"></div><div class="ap_middle"></div><div class="ap_right"></div></div></div>';
		if (jQuery('#merchant-info').text().trim().replace(/\s\s+/g, ' ').match(new RegExp(settings.currentShop.seller, 'i')) === null && jQuery('#olp_feature_div').length > 0) {
			var merchant_expected = settings.currentShop.base_url.match(/smid=([A-Z0-9]+)/);
			var merchant_current = window.location.href.match(/smid=([A-Z0-9]+)/);
			if (merchant_expected && merchant_current && merchant_expected[1] == merchant_current[1]) {
				$container.after(' &nbsp; <span class="a-color-error"><b>[Este producto no lo vende Amazon]</b></span> &nbsp; ');
			} else {
				$container.after(' &nbsp; <a href="' + settings.currentShop.base_url.replace('{asin}', jQuery('#ASIN').val()) + '"><b>[Cambiar al vendido por Amazon]</b></a> &nbsp; ');
			}
		} else {
            jQuery('#ddmDeliveryMessage .a-color-error').css('text-decoration','line-through');
        }

		// meli esta roto ya que la api ahora no esta abierta
        //$container.after($imageMarkupMELI);
		//$container.after(tooltipTemplateML);

        $container.after($imageMarkup);
		$container.after(tooltipMarkup);
		if (jQuery('#pesos-config').length === 0) {
			$containerHeader.prepend($settings);
			$containerHeader.prepend(tooltipTemplateSettings);
			tooltipSettings.registerShowHideHandlers();
		}
		tooltip.registerShowHideHandlers();
		//tooltipML.registerShowHideHandlers();
		convertCurrency();
	},
	findAppropriateTooltipContainer: function() {
		console.log(BANNER, 'Page.findAppropriateTooltipContainer()');

		var $tries = [
			jQuery('table.product .priceLarge:first', jQuery('#priceBlock')),
			jQuery('#priceblock_ourprice'),
			jQuery('#priceblock_saleprice'),
			jQuery('#priceblock_dealprice'),
			jQuery('#availability_feature_div > #availability > .a-color-price'),
			jQuery('div.buying span.availGreen', jQuery('#handleBuy')),
			jQuery('div.buying span.availRed:nth-child(2)', jQuery('#handleBuy')),
			jQuery('#availability'),
            jQuery('#titleSection')
		];

		for (var i = 0; i < $tries.length; i++) {
			if ($tries[i].length > 0) {
				console.log(BANNER, 'Page.findAppropriateTooltipContainer() try: ' + i);

				return $tries[i];
			}
		}

		throw new Error('Unable to find the price section.');
	},
	displayPrice: function($shopInfo, price, vat) {
		var convertedPrice = price.for(settings.currentShop.currency, settings.currentShop.currency_symbol);
		var convertedString = convertedPrice.toString();

		// este es un fix provisorio hasta que termine el refactor
		if (convertedString !== 'EUR 0.00') {
			$shopInfo.text(convertedPrice.toString());
			convertCurrency(0, vat);
		}

	},
	displayWarning: function($shopInfo, warning, addNotFoundClass) {
		$shopInfo.text(warning).addClass('snoop-warning');
		if (addNotFoundClass) {
			$shopInfo.parent().addClass('snoop-not-found');
		}
	},
	registerInitializationHandler: function(shops) {
		console.log(BANNER, 'Page.registerInitializationHandler()');

		jQuery('#snoop-icon').mouseover(function() {
			if (window.snoop_tooltipInitialized !== undefined && window.snoop_tooltipInitialized !== false) return;
			window.snoop_tooltipInitialized = true;
			$.each(shops, function(index, shop) {
				var $shopInfo = jQuery('#snoop-shop-' + shop.id);
				PageScraper.getPriceOn(
					shop, 
					function(price) {
						Page.displayPrice($shopInfo, shop.moneyFrom(price), shop.vat);
					}, 
					function(warning, addNotFoundClass) {
						Page.displayWarning($shopInfo, warning, addNotFoundClass);
					}
				);
			});
		});
		jQuery('#snoop-icon-ml').mouseover(function() {
			if (window.snoopML_tooltipInitialized !== undefined && window.snoopML_tooltipInitialized !== false) return;
			window.snoopML_tooltipInitialized = true;
			var productName = decodeURI(jQuery('#productTitle').html().replace('&nbsp;', ' ').replace(/[^\w\d\s\.]/g, ' ').trim());
			Meli.showPrices(productName);
		});
	}
};

var snoop = {
	tooltip: null,
	asin: null,
	_startMonitoringAsin: function(domainData, domain) {
		var observer = new MutationObserver(function(mutations) {
			var asinHasProbablyChanged = mutations.some(function(mutation) {
				return mutation.addedNodes.length > 0;
			});
			if (!asinHasProbablyChanged) return;
			var newAsin = jQuery('#ASIN').val();
			if (snoop.asin == newAsin) return;
			snoop.run(newAsin, domainData, domain);
		});
		if (jQuery('#buybox_feature_div').get(0)) {
			observer.observe(jQuery('#buybox_feature_div').get(0), {
				attributes: true,
				subtree: true,
				childList: true,
				characterData: true
			});
		}
	},
	initialize: function(asin, domainData, domain) {
		this.asin = asin;
		this._startMonitoringAsin(domainData, domain);
		//refreshRates();
		console.log(BANNER, 'snoop.initialize()');
		settings = new Settings(asin, domainData, domain);
		snoop.tooltip = Mustache.to_html(tooltipTemplate, {
			shops: settings.filteredShops,
			from_shop: settings.currentShop.id,
			from_asin: settings.asin,
			loader_url: 'https://i.imgur.com/Dp92MjH.gif'
		});
		snoop.run(asin, domainData, domain);
	},
	run: function(asin, domainData, domain) {
		console.log(BANNER, 'snoop.run()');
		this.asin = asin;
		settings = new Settings(asin, domainData, domain);
		window.snoop_tooltipInitialized = false;
		window.snoopML_tooltipInitialized = false;
		var ensureTooltipHasBeenLoaded = function() {
			if (snoop.tooltip === null) {
				setTimeout(ensureTooltipHasBeenLoaded, 50);
			} else {
				var tooltipMarkup = snoop.tooltip.replace(/{asin}/gm, settings.asin);
				Page.addTooltipToPage(tooltipMarkup);
				Page.registerInitializationHandler(settings.filteredShops);
			}
		};
		ensureTooltipHasBeenLoaded();
	}
};

var Meli = {
	showPrices: function(productName) {
		console.log(BANNER, 'Meli.fetchApiData()');
		Meli.fetchApiData(productName, Meli.showProducts);
	},
	showProducts: function(data) {
		var products = jQuery('.snoop-tooltip-ml .tmm_popover');
		products.html('<div class="entry title" style="font-size:10px"><b>Buscando por:</b> ' + data.query + '</div>');
		if (data.results.length === 0) {
			products.append('<div class="entry title">No se encontraron productos en MercadoLibre con esta búsqueda.</div>');
		}
		data.results.forEach(function(product) {
			products.append('<div class="entry title"><div class="snoop-price" style="width:130px;display:inline-block;text-align:right;"><div class="price-ars">ARS $' + product.price.formatMoney(2) + '</div></div><span class="snoop-on"> &raquo; </span><a href="' + product.permalink + '" target="_blank" class="snoop-link">' + product.title + '</a></div>');
		});
	},
	fetchApiData: function(productName, callback) {
		jQuery.getJSON(
			"https://api.mercadolibre.com/sites/MLA/search?q=" + encodeURI(productName) + "&condition=new"
		).done(function(data) {
			callback(data);
		});
	}
};