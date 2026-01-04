// ==UserScript==
// @name         支付宝达人管理
// @namespace    http://tampermonkey.net/
// @version      1.8.2
// @description  达人管理数据绑定
// @author       xgm
// @match        https://p.alipay.com/page/content-mcn/talent/list*
// @match        https://p.alipay.com/page/content-mcn/content/list*
// @match        https://p.alipay.com/page/pc-life-config/creationReward*
// @match        https://p.alipay.com/page/pc-life-config/activity-bill*
// @match        https://p.alipay.com/workspace/mcn/content*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      End-User License Agreement
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/499652/%E6%94%AF%E4%BB%98%E5%AE%9D%E8%BE%BE%E4%BA%BA%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/499652/%E6%94%AF%E4%BB%98%E5%AE%9D%E8%BE%BE%E4%BA%BA%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

// https://p.alipay.com/page/content-mcn/talent/list*

(function() {
    'use strict';

    // 自定义css
    let div_css = `
        *{
            margin: 0;
            padding: 0;
        }
        .loginBox{
            min-width: 330px;
            padding: 30px 30px;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            top: 50%;
            left: 5%;
            transform: translateY(-50%);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 999;
            font-size: initial;
        }
        .login-title{
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 3px;
        }
        .login-tel{
            margin: 20px 0 10px;
        }
        .login-tel,.login-pwd{
            display: flex;
            align-items: center;
        }
        .login-tel span,.login-pwd span{
            width: 70px;
            font-size: 16px;
            text-align: right;
        }
        .login-tel input,.login-pwd input{
            width: 200px;
            height: 30px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 6px;
            border: 1px solid #aaa;
        }
        .login-btn{
            margin-top: 20px;
            text-align: center;
        }
        .login-btn button{
            width: 150px;
            height: 35px;
            background-color: #0096DB;
            color: #fff;
            border: 0;
            border-radius: 6px;
            cursor: pointer;
        }
        .logo{
            width: 80px;
            position: absolute;
            top: 10px;
            left: 10px;
        }
        .logo img{
            width: 100%;
        }
        .operate{
            width: 400px;
            padding: 15px 20px;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            right: 15%;
            top: 50%;
            transform: translateY(-50%);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 998;
            color: #333;
            display: none;
            box-sizing: initial;
        }
        .operate-toggle,.login-toggle{
            position: absolute;
            right: 15px;
            top: 2px;
            cursor: pointer;
        }
        .operate-toggle svg,.login-toggle svg{
            width: 40px;
            height: 40px;
        }
        .operate-name{
            width: 230px;
            font-size: 16px;
            margin-bottom: 15px;
        }
        .operate-quit{
            position: absolute;
            right: 60px;
            top: 8px;
        }
        .operate-quit a{
            display: block;
            padding: 5px 10px;
            border-radius: 6px;
            background-color: #1890ff;
            color: #fff;
            font-size: 14px;
            text-decoration: none;
        }
        .info-name{
            font-size: 20px;
            font-weight: bold;
        }
        #copy{
            word-break : break-all;
            margin-left: 0;
        }
        .info-name p{
            display: inline-block;
            font-size: 16px;
            font-weight: normal;
            margin-left: 15px;
        }
        .info-name div{
            font-size: 16px;
            font-weight: normal;
            margin-top: 10px;
        }
        .info-name span{
            margin-left: 15px;
            font-size: 16px;
            font-weight: normal;
            cursor: pointer;
        }
        .info-data{
            margin-top: 15px;
        }
        .info-data>div{
            word-break: break-all;
            font-size: 16px;
            margin-bottom: 5px;
            min-height: 32px;
            line-height: 32px;
        }
        .info-data>div span{
            display: inline-block;
            vertical-align: top;
        }
        .cy-tool{
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #ccc;
        }
        svg{
            width: 32px;
            height: 32px;
        }
        .windowH{
            max-height: 400px;
            overflow-y: auto;
        }
        /*定义滚动条高宽及背景
         高宽分别对应横竖滚动条的尺寸*/
        .windowH::-webkit-scrollbar
        {
            width:10px;
            height:10px;
            background-color:#F5F5F5;
        }
        /*定义滚动条轨道
         内阴影+圆角*/
        .windowH::-webkit-scrollbar-track
        {
            -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,0.3);
            // border-radius:10px;
            background-color:#F5F5F5;
        }
        /*定义滑块
         内阴影+圆角*/
        .windowH::-webkit-scrollbar-thumb
        {
            border-radius:10px;
            -webkit-box-shadow:inset 0 0 6px rgba(0,0,0,.3);
            background-color:#555;
        }
        .data-btn{
            margin-top: 30px;
            text-align: center;
        }
        .btnNormal{
            padding: 7px 20px;
            background-color: #1890ff;
            font-size: 14px;
            border-radius: 3px;
            color: #fff;
            cursor: pointer;
            border: 0;
/*             margin-right: 20px; */
            margin-bottom: 10px;
        }
        .btnHide{
            display: none;
        }
        .loading{
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,0.7);
            z-index: 9999;
            display: none;
        }
        .loading svg{
            width: 300px;
            height: 300px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -150px;
            margin-top: -150px;
        }
        .loading svg text{
            font-size: 2px;
        }
        .msg{
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px;
            background-color: #fff;
            border-radius: 10px;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            display: none;
        }
        .showBtn{
            margin-left: 10px;
            cursor: pointer;
        }
        .dateTxt{
            width: 150px;
            padding: 3px 6px;
            font-size: 14px;
            margin-bottom: 15px;
        }
    `
    // 引用自定义css
    GM_addStyle(div_css);

    let div = `
        <div class="loginBox">
            <div class="logo">
                <img src="https://www.cyek.com/img/logo-scroll.svg" alt="">
            </div>
            <div class="login-toggle" data-bind="1"><svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg></div>
            <div class="cylogin-box">
                <div class="login-title">登录</div>
                <div class="login-tel">
                    <span>手机号：</span>
                    <input type="tel" placeholder="请输入你的手机号" name="phone" id="cyphoneNum" autocomplete="off" tabindex="1" />
                </div>
                <div class="login-pwd">
                    <span>密码：</span>
                    <input type="password" placeholder="请输入密码" name="pwd" id="cypwd" autocomplete="off" tabindex="2" />
                </div>
                <div class="login-btn">
                    <button>登录</button>
                </div>
            </div>
            <div class="cy-tool">灿耀易客浏览器工具</div>
        </div>
        <div class="operate">
            <div class="operate-quit">
                <a href="javascript:;">退出登录</a>
            </div>
            <div class="operate-toggle" data-bind="1"><svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg></div>
            <div class="operate-box">
                <div class="operate-name"></div>
                <div class="operate-info">
                    <div class="info-name"></div>
                    <div class="info-data">
                        <div class="data-btn">
                            <div>
                                <input class="dateTxt btnHide" id="contentStart" placeholder="内容管理开始日期" />
                                <input class="dateTxt btnHide" id="contentEnd" placeholder="内容管理结束日期" />
                            </div>
                            <button class="btnNormal" id="invite">发邀请</button>
                            <button class="btnNormal" id="synchronize1">拿邀请结果</button>
                            <button class="btnNormal btnHide" id="synchronize2">解绑中</button>
                            <button class="btnNormal btnHide" id="synchronize3">已解绑</button>
                            <button class="btnNormal btnHide" id="searchBind">查绑定</button>
                            <button class="btnNormal btnHide" id="crawlBind">抓解绑中</button>
                            <button class="btnNormal btnHide" id="contentManagement">内容管理</button>
                            <button class="btnNormal btnHide" id="contentManagementDay">内容管理优质达人</button>
                            <button class="btnNormal btnHide" id="expertsPost">分成计划达人发文</button>
                            <button class="btnNormal btnHide" id="unopend">分成计划待开通</button>
                            <button class="btnNormal btnHide" id="opend">分成计划已开通</button>
                            <button class="btnNormal btnHide" id="bill">活动账单</button>
                            <button class="btnNormal btnHide" id="analysis">内容分析</button>
                            <button class="btnNormal btnHide" id="bindStar">已绑定达人信息</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cy-tool">灿耀易客浏览器工具</div>
        </div>
        <div class="loading">
            <svg
            version="1.1"
            id="dc-spinner"
            xmlns="http://www.w3.org/2000/svg"
            x="0px" y="0px"
            width:"38"
            height:"38"
            viewBox="0 0 38 38"
            preserveAspectRatio="xMinYMin meet"
            >
            <text x="7" y="21" font-family="Monaco" font-size="2px" style="letter-spacing:0.6" fill="#fff">任务执行中，请勿关闭
            <animate
                attributeName="opacity"
                values="0;1;0" dur="1.8s"
                repeatCount="indefinite"/>
            </text>
            <path fill="#373a42" d="M20,35c-8.271,0-15-6.729-15-15S11.729,5,20,5s15,6.729,15,15S28.271,35,20,35z M20,5.203
            C11.841,5.203,5.203,11.841,5.203,20c0,8.159,6.638,14.797,14.797,14.797S34.797,28.159,34.797,20
            C34.797,11.841,28.159,5.203,20,5.203z">
            </path>
            <path fill="#373a42" d="M20,33.125c-7.237,0-13.125-5.888-13.125-13.125S12.763,6.875,20,6.875S33.125,12.763,33.125,20
            S27.237,33.125,20,33.125z M20,7.078C12.875,7.078,7.078,12.875,7.078,20c0,7.125,5.797,12.922,12.922,12.922
            S32.922,27.125,32.922,20C32.922,12.875,27.125,7.078,20,7.078z">
            </path>
            <path fill="#2AA198" stroke="#2AA198" stroke-width="0.6027" stroke-miterlimit="10" d="M5.203,20
                    c0-8.159,6.638-14.797,14.797-14.797V5C11.729,5,5,11.729,5,20s6.729,15,15,15v-0.203C11.841,34.797,5.203,28.159,5.203,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                calcMode="spline"
                keySplines="0.4, 0, 0.2, 1"
                keyTimes="0;1"
                dur="2s" repeatCount="indefinite" />
            </path>
            <path fill="#859900" stroke="#859900" stroke-width="0.2027" stroke-miterlimit="10" d="M7.078,20
            c0-7.125,5.797-12.922,12.922-12.922V6.875C12.763,6.875,6.875,12.763,6.875,20S12.763,33.125,20,33.125v-0.203
            C12.875,32.922,7.078,27.125,7.078,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur="1.8s"
                repeatCount="indefinite" />
            </path>
            </svg>
        </div>
        <div class="msg">返回显示数据</div>;
    `

    $("body").prepend(div);


    // apiHost
    // var apiHost = "https://api.test.cyek.com/";
    var apiHost = "https://api.oa.cyek.com/";

    // 版本号
    var version = "1.8.1";
    $(".cy-tool").text("灿耀易客运营工具"+version);

    let showBtn = `<span class="showBtn">+</span>`
    $(".cy-tool").append(showBtn)

    let flagBtn = 0;
    $(".cy-tool").on("click","span",function(){
        if(flagBtn == 0){
            $(".btnHide").fadeIn()
            flagBtn = 1;
        }else{
            $(".btnHide").fadeOut()
            flagBtn = 0
        }
    })

    // 手机号验证
    function checkphone(){
        var phone = $("#cyphoneNum").val().trim();
        // console.log(phone)
        var phoneReg = /^[1][0-9]{10}$/;
        if(phone){
            return true;
        }else{
            alert("请输入正确的手机号")
            return false;
        }
        return phone;
    }
    // 密码不能为空
    function checkpwd(){
        var pwd = $("#cypwd").val();
        if(pwd !== ""){
            return true;
        }else{
            alert("密码不能为空")
            return false;
        }
    }


    // msg 显示  3s后消失
    function msgHide(text){
        $(".msg").text(text);
        $(".msg").fadeIn();
        var msgTime = 3;
        var msgTimer = setInterval(function(){
            msgTime--;
            if(msgTime === 0){
                clearInterval(msgTimer);
                $(".msg").stop().fadeOut(400);
            }
        },1000)
    }

    // 判断屏幕可视高度
    let windowH = unsafeWindow.innerHeight;
    console.log(windowH)
    if(windowH < 870){
        $(".operate").addClass("windowH")
    }

    // 获取当前页面地址
    let rex = window.location.href;



    // 获取local存储信息
    var token = localStorage.getItem("token");
    var storagePhone = localStorage.getItem("storagePhone");
    var storagePwd = localStorage.getItem("storagePwd");
    var dep_name = localStorage.getItem("dep_name");
    var staffName = localStorage.getItem("name");

    // 简介信息渲染
    $(".operate-name").text("欢迎你，"+dep_name+"-"+staffName);





    //  md5 方法
    function md5(string) {
        function md5_RotateLeft(lValue, iShiftBits) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function md5_AddUnsigned(lX, lY) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function md5_F(x, y, z) {
            return (x & y) | ((~x) & z);
        }

        function md5_G(x, y, z) {
            return (x & z) | (y & (~z));
        }

        function md5_H(x, y, z) {
            return (x ^ y ^ z);
        }

        function md5_I(x, y, z) {
            return (y ^ (x | (~z)));
        }

        function md5_FF(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };

        function md5_GG(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };

        function md5_HH(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };

        function md5_II(a, b, c, d, x, s, ac) {
            a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
            return md5_AddUnsigned(md5_RotateLeft(a, s), b);
        };

        function md5_ConvertToWordArray(string) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function md5_WordToHex(lValue) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        function md5_Utf8Encode(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
        string = md5_Utf8Encode(string);
        x = md5_ConvertToWordArray(string);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = md5_AddUnsigned(a, AA);
            b = md5_AddUnsigned(b, BB);
            c = md5_AddUnsigned(c, CC);
            d = md5_AddUnsigned(d, DD);
        }
        return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
    }




    // 定义数组来接收数据
    let videoData = [];

    // const getCookie = (key) => {
    //     const { cookie } = document;
    //     return cookie.match(new RegExp(`${key}=(?<key>\\w+)`))?.groups?.key;
    // };

    // 获取cookie中的ctoken
    function getCookie(name){
        //可以搜索RegExp和match进行学习
        var arr,reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }
    // console.log(getCookie('ctoken'))


    // 支付宝接口封装
    // loginFailIsError  登录失败后是否按异常处置
    function reqAli(loginFailIsError = false, url, successFun, failFun, errorFun, rerunFun){
        $.ajax({
            type: "get",
            url: url,
            crossDomain:true,
            xhrFields: {
                withCredentials: true // 这里设置了withCredentials
            },
            success: function (res) {
                if (res.stat != "ok"){
                    if(res.stat == "failed"){

                        log("请求failed 重跑当前页数")
                        rerunFun()

                        if (loginFailIsError) {
                            errorFun()
                        } else {
                            // log("登录失效")
                            // sendError(0) 报警
                            return false
                        }
                    }else if(res.stat == "deny"){
                        $('.loading svg text').css('fill','#ff0000')
                        $('.loading svg text').text('登录掉线了，刷新吧兄弟')

                        if (loginFailIsError) {
                            errorFun("deny")
                        } else {
                            log("登录失效 deny")
                            return false
                        }
                    } else {
                        if (typeof(failFun) == "function") {
                            failFun(res)
                        } else {
                            log("请求失败" + res.stat)
                            return false
                        }
                    }
                } else {
                    if(res.result == null){
                        log("返回值为null 重跑当前页数")
                        rerunFun()
                    }
                    successFun(res)
                }
            },
            error: function(e){
                log(e.statusText)

                if (typeof(errorFun) == "function") {
                    errorFun()
                } else {
                    return false
                }
            }
        })
    }

    // console.log 封装
    function log(msg){
        console.log(new Date() + msg)
    }

    let pNum = 1
    $("#searchBind").click(function(){

        getSearchId()

    })


    function getSearchId(){
        let searchArr = []
        let token = localStorage.getItem("token");
        $(".loading").show()
        reqAli(
            false,
            "https://contentweb.alipay.com/life/mcn/p/queryInvitationList.json?_reqFromMicro_&ctoken="+ getCookie('ctoken') +"&status=1&pageNum="+ pNum +"&pageSize=20&bizTypes=MCN_DAREN_BIND&bizTypes=MCN_DAREN_AGENCY",

            function (res) {
                let total = Math.ceil(res.result.total/20)

                console.log("当前进度-查绑定-"+pNum+"/"+total)

                // console.log(res)
                for(let key in res.result.invitationVos){
                    let starData = {};
                    starData.inviteedId = res.result.invitationVos[key].inviteedId
                    starData.inviteedName = res.result.invitationVos[key].inviteedName
                    starData.startTime = res.result.invitationVos[key].startTime
                    searchArr.push(starData)
                }
                // console.log(searchArr)

                $.ajax({
                    type: "post",
                    url: apiHost + "/spider/browser/alipayInvitedData",
                    data: {
                        app_id: "1",
                        app_type: "tools_alipay",
                        access_token: token,
                        om_account_id: localStorage.getItem("orgId"),
                        data: searchArr
                    },
                    success: function(res){
                        // console.log(res)
                        if(res.code == 1000){
                            if(pNum < total){
                                pNum++
                                getSearchId()
                            }else{
                                $(".loading").hide()
                            }
                        }else if(res.code == 1002){
                            log(res.message)
                            localStorage.removeItem("token");
                            localStorage.removeItem("storagePhone");
                            localStorage.removeItem("storagePwd");
                            localStorage.removeItem("dep_name");
                            localStorage.removeItem("staffName");
                            $(".operate").hide();
                            $(".loginBox").show();
                        }else{
                            // 显示提示信息
                            log(res.message)
                        }
                    },
                    error: function(fail){

                    }
                })
            },
            function(){},
            function(){},
            getSearchId
        )
    }
    //获取已绑定
    let bNum = 1
    $("#bindStar").click(function(){
        getBindStar()
    })
    function getBindStar(){
        let searchArr = []
        let token = localStorage.getItem("token");
        $(".loading").show()
        reqAli(
            false,
            "https://contentweb.alipay.com/life/mcn/p/queryInvitationList.json?ctoken="+ getCookie('ctoken') +"&status=1&pageNum="+ bNum +"&pageSize=20&bizTypes=MCN_DAREN_BIND&bizTypes=MCN_DAREN_AGENCY",

            function (res) {
                let total = Math.ceil(res.result.total/20)
                console.log("当前进度-抓取已绑定达人/"+bNum+"/"+total)
                // console.log(res)
                // for(let key in res.result.invitationVos){
                //     let starData = {};
                //     starData.inviteedId = res.result.invitationVos[key].inviteedId
                //     starData.inviteedName = res.result.invitationVos[key].inviteedName
                //     starData.startTime = res.result.invitationVos[key].startTime
                //     searchArr.push(starData)
                // }
                // console.log(searchArr)

                searchArr = res.result.invitationVos
                console.log(searchArr,'searchArr')
                $.ajax({
                    type: "post",
                    url:  apiHost + "/spider/browser/alipayInvitedInfo",
                    data: {
                        app_id: "1",
                        app_type: "tools_alipay",
                        access_token: token,
                        om_account_id: localStorage.getItem("orgId"),
                        data: searchArr
                    },
                    success: function(res){
                         console.log(res,'res')
                        if(res.code == 1000){
                            if(bNum < total){
                                bNum++
                                getBindStar()
                            }else{
                                $(".loading").hide()
                            }
                        }else if(res.code == 1002){
                            log(res.message)
                            localStorage.removeItem("token");
                            localStorage.removeItem("storagePhone");
                            localStorage.removeItem("storagePwd");
                            localStorage.removeItem("dep_name");
                            localStorage.removeItem("staffName");
                            $(".operate").hide();
                            $(".loginBox").show();
                        }else{
                            // 显示提示信息
                            log(res.message)
                        }
                    },
                    error: function(fail){

                    }
                })
            },
            function(){},
            function(){},
            getBindStar
        )
    }
    let crawlNum = 1
    $("#crawlBind").click(function(){

        crawlSearchId()

    })


    function crawlSearchId(){
        let searchArr = []
        let token = localStorage.getItem("token");
        $(".loading").show()
        reqAli(
            false,
            "https://contentweb.alipay.com/life/mcn/p/queryInvitationList.json?ctoken="+ getCookie('ctoken') +"&status=2&pageNum="+ crawlNum +"&pageSize=20&bizTypes=MCN_DAREN_BIND&bizTypes=MCN_DAREN_AGENCY",

            function (res) {
                let total = Math.ceil(res.result.total/20)

                console.log("当前进度-抓取解绑中达人-"+crawlNum+"/"+total)

                // console.log(res)
                // for(let key in res.result.invitationVos){
                //     let starData = {};
                //     starData.inviteedId = res.result.invitationVos[key].inviteedId
                //     starData.inviteedName = res.result.invitationVos[key].inviteedName
                //     starData.startTime = res.result.invitationVos[key].startTime
                //     searchArr.push(starData)
                // }
                // console.log(searchArr)

                searchArr = res.result.invitationVos

                $.ajax({
                    type: "post",
                    url: "https://spider.oa.cyek.com/imp/syncAli",
                    data: {
                        // app_id: "1",
                        // app_type: "tools_alipay",
                        // access_token: token,
                        // om_account_id: localStorage.getItem("orgId"),
                        data: searchArr
                    },
                    success: function(res){
                        // console.log(res)
                        if(res.code == 1000){
                            if(crawlNum < total){
                                crawlNum++
                                crawlSearchId()
                            }else{
                                $(".loading").hide()
                            }
                        }else if(res.code == 1002){
                            log(res.message)
                            localStorage.removeItem("token");
                            localStorage.removeItem("storagePhone");
                            localStorage.removeItem("storagePwd");
                            localStorage.removeItem("dep_name");
                            localStorage.removeItem("staffName");
                            $(".operate").hide();
                            $(".loginBox").show();
                        }else{
                            // 显示提示信息
                            log(res.message)
                        }
                    },
                    error: function(fail){

                    }
                })
            },
            function(){},
            function(){},
            getSearchId
        )
    }



    $("#invite").click(function(){

        $(".loading").show()
        $('.loading svg text').text('发邀请执行，请勿关闭')
         // 重复跑邀约达人
        setInterval(function(){
            invite()
        },10000)


        $("#invite").css("pointer-events","none")
    })


    // 邀约达人
    function invite(){
        let token = localStorage.getItem("token");
        let publicId;


        $.ajax({
            type: "post",
            url: apiHost + "/spider/browser/alipayGain",
            data: {
                app_id: "1",
                app_type: "tools_alipay",
                access_token: token,
                om_account_id: localStorage.getItem("orgId")
            },
            async: false,
            success: function (res) {
                if(res.code == 1000){
                    if(res.result != ""){
                        publicId = res.result

                         // log("正在检测" + publicId)

                        let errorCode = ["请输入正确的生活号+ID","该生活号+状态异常，无法添加","该生活号未升级为生活号+","请填写个人类型生活号+","请填写企业/机构类型的生活号+","该生活号+已被邀约，请联系达人解绑或者拒绝后再操作"]

                        reqAli(
                            true,
                            "https://contentweb.alipay.com/life/mcn/p/autoCompleteAppInfo.json?_reqFromMicro_&ctoken="+ getCookie('ctoken') +"&inviteType=MCN_DAREN_BIND&publicId="+ publicId,

                            function (res) {
                                let errorMessage = ""
                                $('.loading svg text').css('fill','#ffffff')
                                $('.loading svg text').text('发邀请执行，请勿关闭')
                                if(res.result.tipCode != ""){
                                    if(parseInt(res.result.tipCode) < 7){
                                        errorMessage = errorCode[parseInt(res.result.tipCode) - 1]
                                        sendFail(publicId,errorMessage)
                                    }else{
                                        errorMessage = "该生活号+无法邀请"
                                        sendFail(publicId,errorMessage)
                                    }
                                } else {
                                    getInvite(publicId,res.result.publicName)
                                }
                            },
                            function(res){
                                sendError(publicId)
                            },
                            function(status){
                                log("status",status)
                                if(status == "deny"){
                                    sendError(publicId,"deny")
                                }else{
                                    sendError(publicId)
                                }
                            }
                        )
                    }else{
                        // alert("返回数据为空")
                        return false
                    }
                }else if(res.code == 1002){
                    log(res.message)
                    localStorage.removeItem("token");
                    localStorage.removeItem("storagePhone");
                    localStorage.removeItem("storagePwd");
                    localStorage.removeItem("dep_name");
                    localStorage.removeItem("staffName");
                    $(".operate").hide();
                    $(".loginBox").show();
                }else{
                    // 显示提示信息
                    log(res.message)
                }
            }
        })
    }

    // 支付宝邀约达人发送邀请
    function getInvite(publicId,publicName){
        let year = new Date().getFullYear()+1
        let month = new Date().getMonth()+1
        let day = new Date(new Date().getTime()-24*60*60*1000).getDate()

        if(new Date(new Date().getTime()).getDate() == 1){
            month--
        }

        let time = year + "-" + month + "-" + day
        let inviteData = {
            _reqFromMicro_: "",
            ctoken: getCookie('ctoken'),
            inviteType: "MCN_DAREN_BIND",
            publicId: publicId,
            publicName: publicName,
            effectEndDate: time
        }

        $.ajax({
            type: "get",
            url: "https://contentweb.alipay.com/life/mcn/p/invitationCreate.json",
            data: inviteData,
            crossDomain:true,
            xhrFields: {
                withCredentials: true // 这里设置了withCredentials
            },
            success: function (res) {
                if(res.stat == "ok"){
                    sendSuccess(res.inviteCreateRequest.publicId)
                }else{
                    sendFail(res.inviteCreateRequest.publicId,res.errorMessage)
                }
            },
            error: function(fail){
                log(fail.statusText)
            }
        })
    }




    // 同步数据
    $("#synchronize1").click(function(){
        //         // 当前状态
        //         let code = $(".ant-tabs-tab.ant-tabs-tab-active div").attr("id").split("-")
        //         let status = code[code.length - 1]
        //         console.log(status)

        //         // 请求数据当前页
        //         let pageNum;
        //         let thisTotal = Math.ceil(parseInt($("#rc-tabs-0-tab-"+status).text().split(" ")[1])/20)
        //         console.log(11111111,thisTotal)
        //         if((status == localStorage.getItem("status") && localStorage.getItem("pageNum") < thisTotal)){
        //             pageNum = localStorage.getItem("pageNum")
        //         }else{
        //             pageNum = 1
        //         }


        //         getVideoInfo(status,pageNum);

        $(".loading").show()
        $('.loading svg text').text("获取结果中，请勿关闭")
        getUserId(1)

    })

    // 同步数据
    $("#synchronize2").click(function(){

        getUserId(2)
        $(".loading").show()
        // start(2)

    })

    // 同步数据
    $("#synchronize3").click(function(){

        getUserId(3)
        $(".loading").show()
        // start(3)
    })


    var s = 0

    var h_arr = [11, 17, 3];

    function start(start){
        setInterval(() => {
            var h = new Date().getHours()
            if((h_arr.indexOf(h) != -1) && (s == 0 || h != s)) {
                if(start == 2){
                    getUserId(2)
                    getUserId(3)
                }else{
                    getUserId(3)
                    getUserId(2)
                }
                s = h
            }
            log("100秒循坏等待中")
        }, 100000)
    }

    function sleep(ms) {
        return new Promise(resolve =>setTimeout(resolve, ms))
    }

    // 获取查询账号id
    function getUserId(type){
        log('开始检测列表数据')
        if(type != 1){
            $('.loading svg text').text("解绑判断中，请勿关闭")
        }

        let token = localStorage.getItem("token");
        let userData = {
            app_id: "1",
            app_type: "tools_alipay",
            access_token: token,
            type: type,
            om_account_id: localStorage.getItem("orgId")
        }

        $.ajax({
            type: "post",
            url: apiHost + "/spider/browser/alipayWaitResult",
            data: userData,
            success: function (res) {
                // console.log(res)
                if(res.code == 1000){
                    var total = res.result.total
                    async function asyncFun(){
                        var i = 1;


                        for(let key = 0; key < res.result.data.length; key++){
                            let aa = null
                            // log('进度' + i + '/' + total)
                            if(type == 1){
                                console.log("当前进度-拿邀请结果-"+i+"/"+total)
                            }else if(type == 2){
                                console.log("当前进度-解绑中-"+i+"/"+total)
                            }else{
                                console.log("当前进度-已解绑-"+i+"/"+total)
                            }

                            await sleep(2000)
                            log('2--' + res.result.data[key])
                            searchStatus(res.result.data[key],type)

                            log('6--' + res.result.data[key])


                            //                             await new Promise(function(reslove,reject){
                            //                                 if(aa){
                            //                                     clearTimeout(aa)
                            //                                 }
                            //                                 aa = setTimeout(function(){
                            //                                    searchStatus(res.result.data[key],type)
                            //                                     reslove()
                            //                                 },1000)
                            //                             })
                            i++
                        }

                        if(type == 1) {
                              setTimeout(function(){
                                  getUserId(1)
                              },60000)
                        } else if (type == 3){
                            return false
                        } else {
                            $(".loading").hide()
                        }
                    }
                    asyncFun()
                }else if(res.code == 1002){
                    log(res.message)
                    console.log(res.message);
                    localStorage.removeItem("token");
                    localStorage.removeItem("storagePhone");
                    localStorage.removeItem("storagePwd");
                    localStorage.removeItem("dep_name");
                    localStorage.removeItem("staffName");
                    $(".operate").hide();
                    $(".loginBox").show();
                    $(".loading").hide()
                }else{
                    // 显示提示信息
                    log(res.message)
                    $(".loading").hide()

                    if(type == 1) {
                        setTimeout(function(){
                            getUserId(1)
                        },60000)
                    }
                }
            },
            error: function(fail){
                log(fail.statusText)
                $(".loading").hide()
                if(type == 1) {
                    setTimeout(function(){
                        getUserId(1)
                    },60000)
                }
            }
        })
    }


    // 支付宝接口状态值查询
    function searchStatus(id, type){
         log('3--'+id)
        reqAli(
            false,
            "https://contentweb.alipay.com/life/mcn/p/queryInvitationCount.json?_reqFromMicro_&ctoken="+ getCookie('ctoken') +"&inviteedId="+ id +"&status=1&bizTypes=MCN_DAREN_BIND&bizTypes=MCN_DAREN_AGENCY&queryIncubate=true",

            function (res) {
                 log('4--'+id)
                if(Object.values(res.result.statusCountMap).every(v => !v)){
                    return false
                }

                $('.loading svg text').css('fill','#ffffff')
                if(type == 1){ // 邀请中 检查是否邀请成功或失败
                    $('.loading svg text').text('获取结果中，请勿关闭')
                    if(res.result.statusCountMap[1] >= 1){
                         log('检测到邀请成功 ' + id)
                        //邀请成功
                        searchData(getCookie('ctoken'),1,id)
                    }else if(res.result.statusCountMap[0] >= 1){
                        //邀请中
                        return false
                    }else{
                        //邀请失败
                        log('检测到邀请失败 ' + id)
                        setResult({inviteedId:id,status:3,timestamp:Math.floor(new Date().getTime() / 1000)})
                    }
                }else if(type == 2){ //已绑定检查是否解绑中或确认解绑
                    $('.loading svg text').text('解绑判断中，请勿关闭')
                    if(res.result.statusCountMap[1] >= 1){
                        //已绑定
                        return false
                    }else if(res.result.statusCountMap[2] >= 1){
                        //解绑中
                        log('检测到解绑中 ' + id)
                        setResult({inviteedId:id,status:2,timestamp:Math.floor(new Date().getTime() / 1000)})
                    }else{
                        //解绑
                         log('检测到已解绑 ' + id)
                        setResult({inviteedId:id,status:5,timestamp:Math.floor(new Date().getTime() / 1000)})
                    }
                }else{ //解绑中检查是否撤回或确认解绑
                    $('.loading svg text').text('解绑判断中，请勿关闭')
                    if(res.result.statusCountMap[1] >= 1){
                        log('检测到解绑撤回 ' + id)
                        //已绑定  撤回了
                        setResult({inviteedId:id,status:1,timestamp:Math.floor(new Date().getTime() / 1000)})
                    }else if(res.result.statusCountMap[2] >= 1){
                        //解绑中
                        return false
                    }else{
                        log('检测到已解绑 ' + id)
                        //已解绑
                        setResult({inviteedId:id,status:5,timestamp:Math.floor(new Date().getTime() / 1000)})
                    }
                }
                log('5--'+id)
            }
        )
    }
    // 支付宝接口查询
    function searchData(ctoken,status,id,type=1){
        reqAli(
            false,
            "https://contentweb.alipay.com/life/mcn/p/queryInvitationList.json?_reqFromMicro_&ctoken="+ ctoken +"&status="+ status +"&pageNum=1&pageSize=20&inviteedId="+ id +"&bizTypes=MCN_DAREN_BIND&bizTypes=MCN_DAREN_AGENCY",

            function (res) {
                let starData = {};
                for(let key in res.result.invitationVos){
                    starData.inviteedId = res.result.invitationVos[key].inviteedId
                    starData.status = res.result.invitationVos[key].status
                    starData.timestamp = type == 1 ? res.result.invitationVos[key].startTime/1000 : res.result.invitationVos[key].unbindTime/1000
                    starData.inviteedName = res.result.invitationVos[key].inviteedName
                    starData.inviteedLogo = res.result.invitationVos[key].inviteedLogo
                }

                if(Object.keys(starData).length == ""){
                    return false
                }else{
                    setResult(starData)
                }
            }
        )
    }


    // 邀请结果反馈
    function setResult(data){
        let token = localStorage.getItem("token");
        let userData = {
            app_id: "1",
            app_type: "tools_alipay",
            access_token: token,
            data: data,
            om_account_id: localStorage.getItem("orgId")
        }

        $.ajax({
            type: "post",
            url: apiHost + "/spider/browser/alipaySetResult",
            data: userData,
            success: function (res) {
                // console.log(res)
                if(res.code == 1000){
                    return false
                }else if(res.code == 1002){
                    log(res.message);
                    localStorage.removeItem("token");
                    localStorage.removeItem("storagePhone");
                    localStorage.removeItem("storagePwd");
                    localStorage.removeItem("dep_name");
                    localStorage.removeItem("staffName");
                    $(".operate").hide();
                    $(".loginBox").show();
                }else{
                    // 显示提示信息
                    log(res.message)
                }
            },
            error: function(fail){
                log(fail.statusText)
            }
        })
    }



    // 发送失败
    function sendFail(id,reason){
        let token = localStorage.getItem("token");
        let userData = {
            app_id: "1",
            app_type: "tools_alipay",
            access_token: token,
            om_qq: id,
            reason: reason,
            om_account_id: localStorage.getItem("orgId")
        }
        $.ajax({
            type: "post",
            url: apiHost + "/spider/browser/alipaySendFail",
            data: userData,
            success: function (res) {
                // console.log(res)
                if(res.code == 1000){
                    return false
                }else if(res.code == 1002){
                    log(res.message);
                    localStorage.removeItem("token");
                    localStorage.removeItem("storagePhone");
                    localStorage.removeItem("storagePwd");
                    localStorage.removeItem("dep_name");
                    localStorage.removeItem("staffName");
                    $(".operate").hide();
                    $(".loginBox").show();
                }else{
                    // 显示提示信息
                    log(res.message)
                }
            },
            error: function(fail){
                log(fail.statusText)
            }
        })
    }

    // 发送成功
    function sendSuccess(id){
        let token = localStorage.getItem("token");
        let userData = {
            app_id: "1",
            app_type: "tools_alipay",
            access_token: token,
            om_qq: id,
            om_account_id: localStorage.getItem("orgId")
        }
        $.ajax({
            type: "post",
            url: apiHost + "/spider/browser/alipaySendSucc",
            data: userData,
            success: function (res) {
                // console.log(res)
                if(res.code == 1000){
                    return false
                }else if(res.code == 1002){
                    log(res.message);
                    localStorage.removeItem("token");
                    localStorage.removeItem("storagePhone");
                    localStorage.removeItem("storagePwd");
                    localStorage.removeItem("dep_name");
                    localStorage.removeItem("staffName");
                    $(".operate").hide();
                    $(".loginBox").show();
                }else{
                    // 显示提示信息
                    log(res.message)
                }
            },
            error: function(fail){
                log(fail.statusText)
            }
        })
    }

    // 掉线及异常
    function sendError(id = "",status){
        let token = localStorage.getItem("token");
        let userData = {
            app_id: "1",
            app_type: "tools_alipay",
            access_token: token,
            om_qq: id,
            om_account_id: localStorage.getItem("orgId")
        }
        $.ajax({
            type: "post",
            url: apiHost + "/spider/browser/alipayGainRollback",
            data: userData,
            success: function (res) {
                // console.log(res)
                if(res.code == 1000){
                    if(status == "deny"){
                        window.location.href = "https://auth.alipay.com/login/index.htm?goto=https%3A%2F%2Fp.alipay.com%2Fpage%2Fcontent-mcn%2Ftalent%2Flist%3Fmcn%3Dtrue"
                    }
                    return false
                }else if(res.code == 1002){
                    log(res.message);
                    localStorage.removeItem("token");
                    localStorage.removeItem("storagePhone");
                    localStorage.removeItem("storagePwd");
                    localStorage.removeItem("dep_name");
                    localStorage.removeItem("staffName");
                    $(".operate").hide();
                    $(".loginBox").show();
                }else{
                    // 显示提示信息
                    log(res.message)
                }
            },
            error: function(fail){
                log(fail.statusText)
            }
        })
    }



    // 支付宝页面模拟点击
    function click(){

        let data = {
            data: "DW-COOKIE,46f645c0-acbd-4a0b-a38a-d0612a059409_1689229184402,2088002387786599,clicked,a1853./page/content-mcn/*,a1853.%2Fpage%2Fcontent-mcn%2F*,https://p.alipay.com/page/content-mcn/talent/list?mcn=true,https://p.alipay.com/page/content-mcn/talent/list?mcn=true,menuKey=isv.mcn.talent^mBizScenario=^mPageState=^role_id=2088002387786599^fullURL=https://p.alipay.com/page/content-mcn/talent/list?mcn%3Dtrue^ref=https://p.alipay.com/page/content-mcn/talent/list?mcn%3Dtrue^clientID=8175e05c-562d-412b-9dcb-1fae1e218893_1634913491075^pageSpm=a1853.%2Fpage%2Fcontent-mcn%2F*^xpath=/div[5]/div[3]/div[2]/div[2]/div[1]/button[2]^selectorId=#invite^selectorName=邀约达人^clickXPos=947^clickYPos=401^scrollWidth=1489^scrollHeight=1311^clickWidth=96^clickHeight=46^dpr=1.5^_autoLog=true^sdkVersion=4.5.4^__tracert_sequence_id=9465d1d0-ea2a-4e06-8d52-26df2f11b374^__tracert_sequence=35^__tracert_event_sequence=1,,,_cc91f41f-127d-4f45-be4c-aa37af7722f8_1689236118873,Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML%2C like Gecko) Chrome/114.0.0.0 Safari/537.36,PC,/|chrome/114.0.0.0|na/-1,,_cc91f41f-127d-4f45-be4c-aa37af7722f8_1689236118873,openhomeportal,,1506,1289,1.5,,",
            time: Date.parse(new Date())
        }

        $.ajax({
            type: "post",
            url: "https://collect.alipay.com/dwcookie?biztype=openhomeportal&eventid=clicked&productid=PC&spmAPos=a1853",
            data: data,
            async: false,
            success: function (res) {
                log("123123123123312",res)
            },
            error: function(fail){
                log(fail.statusText)
            }
        })
    }


    // setInterval(function(){
    //     click()
    // },30000)


    // 支付宝内容管理数据
    $("#contentManagement").click(function(){
        let startPublishDate = $("#contentStart").val()
        let endPublishDate = $("#contentEnd").val()

        contentReturn(startPublishDate,endPublishDate)

    })

    function contentReturn(startPublishDate,endPublishDate){
        $(".loading").show()
        $('.loading svg text').text('内容管理，请勿关闭')
        reqAli(
            false,
            "https://contentweb.alipay.com/life/mcn/p/contentlist.json?_reqFromMicro_&ctoken="+ getCookie('ctoken') +"&pageSize=20&pageNum="+ contentNum +"&startPublishDate="+ startPublishDate +"&endPublishDate="+ endPublishDate +"&contentStatus=1&contentWeight=",

            function (res) {
                let total = Math.ceil(res.result.total/20)
                if(total == 0){
                    contentReturn(startPublishDate,endPublishDate)
                }else if(total > 5000){
                    alert("页数大于5000")
                    $(".loading").hide()
                }else{
                    contentManagement(total,startPublishDate,endPublishDate)
                }
            },
            function(){},
            function(){},
            function(){
                async function contentFun(){
                    await sleep(2000)
                    contentReturn(startPublishDate,endPublishDate)
                }
                contentFun()
            }
        )
    }


    let contentNum = 1

    function contentManagement(total,startPublishDate,endPublishDate){
        async function contentFun(){
            await sleep(2000)

            // console.log("当前页"+ contentNum +"/"+ total)
            console.log("当前进度-内容管理-"+contentNum+"/"+total)

            let token = localStorage.getItem("token");
            reqAli(
                false,
                "https://contentweb.alipay.com/life/mcn/p/contentlist.json?_reqFromMicro_&ctoken="+ getCookie('ctoken') +"&pageSize=20&pageNum="+ contentNum +"&startPublishDate="+ startPublishDate +"&endPublishDate="+ endPublishDate +"&contentStatus=1&contentWeight=",

                function (res) {
                    let row_total = Math.ceil(res.result.total/20)

                    if(row_total == 0){
                        console.log("内容为空，10秒后重新执行")
                        setTimeout(function(){
                            contentManagement(total,startPublishDate,endPublishDate)
                        },10000)
                    }else{
                        $.ajax({
                            type: "post",
                            url: apiHost + "/spider/browser/alipayContent",
                            data: {
                                app_id: "1",
                                app_type: "tools_alipay",
                                access_token: token,
                                om_account_id: localStorage.getItem("orgId"),
                                data: JSON.stringify(res.result.contents)
                            },
                            success: function(res){
                                // console.log(res)
                                if(res.code == 1000){
                                    if(contentNum < total){
                                        contentNum++
                                        contentManagement(total,startPublishDate,endPublishDate)
                                    }else{
                                        $(".loading").hide()
                                    }
                                }else if(res.code == 1002){
                                    log(res.message)
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("storagePhone");
                                    localStorage.removeItem("storagePwd");
                                    localStorage.removeItem("dep_name");
                                    localStorage.removeItem("staffName");
                                    $(".operate").hide();
                                    $(".loginBox").show();
                                }else{
                                    // 显示提示信息
                                    log(res.message)
                                }
                            },
                            error: function(fail){

                            }
                        })
                    }
                },
                function(){},
                function(){},
                function(){
                    contentManagement(total,startPublishDate,endPublishDate)
                }
            )
        }
        contentFun()
    }



    // 支付宝内容管理优质达人
    $("#contentManagementDay").click(function(){

        // recommendReturn()
        contentApi()

    })

    let contentApiData;
    let contentKey = 0;

    function contentApi(){
        let token = localStorage.getItem("token");
        let userData = {
            app_id: "1",
            app_type: "tools_alipay",
            access_token: token,
            om_account_id: localStorage.getItem("orgId"),
            type: 0
        }
        $.ajax({
            type: "post",
            url: apiHost + "/spider/browser/alipayHighStar",
            data: userData,
            success: function (res) {
                // console.log(res)
                if(res.code == 1000){
                    console.log(res)
                    contentApiData = res.result.data
                    recommendReturn(contentKey)
                }else if(res.code == 1002){
                    log(res.message);
                    localStorage.removeItem("token");
                    localStorage.removeItem("storagePhone");
                    localStorage.removeItem("storagePwd");
                    localStorage.removeItem("dep_name");
                    localStorage.removeItem("staffName");
                    $(".operate").hide();
                    $(".loginBox").show();
                }else{
                    // 显示提示信息
                    log(res.message)
                }
            },
            error: function(fail){
                log(fail.statusText)
            }
        })
    }


    function recommendReturn(contentKey){
        $(".loading").show()
        $('.loading svg text').text('优质达人，请勿关闭')

        reqAli(
            false,
            "https://contentweb.alipay.com/life/mcn/p/contentlist.json?ctoken="+ getCookie('ctoken') +"&pageSize=20&pageNum="+ contentNum +"&startPublishDate=&endPublishDate=&contentStatus=1&contentWeight=1&publicName=&publicId="+ contentApiData[contentKey].om_qq,

            function (res) {
                let total = Math.ceil(res.result.total/20)
                if(total == 0){
                    console.log("内容为空，进行下一个")
                    contentKey++
                    recommendReturn(contentKey)
                }else{
                    contentRecommend(contentKey,total)
                }
            },
            function(){},
            function(){},
            function(){
                async function contentFun(){
                    await sleep(2000)
                    recommendReturn(contentKey)
                }
                contentFun()
            }
        )
    }


    function contentRecommend(contentKey,total){

        async function contentFun(){
            await sleep(3000)

            console.log("当前进度-内容管理优质达人页数-"+contentNum+"/"+total+"---"+contentApiData[contentKey].om_qq_nick+"---优质达人进度"+(contentKey+1)+"/"+contentApiData.length)

            let token = localStorage.getItem("token");
            reqAli(
                false,
                "https://contentweb.alipay.com/life/mcn/p/contentlist.json?ctoken="+ getCookie('ctoken') +"&pageSize=20&pageNum="+ contentNum +"&startPublishDate=&endPublishDate=&contentStatus=1&contentWeight=1&publicName="+ contentApiData[contentKey].om_qq_nick +"&publicId="+ contentApiData[contentKey].om_qq,

                function (res) {
                    let row_total = Math.ceil(res.result.total/20)

                    // console.log("当前页"+ contentNum +"/"+ total)

                    if(row_total == 0){
                        console.log("内容为空，进行下一个")
                        contentKey++
                        recommendReturn(contentKey,total)
                    }else{
                        $.ajax({
                            type: "post",
                            url: apiHost + "/spider/browser/alipayContent",
                            data: {
                                app_id: "1",
                                app_type: "tools_alipay",
                                access_token: token,
                                om_account_id: localStorage.getItem("orgId"),
                                data: JSON.stringify(res.result.contents)
                            },
                            success: function(res){
                                // console.log(res)
                                if(res.code == 1000){
                                    if(contentNum < total){
                                        contentNum++
                                        contentRecommend(contentKey,total)
                                    }else{
                                        // 判断当前状态值索引是否超出数组长度
                                        if(contentKey >= contentApiData.length-1){
                                            contentKey = 0
                                            $(".loading").hide()
                                        }else{
                                            contentKey++
                                            contentNum = 1
                                            recommendReturn(contentKey)
                                        }
                                    }
                                }else if(res.code == 1002){
                                    log(res.message)
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("storagePhone");
                                    localStorage.removeItem("storagePwd");
                                    localStorage.removeItem("dep_name");
                                    localStorage.removeItem("staffName");
                                    $(".operate").hide();
                                    $(".loginBox").show();
                                }else{
                                    // 显示提示信息
                                    log(res.message)
                                }
                            },
                            error: function(fail){

                            }
                        })
                    }
                },
                function(){},
                function(){},
                function(){
                    contentRecommend(contentKey,total)
                }
            )
        }
        contentFun()
    }




    // 支付宝分成计划达人发文
    $("#expertsPost").click(function(){

        // recommendReturn()
        postApi()

    })

    let postApiData;
    let postKey = 0;
    let postNum = 1;

    function postApi(){
        let token = localStorage.getItem("token");
        let userData = {
            app_id: "1",
            app_type: "tools_alipay",
            access_token: token,
            om_account_id: localStorage.getItem("orgId"),
        }
        $.ajax({
            type: "post",
            url: "https://api.oa.cyek.com//spider/browser/alipayRewardPlanStar",
            data: userData,
            success: function (res) {
                // console.log(res)
                if(res.code == 1000){
                    console.log(res)
                    postApiData = res.result.data

                    let startPublishDate = $("#contentStart").val()
                    let endPublishDate = $("#contentEnd").val()
                    postReturn(postKey,startPublishDate,endPublishDate)
                }else if(res.code == 1002){
                    log(res.message);
                    localStorage.removeItem("token");
                    localStorage.removeItem("storagePhone");
                    localStorage.removeItem("storagePwd");
                    localStorage.removeItem("dep_name");
                    localStorage.removeItem("staffName");
                    $(".operate").hide();
                    $(".loginBox").show();
                }else{
                    // 显示提示信息
                    log(res.message)
                }
            },
            error: function(fail){
                log(fail.statusText)
            }
        })
    }


    function postReturn(postKey,startPublishDate,endPublishDate){
        $(".loading").show()
        $('.loading svg text').text('达人发文，请勿关闭')

        reqAli(
            false,
            "https://contentweb.alipay.com/life/mcn/p/contentlist.json?_reqFromMicro_&ctoken="+ getCookie('ctoken') +"&pageSize=20&pageNum="+ postNum +"&startPublishDate="+ startPublishDate +"&endPublishDate="+ endPublishDate +"&contentStatus=1&contentWeight=&publicName="+ postApiData[postKey].om_qq_nick +"&publicId="+ postApiData[postKey].om_qq,

            function (res) {
                let total = Math.ceil(res.result.total/20)
                if(total == 0){
                    console.log("内容为空，进行下一个")
                    postKey++
                    postReturn(postKey,startPublishDate,endPublishDate)
                }else{
                    postRecommend(postKey,total,startPublishDate,endPublishDate)
                }
            },
            function(){},
            function(){},
            function(){
                async function contentFun(){
                    await sleep(2000)
                    postReturn(postKey,startPublishDate,endPublishDate)
                }
                contentFun()
            }
        )
    }


    function postRecommend(postKey,total,startPublishDate,endPublishDate){

        async function contentFun(){
            await sleep(3000)

            console.log("当前进度-分成计划达人发文页数-"+postNum+"/"+total+"---"+postApiData[postKey].om_qq_nick+"---达人发文进度"+(postKey+1)+"/"+postApiData.length)

            let token = localStorage.getItem("token");
            reqAli(
                false,
                "https://contentweb.alipay.com/life/mcn/p/contentlist.json?_reqFromMicro_&ctoken="+ getCookie('ctoken') +"&pageSize=20&pageNum="+ postNum +"&startPublishDate="+ startPublishDate +"&endPublishDate="+ endPublishDate +"&contentStatus=1&contentWeight=&publicName="+ postApiData[postKey].om_qq_nick +"&publicId="+ postApiData[postKey].om_qq,

                function (res) {
                    let row_total = Math.ceil(res.result.total/20)

                    // console.log("当前页"+ contentNum +"/"+ total)

                    if(row_total == 0){
                        console.log("内容为空，进行下一个")
                        postKey++
                        postReturn(postKey,total,startPublishDate,endPublishDate)
                    }else{
                        $.ajax({
                            type: "post",
                            url: apiHost + "/spider/browser/alipayContent",
                            data: {
                                app_id: "1",
                                app_type: "tools_alipay",
                                access_token: token,
                                om_account_id: localStorage.getItem("orgId"),
                                data: JSON.stringify(res.result.contents)
                            },
                            success: function(res){
                                // console.log(res)
                                if(res.code == 1000){
                                    if(postNum < total){
                                        postNum++
                                        postRecommend(postKey,total,startPublishDate,endPublishDate)
                                    }else{
                                        // 判断当前状态值索引是否超出数组长度
                                        if(postKey >= postApiData.length-1){
                                            postKey = 0
                                            $(".loading").hide()
                                        }else{
                                            postKey++
                                            postNum = 1
                                            postReturn(postKey,startPublishDate,endPublishDate)
                                        }
                                    }
                                }else if(res.code == 1002){
                                    log(res.message)
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("storagePhone");
                                    localStorage.removeItem("storagePwd");
                                    localStorage.removeItem("dep_name");
                                    localStorage.removeItem("staffName");
                                    $(".operate").hide();
                                    $(".loginBox").show();
                                }else{
                                    // 显示提示信息
                                    log(res.message)
                                }
                            },
                            error: function(fail){

                            }
                        })
                    }
                },
                function(){},
                function(){},
                function(){
                    postRecommend(postKey,total,startPublishDate,endPublishDate)
                }
            )
        }
        contentFun()
    }





    // 支付宝抓取数据
    function dataReq(type,url,data,sucFun,returnFun){
        $.ajax({
            type: type,
            url: url,
            data: data,
            contentType:'application/json',
            dataType: "json",
            crossDomain:true,
            xhrFields: {
                withCredentials: true // 这里设置了withCredentials
            },
            success: function (res) {
                if (res.stat != "ok"){
                    if(res.stat == "failed"){
                        // $('.loading svg text').css('fill','#ff0000')
                        // $('.loading svg text').text('登录掉线了，刷新吧兄弟')
                        log("请求failed 重跑当前页数")
                        returnFun()
                    }else if(res.stat == "deny"){
                        $('.loading svg text').css('fill','#ff0000')
                        $('.loading svg text').text('登录掉线了，刷新吧兄弟')
                        log("登录失效 deny")
                        return false
                    } else {
                        log("请求失败" + res.stat)
                        return false
                    }
                } else {
                    if(res.result == null){
                        log("返回值为null 重跑当前页数")
                        returnFun()
                    }else{
                        sucFun(res)
                    }
                }
            },
            error: function(e){
                log(e.statusText)
            }
        })
    }



    // 支付宝分成计划 立即开通 待开通
    $("#unopend").click(function(){
        let planNum = 1
        unopendReturn(planNum)
    })


    function unopendReturn(planNum){
        $(".loading").show()
        $('.loading svg text').text('分成待开通，请勿关闭')

        let planData = {
            "pageNum": planNum,
            "pageSize": 20,
            "pid": localStorage.getItem("targetId").toString()
        }

        dataReq(
            "post",
            "https://fuwu.alipay.com/platform/rewardplan/queryMcnRewardPlanAccountStatus.json?sourceId=P&appId=undefined&ctoken="+ getCookie('ctoken') +"&_input_charset=utf-8&_output_charset=utf-8&_ksTS="+ new Date().getTime() +"_1&ctoken="+ getCookie('ctoken'),
            JSON.stringify(planData),
            function(res){
                let total = Math.ceil(res.result.total/20)
                if(total == 0){
                    unopendReturn(planNum)
                }else{
                    planUnopend(planNum,total)
                }
            },
            function(){
                unopendReturn(planNum)
            }
        )
    }

    function planUnopend(planNum,total){
        async function unopendFun(){
            await sleep(2000)
            let token = localStorage.getItem("token");
            $(".loading").show()

            let planData = {
                "pageNum": planNum,
                "pageSize": 20,
                "pid": localStorage.getItem("targetId").toString()
            }

            // console.log("当前页"+ planNum +"/"+ total)
            console.log("当前进度-分成计划待开通-"+planNum+"/"+total)

            dataReq(
                "post",
                "https://fuwu.alipay.com/platform/rewardplan/queryMcnRewardPlanAccountStatus.json?sourceId=P&appId=undefined&ctoken="+ getCookie('ctoken') +"&_input_charset=utf-8&_output_charset=utf-8&_ksTS="+ new Date().getTime() +"_1&ctoken="+ getCookie('ctoken'),
                JSON.stringify(planData),
                function(res){
                    let row_total = Math.ceil(res.result.total/20)


                    if(row_total == 0){
                        console.log("内容为空，10秒后重新执行")
                        setTimeout(function(){
                            planUnopend(planNum,total)
                        },10000)
                    }else{
                        // 取到支付宝接口信息返给后端
                        $.ajax({
                            type: "post",
                            url: apiHost + "/spider/browser/alipayRewardPlan",
                            data: {
                                app_id: 1,
                                app_type: "tools_alipay",
                                access_token: token,
                                om_account_id: localStorage.getItem("orgId"),
                                data: JSON.stringify(res.result.list)
                            },
                            success: function(res){
                                // console.log(res)
                                if(res.code == 1000){
                                    // 判断当前页是否小于总条数/20条一页
                                    if(planNum < total){
                                        planNum++
                                        planUnopend(planNum,total)
                                    }else{
                                        $(".loading").hide()
                                    }
                                }else if(res.code == 1002){
                                    log(res.message)
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("storagePhone");
                                    localStorage.removeItem("storagePwd");
                                    localStorage.removeItem("dep_name");
                                    localStorage.removeItem("staffName");
                                    $(".operate").hide();
                                    $(".loginBox").show();
                                    window.location.reload()
                                }else{
                                    // 显示提示信息
                                    alert(res.message)
                                    $(".loading").hide()
                                }
                            },
                            error: function(fail){

                            }
                        })
                    }
                },
                function(){
                    planUnopend(planNum,total)
                }
            )
        }
        unopendFun()
    }



    // 支付宝分成计划 已开通
    $("#opend").click(function(){
        // 页数
        let openNum = 1
        opendReturn(openNum,key)
    })



    // 支付宝开通记录状态值
    let auditStatus = ["AUDIT","REJECT","AGREE"]


    // 状态值索引
    let key = 0

    function opendReturn(planNum,key){
        $(".loading").show()
        $('.loading svg text').text('分成已开通，请勿关闭')

        let planData = {
            "auditStatus": auditStatus[key],
            "pageNum": planNum,
            "pageSize": 20,
            "pid": localStorage.getItem("targetId").toString()
        }

        dataReq(
            "post",
            "https://fuwu.alipay.com/platform/rewardplan/queryMcnRewardPlanAccountRecord.json?sourceId=P&appId=undefined&ctoken="+ getCookie('ctoken') +"&_input_charset=utf-8&_output_charset=utf-8&_ksTS="+ new Date().getTime()+"_"+ 1 +"&ctoken="+ getCookie('ctoken'),
            JSON.stringify(planData),
            function(res){
                let total = Math.ceil(res.result.total/20)
                if(total == 0){
                    opendReturn(planNum,key)
                }else{
                    planOpend(planNum,total)
                }
            },
            function(){
                opendReturn(planNum,key)
            }
        )
    }

    // 分成计划 已开通 开通审核中  开通失败
    function planOpend(planNum,total){
        async function opendFun(){
            await sleep(2000)
            let token = localStorage.getItem("token");
            $(".loading").show()

            let planData = {
                "auditStatus": auditStatus[key],
                "pageNum": planNum,
                "pageSize": 20,
                "pid": localStorage.getItem("targetId").toString()
            }

            dataReq(
                "post",
                "https://fuwu.alipay.com/platform/rewardplan/queryMcnRewardPlanAccountRecord.json?sourceId=P&appId=undefined&ctoken="+ getCookie('ctoken') +"&_input_charset=utf-8&_output_charset=utf-8&_ksTS="+ new Date().getTime()+"_"+ 1 +"&ctoken="+ getCookie('ctoken'),
                JSON.stringify(planData),
                function(res){
                    let row_total = Math.ceil(res.result.total/20)

                    // console.log("当前页"+ planNum +"/"+ total +"---"+ auditStatus[key])
                    console.log("当前进度-分成计划已开通-"+planNum+"/"+total+"---"+ auditStatus[key])

                    if(row_total == 0){
                        console.log("内容为空，10秒后重新执行")
                        setTimeout(function(){
                            planOpend(planNum,total)
                        },10000)
                    }else{
                        // 取到支付宝接口信息返给后端
                        $.ajax({
                            type: "post",
                            url: apiHost + "/spider/browser/alipayRewardPlan",
                            data: {
                                app_id: 1,
                                app_type: "tools_alipay",
                                access_token: token,
                                om_account_id: localStorage.getItem("orgId"),
                                data: JSON.stringify(res.result.list)
                            },
                            success: function(res){
                                // console.log(res)
                                if(res.code == 1000){
                                    // 判断当前页是否小于总条数/20条一页
                                    if(planNum < total){
                                        planNum++
                                        planOpend(planNum,total)
                                    }else{
                                        // 判断当前状态值索引是否超出数组长度
                                        if(key >= 2){
                                            key = 0
                                            $(".loading").hide()
                                        }else{
                                            key++
                                            planNum = 1
                                            opendReturn(planNum,key)
                                        }
                                    }
                                }else if(res.code == 1002){
                                    log(res.message)
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("storagePhone");
                                    localStorage.removeItem("storagePwd");
                                    localStorage.removeItem("dep_name");
                                    localStorage.removeItem("staffName");
                                    $(".operate").hide();
                                    $(".loginBox").show();
                                    window.location.reload()
                                }else{
                                    // 显示提示信息
                                    alert(res.message)
                                    $(".loading").hide()
                                }
                            },
                            error: function(fail){

                            }
                        })
                    }
                },
                function(){
                    planOpend(planNum,total)
                }
            )
        }
        opendFun()
    }



    // 活动账单
    $("#bill").click(function(){
        billReturn()
    })

    function billReturn(){
        // 获取当前时间前一天
        let year = new Date().getFullYear()
        let month = new Date().getMonth()+1
        let day = new Date(new Date().getTime()-24*60*60*1000).getDate()

        if(new Date(new Date().getTime()).getDate() == 1){
            month--
        }

        let time = year + "-" + month + "-" + day

        $(".loading").show()
        $('.loading svg text').text('账单抓取中，请勿关闭')

        reqAli(
            false,
            "https://fuwu.alipay.com/platform/income/incomeDetailQuery.json?sourceId=P&appId=undefined&ctoken="+ getCookie('ctoken') +"&pageSize=20&targetId="+ localStorage.getItem("targetId") +"&pageNum="+ billNum +"&dateType=YESTERDAY&specifiedDate="+ time +"&_input_charset=utf-8&_output_charset=utf-8&_ksTS="+ new Date().getTime() +"_1&ctoken="+ getCookie('ctoken'),
            function(res){
                let total = Math.ceil(res.result.totalSize/20)
                if(total == 0){
                    billReturn()
                }else{
                    bill(total)
                }
            },
            function(){},
            function(){},
            function(){
                billReturn()
            }
        )
    }


    let billNum = 1
    // 活动账单 30日数据
    function bill(total){
        async function billFun(){
            await sleep(2000)
            // 获取当前时间前一天
            let year = new Date().getFullYear()
            let month = new Date().getMonth()+1
            let day = new Date(new Date().getTime()-24*60*60*1000).getDate()

            if(new Date(new Date().getTime()).getDate() == 1){
                month--
            }

            let time = year + "-" + month + "-" + day

            let token = localStorage.getItem("token");

            reqAli(
                false,
                "https://fuwu.alipay.com/platform/income/incomeDetailQuery.json?sourceId=P&appId=undefined&ctoken="+ getCookie('ctoken') +"&pageSize=20&targetId="+ localStorage.getItem("targetId") +"&pageNum="+ billNum +"&dateType=YESTERDAY&specifiedDate="+ time +"&_input_charset=utf-8&_output_charset=utf-8&_ksTS="+ new Date().getTime() +"_1&ctoken="+ getCookie('ctoken'),
                function(res){
                    let row_total = Math.ceil(res.result.totalSize/20)

                    console.log("当前进度-活动账单-"+billNum+"/"+total)

                    if(row_total == 0){
                        console.log("内容为空，10秒后重新执行")
                        setTimeout(function(){
                            bill(total)
                        },10000)
                    }else{
                        $.ajax({
                            type: "post",
                            url: apiHost + "/spider/browser/alipayContentSettle",
                            data: {
                                app_id: "1",
                                app_type: "tools_alipay",
                                access_token: token,
                                om_account_id: localStorage.getItem("orgId"),
                                datetime: new Date(time).getTime()/1000,
                                data: JSON.stringify(res.result.list)
                            },
                            success: function(res){
                                // console.log(res)
                                if(res.code == 1000){
                                    if(billNum < total){
                                        billNum++
                                        bill(total)
                                    }else{
                                        $(".loading").hide()
                                    }
                                }else if(res.code == 1002){
                                    log(res.message)
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("storagePhone");
                                    localStorage.removeItem("storagePwd");
                                    localStorage.removeItem("dep_name");
                                    localStorage.removeItem("staffName");
                                    $(".operate").hide();
                                    $(".loginBox").show();
                                }else{
                                    // 显示提示信息
                                    log(res.message)
                                }
                            },
                            error: function(fail){

                            }
                        })
                    }
                },
                function(res){},
                function(res){},
                function(){
                    bill(total)
                }
            )
        }
        billFun()
    }



    // 内容分析
    $("#analysis").click(function(){
        analysisApi()
    })

    let analysisNum = 1

    let analysisApiData;
    let analysisKey = 0;

    // 调用后端接口 抓取列表匹配支付宝接口
    function analysisApi(){
        let token = localStorage.getItem("token");
        let userData = {
            app_id: "1",
            app_type: "tools_alipay",
            access_token: token,
            om_account_id: localStorage.getItem("orgId"),
            type: 1
        }
        $.ajax({
            type: "post",
            url: apiHost + "/spider/browser/alipayHighStar",
            data: userData,
            success: function (res) {
                // console.log(res)
                if(res.code == 1000){
                    console.log(res)
                    analysisApiData = res.result.data
                    analysisReturn(analysisKey)
                }else if(res.code == 1002){
                    log(res.message);
                    localStorage.removeItem("token");
                    localStorage.removeItem("storagePhone");
                    localStorage.removeItem("storagePwd");
                    localStorage.removeItem("dep_name");
                    localStorage.removeItem("staffName");
                    $(".operate").hide();
                    $(".loginBox").show();
                }else{
                    // 显示提示信息
                    log(res.message)
                }
            },
            error: function(fail){
                log(fail.statusText)
            }
        })
    }

    function analysisReturn(analysisKey){
        $(".loading").show()
        $('.loading svg text').text('内容分析，请勿关闭')

        let planData = {
            "appName": analysisApiData[analysisKey].om_qq_nick,
            "dt": analysisApiData[analysisKey].search_date,
            "pageNum": analysisNum,
            "pageSize": 20,
            "scopeType": "thirty_days"
        }

        dataReq(
            "post",
            "https://contentweb.alipay.com/life/mcn/contentDetailedAnalysisList.json?ctoken="+getCookie('ctoken'),
             JSON.stringify(planData),
            function(res){
                let total = Math.ceil(res.result.total/20)
                if(total == 0){
                    console.log("内容为空，进行下一个")
                    analysisKey++
                    analysisReturn(analysisKey)
                }else{
                    analysis(analysisKey,total)
                }
            },
            function(){
                analysisReturn(analysisKey)
            }
        )
    }



    // 内容分析 30日数据
    function analysis(analysisKey,total){
        async function analysisFun(){
            await sleep(3000)

            let token = localStorage.getItem("token");

            let planData = {
                "appName": analysisApiData[analysisKey].om_qq_nick,
                "dt": analysisApiData[analysisKey].search_date,
                "pageNum": analysisNum,
                "pageSize": 20,
                "scopeType": "thirty_days"
            }

            dataReq(
                "post",
                "https://contentweb.alipay.com/life/mcn/contentDetailedAnalysisList.json?ctoken="+getCookie('ctoken'),
                JSON.stringify(planData),
                function(res){
                    let row_total = Math.ceil(res.result.total/20)

                    console.log("当前进度-内容分析达人页数-"+analysisNum+"/"+total+"---"+analysisApiData[analysisKey].om_qq_nick+"---内容分析达人进度"+(analysisKey+1)+"/"+analysisApiData.length)

                    if(row_total == 0){
                        console.log("内容为空，进行下一个")
                        analysisKey++
                        analysisReturn(analysisKey)
                    }else{
                        // 取到支付宝接口信息返给后端
                        $.ajax({
                            type: "post",
                            url: apiHost + "/spider/browser/alipayContentAnalysis",
                            data: {
                                app_id: 1,
                                app_type: "tools_alipay",
                                access_token: token,
                                om_account_id: localStorage.getItem("orgId"),
                                in_reg_range: 1,
                                data: JSON.stringify(res.result.mcnContentDetailedAnalysisVOS)
                            },
                            success: function(res){
                                // console.log(res)
                                if(res.code == 1000){
                                    // 判断当前页是否小于总条数/20条一页
                                    if(analysisNum < total){
                                        analysisNum++
                                        analysis(analysisKey,total)
                                    }else{
                                        // 判断当前状态值索引是否超出数组长度
                                        if(analysisKey >= analysisApiData.length-1){
                                            analysisKey = 0
                                            $(".loading").hide()
                                        }else{
                                            analysisKey++
                                            analysisNum = 1
                                            analysisReturn(analysisKey)
                                        }
                                    }
                                }else if(res.code == 1002){
                                    log(res.message)
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("storagePhone");
                                    localStorage.removeItem("storagePwd");
                                    localStorage.removeItem("dep_name");
                                    localStorage.removeItem("staffName");
                                    $(".operate").hide();
                                    $(".loginBox").show();
                                    window.location.reload()
                                }else{
                                    // 显示提示信息
                                    alert(res.message)
                                    $(".loading").hide()
                                }
                            },
                            error: function(fail){

                            }
                        })
                    }
                },
                function(){
                    analysis(analysisKey,total)
                }
            )
        }
        analysisFun()
    }






    // resourceInfo 接口调用
    function resourceInfo(){
        var token = localStorage.getItem("token");

        $(".loginBox").hide();
        $(".operate").show();

        // 粉丝数少于49500  不显示操作
        // if(fans_count < fansNum){
        //     $(".operate-btn").hide();
        //     $(".talent").hide();
        //     $(".expandTime").hide();
        //     $(".expand").text("该达人粉丝数少于五万不达标！");
        // }

        reqAli(
            false,
            "https://spcenter.alipay.com/pamir/login/queryLoginAccount.json?_output_charset=utf-8&appScene=ISV",
            function(res){
                // console.log(res)
                console.log(res.data.masterPid)
                let masterPid = res.data.masterPid
                localStorage.setItem("targetId",masterPid)
                $.ajax({
                    type: "post",
                    url: apiHost + "/spider/browser/alipayMatrixList",
                    data: {
                        app_id: 1,
                        app_type: "tools_alipay",
                        access_token: token
                    },
                    success: function (res) {
                        if(res.code == 1000){
                            console.log(res)
                            let keyId = [];
                            for(let key of res.result){
                                console.log(key)
                                keyId.push(key.org_id)
                            }
                            // console.log(keyId.includes(masterPid))
                            if(keyId.includes(masterPid)){
                                localStorage.setItem("orgId",res.result[keyId.indexOf(masterPid)].id)
                                // console.log(res.result[keyId.indexOf(masterPid)].id)
                            }else{
                                $(".info-data").text("当前矩阵不支持该业务，请重新扫码！！！")
                                $(".info-data").css({
                                    "color": "red",
                                    "fontSize": "20px"
                                })
                            }
                        }else if(res.code == 1002){
                            log(res.message);
                            localStorage.removeItem("token");
                            localStorage.removeItem("storagePhone");
                            localStorage.removeItem("storagePwd");
                            localStorage.removeItem("dep_name");
                            localStorage.removeItem("staffName");
                            $(".operate").hide();
                            $(".loginBox").show();
                        }else{
                            // 显示提示信息
                            log(res.message)
                        }

                    },
                    error: function(fail){
                        log(fail.statusText)
                    }
                })
            },
            function(){},
            function(){},
            function(){}
        )

    }

    // 版本号验证
    function ver(){
        $.ajax({
            type: "post",
            url: apiHost+"/spider/browser/version",
            data:{
                type: 1
            },
            dataType: "json",
            success: function (response) {
                console.log(response);
                if(response.code == 1000){
                    if(response.result.v != version && response.result.u == true){
                        $(".renew").show();
                    }
                }else if(response.code == 1002){
                    console.log(response.message);
                    localStorage.removeItem("token");
                    localStorage.removeItem("storagePhone");
                    localStorage.removeItem("storagePwd");
                    localStorage.removeItem("dep_name");
                    localStorage.removeItem("staffName");
                    window.location.reload();
                }else{
                    // 显示提示信息
                    console.log(response.message)
                }
            }
        });
    }

    // 版本号是否更新
    ver();


    // 点击登录验证显示弹窗
    function loginInfo(){
        if(checkphone()&&checkpwd()){
            let phone = $("#cyphoneNum").val()
            let pwd = md5($("#cypwd").val())
            // 登录传递的参数
            var data = {
                "app_type": "tools_alipay",
                "app_id": 1,
                "phone": phone,
                "pwd": pwd,
                "v": version
            }
            // console.log(data);
            // 登录传参
            $.ajax({
                type: "post",
                url: apiHost+"/spider/browser/login",
                data: data,
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    if(response.code == 1000){
                        // 获取部门和名字 存储
                        $(".operate-name").text("欢迎你，"+response.result.dep_name+"-"+response.result.name);
                        localStorage.setItem("dep_name",response.result.dep_name);
                        localStorage.setItem("name",response.result.name);

                        // 获取token 存储
                        localStorage.setItem("token",response.result.access_token);

                        // 获取账号密码 存储session
                        // localStorage.setItem("storagePhone",$("#cyphoneNum").val());
                        // localStorage.setItem("storagePwd",md5($("#cypwd").val()));
                        // var storagePhone = localStorage.getItem("storagePhone");
                        // var storagePwd = localStorage.getItem("storagePwd");

                        resourceInfo();

                    }else{
                        // 显示账号密码不正确
                        alert(response.message)
                    }
                }
            });
        }
    }


    $(".login-btn button").click(function(){
        loginInfo()
    })
    $(".loginBox").keydown(function(){
        if(event.keyCode==13){
            loginInfo()
        }
    })



    // 判断token是否存在 存在就登录
    if(localStorage.getItem("token")!=null){
        resourceInfo();
    }else{
        if(rex.match(/https:\/\/www.kuaishou.com\/profile\/*/) == null && rex.match(/https:\/\/live.kuaishou.com\/profile\/*/) == null && rex.match(/https:\/\/www.xiaohongshu.com\/user\/profile\/*/) == null){
            if(rex.match(/https:\/\/weibo.com\/*/) != null){
                if(rex.match(/https:\/\/weibo.com\/u\/*/) == null){
                    return false
                }
            }
        }
    }




    // 信息框拖拽
    function dragInfo(yTop,yBot){
        var _move=false;//移动标记
        var _x,_y;//鼠标离控件左上角的相对位置
        $(".operate").click(function(){
            //alert("click");//点击（松开后触发）
        }).mousedown(function(e){
            //console.log(e);
            _move=true;
            _x=e.pageX-parseInt($(".operate").css("left"));
            _y=e.pageY-parseInt($(".operate").css("top"));
            // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
        });
        $(document).mousemove(function(e){
            if(_move){
                var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y;
                //console.log("y",y);
                if(x < 0){
                    x = 0;
                }else if(x > $(document).width() - $('.operate').outerWidth(true)){ // 判断是否超出浏览器宽度
                    x = $(document).width() - $('.operate').outerWidth(true)
                }
                if (y < yTop) {
                    y = yTop;
                } else if (y > $(window).height() - $('.operate').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                    y = $(window).height() - $('.operate').outerHeight(true) + yBot;
                }
                $(".operate").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move=false;

            // 记录每次拖拽后位置存储
            localStorage.setItem("elLeft",$(".operate").css("left"));
            localStorage.setItem("elTop",$(".operate").css("top"));
            // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
    }

    // 获取信息框拖拽后位置
    var elLeft = localStorage.getItem("elLeft");
    var elTop = localStorage.getItem("elTop");
    $(".operate").css({
        "left": elLeft,
        "top": elTop
    })


    // 登录框拖拽
    function dragInfo1(yTop,yBot){
        var _move1=false;//移动标记
        var _x1,_y1;//鼠标离控件左上角的相对位置
        $(".loginBox").click(function(){
            //alert("click");//点击（松开后触发）
        }).mousedown(function(e){
            //console.log(e);
            _move1=true;
            _x1=e.pageX-parseInt($(".loginBox").css("left"));
            _y1=e.pageY-parseInt($(".loginBox").css("top"));
            // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
        });
        $(document).mousemove(function(e){
            if(_move1){
                var x=e.pageX-_x1;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y1;
                // console.log("y",y);
                if(x < 0){
                    x = 0;
                }else if(x > $(document).width() - $('.loginBox').outerWidth(true)){ // 判断是否超出浏览器宽度
                    x = $(document).width() - $('.loginBox').outerWidth(true)
                }
                if (y < yTop) {
                    y = yTop;
                } else if (y > $(window).height() - $('.loginBox').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                    y = $(window).height() - $('.loginBox').outerHeight(true) + yBot;
                }
                $(".loginBox").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move1=false;

            // 记录每次拖拽后位置存储
            localStorage.setItem("elLeftLogin",$(".loginBox").css("left"));
            localStorage.setItem("elTopLogin",$(".loginBox").css("top"));
            // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
    }

    // 获取登录框拖拽后位置
    var elLeftLogin = localStorage.getItem("elLeftLogin");
    var elTopLogin = localStorage.getItem("elTopLogin");
    $(".loginBox").css({
        "left": elLeftLogin,
        "top": elTopLogin
    })

    // 点击收起展开
    // el 元素 elBox 展开收起元素  toggleName localStorage存储名称 drag 调用函数 yTop,yBot,yTop1,yBot1 展开收起时各自对于顶部以及底部的限制范围
    function toggleShow(el,elBox,toggleName,drag,yTop,yBot,yTop1,yBot1,flag){
        el.click(function(){
            if($(this).attr("data-bind") == 1){
                el.html(`<svg t="1646796481460" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3799" width="48" height="48"><path d="M122.368 165.888h778.24c-9.216 0-16.384-7.168-16.384-16.384v713.728c0-9.216 7.168-16.384 16.384-16.384h-778.24c9.216 0 16.384 7.168 16.384 16.384V150.016c0 8.192-6.656 15.872-16.384 15.872z m-32.768 684.544c0 26.112 20.992 47.104 47.104 47.104h750.08c26.112 0 47.104-20.992 47.104-47.104V162.304c0-26.112-20.992-47.104-47.104-47.104H136.704c-26.112 0-47.104 20.992-47.104 47.104v688.128z" p-id="3800" fill="#2c2c2c"></path><path d="M138.752 158.208V435.2h745.472V158.208H138.752z m609.792 206.336l-102.912-109.056 25.088-26.624 77.824 82.432 77.824-82.432 25.088 26.624-102.912 109.056z" p-id="3801" fill="#2c2c2c"></path></svg>`);
                elBox.slideUp();
                localStorage.setItem(toggleName,false);
                $(this).attr("data-bind",2);
                if(flag){
                    elBox.next().css({
                        "marginTop":"0",
                        "textAlign": "left"
                    });
                }
                drag(yTop,yBot);
            }else{
                el.html(`<svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg>`);
                elBox.slideDown();
                localStorage.setItem(toggleName,true);
                $(this).attr("data-bind",1);
                elBox.next().css({
                    "marginTop":"20px",
                    "textAlign": "center"
                });
                drag(yTop1,yBot1);
            }
        })
        var toggle = localStorage.getItem(toggleName);
        // console.log(toggle);
        if(toggle == "true" || toggle == undefined){
            el.html(`<svg t="1646796325695" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3481" width="48" height="48"><path d="M866.461538 787.692308a78.769231 78.769231 0 0 1-78.76923 78.76923H236.307692a78.769231 78.769231 0 0 1-78.76923-78.76923V236.307692a78.769231 78.769231 0 0 1 78.76923-78.76923h551.384616a78.769231 78.769231 0 0 1 78.76923 78.76923v551.384616z m-31.507692-358.439385H189.006769L189.046154 787.692308a47.261538 47.261538 0 0 0 42.417231 47.02523L236.307692 834.953846h551.384616a47.261538 47.261538 0 0 0 47.02523-42.417231L834.953846 787.692308v-358.439385zM787.692308 189.046154H236.307692a47.261538 47.261538 0 0 0-47.02523 42.417231L189.046154 236.307692l-0.039385 161.437539H834.953846V236.307692a47.261538 47.261538 0 0 0-42.417231-47.02523L787.692308 189.046154z m-111.616 53.681231l2.48123 1.96923 80.738462 78.769231a15.753846 15.753846 0 0 1-19.495385 24.576l-2.48123-1.969231-69.474462-67.780923-65.772308 67.465846a15.753846 15.753846 0 0 1-19.810461 2.284308l-2.481231-1.969231a15.753846 15.753846 0 0 1-2.284308-19.810461l1.969231-2.481231 76.8-78.769231a15.753846 15.753846 0 0 1 19.810462-2.284307z" fill="#2c2c2c" p-id="3482"></path></svg>`);
            elBox.show();
            el.attr("data-bind",1);
            elBox.next().css({
                "marginTop":"20px",
                "textAlign": "center"
            });
            drag(yTop1,yBot1);
        }else{
            el.html(`<svg t="1646796481460" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3799" width="48" height="48"><path d="M122.368 165.888h778.24c-9.216 0-16.384-7.168-16.384-16.384v713.728c0-9.216 7.168-16.384 16.384-16.384h-778.24c9.216 0 16.384 7.168 16.384 16.384V150.016c0 8.192-6.656 15.872-16.384 15.872z m-32.768 684.544c0 26.112 20.992 47.104 47.104 47.104h750.08c26.112 0 47.104-20.992 47.104-47.104V162.304c0-26.112-20.992-47.104-47.104-47.104H136.704c-26.112 0-47.104 20.992-47.104 47.104v688.128z" p-id="3800" fill="#2c2c2c"></path><path d="M138.752 158.208V435.2h745.472V158.208H138.752z m609.792 206.336l-102.912-109.056 25.088-26.624 77.824 82.432 77.824-82.432 25.088 26.624-102.912 109.056z" p-id="3801" fill="#2c2c2c"></path></svg>`);
            elBox.hide();
            el.attr("data-bind",2);
            if(flag){
                elBox.next().css({
                    "marginTop":"0",
                    "textAlign": "left"
                });
            }
            drag(yTop,yBot);
        }
    }

    // 信息框收起展开
    toggleShow($(".operate-toggle"),$(".operate-box"),"toggle1",dragInfo,100,0,300,329,true);

    // 登录框收起展开
    toggleShow($(".login-toggle"),$(".cylogin-box"),"toggle2",dragInfo1,120,40,200,140);


    // 退出登录
    $(".operate-quit a").click(function(){
        localStorage.removeItem("token");
        localStorage.removeItem("storagePhone");
        localStorage.removeItem("storagePwd");
        localStorage.removeItem("dep_name");
        localStorage.removeItem("staffName");
        window.location.reload();
    })

    // 达人编号 MID 点击复制文本内容
    $(".info-name").on("click","#copy",function(){
        console.log(this.innerText)
        var Url2= this.innerText;
        var oInput = document.createElement('input');
        oInput.value = Url2;
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        oInput.className = 'oInput';
        oInput.remove();
        msgHide("复制成功!");
    })



})();