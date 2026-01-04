// ==UserScript==
// @name         夸克云盘
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description   解除浏览器大文件下载,自定义提取码
// @author       by小怪

// @match        https://pan.quark.cn/s/*
// @match        https://pan.quark.cn/list*
// @connect      drive.quark.cn
// @connect      pan.quark.cn
// @icon         https://pan.quark.cn/favicon.ico
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @run-at       document-body
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/448602/%E5%A4%B8%E5%85%8B%E4%BA%91%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/448602/%E5%A4%B8%E5%85%8B%E4%BA%91%E7%9B%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow = unsafeWindow || window;
    var $ = $ || window.$;
    var quark = {
        file:[]
    };

    class XMLHttp {
        request_m = function (param) {};
        response_m = function (param) {};
        request_s = function (param) {};
        response_s = function (param) {};
    }
    let http = new XMLHttp();

    //分享页面
    quark.sharePage=function(){
        // XMLHttpRequest 拦截
        http.request_s = function (param) {
            //console.log(param, "---request");
            // if (res.config.url.includes("file/sort")) {
            // console.log(JSON.parse(res.response));

            //}
        };
        http.response_s = function (res) {
            //console.log(res, "---response");
            //文件详情
            if (res.config.url!=null&&res.config.url.includes("share/sharepage/detail")) {
                console.log(JSON.parse(res.response));
//                 quark.download('94a968da04694fb6aa25fb0e214a7767',function(result){
//                     console.log('下载---',result);

//                 });
//                 quark.play('94a968da04694fb6aa25fb0e214a7767',function(result){
//                     console.log('获取视频---',result);

//                 });
            }

        }
        // 初始化 XMLHttpRequest
        quark.initXMLHttpRequest_s();



    }

    //主页面
    quark.mainPage=function(){
        //监听
        // XMLHttpRequest 拦截
        http.request_m = function (param) {
            console.log(param, "---request");
            // if (res.config.url.includes("file/sort")) {
            // console.log(JSON.parse(res.response));

            //}
        };
        http.response_m = function (res) {
            console.log(res, "---response");
            //获取列表
            if (res.config.url!=null&&res.config.url.includes("file/sort")) {
                console.log(JSON.parse(res.response));
                quark.mainList(JSON.parse(res.response));
            }
            //判断分享码是否一样
            if (res.config.url!=null&&res.config.url.includes("/share/password?pr=ucpro&fr=pc")) {
                var share_pwd = localStorage.getItem("share_pwd");
                if (share_pwd!=null&&JSON.parse(res.response).data.passcode == share_pwd) {
                    quark.showTipSuccess("自定义分享密码 成功");
                }
                else {
                    localStorage.removeItem("share_pwd");
                    quark.showTipError("自定义分享密码 失败，请修改分享密码后重试");
                }
            }



        }
        // 初始化 XMLHttpRequest
        quark.initXMLHttpRequest_m();

    }
    //获取列表
    quark.mainList=function(result){
        //获取每个下载地址
        let arr=[];
        for(let i=0; i<result.data.list.length;i++){
            if(!result.data.list[i].format_type==""){
                arr.push(result.data.list[i].fid);
            }
        }
        quark.file=arr;

        if(document.getElementById("file-list")){

            //存在
        }else{
            //不存在
            //展示按钮
            var html = '<button type="button" class="ant-btn btn-file ant-btn-primary btn-create-folder" id="file-list"><img class="btn-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAMKADAAQAAAABAAAAMAAAAAD4/042AAABAklEQVRoBe1XQQ6EIAzUPfiH3Rf7Dh+nz2DbhINLphrpIkiGhKgjxXaGJuMwcJABMkAGumMghDDJnGWucer99JhCY/Jy+RnzkwpQ5tOxlihgLLGpZo72HWUg3IO9PMEtxLKA2ipQASrgZIBHyEmgO5wKuCl0btCvAmJn9pY4NWaHzxaph0H4pZrCPCseA/G296OmFTfdoeSo9vdtsXkzvomR/aBv9tsDUu2CKq6EXc9FjlB2E/+xRU6b2OwBD9NaAIrnHxlgpesmBvW2B1GB2ppQASrgZIBHyEmgO5wKGBRuAEcYWHYNKqXAAtJAGFjWAJRY8VNL3EDKTIEMkAEykMnAFyXm+VFrbT4RAAAAAElFTkSuQmCC"><span>文件下载列表</span></button>';
            $(".btn-main").append(html);
        }

        //监听按钮打开
        $(document).on("click", "#file-list", function () {
            //alert(1);
            let html_model_list='<div><div class="ant-modal-root" id="model-list"><div class="ant-modal-mask"></div><div tabindex="-1" class="ant-modal-wrap ant-modal-centered" role="dialog" aria-labelledby="rcDialogTitle1"><div role="document" class="ant-modal move-to-modal" style="width: 720px; transform-origin: 724px 405px;"><div tabindex="0" aria-hidden="true" style="width: 0px; height: 0px; overflow: hidden; outline: none;"></div><div class="ant-modal-content"><button type="button" aria-label="Close" class="ant-modal-close"><span class="ant-modal-close-x" id="close-list"><i aria-label="图标: close"class="anticon anticon-close ant-modal-close-icon"><svg viewBox="64 64 896 896"focusable="false" class="" data-icon="close" width="1em" height="1em"fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg></i></span></button><div class="ant-modal-header"><div class="ant-modal-title" id="rcDialogTitle1">下载列表</div></div><div class="ant-modal-body"><div class="move-to-container"><ul class="ant-tree ant-tree-directory" role="tree" unselectable="on">';
            quark.download(quark.file,function(result){
                for(let i=0; i<result.length;i++){
                    html_model_list+='<li class="ant-tree-treenode-switcher-open ant-tree-treenode-selected" role="treeitem">'+(i+1)+'，'+result[i].file_name+'<br /> <a href="'+result[i].download_url+'">'+result[i].download_url+'</a> </li>';
                }

                html_model_list+='</ul></div></div><div class="ant-modal-footer"><div class="move-to-footer "><div class="buttons-wrap"> <button type="button"class="ant-btn btn-file btn-file-primary  ant-btn-primary" id="close-list"><span>关闭</span></button></div></div></div></div><div tabindex="0" aria-hidden="true" style="width: 0px; height: 0px; overflow: hidden; outline: none;"></div></div></div></div></div>';
                $(document.body).append(html_model_list);
            });

        });

        //关闭列表
        $(document).on("click", "#close-list", function () {
            $("#model-list").remove();
        });




    };

    //下载
    quark.download = function (fids,callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://drive.quark.cn/1/clouddrive/file/download?pr=ucpro&fr=pc",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            data: JSON.stringify({"fids": fids}),
            onload: function (res) {
                let resData = JSON.parse(res.responseText).data;
                if (resData === undefined || resData.length === 0) {
                    //失败
                    quark.showTipError("获取列表失败!");
                    callback("");
                } else {
                    //成功
                    quark.showTipSuccess("获取列表成功!");
                }

                callback(resData);
                //cosnole.log(o.download_url);

            }
        });
    };

    //视频地址
    quark.play = function (fids,callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://drive.quark.cn/1/clouddrive/file/v2/play?pr=ucpro&fr=pc",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            data: JSON.stringify({"fid":fids,"resolutions":"normal,low,high,super,2k,4k","supports":"fmp4"}),
            onload: function (res) {
                let resData = JSON.parse(res.responseText).data;
                if (resData === undefined || resData.length === 0) {
                    //失败
                    quark.showTipError("获取视频失败!");
                    callback("");
                } else {
                    //成功
                    quark.showTipSuccess("获取视频成功!");
                }

                callback(resData);
                //cosnole.log(o.download_url);

            }
        });
    };



    //获取Storage
    quark.getItem = function(n) {
        n = window.localStorage.getItem(n)|| sessionStorage.getItem(n);;

        if (!n) {
            return null;
        }
        try {
            return JSON.parse(n);
        } catch (e) {
            return n;
        }
    };


    //自定义提取码
    //url_type=1 是没有提取码  2是提取码
    //
    quark.customSharePwd=function(){
        //监听
        $(document).on("DOMNodeInserted", ".ant-modal-root", function() {
            var text = $(this).find(".ant-modal-title").text();
            if (text == "分享文件") {
                if ($(".input-share-pwd").length == 0) {
                    var sharePwd = localStorage.getItem("share_pwd");
                    var html = '<div class="oper-row"><span class="oper-name" style="width: auto;">自定义提取码</span><span class="oper-area">';
                    //html += '<input type="text"  class="ant-input input-share-pwd" value="' + (sharePwd ? sharePwd : "") + '" placeholder="" style="margin-left: 12px;width: 100px;height: 25px;line-height: normal;border: 1px solid #D4D7DE;text-align: center;"></div>'
                    html+='<input placeholder="选择需要自定义" class="ant-input code-input input-share-pwd" type="text" value="' + (sharePwd ? sharePwd : "") + '" name="passcode"></span></div>';
                    $(".create-share-body").append(html);
                    sendSharePwd();
                }
            }

        });

        //判断获取的值
        function sendSharePwd () {
            (function(send) {
                XMLHttpRequest.prototype.send = function() {
                    if (arguments.length && typeof arguments[0] == "string" && arguments[0].includes("fid_list")) {
                        var share_pwd = localStorage.getItem("share_pwd");
                        if (share_pwd) {
                            var body = JSON.parse(arguments[0]);
                            body.passcode = share_pwd;
                            arguments[0] = JSON.stringify(body);
                        }
                    }
                    send.apply(this, arguments);
                };
            })(XMLHttpRequest.prototype.send);
        }


        //获取修改的值
        $(document).on("change", ".input-share-pwd", function () {
            var value = this.value;
            localStorage.setItem("share_pwd", value);
        });




    };

    //提示成功
    quark.showTipSuccess = function (msg, timeout) {
        quark.hideTip();
        var $element = $(".ant-message");
        if ($element.length) {
            $element.html('<span><div class="ant-message-notice"><div class="ant-message-notice-content"><div class="ant-message-custom-content ant-message-success"><i aria-label="icon: check-circle" class="anticon anticon-check-circle"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></i><span>'+msg+'</span></div></div></div></span>');
        }
        else {
            $(document.body).append('<div><div class="ant-message"><span><div class="ant-message-notice"><div class="ant-message-notice-content"><div class="ant-message-custom-content ant-message-success"><i aria-label="icon: check-circle" class="anticon anticon-check-circle"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></i><span>' + msg + '</span></div></div></div></span></div></div>');
        }

        setTimeout(function () {
            quark.hideTip();
        }, timeout || 3000);
    };
    //提示失败
    quark.showTipError = function (msg, timeout) {
        quark.hideTip();
        var $element = $(".ant-message");
        if ($element.length) {
            $element.html('<span><div class="ant-message-notice"><div class="ant-message-notice-content"><div class="ant-message-custom-content ant-message-error"><i aria-label="icon: close-circle" class="anticon anticon-close-circle"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg></i><span>'+msg+'</span></div></div></div></span>');
        }
        else {
            $(document.body).append('<div><div class="ant-message"><span><div class="ant-message-notice"><div class="ant-message-notice-content"><div class="ant-message-custom-content ant-message-error"><i aria-label="icon: close-circle" class="anticon anticon-close-circle"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg></i><span>'+msg+'</span></div></div></div></span></div></div>');
        }

        setTimeout(function () {
            quark.hideTip()
        }, timeout || 3000);
    };

    //隐藏
    quark.hideTip = function() {
        $(".ant-message").html('<span></span>');
    };

    // 初始化 拦截XMLHttpRequest 主页面
    quark.initXMLHttpRequest_m= function() {
        let open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(...args){
            let send = this.send;
            let _this = this
            let post_data = []
            this.send = function (...data) {
                post_data = data;
                return send.apply(_this, data)
            }
            // 请求前拦截
            http.request_m(args)

            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    let config = {
                        url: args[1],
                        status: this.status,
                        method: args[0],
                        data: post_data
                    }
                    // 请求后拦截
                    http.response_m({config, response: this.response})
                }
            }, false)
            return open.apply(this, args);
        }

    };
    //分享页面
    quark.initXMLHttpRequest_s= function() {
        let open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(...args){
            let send = this.send;
            let _this = this
            let post_data = []
            this.send = function (...data) {
                post_data = data;
                return send.apply(_this, data)
            }
            // 请求前拦截
            http.request_s(args)

            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    let config = {
                        url: args[1],
                        status: this.status,
                        method: args[0],
                        data: post_data
                    }
                    // 请求后拦截
                    http.response_s({config, response: this.response})
                }
            }, false)
            return open.apply(this, args);
        }

    }

    //初始化
    quark.install= function () {
        var url = location.href;
        if (url.indexOf(".quark.cn/s/") > 0) {
            //分享页面初始化
            quark.sharePage();
            quark.showTipSuccess("夸克云盘插件初始化成功!");
        }
        else if (url.indexOf(".quark.cn/list") > 0) {
            // debugger
            //主页面初始化
            quark.customSharePwd();
            quark.showTipSuccess("夸克云盘插件初始化成功!");
            quark.mainPage();
        }

    }();
    // Your code here...
})();