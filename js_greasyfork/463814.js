// ==UserScript==
// @name        保存4期生照片馆详情页图片
// @namespace   Violentmonkey Scripts
// @match       https://www.hinatazaka46.com/s/official/gallery/4th_photo_*
// @grant       none
// @version     1.0
// @author      fbz
// @description 批量保存4期生照片馆详情页图片到本地
// @downloadURL https://update.greasyfork.org/scripts/463814/%E4%BF%9D%E5%AD%984%E6%9C%9F%E7%94%9F%E7%85%A7%E7%89%87%E9%A6%86%E8%AF%A6%E6%83%85%E9%A1%B5%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/463814/%E4%BF%9D%E5%AD%984%E6%9C%9F%E7%94%9F%E7%85%A7%E7%89%87%E9%A6%86%E8%AF%A6%E6%83%85%E9%A1%B5%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
;(function () {
  const downloadButton = `<div id="downloadButton" title="下载">
    <span class="inner">↓</span>
  </div>`

  const downloadBtnCss = `
    #downloadButton {
      position: fixed;
      bottom: 3rem;
      right: 2rem;
      border: 1px solid rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 9999;
    }

    #downloadButton:hover {
      color: #409EFF;
      border-color: #409EFF;
    }
  `

  let isDownloading = false
  addStyle(downloadBtnCss)
  generateDownloadBtn()

  function extractVariableFromUrl(url) {
    const regex = /\/([^\/]+)$/ // 匹配字符串结尾的.jpg文件名
    const match = url.match(regex) // 使用正则表达式匹配字符串
    if (match) {
      // 如果匹配成功，则返回匹配结果中的文件名部分
      return match[1]
    } else {
      // 如果匹配失败，则返回空字符串
      return ''
    }
  }

  async function downloadImage(imageSrc, filename) {
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement('a')
    link.href = imageURL
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /* 下载 */
  async function handleDownload() {
    if (isDownloading) return
    try {
      setLoading()

      const imgNodeList = document
        .querySelector('.p-photo-detail')
        .querySelectorAll('img')

      imgNodeList.forEach(async (node) => {
        const src = node.src
        const filename = extractVariableFromUrl(src)
        await downloadImage(src, filename)
      })

      resetLoading()
    } catch (error) {
      console.log('error: ', error)
      resetLoading()
    }
  }

  /* 加载中 */
  function setLoading() {
    isDownloading = true
    document.querySelector('#downloadButton').style.cursor = 'progress'
  }

  /* 重置加载 */
  function resetLoading() {
    isDownloading = false
    document.querySelector('#downloadButton').style.cursor = ''
  }

  /* 生成下载按钮 */
  function generateDownloadBtn() {
    const div = document.createElement('div')
    div.innerHTML = downloadButton
    document.body.appendChild(div)

    document.querySelector('#downloadButton').addEventListener('click', () => {
      handleDownload()
    })
  }

  /* 添加样式 */
  function addStyle(css) {
    if (!css) return
    var head = document.querySelector('head')
    var style = document.createElement('style')
    style.innerHTML = css
    head.appendChild(style)
  }
})()
