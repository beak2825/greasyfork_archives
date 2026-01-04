// ==UserScript==
// @name        8*宝*小*说*自*动*下*载
// @namespace   Violentmonkey Scripts
// @include     *
// @grant       none
// @version     1.2.7
// @license     MIT
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @author      -
// @description 2025/1/2 11:33:11
// @downloadURL https://update.greasyfork.org/scripts/522576/8%2A%E5%AE%9D%2A%E5%B0%8F%2A%E8%AF%B4%2A%E8%87%AA%2A%E5%8A%A8%2A%E4%B8%8B%2A%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/522576/8%2A%E5%AE%9D%2A%E5%B0%8F%2A%E8%AF%B4%2A%E8%87%AA%2A%E5%8A%A8%2A%E4%B8%8B%2A%E8%BD%BD.meta.js
// ==/UserScript==

// http://www.8btxt.com/classtop/3-0-1.html
// http://www.8btxt.com/classtop/3-0-2.html



// http://www.8btxt.com/classtop/*
// http://www.8btxt.com/wanben/*
// http://www.8btxt.com/down*

if (location.href === 'http://www.8btxt.com/' || location.href === 'chrome-error://chromewebdata/') {
  debugger
  let pageNo = Number(localStorage.getItem('pageNo')) || 1
  let url = `http://www.8btxt.com/classtop/3-0-${pageNo}.html`
  window.open(url, '_self')
}

if (location.href.indexOf('www.8btxt.com/classtop') > -1) {
  let aLinkInx = Number(localStorage.getItem('aLinkInx')) || 0
  let list = document.querySelectorAll('div.rankdetail > div.rankdetailleft > a')
  let imgList = document.querySelectorAll('div.rankdetail > div.rankdetailleft > a img')
  for (let index = 0; index < imgList.length; index++) {
      let x = imgList[index].title
      console.log(x)
  }

  function clickNext() {
    if (aLinkInx < list.length) {
      console.log('当前下标是' + aLinkInx + '，当前书籍名为： ' + imgList[aLinkInx].title)
      window.open(list[aLinkInx].href, '_self')
      aLinkInx++
      localStorage.setItem('aLinkInx', aLinkInx)
      setTimeout(clickNext, 1000)
    } else {
      let pageNo = Number(localStorage.getItem('pageNo')) || 1
      pageNo++
      localStorage.setItem('pageNo', pageNo)
      localStorage.setItem('aLinkInx', 0)
      let url = `http://www.8btxt.com/classtop/3-0-${pageNo}.html`
      window.open(url, '_self')
    }
  }
  clickNext()
}

if (location.href.indexOf('www.8btxt.com/wanben') > -1) {
  // http://www.8btxt.com/wanben/1052.html
  setTimeout(() => {
    if (document.querySelectorAll('.item ul li.bd a').length > 0) {
    //   document.querySelectorAll('.item ul li.bd a')[0].click()
      let url_x = document.querySelectorAll('.item ul li.bd a')[0].href
      const downloadLink = document.createElement('a');
      downloadLink.href = url_x; // 替换为实际的文件路径，比如'document.pdf'
      // downloadLink.download = 'custom_file_name.pdf'; // 可选，设置下载后的文件名，若不设置则使用原文件名
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => {
        let pageNo = Number(localStorage.getItem('pageNo')) || 1
        let url = `http://www.8btxt.com/classtop/3-0-${pageNo}.html`
        window.open(url, '_self')
      }, 1000)
    }
  }, 2000)
}