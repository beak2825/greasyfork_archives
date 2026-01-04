// ==UserScript==
// @name        ZGDXWSDX-DOWNPDF
// @namespace   Violentmonkey Scripts
// @match       https://kc.zhixueyun.com/
// @match       https://cms.myctu.cn/*
// @grant       none


// @require      https://cdn.bootcss.com/jquery/3.6.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @require      https://lib.baomitu.com/clipboard.js/2.0.6/clipboard.min.js
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js

// @version     0.0.3
// @author      Lordsyman
// @description 实现PDF自动下载。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453277/ZGDXWSDX-DOWNPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/453277/ZGDXWSDX-DOWNPDF.meta.js
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
    function addAutoPlayButton(callbackDownPdf) {


      let downPdfButton = `<div class="item">
        <div id="downPdf" class="view">
          <i class="iconfont icon-xiazai"></i>
          <div class="text">下载</div>
        </div>
      </div>`

      // 等待其他按钮加载完成之后，添加自动播放按钮
      let timer = setInterval(function () {
          console.log('🔄添加下载PDF按钮')
          $('#D60toolbarTab').append(downPdfButton)
          // 监听开始按钮点击事件
          $('#D60toolbarTab #downPdf').click(callbackDownPdf)

          clearInterval(timer)

        if ($('#D60toolbarTab .item').length == 3) {


          
        }

      }, 200)


    }



    /**
     * 课程页面功能
     */
    function courseHelper() {
      if (location.hash.match('#/study/course/detail/')) {
        let opener = window.opener
        let timer = null
        // 添加自动播放按钮
        addAutoPlayButton(downPdf)
        // 专题自动播放进入，直接开始自动播放
        console.log(opener)
        if (opener && opener.isAutoPlay) {
        //   autoPlay()
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
      }
    }


    setTimeout(()=>{
        app = window.app

        console.log('win',win)
        console.log('app',app)

        // 统一调用助手功能
        courseHelper()

    },3000)


  })()
