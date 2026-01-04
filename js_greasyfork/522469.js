// ==UserScript==
// @name              D&E-JP Image Download
// @name:zh-CN        D&E 日咖图片下载
// @namespace         http://liuzesen.com/
// @match             https://superjunior-dne.jp/group/*
// @version           1.1
// @description       Download the original images from the fan club photo page. Notice: Membership required
// @description:zh-CN 下载日咖页面上的原图。注：部分页面需要会员身份
// @icon              https://superjunior-dne.jp/assets/superjuniordne/fabicon-df43bc3beaeb85e3425f9d200bfb1577.jpg
// @homepage          https://github.com/hnliuzesen/DnE-JP-IMG-DL
// @supportURL        https://github.com/hnliuzesen/DnE-JP-IMG-DL/issues
// @license           MIT
// @grant             GM_xmlhttpRequest
// @grant             GM_download
// @grant             GM_registerMenuCommand
// @grant             GM_showFolderPicker
// @downloadURL https://update.greasyfork.org/scripts/522469/DE%20%E6%97%A5%E5%92%96%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/522469/DE%20%E6%97%A5%E5%92%96%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // 用于存储用户选择的路径
  let selectedDirectoryHandle = null

  // 添加菜单按钮
  GM_registerMenuCommand('下载所有图片', downloadAllImages)

  async function downloadAllImages () {
    // 创建进度显示窗
    const progressArea = document.createElement('div')
    progressArea.style.position = 'fixed'
    progressArea.style.top = '50%'
    progressArea.style.left = '50%'
    progressArea.style.transform = 'translate(-50%, -50%)'
    progressArea.style.padding = '10px'
    progressArea.style.backgroundColor = 'rgb(255, 255, 255)'
    progressArea.style.color = 'rgb(27, 70, 185)'
    progressArea.style.borderRadius = '5px'
    progressArea.style.zIndex = '10000'
    progressArea.style.fontSize = '14px'
    document.body.appendChild(progressArea)

    // 查找带有 data-original 属性的 img 标签
    const images = document.querySelectorAll('img[data-original]')
    if (images.length === 0) {
      document.body.removeChild(progressArea)
      alert('没有找到可以下载的图片')
      return
    }

    if (!selectedDirectoryHandle) {
      try {
        selectedDirectoryHandle = await window.showDirectoryPicker()
      } catch (error) {
        console.error('路径选择失败', error)
        document.body.removeChild(progressArea)
        alert('未选择路径，下载已取消。')
        return
      }
    }

    // 获取文件夹名称
    const folderName = getFolderName()
    if (!folderName) {
      document.body.removeChild(progressArea)
      alert('未找到合适的文件夹名称，下载已取消。')
      return
    }

    // 移除文件夹名称中的非法字符
    const sanitizedFolderName = folderName.replace(/[\\/:*?"<>|]/g, '')

    // 创建子目录
    const subDirHandle = await selectedDirectoryHandle.getDirectoryHandle(sanitizedFolderName, { create: true })

    let downloadCount = 0
    let completedDownloads = 0
    progressArea.textContent = `下载进度: ${downloadCount} / ${images.length}`

    images.forEach(img => {
      const imageUrl = img.getAttribute('data-original')
      if (!imageUrl) return

      const fileName = getFileName(imageUrl)

      GM_xmlhttpRequest({
        method: 'GET',
        url: imageUrl,
        responseType: 'blob',
        onload: async (response) => {
          if (response.status === 200) {
            const blob = response.response
            const fileHandle = await subDirHandle.getFileHandle(fileName, { create: true })
            let writable
            try {
              writable = await fileHandle.createWritable()
              await writable.write(blob)
              downloadCount++
              progressArea.textContent = `下载进度: ${downloadCount} / ${images.length}`
            } catch (error) {
              console.error(`保存文件时出错: ${fileName}`, error)
            } finally {
              if (writable) await writable.close()
            }
            console.log(`图片下载成功: ${fileName}`)
          } else {
            console.error(`下载图片失败: ${imageUrl}, 状态码: ${response.status}`)
          }
          completedDownloads++
          if (completedDownloads === images.length) {
            alert('下载完成！')
            document.body.removeChild(progressArea)
          }
        },
        onerror: (error) => {
          console.error(`请求图片失败: ${imageUrl}`, error)
          completedDownloads++
          if (completedDownloads === images.length) {
            alert('下载完成！')
            document.body.removeChild(progressArea)
          }
        }
      })
    })
  }

  function getFolderName () {
    try {
      const titleContainer = document.querySelector('.comp-gallery-show01-title')
      if (!titleContainer) return null

      const firstChildOfTitle = titleContainer.firstElementChild
      let result = firstChildOfTitle ? firstChildOfTitle.textContent.trim() : null

      const dateContainer = document.querySelector('.comp-gallery-show01-meta')
      if (!dateContainer) return result

      const firstChildOfDate = dateContainer.firstElementChild
      // 将 firstChildOfDate 的 datetime 属性拼接在 result 前面
      result = firstChildOfDate ? `${firstChildOfDate.getAttribute('datetime')} ${result}` : result

      return result
    } catch (error) {
      console.error('获取文件夹名称时出错:', error)
      return null
    }
  }

  function getFileName (url) {
    try {
      const parsedUrl = new URL(url)
      const pathname = parsedUrl.pathname
      const fileNameMatch = pathname.match(/([^\/]+\.[a-zA-Z]{3,4})(?:[?#]|$)/)
      if (!fileNameMatch) {
        console.warn(`无法解析文件名: ${url}`)
        return `image_${Date.now()}.jpg`
      }
      return fileNameMatch[1]
    } catch (e) {
      console.error('解析URL时出错:', e)
      return `image_${Date.now()}.jpg`
    }
  }
})()
