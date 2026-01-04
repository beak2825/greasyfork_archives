// ==UserScript==
// @name        新编排系统显示完整用户名和地址
// @match       http://134.95.222.252:10210/portal/
// @grant       none
// @version     1.0
// @run-at       document-start
// @description  2022/12/14 17:43:36
// @namespace https://greasyfork.org/users/8620
// @downloadURL https://update.greasyfork.org/scripts/456564/%E6%96%B0%E7%BC%96%E6%8E%92%E7%B3%BB%E7%BB%9F%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E7%94%A8%E6%88%B7%E5%90%8D%E5%92%8C%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/456564/%E6%96%B0%E7%BC%96%E6%8E%92%E7%B3%BB%E7%BB%9F%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E7%94%A8%E6%88%B7%E5%90%8D%E5%92%8C%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

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
                                        arg.responseHeaders[parts[0].toLowerCase()] = parts[1];
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

(function () {

  'use strict';

  const hookURL = 'http://134.95.222.252:10210/OC-WEB/OC-OAAS/orderMonitorController/qryOrderByEsSearch';
  const hookURL2 = 'http://134.95.222.252:10210/OC-MANUAL/zhengLocalMonitorController/zqRunningOrderMonitor'

  function anotherFetch(id) {
    const form = new URLSearchParams();
    form.append('serviceOrderId', id)
    form.append('workOrderId', id)
    form.append('jsp', 'hlwzxPrint')
    var res;
    $.ajax({
      type: "POST",
      url: "http://134.95.222.252:10210/OC-MANUAL/ocTaskManageControllerLocal/loadDataForPrint.qry",
      data: form,
      processData: false,
      async: false,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        referrer: `http://134.95.222.252:10210/OC-MANUAL/modules/manual/taskManagement/templates/hlwzxPrint.jsp?serviceOrderId=${id}&workOrderId=${id}`,
      },
      success: function (data) {
        res = data
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(errorThrown)
      }
    });
    return res
  }

  function process(row) {
    const result = anotherFetch(row.serviceOrderId)
    if (result) {
      row.custName = result.custName;
      row.installAddress = result.installAddress;
    }
  }

  function process2(row) {
    const result = anotherFetch(row.id)
    if (result) {
      row.custName = result.custName;
      const phone = result.custLinkDesc.match(/\d+(\.\d+)?/g)
      row.linkmanTel = phone ? phone[0] : row.linkmanTel;
    }
  }

  ajaxHooker.hook(request => {
    request.response = value => {
      if (value.finalUrl === hookURL) {
        var data = JSON.parse(value.responseText);
        data.rows.forEach(it => {
          process(it)
        });
        value.responseText = JSON.stringify(data)
      }
      if (value.finalUrl === hookURL2) {
        var data = JSON.parse(value.responseText);
        data.rows.forEach(it => {
          process2(it)
        });
        value.responseText = JSON.stringify(data)
      }
    };
  });

})();