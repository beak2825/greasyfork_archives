// ==UserScript==
// @name         gyg
// @namespace    http://tampermonkey.net/
// @version      4.7.4
// @description  gy
// @author       You
// @include      http://p.gygpm.com/m/*
// @include      https://p.gygpm.com/m/*
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.onurlchange
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/432781/gyg.user.js
// @updateURL https://update.greasyfork.org/scripts/432781/gyg.meta.js
// ==/UserScript==

const left_max_price = 25000
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
  console.log(GM_info.script.version)
  console.log(GM_info.script.version)
  window.page_click = false
  GM_setValue('previous_url', GM_getValue('current_url'))
  GM_setValue('current_url', location.href)
})

var action = function () {
  if (location.href.match('p.gygpm.com/m/#/mall')) {
      let id = location.href.match(/id=(\d+)/)[1]
      if (id % 2 == 0) {
        id = id - 1
      }
      let href = location.href.replace(/id=(\d+)/, 'id=' + id)
      GM_setValue('back_url', href)
    if (new Date().getHours() == 9 || new Date().getHours() == 12 || new Date().getHours() == 19) {
      GM_setValue('left_max_price', left_max_price)
      GM_setValue('computed_orders', '')
    }
    console.log(GM_getValue('left_max_price'))
    console.log(document.querySelectorAll('.goodsItem').length)
    //alert(document.querySelectorAll('.goodsItem').length)
    let max_price = 0
    let  max_price_index = null
    for (let i = 0; i < document.querySelectorAll('.goodsItem').length; i++) {
      const element = document.querySelectorAll('.goodsItem')[i]
      var price = element.querySelector('.goodsPrice').innerText.substring(1)
      if (price - GM_getValue('left_max_price') > 0) {
        console.log(price)
        //element.style.display = 'none'
      }
      if (price > max_price && price <= GM_getValue('left_max_price')) {
        max_price_index = i
      }
    }
    if (
      (document.querySelectorAll('.van-pagination__page').length &&
        new Date().getHours() == 10) || new Date().getHours() == 13 || new Date().getHours() == 20
    ) {
      if (
        document
          .querySelectorAll('.van-pagination__page')[0]
          .classList.contains('van-pagination__item--active') &&
        new Date().getMinutes() <= 5 &&
        !page_click
      ) {
        window.page_click = true
        setTimeout(() => {
          document.querySelectorAll('.van-pagination__page')[3].click()
        }, 335 + Math.floor(Math.random() * 0))
      } else if (document.querySelectorAll('.goodsItem').lengt && max_price_index!== null) {
        //if (document.querySelectorAll('.goodsItem')[max_price_index].querySelector('img').src.endWith('statusIcon.png')) {
        //}
        setTimeout(() => {
          document.querySelectorAll('.goodsItem')[max_price_index].click()
        }, 50 + Math.floor(Math.random() * 10))
      }
    }
  }

  if (location.href.match('p.gygpm.com/m/#/goodsDetails')) {
    if (document.querySelector('.buyBtn')) {
      console.log(document.querySelector('.buyBtn').innerText)
      document.querySelector('.buyBtn').ontouchend = function () {
        if (
          this.innerText == '交易中' ||
          this.innerText == '已售罄' ||
          this.innerText == '已结束' ||
          this.innerText == '还未开始，请耐心等待0'
        ) {
          if (
            (new Date().getHours() == 10 || new Date().getHours() == 13 || new Date().getHours() == 20) &&
            new Date().getMinutes() == 0 && new Date().getSeconds() <= 30
          ) {
          setTimeout(() => {
            window.close()
          }, 150 + Math.floor(Math.random() * 0))}
          else
          location.href = GM_getValue('back_url')
        }
        if (
          this.innerText == '立即抢拍' &&
          (new Date().getHours() == 10 || new Date().getHours() == 13 || new Date().getHours() == 20) &&
          new Date().getMinutes() == 0
        ) {
          document.querySelectorAll('.buyBtn')[0].click()
        }
      }
    }
  }

  if (location.href.match('p.gygpm.com/m/#/payOrder')) {
    if (document.querySelectorAll('.payNow').length) {
      // document.querySelector('.payNow').style.position = 'fixed'
      // document.querySelector('.payNow').style.bottom = '0'
      GM_setValue(
        'pay_price',
        document.querySelector('.totalPrice span').innerText
      )
      if (
        (new Date().getHours() == 9 || new Date().getHours() == 12 || new Date().getHours() == 19) &&
        new Date().getMinutes() == 59
      ) {
        setTimeout(() => {
           document.querySelector('.payNow').click()
        }, 150 + Math.floor(Math.random() * 0))
      } else {
        document.querySelector('.payNow').click()
      }

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
              if (
                (new Date().getHours() == 10 || new Date().getHours() == 13 || new Date().getHours() == 20) &&
                new Date().getMinutes() == 0 && new Date().getSeconds() <= 30
              )
              window.close()
                else
              setTimeout(() => {
                location.href = GM_getValue('back_url')
              }, 2800 + Math.floor(Math.random() * 0))
            }
          },
          false
        )
        open.apply(this, arguments)
        XMLHttpRequest.prototype.open = open
      }
      GM_setValue('pay_clicked', 0)
      document.querySelector('.payNow').ontouchend = function () {
        console.log(GM_getValue('pay_clicked'))
        GM_setValue('pay_clicked', Number(GM_getValue('pay_clicked')) + 1)
        if (GM_getValue('pay_clicked') == 12 || document.querySelector('.payNow').innerText == '已抢拍'){}
        if (
          (new Date().getHours() == 10 || new Date().getHours() == 13 || new Date().getHours() == 20) &&
          new Date().getMinutes() == 0 && new Date().getSeconds() <= 30
        )
        window.close()
          else
          setTimeout(() => {
            location.href = GM_getValue('back_url')
          }, 100 + Math.floor(Math.random() * 0))
        }
      }
    }
  }

  if (location.href.match('p.gygpm.com/m/#/buyorder')) {
    if (
      typeof GM_getValue('left_max_price') == 'undefined' ||
      GM_getValue('left_max_price') == 'undefined'
    ) {
      GM_setValue('left_max_price', left_max_price)
      GM_setValue('computed_orders', '')
    }
    if (
      (new Date().getHours() == 10 || new Date().getHours() == 13 || new Date().getHours() == 20) &&
      new Date().getMinutes() <= 5
    ) {
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
    }
    console.log(GM_getValue('previous_url'))
    if (GM_getValue('previous_url').match('p.gygpm.com/m/#/')) {
        if (
          (new Date().getHours() == 10 || new Date().getHours() == 13 || new Date().getHours() == 20) &&
          new Date().getMinutes() == 0 && new Date().getSeconds() <= 30
        )
      setTimeout(() => {
        window.close()
      }, 0 + Math.floor(Math.random() * 0))
      else
      setTimeout(() => {
        location.href = GM_getValue('back_url')
      }, 2600 + Math.floor(Math.random() * 0))
    }
  }

  if (location.href.match('p.gygpm.com/m/#/buyDetails')) {
    console.log(new Date().getHours())
    if (
      (new Date().getHours() == 10 || new Date().getHours() == 13 || new Date().getHours() == 20) &&
      new Date().getMinutes() == 0
    ) {
      if (new Date().getSeconds() <= 30)
      setTimeout(() => {
        window.close()
      }, 0 + Math.floor(Math.random() * 0))
      else
      setTimeout(() => {
        location.href = GM_getValue('back_url')
      }, 2500 + Math.floor(Math.random() * 0))
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
