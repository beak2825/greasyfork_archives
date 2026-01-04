// ==UserScript==
// @name         和讯插件
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  自动刷新、自动提炼文章股票代码
// @author       ka1D0u
// @match        *://stock.hexun.com/fzxhkb/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hexun.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489540/%E5%92%8C%E8%AE%AF%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/489540/%E5%92%8C%E8%AE%AF%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

var CONFIG = {
  hideMessageUrl: true,
  hideMessageUrlFn: (obj) => {
      return obj.innerText.match(/基金/);
  },
  hideOthder: true,
  hideOthderTarget: [
    document.getElementById("shortcut-2014"),
    document.querySelector("body > div.logonav-2014-w960.clearfix"),
    document.querySelector("body > div.footer_2014"),
    document.querySelector("#headerNav_2014"),
    document.querySelector("#lbysec"),
  ],

  // fetchInterval, second
  fetchInterval: [0.5, 1.5],

  // reload interval
  reloadInterval: 1000 * 60
}

function _getTodayStr() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); // 1月是 0!
  var yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}

function _getTodayMinuteStr() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); // 1月是 0!
  var yyyy = today.getFullYear();
  var hour = today.getHours();
  var minute = today.getMinutes();
  return yyyy + '-' + mm + '-' + dd + 'T' + hour + ':' + minute;
}

function _filterElement(elements, matchFn) {
  var result = [];
  for (var i = 0; i < elements.length; i++) {
    if (matchFn(elements[i])) {
      result.push(elements[i]);
    }
  }
  return result;
}


function _getUrlDate(url) {
  // https://stock.hexun.com/2024-03-11/212126449.html
  var dateStr = url.match(/\d{4}-\d{2}-\d{2}/)[0];
  return dateStr;
}

function _getUrlId(url) {
  // https://stock.hexun.com/2024-03-11/212126449.html
  var idStr = url.match(/\d+(?=\.html)/)[0]
  return idStr;
}

function filterMessageUrlObject(matchFn) {
  var allLinks = document.getElementsByClassName("mainboxcontent")[0].getElementsByTagName("a");
  return _filterElement(allLinks, matchFn);
}

function hideMessageUrlObject(matchFn) {
  var allLinks = document.getElementsByClassName("mainboxcontent")[0].getElementsByTagName("a");

  _filterElement(allLinks, matchFn).forEach(function(link) {
    console.log(`hide message url: ${link.innerText}`)
    link.parentNode.style.display="none"
  });
}

class FetchCache {
  constructor(keep=7) {
    this.rangeClear(keep)
  }

  getRangeDate(day=7) {
    var currentDate = new Date();
    var dates = [];

    for (var i = -day; i <= day; i++) {
        var tempDate = new Date(currentDate);
        tempDate.setDate(currentDate.getDate() + i);
        var year = tempDate.getFullYear();
        var month = String(tempDate.getMonth() + 1).padStart(2, '0');
        dates.push(year + '-' + month + '-' + String(tempDate.getDate()).padStart(2, '0'));
    }
    return dates;
  }


  rangeClear(day=7) {
    var keepDates = this.getRangeDate(day);
    var allKeys = Object.keys(localStorage);
    for (var i = 0; i < allKeys.length; i++) {
      var key = allKeys[i];
      if (key.match(/\d{4}-\d{2}-\d{2}/)) {
        if (!keepDates.includes(key)) {
          console.log(`clear cache: ${key}`)
          localStorage.removeItem(key);
        }
      } // if
    }
  }

  setByDate(dateStr, obj) {
    localStorage.setItem(dateStr, JSON.stringify(obj));
  }

  getByDate(dateStr) {
    var cacheObj = localStorage.getItem(dateStr);
    if (cacheObj) {
      return JSON.parse(cacheObj);
    }
    return {}
  }

  getFetchStatus(url) {
    var dateStr = _getUrlDate(url);
    var cacheObj = this.getByDate(dateStr);
    if (cacheObj && cacheObj[url]) {
      return cacheObj[url].fetch;
    }
    return false
  }

  getFetchUrlCache(url) {
    var dateStr = _getUrlDate(url);
    var cacheObj = this.getByDate(dateStr);
    if (cacheObj && cacheObj[url]) {
      return cacheObj[url].urls;
    }
    return []
  }

