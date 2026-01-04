// ==UserScript==
// @name         openapi
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  openapi 收取权限
// @author       longslee
// @include      https://usercenter.zjcw.cn/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://libs.baidu.com/jqueryui/1.10.4/jquery-ui.min.js
// @grant  GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/458174/openapi.user.js
// @updateURL https://update.greasyfork.org/scripts/458174/openapi.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var open_api_list = ['/openapi/authentication/new/twoElementAuth',
'/openapi/authentication/new/ocr/driverLicense',
'/openapi/authentication/new/ocr/idCard',
'/openapi/user/miniapplogin',
'/openapi/user/refresh/wechat/accessToken',
'/openapi/user/register',
'/openapi/realname/update/info/userid',
'/openapi/authentication/get/user/authUserTripleNetCert',
'/openapi/user/register/phone',
'/openapi/mybank/create/internal/company',
'/openapi/realname/silence/auth',
'/openapi/external/userlogin/phone/verificationcode/login',
'/openapi/external/userlogin/send/verificationcode',
'/openapi/company/vehicleAuth/auth/vehicleInfo',
'/openapi/user/vehicleAuth/authSelfUserVehicle',
'/openapi/authentication/atuh/phonecert/info',
'/openapi/temp/import/userauth',
'/openapi/partner/become/rootPartner',
'/openapi/partnerOrder/pushOrder',
'/openapi/partner/become/partner',
'/openapi/partner/create/recruitmentCode',
'/openapi/user/registerOrLogin',
'/openapi/temp/import/regCode',
'/openapi/temp/import/userRegSource',
'/openapi/companyauth/update/authinfo',
'/openapi/company/vehicleAuth/saveVehicleData',
'/openapi/company/vehicleAuth/sendVehicleOwnerSms',
'/openapi/company/vehicleAuth/saveVehicleLicenseInfo',
'/openapi/company/vehicleAuth/upload/vehicleData',
'/openapi/company/vehicleAuth/upload/vehicleLicense',
'/openapi/company/vehicleAuth/batchAddVehicle',
'/openapi/temp/create/realperson',
'/openapi/temp/import/driverAuth',
'/user/get',
'/user/get2',
'/openapi/realname/save/info/userid',
'/openapi/user/logout',
'/openapi/company/delete/id',
'/openapi/company/update/info',
'/openapi/company/create',
'/openapi/companyuser/useraddcompany',
'/openapi/companyuser/userquitcompany',
'/openapi/companyauth/create/authticket',
'/openapi/companyocr/businesslicense',
'/openapi/companyocr/entityidcard',
'/openapi/companyauth/create/authrequest',
'/openapi/companyauth/get/requestid',
'/openapi/temp/send/code',
'/openapi/temp/login',
'/openapi/temp/register',
'/openapi/invoice/delete/id',
'/openapi/invoice/update/default',
'/openapi/invoice/update/info',
'/openapi/invoice/add',
'/openapi/address/delete/id',
'/openapi/address/update/defaultadress',
'/openapi/address/update/info',
'/openapi/address/add',
'/openapi/companyuser/list/companyuser',
'/openapi/companyuser/list/log',
'/openapi/company/list/info',
'/openapi/companyauth/get/companyid',
'/openapi/user/get/invitecode',
'/openapi/recruit/get/code',
'/openapi/recruit/get/paternity',
'/openapi/company/vehicleAuth/queryVehicleGrantParams',
'/openapi/company/vehicleAuth/list/vehicleInfo',
'/openapi/partner/get/subPartnerByPage',
'/openapi/partner/get/userByCode',
'/openapi/company/vehicleAuth/queryVehicleSyncList',
'/openapi/companyauth/recheck',
'/openapi/partner/get/partnerInfo',
'/openapi/partner/get/becomePartnerResult',
'/openapi/user/vehicleAuth/getVehicleStatusByUser',
'/openapi/companyauth/check/companyname',
'/openapi/partner/verify/user',
'/openapi/partner/get/promotionCode',
'/openapi/partner/get/product/rules/info',
'/openapi/partner/get/subPartnerHistoryByPage',
'/openapi/partner/get/subPartnerCount',
'/openapi/partner/get/superiorPartner',
'/openapi/partnerOrder/details',
'/openapi/partner/get/partnerPromotionInfo',
'/openapi/realname/certificate/name'];

	$("<iframe id='itoyokado' width='0' height='0' style='display:none;'>").prependTo('body');

	$('#itoyokado').on("click",_innerLogic);

	function _sleep(n) { //n表示的毫秒数
        var start = new Date().getTime();
        while (true) if (new Date().getTime() - start > n) break;

    }

	function _innerLogic(){
		_sleep(1500);	// 等渲染完
		// var _detail = document.getElementsByClassName('appDetail');

		//if(opop === 'before'){  // 收权限
			// 筛选需要去掉的动作
			var service_list = document.getElementsByClassName('ivu-table-row');
			$(service_list).each(function(i,e){
				var ck = $(e).find("input[type='checkbox']");
				var _uri = '';
				if($(e).find("span").length > 0){
					var _uri_span = $(e).find("span")[3];
					if(typeof(_uri_span) != "undefined"){
						_uri = $(e).find("span")[3].innerText; // URL
					}
				}

				if(ck.length >0 && ck[0].checked==false){  // 如果是未勾选状态，就勾选
					if($.inArray(_uri,open_api_list) > -1){
						ck[0].click();
					}
				}
			});

			// 批量取消操作
			var cards = document.getElementsByClassName('ivu-card-body');
			var btns = $(cards).find("button[class='ivu-btn ivu-btn-primary']");
			btns.each(function(idx,_btn){
				var _spans = $(_btn).find("span");
				_spans.each(function(i,_spn){
					if(_spn.innerText === '批量关闭'){
						_spn.click();
						console.log('批量关闭确认');
						return false;
					}
				});
			});

			//先保证下能弹出来吧
			_sleep(500);


			var _confirm_div = document.getElementsByClassName('ivu-modal-confirm-footer');
			var _confirm_spans = $(_confirm_div).find("span");
			_confirm_spans.each(function(i,e){
				if(e.innerText === '确定'){
					e.click();
					console.log('批量关闭触发');
				}
			});

			//保存完再睡一下
			_sleep(1500);
		/**
		}else if(opop === 'after'){  // 放权限

			var _head_div = document.getElementsByClassName('ivu-table-header');
			$(_head_div).each(function(idx,h){
				var _h_btns = $(h).find("input[class='ivu-checkbox-input']");
				if(_h_btns.length>0){
					_h_btns[0].click();
				}
			});

			// 批量开通操作
			var cards = document.getElementsByClassName('ivu-card-body');
			var btns = $(cards).find("button[class='ivu-btn ivu-btn-primary']");
			btns.each(function(idx,_btn){
				var _spans = $(_btn).find("span");
				_spans.each(function(i,_spn){
					if(_spn.innerText === '批量开通'){
						_spn.click();
						console.log('批量开通确认');
						return false;
					}
				});
			});

			//先保证下能弹出来吧
			_sleep(500);

			var _confirm_div = document.getElementsByClassName('ivu-modal-confirm-footer');
			var _confirm_spans = $(_confirm_div).find("span");
			_confirm_spans.each(function(i,e){
				if(e.innerText === '确定'){
					e.click();
					console.log('批量关闭触发');
				}
			});

			//保存完再睡一下
			_sleep(1500);
		}else{  // 什么也不做
			return;
		}
		**/

	}

	function _selectAndSave(){

		// 外层界面 list
		var _allBtns = document.getElementsByClassName('ivu-btn ivu-btn-primary ivu-btn-small');
		var eee;
		$(_allBtns).each(function(i,e){
			var _btnSpan = $(e).find('span');
			_btnSpan.each(function(idx,ele){
				if(ele.innerText === '查看'){
					eee = ele;
					//ele.click();
					//console.log('点击查看');

					//_innerLogic();  //内部逻辑
					//window.history.go(-1);
					return false;
				}
			});
			if(typeof(eee) != "undefined") return false;
		});
		eee.click();
		console.log('点击查看');
		_innerLogic();  //内部逻辑
		window.history.go(-1);
	}

	//document.getElementById('itoyokado').click('before')
	//document.getElementById('itoyokado').click('after')
	//$('#itoyokado').trigger("click",["aaa"])
    //document.getElementById('itoyokado').click()

})();