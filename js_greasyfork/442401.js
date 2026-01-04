// ==UserScript==
// @name        HistoryInforEntryToImageIndexing
// @namespace   HistoryInforEntry
// @match       http://*/*/InvoiceHistory/HistoryDetailView.aspx?id=*
// @match       http://*/*/ImageIndexing/*
// @match       https://*/*/InvoiceHistory/HistoryDetailView.aspx?id=*
// @match       https://*/*/ImageIndexing/*
// @grant       none
// @version     20220401
// @author      Feng Guan
// @license BPTS
// @description 一些项目的Indexing页面上很多字段, IT也不熟悉怎么做单,本脚本是自动将Docs Queue中的某一条历史单的各个字段值存入storage, 然后去Indexing页面填单, 对于值来说,虽有张冠李戴, 但做测试和提交还是很方便, 不需要IT手动录入全单了,也比都填写123456和假地址要快.

// @downloadURL https://update.greasyfork.org/scripts/442401/HistoryInforEntryToImageIndexing.user.js
// @updateURL https://update.greasyfork.org/scripts/442401/HistoryInforEntryToImageIndexing.meta.js
// ==/UserScript==


$(function(){
	var storage=window.localStorage;

	if ($("[id$=IncludeImage]").length>0){ //历史记录的修改页面
		var btn = "<input type='button' value='Save Values to Storage' id='btnSaveToStorage'>"
		$(".topbar_system_name:first").append(btn);
	}

	if ($("#divImageName").length>0){ //历史记录的修改页面
		var btn = "<input type='button' value='Auto fill Values to Indexing Form' id='btnFillToIndexing'>"
		$(".topbar_system_name:first").append(btn);
	}
	
	$("#btnSaveToStorage").click(function(){
		var jsonInv = $("[ID$=hidInvoiceList]").val();
		storage.setItem('hidInvoiceList',jsonInv);
    var jsonSavedInv = storage.getItem('hidInvoiceList');
    console.log("Set storage="+jsonSavedInv);
    if (jsonSavedInv != "") {
      alert("已经将各个字段值存入storage,请去indexing页面填充测试提交");
    }
	});
	$("#btnFillToIndexing").click(function(){
		var jsonSavedInv = storage.getItem('hidInvoiceList');
    console.log("Get storage="+jsonSavedInv);
		if (jsonSavedInv != "") {
        var Invoices = JSON.parse(jsonSavedInv);
        $.map(Invoices, function (invoice) {
            invoice.ID = guid();
            InvoiceArray.push(invoice)
        })
        if (InvoiceArray.length > 0) {
            BindInvoiceArray();
            $("#tblInvoiceList .btn_edit:first").click();
           
        }
        var hidLines = $("[ID$=hidLineList]:first").val();
        if (hidLines != "") {
        var Lines = JSON.parse(hidLines);
        LineArray = [];
        $.map(Lines, function (line) {
            line.ID = guid();
            LineArray.push(line)
        })
        BindLineArray();
        
      alert("已经将值绑定到页面下放的Inserted区域, 单条已填表单, 多条的请点击行尾编辑送值上表单.");
    }
    }
	});
})