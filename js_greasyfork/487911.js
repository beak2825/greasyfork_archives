// ==UserScript==
// @name         YYSHelper
// @name:zh-CN   云原神签到助手
// @namespace    http://tampermonkey.net/
// @version      0.3.7
// @description  云原神签到助手，向着星辰与深渊
// @author       浪速之星
// @match        *://*/*
// @icon         data:image/gif;base64,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
// @homepageURL  https://greasyfork.org/zh-CN/scripts/487911-%E4%BA%91%E5%8E%9F%E7%A5%9E%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/487911/YYSHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/487911/YYSHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 请自行修改token，获取教程：https://gitee.com/z2322739526/yyshelper/blob/master/token%E6%95%99%E7%A8%8B.png
    var yystoken = "";
    // 脚本执行间隔xx分钟
    var dotime = 240; // 请求间隔
    var checktime = 10; // 循环检查间隔，-1表示不检查
    // 云原神签到api
    var yysurl = "https://api-cloudgame.mihoyo.com/hk4e_cg_cn/wallet/wallet/get";
    // 样式添加
    const style = `<style>
    .get{
        position:fixed;
        right:80px;
        bottom:150px;
        background-color:#00a1d6;
        color:white;
        height:50px;
        width:50px;
        border-radius: 10px;
        font-size:15px;
        border:solid 3px #FA5A57;
        cursor:pointer;
        outline: none;
        z-index: 9999;
    }
    .get:hover {
        background-color:#33b4de;
    }
    .help{
        position:fixed;
        right:80px;
        bottom:80px;
        background-color:#00a1d6;
        color:white;
        height:50px;
        width:50px;
        border-radius: 10px;
        font-size:15px;
        border:solid 3px #FA5A57;
        cursor:pointer;
        outline: none;
        z-index: 9999;
    }
    .help:hover {
        background-color:#33b4de;
    }
    .alertMessage{
        position: fixed;
		top: 30px;
		left: 40%;
		right: 40%;
		padding: 20px 30px;
		background: rgba(0, 0, 0, 0.8);
		color: #ffffff;
		font-size: 20px;
		text-align: center;
		z-index: 9999;
		display: none;
        border-radius:5px;
        white-space: pre-wrap;
    }
    </style>`;
    let div = document.createElement("div");
    div.innerHTML += style;
    document.body.append(div);
    // 提示框
    var alertMessage = document.createElement("div");
    alertMessage.classList.add('alertMessage');
    document.body.append(alertMessage);
    function alertmess(mess) {
		alertMessage.innerHTML = mess; // 填入要显示的文字
		alertMessage.style.display = "inline"; // 显示弹框
		setTimeout(function () { // 倒计时
			alertMessage.innerHTML = ''; // 清空文本
			alertMessage.style.display = "none" // 隐藏弹框
		}, 8 * 1000); // 8秒
	}
    function timestampToTime(timestamp) {
        // 时间戳为10位需*1000，时间戳为13位不需乘1000
        var date = new Date(timestamp);
        // var Y = date.getFullYear() + "-";
        // var M =(date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
        // var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
        var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours())+ ":";
        var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())+ ":";
        var s = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
        // return Y + M + D + h + m + s;
        return h + m + s;
    }
    function yysget(){
        yystoken = GM_getValue('yystoken');
        const lastExecutionTime = GM_getValue('myScriptLastExecution');
        GM_xmlhttpRequest({
            url:yysurl,
            method:"get",
            Referer: "https://ys.mihoyo.com/",
            headers:{
                // X-Rpc-Combo_token必须
                "X-Rpc-Combo_token":yystoken,
            },
            onload:function(xhr){
                var data = JSON.parse(xhr.response);
                console.log(data);
                if(data.message == "OK"){
                    console.log("云原神签到成功");
                    console.log("赠送时长：" + data.data.free_time.send_freetime + "分钟");
                    console.log("免费时长：" + data.data.free_time.free_time + "分钟");
                    console.log("免费时长：" + parseInt(data.data.free_time.free_time/60) + "小时" + data.data.free_time.free_time%60 + "分钟");
                    alertmess("云原神签到成功\n赠送时长：" + data.data.free_time.send_freetime + "分钟\n免费时长：" + parseInt(data.data.free_time.free_time/60) + "小时" + data.data.free_time.free_time%60 + "分钟\n上次检查时间：" + timestampToTime(lastExecutionTime))
                } else {
                    console.log("云原神签到失败（秘钥过期）");
                    if(!window.location.href.includes('ys.mihoyo.com/cloud')){
                        var t1 = confirm("云原神签到失败（秘钥过期）\n请点击确认跳转，手动登录更新秘钥");
                        if(t1 == true){
                            window.open('https://ys.mihoyo.com/cloud/#/', '_self');
                        }
                    } else {
                        alertmess("云原神签到失败（秘钥过期）\n请点击获取教程\n参考教程更新秘钥后重试");
                    }
                }
            }
        })
        // 脚本成功执行后，更新执行时间
        GM_setValue('myScriptLastExecution', new Date().getTime());
    }
    function main(){
        console.log("-------- 云原神签到助手 by 浪速之星 --------");
        // 检查上次执行的时间
        const lastExecutionTime = GM_getValue('myScriptLastExecution');
        yystoken = GM_getValue('yystoken');
        console.log("当前秘钥：" + yystoken);
        const now = new Date().getTime(); // 当前时间的时间戳
        // console.log("上次检查时间：" + timestampToTime(lastExecutionTime));
        // 如果上次执行的时间在XX分钟之内
        if (lastExecutionTime && now - lastExecutionTime < dotime * 60 * 1000) {
            console.log("上次检查时间：" + timestampToTime(lastExecutionTime));
            console.log("当前时间：" + timestampToTime(now));
            console.log("云原神签到助手在"+ dotime + "分钟内已执行过，不再重复执行。");
        } else {
            yysget()
        }
    }
    // main
    // 云原神页面添加按钮
    if(window.location.href.includes('ys.mihoyo.com/cloud')){
        // 点击输入token
        var get = document.createElement("input");
        get.setAttribute("type", "button");
        get.setAttribute("title", "右键隐藏");
        get.setAttribute("value", "更新\n秘钥");
        get.classList.add('get');
        document.body.append(get);
        get.onclick = function(){
            yystoken = prompt('请输入您的云原神秘钥（X-Rpc-Combo_token）：');
            if(yystoken){
                GM_setValue('yystoken', yystoken);
                alertmess("更新秘钥成功：\n" + yystoken);
            }
        }
        // 跳转获取秘钥教程
        var help = document.createElement("input");
        help.setAttribute("type", "button");
        help.setAttribute("title", "右键隐藏");
        help.setAttribute("value", "获取\n教程");
        help.classList.add('help');
        document.body.append(help);
        help.onclick = function(){
            window.open('https://gitee.com/z2322739526/yyshelper/blob/master/token%E6%95%99%E7%A8%8B.png', '_blank');
        }
        // 强制执行一次，检查秘钥是否可用
        yysget();
        // 右键隐藏按钮
        get.addEventListener("contextmenu", function() {
            get.style.display = "none";
            help.style.display = "none";
        });
        help.addEventListener("contextmenu", function() {
            get.style.display = "none";
            help.style.display = "none";
        });
    }
    main();
    // 每隔XX分钟再循环检查一次
    if(!(checktime == -1)){
        setInterval(main, checktime * 60 * 1000);
    }
})();