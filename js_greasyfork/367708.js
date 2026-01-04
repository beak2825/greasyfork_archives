// ==UserScript==
// @name          亚马逊商品转换成人名币计价
// @namespace     sharkiller-amazon-dolar-tarjeta
// @description   该小程序支持将各国货币直接转换为人民币，只要显示出的价格都会转换为人民币，效果如图所示。现持续支持地区包括美国，日本，英国，德国，加拿大，西班牙，意大利，法国，欧洲。
// @version       6.0
// @copyright     2018 - Sharkiller
// @homepage      http://foros.3dgames.com.ar/threads/909283-comprar-en-amazon-europa-a-la-puerta-de-tu-casa-con-amazonglobal-ver-post-1-y-2
// @supportURL    http://foros.3dgames.com.ar/private.php?do=newpm&u=534083
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js#sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=
// @require       https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js#sha256-iaqfO5ue0VbSGcEiQn+OeXxnxAMK2+QgHXIDA5bWtGI=
// @include       *amazon.tld/*
// @connect       amazon.com
// @connect       amazon.co.uk
// @connect       amazon.ca
// @connect       amazon.es
// @connect       amazon.de
// @connect       amazon.fr
// @connect       amazon.it
// @connect       amazon.co.jp
// @connect       europa.eu
// @connect       mercadolibre.com
// @connect       api.enhancedsteam.com
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_log
// @grant         GM_setClipboard
// @grant         GM_xmlhttpRequest
// @run-at        document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/367708/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%95%86%E5%93%81%E8%BD%AC%E6%8D%A2%E6%88%90%E4%BA%BA%E5%90%8D%E5%B8%81%E8%AE%A1%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/367708/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%95%86%E5%93%81%E8%BD%AC%E6%8D%A2%E6%88%90%E4%BA%BA%E5%90%8D%E5%B8%81%E8%AE%A1%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
if( typeof jQuery === 'undefined' ){
    console.log('jQuery not found');
    return false;
}

GM_addStyle('.price-ars{color:green;display:inline-block;margin:0 8px;background:linear-gradient(to bottom,#add8e6,#fff,#add8e6);border-radius:8px;padding:0 6px}'+
            '#sc-buy-box .price-ars{font-size:12px;display:block;padding:0;margin:0;background:0 0}div#sc-buy-box{margin-bottom:-14px}#orderDetails{width: 1200px;}#od-subtotals{width: 350px!important;margin-right:-350px!important;}');
GM_addStyle('#snoop-icon{margin-left:4px;width:30px;height:20px}#snoop-placeholder{width:32px}div.snoop-loader{width:13px;height:13px}div.snoop-tooltip,div.snoop-tooltip-ml{display:none;font-size:13px;border-image:none;letter-spacing:0}'+
            'div.snoop-tooltip div.entry,div.snoop-tooltip-ml div.entry{padding-top:5px}span.snoop-price{color:#900;font-size:1em;font-weight:700}span.snoop-warning{color:#C60!important}.snoop-not-found{text-decoration:line-through}'+
            'span.snoop-on{color:#000;font-weight:400}span.back-link{line-height:0;margin-left:1px;top:-10px;position:relative}'+
            'span.back-link>img{top:1;position:relative}span.back-link>a{font-size:1em;text-decoration:none!important}#snoop-icon-ml{margin-left:10px}');
GM_addStyle('#pesos-carrito-html{width:400px;min-height:34px;margin:0 auto;left:calc(80% - 200px);top:150px;background:white;position: fixed;z-index:1000000;padding:20px;border:1px solid black;border-radius:8px;box-shadow: 0px 0px 40px black;}#pesos-carrito-html .price-ars{text-align: right; margin: 0;}');

String.prototype.endsWith = function (pattern) {
	var d = this.length - pattern.length;
	return d >= 0 && this.lastIndexOf(pattern) === d;
};

