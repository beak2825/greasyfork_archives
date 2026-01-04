// ==UserScript==
// @name         抖音自觉过滤助手
// @namespace    https://gitee.com/yc556/dy-oil-monkey-filter-video
// @version      2024-08-04
// @description  过滤广告、直播、超4分钟的视频【注意：最前面的几个视频无法过滤，因为是直接附属在html页面上。
// @author       仰晨
// @match        *://*.douyin.com/*
// @icon         https://7.z.wiki/autoupload/20240504/t0lK.1006X1006-Snipaste_2024-05-04_21-14-39.png
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/494071/%E6%8A%96%E9%9F%B3%E8%87%AA%E8%A7%89%E8%BF%87%E6%BB%A4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/494071/%E6%8A%96%E9%9F%B3%E8%87%AA%E8%A7%89%E8%BF%87%E6%BB%A4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log('████抖音自觉助手成功启动█████');
  window.videos = {}                        // 初始化一个装视频url的东东：｛描述：视频URL，。。。｝
  window.ikunCount = 0;                     // 初始化计数器（秒）
  window.index = 1;                         // 记录在视频简介上加上，这样就真的刷了几个，然后也更好读取了
  window.liaoTianIndex = 1;                 // 【聊天】记录在视频简介上加上，这样就真的刷了几个，然后也更好读取了
  window.xihuanIndex = 1;                   // 【喜欢】记录在视频简介上加上，这样就真的刷了几个，然后也更好读取了
  window.videoSpareList = [];               // 视频备用列表
  const MAX_SECOND = 300 * 1000; //(5分钟)            // 定义“最长”的刷视频时间(毫秒)
  const ADD_SECOND = 120 * 1000; //(2分钟)            // 定义加长的刷视频时间(毫秒)
  const SSP_V1URI= 'aweme/v1/web/tab/feed';           // 刷视频列表=星愿浏览器是这样
  const SSP_V2URI= 'aweme/v2/web/feed'                // 刷视频列表=最新的谷歌是这个
  const SS_URI= 'aweme/v1/web/general/search/single'  // 搜索视频列表
  const LT_URI= 'aweme/v1/web/multi/aweme/detail'     // 聊天视频列表
  const XH_URI= 'aweme/v1/web/aweme/favorite'         // 喜欢视频列表

  function 处理刷视频列表 (xhr) {
    let respJson = JSON.parse(xhr.response)
    let durationCount = 0;                 // 最大的播放时间（毫秒）
    // let addIndex = 0;                      // 添加到备用列表 到2就好了
    const accordWithVideoList = []
    // 遍历拿到的视频列表 进行处理
    for (let i = 0; i < respJson.aweme_list.length; i++) {
      const item = respJson.aweme_list[i]
      const isVideo = item.video                          // 是否视频
      const haveTag = item.video_tag                      // 视频标签 有标签才是正常视频
      const noOutTime = isVideo?.duration < 1000 * 60 * 4                   // 视频不超4分钟
      const noAvatarLarger = !item.author?.avatar_larger  // 正常视频没有这个属性

      if (isVideo && haveTag && noOutTime && noAvatarLarger) {
        item.desc += ` ——》》》${window.index}`                                                            // 在描述上加上标记
        window.videos[window.index] = [item.video.play_addr.url_list[0], item.desc]     // 保存到win好读取
        window.index++
        console.log('███████window.ikunCount>>>>', window.ikunCount,'<<<<██████')
        console.log('███████durationCount>>>>', durationCount,'<<<<██████')
        console.log('███████window.ikunCount * 1000 + durationCount <= MAX_SECOND>>>>', window.ikunCount * 1000 + durationCount <= MAX_SECOND,'<<<<██████')
        console.log('█████████████████████████████████████████████████████████████████████████████████████████████████')
        if(window.ikunCount * 1000 + durationCount <= MAX_SECOND) {
          accordWithVideoList.push(item)
          durationCount += isVideo?.duration ?? 0             // 加入播放列表
        // } else if (((isVideo?.duration || 0) <= ADD_SECOND) && (addIndex < 2)) {
        } else if ((isVideo?.duration || 0) <= ADD_SECOND) {
          window.videoSpareList.push(item)
          // addIndex++
        }
      }
    }
    刷新可下载视频列表()
    respJson.aweme_list = accordWithVideoList  // 替换 过滤后的视频列表
    console.log('██████处理后的刷视频列表>', respJson);
    return respJson;
  }

  function 处理搜索视频列表(xhr) {
    let respJson = JSON.parse(xhr.response)
    // 遍历拿到的视频列表 进行描述添加标记，然后保存到win好读取
    for (let i = 0; i < respJson.data.length; i++) {
      respJson.data[i].aweme_info.desc += ` ——》》》${window.index}`
      // 记录url和描述
      window.videos[window.index] = [respJson.data[i]?.aweme_info?.video?.play_addr?.url_list?.[2], respJson.data[i]?.aweme_info?.desc]
      window.index++
    }
    刷新可下载视频列表()
    console.log('██████处理后的搜索视频列表>', respJson);
    return respJson;
  }

  function 处理聊天视频列表(xhr) {
    let respJson = JSON.parse(xhr.response)
    // 遍历拿到的视频列表 进行描述添加标记，然后保存到win好读取
    for (let i = 0; i < respJson.aweme_details.length; i++) {
      respJson.aweme_details[i].desc += ` ——》》》LT${window.liaoTianIndex}`
      window.videos['LT' + window.liaoTianIndex] = [respJson.aweme_details[i]?.video?.play_addr?.url_list?.[0], respJson.aweme_details[i].desc]
      window.liaoTianIndex++
    }
    刷新可下载视频列表()
    console.log('██████处理后的聊天视频列表>', respJson);
    return respJson;
  }

  function 处理喜欢视频列表(xhr) {
    let respJson = JSON.parse(xhr.response)
    // 遍历拿到的视频列表 进行描述添加标记，然后保存到win好读取
    for (let i = 0; i < respJson.aweme_list.length; i++) {
      respJson.aweme_list[i].desc += ` ——》》》XH${window.xihuanIndex}`
      window.videos['XH' + window.xihuanIndex] = [respJson.aweme_list[i]?.video?.play_addr?.url_list?.[0], respJson.aweme_list[i].desc]
      window.xihuanIndex++
    }
    刷新可下载视频列表()
    console.log('██████处理后的聊天视频列表>', respJson);
    return respJson;
  }

  // ————————————————————————⭐⭐⭐拦截请求修改响应数据⭐⭐⭐————————————————————————————————
  function setupHook(xhr) {
    function getter() {
      delete xhr.responseText;  // 不delete将造成递归
      let res = xhr.responseText;
      // 是视频列表获取请求
      if (xhr.responseURL.includes(SSP_V1URI,23) || xhr.responseURL.includes(SSP_V2URI,23)) {
        if (window.videoSpareList.length === 0) res = JSON.stringify(处理刷视频列表(xhr))
        if (window.videoSpareList.length === 1) res = JSON.stringify(window.videoSpareList.shift())
        if (window.videoSpareList.length === 2) {
          res = JSON.stringify(window.videoSpareList)
          window.videoSpareList = []
        }
        if (window.videoSpareList.length > 2) {
          res = JSON.stringify(window.videoSpareList.slice(0, 2))
          window.videoSpareList = window.videoSpareList.slice(2)
        }
      }
      if (xhr.responseURL.includes(SS_URI,23))
        res = JSON.stringify(处理搜索视频列表(xhr))
      if (xhr.responseURL.includes(LT_URI,23))
        res = JSON.stringify(处理聊天视频列表(xhr))
      if (xhr.responseURL.includes(XH_URI,23))
        res = JSON.stringify(处理喜欢视频列表(xhr))

      setup();
      return res;
    }

    function setter(str) {
      console.log('set response: %s', str);
    }

    function setup() {
      Object.defineProperty(xhr, 'responseText', {
        get: getter,
        set: setter,
        configurable: true
      });
    }

    setup();
  }


  // ⭐——————————————捕捉请求——————————————⭐
  const oldOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    if ((url.includes(SSP_V1URI) || url.includes(SSP_V2URI))) console.log('█████##>>>看了：', window.ikunCount)
    if (window.ikunCount > 300 && (url.includes(SSP_V1URI) || url.includes(SSP_V2URI))) return console.log('█████##>>>>够钟,没得看了<<<<##████')

    if (!this._hooked) {
      this._hooked = true;
      setupHook(this);
    }

    oldOpen.apply(this, arguments);
  }


  /**
   * 刷视频界面计时器
   *
   * @author Yc
   * @since 2024/5/4 20:55
   */
  setInterval(()=>{
    if (document.visibilityState === 'visible') window.ikunCount++;
  }, 1000);

  /**
   * 创建下载按钮
   *
   * @author Yc
   * @since 2024/7/28 18:32
   */
  (function () {
    const downloadButton = document.createElement('div');
    downloadButton.style.position = 'fixed';
    downloadButton.style.bottom = '1px';
    downloadButton.style.right = '1px';
    downloadButton.style.backgroundColor = 'green';
    downloadButton.style.borderRadius = '50%';
    downloadButton.style.width = '20px';
    downloadButton.style.height = '20px';
    downloadButton.style.zIndex = '9999';
    downloadButton.style.opacity = '0.5';
    downloadButton.style.textAlign = 'center';
    downloadButton.innerText = '↓';
    downloadButton.addEventListener('mouseover', () => window.downloadList.style.display = 'block')

    window.downloadList = document.createElement('div');
    window.downloadList.style.display = 'none';
    window.downloadList.style.position = 'fixed';
    window.downloadList.style.top = '0px';
    window.downloadList.style.right = '0px';
    window.downloadList.style.backgroundColor = 'white';
    window.downloadList.style.width = '10vw';
    window.downloadList.style.height = '100vh';
    window.downloadList.style.zIndex = '9999';
    window.downloadList.style.opacity = '0.8';
    window.downloadList.style.overflow = 'auto'; // 启用滚动条
    window.downloadList.style.transform = 'translateZ(0)'; // 确保 div 完全独立于页面的其他部分
    window.downloadList.innerHTML = '<h2>可下载视频列表</h2>';
    // 事件监听器 不这样移到他的子元素时也会马上被隐藏
    let isInDiv = false;
    window.downloadList.addEventListener('mouseover', () => isInDiv = true);
    window.downloadList.addEventListener('mouseout', () => {
      isInDiv = false;
      setTimeout(() => {
        if (!isInDiv) window.downloadList.style.display = 'none';
      }, 100); // 延迟一段时间来确保鼠标确实离开了 div
    });

    const rootElement = document.querySelector('body');
    rootElement.appendChild(downloadButton);
    rootElement.appendChild(window.downloadList);
  })()

  function 刷新可下载视频列表() {
    let 列表内容 = '<h2>-可下载视频列表-</h2>';
    Reflect.ownKeys(window.videos).forEach(key => {
      列表内容 += `
<li style="border: 1px solid #8dbaec; border-radius: 15px; padding-left: 5px; margin: 5px;" title="${window.videos[key][1]}">
  <a href="${window.videos[key][0]}" target="_blank">可下视频${key}</a>
</li>`;});
    window.downloadList.innerHTML = 列表内容;
  }
})();