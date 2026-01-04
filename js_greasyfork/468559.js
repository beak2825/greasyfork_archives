// ==UserScript==
// @name         读取excel文件
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  读取excel文件，生成excel文件!
// @author       BigHan
// @match        https://www.tianyancha.com/*
// @match        https://www.qcc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      BH
// @downloadURL https://update.greasyfork.org/scripts/468559/%E8%AF%BB%E5%8F%96excel%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/468559/%E8%AF%BB%E5%8F%96excel%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function import_js(src) {
        let script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    }
    import_js('https://unpkg.com/xlsx/dist/xlsx.full.min.js');
    var getUrl = 'https://www.tianyancha.com/search?key=';
    //var getUrl = 'https://www.qcc.com/web/search?key=';

    var input = document.createElement('input');
    input.type = 'file';
    input.id = 'excel';
    input.style.width="80px";
    input.style.hight="60px";
    input.style.position="fixed";
    input.style.top="80%";
    input.style.right="5px";
    input.style.align="center";
    input.style.borderRadius = '15px';
    input.style.background="rgb(222 225 205)";

    // 读取本地excel文件，读取Excel文件对象
    function readWorkbookFromLocalFile(file, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            if(callback) callback(workbook);
        };
        reader.readAsBinaryString(file);
    }

    // 转成cvs 要注意Execel表格内容不能包含英文的,不然解析出来的数据格式会有问题
    let args ;
    var times = 0;
    var resultData = [];
    var bacData = [];
    function readWorkbook(workbook) {
        var sheetNames = workbook.SheetNames; // 工作表名称集合
        sheetNames.forEach((sheet)=>{
            var worksheet = workbook.Sheets[sheet];
            var jsonData = XLSX.utils.sheet_to_json(worksheet);
            bacData = [ ].concat(jsonData);
            for (var i = 0; i < jsonData.length; i++) {
                if(i%30 == 0){
                    console.log('当前循环次数 ： '+i);
                }
                let row = jsonData[i];
                args = row['qymc'];
                if (typeof(args) == "undefined"){
                    args = row['id'];
                }
                var state = sendRequest(row);
                if(state == 0){
                    break;
                }else{
                    resultData.push(row);
                    bacData.splice(0, 1);
                }
            }
            createExcel(resultData);
        })
    }

    //发请请求
    function sendRequest(row){
        var request = new XMLHttpRequest();
        var url = getUrl+args+'&sessionNo=1686808787.41924975';
        request.open('GET',url, false);
        //overrideMimeType(); //用来强制解析 response 为 XML
        request.overrideMimeType('text/xml');
        request.send(null);
        if (request.status === 200) {
            var result = request.responseXML;
            if(result != null){
                var list = result.getElementsByClassName('index_search-item-center__Q2ai5');
                if(list.length > 0){
                    var nameSource = list[0].getElementsByClassName('index_name__qEdWi');
                    var dateSource = list[0].getElementsByClassName('index_info-col__UVcZb');
                    var name = nameSource[0].textContent;
                    var date = dateSource[2].textContent;
                    row['nqymc'] = name;
                    row['date'] = date;
                }else{
                    row['nqymc'] = '';
                    row['date'] = '';
                }
                return '1';
            }else{
                return '0';
            }
        }
    }

    //生成Excel文件
    function createExcel(data){
        if(data.length > 0){
            let nowTime = timestampToTime()
            // 导出的表格名称
            const filename =nowTime+'结果.xlsx'
            // Excel第一个sheet的名称
            const ws_name = 'Sheet1'
            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, ws_name) // 将数据添加到工作薄
            XLSX.writeFile(wb, filename) // 导出Excel
        }

        //10秒后重新请求剩余数据
        setTimeout(() => {
            if(bacData.length>0){
                console.log('执行次数 : '+times);
                resultData = [];
                times += 1;
                try {
                    bacData.forEach((row)=>{
                        args = row['qymc'];
                        if (typeof(args) == "undefined"){
                            args = row['id'];
                        }
                        var state = sendRequest(row);
                        if(state == 0){
                            throw new Error("error");
                        }else{
                            resultData.push(row);
                            bacData.splice(0, 1);
                        }
                    })
                    createExcel(resultData);
                } catch (e) {
                    createExcel(resultData);
                }
            }
        },60000);
    }
    function timestampToTime() {
        let d = new Date();
        let y = d.getFullYear();
        let m = d.getMonth()+1;
        let d1 = d.getDate();
        let h = d.getHours();
        let s = d.getMinutes();
        return ""+y + m + d1 + h + s;
    }


    setTimeout(() => {
        document.body.appendChild(input);
        document.querySelector('#excel').onchange =  function (e) {
            let file = e.target.files[0];
            readWorkbookFromLocalFile(file,  function(workbook) {
                readWorkbook(workbook);
            });
        }
    }, 1000);
})();