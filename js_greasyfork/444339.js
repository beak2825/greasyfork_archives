// ==UserScript==
// @name         nmliaoliao
// @namespace    <a onclick="app.openUrl('http://tampermonkey.net/')">http://tampermonkey.net/</a >
// @version      0.2.1
// @description  nmliaotian
// @author       You
// @match        <a onclick="app.openUrl('http://*/*')">http://*/*</a >
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @include      *://*.nmliaoliao.cn**
// @include      *://v1.*.cn**
// @include      *://v2.*.cn**
// @downloadURL https://update.greasyfork.org/scripts/444339/nmliaoliao.user.js
// @updateURL https://update.greasyfork.org/scripts/444339/nmliaoliao.meta.js
// ==/UserScript==
// @require      <a onclick="app.openUrl('https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js')">https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js</a >
(function() {
    'use strict';
    $("body").prepend("<p style='position:absolute;z-index:998;left:40%' id='info'></p >");
    $($(".layui-form-radio")[0]).trigger("click");
    $("#msg_tips").trigger("click");
$("body").prepend("<button style='position: absolute;z-index:999;right:20%;bottom:500px;' id='auto'>自动匹配</button>");

$('#auto').click(()=>{
var aa = setInterval( function(){
        $("#ButtonRandom").trigger("click");
        setTimeout(
            function(){
                var sex = $("#randomSelInfo").text().indexOf("性别：女");
                if(sex>0){
                    clearInterval(aa);
                    $("#info").html($("#randomSelInfo").text());
                    $("#randomCancel").trigger("click");
                }else{
                    $("#doBlack").trigger("click");
                    $(".layui-layer-btn0").trigger("click");
                    $("#btn_random_return").trigger("click");
                }
            },1000)
    } ,2000)
});

    })();