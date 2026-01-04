// ==UserScript==
// @name         Tweetoaster皮套助手
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  将烤推机输出的图片内容进行一键发布
// @author       Yuyuyzl
// @match        https://t.bilibili.com/*
// @match        https://passport.bilibili.com/login*
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/392272/Tweetoaster%E7%9A%AE%E5%A5%97%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/392272/Tweetoaster%E7%9A%AE%E5%A5%97%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Base64 = {
        _Rixits :
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-",
        fromNumber : function(number) {
            if (isNaN(Number(number)) || number === null ||
                number === Number.POSITIVE_INFINITY)
                throw "The input is not valid";
            if (number < 0)
                throw "Can't represent negative numbers now";

            var rixit; // like 'digit', only in some non-decimal radix
            var residual = Math.floor(number);
            var result = '';
            while (true) {
                rixit = residual % 64
                result = this._Rixits.charAt(rixit) + result;
                residual = Math.floor(residual / 64);
                if (residual == 0)
                    break;
            }
            return result;
        },

        toNumber : function(rixits) {
            var result = 0;
            rixits = rixits.split('');
            for (var e = 0; e < rixits.length; e++) {
                if(this._Rixits.indexOf(rixits[e])>=0)
                    result = (result * 64) + this._Rixits.indexOf(rixits[e]);
            }
            return rixits[0]==="_"?-result:result;
        }
    }

    function encodeImgs(arr){
        for(let i=arr.length-1;i>0;i--)arr[i]-=arr[i-1]
        return arr.map(n=>n<0?"_"+Base64.fromNumber(-n):"|"+Base64.fromNumber(n)).join("").substring(1);
    }

    function uploadToasted(url,callback){
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload:(response)=>{
                let data=new FormData();
                data.append("file_up",response.response,"tweet.png")
                data.append("biz","draw");
                data.append("category","daily");
                console.log(response);
                GM_xmlhttpRequest({
                    method:"POST",
                    url:"https://api.vc.bilibili.com/api/v1/drawImage/upload",
                    data:data,
                    onload:(responseUpload)=>{
                        /*
                        [{"image_url":"http://i0.hdslb.com/bfs/album/09aa43f2cd6296e47e0ff96927be2d673255f694.png","image_width":640,"image_height":400,"img_size":71.4033203125}]
                        [{"img_src":"http://i0.hdslb.com/bfs/album/09aa43f2cd6296e47e0ff96927be2d673255f694.png","img_width":640,"img_height":400,"img_size":71.4033203125}]
                        */
                        let uploadRes=JSON.parse(responseUpload.responseText).data;
                        let res={
                            img_src:uploadRes.image_url,
                            img_width:uploadRes.image_width,
                            img_height:uploadRes.image_height,
                            img_size:response.response.size/1024
                        }
                        callback(res);
                    }
                });

            },
            responseType:"blob"
        });
    }
    function publishDynamic(content,pics,callback){
        let csrf=new Map(document.cookie.split(";").map(s=>s.trim().split("="))).get("bili_jct");
        console.log(csrf);
        /*

        biz: 3
category: 3
type: 0
pictures: [{"img_src":"http://i0.hdslb.com/bfs/album/09aa43f2cd6296e47e0ff96927be2d673255f694.png","img_width":640,"img_height":400,"img_size":71.4033203125}]
title:
tags:
description: 测试
content: 测试
setting: {"copy_forbidden":0,"cachedTime":0}
from: create.dynamic.web
extension: {"emoji_type":1}
at_uids:
at_control: []
csrf_token: 89e076eb9abdd272def0b197e67408e7
        */
        let data=[];
        data.push(["biz","3"]);
        data.push(["category","3"]);
        data.push(["type","0"]);
        data.push(["pictures",JSON.stringify(pics)]);
        data.push(["title",""]);
        data.push(["tags",""]);
        data.push(["description",content]);
        data.push(["content",content]);
        data.push(["setting","{\"copy_forbidden\":0,\"cachedTime\":0}"]);
        data.push(["from","create.dynamic.web"]);
        data.push(["extension","{\"emoji_type\":1}"]);
        data.push(["at_uids",""]);
        data.push(["at_control","[]"]);
        data.push(["csrf_token",csrf]);
        console.log(data.map(a=>escape(a[0])+"="+escape(a[1])).join("&"));
        //alert("发了一条了");
        //callback({});

        GM_xmlhttpRequest({
            method:"POST",
            url:"https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/create_draw",
            data:data.map(a=>encodeURIComponent(a[0])+"="+encodeURIComponent(a[1])).join("&"),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://t.bilibili.com",
                "Referer": "https://t.bilibili.com/",
                "Sec-Fetch-Site": "same-site"
            },
            onload:(responseUpload)=>{
                let uploadRes=JSON.parse(responseUpload.responseText)
                callback(uploadRes);
            }
        });

    }
    window.addEventListener('load',()=>{
        if(window.location.href.match(/\/t\.bilibili\.com/)){
            navigator.clipboard.readText().then(clipText=>{
                let matchres=clipText.match(/椱淛莪咑開嗶哩嗶哩，壹jιáй橃布所姷動態シ(.+)【皮套口令】/);
                if(matchres==null)return;
                let s=matchres.pop().match(/[_|]?[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-]+/g);
                if(s==null)return;
                s=s.map(i=>Base64.toNumber(i));
                for(let i=1;i<s.length;i++)s[i]+=s[i-1]
                console.log(s);
                if(confirm("你复制了皮套口令！要上班吗？\n如果还没换号请取消")){
                    let imgurls=s.map(i=>"https://tweet.wudifeixue.com/cache/"+i+"a.png")
                    let pics=new Array(imgurls.length);
                    imgurls.forEach((url,imgk)=>{
                        uploadToasted(url,res=>{
                            pics[imgk]=(res);
                            if(pics.filter(()=>true).length==imgurls.length){
                                pics=pics.reduce((prev,o,i)=>{i%9===0?prev.push([o]):prev[Math.floor(i/9)].push(o);return prev;},[]);
                                let msg=prompt("图片已上传完成，请输入要发布的文本内容",localStorage.getItem("tt-msg")?localStorage.getItem("tt-msg"):"");
                                if(msg===null)return;
                                localStorage.setItem("tt-msg",msg);
                                (function doPublish(){
                                    publishDynamic(msg,pics.shift(),()=>{
                                        navigator.clipboard.writeText("");
                                        if(pics.length===0)alert("发送完成，已清空剪贴板，请刷新页面");else setTimeout(()=>doPublish(),1000);
                                    });
                                })();

                            }
                        })
                    });
                }
            });
        }

        if(window.location.href.match(/\/passport\.bilibili\.com/)&&!window.location.href.match(/exit/)){
            navigator.clipboard.readText().then(clipText=>{
            let matchres=clipText.match(/椱淛莪咑開嗶哩嗶哩，壹jιáй橃布所姷動態シ(.+)【皮套口令】/);
                if(matchres==null)return;
                let s=matchres.pop().match(/[_|]?[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+-]+/g);
                if(s==null)return;
                var valuet=GM_getValue("username");
                if(valuet==null){
                    valuet=prompt("你复制了皮套口令！\n请输入皮套账号的用户名，插件将在检测到皮套口令时自动填写\n若不想使用此功能请点击确定，下次询问请点击取消")
                    GM_setValue("username",valuet);
                }
                $("#login-username")[0].value=valuet;
                $("#login-username")[0].dispatchEvent(new Event('input'));
                $("#login-username")[0].dispatchEvent(new Event('click'));
                if(valuet!==null && valuet!==""){
                    valuet=GM_getValue("password");
                    if(valuet==null){
                        valuet=prompt("你复制了皮套口令！\n请输入皮套账号的密码，插件将在检测到皮套口令时自动填写\n重置保存的用户名和密码请在Tampermonkey中重置本插件数据")
                        GM_setValue("password",valuet);
                    }
                    $("#login-passwd")[0].value=valuet;
                    $("#login-passwd")[0].dispatchEvent(new Event('input'));
                    $("#login-passwd")[0].dispatchEvent(new Event('click'));
                }
            });
        }
    },false);
    // Your code here...
})();