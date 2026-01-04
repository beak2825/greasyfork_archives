// ==UserScript==
// @name         CAS登录
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      AGPL-3.0-or-later
// @description  CAS登录1212
// @author       You
// @match        *://jwxk.jnu.edu.cn/xsxkapp/sys/xsxkapp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jnu.edu.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/482812/CAS%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/482812/CAS%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
//https://icas.jnu.edu.cn/cas/login*,
(function() {
    'use strict';

    //var lt = $("#lt").val();
	//var $u = $("#un") , $p=$("#pd");
	//var u = $u.val().trim();
    //var p = $p.val().trim();
    //u = '2020101505';
    //p = 'WNs101505';
	//$("#ul").val(u.length);
	//$("#pl").val(p.length);
	//$("#rsa").val(strEnc(u+p+lt , '1' , '2' , '3'));
    //console.log($("#loginForm")[0]);
	//$("#loginForm")[0].submit();

    var regex = /^https?:\/\/icas\.jnu\.edu\.cn\/cas\/login.*$/;
    if(regex.test(window.location.href)){
        var u = '2020101505';
        var p = 'WNs101505';
        var lt = $("#lt").val();
        var $u = $("#un") , $p=$("#pd");
        $u.val(u);
        $p.val(p);
        $("#ul").val(u.length);
        $("#pl").val(p.length);
        $("#rsa").val(strEnc(u+p+lt , '1' , '2' , '3'));
        console.log($("#loginForm")[0]);
        //$("#loginForm")[0].submit();

        unsafeWindow.submit = () => {
            var formData = $("#loginForm").serialize();
            $.ajax({
                url: $('#loginForm').attr('action'), // 替换成实际的 POST 请求地址
                type: 'POST',
                data: formData, // 使用序列化后的表单数据作为请求参数
                success: function(response) {
                    // 请求成功时的处理
                    console.log('Post请求成功:', response);
                },
                error: function(xhr, status, error) {
                    // 请求失败时的处理
                    console.error('Post请求失败:', status, error);
                }
            });

        }
    }

    // 当页面加载完成后再执行脚本，避免脚本重复执行
    window.onload = function () {
        unsafeWindow.studentInfo = JSON.parse(sessionStorage.getItem('studentInfo'));
        unsafeWindow.info = (uid) => {
            //用的token一定要是在后面获取的，如果是在进入页面前获取的将不符合
            loginInUserRegister(uid).done(function(resp){
                var code = resp.code;
                var data = resp.data;
                if (code != null && code == "1") {
                    var number = data.number;// 学号
                    var token = data.token;// 登录凭证
                    var oToken = sessionStorage.getItem('token',oToken);
                    sessionStorage.removeItem('token');
                    sessionStorage.setItem('token',token);
                    queryStudentInformation(uid).done(res=>{
                        console.log(res);
                        sessionStorage.setItem('token',oToken);
                    });
                }

            });
        }
        unsafeWindow.sc = (tid,uid) => {
            //用的token一定要是在后面获取的，如果是在进入页面前获取的将不符合
            loginInUserRegister(uid).done(function(resp){
                var code = resp.code;
                var data = resp.data;
                if (code != null && code == "1") {
                    var number = data.number;// 学号
                    var token = data.token;// 登录凭证
                    var oToken = sessionStorage.getItem('token',oToken);
                    sessionStorage.removeItem('token');
                    sessionStorage.setItem('token',token);
                    var queryParam = buildQueryTCParam(tid);
                    var querySetting = JSON.parse(queryParam.querySetting);
                    querySetting.data.studentCode = uid;
                    queryPublicCourse({querySetting:JSON.stringify(querySetting)}).done(res=>{
                        console.log(res);
                        sessionStorage.setItem('token',oToken);
                    });
                }

            });
        }

        unsafeWindow.qc = (uid) => {
                        //用的token一定要是在后面获取的，如果是在进入页面前获取的将不符合
            loginInUserRegister(uid).done(function(resp){
                var code = resp.code;
                var data = resp.data;
                if (code != null && code == "1") {
                    var number = data.number;// 学号
                    var token = data.token;// 登录凭证
                    var oToken = sessionStorage.getItem('token',oToken);
                    sessionStorage.removeItem('token');
                    sessionStorage.setItem('token',token);
                    var queryParam = {studentCode: number,electiveBatchCode:studentInfo.electiveBatch.code};
                    queryChooseCourse(queryParam).done(res=>{
                        console.log(res);
                        sessionStorage.setItem('token',oToken);
                    });
                }
            });
        }

        unsafeWindow.cc = (tic,uid) => {
            //用的token一定要是在后面获取的，如果是在进入页面前获取的将不符合
            loginInUserRegister(uid).done(function(resp){
                var code = resp.code;
                var data = resp.data;
                if (code != null && code == "1") {
                    var number = data.number;// 学号
                    var token = data.token;// 登录凭证
                    var oToken = sessionStorage.getItem('token',oToken);
                    sessionStorage.removeItem('token');
                    sessionStorage.setItem('token',token);
                    var grade = null;//'1';
                    var addParam = JSON.parse(buildAddVolunteerParam(tic).addParam);
                    addParam.data.studentCode = uid;
                    addVolunteer(addParam).done(res=>{
                        console.log(res);
                        sessionStorage.setItem('token',oToken);
                    });
                }
            });
        }

        unsafeWindow.dc = (tid,uid)=>{
            //用的token一定要是在后面获取的，如果是在进入页面前获取的将不符合
            loginInUserRegister(uid).done(function(resp){
                var code = resp.code;
                var data = resp.data;
                if (code != null && code == "1") {
                    var number = data.number;// 学号
                    var token = data.token;// 登录凭证
                    var oToken = sessionStorage.getItem('token',oToken);
                    sessionStorage.removeItem('token');
                    sessionStorage.setItem('token',token);
                    var studentCode = uid; // 学号
                    var electiveBatch = studentInfo.electiveBatch;
                    var electiveBatchCode = electiveBatch.code;
                    var delData = '{"operationType":"2"' + ',"studentCode":"' + studentCode + '"' + ',"electiveBatchCode":"' + electiveBatchCode + '"' + ',"teachingClassId":"' + tid + '"' + ',"isMajor":"1"}';
                    var delStr = '{"data":' + delData + '}';
                    var deleteParam = {
                        'deleteParam': delStr
                    };
                    deleteVolunteerResult(deleteParam).done(res=>{
                        console.log(res);
                        sessionStorage.setItem('token',oToken);
                    });
                }
            });
        }
    }




})();