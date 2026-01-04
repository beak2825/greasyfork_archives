// ==UserScript==
// @name         TikTok播放量分析
// @namespace    http://tampermonkey.net/
// @version      0.32
// @license      MIT
// @description  TikTok播放量滚动数据抓取
// @author       hellocode
// @match        https://www.tiktok.com/@*
// @exclude      https://www.tiktok.com/@*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @run-at       document-start
// @resource    jqueryBaseCSS https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/themes/base/jquery-ui.min.css
// @resource    jqueryToastCSS https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.css
// @require https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/jquery-ui.min.js
// @require https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.js
// @require https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.common.min.js
// @downloadURL https://update.greasyfork.org/scripts/473515/TikTok%E6%92%AD%E6%94%BE%E9%87%8F%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/473515/TikTok%E6%92%AD%E6%94%BE%E9%87%8F%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==


function isHookUrl(url) {
  return url.includes('https://www.tiktok.com/api/post/item_list')
}

function getClassName(obj) {
  if (obj === null) return 'null';
  if (typeof obj !== 'object') return typeof obj; // 处理非对象值

  return obj.constructor.name;
}


let _fetchCache = Object.getOwnPropertyDescriptor(unsafeWindow, "fetch");
console.log(_fetchCache)

Object.defineProperty(unsafeWindow, "fetch", {
  value: function (request) {
      // console.log("Hook fetch url => ", request, getClassName(request));

      let isRequest = getClassName(request) == "Request"
      let url = isRequest ? request.url : request

      let isHooked = isHookUrl(url)

      if (isHooked) {
          console.log("拦截请求", url, isRequest)
          try {
              onInterceptRequest(request, url, isRequest)
          } catch(e) {
              console.error(e)
          }


          return _fetchCache.value.apply(this, arguments).then(res => {
            console.log("拦截响应", url, isRequest)
  
            // 复制响应流
            const responseCopy = res.clone();
            return responseCopy.json().then(data => {
                // console.log(data)
                try {
                    onInterceptResponse(data, request, url, isRequest)
                } catch(e) {
                    console.error(e)
                }

                return res
            }) 
        }, function (e) {
            if(e.name != 'AbortError') {
              console.error(e, "报错！")
              try {
                onInterceptResponseError(e, request, url, isRequest)    
              } catch (e) {
                console.error(e)
              }
            }
        }).finally(function() {
          try {
            onInterceptResponseFinally(request, url, isRequest)
          } catch (e) {
            console.error(e)
          }
        });

      } else {
        return _fetchCache.value.apply(this, arguments)
      }
  }
});





// 替换原始方法，并发送新的事件
const _historyWrap = function (type) {
  const orig = history[type];
  const e = new Event(type);
  return function () {
    const rv = orig.apply(this, arguments);
    e.arguments = arguments;
    window.dispatchEvent(e);
    return rv;
  };
};
history.pushState = _historyWrap('pushState');
history.replaceState = _historyWrap('replaceState');


GM_addStyle(GM_getResourceText("jqueryBaseCSS"));
GM_addStyle(GM_getResourceText("jqueryToastCSS"));


