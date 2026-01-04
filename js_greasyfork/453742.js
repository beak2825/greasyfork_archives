// ==UserScript==
// @name         ABA asin数据导出
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ABA-asin数据导出
// @author       YUNXI
// @license      YUNXI
// @match        https://sellercentral.amazon.com/brand-analytics/dashboard/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @require      https://unpkg.com/jquery
// @require      https://unpkg.com/sweetalert2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453742/ABA%20asin%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/453742/ABA%20asin%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

var rows = document.querySelectorAll('strong')
var dat = document.querySelectorAll(".css-10urxj0")
var button = document.createElement("button")
var hangtext=document.querySelector(".css-12bxac1")
var button_css = "width: 100px;height: 50px;position: fixed;top: 150px;right: 100px;background-color: #4CAF50;color: white;text-align: center;text-decoration: none;"

setTimeout(function(){
    button.setAttribute("type", "button");
    button.style.cssText = button_css
    button.innerText="ABA asin数据导出"
    button.onclick =function(){
        var lie18="当前显示 18 列，共 33 列"
        var lie33="当前显示 33 列，共 33 列"
        var hangtext=document.querySelectorAll(".css-12bxac1")[1].innerText
        console.log(hangtext)
        if(hangtext==lie18){
            console.log("18")
            moren()
        }
        if(hangtext==lie33){
            console.log("33")
            all()
        }
    }
    document.querySelector("body").appendChild(button)
},200);


