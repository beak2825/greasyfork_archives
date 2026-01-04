

// ==UserScript==
// @name            Оптовое слияние
// @namespace       virtonomica
// @version         1.0.1
// @description     Оптовое слияние по выбранному подразделению
// @author          Metro777
// @include         http*://virtonomic*.*/*/main/unit/view/*
// @icon            https://www.google.com/s2/favicons?domain=virtonomica.ru
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/433475/%D0%9E%D0%BF%D1%82%D0%BE%D0%B2%D0%BE%D0%B5%20%D1%81%D0%BB%D0%B8%D1%8F%D0%BD%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/433475/%D0%9E%D0%BF%D1%82%D0%BE%D0%B2%D0%BE%D0%B5%20%D1%81%D0%BB%D0%B8%D1%8F%D0%BD%D0%B8%D0%B5.meta.js
// ==/UserScript==


var run = function () {
    let isMergeExtBinded = false;
    let isMergeExec = false;
    let mergedCount = 0;

    let unitId = document.location.href.substring(document.location.href.indexOf("/unit/view") + 11).match(/\d+/g).join('').trim();


    console.log(unitId);
    let cancelExec = function () {
        isMergeExec = false;
        $('button#mergeStartButton').show();
        $('button#mergeCancelButton').hide();
        ApiConnection.get({
            base_url: '/api/',
            url: '?action=unit/merge/cnt&app=adapter_vrt',
            id: unitId
        }).then(function (totalMergeCount) {
            $("div#totalAvailMerge").html('Всего доступных слияний: ' + totalMergeCount);
        });
    }

    let mergeExec = function (token) {
        if (isMergeExec) {
            ApiConnection.get({
                base_url: '/api/',
                url: '?action=unit/merge/browse&app=adapter_vrt',
                id: unitId
            }).then(function (mergeUnits) {
                if (!Array.isArray(mergeUnits)) {
                    let ids = Object.keys(mergeUnits);
                    if (ids.length > 0) {

                        ApiConnection.post({
                            base_url: '/api/',
                            url: '?action=unit/merge/go&app=adapter_vrt',
                            token: token,
                            id: unitId,
                            ids: ids
                        }).then(function (res) {
                            if (res == unitId) {
                                console.log('merged: ' + ids.length);
                                mergedCount += ids.length;
                                $("div#mergeInfo").html('<span class="margin-5-left"><div class="col-sm-12 unit-name">Выполнено: ' + mergedCount + ' </div> </span>');
                                mergeExec(token);
                            } else {
                                $("div#mergeInfo").html('<span class="margin-5-left"><div class="col-sm-12 unit-name">Произошла ошибка</div> </span>');
                                cancelExec();
                            }
                        });
                    } else cancelExec();
                } else cancelExec();
            });
        }


    };

    let init = function (tabMerge) {

        ApiConnection.get({
            base_url: '/api/',
            url: '?action=my/company&app=virtonomica',
        }).then(function (company) {

            tabMerge.append('<div class="row"><div class="col-sm-12 unit-name">Компания "' + company.name + '"</div></div>');

            ApiConnection.get({
                base_url: '/api/',
                url: '?action=unit/merge/cnt&app=adapter_vrt',
                id: unitId
            }).then(function (totalMergeCount) {

                tabMerge.append('<div class="row"><div class="col-sm-12 unit-name" id="totalAvailMerge">Всего доступных слияний: ' + totalMergeCount + '"</div></div>');
                tabMerge.append('<div class="row"  id="mergeInfo"></div>');
                if (Number(totalMergeCount) > 0) {
                    ApiConnection.get({
                        base_url: '/api/',
                        url: '?action=token&app=virtonomica',
                    }).then(function (token) {
                        console.log('token: ' + token);
                        tabMerge
                            .append('<div class="row"><div class="col-sm-12 unit-name"><span class="pull-right width60"><button id="mergeStartButton" class="btn btn-sm btn-circle">Начать оптовое слияние</button><button id="mergeCancelButton" class="btn btn-sm btn-circle">Отмена</button></span></div></div>');
                        $("button#mergeCancelButton").hide();
                        $("button#mergeStartButton").on("click", function () {
                            $('button#mergeStartButton').hide();
                            $('button#mergeCancelButton').show();
                            mergedCount = 0;
                            isMergeExec = true;
                            mergeExec(token);
                        });

                        $("button#mergeCancelButton").on("click", function () {
                            cancelExec();
                        });
                    });
                }

            });

        });

    };

    $('div#unit-info').bind('DOMSubtreeModified', function () {

        let tabMerge = $('div#unit-merge-tab[class="tab-pane active"]');

        if (tabMerge.length == 1) {
            if (!isMergeExtBinded) {
                isMergeExtBinded = true;
                init(tabMerge);
                console.log("merge open");
            }
        }
    });
};


if (window.top == window && (window.location.href.indexOf('main/unit/view') >= 0)) {
    var script = document.createElement('script');
    script.textContent = ' (' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}

