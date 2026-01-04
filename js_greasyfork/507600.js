// ==UserScript==
// @name         淘补贴
// @name:en      Tao Butie
// @namespace    taobutie.com
// @version      1.1.7
// @description:en  To get hidden subsidies on Taobao, open the Taobao app and browse the products. Copy the product link and open it in the browser to claim the subsidy and purchase the item
// @description  获取淘宝隐藏补贴，打开淘宝客户端浏览商品，复制商品链接到浏览器打开即可领取补贴购买商品
// @author       Coupon Maker
// @match        *://*.taobao.com/search/*
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.tb.com/*
// @icon         https://res.stayfork.app/images/cms/tqq-script-icon.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @license      CC BY-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/507600/%E6%B7%98%E8%A1%A5%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/507600/%E6%B7%98%E8%A1%A5%E8%B4%B4.meta.js
// ==/UserScript==
(function () {
  'use strict';
  const TaoQQUtils = {
    generateUuid: function(len, radix) {
      len = !len ? 32 : (len > 32 ? 32 : len);
      let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      let uuid = [], i;
      radix = !radix ? chars.length : (radix > chars.length ? chars.length : radix);
      if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
      } else {
        // rfc4122, version 4 form
        let r;
        
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '_';
        uuid[14] = '4';
        
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }
      return uuid.join('');
    },
    computFloat: function(number){
      let numberStr = number.toString();
      let parts = numberStr.split('.');
      if (parts.length === 2) {
        const fnum = parseInt(parts[1], 10);
        if(fnum>=10){
          return fnum.toString();
        }else{
          return `0${fnum}`;
        }
      }
      return "00";
    },
    computWan: function(volume){
      if(typeof volume == "undefined"){
        return "0";
      }
      let wan = volume / 10000;
      if(wan >= 1 ){
        return `${wan}万+`
      }
      wan = volume / 1000;
      if(wan >= 1 ){
        return `${wan}000+`
      }
      wan = volume / 100;
      if(wan >= 1 ){
        return `${wan}00+`
      }
      wan = volume / 10;
      if(wan >= 1 ){
        return `${wan}0+`
      }else{
        return `${volume}`;
      }
    },
    getUserDeviceId: function(){
      const userDeviceId = window.localStorage.getItem("__cc_device_stay_quan_") || TaoQQUtils.generateUuid();
      window.localStorage.setItem("__cc_device_stay_quan_", userDeviceId);
      return userDeviceId;
    },
    replaceUrlArg: function (url, arg, argVal){
      const urlObj = new URL(url);
      urlObj.searchParams.set(arg, argVal)
      return urlObj.href
    },
    queryURLParams: (url="", name="") => {
      var pattern = new RegExp("[?&#]+" + name + "=([^?&#]+)");
      var res = pattern.exec(url);
      if (!res) return;
      if (!res[1]) return;
      return res[1];
    },
    isIpad: function(){
      const userAgentInfo = navigator.userAgent;
      let Agents = ['iPad'];
      let getArr = Agents.filter(i => userAgentInfo.toLowerCase().includes(i.toLowerCase()));
      let isIpad = getArr.length ? true : false;
      if(isIpad){
        return isIpad
      }else{
        if (userAgentInfo.match(/Macintosh/) && navigator.maxTouchPoints > 1) {
          return true;
        }
      }
      return isIpad;
    },
    isMobile: function(){
      const userAgentInfo = navigator.userAgent;
      let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPod', 'HarmonyOS'];
      let getArr = Agents.filter(i => userAgentInfo.toLowerCase().includes(i.toLowerCase()));
      return getArr.length ? true : false;
    }, 
    isNumber: (inputData) => { 
      //isNaN(inputData)不能判断空串或一个空格 
      //如果是一个空串或是一个空格，而isNaN是做为数字0进行处理的，
      //而parseInt与parseFloat是返回一个错误消息，这个isNaN检查不严密而导致的。 
      if (parseFloat(inputData).toString() == "NaN") { 
        //alert(“请输入数字……”); 
        return false; 
      }else { 
        return true; 
      } 
    },
    setUserAgentInfo: (agentInfo) => {
      Object.defineProperty(navigator, 'userAgent', {
        value: agentInfo,
        writable: false
      });
    },
    isMobileTbHome: () => {
      return window.location.pathname == "/" && TaoQQUtils.isMobile();
    },
    checkPage: () => {
      const pageUrl = window.location.href;
      // console.log("window.location.host-----", window.location.host, window.location.href);
      if(pageUrl.match(/taobao.com\/search/) || TaoQQUtils.isMobileTbHome()){
        return "list_page";
      }else{
          const itemId = TaoQQUtils.queryURLParams(hrefUrl, "id");
          if(itemId){
            return "detail_page"
          }else{
            // check quan page
            if(window.location.host.indexOf("uland.taobao.com") > -1){
              return "quan_page"
            }else{
              return "unknown"
            }
          }
      }
    },
    md5: (str) => {
      /**
       * Add integers, wrapping at 2^32.
       * This uses 16-bit operations internally to work around bugs in interpreters.
       *
       * @param {number} x First integer
       * @param {number} y Second integer
       * @returns {number} Sum
       */
      function safeAdd(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff)
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
        return (msw << 16) | (lsw & 0xffff)
      }
      /**
       * Bitwise rotate a 32-bit number to the left.
       *
       * @param {number} num 32-bit number
       * @param {number} cnt Rotation count
       * @returns {number} Rotated number
       */
      function bitRotateLeft(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt))
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} q q
       * @param {number} a a
       * @param {number} b b
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5cmn(q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5ff(a, b, c, d, x, s, t) {
        return md5cmn((b & c) | (~b & d), a, b, x, s, t)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5gg(a, b, c, d, x, s, t) {
        return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t)
      }
      /**
       * Basic operation the algorithm uses.
       *
       * @param {number} a a
       * @param {number} b b
       * @param {number} c c
       * @param {number} d d
       * @param {number} x x
       * @param {number} s s
       * @param {number} t t
       * @returns {number} Result
       */
      function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | ~d), a, b, x, s, t)
      }
      /**
       * Calculate the MD5 of an array of little-endian words, and a bit length.
       *
       * @param {Array} x Array of little-endian words
       * @param {number} len Bit length
       * @returns {Array<number>} MD5 Array
       */
      function binlMD5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << len % 32
        x[(((len + 64) >>> 9) << 4) + 14] = len

        var i
        var olda
        var oldb
        var oldc
        var oldd
        var a = 1732584193
        var b = -271733879
        var c = -1732584194
        var d = 271733878

        for (i = 0; i < x.length; i += 16) {
          olda = a
          oldb = b
          oldc = c
          oldd = d

          a = md5ff(a, b, c, d, x[i], 7, -680876936)
          d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
          c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
          b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
          a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
          d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
          c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
          b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
          a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
          d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
          c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
          b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
          a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
          d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
          c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
          b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

          a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
          d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
          c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
          b = md5gg(b, c, d, a, x[i], 20, -373897302)
          a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
          d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
          c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
          b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
          a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
          d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
          c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
          b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
          a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
          d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
          c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
          b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

          a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
          d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
          c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
          b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
          a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
          d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
          c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
          b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
          a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
          d = md5hh(d, a, b, c, x[i], 11, -358537222)
          c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
          b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
          a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
          d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
          c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
          b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

          a = md5ii(a, b, c, d, x[i], 6, -198630844)
          d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
          c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
          b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
          a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
          d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
          c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
          b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
          a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
          d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
          c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
          b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
          a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
          d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
          c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
          b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

          a = safeAdd(a, olda)
          b = safeAdd(b, oldb)
          c = safeAdd(c, oldc)
          d = safeAdd(d, oldd)
        }
        return [a, b, c, d]
      }
      /**
       * Convert an array of little-endian words to a string
       *
       * @param {Array<number>} input MD5 Array
       * @returns {string} MD5 string
       */
      function binl2rstr(input) {
        var i
        var output = ''
        var length32 = input.length * 32
        for (i = 0; i < length32; i += 8) {
          output += String.fromCharCode((input[i >> 5] >>> i % 32) & 0xff)
        }
        return output
      }
      /**
       * Convert a raw string to an array of little-endian words
       * Characters >255 have their high-byte silently ignored.
       *
       * @param {string} input Raw input string
       * @returns {Array<number>} Array of little-endian words
       */
      function rstr2binl(input) {
        var i
        var output = []
        output[(input.length >> 2) - 1] = undefined
        for (i = 0; i < output.length; i += 1) {
          output[i] = 0
        }
        var length8 = input.length * 8
        for (i = 0; i < length8; i += 8) {
          output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32
        }
        return output
      }
      /**
       * Calculate the MD5 of a raw string
       *
       * @param {string} s Input string
       * @returns {string} Raw MD5 string
       */
      function rstrMD5(s) {
        return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
      }
      /**
       * Encode a string as UTF-8
       *
       * @param {string} input Input string
       * @returns {string} UTF8 string
       */
      function str2rstrUTF8(input) {
        return unescape(encodeURIComponent(input))
      }
      /**
       * Encodes input string as raw MD5 string
       *
       * @param {string} s Input string
       * @returns {string} Raw MD5 string
       */
      function rawMD5(s) {
        return rstrMD5(str2rstrUTF8(s))
      }
      /**
       * Convert a raw string to a hex string
       *
       * @param {string} input Raw input string
       * @returns {string} Hex encoded string
       */
      function rstr2hex(input) {
        var hexTab = '0123456789abcdef'
        var output = ''
        var x
        var i
        for (i = 0; i < input.length; i += 1) {
          x = input.charCodeAt(i)
          output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
        }
        return output
      }
      
      return rstr2hex(rawMD5(str))
    },
    parseToDOM(str){
      let divDom = document.createElement('template');
      if(typeof str == 'string'){
        divDom.innerHTML = str;
        return divDom.content;
      }
      return str;
    },
  }
  
  const hrefUrl = window.location.href;
  console.log("hrefUrl-----",hrefUrl, ",userDeviceId--",TaoQQUtils.getUserDeviceId());
  
  const switchOff = false;
  // GM_getValue("tao_quan_quan_switch_off") || false;
  // console.log("hrefUrl-----",hrefUrl, ",userDeviceId--",TaoQQUtils.getUserDeviceId());

  // GM_registerMenuCommand("打开/关闭推荐", ()=>{
  //   if(switchOff){
  //     GM_setValue("tao_quan_quan_switch_off", false)
  //   }else{
  //     GM_setValue("tao_quan_quan_switch_off", true)
  //   }
  //   window.location.reload(true);
  // })

  // if(switchOff){
  //   return;
  // }

  
  function addLoginListener(){
    if(window.top != window && (window.location.href.indexOf("login")> -1 || window.location.href.indexOf("third-party-cookie")> -1)){
      let jumpUrl = window.location.href;
      if(!TaoQQUtils.isMobile()){
        jumpUrl =  TaoQQUtils.replaceUrlArg(jumpUrl, "style", "1");
      }
      window.top.postMessage({action: 'login', jump: jumpUrl}, "*");
      return;
    }
  }
  addLoginListener();

  let __style = `
    :root {
      --s-icon-block: #2F3134;
      --quan-bg: #ffffff;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --s-icon-block: #DCDCDC;
        --quan-bg: #1C1C1C;
      }
    }
    a[check-quan="true"]{
      position: relative;
    }
    .s8t9a0i8y66-quan-box{
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }
    .s8t9a0i8y66-detail-p-quan{
      justify-content: flex-start!important;
      height: 34px;
    }
    .s8t9a0i8y66-detail-m-quan{
      height:20px;
      overflow:hidden;
      margin-top: 10px;
      justify-content: flex-start;
      top: 0px;
    }
    .s8t9a0i8y66-detail-m-fixed{
      position: fixed;
      z-index: 66;
      left: 0;
      top: 50%;
      transform: translate(0, -50%);
    }
    .s8t9a0i8y66-detail-pc-abs{
      position: absolute;
      right: 100px;
      top: 165px;
    }
    .s8t9a0i8y66-detail-pc-fixed{
      position: fixed;
      z-index: 66;
      right: 52px;
      top: 30%;
    }
    .s8t9a0i8y66-detail-m-quan .s8t9a0i8y66-detail-quan-item{
      font-size: 14px;
    }
    .s8t9a0i8y66-detail-quan-item{
      position: relative;
      border: 1px solid #E02020;
      background: #E02020;
      color:#ffffff;
      font-size: 14px;
      padding: 2px 5px;
      text-align: center;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      margin-right:5px;
      cursor: default;
    }
    .s8t9a0i8y66-detail-quan-item .s8t9a0i8y66-tlj-confirm{
      color:#ffffff;
      font-size: 14px;
      padding-left: 4px;
    }
    .s8t9a0i8y66-m-awp{
      padding: 0 14px;
      background-color: rgb(255, 255, 255);
      margin: 0px 10px;
      height: 30px;
      align-items: end;
    }
    .s8t9a0i8y66-quan-corner-box{
      position: absolute;
      top: 3px;
      right: 3px;
      overflow:hidden;
      z-index:889;
      padding: 5px 10px;
      background-color: rgba(0, 0, 0, 0.5);
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
    }
    .s8t9a0i8y66-quan-item{
      position: relative;
      // overflow:hidden;
      color:#ffffff;
      font-size: 12px;
      text-align: center;
    }
    .s8t9a0i8y66-quan-item .s8t9a0i8y66-yuan{
      font-size: 12px;
    }
    .s8t9a0i8y66-m-quan{
      height:18.6px;
      margin-top: 0.5333vw;
    }
    .s8t9a0i8y66-m-quan-item{
      position: relative;
      border: 1px solid #E02020;
      background: #E02020;
      // max-width:80px;
      height:18px;
      overflow:hidden;
      color:#ffffff;
      font-size: 11px;
      padding: 0 2px;
      text-align: center;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      margin-right: 0.8vw;
      margin-top: 0.5333vw;
      vertical-align: middle;
      line-height: 3.7333vw;
    }
    
    .s8t9a0i8y66-quan-amount{
      font-size: 14px;
    }
    .s8t9a0i8y66-yuan{
      font-size:10px; padding-left:3px; position: relative; top: 0px;
    }
    .s8t9a0i8y66-m-quan-item .s8t9a0i8y66-quan-amount{
      font-size: 11px;
    }
    .s8t9a0i8y66-m-quan-item .s8t9a0i8y66-yuan{
      top: 1px;
    }
    // for detail
    .bottombarRight{
      position: relative;
    }
    .s8t9a0i8y66-bottom-action{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
    }
    .s8t9a0i8y66-m-action{
      height: 10.66667vw!important;
    }
    .s8t9a0i8y66-m-action .s8t9a0i8y66-action-item{
      height: 10.66667vw;
    }
    .s8t9a0i8y66-action-item{
      height: 100%;
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      // color: #ffffff;
      color: transparent;
    }
    .s8t9a0i8y66-joincar{
      // background: #EB6868;
      background: transparent;
    }
    .s8t9a0i8y66-m-action .s8t9a0i8y66-joincar{
      border-top-left-radius: 5.33333vw;
      border-bottom-left-radius: 5.33333vw; 
    }
    .s8t9a0i8y66-p-action .s8t9a0i8y66-joincar{
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px; 
    }
    .s8t9a0i8y66-bynow{
      // background: #E02020;
      background: transparent;
    }
    .s8t9a0i8y66-m-action .s8t9a0i8y66-bynow{
      border-top-right-radius: 5.33333vw;
      border-bottom-right-radius: 5.33333vw;
    }
    .s8t9a0i8y66-p-action .s8t9a0i8y66-bynow{
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
    .s8t9a0i8y66-label{
      font-size: 14px;
      // color: #ffffff;
      color: transparent;
    }
    .s8t9a0i8y66-label10{
      font-size: 10px;
      position:relative;
      line-height: 15px;
    }
    .s8t9a0i8y66-l-12{
      left: -12px;
    }
    .s8t9a0i8y66-l-3{
      left: -3px;
    }
    .s8t9a0i8y66-quan-modal-box{
      position:fixed;
      z-index:2147483647;
      top:0;
      left:0;
      width:100%;
      height:100%;
      background: rgba(0,0,0,0.5);
    }
    .s8t9a0i8y66-quan-modal{
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.08);
      position:fixed;
      z-index:2147483647;
      top:50%;
      left:50%;
      transform: translate(-50%, -50%);
      width: 320px;
      height: 580px;
      border-radius: 10px;
      background: #ffffff;
      padding-top:40px;
      box-sizing: border-box;
      overflow: hidden;
    }
    .s8t9a0i8y66-quan-modal-title{
      position:fixed;
      z-index:2147483647;
      overflow: hidden;
      left: 20px;
      top: 5px;
      width:300px;
      height:30px;
      font-size: 17px;
      color: var(--s-icon-block);
      line-height: 30px;
      font-weight: 500;
    }
    /* 创建一个容器 */
    .s8t9a0i8y66-quan-close-con {
      position:fixed;
      z-index:2147483647;
      overflow: hidden;
      right: 5px;
      top: 5px;
      width:30px;
      height:30px;
      background: var(--quan-bg);
      border-radius:50%;
      user-select: none;
      cursor: pointer;
    }

    /* 创建第一条斜线 */
    .s8t9a0i8y66-quan-close-con::before,
    .s8t9a0i8y66-quan-close-con::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;   /* 斜线的宽度 */
      height: 2px;   /* 斜线的高度 */
      background-color: var(--s-icon-block); /* 斜线的颜色 */
    }

    /* 旋转45度，形成斜线 */
    .s8t9a0i8y66-quan-close-con::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    /* 旋转-45度，形成另一条斜线 */
    .s8t9a0i8y66-quan-close-con::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    .s8t9a0i8y66-quan-mask{
      position:fixed;
      z-index:99999;
      overflow: hidden;
      left:0;
      top:0;
      width:100%;
      height:100%;
      // background: rgba(255,255,255,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      backdrop-filter: blur(10px);
    }
    .s8t9a0i8y66-quan-modal iframe{
      border-radius: 10px;
      border: none;
      padding: 0;
      margin: 0;
      position: relative;
      z-index: 999999;
      overflow: hidden;
      scrollbar-width: none; /* Firefox */
    }
      
    .s8t9a0i8y66-quan-modal iframe::-webkit-scrollbar {
      display: none; /* Chrome, Safari and Opera */
    }
    .s8t9a0i8y66-quan-modal .s8t9a0i8y66-quan-none{
      border-radius: 10px;
      border: none;
      padding: 0;
      margin: 0;
      position: relative;
      z-index: 999999;
      color: var(--s-icon-block);
      font-size: 18px;
      width:100%;
      height: 100%;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .s8t9a0i8y66-loading-dots {
      display: inline-block;
    }
    .s8t9a0i8y66-black span{
      background-color: #333;
    }
    .s8t9a0i8y66-white span{
      background-color: #ffffff;
    }
    .s8t9a0i8y66-loading-dots span {
      display: inline-block;
      width: 8px;
      height: 8px;
      margin: 0 2px;
      border-radius: 50%;
      animation: loading 1.2s infinite ease-in-out both;
    }
    
    .s8t9a0i8y66-loading-dots span:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    .s8t9a0i8y66-loading-dots span:nth-child(2) {
      animation-delay: -0.16s;
    }
    
    .s8t9a0i8y66-toast {
      visibility: hidden;
      min-width: 250px;
      max-width: 300px;
      background-color: rgba(0,0,0,0.75);
      color: #fff;
      text-align: center;
      border-radius: 5px;
      padding: 16px;
      position: fixed;
      z-index: 99;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 17px;
      opacity: 0;
      transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
    }

    .s8t9a0i8y66-toast.s8t9a0i8y66-show {
      visibility: visible;
      opacity: 1;
    }
    
    .s8t9a0i8y66-loading-pannel.s8t9a0i8y66-loading-pannel-show {
      visibility: visible;
      opacity: 1;
    }

    .s8t9a0i8y66-loading-pannel{
      visibility: hidden;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      text-align: center;
      position: fixed;
      z-index: 99;
      left: 0;
      top: 0;
      opacity: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
    }
    .s8t9a0i8y66-loading-msg{
      color: #fff;
      font-size: 17px;
      text-align: center;
      max-width: 300px;
    }
    
    @keyframes loading {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }

  `;

  GM_addStyle(__style);

  const loadingHtml = (scale, bgColor) => {
    scale = scale || 1;
    bgColor = bgColor ? `s8t9a0i8y66-${bgColor}` : "s8t9a0i8y66-black";
    return `<div class="s8t9a0i8y66-loading-dots ${bgColor}" style="zoom: ${scale}; '-moz-transform': scale(${scale}); '-moz-transform-origin': ${scale}"><span></span><span></span><span></span></div>`;
  }
  
  const listPageAHref = "a[href*='/item.htm']:not([check-quan]), a[href*='/detail.htm']:not([check-quan]), a[href^='https://a.m.taobao.com/i']:not([check-quan])"
  
  // if(TaoQQUtils.isMobile()){
  //   const customUserAgent = 'Mozilla/5.0 (Linux; U; Android 7.0; zh-CN; PRO 7-S Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/11.9.4.974 UWS/2.13.2.46 Mobile Safari/537.36 AliApp(DingTalk/4.6.29) com.alibaba.android.rimet/11388461 Channel/10002068 language/zh-CN';
  //   // console.log("isMobile to set userAgent")
  //   TaoQQUtils.setUserAgentInfo(customUserAgent);
  //   // __style = __style + `body{margin-top:148px!important;}`;
  // }


  function generateSign(param, timestamp){
    const before = `TOBEBESTENG${param}${timestamp}`;
    return TaoQQUtils.md5(before);
  }

  function createToast(){
    let toastDom = document.querySelector("#s8t9a0i8y66_toast");
    if(toastDom){
      return toastDom;
    }else{
      toastDom = document.createElement("div");
      toastDom.id = "s8t9a0i8y66_toast";
      toastDom.classList.add("s8t9a0i8y66-toast");
      document.body.appendChild(toastDom);
    }
    return toastDom;
  }

  function showToast(message, delayed){
    delayed = delayed || 2000;
    const toastDom = createToast();
    toastDom.innerText = message;
    toastDom.className = "s8t9a0i8y66-toast s8t9a0i8y66-show";
    let toastTime = setTimeout(function() {
      toastDom.className = "s8t9a0i8y66-toast";
      clearTimeout(toastTime);
      toastTime = null;
    }, delayed);
    
  }

  function createLoadingPannel(){
    let loadingPannelDom = document.querySelector("#s8t9a0i8y66_loading_pannel");
    if(loadingPannelDom){
      return loadingPannelDom;
    }else{
      const loadingDomArr = [
        `<div class='s8t9a0i8y66-loading-pannel' id='s8t9a0i8y66_loading_pannel'>`,
        `<div class='s8t9a0i8y66-loading-msg'></div>`,
        loadingHtml(0.7, "white"),
        "</div>"
      ];
      document.body.appendChild(TaoQQUtils.parseToDOM(loadingDomArr.join("")));
      loadingPannelDom = document.querySelector("#s8t9a0i8y66_loading_pannel");
    }
    return loadingPannelDom;
  }

  function showLoadingPannel(message){
    const loadingPannelDom = createLoadingPannel();
    loadingPannelDom.querySelector(".s8t9a0i8y66-loading-msg") && (loadingPannelDom.querySelector(".s8t9a0i8y66-loading-msg").innerText = message);
    loadingPannelDom.className = "s8t9a0i8y66-loading-pannel s8t9a0i8y66-loading-pannel-show";
  }

  function hiddenLoadingPannel(){
    let loadingPannelDom = document.querySelector("#s8t9a0i8y66_loading_pannel");
    if(loadingPannelDom){
      loadingPannelDom.querySelector(".s8t9a0i8y66-loading-msg") && (loadingPannelDom.querySelector(".s8t9a0i8y66-loading-msg").innerText = "");
      loadingPannelDom.className = "s8t9a0i8y66-loading-pannel";
    }
  }
  

  function fetchItemTaoQuanquan(itemId, title,  mall = "taobao"){
    // console.log("fetchItemTaoQuanquan-----", itemId, title,  mall);
    return new Promise((resolve, reject) => {
      if(!itemId && !title){
        reject(true);
      }
      const timestamp = new Date().getTime()+"";
      const biz = {mall, timestamp}
      let reqPath = "/queryCoupon";
      let param = itemId;
      if(itemId){
        biz.itemId = itemId;
      }else{
        biz.title = title;
        reqPath = "/querySearchList"
        param = encodeURI(title);
        // console.log("fetchItemTaoQuanquan--sign-before-biz---", biz)
      }
      const sign = generateSign(param, timestamp)
      // console.log("fetchItemTaoQuanquan--sign-after----", sign)
      biz.sign = sign;
      const postData = {biz};
      fetch(`https://api.staybrowser.com/tqq/product${reqPath}`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })
      .then(response => {
        if (!response.ok) {
          reject('Network response was not ok ' + response.statusText)
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // 将响应转换为 JSON
       
      })
      .then(data => {
        // console.log("fetchItemTaoQuanquan---1-resp-------", data)
        if(data){
          // console.log("fetchItemTaoQuanquan-2-resp-----", data)
          resolve(data)
        }else{
          // console.log("fetchItemTaoQuanquan--fetch error-------", result);
          resolve({})
        }
      })
      .catch((error) => {
        console.error('Error:', error); // 处理错误
        reject(true);
      });
    })
  }

  function sendLogEvent(type, data){
    const biz = {
      uuid: TaoQQUtils.getUserDeviceId(),
      type,
      data
    }
    fetch(`https://api.staybrowser.com/tqq/log/sendLog`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify({biz}) 
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // 将响应转换为 JSON
    })
    .then(data => {
      // console.log("sendLogEvent----resp-------", data)
    })
    .catch((error) => {
      console.error('Error:', error); // 处理错误
    });
  
  }
  
  (function({pageType, switchOff}){
    // if(switchOff){
    //   return;
    // }
    const itemResMap = new Map();
    switch(pageType){
      case "list_page":
        handleListPage();
        break;
      case "detail_page":
        handleDetailPage();
        break;
      case "quan_page":
        handleQuanPage();
    }

    function generateQuanCornerToList(nodeItem){
      let currentNode = nodeItem;
      let boxClass = "";
      if(TaoQQUtils.isMobile() && !TaoQQUtils.isMobileTbHome()){
        currentNode = nodeItem.nextElementSibling;
        boxClass = "s8t9a0i8y66-m-quan";
      }else{
        // boxClass = window.location.pathname.includes("/search") ? 's8t9a0i8y66-quan-lp3-box' : 's8t9a0i8y66-quan-lp0-box';
        // currentNode = nodeItem.querySelector(".Wonderful--mask--1fwB7tp")
        // if(!currentNode){
        //   currentNode = nodeItem.querySelector(".FloorModule--mask--26Ahf9Q")
        // }
        // if(!currentNode){
        //   currentNode = nodeItem.querySelector(".MainPic--mainPicWrapper--iv9Yv90")
        // }
        // if(!currentNode){
        //   currentNode = nodeItem.querySelector(".MainPic--mainPicWrapper--vKqzSkJ")
        // }
        // if(!currentNode){
        //   currentNode = nodeItem.querySelector(".img-wrapper")
        // }

      }
      if(!currentNode){
        // console.log("nodeItem-----", nodeItem)
        return null;
      }
      const quanDom = [
        `<div class='s8t9a0i8y66-quan-box ${boxClass}'>`,
        loadingHtml(0.6),
        "</div>"
      ];
      currentNode.appendChild(TaoQQUtils.parseToDOM(quanDom.join("")));
      return currentNode.querySelector(".s8t9a0i8y66-quan-box");
    }
    
    function handleListPage(){
      let searchList = [];
      let insertIndex = -1;
      const __goods_item_style = `
        .s8t9a0i8y66-m-b{
          margin-bottom: 2.6667vw;
        }
        .s8t9a0i8y66-item{
          align-items: center;
          color: #000;
          display: block;
          text-decoration: none;
          width: 100%;
        }
        .s8t9a0i8y66-img-mask{
          background-color: rgba(0, 0, 0, .02);
          height: 100%;
          position: absolute;
          width: 100%;
        }
        .s8t9a0i8y66-img{
          border-radius: 3.2vw;
          width: 47.6vw; 
          min-height: 47.6vw; 
          object-fit: cover;
        }
        .s8t9a0i8y66-title-wrapper{
          display: flex;
          flex-direction: row;
          margin: 1.6vw 0 0 1.6vw;
          width: 95%;
        }
        .s8t9a0i8y66-title{
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-wrap: break-word;
          display: -webkit-box;
          font-size: 3.46667vw;
          font-weight: 700;
          line-height: 4.8vw;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
          width: 100%;
          word-break: break-all;
        }
        .s8t9a0i8y66-price-wrapper{
          align-items: flex-end;
          display: flex;
          flex-direction: row;
          margin: .66667vw 0 0 1.6vw;
          width: 44.4vw;
        }
        .s8t9a0i8y66-price-unit{
          color: #ff5000;
          font-family: Alibaba-Sans102, PingFangSC-Medium;
          font-size: 3.2vw;
          font-weight: 700;
          line-height: 3.73333vw;
        }
        .s8t9a0i8y66-price-int{
          color: #ff5000;
          font-family: Alibaba-Sans102, PingFangSC-Regular;
          font-size: 5.6vw;
          font-weight: 700;
          line-height: 5.6vw;
          margin-left: .66667vw;
        }
        .s8t9a0i8y66-price-float{
          color: #ff5000;
          font-family: Alibaba-Sans102, PingFangSC-Regular;
          font-size: 4.26667vw;
          font-weight: 700;
          line-height: 4.53333vw;
        }
        .s8t9a0i8y66-price-sales{
          color: #999;
          font-family: PingFangSC-Regular;
          font-size: 3.2vw;
          line-height: 4.53333vw;
          margin-left: 1.33333vw;
        }
      `;
      GM_addStyle(__goods_item_style);
      sendLogEvent("list_page", window.location.href);
     
      function findABySelector(){
        const itemDomList = Array.from(document.querySelectorAll(listPageAHref));
        handleItemList(itemDomList);
      }
      
      function observeItemA(){
        const MutationObserverSelf = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        const mutationObserver = new MutationObserverSelf((mutations, observer) => {
          mutations.map((function(record){
            // console.log("record-----", record)
            if(record.addedNodes){
              for(let i=0;i<record.addedNodes.length;++i){
  
                let addedItem = record.addedNodes.item(i);
                // console.log("addedItem----", addedItem,addedItem.nodeName, addedItem.nodeType)
                if(addedItem.nodeType !== Node.ELEMENT_NODE){
                  continue
                }
                let aNodes = addedItem.querySelectorAll(listPageAHref);
                const aNodeList = Array.from(aNodes);
                if(addedItem.nodeName.toUpperCase() === "A" && !addedItem.getAttribute("check-quan")){
                  aNodeList.push(addedItem);
                }
                handleItemList(aNodeList);
              }
            }
          }))
        });
        
  
        mutationObserver.observe(document, {childList: true, subtree: true, attributes: true, attributeFilter: ['value']});
      }


      
      function handleInsertGoods(){
        if(!searchList || searchList.length == 0 || insertIndex+1>=searchList.length){
          return;
        }
        while(searchList.length>insertIndex){
          insertIndex = insertIndex + 1;
          const goodsItem = searchList[insertIndex];
          let nth = 3 * Math.floor(insertIndex/2);
          let parent = document.querySelector(".rax-scrollview-webcontainer .rax-view .rax-view:first-child");
          if(insertIndex%2 == 1){
            parent = document.querySelector(".rax-scrollview-webcontainer .rax-view .rax-view:last-child");
            nth = 3 * Math.floor(insertIndex/2) + 2;
          }
          
          const nthChild = parent.children[nth];
          if(!nthChild){
            break;
          }
          let quanItem = "";
          if(goodsItem.couponAmount && Number(goodsItem.couponAmount) > 0){
            quanItem = `<div class='${TaoQQUtils.isMobile()&&!TaoQQUtils.isMobileTbHome()?'s8t9a0i8y66-m-quan-item':'s8t9a0i8y66-quan-item'}'>隐藏券<span class='s8t9a0i8y66-yuan'>￥</span><span class='s8t9a0i8y66-quan-amount'>${goodsItem.couponAmount}</span></div>`;
          }
          
          const newGoods = [
            `<div class="rax-view-v2 s8t9a0i8y66-m-b" stay-goods="search">`,
            `<div class="rax-view-v2">`,
            `<a class="s8t9a0i8y66-item" check-quan="true" href=${goodsItem.itemUrl}>`,
            `<div class="rax-view-v2" style="position:relative">`,
            `<div class="rax-view-v2 s8t9a0i8y66-img-mask"></div>`,
            `<img class="s8t9a0i8y66-img" src=${goodsItem.pictUrl} />`,
            `</div>`,
            `<div class="rax-view-v2 s8t9a0i8y66-title-wrapper"><div class="rax-view-v2 s8t9a0i8y66-title">${goodsItem.title}</div></div>`,
            `<div class="rax-view-v2 s8t9a0i8y66-price-wrapper">`,
            `<span class="rax-text-v2 s8t9a0i8y66-price-unit">￥</span>`,
            `<span class="rax-text-v2 s8t9a0i8y66-price-int">${Math.floor(goodsItem.realPrice)}.</span>`,
            `<span class="rax-text-v2 s8t9a0i8y66-price-float">${TaoQQUtils.computFloat(goodsItem.realPrice)}</span>`,
            `<span class="rax-text-v2 s8t9a0i8y66-price-sales">${TaoQQUtils.computWan(goodsItem.volume)}人付款</span>`,
            `</div>`,
            `</a>`,
            `<div class="rax-view-v2 SalesPoint--subIconWrapper--1MDy2Qt">`,
            `<div class="rax-view-v2" style="background-color: rgb(255, 255, 255); border: 1px solid rgb(255, 168, 128); border-radius: 2px; display: flex; align-items: center; justify-content: center; margin-right: 0.8vw; margin-top: 0.5333vw; vertical-align: middle; line-height: 3.7333vw;"><span class="rax-text-v2 " style="color: rgb(255, 80, 0); font-size: 2.6667vw; padding: 0.2667vw 0.2667vw 0px;">包邮</span></div>`,
            `<div class="rax-view-v2" style="background-color: rgb(255, 255, 255); border: 1px solid #E02020; border-radius: 2px; display: flex; align-items: center; justify-content: center; margin-right: 0.8vw; margin-top: 0.5333vw; vertical-align: middle; line-height: 3.7333vw;"><span class="rax-text-v2 " style="color: #E02020; font-size: 2.6667vw; padding: 0.2667vw 0.2667vw 0px;">淘补贴推荐</span></div>`,
            `${quanItem}`,
            `</div>`,
            `<div class="rax-view-v2 ShopInfo--shopInfo--15nm1iL"><div class="rax-view-v2 ShopInfo--TextAndPic--1Io1UAy"><span style="font-size: 2.9333vw; line-height: 4.4vw; color: rgb(102, 102, 102); flex-shrink: 0; margin-right: 1.3333vw; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${goodsItem.shopTitle}</span><span style="font-size: 2.9333vw; line-height: 4.4vw; color: rgb(51, 51, 51); flex-shrink: 1; margin-right: 0vw; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">进店</span></div><img class="rax-image ShopInfo--shopInfoPic--PqOWXdF" quality="high" autoscaling="false" resizemode="cover" data-once="true" src="//gw.alicdn.com/imgextra/i4/O1CN01y5K1Tu1bAhGJTfw8e_!!6000000003425-2-tps-12-24.png_.webp" style="width: 1.0667vw; height: 2.1333vw; object-fit: cover;"></div>`,
            `</div>`,
            `</div>`
          ];
          parent.insertBefore(TaoQQUtils.parseToDOM(newGoods.join("")), nthChild);
        }
       
        
      }

      function searchTitle(title){
        if(!title || title == ""){
          return;
        }
        console.log("searchTitle-----title----", title);
        // title = encodeURI(title);
        insertIndex = -1;
        fetchItemTaoQuanquan("", title, "taobao").then(res => {
          console.log("searchTitle---res-", title, res);
          const { server : {message} = {}, biz: { materialItemList } = {} } = res;
          searchList = materialItemList;
          handleInsertGoods();
        }).catch(err => {
          console.log("searchTitle---err-", err)
        })
      }

      function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      async function processItemsInBatches(itemList, limit) {
        const batches = [];
        for (let i = 0; i < itemList.length; i += limit) {
            const batch = itemList.slice(i, i + limit);
            batches.push(batch);
        }

        for (const batch of batches) {
            await Promise.all(batch.map(item => toCheckQuan(item)));
            await delay(1000); // 等待1秒
        }
      }

      function handleItemList(itemList = []){
        processItemsInBatches(itemList, 5)
      }

      function toCheckQuan(nodeItem){
        return new Promise((resolve, reject) => {
          nodeItem.setAttribute('check-quan', "true");
          const hrefUrl = nodeItem.getAttribute("href");
          if(!hrefUrl){
            resolve(true)
            return;
          }
          
          if(TaoQQUtils.isMobileTbHome() && nodeItem.classList && nodeItem.classList.contains("recommend-info")){
            resolve(true)
            return;
          }
          let itemId = TaoQQUtils.queryURLParams(hrefUrl, "id");
          if(!itemId || itemId == ""){
            const regex = /i(\d+)\.htm/;
            const match = hrefUrl.match(regex);
            if (match) {
              itemId = match[1];
            } else {
              // console.log("No match found itemId.");
              resolve(true)
              return;
            }
          }
          if(!itemId || itemId == ""){
            resolve(true)
            return;
          }
          const currentNode = generateQuanCornerToList(nodeItem);
          fetchItemTaoQuanquan(itemId, "", "taobao").then(res => {
            // console.log("toCheckQuan---res-", res)
            let quanItem = "";
            const { server : {message} = {}, biz: { coupon_amount, coupon_url, tljAmount } = {} } = res;
            if(coupon_amount && Number(coupon_amount) > 0){
              quanItem = `<div class='${TaoQQUtils.isMobile()&&!TaoQQUtils.isMobileTbHome()?'s8t9a0i8y66-m-quan-item':'s8t9a0i8y66-quan-item'}'>隐藏券<span class='s8t9a0i8y66-yuan'>￥</span><span class='s8t9a0i8y66-quan-amount'>${coupon_amount}</span></div>`;
            }
            if(tljAmount && Number(tljAmount) > 0){
              if(quanItem && (!TaoQQUtils.isMobile() ||  TaoQQUtils.isMobileTbHome())){
                quanItem = quanItem + `<span style="color: #fff;font-size: 16px;">+</span>`
              }
              quanItem = quanItem + `<div class='${TaoQQUtils.isMobile()&&!TaoQQUtils.isMobileTbHome()?'s8t9a0i8y66-m-quan-item':'s8t9a0i8y66-quan-item'}'>预估补贴<span class='s8t9a0i8y66-yuan'>￥</span><span class='s8t9a0i8y66-quan-amount'>${tljAmount}</span></div>`;
            }
            if(quanItem && (!TaoQQUtils.isMobile() ||  TaoQQUtils.isMobileTbHome())){
              quanItem = `<div class="s8t9a0i8y66-quan-corner-box">${quanItem}</div>`
            }
            if(currentNode){
              if(TaoQQUtils.isMobile() && !TaoQQUtils.isMobileTbHome()){
                const parentNode = currentNode.parentNode;
                currentNode.remove();
                parentNode.appendChild(TaoQQUtils.parseToDOM(quanItem));
              }else{
                // corner 方式
                currentNode.innerHTML = quanItem
              }
            }
            resolve(true);
          }).catch(err => {
            // console.log("toCheckQuan---err-", err)
            currentNode && (currentNode.innerHTML =  "");
            resolve(true)
          })
        })
        
      }

      function listenerSearchInput(inputDom){
        if(inputDom){
          searchTitle(inputDom.value);
          inputDom.addEventListener('change', (event) => {
            let searchTimer = setTimeout(()=>{
              console.log('Input value changed 2 to:', event.target.value, inputDom.value);
              searchTitle(inputDom.value);
              clearTimeout(searchTimer);
            }, 200)
          });
        }
      }

      function startFindAItem(){
        findABySelector();
        observeItemA();
      }

      startFindAItem();

    }

    function handleDetailPage(){
      if(window.top != window.self){
        // console.log("handleDetailPage------top!=self")
        // console.log('iframe--window-url-:', window.location.href);
        window.addEventListener("message", (event)=>{
          const action = event.data.action;
          // console.log("---iframe----parent---window-----", event)
          if(action === "checkout_goods_id"){
            const itemSecretId = event.data.itemSecretId;
            const index = event.data.index;
            window.__stay_tb_item_secret_id = itemSecretId;
            window.__stay_tb_item_index = index
            // console.log("action----checkout_goods_id--itemSecretId-", itemSecretId);
            window.top.postMessage({action: 'checkout_goods_id_res', url:  window.location.href, index, itemSecretId}, "*");
          }else if(action === "get_coupon"){
            window.top.postMessage({action: 'get_coupon_res', url:  window.location.href, id:  event.data.id}, "*");
          }
        })
        return;
      }

      

      //for detail
      let quanItem = "";
      let showModalSource = "";
      let quanItemsMark = null;
      let quanModalDom = null;
      let showCouponModal = false;
      const DETAIl_PAGE = {
        title: "淘补贴",
        couponUrl: "",
        shouldReplace: false,
        couponAmount: "",
        loading: true,
        tljLoading: true,
        tljAmount: "",
        confirmTljAmount: "",
      }
      const itemId = TaoQQUtils.queryURLParams(window.location.href, "id");
      // console.log("handleDetailPage----itemId----", itemId);
      sendLogEvent("detail_page", `{itemId:${itemId}}`);
      
      function addQuanItemAction(){
        quanItemsMark && quanItemsMark.addEventListener("click", generateTLJAndShowCouponModalEvent)
      }

      function removeQuanItemAction(){
        quanItemsMark && quanItemsMark.removeEventListener("click", generateTLJAndShowCouponModalEvent)
      }

      function appendQuanDom(){
        quanItemsMark = document.querySelector(".s8t9a0i8y66-quan-box");
        if(quanItemsMark){
          return quanItemsMark;
        }
        let currentNode = null;
        let boxClass = "s8t9a0i8y66-detail-m-quan";
        let nthChild = null
        if(TaoQQUtils.isMobile()){
          boxClass = "s8t9a0i8y66-detail-m-quan";
          currentNode = document.querySelector("#scrollViewContainer .rax-scrollview-webcontainer .card-first");
          if(!currentNode){
            currentNode = document.querySelector("#detailCardFirst");
            if(currentNode){
              boxClass = boxClass + " s8t9a0i8y66-m-awp"
              nthChild = currentNode.children[1];
            }else{
              currentNode = document.querySelector("div");
              nthChild = currentNode[0];
              boxClass = boxClass + " s8t9a0i8y66-detail-m-fixed";
            }
          }else{
            nthChild = currentNode.children[1];
          }
        }else{
          boxClass = "s8t9a0i8y66-detail-p-quan";
          currentNode = document.querySelector("#purchasePanel .PurchasePanel--contentWrap--3APbL7v");
          if(currentNode){
            nthChild = currentNode.children[2];
          }else{
            currentNode = document.querySelector(".Item--content--12o-RdR .BasicContent--itemInfo--2NdSOrj .Price--root--1CrVGjc");
            if(currentNode){
              nthChild = currentNode.children[0];
            }else{
              currentNode = document.querySelector(".Item--content--12o-RdR .BasicContent--itemInfo--2NdSOrj .PromotionNew--promotionNew--2NhXfsn");
              if(currentNode){
                nthChild = currentNode.children[0];
              }else{
                currentNode = Array.from(document.querySelectorAll(".contentWrap--eIMKdlQ7")).find(element => {
                    const style = getComputedStyle(element);
                    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
                });
                if(currentNode){
                  nthChild = currentNode.children[2];
                }
              }
            }
          }
          if(!currentNode){

            currentNode = document.querySelector("#ice-container .pageContentWrap");
            if(currentNode){
              currentNode.style.position = "relative";
              nthChild = currentNode.querySelectorAll("div")[0];
              boxClass = boxClass + " s8t9a0i8y66-detail-pc-abs";
            }else{
              currentNode = document.querySelector("div");
              nthChild = currentNode[0];
              boxClass = boxClass + " s8t9a0i8y66-detail-pc-fixed";
            }
          }
        }
        const quanDom = [
          `<div class='s8t9a0i8y66-quan-box ${boxClass}'>`,
          loadingHtml(0.6),
          "</div>"
        ];
        currentNode.insertBefore(TaoQQUtils.parseToDOM(quanDom.join("")), nthChild);
        quanItemsMark = currentNode.querySelector(".s8t9a0i8y66-quan-box");
        addQuanItemAction();
        return quanItemsMark;
      }

      function addActionMaskDom(){
        let actionOriginDom = null;
        let actionClass = "";
        if(TaoQQUtils.isIpad()){
          return;
        }
        if(TaoQQUtils.isMobile()){
          actionOriginDom = document.querySelector(".bottombar-inner .bottombarRight .bottombarRight");
          actionClass = "s8t9a0i8y66-m-action"
          if(!actionOriginDom){
            actionClass = "";
            actionOriginDom = document.querySelector("#bottomBarSection div[view-name='FrameLayout'] div[view-name='LinearLayout'] div[view-name='LinearLayout'] div[view-name='FrameLayout'] .dx-event-node[aria-label*='请用手机']");
          }
          if(!actionOriginDom){
            // console.log("actionOriginDom-----null----")
            actionClass = ""
            actionOriginDom = document.querySelector("#h5Detail #bottomBar #bottomBarSection > div > div > div > div:nth-child(2) > div > div:nth-child(2)");
            // actionOriginDom = document.querySelector("#bottomBarSection div[view-name='FrameLayout'] div[view-name='LinearLayout'] div[view-name='FrameLayout'] div[view-name='LinearLayout']")
          }
          return;
        }else{
          actionOriginDom = document.querySelector(".PurchasePanel--footWrap--3w0gUyF .Actions--root--uNUWMGB .Actions--leftButtons--2fasaTH");
          if(!actionOriginDom){
            actionOriginDom = document.querySelector("#root .Actions--root--hwEujgc .Actions--leftButtons--1M3KkF7");
          }
          actionClass = "s8t9a0i8y66-p-action"
        }

        if(!actionOriginDom){
          // console.log("actionOriginDom-----null----not append-----")
          return ;  
        }
        
        let actionDom = [
          `<div class="s8t9a0i8y66-bottom-action ${actionClass}" quan-modal="hidden">`,
          `<div class='s8t9a0i8y66-joincar s8t9a0i8y66-action-item' type="joincar">`,
          `<div class="s8t9a0i8y66-label10 s8t9a0i8y66-l-12">领券￥<span class="s8t9a0i8y66-label">${DETAIl_PAGE.couponAmount}</span></div>`,
          `<div class="s8t9a0i8y66-label">加入购物车</div>`,
          "</div>",
          `<div class='s8t9a0i8y66-bynow s8t9a0i8y66-action-item' type="bynow">`,
          `<div class="s8t9a0i8y66-label10 s8t9a0i8y66-l-3">领券￥<span class="s8t9a0i8y66-label">${DETAIl_PAGE.couponAmount}</span></div>`,
          `<div class="s8t9a0i8y66-label">立即购买</div>`,
          "</div>",
          "</div>"
        ];
        // console.log("actionOriginDom-------", actionOriginDom, actionDom)
        if(!(actionOriginDom.style.position) && !window.getComputedStyle(actionOriginDom).position){
          actionOriginDom.style.position = "relative";
        }
        
        actionOriginDom.appendChild(TaoQQUtils.parseToDOM(actionDom.join("")));
        addCarBuyActionEvent();
        
      }

      function handleTbopenSchema(){
        if(DETAIl_PAGE.tljLoading){
          showToast("补贴正在确认中...");
          return;
        }else{
          // console.log("handleTbopenSchema----DETAIl_PAGE---", DETAIl_PAGE)
          if(DETAIl_PAGE.couponUrl){
            let openUrl = "";
            if(window.__staytorn){
              openUrl = `${DETAIl_PAGE.couponUrl.replace(/^https?:\/\//g, "taobao://")}&stayWebpageClick=true`;
            }else{
              openUrl = DETAIl_PAGE.couponUrl.replace(/^https?:\/\//g, "tbopen://");
            }
            let targetGun = document.createElement('a');
            targetGun.rel="noopener noreferrer";
            targetGun.href = openUrl;
            targetGun.click();
          }
        }
      }

      function generateTLJAndShowCouponModalEvent(event){
        event.stopPropagation();
        if(DETAIl_PAGE.loading){
          showToast("淘补贴正在确认中...");
          return;
        }
        if(DETAIl_PAGE.itemSecretId){
          if(!DETAIl_PAGE.confirmTljAmount){
            queryTLJByItemId(getShopname(), DETAIl_PAGE.itemSecretId, getLowerPrice()).then(res=>{
              const { server : {message} = {}, biz: { amount, sendUrl } = {} } = res;
              // console.log("queryTLJByItemId---res-", res)
              if(amount){
                DETAIl_PAGE.tljAmount = amount
                DETAIl_PAGE.confirmTljAmount = amount
              }
              if(sendUrl){
                if(sendUrl != DETAIl_PAGE.couponUrl){
                  DETAIl_PAGE.shouldReplace = DETAIl_PAGE.couponUrl != sendUrl ? true: false;
                }
                DETAIl_PAGE.couponUrl = sendUrl;
              }
              updateTljAmount();
              createCouponIframeIntoModal();
              showQuanModal(event);
            }).catch(err=>{
              console.log("queryTLJByItemId---err-", err)
              handleTljLoadingAndRemoveQuanItem();
              showToast("淘补贴弄丢了~")
              hiddenLoadingPannel();
            })
          }else{
            showQuanModal(event);
          }
        }else{
          DETAIl_PAGE.tljLoading = false;
          showQuanModal(event);
        }
      }

      

      function addCarBuyActionEvent(){
        document.querySelector(".s8t9a0i8y66-bottom-action") && document.querySelector(".s8t9a0i8y66-bottom-action").addEventListener("click", generateTLJAndShowCouponModalEvent)
      }

      function removeCarBuyActionEvent(){
        document.querySelector(".s8t9a0i8y66-bottom-action") && document.querySelector(".s8t9a0i8y66-bottom-action").removeEventListener("click", generateTLJAndShowCouponModalEvent)
      }

      /**
       * @param {Number} targetX
       * @param {Number} targetY
       * @param {Number} targetWidth
       * @param {Number} targetHeight
       * @returns
       */
      function calcPolygonPoints(targetX, targetY, targetWidth, targetHeight){
        targetX = Math.floor(targetX);
        targetY = Math.floor(targetY) + 40;
        targetWidth = Math.ceil(targetWidth);
        targetHeight = Math.ceil(targetHeight);
        // targetHeight = TaoQQUtils.sub(targetHeight, TaoQQUtils.mul(borderSize, 2));
        let rectRightPointX = targetX + targetWidth;
        let rectBottomPointY = targetY + targetHeight;
        let polygon = `polygon(0 0, 0 ${targetY}px, ${targetX}px ${targetY}px, ${rectRightPointX}px ${targetY}px, ${rectRightPointX}px ${rectBottomPointY}px, ${targetX}px ${rectBottomPointY}px, ${targetX}px ${targetY}px, 0 ${targetY}px, 0 100%,100% 100%, 100% 0)`;
        return polygon;
      }

      function showQuanModal(event){
        // bottom click
        showModalSource = "carbuy";
        let quanModal = event && event.target? event.target.closest('.s8t9a0i8y66-bottom-action') : "";
        if(!quanModal){
          // quan click
          quanModal = event && event.target?event.target.closest('.s8t9a0i8y66-quan-box') : "";
          showModalSource = "quanitem";
        }
        if(TaoQQUtils.isMobile() || TaoQQUtils.isIpad()){
          handleTbopenSchema();
          return;
        }
        if(quanModal && quanModal.getAttribute("quan-modal") == "show"){
          return;
        }
        quanModal && quanModal.setAttribute("quan-modal", "show");

        quanModalDom = checkModalAndCreate();
        quanModalDom.style.display = "block";
        document.body.style.overflow = "hidden"
        showCouponModal = true;
        window.addEventListener("message", (event)=>{
          const action = event.data.action;
          if(action === "iframeLoaded"){
            quanModalDom.setAttribute("quan-loaded", "true");
            quanModalDom.querySelector(".s8t9a0i8y66-quan-mask").innerHTML = "";
            quanModalDom.querySelector(".s8t9a0i8y66-quan-mask").style.display = "none";
            // 
            const react = event.data.react;
            // quanModalDom.querySelector(".s8t9a0i8y66-quan-mask").style.clipPath = calcPolygonPoints(react.left, react.top, react.width, react.height);
          }
          else if(action == "login"){
            handleCloseModalEvent();
            window.location.href = event.data.jump;
          }
        })
      }

      function removeCarBuyDom(){
        removeCarBuyActionEvent();
        document.querySelector(".s8t9a0i8y66-bottom-action") && document.querySelector(".s8t9a0i8y66-bottom-action").remove();
      }

      function handleCloseModalEvent(event){
        document.body.style.overflow = "";
        if(event){
          showModalSource = event.target.getAttribute("click-source");
        }
        if(quanModalDom){
          quanModalDom.style.display = "none";
          showCouponModal = false;
          if("carbuy" == showModalSource){
            document.querySelector(".s8t9a0i8y66-bottom-action") && document.querySelector(".s8t9a0i8y66-bottom-action").setAttribute("quan-modal", "hidden");
            removeCarBuyDom();
          }else{
            quanItemsMark && quanItemsMark.setAttribute("quan-modal", "hidden");
          }
        }
      }

      function createCouponIframeIntoModal(){
        if(!quanModalDom){
          return;
        }
        if(quanModalDom){
          let couponIframeDom = quanModalDom.querySelector(".s8t9a0i8y66-quan-frame");
          if(!couponIframeDom){
            couponIframeDom = document.createElement("iframe");
            couponIframeDom.src = DETAIl_PAGE.couponUrl;
            couponIframeDom.width = 320;
            couponIframeDom.height = 540;
            couponIframeDom.sandbox="allow-same-origin allow-scripts";
            couponIframeDom.classList.add("s8t9a0i8y66-quan-frame");
            // TaoQQUtils.parseToDOM(`<iframe class="s8t9a0i8y66-quan-frame" width=320 height=600 src=${DETAIl_PAGE.couponUrl}></iframe>`)
            quanModalDom.querySelector(".s8t9a0i8y66-quan-modal") && quanModalDom.querySelector(".s8t9a0i8y66-quan-modal").appendChild(couponIframeDom)
          }else{
            if(DETAIl_PAGE.shouldReplace){
              couponIframeDom.src = DETAIl_PAGE.couponUrl;
            }
            const loadingMask = quanModalDom.querySelector(".s8t9a0i8y66-quan-mask");
            if(loadingMask){
              quanModalDom.querySelector(".s8t9a0i8y66-quan-mask").remove();
            }
          }
          addListenerCouponModalToClose(couponIframeDom);
        }
      }

      function addListenerCouponModalToClose(couponIframeDom){
        couponIframeDom = couponIframeDom || quanModalDom.querySelector(".s8t9a0i8y66-quan-frame");
        if(!couponIframeDom){
          return;
        }
        const id = TaoQQUtils.generateUuid();
        couponIframeDom.onload = function() {
          couponIframeDom.contentWindow.postMessage({action: 'get_coupon', id}, "*");
          const callback = e => {
            // console.log("get_coupon_res---addEventListener-----", e)
            if (e.data.id !== id || e.data.action !== 'get_coupon_res') return;
            showModalSource = "carbuy";
            handleCloseModalEvent();
            window.removeEventListener('message', callback);
          }
          window.addEventListener("message", callback);
        }
      }

      function checkModalAndCreate(){
        let quanModalDom = document.querySelector(".s8t9a0i8y66-quan-modal-box")
        if(!quanModalDom){
          // console.log("checkModalAndCreate----no--quanModalDom-")
          const quanModalHtml = [
            '<div class="s8t9a0i8y66-quan-modal-box">',
            '<div class="s8t9a0i8y66-quan-modal">',
            `<div class="s8t9a0i8y66-quan-modal-title">${DETAIl_PAGE.title}</div>`,
            `<div class="s8t9a0i8y66-quan-close-con" click-source="${showModalSource}"></div>`,
            `<div class="s8t9a0i8y66-quan-mask">${loadingHtml(1)}</div>`,
            DETAIl_PAGE.tljLoading?"":`<iframe class="s8t9a0i8y66-quan-frame" sandbox="allow-same-origin allow-scripts" width=320 height=540 src=${DETAIl_PAGE.couponUrl}></iframe>`,
            "</div>",
            "</div>"
          ];
          document.body.appendChild(TaoQQUtils.parseToDOM(quanModalHtml.join("")));
          quanModalDom = document.querySelector(".s8t9a0i8y66-quan-modal-box");
          quanModalDom.querySelector(".s8t9a0i8y66-quan-close-con").addEventListener("click", handleCloseModalEvent);
          createCouponIframeIntoModal();
        }else{
          quanModalDom.querySelector(".s8t9a0i8y66-quan-close-con").setAttribute("click-source", showModalSource);
        }
        // console.log("checkModalAndCreate------quanModalDom-", quanModalDom)
        return quanModalDom;
      }
      
      function getLowerPrice(){
        try {
          // pc1
          let priceDom = document.querySelector(".Price--root--1X-r-XP .Price--priceWrap--3MY0wsh");
          if(!priceDom){
            priceDom = document.querySelector(".card-first .wrap-container");
          }
          if(!priceDom){
            priceDom = document.querySelector("#priceSection .tpl-wrapper");
          }
          if(!priceDom){
            priceDom = document.querySelector("#priceBeltSection");
          }
          if(!priceDom){
            priceDom = document.querySelector(".Price--root--1CrVGjc");
          }
          if(!priceDom){
            priceDom = document.querySelector("#ice-container .title_container--YFUwL6hx");
          }
          if(!priceDom){
            priceDom = document.querySelector(".summaryInfoWrap--Ndc7k4Hv .purchasePanel--cG3DU6bX");
          }
          let priceText = "";
          if(priceDom){
            priceText = priceDom.textContent?priceDom.textContent.replace(/隐藏券￥\d+(\.\d{1,2})?/g, '').replace(/预估补贴￥\d+(\.\d{1,2})?/g, '').replace(/点击领取补贴￥\d+(\.\d{1,2})?/g, '').replace(/\s+/g, '').replace(/[¥￥]/g, '¥') : "";
          }
          if(priceText){
            const arr = priceText.match(/¥\d+(\.\d{1,2})?/g);
            if(arr && arr.length){
              var amounts = arr.map(value => parseFloat(value.replace(/[¥￥]/g, '')));
              return Math.min(...amounts);
            }
          }
        } catch (error) {
          console.error("get lower price error", error)
        }
        return "";
      }

      function getShopname(){
        try {
          let shopDom = document.querySelector(".pageContentWrap .ShopHeader--detailWrap--1zgrGb2 .ShopHeader--shopName--zZ3913d");
          if(!shopDom){
            shopDom = document.querySelector("#detailHome #storeCardSection > div > div > div > div:nth-child(3) > div:nth-child(2) > span");
            
          }
          if(!shopDom){
            shopDom = document.querySelector(".card-sixth .shop-card .rax-view-v2 span");
          }
          if(!shopDom){
            shopDom = document.querySelector(".SearchHeader--content--1TWLzdT .SearchHeader--logo--3MwMa7A");
            if(!shopDom){
              shopDom = document.querySelector(".rax-scrollview-webcontainer .market-card-wrap .market-task-wrap");
            }
            if(shopDom){
              return "天猫超市";
            }
          }
          if(!shopDom){
            // 底部联系客服
            shopDom = document.querySelector("#bottomBarSection > div > div > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > span");
            if(!shopDom){
              shopDom = document.querySelector("#root .bottombar .bottombarLeft .bottombarLeftItem .bottombarItemText");
            }
            if(shopDom && shopDom.textContent.indexOf("天猫超市") > -1){
              return "天猫超市"
            }
          }
          if(shopDom){
            if(shopDom.textContent == "淘工厂" || shopDom.textContent == "店铺" || shopDom.textContent == "自营店"){
              return "";
            }
            return shopDom.textContent;
          }
        } catch (error) {
          
        }
      }

      function getTitle(){
        try {
          let titleDom = document.querySelector(".pageContentWrap #purchasePanel .ItemTitle--root--3V3R5Y_ h1") || document.querySelector(".purchasePanel--cG3DU6bX .ItemTitle--UReZzEW5 h1");;
          if(!titleDom){
            titleDom = document.querySelector("#detailHome #titleSection");
          }
          if(!titleDom){
            titleDom = document.querySelector(".ItemHeader--root--DXhqHxP .ItemHeader--mainTitle--3CIjqW5");
          }
          if(!titleDom){
            titleDom = document.querySelector("#scrollViewContainer > div > div.rax-view-v2.card-first .rax-view-v2 span.title")
          }
          if(titleDom){
            return titleDom.textContent?titleDom.textContent.trim():"";
          }
        } catch (error) {
          
        }
      }

      function fetchGoods(biz, path, userId){
        // console.log("fetchGoods-----", biz, path);
        return new Promise((resolve, reject) => {
          if(!biz || Object.keys(biz).length == 0){
            reject(true);
          }
          const postData = {biz};
          if(userId){
            postData.client = {userId: userId}
          }
          
          fetch(`https://api.staybrowser.com/tqq/product${path}`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(postData) 
          })
          .then(response => {
            if (!response.ok) {
              reject('Network response was not ok ' + response.statusText)
              throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // 将响应转换为 JSON
          
          })
          .then(data => {
            // console.log("fetchGoods--path--",path,"---resp-------", data)
            if(data){
              resolve(data)
            }else{
              // console.log("fetchItemTaoQuanquan--fetch error-------", result);
              resolve({})
            }
          })
          .catch((error) => {
            console.error('Error:', error); // 处理错误
            reject(true);
          });
        })
      }

      function checkCSPMeta(){
        const metaTags = document.getElementsByTagName('meta');
        let cspExists = false;
        for (let i = 0; i < metaTags.length; i++) {
          if (metaTags[i].httpEquiv === "Content-Security-Policy" && 
            metaTags[i].content === "upgrade-insecure-requests") {
            cspExists = true;
            break;
          }
        }
        return cspExists;
      }
      
      function createIframeToCheckGoods(itemSecretId, index, src){
        if(!checkCSPMeta()){
          const meta = document.createElement('meta');
          meta.httpEquiv = "Content-Security-Policy";
          meta.content = "upgrade-insecure-requests";
          document.head.appendChild(meta)
        }
        let iframeDom = document.querySelector(`#Stay_${itemSecretId}`);
        console.log("createIframeToCheckGoods-----iframeDom-------", iframeDom)
        try {
          if(!iframeDom){
            const iframeDomStr = `<iframe id="Stay_${itemSecretId}" index=${index} width=320 height=540 style="display:none" src=${src}></iframe>`;
            iframeDom = TaoQQUtils.parseToDOM(iframeDomStr);
            iframeDom.onerror = function(e) {
              console.error("Failed to load iframe content.", e);
              throw new Error('failed_to_load_iframe');
            };
            document.body.appendChild(iframeDom);
            iframeDom = document.querySelector(`#Stay_${itemSecretId}`);
          }
        } catch (error) {
          console.log("createIframeToCheckGoods----error---", error, iframeDom)
          
        }
        return iframeDom;
      }

      async function hitGoodsItem(materialItemList){
        if(!materialItemList || materialItemList.length == 0){
          return null;
        }
        const results = await Promise.all(materialItemList.map(async (item, index) => {
          console.log("hitGoodsId-----itemId----", itemId)
          const goodsId = await loadIframeToGainGoodsId(item.itemId, index, item.originUrl);
          console.log("hitGoodsId----goodsId-----",goodsId)
          if(!goodsId){
            return null;
          }
          if(goodsId == itemId){
            return item;
          }
          return null;
        }));
        const firstMatch = results.find(item => item !== null);
        return firstMatch || null;
      }

      function checkGoods(materialItemList){
        if(!materialItemList || materialItemList.length == 0){
          handleTljLoadingAndRemoveQuanItem();
          return;
        }
      
        hitGoodsItem(materialItemList).then(item => {
          // console.log("hitGoodsItem----res-----", item);
          if(item){
            DETAIl_PAGE.itemSecretId = item.itemId;
            if(typeof item.tljAmount == "undefined" || !item.tljAmount || item.tljAmount == ""){
              // console.log("checkGoods----goodsId---item.tljAmount--is-not", goodsId, item.tljAmount)
              if(item.couponShareUrl){
                DETAIl_PAGE.shouldReplace = DETAIl_PAGE.couponUrl != item.couponShareUrl? true: false;
                DETAIl_PAGE.couponUrl = item.couponShareUrl;
                DETAIl_PAGE.tljAmount = "";
              }
              handleTljLoadingAndRemoveQuanItem();
              createCouponIframeIntoModal();
            }else{
              DETAIl_PAGE.tljAmount = item.tljAmount;
            }
            updateTljAmount();
          }else{
            handleTljLoadingAndRemoveQuanItem();
          }
        });
      }

      function handleGoodsIdByUrl(detailUrl){
        if(!detailUrl){
          return "";
        }
        let goodsId = TaoQQUtils.queryURLParams(detailUrl, "id");
        if(goodsId){
          return goodsId;
        }
        const redirectURL = TaoQQUtils.queryURLParams(detailUrl, "redirectURL");
        if(!redirectURL){
          return "";
        }
        const x5referer = TaoQQUtils.queryURLParams(redirectURL, "x5referer");
        if(!x5referer){
          return "";
        }
        goodsId = TaoQQUtils.queryURLParams(x5referer, "id");
        return goodsId;
      }

      function loadIframeToGainGoodsId(itemSecretId, index, originUrl){
        return new Promise((resolve, reject) => {
          try {
            const iframeDom = createIframeToCheckGoods(itemSecretId, index, originUrl);
            if(!iframeDom){
              resolve("");
              return;
            }
            iframeDom.onload = function() {
              console.log("loadIframeToGainGoodsId------iframeDom----", iframeDom)
              iframeDom.contentWindow.postMessage({action: 'checkout_goods_id', itemSecretId, index}, "*");
              const callback = e => {
                console.log("checkout_goods_id_res---addEventListener-----", e)
                if (e.data.itemSecretId !== itemSecretId || e.data.action !== 'checkout_goods_id_res') return;
                window.removeEventListener('message', callback);
                const checkoutGoodsId = handleGoodsIdByUrl(e.data.url);
                console.log("checkoutGoodsId-----", checkoutGoodsId)
                resolve(checkoutGoodsId);
              }
              window.addEventListener("message", callback);
            };
          } catch (error) {
            console.error("load iframe to gain goods id have en error", error);
            resolve("");
          }
        })
      }

      function updateTljAmount(){
        removeLoading();
        if(DETAIl_PAGE.tljAmount && Number(DETAIl_PAGE.tljAmount) > 0){
          DETAIl_PAGE.title = "领取淘补贴"
          if(quanItemsMark){
            const tljQuanDom = quanItemsMark.querySelector("#s8t9a0i8y66_tlj .s8t9a0i8y66-tlj-text");
            if(tljQuanDom){
             tljQuanDom.innerHTML = "点击领取补贴";
            }
            const tljAmountDom = quanItemsMark.querySelector("#s8t9a0i8y66_tlj_amount");
            if(tljAmountDom){
              tljAmountDom.innerHTML = DETAIl_PAGE.confirmTljAmount || DETAIl_PAGE.tljAmount;
            }
          }
          if(quanModalDom){
            const modalTitleDom = quanModalDom.querySelector(".s8t9a0i8y66-quan-modal-title");
            if(modalTitleDom){
              modalTitleDom.innerHTML = DETAIl_PAGE.title;
            }
          }
         }
      }

      function removeLoading(){
        DETAIl_PAGE.tljLoading = false;
        DETAIl_PAGE.loading = false;
        if(quanItemsMark){
          // console.log("handleTljLoadingAndRemoveQuanItem---quanItemsMark----", quanItemsMark.querySelector("#s8t9a0i8y66_tlj_confirm"))
          quanItemsMark.querySelector("#s8t9a0i8y66_tlj_confirm")&&(quanItemsMark.querySelector("#s8t9a0i8y66_tlj_confirm").remove());
        }else{
          document.querySelector("#s8t9a0i8y66_tlj_confirm")&&(document.querySelector("#s8t9a0i8y66_tlj_confirm").remove());
        }
        hiddenLoadingPannel();
      }

      function handleTljLoadingAndRemoveQuanItem(){
        removeLoading();
        if(!quanItemsMark){
          removeCarBuyDom();
          return;
        }
        const tljQuanDom = quanItemsMark.querySelector("#s8t9a0i8y66_tlj");
        const tqqDom = quanItemsMark.querySelector("#s8t9a0i8y66_tqq");
        if(!DETAIl_PAGE.couponUrl){
          removeQuanItemAction();
          removeCarBuyDom();
          if((DETAIl_PAGE.couponAmount)){
            tqqDom && (tqqDom.innerHTML = "隐藏券丢失了")
          }
          if((DETAIl_PAGE.tljAmount)){
            tljQuanDom && (tljQuanDom.innerHTML = "淘补贴已失效")
          }
          if((!DETAIl_PAGE.couponAmount || Number(DETAIl_PAGE.couponAmount) <= 0) && (!DETAIl_PAGE.tljAmount || Number(DETAIl_PAGE.tljAmount) <= 0)){
            quanItemsMark.remove();
          }
          return;
        }
        if((!DETAIl_PAGE.couponAmount || Number(DETAIl_PAGE.couponAmount) <= 0)){
          if(tqqDom){
            tqqDom.remove();
          }
        }
        // <div class='s8t9a0i8y66-detail-quan-item' id="s8t9a0i8y66_tlj"><span class="s8t9a0i8y66-tlj-text">预估补贴</span><span class="s8t9a0i8y66-yuan">￥</span><span class='s8t9a0i8y66-quan-amount' id="s8t9a0i8y66_tlj_amount">${tljAmount}</span></div>
        if((!DETAIl_PAGE.tljAmount || Number(DETAIl_PAGE.tljAmount) <= 0)){
         if(tljQuanDom){
          tljQuanDom.remove();
         }
        }

        
      }
      
      function queryGoodsByTitle(shopName, title, mall = "taobao"){
        // console.log("queryGoodsByTitle--shopName--title--------", shopName, title)
        if(!title){
          handleTljLoadingAndRemoveQuanItem();
          return
        }
        DETAIl_PAGE.loading = true;
        const timestamp = new Date().getTime()+"";
        const biz = {mall, timestamp, shopName, title}
        const param = encodeURI(title);
        // console.log("title-encode----", param);
        const sign = generateSign(param, timestamp)
        biz.sign = sign;
        fetchGoods(biz, "/queryGoodsByTitle").then(res => {
          const { server : {message} = {}, biz: { materialItemList } = {} } = res;
          // console.log("queryGoodsByTitle---res-", res)
          checkGoods(materialItemList);
        }).catch(err=>{
          // console.log("queryGoodsByTitle---err-", err)
          DETAIl_PAGE.loading=false;
          handleTljLoadingAndRemoveQuanItem();
        })
      }

      function queryTLJByItemId(shopName, itemId, price="", mall = "taobao"){
        // console.log("queryTLJByItemId--shopName--itemId--------", shopName, itemId, price)
        return new Promise((resolve, reject) => {
          if(!itemId){
            // console.log("queryTLJByItemId----itemId---is null-----", itemId)
            DETAIl_PAGE.tljLoading=false;
            reject("淘补贴失效了~")
            return
          }
          showLoadingPannel("淘补贴生成中");
          const timestamp = new Date().getTime()+"";
          const biz = {mall, timestamp, shopName, itemId, price}
          const param = encodeURI(itemId);
          const sign = generateSign(param, timestamp)
          biz.sign = sign;
          fetchGoods(biz, "/queryTljCoupon", TaoQQUtils.getUserDeviceId()).then(res => {
            resolve(res)
          }).catch(err=>{
            reject(err)
          })
        })
        
      }

      function createQuanAndAppend(){
        
        return new Promise((resolve, reject) => {
          if (document.readyState === 'complete') {
            quanItemsMark = appendQuanDom();
            // console.log("document.readyState--1----", document.readyState, quanItemsMark)
            if(quanItemsMark){
              resolve(true)
              return;
            }
          }

          document.addEventListener("readystatechange", ()=>{
            if (document.readyState === 'complete') {
              quanItemsMark = appendQuanDom();
              // console.log("document.readyState--2----", document.readyState, quanItemsMark )
              resolve(true)
            }
          });
        })
      }

      
      function startCheckQuan(){
        // console.log("startCheckQuan-----sttart-----itemId-", itemId)
        fetchItemTaoQuanquan(itemId, "", "taobao").then(res => {
          const { server : {message} = {}, biz: { coupon_amount, coupon_url, tljAmount } = {} } = res;

          if((!coupon_amount || Number(coupon_amount) <= 0) && (!tljAmount || Number(tljAmount) <= 0)){
            return;
          }
          if(Number(coupon_amount) > 0){
            quanItem = `<div class='s8t9a0i8y66-detail-quan-item' id="s8t9a0i8y66_tqq">隐藏券<span class="s8t9a0i8y66-yuan">￥</span><span class='s8t9a0i8y66-quan-amount'>${coupon_amount}</span></div>`;
            DETAIl_PAGE.couponAmount = coupon_amount;
          }
          DETAIl_PAGE.couponUrl = coupon_url;
          if(Number(tljAmount) > 0){
            quanItem =  quanItem + `<div class='s8t9a0i8y66-detail-quan-item' id="s8t9a0i8y66_tlj"><span class="s8t9a0i8y66-tlj-text">预估补贴</span><span class="s8t9a0i8y66-yuan">￥</span><span class='s8t9a0i8y66-quan-amount' id="s8t9a0i8y66_tlj_amount">${tljAmount}</span><div id="s8t9a0i8y66_tlj_confirm" class="s8t9a0i8y66-tlj-confirm">确认中${loadingHtml(0.6, 'white')}</div></div>`;
            DETAIl_PAGE.tljAmount = tljAmount;
          }
          DETAIl_PAGE.loading = true;
          createQuanAndAppend().then(()=>{
            // console.log("createQuanAndAppend---then----quanItemsMark--", quanItemsMark)
            if(quanItemsMark){
              quanItemsMark.innerHTML = quanItem;
              addActionMaskDom()
              // 确认淘补贴
              queryGoodsByTitle(getShopname(), getTitle());
            }
          }).catch(err=>{
            DETAIl_PAGE.loading = false;
            // console.log("createQuanAndAppend----error----", err)
          });
          
          
          
        }).catch(err => {
          // console.log("toCheckQuan---err-", err)
          DETAIl_PAGE.loading = false;
        })
      }

      startCheckQuan();
    }

    function handleQuanPage(){
      // console.log("handleQuanPage----------")
      document.addEventListener("readystatechange", ()=>{
        if (document.readyState === 'complete') {
          handleScrollToQuanView();
        }
      })
      window.addEventListener('message', function(event) {
        // console.log("quanframe--message---", event)
        const action = event.data.action;

        if (action === 'scrollToQuanView') {
          // console.log("quanframe--scrollToQuanView---")
          handleScrollToQuanView();
        }
      });

      function handleScrollToQuanView(){
        let couponDom = document.querySelector(".cellex-boom-mm-coupon-inventory-wrap");
        let react = {};
        if(!couponDom){
          couponDom = document.querySelector(".cell-cellx-nocoupon-other-coupons-wrap");
        }
        if(!couponDom){
          couponDom = document.querySelector(".cellx-2in1-many-coupon");
        }
        if(couponDom){
          react = couponDom.getBoundingClientRect();
        }
        // console.log("handleScrollToQuanView--react---", react)
        const screenH = 300;
        if(react && typeof react.top === 'number' && typeof react.height === 'number'){
          let scrollTop = 0;
          if(react.height >= screenH){
            scrollTop = Math.floor(react.top);
          }else{
            scrollTop = Math.floor(react.top) - (screenH - Math.ceil(react.height))/2;
          }
          // console.log("handleScrollToQuanView--scrollTop---", scrollTop);
          window.scrollBy(0, scrollTop);
          react = couponDom.getBoundingClientRect();
        }
        // console.log("handleScrollToQuanView--after--react---", react)
        window.top.postMessage({action: 'iframeLoaded', react}, "*");
      }

    }

  })({pageType: TaoQQUtils.checkPage(), switchOff})

})();