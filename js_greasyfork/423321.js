// ==UserScript==
// @name         Cash Calculate
// @namespace    https://github.com/
// @version      1.2.1
// @description  Щетает ваши денюшки
// @author       Jhonny
// @match        https://npos.wildberries.ru/*
// @match        http://localhost/*
// @match        http://localhost:1100/pvz/statistic/*
// @match        */pvz/statistic/*
// @match        *://localhost:1100/pvz/statistic/*
// @match        http://localhost:1100/pvz/statistic/
// @match        http://localhost:1100/pvz/statistic/
// @match        *://localhost/*
// @match        http://localhost/*
// @match        */1100/pvz/statistic/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423321/Cash%20Calculate.user.js
// @updateURL https://update.greasyfork.org/scripts/423321/Cash%20Calculate.meta.js
// ==/UserScript==


var question = prompt('Сколько ШК пришло?', 1000); 
let countShk = Number(question);
document.querySelector('.reload.ant-btn.ant-btn-primary.ant-btn-circle.ant-btn-icon-only').addEventListener('click', () => { 
 setTimeout(() => { 
var sumSales = +document.querySelectorAll(".ant-statistic-content-value-int.ng-star-inserted")[0].textContent.replace(/[^\d;]/g, ""), 
sumReturn = +document.querySelectorAll(".ant-statistic-content-value-int.ng-star-inserted")[1].textContent.replace(/[^\d;]/g, ""), 
pcsSales = +document.querySelectorAll(".ant-statistic-content-value-int.ng-star-inserted")[3].textContent.replace(/[^\d;]/g, ""), 
pcsReturn = +document.querySelectorAll(".ant-statistic-content-value-int.ng-star-inserted")[4].textContent.replace(/[^\d;]/g, ""), 
pcsFail = +document.querySelectorAll(".ant-statistic-content-value-int.ng-star-inserted")[5].textContent.replace(/[^\d;]/g, ""); 

var x = (sumSales - sumReturn) * 0.008; 
var y = (countShk + pcsSales + pcsReturn + pcsFail) * 1.25; 
document.querySelector('.ant-card-head-title.ng-star-inserted').textContent = (x + y + 660).toFixed(2) 
 },500) 
})