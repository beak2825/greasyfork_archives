// ==UserScript==
// @name         费用报销单
// @version      0.1
// @description  填充费用报销单明细
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.$;
    var detialType_default = $('#detialType').val()
    var data = "<div id='pad_data' class='btn btn-info' style='margin-left:10px'>填充数据</div>";
    if(detialType_default){
        if($('#pad_data').length>0){
        }else{
            $('button[type="submit"]').after(data);
        }
        pad_date();
    }else{
        $('#detialType').on('change',function(){
            var detialType = $('#detialType').val()

            if(detialType != ''){
                $('input[name^="repay_price"]').val('');
                $('input[name^="repay_content"]').val('');
                $('input[name^="repay_title"]').val('');
                $('input[name^="repay_user"]').val('');

                if($('#pad_data').length>0){
                }else{
                    $('button[type="submit"]').after(data);
                }
                pad_date();
            }else{
                if($('#pad_data').length>0){
                    $('#pad_data').remove();
                }
            }
     })
    }
    function pad_date(){
         //填充数据
        $('#pad_data').click(function(){
            $('input[name^=repay_').val('');
            $('#addNew tbody tr').each(function(index,element){
                $.each($(this).find(':input'),function(){
                    var name = $(this).attr('name');
                    var value = $(this).val();
                    switch(name){
                        case 'price[]':
                            $('input[name="repay_price'+(index+1)+'"]').val(value);
                            break;
                        case 'note[]':
                            $('input[name="repay_content'+(index+1)+'"]').val(value);
                            break;
                        case 'type3[]':
                            $('input[name="repay_title'+(index+1)+'"]').val($(this).find(':selected').text());
                            break;
                        case '实际内容[]':
                            $('input[name="repay_user'+(index+2)+'"]').val(value);
                    }
                })
            })
        })
    }
})();