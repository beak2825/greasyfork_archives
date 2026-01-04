// ==UserScript==
// @name         ddys-player-history（低端影视-显示播放历史记录）
// @version      0.6
// @namespace    XZX
// @license      MIT
// @description  快速定位至未播放完的视频，用于了解当前有哪些剧集没看完的，避免找不到播放记录。
// @author       XZX
// @match        https://ddrk.me/*
// @match        https://ddys.tv/*
// @match        https://ddys.pro/*
// @match        https://ddys2.me/*
// @match        https://ddys.art/*
// @match        https://ddys.mov/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @supportURL   w1529084525@gamil.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479222/ddys-player-history%EF%BC%88%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86-%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/479222/ddys-player-history%EF%BC%88%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86-%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (localStorage) {
    
    // 用于存储记录
    let history = []
    let k = 'videojs-resume:'
    let c_k = 'ddys-cn-title:'
    const origin = window.location.origin;
    Object.keys(localStorage)
      .filter(key => key.indexOf(k) != -1)
      .forEach(key => {
        history.push(key.replace(k, ''))
      })

    // 排序
    history = history.sort()

    // 分组
    let groupedTitles = {};
    for (let url of history) {
      let groupName = url.split('/')[1];
      if (!groupedTitles.hasOwnProperty(groupName)) {
        groupedTitles[groupName] = [];
      }
      groupedTitles[groupName].push(url);
    }

    // 自动保存中文名称（是否包含视频播放器，判断是否在播放界面）
    let v = document.getElementsByClassName('wp-playlist')
    if (v && v.length) {
      let title = document.title
      if (title.includes('- 低端影视')) {
        title = title.split(' - ')[0]
        if (title.includes('(') && title.includes(')')) {
          title = title.split(' (')[0]
        }
        // 进行保存
        localStorage.setItem(c_k + window.location.pathname.split('/')[1], title)
      }
    }
    
    // 匹配影视中文
    /** Object.keys(groupedTitles).forEach(key => {
      if (!localStorage.getItem(c_k + key)) {
        $.ajax({   
          type: "get",   
          url: origin + "/" + key,   
          success: function(response) { 
            if (response.status == 200) {
              let html = response.responseText
              let titleRegex = /<title>(.*?)<\/title>/;
              let match = html.match(titleRegex);
              let title = match[1];
              if (title) {
                if (title.includes('- 低端影视')) {
                  title = title.split(' - ')[0]
                  if (title.includes('(') && title.includes(')')) {
                    title = title.split(' (')[0]
                  }
                  // 进行保存
                  localStorage.setItem(c_k + key, title)
                }
              }
            }
          }   
        });
      }
    })*/
    
    // 绘制UI
    const panel = 
      `<div id="play-history" style="border: 1px solid grey; background-color: #1f1f1f; min-width: 220px; position: fixed; right: 0; bottom: 0; border-radius: 10px;color: #367d9d;">
          <div style="border-bottom: 1px solid grey; padding: 10px; font-weight: bold; text-align: center;">
            <a href="#" style="position: absolute; left: 5px;" onclick="document.getElementById('list').remove()">[清空]</a>
            播放记录
            <a href="#" style="position: absolute; right: 5px;" onclick="document.querySelector('#play-history').remove()">[关闭]</a>
          </div>
          <ul style="list-style-type: none; padding: 10px; margin: 0;" id="list">
            ${!history.length ? '暂无播放记录，先去观影吧...' : Object.keys(groupedTitles).map(key => 
              `<div style="color: white">${localStorage.getItem(c_k + key) ? localStorage.getItem(c_k + key) : key}</div>` + 
              groupedTitles[""+key+""].map(item => {
                return `<li>
                  <a href="${origin + item}">${item}</a>
                  <span style="font-size: 14px">[${((Number(localStorage.getItem(k + item)) / 60).toFixed(2) + '').replace('.', ':')}]</span>
                  <a href="#" style="float:right;margin-left:10px" onclick="localStorage.removeItem('${k + item}');this.parentElement.remove()"><i class="fa fa-remove"></i></a>
                </li>`
              }).join(''))
            .join('')}
          <ul>
        </div>
      </div>`
    document.querySelector("body").insertAdjacentHTML("beforeend", panel);

    // 删除广告
    setTimeout(() => {
      if(document.querySelector('.cfa_popup')){
        document.querySelector('.cfa_popup').remove()       
      }
      if(document.getElementById('sajdhfbjwhe')){
        document.getElementById('sajdhfbjwhe').remove()       
      }
    }, 500);
  }

})();