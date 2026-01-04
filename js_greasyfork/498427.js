// ==UserScript==
// @name       INVOICE
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  get info for INVOICE
// @author       You
// @match        https://fp.jss.com.cn/*
// @grant        GM_addStyle
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://www.layuicdn.com/layer-v3.5.1/layer.js
// @downloadURL https://update.greasyfork.org/scripts/498427/INVOICE.user.js
// @updateURL https://update.greasyfork.org/scripts/498427/INVOICE.meta.js
// ==/UserScript==


(function() {
    GM_addStyle(`#item_list table tr td{padding:6px}`)
    GM_addStyle(`.height50{height:50px!important}`)

	$("head").append('<link rel="stylesheet" href="https://s.kingdom.net.cn/static/bootstrap.min.css">');
	$("head").append('<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css">');

    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

	var num = '';

    var getlist = null;
    var url = window.location.href;

		if (url.indexOf('?') != -1) {
			var temp = url.split('?')
			var temp1 = temp[1].split('&')
			num = temp1[0].replace('o=','');
		}

    if (url.indexOf('platform/make') != -1) {
        getlist = setInterval(make,1000);
    } else if (url.indexOf('platform/record') != -1) {
        getlist = setInterval(record,1000);
    }

    $('body').on('click', '#toggle', function() {
		$('#item_list').toggleClass('height50');
    })

    $('body').on('click', '.copy_text', function() {
		var text = $(this).text();
		var temp = $('<input>');
		$('body').append(temp);
		temp.val(text).select();
		document.execCommand('copy');
		temp.remove();
    })

    $('body').on('click', '#save', function() {
        window.location.href = 'https://fp.jss.com.cn/#/platform/record?o='+num;
        location.reload(true);
    })

    $('body').on('click', '#link', function() {
        var pdf = $('.ant-modal-content').find('iframe').attr('src');
        $.post('https://s.kingdom.net.cn/api/home/index/savePdf',{num:num,pdf:pdf},function(res){
            alert(res.msg)
        })
    })

    $('body').on('click', '#unlink', function() {
		var html = '<form class="form-horizontal" style="padding:20px;">'+
			     '<div class="form-group">'+
			     '<label class="col-xs-3 control-label">同步单号：</label>'+
			     '<div class="col-xs-9">'+
			     '<input type="text" id="invoice_id" class="form-control" value="">'+
			     '</div>'+
			     '</div>'+
					'</form>';

		var form = layer.open({
			type: 1,
			title: '异常同步单号',
			area: ['500px','200px'],
			btn: ['提交'],
			closeBtn : 2,
			shadeClose: true,
			content: html,
			yes: function(index){
				var invoice_id = $('#invoice_id').val();
				var pdf = $('.ant-modal-content').find('iframe').attr('src');
				$.post('https://s.kingdom.net.cn/api/home/index/savePdf',{num:invoice_id,pdf:pdf},function(res){
					layer.msg(res.msg)
				})
			}
		})
    })

    function make() {
		var invoice = $('.invoice-inner_1Z0ha');
		if (invoice.length > 0) {
			clearInterval(getlist);

        $.post('https://s.kingdom.net.cn/api/home/index/searchInvoiceInfo',{num:num},function(res){
            if (res.code == 1) {
                var list = res.data.list;
                var info = res.data.info;
						var count = 0;
                var div = '<div id="item_list" style="position: absolute;top: 20%;right: 1%;background: #eee;z-index: 100;padding: 12px 16px;text-align: center;width: 350px;height: 360px;overflow-y:scroll">';
                div += '<button id="save" type="button" class="ant-btn ant-btn-primary e-mb8_3vuQ8 btn-mr"><span>同步发票</span></button>';
                div += '<button id="toggle" type="button" class="ant-btn e-mb8_3vuQ8"><span>折叠</span></button>';
                div += '<table border=1 style="width:100%">';
                div += '<tr><td colspan="5" align="left">发票抬头：<span class="copy_text">'+info.company+'</span></td><tr>';
                div += '<tr><td colspan="5" align="left">税号：<span class="copy_text">'+info.code+'</span></td><tr>';
                div += '<tr><td colspan="5" align="left">地址：<span class="copy_text">'+info.address+'</span></td><tr>';
                div += '<tr><td colspan="5" align="left">电话：<span class="copy_text">'+info.phone+'</span></td><tr>';
                div += '<tr><td colspan="5" align="left">开户行：<span class="copy_text">'+info.bank+'</span></td><tr>';
                div += '<tr><td colspan="5" align="left">账号：<span class="copy_text">'+info.card+'</span></td><tr>';
                div += '<tr><td colspan="5" align="left">邮箱：<span class="copy_text">'+info.email+'</span></td><tr>';
                div += '<tr><td colspan="5" align="left">手机：<span class="copy_text">'+info.mobile+'</span></td><tr>';
                div += '<tr><td colspan="5" align="left">卖家备注：<span class="copy_text">'+info.sell+'</span></td><tr>';
                div += '<tr><td colspan="5" align="left">开票类型：<span class="copy_text">'+info.type+'</span></td><tr>';
                div += '<tr><td colspan="5" align="left">开票内容：<span class="copy_text">'+info.content+'</span></td><tr>';
                div += '<tr>'+
                        '<td>名称</td>'+
                        '<td>单位</td>'+
                        '<td>数量</td>'+
                        '<td>单价</td>'+
                        '<td>总价</td>'+
                        '<tr>';
                $.each(list,function(k,v){
							var temp_count = parseFloat(v.price)*parseInt(v.num);
							count += temp_count;
                    div += '<tr>'+
                            '<td>'+v.name+'</td>'+
                            '<td>'+v.unit+'</td>'+
                            '<td>'+v.num+'</td>'+
                            '<td>'+v.price+'</td>'+
                            '<td>'+temp_count.toFixed(2)+'</td>'+
                         '<tr>';
                })
						div += '<tr>'+
								'<td colspan="5">总金额：'+count.toFixed(2)+'</td>'+
							 '<tr>';
                div += '</table></div>';
                $('body').append(div)

						$('#item_list').draggable();
            }
        })
		} else {

		}
	}

    function record() {
        var content = $('.ant-modal-content');
        if (content.length > 0) {
				$.each(content,function(k,v){
					var title = $(v).find('.ant-modal-title').text();
					if (title == '发票详情新页面打开') {
						var link = $('#link');
						if (link.length == 0) {
							console.log(num)
							if (!num) {
								var btn = '<button id="unlink" type="button"  style="position: absolute;top: 6px;left: 100px;" class="ant-btn ant-btn-primary btn-mr"><span>异常同步</span></button>';
								$(v).append(btn);
							} else {
								var btn = '<button id="link" type="button"  style="position: absolute;top: 6px;left: 100px;" class="ant-btn ant-btn-primary btn-mr"><span>同步</span></button>';
								$(v).append(btn)
							}
						}
					}
				})
        }
	}

})();