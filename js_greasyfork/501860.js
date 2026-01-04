// ==UserScript==
// @name         bilibili-fuck
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  去你的bilibili推荐!我要学习!!!
// @match        https://www.bilibili.com/
// @match        www.bilibili.com/?spm_id_from=*
// @match        https://search.bilibili.com/*
// @match        https://www.bilibili.com/video/*
// @match        https://message.bilibili.com/*
// @author       XyGodCyx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlhttpRequest
// @connect      api.bilibili.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.18.0/js/md5.min.js
// @run-at       document-end
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/501860/bilibili-fuck.user.js
// @updateURL https://update.greasyfork.org/scripts/501860/bilibili-fuck.meta.js
// ==/UserScript==

// @match        *://*.bilibili.com/*
;(function () {
  'use strict'

  // 因为我们改变了策略,直接重写主内容区,所以不需要禁用广告,但是代码不删
  // setInterval(() => {
  //   removeAllAD()
  // }, 200)
  // 因为b站的接口需要鉴权,需要每隔一段时间就要重新获取接口
  const needReGetDataDiffTime = 1000 * 60 * 60 * 8
  // 在进入网站时显示净化中的遮挡横幅,免得在净化过程中看到好看的忍不住点进去
  let panel = null
  const bodyOverflowStyle = document.body.style.overflow
  function initLargerPanel() {
    document.body.style.overflow = 'hidden'
    createInitLargerPanel()
    function createInitLargerPanel() {
      panel = document.createElement('div')
      function initStyle() {
        panel.style.width = '100vw'
        panel.style.height = '100vh'
        panel.style.zIndex = 2147483647
        panel.style.position = 'absolute'
        panel.style.top = 0
        panel.style.left = 0
        panel.style.display = 'flex'
        panel.style.alignItems = 'center'
        panel.style.justifyContent = 'center'
        panel.style.backgroundColor = '#00AEEC'
        panel.style.fontSize = '100px'
        panel.textContent = '正在净化bilibili...'
        panel.style.overflow = 'hidden'
        panel.style.color = '#ffffff'
      }
      initStyle()
      document.body.appendChild(panel)
    }
  }
  function removeLargerPanel() {
    if (!panel) {
      return
    }
    panel.remove()
    document.body.style.overflow = bodyOverflowStyle
    panel = null
  }

  let offset = 1
  // 一开始就初始化自定义的css样式
  const customCssStyle = {
    nav_search_input: `
    
      #i_cecream > div.bili-feed4  .center-search-container{
        margin-left:100px !important;
      }
      .bili-header .center-search-container .center-search__bar .nav-search-content .nav-search-input::placeholder {
        color:transparent;
      }
     #i_cecream div.trending{
       display:none !important;
     }
    `,
    // 原版b站为了做方便加载,直接把多余的隐藏了
    card: `
    @media screen and (min-width: 1px) {
      .recommended-container_floor-aside .container .feed-card:nth-of-type(n + 12) {
        display: block !important;
      }
      .recommended-container_floor-aside .container>*:nth-of-type(6){
       margin-top:40px !important;
      }
      .recommended-container_floor-aside .container>*:nth-of-type(7){
       margin-top:40px !important;
      }
    }
    `,
    // header的logo
    bili_header__logo: `
    .bili-header .left-entry__title{
      display:none;
    }
    .bili-header .left-entry .entry-title{
      display:none;
    }
    `,
    // 右下角的下载弹窗
    desktop_download_tip: `
      .desktop-download-tip[data-v-7b3c00b0]{
         display:none !important;
      }
      html body #app .desktop-download-tip{
         display:none !important;
      }
      .desktop-download-tip{
         display:none !important;
      }
    `,
    // header左边上下切换的小广告
    loc_moveclip: `
      .loc-entry.loc-moveclip{
        display:none !important;
      }
      .left-loc-entry{
        display:none !important;
      }
    `,
    // 额外创建的css样式
    bili_fuck: `
    .bili_fuck_classify_warp{
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: start;
      align-items: center;
      gap: 10px;
      margin: 10px 0;
    }
    .bili_fuck_classify_btn{
      background: #00AEEC;
      width: auto;
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      border-radius: 3px;
    }
    .bili_fuck_classify_btn.active{
      background: #0088cc;
      border: 2px solid #0088aa;
      scale: 1.1;
    }
    .bili_fuck_classify_btn:hover{
      cursor:pointer;
      background:#0088cc;
    }
    `,
    // 弹幕,无论是学习还是观影,看弹幕都会降低体验并且会潜移默化的降低注意力
    // bpx_player_row_dm_wrap: `
    // .bpx-player-row-dm-wrap{
    //   display:none !important;
    // }
    // .bpx-player-cmd-dm-wrap{
    //   display:none !important;
    // }
    // `,
    // 播放页的播放列表宽高
    video_sections_content_list: `
    #mirror-vdcon > div.right-container.is-in-large-ab > div > div:nth-child(8) > div > div.video-sections-content-list{
      max-height: 560px !important;
    }
    #mirror-vdcon div.video-episode-card__info-title{
      width: 370px !important;
    }
    `,
  }
  function initCustomCssStyle() {
    const styleDom = document.createElement('style')
    document.head.appendChild(styleDom)
    for (let key in customCssStyle) {
      const style = customCssStyle[key]
      styleDom.innerHTML += style
      // addStyleSheet(style)
    }
    function addStyleSheet(rules) {
      const regex = /([^{}]+\{[^{}]*\})|(@[^\s{][^{]*\{([^{}]*\{[^{}]*\})+[^{}]*\})/g
      const _rules = rules.match(regex)
      _rules?.forEach((rule) => {
        styleDom.sheet?.insertRule(rule, styleDom.sheet.cssRules.length)
      })
    }
  }
  initCustomCssStyle()
  if (window.location.href.includes('www.bilibili.com/video')) {
    // 视频播放页和消息页
    hideVideoPageHeader()
  } else if (window.location.href.includes('message.bilibili.com')) {
    hideMessagePageHeader()
  } else if (
    window.location.href === 'https://www.bilibili.com/' ||
    window.location.href === 'https://www.bilibili.com/index.html ' ||
    window.location.href.includes('www.bilibili.com/?spm_id_from')
  ) {
    // bilibili的主页
    // 最好还是一开始就显示遮挡层
    offset = 1
    initLargerPanel()
  }
  // 在所有元素加载完毕后干些事情,等待几毫米是因为要确保在下一次事件循环的时候才开始执行,确保元素已经完全加载完毕
  window.onload = async function () {
    // removeAllAD()
    // 暂时就净化这三个页面
    if (window.location.href.includes('search.bilibili.com')) {
      // 搜索页
      await waitMilliSeconds(10)
      await initNeedReplaceEntryDom()
      replaceNavDom()
    } else if (
      window.location.href === 'https://www.bilibili.com/' ||
      window.location.href === 'https://www.bilibili.com/index.html' ||
      window.location.href.includes('www.bilibili.com/?spm_id_from')
    ) {
      // bilibili的主页
      offset = 1
      init()
    } else if (window.location.href.includes('www.bilibili.com/video')) {
      // 视频播放页
      await initUpdateStyleDom()
      updateStyle()
      setInterval(() => {
        const list = document.querySelector(
          '#mirror-vdcon > div.right-container.is-in-large-ab > div > div:nth-child(8) > div > div.video-sections-content-list'
        )
        list.style.height = '560px'
      }, 1000)
    }
  }
  function hideVideoPageHeader() {
    const nav = document.querySelector('#biliMainHeader')
    nav.style.opacity = 0
    nav.style.position = 'absolute'
    nav.style.top = '-10000px'
    nav.style.left = '-10000px'
  }
  function hideMessagePageHeader() {
    const nav = document.querySelector('#home_nav')
    const message_navbar = document.querySelector('#message-navbar')
    const container = document.querySelector('.container')
    if (!nav || !message_navbar || container) {
      return
    }
    nav.remove()
    message_navbar.remove()
    container.style.marginTop = '10px'
  }
  let excludeTag = [
    '鬼畜',
    '素材',
    '比利',
    '沙雕',
    '马凯',
    '美食',
    '同性恋',
    '大战',
    'VAN',
    '更衣室',
    '本篇',
    'parody',
    '恶搞',
    '测评',
    '小说',
    '网络小说',
    '娱乐',
  ]
  let classifies = [
    {
      text: '全部',
      value: 'all',
    },

    {
      text: 'js',
      value: ['javascript', 'JavaScript'],
      exclude: ['vue', 'Vue', 'Vue2.0', 'Vue3.0'],
    },

    {
      text: 'css',
      value: ['CSS', 'CSS3'],
      // 因为有的教程会把跟前端相关的所有tag都加上,所以需要排除掉当前分类不需要的
      exclude: ['vue', 'Vue', 'Vue2.0', 'Vue3.0', 'javascript', 'JavaScript'],
    },

    {
      text: 'vue',
      value: ['vue', 'Vue', 'Vue2.0', 'Vue3.0'],
    },

    {
      text: 'node.js',
      value: ['node', 'node.js', 'Nodejs', 'Node.js'],
    },

    {
      text: '网络',
      value: ['计算机网络', '网络'],
    },

    {
      text: '编译器',
      value: '编译器',
    },
    {
      text: '算法',
      value: '算法',
    },
    {
      text: '数据结构',
      value: '数据结构',
    },
    {
      text: '专升本',
      value: [
        '专升本英语',
        '江西专升本',
        '专升本计算机',
        '专升本政治',
        '专升本数学',
        '专升本数学',
        '专升本',
      ],
    },
    {
      text: '考研',
      value: ['考研', '考研英语', '考研数学'],
    },
    {
      text: '哲学•道家•修仙',
      value: ['哲学', '人生意义', '道家', '修仙'],
    },
    {
      text: 'Udemy',
      value: ['Udemy', 'udemy', 'Udemy课程', 'Udemy教程'],
    },
  ]
  let allCardData = []

  async function init() {
    createClassify()
    await waitMilliSeconds(1)
    initAllDom()

    await waitMilliSeconds(2)
    addEventFromMaineedAddEventDom()

    await waitMilliSeconds(4)
    hideShouldKill()

    await waitMilliSeconds(6)
    initUpdateStyleDom()

    await waitMilliSeconds(10)
    updateStyle()

    // 填充数据的过程
    await waitMilliSeconds(2)
    await WantIWhatCreateCard(1, 'vue进阶')
    await WantIWhatCreateCard(1, 'vue源码')
    await WantIWhatCreateCard(1, 'vue入门')
    await WantIWhatCreateCard(1, 'JavaScript游戏')
    await WantIWhatCreateCard(1, 'javascript进阶')
    await WantIWhatCreateCard(1, 'javascript源码')
    await WantIWhatCreateCard(1, 'nodejs')
    await WantIWhatCreateCard(1, 'css')
    await WantIWhatCreateCard(1, 'css设计')
    await WantIWhatCreateCard(1, 'css灵感')
    await WantIWhatCreateCard(1, 'css创意')
    await WantIWhatCreateCard(1, '计算机网络')
    await WantIWhatCreateCard(2, '计算机网络')
    await WantIWhatCreateCard(1, '编译器入门')
    await WantIWhatCreateCard(1, '算法入门')
    await WantIWhatCreateCard(1, '数据结构入门')
    await WantIWhatCreateCard(1, '专升本')
    await WantIWhatCreateCard(1, '江西专升本')
    await WantIWhatCreateCard(1, '考研')
    await WantIWhatCreateCard(1, '哲学')
    await WantIWhatCreateCard(1, '道家')
    await WantIWhatCreateCard(1, '修仙')
    await WantIWhatCreateCard(1, 'udemy')
    await WantIWhatCreateCard(2, 'udemy')
    await WantIWhatCreateCard(3, 'udemy')
    allCardData = uniqueArrayByProperty(allCardData, 'id')
    localStorage.setItem('allCardDom', allCardData)
    console.log(allCardData)
    // 根据数据创建dom
    createCardDomForAllCardDom()

    setTimeout(async () => {
      await initUpdateStyleDom()
      updateStyle()
    }, 3)

    await waitMilliSeconds(2)
    replaceNavDom()

    await waitMilliSeconds(1)
    removeLargerPanel()
  }
  // 数据结构为引用类型的去重和排除excludeTag包含的内容
  function uniqueArrayByProperty(arr, prop) {
    const seen = new Set()
    return arr.filter((item) => {
      for (let i = 0; i < excludeTag.length; i++) {
        const tag = excludeTag[i]
        if (item.tag.includes(tag) || item.title.includes(tag)) {
          return false
        }
      }
      const key = item[prop]
      if (seen.has(key)) {
        return false
      } else {
        seen.add(key)
        return true
      }
    })
  } // 可能是接口的问题,返回的多页数据有重复,需要去重

  // 初始化dom元素
  const needAddEventDom = {
    // 搜索的热搜,最坏的一个营销手段!
    nav_search_input: {
      select: '.nav-search-input',
      value: null,
      status: 'normal',
      events: {
        click: async function () {
          await waitMilliSeconds(10)
          const history_fold_wrap = document.querySelector('.history-fold-wrap')
          const clickEvent = new MouseEvent('click')
          history_fold_wrap.dispatchEvent(clickEvent)
        },
      },
    },
  }
  function initNeedAddEventDom() {
    return new Promise((resolve, reject) => {
      getDom(needAddEventDom)
      resolve(true)
    })
  }

  // 直接内联
  const updateStyleDom = {
    large_header: {
      select: '.large-header',
      value: null,
      status: 'normal',
      wantAddStyle: {
        marginBottom: '5px',
      },
    },
    feed_card1: {
      // 因为去除了轮播图,所以第六个元素的样式会受到影响,所以需要调整
      select: '.feed-card:nth-child(6)',
      value: null,
      status: 'normal',
      wantAddStyle: {
        marginTop: '40px',
      },
    },
    feed_card2: {
      // 因为去除了轮播图,所以第七个元素的样式会受到影响,所以需要调整
      select: '.feed-card:nth-child(7)',
      value: null,
      status: 'normal',
      wantAddStyle: {
        marginTop: '40px',
      },
    },
    // 播放页的播放列表加高
    video_sections_content_list: {
      select:
        '#mirror-vdcon > div.right-container.is-in-large-ab > div > div:nth-child(8) > div > div.video-sections-content-list',
      value: null,
      status: 'normal',
      wantAddStyle: {
        height: '560px',
      },
    },
  }

  function initUpdateStyleDom() {
    return new Promise((resolve, reject) => {
      getDom(updateStyleDom)
      resolve(true)
    })
  }
  const shouldKillDom = {
    headerChannel: {
      select: '.header-channel',
      value: null,
      status: 'normal',
    },
    biliHeader__channel: {
      select: '.bili-header__channel',
      value: null,
      status: 'normal',
    },
    carousel_container: {
      select: '.recommended-swipe',
      value: null,
      status: 'normal',
    },
    // 顶部的检查去广告横幅
    adblock_tips: {
      select: '.adblock-tips',
      value: null,
      status: 'normal',
    },
    // 右上角的换一换按钮
    feed_roll_btn: {
      select: '.feed-roll-btn',
      value: null,
      status: 'normal',
    },
    // 右下角的反馈按钮组,返回顶部不删
    palette_button_wrap: {
      select: '.palette-button-wrap > *:not(:last-child)',
      value: null,
      status: 'normal',
    },
    // 下载客户端按钮,免得受不了去用客户端了
    download_entry: {
      select: '.download-entry.download-client-trigger',
      value: null,
      status: 'normal',
    },
    // 上方的banner跳转链接
    head_title: {
      select: '.head-title',
      value: null,
      status: 'normal',
    },
    // 也是banner跳转链接
    banner_link: {
      select: '.banner-link',
      value: null,
      status: 'normal',
    },
  }
  function initShouldKill() {
    return new Promise((resolve, reject) => {
      getDom(shouldKillDom)
      resolve(true)
    })
  }

  const needPushCustomChildrenDom = {
    // 主页面的推荐视频容器
    is_version8: {
      select: '.is-version8',
      value: null,
      status: 'normal',
    },
  }

  const leftReplaceBaseInfo = {
    status: 'normal',
    replace: `
    <li class="v-popover-wrap">
      <a
        href="#"
        class="default-entry"
        ><span>学习</span></a>
    </li>
   `,
  }
  const rightReplaceBaseInfo = {
    status: 'normal',
    replace: `
    <li class="v-popover-wrap">
      <a
        href="#"
        class="right-entry__outside"
        ><span class="right-entry-text">学习</span></a>
    </li>
    `,
  }
  const needReplaceEntryDom = {
    // left
    shouye: {
      select: '.left-entry > :first-child',
      value: null,
      ...leftReplaceBaseInfo,
    },
    fanju: {
      select: '.left-entry .v-popover-wrap:nth-child(2)',
      value: null,
      ...leftReplaceBaseInfo,
    },
    zhibo: {
      select: '.left-entry .v-popover-wrap:nth-child(3)',
      value: null,
      ...leftReplaceBaseInfo,
    },
    game_center: {
      select: '.left-entry .v-popover-wrap:nth-child(4)',
      value: null,
      ...leftReplaceBaseInfo,
    },
    vip_shop: {
      select: '.left-entry .v-popover-wrap:nth-child(5)',
      value: null,
      ...leftReplaceBaseInfo,
    },
    manhua: {
      select: '.left-entry .v-popover-wrap:nth-child(6)',
      value: null,
      ...leftReplaceBaseInfo,
    },
    saishi: {
      select: '.left-entry .v-popover-wrap:nth-child(7)',
      value: null,
      ...leftReplaceBaseInfo,
    },
    // right
    // 不愧是大会员,还要一个专门的div包着
    dahuiyuan: {
      select: '.vip-wrap',
      value: null,
      ...rightReplaceBaseInfo,
    },
    // 相比直接学习,从动态获取的碎片知识远小于浪费的时间
    dongtai: {
      select: '.right-entry .v-popover-wrap:nth-child(4)',
      value: null,
      ...rightReplaceBaseInfo,
    },
    // banner图
    bili_header__banner: {
      select: '.bili-header__banner',
      value: null,
      status: 'normal',
      replace: `<div style="
      width:100%;
      height:100%;
      background:#00AEEC;
      color:#ffffff;
      font-size:40px;
      display:flex;
      justify-content:center;
      align-items:center;
      padding:10px;
      ">革命尚未成功,同志仍需努力</div>`,
    },
  }
  function initNeedReplaceEntryDom() {
    return new Promise((resolve, reject) => {
      getDom(needReplaceEntryDom)
      resolve(true)
    })
  }

  // 整合一下
  const allDom = {
    ...shouldKillDom,
    ...updateStyleDom,
    ...needPushCustomChildrenDom,
    ...needReplaceEntryDom,
    ...needAddEventDom,
  }

  function initAllDom() {
    return new Promise((resolve, reject) => {
      getDom(allDom)
      resolve(true)
    })
  }

  // 主要的净化操作,添加B站的学习视频到主内容区
  let allClassifyDom = []
  // page和keyword数据会在sendRequest函数里用到,请求搜索内容
  let page = 1
  let keyword = 'vue'
  let taskQueue = []

  async function createCardDomForAllCardDom(doms = allCardData, needCreateCount = -1) {
    clearTasks()
    needCreateCount = needCreateCount === -1 ? doms.length : needCreateCount
    doms.sort((a, b) => b.play - a.play)
    deleteAllChild()
    removeLargerPanel()
    await waitMilliSeconds(1)

    for (let i = 0; i < doms.length; i += 20) {
      const batch = doms.slice(i, i + 20)
      let id = null
      // 任务
      const taskPromise = new Promise((resolve) => {
        id = setTimeout(
          () => {
            createAllCard(batch)
            resolve()
          },
          i < 50 ? i : 50
        )

        // 将 timerId 添加到 taskPromise 中，以便后续取消任务
        // this.timerId = timerId
      })
      taskPromise.timerId = id
      // 添加到任务队列,方便统一取消
      taskQueue.push(taskPromise)
    }

    function deleteAllChild() {
      for (let key in needPushCustomChildrenDom) {
        const element = needPushCustomChildrenDom[key]
        if (!element.value) {
          continue
        }
        element.value.innerHTML = ''
      }
    } // 向主内容区添加学习视频前要清除先所有的元素

    function createAllCard(batch) {
      for (let i = 0; i < batch.length; i++) {
        const item = batch[i]
        const card = createVideoCard(item)
        needPushCustomChildrenDom.is_version8.value.appendChild(card)
      }
    }
  }

  function clearTasks() {
    // 取消所有旧任务
    taskQueue.forEach((task) => {
      clearTimeout(task.timerId)
    })

    // 清空任务队列
    taskQueue = []
  }

  function createVideoCard(item) {
    let { arcurl, pic, upic, mid, title, duration, play, danmaku, author, pubdate } = item
    const parser = new DOMParser()
    title = title.replace(/<[^>]+>/, '') // 去除html标签

    const cardHtml = `
     <div
      data-v-7b96dfea=""
      class="feed-card">
      <div
        data-v-7b96dfea=""
        class="bili-video-card is-rcmd enable-no-interest"
        data-report="tianma.2-2-4.click"
        style="--cover-radio: 56.25%">
        <div class="bili-video-card__skeleton hide">
          <div class="bili-video-card__skeleton--cover"></div>
          <div class="bili-video-card__skeleton--info">
            <div class="bili-video-card__skeleton--right">
              <p class="bili-video-card__skeleton--text"></p>
              <p class="bili-video-card__skeleton--text short"></p>
              <p class="bili-video-card__skeleton--light"></p>
            </div>
          </div>
        </div>
        <!---->
        <!--内容区域 -->
         <div class="bili-video-card__wrap __scale-wrap">
      <div
        class="bili-video-card__no-interest"
        style="display: none">
        <div class="bili-video-card__no-interest--inner">
          <div class="bili-video-card__no-interest--left">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 36 36"
              width="36"
              height="36"
              class="no-interest-icon"
              fill="currentColor">
              <path
                d="M3 18C3 9.715724999999999 9.715724999999999 3 18 3C26.284274999999997 3 33 9.715724999999999 33 18C33 26.284274999999997 26.284274999999997 33 18 33C9.715724999999999 33 3 26.284274999999997 3 18zM12.796710000000001 12.694004999999999C12.358049999999999 12.253995 11.645745 12.2529 11.205735 12.691575C10.765709999999999 13.130234999999999 10.764615 13.842555 11.20329 14.282565000000002L13.41144 16.494975L11.20329 18.7074C10.764615 19.147350000000003 10.765709999999999 19.8597 11.205735 20.298375C11.645745 20.73705 12.358049999999999 20.735925 12.796710000000001 20.295975L15.2682 17.81895C15.99795 17.087175000000002 15.99795 15.902775000000002 15.2682 15.17097L12.796710000000001 12.694004999999999zM24.794325 12.691575C24.354300000000002 12.2529 23.64195 12.253995 23.203274999999998 12.694004999999999L20.7318 15.17097C20.00205 15.902775000000002 20.00205 17.087175000000002 20.7318 17.81895L23.203274999999998 20.295975C23.64195 20.735925 24.354300000000002 20.73705 24.794325 20.298375C25.234274999999997 19.8597 25.2354 19.147350000000003 24.796725000000002 18.7074L22.588575 16.494975L24.796725000000002 14.282565000000002C25.2354 13.842555 25.234274999999997 13.130234999999999 24.794325 12.691575zM15.900974999999999 24.68535C16.843875 23.425575000000002 17.722649999999998 23.257199999999997 18 23.257199999999997C18.277350000000002 23.257199999999997 19.15605 23.425575000000002 20.099025 24.68535C20.471024999999997 25.182975 21.176025 25.284675 21.67365 24.912675C22.171274999999998 24.540599999999998 22.273049999999998 23.8356 21.900975 23.33805C20.5938 21.591 19.082024999999998 21.007199999999997 18 21.007199999999997C16.917900000000003 21.007199999999997 15.406125 21.591 14.09898 23.33805C13.72692 23.8356 13.82871 24.540599999999998 14.326305 24.912675C14.823929999999999 25.284675 15.5289 25.182975 15.900974999999999 24.68535z"
                fill="currentColor"></path></svg
            ><span class="no-interest-title">不感兴趣</span
            ><span class="no-interest-desc">将减少此类内容推荐</span>
          </div>
          <div class="bili-video-card__no-interest--right">
            <div class="revert-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                class="revert-icon"
                fill="currentColor">
                <path
                  d="M8.28032 2.46967C8.57321 2.76257 8.57321 3.23744 8.28032 3.53033L4.81065 7L8.28032 10.46965C8.57321 10.76255 8.57321 11.23745 8.28032 11.53035C7.98743 11.8232 7.51254 11.8232 7.21966 11.53035L3.57321 7.88389C3.08505 7.39573 3.08505 6.60428 3.57321 6.11612L7.21966 2.46967C7.51254 2.17678 7.98743 2.17678 8.28032 2.46967z"
                  fill="currentColor"></path>
                <path
                  d="M3.75 7C3.75 6.58579 4.08579 6.25 4.5 6.25L14.25 6.25C17.97795 6.25 21 9.27208 21 13C21 16.72795 17.97795 19.75 14.25 19.75L7.5 19.75C7.08579 19.75 6.75 19.4142 6.75 19C6.75 18.5858 7.08579 18.25 7.5 18.25L14.25 18.25C17.1495 18.25 19.5 15.8995 19.5 13C19.5 10.10052 17.1495 7.75 14.25 7.75L4.5 7.75C4.08579 7.75 3.75 7.41421 3.75 7z"
                  fill="currentColor"></path>
              </svg>
              撤销
            </div>
          </div>
        </div>
      </div>
      <a
        class="bili-video-card__image--link"
        href="${arcurl}"
        target="_blank"
        data-spmid="333.1007"
        data-mod="tianma.2-1-3"
        data-idx="click"
        ><div class="bili-video-card__image __scale-player-wrap bili-video-card__image--hover">
          <div class="bili-video-card__image--wrap">
            <div class="bili-watch-later--wrap">
              <div
                class="bili-watch-later bili-watch-later--pip watch-later-fade-enter-to"
                style="display: none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 20 20"
                  width="20"
                  height="20"
                  fill="currentColor"
                  class="bili-watch-later__icon">
                  <path
                    d="M10 3.1248000000000005C6.20305 3.1248000000000005 3.1250083333333336 6.202841666666667 3.1250083333333336 9.999833333333335C3.1250083333333336 13.796750000000001 6.20305 16.874833333333335 10 16.874833333333335C11.898291666666667 16.874833333333335 13.615833333333333 16.106291666666667 14.860625 14.861916666666666C15.104708333333335 14.617916666666666 15.500416666666668 14.617958333333334 15.7445 14.862041666666668C15.9885 15.106166666666669 15.988416666666668 15.501916666666666 15.744333333333334 15.745958333333334C14.274750000000001 17.215041666666668 12.243041666666667 18.124833333333335 10 18.124833333333335C5.512691666666667 18.124833333333335 1.8750083333333334 14.487125 1.8750083333333334 9.999833333333335C1.8750083333333334 5.512483333333334 5.512691666666667 1.8748000000000002 10 1.8748000000000002C14.487291666666668 1.8748000000000002 18.125 5.512483333333334 18.125 9.999833333333335C18.125 10.304458333333333 18.108208333333334 10.605458333333333 18.075458333333337 10.901791666666668C18.0375 11.244916666666667 17.728625 11.492291666666667 17.385583333333333 11.454333333333334C17.0425 11.416416666666667 16.795083333333334 11.107541666666668 16.833000000000002 10.764458333333334C16.860750000000003 10.513625000000001 16.875 10.2585 16.875 9.999833333333335C16.875 6.202841666666667 13.796958333333333 3.1248000000000005 10 3.1248000000000005z"
                    fill="currentColor"></path>
                  <path
                    d="M15.391416666666666 9.141166666666667C15.635458333333334 8.897083333333335 16.031208333333332 8.897083333333335 16.275291666666668 9.141166666666667L17.5 10.365875L18.72475 9.141166666666667C18.968791666666668 8.897083333333335 19.364541666666668 8.897083333333335 19.608625 9.141166666666667C19.852666666666668 9.385291666666667 19.852666666666668 9.780958333333334 19.608625 10.025083333333333L18.08925 11.544416666666669C17.763833333333334 11.869833333333334 17.236208333333334 11.869833333333334 16.91075 11.544416666666669L15.391416666666666 10.025083333333333C15.147333333333334 9.780958333333334 15.147333333333334 9.385291666666667 15.391416666666666 9.141166666666667z"
                    fill="currentColor"></path>
                  <path
                    d="M12.499333333333334 9.278375C13.05475 9.599 13.05475 10.400666666666668 12.499333333333334 10.721291666666668L9.373916666666666 12.525791666666668C8.818541666666667 12.846416666666666 8.124274999999999 12.445583333333333 8.124274999999999 11.804291666666668L8.124274999999999 8.1954C8.124274999999999 7.554066666666667 8.818541666666667 7.153233333333334 9.373916666666666 7.473900000000001L12.499333333333334 9.278375z"
                    fill="currentColor"></path></svg
                ><span
                  class="bili-watch-later__tip--lab"
                  style="display: none"
                  >添加至稍后再看</span
                ><!---->
              </div>
            </div>
            <picture class="v-img bili-video-card__cover"
              ><!--[-->
              <source
                srcset="
                  ${pic}@672w_378h_1c_!web-home-common-cover.avif
                "
                type="image/avif" />
              <source
                srcset="
                  ${pic}@672w_378h_1c_!web-home-common-cover.webp
                "
                type="image/webp" />
              <img
                src="${pic}@672w_378h_1c_!web-home-common-cover"
                alt="${title}"
                loading="eager"
                onload="fsrCb()"
                onerror="typeof window.imgOnError === 'function' &amp;&amp; window.imgOnError(this)" /><!--]--></picture
            >
            <div
              class="v-inline-player"
              data-player-seek-time="0"></div>
          </div>
          <div class="bili-video-card__mask">
            <div class="bili-video-card__stats">
              <div class="bili-video-card__stats--left">
                <!--[--><span class="bili-video-card__stats--item"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="#ffffff"
                    class="bili-video-card__stats--icon">
                    <!--[-->
                    <path
                      d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                      fill="currentColor"></path>
                    <path
                      d="M14.7138 10.96875C15.50765 11.4271 15.50765 12.573 14.71375 13.0313L11.5362 14.8659C10.74235 15.3242 9.75 14.7513 9.75001 13.8346L9.75001 10.1655C9.75001 9.24881 10.74235 8.67587 11.5362 9.13422L14.7138 10.96875z"
                      fill="currentColor"></path>
                    <!--]--></svg
                  ><span class="bili-video-card__stats--text">${play}</span></span
                ><!--]--><span class="bili-video-card__stats--item"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="#ffffff"
                    class="bili-video-card__stats--icon">
                    <!--[-->
                    <path
                      d="M12 4.99805C9.48178 4.99805 7.283 5.12616 5.73089 5.25202C4.65221 5.33949 3.81611 6.16352 3.72 7.23254C3.60607 8.4998 3.5 10.171 3.5 11.998C3.5 13.8251 3.60607 15.4963 3.72 16.76355C3.81611 17.83255 4.65221 18.6566 5.73089 18.7441C7.283 18.8699 9.48178 18.998 12 18.998C14.5185 18.998 16.7174 18.8699 18.2696 18.74405C19.3481 18.65655 20.184 17.8328 20.2801 16.76405C20.394 15.4973 20.5 13.82645 20.5 11.998C20.5 10.16965 20.394 8.49877 20.2801 7.23205C20.184 6.1633 19.3481 5.33952 18.2696 5.25205C16.7174 5.12618 14.5185 4.99805 12 4.99805zM5.60965 3.75693C7.19232 3.62859 9.43258 3.49805 12 3.49805C14.5677 3.49805 16.8081 3.62861 18.3908 3.75696C20.1881 3.90272 21.6118 5.29278 21.7741 7.09773C21.8909 8.3969 22 10.11405 22 11.998C22 13.88205 21.8909 15.5992 21.7741 16.8984C21.6118 18.7033 20.1881 20.09335 18.3908 20.23915C16.8081 20.3675 14.5677 20.498 12 20.498C9.43258 20.498 7.19232 20.3675 5.60965 20.2392C3.81206 20.0934 2.38831 18.70295 2.22603 16.8979C2.10918 15.5982 2 13.8808 2 11.998C2 10.1153 2.10918 8.39787 2.22603 7.09823C2.38831 5.29312 3.81206 3.90269 5.60965 3.75693z"
                      fill="currentColor"></path>
                    <path
                      d="M15.875 10.75L9.875 10.75C9.46079 10.75 9.125 10.4142 9.125 10C9.125 9.58579 9.46079 9.25 9.875 9.25L15.875 9.25C16.2892 9.25 16.625 9.58579 16.625 10C16.625 10.4142 16.2892 10.75 15.875 10.75z"
                      fill="currentColor"></path>
                    <path
                      d="M17.375 14.75L11.375 14.75C10.9608 14.75 10.625 14.4142 10.625 14C10.625 13.5858 10.9608 13.25 11.375 13.25L17.375 13.25C17.7892 13.25 18.125 13.5858 18.125 14C18.125 14.4142 17.7892 14.75 17.375 14.75z"
                      fill="currentColor"></path>
                    <path
                      d="M7.875 10C7.875 10.4142 7.53921 10.75 7.125 10.75L6.625 10.75C6.21079 10.75 5.875 10.4142 5.875 10C5.875 9.58579 6.21079 9.25 6.625 9.25L7.125 9.25C7.53921 9.25 7.875 9.58579 7.875 10z"
                      fill="currentColor"></path>
                    <path
                      d="M9.375 14C9.375 14.4142 9.03921 14.75 8.625 14.75L8.125 14.75C7.71079 14.75 7.375 14.4142 7.375 14C7.375 13.5858 7.71079 13.25 8.125 13.25L8.625 13.25C9.03921 13.25 9.375 13.5858 9.375 14z"
                      fill="currentColor"></path>
                    <!--]--></svg
                  ><span class="bili-video-card__stats--text">${danmaku}</span></span
                >
              </div>
              <span class="bili-video-card__stats__duration">${duration}</span>
            </div>
          </div>
          <div
            style="display: none"
            class="bili-video-card__progress"></div></div
      ></a>
      <div
        style=""
        class="bili-video-card__info __scale-disable">
        <!--[--><!----><!--]-->
        <div class="bili-video-card__info--right">
          <!--[-->
          <div
            class="bili-video-card__info--no-interest"
            style="display: none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              class="bili-video-card__info--no-interest--icon"
              fill="currentColor">
              <!--[-->
              <path
                d="M13.62335 5.49835C13.62335 6.3949 12.8966 7.12171 12 7.12171C11.10345 7.12171 10.37665 6.3949 10.37665 5.49835C10.37665 4.6018 11.10345 3.875 12 3.875C12.8966 3.875 13.62335 4.6018 13.62335 5.49835zM13.62345 18.4985C13.62345 19.3951 12.8966 20.12195 12 20.12195C11.10335 20.12195 10.3765 19.3951 10.3765 18.4985C10.3765 17.60185 11.10335 16.875 12 16.875C12.8966 16.875 13.62345 17.60185 13.62345 18.4985zM12 13.62485C12.89745 13.62485 13.62495 12.89735 13.62495 11.99995C13.62495 11.1025 12.89745 10.375 12 10.375C11.10255 10.375 10.37505 11.1025 10.37505 11.99995C10.37505 12.89735 11.10255 13.62485 12 13.62485z"
                fill="currentColor"></path>
              <!--]-->
            </svg>
          </div>
          <!----><!--]-->
          <h3
            class="bili-video-card__info--tit"
            title="${'学习、学习、还是学习！'}">
            <a
              href="${arcurl}"
              target="_blank"
              data-spmid="333.1007"
              data-mod="tianma.2-1-3"
              data-idx="click">${title}</a>
          </h3>
          <div class="bili-video-card__info--bottom">
            <!--[--><a
              class="bili-video-card__info--owner"
              href="//space.bilibili.com/${mid}"
              target="_blank"
              data-spmid="333.1007"
              data-mod="tianma.2-1-3"
              data-idx="click"
              ><!----><span
                class="bili-video-card__info--author"
                title="${author}"
                >${author}</span
              ><span class="bili-video-card__info--date">· ${
                new Date(pubdate * 1000).getMonth() + 1 + '.' + new Date(pubdate * 1000).getDay()
              }</span></a
            ><!--]-->
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
    `
    const node = parser.parseFromString(cardHtml, 'text/html').body.firstChild
    // node.querySelector('.bili-video-card__info--tit a').innerHTML = title
    return node
  } // 返回一个填充好数据的视频卡片

  async function WantIWhatCreateCard(_page = 1, _keyword = 'vue') {
    return new Promise(async (resolve) => {
      page = _page
      keyword = _keyword
      await actualPushCustomChildren()
      resolve(true)
    })
  } //生成数据

  async function actualPushCustomChildren() {
    const response = await sendGetCardDataRequest()
    if (!response.data.result) {
      return
    }
    const result = response.data.result[11]
    pushCustomChildren(result)
  }

  function pushCustomChildren(result) {
    addCardinAllCardDom()

    // 这里面用到了result
    function addCardinAllCardDom() {
      const data = result.data
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (item.release_status !== 0) {
          continue
        }

        allCardData.push(item)
      }
    }
  }

  function sendGetCardDataRequest() {
    // 一个耗时操作，需要设置缓存
    return new Promise(async (resolve, reject) => {
      const params = {}
      const originQuery = {
        __refresh__: true,
        _extra: '',
        context: '',
        // 全局变量
        page,
        page_size: 42,
        order: '',
        duration: '',
        from_source: '',
        from_spmid: 333.337,
        platform: 'pc',
        highlight: 1,
        single_column: 0,
        keyword,
        qu_id: 'Q19CuQMsYh7C4N31px8aVfO7xtSBWEGS',
        ad_resource: '5646',
        source_tag: 3,
        web_location: 1430654,
      }
      // w_rid是根据传入的参数和时间戳动态生成的
      // w_rid=52c5174af1034c1f5f6da1af639e4024&wts=${new Date().getTime()}
      let data = localStorage.getItem(`bilifuck_${keyword}${page}`, null)
      // let needGetNewCardData = isNeedReGetData()

      if (data) {
        resolve(JSON.parse(data))
        return
      }
      // finalQuery里面的w_rid会过期,但是已经获取到的缓存数据不会过期,所以这里不需要判断是否需要重新获取数据
      // 因为如果有新的关键词(keyword),会继续获取query,然后如果发现过期了,会再次获取一遍w_rid,然后缓存到本地
      const final_query = await getFinalQuery(originQuery)
      const url = `https://api.bilibili.com/x/web-interface/wbi/search/all/v2?${final_query}`
      console.log('获取card数据')
      const response = await GM.xmlHttpRequest({
        method: 'GET',
        url,
        headers: {
          'Host': 'api.bilibili.com',
          'Origin': 'https://search.bilibili.com/',
          'Referer': 'https://search.bilibili.com/',
          'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': 'Windows',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
        },
        responseType: 'json',
      })
      data = JSON.parse(response.responseText)
      localStorage.setItem(`bilifuck_${keyword}${page}`, response.responseText)
      resolve(data)
    })
  }
  function isNeedReGetData() {
    let result = true
    const now = new Date().getTime()
    // -1表示首次使用
    const last_time = localStorage.getItem('bili_fuck_wbi_keys_time', -1)
    if (last_time) {
      const diff = now - last_time
      // 如果距离上次获取的间隔小于8小时,则不需要重新获取
      if (diff < needReGetDataDiffTime) {
        result = false
      }
    }
    return result
  }

  function createClassify() {
    // 主内容区最顶层的父元素
    const bili_feed4_layout = document.querySelector('.bili-feed4-layout')
    const classifyWrap = document.createElement('div')
    classifyWrap.classList.add('bili_fuck_classify_warp')
    classifies.forEach((classify) => {
      const classifyBtn = document.createElement('div')
      classifyBtn.classList.add('bili_fuck_classify_btn')
      if (classify.value === 'all') {
        // 首页分类按钮默认选中
        classifyBtn.classList.add('active')
      }
      // 绑定点击事件,改变分类
      classifyBtn.addEventListener('click', () => {
        changeActiveClassifyBtn(classifyBtn)
        if (classify.value === 'all') {
          createCardDomForAllCardDom(allCardData)
        } else {
          // 过滤出符合分类的元素
          const dom = filterCardDomByClassify(classify)
          createCardDomForAllCardDom(dom)
        }
      })
      classifyBtn.innerHTML = `
        <span>
        ${classify.text}
        </span>
      `
      classifyWrap.appendChild(classifyBtn)
    })

    bili_feed4_layout.insertBefore(classifyWrap, bili_feed4_layout.firstChild)
    function filterCardDomByClassify(classify) {
      let result = []
      result = allCardData.filter((item) => {
        let had
        if (Array.isArray(classify.value)) {
          for (let i = 0; i < classify.value.length; i++) {
            if (classify.exclude) {
              // 如果有需要排除的tag,那么优先判断是不是要排除
              for (let j = 0; j < classify.exclude.length; j++) {
                const excludeValue = classify.exclude[j]
                if (item.title.includes(excludeValue) || item.tag.includes(excludeValue)) {
                  return false
                }
              }
            }
            // 排除完了再判断有没有符合的
            const value = classify.value[i]
            if (item.title.includes(value) || item.tag.includes(value)) {
              return true
            }
          }
        } else {
          had = item.title.includes(classify.value) || item.tag.includes(classify)
        }
        return had
      })
      return result
    }
    function changeActiveClassifyBtn(dom) {
      const allClassifyBtn = document.querySelectorAll('.bili_fuck_classify_btn')
      allClassifyBtn.forEach((btn) => {
        if (btn.classList.contains('active')) {
          btn.classList.remove('active')
        }
      })
      dom.classList.add('active')
    }
  }

  // 一些基本的净化操作,删除多余的营销元素

  function hideShouldKill() {
    for (let key in shouldKillDom) {
      let element = shouldKillDom[key]
      if (!isElementExist(element)) {
        continue
      }
      if (!element.value) {
        continue
      }
      if (Array.isArray(element.value)) {
        for (let i = 0; i < element.value.length; i++) {
          const item = element.value[i]
          item.remove()
        }
      } else {
        element.value.remove()
      }
    }
  }
  function updateStyle() {
    for (let key in updateStyleDom) {
      let element = updateStyleDom[key]
      if (!isElementExist(element)) {
        continue
      }
      for (let styleKey in element.wantAddStyle) {
        if (!element.value) {
          return
        }
        element.value.style[styleKey] = element.wantAddStyle[styleKey]
      }
    }
  }
  function removeAllAD() {
    let rcmdCard = document.querySelectorAll('.bili-video-card.is-rcmd')
    rcmdCard.forEach((item) => {
      if (
        item.children.length === 1 &&
        !item.children[0].classList.contains('bili-video-card__skeleton')
      ) {
        if (item.parentNode.classList.contains('feed-card')) {
          item.parentNode.remove()
        } else {
          item.remove()
        }
      }
    })
  }

  async function replaceNavDom() {
    for (let key in needReplaceEntryDom) {
      const element = needReplaceEntryDom[key]
      if (!element.value) {
        continue
      }
      // element.value.removeEventListener('mouseenter')
      element.value.innerHTML = element.replace
      element.value.addEventListener('mouseenter', function () {
        element.value.innerHTML = element.replace
      })
    }
  } // 替换顶部导航栏多余的营销元素为学习、学习、学习！

  function addEventFromMaineedAddEventDom() {
    for (let key in needAddEventDom) {
      const element = needAddEventDom[key]
      if (!element.value) {
        continue
      }
      for (let event in element.events) {
        let fun = element.events[event]
        element.value.addEventListener(event, fun)
      }
    }
  }

  // tools

  function getDom(dom, count = 0) {
    // count 防止死循环 如果获取5次还获取不到说明有问题
    for (let key in dom) {
      const element = dom[key]
      const res = Array.from(document.querySelectorAll(element.select))
      if (res.length > 1) {
        // 如果获取了多个,说明想进行多选,把element.value设置为一个数组,在hideShouldKill的时候方便处理
        element.value = res
      } else {
        element.value = res[0]
      }
    }
  }

  function isElementExist(element) {
    return element.value
  }

  function waitMilliSeconds(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms * offset)
    })
  }

  // 得到编码后的请求参数
  // 传入的参数格式是这样的
  // const params = { foo: '114', bar: '514', baz: 1919810 },
  async function getFinalQuery(originParams) {
    let final_query = ''
    const mixinKeyEncTab = [
      46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29,
      28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22,
      25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52,
    ]

    // 对 imgKey 和 subKey 进行字符顺序打乱编码
    const getMixinKey = (orig) =>
      mixinKeyEncTab
        .map((n) => orig[n])
        .join('')
        .slice(0, 32)

    // 为请求参数进行 wbi 签名
    function encWbi(params, img_key, sub_key) {
      const mixin_key = getMixinKey(img_key + sub_key),
        curr_time = Math.round(Date.now() / 1000),
        chr_filter = /[!'()*]/g

      Object.assign(params, { wts: curr_time }) // 添加 wts 字段
      // 按照 key 重排参数
      const query = Object.keys(params)
        .sort()
        .map((key) => {
          // 过滤 value 中的 "!'()*" 字符
          const value = params[key].toString().replace(chr_filter, '')
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        })
        .join('&')

      const wbi_sign = md5(query + mixin_key) // 计算 w_rid

      return query + '&w_rid=' + wbi_sign
    }
    // 获取最新的 img_key 和 sub_key
    // 一个耗时操作
    async function getWbiKeys(SESSDATA) {
      return new Promise(async (resolve, reject) => {
        let needGetNewKeys = isNeedReGetData()
        const res = localStorage.getItem('bili_fuck_wbi_keys', null)
        if (res && !needGetNewKeys) {
          // 能获取到res的缓存并且没有过期,则直接返回缓存的res
          resolve(JSON.parse(res))
        } else {
          // 如果res获取不到或者超出了有效期,则重新获取
          console.log('获取wbi_keys')
          GM.xmlHttpRequest({
            method: 'GET',
            url: 'https://api.bilibili.com/x/web-interface/nav',
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
              'Referer': 'https://www.bilibili.com/',
              // 'Cookie': `SESSDATA=${SESSDATA}`,
            },
            onload: function (response) {
              if (response.status === 200) {
                const data = JSON.parse(response.responseText)

                const {
                  data: {
                    wbi_img: { img_url, sub_url },
                  },
                } = data
                const img_sub_obj = {
                  img_key: img_url.slice(img_url.lastIndexOf('/') + 1, img_url.lastIndexOf('.')),
                  sub_key: sub_url.slice(sub_url.lastIndexOf('/') + 1, sub_url.lastIndexOf('.')),
                }
                localStorage.setItem('bili_fuck_wbi_keys', JSON.stringify(img_sub_obj))
                localStorage.setItem('bili_fuck_wbi_keys_time', new Date().getTime())
                resolve(img_sub_obj)
              } else {
                reject(new Error('Network response was not ok ' + response.statusText))
              }
            },
            onerror: function (error) {
              reject(error)
            },
          })
        }
      })
    }

    async function main() {
      try {
        const web_keys = await getWbiKeys('SESSDATA的值')
        const img_key = web_keys.img_key,
          sub_key = web_keys.sub_key
        const final_query = encWbi(originParams, img_key, sub_key)
        return final_query
      } catch (error) {
        console.error('Main error: ', error)
      }
    }
    final_query = await main()
    return final_query
  }

  // 观察者测试,但是貌似用不到
  function moTest() {
    let targetNode = document.querySelector('.left-entry') // 假设你要监听的元素的类名是 .left-entry

    let config = { childList: true, subtree: true }

    let callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
        }
      }
    }

    let observer = new MutationObserver(callback)

    observer.observe(targetNode, config)
  }
})()
