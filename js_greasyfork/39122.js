// ==UserScript==
// @name           漫畫閱讀器
// @version        2.2.3
// @namespace      486FF937-D190-42D3-B107-6ED190443E1C
// @description    漫畫自動連續載入
// @include        /https?:\/\/e[x-]hentai\.org\/s\/\w+\/\w+/
// @include        /https?:\/\/www\.dm5\.com\/m\d+/
// @include        /https?:\/\/www\.1kkk\.com\/ch\d+-\d+/
// @include        /https?:\/\/comicbus\.\w+\/online\/[\w-]+\.html\?ch=\d+/
// @match          *://*.manhuagui.com/comic/*/*.html*
// @match          *://www.cartoonmad.cc/comic/*.html*
// @match          *://www.gufengmh8.com/manhua/*/*.html*
// @match          *://www.manhuabei.com/manhua/*/*.html*
// @match          *://www.manhuafen.com/comic/*/*.html*
// @match          *://www.36mh.com/manhua/*/*.html*
// @match          *://www.90mh.com/manhua/*/*.html*
// @run-at         document-end
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/39122/%E6%BC%AB%E7%95%AB%E9%96%B1%E8%AE%80%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/39122/%E6%BC%AB%E7%95%AB%E9%96%B1%E8%AE%80%E5%99%A8.meta.js
// ==/UserScript==


Element.prototype.offset = function(){
  let rect = this.getBoundingClientRect();
  
  return {
    top: Math.round(scrollY + rect.top),
    bottom: Math.round(scrollY + rect.top + rect.height)
  }
}

Element.prototype.goTo = function(n){
  viewport.scrollTop = this.offset().top + (n||0);
}

function clone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function log(s){
  if(isLog){
    console.log(s.toString());
  }
}

function getEl(s, d){
  return (d || document).querySelector(s);
}

function img_loaded(){
  this.removeAttribute('style');
  
  //橫圖
  if (this.naturalWidth > this.naturalHeight) {
    this.originalWidth = this.naturalWidth
    if(this.naturalWidth > max_h_width){
      this.style.width = max_h_width + 'px'
      this.originalWidth = max_h_width
    }else if(this.naturalWidth < min_h_width){
      this.style.width = min_h_width + 'px'
      this.originalWidth = min_h_width
    }
  //直圖 or 正方形
  } else {
    this.originalHeight = this.naturalHeight
    if (this.naturalHeight < min_v_height) {
      this.style.height = min_v_height + 'px'
      this.originalHeight = min_v_height
    } else if (this.naturalHeight > max_v_height) {
      this.style.height = max_v_height + 'px'
      this.originalHeight = max_v_height
    }
  }

  this.onclick = click_RWD;
}

function img_error(e) {
  let link = new URL(this.src)
  let count = parseInt(link.searchParams.get('try'), 10) || 0
  if (count < 2) {
    link.searchParams.set('try', count + 1)
    this.src = link.href
  } else {
    console.log('error', this.src)
  }
}

function click_RWD() {
  if (this.height === this.originalHeight || this.width === this.originalWidth) {
    let gap = 10 / devicePixelRatio
    this.style.height = (innerHeight - gap) + 'px'
    this.style.width = null
    this.goTo(-gap / 2);
  } else if (this.originalHeight !== undefined) {
    this.style.height = this.originalHeight + 'px'
    this.style.width = null
  } else {
    this.style.width = this.originalWidth + 'px'
    this.style.height = null
  }
}

function Img(n){
  let pic = new Image();
  pic.style.border = '3px dashed #FF0000';
  pic.style.maxWidth = max_h_width + 'px';
  pic.style.maxHeight = max_v_height + 'px';
  pic.onload = img_loaded;
  pic.onerror = img_error;

  (function(){
    if (picUrls[n - 1]) {
      pic.src = picUrls[n - 1];
    } else {
      setTimeout(arguments.callee, 500);
    }
  })();
  
  return pic;
}

function bookmark(n){
  let d = document.createElement('div');
  d.setAttribute('style', 'height: 22px; background: #E6E6E6; margin: 30px 0px; font: bold 18px Arial; color: black;');
  d.innerHTML = '第 ' + n + ' 頁';
  
  return d;
}

function preload(count){
  let index = pics.length;
  let end = index + (count||preCount);
  if(end > picCount) end = picCount;
  
  while(index<end){
    log('preload page: ' + (index+1));
    pics[index] = Img(index+1);
    index++;
  }
}