function moren(){
    var rows = document.querySelectorAll('strong')
    var dat = document.querySelectorAll(".css-10urxj0")
    var jsonData = [];
    let str = `搜索查询词条,搜索查询分数,搜索查询数量,总数,asin计数,asin分享,总数,点击率,asin计数,asin分享,总数,加入购物车率,asin计数,asin分享,总数,3个月内所有购买的,asin计数,asin分享\n`;
    for(let i = 0 ; i < rows.length ; i++ ){
        jsonData.push({
            'ST':rows[i].innerText.replaceAll(/,/g, ''),
            'STSCORE':dat[i*17].innerText.replaceAll(/,/g, ''),
            'STNUM':dat[i*17+1].innerText.replaceAll(/,/g, ''),
            'TOTL1':dat[i*17+2].innerText.replaceAll(/,/g, ''),
            'BR1':dat[i*17+3].innerText.replaceAll(/,/g, ''),
            'BRA1':dat[i*17+4].innerText.replaceAll(/,/g, ''),
            'TOTAL2':dat[i*17+5].innerText.replaceAll(/,/g, ''),
            'CLICK1':dat[i*17+6].innerText.replaceAll(/,/g, ''),
            'BR2':dat[i*17+7].innerText.replaceAll(/,/g, ''),
            'BRA2':dat[i*17+8].innerText.replaceAll(/,/g, ''),
            'DL1':dat[i*17+9].innerText.replaceAll(/,/g, ''),
            'TOTAL3':dat[i*17+10].innerText.replaceAll(/,/g, ''),
            'TOTAL5':dat[i*17+11].innerText.replaceAll(/,/g, ''),
            'BR3':dat[i*17+12].innerText.replaceAll(/,/g, ''),
            'BRA3':dat[i*17+13].innerText.replaceAll(/,/g, ''),
            'DL2':dat[i*17+14].innerText.replaceAll(/,/g, ''),
            'TOITAL4':dat[i*17+15].innerText.replaceAll(/,/g, ''),
            'B3':dat[i*17+16].innerText.replaceAll(/,/g, ''),
        });
        for(let item in jsonData[i]){
            str+=`${jsonData[i][item] + '\t'},`;
        }
        str+='\n';
    }
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    var link = document.createElement("a");
    link.href = uri;
    link.download = "ABA搜索查询数据表.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function all(){
    var rows = document.querySelectorAll('strong')
    var dat = document.querySelectorAll(".css-10urxj0")
    var jsonData = [];
    let str = `搜索查询词条,搜索查询分数,搜索查询数量,总数,asin计数,asin分享,总数,点击率,asin计数,asin分享,商品价格（中位数）,ASIN 价格（中位数）,配送速度：当日达,配送速度：次日达,配送速度：隔日达,总数,加入购物车率,asin计数,asin分享,商品价格（中位数）,ASIN 价格（中位数）,配送速度：当日达,配送速度：次日达,配送速度：隔日达,总数,3个月内所有购买的,asin计数,asin分享,商品价格（中位数）,ASIN 价格（中位数）,配送速度：当日达,配送速度：次日达,配送速度：隔日达\n`;
    for(let i = 0 ; i < rows.length ; i++ ){
        jsonData.push({
            'ST':rows[i].innerText.replaceAll(/,/g, ''),
            'STSCORE':dat[i*32].innerText.replaceAll(/,/g, ''),
            'STNUM':dat[i*32+1].innerText.replaceAll(/,/g, ''),
            'TOTL1':dat[i*32+2].innerText.replaceAll(/,/g, ''),
            'BR1':dat[i*32+3].innerText.replaceAll(/,/g, ''),
            'BRA1':dat[i*32+4].innerText.replaceAll(/,/g, ''),
            'TOTAL2':dat[i*32+5].innerText.replaceAll(/,/g, ''),
            'CLICK1':dat[i*32+6].innerText.replaceAll(/,/g, ''),
            'BR2':dat[i*32+7].innerText.replaceAll(/,/g, ''),
            'BRA2':dat[i*32+8].innerText.replaceAll(/,/g, ''),
            'SPJG1':dat[i*32+9].innerText.replaceAll(/,/g, ''),
            'PPJG1':dat[i*32+10].innerText.replaceAll(/,/g, ''),
            'DL1':dat[i*32+11].innerText.replaceAll(/,/g, ''),
            'PS2':dat[i*32+12].innerText.replaceAll(/,/g, ''),
            'PS3':dat[i*32+13].innerText.replaceAll(/,/g, ''),
            'TOTAL3':dat[i*32+14].innerText.replaceAll(/,/g, ''),
            'ADD1':dat[i*32+15].innerText.replaceAll(/,/g, ''),
            'BR3':dat[i*32+16].innerText.replaceAll(/,/g, ''),
            'BRA3':dat[i*32+17].innerText.replaceAll(/,/g, ''),
            'SPJG2':dat[i*32+18].innerText.replaceAll(/,/g, ''),
            'PPJG2':dat[i*32+19].innerText.replaceAll(/,/g, ''),
            'DL2':dat[i*32+20].innerText.replaceAll(/,/g, ''),
            'PS22':dat[i*32+21].innerText.replaceAll(/,/g, ''),
            'PS33':dat[i*32+22].innerText.replaceAll(/,/g, ''),
            'TOITAL4':dat[i*32+23].innerText.replaceAll(/,/g, ''),
            'B3':dat[i*32+24].innerText.replaceAll(/,/g, ''),
            'BR4':dat[i*32+25].innerText.replaceAll(/,/g, ''),
            'BRA4':dat[i*32+26].innerText.replaceAll(/,/g, ''),
            'SPJG3':dat[i*32+27].innerText.replaceAll(/,/g, ''),
            'PPJG3':dat[i*32+28].innerText.replaceAll(/,/g, ''),
            'DL3':dat[i*32+29].innerText.replaceAll(/,/g, ''),
            'PS32':dat[i*32+30].innerText.replaceAll(/,/g, ''),
            'PS43':dat[i*32+31].innerText.replaceAll(/,/g, ''),
        });
        for(let item in jsonData[i]){
            str+=`${jsonData[i][item] + '\t'},`;
        }
        str+='\n';
    }
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    var link = document.createElement("a");
    link.href = uri;
    link.download = "ABA搜索查询数据表.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}