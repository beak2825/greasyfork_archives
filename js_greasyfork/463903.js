// ==UserScript==
// @name         MIS辅助JS
// @namespace    http://10.1.13.90/
// @version      1.32
// @description  MIS辅助程序
// @author       dengdong
// @match        http://10.1.13.90/*
// @match        http://10.1.10.89/*
// @icon         none
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @note         2023-04-28 V1.0 增加数据缓存功能,可缓存字段和附件信息。点提交、签名、打印受理表按钮会自动缓存当前面数据信息。
// @note         2023-04-28 V1.0 通过点击“读取缓存”按钮可重新载入。已提交成功的，不再缓存附件信息。
// @note         2023-04-16 V0.6 实现过户\变更缴费信息户名、手机号、证件类型、证件号码等信息输入时联动
// @note         图片预览插件下载地址https://greasyfork.org/zh-CN/scripts/24204-picviewer-ce,必须安装才能正常预览
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463903/MIS%E8%BE%85%E5%8A%A9JS.user.js
// @updateURL https://update.greasyfork.org/scripts/463903/MIS%E8%BE%85%E5%8A%A9JS.meta.js
// ==/UserScript==

//var a = ['小明','小明是谁','小明是猪']
//GM_setValue('zw_test', a);

if (location.href.match("http://.*/workflow/view/workflow/flowform/process_initiated.jsp.*") !=
	null) {
	setTimeout(function() {
		var flowcode = getflowcode()
		var formname = getformname(flowcode)
		//console.log(flowcode)
		if (isEmpty(formname) != true) {

			$("#copygive").attr({
				onclick: "window.getGMdata()"
			})
			$("#submit").attr({
				onclick: "window.setGMdata($(this))"
			})

			$("#copygive").html("读取缓存")
			$("#copygive").removeAttr("style")
			GM_setValue("ywqz", $(
				"body > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(5) > a:nth-child(1)"
			).attr("onclick")) //业务签名
			GM_setValue("ywslb", $(
				"body > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(6) > a:nth-child(1)"
			).attr("onclick")) //打印业务受理表


			$("body > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(6) > a:nth-child(1)")
				.attr({
					onclick: "window.setGMdata($(this))"
				}) //打印业务受理表
			$("body > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(5) > a:nth-child(1)")
				.attr({
					onclick: "window.setGMdata($(this))"
				}) //业务签名

			$('[class="gd_info_table"]').append(
				'<p align="center">     点击提交、签字、用水业务受理按扭，系统会自动缓存当前页信息,并覆盖之前的缓存信息</p>')
		}

		//修改按钮事件


		if (flowcode == "IndividualTransferApplication") { //过户信息录入事件
			$('input[name="newphone"]').bind('input propertychange', function() {
				//新手机号码变更事件
				$('#stampaphone').val($('#newphone').val())
				//税票电话
				//$('#agentphone').val($('#newphone').val())
				//经办人手机
				$('#newtel').val($('#newphone').val())
				//联联电话
			});

			$('#newcardname').bind('input propertychange', function() {
				//新户名变更事件
				$('#newaccountname').val($('#newcardname').val())
				//代扣人
				//$('#applyuser').val($('#newcardname').val())
				//经办人
				$('#newlinkman').val($('#newcardname').val())
				//新联系人
				$('#stampauser').val($('#newcardname').val())
				//税票名称
			});

			$('#newcredno').bind('input propertychange', function() {
				//证件号码变更事件
				//$('#transactoridcard').val($('#newcredno').val())
				//经办人证件号码
				$('#discountcertificatescode').val($('#newcredno').val())
				//代扣人证件号码
			});

			$('#newbankaccount').bind('input propertychange', function() {
				//银行账号变更事件
				$('#stampaccount').val($('#newbankaccount').val())
			});
			//税票账号
			$('div[name="newcredtype"]').bind('comboxchange', function() {
				var stype = $('input[name="newcredtype"]').val()
				//console.log(stype)
				$('div[name="discountcertificatestype"]')[0].setValue(stype)
			});
			//证件类型下拉列表框变更事件
		}

		if (flowcode == "changeBankcard") { //变更缴费信息录入信息事件

			$('#accountname').bind('input propertychange', function() {
				//代扣人变更事件
				//$('#applyuser').val($('#accountname').val())
				//经办人
				$('#stampauser').val($('#accountname').val())
				//税票名称

			});
			$('#credno').bind('input propertychange', function() {
				//业主证件变更事件
				$('#discountcertificatescode').val($('#credno').val())
				//代扣人证件
				//$('#transactoridcard')[0].val($('#credno').val())
				//经办人证件号码

			});
			$('#bankaccount').bind('input propertychange', function() {
				//银行账号变更事件
				$('#stampaccount').val($('#bankaccount').val())
				//税票账号
			})
		}


	}, 2000)
}

