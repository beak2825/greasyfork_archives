/**
     _                           
    (_)                          
     _   _ __     ___ _  _    _  
    | | / _` \  / / _`/ _ \ \ /  
    | |/ (_|\ \/ / (_|  __/\ \   
    \ |\__,_ \__/\__,_\___ /\_\  
    /_/                          
                                 
    
    作者：陈霓清
    官网：www.javaex.cn
    版本：4.0
    Licences: MIT
*/
// 自定义验证类型。必填项：页面中直接写 data-type="required" 即可，不需要为其定义正则表达式
var regJson = {
	"money" : "/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/",    // 0 + 正整数 + 最多2位小数(正数)
	"int" : "/^-?\\d+$/",    // 整数
	"positive_int" : "/^[0-9]*[1-9][0-9]*$/",     // 正整数
	"negative_int" : "/^-[0-9]*[1-9][0-9]*$/",    // 负整数
	"nonnegative_int" : "/^\\d+$/",               // 非负整数：正整数 + 0
	"nonpositive_int" : "/^((-\\d+)|(0+))$/",     // 非正整数：负整数 + 0
	"positive_decimal" : "/^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$/",        // 正小数
	"negative_decimal" : "/^(-(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/",     // 负小数
	"nonnegative_decimal" : "/^\\d+(\\.\\d+)?$/",                      // 非负小数：0 + 正小数
	"nonpositive_decimal" : "/^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$/",    // 非正小数：0 + 负小数
	"email" : "/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/",    // 邮箱
	"phone" : "/^(1)\\d{10}$/",    // 手机号
	"idcard" : "/(^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$)/",    // 身份证号
	"chinese" : "/^[\u4e00-\u9fa5]+$/",    // 中文
	"english" : "/^[a-zA-Z]+$/",     // 英文字母
	"english_number" : "/^[0-9a-zA-Z]+$/",    // 英文字母或数字
	"qq" : "/^[1-9][0-9]{4,9}$/",
	"car_number" : "/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/",    // 车牌号
	"account" : "/^[a-zA-Z]{1}([a-zA-Z0-9_]){5,10}$/",    // 账号：只能输入5-10个以字母开头，可带数字、下划线的字符串
	"nickname" : "/^[a-zA-Z0-9_\u4e00-\u9fa5]{2,10}$/",    // 昵称：长度限制为2-10个字，只允许中文、字母、数字和下划线
	"password" : "/^[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{6,16}$/"    // 密码：6到16位，允许有字母、数字和一些特殊字符
};

/**
 * javaex表单验证插件入口
 */
function javaexVerify(selector) {
	var result = true;
	if (!!selector) {
		// 遍历当前页面所有input元素
		$(selector+" input, "+selector+" textarea, "+selector+" select").each(function() {
			var dataTypeAll = $(this).attr("data-type");
			// 判断该输入框是否需要进行验证
			if (!!dataTypeAll) {
				// 防止自定义错误提示后，再次提交
				if ($(this).next()!=null) {
					if ($(this).next().hasClass("javaex-form-error")) {
						result = false;
						return result;
					}
				}
				if (!formVerify($(this), dataTypeAll)) {
					result = false;
				}
			}
		});
	} else {
		// 遍历当前页面所有input元素
		$("input, textarea, select").each(function() {
			var dataTypeAll = $(this).attr("data-type");
			// 判断该输入框是否需要进行验证
			if (!!dataTypeAll) {
				// 防止自定义错误提示后，再次提交
				if ($(this).next()!=null) {
					if ($(this).next().hasClass("javaex-form-error")) {
						result = false;
						return result;
					}
				}
				if (!formVerify($(this), dataTypeAll)) {
					result = false;
				}
			}
		});
	}
	
	return result;
}

/**
 * 正则表达式验证函数
 * obj : jquery对象
 * dataTypeAll : 需要验证哪些类型
 */
