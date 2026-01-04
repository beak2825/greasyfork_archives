// ==UserScript==
// @name         online notice
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  online notice script!
// @author       zhangliyao
// @match        https://halo.corp.kuaishou.com/devcloud/cloud/service/*/batch/detail/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/450030/online%20notice.user.js
// @updateURL https://update.greasyfork.org/scripts/450030/online%20notice.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    setTimeout(() => {
        //var url= document.location.href;
        //console.log(url);
        //判断地址后面是否多了某些值，没有就进方法里进行刷新
        //if(url.indexOf("datetime=") == -1){
            //var t = new Date();
            //var newUrl = url + "?datetime=" + t.getTime();
            //location.replace(newUrl)
        //}
        var actionBar = document.getElementsByClassName("action-bar float-right")[0];
        var pushNoticeBtn = document.createElement("button");
        pushNoticeBtn.style.marginRight = "10px";
        pushNoticeBtn.className = "ks-button ks-button--primary ks-button--small";
        pushNoticeBtn.innerText = "发送上线提醒";
        actionBar.appendChild(pushNoticeBtn);
        pushNoticeBtn.onclick = function () {
            createNoticeForm();
        }
    }, 1000);

    function createNoticeForm() {
        function commitResult() { // 要出发的函数
            alert("提交成功");
            this.parentNode.parentNode.parentNode.style.display = "none"; //这里时为了获得 modal_bc;
        }
        create_modal(false,"请填写相关通知内容",commitResult);
    }

    function create_modal(alert_or_confirm,title_text,confirm_trigger_function) {
        let modal_bg = document.createElement("div");
        let modal_container = document.createElement("div");

        let modal_title = document.createElement("div");
        let modal_content = document.createElement("div");
        let modal_footer = document.createElement("div");
        //设置id
        modal_bg.setAttribute("id","modal_bg");
        modal_container.setAttribute("id","modal_container");
        modal_title.setAttribute("id","modal_title");
        modal_content.setAttribute("id","modal_content");
        modal_footer.setAttribute("id","modal_footer");
        //设置样式
        modal_bg.style.cssText=
            "display:block;" +
            "background-color: rgba(0,0,0,0.4);" +
            "position:fixed;" +
            "top:0;" +
            "bottom:0;" +
            "right:0;" +
            "left:0;";
        modal_container.style.cssText=
            "background-color:white;" +
            "width:600px;" +
            "height:500px;" +
            "margin:10% auto;";
        modal_title.style.cssText=
            "color:white;" +
            "background-color: rgba(50,107,251,.8);" +
            "width:100%;" +
            "height:50px;"+
            "text-align: center;"+
            "font-size: 20px;"+
            "line-height:50px;";
        modal_content.style.cssText=
            "color:black;" +
            "display: grid;" +
            "grid-template-columns: 200px 400px;" +
            "grid-gap: 10px;" +
            "grid-auto-rows: 35px;" +
            "text-align: right;" +
            "width:100%;" +
            "height:360px;" +
            "margin:10px auto;";
        modal_footer.style.cssText=
            "padding-top: 10px;" +
            "color:white;" +
            "width:100%;" +
            "height:50px;";

        modal_container.appendChild(modal_title);
        modal_container.appendChild(modal_content);
        modal_container.appendChild(modal_footer)
        modal_bg.appendChild(modal_container);
        //将整个模态框添加到body中
        document.body.appendChild(modal_bg);

        //给模态框添加相应的内容
        modal_title.innerHTML = title_text;

        // 制作表单输入框
        let checklistLable = document.createElement("label");
        checklistLable.innerText = "变更上线checklist：";
        checklistLable.style.cssText =
            "padding:5px;" +
            "margin-left:30px;";
        let checklist = document.createElement("input");
        checklist.setAttribute("id", "checklist");
        checklist.style.cssText =
            "width: 350px;" +
            "padding:5px;" +
            "margin-right:30px;";
        modal_content.appendChild(checklistLable);
        modal_content.appendChild(checklist);

        let changePointLabel = document.createElement("label");
        changePointLabel.innerText = "改动点以及影响范围：";
        changePointLabel.style.cssText =
            "padding:5px;" +
            "margin-left:30px;";
        let changePoint = document.createElement("input");
        changePoint.setAttribute("id", "changePoint");
        changePoint.style.cssText =
            "width: 350px;" +
            "padding:5px;" +
            "margin-right:30px;";
        modal_content.appendChild(changePointLabel);
        modal_content.appendChild(changePoint);

        let isTestLabel = document.createElement("label");
        isTestLabel.innerText = "是否经过QA测试：";
        isTestLabel.style.cssText =
            "padding:5px;" +
            "margin-left:30px;";
        let isTest = document.createElement("input");
        isTest.setAttribute("id", "isTest")
        isTest.style.cssText =
            "width: 350px;" +
            "padding:5px;" +
            "margin-right:30px;";
        modal_content.appendChild(isTestLabel);
        modal_content.appendChild(isTest);

        let qaLable = document.createElement("label");
        qaLable.innerText = "QA测试负责人：";
        qaLable.style.cssText =
            "padding:5px;" +
            "margin-left:30px;";
        let qa = document.createElement("input");
        qa.setAttribute("id", "qa")
        qa.style.cssText =
            "width: 350px;" +
            "padding:5px;" +
            "margin-right:30px;";
        modal_content.appendChild(qaLable);
        modal_content.appendChild(qa);

        let testResultLabel = document.createElement("label");
        testResultLabel.innerText = "测试结论：";
        testResultLabel.style.cssText =
            "padding:5px;" +
            "margin-left:30px;";
        let testResult = document.createElement("input");
        testResult.setAttribute("id", "testResult");
        testResult.style.cssText =
            "width: 350px;" +
            "padding:5px;" +
            "margin-right:30px;";
        modal_content.appendChild(testResultLabel);
        modal_content.appendChild(testResult);

        let doubleCheckLabel = document.createElement("label");
        doubleCheckLabel.innerText = "double check同学：";
        doubleCheckLabel.style.cssText =
            "padding:5px;" +
            "margin-left:30px;";
        let doubleCheck = document.createElement("input");
        doubleCheck.setAttribute("id", "doubleCheck");
        doubleCheck.style.cssText =
            "width: 350px;" +
            "padding:5px;" +
            "margin-right:30px;";
        modal_content.appendChild(doubleCheckLabel);
        modal_content.appendChild(doubleCheck);

        let otherCareLabel = document.createElement("label");
        otherCareLabel.innerText = "其他方是否需要关注："
        otherCareLabel.style.cssText =
            "padding:5px;" +
            "margin-left:30px;";
        let otherCare = document.createElement("input");
        otherCare.setAttribute("id", "otherCare")
        otherCare.style.cssText =
            "width: 350px;" +
            "padding:5px;" +
            "margin-right:30px;";
        modal_content.appendChild(otherCareLabel);
        modal_content.appendChild(otherCare);

        let rollbackLabel = document.createElement("label");
        rollbackLabel.innerText = "回滚方案："
        rollbackLabel.style.cssText =
            "padding:5px;" +
            "margin-left:30px;";
        let rollback = document.createElement("input");
        rollback.setAttribute("id", "rollback")
        rollback.style.cssText =
            "width: 350px;" +
            "padding:5px;" +
            "margin-right:30px;";
        modal_content.appendChild(rollbackLabel);
        modal_content.appendChild(rollback);

        // modal_content.innerHTML = modal_contents;
        // modal_footer.innerHTML = "This is a modal footer";

        // 制作关闭按钮
        let close_button = document.createElement("span");
        close_button.innerHTML = "&times;";
        close_button.setAttribute("id","modal_close_button")
        close_button.style.cssText=
            " margin-right:20px;" +
            "line-height:50px;" +
            "color: #aaa;" +
            "float: right;" +
            "font-size: 24px;" +
            "font-weight: bold;";
        close_button.onmouseover=function(event){
            close_button.style.color = "black";
            event =event||window.event;
            event.stopPropagation();
        }
        document.onmouseover = function(){
            document.getElementById("modal_close_button").style.color = "#aaa";
        }
        close_button.addEventListener("click",function () {
            modal_bg.style.display = "none"
        })
        modal_title.appendChild(close_button);

        //制作确定按钮和取消按钮
        let confirm_button = document.createElement("div");
        let cancel_button  = document.createElement("div");
        confirm_button.style.cssText=
            "border-radius:5px;" +
            "color:white;" +
            "text-align:center;" +
            "line-height:25px;" +
            "font-size:17px;" +
            "float:right;" +
            "width: 60px;" +
            "background-color: #326bfb;" +
            "padding:5px;" +
            "margin-right:30px;";
        cancel_button.style.cssText="border-radius:5px;" +
            "color:white;" +
            "text-align:center;" +
            "line-height:25px;" +
            "font-size:17px;" +
            "float:right;" +
            "width: 60px;" +
            "background-color: #326bfb;" +
            "padding:5px;" +
            "margin-right:30px;";
        confirm_button.innerHTML = "确定";
        cancel_button.innerHTML = "取消";
        if(alert_or_confirm){
            modal_footer.appendChild(confirm_button);
        }else {
            modal_footer.appendChild(confirm_button);
            modal_footer.appendChild(cancel_button);
        }

        //添加相应的事件
        cancel_button.addEventListener("click",function () {
            modal_bg.style.display = "none"
        });
        confirm_button.addEventListener("click", pushKimOnlineNotice);

    }

    // 发送kim上线提醒
    function pushKimOnlineNotice() {
        var titleContent = document.getElementsByClassName("title-content global-text-ellipsis")[0].innerText;
        var userName = document.getElementsByClassName("ks-user__name")[0].innerText;
        var checklist = document.getElementById("checklist").value;
        var changePoint = document.getElementById("changePoint").value;
        var isTest = document.getElementById("isTest").value;
        var qa = document.getElementById("qa").value;
        var testResult = document.getElementById("testResult").value;
        var doubleCheck = document.getElementById("doubleCheck").value;
        var otherCare = document.getElementById("otherCare").value;
        var rollback = document.getElementById("rollback").value;

        var content = "<strong>【上线标题】</strong>" + titleContent + "<br>" +
                "<strong>【上线人】</strong>" + userName + "<br>" +
                "<strong>【变更上线checklist】</strong>" + checklist + "<br>" +
                "<strong>【改动点以及影响范围】</strong>" + changePoint + "<br>" +
                "<strong>【上线集群】</strong>国内" + "<br>" +
                "<strong>【是否经过QA测试】</strong>" + isTest + "<br>";
        if (qa) {
            content = content + "<strong>【QA测试负责人】</strong> <@=username(" + qa + ")=> <br>"
        }
        content = content + "<strong>【测试结论】</strong>" + testResult + "<br>"
        content = content + "<strong>【double check同学】</strong>无 <br>"
        if(doubleCheck) {
            content = content + "<@=username(" + doubleCheck + ")=> <br>"
        }
        content = content + "<strong>【其他方是否需要关注】</strong>无 <br>"
        if(otherCare) {
             content = content + "<@=username(" + otherCare + ")=> <br>"
        }
        content = content + "<strong>【回滚方案】</strong>无"
        if(rollback) {
            content = content + "<strong>【回滚方案】</strong>" + rollback;
        }

        var noticeObject = {
            "msgtype": "markdown",
            "markdown": {
                "content": content
            }
        }

        GM_xmlhttpRequest({
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
            },
            url: "https://kim-robot.kwaitalk.com/api/robot/send?key=d0682f03-a57e-4e21-8835-f997d86d6840",
            data: JSON.stringify(noticeObject),
            dataType: 'json',
            onload: function(response){
                console.log("请求成功");
                console.log(response.responseText);
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });

    };
})();

