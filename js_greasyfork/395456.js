// ==UserScript==
// @name            B站稍后再看功能增强
// @version         4.37.4.20240827
// @namespace       laster2800
// @author          Laster2800
// @description     与稍后再看功能相关，一切你能想到和想不到的功能
// @icon            https://www.bilibili.com/favicon.ico
// @homepageURL     https://greasyfork.org/zh-CN/scripts/395456
// @supportURL      https://greasyfork.org/zh-CN/scripts/395456/feedback
// @license         LGPL-3.0
// @include         *://www.bilibili.com/*
// @include         *://t.bilibili.com/*
// @include         *://message.bilibili.com/*
// @include         *://search.bilibili.com/*
// @include         *://space.bilibili.com/*
// @include         *://account.bilibili.com/*
// @exclude         *://message.bilibili.com/*/*
// @exclude         *://t.bilibili.com/h5/*
// @exclude         *://www.bilibili.com/correspond/*
// @exclude         *://www.bilibili.com/page-proxy/*
// @require         https://update.greasyfork.org/scripts/409641/1435266/UserscriptAPI.js
// @require         https://update.greasyfork.org/scripts/431998/1161016/UserscriptAPIDom.js
// @require         https://update.greasyfork.org/scripts/432000/1095149/UserscriptAPIMessage.js
// @require         https://update.greasyfork.org/scripts/432002/1161015/UserscriptAPIWait.js
// @require         https://update.greasyfork.org/scripts/432003/1381253/UserscriptAPIWeb.js
// @require         https://update.greasyfork.org/scripts/432936/1161000/PushQueue.js
// @require         https://update.greasyfork.org/scripts/432807/1160998/InputNumber.js
// @grant           GM_registerMenuCommand
// @grant           GM_notification
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_addValueChangeListener
// @grant           GM.cookie
// @connect         api.bilibili.com
// @run-at          document-start
// @compatible      edge 版本不小于 93
// @compatible      chrome 版本不小于 93
// @compatible      firefox 版本不小于 92
// @downloadURL https://update.greasyfork.org/scripts/395456/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/395456/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

