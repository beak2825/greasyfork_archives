// ==UserScript==
// @name         BeautyToMac
// @namespace    http://tampermonkey.net/
// @version      0.1.8rc1
// @icon         data:image/png;base64,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
// @description  给你的百度和360搜索一个类似Mac/Gnome的浏览体验
// @author       CloundMark
// @match        *://www.baidu.com/*
// @match        *://baidu.com/*
// @match        *://www.so.com/*
// @match        *://so.com/*
// @license       GPLv3
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *

// @downloadURL https://update.greasyfork.org/scripts/453319/BeautyToMac.user.js
// @updateURL https://update.greasyfork.org/scripts/453319/BeautyToMac.meta.js
// ==/UserScript==
(function () {
    /* 全局配置项 start*/
    const userGlobalConfigs = {
        // 网站开关 true启用，false关闭;
        baidu: true,
        sou360: true,

        // 调试模式开关
        isDebug: false,
        // 0、全局背景; bg代表背景图像，你可以从网络上引用自己喜欢的，used 为true表示启用当前分类或具体的图像，false弃用;
        // 内部的name建议您始终加上（但也不是必须）,主要是便于哪天不需要的时候可以快速定位;
        // 对于本地图像，可以上传到免费的在线图床之后再获取链接加入，比如 https://imgse.com/
        // 请仿照示例添加背景
        bg: {
            used: true,
            sources: {
                'cartoon': {
                    used: true,
                    sources: [
                        { used: true, name: '粉红猫', url: 'https://i0.hdslb.com/bfs/article/f45de07102e3fe83331d68dd455336ab0b2a08b3.png@942w_566h_progressive.png' },
                        { used: true, name: '可爱猫', url: 'https://i0.hdslb.com/bfs/article/dec6e7a1969748f2b4462c688367d772798d4134.png@942w_668h_progressive.png' },
                        { used: true, name: '两仪式', url: 'https://i0.hdslb.com/bfs/article/c7cb8fecdd0cd7d34e89319c4b9eeb4ab543cfd0.jpg@1320w_740h.jpg' },
                        { used: true, name: '远坂凛', url: 'https://img9.51tietu.net/pic/2019-091402/jr354qpj03ujr354qpj03u.jpg' },
                        { used: true, name: '红猫', url: 'https://mms0.baidu.com/it/u=2246948513,3190507093&fm=253&app=138&f=JPEG&fmt=auto&q=75?w=800&h=500' },
                        //不清晰{ used: true, name: '红猫', url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F011e9ec28bb2ef90550a090d2121296ee2cfe88233f56-lV1t8X_fw658&refer=http%3A%2F%2Fhbimg.b0.upaiyun.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661358344&t=a4aeb02bf2d960bed1a219c17de13543' },
                        { used: true, name: '蓝狗', url: 'https://i0.hdslb.com/bfs/article/78c032adb6df5717fc4ae465982a9d2096984223.jpg@942w_531h_progressive.jpg' },
                        { used: true, name: '两仪式2', url: 'https://img2.baidu.com/it/u=4177750439,794883634&fm=253&fmt=auto&app=138&f=JPEG?w=935&h=500' },
                        { used: true, name: 'saber', url: 'https://i0.hdslb.com/bfs/article/49c217c9ec1e9cd707a228a509df0e7d57e0dd6e.jpg@1320w_740h.jpg' },
                        { used: true, name: '雅尔贝德', url: 'https://i0.hdslb.com/bfs/article/38f4427201389a1fe54c12d9a62ca57681e06b3a.jpg@1320w_740h.webp' },
                        { used: true, name: 'saber2', url: 'https://i0.hdslb.com/bfs/article/0fa36a51ebd26d1d2a5621385910d9b35cdc681a.jpg@942w_590h_progressive.jpg' },
                        { used: true, name: '雅尔贝德2', url: 'https://i0.hdslb.com/bfs/article/e7cfb2d9768b707f16685a83d7126db4787042b2.jpg@942w_668h_progressive.webp' },
                        { used: true, name: '白猫', url: 'https://i0.hdslb.com/bfs/article/64f062d70fdba96b39dd346ab9d33dc5bf77c17f.jpg@942w_498h_progressive.webp' },
                        { used: true, name: '贞子', url: 'https://i0.hdslb.com/bfs/article/87f6a5c7b25307c4cc7bd86acca8ed51dec25dcc.jpg@942w_666h_progressive.webp' },
                        { used: true, name: '大鱼', url: 'https://i0.hdslb.com/bfs/article/73b003ea1c04fb3d1ed736773b3f752a8f3acfc5.jpg@942w_596h_progressive.webp' },
                        { used: true, name: '空蓝', url: 'https://i0.hdslb.com/bfs/article/86bed00f68bbff662e202aa91215336bb3dd251e.jpg@942w_587h_progressive.webp' },
                        { used: true, name: '樱', url: 'https://i0.hdslb.com/bfs/article/fa372e5e0a70b630b5b7eb9b4a0d1125a83535ce.png' },
                        { used: true, name: '薇尔莉特', url: 'https://i0.hdslb.com/bfs/article/59af6572e5ea374e434a0d0cbb78c5a83e159939.jpg@942w_531h_progressive.webp' },
                        { used: true, name: '紫', url: 'https://img1.baidu.com/it/u=2725650397,3822860203&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800' },
                        { used: true, name: '伊莉雅', url: 'https://i0.hdslb.com/bfs/article/59b79113f3a8be33ae75009c862a4bb47fc6d87a.jpg@942w_531h_progressive.webp' },
                        { used: true, name: '薇尔莉特2', url: 'https://i0.hdslb.com/bfs/article/0a5f6397857f8f840e9c4bb6a7b52b9623aefcd7.jpg@942w_590h_progressive.webp' },
                        { used: true, name: '薇尔莉特3', url: 'https://i0.hdslb.com/bfs/article/ec68b813ca3a56a1e23190f9e8a255feb1d2d5e7.jpg@1320w_740h.webp' },
                        { used: true, name: '薇尔莉特4', url: 'https://i0.hdslb.com/bfs/article/7085568797e6a1923056990f71888fe9706d644b.jpg@1320w_740h.webp' },
                        { used: true, name: '伊莉雅2', url: 'https://img0.baidu.com/it/u=3169921451,1554186398&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800' },
                        { used: true, name: '希丝缇娜', url: 'https://i0.hdslb.com/bfs/article/65da66f0bd9e888ad572c9ab9100e4b741f2019d.jpg@942w_530h_progressive.webp' },
                        // 引自B站 https://www.bilibili.com/read/cv6710298?from=search
                        { used: true, name: '深', url: 'https://i0.hdslb.com/bfs/article/5c40299551a8dc24fe8c55016283206b370132aa.jpg@942w_545h_progressive.webp' },
                        // 引自B站 https://www.bilibili.com/read/cv17176820?from=search 原画师：杉８７
                        { used: true, name: '晚霞', url: 'https://i0.hdslb.com/bfs/article/61e693800a1f2dbab634bbb30524b151523d09fa.jpg@942w_531h_progressive.webp' },
                        // 引自B站 https://www.bilibili.com/read/cv17176820?from=search 原画师：Teardrops
                        { used: true, name: '望', url: 'https://i0.hdslb.com/bfs/article/7ff810942db808887d96ee65cb0f469bb68eb9aa.jpg@942w_531h_progressive.webp' },
                        // 原画师 ohara_tometa(小原トメ太)
                        { used: true, name: 'Bunnies', url: 'https://iknow-pic.cdn.bcebos.com/c2fdfc039245d6888182ff59a5c27d1ed31b244e' },
                        { used: true, name: '艾莉丝', url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp2.itc.cn%2Fimages01%2F20210309%2Ff14fae9f68c443f1835e002513fe34fd.jpeg&refer=http%3A%2F%2Fp2.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1670083703&t=5b75cd70ffbb1e67877a30ae22c5d140' },
                        { used: true, name: '近月少女', url: 'https://p7.itc.cn/q_70/images03/20220624/1b26d1898ee041e2a16b54a1a5181886.jpeg' },
                        { used: true, name: '近月少女2', url: 'https://i0.hdslb.com/bfs/article/75fe779e3694b006a6cb98bdeb0d440d5b8bb83d.jpg' },
                        { used: true, name: '近月少女3', url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg1.gamersky.com%2Fupimg%2Fusers%2F2022%2F06%2F18%2Forigin_202206180231253771.jpg&refer=http%3A%2F%2Fimg1.gamersky.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1673282937&t=58d7062b4cab1dc2c25204c72e1d8e4e' },
                        { used: true, name: '', url: '' },
                        { used: true, name: '', url: '' },
                        { used: true, name: '', url: '' },
                    ]

                },
                'natures': {
                    used: false,
                    sources: [
                        { used: true, name: '', url: '' },
                        { used: true, name: '', url: '' },
                    ]
                },
                'Girls': {
                    used: false,
                    sources: [
                        { used: true, name: '', url: '' },
                        { used: true, name: '', url: '' },
                    ]
                },
            }
        },

        // 1、背景切换方式
        bgSwitchMode: 'multi',// 可选枚举值：['once','multi'];

        // 2、设置背景切换的最短时间间隔，单位s;小于3s将设为3s;
        duration: 5,

        // 3、启用低速网络模式，非false以开启;建议始终选择low;一下网速依次越差;
        //    可选枚举值：[false,'low','middle','heigh','infinity'];
        netThrottlMode: 'low',

        // 4、枚举值，设定中央版块的主题色
        //    可选枚举值：[各种颜色的16进制表示];false禁用中央面板色彩(当前全局为护眼色#C7EDCC80)并启用默认背景
        //    你可以在下方给每个站点分别配置
        centerColor: '#C7EDCC80',

        // 5、请求任意站点;如果你的图像来自可能被拒的其他网站服务提供者，那么启用此选项可以绕过浏览器限制
        requestAllWebsite: true,

        // 6、启用键盘导航,设为false以禁用
        keyBoardNav: true,

        // 7、启用左右空白导航,设为false以禁用
        whiteNav: true,

        // 8、开启快捷键ctrl+y搜索聚焦
        allowSearchBox: true,
    };

    class debugLog {
        static get Priority() {
            return ['log', 'summary', 'warn', 'error', 'critical', 'dir'];
        }
        constructor(isDebuger, debugPriority) {
            this.isDebuger = isDebuger; // 要使用全局配置
            this.debugPriority = debugPriority || this.constructor.Priority;
            this.log = this.wrapperLogPriority();
            this.summary = this.wrapperLogPriority('summary', 'color:cyan');
            this.warn = this.wrapperLogPriority('warn', 'color:yellow');
            this.error = this.wrapperLogPriority('error', 'color:red');
            this.critical = this.wrapperLogPriority('critical', 'color:black;background-color:red;');
            this.dir = this.wrapperObjPriority('dir');
            for (let obj of [this, this.debugPriority]) Object.freeze(obj);
        }
        wrapperLogPriority(actionPriority, style) {
            let priority = actionPriority || 'log'; // log,即info消息级别
            if (!this.constructor.Priority.includes(priority)) throw TypeError(`Cant allow [${priority}]`);
            let outpuMethod = console.log;
            return (...rest) => {
                if (this.isDebuger && this.debugPriority.includes(priority)) {
                    outpuMethod(`%c${rest}`, style || 'color:lime');
                }
            }
        }
        wrapperObjPriority(actionPriority) {
            let priority = actionPriority;
            if (!this.constructor.Priority.includes(priority)) throw TypeError(`Cant allow [${priority}]`);
            let outpuMethod = console.dir;
            return (...rest) => {
                if (this.isDebuger && this.debugPriority.includes(priority)) {
                    outpuMethod(...rest);
                }
            }
        }
    }

    //const logger = new debugLog(userGlobalConfigs.isDebug,['log','summary','warn','error','critical']);
    const logger = new debugLog(userGlobalConfigs.isDebug);
    const URL = window.URL || window.webkitURL || window.mozURL;
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    // eslint-disable-next-line no-undef
    const GMxmlHttpRequest = typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : GM.xmlHttpRequest;

    /* 基类 */
    class Base {
        constructor() {
            this.priority = 'Base';
        }
        setBFInterval(fn, interval, ...rest) {
            let id = setInterval((...rest) => {
                fn.call(this, ...rest);
            }, interval, ...rest);
            fn.call(this, ...rest);
            return id;
        }
        findElement(selector, timoout = 5, fq = false, intvl = 100, signal = null) {
            if (!(selector && typeof selector === 'string')) throw TypeError('selector must be non-zero string.')
            return new Promise((success, reject) => {
                let timer4min, timer4big, mt, timer4HTML;

                // 启用用户中断
                if (signal && Object.prototype.toString.call(signal).slice(8, -1) === 'AbortSignal') {
                    signal.addEventListenner('abort', () => {
                        logger.warn('异步查询，用户中断查找：', selector);
                        reject(signal.reason);
                        clearInterval(timer4min);
                        clearTimeout(timer4big);
                        mt && mt.disconnect();
                    });
                }
                // 开启快查询
                if (fq) {
                    timer4min = this.setBFInterval(() => {
                        let result = document.querySelectorAll(selector);
                        if (result.length) {
                            success(result);
                            clearInterval(timer4min);
                            clearTimeout(timer4big);
                            mt && mt.disconnect();
                        }
                    }, intvl);
                }
                //开启超时策略
                timer4big = setTimeout(() => {
                    reject(`TimeOut[${selector}]`);
                    clearInterval(timer4min);
                    mt && mt.disconnect();
                }, timoout * 1000);
                //开启DOM监测
                mt = new MutationObserver((_, obs) => {
                    let result = document.querySelectorAll(selector);
                    if (result.length) {
                        success(result);
                        clearInterval(timer4min);
                        clearTimeout(timer4big);
                        obs.disconnect();
                    }
                });
                if (document && document.documentElement && document.documentElement.tagName.toUpperCase() === 'HTML') {
                    mt.observe(document.documentElement, { childList: true, subtree: true });
                } else {
                    //说明网速极度不好
                    timer4HTML = this.setBFInterval(function () {
                        if (document && document.documentElement && document.documentElement.tagName.toUpperCase() === 'HTML') {
                            mt.observe(document.documentElement, { childList: true, subtree: true });
                            clearInterval(timer4HTML);
                        }
                    }, 15)
                }
            });
        }
        sendGMXHR(url, method, loadCB, errorCB, timeoutCB, timeout) {

            GMxmlHttpRequest({
                url,
                method: method || 'get',
                timeout,
                responseType: 'blob',
                onload: loadCB,
                onerror: errorCB,
                ontimeout: timeoutCB
            });
        }
        getHeadersFromGMXHR(headersString = '') {
            // 油猴响应头转换成对象
            let head = new Headers();
            let items = headersString.split('\n').filter(o => o);
            let k = '', v = '', idx;
            for (let item of items) {
                item = item.trim();
                idx = item.indexOf(':');
                if (idx === -1) continue;
                k = item.slice(0, idx).trimEnd(), v = item.slice(idx + 1).trimStart();
                if (k && v) head.append(k, v);
            }
            return head;
        }
        shuffle(arr = []) {
            if (arr.length < 2) return arr;
            let l = arr.length;
            while (l) {
                let j = Math.floor(Math.random() * l--);
                [arr[l], arr[j]] = [arr[j], arr[l]];
            }
            return arr;
        }
        getType(val) {
            return Object.prototype.toString.call(val).slice(8, -1);
        }
        forceCheck(fn, argsType = [], returnType = []) {
            if (!(typeof fn === 'function' &&
                Array.isArray(argsType) &&
                Array.isArray(returnType))) throw TypeError('类型错误：必须是[function, array, array]');
            return function () {
                //if(fnWrapper.prototype[Symbol.toStringTag]!==fn.name) fnWrapper.prototype[Symbol.toStringTag]=fn.name;
                let tp = '';
                if (arguments.length) {
                    for (let i = 0; i < argsType.length; i++) {
                        tp = this.getType(arguments[i]);
                        if (tp !== argsType[i]) {
                            throw TypeError(`函数：[${fn.name}]的[第${i + 1}个]参数类型要求是[${argsType[i]}],但传入的是[${tp}]`);
                        }
                    }
                }
                let result = fn.prototype ? fn.call(this, ...arguments) : fn(...arguments);
                if (returnType.length) {
                    tp = this.getType(result);
                    if (returnType.includes(tp)) {
                        return result;
                    } else {
                        throw TypeError(`函数：[${fn.name}]的返回参数类型要求是[${returnType}],但返回的是[${tp}]`);
                    }
                } else {
                    return result;
                }
            };
        }
        openCaches(cacheName) {
            if (window.caches && window.isSecureContext) {
                return caches.open(cacheName)
            } else {
                logger.log('Current context is not secure');
                return Promise.resolve();
            }
        }
        setCaches(cacheName, url, response) {
            this.openCaches(cacheName).then(myCache => {
                myCache && myCache.keys().then(urls => {
                    let urlsStr = urls.map(item => item.url);
                    if (!urlsStr.includes(url)) {
                        myCache.put(url, response)
                            .then(
                                () => logger.log(`Cache set ok.-->[${url}]`)
                            ).catch(
                                (e) => logger.error(`Cache set is wrong.->info[${e.message}]-->[${url}]`)
                            )
                    }
                })
            })
        }
        getCache(cacheName, url, options) {
            return new Promise((success) => {
                this.openCaches(cacheName).then(myCache => {
                    if (myCache) {
                        myCache.match(url, options || { ignoreVary: true })
                            .then(rsp => success(rsp))
                            .catch(err => {
                                logger.error(`Get cache failed. Info-->${err}\nfor ${url}`);
                                success(false);
                            })
                    } else {
                        success(null);
                    }
                })
            })
        }
        addCaches(cacheName, url, failCallBack, initSuccessCallBack) {
            // 无则添加，有则忽略
            this.openCaches(cacheName).then(myCache => {
                myCache && myCache.keys().then(urls => {
                    let urlsStr = urls.map(item => item.url);
                    if (urlsStr.includes(url)) {
                        logger.log(`Add cache, but url exists, ignore. [${url}]`);
                    } else {
                        myCache.add(url)
                            .then(() => {
                                logger.log(`First add cache success, [${url}]`);
                                if (initSuccessCallBack) logger.log('InitSuccessCallBack add cache Callback exist. Try to callback.');
                                initSuccessCallBack && initSuccessCallBack();
                            })
                            .catch(err => {
                                logger.error(`Add cache failed. Info-->${err}\nfor ${url}`);
                                if (failCallBack) logger.log('Add cache Callback exist. Try to callback.');
                                failCallBack && failCallBack();
                            })
                    }
                })
            })
        }
        updateCaches(cacheName, url, failCallBack) {
            this.openCaches(cacheName).then(myCache => {
                myCache && myCache.delete(url, { ignoreVary: true }).then(() => {
                    myCache.add(url).catch(err => {
                        logger.error(`Update cache failed. Info-->${err}\nfor ${url}`);
                        if (failCallBack) logger.log('Update cache Callback exist. Try to callback.')
                        failCallBack && failCallBack();
                    })
                }, () => {
                    logger.error('Update cache something is wrong, get fault.')
                })
            })
        }
        deleteCaches(cacheName, url, options) {
            this.openCaches(cacheName).then(myCache => {
                myCache && myCache.keys().then(urls => {
                    if (urls.includes(url)) {
                        myCache.delete(url, options || { ignoreVary: true }).then(
                            ok => logger.log(`Delete cache success. Info-->${ok}\nfor ${url}`)
                        ).catch(
                            err => logger.error(`Delete cache failed. Info-->${err}\nfor ${url}`)
                        )
                    } else {
                        logger.warn(`No url -->[${url}],ignore.`);
                    }
                })
            })
        }
        getAllCachesUrl(cacheName) {
            return new Promise(success => {
                this.openCaches(cacheName).then(myCache => {
                    if (myCache) {
                        myCache.keys().then(urls => {
                            success(urls.map(item => item.url));
                        })
                    } else {
                        success(null);
                    }
                })
            })
        }
        hasCaches(cacheName, url) {
            return new Promise(success => {
                this.openCaches(cacheName).then(myCache => {
                    if (myCache) {
                        myCache.keys().then(urls => {
                            let urlsStr = urls.map(item => item.url);
                            if (urlsStr.includes(url)) {
                                success(true);
                            } else {
                                success(false);
                            }
                        })
                    } else {
                        success(null);
                    }
                })
            })
        }
        run() {
            throw TypeError('ChildrenClass must have this method!');
        }
    }

    class NoAdBase extends Base {
        constructor(selector) {
            super();
            this.selector = selector;
            this.allElements = [];
        }
    }

    /* 反广告 */
    class AntiAdSoft extends NoAdBase {
        constructor(selector) {
            super(selector);
            this.allElements = [...document.querySelectorAll(this.selector)];
            Reflect.defineProperty(this, 'priority', { value: 'NoAdSoft', configurable: false, enumerable: true, writable: false });
        }
        run() {
            for (let i = 0; i < this.allElements.length; i++) {
                this.allElements[i].style.cssText += 'display:none !important';
            }
        }
    }

    class AntiAdHard extends NoAdBase {
        constructor(selector) {
            super(selector);
            this.allElements = null;
            Reflect.defineProperty(this, 'priority', { value: 'NoAdHard', configurable: false, enumerable: true, writable: false });
        }
        run() {
            this.findElement(this.selector).then(results => {
                this.allElements = [...results];
                if (this.allElements.length) {
                    this.allElements.forEach(item => item.remove());
                }
            }).catch(info => {
                logger.warn(`AntiHard No ${info}.`);
            })
        }
    }

    class AntiAdDynamic extends NoAdBase {
        constructor(adDynamic) {
            super();
            //dynamicRules
            if (!this.constructor.UNIQUEINSTANCE) {
                this.dynamicRules = adDynamic;
                this.maid = [];
                Reflect.defineProperty(this, 'priority', { value: 'NoAdDynamic', configurable: false, enumerable: true, writable: false });
                Reflect.defineProperty(this.constructor, 'UNIQUEINSTANCE', { value: this, configurable: false, enumerable: false, writable: false });
            } else {
                return this.constructor.UNIQUEINSTANCE;
            }
        }
        run() {
            for (let item of this.dynamicRules) {
                let mt = new MutationObserver(() => {
                    let tmpNodeList = document.querySelectorAll(item.ref);
                    if (tmpNodeList.length) {
                        let resultWrapper = item.fire(tmpNodeList);
                        resultWrapper.forEach(o => o.remove());
                    }
                })
                this.maid.push(mt);
                let eye = document.querySelector(item.eyeSlector);
                if (eye) {
                    mt.observe(eye, item.options);
                } else {
                    this.findElement(item.eyeSlector)
                        .then(eles => mt.observe(eles[0], item.options))
                        .catch(info => logger.warn(`${info}---无广告参照点：${item.ref} from ${item.eyeSlector}.`));
                }
            }
        }
    }

    /* 处理样式的基类 */
    class ModifyStyleBase extends Base {
        constructor(selector) {
            super(selector);
        }
        getNewElement(tag, options = {}) {
            let tmp = document.createElement(tag);
            Object.assign(tmp, options);
            return tmp;
        }
        setStyle() {
            throw TypeError('ChildrenClass must have this method!');
        }
        removeStyle() {
            throw TypeError('ChildrenClass must have this method!');
        }
        getStyle() {
            throw TypeError('ChildrenClass must have this method!');
        }
        observeStyle() {
            throw TypeError('ChildrenClass must have this method!');
        }
        stringToMap(styleText) {
            // 将 “div{height:20px;width:30px;content:':;'}span a{color:'red';text-align:center;}” 转换成
            // Map对象 {'selector':{'attr1':'value1','attr2':'value2'}}
            // 原因是用户输入可能不规范，转成统一格式便于处理
            // 输入content属性不能包含 {};
            let result = new Map();
            if (!styleText) return result;
            let pattern4InnerText = /[\w+~|*$()[\]\s#:=>,"'-^]+{[^}]*?}/gi;
            let pattern4PerRule = /([\w+~|*$()[\]\s#:=>,"'-^]+){([^}]*?)}/i;
            let cssRulesText = [...styleText.matchAll(pattern4InnerText)].flat();
            for (let rule of cssRulesText) {
                let [selector, values] = rule.match(pattern4PerRule).slice(1);
                // if (!selector || !values) throw Error(selector + 'someThing is Wrong');
                selector = selector.trim();
                values = values.split(';').filter(o => o.trim());
                let style = result.get(selector);
                if (!style) {
                    style = new Map();
                    result.set(selector, style);
                }
                for (let attr of values) {
                    let idx = attr.indexOf(":");
                    let k = attr.slice(0, idx).trim();
                    let v = attr.slice(idx + 1).trim();
                    if (!k) throw Error(selector + ' attr is Wrong');
                    if (v == '') continue;
                    style.set(k, v.replace('\uea60', ';'));
                }
            }
            return result;
        }
        mapToString(map) {
            if (Object.prototype.toString.call(map).slice(8, -1) !== 'Map') throw TypeError('map Must be Map');
            let result = '';
            for (let [selector, valMaps] of map) {
                result = result + selector + '{';
                for (let [k, v] of valMaps) {
                    result = result + k + ":" + v + ";";
                }
                result += "}";
            }
            return result
        }
        string2DToMap(styleText) {
            let result = new Map();
            if (!styleText) return result;
            for (let item of styleText.split(';').filter(i => i.trim())) {
                let key = item.slice(0, item.indexOf(':'));
                let val = item.slice(item.indexOf(':') + 1);
                result.set(key.trim(), val.trim());
            }
            return result;
        }
        getAllAvailableBg() {
            //与项目的配置项耦合在一起了
            let tempImgLists = [];
            if (this.configs.bg.used) {
                let bg = this.configs.bg.sources;
                for (let modules of Object.values(bg)) {
                    if (modules.used) {
                        for (let item of modules.sources) {
                            item.url = item.url.trim();
                            if (item.used && item.url && (/^https?:/i).test(item.url)) {
                                tempImgLists.push(item);
                            }
                        }
                    }
                }
            }
            return tempImgLists;
        }
        getSingleBg(availableList) {
            // 为空的时候会返回undefined
            if (window.isSecureContext && window.crypto && window.crypto.getRandomValues) {
                return availableList[Math.floor(crypto.getRandomValues((new Uint32Array(1)))[0] / 0xFFFFFFFF * availableList.length)];
            } else {
                return availableList[Math.floor(Math.random() * availableList.length)];
            }
        }
        getDifferPreviousSingleBg(previousBgObj, availableList) {
            let curObj = this.getSingleBg(availableList);
            for (; ;) {
                if (previousBgObj === curObj) {
                    curObj = this.getSingleBg(availableList);
                } else {
                    return curObj;
                }
            }
        }
        pageTest(urls = []) {
            // 成功则返回该有的对象，否则就解决为null
            if (!urls.length) return Promise.resolve(true);
            let controllers = [], flag = true, errCounter = 0;
            return new Promise(success => {
                // 1、先检查本地
                this.getAllCachesUrl(this.configs.cache).then(urlArrs => {
                    for (let item of urls) {
                        if (urlArrs.includes(item.url)) {
                            this.getCache(this.configs.cache, item.url)
                                .then(rsp => {
                                    rsp.blob().then(bb => {
                                        item.blobUrl = URL.createObjectURL(bb);
                                        success(item);
                                        flag = false;
                                        for (let obj of controllers) {
                                            obj.ctrl.abort();
                                        }
                                        logger.log('首页取到了缓存对象');
                                        logger.dir(item);

                                    })
                                })
                            logger.log('首页查询到了缓存对象');
                            break;
                        }
                    }
                })
                // 2、同时发送网络请求
                for (let item of urls) {
                    let ctrl = new AbortController();
                    controllers.push({ ctrl, item });
                    fetch(item.url, { signal: ctrl.signal, method: 'head', priority: 'high' })
                        .then(rsp => {
                            if (rsp.status === 200 || rsp.status === 304) {
                                if (flag) {  // 此处有bug
                                    flag = false;
                                    success(item);
                                    logger.log(`首页成功拿到了head的响应`);
                                    for (let obj of controllers) {
                                        if (obj.item !== item) obj.ctrl.abort();
                                    }
                                    // 如果失败就算了，不再使用回调必须成功
                                    this.addCaches(this.configs.cache, item.url)
                                }
                                // 其他成功就已经毫无意义了,不再计数
                            } else {
                                errCounter++
                                if (errCounter >= urls.length) success(null);
                            }
                        })
                        .catch((err) => {
                            errCounter++
                            logger.error(err.message);
                            if (errCounter >= urls.length) success(null);
                        })
                }
            })
        }
        getFirstPage(urlObjs = [], perNumber = 5) {
            // 从数据库拿出固定的数据对象
            if (!urlObjs.length) return Promise.resolve(null);
            urlObjs = this.shuffle(urlObjs.slice());
            let urlIterators = urlObjs[Symbol.iterator]();
            let iteratorCounter = 0, flag = true;
            return new Promise(success => {
                this.pageTest((function () {
                    let tmpResult = [];
                    if (flag) {
                        for (let i = 0; i < perNumber; i++) {
                            if (++iteratorCounter === urlObjs.length) flag = false;
                            tmpResult.push(urlIterators.next().value);
                        }
                    }
                    return tmpResult.filter(o => o);
                }())).then(result => {
                    logger.log(`首页一共发起${iteratorCounter}次head请求.`)
                    if (result) {
                        if (result === true) {
                            success(true);
                        } else {
                            logger.log('这里的是真对象');
                            logger.dir(result);
                            success(result);
                        }
                    } else {
                        return success(this.getFirstPage(urlObjs));
                    }
                })
            })
        }
        asyncLoadImg(bgObj, signal4Element, signal4Fetch, timeout4GM = 8000) {
            // 只加载是403跨域不允许的资源，其他的都由浏览器同步请求;
            let init = this.getCache(this.configs.cache, bgObj.url)

            return init.then(result => {
                // 1、查询缓存
                if (result) {
                    logger.summary('Match Cache.');
                    clearTimeout(signal4Element.timer);
                    clearTimeout(signal4Fetch.timer);
                    return result.blob().then(bb => {
                        return URL.createObjectURL(bb);
                    })
                } else {
                    logger.log('Start Request.');
                    return Promise.reject();
                }
            })
                .then(result => result, () => new Promise((success, rej) => {
                    // 2、图像跨域测试并短时间获得缓存响应
                    let img = new Image();
                    img.onload = function () {
                        if (img.naturalHeight) {
                            bgObj.directLinkUsed = true; // 直接链接可用
                            success(bgObj.url);
                            // logger.summary(`正常请求${bgObj.url}`);
                        } else {
                            logger.warn(`img假成功-->[${bgObj.name}]--[${bgObj.url}]`);
                            rej();
                        }
                        clearTimeout(signal4Element.timer);
                        signal4Element.signal.onabort = null;
                    }
                    img.onerror = function () {
                        logger.warn('Wallpaper loading Error,NEXT STEP');
                        signal4Element.signal.onabort = null;
                        if (img.naturalHeight) {
                            success({ onlyBgAvailable: true, url: bgObj.url });
                            clearTimeout(signal4Fetch.timer);
                            logger.warn(`img假失败-->[${bgObj.name}]--[${bgObj.url}]`)
                        } else {
                            rej();
                        }
                    }
                    // img.crossOrigin = '';
                    img.src = bgObj.url;
                    signal4Element.signal.onabort = () => {
                        rej();
                        logger.warn('User timeout.');
                        img.onerror = null;
                        img.src = '';
                        img = null;
                    }
                }))
                .then(url => url, () => {
                    // 3、对可能失败的缓存响应中做处本地应急处理
                    return fetch(bgObj.url, { signal: signal4Fetch.signal })
                        .then(
                            rsp => { clearTimeout(signal4Fetch.timer); logger.log('Deal with response'); return rsp },
                            () => { return Promise.reject('Request Exception...') }
                        )
                })
                .then(rsp => {
                    // rsp 是来自于缓存的blob,或来自于fetch的rsp,或来自于img元素的url,或onlyBgAvailable对象;
                    if (rsp.onlyBgAvailable) return rsp.url;
                    if (rsp === bgObj.url) {
                        // 缓存url,但是存在一种情况，就是图片src被禁止，返回200,ok，fetch请求也会失败，
                        // 但是当图像作为背景却不会被禁止(远坂凛)
                        return new Promise((resolve, reject) => {
                            if (rsp.toLowerCase().startsWith('https:')) {
                                this.addCaches(this.configs.cache, bgObj.url, () => {
                                    if (this.configs.requestAllWebsite) {
                                        this.sendGMXHR(bgObj.url, null, rsp => {
                                            // 对GM补救成功的同样进行blob化处理
                                            if (/^image.*?\//i.test(rsp.response.type)) {
                                                resolve(URL.createObjectURL(rsp.response));
                                                let rspDup = new Response(rsp.response.slice(), { status: 200, statusText: 'OK', headers: this.getHeadersFromGMXHR(rsp.responseHeaders) });
                                                this.setCaches(this.configs.cache, bgObj.url, rspDup);
                                            } else {
                                                logger.warn(`GM补救请求异常1,请及时检查[${bgObj.url}-->[${rsp.response}]-->[${rsp.response.type}]`);
                                                if (bgObj.directLinkUsed) {
                                                    // 直链可用的话
                                                    resolve(bgObj.url);
                                                    logger.warn(`不可缓存1,但直链可用[${bgObj.url}]`)
                                                } else {
                                                    reject('GM补救异常1');
                                                }
                                            }

                                        }, function () {
                                            reject('GM cross Origin Request failture.');
                                        }, function () {
                                            reject('GM timeout2');
                                        }, timeout4GM);
                                    } else {
                                        console.warn('Maybe,,,,Please switch requestAllWebsite on.');
                                        reject('GM add cache cant cors.');
                                    }
                                }, () => {
                                    // 成功，但是是第一次添加的回调
                                    this.getCache(this.configs.cache, bgObj.url).then(myRsp => {
                                        myRsp.blob().then(bb => {
                                            logger.log('初次直接返回了blob');
                                            resolve(URL.createObjectURL(bb));
                                        })
                                    })
                                })
                            } else {
                                resolve(rsp);
                            }
                        })
                    }
                    if (typeof rsp === 'string' && rsp.startsWith('blob:')) return rsp;
                    return new Promise((resolve, reject) => {
                        if (rsp.status === 403) {
                            logger.error('WebServer rejects request. ' + bgObj.url);
                            if (this.configs.requestAllWebsite) {
                                logger.warn('403,Start Cross Origin Request.');
                                this.sendGMXHR(bgObj.url, null, rsp => {
                                    resolve(URL.createObjectURL(rsp.response));
                                    let rspDup = new Response(rsp.response.slice(), { status: 200, statusText: 'OK', headers: this.getHeadersFromGMXHR(rsp.responseHeaders) });
                                    this.setCaches(this.configs.cache, bgObj.url, rspDup);
                                }, function (rsp) {
                                    logger.error('Cross Origin Request failture.');
                                    reject(rsp)
                                }, function () {
                                    reject('timeout');
                                }, timeout4GM);
                            } else {
                                console.warn(403, 'Maybe,,,,Please switch requestAllWebsite on.');
                                reject(rsp.status);
                            }
                        } else if (rsp.status > 399 && rsp.status !== 403) {
                            logger.error('Maybe internet or server inter error.')
                            reject(rsp.status);
                        } else {
                            // 几乎都是浏览器请求成功的rsp
                            try {
                                let rspDup = rsp.clone();
                                rsp.blob().then(bb => {
                                    resolve(URL.createObjectURL(bb));
                                });
                                this.setCaches(this.configs.cache, bgObj.url, rspDup);
                            } catch (e) {
                                logger.error(`浏览器几乎请求成功处有异常-->[${e.message}]`);
                                resolve(bgObj.url);
                            }
                        }
                    });
                }, reason => {
                    return new Promise((resolve, reject) => {
                        logger.warn(`BrowserInfo: [${reason}]`);
                        if (this.configs.requestAllWebsite) {
                            logger.warn('Start Cross Origin Request.');
                            this.sendGMXHR(bgObj.url, 'get', rsp => {
                                // 对GM补救成功的同样进行blob化处理
                                if (/^image.*?\//i.test(rsp.response.type)) {
                                    resolve(URL.createObjectURL(rsp.response));
                                    let rspDup = new Response(rsp.response.slice(), { status: 200, statusText: 'OK', headers: this.getHeadersFromGMXHR(rsp.responseHeaders) });
                                    this.setCaches(this.configs.cache, bgObj.url, rspDup);
                                } else {
                                    logger.warn(`GM补救请求异常2,请及时检查[${bgObj.url}-->[${rsp.response}]-->[${rsp.response.type}]`);
                                    if (bgObj.directLinkUsed) {
                                        // 直链可用的话
                                        resolve(bgObj.url);
                                        logger.warn(`不可缓存2,但直链可用[${bgObj.url}]`)
                                    } else {
                                        reject('GM补救异常2');
                                    }
                                }
                            }, function (rsp) {
                                logger.error('Cross Origin Request failture.');
                                reject(rsp);
                            }, function () {
                                reject('GM timeout2');
                            }, 8000);
                        } else {
                            reject('cant cors.');
                        }
                    })
                })
        }
        handleImg(context, timeout4Element, timeout4Fetch, timeout4GM) {
            let bgObj = context.bgObjNext;
            logger.log('下一张背景图像: ' + (bgObj.name || bgObj.url));
            let aborter4Element = new AbortController(),
                aborter4Fetch = new AbortController(),
                timer4ele, timer4fet;

            timer4ele = setTimeout(() => { aborter4Element.abort('UserTimeOutEle.'); }, (timeout4Element || this.configs.duration) * 1000 * 0.8);
            timer4fet = setTimeout(() => { aborter4Fetch.abort('UserTimeOutDom.') }, (timeout4Fetch || this.configs.duration) * 1000 * 2 * 0.8);

            this.asyncLoadImg(bgObj, { signal: aborter4Element.signal, timer: timer4ele }, { signal: aborter4Fetch.signal, timer: timer4fet }, timeout4GM)
                .then(rsp => {
                    logger.summary('success get');
                    if (rsp.startsWith('data:')) {
                        context.bgStr = rsp.replace(';', '\uea60'); // 60000码点字符
                    } else {
                        context.bgStr = rsp;
                    }
                    bgObj.bgObjPrev = bgObj.bgObjNext;
                    context.lock = true;
                })
                .catch(reason => {
                    logger.warn(reason, '保留上一张');
                    bgObj.bgObjNext = bgObj.bgObjPrev;
                    context.lock = true;
                });

        }
        wrapperEvent(customEvent, callback) {
            // 用于自定义包装事件
            if (typeof customEvent !== 'string') throw TypeError('EventName must be string.');
            if (typeof callback !== 'function') throw TypeError('callback must be function.');
            let customElement = new Event(customEvent, { cancelable: false, bubbles: true });
            return function () {
                customElement.content = arguments;
                let result = callback.apply(this, [...arguments]);
                window.dispatchEvent(customElement);
                return result;
            }
        }
    }

    /* 定义样式在标签内处理的类 */
    /* 此处的设置不会被网站设置覆盖的样式，为弱类型设置;全局唯一实例的style标签 */
    class ModifyStyleFromTag extends ModifyStyleBase {
        constructor() {
            super();
            if (!this.constructor.UNIQUEINSTANCE) {
                this.observers = [];
                this.styleEle = this.getNewElement('style');
                this.styleEle.id = this.styleEle.id || '$' + Math.random().toString(36).slice(2);
                Reflect.defineProperty(this, 'priority', { value: 'Tag', configurable: false, enumerable: true, writable: false });
                Reflect.defineProperty(this.constructor, 'UNIQUEINSTANCE', { value: this, configurable: false, enumerable: false, writable: false });
            } else {
                return this.constructor.UNIQUEINSTANCE;
            }
        }
        setStyle(css) {
            // css 可以是样式对象或者是css文本;filter指定给满足条件的元素添加样式,可以是NodeList或[[HTMLElement]],或者回调函数;
            // let cssTest = "div {width:30px  ;height: 40px;}span a ,b> strong {color:'red';line-height:1rem}";
            let newStyleMap = this.stringToMap(css);
            let currentMap = this.stringToMap(this.styleEle.innerText);
            for (let [selector, values] of newStyleMap) {
                let currentStyleMap = currentMap.get(selector);
                if (!currentStyleMap) {
                    // 空说明是新选择器;
                    currentMap.set(selector, values);
                } else {
                    // 说明是旧选择器;
                    for (let [k, v] of values) {
                        currentStyleMap.set(k, v);
                    }
                }
            }
            this.styleEle.innerText = this.mapToString(currentMap);
        }
        getStyle(selector, styleKey) {
            // 返回一个样式字符串值
            selector = selector.trim();
            return this.stringToMap(this.styleEle.innerText).get(selector).get(styleKey);
        }
        getAllStyle() {
            // 返回的是map对象;
            return this.stringToMap(document.getElementById(this.styleEle.id).innerText);
        }
        removeStyle(selector, styleKeys = []) {
            // styleKey应该是数组;eg,['width','height',...];
            selector = selector.trim();
            let currentMap = this.stringToMap(this.styleEle.innerText);
            let flag = true;

            if (!styleKeys.length) {
                // 1 如果styleKey为空的话，则删除整个选择器
                flag = currentMap.delete(selector);
            } else {
                // 2 非空的话则要每个处理
                let currentStyleMap = currentMap.get(selector);
                if (!currentStyleMap) return false;
                for (let k of styleKeys) {
                    k = k.trim();
                    if (!currentStyleMap.delete(k)) logger.warn(`${selector}->${k} dont exist`);
                }
                if (!currentStyleMap.size) currentMap.delete(selector);
            }
            this.styleEle.innerText = this.mapToString(currentMap);
            return flag;
        }
        observeStyle() {
            // 监测要监视的style标签内容
            this.observers[0] = new MutationObserver(() => {
                if (!this.styleEle.isConnected) {
                    this.connect();
                    logger.warn('style tag is missing, Re-Connected ' + this.styleEle.id);
                }
            });
            // this.observer.observe(document.head,{childList:true,subtree:true,characterData:true,attributeFilter:['class','style','id']});
            if (document.head) {
                this.observers[0].observe(document.head, { childList: true });
            } else {
                this.findElement('head').then(rsp => this.observers[0].observe(rsp[0], { childList: true }));
            }
        }
        connect() {
            if (!this.styleEle) throw Error('无样式对象');
            if (!document.head) {
                this.findElement('head')
                    .then(head => head[0].appendChild(this.styleEle))
                    .catch((e) => {
                        logger.warn('Tag cant insert to document.head immediately, info: ', e);
                        let timer = this.setBFInterval(() => {
                            let result = document.querySelectorAll('head');
                            if (result.length) {
                                result[0].appendChild(this.styleEle);
                                clearInterval(timer);
                                logger.log('Tag low performace insert head!')
                                clearTimeout(t4o);
                            }
                        }, 100);
                        let t4o = setTimeout(() => {
                            clearInterval(timer);
                            logger.error('head cant be found.');
                        }, 60 * 1000);
                    });
            } else {
                document.head.appendChild(this.styleEle);
            }
        }
        run() {
            this.connect();
            this.observeStyle();
        }
    }

    /* 定义样式在行内处理的类 */
    /* 此处的样式设置可能会被网站设置覆盖的样式，为强类型设置 */
    class ModifyStyleFromLine extends ModifyStyleBase {
        constructor() {
            super();
            if (!this.constructor.UNIQUEINSTANCE) {
                this.observers = null;
                // 这是一个补救，用于针对固有样式进行保留(选择器：函数对象);
                this.fixedStyleObj = null;
                this.configs = null;
                this.pEvents = {};
                this.variableSelector = {}; // 此属性处理每次必须变更的对象;[]
                Reflect.defineProperty(this, 'priority', { value: 'Line', configurable: false, enumerable: true, writable: false });
                Reflect.defineProperty(this, 'styleMaps', { value: new Map(), configurable: false, enumerable: true, writable: false });
                Reflect.defineProperty(this.constructor, 'UNIQUEINSTANCE', { value: this, configurable: false, enumerable: false, writable: false });
            } else {
                return this.constructor.UNIQUEINSTANCE;
            }
        }
        getAllStyle() {
            return this.styleMaps;
        }
        getStyle(selector, styleKey) {
            // 返回一个样式字符串值
            return this.styleMaps.get(selector.trim()).get(styleKey.trim());
        }
        setStyle(css) {
            // css 可以是样式对象或者是css文本;filter指定给满足条件的元素添加样式,可以是NodeList或[[HTMLElement]],或者回调函数;
            // 需要覆盖固有样式中希望被覆盖掉的;
            // let cssTest = "div {width:30px  ;height: 40px;}span a ,b> strong {color:'red';line-height:1rem}";
            let newStyleMap = this.stringToMap(css);
            let currentMap = this.styleMaps;
            for (let [selector, values] of newStyleMap) {
                let currentStyleMap = currentMap.get(selector);
                if (!currentStyleMap) {
                    currentMap.set(selector, values);
                } else {
                    for (let [k, v] of values) {
                        currentStyleMap.set(k, v);
                    }
                }
            }
        }
        updateGlobalStyle() {
            for (let [selector, styleItems] of this.styleMaps) {
                let nodeList = document.querySelectorAll(selector);
                //logger.log(selector,'设置样式===>',nodeList);
                let cssText = '';
                for (let [k, v] of styleItems) {
                    cssText = cssText + k + ":" + v + ";";
                }
                // 处理每个元素固有样式中想被保留的;
                for (let ele of nodeList) {
                    let cssTmp = cssText;
                    if (selector in this.fixedStyleObj) {
                        let filterStyleObj = this.fixedStyleObj[selector](ele);
                        cssTmp += filterStyleObj.cur;
                        let oldStyle = [...this.string2DToMap(ele.style.cssText).keys()];
                        oldStyle.sort();
                        let newStyle = [...this.string2DToMap(cssTmp + filterStyleObj.delay).keys()];
                        newStyle.sort();
                        if (newStyle.toString() != oldStyle.toString()) ele.style.cssText = cssTmp;
                    } else {
                        let oldStyle = [...this.string2DToMap(ele.style.cssText).keys()];
                        oldStyle.sort();
                        let newStyle = [...this.string2DToMap(cssTmp).keys()];
                        newStyle.sort();
                        if (newStyle.toString() != oldStyle.toString()) ele.style.cssText = cssTmp;
                    }
                    // 处理计算样式
                    if (Object.keys(this.variableSelector).includes(selector)) {
                        for (let stykey of this.variableSelector[selector]) {
                            // stykey 是每个需要计算和检查的stykey;
                            if (styleItems.get(stykey) !== this.string2DToMap(ele.style.cssText).get(stykey)) {
                                ele.style[stykey] = styleItems.get(stykey);
                            }
                        }
                    }
                }
            }
        }
        removeStyle(selector, styleKeys = []) {
            // 调试用方法
            // styleKey应该是数组;eg,['width','height',...];
            let currentMap = this.styleMaps.get(selector);
            if (!currentMap) return false;
            for (let key of styleKeys) {
                if (!currentMap.delete(key)) logger.log(key + ' is not exist.');
            }

            let nodeList = document.querySelectorAll(selector);
            let cssText = '';
            if (!currentMap.size) {
                this.styleMaps.delete(selector);
            } else {
                for (let [k, v] of currentMap) {
                    cssText = cssText + k + " :" + v + ";";
                }
            }
            // 合并固有样式(始终保留，不能移除的)
            for (let ele of nodeList) {
                let cssTmp = cssText;
                if (selector in this.fixedStyleObj) {
                    cssTmp += this.fixedStyleObj[selector](ele).cur;
                }
                ele.style.cssText = cssTmp;
            }
        }
        observeStyle() {
            for (let item of this.observers) {
                item.observer = new MutationObserver((_, obs) => {
                    // 主要是根据DOM变化确定每一次变化的时候被观察元素依然存在;
                    let flag = true;
                    let l = 1;
                    while (l--) {
                        // 初始化 空，需要赋值元素
                        if (!item.target) {
                            item.target = document.querySelector(item.selector);
                            if (!item.target) {
                                logger.error('变更.但是未查找到元素');
                                break;
                            }
                            this.updateGlobalStyle();
                            obs.observe(document.querySelector(item.eyeSlector), item.options);
                            logger.warn('变更,填充空target');
                        }
                        if (!item.target.isConnected) {
                            // 说明DOM变更，前后查找到的元素不一样,但是不影响，
                            item.target = document.querySelector(item.selector);
                            if (!item.target) break;
                            logger.warn('变更,更换旧target-修正');
                            // 这里还要重新监测observe
                            obs.observe(document.querySelector(item.eyeSlector), item.options);
                            this.updateGlobalStyle();
                        } else {
                            // 连接，但是变化太慢导致下次触发DOM变更以前为空，出现样式空白;
                            for (let sp of item.specialJudge) {
                                if (!item.target.style.cssText.includes(sp)) {
                                    logger.warn(`变更,样式空白-修正`);
                                    this.updateGlobalStyle();
                                    break;
                                }
                            }
                        }
                        flag = false;
                    }
                    if (flag) {
                        // 为真说明元素丢失;设置定时器，直到查找到并重新赋值 观察 归位
                        logger.warn('暂时丢失，等待变更');
                    }
                });
            }
            // 开始观察
            for (let item of this.observers) {
                let tmpNode = document.querySelector(item.eyeSlector);
                if (!tmpNode) {
                    this.updateGlobalStyle();
                    this.findElement(item.eyeSlector).then(rsp => {
                        item.observer.observe(rsp[0], item.options);
                        // 找到后先执行一次添加样式，因为可能eyeselector要等很久才能变更节点
                        this.updateGlobalStyle();
                    }).catch(selectorAsync => logger.error(`异步查询，未找到：${selectorAsync}`));
                } else {
                    item.observer.observe(tmpNode, item.options);
                }
            }
        }
        subcribeGlobal() {
            //开启全局事件监听--私有事件另行监听
            // 1、监听URL地址变化，地址变化就更新this.styleMaps里面的背景样式;
            let imgsAvi = this.getAllAvailableBg(this.configs.bg);
            let context = { lock: false, bgStr: '', bgObjNext: null, bgObjPrev: null };
            let bgImgObj = this.getSingleBg(imgsAvi);

            if (!bgImgObj) {
                this.setStyle(`body{background-image:none;}`);
                logger.log('当前无有效背景图像');
                return;
            } else {
                this.getFirstPage(imgsAvi, 5).then(imgObj => {
                    if (imgObj !== true) {
                        context.bgObjPrev = imgObj;
                        if (!context.bgStr) context.bgStr = imgObj.blobUrl || imgObj.url;
                        logger.log('当前背景图像: ' + (imgObj.name || imgObj.url))
                        this.setStyle(`body{background-image:url("${imgObj.blobUrl || imgObj.url}");}`);
                    } else {
                        logger.log("所有在线请求失败,无有效图像.")
                        this.setStyle("body{background-image:none;}");
                    }
                    this.updateGlobalStyle();
                });
            }
            if (this.configs.bgSwitchMode === 'multi' && imgsAvi.length > 1) {
                history.pushState = this.wrapperEvent('pushstate', history.pushState);
                let changeBg = (() => {
                    // 设定时间阀值，避免可能的重复设置背景
                    let timePre = new Date();
                    let timeCur = 0;
                    let pt = /^url\((['"]?)(blob[^"']*?)\1\)/i;
                    //  初始化第一次的图片
                    context.bgObjNext = this.getDifferPreviousSingleBg(bgImgObj, imgsAvi);
                    this.handleImg(context);

                    return function () {
                        timeCur = new Date();
                        if (!context.lock) return;
                        if (timeCur - timePre < this.configs.duration * 1000) return;
                        context.lock = false;

                        let bg = this.getStyle('body', 'background-image');
                        logger.log(`前一张:[${bg}]\n当前的:[url("${context.bgStr}")]`);
                        if (bg !== `url("${context.bgStr}")`) {
                            if (pt.test(bg)) {
                                URL.revokeObjectURL(bg.match(pt)[2]);
                                logger.summary(`已经释放:${bg}`);
                            }
                            this.setStyle(`body{background-image:url("${context.bgStr}");}`);
                            this.updateGlobalStyle();
                            logger.log('当前背景图像: ' + (context.bgObjNext.name || context.bgObjNext.url));
                            timePre = timeCur;
                        }
                        logger.log('全局调试对象$_SM:');
                        logger.dir($_SM);
                        // 准备下一次点击的图片;
                        context.bgObjNext = this.getDifferPreviousSingleBg(context.bgObjNext, imgsAvi);
                        this.handleImg(context);
                    };
                })();
                window.addEventListener('pushstate', changeBg.bind(this));
                window.addEventListener('popstate', changeBg.bind(this));
            }
        }
        subcribePrivate() {
            //定义私有事件;
            for (let key of Object.keys(this.pEvents)) {
                this.pEvents[key].call(this);
            }
        }
        run() {
            this.subcribeGlobal();
            this.subcribePrivate();
            this.updateGlobalStyle();
            this.observeStyle();
        }
    }

    /* 此类用于实例化不同网站的设置 */
    class Context extends Base {
        constructor(tagRules, lineRules, adRules, fixedStyleObj, observers, configs, pEvents) {
            super();
            this.startUrl = location.host;
            if (!(tagRules || lineRules || adRules)) throw TypeError('无效对象');

            this.lineStyleSatndardRules = lineRules.standardStyle || '';
            this.lineStyleVariableSelector = lineRules.variableStyleSelector || '';
            this.tagStyleRules = tagRules || '';

            this.adSoft = adRules.adSoft || [];
            this.adHard = adRules.adHard || [];
            this.adDynamic = adRules.adDynamic || [];

            this.pEvents = pEvents || {};

            this.fixedStyleObj = fixedStyleObj || {};
            this.observers = observers || [];
            this.configs = configs || userGlobalConfigs;
            this.maid = [];
        }
        configInit() {
            // 1、根据网速选择不同，重新包装findElement方法;
            let curObj = Object.getPrototypeOf(this);
            while (curObj) {
                if (Object.prototype.hasOwnProperty.call(curObj, 'findElement')) {
                    let findElement = curObj.findElement;
                    curObj.findElement = (() => {
                        let timeout, fq, intvl;
                        switch (this.configs.netThrottlMode) {
                            // 'low','middle','heigh','infinity'
                            case 'low':
                                ({ timeout, fq, intvl } = { timeout: 7, fq: true, intvl: 100 });
                                break;
                            case 'middle':
                                ({ timeout, fq, intvl } = { timeout: 12, fq: true, intvl: 120 });
                                break;
                            case 'heigh':
                                ({ timeout, fq, intvl } = { timeout: 20, fq: true, intvl: 300 });
                                break;
                            case 'infinity':
                                ({ timeout, fq, intvl } = { timeout: 30, fq: true, intvl: 500 });
                                break;
                            default:
                                ({ timeout, fq, intvl } = { timeout: 3, fq: false, intvl: 75 });
                        }
                        return function (selector, signal = null) {
                            return findElement.call(this, selector, timeout, fq, intvl, signal);
                        }
                    })();
                    break;
                } else {
                    curObj = Object.getPrototypeOf(curObj);
                }
            }
            // 2、移除禁用配置
            if (Object.getPrototypeOf(this.configs) !== Object.prototype) {
                for (let key of Reflect.ownKeys(this.configs)) {
                    if (['bg', 'isDebug', 'baidu', 'sou360'].includes(key)) {
                        delete this.configs[key];
                        logger.warn(`禁用用户 [${key}] 配置项.`)
                    }
                }
            }
            // 3、添加用户不可见全局配置
            this.configs.cache = 'myImgs';
            // 修订限制性配置
            this.configs.duration = this.configs.duration < 3 ? 3 : this.configs.duration;
        }
        globalTodo() {
            //每个网站都要做的事情
            // 广告软消除
            window.addEventListener('load', () => {
                this.adSoft.forEach(selector => { (new AntiAdSoft(selector.trim())).run(); })
            });
            document.addEventListener('abort', () => {
                this.adSoft.forEach(selector => { (new AntiAdSoft(selector.trim())).run(); })
            });
            // 广告硬消除
            for (let selector of this.adHard) {
                (new AntiAdHard(selector.trim())).run();
            }

        }
        go() {
            // 此方法用于启动所有样式广告监听等
            this.configInit();
            let line = new ModifyStyleFromLine();
            line.pEvents = this.pEvents;
            line.configs = this.configs;
            line.observers = this.observers;
            line.fixedStyleObj = this.fixedStyleObj;
            line.variableSelector = this.lineStyleVariableSelector;
            let tag = new ModifyStyleFromTag();
            // 动态广告置于此处
            let adDy = new AntiAdDynamic(this.adDynamic);

            line.setStyle(this.lineStyleSatndardRules); //冷处理
            tag.setStyle(this.tagStyleRules);//冷处理
            for (let item of [line, tag, adDy]) {
                this.maid.push(item);
                item.run();
            }
            this.globalTodo();
        }
    }

    /* 此类用于生成图形化用户级配置面板 */
    class ConfiguraturesByUserModify {
        constructor() {
            this.name = '设置面板';
            this.panelId = '$2BeautyToMacConfigPanel';
        }
        getPanel() {
            // 没有面板就创建面板，否则返回面板的引用;
            let configPanel = document.getElementById(this.panelId);
            if (!configPanel) {
                configPanel = document.createElement('div');
                configPanel.id = this.panelId;
                configPanel.style.cssText = `position:fixed;right:48px;top:48px;z-index:5000;`;
                let root = configPanel.attachShadow({ mode: 'open' });
                root.innerHTML = `<style>
                ol{
                    padding-left: 0px;
                    list-style-position: inside;
                }
                div.panel{
                    border: 1px gray solid;
                    border-radius: 12px;
                    padding: 16px;
                    min-width: 280px;
                    background-color: wheat;
                    position: relative;
                }
                h4.title{
                    font-size: large;
                    text-align: center;
                    margin: 12px auto;
                }
                .item-title{
                    font-size: 16px;
                    font-weight: bold;
                }
                .panel-item{
                    padding-bottom: 6px;
                    border-bottom: 1px black dotted;
                    margin-bottom: 5px;
                }
                .item-container{
                    margin-top: 8px;
                }
                .item-content{
                    display: inline-block;
                    margin-left: 12px;
                }
                input[type="color"],input[type="range"],input[type="number"]{
                    width: 110px;
                }
                /* close-logo处理 */
                .close-logo{
                    position: absolute;
                    right: 12px;
                    top:12px;
                    cursor: pointer;
                }
                </style>
                <div class="panel">
        <h4 class='title'>BeautyToMac设置面板</h4>
        <span class="close-logo" title="关闭" id="xclose">[<span style="color: red;">&#215;</span>]</span>
        <ol>
            <li class="panel-item">
                <span class="item-title">内容区域颜色:</span>
                <div class="item">
                    <div class="item-container">
                        <label class="item-content">
                            <input type="color" value="#C7EDCC"><span class="item-content-commit">(点击取色)</span>
                        </label>
                    </div>
                </div>
            </li>
            <li class="panel-item">
                <span class="item-title">内容区域透明度:</span>
                <div class="item">
                    <div class="item-container">
                        <label class="item-content">
                            <input type="range" name="opacity" max="100" min="0" value="80">
                        </label>
                    </div>
                </div>
            </li>
            <li class="panel-item">
                <span class="item-title">背景切换模式:</span>
                <div class="item-container">
                    <label class="item-content">
                        <input type="radio" name="bgmode" value="轮播" checked><span class="item-content-commit">轮播</span>
                    </label>
                    <label class="item-content">
                        <input type="radio" name="bgmode" value="唯一"><span class="item-content-commit">唯一</span>
                    </label>
                </div>
            </li>
            <li class="panel-item">
                <span class="item-title">切换时间间隔:</span>
                <div class="item-container">
                    <label class="item-content">
                        <input type="number" min="3" max="20" value="5" oninput="value=value.replace(/[^\d]/g,'');value<3?value=3:value>20?value=20:value=value;"><span class="item-content-commit">秒</span>
                    </label>
                </div>
            </li>
            <li class="panel-item">
                <span class="item-title">网络节流模式:</span>
                <div class="item-container">
                    <label class="item-content"><input type="radio" name="ntm" value="server"><span class="item-content-commit">server</span></label>
                    <label class="item-content"><input type="radio" name="ntm" value="4/5G" checked><span class="item-content-commit">4/5G</span></label>
                    <label class="item-content"><input type="radio" name="ntm" value="3G"><span class="item-content-commit">3G</span></label>
                    <label class="item-content"><input type="radio" name="ntm" value="2G"><span class="item-content-commit">2G</span></label>
                </div>
            </li>
            <li class="panel-item">
                <span class="item-title">键盘左右导航:</span>
                <div class="item-container">
                    <label class="item-content">
                        <input type="radio" name="kbn" value="开启" checked><span class="item-content-commit">开启</span>
                    </label>
                    <label class="item-content">
                        <input type="radio" name="kbn" value="关闭"><span class="item-content-commit">关闭</span>
                    </label>
                </div>
            </li>
            <li class="panel-item">
                <span class="item-title">空白左右导航:</span>
                <div class="item-container">
                    <label class="item-content">
                        <input type="radio" name="wsn" value="开启" checked><span class="item-content-commit">开启</span>
                    </label>
                    <label class="item-content">
                        <input type="radio" name="wsn" value="关闭"><span class="item-content-commit">关闭</span>
                    </label>
                </div>
            </li>
            <li class="panel-item">
                <button class="item-title">背景图像管理&gt;&gt;</button>
            </li>
        </ol>
    </div>
                `;
                document.body.append(configPanel);
            }
            setTimeout(() => {
                configPanel.shadowRoot.getElementById('xclose').addEventListener('click', function (e) {
                    e.preventDefault();
                    configPanel.remove();
                    configPanel = null;
                })
            })
            return configPanel;
        }
    }

    let userPrivateConfigs = Object.create(userGlobalConfigs);
    let tagStyle, fixedStyleObj, lineStyle, adRules, obs4DOM, pEvents;

    if (userGlobalConfigs.baidu && location.href.match(/^https?:\/\/w{0,3}\.baidu\.com/i) && ['/', '/s', '/more/'].includes(location.pathname.toLowerCase())) {
        // 百度私有用户配置
        Object.assign(userPrivateConfigs, {
            // 此处书写可以覆盖全局的配置
            netThrottlMode: 'low',
        });
        // 1、Tag 配置
        // #head 用于兼容谷歌浏览器渲染过慢导致的空白显示问题，firefox可以移除此项;
        tagStyle = `
            #s_top_wrap{
                background-color: #ffffff53;
                backdrop-filter: blur(2px);
            }
            #s-top-more{
                background-color:#ffffff4d;
            }
            #head{
                background-color:rgba(255, 255, 255, 0.3)!important;box-shadow:rgba(0, 0, 0, 0.5) 2px 0px 5px 2px;backdrop-filter:blur(2px);
            }
            #wrapper_wrapper{
                cursor:pointer;
            }
            #content_left{
                margin-left: unset !important;
                padding-left: unset !important;
            }
            #s_tab>div.s_tab_inner:hover{
                opacity:0.8;
            }
            #s_tab>div.s_tab_inner{
                opacity:0;
            }
            #head_wrapper input#kw,#form .bdsug,#form .s_ipt_wr{
                background-color:#ffffffa0;
            }
            #form .s_ipt_wr,#kw{
                border-top-left-radius: 1rem;
                border-bottom-left-radius: 1rem;
            }
            #form .bdsug li:hover{
                background-color:#ffffffa0;
            }
            #foot div.foot-inner {
                background-color:#fff0 !important;
            }
            .wrapper_new #head.peak-down.s_down{
                background-color:#fff0 !important;
            }
            #wrapper #s_tab div a,wrapper #s_tab div .s-tab-item::before,#wrapper #s_tab div b,#wrapper #s_tab div .s-tab-item::before,#wrapper #s_tab div .cur-tab::before{
                color:black !important;
            }
            #wrapper #s_tab div a:hover,wrapper #s_tab div .s-tab-item::before:hover,#wrapper #s_tab div b:hover,#wrapper #s_tab div .s-tab-item::before:hover,#wrapper #s_tab div .cur-tab::before:hover{
                color:blue !important;
            }
            .foot{
                background-color:#ffffff4d;
            }
            #foot{
                opacity:0 !important;
            }
            #head_wrapper #s-hotsearch-wrapper,div#bottom_layer,div#s_side_wrapper,#head_wrapper #m,#searchTag{
                display:none !important;
            }
            #head_wrapper.s-ps-islite{
                padding-bottom:0px !important;
            }
            #s_tab a, #s_tab b{
                margin-right:0px !important;
            }
            `;

        // 2、Line 配置 --- 固有样式 ---
        fixedStyleObj = {
            "#head": function (ele) {
                let urlPt = new URL(ele.baseURI);
                if (urlPt.pathname === '/' || (urlPt.pathname === '/s' && (!urlPt.search))) {
                    return { cur: 'background-color:unset!important;backdrop-filter:none;', delay: '' }
                } else {
                    return { cur: '', delay: '' };
                }
            },
            // 侧边栏居中
            "#s_tab>div.s_tab_inner": function (ele) {
                setTimeout(() => {
                    ele.style.cssText += `margin-top:${ele.getBoundingClientRect().height / -2}px;`;
                });
                setTimeout(() => {
                    ele.style.opacity = null;
                    ele.style.left = '0px';
                }, 50);
                return { cur: 'opacity:0;', delay: `margin-top:${ele.getBoundingClientRect().height / -2}px;left:0px;` };
            },
        };

        // 3、Line 配置 --- 标准样式 ---
        lineStyle = {
            // #page bottom:-100px;用于解决底部栏闪烁问题;在固有样式中异步恢复
            // #s_tab>div.s_tab_inner left:-100px;用于解决左侧栏闪烁问题;在固有样式中异步恢复
            standardStyle: `
                body{
                    background-repeat:no-repeat;background-position:center;background-attachment:fixed;background-size:cover;
                }
                #page{
                    background-color:#ffffff4d;box-shadow:rgba(0, 0, 0, 0.5) 0px -1px 5px 2px;backdrop-filter:blur(2px);
                    position:fixed;bottom:0px;left:50%;border-radius:12px;z-index:1400;transform:translateX(-50%);margin-top: 0px;
                }
                #foot{
                    background-color:#ffffff00;
                }
                #page>div{
                    padding:14px;
                    width:min-content;
                }
                #page>div>*:last-child{
                    margin-right:0px;
                }
                #container{
                    background-image:linear-gradient(to right,rgba(255, 255, 255, 0.75) 25%,rgba(255, 255, 255, 0.15));box-sizing:border-box;cursor:default;
                    box-shadow:rgba(0, 0, 0, 0.5) 0px 0px 5px 2px,inset 0px 0px 5px 1px white;margin-bottom:0.5rem;padding:2.5em;border-radius:12px;
                }
                #head{
                    background-color:rgba(255, 255, 255, 0.3)!important;box-shadow:rgba(0, 0, 0, 0.5) 2px 0px 5px 2px;backdrop-filter:blur(2px);
                }
                #s_tab>div.s_tab_inner{
                    position:fixed;left:-100px;z-index:302;top:50%;border-top-right-radius:16px;border-bottom-right-radius:16px;width:60px;
                    transition:all 0.3s;background-color:#fff;
                }
                `,
            //    Line 配置 --- 计算样式(选择) ---
            variableStyleSelector: {
                'body': ['background-image'],
            }
        };

        // 4、Ad 配置
        adRules = {
            // 4、Ad (soft)配置
            adSoft: [
                '.s-hotsearch-wrapper.s-isindex-wrap', '.s-isindex-wrap.s-bottom-layer', '[tpl=recommend_list]',
                '#rs_new', '#s_side_wrapper', '#content_right div.hint_right_middle', '#help', '#searchTag',
            ],
            // 4.1 Ad (hard配置)
            adHard: [],
            adDynamic: [],
        };

        // 5、监测配置(Line)
        obs4DOM = [
            { 'selector': '#head', "target": null, 'eyeSlector': 'body', 'observer': null, 'options': { childList: true }, specialJudge: ['background-color'] },
            //{'selector':'#s_tab>div.s_tab_inner',"target":null,'eyeSlector':'#s_tab','observer':null,'options':{childList:true},specialJudge:['opacity']},
            //{'selector':'#wrapper',"target":null,'eyeSlector':'body','observer':null,'options':{childList:true},specialJudge:[]},
            { 'selector': '#page', "target": null, 'eyeSlector': '#wrapper_wrapper', 'observer': null, 'options': { childList: true, subtree: true }, specialJudge: [] },
        ];

        // 6、私有事件配置(写在外部便于配置)
        pEvents = {
            '#container': function () {
                // 设置背景
                if (this.configs.centerColor) this.setStyle(`#container{background-color:${this.configs.centerColor.trim()};}`);
            },
            '#page .n': function () {
                // 设置键盘左右建翻页导航
                let that = this;
                function navi() {
                    if (that.configs.keyBoardNav) {
                        document.addEventListener('keydown', function (e) {
                            if (!(e.key === 'ArrowLeft' || e.key === 'ArrowRight')) return;
                            if (document.activeElement.tagName.toUpperCase() === 'INPUT') return;
                            let nodes = document.querySelectorAll('#page .n');
                            if (nodes.length && e.key === 'ArrowLeft') {
                                for (let item of nodes) {
                                    if (item.textContent.split('').includes('上')) item.click();
                                }
                            } else if (nodes.length && e.key === 'ArrowRight') {
                                for (let item of nodes) {
                                    if (item.textContent.split('').includes('下')) item.click();
                                }
                            } else {
                                logger.log('nodes条件不足,略过本次')
                            }
                        })
                    }
                }
                window.addEventListener('load', navi);
                document.addEventListener('abort', navi);
            },
            '#wrapper_wrapper': function () {
                // 设置左右点击空白翻页导航
                let that = this;
                function navi() {
                    if (that.configs.whiteNav) {
                        document.addEventListener('click', function (e) {
                            let targetFlag = 'wrapper_wrapper', selectorFlag = '#page .n';
                            let targetNode = document.getElementById(targetFlag);
                            let nodes = document.querySelectorAll(selectorFlag);
                            if (e.target === targetNode && nodes.length) {
                                if (e.clientX < parseInt(getComputedStyle(targetNode).width) / 2) {
                                    for (let item of nodes) {
                                        if (item.textContent.split('').includes('上')) item.click();
                                    }
                                } else {
                                    for (let item of nodes) {
                                        if (item.textContent.split('').includes('下')) item.click();
                                    }
                                }
                            }
                            // else{
                            //     logger.warn('点击导航异常');
                            //     logger.dir(targetNode,nodes.length,e.target);
                            // }
                        })
                    }
                }
                window.addEventListener('DOMContentLoaded', navi);
                document.addEventListener('abort', navi);
            },
            'quickAccessSearchBox': function () {
                // 快捷键 ctrl + y 搜索框聚焦
                if (this.configs.allowSearchBox) {
                    document.addEventListener('keydown', function (e) {
                        if (e.key.toLowerCase() === 'y' && e.ctrlKey) {
                            e.preventDefault();
                            let kw = document.querySelector('#kw');
                            kw ? kw.focus() : console.log('SearchAccess cant found searchBox');
                        }
                    })
                }
            }
        };
    } else if (userGlobalConfigs.baidu && location.href.match(/^https?:\/\/w{0,3}\.baidu\.com/i) && location.pathname.toLowerCase() === '/sf/vsearch') {
        // 百度视频页面
        Object.assign(userPrivateConfigs, {
            // 此处书写可以覆盖全局的配置
            netThrottlMode: 'low',
        });
        // 1、Tag 配置
        tagStyle = `
                #s_tab>div.s_tab_inner:hover{
                    opacity:0.8;
                }
               #s_tab>div.s_tab_inner{
                    opacity:0;
                }
                #wrapper #s_tab div a,wrapper #s_tab div .s-tab-item::before,#wrapper #s_tab div b,#wrapper #s_tab div .s-tab-item::before,#wrapper #s_tab div .cur-tab::before{
                color:black !important;
            }
                #wrapper #s_tab div a:hover,wrapper #s_tab div .s-tab-item::before:hover,#wrapper #s_tab div b:hover,#wrapper #s_tab div .s-tab-item::before:hover,#wrapper #s_tab div .cur-tab::before:hover{
                color:blue !important;
            }
            #s_tab a, #s_tab b{
                margin-right:0px !important;
            }
            `;
        fixedStyleObj = {
            "#s_tab>div.s_tab_inner": function (ele) {
                setTimeout(() => {
                    ele.style.cssText += `margin-top:${ele.getBoundingClientRect().height / -2}px;`;
                });
                setTimeout(() => {
                    ele.style.opacity = null;
                    ele.style.left = '0px';
                }, 50);
                return { cur: 'opacity:0;', delay: `margin-top:${ele.getBoundingClientRect().height / -2}px;left:0px;` };
            },
        };
        lineStyle = {
            standardStyle: `
                body{
                    background-repeat:no-repeat;background-position:center;background-attachment:fixed;background-size:cover;
                }
                #s_kw_wrap{
                background-color: #ffffffad;
                }
                #container {
                    background-image: linear-gradient(
                        to right,
                        rgba(255, 255, 255, 0.75) 25%,
                        rgba(255, 255, 255, 0.15)
                    );
                    box-sizing: border-box;
                    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 5px 2px, white 0px 0px 5px 1px inset;
                    padding: 2.5em;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: row-reverse;
                    width: min-content;
                    margin: auto;
                }
                #content_left {
                    padding-right: 140px;
                    padding-left: 0px;
                }
                #head{
                    background-color:rgba(255, 255, 255, 0.3)!important;box-shadow:rgba(0, 0, 0, 0.5) 2px 0px 5px 2px;backdrop-filter:blur(2px);
                }
                #s_tab>div.s_tab_inner{
                    position:fixed;left:-100px;z-index:302;top:50%;border-top-right-radius:16px;border-bottom-right-radius:16px;width:60px;
                    transition:all 0.3s;background-color:#fff;
                }
                .s_side_wrapper{
                    display: none;
                }`,
            variableStyleSelector: {},
        };
        adRules = {
            // Ad (soft)配置
            adSoft: [],
            // Ad 硬处理(只能删除节点的类型);给选择器即可
            adHard: [],
            // Ad 专用动态规则集
            adDynamic: []
        };
        obs4DOM = [
            { 'selector': '#head', "target": null, 'eyeSlector': 'body', 'observer': null, 'options': { childList: true }, specialJudge: ['background-color'] },
        ];
        pEvents = {
            '#container': function () {
                if (this.configs.centerColor) this.setStyle(`#container{background-color:${this.configs.centerColor.trim()};}`);
            },
        };

    } else if (userGlobalConfigs.sou360 && location.href.match(/^https?:\/\/w{0,3}\.so\.com/i) && location.pathname.toLowerCase() === '/') {
        //360首页
        Object.assign(userPrivateConfigs, {
            // 此处书写可以覆盖全局的配置
            netThrottlMode: 'low',
        });
        // 1、Tag 配置
        tagStyle = `
            #footer{
                display:none;
            }
            #header{
                background-color:#ffffff6b;
                backdrop-filter:blur(2px);
            }
            fieldset#input-container{
                background-color:rgba(255, 255, 255, 0.75);
            }
            div#suggest-align{
                background-color:#ffffff00;
            }
            div#goto-top,#main .gold-wrap{
                display:none!important;
            }
            `;

        // 2、Line 配置 --- 固有样式 ---
        fixedStyleObj = {
            //selector:function(ele){}
        };

        // 3、Line 配置 --- 标准样式 ---
        lineStyle = {
            standardStyle: `
                body{
                    background-repeat:no-repeat;background-position:center;background-attachment:fixed;background-size:cover;
                }
                #skin_bg{
                    background-color:rgba(255, 255, 255, 0);
                }
                #card_container{
                    display:none;
                }
                #bd_search .fixed{
                    background-color:rgba(255, 255, 255, 0);
                }
                `,
            //    Line 配置 --- 计算样式(选择) ---
            variableStyleSelector: {
                '#skin_bg': ['background-color'],
                // 都要有的背景
                'body': ['background-image'],
            }
        }
        // 4、Ad 配置
        adRules = {
            // Ad (soft)配置
            adSoft: [],
            // Ad 硬处理(只能删除节点的类型);给选择器即可
            adHard: [
                '#goto-top', '#often_so'
            ],
            // Ad 专用动态规则集
            adDynamic: [
                //{ref:'#lawnfooter-samll__btne',fire:(eles)=>{return [eles[0]]},options:{childList:true}},
                {
                    ref: '#lawnfooter-samll__btn', eyeSlector: 'body', options: { childList: true }, fire: (eles) => {
                        //eles 是重找规则里面的元素集
                        let pE = eles[0];
                        for (; ;) {
                            if (pE.parentElement === document.body) {
                                return [pE];
                            } else {
                                pE = pE.parentElement;
                            }
                        }
                    },
                },
            ],
        }

        // 5、监测配置(Line)
        obs4DOM = [
            { 'selector': '#card_container', "target": null, 'eyeSlector': '#main', 'observer': null, 'options': { childList: true }, specialJudge: ['display'] },
        ];
        pEvents = {};

    } else if (userGlobalConfigs.sou360 && location.href.match(/^https?:\/\/w{0,3}\.so\.com/i) && location.pathname.toLowerCase() === '/s') {
        //360搜索结果页面
        Object.assign(userPrivateConfigs, {
            // 此处书写可以覆盖全局的配置
            netThrottlMode: 'low',
        });
        // 1、Tag 配置
        tagStyle = `
            html{
                background-color: unset !important;
            }
            div#header{
                background-color: transparent;
            }
            #header div.inner{
                background: #ffffff70;
                box-shadow: black 0px 0px 5px 1px;
                backdrop-filter: blur(2px);
            }
            ul.g-menu{
                background-color: #ffffffe8;
            }
            #g-hd #head .round{
                background-color: #ffffffb0;
            }
            #head #keyword{
                background-color: #fff0;
            }

            div#tabs-wrap{
                border:none;
            }
            ul#g-hd-tabs{
                position: fixed;
                width: min-content;
                left: 0px;
                top:50%;
                height:min-content;
                transform:translateY(-50%);
                background-color: #eee;
                z-index:3000;
                border-top-right-radius:16px;
                border-bottom-right-radius:16px;
                opacity:0;
                transition:opacity 0.3s;
            }
            ul#g-hd-tabs:hover{
                opacity:0.85;
            }
            #tabs-wrap ul#g-hd-tabs li.g-hd-cur a {
                color: #0fb264 !important;
              }
            #tabs-wrap ul#g-hd-tabs li a{
                color:black !important;
            }
            div#container{
                margin: 0px auto 6rem;
                padding: 2rem;
                border-radius: 12px;
                background-image: linear-gradient(to right,rgba(255, 255, 255, 0.75) 25%,rgba(255, 255, 255, 0.15));
                box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 5px 2px,inset 0px 0px 5px 1px white;
                border-radius: 12px;
                display:-webkit-flex;
                display:-moz-flex;
                display:flex;
                justify-content:center;
                width:min-content;
                cursor:default;
            }
            div#warper{
                cursor:pointer;
            }
            div#main{
                padding-left: 2rem;
                margin-right:6%;
                box-sizing: border-box;
                min-width:608px;
            }
            div#container>div:last-child{
                display:none!important;
            }
            #warper div.mod-relation,#main .inline-recommend{
                display: none !important;
            }

            #warper #page{
                position: fixed;
                bottom: 0px;
                margin: 0px;
                left:0px;
                right:0px;
                z-index: 3000;
                padding-left: 10px;
                background-color: #ffffff4d;
                box-shadow: rgba(0, 0, 0, 0.5) 0px -1px 5px 2px;
                backdrop-filter: blur(2px);
                border-radius: 10px;
                padding-top: 14px;
                padding-bottom: 14px;
                margin-left: auto;
                margin-right: auto;
                width: min-content;
            }
            #page span.nums{
                display: none !important;
            }
            div#page a, div#page strong{
                background: #fff;
                border: 1px solid #eee;
                border-radius: 8px;
                color: #666;
                display: inline-block;
                font-size: 14px;
                height: 34px;
                line-height: 34px;
                margin-right: 12px;
                text-align: center;
                text-decoration: none;
                vertical-align: middle;
                width: 34px;
            }
            div#page strong{
                background: #0fb264;
                border-color: #0fb264;
                box-shadow: 0 1px 3px rgba(188,188,188,0.2);
                color: #ffffff;
            }

            div#footer{
                display:none;
            }
            #warper #side{
                left:0px;
                box-sizing:border-box;
                padding-right: 1rem;
                min-width: 400px;
            }
            #mohe-hotnews_right .mh-small-box,#side #adwarnTip,#side #so_kw-ad,#side #lm-rightbottom,div.lianmeng-ad,dl#head_rs_top,#rs-top,.kzx-news-rec-info,
            .lianmeng-ad,#side div.res-mediav-right,dl#head_pdr_guide,div#so_top,div.res-recommend-tag,.double-eleven,div#goto-top{
                display:none!important;
            }
            #warper #side:hover{
                background-color:unset!important;
            }
            div#side_wrap.fixed{
                background-color:rgba(255, 255, 255, 0)!important;
            }
            `;
        /*
        .so-rich-official-recom .inter .inter-ul{
                width:auto !important;
            }
        */

        // 2、Line 配置 --- 固有样式 ---
        fixedStyleObj = {
            // 左侧面板居中
            // 底部栏
        };

        // 3、Line 配置 --- 标准样式 ---
        lineStyle = {
            standardStyle: `
                body{
                    background-repeat:no-repeat;background-position:center;background-attachment:fixed;background-size:cover;
                }
                `,
            //    Line 配置 --- 计算样式(选择) ---
            variableStyleSelector: {
                // 都要有的背景
                'body': ['background-image'],
            }
        }
        // 4、Ad 配置
        adRules = {
            // Ad (soft)配置
            adSoft: [],
            // Ad 硬处理
            adHard: [
                '#so_kw-ad'
            ],
            // Ad 专用动态规则集
            adDynamic: [
                { ref: '#so_top', eyeSlector: 'body', options: { childList: true, subtree: true }, fire: (eles) => { return [...eles] } },
                { ref: '#head_pdr_guide', eyeSlector: '#tabs-wrap', options: { childList: true, subtree: true }, fire: (eles) => { return [...eles] } },
            ],
        }

        // 5、监测配置(Line)
        obs4DOM = [
            { 'selector': 'body', "target": null, 'eyeSlector': 'body', 'observer': null, 'options': { attributeFilter: ['style'] }, specialJudge: ['backgound-image'] },
            { 'selector': 'div#container', "target": null, 'eyeSlector': 'div#warper', 'observer': null, 'options': { childList: true }, specialJudge: ['background-color'] },
        ];
        pEvents = {
            'div#container': function () {
                // 添加中央内容区护眼色等。
                if (this.configs.centerColor) this.setStyle(`div#container{background-color:${this.configs.centerColor.trim()};}`);
            },
            '#spre#snext': function () {
                // 给键盘添加左右导航
                if (this.configs.keyBoardNav) {
                    document.addEventListener('keydown', e => {
                        if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && document.activeElement.tagName.toUpperCase() !== 'INPUT') {
                            if (e.key === 'ArrowLeft') {
                                let ele = document.getElementById('spre');
                                ele && ele.click();
                            } else {
                                let ele = document.getElementById('snext');
                                ele && ele.click();
                            }
                        }
                    });
                }
            },
            '#warper': function () {
                // 添加左右空白导航
                function nav() {
                    document.addEventListener('click', function (e) {
                        if (e.target.id === 'warper') {
                            if (e.clientX < parseInt(getComputedStyle(e.target).width) / 2) {
                                let ele = document.getElementById('spre');
                                ele && ele.click();
                            } else {
                                let ele = document.getElementById('snext');
                                ele && ele.click();
                            }
                        }
                    });
                }
                if (this.configs.whiteNav) {
                    window.addEventListener('DOMContentLoaded', nav);
                    document.addEventListener('abort', nav);
                }
            },
            'quickAccessSearchBox': function () {
                // 快捷键 ctrl + y 搜索框聚焦
                if (this.configs.allowSearchBox) {
                    document.addEventListener('keydown', function (e) {
                        if (e.key.toLowerCase() === 'y' && e.ctrlKey) {
                            e.preventDefault();
                            let kw = document.querySelector('#keyword');
                            kw ? kw.focus() : console.log('SearchAccess cant found searchBox');
                        }
                    })
                }
            }
        };

    } else {
        console.warn('Some Website cant match.');
        return;
    }
    
    function check(it) {
        // Math is known to exist as a global in every environment.
        return it && it.Math === Math && it;
    }

    const globalObject =
        check(typeof window === "object" && window) ||
        check(typeof self === "object" && self) ||
        check(typeof global === "object" && global) ||
        check(typeof globalThis === 'object' && globalThis) ||
        // This returns undefined when running in strict mode
        (function () {
            return this;
        })() ||
        Function("return this")();

    globalObject.$_SM = new Context(tagStyle, lineStyle, adRules, fixedStyleObj, obs4DOM, userPrivateConfigs, pEvents);
    globalObject.$_SM.go();
    logger.log('running');

    let userUISetting = new ConfiguraturesByUserModify;
    // eslint-disable-next-line no-undef
    GM_registerMenuCommand('打开配置面板', userUISetting.getPanel.bind(userUISetting));
})()