var domain = document.domain.substr(document.domain.lastIndexOf('.') + 1);
var domainData = {
	parseLinks: false, //GM_getValue('parseLink', true),
	com: {
		amazonSeller: "ATVPDKIKX0DER",
		withVAT: false,
		vat: 0,
		tag: "r0f34-20",
		symbol: "$",
		priceRegex: /\$\s*([\d,.]+\d)/,
		currencyFrom: "USD"
	},
	ca: {
		amazonSeller: "A3DWYIK6Y9EEQB",
		withVAT: false,
		vat: 0,
		tag: "",
		symbol: "CDN$ ",
		priceRegex: /CDN\$\s*([\d,.]+\d)/,
		currencyFrom: "CAD"
	},
	uk: {
		amazonSeller: "A3P5ROKL5A1OLE",
		withVAT: true,
		vat: 1.20,
		tag: "r0f340c-21",
		symbol: "£",
		priceRegex: /£\s*([\d,.]+\d)/,
		currencyFrom: "GBP"
	},
	es: {
		amazonSeller: "A1AT7YVPFBWXBL",
		withVAT: true,
		vat: 1.21,
		tag: "r0f340fc-21",
		symbol: "EUR ",
		priceRegex: /(?:EUR\s*|€)([\s\d,.]+\d)/,
		currencyFrom: "EUR"
	},
	de: {
		amazonSeller: "A3JWKAKR8XB7XF",
		withVAT: true,
		vat: 1.19,
		tag: "r0f3409-21",
		symbol: "EUR ",
		priceRegex: /(?:EUR\s*|€)([\s\d,.]+\d)/,
		currencyFrom: "EUR"
	},
	fr: {
		amazonSeller: "A1X6FK5RDHNB96",
		withVAT: true,
		vat: 1.20,
		tag: "r0f340a-21",
		symbol: "EUR ",
		priceRegex: /(?:EUR\s*|€)([\s\d,.]+\d)/,
		currencyFrom: "EUR"
	},
	it: {
		amazonSeller: "A11IL2PNWYJU7H",
		withVAT: true,
		vat: 1.22,
		tag: "r0f3401-21",
		symbol: "EUR ",
		priceRegex: /(?:EUR\s*|€)([\s\d,.]+\d)/,
		currencyFrom: "EUR"
	},
	jp: {
		amazonSeller: "A1VC38T7YXB528",
		withVAT: false,
		vat: 0,
		tag: "",
		symbol: "￥ ",
		priceRegex: /\￥\s*([\d,.]+\d)/,
		currencyFrom: "JPY"
	}
};

// Various currencies' rates to EUR
window.Rates = {
    timestamp: new Date(),
    'EUR': 1,
    'USD': 0,
    'GBP': 0
};
refreshRates();

var LAST_RUN = "last_run_";
var CURRENCY_RATE = "currency_rate_";

var decimalPlaces = 2;
var prefixCurrencySymbol = true;
var taxPorcentage = 3.6;

var rounding = Math.pow(10, decimalPlaces);

var rate = GM_getValue(CURRENCY_RATE + domainData[domain].currencyFrom);
var lastRun = GM_getValue(LAST_RUN + domainData[domain].currencyFrom, "01/01/0001");
var showVAT = GM_getValue('show_vat', true);
var currencyTo = 'CNY';
var todayDate = new Date();
var todayString = todayDate.getDate() + "/" + (todayDate.getMonth()+1) + "/" + todayDate.getFullYear();
var currencyToSymbol = '¥&nbsp;';

rate = tryParseJSON(rate);
if( rate == false ) {
    lastRun = "01/01/0001";
}else{
    rate = rate[domainData[domain].currencyFrom][currencyTo];
}

function tryParseJSON(jsonString){
    try {
        var obj = JSON.parse(jsonString);
        if (obj && typeof obj === "object") {
            return obj;
        }
    }
    catch (e) {}
    return false;
}

function regularPriceParser(price, currency) {
    price = price.replace(/\s/g, '');

    var regex = /^[\d.]+,[\d]{2}$/;
    var needProperPrice = regex.exec(price);
    if(needProperPrice) {
        price = price.replace(/\./g, '').replace(/,/, '.');
    }else{
        price = price.replace(/\,/g, '');
    }

    return parseFloat(price);
}