function showPics(count){
  let end = pageNum + (count||preCount) - 1;
  if(end > picCount) end = picCount;
  
  while(pageNum<=end){
    log('show pic: ' + pageNum);
    picArea.appendChild(pics[pageNum - 1]);
    picArea.appendChild(bookmark(pageNum));
    pageNum++;
  }
}

function dm5(){
  pageNum = parseInt(getEl('#chapterpager>.current').textContent, 10);
  picCount = document.head.innerHTML.match(/DM5_IMAGE_COUNT *= *"?(.+?)"?;/)[1];
  picArea = getEl('#showimage');
  picUrls = new Array(pageNum-1);
  pics = new Array(pageNum-1);
  
  let getPicUrls_error = 0;
  let DM5_CID = document.head.innerHTML.match(/DM5_CID *= *"?(.+?)"?;/)[1];
  let DM5_MID = document.head.innerHTML.match(/DM5_MID *= *"?(.+?)"?;/)[1];
  let DM5_VIEWSIGN_DT = document.head.innerHTML.match(/DM5_VIEWSIGN_DT *= *"?(.+?)"?;/)[1];
  let DM5_VIEWSIGN = document.head.innerHTML.match(/DM5_VIEWSIGN *= *"?(.+?)"?;/)[1];
  
  (function getPicUrls(){
    let xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    
    xhr.open('GET', 'chapterfun.ashx?' +
      'cid=' + DM5_CID +
      '&page=' + (picUrls.length+1) +
      '&_cid=' + DM5_CID +
      '&_mid=' + DM5_MID +
      '&_dt=' + DM5_VIEWSIGN_DT +
      '&_sign=' + DM5_VIEWSIGN
    );
    
    xhr.onload = function(){
      picUrls = picUrls.concat(eval(xhr.responseText));
      log('getPicUrls onload: ' + picUrls.slice(-1));
      if(picUrls.length < picCount){
      // 間隔3秒一次請求，可以一次拿到最大數量20張，小於3秒一次2張，大於3秒最多還是一次20張
        setTimeout(function(){
          getPicUrls();
        },(picUrls.length < 8) ? 0 : 3000);
      }
    };
    
    xhr.onerror = function(){
      if(++getPicUrls_error < 3){
        setTimeout(function(){
          getPicUrls();
        }, 1000);
      }else{
        alert('getPicUrls error');
      }
    };
    
    xhr.send();
  })();
  
  getEl('.rightToolBar').remove();
}

function manhuaren(){
  pageNum = parseInt(getEl('#chapterpager>.current').textContent, 10);
  picCount = document.head.innerHTML.match(/DM5_IMAGE_COUNT *= *"?(.+?)"?;/)[1];
  picArea = getEl('#showimage');
  picUrls = new Array(pageNum-1);
  pics = new Array(pageNum-1);
  console.log('https://www.manhuaren.com' + location.pathname)
  
  GM_xmlhttpRequest({
    'method': 'GET',
    'url': 'https://www.manhuaren.com' + location.pathname,
    'timeout': 10000,
    'onload': function(res){
      let doc = new DOMParser().parseFromString(res.responseText, 'text/html');

      eval(doc.scripts[10].innerHTML);
      picUrls = newImgs;
    },
    'onerror': function(res){
      alert('getPicUrls error');
    }
  });
  
  getEl('.rightToolBar').remove();
}

function eh(){
  pageNum = parseInt(getEl('.sn span:nth-of-type(1)').textContent, 10);
  picCount = parseInt(getEl('.sn span:nth-of-type(2)').textContent, 10);
  picArea = getEl('#i3');
  picUrls = new Array(pageNum-1);
  pics = new Array(pageNum-1);
  preCount = 2;
  overRange = 1000;
  
  getEl('#i1').removeAttribute('style');
  picUrls.push(getEl('#img').src);
  
  let getPicUrls_error = 0;
  (function getPicUrls(url){
    if(picUrls.length-pics.length<preCount){
      let xhr = new XMLHttpRequest();
      xhr.timeout = 10000;
      
      xhr.onload = function(){
        let doc = new DOMParser().parseFromString(xhr.responseText, 'text/html');
        picUrls.push(getEl('#img', doc).src);
        log('getPicUrls onload: ' + picUrls.length);
        
        if(picUrls.length<picCount){
          setTimeout(function(){
            getPicUrls(getEl('#i3 > a', doc).href);
          }, 0);
        }
      };
      
      xhr.onerror = function(){
        if(++getPicUrls_error<3){
          setTimeout(function(){
            getPicUrls(url);
          }, 1000);
        }else{
          alert('getPicUrls error');
        }
      };
      
      xhr.open('GET', url);
      xhr.send();
    }else{
      log('getPicUrls wait...');
      setTimeout(function(){
        getPicUrls(url);
      }, 500);
    }
  })(getEl('#i3 > a').href);
}