function formVerify(obj, dataTypeAll) {
	// 判断内容去除左右两边空格后是否为空
	if ($.trim(obj.val()).length==0) {
		// 解除错误状态
		deleteErrorState(obj);
		// 判断是否允许空
		if (dataTypeAll.indexOf("null")==-1) {
			var errorMsg = "必填项不能为空";
			// 添加错误状态
			addErrorMsg(obj, errorMsg);
			return false;
		} else {
			return true;
		}
	}
	
	// 判断验证类型是否是 必填
	if (dataTypeAll.indexOf("required")>=0) {
		return true;
	}
	
	// 遍历这些验证类型并验证
	var dataTypeArr = dataTypeAll.split("|");
	var regArr = new Array();
	for (let i=0; i<dataTypeArr.length; i++) {
		var reg = eval(regJson[dataTypeArr[i]]);
		if (!!reg) {
			regArr.push(reg);
		}
	}
	if (regArr.length>0) {
		// 解除错误状态
		deleteErrorState(obj);
		
		// 定义一个标识，默认验证失败
		var flag = false;
		for (let i=0; i<regArr.length; i++) {
			// 验证成功时，直接返回return true;
			if (regArr[i].test(obj.val())) {
				return true;
			}
		}
		// 全部验证失败时，返回错误信息
		if (!flag) {
			// 获取当前节点的错误信息
			var errorMsg = obj.attr("error-msg");
			if (!errorMsg) {
				errorMsg = "验证失败";
			}
			// 添加错误状态
			addErrorMsg(obj, errorMsg);
			return false;
		}
	}
	
	return false;
}

/**
 * 解除错误状态
 * obj : jquery对象
 */
function deleteErrorState(obj) {
	var errorTipId = obj.attr("error-tip-id");
	if (errorTipId === undefined) {
		if (obj.next()!=null) {
			if (obj.next().hasClass("javaex-form-error") || obj.next().hasClass("javaex-win")) {
				obj.parent().removeClass("javaex-error-parent");
				obj.next().remove();
			}
		}
	} else {
		$("#"+errorTipId).addClass("vh");
	}
}

/**
 * 添加错误状态
 * obj : jquery对象
 */
function addErrorMsg(obj, errorMsg) {
	if (typeof obj === "string") {
		obj = $("#" + obj);
	}
	
	var errorTipId = obj.attr("error-tip-id");
	if (errorTipId === undefined) {
		obj.parent().addClass("javaex-error-parent");
		
		var errorPos = obj.attr("error-pos");
		if (!errorPos) {
			var objHeight = obj.height();
			var objParentHeight = obj.parent().height();
			errorPos = objHeight>objParentHeight ? objHeight:objParentHeight;
		} else {
			errorPos = parseInt(errorPos);
		}
		
		var html = '';
		var errorMode = obj.attr("error-mode");
		// 向下红字
		if (errorMode === undefined) {
			html += '<span class="javaex-form-error javaexFormErrorTip" style="top: '+errorPos+'px;">'+errorMsg+'</span>';
		}
		// 向上弹出层
		else if (errorMode=="2") {
			html += '<div class="javaex-win javaex-win-hint" style="opacity: 1; display: block; top: -'+errorPos+'px;z-index:9999;">';
			html += '<div class="javaex-error-text">'+errorMsg+'</div>';
			html += '<div class="javaex-tail"></div>';
			html += '</div>';
		}
		obj.after(html);
	} else {
		$("#"+errorTipId).text(errorMsg);
		$("#"+errorTipId).removeClass("vh");
	}
}

/**
 * 实时监听
 */
$(function() {
	// 监听元素获得焦点事件
	$(document).on('focus', 'input[type="text"], input[type="password"], textarea', function() {
		var dataTypeAll = $(this).attr("data-type");
		
		// 判断该输入框是否需要进行验证
		if (!!dataTypeAll) {
			// 解除错误状态
			deleteErrorState($(this));
		}
		
		if ($(this).hasClass("original") || $(this).hasClass("readonly")) {
			// 使用原生样式，不添加边框颜色
		} else {
			// 添加蓝色边框
			$(this).addClass("javaex-input-border");
		}
	});
	
	// 监听元素失去焦点事件
	$(document).on('blur', 'input[type="text"], input[type="password"], textarea', function() {
		// 清除颜色边框
		$(this).removeClass("javaex-input-border");
		// 判断该输入框是否需要进行验证
		var dataTypeAll = $(this).attr("data-type");
		if (!!dataTypeAll) {
			// 如果未输入内容，则不验证
			if ($.trim($(this).val()).length==0) {
				// 解除错误状态
				deleteErrorState($(this));
			} else {
				// 验证
				formVerify($(this), dataTypeAll);
			}
		}
	});
});