function fetchCurrencyData(coin, callback) {
    GM_xmlhttpRequest({
		method: "GET",
		url: "https://api.enhancedsteam.com/currencydata/?base="+coin,
		onload: function(responseDetails) {
            if(tryParseJSON(responseDetails.responseText) !== false){
                GM_setValue(CURRENCY_RATE + coin, responseDetails.responseText);
                GM_setValue(LAST_RUN + coin, todayString);
                callback();
            }else{
                alert("Error fetching currency data for " + coin);
            }
		},
		onerror: function(responseDetails) {
			alert("Error fetching currency data for " + coin);
		}
	});
}

function appendConversionNoVAT(price, matched, offset, string) {
    return appendConversion(price, matched, offset, string, true);
}

function appendConversion(price, matched, offset, string, novat, customvat) {

	var originalPrice = regularPriceParser(matched, domainData[domain].currencyFrom);

	if (isNaN(originalPrice)) {
		return price;
	}

    if(novat !== true){
        if(customvat > 1){
            originalPrice /= customvat;
        }else if(customvat === undefined && domainData[domain].withVAT){
            originalPrice /= domainData[domain].vat;
        }
    }

	var converted = formatCurrency(originalPrice * (rate * (taxPorcentage / 100 + 1)), rounding, currencyToSymbol, prefixCurrencySymbol);

    if(showVAT && novat !== true && (customvat > 1 || (customvat === undefined && domainData[domain].withVAT)) ){
        originalPrice = formatCurrency(originalPrice, rounding, domainData[domain].symbol, prefixCurrencySymbol);

        return '<span title="Original: ' + price + (customvat > 1?' - VAT: ' + Math.round((customvat-1)*100)+'%':'') + '">' + originalPrice + '<div class="price-ars">' + converted + '元'+'</div></span>';
    }else{
        return price + '<div class="price-ars">' + converted + '元' + '</div>';
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
		num = num.substring(0, num.length - (4 * i + 3)) + ',' +
		                       num.substring(num.length-(4*i+3));
	}

	if (prefix) {
		return (symbol + ((sign)?'':'-') + num + '.' + cents);
	} else {
		return (((sign)?'':'-') + num + '.' + cents + symbol);
	}
}

convertCurrency = function(carrito, vat) {
    switch(carrito){
        case 1:
            if(   $('.a-size-base.a-text-bold:contains(Order summary)').length === 0 &&
                  $('.a-size-base.a-text-bold:contains(Récapitulatif de commande)').length === 0 &&
                  $('.a-size-base.a-text-bold:contains(Riepilogo ordine)').length === 0 &&
                  $('.a-size-base.a-text-bold:contains(Resumen del pedido)').length === 0 &&
                  $('.a-size-base.a-text-bold:contains(Zusammenfassung der Bestellung)').length === 0 &&
                  $('.ap_popover.ap_popover_sprited.snoop-tooltip').length === 0
              ){
                return false;
            }else{
                if($('#sc-buy-box.price-ars-cart').length === 0){
                    $('#sc-buy-box').addClass('price-ars-cart');
                }else{
                    return false;
                }
            }
            break;
        case 2:
            if( $('.entry.snoop-price:not(.snoop-warning):not(.price-ars-cart)').length === 0 ){
                return false;
            }
            break;
        default:
            break;
    }

    //console.log('Cambiando precios', carrito);

    $('.a-column.a-span3.a-text-right.a-span-last.sc-value').removeClass('a-span3').addClass('a-span4');
    $('.a-column.a-span9.sc-text').removeClass('a-span9').addClass('a-span8');
    $('a.a-popover-trigger.a-declarative:contains(Estimated)').html('Shipping & handling <i class="a-icon a-icon-popover"></i>');

    if(carrito == 2){
        $('.entry.snoop-price:not(.snoop-warning)').each(function(){
            var text = jQuery(this).text();
            if( $(this).children().length === 0 && text.indexOf(domainData[domain].symbol) != -1 && text.indexOf('CNY') == -1){
                $(this).addClass('price-ars-cart').html( text.replace(domainData[domain].priceRegex, appendConversion) );
            }
        });
    }else{
        //console.log($('span:not(:has(*))'));
        $('span:not(:has(*))').each(function(){
            var parent = false;
            var text = $(this).text();
            if( $(this).hasClass('a-price-symbol') ){
                parent = true;
                text = $(this).parent().text();
            }
            if( $(this).children().length === 0 && domainData[domain].priceRegex.test(text) && text.indexOf('CNY') == -1){
                if( $(this).parents('#sc-buy-box').length == 1 ||
                   $(this).parents('#pesos-carrito-html').length == 1 ||
                   window.location.href.indexOf("/gp/css/summary/") > -1 ||
                   window.location.href.indexOf("/order-details") > -1 ||
                   window.location.href.indexOf("/order-history") > -1 ||
                   window.location.href.indexOf("/shipoptionselect/") > -1
                  ){
                    if(parent){
                        $(this).closest('.a-price').html( text.replace(domainData[domain].priceRegex, appendConversionNoVAT) );
                    }else{
                        $(this).html( text.replace(domainData[domain].priceRegex, appendConversionNoVAT) );
                    }
                }else{
                    var customVAT = function(price, matched, offset, string){
                        return appendConversion(price, matched, offset, string, false, vat);
                    };
                    if(parent){
                        $(this).closest('.a-price').html( text.replace(domainData[domain].priceRegex, customVAT) );
                    }else{
                        $(this).html( text.replace(domainData[domain].priceRegex, customVAT) );
                    }
                }
            }
        });
    }
};