function manhuagui(){
  // 全局物件
  // servs: 圖片 server 相關
  // pVars: 從 imgData 中設定出來的，有著當個章節的資訊
  // 但因為有了 imgData，這個變數的值都可以計算出來，所以沒啥用
  // SMH: 頁面加載漫畫的核心物件
  
  pageNum = unsafeWindow.pVars.page;
  picCount = unsafeWindow.cInfo.len;
  pics = new Array(pageNum - 1);
  
  picArea = getEl('table.pr').parentElement;
  picArea.setAttribute('align', 'center');
  getEl('#servList').remove();
  getEl('.sub-btn').remove();
  getEl('.backToTop').remove();
  
  // 拿到混淆後的代碼 => '(function(){}())'
  let code = Array.from(document.scripts)
    .find(s => s.innerHTML.search(/window\["\\x65\\x76\\x61\\x6c"\]/) > -1)
    .innerHTML
    .slice(26, -1)

  // 後續的執行中會用到頁面的字串原型擴充方法
  String.prototype.splic = unsafeWindow.String.prototype.splic
  
  // 拿到執行 SMH.imgData({xxx}) 的代碼，切出漫畫網址的物件資料 ({xxx})
  // 前後保留括號，方便下一步 return 物件出來
  let imgDataCode = eval(code).slice(11, -11)
  let imgData = eval(imgDataCode)

  // servs[pVars.curServ].hosts[pVars.curHost].h
  let domain = 'https://us.hamreus.com/'
  
  // webp
  // picUrls = imgData.files.map(fileName => domain + imgData.path + fileName + '?e=' + imgData.sl.e + '&m=' + imgData.sl.m)
  // jpg
  picUrls = imgData.files.map(fileName => domain + imgData.path + fileName.slice(0, -5) + '?e=' + imgData.sl.e + '&m=' + imgData.sl.m)
  
  // function showChapters(){
  //  $(".result-none").replaceWith(LZString.decompressFromBase64($("#__VIEWSTATE").val()));
  //  $("#__VIEWSTATE").remove();
  // }

  // function chgCountry(){
  //  document.cookie = "country=HX;domain=.manhuagui.com;path=/;expires=" + (new Date(2100, 0)).toUTCString() + ";";
  // }
}

