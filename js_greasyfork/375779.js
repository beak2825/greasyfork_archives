// ==UserScript==
// @name         快速录单发单
// @namespace    http://tampermonkey.net/
// @version      0.104
// @description  快速录单，快速发单
// 变化：        马蜂窝录单改成到阿目云转化的方式 最后修改于：2021-2-23
// @author       ヽ(￣▽￣)و
// @match        *://erp.himudidi.com/*
// @match        http://fp.lxfx.xyz:9011/orderTemplate
// @match        *://www.vipdlt.com/order/orderList
// @match        *://imvendor.ctrip.com*
// @match        *://tongzhou.meituan.com/order-new/index.html
// @match        *://mpc.meituan.com/old/otp.html
// @match        *://tb2cadmin.qunar.com/supplier/order_list.qunar*
// @match        *://tb2cadmin.qunar.com/supplier/order/showInfo?displayId=*
// @match        *://tb2cadmin.qunar.com/supplier/order/showDetail?displayId=*
// @match        *://vbooking.ctrip.com/*/OrderManagement/DetailVBKOrder.aspx*
// @match        *://vbooking.ctrip.com/order/orderDetail?orderId=*
// @match        *://b.mafengwo.cn/*/business/order
// @match        *://b.mafengwo.cn/*
// @match        *://seller.mafengwo.cn
// @match        *://orderdetail.fliggy.com/tripOrderDetail.htm?*orderId=*
// @match        *://sell.fliggy.com/icenter/trade.htm*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      meituan.com
// @connect      erp.himudidi.com
// @connect      touch.dujia.qunar.com
// @connect      ctrip.com
// @connect      fliggy.com
// @connect      alitrip.com
// @require      https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js
// @require      https://cdn.bootcss.com/vue/2.6.11/vue.min.js
// @downloadURL https://update.greasyfork.org/scripts/375779/%E5%BF%AB%E9%80%9F%E5%BD%95%E5%8D%95%E5%8F%91%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/375779/%E5%BF%AB%E9%80%9F%E5%BD%95%E5%8D%95%E5%8F%91%E5%8D%95.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
;
/*! js-cookie v3.0.0-beta.0 | MIT */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e=e||self,function(){var t=e.Cookies,o=e.Cookies=n();o.noConflict=function(){return e.Cookies=t,o}}())}(this,function(){"use strict";function e(){for(var e={},n=0;n<arguments.length;n++){var t=arguments[n];for(var o in t)e[o]=t[o]}return e}function n(e){return e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)}return function t(o){function r(n,t,r){if("undefined"!=typeof document){"number"==typeof(r=e(i.defaults,r)).expires&&(r.expires=new Date(1*new Date+864e5*r.expires)),r.expires&&(r.expires=r.expires.toUTCString()),t=o.write?o.write(t,n):encodeURIComponent(String(t)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),n=encodeURIComponent(String(n)).replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var f in r)r[f]&&(c+="; "+f,!0!==r[f]&&(c+="="+r[f].split(";")[0]));return document.cookie=n+"="+t+c}}var i={defaults:{path:"/"},set:r,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],r={},i=0;i<t.length;i++){var c=t[i].split("="),f=c.slice(1).join("=");'"'===f.charAt(0)&&(f=f.slice(1,-1));try{var u=n(c[0]);if(r[u]=(o.read||o)(f,u)||n(f),e===u)break}catch(e){}}return e?r[e]:r}},remove:function(n,t){r(n,"",e(t,{expires:-1}))},withConverter:t};return i}(function(){})});

//     Zepto.js
//     (c) 2010-2016 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var zepto = $.zepto, oldQsa = zepto.qsa, oldMatches = zepto.matches

  function visible(elem){
    elem = $(elem)
    return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
  }

  // Implements a subset from:
  // http://api.jquery.com/category/selectors/jquery-selector-extensions/
  //
  // Each filter function receives the current index, all nodes in the
  // considered set, and a value if there were parentheses. The value
  // of `this` is the node currently being considered. The function returns the
  // resulting node(s), null, or undefined.
  //
  // Complex selectors are not supported:
  //   li:has(label:contains("foo")) + li:has(label:contains("bar"))
  //   ul.inner:first > li
  var filters = $.expr[':'] = {
    visible:  function(){ if (visible(this)) return this },
    hidden:   function(){ if (!visible(this)) return this },
    selected: function(){ if (this.selected) return this },
    checked:  function(){ if (this.checked) return this },
    parent:   function(){ return this.parentNode },
    first:    function(idx){ if (idx === 0) return this },
    last:     function(idx, nodes){ if (idx === nodes.length - 1) return this },
    eq:       function(idx, _, value){ if (idx === value) return this },
    contains: function(idx, _, text){ if ($(this).text().indexOf(text) > -1) return this },
    has:      function(idx, _, sel){ if (zepto.qsa(this, sel).length) return this }
  }

  var filterRe = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),
      childRe  = /^\s*>/,
      classTag = 'Zepto' + (+new Date())

  function process(sel, fn) {
    // quote the hash in `a[href^=#]` expression
    sel = sel.replace(/=#\]/g, '="#"]')
    var filter, arg, match = filterRe.exec(sel)
    if (match && match[2] in filters) {
      filter = filters[match[2]], arg = match[3]
      sel = match[1]
      if (arg) {
        var num = Number(arg)
        if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '')
        else arg = num
      }
    }
    return fn(sel, filter, arg)
  }

  zepto.qsa = function(node, selector) {
    return process(selector, function(sel, filter, arg){
      try {
        var taggedParent
        if (!sel && filter) sel = '*'
        else if (childRe.test(sel))
          // support "> *" child queries by tagging the parent node with a
          // unique class and prepending that classname onto the selector
          taggedParent = $(node).addClass(classTag), sel = '.'+classTag+' '+sel

        var nodes = oldQsa(node, sel)
      } catch(e) {
        console.error('error performing selector: %o', selector)
        throw e
      } finally {
        if (taggedParent) taggedParent.removeClass(classTag)
      }
      return !filter ? nodes :
        zepto.uniq($.map(nodes, function(n, i){ return filter.call(n, i, nodes, arg) }))
    })
  }

  zepto.matches = function(node, selector){
    return process(selector, function(sel, filter, arg){
      return (!sel || oldMatches(node, sel)) &&
        (!filter || filter.call(node, null, arg) === node)
    })
  }
})(Zepto)

