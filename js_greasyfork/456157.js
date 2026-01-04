// ==UserScript==
// @name         TikTok 视频链接
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  填充 Ad Name
// @author       hellocode
// @match        https://ads.tiktok.com/i18n/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant       GM_addStyle
// @run-at       document-end
// @require https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/456157/TikTok%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/456157/TikTok%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==



GM_addStyle(`

  .selectContainer {
    width: 100px;
    height: 29px;
    position: fixed;
    z-index: 99999;
    top: 18px;
    left: 826px;
    display: flex; /* 使用 Flexbox 布局 */
    align-items: center; /* 垂直居中对齐 */
  }

  #selectCountInput {
    background: white;
    color: black;
    border: 1px solid gray;
    border-radius: 5px 0 0 5px;
    height: 100%;
    min-width: 10px;
    flex: 1;
  }


  #selectBtn {
    height: 100%;
    cursor: pointer;
    background: green;
    color: white;
    border: none;
    border-radius: 0 5px 5px 0;
    box-shadow: 1px 1px 10px black;
  }
  
  `);


// Simple in-memory cache
// const xhrCache = {};

// // Utility function to generate a cache key based on URL and method
// function generateCacheKey(method, url, body) {
//     url = url.replace("https://ads.tiktok.com", "")
//     const toBeHashed = `${method}:${url}:${body}`
//     console.log(toBeHashed)
//     const hash = CryptoJS.MD5(toBeHashed).toString();
//     return `mai:${hash}`
// }

// Override the original XMLHttpRequest
// (function() {
//     const originalOpen = XMLHttpRequest.prototype.open;
//     const originalSend = XMLHttpRequest.prototype.send;

//     XMLHttpRequest.prototype.open = function(method, url) {
//         this._method = method;
//         this._url = url;
//         originalOpen.apply(this, arguments);
//     };

//     XMLHttpRequest.prototype.send = function(body) {

//       // console.log("哈哈哈", this._method, this._url);

//       // if (this._url.indexOf("/api/v3/i18n/identity/list_v2") !== -1) {

//       //   const cacheKey = generateCacheKey(this._method, this._url, body);
//       //   console.log("拦截到你啦", this._method, this._url, body, cacheKey);
//       //   this._body = body

//       //   // 从 sessionStorage 中获取缓存的响应
//       //   const cachedResponse = sessionStorage.getItem(cacheKey);

//       //   if (cachedResponse) {
//       //       console.log(`[Cache] Returning cached response for: ${this._url}`);
//       //       const parsedResponse = JSON.parse(cachedResponse);

//       //       // 模拟 readyState 的变化并返回缓存的响应
//       //       this.readyState = 4;
//       //       this.status = 200;
//       //       this.responseText = parsedResponse.responseText;
//       //       this.responseXML = null; // sessionStorage 不能存储 XML 对象

//       //       // 触发 `onload` 和 `onreadystatechange` 事件
//       //       if (typeof this.onload === 'function') {
//       //           this.onload();
//       //       }
//       //       if (typeof this.onreadystatechange === 'function') {
//       //           this.onreadystatechange();
//       //       }

//       //       return;
//       //   }

//       //   // 如果没有缓存，正常发送请求
//       //   this.addEventListener('load', () => {
//       //       // 成功时缓存响应
//       //       if (this.status === 200) {
//       //           const responseToCache = {
//       //               responseText: this.responseText,
//       //               method: this._method,
//       //               url: this._url,
//       //               body: this._body,
//       //           };

//       //           // 将响应数据存入 sessionStorage
//       //           sessionStorage.setItem(cacheKey, JSON.stringify(responseToCache));
//       //           console.log(`[Cache] Caching response for: ${this._url}`);
//       //       }
//       //   });

//       // }

//         originalSend.apply(this, arguments);
//     };
// })();



function onElementInserted(target, elementSelector, callback) {

  if(!target) {
    console.log("没有监听的对象")
    return
  }

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
  return observer
}

function onElementDeleted(target, callback) {

  if(!target) {
    console.log("没有监听的对象")
    return
  }

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
  return observer
}



function scrollToBottom($element) {

  return new Promise((resolve, reject) => {

    let loadingObserve = onElementInserted(document.getElementById('libraryScrollContainer'), null, (i) => {
      if ($(i).hasClass('ttam-library-compose-loading')) {
        console.log("loading.............")
      }
    })

    let loadedObserve = onElementDeleted(document.getElementById('libraryScrollContainer'), (i) => {
      if ($(i).hasClass('ttam-library-compose-loading')) {
        console.log("loaded")
        loadingObserve.disconnect()
        loadedObserve.disconnect()

        resolve()
      }
    })

    // 设置 scrollTop 为 scrollHeight
    $element.scrollTop($element[0].scrollHeight);
  })
}


function scrollElement($container, cbShouldStop, cbOnStoped) {

  if(cbShouldStop()) {
    cbOnStoped()
    return
  }

  scrollToBottom($container).then(() => {
    scrollElement($container, cbShouldStop, cbOnStoped)
  })
}



