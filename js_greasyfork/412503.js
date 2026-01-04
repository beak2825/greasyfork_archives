// ==UserScript==
// @name         drying
// @namespace    http://blog.benull.top
// @version      0.1
// @description  auto input from excel
// @author       benull
// @match        http://njxt.jxaas.ac.cn/jxadmin/index.aspx
// @grant        none
// @require      https://cdn.bootcss.com/xlsx/0.15.6/xlsx.core.min.js
// @require      https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/412503/drying.user.js
// @updateURL https://update.greasyfork.org/scripts/412503/drying.meta.js
// ==/UserScript==
(function() {
    'use strict';
     var $$$ = jQuery.noConflict();
     var input_html = "<div id='control' style='background-color:yellow;width: 300px;height: 200px;position: fixed;z-index: 2;left:33%;top:37%' ><input type='file' id='xlsxfile' style='width:200px;height:30px' /></br><span id='info' style='width: 300px;height: 30px;font-size: 18px;display: inline-block;' >等待处理数据</span></br><button type='button' id='start' style='width:120px;height:30px;margin:0;padding:0' >开始录入</button></div>";
     var datas = new Array();
     var index = 0;
     var interval = null;
     $(function(){
         //add file input
         $$$('body').prepend(input_html);
         //upload file
     })
    $$$('#xlsxfile').change(function(){
        var reader = new FileReader();
        reader.readAsBinaryString(document.getElementById("xlsxfile").files[0]);
        reader.onloadend = function (evt) {
            if(evt.target.readyState == FileReader.DONE){
                var data = reader.result;
                var workbook = XLSX.read(data, { type: 'binary' });
            }
            var sheet_name_list = workbook.SheetNames;
            datas = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {header:1});
            console.log(datas);
        }
        console.log('file upload success');
    });


    function setting(){
        if (index<datas.length){
            var data = datas[index]
            console.log(data)
            $$$("#mainframe").contents().find('#txtAddTime').val(data[6]);
            $$$("#mainframe").contents().find('#Textname').val(data[2]);
            $$$("#mainframe").contents().find('#txttel').val(data[3]);
            $$$("#mainframe").contents().find('#txtaddress').val(data[4]);
            $$$("#mainframe").contents().find('#txtNum').val(data[5]);
            $$$("#mainframe").contents().find('#btnSubmit').click();
            index = index + 1
        }else{
            clearInterval(interval)
        }
    }
    $$$('#start').click(function(){
        interval = setInterval(setting,2000);
    });

})();