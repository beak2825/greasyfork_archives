/**
 * 繳費充值(多号码充值)
 */
var multiRecharge = {};

var phoneFlag = 0;
var moneyFlag=0;
var i=1;
var selectId,selectDom;
multiRecharge.addPhone = function() {
	if (i>999999){
		$.toast("添加號碼已達到限制", "text");
		return;
	}
	html = '<div class="weui-panel no-hd no-margin" id="jiaofei_'+phoneFlag+'">';
	html += '<div class="weui-panel__hd">';
	html += '<input  style="width:20px;height:20px;margin: 5px 5px;" name="item" onclick="multiRecharge.getAmount(this)" id="check_'+phoneFlag+'" type="checkbox" checked>\n';
	html += '<label style="margin-top: 3px" for="check_'+phoneFlag+'"><h5>繳費號碼'+multiRecharge.NoToChinese(i)+'</h5></label>';
	html += '<h5></h5>';
	if (phoneFlag==0){

	}else {
		html += '<a class="text-red" style="margin-top: 3px" onclick="multiRecharge.deletePhone('+phoneFlag+')">刪除</a>';
	}
	html += '</div>';
	html += '<div class="weui-panel__bd">';
	html += '<div class="weui-flex">';
	html += '<div class="weui-flex__item">';
	html += '<div class="weui-cell inner-input">';
	html += '<div class="weui-cell__hd">';
	html += '<i class="iconfont iconshangtai text-blue"></i>';
	html += '</div>';
	html += '<div class="weui-cell__bd">';
	html += '<div class="pay-num" id="pay-num-'+phoneFlag+'">';
	html += '<input onchange="multiRecharge.checkPhone(this)" class="phoneNumChange weui-input" type="text" placeholder="繳費號碼" data-flag = "'+phoneFlag+'">';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '<div class="weui-flex__item">';
	html += '<div class="weui-cell inner-input">';
	html += '<div class="weui-cell__hd">';
	html+='<img src="../images/nwx/money-b.png" style="width: 18px;">';
	//html += '<i class="iconfont iconchongzhijiaofei text-red"></i>';
	html += '</div>';
	html += '<div class="weui-cell__bd pay_bd" id="money_'+moneyFlag+'">';
	if (userType=="20" || userType=="23"){
		html += '<input onchange="multiRecharge.getAmount(this)" id="paymony_'+phoneFlag+'" class="weui-input" type="text" placeholder="繳費金額">';
	}if (userType=="99"){
		html += '<a href="javascript:;" onchange="multiRecharge.getAmount(this)" onclick="multiRecharge.rechargeSelect(this)" id="paymony_'+phoneFlag+'" class="weui-btn-auto weui-btn-sm  weui-btn-round pay-btn open-popup" data-target="#popup-pay"  >繳費金額</a>';
	}
	// html += '<input onchange="multiRecharge.getAmount(this)" id="paymony_'+phoneFlag+'" class="weui-input" type="text" placeholder="繳費金額">';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	$("#phoneList").append(html);
	if(phoneFlag == 0 ){
		$("#pay-num-0 >input").val(curUserPhone);
		multiRecharge.checkPhone($("#pay-num-0 >input"));	
	}
	phoneFlag = phoneFlag + 1;
	moneyFlag= moneyFlag + 1;
	i=i+1;
}

multiRecharge.deletePhone = function(flag) {
	if (flag==0){
		$.toast("當前號碼為您綁定微信的號碼,不可刪除！", "text");
		return;
	}
	$("#jiaofei_"+flag).remove();
	multiRecharge.getAmount($("#paymony_"+flag));
	i--;
	phoneFlag=phoneFlag-1;
	moneyFlag= moneyFlag-1;
}

