// ==UserScript==
// @name        Download Bing Background Image - bing.com
// @name:zh-CN  必应首页背景图片下载
// @description Add download button to Bing homepage.
// @description:zh-CN  在必应首页右下角添加一个背景图片下载按钮
// @namespace   Violentmonkey Scripts
// @match       https://*.bing.com/
// @grant       none
// @version     0.9
// @author      Alvin
// @license     GNU GPLv3
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/420171/Download%20Bing%20Background%20Image%20-%20bingcom.user.js
// @updateURL https://update.greasyfork.org/scripts/420171/Download%20Bing%20Background%20Image%20-%20bingcom.meta.js
// ==/UserScript==

function fileDownload(url, filename) {
  getBlob(url, function (blob) {
    saveAs(blob, filename)
  })
}
function getBlob(url, cb) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    if (xhr.status === 200) {
      cb(xhr.response)
    }
  }
  xhr.send()
}
function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    var link = document.createElement('a')
    var body = document.querySelector('body')

    link.href = window.URL.createObjectURL(blob)
    link.download = filename

    // fix Firefox
    link.style.display = 'none'
    body.appendChild(link)

    link.click()
    body.removeChild(link)

    window.URL.revokeObjectURL(link.href)
  }
}

var parent = document.getElementById('sh_rdiv')
if (parent) {
  parent.innerHTML += `<a role="button" id="downBtn" title="Download image" aria-label="Download image" href="" h="ID=SERP,5054.1" style="cursor: pointer;">
        <div class="sc_light" style="visibility: visible;">
          <div id="sh_lt" class="hpcDown"></div>
        </div>
      </a>`

  var btn = document.getElementById('downBtn')
  btn.addEventListener(
    'click',
    function () {
      var title =
        document.getElementById('sh_cp').title ||
        document.getElementById('musCardImageTitle').innerHTML +
          ' ' +
          document.getElementById('musCardCopyright').innerHTML
      var bg = document.getElementById('bgDiv').style.backgroundImage
      var imgUrl = bg.slice(4, -1).replace(/"/g, '')
      var fileName = title + '.jpg'
      fileDownload(imgUrl, fileName)
    },
    false
  )
} else {
  var styleElem = document.head.appendChild(document.createElement('style'))
  styleElem.innerHTML =
    '#downBtn::after {display: none;} .footer {width: 96% !important; padding: 0 2% !important;}'

  setTimeout(function () {
    var parentEl = document.getElementsByClassName('headline')[0]
    var parent = document.createElement('div')
    var el = parentEl.appendChild(parent)

    el.innerHTML = `
    <a role="button" id="downBtn" title="Download image" aria-label="Download image" href="javascript:void(0)" style="cursor: pointer; width: 2.5rem; height: 2.5rem; position: relative;">
      <svg class="downloadIcon" x="0px" y="0px" viewBox="0 0 22 22" enable-background="new 0 0 22 22" aria-hidden="true" role="presentation">
        <path d="M17.842 11.483l-6.671 6.725-6.671-6.725.967-.967 5.017 5.049v-15.565h1.375v15.565l5.017-5.049.966.967zm-12.859 10.517v-1.375h12.375v1.375h-12.375z"></path>
      </svg>
    </a>`
    var btn = document.getElementById('downBtn')
    btn.addEventListener(
      'click',
      function () {
        var card = document.getElementsByClassName('musCardCont')[0]
        var title = card.getElementsByClassName('title')[0].innerText
        var copyright = card.getElementsByClassName('copyright')[0].innerText
        var bg = (
          document.getElementsByClassName('img_uhd')[0] ||
          document.getElementsByClassName('img_cont')[0]
        ).style.backgroundImage

        var imgUrl = bg.slice(4, -1).replace(/"/g, '')
        var fileName = title + ' ' + copyright + '.jpg'
        fileDownload(imgUrl, fileName)
      },
      false
    )
  }, 1000)
}
