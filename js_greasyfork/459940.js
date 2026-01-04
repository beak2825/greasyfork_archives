// ==UserScript==
// @name        信趣邦助手-章节点击 - hxdi.cn
// @namespace   Violentmonkey Scripts
// @match       https://study.cp.hxdi.cn/*
// @grant       unsafeWindow
// @grant       GM_log
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_addStyle
// @version     1.0.0
// @author      -
// @run-at       document-start
// @license MIT
// @description 2023/2/9 08:57:21
// @downloadURL https://update.greasyfork.org/scripts/459940/%E4%BF%A1%E8%B6%A3%E9%82%A6%E5%8A%A9%E6%89%8B-%E7%AB%A0%E8%8A%82%E7%82%B9%E5%87%BB%20-%20hxdicn.user.js
// @updateURL https://update.greasyfork.org/scripts/459940/%E4%BF%A1%E8%B6%A3%E9%82%A6%E5%8A%A9%E6%89%8B-%E7%AB%A0%E8%8A%82%E7%82%B9%E5%87%BB%20-%20hxdicn.meta.js
// ==/UserScript==

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

function isStrInArray(str, arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    if (arr[i] == str) {
      return true;
    }
  }
  return false;
}

addEventListener("load",function(){
  console.log('信趣邦章节助手启动')
  ty = 0
  var hrefList = window.location.href.split('/')
  console.log(hrefList)
  if(hrefList[3]==='Studydet'){
    if($('.ldtl3-item')[4].textContent!=='学习进度：100%'){
      console.log('开学')
      document.querySelectorAll('.ldt-ksxx')[0].click()
    }
  }
  if((hrefList[3]==='studymap'||hrefList[3]==='StudyMap')&&hrefList[4]==='detail'){
    console.log('章节界面')
    var chapterslist = []
    var watchingNow = 0
    var chaptersIndexes = []
    var timer1 = unsafeWindow.setTimeout(function() {
      console.log('0.5秒钟之后读取未完成列表')
      if($('.top1').length>1){
        console.log('类型1')
        $('.top1').each(function(index,element){
          if(element.getElementsByClassName('percent').length>0 && element.getElementsByClassName('percent')[0].textContent!=='100%'){
            chapterslist.push(element)
            chaptersIndexes.push(element.getElementsByClassName('t_top')[0].textContent)
          }
        })
        console.log('未完成列表：',chapterslist)
        console.log('chaptersIndexes:',chaptersIndexes)
        watchingNow = 0
        console.log('将观看：',chapterslist[watchingNow].getElementsByClassName('t_top')[0].textContent,'进度：',chapterslist[watchingNow].getElementsByClassName('percent')[0].textContent)
      }else{
        console.log('类型2')
        ty = 1
        $('.br1').each(function(index,element){
          if(element.getElementsByClassName('task_bt')[0].textContent.replaceAll('\n','').replaceAll(' ','')!=='已完成'){
            chapterslist.push(element)
            chaptersIndexes.push(element.getElementsByTagName('a')[0].textContent)
          }
        })
        console.log('未完成列表：',chapterslist)
        console.log('chaptersIndexes:',chaptersIndexes)
        watchingNow = 0
        console.log('将观看：',chapterslist[watchingNow].getElementsByTagName('a')[0].textContent,'进度：',chapterslist[watchingNow].getElementsByClassName('task_bt')[0].textContent.replaceAll('\n','').replaceAll(' ',''))
      }
    },500)
    const repeatedGreetings1 = async () => {
          console.log('点击详情','watchingNow:',watchingNow)
          await sleep(1000)
          // console.log(i,watchingList[i])
          console.log(chapterslist[watchingNow].getElementsByClassName('detail')[0])
          chapterslist[watchingNow].getElementsByClassName('detail')[0].click()
          await sleep(1000)
          console.log('点击学习')
          // console.log(document.querySelectorAll('.study_btn')[0])
          document.querySelectorAll('.study_btn')[0].click()
          await sleep(1000)
       }
    const repeatedGreetings2 = async () => {
          console.log('点击标题','watchingNow:',watchingNow)
          await sleep(1000)
          // console.log(i,watchingList[i])
          chapterslist[watchingNow].getElementsByTagName('a')[0].click()
          await sleep(1000)
          console.log('点击学习')
          // console.log(document.querySelectorAll('.study_btn')[0])
          document.querySelectorAll('.study_btn')[0].click()
          await sleep(1000)
       }
    var timer2 = unsafeWindow.setTimeout(function(){
      console.log('timer2')
      if(ty === 0){
        console.log('尝试点击类型1')
       repeatedGreetings1()
      }else{
        console.log('尝试点击类型2')
       repeatedGreetings2()
      }
    },1000)
    var timer3 = unsafeWindow.setInterval(function() {
      console.log('检测当前','当前watchingNow',watchingNow)
      if(ty === 0){
        console.log('类型1，刷新chaptersList')
        chapterslist = []
        $('.top1').each(function(index,element){
          if(element.getElementsByClassName('percent').length>0 && isStrInArray(element.getElementsByClassName('t_top')[0].textContent, chaptersIndexes)){
            chapterslist.push(element)
          }
        })
        console.log('刷新后列表',chapterslist)
        console.log('当前播放进度：',chapterslist[watchingNow].getElementsByClassName('percent')[0].textContent)
        if(chapterslist[watchingNow].getElementsByClassName('percent')[0].textContent==='100%'){
          console.log('播放完毕一节，开启下一节')
          watchingNow += 1
          if(watchingNow === chapterslist.length){
            alert('本页播放完毕')
          }
          repeatedGreetings1()
        }
      }else{
        console.log('类型2，刷新chaptersList')
        chapterslist = []
        $('.br1').each(function(index,element){
          if(isStrInArray(element.getElementsByTagName('a')[0].textContent, chaptersIndexes)){
            chapterslist.push(element)
          }
        })
        console.log('刷新后列表',chapterslist)
        console.log('当前播放进度：',chapterslist[watchingNow].getElementsByClassName('task_bt')[0].textContent.replaceAll('\n','').replaceAll(' ',''))
        if(chapterslist[watchingNow].getElementsByClassName('task_bt')[0].textContent.replaceAll('\n','').replaceAll(' ','')==='已完成'){
          console.log('播放完毕一节，开启下一节')
          watchingNow += 1
          if(watchingNow === chapterslist.length){
            alert('本页播放完毕')
          }
          repeatedGreetings2()
        }
      }
    },10000)
  }
})