// ==UserScript==
// @name         华美网2.0
// @namespace    http://tampermonkey.net/
// @version      2024-10-23
// @description  页面金额信息修改
// @author       Jackway
// @match        https://eastwest.bankonline.com/rwd-web/*
// @icon         https://eastwest.bankonline.com/rwd-web/media-defaultAffiliate/assets/themes/Classic/images/common/globe.png?version=DP-1721097470780
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532220/%E5%8D%8E%E7%BE%8E%E7%BD%9120.user.js
// @updateURL https://update.greasyfork.org/scripts/532220/%E5%8D%8E%E7%BE%8E%E7%BD%9120.meta.js
// ==/UserScript==
var home_prefix = "https://eastwest.bankonline.com/rwd-web/main/home";
var priorDay_prefix = "https://eastwest.bankonline.com/rwd-web/main/accounts/priorDay";
var currentDay_prefix = "https://eastwest.bankonline.com/rwd-web/main/accounts/currentDay";
var activity_prefix = "https://eastwest.bankonline.com/rwd-web/main/accounts/activity";


//设置余额
var init_money = 220111123.03;
var setup_money = "USD " + formatCurrency(init_money.toString());
var jinMoney = 0;

(function () {
    'use strict';
    setInterval(start, 1000);
})();


function init() {
    window.addEventListener('load', setAccountViewClickBtn, true);
}

// $(document).ready(function(){
//    document.getElementById("#Checkinggrid > tbody > tr > td:nth-child(2) > div > div.cell-primary-data > ol-money > span").innerHTML = '你好中国';
// });

function start() {

    var url = window.location.href;

    if (url.startsWith(home_prefix)) {//首页
        resetHomeMoney();
    } else if (url.startsWith(priorDay_prefix)) {//历史余额
        resetPriorDayMoney();
    } else if (url.startsWith(currentDay_prefix)) {//今日余额
        resetCurrentDayMoney();
    } else if (url.startsWith(activity_prefix)) {//账户活动
        resetActivityMoney();
    }
}

//仪表盘首页余额
function resetHomeMoney() {
    var fistEL = document.querySelectorAll("#Checkinggrid > tbody > tr > td:nth-child(2) > div > div.cell-primary-data > ol-money > span");
    var secondEL = document.querySelectorAll("#Checkinggrid > tbody > tr > td:nth-child(3) > div > div.cell-primary-data > ol-money > span");

    fistEL.forEach(function (item) {
        item.textContent = setup_money;
    });

    secondEL.forEach(function (item) {
        item.textContent = setup_money;
    });
}

//历史余额
function resetPriorDayMoney() {
    try {

            var balanceFields = document.querySelectorAll("ol-money[name='row.balanceFields[i].fieldName']>span");
            //循环设置历史余额存款行数
            for (var i = 0; i < balanceFields.length; i++) {
                if (i == 0) {
                    //期初可用余额
                    balanceFields[i].textContent = setup_money;
                } else if (i == 4) {
                    //期末账户余额
                    balanceFields[i].textContent = setup_money;
                }
            }
            var totalFields = document.querySelectorAll("ol-money[name='total.fieldTotal[i].fieldName']>span");
            //循环设置历史余额总计
            for (i = 0; i < totalFields.length; i++) {
                if (i == 0) {
                    //期初可用余额
                    totalFields[i].textContent = setup_money;
                } else if (i == 4) {
                    //期末账户余额
                    totalFields[i].textContent = setup_money;
                }
            }

    } catch (e) {

    }

}


//今日余额
function resetCurrentDayMoney() {
    try {
        var moneyFields = document.querySelectorAll("ol-money>span");
        //循环设置今日余额存款行数
        for (var i = 0; i < moneyFields.length; i++) {
            moneyFields[i].textContent = setup_money;
        }
    } catch (e) {

    }

}

//账户活动页面
function resetActivityMoney() {
    try {
        var formFields = document.querySelectorAll("form[name='accountForm'] ol-money>span");
        //循环设置账户活动页面
        for (var i = 0; i < formFields.length; i++) {
            if (i == 0 || i == 1 || i == 2) {
                formFields[i].textContent = setup_money;
            }
        }

        var gridFields = document.querySelectorAll("#ClearedTxnGrid-table ol-money>span");
        for (i = 0; i < gridFields.length; i++) {
            if (i == 1) {
                gridFields[i].textContent = setup_money;
            }
        }
        //刷新列表
        resetActivityMoneyList();
    } catch (e) {

    }

}