function parseLinks(){
    $('head').append('<meta name="referrer" content="no-referrer">');
    $('a[href*="/dp/"]:not([href*="?tag="])').each(function(i,item){
        $(item).attr('href', $(item).attr('href').replace('?','?tag='+domainData[domain].tag+'&'));
    });
}

var running_convert_1 = false;
var running_convert_2 = false;
$( document ).ready(function(){

    console.log('Page ready!');

    //$('#nav-tools').prepend('<a href="javascript:void(0)" id="pesos-carrito" class="nav-a nav-a-2 nav-truncate"><span class="nav-line-1">Carrito</span><span class="nav-line-2"><img src="https://i.imgur.com/qa5ZXdT.png" width="95"></span></a>');
    $('#nav-tools').prepend('<a href="javascript:void(0)" class="nav-a nav-a-2 nav-cart" id="pesos-carrito"><span class="nav-line-1">Calcular</span><span class="nav-line-2">Carrito<span class="nav-icon nav-arrow"></span></span><span class="nav-cart-icon nav-sprite"></span><span class="nav-cart-count nav-cart-1">$</span></a>');

    $('#pesos-carrito').click(function(){
        $('body').append('<div id="pesos-carrito-html"><img src="https://i.imgur.com/Dp92MjH.gif" /> Cargando...</div>');
        P.when("LUXController").execute(function(LUXController){
            var addressId = LUXController.getLocationData().obfuscatedId;
            if(addressId !== undefined){
                //GM_setClipboard(addressId+(16*8),"text");
                console.log(addressId);
                $.get("/gp/cart/view.html/ref=nav_cart", function(){
                    $.getJSON("/gp/cart/ajax-load-flc.html/ref=flc-for-enable-flc",{addressId: addressId, flcExpanded: 1}, function(result){
                        var cartTotal = jQuery(result.features["buy-box"].featurehtml).find('#a-popover-vat_breakdown,.sc-subtotal-detail');
                        $('#pesos-carrito-html').html(cartTotal.html());
                        $('#pesos-carrito-html span').removeClass("a-nowrap");
                        $('#pesos-carrito-html span.sc-importfee').addClass("a-spacing-small");
                        convertCurrency();
                    });
                });
            }
        });
    });

    if(domainData.parseLinks) parseLinks();

    if (rate === undefined || todayString !== lastRun) {
        fetchCurrencyData(domainData[domain].currencyFrom, function() {
            rate = GM_getValue(CURRENCY_RATE + domainData[domain].currencyFrom);
            convertCurrency();
        });
    } else {
        console.log('Currency rate: ', rate);
        convertCurrency();
    }

    $('.a-fixed-right-grid-col.a-col-right').bind("DOMSubtreeModified",function(e){
        if(running_convert_1 === false){
            console.log('Auto 1');
            running_convert_1 = true;
            setTimeout(function(){convertCurrency(1); running_convert_1=false;}, 1000);
        }
    });

    $('#priceblock_ourprice').bind("DOMSubtreeModified",function(e){
        if(running_convert_2 === false){
            console.log('Auto 2');
            running_convert_2 = true;
            setTimeout(function(){convertCurrency(2); running_convert_2=false;}, 1000);
        }
    });

    /*
    ////////////////////////////////////////////////////////////////
    PRECIOS DE OTRAS TIENDAS
    ////////////////////////////////////////////////////////////////
    */

    var asin = $('#ASIN').val();
    if (asin === undefined)
        return;
    snoop.initialize(asin, domainData, domain);

});
})();

