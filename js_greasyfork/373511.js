// ==UserScript==
// @name       service_test.html enhance
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  0.0
// @author       You
// @include *service_test*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @require      http://static.hdslb.com/js/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373511/service_testhtml%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/373511/service_testhtml%20enhance.meta.js
// ==/UserScript==

jQuery.noConflict();
(function($) {
	function format(jsonStr) { /* 格式化JSON源码(对象转换为JSON文本) */
		try {
			var formatJson = JSON.stringify(JSON.parse(jsonStr), null, 4)
		} catch (e) {
			console.log(jsonStr);
		}
		return formatJson;
	}

	function formatDateToString(date) {
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		if (month < 10) month = "0" + month;
		if (day < 10) day = "0" + day;
		return year + '/' + month + '/' + day;
	}

	function formateDateAndTimeToString(date) {
		var hours = date.getHours();
		var mins = date.getMinutes();
		var secs = date.getSeconds();
		var msecs = date.getMilliseconds();
		if (hours < 10) hours = "0" + hours;
		if (mins < 10) mins = "0" + mins;
		if (secs < 10) secs = "0" + secs;
		return formatDateToString(date) + ' ' + hours + ':' + mins + ':' + secs;
	}

	function refreshMap() {
		window.methodMap = new Map();
		window.keys = GM_listValues();
		window.keys.forEach(function(element, index) {
			var keyAndTime = element.split(':')
			if (!methodMap.has(keyAndTime[0])) {
				methodMap.set(keyAndTime[0], new Array())
			}
			try {
				methodMap.get(keyAndTime[0]).push(parseInt(keyAndTime[1]));
			} catch (e) {
				// statements
				console.log(e);
			}
		});
	}

	function compress() {
		var tempSet = new Set();
		window.keys = GM_listValues();
		window.keys.forEach(function(element, index) {
			var methodNameAndTime = element.split(':')
			var formatJson = format(GM_getValue(element));
			if (!tempSet.has(methodNameAndTime[0] + formatJson)) {
				GM_setValue(element, formatJson);
				tempSet.add(methodNameAndTime[0] + formatJson);
			} else {
				console.log("删除重复的key：" + element);
				GM_deleteValue(element);
			}
		});
	}

	function onChange() {
		$('#callList').html('');
		var callList = methodMap.get($("#serviceNameLike").val() + '.' + $("#serviceName").val() + '.' + $("#methodName").val()).reverse();
		if (!callList) {
			return;
		}
		callList.forEach(function(element, index) {
			$('#callList').append('<option value="' + element + '">' + formateDateAndTimeToString(new Date(element)) + '</option>');
		});
	}

	window.methodMap = new Map();

	window.keys = GM_listValues();

	refreshMap();

	setTimeout(onChange, 1000);
	$("tbody tr:eq(3) td:eq(0)").append('<input type="button" value=" 提交（成功后保存） " id="hookSubmitBtn">');

	$("tbody tr:eq(3) td:eq(0)").append('<input type="button" value=" 保存 " id="saveBtn">');

	$("tbody tr:eq(3) td:eq(0)").append('<input type="button" value=" 压缩去重 " id="mergeBtn">');

	$("tbody tr:eq(2) td:eq(0)").html('<select id="callList" multiple="multiple" style="width:150px;height:600px"> </select>');

	$("select#callList").click(function() {
		var inputParam = GM_getValue($("#serviceNameLike").val() + '.' + $("#serviceName").val() + '.' + $("#methodName").val() + ':' + $(this).val());
		$('#paramterInput').val(format(inputParam));
		// console.log(inputParam);
	});

	$("#methodName").change(function() {
		onChange();
	});

	$("#serviceName").change(function() {
		setTimeout(onChange, 1000);
	});

	$("#serviceNameLike").change(function() {
		setTimeout(onChange, 1000);
	});

	$("#submitBtn").remove();

	$("#hookSubmitBtn").click(function() {
		$.post(
			$("#serviceUrl").val(), {
				serviceName: $("#serviceName").val(),
				methodName: $("#methodName").val(),
				paramterInput: $("#paramterInput").val()
			},
			function(data, status) {
				$("#invokeOnput").val(data);
				if (data.indexOf('"processResult":false') < 0) {
					GM_setValue($("#serviceNameLike").val() + '.' + $("#serviceName").val() + '.' + $("#methodName").val() + ':' + new Date().getTime(), format($("#paramterInput").val(), false));
					refreshMap();
					onChange();
				}
			}
		);
	});

	$("#saveBtn").click(function() {
		GM_setValue($("#serviceNameLike").val() + '.' + $("#serviceName").val() + '.' + $("#methodName").val() + ':' + new Date().getTime(), format($("#paramterInput").val(), false));
		refreshMap();
		onChange();
	});

	$("#mergeBtn").click(function() {
		compress();
		refreshMap();
		onChange();
	});

})(jQuery); //这里要传入jQuery对象