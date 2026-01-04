// ==UserScript==
// @name         拼多多商家后台-已发货订单推送
// @namespace    Esomy
// @run-at       document-start
// @version      0.4
// @description  jblzm
// @author       zh
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery-cookie/1.4.1/jquery.cookie.min.js
// @match        *://mms.pinduoduo.com/print/order/delivered*
// @exclude      *://mms.pinduoduo.com/print/exception-order*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_removeValueChangeListener
// @grant        GM_addValueChangeListener
// @grant        window.onurlchange
// @connect      118.31.60.37
// @downloadURL https://update.greasyfork.org/scripts/507462/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%AE%B6%E5%90%8E%E5%8F%B0-%E5%B7%B2%E5%8F%91%E8%B4%A7%E8%AE%A2%E5%8D%95%E6%8E%A8%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/507462/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%AE%B6%E5%90%8E%E5%8F%B0-%E5%B7%B2%E5%8F%91%E8%B4%A7%E8%AE%A2%E5%8D%95%E6%8E%A8%E9%80%81.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let formData;
    GM_setValue("formData","false");
    //拦截查询请求,获取Form表单数据
    let originFetch = fetch;
    unsafeWindow.fetch = (...arg) => {
        if (arg[0].indexOf('order/delivered') > -1) {
            console.log(arg[1].body)
            formData = arg[1].body;
            GM_setValue("formData","true");
            return originFetch(...arg);
        } else {
            //console.log('通过')
            return originFetch(...arg);
        }
    }
    // 配置Start
    let is_open = false // 面板默认收起
    let panel_width = '400px' // 面板宽度
    const api_url = "http://118.31.60.37:1008/api/Upstream/V1/ReadData" // 接口URL
    const token_url = "http://118.31.60.37:1008/api/System/V1/OtherLogin?key=0206EB94-875C-4F3C-847A-37A95A7D964B" // 接口URL
    const api_key = "0206EB94-875C-4F3C-847A-37A95A7D964B";
    const select_pageSize =500;
    let select_page = 1;
    // 提交的参数，可以根据自己需要在这里配置（插件会根据这里的属性和值自动生成表单）
    let param = {
        YsCode: GM_getValue('YsCode') === void 0?"":GM_getValue('YsCode')
    }


        $("body").prepend('<a href="javascript:;" id="sa_open">展开</a>'+
                          '<div id="sa_panel">'+
                          '<div id="sa_content">'+

                          '<div class="sa_panel_header">'+
                          '<div class="sa_tab_lable on" data-label="list">数据列表</div>'+
                          '<div class="sa_tab_lable" data-label="config">配置</div>'+
                          '</div>'+

                          '<div class="sa_panel_main">'+
                          '<div class="sa_panel_content">'+

                          '<div class="sa_tab_con sa_panel_list">'+
                          '<table class="sa_table sa_goods_table">'+
                          '<thead>'+
                          '<tr>'+
                          '<td class="sa_checkbox"><input class="sa_select_all" type="checkbox"></td>'+
                          '<td style="width:60px;">执行结果</td>'+
                          '<td>信息概要</td>'+
                          '</tr>'+
                          '</thead>'+
                          '<tbody>'+
                          '</tbody>'+
                          '</table>'+
                          '</div>'+

                          '<div class="sa_tab_con sa_panel_config">'+
                          /* '<div class="sa_config_url"><label for="sa_api_url">接口url</label><input id="sa_api_url" class="sa_input" type="text" placeholder="提交接口的url"></div>'+*/
                          '<div style="margin: 5px 0;">配置参数：</div>'+
                          '<table class="sa_table sa_param_table">'+
                          '<thead>'+
                          '<tr>'+
                          '<td style="width:100px;">key</td>'+
                          '<td>value</td>'+
                          '<td style="width:60px;">操作</td>'+
                          '</tr>'+
                          '</thead>'+
                          '<tbody>'+
                          '</tbody>'+
                          '</table>'+
                          '<button style="margin: 10px 0 0 0;" id="sa_add_param" class="sa_btn sa_btn_primary" type="button">增加</button>'+
                          '<div style="margin: 20px 0;">说明：<p>1、配置参数会一并提交到你的接口地址。</p></div>'+
                          '</div>'+

                          '</div>'+
                          '</div>'+

                          '<div class="sa_panel_footer">'+

                          '<button id="sa_refresh" class="sa_btn sa_btn_primary" disabled="true" type="button">刷新数据</button>'+
                          '<button id="sa_send" class="sa_btn" type="button" disabled="true">提交数据</button>'+
                          '</div>'+

                          '</div>'+
                          '</div>');
        GM_addStyle('#sa_panel{position: fixed;left:0;bottom:0;right:0;top:0;background:#fff;width:0;box-shadow: 0px 7px 14px 0px rgba(0, 0, 0, 0.2);z-index: 999;display:none;}'+
                    '#sa_panel p{margin-bottom:0;}'+
                    '#sa_content{display:flex;height:100%;flex-flow: column;}'+
                    '.sa_panel_header{height:46px;border-bottom: 1px solid #ebebeb;}'+
                    '.sa_panel_main{flex-grow:1;padding:20px 10px;overflow: hidden;font-size: 12px;}'+
                    '.sa_panel_footer{height:46px;background-color: #f9f9f9;padding:0 10px;text-align: right;line-height: 46px;}'+
                    '#sa_open{padding:8px 20px;color:#fff;background:#1199ee;position: fixed;width:70px;text-align:center;left:0;top:0;font-size:13px;z-index:999;}'+
                    '.sa_btn{margin:0 5px;outline: none;position: relative;height: 28px;line-height: 14px;font-size: 14px;color: #fff;padding: 0px 12px;cursor: pointer;border-radius: 3px;background: #ff5454;background-image: none;border: 1px solid transparent;min-width: 68px;}'+
                    '.sa_btn.sa_btn_primary{background:#1199ee;}'+
                    '.sa_tab_lable{float: left;line-height: 46px;padding: 0 15px;cursor: pointer;}'+
                    '.sa_tab_lable.on{border-bottom: 1px solid #1199ee;color:#1199ee;}'+
                    '.sa_tab_con{display:none;}'+
                    '.sa_tab_con.sa_panel_list{display:block;}'+
                    '.sa_panel_content{height: 100%;overflow-y: auto;}'+
                    '.sa_table{width:100%;border-collapse: collapse;border-spacing: 0;border-top:1px solid #ecf0f4;border-left:1px solid #ecf0f4;}'+
                    '.sa_table input[type=checkbox]{-webkit-appearance: checkbox;}'+
                    '.sa_checkbox{width:30px;}'+
                    '.sa_table thead tr{background:#f9f9f9;}'+
                    '.sa_table td{padding: 8px 10px;border-right:1px solid #ecf0f4;border-bottom:1px solid #ecf0f4;}'+
                    '#sa_panel input:disabled,#sa_panel button:disabled{background:#ddd !important;}'+
                    '.sa_input{border: 1px solid #dbdbdb;padding:5px 8px;border-radius: 3px;}'+
                    '#sa_api_url{margin-left:10px;width: 60%;}'+
                    '.sa_config_url{margin-bottom:10px;background: #f9f9f9;padding: 8px 10px;}'+
                    '.sa_param_table input{width:100%;border:1px solid #eee;}'+
                    '#sa_statement{float:left;line-height:46px;}'+
                    '#sa_statement a{font-size: 12px;border-bottom: 1px dotted #1199ee;color: #1199ee;}'+
                    '');

        window.addEventListener("urlchange",function(info){
            console.log(info.url.indexOf('order/delivered'));
            if(info.url.indexOf('order/delivered')<0){
                is_open = false;
                switch_panel();
                $("#sa_open").hide();
            }else{
                $("#sa_open").show();
                is_open = false;
                switch_panel();
            }
        });
        // 配置End
        /*
    let goods_list = [] // 商品数据列表
    let select_goods_list = [] // 商品数据列表
    */

        init();
        // 初始化
        function init(){
            switch_panel()
            //get_goods_list()
            //$("#sa_api_url").val(api_url)
            $.each(param, function(key, val) {
                $(".sa_param_table tbody").append('<tr><td><input name="param[key][]" value="'+key+'" type="text"></td><td><input name="param[val][]"  value="'+val+'" type="text"></td><td></td></tr>')
            });
        }

        GM_addValueChangeListener("formData",function(name,old_value,new_value,remote){
            if(new_value!="false"){
                $('#sa_refresh').removeAttr("disabled");
            }else{
                $('#sa_refresh').attr("disabled","true");
                $('#sa_send').attr("disabled","true");
            }
            console.log(''+name+' 原来的值是 '+old_value+',新值是'+new_value+'');
        });

        // 增加配置字段
        $("#sa_add_param").click(function(){
            $(".sa_param_table tbody").append('<tr><td><input name="param[key][]" value="" type="text"></td><td><input name="param[val][]" value="" type="text"></td><td><a class="sa_del_tr" href="javascript:;">删除</a></td></tr>')
        })
        // 删除配置字段
        $(document).on("click",".sa_del_tr", function(){
            $(this).parents('tr').remove()
        })
        // 展开面板
        $("#sa_open").click(function(){
            is_open = !is_open
            switch_panel()
        })
        // 开关面板
        function switch_panel(){
            if(is_open){
                $("#sa_open").css("background", "#ff5454").text('关闭').animate({'left': panel_width}, 'fast')
                $("#sa_panel").css("display", "block").animate({'width': panel_width}, 'fast')
            }else{
                $("#sa_open").css("background", "#1199ee").text('展开').animate({'left': 0}, 'fast')
                $("#sa_panel").animate({'width':0}, 'fast', function(){
                    $("#sa_panel").css("display", "none")
                })
            }
        }
        // TAB切换
        $(".sa_tab_lable").click(function(){
            if($(this).hasClass('on')){
                return !1
            }
            $(".sa_tab_lable").removeClass('on')
            $(this).addClass('on')
            let label = $(this).attr('data-label')
            $(".sa_tab_con").hide()
            $(".sa_panel_"+label).show()
        })
        function sa_console(data, title){
            console.log('---------------'+title+'Start-----------------')
            console.log(data)
            console.log('---------------'+title+'End-----------------')
        }
        // 加载商品列表
        function get_goods_list(){
            return new Promise((resolve,reject) =>{

                const data = formData;
                //获取列表
                GM_xmlhttpRequest({
                    method : "POST",
                    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                    url : "https://mms.pinduoduo.com/honolulu/order/delivered",
                    dataType: "json",
                    //data:JSON.stringify(data),
                    data:data,
                    onload: function(response){
                        const res = JSON.parse(response.response)
                        if(res.success === true){
                            let data = res.result

                            sa_console(data.total, '数据加载')
                            if(data.total>0){
                                select_page = Math.ceil(data.total/select_pageSize);
                            }
                            console.log("select_page:"+select_page);
                            $(".sa_goods_table tbody").html('')
                            $(".sa_goods_table tbody").append('<tr><td class="sa_checkbox"></td><td>查询成功</td><td>本次共查询到数据记录：'+data.total+'条</td></tr>')
                        }
                        else{
                            $(".sa_goods_table tbody").html('')
                            $(".sa_goods_table tbody").append('<tr><td class="sa_checkbox"></td><td>查询失败</td><td>接口异常</td></tr>')
                        }
                        resolve(res)
                    }
                })
            })
        }
        // 刷新
        $("#sa_refresh").click(function(){
            $(this).text('loading...').attr("disabled", true)
            get_goods_list().then((res)=>{
                $('#sa_refresh').removeAttr("disabled").text('刷新数据')
                $("#sa_send").removeAttr("disabled");
            })
        })
        // 提交数据
        $("#sa_send").click(function(){

            let dic_param = {};
            let dic_val = [];
            $("input[name='param[val][]']").each(function(i, el) {
                dic_val.push($(this).val());
            })
            $("input[name='param[key][]']").each(function(i, el) {
                let k = $(this).val();
                if(k != ''){
                    dic_param[k] = dic_val[i];
                }
            })

            //验证YsCode
            if(dic_param['YsCode'] =="") {
                alert('请先填写YsCode');
                return !1
            }
            else {
                GM_setValue('YsCode',dic_param['YsCode']);
            }

            console.log("YsCode: "+dic_param['YsCode']);

            //验证token
            console.log("api_token: 开始验证");
            validate_token()
            console.log("api_token: 结束验证");

            $(this).text('loading...').attr("disabled", true);
            //组装数据

            /*
        $.each($(".sa_goods_table tbody input[type='checkbox']:checked"),function(){
            let i = $(this).val()
            let goods_id = goods_list.goods_list[i].id
            get_goods_info(goods_id).then((res)=>{
                goods_list.goods_list[i].group_id = res.group_id
                goods_list.goods_list[i].mallName = res.mallName
                goods_list.goods_list[i].skuID = res.skuID
            })
            select_goods_list.push(goods_list.goods_list[i])
        })
        */
            // 延迟执行
            for(let i=1;i<=select_page;i++){
                setTimeout(function () {

                    //sa_console("", '数据提交');
                    formData = JSON.parse(formData);
                    formData.pageSize = select_pageSize;
                    formData.page = i;
                    formData = JSON.stringify(formData);
                    const data = formData;
                    //获取列表
                    GM_xmlhttpRequest({
                        method : "POST",
                        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                        url : "https://mms.pinduoduo.com/honolulu/order/delivered",
                        dataType: "json",
                        //data:JSON.stringify(formData),
                        data:data,
                        onload: function(response){
                            const res = JSON.parse(response.response)
                            //console.log(res);
                            if(res.success === true){
                                let data = res.result;
                                //$(".sa_goods_table tbody").append('<tr><td class="sa_checkbox"></td><td>查询成功</td><td>第'+i+'页</td></tr>')
                                let select_goods_list = [];
                                if(data.total>0){
                                    //组装数据
                                    data.list.forEach(function(value,index){
                                        select_goods_list.push({
                                            YsCode:dic_param['YsCode'],
                                            OrderId:value.orderSn,
                                            Sku: value.spec,
                                            SkuCode:'',
                                            Quantity:value.goodsNumber,
                                            ExpressNumber:value.trackingNumber,
                                            GoodNumber:'无',
                                            BuyerRemark:value.buyerMemo,
                                            SellerRemark:value.remark,
                                            Platform:'PDD_GF',
                                            ShopName:value.mallName,
                                            ThumbUrl:value.thumbUrl
                                        });
                                    });
                                }


                                send_data(i,select_goods_list);

                            }
                            else{
                                $(".sa_goods_table tbody").append('<tr><td class="sa_checkbox"></td><td>查询失败</td><td>第'+i+'页，接口异常</td></tr>')
                            }
                        }
                    })

                }, 1000*i)
            }
            $(this).text('提交数据');

        })

        //验证token
        function validate_token(){

            if ($.cookie('api_token') === void 0){
                console.log("api_token: token已过期,重新获取");
                GM_xmlhttpRequest({ //获取列表
                    method : "GET",
                    url : token_url,
                    onload: function(response){
                        let res = JSON.parse(response.response);
                        console.log("api_token: " + res.Token);
                        $.cookie('api_token', res.Token, { expires: 1});
                    }
                })
            } else{
                console.log("api_token: token未过期-"+$.cookie('api_token'));
            }
        }
        function send_data(send_page,send_list){
            let build_data ={orderList:send_list};
            sa_console(build_data, '组装数据');
            if(send_list.length>0){
                GM_xmlhttpRequest({
                    method : "POST",
                    headers: { 'Content-Type': 'application/json; charset=UTF-8','tokens':$.cookie('api_token') },
                    url : api_url,
                    dataType: "json",
                    data:JSON.stringify(build_data),
                    //data:build_data,
                    onload: function(response){
                        const res = JSON.parse(response.response)
                        //console.log(res);
                        let msg = "";
                        if(res.Status === true){

                            msg = "提交成功";
                        }else{
                            msg = "提交失败";
                        }
                        sa_console(res, '接口返回数据');
                        $(".sa_goods_table tbody").append('<tr><td class="sa_checkbox"></td><td>'+msg+'</td><td>第'+send_page+'页：'+res.Message+'</td></tr>');

                    }
                })
            }else{
                $(".sa_goods_table tbody").append('<tr><td class="sa_checkbox"></td><td>提交终止</td><td>第'+send_page+'页，无数据</td></tr>')
            }
        }

        // 全选
        $(".sa_select_all").click(function(){
            $.removeCookie('api_token');
            $(this).parents('table').find("tbody input[type='checkbox']").prop("checked", $(this).prop("checked"))
        })

})();