let CSS = `
.myMark{color:cyan !important;background:#333 !important;}/* 已经点击过的订单 */
i.myMark{background:inherit !important;}
.myMark:before{color:cyan !important;background:#888 !important;}/* 已经点击过的订单 */

/* icons */
.icon-close:before {
  width: 1em; display: inline-block;
  content: url("data:image/svg+xml,%3Csvg class='icon' style='width:1em;height:1em;vertical-align:middle' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' fill='currentColor' overflow='hidden'%3E%3Cpath d='M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9c-4.4 5.2-.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z'/%3E%3C/svg%3E");
}
.icon-link:before {
  width: 1em; display: inline-block;
  content: url("data:image/svg+xml,%3Csvg class='icon' style='width:1em;height:1em;vertical-align:middle' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' fill='currentColor' overflow='hidden'%3E%3Cpath d='M574 665.4c-3.1-3.1-8.2-3.1-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8c-3.1-3.1-8.2-3.1-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6c-3.1 3.1-3.1 8.2 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6c-3.1 3.1-3.1 8.2 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3c-3.1-3.1-8.2-3.1-11.3 0L372.3 598.7c-3.1 3.1-3.1 8.2 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z'/%3E%3C/svg%3E");
}
.icon-detail:before {
  width: 1em; display: inline-block;
  content: url("data:image/svg+xml,%3Csvg class='icon' style='width:1em;height:1em;vertical-align:middle' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' fill='currentColor' overflow='hidden'%3E%3Cpath d='M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656zM492 400h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm0 144h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm0 144h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H492c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zM340 368a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm0 144a40 40 0 1 0 80 0 40 40 0 1 0-80 0zm0 144a40 40 0 1 0 80 0 40 40 0 1 0-80 0z'/%3E%3C/svg%3E");
}
.icon-money:before {
  width: 1em; display: inline-block;
  content: url("data:image/svg+xml,%3Csvg class='icon' style='width:1em;height:1em;vertical-align:middle' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' data-spm-anchor-id='a313x.7781069.1998910419.i3' fill='currentColor' overflow='hidden'%3E%3Cpath d='M783.612 167.565L575.025 463.258h164.392v65.367H547.91v90.024h191.507v66.184H547.91v131.088h-98.529V684.833H250.865V618.65H449.38v-90.024H250.865v-65.367h169.374L213.646 167.565h111.089c96.536 146.85 155.141 240.007 175.922 279.397h1.992c7.047-16.226 26.331-48.891 57.787-97.996l118.135-181.4h105.04z'/%3E%3C/svg%3E");
}
.icon-meituan:before {
  width: 1em; display: inline-block;
  content: url("data:image/svg+xml,%3Csvg class='icon' style='width:1em;height:1em;vertical-align:middle' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' fill='currentColor' overflow='hidden'%3E%3Cpath d='M974.188 340.625c-53.156-39.281-138.094-56.719-138.094-56.719-16.969-24-27.656-39.281-53.156-56.719-36.094-21.844-59.531-13.125-59.531 8.719-2.156 17.438 12.75 17.438 40.406 21.844 27.656 2.156 36.094 21.844 36.094 21.844-51-15.281-118.969-15.281-123.281 21.844-2.156 32.719 53.156 28.406 82.875 24 29.719-2.156 23.344 21.844 16.969 30.563-6.375 6.563-31.875 15.281-91.406 0-61.594-13.125-123.281-28.406-218.906-32.719-97.781-6.563-193.406 39.281-261.375 45.844s-144.469-24-144.469-24c-38.25-13.125-27.656 15.281-21.281 21.844 110.531 100.313 278.344 91.594 278.344 91.594-23.344 72 8.531 109.125 8.531 109.125 27.656-21.844 59.531-32.719 59.531-32.719-74.344 52.313-153 146.156-65.906 148.313 89.25 6.563 204 122.156 204 122.156s23.344 2.156 12.75-61.125c-8.531-63.281-97.781-69.844-97.781-69.844 16.969 0 82.875-15.281 127.5-28.406 44.625-15.281 91.406-52.313 97.781-56.719 6.375-6.563 12.75-15.281 0-28.406s-6.375-17.438 8.531-37.125c14.906-17.438 95.625-72 174.281-102.563 80.719-32.719 89.25-8.719 129.656-24 38.25-26.063-2.063-56.625-2.063-56.625z' fill='%23FFAC29'/%3E%3C/svg%3E");
}

/*图标之外的修饰*/
.icon-button:before{
  border-radius: 0.2em !important;
  border: 1px solid #999 !important;
  padding: 1px !important;
  box-shadow: 0 0 2px 0px cyan !important;
  background: white;
  height: 1.5em !important; /*这里主要是马蜂窝会超高，这里限制一下*/
  width: 1.5em !important; /*这里主要是马蜂窝会超高，这里限制一下*/
  cursor: pointer;
}
.icon-button:hover:before{
  background: cyan !important;
}

/* notify */
@-webkit-keyframes fadeInRight{from{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);}to{opacity:1;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);}}
@keyframes fadeInRight{from{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);}to{opacity:1;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);}}
@-webkit-keyframes fadeOutRight{from{opacity:1;}to{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);}}
@keyframes fadeOutRight{from{opacity:1;}to{opacity:0;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);}}
.fadeInRight{animation:fadeInRight .3s;-webkit-animation:fadeInRight .3s;}
.fadeOutRight{animation:fadeOutRight 2s;-webkit-animation:fadeOutRight 2s;}
`;

GM_addStyle(CSS);
// ##############  CONFIG BEGIN  ##############
// 文字发单模板。这里可以根据需要自行调整。双尖括号的内容，比如<<日期>>不能修改，否则无效。其他文字随意增删改。
const TEXT_ORDER_TEMPLATE = '<<日期>>，<<酒店>>，<<房型>>，<<间数>>间<<晚数>>晚，<<名字>> <<电话>>，结算：'

// 自动显示订单面板
const AUTOSHOWORDERPANEL = false;

const PLATFORMRATE = {
  "美团度假": 8,
  "马蜂窝（阿目旅行）": 5,
  "携程酒店": 0,
  "美团酒店": 0,
  "去哪儿网度假": 6,
  "飞猪": 2.5,
};
const MeituanHotelNameRE = /[^+ ，！,入住晚]+[^,+]/g;
// const MeituanHotelNameRE = /[^+ ，！,【】入住晚]+(酒店|客栈|公寓|度假村|别墅|宾馆)/g;
const QunarHotelNameRE = /[^+ ，！,【】入住晚]+(酒店|客栈|公寓|度假村|别墅|宾馆|山庄)/g;
const MafengwoHotelNameRE = /[^+ ，！,/【】入住()晚]+(酒店|客栈|公寓|度假村|别墅|宾馆|饭店)/g;

const DAY2MS = 24*60*60*1000;
const MYTEL = "13802518340";
const MYNAME = "庄庆泉";
// ############## CONFIG END ##############



// 返回渠道名称
function channel() {
  if (location.pathname == "/MIP/Order/MIP/DltOrderList.aspx" || location.href == "https://www.vipdlt.com/order/orderList")
    return "ctripHotel";
  else if (location.host == "tongzhou.meituan.com" && location.pathname == "/order-new/index.html")
    return "meituanHotel";
  else if (new RegExp('https://b.mafengwo.cn/#/business/order').test(location.href))
    return "mafengwoVacation";
  else if (location.href.indexOf("https://mpc.meituan.com/old/otp.html#/jiujing/gtyOrder/detail-order?orderId=") > -1)
    return "meituanVacationOrderDetail";
  else if (location.href == "https://mpc.meituan.com/old/otp.html#/jiujing/gtyOrder/list-order"
    || location.href == "https://mpc.meituan.com/old/otp.html#/jiujing/gtyOrder/confirmOrderList"
    && self != top)
    return "meituanVacation";
  else if (location.href.indexOf("https://tb2cadmin.qunar.com/supplier/order_list.qunar") > -1)
    return "qunarVacation";
  else if (/tb2cadmin\.qunar\.com\/supplier\/order\/showInfo\?displayId=/.test(location.href)
    || /tb2cadmin\.qunar\.com\/supplier\/order\/showDetail\?displayId=/.test(location.href))
    return "qunarVacationDetail";
  // else if (/vbooking\.ctrip\.com\/order\/orderDetail\?orderId/.test(location.href))
  //   return "ctripVacation";
  else if (/orderdetail\.fliggy\.com\/tripOrderDetail\.htm\?.*orderId=*/.test(location.href))
    return "fliggyVacationDetail";
  else if (/sell\.fliggy\.com\/icenter\/trade\.htm.*\/trade\/order-management.*/.test(location.href))
    return "fliggyVacation";
  else if (location.host == "erp.himudidi.com")
    return "amuyun";
  else if(location.href == "http://fp.lxfx.xyz:9011/orderTemplate")
  return "orderTemplate"
  else
    return "Unknow";
}

