// ==UserScript==
// @name         Jable一键下载收藏 (支持MissAV)
// @namespace    https://greasyfork.org/zh-CN/scripts/474848-jable%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E6%94%B6%E8%97%8F
// @version      2.2.1
// @description  Jable和MissAV一键下载视频，并自动点击收藏（MissAV自动选择最高清晰度，全局收藏列表，自动迁移旧数据，跨站收藏同步）
// @author       Pandex
// @match        *://jable.tv/*
// @match        *://fs1.app/*
// @match        *://missav.ws/*
// @match        *://missav.live/*
// @match        *://missav.ai/*
// @match        *://missav123.com/*
// @connect      jable.tv
// @connect      fs1.app
// @connect      missav.ws
// @connect      missav.live
// @connect      missav.ai
// @connect      missav123.com
// @connect      surrit.com
// @icon         https://assets-cdn.jable.tv/assets/icon/favicon-32x32.png
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_removeValueChangeListener
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MPL
// @downloadURL https://update.greasyfork.org/scripts/474848/Jable%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E6%94%B6%E8%97%8F%20%28%E6%94%AF%E6%8C%81MissAV%29.user.js
// @updateURL https://update.greasyfork.org/scripts/474848/Jable%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E6%94%B6%E8%97%8F%20%28%E6%94%AF%E6%8C%81MissAV%29.meta.js
// ==/UserScript==
 
