// ==UserScript==
// @name         Javdb_Emby助手
// @version      1.0.1
// @author       weiShao
// @description  Javdb_Emby助手_weiShao
// @license      MIT
// @icon         https://www.javdb.com/favicon.ico
// @match        https://*.javdb.com/*
// @match        *://*.javdb.com/*
// @connect      jable.tv
// @connect      missav.com
// @connect      javhhh.com
// @connect      netflav.com
// @connect      avgle.com
// @connect      bestjavporn.com
// @connect      jav.guru
// @connect      javmost.cx
// @connect      hpjav.tv
// @connect      av01.tv
// @connect      javbus.com
// @connect      javmenu.com
// @connect      javfc2.net
// @connect      paipancon.com
// @connect      ggjav.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/434740
// @downloadURL https://update.greasyfork.org/scripts/502442/Javdb_Emby%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/502442/Javdb_Emby%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  /* globals jQuery, $, waitForKeyElements */


  /**
   *   加载动画
   */
  const LoadingGif = {
    /**
     *    加载动画的元素
     */
    element: null,

    /**
     *  启动加载动画
     */
    start: function () {
      if (!this.element) {
        this.element = document.createElement('img')
        this.element.src =
          'https://upload.wikimedia.org/wikipedia/commons/3/3a/Gray_circles_rotate.gif'
        this.element.alt = '读取文件夹中...'
        Object.assign(this.element.style, {
          position: 'fixed',
          bottom: '0',
          left: '50px',
          zIndex: '1000',
          width: '40px',
          height: '40px',
          padding: '5px'
        })
        document.body.appendChild(this.element)
      }
    },

    /**
     *   停止加载动画
     */
    stop: function () {
      if (this.element) {
        document.body.removeChild(this.element)
        this.element = null
      }
    }
  }

  /**
   *   本地文件夹处理函数
   */
  const LocalFolderHandler = (function () {
    class LocalFolderHandlerClass {
      constructor() {
        this.nfoFileNamesSet = new Set()
        this.initButton()
      }

      /**
       * 创建一个按钮元素并添加到页面中
       */
      initButton() {
        const button = this.createButtonElement()
        button.addEventListener('click', this.handleButtonClick.bind(this))
        document.body.appendChild(button)
      }

      /**
       * 创建一个按钮元素
       * @returns {HTMLButtonElement}
       */
      createButtonElement() {
        const button = document.createElement('button')
        button.innerHTML = '仓'

        Object.assign(button.style, {
          color: '#fff',
          backgroundColor: '#FF8400',
          borderColor: '#FF8400',
          borderRadius: '5px',
          position: 'fixed',
          bottom: '2px',
          left: '2px',
          zIndex: '1000',
          padding: '5px 10px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        })

        return button
      }

      /**
       * 按钮点击事件处理函数
       */
      async handleButtonClick() {
        this.nfoFileNamesSet.clear()

        const directoryHandle = await window.showDirectoryPicker()
        console.log(
          '%c Line:90 🍖 directoryHandle',
          'color:#42b983',
          directoryHandle.name
        )

        if (!directoryHandle) {
          alert('获取本地信息失败')
          return
        }

        const startTime = Date.now()
        LoadingGif.start()

        for await (const fileData of this.getFiles(directoryHandle, [
          directoryHandle.name
        ])) {
          const file = await fileData.fileHandle.getFile()
          const videoFullName = await this.findVideoFileName(
            fileData.parentDirectoryHandle
          )

          const item = {
            originalFileName: file.name.substring(
              0,
              file.name.length - '.nfo'.length
            ),
            transformedName: this.processFileName(file.name),
            videoFullName: videoFullName,
            hierarchicalStructure: [...fileData.folderNames, videoFullName]
          }

          this.nfoFileNamesSet.add(item)
        }

        const str = JSON.stringify(Array.from(this.nfoFileNamesSet))
        localStorage.setItem('nfoFiles', str)

        LoadingGif.stop()

        const endTime = Date.now()
        const time = ((endTime - startTime) / 1000).toFixed(2)

        alert(
          `读取文件夹: '${directoryHandle.name}' 成功，耗时 ${time} 秒, 共读取 ${this.nfoFileNamesSet.size} 个视频。`
        )

        onBeforeMount()
      }

      /**
       * 递归获取目录下的所有文件
       * @param {FileSystemDirectoryHandle} directoryHandle - 当前目录句柄
       * @param {string[]} folderNames - 目录名数组
       * @returns {AsyncGenerator}
       */
      async *getFiles(directoryHandle, folderNames = []) {
        for await (const entry of directoryHandle.values()) {
          try {
            if (entry.kind === 'file' && entry.name.endsWith('.nfo')) {
              yield {
                fileHandle: entry,
                folderNames: [...folderNames],
                parentDirectoryHandle: directoryHandle
              }
            } else if (entry.kind === 'directory') {
              yield* this.getFiles(entry, [...folderNames, entry.name])
            }
          } catch (e) {
            console.error(e)
          }
        }
      }

      /**
       * 查找视频文件名
       * @param {FileSystemDirectoryHandle} directoryHandle - 当前目录句柄
       * @returns {Promise<string>} 找到的视频文件名或空字符串
       */
      async findVideoFileName(directoryHandle) {
        for await (const entry of directoryHandle.values()) {
          if (
            entry.kind === 'file' &&
            (entry.name.endsWith('.mp4') ||
              entry.name.endsWith('.mkv') ||
              entry.name.endsWith('.avi') ||
              entry.name.endsWith('.flv') ||
              entry.name.endsWith('.wmv') ||
              entry.name.endsWith('.mov') ||
              entry.name.endsWith('.rmvb'))
          ) {
            return entry.name
          }
        }
        return ''
      }

      /**
       * 处理文件名
       * 去掉 '.nfo'、'-c'、'-C' 和 '-破解' 后缀，并转换为小写
       * @param {string} fileName - 原始文件名
       * @returns {string} 处理后的文件名
       */
      processFileName(fileName) {
        let processedName = fileName.substring(
          0,
          fileName.length - '.nfo'.length
        )
        processedName = processedName.replace(/-c$/i, '')
        processedName = processedName.replace(/-破解$/i, '')
        return processedName.toLowerCase()
      }
    }

    return function () {
      new LocalFolderHandlerClass()
    }
  })()

  /**
   * 列表页处理函数
   */
  const ListPageHandler = (function () {
    /**
     * @type {string} btsow 搜索 URL 基础路径
     */
    const btsowUrl = 'https://btsow.com/search/'

    /**
     * 获取本地存储的 nfo 文件名的 JSON 字符串
     * @returns {string[]|null} nfo 文件名数组或 null
     */
    function getNfoFiles() {
      const nfoFilesJson = localStorage.getItem('nfoFiles')
      return nfoFilesJson ? JSON.parse(nfoFilesJson) : null
    }

    /**
     * 创建本地打开视频所在文件夹按钮
     * @param {HTMLElement} ele 要添加的所在的元素
     */
    function createOpenLocalFolderBtn(ele) {
      if (ele.querySelector('.open_local_folder')) {
        return
      }

      const openLocalFolderBtnElement = document.createElement('div')
      openLocalFolderBtnElement.className = 'tag open_local_folder'
      openLocalFolderBtnElement.textContent = '本地打开'

      Object.assign(openLocalFolderBtnElement.style, {
        marginLeft: '10px',
        color: '#fff',
        backgroundColor: '#F8D714'
      })

      openLocalFolderBtnElement.addEventListener('click', function (event) {
        event.preventDefault()
        const localFolderPath = 'Z:\\日本'
        // 打开本地文件夹逻辑
      })

      ele.querySelector('.tags').appendChild(openLocalFolderBtnElement)
    }

    /**
     * 创建 btsow 搜索视频按钮
     * @param {HTMLElement} ele 要添加的所在的元素
     * @param {string} videoTitle 视频标题
     */
    function createBtsowBtn(ele, videoTitle) {
      if (ele.querySelector('.btsow')) {
        return
      }

      const btsowBtnElement = document.createElement('div')
      btsowBtnElement.className = 'tag btsow'
      btsowBtnElement.textContent = 'Btsow'

      Object.assign(btsowBtnElement.style, {
        marginLeft: '10px',
        color: '#fff',
        backgroundColor: '#FF8400'
      })

      btsowBtnElement.addEventListener('click', function (event) {
        event.preventDefault()
        window.open(`${btsowUrl}${videoTitle}`, '_blank')
      })

      ele.querySelector('.tags').appendChild(btsowBtnElement)
    }

    /**
     * 显示本地下载的文件名并改写样式
     * @param {HTMLElement} ele 元素
     * @param {Object} item 影片项
     */
    function displayOperationOfTheItemInQuestion(ele, item) {
      const imgElement = ele.querySelector('.cover img')
      imgElement.style.padding = '10px'
      imgElement.style.backgroundColor = '#FF0000'

      const videoTitleElement = document.createElement('div')
      videoTitleElement.textContent = item.originalFileName

      Object.assign(videoTitleElement.style, {
        margin: '1rem',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        fontSize: '.75rem',
        height: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '5px'
      })

      ele.querySelector('.box').appendChild(videoTitleElement)

      videoTitleElement.addEventListener('click', function () {
        navigator.clipboard.writeText(item.originalFileName)
        videoTitleElement.textContent = item.originalFileName + ' 复制成功'
      })
    }

    /**
     * 处理列表页逻辑
     */
    function handler() {
      const nfoFilesArray = getNfoFiles()
      if (!nfoFilesArray) {
        return
      }

      LoadingGif.start()

      $('.movie-list .item').each(function (index, ele) {
        const videoTitle = ele.querySelector('strong').innerText.toLowerCase()
        createBtsowBtn(ele, videoTitle)

        nfoFilesArray.forEach(function (item) {
          if (item.transformedName.includes(videoTitle)) {
            createOpenLocalFolderBtn(ele)
            displayOperationOfTheItemInQuestion(ele, item)
          }
        })
      })

      LoadingGif.stop()
    }

    return handler
  })()

  /**
   * 详情页处理函数
   */
  const DetailPageHandler = (function () {
    /**
     * 获取页面视频标题
     * @returns {string} 视频标题文本
     */
    function getVideoTitle() {
      return $('.video-detail strong').first().text().trim().toLowerCase()
    }

    /**
     * 从 localStorage 获取 nfoFiles
     * @returns {Array} nfoFiles 数组
     */
    function getNfoFiles() {
      const nfoFilesJson = localStorage.getItem('nfoFiles')
      return nfoFilesJson ? JSON.parse(nfoFilesJson) : null
    }

    /**
     * 设置 .video-meta-panel 背景色
     */
    function highlightVideoPanel() {
      $('.video-meta-panel').css({ backgroundColor: '#FFC0CB' })
    }

    /**
     * 创建或获取影片存在提示元素
     * @returns {HTMLElement} localFolderTitleListElement 元素
     */
    function createOrGetLocalFolderTitleListElement() {
      let localFolderTitleListElement = document.querySelector(
        '.localFolderTitleListElement'
      )
      if (!localFolderTitleListElement) {
        localFolderTitleListElement = document.createElement('div')
        localFolderTitleListElement.className = 'localFolderTitleListElement'
        localFolderTitleListElement.textContent = 'Emby已存在影片'

        Object.assign(localFolderTitleListElement.style, {
          color: '#fff',
          backgroundColor: '#FF8400',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '16px',
          fontWeight: 'bold',
          position: 'fixed',
          left: '20px',
          top: '200px',
          width: '240px'
        })

        document.body.appendChild(localFolderTitleListElement)
      }
      return localFolderTitleListElement
    }

    /**
     * 添加影片列表项
     * @param {Object} item 影片项
     */
    function addLocalFolderTitleListItem(item) {
      const localFolderTitleListElement =
        createOrGetLocalFolderTitleListElement()

      const localFolderTitleListItem = document.createElement('div')
      localFolderTitleListItem.className = 'localFolderTitleListItem'
      localFolderTitleListItem.textContent = item.originalFileName

      Object.assign(localFolderTitleListItem.style, {
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px'
      })

      localFolderTitleListElement.appendChild(localFolderTitleListItem)

      localFolderTitleListItem.addEventListener('click', function () {
        navigator.clipboard.writeText(item.transformedName)
        localFolderTitleListItem.textContent =
          item.originalFileName + ' 复制成功'
      })
    }

    /**
     * 排序种子列表
     */
    function sortBtList() {
      const magnetsContent = document.getElementById('magnets-content')
      if (!magnetsContent?.children.length) return

      const items = Array.from(magnetsContent.querySelectorAll('.item'))

      items.forEach(function (item) {
        const metaSpan = item.querySelector('.meta')
        if (metaSpan) {
          const metaText = metaSpan.textContent.trim()
          const match = metaText.match(/(\d+(\.\d+)?)GB/)
          const size = match ? parseFloat(match[1]) : 0
          item.dataset.size = size
        }
      })

      items.sort(function (a, b) {
        return b.dataset.size - a.dataset.size
      })

      const priority = {
        high: [],
        medium: [],
        low: []
      }

      items.forEach(function (item) {
        const nameSpan = item.querySelector('.name')
        if (nameSpan) {
          const nameText = nameSpan.textContent.trim()

          if (/(-c| -C)/i.test(nameText)) {
            priority.high.push(item)
            item.style.backgroundColor = '#FFCCFF'
          } else if (!/[A-Z]/.test(nameText)) {
            priority.medium.push(item)
            item.style.backgroundColor = '#FFFFCC'
          } else {
            priority.low.push(item)
          }
        }
      })

      magnetsContent.innerHTML = ''

      priority.high.forEach(function (item) {
        magnetsContent.appendChild(item)
      })
      priority.medium.forEach(function (item) {
        magnetsContent.appendChild(item)
      })
      priority.low.forEach(function (item) {
        magnetsContent.appendChild(item)
      })
    }

    /**
     * 主函数，处理详情页逻辑
     */
    function handler() {
      const videoTitle = getVideoTitle()
      if (!videoTitle) return

      const nfoFiles = getNfoFiles()
      if (!nfoFiles) return

      LoadingGif.start()

      nfoFiles.forEach(function (item) {
        if (item.transformedName.includes(videoTitle)) {
          highlightVideoPanel()
          addLocalFolderTitleListItem(item)
        }
      })

      sortBtList()

      LoadingGif.stop()
    }

    return handler
  })()

  /**
   *  页面加载前执行
   */
  async function onBeforeMount() {
    // 立即调用以初始化按钮和事件处理程序
    LocalFolderHandler()

    // 调用列表页处理函数
    ListPageHandler()

    // 调用详情页处理函数
    DetailPageHandler()
  }

  onBeforeMount()
})()
