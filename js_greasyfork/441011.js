// ==UserScript==
// @name         EbridgeScore
// @version      0.3
// @description  XJTLU ebridge自动计算成绩插件！
// @author       InFoCo
// @match        https://ebridge.xjtlu.edu.cn/*
// @grant        none
// @license      GPL-3.0-only
// @namespace https://greasyfork.org/users/883597
// @downloadURL https://update.greasyfork.org/scripts/441011/EbridgeScore.user.js
// @updateURL https://update.greasyfork.org/scripts/441011/EbridgeScore.meta.js
// ==/UserScript==

(function() {
   'use strict';

    let all = document.querySelectorAll("body > div.sv-page-content.sv-container-fluid > div");
    console.log(all.length);
    let GPA=0.0;
    let Credits=0.00;
    for(let n =7;n<7+all.length;n++){
        let table = document.querySelector('body > div.sv-page-content.sv-container-fluid > div:nth-child('+n+') > div.sv-panel-body > div > table > tbody');
        //计算成绩
        var Average = 0.00;
        for(let i=1;i<table.children.length;i++){
            if(table.children[i].children[2].textContent === ""|| table.children[i].children[3].textContent ==="") {continue;}
            Average += parseInt(table.children[i].children[2].textContent)*parseFloat(table.children[i].children[3].textContent)/100;
        }
        Average=Average.toFixed(2);
        //Average = 65.00;
        //calculate gpa
        let credit_text = document.querySelector("body > div.sv-page-content.sv-container-fluid > div:nth-child("+n+") > div.sv-panel-heading > h2").textContent;
        let temp= credit_text.search(/ Credits/);
        console.log(credit_text);
        let credit = parseFloat(/[0-9]{1,2}  Credits/.exec(credit_text)[0].replace("  Credits",""),0);
        Credits+=credit;
        let gpa = 0;
        if(Average>=70) gpa=credit*4.0;
        if(Average>=65 && Average<=69.99) gpa=credit*3.7;
        if(Average>=60 && Average<=64.99) gpa=credit*3.3;
        if(Average>=50 && Average<=59.99) gpa=credit*3.0;
        if(Average>=45 && Average<=49.99) gpa=credit*2.3;
        if(Average>=40 && Average<=44.99) gpa=credit*2.0;
        if(Average>=0 && Average<=39.99) gpa=credit*0.0;
        GPA+=gpa;
        gpa = gpa.toFixed(1);
        gpa/=credit;
        gpa = gpa.toFixed(1);
        let score = document.createElement("tr");
        var Name =["Average","Total"];
        for(const i of Name){
            let t = document.createElement("td");
            t.className='sv-col-md-2';
            t.innerText = i;
            score.appendChild(t);
        }
        let t = document.createElement("td");
        t.className='sv-col-md-2';
        t.innerText = "GPA:"+gpa;
        score.appendChild(t);
        t = document.createElement("td");
        t.className='sv-col-md-2';
        t.innerText = "GPA:"+gpa;
        t.innerText = Average;
        score.appendChild(t);
        //console.log(score);
        table.appendChild(score);

        if(n===6+all.length){
            //添加社团图标和文字
            // var logo = document.createElement('img');
            // let tt = document.createElement("tr");
            // let t = document.createElement("td");
            // t.className='sv-col-md-2';
            // t.innerText = '本插件由XJTLU InfoCo计算机社制作 ---- Made by InfoCo Computer Club';
            // tt.appendChild(t);
            // table.insertBefore(tt,table.firstChild);
            // table.insertBefore(logo, table.firstChild);
            let infoco_text = document.createElement("div")
            let head = document.querySelector("body > header")

            // var logo = document.createElement('img');
            // logo.setAttribute('style', 'float:left;')

            infoco_text.innerText = "本插件由XJTLU InfoCo计算机社制作 ---- Made by InfoCo Computer Club";
            infoco_text.setAttribute('style', 'float:left;color: #ffffff; background-color: #185da9;position: relative;font-size: 20px;font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;')
            // head.appendChild(logo);
            let gpa_div = document.createElement("div");
            GPA /=Credits;
            GPA= GPA.toFixed(1);
            gpa_div.innerText = "GPA:"+GPA;
            gpa_div.setAttribute('style', 'float:left;left: 20%;color: #ffffff; background-color: #185da9;position: relative;font-size: 20px;')

            head.appendChild(infoco_text);


            head.appendChild(gpa_div);



        }
    }
    console.log(Credits);
})();