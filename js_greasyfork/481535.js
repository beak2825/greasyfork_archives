// ==UserScript==
// @name         TikTok 抓取播放量大的视频链接
// @namespace    http://tampermonkey.net/
// @version      0.8
// @license      MIT
// @description  TikTok 抓取播放量大的视频链接描述
// @author       MaiZhongwen
// @match        https://www.tiktok.com/tag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @run-at       document-start
// @resource    jqueryBaseCSS https://cdn.bootcdn.net/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css
// @resource    jqueryToastCSS https://cdn.bootcdn.net/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.css
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @require https://cdn.bootcdn.net/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @require https://cdn.bootcdn.net/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js
// @require https://cdn.bootcdn.net/ajax/libs/echarts/5.4.2/echarts.common.min.js
// @downloadURL https://update.greasyfork.org/scripts/481535/TikTok%20%E6%8A%93%E5%8F%96%E6%92%AD%E6%94%BE%E9%87%8F%E5%A4%A7%E7%9A%84%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/481535/TikTok%20%E6%8A%93%E5%8F%96%E6%92%AD%E6%94%BE%E9%87%8F%E5%A4%A7%E7%9A%84%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==



function getCurrTagName() {
  let url = decodeURI(window.location.href)
  var regex = /https:\/\/www\.tiktok\.com\/tag\/([^\/]+)/;
  var match = regex.exec(url);

  if (match) {
    return match[1] + '_tag'
  } else {
    return 'tt_tag'
  }
}

function getLastSetCount(tagName) {
  let lastSetCount = window.localStorage.getItem('_lastSetCount') || '{}'
  lastSetCount = JSON.parse(lastSetCount)
  return lastSetCount?.[tagName] || 500000
}

function saveLastSetCount(tagName, count) {
  let lastSetCount = window.localStorage.getItem('_lastSetCount') || '{}'
  lastSetCount = JSON.parse(lastSetCount)
  lastSetCount[tagName] = count
  window.localStorage.setItem('_lastSetCount', JSON.stringify(lastSetCount))
}



let collectData = []


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

  downloadCSV(exepectData(), getCurrTagName() + ".csv")

  updateUI()
}

function exepectData()
{
  let gtCount = $('#countInput').val() || 0

  let rtn = {}
  for (let i of collectData) {
      if (i.playCount > gtCount) {
        rtn[i.link] = i
      }
  }

  return Object.values(rtn)  
}

function updateUI() {

  if (started) {
    $('#startBtn').text("暂停滚动")
  } else {
    $('#startBtn').text("开始滚动")
  }


  let currCount = exepectData().length

  if (loading) {
    $('#progressTxt').text(`${currCount} videos`)
  } else {
    $('#progressTxt').text(`${currCount} videos`)
  }

}


let originalFetch = unsafeWindow.fetch
unsafeWindow.fetch = function (input, init) {
  // 在发送请求之前进行拦截和修改
  // 可以在这里添加你的自定义逻辑

  // 调用原始的 fetch 函数

  // console.log(arguments)

  let url = arguments[0].url

  let keyword = 'https://www.tiktok.com/api/challenge/item_list/'

  if (url && url.indexOf(keyword) >= 0) {
    console.log("拉取列表数据")
    // console.log(arguments)

    loading = true
    updateUI()
  }

  return originalFetch.apply(unsafeWindow, arguments).then(res => {

    if (url && url.indexOf(keyword) >= 0) {
      console.log("返回列表数据")

      // 复制响应流
      const responseCopy = res.clone();
      return responseCopy.json().then(data => {
        console.log(data)

        if(data.statusCode == 0) {

          for (let i of data.itemList) {

            let username = i.author.uniqueId
            let followerCount = i.authorStats.followerCount
            let videoId = i.video.id
            let link = `https://www.tiktok.com/@${username}/video/${videoId}`
  
            let item = {
              tag_url: decodeURI(unsafeWindow.location.href),
              link,
              collectCount: i.stats.collectCount,
              commentCount: i.stats.commentCount,
              diggCount: i.stats.diggCount,
              playCount: i.stats.playCount,
              shareCount: i.stats.shareCount,
              username,
              followerCount,
            }
              
            collectData.push(item)
          }

        }

        if (!data.hasMore) {
          endLoad()
        }

        return res
      }, 
      function (e){
        console.log(e, "报错！")
        return res
      }).finally(() => {
        loading = false
        updateUI()
      })



      // 每 50 个下载一个 csv
      // if(collectData.length % 50 == 1) {
      //   downloadCSV(collectData, "tt_tag.csv")
      // }
    }



    return res
  })
};



var jqueryBaseCSS = GM_getResourceText("jqueryBaseCSS");
GM_addStyle(jqueryBaseCSS);
var jqueryToastCSS = GM_getResourceText("jqueryToastCSS");
GM_addStyle(jqueryToastCSS);


GM_addStyle(`

#crawl {
  z-index: 10000;
  position: fixed;
  top: 8px;
  left: 150px;
}

#crawl input {
  border: 1px solid gray;
  width: 100px;
}

#crawl button {
  color: #005bf7;
}

`);





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


function parseNumberString(numberString) {
  const multipliers = {
    k: 1000,
    m: 1000000,
    b: 1000000000,
  };

  const numericPart = parseFloat(numberString);
  const suffix = numberString.slice(-1).toLowerCase();

  if (suffix in multipliers) {
    return Math.trunc(numericPart * multipliers[suffix]);
  }

  return numericPart;
}


function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
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



(() => {
  "use strict";

  console.log('插件代码开始');



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


  checkAppNodeReady(() => {

    onElementInserted(document.getElementById('app'), null, (i) => {
      let loadingParentDiv = $('#main-content-challenge')
      if (i.nodeName === 'svg' && $(i).parent().parent().parent().is(loadingParentDiv)) {
        console.log("loading", i)
        // 不需要处理
      }
    })


    onElementDeleted(document.getElementById('app'), (i) => {
      if (i.nodeName === 'svg') {
        console.log("loaded", i)
        if (started) {
          scrollTimer = setTimeout(() => {
            startLoad()
          }, 100)
        }
      }
    })


    let lastSetCount = getLastSetCount(getCurrTagName())


    $('body').append(`<div id="crawl">爬取播放量大于<input id="countInput" type="text" value="${lastSetCount}"></input><br><button id="startBtn">开始滚动</button><span id="progressTxt"></span><button id="downloadBtn">Download</button></div>`)

    $("#startBtn").on('click',
      function () {
        console.log("xxxx")

        let lastSetCount = $('#countInput').val() || 500000
        saveLastSetCount(getCurrTagName(), lastSetCount)

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


  })




})();
