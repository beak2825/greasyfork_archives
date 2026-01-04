// ==UserScript==
// @name         MEITU-OA Productivity Script
// @namespace    http://tampermonkey.net/
// @version      1.80.190702
// @description  Efficiency first.
// @author       FTLOAP
// @license      MIT
// @match        *://oa.meitu.com/flow/*
// @require      https://cdn.jsdelivr.net/npm/clipboard@1/dist/clipboard.min.js
// @icon         https://corp.meitu.com/images/database/471525760478.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386968/MEITU-OA%20Productivity%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/386968/MEITU-OA%20Productivity%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = location.href;

	//====全局====
    if (document.getElementById("search_action")) {
        document.getElementById("search_action").focus();
        document.getElementById("search_action").select();
    }

    //====合同审核流程====
    if (url.match("htsh")) {

        //获取header标签位置
        var divHeader = document.getElementsByTagName("div")[3];
        var divHeaderList = document.getElementsByTagName("div")[4];

        //==复制文件名==
        //按区块分别获取名称部分
        var number = document.getElementsByTagName("span")[4].innerHTML,
            date = document.getElementsByTagName("input")[1].value,
            name = document.getElementsByClassName("check-num check-receive word-color disabled")[0].value,
            counterparty = document.getElementsByClassName("check-num check-receive word-color disabled")[1].value;
        if (document.getElementsByClassName("form-section2 clear")[2].getElementsByTagName("p")[1].getElementsByClassName("check-num pink-color fl")[0]) {
            var sum = document.getElementsByClassName("form-section2 clear")[2].getElementsByTagName("p")[1].getElementsByClassName("check-num pink-color fl")[0].value;
            var filename = number+"-"+date+"-"+name+"-"+counterparty+"-"+sum;
            var downloadname = number+"-"+date+"-"+name+"-"+counterparty+"-"+sum+".pdf";
        } else {
            var filename = number+"-"+date+"-"+name+"-"+counterparty+"-0.00(人民币)";
            var downloadname = number+"-"+date+"-"+name+"-"+counterparty+"-0.00(人民币).pdf";
        }

        //在header设置复制名称按键
        var btnCopy = document.createElement("a");
        btnCopy.id = "CopyName";
        btnCopy.href = "javascript:function();";
        btnCopy.innerHTML = "复制文件名";
        btnCopy.className = "btn fr";
        btnCopy.style.margin = "13px 10px 0 0";
        btnCopy.style.width = "90px";
        btnCopy.style.background = "#5DAC81";
        btnCopy.title = filename;
        divHeader.insertBefore(btnCopy,divHeaderList);

        //设置隐藏区块存放生成的文件名
        var divStorageNameHidden = document.createElement("div");
        divStorageNameHidden.id = "StorageName";
        divStorageNameHidden.innerHTML = filename;
        divStorageNameHidden.style.display = "none";
        divHeader.appendChild(divStorageNameHidden);//!!此行在整个HTML中增加了一个div区块，将导致此行以下代码所需提取的所增加div之后的编号加一

        //onclick复制事件
        btnCopy.setAttribute("data-clipboard-action","copy");
        btnCopy.setAttribute("data-clipboard-text",filename);
        btnCopy.onclick = function(){
            var clipboard = new Clipboard("#CopyName", {
                target: function() {
                    return document.querySelector("#StorageName");
                }
            });
            clipboard.on("success", function(e) {
                console.log(e);
            });
            clipboard.on("error", function(e) {
                console.log(e);
            });
        };

        //==下载功能及按键布局优化==
        //在header设置打印预览按键
        if (document.getElementsByClassName("btn btn-preview fr")[0]) {
            var btnPreview = document.getElementsByClassName("btn btn-preview fr")[0];
            divHeader.insertBefore(btnPreview,divHeaderList);
            btnPreview.innerHTML = "打印审核表";
            btnPreview.style.width = "90px";
            btnPreview.style.margin = "13px 30px 0 0";
            btnPreview.style.background = "#F7C242";
        }

        //在header设置下载按键
        if (document.getElementsByClassName("section-doc posr")[0].getElementsByClassName("form-show-word fr pink-color")[0]) { //判断是否能获取到下载按键，存在则继续运行
            var btnDownload = document.getElementsByClassName("section-doc posr")[0].getElementsByClassName("form-show-word fr pink-color")[0].cloneNode(true);//克隆下载按键
            btnDownload.id = "DownloadFile";
            btnDownload.innerHTML = "下载归档件";
            btnDownload.className = "btn fr";
            btnDownload.style.margin = "13px 30px 0 0";
            btnDownload.style.width = "90px";
            btnDownload.style.background = "#0089A7";
            btnDownload.download = downloadname;
            divHeader.insertBefore(btnDownload,divHeaderList);
        }

        //在header设置确认盖章和确认归档按键
        if (document.getElementsByClassName("btn btn-submit fr J_agree")[0]) { //判断是否能获取到通过流程按键，存在则继续运行
            var btnConfirm = document.getElementsByClassName("btn btn-submit fr J_agree")[0];
            divHeader.insertBefore(btnConfirm,divHeaderList);
            btnConfirm.style.width = "90px";
            btnConfirm.style.margin = "13px 30px 0 0";
            btnConfirm.style.background = "#F17C67";
        }

        //审核中流程的通过和退回按键
        if (document.getElementsByClassName("btn btn-submit fr J_justice_agree")[0]) {
            var btnAgree = document.getElementsByClassName("btn btn-submit fr J_justice_agree")[0];
            var btnReject = document.getElementsByClassName("btn btn-yel fr J_showPopupThrough")[0];
            divHeader.insertBefore(btnReject,divHeaderList);
            divHeader.insertBefore(btnAgree,divHeaderList);
            btnAgree.id = "agree";
            btnAgree.style.margin = "13px 30px 0 0";
            btnAgree.style.width = "90px";
            btnAgree.style.background = "#F17C67";
            btnReject.id = "reject";
            btnReject.style.margin = "13px 30px 0 0";
            btnReject.style.width = "90px";
            btnReject.style.background = "#986DB2";
        }

        //==归档附件栏放到表头==
        if (document.getElementsByClassName("section-doc posr")[0].getElementsByClassName("form-show-word fr pink-color")[0]) { //判断是否能获取到归档附件的下载按键，存在则继续运行
            if (document.getElementsByClassName("form-show-tit word-color")[2]) { //隐藏原有的归档附件标题
                document.getElementsByClassName("form-show-tit word-color")[2].style.display = "none";
            }
            else {
                document.getElementsByClassName("form-show-tit word-color")[1].style.display = "none";
            }
            var divSectionFirst = document.getElementsByClassName("form-section1 clear")[0];
            var htmlArchive = document.getElementsByClassName("section-doc posr")[0].innerHTML;
            var parArchive = document.createElement("p");
            parArchive.id = "parArchive";
            parArchive.className = "form-iteml item-mar word-color fl";
            parArchive.innerHTML = "归档附件：" + htmlArchive;
            parArchive.style.width = "800px";
            divSectionFirst.appendChild(parArchive);
            document.getElementsByClassName("section-doc posr")[0].style.display = "none";//HTML代码复制后隐藏原本归档附件栏
            //设置每项附件段落的class格式
            var par = document.getElementById("parArchive").getElementsByClassName("form-show-wrap");
            var i;
            for (i = 0; i < par.length; i++) {
                par[i].style.margin = "0 0 0 0";
                par[i].style.borderBottom = "0";
                par[i].style.marginLeft = "75px";
            }
            //另外设置首个附件行的格式，以调整整体位置
            par[0].style.display = "inline";
            par[0].style.marginLeft = "0";
        }
    }

    //====新增合作方流程====
    else if (url.match("xzhz")) {

        //==复制合作方名称==
        //点击合作方名称框直接复制名称
        var clickCopy1 = document.getElementById("name");
        clickCopy1.setAttribute("data-clipboard-action","copy");
        clickCopy1.setAttribute("data-clipboard-target","#name");
        clickCopy1.onclick = function() {
            var clipboard = new Clipboard("#name");
            clipboard.on("success", function(e) {
                console.log(e);
            });
            clipboard.on("error", function(e) {
                console.log(e);
            });
        };
        //点击统一信用代码框复制
        if (document.getElementById("credit_code")) {
            var clickCopy2 = document.getElementById("credit_code");
            clickCopy2.setAttribute("data-clipboard-action","copy");
            clickCopy2.setAttribute("data-clipboard-target","#credit_code");
            clickCopy2.onclick = function() {
                var clipboard = new Clipboard("#credit_code");
                clipboard.on("success", function(e) {
                    console.log(e);
                });
                clipboard.on("error", function(e) {
                    console.log(e);
                });
            };
        }

        //==设置header按键==
        var divHeader = document.getElementsByTagName("div")[3];
        var divHeaderList = document.getElementsByTagName("div")[4];
        if (document.getElementsByClassName("btn btn-yel fr J_showPopupThrough")[0]) {
            var btnReject = document.getElementsByClassName("btn btn-yel fr J_showPopupThrough")[0];
            divHeader.insertBefore(btnReject,divHeaderList);
            btnReject.id = "reject";
            btnReject.style.margin = "13px 100px 0 0";
            btnReject.style.width = "120px";
            btnReject.style.background = "#91B493";
        }
        if (document.getElementsByClassName("btn btn-pink fr J_agree")[0]) {
            var btnConfirm = document.getElementsByClassName("btn btn-pink fr J_agree")[0];
            divHeader.insertBefore(btnConfirm,divHeaderList);
            btnConfirm.id = "confirm";
            btnConfirm.style.margin = "13px 80px 0 0";
            btnConfirm.style.width = "120px";
            btnConfirm.style.background = "#EB7A77";
        }
        if (document.getElementsByClassName("btn btn-yel fr J_revocation")[0]) {//撤回按键与通过按键不能同时存在
            var btnRevoke = document.getElementsByClassName("btn btn-yel fr J_revocation")[0];
            divHeader.insertBefore(btnRevoke,divHeaderList);
            btnRevoke.id = "revoke";
            btnRevoke.style.margin = "13px 80px 0 0";
            btnRevoke.style.width = "120px";
            btnRevoke.style.background = "#F7C242";
        }

        //==优化批复输入框显示区域==
        //获取批复输入框
        var inputFeedback = document.getElementById("opinion");
        inputFeedback.style.position = "absolute";//相对于父元素的绝对位置
        inputFeedback.style.left = "120px";
        inputFeedback.style.top = "-36px";
        inputFeedback.style.padding = "5px 0 5px 10px";//内边距
        inputFeedback.style.borderWidth = "0 0 0 0";//边框
        inputFeedback.style.borderRadius = "5px";//圆角
        inputFeedback.style.height = "20px";
        inputFeedback.style.width = "870px";
        inputFeedback.placeholder = "在此输入批复反馈";//预置文字

        //==优化附件显示区域==
        //获取附件区块和表头区块位置
        var divAttachment = document.getElementsByClassName("section-doc posr")[0];
        var divSectionFirst = document.getElementsByClassName("form-section1 clear")[0];

        //创建附加区块新元素并置入表头
        var parAttachment = document.createElement("p");
        parAttachment.id = "attachment";
        parAttachment.className = "form-iteml word-color item-mar fl";
        parAttachment.style.width = "693px";
        parAttachment.style.marginBottom = "0";
        divSectionFirst.appendChild(parAttachment);

        //赋予新的附件区块旧区块的代码
        document.getElementsByClassName("form-show-tit word-color")[0].style.display = "none";//隐藏原有的申请附件标题
        var htmlAttachment = divAttachment.innerHTML;
        parAttachment.innerHTML = "申请附件：" + htmlAttachment;
        divAttachment.style.display = "none";//隐藏原有的附件区块

        //设置每项附件段落的class格式
        var par = document.getElementsByClassName("form-show-wrap");
        var i;
        for (i = 0; i < par.length; i++) {
            par[i].style.margin = "0 0 0 0";
            par[i].style.borderBottom = "0";
            par[i].style.marginLeft = "75px";
        }

        //另外设置首个附件行的格式
        par[0].style.display = "inline";
        par[0].style.marginLeft = "0";

        //==优化显示统一信用代码和合作内容简述==
        var divSectionSecond = document.getElementsByClassName("form-section2")[0];
        var parSectionSecond = document.getElementsByClassName("form-item item-mar clear")[1];
        if (document.getElementById("credit_code")){
            var textCode = document.getElementsByClassName("form-item item-mar clear")[5];
            divSectionSecond.insertBefore(textCode,parSectionSecond);
            var nameCode = textCode.getElementsByTagName("span")[0];
            nameCode.innerHTML = "统一社会信用代码：";
            nameCode.className = "word-color eight-word-align";
            textCode.getElementsByTagName("input")[0].style.width = "264px";
            var textBrief = document.getElementsByClassName("form-item item-mar clear")[6];
            divSectionSecond.insertBefore(textBrief,parSectionSecond);
            document.getElementsByTagName("textarea")[0].style.height = "60px";
        } else {
            var textBrief = document.getElementsByClassName("form-item item-mar clear")[5];
            divSectionSecond.insertBefore(textBrief,parSectionSecond);
            document.getElementsByTagName("textarea")[0].style.height = "60px";
        }

        //==改变关连人士按键位置==
        if (document.getElementsByClassName("btn xzhz-btn-pink fr J_createSupplierCode")) {
            var divOldBtn = document.getElementsByClassName("item-btns")[0];
            var btnRelated = document.getElementsByClassName("btn xzhz-btn-pink fr J_createSupplierCode")[0];
            var btnCancelRelated = document.getElementsByClassName("btn xzhz-btn-pink fr J_deleteSupplierCode")[0];
            divOldBtn.appendChild(btnRelated);
            divOldBtn.appendChild(btnCancelRelated);
            btnRelated.style.margin = "0 26px 0 0";
            btnCancelRelated.style.margin = "0 26px 0 0";
            btnRelated.style.background = "#FBE251";
            btnCancelRelated.style.background = "#D9CD90";
        }
    }

})();