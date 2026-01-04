// ==UserScript==
// @name         豆瓣读书资源助手
// @namespace    yueye
// @version      1.2.0
// @description  在豆瓣读书页面展示资源站下载链接
// @author       yueye
// @match        https://book.douban.com/subject/*
// @require      http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/371723/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/371723/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E8%B5%84%E6%BA%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {

  var website = [
//    {
//     site: 'epubee',
//     searchLink: 'http://cn.epubee.com/books/?s=',
//     selector: '',
//     itemSelector: '',
//     state: 0
//   },
//  {
//    site: '我的小书屋',
//    searchLink: 'http://mebook.cc/?s=',
//    selector: '.list li',
//    itemSelector: ' .content h2 a',
//    state: -1
// },
  {
    site: 'sobooks',
    searchLink: 'https://sobooks.cc/search/',
    selector: '#cardslist > div',
    itemSelector: '#cardslist > div> div > h3 > a',
    state: -1
  }]

  var title = document.querySelector('h1 span').innerText
  var author = document.querySelectorAll('#info a')[0].innerText
  var splitStart = document.querySelectorAll('#info a')[0].innerText.indexOf(']')
  var splitEnd = document.querySelectorAll('#info a')[0].innerText.indexOf('（') !== -1 ? document.querySelectorAll('#info a')[0].innerText.indexOf('（') : author.length
  author = author.substr(splitStart + 1, splitEnd - splitStart -1).trim()


  function getSearchPage (searchLink, title, selector, itemSelector) {
    return new Promise(function(resolve, reject) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: searchLink + title,
        onload: function (res) {
          var state = -1
          if (selector) {
            var doc = (new DOMParser()).parseFromString(res.responseText, 'text/html');
            var list_length = doc.querySelectorAll(selector).length
            if (list_length > 0) {
              var bookTitle = [...doc.querySelectorAll('#cardslist > div > div > h3 > a')].map(i => i.innerText)
              state = bookTitle.indexOf(title)
            }
          } else {
            state = 0
          }
          resolve(state)
        }
      })
    })
  }

  /*
  function getDownloadLink (title, website) {
    return new Promise(function(resolve, reject) {
      GM.xmlHttpRequest({
        method: 'POST',
        url: 'http://127.0.0.1:3000/index?keywords=' + title,
        data: website,
        onload: function(response) {
          console.log(JSON.parse(response.responseText))
          resolve(JSON.parse(response.responseText))
        }
      })
    })
  }
  */

  function showInDoubanPage (title) {
    var html = [
      '<div class="gray_ad" id="doubanBookDL">',
        '<div id="buyinfo-printed" class="no-border">',
          '<h2>'+ title +'电子版下载&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·</h2>',
          '<ul class="bs noline">',
          '加载中...',
          '</ul>',
        '</div>',
      '</div>',
    ].join('')
    var sidebar = document.querySelector('.aside')
    sidebar.innerHTML = html + sidebar.innerHTML
  }

  if (/book.douban.com/.test(location.href)) {
    /*
    getDownloadLink(title, website).then(res => {
      console.log('请求完成')
    })
    */
    (async function (){
        var arr = []

        var _first = [
            '<li style="position:relative">',
            '<a target="_blank" href="javascript:;" style="display:inline-block;">epubee</a>',
            '<a target="_blank" class="buylink-price" href="http://cn.epubee.com/books/?s='+ title +
            '" style="position:absolute;bottom:0;right:65px;display:block;color:#fff;background-color:#ffc160;height:22px;padding:0 12px;border-radius:2px;font-size:12px;line-height:22px;text-align:center;">下载</a>',
            '<a target="_blank" class="buylink-price" href="http://cn.epubee.com/books/?s=' + author +
            '" style="position:absolute;bottom:0;right:0;display:block;color:#4f946e;background-color:#f2f8f2;height:22px;padding:0 12px;border-radius:2px;font-size:12px;line-height:20px;text-align:center;border:1px solid #4f946e;box-sizing: border-box;">搜作者</a>',
            '</li>',
        ]
        arr = arr.concat(_first)
        showInDoubanPage(title)
        document.querySelectorAll('#doubanBookDL ul')[0].innerHTML = arr.join('')
        for (let i = 0; i < website.length; i++) {
            const res = await getSearchPage(website[i].searchLink, title, website[i].selector, website[i].itemSelector)
            website[i].state = res
            var html = [
                '<li style="position:relative">',
                '<a target="_blank" href="javascript:;" style="display:inline-block;">'+ website[i].site +'</a>',
                '<a target="_blank" class="buylink-price" href="'+ (website[i].state >=0 ? website[i].searchLink + title : 'javascript:;') +
                '" style="position:absolute;bottom:0;right:65px;display:block;color:#fff;background-color:#ffc160;height:22px;padding:0 12px;border-radius:2px;font-size:12px;line-height:22px;text-align:center;">'+
                (website[i].state >= 0 ? '下载' : '暂无资源')
                +'</a>',
                '<a target="_blank" class="buylink-price" href="'+ website[i].searchLink + author +
                '" style="position:absolute;bottom:0;right:0;display:block;color:#4f946e;background-color:#f2f8f2;height:22px;padding:0 12px;border-radius:2px;font-size:12px;line-height:20px;text-align:center;border:1px solid #4f946e;box-sizing: border-box;">搜作者</a>',
                '</li>',
            ]
            arr = arr.concat(html)
        }
        document.querySelectorAll('#doubanBookDL ul')[0].innerHTML = arr.join('')
    })()
  }

})()