(() => {
  "use strict";

  console.log('插件代码开始');

    function changeInputValue(elm, text)
    {
      var $input = elm.val(text);
      var ne = document.createEvent('HTMLEvents');
      ne.initEvent('input', true, true);
      $input[0].dispatchEvent(ne);
    }

  function copyToClipboard(e, text) {
    if(!text) return

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

  function for_campaign_create(e)
  {
    console.log('for_campaign_create')
    var curr = $('.creative-content-wrapper:visible div[video-post]')[0] ?? null
    if (curr == null) {
      alert('请先进入 ③ Ad 页面 for_campaign_create')
      return
    }

    var video_info = $('.creative-content-wrapper:visible div[video-post]')[0].__vue__.ad.video_info
    console.log(video_info)
    if (video_info == null) {
      alert('请先选择一个视频')
      return
    }

    var aweme_item_id = video_info.aweme_item_id
    var nick_name = video_info.nick_name
    var video_url = `https://www.tiktok.com/@${nick_name}/video/${aweme_item_id}`
    console.log(video_url)
    //copyToClipboard(e, video_url)


       convertUrl(video_url, (res) => {
           changeInputValue($('.creative-content-wrapper:visible').find('#ad-base-name'), res)
        })
  }

  function for_shopping_create(e)
  {
      console.log('for_shopping_create')
    var curr = $('#creativeDetail')[0] ?? null
    if (curr == null) {
      alert('请先进入 ③ Ad 页面 for_shopping_create')
      return
    }

    var video_info = $('#creativeDetail')[0].__vue__.creativeData.videoInfo
    console.log(JSON.stringify(video_info))
    if (video_info.awemeItemId == null) {
      alert('请先选择一个视频')
      return
    }

    var aweme_item_id = video_info.awemeItemId
    var nick_name = video_info.nickName
    var video_url = `https://www.tiktok.com/@${nick_name}/video/${aweme_item_id}`
    console.log(video_url)
    //copyToClipboard(e, video_url)

       convertUrl(video_url, (res) => {
           changeInputValue($('#ad-base-name'), res)
        })
  }

    function checkIfInAdPage()
    {
        var res = $('.creative-content-wrapper').length || $('#creativeDetail').length
        if(!res) {
            alert("请先进入 ③ Ad 页面")
        }
        return res
    }

    function checkVersion()
    {
        if($('#creativeDetail').length) {
            return "old"
        }
        return "beta"
    }

    function convertUrl(url, cb)
    {
        $('#setUrlBtn').addClass('vi-icon2-loading')
        $.ajax({
            url: url,
            success: function (result) {

                var html = $.parseHTML(result)
                var realUrl = getRealUrlFromSIGI_STATE(html) || getRealUrlFromUNIVERSAL_DATA_FOR_REHYDRATION(html)
                
                if (!realUrl) {
                  alert("无法转换链接")
                } else {
                  cb(realUrl)
                }
            },
            error: function (request, status, error) {
                console.log(request, status, error)
                alert(`${status} : ${request.responseText}`)
            },
            complete: function(){
                $('#setUrlBtn').removeClass('vi-icon2-loading')
            }
        })
    }


    function getRealUrlFromUNIVERSAL_DATA_FOR_REHYDRATION(html) 
    {
      var res = $(html).filter("#__UNIVERSAL_DATA_FOR_REHYDRATION__")
      if (!res.length) {
          return null
      }
      var json = res[0].innerHTML
      json = JSON.parse(json)
      
      var uniqueId = json.__DEFAULT_SCOPE__["webapp.video-detail"].itemInfo.itemStruct.author.uniqueId
      var videoId = json.__DEFAULT_SCOPE__["webapp.video-detail"].itemInfo.itemStruct.id
      console.log(json, uniqueId, videoId)
      var realUrl = "https://www.tiktok.com/@" + uniqueId + "/video/" + videoId
      return realUrl
    }


    function getRealUrlFromSIGI_STATE(html) 
    {
      var res = $(html).filter("#SIGI_STATE")
      if (!res.length) {
          return null
      }
      var json = res[0].innerHTML
      json = JSON.parse(json)
      console.log(json, json.SEOState.metaParams.canonicalHref)
      var realUrl = json.SEOState.metaParams.canonicalHref
      return realUrl
    }



  $(function(){
    console.log("jquery版本号：" + $.fn.jquery);
    $('body').append('<button id="setUrlBtn" style="height: 48px;position: fixed; z-index: 100000; top: 10px;left: 750px;cursor: pointer;background: red;color: white;border: none;border-radius: 5px;box-shadow: 1px 1px 10px black;">设置 URL</button>')


    $('#setUrlBtn').on('click', function(e){
      console.log('点击我干嘛？')

      if(checkIfInAdPage()) {
          if(checkVersion() == "old") {
              for_shopping_create(e)
          } else {
              for_campaign_create(e)
          }
      }
    })

    $('body').append('<div class="selectContainer"><input id="selectCountInput" value=50></input><button id="selectBtn">选中素材</button></div>')

    $('#selectBtn').on('click', function(e){
      console.log('点击我干嘛？')

      let lastSize = 0
      scrollElement($('#libraryScrollContainer'), () => {
        let newSize = $('.ttam-library-list-item').length
        let shouldStop = newSize == lastSize || newSize > $('#selectCountInput').val()
        lastSize = newSize
        return shouldStop
      }, () => {
        console.log("加载完毕了")

        // 清除已选中的
        const parents = $('.ttam-library-list-item').has('.ttam-library-list-item-mask-selected');
        // 输出找到的父元素
        parents.each(function() {
          setTimeout(() => {
            this.__vue__.onClickItem()
          }, 0)
        });

        // 再选择要选中的
        let elements = $('.ttam-library-list-item')

        let lastElement = null
        for (let i=0; i<elements.length && i<$('#selectCountInput').val(); i++) {
          lastElement = elements[i]
          setTimeout(() => {
            elements[i].__vue__.onClickItem()
          }, 0)
        }
        lastElement.scrollIntoView()

      })

    })

  })

})();


