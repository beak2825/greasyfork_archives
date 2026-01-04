// ==UserScript==
// @name         淘宝订单号
// @namespace    http://tampermonkey.net/
// @version      2024-10-04
// @description  淘宝订单号，是会自动生成15号订单号的
// @author       x
// @match        https://refund2.taobao.com/dispute/fillGoodsLogistics.htm?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511478/%E6%B7%98%E5%AE%9D%E8%AE%A2%E5%8D%95%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/511478/%E6%B7%98%E5%AE%9D%E8%AE%A2%E5%8D%95%E5%8F%B7.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
// 获取目标元素
var targetElement = document.querySelector("#fillGoodsLogisticsContainerPC_1\\@1-input");
 
// 检查是否找到了元素
if (targetElement) {
  // 为元素添加双击事件监听器
  targetElement.addEventListener('dblclick', function() {
    // 生成一个随机的15位数字，确保第一位不是0
    var random15Digits;
    do {
      random15Digits = Math.floor(Math.random() * 1000000000000000).toString().padStart(15, '0');
    } while (random15Digits.startsWith('0'));
 
    // 设置目标元素的值为随机生成的15位数字
    targetElement.value = random15Digits;
  });
} else {
  console.error('未找到目标元素');
}
    // Your code here...
})();
 
 
const MyConfig = {
  name: '',
  id: '',
  shopTitle: '',
  couponPrice: 0,
  originalPrice: 0,
  
  isValid: () => {
    return /\d+/.test(MyConfig.id)
  }
}
 
function init() {
  const insertCSS = `
.ac-btn-father{
  font-size: 32px;
  font-weight: bold;
  font-family: "microsoft yahei";
}
.ac-btn{
  opacity: 0.85;
  color: #f95f52;
  cursor: pointer;
}
.ac-btn:hover{
  color: #FFC800D8 !important;
  text-shadow: 0 0 rgba(242,33,49,30),0 0 0 rgba(242,33,49,30),0 1px 1px rgba(242,33,49,30),1px 0 1px rgba(242,33,49,30),-1px 0 1px rgba(242,33,49,30),0 0 1px rgba(242,33,49,30) !important;
}
`;
  const insertJS = `
const openUrl = function(node){
    if(node.dataset.url.indexOf("javascript:void") < 0) window.open(node.dataset.url);
};
`;
  const insertHTML = `
<div class="ac-btn-father">
    <span class="ac-btn ac-btn-click" data-url="javascript:void(0);" onclick="openUrl(this)">
        查找中
    </span>
    <span class="ac-btn ac-btn-click" data-url="" onclick="openUrl(this)">
        [站内搜]
    </span>
    <span class="ac-btn ac-btn-click" data-url="" onclick="openUrl(this)">
        [找相似]
    </span>
</div>
 
`
  MyApi.addStyle(insertCSS)
  MyApi.addScript(insertJS)
  MyApi.safeWaitFunc('[class*="ItemHeader--mainTitle"]', node => {
    node.insertAdjacentHTML('afterend', insertHTML);
    setTimeout(() => {
      initSite()
    }, 100)
  })
  MyApi.safeWaitFunc('[class*="tb-main-title"]', node => {
    node.insertAdjacentHTML('afterend', insertHTML);
    setTimeout(() => {
      initSite()
    }, 100)
  })
}
function initSite() {
  
  MyConfig.id = MyApi.getUrlAttribute('id')
  MyConfig.name = document.querySelector('.tb-main-title, h1[class*="ItemHeader--mainTitle"]').innerText.trim()
  
  resetUrls(getUrls())
  checkCoupon()
 
  function reInitConfig() {
    // 淘宝、天猫、老版淘宝
    try{
      MyConfig.originalPrice = document.querySelector('#J_PromoPriceNum, .tb-rmb-num, [class*="priceText"]').innerText.trim().split('-')[0]
      MyConfig.shopTitle = document.querySelector('.tb-shop-name, .shop-name-link, [class*="ShopHeader--title"]').innerText.trim()
    }catch (e) {}
  }
 
  function getUrls() {
    const findUrl = 'https://www.ntaow.com/coupon.html?mQuery=' + encodeURIComponent(MyConfig.name)
    const innerUrl = 'https://s.taobao.com/search?q=' + encodeURIComponent(MyConfig.name)
    const similarUrl = 'https://www.ntaow.com/coupon.html?mQuery=' + encodeURIComponent(MyConfig.name)
    return [
      findUrl,
      innerUrl,
      similarUrl
    ]
  }
 
  function resetUrls(urls = []) {
    try{
      document.querySelectorAll('.ac-btn-click').forEach((one, index) => {
        one.setAttribute('data-url', urls[index])
      })
    }catch (e){}
  }
 
  function resetFindTitle(newTitle) {
    document.querySelectorAll('.ac-btn-click')[0].innerText = newTitle
  }
 
  async function checkCoupon() {
    if (MyConfig.isValid()) {
      const [err, res] = await MyApi.http.get(`https://api.ntaow.com/api/coupon/tran?id=${MyConfig.id}&title=${MyConfig.name}`)
      if (!err) {
 
        reInitConfig()
        
        const couponList = JSON.parse(res)
        const couponElement = findBestCoupon(couponList) || {}
        const {
          quan= '', // 优惠券价格
          shop_title = '', // 店家名字
          price= '' // 商品价格预期
        } =  couponElement
 
        const couponPrice = +quan
        // MyConfig.name = title
        MyConfig.couponPrice = couponPrice
        if(couponPrice > 0) {
          resetFindTitle(`!${couponPrice}元优惠券!`)
        } else {
          resetFindTitle(`无优惠券`)
        }
        resetUrls(getUrls())
      }
    }
  }
  
  function findBestCoupon(couponList) {
    for (const couponElement of couponList) {
      const {
        quan= '', // 优惠券价格
        shop_title = '', // 店家名字
        price= '' // 商品价格预期
      } =  couponElement
      
      if(shop_title === MyConfig.shopTitle && price === MyConfig.originalPrice) {
        return couponElement
      }
    }
    return couponList.length && couponList[0]
  }
}
 
