// ==UserScript==
// @name         我的LT阅读器一键高亮补丁-gemma版
// @namespace    https://www.ellibrototal.com/
// @version      2025-05-24.8.final
// @license      MIT
// @description  自己看书使用
// @author       You
// @match        https://www.ellibrototal.com/ltotal/*
// @icon         none
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow

// @require      https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.min.js
// @downloadURL https://update.greasyfork.org/scripts/536742/%E6%88%91%E7%9A%84LT%E9%98%85%E8%AF%BB%E5%99%A8%E4%B8%80%E9%94%AE%E9%AB%98%E4%BA%AE%E8%A1%A5%E4%B8%81-gemma%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/536742/%E6%88%91%E7%9A%84LT%E9%98%85%E8%AF%BB%E5%99%A8%E4%B8%80%E9%94%AE%E9%AB%98%E4%BA%AE%E8%A1%A5%E4%B8%81-gemma%E7%89%88.meta.js
// ==/UserScript==

;(function () {
  "use strict"

  // DONE: 解决boxSearchInput输入法闪退问题，可能在viewerTxt-1.0.4.js中
  // console.log('from user.js')

  /**
   * 模块0: 使用GM_addStyle添加CSS样式
   */
  {
    GM_addStyle(`
        /* 这里是你的CSS规则 */
 
        /* 点击高亮单词，渐变优化不晃眼 */
        .boxMosaicFull {
          background-color: #fbf6e2 !important;
        }

        /* 自定义按钮样式 */
        .menuBtn {
          /* 现有样式 */
          border-radius: 10px !important;
 
          /* --- 新增立体效果 --- */
          /* 内部阴影：模拟按钮顶部的高光或凹陷感 */
          box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.4), /* 顶部亮光 */
              inset 0 -1px 0 rgba(0, 0, 0, 0.2),    /* 底部暗影 */
              0 2px 3px rgba(0, 0, 0, 0.4);         /* 外部投影，模拟按钮抬起 */
        }
 
        /* :active 状态：模拟按钮被按下的效果 */
        .menuBtn:active {
            background: linear-gradient(to top, #4a4a4a, #2a2a2a); /* 渐变反转，模拟凹陷 */
            box-shadow:
                inset 0 2px 4px rgba(0, 0, 0, 0.5), /* 内部阴影加深，模拟按下 */
                0 1px 2px rgba(0, 0, 0, 0.3);       /* 外部阴影减弱 */
            transform: translateY(0); /* 回到原位，模拟按下去 */
            border-bottom: 1px solid rgba(0, 0, 0, 0.2); /* 底部边框变薄 */
        }
 
        /* 笔记展示页面定制 */
        .cita_nota {
          display: none; /* 隐藏 cita_nota 元素 */
        }
 
        .note_signature {
          display: none; /* 隐藏 note_signature 元素 */
        }
 
        #pTimeStamp {
          font-size: 9px !important;
          color: gray;
          text-align: right !important;
        }

        .modalViewerLT {
          background-color: #fbf6e2 !important;
        }
        
        .modalViewerLT .contentHtml {
          position: relative;
          width: 92% !important;
          height: 88%;
          margin: 0px !important;
          padding: 15px !important;
          overflow: hidden;
          background-repeat: no-repeat;
          background-size: contain;
        }
 
        .modalViewerLT .contentHtml p {
          font-size: 0.9em !important;
          text-align: left;
        }
        
        /* 阅读笔记界面 */
        .pWithColorDot {
          border-bottom-style: inset;
        }
 
        /* 编辑笔记界面 */
        #div_nota_visor .div_title input.nota_title {
          width: 90% !important;
        }
 
        #div_nota_visor .editor_area_notas {
          width: 90% !important;
        }
 
        .editor_area {
          font-family: DM_Sans_regular !important;
        }
        
        // 编辑按钮 上挪一些
        #div_nota_visor .btn_salvar {
          bottom: 30px;
        }
     `)
  }

  /**
   * 模块1: 重新创建 panelSocial 实例，打上猴子补丁；
   */
  {
    // 给猴子补丁补充原js文件中的变量
    var isSmartPhone = ltotalOS.isSmartPhone
    var isTablet = ltotalOS.isTablet
    var isTouch = isSmartPhone || isTablet
    var bodyDiv = document.body
    var SycCredentials = null

    function initPanelSocial() {
      var ltotalOSConfig = {
        bridged: false,
        //repoDir: "https://www.syc.com.co/estaticos/repo_ltotal",
        //queryURLPrefix: "EscritorioUniversal/LtotalBridge.aspx"
        //queryURLPrefix: "http://www.ellibrototal.com"
        //queryURLPrefix: "http://test.ellibrototal.com.co"
        queryURLPrefix: "",
      }
      ltotalOS.init(ltotalOSConfig)

      var btnCerrar = $.trim(gup("btnCerrar"))

      var settings = {
        withLogin: true,
        contMusicHostDiv: ".boxBread",
        btnCerrar: btnCerrar,
      }

      //////// 猴子补丁，重点！使用unsafeWindow防止原panelSocial被沙箱保护
      unsafeWindow.panelSocial = new PanelSOCIAL(settings)

      //////// 猴子补丁，去除编辑之后的黄色回调界面
      unsafeWindow.panelSocial.editNote = function (
        tipo_nota,
        id_nota,
        _extra
      ) {
        // 猴子补丁
        console.log("进入猴子补丁函数 editNote")

        // 以下为源代码
        if (!_extra) {
          _extra = {}
        }
        if (isTablet || isSmartPhone) {
          _extra.position = 4
        }

        var config = {
          containerClass: "editor_notas_edesk",
          parentContainer: bodyDiv,
          position: _extra.position,
          subrayar: false,
          activarSeleccion: false,
          mostrarBarra: true,
          bindTouch: isTouch,

          tipoItemRela: _extra.tipoItemRela,
          idItemRela: _extra.idItemRela,
          idItem2Rela: _extra.idItem2Rela,
          npagItemRela: _extra.npagItemRela,
          idNotaRela: _extra.idNotaRela,
          txtRela: _extra.txtRela,

          correccionEdicion: _extra.correccionEdicion,

          nsecc: _extra.nsecc,

          afterSaveCallback: function (_data, _obj) {
            _obj.closeCont()

            var openMyNotas = true

            var sb = panelSocial.selectedBook
            if (sb) {
              var sets = sb.settings
              var ss = sb.settings
              if (_obj.tipoComp == ss.tipoLibro && _obj.idLibro == ss.idLibro) {
                sb.goToPageAndHighLightNote(_obj.npag, _obj.idNota).done(
                  function () {
                    panelSocial
                      .getSeccionLibroByIDNota(27, 0, _obj.idNota)
                      .then(function (_nsec) {
                        var extra = { numeSeccion: _nsec }
                        // 猴子补丁 去掉openBook功能 防止黄屏回调界面
                        // panelSocial.openBook(27, 0, -1, extra);
                        console.log("patched")
                      })
                  }
                )
                openMyNotas = false
              } else {
                if (ss.tipoLibro == 27) {
                  var extra = {}
                  if (ss.modoLibro == 2) {
                    extra.modoLibro = 2
                  }
                  sb.bookGotoSection(_extra.nsecc, _extra.npagNote, extra)
                  openMyNotas = false
                }
              }
            }

            if (openMyNotas) {
              var extra = { numeSeccion: 1 }
              if (_extra.nsecc) {
                extra.numeSeccion = _extra.nsecc
              }
              panelSocial.openBook(27, 0, -1, extra)
            }
          },
          extraParams: SycCredentials,
        }

        //Notas de personaje
        if (tipo_nota == 15) {
          config.mostrarBarra = false

          if (id_nota == 0) {
            fisher.newNote(config)
          }
          if (id_nota > 0) {
            fisher.editNote(id_nota, _extra.position, config)
          }
        }

        //Notas de lector
        if (tipo_nota == 17) {
          if (id_nota == 0) {
            llector.newNote(_extra.toBook, _extra.idProy, null, null, config)
          }
          if (id_nota > 0) {
            if (!_extra.npagNote) {
              _extra.npagNote = "0"
            }
            llector.editNote(id_nota, _extra.npagNote, null, config)
          }
        }
      }

      //////// 猴子补丁，去除删除笔记是弹出对话框 DialogueLM
      unsafeWindow.panelSocial.deleteNote = function (
        tipo_nota,
        id_nota,
        _fncb
      ) {
        console.log("进入猴子补丁函数 deleteNote")
        var url = "/ltotal/lector/editNota.jsp"
        var params = { caso: 5, tipoNota: tipo_nota, idNota: id_nota }
        panelSocial.doPost(url, params).done(_fncb)
      }

      console.log("initPanelSocial 猴子补丁完成")
    }

    initPanelSocial()
  }

  /**
   * 模块2: Spin.js 加载动画的 DOM 容器和 CSS 样式
   */
  {
    const loadingSpinnerId = "my-gm-loading-spinner"
    let loadingSpinnerDiv = document.getElementById(loadingSpinnerId)

    // 如果容器不存在，则创建并添加到 body
    if (!loadingSpinnerDiv) {
      loadingSpinnerDiv = document.createElement("div")
      loadingSpinnerDiv.id = loadingSpinnerId
      // 样式以确保居中和覆盖
      loadingSpinnerDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999; /* 确保在最上层 */
            display: none; /* 默认隐藏 */
            background-color: rgba(255, 255, 255, 0);
            border-radius: 8px;
            padding: 15px;
        `
      document.body.appendChild(loadingSpinnerDiv)
    }

    // --- Spin.js 配置选项 ---
    const spinnerOptions = {
      lines: 8, // 加载动画中的线条数量
      length: 0, // 每条线的长度
      width: 10, // 每条线的粗细
      radius: 18, // 内圆的半径
      scale: 0.6, // 整体缩放因子
      corners: 1, // 圆角程度 (0 to 1)
      color: "#000", // 颜色
      opacity: 0, // 透明度
      rotate: 0, // 旋转度数
      direction: 1, // 1: 顺时针, -1: 逆时针
      speed: 1, // 每秒的旋转圈数
      trail: 60, // 尾迹的百分比
      fps: 20, // 每秒帧数
      zIndex: 2e9, // Z-index (默认值 2000000000)
      className: "spinner", // 自定义类名
      top: "50%", // 定位顶部距离
      left: "50%", // 定位左侧距离
      shadow: false, // 是否显示阴影
      hwaccel: false, // 是否使用硬件加速
      position: "absolute", // 相对于容器定位
    }

    let spinner // 用于存储 Spin.js 实例

    // --- Spinner 控制函数 ---
    function startSpinner() {
      if (!spinner) {
        // 注意：Spin.js 的 Spinner 构造函数在 @require 加载后会全局可用
        spinner = new Spinner(spinnerOptions)
      }
      spinner.spin(loadingSpinnerDiv) // 绑定到容器
      loadingSpinnerDiv.style.display = "block" // 显示容器
    }

    function stopSpinner() {
      if (spinner) {
        spinner.stop() // 停止动画并从 DOM 移除
        loadingSpinnerDiv.style.display = "none" // 隐藏容器
      }
    }

    // --- 劫持 (Hook) fetch API ---
    // 为了在每次 fetch 请求时自动显示和隐藏加载动画，我们需要劫持原生的 fetch 函数。
    const originalFetch = window.fetch

    window.fetch = async function (...args) {
      startSpinner() // 在 fetch 请求开始时显示 Spinner
      try {
        const response = await originalFetch(...args)
        // 这里可以添加一些检查，比如response.ok，但为了通用性，直接返回response
        return response
      } catch (error) {
        console.error("Fetch request failed:", error)
        // 可以在这里添加一些错误提示
        throw error // 重新抛出错误，让调用者可以捕获
      } finally {
        stopSpinner() // 无论成功或失败，都在 fetch 完成后隐藏 Spinner
      }
    }
  }

  /**
   * 模块3: 保存 选择高亮文本 至 selectedText
   */
  {
    function handleSelection() {
      const selectedText = window.getSelection().toString().trim()
      if (selectedText) {
        GM_setValue("sharedText", selectedText) // 存储到 GM_setValue
        console.log("选定的文本已存储到 GM_setValue：", selectedText)
      }
    }
    // 监听 selectionchange 事件
    document.addEventListener("selectionchange", handleSelection)
    // 监听 mouseup 事件
    document.addEventListener("mouseup", handleSelection)
  }

  /**
   * 模块4: 修改 "Nota" 按钮文字为 "🐵AI笔记"
   */
  {
    // 定义当目标元素出现时要执行的函数
    function handleContextualMenuAppeared(contextualMenuDiv) {
      console.log("ContextualMenu div 出现了！", contextualMenuDiv)
      // 在这里执行你想要的操作
      // 例如：
      // 1. 修改它的样式
      // contextualMenuDiv.style.border = '2px solid red';

      // 2. 查找并修改其中的子元素
      // const dicButton = contextualMenuDiv.querySelector('.menuBtn');
      // if (dicButton) {
      //     dicButton.textContent = '新的字典按钮文本';
      // }

      // 3. 添加事件监听器
      // contextualMenuDiv.addEventListener('click', function() {
      //     console.log('ContextualMenu 被点击了！');
      // });

      // 注意：如果你只想在它第一次出现时执行一次，可以在这里停止监听
      // observer.disconnect();
      // console.log("MutationObserver 已停止监听。");

      const children = contextualMenuDiv.children

      // 遍历所有子元素
      for (let i = 0; i < children.length; i++) {
        const childElement = children[i]
        // 获取子元素的文本内容，并去除首尾空白字符进行比较
        const text = childElement.textContent.trim()

        if (text === "Diccionario") {
          childElement.textContent = "字典"
          childElement.style.width = "70px"
        } else if (text === "Compartir cita") {
          childElement.textContent = "分享"
          childElement.style.width = "70px"
        } else if (text === "Nota") {
          childElement.textContent = "🐵 AI 笔记"
          childElement.style.width = "110px"
          childElement.id = "btnAI" // 添加 ID 以便后续使用
        }
      }
    }

    // 1. 创建 MutationObserver 实例
    // 第一个参数是回调函数，当观察到变化时会被调用
    const observer = new MutationObserver(function (mutationsList, observer) {
      // 遍历所有观察到的变化
      for (let mutation of mutationsList) {
        // 检查是否有节点被添加
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          // 遍历新添加的节点
          for (let node of mutation.addedNodes) {
            // 确保是元素节点 (Node.ELEMENT_NODE)
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 检查新添加的节点本身是否是目标 div
              if (node.classList.contains("contextualMenu")) {
                handleContextualMenuAppeared(node)
                // 如果你想在找到一个就停止监听，可以在这里断开连接
                // observer.disconnect();
                // return; // 找到后退出循环和函数
              }
              // 或者，检查新添加的节点内是否包含目标 div (如果目标 div 是作为子元素添加的)
              // querySelectorAll 返回一个 NodeList，所以需要检查 length
              const foundElements = node.querySelectorAll(".contextualMenu")
              if (foundElements.length > 0) {
                foundElements.forEach((element) => {
                  handleContextualMenuAppeared(element)
                  // 如果你想在找到一个就停止监听，可以在这里断开连接
                  // observer.disconnect();
                  // return;
                })
              }
            }
          }
        }
      }
    })

    // 2. 配置 observer 选项
    const config = { childList: true, subtree: true }
    // 3. 开始观察 DOM 树
    observer.observe(document.body, config)
    console.log("MutationObserver 已开始监听 DOM 变化...")

    // 可以在这里添加一个可选的检查，以防目标元素在脚本运行之前就已存在（不常见，但保险起见）
    // 这通常会在 MutationObserver 启动后立即检查
    const existingMenu = document.querySelector(".contextualMenu")
    if (existingMenu) {
      console.log("ContextualMenu 在脚本启动时就已存在！")
      handleContextualMenuAppeared(existingMenu)
      // 如果只处理第一次出现，这里可以停止监听
      // observer.disconnect();
    }
  }

  /**
   * 模块5: 修改 编辑笔记对话框
   */
  {
    // 创建 MutationObserver 实例
    const observer1 = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.id === "div_nota_visor"
            ) {
              console.log("div_nota_visor 元素已找到！")

              // 先获取元素，后面使用
              const divNotaVisor = document.querySelector("#div_nota_visor")

              // 隐藏 citaNotaDiv
              {
                // 找到目标元素
                const citaNotaDiv = document.querySelector("div.cita_nota")

                if (citaNotaDiv) {
                  // 将 display 属性设置为 'none'
                  citaNotaDiv.style.display = "none"
                  console.log("cita_nota 元素已设置为 display: none (不可见)。")
                } else {
                  console.log("未找到 class='cita_nota' 的 div 元素。")
                }
              }

              // 隐藏 toolbarContainerDiv
              {
                // 找到目标元素
                const toolbarContainerDiv = document.querySelector(
                  "div.toolbar_container"
                )

                if (toolbarContainerDiv) {
                  // 将 display 属性设置为 'none'
                  toolbarContainerDiv.style.display = "none"
                  console.log(
                    "toolbar_container 元素已设置为 display: none (不可见)。"
                  )
                } else {
                  console.log("未找到 class='toolbar_container' 的 div 元素。")
                }
              }

              // 修改 editor_area editor_area_notas 样式
              {
                // 使用 CSS 选择器同时匹配两个类名
                const editorAreaDiv = document.querySelector(
                  "div.editor_area.editor_area_notas"
                )

                if (editorAreaDiv) {
                  console.log(
                    "找到 editor_area editor_area_notas 元素：",
                    editorAreaDiv
                  )

                  // --- 在这里重新设置你想要的样式 ---
                  editorAreaDiv.style.position = "static" // 移除绝对定位
                  editorAreaDiv.style.marginTop = "5px"
                  editorAreaDiv.style.marginBottom = "10px"
                  editorAreaDiv.style.height = "75%" // auto高度
                  editorAreaDiv.style.paddingBottom = "10px"
                  //editorAreaDiv.style.minHeight = '75%';     // 强制设置一个固定高度
                  editorAreaDiv.style.overflow = "auto" // 确保内容溢出时可以滚动
                  editorAreaDiv.style.border = "1px solid #4CAF50" // 添加一个绿色边框
                  editorAreaDiv.style.backgroundColor = "#f0fff0" // 浅绿色背景
                  editorAreaDiv.style.fontSize = "0.9em" // 设置字体大小

                  console.log(
                    "editor_area editor_area_notas 元素样式已重新设置。"
                  )
                } else {
                  console.log(
                    "未找到 class='editor_area editor_area_notas' 的元素。"
                  )
                }

                const selectors = [
                  "#div_nota_visor p",
                  "#continuous_editor p",
                  "div.editingPage p",
                ]

                selectors.forEach((selector) => {
                  // 获取所有匹配的元素
                  const elements = document.querySelectorAll(selector)
                  elements.forEach((element) => {
                    // 将背景颜色设置为透明，覆盖原有样式
                    element.style.backgroundColor = "transparent"
                  })
                })

                // 获取所有具有 'editor_area' 类的元素
                const editorAreas = document.querySelectorAll(".editor_area")

                // 遍历所有找到的元素并修改它们的样式
                editorAreas.forEach((element) => {
                  element.style.textAlign = "left"
                })
              }

              function getLocalDateTimeISO() {
                const now = new Date()
                const year = now.getFullYear()
                const month = String(now.getMonth() + 1).padStart(2, "0")
                const day = String(now.getDate()).padStart(2, "0")
                const hours = String(now.getHours()).padStart(2, "0")
                const minutes = String(now.getMinutes()).padStart(2, "0")
                const seconds = String(now.getSeconds()).padStart(2, "0")

                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
              }

              const targetElement = document.querySelector(
                "#div_nota_visor > div.div_section_top > div.editor_area.editor_area_notas > p"
              )

              const inputElement = document.querySelector("input.nota_title")

              if (targetElement && inputElement.value === "Titular nota") {
                // 尝试所有方法，发现android自带webview支持最好的是 visibility，但是还是会快闪
                // 奇数运行ok，偶数时会快闪，是内核webview的问题
                // 目标浏览器为 x浏览器，有这个问题
                // android firefox浏览器没有这个问题

                // 隐藏元素
                // divNotaVisor.style.display = "" // 隐藏 divNotaVisor
                // divNotaVisor.classList.toggle("hidden") // 隐藏 divNotaVisor
                // divNotaVisor.style.left = "-9999px" // 隐藏 divNotaVisor
                // divNotaVisor.style.opacity = "0" // 隐藏 divNotaVisor
                divNotaVisor.style.visibility = "hidden" // 隐藏 divNotaVisor

                // 修改标题，寻找 input title 元素
                // 如果找到，则设置其 value 属性为 剪切板文字
                if (inputElement) {
                  const notaTitle = GM_getValue("sharedText", "") // 从 GM_getValue 获取
                  inputElement.value = notaTitle
                }

                // 修改内部文本
                const timeStamp = getLocalDateTimeISO()
                const sentences = GM_getValue("sharedSentences", "") // 从 GM_getValue 获取

                const word = GM_getValue("sharedText", "") // 从 GM_getValue 获取
                const sentence = findSentence(sentences, word) // 查找独立句子

                const req = {
                  word: word,
                  sentence: sentence,
                }

                //////// 工具函数 根据单词查找独立句子
                function findSentence(text, word) {
                  // Split the text into sentences using common sentence endings.
                  const sentences = text.split(/[.¡!¿?]/)

                  for (const sentence of sentences) {
                    // Check if the current sentence includes the target word.
                    if (sentence.includes(word)) {
                      // Trim whitespace and add a period back for completeness.
                      return sentence.trim() + "."
                    }
                  }
                  // If no sentence containing the word is found, return null.
                  return null
                }

                //////// 工具函数，使用emoji替代圆圈数字
                function replaceCircleNumbers(text) {
                  // ① 单词翻译
                  // ② RAE西语释义原文
                  // ③ 句子翻译
                  // 不处理 ④ 句子语法及含义分析
                  const regex1 = /^①.*：/m
                  const regex2 = /^②.*：/m
                  const regex3 = /^③.*：/m
                  const regex4 = /^④.*：/m

                  text = text.replace(regex1, "🔴中文释义\n")
                  text = text.replace(regex2, "🟢RAE原文\n")
                  text = text.replace(regex3, "🔵句子翻译\n")
                  text = text.replace(regex4, "🟣语法分析\n")
                  return text
                }

                //////// 工具函数，处理 \n 转换为 <p>
                function replaceNewlinesWithParagraphs(text) {
                  // 检查输入是否为字符串，如果不是，直接返回空字符串
                  if (typeof text !== "string") {
                    return ""
                  }

                  // 使用 split('\n') 将文本按换行符分割成数组
                  // 现在我们只过滤掉完全为空的字符串，而不是空白字符的行
                  // 这样像 "  " 这种只有空格的行也会被包裹在 <p> 标签中
                  const paragraphs = text
                    .split("\n")
                    .map((line) => `<p>${line}</p>`) // 不再进行 filter，直接 map

                  return paragraphs.join("")
                }

                //////// 工具函数，转换 markdown 语法为 HTML
                function convertMarkdownBoldToHtml(text) {
                  // 检查输入是否为字符串，如果不是或为空，直接返回原始文本。
                  if (typeof text !== "string" || text === "") {
                    return text
                  }

                  // 使用正则表达式匹配 **...** 模式。
                  // 解释正则表达式：
                  // \*\* 匹配两个星号字面量
                  // (             开始捕获组 1
                  //   [^\*]+      匹配一个或多个非星号字符 (这是粗体内容的实际文本)
                  //   |           或者
                  //   \*(?!\*)    匹配单个星号，但后面不能跟着另一个星号 (处理像 **\*斜体\*** 的情况，虽然这里只关注粗体)
                  // )+            捕获组 1 匹配一个或多个这样的模式，确保能匹配到包含星号但在双星号内部的文本，例如 **a*b**
                  // \*\* 匹配结尾的两个星号字面量
                  // g             全局标志，表示查找所有匹配项，而不仅仅是第一个
                  // i             不区分大小写（虽然这里不是必须的，因为星号是区分大小写的，但有时在其他正则中会用到）

                  // 考虑到你的例子中，粗体内容不会包含星号，更简洁且准确的正则：
                  // /\*\*([^\*]+)\*\*/g
                  // \*\* 匹配字面量 "**"
                  // (            开始捕获组 1
                  //   [^\*]+     匹配一个或多个不是星号的字符 (这会是你的粗体内容)
                  // )            结束捕获组 1
                  // \*\* 匹配字面量 "**"
                  // g            全局标志，确保替换所有匹配项

                  // 最终选择的正则表达式：
                  const regex = /\*\*([^\*]+)\*\*/g

                  // 使用 replace 方法和捕获组来构建替换后的字符串。
                  // $1 代表正则表达式中第一个捕获组匹配到的内容（即 ** 之间的文本）。
                  return text.replace(regex, "<b>$1</b>")
                }

                //////// 工具函数 插入句子原文到AI内容之中
                function insertParagraphBeforeFourth(text, sentence) {
                  // 检查输入是否为字符串，如果不是或为空，直接返回原始文本
                  if (
                    typeof text !== "string" ||
                    typeof sentence !== "string" ||
                    text === ""
                  ) {
                    return text
                  }

                  // 定义要查找的模式
                  const targetPattern = "🔵句子翻译</p>"

                  // 定义要替换成的内容。使用模板字符串来插入变量 sentence。
                  // 注意：如果 sentence 本身包含 HTML 特殊字符（如 <, >, &），
                  // 在实际应用中可能需要对其进行 HTML 转义处理，以避免XSS或布局问题。
                  // 但根据你的需求，这里直接插入。
                  const replacement = `${targetPattern}<p>${sentence}</p>`

                  // 使用 replace() 方法进行替换。
                  // replace() 默认只替换第一次出现的匹配项。
                  // 如果你需要替换所有出现的 "<p>④"，可以使用正则表达式 with global flag (g)。
                  // 例如：text.replace(/<p>④/g, replacement);
                  // 但根据你的示例，它似乎是针对特定位置的。
                  return text.replace(targetPattern, replacement)
                }

                //////// 工具函数，给带彩色点p段落添加class
                function addPWithColorDotClass(text) {
                  text = text.replace(/<p>🔴/m, '<p class="pWithColorDot">🔴')
                  text = text.replace(/<p>🟢/m, '<p class="pWithColorDot">🟢')
                  text = text.replace(/<p>🔵/m, '<p class="pWithColorDot">🔵')
                  text = text.replace(/<p>🟣/m, '<p class="pWithColorDot">🟣')
                  return text
                }

                //////// fetch API from Cloudflare Worker
                function fetchAI(req) {
                  // 定义请求的 URL "https://w1.chaosrecyclebin.workers.dev/analyze"
                  const url = "https://w1.860102.xyz/analyze"

                  // 定义请求体
                  const requestBody = req

                  // 使用 fetch API 发送 POST 请求
                  fetch(url, {
                    method: "POST", // 指定请求方法为 POST
                    headers: {
                      "Content-Type": "application/json", // 告诉服务器我们发送的是 JSON 数据
                    },
                    body: JSON.stringify(requestBody), // 将 JavaScript 对象转换为 JSON 字符串
                  })
                    .then((response) => {
                      // 检查响应是否成功 (HTTP 状态码 200-299)
                      if (!response.ok) {
                        throw new Error(
                          `HTTP error! status: ${response.status}`
                        )
                      }
                      return response.json() // 解析 JSON 响应
                    })
                    .then((data) => {
                      // 处理响应数据
                      let res = data.analysis.response
                      // 处理res
                      res = replaceCircleNumbers(res)
                      res = replaceNewlinesWithParagraphs(res)
                      res = insertParagraphBeforeFourth(res, sentence)
                      res = convertMarkdownBoldToHtml(res)
                      res = addPWithColorDotClass(res)

                      console.log("Success:", data)
                      // return data
                      targetElement.innerHTML = `<p id="pTimeStamp">${timeStamp}</p>
                      <p></p>
                      <p></p>
                      <p>${res}</p>
                      `

                      // 显示 divNotaVisor
                      // divNotaVisor.style.display = "block"
                      // divNotaVisor.classList.toggle("hidden") // 显示 divNotaVisor
                      // divNotaVisor.style.left = "0px" // 显示 divNotaVisor
                      // divNotaVisor.style.opacity = "1" // 显示 divNotaVisor
                      divNotaVisor.style.visibility = "visible" // 显示 divNotaVisor
                    })
                    .catch((error) => {
                      // 捕获并处理请求过程中可能出现的错误
                      console.error("Error:", error)
                      alert("POST 请求失败，请查看控制台输出错误信息！")
                    })
                }

                fetchAI(req)

                console.log("元素文本已修改！")
              } else {
                console.log("未找到目标元素！")
              }

              const btnSalvar = document.querySelector(".btn_salvar")

              if (btnSalvar) {
                console.log("找到 btn_salvar 元素：", btnSalvar) // 在这里可以对找到的元素执行操作

                // btnSalvar.click()
              } else {
                console.log("未找到 btn_salvar 元素")
              }
            }
          })
        }
      })
    })

    // 配置观察选项
    const config1 = { childList: true, subtree: true }
    observer1.observe(document.body, config1)
    console.log("开始监测 div_nota_visor 元素...")
  }

  /**
   * 模块6: 点击 .boxViewerTXT 元素，获取p元素所有句子文本，存入 GM_setValue
   */
  {
    // 创建 MutationObserver 实例
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.classList.contains("boxViewerTXT")
            ) {
              console.log(".boxViewerTXT 元素已找到！")

              node.addEventListener("contextmenu", function (event) {
                // 检查点击事件的目标是否是P元素，或者P元素的子元素
                // event.target 是实际被点击的元素
                // .closest() 方法会从当前元素开始，向上查找最近的符合选择器的祖先元素（包括元素自身）
                const clickedP = event.target.closest("p")

                if (clickedP) {
                  // 确保 clickedP 是父元素 .boxViewerTXT 下的 P 元素
                  // 避免点击到其他地方的P元素也被触发
                  if (node.contains(clickedP)) {
                    let sentences = clickedP.textContent.trim()
                    console.log("contextmenu的P元素文本：", sentences)
                    GM_setValue("sharedSentences", sentences) // 存储到 GM_setValue
                  }
                }
              })

              node.addEventListener("touchend", function (event) {
                // 检查点击事件的目标是否是P元素，或者P元素的子元素
                // event.target 是实际被点击的元素
                // .closest() 方法会从当前元素开始，向上查找最近的符合选择器的祖先元素（包括元素自身）
                const clickedP = event.target.closest("p")

                if (clickedP) {
                  // 确保 clickedP 是父元素 .boxViewerTXT 下的 P 元素
                  // 避免点击到其他地方的P元素也被触发
                  if (node.contains(clickedP)) {
                    let sentences = clickedP.textContent.trim()
                    console.log("touchend的P元素文本：", sentences)
                    GM_setValue("sharedSentences", sentences) // 存储到 GM_setValue
                  }
                }
              })

              node.addEventListener("mouseup", function (event) {
                // 检查点击事件的目标是否是P元素，或者P元素的子元素
                // event.target 是实际被点击的元素
                // .closest() 方法会从当前元素开始，向上查找最近的符合选择器的祖先元素（包括元素自身）
                const clickedP = event.target.closest("p")

                if (clickedP) {
                  // 确保 clickedP 是父元素 .boxViewerTXT 下的 P 元素
                  // 避免点击到其他地方的P元素也被触发
                  if (node.contains(clickedP)) {
                    let sentences = clickedP.textContent.trim()
                    console.log("mouseup的P元素文本：", sentences)
                    GM_setValue("sharedSentences", sentences) // 存储到 GM_setValue
                  }
                }
              })

              node.addEventListener("click", function (event) {
                // 检查点击事件的目标是否是P元素，或者P元素的子元素
                // event.target 是实际被点击的元素
                // .closest() 方法会从当前元素开始，向上查找最近的符合选择器的祖先元素（包括元素自身）
                const clickedP = event.target.closest("p")

                if (clickedP) {
                  // 确保 clickedP 是父元素 .boxViewerTXT 下的 P 元素
                  // 避免点击到其他地方的P元素也被触发
                  if (node.contains(clickedP)) {
                    let sentences = clickedP.textContent.trim()
                    console.log("click的P元素文本：", sentences)
                    GM_setValue("sharedSentences", sentences) // 存储到 GM_setValue
                  }
                }
              })
            }
          })
        }
      })
    })

    // 配置观察选项
    const config = { childList: true, subtree: true } // 开始观察目标元素
    observer.observe(document.body, config)
    console.log("开始监测 .boxViewerTXT 元素...")
  }

  /**
   * 模块7: 点击 查看笔记文字，可以关闭笔记
   */
  {
    // 创建 MutationObserver 实例 (observer2)
    const observer2 = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.classList.contains("modalViewerLT")
            ) {
              console.log("modalViewerLT 元素已出现！")

              // 找到 div 元素
              const closeModalViewerDiv = document.querySelector(
                "div.closeModalViewer"
              )

              // const toolDeleteElement = document.querySelector('.tool_delete');

              // 立即点击关闭
              // closeModalViewerDiv.click()

              // 定义点击事件处理函数
              function handleClick() {
                console.log("closeModalViewer 被点击了！")
                // 在这里添加你想要执行的操作
                closeModalViewerDiv.click()
              }

              // 找到 noteSignatureDiv 元素
              const noteSignatureDiv =
                document.querySelector("div.note_signature")
              // 找到 divNoteSignature 元素
              const contentHtmlDiv = document.querySelector("div.contentHtml")
              // 如果找到 noteSignatureDiv ，则 contentHtmlDiv 添加点击事件监听器
              if (noteSignatureDiv) {
                contentHtmlDiv.addEventListener("click", handleClick)
                console.log("点击事件监听器已添加。")
              } else {
                console.log("未找到 contentHtml div 元素。")
              }

              // 如果只需要执行一次，可以取消观察
              // observer2.disconnect();
            }
          })
        }
      })
    })

    // 配置观察选项 (config2)
    const config2 = { childList: true, subtree: true }
    observer2.observe(document.body, config2)
  }

  /**
   * 模块8: 最终实现搜索功能，规避webview的bug问题
   */
  {
    const TARGET_ICON_CLASS = "boxSearch book_icon" // 目标图标的类名
    const VIEWER_TXT_CLASS = "boxViewerTXT" // 文本阅读区域的类名
    const CUSTOM_INPUT_ID = "myCenteredSearchInput" // 自定义搜索框的ID

    let myInput = null // 用于存储自定义搜索框元素
    let isInputVisible = false // 追踪自定义搜索框的显示状态

    /**
     * 创建并居中自定义搜索框。
     * 只在第一次调用时创建，后续调用只控制显示/隐藏。
     */
    function createOrToggleCenteredInput() {
      if (!myInput) {
        // 创建新的 input 元素
        myInput = document.createElement("input")
        myInput.id = CUSTOM_INPUT_ID
        myInput.type = "text"
        myInput.placeholder = "搜索..."
        myInput.style.padding = "10px 15px"
        myInput.style.border = "2px solid #0873f561"
        myInput.style.borderRadius = "5px"
        myInput.style.fontSize = "16px"
        myInput.style.outline = "none"
        myInput.style.boxShadow = "#0096facf 2px 3px 5px"
        myInput.style.width = "75%"
        myInput.setAttribute("autocomplete", "off") // 禁用自动完成功能

        // 设置样式实现居中定位
        myInput.style.position = "fixed"
        myInput.style.top = "50%"
        myInput.style.left = "50%"
        myInput.style.transform = "translate(-50%, -50%)"
        myInput.style.zIndex = "9999" // 确保在最上层
        myInput.style.display = "none" // 初始状态隐藏

        // 将自定义输入框添加到页面
        document.body.appendChild(myInput)

        console.log("自定义居中搜索框已创建。")

        // 绑定自定义搜索框的回车事件 (为了完整性，这里保留之前的代理逻辑)
        myInput.addEventListener("keyup", function (event) {
          if (event.key === "Enter") {
            event.preventDefault() // 阻止自定义输入框的默认回车行为

            const targetInput = document.querySelector(".boxSearchInput") // 目标搜索框

            if (targetInput) {
              targetInput.value = myInput.value
              const enterEvent = new KeyboardEvent("keyup", {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
              })
              targetInput.dispatchEvent(enterEvent)
              console.log(`值 "${myInput.value}" 已赋给目标搜索框并模拟回车。`)
              // 搜索后隐藏自定义搜索框
              toggleCenteredInputVisibility(false)
            } else {
              console.warn("未找到目标搜索框 .boxSearchInput，无法代理功能。")
            }
          }
        })
      }

      // 切换显示状态
      toggleCenteredInputVisibility(!isInputVisible)
    }

    /**
     * 控制自定义搜索框的显示/隐藏。
     * @param {boolean} show - true 为显示，false 为隐藏
     */
    function toggleCenteredInputVisibility(show) {
      if (myInput) {
        myInput.style.display = show ? "block" : "none"
        isInputVisible = show
        if (show) {
          myInput.focus() // 显示时自动聚焦
        } else {
          myInput.blur() // 隐藏时失去焦点
        }
        console.log(`自定义搜索框已${show ? "显示" : "隐藏"}`)
      }
    }

    /**
     * 为目标图标绑定点击事件，并阻止默认行为。
     * @param {HTMLElement} iconElement - 目标图标元素
     */
    function bindIconClickEvent(iconElement) {
      // 检查是否已经绑定过事件，避免重复绑定
      if (iconElement.dataset.customEventBound) {
        return
      }

      console.log("目标图标已出现，绑定点击事件:", iconElement)

      iconElement.addEventListener(
        "click",
        function (event) {
          console.log("boxSearch book_icon 元素被点击了！")

          // 劫持：阻止事件冒泡和默认行为
          event.stopPropagation() // 阻止事件向上冒泡到父元素
          event.preventDefault() // 阻止元素的任何默认行为

          // 执行我们自己的逻辑：切换页面中央搜索框的显示状态
          createOrToggleCenteredInput()
        },
        true
      ) // 使用 true 使事件在捕获阶段触发，以尽早劫持事件

      // 标记该元素已经绑定了事件
      iconElement.dataset.customEventBound = "true"
    }

    // --- 优化后的功能：点击 body 隐藏中心搜索框 ---
    document.body.addEventListener(
      "click",
      function (event) {
        // 如果自定义搜索框当前可见
        if (isInputVisible) {
          // 检查点击事件的目标是否是自定义搜索框本身，或者它的子元素
          const clickedOnInput = myInput && myInput.contains(event.target)

          // 检查点击事件的目标是否是触发搜索框显示的图标
          const targetIcons = document.querySelectorAll(
            `.${TARGET_ICON_CLASS.replace(/ /g, ".")}`
          )
          let clickedOnIcon = false
          for (const icon of targetIcons) {
            if (icon.contains(event.target)) {
              clickedOnIcon = true
              break
            }
          }

          // 如果点击的不是自定义搜索框，也不是触发它的图标，则隐藏
          if (!clickedOnInput && !clickedOnIcon) {
            console.log("点击了非搜索框/图标区域，隐藏中心搜索框。")
            toggleCenteredInputVisibility(false)
          }
        }
      },
      false
    ) // 在冒泡阶段监听，允许子元素的事件先被处理

    // --- 添加 popstate 事件监听器以隐藏搜索框 ---
    // 这里使用 window 对象来监听 popstate 事件
    window.addEventListener("popstate", function (event) {
      console.log("popstate 事件触发，尝试隐藏搜索框。")
      // 无论搜索框当前是否可见，都尝试隐藏它
      toggleCenteredInputVisibility(false)
    })

    // MutationObserver 回调函数
    const observerCallback = function (mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          // 监控元素添加 (出现)
          mutation.addedNodes.forEach((node) => {
            // 检查目标图标
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.classList.contains("boxSearch") &&
              node.classList.contains("book_icon")
            ) {
              bindIconClickEvent(node)
            }
            // 如果整个父容器被添加，检查其内部是否包含目标图标
            if (node.nodeType === Node.ELEMENT_NODE) {
              node
                .querySelectorAll(`.${TARGET_ICON_CLASS.replace(/ /g, ".")}`)
                .forEach((icon) => bindIconClickEvent(icon))
            }
          })
        }
        // 监控属性变化 (例如，类名添加或移除 'activated')
        else if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const target = mutation.target
          if (target.nodeType === Node.ELEMENT_NODE) {
            // 检查目标图标
            if (
              target.classList.contains("boxSearch") &&
              target.classList.contains("book_icon")
            ) {
              bindIconClickEvent(target)
            }
          }
        }
      }
    }

    // 创建并配置 MutationObserver
    const observer = new MutationObserver(observerCallback)
    const observerConfig = {
      childList: true, // 观察子节点的添加或移除
      subtree: true, // 观察所有后代节点的变化
      attributes: true, // 观察属性的变化
      attributeFilter: ["class"], // 只观察 class 属性的变化
    }

    // 启动观察器，从 <body> 元素开始观察
    observer.observe(document.body, observerConfig)

    // 初始检查：在脚本加载时，检查页面中是否已经存在目标图标
    document
      .querySelectorAll(`.${TARGET_ICON_CLASS.replace(/ /g, ".")}`)
      .forEach((icon) => bindIconClickEvent(icon))

    console.log("油猴脚本已启动，监控目标图标。")
  }
})()
