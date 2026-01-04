// ==UserScript==
// @name         My Collection to CC98 QMD
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  同步CC98抽卡游戏的收藏至CC98签名档
// @author       Q&A
// @match        https://card.cc98.org/Home/Collection
// @match        https://www.cc98.org
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cc98.org
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @resource     toastrCSS https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/449683/My%20Collection%20to%20CC98%20QMD.user.js
// @updateURL https://update.greasyfork.org/scripts/449683/My%20Collection%20to%20CC98%20QMD.meta.js
// ==/UserScript==
/* globals html2canvas, toastr */
(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("toastrCSS"));
    let toastr_title = "My Collection to CC98 QMD";
    toastr.options.timeOut = 5000;
    toastr.options.extendedTimeOut = 5000;
    toastr.options.newestOnTop = false;
    toastr.options.progressBar = true;
    toastr.options.positionClass = "toast-top-center";

    // 从 www.cc98.org 的 localStorage 获取 accessToken
    if ("www.cc98.org" === location.host) {
        if(!GM_getValue("update_token", false)) return;
        let access_token = localStorage.getItem("accessToken");
        if(null !== access_token) {
            GM_setValue("access_token", access_token.slice(4));
            toastr.success("获取accessToken成功！",toastr_title);
            GM_setValue("update_token", false);
        } else {
            toastr.error("获取accessToken失败！",toastr_title);
        }
        return;
    }
    // 日期格式化字符串
    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,
            "d+" : this.getDate(),
            "h+" : this.getHours(),
            "m+" : this.getMinutes(),
            "s+" : this.getSeconds(),
            "q+" : Math.floor((this.getMonth()+3)/3),
            "S"  : this.getMilliseconds()
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }
    // base64转文件
    function dataURLtoFile(base64Str, fileName) {
        var arr = base64Str.split(','),
            mime = arr[0].match(/:(.*?);/)[1], //base64解析出来的图片类型
            bstr = atob(arr[1]), //对base64串进行操作，去掉url头，并转换为byte   atob为window内置方法
            len = bstr.length,
            ab = new ArrayBuffer(len), //将ASCII码小于0的转换为大于0
            u8arr = new Uint8Array(ab); //
        while (len--) {
            u8arr[len] = bstr.charCodeAt(len)
        }
        // 创建新的 File 对象实例[utf-8内容，文件名称或者路径，[可选参数，type：文件中的内容mime类型]]
        return new File([u8arr], fileName, {
            type: mime
        })
    }

    // 添加按钮
    document.getElementsByClassName("alert alert-info")[0].innerHTML += "<a href=\"javascript:myCollection2CC98()\" class=\"alert-link\">单击这里</a>同步我的收藏至CC98签名档。"
    unsafeWindow.myCollection2CC98 = function() {
        console.log("My Collection to CC98 QMD!");
        let card_group = document.getElementsByClassName("card-group")[0];
        html2canvas(card_group).then(canvas => {
            // 生成图片
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            let image_file = dataURLtoFile(image.src, "card-group.png");
            // 获取accessToken
            let access_token = GM_getValue("access_token", "");
            if("" === access_token) {
                GM_setValue("update_token", true);
                toastr.error("【0/3】请<button onclick=\"window.open('https://www.cc98.org')\">点我打开cc98.org</button>获取accessToken！",toastr_title);
                return;
            }
            toastr.success("【1/3】已成功获取accessToken！（token: "+access_token.slice(0,5) + "……" + access_token.slice(-5)+"）",toastr_title);
            // 上传文件至cc98服务器，获取图片URL
            var form = new FormData();
            form.append("files", image_file, "card-group.png");
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.cc98.org/file",
                headers: {
                    Authorization: access_token
                },
                data: form,
                onload: function(res){
                    if(res.status === 200){
                        let img_url = JSON.parse(res.response)[0];
                        toastr.success("【2/3】已成功上传图片至98服务器！（URL: " + img_url +"）",toastr_title);
                        // 更新签名档
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "https://api.cc98.org/me",
                            headers:  {
                                Authorization: access_token
                            },
                            onload: function(res){
                                if(res.status == 200) {
                                    let me = JSON.parse(res.response);
                                    let birthday = new Date(me.birthday);
                                    let update_me = {
                                        Birthday: birthday.format("yyyy-MM-dd"),
                                        DisplayTitleId: me.displatTitleId?me.displatTitleId:0,
                                        EmailAddress: me.emailAddress,
                                        Gender: me.gender,
                                        Introduction: me.introduction,
                                        QQ: me.qq,
                                        SignatureCode: "[img]" + img_url + "[/img]\n[right]Updated at " + new Date().format("yy-MM-dd hh:mm:ss")+" | Powered by [url=https://greasyfork.org/zh-CN/scripts/449683][b][u]My Collection to CC98 QMD[/u][/b][/url][/right]",
                                        birthdayDay: birthday.getDate(),
                                        birthdayMonth: birthday.getMonth()+1,
                                        birthdayYear: birthday.getFullYear(),
                                        userTitleIds: me.userTitleIds
                                    }
                                    GM_xmlhttpRequest({
                                        method: "PUT",
                                        url: "https://api.cc98.org/me",
                                        headers:  {
                                            Authorization: access_token,
                                            "Content-Type": "application/json"
                                        },
                                        data: JSON.stringify(update_me),
                                        onload: function(res) {
                                            if(res.status == 200) {
                                                toastr.success("【3/3】已成功更新个人资料，请<button onclick=\"window.open('https://www.cc98.org/usercenter')\">点我打开cc98.org</button>查看！",toastr_title)
                                            } else {
                                                console.log(res);
                                                toastr.error("【2/3】更新个人资料失败，请重试！",toastr_title);
                                            }
                                        }
                                    });
                                } else {
                                    console.log(res);
                                    toastr.error("【2/3】获取个人资料失败，请重试！",toastr_title);
                                }
                            }
                        });
                    }else{
                        console.log(res);
                        GM_setValue("update_token", true);
                        toastr.error("【1/3】上传失败，请<button onclick=\"window.open('https://www.cc98.org')\">点我打开cc98.org</button>重新获取accessToken！",toastr_title);
                    }
                },
                onerror : function(err){
                    console.log(err);
                }
            });
        });
    }
})();