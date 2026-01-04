// ==UserScript==
// @name         Mark一下B站版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mark一下，方便整理记录视频的不同时间点，一键直达或分享!
// @author       Bleu_Bleine
// @license      AGPL-3.0-or-later
// @match        https://*.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.4.0/vue.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/472335/Mark%E4%B8%80%E4%B8%8BB%E7%AB%99%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/472335/Mark%E4%B8%80%E4%B8%8BB%E7%AB%99%E7%89%88.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const css = `
p {
margin: 0;
}
a {
text-decoration: none;
}
.bb-mark,.bb-panel {
position: fixed;
right: 0;
top: 66px;
}
.bb-mark {
background-color: #00AEEC;
width: 80px;
text-align: center;
height: 30px;
border-radius: 0 0 0 4px;
line-height: 30px;
z-index: 8;
}
.bb-mark a {
color: #fff;
font-size: 12px;
}
.bb-container.active .bb-mark a::before {
content: "X ";
}
.bb-panel {
transition: .3s;
visibility: hidden;
opacity: 0;
transform: translate3d(30%,0,0);
border-radius: 8px 0 0 8px;
box-shadow: 0 0 30px #0000001a;
border-right: 0;
background-color: #fff;
z-index: 7;
overflow: hidden;
}
.bb-container.active .bb-panel {
visibility: visible;
opacity: 1;
transform: translate3d(0,0,0);
}
div.bb-popover {
width: 370px;
height: 640px;
position: relative;
}
.bb-content {
display: flex;
flex-direction: column;
height: 100%;
}
.bb-panel-option {
width: 300px ;
display: flex;
justify-content: flex-end;
height: 30px;
background-color: #00AEEC;
padding-right: 18px;
box-sizing: border-box;
}
.bb-panel-option a {
display: flex;
align-items: center;
justify-content: center;
width: 36px;
cursor: pointer;
color: #fff;
}
.bb-list {
flex: 1;
overflow-y: scroll;
}
.bb-v-item {
padding: 8px 12px;
display: flex;
align-items: center;
}
.bb-list::-webkit-scrollbar {
display: none;
}
.bb-v-item:hover {W
background-color: #eee;
cursor: pointer;
}
.bb-item-left {
flex: 1;
display: flex;
align-items: center;
}
.bb-cover {
width: 120px;
position: relative;
box-sizing: border-box;
}
.bb-cover img {
width: 100%;
height: 75px;
object-fit: contain;
background-color: #000;
}
.bb-desc {
flex: 1;
margin-left: 10px;
font-size: 14px;
color: #333;
line-height: 1.4;
}
.bb-up,.bb-ps {
margin-top: 4px;
color: #666;
font-size: 12px;
line-height: 1.4;
}
.bb-item-right {
width: 32px;
height: 88px;
display: flex;
flex-direction: column;
align-self: flex-start;
margin-left: 6px
}
.bb-item-right a {
flex: 1;
display: flex;
align-items: center;
justify-content: center;
border-bottom: 1px solid #eee;
font-size: 14px;
}
.bb-item-right a:last-child {
border: none;
}
.bb-panel-option a svg {
fill: #fff;
}
.bb-time {
position: absolute;
top: 0;
left: 0;
font-size: 12px;
color: #fff;
background-color: rgba(0,0,0,.6);
padding: 2px 4px;
}
.bb-pop-view {
visibility: hidden;
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0,0,0,.6);
display: flex;
align-items: center;
justify-content: center;
z-index: 9;
}
.bb-pop-view.active {
visibility: visible;
}
.bb-pop-content {
width: 600px;
background-color: #fff;
border-radius: 12px;
margin-top: -60px;
opacity: 0;
transition: .3s;
}
.bb-pop-view.active .bb-pop-content {
opacity: 1;
margin-top: 0;
}
.bb-pop-title {
padding: 0 12px;
line-height: 2.4;
font-size: 16px;
border-bottom: 1px solid #ccc;
color: #333;
}
.bb-form {
padding: 20px;
}
.bb-form h3 {
font-size: 14px;
color: #333;
}
.bb-form-item {
display: flex;
justify-content: flex-start;
margin-top: 20px;
}
.bb-form-label {
width: 120px;
font-size: 14px;
color: #333;
}
.bb-form-input {
flex: 1;
padding: 4px;
border: 1px solid #999;
background-color: #fff;
color: #333;
}
.bb-btn-group {
display: flex;
justify-content: flex-end;
margin-top: 30px;
}
.bb-form-btn {
margin-left: 20px;
width: 60px;
text-align: center;
line-height: 2.0;
border: none;
outline: none;
border-radius: 4px;
opacity: .8;
font-size: 14px;
}
.bb-form-btn:hover {
opacity: 1;
}
.bb-btn-cancel {
background-color: #5bc0de;
color: #fff;
}
.bb-btn-save {
background-color: #5cb85c;
color: #fff;
}
.bb-btn-del {
background-color: #db0909;
color: #fff;
}
.bb-group-title {
display: flex;
align-items: center;
background-color: #eee;
padding: 4px 12px;
cursor: pointer;
border-top: 1px solid #ccc;
font-size: 14px;
line-height: 2.0
}
.bb-group-title a {
color: #333;
}
.bb-g-item.active .bb-group-title {
background-color: #fff;
border-bottom: 1px dashed #eee;
}
.bb-m-list {
height: 0;
overflow: hidden;
opacity: 0;
transition: .3s;
}
.bb-g-item.active .bb-m-list {
opacity: 1;
height: unset;
}
.bb-title-btns {
display: flex;
justify-content: center;
}
.bb-title-btns a {
margin: 0 12px;
}
.bb-empty {
text-align: center;
line-height: 32px;
font-size: 14px;
color: #999;
}
.bb-message {
line-height: 2.0;
text-align: center;
padding: 0 12px;
border-radius: 4px;
color: #fff;
visibility: hidden;
opacity: 0;
position: absolute;
bottom: 30px;
transition: .3s;
background-color: rgba(0,0,0,.8);
left: 50%;
transform: translateX(-50%);
}
.bb-message.active {
opacity: 1;
visibility: visible;
bottom: 60px;
}
.fixed-header .bili-header__bar,.international-header,.switch-wrap {
z-index: 129 !important;
}
#message-navbar {
z-index: 128 !important;
}
`
  var styleEl = document.createElement('style');
  styleEl.type = 'text/css'
  styleEl.textContent = css
  document.head.appendChild(styleEl);

  if (window.top != window.self) return;  //don't run on frames or iframes

  class MarkGroup {
    constructor(id, name,active = false) {
      this.id = id
      this.name = name,
      this.active = active
    }
  }
  class VideoMark {
    constructor(id, groupId = 0, vid,type, markTime, title, page=1, cover, up, videoTime, ps) {
      this.id = id
      this.type = 1
      this.groupId = groupId
      this.vid = vid
      this.type = type //1.投稿，2.剧集（番剧、电视剧）
      this.title = title
      this.page = page
      this.cover = cover
      this.up = up
      this.markTime = markTime
      this.videoTime = videoTime
      this.ps = ps
    }
  }
  class MarkGroupList {
    constructor() {
      if (GM_getValue('MARKGROUPS') == undefined) {
        GM_setValue('MARKGROUPS', JSON.stringify(new Array({ id: 0, name: '默认分组' ,active: true})))
      }
    }
    get() {
      let list = JSON.parse(GM_getValue('MARKGROUPS'))
      return list
    }
    add(group) {
      let groups = this.get()
      groups.push(group)
      GM_setValue('MARKGROUPS', JSON.stringify(groups))
    }
    remove(idx) {
      let groups = this.get()
      let videoMarks = new VideoMarkList().get(-1)
      videoMarks.forEach((item, vidx) => {
        if (item.groupId == groups[idx].id) videoMarks.splice(vidx, 1)
      })
      groups.splice(idx, 1)
      GM_setValue('MARKGROUPS', JSON.stringify(groups))
      GM_setValue('VIDEOMARKS', JSON.stringify(videoMarks))
    }
    update(group) {
      let groups = this.get()
      groups.forEach((item,idx) => {
        if (item.id == group.id) groups[idx] = group
      })
      GM_setValue('MARKGROUPS', JSON.stringify(groups))
    }
  }
  class VideoMarkList {
    constructor() {
      if (GM_getValue('VIDEOMARKS') == undefined) {
        GM_setValue('VIDEOMARKS', JSON.stringify(new Array()))
      }
    }
    get(groupId) {
      let videoMarks = JSON.parse(GM_getValue('VIDEOMARKS'))
      if (groupId == -1) { return videoMarks }
      let list = new Array()
      videoMarks.forEach(item => {
        if (item.groupId == groupId) list.push(item)
      })
      return list
    }
    add(mark) {
      let videoMarks = this.get(-1)
      videoMarks.unshift(mark)
      GM_setValue('VIDEOMARKS', JSON.stringify(videoMarks))
    }
    remove(id) {
      let videoMarks = this.get(-1)
      videoMarks.forEach((item, idx) => {
        if (item.id == id) videoMarks.splice(idx, 1)
      })
      GM_setValue('VIDEOMARKS', JSON.stringify(videoMarks))
    }
    update(mark) {
      let videoMarks = this.get(-1)
      videoMarks.forEach((item, idx) => {
        if (item.id == mark.id) videoMarks[idx] = mark
      })
      GM_setValue('VIDEOMARKS', JSON.stringify(videoMarks))
    }
  }
  class IdManager {
    constructor() {
      this.groupId = 1
      this.vid = 1
      if (GM_getValue('IDMANAGER') == undefined) {
        GM_setValue('IDMANAGER', JSON.stringify({ groupId: 1, vid: 1 }))
      }
      this.get()
    }
    get() {
      const imj = GM_getValue('IDMANAGER')
      if (imj) {
        let im = JSON.parse(imj)
        this.groupId = im.groupId
        this.vid = im.vid
      }
      return this
    }
    updateGroupId() {
      this.groupId++
      GM_setValue('IDMANAGER', JSON.stringify({ groupId: this.groupId, vid: this.vid }))
    }
    updateVid() {
      this.vid++
      GM_setValue('IDMANAGER', JSON.stringify({ groupId: this.groupId, vid: this.vid }))
    }
  }
  $(function () {
    var bbMarker = document.createElement('div')
    bbMarker.id = "bb-marker"
    document.body.appendChild(bbMarker)
    let idManager = new IdManager()
    let markGroupList = new MarkGroupList()
    let videoMarkList = new VideoMarkList()
    new Vue({
      el: '#bb-marker',
      template: `
      <div style="position:fixed;z-index:129">
        <div class="bb-container" :class="{'active': isActive}">
      <div class="bb-mark" @click="onActive">
        <a href="javascript:;">Mark一下</a>
      </div>
      <div class="bb-panel">
        <div class="bb-popover">
          <div class="bb-content">
            <div class="bb-panel-option">
              <a href="javascript:;" title="创建" @click="videoMarkForm"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg></a>
              <a href="javascript:;" title="创建分组" @click="groupFormAction"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 96C0 60.7 28.7 32 64 32H196.1c19.1 0 37.4 7.6 50.9 21.1L289.9 96H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16H286.6c-10.6 0-20.8-4.2-28.3-11.7L213.1 87c-4.5-4.5-10.6-7-17-7H64z"/></svg></a>
              <a href="javascript:;" title="刷新" @click="refreshList"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"/></svg></a>
            </div>
            <div class="bb-list">
              <div v-for="(group,gidx) in groupList" class="bb-g-item" :class="{'active': group.active}">
                <div class="bb-group-title">
                  <a href="javascript:;" style="flex:1;" @click="groupExpand(group,gidx)">{{group.name}}</a>
                  <div class="bb-title-btns" v-if="gidx">
                    <a href="javascript:;" @click="groupFormAction(true,group)"><svg xmlns="http://www.w3.org/2000/svg" height="1em"
                        viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                        <path
                          d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
                      </svg></a>
                    <a href="javascript:;" @click="delGroupAction(gidx)"><svg xmlns="http://www.w3.org/2000/svg" height="1em"
                        viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                        <path
                          d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                      </svg></a>
                  </div>
                </div>
                <div class="bb-m-list">
                <div class="bb-empty" v-if="!getGroupData(group.id).length">空空如也</div>
                <div v-for="item in getGroupData(group.id)" class="bb-v-item">
                  <div style="flex:1">
                    <div class="bb-item-left" @click="onMarkTap(item)">
                      <div class="bb-cover">
                        <img :src="item.cover+'@336w_190h_!web-video-rcmd-cover.webp'" alt="">
                        <p class="bb-time">{{timeFormat(item.currentTime)}}/{{timeFormat(item.videoTime)}}</p>
                      </div>
                      <div class="bb-desc">
                        <p class="bb-title">{{item.title}}</p>
                        <p class="bb-up">UP: {{item.up}}</p>
                      </div>
                    </div>
                    <div class="bb-ps">备注: {{item.ps}}</div>
                  </div>
                  <div class="bb-item-right">
                    <a href="javascript:;" @click="onShareMark(item)"><svg xmlns="http://www.w3.org/2000/svg" height="1em"
                        viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                        <path
                          d="M400 255.4V240 208c0-8.8-7.2-16-16-16H352 336 289.5c-50.9 0-93.9 33.5-108.3 79.6c-3.3-9.4-5.2-19.8-5.2-31.6c0-61.9 50.1-112 112-112h48 16 32c8.8 0 16-7.2 16-16V80 64.6L506 160 400 255.4zM336 240h16v48c0 17.7 14.3 32 32 32h3.7c7.9 0 15.5-2.9 21.4-8.2l139-125.1c7.6-6.8 11.9-16.5 11.9-26.7s-4.3-19.9-11.9-26.7L409.9 8.9C403.5 3.2 395.3 0 386.7 0C367.5 0 352 15.5 352 34.7V80H336 304 288c-88.4 0-160 71.6-160 160c0 60.4 34.6 99.1 63.9 120.9c5.9 4.4 11.5 8.1 16.7 11.2c4.4 2.7 8.5 4.9 11.9 6.6c3.4 1.7 6.2 3 8.2 3.9c2.2 1 4.6 1.4 7.1 1.4h2.5c9.8 0 17.8-8 17.8-17.8c0-7.8-5.3-14.7-11.6-19.5l0 0c-.4-.3-.7-.5-1.1-.8c-1.7-1.1-3.4-2.5-5-4.1c-.8-.8-1.7-1.6-2.5-2.6s-1.6-1.9-2.4-2.9c-1.8-2.5-3.5-5.3-5-8.5c-2.6-6-4.3-13.3-4.3-22.4c0-36.1 29.3-65.5 65.5-65.5H304h32zM72 32C32.2 32 0 64.2 0 104V440c0 39.8 32.2 72 72 72H408c39.8 0 72-32.2 72-72V376c0-13.3-10.7-24-24-24s-24 10.7-24 24v64c0 13.3-10.7 24-24 24H72c-13.3 0-24-10.7-24-24V104c0-13.3 10.7-24 24-24h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H72z" />
                      </svg></a>
                    <a href="javascript:;" @click="videoMarkForm(true,item)"><svg xmlns="http://www.w3.org/2000/svg" height="1em"
                        viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                        <path
                          d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" />
                      </svg></a>
                    <a href="javascript:;" @click="onDelMark(item.id,gidx,group)"><svg
                        xmlns="http://www.w3.org/2000/svg" height="1em"
                        viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                        <path
                          d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                      </svg></a>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bb-message" :class="{'active': isShowMsg}">{{msgText}}</div>
        </div>
      </div>
    </div>
    <div class="bb-pop-view" :class="{'active': showMarkForm}">
      <div class="bb-pop-content">
        <p class="bb-pop-title">Mark一下: {{markViewAdd?'创建':'编辑'}}</p>
        <div class="bb-pop-body">
          <div class="bb-form">
            <div class="bb-item-left">
              <div class="bb-cover">
                <img v-if="formVideoMark.cover" :src="formVideoMark.cover+'@336w_190h_!web-video-rcmd-cover.webp'" alt="">
                <p class="bb-time">{{timeFormat(formVideoMark.currentTime)}}/{{timeFormat(formVideoMark.videoTime)}}</p>
              </div>
              <div class="bb-desc">
                <p class="bb-title">{{formVideoMark.title}}</p>
                <p class="bb-up">up: {{formVideoMark.up}}</p>
              </div>
            </div>
            <div class="bb-form-item">
              <label for="mark_group" class="bb-form-label">分组: </label>
              <select name="group" id="mark_group" class="bb-form-input" v-model="formVideoMark.groupId">
                <option v-for="group in groupList" :value="group.id">{{group.name}}</option>
              </select>
            </div>
            <div class="bb-form-item">
              <label for="mark_ps" class="bb-form-label">备注: </label>
              <textarea name="ps" id="mark_ps" rows="6" class="bb-form-input" v-model="formVideoMark.ps"></textarea>
            </div>
            <div class="bb-btn-group">
              <button type="button" class="bb-form-btn bb-btn-cancel" @click="videoMarkForm(false)">取消</button>
              <button type="button" class="bb-form-btn bb-btn-save" @click="onVideoMarkSave(markViewAdd)">保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bb-pop-view" :class="{'active': showGroupForm}">
      <div class="bb-pop-content">
        <p class="bb-pop-title">Mark一下: {{groupViewAdd?'创建分组':'编辑分组'}}</p>
        <div class="bb-pop-body">
          <div class="bb-form">
            <div class="bb-form-item">
              <label for="group_name" class="bb-form-label">分组名称: </label>
              <input type="text" class="bb-form-input" v-model="formGroup.name" />
            </div>
            <div class="bb-btn-group">
              <button type="button" class="bb-form-btn bb-btn-cancel" @click="groupFormAction(false)">取消</button>
              <button type="button" class="bb-form-btn bb-btn-save" @click="onGroupSave(groupViewAdd)">保存</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bb-pop-view" :class="{'active': showConfrim}">
      <div class="bb-pop-content">
        <p class="bb-pop-title">Mark一下: 删除分组“{{formGroup.name}}”</p>
        <div class="bb-pop-body">
          <div class="bb-form">
            <h3>删除分组将删除该分组下所有条目，确定吗？</h3>
            <div class="bb-btn-group">
              <button type="button" class="bb-form-btn bb-btn-cancel" @click="delGroupAction(false)">取消</button>
              <button type="button" class="bb-form-btn bb-btn-save" @click="onDelGroup(groupSelected)">确定</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
      data: {
        isActive: false,
        groupList: [],
        formVideoMark: new VideoMark(),
        showMarkForm: false,
        showGroupForm: false,
        formGroup: new MarkGroup(),
        markViewAdd: true,
        groupViewAdd: true,
        isShowMsg: false,
        msgText: '',
        showConfrim: false,
        groupSelected: 0
      },
      mounted() {
        this.groupList = markGroupList.get()
      },
      methods: {
        onActive: function () {
          this.isActive = !this.isActive
        },
        timeFormat: function (currentTime) {
          currentTime = parseInt(currentTime);
          var timeStr = '00:00';
          if (currentTime > 0) {
            var sec = currentTime % 60 <= 9 ? '0' + currentTime % 60 : currentTime % 60;
            var min = Math.floor(currentTime / 60) <= 9 ? '0' + Math.floor(currentTime / 60) : Math.floor(currentTime / 60);
            timeStr = min + ':' + sec;
          }
          return timeStr;
        },
        getGroupData: function (groupId) {
          return videoMarkList.get(groupId)
        },
        onDelMark: function (id,gidx,group) {
          videoMarkList.remove(id)
          this.$set(this.groupList,gidx,group)
        },
        getData: async function() {
          var url = window.location.href;
          let markData = new VideoMark()
          var video
          var videos = document.getElementsByTagName('video')
          $.each(videos, (i, v) => {
            if (v.currentSrc != '') video = v
          })
          if(url.match(/BV[a-zA-Z0-9]+/)){
            var bvCode = url.match(/BV[a-zA-Z0-9]+/)
            var page = url.match(/p=([0-9]+)/)
            let data = await $.getJSON('https://api.bilibili.com/x/web-interface/view?bvid=' + bvCode)
            if(data.code == 0) {
              let time = new Date()
              const vData = data.data
              markData.id = idManager.vid
              markData.groupId = 0
              markData.vid = vData.bvid
              markData.type = 1
              markData.markTime = time.toLocaleString()
              markData.title = vData.title
              markData.cover = vData.pic.replace('http://', 'https://')
              markData.up = vData.owner.name
              markData.currentTime = video.currentTime
              markData.videoTime = video.duration
              markData.ps = ''
              if(page && page[1]) markData.page = parseInt(page[1])
            } else {
              this.showMessage("获取视频信息失败")
            }
          } else if(url.includes('/bangumi/play/')) {
            let bvCode = url.match(/ss[0-9]+|ep[0-9]+/).toString()
            let sorpId = bvCode.replace(/ss|ep/,'')
            let parm = bvCode.includes('ss') ? 'season_id=' : 'ep_id='
            parm += sorpId
            let data = await $.getJSON('https://api.bilibili.com/pgc/view/web/season?'+parm)
            if(data.code == 0) {
              let time = new Date()
              const vData = data.result
              markData.id = idManager.vid
              markData.groupId = 0
              markData.vid = bvCode
              markData.type = 2
              markData.markTime = time.toLocaleString()
              markData.title = vData.title + ': ' + $('#player-title').text()
              markData.cover = vData.cover
              markData.up = vData.up_info.uname
              markData.currentTime = video.currentTime
              markData.videoTime = video.duration
              markData.ps = ''
            } else {
              this.showMessage("获取视频信息失败")
            }
          }
          return markData
        },
        videoMarkForm: async function (open = true,mark=false) {
          if (open) {
            if(mark) {
              this.formVideoMark = mark
              this.markViewAdd = false
            } else {
              const data = await this.getData()
              if(!data.vid) {
                this.showMessage("当前页面不可用")
                return
              }
              this.formVideoMark = data
            }
            this.showMarkForm = true
            return
          }
          this.showMarkForm = false
        },
        onVideoMarkSave: function (add=true) {
          this.videoMarkForm(false)
          if(add) {
            videoMarkList.add(this.formVideoMark)
            idManager.updateVid()
          } else {
            videoMarkList.update(this.formVideoMark)
          }
          this.$set(this.groupList)
        },
        showMessage: function(msg) {
          this.msgText = msg
          this.isShowMsg = true
          setTimeout(() => {
            this.isShowMsg = false
          },3000)
        },
        groupFormAction: function (open = true,group=false) {
          if (open) {
            if(group) {
              this.formGroup = group
              this.groupViewAdd = false
            } else {
              this.formGroup.id = idManager.groupId
              this.formGroup.name = ''
              this.groupViewAdd = true
            }
            this.showGroupForm = true
            return
          }
          this.showGroupForm = false
        },
        onGroupSave: function (add=true) {
          this.groupFormAction(false)
          if(add) {
            markGroupList.add(this.formGroup)
            idManager.updateGroupId()
          } else {
            markGroupList.update(this.formGroup)
          }
          this.groupList = markGroupList.get()
        },
        groupExpand: function(group,gidx) {
          group.active = !group.active
          this.$set(this.groupList,gidx,group)
        },
        refreshList: function() {
          this.groupList = markGroupList.get()
          this.showMessage("已刷新")
        },
        delGroupAction: function(idx) {
          if(idx) {
            this.groupSelected = idx
            this.formGroup = this.groupList[idx]
            this.showConfrim = true
            return
          }
          this.showConfrim = false
        },
        onDelGroup: function(idx) {
          this.showConfrim = false
          if(idx <= 0) return
          markGroupList.remove(idx)
          this.groupList.splice(idx,1)
        },
        onShareMark: function(mark) {
          let p = mark.page > 1 ? `p=${mark.page}&` : ''
          let pn = mark.page > 1 ? `P${mark.page}` : ''
          let typeUrl = mark.type == 1 ? 'video' : 'bangumi/play'
          let txt = `【${mark.title}】【精准空降到${pn} ${this.timeFormat(mark.currentTime)}】https://www.bilibili.com/${typeUrl}/${mark.vid}/?${p}share_source=copy_web&t=${mark.currentTime}`
          navigator.clipboard.writeText(txt).then(e => {
            this.showMessage("已复制链接到剪贴板")
          })
        },
        onMarkTap: function(mark) {
          let p = mark.page > 1 ? `p=${mark.page}&` : ''
          let typeUrl = mark.type == 1 ? 'video' : 'bangumi/play'
          let link = `https://www.bilibili.com/${typeUrl}/${mark.vid}/?${p}share_source=copy_web&t=${mark.currentTime}`
          window.open(link)
        }
      }
    })
  })
})();