//检查图片是否存在
if (location.href.match("http://.*/workflow/app/resource/plugins/upload/upload_gpy.jsp.*") !=
	null) {
	setTimeout(function() {
		var photoNum = $(".thumb").length
		if (GM_getValue("jctp") == 1) {
			if (photoNum <= 0) {
				$("#ifram_photo").contents().find("#fileinfo").html(GM_getValue("ifram_Photo"))
			}
			//console.log(photoNum)
			//console.log( GM_getValue("jctp"))
			GM_setValue("jctp", 0)
			document.querySelector("tbody tr[class='gd-info-btn-table-tr'] td:nth-child(2) a:nth-child(1)")
				.click()
			
			//alert("缓存加载完成,请手工返回提交页面")
			//console.log( GM_getValue("jctp"))
		}
	}, 3000)
}
//检查图片是否存在



//读缓存信息,油猴里的函数必须使用unsafeWindow,再windows.getGMdata调用
unsafeWindow.getGMdata = function() {
	var flowcode = getflowcode()
	//console.log(flowcode)
	if (isEmpty(flowcode) != true) {
		//console.log('aaaa')
		var GMdata = GM_getValue(flowcode)
		if (isEmpty(GMdata) != true) {
			//add("upload_gpy.jsp")
			//add('upload_file.jsp')
			GM_setValue("ifram_Photo", $("#ifram_photo").contents().find("#fileinfo").html())

			for (var i = 0; i < GMdata.length; i++) {
				//console.log(GMdata[i][1])
				if (GMdata[i][0] == "text" || GMdata[i][0] == "date" || GMdata[i][0] == "textbutton" || GMdata[i][
						0
					] ==
					"phone" || GMdata[i][0] == "textarea") {
					$('[name="' + GMdata[i][1] + '"]').val(GMdata[i][2])
				}
				if (GMdata[i][0] == "select") {
					$('[name="' + GMdata[i][1] + '"]')[0].setValue(GMdata[i][2])
				}
				if (GMdata[i][0] == "photo") {
					$("#ifram_photo").contents().find("#fileinfo").html(GMdata[i][2])

				}

			}
			//$("tbody tr[class='gd-info-btn-table-tr'] td:nth-child(2) a:nth-child(1)")
			GM_setValue("jctp", 1)
			document.getElementById("ifram_photo").contentWindow.add('upload_gpy.jsp')

		} else {
			alert("无缓存数据")
		}
	}
}
//读缓存信息,油猴里的函数必须使用unsafeWindow,再windows.getGMdata调用


//写缓存信息
unsafeWindow.setGMdata = function(varname) {
	var flowcode = getflowcode()
	if (isEmpty(flowcode) != true) {
		var formname = getformname(flowcode)
		var formdata = []
		for (var i = 0; i < formname.length; i++) {
			var formdata1 = []
			formdata1[0] = formname[i][0]
			formdata1[1] = formname[i][1]
			if (formname[i][0] == "photo") {
				formdata1[2] = $("#ifram_photo").contents().find("#fileinfo").html()
			} else {
				formdata1[2] = $('[name="' + formname[i][1] + '"]').val()
			}

			formdata.push(formdata1)
		}
		GM_setValue(flowcode, formdata)
		if (varname.html() == "提交") {
			submitForm()
		}
		if (varname.html() == "过户专用信息业务受理单" || varname.html() == "用水业务受理单") {
			//console.log(GM_getValue("ywslb"))
			eval(GM_getValue("ywslb")) //eval执行变量
		}
		if (varname.html() == "签字") {
			//console.log(GM_getValue("ywqz"))
			eval(GM_getValue("ywqz")) //eval执行变量
		}



		//submitForm()
	}
}

