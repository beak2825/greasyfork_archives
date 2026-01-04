// ==UserScript==
// @name         夸克网盘直链下载，解除大文件需客户端下载限制，支持Aari2批量下载，直接在浏览器中下载
// @version      1.3
// @namespace    https://zhihuweb.com
// @description  解除大文件需客户端下载限制，支持Aari2批量下载，直接在浏览器中下载
// @author       zhihu
// @license      End-User License Agreement
// @match        *://pan.quark.cn/list*
// @match        *://pan.quark.cn/s/*
// @connect      drive.quark.cn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quark.cn
// @grant        GM_xmlhttpRequest
// @grant       GM_cookie
// @grant       GM.cookie
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/448865/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E4%B8%8B%E8%BD%BD%EF%BC%8C%E8%A7%A3%E9%99%A4%E5%A4%A7%E6%96%87%E4%BB%B6%E9%9C%80%E5%AE%A2%E6%88%B7%E7%AB%AF%E4%B8%8B%E8%BD%BD%E9%99%90%E5%88%B6%EF%BC%8C%E6%94%AF%E6%8C%81Aari2%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%EF%BC%8C%E7%9B%B4%E6%8E%A5%E5%9C%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/448865/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E7%9B%B4%E9%93%BE%E4%B8%8B%E8%BD%BD%EF%BC%8C%E8%A7%A3%E9%99%A4%E5%A4%A7%E6%96%87%E4%BB%B6%E9%9C%80%E5%AE%A2%E6%88%B7%E7%AB%AF%E4%B8%8B%E8%BD%BD%E9%99%90%E5%88%B6%EF%BC%8C%E6%94%AF%E6%8C%81Aari2%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%EF%BC%8C%E7%9B%B4%E6%8E%A5%E5%9C%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const config ={
        "playhref":"https://pan.quark.cn/list",
        "host":window.location.host,
        "UA":navigator.userAgent,
    }
    const commonFunction = {
        Toast:function(msg, duration = 3000){
            var m = document.createElement('div');
            m.innerHTML = msg;
            m.setAttribute('id','msg');
            m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;min-height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
            document.body.appendChild(m);
            setTimeout(() => {
                var d = 0.5;
                m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                m.style.opacity = '0';
                setTimeout(() => { document.body.removeChild(document.querySelector("#msg")) }, d * 1000);
            }, duration);
        },
        sleep:function(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },
        Commonsetinterval:function(data){
            var Count;
            var num ="";
            return new Promise(function(resolve, reject){
                Count = setInterval(function() {
                    var node = document.querySelector(data);
                    num++;
                    if(node != null ){
                        resolve(node);
                        clearInterval(Count);
                    }
                    if(num ==100){
                        clearInterval(Count);
                    }
                    console.log(node)
                },200);
            });
        },
        setItem:function(name, Value) {
            localStorage.setItem(name, Value);
        },
        getItem:function(name) {
            let StorageValue = localStorage.getItem(name);
            return StorageValue;
        },
        removeItem:function(name) {
            localStorage.removeItem(name);
        },
        GMaddStyle:function(data,id=null) {
            var addStyle = document.createElement('style');
            addStyle.textContent = data;
            addStyle.type = 'text/css';
            addStyle.id = id;
            var doc = document.head || document.documentElement;
            doc.appendChild(addStyle);
        },
        open:function(data){
            var main = document.createElement('div');
            var width = data.area[0];
            var height = data.area[1];
            var margintop = height/2;
            var marginleft = width/2;
            var style = "z-index: 999999998;width: "+width+"px;height:"+height+"px;position: fixed;top: 50%;left: 50%;margin-left:-"+marginleft+"px;margin-top:-"+margintop+"px;"
            var btnHTML = '<a class="zhihu-layer-btn0">'+data.btn[0]+'</a><a class="zhihu-layer-btn1">'+data.btn[1]+'</a>';
            main.innerHTML = '<div class="zhihu-layer-title" style="cursor: move;">'+data.title+'</div><div class="zhihu-layer-content" >'+data.content+'</div><span class="zhihu-layer-setwin"><a class="zhihu-layer-ico zhihu-layer-close1" href="javascript:;"></a></span><div class="zhihu-layer-btn zhihu-layer-btn-c">'+btnHTML+'</div>';
            main.setAttribute('id',data.id);
            main.setAttribute('style',style);
            main.setAttribute('class',"zhihu-layer-page");
            document.body.appendChild(main);
            var shade = document.createElement('div');
            shade.setAttribute('style',"z-index: 999999997;background-color: rgb(0, 0, 0);opacity: 0.3;");
            shade.setAttribute('class',"zhihu-layer-shade");
            shade.setAttribute('id',"zhihu-layer-shade");
            shade.innerHTML =''
            document.body.appendChild(shade);
            var css = `
             ::-webkit-scrollbar {
                height: 6px;
                width: 6px;
             }
             ::-webkit-scrollbar-track {
                background: transparent;
                width: 6px;
             }
             ::-webkit-scrollbar-thumb {
                background-color: #54be99;
                border-radius: 4px;
                -webkit-transition: all 1s;
                transition: all 1s;
                width: 6px;
             }
             ::-webkit-scrollbar-corner {
                background-color: #54be99;
             }
             li {
               list-style: none;
             }
             .zhihu-form-label, .zhihu-form-select, .zhihu-input-block, .zhihu-input-inline{
               position: relative;
             }
             .zhihu-layer-shade {
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               position: fixed;
               _height: expression(document.body.offsetHeight+"px");
             }
             .zhihu-layer-page{
                   margin: 0;
                   padding: 0;
                   background-color: #fff;
                   border-radius: 10px;
                   box-shadow: 1px 1px 50px rgba(0,0,0,.4);
                   font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
             }
             .zhihu-layer-title{
                   padding: 0 80px 0 20px;
                   height: 50px;
                   line-height: 50px;
                   border-bottom: 1px solid #F0F0F0;
                   border-radius: 2px 2px 0 0;
                   font-size: 14px;
                   color: #333;
                   overflow: visible;
                   text-overflow: ellipsis;
                   white-space: nowrap;
                   font-weight: bold;
             }
             .zhihu-layer-setwin {
                   position: absolute;
                   right: 15px;
                   top: 17px;
                   font-size: 0;
                   line-height: initial;
              }
              .zhihu-layer-setwin .zhihu-layer-close1 {
                   background-position: 1px -40px;
                   cursor: pointer;
              }
              .zhihu-layer-setwin a {
                   position: relative;
                   width: 16px;
                   height: 16px;
                   margin-left: 10px;
                   font-size: 12px;
                   _overflow: hidden;
              }
             .zhihu-layer-btn a, .zhihu-layer-setwin a {
                   display: inline-block;
                   vertical-align: top;
              }
              .zhihu-layer-ico {
                   background: url(https://www.layuicdn.com/layui/css/modules/layer/default/icon.png) no-repeat;
              }
              .zhihu-layer-btn {
                   text-align: right;
                   padding: 10px 15px 12px;
                   pointer-events: auto;
                   user-select: none;
                   -webkit-user-select: none;
              }
              .zhihu-layer-btn-c {
                   text-align: center;
              }
              .zhihu-layer-btn a {
                   height: 28px;
                   line-height: 28px;
                   margin: 5px 5px 0;
                   padding: 0 15px;
                   border: 1px solid #dedede;
                   background-color: #fff;
                   color: #333;
                   border-radius: 4px;
                   font-weight: 400;
                   cursor: pointer;
                   text-decoration: none;
               }
               .zhihu-layer-btn1 {
                   border-color: #54be99!important;
                   background-color: #54be99!important;
                   color: #fff!important;
               }
               .zhihu-form-item {
                   margin-bottom: 5px;
                   clear: both;
               }
               .zhihu-form-label {
                   float: left;
                   display: block;
                   padding: 9px 15px;
                   width: 80px;
                   font-weight: 400;
                   line-height: 20px;
                   text-align: right;
                   box-sizing: content-box;
                }
                .zhihu-input-inline {
                   display: inline-block;
                   vertical-align: middle;
                   width: 190px;
                   margin-right: 10px;
                }
                .zhihu-input, .zhihu-select, .zhihu-textarea {
                   height: 38px;
                   line-height: 1.3;
                   border-width: 1px;
                   border-style: solid;
                   border-color: #eee;
                   display: block;
                   width: 100%;
                   padding-left: 10px;
                   background-color: #fff;
                   color: rgba(0,0,0,.85);
                   border-radius: 2px;
                   outline: 0;
                   -webkit-appearance: none;
                   transition: all .3s;
                   -webkit-transition: all .3s;
                   box-sizing: border-box;
                }
                .zhihu-input-block {
                   min-height: auto;
                   margin-left: 110px;
                }
                .zhihu-input-block p {
                   font-size: 12px;
                   line-height: 22px;
                }
                .zhihu-form {
                   display: flex;
                   margin-top: 20px;
                }

            `;
            commonFunction.GMaddStyle(css,"open");
            // await commonFunction.sleep(1000);
            //获取表单对象
            var zhihuform = document.querySelector('.zhihu-form');
            //保存按钮点击事件
            document.querySelector('.zhihu-layer-btn1').addEventListener('click',function() {
                data.btn1(zhihuform);
                document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
            })
            //取消钮点击事件
            document.querySelector(".zhihu-layer-btn0").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
            })
            //关闭钮点击事件
            document.querySelector(".zhihu-layer-close1").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
            })
        },
    }
    //aria2设置开始
    const Controlleraria2 = {
        aria2set:function(){
            let css= `
            .layui-form{
             display: flex;
             margin-top: 20px;
             }
             .layui-form-label {
               box-sizing: content-box;
             }
             .layui-input-block p{
              font-size:12px
             }
             .layui-form-item{
             margin-bottom:5px
             }
             .layui-input-block{
             min-height:auto;
             }
            .main-left{
              width: 367px;
            }
            .zhihu-scan{
               width:180px;
			   display:inline-block;
			   text-align: center;
               margin-right: 40px;
            }
			.zhihu-scan img{
				width: 140px;
				margin: 0 5px 10px 5px;
			}
			.zhihu-scan h1{
				font-size: 18px;
				font-weight: bold;
				margin: 0px 0 20px 0;
			}
			.zhihu-scan p{
			  margin: 0;
			  color: #666;
              font-size: 12px;
              line-height: 26px;
			}
         `;
            commonFunction.GMaddStyle(css);
                let rpc="ws://localhost:6800/jsonrpc";
                if(commonFunction.getItem("rpc")!=null){
                    rpc= commonFunction.getItem("rpc")
                }
                let token="";
                if(commonFunction.getItem("token")!=null){
                    token= commonFunction.getItem("token")
                }
                let mulu="D:/";
                if(commonFunction.getItem("mulu")!=null&&commonFunction.getItem("mulu")!=""){
                    mulu= commonFunction.getItem("mulu")
                }
                let contenthtml ="";
                contenthtml +='<form class="zhihu-form" style="height: 280px;"><div class="main-left">'
                contenthtml +='<div class="zhihu-form-item"> <label class="zhihu-form-label">RPC地址</label><div class="zhihu-input-inline"><input name="rpc" value="'+rpc+'"  placeholder="" class="zhihu-input"></div></div>'
                contenthtml +='<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>Aria2配置:ws://localhost:6800/jsonrpc<br>Motrix配置:ws://localhost:16800/jsonrpc</p></div></div>'
                contenthtml +='<div class="zhihu-form-item"> <label class="zhihu-form-label">token</label><div class="zhihu-input-inline"><input name="token" value="'+token+'"  placeholder="" class="zhihu-input"></div></div>'
                contenthtml +='<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>没有请留空</p></div></div>'
                contenthtml +='<div class="zhihu-form-item"> <label class="zhihu-form-label">保存地址</label><div class="zhihu-input-inline"><input name="mulu" value="'+mulu+'"  placeholder="留空使用默认目录" class="zhihu-input"></div></div>'
                contenthtml +='<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>留空使用默认目录</p></div></div>'
                contenthtml +='</div><div class="zhihu-scan"><img src="http://cdn.wezhicms.com/uploads/allimg/20211215/1-21121500044Q94.jpg"><h1>关注公众号</h1>'
                contenthtml +='<p>微信扫描上方二维码</p><p>关注我</p><p>从此不迷路</p></div></form>'
                commonFunction.open({
                    area: ['580', '405'],
                    title: "批量下载设置",
                    shade: 0,
                    id:"biliset",
                    btn: ['取消', '保存设置'],
                    content:contenthtml,
                    btn1: function(data) {
                        var n = data.getElementsByTagName('input');
                        for(let i= 0; i <n.length; i++ ){
                            if (n[i].getAttribute("name") == "rpc") {
                                commonFunction.setItem("rpc",n[i].value);
                            }
                            else if (n[i].getAttribute("name") == "token") {
                                commonFunction.setItem("token",n[i].value);
                            }
                            else if (n[i].getAttribute("name") == "mulu") {
                                commonFunction.setItem("mulu",n[i].value);
                            }
                        }
                    }
                });
        },
        addUri:function(u,t) {
            //配置
            return new Promise(function(resolve, reject) {
                var wsurl = commonFunction.getItem("rpc");;
                var uris = [u];
                var token="";
                var filename = t
                if(commonFunction.getItem("mulu")!=null&&commonFunction.getItem("mulu")!=""){
                    var mulu= commonFunction.getItem("mulu")
                    }else{
                        mulu ="D:/"
                    }
                var options = {
                    "dir":mulu,
                    "max-connection-per-server": "16",
                    "header": [`Cookie: ${document.cookie}`]
                    };
                console.log(uris)
                if (filename != "") {
                    options.out = filename;
                }
                var json = {
                    "id": "zhihu",
                    "jsonrpc": '2.0',
                    "method": 'aria2.addUri',
                    "params": [uris, options],
                };
                console.log(json)
                if (token != "") {
                    json.params.unshift("token:" + token); // 坑死了，必须要加在第一个
                }
                var ws = new WebSocket(wsurl);

                ws.onerror = event => {
                    commonFunction.Toast('连接错误, Aria2 连接错误，请检查RPC设置！');
                };
                ws.onopen = () => { ws.send(JSON.stringify(json)); }

                ws.onmessage = event => {
                    let received_msg = JSON.parse(event.data);
                    if (received_msg.error !== undefined) {
                        if (received_msg.error.code === 1)commonFunction.Toast('通过RPC连接失败', '请打开控制台查看详细错误信息，返回信息：' + received_msg.error.message);
                    }
                    resolve();
                    switch (received_msg.method) {
                        case "aria2.onDownloadStart":
                            commonFunction.Toast("Aria2 发送成功, "+filename+" 已经开始下载！",1000);
                            ws.close();
                            break;
                        default:
                            break;
                    }
                };
            });
        },
    };
    //aria2设置结束
    function addMian(resData){
        let listhtml=""
        resData.forEach((item,index)=>{
            listhtml += `<div style="display:flex;height:36px;line-height:36px;position:relative;justify-content:space-between"><input data-title="${item.file_name}" data-url="${item.download_url}" type="checkbox" style="width:14px;height:14px;position:absolute;top:50%;margin-top:-7px"><div style="width:350px;overflow:hidden;white-space:nowrap;margin-left:20px;font-size:14px;color:#333">${item.file_name}</div><div><a href="${item.download_url}"><div style="width:16px;height:100%;background-repeat:no-repeat;background-position:50%;background-size:contain;margin-right:16px;cursor:pointer;display:inline-block;background-image:url(data:image/png;base64,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)" title="下载"></div></a>
            <div data-title="${item.file_name}" data-url="${item.download_url}" class="copyjs" style="width:16px;height:100%;background-repeat:no-repeat;background-position:50%;background-size:contain;margin-right:16px;cursor:pointer;display:inline-block;background-image:url(data:image/png;base64,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)" title="复制链接"></div>
            <div data-title="${item.file_name}" data-url="${item.download_url}" class="ariajs" style="width:16px;height:100%;background-repeat:no-repeat;background-position:50%;background-size:contain;margin-right:16px;cursor:pointer;display:inline-block;background-image:url(data:image/png;base64,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)" title="发送到Aaria2"></div></div></div>`
        })
        let mainhtml =`<div id="downmain">
        <div style="background:#00000030;position:fixed;top:0;right:0;width:100%;height:100%;z-index:99999998"></div>
        <div style="background:#fff;width:540px;min-height:150px;position:fixed;z-index:99999999;top:50%;left:50%;box-shadow:0 0 20px 1px #00000042;border-radius:10px;margin-left:-270px;margin-top:calc(height/2px);transform:translateY(-50%)">
        <div style="height:48px;line-height:48px;margin:0 20px;border-bottom:1px solid #f6f6f6;font-size:14px;color:#000;position:relative"><span style="">下载列表</span> <span id="zhihuclose" style="background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAIf0lEQVR4Xu3dXZbUOgxFYTOdy3hgOsB0YDwwnruyuor+IZWyFcnRsTbPsSMf6cMNFN2fGr9IgAQeJvCJbEiABB4nABCmgwQOEgAI40ECAGEGSMCWADeILTdWFUkAIEUazTFtCQDElhuriiQAkCKN5pi2BABiy41VRRIASJFGc0xbAgCx5caqIgkApEijOaYtAYDYcmNVkQQAUqTRHNOWAEBsubGqSAIAKdJojmlLACC23FhVJAGAFGk0x7QlABBbbqwqkgBAijSaY9oSAIgtN1YVSQAgRRrNMW0JAMSWG6uKJACQIo3mmLYEAGLLjVVFEgBIkUZzTFsCALHlxqoiCQCkSKM5pi0BgNhyY1WRBABSpNEc05YAQGy5sapIAgAp0miOaUtAFci31tqv1tof27FZNTmB/1prX1prPya/9/TrFIFsOL631n631r6C5PQMRG+w4fjZWvt865sUEjUgdxz3poIkerzP7f8Wx32n7Tc3GSRKQD7iAMm54Y1evYdDDokKkEc4QBI95rb9j3BIIVEA8gwHSGxDHLWqB4cMkuxAenGAJGrcx/YdwSGBJDOQURwgGRtm76ctONIjyQrEigMk3mPft98ZHKmRZARyFgdI+oba6ykPHGmRZAPihQMkXuN/vI8njpRIMgHxxgGSWCQRONIhyQIkCgdIYpBE4kiFJAuQGYHzsRQfLKV6lQXI1rpSwfvM6vRdyvUoExCQTJ/3oReWw7Glkw0ISIZmdtrDJXFkBQKSaXPf9aKyODIDAUnX7IY/VBpHdiAgCZ//wxeUx6EABCTXIAHHLfeMf0jfGwkaNg8KWb/JWgUIN8kcIOD4kLMSEJDEIgHHTr5qQEASgwQcD3JVBAISXyTgOMhTFQhIfJCA40mOykBAcg4JODryUwcCko4m7zwCjs7cVgACks5m3x4Dx0BeqwABSV/TwdGX09+nVgICkuPmg2MQx/b4akBAsj8E4DDgWBUISN4PAziMOFYGApKXoQDHCRyrA6k+IOA4iaMCkKpIwOGAowqQakjA4YSjEpAqSMDhiKMakNWRgMMZR0UgqyIBRwCOqkBWQwKOIByVgayCBByBOKoDUUcCjmAcANH912ZwTMABkNeQlQZOqdZJYxz3mhU/zWtNS2HwFGq05p9yHUDetyXzAGauLeVwexQFkH9TzDiIGWvymL/0ewBkv0WZBjJTLekH2rtAgDxONMNgZqjBe+ak9gPIcbuuHNAr3y01xJHFAuR5ulcM6hXvfJ5EwScA0tf0mQO7VfSztfa5rzTTU/zM+M7YANIZ1MT/371VBI7+voQ+CZCxeGfcJGMVjT3NzTGW15LfF2swguHHVZGAY7jVa37jOEMMw0vUkIBjuMUvC/gSyxjcpD+T2Kt7XQmOEykC5ER4AkjAca6/3CAn89uWZ/1yCxwOzeUGcQgxIRJw+PSVG8Qpx0w3CTgcm8oN4hhmgpsEHL795AZxzvPKmwQcAc3kBgkI9YKbBBwxfeQGCcp15k0CjsAmcoPEhTvrr38BEtdDbpCgbGfhuJcPkqBGcoP4BzsbB0j8e/h3R4D4hnsVDpD49hEgAXlejQMkAU3lBvEJNQsOkPj0kxvEMcdsOEDi2FxukHNhZsUBknN95QZxyC87DpA4NJkbxBaiCg6Q2PrLDXIiNzUcIDnRbG6QsfBUcYBkrM/cIIa8ZuDYPjKy/eIbxxkaFLGEG6Qv1Vk4vt7K4VuP9vUl/CmAPI94Jo4/t3KueOfzJAo+AZDjpl85qFe+uyCF/SMD5PEoZBjQDDWUxgKQ/fZnGsxMtZTDApB/W55xIDPWVAILQN63OfMgZq5tWSwAeW2twgAq1LgUFoC8tFNp8JRqlccCEC0c94EDySR61YEoD5py7ZPG+/xrKgNZYcBWOMP5KQ7coSqQlQZrpbMEjrpt64pAVhyoFc9km2jnVdWArDxIK5/Neez7t6sEpMIAVThj/3Q7PFkFSKXBqXRWBwLHW1QAUnFgKp45BMvqQCoPSuWzu2FZGQgDovkpAbfh9thoVSDg0PoQpscsh+yxIhBw/DsqZGLksxoQBuHxIJCNAclKQBiA5wNARs8zevfEKkBofH/jyao/qyV+iCcNH2j47VEy68xM/Qah0Z2N3nmM7DqyUwZCgzsa/OQRMnwSkCoQGnsex30HsjzIUhEIDfXDAZLFbhBw+OMAySI3CDjicIDkQbYqX2KBIx4HSHYyVgACjnk4QPIh6+xAwDEfB0jeZJ4ZCDiuwwGSWwJZgYDjehwgaS3lZ7HAkQdHeSTZbhBw5MNRGkkmIODIi6MskixAwJEfR0kkWYB8a619D5yR3621r621+88hD3xVia1n/Ia2zcOPq9PMAmTLIQoJOGKmLBJJChxbbJmARCABRwyOyC+30uDICMQTCThicUQgSYUjKxAPJOCYg8MTSTocmYGcQQKOuTg8kKTEkR2IBQk4rsFxBklaHApARpCA41ocFiSpcagA6UECjhw4RpCkx6EE5AgJOHLh6EEigUMNyB4ScOTEcYREBocikLdIwJEbxx4SKRyqQO5IfvHZKg0h7eUnXX3J8Nmq0cSyfdRktH6eJ4HQBAASGi+bqycAEPUOUn9oAgAJjZfN1RMAiHoHqT80AYCExsvm6gkARL2D1B+aAEBC42Vz9QQAot5B6g9NACCh8bK5egIAUe8g9YcmAJDQeNlcPQGAqHeQ+kMTAEhovGyungBA1DtI/aEJACQ0XjZXTwAg6h2k/tAEABIaL5urJwAQ9Q5Sf2gCAAmNl83VEwCIegepPzQBgITGy+bqCQBEvYPUH5oAQELjZXP1BACi3kHqD00AIKHxsrl6AgBR7yD1hyYAkNB42Vw9AYCod5D6QxMASGi8bK6eAEDUO0j9oQkAJDReNldPACDqHaT+0AT+B7+1uOcLrSnTAAAAAElFTkSuQmCC');width:16px;height:16px;background-repeat:no-repeat;background-position:50%;background-size:contain;cursor:pointer;position:absolute;right:0;top:50%;margin-top:-8px"></span></div>
        <div style="min-height:48px;margin:0 20px;padding:10px 0;max-height:480px;overflow:auto"><div>${listhtml}</div></div>
        <div style="height:68px;line-height:48px;margin:0 20px;border-top:1px solid #f6f6f6;font-size:14px;color:#000;padding:10px 0"><div class="ant-btn-group" style="float:right"><button type="button" id="all" class="ant-btn btn-file"><span >全选</span></button><button type="button" id="delall" class="ant-btn btn-file"><span >取消全选</span></button><button id="pldown" type="button" class="ant-btn btn-file"><span>批量下载</span></button><button type="button" id="ariaset" class="ant-btn btn-file"><span>设置</span></button></div></div></div></div>`
        document.body.insertAdjacentHTML('afterbegin', mainhtml);
        var downmain = document.querySelector("#downmain");
        var checkbinput = downmain.querySelectorAll('input');
        var ariajsall = downmain.querySelectorAll('.ariajs');
        var copyjsall = downmain.querySelectorAll('.copyjs');
        console.log(checkbinput)
        document.querySelector("#all") .addEventListener('click',function() {
            checkbinput.forEach(function(element) {
                element.checked = true;
            })
            commonFunction.Toast("已经全部选择",3000)
        });
        document.querySelector("#delall").addEventListener('click',function() {
            checkbinput.forEach(function(element) {
                element.checked = false;
            });
            commonFunction.Toast("已经全部取消选择",3000)
        });
        document.querySelector("#zhihuclose").addEventListener('click',function() {
            document.querySelector("#downmain").remove();
        });
        document.querySelector("#ariaset").addEventListener('click',function() {
            Controlleraria2.aria2set();
        });
        ariajsall.forEach((element)=>{
            element.addEventListener('click',function() {
                if(!commonFunction.getItem("rpc")||commonFunction.getItem("rpc") == null) {commonFunction.Toast("请在设置里设置rpc链接",3000); return;}
              //if(!commonFunction.getItem("cookie")||commonFunction.getItem("cookie") == null){ commonFunction.Toast("请在设置里设置Cookie",3000); return;}
                let url = this.getAttribute('data-url');
                let title =this.getAttribute('data-title');
                Controlleraria2.addUri(url,title);
            });
        });
        copyjsall.forEach((element)=>{
            element.addEventListener('click',function() {
                let url = this.getAttribute('data-url');
                const input = document.createElement('input');
                input.setAttribute('value',`${url}`);
                document.body.appendChild(input);
                input.focus()//获取焦点
                input.select()//选中输入框
                document.execCommand('copy',true)//复制当前选中文本到前切板
                commonFunction.Toast("复制成功",1500);
                document.body.removeChild(input);
            });
        })
        document.querySelector("#pldown").addEventListener('click',async function() {
           if(!commonFunction.getItem("rpc")||commonFunction.getItem("rpc") == null) {commonFunction.Toast("请在设置里设置rpc链接",3000); return;}
           //if(!commonFunction.getItem("cookie")||commonFunction.getItem("cookie") == null){ commonFunction.Toast("请在设置里设置Cookie",3000); return;}
           for (var i = 0; i < checkbinput.length; i++) {
                if(checkbinput[i].checked){
                    let url = checkbinput[i].getAttribute('data-url');
                    let title =checkbinput[i].getAttribute('data-title');
                    await Controlleraria2.addUri(url,title)
                }
            }
        })
    }
    function download(fids) {
        console.log(config.cookie)
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://drive.quark.cn/1/clouddrive/file/download?pr=ucpro&fr=pc&ve=2.1.5",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            data: JSON.stringify({"fids": fids}),
            onload: function (res) {
                let resData = JSON.parse(res.responseText).data;
                if (resData === undefined || resData.length === 0) {
                    commonFunction.Toast("获取直链失败, 请尝试刷新页面！")
                    return;
                } else {
                    console.log('get real download url, size: ', resData.length)
                }
                console.log(resData)
                addMian(resData);
            }
        });
    }
    function getSelectedFids() {
        const checkboxes = document.getElementsByClassName('ant-table-row');
        let fids = [];
        for (let i = 0; i < checkboxes.length; i++) {
            let checkbox = checkboxes[i].querySelector(".ant-checkbox-input")
            if (checkbox.checked) {
                let fidtype = checkboxes[i].querySelector(".ant-table-row-cell-break-word");
                if(fidtype.innerText!="-"){
                    const fid = checkboxes[i].getAttribute('data-row-key');
                    if (fid !== undefined && fid !== '') {
                        fids.push(fid);
                    }
                }else{
                    commonFunction.Toast("文件夹不支持直链下载，已忽略",1000)
                }
            }
        }
        return fids;
    }
    async function addButton(){
        const detectPage =()=>{
            let path = location.pathname;
            if (/^\/(list)/.test(path)) return 'home';
            if (/^\/(s|share)\//.test(path)) return 'share';
            return '';
        }
        const HomeBtn =()=>{
            let btnhtml =`<div class="btn-main" id="zhihudown"><div class="ant-dropdown-trigger" style="display:inline-block"><span class=""><div class="ant-upload ant-upload-select ant-upload-select-text"><span class="ant-upload"><button type="button" class="ant-btn btn-file btn-file-primary upload-btn ant-btn-primary"><img class="btn-icon" src="data:image/png;base64,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"><span>智狐直链下载</span></button></span></div></span></div></div>`
            let btnnode = commonFunction.Commonsetinterval(".btn-operate");
            btnnode.then((node)=>{
                node.insertAdjacentHTML('afterbegin', btnhtml);
                document.querySelector("#zhihudown").onclick= async()=>{
                    let fids= await getSelectedFids();
                    if(fids&&fids!=""){
                       download(fids)
                    }else{
                    commonFunction.Toast("请选择文件")
                    }
                }
            })

        }
        const ShareBtn =()=>{
            let btnhtml =`<div class="file-info_r" id="zhihudown" style="margin-right:10px"><span class="save-btn-icon" style="background-image:url(data:image/png;base64,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)"></span><span>智狐直链下载</span></div>`
            let btnnode = commonFunction.Commonsetinterval(".file-info-share-buttom");
            btnnode.then((node)=>{
                node.insertAdjacentHTML('afterbegin', btnhtml);
                document.querySelector("#zhihudown").onclick= async()=>{
                    let fids= await getSelectedFids();
                    if(fids&&fids!=""){
                       download(fids)
                    }else{
                    commonFunction.Toast("请选择文件")
                    }
                }
            })

        }
        const pt = await detectPage();
        if(!pt) return
        if(pt == "home") await HomeBtn();
        if(pt == "share") await ShareBtn();

    }
    addButton();
})();