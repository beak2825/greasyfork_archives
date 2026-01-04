// ==UserScript==
// @name         B站网页端动态评论区图片加载
// @namespace    https://space.bilibili.com/174534918
// @version      0.1.2
// @description  B站网页端动态页（t.bilibili.com/...）笔记直接加载，显示评论区图片
// @author       Kesdiael Ken
// @match        https://t.bilibili.com/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_download
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/499746/B%E7%AB%99%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%8A%A8%E6%80%81%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/499746/B%E7%AB%99%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%8A%A8%E6%80%81%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%9B%BE%E7%89%87%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

{// <DEF_REPOSITORY>  

function log(...texts){texts.forEach(text => console.log(text));}

let default_theWorld_para = {mute: false, span: 250};
function theWorld(mute = default_theWorld_para.mute, span = default_theWorld_para.span){
        mute || log(`theWorld ${span}`);
        return new Promise(res => {setTimeout(() => {res();}, span);});
}

function waitEle(identifier, patience = 5000){
        return new Promise(res => {
            if($(identifier).length){return res(true);}
            let cnt = patience / 50;
            let itv = setInterval(()=>{
                if($(identifier).length){clearInterval(itv); res(true);}
                cnt--; if(!cnt){clearInterval(itv); res(false);}
            }, 50);
        });
}

function getEvents(entries = performance.getEntriesByType("resource"), type = ["xmlhttprequest"]){
    return entries.filter(entry => {
        return type.indexOf(entry.initiatorType) > -1;
    });
}

function obs(list, obs){
    try{obsPostProcessing(getEvents(list.getEntriesByType("resource")));}
    catch(err){}
}

let observer = new PerformanceObserver(obs);
observer.observe({entryTypes:["resource"]});

}// </DEF_REPOSITORY>