//写缓存信息


//判断变量值是否为空
function isEmpty(v) {
	switch (typeof v) {
		case 'undefined':
			return true;
		case 'string':
			if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
			break;
		case 'boolean':
			if (!v) return true;
			break;
		case 'number':
			if (0 === v || isNaN(v)) return true;
			break;
		case 'object':
			if (null === v || v.length === 0) return true;
			for (var i in v) {
				return false;
			}
			return true;
	}
	return false;
}
//判断变量值是否为空

//获取flowcode
function getflowcode() {
	var flowcode = document.getElementsByName("flowcode");
	if (flowcode.length >= 2) {
		return flowcode[1].value
	} else {
		return flowcode[0].value
	}

}
//获取flowcode


//获取表单字段信息
function getformname(name) {
	var formdate = {
		"IndividualTransferApplication": [ //过户
			["text", "newlinkman", "新联系人"],
			["select", "payMethod", "缴费方式"],
			["text", "nsrsbh", "纳税人识别号"],
			["text", "stampabank", "税票开户行"],
			["text", "stampaccount", "税票开户行及帐号"],
			["text", "stampaphone", "税票电话"],
			["text", "stampaaddress", "税票地址"],
			["select", "newusertype", "新用户类型"],
			["text", "newcardname", "新户名"],
			["text", "cardno", "户号"],
			["text", "address", "用水地址"],
			["select", "supplyarea", "区域"],
			["text", "newtel", "新联系电话"],
			["textarea", "remarkintro", "备注"],
			["textbutton", "newcredno", "新证件号码"],
			["text", "newphone", "新手机号码"],
			["photo", "photoFile", "附件上传"],
			["text", "newbankaccount", "代扣银行账号"],
			["select", "newcredtype", "新证件类型"],
			["select", "newbankcard", "代扣银行"],
			["text", "nextreaddate", "本期抄表日"],
			["text", "nextto", "本期行至"],
			["text", "meterno", "表身号"],
			["text", "wellno", "表位号"],
			["select", "discountcertificatestype", "代扣人证件类型"],
			["textbutton", "discountcertificatescode", "代扣人证件号码"],
			["select", "oldfee", "往期欠费"],
			["select", "billtype", "票据类型"],
			["text", "newaccountname", "代扣人名称"],
			["text", "stampauser", "税票名称"],
			["text", "applyuser", "经办人"],
			["text", "agentphone", "经办人手机"],
			["textbutton", "transactoridcard", "经办人身份证"]
		],
		"spuserstop": //暂停供水
			[
				["select", "supplyarea", "区域"],
				["text", "cardno", "户号"],
				["text", "cardname", "用户名"],
				["text", "address", "用水地址"],
				["text", "meterno", "表身号"],
				["select", "cardstatus", "用户状态"],
				["text", "recentdegree", "本期行至"],
				["text", "linkman", "申请人"],
				["phone", "phone", "手机号码"],
				["text", "tel", "联系电话"],
				["select", "credtype", "证件类型"],
				["text", "credno", "证件号码"],
				["select", "stopreason", "停水原因"],
				["textarea", "remarkintro", "备注"],
				["photo", "photoFile", "附件上传"]
			],
		"suspendWaterduplication": [ //暂停用水复装
			["select", "supplyarea", "区域"],
			["text", "cardno", "户号"],
			["text", "cardname", "用户名"],
			["text", "address", "用水地址"],
			["text", "nextto", "原表低度"],
			["select", "cardstatus", "用户状态"],
			["text", "meterno", "原表身号"],
			["text", "linkman", "联系人"],
			["text", "tel", "联系电话"],
			["phone", "phone", "手机号码"],
			["text", "stopsign", "停水标志"],
			["text", "credno", "证件号码"],
			["select", "credtype", "证件类型"],
			["textarea", "remarkintro", "备注"],
			["photo", "photoFile", "附件上传"]
		],
		"ApplyChangetables": [ //申请换表
			["select", "supplyarea", "区域"],
			["text", "cardno", "户号"],
			["text", "cardname", "用户名"],
			["select", "cardstatus", "用户状态"],
			["text", "meterno", "表身号"],
			["text", "nextto", "本期行至"],
			["text", "address", "用水地址"],
			["text", "linkman", "联系人"],
			["phone", "phone", "手机号码"],
			["text", "tel", "联系电话"],
			["select", "credtype", "证件类型"],
			["text", "credno", "证件号码"],
			["text", "zcfee", "装拆费"],
			["text", "laborcost", "水表费"],
			["photo", "photoFile", "附件上传"],
			["textarea", "remarkintro", "备注"],
			["text", "wellno", "表位号"]
		],
		"ArrearsReassembly": [ //欠费停水复装
			["select", "supplyarea", "区域"],
			["text", "cardno", "户号"],
			["text", "cardname", "用户名"],
			["text", "address", "用水地址"],
			["select", "cardstatus", "用户状态"],
			["text", "linkman", "联系人"],
			["phone", "phone", "手机号码"],
			["text", "tel", "联系电话"],
			["text", "credno", "证件号码"],
			["select", "credtype", "证件类型"],
			["photo", "photoFile", "附件上传"]
		],
		"CompanyUserCancellation": [ //销户单位
			["select", "supplyarea", "区域"],
			["text", "cardno", "户号"],
			["text", "cardname", "用户名"],
			["text", "address", "用水地址"],
			["select", "cardstatus", "用户状态"],
			["text", "oldcaliber", "水表口径"],
			["text", "meterno", "表身号"],
			["text", "nextto", "上期行至"],
			["text", "recentdegrees", "水表行至"],
			["text", "linkman", "申请人"],
			["text", "tel", "联系电话"],
			["phone", "phone", "手机号码"],
			["select", "credtype", "证件类型"],
			["text", "credno", "证件号码"],
			["select", "payMethod", "缴费方式"],
			["select", "newbankcard", "开户银行"],
			["text", "newaccountname", "开户人名称"],
			["text", "newbankaccount", "银行账号"],
			["textarea", "remarkintro", "备注"],
			["photo", "photoFile", "附件上传"]
		],
		"UserCancellation": [ //销户个人
			["select", "supplyarea", "区域"],
			["text", "cardno", "户号"],
			["text", "cardname", "用户名"],
			["text", "address", "用水地址"],
			["text", "oldcaliber", "水表口径"],
			["text", "meterno", "表身号"],
			["select", "cardstatus", "用户状态"],
			["text", "nextto", "上期行至"],
			["text", "recentdegrees", "水表行至"],
			["text", "linkman", "申请人"],
			["text", "tel", "联系电话"],
			["select", "waterstatus", "用水状态"],
			["phone", "phone", "手机号码"],
			["select", "credtype", "证件类型"],
			["text", "credno", "证件号码"],
			["text", "wellno", "表位号"],
			["select", "payMethod", "缴费方式"],
			["select", "newbankcard", "开户银行"],
			["text", "newaccountname", "开户人名称"],
			["text", "newbankaccount", "银行账号"],
			["textarea", "remarkintro", "备注"],
			["photo", "photoFile", "附件上传"]
		],
		"ChangeContact": [ //更改联系方式
			["text", "cardno", "户号"],
			["select", "supplyarea", "区域"],
			["text", "cardname", "用户名"],
			["text", "address", "用水地址"],
			["text", "linkman", "联系人"],
			["select", "credtype", "证件类型"],
			["text", "credno", "证件号码"],
			["text", "linkaddress", "通讯地址"],
			["phone", "phone", "手机号码"],
			["text", "phoneCode", "验证码"],
			["text", "tel", "联系电话"],
			["text", "email", "Email"],
			["photo", "photoFile", "附件上传"]
		],
		"changeInvoiceinformation": [ //变更开票信息
			["text", "cardno", "户号"],
			["select", "supplyarea", "区域"],
			["text", "cardname", "用户名"],
			["text", "address", "用水地址"],
			["text", "linkman", "申请人"],
			["phone", "phone", "手机号码"],
			["text", "tel", "联系电话"],
			["select", "credtype", "证件类型"],
			["text", "credno", "证件号码"],
			["select", "billtype", "票据类型"],
			["text", "stampauser", "税票名称"],
			["text", "nsrsbh", "纳税人识别号"],
			["text", "stampabank", "税票开户行"],
			["text", "stampaccount", "税票帐号"],
			["text", "stampaaddress", "税票地址"],
			["text", "stampaphone", "税票电话"],
			["photo", "photoFile", "附件上传"]
		],
		"onenewuserproj": [ //报装个人
			["select", "credtype", "证件类型"],
			["textbutton", "credno", "证件号码"],
			["select", "supplyarea", "区域"],
			["text", "accountname", "开户人名称"],
			["text", "bankaccount", "银行账号"],
			["select", "bankcard", "开户银行"],
			["text", "linkman", "联系人"],
			["select", "waterproperty", "用水性质"],
			["text", "applicationnum", "申请户数"],
			["text", "cardname", "业主名称"],
			["text", "address", "工程地址"],
			["text", "tel", "联系电话"],
			["text", "phone", "手机号码"],
			["select", "caliber", "口径(mm)"],
			["photo", "photoFile", "附件管理"],
			["select", "payMethod", "缴费方式"],
			["textarea", "remark", "备注"],
			["select", "watermeteruse", "水表用途"],
			["select", "billtype", "票据类型"],
			["text", "transactoridcard", "经办人身份证号"],
			["text", "email", "Email"],
			["text", "managerphone", "经办人手机"],
			["text", "transactor", "经办人"]
		],
		"yihuyibiaoshenqin": [ //报装单位
			["select", "supplyarea", "区域"],
			["text", "address", "工程地址"],
			["text", "linkman", "联系人"],
			["text", "tel", "联系电话"],
			["text", "phone", "手机号码"],
			["text", "email", "Email"],
			["select", "credtype", "证件类型"],
			["textbutton", "credno", "证件号码"],
			["select", "waterproperty", "用水性质"],
			["select", "caliber", "口径"],
			["text", "applicationnum", "申请户数"],
			["select", "paymethod", "缴费方式"],
			["select", "bankcard", "开户银行"],
			["text", "accountname", "开户人名称"],
			["text", "bankaccount", "银行账号"],
			["textarea", "remark", "备注"],
			["photo", "photoFile", "附件上传"],
			["text", "cardname", "业主名称"],
			["text", "managerphone", "经办人手机"],
			["text", "transactoridcards", "经办人身份证号"],
			["text", "transactor", "经办人"],
			["select", "watermeteruse", "水表用途"],
			["select", "billtype", "票据类型"]
		],
		"Individualwater": [ //临时用水个人
			["select", "bankcard", "开户银行"],
			["text", "bankaccount", "银行账号"],
			["textarea", "remark", "备注"],
			["photo", "photoFile", "附件上传"],
			["select", "supplyarea", "区域"],
			["text", "cardname", "业主名称"],
			["text", "address", "工程地址"],
			["text", "linkman", "联系人"],
			["phone", "phone", "手机号码"],
			["text", "tel", "联系电话"],
			["select", "credtype", "证件类型"],
			["textbutton", "credno", "证件号码"],
			["text", "applicationnum", "申请户数"],
			["select", "caliber", "口径"],
			["select", "waterproperty", "用水性质"],
			["select", "payMethod", "缴费方式"],
			["text", "accountname", "开户人名称"],
			["select", "watermeteruse", "水表用途"],
			["select", "billtype", "票据类型"],
			["text", "transactoridcards", "经办人身份证号"],
			["text", "managerphone", "经办人手机"],
			["text", "transactor", "经办人"]
		],
		"UnitTemporaryWater": [ //临时用水单位
			["select", "supplyarea", "区域"],
			["text", "cardname", "业主名称"],
			["text", "address", "工程地址"],
			["text", "linkman", "联系人"],
			["text", "tel", "联系电话"],
			["phone", "phone", "手机号码"],
			["text", "email", "Email"],
			["text", "applicationnum", "申请户数"],
			["select", "caliber", "口径"],
			["select", "waterproperty", "用水性质"],
			["select", "credtype", "证件类型"],
			["textbutton", "credno", "证件号码"],
			["select", "payMethod", "缴费方式"],
			["text", "accountname", "开户人名称"],
			["select", "bankcard", "开户银行"],
			["text", "bankaccount", "银行账号"],
			["textarea", "remark", "备注"],
			["photo", "photoFile", "附件上传"],
			["select", "watermeteruse", "水表用途"],
			["select", "billtype", "票据类型"]
		],
		"Changetables": [ //改表个人
			["text", "meterno", "旧表身号"],
			["select", "supplyarea", "区域"],
			["text", "cardno", "户号"],
			["text", "cardname", "用户名"],
			["text", "address", "用水地址"],
			["text", "linkman", "联系人"],
			["phone", "phone", "手机号码"],
			["text", "tel", "联系电话"],
			["select", "credtype", "证件类型"],
			["textbutton", "credno", "证件号码"],
			["select", "oldcaliber", "旧水表口径"],
			["textarea", "remark", "备注"],
			["photo", "photoFile", "附件上传"],
			["text", "transactor", "经办人"],
			["text", "transactoridcards", "经办人身份证号"],
			["text", "managerphone", "经办人手机"],
			["select", "payMethod", "缴费方式"],
			["text", "accountname", "开户人名称"],
			["text", "bankaccount", "银行账号"],
			["select", "bankcard", "开户银行"],
			["select", "flowcode", "流程名称"],
			["select", "waterproperty", "用水性质"],
			["select", "newcaliber", "新水表口径"],
			["select", "watermeteruse", "水表用途"],
			["select", "billtype", "票据类型"]
		],
		"ChangetablesCompany": [ //改表单位
			["textarea", "remark", "备注"],
			["photo", "photoFile", "附件上传"],
			["text", "meterno", "旧表身号"],
			["select", "supplyarea", "区域"],
			["text", "cardno", "户号"],
			["text", "cardname", "用户名"],
			["text", "address", "用水地址"],
			["text", "linkman", "联系人"],
			["phone", "phone", "手机号码"],
			["text", "tel", "联系电话"],
			["select", "credtype", "证件类型"],
			["textbutton", "credno", "证件号码"],
			["select", "oldcaliber", "旧水表口径"],
			["select", "waterproperty", "用水性质"],
			["text", "transactor", "经办人"],
			["text", "transactoridcards", "经办人身份证号"],
			["text", "managerphone", "经办人手机"],
			["select", "watermeteruse", "水表用途"],
			["select", "billtype", "票据类型"],
			["select", "flowcode", "流程名称"],
			["select", "newcaliber", "新水表口径"],
			["select", "payMethod", "缴费方式"],
			["text", "accountname", "开户人名称"],
			["text", "bankaccount", "银行账号"],
			["select", "bankcard", "开户银行"]
		],
		"personalshifttable": [ //移表个人
			["text", "proaddress", "新用水地址"],
			["select", "supplyarea", "区域"],
			["text", "cardno", "户号"],
			["text", "cardname", "用户名"],
			["text", "address", "原用水地址"],
			["text", "linkman", "联系人"],
			["phone", "phone", "手机号码"],
			["text", "tel", "联系电话"],
			["select", "credtype", "证件类型"],
			["textbutton", "credno", "证件号码"],
			["textarea", "remark", "备注"],
			["photo", "photoFile", "附件上传"],
			["select", "flowcode", "流程名称"],
			["select", "payMethod", "缴费方式"],
			["text", "accountname", "开户人名称"],
			["text", "bankaccount", "银行账号"],
			["select", "bankcard", "开户银行"],
			["select", "caliber", "口径"],
			["text", "meterno", "旧表身号"],
			["select", "watermeteruse", "水表用途"],
			["select", "billtype", "票据类型"]
		],
		"companyshifttable": [ //移表单位
			["text", "proaddress", "新用水地址"],
			["select", "supplyarea", "区域"],
			["text", "cardno", "户号"],
			["text", "cardname", "用户名"],
			["text", "address", "原用水地址"],
			["text", "linkman", "联系人"],
			["phone", "phone", "手机号码"],
			["text", "tel", "联系电话"],
			["text", "nsrsbh", "纳税人识别号"],
			["textbutton", "credno", "证件号码"],
			["select", "credtype", "证件类型"],
			["textarea", "remark", "备注"],
			["photo", "photoFile", "附件上传"],
			["select", "flowcode", "流程名称"],
			["select", "payMethod", "缴费方式"],
			["text", "accountname", "开户人名称"],
			["text", "bankaccount", "银行账号"],
			["select", "bankcard", "开户银行"],
			["select", "caliber", "口径"],
			["select", "watermeteruse", "水表用途"],
			["select", "billtype", "票据类型"]
		]

	}
	return formdate[name]
}

//获取表单字段信息