GM_addStyle(`

.moreInfo {
  width: 100%;
  bottom: 0;
  padding-bottom: 33px;
  position: absolute;
  padding-left: 10px;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
}

.moreInfo svg {
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.6));
}

[data-e2e=user-post-item-list].hide-more-info .moreInfo,
[data-e2e=user-repost-item-list].hide-more-info .moreInfo,
[data-e2e=user-like-item-list].hide-more-info .moreInfo {
  visibility: hidden;
}

.downloadController {
  padding: 2px 6px 0 8px;
  position: fixed;
  z-index: 10000;
  top: 2px;
  left: 140px;
  background: green;
  border: none;
  border-radius: 5px;
  box-shadow: 1px 1px 10px black;
  display: flex;
  color: white;
  font-size: 12px;
  align-items: flex-start;
  flex-direction: column;
}

#progressTxt, #selectedTxt, #impressionTxt {
  color: yellow;
}

#ecpmInput {
  width: 80px;
  margin-left: 2px;
  padding-right: 34px;
  color: black;
}

#ecpmIcon {
  position: absolute;
  padding: 0 1px;
  right: 2px;
  top: 2px;
  font-size: 12px;
  transform:scale(0.8);
  background-color: #272727;
  color: white;
  border-radius: 2px;
}

#ecpmCalc {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#offerMoney {
  width: 66px;
  margin-left: 2px;
  padding-right: 20px;
  margin-right: 4px;
  border-radius: 2px;
  color: black;
}


#offerMoney::-webkit-inner-spin-button,
#offerMoney::-webkit-outer-spin-button,
#ecpmInput::-webkit-inner-spin-button,
#ecpmInput::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

#offerMoney, #ecpmInput{
  -moz-appearance: textfield; /* Firefox */
}

.iconMoney {
  position: absolute;
  right: 4px;
  top: 2px;
}




.downloadController button {
  font-size: 12px;
  background: transparent;
  border-width: 0;
  cursor: pointer;
  color: white;
  padding: 4px;
}

.downloadController button:hover {
  text-decoration: underline;
}


.ui-dropdown button {
  font-size: 12px;
  border-width: 0;
  cursor: pointer;
}

#dropdown-menu {
  display: inline-flex;
}

#dropdown-menu .ui-dropdown,
.custom-checkbox .ui-dropdown {
  position: absolute !important;
  display: none;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 13px;
  width: 100px;
  z-index: 1000;
  text-align: left;
}

#dropdown-menu .ui-button:hover, #dropdown-menu .ui-button:focus,
.custom-checkbox .ui-button:hover, .custom-checkbox .ui-button:focus {
  border: 0;
  background: transparent;
  font-weight: normal;
  text-decoration: underline;
  color: white;
}

#dropdown-menu .ui-dropdown li,
.custom-checkbox .ui-dropdown li {
  padding: 0 !important;
}

#dropdown-menu .ui-dropdown li button,
.custom-checkbox .ui-dropdown li button {
  display: block;
  padding: 10px 15px !important;
  text-shadow: none !important;
  text-decoration: none;
  font-size: 13px;
  width: 100%;
  color: #333;
}

#dropdown-menu .ui-dropdown li button:hover,
.custom-checkbox .ui-dropdown li button:hover {
  color: white;
}

#dropdown-menu .ui-dropdown li p,
.custom-checkbox .ui-dropdown li p {
  white-space: normal;
  font-size: 13px;
  font-weight: normal;
  text-shadow: none;
  color: #888 !important;
  padding: 10px;
  margin: 0;
}


/* Resetting input styles */
.custom-checkbox input {
  position: absolute;
  cursor: pointer;
}

.custom-checkbox {
  cursor: pointer;
  display: inline-block;
  line-height: 20px;
  font-size: 16px;
  user-select: none; /* prevent text selection */

  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
  height: 20px;
  width: 20px;
}

/* Create a custom checkbox */
.custom-checkbox .checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 5px; /* rounded corners */
  transition: background 0.3s, border 0.3s; /* smooth transition */
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

/* On mouse-over, add a grey background color */
.custom-checkbox:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, change the background and border */
.custom-checkbox input:checked ~ .checkmark {
  background-color: red;
  border: none; /* optional, depending on the design */
}

/* Create the checkmark/indicator (hidden when not checked) */
.custom-checkbox .checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.custom-checkbox .checkmark:after {
  left: 8px;
  top: 4px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}


.user-post-item-selected,
.user-repost-item-selected,
.user-like-item-selected {
  outline: 6px solid red;
}


.toast-icon {
  color: black; /* Replace 'red' with the desired color */
}


#mycharts {
    background: #eee;
    width: 100%;
    height: 300px;
}


`);


/**
 * HELPER FUNCTIONS
 */


function onElementInserted(target, elementSelector, callback) {

  var onMutationsObserved = function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        // console.log(mutation.addedNodes)
        var elements = null
        if (typeof elementSelector == 'function') {
          elements = elementSelector(mutation.addedNodes);
        } else if (typeof elementSelector == 'string') {
          elements = $(mutation.addedNodes).find(elementSelector);
        } else {
          elements = mutation.addedNodes
        }

        for (var i = 0, len = elements.length; i < len; i++) {
          callback(elements[i]);
        }
      }
    });
  };

  var config = { childList: true, subtree: true };
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var observer = new MutationObserver(onMutationsObserved);
  observer.observe(target, config);
}

function onElementDeleted(target, callback) {

  var onMutationsObserved = function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.removedNodes.length) {
        // console.log("removed", mutation.removedNodes)
        var elements = mutation.removedNodes
        for (var i = 0, len = elements.length; i < len; i++) {
          callback(elements[i]);
        }

      }
    });
  };

  var config = { childList: true, subtree: true };
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var observer = new MutationObserver(onMutationsObserved);
  observer.observe(target, config);
}


