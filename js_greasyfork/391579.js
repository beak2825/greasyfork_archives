// ==UserScript==
// @name         资金申请单
// @version      0.1
// @description  根据类目明细填充资金申请单
// @author       cfl
// @match        http://*/zj/add
// @match        https://*/zj/add
// @match        http://*/zj/update/*
// @match        https://*/zj/update/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.$;
    var detialType_default = $('#detialType').val()
    var data = "<div id='pad_data' class='btn btn-info' style='margin-left:10px'>填充数据</div>";
    if(typeof(detialType_default) != "undefined"){
        $('input[name="money_from"]').attr('readonly', true);
        $('input[name="contract"]').attr('readonly', true);
        $('input[name="order_num"]').attr('readonly', true);
        $('input[name="trim_vin"]').attr('readonly', true);
        $('input[name="zj_note"]').attr('readonly', true);
    }

  /*  $('input[name="money_from"]').attr('readonly', true);
    $('input[name="contract"]').attr('readonly', true);
    $('input[name="order_num"]').attr('readonly', true);
    $('input[name="trim_vin"]').attr('readonly', true);
    $('input[name="zj_note"]').attr('readonly', true);*/
    if(detialType_default){
         //修改时禁用表单
        if($('#pad_data').length>0){
        }else{
            $('button[type="submit"]').after(data);
        }
        pad_date(detialType_default);
    }else{
        $('#detialType').on('change',function(){
            var detialType = $('#detialType').val();
            if(detialType != ''){
                $('input[name="money_from"]').val('');
               // $('input[name="get_unit"]').val('');
                $('input[name="contract"]').val('');
                $('input[name="order_num"]').val('');
                $('input[name="trim_vin"]').val('');
                $('input[name="zj_note"]').val('');
                $('.ms-sel-ctn').remove('.ms-sel-item ');

                if($('#pad_data').length>0){
                }else{
                    $('button[type="submit"]').after(data);
                }
                pad_date(detialType);
            }else{
                if($('#pad_data').length>0){
                    $('#pad_data').remove();
                }
            }
        })
    }

    function pad_date(detialType){
        //填充数据
        $('#pad_data').click(function(){
            var money_from = []; //资金用途
            var get_unit = []; // 收款单位
            var zj_note = []; //备注
            var contract = [];//合同号
            var order_num = [];//订单号
            var zhanwei_num = []; //展位号
            var order_zhanwei = [];
            var shuidan_num = []; //税单号
            var shuidan_chejia=[]; //税单号_车架号
            var trim_vin = [];//税单号_车架号
            var data_more = "见明细";
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
                            if($.inArray(value,get_unit)==-1){
                                get_unit.push(value);
                            };break;
                        case 'note[]':
                            if($.inArray(value,zj_note)==-1){
                                zj_note.push(value);
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
                        case '展位号[]':
                            if($.inArray(value,zhanwei_num) ==-1 ){
                                zhanwei_num.push(value);
                            };break;
                        case '车架号[]':
                            if($.inArray(value,trim_vin) ==-1){
                                trim_vin.push(value);
                            };break;
                        case '税单号[]':
                            if($.inArray(value,shuidan_num) ==-1){
                                shuidan_num.push(value);
                            };break;
                        case 'type3[]':
                            if($.inArray($(this).find(':selected').text(),money_from) == -1){
                                if($(this).find(':selected').text()!= ''){
                                     money_from.push($(this).find(':selected').text());
                                }
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
                $('input[name="zj_note"]').val(data_more);
            }

            if(remark_more.length == 1){
                var data = '';
                if(zj_note.length>0){
                    data = zj_note[0]+' '+ remark_more[0];
                }
                if(currency_amount.length >0){
                    data += currency_amount[0];
                }
                remark_note.push(data);console.log(remark_note);
               $('input[name="zj_note"]').val(remark_note);
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
                                        console.log(vv);
                                        console.log(v);
                                        if(vv == ''){
                                            item = v;
                                        }else{
                                            item = vv+'/'+v;
                                        }
                                    }
                                    console.log(item);
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
                    contract = contract_xin
                }
            }
            if(zj_note.length >0 ){
                if(chexing.length>0){
                    if(zj_note.length==chexing.length){
                        $.each(zj_note,function(i,v){
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
                    }else if(zj_note.length > chexing.length){

                        $.each(zj_note,function(i,v){
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
                    }else if(zj_note.length < chexing.length){
                        $.each(chexing,function(i,v){
                            $.each(zj_note,function(ii,vv){
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
                    remark_note = zj_note;
                }
            }

         //   console.log(shuidan_num);
          //  console.log(trim_vin);
           // console.log(shuidan_chejia);


            /* 资金用途 */
            if(money_from.length >0&&money_from.length<=2){
                $('input[name="money_from"]').val(money_from.join(' '));
            }else if(money_from.length>2){
                $('input[name="money_from"]').val(data_more)
            };
            /* 收款单位 */
       /*     if(get_unit.length >0&&get_unit.length<=2){
                $('input[name="get_unit"]').val(get_unit.join(' '));
            }else if(get_unit.length >2){
                $('input[name="get_unit"]').val(data_more)
            };*/

            /* 合同号 */
            if(contract.length >0&&contract.length<=2){
                $('input[name="contract"]').val(contract.join(' '));
            }else if(contract.length>2){
                $('input[name="contract"]').val(data_more);
            };
            /* 备注 */
            if(currency.length == 0 && remark_note.length >0&&remark_note.length<=2){
                $('input[name="zj_note"]').val(remark_note.join(' '));
            }else if(remark_note.length >2){
                $('input[name="zj_note"]').val(data_more)
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

            /*税单_车架号*/
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
        })
    }
})();