function comicvip(){
  pageNum = unsafeWindow.p;
  picCount = unsafeWindow.ps;
  picArea = getEl('#TheImg').parentElement;
  picUrls = new Array(pageNum-1);
  pics = new Array(pageNum-1);
  
  let su = unsafeWindow.su;
  let ti = unsafeWindow.ti;
  let nn = unsafeWindow.nn;
  let mm = unsafeWindow.mm;

  let imgurl;
  for(let s of document.scripts){
    imgurl = s.innerHTML.match(/ge\('TheImg'\)\.src *?= *?(.+?;)/);
    if(imgurl){
      imgurl = imgurl[1];
      for(let i of s.innerHTML.match(/var +?\w+? *?= *?lc\(/g)){
        eval(i.slice(0, -3) + 'unsafeWindow.' + i.match(/var +?(\w+?) *?= *?lc\(/)[1]);
      }
      break;
    }
  }
  
  for(var i=0; i<picCount; i++){
    let p = i + 1;
    picUrls[i] = eval(imgurl);
  }
  
  getEl('#TheImg').remove();

  // 新增上下一話按鈕
  let prev_button = getEl('#prevvol').cloneNode(true);
  let next_button = getEl('#nextvol').cloneNode(true);
  prev_button.removeAttribute('id');
  next_button.removeAttribute('id');

  let bottom = getEl('#prevnext2');
  while (bottom.firstChild) bottom.firstChild.remove();

  bottom.appendChild(prev_button);
  let sp = document.createElement("div")
  sp.style.display = 'inline-block';
  sp.style.width = '6em';
  bottom.appendChild(sp);
  bottom.appendChild(next_button);
}

function cartoonmad(){
  let s = getEl('select');
  pageNum = parseInt(s.value.match(/\d+/)[0], 10);
  picCount = s.options.length - 1;
  picUrls = new Array(pageNum-1);
  pics = new Array(pageNum-1);
  picArea = getEl('body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(4) > td');
  picArea.style.paddingTop = '30px'

  let baseUrl = picArea.querySelector('img').src.match(/.+\//)[0]
  for (let i = 0; i < picCount; i++){
    picUrls[i] = baseUrl + (i + 1).toString().padStart(3, '0')
  }
}

function gufengmh8() {
  let chapterImages = clone(unsafeWindow.chapterImages)
  
  pageNum = unsafeWindow.SinTheme.getPage()
  picCount = chapterImages.length
  pics = Array(pageNum - 1).fill()
  
  picArea = getEl('#tbCenter')
  picArea.classList.remove('tbCenter')
  picArea.setAttribute('align', 'center');
  getEl('#subNav').remove()
  
  // SinConf.resHost
  let domain = unsafeWindow.SinConf.resHost[0].domain[0]
  picUrls = chapterImages.map(fileName => domain + '/' + unsafeWindow.chapterPath + fileName)
}

function manhuabei() {
  let code = (function () {
    let key = CryptoJS.enc.Utf8.parse('123456781234567G')
    let iv = CryptoJS.enc.Utf8.parse('ABCDEF1G34123412')
    let decrypt = CryptoJS.AES.decrypt(chapterImages, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
  }).toString()

  let chapterImages = JSON.parse(unsafeWindow.eval('(' + code + ')()'))
  pageNum = unsafeWindow.SinTheme.getPage()
  picCount = chapterImages.length
  picArea = getEl('.comic_wraCon')
  picArea.classList.remove('comic_wraCon')
  
  let domain = unsafeWindow.SinConf.resHost[0].domain[0]

  if (unsafeWindow.chapterPath === '') picUrls = chapterImages
  else picUrls = chapterImages.map(fileName => domain + '/' + unsafeWindow.chapterPath + fileName)

  pics = Array(pageNum - 1).fill()
  getEl('#mainNavDl').remove()
  getEl('.side_bar').remove()
  getEl('#sidePublic').remove()
}

document.documentElement.style.overflowY = 'scroll';

var isLog = false
var viewport = (document.compatMode == 'BackCompat') ? document.body : document.documentElement;
var zoomScreen = (() => {
  let isWebKit = navigator.userAgent.indexOf('WebKit') > -1

  return {
    width: isWebKit ? screen.width / devicePixelRatio : screen.width,
    height: isWebKit ? screen.height / devicePixelRatio : screen.height,
  }
})()

var min_h_width = Math.round(zoomScreen.width * 0.7)
var max_h_width = Math.round(zoomScreen.width - (26 / devicePixelRatio))
var min_v_height = Math.round(zoomScreen.height * 1.25)
var max_v_height = Math.round(zoomScreen.height * 1.3)

var preCount = 5;
var overRange = zoomScreen.height * 2;

var pageNum;
var picCount;
var picArea;
var picUrls;
var pics;

switch(location.hostname){
  case 'www.dm5.com':
  case 'www.1kkk.com':
    // manhuaren();
    dm5()
    break;
    
  case 'exhentai.org':
  case 'e-hentai.org':
    eh();
    break;
    
  case 'comicbus.com':
  case 'comicbus.live':
    comicvip();
    break;
    
  case 'www.manhuagui.com':
  case 'tw.manhuagui.com':
    manhuagui();
    break;
    
  case 'www.cartoonmad.cc':
    cartoonmad();
    break;
    
  case 'www.gufengmh8.com':
  case 'www.36mh.com':
  case 'www.90mh.com':
    gufengmh8();
    break
    
  case 'www.manhuabei.com':
  case 'www.manhuafen.com':
    manhuabei();
    break
}

picArea.innerHTML = '';

preload();
showPics();
preload();

(function(){
  log('onscroll');
  
  if(picArea.scrollHeight > 1000){
    log('onscroll start');
    
    onscroll = function(){
      if(picArea.offset().bottom-viewport.scrollTop < overRange){
        log('scrollTop: ' + viewport.scrollTop + '\npicArea.bottom: ' + picArea.offset().bottom);
        
        showPics();
        preload();
        
        if(pageNum>picCount){
          log('onscroll stop, pageNum: ' + pageNum);
          onscroll = undefined;
        }
      }
    };
  }else if(pageNum<=picCount){
    setTimeout(arguments.callee, 500);
  }
})();
