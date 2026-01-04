// ==UserScript==
// @name        轻小说文库下载器(Wenku8 Download)
// @namespace   FreeScripts
// @description 轻小说文库下载器, 进入小说目录页面即可看的下载按钮
// @include     *://www.wenku8.net/novel/*/*/index.htm
// @version     1.0
// @grant       GM_download

// @downloadURL https://update.greasyfork.org/scripts/408142/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8%28Wenku8%20Download%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408142/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8%28Wenku8%20Download%29.meta.js
// ==/UserScript==
;(() => {
  const novelId = /\/novel\/\d+\/(\d+)/.exec(location.pathname)[1]
  const $ = document.querySelector.bind(document)
  const $$ = document.querySelectorAll.bind(document)
  const title = $('#title').textContent

  const addBtn = (volume) => {
    const name = title + volume.textContent.trim() + '.txt'
    var current = volume.parentElement.nextElementSibling.firstElementChild
    var paragraphId = current.childNodes[0]
      .getAttribute('href')
      .replace('.htm', '')
    var url = `http://dl.wenku8.com/packtxt.php?aid=${novelId}&vid=${paragraphId}&charset=utf-8`
    var link = document.createElement('a')
    link.setAttribute('href', 'javascript:')
    link.addEventListener('click', () => GM_download(url, name))
    link.innerText = `下载 ${name} `
    volume.appendChild(link)
  }

  var volumes = $$('.vcss')
  Array.from(volumes).forEach(addBtn)
})()
