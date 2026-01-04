// ==UserScript==
// @name         cc caption automatic translator
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  automatic translate the cc caption to current language of browser by using the translate feature of browser.
// @author       You
// @match        *://*/*
// @grant       GM.xmlHttpRequest
// @grant       GM_xmlhttpRequest
// @connect     fanyi-api.baidu.com
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/465174/cc%20caption%20automatic%20translator.user.js
// @updateURL https://update.greasyfork.org/scripts/465174/cc%20caption%20automatic%20translator.meta.js
// ==/UserScript==

(function () {
  'use strict';
  
  // Your appid and secret key from baidu fanyi api
  const appid = 'your api id here';
  const secret = 'your api key here';
  // The target language code (see https://api.fanyi.baidu.com/doc/21 for supported languages)
  const toLang = 'zh';
  // The source language code (optional, can be auto-detected by baidu fanyi api)
  const from = 'en';
  var initialOptions = {
    initialed:false,
    buttonAdded:false
  }
  let httpRequest;
  if (typeof GM < "u" && GM.xmlHttpRequest)
    httpRequest = GM.xmlHttpRequest;
  else if (typeof GM < "u" && GM_xmlhttpRequest)
    httpRequest = GM_xmlhttpRequest;
  else if (typeof GM_xmlhttpRequest < "u")
    httpRequest = GM_xmlhttpRequest;
  else if (typeof GM < "u" && GM.xmlHttpRequest)
    httpRequest = GM.xmlHttpRequest;
  else {
    console.error(
      "GM_xmlhttpRequest or GM.xmlHttpRequest not found, do not use it"
    );
    return;
  }
  // The url for baidu fanyi api
  const tempurl = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
  // The salt value for generating the sign (a random number)
  const salt = Date.now()
  // The sign value for authentication (a md5 hash of appid + query + salt + secret)
  // The data object for the request

  function baiduFanyiTranslate(query, cb) {
    const signStr = `${appid}${query}${salt}${secret}`
    const sign = md5(signStr);
    const url = `${tempurl}?q=${query}&from=${from}&to=${toLang}&appid=${appid}&salt=${salt}&sign=${sign}`;
    // The callback function for handling the response
    function callback(response) {
      if (response.status == 200) {
        // Parse the response text as JSON
        const result = JSON.parse(response.responseText);

        // Check if there is an error code
        if (result.error_code) {
          // Log the error message
          console.error(result.error_msg);
        } else {
          // Get the translated string from the result
          const translation = result.trans_result[0].dst;

          // Do something with the translation, e.g. show it in an alert box
          cb(translation)
        }
      } else {
        // Log the status code
        console.error(response.status);
      }
    }
    const encodedUrl = encodeURI(url)
    // Send the request using GM_xmlHttpRequest function
    httpRequest({
      method: 'get',
      url: encodedUrl,
      onload: callback
    });

  }

  // 节流函数
  function throttle(func, delay) {
    var prev = Date.now();
    return function () {
      var context = this;
      var now = Date.now();
      if (now - prev >= delay) {
        func.apply(context);
        prev = Date.now();
      }
    }
  }

  function initViewElement() {
    let div = document.createElement('div');
    div.id = 'currentSub';
    //////////// styles
    div.style.textAlign = 'center';
    div.style.padding = "5px"
    div.style.backgroundColor = '#333333';
    div.style.color = 'white';
    div.style.fontFamily = '"Source Sans Pro", Arial, sans-serif';
    div.style.letterSpacing = '-0.1px';
    div.style.marginTop = '16px';
    div.style.position = 'absolute'
    div.style.left = '20px'
    div.style.right = '20px'
    div.style.bottom = '30%'
    div.style.opacity = '0.8'
    div.style.fontSize = '21px'
    div.style.zIndex = 99
    try {
      let video = document.getElementsByTagName('video')[0]
      video.parentElement.appendChild(div)
      video.parentElement.style.position = 'relative'
    } catch (error) {
      console.error(error)
    }
    initialOptions.initialed = true
    renderCurrentSubs()
  }

   function renderCurrentSubs() {
    let video = document.getElementsByTagName('video')[0]
    let currentSub = document.getElementById('currentSub')
    video.addEventListener('timeupdate', throttle(e => {
      const track = [...video.textTracks]
        .find(track => track.mode === "showing");
      const texts = [...track.activeCues].map(cue => cue.text);
      let newVal = texts.join('\n');
      let currentVal = document.getElementById('currentSub').dataset.sourceStr;
      if ( !currentVal ||  newVal !== currentVal) {
           currentSub.dataset.sourceStr = newVal
        baiduFanyiTranslate(newVal.replace(/\n/g, ' '), (translation) => {
          currentSub.innerHTML = translation;
        })
      }
    }, 300));
  }
  var buttonAdded = false
  window.addEventListener("load", (event) => {
    //add generator button

    if(initialOptions.buttonAdded) return;

    // Create a new button element
    var button = document.createElement("button");
    button.innerHTML = "开始翻译";
    button.style.position = "fixed";
    button.id="baidufanyi"
    button.style.bottom = "100px";
    button.style.right = "10px";
    button.style.zIndex = 999
    button.style.position = 'fixed'
    button.addEventListener("click", function () {
      document.getElementById('baidufanyi').remove()
      if (!initialOptions.initialed) {
        initViewElement()
      }
    });

    // Add the button to the page
    document.body.appendChild(button);
    //To exclude the "load" event triggered by the iframe
    initialOptions.buttonAdded = true

  });

  function md5(e) {
    function h(a, b) {
      var c, d, e, f, g;
      e = a & 2147483648;
      f = b & 2147483648;
      c = a & 1073741824;
      d = b & 1073741824;
      g = (a & 1073741823) + (b & 1073741823);
      return c & d ? g ^ 2147483648 ^ e ^ f : c | d ? g & 1073741824 ? g ^ 3221225472 ^ e ^ f : g ^ 1073741824 ^ e ^ f : g ^ e ^ f
    }

    function k(a, b, c, d, e, f, g) {
      a = h(a, h(h(b & c | ~b & d, e), g));
      return h(a << f | a >>> 32 - f, b)
    }

    function l(a, b, c, d, e, f, g) {
      a = h(a, h(h(b & d | c & ~d, e), g));
      return h(a << f | a >>> 32 - f, b)
    }

    function m(a, b, d, c, e, f, g) {
      a = h(a, h(h(b ^ d ^ c, e), g));
      return h(a << f | a >>> 32 - f, b)
    }

    function n(a, b, d, c, e, f, g) {
      a = h(a, h(h(d ^ (b | ~c), e), g));
      return h(a << f | a >>> 32 - f, b)
    }

    function p(a) {
      var b = "",
        d = "",
        c;
      for (c = 0; 3 >= c; c++) d = a >>> 8 * c & 255, d = "0" + d.toString(16), b += d.substr(d.length - 2, 2);
      return b
    }
    var f = [],
      q, r, s, t, a, b, c, d;
    e = function (a) {
      a = a.replace(/\r\n/g, "\n");
      for (var b = "", d = 0; d < a.length; d++) {
        var c = a.charCodeAt(d);
        128 > c ? b += String.fromCharCode(c) : (127 < c && 2048 > c ? b += String.fromCharCode(c >> 6 | 192) : (b += String.fromCharCode(c >> 12 | 224), b += String.fromCharCode(c >> 6 & 63 | 128)), b += String.fromCharCode(c & 63 | 128))
      }
      return b
    }(e);
    f = function (b) {
      var a, c = b.length;
      a = c + 8;
      for (var d = 16 * ((a - a % 64) / 64 + 1), e = Array(d - 1), f = 0, g = 0; g < c;) a = (g - g % 4) / 4, f = g % 4 * 8, e[a] |= b.charCodeAt(g) << f, g++;
      a = (g - g % 4) / 4;
      e[a] |= 128 << g % 4 * 8;
      e[d - 2] = c << 3;
      e[d - 1] = c >>> 29;
      return e
    }(e);
    a = 1732584193;
    b = 4023233417;
    c = 2562383102;
    d = 271733878;
    for (e = 0; e < f.length; e += 16) q = a, r = b, s = c, t = d, a = k(a, b, c, d, f[e + 0], 7, 3614090360), d = k(d, a, b, c, f[e + 1], 12, 3905402710), c = k(c, d, a, b, f[e + 2], 17, 606105819), b = k(b, c, d, a, f[e + 3], 22, 3250441966), a = k(a, b, c, d, f[e + 4], 7, 4118548399), d = k(d, a, b, c, f[e + 5], 12, 1200080426), c = k(c, d, a, b, f[e + 6], 17, 2821735955), b = k(b, c, d, a, f[e + 7], 22, 4249261313), a = k(a, b, c, d, f[e + 8], 7, 1770035416), d = k(d, a, b, c, f[e + 9], 12, 2336552879), c = k(c, d, a, b, f[e + 10], 17, 4294925233), b = k(b, c, d, a, f[e + 11], 22, 2304563134), a = k(a, b, c, d, f[e + 12], 7, 1804603682), d = k(d, a, b, c, f[e + 13], 12, 4254626195), c = k(c, d, a, b, f[e + 14], 17, 2792965006), b = k(b, c, d, a, f[e + 15], 22, 1236535329), a = l(a, b, c, d, f[e + 1], 5, 4129170786), d = l(d, a, b, c, f[e + 6], 9, 3225465664), c = l(c, d, a, b, f[e + 11], 14, 643717713), b = l(b, c, d, a, f[e + 0], 20, 3921069994), a = l(a, b, c, d, f[e + 5], 5, 3593408605), d = l(d, a, b, c, f[e + 10], 9, 38016083), c = l(c, d, a, b, f[e + 15], 14, 3634488961), b = l(b, c, d, a, f[e + 4], 20, 3889429448), a = l(a, b, c, d, f[e + 9], 5, 568446438), d = l(d, a, b, c, f[e + 14], 9, 3275163606), c = l(c, d, a, b, f[e + 3], 14, 4107603335), b = l(b, c, d, a, f[e + 8], 20, 1163531501), a = l(a, b, c, d, f[e + 13], 5, 2850285829), d = l(d, a, b, c, f[e + 2], 9, 4243563512), c = l(c, d, a, b, f[e + 7], 14, 1735328473), b = l(b, c, d, a, f[e + 12], 20, 2368359562), a = m(a, b, c, d, f[e + 5], 4, 4294588738), d = m(d, a, b, c, f[e + 8], 11, 2272392833), c = m(c, d, a, b, f[e + 11], 16, 1839030562), b = m(b, c, d, a, f[e + 14], 23, 4259657740), a = m(a, b, c, d, f[e + 1], 4, 2763975236), d = m(d, a, b, c, f[e + 4], 11, 1272893353), c = m(c, d, a, b, f[e + 7], 16, 4139469664), b = m(b, c, d, a, f[e + 10], 23, 3200236656), a = m(a, b, c, d, f[e + 13], 4, 681279174), d = m(d, a, b, c, f[e + 0], 11, 3936430074), c = m(c, d, a, b, f[e + 3], 16, 3572445317), b = m(b, c, d, a, f[e + 6], 23, 76029189), a = m(a, b, c, d, f[e + 9], 4, 3654602809), d = m(d, a, b, c, f[e + 12], 11, 3873151461), c = m(c, d, a, b, f[e + 15], 16, 530742520), b = m(b, c, d, a, f[e + 2], 23, 3299628645), a = n(a, b, c, d, f[e + 0], 6, 4096336452), d = n(d, a, b, c, f[e + 7], 10, 1126891415), c = n(c, d, a, b, f[e + 14], 15, 2878612391), b = n(b, c, d, a, f[e + 5], 21, 4237533241), a = n(a, b, c, d, f[e + 12], 6, 1700485571), d = n(d, a, b, c, f[e + 3], 10, 2399980690), c = n(c, d, a, b, f[e + 10], 15, 4293915773), b = n(b, c, d, a, f[e + 1], 21, 2240044497), a = n(a, b, c, d, f[e + 8], 6, 1873313359), d = n(d, a, b, c, f[e + 15], 10, 4264355552), c = n(c, d, a, b, f[e + 6], 15, 2734768916), b = n(b, c, d, a, f[e + 13], 21, 1309151649), a = n(a, b, c, d, f[e + 4], 6, 4149444226), d = n(d, a, b, c, f[e + 11], 10, 3174756917), c = n(c, d, a, b, f[e + 2], 15, 718787259), b = n(b, c, d, a, f[e + 9], 21, 3951481745), a = h(a, q), b = h(b, r), c = h(c, s), d = h(d, t);
    return (p(a) + p(b) + p(c) + p(d)).toLowerCase()
  };
})();
