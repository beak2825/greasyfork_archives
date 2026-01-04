// ==UserScript==
// @name         京东玩客云抢购
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  测试版20171211  脚本起始页:http://yushou.jd.com/member/qualificationList.action
// @author       You
// @match        *://*.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368305/%E4%BA%AC%E4%B8%9C%E7%8E%A9%E5%AE%A2%E4%BA%91%E6%8A%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/368305/%E4%BA%AC%E4%B8%9C%E7%8E%A9%E5%AE%A2%E4%BA%91%E6%8A%A2%E8%B4%AD.meta.js
// ==/UserScript==


(function () {
    'use strict';

    //脚本起始页:
    //http://yushou.jd.com/member/qualificationList.action

    //默认山东  访问:https://easybuy.jd.com/address/getAddressByIp.action   修改为provinceJDCode 后面的数字
    var Area = 13;
    //蓝,黑,橙
    var ProductList = new Array();

    if (ProductList.length == 0)
        ProductList = ['4993773', '4993737', '4993751'];
    var ProductSN = new Array();

    //默认地址获取
    var DefaultAddress = { IsSuccess: false };

    //获取默认地址
    var GetAddress = function (product) {
        $.ajax({
            url: '//marathon.jd.com/async/getUsualAddressList.action?skuId=' + product,
            dataType: "json",
            scriptCharset: "utf-8",
            success: function (address) {
                DefaultAddress = $.map(address, function (v) { if (v.defaultAddress) return v; })[0];
                DefaultAddress.IsSuccess = true;
                console.log(address);
                Submit(product);
            }
        });
    };

    //提交订单
    var Submit = function (product) {

        /*********save_Consignee()**************/
        $("#submitUsualAddressId").val(DefaultAddress.id);
        $("#submitName").val(DefaultAddress.name);
        $("#submitMobile").val(DefaultAddress.mobileWithXing);
        $("#submitMobileKey").val(DefaultAddress.mobileKey);
        $("#submitProvinceId").val(DefaultAddress.provinceId);
        $("#submitCityId").val(DefaultAddress.cityId);
        $("#submitCountyId").val(DefaultAddress.countyId);
        $("#submitTownId").val("");
        $("#submitEmail").val("");
        $("#submitProvinceName").val(DefaultAddress.provinceName);
        $("#submitCityName").val(DefaultAddress.cityName);
        $("#submitCountyName").val(DefaultAddress.countyName);
        $("#submitTownName").val("");
        $("#submitAddress").val(DefaultAddress.addressDetail);
        $("#consigneeInfoDiv").html("<p>" + DefaultAddress.name + "&nbsp;&nbsp;&nbsp;" + DefaultAddress.mobileWithXing + "<br/>" + DefaultAddress.provinceName + DefaultAddress.cityName + DefaultAddress.countyName + DefaultAddress.addressDetail + "</p>");
        $("#consignee_edit_action").html("<a href=\"#none\" onclick=\"edit_Consignee()\">[修改]</a>");
        $("#consigneeEditDiv").hide();
        $("#consigneeInfoDiv").show();
        $('#payment-ship_edit_action').show();

        /******edit_Payment()**********/
        $("#payment-ship_edit_action").html("<a href=\"#none\" onclick=\"save_Payment()\">[保存]</a>");
        $("#payAndShipEditDiv").show();
        $("#payAndShipInfoDiv").hide();
        $("#submitPaymentType").val("4");

        $.ajax({
            type: "POST",
            dataType: "json",
            url: window.location.protocol + "//marathon.jd.com/async/isSupportCodPayment.action?skuId=" + product,
            data: "orderParam.provinceId=" + DefaultAddress.provinceId + "&orderParam.cityId=" + DefaultAddress.cityId + "&orderParam.countyId=" + DefaultAddress.countyId + "&orderParam.townId=",
            cache: false,
            success: function (dataResult) {
                //提交订单
                setTimeout(function(){
                    $.ajax({
                        url: window.location.protocol + '//marathon.jd.com/seckill/submitOrder.action?skuId=' + product + '&vid=',
                        dataType: 'text',
                        contentType: 'application/x-www-form-urlencoded; charset=utf-8',
                        data: {
                            'orderParam.name': DefaultAddress.name,
                            'orderParam.addressDetail': DefaultAddress.addressDetail,
                            'orderParam.mobile': DefaultAddress.mobileWithXing,
                            'orderParam.email': '',
                            'orderParam.provinceId': DefaultAddress.provinceId,
                            'orderParam.cityId': DefaultAddress.cityId,
                            'orderParam.countyId': DefaultAddress.countyId,
                            'orderParam.townId': "",
                            'orderParam.paymentType': 4,
                            'orderParam.password': '',
                            'orderParam.invoiceTitle': 4,
                            'orderParam.invoiceContent': 1,
                            'orderParam.invoiceCompanyName': '',
                            'orderParam.invoiceTaxpayerNO': '',
                            'orderParam.usualAddressId': DefaultAddress.id,
                            'skuId': product,
                            'num': 1,
                            'orderParam.provinceName': DefaultAddress.provinceName,
                            'orderParam.cityName': DefaultAddress.cityName,
                            'orderParam.countyName': DefaultAddress.countyName,
                            'orderParam.townName': '',
                            'orderParam.codTimeType': 3,
                            'orderParam.mobileKey': DefaultAddress.mobileKey,
                            'eid': $("#eid").val(),
                            'fp': $("#fp").val()
                        },
                        success: function (result) {
                            console.log(result);
                            //再次检测库存
                            CheckStock(product);
                        }
                    });
                },200);
            }
        });

    };

    //获取SN号
    var GetSN = function (product) {
        if ($.inArray(product, $.map(ProductSN, function (v) { return v.product; })) == -1) {
            $.ajax({
                url: window.location.protocol + '//itemko.jd.com/itemShowBtn?skuId=' + product + '&callback=?',
                dataType: "jsonp",
                scriptCharset: "utf-8",
                async: false,
                success: function (data) {
                    var url = data.url;
                    url = url + "&rid=" + Math.random();
                    ProductSN.push({ product: product, url: data.url });
                    window.open(url);
                }
            });
        } else {
            window.open($.map(ProductSN, function (v) { if (v.product == product) return v.url + "&rid=" + Math.random(); })[0]);
        }
    };

    //库存检测
    var CheckStock = function (product) {
        $.ajax({
            url: window.location.protocol + '//c0.3.cn/stock',
            dataType: 'jsonp',
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            async: false,
            data: { skuId: product, area: Area + '_0_0', venderId: '1000093907', cat: '652,12345,12353', extraParam: JSON.stringify({ 'originid': '1' }) },
            success: function (result) {
                if (result.stock.StockState == 33) {
                    console.log(product + "有货了,正在提交抢购.去订单列表看看成功了没有.");

                    if (DefaultAddress.IsSuccess)
                        Submit(product);
                    else
                        GetAddress(product);

                } else if (result.stock.StockState == 34) {
                    console.log(product + "无货,检测中...");
                    CheckStock(product);
                } else {
                    console.log(product + "未知代码:" + result.stock.StockState + "(" + result.stock.StockStateName + ")");
                    CheckStock(product);
                }
            }
        });
    };

    //开始
    var StartCheck = function () {
        for (var i = 0; i < ProductList.length; i++) {
            GetSN(ProductList[i]);
        }
    };

    var StartTimeInterval;
    var QiangGouTimeStamp = 0, CurrentTimeStamp = 0, CheckTimestamp = 0, CheckTimestampTime = 2, IsSubmit = false;

    //时间验证脚本
    function GetTime(speed) {
        speed = speed || 10;
        if (speed < 10) speed = 10;
        if (CheckTimestamp == 0) {
            CurrentTimeStamp = parseInt((new Date() / 1000));
            var newDate = new Date();
            newDate.setTime(CurrentTimeStamp * 1000);
            console.log('当前时间:' + newDate.toLocaleTimeString());
            CheckTimestamp = CheckTimestamp + 1;
        } else {
            if ((1000 / speed) * CheckTimestampTime > CheckTimestamp)
                CheckTimestamp = CheckTimestamp + 1;
            else
                CheckTimestamp = 0;

            if ((CheckTimestamp % parseInt((1000 / speed))) == 0)
                CurrentTimeStamp = CurrentTimeStamp + 1;
        }

        if (CurrentTimeStamp >= QiangGouTimeStamp) {
            clearInterval(StartTimeInterval);
            console.log('抢购开始...');
            if (IsSubmit == false) {
                IsSubmit = true;
                StartCheck();
            } else {
                console.log('防重复提交...');
            }
        }
        else {
            if (QiangGouTimeStamp - CurrentTimeStamp < 4)
                console.log('倒计时' + (QiangGouTimeStamp - CurrentTimeStamp) + '秒后自动开始...');
            else
                console.log('抢购时间检测中.未到抢购时间...');
        }
    }


    //获取抢购时间
    var GetBuyTime = function (product) {
        $.ajax({
            url: window.location.protocol + '//yushou.jd.com/youshouinfo.action',
            dataType: 'jsonp',
            data: { sku: product },
            jsonp: 'callback',
            success: function (result) {
                if (result.error != undefined && result.error != "") {
                    console.log("此产品没有抢购或预约信息," + result.error);
                } else {
                    var strTime = result.yueEtime;
                    if (result.qiangStime != undefined && $.trim(result.qiangStime) != "")
                        strTime = result.qiangStime;

                    console.log('抢购时间为:' + (strTime) + ' ,脚本每秒40次验证抢购时间.');
                    QiangGouTimeStamp = (new Date(strTime) / 1000);
                    var curTimeStamp = new Date() / 1000;
                    if (QiangGouTimeStamp - curTimeStamp > 200) {
                        console.log('距离抢购时间大于3分钟,已设置2分钟后自动刷新此页面.');
                        setTimeout(window.location.reload, 120000);
                    }
                    StartTimeInterval = setInterval(function () { GetTime(25); }, 25);
                }
            }
        });
    };

    //订单提交页面
    if (window.location.href.toLowerCase().indexOf("marathon.jd.com/seckill/seckill.action") > -1)
        CheckStock($("#skuId").val());
    else
        GetBuyTime(ProductList[0]);

})();