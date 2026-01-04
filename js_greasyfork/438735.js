// ==UserScript==
// @name         CICD tools
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  cicd checker
// @author       longslee
// @include      http://cicd.sinoiov.com*
// @include      http://cicd.zjcw.cn*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://libs.baidu.com/jqueryui/1.10.4/jquery-ui.min.js
// @grant  GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/438735/CICD%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/438735/CICD%20tools.meta.js
// ==/UserScript==

(function() {
    'use strict';
	// if(!localStorage.getItem('cicd-usercenter-list')){
	// 	localStorage.setItem('cicd-usercenter-list','usercenter-pay-gateway-service.war');  // 默认
	// }
	localStorage.setItem('cicd-usercenter-list','usercenter-mobileapi.war,usercenter-openapi.war,usercenter-pcapi.war,usercenter-platform.war,usercenter-business-service.war,usercenter-realname-service.war,usercenter-company-service.war,usercenter-partner-service.war,usercenter-query-service.war,usercenter-user-service.war,usercenter-base-service.war,usercenter-token-service.war,usercenter-pay-gateway-service.war,usercenter-gateway-service.war,usercenter-netcard-service.war,usercenter-mq-service.war,usercenter-business-mqconsumer.war,usercenter-data-service.war,usercenter-timer-service.war,usercenter-mongo-service.war,usercenter-notify-service.war,usercenter-freight-counsumer.war,usercenter-validate-code.war,usercenter-mock-service.war');
	
	var zNode = document.createElement('div');
	var doc_title='CICD 辅助';
	zNode.innerHTML = '<div id="digTitle">[' + doc_title + '] 可拖拽这里</div><div><input name="myCheckBox" type="checkbox" value="/PRO_GH">光环<input name="myCheckBox" type="checkbox" value="/PRO_ALYDATA">阿里云<input name="myCheckBox" type="checkbox" value="/test">test<input name="myCheckBox" type="checkbox" value="/dev">dev</div><div class="myBetween"><button id="myButton" type="button">全选/反选</button><button id="mySelectButton" type="button" style="width:80px;">确定</button></div>';
	zNode.setAttribute('id', 'myContainer');
	document.body.appendChild(zNode);
	
	$('#myButton').data('all-checked','0');
	
	document.getElementById("mySelectButton").addEventListener(
		"click", selectButtonAction, false
	);
	
	document.getElementById("myButton").addEventListener(
		"click", selectAllButtonAction, false
	);
	
	
	
	var service_list_str = localStorage.getItem('cicd-usercenter-list');
	var service_list = service_list_str.split(',');
	var $serviceList = $('<div id="my_service_list"></div>');
	$(service_list).each(function(i,e){
		$('<input name="my_service_input" type="checkbox" value='+ e +'>'+e+'</input><br>').appendTo($serviceList);
	});
	
	$serviceList.appendTo($(zNode));
	// var $temp = $('<div><input type="text"></div>');
	// $temp.appendTo($(zNode));
	
	var $desc = $('<div>从构建点提测的时候再使用</div>');
	$desc.appendTo($(zNode));
	
	function selectAllButtonAction(e) {
		var now_data = $('#myButton').data('all-checked');
		var service_list = document.getElementsByName("my_service_input");
		if(now_data == '0'){
			$(service_list).each(function(i,e){
				if(e.checked==false){
					e.click();
				}
			});
			$('#myButton').data('all-checked','1');
		} else{
			$(service_list).each(function(i,e){
				if(e.checked==true){
					e.click();
				}
			});
			$('#myButton').data('all-checked','0');
		}
		
		
	}
	
	function selectButtonAction(e) {
		
		var env_list = document.getElementsByName("myCheckBox");
		var env_checked_array = new Array();
		$(env_list).each(function(i,e){
			if(e.checked==true){
				env_checked_array.push(e.value);
			}
		});
		
		var service_checked_str = "";
		var service_list = document.getElementsByName("my_service_input");
		$(service_list).each(function(i,e){
			if(e.checked==true){
				service_checked_str+=e.value+',';
			}
		});
		
		var abc = $("span[class='expanded el-tree-node__expand-icon el-icon-caret-right']")[0];
		var p_abc = abc.parentElement.parentElement;
		var group_abc=p_abc.lastElementChild;
		var list = $(group_abc).find("div[role='treeitem']");
		$(list.find("span[class='el-tree-node__label']")).each(function(i,e){
			
			$(env_checked_array).each(function(idx,ele){
				if(e.innerHTML.indexOf(".war") >= 0 && e.innerHTML.indexOf(ele) >= 0){
				  var e_service_name = $.trim(e.innerHTML.split("||")[0]);	
				  if(service_checked_str.indexOf(e_service_name)>=0){
					var _input = $(e.parentElement).find('input')[0];
					if(_input.checked == false){
						 _input.parentElement.click();  
					}
				  }
				}
			});
		    
		  //   if(e.innerHTML.indexOf(".war") >= 0 && e.innerHTML.indexOf("/test") >= 0){
			 //  var e_service_name = $.trim(e.innerHTML.split("||")[0]);	
			 //  if(service_checked_str.indexOf(e_service_name)>=0){
				// var _input = $(e.parentElement).find('input')[0];
				//   _input.parentElement.click();  
			 //  }
		      //console.log(e.innerHTML);
		      //var _input = $(e.parentElement).find('input')[0];
		      //_input.parentElement.click();
		      //_input.checked=true;
		      //$(_input.parentElement).addClass("is-checked");
		      //$(_input.parentElement.parentElement).addClass("is-checked");
		      //is-checked
		    //}
		});
	}
	
	function multilineStr(dummyFunc) {
		var str = dummyFunc.toString();
		str = str.replace(/^[^\/]+\/\*!?/, '') // Strip function() { /*!
			.replace(/\s*\*\/\s*\}\s*$/, '') // Strip */ }
			.replace(/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
		;
		return str;
	}
	
	//--- Style our newly added elements using CSS.
	GM_addStyle(multilineStr(function() {
		/*!
		    #myContainer {
		     position:    absolute;
		     top:     0;
		     left:     0;
		     font-size:    20px;
		     background:    #3c9b0f;
		     border:     3px outset black;
		     margin:     5px;
		     opacity:    0.9;
		     z-index:    200000;
		     padding:    5px 20px;
		     float:	left;
		    }
		    #myButton {
		     cursor:     pointer;
		     margin:	5px;
		    }
		    #myContainer p {
		     color:     red;
		     background:    white;
		    }
	 
		    #myZoomIn {
		    	margin:	5px;
		    }
	 
		    #myInput {
		    	border:	none;
		    	width: 400px;
		    	margin:	5px;
		    }
	 
		    .myBetween {
		    	display: flex;
				justify-content: space-between;
		    }
	 
		    .myBetween button {
		    	cursor:     pointer;
		     	margin:	5px;
		    }
	 
		    .class_lu {
		        background-color: rgba(130, 180, 230, 0.5);
		        box-sizing: border-box;
		        outline: solid 1px #0F4D9A;
		        cursor: default;
		    }
	 
		    @keyframes fade {
			    from {
			        opacity: 1.0;
			    }
			    50% {
			        opacity: 0.4;
			    }
			    to {
			        opacity: 1.0;
			    }
			}
	 
			@-webkit-keyframes fade {
			    from {
			        opacity: 1.0;
			    }
			    50% {
			        opacity: 0.4;
			    }
			    to {
			        opacity: 1.0;
			    }
			}
			.headerBox {
			    color: #fff;
			    padding: 10px;
			    font-size: 15px;
			    height: 60px;
			    animation: fade 600ms infinite;
			    -webkit-animation: fade 600ms infinite;
			}
	 
			.alert {
			    display: none;
			    position: fixed;
			    top: 50%;
			    left: 50%;
			    min-width: 200px;
			    margin-left: -100px;
			    z-index: 99999;
			    padding: 15px;
			    border: 1px solid transparent;
			    border-radius: 4px;
			}
	 
			.alert-success {
			    color: #3c763d;
			    background-color: #dff0d8;
			    border-color: #d6e9c6;
			}
	 
			.alert-info {
			    color: #31708f;
			    background-color: #d9edf7;
			    border-color: #bce8f1;
			}
	 
			.alert-warning {
			    color: #8a6d3b;
			    background-color: #fcf8e3;
			    border-color: #faebcc;
			}
		*/
	}));
	
	var Dragging = function(validateHandler) { //参数为验证点击区域是否为可移动区域，如果是返回欲移动元素，负责返回null
		var draggingObj = null; //dragging Dialog
		var diffX = 0;
		var diffY = 0;
	 
		function mouseHandler(e) {
			switch(e.type) {
				case 'mousedown':
					draggingObj = validateHandler(e); //验证是否为可点击移动区域
					if(draggingObj != null) {
						diffX = e.clientX - draggingObj.offsetLeft;
						diffY = e.clientY - draggingObj.offsetTop;
					}
					break;
	 
				case 'mousemove':
					if(draggingObj) {
						draggingObj.style.left = (e.clientX - diffX) + 'px';
						draggingObj.style.top = (e.clientY - diffY) + 'px';
					}
					break;
	 
				case 'mouseup':
					draggingObj = null;
					diffX = 0;
					diffY = 0;
					break;
			}
		};
	 
		return {
			enable: function() {
				document.addEventListener('mousedown', mouseHandler);
				document.addEventListener('mousemove', mouseHandler);
				document.addEventListener('mouseup', mouseHandler);
			},
			disable: function() {
				document.removeEventListener('mousedown', mouseHandler);
				document.removeEventListener('mousemove', mouseHandler);
				document.removeEventListener('mouseup', mouseHandler);
			}
		}
	}
	
	function getDraggingDialog(e) {
		var target = e.target;
		//		while(target && target.className.indexOf('dialog-title') == -1) {
		// while(target && target.id != 'digTitle') {
		// 	target = target.offsetParent;
		// }
		if(target != null) {
			return target.offsetParent;
		} else {
			return null;
		}
	 
	}
	 
	Dragging(getDraggingDialog).enable();
	
	
	
	
    $("<div id='cicd-aha' width='0' height='0' style='display:none;'>").prependTo('body');
    $('#cicd-aha').on("click",function(){

        //var _branch = $(".el-form-item--small").find("label"); // 分支选项
        // el-select-dropdown__item // 下拉选项

        var abc = $("span[class='expanded el-tree-node__expand-icon el-icon-caret-right']")[0];
        var p_abc = abc.parentElement.parentElement;
        var group_abc=p_abc.lastElementChild;
        var list = $(group_abc).find("div[role='treeitem']");
        $(list.find("span[class='el-tree-node__label']")).each(function(i,e){
            //PRO_ALYDATA
            if(e.innerHTML.indexOf(".war") >= 0 && e.innerHTML.indexOf("/test") >= 0){
              //console.log(e.innerHTML);
              var _input = $(e.parentElement).find('input')[0];
                _input.parentElement.click();
              //_input.checked=true;
              //$(_input.parentElement).addClass("is-checked");
              //$(_input.parentElement.parentElement).addClass("is-checked");
              //is-checked
            }
        });
        // $(list).find("span[class='el-tree-node__label']")[0].innerHTML
        //debugger;
    });
    // //document.getElementById('cicd-aha').click()
	//localStorage.setItem('cicd-usercenter-list','usercenter-mobileapi.war,usercenter-openapi.war,usercenter-pcapi.war,usercenter-platform.war,usercenter-business-service.war,usercenter-realname-service.war,usercenter-company-service.war,usercenter-partner-service.war,usercenter-query-service.war,usercenter-user-service.war,usercenter-base-service.war,usercenter-token-service.war,usercenter-pay-gateway-service.war,usercenter-gateway-service.war,usercenter-netcard-service.war,usercenter-mq-service.war,usercenter-business-mqconsumer.war,usercenter-data-service.war,usercenter-timer-service.war,usercenter-mongo-service.war,usercenter-notify-service.war,usercenter-freight-counsumer.war,usercenter-validate-code.war,usercenter-mock-service.war');
    // Your code here...
})();