//设置账户活动页面列表
function resetActivityMoneyList() {
    try {
        //获取行
        var tableRow = document.querySelectorAll("#ClearedTxnGrid-table > tbody > tr");
        var total_money = init_money;

        if(tableRow.length > 0 && tableRow[0].children.length > 1){

            var beginSetRowNo = 0;
            var beginDateStr = "30/10/2024";

            //遍历行,找到30号那笔记录开始刷新
            for(var i=0; i< tableRow.length; i++){
                if(tableRow[i].children[0].textContent.includes(beginDateStr)){
                    beginSetRowNo = i;
                    break;
                }
            }


            //遍历行
            for(var j=0; j< tableRow.length; j++){

                //只要行数小于开始设置那笔，就都需要刷新
                if(j < beginSetRowNo){
                    //读取该行是存款、还是付款
                    var outMoneyText = tableRow[j].children[3].children[0].innerText;
                    var inMoneyText = tableRow[j].children[4].children[0].innerText;

                    if(inMoneyText!=""){//存款
                        //重新转化
                        inMoneyText = inMoneyText.substring(4);
                        var inMoney = parseFloat(inMoneyText);
                        tableRow[j].children[5].innerHTML = `<div class="cell-content"><div class="cell-primary-data"><ol-money readonly="true" class="read-only ng-untouched ng-valid ng-dirty"><!----><span>USD ${formatCurrency(total_money.toString())}</span><!----><!----></ol-money></div><!----><!----><!----><!----><!----></div>`;
                        total_money -= inMoney;
                    }else if(outMoneyText!=""){//提款
                        outMoneyText = outMoneyText.substring(5, outMoneyText.length -1 );
                        var outMoney = parseFloat(outMoneyText);
                        tableRow[j].children[5].innerHTML = `<div class="cell-content"><div class="cell-primary-data"><ol-money readonly="true" class="read-only ng-untouched ng-valid ng-dirty"><!----><span>USD ${formatCurrency(total_money.toString())}</span><!----><!----></ol-money></div><!----><!----><!----><!----><!----></div>`;
                        total_money += outMoney;
                    }
                } else if( j == beginSetRowNo){
                    //只设置日期等于2024/10/30的那笔记录
                    if(tableRow[j].children[0].textContent.includes(beginDateStr)){
                        //取下一行的余额
                        var nextLeftMoney = tableRow[j+1].children[5].children[0].innerText;
                        nextLeftMoney = nextLeftMoney.substring(4);
                        jinMoney = total_money - formatToDecimal(nextLeftMoney);


                        //日期列
                        tableRow[j].children[0].innerHTML = `<div class="cell-content"><div class="cell-primary-data"> 27/10/2024 </div></div>`;
                        //说明
                        tableRow[j].children[2].innerHTML =`<div class="cell-content"><!----><!----><div class="ol-ellipsis cell-primary-data ol-no-wrap"><ol-truncate classes="grid-truncate-tooltip"><span> b4813ca2-8f39-43d4-b526-ac5313f82a8eBYTECARERA INVESTMENTCITIHKHXXXX</span></ol-truncate></div></div>`
                        //存款列
                        tableRow[j].children[4].innerHTML = `<div class="cell-content"><div class="cell-primary-data"><ol-money readonly="true" class="read-only ng-untouched ng-valid ng-dirty"><!----><span>USD ${formatCurrency(jinMoney.toString())}</span><!----><!----></ol-money><!----></div></div>`;
                        //余额列
                        tableRow[j].children[5].innerHTML = `<div class="cell-content"><div class="cell-primary-data"><ol-money readonly="true" class="read-only ng-untouched ng-valid ng-dirty"><!----><span>USD ${formatCurrency(total_money.toString())}</span><!----><!----></ol-money></div><!----><!----><!----><!----><!----></div>`;
                    }
                }

            }

            var detailSpan = document.querySelector("#transactionAmount > span");
            console.log(jinMoney);

            if(detailSpan && detailSpan.textContent == "USD 100.00"){
                console.log(jinMoney);
                document.querySelectorAll("ol-preview-data>div")[5].innerHTML= `<div class="form-group row empty-preview"><label class="col-sm-3 preview-label"><div class="ol-ellipsis ol-no-wrap ellipsis-text">交易日期</div><!----></label><!----><div class="col-sm-9 preview-text"><!----><div> 27/10/2024 </div><!----><!----></div></div>`;
                document.querySelectorAll("ol-preview-data>div")[12].innerHTML= `<div class="form-group row"><label class="col-sm-3 preview-label"><div class="ol-ellipsis ol-no-wrap ellipsis-text">说明</div><!----></label><!----><div class="col-sm-9 preview-text"><!----><span class="ol-wrap"> b4813ca2-8f39-43d4-b526-ac5313f82a8eBYTECARERA INVESTMENTCITIHKHXXXX.</span></div></div>`;
                document.querySelector("#transactionAmount > span").textContent = "USD " + formatCurrency(jinMoney.toString());
            }
        }

    } catch (e){
        console.log(e);
    }
}


function setAccountViewClickBtn() {
    var button = document.getElementById('btnOpenAccountView');

    // 为按钮添加点击事件处理程序
    button.onClick = function () {
        console.log("点击触发仪表盘查看余额");
    };
}

function formatCurrency(amount) {
  // 移除金额字符串中非数字的字符，并返回数字
  const number = Number(amount.replace(/[^0-9.]/g, ''));
  // 如果输入的字符串不是一个合法的数字，则直接返回错误提示
  if (isNaN(number)) return 'Invalid currency format';
  // 格式化金额，并保留两位小数
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function formatToDecimal(money) {
    // 移除非数字字符，并将逗号转换为小数点
    var decimalMoney = money.replace(/[^\d.,]/g, '').replace(',', '');

    // 转换为数字类型并返回
    return Number(decimalMoney);
}