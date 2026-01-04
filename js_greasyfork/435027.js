// ==UserScript==
// @name         常用油猴函数
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自用
// @author       moxiaoying
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// 睡眠多少秒
async function Sleep(sleepSecs) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, sleepSecs * 1000)
    })
}

// 等待某个函数执行完毕（每多少秒检测一次）
async function WaitUntil(conditionFunc, sleepSecs) {
    sleepSecs = sleepSecs || 1
    return new Promise((resolve, reject) => {
        if (conditionFunc()) resolve()
        let interval = setInterval(() => {
            if (conditionFunc()) {
                clearInterval(interval)
                resolve()
            }
        }, sleepSecs * 1000)
        })
}

// GM_xmlhttpRequest 简单封装
function Request(url, opt = {}) {
    Object.assign(opt, {
        url,
        timeout: 2000,
        responseType: 'json'
    })

    return new Promise((resolve, reject) => {
        opt.onerror = opt.ontimeout = reject
        opt.onload = resolve
        GM_xmlhttpRequest(opt)
    }).then(res => {
        if (res.status === 200) return Promise.resolve(res.response)
        else return Promise.reject(res)
    }, err => {
        return Promise.reject(err)
    })
}

// easy http(s) get
function Get(url, opt = {}) {
    Object.assign(opt, {
        method: 'GET'
    })
    return Request(url, opt)
}

// easy http(s) post
function Post(url, opt = {}) {
    Object.assign(opt, {
        method: 'POST'
    })
    return Request(url, opt)
}

// simple toast
function showToast(msg, doNotFade) {
    let style = `position: fixed; right: 10px; top: 80px; width: 300px; text-align: left; background-color: rgba(255, 255, 255, 0.9); z-index: 99; padding: 10px 20px; border-radius: 5px; color: #222; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); font-weight: bold;`

  let span = document.createElement('span')
  span.setAttribute('style', style)
    span.innerText = msg
    document.body.appendChild(span)
    if (!doNotFade) {
        setTimeout(() => {
            document.body.removeChild(span)
        }, 5000)
    }
}

async function GetElementByText(startElem, selector, text, exist) {
    /*
  selector: 选择器
  text: 内容
  exist: 是否只要存在就ojbk
  */
    exist = exist || false
    let elemList = startElem.querySelectorAll(selector)
    for (let i = 0; i < elemList.length; ++i) {
        let elem = elemList[i]
        if (exist) {
            if (elem.innerText.search(text) !== -1) return elem
        } else {
            if (elem.innerText === text) return elem
        }
    }
}
/**
 * 替换全部匹配到的内容
 * @param FindText  需要查找的字符串
 * @param RepText   将要替换的字符串
 * @returns {string}
 */
String.prototype.replaceAll = function (FindText, RepText) {
    let regExp = new RegExp(FindText, "g");
    return this.replace(regExp, RepText);
}

/**
 * 移除iframe页面元素，用于wifi劫持和去除iframe广告
 */
function removeIframe() {
    let filter = new Object();
    filter.ad = function () {
        let tar = document.getElementsByTagName('iframe');
        let len = tar.length;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                tar[0].remove()
            }
        }
    }
    filter.timer = function () {
        let clean = setInterval(function () {
            if (document.getElementsByTagName('iframe').length == 0) {
                clearInterval(clean)
                console.log('清除')
            } else {
                filter.ad()
            }
        }, 300)
        }
    filter.timer()
}
/**
 * 向页面中添加div
 * @param className   类名
 * @param innerHtml   内容
 * @param clickFunc   点击事件函数
 * @returns {HTMLDivElement}
 */
function loadDiv(className = '', innerHtml = '', clickFunc = false) {
    let div = document.createElement('div')
    div.className = className
    div.innerHTML = innerHtml
    if (typeof clickFunc == 'function') {
        div.onclick = clickFunc
    }
    document.body.append(div)
    return div
}
/**
 * 加载js文件
 * @param url  js文件路径
 * @param callback  加载成功后执行的回调函数
 */
function loadJs(url, callback) {
    let head = document.getElementsByTagName('head')[0];
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    if (typeof (callback) == 'function') {
        script.onload = script.onreadystatechange = function () {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                callback();
                script.onload = script.onreadystatechange = null;
            }
        };
    }
    head.appendChild(script);
}
/**
 * 获取当前URL地址参数
 * @param name  参数名称
 * @returns {string|null}
 */
function getUrlParam(name) {
    let reg = new RegExp("(.|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.href.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
/**
 * 执行函数
 * @param func    函数
 * @param time    延时，负数：延时->执行，正数：执行->延时
 * @param desc
 * @returns {Promise<unknown>}
 */
function obsFunc(func, time = 0, desc = 'func') {
    return new Promise(resolve => {
        if (!!func) {
            if (time < 0) {
                setTimeout(() => {
                    func()
                    console.log(desc)
                    resolve('func')
                }, Math.abs(time) * 1000)
            } else if (time > 0) {
                func()
                setTimeout(() => {
                    console.log(desc)
                    resolve('func')
                }, Math.abs(time) * 1000)
            } else {
                func()
                console.log(desc)
                resolve('func')
            }
        }
    })
}