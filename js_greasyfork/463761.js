// ==UserScript==
// @name         Amz销量提取器 | 逍遥哥
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  最近AMZ在前台公布了部分品类的销量数据，市面暂无使用亚马逊官方数据进行销量统计的插件，自己写一个
// @author       逍遥哥·某知名出海品牌公司软件产品经理·业余编程爱好者
// @license       
// @match        *://www.amazon.com/*
// @match        *://www.amazon.ca/*
// @match        *://www.amazon.co.uk/*
// @match        *://www.amazon.de/*
// @match        *://www.amazon.fr/*
// @match        *://www.amazon.it/*
// @match        *://www.amazon.es/*
// @icon         https://cdn.shopify.com/s/files/1/0504/7094/4954/files/favicon_96_180x180.png?v=1614767213
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463761/Amz%E9%94%80%E9%87%8F%E6%8F%90%E5%8F%96%E5%99%A8%20%7C%20%E9%80%8D%E9%81%A5%E5%93%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/463761/Amz%E9%94%80%E9%87%8F%E6%8F%90%E5%8F%96%E5%99%A8%20%7C%20%E9%80%8D%E9%81%A5%E5%93%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

var webURL = window.location.href;
//5、通过正则提取销量和销售额
var unitSum=0,priceSum=0,unitCur;
var i,j=-1,unitInx={};

//创建表格、表格行
var oTable = document.createElement('table');
oTable.setAttribute('width','500px');
oTable.setAttribute('border','1px');
var oTr = document.createElement('tr');
//创建单元格-序号
var oTd_inx = document.createElement('td');
var oTxt_inx = document.createTextNode('序号');
oTd_inx.appendChild(oTxt_inx);
//创建单元格-asin
var oTd_asin = document.createElement('td');
var oTxt_asin = document.createTextNode('asin');
oTd_asin.appendChild(oTxt_asin);
//创建单元格-该商品销售额
var oTd_priceCur = document.createElement('td');
var oTxt_priceCur = document.createTextNode('该商品销售额');
oTd_priceCur.appendChild(oTxt_priceCur);
//创建单元格-累计销量
var oTd_unitSum = document.createElement('td');
var oTxt_unitSum = document.createTextNode('累计销量');
oTd_unitSum.appendChild(oTxt_unitSum);
//创建单元格-累计销售额
var oTd_priceSum = document.createElement('td');
var oTxt_priceSum = document.createTextNode('累计销售额');
oTd_priceSum.appendChild(oTxt_priceSum);
//添加单元格
oTr.appendChild(oTd_inx);
oTr.appendChild(oTd_asin);
oTr.appendChild(oTd_priceCur);
oTr.appendChild(oTd_unitSum);
oTr.appendChild(oTd_priceSum);
//添加表格行
oTable.appendChild(oTr);