let pagePlatformName = channel();
console.log(pagePlatformName);
// $hub 用于Vue通信，必须放在前面，后面才方便引用
unsafeWindow.$hub = new Vue({});
// 最后修改于 2020-8-20 08:57:12
const syncAmuyun = {
  // 我这里通常只需要用到1天的,date [yyyy-mm-dd_pid],可以使用自定义连接方式来代替生成FormData
  concatData (dataJson) {
    let dataString = '';
    for (let i in dataJson) {
      dataString += `${i}=${dataJson[i]}&`;
    }
    return dataString.slice(0, -1);
  },

  // 取回 PNS 数据
  getPns(spuPackageId, length=30){
    let postData = {
      id: spuPackageId,  // 供应商商品id(阿目云平台产品ID)，必须
      // start: "2019-06-05",  // 开始日期，可空，默认当天
      length: length, // 长度，日期的长度，可空，接口默认30，我这里默认60
    };
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        url: "http://erp.himudidi.com/api/calendar/get",
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; boundary=&; charset=UTF-8' },
        data: this.concatData(postData),
        responseType: "json",
        onload: function (data) { resolve(data.response); },
        onerror: function(data) { reject(data.response); }
      });
    });
  },

  // 从阿目云拿回来所有子产品JSON 数据
  getSpuPackagesInfo(spuId){
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method:"GET",
        url:`http://erp.himudidi.com/api/package/get?product_platform_number=${spuId}`,
        timeout:3000,
        responseType: "json",
        onload:function(response){
          resolve(response.response);
        },
        onerror:function(response){
          console.log("=====syncAmuyun.getSpuPackagesInfo ERROR =====");
          reject(response.response);
        }
      });
    });
  },

  // 所有子产品JSON数据 -> 转格式
  parseSpuPackagesInfo(SpuPackagesInfo){
    try {
      let pkgId2spupkgId = {};
      pkgId2spupkgId.spuId = SpuPackagesInfo.data[0].product_platform_package_id;
      let pkgs = SpuPackagesInfo.data;
      for(let i in pkgs){
        pkgId2spupkgId[pkgs[i].product_platform_package_id] = {
          spupkgId: pkgs[i].product_platform_relation_id,
          pkgTitle: pkgs[i].product_platform_package_id
        };
      }
      GM_setValue("SPUPACKAGES", pkgId2spupkgId);
      return pkgId2spupkgId;
    } catch (e) {
      alert("出错有2种可能，①是不是没有登录阿目云？②问产品达人，阿目云产品是不是绑定错误了？去检查下咯~还不行的话联系庄~~", e);
    }

  },
  
  // 提供信息，提供平台产品ID。返回所有子产品ID
  async giveSpuIdGetSpuPackageIds(spuId){
    // 这里的思路是，首先从现有存储数据中搜索，如果有，就直接使用，如果没有，就更新当前存储，再返回合适的ID
    let spuPackages = GM_getValue("SPUPACKAGES", null);
    if(spuPackages && spuPackages.spuId == spuId){
      return spuPackages;
    }else{
      let spuPackageInfo = await this.getSpuPackagesInfo(spuId);
      spuPackages = this.parseSpuPackagesInfo(spuPackageInfo);
      return spuPackages;
    }
  }

}
// 根据产品ID获取所有套餐
const getAllPackages = {
  qunarVacation(productId) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        // https://touch.dujia.qunar.com/item?id=793905320&oId=0954820191002225659000914&oldVersion=56
        url: `https://touch.dujia.qunar.com/item?id=${productId}`,
        responseType: 'json',
        timeout: 3000,
        ontimeout: function () {
          reject({});
        },
        onload: function (response) {
          // 没有套餐ID可以找到阿目云产品ID，需要对比产品标题来找到 阿目云产品ID。所以这里产品标题是必须的
          let packagesArray = response.response.data.multyProducts;
          let packageJson = {};
          for (let i in packagesArray) {
            packageJson[packagesArray[i].team3TypeId] = {
              productId: packagesArray[i].mainId,
              // online: packagesArray[i].status,
              // order: packagesArray[i].groupSortId,
              title: packagesArray[i].subTitle,
              count: packagesArray[i].taocanCount.adultCount
            };
          }
          resolve(packageJson);
        },
        onerror: function (response) {
          console.log('getAllPackages.qunarVacation Error:\n', response);
          resolve({});
        }
      });
    });
  },

  fliggyVacation(productId){
    return new Promise(resolve=>{
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://sell.fliggy.com/sell/v3/saveSkuQuantity.htm?id=${productId}`,
        onload: (res)=>{
          if(res.finalUrl.match(/login.taobao/g)){
            let jump = window.confirm("╮(╯▽╰)╭, 貌似还没有登录，要去登录吗？");
            if(jump){ window.open(res.finalUrl, '_blank') }
            resolve({});
          }else{
            let matchArray = res.responseText.match(/value='\{&quot;.*&quot;\}\}\}\]\}'/g);
            let skuQuantity = matchArray ? JSON.parse(matchArray[0].slice(7, -1).replace(/&quot;/g, '"')) : {};
            let packages = {};
            try {
              if(skuQuantity.packages.length){
                skuQuantity.packages.forEach((item)=>{
                  packages[item.adult_skuid] = {
                    productId: item.code || undefined,
                    title: item.name.replace(/\|成人$/, '')  // 这里应该不止成人一种类型。可能还有其他类型。这是潜在Bug之一
                  }
                });
              }
              console.log(packages, 'fliggyVacation');
              resolve(packages)
            } catch (e) {
              console.log("getAllPackages.fliggyVacation 返回数据错误", e);
              resolve({})
            }
          }
        },
        onerror: (res)=>{}
      })
    })
  }
}

// 根据平台产品ID和平台套餐名称，获取阿目云套餐的产品ID，以便跳转到录单页面
const getPackagePlatformId = {
  qunarVacation(productId, packageName) {
    return new Promise(async (resolve, reject) => {
      let allPackages = await getAllPackages.qunarVacation(productId);
      let pkgid = null;
      for (let i in allPackages) {
        if (allPackages[i].title == packageName) {
          pkgid = i;
          break;
        }
      }
      resolve(pkgid);
    });
  },

  fliggyVacation(productId, packageName) {
    return new Promise(async (resolve, reject) => {
      let allPackages = await getAllPackages.fliggyVacation(productId);
      let pkgid = null;
      for (let i of Object.keys(allPackages)) {
        if (allPackages[i].title == packageName) {
          pkgid = allPackages[i].productId;
          break;
        }
      }
      resolve(pkgid);
    });
  }
}

function formatDate(time,d = 0){
  // t 需要是一个 Date 类型，d是日期偏移量，比如今天偏移1天就是明天
  let t = new Date(new Date(time).getTime() + 86400000*d);
  // yyyy-mm-dd
  return `${t.getFullYear()}-${t.getMonth()+1 >9 ? t.getMonth()+1 : '0'+(t.getMonth()+1)}-${t.getDate() >9 ? t.getDate() : '0'+t.getDate()}`;
}

function isNumber(obj) {  
  return obj === +obj  
}

// json数据转化为formdata
function json2formData(jsonObj){
  let formData = new FormData();
  Object.keys(jsonObj).forEach((key) => {
  formData.append(key, jsonObj[key]);
  });
  return formData
}

// 从数组生成json，以指定键的值作为json的键名
function jsonFromArray(arrayObj, keyname){
  let temp = {}
  arrayObj.map((item)=>{
    temp[item[keyname]] = item
  })
  return temp
}

const qunarVacationFns = {
  // 电话解密
  getTel(tel){
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        url: `https://tb2cadmin.qunar.com/supplier/sensitive/decrypt.json?type=1&info=${tel}`,
        method: "GET",
        responseType: "json",
        onload: function(response){
          if(response.status == 200 && response.response.ret){
            resolve(response.response.data.result);
          }else{
            console.log("qunarVacation.getTel Error:\n", response);
            resolve('');
          }
        },
        onerror: function(){
          console.log("qunarVacation.getTel Error:\n", response);
          resolve('');
        }
      });
    });
  }
}

