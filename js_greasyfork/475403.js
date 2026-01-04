// ==UserScript==
// @name         Workflowy 图片视频播客预览
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Add image preview, embed videos & extend Workflowy
// @author       Namkit
// @match        https://workflowy.com/*
// @grant        none
// @require      http://libs.baidu.com/jquery/2.1.3/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.js
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/475403/Workflowy%20%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91%E6%92%AD%E5%AE%A2%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/475403/Workflowy%20%E5%9B%BE%E7%89%87%E8%A7%86%E9%A2%91%E6%92%AD%E5%AE%A2%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==
 
;(function () {
  'use strict'
 
  const embedConfigs = [
    {
      name: 'xiaoyuzhou',
      regex: /www\.xiaoyuzhoufm\.com/,
      embedUrl: '$&', // 使用原始链接作为 embedUrl
    },
    {
      name: 'bilibili',
      regex: [
        /https?:\/\/(www\.)?bilibili\.com\/video\/(BV[\w]+)\//i,
        /https?:\/\/(b23\.)?tv\/(BV[\w]+)/i,
        /https?:\/\/(www\.)?bilibili\.com\/video\/(av[\d]+)\//i,
      ],
      embedUrl: '//player.bilibili.com/player.html?bvid=$2&high_quality=1&autoplay=0',
    },
  ]
 
  const imageRegex =
    /(https?:\/\/[^\s]+?(?:\.(?:jpg|jpeg|png|gif|svg|webp))|(?:.+&)?f=(?:JPEG|PNG|GIF|SVG|WEBP)|[^\s]+mmbiz_png.+wx_fmt=(?:JPEG|PNG|GIF|SVG|WEBP)|[^\s]+webp|\/[^\s]+?\.(?:jpg|jpeg|png|gif|svg|webp)|[^\s]+?\.(?:jpg|jpeg|png|gif|svg|webp)|[^\s]+\/photo\/[^\s]+|[^\s]+\/media\/[^\s]+)/i
 
  $(document.body).append(
    '<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css" rel="stylesheet">',
  )
 
  function createImagePreview(linkElem, imageUrl) {
    insertAfter(linkElem, document.createElement('br'))
 
    const container = document.createElement('div')
    container.id = 'id' + Math.random().toString().replace('.', '')
    container.style.cssText = `
      height: 60vh;
      display: flex;
      justify-content: left;
      align-items: center;
      margin-top: 8px;
      opacity: 1;
    `
 
    const previewImage = document.createElement('img')
    previewImage.src = imageUrl
    previewImage.style.cssText = `
      max-width: 100%;
      max-height: 100%;
      height: fit-content;
      object-fit: contain;
      object-position: center;
    `
    // 点击图片预览
    previewImage.addEventListener('click', (e) => {
       // 使用Layer.js显示预览图像
      // layer弹层组件开发文档 - Layui https://www.layuiweb.com/doc/modules/layer.html#shadeClose
      layer.photos({
        photos: '#' + e.target.parentNode.id,
        tab: () => {
          window.onmousewheel = document.onmousewheel = function (e) {
            var imagep = $('.layui-layer-phimg').parent().parent()
            var image = $('.layui-layer-phimg').parent()
            var h = image.height()
            var w = image.width()
            if (e.wheelDelta < 0) {
              //鼠标下滑事件
              if (h > 100) {
                h = h * 0.95
                w = w * 0.95
              }
            }
            if (e.wheelDelta > 0) {
              //鼠标上滑事件
              if (h < window.innerHeight) {
                h = h * 1.05
                w = w * 1.05
              }
            }
            imagep.css('top', (window.innerHeight - h) / 2)
            imagep.css('left', (window.innerWidth - w) / 2)
            image.height(h)
            image.width(w)
            imagep.height(h)
            imagep.width(w)
          }
        },
      })
    })
 
    container.appendChild(previewImage)
    insertAfter(linkElem, container)
 
    return previewImage
  }
  // 插入元素
  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
  }
  // 创建 iframe
  function appendEmbedIframe(linkElem, embedUrl, width = 560, height = 315) {
    const iframe = document.createElement('iframe')
    iframe.src = embedUrl
    iframe.width = width
    iframe.height = height
    iframe.style.border = '0'
    iframe.style.display = 'block'
    iframe.allowTransparency = 'true'
 
    insertAfter(linkElem, iframe)
  }
  // 处理图片链接
  function processImageLink(linkElem) {
    const match = linkElem.href.match(imageRegex)
    if (match) {
      const imageUrl = match[1]
      createImagePreview(linkElem, imageUrl)
    }
  }
  // 处理嵌入链接
  function processEmbedLink(linkElem) {
    for (let config of embedConfigs) {
      let match
      if (Array.isArray(config.regex)) {
        match = config.regex.some(r => linkElem.href.match(r))
      } else {
        match = linkElem.href.match(config.regex)
      }
 
      if (match) {
        let embedUrl = config.embedUrl
 
        if (config.embedUrl.includes('$')) {
          const regex = Array.isArray(config.regex) ? config.regex[0] : config.regex
          const match = linkElem.href.match(regex)
          embedUrl = config.embedUrl.replace(/\$(\d)/g, (s, g) => match[g])
        }
 
        if (config.name === 'xiaoyuzhou') {
          embedUrl = linkElem.href
        }
 
        appendEmbedIframe(linkElem, embedUrl, config.width, config.height)
 
        break
      }
    }
  }
  // 处理所有链接
  function processLink(linkElem) {
    processImageLink(linkElem)
    processEmbedLink(linkElem)
  }
  
  function processAllLinks() {
    document.querySelectorAll('.contentLink').forEach(link => {
      if (!link.hasAttribute('data-processed')) {
        link.setAttribute('data-processed', true)
        processLink(link)
      }
    })
  }
 
  // 在文档第一次加载完执行
 
  let initFun = () => {
    let app = document.querySelector('#app')
    if (app) {
      setTimeout(() => {
        processAllLinks()
      }, 1000)
    } else {
      setTimeout(() => {
        initFun()
      }, 500)
    }
  }
  initFun()
 
  // 在按下回车键时执行
  document.addEventListener('keydown', function (event) {
    processAllLinks()
  })
  document.documentElement.addEventListener('click', function (event) {
    processAllLinks()
  })
})()
