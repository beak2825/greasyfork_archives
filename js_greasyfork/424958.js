// ==UserScript==
// @name         去除CODOL打靶活动分解时的弹窗提示
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  去除CODOL打靶活动分解时烦人的弹窗确认, 仅限活动 https://codol.qq.com/cp/a20210311lucky/index.html
// @author       ChnMig
// @match        https://codol.qq.com/cp/a20210311lucky/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424958/%E5%8E%BB%E9%99%A4CODOL%E6%89%93%E9%9D%B6%E6%B4%BB%E5%8A%A8%E5%88%86%E8%A7%A3%E6%97%B6%E7%9A%84%E5%BC%B9%E7%AA%97%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/424958/%E5%8E%BB%E9%99%A4CODOL%E6%89%93%E9%9D%B6%E6%B4%BB%E5%8A%A8%E5%88%86%E8%A7%A3%E6%97%B6%E7%9A%84%E5%BC%B9%E7%AA%97%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==


(function() {
    // 设置暂存箱展示状态
    show0 = false
    // 覆盖点击分解的执行函数, 去除弹窗警告的步骤
    doUserDes = function(id, iPackageId, packageName, iPackageGroupId) {
        amsCfg_749357.sData["tmpSeqId"] = id;
        amsCfg_749357.sData["tmpPackageId"] = iPackageId;
        amsSubmit(368101, 749357);
    };
    // init提示
    alert("初始化成功!")
    // 为暂存箱按钮添加打开/关闭状态
    var s = function(){
        // 点击暂存箱时将状态设置为true
        c = document.getElementsByClassName("btn-store sp t")[0]
        document.getElementsByClassName("btn-store sp t")[0].href="javascript:amsSubmit(368101,749351);show0=true;"
        // 点击X号时设置为false
        document.getElementsByClassName("close sp")[0].href="javascript:closeDialog();show0=false;"
        document.getElementsByClassName("close sp")[1].href="javascript:closeDialog();show0=false;"
        document.getElementsByClassName("close sp")[2].href="javascript:closeDialog();show0=false;"
        document.getElementsByClassName("close sp")[3].href="javascript:closeDialog();show0=false;"
        document.getElementsByClassName("close sp")[4].href="javascript:closeDialog();show0=false;"
        document.getElementsByClassName("close sp")[5].href="javascript:closeDialog();show0=false;"
    };
    s();

    // 检测回调弹窗
    var closeAlert = function () {
        // 如果暂存箱打开则重新显示暂存箱
        var ui0 = document.getElementById("showMyGiftContent_749351");
        if (show0==true){
            // 打开了暂存箱
            // 去除分解了XX积分样式的显示
            var ui1 =document.getElementById("lotteryAlertDialog");
            if (ui1){
                ui1.style.display="none";
            }
            // 去除全局蒙层
            var ui2 =document.getElementById("_overlay_");
            if (ui2){
                ui2.style.display="none";
            }
            // 如果暂存箱应该是打开而没有打开则重新显示暂存箱
            if (ui0.style.display=="none"){
                document.getElementsByClassName("btn-store sp t")[0].click()
            }
        }
    };
    // 启动检测弹窗的循环, 200ms执行一次
    window.setInterval(closeAlert, 200);

})();