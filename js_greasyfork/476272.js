// ==UserScript==
// @name         vip视频解析 - 豆瓣
// @namespace    https://github.com/1771245847
// @version      0.0.2
// @description  movie.douban.com 超轻量豆瓣影视在线播放脚本,在豆瓣电影条目页面内直接添加视频播放窗口
// @license     MIT
// @author      1771245847
// @match      https://movie.douban.com/subject/*
// @downloadURL https://update.greasyfork.org/scripts/476272/vip%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%20-%20%E8%B1%86%E7%93%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/476272/vip%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%20-%20%E8%B1%86%E7%93%A3.meta.js
// ==/UserScript==

'use strict';
if (!document.querySelector(".bs")) return;//unplayable

const server = "https://www.yemu.xyz/?url=";
const $ = window.jQuery;

const div = document.createElement("div");
div.setAttribute("id","fm");
div.setAttribute("style","width: 100%;height:300px;padding-bottom: 15px;");
const x = document.createElement("input");
x.setAttribute("type","button");
x.setAttribute("value"," X ");
x.setAttribute("style","position: relative;float: right;z-index: 2;");
const newItem = document.createElement("iframe");
newItem.setAttribute("id","play");
newItem.setAttribute("name","playf");
newItem.setAttribute("frameborder","0");
newItem.setAttribute("style","width: 100%;height: 300px;");
newItem.setAttribute("allowfullscreen","allowfullscreen");
newItem.setAttribute("security","restricted");
newItem.setAttribute("referrerpolicy","no-referrer");
newItem.setAttribute("style","width: 100%;height: 300px;position: absolute;");

let mov = true;
var dp = function (event) {
    let self = event.target;
    let parentDiv,insert,before,tt;
    switch (self.parentNode.nodeName) {
        case 'LI':
            parentDiv=document.getElementById("mainpic").parentNode.parentNode;
            before=document.getElementById("mainpic").parentNode;
            insert=div;
            div.appendChild(x);
            div.appendChild(newItem);
            x.addEventListener("click",()=>div.parentNode.removeChild(div));
            break;
        case 'DIV':
            parentDiv=self.parentNode.parentNode;
            before=self.parentNode;
            insert=newItem;
            tt = document.getElementById("eptitle");
            if(!tt){
                let playtitle = "<h2 id = 'eptitle'>当前播放 第"+self.innerText+"</h2>"
                document.querySelector(".cross").outerHTML += playtitle;
            }else{
                tt.innerText="当前播放 第"+self.innerText;
                document.querySelector(".episode-list").querySelectorAll('a').forEach((a)=>a.style.border='');
            };
            newItem.setAttribute("style", "width: 100%;height: 300px;margin: 0px 0px 7px -13px;");
            self.setAttribute("style","border: 1px solid;");
            break;
    };
    parentDiv.insertBefore(insert, before);
};
document.querySelector('.bs').querySelectorAll('li').forEach((a)=>{
    a.children[1].innerText=a.children[0].innerText;
    a = a.children[0];
    a.innerText = "解析播放";
    a.setAttribute("style","display: inline-block; text-indent: 20px; background: no-repeat url(https://img3.doubanio.com/f/sns/5741f726dfb46d89eb500ed038833582c9c9dcdb/pics/sns/doulist/ic_play_web@2x.png) left center / 16px;");
    if (a.href == "javascript: void 0;") return;
    a.href=server+a.href.split('?url=')[1];
    a.setAttribute("target","playf");
    a.addEventListener("click",dp);
    mov = false;
});
if(mov){
     document.addEventListener('DOMNodeInserted', function(event) {
        if(event.target.className!='play-source') return;
        document.querySelector(".episode-list").querySelectorAll('a').forEach((a)=>{
            a.href = server+a.href.split('?url=')[1];
            a.setAttribute("target","playf");
            a.addEventListener("click",dp);
        });
    });
};

