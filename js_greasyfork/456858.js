// ==UserScript==
// @name         其乐直接显示steampy的key的实时最低价格
// @namespace    *
// @version      1.1
// @description  *
// @author       lrssrq
// @match        *://keylol.com/*
// @match        *://steam.depar.me/GameMatch/*
// @icon         https://keylol.com/favicon-32x32.png
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      steampy.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456858/%E5%85%B6%E4%B9%90%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BAsteampy%E7%9A%84key%E7%9A%84%E5%AE%9E%E6%97%B6%E6%9C%80%E4%BD%8E%E4%BB%B7%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/456858/%E5%85%B6%E4%B9%90%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BAsteampy%E7%9A%84key%E7%9A%84%E5%AE%9E%E6%97%B6%E6%9C%80%E4%BD%8E%E4%BB%B7%E6%A0%BC.meta.js
// ==/UserScript==

'use strict';
let keyPrice = [];
let gameName = [];
let staticGameName = [];
let searched = 0;
let count = 0;
let token = GM_getValue("accessToken","");
let sbtn = document.createElement("input");sbtn.className = "chazhao";
let info = document.getElementsByClassName('steam-info-link');
sbtn.setAttribute("type","button");
sbtn.setAttribute("value","开始查找");
if(document.getElementsByClassName('tb-container')[0] != null){
    document.getElementsByClassName('tb-container')[0].append(sbtn);
}else{
    document.querySelector(".panel-heading").append(sbtn);
}
sbtn.addEventListener(
    "click",
    async function(){
        if(searched==0){
            searched=1;
            sbtn.setAttribute("value","正在查找...");
            let st = await start();
            if(st == "token失效"){
                sbtn.setAttribute("value","开始查找");}
            else{
                sbtn.setAttribute("value","查找完成");
            }
        }else{
            if(sbtn.getAttribute("value")!="正在查找...")sbtn.setAttribute("value","没有需要查找的链接了!!!");
        }
    });
// start();
const mainpost = document.querySelector("#postlist").children[1];
let obs = new MutationObserver(
    ()=>{staticGameName = [];
         searched = 0;
         sbtn.setAttribute("value","开始查找");
        }
);

obs.observe(mainpost,{childList:true,subTree:true});

//屏蔽悬浮窗
// function blockHover(Node){
//     let obs = new MutationObserver(
//         ()=>{Node.style.display="none";
//             }
//     );

//     obs.observe(Node,{attributes:true});
// }



async function start() {
    if(count>=1)info = mainpost.querySelectorAll(".steam-info-link");
    for(let i=0;i<info.length;i++){
        //blockHover(info[i].nextElementSibling);
        if(info[i].href.match(/\/app\/\d+[\?\/]/)!=null){
            let btn = document.createElement("input");
            btn.setAttribute("type","button");
            btn.setAttribute("value","买key");
            let appid = info[i].href.match(/\d+/);
            let URL = "https://store.steampowered.com/app/"+appid+"/";
            //console.log(URL);
            if(token == ""){
                token = prompt("请获取token填入:");
                GM_setValue("accessToken",token);
            }
            staticGameName[i] = await searchKeyPrice(URL);
            if(staticGameName[i] == "token失效")return "token失效";
            btn.addEventListener(
                "click",
                ()=>{
                    console.log(staticGameName[i]);
                    GM_setClipboard(staticGameName[i]);
                    window.open("https://steampy.com/cdKey/cdKey");
                });
            if(keyPrice[0]!=-1){
                if(keyPrice.length>1){
                    for(let j=0;j<keyPrice.length;j++){
                        let div = document.createElement("div");
                        div.innerHTML = gameName[j]+"  在py上key的价格:"+ String(keyPrice[j])+"元";
                        info[i].after(div);
                        div.before(btn);}
                }else{
                    let div = document.createElement("div");
                    div.innerHTML = gameName[0]+"  在py上key的价格:"+ String(keyPrice[0])+"元";
                    //console.log(div);
                    info[i].after(div);
                    div.before(btn);}
            }else{
                let div = document.createElement("div");
                div.innerHTML = "在steampy上没有找到key的价格";
                info[i].after(div);
            }
        }
    }
    count++;
}

async function searchKeyPrice(Url){
    return await new Promise((resolve, reject) => {
        // console.log(Url);
        GM_xmlhttpRequest({
            method: "get",
            timeout: 6000,
            url:"https://steampy.com/xboot/steamGame/keyByUrl?pageNumber=1&pageSize=30&sort=keyTx&order=asc&startDate=&endDate=&gameName=&gameUrl="+Url,
            responseType: "json",
            headers: {
                "accesstoken": token,
            },
            onload: (r)=>{
                console.log(r.response.message);
                if(r.response.message =="登录已失效，请重新登录"){
                    searched = 0;
                    sbtn.setAttribute("value","开始查找");
                    token = prompt("token失效，请获取新的token填入:")
                    GM_setValue("accessToken",token);
                    resolve("token失效");
                }
                gameName=[];
                keyPrice=[];
                if(r.response.result.content.length!=0 && r.response.result.content.length!=undefined){
                    for(let i=0;i<r.response.result.content.length;i++){
                        //console.log(r.response.result.content[i].keyPrice);
                        keyPrice.push(r.response.result.content[i].keyPrice);
                        gameName.push(r.response.result.content[i].gameName);
                        resolve(gameName[0]);
                    }
                }else{
                    keyPrice.push(-1);
                    gameName.push(null);
                    resolve(gameName[0]);
                };

            },
            ontimeout:()=>{console.log('timeout');},
            onerror:()=>{console.log('error');},
        });});
}