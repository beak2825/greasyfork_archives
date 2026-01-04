// ==UserScript==
// @name         白盒覆盖率报告覆盖率插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于jacoco报告的计算行覆盖率!
// @author       lulu
// @match        https://coverage-report.inshopline.com/*
// @match        file:///*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myshopline.cn
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require      https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.all.min.js

// @downloadURL https://update.greasyfork.org/scripts/539937/%E7%99%BD%E7%9B%92%E8%A6%86%E7%9B%96%E7%8E%87%E6%8A%A5%E5%91%8A%E8%A6%86%E7%9B%96%E7%8E%87%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/539937/%E7%99%BD%E7%9B%92%E8%A6%86%E7%9B%96%E7%8E%87%E6%8A%A5%E5%91%8A%E8%A6%86%E7%9B%96%E7%8E%87%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var element = document.querySelector("tbody");
    var thead = document.querySelector('td#i');
    var theadtdratio = document.createElement('td');
    var coveredtd = document.createElement('td');
    // 底部
    var foot = document.querySelector('tfoot > tr > td:nth-of-type(9)');
    var footcovered = document.createElement('td');
    var footratiotd = document.createElement('td');
    footcovered.setAttribute('class','ctr2')
    footratiotd.setAttribute('class','ctr2')
    foot.before(footcovered);
    foot.after(footratiotd);
    //设置表头
    theadtdratio.innerHTML = '行覆盖率比例';
    coveredtd.innerHTML = 'Covered';
    thead.before(coveredtd);
    thead.after(theadtdratio);
    var coveredConut = 0;
    // 获取地址
    var url =window.location.href;
    var baseUrl = url.substring(0,url.lastIndexOf('/')+1)
    console.log('读取地址：',baseUrl)


    for(var i=0; i<element.rows.length; i++){
      var miss = parseInt(element.rows[i].cells[7].innerHTML.replace(/,/g, ""));
      var lines = parseInt(element.rows[i].cells[8].innerHTML.replace(/,/g, ""));
      var link = element.rows[i].cells[0].querySelector('a').getAttribute('href');
      var covered = lines - miss
      var result =Math.round((1- miss/lines) * 10000) / 100;

      //添加结果
      var td = document.createElement('td');
      var alink = document.createElement('a');
      alink.innerHTML = result +'%'
      alink.href = baseUrl + link
      td.appendChild(alink);
      td.setAttribute('class','ctr2');
      var coveredtd1 = document.createElement('td');
      coveredtd1.innerHTML = covered;
      coveredtd1.setAttribute('class','ctr2')
      element.rows[i].cells[7].after(coveredtd1);
      element.rows[i].cells[9].after(td);
      coveredConut += covered;

      if(result>=35 && result <= 80){
          td.style.backgroundColor = '#00FFCC';

      }
      else if(result == 100){
          td.style.backgroundColor = 'green';
      }
      else if(result >= 80 && result < 100){

          footratiotd.style.backgroundColor = '#9486bd';
      }
      //低于70%
      else{
          td.style.backgroundColor = 'red';

      }
      //总覆盖率
      //totalLines += result;
      console.log(miss,lines,link,result);
    }

     footcovered.innerHTML = coveredConut;
     var tatolratiotd = coveredConut/parseInt(document.querySelector('tfoot > tr > td:nth-of-type(10)').innerHTML.replace(/,/g, "")) ;
     footratiotd.innerHTML = Math.round(tatolratiotd * 10000) / 100 + '%';

    if(tatolratiotd >= 35 && tatolratiotd < 80){

          footratiotd.style.backgroundColor = '#00FFCC';
      }
      else if(tatolratiotd >= 100){

          footratiotd.style.backgroundColor = 'green';
      }
      else if(tatolratiotd >= 80 && tatolratiotd < 100){

          footratiotd.style.backgroundColor = '#9486bd';
      }
      //低于70%
      else{
          footratiotd.style.backgroundColor = 'red';
      }


     const copy = (text) => {
         GM_setClipboard(text, 'text');
     }

})();