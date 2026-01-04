// ==UserScript==
// @name         国开页面替换学生姓名
// @author       delfino
// @namespace    ouchn.cn
// @description  替换国开页面学生姓名，用于避免截图制作教学课件时出现学生姓名
// @match        https://menhu.pt.ouchn.cn/*
// @match        https://lms.ouchn.cn/*
// @grant        none
// @version      0.1
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455095/%E5%9B%BD%E5%BC%80%E9%A1%B5%E9%9D%A2%E6%9B%BF%E6%8D%A2%E5%AD%A6%E7%94%9F%E5%A7%93%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/455095/%E5%9B%BD%E5%BC%80%E9%A1%B5%E9%9D%A2%E6%9B%BF%E6%8D%A2%E5%AD%A6%E7%94%9F%E5%A7%93%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const lista = new Map([
      ['孙强', '贾学生'],
    ])

    let observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => reemplazar(node))
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    let reemplazar = (curNode)=> {
      getAllChildNodes(curNode).forEach(node => {
        lista.forEach((value, key) => {
          if (node instanceof Text && node.nodeValue.includes(key)){
              console.log(key,value)
            node.nodeValue = node.nodeValue.replace(key, value)
          }else if (node instanceof HTMLInputElement && node.value.includes(key)){
            node.value = node.value.replace(key, value)
          }
        })
      })
    }

    let getAllChildNodes = (curNode) => {
      const list = []
      if(curNode.childNodes.length === 0&&curNode instanceof Text ){
        list.push(curNode)
      }else{
        curNode.childNodes.forEach(child => {
          if (child.childNodes.length === 0&&child instanceof Text ){
            list.push(child)
          }else{
            list.push(...getAllChildNodes(child))
          }
        })
      }
      return list
    }
    //reemplazar(document.body)
})();