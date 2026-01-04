// ==UserScript==
// @name      RejectSV
// @namespace    https://global-oss.bigo.tv
// @description reject sv
// @version      1.3
// @author     OLEREO!
// @match  https://manage-oss.bigo.tv/welog/user-video/list
// @downloadURL https://update.greasyfork.org/scripts/373856/RejectSV.user.js
// @updateURL https://update.greasyfork.org/scripts/373856/RejectSV.meta.js
// ==/UserScript==


let bt = document.createElement("input");
bt.setAttribute("type", "button");
bt.setAttribute("value", "开始");

let wBreadcrumbs = document.getElementById("breadcrumbs");
wBreadcrumbs.appendChild(bt);


bt.onclick = function () {
    Fun();
};


function Fun() {
    let wBtBohui = document.getElementsByClassName("reject btn btn-danger btn-sm");

    if(wBtBohui.length > 0){

        let state = 0;//0
        let btInt = 0;
        //等待5秒加载视频

        //轮换查询驳回窗口是否已经显示
        let rejectIntervl =  setInterval(function () {
            if(wBtBohui[btInt]){
                switch (state){
                    case 0:
                        //点击驳回
                        wBtBohui[btInt].click();
                        state = 1;
                        break;
                    case 1:
                        //等待驳回窗口显示
                        let rejectMeModal = document.getElementById("rejectMeModal");
                        if(rejectMeModal.style.display !== "none"){
                            state = 2;
                        }
                        break;
                    case 2:
                        //窗口显示之后，等待一下
                        state = 3;
                        break;
                    case 3:
                        //填写信息
                        let wRejecttext = document.getElementById("rejecttext");
                        wRejecttext.value = "运营米海滨反馈搬运假号";
                        state = 4;
                        break;
                    case 4:
                        //点击驳回确认
                        let wSendReject = document.getElementById("sendReject");
                        wSendReject.click();
                        state = 5;
                        break;
                    case 5:
                        state = 0;
                        btInt ++;
                        break;
                }
            }else {
                //下一页
                let nextBt = document.getElementsByClassName("next")[0].childNodes[0];
                nextBt.click();
                clearInterval(rejectIntervl);
                setTimeout(function () {
                    Fun()
                },5000);
            }
        },500);
    }else {
        alert("检测不到视频")
    }
}


