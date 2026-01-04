// ==UserScript==
// @name         快捷回复各种表情
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不用拉到最下面就可以回复各种表情了
// @author       Eao的兔兔
// @match        *://*.scboy.cc/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      兔兔
// @downloadURL https://update.greasyfork.org/scripts/452303/%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E5%90%84%E7%A7%8D%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/452303/%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E5%90%84%E7%A7%8D%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //想加表情的话，在这一行里面加东西就行
    //sb表情列表
    var imagesNumber=[1,2,3,19,20,23,42,68,81,100,115,129,136,149,156,157,164];
    //战队表情列表
    var WTLimagesNumber=[1,2,3];
    //阿鲁表情列表
    var ALimagesNumber=[1,2,3];
    //语法规则：在方括号里面，每两个数值之间加逗号，两端不用加
    //比方说：默认是
    //var imagesNumber=[3,81,156,136,1];
    //加一个赤小兔的135，就变成了
    //var imagesNumber=[3,81,156,136,1,135];
    //前面不用加两个斜线。斜线表示这行是注释，是不会被程序读取的。







    if(window.location.href.indexOf("thread")>-1){
        var tid=window.location.href.slice(window.location.href.indexOf("thread")+7,window.location.href.indexOf(".htm"))
        var ol=document.getElementsByClassName("breadcrumb")[0];
        var quickreply=document.createElement("div");
        quickreply.style.height="100%";
        quickreply.style.position="absolute";
        quickreply.style.right="20px";
        var replytext=document.createElement("span");
        replytext.innerText="快捷回复：";
        replytext.id="replytext";
        quickreply.appendChild(replytext);



        imagesNumber.forEach(function(num){
            let img=document.createElement("img");
            img.src="https://www.scboy.cc/plugin/scboy_moj/face/sb/"+num.toString()+".png";
            img.style.height="21px";
            img.dataset.num=num.toString();
            img.onclick=function(e){
                replytext.innerText="正在发送：";
                $.post("?post-create-"+tid+"-1.htm",{
                    'doctype':1,
                    'return_html':0,
                    'quotepid':0,
                    'message':'[png:sb:'+e.target.dataset.num.toString()+']'
                },function(data,status){
                    if(status=="success"){
                        replytext.innerText="回复"+e.target.dataset.num.toString()+"成功：";
                    }else{
                        replytext.innerText="出问题了：";
                    }

                });
            }
            quickreply.appendChild(img);
        });
         WTLimagesNumber.forEach(function(num){
            let img=document.createElement("img");
            img.src="https://www.scboy.cc/plugin/scboy_moj/face/wtl/"+num.toString()+".jpg";
            img.style.height="21px";
            img.dataset.num=num.toString();
            img.onclick=function(e){
                replytext.innerText="正在发送：";
                $.post("?post-create-"+tid+"-1.htm",{
                    'doctype':1,
                    'return_html':0,
                    'quotepid':0,
                    'message':'[jpg:wtl:'+e.target.dataset.num.toString()+']'
                },function(data,status){
                    if(status=="success"){
                        replytext.innerText="回复"+e.target.dataset.num.toString()+"成功：";
                    }else{
                        replytext.innerText="出问题了：";
                    }

                });
            }
            quickreply.appendChild(img);
        });
        ALimagesNumber.forEach(function(num){
            let img=document.createElement("img");
            img.src="https://www.scboy.cc/plugin/scboy_moj/face/arclist/"+num.toString()+".png";
            img.style.height="21px";
            img.dataset.num=num.toString();
            img.onclick=function(e){
                replytext.innerText="正在发送：";
                $.post("?post-create-"+tid+"-1.htm",{
                    'doctype':1,
                    'return_html':0,
                    'quotepid':0,
                    'message':'[em_'+e.target.dataset.num.toString()+']'
                },function(data,status){
                    if(status=="success"){
                        replytext.innerText="回复"+e.target.dataset.num.toString()+"成功：";
                    }else{
                        replytext.innerText="出问题了：";
                    }

                });
            }
            quickreply.appendChild(img);
        });
        ol.appendChild(quickreply);
    }
})();