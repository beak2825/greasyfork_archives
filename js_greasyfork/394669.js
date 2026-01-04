// ==UserScript==
// @name         拼多多商品采集
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键采集拼多多商品!
// @author       老萨
// @email        sinaapp@qq.com
// @require      https://cdn.bootcss.com/jquery/3.4.0/jquery.min.js
// @match        *://mms.pinduoduo.com/*
// @grant        GM_xmlhttpRequest
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/394669/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%93%81%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/394669/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%93%81%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

jQuery(function($) {
    'use strict';
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
                      '<td>商品名</td>'+
                      '<td style="width:80px;">单买价</td>'+
                      '</tr>'+
                      '</thead>'+
                      '<tbody>'+
                      '</tbody>'+
                      '</table>'+
                      '</div>'+

                      '<div class="sa_tab_con sa_panel_config">'+
                      '<div class="sa_config_url"><label for="sa_api_url">接口url</label><input id="sa_api_url" class="sa_input" type="text" placeholder="提交接口的url"></div>'+
                      '<div style="margin: 5px 0;">其他配置参数：</div>'+
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
                      '<div style="margin: 20px 0;">说明：<p>1、配置参数会一并提交到你的接口地址。</p><p>2、提交的数据可打开控制台查看。</p><p>3、接口返回到结果也可在控制台查看。</p></div>'+
                      '</div>'+

                      '</div>'+
                      '</div>'+

                      '<div class="sa_panel_footer">'+
                      '<div id="sa_statement"><a id="sa_statement_con" href="javascript:;">声明</a></div>'+
                      '<button id="sa_refresh" class="sa_btn sa_btn_primary" type="button">刷新数据</button>'+
                      '<button id="sa_send" class="sa_btn" type="button">提交数据</button>'+
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
    // 配置Start
    let is_open = false // 面板默认收起
    let panel_width = '400px' // 面板宽度
    let api_url = '' // 接口URL
    // 提交的参数，可以根据自己需要在这里配置（插件会根据这里的属性和值自动生成表单）
    let param = {
        userid: '',
        shopid: ''
    }
    // 配置End

    let goods_list = [] // 商品数据列表
    let select_goods_list = [] // 商品数据列表

    init()
    // 初始化
    function init(){
        switch_panel()
        get_goods_list()
        $("#sa_api_url").val(api_url)
        $.each(param, function(key, val) {
            $(".sa_param_table tbody").append('<tr><td><input name="param[key][]" value="'+key+'" type="text"></td><td><input name="param[val][]" value="'+val+'" type="text"></td><td><a class="sa_del_tr" href="javascript:;">删除</a></td></tr>')
        });
    }
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
    // 获取商品信息
    function get_goods_info(goods_id){
        return new Promise((resolve,reject) =>{
            GM_xmlhttpRequest({ //获取列表
                method : "GET",
                url : "https://mobile.yangkeduo.com/goods.html?goods_id="+goods_id,
                onload: function(response){
                    let res = response.response
                    // 获取groupID
                    let reg = /"groupID":(.*?),/g
                    let str = res.match(reg)
                    let group_id = []
                    while(str = reg.exec(res))
                    {
                        group_id.push(str[1])
                    }
                    if(group_id.length < 1){
                        sa_console('数据获取失败，请手动随便打开一个商品页面进行手动验证','异常')
                        return !1
                    }
                    // 获取店铺名称
                    let reg1 = /"mallName":"(.*?)",/
                    let mallName = reg1.exec(res)
                    // 获取skuID
                    let reg2 = /"skuID":(.*?),/
                    let skuID = reg2.exec(res)
                    let r = {
                        group_id: group_id,
                        mallName: mallName[1],
                        skuID: skuID[1]
                    }
                    resolve(r)
                }
            })
        })
    }
    function sa_console(data, title){
        console.log('---------------'+title+'Start-----------------')
        console.log(data)
        console.log('---------------'+title+'End-----------------')
    }
    // 加载商品列表
    function get_goods_list(){
        return new Promise((resolve,reject) =>{
            const data = {
                is_onsale: 1,
                page: 1,
                size: 100, // 每页显示数量
                sold_out: 0
            };
            GM_xmlhttpRequest({ //获取列表
                method : "POST",
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                url : "https://mms.pinduoduo.com/vodka/v2/mms/query/display/mall/goodsList",
                dataType: "json",
                data:JSON.stringify(data),
                onload: function(response){
                    const res = JSON.parse(response.response)
                    if(res.success === true){
                        let data = res.result
                        goods_list = data
                        sa_console(data, '数据加载')
                        if(data.total > 0){
                            $(".sa_goods_table tbody").html('')
                            for(let i=0; i<data.goods_list.length; i++){
                                let name = data.goods_list[i].goods_name
                                let price = (data.goods_list[i].sku_price[0] / 100).toFixed(2)
                                $(".sa_goods_table tbody").append('<tr><td class="sa_checkbox"><input value="'+i+'" type="checkbox"></td><td>'+name+'</td><td>'+price+'</td></tr>')
                            }
                        }
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
        })
    })
    // 提交数据
    $("#sa_send").click(function(){
        select_goods_list = []
        let url = $("#sa_api_url").val()
        let param = {}
        if(url == ''){
            alert('请先配置接口地址')
            return !1
        }
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
        // 延迟执行
        setTimeout(function () {
            if(select_goods_list.length < 1){
                alert('请先勾选要提交的数据')
                return !1
            }
            let val = []
            $("input[name='param[val][]']").each(function(i, el) {
                val.push($(this).val())
            })
            $("input[name='param[key][]']").each(function(i, el) {
                let k = $(this).val()
                if(k != ''){
                    param[k] = val[i]
                }
            })
            param.data = select_goods_list
            sa_console(param, '数据提交')
            GM_xmlhttpRequest({
                method : "POST",
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                url : url,
                dataType: "json",
                data:JSON.stringify(param),
                onload: function(response){
                    sa_console(response.response, '服务器响应')
                }
            })
        }, 300)
    })
    // 全选
    $(".sa_select_all").click(function(){
        $(this).parents('table').find("tbody input[type='checkbox']").prop("checked", $(this).prop("checked"))
    })
    // 声明
    $("#sa_statement_con").click(function(){
        alert('请打开控制台查看')
        console.log('------------声明开始-------------')
        console.log('因经营需要，经常需要对店铺进行统计分析，')
        console.log('故此写了本工具，本工具只能获取本店铺的商品信息，')
        console.log('无法对别店铺信息进行采集，')
        console.log('所以本工具不产生任何有害行为。')
        console.log('特此声明!')
        console.log('by 老萨 sinaapp@qq.com')
        console.log('------------声明结束-------------')
    })
});