function convertToCSV(data) {
  const csvRows = [];
  const headers = Object.keys(data[0]);

  // 添加 CSV 头部
  csvRows.push(headers.join(','));

  // 添加数据行
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  // 将行连接为 CSV 字符串
  return csvRows.join('\n');
}

function downloadCSV(data, filename) {
  const csvString = convertToCSV(data);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  // 设置下载文件的名称
  link.setAttribute('href', URL.createObjectURL(blob));
  link.setAttribute('download', filename);

  // 添加链接元素并模拟点击下载
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}





function checkAppNodeReady(cb) {

  let appNode = document.getElementById('app')
  console.log("check app", appNode)

  if (!appNode) {
    console.log("NO app")
    setTimeout(() => {
      checkAppNodeReady(cb)
    }, 1000)
  } else {
    cb()
  }

}


function formatNumber(number) {
  if (number >= 1000) {
    var suffixes = ["", "K", "M", "G", "T", "P", "E", "Z", "Y"];
    var suffixIndex = 0;
    while (number >= 1000) {
      number /= 1000;
      suffixIndex++;
    }
    return number.toFixed(1) + suffixes[suffixIndex];
  } else {
    return number.toString();
  }
}


function formatDatetime(date, matter) {
  if (typeof date === 'string') {
    date = new Date(date);
  } else if (!(date instanceof Date)) {
    throw new Error('Invalid datetime format');
  }
  let year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString();
  month = (month.length > 1) ? month : ('0' + month);
  let day = date.getDate().toString();
  day = (day.length > 1) ? day : ('0' + day);
  let hours = date.getHours().toString();
  hours = (hours.length > 1) ? hours : ('0' + hours);
  let minutes = date.getMinutes().toString();
  minutes = (minutes.length > 1) ? minutes : ('0' + minutes);
  let seconds = date.getSeconds().toString();
  seconds = (seconds.length > 1) ? seconds : ('0' + seconds);
  let retVal = matter;
  if (matter.indexOf('yyyy') >= 0) {
    retVal = retVal.replace('yyyy', year);
  } else if (matter.indexOf('YYYY') >= 0) {
    retVal = retVal.replace('YYYY', year);
  } else if (matter.indexOf('yy') >= 0) {
    retVal = retVal.replace('yy', year.substring(2));
  } else if (matter.indexOf('YY') >= 0) {
    retVal = retVal.replace('YY', year.substring(2));
  }


  if (matter.indexOf('mm') > 0) {
    retVal = retVal.replace('mm', month);
  } else if (matter.indexOf('MM') > 0) {
    retVal = retVal.replace('MM', month);
  }


  if (matter.indexOf('dd') > 0) {
    retVal = retVal.replace('dd', day);
  } else if (matter.indexOf('DD') > 0) {
    retVal = retVal.replace('DD', day);
  }


  if (matter.indexOf('hh') > 0) {
    retVal = retVal.replace('hh', hours);
  } else if (matter.indexOf('HH') > 0) {
    retVal = retVal.replace('HH', hours);
  }


  if (matter.indexOf('mi') > 0) {
    retVal = retVal.replace('mi', minutes);
  } else if (matter.indexOf('MI') > 0) {
    retVal = retVal.replace('MI', minutes);
  }


  if (matter.indexOf('ss') > 0) {
    retVal = retVal.replace('ss', seconds);
  } else if (matter.indexOf('SS') > 0) {
    retVal = retVal.replace('SS', seconds);
  }
  return retVal;
}



function copyToClipboard(e, text) {
  if (!text) return

  var copy = function (e) {
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.setData('text/plain', text);
    } else if (window.clipboardData) {
      window.clipboardData.setData('Text', text);
    }
  }
  window.addEventListener('copy', copy);
  document.execCommand('copy');
  window.removeEventListener('copy', copy);
}


/**
 * LOGIC
 */




function getCurrTagName() {
  let url = decodeURI(window.location.href)
  var regex = /https:\/\/www\.tiktok\.com\/@([^\/?]+)/;
  var match = regex.exec(url);

  if (match) {
    return match[1] + '_kol'
  } else {
    return 'tt_kol'
  }
}


function is_valid_url() {
  var pattern = /https:\/\/www\.tiktok\.com\/@([^\/?]+)$/;
  return window.location.href.match(pattern)
}




let collectData = []
let collectData2 = {}


let started = false
let loading = false
let noMore = false

let scrollTimer = null

function startLoad() {
  if (loading) return

  started = true
  loading = true

  console.log($(document).height())

  $('html, body').animate({
    scrollTop: $(document).height()
  }, 200);

}

function endLoad() {
  started = false
  loading = false

  clearTimeout(scrollTimer)

  //downloadCSV(exepectData(), getCurrTagName() + ".csv")

  updateUI()
}

