// ==UserScript==
// @name         自动信息查询
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  互联网道路运输便民政务服务系统-信息查询
// @author       You
// @match        https://ysfw.mot.gov.cn/NetRoadCGSS-web/information/query*
// @icon         https://www.google.com/s2/favicons?domain=mot.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430942/%E8%87%AA%E5%8A%A8%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/430942/%E8%87%AA%E5%8A%A8%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

var license_number;
var licensePlateColor;
var roadTransportCertificate;

var vin;
var driver_name;
var driver_card;
(function() {
    'use strict';

    // Your code here...
    license_number = decodeURI(getQueryVariable('license_number'));
    console.log(license_number);
    licensePlateColor = decodeURI(getQueryVariable('license_plate_color'));
    console.log(licensePlateColor);
    roadTransportCertificate = decodeURI(getQueryVariable('road_transport_certificate'));
    console.log(roadTransportCertificate)
    vin = decodeURI(getQueryVariable('vin'));
    console.log(vin)
    driver_name = decodeURI(getQueryVariable('driver_name'));
    console.log(driver_name)
    driver_card = decodeURI(getQueryVariable('driver_card'));
    console.log(driver_card)

    if(driver_name !== "" && driver_name !== 'false'){
        $('#staffForm > div:nth-child(2) > div > input').val(driver_name);
    }

    if(driver_card !== "" && driver_card !== 'false'){
        setProvince();
        $('#staffForm > div:nth-child(4) > div > input').val(driver_card);
    }

    if(license_number !== "" && license_number !== 'false'){
        $('#vehicleForm > div:nth-child(1) > div > input').val(license_number);
    }

    if(licensePlateColor !== "" && licensePlateColor !== 'false'){
        setPlateColor();
    }
    if(vin === "" || vin === 'false'){
        if(roadTransportCertificate !== "" && roadTransportCertificate !== 'false'){
            $('#transCertificateCode').val(roadTransportCertificate);
        }
    }else{
        setCheckRadio();
    }
})();

// 设置车牌
function setPlateColor(){
    if($('#vehicleForm > div:nth-child(2) > div > div > div > input').length != 0){
        let colorCode = getColorCode(licensePlateColor);
        $('#vehicleForm > div:nth-child(2) > div > select').val(colorCode);
        $('#vehicleForm > div:nth-child(2) > div > div > div > input').val(licensePlateColor);
    }else{
        setTimeout(setPlateColor, 1000);
    }

}

// 设置省份
function setProvince(){
    if($('#staffForm > div:nth-child(1) > div > div > div > input').length != 0){
        let provinceCode = driver_card.substr(0,2);
        let provinceName = getProvinceName(provinceCode);
        $('#staffForm > div:nth-child(1) > div > select').val(provinceCode+"0000");
        $('#staffForm > div:nth-child(1) > div > div > div > input').val(provinceName);
    }else{
        setTimeout(setProvince, 1000);
    }

}

// 设置单选框
function setCheckRadio(){
    if($('#vehicleForm > div:nth-child(4) > div > div:nth-child(4) > i').length != 0){
        $('#vehicleForm > div:nth-child(4) > div > div:nth-child(4) > i').click();
        setTimeout(setVinNo, 300);
    }else{
        setTimeout(setCheckRadio, 1000);
    }
}

// 设置VIN
function setVinNo(){
    if($('#vehicleForm > div:nth-child(3) > div.vin-card').attr("class") == "vin-card"){
        $('#vinNo').val(vin);
    }else{
        setTimeout(setVinNo, 300);
    }
}

// 获取查询变量
function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

// 获取颜色代码
function getColorCode(color){
    switch(color){
        case "蓝色":
            return 1;
        case "黄色":
            return 2;
        case "黑色":
            return 3;
        case "白色":
            return 4;
        case "绿色":
            return 5;
        case "其他":
            return 9;
        case "农黄色":
            return 91;
        case "农绿色":
            return 92;
        case "黄绿双拼色":
            return 93;
        case "渐变绿色":
            return 94;
        default:
            return 0;
    }
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