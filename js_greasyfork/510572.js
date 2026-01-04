// ==UserScript==
// @name         商品视频采集
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  "商品视频采集"
// @author       xgm
// @match        https://www.douyin.com/*
// @match        https://www.douyin.com/search/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      End-User License Agreement
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/510572/%E5%95%86%E5%93%81%E8%A7%86%E9%A2%91%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/510572/%E5%95%86%E5%93%81%E8%A7%86%E9%A2%91%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 自定义css
    let div_css = `
        .cyOperate{
        display:none;
            width: 320px;
            max-height: 700px;
            overflow-y: auto;
            padding: 15px 10px;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            right: 15%;
            top: 50%;
            transform: translateY(-20%);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 99999;
            color: #333;
            box-sizing: initial;
        }
        .cyInp input{
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin-left: 20px;
        }
        .cyBtn{
            text-align: center;
        }
        .cyBtn button{
            width: 150px;
            height: 35px;
            background-color: #0096DB;
            color: #fff;
            border: 0;
            border-radius: 3px;
            cursor: pointer;
            font-size: 16px;
            letter-spacing: 3px;
        }
        .cyloading{
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999999;
            display: none;
        }
        .cyloading svg{
            width: 300px;
            height: 300px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -150px;
            margin-top: -150px;
        }
        .cyloading svg text{
            font-size: 2px;
        }
        .cyInp {
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin:0 0 20px 10px;
        }
        .keyword {
           margin:20px 0;
        }
        .title {
           font-size:16px;
           font-weight:500;
           color:blue;
        }
        .h1_content{
        font-size:22px;
        font-weight:bold;
        display:none;
        }
        .scroll_list {
        display:flex;
        flex-wrap:wrap;
        height:500px;
        overflow-y: auto; /* 当内容超出垂直方向时显示滚动条 */
        overflow-x: hidden; /* 隐藏水平方向的滚动条 */
        }
        .shop_checked{
         width:30px;
         height:30px;
         z-index:9999;
         position: absolute;
         top:0;
         right:0;
         color:#7dcab4;
         font-weight:500;
         font-size:12;
        }
         .mode_type {
          display:flex;
          align-items:center;
          align-self: center;
          padding-bottom:20px;
        }
        .active_tag {
         background-color:#0096db;
         color:white;
         padding:5px 15px;
         border-radius:5px;
         cursor:pointer;
         margin-right:15px;
         border:none;
        }
         .tag_title {
          width:100px;
        }
        .tags_list {
        display:flex;
        flex-wrap: wrap;
        }
        .tags {
        border:1px solid #333;
        padding:5px 15px;
        border-radius:5px;
        cursor:pointer;
        margin:0 10px 0 0;
        }
        .cyInp {
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin:0 0 10px 10px;
        }
        .cyBtn_list {
          display:flex;
          justify-content:space-between;
        }
        .loginBtn button{
            width: 150px;
            height: 35px;
            margin-top:10px;
            background-color: #ca302a;
            color: #fff;
            border: 0;
            border-radius: 3px;
            cursor: pointer;
            font-size: 16px;
            letter-spacing: 3px;
        }
        .cyBtnReset button {
            width: 150px;
            height: 35px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 16px;
            letter-spacing: 3px;
            background-color: #fff;
            color:#333;
            border:1px solid #333;
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
        z-index: 9990;
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
    .cy-tool{
        text-align: center;
        margin-top: 20px;
        font-size: 12px;
        color: #ccc;
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
      .logo{
        width: 80px;
        position: absolute;
        top: 10px;
        left: 10px;
    }
    .logo img{
        width: 100%;
    }
    .operate-name{
        font-size: 16px;
        margin-bottom: 5px;
    }
    #jdSelect,#ggSelect {
    margin-bottom:10px;
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
        <div class="cy-tool">灿耀易客商品视频采集工具</div>
    </div>
        <div class="cyOperate">
        <div class="operate-name"></div>
          <div class="phone_item"><span>DYSKUID：</span><input class="cyInp" type="text" id="dyskuId" /></div>
          <div class="mode_type"><div class="tag_title">发文项目G：</div></div>
          <div><span>SKU分类：</span><select id="ggSelect"></select></div>
          <div class="phone_item"><span>SKUID：</span><input class="cyInp" type="text" id="gskuId" /></div>
          <div><span>SKU名称：</span><input class="cyInp" type="text" id="gskuName"/></div>
          <div class="mode_type"><div class="tag_title">发文项目J：</div></div>
          <div><span>SKU分类：</span><select id="jdSelect"></select></div>
          <div class="phone_item"><span>SKUID：</span><input class="cyInp" type="text" id="jskuId" /></div>
          <div><span>SKU名称：</span><input class="cyInp" type="text" id="jskuName"/></div>
            <div class="cyBtn_list">
                <div class="cyBtnReset"><button type="button" >重置</button></div>
                <div class="cyBtn"> <button type="button" class="cyBtn">提交</button></div>
            </div>
             <div class="loginBtn"> <button type="button" class="cyBtn">退出登录</button></div>
        </div>
        <div class="cyloading">
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
            <text x="7" y="21" font-family="Monaco" font-size="2px" style="letter-spacing:0.6" fill="#fff">达人抓取中，请勿关闭
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
    `
    $("body").append(div);
    let rex = window.location.href;
    // apiHost
    var apiHost = "https://api.oa.cyek.com/";
    const version = "6.4.1"
    // 查找抖音数据id
    function searchData(object, data) {
        for (var key in object) {
            if (object[key] == object[data]){
                // console.log(key)
                return key
            };
            for(var i in object[key]){
                // console.log(i);
                if(i == data){
                    return key;
                }
            }
        }
    }

    function req(url,data,sucFun,specialFun){
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
            onload: function(res) {
                if (res.status == 200) {
                    var text = res.responseText;
                    var json = JSON.parse(text);
                    // console.log(json);
                    if(json.code == 1000){
                        sucFun(json)
                    }else if(json.code == 1002){
                        alert(json.message);
                        localStorage.removeItem("token");
                        localStorage.removeItem("storagePhone");
                        localStorage.removeItem("storagePwd");
                        localStorage.removeItem("dep_name");
                        localStorage.removeItem("staffName");
                         localStorage.removeItem("work_num");
                        $(".cyOperate").hide();
                        $(".loginBox").show();
                    }else{
                        alert(json.message);
                        if (typeof(specialFun) == "function") {
                            specialFun()
                        }
                    }
                }
            }
        });
    }

    function getCookie(cname)
    {
        var name = cname + "=";
        var ca = document.cookie.split(';').reverse();
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }
    //登录
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
            function loginInfo(){
            if(checkphone()&&checkpwd()){
                let phone = $("#cyphoneNum").val()
                let pwd = md5($("#cypwd").val())
                // 登录传递的参数
                var data = {
                    "app_type": "tools_"+1,
                    "app_id": 1,
                    "phone": phone,
                    "pwd": pwd,
                    "v": version
                }
                // console.log(data);
                // 登录传参
                req(apiHost+"/spider/browser/login",data,function(response){
                    // 获取部门和名字 存储
                    $(".operate-name").text("欢迎你，"+response.result.dep_name+"-"+response.result.name);
                    localStorage.setItem("dep_name",response.result.dep_name);
                    localStorage.setItem("name",response.result.name);
                    localStorage.setItem("token",response.result.access_token);
                    localStorage.setItem("work_num",response.result.work_num);
                    // 获取token 存储
                    var token = localStorage.getItem("token");
                    $(".cyOperate").show();
                    $(".loginBox").hide();
                    // 获取账号密码 存储session
                    // localStorage.setItem("storagePhone",$("#cyphoneNum").val());
                    // localStorage.setItem("storagePwd",md5($("#cypwd").val()));
                    // var storagePhone = localStorage.getItem("storagePhone");
                    // var storagePwd = localStorage.getItem("storagePwd");

                })

            }
        }


        $(".login-btn button").click(function(){
            if(rex.match(/https:\/\/xh.newrank.cn/) == null){
                loginInfo()
            }
        })
        $(".loginBox").keydown(function(){
            if(event.keyCode==13 && rex.match(/https:\/\/xh.newrank.cn/) == null){
                loginInfo()
            }
        })


    //标签生成
   // const tagsArr = [{name:'G',value:10},{name:'J',value:15}];//模式列表
    let mode_type = Number(localStorage.getItem('mode_type')||10);//模式
    let cateTypeObj ={
        jdCateType:Number(localStorage?.getItem('jdCateType')||1),//JD分类
        ggCateType:Number(localStorage?.getItem('ggCateType')||1) //gg分类
    }
    const setTagDom = (className,tagClassName,arr,type)=>{
        const tagContainer = document.querySelector(className);
        arr.forEach(item => {
            const newTag = document.createElement('span');
            newTag.classList.add(tagClassName);
            newTag.innerText = item.name;
            if(type ==item.value) {
                newTag.classList.add('active_tag');
            }
            tagContainer.appendChild(newTag);
        });
    }

    //生成分类标签
    const setCateDom = (className,arr,cateType)=>{
        const tagContainer = document.querySelector(className);
        console.log(cateTypeObj[cateType],'cateTypeObj[cateType]')
        arr.forEach(item => {
            const newTag = document.createElement('option');
            newTag.value = item.value
            newTag.innerText = item.label;
            tagContainer.appendChild(newTag);
        });
        tagContainer.value = Number(cateTypeObj[cateType])
    }
    function getCateList(type,dom,cateType){
        req(apiHost+"getPostCate",{project_id:type},function(res){
            const arr = res?.result
            if(arr.length>0){
               // cateTypeObj[cateType] = arr[0]?.value
                setCateDom(dom,arr,cateType)
            }
        })
    }
    getCateList(15,"#jdSelect",'jdCateType')
    getCateList(10,"#ggSelect",'ggCateType')
    //生成分类标签结束
    const getSelect = (dom,cateType)=>{
        // 获取下拉框元素
        let ele = document.getElementById(dom);
        // 为下拉框添加change事件监听器
        ele.addEventListener('change', function(event) {
            // 获取选中的值
            cateTypeObj[cateType] = ele.value;
            localStorage.setItem(cateType,cateTypeObj[cateType]);//cateTypeObj
            // 执行回调函数的逻辑
            console.log('Selected value:', cateTypeObj);
            // 例如，可以在这里根据选中的值进行相应的操作
        });
    }
    getSelect('jdSelect','jdCateType')
    getSelect('ggSelect','ggCateType')

    const setDeviceId = ()=>{//设备标识
        const jskuId = localStorage.getItem('jskuId');//jskuid
        const jskuName = localStorage.getItem('jskuName');//jsku名称
        const gskuId = localStorage.getItem('gskuId');//gskuid
        const dyskuId = localStorage.getItem('dyskuId');//dyskuId
        const gskuName = localStorage.getItem('gskuName');//jsku名称
        const token = localStorage.getItem('token');//token
        const dep_name = localStorage.getItem('dep_name');//dep_name
        const name = localStorage.getItem('name');//name
        // 获取input元素
        if(token){$(".cyOperate").show();$(".loginBox").hide();}else{$(".loginBox").show();$(".cyOperate").hide();}
        if(jskuId) {document.getElementById('jskuId').value = jskuId}// 读取localStorage中的数据
        if(jskuName) {document.getElementById('jskuName').value =jskuName}
        if(gskuId) {document.getElementById('gskuId').value = gskuId}// 读取localStorage中的数据
        if(dyskuId) {document.getElementById('dyskuId').value = dyskuId}// 读取localStorage中的数据
        if(gskuName) {document.getElementById('gskuName').value =gskuName}
        $(".operate-name").text("欢迎你，"+dep_name+"-"+name);
    }
