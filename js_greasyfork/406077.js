// ==UserScript==
// @name         哔哩哔哩首页修改--在首页添加"新番时间表"
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406077/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%A6%96%E9%A1%B5%E4%BF%AE%E6%94%B9--%E5%9C%A8%E9%A6%96%E9%A1%B5%E6%B7%BB%E5%8A%A0%22%E6%96%B0%E7%95%AA%E6%97%B6%E9%97%B4%E8%A1%A8%22.user.js
// @updateURL https://update.greasyfork.org/scripts/406077/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%A6%96%E9%A1%B5%E4%BF%AE%E6%94%B9--%E5%9C%A8%E9%A6%96%E9%A1%B5%E6%B7%BB%E5%8A%A0%22%E6%96%B0%E7%95%AA%E6%97%B6%E9%97%B4%E8%A1%A8%22.meta.js
// ==/UserScript==

(function () {
  'use strict';
  removeBanner();
  removeAds();
  removeLive();
  addAnimeTimeline();

  function addAnimeTimeline(){
    let container = document.createElement('div');
    container.style.width='100%';
    // container.className ='space-between report-wrap-module report-scroll-module';
    let header = document.createElement('header');
    // header.className ='storey-title';
    // header.style.display='block';
    let icon = '<svg t="1593150344651" style="transform:translateY(4px)" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3393" width="24.5" height="24.5"><path d="M762.8 71.1c-16-11.6-38.6-8.1-50.3 7.9L504.2 365.5 295.8 79c-11.6-16-34.3-19.6-50.3-7.9-16 11.6-19.6 34.3-7.9 50.3L461 428.5c-4.2 14.2 0.6 30.1 13.2 39.3 9 6.5 19.9 8.1 30 5.6 10 2.5 21 0.9 30-5.6 12.6-9.2 17.4-25.1 13.2-39.3l223.4-307.2c11.6-16 8-38.6-8-50.2z" fill="#FB813A" p-id="3394"></path><path d="M861.7 182.1H162.3c-33.8 0-61.1 27.4-61.1 61.1v655.4c0 33.8 27.4 61.1 61.1 61.1h699.5c33.8 0 61.1-27.4 61.1-61.1V243.2c0-33.8-27.4-61.1-61.2-61.1z" fill="#FDDE80" p-id="3395"></path><path d="M781.1 863.2H242.9c-21.5 0-39-17.5-39-39v-399c0-21.5 17.5-39 39-39h538.3c21.5 0 39 17.5 39 39v398.9c0 21.6-17.5 39.1-39.1 39.1z" fill="#FFFFFF" p-id="3396"></path><path d="M398.9 480.3H297c-5.2 0-9.4 4.2-9.4 9.4v101.9c0 5.2 4.2 9.4 9.4 9.4h102c5.2 0 9.4-4.2 9.4-9.4V489.7c-0.1-5.2-4.3-9.4-9.5-9.4zM563 480.3H461c-5.2 0-9.4 4.2-9.4 9.4v101.9c0 5.2 4.2 9.4 9.4 9.4h102c5.2 0 9.4-4.2 9.4-9.4V489.7c0-5.2-4.2-9.4-9.4-9.4zM727.1 480.3h-102c-5.2 0-9.3 4.2-9.3 9.3v102c0 5.2 4.2 9.4 9.4 9.4h102c5.2 0 9.3-4.2 9.3-9.3v-102c-0.1-5.2-4.3-9.4-9.4-9.4zM398.9 665.8h-102c-5.2 0-9.3 4.2-9.3 9.3v102c0 5.2 4.2 9.4 9.4 9.4h102c5.2 0 9.3-4.2 9.3-9.3v-102c0-5.2-4.2-9.4-9.4-9.4zM563 665.8H461c-5.2 0-9.4 4.2-9.4 9.4v101.9c0 5.2 4.2 9.4 9.4 9.4h102c5.2 0 9.4-4.2 9.4-9.4V675.2c0-5.2-4.2-9.4-9.4-9.4z" fill="#FB813A" p-id="3397"></path><path d="M625.1 786.5h102c5.2 0 9.4-4.2 9.4-9.4V675.2c0-5.2-4.2-9.4-9.4-9.4h-102c-5.2 0-9.4 4.2-9.4 9.4v101.9c0 5.2 4.2 9.4 9.4 9.4z" fill="#9289F0" p-id="3398"></path></svg>'
    header.innerHTML = `<div>${icon}<a href="/anime/timeline/" target="_blank" class="name" style="font-size:20px;margin-left:10px">新番时间表</a></div>`;
    container.appendChild(header);
    container.appendChild(document.createElement('br'))
    let timeline = document.createElement('iframe');
    timeline.setAttribute('id','timeline_frame');
    timeline.setAttribute('src','https://www.bilibili.com/anime/timeline/');
    timeline.style.width='100%';
    timeline.style.height='0px';
    timeline.style.border='none';
    timeline.scrolling='no';
    timeline.addEventListener('load',function(){
      // debugger
      let iDocument = this.contentWindow.document;
      iDocument.querySelector('#internationalHeader').remove();
      iDocument.querySelector('body > div.international-footer').remove();
      iDocument.querySelector('#app > div.bread-crumb').remove();
      iDocument.querySelector('#app > div.timeline-container').style.width='1425px';
      iDocument.querySelector('#app > div.timeline-container > div.timeline-wrapper.clearfix').style.width='1425px';
      iDocument.querySelector('#app > div.timeline-container > div.timeline-header').style.width='1425px';
      this.style.height=iDocument.body.clientHeight+'px';
      // this.style.height=iDocument.body.clientHeight
      let navigate = document.createElement('div');
      navigate.className = 'item sortable';
      navigate.innerText = '时间表';
      navigate.addEventListener('click',function(){
        container.scrollIntoView();
      })
      appendBefore(navigate, document.querySelector('#elevator > div.list-box > div:nth-child(1)').children[0]);
    })
    container.appendChild(timeline)
    // appendBefore(container, document.getElementById('bili_douga'))
    document.querySelector('#app > div > div.storey-box.b-wrap > div.proxy-box').appendChild(container)
  }

  function removeBanner(){
    document.querySelector('.bili-banner').remove();
    let bg = document.createElement('div');
    let style = bg.style;
    style.width='100%';
    style.height='56px';
    style.backgroundColor ='rgba(0,0,0,0.5)';
    appendAfter(bg, document.querySelector('.mini-header'));
  }

  function removeAds(){
    document.querySelector('#app > div > div.first-screen.b-wrap').remove();
  }

  function removeLive(){
    window.addEventListener('load',function(){
      document.getElementById('bili_live').remove();
      for (const div of document.querySelectorAll('#elevator > div.list-box > div:nth-child(1) > div')) {
        console.log('div.innerText: ', div.innerText);
        if(div.innerText=='直播'){
          div.remove();
        }
      }
    })
  }

  /**
   * 将newEl插入在目标之前
   * @param {HTMLElement} newEl
   * @param {HTMLElement} targetEl
   */
  function appendBefore(newEl,targetEl){
    targetEl.parentNode.insertBefore(newEl,targetEl);
  }

  /**
   * 将newEl插入在目标之后
   * @param {HTMLElement} newEl
   * @param {HTMLElement} targetEl
   */
  function appendAfter(newEl, targetEl) {
    let children = targetEl.parentNode.children;
    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      if(el==targetEl){
        if (i==children.length-1) {
          targetEl.parentNode.appendChild(newEl)
        }else{
          appendBefore(newEl,children[i+1]);
        }
      }
    }
  }

  // Your code here...
})();