  setFetchStatus(url, status) {
    let dateStr = _getUrlDate(url);
    let cacheObj = this.getByDate(dateStr);
    if (!cacheObj[url]) {
      cacheObj[url] = {
        fetch: status,
        urls: []
      }
    } else {
      cacheObj[url].fetch = status;
    }
    this.setByDate(dateStr, cacheObj);
  }

  setFetchUrlCache(url, itemUrl, itemText) {
    let dateStr = _getUrlDate(url);
    let cacheObj = this.getByDate(dateStr);
    if (!cacheObj[url]) {
      cacheObj[url] = {
        fetch: true,
        urls: [{url: itemUrl, text: itemText}]
      }
    } else {
      let urls = cacheObj[url].urls;
      // check if exist
      for (let i = 0; i < urls.length; i++) {
        if (urls[i].url === itemUrl) {
          return;
        }
      }
      urls.push({url: itemUrl, text: itemText});
    }

    this.setByDate(dateStr, cacheObj);
  }

}


class DetailCrawl{

  subWindow = null;

  constructor(urlObj){
    this.urlObj = urlObj;
    var url = this.urlObj.getAttribute('href');

    this.url = this.http2https(url);
    this.fetchCache = new FetchCache()
  }

  http2https(url) {
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  }

  async saveCache(document) {
    // find all a tags, attribute onmouseover
    // showImage('stock','1_600030',this,event,'1770')
    var allLinks = _filterElement(document.getElementsByTagName('a'), (obj) => {
      var regex = /\d+\.shtml/;
      return obj.getAttribute('onmouseover')&& regex.test(obj.getAttribute('href'))
    });

    var result = [];
    if (allLinks.length > 0) {
      for (var i = 0; i < allLinks.length; i++) {
        var link = allLinks[i];
        var href = link.getAttribute('href');
        var text = link.innerText;
        this.fetchCache.setFetchUrlCache(this.url, href, text);
        result.push({url: href, text: text});
      }
    }
    return result;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async run(sleep=500) {
    var getFetchStatus = this.fetchCache.getFetchStatus(this.url);
    if (getFetchStatus) {
      console.log(`cache hit: ${this.url}`)
      this.insertStockInfo(
        this.fetchCache.getFetchUrlCache(this.url));
      return;
    }

    console.log(`fetch: ${this.url}`)
    await this.sleep(sleep);
    var document = await this.open();
    this.subWindow.close();
    this.subWindow = null;
    // 
    let newFetchedUrls = await this.saveCache(document);
    this.insertStockInfo(newFetchedUrls);

    // console.log(document)
    this.fetchCache.setFetchStatus(this.url, true);
  }

  insertStockInfo(stockArr) {
    // <li>
    //   <span class="stock">1_600030</span>
    //   <span>(03/11 14:49)</span>
    //   <a href="http://stock.hexun.com/2024-03-11/212130144.html" target="_blank"> 合肥房地产融资破冰：32项目获白名单，8个斩获67亿信贷支持</a>
    //</li>
    let parent = this.urlObj.parentNode;

    stockArr.forEach((item) => {
      if (parent.getElementsByClassName("stock").length > 0) {
        return;
      }

      console.log(`insert stock info: ${item.text}`)
      const { url, text } = item;
      let stockObj = document.createElement('a');
      stockObj.href = url;
      // css class
      stockObj.classList.add('stock');
    
      stockObj.innerText = text;
      // insert parent
      parent.insertBefore(stockObj, this.urlObj);
    });
  }

  async open() {
    if (this.subWindow != null) {
      this.subWindow.close();
    }

    console.log(`open: ${this.url}`)
    this.subWindow = window.open(this.url, '_blank');
    return new Promise((resolve, reject) => {
      var timer = setInterval(() => {
        if (this.subWindow !== null && this.subWindow.closed) {
          clearInterval(timer);
          reject('subWindow closed');
        }
        if (this.subWindow !== null && this.subWindow.document.readyState === 'complete') {
          clearInterval(timer);
          resolve(this.subWindow.document);
        }
      }, 500);
    });
  }
}

function newCss() {
  var newStyle = `
.temp01{
  padding-left:16px
}

.temp01 ul{
  list-style:none;
  text-align:left;
}

.temp01 li{
  list-style:none; 
  font-size:14px; 
  height:24px; 
  line-height:24px; 
  padding-left:8px; 
  overflow:hidden;
}

.temp01 ul .stock {
  float:left;
  color: blue;
  font-weight: bold;
  margin-right: 5px;
  font-size: 12px;
  border: 1px solid transparent;
  border-radius: 3px;
  padding: 0 3px;
  cursor: pointer;
}

.temp01 ul SPAN {
  float:right;
}

#wrap{
  margin: 0 auto; 
  width: none; 
  border: none; 
}

#content{ 
  border: none;
  margin: 0 auto; 
  padding: 12px 0 0 0;
}

#breadcrumbs{
  line-height: 28px;
  height: 28px;
  border: none;
  border-style: none;
}

a{ color: #000; text-decoration: none; }
a:hover { color: #cc0000; text-decoration: underline; }
a:active { color: #cc0000; }
`
  var styleElement = document.createElement('style');
  styleElement.textContent = newStyle;

  document.head.appendChild(styleElement);

  // reset width
  var wrap = document.querySelector("#wrap")
  wrap.style.width = "";

  var content = document.querySelector("#content > div")
  content.style.width = "";
  content.style.border = "none";

  var mainboxcontent= document.querySelector("#mainbox > div.mainboxcontent > div")
  mainboxcontent.style.width = "100%";

  //
  var mainBox =document.querySelector("#mainbox")
  mainBox.style.width = "100%";
  mainBox.style.float = "none";
  mainBox.style.margin = "0 auto";
  mainBox.style.padding = "0";
}

function random(n,m){
  return (Math.random() * (m - n + 1) + n).toFixed(2) * 1;
}

async function main() {
  // hide "基金"
  if (CONFIG.hideMessageUrl) {
    hideMessageUrlObject(CONFIG.hideMessageUrlFn);
  }

  // hide other
  if (CONFIG.hideOthder) {
    CONFIG.hideOthderTarget.forEach(function(obj) {
      obj.style.display = "none";
    });
  }

  // change css style
  newCss();


  // hide message urls
  hideMessageUrlObject(
    (obj) => {
      if (obj.innerText.match(/基金/)) {
        return true
      }
      return false
    });

  console.log('wait for document ready state complete')
  // setTimeout(function() {
    // filter message urls
  var messageUrls = filterMessageUrlObject(
    (obj) => {
      var href = obj.getAttribute('href');
      if (href && href.match(
        /stock.hexun.com\/\d{4}\-\d{2}-\d{2}\/.*/)) {
        return true
      }
      return false
    });

  let fetchCount = messageUrls.length;
  let lock = new ReloadLock();
  lock.setMinuteLock();

  for (var i = 0; i < messageUrls.length; i++) {
    var detailCrawl = new DetailCrawl(
        messageUrls[i]);

    var randomSec = random(
      CONFIG.fetchInterval[0], CONFIG.fetchInterval[1]) * 1000;

    let run = await  detailCrawl.run(randomSec*i);
    fetchCount--;
  }

  if (fetchCount === 0) {
    lock.release();
  }
}

function listenPageClick() {
  let curPage = 0;
  var pageChangeCheck = setInterval(() => {
    if (curPage !== hxPage.curPage) {
      curPage = hxPage.curPage;
      main()
    };
    
  });
}

class ReloadLock {
  constructor() {
    this.lock = localStorage.getItem('reloadLock');
    this.time = localStorage.getItem('reloadTime');
  }

  setMinuteLock() {
    this.lock = true;
    this.time = _getTodayMinuteStr();

    //  update title
    let title = document.querySelector("#L_tit01 > h3 > p")
    title.innerText = `上次刷新时间：${this.time}`;

    localStorage.setItem('reloadLock', true);
    localStorage.setItem('reloadTime', this.time);
  }

  getLock() {
    return this.lock == true || this.lock == 'true' || this.lock == 1;
  }

  getTime() {
    return this.time;
  }

  release() {
    localStorage.setItem('reloadLock', false);
    localStorage.setItem('reloadTime', _getTodayMinuteStr());
  }
}

(function() {
  'use strict';
  
  var initTimer = setInterval(() => {
    let readyState = document.readyState;
    if (readyState === 'complete') {
      clearInterval(initTimer);
      main();
      listenPageClick();
    } 
  }, 500);


  var reloadTimer = setInterval(() => {
    let lock = new ReloadLock();
    let reloadLock = lock.getLock();

    if (reloadLock) {
      return;
    }

    let nowTime = _getTodayMinuteStr();
    if (nowTime !== lock.getTime()) {
      lock.setMinuteLock();
  
      console.log('reload')
      history.go(0) 
    }
  }, CONFIG.reloadInterval);

})();