function exepectData() {
  return collectData
}

function updateUI() {

  calEcpm()

  let selectCount = $('.custom-checkbox .actual-checkbox:checked').length

  $('#selectedTxt').text(`${selectCount} selected`)
  $('#copySelectedBtn').prop('disabled', !selectCount)
  $('#clearSelectedBtn').prop('disabled', !selectCount)


  if (started) {
    $('#startBtn').text("EndScroll")
  } else {
    $('#startBtn').text("StartScroll")
  }


  let currCount = exepectData().length

  if (loading) {
    $('#progressTxt').text(`${currCount} videos`)
  } else {
    $('#progressTxt').text(`${currCount} videos`)
  }

  updateCharts()
  
  setTimeout(() => {
    showAllInfo()
  }, 1000)

}


function calLatestAvg() {

  // 获取前 20 条视频，排除掉置顶

  let sum = 0
  let avg = 0
  let count = 0

  for (let i = 0; i < collectData.length; i++) {

    let item = collectData[i]
    if (item.isPinnedItem) {
      continue
    }

    count += 1
    sum += item.playCount

    if (count >= 20) {
      break
    }
  }

  if (count) {
    avg = sum / count
  }

  // 更新 UI
  $('#impressionTxt').text(formatNumber(avg) + ' views(AVG)')

  return avg
}


function calEcpm() {


  let avg = calLatestAvg()

  let offerMoney = parseFloat($('#offerMoney').val() || 0)

  if (offerMoney && avg) {
    let ecpm = (offerMoney / (avg / 1000)).toFixed(2)
    $('#ecpmInput').val(ecpm)
  } else {
    $('#ecpmInput').val('')
  }
}


function calPrice() {

  let avg = calLatestAvg()

  let ecpm = parseFloat($('#ecpmInput').val() || 0)

  if (ecpm && avg) {
    let price = (ecpm * (avg / 1000)).toFixed(0)
    $('#offerMoney').val(price)
  } else {
    $('#offerMoney').val('')
  }
}





