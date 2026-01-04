// ==UserScript==
// @name         XHR_INTERCEPTOR
// @version      1.0.0
// @description  XHR请求拦截工具类
// @author       Zosah
// ==/UserScript==

class XMRInterceptor {
        constructor() {
            if (XMRInterceptor.instance) {
                return XMRInterceptor.instance;
            }
            this.interceptors = [];
            XMRInterceptor.instance = this;
        }

        addUrlInterceptor(item) {
            this.interceptors.push(item);
        }

        execute() {
            function xhrInterceptor(callback) {
                // send拦截
                let oldSend = null;
                // 在xhr函数下创建一个回调
                XMLHttpRequest.callbacks = function (xhr) {
                    //调用劫持函数，填入一个function的回调函数
                    //回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
                    xhr.addEventListener("load", function () {
                        if (xhr.readyState == 4 && xhr.status == 200) {
                            callback(xhr);
                        }
                    });
                };
                //获取xhr的send函数，并对其进行劫持
                oldSend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.send = function () {
                    XMLHttpRequest.callbacks(this);
                    //由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
                    oldSend.apply(this, arguments);
                };
            }
            xhrInterceptor((xhr) => {
                for (const item of this.interceptors) {
                    const url = xhr.responseURL.split(item.domain)[1];
                    if (url.indexOf(item.url) !== -1) {
                        item.cb(JSON.parse(xhr.response));
                    }
                }
            });
        }
    }