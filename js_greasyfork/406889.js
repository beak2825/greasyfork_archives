// ==UserScript==
// @name         一键批量加载页面[EX绅士][exhentai]
// @namespace    exhentaigetallpage
// @version     0.7.5
// @description  一键批量加载所有后续页面内容
// @author       allence_frede
// @match     *://exhentai.org/tag/*
// @match     *://exhentai.org/*f_search*
// @match     *://exhentai.org/g/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @license    GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/406889/%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E5%8A%A0%E8%BD%BD%E9%A1%B5%E9%9D%A2%5BEX%E7%BB%85%E5%A3%AB%5D%5Bexhentai%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/406889/%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E5%8A%A0%E8%BD%BD%E9%A1%B5%E9%9D%A2%5BEX%E7%BB%85%E5%A3%AB%5D%5Bexhentai%5D.meta.js
// ==/UserScript==

class commonTools {
  data_type = Symbol('dataType')

  constructor() {
    this.#injectionPrototypeTool()
    Object.assign(this, this.#commonTools())
  }
  /**
   * 注入原型链工具函数
   */
  #injectionPrototypeTool() {
    let _this = this
    // 获取数据类型
    Object.prototype[this.data_type] = function () {
      return Object.prototype.toString.call(this).replace(/\[object (.*)\]/, '$1').toLocaleLowerCase()
    }
    // 网络请求函数
    String.prototype.webApi = async function () {
      return new Promise((resolve, reject) => {
        fetch(this)
          .then(res => res.text())
          .catch(error => reject(error))
          .then(res => resolve(res))
      })
    }
    // 字符串格式化为数字
    String.prototype.parseNum = function () {
      let new_num = this.replace(',', '')
      return new_num.includes('.') ? parseFloat(new_num) : parseInt(new_num)
    }
    // 字符串检查是否包含多个值
    String.prototype.includes_ee = function (check = '', mode = 'and') {
      if (Object[_this.data_type].call(check) == 'array') {
        if (mode == 'and') {
          return check.every(item => this.includes(item))
        } else if (mode == 'or') {
          return check.some(item => this.includes(item))
        } else {
          return false
        }
      } else {
        return this.includes(check)
      }
    }
    // 判断是否为json字符串
    String.prototype.isJson = function () {
      try {
        return Boolean(JSON.parse(this))
      } catch {
        return false
      }
    }
    // json字符串解析为对象
    String.prototype.toObject = function () {
      try {
        let json = JSON.parse(this)
        return Boolean(json) ? json : false
      } catch {
        return false
      }
    }
  }
  /**
   * 通用工具
   * @returns 工具对象
   */
  #commonTools() {
    let config_name = 'EXEE_CFG'
    // 获取配置
    function getCfg(name = '') {
      let cfg = window.localStorage.getItem(config_name)
      if (cfg && cfg.isJson()) {
        cfg = cfg.toObject()
      } else {
        return undefined
      }
      if (name) {
        return cfg[name]
      } else {
        return cfg
      }
    }
    // 保存设置
    function saveCfg(name, val = null) {
      if (Object[this.data_type].call(name) == 'object') {
        window.localStorage.setItem(config_name, JSON.stringify(name))
        return true
      }
      let cfg = getCfg()
      if (cfg) {
        cfg[name] = val
      } else {
        cfg = {
          [name]: val
        }
      }
      cfg = JSON.stringify(cfg)
      window.localStorage.setItem(config_name, cfg)
      return true
    }

    return {
      getCfg,
      saveCfg
    }
  }
}

