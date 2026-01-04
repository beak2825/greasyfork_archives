// ==UserScript==
// @name         queryPlatformBodyByVinAndVehicle
// @namespace    http://mytesttampermonkey.net/
// @version      0.004
// @description  调用现有接口通过vin获取车型
// @include      http*://issue.cpic.com.cn/*
// @author       mmyy
// @require https://cdn.bootcss.com/underscore.js/1.9.0/underscore-min.js
// @require https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @resource https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.css

// @grant GM_getValue
// @grant GM_setValue
// @run-at document-idle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/389522/queryPlatformBodyByVinAndVehicle.user.js
// @updateURL https://update.greasyfork.org/scripts/389522/queryPlatformBodyByVinAndVehicle.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var localHref = window.location.href;
    //不是投保信息页签返回
    var pageType = 0;
    if (localHref.indexOf("insuranceInfo") > -1) {
        pageType = 3;
    } else if (localHref.indexOf("insurancePlan") > -1) {
        pageType = 2;
    }
    else if (localHref.indexOf("carInfo") > -1) {
        pageType = 1;//车辆信息页面
    } else if (localHref.indexOf("quotation_search") > -1) {
        pageType = 4;//报价查询
    }

    if (pageType == 4) {

    }
    if (pageType == 2) {

    }
    if (pageType == 1) {
        //set a text label
        var modelType = $("#modelType");
        modelType.on('dblclick', function (e) {
            var plateNo = $("#plateNo").val();
            var stRegisterDate = $("#stRegisterDate").val();
            var carVIN = $("#carVIN").val().replace(/ /g, "");
            var vehicleType = $("#vehicleType").val();
            var usage = $("#usage").val();
    
            carVIN = $("#carVIN").val().replace(/ /g, "");
            if (carVIN.length != 17) {
                console.log("VIN位数不是17位:" + carVIN);
            }
            var settings = {
                "async": true,
                "dataType": "JSON",
                "crossDomain": true,
                "url": "http://issue.cpic.com.cn/ecar/ecar/queryPlatformBodyByVinAndVehicle",
                "method": "POST",
                "headers": {
                    "content-type": "application/json;charset=UTF-8"

                },
                "data": "{\"meta\":{\"pageNo\":1},\"redata\":{\"plateNo\":\""+plateNo+"\",\"carVIN\":\"" + carVIN + "\",\"engineNo\":\"1111111\",\"stRegisterDate\":\""+stRegisterDate+"\",\"vehicleType\":\"" + vehicleType + "\",\"usage\":\"" + usage + "\"}}"
            }

            $.ajax(settings).done(function (response) {
                var modelTypeArray = response.result;
                var arraySorted = _.sortBy(modelTypeArray, function (cur) { return cur.modelFlag == "1"; });
                var arraySortedByYear = _.sortBy(arraySorted, 'year desc');
                var finalModel = arraySortedByYear.length > 0 ? arraySortedByYear[arraySortedByYear.length - 1] : null;
                // $("#modelType").val(finalModel.name);
                // $("#factoryType").val(finalModel.name);
                // $("#moldCharacterCode").val(finalModel.moldCharacterCode);
                
                settings = {
                    "async": true,
                    "dataType": "JSON",
                    "crossDomain": true,
                    "url": "http://issue.cpic.com.cn/ecar/ecar/queryCarModel",
                    "method": "POST",
                    "headers": {
                        "content-type": "application/json;charset=UTF-8"
    
                    },
                    "data": "{\"meta\":{},\"redata\":{\"name\":\""+finalModel.name+"\"}}"
                }
                $.ajax(settings).done(function (response) {
                    var searchModel = response.result;
                    var finalModelArray=  _.filter( _.sortBy(searchModel, 'year desc' ),function(temp){
                        return stRegisterDate.split("-")[0]>=temp.year;
                    });
                    var finalModel = finalModelArray.length > 0 ? finalModelArray[0] : null;
                    var accurateAssignment = unsafeWindow.accurateAssignment;
                    if (accurateAssignment) {
                        accurateAssignment(finalModel);
                    }
                });
               
            });

        });

    }

})();