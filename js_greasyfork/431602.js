// ==UserScript==
// @name         新交通运输部-自动信息查询
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  交通运输部新查询页面
// @author       You
// @match        http://app.gjzwfw.gov.cn/jmopen/webapp/html5/jtbdlyz*/index.html*
// @icon         https://www.google.com/s2/favicons?domain=gjzwfw.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431602/%E6%96%B0%E4%BA%A4%E9%80%9A%E8%BF%90%E8%BE%93%E9%83%A8-%E8%87%AA%E5%8A%A8%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/431602/%E6%96%B0%E4%BA%A4%E9%80%9A%E8%BF%90%E8%BE%93%E9%83%A8-%E8%87%AA%E5%8A%A8%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

var driver_name;
var driver_card;

var license_number;
var roadTransportCertificate;
var vin;
(function () {
    'use strict';
    driver_name = decodeURI(getQueryVariable('driver_name'));
    console.log(driver_name);
    driver_card = decodeURI(getQueryVariable('driver_card'));
    console.log(driver_card);

    if (driver_name !== "" && driver_name !== 'false') {
        $('#query1').val(driver_name);
    }
    if (driver_card !== "" && driver_card !== 'false') {
        setProvince();
        $('#query2').val(driver_card);
    }

    license_number = decodeURI(getQueryVariable('license_number'));
    console.log(license_number);
    roadTransportCertificate = decodeURI(getQueryVariable('road_transport_certificate'));
    console.log(roadTransportCertificate);
    vin = decodeURI(getQueryVariable('vin'));
    console.log(vin);

    if (license_number !== "" && license_number !== 'false') {
        $('#query1').val(license_number);
    }
    if (vin !== "" && vin !== 'false') {
        $('#query2').val(vin);
    }
    if (roadTransportCertificate !== "" && roadTransportCertificate !== 'false') {
        $('#form > div.formName.formRadio > div:nth-child(3) > input[type=radio]').click();
        $('#query3').val(roadTransportCertificate);
    }
})();

// 获取查询变量
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

// 设置省份
function setProvince() {
    let provinceCode = driver_card.substr(0, 2);
    let provinceName = getProvinceName(provinceCode);
    console.log(provinceCode);
    console.log(provinceName);
    $('#query3').val(provinceName);
    $('#query3').attr('title', provinceCode + "0000");

}

// 获取省份名
function getProvinceName(code) {
    switch (code) {
        case "11": return "北京市";
        case "12": return "天津市";
        case "13": return "河北省";
        case "14": return "山西省";
        case "15": return "内蒙古自治区";
        case "21": return "辽宁省";
        case "22": return "吉林省";
        case "23": return "黑龙江省";
        case "31": return "上海市";
        case "32": return "江苏省";
        case "33": return "浙江省";
        case "34": return "安徽省";
        case "35": return "福建省";
        case "36": return "江西省";
        case "37": return "山东省";
        case "41": return "河南省";
        case "42": return "湖北省";
        case "43": return "湖南省";
        case "44": return "广东省";
        case "45": return "广西壮族自治区";
        case "46": return "海南省";
        case "50": return "重庆市";
        case "51": return "四川省";
        case "52": return "贵州省";
        case "53": return "云南省";
        case "54": return "西藏自治区";
        case "61": return "陕西省";
        case "62": return "甘肃省";
        case "63": return "青海省";
        case "64": return "宁夏回族自治区";
        case "65": return "新疆维吾尔自治区";
        case "66": return "新疆建设兵团";
        default:
            return 0;
    }
}