  // ==UserScript==
  // @name         Steam 轻便管理购物车
  // @namespace    http://tampermonkey.net/
  // @version      0.91
  // @description  轻便管理购物车
  // @author       ku mi
  // @include      /https?:\/\/store\.steampowered\.com\/(?!cart|widget)\/*/
  // @include      /https?:\/\/steamcommunity\.com\/(?!chat|mobileconf)\/*/
  // @grant        GM_xmlhttpRequest
  // @grant        GM_addStyle
  // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/407552/Steam%20%E8%BD%BB%E4%BE%BF%E7%AE%A1%E7%90%86%E8%B4%AD%E7%89%A9%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/407552/Steam%20%E8%BD%BB%E4%BE%BF%E7%AE%A1%E7%90%86%E8%B4%AD%E7%89%A9%E8%BD%A6.meta.js
  // ==/UserScript==
(() => {
class Cart {
  constructor() {
 
    this.sessionID = g_sessionID
    this.increment = 0
    this.firstFlag = true
    this.showFlag = false
    this.init()
  }
  init() {
    this.initCart()
    if(location.host === 'steamcommunity.com') {
      this.toRemoveAll.disabled = true
      this.toRemoveAll.classList.add('min_error')
    }
    if (/https:\/\/store\.steampowered\.com\/wishlist\/.+/.test(location.href)) {
      this.wishFun()
    } else if(/https:\/\/store\.steampowered\.com\/(?:app|bundle|sub)\/.+/.test(location.href)){
      this.storeFun()
    } else if(/https:\/\/steamcommunity\.com\/(?:profiles|id)\/.+\/home\/.*/.test(location.href)) {
      this.friendActivityFun()
    }
  }
  setCookie(time, cookie) {
    const date = new Date();
    date.setTime(date.getTime() + time)
    const expires = "expires=" + date.toUTCString()
    document.cookie = cookie + expires + '; path=/'
  }
  bindClick(el, fn) {
    el.addEventListener('click', fn)
  }
  createButton() {
     this.query('.blotter_gamepurchase_details a', true).forEach(item => {
       const nextElement = item.nextSibling
       if(item.classList.contains('already_change') && nextElement.nodeName === 'BUTTON') {
         nextElement.hidden = !this.showFlag
       }else if(this.showFlag) {
         item.classList.add('already_change')
         const button = document.createElement('button')
         button.innerText = '加入购物车'
         button.className = 'make_cart_button cart_item_add mini_margin'
         item.parentElement.insertBefore(button, item.nextSibling)
       }
     })
  }
  initEvent() {
    let oldLineitem_gid = ''
    this.bindClick(this.toHide, e => {
      this.showFlag = e.target.innerText === '显示'
      if (this.firstFlag) {
        this.firstFlag = false
        this.request({ url: 'https://store.steampowered.com/cart/', method: 'GET' }).then(res => this.getCartItem(res))
      }
      this.outWrapper.className = this.showFlag ? 'to_transform_show' : 'to_transform_hiden'
      e.target.innerText = this.showFlag ? '隐藏' : '显示'
      this.createButton(this.showFlag)
    })
    this.bindClick(this.toRemoveAll, () => {
      ShowConfirmDialog('', '您确定要移除所有您购物车中的物品吗？', '是', '否').done(() => {
        this.setCookie(-10 * 24 * 60 * 60 * 1000, 'shoppingCartGID=-1; ')
        this.query('.cart_item', true, this.outWrapper).forEach(item => {
          item.className = 'cart_item cart_item_remove'
        })
        let time = setTimeout(() => {
          clearTimeout(time)
          this.cartWrapper.innerHTML = ''
          this.totalPrice.innerText = this.totalPrice.innerText.replace(/[\d\.,]/g, '') + ' ' + 0
        }, 300)
      })
    })
    this.bindClick(this.toCart, () => window.open('https://store.steampowered.com/cart/'))
    this.bindClick(this.outWrapper, async e => {
      const reamoveA = e.target
      const lineitem_gid = reamoveA.dataset.lineitem_gid
      if (!reamoveA.classList.contains('remove_link') || !lineitem_gid || oldLineitem_gid === lineitem_gid) return
      oldLineitem_gid = lineitem_gid
      await this.request({ url: 'https://store.steampowered.com/cart/', method: 'POST', data: `action=remove_line_item&sessionid=${this.sessionID}&lineitem_gid=${lineitem_gid}&cart=${this.cart}` })
      const cartItem = reamoveA.parentElement.parentElement.parentElement
      const removePrice = Number(reamoveA.previousElementSibling.innerText.match(/[\d\.,]+/)[0].replace(/[,\s]*/g, ''))
      const [, currency, priceNum] = this.totalPrice.innerText.match(/((?!\d).+?)([\d,\.\s]+)/)
      const rePrice = Number(priceNum.replace(/[,\s]*/g, ''))
      this.totalPrice.innerText = currency + ' ' + (rePrice - removePrice).toLocaleString()
      cartItem.className = 'cart_item cart_item_remove'
      let time = setTimeout(() => {
        clearTimeout(time)
        cartItem.remove()
      }, 300)
    })
  }
  initElement() {
    this.cartWrapper = this.query('.cart_wrapper', false, this.outWrapper)
    this.toCart = this.query('.to_cart', false, this.outWrapper)
    this.toRemoveAll = this.query('.to_removeAll', false, this.outWrapper)
    this.toHide = this.query('.to_hide', false, this.outWrapper)
    this.totalPrice = this.query('.mini_price', false, this.outWrapper)
    this.loading = this.query('.mini_loading', false, this.outWrapper)
  }
  debounce(cb) {
    let time
    cb()
    return () => {
      if(time) clearTimeout(time)
      time = setTimeout(() => {
        clearTimeout(time)
        time = null
        cb()
      }, 1000)
    }
  }
  changeItem() {
    ;[...this.wishContent.children].forEach(item => {
      let cart = this.query('.btn_medium:not(.already_change)', false, item)
      if (!cart) return
      const { appId } = item.dataset
      const { subs } = this.g_rgAppInfo[appId]
      const subId = subs.length ? `${subs[0].id}` : ''
      Object.assign(cart.dataset, { c_appid: appId, c_subid: subId })
      cart.href = 'javascript:void(0);'
      cart.classList.add('already_change')
    })
  }
  async request(data) {
    return new Promise((resolve, reject) => {
      this.increment++
      if (this.firstFlag) this.firstFlag = false
      this.loading.style.display = 'block'
      GM_xmlhttpRequest({
        ...data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        onload: ({ responseText }) => {
          resolve(responseText)
          if (--this.increment === 0) this.loading.style.display = 'none'
        }
      })
    })
  }
  create(el, pel) {
    const ele = document.createElement(el)
    pel.appendChild(ele)
    return ele
  }
  query(el, flag, pel = document) {
    return flag ? [...pel.querySelectorAll(el)] : pel.querySelector(el)
  }
  storeFun() {
    const bundleReg = /addBundleToCart\(\s?(\d+)(?:,\s1\s)?\)/
    const cartReg = /addToCart\(\s?(\d+)(?:,\s1\s)?\)/
    let cartButton = this.query('.btn_green_steamui.btn_medium', true)
    if (!cartButton.length) cartButton = this.query('.btnv6_green_white_innerfade.btn_medium', true)
    if (!cartButton.length) return
      cartButton.forEach(item => {
          const discount = this.query('.discount_pct')
          if(discount.innerText === '-100%') return
          if(this.query('#freeGameBtn')) return
          const subMatch = cartReg.exec(item.href)
          if (!subMatch) {
              if (item.href === 'javascript:addAllDlcToCart();') {
                  item.dataset.c_dlcid = this.query(('[name="subid[]"]'), true).map(it => 'subid[]=' + it.value).join('&')
              } else {
                  const bundleidMatch = bundleReg.exec(item.href)
                  if (!bundleidMatch) return
                  item.dataset.c_bundleid = bundleidMatch[1]
              }
          } else {
              item.dataset.c_subid = subMatch[1]
          }

          item.href = 'javascript:void(0);'
          this.bindClick(item, async e => {
              let target = e.target
              if (target.nodeName === 'SPAN') target = target.parentElement
              const { c_subid: sub, c_bundleid: bundleid, c_dlcid: dlcid } = target.dataset
              const res = await this.request({ url: 'https://store.steampowered.com/cart/', method: 'POST', data: `action=add_to_cart&${sub ? `subid=${sub}` : dlcid ? dlcid : `bundleid=${bundleid}`}&sessionid=${this.sessionID}` })
              this.getCartItem(res)
          })
    })
  }
  wishFun() {
    let time = setInterval(() => {
      this.wishContent = this.query('#wishlist_ctn')
      const wishList = this.wishContent.children
      if (!wishList.length) return
      clearInterval(time)
      this.g_rgAppInfo = g_rgAppInfo
      this.bindClick(this.wishContent, async (e) => {
        let target = e.target
        if (target.nodeName === 'SPAN') target = target.parentElement
        if (!target.classList.contains('already_change')) return
        const sub = target.dataset.c_subid
        if (!sub) return
        const res = await this.request({ url: 'https://store.steampowered.com/cart/', method: 'POST', data: `action=add_to_cart&subid=${sub}&sessionid=${this.sessionID}` })
        this.getCartItem(res)
      })
      document.onscroll = this.debounce(this.changeItem.bind(this))
    }, 2000)
  }
  activityScroll() {
    this.query('.blotter_gamepurchase .blotter_author_block>div:last-child>a:not(.alreay_change)', true).forEach(item => {
    const parent = item.parentElement
    const button = this.create('button', parent)
    button.className = 'make_cart_button cart_item_add'
    button.innerText = '添加购物车'
    item.classList.add('alreay_change')
    })
    this.createButton()
  }
  friendActivityFun() {
    this.request({ url: 'https://store.steampowered.com/cart/', method: 'GET' }).then(res => this.getCartItem(res))
    this.firstFlag = false
    const wrapper = this.query('#ModalContentContainer', false)
    document.onscroll = this.debounce(this.activityScroll.bind(this))
    this.bindClick(wrapper, async e => {
      const ele = e.target
      let res
      if (!ele.classList.contains('make_cart_button')) return
      const result = ele.previousElementSibling.href.match(/(sub|bundle)\/(\d+)/)
      if (result) {
        const [, type, id] = result
        res = await this.request({ url: 'https://store.steampowered.com/cart/', method: 'POST', data: `action=add_to_cart&${type === 'sub' ? `subid=${id}` : `bundleid=${id}`}&sessionid=${this.sessionID}` })
      } else {
        const html = await this.request({ methods: 'GET', url: ele.previousElementSibling.href })
        console.log(html)
        const subId = html.match(/<a(?: data-panel=".+")? class="btn_green_steamui btn_medium" href="javascript:addToCart\((\d+)\);"/)
        if(!subId) return
        res = await this.request({ url: 'https://store.steampowered.com/cart/', method: 'POST', data: `action=add_to_cart&subid=${subId[1]}&sessionid=${this.sessionID}`})
      }
      if(!res) return
      this.getCartItem(res)
    })
  }
  getCartItem(htmlStr) {
    const cartIdReg = /<input type="hidden" name="sessionid" value="(\w+)">[\s\S]+?<input type="hidden" name="cart" value="(-1|\d+)">/
    const cartIdResule = htmlStr.match(cartIdReg)
    const [, sessionId, cartId] = cartIdResule
    htmlStr = htmlStr.substring(cartIdResule.index)
    this.sessionID = sessionId
    this.cart = cartId
    let cartItemReg = /(<div(?: data-panel=".+")? class="cart_item" >[\s\S]+?<div style="clear: left"><\/div>\s+<\/div>)/igm
    let matchItem = null
    let lastResult = null
    let cartHtml = ''
    while (matchItem = cartItemReg.exec(htmlStr)) {
      const [, str] = matchItem
      cartHtml += str
      lastResult = matchItem
    }
    this.totalPrice.innerHTML = (lastResult ? htmlStr.substring(lastResult.index) : htmlStr).match(/<div id="cart_estimated_total" class="price">([\s\S]+?)<\/div>/)[1].trim()
    this.cartWrapper.innerHTML = cartHtml
    const cartItemList = this.query('.cart_item', true, this.outWrapper)
    cartItemList.forEach(item => {
      item.classList.add('cart_item_add')
      this.query('a:not([href^=javascript])', true, item).forEach(it => (it.target = '_blank'))
      const removeLink = this.query('.remove_link', false, item)
      removeLink.dataset.lineitem_gid = removeLink.href.match(/javascript:removeFromCart\('(\d+)'\)/)[1]
      removeLink.href = 'javascript:void(0);'
    })
  }
  initCart() {
    this.outWrapper = this.create('div', document.body)
    this.outWrapper.id = 'mini_cart'
    this.outWrapper.innerHTML = `<div class="mini_ul"><div class="button_option"><button class="to_hide">显示</button><button class="to_cart">去购物车</button><button class="to_removeAll">移除所有</button></div><div class="cart_total_price"><div style="flex: 1;">预计总额</div><div class="mini_price"></div></div><div class="mini_loading"></div><div class="cart_wrapper"></div></div>`
    this.initElement()
    this.initEvent()
  }
}
new Cart()
GM_addStyle(`.cart_item_remove{animation:removeitem .3s forwards;transform-origin:center;}.cart_item_add{animation:additem .3s forwards;transform-origin:center;}@keyframes additem{from{transform:scale(0);}to{transform:scale(1);}}@keyframes removeitem{to{transform:scale(0);}}.mini_ul .cart_total_price{font-size:12px;line-height:50px;height:50px;display:flex;padding-right:16px;color:#fff;justify-content:space-between;}.mini_ul .cart_total_price .mini_price{flex:1;text-align:right;}.mini_ul .mini_loading{background-image:url(https://steamcommunity-a.akamaihd.net/public/images/login/throbber.gif);width:32px;height:32px;margin:0 auto 10px;display:none;}#mini_cart{border-radius:10px;position:fixed;width:300px;z-index:999;height:550px;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;right:0;bottom:0;background-image:linear-gradient(to top right,#360033,#0b8793);padding:0 15px 0 15px;box-sizing:border-box;transform:translateY(500px);}.mini_ul .cart_item{display:flex;margin-bottom:15px;font-size:12px;min-height:50px;}.mini_ul .cart_item_price.with_discount{padding:0;text-align:center;}.mini_ul .cart_item_price [class="price"]{color:#fff;}.mini_ul .cart_item_price{padding:0}.mini_ul .cart_item_img{margin:0;}.mini_ul .cart_item_price_container{order:1;width:40px;padding:0;text-align:center;}.mini_ul .original_price.price{text-decoration:line-through;color:#8F98A0;}.mini_ul .cart_item_desc{padding:0;margin:0 15px;display:flex;width:70px;flex-direction:column;}.mini_ul .cart_item_desc a{width:100%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}.mini_ul .cart_item_desc br{display:none;}.mini_ul .cart_item_desc_ext{text-overflow:ellipsis;overflow:hidden;white-space:nowrap;color:#ffcc6a;}.mini_ul .cart_item_img{flex-basis:120px;}.mini_ul .cart_wrapper{height:470px;overflow-y:auto;}.mini_ul .cart_wrapper::-webkit-scrollbar{height:12px;width:14px;background:transparent;z-index:12;overflow:visible;}.mini_ul .cart_wrapper::-webkit-scrollbar-thumb{width:10px;background-color:#434953;border-radius:10px;z-index:12;border:4px solid rgba(0,0,0,0);background-clip:padding-box;transition:background-color .32s ease-in-out;margin:4px;min-height:32px;min-width:32px;}.mini_ul .button_option{display:flex;justify-content:space-around;margin-top:10px;}.mini_ul .remove_link{text-decoration:none;color:#ffffff;}.mini_ul .button_option > button,.make_cart_button{border:none;outline:none;color:#FFF;font-size:12px;border-radius:7px;padding:5px 8px;width:70px;cursor:pointer;}.make_cart_button{width:80px;background-image:linear-gradient(to bottom right,#4568dc,#b06ab3);}.to_hide{background:linear-gradient(to bottom right,#4e54c8,#8f94fb);}.to_cart{background-image:linear-gradient(to bottom right,#24c6dc,#514a9d);}.to_removeAll{background-image:linear-gradient(to bottom right,#b24592,#f15f79);}.button_option .to_removeAll.min_error{cursor:not-allowed;}.to_transform_hiden{animation:hidenAn .5s forwards;}.to_transform_show{animation:showAn .5s forwards;}.mini_margin{margin:10px;}@keyframes hidenAn{from{transform:translateY(0);}to{transform:translateY(500px);}}@keyframes showAn{from{transform:translateY(500px);}to{transform:translateY(0px);}}}`)
})()