function showAllInfo() {

  $('[data-e2e="user-post-item"]').each(function () {
    let href = $(this).find("a").attr('href');
    //console.log(href)

    let info = collectData2[href]
    if (!info) return

    let moreInfoContainer = $(this).find(".moreInfo")
    if (moreInfoContainer.length <= 0) {
      // 创建一个
      moreInfoContainer = $(`
      <div class="moreInfo">
        <div>
            <svg t="1712414380432" class="css-h342g4-StyledPlay" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26907" width="18" height="18"><path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" p-id="26908" fill="#ffffff"></path></svg>
            <strong data-e2e="video-views" class="like-count css-dirst9-StrongVideoCount e148ts222">LikeCount</strong>
        </div>
        <div>
            <svg t="1712414770515" class="css-h342g4-StyledPlay" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33061" width="18" height="18"><path d="M371.2 454.4m-51.2 0a0.8 0.8 0 1 0 102.4 0 0.8 0.8 0 1 0-102.4 0Z" fill="#ffffff" p-id="33062"></path><path d="M512 454.4m-51.2 0a0.8 0.8 0 1 0 102.4 0 0.8 0.8 0 1 0-102.4 0Z" fill="#ffffff" p-id="33063"></path><path d="M652.8 454.4m-51.2 0a0.8 0.8 0 1 0 102.4 0 0.8 0.8 0 1 0-102.4 0Z" fill="#ffffff" p-id="33064"></path><path d="M377.6 896c-6.4 0-6.4 0-12.8 0-12.8-6.4-19.2-19.2-19.2-32l0-128C211.2 684.8 128 569.6 128 448c0-179.2 172.8-320 384-320s384 140.8 384 320c0 172.8-166.4 313.6-371.2 320l-128 121.6C390.4 896 384 896 377.6 896zM512 192C332.8 192 192 307.2 192 448c0 102.4 76.8 192 192 236.8 12.8 6.4 19.2 19.2 19.2 32l0 76.8 83.2-76.8C492.8 704 505.6 704 512 704c179.2 0 320-115.2 320-256S691.2 192 512 192z" fill="#ffffff" p-id="33065"></path></svg>
            <strong data-e2e="video-views" class="comment-count css-dirst9-StrongVideoCount e148ts222">CommentCount</strong>
        </div>
        <div>
            <svg t="1712414889297" class="css-h342g4-StyledPlay" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="34099" width="18" height="18"><path d="M780.190476 97.52381a73.142857 73.142857 0 0 1 73.142857 73.142857v755.809523l-341.333333-152.380952L170.666667 926.47619V170.666667a73.142857 73.142857 0 0 1 73.142857-73.142857h536.380952z m0 73.142857H243.809524v643.047619l268.190476-119.710476 268.190476 119.710476V170.666667z" p-id="34100" fill="#ffffff"></path></svg>
            <strong data-e2e="video-views" class="collect-count css-dirst9-StrongVideoCount e148ts222">CollectCount</strong>
        </div>
        <div>
            <svg t="1712414958609" class="css-h342g4-StyledPlay" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="35150" width="18" height="18"><path d="M625.792 302.912V64L1024 482.112l-398.208 418.176V655.36C341.312 655.36 142.208 750.912 0 960c56.896-298.688 227.584-597.312 625.792-657.088z" fill="#ffffff" p-id="35151"></path></svg>
            <strong data-e2e="video-views" class="share-count css-dirst9-StrongVideoCount e148ts222">ShareCount</strong>
        </div>
        <div>
            <svg t="1712415048544" class="css-h342g4-StyledPlay" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="36215" width="18" height="18"><path d="M128 384v512h768V192h-128v32q0 14.016-8.992 23.008T736 256t-23.008-8.992T704 224V192H320v32q0 14.016-8.992 23.008T288 256t-23.008-8.992T256 224V192H128v128h768v64H128z m192-256h384V96q0-14.016 8.992-23.008T736 64t23.008 8.992T768 96v32h160q14.016 0 23.008 8.992T960 160v768q0 14.016-8.992 23.008T928 960H96q-14.016 0-23.008-8.992T64 928V160q0-14.016 8.992-23.008T96 128h160V96q0-14.016 8.992-23.008T288 64t23.008 8.992T320 96v32zM288 512h64q14.016 0 23.008 8.992T384 544t-8.992 23.008T352 576H288q-14.016 0-23.008-8.992T256 544t8.992-23.008T288 512z m0 192h64q14.016 0 23.008 8.992T384 736t-8.992 23.008T352 768H288q-14.016 0-23.008-8.992T256 736t8.992-23.008T288 704z m192-192h64q14.016 0 23.008 8.992T576 544t-8.992 23.008T544 576h-64q-14.016 0-23.008-8.992T448 544t8.992-23.008T480 512z m0 192h64q14.016 0 23.008 8.992T576 736t-8.992 23.008T544 768h-64q-14.016 0-23.008-8.992T448 736t8.992-23.008T480 704z m192-192h64q14.016 0 23.008 8.992T768 544t-8.992 23.008T736 576h-64q-14.016 0-23.008-8.992T640 544t8.992-23.008T672 512z m0 192h64q14.016 0 23.008 8.992T768 736t-8.992 23.008T736 768h-64q-14.016 0-23.008-8.992T640 736t8.992-23.008T672 704z" p-id="36216" fill="#ffffff"></path></svg>
            <strong data-e2e="video-views" class="publish-date css-dirst9-StrongVideoCount e148ts222">PublishDate</strong>
        </div>
      </div>
      `)
      $(this).find("a").append(moreInfoContainer)
    }

    // 更新数字
    $(this).find(".publish-date").text(formatDatetime(info.publishDate, 'YYYY-MM-DD'))
    $(this).find(".share-count").text(formatNumber(info.shareCount))
    $(this).find(".collect-count").text(formatNumber(info.collectCount))
    $(this).find(".comment-count").text(formatNumber(info.commentCount))
    $(this).find(".like-count").text(formatNumber(info.diggCount))

    // 更新选中样式

    if ($(this).find('.actual-checkbox').is(":checked")) {
      $(this).addClass('user-post-item-selected')
    } else {
      $(this).removeClass('user-post-item-selected')
    }

  })

}

