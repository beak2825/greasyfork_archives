// ==UserScript==
// @name         冲浪助手
// @namespace    https://github.com/Shadow-blank/net-tools
// @version      0.2.4
// @description  你是GG还是MM啊, NGA下载帖子图片, 不再拦截QQ群中链接
// @author       Shadow-blank
// @match        *://m.weibo.cn/status/*
// @match        *://www.comicat.org/*
// @match        *://*.comicat.net/*
// @match        *://dick.xfani.com/*
// @match        *://live.bilibili.com/*
// @match        *://www.bilibili.com/*
// @match        *://ngabbs.com/read.php*
// @match        *://nga.178.com/read.php*
// @match        *://bbs.nga.cn/read.php*
// @match        *://c.pc.qq.com/middlem.html*
// @match        *://tieba.baidu.com/mo/q/posts?*
// @icon         https://raw.githubusercontent.com/Shadow-blank/net-tools/main/favicon.ico
// @require      https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      img.nga.178.com
// @connect      img4.nga.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459996/%E5%86%B2%E6%B5%AA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/459996/%E5%86%B2%E6%B5%AA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict'
  // 创建style标签
  const createStyle = str => $('body').append(`<style>${str}</style>`)

  let data = null

  const defaultCheck = ['m.weibo.cn', 'comicat.net', 'dick.xfani.com', 'live.bilibili.com', 'www.bilibili.com', 'nga', 'qq', 'baidu']

  const download = (blob, filename) => {
    const blobUrl = typeof blob === 'string' ? blob : window.URL.createObjectURL(blob);
    // 这里的文件名根据实际情况从响应头或者url里获取
    const a = document.createElement('a');
    a.href = blobUrl;
    a.target = 'block'
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(blobUrl);
  }

  const module = {
    weibo: {
      name: '微博',
      children: [
        {
          key: 'm.weibo.cn',
          name: '移动端页面自动跳转到PC页面 屏幕宽度小于980不跳转',
          run() {
            if (window.screen.width > 980) {
              setTimeout(() => {
                const userId = document.querySelector('.m-img-box').href.split('/')[4]
                const id = location.pathname.split('/')[2]
                location.href = `https://weibo.com/${userId}/${id}`
              }, 500)
            }
          }
        }
      ]
    },
    comicat: {
      name: '漫猫',
      children: [
        {
          key: 'comicat.net',
          name: '下载按钮位置上升',
          run() {
            if (!location.pathname.includes('/show-')) {
              createStyle(`
                table tbody tr td:nth-child(6) {cursor: pointer; user-select: none;}
                table tbody tr td:nth-child(6) span:after {
                  content: url("data:image/svg+xml,%3csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='13' height='13' %3e%3cpath  d='M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64zm384-253.696 236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64v450.304z'/%3e%3c/svg%3e");
                  display: inline-block;margin-left: 10px; color: #606266;}`
              )
              document.querySelector('#data_list').addEventListener('click', e => {
                if (e.target.classList.value.includes('btl')) {
                  const magnet = /show-([a-z0-9]+)/.exec(e.target.parentElement.parentElement.innerHTML)[1]
                  const href = `magnet:?xt=urn:btih:${magnet}&tr=http://open.acgtracker.com:1096/announce`
                  download(href)
                }
              })
            } else {
              const downEle = document.querySelector('#box_download')
              downEle.parentElement.insertBefore(downEle, downEle.parentElement.firstElementChild)
            }
          }
        }
      ]
    },
    xfani: {
      name: '稀饭',
      children: [
        {
          key: 'dick.xfani.com',
          name: '取消右键限制',
          run() {
            ['contextmenu', 'click', 'mousedown', 'mouseup', 'selectstart'].forEach(item => clearEvent(item))

            function clearEvent(type) {
              const onType = 'on' + type
              document[onType] = null
              document.body && (document.body[onType] = null)
            }
          }
        }
      ]
    },
    bilibili: {
      name: 'B站',
      children: [
        {
          key: 'www.bilibili.com',
          name: '去除首页轮播图 只保留番剧和推荐',
          run() {
            createStyle(`
          .bili-layout > .bili-grid, .recommended-swipe, .eva-banner, .bili-vote {display: none!important;}
          .bili-video-card.is-rcmd, .bili-layout > .bili-grid:nth-child(9), .bili-layout >.bili-grid:nth-child(1) {display: block!important;} `)
          }
        },
        {
          key: 'live.bilibili.com',
          name: '直播页面去掉广告 只显示直播',
          run() {
            let timer = ''
            // 推广直播页面进入原始页面
            timer = setInterval(() => {
              const iframe = document.querySelector('#app iframe')
              if (iframe?.src.includes('/blanc/')) {
                clearInterval(timer)
                location.href = iframe.src.split('?')[0]
              }
            }, 100)
            // 将直播画面居中显示
            createStyle(`
                      .live-room-app.p-relative{overflow: hidden}
                      .main {padding: 0px}
                      .player-ctnr.left-container.p-relative.z-player-ctnr{ width: 100%;  margin: 10px auto}
                      .live-room-app .app-content{padding-top: 0;}
                      .live-room-app .app-content .app-body {width: 100%;}
                       #iframe-popup-area, #aside-area-vm, #head-info-vm, #gift-control-vm, #sections-vm, #link-footer-vm, #sidebar-vm, #room-ssr-vm, .super-gift-bubbles {display:none}
                      section{margin: 0}`)
          }
        }
      ]
    },
    nga: {
      name: 'NGA',
      children: [
        {
          key: 'nga',
          name: '下载图片',
          run() {
            let href = location.href

            setInterval(() => {
              const flag = hasTid() && !document.querySelector('#downAllImage')
              if (flag) initNGA()
            }, 1000)

            function initNGA() {
              if (!hasTid()) return

              clearAdv()

              if (!href.includes('page=')) href += `&page=${1}`

              let str = `
                <a class="nav_link" id="downAllImage" href="javascript:void(0)"> 图片下载 </a>
                <!--<a class= "nav_link" id="downDoc" href = "javascript:void(0)"> 保存此贴 </a>-->
              `
              if (document.querySelector('.nav_spr')) {
                str = `<span class="nav_spr">&emsp;<span>»</span></span>` + str
              }

              setTimeout(() => {
                $('#topNavAnchor').prev().before(str)

                $('#downAllImage').click(() => {
                  down()
                })
                $('#downDoc').click(() => {
                  down(1)
                })
              }, 100)

            }

            /**
             * 下载
             * @param downType 默认是图片 1是帖子
             */
            function down(downType = 0) {
              Promise.all([getDocument(), addScript()])
                .then(([strArr]) => {
                  let zip = new JSZip()
                  const promiseArr = []
                  switch (downType) {
                    case 0:
                      promiseArr.push(downImage(getImage(strArr), zip))
                      break
                    case 1:
                      break
                  }
                  Promise.all(promiseArr).then(() => {
                    zip.generateAsync({type: 'blob'}).then(function (content) {
                      saveAs(content, `${document.querySelector('.x').innerText}.zip`);
                    });
                  })
                })
            }

            function getDocument(currentPage = 1, documentArr = []) {
              return new Promise(resolve => {
                $('#downAllImage').text(`获取文档中..., 第${currentPage}页`)
                $.get(href.replace(/page=[0-9]+/g, `page=${currentPage}`), str => {
                  documentArr.push(str)
                  if (isLastPage(str, currentPage)) {
                    resolve(documentArr)
                  } else {
                    getDocument(currentPage + 1, documentArr).then(resolve)
                  }
                })
              })
            }

            function isLastPage(str, currentPage) {
              // 最后一页 只有currentPage - 1 没有currentPage + 1
              return !str.includes(`page=${currentPage + 1}`)
            }

            function getImage(strArr) {
              return [...new Set(strArr.reduce((prev, curr) => prev.concat(...[...curr.matchAll(/<table[\W\w]*?table>/g)].map(([item]) => [...item.matchAll(/\[img\]+\.?([^\[]+)\[\/img\]/g) || []].map(item => item[1]))), []))]
            }

            function downImage(arr, zip) {
              if (!arr.length) alert('此贴无图片可供下载')
              let i = 0
              const promiseArr = arr.map(item => new Promise((resolve) => {
                let url = item
                if (!item.includes('http')) {
                  // 有些图片会自带http 不确定是否全部是表情
                  item = item.replace('.medium.jpg', '')
                  url = `https://${__ATTACH_BASE_VIEW_SEC}/attachments${item}`
                }
                requestImg(url).then(data => {
                  zip.file(`img/${item.replace(/\//g, '')}`, data)
                  resolve()
                  $('#downAllImage').text(++i === arr.length ? '图片下载' : `${i}/${arr.length}`)
                })
              }))
              return Promise.all(promiseArr)
            }

            function requestImg(url, isRepeat = 0) {
              return new Promise((resolve) => {
                GM_xmlhttpRequest({
                  method: 'GET',
                  responseType: 'blob',
                  url,
                  onload(e) {
                    if (e.status === 200) {
                      resolve(e.response)
                    } else {
                      if (isRepeat === 10) {
                        resolve('')
                      } else {
                        requestImg(url, ++isRepeat).then(data => {
                          resolve(data)
                        })
                      }
                    }
                  },
                  onerror(e) {
                    console.log(e)
                    resolve('')
                  }
                })
              })
            }

            function clearAdv() {
              setTimeout(() => {
                document.querySelectorAll('img[onload^="__INSECTOB"]').forEach(item => {
                  item.parentElement.parentElement.remove()
                })
              }, 200)
            }

            function addScript() {
              return new Promise((resolve) => {
                if (window.JSZip && window.saveAs) {
                  resolve()
                } else {
                  let i = 0

                  function onload() {
                    i++
                    if (i === 2) {
                      i = null
                      resolve()
                    }
                  }

                  $('body').append(`
                    <script id="jszip" src="https://cdn.staticfile.org/jszip/3.10.1/jszip.min.js" ></script>
                    <script id="FileSaver" src="https://cdn.staticfile.org/FileSaver.js/2.0.5/FileSaver.min.js"></script>
                  `)
                  $('#jszip').ready(onload)
                  $('#FileSaver').ready(onload)
                }
              })
            }

            function hasTid() {
              return __CURRENT_TID || Object.fromEntries(new URLSearchParams(location.search)).tid
            }
          }
        }
      ]
    },
    qq: {
      name: 'qq',
      children: [
        {
          key: 'qq',
          name: 'qq群网站自动跳转',
          run() {
            location.href = document.querySelector('#url').innerText
          }
        }
      ]
    },
    baidu: {
      name: '百度',
      children: [
        {
          key: 'baidu',
          name: '手机跳转PC',
          run() {
            location.href = `${location.origin}/p/${Object.fromEntries(new URLSearchParams(location.search)).tid}`
          }
        }
      ]
    }
  }

  // 初始化控制面板
  const controlPanel = {
    status: 0, //0 不存在 1存在
    show() {
      $('#control-panel').css('display', 'block')
    },
    hidden() {
      $('#control-panel').css('display', 'none')
    },
    save() {

    }
  }

  // GM_registerMenuCommand('控制面板', initControlPanel)

  const initData = () => {
    let value = JSON.parse(localStorage.getItem('netToolsData'))
    if (!value) {
      value = {
        checked: getDefaultCheckValue()
      }
    }
    data = value

    function getDefaultCheckValue() {
      const result = []
      for (const key in module) {
        const children = module[key].children.map(item => ({
          name: item.name,
          key: item.key
        }))
        const value = defaultCheck.filter(value => children.find(item => item.key === value))
        result.push({
          name: module[key].name,
          key,
          children,
          value
        })
      }
      return result
    }
  }

  function initModule() {
    const host = location.host

    data.checked.forEach(item => {
      const {children, value, key} = item
      if (host.includes(key) && value.length) {
        const currData = children.find(item => host.includes(item.key) && value.includes(item.key)) || {}
        const currentModule = module[key].children.find(item => item.key === currData.key)
        return currentModule && setTimeout(currentModule.run, 100)
      }
    })
  }

  function initControlPanel() {
    const control = createControlPanel()


    const style = `
      <style>
        #control-panel{
          display: none;
          padding: 15px;
          position: fixed;
          top: 50%;
          left: 50%;
          background: white;
          transform: translate(-50%, -50%);
          z-index: 99999;
          box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
          border-radius: 4px;
          color: #606266
        }
        .control-panel-save{
          margin-top: 20px;
          float: right;
          line-height: 1;
          height: 32px;
          cursor: pointer;
          color: #ffffff;
          text-align: center;
          box-sizing: border-box;
          outline: none;
          transition: .1s;
          font-weight: 500;
          user-select: none;
          background-color: #409eff;
          border: 1px solid #409eff;
          padding: 8px 15px;
          font-size: 14px;
          border-radius: 4px;
        }
        .control-panel-save:hover{
          border-color: #79bbff;
          background-color: #79bbff;
        }

        .control-panel-close{
          width: 21px;
          cursor: pointer;
          float: right;
          color: #606266;
        }

        .el-checkbox {
          color: #606266;
          font-weight: 500;
          font-size: 14px;
          position: relative;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          user-select: none;
          margin-right: 30px;
          height: 32px;
        }

          .el-checkbox__input {
            white-space: nowrap;
            cursor: pointer;
            outline: none;
            display: inline-flex;
            position: relative;
          }
          .el-checkbox__original {
            opacity: 0;
            outline: none;
            position: absolute;
            margin: 0;
            width: 0;
            height: 0;
            z-index: -1;
          }
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: #409eff;
            border-color: #409eff;
         }

          .el-checkbox__inner {
            display: inline-block;
            position: relative;
            border: 1px solid #dcdfe6;
            border-radius: 2px;
            box-sizing: border-box;
            width: 14px;
            height: 14px;
            z-index: 1;
            transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46),outline .25s cubic-bezier(.71,-.46,.29,1.46);
          }

          .el-checkbox__input.is-checked .el-checkbox__inner:after {
            transform: rotate(45deg) scaleY(1);
        }

        .el-checkbox__inner:after {
            box-sizing: content-box;
            content: "";
            border: 1px solid #fff;
            border-left: 0;
            border-top: 0;
            height: 7px;
            left: 4px;
            position: absolute;
            top: 1px;
            transform: rotate(45deg) scaleY(0);
            width: 3px;
            transition: transform .15s ease-in .05s;
            transform-origin: center;
        }

          .el-checkbox__input.is-checked+.el-checkbox__label {
              color: #409eff;
          }

        .el-checkbox__label {
            display: inline-block;
            padding-left: 8px;
            line-height: 1;
            font-size: 14px;
        }
      </style>`
    $('body').append(control).append(style)

    $('.control-panel-close').click(controlPanel.hidden)
    $('.control-panel-save').click(controlPanel.save)
    $('#control-panel .select-wrap').click(e => {
      const ele = e.originalEvent.target
      if (ele.type === 'checkbox') {
        ele.parentElement.classList.toggle('is-checked')
        ele.parentElement.nextElementSibling.classList.toggle('is-checked')
        const labelClassList = ele.parentElement.parentElement.classList
        for (let i = 0; i < data.checked.length; i++) {
          const selectKey = ele.dataset.key
          const {key, value} = data.checked[i]
          if (selectKey.includes(key)) {
            const index = value.findIndex(item => item === selectKey)
            if (index > 0) {
              value.splice(index, 1)
              labelClassList.remove('is-checked')
            } else {
              value.push(selectKey)
              // if (value.length === length) {
              //   labelClassList.add('is-checked')
              // }
            }
          }
        }
      }
    })
    controlPanel.status = 1
    controlPanel.show()

    function createControlPanel() {
      const menu = []
      for (const key in module) {
        menu.push({
          name: module[key].name,
          key: key,
          children: module[key].children.map(item => ({name: item.name, key: item.key}))
        })
      }

      return (`
        <div id="control-panel">
          <div class="control-panel-close">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
               <path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path>
            </svg>
          </div>
          <div class="select-wrap">
            ${createSelect()}
          </div>
           <div class="control-panel-save">保存</div>
        </div>
      `)
    }

    function createSelect() {
      return data.checked.map(item =>
        `<div>
          ${getCheck(item, item.value.length === item.children.length, 0)}
          </br>
          ${item.children.map(_item => getCheck(_item, item.value.includes(_item.key), 1)).join('')}
       </div>`
      ).join('')
    }

    function getCheck(item, checked, level) {
      return `
        <label class="el-checkbox"  style="padding-left: ${18 * level}px;">
          <span class="el-checkbox__input${checked ? ' is-checked' : ''}" >
            <input class="el-checkbox__original" type="checkbox" data-key="${item.key}">
            <span class="el-checkbox__inner""></span>
          </span>
          <span class="el-checkbox__label" data-key="${item.key}">${item.name}</span>
        </label>
      `
    }
  }

  ;(function () {
    initData()
    initModule()
  })()
})()