// 粗略返回一堆数据
const rawInfoById = {
  // 请求原始数据，配合 rawInfoById 使用
  getRawJson(url, responseType='json'){
    return new Promise((resolve,reject)=>{
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: responseType,
        timeout: 5000,
        ontimeout: function(){
          // 这里的形式还是要 改改，这里只是按照美团返回的数据，其他平台不是这样的
          reject({success: false, status: 1});
        },
        onload: function(response){
          resolve(response.response);
        },
        onerror: function(response){
          reject(response.response);
        }
      });
    });
  
  },
  
  getRawJsonByPost(url, postData={}, headers={}){
    return new Promise((resolve, reject)=>{
      GM_xmlhttpRequest({
        method: "POST",
        url: url,
        data: json2formData(postData),
        responseType: 'json',
        headers: headers,
        ontimeout: ()=>{reject({success: false, status: 1})},
        onload: (response)=>{resolve(response.response)},
        onerror:(response)=>{reject(response.response)}
      })
    })
  },

  qunarVacation(orderId){
    // 订单详情链接 https://tb2cadmin.qunar.com/supplier/order/showInfo?displayId=${orderId}
    return new Promise((resolve,reject)=>{
      // 不知道这个参数有没有时效性，每次都用最新的总没有错
      let csrfToken = new String(document.cookie).match(/csrfToken=\w+/)[0].slice(10);
      GM_xmlhttpRequest({
        url: `https://tb2cadmin.qunar.com/supplier/order.do?opType=getOrder&displayId=${orderId}&csrfToken=${csrfToken}`,
        method: "GET",
        responseType: 'json',
        onload: function(response){
          if(response.status == 200 && response.response.ret){
            resolve(response.response.data.content[0]);
          }else{
            console.log("rawInfoById.qunarVacation Error:\n",response);
            resolve({});
          }
        },
        onerror: function(response){
          console.log("rawInfoById.qunarVacation Error:\n",response);
          resolve({});
        },
      });
    });
  },

  mafengwoVacation(orderId){
    return new Promise(async(resolve,reject)=>{
      let url = `https://b.mafengwo.cn/tobackend/order/index.php?sAction=order_list_reload_one_v4&sOrderId=${orderId}`;
      let response = await this.getRawJson(url);
      // if(!response.errno || (response.error != "操作成功")){ return null;}
      resolve(response.data);  
    });
  },

  meituanVacation(orderId){
    return new Promise(async (resolve, reject)=>{
      let url = `https://lvyou.meituan.com/trip-package-order-web/api/biz/order/detail?orderId=${orderId}`;
      let response = await this.getRawJson(url);
      resolve(response.data);
    });
  },

  fliggyVacation(orderId){
    return new Promise(async (resolve,reject)=>{
      let url = 'https://sell.fliggy.com/orderlist/ajax/orderList.htm?_input_charset=UTF-8&_output_charset=UTF-8';
      let resp = await this.getRawJsonByPost(url, postData={
        _tb_token_: Cookies.get('_tb_token_'),
        bizType: 0,
        sortFieldEnum: 'ORDER_CREATE_TIME_DESC',
        orderId:  orderId,
        pageNum: 1,
        pageSize: 10
      }, headers={
        Referer: 'https://sell.fliggy.com/icenter/trade.htm'
      });
      if(resp.code == 200 && resp.success && resp.result.orderList.length){
        resolve(resp.result.orderList[0]);
      }else{
        reject({})
      }
    })
  },
}

