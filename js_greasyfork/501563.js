// ==UserScript==
// @name         Phira谱面下载
// @namespace    https://phira.moe/
// @license      MIT
// @version      0.1
// @description  使用户可以方便的下载phira谱面
// @author       bilibili@叫什么名字好呢1024
// @run-at       document-start
// @match        https://phira.moe/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501563/Phira%E8%B0%B1%E9%9D%A2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/501563/Phira%E8%B0%B1%E9%9D%A2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.onPathChange = (oldPath, newPath)=>{
    //alert(oldPath, newPath)
    //console.log(oldPath, newPath)
    let chartId
    if(newPath.startsWith('/chart/')&&(chartId=newPath.split('/')[2])){
      console.log('chartId' + chartId)
      fetch('https://api.phira.cn/chart/' + chartId).then(async(res)=>{
        let obj = JSON.parse(await res.text())
        addDownloadBtn(obj.file.split('/')[4])
      })
       //addDownloadBtn('aa44f5ef-e800-4fc5-bdf3-580cf7b24d82')
    }
  }

  function addDownloadBtn(path){
    var interval = setInterval(()=>{
      console.log('interval')
      if(document.querySelector('body #app .w-full.mt-20 .relative .flex .w-full .flex h1.font-black')){
        document.querySelector('body #app .w-full.mt-20 .relative .flex .w-full .flex h1.font-black').insertAdjacentHTML('afterend', `<a href='https://files-cf.phira.cn/${path}' class='card bg-base-100 p-4 flex-col items-center mt-16 btn' download='' filename='谱面.zip'>下载谱面</a>`)
        clearInterval(interval)
      }
    })
  }

  window.onPathChange(null, location.pathname)

  ;(function() {
    var pathCache = location.pathname
    setInterval(()=>{
      
      if(pathCache!=location.pathname){
        window.onPathChange(pathCache, location.pathname)
        pathCache = location.pathname
      }
    })
  })();
})();