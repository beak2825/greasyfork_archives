// https://cdn.jsdelivr.net/gh/sodiray/radash/master/cdn/radash.js
// ==UserScript==
// @name         common_libs_of_array
// @namespace    websiteEnhancement
// @author   jimmly
// @version      2025.11.3
// @description  增加页面顶部底部按钮和一键下种按钮
// @create         2023-9-21
// @include        *
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM.getValue
// @grant         GM.setValue
// @license MIT
// @run-at document-idle
// ==/UserScript==
//https://raw.githubusercontent.com/sodiray/radash/master/cdn/radash.min.js

///  https://cdn.jsdelivr.net/gh/sodiray/radash@12.1.0/cdn/radash.min.js

// addStyle
function addStyle(css) {
    let s = document.createElement('style')
    s.appendChild(document.createTextNode(css))
    document.getElementsByTagName('head')[0].appendChild(s)
}

function getFilePathFromUrl(url) {

    try {
        url = new URL(urlString)
    }
    catch (e) {
        try {
            url = new URL(urlString, window.location.origin)
        }
        catch {

        }
    }
    return url.pathname.split('/').pop() // 或使用 url.pathname.split('/').pop() 如果url已经是一个URL对象
}

const getUrlWithoutHost = radash.memo((urlString) => {
    let url = urlString
    try {
        url = new URL(urlString)
    }
    catch (e) {
        try {
            url = new URL(urlString, window.location.origin)
        } catch {

        }
    }
    return url.href.substring(url.origin.length)
})


class LRUCache {
    cache = []
    _saveMapToLocalStorage = () => {
        const mergedArray = this.loadMapFromLocalStorage().concat(this.cache);
        this.cache = mergedArray.filter((item, index, arr) => arr.indexOf(item) === index);
        if (this.cache.length >= this.capacity) {
            // 如果达到容量限制，删除最老的项
            this.cache.splice(0, this.cache.length - this.capacity)
        }
        // 将Map转换为普通对象
        const obj = this.cache ?? []
        // 将对象转换为JSON字符串
        const jsonString = JSON.stringify(obj)
        // 存储到localStorage
        localStorage.setItem(this.key, jsonString)
    }
    loadMapFromLocalStorage = () => {
        // 从localStorage获取JSON字符串
        const jsonString = localStorage.getItem(this.key)
        if (!jsonString) {
            return [] // 如果没有数据，返回空Map
        }
        // 将JSON字符串转换为普通对象
        try {
            const obj = JSON.parse(jsonString)
            if (Array.isArray(obj))
                return obj
            return Object.keys(obj)
        } catch (error) {

        }
        return []
    }
    autoSave() {

        setTimeout(() => {

            this.saveMapToLocalStorage()
            this.autoSave()
        }, 60_000)
    }
    constructor(key = "default_key", capacity = 500, win) {
        this.saveMapToLocalStorage = radash.debounce({ delay: 300 }, this._saveMapToLocalStorage).bind(this)
        this.key = key
        this.capacity = capacity
        this.compare = function (cacheVal, currVal) {

            if (win.__compareKey) {
                this.compare = (cacheVal, currVal) => win.__compareKey(cacheVal, currVal)
                return win.__compareKey(cacheVal, currVal)
            } else {
                this.compare = (cacheVal, currVal) => cacheVal == currVal
                return cacheVal == currVal
            }
        }

        this.fixValue = (key) => {
            if (win.fixValue) {
                this.fixValue = (value) => win.fixValue(value)
                return win.fixValue(key)
            }
            this.fixValue = (value) => value
            return key
        }
        this.cache = this.loadMapFromLocalStorage()
        this.autoSave()
    }

    get(url) {
        let fixedValue = this.fixValue(getUrlWithoutHost(url))
        let idx = this.cache.findIndex(cacheVal => this.compare(cacheVal, fixedValue))
        if (idx > -1) {
            // 如果存在，则先删除再添加，以更新Map中的顺序（模拟最近最少使用）
            this.cache.splice(idx, 1)
            this.cache.push(fixedValue)
            return fixedValue
        }
        return null
    }
    check(url) {
        window.logDebug("check", url)
        let fixedvalue = this.fixValue(getUrlWithoutHost(url))
        let idx = this.cache.findIndex(cacheVal => this.compare(cacheVal, fixedvalue));
        window.logDebug("check", idx)
        return (idx > -1)
    }
    put(url) {
        window.logDebug("put", url)
        if (this.check(url)) {
            window.logDebug("check hit", () => this.check(url))
            // 如果键已经存在，先删除旧值
            this.cache.splice(idx, 1)
        } else if (this.cache.length >= this.capacity) {
            // 如果达到容量限制，删除最老的项
            this.cache.splice(0, this.cache.length - this.capacity)
        }
        // 添加新值
        let fixedvalue = this.fixValue(getUrlWithoutHost(url))
            window.logDebug("put", fixedvalue)
        this.cache.push(fixedvalue)
    }
    clearAllCache() {
        this.cache.length = 0
        this.saveMapToLocalStorage()
    }
}