class EXEE extends commonTools {
  #page_all = 0
  #page_loaded = 1
  #page_loading = false
  get #is_last_page() {
    return /prev=1$/.test(EXEE.#page_url) ||
      EXEE.#next_url == '' ||
      this.#page_loaded == this.#page_all
  }
  #page_style = {
    gallery: false,
    search_list: true,
  }
  #show_panel = false
  get #cfg() {
    let def_cfg = {
      load_pages_in_once: 20,
      page_use_new_layout: true,
      load_pages_at_first_open: false,
      hide_panel: false
    }
    // 读取本地配置
    let origin_cfg = this.getCfg()
    if (origin_cfg) {
      Object.assign(def_cfg, origin_cfg)
    }
    return def_cfg
  }
  set #cfg(val) {
    try {
      let cfg = this.#cfg
      for (const key in val) {
        cfg[key] = val[key]
      }
      this.saveCfg(cfg)
      return true
    } catch (err) {
      console.error('保存配置失败', err)
      return false
    }
  }
  #gallery_next_url = []
  #autoLoadPageBtnText = () => this.#cfg.load_pages_at_first_open ? '开启首次打开自动加载' : '关闭首次打开自动加载'
  #useNewLayoutBtnText = () => this.#cfg.page_use_new_layout ? '启用页面新样式' : '关闭页面新样式'
  static #page_url = window.location.href
  static #next_url = window.nexturl
  static #c_node = () => {
    let node = document.createElement('div')
    node.className = 'c'
    return node
  }
  /**
   * 构造函数
   */
  constructor() {
    super()
    this.#checkPageInit()
  }
  /**
   * 启动注入页面
   */
  injection() {
    this.#openInNewTab()
    if (this.#show_panel) {
      this.#injectionCss()
      this.#injectionPanel()
      if (this.#cfg.hide_panel) {
        this.#hidePanel()
      }
      this.#injectionNewLayout()
      if (this.#cfg.page_use_new_layout) {
        this.#useNewLayout(this.#cfg.page_use_new_layout)
      }
      this.#bindPanelmethod()
      // 自动读取后续页面
      if (this.#cfg.load_pages_at_first_open) {
        this.#pageLoadMore()
      }
    }
    if (this.#page_style.gallery) {
      //去除购买广告入口
      $('#spa').remove()
    }
  }
  /**
   * 读取后续页面的数据
   */
  async #pageLoadMore() {
    this.#page_loading = true
    let load_count = this.#cfg.load_pages_in_once
    let hit = undefined
    if (this.#page_style.search_list) {
      let nav_top = undefined
      let nav_buttom = undefined
      while (!this.#is_last_page && load_count > 0) {
        let res = await this.#getPage(EXEE.#next_url)
        if (res) {
          hit = res.match(/var nexturl="(?<target>.*?)";/s)
          if (hit?.groups?.target) {
            EXEE.#next_url = hit.groups.target
          } if (hit?.groups?.target.length == 0) {
            EXEE.#next_url = ''
          }
          window.res = res
          hit = res.match(/<div class="itg gld">(?<target>.*?)<\/div><div class="searchnav">/)
          if (hit?.groups?.target) {
            hit.groups.target = this.#openInNewTab(hit.groups.target)
            $('.itg.gld').append(hit.groups.target)
            this.#page_loaded++
            $('#egap .page-now').text(this.#page_loaded)
          }
          hit = res.match(/<div class="searchnav">(?<target>.*?)<\/div><div class="itg gld/s)
          if (hit?.groups?.target) nav_top = hit.groups.target
          hit = res.match(/<\/div><\/div><\/div><\/div><div class="searchnav">(?<target>.*?)<\/div>\n<div class="dp"/s)
          if (hit?.groups?.target) nav_buttom = hit.groups.target
          load_count--
        }
      }
      if (nav_top) $('.searchnav').eq(0).html(nav_top)
      if (nav_buttom) $('.searchnav').eq(1).html(nav_buttom)
    }
    if (this.#page_style.gallery) {
      let nav = undefined
      while (this.#gallery_next_url.length > 0 && load_count > 0) {
        let res = await this.#getPage(this.#gallery_next_url.shift())
        if (res) {
          hit = res.match(/<div id="gdt".+?>(?<target>.*?)<div class="gtb">/s)
          if (hit?.groups?.target) {
            hit.groups.target = this.#openInNewTab(hit.groups.target)
            $('#gdt').append(hit.groups.target)
            this.#page_loaded++
            $('#egap .page-now').text(this.#page_loaded)
          }
          hit = res.match(/<table class="ptt".*?>(?<target>.*?)<\/table>/s)
          if (hit?.groups?.target) {
            nav = hit.groups.target
          }
          load_count--
        }
      }
      if (nav) {
        $('.ptt').html(nav)
        $('.ptb').html(nav)
      }
    }
    this.#page_loading = false
  }
  /**
   * 使用新页面样式
   */
  #useNewLayout(use_layout = true) {
    if (use_layout) {
      if (this.#page_style.gallery) {
        $('#gdt .c').remove()
      }
      if (this.#page_style.search_list) {

      }
      $('#gdt').addClass('new-layout')
      $('.ido').addClass('new-layout')
      $('.gdtl').addClass('new-layout')
      $('.gld').addClass('new-layout')
    } else {
      if (this.#page_style.gallery) {
        $('#gdt').append(EXEE.#c_node)
      }
      $('#gdt').removeClass('new-layout')
      $('.ido').removeClass('new-layout')
      $('.gdtl').removeClass('new-layout')
      $('.gld').removeClass('new-layout')
    }
  }
  /**
   * 注入页面新样式
   */
  #injectionNewLayout() {
    let style = `
      <style type="text/css">
        #gdt.new-layout {
          max-width: none !important;
          display:  grid !important;
        }
        @media screen and (min-width:1080px) {
          .ido.new-layout {
            max-width: 100% !important;
          }
          .gdtl.new-layout {
            width: auto !important;
            max-width: 239px !important;
            min-width: 214px !important;
          }
          .gld.new-layout {
            display: grid;
            grid-template-columns:repeat(5,1fr)
          }
        }
        @supports(display: grid) {
          @media screen and (min-width:2171px) {
            .gld.new-layout {
              grid-template-columns:repeat(8,1fr) !important;
            }
            #gdt.new-layout {
              grid-template-columns:repeat(10,1fr) !important;
            }
          }
          @media screen and (min-width:1951px) and (max-width:2171px) {
            .gld.new-layout {
              grid-template-columns:repeat(7,1fr) !important;
            }
            #gdt.new-layout {
              grid-template-columns:repeat(9,1fr) !important;
            }
          }
          @media screen and (min-width:1740px) and (max-width:1951px) {
            .gld.new-layout {
              grid-template-columns:repeat(6,1fr) !important;
            }
            #gdt.new-layout {
              grid-template-columns:repeat(8,1fr) !important;
            }
          }
          @media screen and (min-width:1531px) and (max-width:1740px) {
            .gld.new-layout {
              grid-template-columns:repeat(5,1fr) !important;
            }
            #gdt.new-layout {
              grid-template-columns:repeat(7,1fr) !important;
            }
          }
          @media screen and (min-width:1360px) and (max-width:1531px) {
            .gld.new-layout {
              grid-template-columns:repeat(5,1fr) !important;
            }
            #gdt.new-layout {
              grid-template-columns:repeat(5,1fr) !important;
            }
          }
          @media screen and (min-width:1080px) and (max-width:1360px) {
            .gld.new-layout {
              grid-template-columns:repeat(4,1fr) !important;
            }
            #gdt.new-layout {
              grid-template-columns:repeat(5,1fr) !important;
            }
          }
          @media screen and (min-width:0px) and (max-width:1080px) {
            .gld.new-layout {
              grid-template-columns:repeat(4,1fr) !important;
            }
            #gdt.new-layout {
              grid-template-columns:repeat(4,1fr) !important;
            }
          }
        }
      </style>`
    style = $(style)
    $("body").append(style)
    style = undefined
  }
  /**
   * 注入面板样式
   */
  #injectionCss() {
    let css = `<style>
      #egap{
        position: fixed;
        top:10px;
        left:10px;
        z-index: 5000;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
        display: flex;
      }
      #egap #panel{
        opacity: 0.3;
      }
      #egap #panel.close{
        display: none;
      }
      #egap #panel:hover{
        opacity:1;
      }
      #egap .item{
        min-width:120px;
        height:30px;
        line-height:30px;
        color:#EEEEEE;
        background: #4f535b;
        border: 1px solid #000000;
        text-align: center;
        font-size:14px;
        cursor:pointer;
        box-sizing: border-box;
        padding: 0 6px;
        margin-top: 10px;
      }
      #egap .item.show-panel{
        min-width: min-content;
        width: 28px;
        height: 97px;
        line-height: 1.2;
        word-break: break-all;
        padding: 5px 0;
        margin: 0;
        display: block;
        opacity: 0.3;
      }
      #egap .item.show-panel:hover{
        opacity:1;
      }
      #egap .item.show-panel.close{
        display: none;
      }
      #egap #newLoadPagesInOnce{
        width: 120px;
      }
      #egap .cursor-clear{
        cursor: default !important;
      }
    </style>`
    $('body').prepend(css)
  }
  /**
   * 注入面板
   */
  #injectionPanel() {
    let page_info = '<span class="page-now">' + this.#page_loaded + '</span>'
    if (this.#page_style.gallery) {
      page_info += ' / ' + this.#page_all
    }
    let el = `<div id="egap">
      <div id="panel">
        <div class="item page-info cursor-clear">当前已加载
          ${page_info}
        </div>
        <div class="item" method="pageLoadMore">一键加载后续<span id="page-load">${this.#cfg.load_pages_in_once}</span>页</div>
        <div class="item" method="setLoadPagesInOnce">设置连续加载页数</div>
        <div class="item" method="setAutoLoadPageAtFirst">${this.#autoLoadPageBtnText()}</div>
        <div class="item" method="useNewLayout">${this.#useNewLayoutBtnText()}</div>
        <div class="item" method="pageViewSwitch">图墙列表倒序显示</div>
        <div class="item" method="goToTop">回到顶部</div>
        <div class="item" method="hidePanel">收起面板</div>
      </div>
      <div class="item show-panel close" method="showPanel">ex绅士增强</div>
    </div>`
    $('body').prepend(el)
  }
  /**
   * 隐藏面板
   */
  #hidePanel(save = true) {
    $('div[method="hidePanel"]').parent().addClass('close')
    $('div[method="hidePanel"]').parent().siblings('.show-panel').removeClass('close')
    if (save) {
      this.#cfg = { hide_panel: true }
    }
  }
  /**
   * 展示面板
   */
  #showPanel(save = true) {
    $('div[method="showPanel"]').addClass('close')
    $('div[method="showPanel"]').siblings('#panel').removeClass('close')
    if (save) {
      this.#cfg = { hide_panel: false }
    }
  }
  /**
   * 绑定面板按钮方法
   */
  #bindPanelmethod() {
    $('div[method="setAutoLoadPageAtFirst"]').off('click').on('click', () => {
      this.#cfg = { load_pages_at_first_open: !this.#cfg.load_pages_at_first_open }
      $('div[method="setAutoLoadPageAtFirst"]').text(this.#autoLoadPageBtnText())
    })
    $('div[method="pageLoadMore"]').off('click').on('click', async () => {
      if (this.#page_loading) return
      await this.#pageLoadMore()
    })
    $('div[method="goToTop"]').off('click').on('click', () => {
      $('html , body').animate({ scrollTop: 0 }, 'fast')
    })
    $('div[method="hidePanel"]').off('click').on('click', () => {
      this.#hidePanel()
    })
    $('div[method="showPanel"]').off('click').on('click', () => {
      this.#showPanel()
    })
    $('div[method="useNewLayout"]').off('click').on('click', () => {
      this.#cfg = { page_use_new_layout: !this.#cfg.page_use_new_layout }
      this.#useNewLayout(this.#cfg.page_use_new_layout)
      $('div[method="useNewLayout"]').text(this.#useNewLayoutBtnText())
    })
    $('div[method="pageViewSwitch"]').off('click').on('click', () => {
      if (this.#page_loading) {
        window.alert('加载后续中，暂不可操作')
      } else {
        if (this.#page_style.search_list) {
          let node_html = ''
          $('.itg.gld>.gl1t').toArray().reverse().forEach(item => {
            node_html += item.outerHTML
          })
          $('.itg.gld').html(node_html)
          node_html = undefined
        }
      }
    })
    $('div[method="setLoadPagesInOnce"]').off('click').on('click', () => {
      let page_count = window.prompt('请输入页数X(X>0)', this.#cfg.load_pages_in_once)
      if (page_count) {
        if (/^\d+$/.test(page_count)) {
          $('#page-load').text(page_count)
          this.#cfg = { load_pages_in_once: parseInt(page_count) }
        } else {
          window.alert('请输入有效数字')
        }
      }
    })
  }
  /**
   * 根据配置初始化页面
   */
  #checkPageInit() {
    if (EXEE.#page_url.includes_ee(['f_search=', '/tag/', '/g/'], 'or')) {
      this.#show_panel = true
    }
    if (EXEE.#page_url.includes_ee('/g/')) {
      this.#page_all = $('.ptb td').toArray().reverse()[1].innerText.parseNum()
      for (const k in this.#page_style) {
        this.#page_style[k] = Boolean(k == 'gallery')
      }
      if (EXEE.#page_url.includes_ee(['&p=', '?p='], 'or')) {
        let page_num = EXEE.#page_url.match(/p=(?<target>\d+)/)
        if (page_num?.groups?.target) {
          this.#page_loaded = page_num.groups.target.parseNum() + 1
        }
        for (let index = this.#page_loaded; index < this.#page_all; index++) {
          this.#gallery_next_url.push(EXEE.#page_url.replace(/p=(\d+)/, `p=${index}`))
        }
      }
      if (this.#page_all > 1 && !this.#gallery_next_url.length) {
        for (let index = this.#page_loaded; index < this.#page_all; index++) {
          this.#gallery_next_url.push(`${EXEE.#page_url}?p=${index}`)
        }
      }
    }
  }
  /**
   * 在新窗口打开结果/图片
   * @param string el 查询结果字符串
   */
  #openInNewTab(el = null) {
    if (el === null) {
      $('.gl1t a,.gdtl a,#gdt a').attr('target', '_blank')
      return true
    }

    el = el.replaceAll('<a', '<a target="_blank"')
    return el
  }
  // 远程请求
  async #getPage(url) {
    if (this.#is_last_page) return false
    try {
      return await url.webApi(url)
    } catch (error) {
      console.error(`${url}请求失败`)
      console.error('失败原因', error)
      return ''
    }
  }
}

let e = new EXEE()
// 挂载插件到页面
e.injection()