// ==UserScript==
// @name        ZGDXWSDX-DOWNPDF-NEW-HOOK
// @namespace   Violentmonkey Scripts
// @match       https://kc.zhixueyun.com/
// @match       https://cms.myctu.cn/*
// @grant       none


// @require      https://cdn.bootcss.com/jquery/3.6.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @require      https://lib.baomitu.com/clipboard.js/2.0.6/clipboard.min.js
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js

// @version     0.0.2
// @author      Lordsyman
// @description 专题和课程页面点击右下角的自动播放按钮，可以实现无人值守挂课。考试页面右上方点击允许切屏/复制，可以解开切屏/复制限制，实现PDF自动下载。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453275/ZGDXWSDX-DOWNPDF-NEW-HOOK.user.js
// @updateURL https://update.greasyfork.org/scripts/453275/ZGDXWSDX-DOWNPDF-NEW-HOOK.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    let pdfId = '';

    var ajaxHooker = function() {
    const win = window.unsafeWindow || document.defaultView || window;
    const hookFns = [];
    const xhrProto = win.XMLHttpRequest.prototype;
    const xhrProtoDesc = Object.getOwnPropertyDescriptors(xhrProto);
    const xhrReadyState = xhrProtoDesc.readyState.get;
    const resProto = win.Response.prototype;
    const realXhrOpen = xhrProto.open;
    const realFetch = win.fetch;
    const xhrResponses = ['response', 'responseText', 'responseXML'];
    const fetchResponses = ['arrayBuffer', 'blob', 'formData', 'json', 'text'];
    function emptyFn() {}
    function readOnly(obj, prop, value = obj[prop]) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            enumerable: true,
            get: () => value,
            set: emptyFn
        });
    }
    function writable(obj, prop, value = obj[prop]) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: value
        });
    }
    function fakeXhrOpen(...args) {
        const xhr = this;
        const request = {
            type: 'xhr',
            url: args[1],
            method: args[0].toUpperCase(),
            abort: false,
            headers: null,
            data: null,
            response: null
        };
        for (const fn of hookFns) {
            fn(request);
            if (request.abort) return;
        }
        args[1] = request.url;
        args[0] = request.method;
        const headers = {};
        xhr.setRequestHeader = (header, value) => {
            headers[header] = value;
        }
        xhr.send = function(data) {
            if (typeof request.headers === 'function') {
                request.headers(headers);
            }
            for (const header in headers) {
                xhrProto.setRequestHeader.call(xhr, header, headers[header]);
            }
            if (typeof request.data === 'function') {
                const newData = request.data(data);
                if (newData !== undefined) data = newData;
            }
            return xhrProto.send.call(xhr, data);
        };
        if (typeof request.response === 'function') {
            const arg = {};
            xhrResponses.forEach(prop => {
                Object.defineProperty(xhr, prop, {
                    configurable: true,
                    enumerable: true,
                    get: () => {
                        if (xhrReadyState.call(xhr) === 4) {
                            if (!('finalUrl' in arg)) {
                                arg.finalUrl = xhr.responseURL;
                                arg.status = xhr.status;
                                arg.responseHeaders = {};
                                const arr = xhr.getAllResponseHeaders().trim().split(/[\r\n]+/);
                                for (const line of arr) {
                                    const parts = line.split(/:\s*/);
                                    if (parts.length === 2) {
                                        const lheader = parts[0].toLowerCase();
                                        if (lheader in arg.responseHeaders) {
                                            arg.responseHeaders[lheader] += ', ' + parts[1];
                                        } else {
                                            arg.responseHeaders[lheader] = parts[1];
                                        }
                                    }
                                }
                            }
                            if (!(prop in arg)) {
                                arg[prop] = xhrProtoDesc[prop].get.call(xhr);
                                request.response(arg);
                            }
                        }
                        return prop in arg ? arg[prop] : xhrProtoDesc[prop].get.call(xhr);
                    }
                });
            });
        } else {
            xhrResponses.forEach(prop => {
                delete xhr[prop]; // delete descriptor
            });
        }
        return realXhrOpen.apply(xhr, args);
    }
    function hookFetchResponse(response, arg, callback) {
        fetchResponses.forEach(prop => {
            response[prop] = () => new Promise((resolve, reject) => {
                resProto[prop].call(response).then(res => {
                    if (!(prop in arg)) {
                        arg[prop] = res;
                        callback(arg);
                    }
                    resolve(prop in arg ? arg[prop] : res);
                }, reject);
            });
        });
    }
    function fakeFetch(url, init) {
        if (typeof url === 'string' || url instanceof String) {
            init = init || {};
            const request = {
                type: 'fetch',
                url: url,
                method: (init.method || 'GET').toUpperCase(),
                abort: false,
                headers: null,
                data: null,
                response: null
            };
            for (const fn of hookFns) {
                fn(request);
                if (request.abort) return Promise.reject('aborted');
            }
            url = request.url;
            init.method = request.method;
            if (typeof request.headers === 'function') {
                let headers;
                if (init.headers.toString() === '[object Headers]') {
                    headers = {};
                    for (const [key, val] of init.headers) {
                        headers[key] = val;
                    }
                } else {
                    headers = {...init.headers};
                }
                request.headers(headers);
                init.headers = headers;
            }
            if (typeof request.data === 'function') {
                const data = request.data(init.body);
                if (data !== undefined) init.body = data;
            }
            if (typeof request.response === 'function') {
                return new Promise((resolve, reject) => {
                    realFetch.call(win, url, init).then(response => {
                        const arg = {
                            finalUrl: response.url,
                            status: response.status,
                            responseHeaders: {}
                        };
                        for (const [key, val] of response.headers) {
                            arg.responseHeaders[key] = val;
                        }
                        hookFetchResponse(response, arg, request.response);
                        response.clone = () => {
                            const resClone = resProto.clone.call(response);
                            hookFetchResponse(resClone, arg, request.response);
                            return resClone;
                        };
                        resolve(response);
                    }, reject);
                });
            }
        }
        return realFetch.call(win, url, init);
    }
    xhrProto.open = fakeXhrOpen;
    win.fetch = fakeFetch;
    return {
        hook: fn => hookFns.push(fn),
        protect: () => {
            readOnly(win, 'XMLHttpRequest');
            readOnly(xhrProto, 'open');
            readOnly(win, 'fetch');
        },
        unhook: () => {
            writable(win, 'XMLHttpRequest');
            writable(xhrProto, 'open', realXhrOpen);
            writable(win, 'fetch', realFetch);
        }
    };
}();
    //-------------------------------------------------------------
    ajaxHooker.hook(request => {
        //console.log(request);
        if(request.url.includes('down-encode-auth')){
            pdfId=request.url.substr(39,36)
            console.log('hook request:');
            console.log(request.url);
            console.log(pdfId);
        }
    });


    let $ = window.jQuery

    let swal = window.swal

    let win = window
    let app = window.app

    console.log('win',win)
    console.log('app',app)


    /**
     * 添加自动播放按钮
     */
    function addAutoPlayButton(callback,callbackDownPdf) {
      // 自动播放按钮
      let autoPlayButton = `<div class="item">
        <div id="autoPlay" class="view">
          <i class="iconfont icon-play"></i>
          <div class="text">自动播放</div>
        </div>
      </div>`

      let downPdfButton = `<div class="item">
        <div id="downPdf" class="view">
          <i class="iconfont icon-xiazai"></i>
          <div class="text">DownPDF</div>
        </div>
      </div>`

      // 等待其他按钮加载完成之后，添加自动播放按钮
      let timer = setInterval(function () {
        if ($('#D60toolbarTab .item').length == 3) {
          console.log('🔄添加自动播放按钮')
          $('#D60toolbarTab').append(autoPlayButton)
          // 监听开始按钮点击事件
          $('#D60toolbarTab #autoPlay').click(callback)
          console.log('🔄添加下载PDF按钮')
          $('#D60toolbarTab').append(downPdfButton)
          // 监听开始按钮点击事件
          $('#D60toolbarTab #downPdf').click(callbackDownPdf)

          clearInterval(timer)
        }
      }, 200)


    }


        /**
     * 添加下载PDF按钮
     */
        //  function addAutoPlayButtonPDF(callback) {
        //     // 自动播放按钮
        //     let autoPlayButton = `<div class="item">
        //       <div id="downPdf" class="view">
        //         <i class="iconfont icon-play"></i>
        //         <div class="text">DownLoad PDF</div>
        //       </div>
        //     </div>`


        //     // 等待其他按钮加载完成之后，添加自动播放按钮
        //     let timer = setInterval(function () {
        //       if ($('#D60toolbarTab .item').length == 4) {
        //         console.log('🔄添加下载PDF按钮')
        //         $('#D60toolbarTab').append(autoPlayButton)
        //         // 监听开始按钮点击事件
        //         $('#D60toolbarTab #autoPlay').click(callback)
        //         clearInterval(timer)
        //       }
        //     }, 300)


        //   }


    /**
     * 专题页面功能
     */
    function subjectHelper() {
      // 专题页面
      if (location.hash.match('#/study/subject/detail/')) {
        // 课程列表
        let items = null
        // 当前课程索引
        let currentIdx = -1
        let timer = null
        let opener = window.opener
        // 添加自动播放按钮
        addAutoPlayButton(autoPlay,downPdf)

        // 如果是自动打开的，直接自动播放
        if (opener && opener.isAutoPlay) {
          autoPlay()
          downPdf()
        }

        /**
         * 下载PDF
         */
        function downPdf(){

            let access_token = window.app.global.OAuth.token.access_token;
            console.log('downPdf---------------')
            console.log('access_token---------------',access_token)


            swal({
                text: 'input id',
                content: "input",
                button: {
                  text: "id!",
                  closeModal: false,
                },
              })
              .then(name => {
                window.open(`https://kc.zhixueyun.com/api/v1/human/file/preview/${name}?access_token=${access_token}`)
              })
        }
        /**
         * 自动播放
         */
        function autoPlay() {
          console.log('🔵开始自动播放')
          window.document.title = '🔵开始自动播放'
          window.isAutoPlay = true
          items = $('.subject-catalog .item')
          currentIdx = -1
          playNextCourse()
          checkCurrentCourse()
          // 定时检查当前课程状态
          if (timer) {
            clearInterval(timer)
          }
          timer = setInterval(checkCurrentCourse, 5000)
        }

        /**
         * 播放下一个课程
         */
        function playNextCourse() {
          currentIdx++
          items = $('.subject-catalog .item')

          let item = items.eq(currentIdx)
          if (item.length < 1) {
            return
          }
          let name = item.find('.name-des').text()
          let status = item.find('.operation').text().trim()
          // 已完成当前课程
          if (status == '重新学习') {
            // 全部课程完成
            if (currentIdx == items.length - 1) {
              console.log('✅已完成当前专题下的所有课程')
              window.document.title = '✅已完成当前专题下的所有课程'
              alert('✅已完成当前专题下的所有课程')
              // 通知打开的页面
              if (opener) {
                opener.postMessage('autoPlayComplete')
              }
            }
            // 播放下一个课程
            else {
              playNextCourse()
            }
          }
          // 未完成当前课程
          else {
            console.log(`▶️[${currentIdx + 1}/${items.length}]开始播放【${name}】`)
            item.click()
          }
        }

        // 监听事件
        window.addEventListener('message', function (e) {
          if (e.data == 'autoPlayComplete') {
            console.log('📢接收到课程完成通知，开始播放下一个课程')
            playNextCourse()
          }
        })

        // 检查当前课程状态
        function checkCurrentCourse() {
          items = $('.subject-catalog .item')
          // 课程可能未加载完毕
          if (items.length < currentIdx + 1) {
            return
          }
          let item = items.eq(currentIdx)
          let name = item.find('.name-des').text()
          let status = item.find('.operation').text().trim()

          // 已经完成自动播放下一个课程
          if (status == '重新学习') {
            playNextCourse()
          } else {
            window.document.title = `🟢[${currentIdx + 1}/${items.length}]正在播放【${name}】`
            console.log(`🟢[${currentIdx + 1}/${items.length}]正在播放【${name}】`)
          }
        }
      }
    }

    /**
     * 课程页面功能
     */
    function courseHelper() {
      if (location.hash.match('#/study/course/detail/')) {
        let opener = window.opener
        let timer = null
        // 添加自动播放按钮
        addAutoPlayButton(autoPlay,downPdf)
        // 专题自动播放进入，直接开始自动播放
        console.log(opener)
        if (opener && opener.isAutoPlay) {
          autoPlay()
        }

         /**
         * 下载PDF
         */
          async function downPdf(){

            setTimeout(async ()=>{
                let access_token = window.app.global.OAuth.token.access_token;

                console.log('downPdf---------------')
                console.log('access_token---------------',access_token)
                console.log('window.app',window.app)
                console.log('window',window)


                /**
                let id = await swal({
                    text: 'input id',
                    content: "input",
                    button: {
                      text: "id!",
                      closeModal: true,
                    },
                  });
                  console.log('id',id)
                */

                  window.open(`https://kc.zhixueyun.com/api/v1/human/file/preview/${pdfId}?access_token=${access_token}`)

                //   .then(name => {
                //     console.log(name)
                //     // window.open(`https://kc.zhixueyun.com/api/v1/human/file/preview/${name}?access_token=${access_token}`)
                //     return
                //   })


            },1000)


        }

        /**
         * 自动播放
         */
        function autoPlay() {
          if (window.isAutoPlay) {
            return
          }
          console.log('🔵开始自动播放')
          window.document.title = '🔵开始自动播放'
          window.isAutoPlay = true
          playSection()
          if (timer) {
            clearInterval(timer)
          }
          timer = setInterval(playSection, 5000)
        }

        /**
         * 播放章节
         */
        function playSection() {
          let items = $('.section-arrow .chapter-list-box')

          for (let idx = 0; idx < items.length; idx++) {
            let item = items.eq(idx)
            let name = item.find('.chapter-item').children().eq(1).text().trim()
            let status = item.find('.section-item .pointer').text().trim()
            // 已完成
            if ('重新学习' == status) {
              // 全部完成，通知父页面并关闭当前页面
              if (idx == items.length - 1) {
                if (opener) {
                  opener.postMessage('autoPlayComplete')
                }
                window.close()
              }
            }
            // 未完成
            else {
              // 未播放则点击播放
              let isFocus = item.hasClass('focus')
              if (!isFocus) {
                console.log(`▶️[${idx + 1}/${items.length}]开始播放【${name}】`)
                item.click()
              } else {
                window.document.title = `🟢[${idx + 1}/${items.length}]正在播放【${name}】`
                console.log(`🟢[${idx + 1}/${items.length}]正在播放【${name}】`)
              }
              break
            }
          }

          // 自动禁音播放视频
          let video = document.querySelector('video')
          if (video && video.paused) {
            console.log('⏸视频被暂停，自动禁音恢复播放')
            video.muted = true
            video.play()
          }
        }
      }
    }

    /**
     * 外部链接页面功能
     */
    function externalUrlHelper() {
      // 10 秒后自动关闭外部链接
      if (location.href.match('https://cms.myctu.cn/safe/topic')) {
        let opener = window.opener
        window.document.title = '10秒后关闭此页面'
        setTimeout(function () {
          if (opener) {
            opener.postMessage('autoPlayComplete')
            window.close()
          }
        }, 10000)
      }
    }

    /**
     * 考试页面功能
     */
    function examHelper() {
      if (location.hash.match('#/exam/exam/answer-paper')) {
        let allowSwitchAndCopyButton = `<a id="allowSwitchAndCopy" class="btn block w-half m-top">允许切屏/复制</a>`

        // 添加允许切屏/复制按钮
        let timer = setInterval(function () {
          if ($('.side-main #D165submit').length > 0) {
            $('.side-main #D165submit').parent().prepend(allowSwitchAndCopyButton)
            $('.side-main #allowSwitchAndCopy').click(allowSwitchAndCopy)
            clearInterval(timer)
          }
        }, 200)

        let interval = null
        /**
         * 允许切屏和复制
         */
        function allowSwitchAndCopy() {
          // 允许切屏
          allowSwitch()
          if (interval) {
            clearInterval(interval)
          }
          // 每 500 毫秒监控一次
          interval = setInterval(function () {
            // 允许复制
            allowCopy()
          }, 500)
          alert('允许切屏和复制成功')
        }

        /**
         * 允许切屏
         */
        function allowSwitch() {
          window.onblur = null
          Object.defineProperty(window, 'onblur', {
            set: function (xx) {
              /* 忽略 */
            }
          })
        }

        /**
         * 允许复制
         */
        function allowCopy() {
          let previewContent = document.querySelector('.preview-content')
          previewContent.oncontextmenu = null
          previewContent.oncopy = null
          previewContent.oncut = null
          previewContent.onpaste = null
        }
      }
    }

    setTimeout(()=>{
        app = window.app

        console.log('win',win)
        console.log('app',app)

        // 统一调用助手功能
        subjectHelper()
        courseHelper()
        externalUrlHelper()
        examHelper()

    },3000)


  })()
