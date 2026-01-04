// ==UserScript==
// @name         网址黑名单拦截工具
// @namespace    https://www.codekpy.site
// @version      0.1
// @description  可以帮助您规避违规网址
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457149/%E7%BD%91%E5%9D%80%E9%BB%91%E5%90%8D%E5%8D%95%E6%8B%A6%E6%88%AA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/457149/%E7%BD%91%E5%9D%80%E9%BB%91%E5%90%8D%E5%8D%95%E6%8B%A6%E6%88%AA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function(){
    'use strict';
    function more(){
        console.log("触发了")
    }
    let main={
        registerMenuCommand(){
            GM_registerMenuCommand('阿巴',()=>{
                console.log("test")})}};
    var json=0
    var httpRequest=new XMLHttpRequest();
    httpRequest.open('GET','https://www.codekpy.site/api/url/index.php',true);
    httpRequest.send();
    httpRequest.onreadystatechange=function(){
        if(httpRequest.readyState==4&&httpRequest.status==200){
            var json=httpRequest.responseText;
            var json_now=json;
            if(json.indexOf(window.location.href)!=-1){
                console.log("触发");
                alert("该网页存在不良信息，请谨慎浏览")
            }
        }
    };
    function loadJS(url,callback){
        var script=document.createElement('script'),fn=callback||function(){};
        script.type='text/javascript';
        if(script.readyState){
            script.onreadystatechange=function(){
                if(script.readyState=='loaded'||script.readyState=='complete'){
                    script.onreadystatechange=null;fn()
                }
            }
        }else{
            script.onload=function(){
                fn()
            }
        }
        script.src=url;document.getElementsByTagName('head')[0].appendChild(script)
    }
    var div=document.createElement("div");
    div.style="position: fixed;bottom: 0;right: 0;z-index:9999;";
    div.id="div_kzh";
    var jscode="<script>function onclick(){var eee=0;var url_form = document.getElementById('url_form');if(eee ==0){var eee = 1;url_form.style=' '}else{var eee = 0;url_form.style='display:none;}}</script>";
    var form="<form action='https://www.codekpy.site/api/url/add.php' method='post' id='url_form'  style='display:none;'><p>输入URL:<input type='text' name='url'></p><input type='submit'></form>";
    var iframe="<iframe id='myIframe' name='myIframe' style='display:none;'></iframe>";
    var p_open="<p style='float:left;font-size:10px' onclick='$(\"#url_form\").show()'>";
    var p="增加黑名单 开";
    var p_close="</p><p style='float:right;font-size:10px' onclick='$(\"#url_form\").hide()'>  /关</p>"
    div.innerHTML=jscode+form+iframe+p_open+p+p_close;
    console.log(div);
    var body=document.getElementsByTagName('body')[0];
    console.log(body);
    body.append(div);
    console.log(jscode+form+iframe+p_open+p+p_close);
})();
