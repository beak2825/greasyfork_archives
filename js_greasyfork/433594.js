

// ==UserScript==
// @name            Управление рекламой
// @namespace       virtonomica
// @version         1.0.2
// @description     Управление рекламой в маг и сервисах
// @author          Metro777
// @include         http*://virtonomic*.*/*/main/company/view/*/unit_list
// @icon            https://www.google.com/s2/favicons?domain=virtonomica.ru
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/433594/%D0%A3%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%BE%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/433594/%D0%A3%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%BE%D0%B9.meta.js
// ==/UserScript==


var run = function () {

    let units = {};
    let type_ids = {};

    let marketingCost = 0;
    let unitsErrorCount = 0;


    let setMarketingCampaign = function (typeIds, cost, unitIds, curUnitIndex, token) {
        console.log('setMarkCamp ' + curUnitIndex + ' cost:' + cost);

        if (curUnitIndex < unitIds.length) {
            let unitId = unitIds[curUnitIndex];


            ApiConnection.post({
                base_url: '/api/',
                url: '?action=unit/marketing/program/set&app=adapter_vrt',
                id: unitId,
                token: token,
                type_ids: typeIds,
                cost: cost
            }).then(function (marketingInfo) {
                curUnitIndex++;

                if (marketingInfo&& Number(marketingInfo.advertising_program_money_cost) === cost) {
                    $("td#campStatus_" + unitId).html('ok');
                    $("input#us_" + unitId).prop('checked', false);
                    units[unitId].checked=false;
                } else {
                    unitsErrorCount++;
                    $("td#campStatus_" + unitId).html('error');
                }

                $("div#campaignInfo").html('<span class="margin-5-left"><div class="col-sm-12 unit-name">Обработано: ' + (curUnitIndex) + ' из ' + unitIds.length + '(ошибок:' + unitsErrorCount + ') </div> </span>');
                setMarketingCampaign(typeIds, cost, unitIds, curUnitIndex, token);
            }).catch(function() {
                curUnitIndex++;
                 unitsErrorCount++;
                    $("td#campStatus_" + unitId).html('error');
                 $("div#campaignInfo").html('<span class="margin-5-left"><div class="col-sm-12 unit-name">Обработано: ' + (curUnitIndex) + ' из ' + unitIds.length + '(ошибок:' + unitsErrorCount + ') </div> </span>');
                setMarketingCampaign(typeIds, cost, unitIds, curUnitIndex, token);
            });

        }
    };

    let stopMarketingCampaign = function () {
        unitsErrorCount = 0;
        ApiConnection.get({
            base_url: '/api/',
            url: '?action=token&app=virtonomica',
        }).then(function (token) {
            console.log('token: ' + token);
            let unitIds = [];
            for (let id in units) {
                if (units[id].checked) {
                    unitIds.push(id);
                    $("td#campStatus_" + id).html('pending');
                } else {
                    $("td#campStatus_" + id).html('');
                }
            }
            setMarketingCampaign(null, 0, unitIds, 0, token);
        });
    };


    let startMarketingCampaign = function () {
        unitsErrorCount = 0;
        ApiConnection.get({
            base_url: '/api/',
            url: '?action=token&app=virtonomica',
        }).then(function (token) {
            console.log('token: ' + token);
            let unitIds = [];
            for (let id in units) {
                if (units[id].checked) {
                    unitIds.push(id);
                    $("td#campStatus_" + id).html('pending');
                } else {
                    $("td#campStatus_" + id).html('');
                }
            }
            let typeIds = Object.keys(type_ids);
            setMarketingCampaign(typeIds, marketingCost, unitIds, 0, token);
        });
    };

    let checkStatusOfButtons = function () {
        let startButton = $("button#startMarketingCampaign");
        let stopButton = $("button#stopMarketingCampaign");
        let isStartDisabled = true;
        let isStopDisabled = true;

        if (marketingCost === 0) {
            isStartDisabled = true;
        } else {

            if (Object.keys(type_ids).length > 0) {
                isStartDisabled = false;
            } else {
                isStartDisabled = true;
            }
        }

        for (let id in units) {
            if (units[id].checked) {
                isStopDisabled = false;
                break;
            }
        }
        if (isStopDisabled && !isStartDisabled) isStartDisabled = true;

        if (startButton.prop('disabled') != isStartDisabled) startButton.prop('disabled', isStartDisabled);
        if (stopButton.prop('disabled') != isStopDisabled) stopButton.prop('disabled', isStopDisabled);
    }

    let initTableColumns = function () {
        if ($('input#selectAllUnits').length === 0) {
            console.log("init table columns");
            $('thead#unitlist-sort-controls>tr').append('<th><input type="checkbox" name="allselect" id="selectAllUnits"/></th>');
            $('thead#unitlist-sort-controls>tr').append('<th>Статус</th>');
            for (let id in units) {
                units[id].checked = false;
            }

            $('table[class*="unit_list_table"]>tbody>tr').each(function () {
                let self = $(this);
                let id = self.attr("data-id");
                if (id) {
                    let unit = units[id];
                    if (!unit) {
                        unit = { checked: false };
                        units[id] = unit;
                    }
                    self.append('<td><input type="checkbox" name="units_selected" value="' + id + '" id="us_' + id + '" /></td>');
                    self.append('<td id="campStatus_' + id + '"></td>');
                }

            });

            $('input#selectAllUnits').change(function () {
                for (let id in units) {
                    let checked = $(this).prop('checked');
                    units[id].checked = checked;
                    $('input#us_' + id).prop('checked', checked);
                }
                checkStatusOfButtons();
            });

            for (let id in units) {
                $('input#us_' + id).change(function () {
                    let checked = $(this).prop('checked');
                    units[id].checked = checked;
                    checkStatusOfButtons();
                });
            }
        }
    };



    let initParamsBlock = function () {

        if ($('button#startMarketingCampaign').length == 0) {
            $('div#units-w-filter>div[class="row filters"]').append('</br>\
                <div class="col-md-12 col-sm-12">\
                     <div style="background-color:#364150;color:white;padding:4px;margin:4px">Реклама</div>\
                     <div  style="padding:20px"><div class="mt-checkbox-list office-marketing-cols-helper">\
					    <label class="mt-checkbox mt-checkbox-outline">\
						    <input type="checkbox" name="type_ids[]" value="2260" data-bind=""> Интернет <span></span>\
						</label>\
						<label class="mt-checkbox mt-checkbox-outline">\
							<input type="checkbox" name="type_ids[]" value="2261" data-bind=""> Печатные издания <span></span>\
						</label>\
						<label class="mt-checkbox mt-checkbox-outline">\
							<input type="checkbox" name="type_ids[]" value="2262" data-bind=""> Наружная реклама <span></span>\
						</label>\
						<label class="mt-checkbox mt-checkbox-outline">\
							<input type="checkbox" name="type_ids[]" value="2263" data-bind=""> Радио <span></span>\
						</label>\
						<label class="mt-checkbox mt-checkbox-outline">\
							<input type="checkbox" name="type_ids[]" value="2264" data-bind=""> Телевидение	<span></span>\
						</label><br />\
                      </div>\
                 </div>\
                 <li class="list-group-item"> Расходы в неделю <span class="money pull-right width50">\
					  <input type="text" id="marketingCostInput" value="0" class="form-control input-inline input-medium money virMoneyMask text-right" style="max-width: 100%; text-align: right;" data-bind="" inputmode="numeric"> \
                      </span>\
			     </li>\
                 <div class="col-md-12 col-sm-12" id="campaignInfo" /> \
                 <div class="col-md-12 col-sm-12">\
                      <div style="padding:10px;">\
                           <div style="margin:4px">\
                                <button id="startMarketingCampaign" class="btn btn-circle btn-primary" >Начать рекламную кампанию</button>&nbsp;\
                                <button id="stopMarketingCampaign" class="btn btn-circle" >Остановить рекламную кампанию</button>\
                           </div>\
                      </div>\
                  </div>\
               ');


            checkStatusOfButtons();

            $('input[name="type_ids[]"').change(function () {
                if ($(this).prop("checked")) {
                    type_ids[$(this).prop("value")] = true;
                } else {
                    delete type_ids[$(this).prop("value")];
                }
                checkStatusOfButtons();
            });

            $('input#marketingCostInput').change(function () {
                marketingCost = Number($(this).val());
                checkStatusOfButtons();
            });

            $('button#startMarketingCampaign').on('click', function () {
                startMarketingCampaign();
            });

            $('button#stopMarketingCampaign').on('click', function () {
                stopMarketingCampaign();
            });

        }

    };



    initParamsBlock();
    initTableColumns();

    $('div#mainContent').bind('DOMSubtreeModified', function () {
        initParamsBlock();
        initTableColumns();
    });


};


if (window.top == window && (window.location.href.indexOf('main/company/view') >= 0)) {
    var script = document.createElement('script');
    script.textContent = ' (' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}
