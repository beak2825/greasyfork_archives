// ==UserScript==
// @name         WHMCS - Extra Toolkit
// @namespace    Digimol
// @version      0.2
// @description  QoL upgrades for WHMCS
// @author       Dave Mol
// @match        https://shop.idfnv.com/beheer/*
// @match        https://shop.wdmsh.com/beheer/*
// @match        https://sales.microglollc.com/beheer/*
// @match        https://pay4fee.net/bill/beheer/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/427472/WHMCS%20-%20Extra%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/427472/WHMCS%20-%20Extra%20Toolkit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currency = {};

    function calculate(from, to, value, $target) {
        fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
            .then(res => res.json())
            .then(res => {
            if (from === 'EUR') {
                value = value*1.1;
            } else {
                value = value*0.9;
            }
            const rate = res.rates[to];
            $target.val(Math.round((value * rate)).toFixed(2));
        })
    }

    function getCurrencyID(cur) {
        let id = '';
        $.each(currency, (k, v)=> {
            if(v === cur) {
                id = k;
            }
        });
        return id;
    }

    function getCurrent() {
        let currencies = {};
        $('#pricingtbl').find('input').each((k,v)=> {
            if (v.name) {
                let info = v.name.split('currency[')[1];
                let ID = currency[info.split(']')[0]];
                let typeInfo = info.split('][')[1];
                if(typeInfo && v.value > 0) {
                    let type = typeInfo.split(']')[0];
                    currencies[ID] = currencies[ID] || {};
                    currencies[ID][type] = v.value
                }
            }
        });
        return currencies;
    }

    function createButtons() {
        $('#pricingtbl').find('td').each((k,v)=> {
            if (~$(v).text().indexOf('Enable')) {
                let cur = $(v).next().find('input').attr('currency');
                let $row = $('<tr>');
                let $cell = $('<td>').attr('colspan', '10').appendTo($row);
                $.each(currency, function(i2,v2) {
                    if(v2 !== cur) {
                        let $btn = $('<button>').text('Convert from '+v2).attr('currency', v2).click((e)=> {
                            e.preventDefault();
                            let current = getCurrent();
                            $.each(current[cur], (i3,v3) => {
                                calculate(v2, cur, $('input[name="currency['+getCurrencyID(v2)+']['+i3+']').val(), $('input[name="currency['+getCurrencyID(cur)+']['+i3+']'));
                            });
                        }).appendTo($cell);
                    }
                });

                $('<input>', {
                    class: 'addsubnum'
                }).css({
                    'width': '60px'
                }).val(1).appendTo($cell);

                $('<button>').text('Add').click((e)=> {
                    e.preventDefault();
                    let current = getCurrent();
                    $.each(current[cur], (i3,v3) => {
                        let count = 0;
                        let num = $('.addsubnum').val();
                        if (i3 === 'monthly') {
                            count = num;
                        } else if (i3 === 'quarterly') {
                            count = num * 3;
                        } else if (i3 === 'semiannually') {
                            count = num * 6;
                        } else if (i3 === 'annually') {
                            count = num * 12;
                        }
                        $('input[name="currency['+getCurrencyID(cur)+']['+i3+']').val((parseFloat(v3) + parseFloat(count)).toFixed(2));
                    });
                }).appendTo($cell);

                $('<button>').text('Sub').click((e)=> {
                    e.preventDefault();
                    let current = getCurrent();
                    $.each(current[cur], (i3,v3) => {
                        let count = 0;
                        let num = $('.addsubnum').val();
                        if (i3 === 'monthly') {
                            count = num;
                        } else if (i3 === 'quarterly') {
                            count = num * 3;
                        } else if (i3 === 'semiannually') {
                            count = num * 6;
                        } else if (i3 === 'annually') {
                            count = num * 12;
                        }
                        $('input[name="currency['+getCurrencyID(cur)+']['+i3+']').val((parseFloat(v3) - parseFloat(count)).toFixed(2));
                    });
                }).appendTo($cell);
                $(v).parent('tr').after($row);
            }
        });
    }

    function getCurrencies() {
        $('#pricingtbl').find('input').each((k,v)=> {
            if (v.name) {
                let info = v.name.split('currency[')[1];
                let ID = info.split(']')[0];
                currency[ID] = v.id.split('_')[1];
            }
        });
    }

    let e = setInterval(()=> {
        if($('#pricingtbl').find('input').length) {
            clearInterval(e);
            getCurrencies();
            createButtons();
        }
    },10);

    const minimizeGroups = () => {
        let e1 = setInterval(()=> {
            if($('#tableBackground:not(.done)').length) {
                $('#tableBackground').addClass('done');
                clearInterval(e1);
                let $minimize = $('<button>').click((e)=> {
                    $('.list-group').hide();
                }).text('Minimize');

                let $maximize = $('<button>').click((e)=> {
                    $('.list-group').show();
                }).text('Maximize');

                $('#tableBackground').before($minimize);
                $('#tableBackground').before($maximize);
            }
        }, 250);
    }
    minimizeGroups();

    /* Add Domain Prices */
    let icur, i;
    $('<span>').text('Years').insertBefore($('.datatable'));

    $('<input>').attr({
        'name': 'dsm-years',
        'type': 'number',
        'min': '0',
        'max': '10',
    }).css({
        'width': '50px'
    }).val(5).insertBefore($('.datatable'));

    $('<button>').text('Enable').click((e)=> {
        e.preventDefault();
        let curCount = getCurrencyCount();
        let years = parseInt($('[name="dsm-years"]').val());
        for (icur = 1; icur < curCount + 1; icur++) {
            let $defaultRegister = $('[name="register[0]['+icur+'][1]"]');
            let $defaultTransfer = $('[name="transfer[0]['+icur+'][1]"]');
            let $defaultRenew = $('[name="renew[0]['+icur+'][1]"]');
            for (i = 2; i < years+1; i++) {
                let $register = $('[name="register[0]['+icur+']['+i+']"]').show();
                let $transfer = $('[name="transfer[0]['+icur+']['+i+']"]').show();
                let $renew = $('[name="renew[0]['+icur+']['+i+']"]').show();
                $('[name="enable[0]['+icur+']['+i+']"]').prop('checked', true);
                $register.val(round2Decimal(parseFloat($defaultRegister.val() * ('0.'+(100 - i)) * i).toFixed(2)));
                $transfer.val(round2Decimal(parseFloat($defaultTransfer.val() * ('0.'+(100 - i)) * i).toFixed(2)));
                $renew.val(round2Decimal(parseFloat($defaultRenew.val() * ('0.'+(100 - i)) * i).toFixed(2)));
                $('[name="enable[0]['+icur+']['+i+']"]').change();
            }
        }
    }).insertBefore($('.datatable'));

    const round2Decimal = (num) => {
        let good = num.split('.')[0];
        let bad = Math.round(num.split('.')[1]/ 10) * 10;
        return good + '.' + bad;
    }

    const getCurrencyCount = () => {
        let count = 0;
        for (i = 1; i < 20; i++) {
            if (!$('[name="enable[0]['+i+'][1]"]').length) {
                break;
            }
            count++;
        }
        return count;
    }
})();