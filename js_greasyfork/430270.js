// ==UserScript==
// @name         g
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  gy
// @author       You
// @include      http://p.gygpm.com/m/*
// @include      https://p.gygpm.com/m/*
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.onurlchange
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/430270/g.user.js
// @updateURL https://update.greasyfork.org/scripts/430270/g.meta.js
// ==/UserScript==

history.pushState = ((f) =>
  function pushState() {
    var ret = f.apply(this, arguments)
    window.dispatchEvent(new Event('pushstate'))
    window.dispatchEvent(new Event('locationchange'))
    return ret
  })(history.pushState)

history.replaceState = ((f) =>
  function replaceState() {
    var ret = f.apply(this, arguments)
    window.dispatchEvent(new Event('replacestate'))
    window.dispatchEvent(new Event('locationchange'))
    return ret
  })(history.replaceState)

window.addEventListener('popstate', () => {
  window.dispatchEvent(new Event('locationchange'))
})
window.addEventListener('locationchange', function () {
  console.log(location.href)
  GM_setValue('previous_url', GM_getValue('current_url'))
  GM_setValue('current_url', location.href)
})

var action = function () {
  if (location.href.match('p.gygpm.com/m/#/mall')) {
    if (new Date().getHours() == 9 || new Date().getHours() == 12) {
      GM_setValue('left_max_price', '20000')
      GM_setValue('computed_orders', '')
      if (
        !GM_getValue('back_url') ||
        GM_getValue('back_url').split(' ').length <= 1
      ) {
        let id = location.href.match(/id=(\d+)/)[1]
        if (id % 2 == 0) {
          id = id - 1
        }
        let href = location.href.replace(/id=(\d+)/, id)
        GM_setValue('back_url', href)
      }
    }
    // console.log(GM_getValue('left_max_price'))
    //alert(document.querySelectorAll('.goodsItem').length)
    for (let i = 0; i < document.querySelectorAll('.goodsItem').length; i++) {
      const element = document.querySelectorAll('.goodsItem')[i]
      var price = element.querySelector('.goodsPrice').innerText.substring(1)
      if (price - GM_getValue('left_max_price') > 0) {
        console.log(price)
        element.style.display = 'none'
      }
    }
  }

  if (location.href.match('p.gygpm.com/m/#/goodsDetails')) {
    if (new Date().getHours() == 9 || new Date().getHours() == 12) {
      GM_setValue('back_url', location.href + ' ' + GM_getValue('back_url'))
    }
    if (document.querySelector('.buyBtn')) {
      document.querySelector('.buyBtn').ontouchend = function () {
        if (
          this.innerText == '交易中' ||
          this.innerText == '已售罄' ||
          this.innerText == '已结束' ||
          this.innerText == '还未开始，请耐心等待0'
        ) {
          setTimeout(() => {
            let back_url = GM_getValue('back_url').split(' ')[0]
            GM_setValue(
              'back_url',
              location.href + ' ' + GM_getValue('back_url')
            )
            location.href = back_url
          }, 100 + Math.floor(Math.random() * 0))
        }
      }
    }
  }

  if (location.href.match('p.gygpm.com/m/#/payOrder')) {
    if (document.querySelector('.payNow')) {
      document.querySelector('.payNow').style.position = 'fixed'
      document.querySelector('.payNow').style.bottom = '0'
      GM_setValue(
        'pay_price',
        document.querySelector('.totalPrice span').innerText
      )

      var open = XMLHttpRequest.prototype.open
      XMLHttpRequest.prototype.open = function () {
        this.addEventListener(
          'readystatechange',
          function () {
            if (
              this.readyState == 4 &&
              this.response &&
              JSON.parse(this.response).errcode == 5000
            ) {
              location.href = GM_getValue('back_url').split(' ')[0]
            }
          },
          false
        )
        open.apply(this, arguments)
        XMLHttpRequest.prototype.open = open
      }
      // GM_setValue('pay_clicked = 0
      // document.querySelector('.payNow').ontouchend = function () {
      //   console.log(GM_setValue('pay_clicked)
      //   if (document.querySelector('.payNow').innerText == '已抢拍')
      //     setTimeout(() => {
      //       location.href = GM_setValue('back_url
      //     }, 0 + Math.floor(Math.random() * 0))
      //   GM_setValue('pay_clicked = Number(GM_setValue('pay_clicked) + 1
      //   if (GM_setValue('pay_clicked == 3)
      //   location.href = GM_setValue('back_url
      // }
    }
  }

  if (location.href.match('p.gygpm.com/m/#/buyorder')) {
    if (
      typeof GM_getValue('left_max_price') == 'undefined' ||
      GM_getValue('left_max_price') == 'undefined'
    ) {
      GM_setValue('left_max_price', '20000')
      GM_setValue('computed_orders', '')
    }
    console.log(GM_getValue('left_max_price'))
    var items = document.querySelectorAll('.orderItem')
    for (let index = 0; index < items.length; index++) {
      const element = items[index]
      let orderNum = element.querySelector('.orderNum').innerText + ' '
      if (
        element.querySelector('.statusText').innerText == '待付款' &&
        GM_getValue('computed_orders').indexOf(orderNum) < 0
      ) {
        GM_setValue(
          'left_max_price',
          GM_getValue('left_max_price') -
            element.querySelector('.orderPrice').innerText.slice(1)
        )
        GM_setValue(
          'computed_orders',
          GM_getValue('computed_orders') + orderNum
        )
      }
    }
    console.log(GM_getValue('left_max_price'))
    document.querySelector('.van-nav-bar__content').onclick = function () {
      let arr = GM_getValue('back_url').split(' ')

      location.href = arr[0]
    }
  }
}

var MutationObserver =
  window.MutationObserver ||
  window.WebKitMutationObserver ||
  window.MozMutationObserver
if (MutationObserver) {
  var observer = new MutationObserver(action)
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}
