// ==UserScript==
// @name         tax_auto_input
// @namespace    http://blog.benull.top
// @version      0.1
// @description  auto input from excel
// @author       benull
// @match        https://inv-veri.chinatax.gov.cn/index.html
// @grant        none
// @require      https://cdn.bootcss.com/xlsx/0.15.6/xlsx.core.min.js
// @require      https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/398825/tax_auto_input.user.js
// @updateURL https://update.greasyfork.org/scripts/398825/tax_auto_input.meta.js
// ==/UserScript==
(function() {
    'use strict';
     var $$ = jQuery.noConflict();
     $(function(){
         //add file input
         var input_html = "<div id='control' style='background-color:yellow;width: 300px;height: 200px;position: fixed;z-index: 2;left:33%;top:37%' ><input type='file' id='xlsxfile' style='width:200px;height:30px' /></br><span id='info' style='width: 300px;height: 30px;font-size: 18px;display: inline-block;' >等待处理数据</span></br><span id='fahao' style='width: 300px;height: 30px;font-size: 18px;display: inline-block;margin-bottom: 10px'>当前发票号码</span></br><button type='button' id='again' style='width:120px;height:30px;margin:0;padding:0' >重新载入当前数据</button><button id='next' type='button' style='width:120px;height:30px;margin-left:20px;padding:0'>下一个数据</button><br><input type='text' id='start_index' style='width:120px;height:30px;margin-top:20px' placeholder='请输入数据编号'  /><button id='start_from' type='button' style='width:120px;height:30px;padding:0;margin-left:20px;margin-top:20px' >从第几个开始</button></div>";
         var datas = new Array();
         var index = -1;
         var now = new Array();
         $$('body').prepend(input_html);
         //upload file
         $$('#xlsxfile').change(function(){
            console.log('change');
            console.log('loading');
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
            alert('file upload success');
         });

         //setting function
         function setting(data){
             /*$('#fpdm').val('');
             $('#fphm').val('');
             $('#kprq').val('');
             $('#fpje').val('');*/
             $$('#reset').click();
             //$('#fpdm').focus();
             $$('#fpdm').val(data[0]);
            // $('#fphm').focus();
             $$('#fphm').val(data[1]);
             //$('#kprq').focus();
             $$('#kprq').val(data[2]);
            // $('#kjje').focus();
             $$('#kjje').val(data[3]);
             $$('#info').text('当前处理第'+(index+1)+'个数据');
             $$('#fahao').text('当前发票号码'+ data[1]);
             $$('#yzm').focus();
         }
         //again
         $$('#again').click(function(){
             setting(datas[index]);
         });
         //next
         $$('#next').click(function(){
             index=index+1;
             setting(datas[index]);
         });
         //from a index
         $$('#start_from').click(function(){
             var i = $('#start_index').val();
             index = i-1;
             setting(datas[i-1]);
         });

     })
})();