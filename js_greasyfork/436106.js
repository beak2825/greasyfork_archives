// ==UserScript==
// @name         腾讯视频 在Youtube 上搜索
// @namespace    BjDanny的脚本
// @version      1.4
// @description  腾讯视频, bilibili, 优酷等大陆视频网站上快捷在youtube搜索该视频
// @author       BjDanny
// @match        https://v.qq.com/x/cover/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://v.qq.com/cartoon/p/topic/*
// @match        https://v.youku.com/v_show/*
// @match        https://www.iqiyi.com/v_*
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @icon         https://www.google.com/s2/favicons?domain=youku.com
// @icon         https://www.google.com/s2/favicons?domain=iqiyi.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436106/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%20%E5%9C%A8Youtube%20%E4%B8%8A%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/436106/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%20%E5%9C%A8Youtube%20%E4%B8%8A%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
var t = "";
function createBtn() {
    const css = document.createElement('style');
    css.innerHTML = `
            .myButton {
            font-size: 14px;
            font-weight: bold;
            color: white;
            text-align: center;
            vertical-align: middle;
            border: 1px solid transparent;
            border-radius: 2px;
            background-color: red;
            height:70%;
            weight:100%;
            padding: 2px 14px;
            margin: 5px;
        `;
    document.head.appendChild(css);
    var btn = document.createElement("BUTTON");
    btn.className = "myButton";
    btn.id = "mybutton";
    btn.innerHTML = "搜 Youtube";
    if (document.domain == "bilibili.com") {document.querySelector(".pub-wrapper").appendChild(btn);};
    if (document.domain == "qq.com") {document.querySelector(".player_container").appendChild(btn);};
    if (document.domain == "v.youku.com") {document.querySelector(".title-wrap").appendChild(btn);};
    if (document.domain == "iqiyi.com") {document.querySelector(".player-title").appendChild(btn);};
    btn.addEventListener("click", searchYoutube);
}

function searchYoutube() {
      let title = "" ;
      let episode = "" ;
      if (document.domain == "qq.com") {
          if (document.querySelector("._video_title") != undefined){
          title = document.querySelector("._video_title").textContent.trimLeft().trimRight().split(" ")[0];
           episode = document.querySelector("._video_title").textContent.trimLeft().trimRight().split(" ")[1];
          }
          else if (document.querySelector(".player_title") != undefined){
          title = document.querySelector(".player_title").textContent;
           episode = "第" + document.querySelector(".item.current").textContent.trimLeft().trimRight() + "集" ;
          }      
      }
      if (document.domain == "bilibili.com") {
          title = document.querySelector(".media-title").textContent.trimLeft().trimRight();
          episode = document.querySelector(".ep-item.cursor").textContent.split(" ")[1];
      }

      if (document.domain == "v.youku.com") {
          title = document.querySelector(".title-wrap").querySelector(".subtitle").textContent.trimLeft().trimRight();
          episode = "";
      }

    if (document.domain == "iqiyi.com") {
          if (document.querySelector(".player-title").querySelector(".title-link") != undefined){
          title = document.querySelector(".player-title").querySelector(".title-link").textContent.trimLeft().trimRight();
          episode = document.querySelector(".player-title").querySelector(".title-txt").textContent.trimLeft().trimRight();
          }
          else if (document.querySelector(".player-title").querySelector("#widget-videotitle") != undefined)
          {
           title = document.querySelector(".player-title").querySelector("#widget-videotitle").textContent.trimLeft().trimRight();
           episode = "";
          }
      }

      console.log(title);
      const q = "https://www.youtube.com/results?search_query=" ;
       window.open(q + title + " " + episode, "_blank");
}

function closeVipPrompt(){
    let vipPrompt = document.querySelector(".wrapper.mod_vip_popup");
    if (vipPrompt) vipPrompt.querySelector(".btn.btn_close").click();
}

function checkBtn(){

    if (! document.querySelector(".myButton"))
    {
        createBtn();
    }
    else
    {
        clearInterval(t);
        console.log("Cleared interval");
    }
}

function main(){
    console.log("started main process");
    if (document.domain == "qq.com") {setInterval(closeVipPrompt, 500);}
    t = setInterval(checkBtn, 3000);
}


main();






