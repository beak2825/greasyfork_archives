// ==UserScript==
// @name        保存4期生照片馆详情页图片(zip版本)
// @namespace   Violentmonkey Scripts
// @match       https://www.hinatazaka46.com/s/official/gallery/4th_photo_*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @grant       none
// @version     1.1
// @author      fbz
// @description 打包4期生照片馆详情页图片到本地
// @downloadURL https://update.greasyfork.org/scripts/463823/%E4%BF%9D%E5%AD%984%E6%9C%9F%E7%94%9F%E7%85%A7%E7%89%87%E9%A6%86%E8%AF%A6%E6%83%85%E9%A1%B5%E5%9B%BE%E7%89%87%28zip%E7%89%88%E6%9C%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463823/%E4%BF%9D%E5%AD%984%E6%9C%9F%E7%94%9F%E7%85%A7%E7%89%87%E9%A6%86%E8%AF%A6%E6%83%85%E9%A1%B5%E5%9B%BE%E7%89%87%28zip%E7%89%88%E6%9C%AC%29.meta.js
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
  /* 生成下载按钮 */
  function generateDownloadBtn() {
    const div = document.createElement('div')
    div.innerHTML = downloadButton
    document.body.appendChild(div)

    document.querySelector('#downloadButton').addEventListener('click', () => {
      downloadBlog()
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
  let isDownloading = false
  addStyle(downloadBtnCss)
  generateDownloadBtn()

  function getImgBlob(src) {
    // 使用fetch和blob来获取图片数据
    return new Promise((resolve, reject) => {
      fetch(src)
        .then((response) => response.blob())
        .then((blob) => {
          resolve(blob)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

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

  function extractVariable(str) {
    const regex = /encodeURIComponent\('.*(#.*?)'\)/
    const match = str.match(regex)
    if (match) {
      const variable = decodeURIComponent(match[1])
      return variable
    }
    return null
  }

  // 创建一个JSZip实例
  const zip = new JSZip()

  /* 下载博客 */
  async function downloadBlog() {
    if (isDownloading) return
    try {
      setLoading()
      // 获取图片节点数组
      const imageNodeList = document
        .querySelector('.p-photo-detail')
        .querySelectorAll('img')
      // 遍历图片节点数组
      const memberName = extractVariable(
        document
          .querySelector('.tweetbtn')
          .querySelector('a')
          .getAttribute('onclick')
      ).replace('#', '')
      imageNodeList.forEach(async (node, i) => {
        // 获取图片节点的src属性
        const src = node.src
        // const filename = extractVariableFromUrl(src)
        const filename = `image-${(i + 1).toString().padStart(2, '0')}.jpg`
        try {
          const blob = await getImgBlob(src)
          // 将图片数据添加到zip文件中，文件名为image-i.jpg
          zip.file(filename, blob)
          // 如果是最后一个图片节点，生成zip文件并保存到本地
          if (i === imageNodeList.length - 1) {
            const content = await zip.generateAsync({ type: 'blob' })
            saveAs(content, memberName)
            resetLoading()
          }
        } catch (error) {
          console.log('error: ', error)
          resetLoading()
        }
      })
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
})()
