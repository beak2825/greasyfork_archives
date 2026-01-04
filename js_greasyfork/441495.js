// ==UserScript==
// @name        保存博客（日向坂）
// @namespace   hinatazaka blog download
// @match       *://www.hinatazaka46.com/s/official/diary/detail/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.0/beautify-html.min.js
// @grant       none
// @version     1.4
// @author      FBZ
// @description 保存日向坂博客
// @license MIT
/* jshint esversion: 6 */
// @downloadURL https://update.greasyfork.org/scripts/441495/%E4%BF%9D%E5%AD%98%E5%8D%9A%E5%AE%A2%EF%BC%88%E6%97%A5%E5%90%91%E5%9D%82%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/441495/%E4%BF%9D%E5%AD%98%E5%8D%9A%E5%AE%A2%EF%BC%88%E6%97%A5%E5%90%91%E5%9D%82%EF%BC%89.meta.js
// ==/UserScript==
;(function () {
  const titleDetailCss = `
    .c-blog-article__name,
    .c-blog-article__date {
      white-space: nowrap;
    }
  `
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

  const htmlTemplate = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width">
        <meta name="format-detection" content="telephone=no">
        <link href="https://fonts.googleapis.com/css?family=Noto+Sans+JP|Overpass" rel="stylesheet">
        <title></title>

        <style type="text/css">
          #container {
            display: flex;
            justify-content: center;
          }
          img.emoji {
            display: inline-block !important;
            height: 1em !important;
            width: 1em !important;
            margin: 0 .05em 0 .1em;
            vertical-align: -0.1em;
            position: relative !important;
            left: auto !important;
            top: auto !important;
            transform: translate(0,0) !important;
          }
        </style>
      </head>
      <body>
        <div id="container"></div>
      </body>
    </html>`

  const beautifyOpts = {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '0',
    preserve_newlines: true,
    keep_array_indentation: true,
    break_chained_methods: true,
    indent_scripts: 'keep',
    brace_style: 'collapse,preserve-inline',
    space_before_conditional: false,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: '80',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: false,
  }
  let isDownloading = false
  const zip = new JSZip()
  addStyle(downloadBtnCss)
  addStyle(titleDetailCss)
  generateDownloadBtn()

  /* 下载博客 */
  async function downloadBlog() {
    if (isDownloading) return
    try {
      setLoading()

      const title = document
        .querySelector('.p-blog-article__head')
        .querySelector('.c-blog-article__title')
        .textContent.trim() //获取博客标题
      const name = document
        .querySelector('.p-blog-article__head')
        .querySelector('.p-blog-article__info')
        .querySelector('.c-blog-article__name')
        .textContent.trim() //获取成员名字
      const date = document
        .querySelector('.p-blog-article__head')
        .querySelector('.p-blog-article__info')
        .querySelector('.c-blog-article__date')
        .textContent.trim() //获取博客日期
      const { newHtml, imgList, cssList } = generateHtml()

      zip.file(
        'blog.html',
        html_beautify(`<!DOCTYPE html>\n${newHtml.outerHTML}`, beautifyOpts)
      ) //生成html

      zip.folder('assets/images') // 创建目录存放图片资源
      imgList.forEach(({ filename, src }) => {
        JSZipUtils.getBinaryContent(src, function (err, data) {
          if (err) {
            throw err // or handle err
          }
          zip.file(`assets/images/${filename}`, data, { binary: true }) // 批量塞入图片
        })
      })

      zip.folder('assets/css') // 创建目录存放图片资源
      cssList.forEach(({ filename, src }) => {
        JSZipUtils.getBinaryContent(src, function (err, data) {
          if (err) {
            throw err // or handle err
          }
          zip.file(`assets/css/${filename}`, data, { binary: true }) // css存到本地
        })
      })

      const indexImg = await generateScreenShot() // 生成博客截图
      const indexImg_transparent = base64Decode(await generateScreenShot(true)) // 生成透明底博客截图
      zip.file('screenshot.png', base64Decode(indexImg), { base64: true })
      zip.file(
        'screenshot_transparent.png',
        base64Decode(indexImg_transparent),
        {
          base64: true,
        }
      )

      // 下载生成的文件
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `${name}-${date}-${title}.zip`)
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
  /* 生成博客截图 */
  function generateScreenShot(transparent = false) {
    return new Promise((resolve, reject) => {
      const blogDetail = document.querySelector('.p-blog-group')
      domtoimage
        .toPng(blogDetail, {
          bgcolor: transparent ? '' : '#ffffff',
        })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  /* 往新的html里填充内容 */
  function generateHtml() {
    const parser = new DOMParser()
    const { documentElement: newHtml } = parser.parseFromString(
      htmlTemplate,
      'text/html'
    ) //通过模板生成html

    newHtml.querySelector('title').innerText = document.title
    const container = newHtml.querySelector('#container')
    const blogDetail = document.querySelector('.p-blog-group').cloneNode(true)

    const imgNodes = blogDetail.querySelectorAll(`img:not([class='emoji'])`) // 过滤掉表情类的图片
    const imgList = []
    for (const node of imgNodes) {
      const i = node.src.lastIndexOf('/')
      const filename = node.src.slice(i + 1)
      imgList.push({
        filename,
        src: node.src,
      })
      node.src = `./assets/images/${filename}`
    }

    const linkNodes = document.cloneNode(true).querySelectorAll('link')
    const cssList = []
    for (const node of linkNodes) {
      if (
        node.href.includes('cdn.hinatazaka46.com') &&
        node.href.includes('.css')
      ) {
        const i = node.href.lastIndexOf('/')
        const filename = node.href.slice(i + 1)
        cssList.push({
          filename,
          src: node.href,
        })
        const link = document.createElement('link')
        link.href = `./assets/css/${filename}`
        link.type = 'text/css'
        link.rel = 'stylesheet'
        newHtml.querySelector('head').appendChild(link)
      }
    }

    // 获取style并填充
    const styleNodes = document.cloneNode(true).querySelectorAll('style')
    for (const styleNode of styleNodes) {
      newHtml.querySelector('head').appendChild(styleNode)
    }

    container.appendChild(blogDetail)
    return { newHtml, imgList, cssList }
  }

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

  // base64去头
  function base64Decode(code) {
    if (code && code.includes('data:image')) {
      code = code.slice(code.indexOf(',') + 1)
    }
    return code
  }
})()