function refreshRates() {
    var cachedRates = JSON.parse(localStorage.getItem("conversionRates"));
    //console.log(cachedRates);
    if (cachedRates !== null && cachedRates.timestamp !== undefined) {
        cachedRates.timestamp = new Date(cachedRates.timestamp);
        Rates = cachedRates;
        var ageInHours = (new Date() - cachedRates.timestamp) / 1000 / 60 / 60;
        if (ageInHours < 7)
            return;
    }
    console.log('Refreshing conversion rates...');
    GM_xmlhttpRequest({
		method: "GET",
		url: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
		onload: function(responseDetails) {
			var $document = $(responseDetails.responseText);
            for (var rate in Rates) {
                if (typeof rate !== 'string' || rate === 'EUR')
                    continue;
                Rates[rate] = parseFloat($document.find('Cube[currency="' + rate + '"]').attr('rate'));
            }
            Rates.timestamp = new Date();
            localStorage.conversionRates = JSON.stringify(Rates);
		},
		onerror: function(responseDetails) {
			alert("Error fetching currency rates.");
		}
	});
}

var Money = function (amount, currency, currency_symbol, extraAmount) {
    this.amount = amount;
    this.extraAmount = extraAmount;
    this.currency = currency;
    this.currency_symbol = currency_symbol;
    //console.log('Money', this);
};
Money.prototype.for = function (currency, currency_symbol) {
    var rate = Rates[currency] / Rates[this.currency];
    var convertedAmount = this.amount * rate;
    var convertedExtraAmount = this.extraAmount !== undefined ? this.extraAmount * rate : undefined;
    //console.log('Conversion\n', this.currency, '->', currency,
    //  '\n', Rates[this.currency], '->', Rates[currency],
    //  '\n', this.amount, '->', convertedAmount);
    return new Money(convertedAmount, currency, currency_symbol, convertedExtraAmount);
};
Money.prototype.toString = function () {
    if (this.extraAmount === undefined)
        return this.currency_symbol+(this.amount.toFixed(2));
    else
        return this.currency_symbol+(this.amount.toFixed(2)) + ' - ' + this.currency_symbol+(this.extraAmount.toFixed(2));
};

var Shop = function (id, title, domain, base_url, currency, currency_symbol, vat, seller) {
    this.id = id;
    this.title = title;
    this.domain = domain;
    this.base_url = base_url;
    this.url = this.base_url;
    this.currency = currency;
    this.currency_symbol = currency_symbol;
    this.vat = vat;
    this.seller = seller;
    this.setAsin = function (asin) {
        this.url = this.urlFor(asin);
    };
    this.urlFor = function (asin) {
        return this.base_url.replace('{asin}', asin);
    };
    this.moneyFrom = function (amount) {
        var culture = this.culture;
        if (amount.indexOf('-') == -1) {
            var sanitizedAmount = amount.replace(/[^\d^,^.]/g, '');
            var regex = /^[\d.]+,[\d]{2}$/;
            var needProperPrice = regex.exec(sanitizedAmount);
            if(needProperPrice) {
                sanitizedAmount = sanitizedAmount.replace(/\./g, '').replace(/,/, '.');
            }else{
                sanitizedAmount = sanitizedAmount.replace(/\,/g, '');
            }
            return new Money(sanitizedAmount, this.currency);
        }
        var sanitizedAmounts = amount.split('-').map(function (a) {
            return a.replace(/[^\d^,^.]/g, '');
        });
        return new Money(sanitizedAmounts[0], this.currency, sanitizedAmounts[1]);
    };
};

