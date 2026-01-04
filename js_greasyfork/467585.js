// ==UserScript==
// @name         下载抖音商城商品图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使用步骤：打开抖音，进入抖音商城，随便选择一款商品点击分享，然后打开商品链接，此时浏览器可视窗口中会出现两个按钮分别为“下载全部轮播图”、“下载全部详情图”
// @author       Aman
// @match       *://haohuo.jinritemai.com/*
// @icon        data:image/png;base64,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
// @license     GPL
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/467585/%E4%B8%8B%E8%BD%BD%E6%8A%96%E9%9F%B3%E5%95%86%E5%9F%8E%E5%95%86%E5%93%81%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/467585/%E4%B8%8B%E8%BD%BD%E6%8A%96%E9%9F%B3%E5%95%86%E5%9F%8E%E5%95%86%E5%93%81%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const timer = setInterval(() => {
        try {
            if (isItLoaded()) {
                clearInterval(timer)
                // start...
                createButtonDownloadArea()
                createCarouselDownloadButton()
                createDetailDownloadButton()
                // style
                applyStyle()
            }
        } catch (ignore) {
            // ignore...
        }
    }, 200)

    /**
     * 轮播图和详情图是否已经加载完毕
     * @returns {boolean}
     */
    const isItLoaded = () => {
        const parents = document.querySelector('#container > div.head-figure.default_container > div.head-figure__media-view > div > div').children
        const detailImageUrls = document.querySelectorAll('#container > div.detail-container__components > div.detail-container__sold-content > div.partial-detail-wrapper > div.product-big-img-list img')
        return parents !== undefined && detailImageUrls !== undefined
    }

    /**
     * 创建一个区域，用于存放下载按钮
     */
    const createButtonDownloadArea = () => {
        const buttonDownloadArea = document.createElement('div')
        buttonDownloadArea.id = 'buttonDownloadArea'
        document.documentElement.appendChild(buttonDownloadArea)
    }

    /**
     * 创建轮播图下载按钮
     */
    const createCarouselDownloadButton = () => {
        const downloadButton = document.createElement('button')
        downloadButton.id = 'downloadCarouselImagesButton'
        downloadButton.innerText = '下载全部轮播图'
        downloadButton.onclick = () => {
            downloadCarouselImages()
        }

        const buttonDownloadArea = document.getElementById('buttonDownloadArea')
        buttonDownloadArea.appendChild(downloadButton)
    }

    /**
     * 创建详情图下载按钮
     */
    const createDetailDownloadButton = () => {
        const downloadButton = document.createElement('button')
        downloadButton.id = 'downloadDetailImagesButton'
        downloadButton.innerText = '下载全部详情图'
        downloadButton.onclick = () => {
            downloadDetailImages()
        }

        const buttonDownloadArea = document.getElementById('buttonDownloadArea')
        buttonDownloadArea.appendChild(downloadButton)
    }

    /**
     * 下载轮播图
     */
    const downloadCarouselImages = () => {
        const parents = document.querySelector('#container > div.head-figure.default_container > div.head-figure__media-view > div > div').children
        const arrayChildren = Array.from(parents).map(parent => Array.from(parent.children))
        const imgUrls = arrayChildren.map(item => item.map(i => i.style.backgroundImage))
        const urlRegex = /url\("(.+)"\)/

        imgUrls.forEach(imgUrl => {
            imgUrl.forEach(img => {
                const [, url] = img.match(urlRegex)
                setTimeout(() => {
                    downloadImage2(url, randomFilename('轮播图'))
                }, 600)
            })
        })
    }

    /**
     * 生成一个随机字符串文件名
     * @param prefix 文件名前缀
     * @returns {string}
     */
    const randomFilename = (prefix) => {
        return prefix + '-' + Math.random().toString(36).substring(2, 10)
    }

    /**
     * 下载详情图
     */
    const downloadDetailImages = () => {
        const detailImageUrls = document.querySelectorAll('#container > div.detail-container__components > div.detail-container__sold-content > div.partial-detail-wrapper > div.product-big-img-list img')

        Array.from(detailImageUrls).forEach(detailImage => {
            setTimeout(() => {
                downloadImage2(detailImage.src, randomFilename('详情图'))
            }, 600)
        })
    }

    /**
     * 点击超链接，下载
     */
    const downloadImage2 = (url, filename) => {
        console.log('准备下载文件 ==>>> ', url)
        if (filename === undefined || filename === '') {
            filename = Date.now() + '-file'
        }
        GM_download(url, filename)
    }

    const applyStyle = () => {
        GM_addStyle(
            `
    #buttonDownloadArea {
      position: fixed;
      top: 20%;
      left: 10px;
      z-index: 99999;
      text-align: center;
    }

    #downloadDetailImagesButton, #downloadCarouselImagesButton {
      background-color: #099cee; /* 设置背景颜色 */
      border: none; /* 去掉边框 */
      color: white; /* 设置文字颜色 */
      padding: 10px 20px; /* 设置内边距 */
      text-align: center; /* 文字居中 */
      text-decoration: none; /* 去掉下划线 */
      display: block; /* 设置为行内块级元素 */
      font-size: 16px; /* 设置字体大小 */
      border-radius: 5px; /* 设置圆角 */
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* 设置阴影 */
      cursor: pointer; /* 鼠标悬停时显示手型 */
      margin: 10px auto;
    }

    #downloadCarouselImagesButton:hover, #downloadDetailImagesButton:hover {
      background-color: #3e8e41; /* 鼠标悬停时改变背景颜色 */
    }
  `
        )
    }
})();