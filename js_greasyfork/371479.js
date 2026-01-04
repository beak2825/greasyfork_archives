// ==UserScript==
// @name 企查查
// @version      0.14
// @namespace    http://qichacha.net/
// @description  try to take over the world!
// @author       YZC
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @include https://www.qichacha.com/
// @include https://www.qichacha.com/index
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/371479/%E4%BC%81%E6%9F%A5%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/371479/%E4%BC%81%E6%9F%A5%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('企查查')
    var table = '';
    var menu = $('.pull-right')
    var new_menu_item = "<li class=''><a type='button' class='' data-toggle='modal' data-target='#inputModal' style='color:red;'><b>批量查询</b></button></li>";
    var model = '<div class="modal fade in" id="inputModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" style="display: none;"> ';
    model +='       <div class="modal-dialog nmodal modal-lg">';
    model +=' <div class="modal-content" style="padding:0 10px;"> ';
    model +=' <button type="button" class="close" data-dismiss="modal">关闭</button>';
    model +=' <br><div><textarea class="form-control" rows="5" id="inputArea"></textarea></div><br>';
    model +=' <button type="button" class="btn btn-primary" id="pressInputLists">处理</button>';
    //model +=' <button type="button" class="btn btn-primary" id="xuan">选中</button>';
    model +=' <div id="jieguo"> </div>';
    model += '<style>.laiyuan em{color:red;font-weight: bold;}</style>'
    model +=' </div> ';
    model +=' </div>';
    model +=' </div>';
    menu.prepend(new_menu_item)
    $('body').append(model);
    $('#pressInputLists').click(function(){
        $('#jieguo').html('')
        var inputAreaStr = $('#inputArea').val();
        if(inputAreaStr !== ''){
            var inputAreaArr = inputAreaStr.split('\n');
            //console.log(inputAreaArr);
            for (var x in inputAreaArr){
                if(inputAreaArr[x] !== ''){
                    get_lists(inputAreaArr[x],x,press_data);
                }
            }
        }
    })

    $('#xuan').click(function(){
//         var range = document.createRange();
//         var referenceNode = $('#jieguo');
//         range.selectNodeContents(referenceNode);
//         var selection = window.getSelection();
//         //selection.removeAllRanges();
//         selection.addRange(range)
    })
    function get_lists(key, index, callback){
        var panel ='<div class="panel panel-primary" style="margin-top: 5px;">';
        panel +='    <div class="panel-heading">';
        panel +='        <h3 class="panel-title">'+key+'</h3>';
        panel +='  </div>';
        panel +='  <div class="panel-body" id="panel-body-'+index+'">';
        panel +='         </div>';
        panel +='  </div>';
        $('#jieguo').append(panel);
        //console.log(key)
        var data = {};
        data.key = key;
        data.type = 0;
        $.ajax({
            type: 'POST',
            url: 'https://www.qichacha.com/gongsi_getList',
            data: data,
            dataType:'json',
            success: function(data) {
                if(data == null || data == ''){
                  //alert('获取信息失败')
                  $('#panel-body-'+index).append('获取信息失败')
                }
                callback(key,data,index)
            }
        })
    }
    function get_info(key){
        //console.log(key)
        //console.log('get_info')
        var url ='https://www.qichacha.com/firm_'+key+'.shtml';
        $.ajax({
            type: 'GET',
            url: url,
            //dataType:'json',
            success: function(data) {
                //console.log(data)
                var company_top = $(data).find('#company-top')
                //console.log(company_top)
                var fc = company_top.find('.fc .cvlu').eq(0).find('span');
                $('#'+key).html(fc)
                //console.log(fc)
            }
        })
    }
    function press_data(k,r,i){
        var tbody = '<table class="table table-striped"><thead><tr><th>#</th><th>公司名</th><th>分类</th><th>电话</th><th>来源</th></tr></thead><tbody>';
        if(r.length > 0){
             for (var x in r){
                 tbody += '<tr class="success">';
                 tbody += '<th scope="row">'+(parseInt(x)+1)+'</th>';
                 tbody += '<td><a href="https://www.qichacha.com/firm_'+r[x].KeyNo+'.shtml" target="_blank" style="color: #0b0cef">'+r[x].Name+'</a></td>';
                 tbody += '<td>'+r[x].Reason+'</td>'
                 tbody += '<td id="'+r[x].KeyNo+'"></td>'
                 tbody += '<td class="laiyuan">'+r[x].Value+'</td>'
                 tbody += '</tr>';
               //lists +='<p id="'+r[x].KeyNo+'">'+(parseInt(x)+1)+'  <a href="https://www.qichacha.com/firm_'+r[x].KeyNo+'.shtml" target="_blank">'+r[x].Name+'</a></p><br/>';
               get_info(r[x].KeyNo)
             }
        }
        //tr += '<th>'+lists+'</th>';
        tbody += '</tbody></table>';
        $('#panel-body-'+i).append(tbody)
    }
})();