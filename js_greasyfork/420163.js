// ==UserScript==
// @name         产业扶持-测试端-填充申报
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  产业扶持-测试端-申报项目 自动填写
// @author       Villiam
// @match        http://localhost/cyfc/platform/bpm/task/startFlowForm.ht?defId=*
// @match        http://localhost/cyfc/platform/bpm/task/startFlowForm.ht?runId=*
// @match        http://59.61.83.130:37090/platform/bpm/task/startFlowForm.ht?defId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420163/%E4%BA%A7%E4%B8%9A%E6%89%B6%E6%8C%81-%E6%B5%8B%E8%AF%95%E7%AB%AF-%E5%A1%AB%E5%85%85%E7%94%B3%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/420163/%E4%BA%A7%E4%B8%9A%E6%89%B6%E6%8C%81-%E6%B5%8B%E8%AF%95%E7%AB%AF-%E5%A1%AB%E5%85%85%E7%94%B3%E6%8A%A5.meta.js
// ==/UserScript==

(function() {
    var myDate = new Date(); //实例一个时间对象；
    var hms = ""+myDate.getHours()+myDate.getMinutes()+myDate.getSeconds(); //获取系统时分秒，
	// 输入框
    $.each($('input[type="text"]').not('[readonly="readonly"]'), function(index, item) {
        if ($(item).val().length < 1 ) { $(item).val(hms); }
    });
	// 数字框
	$.each($('input[type="number"]').not('[readonly="readonly"]'), function(index, item) {
	        if ($(item).val().length < 1 ) { $(item).val(hms); }
	    });
    $.each($('input[validate*="邮政编码"]'), function(index, item) {
        $(item).val("350000");
    });
    $.each($('input[validate*="手机号码"]'), function(index, item) {
        $(item).val("13800000000");
    });
    $.each($('input[validate*="电话"]'), function(index, item) {
        $(item).val("0592-88888888");
    });
    $.each($('input[validate*="传真"]'), function(index, item) {
        $(item).val("0592-88888888");
    });
    $.each($('input[validate*="email"]'), function(index, item) {
        $(item).val("a@b.c");
    });
    $.each($('input[validate*="身份证"]'), function(index, item) {
        $(item).val("110101202010100009");
    });
    $.each($("textarea"), function(index, item) {
        $(item).val("测试填填");
    });
	// 日期
    $.each($('input[datefmt="yyyy-MM-dd"]'), function(index, item) {
        $(item).val("2019-05-09");
    });
	$.each($('input[datefmt="yyyy-MM"]'), function(index, item) {
	    $(item).val("2019-05");
	});
	$.each($('input[datefmt="yyyy"]'), function(index, item) {
	    $(item).val("2020");
	});
    $.each($('input.date'), function(index, item) {
        $(item).val("2019-05-09");
    });

    $.each($('select'), function(index, item) {
        //$(item).children("option").eq(1).prop('selected', 'selected'); // 默认选择第二项
    });
    $.each($('radio'), function(index, item) {
        $(item).click();
    });

    // 设置附件
    $.each($('textarea[controltype="attachment"]'), function(index, item) {
        $(item).val('[{"id":"100000011130794","name":"测试图片.jpg(厦门****有限公司_2020-08-21)"}]');
    });

    $("div.file_upload input[type=hidden]").val('[{"id":"100000011130794","name":"测试图片.jpg(厦门****有限公司_2020-08-21)"}]');


})();