// ==UserScript==
// @name         偷懒1号
// @namespace    https://gitee.com/Liwker
// @version      1.2.1
// @description  b站自动获取直播列表，并发送特殊的查询，再执行相应的操作
// @author       Liwker 子木
// @match        https://space.bilibili.com/*
// @grant        none
// @license MIT
// @memo         v1.2.1 2024/5/21 新增CS:GO分区
// @memo         v1.2 2024/5/21 改为直接发送消息，不需要进一步查询
// @memo         2024/5/21 新增手游 绝区零、dbf手游
// @memo         2024/3/12 新增网游分区的 APEX英雄、无畏契约
// @icon         https://static.hdslb.com/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/495658/%E5%81%B7%E6%87%921%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/495658/%E5%81%B7%E6%87%921%E5%8F%B7.meta.js
// ==/UserScript==
!async function(){"use strict";let e={myUid:"",csrf:"",isRun:!1,area_id:321,livePage:1,content:[],parent_area_id:3,parent_id_List:[2,3,6],wangyou_id_List:[329,240,89],isSearch:!1},t={cookieToJson(){let e=document.cookie.split("; "),t={};for(let i of e){let o=i.split("=");t[o[0]]=o[1]}return t},toQuery(e,t){let i=[];for(let o in e)i.push(o+"="+e[o]);let l=i.join("&");return t?t+"?"+l:l},sleep:e=>new Promise(t=>setTimeout(t,e))};function i(e){let t=new XMLHttpRequest;if(t.ontimeout=function(){alert("网络异常，请稍后重试！")},t.onerror=function(){alert("您的网络似乎出了一些问题！")},t.open(e.type,e.url,!1),e.header)for(let i in e.header)t.setRequestHeader(i,e.header[i]);if(t.withCredentials=!0,t.send(e.body||null),4===t.readyState){if(t.status>=200&&t.status<300){let o=t.response&&JSON.parse(t.response);return o}console.error("xhr.response",t.response)}else console.error("xhr",t)}function o(e){e.platform="web";let o={type:"get",url:t.toQuery(e,"https://api.live.bilibili.com/xlive/web-interface/v1/second/getList"),body:null},l=i(o);if(l&&0==l.code)return l.data;console.error("获取直播列表失败",e,o)}function l(e){e.search_type=3;let o={type:"get",url:t.toQuery(e,"https://api.live.bilibili.com/xlive/mcn-interface/v1/mcn_mng/SearchAnchor"),body:null},l=i(o);if(l&&0==l.code)return l.data;console.error("查询主播房间号失败",e,o)}function n(o){let l={w_sender_uid:e.myUid,w_receiver_id:o.w_receiver_id,w_dev_id:"00B09F06-90C5-4E87-B905-F8337F2B5612",w_rid:"fcf0e090a8f54f944957ceb3c1b6316a",wts:new Date().getTime()},n={"msg[sender_uid]":e.myUid,"msg[receiver_id]":o.w_receiver_id,"msg[receiver_type]":1,"msg[msg_type]":1,"msg[msg_status]":0,"msg[content]":`{"content": "${o.content}"}`,"msg[timestamp]":l.wts,"msg[new_face_version]":0,"msg[dev_id]":"EE21C3A5-2CBA-4B6B-79D9-3811024DD56C764335infoc",csrf:e.csrf,csrf_token:e.csrf},a={type:"post",url:t.toQuery(l,"https://api.vc.bilibili.com/web_im/v1/web_im/send_msg"),header:{"Content-Type":"application/x-www-form-urlencoded"},body:t.toQuery(n)},s=i(a);if(s&&0==s.code||s&&"0"!=s.message)return s;console.error("发送消息失败",o,a)}function a(t){function i(e,t){let i=document.querySelector("div.liwkerMain"),o=document.createElement("div");o.classList.add("liwkerMsg"),t&&o.classList.add("liwkerLoading"),o.innerText=e,o.title=e,i.appendChild(o)}let o=document.querySelector("div.liwkerLoading");o&&o.remove(),t?(i(t,!1),i("正在查找新主播...",!0)):i(e.isRun?"正在查找新主播...":"——————执行结束——————",!0)}async function s(){let i=0;for(a();e.isRun;){let s=o({parent_area_id:e.parent_area_id,area_id:e.area_id,page:e.livePage});if(s){if(s.list&&0==s.list.length){e.livePage=1,e.isRun=!1,window.alert(`该分区已查询完毕！`);break}e.livePage++}else{e.livePage=1,e.isRun=!1,window.alert("获取直播列表失败");break}for(let r of s.list){if(!e.isRun)break;if(e.isSearch){let d=l({search:r.roomid});if(!d){window.alert("查询房间号失败");break}if(1!==d.items[0].is_new_anchor){await t.sleep(2e3);continue}}else{let p=n({w_receiver_id:r.uid,content:Array.isArray(e.content)&&e.content[Math.floor(Math.random()*e.content.length)]||""});i++,p&&0==p.message?a(`${i}. "${r.uname}"(${r.uid}) 发送消息成功~`):(a(`${i}. "${r.uname}"(${r.uid}) 发送消息失败！`),p.message&&a(`"${r.uname}"：${p.message}`)),e.isSearch?await t.sleep(3e4):await t.sleep(5e3)}}if(!e.isRun)break;await t.sleep(5e3)}e.isRun=!1;let c=document.querySelector("#liBtnStart"),u=document.querySelector("#liBtnEnd");c.disabled=!1,c.classList.remove("is-disabled"),u.disabled=!0,u.classList.add("is-disabled"),a()}!function i(){let o=t.cookieToJson();e.myUid=o.DedeUserID,e.csrf=o.bili_jct,e.isRun=!1,e.livePage=1,function t(){let i=document.createElement("style");i.innerHTML=`
      #liwkerBtnShow {
        position: absolute;
        right: 15px;
        top: -40px;
        width: 80px;
      }
      #liwkerArea {
        width: 330px;
        height: 550px;
        position: fixed;
        top: 320px;
        right: 20px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        background-color: #fff;
        border: 1px solid #ebeef5;
        transition: .3s;
        z-index: 999;
      }
      #liwkerArea > .top {
        width: 100%;
        height: 80px;
        background: #eee;
        display: flex;
        justify-content: space-evenly;
      }
      #liwkerArea > .top > .search {
        width: 220px;
        height: 100%;
      }
      #liwkerArea > .top > .search > #send_content {
        height: 35px;
      }
      #liwkerArea > .top > .search > select {
        width: 100%;
        height: 30px;
        margin-top: 7px;
      }

      .buttonBox {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: end;
      }

      .liwkerMain {
        width: 100%;
        height: 465px;
        box-sizing: border-box;
        padding: 5px 15px;
        padding-left: 10px;
        overflow: auto;
      }
      .liwkerMsg {
        width: 285px;
        height: 24px;
        line-height: 24px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    `,document.querySelector("head").appendChild(i);let o=document.createElement("div");o.id="liwkerArea",o.innerHTML=`
      <button id="liwkerBtnShow" type="button" class="el-button search-btn el-button--primary el-button--small">隐藏</button>
      <div class="top">
        <div class="search">
          <input type="text" id="send_content" autocomplete="off" placeholder="请输入发送的消息" class="el-input__inner">
          <select id="area_select">
            <option value="2">网游全部</option>
            <option value="3">手游全部</option>
            <option value="6">单机全部</option>
            <option value="321" selected>原神</option>
            <option value="549">崩坏：星穹铁道</option>
            <option value="89">CS:GO</option>
            <option value="329">无畏契约</option>
            <option value="240">APEX英雄</option>
            <option value="35">王者荣耀</option>
            <option value="256">和平精英</option>
            <option value="163">第五人格</option>
            <option value="395">LOL手游</option>
            <option value="255">明日方舟</option>
            <option value="872">来自星尘</option>
            <option value="571">蛋仔派对</option>
            <option value="822">元梦之星</option>
            <option value="874">鸣潮</option>
            <option value="777">晶核</option>
            <option value="36">阴阳师</option>
            <option value="343">DNF手游</option>
            <option value="662">绝区零</option>
          </select>
        </div>
        <div class="buttonBox">
          <button type="button" id="liBtnStart" class="el-button search-btn el-button--primary el-button--small">开始</button>
          <button type="button" id="liBtnEnd" class="el-button search-btn el-button--primary el-button--small">终止</button>
        </div>
      </div>
      <div class="liwkerMain">
        <!-- <div class="liwkerMsg">
          1. “高级的玫瑰”已成功发送消息
        </div> -->
      </div>
    `,document.querySelector("body").appendChild(o);let l=document.querySelector("#liwkerBtnShow");l.onclick=e=>{let t=document.querySelector("#liwkerArea"),i=t.querySelector(".top"),o=t.querySelector(".liwkerMain");"none"!==i.style.display?(t.style.height="0px",i.style.display="none",o.style.display="none",e.target.innerText="显示"):(t.style.height="550px",i.style.display="flex",o.style.display="block",e.target.innerText="隐藏")};let n=document.querySelector("#send_content"),a=document.querySelector("#area_select");n.value="主播你好呀~";let r=document.querySelector("#liBtnStart"),d=document.querySelector("#liBtnEnd");e.isRun?(r.disabled=!0,r.classList.add("is-disabled"),d.disabled=!1,d.classList.remove("is-disabled")):(r.disabled=!1,r.classList.remove("is-disabled"),d.disabled=!0,d.classList.add("is-disabled")),r.onclick=()=>{if(!n.value||""==n.value.trim()){window.alert("请输入发送的消息");return}e.content=n.value.split("&"),e.parent_id_List.includes(Number(a.value))?(e.parent_area_id=a.value,e.area_id=0):e.wangyou_id_List.includes(Number(a.value))?(e.parent_area_id=2,e.area_id=a.value):(e.parent_area_id=3,e.area_id=a.value),n.disabled=!0,n.classList.add("is-disabled"),a.disabled=!0,r.disabled=!0,r.classList.add("is-disabled"),d.disabled=!1,d.classList.remove("is-disabled"),e.isRun=!0,e.livePage=1,s()},d.onclick=()=>{n.disabled=!1,n.classList.remove("is-disabled"),a.disabled=!1,r.disabled=!1,r.classList.remove("is-disabled"),d.disabled=!0,d.classList.add("is-disabled"),e.isRun=!1,e.livePage=1}}()}()}();