var Settings = function (asin, domainData, domain) {
    this.asin = asin;
    this.shops = [
        new Shop(1, 'amazon.co.uk', 'www.amazon.co.uk', 'https://www.amazon.co.uk/dp/{asin}?smid=A3P5ROKL5A1OLE'+(domainData.parseLinks?'&tag='+domainData.uk.tag:''), 'GBP', '£', domainData.uk.vat, 'Dispatched from and sold by Amazon|Dispatched and sold by Amazon'),
        new Shop(2, 'amazon.de', 'www.amazon.de', 'https://www.amazon.de/dp/{asin}?smid=A3JWKAKR8XB7XF'+(domainData.parseLinks?'&tag='+domainData.de.tag:''), 'EUR', 'EUR ', domainData.de.vat, 'Verkauf und Versand durch Amazon|Versandt und verkauft von Amazon|Dispatched from and sold by Amazon|Dispatched and sold by Amazon'),
        new Shop(3, 'amazon.es', 'www.amazon.es', 'https://www.amazon.es/dp/{asin}?smid=A1AT7YVPFBWXBL'+(domainData.parseLinks?'&tag='+domainData.es.tag:''), 'EUR', 'EUR ', domainData.es.vat, 'Vendido y enviado por Amazon'),
        new Shop(4, 'amazon.fr', 'www.amazon.fr', 'https://www.amazon.fr/dp/{asin}?smid=A1X6FK5RDHNB96'+(domainData.parseLinks?'&tag='+domainData.fr.tag:''), 'EUR', 'EUR ', domainData.fr.vat, 'Expédié et vendu par Amazon'),
        new Shop(5, 'amazon.it', 'www.amazon.it', 'https://www.amazon.it/dp/{asin}?smid=A11IL2PNWYJU7H'+(domainData.parseLinks?'&tag='+domainData.it.tag:''), 'EUR', 'EUR ', domainData.it.vat, 'Venduto e spedito da Amazon'),
        new Shop(6, 'amazon.com', 'www.amazon.com', 'https://www.amazon.com/dp/{asin}?smid=ATVPDKIKX0DER'+(domainData.parseLinks?'&tag='+domainData.com.tag:''), 'USD', '$', domainData.com.vat, 'Ships from and sold by Amazon.com'),
        new Shop(7, 'amazon.ca', 'www.amazon.ca', 'https://www.amazon.ca/dp/{asin}?smid=ATVPDKIKX0DER'+(domainData.parseLinks?'&tag='+domainData.ca.tag:''), 'CAD', 'CDN$', domainData.ca.vat, 'Ships from and sold by Amazon.ca'),
		new Shop(8, 'amazon.co.jp', 'www.amazon.co.jp', 'https://www.amazon.co.jp/dp/{asin}?smid=A1VC38T7YXB528'+(domainData.parseLinks?'&tag='+domainData.jp.tag:''), 'JPY', '￥', domainData.jp.vat, '由Amazon.co.jp直接销售和发货')
    ];
    this.shops.forEach(function (shop) {
        shop.setAsin(asin);
    });

    this.currentShop = this.shops.filter(function (shop) {
        return shop.domain == document.domain;
    })[0];

    this.desiredCurrency = this.currentShop.currency;

    if (this.currentShop.currency != this.desiredCurrency) {
        this.filteredShops = this.shops;
    }
    else {
        this.filteredShops = this.shops.filter(function (shop) {
            return shop.domain != document.domain;
        });
    }
    this.shop = function (id) {
        var shopById = this.shops.filter(function (shop) {
            return shop.id == id;
        });
        if (shopById.length == 1)
            return shopById[0];
        return null;
    };
};

var pageScraper = {
    warning: {
        networkError: 'Error al consultar',
        unavailable: 'No disponible',
        wrongSeller: 'No vendido por Amazon',
        notFound: 'No encontrado',
        multipleOptions: 'Opciones multiples'
    },
    getPriceOn: function (shop, displayPrice, displayWarning) {
        var serverUrl = shop.url;
        var sellerText = shop.seller;
        GM_xmlhttpRequest({
            method: "GET",
            url: serverUrl,
            onload: function(data) {
                var regex = /[nb]\s*?id="priceblock_[\w]*?price".*?>(.*?)</img;
                var price = regex.exec(data.responseText);
                if (price === null || price.length != 2) {
                    displayWarning(pageScraper.warning.unavailable, false);
                    return;
                }
                regex =  new RegExp(sellerText);
                var seller = regex.exec(data.responseText);
                if (seller === null) {
                    displayWarning(pageScraper.warning.wrongSeller, false);
                    return;
                }
                displayPrice(price[1]);
            },
            onerror: function(data) {
                if (data.status == 404)
                    displayWarning(pageScraper.warning.notFound, true);
                else
                    displayWarning(pageScraper.warnings.networkError, false);
            }
        });
    }
};