function updateCharts() {

  if(!window.myChart) {

    console.log("还没有创建 mychart")

    return
  }


  let data = collectData.filter((i) => !i.isPinnedItem)
      .map((i) => [i.publishDate.split(" ")[0], i.playCount])
      .sort((a, b) => a[0].localeCompare(b[0]))

  // console.log(data)


  let option = {
    grid: {
      top: '30px',
    },
    xAxis: {
      name: 'PublishDate',
      nameLocation: 'end',
      nameTextStyle: {
        verticalAlign: 'top',
        padding: [8, 0,0,0]
      },
      type: 'category',
      data: [...new Set(data?.map((d) => d[0]))],
    },
    yAxis: {
      name: 'Views',
      nameTextStyle: {
        align: 'right',
        padding: [0, 8,0,0]
      },
      type: 'value',
      show: true,
    },
    tooltip: {
      trigger: 'axis',
    },
    series: [
      {
        symbolSize: 6,
        data: data,
        itemStyle: {
          color: (node) => {
            if (node.data?.[1] > 1000000) {
              return 'green'
            } else {
              return node.color
            }
          },
        },
        type: 'scatter',
        markLine: {
          symbol: 'none',
          data: [
            {
                yAxis: '1000000',
            },
          ]
        }
      }
    ],
    dataZoom: [
      {
        id: 'dataZoomX',
        show: true,
        realtime: true,
        start: 0,
        end: 100,
        xAxisIndex: [0],
      },
      {
        id: 'dataZoomY',
        show: true,
        realtime: true,
        start: 0,
        end: 100,
        yAxisIndex: [0, 1],
      },
    ],
  };
  myChart.setOption(option)
  console.log("更新 mycharts")
}


function onInterceptRequest(request, url, isRequest) {
  console.log("onInterceptRequest", url)

  loading = true
  updateUI()
}

function onInterceptResponse(data, request, url, isRequest) {
  console.log("onInterceptResponse", url, data)

  if (data.statusCode == 0) {

    for (let i of data.itemList) {

      let username = i.author.uniqueId
      let videoId = i.video.id

      let link = ''
      if (i.imagePost !== undefined) {
        link = `https://www.tiktok.com/@${username}/photo/${videoId}`
      } else {
        link = `https://www.tiktok.com/@${username}/video/${videoId}`
      }



      let item = {
        link,
        publishDate: formatDatetime(new Date(i.createTime * 1000), 'YYYY-MM-DD HH:MI:ss'),
        collectCount: i.stats.collectCount,
        commentCount: i.stats.commentCount,
        diggCount: i.stats.diggCount,
        playCount: i.stats.playCount,
        shareCount: i.stats.shareCount,
        desc: i.desc,
        kolUrl: decodeURI(unsafeWindow.location.href),
        isPinnedItem: i.isPinnedItem,
      }

      if (!collectData2[link]) {
        collectData.push(item)
        collectData2[link] = item
      }

    }

  }

  if (!data.hasMore) {
    endLoad()
  }
}

function onInterceptResponseError(e, request, url, isRequest) {
  console.log("onInterceptResponseError", url, e)

}

function onInterceptResponseFinally(request, url, isRequest) {
  console.log("onInterceptResponseFinally", url)

  loading = false
  updateUI()
}