{// <REPOSITORY>

class REPLY_IMG_LOADER{
    constructor(reply){
        this.reply = reply;
        this.rpid = reply.rpid;
        this.images = reply.content.pictures;
    }
    async load(){
        if(!this.images)return;
        let identifier = `[data-id="${this.rpid}"]`;
        if(!await waitEle(identifier))return;

        if($(`#note_pre${this.rpid}`).length)return;
        let BiJi_icon = 
            `<div class="note_pre" id="note_pre${this.rpid}">
                <img class="note_ico" style="width: 16px; height: 16px; margin-right: 0; box-sizing: border-box;" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03LjAwMDAyIDMuNDE2NjlDNS41MzEwNiAzLjQxNjY5IDQuMjQ4NDQgMy40OTE0MSAzLjM0MzA0IDMuNTY0ODRDMi43MTM4IDMuNjE1ODYgMi4yMjYwOCA0LjA5NjU0IDIuMTcwMDIgNC43MjAxNEMyLjEwMzU2IDUuNDU5MzcgMi4wNDE2OSA2LjQzNDIzIDIuMDQxNjkgNy41MDAwMkMyLjA0MTY5IDguNTY1ODEgMi4xMDM1NiA5LjU0MDY3IDIuMTcwMDIgMTAuMjc5OUMyLjIyNjA4IDEwLjkwMzUgMi43MTM3NCAxMS4zODQyIDMuMzQyOTUgMTEuNDM1MkM0LjE3NTE5IDExLjUwMjcgNS4zMjYzNSAxMS41NzEzIDYuNjQ4MDggMTEuNTgxOUM2Ljg4OTcgMTEuNTgzOSA3LjA4Mzk5IDExLjc4MTMgNy4wODIwNSAxMi4wMjI5QzcuMDgwMSAxMi4yNjQ2IDYuODgyNjYgMTIuNDU4OCA2LjY0MTA0IDEyLjQ1NjlDNS4yOTM4NCAxMi40NDYxIDQuMTIxIDEyLjM3NjIgMy4yNzIyMyAxMi4zMDczQzIuMjIzNiAxMi4yMjIzIDEuMzkzMiAxMS40MTEyIDEuMjk4NTMgMTAuMzU4M0MxLjIzMDM4IDkuNjAwMTIgMS4xNjY2OSA4LjU5ODI5IDEuMTY2NjkgNy41MDAwMkMxLjE2NjY5IDYuNDAxNzUgMS4yMzAzOCA1LjM5OTkyIDEuMjk4NTMgNC42NDE3OUMxLjM5MzIgMy41ODg4MSAyLjIyMzcyIDIuNzc3NzMgMy4yNzIzMSAyLjY5MjdDNC4xOTU1NCAyLjYxNzgzIDUuNTAyMzYgMi41NDE2OSA3LjAwMDAyIDIuNTQxNjlDOC40OTc4MyAyLjU0MTY5IDkuODA0NzYgMi42MTc4NSAxMC43MjggMi42OTI3MkMxMS43NzY0IDIuNzc3NzUgMTIuNjA2OSAzLjU4ODUxIDEyLjcwMTYgNC42NDE0MkMxMi43NTM2IDUuMjIwMzkgMTIuODAzIDUuOTQxMjYgMTIuODIzNSA2LjczODg2QzEyLjgyOTcgNi45ODA0MSAxMi42Mzg5IDcuMTgxMjQgMTIuMzk3MyA3LjE4NzQzQzEyLjE1NTggNy4xOTM2MyAxMS45NTQ5IDcuMDAyODQgMTEuOTQ4OCA2Ljc2MTI5QzExLjkyODkgNS45ODU3NSAxMS44ODA4IDUuMjgzODYgMTEuODMwMSA0LjcxOTc4QzExLjc3NCA0LjA5NjM2IDExLjI4NjQgMy42MTU4OCAxMC42NTczIDMuNTY0ODZDOS43NTE4NiAzLjQ5MTQzIDguNDY5MTIgMy40MTY2OSA3LjAwMDAyIDMuNDE2NjlaTTQuMzc1MDIgNS44OTU4NUM0LjEzMzQgNS44OTU4NSAzLjkzNzUyIDYuMDkxNzMgMy45Mzc1MiA2LjMzMzM1QzMuOTM3NTIgNi41NzQ5OCA0LjEzMzQgNi43NzA4NSA0LjM3NTAyIDYuNzcwODVIOS42MjUwMkM5Ljg2NjY0IDYuNzcwODUgMTAuMDYyNSA2LjU3NDk4IDEwLjA2MjUgNi4zMzMzNUMxMC4wNjI1IDYuMDkxNzMgOS44NjY2NCA1Ljg5NTg1IDkuNjI1MDIgNS44OTU4NUg0LjM3NTAyWk00LjM3NTAyIDguMjI5MTlDNC4xMzM0IDguMjI5MTkgMy45Mzc1MiA4LjQyNTA2IDMuOTM3NTIgOC42NjY2OUMzLjkzNzUyIDguOTA4MzEgNC4xMzM0IDkuMTA0MTkgNC4zNzUwMiA5LjEwNDE5SDcuNTgzMzVDNy44MjQ5OCA5LjEwNDE5IDguMDIwODUgOC45MDgzMSA4LjAyMDg1IDguNjY2NjlDOC4wMjA4NSA4LjQyNTA2IDcuODI0OTggOC4yMjkxOSA3LjU4MzM1IDguMjI5MTlINC4zNzUwMlpNMTIuMTk2MSA4LjM2NzQxQzExLjc5NzQgNy45Njg3NSAxMS4xNTEgNy45Njg3NSAxMC43NTI0IDguMzY3NDFMOC40NDgzNyAxMC42NzE0QzguMjU2OTIgMTAuODYyOSA4LjE0OTM3IDExLjEyMjUgOC4xNDkzNyAxMS4zOTMzVjEyLjU5NzRDOC4xNDkzNyAxMi45NTE4IDguNDM2NjYgMTMuMjM5MSA4Ljc5MTA0IDEzLjIzOTFIOS45OTUxNkMxMC4yNjU5IDEzLjIzOTEgMTAuNTI1NiAxMy4xMzE1IDEwLjcxNyAxMi45NDAxTDEzLjAyMSAxMC42MzZDMTMuNDE5NyAxMC4yMzc0IDEzLjQxOTcgOS41OTEwMyAxMy4wMjEgOS4xOTIzN0wxMi4xOTYxIDguMzY3NDFaTTExLjM3MTEgOC45ODYxM0MxMS40MjgxIDguOTI5MTcgMTEuNTIwNCA4LjkyOTE3IDExLjU3NzMgOC45ODYxM0wxMi40MDIzIDkuODExMDhDMTIuNDU5MyA5Ljg2ODAzIDEyLjQ1OTMgOS45NjAzNyAxMi40MDIzIDEwLjAxNzNMMTAuMDk4MyAxMi4zMjEzQzEwLjA3MDkgMTIuMzQ4NyAxMC4wMzM4IDEyLjM2NDEgOS45OTUxNiAxMi4zNjQxSDkuMDI0MzdMOS4wMjQzNyAxMS4zOTMzQzkuMDI0MzcgMTEuMzU0NiA5LjAzOTc0IDExLjMxNzUgOS4wNjcwOSAxMS4yOTAxTDExLjM3MTEgOC45ODYxM1oiIGZpbGw9IiM5NDk5QTAiLz4KPC9zdmc+Cg==">
                <div class="note_text">笔记</div>
            </div>`;
        let text_node = $(identifier).find(".text");
        if(text_node.find(".stick").length) text_node.find(".stick").after(BiJi_icon);
        else text_node.prepend(BiJi_icon);

        let img_content = "";
        this.images.forEach((img, idx) => {
            let width, height, woh, flex_dir;
            let whm = img.img_width >= img.img_height;
            let h = whm ? 135 : 180;
            let w = Math.min(Math.max(img.img_width * h / img.img_height, 135), 240);
            if(this.images.length > 1) w = h = 88;
            woh = whm ? "height" : "width";
            flex_dir = whm ? "row" : "column";
            width = `width: ${w}px;`, height =  `height: ${h}px;`;
            let suffix = `@${whm? "135h_" : ""}1s_!web-comment-note.avif`
            let img_div = ` <a href="${img.img_src}" target="_blank" style="display: flex">
                            <div class="img_wrapper" id="wrapper_${this.rpid}" style="${width + " " + height} flex-direction: ${flex_dir};">
                            <img src="${img.img_src + suffix}" class="note_img" alt="img" style="${woh}: 100%;">
                            </div>
                            </a>
                           `;
            img_content += img_div;
        });
        let img_container = `<div class="img_container">
                                ${img_content}
                             </div>`;
        text_node.after(img_container);
    }
}

function obsPostProcessing(event_list){
    if(!event_list.length || !event_list[0].name.includes("main"))return;
    GM_xmlhttpRequest({
        method: "GET",
        url: event_list[0].name,
        onload: r => {
            log("Request for comments fetched.");
            let content = JSON.parse(r.response);
            let replies = content.data.replies; //log(replies);
            replies.forEach(reply => new REPLY_IMG_LOADER(reply).load());
            let top = content.data.top_replies;
            top.forEach(reply => new REPLY_IMG_LOADER(reply).load());
        }
    });
}

}// </REPOSITORY>

// <MAIN>


GM_addStyle(`
    .note_pre{
        display: inline flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        padding: 1px 4px;
        margin-right: 8px;
        font-size: 12px;
        color: var(--text3);
        line-height: 20px;
        vertical-align: bottom;
        background-color: var(--bg2);
    }
    .note_text{
        display: inline-block;
    }
    .img_container{
        margin-top: 8px;
        display: flex;
        column-gap: 4px;
        row-gap: 4px;
        max-width: 400px;
        flex-wrap: wrap;
    }
    .img_wrapper{
        display: flex;
        justify-content: center;
        position: relative;
        overflow: hidden;
        border-radius: 5px;
    }
    .note_img{
        overflow-clip-margin: content-box;
    }
    .img_wrapper:hover .note_img{
        opacity: 0.7;
    }
}`);

(() => { 'use strict'; $(() => {


}); })();

// </MAIN>