var tooltip = {
    _mouseIsOnIcon: false,
    _mouseIsOnTooltip: false,
    registerShowHideHandlers: function () {
        this._genericRegisterShowHideHandlers($('.snoop-tooltip'), function (on) {
            tooltip._mouseIsOnTooltip = on;
        });
        this._genericRegisterShowHideHandlers($('#snoop-icon'), function (on) {
            tooltip._mouseIsOnIcon = on;
        });
    },
    _genericRegisterShowHideHandlers: function ($selector, isOn) {
        $selector.mouseenter(function () {
            $('.snoop-tooltip').show();
            isOn(true);
        }).mouseleave(function () {
            isOn(false);
            setTimeout(function () {
                if (!tooltip._mouseIsOnIcon && !tooltip._mouseIsOnTooltip)
                    $('.snoop-tooltip').hide();
            }, 100);
        });
    }
};
var tooltipML = {
    _mouseIsOnIcon: false,
    _mouseIsOnTooltip: false,
    registerShowHideHandlers: function () {
        this._genericRegisterShowHideHandlers($('.snoop-tooltip-ml'), function (on) {
            tooltipML._mouseIsOnTooltip = on;
        });
        this._genericRegisterShowHideHandlers($('#snoop-icon-ml'), function (on) {
            tooltipML._mouseIsOnIcon = on;
        });
    },
    _genericRegisterShowHideHandlers: function ($selector, isOn) {
        $selector.mouseenter(function () {
            $('.snoop-tooltip-ml').show();
            isOn(true);
        }).mouseleave(function () {
            isOn(false);
            setTimeout(function () {
                if (!tooltipML._mouseIsOnIcon && !tooltipML._mouseIsOnTooltip)
                    $('.snoop-tooltip-ml').hide();
            }, 100);
        });
    }
};
var tooltipSettings = {
    _mouseIsOnIcon: false,
    _mouseIsOnTooltip: false,
    registerShowHideHandlers: function () {
        this._hookSettings();
        this._genericRegisterShowHideHandlers($('.snoop-tooltip-settings'), function (on) {
            tooltipSettings._mouseIsOnTooltip = on;
        });
        this._genericRegisterShowHideHandlers($('#pesos-config'), function (on) {
            tooltipSettings._mouseIsOnIcon = on;
        });
    },
    _genericRegisterShowHideHandlers: function ($selector, isOn) {
        $selector.mouseenter(function () {
            $('.snoop-tooltip-settings').show();
            isOn(true);
        }).mouseleave(function () {
            isOn(false);
            setTimeout(function () {
                if (!tooltipSettings._mouseIsOnIcon && !tooltipSettings._mouseIsOnTooltip)
                    $('.snoop-tooltip-settings').hide();
            }, 100);
        });
    },
    _hookSettings: function(){
        var showVAT = GM_getValue('show_vat', true);
        var parseLinks = GM_getValue('parseLinks', true);
        $('#pesos-config-vat').prop('checked', showVAT);
        $('#pesos-config-parse').prop('checked', !parseLinks);
        $('#pesos-config-vat').change(function(){
            GM_setValue('show_vat', $('#pesos-config-vat').is(':checked'));
            location.reload();
        });
        $('#pesos-config-parse').change(function(){
            GM_setValue('parseLinks', !$('#pesos-config-parse').is(':checked'));
            location.reload();
        });
    }
};