/* global UserscriptAPI, PushQueue */
(function() {
  'use strict'

  if (GM_info.scriptHandler !== 'Tampermonkey') {
    const { script } = GM_info
    script.author ??= 'Laster2800'
    script.homepage ??= 'https://greasyfork.org/zh-CN/scripts/395456'
    script.supportURL ??= 'https://greasyfork.org/zh-CN/scripts/395456/feedback'
  }

  const sortType = {
    default: 'serial',
    defaultR: 'serial:R',
    duration: 'duration',
    durationR: 'duration:R',
    pubtime: 'pubtime',
    pubtimeR: 'pubtime:R',
    progress: 'progress',
    uploader: 'uploader',
    title: 'vTitle',
    fixed: 'fixed',
  }
  /**
   * 脚本内用到的枚举定义
   */
  const Enums = {
    /**
     * @readonly
     * @enum {string}
     */
    headerButtonOp: {
      openListInCurrent: 'openListInCurrent',
      openListInNew: 'openListInNew',
      playAllInCurrent: 'playAllInCurrent',
      playAllInNew: 'playAllInNew',
      clearWatchlater: 'clearWatchlater',
      clearWatchedInWatchlater: 'clearWatchedInWatchlater',
      openUserSetting: 'openUserSetting',
      openRemoveHistory: 'openRemoveHistory',
      openBatchAddManager: 'openBatchAddManager',
      exportWatchlaterList: 'exportWatchlaterList',
      noOperation: 'noOperation',
    },
    /**
     * @readonly
     * @enum {string}
     */
    headerMenu: {
      enable: 'enable',
      enableSimple: 'enableSimple',
      disable: 'disable',
    },
    /**
     * @readonly
     * @enum {string}
     */
    headerCompatible: {
      none: 'none',
      bilibiliEvolved: 'bilibiliEvolved',
    },
    /**
     * @readonly
     * @enum {string}
     */
    sortType,
    /**
     * @readonly
     * @enum {string}
     */
    autoSort: {
      auto: 'auto',
      ...sortType,
    },
    /**
     * @readonly
     * @enum {string}
     */
    openHeaderMenuLink: {
      openInCurrent: 'openInCurrent',
      openInNew: 'openInNew',
    },
    /**
     * @readonly
     * @enum {string}
     */
    removeHistorySavePoint: {
      list: 'list',
      listAndMenu: 'listAndMenu',
      anypage: 'anypage',
    },
    /**
     * @readonly
     * @enum {string}
     */
    fillWatchlaterStatus: {
      dynamic: 'dynamic',
      dynamicAndVideo: 'dynamicAndVideo',
      anypage: 'anypage',
      never: 'never',
    },
    /**
     * @readonly
     * @enum {string}
     */
    autoRemove: {
      always: 'always',
      openFromList: 'openFromList',
      never: 'never',
      absoluteNever: 'absoluteNever',
    },
    /**
     * @readonly
     * @enum {string}
     */
    openListVideo: {
      openInCurrent: 'openInCurrent',
      openInNew: 'openInNew',
    },
    /**
     * @readonly
     * @enum {string}
     */
    menuScrollbarSetting: {
      beautify: 'beautify',
      hidden: 'hidden',
      original: 'original',
    },
    /**
     * @readonly
     * @enum {string}
     */
    mainRunAt: {
      DOMContentLoaded: 'DOMContentLoaded',
      load: 'load',
    },
  }
  // 将名称不完全对应的补上，这样校验才能生效
  Enums.headerButtonOpL = Enums.headerButtonOpR = Enums.headerButtonOpM = Enums.headerButtonOp

  const gmId = 'gm395456'
  /**
   * 全局对象
   * @typedef GMObject
   * @property {string} id 脚本标识
   * @property {number} configVersion 配置版本，为最后一次执行初始化设置或功能性更新设置时脚本对应的配置版本号
   * @property {number} configUpdate 当前版本对应的配置版本号，只要涉及到配置的修改都要更新；若同一天修改多次，可以追加小数来区分
   * @property {URLSearchParams} searchParams URL 查询参数
   * @property {GMObject_config} config 用户配置
   * @property {GMObject_configMap} configMap 用户配置属性
   * @property {GMObject_infoMap} infoMap 信息属性
   * @property {GMObject_runtime} runtime 运行时变量
   * @property {string[]} configDocumentStart document-start 时期配置
   * @property {GMObject_data} data 脚本数据
   * @property {GMObject_url} url URL
   * @property {GMObject_regex} regex 正则表达式
   * @property {{[c: string]: *}} const 常量
   * @property {GMObject_panel} panel 面板
   * @property {{[s: string]: HTMLElement}} el HTML 元素
   */
  /**
   * @typedef GMObject_config
   * @property {boolean} headerButton 顶栏入口
   * @property {headerButtonOp} headerButtonOpL 顶栏入口左键点击行为
   * @property {headerButtonOp} headerButtonOpR 顶栏入口右键点击行为
   * @property {headerButtonOp} headerButtonOpM 顶栏入口中键点击行为
   * @property {headerMenu} headerMenu 顶栏入口弹出面板设置
   * @property {openHeaderMenuLink} openHeaderMenuLink 弹出面板内链接点击行为
   * @property {boolean} headerMenuKeepRemoved 弹出面板保留被移除稿件
   * @property {boolean} headerMenuSearch 弹出面板搜索框
   * @property {boolean} headerMenuSortControl 弹出面板排序控制器
   * @property {boolean} headerMenuAutoRemoveControl 弹出面板自动移除控制器
   * @property {boolean} headerMenuFnSetting 弹出面板：设置
   * @property {boolean} headerMenuFnHistory 弹出面板：历史
   * @property {boolean} headerMenuFnExport 弹出面板：导出
   * @property {boolean} headerMenuFnBatchAdd 弹出面板：批量添加
   * @property {boolean} headerMenuFnRemoveAll 弹出面板：清空
   * @property {boolean} headerMenuFnRemoveWatched 弹出面板：移除已看
   * @property {boolean} headerMenuFnShowAll 弹出面板：显示
   * @property {boolean} headerMenuFnPlayAll 弹出面板：播放
   * @property {boolean} removeHistory 稍后再看移除记录
   * @property {removeHistorySavePoint} removeHistorySavePoint 保存稍后再看历史数据的时间点
   * @property {number} removeHistorySavePeriod 数据保存最小时间间隔
   * @property {number} removeHistoryFuzzyCompare 模糊比对深度
   * @property {number} removeHistorySaves 稍后再看历史数据记录保存数
   * @property {boolean} removeHistoryTimestamp 使用时间戳优化移除记录
   * @property {number} removeHistorySearchTimes 历史回溯深度
   * @property {boolean} batchAddLoadForward 批量添加：加载关注者转发的稿件
   * @property {boolean} batchAddUsingFavTime 批量添加：从收藏夹导入时使用「收藏时间」作为时间节点
   * @property {boolean} batchAddLoadAfterTimeSync 批量添加：执行时间同步后是否自动加载稿件
   * @property {string} batchAddManagerSnapshotPrefix 批量添加：文件快照前缀
   * @property {fillWatchlaterStatus} fillWatchlaterStatus 填充稍后再看状态
   * @property {boolean} searchDefaultValue 激活搜索框默认值功能
   * @property {autoSort} autoSort 自动排序
   * @property {boolean} videoButton 视频播放页稍后再看状态快速切换
   * @property {autoRemove} autoRemove 自动将稿件从播放列表移除
   * @property {boolean} redirect 稍后再看模式重定向至常规模式播放
   * @property {boolean} dynamicBatchAddManagerButton 动态主页批量添加管理器按钮
   * @property {number} autoReloadList 自动刷新列表页面
   * @property {openListVideo} openListVideo 列表页面稿件点击行为
   * @property {boolean} listStickControl 列表页面控制栏随页面滚动
   * @property {boolean} listSearch 列表页面搜索框
   * @property {boolean} listSortControl 列表页面排序控制器
   * @property {boolean} listAutoRemoveControl 列表页面自动移除控制器
   * @property {boolean} listExportWatchlaterListButton 列表页面列表导出按钮
   * @property {boolean} listBatchTransferButton 列表页面批量转移按钮
   * @property {boolean} listBatchAddManagerButton 列表页面批量添加管理器按钮
   * @property {boolean} removeButton_playAll 移除「全部播放」按钮
   * @property {boolean} removeButton_removeAll 移除「一键清空」按钮
   * @property {boolean} removeButton_removeWatched 移除「移除已观看视频」按钮
   * @property {boolean} headerCompatible 兼容第三方顶栏
   * @property {menuScrollbarSetting} menuScrollbarSetting 弹出面板的滚动条设置
   * @property {mainRunAt} mainRunAt 主要逻辑运行时期
   * @property {boolean} hideDisabledSubitems 设置页隐藏被禁用项的子项
   * @property {number} watchlaterListCacheValidPeriod 稍后再看列表数据本地缓存有效期（单位：秒）
   * @property {string} appendCookies 追加 Cookie（主要用于修复极个别用户 HttpOnly Cookie 没有被请求携带的问题）
   * @property {boolean} reloadAfterSetting 设置生效后刷新页面
   * @property {string} importWl_regex 稍后再看列表导入：正则表达式
   * @property {string} importWl_aid 稍后再看列表导入：捕获组/AID
   * @property {string} importWl_bvid 稍后再看列表导入：捕获组/BVID
   * @property {string} importWl_title 稍后再看列表导入：捕获组/标题
   * @property {string} importWl_source 稍后再看列表导入：捕获组/来源
   * @property {string} importWl_tsS 稍后再看列表导入：捕获组/时间节点（秒）
   * @property {string} importWl_tsMs 稍后再看列表导入：捕获组/时间节点（毫秒）
   */
  /**
   * @typedef {{[config: string]: GMObject_configMap_item}} GMObject_configMap
   */
  /**
   * @typedef GMObject_configMap_item
   * @property {*} default 默认值
   * @property {'string' | 'boolean' | 'int' | 'float'} [type] 数据类型
   * @property {'checked' | 'value' | 'none'} attr 对应 `DOM` 元素上的属性，`none` 表示无对应元素
   * @property {boolean} [manual] 配置保存时是否需要手动处理
   * @property {boolean} [needNotReload] 配置改变后是否不需要重新加载就能生效
   * @property {number} [min] 最小值
   * @property {number} [max] 最大值
   * @property {number} [configVersion] 涉及配置更改的最后配置版本
   */
  /**
   * @typedef {{[info: string]: GMObject_infoMap_item}} GMObject_infoMap
   */
  /**
   * @typedef GMObject_infoMap_item
   * @property {number} [configVersion] 涉及信息更改的最后配置版本
   */
  /**
   * @typedef GMObject_runtime
   * @property {'old' | '2022' | '3rd-party'} headerType 顶栏版本
   * @property {boolean} reloadWatchlaterListData 刷新稍后再看列表数据
   * @property {boolean} loadingWatchlaterListData 正在加载稍后再看列表数据
   * @property {*} watchlaterListDataError 稍后再看列表数据加载过程错误（无错误为 `null`）；发现错误时 `gm.data.watchlaterListData()` 将获取到旧列表数据
   * @property {boolean} savingRemoveHistoryData 正在存储稍后再看历史数据
   * @property {number} autoReloadListTid 列表页面自动刷新定时器 ID
   */
  /**
   * @callback removeHistoryData 通过懒加载方式获取稍后再看历史数据
   * @param {boolean} [remove] 是否将稍后再看历史数据移除
   * @returns {PushQueue<GMObject_data_item>} 稍后再看历史数据
   */
  /**
   * @callback watchlaterListData 通过懒加载方式获取稍后再看列表数据
   * @param {boolean} [reload] 是否重新加载稍后再看列表数据
   * @param {boolean} [pageCache=false] 是否使用页面缓存
   * @param {boolean} [localCache=true] 是否使用本地缓存
   * @returns {Promise<GMObject_data_item0[]>} 稍后再看列表数据
   */
  /**
   * `api_queryWatchlaterList` 返回数据中的稿件单元
   * @typedef GMObject_data_item0
   * @property {number} aid 稿件 AV 号，务必统一为字符串格式再使用
   * @property {string} bvid 稿件 BV 号
   * @property {string} title 稿件标题
   * @property {number} state 稿件状态
   * @property {string} [pic] 稿件封面
   * @property {Object} [owner] UP主信息
   * @property {number} [owner.mid] UP主 ID
   * @property {string} [owner.name] UP主名字
   * @property {number} [progress] 稿件播放进度
   * @property {number} [duration] 稿件时长
   * @property {number} [pubdate] 稿件发布时间
   * @property {number} [videos] 稿件分P数
   * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/history&toview/toview.md#获取稍后再看视频列表 获取稍后再看视频列表}
   */
  /**
   * @typedef {[bvid: string, title: string, lastModified: number]} GMObject_data_item
   * `bvid` 稿件 BV 号
   *
   * `title` 稿件标题
   *
   * `[lastModified]` 时间戳：最后被观察到的时间点
   */
  /**
   * @callback fixedItem 访问固定列表项
   * @param {string} id 项目标识
   * @param {boolean} [op] 不设置 - 只读；`true` - 添加；`false` - 移除
   * @returns {boolean} 访问后项目是否在固定列表项中
   */
  /**
   * @typedef GMObject_data
   * @property {removeHistoryData} removeHistoryData 稍后再看历史数据
   * @property {watchlaterListData} watchlaterListData 当前稍后再看列表数据
   * @property {fixedItem} fixedItem 固定列表项
   */
  /**
   * @callback page_userSpace
   * @param {string} [uid] `uid`
   * @returns {string} 用户空间 URL
   */
  /**
   * @typedef GMObject_url
   * @property {string} api_queryWatchlaterList 稍后再看列表数据
   * @property {string} api_addToWatchlater 将稿件添加至稍后再看
   * @property {string} api_removeFromWatchlater 将稿件从稍后再看移除
   * @property {string} api_clearWatchlater 清空稍后再看，要求 POST 一个含 `csrf` 的表单
   * @property {string} api_listFav 列出所有收藏夹
   * @property {string} api_dealFav 将稿件添加/移除至收藏夹
   * @property {string} api_favResourceList 获取收藏夹内容明细列表
   * @property {string} api_dynamicList 动态列表
   * @property {string} page_watchlaterList 列表页面
   * @property {string} page_videoNormalMode 常规播放页
   * @property {string} page_videoWatchlaterMode 稍后再看播放页
   * @property {string} page_listWatchlaterMode 列表播放页（稍后再看）
   * @property {string} page_watchlaterPlayAll 稍后再看播放全部（临时禁用重定向）
   * @property {string} page_dynamic 动态页
   * @property {page_userSpace} page_userSpace 用户空间
   * @property {string} gm_changelog 更新日志
   */
  /**
   * @typedef GMObject_regex
   * @property {RegExp} page_watchlaterList 匹配列表页面
   * @property {RegExp} page_videoNormalMode 匹配常规播放页
   * @property {RegExp} page_videoWatchlaterMode 匹配稍后再看播放页
   * @property {RegExp} page_listMode 匹配列表播放页
   * @property {RegExp} page_listWatchlaterMode 匹配列表播放页（稍后再看）
   * @property {RegExp} page_dynamic 匹配动态页面
   * @property {RegExp} page_dynamicMenu 匹配旧版动态面板
   * @property {RegExp} page_userSpace 匹配用户空间
   * @property {RegExp} page_search 匹配搜索页面
   */
  /**
   * @typedef GMObject_panel
   * @property {GMObject_panel_item} setting 设置
   * @property {GMObject_panel_item} history 移除记录
   * @property {GMObject_panel_item} batchAddManager 批量添加管理器
   * @property {GMObject_panel_item} entryPopup 入口弹出面板
   */
  /**
   * @typedef GMObject_panel_item
   * @property {0 | 1 | 2 | 3 | -1} state 打开状态（关闭 | 开启中 | 打开 | 关闭中 | 错误）
   * @property {0 | 1 | 2} wait 等待阻塞状态（无等待阻塞 | 等待开启 | 等待关闭）
   * @property {HTMLElement} el 面板元素
   * @property {() => (void | Promise<void>)} [openHandler] 打开面板的回调函数
   * @property {() => (void | Promise<void>)} [closeHandler] 关闭面板的回调函数
   * @property {() => void} [openedHandler] 彻底打开面板后的回调函数
   * @property {() => void} [closedHandler] 彻底关闭面板后的回调函数
   */
  /**
   * 全局对象
   * @type {GMObject}
   */
  const gm = {
    id: gmId,
    configVersion: GM_getValue('configVersion'),
    configUpdate: 20240522,
    searchParams: new URL(location.href).searchParams,
    config: {},
    configMap: {
      headerButton: { default: true, attr: 'checked' },
      headerButtonOpL: { default: Enums.headerButtonOp.openListInCurrent, attr: 'value', configVersion: 20221008 },
      headerButtonOpR: { default: Enums.headerButtonOp.openUserSetting, attr: 'value', configVersion: 20221008 },
      headerButtonOpM: { default: Enums.headerButtonOp.openListInNew, attr: 'value', configVersion: 20221008 },
      headerMenu: { default: Enums.headerMenu.enable, attr: 'value', configVersion: 20210706 },
      openHeaderMenuLink: { default: Enums.openHeaderMenuLink.openInCurrent, attr: 'value', configVersion: 20200717 },
      headerMenuKeepRemoved: { default: true, attr: 'checked', needNotReload: true, configVersion: 20210724 },
      headerMenuSearch: { default: true, attr: 'checked', configVersion: 20210323.1 },
      headerMenuSortControl: { default: true, attr: 'checked', configVersion: 20210810 },
      headerMenuAutoRemoveControl: { default: true, attr: 'checked', configVersion: 20210723 },
      headerMenuFnSetting: { default: true, attr: 'checked', configVersion: 20210322 },
      headerMenuFnHistory: { default: true, attr: 'checked', configVersion: 20210322 },
      headerMenuFnExport: { default: false, attr: 'checked', configVersion: 20221008 },
      headerMenuFnBatchAdd: { default: false, attr: 'checked', configVersion: 20221008 },
      headerMenuFnRemoveAll: { default: false, attr: 'checked', configVersion: 20210322 },
      headerMenuFnRemoveWatched: { default: false, attr: 'checked', configVersion: 20210723 },
      headerMenuFnShowAll: { default: false, attr: 'checked', configVersion: 20210322 },
      headerMenuFnPlayAll: { default: true, attr: 'checked', configVersion: 20210322 },
      removeHistory: { default: true, attr: 'checked', manual: true, configVersion: 20210911 },
      removeHistorySavePoint: { default: Enums.removeHistorySavePoint.listAndMenu, attr: 'value', configVersion: 20210628 },
      removeHistorySavePeriod: { default: 60, type: 'int', attr: 'value', max: 600, needNotReload: true, configVersion: 20210908 },
      removeHistoryFuzzyCompare: { default: 1, type: 'int', attr: 'value', max: 5, needNotReload: true, configVersion: 20210722 },
      removeHistorySaves: { default: 500, type: 'int', attr: 'value', manual: true, needNotReload: true, min: 10, max: 1500, configVersion: 20240522 },
      removeHistoryTimestamp: { default: true, attr: 'checked', needNotReload: true, configVersion: 20210703 },
      removeHistorySearchTimes: { default: 500, type: 'int', attr: 'value', manual: true, needNotReload: true, min: 1, max: 1500, configVersion: 20240522 },
      batchAddLoadForward: { default: true, attr: 'checked', configVersion: 20220607, needNotReload: true },
      batchAddUsingFavTime: { default: true, attr: 'checked', configVersion: 20230422.1, needNotReload: true },
      batchAddLoadAfterTimeSync: { default: true, attr: 'checked', configVersion: 20220513, needNotReload: true },
      batchAddManagerSnapshotPrefix: { default: 'bwpBAM-snapshot', attr: 'value', configVersion: 20230422, needNotReload: true },
      fillWatchlaterStatus: { default: Enums.fillWatchlaterStatus.dynamic, attr: 'value', configVersion: 20200819 },
      searchDefaultValue: { default: true, attr: 'checked', configVersion: 20220606 },
      autoSort: { default: Enums.autoSort.auto, attr: 'value', configVersion: 20220115 },
      videoButton: { default: true, attr: 'checked' },
      autoRemove: { default: Enums.autoRemove.openFromList, attr: 'value', configVersion: 20210612 },
      redirect: { default: false, attr: 'checked', configVersion: 20210322.1 },
      dynamicBatchAddManagerButton: { default: true, attr: 'checked', configVersion: 20210902 },
      autoReloadList: { default: 0, type: 'int', attr: 'value', min: 5, max: 600, configVersion: 20220710 },
      openListVideo: { default: Enums.openListVideo.openInCurrent, attr: 'value', configVersion: 20200717 },
      listStickControl: { default: true, attr: 'checked', configVersion: 20220410 },
      listSearch: { default: true, attr: 'checked', configVersion: 20210810.1 },
      listSortControl: { default: true, attr: 'checked', configVersion: 20210810 },
      listAutoRemoveControl: { default: true, attr: 'checked', configVersion: 20210908 },
      listExportWatchlaterListButton: { default: true, attr: 'checked', configVersion: 20221008 },
      listBatchTransferButton: { default: true, attr: 'checked', configVersion: 20231127 },
      listBatchAddManagerButton: { default: true, attr: 'checked', configVersion: 20210908 },
      removeButton_playAll: { default: false, attr: 'checked', configVersion: 20221008 },
      removeButton_removeAll: { default: false, attr: 'checked', configVersion: 20200722 },
      removeButton_removeWatched: { default: false, attr: 'checked', configVersion: 20200722 },
      headerCompatible: { default: Enums.headerCompatible.none, attr: 'value', configVersion: 20220410 },
      menuScrollbarSetting: { default: Enums.menuScrollbarSetting.beautify, attr: 'value', configVersion: 20210808.1 },
      mainRunAt: { default: Enums.mainRunAt.DOMContentLoaded, attr: 'value', needNotReload: true, configVersion: 20210726 },
      watchlaterListCacheValidPeriod: { default: 15, type: 'int', attr: 'value', needNotReload: true, min: 8, max: 600, configVersion: 20210908 },
      appendCookies: { default: '', type: 'string', attr: 'value', configVersion: 20240522 },
      hideDisabledSubitems: { default: true, attr: 'checked', configVersion: 20210505 },
      reloadAfterSetting: { default: true, attr: 'checked', needNotReload: true, configVersion: 20200715 },

      importWl_regex: { default: 'bv[\\dA-Za-z]{10}', attr: 'none', configVersion: 20230419 },
      importWl_aid: { default: -1, type: 'int', attr: 'none', configVersion: 20230419 },
      importWl_bvid: { default: 0, type: 'int', attr: 'none', configVersion: 20230419 },
      importWl_title: { default: -1, type: 'int', attr: 'none', configVersion: 20230419 },
      importWl_source: { default: -1, type: 'int', attr: 'none', configVersion: 20230419 },
      importWl_tsS: { default: -1, type: 'int', attr: 'none', configVersion: 20230419 },
      importWl_tsMs: { default: -1, type: 'int', attr: 'none', configVersion: 20230419 },
    },
    infoMap: {
      clearRemoveHistoryData: {},
      watchlaterMediaList: { configVersion: 20231127 },
      exportWatchlaterList: { configVersion: 20221008 },
      importWatchlaterList: { configVersion: 20230419 },
    },
    runtime: {},
    configDocumentStart: ['redirect', 'menuScrollbarSetting', 'mainRunAt', 'appendCookies'],
    data: {},
    url: {
      api_queryWatchlaterList: 'https://api.bilibili.com/x/v2/history/toview',
      api_addToWatchlater: 'https://api.bilibili.com/x/v2/history/toview/add',
      api_removeFromWatchlater: 'https://api.bilibili.com/x/v2/history/toview/del',
      api_clearWatchlater: 'https://api.bilibili.com/x/v2/history/toview/clear',
      api_listFav: 'https://api.bilibili.com/x/v3/fav/folder/created/list-all',
      api_favResourceList: 'https://api.bilibili.com/x/v3/fav/resource/list',
      api_dealFav: 'https://api.bilibili.com/x/v3/fav/resource/deal',
      api_dynamicList: 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all',
      page_watchlaterList: 'https://www.bilibili.com/watchlater/#/list',
      page_videoNormalMode: 'https://www.bilibili.com/video',
      page_videoWatchlaterMode: 'https://www.bilibili.com/medialist/play/watchlater',
      page_listWatchlaterMode: 'https://www.bilibili.com/list/watchlater',
      page_watchlaterPlayAll: `https://www.bilibili.com/list/watchlater?${gmId}_disable_redirect=true`,
      page_dynamic: 'https://t.bilibili.com',
      page_userSpace: uid => `https://space.bilibili.com/${uid}`,
      gm_changelog: 'https://gitee.com/liangjiancang/userscript/blob/master/script/BilibiliWatchlaterPlus/changelog.md',
    },
    regex: {
      // 只要第一个「#」后是「/list([/?#]|$)」即被视为列表页面
      // B站并不会将「#/list」之后的「[/?#]」视为锚点的一部分，这不符合 URL 规范，但只能将错就错了
      page_watchlaterList: /\.com\/watchlater\/[^#]*#\/list([#/?]|$)/,
      page_videoNormalMode: /\.com\/video([#/?]|$)/,
      page_videoWatchlaterMode: /\.com\/medialist\/play\/(watchlater|ml\d+)([#/?]|$)/,
      page_listMode: /\.com\/list\/.+/,
      page_listWatchlaterMode: /\.com\/list\/watchlater([#/?]|$)/,
      page_dynamic: /\/t\.bilibili\.com(\/|$)/,
      page_dynamicMenu: /\.com\/pages\/nav\/index_new([#/?]|$)/,
      page_userSpace: /space\.bilibili\.com([#/?]|$)/,
      page_search: /search\.bilibili\.com\/.+/, // 不含搜索主页
    },
    const: {
      fadeTime: 400,
      textFadeTime: 100,
      noticeTimeout: 5600,
      updateHighlightColor: '#4cff9c',
      inputThrottleWait: 250,
      batchAddRequestInterval: 350,
      fixerHint: '固定在列表最后，并禁用自动移除及排序功能\n右键点击可取消所有固定项',
      searchDefaultValueHint: '右键点击保存默认值，中键点击清空默认值\n当前默认值：$1',
      exportWatchlaterList_default: '导出至剪贴板 = 是\n导出至新页面 = 否\n导出至文件 = 否\n稿件导出模板 = \'https://www.bilibili.com/video/${ITEM.bvid}\'',
    },
    panel: {
      setting: { state: 0, wait: 0, el: null },
      history: { state: 0, wait: 0, el: null },
      batchAddManager: { state: 0, wait: 0, el: null },
      entryPopup: { state: 0, wait: 0, el: null },
    },
    el: {
      gmRoot: null,
      setting: null,
      history: null,
    },
  }

  const api = new UserscriptAPI({
    id: gm.id,
    label: GM_info.script.name,
    fadeTime: gm.const.fadeTime,
  })

  /** @type {Script} */
  let script = null
  /** @type {Webpage} */
  let webpage = null

  /**
   * 脚本运行的抽象，为脚本本身服务的核心功能
   */
  class Script {
    /** 内部数据 */
    #data = {}

    /** 通用方法 */
    method = {
      /**
       * GM 读取流程
       *
       * 一般情况下，读取用户配置；如果配置出错，则沿用默认值，并将默认值写入配置中
       * @param {string} gmKey 键名
       * @param {*} defaultValue 默认值
       * @param {boolean} [writeback=true] 配置出错时是否将默认值回写入配置中
       * @returns {*} 通过校验时是配置值，不能通过校验时是默认值
       */
      getConfig(gmKey, defaultValue, writeback = true) {
        let invalid = false
        let value = GM_getValue(gmKey)
        if (Enums && gmKey in Enums) {
          if (!Object.values(Enums[gmKey]).includes(value)) {
            invalid = true
          }
        } else if (typeof value === typeof defaultValue) { // 对象默认赋 null 无需额外处理
          const { type } = gm.configMap[gmKey]
          if (type === 'int' || type === 'float') {
            invalid = gm.configMap[gmKey].min > value || gm.configMap[gmKey].max < value
          }
        } else {
          invalid = true
        }
        if (invalid) {
          value = defaultValue
          writeback && GM_setValue(gmKey, value)
        }
        return value
      },

      /**
       * 重置脚本
       */
      reset() {
        const gmKeys = GM_listValues()
        for (const gmKey of gmKeys) {
          GM_deleteValue(gmKey)
        }
      },
    }

    /**
     * document-start 级别初始化
     */
    initAtDocumentStart() {
      if (gm.configVersion > 0) {
        for (const name of gm.configDocumentStart) {
          gm.config[name] = this.method.getConfig(name, gm.configMap[name].default)
        }
      }

      // 追加 Cookie
      if (gm.config.appendCookies !== '') {
        api.options.web.preproc = async details => {
          if (new URL(details.url).host === 'api.bilibili.com') {
            if (!gm.runtime.appendCookies) {
              if (gm.config.appendCookies === 'SESSDATA') {
                try {
                  gm.runtime.appendCookies = `SESSDATA=${(await GM.cookie.list({ name: 'SESSDATA' }))[0].value}`
                } catch (e) {
                  api.message.alert('当前脚本管理器不支持 <code>GM.cookie</code> API。若要使用自动追加 <code>SESSDATA</code> Cookie 功能必须使用支持该 API 的脚本管理器（如 Tampermonkey BETA 版本）。', { html: true })
                  throw e
                }
              } else {
                gm.runtime.appendCookies = gm.config.appendCookies
              }
            }
            if (details.cookie && details.cookie.trim() !== '') {
              details.cookie = `${gm.runtime.appendCookies};${details.cookie}`
            } else {
              details.cookie = gm.runtime.appendCookies
            }
          }
        }
      }
    }

    /**
     * 初始化
     */
    init() {
      try {
        this.initGMObject()
        this.updateVersion()
        this.readConfig()

        if (self === top) {
          if (gm.config.searchDefaultValue) {
            GM_addValueChangeListener('searchDefaultValue_value', (name, oldVal, newVal) => window.dispatchEvent(new CustomEvent('updateSearchTitle', { detail: { value: newVal } })))
          }
        }
      } catch (e) {
        api.logger.error(e)
        api.message.confirm('初始化错误！是否彻底清空内部数据以重置脚本？').then(result => {
          if (result) {
            this.method.reset()
            location.reload()
          }
        })
      }
    }

    /**
     * 初始化全局对象
     */
    initGMObject() {
      gm.data = {
        ...gm.data,
        removeHistoryData: remove => {
          const $data = this.#data
          if (remove) {
            $data.removeHistoryData = undefined
            return
          }
          if ($data.removeHistoryData == null) {
            /** @type {PushQueue<GMObject_data_item>} */
            let data = GM_getValue('removeHistoryData')
            if (data && typeof data === 'object') {
              Reflect.setPrototypeOf(data, PushQueue.prototype) // 初始化替换原型不会影响内联缓存
              if (data.maxSize !== gm.config.removeHistorySaves) {
                data.setMaxSize(gm.config.removeHistorySaves)
                GM_setValue('removeHistoryData', data)
              }
            } else {
              data = new PushQueue(gm.config.removeHistorySaves)
              GM_setValue('removeHistoryData', data)
            }
            $data.removeHistoryData = data
          }
          return $data.removeHistoryData
        },
        watchlaterListData: async (reload, pageCache, localCache = true) => {
          const $data = this.#data
          gm.runtime.watchlaterListDataError = null
          if (gm.runtime.reloadWatchlaterListData) {
            reload = true
            gm.runtime.reloadWatchlaterListData = false
          }
          if ($data.watchlaterListData == null || reload || !pageCache) {
            if (gm.runtime.loadingWatchlaterListData) {
              // 一旦数据已在加载中，那么直接等待该次加载完成
              // 无论加载成功与否，所有被阻塞的数据请求均都使用该次加载的结果，完全保持一致
              // 注意：加载失败时，返回的空数组并非同一对象
              try {
                return await api.wait.waitForConditionPassed({
                  condition: () => {
                    if (!gm.runtime.loadingWatchlaterListData) {
                      return $data.watchlaterListData ?? []
                    }
                  },
                })
              } catch (e) {
                gm.runtime.watchlaterListDataError = e
                gm.runtime.loadingWatchlaterListData = false
                api.logger.error(e)
                return $data.watchlaterListData ?? []
              }
            }

            if (!reload && localCache && gm.config.watchlaterListCacheValidPeriod > 0) {
              const cacheTime = GM_getValue('watchlaterListCacheTime')
              if (cacheTime) {
                const current = Date.now()
                if (current - cacheTime < gm.config.watchlaterListCacheValidPeriod * 1000) {
                  const list = GM_getValue('watchlaterListCache')
                  if (list) {
                    $data.watchlaterListData = list
                    return list // 默认缓存不为空
                  }
                }
              }
            }

            gm.runtime.loadingWatchlaterListData = true
            try {
              const resp = await api.web.request({
                url: gm.url.api_queryWatchlaterList,
              }, { check: r => r.code === 0 })
              const current = resp.data.list ?? []
              if (gm.config.watchlaterListCacheValidPeriod > 0) {
                GM_setValue('watchlaterListCacheTime', Date.now())
                GM_setValue('watchlaterListCache', current.map(item => ({
                  aid: item.aid,
                  bvid: item.bvid,
                  title: item.title,
                  state: item.state,
                  pic: item.pic,
                  owner: {
                    mid: item.owner.mid,
                    name: item.owner.name,
                  },
                  progress: item.progress,
                  duration: item.duration,
                  pubdate: item.pubdate,
                  videos: item.videos,
                })))
              }
              $data.watchlaterListData = current
              return current
            } catch (e) {
              api.logger.error(e)
              gm.runtime.watchlaterListDataError = e
              return $data.watchlaterListData ?? []
            } finally {
              gm.runtime.loadingWatchlaterListData = false
            }
          } else {
            return $data.watchlaterListData
          }
        },
        fixedItem: (id, op) => {
          const uid = webpage.method.getDedeUserID()
          const items = GM_getValue(`fixedItems_${uid}`) ?? []
          const idx = items.indexOf(id)
          const fixed = idx >= 0
          if (op == null) return fixed
          if (op) {
            if (!fixed) {
              items.push(id)
              GM_setValue(`fixedItems_${uid}`, items)
            }
            return true
          } else {
            if (fixed) {
              items.splice(idx, 1)
              GM_setValue(`fixedItems_${uid}`, items)
            }
            return false
          }
        },
      }

      gm.el.gmRoot = document.createElement('div')
      gm.el.gmRoot.id = gm.id
      api.wait.executeAfterElementLoaded({ // body 已存在时无异步
        selector: 'body',
        callback: body => body.append(gm.el.gmRoot),
      })
    }

    /**
     * 版本更新处理
     */
    updateVersion() {
      if (gm.configVersion >= 20220513) { // 4.26.13.20220513 最旧保留版本
        if (gm.configVersion < gm.configUpdate) {
          // 必须按从旧到新的顺序写
          // 内部不能使用 gm.configUpdate，必须手写更新后的配置版本号！

          // 4.26.13.20220513
          if (gm.configVersion < 20220513) {
            GM_deleteValue('batchAddLoadAfterTimeSync')
          }

          // 4.27.0.20220605
          if (gm.configVersion < 20220605) {
            const bp = GM_getValue('batchParams')
            if (bp && (!bp.id4a || Number.parseInt(bp.id4a) < 350)) {
              bp.id4a = '350'
              GM_setValue('batchParams', bp)
            }
          }

          // 4.34.0.20231127
          if (gm.configVersion < 20231127) {
            const items = GM_getValue('fixedItems')
            if (items) {
              const uid = webpage.method.getDedeUserID()
              GM_setValue(`fixedItems_${uid}`, items)
              GM_deleteValue('fixedItems')
            }
          }

          // 4.36.0.20240522
          if (gm.configVersion < 20240522) {
            GM_deleteValue('removeHistorySaves')
            GM_deleteValue('removeHistorySearchTimes')
          }

          // 功能性更新后更新此处配置版本，通过时跳过功能性更新设置，否则转至 readConfig() 中处理
          if (gm.configVersion >= 20240522) {
            gm.configVersion = gm.configUpdate
            GM_setValue('configVersion', gm.configVersion)
          }
        }
      } else {
        this.method.reset()
        gm.configVersion = null
      }
    }

    /**
     * 用户配置读取
     */
    readConfig() {
      if (gm.configVersion > 0) {
        for (const [name, item] of Object.entries(gm.configMap)) {
          if (!gm.configDocumentStart.includes(name)) {
            gm.config[name] = this.method.getConfig(name, item.default)
          }
        }
        if (gm.configVersion !== gm.configUpdate) {
          this.openUserSetting(2)
        }
      } else {
        // 用户强制初始化，或第一次安装脚本，或版本过旧
        gm.configVersion = 0
        for (const [name, item] of Object.entries(gm.configMap)) {
          gm.config[name] = item.default
          GM_setValue(name, item.default)
        }
        this.openUserSetting(1)
      }
    }

    /**
     * 添加脚本菜单
     */
    addScriptMenu() {
      // 用户配置设置
      GM_registerMenuCommand('用户设置', () => this.openUserSetting())
      // 批量添加管理器
      GM_registerMenuCommand('批量添加管理器', () => this.openBatchAddManager())
      if (gm.config.removeHistory) {
        // 稍后再看移除记录
        GM_registerMenuCommand('稍后再看移除记录', () => this.openRemoveHistory())
      }
      GM_registerMenuCommand('导出稍后再看列表', () => this.exportWatchlaterList())
      // 强制初始化
      GM_registerMenuCommand('初始化脚本', () => this.resetScript())
    }

    /**
     * 打开用户设置
     * @param {number} [type=0] 常规 `0` | 初始化 `1` | 功能性更新 `2`
     */
    openUserSetting(type = 0) {
      if (gm.el.setting) {
        this.openPanelItem('setting')
      } else {
        /** @type {{[n: string]: HTMLElement}} */
        const el = {}
        setTimeout(() => {
          initSetting()
          processConfigItem()
          processSettingItem()
          this.openPanelItem('setting')
        })

        /**
         * 设置页初始化
         */
        const initSetting = () => {
          gm.el.setting = gm.el.gmRoot.appendChild(document.createElement('div'))
          gm.panel.setting.el = gm.el.setting
          gm.el.setting.className = 'gm-setting gm-modal-container'
          if (gm.config.hideDisabledSubitems) {
            gm.el.setting.classList.add('gm-hideDisabledSubitems')
          }

          const getItemHTML = (label, ...items) => {
            let html = `<div class="gm-item-container"><div class="gm-item-label">${label}</div><div class="gm-item-content">`
            for (const item of items) {
              html += `<div class="gm-item${item.className ? ` ${item.className}` : ''}"${item.desc ? ` title="${item.desc}"` : ''}>${item.html}</div>`
            }
            html += '</div></div>'
            return html
          }
          let itemsHTML = ''
          itemsHTML += getItemHTML('全局功能', {
            desc: '在顶栏「动态」和「收藏」之间加入稍后再看入口，鼠标移至上方时弹出列表面板，支持点击功能设置。',
            html: `<label>
              <span>顶栏稍后再看入口</span>
              <input id="gm-headerButton" type="checkbox">
            </label>`,
          }, {
            desc: '选择左键点击入口时执行的操作。',
            html: `<div>
              <span>在入口上点击鼠标左键时</span>
              <select id="gm-headerButtonOpL"></select>
            </div>`,
          }, {
            desc: '选择右键点击入口时执行的操作。',
            html: `<div>
              <span>在入口上点击鼠标右键时</span>
              <select id="gm-headerButtonOpR"></select>
            </div>`,
          }, {
            desc: '选择中键点击入口时执行的操作。',
            html: `<div>
              <span>在入口上点击鼠标中键时</span>
              <select id="gm-headerButtonOpM"></select>
            </div>`,
          }, {
            desc: '设置入口弹出面板。',
            html: `<div>
              <span>将鼠标移动至入口上方时</span>
              <select id="gm-headerMenu">
                <option value="${Enums.headerMenu.enable}">弹出稍后再看列表</option>
                <option value="${Enums.headerMenu.enableSimple}">弹出简化的稍后再看列表</option>
                <option value="${Enums.headerMenu.disable}">不执行操作</option>
              </select>
            </div>`,
          }, {
            desc: '选择在弹出面板中点击链接的行为。',
            html: `<div>
              <span>在弹出面板中点击链接时</span>
              <select id="gm-openHeaderMenuLink">
                <option value="${Enums.openHeaderMenuLink.openInCurrent}">在当前页面打开稿件</option>
                <option value="${Enums.openHeaderMenuLink.openInNew}">在新页面打开稿件</option>
              </select>
            </div>`,
          }, {
            desc: '在弹出面板中显示自当前页面打开以来从弹出面板移除的稿件。',
            html: `<label>
              <span>在弹出面板中显示被移除的稿件</span>
              <input id="gm-headerMenuKeepRemoved" type="checkbox">
            </label>`,
          }, {
            desc: '在弹出面板顶部显示搜索框。',
            html: `<label>
              <span>在弹出面板顶部显示搜索框</span>
              <input id="gm-headerMenuSearch" type="checkbox">
            </label>`,
          }, {
            desc: '在弹出面板底部显示排序控制器。',
            html: `<label>
              <span>在弹出面板底部显示排序控制器</span>
              <input id="gm-headerMenuSortControl" type="checkbox">
            </label>`,
          }, {
            desc: '在弹出面板底部显示自动移除控制器。',
            html: `<label>
              <span>在弹出面板底部显示自动移除控制器</span>
              <input id="gm-headerMenuAutoRemoveControl" type="checkbox">
            </label>`,
          }, {
            desc: '设置在弹出列表显示的快捷功能。',
            html: `<div>
              <span>在弹出面板底部显示：</span>
              <span class="gm-lineitems">
                <label class="gm-lineitem">
                  <span>设置</span><input id="gm-headerMenuFnSetting" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>历史</span><input id="gm-headerMenuFnHistory" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>导出</span><input id="gm-headerMenuFnExport" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>批量添加</span><input id="gm-headerMenuFnBatchAdd" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>清空</span><input id="gm-headerMenuFnRemoveAll" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>移除已看</span><input id="gm-headerMenuFnRemoveWatched" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>显示</span><input id="gm-headerMenuFnShowAll" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>播放</span><input id="gm-headerMenuFnPlayAll" type="checkbox">
                </label>
              </span>
            </div>`,
          })
          itemsHTML += getItemHTML('全局功能', {
            desc: '保留稍后再看列表中的数据，以查找出一段时间内将哪些稿件移除出稍后再看，用于拯救误删操作。关闭该选项会将内部历史数据清除！',
            html: `<label>
              <span>稍后再看移除记录</span>
              <input id="gm-removeHistory" type="checkbox">
              <span id="gm-rhWarning" class="gm-warning" title>⚠</span>
            </label>`,
          }, {
            desc: '选择在何时保存稍后再看历史数据。',
            html: `<div>
              <span>为生成移除记录，</span>
              <select id="gm-removeHistorySavePoint">
                <option value="${Enums.removeHistorySavePoint.list}">在打开列表页面时保存数据</option>
                <option value="${Enums.removeHistorySavePoint.listAndMenu}">在打开列表页面或弹出面板时保存数据</option>
                <option value="${Enums.removeHistorySavePoint.anypage}">在打开任意相关页面时保存数据</option>
              </select>
            </div>`,
          }, {
            desc: '距离上一次保存稍后再看历史数据间隔超过该时间，才会再次进行保存。',
            html: `<div>
              <span>数据保存最小时间间隔（单位：秒）</span>
              <input is="laster2800-input-number" id="gm-removeHistorySavePeriod" value="${gm.configMap.removeHistorySavePeriod.default}" max="${gm.configMap.removeHistorySavePeriod.max}">
            </div>`,
          }, {
            desc: '设置模糊比对深度以快速舍弃重复数据从而降低开销，但可能会造成部分记录遗漏。',
            html: `<div>
              <span>模糊比对模式深度</span>
              <span id="gm-rhfcInformation" class="gm-information" title>💬</span>
              <input is="laster2800-input-number" id="gm-removeHistoryFuzzyCompare" value="${gm.configMap.removeHistoryFuzzyCompare.default}" max="${gm.configMap.removeHistoryFuzzyCompare.max}">
            </div>`,
          }, {
            desc: '较大的数值可能会带来较大的开销（具体参考右侧弹出说明）。将该项修改为比原来小的值会清理过期数据，无法恢复！',
            html: `<div>
              <span>不重复数据记录保存数</span>
              <span id="gm-rhsInformation" class="gm-information" title>💬</span>
              <span id="gm-clearRemoveHistoryData" class="gm-info" title="清理已保存的稍后再看历史数据，不可恢复！">清空数据(0条)</span>
              <input is="laster2800-input-number" id="gm-removeHistorySaves" value="${gm.configMap.removeHistorySaves.default}" min="${gm.configMap.removeHistorySaves.min}" max="${gm.configMap.removeHistorySaves.max}">
            </div>`,
          }, {
            desc: '在稍后再看历史数据记录中保存时间戳，以其优化对数据记录的排序及展示。',
            html: `<label>
              <span>使用时间戳优化移除记录</span>
              <span id="gm-rhtInformation" class="gm-information" title>💬</span>
              <input id="gm-removeHistoryTimestamp" type="checkbox">
            </label>`,
          }, {
            desc: '搜寻时在最近多少条数据记录中查找，设置较小的值能较好地定位最近被添加到稍后再看的稿件。',
            html: `<div>
              <span>默认历史回溯深度</span>
              <input is="laster2800-input-number" id="gm-removeHistorySearchTimes" value="${gm.configMap.removeHistorySearchTimes.default}" min="${gm.configMap.removeHistorySearchTimes.min}" max="${gm.configMap.removeHistorySearchTimes.max}">
            </div>`,
          })
          itemsHTML += getItemHTML('全局功能', {
            html: '<div class="gm-holder-item">批量添加：</div>',
          }, {
            desc: '在批量添加管理器中，执行加载步骤时是否加载关注者转发的稿件？',
            html: `<label>
              <span>加载关注者转发的稿件</span>
              <input id="gm-batchAddLoadForward" type="checkbox">
            </label>`,
          }, {
            desc: '在批量添加管理器中，从收藏夹导入时使用「收藏时间」而非「稿件发布时间」作为时间节点。\n时间节点被用于在步骤 ② 中判断稿件是否超出设定的时间范围。',
            html: `<label>
              <span>从收藏夹导入时使用「收藏时间」作为时间节点</span>
              <input id="gm-batchAddUsingFavTime" type="checkbox">
            </label>`,
          }, {
            desc: '在批量添加管理器中，执行时间同步后，是否自动执行稿件加载步骤？',
            html: `<label>
              <span>执行时间同步后是否自动加载稿件</span>
              <span id="gm-balatsInformation" class="gm-information" title>💬</span>
              <input id="gm-batchAddLoadAfterTimeSync" type="checkbox">
            </label>`,
          }, {
            desc: '设置批量添加管理器快照文件名称前缀。',
            html: `<label>
              <span>文件快照前缀：</span>
              <input id="gm-batchAddManagerSnapshotPrefix" type="text">
            </label>`,
          })
          itemsHTML += getItemHTML('全局功能', {
            desc: '填充默认情况下缺失的稍后再看状态信息。',
            html: `<div>
              <span>填充缺失的稍后再看状态信息：</span>
              <select id="gm-fillWatchlaterStatus">
                <option value="${Enums.fillWatchlaterStatus.dynamic}">仅动态页面</option>
                <option value="${Enums.fillWatchlaterStatus.dynamicAndVideo}">仅动态和视频播放页面</option>
                <option value="${Enums.fillWatchlaterStatus.anypage}">所有页面</option>
                <option value="${Enums.fillWatchlaterStatus.never}">禁用功能</option>
              </select>
              <span id="gm-fwsInformation" class="gm-information" title>💬</span>
            </div>`,
          })
          itemsHTML += getItemHTML('全局功能', {
            desc: '激活后在搜索框上右键点击保存默认值，中键点击清空默认值。',
            html: `<label>
              <span>搜索：激活搜索框默认值功能</span>
              <span id="gm-sdvInformation" class="gm-information" title>💬</span>
              <input id="gm-searchDefaultValue" type="checkbox">
            </label>`,
          })
          itemsHTML += getItemHTML('全局功能', {
            desc: '决定首次打开列表页面或弹出面板时，如何对稍后再看列表内容进行排序。',
            html: `<div>
              <span>自动排序：</span>
              <select id="gm-autoSort">
                <option value="${Enums.autoSort.auto}">使用上一次排序控制器的选择</option>
                <option value="${Enums.autoSort.default}">禁用功能</option>
                <option value="${Enums.autoSort.defaultR}">使用 [ 默认↓ ] 排序</option>
                <option value="${Enums.autoSort.duration}">使用 [ 时长 ] 排序</option>
                <option value="${Enums.autoSort.durationR}">使用 [ 时长↓ ] 排序</option>
                <option value="${Enums.autoSort.pubtime}">使用 [ 发布 ] 排序</option>
                <option value="${Enums.autoSort.pubtimeR}">使用 [ 发布↓ ] 排序</option>
                <option value="${Enums.autoSort.progress}">使用 [ 进度 ] 排序</option>
                <option value="${Enums.autoSort.uploader}">使用 [ UP主 ] 排序</option>
                <option value="${Enums.autoSort.title}">使用 [ 标题 ] 排序</option>
                <option value="${Enums.autoSort.fixed}">使用 [ 固定 ] 排序</option>
              </select>
            </div>`,
          })
          itemsHTML += getItemHTML('全局功能', {
            desc: '指定使用批量转移及收藏功能时，将稿件从稍后再看移动至哪个收藏夹。',
            html: `<div>
              <span>稍后再看收藏夹</span>
              <span id="gm-watchlaterMediaList" class="gm-info">设置</span>
            </div>`,
          })
          itemsHTML += getItemHTML('全局功能', {
            desc: '设置稍后再看列表导出方式。',
            html: `<div>
              <span>导出稍后再看列表</span>
              <span id="gm-exportWatchlaterList" class="gm-info">设置</span>
            </div>`,
          }, {
            desc: '设置稍后再看列表导入方式。该功能入口在批量添加管理器中。',
            html: `<div>
              <span>导入稍后再看列表</span>
              <span id="gm-importWatchlaterList" class="gm-info">设置</span>
              <span id="gm-iwlInformation" class="gm-information" title>💬</span>
            </div>`,
          })
          itemsHTML += getItemHTML('播放页面', {
            desc: '在播放页面中加入能将稿件快速添加或移除出稍后再看列表的按钮。',
            html: `<label>
              <span>加入快速切换稿件稍后再看状态的按钮</span>
              <input id="gm-videoButton" type="checkbox">
            </label>`,
          })
          itemsHTML += getItemHTML('播放页面', {
            desc: '打开播放页面时，自动将稿件从稍后再看列表中移除，或在特定条件下执行自动移除。',
            html: `<div>
              <span>打开页面时，</span>
              <select id="gm-autoRemove">
                <option value="${Enums.autoRemove.always}">若稿件在稍后再看中，则移除出稍后再看</option>
                <option value="${Enums.autoRemove.openFromList}">若是从列表页面或弹出面板点击进入，则移除出稍后再看</option>
                <option value="${Enums.autoRemove.never}">不执行自动移除功能（可通过自动移除控制器临时开启）</option>
                <option value="${Enums.autoRemove.absoluteNever}">彻底禁用自动移除功能</option>
              </select>
            </div>`,
          })
          itemsHTML += getItemHTML('播放页面', {
            desc: `打开「${gm.url.page_listWatchlaterMode}」或「${gm.url.page_videoWatchlaterMode}」页面时，自动切换至「${gm.url.page_videoNormalMode}」页面进行播放，但不影响「播放全部」等相关功能。`,
            html: `<label>
              <span>从稍后再看模式强制切换到常规模式播放（重定向）</span>
              <input id="gm-redirect" type="checkbox">
            </label>`,
          })
          itemsHTML += getItemHTML('动态主页', {
            desc: '批量添加管理器可以将投稿批量添加到稍后再看。',
            html: `<label>
              <span>显示批量添加管理器按钮</span>
              <input id="gm-dynamicBatchAddManagerButton" type="checkbox">
            </label>`,
          })
          itemsHTML += getItemHTML('列表页面', {
            desc: `设置「${gm.url.page_watchlaterList}」页面的自动刷新策略。`,
            html: `<div>
              <span>自动刷新时间间隔（单位：分钟）</span>
              <span id="gm-arlInformation" class="gm-information" title>💬</span>
              <input is="laster2800-input-number" id="gm-autoReloadList" value="${gm.configMap.autoReloadList.default}" min="${gm.configMap.autoReloadList.min}" max="${gm.configMap.autoReloadList.max}" allow-zero="true">
            </div>`,
          })
          itemsHTML += getItemHTML('列表页面', {
            desc: `设置在「${gm.url.page_watchlaterList}」页面点击稿件时的行为。`,
            html: `<div>
              <span>点击稿件时</span>
              <select id="gm-openListVideo">
                <option value="${Enums.openListVideo.openInCurrent}">在当前页面打开</option>
                <option value="${Enums.openListVideo.openInNew}">在新页面打开</option>
              </select>
            </div>`,
          })
          itemsHTML += getItemHTML('列表页面', {
            desc: '控制栏跟随页面滚动，建议配合「[相关调整] 将顶栏固定在页面顶部」使用。',
            html: `<label>
              <span>控制栏随页面滚动</span>
              <input id="gm-listStickControl" type="checkbox">
            </label>`,
          })
          itemsHTML += getItemHTML('列表页面', {
            desc: '在列表页面显示……',
            html: `<div>
              <span>显示组件：</span>
              <span class="gm-lineitems">
                <label class="gm-lineitem">
                  <span>搜索框</span><input id="gm-listSearch" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>排序控制器</span><input id="gm-listSortControl" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>自动移除控制器</span><input id="gm-listAutoRemoveControl" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>列表导出按钮</span><input id="gm-listExportWatchlaterListButton" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>批量转移按钮</span><input id="gm-listBatchTransferButton" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>批量添加管理器按钮</span><input id="gm-listBatchAddManagerButton" type="checkbox">
                </label>
              </span>
            </div>`,
          })
          itemsHTML += getItemHTML('列表页面', {
            desc: '在列表页面移除……',
            html: `<div>
              <span>移除组件：</span>
              <span class="gm-lineitems">
                <label class="gm-lineitem">
                  <span>全部播放</span><input id="gm-removeButton_playAll" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>一键清空</span><input id="gm-removeButton_removeAll" type="checkbox">
                </label>
                <label class="gm-lineitem">
                  <span>移除已观看视频</span><input id="gm-removeButton_removeWatched" type="checkbox">
                </label>
              </span>
            </div>`,
          })
          itemsHTML += getItemHTML('相关调整', {
            desc: '无须兼容第三方顶栏时务必选择「无」，否则脚本无法正常工作！\n若列表中没有提供你需要的第三方顶栏，且该第三方顶栏有一定用户基数，可在脚本反馈页发起请求。',
            html: `<div>
              <span>兼容第三方顶栏：</span>
              <select id="gm-headerCompatible">
                <option value="${Enums.headerCompatible.none}">无</option>
                <option value="${Enums.headerCompatible.bilibiliEvolved}">Bilibili Evolved</option>
              </select>
              <span id="gm-hcWarning" class="gm-warning gm-trailing" title>⚠</span>
            </div>`,
          })
          itemsHTML += getItemHTML('相关调整', {
            desc: '对顶栏各入口弹出面板中滚动条的样式进行设置。',
            html: `<div>
              <span>对于弹出面板中的滚动条</span>
              <select id="gm-menuScrollbarSetting">
                <option value="${Enums.menuScrollbarSetting.beautify}">修改其外观为现代风格</option>
                <option value="${Enums.menuScrollbarSetting.hidden}">将其隐藏（不影响鼠标滚动）</option>
                <option value="${Enums.menuScrollbarSetting.original}">维持官方的滚动条样式</option>
              </select>
            </div>`,
          })
          itemsHTML += getItemHTML('脚本设置', {
            desc: '选择脚本主要逻辑的运行时期。',
            html: `<div>
              <span>脚本运行时期：</span>
              <select id="gm-mainRunAt">
                <option value="${Enums.mainRunAt.DOMContentLoaded}">DOMContentLoaded</option>
                <option value="${Enums.mainRunAt.load}">load</option>
              </select>
              <span id="gm-mraInformation" class="gm-information" title>💬</span>
            </div>`,
          })
          itemsHTML += getItemHTML('脚本设置', {
            desc: '稍后再看列表数据本地缓存有效期（单位：秒）',
            html: `<div>
              <span>稍后再看列表数据本地缓存有效期（单位：秒）</span>
              <span id="gm-wlcvpInformation" class="gm-information" title>💬</span>
              <input is="laster2800-input-number" id="gm-watchlaterListCacheValidPeriod" value="${gm.configMap.watchlaterListCacheValidPeriod.default}" min="${gm.configMap.watchlaterListCacheValidPeriod.min}" max="${gm.configMap.watchlaterListCacheValidPeriod.max}">
            </div>`,
          })
          itemsHTML += getItemHTML('脚本设置', {
            desc: '追加 Cookie（仅针对 api.bilibili.com）。主要用于修复极个别用户 HttpOnly Cookie 没有被请求携带的问题，也可用于随意追加或覆盖 Cookie 以达到更多目的，正常情况下没有必要也不要使用！',
            html: `<div>
              <span>追加 Cookie：</span>
              <input id="gm-appendCookies" type="text" value="${gm.configMap.appendCookies.default}" style="font-family:var(--${gm.id}-code-font-family)">
              <span id="gm-acInformation" class="gm-information" title>💬</span>
              <span id="gm-acWarning" class="gm-warning gm-trailing" title>⚠</span>
            </div>`,
          })
          itemsHTML += getItemHTML('用户设置', {
            desc: '一般情况下，是否在用户设置中隐藏被禁用项的子项？',
            html: `<label>
              <span>一般情况下隐藏被禁用项的子项</span>
              <input id="gm-hideDisabledSubitems" type="checkbox">
            </label>`,
          })
          itemsHTML += getItemHTML('用户设置', {
            desc: '如果更改的配置需要重新加载才能生效，那么在设置完成后重新加载页面。',
            html: `<label>
              <span>必要时在设置完成后重新加载页面</span>
              <input id="gm-reloadAfterSetting" type="checkbox">
            </label>`,
          })

          gm.el.setting.innerHTML = `
            <div class="gm-setting-page gm-modal">
              <div class="gm-title">
                <a class="gm-maintitle" title="${GM_info.script.homepage}" href="${GM_info.script.homepage}" target="_blank">
                  <span>${GM_info.script.name}</span>
                </a>
                <div class="gm-subtitle">V${GM_info.script.version} by ${GM_info.script.author}</div>
              </div>
              <div class="gm-items">${itemsHTML}</div>
              <div class="gm-bottom">
                <button class="gm-save">保存</button>
                <button class="gm-cancel">取消</button>
              </div>
              <div class="gm-reset" title="重置脚本设置及内部数据（稍后再看历史数据除外），也许能解决脚本运行错误的问题。无法解决请联系脚本作者：${GM_info.script.supportURL}">初始化脚本</div>
              <a class="gm-changelog" title="显示更新日志" href="${gm.url.gm_changelog}" target="_blank">更新日志</a>
            </div>
            <div class="gm-shadow"></div>
          `

          // 找出配置对应的元素
          for (const name of Object.keys({ ...gm.configMap, ...gm.infoMap })) {
            el[name] = gm.el.setting.querySelector(`#gm-${name}`)
          }

          el.settingPage = gm.el.setting.querySelector('.gm-setting-page')
          el.items = gm.el.setting.querySelector('.gm-items')
          el.maintitle = gm.el.setting.querySelector('.gm-maintitle')
          el.changelog = gm.el.setting.querySelector('.gm-changelog')
          switch (type) {
            case 1: {
              el.settingPage.dataset.type = 'init'
              el.maintitle.innerHTML += '<br><span style="font-size:0.8em">(初始化设置)</span>'
              break
            }
            case 2: {
              el.settingPage.dataset.type = 'updated'
              el.maintitle.innerHTML += '<br><span style="font-size:0.8em">(功能性更新设置)</span>'
              for (const [name, item] of Object.entries({ ...gm.configMap, ...gm.infoMap })) {
                if (el[name] && item.configVersion > gm.configVersion) {
                  const updated = el[name].closest('.gm-item, .gm-lineitem')
                  updated?.classList.add('gm-updated')
                }
              }
              break
            }
            default: {
              break
            }
          }
          el.save = gm.el.setting.querySelector('.gm-save')
          el.cancel = gm.el.setting.querySelector('.gm-cancel')
          el.shadow = gm.el.setting.querySelector('.gm-shadow')
          el.reset = gm.el.setting.querySelector('.gm-reset')

          // 提示信息
          el.rhfcInformation = gm.el.setting.querySelector('#gm-rhfcInformation')
          api.message.hoverInfo(el.rhfcInformation, `
            <div style="text-indent:2em;line-height:1.6em">
              <p>模糊比对模式：设当前时间点获取到的稍后再看列表数据为 A，上一次获取到的数据为 B。若 A 与 B 的前 <b>N</b> 项均一致就认为这段时间没有往稍后再看中添加新稿件，直接跳过后续处理。</p>
              <p>其中，<b>N</b> 即为模糊比对深度。注意，<b>深度设置过大反而会降低比对效率</b>，建议先设置较小的值，若后续观察到有记录被误丢弃，再增加该项的值。最佳参数与个人使用习惯相关，请根据自身情况微调。你也可以选择设置 <b>0</b> 以关闭模糊比对模式（不推荐）。</p>
            </div>
          `, null, { width: '36em', position: { top: '80%' } })
          el.rhsInformation = gm.el.setting.querySelector('#gm-rhsInformation')
          api.message.hoverInfo(el.rhsInformation, `
            <div style="line-height:1.6em">
              取值过小时，非常久远的稿件可能无法被跟踪；取值过大则不必要，原因是移除记录本质上是一种误删后的挽回手段，不必真正涵盖到所有历史。建议设置为自己日常稍后再看稿件数量的两到五倍。
            </div>
          `, null, { width: '36em', position: { top: '80%' } })
          el.rhtInformation = gm.el.setting.querySelector('#gm-rhtInformation')
          api.message.hoverInfo(el.rhtInformation, `
            <div style="line-height:1.6em">
              在历史数据记录中添加时间戳，用于改善移除记录中的数据排序，使得排序以「稿件『最后一次』被观察到处于稍后再看的时间点」为基准，而非以「稿件『第一次』被观察到处于稍后再看的时间点」为基准；同时也利于数据展示与查看。注意，此功能在数据存读及处理上都有额外开销。
            </div>
          `, null, { width: '36em', position: { top: '80%' } })
          el.balatsInformation = gm.el.setting.querySelector('#gm-balatsInformation')
          api.message.hoverInfo(el.balatsInformation, '若同步时间距离当前时间超过 48 小时，则不会执行自动加载。')
          el.fwsInformation = gm.el.setting.querySelector('#gm-fwsInformation')
          api.message.hoverInfo(el.fwsInformation, `
            <div style="text-indent:2em;line-height:1.6em">
              <p>在动态页、视频播放页以及其他页面，稿件卡片的右下角方存在一个将稿件加入或移除出稍后再看的快捷按钮。然而，在刷新页面后，B站不会为之加载稍后再看的状态——即使稿件已经在稍后再看中，也不会显示出来。启用该功能后，会自动填充这些缺失的状态信息。</p>
              <p>第三项「所有页面」，会用一套固定的逻辑对脚本能匹配到的所有非特殊页面尝试进行信息填充。脚本本身没有匹配所有B站页面，如果有需要，请在脚本管理器（如 Tampermonkey）中为脚本设置额外的页面匹配规则。由于B站各页面的设计不是很规范，某些页面中稿件卡片的设计可能跟其他地方不一致，所以不保证必定能填充成功。</p>
            </div>
          `, null, { width: '36em', position: { top: '80%' } })
          el.sdvInformation = gm.el.setting.querySelector('#gm-sdvInformation')
          api.message.hoverInfo(el.sdvInformation, '激活后在搜索框上右键点击保存默认值，中键点击清空默认值。')
          el.iwlInformation = gm.el.setting.querySelector('#gm-iwlInformation')
          api.message.hoverInfo(el.iwlInformation, '该功能入口在批量添加管理器中。')
          el.mraInformation = gm.el.setting.querySelector('#gm-mraInformation')
          api.message.hoverInfo(el.mraInformation, `
            <div style="line-height:1.6em">
              <p style="margin-bottom:0.5em"><b>DOMContentLoaded</b>：与页面内容同步加载，避免脚本在页面加载度较高时才对页面作修改。上述情况会给人页面加载时间过长的错觉，并且伴随页面变化突兀的不适感。</p>
              <p><b>load</b>：在页面初步加载完成时运行。从理论上来说这个时间点更为合适，且能保证脚本在网页加载速度极慢时仍可正常工作。但要注意的是，以上所说「网页加载速度极慢」的情况并不常见，以下为常见原因：1. 短时间内（在后台）打开十几乃至数十个网页；2. 网络问题。</p>
            </div>
          `, null, { width: '36em', flagSize: '2em', position: { top: '80%' } })
          el.arlInformation = gm.el.setting.querySelector('#gm-arlInformation')
          api.message.hoverInfo(el.arlInformation, `
            <div style="line-height:1.6em">
              <p>设置列表页面自动刷新的时间间隔。</p>
              <p>设置为 <b>0</b> 时禁用自动刷新。</p>
            </div>
          `)
          el.wlcvpInformation = gm.el.setting.querySelector('#gm-wlcvpInformation')
          api.message.hoverInfo(el.wlcvpInformation, `
            <div style="line-height:1.6em">
              在有效期内使用本地缓存代替网络请求——除非是须确保数据正确性的场合。有效期过大会导致各种诡异现象，取值最好能匹配自身的B站使用习惯。
            </div>
          `, null, { width: '36em', flagSize: '2em' })
          el.acInformation = gm.el.setting.querySelector('#gm-acInformation')
          api.message.hoverInfo(el.acInformation, `
            <div style="line-height:1.6em">
              <p>该功能主要用于修复极个别用户 HttpOnly Cookie 没有被请求携带的问题，正常情况下没有必要也不要使用！</p>
              <p>如果出现脚本无法使用的情况，响应中出现「账号未登录」信息，极有可能是 HttpOnly Cookie 没有被请求携带导致的。该现象出现原因不明，无法复现。</p>
              <p>将该项设置为 <code>SESSDATA</code>，脚本将在发送给 <code>api.bilibili.com</code> 的请求中追加 <code>SESSDATA</code> Cookie 以解决该问题，但该功能需要脚本管理器支持 <code>GM.cookie</code> API（建议使用 Tampermonkey BETA 版本）。或者手动设置 <code>SESSDATA</code>，格式为 <code>SESSDATA=A1B2C3D4E5</code> （注意 <code>SESSDATA</code> 需定期更新以避免过期）。</p>
              <p>当然也可以随意追加或覆盖 Cookie 以达到更多目的，格式为 <code>a=1;b=2;c=3;d=4</code> 。</p>
            </div>
          `, null, { width: '36em', flagSize: '2em' })

          el.hcWarning = gm.el.setting.querySelector('#gm-hcWarning')
          api.message.hoverInfo(el.hcWarning, '无须兼容第三方顶栏时务必选择「无」，否则脚本无法正常工作！', '⚠')
          el.rhWarning = gm.el.setting.querySelector('#gm-rhWarning')
          api.message.hoverInfo(el.rhWarning, '关闭移除记录，或将稍后再看历史数据保存次数设置为比原来小的值，都会造成对内部过期历史数据的清理！', '⚠')
          el.acWarning = gm.el.setting.querySelector('#gm-acWarning')
          api.message.hoverInfo(el.acWarning, '如果不理解在干什么，请将该项留空！', '⚠')

          el.headerButtonOpL.innerHTML = el.headerButtonOpR.innerHTML = el.headerButtonOpM.innerHTML = `
            <option value="${Enums.headerButtonOp.openListInCurrent}">在当前页面打开列表页面</option>
            <option value="${Enums.headerButtonOp.openListInNew}">在新页面打开列表页面</option>
            <option value="${Enums.headerButtonOp.playAllInCurrent}">在当前页面播放全部</option>
            <option value="${Enums.headerButtonOp.playAllInNew}">在新页面播放全部</option>
            <option value="${Enums.headerButtonOp.clearWatchlater}">清空稍后再看</option>
            <option value="${Enums.headerButtonOp.clearWatchedInWatchlater}">移除稍后再看已观看视频</option>
            <option value="${Enums.headerButtonOp.openUserSetting}">打开用户设置</option>
            <option value="${Enums.headerButtonOp.openRemoveHistory}">打开稍后再看移除记录</option>
            <option value="${Enums.headerButtonOp.openBatchAddManager}">打开批量添加管理器</option>
            <option value="${Enums.headerButtonOp.exportWatchlaterList}">导出稍后再看列表</option>
            <option value="${Enums.headerButtonOp.noOperation}">不执行操作</option>
          `
        }

        /**
         * 维护与设置项相关的数据和元素
         */
        const processConfigItem = () => {
          // 子项与父项相关联
          const subitemChange = (target, disabled) => {
            const content = target.closest('.gm-item-content')
            for (const option of content.querySelectorAll('[id|=gm]:not(:first-child)')) {
              if (!target.contains(option)) {
                option.disabled = disabled
              }
            }
            for (let i = 1; i < content.childElementCount; i++) {
              const item = content.children[i]
              if (disabled) {
                item.setAttribute('disabled', '')
              } else {
                item.removeAttribute('disabled')
              }
            }
          }
          el.headerMenuFn = el.headerMenuFnSetting.parentElement.parentElement
          el.headerButton.init = () => {
            const target = el.headerButton
            subitemChange(target, !target.checked)
          }
          el.headerButton.addEventListener('change', el.headerButton.init)
          el.headerCompatible.init = () => setHcWarning()
          el.headerCompatible.addEventListener('change', el.headerCompatible.init)
          el.removeHistory.init = () => {
            const target = el.removeHistory
            subitemChange(target, !target.checked)
            setRhWaring()
          }
          el.removeHistory.addEventListener('change', el.removeHistory.init)
          el.removeHistorySaves.addEventListener('input', setRhWaring)
          el.removeHistorySaves.addEventListener('blur', setRhWaring)
          el.appendCookies.init = () => setAcWarning()
          el.appendCookies.addEventListener('input', el.appendCookies.init)
          el.appendCookies.addEventListener('change', () => {
            el.appendCookies.value = el.appendCookies.value.trim()
            el.appendCookies.init()
          })
        }

        /**
         * 处理与设置页相关的数据和元素
         */
        const processSettingItem = () => {
          gm.panel.setting.openHandler = onOpen
          gm.panel.setting.openedHandler = onOpened
          gm.el.setting.fadeInDisplay = 'flex'
          el.save.addEventListener('click', onSave)
          el.cancel.addEventListener('click', () => this.closePanelItem('setting'))
          el.shadow.addEventListener('click', () => {
            if (!el.shadow.hasAttribute('disabled')) {
              this.closePanelItem('setting')
            }
          })
          el.reset.addEventListener('click', () => this.resetScript())
          el.clearRemoveHistoryData.addEventListener('click', () => {
            el.removeHistory.checked && this.clearRemoveHistoryData()
          })
          el.watchlaterMediaList.addEventListener('click', async () => {
            const uid = webpage.method.getDedeUserID()
            const mlid = await api.message.prompt(`
              <p>指定使用收藏功能时，将稿件从稍后再看移动至哪个收藏夹。</p>
              <p>下方应填入目标收藏夹 ID，置空时使用默认收藏夹。收藏夹页面网址为 <code>https://space.bilibili.com/\${uid}/favlist?fid=\${mlid}</code>，<code>mlid</code> 即收藏夹 ID。</p>
            `, GM_getValue(`watchlaterMediaList_${uid}`) ?? undefined, { html: true })
            if (mlid != null) {
              GM_setValue(`watchlaterMediaList_${uid}`, mlid)
              api.message.info('已保存稍后再看收藏夹设置')
            }
          })
          el.importWatchlaterList.addEventListener('click', () => this.setImportWatchlaterList())
          el.exportWatchlaterList.addEventListener('click', () => this.setExportWatchlaterList())
          if (type > 0) {
            if (type === 2) {
              el.save.title = '向下滚动……'
              el.save.disabled = true
            }
            el.cancel.disabled = true
            el.shadow.setAttribute('disabled', '')
          }
        }

        let needReload = false
        /**
         * 设置保存时执行
         */
        const onSave = () => {
          // 通用处理
          for (const [name, item] of Object.entries(gm.configMap)) {
            if (!item.manual && item.attr !== 'none') {
              const change = saveConfig(name, item.attr)
              if (!item.needNotReload) {
                needReload ||= change
              }
            }
          }

          let shutDownRemoveHistory = false
          // removeHistory
          if (gm.config.removeHistory !== el.removeHistory.checked) {
            gm.config.removeHistory = el.removeHistory.checked
            GM_setValue('removeHistory', gm.config.removeHistory)
            shutDownRemoveHistory = true
            needReload = true
          }
          // 「因」中无 removeHistory，就说明 needReload 需要设置为 true，除非「果」不需要刷新页面就能生效
          if (gm.config.removeHistory) {
            const rhsV = Number.parseInt(el.removeHistorySaves.value)
            if (rhsV !== gm.config.removeHistorySaves && !Number.isNaN(rhsV)) {
              // 因：removeHistorySaves
              // 果：removeHistorySaves & removeHistoryData
              const data = gm.data.removeHistoryData()
              data.setMaxSize(rhsV)
              gm.config.removeHistorySaves = rhsV
              GM_setValue('removeHistorySaves', rhsV)
              GM_setValue('removeHistoryData', data)
              // 不需要修改 needReload
            }
            // 因：removeHistorySearchTimes
            // 果：removeHistorySearchTimes
            const rhstV = Number.parseInt(el.removeHistorySearchTimes.value)
            if (rhstV !== gm.config.removeHistorySearchTimes && !Number.isNaN(rhstV)) {
              gm.config.removeHistorySearchTimes = rhstV
              GM_setValue('removeHistorySearchTimes', rhstV)
              // 不需要修改 needReload
            }
          } else if (shutDownRemoveHistory) {
            // 因：removeHistory
            // 果：most thing about history
            gm.data.removeHistoryData(true)
            GM_deleteValue('removeHistoryData')
            GM_deleteValue('removeHistoryFuzzyCompare')
            GM_deleteValue('removeHistoryFuzzyCompareReference')
            GM_deleteValue('removeHistorySaves')
          }

          this.closePanelItem('setting')
          if (type > 0) {
            // 更新配置版本
            gm.configVersion = gm.configUpdate
            GM_setValue('configVersion', gm.configVersion)
            // 关闭特殊状态
            setTimeout(() => {
              delete el.settingPage.dataset.type
              el.maintitle.textContent = GM_info.script.name
              el.cancel.disabled = false
              el.shadow.removeAttribute('disabled')
            }, gm.const.fadeTime)
          }

          if (gm.config.reloadAfterSetting && needReload) {
            needReload = false
            location.reload()
          }
        }

        /**
         * 设置打开时执行
         */
        const onOpen = () => {
          for (const [name, item] of Object.entries(gm.configMap)) {
            const { attr } = item
            if (attr !== 'none') {
              el[name][attr] = gm.config[name]
            }
          }
          for (const name of Object.keys(gm.configMap)) {
            // 需要等所有配置读取完成后再进行初始化
            el[name]?.init?.()
          }
          el.clearRemoveHistoryData.textContent = gm.config.removeHistory ? `清空数据(${gm.data.removeHistoryData().size}条)` : '清空数据(0条)'
        }

        /**
         * 设置打开后执行
         */
        const onOpened = () => {
          el.items.scrollTop = 0
          if (type === 2) {
            const resetSave = () => {
              el.save.title = ''
              el.save.disabled = false
            }

            const points = []
            const totalLength = el.items.scrollHeight
            const items = el.items.querySelectorAll('.gm-updated')
            for (const item of items) {
              points.push(item.offsetTop / totalLength * 100)
            }

            if (points.length > 0) {
              let range = 5 // 显示宽度
              const actualRange = items[0].offsetHeight / totalLength * 100 // 实际宽度
              let realRange = actualRange // 校正后原点到真实末尾的宽度
              if (actualRange > range) {
                range = actualRange
              } else {
                const offset = (actualRange - range) / 2
                for (let i = 0; i < points.length; i++) {
                  points[i] += offset
                }
                realRange = range + offset
              }
              const start = []
              const end = []
              let currentStart = points[0]
              let currentEnd = points[0] + range
              for (let i = 1; i < points.length; i++) {
                const point = points[i]
                if (point < currentEnd) {
                  currentEnd = point + range
                } else {
                  start.push(currentStart)
                  end.push(currentEnd)
                  currentStart = point
                  currentEnd = point + range
                  if (currentEnd >= 100) {
                    currentEnd = 100
                    break
                  }
                }
              }
              start.push(currentStart)
              end.push(currentEnd)

              let linear = ''
              for (const [idx, val] of start.entries()) {
                linear += `, transparent ${val}%, ${gm.const.updateHighlightColor} ${val}%, ${gm.const.updateHighlightColor} ${end[idx]}%, transparent ${end[idx]}%`
              }
              linear = linear.slice(2)

              api.base.addStyle(`
                #${gm.id} [data-type=updated] .gm-items::-webkit-scrollbar {
                  background: linear-gradient(${linear})
                }
              `)

              if (el.items.scrollHeight === el.items.clientHeight) {
                resetSave()
              } else {
                const last = Math.min((points.pop() + realRange) / 100, 0.95) // 给计算误差留点余地
                const onScroll = api.base.throttle(() => {
                  const { items } = el
                  const bottom = (items.scrollTop + items.clientHeight) / items.scrollHeight
                  if (bottom > last) { // 可视区底部超过最后一个更新点
                    resetSave()
                    items.removeEventListener('scroll', onScroll)
                  }
                }, 200)
                el.items.addEventListener('scroll', onScroll)
                el.items.dispatchEvent(new Event('scroll'))
              }
            } else {
              resetSave()
            }
          }
        }

        /**
         * 保存配置
         * @param {string} name 配置名称
         * @param {string} attr 从对应元素的什么属性读取
         * @returns {boolean} 是否有实际更新
         */
        const saveConfig = (name, attr) => {
          let val = el[name][attr]
          const { type } = gm.configMap[name]
          if (type === 'int' || type === 'float') {
            if (typeof val !== 'number') {
              val = type === 'int' ? Number.parseInt(val) : Number.parseFloat(val)
            }
            if (Number.isNaN(val)) {
              val = gm.configMap[name].default
            }
          }
          if (gm.config[name] === val) return false
          gm.config[name] = val
          GM_setValue(name, gm.config[name])
          return true
        }

        /**
         * 设置 headerCompatible 警告项
         */
        const setHcWarning = () => {
          const warn = el.headerCompatible.value !== Enums.headerCompatible.none
          if (el.hcWarning.show) {
            if (!warn) {
              api.dom.fade(false, el.hcWarning)
              el.hcWarning.show = false
            }
          } else {
            if (warn) {
              api.dom.fade(true, el.hcWarning)
              el.hcWarning.show = true
            }
          }
        }

        /**
         * 设置 appendCookies 警告项
         */
        const setAcWarning = () => {
          const warn = el.appendCookies.value !== ''
          if (el.acWarning.show) {
            if (!warn) {
              api.dom.fade(false, el.acWarning)
              el.acWarning.show = false
            }
          } else {
            if (warn) {
              api.dom.fade(true, el.acWarning)
              el.acWarning.show = true
            }
          }
        }

        /**
         * 设置 removeHistory 警告项
         */
        const setRhWaring = () => {
          let warn = false
          const rh = el.removeHistory.checked
          if (!rh && gm.config.removeHistory) {
            warn = true
          } else {
            let rhs = Number.parseInt(el.removeHistorySaves.value)
            if (Number.isNaN(rhs)) {
              rhs = 0
            }
            if (rhs < gm.config.removeHistorySaves && gm.config.removeHistory) {
              warn = true
            }
          }

          if (el.rhWarning.show) {
            if (!warn) {
              api.dom.fade(false, el.rhWarning)
              el.rhWarning.show = false
            }
          } else {
            if (warn) {
              api.dom.fade(true, el.rhWarning)
              el.rhWarning.show = true
            }
          }
        }
      }
    }

    /**
     * 打开批量添加管理器
     */
    openBatchAddManager() {
      if (gm.el.batchAddManager) {
        this.openPanelItem('batchAddManager')
      } else {
        /** @type {{[n: string]: HTMLElement}} */
        const el = {}
        let history = null
        if (gm.config.removeHistory) {
          const records = gm.data.removeHistoryData().toArray(50) // 回溯限制到 50 条
          if (records.length > 0) {
            history = new Set()
            for (const record of records) {
              history.add(webpage.method.bvTool.bv2av(record[0]))
            }
          }
        }
        setTimeout(() => {
          initManager()
          processItem()
          this.openPanelItem('batchAddManager')
        })

        /**
         * 初始化管理器
         */
        const initManager = () => {
          gm.el.batchAddManager = gm.el.gmRoot.appendChild(document.createElement('div'))
          gm.panel.batchAddManager.el = gm.el.batchAddManager
          gm.el.batchAddManager.className = 'gm-batchAddManager gm-modal-container'
          gm.el.batchAddManager.innerHTML = `
            <div class="gm-batchAddManager-page gm-modal">
              <div class="gm-title">批量添加管理器</div>
              <div class="gm-comment">
                <div>执行以下步骤以将投稿批量添加到稍后再看，常规模式下脚本优先添加投稿时间较早的投稿。执行过程中可以关闭对话框，但不能关闭页面；也不建议将当前页面置于后台，否则浏览器可能会暂缓甚至暂停任务执行。</div>
                <div>注意：该功能会在短时间内向后台发起大量请求，滥用可能会导致一段时间内无法正常访问B站！可增加平均请求间隔以降低触发拦截机制的概率。</div>
                <div>① 加载最近 <input is="laster2800-input-number" id="gm-batch-1a" value="24" digits="Infinity"> <select id="gm-batch-1b" style="border:none;margin: 0 -4px">
                  <option value="${3600 * 24}">天</option>
                  <option value="3600" selected>小时</option>
                  <option value="60">分钟</option>
                </select> 以内发布且不存在于稍后再看的视频投稿<button id="gm-batch-1c">执行</button><button id="gm-batch-1d" disabled>终止</button></div>
                <div style="text-indent:1.4em">或者从以下位置导入稿件：<button id="gm-batch-1e" style="margin-left:0.4em" title="右键点击可进行导入设置"><input type="file" multiple><span>文件</span></button><button id="gm-batch-1f">收藏夹</button></div>
                <div>② 缩小时间范围到 <input is="laster2800-input-number" id="gm-batch-2a" digits="Infinity"> <select id="gm-batch-2b" style="border:none;margin: 0 -4px">
                  <option value="${3600 * 24}">天</option>
                  <option value="3600" selected>小时</option>
                  <option value="60">分钟</option>
                </select> 以内；可使用上下方向键（配合 Alt/Shift/Ctrl）调整数值大小<button id="gm-batch-2c" disabled hidden>执行</button></div>
                <div>③ 筛选 <input id="gm-batch-3a" type="text" style="width:10em">，过滤 <input id="gm-batch-3b" type="text" style="width:10em">；支持通配符 ( ? * )，使用 | 分隔关键词<button id="gm-batch-3c" disabled hidden>执行</button></div>
                <div>④ 将选定稿件添加到稍后再看（平均请求间隔：<input is="laster2800-input-number" id="gm-batch-4a" value="${gm.const.batchAddRequestInterval}" min="250">ms）<button id="gm-batch-4b" disabled>执行</button><button id="gm-batch-4c" disabled>终止</button></div>
              </div>
              <div class="gm-items" title="鼠标左键：切换勾选状态\n鼠标右键：打开稿件\n鼠标中键：后台打开稿件并取消勾选状态"></div>
              <div class="gm-bottom"><div>
                <button id="gm-last-add-time">时间同步</button>
                <button id="gm-unchecked-display"></button>
                <button id="gm-select-all">选中全部</button>
                <button id="gm-deselect-all">取消全部</button>
                <button id="gm-save-snapshot">保存快照</button>
                <button id="gm-load-snapshot"><input type="file" accept="application/json"><span>读取快照</span></button>
                <button id="gm-save-batch-params" title="已保存参数会在加载页面后自动读取。\n右键点击以重置参数，刷新页面后生效。">保存参数</button>
                <button id="gm-load-batch-params">读取参数</button>
              </div></div>
            </div>
            <div class="gm-shadow"></div>
          `
          const ids = ['1a', '1b', '1c', '1d', '1e', '1f', '2a', '2b', '2c', '3a', '3b', '3c', '4a', '4b', '4c']
          for (const id of ids) {
            el[`id${id}`] = gm.el.batchAddManager.querySelector(`#gm-batch-${id}`)
          }
          el.items = gm.el.batchAddManager.querySelector('.gm-items')
          el.bottom = gm.el.batchAddManager.querySelector('.gm-bottom')
          el.lastAddTime = gm.el.batchAddManager.querySelector('#gm-last-add-time')
          el.uncheckedDisplay = gm.el.batchAddManager.querySelector('#gm-unchecked-display')
          el.selectAll = gm.el.batchAddManager.querySelector('#gm-select-all')
          el.deselectAll = gm.el.batchAddManager.querySelector('#gm-deselect-all')
          el.saveSnapshot = gm.el.batchAddManager.querySelector('#gm-save-snapshot')
          el.loadSnapshot = gm.el.batchAddManager.querySelector('#gm-load-snapshot')
          el.saveParams = gm.el.batchAddManager.querySelector('#gm-save-batch-params')
          el.loadParams = gm.el.batchAddManager.querySelector('#gm-load-batch-params')
          el.shadow = gm.el.batchAddManager.querySelector('.gm-shadow')

          el.saveParams.paramIds = ['1a', '1b', '3a', '3b', '4a']
          const batchParams = GM_getValue('batchParams')
          setBatchParamsToManager(batchParams)
        }

        let busy = false
        /**
         * 设置 BUSY 状态
         * @param {boolean} status BUSY 状态
         */
        const setBusy = status => {
          busy = status
          el.id1b.disabled = status
          el.id1c.disabled = status
          el.id1e.disabled = status
          el.id1f.disabled = status
          el.id4b.disabled = status
          if (status) {
            el.bottom.setAttribute('disabled', '')
            el.bottom.firstElementChild.style.pointerEvents = 'none'
          } else {
            el.bottom.removeAttribute('disabled')
            el.bottom.firstElementChild.style.pointerEvents = ''
          }
        }

        /**
         * 从批量添加管理器获取参数
         * @returns {Object} 参数
         */
        const getBatchParamsFromManager = () => {
          const params = {}
          for (const id of el.saveParams.paramIds) {
            params[`id${id}`] = el[`id${id}`].value
          }
          return params
        }
        /**
         * 将参数设置到批量添加管理器
         */
        const setBatchParamsToManager = params => {
          if (params) {
            for (const id of el.saveParams.paramIds) {
              el[`id${id}`].value = params[`id${id}`]
            }
          }
        }

        /**
         * 维护内部元素和数据
         */
        const processItem = () => {
          gm.el.batchAddManager.fadeInDisplay = 'flex'
          el.shadow.addEventListener('click', () => this.closePanelItem('batchAddManager'))

          // 处理鼠标与加载出来的稿件项目的交互
          const itemLinkSelector = '.gm-item input + a'
          // 鼠标左键：切换勾选状态
          // 阻止左键触发链接点击行为，并还原点击标签内元素切换复选框状态的行为
          el.items.addEventListener('click', e => {
            if (e.target.matches(itemLinkSelector)) {
              e.preventDefault()
              e.target.previousElementSibling.click()
            }
          }, true)
          // 鼠标右键：打开稿件
          el.items.addEventListener('contextmenu', e => {
            if (e.target.matches(itemLinkSelector)) {
              e.preventDefault()
              if (e.target.href.length > 0) {
                window.open(e.target.href)
              }
            }
          })
          // 鼠标中键：后台打开稿件并取消勾选状态
          // 后台打开稿件已由浏览器自行完成，这里要追加取消勾选行为
          el.items.addEventListener('mousedown', e => {
            if (e.target.matches(itemLinkSelector) && e.button === 1) {
              const cb = e.target.previousElementSibling
              if (cb.checked) {
                if (el.uncheckedDisplay._hide) {
                  setTimeout(() => cb.click(), 300) // 要稍加延迟，否则浏览器会来不及触发中键点击链接的逻辑
                } else {
                  cb.checked = false
                }
              }
            }
          })

          // 时间同步
          const setLastAddTime = (time = null, writeBack = true) => {
            writeBack && GM_setValue('batchLastAddTime', time)
            el.lastAddTime.val = time
            el.lastAddTime.title = `将一个合适的时间点同步到加载步骤中，以便与上次批量添加操作无缝对接。该功能仅对于常规加载方式生效。\n执行加载步骤：若完成且没有找到新稿件，同步「加载时间」。\n执行添加步骤：若完成且加载步骤完成，同步「加载时间」；否则同步「最后一个添加成功的稿件的投稿时间」。${time ? `\n当前同步时间：${new Date(time).toLocaleString()}` : ''}`
            el.lastAddTime.disabled = !time
          }
          setLastAddTime(GM_getValue('batchLastAddTime'), false)
          el.lastAddTime.addEventListener('click', () => {
            if (busy) return api.message.info('执行中，无法同步')
            const target = el.lastAddTime
            if (target.val == null) return
            const secInterval = (Date.now() - target.val) / 1000
            el.id1a.value = secInterval / el.id1b.value // 取精确时间要比向上取整好
            if (gm.config.batchAddLoadAfterTimeSync) {
              if ((Date.now() - target.val) / (1000 * 3600) <= 48) {
                el.id1c.dispatchEvent(new Event('click'))
              } else {
                api.message.info(`已同步到 ${new Date(target.val).toLocaleString()}。同步时间距离当前时间超过 48 小时，不执行自动加载。`, { ms: 2000 })
              }
            } else {
              api.message.info(`已同步到 ${new Date(target.val).toLocaleString()}`)
            }
          })
          // 避免不同页面中脚本实例互相影响而产生的同步时间错误
          GM_addValueChangeListener('batchLastAddTime', (name, oldVal, newVal, remote) => remote && setLastAddTime(newVal))

          // 非选显示
          const setUncheckedDisplayText = () => {
            el.uncheckedDisplay.textContent = el.uncheckedDisplay._hide ? '显示非选' : '隐藏非选'
          }
          el.uncheckedDisplay._hide = GM_getValue('batchUncheckedDisplay') ?? false
          setUncheckedDisplayText()
          el.uncheckedDisplay.addEventListener('click', () => {
            const target = el.uncheckedDisplay
            target._hide = !target._hide
            GM_setValue('batchUncheckedDisplay', target._hide)
            setUncheckedDisplayText()
            const display = target._hide ? 'none' : ''
            for (let i = 0; i < el.items.childElementCount; i++) {
              const item = el.items.children[i]
              if (!item.firstElementChild.checked) {
                item.style.display = display
              }
            }
          })
          el.items.addEventListener('click', e => {
            if (e.target.type === 'checkbox' && !e.target.checked && el.uncheckedDisplay._hide) {
              e.target.parentElement.style.display = 'none'
            }
          })

          // 选中全部
          el.selectAll.addEventListener('click', () => {
            const hide = el.uncheckedDisplay._hide
            for (let i = 0; i < el.items.childElementCount; i++) {
              const item = el.items.children[i]
              const cb = item.firstElementChild
              if (!cb.checked && !cb.disabled) {
                cb.checked = true
                if (hide) {
                  item.style.display = ''
                }
              }
            }
          })
          // 取消全部
          el.deselectAll.addEventListener('click', () => {
            const hide = el.uncheckedDisplay._hide
            for (let i = 0; i < el.items.childElementCount; i++) {
              const item = el.items.children[i]
              const cb = item.firstElementChild
              if (cb.checked) {
                cb.checked = false
                if (hide) {
                  item.style.display = 'none'
                }
              }
            }
          })

          // 快照
          el.saveSnapshot.addEventListener('click', () => {
            const snapshot = {
              params: getBatchParamsFromManager(),
              items: el.items.innerHTML,
            }
            const filename = `${gm.config.batchAddManagerSnapshotPrefix}.${webpage.method.getTimeString(null, '', '', '-')}.json`
            const file = new Blob([JSON.stringify(snapshot)], { type: 'application/json' })
            const a = document.createElement('a')
            a.href = URL.createObjectURL(file)
            a.download = filename
            a.click()
            api.message.info('保存成功', 1800)
          })
          const loadSnapshotF = el.loadSnapshot.firstElementChild
          el.loadSnapshot.addEventListener('click', () => loadSnapshotF.click())
          loadSnapshotF.addEventListener('change', async () => {
            if (busy) return
            const file = loadSnapshotF.files[0]
            try {
              setBusy(true)
              if (file) {
                const content = await new Promise((resolve, reject) => {
                  const reader = new FileReader()
                  reader.addEventListener('load', () => resolve(reader.result))
                  reader.addEventListener('error', e => reject(e))
                  reader.readAsText(file)
                })
                const snapshot = JSON.parse(content)
                setBatchParamsToManager(snapshot.params)
                el.items.innerHTML = snapshot.items
                initItemHints()
                el.id2a.value = el.id2a.defaultValue = el.id2a.max = ''
                api.message.info('读取成功', 1800)
              }
            } catch (e) {
              api.logger.error(e)
              api.message.alert(`快照 <code>${file.name}</code> 读取失败。`, { html: true })
            } finally {
              setBusy(false)
              loadSnapshotF.value = '' // 重置控件，否则重新选择相同文件不会触发 change 事件；置空行为不会触发 change 事件
            }
          })

          // 参数
          el.saveParams.addEventListener('click', () => {
            GM_setValue('batchParams', getBatchParamsFromManager())
            api.message.info('保存成功')
          })
          el.saveParams.addEventListener('contextmenu', e => {
            e.preventDefault()
            GM_deleteValue('batchParams')
            api.message.info('重置成功，刷新页面后生效', 1800)
          })
          el.loadParams.addEventListener('click', () => {
            const params = GM_getValue('batchParams')
            if (params) {
              setBatchParamsToManager(params)
              el.id3c.dispatchEvent(new Event('click')) // 自动执行第三步
              api.message.info('读取成功')
            } else {
              api.message.info('未读取到参数')
            }
          })

          let loadType = null
          let loadTime = 0
          let stopLoad = false
          let readers = []
          // 加载投稿
          el.id1c.addEventListener('click', async () => {
            if (busy) return
            let error = false
            try {
              setBusy(true)
              let page = 1
              let offset = -1
              const tzo = new Date().getTimezoneOffset()
              const v1a = Number.parseFloat(el.id1a.value)
              if (Number.isNaN(v1a)) throw new TypeError('v1a is NaN')
              el.id1a.value = v1a
              el.id1c.textContent = '执行中'
              el.id1d.disabled = false
              el.id2a.defaultValue = el.id2a.max = v1a
              el.id2b.syncVal = el.id1b.value
              el.items.textContent = ''
              loadType = 'FEED'
              loadTime = Date.now() // 提前记录 loadTime，这样衔接时绝对不会遗漏动态
              const end = loadTime - v1a * el.id1b.value * 1000
              const avSet = new Set()
              gm.runtime.reloadWatchlaterListData = true
              // eslint-disable-next-line no-unmodified-loop-condition
              while (!stopLoad) {
                const data = new URLSearchParams()
                data.append('timezone_offset', tzo)
                data.append('type', 'all') // video 分类会遗漏一些内容，需手动筛选
                data.append('page', page++) // page 似乎只在第 1 页有意义
                if (offset > 0) { // 后续通过 offset 而非 page 确定位置
                  data.append('offset', offset)
                }
                const resp = await api.web.request({
                  url: `${gm.url.api_dynamicList}?${data.toString()}`,
                }, { check: r => r.code === 0 })
                const { items, has_more } = resp.data
                if (!items || items.length === 0) return // -> finally
                offset = resp.data.offset // data.offset 是字符串类型，不会丢失精度；无需 +1 额外偏移
                let html = ''
                for (let item of items) {
                  let ts = -1
                  let fwSrc = null // 转发源
                  let fwSrcHint = null // 转发源说明
                  // 关注者转发的动态
                  if (gm.config.batchAddLoadForward && item.type === 'DYNAMIC_TYPE_FORWARD') {
                    fwSrc = `${gm.url.page_dynamic}/${item.id_str}`
                    fwSrcHint = item.modules.module_author.name
                    ts = item.modules.module_author.pub_ts // 使用转发时间
                    item = item.orig
                  }
                  // [视频投稿, 已订阅合集]
                  if (['DYNAMIC_TYPE_AV', 'DYNAMIC_TYPE_UGC_SEASON'].includes(item.type)) {
                    const { modules } = item
                    const author = modules.module_author
                    if (ts < 0) ts = author.pub_ts
                    if (ts * 1000 < end) {
                      el.items.insertAdjacentHTML('afterbegin', html)
                      return // -> finally
                    }
                    const { major } = modules.module_dynamic
                    const core = major[major.type.replace(/^MAJOR_TYPE_/, '').toLowerCase()]
                    const aid = String(core.aid)
                    if (!await webpage.method.getVideoWatchlaterStatusByAid(aid, false, true)) { // 完全跳过存在于稍后再看的稿件
                      if (avSet.has(aid)) continue
                      avSet.add(aid)
                      const uncheck = history?.has(aid)
                      const displayNone = uncheck && el.uncheckedDisplay._hide
                      const bvid = webpage.method.bvTool.av2bv(aid)
                      const hrefStr = bvid ? ` href=${gm.url.page_videoNormalMode}/${bvid}` : ''
                      html = `<label class="gm-item" data-aid="${aid}" data-timestamp="${ts}"${fwSrcHint ? ` data-src-hint="${fwSrcHint}" ` : ''}${displayNone ? ' style="display:none"' : ''}><input type="checkbox"${uncheck ? '' : ' checked'}> <a${hrefStr}>${author.label ? `[${author.label}]` : ''}[${author.name}] ${core.title}</a>${fwSrc ? `<a href="${fwSrc}" target="_blank">来源</a>` : ''}</label>` + html
                    }
                  }
                }
                el.items.insertAdjacentHTML('afterbegin', html)
                if (!has_more) return // -> finally
                await new Promise(resolve => setTimeout(resolve, 250 * (Math.random() * 0.5 + 0.75))) // 切线程，顺便给请求留点间隔
              }
              // 执行到这里只有一个原因：stopLoad 导致任务终止
              api.message.info('批量添加：任务终止', 1800)
            } catch (e) {
              error = true
              api.message.alert('批量添加：执行失败')
              api.logger.error(e)
            } finally {
              if (!error && !stopLoad) {
                api.message.info('批量添加：稿件加载完成', 1800)
                if (loadTime > 0 && el.items.querySelectorAll('.gm-item input:checked').length === 0) {
                  // 无有效新稿件时直接更新同步时间
                  setLastAddTime(loadTime)
                }
              }
              if (error || stopLoad) {
                loadTime = 0
              }
              initItemHints()
              setBusy(false)
              stopLoad = false
              el.id1c.textContent = '重新执行'
              el.id1d.disabled = true
              el.id4b.textContent = '执行'
              // 更新第二步的时间范围
              if (el.id2a.defaultValue && el.id2b.syncVal) {
                el.id2a.value = el.id2a.defaultValue
                el.id2b.value = el.id2b.syncVal // 非用户操作不会触发 change 事件
                el.id2b.prevVal = el.id2b.value
              }
              // 自动执行第三步
              el.id3c.dispatchEvent(new Event('click'))
            }
          })
          el.id1a.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
              const target = el[busy ? 'id1d' : 'id1c']
              if (!target.disabled) {
                target.dispatchEvent(new Event('click'))
              }
            }
          })
          // 稍后再看列表导入
          async function importWatchlaterList(content, avSet) {
            const innerRegex = gm.config.importWl_regex.replaceAll(/\(\?<?(=|!)[^)]*\)/g, '') // 内嵌组移除前视/后视断言
            const r = new RegExp(innerRegex, 'i')
            const gr = new RegExp(gm.config.importWl_regex, 'gi')
            const strs = content.match(gr)
            let html = ''
            for (const str of strs) {
              const m = r.exec(str)
              let aid = m?.[gm.config.importWl_aid]
              if (!aid) {
                try {
                  aid = webpage.method.bvTool.bv2av(m?.[gm.config.importWl_bvid])
                } catch { /* BV 号有问题，忽略 */ }
              }
              if (aid) {
                if (avSet.has(aid)) continue
                avSet.add(aid)
                const exist = await webpage.method.getVideoWatchlaterStatusByAid(aid, false, true) // 不跳过已存在稿件，仅作提示
                const uncheck = history?.has(aid) || exist
                const displayNone = uncheck && el.uncheckedDisplay._hide
                const disabledStr = exist ? ' disabled' : ''
                const title = m?.[gm.config.importWl_title]
                const source = m?.[gm.config.importWl_source]
                let tsS = m?.[gm.config.importWl_tsS]
                if (!tsS) {
                  const tsMs = m?.[gm.config.importWl_tsS]
                  if (tsMs) {
                    tsS = Math.round(Number.parseInt(tsMs) / 1000)
                  }
                }
                const bvid = webpage.method.bvTool.av2bv(aid)
                const hrefStr = bvid ? ` href=${gm.url.page_videoNormalMode}/${bvid}` : ''
                html = `<label class="gm-item" data-aid="${aid}" data-timestamp="${tsS ?? ''}" data-search-str="${source ?? ''} ${title ?? ''}"${displayNone ? ' style="display:none"' : ''}${disabledStr}><input type="checkbox"${uncheck ? '' : ' checked'}${disabledStr}> <a${hrefStr}>${source ? `[${source}] ` : ''}${title ?? `AV${aid}`}</a></label>` + html
              }
            }
            el.items.insertAdjacentHTML('afterbegin', html)
          }
          const id1eF = el.id1e.firstElementChild
          el.id1e.addEventListener('click', () => id1eF.click())
          el.id1e.addEventListener('contextmenu', e => {
            this.setImportWatchlaterList()
            e.preventDefault()
          })
          id1eF.addEventListener('change', async () => {
            if (busy) return
            let error = false
            try {
              setBusy(true)
              el.id1d.disabled = false
              el.id1e.children[1].textContent = '文件导入中'
              el.id2a.value = el.id2a.defaultValue = el.id2a.max = ''
              el.items.textContent = ''
              loadType = 'FILE'
              loadTime = 0
              const ps = []
              const avSet = new Set()
              for (const file of id1eF.files) {
                ps.push(new Promise((resolve, reject) => {
                  const reader = new FileReader()
                  reader.addEventListener('load', async () => {
                    try {
                      await importWatchlaterList(reader.result, avSet)
                      resolve()
                    } catch (e) {
                      api.message.alert(`文件 <code>${file.name}</code> 读取失败，终止导入。`, { html: true })
                      reject(e)
                    }
                  })
                  reader.addEventListener('abort', () => resolve(''))
                  reader.addEventListener('error', e => {
                    api.message.alert(`文件 <code>${file.name}</code> 读取失败，终止导入。`, { html: true })
                    reject(e)
                  })
                  reader.readAsText(file)
                  readers.push(reader)
                }))
              }
              await Promise.all(ps)
            } catch (e) {
              error = true
              api.logger.error(e)
              if (readers.length > 0) {
                for (const r of readers) {
                  r.abort()
                }
              }
            } finally {
              if (stopLoad) {
                api.message.info('批量添加：任务终止', 1800)
              } else if (!error) {
                api.message.info('批量添加：稍后再看列表导入成功', 1800)
              }
              readers = []
              setBusy(false)
              stopLoad = false
              el.id1d.disabled = true
              el.id1e.children[1].textContent = '文件'
              // 自动执行第三步
              el.id3c.dispatchEvent(new Event('click'))
              id1eF.value = '' // 重置控件，否则重新选择相同文件不会触发 change 事件；置空行为不会触发 change 事件
            }
          })
          // 收藏夹导入
          el.id1f.addEventListener('click', async () => {
            let favExecuted = false
            if (busy) return
            try {
              setBusy(true)
              el.id1d.disabled = true
              el.id1f.textContent = '收藏夹导入中'
              el.id2a.value = el.id2a.defaultValue = el.id2a.max = ''
              el.items.textContent = ''
              loadType = 'FAV'
              loadTime = 0
              let mlid = await api.message.prompt(`
                <p>指定需导入的收藏夹。下方应填入目标收藏夹 ID，可使用英文逗号「<code>,</code>」分隔多个收藏夹。置空时使用稍后再看收藏夹。</p>
                <p style="word-break:break-all">收藏夹页面网址为 <code>https://space.bilibili.com/\${uid}/favlist?fid=\${mlid}</code>，<code>mlid</code> 即收藏夹 ID。</p>
              `, null, { html: true })
              if (mlid == null) return
              if (mlid.trim() === '') {
                const uid = webpage.method.getDedeUserID()
                mlid = GM_getValue(`watchlaterMediaList_${uid}`)
                if (!mlid) {
                  mlid = await webpage.method.getDefaultMediaListId(uid)
                }
              }
              let error = false
              try {
                favExecuted = true
                el.id1d.disabled = false
                const avSet = new Set()
                const favIds = mlid.split(',')
                // eslint-disable-next-line no-unreachable-loop
                id1fFavLoop: for (const favId of favIds) {
                  let page = 1
                  // eslint-disable-next-line no-unmodified-loop-condition
                  while (!stopLoad) {
                    const data = new URLSearchParams()
                    data.append('media_id', favId)
                    data.append('ps', '20') // 每页数，最大 20
                    data.append('pn', page++)
                    const resp = await api.web.request({
                      url: `${gm.url.api_favResourceList}?${data.toString()}`,
                    }, { check: r => r.code === 0 })
                    const { medias, info, has_more } = resp.data
                    if (!medias || medias.length === 0) continue id1fFavLoop
                    const source = info.title
                    let html = ''
                    for (const item of medias) {
                      const aid = String(item.id)
                      if (avSet.has(aid)) continue
                      avSet.add(aid)
                      const exist = await webpage.method.getVideoWatchlaterStatusByAid(aid, false, true) // 不跳过已存在稿件，仅作提示
                      const uncheck = history?.has(aid) || exist
                      const displayNone = uncheck && el.uncheckedDisplay._hide
                      const disabledStr = exist ? ' disabled' : ''
                      const bvid = webpage.method.bvTool.av2bv(aid)
                      const hrefStr = bvid ? ` href=${gm.url.page_videoNormalMode}/${bvid}` : ''
                      html = `<label class="gm-item" data-aid="${aid}" data-timestamp="${gm.config.batchAddUsingFavTime ? item.fav_time : item.pubtime}"${displayNone ? ' style="display:none"' : ''}${disabledStr}><input type="checkbox"${uncheck ? '' : ' checked'}${disabledStr}> <a${hrefStr}>[${source}][${item.upper.name}] ${item.title}</a></label>` + html
                    }
                    el.items.insertAdjacentHTML('afterbegin', html)
                    if (!has_more) continue id1fFavLoop
                    await new Promise(resolve => setTimeout(resolve, 250 * (Math.random() * 0.5 + 0.75))) // 切线程，顺便给请求留点间隔
                  }
                  // 执行到这里只有一个原因：stopLoad 导致任务终止
                  api.message.info('批量添加：任务终止', 1800)
                  break
                }
              } catch (e) {
                error = true
                api.message.alert('批量添加：执行失败')
                api.logger.error(e)
              } finally {
                if (!error && !stopLoad) {
                  api.message.info('批量添加：稿件加载完成', 1800)
                }

              }
            } finally {
              setBusy(false)
              stopLoad = false
              el.id1d.disabled = true
              el.id1f.textContent = '收藏夹'
              if (favExecuted) {
                // 自动执行第三步
                el.id3c.dispatchEvent(new Event('click'))
              }
            }
          })
          // 终止加载 / 导入
          el.id1d.addEventListener('click', () => {
            stopLoad = true
            if (readers.length > 0) {
              for (const r of readers) {
                r.abort()
              }
            }
          })

          // 时间过滤
          function filterTime() {
            if (busy) return
            try {
              busy = true
              const v2a = Number.parseFloat(el.id2a.value)
              if (Number.isNaN(v2a)) {
                for (let i = 0; i < el.items.childElementCount; i++) {
                  el.items.children[i].classList.remove('gm-filtered-time')
                }
              } else {
                const newEnd = Date.now() - v2a * el.id2b.value * 1000
                for (let i = 0; i < el.items.childElementCount; i++) {
                  const item = el.items.children[i]
                  const timestamp = Number.parseInt(item.dataset.timestamp)
                  if (timestamp * 1000 < newEnd) {
                    item.classList.add('gm-filtered-time')
                  } else {
                    item.classList.remove('gm-filtered-time')
                  }
                }
              }
            } catch (e) {
              api.message.alert('批量添加：执行失败')
              api.logger.error(e)
            } finally {
              busy = false
            }
          }
          const throttledFilterTime = api.base.throttle(filterTime, gm.const.inputThrottleWait)
          el.id2a.addEventListener('input', throttledFilterTime)
          el.id2a.addEventListener('change', throttledFilterTime)
          el.id2b.addEventListener('change', filterTime)
          el.id2c.addEventListener('click', filterTime)

          // 正则过滤
          function filterRegex() {
            if (busy) return
            try {
              const getRegex = str => {
                let result = null
                str = str.trim()
                if (str !== '') {
                  try {
                    str = str.replaceAll(/\s*\|\s*/g, '|') // 移除关键词首末空白符
                      .replaceAll(/[$()+.[\\\]^{}]/g, '\\$&') // escape regex except |
                      .replaceAll('?', '.').replaceAll('*', '.*') // 通配符
                    result = new RegExp(str, 'i')
                  } catch {}
                }
                return result
              }
              busy = true
              el.id3a.value = el.id3a.value.trimStart()
              el.id3b.value = el.id3b.value.trimStart()
              const v3a = getRegex(el.id3a.value)
              const v3b = getRegex(el.id3b.value)
              for (let i = 0; i < el.items.childElementCount; i++) {
                const item = el.items.children[i]
                const ss = item.dataset.searchStr ?? item.textContent
                if ((v3a && !v3a.test(ss)) || v3b?.test(ss)) {
                  item.classList.add('gm-filtered-regex')
                } else {
                  item.classList.remove('gm-filtered-regex')
                }
              }
            } catch (e) {
              api.message.alert('批量添加：执行失败')
              api.logger.error(e)
            } finally {
              busy = false
            }
          }
          const throttledFilterRegex = api.base.throttle(filterRegex, gm.const.inputThrottleWait)
          el.id3a.addEventListener('input', throttledFilterRegex)
          el.id3b.addEventListener('input', throttledFilterRegex)
          el.id3c.addEventListener('click', throttledFilterRegex)

          // 添加到稍后再看
          let stopAdd = false
          el.id4b.addEventListener('click', async () => {
            if (busy) return
            let added = false
            let lastAddTime = 0
            try {
              setBusy(true)
              let v4a = Number.parseFloat(el.id4a.value)
              v4a = Number.isNaN(v4a) ? gm.const.batchAddRequestInterval : Math.max(v4a, 250)
              el.id4a.value = v4a
              el.id4b.textContent = '执行中'
              el.id4c.disabled = false
              const checks = el.items.querySelectorAll('.gm-item:not([class*=gm-filtered-]) input:checked')
              for (const check of checks) {
                if (stopAdd) return api.message.info('批量添加：任务终止', 1800) // -> finally
                const item = check.parentElement
                const success = await webpage.method.switchVideoWatchlaterStatus(item.dataset.aid)
                if (!success) throw new Error('add request error')
                lastAddTime = item.dataset.timestamp
                check.checked = false
                if (el.uncheckedDisplay._hide) {
                  item.style.display = 'none'
                }
                added = true
                await new Promise(resolve => setTimeout(resolve, v4a * (Math.random() * 0.5 + 0.75)))
              }
              if (loadTime > 0) {
                lastAddTime = loadTime
              }
              api.message.info('批量添加：已将所有选定稿件添加到稍后再看', 1800)
            } catch (e) {
              api.message.alert('批量添加：执行失败。可能是因为目标稿件不可用或稍后再看不支持该稿件类型（如互动视频），可尝试取消勾选当前列表中第一个选定的稿件后重新执行。')
              api.logger.error(e)
            } finally {
              if (lastAddTime && loadType === 'FEED') {
                if (typeof lastAddTime !== 'number') {
                  lastAddTime = Number.parseInt(lastAddTime) * 1000
                }
                if (lastAddTime > 0) {
                  setLastAddTime(lastAddTime)
                }
              }
              setBusy(false)
              stopAdd = false
              el.id4b.textContent = '重新执行'
              el.id4c.disabled = true
              gm.runtime.reloadWatchlaterListData = true
              window.dispatchEvent(new CustomEvent('reloadWatchlaterListData'))

              if (added && api.base.urlMatch(gm.regex.page_watchlaterList)) {
                webpage.reloadWatchlaterListPage(null)
              }
            }
          })
          el.id4c.addEventListener('click', () => {
            stopAdd = true
          })
          el.id4a.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
              const target = el[busy ? 'id4c' : 'id4b']
              if (!target.disabled) {
                target.dispatchEvent(new Event('click'))
              }
            }
          })

          // 时间单位转换
          const syncTimeUnit = (unitEl, valEl) => {
            unitEl.prevVal = unitEl.value
            unitEl.addEventListener('change', () => {
              if (valEl.max !== Number.POSITIVE_INFINITY) {
                valEl.max = (valEl.max * unitEl.prevVal / unitEl.value).toFixed(1)
              }
              if (valEl.defaultValue) {
                valEl.defaultValue = (valEl.defaultValue * unitEl.prevVal / unitEl.value).toFixed(1)
              }
              if (valEl.value) {
                valEl.value = (valEl.value * unitEl.prevVal / unitEl.value).toFixed(1)
                unitEl.prevVal = unitEl.value
              }
            }, true)
          }
          syncTimeUnit(el.id1b, el.id1a)
          syncTimeUnit(el.id2b, el.id2a)
        }

        /**
         * 初始化项目鼠标悬浮提示
         */
        const initItemHints = () => {
          const hintEls = el.items.querySelectorAll('[data-src-hint]')
          for (const el of hintEls) {
            api.message.hoverInfo(el, `转发者：${el.dataset.srcHint}`)
          }
        }
      }
    }

    /**
     * 打开移除记录
     */
    openRemoveHistory() {
      if (!gm.config.removeHistory) {
        api.message.info('请在设置中开启稍后再看移除记录')
        return
      }
      GM_deleteValue('removeHistorySaveTime') // 保险起见，清理一下

      /** @type {{[n: string]: HTMLElement}} */
      const el = {}
      if (gm.el.history) {
        el.searchTimes = gm.el.history.querySelector('#gm-history-search-times')
        el.searchTimes.value = gm.config.removeHistorySearchTimes
        el.searchTimes.current = el.searchTimes.value
        el.sort = gm.el.history.querySelector('#gm-history-sort')
        if (el.sort.type !== 0) {
          el.sort.type = 0 // 降序
        }
        this.openPanelItem('history')
      } else {
        setTimeout(() => {
          initHistory()
          processItem()
          this.openPanelItem('history')
        })

        /**
         * 初始化移除记录页面
         */
        const initHistory = () => {
          gm.el.history = gm.el.gmRoot.appendChild(document.createElement('div'))
          gm.panel.history.el = gm.el.history
          gm.el.history.className = 'gm-history gm-modal-container'
          gm.el.history.innerHTML = `
            <div class="gm-history-page gm-modal">
              <div class="gm-title">稍后再看移除记录</div>
              <div class="gm-comment">
                <div>根据<span id="gm-history-new-or-old" style="padding-right:0"></span><span id="gm-history-save-times">0</span>条不重复数据记录生成，共筛选出<span id="gm-history-removed-num">0</span>条移除记录。排序由稿件<span id="gm-history-time-point"></span>被观察到处于稍后再看的时间决定，与被移除出稍后再看的时间无关。如果记录太少请设置增加历史回溯深度；记录太多则减少之，并善用浏览器搜索功能辅助定位。</div>
                <div style="text-align:right;font-weight:bold">
                  <span id="gm-history-sort" style="text-decoration:underline;cursor:pointer"></span>
                  <span title="搜寻时在最近/最早保存的多少条稍后再看历史数据记录中查找。按下回车键或输入框失去焦点时刷新数据。">历史回溯深度：<input is="laster2800-input-number" id="gm-history-search-times" value="${gm.config.removeHistorySearchTimes}" min="${gm.configMap.removeHistorySearchTimes.min}" max="${gm.configMap.removeHistorySearchTimes.max}"></span>
                </div>
              </div>
              <div class="gm-content"></div>
            </div>
            <div class="gm-shadow"></div>
          `
          el.historyPage = gm.el.history.querySelector('.gm-history-page')
          el.comment = gm.el.history.querySelector('.gm-comment')
          el.content = gm.el.history.querySelector('.gm-content')
          el.sort = gm.el.history.querySelector('#gm-history-sort')
          el.timePoint = gm.el.history.querySelector('#gm-history-time-point')
          el.saveTimes = gm.el.history.querySelector('#gm-history-save-times')
          el.removedNum = gm.el.history.querySelector('#gm-history-removed-num')
          el.searchTimes = gm.el.history.querySelector('#gm-history-search-times')
          el.newOrOld = gm.el.history.querySelector('#gm-history-new-or-old')
          el.shadow = gm.el.history.querySelector('.gm-shadow')
        }

        /**
         * 维护内部元素和数据
         */
        const processItem = () => {
          el.content.fadeOutDisplay = 'block'
          el.content.fadeInTime = gm.const.textFadeTime
          el.content.fadeOutTime = gm.const.textFadeTime
          el.searchTimes.current = el.searchTimes.value
          el.searchTimes.addEventListener('blur', () => {
            const target = el.searchTimes
            if (target.value !== el.searchTimes.current) {
              el.searchTimes.current = target.value
              gm.panel.history.openHandler()
            }
          })
          el.searchTimes.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
              el.searchTimes.dispatchEvent(new Event('blur'))
            }
          })

          el.content.addEventListener('click', async e => {
            if (e.target.type === 'checkbox') {
              const box = e.target
              const status = box.checked
              const { bvid } = box.dataset
              const note = status ? '添加到稍后再看' : '从稍后再看移除'
              const success = await webpage?.method.switchVideoWatchlaterStatus(bvid, status)
              if (success) {
                api.message.info(`${note}成功`)
              } else {
                box.checked = !status
                api.message.info(`${note}失败${status ? '，可能是因为该稿件不可用' : ''}`)
              }
            }
          })

          // 排序方式
          const typeText = ['降序', '升序', '完全升序']
          const typeDesc = [
            '降序回溯历史，降序显示结果',
            '降序回溯历史，升序显示结果',
            '升序回溯历史，升序显示结果',
          ]
          Reflect.defineProperty(el.sort, 'type', {
            get() { return Number.parseInt(this.dataset.type) },
            set(val) {
              this.dataset.type = val
              this.textContent = typeText[val]
              this.title = typeDesc[val]
              el.newOrOld.textContent = val < 2 ? '最近' : '最早'
            },
          })
          el.sort.type = 0
          el.sort.addEventListener('click', () => {
            const target = el.sort
            target.type = (target.type + 1) % typeText.length
            gm.panel.history.openHandler()
          })

          gm.panel.history.openHandler = onOpen
          gm.el.history.fadeInDisplay = 'flex'
          el.shadow.addEventListener('click', () => this.closePanelItem('history'))
        }

        /**
         * 移除记录打开时执行
         */
        const onOpen = async () => {
          api.dom.fade(false, el.content)
          el.timePoint.textContent = gm.config.removeHistoryTimestamp ? '最后一次' : '第一次'

          try {
            const map = await webpage.method.getWatchlaterDataMap(item => item.bvid, 'bvid', true)
            const depth = Number.parseInt(el.searchTimes.value)
            let data = null
            if (el.sort.type < 2) {
              data = gm.data.removeHistoryData().toArray(depth)
            } else {
              const rhd = gm.data.removeHistoryData()
              data = rhd.toArray(depth, rhd.size - depth)
            }
            el.saveTimes.textContent = data.length
            const history = []
            const result = []
            for (const record of data) {
              if (!map.has(record[0])) {
                history.push(record)
              }
            }

            if (gm.config.removeHistoryTimestamp) { // 两种情况有大量同类项，但合并后处理速度会降不少
              if (history.length > 1) {
                // ES2019 后 Array#sort() 为稳定排序
                history.sort((a, b) => (b[2] ?? 0) - (a[2] ?? 0))
                if (el.sort.type >= 1) {
                  history.reverse()
                }
              }
              for (const rm of history) {
                result.push(`
                  <div>
                    <a href="${gm.url.page_videoNormalMode}/${rm[0]}" target="_blank">${rm[1]}</a>
                    <input type="checkbox" data-bvid="${rm[0]}">
                    ${rm[2] ? `<div class="gm-history-date">${new Date(rm[2]).toLocaleString()}</div>` : ''}
                  </div>
                `)
              }
            } else {
              if (history.length > 1 && el.sort.type >= 1) {
                history.reverse()
              }
              for (const rm of history) {
                result.push(`
                  <div>
                    <a href="${gm.url.page_videoNormalMode}/${rm[0]}" target="_blank">${rm[1]}</a>
                    <input type="checkbox" data-bvid="${rm[0]}">
                  </div>
                `)
              }
            }
            el.removedNum.textContent = result.length

            if (result.length > 0) {
              el.content.innerHTML = result.join('')
              el.content.scrollTop = 0
            } else {
              setEmptyContent('没有找到移除记录，请尝试增大历史回溯深度')
            }
          } catch (e) {
            setEmptyContent(`网络连接错误或内部数据错误，初始化脚本或清空稍后再看历史数据或许能解决问题。无法解决时请提供反馈：<br><a style="color:inherit;font-weight:normal" href="${GM_info.script.supportURL}" target="_blank">${GM_info.script.supportURL}<a>`)
            api.logger.error(e)
          } finally {
            api.dom.fade(true, el.content)
          }
        }

        const setEmptyContent = text => {
          el.content.innerHTML = `<div class="gm-empty"><div>${text}</div></div>`
        }
      }
    }

    /**
     * 初始化脚本
     */
    async resetScript() {
      const result = await api.message.confirm('是否要初始化脚本？本操作不会清理稍后再看历史数据，要清理之请在用户设置中操作。')
      if (result) {
        const keyNoReset = { removeHistoryData: true, removeHistorySaves: true }
        const gmKeys = GM_listValues()
        for (const gmKey of gmKeys) {
          if (!keyNoReset[gmKey]) {
            GM_deleteValue(gmKey)
          }
        }
        gm.configVersion = 0
        GM_setValue('configVersion', gm.configVersion)
        location.reload()
      }
    }

    /**
     * 清空 removeHistoryData
     */
    async clearRemoveHistoryData() {
      const result = await api.message.confirm('是否要清空稍后再看历史数据？')
      if (result) {
        GM_deleteValue('removeHistoryData')
        GM_deleteValue('removeHistoryFuzzyCompareReference')
        location.reload()
      }
    }

    /**
     * 取消所有固定项
     */
    async clearFixedItems() {
      const result = await api.message.confirm('是否要取消所有固定项？')
      if (result) {
        const uid = webpage.method.getDedeUserID()
        GM_setValue(`fixedItems_${uid}`, [])
        for (const item of document.querySelectorAll('.gm-fixed')) {
          item.classList?.remove('gm-fixed')
        }
        api.message.info('已取消所有固定项')
      }
    }

    /**
     * 打开面板项
     * @param {string} name 面板项名称
     * @param {(panel: GMObject_panel_item) => void} [callback] 打开面板项后的回调函数
     * @param {boolean} [keepOthers] 打开时保留其他面板项
     * @returns {Promise<boolean>} 操作是否成功
     */
    async openPanelItem(name, callback, keepOthers) {
      let success = false
      /** @type {GMObject_panel_item}  */
      const panel = gm.panel[name]
      if (panel.wait > 0) return false
      try {
        try {
          if (panel.state === 1) {
            panel.wait = 1
            await api.wait.waitForConditionPassed({
              condition: () => panel.state === 2,
              timeout: 1500 + (panel.el.fadeInTime ?? gm.const.fadeTime),
            })
            return true
          } else if (panel.state === 3) {
            panel.wait = 1
            await api.wait.waitForConditionPassed({
              condition: () => panel.state === 0,
              timeout: 1500 + (panel.el.fadeOutTime ?? gm.const.fadeTime),
            })
          }
        } catch (e) {
          panel.state = -1
          api.logger.error(e)
        } finally {
          panel.wait = 0
        }
        if (panel.state === 0 || panel.state === -1) {
          panel.state = 1
          if (!keepOthers) {
            for (const [key, curr] of Object.entries(gm.panel)) {
              if (key === name || curr.state === 0) continue
              this.closePanelItem(key)
            }
          }
          await panel.openHandler?.()
          await new Promise(resolve => {
            api.dom.fade(true, panel.el, () => {
              resolve()
              panel.openedHandler?.()
              callback?.(panel)
            })
          })
          panel.state = 2
          success = true
        }
        if (success && document.fullscreenElement) {
          document.exitFullscreen()
        }
      } catch (e) {
        panel.state = -1
        api.logger.error(e)
      }
      return success
    }

    /**
     * 关闭面板项
     * @param {string} name 面板项名称
     * @param {(panel: GMObject_panel_item) => void} [callback] 关闭面板项后的回调函数
     * @returns {Promise<boolean>} 操作是否成功
     */
    async closePanelItem(name, callback) {
      /** @type {GMObject_panel_item} */
      const panel = gm.panel[name]
      if (panel.wait > 0) return
      try {
        try {
          if (panel.state === 1) {
            panel.wait = 2
            await api.wait.waitForConditionPassed({
              condition: () => panel.state === 2,
              timeout: 1500 + (panel.el.fadeInTime ?? gm.const.fadeTime),
            })
          } else if (panel.state === 3) {
            panel.wait = 2
            await api.wait.waitForConditionPassed({
              condition: () => panel.state === 0,
              timeout: 1500 + (panel.el.fadeOutTime ?? gm.const.fadeTime),
            })
            return true
          }
        } catch (e) {
          panel.state = -1
          api.logger.error(e)
        } finally {
          panel.wait = 0
        }
        if (panel.state === 2 || panel.state === -1) {
          panel.state = 3
          await panel.closeHandler?.()
          await new Promise(resolve => {
            api.dom.fade(false, panel.el, () => {
              resolve()
              panel.closedHandler?.()
              callback?.(panel)
            })
          })
          panel.state = 0
          return true
        }
      } catch (e) {
        panel.state = -1
        api.logger.error(e)
      }
      return false
    }

    /**
     * 导出稍后再看列表
     */
    async exportWatchlaterList() {
      try {
        const ITEMS = await gm.data.watchlaterListData(true)

        /* eslint-disable no-eval */
        /* eslint-disable no-unused-vars */
        const 是 = true
        const 否 = false
        /* eslint-disable prefer-const */
        let 导出至剪贴板 = true
        let 导出至新页面 = false
        let 导出至文件 = false
        let 导出文件名 = null
        let 相邻稿件换行 = true
        let 前置内容 = null
        let 后置内容 = null
        let 稿件导出模板 = null
        /* eslint-enable prefer-const */

        let config = GM_getValue('exportWatchlaterListConfig')
        if (!config || config.trim() === '') {
          config = gm.const.exportWatchlaterList_default
          GM_setValue('exportWatchlaterListConfig', config)
        }
        eval(config)

        const front = 前置内容 ? eval('`' + 前置内容 + '`') : ''
        const rear = 后置内容 ? eval('`' + 后置内容 + '`') : ''
        const items = []
        for (const [idx, ITEM] of ITEMS.entries()) {
          const INDEX = idx + 1
          items.push(eval('`' + 稿件导出模板 + '`'))
        }

        if (导出至剪贴板 || 导出至文件) {
          const content = `${front}${相邻稿件换行 ? items.join('\n') : items.join('')}${rear}`
          if (导出至剪贴板) {
            await navigator.clipboard.writeText(content).then(
              () => api.message.info('稍后再看列表已导出至剪贴板'),
              () => api.message.info('稍后再看列表写入剪贴板失败', 3000),
            )
          }
          if (导出至文件) {
            const filename = 导出文件名 ? eval('`' + 导出文件名 + '`') : `稍后再看列表.${Date.now()}.txt`
            const file = new Blob([content], { type: 'text/plain' })
            const a = document.createElement('a')
            a.href = URL.createObjectURL(file)
            a.download = filename
            a.click()
          }
        }
        if (导出至新页面) {
          const center = 相邻稿件换行 ? items.join('</p><p>') : items.join('')
          const content = `${front !== '' ? `<p>${front}</p>` : ''}<p>${center}</p>${rear !== '' ? `<p>${rear}</p>` : ''}`.replaceAll(/\n(?!<\/p>)/g, '<br>').replaceAll('\n', '')
          const w = window.open()
          w.document.write(content)
          w.document.close()
          w.document.title = `稍后再看列表@${new Date().toLocaleString()}`
        }
        /* eslint-enable no-eval */
        /* eslint-enable no-unused-vars */
      } catch (e) {
        api.logger.error(e)
        const result = await api.message.confirm('稍后再看列表导出失败，可能是导出方式配置错误（错误信息详见控制台）。是否打开导出设置？')
        if (result) {
          this.setExportWatchlaterList()
        }
      }
    }

    /**
     * 设置稍后再看列表导入方式
     */
    setImportWatchlaterList() {
      const msg = `<div class="gm-import-wl-container">
        <div>
          <div>设置稍后再看列表导入方式。默认简单读取所有形如 <code>BV###</code> 的字符串。</div>
          <div>若有进一步的需求，请提前设计好稍后再看列表文件的格式，使用正则表达式（不区分大小写）指定每个稿件对应的文本，然后指定稿件 ID、稿件标题、来源（建议：上传者名称）、时间节点等信息对应的捕获组。</div>
          <div>可填写 <code>-1</code> 禁用某项信息，但 <code>aid / bvid</code> 至少填写一个（冲突时优先使用「AV 号」）。时间节点在批量添加管理器中被用于在步骤 ② 中判断稿件是否超出设定的时间范围，根据用户需要可设定为稿件发布时间或文件导出时间等，冲突时优先使用「时间节点（秒）」。</div>
        </div>
        <div class="gm-group-container">
          <div>正则表达式：</div>
          <input class="gm-interactive" type="text" id="gm-import-wl-regex">
        </div>
        <div class="gm-group-container">
          <div>捕获组：</div>
          <div class="gm-capturing-group">
            <div>
              <div>AV 号</div>
              <input class="gm-interactive" is="laster2800-input-number" id="gm-import-wl-aid" min="-1">
            </div>
            <div>
              <div>BV 号</div>
              <input class="gm-interactive" is="laster2800-input-number" id="gm-import-wl-bvid" min="-1">
            </div>
            <div>
              <div>标题</div>
              <input class="gm-interactive" is="laster2800-input-number" id="gm-import-wl-title" min="-1">
            </div>
            <div>
              <div>来源</div>
              <input class="gm-interactive" is="laster2800-input-number" id="gm-import-wl-source" min="-1">
            </div>
            <div>
              <div>时间节点（秒）</div>
              <input class="gm-interactive" is="laster2800-input-number" id="gm-import-wl-ts-s" min="-1">
            </div>
            <div>
              <div>时间节点（毫秒）</div>
              <input class="gm-interactive" is="laster2800-input-number" id="gm-import-wl-ts-ms" min="-1">
            </div>
          </div>
        </div>
      </div>`
      const btnText = ['重置', '确定', '取消']
      const dialog = api.message.dialog(msg, { html: true, buttons: btnText })
      const [regex, aid, bvid, title, source, tsS, tsMs, reset, confirm, cancel] = dialog.interactives
      const config = { regex, aid, bvid, title, source, tsS, tsMs }
      reset.addEventListener('click', () => {
        for (const [n, el] of Object.entries(config)) {
          el.value = gm.configMap[`importWl_${n}`].default
        }
      })
      confirm.addEventListener('click', () => {
        dialog.close()
        for (const [n, el] of Object.entries(config)) {
          const k = `importWl_${n}`
          const v = gm.configMap[k]?.type === 'int' ? Number.parseInt(el.value) : el.value
          gm.config[k] = v
          GM_setValue(k, v)
        }
        api.message.info('已保存稍后再看列表导入设置')
      })
      cancel.addEventListener('click', () => dialog.close())
      for (const [n, el] of Object.entries(config)) {
        el.value = gm.config[`importWl_${n}`]
      }
      dialog.open()
    }

    /**
     * 设置稍后再看列表导出方式
     */
    setExportWatchlaterList() {
      const msg = '设置稍后再看列表导出方式。默认情况下简单地导出各稿件的普通播放页 URL 到剪贴板，如需使用其他导出模板或使用文件等方式导出，请参考「示例」进行定义。置空时使用默认值。'
      const btnText = ['示例', '重置', '确定', '取消']
      const dialog = api.message.dialog(msg, {
        buttons: btnText,
        boxInput: true,
      })
      const [input, example, reset, confirm, cancel] = dialog.interactives
      const config = GM_getValue('exportWatchlaterListConfig')
      input.value = (config && config.trim() !== '') ? config : gm.const.exportWatchlaterList_default
      input.style.height = '20em'
      input.style.fontSize = '0.8em'
      input.style.fontFamily = 'monospace'
      input.focus({ preventScroll: true })
      example.addEventListener('click', async () => {
        let ref = ''
        const data = await gm.data.watchlaterListData(true)
        if (data[0]) {
          const attrs = []
          for (const attr in data[0]) {
            if (Object.hasOwn(data[0], attr)) {
              attrs.push(attr)
            }
          }
          ref = `//    ITEM 属性如下行所示，可在点击「示例」后在控制台查看详细内容结构\n//      ${attrs.join(', ')}\n`
          api.logger.info('ITEM 内容结构如下：')
          api.logger.info(data[0])
        }
        input.value = `// 右键点击稍后再看列表页面的「导出列表」按钮可快速打开此设置框\n\n// 不需要的配置直接删除行即可，缺省配置会使用默认值\n// 使用 \${} 引用变量，配合单引号 '' 或双引号 "" 使用（而非反引号 \`\`）\n// - \${INDEX}: 稿件在列表中的位置（从 1 开始）\n// - \${ITEMS}: 稿件项目数组\n// -  \${ITEM}: 稿件项目\n${ref}\n导出至剪贴板 = 否\n导出至新页面 = 否\n导出至文件 = 是\n导出文件名 = '稍后再看列表.\${Date.now()}.txt' // 注意文件名是否合法\n相邻稿件换行 = 是\n\n前置内容 = '稍后再看列表@\${new Date().toLocaleString()}\\n'\n后置内容 = '\\n--------------- 共 \${ITEMS.length} 个稿件 ---------------'\n稿件导出模板 = '[\${INDEX}] www.bilibili.com/video/\${ITEM.bvid}'\n\n// 可在此处通过 JavaScript 代码进行导出前的准备操作\n// 示例：按稿件硬币数进行排序，随后按此顺序导出（取消注释以使用）\n// ITEMS.sort((a, b) => a.stat.coin - b.stat.coin) // 实际编写时建议增加异常处理`
      })
      reset.addEventListener('click', () => {
        input.value = gm.const.exportWatchlaterList_default
      })
      confirm.addEventListener('click', () => {
        dialog.close()
        GM_setValue('exportWatchlaterListConfig', input.value)
        api.message.info('已保存稍后再看列表导出设置')
      })
      cancel.addEventListener('click', () => dialog.close())
      dialog.open()
    }
  }

  /**
   * 页面处理的抽象，脚本围绕网站的特化部分
   */
  class Webpage {
    /** 内部数据 */
    #data = {}

    /** 通用方法 */
    method = {
      /** @type {Webpage} */
      obj: null,

      /**
       * 获取指定 Cookie
       * @param {string} key 键
       * @returns {string} 值
       * @see {@link https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie#示例2_得到名为test2的cookie Document.cookie - Web API 接口参考 | MDN}
       */
      cookie(key) {
        return document.cookie.replace(new RegExp(String.raw`(?:(?:^|.*;\s*)${key}\s*=\s*([^;]*).*$)|^.*$`), '$1')
      },

      /**
       * 判断用户是否已登录
       * @returns {boolean} 用户是否已登录
       */
      isLogin() {
        return Boolean(this.getCSRF())
      },

      /**
       * 获取当前登录用户 ID
       * @returns {string} `DedeUserID`
       */
      getDedeUserID() {
        return this.cookie('DedeUserID')
      },

      /**
       * 获取 CSRF
       * @returns {string} `csrf`
       */
      getCSRF() {
        return this.cookie('bili_jct')
      },

      /**
       * av/bv 互转工具类
       *
       * 转换算法最初由知乎用户 {@link https://www.zhihu.com/people/-._.- mcfx} 破解：{@link https://www.zhihu.com/question/381784377/answer/1099438784 如何看待 2020 年 3 月 23 日哔哩哔哩将稿件的「av 号」变更为「BV 号」？ - 知乎 - mcfx 的回答}，但只支持 av < 2 ** 30 的情况。更完善的算法来自B站上的某个 JavaScript 文件，另 GitHub 上也有一份员工泄露版——但不管怎么说，目前版本应该就是B站实际使用版本，AV 最大值为 2 ** 51。
       * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/misc/bvid_desc.md SocialSisterYi/bilibili-API-collect · bvid说明}
       */
      bvTool: new class BvTool {
        constructor() {
          const XOR_CODE = 23442827791579n
          const MASK_CODE = 2251799813685247n
          const MAX_AID = 1n << 51n
          const BASE = 58n
          const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf'
          this.av2bv = av2bv
          this.bv2av = bv2av

          function av2bv(aid) {
            try {
              const bytes = ['B', 'V', '1', '0', '0', '0', '0', '0', '0', '0', '0', '0']
              let bvIndex = bytes.length - 1
              let tmp = (MAX_AID | BigInt(aid)) ^ XOR_CODE
              while (tmp > 0) {
                bytes[bvIndex] = data[Number(tmp % BigInt(BASE))]
                tmp /= BASE
                bvIndex -= 1
              }
              [bytes[3], bytes[9]] = [bytes[9], bytes[3]];
              [bytes[4], bytes[7]] = [bytes[7], bytes[4]]
              return bytes.join('')
            } catch {
              return null
            }
          }

          function bv2av(bvid) {
            try {
              const bvidArr = [...bvid];
              [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
              [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]]
              bvidArr.splice(0, 3)
              const tmp = bvidArr.reduce((pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)), 0n)
              return String((tmp & MASK_CODE) ^ XOR_CODE)
            } catch {
              return null
            }
          }
        }
      }(),

      /**
       * 从 URL 获取稿件 ID
       * @param {string} [url=location.href] 提取稿件 ID 的源字符串
       * @returns {{id: string, type: 'aid' | 'bvid'}} `{id, type}`
       */
      getVid(url = location.href) {
        let m = null
        if ((m = /(\/|bvid=)bv([\da-z]+)([#&/?]|$)/i.exec(url))) {
          return { id: 'BV' + m[2], type: 'bvid' }
        } else if ((m = /(\/(av)?|aid=)(\d+)([#&/?]|$)/i.exec(url))) { // 兼容 BV 号被第三方修改为 AV 号的情况
          return { id: m[3], type: 'aid' }
        }
        return null
      },

      /**
       * 从 URL 获取稿件 `aid`
       * @param {string} [url=location.href] 提取稿件 `aid` 的源字符串
       * @returns {string} `aid`
       */
      getAid(url = location.href) {
        const vid = this.getVid(url)
        if (!vid) return null
        return (vid.type === 'bvid') ? this.bvTool.bv2av(vid.id) : vid.id
      },

      /**
       * 从 URL 获取稿件 `bvid`
       * @param {string} [url=location.href] 提取稿件 `bvid` 的源字符串
       * @returns {string} `bvid`
       */
      getBvid(url = location.href) {
        const vid = this.getVid(url)
        if (!vid) return null
        return (vid.type === 'aid') ? this.bvTool.av2bv(vid.id) : vid.id
      },

      /**
       * 根据 `aid` 获取稿件的稍后再看状态
       * @param {string | number} aid 稿件 `aid`
       * @param {boolean} [reload] 是否重新加载
       * @param {boolean} [pageCache] 是否禁用页面缓存
       * @param {boolean} [localCache=true] 是否使用本地缓存
       * @returns {Promise<boolean>} 稿件是否在稍后再看中
       */
      async getVideoWatchlaterStatusByAid(aid, reload, pageCache, localCache = true) {
        const map = await this.getWatchlaterDataMap(item => String(item.aid), 'aid', reload, pageCache, localCache)
        return map.has(String(aid))
      },

      /**
       * 将稿件加入稍后再看，或从稍后再看移除
       * @param {string} id 稿件 `aid` 或 `bvid`（执行移除时优先选择 `aid`）
       * @param {boolean} [status=true] 添加 `true` / 移除 `false`
       * @returns {Promise<boolean>} 操作是否成功（稿件不在稍后在看中不被判定为失败）
       */
      async switchVideoWatchlaterStatus(id, status = true) {
        try {
          let typeA = /^\d+$/.test(id)
          if (!typeA && !status) { // 移除 API 只支持 aid，先作转换
            id = this.bvTool.bv2av(id)
            typeA = true
          }
          const data = new URLSearchParams()
          if (typeA) {
            data.append('aid', id)
          } else {
            data.append('bvid', id)
          }
          data.append('csrf', this.getCSRF())
          return await api.web.request({
            method: 'POST',
            url: status ? gm.url.api_addToWatchlater : gm.url.api_removeFromWatchlater,
            data,
          }, { parser: 'check', check: r => r.code === 0 })
        } catch (e) {
          api.logger.error(e)
          return false
        }
      },

      /**
       * 清空稍后再看
       * @returns {Promise<boolean>} 操作是否成功
       */
      async clearWatchlater() {
        try {
          const data = new URLSearchParams()
          data.append('csrf', this.getCSRF())
          const success = await api.web.request({
            method: 'POST',
            url: gm.url.api_clearWatchlater,
            data,
          }, { parser: 'check', check: r => r.code === 0 })
          if (success) {
            gm.runtime.reloadWatchlaterListData = true
            window.dispatchEvent(new CustomEvent('reloadWatchlaterListData'))
          }
          return success
        } catch (e) {
          api.logger.error(e)
          return false
        }
      },

      /**
       * 移除稍后再看已观看稿件
       * @returns {Promise<boolean>} 操作是否成功
       */
      async clearWatchedInWatchlater() {
        try {
          const data = new URLSearchParams()
          data.append('viewed', true)
          data.append('csrf', this.getCSRF())
          const success = await api.web.request({
            method: 'POST',
            url: gm.url.api_removeFromWatchlater,
            data,
          }, { parser: 'check', check: r => r.code === 0 })
          if (success) {
            gm.runtime.reloadWatchlaterListData = true
            window.dispatchEvent(new CustomEvent('reloadWatchlaterListData'))
          }
          return success
        } catch (e) {
          api.logger.error(e)
          return false
        }
      },

      /**
       * 使用稍后再看列表数据更新稍后再看历史数据
       * @param {boolean} [reload] 是否重新加载稍后再看列表数据
       */
      async updateRemoveHistoryData(reload) {
        if (gm.config.removeHistory) {
          const removeHistorySaveTime = GM_getValue('removeHistorySaveTime') ?? 0
          const removeHistorySavePeriod = GM_getValue('removeHistorySavePeriod') ?? gm.configMap.removeHistorySavePeriod.default
          if ((Date.now() - removeHistorySaveTime > removeHistorySavePeriod * 1000) && !gm.runtime.savingRemoveHistoryData) {
            gm.runtime.savingRemoveHistoryData = true
            await gm.data.watchlaterListData(reload).then(current => {
              if (current.length > 0) {
                if (gm.config.removeHistoryFuzzyCompare > 0) {
                  const ref = GM_getValue('removeHistoryFuzzyCompareReference')
                  let same = true
                  if (ref) {
                    for (let i = 0; i < gm.config.removeHistoryFuzzyCompare; i++) {
                      const c = current[i]
                      const r = ref[i]
                      if (c) { // 如果 current 没有数据直接跳过得了
                        if (r) {
                          if (c.bvid !== r) {
                            same = false
                            break
                          }
                        } else {
                          same = false
                          break
                        }
                      }
                    }
                  } else {
                    same = false
                  }
                  if (same) {
                    GM_setValue('removeHistorySaveTime', Date.now())
                    return
                  }
                  if (current.length >= gm.config.removeHistoryFuzzyCompare) {
                    const newRef = []
                    for (let i = 0; i < gm.config.removeHistoryFuzzyCompare; i++) {
                      newRef.push(current[i].bvid)
                    }
                    GM_setValue('removeHistoryFuzzyCompareReference', newRef)
                  } else {
                    // 若 current 长度不够，那么加进去也白搭
                    GM_deleteValue('removeHistoryFuzzyCompareReference')
                  }
                }

                const data = gm.data.removeHistoryData()
                let updated = false
                if (gm.config.removeHistoryTimestamp) {
                  const timestamp = Date.now()
                  const map = new Map()
                  for (const [index, record] of data.entries()) {
                    map.set(record[0], index)
                  }
                  for (let i = current.length - 1; i >= 0; i--) {
                    const item = current[i]
                    if (map.has(item.bvid)) {
                      const idx = map.get(item.bvid)
                      data.data[idx][2] = timestamp
                    } else {
                      data.enqueue([item.bvid, item.title, timestamp])
                    }
                  }
                  updated = true
                } else {
                  const set = new Set()
                  for (const record of data) {
                    set.add(record[0])
                  }
                  for (let i = current.length - 1; i >= 0; i--) {
                    const item = current[i]
                    if (!set.has(item.bvid)) {
                      data.enqueue([item.bvid, item.title])
                      updated = true
                    }
                  }
                }
                if (updated) {
                  GM_setValue('removeHistoryData', data)
                }
                // current.length === 0 时不更新
                // 不要提到前面，否则时间不准确
                GM_setValue('removeHistorySaveTime', Date.now())
              }
            }).finally(() => {
              gm.runtime.savingRemoveHistoryData = false
            })
          }
        }
      },

      /**
       * 获取稍后再看列表数据以指定值为键的映射
       * @param {(item: GMObject_data_item0) => *} key 计算键值的方法
       * @param {string} [cacheId] 缓存 ID，传入空值时不缓存
       * @param {boolean} [reload] 是否重新加载
       * @param {boolean} [pageCache] 是否使用页面缓存
       * @param {boolean} [localCache=true] 是否使用本地缓存
       * @returns {Promise<Map<string, GMObject_data_item0>>} 稍后再看列表数据以指定值为键的映射
       */
      async getWatchlaterDataMap(key, cacheId, reload, pageCache, localCache = true) {
        if (gm.runtime.reloadWatchlaterListData) {
          reload = true
        }
        let obj = null
        if (cacheId) {
          const $data = this.obj.#data
          if (!$data.watchlaterDataSet) {
            $data.watchlaterDataSet = {}
          }
          obj = $data.watchlaterDataSet
        }
        if (!obj?.[cacheId] || reload || !pageCache) {
          const map = new Map()
          const current = await gm.data.watchlaterListData(reload, pageCache, localCache)
          for (const item of current) {
            map.set(key(item), item)
          }
          if (cacheId) {
            obj[cacheId] = map
          } else {
            obj = map
          }
        }
        return cacheId ? obj[cacheId] : obj
      },

      /**
       * 清理 URL 上的查询参数
       */
      cleanSearchParams() {
        if (!location.search.includes(gm.id)) return
        let removed = false
        const url = new URL(location.href)
        for (const key of gm.searchParams.keys()) {
          if (key.startsWith(gm.id)) {
            url.searchParams.delete(key)
            removed ||= true
          }
        }
        if (removed && location.href !== url.href) {
          history.replaceState({}, null, url.href)
        }
      },

      /**
       * 获取格式化时间字符串
       * @param {number} [ts] Unix 时间戳
       * @param {string} [dd='-'] 年月日分隔符
       * @param {string} [tt=':'] 时分秒分隔符
       * @param {string} [td=' '] 日期/时间分隔符
       * @returns {string} 格式化时间字符串
       */
      getTimeString(ts, dd = '-', tt = ':', dt = ' ') {
        const pad = n => String(n).padStart(2, '0')
        const date = ts ? new Date(ts) : new Date()
        return (
          [
            date.getFullYear(),
            pad(date.getMonth() + 1),
            pad(date.getDay()),
          ].join(dd) + dt + [
            pad(date.getHours()),
            pad(date.getMinutes()),
            pad(date.getSeconds()),
          ].join(tt)
        )
      },

      /**
       * 将秒格式的时间转换为 (HH:)mm:ss 字符串形式
       * @param {number} s 秒格式的时间
       * @returns {string} 字符串形式
       */
      getSecondTimeString(s) {
        const pad = n => String(n).padStart(2, '0')
        const iH = Math.floor(s / 3600)
        const iM = Math.floor(s / 60) % 60
        const iS = s % 60
        return `${iH > 0 ? `${pad(iH)}:` : ''}${pad(iM)}:${pad(iS)}`
      },

      /**
       * 获取默认收藏夹 ID
       * @param {string} [uid] 用户 ID，缺省时指定当前登录用户
       * @returns {Promise<string>} `mlid`
       */
      async getDefaultMediaListId(uid = this.getDedeUserID()) {
        let mlid = GM_getValue(`defaultMediaList_${uid}`)
        if (!mlid) {
          const data = new URLSearchParams()
          data.append('up_mid', uid)
          data.append('type', 2)
          const resp = await api.web.request({
            url: `${gm.url.api_listFav}?${data.toString()}`,
          }, { check: r => r.code === 0 })
          mlid = String(resp.data.list[0].id)
          GM_setValue(`defaultMediaList_${uid}`, mlid)
        }
        return mlid
      },

      /**
       * 将稿件添加到收藏夹
       * @param {string} aid `aid`
       * @param {string} mlid 收藏夹 ID
       * @returns {Promise<boolean>} 操作是否成功
       */
      async addToFav(aid, mlid) {
        try {
          const data = new URLSearchParams()
          data.append('rid', aid)
          data.append('type', 2)
          data.append('add_media_ids', mlid)
          data.append('csrf', this.getCSRF())
          return await api.web.request({
            method: 'POST',
            url: gm.url.api_dealFav,
            data,
          }, { parser: 'check', check: r => r.code === 0 })
        } catch (e) {
          api.logger.error(e)
          return false
        }
      },

      /**
       * 获取稿件 `state` 说明
       * @param {number} state 稿件状态
       * @returns {string} 说明
       * @see {@link https://github.com/SocialSisterYi/bilibili-API-collect/blob/master/docs/video/attribute_data.md#state字段值稿件状态 state字段值(稿件状态)}
       */
      getItemStateDesc(state) {
        return ({
          1: '橙色通过',
          0: '开放浏览',
          [-1]: '待审',
          [-2]: '被打回',
          [-3]: '网警锁定',
          [-4]: '被锁定',
          [-5]: '管理员锁定',
          [-6]: '修复待审',
          [-7]: '暂缓审核',
          [-8]: '补档待审',
          [-9]: '等待转码',
          [-10]: '延迟审核',
          [-11]: '视频源待修',
          [-12]: '转储失败',
          [-13]: '允许评论待审',
          [-14]: '临时回收站',
          [-15]: '分发中',
          [-16]: '转码失败',
          [-20]: '创建未提交',
          [-30]: '创建已提交',
          [-40]: '定时发布',
          [-100]: '用户删除',
        })[state] ?? '未知状态'
      },
    }

    constructor() {
      this.method.obj = this
    }

    /**
     * 顶栏中加入稍后再看入口
     */
    async addHeaderButton() {
      const _self = this
      if (gm.config.headerCompatible === Enums.headerCompatible.bilibiliEvolved) {
        api.wait.$('.custom-navbar [data-name=watchlater]').then(el => {
          gm.runtime.headerType = '3rd-party'
          const watchlater = el.parentElement.appendChild(el.cloneNode(true))
          el.style.display = 'none'
          watchlater.querySelector('a.main-content').removeAttribute('href')
          watchlater.querySelector('.popup-container').style.display = 'none'
          processClickEvent(watchlater)
          processPopup(watchlater)
          const ob = new MutationObserver((mutations, observer) => {
            for (const mutation of mutations) {
              if (mutation.attributeName) {
                watchlater.setAttribute(mutation.attributeName, el.getAttribute(mutation.attributeName))
              }
            }
            observer.disconnect()
            watchlater.style.display = ''
            el.style.display = 'none'
            observer.observe(el, { attributes: true })
          })
          ob.observe(el, { attributes: true })
        })
        api.base.addStyle(`
          #${gm.id} .gm-entrypopup[data-compatible="${gm.config.headerCompatible}"] {
            padding-top: 1em;
          }
          #${gm.id} .gm-entrypopup[data-compatible="${gm.config.headerCompatible}"] .gm-popup-arrow {
            display: none;
          }
          #${gm.id} .gm-entrypopup[data-compatible="${gm.config.headerCompatible}"] .gm-entrypopup-page {
            box-shadow: rgb(0 0 0 / 20%) 0 4px 8px 0;
            border-radius: 8px;
            margin-top: -12px;
          }
        `)
      } else {
        const anchor = await api.wait.$('.user-con.signin, .bili-header__bar .right-entry .v-popover-wrap')
        if (anchor.classList.contains('user-con')) { // 传统顶栏
          gm.runtime.headerType = 'old'
          const collect = anchor.children[4]
          const watchlater = document.createElement('div')
          watchlater.className = 'item'
          watchlater.innerHTML = '<a><span class="name">稍后再看</span></a>'
          collect.before(watchlater)
          processClickEvent(watchlater)
          processPopup(watchlater)
        } else { // 新版顶栏
          gm.runtime.headerType = '2022'
          const collect = anchor.parentElement.children[4]
          const watchlater = document.createElement('li')
          watchlater.className = 'v-popover-wrap'
          watchlater.innerHTML = '<a class="right-entry__outside" style="cursor:pointer"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="right-entry-icon"><path d="M3.7 3.7l13.9 6.8-13.9 6.8V3.7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"></path></svg><span class="right-entry-text">稍后再看</span></a>'
          collect.before(watchlater)
          processClickEvent(watchlater)
          processPopup(watchlater)

          // 修复顶栏各项目间距在浏览器缩放倍率较大时不正确的问题
          try {
            // 「消息」间距优化
            anchor.parentElement.querySelector('.right-entry--message.right-entry__outside').classList.remove('right-entry__outside')
          } catch (e) {
            api.logger.error(e)
          }
        }
      }

      /**
       * 处理清空稍后再看
       * @returns {Promise<boolean>} 是否清空成功
       */
      async function clearWatchlater() {
        let success = false
        const result = await api.message.confirm('是否清空稍后再看？')
        if (result) {
          success = await _self.method.clearWatchlater()
          if (success && api.base.urlMatch(gm.regex.page_watchlaterList)) {
            location.reload()
          } else {
            api.message.info(`清空稍后再看${success ? '成功' : '失败'}`)
          }
        }
        return success
      }

      /**
       * 移除稍后再看已观看视频
       * @returns {Promise<boolean>} 是否移除成功
       */
      async function clearWatchedInWatchlater() {
        let success = false
        const result = await api.message.confirm('是否移除已观看视频？')
        if (result) {
          success = await _self.method.clearWatchedInWatchlater()
          if (success && api.base.urlMatch(gm.regex.page_watchlaterList)) {
            location.reload()
          } else {
            api.message.info(`移除已观看视频${success ? '成功' : '失败'}`)
          }
        }
        return success
      }

      /**
       * 处理鼠标点击事件
       * @param {HTMLElement} watchlater 稍后再看入口元素
       */
      function processClickEvent(watchlater) {
        const config = [gm.config.headerButtonOpL, gm.config.headerButtonOpM, gm.config.headerButtonOpR]
        /**
         * 处理鼠标点击事件
         * @param {1 | 2 | 3} button 左键 | 中键 | 右键
         */
        const process = button => {
          const cfg = config[button]
          switch (cfg) {
            case Enums.headerButtonOp.openListInCurrent:
            case Enums.headerButtonOp.openListInNew:
            case Enums.headerButtonOp.playAllInCurrent:
            case Enums.headerButtonOp.playAllInNew: {
              const action = getHeaderButtonOpConfig(cfg)
              action.href && window.open(action.href, action.target)
              break
            }
            case Enums.headerButtonOp.clearWatchlater: {
              clearWatchlater()
              break
            }
            case Enums.headerButtonOp.clearWatchedInWatchlater: {
              clearWatchedInWatchlater()
              break
            }
            case Enums.headerButtonOp.openUserSetting: {
              script.openUserSetting()
              break
            }
            case Enums.headerButtonOp.openRemoveHistory: {
              script.openRemoveHistory()
              break
            }
            case Enums.headerButtonOp.openBatchAddManager: {
              script.openBatchAddManager()
              break
            }
            case Enums.headerButtonOp.exportWatchlaterList: {
              script.exportWatchlaterList()
              break
            }
            default: {
              break
            }
          }
        }
        watchlater.addEventListener('mousedown', e => {
          if (e.button !== 2) {
            process(e.button)
            e.preventDefault()
          }
        })
        watchlater.addEventListener('contextmenu', e => {
          process(2) // 整合写进 mousedown 中会导致无法阻止右键菜单弹出
          e.preventDefault()
        })
      }

      /**
       * 处理弹出面板
       * @param {HTMLElement} watchlater 稍后再看元素
       */
      function processPopup(watchlater) {
        if (gm.config.headerMenu === Enums.headerMenu.disable) return
        gm.panel.entryPopup.el = document.createElement('div')
        const popup = gm.panel.entryPopup.el
        // 模仿官方顶栏弹出面板的弹出与关闭效果
        popup.fadeInFunction = 'cubic-bezier(0.68, -0.55, 0.27, 1.55)'
        popup.fadeOutFunction = 'cubic-bezier(0.6, -0.3, 0.65, 1)'
        popup.fadeOutNoInteractive = true
        // 此处必须用 over；若用 enter，且网页刚加载完成时鼠标正好在入口上，无法轻移鼠标以触发事件
        watchlater.addEventListener('mouseover', onOverWatchlater)
        watchlater.addEventListener('mouseleave', onLeaveWatchlater)
        popup.addEventListener('mouseenter', onEnterPopup)
        popup.addEventListener('mouseleave', onLeavePopup)

        /**
         * 鼠标是否在顶栏内
         * @param {MouseEvent} e 事件
         */
        function withinHeader(e) {
          const y = e.clientY
          const rect = watchlater.getBoundingClientRect()
          const trim = 2 // e.clientY 在旧标准中为长整型，向内修正以确保正确性（此处理论取 1 即可）
          return y >= rect.top + trim && y <= rect.bottom - trim
        }

        /**
         * 进入稍后再看入口的处理
         */
        function onOverWatchlater() {
          if (watchlater._mouseOver) return
          watchlater._mouseOver = true
          // 预加载数据，延时以在避免误触与加载速度间作平衡
          if (gm.config.watchlaterListCacheValidPeriod > 0) {
            setTimeout(() => {
              if (watchlater._mouseOver) {
                gm.data.watchlaterListData()
              }
            }, 25) // 以鼠标快速掠过不触发为准
          }
          // 完整加载，延时以避免误触
          // 误触率与弹出速度正相关，与数据加载时间无关
          setTimeout(() => {
            if (watchlater._mouseOver) {
              const isHeaderFixed = api.dom.findAncestor(watchlater, el => {
                const { position } = window.getComputedStyle(el)
                return position === 'fixed' || position === 'sticky'
              }, true)
              popup.style.position = isHeaderFixed ? 'fixed' : ''
              const rect = watchlater.getBoundingClientRect()
              popup.style.top = `${rect.bottom}px`
              popup.style.left = `calc(${(rect.left + rect.right) / 2}px - 16em)`
              openEntryPopup()
            }
          }, 125) // 以鼠标中速掠过不触发为准
        }

        /**
         * 离开稍后再看入口的处理
         * @param {MouseEvent} e 事件
         */
        function onLeaveWatchlater(e) {
          watchlater._mouseOver = false
          if (withinHeader(e)) {
            script.closePanelItem('entryPopup')
          } else {
            setTimeout(() => {
              if (!watchlater._mouseOver && !popup._mouseOver) {
                script.closePanelItem('entryPopup')
              }
            }, 150)
          }
        }

        /**
         * 进入弹出面板的处理
         */
        function onEnterPopup() {
          popup._mouseOver = true
        }

        /**
         * 离开弹出面板的处理
         */
        function onLeavePopup() {
          popup._mouseOver = false
          setTimeout(() => {
            if (!popup._mouseOver && !watchlater._mouseOver) {
              script.closePanelItem('entryPopup')
            }
          }, 50)
        }
      }

      /**
       * 打开弹出面板
       */
      function openEntryPopup() {
        if (gm.el.entryPopup) {
          script.openPanelItem('entryPopup')
        } else {
          /** @type {{[n: string]: HTMLElement}} */
          const el = {}
          setTimeout(() => {
            initPopup()
            processPopup()
            script.openPanelItem('entryPopup')
          })

          /**
           * 初始化
           */
          const initPopup = () => {
            const openLinkInCurrent = gm.config.openHeaderMenuLink === Enums.openHeaderMenuLink.openInCurrent
            const target = openLinkInCurrent ? '_self' : '_blank'
            gm.el.entryPopup = gm.el.gmRoot.appendChild(gm.panel.entryPopup.el)
            gm.el.entryPopup.dataset.headerType = gm.runtime.headerType ?? '2022'
            if (gm.config.headerCompatible !== Enums.headerCompatible.none) {
              gm.el.entryPopup.dataset.compatible = gm.config.headerCompatible
            }
            gm.el.entryPopup.className = 'gm-entrypopup'
            gm.el.entryPopup.innerHTML = `
              <div class="gm-popup-arrow"></div>
              <div class="gm-entrypopup-page">
                <div class="gm-popup-header">
                  <div class="gm-search">
                    <input type="text" placeholder="搜索... 支持关键字排除 ( - ) 及通配符 ( ? * )">
                    <div class="gm-search-clear">✖</div>
                  </div>
                  <div class="gm-popup-total" title="列表条目数">0</div>
                </div>
                <div class="gm-entry-list-empty">稍后再看列表为空</div>
                <div class="gm-entry-list"></div>
                <div class="gm-entry-list gm-entry-removed-list"></div>
                <div class="gm-entry-bottom">
                  <a class="gm-entry-button" fn="setting">设置</a>
                  <a class="gm-entry-button" fn="history">历史</a>
                  <a class="gm-entry-button" fn="export" title="右键点击可进行导出设置">导出</a>
                  <a class="gm-entry-button" fn="batchAdd">批量添加</a>
                  <a class="gm-entry-button" fn="removeAll">清空</a>
                  <a class="gm-entry-button" fn="removeWatched">移除已看</a>
                  <a class="gm-entry-button" fn="showAll" href="${gm.url.page_watchlaterList}" target="${target}">显示</a>
                  <a class="gm-entry-button" fn="playAll" href="${gm.url.page_watchlaterPlayAll}" target="${target}">播放</a>
                  <a class="gm-entry-button" fn="sortControl">
                    <div class="gm-select">
                      <div class="gm-selected" data-value="">排序</div>
                      <div class="gm-options">
                        <div class="gm-option" data-value="${Enums.sortType.fixed}">固定</div>
                        <div class="gm-option" data-value="${Enums.sortType.title}">标题</div>
                        ${gm.config.headerMenu === Enums.headerMenu.enable ? `
                          <div class="gm-option" data-value="${Enums.sortType.uploader}">UP主</div>
                          <div class="gm-option" data-value="${Enums.sortType.progress}">进度</div>
                        ` : ''}
                        <div class="gm-option" data-value="${Enums.sortType.pubtimeR}">发布↓</div>
                        <div class="gm-option" data-value="${Enums.sortType.pubtime}">发布</div>
                        <div class="gm-option" data-value="${Enums.sortType.durationR}">时长↓</div>
                        <div class="gm-option" data-value="${Enums.sortType.duration}">时长</div>
                        <div class="gm-option" data-value="${Enums.sortType.defaultR}">默认↓</div>
                        <div class="gm-option gm-option-selected" data-value="${Enums.sortType.default}">默认</div>
                      </div>
                    </div>
                  </a>
                  <a class="gm-entry-button" fn="autoRemoveControl">移除</a>
                </div>
              </div>
            `
            el.entryList = gm.el.entryPopup.querySelector('.gm-entry-list')
            el.entryRemovedList = gm.el.entryPopup.querySelector('.gm-entry-removed-list')
            el.entryListEmpty = gm.el.entryPopup.querySelector('.gm-entry-list-empty')
            el.entryHeader = gm.el.entryPopup.querySelector('.gm-popup-header')
            el.searchBox = gm.el.entryPopup.querySelector('.gm-search')
            el.search = el.searchBox.querySelector('.gm-search input')
            el.searchClear = el.searchBox.querySelector('.gm-search-clear')
            el.popupTotal = gm.el.entryPopup.querySelector('.gm-popup-total')
            el.entryBottom = gm.el.entryPopup.querySelector('.gm-entry-bottom')
          }

          /**
           * 维护内部元素
           */
          const processPopup = () => {
            gm.panel.entryPopup.openHandler = onOpen
            gm.panel.entryPopup.openedHandler = () => {
              if (gm.config.headerMenuSearch) {
                el.search.setSelectionRange(0, el.search.value.length)
                el.search.focus()
              }
            }

            if (gm.config.headerMenuSearch) {
              el.search.addEventListener('input', () => {
                const { search, searchClear } = el
                const m = /^\s+(.*)/.exec(search.value)
                if (m) {
                  search.value = m[1]
                  search.setSelectionRange(0, 0)
                }
                searchClear.style.visibility = search.value.length > 0 ? 'visible' : ''
              })
              el.search.addEventListener('input', api.base.throttle(() => {
                let val = el.search.value.trim()
                let include = null
                let exclude = null
                const isIncluded = str => str && include?.test(str)
                const isExcluded = str => str && exclude?.test(str)
                const lists = gm.config.headerMenuKeepRemoved ? [el.entryList, el.entryRemovedList] : [el.entryList]
                if (val.length > 0) {
                  try {
                    val = val.replaceAll(/[$()+.[\\\]^{|}]/g, '\\$&') // escape regex
                      .replaceAll('?', '.').replaceAll('*', '.*') // 通配符
                    for (const part of val.split(' ')) {
                      if (part) {
                        if (part.startsWith('-')) {
                          if (part.length === 1) continue
                          if (exclude) {
                            exclude += '|' + part.slice(1)
                          } else {
                            exclude = part.slice(1)
                          }
                        } else {
                          if (include) {
                            include += '|' + part
                          } else {
                            include = part
                          }
                        }
                      }
                    }
                    if (!include && exclude) {
                      include = '.*'
                    }
                    include &&= new RegExp(include, 'i')
                    exclude &&= new RegExp(exclude, 'i')
                  } catch {
                    include = exclude = null
                  }
                }
                const cnt = [0, 0]
                for (const [i, list] of lists.entries()) {
                  if (list.total > 0) {
                    for (let j = 0; j < list.childElementCount; j++) {
                      let valid = false
                      const card = list.children[j]
                      if (include || exclude) {
                        if ((isIncluded(card.vTitle) || isIncluded(card.uploader)) && !(isExcluded(card.vTitle) || isExcluded(card.uploader))) {
                          valid = true
                        }
                      } else {
                        valid = true
                      }
                      if (valid) {
                        cnt[i] += 1
                        card.classList.remove('gm-filtered')
                      } else {
                        card.classList.add('gm-filtered')
                      }
                    }
                    list.scrollTop = 0
                  }
                }
                el.popupTotal.textContent = String(cnt[0])
                el.entryListEmpty.style.display = cnt[0] ? '' : 'unset'
              }, gm.const.inputThrottleWait))
              el.searchClear.addEventListener('click', () => {
                el.search.value = ''
                el.search.dispatchEvent(new Event('input'))
              })
              if (gm.config.searchDefaultValue) {
                el.search.addEventListener('mousedown', e => {
                  if (e.button === 1) {
                    GM_deleteValue('searchDefaultValue_value')
                    api.message.info('已清空搜索框默认值')
                    e.preventDefault()
                  } else if (e.button === 2) {
                    GM_setValue('searchDefaultValue_value', el.search.value.trim())
                    api.message.info('已保存搜索框默认值')
                    e.preventDefault()
                  }
                })
                el.search.addEventListener('contextmenu', e => e.preventDefault())

                const updateSearchTitle = e => {
                  let v = e ? e.detail.value : GM_getValue('searchDefaultValue_value')
                  if (!v) v = v === '' ? '[ 空 ]' : '[ 未设置 ]'
                  el.searchBox.title = gm.const.searchDefaultValueHint.replace('$1', v)
                }
                updateSearchTitle()
                window.addEventListener('updateSearchTitle', updateSearchTitle)
              }
            } else {
              el.entryHeader.style.display = 'none'
            }

            el.entryFn = {}
            for (const button of el.entryBottom.querySelectorAll('.gm-entry-button')) {
              const fn = button.getAttribute('fn')
              if (fn) {
                el.entryFn[fn] = button
              }
            }

            // 排序控制器
            {
              el.entryFn.sortControl.control = el.entryFn.sortControl.firstElementChild
              const { control } = el.entryFn.sortControl
              const selected = control.selected = control.children[0]
              const options = control.options = control.children[1]

              const defaultSelect = options.querySelector('.gm-option-selected') ?? options.firstElementChild
              if (gm.config.autoSort !== Enums.autoSort.default) {
                let type = gm.config.autoSort
                if (type === Enums.autoSort.auto) {
                  type = GM_getValue('autoSort_auto')
                  if (!type) {
                    type = Enums.sortType.default
                    GM_setValue('autoSort_auto', type)
                  }
                }
                selected.option = options.querySelector(`[data-value="${type}"]`)
                if (selected.option) {
                  defaultSelect?.classList.remove('gm-option-selected')
                  selected.option.classList.add('gm-option-selected')
                  selected.dataset.value = selected.option.dataset.value
                } else if (gm.config.autoSort === Enums.autoSort.auto) {
                  type = Enums.sortType.default
                  GM_setValue('autoSort_auto', type)
                }
              }
              if (!selected.option) {
                selected.option = defaultSelect
                if (selected.option) {
                  selected.option.classList.add('gm-option-selected')
                  selected.dataset.value = selected.option.dataset.value
                }
              }

              if (gm.config.headerMenuSortControl) {
                el.entryFn.sortControl.setAttribute('enabled', '')
                options.fadeOutNoInteractive = true

                el.entryFn.sortControl.addEventListener('click', () => {
                  if (!control.selecting) {
                    control.selecting = true
                    api.dom.fade(true, options)
                  }
                })
                el.entryFn.sortControl.addEventListener('mouseenter', () => {
                  control.selecting = true
                  api.dom.fade(true, options)
                })
                el.entryFn.sortControl.addEventListener('mouseleave', () => {
                  control.selecting = false
                  api.dom.fade(false, options)
                })
                options.addEventListener('click', /** @param {MouseEvent} e */ e => {
                  control.selecting = false
                  api.dom.fade(false, options)
                  const val = e.target.dataset.value
                  if (selected.dataset.value !== val) {
                    selected.option.classList.remove('gm-option-selected')
                    selected.dataset.value = val
                    selected.option = e.target
                    selected.option.classList.add('gm-option-selected')
                    if (gm.config.autoSort === Enums.autoSort.auto) {
                      GM_setValue('autoSort_auto', val)
                    }
                    sort(val)
                  }
                })
              }
            }

            // 自动移除控制器
            const cfgAutoRemove = gm.config.autoRemove
            const autoRemove = cfgAutoRemove === Enums.autoRemove.always || cfgAutoRemove === Enums.autoRemove.openFromList
            el.entryFn.autoRemoveControl.autoRemove = autoRemove
            if (gm.config.headerMenuAutoRemoveControl) {
              if (cfgAutoRemove === Enums.autoRemove.absoluteNever) {
                el.entryFn.autoRemoveControl.setAttribute('disabled', '')
                el.entryFn.autoRemoveControl.addEventListener('click', () => {
                  api.message.info('当前彻底禁用自动移除功能，无法执行操作')
                })
              } else {
                if (autoRemove) {
                  el.entryFn.autoRemoveControl.classList.add('gm-popup-auto-remove')
                }
                el.entryFn.autoRemoveControl.addEventListener('click', () => {
                  const target = el.entryFn.autoRemoveControl
                  if (target.autoRemove) {
                    target.classList.remove('gm-popup-auto-remove')
                    api.message.info('已临时关闭自动移除功能')
                  } else {
                    target.classList.add('gm-popup-auto-remove')
                    api.message.info('已临时开启自动移除功能')
                  }
                  target.autoRemove = !target.autoRemove
                })
              }
              el.entryFn.autoRemoveControl.setAttribute('enabled', '')
            }
            // 常规项
            if (gm.config.headerMenuFnSetting) {
              el.entryFn.setting.setAttribute('enabled', '')
              el.entryFn.setting.addEventListener('click', () => script.openUserSetting())
            }
            if (gm.config.headerMenuFnHistory) {
              el.entryFn.history.setAttribute('enabled', '')
              el.entryFn.history.addEventListener('click', () => script.openRemoveHistory())
            }
            if (gm.config.headerMenuFnExport) {
              el.entryFn.export.setAttribute('enabled', '')
              el.entryFn.export.addEventListener('click', () => script.exportWatchlaterList())
              el.entryFn.export.addEventListener('contextmenu', e => {
                e.preventDefault()
                script.setExportWatchlaterList()
              })
            }
            if (gm.config.headerMenuFnBatchAdd) {
              el.entryFn.batchAdd.setAttribute('enabled', '')
              el.entryFn.batchAdd.addEventListener('click', () => script.openBatchAddManager())
            }
            if (gm.config.headerMenuFnRemoveAll) {
              el.entryFn.removeAll.setAttribute('enabled', '')
              el.entryFn.removeAll.addEventListener('click', () => {
                script.closePanelItem('entryPopup')
                clearWatchlater()
              })
            }
            if (gm.config.headerMenuFnRemoveWatched) {
              el.entryFn.removeWatched.setAttribute('enabled', '')
              el.entryFn.removeWatched.addEventListener('click', () => {
                script.closePanelItem('entryPopup')
                clearWatchedInWatchlater()
              })
            }
            if (gm.config.headerMenuFnShowAll) {
              el.entryFn.showAll.setAttribute('enabled', '')
            }
            if (gm.config.headerMenuFnPlayAll) {
              el.entryFn.playAll.setAttribute('enabled', '')
            }
            if (el.entryBottom.querySelectorAll('[enabled]').length === 0) {
              el.entryBottom.style.display = 'none'
            }
          }

          /**
           * 打开时弹出面板时执行
           */
          const onOpen = async () => {
            // 上半区被移除卡片先于下半区被查询到，恰巧使得后移除稿件最后生成在被移除列表前方，无须额外排序
            const rmCards = gm.config.headerMenuKeepRemoved ? gm.el.entryPopup.querySelectorAll('.gm-removed') : null
            let rmBvid = null
            if (rmCards?.length > 0) {
              rmBvid = new Set()
              for (const rmCard of rmCards) {
                rmBvid.add(rmCard.bvid)
              }
            }
            gm.panel.entryPopup.sortType = Enums.sortType.default
            el.popupTotal.textContent = '0'
            el.entryList.textContent = ''
            el.entryList.total = 0
            el.entryRemovedList.textContent = ''
            el.entryRemovedList.total = 0
            const data = await gm.data.watchlaterListData()
            const simplePopup = gm.config.headerMenu === Enums.headerMenu.enableSimple
            let serial = 0
            if (data.length > 0) {
              const uid = _self.method.getDedeUserID()
              const fixedItems = GM_getValue(`fixedItems_${uid}`) ?? []
              const openLinkInCurrent = gm.config.openHeaderMenuLink === Enums.openHeaderMenuLink.openInCurrent
              const { autoRemoveControl } = el.entryFn
              for (const item of data) {
                /** @type {HTMLAnchorElement} */
                const card = el.entryList.appendChild(document.createElement('a'))
                card.serial = serial++
                const valid = item.state >= 0
                card.vTitle = item.title
                card.bvid = item.bvid
                card.duration = item.duration
                card.pubtime = item.pubdate
                if ((rmBvid?.size > 0) && rmBvid.has(card.bvid)) {
                  rmBvid.delete(card.bvid)
                }
                if (simplePopup) {
                  if (valid) {
                    card.textContent = card.vTitle
                  } else {
                    card.innerHTML = `<b>[${_self.method.getItemStateDesc(item.state)}]</b> ${card.vTitle}`
                  }
                  card.className = 'gm-entry-list-simple-item'
                } else {
                  card.uploader = item.owner.name
                  const multiP = item.videos > 1
                  const duration = _self.method.getSecondTimeString(item.duration)
                  const durationP = multiP ? `${item.videos}P` : duration
                  if (item.progress < 0) {
                    item.progress = card.duration
                  }
                  const played = item.progress > 0
                  card.progress = (multiP && played) ? card.duration : item.progress
                  let progress = ''
                  if (played) {
                    progress = multiP ? '已观看' : _self.method.getSecondTimeString(item.progress)
                  }
                  card.className = `gm-entry-list-item${multiP ? ' gm-card-multiP' : ''}`
                  card.innerHTML = `
                    <div class="gm-card-left">
                      <img class="gm-card-cover" src="${item.pic}@156w_88h_1c_100q.webp">
                      <div class="gm-card-switcher"></div>
                      <div class="gm-card-duration">
                        <div${multiP ? ' class="gm-hover"' : ''}>${duration}</div>
                        ${multiP ? `<div>${durationP}</div>` : ''}
                      </div>
                    </div>
                    <div class="gm-card-right">
                      <div class="gm-card-title" title="${card.vTitle}">${valid ? card.vTitle : `<b>[${_self.method.getItemStateDesc(item.state)}]</b> ${card.vTitle}`}</div>
                      <a class="gm-card-uploader" target="_blank" href="${gm.url.page_userSpace(item.owner.mid)}">${card.uploader}</a>
                      <div class="gm-card-corner">
                        <span class="gm-card-progress">${progress}</span>
                        <span class="gm-card-fixer gm-hover" title="${gm.const.fixerHint}">固定</span>
                        <span class="gm-card-collector gm-hover" title="将稿件移动至指定收藏夹">收藏</span>
                      </div>
                    </div>
                  `
                  if (played) {
                    card.querySelector('.gm-card-progress').style.display = 'unset'
                  }

                  const switchStatus = async (status, dispInfo = true) => {
                    if (status) { // 先改了 UI 再说，不要给用户等待感
                      card.classList.remove('gm-removed')
                    } else {
                      card.classList.add('gm-removed')
                    }
                    const note = status ? '添加到稍后再看' : '从稍后再看移除'
                    const success = await _self.method.switchVideoWatchlaterStatus(item.aid, status)
                    if (success) {
                      card.added = status
                      if (card.fixed) {
                        card.fixed = false
                        gm.data.fixedItem(card.bvid, false)
                        card.classList.remove('gm-fixed')
                      }
                      dispInfo && api.message.info(`${note}成功`)
                      gm.runtime.reloadWatchlaterListData = true
                      window.dispatchEvent(new CustomEvent('reloadWatchlaterListData'))
                    } else {
                      if (card.added) {
                        card.classList.remove('gm-removed')
                      } else {
                        card.classList.add('gm-removed')
                      }
                      dispInfo && api.message.info(`${note}失败`)
                    }
                  }

                  card.added = true
                  card.querySelector('.gm-card-switcher').addEventListener('click', e => {
                    e.preventDefault()
                    e.stopPropagation() // 兼容第三方的「链接转点击事件」处理
                    switchStatus(!card.added)
                  })

                  card.querySelector('.gm-card-collector').addEventListener('click', e => {
                    e.preventDefault() // 不能放到 async 中
                    e.stopPropagation() // 兼容第三方的「链接转点击事件」处理
                    setTimeout(async () => {
                      const uid = _self.method.getDedeUserID()
                      let mlid = GM_getValue(`watchlaterMediaList_${uid}`)
                      let dmlid = false
                      if (!mlid) {
                        mlid = await _self.method.getDefaultMediaListId(uid)
                        dmlid = true
                      }
                      const success = await _self.method.addToFav(item.aid, mlid)
                      if (success) {
                        api.message.info(dmlid ? '移动至默认收藏夹成功' : '移动至指定收藏夹成功')
                        if (card.added) {
                          switchStatus(false, false)
                        }
                      } else {
                        api.message.info(dmlid ? '移动至默认收藏夹失败' : `移动至收藏夹 ${mlid} 失败，请确认该收藏夹是否存在`)
                      }
                    })
                  })

                  const fixer = card.querySelector('.gm-card-fixer')
                  fixer.addEventListener('click', e => {
                    e.preventDefault()
                    e.stopPropagation() // 兼容第三方的「链接转点击事件」处理
                    if (card.fixed) {
                      card.classList.remove('gm-fixed')
                    } else {
                      card.classList.add('gm-fixed')
                    }
                    card.fixed = !card.fixed
                    gm.data.fixedItem(card.bvid, card.fixed)
                  })
                  fixer.addEventListener('contextmenu', e => {
                    e.preventDefault()
                    script.clearFixedItems()
                  })
                }
                const fixedIdx = fixedItems.indexOf(card.bvid)
                if (fixedIdx >= 0) {
                  fixedItems.splice(fixedIdx, 1)
                  card.fixed = true
                  card.classList.add('gm-fixed')
                }
                if (valid) {
                  card.target = openLinkInCurrent ? '_self' : '_blank'
                  card.href = gm.config.redirect ? `${gm.url.page_videoNormalMode}/${card.bvid}` : `${gm.url.page_listWatchlaterMode}?bvid=${card.bvid}`
                  if (gm.config.autoRemove !== Enums.autoRemove.absoluteNever) {
                    const excludes = '.gm-card-switcher, .gm-card-uploader, .gm-card-fixer, .gm-card-collector'
                    card._href = card.href
                    card.addEventListener('mousedown', e => {
                      if (e.button === 0 || e.button === 1) { // 左键或中键
                        if (card.fixed) return
                        if (!simplePopup && e.target.matches(excludes)) return
                        if (autoRemoveControl.autoRemove) {
                          if (gm.config.autoRemove !== Enums.autoRemove.always) {
                            const url = new URL(card.href)
                            url.searchParams.set(`${gm.id}_remove`, 'true')
                            card.href = url.href
                          } else {
                            card.href = card._href
                          }
                        } else {
                          if (gm.config.autoRemove === Enums.autoRemove.always) {
                            const url = new URL(card.href)
                            url.searchParams.set(`${gm.id}_disable_remove`, 'true')
                            card.href = url.href
                          } else {
                            card.href = card._href
                          }
                        }
                      }
                    })
                    card.addEventListener('mouseup', e => {
                      if (e.button === 0 || e.button === 1) { // 左键或中键
                        if (card.fixed) return
                        if (!simplePopup) {
                          if (!card.added) return
                          if (e.target.matches(excludes)) return
                        }
                        if (autoRemoveControl.autoRemove) {
                          card.classList.add('gm-removed')
                          card.added = false
                          gm.runtime.reloadWatchlaterListData = true
                          // 移除由播放页控制，此时并为实际发生，不分发重载列表事件
                        }
                      }
                    })
                  }
                } else {
                  card.classList.add('gm-invalid')
                }
              }
              el.entryList.total = data.length
              el.entryListEmpty.style.display = ''

              // 现在仍在 fixedItems 中的是无效固定项，将它们移除
              // 仅在列表项不为空时才执行移除，因为「列表项为空」有可能是一些特殊情况造成的误判
              for (const item of fixedItems) {
                gm.data.fixedItem(item, false)
              }
            } else {
              el.entryListEmpty.style.display = 'unset'
            }

            // 添加已移除稿件
            if (rmCards?.length > 0) {
              const addedBvid = new Set()
              for (const rmCard of rmCards) {
                rmCard.serial = serial++
                const { bvid } = rmCard
                if (addedBvid.has(bvid)) continue
                if (rmBvid.has(bvid)) {
                  if (rmCard.style.display === 'none') {
                    rmCard.style.display = ''
                  }
                } else {
                  rmCard.style.display = 'none'
                }
                el.entryRemovedList.append(rmCard)
                addedBvid.add(bvid)
              }
            }
            if (rmBvid?.size > 0) {
              const only1 = rmBvid.size === 1
              const h = simplePopup ? (only1 ? 6 : 9) : (only1 ? 6.4 : 11)
              el.entryList.style.height = `${42 - h}em`
              el.entryRemovedList.style.height = `${h}em`
              el.entryRemovedList.style.display = 'flex'
              el.entryRemovedList.total = rmBvid.size
              for (const fixedEl of el.entryRemovedList.querySelectorAll('.gm-fixed')) {
                fixedEl.classList.remove('gm-fixed')
                fixedEl.fixed = false
              }
            } else {
              el.entryList.style.height = ''
              el.entryRemovedList.style.display = ''
            }

            el.popupTotal.textContent = String(el.entryList.total)
            if (gm.config.removeHistory && gm.config.removeHistorySavePoint === Enums.removeHistorySavePoint.listAndMenu) {
              _self.method.updateRemoveHistoryData()
            }

            gm.el.entryPopup.style.display = 'unset'
            el.entryList.scrollTop = 0
            el.entryRemovedList.scrollTop = 0

            const sortType = el.entryFn.sortControl.control.selected.dataset.value
            sortType && sort(sortType)

            if (gm.config.searchDefaultValue) {
              const sdv = GM_getValue('searchDefaultValue_value')
              if (typeof sdv === 'string' && sdv) {
                el.search.value = `${sdv} `
              }
            }
            if (el.search.value.length > 0) {
              el.search.dispatchEvent(new Event('input'))
            }
          }

          /**
           * 对弹出面板列表中的内容进行排序
           * @param {sortType} type 排序类型
           */
          const sort = type => {
            if (type === gm.panel.entryPopup.sortType) return
            const prevBase = gm.panel.entryPopup.sortType.replace(/:R$/, '')
            gm.panel.entryPopup.sortType = type
            if (type === Enums.sortType.fixed) {
              type = Enums.sortType.default
              el.entryList.setAttribute('sort-type-fixed', '')
            } else {
              el.entryList.removeAttribute('sort-type-fixed')
            }
            const reverse = type.endsWith(':R')
            const k = type.replace(/:R$/, '')

            const lists = []
            if (el.entryList.total > 1) {
              lists.push(el.entryList)
            }
            if (el.entryRemovedList.total > 1) {
              lists.push(el.entryRemovedList)
            }
            for (const list of lists) {
              if (k !== prevBase) {
                const cards = [...list.querySelectorAll('.gm-entry-list-item')]
                cards.sort((a, b) => {
                  const va = a[k]
                  const vb = b[k]
                  return (typeof va === 'string') ? va.localeCompare(vb) : (va - vb)
                })
                for (const [idx, card] of cards.entries()) {
                  card.style.order = idx
                }
              }
              if (reverse) {
                list.setAttribute('gm-list-reverse', '')
                list.scrollTop = -list.scrollHeight

                // column-reverse + order + flex-end 无法生成滚动条
                // 只能改用一个定位元素加 margin: auto 来实现 flex-end 效果
                if (!list.querySelector('.gm-list-reverse-end')) {
                  const listEnd = document.createElement('div')
                  listEnd.className = 'gm-list-reverse-end'
                  list.append(listEnd)
                }
              } else {
                list.removeAttribute('gm-list-reverse')
                list.scrollTop = 0
              }
            }
          }
        }
      }

      /**
       * 获取入口点击的链接设置
       * @param {headerButtonOp} op
       * @returns {{href: string, target: '_self' | '_blank'}}
       */
      function getHeaderButtonOpConfig(op) {
        const result = {}
        switch (op) {
          case Enums.headerButtonOp.openListInCurrent:
          case Enums.headerButtonOp.openListInNew: {
            result.href = gm.url.page_watchlaterList
            break
          }
          case Enums.headerButtonOp.playAllInCurrent:
          case Enums.headerButtonOp.playAllInNew: {
            result.href = gm.url.page_watchlaterPlayAll
            break
          }
          default: {
            break
          }
        }
        if (result.href) {
          switch (op) {
            case Enums.headerButtonOp.openListInNew:
            case Enums.headerButtonOp.playAllInNew: {
              result.target = '_blank'
              break
            }
            default: {
              result.target = '_self'
            }
          }
        }
        return result
      }
    }

    /**
     * 填充稍后再看状态
     */
    fillWatchlaterStatus() {
      const _self = this
      /** @type {Map<string, GMObject_data_item0>} */
      let map = null
      const initMap = async () => {
        map = await this.method.getWatchlaterDataMap(item => String(item.aid), 'aid', false, true)
      }
      if (api.base.urlMatch(gm.regex.page_dynamicMenu)) { // 必须在动态页之前匹配
        fillWatchlaterStatus_dynamicMenu() // 旧版动态面板
        return
      }
      if (api.base.urlMatch(gm.regex.page_dynamic)) {
        if (location.pathname === '/') { // 仅动态主页
          api.wait.$('.bili-dyn-list').then(async () => {
            api.wait.executeAfterElementLoaded({
              selector: '.bili-dyn-list-tabs__item:not(#gm-batch-manager-btn)',
              base: await api.wait.$('.bili-dyn-list-tabs__list'),
              multiple: true,
              callback: tab => {
                tab.addEventListener('click', refillDynamicWatchlaterStatus)
              },
            })
            fillWatchlaterStatus_dynamic()
          })
        }
      } else if (api.base.urlMatch(gm.regex.page_userSpace)) {
        api.wait.$('.bili-dyn-list').then(() => {
          api.wait.$('#navigator .n-btn.n-dynamic').then(btn => {
            btn.addEventListener('click', refillDynamicWatchlaterStatus)
          })
          fillWatchlaterStatus_dynamic()
        })

        if (gm.config.fillWatchlaterStatus === Enums.fillWatchlaterStatus.anypage) {
          fillWatchlaterStatus_main()
        }
      } else {
        // 两部分 URL 刚好不会冲突，放到 else 中即可
        switch (gm.config.fillWatchlaterStatus) {
          case Enums.fillWatchlaterStatus.dynamicAndVideo: {
            if (api.base.urlMatch([gm.regex.page_videoNormalMode, gm.regex.page_videoWatchlaterMode, gm.regex.page_listMode])) {
              fillWatchlaterStatus_main()
            }
            break
          }
          case Enums.fillWatchlaterStatus.anypage: {
            fillWatchlaterStatus_main()
            break
          }
          default: {
            break
          }
        }
      }
      fillWatchlaterStatus_dynamicPopup()

      window.addEventListener('reloadWatchlaterListData', api.base.debounce(refillDynamicWatchlaterStatus, 2000))

      /**
       * 填充动态页稍后再看状态
       */
      async function fillWatchlaterStatus_dynamic() {
        await initMap()
        const feed = await api.wait.$('.bili-dyn-list__items')
        api.wait.executeAfterElementLoaded({
          selector: '.bili-dyn-card-video',
          base: feed,
          multiple: true,
          repeat: true,
          timeout: 0,
          callback: async video => {
            let vue = video.__vue__
            if (vue) {
              // 初始的卡片的 Vue 对象中缺少关键数据、缺少操作稍后再看状态按钮的方法与状态
              // 需要用户将鼠标移至稍后再看按钮，才会对以上数据、状态等进行加载，这里要模拟一下这个操作
              if (!vue.data.aid || !vue.mark) {
                const mark = await api.wait.$('.bili-dyn-card-video__mark', video)
                mark.dispatchEvent(new Event('mouseenter')) // 触发初始化
                await api.wait.waitForConditionPassed({
                  condition: () => video.__vue__.data.aid && video.__vue__.mark,
                })
                vue = video.__vue__ // 此时卡片 Vue 对象发生了替换！
              }
              const aid = String(vue.data.aid)
              if (map.has(aid)) {
                vue.mark.done = true
              }
            }
          },
        })
      }

      /**
       * 填充动态面板稍后再看状态
       *
       * 注意：这里只是简单修改显示效果，内部状态没有被修改。因此当用户第一次点击稍后再看控件，控件会继续显示「✓」状态，
       *    且此时内部状态真正被修改为「稍后再看」状态。
       */
      async function fillWatchlaterStatus_dynamicPopup() {
        await initMap()
        api.wait.executeAfterElementLoaded({
          selector: '.dynamic-panel-popover .header-dynamic-list-item',
          multiple: true,
          repeat: true,
          timeout: 0,
          callback: async item => {
            const aid = webpage.method.getAid(item.parentElement.href)
            if (map.has(aid)) {
              // 官方的实现太复杂，这里改一下显示效果算了
              const svg = await api.wait.$('.watch-later svg', item)
              svg.innerHTML = '<path d="M176.725 56.608c1.507 1.508 2.44 3.591 2.44 5.892s-.932 4.384-2.44 5.892l-92.883 92.892c-2.262 2.264-5.388 3.664-8.842 3.664s-6.579-1.4-8.842-3.664l-51.217-51.225a8.333 8.333 0 1 1 11.781-11.785l48.277 48.277 89.942-89.942c1.508-1.507 3.591-2.44 5.892-2.44s4.384.932 5.892 2.44z" fill="currentColor"></path>'
            }
          },
        })
      }

      /**
       * 填充旧版动态面板稍后再看状态
       */
      async function fillWatchlaterStatus_dynamicMenu() {
        await initMap()
        api.wait.executeAfterElementLoaded({
          selector: '.list-item',
          base: await api.wait.$('.video-list'),
          multiple: true,
          repeat: true,
          timeout: 0,
          callback: video => {
            const vue = video.__vue__
            if (vue) {
              const aid = String(vue.aid)
              if (map.has(aid)) {
                vue.added = true
              }
            }
          },
        })
      }

      /**
       * 填充稍后再看状态（通用逻辑）
       */
      async function fillWatchlaterStatus_main() {
        await initMap()
        api.wait.executeAfterElementLoaded({
          selector: '.watch-later-video, .watch-later-trigger, .watch-later, .w-later',
          base: document.body,
          multiple: true,
          repeat: true,
          timeout: 0,
          callback: video => {
            const vue = video.__vue__
            if (vue) {
              const aid = String(vue.aid)
              if (map.has(aid)) {
                vue.added = true
              }
            }
          },
        })

        if (api.base.urlMatch(gm.regex.page_search)) {
          // 新版搜索页面
          api.wait.executeAfterElementLoaded({
            selector: '.bili-video-card .bili-video-card__wrap > [data-mod="search-card"]',
            base: document.body,
            multiple: true,
            repeat: true,
            timeout: 0,
            callback: async card => {
              const aid = webpage.method.getAid(card.href)
              if (map.has(aid)) {
                const svg = await api.wait.$('.bili-watch-later svg', card)
                svg.innerHTML = '<use xlink:href="#widget-watch-save"></use>'
              }
            },
          })
        } else if (api.base.urlMatch(gm.regex.page_userSpace)) {
          // 用户空间
          api.wait.executeAfterElementLoaded({
            selector: '.section.video [data-aid]',
            base: document.body,
            multiple: true,
            repeat: true,
            timeout: 0,
            callback: async item => {
              const aid = webpage.method.bvTool.bv2av(item.dataset.aid) // data-aid 实际上是 bvid
              if (map.has(aid)) {
                const wl = await api.wait.$('.i-watchlater', item)
                wl.classList.add('has-select')
              }
            },
          })
        }
      }

      /**
       * 重新填充与动态相关的稍后再看状态
       *
       * 注意：实际应用中，并没有严格在所有需要更新状态的地方都调用该方法，否则太繁杂了。比如在动态主页点击视频卡片切换稍后再看
       *     状态，理论上应该更新动态面板，但并没有这么做。
       */
      async function refillDynamicWatchlaterStatus() {
        map = await _self.method.getWatchlaterDataMap(item => String(item.aid), 'aid', true)

        // 更新动态主页稍后再看状态
        if (api.base.urlMatch([gm.regex.page_dynamic, gm.regex.page_userSpace])) {
          // 对动态主页：map 更新期间，ob 偷跑可能会将错误的数据写入，重新遍历并修正之
          // 对空间动态：切换 Tab 会导致「空间动态」被销毁，在其生成时要重新执行逻辑
          if (api.base.urlMatch([gm.regex.page_userSpace])) {
            // 确保真的已经重新生成了
            const firstVideo = await api.wait.$('.bili-dyn-list .bili-dyn-card-video')
            await api.wait.waitForConditionPassed({
              condition: () => {
                // 最开始会获得一个 vue 对象，但那个 vue 对象上没有东西且会被替换，因此要将这一过程放在条件判断中而不能拆分
                const vue = firstVideo.__vue__
                return vue && vue.data.aid && vue.mark
              },
            })
          }
          const feed = document.querySelector('.bili-dyn-list') // 更新已有项状态，同步找就行了
          if (feed) {
            for (const video of feed.querySelectorAll('.bili-dyn-card-video')) {
              const vue = video.__vue__
              if (vue && vue.data.aid && vue.mark) {
                const aid = String(vue.data.aid)
                vue.mark.done = map.has(aid)
              }
            }
          }
        }

        // 更新顶栏动态面板稍后再看状态
        for (const item of document.querySelectorAll('.dynamic-panel-popover .header-dynamic-list-item')) {
          const aid = webpage.method.getAid(item.parentElement.href)
          if (aid == null) continue
          const svg = await api.wait.$('.watch-later svg', item)
          svg.innerHTML = map.has(aid) ? '<path d="M176.725 56.608c1.507 1.508 2.44 3.591 2.44 5.892s-.932 4.384-2.44 5.892l-92.883 92.892c-2.262 2.264-5.388 3.664-8.842 3.664s-6.579-1.4-8.842-3.664l-51.217-51.225a8.333 8.333 0 1 1 11.781-11.785l48.277 48.277 89.942-89.942c1.508-1.507 3.591-2.44 5.892-2.44s4.384.932 5.892 2.44z" fill="currentColor"></path>' : '<path d="M17.5 100c0-45.563 36.937-82.5 82.501-82.5 44.504 0 80.778 35.238 82.442 79.334l-7.138-7.137a7.5 7.5 0 0 0-10.607 10.606l20.001 20a7.5 7.5 0 0 0 10.607 0l20.002-20a7.5 7.5 0 0 0-10.607-10.606l-7.245 7.245c-1.616-52.432-44.63-94.441-97.455-94.441-53.848 0-97.501 43.652-97.501 97.5s43.653 97.5 97.501 97.5c32.719 0 61.673-16.123 79.346-40.825a7.5 7.5 0 0 0-12.199-8.728c-14.978 20.934-39.472 34.553-67.147 34.553-45.564 0-82.501-36.937-82.501-82.5zm109.888-12.922c9.215 5.743 9.215 20.101 0 25.843l-29.62 18.46c-9.215 5.742-20.734-1.436-20.734-12.922V81.541c0-11.486 11.519-18.664 20.734-12.921l29.62 18.459z" fill="currentColor"></path>'
        }
      }
    }

    /**
     * 在播放页加入快速切换稍后再看状态的按钮
     */
    async addVideoButton() {
      const _self = this
      let bus = {}

      const app = await api.wait.$('#app')
      const atr = await api.wait.$('#arc_toolbar_report, #playlistToolbar', app)
      const original = await api.wait.$('.van-watchlater', atr)
      api.wait.waitForConditionPassed({
        condition: () => app.__vue__,
      }).then(async () => {
        const btn = document.createElement('label')
        btn.id = `${gm.id}-video-btn`
        btn.title = '点击切换稍后再看状态。当稿件在稍后再看中时，右键点击可切换其固定状态。'
        const cb = btn.appendChild(document.createElement('input'))
        cb.type = 'checkbox'
        const text = btn.appendChild(document.createElement('span'))
        text.textContent = '稍后再看'
        cb.addEventListener('click', () => processSwitch())
        const right = atr.querySelector('.toolbar-right, .video-toolbar-right')
        if (right) {
          btn.className = 'video-toolbar-right-item'
          right.prepend(btn)
        } else { // 旧版
          btn.dataset.toolbarVersion = 'old'
          btn.className = 'appeal-text'
          atr.append(btn)
        }

        Reflect.defineProperty(btn, 'gmFixed', {
          get() { return this.classList.contains('gm-fixed-hint') },
          set(val) {
            if (val) {
              if (!this.gmFixed) btn.classList.add('gm-fixed-hint')
            } else {
              if (this.gmFixed) btn.classList.remove('gm-fixed-hint')
            }
          },
        })
        btn.addEventListener('contextmenu', e => {
          e.preventDefault()
          if (btn.added) {
            const fixed = !btn.gmFixed
            btn.gmFixed = fixed
            gm.data.fixedItem(this.method.getBvid(), fixed)
            api.message.info(`${fixed ? '' : '取消'}固定稿件成功`)
          }
        })

        let aid = this.method.getAid()
        if (!aid) {
          aid = await api.wait.waitForConditionPassed({
            condition: () => this.method.getAid(),
            interval: 1000,
          })
        }
        bus = { btn, cb, aid }
        initButtonStatus()
        original.parentElement.style.display = 'none'

        window.addEventListener('urlchange', async () => {
          const aid = this.method.getAid()
          if (bus.aid === aid) return // 并非切换稿件（如切分P）
          bus.aid = aid
          let reloaded = false
          gm.searchParams = new URL(location.href).searchParams
          const removed = await this.processAutoRemove()
          if (gm.config.removeHistory && gm.config.removeHistorySavePoint === Enums.removeHistorySavePoint.anypage) {
            // 本来没必要强制刷新，但后面查询状态必须要新数据，搭个顺风车
            await this.method.updateRemoveHistoryData(true)
            reloaded = true
          }
          const status = removed ? false : await this.method.getVideoWatchlaterStatusByAid(bus.aid, !reloaded)
          btn.added = status
          cb.checked = status
          btn.gmFixed = gm.data.fixedItem(this.method.getBvid())
        })
      })

      /**
       * 初始化按钮的稍后再看状态
       */
      function initButtonStatus() {
        const setStatus = async status => {
          status ??= await _self.method.getVideoWatchlaterStatusByAid(bus.aid, false, true)
          bus.btn.added = status
          bus.cb.checked = status
        }
        if (gm.data.fixedItem(_self.method.getBvid())) {
          setStatus(true)
          bus.btn.gmFixed = true
        } else {
          const alwaysAutoRemove = gm.config.autoRemove === Enums.autoRemove.always
          const spRemove = gm.searchParams.get(`${gm.id}_remove`) === 'true'
          const spDisableRemove = gm.searchParams.get(`${gm.id}_disable_remove`) === 'true'
          if ((!alwaysAutoRemove && !spRemove) || spDisableRemove) {
            setStatus()
          }
        }
        // 如果当前稿件应当被移除，那就不必读取状态了
        // 注意，哪处代码先执行不确定，不过从理论上来说这里应该是会晚执行
        // 当然，自动移除的操作有可能会失败，但两处代码联动太麻烦了，还会涉及到切换其他稿件的问题，综合考虑之下对这种小概率事件不作处理
      }

      /**
       * 处理稿件状态的切换
       */
      async function processSwitch() {
        const { aid, btn, cb } = bus
        const note = btn.added ? '从稍后再看移除' : '添加到稍后再看'
        const success = await _self.method.switchVideoWatchlaterStatus(aid, !btn.added)
        if (success) {
          btn.added = !btn.added
          cb.checked = btn.added
          api.message.info(`${note}成功`)
          if (!btn.added && btn.classList.contains('gm-fixed-hint')) {
            gm.data.fixedItem(_self.method.getBvid(), false)
            btn.gmFixed = false
          }
        } else {
          cb.checked = btn.added
          api.message.info(`${note}失败${!btn.added ? '，可能是因为稍后再看不支持该稿件类型（如互动视频）' : ''}`)
        }
      }
    }

    /**
     * 稍后再看模式重定向至常规模式播放
     */
    async redirect() {
      // stop() 并不能带来有效的重定向速度改善，反而可能会引起已加载脚本执行错误，也许会造成意外的不良影响
      try {
        let id = null
        const vid = this.method.getVid() // 必须从 URL 直接反推 bvid，其他方式都比这个慢
        if (vid) {
          id = (vid.type === 'aid') ? `av${vid.id}` : vid.id
        } else { // URL 中无 vid 时等同于稍后再看中的第一个稿件
          const resp = await api.web.request({
            url: gm.url.api_queryWatchlaterList,
          }, { check: r => r.code === 0 })
          id = resp.data.list[0].bvid
        }
        let { search } = location
        if (search) {
          let removed = false
          const url = new URL(location.href)
          for (const key of gm.searchParams.keys()) {
            if (['aid', 'bvid', 'oid'].includes(key)) {
              url.searchParams.delete(key)
              removed ||= true
            }
          }
          if (removed) {
            search = url.search
          }
        }
        location.replace(`${gm.url.page_videoNormalMode}/${id}/${search}${location.hash}`)
      } catch (e) {
        api.logger.error(e)
        const result = await api.message.confirm('重定向错误，是否临时关闭此功能？')
        if (result) {
          const url = new URL(location.href)
          url.searchParams.set(`${gmId}_disable_redirect`, 'true')
          location.replace(url.href)
        } else {
          location.replace(gm.url.page_watchlaterList)
        }
      }
    }

    /**
     * 初始化列表页面
     */
    async initWatchlaterListPage() {
      const r_con = await api.wait.$('.watch-later-list header .r-con')
      // 移除「播放全部」按钮
      if (gm.config.removeButton_playAll) {
        r_con.children[0].style.display = 'none'
      } else {
        // 页面上本来就存在的「全部播放」按钮不要触发重定向
        const setPlayAll = el => {
          el.href = gm.url.page_watchlaterPlayAll
          el.target = gm.config.openListVideo === Enums.openListVideo.openInCurrent ? '_self' : '_blank'
        }
        const playAll = r_con.children[0]
        if (playAll.classList.contains('s-btn')) {
          // 理论上不会进来
          setPlayAll(playAll)
        } else {
          const ob = new MutationObserver((records, observer) => {
            setPlayAll(records[0].target)
            observer.disconnect()
          })
          ob.observe(playAll, { attributeFilter: ['href'] })
        }
      }
      // 移除「一键清空」按钮
      if (gm.config.removeButton_removeAll) {
        r_con.children[1].style.display = 'none'
      }
      // 移除「移除已观看视频」按钮
      if (gm.config.removeButton_removeWatched) {
        r_con.children[2].style.display = 'none'
      }
      // 加入「批量转移」
      if (gm.config.listBatchTransferButton) {
        const batchTransferButton = r_con.appendChild(document.createElement('div'))
        batchTransferButton.textContent = '批量转移'
        batchTransferButton.className = 's-btn'
        batchTransferButton.addEventListener('click', () => webpage.batchTransfer())
      }
      // 加入「批量添加」
      if (gm.config.listBatchAddManagerButton) {
        const batchButton = r_con.appendChild(document.createElement('div'))
        batchButton.textContent = '批量添加'
        batchButton.className = 's-btn'
        batchButton.addEventListener('click', () => script.openBatchAddManager())
      }
      // 加入「移除记录」
      if (gm.config.removeHistory) {
        const removeHistoryButton = r_con.appendChild(document.createElement('div'))
        removeHistoryButton.textContent = '移除记录'
        removeHistoryButton.className = 's-btn'
        removeHistoryButton.addEventListener('click', () => script.openRemoveHistory())
      }
      // 加入「增强设置」
      const plusButton = r_con.appendChild(document.createElement('div'))
      plusButton.textContent = '增强设置'
      plusButton.className = 's-btn'
      plusButton.addEventListener('click', () => script.openUserSetting())
      // 加入「导出列表」
      if (gm.config.listExportWatchlaterListButton) {
        const exportButton = document.createElement('div')
        exportButton.textContent = '导出列表'
        exportButton.className = 's-btn'
        exportButton.title = '导出稍后再看列表。\n右键点击可进行导出设置。'
        r_con.prepend(exportButton)
        exportButton.addEventListener('click', () => script.exportWatchlaterList())
        exportButton.addEventListener('contextmenu', e => {
          e.preventDefault()
          script.setExportWatchlaterList()
        })
      }
      // 加入「刷新列表」
      const reloadButton = document.createElement('div')
      reloadButton.id = 'gm-list-reload'
      reloadButton.textContent = '刷新列表'
      reloadButton.className = 's-btn'
      r_con.prepend(reloadButton)
      reloadButton.addEventListener('click', async () => {
        let search = null
        if (gm.config.listSearch && gm.config.searchDefaultValue) {
          const sdv = GM_getValue('searchDefaultValue_value')
          if (typeof sdv === 'string' && sdv) {
            const searchBox = document.querySelector('#gm-list-search')
            search = searchBox.firstElementChild
            search.value = `${sdv} `
            if (sdv.length > 0) {
              searchBox.classList.add('gm-active')
              searchBox.querySelector('.gm-search-clear').style.visibility = 'visible'
            }
          }
        }
        const success = await this.reloadWatchlaterListPage()
        if (!success && search) { // 若刷新成功，说明已执行搜索逻辑，否则需手动执行
          search.dispatchEvent(new Event('input'))
        }
      })

      // 增加搜索框
      if (gm.config.listSearch) {
        api.base.addStyle(`
          #gm-list-search.gm-search {
            display: inline-block;
            font-size: 1.6em;
            line-height: 2em;
            margin: 10px 21px 0;
            padding: 0 0.5em;
            border-radius: 3px;
            transition: box-shadow ${gm.const.fadeTime}ms ease-in-out;
          }
          #gm-list-search.gm-search:hover,
          #gm-list-search.gm-search.gm-active {
            box-shadow: var(--${gm.id}-box-shadow);
          }
          #gm-list-search.gm-search input[type=text] {
            border: none;
            width: 18em;
          }
        `)
        const searchContainer = r_con.insertAdjacentElement('afterend', document.createElement('div'))
        searchContainer.className = 'gm-list-search-container'
        searchContainer.innerHTML = `
          <div id="gm-list-search" class="gm-search">
            <input type="text" placeholder="搜索... 支持关键字排除 ( - ) 及通配符 ( ? * )">
            <div class="gm-search-clear">✖</div>
          </div>
        `
        const searchBox = searchContainer.firstElementChild
        const [search, searchClear] = searchBox.children

        search.addEventListener('mouseenter', () => search.focus())
        search.addEventListener('input', () => {
          const m = /^\s+(.*)/.exec(search.value)
          if (m) {
            search.value = m[1]
            search.setSelectionRange(0, 0)
          }
          if (search.value.length > 0) {
            searchBox.classList.add('gm-active')
            searchClear.style.visibility = 'visible'
          } else {
            searchBox.classList.remove('gm-active')
            searchClear.style.visibility = ''
          }
        })
        search.addEventListener('input', api.base.throttle(async () => {
          await this.searchWatchlaterListPage()
          await this.updateWatchlaterListPageTotal()
          this.triggerWatchlaterListPageContentLoad()
        }, gm.const.inputThrottleWait))
        searchClear.addEventListener('click', () => {
          search.value = ''
          search.dispatchEvent(new Event('input'))
        })
        if (gm.config.searchDefaultValue) {
          search.addEventListener('mousedown', e => {
            if (e.button === 1) {
              GM_deleteValue('searchDefaultValue_value')
              api.message.info('已清空搜索框默认值')
              e.preventDefault()
            } else if (e.button === 2) {
              GM_setValue('searchDefaultValue_value', search.value.trim())
              api.message.info('已保存搜索框默认值')
              e.preventDefault()
            }
          })
          search.addEventListener('contextmenu', e => e.preventDefault())

          const sdv = GM_getValue('searchDefaultValue_value')
          if (typeof sdv === 'string' && sdv) {
            search.value = `${sdv} `
            searchBox.classList.add('gm-active')
            searchClear.style.visibility = 'visible'
          }
          const updateSearchTitle = e => {
            let v = e ? e.detail.value : sdv
            if (!v) v = v === '' ? '[ 空 ]' : '[ 未设置 ]'
            searchBox.title = gm.const.searchDefaultValueHint.replace('$1', v)
          }
          updateSearchTitle()
          window.addEventListener('updateSearchTitle', updateSearchTitle)
        }
      }

      // 增加排序控制
      {
        const sortControlButton = document.createElement('div')
        const control = sortControlButton.appendChild(document.createElement('select'))
        sortControlButton.className = 'gm-list-sort-control-container'
        control.id = 'gm-list-sort-control'
        control.innerHTML = `
          <option value="${Enums.sortType.default}" selected>排序：默认</option>
          <option value="${Enums.sortType.defaultR}">排序：默认↓</option>
          <option value="${Enums.sortType.duration}">排序：时长</option>
          <option value="${Enums.sortType.durationR}">排序：时长↓</option>
          <option value="${Enums.sortType.pubtime}">排序：发布</option>
          <option value="${Enums.sortType.pubtimeR}">排序：发布↓</option>
          <option value="${Enums.sortType.progress}">排序：进度</option>
          <option value="${Enums.sortType.uploader}">排序：UP主</option>
          <option value="${Enums.sortType.title}">排序：标题</option>
          <option value="${Enums.sortType.fixed}">排序：固定</option>
        `
        control.prevVal = control.value
        r_con.prepend(sortControlButton)

        if (gm.config.autoSort !== Enums.autoSort.default) {
          let type = gm.config.autoSort
          if (type === Enums.autoSort.auto) {
            type = GM_getValue('autoSort_auto')
            if (!type) {
              type = Enums.sortType.default
              GM_setValue('autoSort_auto', type)
            }
          }
          control.value = type
        }

        if (gm.config.listSortControl) {
          /*
           * 在 control 外套一层，借助这层给 control 染色的原因是：
           * 如果不这样做，那么点击 control 弹出的下拉框与 control 之间有几个像素的距离，鼠标从 control 移动到
           * 下拉框的过程中，若鼠标移动速度较慢，会使 control 脱离 hover 状态。
           * 不管是标准还是浏览器的的锅：凭什么鼠标移动到 option 上 select「不一定」是 hover 状态——哪怕设计成
           * 「一定不」都是合理的。
           */
          api.base.addStyle(`
            .gm-list-sort-control-container {
              display: inline-block;
              padding-bottom: 5px;
            }
            .gm-list-sort-control-container:hover select {
              background: #00a1d6;
              color: #fff;
            }
            .gm-list-sort-control-container select {
              appearance: none;
              text-align-last: center;
              line-height: 16.6px;
            }
            .gm-list-sort-control-container option {
              background: var(--${gm.id}-background-color);
              color: var(--${gm.id}-text-color);
            }
          `)
          control.className = 's-btn'

          control.addEventListener('change', () => {
            if (gm.config.autoSort === Enums.autoSort.auto) {
              GM_setValue('autoSort_auto', control.value)
            }
            this.sortWatchlaterListPage()
          })
        } else {
          sortControlButton.style.display = 'none'
        }
      }

      // 增加自动移除控制器
      {
        const autoRemoveControl = document.createElement('div')
        autoRemoveControl.id = 'gm-list-auto-remove-control'
        autoRemoveControl.textContent = '自动移除'
        if (!gm.config.listAutoRemoveControl) {
          autoRemoveControl.style.display = 'none'
        }
        r_con.prepend(autoRemoveControl)
        if (gm.config.autoRemove !== Enums.autoRemove.absoluteNever) {
          api.base.addStyle(`
            #gm-list-auto-remove-control {
              background: #fff;
              color: #00a1d6;
            }
            #gm-list-auto-remove-control[enabled] {
              background: #00a1d6;
              color: #fff;
            }
          `)
          const autoRemove = gm.config.autoRemove === Enums.autoRemove.always || gm.config.autoRemove === Enums.autoRemove.openFromList
          autoRemoveControl.className = 's-btn'
          autoRemoveControl.title = '临时切换在当前页面打开稿件后是否将其自动移除出「稍后再看」。若要默认开启/关闭自动移除功能，请在「用户设置」中配置。'
          autoRemoveControl.autoRemove = autoRemove
          if (autoRemove) {
            autoRemoveControl.setAttribute('enabled', '')
          }
          autoRemoveControl.addEventListener('click', () => {
            if (autoRemoveControl.autoRemove) {
              autoRemoveControl.removeAttribute('enabled')
              api.message.info('已临时关闭自动移除功能')
            } else {
              autoRemoveControl.setAttribute('enabled', '')
              api.message.info('已临时开启自动移除功能')
            }
            autoRemoveControl.autoRemove = !autoRemoveControl.autoRemove
          })
        } else {
          autoRemoveControl.className = 'd-btn'
          autoRemoveControl.style.cursor = 'not-allowed'
          autoRemoveControl.addEventListener('click', () => {
            api.message.info('当前彻底禁用自动移除功能，无法执行操作')
          })
        }
      }

      // 将顶栏固定在页面顶部
      if (gm.config.listStickControl) {
        let p1 = '-0.3em'
        let p2 = '2.8em'

        if (gm.config.headerCompatible === Enums.headerCompatible.bilibiliEvolved) {
          api.base.addStyle(`
            .custom-navbar.transparent::before {
              height: calc(1.3 * var(--navbar-height)) !important;
            }
          `)
          p1 = '-3.5em'
          p2 = '6em'
        }

        api.base.addStyle(`
          .watch-later-list {
            position: relative;
            top: ${p1};
          }

          .watch-later-list > header {
            position: sticky;
            top: 0;
            margin-top: 0;
            padding-top: ${p2};
            background: white;
            z-index: 1;
          }
        `)
      }
    }

    /**
     * 对稍后再看列表页面进行处理
     * @param {boolean} byReload 由页内刷新触发
     * @returns {Promise<0 | 1 | 2>} 处理状态 - [0]初始化失败 | [1]存在处理错误的项目 | [2]成功
     */
    async processWatchlaterListPage(byReload) {
      const _self = this
      const uid = this.method.getDedeUserID()
      const fixedItems = GM_getValue(`fixedItems_${uid}`) ?? []
      const sortable = gm.config.autoSort !== Enums.autoSort.default || gm.config.listSortControl
      let autoRemoveControl = null
      if (gm.config.autoRemove !== Enums.autoRemove.absoluteNever) {
        autoRemoveControl = await api.wait.$('#gm-list-auto-remove-control')
      }
      const listContainer = await api.wait.$('.watch-later-list')
      const listBox = await api.wait.$('.list-box', listContainer)
      const items = listBox.querySelectorAll('.av-item')

      // data 的获取必须放在 listBox 的获取后：
      // 如果 listBox 能够被获取到，说明页面能够正常加载，这至少说明 a. 网络没有问题、b. 当前页面没有被浏览器视为二等公民。
      // 因此，此时获取稍后再看列表数据，必然不会因为各种奇葩的原因获取失败。否则，在后台打开很多个页面（其中包含列表页
      // 面），或是刚打开列表页面就将浏览器切到后台，那么当用户回到列表页面时，会发现 data 加载失败而导致报错。如果将 data
      // 获取置于 listBox 获取之后（也就是当前方案），那么当用户回到列表页面时，代码才会运行至此，此时再加载 data 就能得
      // 到正确的数据（说到这里，不禁感叹 UserscriptAPI.wait 这一套方案是真的太好用了！）。
      const data = await gm.data.watchlaterListData(true)
      if (gm.runtime.watchlaterListDataError != null) {
        if (byReload) {
          api.message.alert('加载稍后再看列表数据失败，无法处理稍后再看列表页面。你可以点击「刷新列表」按钮或刷新页面以重试。')
        } else {
          api.message.alert('加载稍后再看列表数据失败，无法处理稍后再看列表页面。你可以刷新页面以重试（点击「刷新列表」按钮无法确保完整的处理）。')
        }
        return 0
      }

      let success = 2
      const vueData = listContainer.__vue__.listData
      for (const [idx, item] of items.entries()) {
        if (item._uninit) {
          delete item._uninit
        } else if (item.serial != null) {
          item.serial = idx
          continue
        }
        // info
        let d = data[idx]
        const vd = vueData[idx]
        const vueBvid = vd.bvid
        // 稿件失效时 a.t href 为空，不妨使用 vueBvid 代替（不一定准确）
        const itemBvid = this.method.getBvid(item.querySelector('a.t').href) ?? vueBvid
        // 若页面正常加载，DOM、VUE、DATA 理应一一对应
        if (itemBvid !== vueBvid || d.bvid !== vueBvid) {
          let error = true
          // DOM、VUE 在绝大多数情况下都是一致的，不必关注
          // 但 DOM / VUE 偶尔会出现相邻两项顺序调换的情况，这会使得与 DATA 不一致
          // 这种情况很诡异，不知道怎么发生的，而且多刷新几遍 DOM / VUE 中的顺序又可能会变成正确的
          // 由于这种情况的发生过于频繁，如果列表较大几乎必出现，不得不将 DATA 遍历一遍以最大程度地修正这一问题
          if (itemBvid === vueBvid) {
            for (const e of data) {
              if (e.bvid === itemBvid) {
                d = e
                error = false
                break
              }
            }
          }
          if (error) {
            item._uninit = true
            // 这里附加一些绝对正确的属性，使得初始化失败的情况下依然能使用一些基本功能
            item.state = itemBvid === vueBvid ? vd.state : 0
            item.serial = idx
            item.aid = this.method.bvTool.bv2av(itemBvid)
            item.bvid = itemBvid
            api.logger.error('DOM-VUE-DATA 不一致', item.bvid, `${vueBvid}(${vd.title?.slice(0, 6) ?? '[NO TITLE]'})`, `${d.bvid}(${d.title?.slice(0, 6) ?? '[NO TITLE]'})`)
            processItem(item)
            success = 1
            continue
          }
        }
        item.state = d.state
        item.serial = idx
        item.aid = String(d.aid)
        item.bvid = d.bvid
        item.vTitle = d.title
        item.uploader = d.owner.name
        item.duration = d.duration
        item.pubtime = d.pubdate
        item.multiP = d.videos > 1
        if (d.progress < 0) {
          d.progress = d.duration
        }
        item.progress = (d.videos > 1 && d.progress > 0) ? d.duration : d.progress

        processItem(item)
        for (const link of item.querySelectorAll('a:not([class=user])')) {
          processLink(item, link, autoRemoveControl)
        }
      }
      await this.searchWatchlaterListPage()
      this.updateWatchlaterListPageTotal()

      if (sortable) {
        const sortControl = await api.wait.$('#gm-list-sort-control')
        if (byReload || sortControl.value !== sortControl.prevVal) {
          this.sortWatchlaterListPage()
        }
      }

      if (!byReload) {
        // 现在仍在 fixedItems 中的是无效固定项，将它们移除
        // 仅在列表项不为空时才执行移除，因为「列表项为空」有可能是一些特殊情况造成的误判
        if (items.length > 0) {
          for (const item of fixedItems) {
            gm.data.fixedItem(item, false)
          }
        }

        this.handleAutoReloadWatchlaterListPage()
      }
      return success

      /**
       * 处理项目
       *
       * 初始化正常项目，给非正常项目添加初始化失败提示。
       * @param {HTMLElement} item 目标项元素
       */
      function processItem(item) {
        const state = item.querySelector('.info .state')

        let tooltip = item.querySelector('.gm-list-item-fail-tooltip')
        if (item._uninit) {
          if (!tooltip) {
            tooltip = document.createElement('span')
            tooltip.className = 'gm-list-item-fail-tooltip'
            tooltip.textContent = '初始化失败'
            tooltip.addEventListener('click', () => webpage.reloadWatchlaterListPage())
            api.message.hoverInfo(tooltip, '稿件初始化失败，部分功能在该稿件上无法正常使用。点击失败提示或「刷新列表」可重新初始化稿件。如果仍然无法解决问题，请重新加载页面。')
            state.append(tooltip)
          }
        } else {
          if (tooltip) {
            tooltip.remove()
          }
        }

        if (state.querySelector('.gm-list-item-tools')) return

        state.insertAdjacentHTML('beforeend', `
          <span class="gm-list-item-tools">
            <span class="gm-list-item-fixer" title="${gm.const.fixerHint}">固定</span>
            <span class="gm-list-item-collector" title="将稿件移动至指定收藏夹">收藏</span>
            <input class="gm-list-item-switcher" type="checkbox" checked>
          </span>
        `)
        const tools = state.querySelector('.gm-list-item-tools')
        const [fixer, collector, switcher] = tools.children
        item.switcher = switcher

        const fixedIdx = fixedItems.indexOf(item.bvid)
        if (fixedIdx >= 0) {
          fixedItems.splice(fixedIdx, 1)
          item.fixed = true
          item.classList.add('gm-fixed')
        }

        item.added = true
        const switchStatus = async (status, dispInfo = true) => {
          if (status) { // 先改了 UI 再说，不要给用户等待感
            item.classList.remove('gm-removed')
          } else {
            item.classList.add('gm-removed')
          }
          const note = status ? '添加到稍后再看' : '从稍后再看移除'
          const success = await _self.method.switchVideoWatchlaterStatus(item.aid, status)
          if (success) {
            item.added = status
            if (item.fixed) {
              item.fixed = false
              gm.data.fixedItem(item.bvid, false)
              item.classList.remove('gm-fixed')
            }
            dispInfo && api.message.info(`${note}成功`)
            setTimeout(() => {
              if (sortable) {
                _self.sortWatchlaterListPage()
              }
              _self.updateWatchlaterListPageTotal()
            }, 100)
          } else {
            if (item.added) {
              item.classList.remove('gm-removed')
            } else {
              item.classList.add('gm-removed')
            }
            dispInfo && api.message.info(`${note}失败`)
          }
          switcher.checked = item.added
        }

        switcher.addEventListener('click', () => {
          switchStatus(!item.added)
        })

        collector.addEventListener('click', async () => {
          const uid = _self.method.getDedeUserID()
          let mlid = GM_getValue(`watchlaterMediaList_${uid}`)
          let dmlid = false
          if (!mlid) {
            mlid = await _self.method.getDefaultMediaListId(uid)
            dmlid = true
          }
          const success = await _self.method.addToFav(item.aid, mlid)
          if (success) {
            api.message.info(dmlid ? '移动至默认收藏夹成功' : '移动至指定收藏夹成功')
            if (item.added) {
              switchStatus(false, false)
            }
          } else {
            api.message.info(dmlid ? '移动至默认收藏夹失败' : `移动至收藏夹 ${mlid} 失败，请确认该收藏夹是否存在`)
          }
        })

        fixer.addEventListener('click', () => {
          if (item.fixed) {
            item.classList.remove('gm-fixed')
          } else {
            item.classList.add('gm-fixed')
          }
          item.fixed = !item.fixed
          gm.data.fixedItem(item.bvid, item.fixed)
        })
        fixer.addEventListener('contextmenu', e => {
          e.preventDefault()
          script.clearFixedItems()
        })

        const title = item.querySelector('.av-about .t')
        const href = title.getAttribute('href')
        if ((href ?? '') === '' && item.state === 0) { // 存在 state == 0 稿件却不可用的情况，此时将稿件标识为未知状态
          item.state = -20221006
        }
        if (item.state < 0) {
          item.classList.add('gm-invalid')
          title.innerHTML = `<b>[${_self.method.getItemStateDesc(item.state)}]</b> ${title.textContent}`
        }

        if (item.progress > 0) {
          let progress = state.querySelector('.looked')
          if (progress) {
            if (item.multiP) return
          } else {
            progress = document.createElement('span')
            progress.className = 'looked'
            state.prepend(progress)
          }
          progress.textContent = item.multiP ? '已观看' : _self.method.getSecondTimeString(item.progress)
        }
      }

      /**
       * 根据 `autoRemove` 处理链接
       * @param {HTMLElement} base 基元素
       * @param {HTMLAnchorElement} link 链接元素
       * @param {HTMLElement} [arc] 自动移除按钮，为 `null` 时表示彻底禁用自动移除功能
       */
      function processLink(base, link, arc) {
        // 过滤稿件被和谐或其他特殊情况
        if (base.state >= 0) {
          link.target = gm.config.openListVideo === Enums.openListVideo.openInCurrent ? '_self' : '_blank'
          if (gm.config.redirect) {
            link.href = `${gm.url.page_videoNormalMode}/${base.bvid}`
          }
          if (arc) {
            link.addEventListener('mousedown', e => {
              if (e.button === 0 || e.button === 1) { // 左键或中键
                if (base.fixed) return
                // 若点击前已选择了内容，清空之；必须在这样做以后，下次在 mouseup 获取到不为空
                // 的 selection 时，才能说明此次 mousedown 到下次 mouseup 之间选择了内容
                const selection = window.getSelection()
                if (selection.toString() !== '') {
                  selection.removeAllRanges()
                }
                if (!link._href) {
                  link._href = link.href
                }
                if (arc.autoRemove) {
                  if (gm.config.autoRemove !== Enums.autoRemove.always) {
                    const url = new URL(link.href)
                    url.searchParams.set(`${gm.id}_remove`, 'true')
                    link.href = url.href
                  } else {
                    link.href = link._href
                  }
                } else {
                  if (gm.config.autoRemove === Enums.autoRemove.always) {
                    const url = new URL(link.href)
                    url.searchParams.set(`${gm.id}_disable_remove`, 'true')
                    link.href = url.href
                  } else {
                    link.href = link._href
                  }
                }
              }
            })
            link.addEventListener('mouseup', e => {
              if (e.button === 0 || e.button === 1) { // 左键或中键
                if (base.fixed) return
                if (window.getSelection().toString() !== '') return // 选中文字并释放也会触发 mouseup
                if (arc.autoRemove) {
                  // 添加移除样式并移动至列表末尾
                  base.classList.add('gm-removed')
                  base.added = false
                  base.switcher.checked = false
                  setTimeout(() => {
                    if (sortable) {
                      _self.sortWatchlaterListPage()
                    }
                    _self.updateWatchlaterListPageTotal()
                  }, 100)
                }
              }
            })
          }
        } else {
          link.removeAttribute('href')
        }
      }
    }

    /**
     * 对稍后再看列表进行搜索
     */
    async searchWatchlaterListPage() {
      const search = await api.wait.$('#gm-list-search input')
      let val = search.value.trim()
      let include = null
      let exclude = null
      const isIncluded = str => str && include?.test(str)
      const isExcluded = str => str && exclude?.test(str)
      if (val.length > 0) {
        try {
          val = val.replaceAll(/[$()+.[\\\]^{|}]/g, '\\$&') // escape regex
            .replaceAll('?', '.').replaceAll('*', '.*') // 通配符
          for (const part of val.split(' ')) {
            if (part) {
              if (part.startsWith('-')) {
                if (part.length === 1) continue
                if (exclude) {
                  exclude += '|' + part.slice(1)
                } else {
                  exclude = part.slice(1)
                }
              } else {
                if (include) {
                  include += '|' + part
                } else {
                  include = part
                }
              }
            }
          }
          if (!include && exclude) {
            include = '.*'
          }
          include &&= new RegExp(include, 'i')
          exclude &&= new RegExp(exclude, 'i')
        } catch {
          include = exclude = null
        }
      }

      const listBox = await api.wait.$('.watch-later-list .list-box')
      for (const item of listBox.querySelectorAll('.av-item')) {
        let valid = false
        if (include || exclude) {
          if ((isIncluded(item.vTitle) || isIncluded(item.uploader)) && !(isExcluded(item.vTitle) || isExcluded(item.uploader))) {
            valid = true
          }
        } else {
          valid = true
        }
        if (valid) {
          item.classList.remove('gm-filtered')
        } else {
          item.classList.add('gm-filtered')
        }
      }
    }

    /**
     * 对稍后再看列表页面进行排序
     */
    async sortWatchlaterListPage() {
      const sortControl = await api.wait.$('#gm-list-sort-control')
      const listBox = await api.wait.$('.watch-later-list .list-box')
      let type = sortControl.value
      sortControl.prevVal = type
      if (type === Enums.sortType.fixed) {
        type = Enums.sortType.default
        listBox.firstElementChild.setAttribute('sort-type-fixed', '')
      } else {
        listBox.firstElementChild.removeAttribute('sort-type-fixed')
      }
      const reverse = type.endsWith(':R')
      const k = type.replace(/:R$/, '')

      const lists = [
        [...listBox.querySelectorAll('.av-item:not(.gm-removed)')],
        [...listBox.querySelectorAll('.av-item.gm-removed')],
      ]
      let order = -1000
      for (const items of lists) {
        order += 1000
        items.sort((a, b) => {
          let result = 0
          const va = a[k]
          const vb = b[k]

          // 无数据时排在最后（出现在未初始化的 item 上）
          if (va == null) {
            return 1
          } else if (vb == null) {
            return -1
          }

          result = (typeof va === 'string') ? va.localeCompare(vb) : (va - vb)
          return reverse ? -result : result
        })
        for (const item of items) {
          item.style.order = order++
        }
      }
      this.triggerWatchlaterListPageContentLoad()
    }

    /**
     * 刷新稍后再看列表页面
     * @param {[string, string]} msg [执行成功信息, 执行失败信息]，设置为 null 或对应项为空时静默执行
     * @returns {Promise<boolean>} 刷新是否成功
     */
    async reloadWatchlaterListPage(msg = ['刷新成功', '刷新失败']) {
      const list = await api.wait.$('.watch-later-list')
      const vue = await api.wait.waitForConditionPassed({
        condition: () => list.__vue__,
      })
      vue.state = 'loading' // 内部刷新过程中 state 依然保留原来的 loaded / error，很呆，手动改一下
      vue.getListData() // 更新内部 listData，其数据会同步到 DOM 上
      await api.wait.waitForConditionPassed({
        condition: () => vue.state !== 'loading',
        stopOnTimeout: false,
      })
      let success = vue.state === 'loaded'
      if (success) {
        // 刷新成功后，所有不存在的 item 都会被移除，没有被移除就说明该 item 又被重新加回稍后再看中
        for (const item of list.querySelectorAll('.av-item.gm-removed')) {
          item.added = true
          item.classList.remove('gm-removed')
          item.querySelector('.gm-list-item-switcher').checked = true
        }
        // 虽然 state === 'loaded'，但事实上 DOM 未调整完毕，需要等待一小段时间
        await new Promise(resolve => setTimeout(resolve, 400))
        const status = await this.processWatchlaterListPage(true)
        success = status === 2
        if (status >= 1) {
          if (gm.config.removeHistory) {
            this.method.updateRemoveHistoryData()
          }
          this.handleAutoReloadWatchlaterListPage()
        }
      }
      msg &&= success ? msg[0] : msg[1]
      msg && api.message.info(msg)
      return success
    }

    /**
     * 处理稍后再看列表页面自动刷新
     */
    async handleAutoReloadWatchlaterListPage() {
      if (gm.config.autoReloadList > 0) {
        if (gm.runtime.autoReloadListTid != null) {
          clearTimeout(gm.runtime.autoReloadListTid)
        }
        const interval = gm.config.autoReloadList * 60 * 1000
        const autoReload = () => {
          gm.runtime.autoReloadListTid = null
          this.reloadWatchlaterListPage(null)
        }
        gm.runtime.autoReloadListTid = setTimeout(autoReload, interval)

        const reloadBtn = await api.wait.$('#gm-list-reload')
        reloadBtn.title = `刷新时间：${new Date().toLocaleString()}\n下次自动刷新时间：${new Date(Date.now() + interval).toLocaleString()}`
      }
    }

    /**
     * 触发列表页面内容加载
     */
    triggerWatchlaterListPageContentLoad() {
      window.dispatchEvent(new Event('scroll'))
    }

    /**
     * 更新列表页面上方的稿件总数统计
     */
    async updateWatchlaterListPageTotal() {
      const container = await api.wait.$('.watch-later-list')
      const listBox = await api.wait.$('.list-box', container)
      const elTotal = await api.wait.$('header .t em')
      const all = listBox.querySelectorAll('.av-item').length
      const displayed = listBox.querySelectorAll('.av-item:not(.gm-filtered)').length
      const current = displayed - listBox.querySelectorAll('.gm-removed:not(.gm-filtered)').length
      elTotal.textContent = `（${current}/${displayed}${all === displayed ? '' : `/${all}`}）`

      const empty = container.querySelector('.abnormal-item')
      if (displayed > 0) {
        if (empty) {
          empty.style.display = 'none'
        }
      } else {
        if (empty) {
          empty.style.display = ''
        } else {
          container.insertAdjacentHTML('beforeend', '<div class="abnormal-item"><img src="//s1.hdslb.com/bfs/static/jinkela/watchlater/asserts/emptylist.png" class="pic"><div class="txt"><p>稍后再看列表还是空的哦，你可以通过以上方式添加~</p></div></div>')
        }
      }
    }

    /**
     * 根据 URL 上的查询参数作进一步处理
     */
    async processSearchParams() {
      if (api.base.urlMatch([gm.regex.page_videoNormalMode, gm.regex.page_videoWatchlaterMode, gm.regex.page_listMode])) {
        await this.processAutoRemove()
      }
    }

    /**
     * 根据用户配置或 URL 上的查询参数，将稿件从稍后再看移除
     * @returns {Promise<boolean>} 执行后稿件是否已经不在稍后再看中（可能是在本方法内被移除，也可能是本身就不在）
     */
    async processAutoRemove() {
      try {
        const alwaysAutoRemove = gm.config.autoRemove === Enums.autoRemove.always
        const spRemove = gm.searchParams.get(`${gm.id}_remove`) === 'true'
        const spDisableRemove = gm.searchParams.get(`${gm.id}_disable_remove`) === 'true'
        if ((alwaysAutoRemove || spRemove) && !spDisableRemove) {
          if (gm.data.fixedItem(this.method.getBvid())) return
          const aid = this.method.getAid()
          // 稍后再看播放页中，必须等右侧稍后再看列表初始化完成再移除，否则会影响其初始化。
          // 列表播放页（稍后再看）并不需要进行这一操作，因为该页面可以是给收藏夹列表的，猜测
          // 官方在设计时就考虑到播放过程中稿件被移除出列表的问题。
          if (api.base.urlMatch(gm.regex.page_videoWatchlaterMode)) {
            await api.wait.$('.player-auxiliary-wraplist-playlist')
            await new Promise(resolve => setTimeout(resolve, 5000))
          }
          const success = await this.method.switchVideoWatchlaterStatus(aid, false)
          if (!success) {
            api.message.info('从稍后再看移除失败')
          }
          return success
        }
      } catch (e) {
        api.logger.error(e)
      }
      return false
    }

    /**
     * 根据 `removeHistorySavePoint` 保存稍后再看历史数据
     */
    processWatchlaterListDataSaving() {
      switch (gm.config.removeHistorySavePoint) {
        case Enums.removeHistorySavePoint.list: {
          if (api.base.urlMatch(gm.regex.page_watchlaterList)) {
            this.method.updateRemoveHistoryData()
          }
          break
        }
        case Enums.removeHistorySavePoint.anypage: {
          if (!api.base.urlMatch(gm.regex.page_dynamicMenu)) {
            this.method.updateRemoveHistoryData()
          }
          break
        }
        case Enums.removeHistorySavePoint.listAndMenu:
        default: {
          if (api.base.urlMatch(gm.regex.page_watchlaterList)) {
            this.method.updateRemoveHistoryData()
          }
          break
        }
      }
    }

    /**
     * 添加批量添加管理器按钮
     */
    addBatchAddManagerButton() {
      if (location.pathname === '/') { // 仅动态主页
        api.wait.$('.bili-dyn-list-tabs__list').then(bar => {
          const btn = bar.firstElementChild.cloneNode(true)
          btn.id = 'gm-batch-manager-btn'
          btn.classList.remove('active')
          btn.textContent = '批量添加'
          btn.addEventListener('click', () => script.openBatchAddManager())
          bar.append(btn)
        })
      }
    }

    /**
     * 批量转移
     */
    async batchTransfer() {
      const _self = this
      let result = await api.message.confirm('是否将以下（筛选出来的）稍后再看稿件批量转移至指定收藏夹？<br>注意：该操作耗时较长，且较容易触发B站拦截机制，请勿频繁使用，后果自负！！！', { html: true })
      if (result) {
        if (gm.runtime.autoReloadListTid != null) { // 暂停自动刷新
          clearTimeout(gm.runtime.autoReloadListTid)
        }
        const container = await api.wait.$('.watch-later-list')
        const listBox = await api.wait.$('.list-box', container)
        const chosenItems = listBox.querySelectorAll('.av-item:not(.gm-filtered):not(.gm-removed):not(.gm-fixed)')
        if (chosenItems.length > 0) {
          let errorCnt = 0
          const interval = 2500
          const spendTimeSec = interval * chosenItems.length / 1000
          const endTime = this.method.getTimeString(Date.now() + interval * chosenItems.length)
          result = await api.message.confirm(`请再次点击「确定」以开始批量转移，点击「取消」以终止操作。本次转移至少需要花费 ${spendTimeSec} 秒，至少在 ${endTime} 后才能完成。开始后请停留在该页面保证转移正常执行，期间不要执行其他操作，否则可能会引起转移错误。<br>注意：该功能较容易触发B站拦截机制，有可能会引起B站某些功能在一段时间内无法正常使用，如果出现这种情况等一段时间便会恢复，但接下来一段时间内不要再使用该功能！`, { html: true }) // 时间提醒
          if (!result) {
            location.reload()
            return
          }
          const uid = this.method.getDedeUserID()
          let mlid = GM_getValue(`watchlaterMediaList_${uid}`)
          if (!mlid) {
            mlid = await this.method.getDefaultMediaListId(uid)
          }
          for (const item of chosenItems) {
            const success = await this.method.addToFav(item.aid, mlid)
            if (success) {
              const s = switchOffStatus(item)
              if (!s) errorCnt += 1
            } else if (++errorCnt > 8) {
              await api.message.alert('批量转移过程中已出现大量错误，终止执行。B站可能会出现某些功能在一段时间内无法正常使用的情况，等一段时间便会恢复，但接下来一段时间内不要再使用该功能！')
              break
            }
            await new Promise(resolve => setTimeout(resolve, interval * (Math.random() * 0.5 + 0.75)))
          }
          await api.message.alert(`批量转移完成${errorCnt > 0 ? `，期间共出现 ${errorCnt} 个错误` : ''}。点击「确定」后将刷新页面。`)
          location.reload() // 无论执行出错与否，刷新页面
        }
      }

      async function switchOffStatus(item) {
        item.classList.add('gm-removed') // 先改 UI
        const success = await _self.method.switchVideoWatchlaterStatus(item.aid, false)
        if (success) {
          item.added = false
        } else {
          item.classList.remove('gm-removed')
        }
        item.querySelector('.gm-list-item-switcher').checked = item.added
        return success
      }
    }

    /**
     * 添加弹出面板的滚动条样式
     */
    addMenuScrollbarStyle() {
      const popup = `#${gm.id} .gm-entrypopup .gm-entry-list`
      const oldTooltip = '[role=tooltip]' // 旧版顶栏弹出面板
      const oldDynamic = '#app > .out-container > .container' // 旧版动态弹出面板
      switch (gm.config.menuScrollbarSetting) {
        case Enums.menuScrollbarSetting.beautify: {
          // 目前在不借助 JavaScript 的情况下，无法完美实现类似于移动端滚动条浮动在内容上的效果
          api.base.addStyle(`
            :root {
              --${gm.id}-scrollbar-background-color: transparent;
              --${gm.id}-scrollbar-thumb-color: #0000002b;
            }

            ${popup}::-webkit-scrollbar,
            ${oldTooltip} ::-webkit-scrollbar,
            ${oldDynamic}::-webkit-scrollbar {
              width: 4px;
              height: 5px;
              background-color: var(--${gm.id}-scrollbar-background-color);
            }

            ${popup}::-webkit-scrollbar-thumb,
            ${oldTooltip} ::-webkit-scrollbar-thumb,
            ${oldDynamic}::-webkit-scrollbar-thumb {
              border-radius: 4px;
              background-color: var(--${gm.id}-scrollbar-background-color);
            }

            ${popup}:hover::-webkit-scrollbar-thumb,
            ${oldTooltip} :hover::-webkit-scrollbar-thumb,
            ${oldDynamic}:hover::-webkit-scrollbar-thumb {
              border-radius: 4px;
              background-color: var(--${gm.id}-scrollbar-thumb-color);
            }

            ${popup}::-webkit-scrollbar-corner,
            ${oldTooltip} ::-webkit-scrollbar-corner,
            ${oldDynamic}::-webkit-scrollbar-corner {
              background-color: var(--${gm.id}-scrollbar-background-color);
            }

            /* 优化官方顶栏弹出面板中的滚动条样式 */
            .dynamic-panel-popover .header-tabs-panel__content::-webkit-scrollbar,
            .history-panel-popover .header-tabs-panel__content::-webkit-scrollbar,
            .favorite-panel-popover__content .content-scroll::-webkit-scrollbar,
            .favorite-panel-popover__nav::-webkit-scrollbar {
              height: 5px !important;
            }
          `)
          break
        }
        case Enums.menuScrollbarSetting.hidden: {
          api.base.addStyle(`
            ${popup}::-webkit-scrollbar,
            ${oldTooltip} ::-webkit-scrollbar,
            ${oldDynamic}::-webkit-scrollbar {
              display: none;
            }

            /* 隐藏官方顶栏弹出面板中的滚动条 */
            .dynamic-panel-popover .header-tabs-panel__content::-webkit-scrollbar,
            .history-panel-popover .header-tabs-panel__content::-webkit-scrollbar,
            .favorite-panel-popover__content .content-scroll::-webkit-scrollbar,
            .favorite-panel-popover__nav::-webkit-scrollbar {
              display: none !important;
            }
          `)
          break
        }
        default: {
          break
        }
      }
    }

    /**
     * 添加脚本样式
     */
    addStyle() {
      if (self === top) {
        this.addMenuScrollbarStyle()
        // 通用样式
        api.base.addStyle(`
          :root {
            --${gm.id}-text-color: #0d0d0d;
            --${gm.id}-text-bold-color: #3a3a3a;
            --${gm.id}-light-text-color: white;
            --${gm.id}-hint-text-color: gray;
            --${gm.id}-light-hint-text-color: #909090;
            --${gm.id}-hint-text-emphasis-color: #666666;
            --${gm.id}-hint-text-highlight-color: #555555;
            --${gm.id}-background-color: white;
            --${gm.id}-background-highlight-color: #ebebeb;
            --${gm.id}-update-highlight-color: ${gm.const.updateHighlightColor};
            --${gm.id}-update-highlight-hover-color: red;
            --${gm.id}-border-color: black;
            --${gm.id}-light-border-color: #e7e7e7;
            --${gm.id}-shadow-color: #000000bf;
            --${gm.id}-text-shadow-color: #00000080;
            --${gm.id}-highlight-color: #0075ff;
            --${gm.id}-important-color: red;
            --${gm.id}-warn-color: #e37100;
            --${gm.id}-disabled-color: gray;
            --${gm.id}-scrollbar-background-color: transparent;
            --${gm.id}-scrollbar-thumb-color: #0000002b;
            --${gm.id}-box-shadow: #00000033 0px 3px 6px;
            --${gm.id}-opacity-fade-transition: opacity ${gm.const.fadeTime}ms ease-in-out;
            --${gm.id}-opacity-fade-quick-transition: opacity ${gm.const.fadeTime}ms cubic-bezier(0.68, -0.55, 0.27, 1.55);
            --${gm.id}-code-font-family: Consolas, 微软雅黑, 'Courier New', monospace;
          }

          #${gm.id} {
            color: var(--${gm.id}-text-color);
          }
          #${gm.id} * {
            box-sizing: content-box;
          }

          #${gm.id} .gm-entrypopup {
            font-size: 12px;
            line-height: normal;
            transition: var(--${gm.id}-opacity-fade-transition);
            opacity: 0;
            display: none;
            position: absolute;
            z-index: 900000;
            user-select: none;
            width: 32em;
            padding-top: 1.3em;
          }
          #${gm.id} .gm-entrypopup[data-header-type=old] {
            padding-top: 1em;
          }
          #${gm.id} .gm-entrypopup[data-header-type=old] .gm-popup-arrow {
            position: absolute;
            top: calc(1em - 6px);
            left: calc(16em - 6px);
            width: 0;
            height: 0;
            border-width: 6px;
            border-top-width: 0;
            border-style: solid;
            border-color: transparent;
            border-bottom-color: #dfdfdf; /* 必须在 border-color 后 */
            z-index: 1;
          }
          #${gm.id} .gm-entrypopup[data-header-type=old] .gm-popup-arrow::after {
            content: " ";
            position: absolute;
            top: 1px;
            width: 0;
            height: 0;
            margin-left: -6px;
            border-width: 6px;
            border-top-width: 0;
            border-style: solid;
            border-color: transparent;
            border-bottom-color: var(--${gm.id}-background-color); /* 必须在 border-color 后 */
          }
          #${gm.id} .gm-entrypopup .gm-entrypopup-page {
            position: relative;
            border-radius: 4px;
            border: none;
            box-shadow: var(--${gm.id}-box-shadow);
            background-color: var(--${gm.id}-background-color);
            overflow: hidden;
          }
          #${gm.id} .gm-entrypopup .gm-popup-header {
            position: relative;
            height: 2.8em;
            border-bottom: 1px solid var(--${gm.id}-light-border-color);
          }
          #${gm.id} .gm-entrypopup .gm-popup-total {
            position: absolute;
            line-height: 2.8em;
            right: 1.3em;
            top: 0;
            font-size: 1.2em;
            color: var(--${gm.id}-hint-text-color);
          }

          #${gm.id} .gm-entrypopup .gm-entry-list {
            display: flex;
            flex-direction: column;
            position: relative;
            height: 42em;
            overflow-y: auto;
            overflow-anchor: none;
            padding: 0.2em 0;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list.gm-entry-removed-list {
            border-top: 3px solid var(--${gm.id}-light-border-color);
            display: none;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list-empty {
            position: absolute;
            display: none;
            top: 20%;
            left: calc(50% - 7em);
            line-height: 4em;
            width: 14em;
            font-size: 1.4em;
            text-align: center;
            color: var(--${gm.id}-hint-text-color);
          }

          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item {
            display: flex;
            height: 4.4em;
            padding: 0.5em 1em;
            color: var(--${gm.id}-text-color);
            font-size: 1.15em;
            cursor: pointer;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item.gm-invalid {
            cursor: not-allowed;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item.gm-invalid,
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item.gm-removed {
            filter: grayscale(1);
            color: var(--${gm.id}-hint-text-color);
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item .gm-card-left {
            position: relative;
            flex: none;
            cursor: default;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item .gm-card-cover {
            width: 7.82em; /* 16:9 */
            height: 4.40em;
            border-radius: 2px;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item .gm-card-switcher {
            position: absolute;
            background: center / contain no-repeat #00000099 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 56'%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M35 17v-3H21v3h-8v3h5v22h20V20h5v-3h-8zm-9 22h-5V20h5v19zm9 0h-5V20h5v19z' clip-rule='evenodd'/%3E%3C/svg%3E");
            border-radius: 2px;
            width: 30px;
            height: 30px;
            top: calc(2.20em - 15px); /* 与缩略图显示尺寸匹配 */
            left: calc(3.91em - 15px);
            z-index: 2;
            display: none;
            cursor: pointer;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item.gm-removed .gm-card-switcher {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 56'%3E%3Cpath d='M39.9 25.6h-9.5v-9.5c0-.9-.5-1.5-1.2-1.5h-2.4c-.7 0-1.2.6-1.2 1.5v9.5h-9.5c-.9 0-1.5.5-1.5 1.2v2.4c0 .7.6 1.2 1.5 1.2h9.5v9.5c0 .9.5 1.5 1.2 1.5h2.4c.7 0 1.2-.6 1.2-1.5v-9.5h9.5c.9 0 1.5-.5 1.5-1.2v-2.4c.1-.7-.6-1.2-1.5-1.2z' fill='%23fff'/%3E%3C/svg%3E");
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item:hover .gm-card-switcher {
            display: unset;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item:not(.gm-card-multiP) .gm-card-duration,
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-card-multiP .gm-card-duration > * {
            position: absolute;
            bottom: 0;
            right: 0;
            background: var(--${gm.id}-text-shadow-color);
            color: var(--${gm.id}-light-text-color);
            border-radius: 2px 0 2px 0; /* 需与缩略图圆角匹配 */
            padding: 1.5px 2px 0 3px;
            font-size: 0.8em;
            z-index: 1;
            word-break: keep-all;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-card-multiP .gm-card-duration > * {
            transition: var(--${gm.id}-opacity-fade-quick-transition);
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-card-multiP:not(:hover) .gm-card-duration > .gm-hover,
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-card-multiP:hover .gm-card-duration > :not(.gm-hover) {
            opacity: 0;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item .gm-card-right {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: auto;
            margin-left: 0.8em;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item .gm-card-title {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            text-align: justify;
            height: 2.8em;
            line-height: 1.4em;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item.gm-removed .gm-card-title {
            text-decoration: line-through;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item .gm-card-uploader {
            font-size: 0.8em;
            text-overflow: ellipsis;
            word-break: keep-all;
            overflow: hidden;
            width: fit-content;
            max-width: 15em;
            color: var(--${gm.id}-hint-text-color);
            cursor: pointer;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item .gm-card-corner {
            position: absolute;
            bottom: 0;
            right: 0;
            font-size: 0.8em;
            color: var(--${gm.id}-hint-text-color);
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item .gm-card-corner > span {
            margin-left: 2px;
            cursor: pointer;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item:hover .gm-card-corner > :not(.gm-hover),
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item:not(:hover) .gm-card-corner > .gm-hover {
            display: none !important;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item .gm-card-progress {
            display: none;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item .gm-card-progress::before {
            content: "▶";
            padding-right: 1px;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item.gm-removed .gm-card-fixer {
            display: none;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item .gm-card-uploader:hover,
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item .gm-card-corner > span:hover {
            text-decoration: underline;
            font-weight: bold;
            color: var(--${gm.id}-text-bold-color);
          }

          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-simple-item {
            display: block;
            color: var(--${gm.id}-text-color);
            font-size: 1.2em;
            padding: 0.5em 1em;
            cursor: pointer;
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-simple-item:not(:last-child) {
            border-bottom: 1px solid var(--${gm.id}-light-border-color);
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-simple-item.gm-invalid,
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-simple-item.gm-invalid:hover {
            cursor: not-allowed;
            color: var(--${gm.id}-hint-text-color);
          }
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-simple-item.gm-removed {
            text-decoration: line-through;
            color: var(--${gm.id}-hint-text-color);
          }

          #${gm.id} .gm-entrypopup .gm-entry-bottom {
            display: flex;
            border-top: 1px solid var(--${gm.id}-light-border-color);
            height: 3em;
          }
          #${gm.id} .gm-entrypopup .gm-entry-bottom .gm-entry-button {
            flex: 1 0 auto;
            text-align: center;
            padding: 0.6em 0;
            font-size: 1.2em;
            cursor: pointer;
            color: var(--${gm.id}-text-color);
          }
          #${gm.id} .gm-entrypopup .gm-entry-bottom .gm-entry-button:not([enabled]) {
            display: none;
          }

          #${gm.id} .gm-entrypopup .gm-entry-bottom .gm-entry-button .gm-select {
            position: relative;
          }
          #${gm.id} .gm-entrypopup .gm-entry-bottom .gm-entry-button .gm-options {
            position: absolute;
            bottom: 1.8em;
            left: calc(50% - 2.5em);
            width: 5em;
            border-radius: 4px;
            box-shadow: var(--${gm.id}-box-shadow);
            background-color: var(--${gm.id}-background-color);
            color: var(--${gm.id}-text-color);
            padding: 0.15em 0;
            display: none;
            opacity: 0;
            transition: var(--${gm.id}-opacity-fade-quick-transition);
            z-index: 10;
          }
          #${gm.id} .gm-entrypopup .gm-entry-bottom .gm-entry-button .gm-option {
            padding: 0.15em 0.6em;
          }
          #${gm.id} .gm-entrypopup .gm-entry-bottom .gm-entry-button .gm-option:hover {
            color: var(--${gm.id}-highlight-color);
            background-color: var(--${gm.id}-background-highlight-color);
          }
          #${gm.id} .gm-entrypopup .gm-entry-bottom .gm-entry-button .gm-option.gm-option-selected {
            font-weight: bold;
          }

          #${gm.id} .gm-entrypopup .gm-entry-bottom .gm-entry-button[fn=autoRemoveControl],
          #${gm.id} .gm-entrypopup .gm-entry-bottom .gm-entry-button[fn=autoRemoveControl]:hover {
            color: var(--${gm.id}-text-color);
          }
          #${gm.id} .gm-entrypopup .gm-entry-bottom .gm-entry-button.gm-popup-auto-remove[fn=autoRemoveControl] {
            color: var(--${gm.id}-highlight-color);
          }

          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-item:hover,
          #${gm.id} .gm-entrypopup .gm-entry-list .gm-entry-list-simple-item:hover,
          #${gm.id} .gm-entrypopup .gm-entry-bottom .gm-entry-button:hover {
            color: var(--${gm.id}-highlight-color);
            background-color: var(--${gm.id}-background-highlight-color);
          }

          #${gm.id} .gm-modal-container {
            display: none;
            position: fixed;
            justify-content: center;
            align-items: center;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000000;
            font-size: 12px;
            line-height: normal;
            user-select: none;
            opacity: 0;
            transition: var(--${gm.id}-opacity-fade-transition);
          }

          #${gm.id} .gm-modal {
            position: relative;
            background-color: var(--${gm.id}-background-color);
            border-radius: 10px;
            z-index: 1;
          }

          #${gm.id} .gm-setting .gm-setting-page {
            min-width: 54em;
            max-width: 84em;
            padding: 1em 1.4em;
          }

          #${gm.id} .gm-setting .gm-maintitle {
            cursor: pointer;
            color: var(--${gm.id}-text-color);
          }
          #${gm.id} .gm-setting .gm-maintitle:hover {
            color: var(--${gm.id}-highlight-color);
          }

          #${gm.id} .gm-setting .gm-items {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 0.2em;
            margin: 0 0.2em;
            padding: 0 1.8em 0 2.2em;
            font-size: 1.2em;
            max-height: 66vh;
            overflow-y: auto;
          }
          #${gm.id} .gm-setting .gm-item-container {
            display: flex;
            align-items: baseline;
            gap: 1em;
          }
          #${gm.id} .gm-setting .gm-item-label {
            flex: none;
            font-weight: bold;
            color: var(--${gm.id}-text-bold-color);
            width: 4em;
            margin-top: 0.2em;
          }
          #${gm.id} .gm-setting .gm-item-content {
            display: flex;
            flex-direction: column;
            flex: auto;
          }
          #${gm.id} .gm-setting .gm-item {
            padding: 0.2em;
            border-radius: 2px;
          }
          #${gm.id} .gm-setting .gm-item > * {
            display: flex;
            align-items: center;
          }
          #${gm.id} .gm-setting .gm-item:not(.gm-holder-item):hover,
          #${gm.id} .gm-setting .gm-lineitem:not(.gm-holder-item):hover {
            color: var(--${gm.id}-highlight-color);
          }
          #${gm.id} .gm-setting .gm-lineitems {
            display: inline-flex;
            flex-flow: wrap;
            gap: 0.3em;
            width: 24em;
            color: var(--${gm.id}-text-color);
          }
          #${gm.id} .gm-setting .gm-lineitem {
            display: inline-flex;
            align-items: center;
            gap: 0.1em;
            padding: 0 0.2em;
            border-radius: 2px;
          }
          #${gm.id} .gm-setting .gm-lineitem > * {
            flex: none;
          }

          #${gm.id} .gm-setting input[type=checkbox] {
            margin-top: 0.2em;
            margin-left: auto;
          }
          #${gm.id} .gm-setting input[type=text] {
            border-width: 0 0 1px 0;
            width: 20em;
          }
          #${gm.id} .gm-setting input[is=laster2800-input-number] {
            border-width: 0 0 1px 0;
            width: 3.4em;
            text-align: right;
            padding: 0 0.2em;
            margin-left: auto;
          }
          #${gm.id} .gm-setting select {
            border-width: 0 0 1px 0;
            cursor: pointer;
          }

          #${gm.id} .gm-setting .gm-information {
            margin: 0 0.4em;
            cursor: pointer;
          }
          #${gm.id} .gm-setting [disabled] .gm-information {
            pointer-events: none;
          }
          #${gm.id} .gm-setting .gm-warning {
            position: absolute;
            color: var(--${gm.id}-warn-color);
            font-size: 1.4em;
            line-height: 0.8em;
            transition: var(--${gm.id}-opacity-fade-transition);
            opacity: 0;
            display: none;
            cursor: pointer;
          }
          #${gm.id} .gm-setting .gm-warning.gm-trailing {
            position: static;
            margin-left: 0.5em;
          }
          #${gm.id} .gm-setting .gm-warning:not(.gm-trailing) {
            right: 0.3em;
          }
          #${gm.id} .gm-setting [disabled] .gm-warning {
            visibility: hidden;
          }

          #${gm.id} .gm-hideDisabledSubitems .gm-setting-page:not([data-type]) .gm-item[disabled] {
            display: none;
          }

          #${gm.id} .gm-history .gm-history-page {
            width: 60vw;
            min-width: 40em;
            max-width: 80em;
          }

          #${gm.id} .gm-history .gm-comment {
            margin: 0 2em;
            color: var(--${gm.id}-hint-text-color);
            text-indent: 2em;
          }
          #${gm.id} .gm-history .gm-comment span,
          #${gm.id} .gm-history .gm-comment input {
            padding: 0 0.2em;
            font-weight: bold;
            color: var(--${gm.id}-hint-text-emphasis-color);
          }
          #${gm.id} .gm-history .gm-comment input {
            text-align: center;
            width: 3.5em;
            border-width: 0 0 1px 0;
          }

          #${gm.id} .gm-history .gm-content {
            margin: 0.6em 0.2em 2em 0.2em;
            padding: 0 1.8em;
            font-size: 1.2em;
            line-height: 1.6em;
            text-align: center;
            overflow-y: auto;
            overflow-wrap: break-word;
            height: 60vh;
            max-height: 60em;
            user-select: text;
            opacity: 0;
          }
          #${gm.id} .gm-history .gm-content > * {
            position: relative;
            margin: 1.6em 2em;
          }
          #${gm.id} .gm-history .gm-content a {
            color: var(--${gm.id}-text-color);
          }
          #${gm.id} .gm-history .gm-content input[type=checkbox] {
            position: absolute;
            right: -2em;
            height: 1.5em;
            width: 1em;
            cursor: pointer;
          }
          #${gm.id} .gm-history .gm-content .gm-history-date {
            font-size: 0.5em;
            color: var(--${gm.id}-hint-text-color);
          }
          #${gm.id} .gm-history .gm-content > *:hover input[type=checkbox] {
            filter: brightness(0.9);
          }
          #${gm.id} .gm-history .gm-content > *:hover a {
            font-weight: bold;
            color: var(--${gm.id}-highlight-color);
          }
          #${gm.id} .gm-history .gm-content .gm-empty {
            display: flex;
            justify-content: center;
            font-size: 1.5em;
            line-height: 1.6em;
            margin-top: 3.6em;
            color: gray;
          }
          #${gm.id} .gm-history .gm-content .gm-empty > * {
            width: fit-content;
            text-align: left;
          }

          #${gm.id} .gm-bottom {
            margin: 1.4em 2em 1em 2em;
            text-align: center;
          }

          #${gm.id} .gm-bottom button {
            font-size: 1em;
            padding: 0.3em 1em;
            margin: 0 0.8em;
            cursor: pointer;
            background-color: var(--${gm.id}-background-color);
            border: 1px solid var(--${gm.id}-border-color);
            border-radius: 2px;
          }
          #${gm.id} .gm-bottom button:hover {
            background-color: var(--${gm.id}-background-highlight-color);
          }
          #${gm.id} .gm-bottom button[disabled] {
            border-color: var(--${gm.id}-disabled-color);
            background-color: var(--${gm.id}-background-color);
          }

          #${gm.id} .gm-info {
            font-size: 0.8em;
            color: var(--${gm.id}-hint-text-color);
            text-decoration: underline;
            padding: 0 0.2em;
            cursor: pointer;
          }
          #${gm.id} .gm-info:hover {
            color: var(--${gm.id}-important-color);
          }

          #${gm.id} .gm-reset {
            position: absolute;
            right: 0;
            bottom: 0;
            margin: 1em 1.6em;
            color: var(--${gm.id}-hint-text-color);
            cursor: pointer;
          }

          #${gm.id} .gm-changelog {
            position: absolute;
            right: 0;
            bottom: 1.8em;
            margin: 1em 1.6em;
            color: var(--${gm.id}-hint-text-color);
            cursor: pointer;
          }
          #${gm.id} [data-type=updated] .gm-changelog {
            font-weight: bold;
            color: var(--${gm.id}-update-highlight-hover-color);
          }
          #${gm.id} [data-type=updated] .gm-changelog:hover {
            color: var(--${gm.id}-update-highlight-hover-color);
          }
          #${gm.id} [data-type=updated] .gm-updated,
          #${gm.id} [data-type=updated] .gm-updated input,
          #${gm.id} [data-type=updated] .gm-updated select {
            background-color: var(--${gm.id}-update-highlight-color);
          }
          #${gm.id} [data-type=updated] .gm-updated option {
            background-color: var(--${gm.id}-background-color);
          }
          #${gm.id} [data-type=updated] .gm-updated:hover {
            color: var(--${gm.id}-update-highlight-hover-color);
            font-weight: bold;
          }

          #${gm.id} .gm-reset:hover,
          #${gm.id} .gm-changelog:hover {
            color: var(--${gm.id}-hint-text-highlight-color);
            text-decoration: underline;
          }

          #${gm.id} .gm-title {
            font-size: 1.6em;
            margin: 1.6em 0.8em 0.8em 0.8em;
            text-align: center;
          }

          #${gm.id} .gm-subtitle {
            font-size: 0.4em;
            margin-top: 0.4em;
          }

          #${gm.id} .gm-batchAddManager .gm-batchAddManager-page {
            width: 70em;
          }
          #${gm.id} .gm-batchAddManager .gm-comment {
            margin: 1.4em 2.5em 0.5em;
            font-size: 1.2em;
            line-height: 1.8em;
          }
          #${gm.id} .gm-batchAddManager .gm-comment button {
            margin-left: 1em;
            padding: 0.1em 0.3em;
            border-radius: 2px;
            cursor: pointer;
          }
          #${gm.id} .gm-batchAddManager .gm-comment button:not([disabled]):hover {
            background-color: var(--${gm.id}-background-highlight-color);
          }
          #${gm.id} .gm-batchAddManager .gm-comment input {
            width: 3em;
            padding: 0 0.2em;
            border-width: 0 0 1px 0;
            text-align: center;
          }
          #${gm.id} .gm-batchAddManager .gm-comment input,
          #${gm.id} .gm-batchAddManager .gm-comment button {
            line-height: normal;
          }
          #${gm.id} .gm-batchAddManager .gm-items {
            width: calc(100% - 2.5em * 2);
            height: 28em;
            padding: 0.4em 0;
            margin: 0 2.5em;
            font-size: 1.1em;
            border: 1px solid var(--${gm.id}-scrollbar-thumb-color);
            border-radius: 4px;
            overflow-y: scroll;
          }
          #${gm.id} .gm-batchAddManager .gm-items .gm-item {
            display: block;
            padding: 0.2em 1em;
          }
          #${gm.id} .gm-batchAddManager .gm-items .gm-item:hover {
            background-color: var(--${gm.id}-background-highlight-color);
          }
          #${gm.id} .gm-batchAddManager .gm-items .gm-item input {
            vertical-align: -0.15em;
          }
          #${gm.id} .gm-batchAddManager .gm-items .gm-item input + a,
          #${gm.id} .gm-batchAddManager .gm-items .gm-item input + a:hover,
          #${gm.id} .gm-batchAddManager .gm-items .gm-item input + a:link,
          #${gm.id} .gm-batchAddManager .gm-items .gm-item input + a:visited,
          #${gm.id} .gm-batchAddManager .gm-items .gm-item input + a:active {
            text-decoration: inherit;
            color:inherit;
            font-weight: inherit;
          }
          #${gm.id} .gm-batchAddManager .gm-items .gm-item a {
            margin-left: 0.5em;
            color: var(--${gm.id}-hint-text-color);
          }
          #${gm.id} .gm-batchAddManager .gm-items .gm-item:hover a {
            color: var(--${gm.id}-highlight-color);
          }
          #${gm.id} .gm-batchAddManager .gm-items .gm-item a:hover {
            font-weight: bold;
          }
          #${gm.id} .gm-batchAddManager .gm-bottom button {
            margin: 0 0.4em;
            padding: 0.3em 0.7em;
          }

          #${gm.id} .gm-shadow {
            background-color: var(--${gm.id}-shadow-color);
            position: fixed;
            top: 0%;
            left: 0%;
            width: 100%;
            height: 100%;
          }
          #${gm.id} .gm-shadow[disabled] {
            cursor: unset !important;
          }

          #${gm.id} label {
            cursor: pointer;
          }

          #${gm.id} input,
          #${gm.id} select,
          #${gm.id} button {
            font-size: 100%;
            appearance: auto;
            outline: none;
            border: 1px solid var(--${gm.id}-border-color);
            border-radius: 0;
            color: var(--${gm.id}-text-color);
            background-color: var(--${gm.id}-background-color);
          }
          #${gm.id} button input[type=file] {
            display: none;
          }

          #${gm.id} [disabled],
          #${gm.id} [disabled] * {
            cursor: not-allowed !important;
            color: var(--${gm.id}-disabled-color) !important;
          }

          #${gm.id}-video-btn {
            margin-right: 24px;
          }
          #${gm.id}-video-btn[data-toolbar-version=old] {
            display: flex;
            align-items: center;
            user-select: none;
            margin-right: 20px;
          }
          #${gm.id}-video-btn input[type=checkbox] {
            margin-right: 2px;
            cursor: pointer;
          }

          #${gm.id} .gm-items::-webkit-scrollbar,
          #${gm.id} .gm-history .gm-content::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            background-color: var(--${gm.id}-scrollbar-background-color);
          }
          #${gm.id} .gm-history .gm-content::-webkit-scrollbar-thumb {
            border-radius: 3px;
            background-color: var(--${gm.id}-scrollbar-background-color);
          }
          #${gm.id} .gm-items::-webkit-scrollbar-thumb,
          #${gm.id} .gm-history .gm-content:hover::-webkit-scrollbar-thumb {
            border-radius: 3px;
            background-color: var(--${gm.id}-scrollbar-thumb-color);
          }
          #${gm.id} gm-items::-webkit-scrollbar-corner,
          #${gm.id} .gm-history .gm-content::-webkit-scrollbar-corner {
            background-color: var(--${gm.id}-scrollbar-background-color);
          }

          #${gm.id} .gm-entrypopup .gm-search {
            font-size: 1.3em;
            line-height: 2.6em;
            padding-left: 0.9em;
          }
          #${gm.id} .gm-entrypopup .gm-search input[type=text] {
            border: none;
            width: 18.5em;
          }

          .${gm.id}-dialog code {
            font-family: Consolas, Courier New, monospace;
          }
          .${gm.id}-dialog .gm-import-wl-container {
            font-size: 0.8em;
          }
          .${gm.id}-dialog .gm-import-wl-container .gm-group-container {
            margin: 0.5em 0;
          }
          .${gm.id}-dialog .gm-import-wl-container .gm-interactive {
            margin-top: 0;
            border-width: 0 0 1px 0;
            font-family: Consolas, Courier New, monospace;
          }
          .${gm.id}-dialog .gm-import-wl-container #gm-import-wl-regex {
            width: calc(100% - 4em);
            margin: 0 2em;
          }
          .${gm.id}-dialog .gm-import-wl-container .gm-capturing-group {
            display: flex;
            padding-left: 2em;
          }
          .${gm.id}-dialog .gm-import-wl-container .gm-capturing-group > div {
            text-align: center;
            margin-right: 1em;
          }
          .${gm.id}-dialog .gm-import-wl-container .gm-capturing-group .gm-interactive {
            width: 3.6em;
            text-align: center;
          }

          .gm-search input[type=text] {
            line-height: normal;
            outline: none;
            padding-right: 6px;
            color: var(--${gm.id}-text-color);
          }
          .gm-search input[type=text]::placeholder {
            font-size: 0.9em;
            color: var(--${gm.id}-light-hint-text-color);
          }
          .gm-search-clear {
            display: inline-block;
            color: var(--${gm.id}-hint-text-color);
            cursor: pointer;
            visibility: hidden;
          }
          .gm-filtered,
          [class*=gm-filtered-] {
            display: none !important;
          }

          .watch-later-list .list-box > span {
            display: flex;
            flex-direction: column;
            overflow-anchor: none; /* 禁用滚动锚定，避免滚动跟随项目位置变化 */
          }
          .watch-later-list .btn-del {
            display: none;
          }
          .watch-later-list .gm-list-item-fail-tooltip {
            font-weight: bold;
            text-decoration: underline;
          }
          .watch-later-list .gm-list-item-fail-tooltip:hover {
            color: black;
          }
          .watch-later-list .gm-list-item-tools,
          .watch-later-list .gm-list-item-fail-tooltip {
            color: #999;
          }
          .watch-later-list .gm-list-item-tools > *,
          .watch-later-list .gm-list-item-fail-tooltip {
            margin: 0 5px;
            cursor: pointer;
          }
          .watch-later-list .gm-list-item-tools span:hover {
            text-decoration: underline;
            font-weight: bold;
          }
          .watch-later-list .gm-list-item-tools input {
            vertical-align: -3px;
          }
          .watch-later-list .gm-removed .gm-list-item-fixer {
            display: none;
          }
          .watch-later-list .gm-removed,
          .watch-later-list .gm-invalid {
            filter: grayscale(1);
          }
          .watch-later-list .gm-fixed .key,
          .watch-later-list .gm-removed .key {
            visibility: hidden;
          }
          .watch-later-list .gm-removed .t {
            text-decoration: line-through !important;
          }
          .watch-later-list .gm-invalid .t {
            font-weight: unset !important;
          }
          .watch-later-list .gm-removed .t,
          .watch-later-list .gm-invalid .t {
            color: var(--${gm.id}-hint-text-color) !important;
          }
          .watch-later-list .gm-invalid a:not(.user) {
            cursor: not-allowed !important;
          }

          .gm-fixed {
            order: 1000 !important;
          }
          .gm-fixed .gm-list-item-fixer,
          .gm-fixed .gm-card-fixer {
            font-weight: bold;
          }
          .watch-later-list .list-box > [sort-type-fixed] .gm-fixed,
          #${gm.id} .gm-entrypopup .gm-entry-list[gm-list-reverse] .gm-fixed,
          #${gm.id} .gm-entrypopup .gm-entry-list[sort-type-fixed] .gm-fixed {
            order: -1000 !important;
          }

          [gm-list-reverse] {
            flex-direction: column-reverse !important;
          }
          .gm-list-reverse-end {
            order: unset !important;
          }
          [gm-list-reverse] .gm-list-reverse-end {
            margin-top: auto !important;
            order: -9999 !important;
          }

          .gm-fixed {
            border: 2px dashed var(--${gm.id}-light-hint-text-color) !important;
          }
          .gm-fixed-hint {
            font-weight: bold !important;
          }
        `)
      } else {
        if (api.base.urlMatch(gm.regex.page_dynamicMenu)) {
          this.addMenuScrollbarStyle()
        }
      }
    }
  }

  (function() {
    script = new Script()
    webpage = new Webpage()
    if (!webpage.method.isLogin()) {
      api.logger.info('终止执行：脚本只能工作在B站登录状态下。')
      return
    }

    script.initAtDocumentStart()
    if (api.base.urlMatch([gm.regex.page_videoWatchlaterMode, gm.regex.page_listWatchlaterMode])) {
      if (gm.config.redirect && gm.searchParams.get(`${gm.id}_disable_redirect`) !== 'true') {
        webpage.redirect()
        return
      }
    }

    webpage.method.cleanSearchParams()
    webpage.addStyle()
    if (gm.config.mainRunAt === Enums.mainRunAt.DOMContentLoaded) {
      document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', main) : main()
    } else {
      document.readyState !== 'complete' ? window.addEventListener('load', main) : main()
    }

    function main() {
      script.init()
      if (self === top) {
        script.addScriptMenu()
        api.base.initUrlchangeEvent()

        if (gm.config.headerButton) {
          webpage.addHeaderButton()
        }
        if (gm.config.removeHistory) {
          webpage.processWatchlaterListDataSaving()
        }
        if (gm.config.fillWatchlaterStatus !== Enums.fillWatchlaterStatus.never) {
          webpage.fillWatchlaterStatus()
        }

        if (api.base.urlMatch(gm.regex.page_watchlaterList)) {
          webpage.initWatchlaterListPage()
          webpage.processWatchlaterListPage()
        } else if (api.base.urlMatch([gm.regex.page_videoNormalMode, gm.regex.page_videoWatchlaterMode, gm.regex.page_listMode])) {
          if (gm.config.videoButton) {
            webpage.addVideoButton()
          }
        } else if (api.base.urlMatch(gm.regex.page_dynamic)) {
          if (gm.config.dynamicBatchAddManagerButton) {
            webpage.addBatchAddManagerButton()
          }
        }

        webpage.processSearchParams()
      } else {
        if (api.base.urlMatch(gm.regex.page_dynamicMenu)) {
          if (gm.config.fillWatchlaterStatus !== Enums.fillWatchlaterStatus.never) {
            webpage.fillWatchlaterStatus()
          }
        }
      }
    }
  })()
})()
