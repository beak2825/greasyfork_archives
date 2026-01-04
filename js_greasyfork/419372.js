// ==UserScript==
// @name         产业扶持-资金-测试脚本
// @namespace    http://tampermonkey.net/
// @version      0.79
// @description  产业扶持-资金-测试脚本 （1.条件可视化。2.开放控制）
// @author       Villiam / baifangqing
// @match        http://59.61.83.130:37090/platform/bpm/task/startFlowForm.ht?defId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419372/%E4%BA%A7%E4%B8%9A%E6%89%B6%E6%8C%81-%E8%B5%84%E9%87%91-%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/419372/%E4%BA%A7%E4%B8%9A%E6%89%B6%E6%8C%81-%E8%B5%84%E9%87%91-%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


// 字节转换
let trans_Byte = (fileSize) => {
	let result = ''
	if (fileSize >= 1073741824) {
		// B => GB
		result = fileSize % 1073741824 === 0 ? fileSize / 1073741824 + 'G' : Math.trunc(fileSize / 1073741824) + 'G'
	} else if (fileSize >= 1048576) {
		// B => MB
		result = fileSize % 1048576 === 0 ? fileSize / 1048576 + 'MB' : Math.trunc(fileSize / 1048576) + 'MB'
	} else if (fileSize >= 1024) {
		// B => KB
		result = fileSize % 1024 === 0 ? fileSize / 1024 + 'KB' : Math.trunc(fileSize / 1024) + 'KB'
	} else {
		result = fileSize + 'B'
	}
	return result
}

//格式转换
let Format_Validate = (val) => {
	if (val !== undefined) {
		const format_Val = val.replace("maxlength", "长度").replace("required:true", "必填").replace("required:false", "非必填")
			.replace("number:true", "数值类型").replace("{", "").replace("}", "").replace("maxIntLen", "整数位").replace(
				"maxDecimalLen:0", "")
			.replace("maxDecimalLen", "小数位").replace("minvalue", "最小值").replace("empty:false", "不允许为空").replace("empty:true",
				"允许为空")
			.replace('email', '校验-邮箱').replace('filerequired:true', '必须上传')
		return format_Val
	}
}

(function() {

	document.addEventListener("DOMContentLoaded", function(event) {
	console.log(12313131231)

	});

    $("input").each(function() {
			const dom = $(this)
			var validate = dom.attr('validate');
			var nodekey = "";
			if (typeof(dom.attr('nodekey')) != 'undefined') {
				nodekey = `，数据字典: ${dom.attr('nodekey')}`;
			}
			let update = Format_Validate(validate)
			let create_Dom = document.createElement('span')
			create_Dom.innerText = update + nodekey
			console.log(create_Dom)
			dom.parent().append(create_Dom)
			dom.remove()
		})


		$("textarea").each(function() {
			const dom = $(this)
			dom.css('display', 'block')
			var validate = Format_Validate(dom.attr('validate'));
			dom.val(validate);
		})

		$('a').each(function() {
			const dom = $(this)
			let file_Data = dom.attr('onclick')
			if (typeof(file_Data) === 'string') {
				let split_Data = file_Data.replace(')', '').split(',')
				var file_Type, flie_limit, flie_byte

				if (typeof(split_Data) !== undefined) {
					file_Type = split_Data[1]
					flie_limit = split_Data[2]
					flie_byte = trans_Byte((split_Data[3]))
				}

				let create_Dom = document.createElement('input')
				create_Dom.value = `文件类型：${file_Type}，数量上限：${flie_limit}，文件大小：${flie_byte}`
				create_Dom.style.width = `600px`

				console.log($(this).parent())
				$(this).parent().append(create_Dom)
			}
		})


		/*
		  思明区 开放只读
		*/
		$("input").removeAttr("readonly")
		$("input").removeAttr("disabled")
		$("select").removeAttr("disabled")
		$("textarea").removeAttr("readonly")
		$('input[name="m:t_form_main_96_01:HYML"]').ligerComboBox('setEnabled')
		$('input[name="m:t_form_main_96_01:HYDM"]').ligerComboBox('setEnabled')
		$('input[name="m:t_form_main_96_01:STREET"]').ligerComboBox('setEnabled')
})();