(function () {
  // GM Storage Keys - 统一管理所有存储键名
  const GM_KEYS = {
    MENU_PROXY_STATUS: "menu_proxy_status",
    MENU_NAME_FOLDER_STATUS: "menu_name_folder_status",
    MENU_SAVE_FILE_DIRECTORY: "menu_save_file_directory",
    GLOBAL_LIKED_CODES: "global_liked_codes",
    ARTIST_CN_NAME_MAP: "artist_CN_name_map",
    GLOBAL_FAVORITES_INITIALIZED: "global_favorites_initialized_status",
    CODE_MAPPING: "cross_site_code_mapping",  // 跨站代码映射
    SYNC_ENABLED: "cross_site_sync_enabled"   // 是否启用跨站同步
  };

  const defaultSaveFileDirectory = "D:\\videos\\jav";

  var liked_codes = [];
  var artistCNNameMap = {};
  var codeMappingCache = {};  // 代码映射缓存
  var syncInProgress = false;  // 同步进行中标志，防止循环触发

  var destinationMenu, proxyMenu, nameFolderMenu, feedbackMenu, exportMenu, importMenu
  registMenus()

  var downloadParams = '--maxThreads "48" --minThreads "16" --retryCount "100" --timeOut "100" --enableDelAfterDone';
  var proxyParam = ' --noProxy'

  function clickProxyMenu() {
    GM_setValue(GM_KEYS.MENU_PROXY_STATUS, !getProxyMenuStatus())
    registMenus();
  }
  function getProxyMenuStatus() {
    return GM_getValue(GM_KEYS.MENU_PROXY_STATUS) ? true : false
  }
  function proxyMenuText() {
    return getProxyMenuStatus() ? "使用系统代理下载✅" : "使用系统代理下载❌"
  }

  function clickNameFolderMenu() {
    GM_setValue(GM_KEYS.MENU_NAME_FOLDER_STATUS, !getNameFolderMenuStatus())
    registMenus()
  }
  function openFeedBack() {
    window.open("https://greasyfork.org/zh-CN/scripts/474848-jable%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E6%94%B6%E8%97%8F/feedback", "_blank");
  }

  function exportFavoritesList() {
    // 获取已收藏的视频codes
    let codes = GM_getValue(GM_KEYS.GLOBAL_LIKED_CODES) || [];
    
    if (codes.length === 0) {
      alert("没有收藏的视频可以导出！");
      return;
    }
    
    // 构建JSON格式数据
    let exportData = {
      version: "1.0",
      exportTime: new Date().toISOString(),
      count: codes.length,
      favorites: codes.map(code => ({
        code: code
      }))
    };
    
    // 创建JSON字符串
    let content = JSON.stringify(exportData, null, 2);
    
    // 创建Blob并下载
    let blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'favorites_' + new Date().toISOString().slice(0,10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("已成功导出 " + codes.length + " 个收藏视频到 JSON 文件！");
  }

  function importFavoritesList() {
    // 创建文件选择器
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    
    input.onchange = function(event) {
      let file = event.target.files[0];
      if (!file) {
        return;
      }
      
      let reader = new FileReader();
      reader.onload = function(e) {
        try {
          // 解析JSON
          let importData = JSON.parse(e.target.result);
          
          // 验证数据格式
          if (!importData.favorites || !Array.isArray(importData.favorites)) {
            alert("导入文件格式错误：缺少 favorites 字段或格式不正确！");
            return;
          }
          
          // 提取导入的codes
          let importedCodes = importData.favorites.map(item => item.code).filter(code => code);
          
          if (importedCodes.length === 0) {
            alert("导入文件中没有有效的收藏数据！");
            return;
          }
          
          // 获取当前已有的收藏
          let currentCodes = GM_getValue(GM_KEYS.GLOBAL_LIKED_CODES) || [];
          let originalCount = currentCodes.length;
          
          // 合并并去重
          let mergedCodes = [...currentCodes];
          let addedCount = 0;
          
          importedCodes.forEach(code => {
            if (mergedCodes.indexOf(code) === -1) {
              mergedCodes.push(code);
              addedCount++;
            }
          });
          
          // 保存合并后的数据
          GM_setValue(GM_KEYS.GLOBAL_LIKED_CODES, mergedCodes);
          liked_codes = mergedCodes;
          
          // 更新页面显示
          updateBoxCardCSS(true);
          
          // 显示导入结果
          alert(
            "导入完成！\n" +
            "原有收藏: " + originalCount + " 个\n" +
            "导入文件: " + importedCodes.length + " 个\n" +
            "新增收藏: " + addedCount + " 个\n" +
            "合并后总计: " + mergedCodes.length + " 个"
          );
          
        } catch (error) {
          console.error('导入错误:', error);
          alert("导入失败：文件格式错误或内容无效！\n错误详情: " + error.message);
        }
      };
      
      reader.onerror = function() {
        alert("文件读取失败！");
      };
      
      reader.readAsText(file);
    };
    
    // 触发文件选择
    input.click();
  }

  function getNameFolderMenuStatus() {
    return GM_getValue(GM_KEYS.MENU_NAME_FOLDER_STATUS) ? true : false
  }
  function nameFolderMenuText() {
    return getNameFolderMenuStatus() ? "下载到艺术家名文件夹✅" : "下载到艺术家名文件夹❌"
  }

  GM_addValueChangeListener(GM_KEYS.MENU_SAVE_FILE_DIRECTORY, (name, old_value, new_value, remote) => {
    if (remote) { registMenus() }
  });
  GM_addValueChangeListener(GM_KEYS.MENU_PROXY_STATUS, (name, old_value, new_value, remote) => {
    if (remote) { registMenus() }
  });
  GM_addValueChangeListener(GM_KEYS.MENU_NAME_FOLDER_STATUS, (name, old_value, new_value, remote) => {
    if (remote) { registMenus() }
  });

  function clickDestinationMenu() {
    let destination = prompt("请输入下载地址", getSaveFileDirectory());
    if (destination) {
      GM_setValue(GM_KEYS.MENU_SAVE_FILE_DIRECTORY, destination);
      registMenus();
    }
  }
  function getSaveFileDirectory() {
    return GM_getValue(GM_KEYS.MENU_SAVE_FILE_DIRECTORY) || defaultSaveFileDirectory;
  }
  function registMenus() {
    if (destinationMenu) {
      GM_unregisterMenuCommand(destinationMenu);
    }
    destinationMenu = GM_registerMenuCommand(destinationMenuText(), clickDestinationMenu);

    if (proxyMenu) {
      GM_unregisterMenuCommand(proxyMenu);
    }
    proxyMenu = GM_registerMenuCommand(proxyMenuText(), clickProxyMenu);

    if(nameFolderMenu) {
      GM_unregisterMenuCommand(nameFolderMenu);
    }
    nameFolderMenu = GM_registerMenuCommand(nameFolderMenuText(), clickNameFolderMenu);

    if (feedbackMenu) {
      GM_unregisterMenuCommand(feedbackMenu);
    }
    feedbackMenu = GM_registerMenuCommand("给个好评", openFeedBack);

    if (exportMenu) {
      GM_unregisterMenuCommand(exportMenu);
    }
    exportMenu = GM_registerMenuCommand("导出已收藏列表", exportFavoritesList);

    if (importMenu) {
      GM_unregisterMenuCommand(importMenu);
    }
    importMenu = GM_registerMenuCommand("导入收藏列表", importFavoritesList);
  }
  function destinationMenuText() {
    return `下载地址:"${getRealSaveFileDirectory(['{艺术家名字}'])}"`
  }
  function getRealSaveFileDirectory(modelNames) {
    let dir = getSaveFileDirectory()
    if (!dir.match(/[\s\S]*\\$/)) {
      dir = dir + '\\'
    }
    if (getNameFolderMenuStatus()) {
      if (modelNames && modelNames.length > 0) {
        if (modelNames.length == 1) {
          let artistName = modelNames[0]
          let artistCNName = getArtistCNName(artistName)
          if (artistCNName) {
            artistName = artistCNName
          }
          dir = dir + artistName + '\\'
        } else {
          dir = dir + '群星' + '\\'
        }
      } else {
        dir = dir + '未知艺术家' + '\\'
      }
    }
    // console.log('getRealSaveFileDirectory', modelNames, dir)
    return dir
  }

  var _a, _b, _c, _d;
  ("use strict");
 
  // 站点检测
  function getCurrentSite() {
    if (location.host.match(/jable\.tv|fs1\.app/)) {
      return 'jable';
    } else if (location.host.match(/missav\.(ws|live|ai)|missav123\.com/)) {
      return 'missav';
    }
    return null;
  }

  var currentSite = getCurrentSite();
  var linkPrefix = currentSite === 'jable' ? `https://${location.host}/videos/` : `https://${location.host}/`;
 
  var r = (_a = Reflect.get(document, "__monkeyWindow")) != null ? _a : window;
  r.GM;
  r.unsafeWindow = (_b = r.unsafeWindow) != null ? _b : window;
  r.unsafeWindow;
  r.GM_info;
  r.GM_cookie;
 
  var addStyle = (...e) => r.GM_addStyle(...e),
      xmlhttpRequest = (...e) => r.GM_xmlhttpRequest(...e);
 
  const jableStyle = `
    #site-content > div.container {
        max-width: 2000px !important;
    }
    .video-img-box .title {
        white-space: normal;
    }
    .video-img-box.liked .title a::before {
        content: '❤️ ';
    }
    .absolute-bottom-left.download {
      left: 60px;
    }
    .absolute-bottom-left.download .action {
      background: rgba(255,255,255,.18);
      opacity: 0;
    }
    .absolute-bottom-left.download .action.loading {
      cursor: wait;
    }
    .video-img-box:hover .absolute-bottom-left.download .action {
      opacity: 1;
    }
    .video-img-box.hasurl .absolute-bottom-left.download .action {
      background: rgba(98,91,255,.4);
    }
    .video-img-box.hasurl .absolute-bottom-left.download .action:hover {
      background: rgba(98,91,255,.8);
    }
 
    .video-img-box .detail .sub-title.added-avatar .models {
      display: -webkit-inline-box;
      display: -ms-inline-flexbox;
      display: inline-flex;
      margin-left: 10px;
    }
    .video-img-box .detail .sub-title.added-avatar .models .model {
      width: 1.5rem;
      height: 1.5rem;
    }
    .video-img-box .detail .sub-title.added-avatar .models .placeholder {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      background: #687ae8;
      color: #fff;
      font-size: .8125rem;
      width: 100%;
      height: 100%;
      -webkit-box-shadow: 2px 2px 16px 0 rgba(17,18,20,.8);
      box-shadow: 2px 2px 16px 0 rgba(17,18,20,.8);
    }
    .video-img-box.hot-1 .title a::after {
        content: ' 🔥';
    }
    .video-img-box.hot-2 .title a::after {
        content: ' 🔥🔥';
    }
    .video-img-box.hot-3 .title a::after {
        content: ' 🔥🔥🔥';
    }
    
    .video-img-box.hot-1 .title {
        color: #f9c8f1;
    }
    .video-img-box.hot-2 .title {
        color: hotpink;
    }
    .video-img-box.hot-3 .title {
        color: #ff367f;
    }
    .video-img-box.liked .hover-state {
        opacity: 1;
    }
 
    .btn-action.fav svg {
        color: gray !important;
    }
    .btn-action.fav.active svg {
        color: white !important;
    }
    `;
 
  const paths = {
    jable: {
      video_like_btn: "#site-content > div > div > div:nth-child(1) > section.video-info.pb-3 > div.text-center > div > button.btn.btn-action.fav.mr-2",
      video_title_path: "#site-content > div > div > div:nth-child(1) > section.video-info.pb-3 > div.info-header > div.header-left > h4",
      video_avatar_path: "#site-content > div > div > div:nth-child(1) > section.video-info.pb-3 > div.info-header > div.header-left > h6 > div.models",
      model_title_name: "#site-content > section > div > div > div > h2"
    },
    missav: {
      video_title_path: "body > div:nth-child(3) > div.mx-auto.px-4.content-without-search.pb-12 > div > div.flex-1.order-first > div.mt-4 > h1",
      video_like_btn: "body > div:nth-child(3) > div.mx-auto.px-4.content-without-search.pb-12 > div > div.flex-1.order-first > div.mt-4 > div > button.inline-flex.items-center.whitespace-nowrap.text-sm.leading-4.font-medium",
      video_avatar_path: "div.text-secondary",
      model_title_name: null // MissAV暂不支持演员页面标题
    }
  };

  function getPath(key) {
    return currentSite ? paths[currentSite][key] : null;
  }
 
  function isVideoURL(url) {
    if (currentSite === 'jable') {
      return !!url.match(/https:\/\/(jable\.tv|fs1\.app)\/videos\/*\/*/); 
    } else if (currentSite === 'missav') {
      // MissAV通过页面元素判断：能获取到标题和M3U8就是视频页
      const titleEl = document.querySelector(getPath('video_title_path'));
      // console.log('titleEl', titleEl, getPath('video_title_path'));
      return !!titleEl;
    }
    return false;
  }
 
  function isModelURL(url) {
    if (currentSite === 'jable') {
      return (
        !!url.match(/https:\/\/(jable\.tv|fs1\.app)\/models\/*\/*/) ||
        !!url.match(/https:\/\/(jable\.tv|fs1\.app)\/s1\/models\/*\/*/) 
      );
    } else if (currentSite === 'missav') {
      return !!url.match(/https:\/\/(missav\.(ws|live|ai)|missav123\.com)\/.*\/actresses\/.*/);
    }
    return false;
  }
 
  function isHotURL(url) {
    return !!url.match(/https:\/\/(jable\.tv|fs1\.app)\/hot\/*\/*/);
  }
 
  /**
   * 检查MissAV视频是否为无码视频
   */
  function isUncensoredVideo(url) {
    if (currentSite !== 'missav') {
      return false;
    }
    // 检查URL是否包含 uncensored 相关标识
    return !!url.match(/-(uncensored-leak|uncensored)$/i);
  }

  /**
   * 从URL提取视频代码（保留原始格式）
   */
  function getCodeFromUrl(url) {
    if (currentSite === 'jable') {
      let code = url.replace(linkPrefix, "").replace(/\/[\s\S]*$/, "");
      return code;
    } else if (currentSite === 'missav') {
      // MissAV URL格式: https://missav.ws/cn/mimk-217-uncensored-leak 或 https://missav.ws/dm14/cn/waaa-323-uncensored-leak
      // 提取最后一段并去除版本后缀（-uncensored-leak, -leak, -uncensored等）
      const match = url.match(/\/([^\/]+)$/);
      if (match && match[1]) {
        let code = match[1];
        // 去除常见的版本后缀
        code = code.replace(/-(uncensored-leak|leak|uncensored|chinese-subtitle|ch-sub)$/i, '');
        return code;
      }
      return "";
    }
    return "";
  }

  /**
   * 标准化视频代码用于跨站匹配
   * 将不同站点的代码统一为小写格式，方便匹配同一视频
   */
  function normalizeCode(code) {
    if (!code) return '';
    // 转小写，去除常见后缀
    let normalized = code.toLowerCase()
      .replace(/-(uncensored-leak|leak|uncensored|chinese-subtitle|ch-sub)$/i, '')
      .trim();
    return normalized;
  }

  /**
   * 保存代码映射关系
   * @param {string} jableCode - Jable站点的代码
   * @param {string} missavCode - MissAV站点的代码
   */
  function saveCodeMapping(jableCode, missavCode) {
    if (!jableCode && !missavCode) return;
    
    let normalized = normalizeCode(jableCode || missavCode);
    let mapping = GM_getValue(GM_KEYS.CODE_MAPPING) || {};
    
    if (!mapping[normalized]) {
      mapping[normalized] = {};
    }
    
    if (jableCode) mapping[normalized].jable = jableCode;
    if (missavCode) mapping[normalized].missav = missavCode;
    mapping[normalized].normalized = normalized;
    
    GM_setValue(GM_KEYS.CODE_MAPPING, mapping);
    codeMappingCache = mapping;
    // console.log('[代码映射] 保存映射:', normalized, mapping[normalized]);
  }

  /**
   * 获取代码映射
   */
  function getCodeMapping(code) {
    let normalized = normalizeCode(code);
    if (Object.keys(codeMappingCache).length === 0) {
      codeMappingCache = GM_getValue(GM_KEYS.CODE_MAPPING) || {};
    }
    return codeMappingCache[normalized];
  }
 
  var isVideoPage = isVideoURL(location.href);
  var isModelPage = isModelURL(location.href);
  var isHotPage = isHotURL(location.href);
 
  var modelPageName = null

  if (isModelPage) {
    const res = artistPageParseFromDoc(document)
    modelPageName = res.modelPageName
  }
  function artistPageParser(responseText) {
    const doc = new DOMParser().parseFromString(responseText, "text/html");
    let result = artistPageParseFromDoc(doc)
    return result
  }

  function artistPageParseFromDoc(doc) {
    let result = {
      modelPageName: null,
      modelPageChineseName: null
    }
    
    // MissAV 暂不支持演员页面解析
    if (currentSite === 'missav') {
      return result;
    }
    
    let name = doc.querySelector(getPath('model_title_name'))
    if (name && name.innerText) {
      result.modelPageName = name.innerText
    }
    let kwdMeta = doc.querySelector('head meta[name="keywords"]')
    if (kwdMeta) {
      let content = kwdMeta.getAttribute('content')
      if (content) {
        let titleSplitDict = {}
        let kwdDict = {}
        let keywords = content.split(',').map(a => {return a.trim()})
        let titles = doc.querySelectorAll(".video-img-box .detail .title a");
        titles.forEach(title => {
          keywords.forEach(kwd => {
            if (title.innerText && title.innerText.indexOf(kwd) > 0) {
              if (kwdDict.hasOwnProperty(kwd)) {
                kwdDict[kwd] = kwdDict[kwd] + 1
              } else {
                kwdDict[kwd] = 1
              }
            }
          })
          if (title.innerText) {
            let splt = title.innerText.split(' ')
            if (splt && splt.length > 1) {
              let lastWord = splt[splt.length - 1]
              if (titleSplitDict.hasOwnProperty(lastWord)) {
                titleSplitDict[lastWord] = titleSplitDict[lastWord] + 1
              } else {
                titleSplitDict[lastWord] = 1
              }
            }
          }
        })

        function getMaxTimesKVFromDict(dict) {
          let maxKey = null
          let maxTimes = null
          for (const key in dict) {
            if (Object.hasOwnProperty.call(dict, key)) {
              const times = dict[key];
              if (!maxTimes || times > maxTimes) {
                maxTimes = times
                maxKey = key
              }
            }
          }
          return {maxKey, maxTimes}
        }
        function getStringSameNum(str1, str2){
          let a = str1.split('');
          let b = str2.split('');
          let len = 0;
          let maxlength = a.length > b.length ? a : b;
          let minlength = a.length < b.length ? a : b;
          for(let i =0; i < minlength.length; ){
            let isdelete = false;
            for(let j = 0; j < maxlength.length; ){
              if(minlength[i] == maxlength[j]){
                len++;
                maxlength.splice(j, 1)
                isdelete = true;
                break;
              }else{
                j++;
              }
            }
            if(isdelete){
              minlength.splice(i,1)
            }else{
              i++;
            }
          }
          return len;
        }

        let timesRes = getMaxTimesKVFromDict(kwdDict)
        if (!timesRes.maxKey) {
          let spltRes = getMaxTimesKVFromDict(titleSplitDict)
          if (spltRes.maxTimes && spltRes.maxTimes >= 3) {
            // 起码出现3次重复才能判断为姓名
            timesRes = spltRes
          } else if (spltRes.maxKey && getStringSameNum(spltRes.maxKey, result.modelPageName) >= 2) {
            // 中文和日文至少有两个字相同
            timesRes = spltRes
          }
        }
        if (timesRes.maxKey) {
          result.modelPageChineseName = timesRes.maxKey
          saveArtistCNName(result.modelPageName, result.modelPageChineseName)
        }
      }
    }
    // console.log('artistPageParseFromDoc', result)
    return result
  }

  function saveArtistCNName(name, cnName) {
    if (!artistCNNameMap.hasOwnProperty(name) || !artistCNNameMap[name]) {
      artistCNNameMap[name] = cnName
      GM_setValue(GM_KEYS.ARTIST_CN_NAME_MAP, artistCNNameMap)
    }
  }
  function getArtistCNName(name) {
    // console.log('getArtistCNName', name, artistCNNameMap)
    if (artistCNNameMap[name]) {
      return artistCNNameMap[name]
    } else {
      if (Object.keys(artistCNNameMap).length == 0) {
        artistCNNameMap = GM_getValue(GM_KEYS.ARTIST_CN_NAME_MAP) || {}
      }
      return artistCNNameMap[name] || null
    }
  }

  GM_addValueChangeListener(GM_KEYS.ARTIST_CN_NAME_MAP, (name, old_value, new_value, remote) => {
    if (remote) { 
      artistCNNameMap = new_value || {}
      // console.log('artist_CN_name_map-Change', new_value)
    }
  });

  async function requestArtistPage(siteUrl) {
    let result = {
      modelPageName: null,
      modelPageChineseName: null
    }
    const xhrPromise = new Promise((resolve) => {
      xmlhttpRequest({
        method: "GET",
        url: siteUrl,
        onload: (response) => {
          if (response.status === 404) {
          } else {
            result = artistPageParser(response.responseText);
          }
          resolve(result)
        },
        onerror: (error) => {
          // console.log("xhr-error", error);
          resolve(result);
        },
      });
    });
    return xhrPromise;
  }

  var logined = false;
  var userName = null;
  
  // 根据站点检测登录状态
  if (currentSite === 'jable') {
    var userNameEl = document.querySelector(".d-lg-block");
    if (userNameEl && userNameEl.innerText != "登入") {
      logined = true;
      userName = userNameEl.innerText;
    }
  } else if (currentSite === 'missav') {
    // MissAV 默认设为已登录状态
    // 点击收藏按钮时，如果未登录会自动弹出登录窗口
    logined = true;
    userName = 'MissAV User';
  }
 
  const Base64 = {
    encode(str) {
      return btoa(
        encodeURIComponent(str).replace(
          /%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode("0x" + p1);
          }
        )
      );
    },
    decode(str) {
      // Going backwards: from bytestream, to percent-encoding, to original string.
      return decodeURIComponent(
        atob(str)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    },
  };
  // console.log('saveFileDirectory:', getRealSaveFileDirectory(), downloadParams, getProxyMenuStatus() ? '' : proxyParam)
  function getDownloadSchemeFromHlsUrl(url, title, models) {
    var title = title
    var models = models.map(model => {
      return model.name
    })
    if (isModelPage) {
      if (models && models.length > 1) {
        // 如果是在艺术家页面并且该电影包含多个演员，则直接下载到该艺术家的文件夹下
        models = [modelPageName]
      }
    }
    
    // 处理MissAV无码视频：在番号和标题之间插入"[无码破解]"
    if (currentSite === 'missav' && isUncensoredVideo(location.href)) {
      // 标题格式通常是 "番号 电影名字"，需要在中间插入"[无码破解]"
      const titleParts = title.match(/^([A-Za-z0-9\-]+)\s+(.*)$/);
      if (titleParts && titleParts.length >= 3) {
        // titleParts[1] 是番号，titleParts[2] 是电影名字
        title = `${titleParts[1]} [无码破解]${titleParts[2]}`;
      } else {
        // 如果格式不匹配，在标题开头添加标记
        title = '[无码破解]' + title;
      }
    }
    
    if (models && models.length === 1) {
      // 检查文件名中是否包含艺术家名称
      let artistName = models[0]
      let artistCNName = getArtistCNName(artistName)
      if (artistCNName) {
        artistName = artistCNName
        if (title.indexOf(artistName) < 0) {
          title = title + ' ' + artistName
        }
      }
    }
    let dir = getRealSaveFileDirectory(models)
    let proxy = getProxyMenuStatus() ? '' : proxyParam;
    let params = `"${url}"  --saveName "${title}" --workDir "${dir}" ${downloadParams}${proxy}`
    let bs64 = "m3u8dl://" + Base64.encode(params);
    // console.log('download-params:', params, url, title, dir, downloadParams, proxy, bs64);
    return bs64;
  }
 
  // 存储MissAV的清晰度选项和当前选择
  let missavQualities = [];
  let selectedQualityIndex = 0;

  async function detectDownload() {
    // 获取页面信息
    let parseResult = await videoPageParserFromDoc(document, document.documentElement.outerHTML);
    
    // 提取hlsUrl
    if (currentSite === 'jable') {
      // Jable从全局变量hlsUrl获取
      if (typeof hlsUrl !== 'undefined') {
        parseResult.hlsUrl = hlsUrl;
      }
    } else if (currentSite === 'missav') {
      // MissAV从Script标签中提取
      const scripts = document.querySelectorAll('script');
      let baseUrl = null;
      
      // 找到包含"seek"的script并提取hash
      for (let script of scripts) {
        if (script.textContent && script.textContent.indexOf('seek') > -1) {
          const nodeValue = script.textContent;
          const index = nodeValue.indexOf('seek');
          if (index !== -1 && index - 32 >= 0) {
            const first32Chars = nodeValue.substring(index - 38, index - 2);
            baseUrl = `https://surrit.com/${first32Chars}`;
            break;
          }
        }
      }
      
      if (baseUrl) {
        try {
          // 获取主 playlist.m3u8 文件
          const playlistUrl = `${baseUrl}/playlist.m3u8`;
          const response = await fetch(playlistUrl);
          const playlistText = await response.text();
          
          // 解析 m3u8 文件，找出所有清晰度选项
          const lines = playlistText.split('\n');
          const qualities = [];
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            // 查找 #EXT-X-STREAM-INF 行（包含清晰度信息）
            if (line.startsWith('#EXT-X-STREAM-INF')) {
              // 提取带宽和分辨率信息
              const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
              const resolutionMatch = line.match(/RESOLUTION=(\d+)x(\d+)/);
              
              // 下一行应该是m3u8文件路径
              if (i + 1 < lines.length && lines[i + 1].trim()) {
                const m3u8Path = lines[i + 1].trim();
                qualities.push({
                  bandwidth: bandwidthMatch ? parseInt(bandwidthMatch[1]) : 0,
                  width: resolutionMatch ? parseInt(resolutionMatch[1]) : 0,
                  height: resolutionMatch ? parseInt(resolutionMatch[2]) : 0,
                  path: m3u8Path,
                  label: resolutionMatch ? `${resolutionMatch[2]}P` : 'Unknown'
                });
              }
            }
          }
          
          // 如果没有找到清晰度信息，直接使用主 playlist
          if (qualities.length === 0) {
            parseResult.hlsUrl = playlistUrl;
            console.log('MissAV: 使用主 playlist.m3u8:', playlistUrl);
          } else {
            // 按带宽排序，最高清晰度在最前面
            qualities.sort((a, b) => b.bandwidth - a.bandwidth);
            missavQualities = qualities;
            selectedQualityIndex = 0; // 默认选择最高清晰度
            
            const bestQuality = qualities[0];
            
            // 构建完整URL
            if (bestQuality.path.startsWith('http')) {
              parseResult.hlsUrl = bestQuality.path;
            } else {
              parseResult.hlsUrl = `${baseUrl}/${bestQuality.path}`;
            }
            
            console.log(`MissAV: 选择最高清晰度 ${bestQuality.width}x${bestQuality.height} (${Math.round(bestQuality.bandwidth/1000000)}Mbps):`, parseResult.hlsUrl);
          }
        } catch (error) {
          console.error('MissAV: 获取M3U8清晰度信息失败:', error);
          // 失败时使用默认URL
          parseResult.hlsUrl = `${baseUrl}/playlist.m3u8`;
        }
      }
    }
    
    // console.log('detectDownload', parseResult)

    var title_el = document.querySelector(getPath('video_title_path'));
    if (!title_el) {
      return;
    }

    var download_btn = document.createElement("a");
    download_btn.className = "addtion";
    download_btn.id = "download_m3u8";
    download_btn.href = "javascript:void(0);";
    
    // 根据站点和清晰度设置按钮文字
    if (currentSite === 'missav' && missavQualities.length > 0) {
      const selectedQuality = missavQualities[selectedQualityIndex];
      if (logined) {
        download_btn.innerText = `下载并收藏(${selectedQuality.label})`;
      } else {
        download_btn.innerText = `下载(无法收藏,未登录)(${selectedQuality.label})`;
      }
    } else {
      if (logined) {
        download_btn.innerText = "下载并收藏";
      } else {
        download_btn.innerText = "下载(无法收藏,未登录)";
      }
    }
    
    download_btn.style.display = "inline-block";
    download_btn.style.padding = "10px 20px";
    download_btn.style.background = "cornflowerblue";
    download_btn.style.color = "white";
    download_btn.style.fontSize = "18px";
    download_btn.style.margin = "10px 10px 10px 0";
    download_btn.style.borderRadius = "5px";
    title_el.appendChild(download_btn);

    // 创建清晰度选择器（仅MissAV）- 放在下载按钮右边
    if (currentSite === 'missav' && missavQualities.length > 0) {
      const qualitySelector = document.createElement("select");
      qualitySelector.id = "quality_selector";
      qualitySelector.style.display = "inline-block";
      qualitySelector.style.padding = "10px 15px";
      qualitySelector.style.fontSize = "16px";
      qualitySelector.style.margin = "10px 0";
      qualitySelector.style.borderRadius = "5px";
      qualitySelector.style.border = "2px solid #6495ed";
      qualitySelector.style.background = "#f0f8ff";
      qualitySelector.style.color = "#000";
      qualitySelector.style.fontWeight = "bold";
      qualitySelector.style.cursor = "pointer";
      qualitySelector.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
      
      // 添加清晰度选项
      missavQualities.forEach((quality, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.text = `${quality.label} (${Math.round(quality.bandwidth/1000000)}Mbps)`;
        option.style.color = "#000";
        option.style.background = "#fff";
        if (index === selectedQualityIndex) {
          option.selected = true;
        }
        qualitySelector.appendChild(option);
      });
      
      // 监听选择变化
      qualitySelector.addEventListener('change', function() {
        selectedQualityIndex = parseInt(this.value);
        const selectedQuality = missavQualities[selectedQualityIndex];
        
        // 更新hlsUrl
        const baseUrlMatch = parseResult.hlsUrl.match(/(https:\/\/surrit\.com\/[^\/]+)/);
        if (baseUrlMatch) {
          const baseUrl = baseUrlMatch[1];
          if (selectedQuality.path.startsWith('http')) {
            parseResult.hlsUrl = selectedQuality.path;
          } else {
            parseResult.hlsUrl = `${baseUrl}/${selectedQuality.path}`;
          }
        }
        
        // 更新下载按钮文字
        const download_btn = document.getElementById('download_m3u8');
        if (download_btn) {
          if (logined) {
            download_btn.innerText = `下载并收藏(${selectedQuality.label})`;
          } else {
            download_btn.innerText = `下载(无法收藏,未登录)(${selectedQuality.label})`;
          }
        }
        
        console.log(`MissAV: 切换清晰度到 ${selectedQuality.label}:`, parseResult.hlsUrl);
      });
      
      title_el.appendChild(qualitySelector);
    }
 
    const likeBtn = document.querySelector(getPath('video_like_btn'));
    if (likeBtn) {
      saveVideoPageStatus();
      likeBtn.addEventListener("click", () => {
        saveVideoPageStatus(true);
      });
    }
 
    function checkClickLike() {
      const download = () => {
        let downloadLink = getDownloadSchemeFromHlsUrl(parseResult.hlsUrl, parseResult.title, parseResult.models);
        // console.log('开始下载', downloadLink);
        // 使用location.href而不是window.open，避免打开新标签页
        window.location.href = downloadLink;
      };
      if (likeBtn) {
        // 通过code判断收藏状态
        let code = getCodeFromUrl(location.href);
        let isLiked = getLiked(code);
        console.log('收藏状态:', isLiked, code, liked_codes);
        if (isLiked) {
          var r = confirm("你已收藏此影片，可能下载过，是否继续下载？");
          if (r == true) {
            download();
          } else {
            // console.log('取消下载');
          }
        } else {
          likeBtn.click();
          download();
        }
      } else {
        download();
      }
    }
    download_btn.addEventListener("click", function () {
      checkClickLike();
    });
  }
 
  /**
   * 保存视频页面的收藏状态
   */
  function saveVideoPageStatus(isClick = false) {
    if (!isVideoPage) {
      return;
    }
    const likeBtn = document.querySelector(getPath('video_like_btn'));
    if (!likeBtn) {
      return;
    }
    let code = getCodeFromUrl(location.href);
    let currentLike = false;
    
    // 根据站点判断收藏状态
    if (currentSite === 'missav') {
      currentLike = likeBtn.classList.contains("text-primary");
    } else {
      currentLike = likeBtn.classList.contains("active");
    }
    
    if (isClick) {
      currentLike = !currentLike;
    } else {
      if (!currentLike) {
        return;
      }
    }
    setLiked(code, currentLike);
  }

  /**
   * 同步收藏按钮状态
   * @param {boolean} shouldBeLiked - 目标收藏状态
   * @param {boolean} forceClick - 是否强制点击（即使状态已匹配）
   */
  function syncFavoriteButton(shouldBeLiked, forceClick = false) {
    if (!isVideoPage || syncInProgress) {
      return;
    }
    
    const likeBtn = document.querySelector(getPath('video_like_btn'));
    if (!likeBtn) {
      console.log('[收藏同步] 未找到收藏按钮');
      return;
    }
    
    let currentlyLiked = currentSite === 'missav' 
      ? likeBtn.classList.contains("text-primary")
      : likeBtn.classList.contains("active");
    
    // 只在状态不匹配时点击，或强制点击
    if (currentlyLiked !== shouldBeLiked || forceClick) {
      console.log(`[收藏同步] 同步收藏状态: ${currentlyLiked} -> ${shouldBeLiked} (${currentSite})`);
      
      syncInProgress = true;  // 设置同步标志
      
      // 点击按钮
      likeBtn.click();
      
      // 延迟重置同步标志
      setTimeout(() => {
        syncInProgress = false;
      }, 1000);
    } else {
      console.log(`[收藏同步] 状态已同步，无需操作 (${currentSite})`);
    }
  }

  /**
   * 页面加载时检查并同步收藏状态
   */
  function checkAndSyncOnLoad() {
    if (!isVideoPage) {
      return;
    }
    
    let code = getCodeFromUrl(location.href);
    let normalized = normalizeCode(code);
    
    // 检查是否在全局收藏列表中
    if (liked_codes.length === 0) {
      initialLikedCodes();
    }
    
    let shouldBeLiked = liked_codes.indexOf(normalized) >= 0;
    
    console.log(`[收藏同步] 页面加载检查: ${normalized}, 应该收藏: ${shouldBeLiked}`);
    
    if (shouldBeLiked) {
      // 延迟确保页面完全加载
      setTimeout(() => {
        syncFavoriteButton(true);
      }, 1500);
    }
  }
  var mouse_timer = null; // 定时器
  var manual_loaded_codes = {};
 
  function createNode(htmlStr) {
    var div = document.createElement("div");
    div.innerHTML = htmlStr;
    return div.childNodes[0];
  }
  function isValidClassName(name) {
    return name.match(/-?[_a-zA-Z]+[_a-zA-Z0-9-]*/)
  }
  // update website CSS
  function updateBoxCardCSS(forceLoadLikeStatus = false) {
    var imgBoxes = document.querySelectorAll(".video-img-box");
    for (let index = 0; index < imgBoxes.length; index++) {
      const box = imgBoxes[index];
 
      let title = box.querySelector(".title");
      if (!title) {
        return;
      }
      let subTitle = box.querySelector(".sub-title");
      if (
        subTitle &&
        subTitle.innerText &&
        subTitle.innerText.split("\n").length >= 2
      ) {
        // 根据观看数和点赞数设置标签
        let playText = subTitle.innerText.split("\n")[0];
        let likeText = subTitle.innerText.split("\n")[1];
        if (playText && likeText) {
          let playCount = parseInt(playText.replaceAll(" ", ""));
          let likeCount = parseInt(likeText);
          if (playCount > 1300000 || likeCount > 13000) {
            box.classList.add("hot-3");
          } else if (playCount > 1000000 || likeCount > 10000) {
            box.classList.add("hot-2");
          } else if (playCount > 500000 || likeCount > 5000) {
            box.classList.add("hot-1");
          }
        }
      }
 
      let titleLink = title.querySelector("a");
      if (titleLink && titleLink.href && isVideoURL(titleLink.href)) {
        let code = getCodeFromUrl(titleLink.href);
        // 保存代码映射
        if (currentSite === 'jable') {
          saveCodeMapping(code, null);
        } else if (currentSite === 'missav') {
          saveCodeMapping(null, code);
        }
        if (code) {
          let className = code
          if (!isValidClassName(className)) {
            className = 'valid-' + className
          }
          if (!box.classList.contains(className)) {
            box.classList.add(className);
            let heartEls = box.querySelectorAll(".action");
            heartEls.forEach((heartEl) => {
              if (heartEl) {
                if (heartEl.classList.contains("fav-restore")) {
                  heartEl.addEventListener("click", (event) => {
                    event.preventDefault();
                    setLiked(code, true);
                    loadBoxStatus(box, code);
                  });  
                } else if (heartEl.classList.contains("fav-remove")) {
                  heartEl.addEventListener("click", (event) => {
                    event.preventDefault();
                    setLiked(code, false);
                    loadBoxStatus(box, code);
                  });
                } else {
                  heartEl.classList.add("like");
                  heartEl.addEventListener("click", (event) => {
                    event.preventDefault();
                    let liked = !heartEl.classList.contains("active");
                    setLiked(code, liked);
                    loadBoxStatus(box, code);
                    // console.log('heartEl-click', code, liked);
                    setTimeout(() => {
                      requestLike(heartEl, liked)
                    }, 100);
                  });
                }
              }
            });
            let coverAEl = box.querySelector(".img-box a");
            if (coverAEl) {
              let downloadbtn = createNode('<div class="absolute-bottom-left download"><span class="action download d-sm-flex"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="#ffffff" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-8 4v-5h2v3h12v-3h2v5z"></path></svg></span></div>')
              coverAEl.appendChild(downloadbtn);
              downloadbtn.addEventListener("click", (event) => {
                event.preventDefault();
                downloadFilm(box, code);
              });
            }
 
            function stopMouseTimer() {
              clearTimeout(mouse_timer);
              mouse_timer = null;
            }
            box.addEventListener(
              "mouseenter",
              (event) => {
                stopMouseTimer();
                if (!manual_loaded_codes.hasOwnProperty(code)) {
                  mouse_timer = setTimeout(() => {
                    stopMouseTimer();
                    getFilmResult(code);
                  }, 500);
                }
              },
              false
            );
            box.addEventListener(
              "mouseleave",
              (event) => {
                if (mouse_timer) {
                  stopMouseTimer();
                }
              },
              false
            );
 
            loadBoxStatus(box, code);
          } else if (forceLoadLikeStatus) {
            loadBoxStatus(box, code);
          }
        }
      }
    }
  }
 
  function downloadFilm(box, code) {
    let result = manual_loaded_codes[code];
    let liked = getLiked(code);
    if (result && result.hlsUrl && result.title) {
      let likeBtn = box.querySelector(".action.like");
      const download = () => {
        let downloadLink = getDownloadSchemeFromHlsUrl(result.hlsUrl, result.title, result.models);
        // console.log('开始下载', downloadLink, result);
        // 使用location.href而不是window.open，避免打开新标签页
        window.location.href = downloadLink;
      };
      if (likeBtn) {
        if (liked) {
          var r = confirm("你已收藏此影片，可能下载过，是否继续下载？");
          if (r == true) {
            download();
          }
        } else {
          likeBtn.click();
          download();
        }
      } else {
        download();
      }
    }
  }
 
  async function requestLike(heartEl, liked) {
    if (!logined || !heartEl) {
      return;
    }
    const action = liked ? "add_to_favourites" : "delete_from_favourites";
    const fav_id = heartEl.getAttribute("data-fav-video-id");
    const url = `${location.href}?mode=async&format=json&action=${action}&video_id=${fav_id}&video_ids%5B%5D=${fav_id}&fav_type=0&playlist_id=0`;
    if (!fav_id) {
      return;
    }
    // console.log("requestLike-start", url);
    const xhrPromise = new Promise((resolve) => {
      xmlhttpRequest({
        method: "GET",
        url: url,
        onload: (response) => {
          // console.log("requestLike-done", response);
          if (response.status === 404) {
            resolve({
              status: "fail",
            });
          } else {
            resolve({
              status: "success",
            });
          }
        },
        onerror: (error) => {
          console.log("requestLike-error", error);
          resolve({
            status: "fail",
          });
        },
      });
    });
    return xhrPromise;
 
  }
 
  async function loadAllMyFavorites() {
    if (!logined) {
      return;
    }
 
    // 监听全局收藏列表变化（跨标签页/跨站点同步）
    GM_addValueChangeListener(
      GM_KEYS.GLOBAL_LIKED_CODES,
      (name, old_value, new_value, remote) => {
        if (remote) {
          liked_codes = new_value || [];
          console.log("[收藏同步] 收藏列表远程更新:", liked_codes.length, '个');
          updateBoxCardCSS(true);
            
          // 检查当前视频页面是否需要同步收藏状态
          if (isVideoPage && !syncInProgress) {
            let currentCode = getCodeFromUrl(location.href);
            let normalizedCurrent = normalizeCode(currentCode);
              
            // 检查当前视频的收藏状态是否变化
            let wasLiked = old_value ? old_value.indexOf(normalizedCurrent) >= 0 : false;
            let isLiked = new_value ? new_value.indexOf(normalizedCurrent) >= 0 : false;
              
            if (wasLiked !== isLiked) {
              console.log(`[收藏同步] 检测到当前视频收藏状态变化: ${wasLiked} -> ${isLiked}`);
              setTimeout(() => {
                syncFavoriteButton(isLiked);
              }, 500);
            }
          }
        }
      }
    );
 
    const usrkey = GM_KEYS.GLOBAL_FAVORITES_INITIALIZED;  // 使用全局key
    if (GM_getValue(usrkey)) {
      return;
    }
    var isSuccess = true;
    var codes = [];
    var result = await requestFavoritesPage(1);
    if (result.status == "success") {
      codes = codes.concat(result.liked_codes);
      while (result.next) {
        result = await requestFavoritesPage(result.next);
        if (result.status == "success") {
          codes = codes.concat(result.liked_codes);
        } else {
          isSuccess = false;
        }
      }
    } else {
      isSuccess = false;
    }
    if (isSuccess) {
      GM_setValue(usrkey, true);
      liked_codes = codes;
      // console.log("set_liked_codes-1", "global_liked_codes", liked_codes);
      GM_setValue(GM_KEYS.GLOBAL_LIKED_CODES, liked_codes);  // 使用全局key
      updateBoxCardCSS(true);
    }
  }
 
  function favouritesPageParser(responseText) {
    let res = {
      status: "fail",
      current: 0,
      next: 0,
      total: 0,
      liked_codes: [],
    };
    const doc = new DOMParser().parseFromString(responseText, "text/html");
    const page_item = doc.querySelectorAll(".page-item");
    if (page_item && page_item.length > 0) {
      let currentCount = 0;
      let totalCount = 0;
      let nextCount = 0;
      const current = doc.querySelector(".page-item .page-link.active");
      if (current && current.innerText) {
        currentCount = parseInt(current.innerText);
        res.current = currentCount;
      }
 
      const total = doc.querySelector(".page-item:last-child .page-link");
      if (total && total.innerText) {
        if (total.classList.contains("active")) {
          res.total = total.innerText;
        } else {
          let parameters = total.attributes["data-parameters"].value;
          parameters = parameters.split(";");
          for (let index = 0; index < parameters.length; index++) {
            const element = parameters[index];
            if (element.indexOf("from_my_fav_videos:") == 0) {
              res.total = element.split(":")[1];
              break;
            }
          }
        }
        if (res.total) {
          totalCount = parseInt(res.total);
          res.total = totalCount;
        }
      }
 
      if (currentCount && totalCount && currentCount < totalCount) {
        nextCount = currentCount + 1;
        res.next = nextCount;
      }
    }
 
    let links = doc.querySelectorAll(".video-img-box .detail .title a");
    if (links && links.length > 0) {
      let liked_codes = [];
      for (let index = 0; index < links.length; index++) {
        const element = links[index];
        if (element.href.indexOf(linkPrefix) == 0) {
          let code = getCodeFromUrl(element.href);
          let normalized = normalizeCode(code);  // 标准化代码
          liked_codes.push(normalized);
          // 保存Jable代码映射
          saveCodeMapping(code, null);
        }
      }
      res.liked_codes = liked_codes;
      if (liked_codes.length > 0) {
        res.status = "success";
      }
    }
    return res;
  }
  async function requestFavoritesPage(page) {
    // console.log("requestFavoritesPage-start", page);
    let url = `https://jable.tv/my/favourites/videos/?mode=async&function=get_block&block_id=list_videos_my_favourite_videos&fav_type=0&playlist_id=0&sort_by=&from_my_fav_videos=${page}&_=${new Date().getTime()}`;
    const xhrPromise = new Promise((resolve) => {
      xmlhttpRequest({
        method: "GET",
        url: url,
        onload: (response) => {
          if (response.status === 404) {
            resolve({
              status: "fail",
            });
          } else {
            const res = favouritesPageParser(response.responseText);
            // console.log("requestFavoritesPage-done", page, res);
            resolve(res);
          }
        },
        onerror: (error) => {
          // console.log("requestFavoritesPage-error", error);
          resolve({
            status: "fail",
          });
        },
      });
    });
    return xhrPromise;
  }
 
  /**
   * 检查视频是否已收藏（使用标准化代码）
   */
  function getLiked(code) {
    if (liked_codes.length === 0) {
      initialLikedCodes();
    }
    let normalized = normalizeCode(code);
    return liked_codes.indexOf(normalized) >= 0;
  }
 
  /**
   * 初始化收藏列表
   */
  function initialLikedCodes() {
    let res = GM_getValue(GM_KEYS.GLOBAL_LIKED_CODES);  // 使用全局key
    liked_codes = res || [];
    console.log("[收藏同步] 初始化收藏列表:", liked_codes.length, '个');
    
    // 自动迁移旧数据（只在第一次运行时）
    migrateOldUserData();
    
    // 标准化现有数据（只在第一次运行时）
    normalizeExistingCodes();
  }

  /**
   * 标准化现有的收藏代码
   * 将旧的大写代码转换为小写，确保跨站匹配
   */
  function normalizeExistingCodes() {
    const normalizationKey = "codes_normalization_completed";
    if (GM_getValue(normalizationKey)) {
      return; // 已经标准化过
    }
    
    try {
      if (liked_codes.length === 0) {
        GM_setValue(normalizationKey, true);
        return;
      }
      
      let originalCount = liked_codes.length;
      let normalizedCodes = [];
      let changed = false;
      
      console.log('[代码标准化] 开始标准化现有收藏代码...');
      
      liked_codes.forEach(code => {
        let normalized = normalizeCode(code);
        if (normalizedCodes.indexOf(normalized) === -1) {
          normalizedCodes.push(normalized);
        }
        if (code !== normalized) {
          changed = true;
        }
      });
      
      if (changed) {
        liked_codes = normalizedCodes;
        GM_setValue(GM_KEYS.GLOBAL_LIKED_CODES, liked_codes);
        console.log(`[代码标准化] 完成! 原始: ${originalCount}, 标准化后: ${normalizedCodes.length}`);
      } else {
        console.log('[代码标准化] 所有代码已是标准格式');
      }
      
      GM_setValue(normalizationKey, true);
      
    } catch (error) {
      console.error('[代码标准化] 错误:', error);
    }
  }
  
  /**
   * 迁移旧的用户名key数据到新的全局key
   * 遍历所有GM存储的key，找到所有_liked_codes结尾的旧数据并合并
   */
  function migrateOldUserData() {
    // 检查是否已经迁移过
    const migrationKey = "data_migration_completed";
    if (GM_getValue(migrationKey)) {
      return; // 已经迁移过，不再重复迁移
    }
    
    try {
      // 获取所有GM存储的key
      let allKeys = GM_listValues();
      let migratedCodes = [];
      let originalCount = liked_codes.length;
      let migratedUsers = [];
      let oldKeysToDelete = [];  // 记录需要删除的旧key
      
      console.log('[数据迁移] 开始检查旧数据...');
      console.log('[数据迁移] 找到的所有存储key:', allKeys);
      
      // 查找所有旧的用户收藏列表key
      allKeys.forEach(key => {
        // 匹配格式: {userName}_liked_codes
        if (key.endsWith('_liked_codes') && key !== GM_KEYS.GLOBAL_LIKED_CODES) {
          let oldCodes = GM_getValue(key);
          if (Array.isArray(oldCodes) && oldCodes.length > 0) {
            let userName = key.replace('_liked_codes', '');
            console.log(`[数据迁移] 发现用户 "${userName}" 的旧收藏数据:`, oldCodes.length, '个');
            
            // 合并到迁移列表
            oldCodes.forEach(code => {
              if (migratedCodes.indexOf(code) === -1) {
                migratedCodes.push(code);
              }
            });
            
            migratedUsers.push(userName);
            oldKeysToDelete.push(key);  // 添加到待删除列表
          }
        }
        
        // 同时查找并标记旧的 favorites_initialized_status key
        if (key.endsWith('_favorites_initialized_status')) {
          oldKeysToDelete.push(key);
        }
      });
      
      if (migratedCodes.length > 0) {
        // 合并到当前的liked_codes
        migratedCodes.forEach(code => {
          if (liked_codes.indexOf(code) === -1) {
            liked_codes.push(code);
          }
        });
        
        // 保存合并后的数据
        GM_setValue(GM_KEYS.GLOBAL_LIKED_CODES, liked_codes);
        
        console.log(`[数据迁移] 迁移完成！`);
        console.log(`[数据迁移] 原有收藏: ${originalCount} 个`);
        console.log(`[数据迁移] 迁移用户: ${migratedUsers.join(', ')}`);
        console.log(`[数据迁移] 发现旧数据: ${migratedCodes.length} 个`);
        console.log(`[数据迁移] 新增收藏: ${liked_codes.length - originalCount} 个`);
        console.log(`[数据迁移] 合并后总计: ${liked_codes.length} 个`);
        
        // 删除所有旧的key
        if (oldKeysToDelete.length > 0) {
          console.log(`[数据迁移] 开始清理旧数据...`);
          let deletedCount = 0;
          oldKeysToDelete.forEach(key => {
            try {
              GM_deleteValue(key);
              deletedCount++;
              console.log(`[数据迁移] 已删除旧key: ${key}`);
            } catch (error) {
              console.error(`[数据迁移] 删除key失败: ${key}`, error);
            }
          });
          console.log(`[数据迁移] 清理完成，共删除 ${deletedCount} 个旧key`);
        }
        
        // 显示迁移提示（仅在有数据迁移时）
        if (liked_codes.length > originalCount) {
          // setTimeout(() => {
          //   alert(
          //     `检测到旧收藏数据并已自动迁移！\n\n` +
          //     `原有收藏: ${originalCount} 个\n` +
          //     `发现旧数据: ${migratedCodes.length} 个（来自 ${migratedUsers.length} 个用户）\n` +
          //     `新增收藏: ${liked_codes.length - originalCount} 个\n` +
          //     `合并后总计: ${liked_codes.length} 个\n\n` +
          //     `迁移的用户: ${migratedUsers.join(', ')}\n` +
          //     `已清理旧数据: ${oldKeysToDelete.length} 个key\n\n` +
          //     `现在Jable和MissAV将共享同一个收藏列表！`
          //   );
          // }, 1000);
        }
      } else {
        console.log('[数据迁移] 未发现需要迁移的旧数据');
        
        // 即使没有数据需要迁移，也检查是否有需要清理的旧key
        if (oldKeysToDelete.length > 0) {
          console.log(`[数据迁移] 发现 ${oldKeysToDelete.length} 个空的旧key，开始清理...`);
          oldKeysToDelete.forEach(key => {
            try {
              GM_deleteValue(key);
              console.log(`[数据迁移] 已删除空key: ${key}`);
            } catch (error) {
              console.error(`[数据迁移] 删除key失败: ${key}`, error);
            }
          });
        }
      }
      
      // 标记迁移已完成
      GM_setValue(migrationKey, true);
      console.log('[数据迁移] 迁移流程结束');
      
    } catch (error) {
      console.error('[数据迁移] 迁移过程出错:', error);
    }
  }
 
  /**
   * 设置视频收藏状态（使用标准化代码）
   */
  function setLiked(code, liked) {
    let normalized = normalizeCode(code);
    
    // 保存代码映射
    if (currentSite === 'jable') {
      saveCodeMapping(code, null);
    } else if (currentSite === 'missav') {
      saveCodeMapping(null, code);
    }
    
    if (liked) {
      if (liked_codes.indexOf(normalized) < 0) {
        liked_codes.push(normalized);
        console.log('[收藏同步] 添加收藏:', normalized, '来源:', currentSite);
        GM_setValue(GM_KEYS.GLOBAL_LIKED_CODES, liked_codes);
      }
    } else {
      let index = liked_codes.indexOf(normalized);
      if (index >= 0) {
        liked_codes.splice(index, 1);
        console.log('[收藏同步] 取消收藏:', normalized, '来源:', currentSite);
        GM_setValue(GM_KEYS.GLOBAL_LIKED_CODES, liked_codes);
      }
    }
  }
 
  function loadBoxStatus(boxEl, code) {
    let liked = getLiked(code);
    if (boxEl) {
      let heartEl = boxEl.querySelector(".action.like");
      if (liked) {
        boxEl.classList.add("liked");
        if (heartEl) {
          heartEl.classList.add("active");
        }
      } else {
        if (boxEl.classList.contains("liked")) {
          boxEl.classList.remove("liked");
          if (heartEl && heartEl.classList.contains("active")) {
            heartEl.classList.remove("active");
          }
        }
      }
      let requestData = manual_loaded_codes[code];
      let downloadEl = boxEl.querySelector(".action.download");
      if (requestData && requestData.hlsUrl) {
        boxEl.classList.add("hasurl");
        if (downloadEl) {
          downloadEl.setAttribute("hlsUrl", requestData.hlsUrl);
        }
      } else {
        boxEl.classList.remove("hasurl");
        if (downloadEl) {
          downloadEl.removeAttribute("hlsUrl");
        }  
      }
 
      if (requestData && requestData.avatarDom) {
        let subTitle = boxEl.querySelector(".detail .sub-title");
        if (subTitle && !subTitle.classList.contains("added-avatar")) {
          subTitle.classList.add("added-avatar");
          subTitle.appendChild(requestData.avatarDom);
        }
      }
    }
  }
 
  async function getFilmResult(code) {
    if (!logined) {
      return;
    }
    let className = code
    if (!isValidClassName(className)) {
      className = 'valid-' + className
    }
    let boxEl = document.querySelector(`.video-img-box.${className}`);
    let downloadEl = boxEl.querySelector(".action.download");
    if (downloadEl) {
      downloadEl.classList.add('loading')
    }

    // console.log("getFilmResult", code);
    let item = {
      status: "loading",
      targetLink: `${linkPrefix}${code}/`,
      hlsUrl: null,
      models: [],
      title: "",
      code: code,
      avatarDom: null,
      request_at: 0,
      liked: false,
    };
    const resItem = await requestVideoPage(item);
    if (resItem.status != "success") {
      return;
    }
 
    let liked = getLiked(code);
    if (liked && !resItem.liked) {
      // console.log('请求结果与记录不符，正在重新点赞！！！', code, resItem)
      resItem.liked = true;
      let heartEl = boxEl.querySelector(".action.like");
      if (heartEl) {
        requestLike(heartEl, true);
      }
    }
    manual_loaded_codes[code] = resItem;
    setLiked(code, resItem.liked);
    // console.log("getFilmResult-finish", resItem);
    if (downloadEl) {
      downloadEl.classList.remove('loading')
    }

    loadBoxStatus(boxEl, code);
  }
 
  async function videoPageParser(responseText) {
    const doc = new DOMParser().parseFromString(responseText, "text/html");
    let result = await videoPageParserFromDoc(doc, responseText)
    
    // Jable的M3U8提取
    if (currentSite === 'jable') {
      var regex = /var\s+hlsUrl\s*=\s*['"]([^'"]+)['"]/;
      var match = responseText.match(regex);
      if (match && match.length > 1) {
        result.hlsUrl = match[1];
        // console.log("提取到的 hlsUrl 值为:", result.hlsUrl);
      }
    }
    // MissAV的M3U8提取
    else if (currentSite === 'missav') {
      const scriptMatch = responseText.match(/<script[^>]*>([\s\S]*?seek[\s\S]*?)<\/script>/);
      if (scriptMatch && scriptMatch[1]) {
        const nodeValue = scriptMatch[1];
        const index = nodeValue.indexOf('seek');
        if (index !== -1 && index - 32 >= 0) {
          const first32Chars = nodeValue.substring(index - 38, index - 2);
          result.hlsUrl = `https://surrit.com/${first32Chars}/playlist.m3u8`;
          // console.log("提取到的 MissAV hlsUrl:", result.hlsUrl);
        }
      }
    }
    
    return result
  }
  async function videoPageParserFromDoc(doc, responseText = null) {
    let res = {
      isSuccess: false,
      liked: false,
      models: [],
      hlsUrl: null,
      title: "",
      avatarDom: null,
    };
    
    const likeBtn = doc.querySelector(getPath('video_like_btn'));
    if (likeBtn) {
      res.isSuccess = true;
      // 根据站点判断收藏状态
      if (currentSite === 'missav') {
        res.liked = likeBtn.classList.contains("text-primary");
      } else {
        res.liked = likeBtn.classList.contains("active");
      }
    }
    
    var title_el = doc.querySelector(getPath('video_title_path'));
    if (title_el && title_el.innerText) {
      res.title = title_el.innerText;
    }
 
    var avatar_el = doc.querySelector(getPath('video_avatar_path'));
    if (avatar_el) {
      res.avatarDom = avatar_el;
      let models = []
      
      // Jable 的演员信息提取
      if (currentSite === 'jable') {
        let aModel = avatar_el.querySelectorAll('a.model')
        aModel.forEach(a => {
          let rc = a.querySelector('.rounded-circle')
          let title = rc.getAttribute('title') || rc.getAttribute('data-original-title')
          // console.log('title',title)
          if (a.href && title) {
            models.push({
              name: title,
              url: a.href
            })
          }
        })
      }
      // MissAV 的演员信息提取
      else if (currentSite === 'missav') {
        // 查找 <div class="text-secondary">中第一个子元素为<span>女优:</span>的元素
        const allSecondary = doc.querySelectorAll('div.text-secondary');
        allSecondary.forEach(div => {
          const firstChild = div.querySelector('span');
          if (firstChild && firstChild.textContent.trim() === '女优:') {
            // 提取所有 <a> 标签
            const actressLinks = div.querySelectorAll('a.text-nord13.font-medium');
            actressLinks.forEach(a => {
              if (a.href && a.textContent) {
                models.push({
                  name: a.textContent.trim(),
                  url: a.href
                });
              }
            });
          }
        });
      }
      
      res.models = models
      if (res.models.length == 1) {
        let cnName = getArtistCNName(res.models[0].name)
        if (!cnName) {
          await requestArtistPage(res.models[0].url)
        }
      }
    }
 
    return res;
  }
  async function requestVideoPage(siteItem) {
    const siteUrl = siteItem.targetLink;
    const xhrPromise = new Promise((resolve) => {
      xmlhttpRequest({
        method: "GET",
        url: siteUrl,
        onload: async (response) => {
          siteItem.request_at = new Date().getTime();
          if (response.status === 404) {
            siteItem.status = "fail";
            resolve(siteItem);
          } else {
            const { isSuccess, liked, hlsUrl, title, avatarDom, models } = await videoPageParser(response.responseText);
            siteItem.status = isSuccess ? "success" : "fail";
            siteItem.liked = liked;
            siteItem.hlsUrl = hlsUrl
            siteItem.models = models
            siteItem.title = title
            siteItem.avatarDom = avatarDom
            setTimeout(() => {
              resolve(siteItem);
            }, 200);
          }
        },
        onerror: (error) => {
          // console.log("xhr-error", error);
          siteItem.status = "fail";
          resolve(siteItem);
        },
      });
    });
    return xhrPromise;
  }
 
  function observePageMutations() {
    var targetNode = document.body;
    var observerOptions = {
      childList: true, // Observe direct children being added or removed
      subtree: true, // Observe all descendants of the target node
    };
    var observer = new MutationObserver(function (mutationsList, observer) {
      updateBoxCardCSS();
    });
    observer.observe(targetNode, observerOptions);
  }
 
  (function main() {
    if (currentSite === 'jable') {
      addStyle(jableStyle);
    }
    window.addEventListener("load", () => {
      initialLikedCodes();
      console.log("Jable一键下载收藏.js", isVideoPage);
      console.log("[收藏同步] 跨站收藏同步功能已启用");
      
      // MissAV页面DOM可能动态加载,延迟再次检查
      if (currentSite === 'missav' && !isVideoPage) {
        setTimeout(() => {
          isVideoPage = isVideoURL(location.href);
          console.log("MissAV延迟检测视频页:", isVideoPage);
          if (isVideoPage) {
            detectDownload();
            checkAndSyncOnLoad();  // 检查并同步收藏状态
          }
        }, 500);
      } else if (isVideoPage) {
        detectDownload();
        checkAndSyncOnLoad();  // 检查并同步收藏状态
      }
      
      updateBoxCardCSS();
      observePageMutations();
      loadAllMyFavorites();
    });
  })();
})();