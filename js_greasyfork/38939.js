// ==UserScript==
// @name         蜜蜂侠
// @namespace    http://tampermonkey.net/
// @version      0.7.3
// @description  蜜蜂抢单
// @author       Shinelin
// @match        http://*.mf178.cn/customer/order/pools*
// @match        http://mf178.cn/customer/order/pools*
// @match        http://mf178.cn/customer/order/mytasks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38939/%E8%9C%9C%E8%9C%82%E4%BE%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/38939/%E8%9C%9C%E8%9C%82%E4%BE%A0.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // 消息提示
    var stop = false;
    var cnt = 1;
    var intervalId = 0;


    var my_message = function (message) {
        $.notify({ message:message }, { delay:2000, allow_dismiss:false, type: 'success', placement: { from: "top", align: "center" }, offset: 400});
    };
    // 播放提示音
    $.getScript("https://cdn.bootcss.com/jplayer/2.9.2/jplayer/jquery.jplayer.min.js", function() {
        $("#jplayer").jPlayer({
            // swfPath: "http://www.jplayer.org/latest/js/Jplayer.swf",
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: "http://hao.1015600.com/upload/ring/000/994/63ac8513b87bb67e87042b856e2b6f01.mp3"
                });
            },
            supplied: "mp3"
        });
    });


    var sumbit_ticket_without_comfirm = function(orderId) {
           var url = 'ajax?action=task_report&op=succ&id=' + orderId;
           X.get(url);
    };

    // 附加的html
    var html = (function () {/*
		<div class='row' id='robDiv'>
			<div class='col-xs-3'>
				<select class="form-control" id='amount' name='amount'>
					<option  value="30">30元</option>
					<option  value="50">50元</option>
					<option  value="100">100元</option>
					<option  value="200">200元</option>
                    <option  value="300">300元</option>
                    <option  value="500">500元</option>
				</select>
			</div>
            <div class='col-xs-2'>
				<select class="form-control" id='carrier' name='carrier'>
                    <option  value="0">不限</option>
					<option  value="1">移动</option>
					<option  value="2">联通</option>
				</select>
			</div>
			<div class='col-xs-2'>
				<select id="prov_name" name="prov_name" class="form-control">
					<option value="">不限</option>
					<option value="北京">北京</option>
					<option value="广东">广东</option>
					<option value="上海">上海</option>
					<option value="天津">天津</option>
					<option value="重庆">重庆</option>
					<option value="辽宁">辽宁</option>
					<option value="江苏">江苏</option>
					<option value="湖北">湖北</option>
					<option value="四川">四川</option>
					<option value="陕西">陕西</option>
					<option value="河北">河北</option>
					<option value="山西">山西</option>
					<option value="河南">河南</option>
					<option value="吉林">吉林</option>
					<option value="黑龙江">黑龙江</option>
					<option value="内蒙古">内蒙古</option>
					<option value="山东">山东</option>
					<option value="安徽">安徽</option>
					<option value="浙江">浙江</option>
					<option value="福建">福建</option>
					<option value="湖南">湖南</option>
					<option value="广西">广西</option>
					<option value="江西">江西</option>
					<option value="贵州">贵州</option>
					<option value="云南">云南</option>
					<option value="西藏">西藏</option>
					<option value="海南">海南</option>
					<option value="甘肃">甘肃</option>
					<option value="宁夏">宁夏</option>
					<option value="青海">青海</option>
					<option value="新疆">新疆</option>
				</select>
			</div>
			<div class='col-xs-2'>
				<button class='btn btn-default btn-info'  id='getOrderBtn'>自动抢单</button>
			</div>
			<div class='col-xs-2'>
				<button class='btn btn-default btn-danger' disabled="true" id='stopGetOrderBtn'>停止抢单</button>
			</div>
            <div id="jplayer"></div>
		</div>
        <br />
       
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
    /*
     /// 测试
     <div class='row'>
             <div class='form-inline'>
				 <label>
                    <input type="checkbox" id="autosubmit"  value="1" checked="false">
                    （测试，非押金用户慎用）自动提交待充值：剩余时间设置
                    <input type="number" id="limit" value=3 class="form-control"/>
                    分钟。
                    <a id='diff_time'>-1</a>秒后将自动提交。
                 </label>
			</div>
         </div>
         <div class='row'>
             <div class='col-xs-5' id="phonenumDiv">
                 <label class='form-control'>
                     <b id="phone_num"><font color='red'>无</font></b>
                </label>
			</div>
         </div>
    */
    var setup_ui = function() {
        $('body > div.main_content > div > div > div > div > div.col-sm-10 > div.row.customer_container > div:nth-child(2)').append(html);

        // 复制黏贴号码工具，方便做单。
        var realtime_table = $('body > div.main_content > div > div > div.col-lg-10.col-sm-9 > div > div:nth-child(5) > table');
        if(realtime_table.find("tr").size() > 1) {
            var number = realtime_table.find("tr").eq(1).find('td').eq(2).children('button').val();
            $('#phone_num').children('font').text(number);
            $('#phonenumDiv').after("<div class='col-xs-2'> <button class='btn btn-info copy_btn' id='mycopybtn' value='"+ number + "'>复制</button></div>");
            $("#mycopybtn").click(function(){
                copyText($(this).val());
            });
            var orderId = realtime_table.find("tr").eq(1).find('td').eq(0).text();
            $('#mycopybtn').parent('div').after("<div class='col-xs-2'> <button id='succ_btn' class='btn btn-success' >我已充值</button></div>");
            $("#succ_btn").on('click', function(){
                   sumbit_ticket_without_comfirm(orderId);
            });
        }

    };



    var setup_storage = function() {
        // 本地存储面值，那么就使用本地存储的面值。
        if(localStorage.getItem('TICKET_PRICE') != null) {
            $('#amount').find("option:selected").attr("selected",false);
            $('#amount').find("option[value='"+ localStorage.getItem('TICKET_PRICE')+"']").attr("selected",true);
        }
        // 本地存储倒计时，就是用本地的倒计时
        if(localStorage.getItem("AUTOSUBMIT") != null) {
            $('#limit').val(parseInt(localStorage.getItem("AUTOSUBMIT")));
        }
    };

    setup_ui();
    setup_storage();




    var check_submit = function () {
        if ($('#autosubmit').attr("checked") == undefined) return ;
        var limit = $('#limit').val() * 60;
        localStorage.setItem("AUTOSUBMIT", $('#limit').val());
        var timestamp = parseInt((new Date()) / 1000) - INIT_TIME;
        $("body > div.main_content > div > div > div.col-lg-10.col-sm-9 > div > div:nth-child(5) > table tr .timeout").each(function () {
            var t = $(this);
            var diff = parseInt(t.attr("otime")) - timestamp;
            $("#diff_time").html((diff-limit) + '');
            if (diff > 0 && diff < limit) {
                   sumbit_ticket_without_comfirm(t.closest('tr').find(' td:nth-child(1)').html());
            }
        });
    };

    // 每1s检测一次订单提交。
    intervalId = setInterval(check_submit, 1000);


    // 修改订单倒计时提交时调用。
    $("#autosubmit").on('change', function() {
        if ($('#autosubmit').attr("checked") == "checked") {
            $('#autosubmit').attr("checked", false);
            if(intervalId != 0) {
                clearInterval(intervalId);
            }
        }
        else {
            $('#autosubmit').attr("checked", "checked");
            intervalId = setInterval(check_submit, 1000);
        }
    });

    var Refresh = function () {
        if(stop == true) {return;}
        // 查询订单……
        $.get('/customer/order/mytasks', function(msg) {
            var label = "获取" + $('#amount').val() + "元订单";
            if(msg.indexOf(label) < 0) {
                 //my_message('已查询' + cnt + '次，平台暂未订单，请稍后再试');
                 $("#getOrderBtn").text('已查询' + cnt + '次');
                 cnt ++;
                 setTimeout(Refresh, 100);
            }
            else {
                 getOrder();
            }
        });
        // 到这里没有被return, 说明有订单了，但是不一定有指定省份。
        // 更特殊的，有人可能在你查到和获取期间抢走这个单。
        var getOrder = function() {
            var url = 'ajax?action=get_tasks&amount=' + $('#amount').val();
            $.getJSON(url, function(msg) {
                //alert(msg.data);
                //<input type=\"hidden\" name=\"SEQ\" value=\"1519654006\" \/>
                var index = msg.data.indexOf("SEQ\" value=\"");  //
                //var len = 'SEQ\" value=\"'.length;  // 12
                //alert(index + " " + len);
                var idx = parseInt(index) + 12;
                var end = msg.data.indexOf("\"",idx);
                var SEQ = msg.data.substring(idx, end);
                var data = {
                    'prov_name': $('#prov_name').val(),
                    'operator_id': $('#carrier').val(),
                    'amount':$('#amount').val(),
                    'count':1,
                    'contract': [1, 2, 4, 8, 16, 32, 64, 128, 256, 512],
                    'SEQ':SEQ
                };
                $.post('/customer/order/get_tasks', data, function(msg) {
                    if(msg.indexOf('上报我已充值') > 0){
                        my_message('成功获取订单, 1s后自动刷新');
                        $("#jplayer").jPlayer('play');
                        setTimeout(function() {
                            window.location.href = "/customer/order/mytasks";
                        }, 1000);
                    }
                    else {
                        my_message('没有所查询的省份，或者别人比你抢先一步了');
                        setTimeout(Refresh, 2000);
                        $("#getOrderBtn").text('已查询' + cnt + '次');
                        cnt ++;
                    }
                });
            });
        };
    };

    // 获取订单
    $("#getOrderBtn").on('click', function() {
		//alert("自动抢单");
		//css
		$("#stopGetOrderBtn").attr('disabled',false);
		$("#getOrderBtn").attr('disabled', 'disabled');
		//$("#getOrderBtn").text("抢单中");
        stop = false;
        cnt = 1;
        localStorage.setItem('TICKET_PRICE', $('#amount').val());

		Refresh();
     });

    // 结束抢单
    $("#stopGetOrderBtn").on('click', function() {
		my_message('停止抢单');
		//css
		$("#stopGetOrderBtn").attr('disabled','disabled');
		$("#getOrderBtn").attr('disabled',false);
		$("#getOrderBtn").text("自动抢单");
        stop = true;
     });

    // Your code here...
})();