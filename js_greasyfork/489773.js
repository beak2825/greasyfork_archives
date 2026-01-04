// ==UserScript==
// @name         安卓同步精靈 - 慈濟正式機
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  安卓同步精靈-慈濟正式機
// @author       50
// @match        https://dcharity.tzuchi.org.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489773/%E5%AE%89%E5%8D%93%E5%90%8C%E6%AD%A5%E7%B2%BE%E9%9D%88%20-%20%E6%85%88%E6%BF%9F%E6%AD%A3%E5%BC%8F%E6%A9%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/489773/%E5%AE%89%E5%8D%93%E5%90%8C%E6%AD%A5%E7%B2%BE%E9%9D%88%20-%20%E6%85%88%E6%BF%9F%E6%AD%A3%E5%BC%8F%E6%A9%9F.meta.js
// ==/UserScript==
/*@name: 脚本的名称。它在 Tampermonkey 挂件中显示，并且帮助用户识别他们的脚本。
@namespace: 它用于标识脚本的唯一性。通常包含作者的网页或项目的 URL。
@version: 描述脚本的版本。典型格式是三段式的 "major.minor.patch"。它也可以包含"预发行"后缀，如 "0.0.1-alpha"。
@description: 描述脚本的功能，帮助用户理解脚本是做什么的。
@author: 脚本作者的名字，有时可能包括联系信息。
@match: 它控制哪些网站脚本会产生作用。这行可以多次出现以匹配多个网站。例如，@match http://*.google.com/* 会匹配所有 google.com 的子域名。
@include: 类似于 @match，它决定哪些网站可以运行此脚本，可以使用正则表达式，但是它现在已经过时，建议用 @match 替代。
@exclude: 指出脚本在哪些页中不会生效。例如，@exclude http://google.com/* 表示此脚本在所有 google.com 页面都不会起作用。
@icon: 定义一个包含脚本图标的 URL。此图标将在 Tampermonkey 的管理界面中显示。
@grant: 这个标签定义了脚本需要的特殊权限。例如，GM_xmlhttpRequest 来进行跨域请求。如果没有特殊权限需求，通常用 @grant none。*/

