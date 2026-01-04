// ==UserScript==
// @name         SmsHub Normalizer
// @namespace    shshub
// @version      0.1
// @description  NormalizeSmsHub
// @author       You
// @match        https://smshub.org/*
// @match        http://smshub.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smshub.org
// @grant        none
// @license MIT
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/440096/SmsHub%20Normalizer.user.js
// @updateURL https://update.greasyfork.org/scripts/440096/SmsHub%20Normalizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.initPatches = function() {
        const countries = ['Россия', 'Украина', 'Польша', 'Russia', 'Ukraine', 'Poland'];
        const services = ['Bolt', 'Uber', 'Glovo'];
        var minPriceServices = [];
        var _ajax = $.ajax;

        $.extend({
            ajax: function(url, settings ) {
                if ( typeof url === 'object' ) {
			        settings = url;
			        url = undefined;
		        } else {
			        settings = settings || {};
			        settings.url = url || settings.url;
		        }

                if (void 0 !== settings.data && 'manageActivations' === settings.data.act && 'getListOfCountriesAndOperators' === settings.data.asc) {
                    var success = settings.success;
                    settings.success = function(data) {
                        for (var i = data.data.length - 1; i >= 0; i--) {
                            if (countries.includes(data.data[i].name)) continue;
                            data.data.splice(i, 1);
                        }

                        var abbreviations = Object.keys(data.services);
                        for (i = abbreviations.length - 1; i >= 0; i--) {
                            if (services.includes(data.services[abbreviations[i]])) {
                                minPriceServices.push(abbreviations[i]);
                            } else {
                                delete data.services[abbreviations[i]];
                            }
                        }

                        document.getElementById('showFullListCountry').style.display = 'none';
                        document.getElementById('selectOperator').style.display = 'none';
                        document.getElementsByClassName('search-country-wrapper')[0].style.display = 'none';
                        document.getElementsByClassName('search-wrapper')[0].style.display = 'none';
                        document.getElementById('favouriteCheckBox').parentElement.parentElement.style.display = 'none';

                        return success.apply(this, [data]);
                    }
                }

                if (void 0 !== settings.data && 'getNumbersStatusAndCostHubFree' === settings.data.action) {
                    success = settings.success;

                    settings.success = function(data) {
                        debugger;
                        for (var i = minPriceServices.length - 1; i >= 0; i--) {
                            var item = data[minPriceServices[i]];
                            if (void 0 === item) continue;

                            var prices = item.priceMap;
                            if (void 0 === prices) continue;

                            var priceList = Object.keys(prices);
                            if (priceList.length < 2) continue;

                            var lowestPrice = 0;
                            for (var j = priceList.length - 1; j >= 0; j--) {
                                var currentPrice = Number.parseFloat(priceList[j]);
                                if (currentPrice < Number.parseFloat(priceList[lowestPrice]))
                                    lowestPrice = j;
                            }

                            if (Number.parseFloat(priceList[lowestPrice]) !== item.maxPrice) {
                                setMaxPrice(minPriceServices[i], priceList[lowestPrice], $(".countryChange[choosed]").val(), false);
                            }
                        }

                        return success.apply(this, [data]);
                    }
                }

                return _ajax.apply($, [settings]);
            }
        });
    }

    var code = 'window.initPatches();';
    var script = document.createElement('script');
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
})();