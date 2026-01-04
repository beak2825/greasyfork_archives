// ==UserScript==
// @name         下载用户B站收藏夹中的音频
// @namespace    crystal
// @version      1.0.0
// @description  通过脚本下载收藏夹里面的歌曲，实现免费听歌
// @author       奎里斯托
// @match        https://space.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467065/%E4%B8%8B%E8%BD%BD%E7%94%A8%E6%88%B7B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E4%B8%AD%E7%9A%84%E9%9F%B3%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/467065/%E4%B8%8B%E8%BD%BD%E7%94%A8%E6%88%B7B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E4%B8%AD%E7%9A%84%E9%9F%B3%E9%A2%91.meta.js
// ==/UserScript==
(function () {
  // 变量前面加gl(global)，表示当前变量是全局的
  let GL_popup = null
  let GL_favoriteList = []
  let GL_lateOnList = []
  // 获取收藏夹信息
  function getFavoriteList() {
    return new Promise((resolve, reject) => {
      try {
        ajax({
          url: 'https://api.bilibili.com/x/v3/fav/folder/list4navigate',
        }).then((res) => {
          const result = res
          const [myFavorite, lateOn] = result.data
          GL_favoriteList = myFavorite.mediaListResponse.list
          GL_lateOnList = lateOn.mediaListResponse.list
          resolve(GL_favoriteList)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
  let GL_tableData = []
  let GL_PageCount = 0
  // 根据收藏夹信息获取单个收藏夹的详细信息
  function getFavoriteDetail(searchParams) {
    return new Promise((resolve, reject) => {
      try {
        const defaultParam = {
          media_id: '',
          pn: 1,
          ps: 10,
          keyword: '',
          order: 'mtime',
          type: 0,
          tid: 0,
          platform: 'web',
        }
        const params = {
          ...defaultParam,
          ...searchParams
        }
        ajax({
          url: 'https://api.bilibili.com/x/v3/fav/resource/list',
          params: params
        }).then((res) => {
          const result = res
          const medias = result.data.medias
          GL_PageCount = result.data.info.media_count
          GL_tableData = medias
          GL_pagePsPn.sumPn = Math.ceil(GL_PageCount / GL_pagePsPn.ps)
          initPage(GL_pagePsPn.sumPn, GL_pagePsPn.pn)
          resolve(medias)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
  // 获取单个视频的详细信息
  function getVideoDetail(searchParams) {
    return new Promise((resolve, reject) => {
      const defaultParam = {
        bvid: '',
        cid: '',
        fnval: 4048
      }
      try {
        ajax({
          url: 'https://api.bilibili.com/x/player/playurl',
          params: {
            ...defaultParam,
            ...searchParams
          }
        }).then((res) => {
          const result = res
          const url = result.data.dash.audio[0].base_url
          resolve(url)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
  // 下载音频
  function downloadAudio(url, title) {
    return new Promise((resolve, reject) => {
      try {
        ajax({
          url: url,
          responseType: 'blob',
          credential: false
        }).then((res) => {
          const reader = new FileReader();
          reader.readAsDataURL(res);
          reader.onload = function (e) {
            const a = document.createElement('a');
            a.download = `${title}.mp3`
            a.href = e.target.result;
            document.documentElement.appendChild(a);
            a.click();
            a.remove();
            audioState = false;
            resolve(true)
          }
        })
      } catch (error) {
        reject(error)
      }
    })

  }
  // 基于promise和XMLHttpRequest封装ajax对象
  function ajax(options) {
    return new Promise((resolve, reject) => {
      // 存储的是默认值
      const defaults = {
        type: 'get',
        url: '',
        data: {},
        async: true,
        header: {
          'Content-Type': 'application/json'
        },
        responseType: 'json',
        credential: true,
        params: {},
      };
      // 使用options对象中的属性覆盖defaults对象中的属性
      Object.assign(defaults, options);
      // 先判断是否要拼接参数
      const params = defaults.params
      const paramsKey = Object.keys(params)
      if (paramsKey.length > 0) {
        const str = paramsKey.reduce((pre, cur) => {
          pre = pre + `&${cur}=${params[cur]}`
          return pre
        }, '?')
        defaults.url += str
      }
      const xhr = new XMLHttpRequest();
      // 设置该值就可以自动获取到登录后的权限
      if (defaults.credential) {
        xhr.withCredentials = true;
      }
      xhr.responseType = defaults.responseType
      xhr.open(defaults.type, defaults.url, defaults.async);
      if (defaults.type === 'post') {
        let contentType = defaults.header['Content-Type']
        xhr.setRequestHeader('Content-Type', contentType);
        if (contentType === 'application/json') {
          xhr.send(JSON.stringify(defaults.data))
        }
      } else {
        xhr.send()
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return
        const response = xhr.response;
        if (xhr.status == 200) {
          resolve(response)
        } else {
          reject(response)
        }
      }
    })
  }
  // 增加操作界面
  function addPanel() {
    const domPanel = `
        <div class="panel">
          <div id="menu" class="mediate hideMenu"></div>
          <div class="menu_list mediate">
            <div data-index="1"></div>
            <div data-index="2"></div>
            <div data-index="3"></div>
          </div>
        </div>
    `
    const bodyDOm = document.body
    const panelDiv = document.createElement('div')
    panelDiv.innerHTML = domPanel
    bodyDOm.appendChild(panelDiv)
    // 这里必须提前添加好，否则会出现第一次点击时菜单不正常出现的问题
    const menuListDom = document.querySelector('.menu_list')
    const menuListClass = menuListDom.classList
    menuListClass.add('hideMenu')
    const childrenDom = menuListDom.children
    Array.prototype.forEach.call(childrenDom, (ele, idx) => {
      setStyle(ele, { transform: 'translate(0, 0)', opacity: 0 })
    })
  }
  // 展开/隐藏菜单
  function switchMenu() {
    const menuListDom = document.querySelector('.menu_list')
    const menuListClass = menuListDom.classList
    const result = Array.prototype.includes.call(menuListClass, 'hideMenu')
    if (result) {
      // 执行展示
      menuListClass.remove('hideMenu')
      menuListClass.add('showMenu')
      const childrenDom = menuListDom.children
      const moveKeys = ['translate(0, -70px)', 'translate(0, -125px)', 'translate(0, -180px)']
      Array.prototype.forEach.call(childrenDom, (ele, idx) => {
        setStyle(ele, { transform: moveKeys[idx], opacity: 1 })
      })
    } else {
      menuListClass.remove('showMenu')
      menuListClass.add('hideMenu')
      const childrenDom = menuListDom.children
      Array.prototype.forEach.call(childrenDom, (ele) => {
        setStyle(ele, { transform: 'translate(0, 0)', opacity: 0 })
      })
    }
  }
  // 初始化
  function init() {
    addPanel()
    GL_popup = new Popup()
    const menuDom = document.getElementById('menu')
    menuDom.addEventListener('click', switchMenu);

    const menuListDom = document.querySelector('.menu_list')
    menuListDom.addEventListener('click', function (e) {
      const index = e.target.dataset.index
      if (index === '3') {
        showFavoritePage()
      } else {
        alert('更多功能，尽情期待！！！！！！！！！！！！！！')
      }
    })
    addComplexCss()
  }
  // 为了防止样式被重复添加，这里对于复杂的样式提前
  function addComplexCss() {
    //分页器的样式
    const paginationCss = `
      .pagination {
        display: flex;
        height: 35px;
        margin: 0 auto;
        position: absolute;
        right: 0;
        margin-bottom: 4px
      }

      .pagination span a {
        box-sizing: border-box;
        text-decoration: none;
        color: black;
      }

      .pagination span {
        text-align: center;
        width: 40px;
        height: 35px;
        line-height: 35px;
        margin: 0px 2px;
      }

      .pagination span i {
        font-size: 10px;
        font-weight: 100;
      }

      .pagination span img {
        object-fit: cover;
        height: 100%;
      }

      .pagination .pageStyle a {
        display: block;
        text-align: center;
        width: 40px;
        height: 35px;
        line-height: 35px;
        /* background-color: bisque; */
        border: 1px solid #ccc;
        border-radius: 5px;
      }

      .pagination .pageStyle a:hover {
        border: 1px solid rgb(27, 129, 121);
      }

      .pagination .active {
        background-color: rgba(251, 114, 153);
        color:#fff;
      }
    `
    // 表格样式
    const tableCss = `
    .favorite_detail table{
      width:100%;
      border: 1px solid #000;
      border: 1px solid;
    }
    .favorite_detail table thead tr{
      background-color: rgba(251, 114, 153);
      color:#fff;
    }
    .favorite_detail table thead tr th {
      border-bottom: 0 !important;
    }
    .favorite_detail table tbody tr:nth-child(2n){
      background-color: rgba(251, 114, 153,0.5);
    }
    .favorite_detail table tbody tr:nth-child(2n+1){
      background-color: #fff;
    }
    .favorite_detail table tr, th, td {
      text-align: center;
    }
    .favorite_detail table tr td{
      padding: 1px 1px;
      line-height: 1rem;
    }
    .favorite_detail table tr td input{
      width:95%;
      line-height: 1rem;
    }
    `
    // 操作面板的样式
    const panelCss = `
    .panel {
      position: fixed;
      top: 70%;
      left: 30px;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      box-sizing: border-box;
    }

    .mediate {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    #menu {
      width: 50px;
      height: 50px;
      border-radius: 10%;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: rgba(251, 114, 153);
      background-image: url(data:image/png;base64,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);
      position: relative;
      z-index: 10;
    }
    .menu_list {
      width: 50px;
      height: 50px;
      z-index: 9;
      display: flex;
      justify-content: center;
    }

    .menu_list div {
      width: 42px;
      height: 42px;
      border-radius: 10%;
      position: absolute;
      background-color: rgba(251, 114, 153);
      background-size: cover;
      background-repeat: no-repeat;
      opacity: 0;
      transition: all 0.4s ease-in-out;
    }

    .menu_list div:nth-child(1) {
      transform: translate(0, 0);
      background-image: url(data:image/png;base64,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);
    }

    .menu_list div:nth-child(2) {
      transform: translate(0, 0);
      background-image: url(data:image/png;base64,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);
    }

    .menu_list div:nth-child(3) {
      transform: translate(0, 0);
      background-image: url(data:image/png;base64,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);
    }
    `
    const strCss = paginationCss + tableCss + panelCss
    addStyle(strCss)
  }
  // 展示收藏夹弹窗
  function showFavoritePage() {
    const cssContent = `
      .favorite_header{
        min-height: 100px;
      }
      .favorite_btn{
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .favorite_content{
        display: flex;
        justify-content: center;
        width: 100%;
        max-height:75vh;
        margin-top:4px;
      }
      .favorite_list{
        flex: 1 1 22%;
        overflow-y:auto;
        min-height:400px;
      }
      .favorite_list div{
        color: white;
        background-color: rgba(251, 114, 153);
        border: 1px solid rgb(219, 66, 110);
        margin: 5px 0;
        padding: 2px 4px;
      }
      .favorite_list div:hover{
        background-color: #fff;
        color: rgba(251, 114, 153);
      }
      .favorite_detail{
        flex: 1 1 78%;
        padding: 5px;
        overflow-y:auto;
        position: relative;
      }
      .table_box{
        max-height: 50vh;
        overflow-y: auto;
      }
      .btn {
        background-color: rgba(251, 114, 153);
        border: 2px solid rgb(219, 66, 110);
        border-radius: 6px; 
        color: white;
        padding: 2px 8px;
        text-align: center;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        transition-duration: 0.4s;
        cursor: pointer;
        text-decoration: none;
        text-transform: uppercase;
        user-select: none;
      }
      /* 悬停样式 */
      .btn:hover {
        background-color: #fff;
        color: rgba(251, 114, 153);
      }
    `
    const domContent = `
        <div class="container">
        <div class="favorite_header">
          <div class="favorite_hint">
            <p>1.请先选择你要查询的收藏夹，并点击查询。之后才能点击下载，下载当前表格展示的歌曲</p>
            <p>2.默认情况下，文件名的格式为“视频名称.mp3”，你可以填入在文件名称一列输入当前自定义的文件名</p>
            <p>3.默认情况下，点击下载将下载当页全部的格式。倘若在表格进行了勾选，那么只会下载勾选的歌曲</p>
            <p>4.为了保证下载的稳定性，请下载完当前页的歌曲，在点击下一页进行下载</p>
          </div>
          <div class="favorite_btn">
            <div class="btn" data-type="search">查询</div>
            <div class="btn" data-type="download">下载</div>
          </div>
        </div>
        <div class="favorite_content">
          <div class="favorite_list"></div>
          <div class="favorite_detail">
            <div class="table_box"></div>
            <div class="pagination"></div>
          </div>
        </div>
      </div>
    `
    addStyle(cssContent)
    GL_popup.dialog({
      width: '70vw',
      title: '收藏夹信息',
      content: domContent,
      onReady: function () {
        // 监听单选框的改变
        const favoriteListDom = document.querySelector('.favorite_list')
        favoriteListDom.addEventListener('click', favoriteListChange)
        getFavoriteList().then((value) => {
          createFavoriteList(value)
        })
        //操作按钮绑定事件
        const favoriteBtnDom = document.querySelector('.favorite_btn')
        favoriteBtnDom.addEventListener('click', favoriteBtnChange)
        // 创造表格
        createTable()
        // 监听全选框
        const selectAllDom = document.getElementById('table_selectAll')
        selectAllDom.addEventListener('click', selectAllOrCancel)
        // 监听单个选择框
        const tbody = document.getElementById('table_body')
        tbody.addEventListener('click', selectSingle)
      }
    })
  }
  function createFavoriteList(list) {
    const favoriteListDom = document.querySelector('.favorite_list')
    let template = ''
    list.forEach((item) => {
      const tpl = `
        <div>
          <input type="radio" id="${item.id}" name="favoriteList" value="${item.id}" che>
          <label for="${item.id}">${item.title}</label>
        </div>
      `
      template += tpl
    })
    favoriteListDom.innerHTML = template
  }
  // 初始化表格
  function createTable() {
    const tableBoxDom = document.querySelector('.table_box')
    const table = document.createElement('table')
    const thead = document.createElement('thead')
    const tbody = document.createElement('tbody')
    tbody.id = 'table_body'
    const headContent = `
      <tr>
          <th>
              <input type="checkbox" name="check_sum" id="table_selectAll" />
          </th>
          <th>序号</th>
          <th>视频名称</th>
          <th>up主名称</th>
          <th>文件名称</th>
      </tr>
    `
    thead.innerHTML = headContent
    table.appendChild(thead)
    table.appendChild(tbody)
    tableBoxDom.appendChild(table)
  }
  // 重绘表格
  function resetTable(list) {
    const tbody = document.getElementById('table_body')
    let bodyContent = ''
    list.forEach((ele, idx) => {
      const tpl = `
        <tr>
          <td>
              <input type="checkbox" name="check_item" data-index="${idx}"/>
          </td>
          <td>${(GL_pagePsPn.pn - 1) * GL_pagePsPn.ps + idx + 1}</td>
          <td>${ele.title}</td>
          <td>${ele.upper.name}</td>
          <td>
            <input type="text" name="fileName" />
          </td>
        </tr>
      `
      bodyContent += tpl
    })
    tbody.innerHTML = bodyContent
  }
  let GL_favoriteId = null
  let GL_selectFavoriteId = null
  // 分页记录
  let GL_pagePsPn = {
    ps: 10,
    pn: 1,
    sumPn: 0,
  }
  function initPage(sumPN, pn) {
    const pageEle = document.querySelector(".pagination");
    new PageClass(pageEle, sumPN, pn, function (page) {
      GL_pagePsPn.pn = page
      const params = {
        pn: GL_pagePsPn.pn,
        media_id: GL_favoriteId,
      }
      getFavoriteDetail(params).then((value) => {
        resetTable(value)
      })
    });
  }
  // 监听收藏夹的修改
  function favoriteListChange(e) {
    // 过滤掉其他元素带来的干扰
    if (e.target.localName !== 'input') return
    GL_selectFavoriteId = e.target.value
  }
  // 监听查询/下载的按钮事件
  function favoriteBtnChange(e) {
    const type = e.target.dataset.type
    if (type === 'search') {
      search()
    } else if (type === 'download') {
      beforeDownload()
    }
  }
  function search() {
    if (!GL_selectFavoriteId) {
      alert('请先选择收藏夹')
      return
    }
    // 判断收藏夹是否发生了改变
    if (GL_favoriteId !== GL_selectFavoriteId) {
      GL_pagePsPn.pn = 1
    }
    GL_favoriteId = GL_selectFavoriteId
    const params = {
      media_id: GL_favoriteId,
      pn: GL_pagePsPn.pn,
      ps: GL_pagePsPn.ps,
    }
    getFavoriteDetail(params).then((value) => {
      resetTable(value)
    })
  }
  let GL_downloadTableData = []
  function beforeDownload() {
    if (GL_tableData.length <= 0) {
      alert('请先查询出收藏夹信息')
      return
    }
    // 先设置一次自定义文件名
    setInfo()
    const selectAllDom = document.getElementById('table_selectAll')
    const checkList = document.getElementsByName('check_item')
    const result = arrayMethod('every', checkList, (ele) => ele.checked)
    // 表示全部下载
    if (selectAllDom.checked || result) {
      GL_downloadTableData = GL_tableData
    } else {
      GL_downloadTableData = GL_tableData.filter((ele, idx) => {
        if (checkList[idx].checked) {
          return ele
        }
      })
    }
    download()

  }
  async function download(index = 0) {
    const value = GL_downloadTableData[index]
    if (!value) return
    const { bvid, title, ugc: { first_cid: cid }, fileName } = value
    const url = await getVideoDetail({ bvid, cid })
    let name = fileName ? fileName : title
    downloadAudio(url, name).then((res) => {
      if (res) {
        // 通过递归调用，把歌曲全部下载完
        index++
        download(index)
      }
    })

  }
  // 设置自定义的文件名字
  function setInfo() {
    const fileNameDomList = document.getElementsByName('fileName')
    const fileNameList = arrayMethod('map', fileNameDomList, (ele) => ele.value)
    GL_tableData.forEach((ele, idx) => {
      if (fileNameList[idx]) {
        ele.fileName = fileNameList[idx]
      }
    })
  }
  // 全选和反选
  function selectAllOrCancel() {
    const selectAllDom = document.getElementById('table_selectAll')
    const checkList = document.getElementsByName('check_item')
    arrayMethod('forEach', checkList, (ele) => {
      ele.checked = selectAllDom.checked
    })
  }
  // 单选
  function selectSingle(e) {
    const selectAllDom = document.getElementById('table_selectAll')
    const checkList = document.getElementsByName('check_item')
    const result = arrayMethod('every', checkList, (ele) => { return ele.checked })
    selectAllDom.checked = result
  }
  // 让类数组使用数组的方法
  function arrayMethod(type, list, fn) {
    return Array.prototype[type].call(list, fn)
  }
  // 增加样式
  function addStyle(css) {
    const myStyle = document.createElement('style');
    myStyle.textContent = css
    // 插入到head或者html标签中
    const doc = document.head || document.documentElement;
    doc.appendChild(myStyle);
  }
  // 增加样式方法2
  function setStyle(ele, styleObj) {
    for (let attr in styleObj) {
      ele.style[attr] = styleObj[attr]
    }
  }
  // 全局弹窗
  class Popup {
    _mask = null
    _dialog = null
    _dialogHeader = null
    _dialogContent = null
    _dialogTitle = null
    _dialogclose = null
    constructor() {
      // 遮罩
      this._mask = document.createElement('div')
      this.setStyle(this._mask, {
        "width": '100%',
        "height": '100%',
        "backgroundColor": 'rgba(0, 0, 0, .6)',
        "position": 'fixed',
        "left": "0px",
        "top": "0px",
        "bottom": "0px",
        "right": "0px",
        "z-index": "99999"
      })
      // 弹窗
      this._dialog = document.createElement('div')
      this.setStyle(this._dialog, {
        "overflow": 'hidden',
        "backgroundColor": '#fff',
        "boxShadow": '0 0 2px #999',
        "position": 'absolute',
        "left": '50%',
        "top": '50%',
        "transform": 'translate(-50%,-50%)',
        "borderRadius": '3px'
      })
      this._mask.appendChild(this._dialog)
      // 弹窗头部
      this._dialogHeader = document.createElement('div')
      this.setStyle(this._dialogHeader, {
        "width": '100%',
        "height": '40px',
        "lineHeight": '40px',
        "boxSizing": 'border-box',
        "background-color": 'rgba(251, 114, 153)',
        "color": '#FFF',
        "text-align": 'center',
        "font-weight": "700",
        "font-size": "16px"
      })
      this._dialog.appendChild(this._dialogHeader)
      // 弹窗内容
      this._dialogContent = document.createElement('div')
      this.setStyle(this._dialogContent, {
        "max-height": '70vh',
        "overflow-y": 'auto',
        "min-width": '400px',
        "width": '50vw',
      })
      this._dialog.appendChild(this._dialogContent)
      // 标题
      this._dialogTitle = document.createElement('span')
      this._dialogTitle.innerText = '全局弹窗'
      this.setStyle(this._dialogTitle, {
        "textDecoration": 'none',
        "color": '#666',
        "position": 'absolute',
        "left": '10px',
        "top": '0px',
        "fontSize": '25px',
        "color": '#FFF',
        "display": "inline-block"
      })
      this._dialogHeader.appendChild(this._dialogTitle)
      // 关闭按钮
      this._dialogclose = document.createElement('span')
      this._dialogclose.innerText = 'X'
      this._dialogclose.onclick = () => this.close(clearGlobal)
      // 设置样式
      this.setStyle(this._dialogclose, {
        "textDecoration": 'none',
        "color": '#666',
        "position": 'absolute',
        "right": '10px',
        "top": '0px',
        "fontSize": '25px',
        "color": '#FFF',
        "display": "inline-block",
        "cursor": "pointer"
      })
      this._dialogHeader.appendChild(this._dialogclose)

    }
    // 初始化dialog的内容区
    initContent(content, title = "全局弹窗", width = '') {
      // 置空，前后干扰
      this._dialogContent.innerHTML = ''
      this._dialogTitle.innerText = ''
      this._dialogTitle.innerText = title
      this._dialogContent.innerHTML = content
      width && this.setStyle(this._dialogContent, {
        "width": width
      })
    }
    dialog(params) {
      const { width, content, title, onReady } = params
      this.initContent(content, title, width)
      document.body.appendChild(this._mask)
      // 在弹窗创造完成后，执行这个方法
      if (onReady && typeof onReady === 'function') {
        setTimeout(() => {
          onReady(this)
        })
      }
    }
    close(fn) {
      document.body.removeChild(this._mask)
      if (typeof fn === 'function') {
        // 这里可以在执行额外的函数，来处理一些东西
        fn()
      }
    }
    setStyle(ele, styleObj) {
      for (let attr in styleObj) {
        ele.style[attr] = styleObj[attr]
      }
    }
  }
  // 分页器
  class PageClass {                               //定义一个分页器类      
    constructor(ele, pageNum, page, cb) {   //需要传入4个参数，第一个容器元素，第二个页面总数，第三个当前页面数，第四个为回调函数
      this.ele = ele;            //定义属性
      this.pageNum = pageNum;
      this.page = page;
      this.cb = cb;
      this.renderPage();     //执行渲染的方法
      this.operate();         //给实例化对象绑定各种操作的方法
    }
    renderPage() {                   //在类的原型上定义一个渲染的方法
      let str = '';
      if (this.pageNum > 5) {     //判断当前分页的页面总数是否超过5页
        if (this.page <= 4) {         //如果页面总数大于5  ，再判断当前页是否小于或者等于第四页
          for (let i = 0; i < 5; i++) {        //如果当前页是小于等于4以内的页数 ，遍历1到5
            if ((i + 1) == this.page) {       //判断当前页是否等于 当前   索引值（索引值从0开始） +  1
              str += `<span class="pageStyle" myPage="${i + 1}"><a href="javascript:;" class="active">${i + 1}</a></span>`;//等于的话说明渲染的是当前页，给当前页一个active的类名进行渲染
            } else {  //如果渲染的不是当前页
              str += `<span class="pageStyle" myPage="${i + 1}"><a href="javascript:;">${i + 1}</a></span>`;//普通渲染就行了
            }
          }
          str += `<span><i>•••</i></span><span class="pageStyle" myPage="${this.pageNum}"><a href="javascript:;">${this.pageNum}</a></span>`;//最后渲染一个最末尾页
        } else if (this.page > 4 && this.page < this.pageNum - 3) {   //判断当前页是否大于第四页，且小于最大页数减去 3 
          str += `<span class="pageStyle" myPage="1"><a href="javascript:;">1</a></span><span><i>•••</i></span>`; //渲染一个首页
          for (let i = this.page - 3; i < this.page + 2; i++) {
            if ((i + 1) == this.page) { //判断当前正在渲染的是否为当前页
              str += `<span class="pageStyle" myPage="${i + 1}"><a href="javascript:;" class="active">${i + 1}</a></span>`;//如果是当前页，给一个active类名进行渲染
            } else {
              str += `<span class="pageStyle" myPage="${i + 1}"><a href="javascript:;">${i + 1}</a></span>`;//如果不是，普通渲染就行
            }
          }
          str += `<span><i>•••</i></span><span class="pageStyle" myPage="${this.pageNum}"><a href="javascript:;">${this.pageNum}</a></span>`;//渲染一个尾页
        } else if (this.page >= this.pageNum - 3) {//如果当前页数大于或者等于最大页数 - 3 
          str += `<span class="pageStyle" myPage="1"><a href="javascript:;">1</a></span><span><i>•••</i></span>`; //渲染一个首页
          for (let i = this.pageNum - 5; i < this.pageNum; i++) {//从倒数第5页开始渲染
            if ((i + 1) == this.page) {   //如果渲染的是当前页
              str += `<span class="pageStyle" myPage="${i + 1}"><a href="javascript:;" class="active">${i + 1}</a></span>`;//增加一个active类名，进行渲染
            } else {
              str += `<span class="pageStyle" myPage="${i + 1}"><a href="javascript:;">${i + 1}</a></span>`;//否则普通渲染
            }
          }
        }
      } else {        //如果最大页数小于等于5
        for (let i = 0; i < this.pageNum; i++) {     //直接渲染到当前最大页数
          if ((i + 1) == this.page) {           //判断渲染的是否为当前页数
            str += `<span class="pageStyle" myPage="${i + 1}"><a href="javascript:;" class="active">${i + 1}</a></span>`;//如果是增加一个active类名，进行渲染
          } else {
            str += `<span class="pageStyle" myPage="${i + 1}"><a href="javascript:;">${i + 1}</a></span>`;//否则普通渲染就行了
          }
        }
      }
      //将所有内容渲染到容器盒子里
      //第一页
      //上一页
      //中间页面
      //下一页
      //最后一页
      this.ele.innerHTML = `
          <span class="first"><img src="data:image/png;base64,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"></span>
          <span class="prev"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAElElEQVR4nO3Tu40cRxSG0V2DPkNhCApBIVAO5Qugv74ABrAOQxGUgZSJAqCwmsulyH3M1PSjurvq1jnABf4bwHd7A1wkECgQCBQIBAoEAgUCgQKBQIFAoEAgUCAQKBAIFAgECgTCYg93n9/e3v3yz2mmJRAWefh4/+7Lvzd3bz59+Pn0piUQZnuM4+GP0/z7zadff7pJTCDM8iSOt6f7UyDwzYs4gkAgnIkjCAQuxBEEwtgKcQSBMK4rcQSBMKYJcQSBMJ6JcQSBMJYZcQSBMI6ZcQSBMIYFcQSBkN/COIJAyG1FHEEg5LUyjiAQcqoQRxAI+VSKIwiEXCrGEQRCHpXjCAIhhw3iCAKhfxvFEQRC3zaMIwiEfm0cRxAIfdohjiAQ+rNTHEEg9GXHOIJA6MfOcQSB0IcD4ggCoX0HxREEQtsOjCMIhHYdHEcQCG1qII4gENrTSBxBILSloTiCQGhHY3EEgdCGBuMIAuF4jcYRBMKxGo4jCITjNB5HEAjH6CCOIBD210kcQSDsq6M4gkDYT2dxBIGwjw7jCAJhe53GEQTCtjqOIwiE7XQeRxAI20gQRxAI9SWJIwiEuhLFEQRCPcniCAKhjoRxBIGwXtI4gkBYJ3EcQSAslzyOIBCWGSCOIBDmGySOIBDmGSiOIBCmGyyOIBCmGTCOIBCuGzSOIBDKBo4jCITLBo8jCITzxPGVQHhNHN8JhOfE8YxA+EEcrwiER+I4SyCIo0AgoxNHkUBGJo6rBDIqcUwikBGJYzKBjEYcswhkJOKYTSCjEMciAhmBOBYTSHbiWEUgmYljNYFkJY4qBJKROKoRSDbiqEogmYijOoFkIY5NCCQDcWxGIL0Tx6YE0rsvv92/f7h5+Hya1CeQDESyGYFkIZJNCCQTkVQnkGxEUpVAMhJJNQLJSiRVCCQzkawmkOxEsopARiCSxQQyCpEsIpCRiGQ2gYxGJLMIZEQimUwgoxLJJAIZmUiuEsjoRFIkEERSIBAeieQsgfCDSF4RCM+J5BmB8JpIvhMI54nkK4FwmUgEwhWDRyIQrhs4EoEwzaCRCITpBoxEIMwzWCQCYb6BIhEIywwSiUBYboBIBMI6ySMRCOsljkQg1JE0EoFQT8JIBEJdySIRCPUlikQgbCNJJAJhOwkiEQjb6jwSgbC9jiMRCPvoNBKBsJ8OIxEI++osEoGwv44iEQjH6CQSgXCcDiIRCMdqPBKBcLyGIxEIbWg0EoHQjgYjEQhtaSwSgdCehiIRCG1qJBKB0K4GIhEIbTs4EoHQvgMjEQh9OCgSgdCPAyIRCH3ZORKB0J8dIxEIfdopEoHQrx0iEQh92zgSgdC/DSMRCDlsFIlAyGODSARCLpUjEQj5VIxEIORUKRKBkFeFSARCbisjEQj5rYhEIIxhYSQCYRwLIhEIY5kZiUAYz4xIBMKYJkYiEMY1IRKBMLYrkQgECpEIBMKFSAQC/zsTiUDgqReRCAReehKJQOCcb5G8Fwhc8PDx/t3t7x/+Os20BAIFAoECgUCBQKBAIFAgECgQCBQIBAoEAgUCgQKBQIFAoOA/k/kfFHovJXkAAAAASUVORK5CYII="></span>
          ${str}
          <span class="next"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAEh0lEQVR4nO3Tu40cRxSG0RlwA1AozEAKRXRWvgD56xOSLzpkCAyBITAU0qZBdvO5j5nqd3fVvecABfxuFeo7n4CrBAIFAoECgUCBQKBAIFAgECgQCBQIBAoEAgUCgQKBQEH4QD7/8+r5+eXt+27CZOED+fT3/+/Op/Obm/9u35xgohSBnE6n37tIXoiEqdIE0p3usiJhmlSB9ETCFOkC6YmEsVIG0hMJY6QNpCcShqQOpCcSStIH0hMJ1wjkO5FwiUDuEQmPCeQRkXCfQC4QCT8I5AqR0BNIgUgQyACR5CaQEUSSl0BGEklOAplAJPkIZCKR5CKQGUSSh0BmEkkOAllAJPEJZCGRxCaQFYgkLoGsRCQxCWRFIolHICsTSSwC2YBI4hDIRkQSg0A2JJL2CWRjImmbQHYgknYJZCciaZNAdiSS9ghkZyJpi0AOIJJ2COQgImmDQA4kkvoJ5GAiqZtAKiCSegmkEiKpk0AqIpL6CKQyIqmLQCokknoIpFIiqYNAKiaS4wmkciI5lkAaIJLjCKQRIjmGQBoikv0JpDEi2ZdAGiSS/QikUSLZh0AaJpLtCaRxItmWQAIQyXYEEoRItiGQQESyPoEEI5J1CSQgkaxHIEGJZB0CCUwkywkkOJEsI5AERDKfQJIQyTwCSUQk0wkkGZFMI5CERDKeQJISyTgCSUwkwwSSnEjKBEL3CURyjUD4SiSXCYSfRPKUQHhAJA8JhCdE8otAuEgk3wiEq0TSv0FwAlkmeyQCYVDmSATCKFkjEQijZYxEIEySLRKBMFmmSATCLFkiEQizZYhEIMwmkAAEso0McfQEwmRZ4ugJhEkyxdETCKNli6MnEEbJGEdPIAzKGkdPIBRljqMnEK7KHkdPIFwkjm8EwhPi+EUgPCCOhwTCT+J4SiB8JY7LBEL3CcRxjUCSE0eZQBITxzCBJCWOcQSSkDjGE0gy4phGIImIYzqBJCGOeQSSgDjmE0hw4lhGIIGJYzmBBCWOdQgkIHGsRyDBiGNdAglEHOsTSBDi2IZAAhDHdgTSOHFsSyANE8f2BNIocexDIA0Sx34E0hhx7EsgDRHH/gTSCHEcQyANEMdxBFI5cRxLIBUTx/EEUilx1EEgFRJHPQRSGXHURSAVEUd9BFIJcdRJIBUQR70EcjBx1E0gBxJH/QRyEHG0QSAHEEc7BLIzcbRFIDsSR3sEshNxtEkgOxBHuwSyMXG0TSAbEkf7BLIRccQgkA2IIw6BrEwcsQhkReKIRyArEUdMAlmBOOISyELiiE0gC4gjPoHMJI4cBDKDOPIQyETiyEUgE4gjH4GMJI6cBDKCOPISyABx5CaQAnEgkCvEQU8gF4iDHwTyiDi4TyD3iIPHBPKdOLhEIB1xcE36QMRBSepAxMGQtIGIgzFSBiIOxsoWyMfz+fTnzb9/ve02DMoUyMebZ+c/zi9v33cbRskSyHNxMEeCQF69vXl2uhMHc4QP5PPd69/Ody8+dBMmCx8ILCEQKBAIFAgECgQCBQKBAoFAgUCgQCBQIBAoEAgUCAQKvgBKkHD2vn/5LQAAAABJRU5ErkJggg=="></span>
          <span class="last"><img src="data:image/png;base64,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"></span>
      `
    }
    operate() {                  //在类原型上定义一个operate的方法，给这个类绑定点击事件
      const _that = this;        //申明一个常量接收this
      let firstEle = this.ele.querySelector(".first");    //获取第一页的元素
      let lastEle = this.ele.querySelector(".last");      //获取最后一页的元素
      let nextEle = this.ele.querySelector(".next");      //获取下一页的元素myPage.active
      let prevEle = this.ele.querySelector(".prev");      //获取上一页的元素
      let pageStyleEles = this.ele.querySelectorAll(".pageStyle");    //获取所有的中间页面的元素
      firstEle.onclick = function () {     //当点击第一页时
        _that.page = 1;                //让page属性重新赋值为1
        _that.cb(_that.page);           //并将page属性通过回调函数cb传递出去
      }
      lastEle.onclick = function () {      //当点击最后一页时
        _that.page = _that.pageNum;    //让page属性重新赋值为页面最大值
        _that.cb(_that.page);          //并将page属性通过回调函数cb传递出去
      }
      nextEle.onclick = function () {      //当点击下一页时
        if (_that.page < _that.pageNum) {   //先判断当前页是否小于最大页
          _that.page = _that.page + 1;   //如果没有超过，给page属性自增1
          _that.cb(_that.page);           //并将page属性通过回调函数cb传递出去
        }
      }
      prevEle.onclick = function () {      //当点击上一页时
        if (_that.page > 1) {           //先判断当前页是否大于第一页
          _that.page = _that.page - 1;   //如果是大于第一页的话，page属性自减1
          _that.cb(_that.page);           //并将page属性通过回调函数cb传递出去
        }
      }
      pageStyleEles.forEach(function (pageStyleEle) {       //遍历获取到中间页面的所有元素
        pageStyleEle.onclick = function () {                //当点击其中一页时
          _that.page = parseInt(this.getAttribute("myPage")); //获取这个元素自定义属性，myPage，属性值是当前页 ，并将当前页赋值给page属性
          _that.cb(_that.page);                           //将page属性通过回调函数cb传递出去
        }
      });
    }
  }
  // 全局变量置空
  function clearGlobal() {
    GL_favoriteId = null
    GL_selectFavoriteId = null
    GL_downloadTableData = []
    GL_favoriteList = []
    GL_lateOnList = []
    GL_PageCount = 0
    GL_pagePsPn = {
      ps: 10,
      pn: 1,
      sumPn: 0,
    }
    GL_tableData = []
  }
  setTimeout(() => {
    init()
  }, 500)
}())