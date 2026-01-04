// ==UserScript==
// @name         生成管理单
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  点击填充数据按钮自动补充表单数据
// @author       cfl
// @match        http://*/sk/add
// @match        https://*/sk/add
// @match        http://*/sk/update/*
// @match        https://*/sk/update/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391674/%E7%94%9F%E6%88%90%E7%AE%A1%E7%90%86%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/391674/%E7%94%9F%E6%88%90%E7%AE%A1%E7%90%86%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.$;
    var detialType_default = $('#detialType').val();
    if(typeof(detialType_default) != "undefined"){
        $('input[name="order_num"]').attr('readonly', true);
        $('input[name="pay_price_content"]').attr('readonly', true);
        $('input[name="trim_vin"]').attr('readonly', true);
        $('input[name="contract"]').attr('readonly', true);
        $('input[name="bill_note"]').attr('readonly', true);
    }
    var data = "<div id='pad_data' class='btn btn-info' style='margin-left:10px'>填充数据</div>";

    if(detialType_default){
        if($('#pad_data').length>0){
        }else{
            $('button[type="submit"]').after(data);
        }
        pad_data(detialType_default);
    }else{
        $('#detialType').on('change',function(){
            var detialType = $('#detialType').val();
            if(detialType != ''){
               // $('input[name="pay_unit"]').val('');
                $('input[name="bill_note"]').val('');
                $('input[name="contract"]').val('');
                $('input[name="order_num"]').val('');
                $('input[name="trim_vin"]').val('');
                $('input[name="pay_price_content"]').val('');

                if($('#pad_data').length>0){
                }else{
                    $('button[type="submit"]').after(data);
                };
                pad_data(detialType);
            }else{
                if($('#pad_data').length>0){
                    $('#pad_data').remove();
                }
            }
       })
    }

    function pad_data(detialType){
        //填充数据
     //  $('input').attr("readonly",false);
        $('#pad_data').click(function(){
            var client = [];
            var remark = [];
            var contract = []; //合同/信用
            var order_num = []; //订单号_展位号
            var trim_vin = [];
            var zhanwei_num = [];
            var order_zhanwei = [];
            var shuidan_num = []; //税单号
            var shuidan_chejia=[]; //税单号_车架号
            var data_more = "见明细";
            var pay_price_content = [];//收款内容
            var contract_xin = [];
            var contract_xie = [];
            var currency = []; //币种
            var rate = []; //汇率
            var currency_amount = []; //本币金额
            var chexing = []; //车型
            var remark_note = [];
            var remark_chexing = [];
            $('#addNew tbody tr').each(function(){
                $.each($(this).find(':input'),function(){
                    var name = $(this).attr('name');
                    var value = $(this).val();
                    switch(name){
                        case 'client[]':
                            if($.inArray(value,client)==-1){
                                client.push(value);
                            };break;
                        case 'note[]':
                            if($.inArray(value,remark)==-1){
                                remark.push(value);
                            };break;
                        case '商圈号[]':
                        case '合同号[]':
                        case '质保手册号[]':
                            if($.inArray(value,contract)==-1){
                                contract.push(value);
                            };break;
                        case '电子订单号[]':
                        case '房间号[]':
                        case '配件原厂编码[]':
                            if($.inArray(value,order_num) ==-1){
                                order_num.push(value);
                            };break;
                        case '车架号[]':
                            if($.inArray(value,trim_vin) ==-1){
                                trim_vin.push(value);
                            };break;
                        case '展位号[]':

                            if($.inArray(value,zhanwei_num) ==-1 ){
                                zhanwei_num.push(value);
                            };break;
                        case '税单号[]':
                            if($.inArray(value,shuidan_num) ==-1){
                                shuidan_num.push(value);
                            };break;
                        case 'type3[]':
                            if($.inArray($(this).find(':selected').text(),pay_price_content) == -1){
                                pay_price_content.push($(this).find(':selected').text());
                            };break;
                        case '信用证号[]':
                            if($.inArray(value,contract_xin) ==-1){
                                contract_xin.push(value);
                            };break;
                        case '协议号[]':
                            if($.inArray(value,contract_xie) ==-1){
                                contract_xie.push(value);
                            };break;
                        case '币种[]':
                            if(value){
                                currency.push(value);
                            }
                            break;
                        case '汇率[]':
                            if(value != ''){
                                rate.push(value);
                            }
                            break;
                        case '明细金额[]':
                            if(value){
                                currency_amount.push(value);
                            }
                            break;
                        case '车型[]':
                            if($.inArray(value,chexing) ==-1){
                                chexing.push(value);
                            };break;
                    }
                })
            })

            var remark_more = [];
            if(currency.length>0 && currency.length<2){
                if(rate.length > 0 && rate[0]){
                    remark_more.push(currency[0] + ':'+rate[0]+' ');
                }else{
                    remark_more.push(currency[0]+' ');
                }
            }else{
                $('input[name="bill_note"]').val(data_more);
            }

            if(remark_more.length == 1){
                var data = '';
                if(remark.length>0){
                    data = remark[0]+' '+ remark_more[0];
                }
                if(currency_amount.length >0){
                    data += currency_amount[0];
                }
                remark_note.push(data);console.log(remark_note);
               $('input[name="bill_note"]').val(remark_note);
            }

            if(zhanwei_num.length >0 ){
                if(order_num.length>0){
                    if(zhanwei_num.length==order_num.length){
                        $.each(zhanwei_num,function(i,v){
                            var item = '';
                            if(v == ''){
                                item = order_num[i];
                            }else if(order_num[i] == ''){
                                item = v;
                            }else{
                                if(v == order_num[i]){
                                    item = v;
                                }else{
                                    item = v+'/'+order_num[i];
                                }
                            }
                            order_zhanwei.push(item);
                        })
                    }else if(zhanwei_num.length > order_num.length){

                        $.each(zhanwei_num,function(i,v){
                            $.each(order_num,function(ii,vv){
                                var item = '';
                                if(i<=ii){
                                    if(vv == ''){
                                        item = v;
                                    }else{
                                        item = v+'/'+vv;
                                    }
                                    order_zhanwei.push(item);
                                }else{
                                    order_zhanwei.push(v);
                                }
                            })
                        })
                    }else if(zhanwei_num.length < order_num.length){
                        $.each(order_num,function(i,v){
                            $.each(zhanwei_num,function(ii,vv){
                                var item = '';
                                if(i<=ii){
                                    if(v == ''){
                                        item = vv
                                    }else{
                                        if(vv == ''){
                                            item = v;
                                        }else{
                                            item = vv+'/'+v;
                                        }
                                    }
                                    order_zhanwei.push(item);
                                }else{
                                    order_zhanwei.push(v);
                                }
                            })
                        })
                    }
                }else{
                    order_zhanwei = zhanwei_num;
                }
            }
            if(shuidan_num.length>0){
                if(trim_vin.length>0){
                    if(shuidan_num.length == trim_vin.length){
                        $.each(shuidan_num,function(i,v){
                            var item = '';
                            if(v == ''){
                                item = trim_vin[i];
                            }else if(trim_vin[i]==''){
                                item = v;
                            }else{
                                if(v == trim_vin[i]){
                                    item = v ;
                                }else{
                                    item = v + '/' + trim_vin[i];
                                }
                            }
                            shuidan_chejia.push(item);
                        })
                    }else if(shuidan_num.length > trim_vin.length){
                        $.each(shuidan_num,function(i,v){
                            $.each(trim_vin,function(ii,vv){
                                if(i <= ii){
                                    if(vv == ''){
                                        shuidan_chejia.push(v);
                                    }else{
                                        shuidan_chejia.push(v + '/'+ vv)
                                    }
                                }else{
                                    shuidan_chejia.push(v);
                                }
                            })
                        })
                    }else if(shuidan_num.length < trim_vin.length){
                        $.each(trim_vin,function(i,v){
                            $.each(shuidan_num,function(ii,vv){
                                if(i <= ii){
                                    if(v == ''){
                                        shuidan_chejia.push(vv);
                                    }else{
                                        if(v == vv){
                                            shuidan_chejia.push(v);
                                        }else{
                                            if(vv == ''){
                                                shuidan_chejia.push(v);
                                            }else{
                                                shuidan_chejia.push(v + '/' + vv);
                                            }
                                        }
                                    }
                                }else{
                                    shuidan_chejia.push(v);
                                }
                            })
                        })
                    }
                }else{
                    shuidan_chejia = shuidan_num;
                }
            }

            if(contract_xie.length>0){
                if(contract_xin.length>0){
                    if(contract_xie.length == contract_xin.length){
                        $.each(contract_xie,function(i,v){
                            var item = '';
                            if(v == ''){
                                item = contract_xin[i];
                            }else if(contract_xin[i]==''){
                                item = v;
                            }else{
                                if(v == contract_xin[i]){
                                    item = v ;
                                }else{
                                    item = v + '/' + contract_xin[i];
                                }
                            }
                            contract.push(item);
                        })
                    }else if(contract_xie.length > contract_xin.length){
                        $.each(contract_xie,function(i,v){
                            $.each(contract_xin,function(ii,vv){
                                if(i <= ii){
                                    console.log(v);
                                    console.log(vv);
                                    if(vv == ''){
                                        contract.push(v);
                                    }else{
                                        if(v ==''){
                                            contract.push(vv)
                                        }else{
                                            contract.push(v + '/' + vv);
                                        }
                                    }
                                }else{
                                    contract.push(v);
                                }
                            })
                        })
                    }else if(contract_xie.length < contract_xin.length){
                        $.each(contract_xin,function(i,v){
                            $.each(contract_xie,function(ii,vv){
                                if(i <= ii){
                                    if(v == ''){
                                        contract.push(vv);
                                    }else{
                                        if(v == vv){
                                            contract.push(v);
                                        }else{
                                            if(vv == ''){
                                                contract.push(v);
                                            }else{
                                                contract.push(vv + '/' + v);
                                            }
                                        }
                                    }
                                }else{
                                    contract.push(v);
                                }
                            })
                        })
                    }
                }else{
                    contract = contract_xie;
                }
            }else{
                if(contract_xin.length>0){
                    contract = contract_xin;
                }
            }
            if(remark.length >0 ){
                if(chexing.length>0){
                    if(remark.length==chexing.length){
                        $.each(remark,function(i,v){
                            var item = '';
                            if(v == ''){
                                item = chexing[i];
                            }else if(chexing[i] == ''){
                                item = v;
                            }else{
                                if(v == chexing[i]){
                                    item = v;
                                }else{
                                    item = v+'/'+chexing[i];
                                }
                            }
                            remark_note.push(item);
                        })
                    }else if(remark.length > chexing.length){

                        $.each(remark,function(i,v){
                            $.each(chexing,function(ii,vv){
                                var item = '';
                                if(i<=ii){
                                    if(vv == ''){
                                        item = v;
                                    }else{
                                        item = v+'/'+vv;
                                    }
                                    remark_note.push(item);
                                }else{
                                    remark_note.push(v);
                                }
                            })
                        })
                    }else if(remark.length < chexing.length){
                        $.each(chexing,function(i,v){
                            $.each(remark,function(ii,vv){
                                var item = '';
                                if(i<=ii){
                                    if(v == ''){
                                        item = vv
                                    }else{
                                        if(vv == ''){
                                            item = v;
                                        }else{
                                            item = vv+'/'+v;
                                        }
                                    }
                                    remark_note.push(item);
                                }else{
                                    remark_note.push(v);
                                }
                            })
                        })
                    }
                }else{
                    remark_note = remark;
                }
            }

            /* 付款单位 */
          /*  if(client.length >0&&client.length<=2){
                $('input[name="pay_unit"]').val(client.join(' '));
            }else if(client.length>2){
                $('input[name="pay_unit"]').val(data_more)
            }; */
            /* 备注 */
            if(currency.length == 0 &&remark_note.length >0&&remark_note.length<=2){
                $('input[name="bill_note"]').val(remark_note.join(' '));
            }else if(remark_note.length >2){
                $('input[name="bill_note"]').val(data_more);
            };

            /* 合同号 */
            if(contract.length >0&&contract.length<=2){
                $('input[name="contract"]').val(contract.join(' '));
            }else if(contract.length>2){
                $('input[name="contract"]').val(data_more);
            };

            /*   订单号/展位号   */
            if(order_zhanwei.length >0 && order_zhanwei.length<=2){
                $('input[name="order_num"]').val(order_zhanwei.join(' '));
            }else if(order_zhanwei.length > 2){
                $('input[name="order_num"]').val(data_more);
            }else{
                if(order_num.length >0&&order_num.length<=2){
                    $('input[name="order_num"]').val(order_num.join(' '));
                }else if(order_num.length>2){
                    $('input[name="order_num"]').val(data_more)
                };
            }

            if(shuidan_chejia.length >0&&shuidan_chejia.length<=2){
                $('input[name="trim_vin"]').val(shuidan_chejia.join(' '));
            }else if(shuidan_chejia.length>2){
                $('input[name="trim_vin"]').val(data_more)
            }else{
                if(trim_vin.length >0&&trim_vin.length<=2){
                    $('input[name="trim_vin"]').val(trim_vin.join(' '));
                }else if(trim_vin.length>2){
                    $('input[name="trim_vin"]').val(data_more)
                };
            }

            /*******收款内容*********/
            if(pay_price_content.length >0&&pay_price_content.length<=2){
                $('input[name="pay_price_content"]').val(pay_price_content.join(' '));
            }else if(pay_price_content.length>2){
                $('input[name="pay_price_content"]').val(data_more);
            };

        })
       // console.log(detialType);
        //禁用表单不可修改
    }
})();