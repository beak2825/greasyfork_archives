// ==UserScript==
// @name         流水线hack
// @namespace    流水线hack
// @version      1.0.4
// @description  查询华为云流水线列表，一键升级部署应用
// @author       fbz
// @include       *://*.rs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rs.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521751/%E6%B5%81%E6%B0%B4%E7%BA%BFhack.user.js
// @updateURL https://update.greasyfork.org/scripts/521751/%E6%B5%81%E6%B0%B4%E7%BA%BFhack.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
;(function () {
  /**
   * 获取对象的嵌套属性值
   * @param {Object} obj - 目标对象
   * @param {string} path - 属性路径，使用点号分隔，如 'a.b.c'
   * @returns {*} 嵌套属性的值，若不存在则返回 undefined
   */
  function getNestedProperty(obj, path) {
    return path
      .split('.')
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
        obj
      )
  }

  var css = `
  #add_ngList_btn {
    position: fixed;
    bottom: 2rem;
    left: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.5);
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 100000;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 14px;
  }

  #add_ngList_btn:hover span {
    color: #409eff;
  }

  .my-dialog__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.3);
    display: none;
  }

  .my-dialog {
    position: relative;
    background: #FFFFFF;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
    box-sizing: border-box;
    width: 50%;
    transform: none;
    left: 0;
    margin: 0 auto;
  }

  .my-dialog .my-dialog__header {
    border-bottom: 1px solid #e4e4e4;
    padding: 14px 16px 10px 16px;
  }

  .my-dialog__title {
    line-height: 24px;
    font-size: 18px;
    color: #303133;
  }

  .my-dialog__headerbtn {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 0;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    font-size: 16px;
    width: 12px;
    height: 12px;
    transform: rotateZ(45deg);
  }

  .my-dialog .my-dialog__header .my-dialog__headerbtn {
    right: 16px;
    top: 16px;
  }

  .my-dialog__headerbtn .my-dialog__close::before {
    content: '';
    position: absolute;
    width: 12px;
    height: 1.5px;
    background: #909399;
    top: calc(50% - 0.75px);
    left: calc(50% - 6px);
    border-radius: 2px;
  }

  .my-dialog__headerbtn:hover .my-dialog__close::before {
    background: #1890ff;
  }

  .my-dialog__headerbtn .my-dialog__close::after {
    content: '';
    position: absolute;
    height: 12px;
    width: 1.5px;
    background: #909399;
    top: calc(50% - 6px);
    left: calc(50% - 0.75px);
    border-radius: 2px;
  }

  .my-dialog__headerbtn:hover .my-dialog__close::after {
    background: #1890ff;
  }

  .my-dialog__body {
    padding: 30px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }

  .my-dialog__footer {
    padding: 20px;
    padding-top: 10px;
    text-align: right;
    box-sizing: border-box;
  }

  .my-dialog .my-dialog__footer {
    padding: 0px 16px 24px 16px;
    margin-top: 40px;
  }

  #pipeline-container {
    max-height: 480px;
    overflow-y: auto;
  }

  .close-icon {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    transform: rotateZ(45deg);
    margin-left: 8px;
    cursor: pointer;
  }

  .close-icon:hover {
    background: #409eff;
  }

  .close-icon::before {
    content: '';
    position: absolute;
    width: 8px;
    height: 2px;
    background: #409eff;
    top: calc(50% - 1px);
    left: calc(50% - 4px);
    border-radius: 2px;
  }

  .close-icon:hover::before {
    background: #fff;
  }

  .close-icon::after {
    content: '';
    position: absolute;
    height: 8px;
    width: 2px;
    background: #409eff;
    top: calc(50% - 4px);
    left: calc(50% - 1px);
    border-radius: 2px;
  }

  .close-icon:hover::after {
    background: #fff;
  }

  .pipeline_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    font-size: 16px;
    margin-bottom: 16px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  .pipeline_item_title {
    font-size: 16px;
  }

  .pipeline_item_des {
    font-size: 12px;
  }


  .input_container {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .el-input {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%;
  }

  .el-input__inner {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: none;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;
    cursor: pointer;
    font-family: inherit;
  }

  .el-button {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #DCDFE6;
    color: #606266;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    transition: .1s;
    font-weight: 500;
    padding: 9px 15px;
    font-size: 14px;
    border-radius: 3px;
  }

  .el-button:focus,
  .el-button:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }

  .el-button:active {
    color: #3a8ee6;
    border-color: #3a8ee6;
    outline: none;
  }

  .disable-btn {
    pointer-events: none;
    cursor: not-allowed;
  }

  .input_container .el-input {
    margin-right: 12px;
  }

  .tips {
    margin-top: 24px;
    font-size: 12px;
    color: #F56C6C;
  }

  #tabs-container {
    display: flex;
    align-items: center;
    justify-content: start;
    margin-bottom: 12px;
  }
  
  #tabs-container .tab-item {
    margin-right: 12px;
    cursor: pointer;
  }
  #tabs-container .tab-item.active {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }

  #search-input {
    width: 98%;
    margin-bottom: 8px;
  }
`
  /*添加样式*/
  function addStyle(css) {
    if (!css) return
    var head = document.querySelector('head')
    var style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = css
    head.appendChild(style)
  }

  /*dialog模板*/
  var dialog_temp = `
  <div class="my-dialog" style="margin-top: 15vh; width: 40%;">
    <div class="my-dialog__header">
      <span class="my-dialog__title">流水线列表</span>
      <button type="button" aria-label="Close" class="my-dialog__headerbtn">
        <i class="my-dialog__close"></i>
      </button>
    </div>
    <div class="my-dialog__body">
      <div id="tabs-container"></div>
      <input type="text" id="search-input" placeholder="输入关键字">
      <div id="pipeline-container"></div>
    </div>
    <!-- <div class="my-dialog__footer"></div> -->
  </div>
`

  /*生成按钮*/
  function createFixedBtn() {
    var btn = document.createElement('div')
    btn.title = '流水线列表'
    var span = document.createElement('span')
    span.innerText = '流水线'
    btn.appendChild(span)
    btn.id = 'add_ngList_btn'
    document.body.appendChild(btn)

    /*初始化事件*/
    // 点击按钮展示弹窗
    btn.addEventListener('click', function () {
      if (window.location.pathname === '/mologinagentwebsite/loginView.html') {
        alert('请先登录')
        return
      }
      model.dialogVisible = true
      pollPipelineStatus()
    })
  }

  /* 初始化dialog */
  function initDialog() {
    var wrapper = document.createElement('div')
    wrapper.classList.add('my-dialog__wrapper')
    wrapper.innerHTML = dialog_temp
    document.body.appendChild(wrapper)

    /*初始化事件*/
    document
      .querySelector('.my-dialog__headerbtn')
      .addEventListener('click', function () {
        // 关闭按钮点击事件
        model.dialogVisible = false
      })

    document
      .querySelector('#search-input')
      .addEventListener('input', function (e) {
        model.searchValue = e.target.value
      })
  }

  /* 显示dialog */
  function showDialog() {
    document.querySelector('.my-dialog__wrapper').style.display = 'initial'
  }

  /* 隐藏dialog */
  function hideDialog() {
    document.querySelector('.my-dialog__wrapper').style.display = ''
  }

  var model = {
    _dialogVisible: false, // 弹窗可见性
    _pipelines: [], // 定义一个私有变量 _pipelines 来存储流水线数据
    _searchValue: '', // 定义一个私有变量 _searchValue 来存储搜索值
    _polling: false, // 控制轮询状态的变量
    _activeName: '', // 当前tab名
    _tabs: [], // 从流水线中提取不同环境做tab切换
  }

  Object.defineProperty(model, 'dialogVisible', {
    // 简易双向绑定
    get: function () {
      return this._dialogVisible
    },
    set: function (value) {
      this._dialogVisible = value
      if (value) {
        showDialog()
      } else {
        model.polling = false // 停止轮询
        hideDialog()
      }
    },
  })

  Object.defineProperty(model, 'pipelines', {
    // 简易双向绑定
    get: function () {
      return this._pipelines
    },
    set: function (value) {
      this._pipelines = value || []

      setPipelinesToDom(this._pipelines) // 数据改变时刷新 dom
    },
  })

  Object.defineProperty(model, 'searchValue', {
    // 简易双向绑定
    get: function () {
      return this._searchValue
    },
    set: function (value) {
      this._searchValue = value

      setPipelinesToDom(this._pipelines) // 数据改变时刷新 dom
    },
  })

  Object.defineProperty(model, 'polling', {
    // 简易双向绑定
    get: function () {
      return this._polling
    },
    set: function (value) {
      this._polling = value
    },
  })

  Object.defineProperty(model, 'tabs', {
    // 简易双向绑定
    get: function () {
      return this._tabs
    },
    set: function (value) {
      this._tabs = value
      setTabsToDom(this._tabs)
    },
  })

  Object.defineProperty(model, 'activeName', {
    // 简易双向绑定
    get: function () {
      return this._activeName
    },
    set: function (value) {
      this._activeName = value

      setTabsToDom(this._tabs)
      setPipelinesToDom(this._pipelines)
    },
  })

  function setTabsToDom(list) {
    let nodeStr = ''
    for (var text of list) {
      const className = text === model.activeName ? 'active' : ''
      nodeStr += `<button type="button" class="el-button tab-item ${className}" data-tabname=${text}>${text}</button>`
    }
    const containerNode = document.querySelector('#tabs-container')
    if (containerNode) {
      containerNode.innerHTML = nodeStr

      var startBtnList = containerNode.querySelectorAll('.tab-item')
      for (var node of startBtnList) {
        node.addEventListener('click', function (el) {
          model.activeName = el.target.dataset.tabname
        })
      }
    }
  }

  function setPipelinesToDom(list) {
    const newList = list.filter(
      (item) =>
        item.description.includes(model.activeName) &&
        item.description.includes(model.searchValue)
    )
    var nodeStr = ''
    for (var [i, item] of newList.entries()) {
      var text = item.description
        ? `${item.name}(${item.description})`
        : `${item.name}`
      var triggerTime = item.lastTriggerAt
        ? `${new Date(item.lastTriggerAt).toLocaleDateString()} ${new Date(
            item.lastTriggerAt
          ).toLocaleTimeString()}`
        : '无'
      var status = getStatus(
        getNestedProperty(item, 'extendInfo.latestPipelineState.stageStates')
      )

      nodeStr += `<div class="pipeline_item">
        <div>
          <p class="pipeline_item_title">${text}</p>
          <p class="pipeline_item_des">最近一次执行时间：${triggerTime}</p>
          <p>状态：${status}</p>
      </div>
        ${getBtn(status, item.id)}
      </div>`
    }
    const containerNode = document.querySelector('#pipeline-container')
    if (containerNode) {
      containerNode.innerHTML = nodeStr
      const onStart = (node, id) => {
        node.innerText = '执行中'
        node.style.pointerEvents = 'none'
        var uri = `https://console.rs.com/servicestage/rest/cpepipeline/v2/pipelines/${id}/action?actionId=start`
        api({ url: uri, method: 'POST' })
          .then()
          .catch(() => {})
      }
      var startBtnList = containerNode.querySelectorAll('.operation-btn')
      for (var node of startBtnList) {
        node.addEventListener('click', function (el) {
          onStart(el.target, el.target.dataset.id)
        })
      }
    }
    function getStatus(stageStates) {
      // status： 1未构建 | 2构建完成 | 4构建中 | 其他 构建失败
      // 构建状态
      var step1_progress = stageStates[0].taskStates[0].progress
      var step1_status = stageStates[0].taskStates[0].status
      // 部署状态
      var step2_progress = stageStates[1].taskStates[0].progress
      var step2_status = stageStates[1].taskStates[0].status
      if (step1_status === 2 && step2_status === 2) {
        return '执行完成'
      }
      if (
        [step1_status, step2_status].every((status) => status === 1) &&
        [step1_progress, step2_progress].every((progress) => progress === 0)
      ) {
        return '未执行'
      }
      if (step1_status === 4 && step1_progress < 100) {
        return '构建中'
      }
      if (step2_status === 4 && step2_progress < 100) {
        return '部署中'
      }
      return '执行失败'
    }
    function getBtn(status, id) {
      let className = 'start-btn',
        innerText = '启动'
      if (status === '构建中' || status === '部署中') {
        className = 'disable-btn'
        innerText = '执行中'
      }

      return `<button type="button" class="el-button operation-btn ${className}" data-id=${id}>${innerText}</button>`
    }
  }

  window.addEventListener('load', function () {
    addStyle(css) // 添加样式
    createFixedBtn() // 生成按钮
    initDialog() // 初始化弹窗
  })

  function api({ url, method = 'GET' }) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language':
            'zh-CN,zh;q=0.9,ja;q=0.8,en-US;q=0.7,en;q=0.6,zh-TW;q=0.5,zh-HK;q=0.4',
          agencyid:
            cookieStorage.getItem('agencyID') ||
            '53d990589e06434db4cca086b70c7655',
          'cf2-cftk': '',
          cftk: cookieStorage.getItem('cftk'),
          'content-type': 'application/json; charset=UTF-8',
          projectname: 'rs-fj-1_ylz-%E5%85%A8%E5%9B%BD%E7%BB%9F%E7%AD%B9',
          region: 'rs-fj-1',
          'sec-ch-ua':
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'x-language': 'zh-cn',
          'x-requested-with': 'XMLHttpRequest',
          Referer:
            'https://console.rs.com/servicestage/?agencyId=b8b7e5a83afc41c082ebb4dd77d01b37&region=rs-fj-1_ylz-%E5%85%A8%E5%9B%BD%E7%BB%9F%E7%AD%B9&locale=zh-cn',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: null,
        method,
        credentials: 'same-origin', // 同源请求自动携带 Cookie
      })
        .then((response) => resolve(response.json()))
        .catch((error) => {
          alert(error)
          reject(error)
        })
    })
  }
  /**
   * 处理流水线数据，返回tabs，以及按环境拆分的流水线数据
   * @param {Object} list - 目标对象
   * @returns {*} 嵌套属性的值，若不存在则返回 undefined
   */
  function handlePipelines(list) {
    const getEnv = (str) => {
      return str.split('-')[0] // "测试环境" / "开发环境" / "生产环境"
    }
    const res = list.reduce((acc, cur) => {
      if (!acc.tabs) {
        acc.tabs = []
      }
      if (!acc.pipelines) {
        acc.pipelines = []
      }
      if (!!cur.description) {
        const tabName = getEnv(cur.description)
        if (!acc.tabs.some((name) => name === tabName)) {
          acc.tabs.push(tabName)
        }
        if (!acc.pipelines.some((o) => o.id === cur.id)) {
          acc.pipelines.push(cur)
        }
      }
      return acc
    }, {})

    return res
  }

  function isNeedSetTabs(list) {
    if (model.tabs.length === 0) return true
    return !list.every((item) => model.tabs.some((tab) => tab === item))
  }

  function pollPipelineStatus({
    apiUrl = 'https://console.rs.com/servicestage/rest/cpepipeline/v2/pipelines?filter-name=&status=',
    interval = 2000,
    maxAttempts = Infinity,
  } = {}) {
    if (!model.dialogVisible || model.polling) return // 避免重复轮询
    model.polling = true // 开启轮询标志

    var attempts = 0 // 记录轮询次数

    var poll = () => {
      if (!model.dialogVisible || attempts >= maxAttempts) {
        model.polling = false // 停止轮询
        return
      }
      attempts++

      api({ url: apiUrl })
        .then((data) => {
          console.log('流水线列表:', data)
          const { pipelines, tabs } = handlePipelines(data || [])
          if (!model.activeName) {
            model.activeName = tabs[0]
          }
          if (isNeedSetTabs(tabs)) {
            model.tabs = tabs
          }
          model.pipelines = pipelines
        })
        .catch((error) => {
          console.error('Error:', error)
        })
        .finally(() => {
          // 如果需要继续轮询
          if (model.dialogVisible) {
            setTimeout(poll, interval)
          } else {
            model.polling = false // 停止轮询
          }
        })
    }

    poll()
  }
})()
