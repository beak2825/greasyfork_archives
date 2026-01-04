// ==UserScript==
// @name         国开自动回帖
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202011222124
// @description  国家开放大学自动回帖脚本
// @author       流浪的蛊惑
// @match        *://*.ouchn.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416574/%E5%9B%BD%E5%BC%80%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/416574/%E5%9B%BD%E5%BC%80%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%B8%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i=0;
    var href = location.href;
    if(href.indexOf("/forum/")!=-1){
        var ht=document.getElementsByClassName("header replies");
        if(ht.length>0){ //初始化回帖
            ht[0].innerHTML="<input id=\"htlr\" type=\"text\" value=\"谢谢同学参加教学活动，请就你对问题的理解，谈谈你的看法。\"><br /><input type=\"button\" value=\"点击批量回贴\" onclick=\"localStorage.clear();localStorage.setItem('开始回帖','csh');localStorage.setItem('回帖内容',document.getElementById('htlr').value);location.reload();\"/>";
        }
        if(localStorage.getItem("开始回帖")=="csh"){ //获取0回复帖子
            localStorage.setItem("开始回帖","ok"); //暂存帖子ID号
            var tbl=document.getElementsByClassName("forumheaderlist"); //帖子区域
            var tr=tbl[0].getElementsByTagName("tr");
            for(i=1;i<tr.length;i++){
                var a=tr[i].getElementsByTagName("td")[2].getElementsByTagName("a"); //未分组不回帖
                var b=tr[i].getElementsByTagName("td")[3].getElementsByTagName("a"); //回帖数
                if(a.length>0 && b.length>0){
                    if(b[0].innerText.trim()=="0"){ //查找须要回帖的链接
                        localStorage.setItem(b[0].getAttribute("href").substring(b[0].getAttribute("href").indexOf("d=") + 2),b[0].getAttribute("href"));
                    }
                }
            }
            location.reload();
        }else{
            var isover=true; //是否全部回完
            for(i=0;i<localStorage.length;i++){
                var kn=localStorage.key(i);
                var kv=localStorage.getItem(kn);
                if(kv.indexOf("discuss.php?d=")!=-1){
                    isover=false;
                    var cz=localStorage.getItem("回帖");
                    if(cz==null){
                        localStorage.setItem("开始回帖",kn);
                        localStorage.setItem("回帖","进入回复");
                        setInterval(function(){location.href=kv;},1500);
                    }else{
                        if(cz=="进入回复"){
                            var hf=document.getElementsByClassName("commands");
                            if(hf.length>0){
                                localStorage.setItem("回帖","开始回复");
                                setInterval(function(){hf[0].getElementsByTagName("a")[3].click();},1500);
                            }
                        }
                        if(cz=="开始回复"){
                            document.getElementById("id_submitbutton").setAttribute("onclick","tinyMCE.activeEditor.setContent(\""+localStorage.getItem("回帖内容")+"\")");
                            localStorage.removeItem("回帖");
                            localStorage.removeItem(localStorage.getItem("开始回帖"));
                            setInterval(function(){document.getElementById("id_submitbutton").click();},1500);
                        }
                    }
                    break;
                }
            }
            if(isover){ //结束当前回帖
                localStorage.clear();
            }
        }
    }
})();