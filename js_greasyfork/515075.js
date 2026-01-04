// ==UserScript==
// @name         CBG Helper 修复版
// @namespace    https://yys.zhebu.work/
// @version      0.1.10
// @description  修复 CBG Helper 无法使用的问题，原项目为 https://greasyfork.org/zh-CN/scripts/406264-cbg-helper, 有问题找 灵亦rEd (https://space.bilibili.com/103021226)
// @author       Jie Chu (原作者) & 灵亦rEd（修复和后续更新）
// @match        https://yys.cbg.163.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/515075/CBG%20Helper%20%E4%BF%AE%E5%A4%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/515075/CBG%20Helper%20%E4%BF%AE%E5%A4%8D%E7%89%88.meta.js
// ==/UserScript==
;(function () {
  'use strict'

  // added by lingyired 20250924
  // 注入依赖 ajaxHookerLatest.js
  // 解决 update.greasyfork.org 这个被墙无法访问的问题
  // ------------@require start ------------  
  // https://update.greasyfork.org/scripts/465643/1421695/ajaxHookerLatest.js
    // @name         ajaxHooker
    // @author       cxxjackie
    // @version      1.4.3
    // @supportURL   https://bbs.tampermonkey.net.cn/thread-3284-1-1.html
    // ==/UserScript==
    var ajaxHooker = function() {
        'use strict';
        const version = '1.4.3';
        const hookInst = {
            hookFns: [],
            filters: []
        };
        const win = window.unsafeWindow || document.defaultView || window;
        let winAh = win.__ajaxHooker;
        const resProto = win.Response.prototype;
        const xhrResponses = ['response', 'responseText', 'responseXML'];
        const fetchResponses = ['arrayBuffer', 'blob', 'formData', 'json', 'text'];
        const fetchInitProps = ['method', 'headers', 'body', 'mode', 'credentials', 'cache', 'redirect',
            'referrer', 'referrerPolicy', 'integrity', 'keepalive', 'signal', 'priority'];
        const xhrAsyncEvents = ['readystatechange', 'load', 'loadend'];
        const getType = ({}).toString.call.bind(({}).toString);
        const getDescriptor = Object.getOwnPropertyDescriptor.bind(Object);
        const emptyFn = () => {};
        const errorFn = e => console.error(e);
        function isThenable(obj) {
            return obj && ['object', 'function'].includes(typeof obj) && typeof obj.then === 'function';
        }
        function catchError(fn, ...args) {
            try {
                const result = fn(...args);
                if (isThenable(result)) return result.then(null, errorFn);
                return result;
            } catch (err) {
                console.error(err);
            }
        }
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
        function parseHeaders(obj) {
            const headers = {};
            switch (getType(obj)) {
                case '[object String]':
                    for (const line of obj.trim().split(/[\r\n]+/)) {
                        const [header, value] = line.split(/\s*:\s*/);
                        if (!header) break;
                        const lheader = header.toLowerCase();
                        headers[lheader] = lheader in headers ? `${headers[lheader]}, ${value}` : value;
                    }
                    break;
                case '[object Headers]':
                    for (const [key, val] of obj) {
                        headers[key] = val;
                    }
                    break;
                case '[object Object]':
                    return {...obj};
            }
            return headers;
        }
        function stopImmediatePropagation() {
            this.ajaxHooker_isStopped = true;
        }
        class SyncThenable {
            then(fn) {
                fn && fn();
                return new SyncThenable();
            }
        }
        class AHRequest {
            constructor(request) {
                this.request = request;
                this.requestClone = {...this.request};
            }
            shouldFilter(filters) {
                const {type, url, method, async} = this.request;
                return filters.length && !filters.find(obj => {
                    switch (true) {
                        case obj.type && obj.type !== type:
                        case getType(obj.url) === '[object String]' && !url.includes(obj.url):
                        case getType(obj.url) === '[object RegExp]' && !obj.url.test(url):
                        case obj.method && obj.method.toUpperCase() !== method.toUpperCase():
                        case 'async' in obj && obj.async !== async:
                            return false;
                    }
                    return true;
                });
            }
            waitForRequestKeys() {
                const requestKeys = ['url', 'method', 'abort', 'headers', 'data'];
                if (!this.request.async) {
                    win.__ajaxHooker.hookInsts.forEach(({hookFns, filters}) => {
                        if (this.shouldFilter(filters)) return;
                        hookFns.forEach(fn => {
                            if (getType(fn) === '[object Function]') catchError(fn, this.request);
                        });
                        requestKeys.forEach(key => {
                            if (isThenable(this.request[key])) this.request[key] = this.requestClone[key];
                        });
                    });
                    return new SyncThenable();
                }
                const promises = [];
                win.__ajaxHooker.hookInsts.forEach(({hookFns, filters}) => {
                    if (this.shouldFilter(filters)) return;
                    promises.push(Promise.all(hookFns.map(fn => catchError(fn, this.request))).then(() => 
                        Promise.all(requestKeys.map(key => Promise.resolve(this.request[key]).then(
                            val => this.request[key] = val,
                            () => this.request[key] = this.requestClone[key]
                        )))
                    ));
                });
                return Promise.all(promises);
            }
            waitForResponseKeys(response) {
                const responseKeys = this.request.type === 'xhr' ? xhrResponses : fetchResponses;
                if (!this.request.async) {
                    if (getType(this.request.response) === '[object Function]') {
                        catchError(this.request.response, response);
                        responseKeys.forEach(key => {
                            if ('get' in getDescriptor(response, key) || isThenable(response[key])) {
                                delete response[key];
                            }
                        });
                    }
                    return new SyncThenable();
                }
                return Promise.resolve(catchError(this.request.response, response)).then(() =>
                    Promise.all(responseKeys.map(key => {
                        const descriptor = getDescriptor(response, key);
                        if (descriptor && 'value' in descriptor) {
                            return Promise.resolve(descriptor.value).then(
                                val => response[key] = val,
                                () => delete response[key]
                            );
                        } else {
                            delete response[key];
                        }
                    }))
                );
            }
        }
        const proxyHandler = {
            get(target, prop) {
                const descriptor = getDescriptor(target, prop);
                if (descriptor && !descriptor.configurable && !descriptor.writable && !descriptor.get) return target[prop];
                const ah = target.__ajaxHooker;
                if (ah && ah.proxyProps) {
                    if (prop in ah.proxyProps) {
                        const pDescriptor = ah.proxyProps[prop];
                        if ('get' in pDescriptor) return pDescriptor.get();
                        if (typeof pDescriptor.value === 'function') return pDescriptor.value.bind(ah);
                        return pDescriptor.value;
                    }
                    if (typeof target[prop] === 'function') return target[prop].bind(target);
                }
                return target[prop];
            },
            set(target, prop, value) {
                const descriptor = getDescriptor(target, prop);
                if (descriptor && !descriptor.configurable && !descriptor.writable && !descriptor.set) return true;
                const ah = target.__ajaxHooker;
                if (ah && ah.proxyProps && prop in ah.proxyProps) {
                    const pDescriptor = ah.proxyProps[prop];
                    pDescriptor.set ? pDescriptor.set(value) : (pDescriptor.value = value);
                } else {
                    target[prop] = value;
                }
                return true;
            }
        };
        class XhrHooker {
            constructor(xhr) {
                const ah = this;
                Object.assign(ah, {
                    originalXhr: xhr,
                    proxyXhr: new Proxy(xhr, proxyHandler),
                    resThenable: new SyncThenable(),
                    proxyProps: {},
                    proxyEvents: {}
                });
                xhr.addEventListener('readystatechange', e => {
                    if (ah.proxyXhr.readyState === 4 && ah.request && typeof ah.request.response === 'function') {
                        const response = {
                            finalUrl: ah.proxyXhr.responseURL,
                            status: ah.proxyXhr.status,
                            responseHeaders: parseHeaders(ah.proxyXhr.getAllResponseHeaders())
                        };
                        const tempValues = {};
                        for (const key of xhrResponses) {
                            try {
                                tempValues[key] = ah.originalXhr[key];
                            } catch (err) {}
                            defineProp(response, key, () => {
                                return response[key] = tempValues[key];
                            }, val => {
                                delete response[key];
                                response[key] = val;
                            });
                        }
                        ah.resThenable = new AHRequest(ah.request).waitForResponseKeys(response).then(() => {
                            for (const key of xhrResponses) {
                                ah.proxyProps[key] = {get: () => {
                                    if (!(key in response)) response[key] = tempValues[key];
                                    return response[key];
                                }};
                            }
                        });
                    }
                    ah.dispatchEvent(e);
                });
                xhr.addEventListener('load', e => ah.dispatchEvent(e));
                xhr.addEventListener('loadend', e => ah.dispatchEvent(e));
                for (const evt of xhrAsyncEvents) {
                    const onEvt = 'on' + evt;
                    ah.proxyProps[onEvt] = {
                        get: () => ah.proxyEvents[onEvt] || null,
                        set: val => ah.addEvent(onEvt, val)
                    };
                }
                for (const method of ['setRequestHeader', 'addEventListener', 'removeEventListener', 'open', 'send']) {
                    ah.proxyProps[method] = {value: ah[method]};
                }
            }
            toJSON() {} // Converting circular structure to JSON
            addEvent(type, event) {
                if (type.startsWith('on')) {
                    this.proxyEvents[type] = typeof event === 'function' ? event : null;
                } else {
                    if (typeof event === 'object' && event !== null) event = event.handleEvent;
                    if (typeof event !== 'function') return;
                    this.proxyEvents[type] = this.proxyEvents[type] || new Set();
                    this.proxyEvents[type].add(event);
                }
            }
            removeEvent(type, event) {
                if (type.startsWith('on')) {
                    this.proxyEvents[type] = null;
                } else {
                    if (typeof event === 'object' && event !== null) event = event.handleEvent;
                    this.proxyEvents[type] && this.proxyEvents[type].delete(event);
                }
            }
            dispatchEvent(e) {
                e.stopImmediatePropagation = stopImmediatePropagation;
                defineProp(e, 'target', () => this.proxyXhr);
                defineProp(e, 'currentTarget', () => this.proxyXhr);
                this.proxyEvents[e.type] && this.proxyEvents[e.type].forEach(fn => {
                    this.resThenable.then(() => !e.ajaxHooker_isStopped && fn.call(this.proxyXhr, e));
                });
                if (e.ajaxHooker_isStopped) return;
                const onEvent = this.proxyEvents['on' + e.type];
                onEvent && this.resThenable.then(onEvent.bind(this.proxyXhr, e));
            }
            setRequestHeader(header, value) {
                this.originalXhr.setRequestHeader(header, value);
                if (!this.request) return;
                const headers = this.request.headers;
                headers[header] = header in headers ? `${headers[header]}, ${value}` : value;
            }
            addEventListener(...args) {
                if (xhrAsyncEvents.includes(args[0])) {
                    this.addEvent(args[0], args[1]);
                } else {
                    this.originalXhr.addEventListener(...args);
                }
            }
            removeEventListener(...args) {
                if (xhrAsyncEvents.includes(args[0])) {
                    this.removeEvent(args[0], args[1]);
                } else {
                    this.originalXhr.removeEventListener(...args);
                }
            }
            open(method, url, async = true, ...args) {
                this.request = {
                    type: 'xhr',
                    url: url.toString(),
                    method: method.toUpperCase(),
                    abort: false,
                    headers: {},
                    data: null,
                    response: null,
                    async: !!async
                };
                this.openArgs = args;
                this.resThenable = new SyncThenable();
                ['responseURL', 'readyState', 'status', 'statusText', ...xhrResponses].forEach(key => {
                    delete this.proxyProps[key];
                });
                return this.originalXhr.open(method, url, async, ...args);
            }
            send(data) {
                const ah = this;
                const xhr = ah.originalXhr;
                const request = ah.request;
                if (!request) return xhr.send(data);
                request.data = data;
                new AHRequest(request).waitForRequestKeys().then(() => {
                    if (request.abort) {
                        if (typeof request.response === 'function') {
                            Object.assign(ah.proxyProps, {
                                responseURL: {value: request.url},
                                readyState: {value: 4},
                                status: {value: 200},
                                statusText: {value: 'OK'}
                            });
                            xhrAsyncEvents.forEach(evt => xhr.dispatchEvent(new Event(evt)));
                        }
                    } else {
                        xhr.open(request.method, request.url, request.async, ...ah.openArgs);
                        for (const header in request.headers) {
                            xhr.setRequestHeader(header, request.headers[header]);
                        }
                        xhr.send(request.data);
                    }
                });
            }
        }
        function fakeXHR() {
            const xhr = new winAh.realXHR();
            if ('__ajaxHooker' in xhr) console.warn('检测到不同版本的ajaxHooker，可能发生冲突！');
            xhr.__ajaxHooker = new XhrHooker(xhr);
            return xhr.__ajaxHooker.proxyXhr;
        }
        fakeXHR.prototype = win.XMLHttpRequest.prototype;
        Object.keys(win.XMLHttpRequest).forEach(key => fakeXHR[key] = win.XMLHttpRequest[key]);
        function fakeFetch(url, options = {}) {
            if (!url) return winAh.realFetch.call(win, url, options);
            return new Promise(async (resolve, reject) => {
                const init = {};
                if (getType(url) === '[object Request]') {
                    for (const prop of fetchInitProps) init[prop] = url[prop];
                    if (url.body) init.body = await url.arrayBuffer();
                    url = url.url;
                }
                url = url.toString();
                Object.assign(init, options);
                init.method = init.method || 'GET';
                init.headers = init.headers || {};
                const request = {
                    type: 'fetch',
                    url: url,
                    method: init.method.toUpperCase(),
                    abort: false,
                    headers: parseHeaders(init.headers),
                    data: init.body,
                    response: null,
                    async: true
                };
                const req = new AHRequest(request);
                await req.waitForRequestKeys();
                if (request.abort) {
                    if (typeof request.response === 'function') {
                        const response = {
                            finalUrl: request.url,
                            status: 200,
                            responseHeaders: {}
                        };
                        await req.waitForResponseKeys(response);
                        const key = fetchResponses.find(k => k in response);
                        let val = response[key];
                        if (key === 'json' && typeof val === 'object') {
                            val = catchError(JSON.stringify.bind(JSON), val);
                        }
                        const res = new Response(val, {
                            status: 200,
                            statusText: 'OK'
                        });
                        defineProp(res, 'type', () => 'basic');
                        defineProp(res, 'url', () => request.url);
                        resolve(res);
                    } else {
                        reject(new DOMException('aborted', 'AbortError'));
                    }
                    return;
                }
                init.method = request.method;
                init.headers = request.headers;
                init.body = request.data;
                winAh.realFetch.call(win, request.url, init).then(res => {
                    if (typeof request.response === 'function') {
                        const response = {
                            finalUrl: res.url,
                            status: res.status,
                            responseHeaders: parseHeaders(res.headers)
                        };
                        fetchResponses.forEach(key => res[key] = function() {
                            if (key in response) return Promise.resolve(response[key]);
                            return resProto[key].call(this).then(val => {
                                response[key] = val;
                                return req.waitForResponseKeys(response).then(() => key in response ? response[key] : val);
                            });
                        });
                    }
                    resolve(res);
                }, reject);
            });
        }
        function fakeFetchClone() {
            const descriptors = Object.getOwnPropertyDescriptors(this);
            const res = winAh.realFetchClone.call(this);
            Object.defineProperties(res, descriptors);
            return res;
        }
        winAh = win.__ajaxHooker = winAh || {
            version, fakeXHR, fakeFetch, fakeFetchClone,
            realXHR: win.XMLHttpRequest,
            realFetch: win.fetch,
            realFetchClone: resProto.clone,
            hookInsts: new Set()
        };
        if (winAh.version !== version) console.warn('检测到不同版本的ajaxHooker，可能发生冲突！');
        win.XMLHttpRequest = winAh.fakeXHR;
        win.fetch = winAh.fakeFetch;
        resProto.clone = winAh.fakeFetchClone;
        winAh.hookInsts.add(hookInst);
        return {
            hook: fn => hookInst.hookFns.push(fn),
            filter: arr => {
                if (Array.isArray(arr)) hookInst.filters = arr;
            },
            protect: () => {
                readonly(win, 'XMLHttpRequest', winAh.fakeXHR);
                readonly(win, 'fetch', winAh.fakeFetch);
                readonly(resProto, 'clone', winAh.fakeFetchClone);
            },
            unhook: () => {
                winAh.hookInsts.delete(hookInst);
                if (!winAh.hookInsts.size) {
                    writable(win, 'XMLHttpRequest', winAh.realXHR);
                    writable(win, 'fetch', winAh.realFetch);
                    writable(resProto, 'clone', winAh.realFetchClone);
                    delete win.__ajaxHooker;
                }
            }
        };
    }();
    // ------------@require end ------------



  let panel_class_name = 'content-overview'
  let acct_info = {
    ready: false
  }
  window.ling3 = acct_info
  let FRAC_N = 5
  let url_get_equip_detail = '/cgi/api/get_equip_detail'
  let url_get_equip_desc = '/cgi/api/get_equip_desc' // added by LingErEd
  let suit_imp = ['散件', '招财猫', '火灵', '蚌精', '共潜', '遗念火'] // 重要套装，可自行添加
  let suit_by_props = {
    暴击伤害: ['无刀取'],
    暴击: [
      '针女',
      '三味',
      '网切',
      '伤魂鸟',
      '破势',
      '镇墓兽',
      '青女房',
      '海月火玉'
    ],
    攻击加成: [
      '蝠翼',
      '轮入道',
      '狰',
      '鸣屋',
      '心眼',
      '阴摩罗',
      '狂骨',
      '兵主部',
      '贝吹坊'
    ],
    防御加成: [
      '珍珠',
      '魅妖',
      '雪幽魂',
      '招财猫',
      '反枕',
      '日女巳时',
      '木魅',
      '出世螺',
      '奉海图'
    ],
    生命加成: [
      '地藏像',
      '涅槃之火',
      '被服',
      '镜姬',
      '钟灵',
      '薙魂',
      '树妖',
      '涂佛',
      '恶楼'
    ],
    效果抵抗: ['骰子鬼', '返魂香', '魍魉之匣', '幽谷响', '共潜'],
    效果命中: ['蚌精', '火灵', '飞缘魔', '遗念火'],
    首领御魂: [
      '土蜘蛛',
      '胧车',
      '荒骷髅',
      '地震鲶',
      '蜃气楼',
      '鬼灵歌伎',
      '夜荒魂'
    ]
  }
  // eslint-disable-next-line no-undef
  ajaxHooker.hook(request => {
    let originalResponse = request.response
    if (request.url.startsWith(url_get_equip_detail)) {
      console.log('ajaxHooker url_get_equip_detail')
      request.response = res => {
        if (res.status == 200) {
          // console.log(res.responseText);
          const data = JSON.parse(res.responseText)
          window.ling2 = data
          floatify(data, 'url_get_equip_detail')
        }
        if (originalResponse)
          try {
            originalResponse.apply(this, [res])
          } catch (error) {}
      }
    }
    if (request.url.startsWith(url_get_equip_desc)) {
      console.log('ajaxHooker url_get_equip_desc')
      request.response = res => {
        if (res.status == 200) {
          // const data = JSON.parse(res.responseText)
          window.ling1 = JSON.parse(res.json.equip_desc)
          floatify(
            {
              equip: res.json
            },
            'url_get_equip_desc'
          )
        }
        if (originalResponse)
          try {
            originalResponse.apply(this, [res])
          } catch (error) {}
      }
    }
  })

  function nowrapText (textLabel) {
    return `<span class="cbghelper_nowrap">${textLabel}</span>`
  }

  function addExtendedHighlight () {
    if (
      document.getElementById('cbghelper_exthighlight') ||
      !acct_info.hasOwnProperty('summary')
    ) {
      return
    }
    let { fastest, heads, feet, hero_info } = acct_info.summary
    let itms = []
    let build_item = function (label, id) {
      let li = document.createElement('li')
      li.innerText = label
      return li
    }
    //collection of heros
    let total = hero_info['ssr']['all'] + hero_info['sp']['all']
    let got_total = hero_info['ssr']['got'] + hero_info['sp']['got']
    if (total === got_total) {
      itms.push(build_item('SSR/SP全收集'))
    } else if (hero_info['ssr']['all'] === hero_info['ssr']['got']) {
      itms.push(build_item('SSR全收集'))
    }
    if (hero_info['x']['all'] === hero_info['x']['got']) {
      itms.push(build_item('联动全收集'))
    }

    // edited by 灵亦rEd (https://space.bilibili.com/103021226)
    // 几头几尾和散件一速以及招财一速现在默认有显示了

    //number of heads and feet
    // if (heads.length > 0 || feet.length > 0) {
    //     let x = heads.length > 0 ? heads.length : '无';
    //     let y = feet.length > 0 ? feet.length : '无';
    //     let label = `${x}头${y}脚`;
    //     itms.push(build_item(label))
    // }
    // //fastest speed
    // let fastest_spd_label = `最快一速${[1, 2, 3, 4, 5, 6].reduce((total, p) => total + fastest[p]['散件'], 0).toFixed(2)}`;
    // let fastest_spd = build_item(fastest_spd_label)
    // fastest_spd.id = 'cbghelper_exthighlight';
    // itms.push(fastest_spd);
    // //fastest zhaocai speed
    // let zc_spd_val = [1, 2, 3, 4, 5, 6].reduce((total, p) => total + fastest[p]['招财猫'], 0);
    // let spd_inc = [1, 2, 3, 4, 5, 6].map(p => fastest[p]['散件'] - fastest[p]['招财猫'], 0);
    // spd_inc.sort((a, b) => b - a);
    // zc_spd_val += spd_inc[0] + spd_inc[1];
    // let zc_spd_label = `招财一速${zc_spd_val.toFixed(2)}`;
    // itms.push(build_item(zc_spd_label));

    // added by 灵亦rEd (https://space.bilibili.com/103021226)
    // 显示黑蛋
    let blackEggCount =
      acct_info?.acctHighlight?.damo_count_dict?.[2]?.[411] || 0
    //  el
    let blackEggCountLabel = `御行达摩${blackEggCount}个`
    let blackEggCountEl = build_item(blackEggCountLabel)
    blackEggCountEl.id = 'cbghelper_exthighlight'
    itms.push(blackEggCountEl)

    // 显示魂玉
    let hunyu = acct_info?.acctHighlight?.hunyu || 0
    //  el
    let hunyuLabel = `魂玉${hunyu}个`
    itms.push(build_item(hunyuLabel))

    // 太鼓
    let taigu = acct_info?.acctHighlight?.lbscards?.[200036]?.num || 0
    //  el
    let taiguL = `太鼓${taigu}个`
    itms.push(build_item(taiguL))

    // 庭院皮肤
    let yardSkin = acct_info?.acctHighlight?.skin?.yard?.length || 0
    itms.push(build_item(`庭院皮肤${yardSkin}个`))

    // 召唤屋皮肤
    let gambleSkin = acct_info?.acctHighlight?.skin?.gamble?.length || 0
    itms.push(build_item(`召唤屋皮肤${gambleSkin}个`))

    // 幕间皮肤
    let shishenluSkin = acct_info?.acctHighlight?.skin?.shishenlu?.length || 0
    itms.push(build_item(`幕间皮肤${shishenluSkin}个`))

    // 战斗
    let battleSkin = acct_info?.acctHighlight?.skin?.battle?.length || 0
    itms.push(build_item(`战斗皮肤${battleSkin}个`))

    // 在 skin 项目中找到符合名字的 items
    // 用于找到臻藏皮肤的个数
    function findItemsWithKeywordInSkin (dataArray, keyword) {
      if (!Array.isArray(dataArray)) {
        return []
      }
      return dataArray.filter(item => {
        // 确保子数组存在第二个元素，并且是字符串类型
        return (
          item[1] && typeof item[1] === 'string' && item[1].includes(keyword)
        )
      })
    }
    try {
      //  臻藏皮肤的个数
      let ssSkins = acct_info?.acctHighlight?.skin?.ss
      let zcSkins = findItemsWithKeywordInSkin(ssSkins, '臻藏')
      itms.push(build_item(`臻藏皮肤${zcSkins.length}个`))
    } catch (error) {
      console.log('臻藏皮肤获取失败')
    }

    try {
      //  藏金台阁
      let battleSkins = acct_info?.acctHighlight?.skin?.battle
      let zangjin = findItemsWithKeywordInSkin(battleSkins, '藏金台阁')
      if (zangjin && zangjin.length) itms.push(build_item(`藏金台阁`))
    } catch (error) {
      console.log('藏金台阁皮肤获取失败')
    }
    // 八岐大蛇鳞片
    let dashe = acct_info?.acctHighlight?.currency_900216 || 0
    //  el
    let dasheLabel = `八岐大蛇鳞片${dashe}个`
    itms.push(build_item(dasheLabel))

    // 大蛇的逆鳞
    let jindashe = acct_info?.acctHighlight?.currency_900217 || 0
    //  el
    let jindasheL = `大蛇的逆鳞${jindashe}个`
    itms.push(build_item(jindasheL))

    let highlight = document.getElementsByClassName('highlight')[0]
    let newHighlight = document.createElement('ul')
    // newHighlight 添加 class name highlight
    newHighlight.className = 'highlight new-highlight'
    for (let li of itms) {
      newHighlight.appendChild(li)
    }
    // 将 newHighlight 插入到 highlight 后面
    highlight.parentNode.insertBefore(newHighlight, highlight.nextSibling)
  }

  function summaryPage () {
    let wrapper = document.createElement('div')
    wrapper.classList.add('module')
    if (!acct_info.hasOwnProperty('summary')) {
      wrapper.appendChild(
        document.createTextNode('数据加载出错，请尝试刷新页面')
      )
      return wrapper
    }
    let decimal = 2
    let { fastest, heads, feet, fullspd_cnt } = acct_info.summary
    let fullspd_suit = Object.fromEntries(suit_imp.map(name => [name, 0]))
    fastest = JSON.parse(JSON.stringify(fastest)) // make a deep copy
    let suit_stats = {}
    for (let p of [1, 2, 3, 4, 5, 6]) {
      for (let name in fullspd_cnt[p]) {
        if (fullspd_suit[name] === 0) {
          continue
        }
        if (name in suit_stats) {
          suit_stats[name].push(p)
        } else {
          suit_stats[name] = [p]
        }
      }
    }
    for (let name in suit_stats) {
      if (suit_stats[name].length >= 4) {
        if (name in fullspd_suit) {
          continue
        } else {
          fullspd_suit[name] = 0
        }
      }
    }
    let fast_suit_speed = function (name) {
      let suit_fastest = Object.fromEntries(
        [1, 2, 3, 4, 5, 6].map(p => [
          p,
          name in fastest[p] ? fastest[p][name] : 0
        ])
      )
      let suit_spd_val = [1, 2, 3, 4, 5, 6].reduce(
        (total, p) => total + suit_fastest[p],
        0
      )
      let spd_inc = [1, 2, 3, 4, 5, 6].map(
        p => fastest[p]['散件'] - suit_fastest[p]
      )
      spd_inc.sort((a, b) => b - a)
      suit_spd_val += spd_inc[0] + spd_inc[1]
      return suit_spd_val
    }
    Object.keys(fullspd_suit).forEach(name => {
      fullspd_suit[name] = fast_suit_speed(name)
    })

    let sortByValue = function (a, b) {
      return b.value - a.value
    }
    let headStr =
      heads.length > 0
        ? heads
            .sort(sortByValue)
            .map(itm =>
              `<span class="data-value">${itm.name}: ${itm.value.toFixed(
                decimal
              )}</span>`.trim()
            )
            .join(', ')
        : '无'
    let feetStr =
      feet.length > 0
        ? feet
            .sort(sortByValue)
            .map(itm =>
              `<span class="data-value">${itm.name}: ${itm.value.toFixed(
                decimal
              )}</span>`.trim()
            )
            .join(', ')
        : '无'
    let td_val = function (pos, name) {
      let fullspd = fullspd_cnt[pos][name] > 0
      let spd = name in fastest[pos] ? fastest[pos][name].toFixed(decimal) : 0
      let res = `<span${fullspd ? '' : ' class=disabled'}>${spd}</span> `
      if (fullspd) {
        res += nowrapText(`(${fullspd_cnt[pos][name]})`)
      }
      return res
    }
    Object.keys(fastest[2]).forEach(
      k => (fastest[2][k] = fastest[2][k] - 57 > 0 ? fastest[2][k] - 57 : 0)
    )
    let speed_summary = function (name) {
      return `<tr> <td>${name}</td> ${[1, 2, 3, 4, 5, 6, 7].map(
        i => `<td>${td_val(i, name)}</td>`
      )} </tr>`
    }
    let fastest_tbl = `<table width="100%">
        <tr> <th>位置</th> ${[1, 2, 3, 4, 5, 6].map(
          i => `<th>${i}</th>`
        )} <th>4${nowrapText('(命中)')}</th> </tr>
        ${Object.keys(fullspd_suit)
          .map(name => speed_summary(name))
          .join(' ')}
    </table>`
    let suit_table = `<table width="100%">
        <tr> <th>御魂名称</th> <th>套装一速</th></tr>
        ${Object.keys(fullspd_suit)
          .map(
            name =>
              `<tr> <th>${name}</th> <td>${fullspd_suit[name].toFixed(
                5
              )}</td></tr>\n`
          )
          .join('')}
    </table>`

    let title = document.createElement('div')
    title.classList.add('title')
    title.innerText = '御魂亮点'
    let spd = document.createElement('section')
    spd.innerHTML = `<div><span class="data-name">头:</span> ${headStr} </div>
    <div><span class="data-name">脚:</span> ${feetStr} </div>`
    let title2 = document.createElement('div')
    title2.innerText = '套装一速(非独立)'
    title2.classList.add('title')
    let suit = document.createElement('section')
    suit.innerHTML = suit_table

    let title3 = document.createElement('div')
    title3.innerText = '各位置一速(满速个数)'
    title3.classList.add('title')

    let fastest_sec = document.createElement('section')
    fastest_sec.innerHTML = fastest_tbl
    if (fastest_sec.firstChild.nodeType === Node.TEXT_NODE) {
      fastest_sec.firstChild.textContent = ''
    }

    wrapper.appendChild(title)
    wrapper.appendChild(spd)
    wrapper.appendChild(title2)
    wrapper.appendChild(suit)
    wrapper.appendChild(title3)
    wrapper.appendChild(fastest_sec)
    return wrapper
  }

  function addHighlightView () {
    if (document.getElementById('cbghelper_highlight')) {
      return
    }
    let div = document.createElement('div')
    div.id = 'cbghelper_highlight'
    div.class = 'module'
    div.appendChild(summaryPage())
    let wrapper = document.getElementsByClassName(panel_class_name)[0]
    wrapper.appendChild(div)
  }

  function addDownloadBtn () {
    if (document.getElementById('cbghelper_download')) {
      return
    }
    let b = document.createElement('a')
    b.innerText = '(💾保存为JSON)'
    b.onclick = function () {
      console.log('To save data!')
      saveToJsonHelper()
    }
    b.id = 'cbghelper_download'
    b.style.cursor = 'pointer'
    let yuhun_list = document.getElementsByClassName('content-top-left')[0]
    yuhun_list.getElementsByTagName('h3')[1].appendChild(b)
  }

  function addDownloadBtnWrapper () {
    if (document.getElementsByClassName('yuhun-list').length) {
      addDownloadBtn()
    }
  }

  function addExtHighlightWrapper () {
    if (document.getElementsByClassName('highlight').length) {
      addExtendedHighlight()
    }
  }

  function addHighlightViewWrapper () {
    if (
      document.getElementsByClassName(panel_class_name).length &&
      acct_info.ready
    ) {
      addHighlightView()
    }
  }

  function init () {
    let checkfn_list = {
      cbghelper_download: addDownloadBtnWrapper,
      cbghelper_exthighlight: addExtHighlightWrapper,
      cbghelper_highlight: addHighlightViewWrapper
    }
    let handlers = {}

    let checkExist = setInterval(function () {
      if (!document.URL.startsWith('https://yys.cbg.163.com/cgi/mweb/equip')) {
        return
      }
      for (let eid of Object.keys(checkfn_list)) {
        if (document.getElementById(eid) && eid in handlers) {
          clearInterval(handlers[eid])
          delete handlers[eid]
        } else if (document.getElementById(eid) || eid in handlers) {
          continue
        } else {
          handlers[eid] = setInterval(checkfn_list[eid], 200)
        }
      }
    }, 100)
  }

  init()
  const floatify = function (data, type) {
    console.log('floatify', data)
    let equip = data['equip']
    // 如果没有 equip_desc 则返回
    if (!equip.hasOwnProperty('equip_desc')) {
      console.log('No equip_desc, from', type)
      return data
    }
    let acct_detail = JSON.parse(equip['equip_desc'])
    let mitama_list = acct_detail['inventory']
    let hero_list = acct_detail['heroes']
    let hero_info = acct_detail['hero_history']

    try {
      var message = {
        name: equip.seller_name,
        roleid: equip.seller_roleid,
        ordersn: equip.game_ordersn,
        mitama_list
      }
      var event = new CustomEvent('SaveLastAccount', {
        detail: message
      })
      window.dispatchEvent(event)
      acct_info.latest = message
    } catch (error) {}

    Object.entries(mitama_list).forEach(([key, value]) => {
      mitama_list[key] = floatify_mitama(value)
    })
    Object.entries(hero_list).forEach(([key, value]) => {
      hero_list[key] = floatify_hero(value, mitama_list)
    })
    acct_detail['inventory'] = mitama_list
    equip['equip_desc'] = JSON.stringify(acct_detail)
    data['equip'] = equip

    acctHighlight(mitama_list, hero_info, acct_detail)

    return data
  }

  function getPropValue (mitama_set, mitama_list, propName) {
    let res = 0
    for (let mitama_id of mitama_set) {
      var { attrs, single_attr = [] } = mitama_list[mitama_id]
      for (let [p, v] of attrs) {
        if (p === propName) {
          res += parseFloat(v)
        }
      }
      if (single_attr.length > 0 && single_attr[0] === propName) {
        res += parseFloat(single_attr[1])
      }
    }
    return res
  }

  function floatify_hero (hero_data, mitama_list) {
    var { attrs, equips } = hero_data
    Object.keys(attrs).forEach(propName => {
      if (propName === '速度' && parseFloat(attrs[propName].add_val) > 0) {
        if (hero_data.heroId === 255 && hero_data.awake === 1) {
          //觉醒阎魔+10速度
          attrs[propName].add_val = 10.0
        } else {
          attrs[propName].add_val = 0.0
        }
        attrs[propName].add_val += getPropValue(equips, mitama_list, propName)
        attrs[propName].add_val = attrs[propName].add_val.toFixed(FRAC_N)
      }
      if (propName === '暴击' && parseFloat(attrs[propName].add_val) > 0) {
        let suit_cp = suit_by_props['暴击']
        attrs[propName].add_val = getPropValue(equips, mitama_list, propName)
        let suit_names = equips.map(x => mitama_list[x].name)
        let suit_count = {}
        for (let n of suit_names) {
          if (n in suit_count) {
            suit_count[n] += 1
          } else {
            suit_count[n] = 1
          }
        }
        Object.keys(suit_count).forEach(n => {
          if (suit_count[n] >= 2 && suit_cp.includes(n)) {
            attrs[propName].add_val += suit_count[n] === 6 ? 30 : 15
          }
        })
        attrs[propName].add_val = attrs[propName].add_val.toFixed(2) + '%'
      }
    })

    return hero_data
  }

  function floatify_mitama (mitama) {
    var { rattr, attrs } = mitama
    mitama['attrs'] = [attrs[0], ...calAttrs(rattr)]
    return mitama
  }

  function calAttrs (rattrs, format = true) {
    var enAttrNames = [
      'attackAdditionRate',
      'attackAdditionVal',
      'critPowerAdditionVal',
      'critRateAdditionVal',
      'debuffEnhance',
      'debuffResist',
      'defenseAdditionRate',
      'defenseAdditionVal',
      'maxHpAdditionRate',
      'maxHpAdditionVal',
      'speedAdditionVal'
    ]

    var cnAttrNames = [
      '攻击加成',
      '攻击',
      '暴击伤害',
      '暴击',
      '效果命中',
      '效果抵抗',
      '防御加成',
      '防御',
      '生命加成',
      '生命',
      '速度'
    ]

    var basePropValue = {
      攻击加成: 3,
      攻击: 27,
      暴击伤害: 4,
      暴击: 3,
      效果抵抗: 4,
      效果命中: 4,
      防御加成: 3,
      防御: 5,
      生命加成: 3,
      生命: 114,
      速度: 3
    }

    var percentProp = {
      攻击加成: true,
      攻击: false,
      暴击伤害: true,
      暴击: true,
      效果抵抗: true,
      效果命中: true,
      防御加成: true,
      防御: false,
      生命加成: true,
      生命: false,
      速度: false
    }

    var e2cNameMap = Object.assign(
      {},
      ...enAttrNames.map((n, index) => ({
        [n]: cnAttrNames[index]
      }))
    )
    var res = Object()
    for (let rattr of rattrs) {
      var [prop, v] = rattr
      prop = e2cNameMap[prop]
      if (prop in res) {
        res[prop] += v
      } else {
        res[prop] = v
      }
    }

    return Object.keys(res)
      .sort()
      .map(p => {
        var v = res[p] * basePropValue[p]
        if (format) {
          v = v.toFixed(FRAC_N)
          if (percentProp[p]) {
            v += '%'
          }
        }

        return [p, v]
      })
  }

  function soulToJson (soulItem) {
    const {
      attrs,
      level,
      qua,
      rattr,
      uuid,
      name,
      pos,
      single_attr = []
    } = soulItem
    var born = parseInt(uuid.substring(0, 8), 16)
    let soulDict = {
      固有属性: single_attr.length ? single_attr[0] : null,
      生成时间: born,
      御魂等级: level,
      御魂星级: qua,
      御魂ID: uuid,
      御魂类型: name,
      位置: pos
    }
    let PROPNAMES = [
      '攻击',
      '攻击加成',
      '防御',
      '防御加成',
      '暴击',
      '暴击伤害',
      '生命',
      '生命加成',
      '效果命中',
      '效果抵抗',
      '速度'
    ]
    PROPNAMES.map(function (e, i) {
      soulDict[e] = 0
    })

    let percent = [
      '攻击加成',
      '防御加成',
      '暴击',
      '暴击伤害',
      '生命加成',
      '效果命中',
      '效果抵抗'
    ]
    for (let [p, v] of [attrs[0], ...calAttrs(rattr, false)]) {
      v = parseFloat(v)
      if (percent.includes(p)) {
        v = v / 100
      }
      soulDict[p] += v
    }
    if (single_attr.length) {
      const [p, v] = single_attr
      soulDict[p] += parseFloat(v) / 100
    }

    return soulDict
  }

  function saveToJson (soulLists) {
    var fileContent = 'data:text/json;charset=utf-8,'
    let soulListJson = Object.values(soulLists).map(soulToJson)
    soulListJson.unshift('yuhun_ocr2.0')
    fileContent += JSON.stringify(soulListJson)

    var encodedUri = encodeURI(fileContent)
    var link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'yuhun.json')
    link.innerHTML = 'Click Here to download your data'
    document.body.appendChild(link) // Required for FF

    link.click()
    link.parentNode.removeChild(link)
  }

  function acctHighlight (mitama_list, hero_info, acctHighlight) {
    let fastest = {}
    let fullspd_cnt = {}
    let heads = []
    let feet = []
    let all_pos = [1, 2, 3, 4, 5, 6]
    for (let p of [1, 2, 3, 4, 5, 6, 7]) {
      //7 for 命中@4
      fastest[p] = {}
      fullspd_cnt[p] = {}
      for (let name of suit_imp) {
        fastest[p][name] = 0
        fullspd_cnt[p][name] = 0
      }
    }

    Object.entries(mitama_list).forEach(([key, m]) => {
      let { attrs, pos, name, qua, rattr } = m
      let spd = 0,
        spdpt = 0
      for (let [p, v] of attrs) {
        if (p === '速度') {
          spd += parseFloat(v)
        }
      }
      for (let rattr_entry of rattr) {
        var [prop, v] = rattr_entry
        if (prop === 'speedAdditionVal') {
          spdpt += 1
        }
      }
      if (spdpt < 1 || (pos === 2 && spd < 57)) {
        return
      }
      if (spdpt === 6 && (pos !== 2 || spd > 70)) {
        fullspd_cnt[pos]['散件'] += 1
        if (name in fullspd_cnt[pos]) {
          fullspd_cnt[pos][name] += 1
        } else {
          fullspd_cnt[pos][name] = 1
        }
        if (pos === 2) {
          heads.push({
            pos,
            name,
            value: spd - 57
          })
        } else if (pos === 4 && attrs[0][0] === '效果命中') {
          fullspd_cnt[7]['散件'] += 1
          if (name in fullspd_cnt[pos]) {
            fullspd_cnt[7][name] += 1
          } else {
            fullspd_cnt[7][name] = 1
          }
          feet.push({
            pos,
            name,
            value: spd
          })
        }
      }
      if (name in fastest[pos]) {
        fastest[pos][name] = fastest[pos][name] > spd ? fastest[pos][name] : spd
      } else {
        fastest[pos][name] = spd
      }
      fastest[pos]['散件'] =
        fastest[pos]['散件'] > spd ? fastest[pos]['散件'] : spd
      if (pos === 4 && attrs[0][0] === '效果命中') {
        pos = 7
        if (name in fastest[pos]) {
          fastest[pos][name] =
            fastest[pos][name] > spd ? fastest[pos][name] : spd
        } else {
          fastest[pos][name] = spd
        }
        fastest[pos]['散件'] =
          fastest[pos]['散件'] > spd ? fastest[pos]['散件'] : spd
      }
    })
    acct_info.summary = {
      heads,
      feet,
      fastest,
      fullspd_cnt,
      hero_info
    }
    acct_info.ready = true
    acct_info.acctHighlight = acctHighlight
  }

  function saveToJsonHelper () {
    // var event = new CustomEvent("LoadLastAccount", {});
    // window.dispatchEvent(event);
    // console.log("Account data requested!");
    saveToJson(acct_info.latest.mitama_list)
  }
  // function needed that is not included from chrome extension
  var cssRules = `
.cbghelper_nowrap {
    white-space: nowrap;
}
.new-highlight {
    margin-top: 0 !important;
}
`

  function injectCSS () {
    var style = document.createElement('style')
    style.innerHTML = cssRules
    document.getElementsByTagName('head')[0].appendChild(style)
  }

  injectCSS()
})()
