// ==UserScript==
// @name         iprdb
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  the expand of the website of iprdb
// @author       GGRS
// @match        https://www.iprdb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iprdb.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471235/iprdb.user.js
// @updateURL https://update.greasyfork.org/scripts/471235/iprdb.meta.js
// ==/UserScript==

console.log('脚本写入成功')

var divs = document.querySelectorAll('.result_btns'); // 获取div元素集合

divs.forEach(function(div){
    // 创建按钮元素
    var button =document.createElement('button'); // 创建元素
    button.textContent = '下载pdf'; // 改变名称
    button.className = 'ui basic horizontal label -add-filter-data'; // 添加css

    let data_dn = div.parentNode.parentNode.querySelector('li .ui input').getAttribute('data-dn'); // 获取专利公开号
    let data_title = div.parentNode.parentNode.querySelector('li .ui input').getAttribute('data-title'); // 获取专利名称
    let date = div.parentNode.parentNode.querySelector('li:nth-child(5) span').textContent.replaceAll('-','/'); // 获取公开日期
    let data_type = data_dn[2]; // 获取该专利类型，

    // 添加按钮点击事件
    button.addEventListener('click',() => {
        // let src = `https://www.iprdb.com/cn/docs/${date}/1/${data_dn}-${data_title}.pdf`; // 合成pdf访问链接
        let src = `https://www.iprdb.com/pdf_browse/web/viewer.html?file=/cn/docs/${date}/${data_type}/${data_dn}-${data_title}.pdf&udn=${data_dn}`; // 合成pdf访问链接(2023.9.15日由于网站文件地址更新而更改)
        console.log(src)
        // window.location.href = src; // 在当前窗口打开链接
        window.open(src,'_blank'); // 在新窗口打开链接
        // alert(src);
    });

    // 将按钮添加到div中
    div.appendChild(button);

    var buttonPdf = div.querySelector('.-patent-pdf'); // 获取pdf全文按钮元素
    var originalClickHandler = buttonPdf.onclick; // 保存原有click事件处理程序
    console.log('start')
    console.log(originalClickHandler)
    console.log('end')

    // 添加新的click事件处理程序
    buttonPdf.addEventListener('click',() => {
        // if (typeof originalClickHandler == 'function') {
        //     console.log('1')
        //     originalClickHandler.call(this,event);
        // }
        let pdfPath = document.querySelector('#check_pdf_show');
        // if (pdfPath) {
            console.log('02');
            pdfPath.style.display = 'block';
            pdfPath.querySelector('iframe').src = `/pdf_browse/web/viewer.html?file=/cn/docs/${date}/1/${data_dn}-${data_title}.pdf&udn=${data_dn}`;
            console.log('2');
        // }
    })
})