(function () {
  'use strict';

  checkAppNodeReady(() => {


    onElementInserted(document.getElementById('app'), null, (i) => {
      let loadingParentDiv = $('#main-content-others_homepage')
      if (i.nodeName === 'svg') {
        if ($(i).parent().parent().parent().parent().is(loadingParentDiv)) {
          //console.log("loading", i)
          // 不需要处理
        }
      }
    })


    onElementDeleted(document.getElementById('app'), (i) => {
      if (i.nodeName === 'svg') {
        //console.log("loaded", i)
        if (started) {
          scrollTimer = setTimeout(() => {
            startLoad()
          }, 100)
        }
      }
    })


    $(function () {
      console.log("jquery版本号：" + $.fn.jquery);


      $('body').append(`

      <div class="downloadController">

      <div id="ecpmCalc">
          <span id="impressionTxt">0 views(AVG)</span>
  

          <div style="position: relative">
            <input type="number" id="offerMoney" placeholder="Price">
            <svg t="1715696088593" class="iconMoney" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26982" width="16" height="16"><path d="M841.704141 99.863429l-659.418514 0c-45.51666 0-82.417081 36.910655-82.417081 82.437547l0 659.408281c0 45.51666 36.900422 82.427314 82.417081 82.427314l659.418514 0c45.526893 0 82.427314-36.910655 82.427314-82.427314l0-659.408281C924.131455 136.774083 887.231033 99.863429 841.704141 99.863429zM718.058053 429.572686l0 82.427314L553.213657 512l0 82.427314 164.844395 0 0 82.417081L553.213657 676.844395l0 123.646088-82.427314 0 0-123.646088-164.854629 0 0-82.417081 164.854629 0 0-82.427314-164.854629 0 0-82.427314 178.024579 0-219.243353-206.052936 123.646088 0 123.635855 123.625622 123.646088-123.625622 123.635855 0-210.801077 206.052936L718.058053 429.572686z" p-id="26983" fill="#2c2c2c"></path></svg>
          </div>

          <div style="position: relative">
            <input type="number" id="ecpmInput" placeholder="ECPM">
            <span id="ecpmIcon">ECPM</span>
          </div>

  
      </div>
  
      <div>
          <span id="progressTxt">30 videos</span>
          <button id="startBtn" type="button">StartScroll</button>
          <button id="downloadBtn" type="button">DownloadList</button>
  
          <div id="dropdown-menu">
              <button class="action ui-dropper" data-drop="select_drop">Sort▼</button>
              <ul id="select_drop" class="ui-dropdown action-dropdown">
                  <li><button id="sortByNewestBtn">Newest</button></li>
                  <li><button id="sortByViewsBtn">Views</button></li>
                  <li><button id="sortByLikesBtn">Likes</button></li>
                  <li><button id="sortByCommentsBtn">Comments</button></li>
                  <li><button id="sortBySharesBtn">Shares</button></li>
                  <li><button id="sortByCollectionsBtn">Collects</button></li>
              </ul>
          </div>
      </div>
      <div id="selectedController">
          <span id="selectedTxt">0 selected</span>
          <button id="copySelectedBtn" type="button">Copy</button>
          <button id="clearSelectedBtn" type="button">Clear</button>
          <label><input id="showDetailsCheckBox" type="checkbox">ShowInfos</label>
      </div>
  
  </div>

`)

      onElementInserted(document.getElementById('app'), null, (i) => {

        // console.log(i)

        if ($(i).find('[data-e2e=user-post-item]').length > 0) {
          $(i).find('[data-e2e=user-post-item]').each(function () {

            if ($(this).find('.custom-checkbox').length <= 0) {

              let checkBox = $(`
          <label class="custom-checkbox">
              <input class="actual-checkbox" type="checkbox" />
              <span class="checkmark action ui-dropper"></span>
          </label>
          `)

              $(this).append(checkBox)
              checkBox.change(function () {
                let selectCount = $('.custom-checkbox .actual-checkbox:checked').length

                $('#selectedTxt').text(`${selectCount} selected`)
                $('#copySelectedBtn').prop('disabled', !selectCount)
                $('#clearSelectedBtn').prop('disabled', !selectCount)

                if ($(this).find('input').is(':checked')) {
                  console.log('复选框已选中');
                  $(this).closest('[data-e2e=user-post-item]').addClass('user-post-item-selected')
                } else {
                  console.log('复选框未选中');
                  $(this).closest('[data-e2e=user-post-item]').removeClass('user-post-item-selected')
                }
              })
            }
          })
        }

        if ($(i).find('[data-e2e=user-post-item-list]').length > 0) {

          console.log("找到了")

          var showMoreInfo = localStorage.getItem('__show_info') === "true"
          $("#showDetailsCheckBox").prop('checked', showMoreInfo)
          toggleMoreInfo(showMoreInfo)

          // 插入 charts
          if ($("#mycharts").length <= 0) {
            $(i).parent().prepend(`<div id="mycharts"/>`)

            var chartDom = document.getElementById('mycharts');
            window.myChart = echarts.init(chartDom);
  
            console.log("已创建 mychart")
            updateCharts() 
          }
        }

      })



      function toggleMoreInfo(show) {
        if (show) {
          // 显示 more info
          console.log("显示详细信息")
          localStorage.setItem('__show_info', true);
          $('[data-e2e=user-post-item-list]').removeClass('hide-more-info')
        } else {
          // 隐藏 more info
          console.log("隐藏详细信息")
          localStorage.setItem('__show_info', false);
          $('[data-e2e=user-post-item-list]').addClass('hide-more-info')
        }
      }


      $("#showDetailsCheckBox").change(function () {
        toggleMoreInfo(this.checked)
      })





      // 从 storage 里提取上次的价格
      let latestOfferMoney = localStorage.getItem(getCurrTagName() + "_offermoney")
      $('#offerMoney').val(latestOfferMoney)


      $('#offerMoney').on('input', function () {
        var inputValue = $(this).val();

        if (inputValue.length > 6) {
          inputValue = inputValue.slice(0, 6)
          $(this).val(inputValue);
        }

        // 保存到 storage
        let key = getCurrTagName() + "_offermoney"
        localStorage.setItem(key, inputValue)

        calEcpm()
      })

      $('#ecpmInput').on('input', function () {
        calPrice()

        let price = $('#offerMoney').val()
        // 保存到 storage
        let key = getCurrTagName() + "_offermoney"
        localStorage.setItem(key, price)
      })



      $("#clearSelectedBtn").on('click', function () {
        $('.custom-checkbox .actual-checkbox:checked').prop('checked', false);
        updateUI()
      })


      $("#copySelectedBtn").on('click', function (e) {
        let allCheckedBox = $('.custom-checkbox .actual-checkbox:checked')
        let content = []
        allCheckedBox.each(function () {
          let parent = $(this).closest('[data-e2e=user-post-item]');
          let href = parent.find('a').attr('href')
          let info = collectData2[href]
          if (!info) return

          content.push(info)
        })


        var textToCopy = JSON.stringify(content)

        copyToClipboard(e, textToCopy)

        $.toast({
          heading: 'Copied',
          text: 'Please go to DMS to import',
          showHideTransition: 'slide',
          icon: false,
          hideAfter: 5000,
          position: {
            left: 140,
            top: 80,
          },
          bgColor: 'yellow',
          textColor: '#333',
        })
      })



      $("#startBtn").on('click',
        function () {
          console.log("xxxx")

          if (started) {
            endLoad()
          } else {
            startLoad()
          }
        }
      );


      $("#downloadBtn").on('click',
        function () {
          downloadCSV(exepectData(), getCurrTagName() + ".csv")
        }
      );


      function sortVideos(sortBy) {
        $('.ui-dropper').blur();

        let sortedArr = collectData.sort(function (a, b) {
          var nameA = a[sortBy]
          var nameB = b[sortBy]

          if (sortBy == 'publishDate') {
            nameA = +new Date(nameA)
            nameB = +new Date(nameB)
          }

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });


        function findIndex(sortedArr, link) {
          return sortedArr.findIndex(function (item) {
            return item.link === link;
          });
        }



        var container = $('[data-e2e=user-post-item-list]')

        var children = container.children('div');

        children.sort(function (a, b) {
          var hrefA = $(a).find('a').attr('href');
          var hrefB = $(b).find('a').attr('href');
          var indexA = findIndex(sortedArr, hrefA)
          var indexB = findIndex(sortedArr, hrefB)
          return indexB - indexA
        }).appendTo(container);

      }


      $('.ui-dropdown').menu().hide();

      $('#dropdown-menu .ui-dropper').button().click(function () {
        // data-drop value and create ID to target dropdown
        var menu = $('#' + $(this).attr('data-drop'));

        // hide all OTHER dropdowns when we open one
        $('.ui-menu:visible').not('#' + $(this).attr('data-drop')).hide();

        // position the dropdown to the right, so it works on all buttons
        // buttons at far right of screen will have menus flipped inward to avoid viewport collision
        menu.toggle().position({
          my: "left top",
          at: "left bottom",
          of: this
        });
        // on click of the document, close the menus
        $(document).one("click", function () {
          //menu.hide();
          $('.ui-menu:visible').hide();
        });
        return false;
      });


      $("#sortByNewestBtn").on('click',
        function () {
          sortVideos('publishDate')
        }
      );

      $("#sortByViewsBtn").on('click',
        function () {
          sortVideos('playCount')
        }
      );

      $("#sortByLikesBtn").on('click',
        function () {
          sortVideos('diggCount')
        }
      );

      $("#sortByCommentsBtn").on('click',
        function () {
          sortVideos('commentCount')
        }
      );



      $("#sortBySharesBtn").on('click',
        function () {
          sortVideos('shareCount')
        }
      );


      $("#sortByCollectionsBtn").on('click',
        function () {
          sortVideos('collectCount')
        }
      );



      let initCurrTagName = getCurrTagName()

      function onUrlChanged() {

        let currTagName = getCurrTagName()
        if (currTagName != initCurrTagName) {
          collectData = []
          collectData2 = {}
          initCurrTagName = currTagName
          $('.custom-checkbox .actual-checkbox:checked').prop('checked', false);
          updateUI()
        }

      }


      window.addEventListener('popstate', function (event) {
        // 在这里处理 URL 变化事件
        console.log('URL 变化:', event.state);
        onUrlChanged()
      });

      window.addEventListener('pushState', function (e) {
        console.log('change pushState');
        onUrlChanged()
      });

      window.addEventListener('replaceState', function (e) {
        console.log('change replaceState');
        onUrlChanged()
      });


      window.addEventListener('resize', function() {
        if(window.myChart) {
          window.myChart.resize()
        }
      });



      window.addEventListener('click', function (event) {
        var ancestor = $(event.target).closest('[role="tab"]');
        var type = ancestor.data('e2e')

        if(["videos-tab", "repost-tab", "liked-tab"].includes(type)) {
          console.log("切换了 Tab")
          showAllInfo()
        }

      });

    })

  })



})();