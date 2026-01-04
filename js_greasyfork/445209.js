// ==UserScript==
// @name         稿定素材
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  稿定素材库 快速选择素材ID
// @author       chengguan
// @match        https://*.gaoding.com/*
// @run-at       document-start
// @icon         https://st-gdx.dancf.com/assets/20190910-143541-210a.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445209/%E7%A8%BF%E5%AE%9A%E7%B4%A0%E6%9D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/445209/%E7%A8%BF%E5%AE%9A%E7%B4%A0%E6%9D%90.meta.js
// ==/UserScript==
;(function () {
  'use strict'
 
  document.addEventListener('DOMContentLoaded', () => {
    // 在素材详情页面
    if (/gaoding.com\/material\/\d+/.test(window.location.href)) {
      const materialId = window.location.href.match(
        /gaoding.com\/material\/(\d+)/,
      )[1]
 
      document.querySelector('.gdd-material-detail').firstChild.addEventListener('click', (e) => {
        if (e.altKey) {
          const avalon = window.open(
            `https://avalon.gaoding.com/c/content/materials/${materialId}`,
          )
        }
      })
    }
 
    // 其他页面
    document.addEventListener('click', function (e) {
      if (!e.altKey) {
        return
      }
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
        const link = e.target.closest('a')
        if (link && /\/material\/\d+\b/.test(link.href)) {
          e.preventDefault()
 
          const materialId = link.href.match(/\b\d+\b/)[0]
 
          const avalon = window.open(
            `https://avalon.gaoding.com/c/content/materials/${materialId}`,
          )
        }
      }
    })
  });
  // Your code here...
 
  document.addEventListener('DOMContentLoaded', () => {
    const selectedIdContainer = document.createElement('div');
    selectedIdContainer.setAttribute('hidden', true);
    selectedIdContainer.style.cssText = `
        position: fixed;
        width: 363px;
        height: 286px;
        border: 1px solid rgb(204, 204, 204);
        z-index: 99999;
        top: 100px;
        left: 20px;
        background-color: rgb(238, 238, 238);
        resize: both;
        overflow: auto;
        padding: 10px;
        overflow-wrap: break-word;
        `
    document.body.appendChild(selectedIdContainer);
 
    document.addEventListener('dblclick', () => {
        selectedIdContainer.toggleAttribute('hidden');
    });
 
    const ids = new Set()
 
    document.addEventListener('click', function (e) {
      if (!e.shiftKey) {
        return
      }
      e.preventDefault();
      e.stopImmediatePropagation()
      if (window.location.host === 'www.gaoding.com') { // 稿定主站上的逻辑
        if (e.target.tagName === 'IMG') {
          const card = e.target.closest('.gdd-material-card__preview');
          if (card) {
            const link = card.nextElementSibling;
            debugger;
            if (link && /\/template\/\d+\b/.test(link.href)) {
              e.preventDefault()
 
              const id = link.href.match(/\b\d+\b/)[0]
 
              if (ids.has(id)) {
                // 删除
                ids.delete(id)
                card.selectIcon.remove()
              } else {
                // 添加
                ids.add(id)
                toggleSelect(card)
              }
 
              selectedIdContainer.innerHTML = [...ids].join(',')
            }
          }
        }
 
      } else if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') { // 稿定素材站逻辑
        const link = e.target.closest('a')
        if (link && /\/material\/\d+\b/.test(link.href)) {
          e.preventDefault()
 
          const id = link.href.match(/\b\d+\b/)[0]
 
          if (ids.has(id)) {
            // 删除
            ids.delete(id)
            link.selectIcon.remove()
          } else {
            // 添加
            ids.add(id)
            toggleSelect(link)
          }
 
          selectedIdContainer.innerHTML = [...ids].join(',')
        }
      }
    }, true);
 
    function toggleSelect(ele) {
      const selectIcon = document.createElement('div')
      selectIcon.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        text-align: center;
        padding: 20px;
        box-sizing: border-box;
        font-size: 120px;
        color: red;
        text-shadow: 1px 3px 2px #fff;
        pointer-events: none;
        z-index: 9;
        top: 0;
        left: 0;
        font-family: none;
    `
      selectIcon.innerHTML = '✓'
      ele.appendChild(selectIcon)
      ele.selectIcon = selectIcon
    }
  })
})()