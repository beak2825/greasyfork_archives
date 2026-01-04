// ==UserScript==
// @name         开盘啦-打版列表
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  按指定日期导出打版列表
// @author       xiajie
// @match        https://www.kaipanla.com/*
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.16.9/dist/xlsx.mini.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kaipanla.com
// @grant        GM_xmlhttpRequest
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/518548/%E5%BC%80%E7%9B%98%E5%95%A6-%E6%89%93%E7%89%88%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/518548/%E5%BC%80%E7%9B%98%E5%95%A6-%E6%89%93%E7%89%88%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var dataList = [];
    
    addhtml();

    function addhtml(){
        var css = "'position:fixed;z-index:99999;top:0;right:0;width:120px;height:40px;text-align:center;line-height:40px;background:red;color:#fff;cursor:pointer;border:2px solid #fff;box-shadow:0 0 10px #999'";
        var css2 = "'position:fixed;z-index:99999;top:0;right:200px;width:120px;height:40px;text-align:center;line-height:40px;background:#ccc;color:#fff;cursor:pointer;border:2px solid #fff;box-shadow:0 0 10px #999'";
        var html = "<input type='date' id='timeDate'  style="+css2+" /><div id='learnText' style="+css+">导出列表</div>"
        $('body').append(html);
    }
    $("body").on("click", "#learnText", function(){
        let day = $('#timeDate').val();
        if(day){
            getMoreData(day);
            dataList = [];
            setTimeout(function(){
                console.log(day);
                exportToExcel(day);
            },3000);
        }
    })

    function getMoreData(day){
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var date = today.getDate();
        //var day = year + "-" + month + "-" + date;
        //var day = today.toISOString().slice(0, 10)
        //var day = '2024-11-08';
        for(var i=0;i<5;i++){
            getDataList(day,i*75)
        }
    }

     function getDataList(day,index){
        GM_xmlhttpRequest({
            url: "https://apphis.longhuvip.com/w1/api/index.php?Order=1&a=HisDaBanList&st=75&c=HisHomeDingPan&PhoneOSNew=1&DeviceID=85c89c9b-9488-3207-b3d3-c4f0b4adc9c2&VerSion=5.16.0.0&Index="+index+"&Is_st=1&PidType=8&apiv=w38&Type=20&FilterMotherboard=0&Filter=0&FilterTIB=0&Day="+day+"&FilterGem=0",
            method: 'POST',
            headers: {
                'User-Agent':'PostmanRuntime-ApipostRuntime/1.1.0',
                'Host': 'apphis.longhuvip.com',
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Cache-Control': 'no-cache',
            },
            //data: formData,
            responseType:'json',
            async: false,
            onload:function(res){
                //console.log(day,index)
                //console.log(res.response)
                dataList.push(...res.response.list)
            },
            onerror:function(err){
                console.log(err)
            }
        });
    }

         // 导出数据到Excel
    function exportToExcel(day) {
        //var response = getDataLisat();
        //var dataList = response.list
        //console.log(dataList)
        //return;
        if (dataList.length === 0) {
            alert('没有数据！');
            return;
        }
        var today = new Date();
        var len = dataList.length;
        var exportList = [];
        for(var i=0;i<len;i++){
            exportList.push({
                '股票代码': dataList[i][0],
                '股票名称': dataList[i][1],
                '涨停委买额':formatNumber(dataList[i][18]),
                '竞价涨幅':parseFloat(dataList[i][19]).toFixed(2)+'%',
                '实时涨幅':parseFloat(dataList[i][4]).toFixed(2)+'%',
                '板块':dataList[i][11],
                '竞价净额':formatNumber(dataList[i][20]),
                '竞价成交额':formatNumber(dataList[i][22]),
                '竞价换手':parseFloat(dataList[i][21]).toFixed(2)+'%',
                '实际流通':formatNumber(dataList[i][15]),
            });
        }

        // 创建一个新的Excel文件
        var wb = XLSX.utils.book_new();
        // 将商品信息添加到工作表
        var ws = XLSX.utils.json_to_sheet(exportList);
        // 将工作表添加到工作簿
        ws['!cols'] = [{ wch: 10 },{ wch: 15 },{ wch: 15 },{ wch: 10 },{ wch: 10 },{ wch: 30 },{ wch: 15 },{ wch: 15 },{ wch: 10 },{ wch: 15 }];
        XLSX.utils.book_append_sheet(wb, ws, day);
        // 生成Excel文件
        var fileName = '打版列表_' + day + '.xlsx';
        // 保存文件
        XLSX.writeFile(wb, fileName);
    }


    function formatNumber(num) {
        const units = ['', '万', '亿'];
        let absNum = Math.abs(num); // 取绝对值处理负数
        let unitIndex = 0;
        // 判断数字范围，选择对应的单位
        if (absNum >= 100000000) {
            absNum /= 100000000;
            unitIndex = 2;
        } else if (absNum >= 10000) {
            absNum /= 10000;
            unitIndex = 1;
        }
        // 处理小数部分，保留两位小数
        absNum = absNum.toFixed(2);
        // 拼接单位并处理负数
        const formattedNum = `${num < 0 ? '-' : ''}${absNum}${units[unitIndex]}`;
        return formattedNum;
    }
})();