var tooltipTemplate = '<div class="ap_popover ap_popover_sprited snoop-tooltip" surround="6,16,18,16" tabindex="0" style="z-index: 200; width: 375px;"><div class="ap_header"><div class="ap_left"></div>'+
    '<div class="ap_middle"></div><div class="ap_right"></div></div><div class="ap_body"><div class="ap_left"></div><div class="ap_content" style="padding-left: 17px; padding-right: 17px; padding-bottom: 8px; ">'+
    '<div class="tmm_popover" >{{#shops}}<div class="entry title" style=""><span id="snoop-shop-{{id}}" class="entry snoop-price"><img class="snoop-loader" src="{{loader_url}}" /></span>'+
    '<span class="snoop-on"> en </span><a href="{{base_url}}&snoop-from={{from_shop}}&snoop-from-asin={asin}" class="snoop-link">{{title}}</a></div>{{/shops}}</div></div><div class="ap_right"></div></div>'+
    '<div class="ap_footer"><div class="ap_left"></div><div class="ap_middle"></div><div class="ap_right"></div></div></div>';




var settings;
var snoop = {
    tooltip: null,
    asin: null,
    _startMonitoringAsin: function (domainData, domain) {
        var observer = new MutationObserver(function (mutations) {
            var asinHasProbablyChanged = mutations.some(function (mutation) {
                return mutation.addedNodes.length > 0;
            });
            if (!asinHasProbablyChanged)
                return;
            var newAsin = $('#ASIN').val();
            if (snoop.asin == newAsin)
                return;
            snoop.run(newAsin, domainData, domain);
        });
        if($('#buybox_feature_div').get(0)){
            observer.observe($('#buybox_feature_div').get(0), { attributes: true, subtree: true, childList: true, characterData: true });
        }
    },
    initialize: function (asin, domainData, domain) {
        this.asin = asin;
        this._startMonitoringAsin(domainData, domain);
        settings = new Settings(asin, domainData, domain);
        snoop.tooltip = Mustache.to_html(tooltipTemplate, {
                shops: settings.filteredShops,
                from_shop: settings.currentShop.id,
                from_asin: settings.asin,
                loader_url: 'https://i.imgur.com/Dp92MjH.gif'
        });
        snoop.run(asin, domainData, domain);
    },
    run: function (asin, domainData, domain) {
        this.asin = asin;
        settings = new Settings(asin, domainData, domain);
        window.snoop_tooltipInitialized = false;
        window.snoopML_tooltipInitialized = false;
        var ensureTooltipHasBeenLoaded = function () {
            if (snoop.tooltip === null) {
                setTimeout(ensureTooltipHasBeenLoaded, 50);
            }
            else {
                var tooltipMarkup = snoop.tooltip.replace(/{asin}/gm, settings.asin);
                page.addTooltipToPage(tooltipMarkup);
                page.registerInitializationHandler(settings.filteredShops);
            }
        };
        ensureTooltipHasBeenLoaded();
    }
};

Number.prototype.formatMoney = function(c, d, t){
    var n = this;
    c = isNaN(c = Math.abs(c)) ? 2 : c;
    d = d === undefined ? "." : d;
    t = t === undefined ? "," : t;
    var s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

var meli = {
    showPrices: function(productName) {
        meli.fetchApiData(productName, meli.showProducts);
    },
    showProducts: function (data){
        var meliProducts = $('.snoop-tooltip-ml .tmm_popover');
        meliProducts.html('<div class="entry title" style="font-size:10px"><b>搜索标题:</b> '+data.query+'</div>');
        //console.log(data);
        if(data.results.length === 0){
            meliProducts.append('<div class="entry title">No se encontraron productos en MercadoLibre con esta búsqueda.</div>');
        }
        data.results.forEach(function(product) {
            meliProducts.append('<div class="entry title"><div class="snoop-price" style="width:130px;display:inline-block;text-align:right;"><div class="price-ars">CNY $'+product.price.formatMoney(2)+'</div></div><span class="snoop-on"> &raquo; </span><a href="'+product.permalink+'" target="_blank" class="snoop-link">'+product.title+'</a></div>');
        });
    },
    fetchApiData: function (productName, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.mercadolibre.com/sites/MLA/search?q=" + encodeURI(productName) + "&condition=new",
            onload: function(responseDetails) {
                var api = JSON.parse(responseDetails.responseText);
                callback(api);
            },
            onerror: function(responseDetails) {
                alert("Error fetching API from MELI");
            }
        });
    }
};