multiRecharge.getAmount = function(e) {

	var acount = 0;
	var chkItems = document.getElementsByName("item");
	for (var i = 0; i < chkItems.length; i++) {
		if (chkItems[i].checked) {
			var test = $("#pay-num-"+(i)).attr("userId");
			if( test != undefined){

				var payMoney = $("#paymony_"+(i)).val();
				if (payMoney==null || payMoney=="" || payMoney==undefined){
					payMoney=0;
				}
				acount += parseFloat(payMoney);
			}
		}
	}
	$("#acountAmount").html(acount.toFixed(2));
}

multiRecharge.rechargeSelect = function(e){
	selectId=e.id;
	selectDom=("#"+(selectId));
}

multiRecharge.checkPhone = function(e) {
	phoneNo = $(e).val();
	flag = $(e).data("flag")
	phoneNo=$.trim(phoneNo);

	var params={
			"phoneNo":phoneNo
		};
	if(!/^(([0-9]{8})|(1[0-9]{10}))$/.test(phoneNo)){//校驗電話號碼
		if(phoneNo==null||phoneNo==""){
			$.toast(msgData.phoneTip, "text");
			$("#pay-num-"+flag).addClass("error");
		}else{
			$.toast(msgData.phoneErro, "text");
			$("#pay-num-"+flag).addClass("error");
		}
		return;
	}else{//跳轉
		$.showLoading();
		$.ajax({
			type:"POST",
			url:contextPath+"/multiNumRecharge/goToRecharge",
			cache:false ,
			async:true ,
			dataType:"json",
			data:params,
			cache:false,//不使用缓存
			success:function(response){
				$.hideLoading();
				if (response.code == 0) {
					var html = "";
					var paymoneyhtml="";
					html += '<h4>'+response.data.phoneNo+'</h4><p>'+response.data.userName+'</p>';
					if (response.data.userType=="99"){
						if (flag>0){
							paymoneyhtml += '<a href="javascript:;" onchange="multiRecharge.getAmount(this)" onclick="multiRecharge.rechargeSelect(this)" id="paymony_'+flag+'" class="weui-btn-auto weui-btn-sm  weui-btn-round pay-btn open-popup" data-target="#popup-pay"  >繳費金額</a>';
						}
					}
					if (response.data.userType=="20" || response.data.userType=="23"){
						if (flag>0){
							paymoneyhtml += '<input onchange="multiRecharge.getAmount(this)" id="paymony_'+flag+'" class="weui-input" type="text" placeholder="繳費金額">';
						}
					}
					$("#pay-num-"+flag).html(html);
					$("#pay-num-"+flag).attr("userId",response.data.userId);
					$("#pay-num-"+flag).attr("userType", response.data.userType);
					$("#pay-num-"+flag).attr("phoneNo",response.data.phoneNo);
					$("#pay-num-"+flag).attr("userName", response.data.userName);
					if (paymoneyhtml!=""){
						$("#money_"+flag).html(paymoneyhtml);
					}
					$("#paymony_"+flag).val(response.data.mustPayMoney);
					$("#paymony_"+flag).attr("mustPayMoney",response.data.mustPayMoney);

					multiRecharge.getAmount($("#paymony_"+flag));
					//根據用戶不同sim卡類型彈出不同提示框
					alertBoxBySimCardAndDataPaln(response.data.alertType,response.data.phoneNo);
				}else {
					//layer.alert(response.data.message);//提示信息
					$.toast(response.data.message, "text");
				}
			},
			error:function(){
				$.hideLoading();
				$.toast(response.data.message, "text");
			}
		});
	}
}

