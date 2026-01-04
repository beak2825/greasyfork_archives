/**
 * 繳費充值
 */
CommonUtils.regNamespace("recharge", "index");
/**
 * 服务密码登录成功后跳转到缴费记录页面
 * @private
 */
var _afterLogin=function(){
	var loadIndex3=layer.load(1,{shade:[0.3,'#000']});
	window.location.href=contextPath+"/payRecharge/payrecordIndex?timestamp="+commonTools.getTimestamp();
};
recharge.index=(function(){
	var _checkPhone = function(){
		var loadIndex=layer.load(1,{shade:[0.3,'#000']});//加载层
		$("#erroMsg").html("");
		$("#phoneNo").removeClass("error");
		var phoneNo=$("#phoneNo").val();
		phoneNo=$.trim(phoneNo);
		var params={
				"phoneNo":phoneNo,
			};
		if(!/^(([0-9]{8})|(1[0-9]{10}))$/.test(phoneNo)){//校驗電話號碼
			if(phoneNo==null||phoneNo==""){
				$("#erroMsg").html(msgData.phoneTip);
				$("#phoneNo").addClass("error");
			}else{
				$("#erroMsg").html(msgData.phoneErro);
				$("#phoneNo").addClass("error");
			}
			return;
		}else{//跳轉
			$.ajax({
				type:"POST",
				url:contextPath+"/payRecharge/payPhoneCount?timestamp="+commonTools.getTimestamp(),
				cache:false ,
				async:true ,
				dataType:"json",
				data:params,
				cache:false,//不使用缓存
				success:function(response){
					if (response.code == 0) {
						var key=RSAUtils.getKeyPair(exponent,'', modulus);
						$("#phoneNoH").val(RSAUtils.encryptedString(key, phoneNo));
						layer.load(1,{shade:[0.3,'#000']});//加载层
						$("#phoneForm").submit();
					}else {
						// layer.close(loadIndex);
						// $("#erroMsg").html(response.data.message);//提示信息
						var key=RSAUtils.getKeyPair(exponent,'', modulus);
						$("#phoneNoH").val(RSAUtils.encryptedString(key, phoneNo));
						layer.load(1,{shade:[0.3,'#000']});//加载层
						$("#phoneForm").submit();
					}
				},
				error:function(){
					layer.close(loadIndex);
					$("#erroMsg").html(message);//订单提交出错
				}
			});
		}
	};
	
	var _checkRecharge=function(){
		$("#erroMsg").html("");
		$("#payMoney").removeClass("error");
		var userType=$("#userType").val();
		userType=$.trim(userType);
		var param={
				"userId":$("#dataForm input[name='userId']").val(),
				"userType":$("#dataForm input[name='userType']").val(),
				"phoneNo":$("#dataForm input[name='phoneNo']").val(),
				"mustPayMoney":"",
				"payMoney":"",
			};
		if(userType=="20" || userType=="23"){
			// var mustPayMoney=$("#mustPayMoney").val();
			var mustPayMoney="0";
			var payMoney=$("#payMoney").val();
			payMoney=$.trim(payMoney);
			if(payMoney==null||payMoney==undefined||payMoney==""){
				$("#erroMsg").html(msgData.payMoneyNull);
				$("#payMoney").addClass("error");
				return;
			}else if(!/^\d+(\.\d{2})?$/.test(payMoney)){//验证金额的格式
				$("#erroMsg").html(msgData.payMoneyErroFormat);
				$("#payMoney").addClass("error");
				return;
			}else if(!/^\d{1,4}(\.\d{2})?$/.test(payMoney)){
				$("#erroMsg").html(msgData.payMoneyLimit);
				$("#payMoney").addClass("error");
				return;
			}else if(Number(mustPayMoney)>Number(payMoney)){
				$("#erroMsg").html(msgData.payMoneyErro);
				$("#payMoney").addClass("error");
				return;
			}else if(0>Number(payMoney)){//exclude payMoneyMinLimit
				$("#erroMsg").html(msgData.payMoneyMinLimit);
				$("#payMoney").addClass("error");
				return;
			}
			$("#payMoneyData").val(payMoney);
			param.mustPayMoney=$("#dataForm input[name='mustPayMoney']").val();//增加必缴金额
		}else if(userType=="99"){//original 23
			var payMoney=$("#payMoney li[class='active']").attr("money-num");
			payMoney=$.trim(payMoney);
			if(payMoney==null||payMoney==undefined||payMoney==""){
				$("#erroMsg").html(msgData.payMoneyNoselect);
				return;
			}
			$("#payMoneyData").val(payMoney);
		}
		param.payMoney=$("#dataForm input[name='payMoney']").val();
		//提交缴费订单
		var loadIndex=layer.load(1,{shade:[0.3,'#000']});//加载层
		$.ajax({
			type:"POST",
			url:contextPath+"/payRecharge/submitBill?timestamp="+commonTools.getTimestamp(),
			dataType:"json",
			data:param,
			cache:false,//不使用缓存
			success:function(response){
				if (response.code == 0) {
					var channelCode=response.data.channelCode;
					var channelOrderNo=response.data.channelOrderNo;
					var orderType=response.data.orderType;
					window.location.href=response.data.mallUrl+"/orderpay/payQuery?channelCode="+channelCode+"&channelOrderNo="+channelOrderNo+"&orderType="+orderType+'&timestamp='+commonTools.getTimestamp();
				}else {
					// layer.close(loadIndex);
					// $("#erroMsg").html(response.data);//提示信息
					var channelCode=response.data.channelCode;
					var channelOrderNo=response.data.channelOrderNo;
					var orderType=response.data.orderType;
					window.location.href=response.data.mallUrl+"/orderpay/payQuery?channelCode="+channelCode+"&channelOrderNo="+channelOrderNo+"&orderType="+orderType+'&timestamp='+commonTools.getTimestamp();
				}
			},
			error:function(){
				layer.close(loadIndex);
				$("#erroMsg").html(msgData.payMoneysubmiterr01);//订单提交出错
			}
		});
		
	};
	var _goBill=function(){
		var loadIndex=layer.load(1,{shade:[0.3,'#000']});//加载层
		var param={"rechargePhone":$("#phoneNo").val()};
		$.ajax({
			type:"POST",
			url:contextPath+"/payRecharge/checkPhoneAggrement?timestamp="+commonTools.getTimestamp(),
			dataType:"json",
			data:param,
			cache:false,//不使用缓存
			success:function(response){
				if (response.code == 0) {
					var result=response.data;
					if("2"==result.code){
						layer.close(loadIndex);
						var layerIndex2=layer.open({
							title:loginPageData.msgTitle,
							content:msgData.phoneNotAgreement,
							btn:[msgData.btIkonw,msgData.btGoahead],
							yes:function(){
								layer.close(layerIndex2);
								return;
							},
							btn2:function(){
								var loadIndex3=layer.load(1,{shade:[0.3,'#000']});
								window.location.href=contextPath+"/bill/index?timestamp="+commonTools.getTimestamp();
							}
						});
					}else{
						window.location.href=contextPath+"/bill/index?timestamp="+commonTools.getTimestamp();
					}
				}else {
					layer.close(loadIndex);
					layer.alert(response.data,{
						title:loginPageData.msgTitle,
						btn:[commonPageInfos.definitely]
					});
				}
			},
			error:function(result){
				layer.close(loadIndex);
				if(result.status!='601'){
					layer.msg(msgData.sysErro);//系统繁忙，请稍后再试
				}
			}
		});
	};
	var _goRechargeRecord=function(){
		var loadIndex=layer.load(1,{shade:[0.3,'#000']});//加载层
		var param={"rechargePhone":$("#phoneNo").val()};
		$.ajax({
			type:"POST",
			url:contextPath+"/payRecharge/checkPhoneAggrement?timestamp="+commonTools.getTimestamp(),
			dataType:"json",
			data:param,
			cache:false,//不使用缓存
			success:function(response){
				if (response.code == 0) {
					var result=response.data;
					if("2"==result.code){
						layer.close(loadIndex);
						var layerIndex2=layer.open({
							title:loginPageData.msgTitle,
							content:msgData.phoneNotAgreement,
							btn:[msgData.btIkonw,msgData.btGoahead],
							yes:function(){
								layer.close(layerIndex2);
								return;
							},
							btn2:function(){
								var loadIndex3=layer.load(1,{shade:[0.3,'#000']});
								window.location.href=contextPath+"/payRecharge/payrecordIndex?timestamp="+commonTools.getTimestamp();
							}
						});
					}else{
						window.location.href=contextPath+"/payRecharge/payrecordIndex?timestamp="+commonTools.getTimestamp();
					}
				}else {
					layer.close(loadIndex);
					layer.alert(response.data,{
						title:loginPageData.msgTitle,
						btn:[commonPageInfos.definitely]
					});
				}
			},
			error:function(result){
				layer.close(loadIndex);
				if(result.status!='601'){
					layer.msg(msgData.sysErro);//系统繁忙，请稍后再试
				}
			}
		});
	};
	return {
		checkPhone : _checkPhone,
		checkRecharge:_checkRecharge,
		goBill:_goBill,
		goRechargeRecord:_goRechargeRecord
	};
})();

$(function(){
	//登录成功后回调函数
	loginTools.afterLogin=_afterLogin;
});