// ==UserScript==
// @name         豆瓣鱼
// @namespace    wong2
// @version      1.2
// @description  在豆瓣读书页面展示多抓鱼价格
// @author       wong2
// @match        https://book.douban.com/subject/*
// @match        https://www.duozhuayu.com/books/*
// @require      https://cdn.jsdelivr.net/combine/npm/aes-js@3.1.1,npm/qrcode@1.2.2/build/qrcode.min.js
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/370940/%E8%B1%86%E7%93%A3%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/370940/%E8%B1%86%E7%93%A3%E9%B1%BC.meta.js
// ==/UserScript==

(function () {

  var key = 'DkOliWvFNR7C4WvR'.split('').map(function(c) {
    return c.charCodeAt()
  })
  var iv = 'GQWKUE2CVGOOBKXU'.split('').map(function(c) {
    return c.charCodeAt()
  })
  var aesCfb = new aesjs.ModeOfOperation.cfb(key, iv)

  function encrypt(text) {
    var textBytes = aesjs.utils.utf8.toBytes(text)
    var encryptedBytes = aesCfb.encrypt(textBytes)
    return aesjs.utils.hex.fromBytes(encryptedBytes)
  }

  function getCustomRequestHeaders() {
    var timestamp = Date.now()
    var userId = 0
    var securityKey = Math.floor(100000000 * Math.random())
    var token = encrypt([timestamp, userId, securityKey].join(':'))
    var requestId = [userId, timestamp, Math.round(100000 * Math.random())].join('-')
    return {
      'x-timestamp': timestamp,
      'x-security-key': securityKey,
      'x-user-id': userId,
      'x-request-token': token,
      'x-request-misc': '{"platform":"browser"}',
      'x-api-version': '0.0.3',
      'x-request-id': requestId,
    }
  }

  function searchBooksByTitle(title) {
    return new Promise(function(resolve, reject) {
      GM.xmlHttpRequest({
        method: 'GET',
        url: 'https://www.duozhuayu.com/api/search?type=normal&q=' + encodeURIComponent(title),
        headers: getCustomRequestHeaders(),
        onload: function(response) {
          var resp = JSON.parse(response.responseText)
          var books = resp.data.filter(function(item) {
            return item.type === 'book'
          }).map(function(item) {
            return item.book
          })
          resolve(books)
        },
      })
    })
  }

  function searchBook(title, isbn) {
    return searchBooksByTitle(title).then(function(books) {
      if (!isbn) {
        return books[0]
      }
      return books.filter(function(book) {
        return book.isbn13 == isbn
      })[0]
    })
  }

  function showInSidebar(book) {
    var price = book.price
    var goods = book.goods
    if (goods.length) {
      price = goods[goods.length - 1].price
    }
    var link = 'https://www.duozhuayu.com/books/' + book.id
    var html = [
      '<div class="gray_ad">',
        '<h2>',
          '<span>在多抓鱼有售</span>',
          '&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·&nbsp;·',
        '</h2>',
        '<div class="market-banner">',
          '<span class="title">' + (goods.length ? '库存' + goods.length + '册' : '缺货') + '&nbsp;</span>',
          '<span class="price">' + (price / 100).toFixed(2) + '元起</span>',
          '<span class="price"> <del>' + (book.originalPrice / 100).toFixed(2) + '元</del> </span>',
          '<span class="actions">',
            '<a class="buy-btn buy" target="_blank" href="' + link + '">去看看</a>',
          '</span>',
        '</div>',
      '</div>',
    ].join('')
    var sidebar = document.querySelector('.aside')
    sidebar.innerHTML = html + sidebar.innerHTML
  }

  function runInDoubanPage() {
    var title = document.querySelector('h1 span').innerText
    var matches = document.getElementById('info').innerText.match(/\d{13}/)
    var isbn = matches && matches[0]
    searchBook(title, isbn).then(function(book) {
      if (book) {
        showInSidebar(book)
      }
    })
  }

  function replaceDuozhuayuQRCode() {
    QRCode.toDataURL(location.href, function(err, dataUrl) {
      var img = document.body.querySelector('.Modal-body img')
      img.src = dataUrl
    })
  }

  function runInDuozhuayuPage() {
    var observer = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var nodes = mutations[i].addedNodes
        for (var j = 0; j < nodes.length; j++) {
          var node = nodes[j]
          if (node.querySelector('.Modal-body')) {
            return replaceDuozhuayuQRCode()
          }
        }
      }
    })
    observer.observe(document.body, { childList: true })
  }

  if (/book.douban.com/.test(location.href)) {
    runInDoubanPage()
  } else {
    runInDuozhuayuPage()
  }

})()