// 获取订单的细节数据
const getOrderDetail = {
  // 获取录单产品的阿目云ID
  async getRecordOrderProduct(platformProductId, platformPackageId=null){
    try {
      let spuPackages = await syncAmuyun.giveSpuIdGetSpuPackageIds(platformProductId);
      let pns = await syncAmuyun.getPns(spuPackages[platformPackageId].spupkgId,1);  // 后面这个1天，只需要取回1天的价格
      return {
        productId: pns.product_id,
        productNode: pns.product_node
      };
    } catch (error) {
      // 出错①： spuPackages 返回空组，那么这里也就返回空组
      // 出错②： spuPackages[platformPackageId].spupkgId 没有对应的 platformPackageId 键值，这里也返回空值
      console.log(error);
      return null;
    }
  },

  // 携程酒店
  ctripHotel(targetElement){
    let p = $(targetElement).parent().parent();
    return {
      hotel: p.find('div[name=divGoToHotelName]')[0].childNodes[0].textContent.split('/')[1],
      orderId: p.find('tr.ctrip-q span.d-form-item').text(),
      name: p.find('div.occupant').text().replace('VIP', ''),
      tel: '',
      orderPlatform: '携程酒店',
      bookTime: p.find('td:nth-of-type(5)').text().slice(0, 10),
      salePrice: p.find('a[name="roomPrice"]').text().match(/[\d.]{2,8}/g)[0],
      checkInDay: p.find('td').first().next().text().slice(0, 10),
      nights: p.find('td .d-lightgray').first().text().slice(1, -2),
      rooms: p.find('td .d-lightgray')[1].textContent.match(/\d{1,2}/)[0],
      roomType: p.find('a.d-blue').text().match(/[^([<]+/)[0]
    }
  },

  // 美团酒店
  meituanHotel(targetElement){
    let p = $(targetElement).parent().parent();
    return {
      hotel: p.find('td:nth-child(1) a').text().split('】')[1],
      orderId: p.find('td:nth-child(1)').text().match(/\d{18,21}/g)[0],
      name: p.find('td:nth-child(4) span:contains("人")').text().split('/')[0],
      tel: '',
      orderPlatform: '美团酒店',
      bookTime: p.find('td:nth-child(7)').text().match(/\d{4}-\d\d-\d\d/g)[0],
      salePrice: p.find('td:nth-child(5) span').text().slice(0,-3),
      checkInDay: p.find('td:nth-child(2)').text().split('~')[0],
      nights: p.find('td:nth-child(2)').text().match(/共\d晚/g)[0].slice(1,-1),
      rooms: p.find('td:nth-child(3) div')[0].childNodes[2].textContent.replace(/\s/g, '').slice(0,-1),
      roomType: p.find('td:nth-child(3) div')[0].childNodes[0].textContent.replace(/\s/g, ''),
    };
  },

  // 美团度假
  async meituanVacation(orderId){
    let rawJson = await rawInfoById.meituanVacation(orderId);
    return {
      hotel: rawJson.spuTitle.replace(/【[\S]+】/,'').match(MeituanHotelNameRE)[0],
      orderId: rawJson.orderId,
      name: rawJson.contactInfo.name,
      orderPlatform: '美团度假',
      bookTime: rawJson.payTime.slice(0,10),
      // salePrice: rawJson.orderPrice, 没有优惠的时候，orderPrice = rawPrice
      salePrice: rawJson.rawPrice,
      // 其实优惠信息是一个数组，这里只是考虑最简单只有1个优惠的情况，还是有Bug的
      platformRate: ((1 - (rawJson.predictSettlementPrice + ((rawJson.orderPromoInfos&&rawJson.orderPromoInfos.length) ? rawJson.orderPromoInfos[0].promoAmount : 0)) / rawJson.rawPrice)*100).toFixed(1)*1,
      checkInDay: rawJson.startDate,
      nights: 1,  //rawJson.saleCount.match(/\d{1,3}/g)[0]
      rooms: rawJson.count,
      roomType: rawJson.packageTitle,
      tel: rawJson.contactInfo.phone.replace('86-','')
    };
  },
  // 美团详情同样适用美团度假逻辑，只要订单号就可以找到所需信息
  meituanVacationOrderDetail(orderId){return this.meituanVacation(orderId)},

  // 马蜂窝度假
  async mafengwoVacation(orderId){
    let rawJson = await rawInfoById.mafengwoVacation(orderId);
    const countSalePrice = function(data){
      // 因为马蜂窝的优惠名目比较多， 需要区分清楚哪些是平台承担的优惠，哪些是商家承担的优惠,
      // 目前只是计算了部分名目，还有些名目不清楚具体含义的未计算
      // 这个数据有官方api的，不过官方api订单详情没有补款金额，所以目前仍然用请求的数据
      let total_price = parseFloat(data.reduce.total_price), // 总价
      refund = 0, // 退款
      bukuan = 0, // 补款
      reduce_mfw = 0, // 马蜂窝补贴
      reduce_mfw_keys = [  // 马蜂窝补贴名目
        'n_off_min_num_mfw',
        'n_off_rate_mfw',
        'reduce_app_mfw', // app下单优惠
        'reduce_bargain', // 砍价
        'reduce_coupon_mfw_ota', // 未知
        'reduce_early_bird', // 早鸟
        'reduce_n_off_mfw', // 未知
        'reduce_red_packet_mfw', // 未知
        'reduce_vip_mfw', // 未知
      ],
      reduce_ota = 0, // 商家补贴
      reduce_ota_keys = [  // 商家补贴名目
        'n_off_min_num_ota',
        'n_off_rate_ota',
        'reduce_app_ota', // app下单优惠
        'reduce_bargain_ota', // 砍价
        'reduce_coupon_ota', // 未知
        'reduce_early_bird_ota', // 早鸟
        'reduce_n_off_ota', // 未知
        'reduce_vip_price_ota', // 未知
      ];
      try {
        // 说不用管退款金额，那我就不考虑处理退款金额了
        // if(parseFloat(data.refund_fee)){
        //   // refund = parseFloat(data.refund_fee)/(1-data.reduce.vip_rate) // 最初的退款采用的是这个逻辑，后来因为退款中含有优惠信息，退款金额不准确，就修改了逻辑
        //   if(!Array.isArray(data.settle_info) && data.settle_info.hasOwnProperty("adjust_settle")){
        //     refund = Math.abs(parseFloat(data.settle_info.adjust_settle))
        //   }
        // }
        if(data.replenish_list.length){
          data.replenish_list.forEach(item=>{
            item.status == "已支付" &&  (bukuan += parseFloat(item.amount))
          })
        }
        reduce_mfw_keys.forEach(key=>{
          if(data.reduce.hasOwnProperty(key)){
            isNumber(data.reduce[key]) ? (reduce_mfw += data.reduce[key]) : (reduce_mfw += parseFloat(data.reduce[key]))
          }
        })
        reduce_ota_keys.forEach(key=>{
          if(data.reduce.hasOwnProperty(key)){
            isNumber(data.reduce[key]) ? (reduce_ota += data.reduce[key]) : (reduce_ota += parseFloat(data.reduce[key]))
          }
        })
      // 订单金额 + 补款金额 - 平台商家补贴 - 退款金额
        return total_price + bukuan - reduce_ota - refund
      } catch (error) {
        console.log('[马蜂窝订单计算金额出错：]', error)
        return "计算订单金额出错了"
      }
    }

    let salePrice = countSalePrice(rawJson)
    return {
      hotel: (()=>{
        try {
          return rawJson.sales_name.match(MafengwoHotelNameRE) 
            ? rawJson.sales_name.split("+")[0].match(MafengwoHotelNameRE)[0]
            : rawJson.sales_name
        } catch (error) {
          console.log(error);
          return rawJson.sales_name
        }
      })(),
      orderId: rawJson.order_id,
      name: rawJson.user.name,
      orderPlatform: '马蜂窝（阿目旅行）',
      bookTime: rawJson.ctime.slice(0,10),
      salePrice: salePrice,
      // salePrice: countSalePrice(rawJson),
      checkInDay: rawJson.go_date,
      nights: 1,  //rawJson.saleCount.match(/\d{1,3}/g)[0]
      rooms: rawJson.items[0].num,
      // rooms: rawJson.room_num,
      roomType: rawJson.items[0].stock_name,
      tel: rawJson.user.pure_phone,
      platformProductId: rawJson.sales_id,
      platformPackageId: rawJson.stock_id
    };
  },

  // 去哪儿度假
  async qunarVacationDetail(orderId){
    return new Promise(async (resolve, reject)=>{
      let orderJson = await rawInfoById.qunarVacation(orderId);
      let tel = '';
      // 去哪儿订单状态代码：order_status 5 失败 12 成功  13关闭  2确认待付款  1待确认待付款 4,已付款，待确认
      if([12, 2, 1, 4].indexOf(orderJson.order_status) > -1 && /[a-zA-Z]/.test(orderJson.contact_mobile)){
        tel = await qunarVacationFns.getTel(orderJson.contact_mobile);
      }else{
        tel = orderJson.status_string;
      }

      resolve({
        hotel: orderJson.title.match(QunarHotelNameRE) ? orderJson.title.match(QunarHotelNameRE)[0] : orderJson.title,
        orderId: orderJson.orderInfoDisplayId,
        name: orderJson.contact_user,
        orderPlatform: '去哪儿网度假',
        bookTime: orderJson.create_time_day,
        salePrice: orderJson.team_price/100,
        platformRate: orderJson.balance_info_map.newProfitRate,
        checkInDay: orderJson.takeoff_date_str,
        checkOutDay: formatDate(orderJson.takeoff_date_str, 1),
        nights: orderJson.night,
        rooms: orderJson.room_count,  //orderJson.room_num  这两个 还没确定是哪一个
        roomType: orderJson.tickettitle,
        tel: tel, //这里只考虑中国手机号的情况,
        platformProductId: orderJson.enProductId
      });
    });
  },

  qunarVacation(orderId){return this.qunarVacationDetail(orderId)},

  // 飞猪度假详情
  fliggyVacationDetail(orderId){ return this.fliggyVacation(orderId) },

  // 飞猪度假，这里特别要注意核对住多少晚
  fliggyVacation(orderId){
    return new Promise(async(resolve)=>{
      let res = await rawInfoById.fliggyVacation(orderId);
      if(Object.keys(res)){
        let skuTextObject = jsonFromArray(res.itemInfo.skuText, 'name')
        function getNights(str){
          let arr1 = str.match(/\d{1,}晚/g)
          if(!arr1){
            return 1
          }else{
            return Math.max(...arr1.map(item=>{return parseInt(item)}))
          }
        }
        try {
          resolve({
            hotel: res.itemInfo.itemTitle.split("丨")[0],
            orderId: res.orderId,
            name: skuTextObject["联系人姓名："].value,
            orderPlatform: '飞猪',
            bookTime: res.orderInfo.orderTime.slice(0,10),
            salePrice: parseFloat(res.payInfo.actualFee.slice(1)),
            platformRate: 2.5,
            checkInDay: skuTextObject["出行日期："].value,
            checkOutDay: formatDate(skuTextObject["出行日期："].value, 1),
            nights: getNights(JSON.stringify(res)), // 这里晚数不一定准确，还是要人工校对一下。因为查询订单接口，没有行程天数这一项
            rooms: res.payInfo.buyMount,
            roomType: (skuTextObject["叶子类目："].value == "境内酒景套餐") ? skuTextObject["套餐类型："].value : skuTextObject["预订套餐："].value, // 目前只分辩 国内酒景套餐 和 国内酒店套餐，其他情况还没有考虑在内
            tel: skuTextObject["联系人手机："].value,
            platformProductId: res.itemInfo.itemId
          })
        } catch (error) {
          resolve({})
        }
      }
    })
  },
}



// 准备录单数据
function prepareRecordOrderData (detailJson) {
  if (Object.keys(detailJson).length < 5) { return false; }
  GM_setValue('buildOrderData', detailJson);
  notify({title: detailJson.orderPlatform, message: "复制成功", status: 'success'});
  // 兼顾发单功能，点击之后，即在粘贴板准备好 发单需要用的文字。
  // 后面这一块，打算同样用于放到手机版的浏览器中
  GM_setClipboard(TEXT_ORDER_TEMPLATE.replace("<<日期>>", `${parseInt(detailJson.checkInDay.slice(5, 7))}月${parseInt(detailJson.checkInDay.slice(8, 10))}日`).replace("<<酒店>>", detailJson.hotel).replace("<<房型>>", detailJson.roomType).replace("<<间数>>", detailJson.rooms).replace("<<晚数>>", detailJson.nights).replace("<<名字>>", detailJson.name).replace("<<电话>>", detailJson.tel));
}

// 给选中的元素标记颜色
function toggleMarkElement(elem){  $(elem).toggleClass("myMark"); }

// 各平台为做单的初始化
const platformInit = {
  // 携程酒店
  ctripHotel () {
    $("table.d-table.search-table").on("click", (e) => {
      if ($(e.target).parent().parent().attr('class') == 'hoteltr' && $(e.target).text().match(/至/g)) {
        toggleMarkElement(e.target);
        let detailJson = getOrderDetail.ctripHotel(e.target);        
        prepareRecordOrderData(detailJson);
        $hub.$emit('show', [e.pageX, e.pageY], detailJson.orderId);
      }

    });
  },
  // 美团酒店
  meituanHotel() {
    $("body").on("click", (e) => {
      if ($(e.target).text().match(/\d{18,21}/g) && $(e.target).parent().attr('class').indexOf("mtd-table_1_column_1")>-1) {
        toggleMarkElement(e.target);
        let p = $(e.target).parent().parent();
        try { p.find('button:contains("查看")').click() } catch (error) {}
        setTimeout(() => {
          let detailJson = getOrderDetail.meituanHotel(e.target);
          prepareRecordOrderData(detailJson);
          $hub.$emit('show', [e.pageX, e.pageY], detailJson.orderId);
        }, 300);
      }
    });
  },
  // 马蜂窝度假  mafengwo
  mafengwoVacation() {
    $('body').on('click', async (e) => {
      // 有些2018年7月或之前的订单，单号是22位的。那些订单没法跳转了。
      // 未来订单号也可能变成24位，到时候再改来适配。
      // 从目前的来看，23位的单号还可以撑一段时间，保守估计还能用5年吧
      if ((e.target.tagName == "TD") && /\d{23}/.test($(e.target).text())) {
        toggleMarkElement(e.target);
        let orderId = $(e.target).text().match(/\d{23}/g)[0];
        let detailJson = await getOrderDetail.mafengwoVacation(orderId);
        prepareRecordOrderData(detailJson);
        $hub.$emit('show', [e.pageX, e.pageY], orderId);
      }
    });
  },
  // 美团度假订单详情  meituanMPC
  meituanVacationOrderDetail() {
    $('body').on('dblclick', async (e) => {
      let orderId = location.hash.split('=')[1];
      let detailJson = await getOrderDetail.meituanVacation(orderId);// 准备录单数据
      prepareRecordOrderData(detailJson);
      $hub.$emit('show', [e.pageX, e.pageY], orderId); // 显示跳转按钮
    });
  },
  // 美团度假  meituanMPCList
  meituanVacation() {
    $('body').on('click', (e) => {
      if ((e.target.tagName == "TD") && /ng-binding/.test($(e.target).attr('class')) && /\d{15}/.test($(e.target).text())) {
        toggleMarkElement(e.target);
        $hub.$emit('show', [e.pageX, e.pageY], $(e.target).text().match(/\d{15}/)[0], e.target);
      }
      // 这里没有快速录单，只有一个快速跳转到阿目云的录单功能 老版本遗留的操作，先保持吧
      if ($(e.target).attr("class").indexOf("last-operator") > -1) {
        toggleMarkElement(e.target);
        // 后面大家熟悉了按钮方式之后，这里的点击跳转将会被删除
        let orderId = $(e.target).parent().children().first().text().match(/\d{15}/)[0];
        window.open("http://erp.himudidi.com/order_meituan/all.html?dp_order_id=" + orderId);
      }
    });
  },
  // 去哪儿度假  qunar
  qunarVacation() {
    $('body').on('click', async (e) => {
      if ($(e.target).parent().parent().parent().attr('id') == "listTbody" && $(e.target).text().match(/\d{25}/g)) {
        toggleMarkElement(e.target);
        let orderId = $(e.target).text().trim();
        let detailJson = await getOrderDetail.qunarVacationDetail($(e.target).text().trim());
        prepareRecordOrderData(detailJson);
        $hub.$emit('show', [e.pageX, e.pageY], orderId); // 显示跳转按钮
      }
    });
  },
  // 去哪儿度假  qunar
  qunarVacationDetail() {
    $('body').on('dblclick', async (e) => {
      let orderId = $('input[name=displayId]').val();
      let detailJson = await getOrderDetail.qunarVacationDetail(orderId);
      prepareRecordOrderData(detailJson);
      $hub.$emit('show', [e.pageX, e.pageY], orderId); // 显示跳转按钮
    });
  },
  // 飞猪度假  fliggyVacationDetail
  fliggyVacationDetail() {
    $('body').on('dblclick', async (e) => {
      let orderId = location.search.split('orderId=')[1];
      let detailJson = await getOrderDetail.fliggyVacationDetail(orderId);
      prepareRecordOrderData(detailJson);
      $hub.$emit('show', [e.pageX, e.pageY], orderId); // 显示跳转按钮
    });
  },
  // 飞猪度假  fliggyVacation
  fliggyVacation() {
    $('body').on('click', async (e) => {
      if(e.target.tagName === "TEXT" && $(e.target).prev().text() == "订单号: "){
        toggleMarkElement(e.target);
        let orderId = e.target.textContent;
        let detailJson = await getOrderDetail.fliggyVacation(orderId);
        prepareRecordOrderData(detailJson);
        $hub.$emit('show', [e.pageX, e.pageY], orderId); // 显示跳转按钮
      }
    });
  },
  // 阿目云  amuyun
  amuyun() {
    // 录单功能
    if (location.pathname.match(/\/order\/edit\/or_id\/\d*\/pro_id\/\d*.html/) || location.pathname.match(/\/order\/add\/.*.html/) || location.pathname.match(/\/order\/edit\/order_id\/\d*.html/)) {
      GM_registerMenuCommand('空格录单', buildNewOrder, ' ');
      buildNewOrderExtra();
    }
  },
  // 发单模板 orderTemplate
  orderTemplate(){
    let syncButton = document.getElementById("syncQuickOrderInfo");
    syncButton.removeAttribute("disabled")
    syncButton.addEventListener("click", ()=>{
      let orderDetail = GM_getValue("buildOrderData", {});
      Object.assign(orderTemplateApp.orderTemplate, orderTemplateApp.blankOrderTemplate,{name:orderDetail.hotel})
      Object.assign(orderTemplateApp.orderDetail, {
        checkInDay: orderDetail.checkInDay.replace(/-/g, '.'),
        checkOut: formatDate(orderDetail.checkInDay, orderDetail.nights).replace(/-/g, '.'),
        name: orderDetail.name,
        tel: orderDetail.tel
      })
    })
  },
  // 未知，什么也不做
  Unknow() {}
}

// 阿目云录单函数  新版
function buildNewOrder() {
  let data = GM_getValue('buildOrderData');

  unsafeWindow.vm.$set(vm, 'order_platform_name', data.orderPlatform);
  unsafeWindow.vm.$set(vm, 'order_platform_id', data.orderId);
  unsafeWindow.vm.$set(vm, 'order_place_date', data.bookTime);
  unsafeWindow.vm.$set(vm, 'order_member_name', data.name);
  unsafeWindow.vm.$set(vm, 'order_member_name', data.name);
  unsafeWindow.vm.$set(vm, 'order_phone', data.tel);
  unsafeWindow.vm.$set(vm, 'order_money', data.salePrice);
  unsafeWindow.vm.$set(vm, 'order_platform_rate', (data.platformRate || PLATFORMRATE[data.orderPlatform])+'');   //平台费率目前没有统一
  unsafeWindow.vm.parents.map(v=>{
    unsafeWindow.vm.$set(v, 'num', v.num*data.nights * data.rooms);
  })
  // 因为选择入住日期的时候，会读取阿目云的价格，所以这个放在最后设置
  unsafeWindow.vm.$set(vm, 'order_start_date', data.checkInDay);
}
// 阿目云录单额外的功能，比如快速设置客服是【客服专号1】，供应商快速设置成自己等等
// 目前这个功能只是方便我录刷单
function buildNewOrderExtra() {
  if (vm.destination_adviser[0].u_nickname == '广东SD帐号' || vm.destination_adviser[0].u_nickname == '庄庆泉') {
    // 设置供应商
    $('#vm > div > div > div > table > tbody > tr:nth-child(10) > td > table > tbody > tr:nth-child(2) > th:nth-child(6)').on('click',()=>{
      unsafeWindow.vm.parents.map(v=>{
        unsafeWindow.vm.$set(v, 'supplier', '庄庆泉');
      });
    });
  }
}

// 显示各种通知
function notify({title='', message='', status="primary"}) {
  // 定义通知种类和形式
  // 2020-8-10 记录，不知道什么原因，这里 GM_notification 居然无效了。暂时未找到原因，可能是我的设置问题，也可能是插件本身问题
  // 所以，现在先用添加通知元素的方式来代替
  let backgroundColor = {
    'primary': '#2db7f5',
    'success': '#47cb89',
    'warning': '#f90',
    'error': '#ed4014',
  }
  let stamp = Date.now();
  let sty = `
    z-index: 99999;
    width: auto;
    min-width: 200px;
    height: 80px;
    position: fixed;
    right: 0;
    margin-right: 1em;
    bottom: 2em;
    background: ${backgroundColor[status]};
    color: white;
    border-radius: .3em;
    box-shadow: 4px 3px 2px 0px rgba(0,0,0,.5);
    font-family: "微软雅黑";
  `;
  let notifyDiv = `<div id="n${stamp}" style="${sty}" class="fadeInRight">
    <div style="text-align:left;font-size: 20px; font-weight: bolder; padding: 5px 10px;">${title}</div>
    <div style="text-align:center;font-size: 16px;">${message}</div>
  </div>`;

  $('body').append(notifyDiv);
  setTimeout(() => {
      $(`#n${stamp}`).addClass('fadeOutRight');
      setTimeout(() => {
        $(`#n${stamp}`).remove();
      }, 1800);
  }, status==='success' ? 1000 : 2000);
}

// 跳转到美团售卖详情页面
const O_meituan = (()=>{
  let uuid = 'E47581B34F5266F62D63B159FE448A938F003FF30B3E41F489E1CC2F0B14F7CA';
  // 基础的请求功能，只需要提供 url, 就可以
  function getRequest(url){
    return new Promise(resolve=>{
      GM_xmlhttpRequest({
        url: url,
        method: 'GET',
        responseType: 'json',
        onload: res=>{resolve(res.response)},
        onerror: res=>{
          console.log(res);
          resolve(res.response)
        }      
      })
    })
  }

  async function jump2SalePage(productId){
    let baseInfoUrl = `https://dabao.meituan.com/trippackage/api/v2/deal/${productId}/base?dealId=${productId}&source=mt&client=wap&feclient=lvyou_wap`
    let salePage = 'https://i.meituan.com/awp/h5/trip/deal/hotel-package/index.html?dealId=DEALID';
    let info = await getRequest(baseInfoUrl);
    if(info.status==0 && info.code==0){
      window.open(salePage.replace('DEALID', info.data.dealId), '_blank');
    }else{
      notify({
        title: "无法跳到美团",
        message: "臣妾做不到啊 (╥╯^╰╥)",
        status: 'error'
      })
    }
  }

  return {jump2SalePage}
})()

const quickButtons_comp = {
  ref: 'quickButtons',
  template: `
    <!-- 这里出现几秒，然后自动隐藏 -->
    <div id="quickButtons" v-show="isVisible" :style="'position:absolute;left:'+(position[0]-35)+'px;top:'+(position[1]-45)+'px;'">
      <i class="icon-detail icon-button order-detail" @click="showOrderPanel"></i>
      <i class="icon-link icon-button record-order-page" @click="recordOrderPage"></i>
      <i v-if="showJumpButton"
        class="icon-meituan icon-button record-order-page"
        @click="jump2SalePage"></i>
    </div>
  `,
  data(){
    return{
      isVisible: true,
      orderDetailJson: {},
      autoHideTime: 3 * 1000,
      autoHideTimer: null,
      position: [0, 0],
      orderId: '',
      targetElement: '',  // 这个设定主要是为了跳转到美团产品售卖页面
      showJumpButton: location.host.includes('mpc.meituan.com')
    }
  },
  methods: {
    async showOrderPanel () {
      let detailJson = {}
      try {
        if(channel()=='meituanHotel' || channel()=='ctripHotel'){
          detailJson = GM_getValue('buildOrderData', {});
        }else if(getOrderDetail[pagePlatformName]){
          detailJson = await getOrderDetail[pagePlatformName](this.orderId);
        }else{
          console.error('quickButtons->showOrderPanel Error: 不知道平台是哪个')
        }
      } catch (error) {console.log('quickButtons->showOrderPanel', error)}
      
      // 准备录单数据
      prepareRecordOrderData(detailJson);
      // 准备发单编辑面板
      $hub.$emit('updateOrder', detailJson)
    },
    // 跳到订单转化页面
    recordOrderPage() {
      let jump = {
        async qunarVacation(orderId){
          // 去哪儿订单详情
          let detailJson = GM_getValue('buildOrderData', {});
          let platformPackageId = await getPackagePlatformId.qunarVacation(detailJson.platformProductId, detailJson.roomType);
          let amuyunProductIdAndNode = await getOrderDetail.getRecordOrderProduct(detailJson.platformProductId, platformPackageId);
          if (amuyunProductIdAndNode) {
            window.open(`http://erp.himudidi.com/order/add/id/${amuyunProductIdAndNode.productId}/type/${amuyunProductIdAndNode.productNode}.html`, "_blank");
          } else {
            // 打开产品的这个平台所有产品页面，这个是折中方案，首选方案还是直接打开录单以页面
            window.open(`http://erp.himudidi.com/order/select_product.html?platform=${detailJson.orderPlatform}&product_platform_number=${detailJson.platformProductId}`, "_blank");
          }
        },
        qunarVacationDetail(orderId){
          jump.qunarVacation(orderId);
        },
        meituanVacation(orderId){
          window.open(`http://erp.himudidi.com/order_meituan/all.html?dp_order_id=${orderId}`, "_blank");
        },
        meituanVacationOrderDetail(orderId){
          jump.meituanVacation(orderId);
        },
        async mafengwoVacation(orderId){
          window.open(`http://erp.himudidi.com/order_mafengwo/index.html?mfw_order_id=${orderId}`, "_blank");
        },
        async fliggyVacationDetail(orderId){
          window.open(`http://erp.himudidi.com/order_taobao/index.html?tid=${orderId}`, "_blank");
        },
        fliggyVacation(orderId){
          jump.fliggyVacationDetail(orderId);
        },
        async meituanHotel(orderId){
          let detailJson = GM_getValue('buildOrderData', {});
          window.open(`http://erp.himudidi.com/order/select_product.html?keyword1=${detailJson.hotel}&keyword2=&keyword3=&keyword4=&platform=${detailJson.orderPlatform}&product_platform_number=`, "_blank");
        },
        async ctripHotel(orderId){
          let detailJson = GM_getValue('buildOrderData', {});
          window.open(`http://erp.himudidi.com/order/select_product.html?keyword1=${detailJson.hotel}&keyword2=&keyword3=&keyword4=&platform=${detailJson.orderPlatform}&product_platform_number=`, "_blank");
        }
      };
      if(jump[pagePlatformName]){
        jump[pagePlatformName](this.orderId);
      }else{
        notify({message: "抱歉，这个功能还没做好╮(╯▽╰)╭", status: 'warning'});
      }
      
    },
    show (pos, orderId, targetEle=null) {
      clearTimeout(this.autoHideTimer);
      this.$set(this, "position", pos);
      this.$set(this, "orderId", orderId);
      this.$set(this, "targetElement", targetEle);
      this.isVisible = true;
      this.autoHideTimer = setTimeout(() => { this.hide(); }, this.autoHideTime);
    },
    hide () { this.isVisible = false; },
    jump2SalePage(){
      let startDate, productId;
      if(location.href.includes('detail-order')){
        productId = $("label:contains(商品ID)").next().text().trim();
      }else if(location.href.includes('/jiujing/gtyOrder/list') || location.href.includes('/jiujing/gtyOrder/confirmOrderList')){
        let li = $(this.targetElement).parent();
        productId = li.find("span:contains(商品ID)").next().text().trim();
      }
      O_meituan.jump2SalePage(productId);
    }
  },
  mounted(){
    $hub.$on('show', (pos, orderId, targetEle)=>{this.show(pos, orderId, targetEle)});

    GM_addStyle(`#quickButtons{
      z-index: 999999; position:fixed; top: 5em; left:5em; 
      display: grid; grid-template-columns: 2.3em 2.3em;  grid-template-rows: 2em; 
      font-size: 14px; }`);
  }
}


// 发单面板
const orderPanel_comp = {
  template: `
    <div
      id="orderPanel"
      ref="orderPanel"
      :v-show="isShow"
      @dblclick.stop="closePanel"
      :style="positionCSS" >
      <li>
        <span @mousedown="move" class="dragSpan">点我拖动</span>
        <b class="textButton" @click="closePanel">关闭</b>
      </li>
        <li><b>入住</b><input v-model="checkInDay" @input="updateOrder" type="text"/></li>
        <li><b>姓名</b><input v-model="name" @input="updateOrder" type="text"/></li>
        <li><b>酒店</b><input v-model="hotel" @input="updateOrder" type="text"/></li>
        <li><b>套餐</b><textarea v-model="roomType" @input="updateOrder" rows="4"></textarea></li>
        <li><input v-model="rooms" @input="updateOrder" type="text"/><b>间</b></li>
        <li><input v-model="nights" @input="updateOrder" type="text"/><b>晚</b></li>
        <div class="orderType">
          <b class="textButton" @click="orderType='oneLine'">一行</b>
          <b class="textButton" @click="orderType='multiLine'">多行</b>
          <!-- <b class="textButton" @click="orderType='image'">图片</b> -->
          <b class="textButton" @click="copyOrderText">复制</b>
          <b class="textButton" @click="autoTransparent">隐藏</b>
        </div>
        <div>
          <textarea class="orderText" v-if="orderType=='oneLine'" v-model="oneLineText" rows="6"></textarea>
          <textarea class="orderText" v-else v-model="multiLineText" rows="8"></textarea>
          <!-- <span v-else="orderType=='image'">imageOrder 功能未做好</span> -->
        </div>
    </div>
  `,
  data(){
    return {
      hotel: null,
      name: null,
      bookTime: null,
      checkInDay: null,
      nights: null,
      rooms: null,
      roomType: null,
      tel: null,
      oneLineText: '',
      multiLineText: '',
      orderType: 'oneLine',
      position: {left: 500, top: 300},
      isShow: false
    }
  },
  methods: {
    oneLine(){
      this.oneLineText = `${parseInt(this.checkInDay.slice(5,7))}月${parseInt(this.checkInDay.slice(-2))}日   ${this.hotel}   ${this.roomType}   ${this.rooms}间   ${this.name}   ${this.tel}`
    },
    multiLine(){
      this.multiLineText = this.hotel+'\n'+
      `新单：${this.roomType} ${this.rooms}间${this.nights}晚\n`+
      `入离: ${this.checkInDay} ~ ${this.hasOwnProperty('checkOutDay') ? this.checkOutDay : ''}\n`+
      `客人: ${this.name} ${this.tel}\n`+
      `结算：\n`;
    },
    copyOrderText(){
      GM_setClipboard(this.orderType == 'oneLine' ? this.oneLineText : this.multiLineText);
    },
    updateOrder(dataJson){
      Object.assign(this.$data, dataJson);
      this.isShow = true;
      this.oneLine();
      this.multiLine();
    },
    autoTransparent(){
      $('#orderPanel').toggleClass('transparent');
    },
    closePanel(){
      this.isShow = false;
    },
    move(e){
      let div = this.$refs.orderPanel;
      let disX = e.clientX - div.offsetLeft;
      let disY = e.clientY - div.offsetTop;
      document.onmousemove = (e)=>{
        this.position.left = e.clientX - disX;
        this.position.top = e.clientY - disY;
      };
      document.onmouseup = (e) =>{
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
  },
  computed:{
    positionCSS(){
      return `left:${this.position.left}px;top:${this.position.top}px;display:${this.isShow?'block':'none'};`
    }
  },
  mounted(){
    $hub.$on('updateOrder', (dataJson)=>{this.updateOrder(dataJson)});
    GM_addStyle(`
      #orderPanel{position:fixed!important;z-index:9999;background:#eee;padding:10px;border:2px solid #999;border-radius:5px;width:400px}
      #orderPanel .dragSpan{font-size:20px;display:inline-block;width:300px;padding:5px;text-align:center;background:#a9a9a9;cursor:move}
      #orderPanel input,#orderPanel textarea{display:inline-block;width:330px;font-family:"微软雅黑";padding:5px 10px;margin:0;border:1px solid #ccc;border-radius:5px}
      #orderPanel li{white-space:nowrap;list-style-type:none;margin:5px}
      #orderPanel li b{display:inline-block;min-width:35px;text-align:center;vertical-align:top;margin-top:6px}
      #orderPanel .textButton{display:inline-block;padding:5px;margin:5px;cursor:pointer;background:#fff;border:1px solid #999!important;border-radius:5px;box-shadow:0 0 2px 0 #0ff!important}
      #orderPanel .orderType{border-top:2px solid #aaa;padding-top:5px;margin-top:10px}
      #orderPanel .orderText{width:380px}
      #orderPanel .textButton:hover{background:#0ff}
      #orderPanel.transparent{opacity:.2}
      #orderPanel.transparent:hover{opacity:1}
    `);
  }
}

// 执行初始化 为录单发单做准备
platformInit[pagePlatformName]();

if(!['amuyun','Unknow'].includes(pagePlatformName)){
  $('body').children().first().before(`<div id="quickButtons"></div>`);
  new Vue({
    el: '#quickButtons',
    render: h => h(quickButtons_comp)
  })

  $('body').children().first().after(`<div id="orderPanel"></div>`);
  new Vue({
    el: '#orderPanel',
    render: h =>h(orderPanel_comp)
  })
}



