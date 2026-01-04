// ==UserScript==
// @name         dxcUtils
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  neusoft dxc auto login
// @author       cc
// @match        */dxmanager/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426797/dxcUtils.user.js
// @updateURL https://update.greasyfork.org/scripts/426797/dxcUtils.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function automatic(){
        var username=$("#j_username");
        var pwd=$("#j_password");
        username.val("admin");
        pwd.val("1");
        // Your code here...
    }
    var CodeImg=$("#jcaptcha")[0];
    //var url="http://127.0.0.1:9002/";
    //var url="http://192.168.0.101:9002/";
    var url="http://10.179.7.38:9002/";
    /**
		 * 将图片转换为Base64
		 */
    window.image2Base64= function(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    }
    window.getCode=function(base64Str){
        //   $.post(url+"/ves/ocr",base64Str,function(result){
        //     console.log(result);
        // });

        $.ajax({
            url: url+"/ves/ocr",
            type: "post",
            data: base64Str,
            processData: false, // 告诉jQuery不要去处理发送的数据
            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
            dataType: 'text',
            success: function(data) {
                var params = JSON.parse(data)
                //console.log(params);
                //console.log(params);
                var result=params.data;
                $("#jcaptcha_response").val(result);
                $("#loginButton").click();
            },
            error: function(data) {
                //window.reload;
            }
        });

    }


    setTimeout(function(){
        if ( $("#jcaptcha").length > 0 ) {
            automatic();
            var str= image2Base64(CodeImg);
            //console.log(str);
            getCode(str);
        }else{
            console.log("不在登录页");
        }


    },1000);
})();