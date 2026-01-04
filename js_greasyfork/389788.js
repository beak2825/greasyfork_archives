// ==UserScript==
// @name 你看的时间太长了
// @namespace You see it too long time.
// @version 0.1.1
// @author 稻米鼠
// @description You see it too long time.
// @run-at document-idle
// @homepage https://meta.appinn.net/t/11501
// @supportURL https://meta.appinn.com/t/11501
// @match *://*/*
// @noframes
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/389788/%E4%BD%A0%E7%9C%8B%E7%9A%84%E6%97%B6%E9%97%B4%E5%A4%AA%E9%95%BF%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/389788/%E4%BD%A0%E7%9C%8B%E7%9A%84%E6%97%B6%E9%97%B4%E5%A4%AA%E9%95%BF%E4%BA%86.meta.js
// ==/UserScript==

// 模式 0：限制总观看时间；模式 1：限制每个网站观看时间
// const youSeeItTooLongTimeMode = 1
// 最大观看时长，单位：分钟
// const howMinutesCanYouWatchIt = 60
/* 以下无需修改 */
const oldLoadFun = window.onload
window.onload = async function(){
  oldLoadFun && oldLoadFun()
  // 获取当前所需时间对象
  const getNow = ()=>{
    const nowUTC = new Date()
    const now = Number((+nowUTC/1000).toFixed()) - nowUTC.getTimezoneOffset()*60
    const day = now - now%86400
    return { now, day }
  }
  // 储存当前数据
  const storeData = async (long)=>{
    await GM_setValue(window.location.hostname, JSON.stringify({
      day: start.day,
      long: long
    }))
  }
  // 获取存储的数据
  const getData = async (key=window.location.hostname)=>{
    if(await GM_getValue(key)){
      try {
        const temp = JSON.parse(await GM_getValue(key))
        // 如果有合理的数据，并且是当天数据
        if(temp.day && temp.day === start.day && temp.long){
          return temp
        }
      } catch (error) {}
    }
    return false
  }
  // 储存配置数据
  const storeConfig = async (mode=1, max=3600)=>{
    const config = {
      mode: isNaN(mode) ? 1 : mode,
      max: isNaN(max) ? 3600 : max
    }
    await GM_setValue('options', JSON.stringify(config))
    return config
  }
  // 获取配置数据
  const getConfig = async ()=>{
    if(await GM_getValue('options')){
      try {
        const temp = JSON.parse(await GM_getValue('options'))
        // 如果有合理的数据，并且是当天数据
        if(!isNaN(temp.mode) && !isNaN(temp.max)){
          return temp
        }
      } catch (error) {
        this.console.log(error)
      }
    }
    return await storeConfig()
  }
  // 修改网页标题
  const changeTitle = title=>{
    document.title = title+document.title.replace(/^【[\d:-]+】/i, '')
  }
  // 两位数字
  const dbNum = num=>{
    return num<10 ? '0'+num : num
  }
  // 窗口是否最小化
  const isMin = ()=>{
    let isWinMin = false;
    if (window.outerWidth != undefined) {
        isWinMin = window.outerWidth <= 160 && window.outerHeight <= 27;
    } else {
        isWinMin = window.screenTop < -30000 && window.screenLeft < -30000;
    }
    return isWinMin;
  }
  // 处理 hash 指令
  const hashCommand = async (hash, options)=>{
    if(/^#clear$/i.test(hash)){
      await storeData( 0 )
      window.location.hash = ''
      return
    }
    if(/^#clearAll$/i.test(hash)){
      const keys = await GM_listValues()
      for (let key of keys) {
        if(key==='options'){ continue }
        GM_deleteValue(key);
      }
      window.location.hash = ''
      return
    }
    if(/^#close$/i.test(hash)){
      await storeData( 1.25*options.max )
      window.location.hash = ''
      return
    }
    if(/^#add\d+$/i.test(hash)){
      let add = +hash.replace(/^#add(\d+)$/, '$1')
      add = isNaN(add) ? 0 : add*60
      const siteData = await getData()
      let historyLong = siteData ? siteData.long : 0
      historyLong = historyLong<add ? 0 : historyLong-add
      await storeData(historyLong)
      window.location.hash = ''
      return
    }
    if(/^#sub\d+$/i.test(hash)){
      let sub = +hash.replace(/^#sub(\d+)$/, '$1')
      sub = isNaN(sub) ? 0 : sub*60
      const siteData = await getData()
      let historyLong = siteData ? siteData.long : 0
      historyLong = historyLong+sub
      await storeData(historyLong)
      window.location.hash = ''
      return
    }
    if(/^#mode\d$/i.test(hash)){
      let mode = +hash.replace(/^#mode(\d)$/, '$1')
      mode = isNaN(mode) ? 1 : (mode===0 ? 0 : 1)
      await storeConfig(mode, options.max)
      window.location.hash = ''
      return
    }
    if(/^#max\d+$/i.test(hash)){
      let max = +hash.replace(/^#max(\d+)$/, '$1')
      if(isNaN(max)){ return }
      max = 60*max
      await storeConfig(options.mode, max)
      window.location.hash = ''
      return
    }
    if(/^#maxadd\d+$/i.test(hash)){
      let add = +hash.replace(/^#maxadd(\d+)$/, '$1')
      if(isNaN(add)){ return }
      const max = options.max + 60*add
      await storeConfig(options.mode, max)
      window.location.hash = ''
      return
    }
    if(/^#maxsub\d+$/i.test(hash)){
      let sub = +hash.replace(/^#maxsub(\d+)$/, '$1')
      if(isNaN(sub)){ return }
      const max = options.max - 60*sub
      await storeConfig(options.mode, max>=0 ? max : 0)
      window.location.hash = ''
      return
    }
  }
  // 时间更新
  const refreshTime = async ()=>{
    const n = getNow()  // 获取当前时间
    // 如果页面在后台或者窗口最小化，仅更新起始对象中的最后更新时间
    if(document.visibilityState !== 'visible' || isMin()){
      start.lastTime = n.now
      return
    }
    // 获取当前配置
    const options = await getConfig()
    // 检测指令
    await hashCommand(window.location.hash, options)
    // 如果是当天
    const siteData = await getData()
    start.historyLong = n.day === start.day
                        ? (siteData ? siteData.long : 0) + n.now - start.lastTime
                        : n.now%86400
    start.day = n.day
    start.lastTime = n.now
    await storeData(start.historyLong)

    let lastTime = options.max
    if(options.mode){
      lastTime = options.max - start.historyLong
    }else{
      const keys = await GM_listValues()
      for (let key of keys) {
        if(key==='options'){ continue }
        const m = await getData(key)
        if(m.day === start.day){
          lastTime -= m.long
        }else{
          m && GM_deleteValue(key);
        }
      }
    }
    if(lastTime < 0){
      const alpha = 1 + 4*lastTime/options.max
      const opacity = ( alpha>1 ? 1 : ( alpha<0 ? 0 : alpha ) ).toFixed(2)
      document.querySelector('body').style.opacity = opacity
      if(document.fullscreenElement){// 如果全屏
        document.fullscreenElement.style.opacity = opacity
      }
      if(alpha<0){
        if(document.fullscreenElement){ document.exitFullscreen() } // 如果全屏则退出
        document.querySelector('html').style.backgroundImage = 'url("https://i.v2ex.co/WJ15n12m.png")'
        document.querySelector('html').style.backgroundPosition = 'center top'
        document.querySelector('html').style.backgroundRepeat = 'no-repeat'
        document.querySelector('html').style.backgroundAttachment = 'fixed'
        window.clearInterval(timer)
      }
    }else{
      document.querySelector('body').style.opacity = 1
    }
    const lastTimeToShow = (lastTime>=0 ? '' : '-')
                          + dbNum( Math.floor( Math.abs(lastTime)/60) )
                          + ':'
                          + dbNum( Math.abs(lastTime)%60 )
    changeTitle('【'+lastTimeToShow+'】')
  }
  // 初始化 启动程序
  const start = getNow()
  const siteData = await getData()
  start.lastTime = start.now
  start.historyLong = siteData ? siteData.long : 0
  await storeData( start.historyLong )

  refreshTime()
  const timer = window.setInterval(refreshTime, 1e3)
}
