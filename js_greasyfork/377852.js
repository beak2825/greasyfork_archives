// ==UserScript==
// @name         Pyszne custom filter/sort
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  adds custom range filtering and sorting
// @author       dahomej
// @match        *.pyszne.pl/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/377852/Pyszne%20custom%20filtersort.user.js
// @updateURL https://update.greasyfork.org/scripts/377852/Pyszne%20custom%20filtersort.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function(){
        function addFilter(ob, name) {
            var val = ob.value;
            if (!val && val !== 0) {
                val = -1;
            }
            var filterObject = {};
            filterObject[name] = val;
            filter(filterObject);
        }

        function cleanRegex(txt) {
            txt = '.*' + txt.replace(/ +/g, '.*') + '.*';
            return txt;
        }

        function clean(txt) {
            return txt.replace(/\s{2,}/g, ' ').trim();
        }

        function addSum(rest) {
            if ($(rest.node).find('.sum').length > 0) {
                return;
            }

            var formatted = 'Suma: ' + rest.sum.toFixed(2) + ' zł';
            $(rest.node).find('.min-order').after(
                $('<div></div>')
                .addClass('sum')
                .html(formatted)
            );
        }

        function parse(rest) {
            var mapped = {
                node: rest
            };

            var deliveryText = clean($(rest).find('.delivery-cost').eq(0).text());
            mapped.delivery = deliveryText !== 'GRATIS'
                ? parseFloat(deliveryText.replace(',', '.').replace(/ .+/, ''))
                : 0.0;
            let deltimeString = $(rest).find('.avgdeliverytime').text();
            let deltimeMatch;
            if (deltimeString) {
                deltimeMatch = deltimeString.match(/ok\. (\d+)/);
            }
            if (deltimeMatch && deltimeMatch.length > 0) {
                mapped.time = parseInt(
                    deltimeMatch[1]
                    .replace(/ok\. +/g, '')
                    .replace('min', '')
                );
            } else {
                mapped.time = 999;
            }
            mapped.min = parseFloat(
                $(rest).find('.min-order').text()
                .replace('Min. ', '')
                .replace(',', '.')
                .replace(/ .+/, '')
            );
            mapped.kitchen = clean($(rest).find('.kitchens').eq(0).text());
            mapped.name = clean($(rest).find('.restaurantname').eq(0).text());
            mapped.sum = mapped.min + mapped.delivery;
            mapped.closed = $(rest).find('.open.closed').length > 0;

            addSum(mapped);

            return mapped;
        }

        function getAll() {
            return $('.listing-inner .restaurant')
            .map(function() {
                return parse(this);
            });
        }

        function filterPassed(key, fval, rval) {
            if (key !== 'kitchen') {
                if (fval[0] === '-') {
                    fval = parseFloat(fval.substring(1));
                    return rval >= fval;
                } else {
                    return rval <= fval;
                }
            } else {
                fval = fval.toLowerCase().split(/\s+/);
                rval = rval.toLowerCase();
                return !fval.some(f => !rval.includes(f));
            }
        }

        var globalFilter = {};
        var filtered = [];
        var failed = [];
        function filter(attrs) {
            filtered = [];
            failed = [];

            for (var key in attrs) {
                globalFilter[key] = attrs[key];
            }

            var rests = getAll()
            .each((i,r) => {
                var valid = true;
                for (var key in globalFilter) {
                    var fval = globalFilter[key];
                    var rval = r[key];
                    valid = valid && (fval === -1 || filterPassed(key, fval, rval));
                }
                if (valid && !r.closed) {
                    $(r.node).show();
                    filtered.push(r);
                } else {
                    failed.push(r);
                    $(r.node).hide();
                }
            });

            updateCounter();
            if (!globalSort) {
                return;
            }

            sortRests();
        }

        function updateCounter() {
            $('.title.restaurants-counter span').html(filtered.length);
        }

        var globalSort;
        function sortRests() {
            if (!globalSort) {
                return;
            }
            var gs = globalSort;
            gs = gs.split(',');

            if (!filtered || filtered.length === 0) {
                filtered = [];
                getAll().each((i,r) => filtered.push(r));
            }
            $('#irestaurantlist .restaurant.grid:not(#SingleRestaurantTemplateIdentifier)').remove();
            var wrapper = $('#irestaurantlist');
            filtered.sort((a,b) => {
                for (var i = 0; i < gs.length; i++) {
                    var g = gs[i];
                    var multip = 1;
                    if (g[0] === '-') {
                        multip = -1;
                        g = g.substring(1);
                    }
                    var va = a[g];
                    var vb = b[g];
                    if (va !== vb) {
                        return multip * (va - vb);
                    }
                }
                return 0;
            });
            filtered.concat(failed).forEach(f => {
                $(wrapper).append($(f.node));
            });
        }

        $('div.restaurants-counter').before(
            $('<div></div>')
            .attr('id', 'custom-filter')
            .css({
                'width': '100%',
                'min-height': '200px'
            })
            .append(
                $('<span></span><br/>')
                .html('sort (?)')
                .attr('title', 'delivery, time, min, sum; separated by comma(,); - for reversed')
                .attr('id', 'sort-input')
            )
            .append(
                $('<input/><br/>')
                .attr('id', 'sort')
                .on('change', function(){
                    var val = this.value;
                    globalSort = val;
                    sortRests();
                })
            )
            .append(
                $('<span></span><br/>')
                .html('limit sumy')
            )
            .append(
                $('<input/><br/>')
                .on('change', function(){addFilter(this, 'sum')})
            )
            .append(
                $('<span></span><br/>')
                .html('limit czasu dostawy')
            )
            .append(
                $('<input/><br/>')
                .on('change', function(){addFilter(this, 'time')})
            )
            .append(
                $('<span></span><br/>')
                .html('limit kosztu dostawy')
            )
            .append(
                $('<input/><br/>')
                .on('change', function(){addFilter(this, 'delivery')})
            )
            .append(
                $('<span></span><br/>')
                .html('limit minimalnej kwoty')
            )
            .append(
                $('<input/><br/>')
                .on('change', function(){addFilter(this, 'min')})
            )
            .append(
                $('<span></span><br/>')
                .html('kuchnia zawiera')
                .attr('id', 'kitchen-input')
            )
            .append(
                $('<input/><br/>')
                .on('change', function(){addFilter(this, 'kitchen')})
            )
        );

        $('#custom-filter input').css({
            'margin-bottom': '1em'
        });
        $('#custom-filter span:not(#kitchen-input):not(#sort-input)').each(function() {
            var html = $(this).html();
            html += ' (?)';
            $(this).html(html)
            .attr('title', '- for greater or equal');
        });
    });
})();