//搜索页
    if(rex.match(/https:\/\/www.douyin.com\/search\/*/) != null){
        setDeviceId()
        let originalSend = XMLHttpRequest.prototype.send;
        let all_list = []
        let loading = false
        XMLHttpRequest.prototype.send = function() {
            let self = this;
            // 监听readystatechange事件，当readyState变为4时获取响应
            this.onreadystatechange = function() {
                if (self.readyState === 4) {
                    if (self.responseURL.match(/https:\/\/www.douyin.com\/aweme\/v1\/web\/search\/item\/*/) != null) {
                        // 在获取到响应后执行你的操作
                        let json = JSON.parse(self.response);
                        let list = json?.data
                        console.log(list,'123123')
                        setTimeout(()=>{
                            const elements = document.querySelectorAll('.search-horizontal-new-layout .SEbmeLLH');
                            all_list.push(...list)
                            elements.forEach(function(ele,index) {
                                ele.style.position = 'relative';
                                function hasDescendantWithClassName(node, className) {
                                    // 使用querySelectorAll获取所有子孙元素
                                    const descendants = node.querySelectorAll('*');
                                    // 使用Array.prototype.some检查是否有符合条件的元素
                                    return Array.prototype.some.call(descendants, function(descendant) {
                                        return descendant.classList.contains(className);
                                    });
                                }
                                // 使用示例
                                const hasMatchingDescendant = hasDescendantWithClassName(ele, 'shop_checked');
                                if(!hasMatchingDescendant) ele.insertAdjacentHTML('beforeend', `<input class="shop_checked" type="checkbox" name=${all_list[index].aweme_info.aweme_id} value=${all_list[index].aweme_info.aweme_id}>`)
                            });
                        },2000)
                    }
                }
            };
            // 调用原始的send方法
            originalSend.apply(this, arguments);
        };
        function checkBoxes() {//提交
            let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            let values = Array.prototype.map.call(checkboxes, function(checkbox) {
                checkbox.checked = true;
                return checkbox.value;
            });
            if(values.length==0) return alert("请选择视频")
             console.log(values,'values')
            // 这里可以处理选中的值，例如发送到服务器或在控制台中显示
            if(loading) return
            loading = true
            let videoData = []
            for(let i= 0;i<all_list.length;i++){
                if(values.includes(all_list[i].aweme_info.aweme_id)){
                    const data =
                          {
                              ukey:"sec_uid",
                              uvalue:all_list[i]?.aweme_info?.author?.sec_uid,
                              title:all_list[i]?.aweme_info?.desc,
                              desc:all_list[i]?.aweme_info?.desc,
                              outside_video_id:all_list[i]?.aweme_info?.aweme_id,
                              type:all_list[i]?.aweme_info?.aweme_type==0?1:2,
                              collect_count:all_list[i]?.aweme_info?.statistics?.collect_count,
                              comment_count:all_list[i]?.aweme_info?.statistics?.comment_count ,
                              digg_count:all_list[i]?.aweme_info?.statistics?.digg_count,
                              share_count:all_list[i]?.aweme_info?.statistics?.share_count,
                              cate:JSON.stringify(all_list[i]?.aweme_info?.video_tag),
                              tag:JSON.stringify(all_list[i]?.aweme_info?.text_extra),
                              cover:all_list[i]?.aweme_info?.video.cover?.url_list?.[0]||"",
                              cover_list:JSON.stringify(all_list[i]?.aweme_info?.video?.cover?.url_list),
                              cover_width:all_list[i]?.aweme_info?.video?.cover.width,
                              cover_height:all_list[i]?.aweme_info?.video.cover.height,
                              play_addr:JSON.stringify(all_list[i]?.aweme_info?.video.play_addr),
                              bit_rate:JSON.stringify(all_list[i]?.aweme_info?.video.bit_rate),
                              video_dura:all_list[i]?.aweme_info?.music?.duration ||Math.round(Number(all_list[i]?.aweme_info?.duration/1000)),
                              video_width:all_list[i]?.aweme_info?.video.play_addr.width,
                              video_height:all_list[i]?.aweme_info?.video.play_addr.height,
                              video_size:all_list[i]?.aweme_info?.video.play_addr.data_size,
                              goods_info:all_list[i]?.aweme_info?.anchor_info?.extra||JSON.stringify([]),
                              post_time:all_list[i]?.aweme_info?.create_time,
                              images:JSON.stringify(all_list[i]?.aweme_info?.images),
                              is_top:all_list[i]?.aweme_info?.is_top,
                              anchor_info:all_list[i]?.aweme_info?.anchor_info,
                          }
                    videoData.push(data)
                }
            }
            let saveUid = {
                "platform_id":1,
                "app_type": "tools_" + 1,
                "app_id": "1",
                "sign": "1",
                "sec_uid":videoData[0]?.uvalue,
                "access_token": '',
                "result": JSON.stringify(videoData)
            }
            console.log("正在请求发文接口")
            req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
                console.log('发文信息上传完毕')
                const newArr = videoData.map(e=>({outside_video_id:e.outside_video_id,
                                                  g_name:e?.anchor_info?.type==3?JSON.parse(e?.anchor_info?.extra)?.[0]?.title:'',
                                                  g_id:e?.anchor_info?.type==3?JSON.parse(e?.anchor_info?.extra)?.[0]?.product_id:''
                                                 }))
                let jskuId = localStorage.getItem('jskuId')
                let gskuId = localStorage.getItem('gskuId')
                let dyskuId = localStorage.getItem('dyskuId')
                let jskuName = localStorage.getItem('jskuName')
                let gskuName = localStorage.getItem('gskuName')
                if(jskuId) {
                    savePost(jskuId,jskuName,Number(cateTypeObj.jdCateType),15,()=>{
                        alert("J提交成功")
                        window.location.reload()
                    })
                }
                if(gskuId){
                    savePost(gskuId,gskuName,Number(cateTypeObj.ggCateType),10,()=>{
                        alert("G提交成功")
                        window.location.reload()
                    })
                }
                function savePost(sku_id,sku_name,cate_id,type,callback){
                    let urlData = {
                        sku_id,
                        sku_name,
                        cate_id,
                        dy_sku_id:dyskuId,
                        project_id:type,
                        platform_id: 1,
                        work_num:localStorage.getItem('work_num'),
                        result: JSON.stringify(newArr),
                    }
                    req(apiHost+"savePostRecordResult",urlData,function(res){
                        console.log('视频信息上传完毕')
                        loading=false
                        callback&&callback()
                    })
                }
            })
        }
 // 提交
        $(".cyBtn button").click(function(){
            let gskuId = document.getElementById('gskuId').value
            let dyskuId = document.getElementById('dyskuId').value
            let gskuName = document.getElementById('gskuName').value
            let jskuId = document.getElementById('jskuId').value
            let jskuName = document.getElementById('jskuName').value
            if((gskuId||jskuId)||(gskuName||jskuName||dyskuId)){
                localStorage.setItem('gskuId',gskuId)
                localStorage.setItem('gskuName',gskuName)
                localStorage.setItem('jskuId',jskuId)
                localStorage.setItem('jskuName',jskuName)
                localStorage.setItem('dyskuId',dyskuId)
                checkBoxes()
            }else{
                alert("请输入SKUID")
            }
        })
 //重置
        $(".cyBtnReset button").click(function(){
            document.getElementById('gskuId').value =""
            document.getElementById('gskuName').value=""
            document.getElementById('jskuId').value =""
            document.getElementById('jskuName').value=""
            document.getElementById('dyskuId').value=""
            localStorage.removeItem("gskuId");
            localStorage.removeItem("gskuName");
            localStorage.removeItem("jskuId");
            localStorage.removeItem("jskuName");
            localStorage.removeItem("dyskuId");
        })
