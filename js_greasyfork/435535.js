// ==UserScript==
// @name         深大毕设网站优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  深大毕设网站优化，加设一键导出Excel，方便查阅
// @author       kc-yu
// @include      *://ehall.szu.edu.cn/jwapp/sys/bysj/*
// @icon         https://www.google.com/s2/favicons?domain=szu.edu.cn
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://greasyfork.org/scripts/435534-json2excel/code/json2excel.js?version=988379
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435535/%E6%B7%B1%E5%A4%A7%E6%AF%95%E8%AE%BE%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/435535/%E6%B7%B1%E5%A4%A7%E6%AF%95%E8%AE%BE%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


// IIFE
(function () {
    'use strict';

    let styleElement = document.createElement('style');
    styleElement.innerHTML = `
    #download_tips {
        position: fixed;
        left: calc(40%);
        top: 10px;
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 4px;
        background-color: #36faea;
        z-index: 9999999999999999999999999999;
    }
    `
    document.querySelector('body').append(styleElement)


    window.setInterval(() => {
        document.querySelector('#ktbm-index-table').style.height = '900px'
        document.querySelector('#contentktbm-index-table').style.height = '900px'
        document.querySelector('#pagerktbm-index-table').style.bottom = '0px'
        document.querySelector('#pagerktbm-index-table').style.top = 'initial'
        document.querySelector('#horizontalScrollBarktbm-index-table').style.top = 'initial'
        document.querySelector('#horizontalScrollBarktbm-index-table').style.bottom = '28px'
        document.querySelector('#verticalScrollBarktbm-index-table').style.height = '900px'
        let content_detail = document.querySelector('#emapForm > div > div:nth-child(4) > div > textarea')
        if (content_detail) {
            content_detail.style.height = '400px'
        }
    }, 5000)

    setTimeout(() => {
        $('#ktbm-index-search > div.bh-advancedQuery.bh-mb-16 > div.bh-advancedQuery-quick > div.bh-advancedQuery-inputGroup.bh-clearfix').after('<a class="bh-btn bh-btn bh-btn-primary bh-btn-small" id="exportExcel">导出excel</a>')
        $('#exportExcel').click(getInfo)
    }, 3000)

    // JSON转换成Excel
    function JsonToExcel(jsonData, fileName, sheetName, sheetHeader) {
        var option = {};
        option.fileName = fileName;
        option.datas = [
            {
                sheetData: jsonData,
                sheetName: sheetName,
                sheetHeader: sheetHeader
            }
        ];
        var toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
    }


    // 点击下载的事件
    let getInfo = function () {
        $('#exportExcel').after('<div id="download_tips">正在导出，随后将自动下载，请稍后...</div>')
        $.post("http://ehall.szu.edu.cn/jwapp/sys/bysj/modules/xsktgl/xszjkbsbtmxx.do",
            'LCWID=1631755656088090017&querySetting=%5B%7B%22name%22%3A%22BY2%22%2C%22caption%22%3A%22BY2%22%2C%22linkOpt%22%3A%22and%22%2C%22value%22%3A%22284000%2Cfxnullfx%2C%E6%97%A0%22%2C%22builder%22%3A%22m_value_include%22%7D%2C%7B%22name%22%3A%22LCWID%22%2C%22value%22%3A%221631755656088090017%22%2C%22linkOpt%22%3A%22and%22%2C%22builder%22%3A%22equal%22%7D%5D&pageSize=1000&pageNumber=1',
            function (result) {
                console.log(result.datas.xszjkbsbtmxx.rows)
                let result_data = result.datas.xszjkbsbtmxx.rows
                let result_obj = [{
                    '论文题目':'论文题目',
                    '导师':'导师',
                    '拟带人数':'拟带人数',
                    '已确认课题人数':'已确认课题人数',
                    '待确认人数':'待确认人数',
                    '是否已满人':'是否已满人',
                    '形式':'形式',
                    '邮箱':'邮箱',
                    '办公地址':'办公地址'
                }]
                result_obj = [...result_obj,...result_data.map(function (item){
                    return {
                        '论文题目': item.LWTM,
                        '导师': item.XM,
                        '拟带人数': item.NDRS,
                        '已确认课题人数': item.YQRKTRS,
                        '待确认人数': item.YXKTRS,
                        '是否已满人': item.NDRS > item.YQRKTRS ? '否' : '是',
                        '形式': item.BYZHXLXS_DISPLAY,
                        '邮箱': item.YX,
                        '办公地址': item.BGDQ
                    }
                })]
                console.log(result_obj)
                JsonToExcel(result_obj, '毕设详细', '详细', '')
                $('#download_tips').text('下载完毕，窗口将在3s后自动关闭')
                setTimeout(()=>{
                    $('#download_tips').remove()
                },3000)
            });
    }

})();