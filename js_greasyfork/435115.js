// ==UserScript==
// @name VIRTA::Sale Price Help
// @description Помощь при работе со страницей сбыта у складов
// @namespace virtonomica
// @author SAQOT
// @version 1.7
// @include https://virtonomica.ru/*/main/unit/view/*/sale
// @include https://virtonomica.ru/*/main/unit/view/*/sale#*
// @include https://virtonomica.ru/*/main/unit/view/*/sale?*
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/435115/VIRTA%3A%3ASale%20Price%20Help.user.js
// @updateURL https://update.greasyfork.org/scripts/435115/VIRTA%3A%3ASale%20Price%20Help.meta.js
// ==/UserScript==

/* global $, unsafeWindow, ajaxTools */

let run = function () {
    let win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
    
    // ==================================================
    let ver = '1.7';
    
    function consoleEcho(text, isRrror = false) {
        const bg = isRrror === true ? '#af1a00' : '#3897c7'
        console.log(`\n %c VIRTA::SPH / ${ver} %c ${text} \n\n`, 'color: #FFFFFF; background: #030307; padding:5px 0;', `color: #FFFFFF; background: ${bg}; padding:5px 0;`);
    }
    
    consoleEcho('Помощь при работе со страницей сбыта у складов');
    // ==================================================
    
    const matches = window.location.href.match(/\/(\w+)\/main\/unit\/view\/(\d+)\/sale/);
    const realm = matches[1];
    if (!realm) {
        consoleEcho('realm не определен', true);
        return;
    }
    const unitID = matches[2];
    if (!unitID) {
        consoleEcho('unitID не определен', true);
        return;
    }
    
    let $rows = null;
    function getRows() {
        if ($rows === null) {
            $rows = $(".sales-cards .item").not(".is_empty").find('.row');
        }
        return $rows;
    }
    
    function setShowHideSetPrice($link) {
        const $linkText = $link.find('.info');

        if ($link.hasClass('tohide')) {
            const $rows = getRows();
            $rows.each(function () {
                const $row = $(this);
    
                const $worldprice = $row.find(".world-price");
                const worldprice = $worldprice.length > 0 ? parseInt($worldprice.attr("data-price")) : 0;

                const price = Math.ceil($row.find("input[name=price]").val());
                const offer = parseInt($row.find("select[name=offer_constraint]").val());
                let cnt = $row.find('div').eq(1).find('tbody tr').eq(0).find('td').eq(1).html();
                cnt = parseInt(cnt.replace(/&nbsp;/gi, ''));

                if (cnt > 0 && (price === 0 || offer === 0)) {
                    $row.show();
                } else {
                    if (worldprice && (worldprice/price) >= 1.5 && offer !== 3) {
                        $row.show();
                    } else {
                        $row.hide();
                    }
                }

            });
            $link.removeClass('tohide');
            $linkText.html('Показать все');
        } else {
            $rows.each(function () {
                $(this).show();
            });
            $link.addClass('tohide');
            $linkText.html('Показать где надо проставить цену');
        }
        
    }
    
    function setStopSaleNull($link) {
        const $linkIcon = $link.find('.fa');
        const $linkText = $link.find('.info');

        $linkText.html('Снимаем');
        $link.addClass('disabled');
        $linkIcon.show();
        
        const $rows = getRows();
        let cntAll = $rows.length;
        let cntCur = 0;
        $rows.each(function () {
            const $row = $(this);
            
            const $inputPrice = $row.find("input[name=price]");
            const $selectOffer = $row.find("select[name=offer_constraint]");
            let cnt = $row.find('div').eq(1).find('tbody tr').eq(0).find('td').eq(1).html();
            cnt = parseInt(cnt.replace(/&nbsp;/gi, ''));
            if (!cnt) {
                $inputPrice.val('0').addClass('bg-danger').trigger("change");
                $selectOffer.val(0).addClass('danger').trigger("change");
                
                const $fieldset = $row.parent().find("fieldset");
                if ($fieldset.length) {
                    $fieldset.hide();
                }
                
                const $button = $row.find('button.btn-success');
                $button.trigger("click");
                cntCur++;
            }
            cntAll--;
            if (cntAll <= 0) {
                $linkIcon.hide();
                $linkText.html(`Сняли с продажи (${cntCur})`);
                $link.removeClass('disabled');
            }
        });
    }
    
    let $LINK_INFO = null;
    let $LINK_ICON = null;
    
    function setMinPrice() {
        $LINK_ICON.show();
        $LINK_INFO.addClass('disabled');

        const $rows = getRows();
        const cntAll = $rows.length;
        let cntCur = 0;
        $rows.each(async function () {
            
            const $row = $(this);
            const $form = $row.find('form');
            const $inputPrice = $row.find("input[name=price]");
            const productId = $form.attr('data-product_id');
            
            let $info = $row.find('div').eq(1).find('tbody tr').eq(1);
            let quality = $info.find('td').eq(1).html();
            let price = $info.find('td').eq(2).html();
            
            quality = parseFloat(quality);
            if (quality === 'NaN') {
                quality = null;
            }
            price = parseInt(price);
            if (price === 'NaN') {
                price = null;
            }
            if (quality) {
                
                let minPrice = await getMinPriceProduct(productId, quality, price);
                
                let $linkShowTable = $(`<button class="popovers link" data-trigger="hover" data-placement="right" data-content="Маркетинговый отчёт" data-link="https://virtonomica.ru/api/${realm}/main/index?id=10264116&product_id=${productId}&brandname_id=0&quantity=0&free_for_buy=1&tpl=unit/supply/materials-select&ajax=1&app=adapter_vrt&format=html&free_for_buy=10&sort=total_cost/asc&quality_from=1&quality_to=${quality}" data-target="marketing-report-offers" data-bind="yes" data-original-title="" title=""><i class="fa fa-eye"></i></button>`);
                $linkShowTable.on('click', function (e) {
                    e.preventDefault();
                    let d = $(this);
                    let val = d.val() || d.attr("data-value");
                    let url = (d.attr("data-link") || d.attr("action") || d.attr("href")) + "&" + d.attr("data-param") + "=" + val;
                    let target = d.attr("data-target");
                    
                    ajaxTools.loadContentStart({
                        url       : url,
                        target    : target,
                        wrap_level: d.attr("data-wrap") || 0,
                        caller    : d,
                        fill_model: d.attr("data-model"),
                    });
                });
    
                const $blockSetPtrice = $form.find('.block_set-price');
    
                if ($blockSetPtrice.length) {
                    $blockSetPtrice.remove();
                }
    
                const $block = $(`<span class="block_set-price"></span>`)
                
                const $btnRow = $(`<div class="btn-group btn-group-xs btn-group-solid normal">
								<a class="btn btn-default btn-xs action_set-price" data-price="${(minPrice.price - (minPrice.price * (10 / 100))).toFixed(0)}">-10%</a>
								<a class="btn btn-default btn-xs action_set-price" data-price="${minPrice.price}">100%</a>
								<a class="btn btn-default btn-xs action_set-price" data-price="${(minPrice.price + (minPrice.price * (10 / 100))).toFixed(0)}">+10%</a>
							</div>`)
                
                const $btnSetPtrice = $btnRow.find('.action_set-price');
                $btnSetPtrice.on('click', function (e) {
                    e.preventDefault();
                    let price_ = $(this).attr("data-price");
                    $inputPrice.val(price_).trigger("change");
                });
                
                
                $block.append($linkShowTable);
                $block.append(`<span class="text-muted world-price" data-price="${minPrice.price}" style="margin: 0 5px;">${minPrice.price.toLocaleString('ru')}</span><sup class="text-muted">(${minPrice.quality})</sup>`);
                $block.append($btnRow);
                
                const $br = $form.find('br');
                $br.before($block);
                
            } else {
                $form.find('br').before(`<span class="text-muted world-price" data-price="0" style="margin: 0 5px;">- -</span>`);
            }
            
            cntCur++;
            $LINK_INFO.html(`Получаем ${cntCur} из ${cntAll}`);
            
            if (cntCur >= cntAll) {
                $LINK_ICON.hide();
                $LINK_INFO.html('Получить цены еще раз');
                $LINK_INFO.removeClass('disabled');
            }
            
        });
        
        
    }
    
    function getMinPriceProduct(productId, qualityTo, priceTo) {
        return new Promise((resolve) => {
            let qualityFrom = parseInt(qualityTo - (qualityTo * (40 / 100)));
            //let qualityTo_ = parseInt(qualityTo + (qualityTo * (40 / 100)));
            let url = `https://virtonomica.ru/api/${realm}/main/unit/supply/offers?ajax=1format=json&id=${unitID}&type=product&product_id=${productId}&total_price_from=1&quality_from=${qualityFrom}&supplier_type=all&free_for_buy=100&pagesize=50&sort=total_cost/asc`;
            $.ajax({
                async      : true,
                type       : 'GET',
                url        : url,
                crossDomain: true,
                xhrFields  : {
                    withCredentials: true,
                },
                global     : false,
                dataType   : "json",
                success    : function (r) {
                    setTimeout(function () {
                        let minPrice = {
                            'qualityTo': qualityTo,
                            'quality'  : 0,
                            'price'    : 0,
                            'prodId'   : productId,
                            'url'      : url,
                        };
                        
                        // ID наших из корпы
                        const corpIds = ['5027655','9008332','9666700','9327555','8011747','9675701','10090070','5027655','8917760','8349019','2860133','9424595','4812158','5457719','7421495','6767180'];
                        let res = Object.values(r.data).filter(x => x['self_flag'] === 'f' && !corpIds.includes(x['company_id']));
    
                        
                        res.sort(function (a, b) {
                            return a['price'] - b['price'];
                        })
                        
                        
                        for (let i = 0; ; i++) {
                            if (res[i] === undefined) {
                                if (minPrice.quality === 0) {
                                    const ii = i === 0 ? 0 : i - 1;
                                    if (res[ii] !== undefined) {
                                        minPrice.quality = parseFloat(res[ii]['quality']).toFixed(2);
                                        minPrice.price = parseInt(res[ii]['price']);
                                        minPrice.id = res[ii]['id'];
                                    }
                                }
                                
                                break;
                            }
                            const v = res[i];
                            const quality = parseFloat(v.quality).toFixed(2);
                            const price = parseInt(v.price);
                            
                            if ((price / priceTo) > 1000) {
                                console.log('return > 1000')
                                continue;
                            }
                            
                            if (quality >= qualityTo) {
                                const ii = i === 0 ? 0 : i - 1;
                                minPrice.quality = parseFloat(res[ii]['quality']).toFixed(2);
                                minPrice.price = parseInt(res[ii]['price']);
                                minPrice.id = res[ii]['id'];
                                break;
                            }
                        }
                        
                        resolve(minPrice);
                    }, 10);
                },
                error      : function (jqXHR, textStatus, error) {
                    consoleEcho(`FAIL (ajax) {textStatus=${textStatus} , error=${error}}`, true);
                },
            });
        });
    }
    
    function initRun() {
        const $block = $(`<div class="pull-left"></div>`);
        $('#main-tab>.row>div').prepend($block);
        
        
        const $link = $(`<a href="" class="btn-link"><span class="fa fa-circle-o-notch fa-spin" style="display: none"></span> <span class="info">Получить цены</span></a>`);
        $LINK_INFO = $link.find('.info');
        $LINK_ICON = $link.find('.fa');
        
        $link.on('click', function (e) {
            e.preventDefault();
            if ($LINK_INFO.hasClass('disabled')) {
                return;
            }
            setMinPrice();
        });
        
        $block.append($link);
        
        
        const $linkStopSaleNull = $(`<a href="" class="btn-link"><span class="fa fa-circle-o-notch fa-spin" style="display: none"></span> <span class="info">Снять с продажи пустые слоты</span></a>`);
        $linkStopSaleNull.on('click', function (e) {
            e.preventDefault();
            const $el = $(this);
            if ($el.hasClass('disabled')) {
                return;
            }
            setStopSaleNull($el);
        });
        $block.append('<span> · </span>');
        $block.append($linkStopSaleNull);
    
    
        const $linkSetPrice = $(`<a href="" class="btn-link tohide"><span class="info">Показать где надо проставить цену</span></a>`);
        $linkSetPrice.on('click', function (e) {
            e.preventDefault();
            const $el = $(this);
            setShowHideSetPrice($el);
        });
        $block.append('<span> · </span>');
        $block.append($linkSetPrice);
    }
    
    setTimeout(function () {
        initRun();
    }, 100);
    
}

if (window.top === window) {
    let script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}