// createSuperLabel 创建超链接，不会被拦截
function createSuperLabel(url, id, downloadName, win) {
    win = win ?? window
        window.logDebug("createSuperLabel", url, id, downloadName)
    if (downloadName) {
        win.open(url, '_blank')
        return true
    }
    else {
        const isNotHit = !win.__LRUCache.check(url)
            window.logDebug("isNotHit", isNotHit)
        if (isNotHit) {
            window.logDebug("open", url)
            win.__LRUCache.put(url)
            let newwin = win.open(url, '_blank')
            if (newwin && newwin.opener) {
                newwin.opener.focus()
            }
        }
        let _ = { state: isNotHit, href: getUrlWithoutHost(url) }
            window.logDebug("return", _)
        return { state: isNotHit, href: getUrlWithoutHost(url) }
    }
}

function unique(arr) {
    let obj = {}
    return arr.filter(function (item, index, arr) {
        return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
    })
}

/// ignore \r \t \n space and caseinsitive
function a_Contains_b(a, b) {
    a = a.replace(/(\r\n|[\n\r\t ])/g, "").toLowerCase()
    b = b.replace(/(\r\n|[\n\r\t ])/g, "").toLowerCase()
    if (!!a && !!b && a.includes(b)) {
        return true
    }

    return false
}
function createMenu($, win, isList, funcDownload, funcList, funcDetail) {
    win = win || window
    funcDownload = funcDownload ?? win.funcDownload
    funcList = funcList ?? win.funcList
    funcDetail = funcDetail ?? win.funcDetail

    let w = 40, h = 40;
    addStyle(`
                    a:link{color:green;}
                    a:hover{color:red;}
                    a:active{color:yellow;}
                    a:visited{color:orange;}
                    .btn1   {
                        opacity:0.8;-moz-transition-duration:0.2s;-webkit-transition-duration:0.2s;
                        padding:1px; margin-top:1px;
                        font-size: 10; text-align: center; vertical-align: middle; line-height:${h}px;
                        border-radius:5px 5px 5px 5px;cursor:pointer; left:0px;z-index:9999;
                        background:white;
                        width:${w}px;height:${h}px;
                    }
                `);
    let container = $(document.createElement('div')).css({
        'cssText': `position:fixed;top:15%;width:${w}px;height:${h * 7}px;left:0px;z-index:9999`
    });

    let downloadBtn, closeBtn, fastBtn, switchBtn, slowBtn, refresh;
    //refresh
    refresh = $(document.createElement('div')).text('刷新').appendTo(container)
        .click(function () {
            win.location.reload()
        })
    if (!isList) {

        //下载按钮
        downloadBtn = $(document.createElement('div')).text('下載').appendTo(container)
            .click(function () {
                funcDownload()
            });

        //close
        closeBtn = $(document.createElement('div')).text('關閉').appendTo(container)
            .click(function () {
                win.open("about:blank", "_self").close();
            })
        //加速
        fastBtn = $(document.createElement('div')).text('加速').attr('title', '加速').appendTo(container)
            .click(function () {
                if (win.__wait > 5) {
                    win.__wait = win.__wait / 1.5
                } else {
                    win.__wait = 5
                }
                win.___reset()

            })
        switchBtn = $(document.createElement('div')).text(!win.__t ? '啓' : '停').appendTo(container)
            .click(function () {
                if (!win.__t) {
                    win.__startTimer();
                } else {
                    win.__stopTimer()
                }
            })
        slowBtn = $(document.createElement('div')).text('減速').attr('title', '減速').appendTo(container)
            .click(function () {
                win.__wait *= 1.5
                win.___reset()
            })

        $(document).keydown(function (event) {
            let e = event || win.event;
            let k = e.keyCode || e.which;
            if (k === 16) {
                //  isCtrl = true;
                switchBtn.click()
            } else if (k === 38) {  //up
                event.stopPropagation()
                slowBtn.click()

            } else if (k === 40) {//down
                event.stopPropagation()
                //fastBtn.click()
            }
        })
        $(document).mousedown(function (e) {
            if (e.which == 2) {
                downloadBtn.click();
            }
        })
        $(win).blur(function () {
            win.__stopTimer()
        }).focus(function () {
            win.__startTimer();
        })

        win.__wait = 900
        win.__step = 100;
        win.__startTimer = function () {
            win.______h = $(document).scrollTop() + win.__step;
            if (win.______h >= $(document).height() - $(win).height()) {
                win.__stopTimer()
                // win.__t = setTimeout(win.__startTimer, 30000)
            } else {
                $(document).scrollTop(win.______h);
                win.__t = setTimeout(win.__startTimer, win.__wait)
            }
            win.__syncState()
        };
        win.__stopTimer = function () {
            clearTimeout(win.__t)
            win.__t = 0
            win.__syncState()
        }
        win.___reset = function () {
            win.__stopTimer()
            win.__startTimer();
            win.__syncState()
        }
        win.__syncState = function () {
            fastBtn.text(`${Math.floor(win.__wait)}`)
            slowBtn.text(`${Math.floor(win.__wait)}`)
            switchBtn.text(win.__t ? '停' : '啓')
        }
    }
    else {
        $('tr').hover(
            function () {
                $(this).find('*').css("background-color", "#9AAAC7")
            }, function () {
                $(this).find('*').css("background-color", '');
            });
    }
    //最顶按钮
    let
        toTopBtn = $(document.createElement('div')).text('Top').appendTo(container)
            .click(function () {
                win.scrollTo(0, 0);
            }), //最低按钮
        toBottomBtn = $(document.createElement('div')).text('Bottom').appendTo(container)
            .click(function () {
                win.scrollTo(0, document.body.scrollHeight);
            }),
        setBtn = $(document.createElement('div')).attr('id', 'btnSet').text('設置').appendTo(container)
            .click(function () {
                win.gmc.open();
            });

    let clearBtn = $(document.createElement('div')).attr('id', 'clear').text('clear').appendTo(container)
    clearBtn.click(function () {
        if (window.confirm('Are you sure to clear all cache?')) {
            win.__LRUCache.clearAllCache()
        }
    })
    let autocloseBtn = $(document.createElement('div')).attr('id', 'autoclose').text(`${localStorage.getItem("autoclosewindow") ?? 'Keep'}`).appendTo(container)
    autocloseBtn.click(function () {
        localStorage.setItem("autoclosewindow", `${localStorage.getItem("autoclosewindow") == 'Auto' ? 'Keep' : 'Auto'}`)
        $(this).text(`${localStorage.getItem("autoclosewindow") ?? 'Keep'}`)
    })

    container.appendTo('body');
    container
        .find('div')
        .addClass('btn1')
        .hover(function (e) {
            let o = $(this)
            o.data('old_opacity', o.css('opacity'))
                .data('old_border', o.css('border'))
            o.css('opacity', 1).css('border', '1px solid black')
        }, function (e) {
            let o = $(this)
            o.css('opacity', o.data('old_opacity')).css('border', o.data('old_border'))
        })
    if (isList) {
        if (typeof funcList === 'function') {
            funcList(container)
        }
    } else {
        if (typeof funcDetail === 'function') {
            funcDetail(container)
        }
    }

}
function submit(func, _$) {
    if (!_$) {
        try {
            _$ = $
        } catch {

        }
    }
    let queue = _$.queue(document, "fx", func)
    if (queue[0] == "inprogress") {
        return
    }
    _$.dequeue(document)
}
function autoFind(funcIsListPage, cmgId, selector, funcText, $, elBindOpen, unsafeWindow, funcDownload, funcList, funcDetail, actionOpened) {
    win = unsafeWindow || window
    window.logDebug = function (..._args) { }
    if (window.debug) {
        window.logDebug = (...args) => {
            let newargs = args.map(arg => radash.isFunction(arg) ? arg() : arg); console.log(...newargs);
        }
    }
    let isList = funcIsListPage()

    let funcActionOpened = (actionOpened ?? win.actionOpened) ?? function (el) { }

    createMenu($, unsafeWindow, isList, funcDownload, funcList, funcDetail)

    new Promise(resovle => resovle(new GM_config({
        id: `GM_config_${cmgId}`,
        title: 'javdb Configurable Options Script',
        fields: {
            asdf: {
                label: 'Search keys',
                type: 'textarea',
                rows: 30,
                cols: 50,
                default: '调J; 阴环;18岁;19岁;20岁;gvh;sm;tki;一字马;一线天;乳环;固定;圈养;奴隶;实录;性奴;拘;拘束;拷问;捆绑;挛;无毛;束;束缚;母G;母狗;痉;白虎;紧缚;萝莉;调教;软派;软体;缚;身动;绑;;肛塞;尾巴;极品;奴宠; 淫媚;尤物;凌辱;屈辱;少女;天然;素人;清纯;耻;調J; 陰環;18歲;19歲;20歲;18歳;20歳;21歳;一字馬;一綫天;乳環;圈養;奴隸;實錄;拷問;捆綁;攣;無毛;束縛;痙;緊縛;蘿莉;調教;軟派;軟體;縛;身動;綁;極品;奴寵;清純;恥;GIF;潮吹;陵辱;19歳;痉挛;弓背;高潮;18;19;20;21;狗;母;3P;优雅;双胞;雙胞',

            },
            isRunInNewTabs: {
                options: ['Auto Run In New Tab', 'Not Run In New Tab'],
                label: 'Auto Run In New Tab?',
                type: 'radio',
                default: 'Auto Run In New Tab',
            },
            'holdOn': {
                'label': 'hold on(micro seconds)',
                'type': 'unsigned int',
                'default': 1000
            },
            'listSelector': {
                label: 'list selector',
                type: 'textarea',
                rows: 3,
                cols: 50,
                default: '',
            },
            'cacheSize': {
                label: 'cache size',
                type: 'unsigned int',
                default: 5000
            },
        },
        events:
        {
            open() {
                let vals = unique(this.get('asdf').split(/[;；,，]/g)).join(';')
                this.set('asdf', vals)
            },
            save() {
                let vals = unique(this.get('asdf').split(/[;；,，]/g)).join(';')
                this.set('asdf', vals)
            },
        },
    })))
        .then((gmc) => {
            setTimeout(() => $(elBindOpen).click(() => gmc.open()), 500)
            return gmc
        })
        .then((gmc) => {
            win.gmc = gmc
            if (!funcIsListPage(gmc))
                throw new Error(`no run due to contion failed`)
            // list页面添加事件，关闭页面时候保存缓存
            win.__LRUCache = new LRUCache("__vistList", gmc.get('cacheSize') ?? 5000, win)
            win.addEventListener('beforeunload', function (event) {
                win.__LRUCache?.saveMapToLocalStorage()
            })
            $(document).keydown(function (event) {
                win.__LRUCache?.saveMapToLocalStorage()
            })
            $(win).bind("onunload", function (event) {
                win.__LRUCache?.saveMapToLocalStorage()
            })
            $(document).mousedown(function (e) {
                if (e.which == 2) {
                    win.__LRUCache?.saveMapToLocalStorage()
                }
            })
            return gmc
        })
        .then((gmc) => {
            return { gmc, conf: gmc.get('asdf') }
        },

        )
        .then(({ gmc, conf }) => {
            console.log('config value of keys', conf)
            return ({ gmc, keys: conf.split(/[;；,，]/) })
        })
        .then(({ gmc, keys }) => {
            let selconf = gmc.get('listSelector')
            if (!radash.isEmpty(selconf)) {
                selector = selconf;
            }
            $(selector).on('click', function (event) {
                // 获取链接信息
                let el = $(this)
                let res = el.prop ? createSuperLabel(el.prop('href'), el.prop('href'), null, win) : createSuperLabel(el.attr('href'), el.attr('href'), null, win)
                    /*
                    const href = $(this).attr('href');
                    const isExternal = this.hostname !== window.location.hostname;
                    const target = $(this).attr('target') || '_self';
                    win.__LRUCache.put(href, true)
                    */
                    window.logDebug('clicked', res)
                if (!res?.state) {
                    win.__LRUCache?.saveMapToLocalStorage()
                    return false
                }
                return false
            })
            console.log('found list count', $(selector).length, 'selector', selector)
            $(selector).each((i, element) => {
                let el = $(element)
                $.each(keys, (inex, key) => {
                    let eltext = funcText(el)
                    let href = el.prop ? el.prop('href') : el.attr('href')

                    if (a_Contains_b(eltext, key)) {
                        submit(function (next) {
                            try {
                                let res = el.prop ? createSuperLabel(href, href, null, win) : createSuperLabel(href, href, null, win)

                                if (eltext?.length > 38) {
                                    eltext = eltext.substring(0, 35).concat('...')
                                }
                                console.log(!res?.state ? 'opened' : 'opening', key, eltext, `${window.location.origin}${res?.href}`)
                                if (!res?.state) {

                                    next()
                                } else {
                                    setTimeout(function () { next() }, gmc.get('holdOn') ?? 1000)
                                }
                            } catch (e) {
                                console.log('error code 10001', e)
                                setTimeout(function () { next() }, gmc.get('holdOn') ?? 1000)
                            }
                            finally {

                            }
                        }, $)

                        return false
                    } else {
                        window.logDebug('not match', key, eltext)
                    }
                    if (win.__LRUCache?.check(href)) {
                        window.logDebug('already opened', href)
                        funcActionOpened(el)
                    } else {
                        window.logDebug('win.__LRUCache?.check(href) :', href)
                    }
                })
            })
            win.__LRUCache?.saveMapToLocalStorage()
            return { gmc, keys }
        })
        .catch(e => console.log('error', e))
};