multiRecharge.submit = function() {
	var rechargePhoneList = [];
	var chkItems = document.getElementsByName("item");
	for (var i = 0; i < chkItems.length; i++) {
		if (chkItems[i].checked) {
			var test = $("#pay-num-" + (i)).attr("userId");
			if (test != undefined) {
				var rechargePhone = {};
				rechargePhone.userId = $("#pay-num-" + (i)).attr("userId");
				rechargePhone.userType = $("#pay-num-" + (i)).attr("userType");
				rechargePhone.phoneNo = $("#pay-num-" + (i)).attr("phoneNo");
				if (!(rechargePhone.userType == 20 || rechargePhone.userType == 23)){
					$.toast("非法操作", "text");
					return;
				}
				if (rechargePhone.userType == "20" || rechargePhone.userType == "23") {
					// var mustPayMoney = $("#paymony_" + (i)).attr("mustPayMoney");
					var mustPayMoney = "0";
					var payMoney = $("#paymony_" + (i)).val();
					payMoney = $.trim(payMoney);

					// if (flag==0&&mustPayMoney==0&&payMoney!=0){
					// 	return;
					// }
					if (payMoney == null || payMoney == undefined || payMoney == "") {
						$.toast(msgData.payMoneyNull, "text");
						return;
					} else if (Number(mustPayMoney) > Number(payMoney)) {
						$.toast("輸入的金額應大於應繳金額MOP$&nbsp;&nbsp;" + mustPayMoney, "text");
						return;
					} else if (0 >Number(payMoney)&&flag!=0) {
						$.toast("單次繳費金額不能低於0.1元，請重新輸入", "text");
						return;
					}

				}
				rechargePhone.payMoney = $("#paymony_" + (i)).val();
				rechargePhoneList[i] = rechargePhone;
			}
		}
	}

	if(Number($("#acountAmount").html())<0){
		$.toast("單次繳費金額不能低於0.1元，請重新輸入", "text");
		return;
	}
	$.showLoading();
	if(rechargePhoneList.length < 1){
		$.hideLoading();
		$.toast("請填寫要充值的號碼", "text");
		return;
	}

	for (var i = 0; i < rechargePhoneList.length; i++) {
		if (rechargePhoneList[i] == null || rechargePhoneList[i] == "" || JSON.stringify(rechargePhoneList[i]) == "{}") {
			rechargePhoneList.splice(i, 1);
			// i = i - 1;
		}
		if(rechargePhoneList[i].payMoney == 0){
			rechargePhoneList.splice(i, 1);
			// i = i - 1;
		}
	}
	var params = {
			"rechargePhoneList":JSON.stringify(rechargePhoneList)
	};

	$.ajax({
		type:"POST",
		url:contextPath+"/multiNumRecharge/submitBill",
		async:true ,
		dataType:"json",
		data:params,
		cache:false,//不使用缓存
		success:function(response){
			$.hideLoading();
			if (response.code == 0) {
				var channelCode=response.data.channelCode;
				var channelOrderNo=response.data.channelOrderNo;
				var orderType=response.data.orderType;
				window.location.href=response.data.mallUrl+"/orderpay/payQuery?channelCode="+channelCode+"&channelOrderNo="+channelOrderNo+"&orderType="+orderType+'&timestamp='+commonTools.getTimestamp();
			}else {
				// $.toast(response.data.message, "text");
				var channelCode=response.data.channelCode;
				var channelOrderNo=response.data.channelOrderNo;
				var orderType=response.data.orderType;
				window.location.href=response.data.mallUrl+"/orderpay/payQuery?channelCode="+channelCode+"&channelOrderNo="+channelOrderNo+"&orderType="+orderType+'&timestamp='+commonTools.getTimestamp();
			}
		},
		error:function(){
			$.hideLoading();
			$.toast(msgData.payMoneysubmiterr01);
		}
	});

}

//阿拉伯数字转中文数字
multiRecharge.NoToChinese = function(num) {
	if (!/^\d*(\.\d*)?$/.test(num)) {
		alert("Number is wrong!");
		return "Number is wrong!";
	}
	var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
	var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
	var a = ("" + num).replace(/(^0*)/g, "").split("."),
		k = 0,
		re = "";
	for (var i = a[0].length - 1; i >= 0; i--) {
		switch (k) {
			case 0:
				re = BB[7] + re;
				break;
			case 4:
				if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
					re = BB[4] + re;
				break;
			case 8:
				re = BB[5] + re;
				BB[7] = BB[5];
				k = 0;
				break;
		}
		if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
		if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
		k++;
	}
	if (a.length > 1) //加上小数部分(如果有小数部分)
	{
		re += BB[6];
		for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
	}
	return re;
};

