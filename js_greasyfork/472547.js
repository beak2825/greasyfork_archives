// ==UserScript==
// @name         thz-helper
// @description  thz论坛 98堂论坛
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @author       paso
// @match        http://96thz.cc/*
// @match        http://97thz.cc/*
// @match        http://98thz.cc/*
// @match        http://thzb.cc/*
// @match        http://thzv.cc/*
// @match        https://wpzo.app/*
// @match        *://www.example.net/*
// @require      https://greasyfork.org/scripts/473442-cross-origin-storage/code/cross-origin-storage.js?version=1237609
// @require      https://greasyfork.org/scripts/473443-popup-inject/code/popup-inject.js?version=1237616
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472547/thz-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/472547/thz-helper.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  // Your code here...
  // http://96thz.cc/forum.php?mod=forumdisplay&fid=181&filter=typeid&typeid=36&orderby=heats&page=2

  const namespace = 'paso-thz-helper'
  const middlewareHost = 'www.example.net'
  if (window.location.hostname === middlewareHost) {
    window.paso.crossOriginStorage.startStorageServer()
  } else {
    handleTarget(window.location.protocol + '//' + middlewareHost)
  }

  function handleTarget(server) {
    const CONTEXT = { env: 'prod' }
    const storage = window.paso.crossOriginStorage.createStorageClient(server)
    const querySearch = resolveQuerySearch()
    const instance = getInstance({ querySearch })
    if (!instance) {
      console.error('No instance matched!')
      return
    }
    const storageKey = `${namespace}-${instance.name}`

    const POPUP_INJECT_CONFIG = {
      namespace,
      actionName: 'Settings',
      collapse: '70%',
      location: '35%',
      content: `<div id="${namespace}-app"></div>`,
      style: `
  <style>
  .${namespace} * {
      font-size: 14px;
      color: black;
  }
  .${namespace} .table {
      display: table;
      border-collapse: separate;
      border-spacing: 4px 4px;
  }
  .${namespace} .table-row {
      display: table-row;
  }
  .${namespace} .table-cell {
      display: table-cell;
  }
  .${namespace} .text-right {
      text-align: right;
  }
  .${namespace} .flex.gap-8 {
      gap: 8px;
  }
  </style>`
    }

    const VUE_COMPONENT_PARAM_SELECT = {
      template: `
  <label class="table-row">
      <div class="table-cell text-right">{{title}}</div>
      <div class="table-cell">
          <div class="flex">
            <input class="input monospace" v-if="!hideInput" v-model.trim="inputValue" />
            <select class="input" v-if="!!options" v-model="inputValue">
                <option v-for="o in options" :value="o.value">{{o.label}}</option>
            </select>
          </div>
      </div>
  </label>`,
      props: ['title', 'value', 'options', 'hideInput'],
      emits: ['update:value'],
      computed: {
        inputValue: {
          get() {
            return this.$props.value
          },
          set(v) {
            this.$emit('update:value', v)
          }
        }
      }
    }

    const VUE_APP_CONFIG = {
      template: `
  <div class="flex col gap-8">
      <div class="table">
          <SelectFormItem title="执行时机" v-model:value="executeSelector" />
          <SelectFormItem title="path" v-model:value="path" />
          <SelectFormItem title="板块" v-model:value="params.fid" :options="forms.fidOptions" />
          <SelectFormItem title="筛选" v-model:value="params.filter" :options="forms.filterOptions" :hideInput="true" />
          <SelectFormItem title="系列" v-if="params.filter === 'typeid'" v-model:value="params.typeid" :options="forms.typeidOptions[params.fid]" />
          <SelectFormItem title="排序" v-model:value="params.orderby" :options="forms.orderbyOptions" :hideInput="true" />
          <SelectFormItem title="搜索" v-model:value="search" />
      </div>
      <button class="button" @click="apply">应用</button>
  </div>`,
      components: {
        SelectFormItem: VUE_COMPONENT_PARAM_SELECT
      },
      data() {
        return {
          ...instance.getDefaultData(),
          forms: Object.freeze(instance.getFormsData())
        }
      },
      computed: {},
      methods: {
        apply() {
          storage
            .setItem(storageKey, {
              executeSelector: this.executeSelector,
              path: this.path,
              params: {
                ...this.params
              },
              search: this.search
            })
            .then(() => (window.location = getPageLocation(this.path, this.params, querySearch.page || '1')))
        }
      },
      mounted() {
        storage
          .getItem(storageKey)
          .then((resp) => JSON.parse(resp.data || ''))
          .catch(() => instance.getDefaultData())
          .then((data) => {
            this.executeSelector = data.executeSelector
            this.path = data.path
            this.params.fid = data.params.fid
            this.params.filter = data.params.filter
            this.params.typeid = data.params.typeid
            this.params.orderby = data.params.orderby
            this.search = data.search
          })
      }
    }

    loadJS('https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/3.2.31/vue.global.prod.min.js')
      .then(() => window.paso.injectPopup(POPUP_INJECT_CONFIG))
      .then(() => window.Vue.createApp(VUE_APP_CONFIG).mount(`#${namespace}-app`))

    storage
      .getItem(storageKey)
      .then((resp) => JSON.parse(resp.data || ''))
      .catch(() => instance.getDefaultData())
      .then((data) =>
        ready(data.executeSelector)
          .then(() => handlePageContent(data))
          .catch((e) => {
            console.warn(e)
          })
      )

    function handlePageContent(data) {
      const pageMode = instance.getPageMode()
      // 隐藏广告
      instance.getNeedToHideElements(pageMode)?.forEach((el) => {
        el.setAttribute('style', 'display: none !important;')
      })

      switch (pageMode) {
        case 'forumdisplay':
          instance.handlePostList(data)
          break
        case 'viewthread':
          instance.handlePostContent()
          break
      }
    }

    if (CONTEXT.env === 'dev') {
      window._$_getCategory = function () {
        const arr = []
        document.querySelectorAll('.bm_c .fl_g dt a')?.forEach((a) => {
          const item = {}
          if (a.firstChild && a.firstChild instanceof Text) {
            item.label = a.firstChild.wholeText
          }
          if (a.href) {
            item.value = getStartInt(a.href)
          }
          arr.push(item)
        })
        console.log(arr)
        console.log(JSON.stringify(arr))
      }
      window._$_getTypes = function () {
        const arr = []
        document.querySelectorAll('ul#thread_types > li > a')?.forEach((a) => {
          const item = { value: '' }
          if (a.firstChild && a.firstChild instanceof Text) {
            item.label = a.firstChild.wholeText
          }
          if (a.href) {
            const i = a.href.indexOf('?')
            if (i >= 0) {
              const qs = resolveQuerySearch(a.href.substring(i))
              item.value = qs.typeid || ''
            }
          }
          arr.push(item)
        })
        if (!arr.length) arr.push({ value: '', label: '全部' })
        console.log(arr)
        console.log(JSON.stringify(arr))
      }
    }
  }

  function resolveQuerySearch(search) {
    const result = {}
    search = search || window.location.search
    if (search) {
      if (search.startsWith('?')) {
        search = search.substring(1)
      }
      search
        .split('&')
        .map((entry) => {
          return entry.split('=')
        })
        .forEach((entry) => {
          result[entry[0]] = entry[1]
        })
    }
    return result
  }

  function loadJS(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = resolve
      document.head.append(script)
    })
  }

  function ready(selector, interval = 300, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const loopId = setInterval(
        (startTime) => {
          if (document.querySelector(selector)) {
            clearInterval(loopId)
            resolve()
          } else {
            if (Date.now() - startTime > timeout) {
              clearInterval(loopId)
              reject(`look up for target '${selector}' timeout: ${timeout}ms`)
            }
          }
        },
        interval,
        Date.now()
      )
    })
  }

  function getStartInt(str) {
    let result = ''
    if (str) {
      for (let i = 0; i < str.length; i++) {
        if (isNaN(parseInt(str[i]))) {
          if (result) break
        } else {
          result += str[i]
        }
      }
    }
    return parseInt(result)
  }

  function getEndInt(str) {
    let result = ''
    if (str) {
      for (let i = str.length - 1; i >= 0; i--) {
        if (isNaN(parseInt(str[i]))) {
          if (result) break
        } else {
          result = str[i] + result
        }
      }
    }
    return parseInt(result)
  }

  function getPageLocation(path, p, num) {
    const params = {
      mod: 'forumdisplay',
      fid: p.fid || '',
      filter: p.filter || '',
      typeid: p.typeid || '',
      orderby: p.orderby || '',
      page: num
    }
    const paramStr =
      '?' +
      Object.entries(params)
        .map((entry) => {
          return `${entry[0]}=${entry[1]}`
        })
        .join('&')
    return path + paramStr
  }

  function getInstance(arg) {
    const { querySearch } = arg

    const getPageMode = () => {
      const path = window.location.pathname
      if (path === '/forum.php') return querySearch.mod || 'index'
      if (path.includes('forum')) return 'forumdisplay'
      if (path.includes('thread')) return 'viewthread'
      return 'index'
    }
    const handlePostList = (data) => {
      const { path, params, search } = data
      // 替换分页
      document.querySelectorAll('#fd_page_bottom > .pg, #fd_page_top > .pg')?.forEach((pw) => {
        const strong = pw.querySelector('strong')
        let currentPage = 1
        if (strong) {
          currentPage = getStartInt(strong.innerText)
        }
        pw.querySelectorAll('a[href]')?.forEach((page) => {
          const pageNum = getEndInt(page.innerText)
          if (isNaN(pageNum)) {
            if (page.classList.contains('prev')) {
              page.href = getPageLocation(path, params, currentPage - 1)
            } else if (page.classList.contains('nxt')) {
              page.href = getPageLocation(path, params, currentPage + 1)
            }
          } else {
            page.href = getPageLocation(path, params, pageNum)
          }
        })
        const pageInput = pw.querySelector('input[name=custompage]')
        if (pageInput) {
          pageInput.onkeydown = function (event) {
            if (event.keyCode === 13) {
              window.location = getPageLocation(path, params, this.value)
              window.doane?.(event)
            }
          }
        }
      })
      // 过滤结果
      const notMatch = []
      const match = (t) => {
        return t && t.indexOf && t.indexOf(search) >= 0
      }
      document.querySelectorAll('#threadlisttableid > tbody')?.forEach((item) => {
        if (!match(item.querySelector('a.s.xst')?.innerText)) {
          notMatch.push(item)
        }
      })
      const setFilter = (filter) => {
        notMatch.forEach((item) => {
          if (filter) {
            item.setAttribute('style', 'display: none !important;')
          } else {
            item.removeAttribute('style')
          }
        })
      }
      // 增加过滤按钮
      const tf = document.querySelector('#threadlist .tf')
      if (tf) {
        let filterCB = tf.querySelector(`label input.${namespace}`)
        if (!filterCB) {
          filterCB = document.createElement('input')
          filterCB.classList.add(namespace)
          filterCB.type = 'checkbox'
          const label = document.createElement('label')
          label.append(filterCB, document.createTextNode('只看搜索结果'))
          tf.append(document.createTextNode('\xA0'), label)
        }
        filterCB.checked = !!search
        if (search) setFilter(true)
        filterCB.onchange = (e) => setFilter(e.target.checked)
      }
    }
    const addHideFloorCheckbox = () => {
      // 添加隐藏楼层按钮
      const pt = document.querySelector('#pt')
      if (pt) {
        let hideCB = pt.querySelector(`label input.${namespace}`)
        if (!hideCB) {
          hideCB = document.createElement('input')
          hideCB.classList.add(namespace)
          hideCB.type = 'checkbox'
          const label = document.createElement('label')
          label.append(hideCB, document.createTextNode('隐藏其他楼层'))
          pt.append(document.createTextNode('\xA0'), label)
        }
        const otherReply = []
        document.querySelectorAll('#postlist > div[id]')?.forEach((div) => {
          otherReply.push(div)
        })
        if (otherReply.length) otherReply.shift()
        const hideOther = (h) => {
          otherReply.forEach((div) => {
            if (h) {
              div.setAttribute('style', 'display: none !important;')
            } else {
              div.removeAttribute('style')
            }
          })
        }
        hideCB.checked = true
        hideOther(true)
        hideCB.onchange = (e) => hideOther(e.target.checked)
      }
    }

    if (window.location.hostname.includes('thz')) {
      return {
        name: 'thz',
        getDefaultData() {
          return {
            executeSelector: '#discuz_tips',
            path: '/forum.php',
            params: {
              fid: '181',
              filter: 'typeid',
              typeid: '',
              orderby: 'heats'
            },
            search: ''
          }
        },
        getFormsData() {
          return {
            fidOptions: [
              { value: '181', label: '亚洲無碼原創' },
              { value: '220', label: '亚洲有碼原創' },
              { value: '182', label: '欧美無碼' },
              { value: '69', label: '国内原创(BT)' },
              { value: '203', label: '各类合集资源' },
              { value: '177', label: '蓝光高清原盘' },
              { value: '39', label: '日韩情色(BT)' },
              { value: '40', label: '西方美人(BT)' },
              { value: '60', label: '国产专栏（BT）' },
              { value: '58', label: '三级伦理（BT）' },
              { value: '41', label: '动漫精品（BT）' },
              { value: '63', label: '精美套图（BT)' },
              { value: '79', label: '桃花原創發片預告' },
              { value: '172', label: '桃花原創合集（BT）' },
              { value: '73', label: '三级*未分级(BT)' },
              { value: '137', label: '美圖寫真(BT)' },
              { value: '196', label: '热门电影(BT)' }
            ],
            filterOptions: [{ value: 'typeid', label: '系列' }],
            typeidOptions: {
              181: [
                { value: '', label: '全部' },
                { value: '664', label: 'FC2PPV' },
                { value: '33', label: '美女步兵' },
                { value: '35', label: '一本道系' },
                { value: '36', label: '加勒比系' },
                { value: '64', label: '1919go' },
                { value: '39', label: '10musu' },
                { value: '47', label: '性孽變態' },
                { value: '53', label: '素人系列' },
                { value: '37', label: '东京热系' },
                { value: '38', label: 'HEYZO' },
                { value: '116', label: 'MuraTV' },
                { value: '67', label: 'HeYPPV' },
                { value: '50', label: '仟人斬系' },
                { value: '51', label: '金髪天國' },
                { value: '52', label: '盜撮系列' },
                { value: '49', label: 'ガチん娘' },
                { value: '40', label: '人妻熟女' },
                { value: '319', label: 'pacoma' },
                { value: '195', label: '無毛宣言' },
                { value: '194', label: 'メス豚系' },
                { value: '226', label: 'RealDiva' },
                { value: '114', label: 'XXX-AV' },
                { value: '196', label: '誘惑天国' },
                { value: '198', label: '经典稀缺' },
                { value: '200', label: '問答無用' },
                { value: '44', label: 'JavHD' },
                { value: '321', label: 'h4610系' },
                { value: '322', label: '素人妻系' },
                { value: '320', label: '人妻斬系' },
                { value: '501', label: 'AV志向系' },
                { value: '616', label: '店長推薦' },
                { value: '731', label: '本生素人' },
                { value: '48', label: '3D影畫' },
                { value: '523', label: 'H:G:M:O' },
                { value: '222', label: '写真专辑' },
                { value: '768', label: '无码流出' },
                { value: '770', label: '麻豆传媒' }
              ],
              220: [
                { value: '', label: '全部' },
                { value: '91', label: '高清騎兵' },
                { value: '92', label: '美女騎兵' },
                { value: '109', label: '美素人系' },
                { value: '110', label: '剧情系列' },
                { value: '221', label: '无损原盘' }
              ],
              182: [
                { value: '', label: '全部' },
                { value: '41', label: 'x-Art' },
                { value: '42', label: 'Wow' },
                { value: '43', label: 'bangbros' },
                { value: '45', label: 'brazzers' },
                { value: '120', label: 'naughtyamerica' },
                { value: '122', label: 'babes' },
                { value: '46', label: 'realitykings' },
                { value: '115', label: 'DDF' },
                { value: '111', label: '按摩师系' },
                { value: '214', label: 'twistys' },
                { value: '121', label: 'nubilefilms' },
                { value: '197', label: 'hegre-art' },
                { value: '227', label: 'wicked' },
                { value: '150', label: 'BDSM' },
                { value: '216', label: '邪惡天使' },
                { value: '219', label: 'vixen' },
                { value: '220', label: 'passion-hd' },
                { value: '223', label: '18yoga' },
                { value: '224', label: 'private' },
                { value: '193', label: 'joymii' },
                { value: '201', label: '21members' },
                { value: '202', label: 'colette' },
                { value: '213', label: 'mofos' },
                { value: '215', label: 'nubiles' },
                { value: '217', label: 'blacked' },
                { value: '225', label: 'sexart' },
                { value: '199', label: 'Femjoy' },
                { value: '228', label: 'digitalplayground' },
                { value: '496', label: '18xgirls' },
                { value: '497', label: 'teamskeet' },
                { value: '498', label: 'sexyhub' },
                { value: '499', label: 'fakehub' },
                { value: '500', label: 'realitygang' },
                { value: '218', label: 'julesjordan' },
                { value: '513', label: 'TUSHY' },
                { value: '605', label: 'ANALIZED' },
                { value: '615', label: 'HARDX' },
                { value: '730', label: 'nubiles-porn' },
                { value: '732', label: 'lubed' },
                { value: '769', label: 'deeper' },
                { value: '87', label: 'SM变态' },
                { value: '88', label: '其它分类' },
                { value: '86', label: '肛交天堂' }
              ],
              69: [
                { value: '', label: '全部' },
                { value: '9', label: '国内无码' },
                { value: '10', label: '国内偷拍' },
                { value: '11', label: '主播探花' },
                { value: '65', label: '美女资源' },
                { value: '192', label: '国模私拍' }
              ],
              203: [
                { value: '', label: '全部' },
                { value: '55', label: '亚洲无码' },
                { value: '56', label: '亚洲有码' },
                { value: '57', label: '欧美情色' },
                { value: '63', label: '其他资源' }
              ],
              177: [
                { value: '', label: '全部' },
                { value: '27', label: '亚洲无码' },
                { value: '28', label: '亚洲有码' },
                { value: '29', label: '欧美情色' },
                { value: '30', label: '其他原盘' }
              ],
              39: [
                { value: '', label: '全部' },
                { value: '1', label: '无码' },
                { value: '2', label: '有码' }
              ],
              40: [{ value: '', label: '全部' }],
              60: [{ value: '', label: '全部' }],
              58: [{ value: '', label: '全部' }],
              41: [{ value: '', label: '全部' }],
              63: [{ value: '', label: '全部' }],
              79: [{ value: '', label: '全部' }],
              172: [
                { value: '', label: '全部' },
                { value: '18', label: '亚洲无码' },
                { value: '19', label: '亚洲有码' },
                { value: '20', label: '中文字幕' },
                { value: '21', label: '欧美情色' },
                { value: '22', label: '伦理电影' },
                { value: '23', label: '美女写真' },
                { value: '24', label: '成人动漫' }
              ],
              73: [{ value: '', label: '全部' }],
              137: [{ value: '', label: '全部' }],
              196: [{ value: '', label: '全部' }]
            },
            orderbyOptions: [
              { value: 'heats', label: '最热' },
              { value: 'lastpost', label: '最新' },
              { value: 'dateline', label: '时间' }
            ]
          }
        },
        getPageMode,
        getNeedToHideElements(pageMode) {
          const elements = []
          let selector =
            '.a_fl, .a_fr, .a_cn, #toptb + div[align=center], #diynavtop, #toptb, #hd, #ft, #f_pst, #newspecial'
          switch (pageMode) {
            case 'forumdisplay':
              selector += ', #autopbn, #newspecialtmp'
              break
            case 'viewthread':
              selector += ', #pgt, .pgt, .pgbtn, #hiddenpoststip, .pgs'
              break
            case 'index':
              selector += ', #autopbn, #ct > .mn > style + div, #ct > .mn > div + table'
              break
          }
          if (selector) {
            elements.push(...document.querySelectorAll(selector))
          }
          return elements
        },
        handlePostList,
        handlePostContent() {
          addHideFloorCheckbox()
        }
      }
    }
    if (window.location.hostname.includes('wpzo')) {
      return {
        name: '98t',
        getDefaultData() {
          return {
            executeSelector: '#scrolltop',
            path: '/forum.php',
            params: {
              fid: '36',
              filter: 'typeid',
              typeid: '',
              orderby: 'heats'
            },
            search: ''
          }
        },
        getFormsData() {
          return {
            fidOptions: [
              { label: '国产原创', value: 2 },
              { label: '亚洲无码原创', value: 36 },
              { label: '亚洲有码原创', value: 37 },
              { label: '高清中文字幕', value: 103 },
              { label: '三级写真', value: 107 },
              { label: 'VR视频区', value: 160 },
              { label: '素人有码系列', value: 104 },
              { label: '欧美无码', value: 38 },
              { label: '4K原版', value: 151 },
              { label: '韩国主播', value: 152 },
              { label: '动漫原创', value: 39 },
              { label: '国产自拍', value: 41 },
              { label: '中文字幕', value: 109 },
              { label: '日韩无码', value: 42 },
              { label: '日韩有码', value: 43 },
              { label: '欧美风情', value: 44 },
              { label: '卡通动漫', value: 45 },
              { label: '剧情三级', value: 46 },
              { label: '自提字幕区', value: 145 },
              { label: '自译字幕区', value: 146 },
              { label: '字幕分享区', value: 121 },
              { label: '新作区', value: 159 },
              { label: '原创自拍区', value: 155 },
              { label: '转贴自拍', value: 125 },
              { label: '华人街拍区', value: 50 },
              { label: '亚洲性爱', value: 48 },
              { label: '欧美性爱', value: 49 },
              { label: '卡通动漫', value: 117 },
              { label: '套图下载', value: 165 },
              { label: '综合讨论区', value: 95 },
              { label: 'AI专区', value: 166 },
              { label: '网友原创区', value: 141 },
              { label: '转帖交流区', value: 141 }
            ],
            filterOptions: [{ value: 'typeid', label: '系列' }],
            typeidOptions: {
              2: [
                { value: '', label: '全部' },
                { value: '684', label: '国产无码' },
                { value: '', label: '主播录制' },
                { value: '686', label: '360水滴' },
                { value: '687', label: '厕所偷拍' }
              ],
              36: [
                { value: '', label: '全部' },
                { value: '586', label: 'sm-miracle' },
                { value: '822', label: 'cospuri' },
                { value: '724', label: '盗窃系列' },
                { value: '723', label: 'japornxxx' },
                { value: '683', label: 'レズのしんぴ' },
                { value: '672', label: '无码破解' },
                { value: '671', label: '加勒比PPV' },
                { value: '660', label: '金髪天國' },
                { value: '654', label: '无码流出' },
                { value: '631', label: 'urabukkake' },
                { value: '619', label: 'handjobjapan' },
                { value: '618', label: 'spermmania' },
                { value: '591', label: 'fellatiojapan' },
                { value: '590', label: 'uralesbian' },
                { value: '589', label: 'legsjapan' },
                { value: '587', label: 'roselip-fetish' },
                { value: '368', label: 'FC2PPV' },
                { value: '583', label: '本生素人TV' },
                { value: '553', label: 'エッチな4610' },
                { value: '552', label: 'エッチな0930' },
                { value: '551', label: '人妻斬り' },
                { value: '537', label: 'xxx-av' },
                { value: '523', label: '熟女俱樂部' },
                { value: '449', label: '东京热' },
                { value: '379', label: '店長推薦' },
                { value: '375', label: 'heyppv' },
                { value: '374', label: 'pacoma' },
                { value: '373', label: '女体のしんぴ' },
                { value: '372', label: '10musu' },
                { value: '371', label: '一本道系' },
                { value: '370', label: '加勒比系' },
                { value: '369', label: 'HEYZO' }
              ],
              37: [{ value: '', label: '全部' }],
              103: [
                { value: '', label: '全部' },
                { value: '480', label: '有码高清' },
                { value: '481', label: '无码高清' }
              ],
              107: [
                { value: '', label: '全部' },
                { value: '629', label: '巴西三级' },
                { value: '628', label: '克罗地亚三级' },
                { value: '624', label: '德国三级' },
                { value: '623', label: '美国写真' },
                { value: '622', label: '俄罗斯三级' },
                { value: '621', label: '墨西哥三级' },
                { value: '620', label: '西班牙三级' },
                { value: '617', label: '国产写真' },
                { value: '616', label: '波兰三级' },
                { value: '615', label: '泰国四级' },
                { value: '614', label: '阿根廷三级' },
                { value: '613', label: '香港四级' },
                { value: '612', label: '瑞士四级' },
                { value: '611', label: '瑞士三级' },
                { value: '610', label: '挪威三级' },
                { value: '609', label: '台湾三级' },
                { value: '608', label: '荷兰三级' },
                { value: '607', label: '意大利三级' },
                { value: '606', label: '加拿大三级' },
                { value: '605', label: '法国四级' },
                { value: '604', label: '泰国三级' },
                { value: '603', label: '台湾四级' },
                { value: '602', label: '英国三级' },
                { value: '601', label: '英国四级' },
                { value: '600', label: '国产四级' },
                { value: '599', label: '美国四级' },
                { value: '598', label: '法国三级' },
                { value: '597', label: '国产三级' },
                { value: '596', label: '香港三级' },
                { value: '595', label: '美国三级' },
                { value: '594', label: '日本三级' },
                { value: '593', label: '韩国三级' },
                { value: '592', label: '日本写真' },
                { value: '625', label: '丹麦三级' },
                { value: '630', label: '意大利四级' },
                { value: '633', label: '德国四级' },
                { value: '634', label: '瑞典四级' },
                { value: '645', label: '丹麦四级' },
                { value: '646', label: '荷兰写真' },
                { value: '650', label: '比利时四级' },
                { value: '655', label: '澳大利亚三级' },
                { value: '656', label: '印度三级' },
                { value: '657', label: '菲律宾三级' },
                { value: '658', label: '新加坡写真' },
                { value: '659', label: '韩国写真' },
                { value: '667', label: '法国写真' },
                { value: '668', label: '英国写真' },
                { value: '669', label: '俄罗斯写真' },
                { value: '670', label: '智利三级' }
              ],
              160: [{ value: '', label: '全部' }],
              104: [
                { value: '', label: '全部' },
                { value: '533', label: 'G-area' },
                { value: '728', label: '300MIUM' },
                { value: '729', label: '332NAMA' },
                { value: '730', label: '326EVA' },
                { value: '731', label: '328HMDN' },
                { value: '807', label: '336KNB' },
                { value: '808', label: '200GANA' },
                { value: '809', label: '300MAAN' },
                { value: '810', label: '300NTK' },
                { value: '811', label: '390JAC' },
                { value: '812', label: '326SCP' },
                { value: '727', label: '259LUXU' },
                { value: '726', label: 'SIRO' },
                { value: '534', label: 'Mywife' },
                { value: '535', label: 'S-cute' },
                { value: '536', label: 'FC2' },
                { value: '557', label: 'himemix' },
                { value: '563', label: 'getchu' },
                { value: '588', label: 'siro-hame' },
                { value: '626', label: 'r-file' },
                { value: '627', label: 'giga-web' },
                { value: '632', label: 'knights-visual' },
                { value: '725', label: '230OREX' },
                { value: '813', label: '其他系列' }
              ],
              38: [{ value: '', label: '全部' }],
              151: [
                { value: '', label: '全部' },
                { value: '823', label: '无码' },
                { value: '824', label: '有码' }
              ],
              152: [{ value: '', label: '全部' }],
              39: [
                { value: '', label: '全部' },
                { value: '404', label: '无码' },
                { value: '405', label: '有码' }
              ],
              41: [{ value: '', label: '全部' }],
              109: [{ value: '', label: '全部' }],
              42: [{ value: '', label: '全部' }],
              43: [{ value: '', label: '全部' }],
              44: [{ value: '', label: '全部' }],
              45: [{ value: '', label: '全部' }],
              46: [{ value: '', label: '全部' }],
              145: [
                { value: '', label: '全部' },
                { value: '814', label: '有码字幕' },
                { value: '815', label: '无码字幕' }
              ],
              146: [
                { value: '', label: '全部' },
                { value: '845', label: '欧美' },
                { value: '846', label: '日本' }
              ],
              121: [
                { value: '', label: '全部' },
                { value: '664', label: '有码字幕' },
                { value: '665', label: '无码字幕' },
                { value: '848', label: '缺字需修正' }
              ],
              159: [
                { value: '', label: '全部' },
                { value: '849', label: '新作' }
              ],
              155: [
                { value: '', label: '全部' },
                { value: '820', label: '原创自拍' },
                { value: '821', label: '投稿送码' }
              ],
              125: [
                { value: '', label: '全部' },
                { value: '831', label: '性爱自拍' },
                { value: '832', label: '生活自拍' }
              ],
              50: [
                { value: '', label: '全部' },
                { value: '833', label: '原创街拍' },
                { value: '838', label: '转帖街拍' },
                { value: '834', label: '模拍' }
              ],
              48: [{ value: '', label: '全部' }],
              49: [{ value: '', label: '全部' }],
              117: [
                { value: '', label: '全部' },
                { value: '647', label: '日文' },
                { value: '648', label: '中文' },
                { value: '649', label: '韩文' },
                { value: '835', label: '3D' },
                { value: '836', label: '黑白' },
                { value: '837', label: '彩漫' }
              ],
              165: [{ value: '', label: '全部' }],
              95: [
                { value: '', label: '全部' },
                { value: '709', label: '困惑求助' },
                { value: '710', label: '技术交流' },
                { value: '711', label: '心情感悟' },
                { value: '712', label: 'AV新闻' },
                { value: '713', label: '图文故事' },
                { value: '714', label: '今日话题' },
                { value: '715', label: '不吐不快' },
                { value: '716', label: '情色分享' },
                { value: '843', label: '游客投稿' }
              ],
              166: [
                { value: '', label: '全部' },
                { value: '851', label: 'AI换脸' },
                { value: '852', label: 'AI破解' },
                { value: '853', label: 'AI增强' },
                { value: '854', label: 'AI作图' },
                { value: '855', label: '教程工具' }
              ],
              141: [
                { value: '', label: '全部' },
                { value: '688', label: '个人导航' },
                { value: '689', label: '国产合集' },
                { value: '690', label: '欧美合集' },
                { value: '691', label: '日本合集' },
                { value: '692', label: 'AI破解/换脸' },
                { value: '693', label: '动漫/二次元' },
                { value: '694', label: '蓝光原盘' },
                { value: '695', label: '套图系列' },
                { value: '696', label: '其他資源' },
                { value: '705', label: '自压/增强' },
                { value: '708', label: '版务管理' },
                { value: '844', label: '合集推荐' }
              ],
              142: [
                { value: '', label: '全部' },
                { value: '697', label: '国产自拍' },
                { value: '698', label: '直播视频' },
                { value: '699', label: '亚洲无码' },
                { value: '700', label: '亚洲有码' },
                { value: '701', label: '偷拍視頻' },
                { value: '702', label: '动漫/二次元' },
                { value: '703', label: '欧美风情' },
                { value: '704', label: '其他資源' },
                { value: '706', label: '合集资源' }
              ]
            },
            orderbyOptions: [
              { value: 'heats', label: '最热' },
              { value: 'lastpost', label: '最新' },
              { value: 'dateline', label: '时间' }
            ]
          }
        },
        getPageMode,
        getNeedToHideElements(pageMode) {
          const elements = []
          let selector = '.show-text, .show-text2, .show-text3, .show-text4, #toptb, #hd, #ft, #f_pst, #newspecial'
          switch (pageMode) {
            case 'forumdisplay':
              selector += ', #autopbn, #newspecialtmp'
              break
            case 'viewthread':
              selector += ', #pgt, .pgt, .pgbtn, #hiddenpoststip, .pgs'
              break
            case 'index':
              selector += ''
              break
          }
          if (selector) {
            elements.push(...document.querySelectorAll(selector))
          }
          return elements
        },
        handlePostList,
        handlePostContent() {
          addHideFloorCheckbox()
          // 收起评分
          const hideRate = document.querySelector('.rate a.op')
          if (hideRate && hideRate.innerText === '收起') {
            hideRate.dispatchEvent(new MouseEvent('click'))
          }
        }
      }
    }
  }
})()
