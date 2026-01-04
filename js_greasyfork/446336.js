// ==UserScript==
// @name         EbridgeGPACalculator
// @namespace    https://greasyfork.org/users/924391
// @version      0.12
// @description  西浦 ebridge计算GPA插件
// @author       EndingSpirit
// @match        https://ebridge.xjtlu.edu.cn/*
// @license      GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446336/EbridgeGPACalculator.user.js
// @updateURL https://update.greasyfork.org/scripts/446336/EbridgeGPACalculator.meta.js
// ==/UserScript==

(function() {
   'use strict';

    let table1 = document.querySelector('body > div.sv-page-content.sv-container-fluid > div:nth-child('+11+') > div.sv-panel-body > div > table > tbody');
    let table2 = document.querySelector('body > div.sv-page-content.sv-container-fluid > div:nth-child('+15+') > div.sv-panel-primary > div.sv-panel-body > div > table > tbody');
    let table3 = document.querySelector('body > div.sv-page-content.sv-container-fluid > div:nth-child('+18+') > div.sv-panel-primary > div.sv-panel-body > div > table > tbody');
    // 大四的大一成绩位置没有确定（没有大四账号）
    let table4 = document.querySelector('body > div.sv-page-content.sv-container-fluid > div:nth-child('+21+') > div.sv-panel-primary > div.sv-panel-body > div > table > tbody');
    var Credits = new Array();
    var GPAs = new Array();
    var Marks = new Array();
    function cal(table){
        var TotalCredit=0.00;
        var credit = 0.00;
        var AveMark = 0.00;
        var Mark =0.00;
        var AveGPA=0.00
        var gpa =0.00;
        var module = "english";
        for(let i=0;i<table.children.length;i++){
            if(table.children[i].children[3].textContent === ""||
               table.children[i].children[4].textContent === ""||
               table.children[i].children[3].textContent === "Credit"||
               table.children[i].children[4].textContent === "Mark") {continue;}
            credit = parseFloat(table.children[i].children[3].textContent);
            module = table.children[i].children[2].textContent;
            console.log(module);
            if(module.includes("English")&&credit==10){
                credit=3;
                console.log(module.includes("English"));
            }
            if(module.includes("English")&&credit!=3) {
                credit=2.5;
                console.log(module.includes("English"));
            }
            if(module.includes("EAP")) {
                credit=2.5;
                console.log(module.includes("EAP"));
            }

            TotalCredit+=credit;
            Mark = parseInt(table.children[i].children[4].textContent);
            AveMark += Mark*credit;
            if(Mark>=70) gpa=credit*4.0;
            if(Mark>=65 && Mark<=69.99) gpa=credit*3.67;
            if(Mark>=60 && Mark<=64.99) gpa=credit*3.33;
            if(Mark>=54.99 && Mark<=59.99) gpa=credit*3.0;
            if(Mark>=50 && Mark<=54.99) gpa=credit*2.67;
            if(Mark>=45 && Mark<=49.99) gpa=credit*2.33;
            if(Mark>=40 && Mark<=44.99) gpa=credit*2.0;
            if(Mark>=0 && Mark<=39.99) gpa=credit*0.0;
            AveGPA += gpa
        }
        AveMark=(AveMark/TotalCredit).toFixed(2);
        AveGPA=(AveGPA/TotalCredit).toFixed(2);
        Marks.push(AveMark)
        GPAs.push(AveGPA);
        Credits.push(TotalCredit)

        // 构造新的列，显示数据
        let score = document.createElement("tr");

        let t = document.createElement("td");
        t.className='sv-col-md-2';
        t.innerText = "GPA:"+AveGPA;
        score.appendChild(t);

        t = document.createElement("td");
        t.className='sv-col-md-2';
        t.innerText = "Average Mark: "+AveMark;
        score.appendChild(t);

        console.log(score);
        table.appendChild(score);
    }
    cal(table1);
    cal(table2);
    cal(table3);
    console.log(Marks);
    console.log(GPAs);
    console.log(Credits);
})();