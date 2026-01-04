// ==UserScript==
// @name         打包下载豆瓣音乐人所有音乐
// @namespace    http://tampermonkey.net/
// @description   打包下载-豆瓣音乐人-页面当前的所有音乐
// @version      0.1
// @author       eboy
// @include      https://site.douban.com/*
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://cdn.staticfile.org/mustache.js/3.1.0/mustache.min.js
// @resource iconError https://cdn.jsdelivr.net/gh/Mr-Po/weibo-resource-download/out/media/error.png
// @resource iconSuccess https://cdn.jsdelivr.net/gh/Mr-Po/weibo-resource-download/out/media/success.png
// @resource iconInfo https://cdn.jsdelivr.net/gh/Mr-Po/weibo-resource-download/out/media/info.png
// @resource iconExtract https://cdn.jsdelivr.net/gh/Mr-Po/weibo-resource-download/out/media/extract.png
// @resource iconZip https://cdn.jsdelivr.net/gh/Mr-Po/weibo-resource-download/out/media/zip.png
// @downloadURL https://update.greasyfork.org/scripts/424956/%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%E8%B1%86%E7%93%A3%E9%9F%B3%E4%B9%90%E4%BA%BA%E6%89%80%E6%9C%89%E9%9F%B3%E4%B9%90.user.js
// @updateURL https://update.greasyfork.org/scripts/424956/%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%E8%B1%86%E7%93%A3%E9%9F%B3%E4%B9%90%E4%BA%BA%E6%89%80%E6%9C%89%E9%9F%B3%E4%B9%90.meta.js
// ==/UserScript==

;(function() {
  'use strict'
  let id = `vue_${+new Date()}`
  $('.nav-items ul').append(
    '<li><a id="' +
      id +
      '" href="javascript:void(0)" hidefocus="true"><span>下载所有</span></a></li>'
  )
  $('#' + id).click(function() {
    let domList = $('.download')
    let list = []
    for (let index = 0; index < domList.length; index++) {
      const element = $(domList[index]).children('a')
      let url = element.attr('href')
      let title = element.attr('title')
      try {
        title = title.split('下载')[1].trim()
      } catch (error) {
        console.log(error)
      }
      list.push({ src: url, name: title + '.mp3' })
    }
    ZipHandler.startZip(list)
  })
  class ZipHandler {
    /**
     * 生成一个进度条
     * @param  {$标签对象} $sub card的子节点
     * @param  {int}      max  最大值
     * @return {标签对象}     进度条
     */
    static bornProgress(count) {
      const $div = $('#header')
      // 尝试获取进度条
      let $progress = $div.find('progress')
      // 进度条不存在时，生成一个
      if ($progress.length === 0) {
        $progress = $("<progress max='1' style='margin-left:20px;' /><span style='color: #fff;'>"+count+"</span>")
        $div.append($progress)
      } else {
        // 已存在时，重置value
        $progress[0].value = 0
      }
      return $progress[0]
    }

    /**
     * 开始打包
     * @param  {$数组} $links 图片地址集
     */
    static startZip($links) {
      Tip.tip('正在提取，请稍候...', 'iconExtract')
      const progress = ZipHandler.bornProgress($links.length)
      const zip = new JSZip()
      const names = []
      $links.forEach(function(it, i) {
        const name = it.name
        GM_xmlhttpRequest({
          method: 'GET',
          url: it.src,
          timeout: 8000,
          responseType: 'blob',
          onload: function(response) {
            zip.file(name, response.response)
            ZipHandler.downloadZipIfComplete(
              progress,
              name,
              zip,
              names,
              $links.length
            )
          },
          onerror: function(e) {
            console.error(e)
            Tip.error(`第${i + 1}个对象，获取失败！`)
            ZipHandler.downloadZipIfComplete(
              progress,
              name,
              zip,
              names,
              $links.length
            )
          },
          ontimeout: function() {
            Tip.error(`第${i + 1}个对象，请求超时！`)
            ZipHandler.downloadZipIfComplete(
              progress,
              name,
              zip,
              names,
              $links.length
            )
          }
        })
      })
    }
    /**
     * 下载打包，如果完成
     */
    static downloadZipIfComplete(progress, name, zip, names, length) {
      names.push(name)
      const value = names.length / length
      progress.value = value
      if (names.length === length) {
        Tip.tip('正在打包，请稍候...', 'iconZip')
        zip
          .generateAsync(
            {
              type: 'blob'
            },
            function(metadata) {
              progress.value = metadata.percent / 100
            }
          )
          .then(function(content) {
            Tip.success('打包完成，即将开始下载！')
            const zipName = $($('.sp-logo'))
              .children('a')
              .text()
            saveAs(content, `${zipName}.zip`)
          })
      }
    }
  }
  /**
   * 提示
   */
  class Tip {
    static tip(text, iconName) {
      // if (Config.isTip) {
      GM_notification({
        text: text,
        image: GM_getResourceURL(iconName),
        timeout: 3000
      })
      //  }
    }
    static info(text) {
      Tip.tip(text, 'iconInfo')
    }

    static error(text) {
      Tip.tip(text, 'iconError')
    }

    static success(text) {
      Tip.tip(text, 'iconSuccess')
    }
  }
})()
