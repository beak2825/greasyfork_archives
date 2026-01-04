// ==UserScript==
// @name         表格数据采集
// @namespace    http://hbchzz.ch.mnr.gov.cn
// @version      0.0.1
// @description  乱码拜拜
// @author       zhd
// @match        http://hbchzz.ch.mnr.gov.cn/Index/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403804/%E8%A1%A8%E6%A0%BC%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/403804/%E8%A1%A8%E6%A0%BC%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(async function() {
    'use strict';
  
    var allDatas = []
  
    async function wait(time) {
      return new Promise(resolve => {
        setTimeout(()=> resolve(), time * 1000)
      })
    }
  
    function getTableData() {
      var table = document.querySelector('table')
      var trs = table.querySelectorAll('tr')
      var items = []
      for(var i = 1; i < trs.length; i++) {
        var item = {}
        var tds = trs[i].querySelectorAll('td')
        for(var j = 0; j < tds.length; j ++) {
          item[j] = tds[j].innerText
        }
        items.push(item)
      }
      return items
    }
  
    function getAnchors() {
      let anchors = document.querySelectorAll('a')
      anchors = Array.prototype.slice.call(anchors, 0)

      anchors = anchors.filter(anchor => !isNaN(anchor.innerHTML) || (anchor.children.length > 0 && anchor.children[0].src === "http://hbchzz.ch.mnr.gov.cn/images/PageNavi/moren.gif"))
      if(anchors.length > 10) {
        anchors = anchors.slice(1)
      }
      
      return anchors
    }
  
    function update() {
      allDatas = allDatas.concat(getTableData())
    }
  
    async function updatePage(anchors) {
      for(let a of anchors) {
        a.click()
        await wait(1)
        update()
      }
    }
  
    async function recursive() {
      let anchors = getAnchors()
      if(anchors.length < 10) {
        await updatePage(anchors)
        return
      } else {
        await updatePage(anchors)
        recursive()
      }
    }
  
    async function run() {
      console.log('run')
      
      update()
      await recursive()
      console.log(JSON.stringify(allDatas))
    }
  
    await run()
})();