//退出
        $(".loginBtn button").click(function(){
            localStorage.removeItem("token");
            window.location.reload()
        })

    }
    // 登录框拖拽
    function dragInfo(yTop,yBot){
        var _move1=false;//移动标记
        var _x1,_y1;//鼠标离控件左上角的相对位置
        $(".cyOperate").click(function(){
            //alert("click");//点击（松开后触发）
        }).mousedown(function(e){
            //console.log(e);
            _move1=true;
            _x1=e.pageX-parseInt($(".cyOperate").css("left"));
            _y1=e.pageY-parseInt($(".cyOperate").css("top"));
            // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
        });
        $(document).mousemove(function(e){
            if(_move1){
                var x=e.pageX-_x1;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y1;
                // console.log("y",y);
                if(x < 0){
                    x = 0;
                }else if(x > $(document).width() - $('.cyOperate').outerWidth(true)){ // 判断是否超出浏览器宽度
                    x = $(document).width() - $('.cyOperate').outerWidth(true)
                }
                if (y < yTop) {
                    y = yTop;
                } else if (y > $(window).height() - $('.cyOperate').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                    y = $(window).height() - $('.cyOperate').outerHeight(true) + yBot;
                }
                $(".cyOperate").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move1=false;

            // 记录每次拖拽后位置存储
            localStorage.setItem("elLeftLogin",$(".cyOperate").css("left"));
            localStorage.setItem("elTopLogin",$(".cyOperate").css("top"));
            // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
    }
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
    $(".cyOperate").css({
        "left": elLeftLogin,
        "top": elTopLogin
    })



    // 登录框收起展开
    dragInfo1(100,0)
    dragInfo(100,0)

})();