(function() {
    'use strict';

    let btn = document.createElement("button"); // 創建一個 button 元素
    //btn.innerHTML = "抓取資料"; // 設定按鈕文字
    btn.style.width = '80px'; // 設置按鈕的寬度
    btn.style.height = '80px'; // 設置按鈕的高度
    btn.style.borderRadius = '50%'; // 設置按鈕的邊框半徑為50%，使按鈕變成圓形
    //設定按鈕的位置套用CSS
    btn.style.position = 'absolute';
    //調整按鈕位置
    btn.style.right = '0px';
    //btn.style.top = '50%';
    btn.style.top = '70px';
    btn.style.backgroundImage = "url('https://i.imgur.com/8tDjKAB.png')"; // 設置按鈕的背景為圖片
    btn.style.backgroundSize = 'cover'; // 確保背景圖片適應按鈕大小
    btn.style.border = 'none'; // 移除按鈕的邊框
btn.onclick = function() {
    // 获取需要的控制项的值
    let UserName = document.getElementById("txtCsNm").value;

    let UserAttributeElement = document.querySelector('input[name="rdCsPrp"]:checked');
    let UserAttributeSelectedValue = UserAttributeElement ? UserAttributeElement.value : null;

    let SexElement = document.querySelector('input[name="rdCsSex"]:checked');
    let SexSelectedValue = SexElement ? SexElement.value : null;

    let BirthYearElement = document.getElementById("txtBRTHD");
    let BirthYear = BirthYearElement ? BirthYearElement.value : null;

    let WeightElement = document.getElementById("txtCsWt");
    let Weight = WeightElement ? WeightElement.value : null;

    let HeightElement = document.getElementById("txtCsHt");
    let Height = HeightElement ? HeightElement.value : null;

    let UserSocialWelfareResources = Array.from(document.querySelectorAll('input[name="cbxSclRsc"]:checked')).map(chk => chk.value).join(',');

    let UserPhoneNum = document.getElementById("txtCsTel").value;

    let UserAddress = document.getElementById("lctntext0").value+document.getElementById("lctntext1").value+document.getElementById("txtVlg").value+document.getElementById("txtAdrs").value;

    let ContactPersonNameElement = document.getElementById("txtCntNm");
    let ContactPersonName = ContactPersonNameElement ? ContactPersonNameElement.value : null;

    let ContactPersonPhoneNumElement = document.getElementById("txtCntMbl");
    let ContactPersonPhoneNum = ContactPersonPhoneNumElement ? ContactPersonPhoneNumElement.value : null;

    let UserTakeCareByWhoElement = document.getElementById("txtCrgvr");
    let UserTakeCareByWho = UserTakeCareByWhoElement ? UserTakeCareByWhoElement.value : null;

    let HealthSituationAndApplicationReasonElement = document.getElementById("txtRptRsn");
    let HealthSituationAndApplicationReason = HealthSituationAndApplicationReasonElement ? HealthSituationAndApplicationReasonElement.value : null;

    //這是評估輔具的其他的說明文字方塊
    var txtEpaOthValue = document.querySelector('#txtEpaOth').value;
    var ProductValues = [txtEpaOthValue].concat(Array.from(document.querySelectorAll('#dvSrvRslt input')).map(input => input.value));
    //後面再看這個要過濾掉"其他"還是選擇其他後顯示的文字方塊如果是空值
    let ProductsName = ProductValues.filter(value => value !== '').join(',');
    let TakeBySelf = document.getElementById('cbxPckUos0').checked;
    let WouldLendAHandWhenArrive = document.getElementById('rdTrns20').checked;
    let CanParkWhenArrive = document.getElementById('rdTrns31').checked;
    let HaveElevator = document.getElementById('rdTrns40').checked;
    let OtherMatter = document.getElementById("txtRmk").value;
    let ReportPersonName = document.getElementById("txtRptr").value;
    let ReportPersonPhoneNum = document.getElementById("txtCntTel").value;
    let ReportPersonAttributeSelectedValue = document.getElementById("rptext0").value;
    let ReportPersonCompany = document.getElementById("txtRptOrg").value;
    let ReportDate = document.getElementById("txtRptDt").value;



    // 包装成一个对象并转换成 JSON 格式
    let postData = {
        UserName: UserName,
        UserAttributeSelectedValue: UserAttributeSelectedValue,
        SexSelectedValue: SexSelectedValue,
        BirthYear: BirthYear,
        Weight:Weight,
        Height:Height,
        UserSocialWelfareResources:UserSocialWelfareResources,
        ProductsName:ProductsName,
        UserPhoneNum:UserPhoneNum,
        UserAddress:UserAddress,
        ContactPersonName:ContactPersonName,
        ContactPersonPhoneNum:ContactPersonPhoneNum,
        UserTakeCareByWho:UserTakeCareByWho,
        HealthSituationAndApplicationReason:HealthSituationAndApplicationReason,
        TakeBySelf:TakeBySelf,
        WouldLendAHandWhenArrive:WouldLendAHandWhenArrive,
        CanParkWhenArrive:CanParkWhenArrive,
        HaveElevator:HaveElevator,
        OtherMatter:OtherMatter,
        ReportPersonName:ReportPersonName,
        ReportPersonPhoneNum:ReportPersonPhoneNum,
        ReportPersonAttributeSelectedValue:ReportPersonAttributeSelectedValue,
        ReportPersonCompany:ReportPersonCompany,
        ReportDate:ReportDate
    };
    let jsonString = JSON.stringify(postData);
    // 发送 JSON 数据
    var http = new XMLHttpRequest();
    var url = 'https://www.andr.com.tw/tzuchipub/JSInjectorAPI/Index.aspx'; //慈濟測試機
    http.open('POST', url, true);
    // 设定请求头
    http.setRequestHeader('Content-Type', 'application/json');

    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            alert('抓取資料成功');
        }
        else{

        }
    }
    http.send(jsonString);
};
    document.body.appendChild(btn); // 將按鈕添加至網頁
})();