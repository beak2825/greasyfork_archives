// ==UserScript==
// @name         畅想之星小助手
// @namespace    https://qinlili.bid
// @version      0.4
// @description  图片批量下载，解除复制保护，自动验证码
// @author       琴梨梨
// @match        *://*/onlineepub?*
// @match        *://*/onlinebook?ruid=*&pinst=*
// @match        *://*/Account/Login?*
// @match        *://*/Account/UserLogin?*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/420113/%E7%95%85%E6%83%B3%E4%B9%8B%E6%98%9F%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/420113/%E7%95%85%E6%83%B3%E4%B9%8B%E6%98%9F%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //登陆页面
    if(document.location.pathname.indexOf("Account")>0){
        var vCode="114514";
        //拦截XHR
        (function(open) {
            XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
                console.log(vCode)
                if((url.indexOf("GetLoginRandomCode")>0)&&!(vCode=="114514")){
                    url= "data:text/plain,"+vCode;
                }
                open.call(this, method, url, async, user, pass);
            };
        })(XMLHttpRequest.prototype.open);
        //读取验证码
        var xhr = new XMLHttpRequest();
        xhr.onload = event => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                vCode= xhr.response;
                console.log("验证码是"+vCode)
                $("#codeCover").click();
                setTimeout(function(){document.getElementById("vcode").value=vCode;$('#showInfor').html("琴梨梨为你自动填写验证码");},250)
            }
            xhr.onerror = function (e) {
                logcat("验证码读取失败")
            }
        }
        xhr.open('GET',document.location.origin+"/Account/GetLoginRandomCode");
        xhr.send();
    }
    //EPUB
    if(document.location.pathname.indexOf("onlineepub")>0){
        //右键复制
        $(document).unbind("contextmenu", null);
        $("#page_container").unbind("mouseup",null);
        //按钮复制
        //var copyBtn=document.getElementsByClassName("marker-menu-item marker-menu-item-copy")[0];
        //copyBtn.addEventListener("click",function(e){
        //    e.preventDefault();
        //})
    }
    //图片爬虫
    if(document.location.pathname.indexOf("onlinebook")>0){
        document.body.oncontextmenu = ""
        var pageTotal = 0;
        var picUrl = ""
        //从0开始，为实际页码减一
        var pageCurrent = 0;
        //下载指定页面图片
        function downloadPic(page) {
            picUrl = path + "&pageNo=" + page + "&" + getNonceStr();
            fetch(picUrl).then(res => res.blob().then(blob => {
                var a = document.createElement('a');
                var url = window.URL.createObjectURL(blob);
                var filename = page + '.jpg';
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
                if(pageCurrent<pageTotal){
                    pageCurrent++;
                    downloadPic(pageCurrent);
                }
            }))
        }
        //批量下载
        function batchDownload() {
            pageTotal = document.getElementById("sumNumb").innerText - 1;
            downloadPic(pageCurrent)
        }
        //创建下载按钮
        var downloadBtn = document.createElement("a");
        downloadBtn.innerText = "批量下载全书";
        downloadBtn.onclick = function () { batchDownload() };
        document.querySelector("body > div.divcenter > div.bq > div.bqmiddle > div.ml").appendChild(downloadBtn);
    }
})();