const MyApi = (() => {
  function addStyle(css, className = '', isReload = false){ // 添加CSS代码，不考虑文本载入时间，带有className
    var tout = setInterval(function(){
      if(document.body != null){
        clearInterval(tout);
        if(className) {
          // 节点不存在,或者是准备覆盖的时候
          if(isReload === false && document.querySelector("."+className) != null){return;}
          
          // 节点已经存在,并且不准备覆盖
          try {document.querySelector("."+className).remove();}catch (e){}
        }
        const cssNode = document.createElement("style");
        if(className) {
          cssNode.className = className;
        }
        cssNode.innerHTML = css;
        try{document.body.appendChild(cssNode);}catch (e){console.log(e.message);}
      }
    }, 200);
  }
  
  function addScript(scriptInner) {
    const scriptNode = document.createElement('script')
    scriptNode.innerText = scriptInner
    document.head.appendChild(scriptNode)
  }
 
  const safeWaitFunc = (selector, callbackFunc = node => {}, findTick = 200, clearAfterFind = true, timeout = 20000 * 1000) => {
    let count = timeout / findTick
    const t_id = setInterval(function() {
      if(count-- < 0) {
        clearInterval(t_id)
      }
      
      if ((typeof (selector) == "string")) {
        let selectRes = document.querySelectorAll(selector);
        if (selectRes.length <= 0) return
        if (selectRes.length === 1) selectRes = selectRes[0];
        if (clearAfterFind) clearInterval(t_id);
        callbackFunc(selectRes);
      } else if (typeof (selector) === "function") {
        const res =  selector()
        if(res.length > 0) {
          if (clearAfterFind) clearInterval(t_id);
          callbackFunc(selector()[0]);
        } else if(res) {
          if (clearAfterFind) clearInterval(t_id);
          callbackFunc();
        }
      }
    }, findTick);
  }
 
  function getUrlAttribute(attribute, needDecode = true){
    var searchValue = (window.location.search.substr(1) + "").split("&");
    for (var i = 0; i < searchValue.length; i++) {
      var key_value = searchValue[i].split("=");
      var reg = new RegExp("^"+attribute+"$");
      if (reg.test(key_value[0])) {
        var searchWords = key_value[1];
        return needDecode?decodeURIComponent(searchWords):searchWords;
      }
    }
  }
  
  const http = {
    async get(url) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url,
          method: 'GET',
          timeout: 10000,
          onload: resp => resolve([null, resp.responseText]),
          onerror: resp => reject([resp, {}])
        })
      })
    },
    async post(url, data) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          url,
          data,
          method: 'POST',
          timeout: 10000,
          onload: resp => resolve([null, resp.responseText]),
          onerror: resp => reject([resp, {}])
        })
      })
    }
  }
 
  return {
    addStyle,
    addScript,
    safeWaitFunc,
    getUrlAttribute,
    http
  }
})()
 
if(typeof(acTB) == "undefined"){
 // acTB = 1;
 // init()
}
 
 