//自定義提示框
//自定義警告框
window.alert = alert;
function alert(data, callback) { //回调函数
	var alert_bg = document.createElement('div');
	alert_box = document.createElement('div'),
		alert_text = document.createElement('div'),
		alert_btn = document.createElement('div'),
		textNode = document.createTextNode(data ? data : ''),
		//btnText = document.createTextNode('确 定');
		btn = document.createElement('button'),
		btnText = document.createTextNode('關 閉');


	// 控制样式
	css(alert_bg, {
		'position': 'fixed',
		'top': '0',
		'left': '0',
		'right': '0',
		'bottom': '0',
		'background-color': 'rgba(0, 0, 0, 0.1)',
		'z-index': '999999999'
	});

	css(alert_box, {
		'width': '16rem',
		'max-width': '90%',
		'font-size': '1rem',
		'text-align': 'center',
		'background-color': '#fff',
		'position': 'absolute',
		'top': '50%',
		'left': '50%',
		'transform': 'translate(-50%, -50%)'
	});

	css(alert_text, {
		'padding': '2rem 15px',
		'font':'1rem / 2 "Microsoft YaHei", "微软雅黑", Arial, Lucida, Verdana, Helvetica, sans-serif',
		'text-align': 'justify',
		'white-space': 'pre-line',
		'font-weight':'550'

	});

	css(alert_btn, {
		'padding': '10px 0',
		'color': '#007aff',
		'font-weight': '600',
		'cursor': 'pointer'
	});

	css(btn, {
		'padding': '0.5rem 5rem',
		'border': 'none',
		'background-color': '#0054a6fa',
		'border-radius': '4px',
		'color': '#fff',
		'font-size': '0.8rem',

	});

	// 内部结构套入
	alert_text.appendChild(textNode);
	alert_btn.appendChild(btn);
	btn.append(btnText);
	alert_box.appendChild(alert_text);
	alert_box.appendChild(alert_btn);
	alert_bg.appendChild(alert_box);

	// 整体显示到页面内
	document.getElementsByTagName('body')[0].appendChild(alert_bg);

	// 确定绑定点击事件删除标签
	alert_btn.onclick = function() {
		alert_bg.parentNode.removeChild(alert_bg);
		if (typeof callback === 'function') {
			callback(); //回调
		}
	}
}

function css(targetObj, cssObj) {
	var str = targetObj.getAttribute("style") ? targetObj.getAttribute('style') : '';
	for (var i in cssObj) {
		str += i + ':' + cssObj[i] + ';';
	}
	targetObj.style.cssText = str;
}


function alertBoxBySimCardAndDataPaln(alertType,PhoneNum){
	//月費提示框
	if(alertType == 1){
		let alert_text = '重要提示:\r\n\xa0\xa0\xa0\xa0'+'由於閣下'+PhoneNum+'使用的SIM卡仍為舊的3G卡，為不影響閣下的網絡質量，請機主持有效證件到門市免費更換新的4G卡及升遷為4G月費。'
		alert(alert_text, function() {});
	}

	if(alertType == 2){
		let alert_text = '重要提示:\r\n\xa0\xa0\xa0\xa0'+'由於閣下'+PhoneNum+'使用SIM卡仍為舊的3G卡，為不影響閣下的網絡質量，請機主持有效證件到門市免費更換新的4G卡。'
		alert(alert_text, function() {});
	}

	if(alertType == 3){
		let alert_text = '重要提示:\r\n\xa0\xa0\xa0\xa0'+'我司已推出多款4G月費優惠計劃，請'+PhoneNum+'機主持有效證件到門市升遷為4G用戶。'
		alert(alert_text, function() {});
	}

}