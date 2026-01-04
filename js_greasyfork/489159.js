// ==UserScript==
// @name         jd_get_skuids
// @namespace    https://github.com/techstay/myscripts
// @version      20241211
// @description  京东直播选品工具
// @author       hebeiwei
// @match        https://search.jd.com/*
// @match        https://list.jd.com/*
// @connect api.jd.com
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant unsafeWindow
// @grant GM_setClipboard
// @grant window.close
// @grant window.focus
// @grant GM_openInTab
// @grant GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489159/jd_get_skuids.user.js
// @updateURL https://update.greasyfork.org/scripts/489159/jd_get_skuids.meta.js
// ==/UserScript==

(function() {
    'use strict';

var textarea1= document.createElement("textarea");
textarea1.setAttribute('id', 'textarea1');
textarea1.setAttribute('rows', '0');
textarea1.setAttribute('cols', '0');
//textarea1.setAttribute('style', 'margin:0px 0px 0px -200px;');
textarea1.setAttribute('style', 'position:fixed;top:0px; left: 0px; width: 300px;height:100%;');
  //document.getElementsByTagName('body')[0].appendChild(textarea1);
document.body.appendChild(textarea1);


var divjs = document.createElement("div");
divjs.setAttribute('class' ,'w');
divjs.setAttribute('style' ,'background-color:rgba(0,0,0,0.8);position:fixed;bottom:0px;width:100%;height:30px;z-index:999999');
divjs.innerHTML = "<div class='m bottom-ad' style='width:1390px;' align='center'>\n" +
    "<input id='setyj'  type='text' style='margin:5px 0px 0px 200px;width:50px' value='3' ><font color='#f0f8ff'>设置佣金</font></input>\n" +
    "<input id='myhandle' type='button' style='margin:5px 0px 0px 200px;' value='开始' />\n" +
    "<input id='myhandle1' type='button' style='margin:5px 0px 0px 200px;' value='隐藏' />\n" +
    "<input id='myhandle2' type='button' style='margin-left: 100px;' value='复制'  />\n" +
    "<input id='myhandle3' type='button' style='margin-left: 100px;'  value='清空'  />\n" +
    "<input id='myhandle5' type='button' style='margin-left: 100px;'  value='直接获取' />\n" +
    "<div id='showInfo' style='right:0px;top:-145px;width:300px;heigth:30px;background:#a9dbf6;border:0px solid #a3bbce;position:absolute;' ></div>\n" +
    " </div>";
document.getElementsByTagName('body')[0].appendChild(divjs);

myhandle.onclick=function(){
    const currentScroll = document.documentElement.scrollTop || document.body.scrollTop; // 已经被卷掉的高度
    const clientHeight = document.documentElement.clientHeight; // 浏览器高度
    const scrollHeight = document.documentElement.scrollHeight; // 总高度
    if (scrollHeight > currentScroll + clientHeight) {
        window.scrollTo(0,scrollHeight/2);
        setTimeout(function(){
        	window.scrollTo(0,scrollHeight);
        },3000);
    }
    else {
        alert("请把滚动条拉到上面");
    }
};
myhandle1.onclick=function (){
    if(this.value.search("隐藏")!=-1){
        this.value='打开';
        textarea1.select();
        textarea1.setAttribute('style', 'display :none;');
    }
    else{
        this.value='隐藏';
        textarea1.select();
        textarea1.setAttribute('style', 'position:fixed;top:0px; left: 0px; width: 300px;height:100%;display;block;');
    }

 };

myhandle2.onclick=function (){
            textarea1.select();
            document.execCommand("copy");
            let num=0;
            num=(textarea1.value.split('\n')).length-1;
            console.log("获取了佣金大于",setyj.value,"RMB共",num,"条数据");
            alert("复制成功"+num+"条数据");
 };

myhandle3.onclick=function (){
    textarea1.value='';
    document.execCommand("Delete");
    if(window.clipboardData){
            //清空操作系统粘贴板
        window.clipboardData.clearData();
    }
    alert("清空成功");
};


myhandle5.onclick = function (){
    const setyj = document.getElementById('setyj');
    const liss = document.querySelectorAll('#J_goodsList > ul > li');
    for (let i = 0; i < liss.length; i++){
        const abc=liss[i].querySelector('div.good_inf_com');
        if(abc){
            const lisss=liss[i].querySelector('div.good_inf_com > div.inf_show > p:nth-child(1) > span:nth-child(2) > sapn');
            if(lisss){
                const yj=lisss.innerText.replace('￥','');
                if(Number(yj)>Number(setyj.value)){
                    console.log(yj);
                    const skuids = liss[i].getAttribute('data-sku');
                    if(textarea1.value.search(skuids)==-1&&skuids!=null){
                        textarea1.value += 'https://item.jd.com/'+skuids + '.html\n';
                    }

                }

            };
        }

    }
    let num = 0;
    num=(textarea1.value.split('\n')).length-1;
    console.log(textarea1.value);
    console.log('直接获取了',num,'条数据');
    alert('直接获取了'+num+'条数据');
       
};

function getskuids(){
    let liss= document.querySelectorAll('#J_goodsList > ul > li');
    let skuids='';
    for (let i = 0; i < liss.length; i++){
        let skuid = liss[i].getAttribute('data-sku');
        if(skuid!=null){
            skuids += skuid + ',';
        }
    };
    return skuids
};


function gettimestamp(){
    let d = new Date();
    let n = d.toISOString();
    let h= n.substring(11,13);
    let hh= Number(h)+8;
    let data=n.replace("T"+h," "+hh);
    data=data.replace("Z","");
    return data;
}

const setyj = document.getElementById('setyj');
setyj.onchange = function() {
	textarea1.value="";
	if (isNaN(setyj.value) || setyj.value.replace(/(^\s*)|(\s*$)/g, "") == "") {
		alert("不是数字");
		this.value='3';
	}
}

    const text36 = document.getElementById('myhandle6');
//showInfo.style.top = showInfo.top;
/**当鼠标移动到元素上时，将信息框呈现出来******/
text36.onmousemove = function onMouseMove() {
    var showInfo = document.getElementById('showInfo');
    showInfo.style.display="block";
    showInfo.style.color='#000000';
    //showInfo.style.textAlign='left';
    showInfo.innerText="先按F12，打开“开发人员工具”界面，\n" +
        "点“按制台”,查看输出效果,把滚动条拉到最底部\n" +
        "1.如果不需要判断佣金\n" +
        "先点“直接获取”，再“复制”,再“清空”\n" +
        "2.如果需要判断佣金\n" +
        "先点“开始”，设置好佣金后，\n" +
        "如果再点“获取”\n"+
        "再点击“复制,再“清空”,”\n";
};
/**当鼠标离开元素上时，将信息框隐藏起来*****/
text36.onmouseout = function onMouseOut() {
    const showInfo = document.getElementById('showInfo');
    showInfo.style.display="none";
};


function safeAdd(x, y) {
     const lsw = (x & 0xffff) + (y & 0xffff);
     const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
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
   * Calculates the HMAC-MD5 of a key and some data (raw strings)
   *
   * @param {string} key HMAC key
   * @param {string} data Raw input string
   * @returns {string} Raw MD5 string
   */
  function rstrHMACMD5(key, data) {
    var i
    var bkey = rstr2binl(key)
    var ipad = []
    var opad = []
    var hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5c5c5c5c
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
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
   * Encodes input string as Hex encoded string
   *
   * @param {string} s Input string
   * @returns {string} Hex encoded string
   */
  function hexMD5(s) {
    return rstr2hex(rawMD5(s))
  }
  /**
   * Calculates the raw HMAC-MD5 for the given key and data
   *
   * @param {string} k HMAC key
   * @param {string} d Input string
   * @returns {string} Raw MD5 string
   */
  function rawHMACMD5(k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
  }
  /**
   * Calculates the Hex encoded HMAC-MD5 for the given key and data
   *
   * @param {string} k HMAC key
   * @param {string} d Input string
   * @returns {string} Raw MD5 string
   */
  function hexHMACMD5(k, d) {
    return rstr2hex(rawHMACMD5(k, d))
  }

  /**
   * Calculates MD5 value for a given string.
   * If a key is provided, calculates the HMAC-MD5 value.
   * Returns a Hex encoded string unless the raw argument is given.
   *
   * @param {string} string Input string
   * @param {string} [key] HMAC key
   * @param {boolean} [raw] Raw output switch
   * @returns {string} MD5 output
   */
  function md5(string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string)
      }
      return rawMD5(string)
    }
    if (!raw) {
      return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)
  }


})();