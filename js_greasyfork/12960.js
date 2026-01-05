// ==UserScript==
// @name         ThunderLixianBatchMagnet
// @namespace    http://upchan.tk/
// @version      0.7
// @description  Automaticlly add multi magnet tasks to Xunlei(Thunder) Lixian.
// @author       Up
// @exclude      http://res.stat.xunlei.com/pv.js
// @match        http://dynamic.cloud.vip.xunlei.com/user_task*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/12960/ThunderLixianBatchMagnet.user.js
// @updateURL https://update.greasyfork.org/scripts/12960/ThunderLixianBatchMagnet.meta.js
// ==/UserScript==



// 待处理的磁链数组
var magnetArrToProcess = null;
// 需处理的磁链数
var magnetCount = 0;

// 在新建面板点击全选
function selectAll() {
    select_all(1, '#rulelist input[name=bt_ck]', function () {
        bt_manual_select('add');
        bt_check_click('add');
    });
}

// 循环监视新建面板任务名称文本框是否为空，检测磁链是否解析完成
function monitorTaskName() {
    var taskNameField = $("#task_name");
    if (taskNameField.val() !== "") {
        console.log("taskName not empty!");
        selectAll();
        submitOne();
        monitorFinish();
    } else {
        setTimeout(monitorTaskName, 200);
    }
}

// 循环监视新建面板是否可见，检测任务是否提交完成
function monitorFinish(){
	var addTaskPanel = $("#add_task_panel");
	if(!addTaskPanel.is(":visible")){
		magnetArrToProcess.shift();
		processNext();
	}
	else{
		setTimeout(monitorFinish, 200);
	}
}

// 提交当前任务
function submitOne() {
    $($("#down_but").get(0)).click();
}

function showTipsAndAutoHide(content, timeout){
	show_tip(content);
	setTimeout(hide_tip, timeout);
}

// 处理下一个磁链(如果有)
function processNext(){
	if(magnetArrToProcess.length>0){
		$($(".sit_new").get(0)).click();
		$("#task_url").val(magnetArrToProcess[0]);
		monitorTaskName();
	} else{
		//如果待处理磁链列表长度为0，表示已处理完成
		//选中刚添加的任务
		setTimeout(function(){
			for(var i=0; i<magnetCount;i++){
			$($(".in_ztclick").get(i)).attr("checked","checked");
			}	
		},1000);
	}
}

// 校验输入
function verifyInput(magnets, reverse){
	if(magnets.trim().length === 0){
		return false;
	}
	var magnetArr = magnets.split("\n");
	if(magnetArr.length>0){
        if(reverse){
            magnetArr.reverse();
        }
		var i=0;
		while(i<magnetArr.length){
			var line = magnetArr[i].trim();
			if(line.length === 0){
				magnetArr.splice(i, 1);
				continue;
			}
			if(!line.startsWith("magnet:?xt=urn:btih:")){
				return false;
			}
			i++;
	        }
		magnetArrToProcess = magnetArr;
		magnetCount = magnetArrToProcess.length;
		return true;
	} else{
		return false;
	}
}

// 开始处理
function startAutoSubmit() {
	var flag = false;
	var magnets = $("#magnet_list").val();
    	var reverse = $("#cb_magnet_reverse").get(0).checked;
   
	if(verifyInput(magnets, reverse)){
		$("#magnet_input_pop").hide();
		processNext();
        window.localStorage.setItem("batch_magnet_reverse", reverse);
	} else{
		showTipsAndAutoHide("输入内容格式不正确",5000);
	}


}

// 显示磁链输入面板
function showMagnetInputPopup() {
    $("#magnet_input_pop").tpl("magnet_input_tpl", {
        'title' : "输入磁链",
        'content' : "<textarea id=\"magnet_list\" style=\"width: 100%; height: 260px;\"></textarea>      <button class=\"link_01\" id=\"btn_magnet_input_ok\">确定</button> <input type=\"checkbox\" id=\"cb_magnet_reverse\" />反向解析"
    }).show().pop({
        onHide : function () {
            $(document.body).click();
        },
    });
    if(JSON.parse(window.localStorage.getItem("batch_magnet_reverse"))){
        $("#cb_magnet_reverse").attr("checked", "checked");
    }
    $("#magnet_list").focus().select();
    $("#btn_magnet_input_ok").click(function(){
    	startAutoSubmit();
    });
}

function loadScript() {
    $("#main_nav > ul").append("<li class=\"main_link\"><a href=\"#\" id=\"batch_magnet_submit\" title=\"批量提交磁链\" class=\"btn_m\"><span><em class=\"icdwlocal\">批量提交磁链</em></span></a></li>");
    $("body").append("<div id=\"magnet_input_pop\" class=\"pop_rwbox\" style=\"margin: 0px; display: none;\"></div>");
    $("body").append("<textarea id=\"magnet_input_tpl\" style=\"display: none;\">\"<div class=\"p_rw_pop\"><div class=\"tt_box onlytitle\"><h3>$[title]</h3></div><div class=\"prw_list\">$[content]</div><a href=\"#\" class=\"close\" title=\"关闭\">关闭</a></div>\"</textarea>");

    $("#batch_magnet_submit").click(function () {
        showMagnetInputPopup();
    });
    
    // 验证码输入框支持回车提交
    $("input[name=verifycode]").live("keydown",	
		function(event){
			if(event.keyCode==13){
				$("#down_but").get(0).click();
			}
		}
	);
}

loadScript();
