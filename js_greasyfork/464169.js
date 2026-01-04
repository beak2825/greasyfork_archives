// ==UserScript==
// @name         BvideoProcessRecord(B站播放进度记录)
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @license      GPL V3.0
// @description  自行定义并记录b站视频的播放状态：第几p以及播放进度，并进行自动跳转，解决b站经常出现播放进度丢失的问题（这个真的很烦人!!!），如果安装后没有跳转，可以把wait_time变量的值调改成更大的数值，原因是你的网络延迟较高，b站资源没加载出来。最后，Make bilibili great again!!!
// @author       Tnxts
// @match        *://*.bilibili.com/video/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/464169/BvideoProcessRecord%28B%E7%AB%99%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6%E8%AE%B0%E5%BD%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/464169/BvideoProcessRecord%28B%E7%AB%99%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6%E8%AE%B0%E5%BD%95%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let wait_time = 2000;
  let first_time = 1500;
  let record_time = 500;
  let p_change_time = 200

  update()

  setTimeout(() => {
    let manifest = player.getManifest();
    let bvid = manifest.bvid;
    let info = GM_getValue("tnxts_" + bvid, "wobudaoa");
    /* 读不到记录就新增，读的到就自动跳转 */
    if (info == "wobudaoa") {
      let p =  manifest.p
      let process =  player.getCurrentTime()
      let obj = new Map([])
      obj.set('cp',p)
      obj.set(p,process)
      GM_setValue("tnxts_" + bvid, JSON.stringify(obj));

      record()
      
    } else {
      info = new Map(JSON.parse(info))

      let cp = info.get('cp');
      let process = info.get(cp);
      player.goto(cp, -1, -1);
      setTimeout(() => {
        process = parseInt(process);
        player.seek(process);

        record()
      }, first_time);
    }

  }, wait_time);

  /**
   * 定时记录进度
   */
  function record(){
    setInterval(() => {
      let manifest = player.getManifest();
      let bvid = manifest.bvid;
      let p = manifest.p;
      let process = player.getCurrentTime();
  
      let info = GM_getValue("tnxts_" + bvid, "wobudaoa");
      info = new Map(JSON.parse(info))

      /* 监控是否换p */
      if(info.get('cp') != p && info.has(p))
      {
        let process = info.get(p)
        info.set('cp',p)
        GM_setValue("tnxts_" + bvid, JSON.stringify(info));

        setTimeout(()=>{
          player.seek(parseInt(process))
        },p_change_time)
      }

      info.set('cp',p)
      info.set(p,process)
  
      GM_setValue("tnxts_" + bvid, JSON.stringify(info));
    }, record_time);
  }


  /**
   * 更新数据格式
   */
  function update(){
    let manifest = player.getManifest();
    let bvid = manifest.bvid;
    let info = GM_getValue("tnxts_" + bvid, "wobudaoa");

    if (info != "wobudaoa") {

      if(info == "{}")
      {
        let obj = [['cp',manifest.p],[manifest.p,player.getCurrentTime()]]

        GM_setValue("tnxts_" + bvid, JSON.stringify(obj));
        
        info = JSON.stringify(obj)

      }
      info = new Map(JSON.parse(info))
      if(!info.has('cp')){
        let obj = [['cp',info.p],[info.p,info.process]]

        GM_setValue("tnxts_" + bvid, JSON.stringify(obj));

        player.goto(info.p, -1, -1);
        setTimeout(() => {
          player.seek(parseInt(info.process));
        }, 200);
      }
      
    }
  }
})();