if(webURL.match(/.*amazon.com\/s\?me=\w{13}/) !== null){
    console.log('店铺主页');
    var products = document.querySelectorAll('div[data-asin*="B"]');
    for(i = 0; i < products.length; i++){
        var productHtml = products[i].outerHTML;
        var asin = productHtml.match(/asin=\"?\w{10}/gi)[0];
        asin = asin.replace('asin=','');
        asin = asin.replace('"','');
        //console.log(asin);

        if(productHtml.indexOf('bought in past') !== -1){
            j=j+1;
            // unitInx[i]=j;
            //console.log(i+':'+j);
            //console.log(unitInx);
            //console.log(i,j);
            var unitCurStr = productHtml.match(/(?<=secondary">)\d.+\+.bought.in.past.[month|week]*/gi);
            // unitCurStr = unitCurStr.indexOf('K') > -1 ? unitCurStr.replace('K','000') : unitCurStr;
            // unitCurStr = unitCurStr.match(/\d+/);
            var priceCurStr = productHtml.match(/<span class="a-price-whole">\d+,?\d+/gi);

            unitCurStr = unitCurStr[0].indexOf('K') !== -1 ? parseInt(unitCurStr[0].replace('K','000')) : parseInt(unitCurStr[0]);
            //unitCurStr = unitCurStr[0].match(/\d+/);
            unitCur = unitCurStr;
            priceCurStr = priceCurStr[0].indexOf(',') !== -1 ? priceCurStr[0].replace(',','') : priceCurStr[0];
            priceCurStr = priceCurStr.match(/\d+/gi);
            var priceCur = priceCurStr[0];
            unitSum += unitCur;
            priceSum += priceCur * unitCur;
            let jisuan = 'Index' + (i+1) + '：' + unitCur.toLocaleString() + ' * ' + priceCur + ' = ' + (unitCur * priceCur).toLocaleString();

            //创建表格行
            oTr = document.createElement('tr');

            //创建单元格-序号
            oTd_inx = document.createElement('td');
            oTxt_inx = document.createTextNode(j+1);
            oTd_inx.appendChild(oTxt_inx);

            //创建单元格-asin
            var img_src = productHtml.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[0];
            img_src = img_src.replace('src=','').replaceAll('"','');
            oTd_asin = document.createElement('td');
            var oTar = document.createElement('a');
            oTar.setAttribute('href','https://www.amazon.com/dp/' + asin);
            oTar.setAttribute('target','_blank');
            oTxt_asin = document.createTextNode(asin);
            var oBr = document.createElement('br');
            var oImg = document.createElement('img');
            oImg.setAttribute('src',img_src);
            oImg.setAttribute('height','50px');
            oTar.appendChild(oTxt_asin);
            oTar.appendChild(oBr);
            oTar.appendChild(oImg);
            oTd_asin.appendChild(oTar);



            //创建单元格-该商品销售额
            oTd_priceCur = document.createElement('td');
            oTxt_priceCur = document.createTextNode(jisuan);
            oTd_priceCur.appendChild(oTxt_priceCur);

            //创建单元格和文本节点-累计销量
            oTd_unitSum = document.createElement('td');
            oTxt_unitSum = document.createTextNode(unitSum.toLocaleString());
            oTd_unitSum.appendChild(oTxt_unitSum);

            //创建单元格和文本节点-累计销售额
            oTd_priceSum = document.createElement('td');
            oTxt_priceSum = document.createTextNode(priceSum.toLocaleString());
            oTd_priceSum.appendChild(oTxt_priceSum);

            //表格行添加单元格
            oTr.appendChild(oTd_inx);
            oTr.appendChild(oTd_asin);
            oTr.appendChild(oTd_priceCur);
            oTr.appendChild(oTd_unitSum);
            oTr.appendChild(oTd_priceSum);

            //表格添加行
            oTable.appendChild(oTr);

            //输出表格
            //console.log(oTable);

            // console.log('---------------------------');
            // console.log('⎜ ' + (j+1) + '：Index' + (i+1) + '：' + unitCur + '*' + priceCur + '=' + unitCur * priceCur);
            // console.log('⎜ 总销量：' + unitSum);
            // console.log('⎜总销售额：' + priceSum);

            // console.log('索引'+ i + '：' + 'unitCur：' + unitCur + '，priceCur：' + priceCur);
        }else{
            //console.log(i+':'+j);
            //j=j+1;
        }
    }

    // window.sessionStorage['preTable'] = JSON.stringify(oTable);


    let topAd = document.querySelectorAll('span[data-component-type="s-messaging-widget-results-header"]')[0];
    topAd.appendChild(oTable);

}else{
    console.log('搜索结果页');
    let oA = document.querySelectorAll('a[href]');
    oA.forEach((item)=>{
        item.setAttribute('target','');
    });
    var asinArray = [];

    let products = document.querySelectorAll('div[data-asin*="B"]');
    for(i = 0; i < products.length; i++){
        let productHtml = products[i].outerHTML;

        if(productHtml.indexOf('bought in past') !== -1){
            let asin = productHtml.match(/asin=\w{10}/gi)[0];
            asin = asin.replace('asin=','');
            //console.log(asin);
            if(asinArray.indexOf(asin) == -1){
            asinArray.push(asin);
            //console.log(asinArray);
                j=j+1;
                // unitInx[i]=j;
                //console.log(i+':'+j);
                //console.log(unitInx);
                //console.log(i,j);
                let unitCurStr = productHtml.match(/(?<=secondary">)\d.+\+.bought.in.past.[month|week]*/gi);
                // unitCurStr = unitCurStr.indexOf('K') > -1 ? unitCurStr.replace('K','000') : unitCurStr;
                // unitCurStr = unitCurStr.match(/\d+/);
                let priceCurStr = productHtml.match(/<span class="a-price-whole">\d+,?\d+/gi);

                unitCurStr = unitCurStr[0].indexOf('K') !== -1 ? parseInt(unitCurStr[0].replace('K','000')) : parseInt(unitCurStr[0]);
                //unitCurStr = unitCurStr[0].match(/\d+/);
                unitCur = unitCurStr;
                priceCurStr = priceCurStr[0].indexOf(',') !== -1 ? priceCurStr[0].replace(',','') : priceCurStr[0];
                priceCurStr = priceCurStr.match(/\d+/gi);
                let priceCur = priceCurStr[0];
                unitSum += unitCur;
                priceSum += priceCur * unitCur;
                let jisuan = 'Index' + (i+1) + '：' + unitCur.toLocaleString() + ' * ' + priceCur + ' = ' + (unitCur * priceCur).toLocaleString();

                //创建表格行
                oTr = document.createElement('tr');

                //创建单元格-序号
                oTd_inx = document.createElement('td');
                oTxt_inx = document.createTextNode(j+1);
                oTd_inx.appendChild(oTxt_inx);

                //创建单元格-asin
                let img_src = productHtml.match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)[0];
                img_src = img_src.replace('src=','').replaceAll('"','');
                oTd_asin = document.createElement('td');
                let oTar = document.createElement('a');
                oTar.setAttribute('href','https://www.amazon.com/dp/' + asin);
                oTar.setAttribute('target','_blank');
                oTxt_asin = document.createTextNode(asin);
                let oBr = document.createElement('br');
                let oImg = document.createElement('img');
                oImg.setAttribute('src',img_src);
                oImg.setAttribute('height','50px');
                oTar.appendChild(oTxt_asin);
                oTar.appendChild(oBr);
                oTar.appendChild(oImg);
                oTd_asin.appendChild(oTar);



                //创建单元格-该商品销售额
                oTd_priceCur = document.createElement('td');
                oTxt_priceCur = document.createTextNode(jisuan);
                oTd_priceCur.appendChild(oTxt_priceCur);

                //创建单元格和文本节点-累计销量
                oTd_unitSum = document.createElement('td');
                oTxt_unitSum = document.createTextNode(unitSum.toLocaleString());
                oTd_unitSum.appendChild(oTxt_unitSum);

                //创建单元格和文本节点-累计销售额
                oTd_priceSum = document.createElement('td');
                oTxt_priceSum = document.createTextNode(priceSum.toLocaleString());
                oTd_priceSum.appendChild(oTxt_priceSum);

                //表格行添加单元格
                oTr.appendChild(oTd_inx);
                oTr.appendChild(oTd_asin);
                oTr.appendChild(oTd_priceCur);
                oTr.appendChild(oTd_unitSum);
                oTr.appendChild(oTd_priceSum);

                //表格添加行
                oTable.appendChild(oTr);

                //输出表格
                //console.log(oTable);

                // console.log('---------------------------');
                // console.log('⎜ ' + (j+1) + '：Index' + (i+1) + '：' + unitCur + '*' + priceCur + '=' + unitCur * priceCur);
                // console.log('⎜ 总销量：' + unitSum);
                // console.log('⎜总销售额：' + priceSum);

                // console.log('索引'+ i + '：' + 'unitCur：' + unitCur + '，priceCur：' + priceCur);
            }else{
                //console.log(i+':'+j);
                //j=j+1;
            }
        }
    }

    // window.sessionStorage['preTable'] = JSON.stringify(oTable);


    let topAd = document.getElementsByClassName('s-result-item s-widget s-widget-spacing-large AdHolder s-flex-full-width')[0];
    topAd.appendChild(oTable);
}
})();