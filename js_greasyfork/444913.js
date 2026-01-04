// ==UserScript==
// @name         蓝湖样式修改
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  用于修改蓝湖页面解析出来的CSS属性
// @author       slipper
// @match        *://lanhuapp.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444913/%E8%93%9D%E6%B9%96%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/444913/%E8%93%9D%E6%B9%96%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var layerTimer = null
  var treeListTimer = null

  const cssFontWeightObj = {
    '500':'bold',
    '600':'bold',
    '700':'bold',
    '800':'bolder',
    '900':'bolder',
  }

  function findLayerWrap(){
    const elems = document.querySelectorAll('.layers_item')

    if(elems.length){
      clearInterval(layerTimer)
      elems.forEach(ele=>{
        ele.addEventListener('click',()=>{
          let codeParent = document.querySelector('.language-css').querySelector('.language-css')
          for (let i = 0; i < codeParent.childNodes.length; i++) {
            let child = codeParent.childNodes[i];
            let textContent = child.textContent.trim()
            // console.error('textContent: ', textContent);
            if(Object.keys(cssFontWeightObj).includes(textContent)){
              let fatherType = codeParent.childNodes[i - 2].textContent;
              if(fatherType.trim() === 'font-weight'){
                child.textContent = ` ${cssFontWeightObj[textContent]}`
              }
            }
          }
        })
      })
    }
  }

  function findTreeListItem(){
    const elems = document.querySelectorAll('.lan-tree-list-item')

    if(elems.length){
      clearInterval(treeListTimer)
      elems.forEach(ele=>{
        ele.addEventListener('click',()=>{
          let layersTimer = null
          const layersItem= document.querySelectorAll('.layers_item')
          if(!layersItem.length){
            layersTimer = setInterval(()=>{
              findLayerWrap()
            },300)
          }else{
           clearInterval(layersTimer)
          }
        })
      })
    }
  }

  layerTimer = setInterval(()=>{
    findLayerWrap()
  },1000)

  treeListTimer = setInterval(()=>{
    findTreeListItem()
  },1000)


})();