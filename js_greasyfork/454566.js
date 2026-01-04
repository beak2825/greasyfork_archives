// ==UserScript==
// @name         Select Translation(选择文字翻译)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @license      MIT
// @description  choose text and translate
// @author       yu
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @resource css http://at.alicdn.com/t/c/font_3753571_e8ofducbfmu.css

// @downloadURL https://update.greasyfork.org/scripts/454566/Select%20Translation%28%E9%80%89%E6%8B%A9%E6%96%87%E5%AD%97%E7%BF%BB%E8%AF%91%29.user.js
// @updateURL https://update.greasyfork.org/scripts/454566/Select%20Translation%28%E9%80%89%E6%8B%A9%E6%96%87%E5%AD%97%E7%BF%BB%E8%AF%91%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  GM_addStyle("@font-face{font-family: 'iconfont';src: url('data:font/ttf;charset=utf-8;base64,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') format('truetype');font-weight: normal;font-style: normal;font-display: swap;}");
  //翻译信息
  var from = "auto";
  var to = "zh";
  let salt = "1435660288742342";
  let locat = 10;
  //菜单
  let id1 = GM_registerMenuCommand("设置appid", function () {
    var newAppid = prompt("请输入appid", "");
    if (newAppid != "") {
      //  appid = newAppid;
      GM_setValue("appid", newAppid);
    }
  });
  let id2 = GM_registerMenuCommand("设置secret", function () {
    var newSecret = prompt("请输入secret", "");
    if (newSecret != "") {
      //  secret = newSecret;
      GM_setValue("secret", newSecret);
    }
  });
  GM_registerMenuCommand("设置源语言", function () {
    from = prompt("请输入from", "");
  });
  GM_registerMenuCommand("设置目标语言", function () {
    to = prompt("请输入to", "");
  });
  //引入图标css
  GM_addStyle(GM_getResourceText("css"));
  //翻译框
  let show = document.createElement("div");
  show.style.cssText =
    "position:absolute;background-color:black;color: white;display:none;padding:10px;font-size: 10px;z-index: 10;max-width : 500px; word-wrap:break-word; border-radius: 20px;border-top-left-radius: 0;";
  show.className = "showplace";
  show.id = "show";
  document.body.appendChild(show);
  //翻译按钮
  let button = document.createElement("i");
  button.className = "iconfont icon-weibiaoti556";
  button.style.cssText =
    "position:absolute;font-size: 30px;display:none;cursor: pointer;z-index: 10;";
  document.body.appendChild(button);
  //选中文字
  let text = "";
  let x;
  let y;
  let flag = 0;
  //选中事件
  document.addEventListener("mouseup", function (e) {
    x = e.pageX;
    y = e.pageY + locat;
    let sel = window.getSelection().toString();
    if (sel != "" && sel.charCodeAt() != 10) {
      text = sel.replaceAll("\n","");
      button.style.display = "block";
      button.style.top = y + "px";
      button.style.left = x + "px";
    }
  });
  //消失
  document.addEventListener("mousedown", function (e) {
    show.style.display = "none";
    if (flag != 1 && button.style.display != "none") {
      button.style.display = "none";
    }
  });
  button.addEventListener("mouseover", function (e) {
    flag = 1;
  });
  button.addEventListener("mouseout", function (e) {
    flag = 0;
  });
  //翻译按钮按下事件
  button.addEventListener("click", function (e) {
    button.style.display = "none";
    show.style.top = y - locat + "px";
    show.style.left = x + "px";
    translate();
  });

  //翻译调用
  function translate() {
    let appid = GM_getValue("appid");
    let secret = GM_getValue("secret");
    let str = appid + text + salt + secret;
    let sign = MD5(str);

    let url =
      "http://api.fanyi.baidu.com/api/trans/vip/translate?q=" +
      text +
      "&appid=" +
      appid +
      "&salt="+salt+"&from="+from+"&to="+to+
      "&sign=" +
      sign;
    GM_xmlhttpRequest({
      url: url,
      type: "get",
      dataType: "jsonp",
      onload: function (data) {
        let resText = JSON.parse(data.responseText);
        if (resText.error_code == null) {
          let res = resText.trans_result[0].dst;
          show.innerText = res;
          show.style.display = "block";
          let h = show.clientHeight;
        } else {
          show.innerText = "无法翻译选中的文字，请重新选择";
          show.style.display = "block";
          let h = show.clientHeight;
        }
      },
    });
  }

  //MD%
  var MD5 = function (string) {
    function RotateLeft(lValue, iShiftBits) {
      return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

    function AddUnsigned(lX, lY) {
      var lX4, lY4, lX8, lY8, lResult;
      lX8 = lX & 0x80000000;
      lY8 = lY & 0x80000000;
      lX4 = lX & 0x40000000;
      lY4 = lY & 0x40000000;
      lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
      if (lX4 & lY4) {
        return lResult ^ 0x80000000 ^ lX8 ^ lY8;
      }
      if (lX4 | lY4) {
        if (lResult & 0x40000000) {
          return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
        } else {
          return lResult ^ 0x40000000 ^ lX8 ^ lY8;
        }
      } else {
        return lResult ^ lX8 ^ lY8;
      }
    }

    function F(x, y, z) {
      return (x & y) | (~x & z);
    }
    function G(x, y, z) {
      return (x & z) | (y & ~z);
    }
    function H(x, y, z) {
      return x ^ y ^ z;
    }
    function I(x, y, z) {
      return y ^ (x | ~z);
    }

    function FF(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }

    function GG(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }

    function HH(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }

    function II(a, b, c, d, x, s, ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }

    function ConvertToWordArray(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWords_temp1 = lMessageLength + 8;
      var lNumberOfWords_temp2 =
        (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
      var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
      var lWordArray = Array(lNumberOfWords - 1);
      var lBytePosition = 0;
      var lByteCount = 0;
      while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] =
          lWordArray[lWordCount] |
          (string.charCodeAt(lByteCount) << lBytePosition);
        lByteCount++;
      }
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
      lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
      lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
      return lWordArray;
    }

    function WordToHex(lValue) {
      var WordToHexValue = "",
        WordToHexValue_temp = "",
        lByte,
        lCount;
      for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue =
          WordToHexValue +
          WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
      }
      return WordToHexValue;
    }

    function Utf8Encode(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }

      return utftext;
    }

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7,
      S12 = 12,
      S13 = 17,
      S14 = 22;
    var S21 = 5,
      S22 = 9,
      S23 = 14,
      S24 = 20;
    var S31 = 4,
      S32 = 11,
      S33 = 16,
      S34 = 23;
    var S41 = 6,
      S42 = 10,
      S43 = 15,
      S44 = 21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301;
    b = 0xefcdab89;
    c = 0x98badcfe;
    d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
      AA = a;
      BB = b;
      CC = c;
      DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
      d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
      c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
      b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
      a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
      d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
      c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
      b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
      d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
      c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
      b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
      d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
      c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
      b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
      a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
      d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
      c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
      b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
      a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
      d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
      b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
      d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
      c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
      b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
      a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
      d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
      c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
      b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
      a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
      d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
      c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
      b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
      a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
      d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
      c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
      b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
      a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
      d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
      c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
      b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
      a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
      d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
      c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
      b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
      a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
      d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
      c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
      b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
      d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
      c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
      b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
      d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
      c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
      b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
      a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
      d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
      c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
      b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
      a = AddUnsigned(a, AA);
      b = AddUnsigned(b, BB);
      c = AddUnsigned(c, CC);
      d = AddUnsigned(d, DD);
    }

    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

    return temp.toLowerCase();
  };
  // Your code here...
})();
