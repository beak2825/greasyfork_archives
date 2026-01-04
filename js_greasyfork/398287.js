// ==UserScript==
// @name         微信公众平台登录助手COS版
// @namespace    https://mp.weixin.qq.com/*
// @version      1.2
// @description  首次使用时请先配置COS.微信公众平台首次登录时会自动保存账号密码到COS,再次登录时点击页面中对应账号图标即可跳转到扫码页面,无需再次输入账号密码.
// @author       lihouguanggreat@gmail.com
// @match        https://mp.weixin.qq.com/*
// @require https://greasyfork.org/scripts/398293-cos-auth/code/cos-auth.js?version=782527
// @require https://greasyfork.org/scripts/398294-cos-js-sdk-v5/code/cos-js-sdk-v5.js?version=782530
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      https://cdn.bootcss.com/blueimp-md5/2.11.0/js/md5.min.js
// @require https://greasyfork.org/scripts/396391-dialog/code/dialog.js?version=772234
// @grant unsafeWindow
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_log
// @grant GM_deleteValue
// @grant GM_addStyle
// @grant GM_notification
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/398287/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%B9%B3%E5%8F%B0%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8BCOS%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/398287/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%B9%B3%E5%8F%B0%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8BCOS%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let jquery = jQuery.noConflict();
    jquery(function(){
        // 请求用到的参数
        let Bucket = 'account-1000000';
        let Region = 'ap-beijing';
        let SecretId = "AKIDYu3HGz0hhRw00000000i6E";
        let SecretKey = "1nKflbDeq000000000000000Nkri";
        let dir = "";//请勿修改此值
        // 对更多字符编码的 url encode 格式
        var camSafeUrlEncode = function (str) {
            return encodeURIComponent(str)
                .replace(/!/g, '%21')
                .replace(/'/g, '%27')
                .replace(/\(/g, '%28')
                .replace(/\)/g, '%29')
                .replace(/\*/g, '%2A');
        };

        // 计算签名
        var getAuthorization = function (options, callback) {
            var authorization = COS.getAuthorization({
                SecretId: SecretId,
                SecretKey: SecretKey,
                Method: options.Method,
                Pathname: options.Pathname,
                Query: options.Query,
                Headers: options.Headers,
                Expires: 900,
            });
            callback({
                Authorization: authorization,
            });

        };

        // 上传文件
        var uploadFile = function (file, callback) {
            let protocol = location.protocol === 'https:' ? 'https:' : 'http:';
            let prefix = protocol + '//' + Bucket + '.cos.' + Region + '.myqcloud.com/';
            var Key = dir + file.name; // 这里指定上传目录和文件名
            getAuthorization({Method: 'POST', Pathname: '/'}, function (info) {
                var fd = new FormData();
                fd.append('key', Key);
                fd.append('signature', info.Authorization);
                fd.append('Content-Type', '');
                fd.append('file', file);
                var url = prefix;
                var xhr = new XMLHttpRequest();
                xhr.open('POST', url, true);
                xhr.upload.onprogress = function (e) {
                    console.log('上传进度 ' + (Math.round(e.loaded / e.total * 10000) / 100) + '%');
                };
                xhr.onload = function () {
                    callback('文件 ' + Key + ' 上传失败，状态码：' + xhr.status);
                };
                xhr.onerror = function () {
                    callback('文件 ' + Key + ' 上传失败，请检查是否没配置 CORS 跨域规则');
                };
                xhr.send(fd);
            });
        };
        let cos = new COS({
            getAuthorization: getAuthorization,
        });
        let getFileContent = function(key,callback){
            cos.getObject({
                Bucket: Bucket,
                Region: Region,
                Key: key,
            }, function(err, data) {
                callback(JSON.parse(data.Body));
                //console.log(err || JSON.parse(data.Body));
            });
        }
        function compare(p){ //这是比较函数
            return function(m,n){
                var a = m[p];
                var b = n[p];
                return a - b; //升序
            }
        }
        if(window.location.href.indexOf('https://mp.weixin.qq.com/?')==0||window.location.href=="https://mp.weixin.qq.com/"){
            //插入列表html
            let css = '.account-icon{position: absolute;left: 2px;top: 3px;}.my-account-list{width:60pc;margin:auto;display:flex;flex-direction:row;flex-wrap:wrap;padding:20px 0 0;box-sizing:border-box}.account-item{position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center;width:5pc;height:5pc;overflow:hidden;cursor:pointer}.account-item:hover{background-color:#eee}.account-logo{width:50px;height:50px}.account-logo img{width:100%;height:auto}.account-name{text-align:center;font-size:9pt;width:5pc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}';
            let style = jquery("<style>").html(css);
            jquery('head').append(style);
            let template_1 = jquery("<div>").attr({class:"my-account-list"});
            jquery("#body").prepend(template_1);
            //账号模板
            let template_item = '<div class="account-item" data-username="#username#" data-password="#password#"><div class="account-logo"><img src="#logo#"></div><div class="account-name">#name#</div><img src="#icon#" class="account-icon"></div>';
            let mini_icon = "https://account-1258437818.cos.ap-beijing.myqcloud.com/resourece/mini_account_icon.png";
            let official_icon = "https://account-1258437818.cos.ap-beijing.myqcloud.com/resourece/official_account_icon.png";
            //查询已保存的小程序账号
            cos.getBucket({
                Bucket: Bucket,
                Region: Region,
                Prefix: "mini_account/",
            }, function(err, data) {
                let mini_account = data.Contents;
                if(mini_account.length>0){
                    //排序
                    for (let i=0;i<mini_account.length;i++){
                        mini_account[i]["modified"] = new Date(mini_account[i]["LastModified"]).getTime();
                    }
                    mini_account.sort(compare("modified"));
                    for (let i=0;i<mini_account.length;i++){
                        getFileContent(mini_account[i]["Key"],function(account){
                            //console.log(account);
                            let temp = template_item;
                            temp = temp.replace(/#logo#/,account.logo);
                            temp = temp.replace(/#name#/,account.name);
                            temp = temp.replace(/#username#/,account.username);
                            temp = temp.replace(/#password#/,account.password);
                            temp = temp.replace(/#icon#/,mini_icon);
                            jquery(".my-account-list").append(temp);
                        });
                    }
                }
            });
            //查询已保存的公众号
            cos.getBucket({
                Bucket: Bucket,
                Region: Region,
                Prefix: "official_account/",
            }, function(err, data) {
                let official_account = data.Contents;
                if(official_account.length>0){
                    //排序
                    for (let i=0;i<official_account.length;i++){
                        official_account[i]["modified"] = new Date(official_account[i]["LastModified"]).getTime();
                    }
                    official_account.sort(compare("modified"));
                    for (let i=0;i<official_account.length;i++){
                        getFileContent(official_account[i]["Key"],function(account){
                            //console.log(account);
                            let temp = template_item;
                            temp = temp.replace(/#logo#/,account.logo);
                            temp = temp.replace(/#name#/,account.name);
                            temp = temp.replace(/#username#/,account.username);
                            temp = temp.replace(/#password#/,account.password);
                            temp = temp.replace(/#icon#/,official_icon);
                            jquery(".my-account-list").append(temp);
                        });
                    }
                }
            });

            //点击图标登录
            jquery(document).on('click',".account-item",function(){
                let username = jquery(this).data('username');
                let pwd = jquery(this).data('password').length===32?jquery(this).data('password'):md5(jquery(this).data('password'));
                let account = {username:username,password:pwd};
                jquery.cookie("account",JSON.stringify(account));
                jquery.post('https://mp.weixin.qq.com/cgi-bin/bizlogin?action=startlogin',{
                    "username":username,
                    "pwd":pwd,
                    "imgcode":"",
                    "f":"json",
                    "userlang":"zh_CN",
                    "redirect_url":"",
                    "token":"",
                    "lang":"zh_CN",
                    "ajax":"1",
                },res=>{
                    //错误的返回 {"base_resp":{"err_msg":"acct/password error","ret":200023}}
                    //正确的返回 {"base_resp":{"err_msg":"ok","ret":0},"redirect_url":"/cgi-bin/bizlogin?action=validate&lang=zh_CN&account=sxshequtuangou%40sina.com"}
                    if(res.base_resp.ret==0){
                        window.location.href=res.redirect_url;
                    }else{
                       Dialog.error( "错误提示", res.base_resp.err_msg);
                    }
                },"JSON")
            })

            //新账号登录监听
            jquery(document).on("click",".btn_login",_=>{
                let username = jquery("[name=account]").val();
                let password = jquery("[name=password]").val();
                let account = {username:username,password:password};
                console.log(account);
                jquery.cookie("account",JSON.stringify(account));
            })
        }

        //登录成功
        let pathname = window.location.pathname;
        if(pathname.indexOf("/wxamp/index/index")===0 || pathname.indexOf("/cgi-bin/home") === 0 ||  pathname.indexOf("/wxamp/home/guide") === 0){
            //console.log(111)
            //小程序登录成功,保存账号
            let data = JSON.parse(jquery.cookie("account"));
            if(pathname.indexOf("/wxamp/index/index")===0 ||pathname.indexOf("/wxamp/home/guide") === 0){
                dir = "mini_account/";
                data["logo"] = jquery(".user_avatar").attr("src");
                data["name"] = jquery(".user_name").text();
                console.log("小程序登录成功",data);
            }
            //公众号登录成功,保存账号
            if(window.location.href.indexOf("https://mp.weixin.qq.com/cgi-bin/home") === 0){
                dir = "official_account/";
                data["logo"] = jquery(".weui-desktop-account__thumb").attr("src");
                data["name"] = jquery(".weui-desktop-account__nickname").text();
                console.log("公众号登录成功",data);
            }

            //上传文件
            if(typeof data.logo !== "undefined" && typeof data.name !== "undefined"){

                let file = new File([JSON.stringify(data)], `${data.username}.json`, {type: "application/json"});
                uploadFile(file, function (err, data) {
                    console.log(err || data);
                });
            }else{
                console.log('logo或name未获取到',data);
                window.location.href = window.location.href;
            }
        }
    });
})();