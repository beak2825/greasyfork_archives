// ==UserScript==
// @name         哔哩哔哩弹幕扩展
// @version      2.3.1
// @description  简单的哔哩哔哩弹幕增强脚本
// @author       DeltaFlyer
// @copyright    2022, DeltaFlyer(https://github.com/DeltaFlyerW)
// @license      MIT
// @match        https://*.bilibili.com/video/*
// @match        https://*.bilibili.com/bangumi/play/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @icon         https://www.biliplus.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.0/jszip.min.js
// @connect      152.32.146.234
// @connect      delflare505.win:400
// @connect      ani.gamer.com.tw
// @connect      biliplus.com
// @namespace    https://greasyfork.org/users/927887

// @downloadURL https://update.greasyfork.org/scripts/448449/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%BC%B9%E5%B9%95%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/448449/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%BC%B9%E5%B9%95%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

window = unsafeWindow
window.editConfig = editConfig
let chrome = {
    runtime: {
        onMessage: {
            listeners: [],
            addListener: function (listener) {
                chrome.runtime.onMessage.listeners.push(listener)
            },
            removeListener: function (listener) {
                let index = chrome.runtime.onMessage.listeners.indexOf(listener)
                if (index !== -1) {
                    chrome.runtime.onMessage.listeners.splice(index)
                }
            }
        },
        sendMessage: function (data, argv) {
            if (!data) data = argv
            for (let listener of chrome.runtime.onMessage.listeners) {
                listener(data, {}, undefined)
            }
        },

        getURL: function (url) {
            let response
            if (url === 'filterWorker.js') {
                response = `'use strict'


self.addEventListener('message', function (e) {
    let ruleGroup = e.data.rule
    let nldanmu = []
    for (let idanmu = 0; idanmu < e.data.ldanmu.length; idanmu += 1) {
        let danmu = e.data.ldanmu[idanmu]

        try {
            let content = danmu.content.toLowerCase()
            // let reason;
            if (ruleGroup['period']) {
                if (danmu.progress < ruleGroup['period'][0]) {
                    continue
                }
                if (danmu.progress > ruleGroup['period'][1]) {
                    break
                }
            }
            let ffilted = false;
            if (ruleGroup['string']) {
                for (let irule = 0; irule < ruleGroup['string'].length; irule += 1) {
                    if (content.indexOf(ruleGroup['string'][irule]) !== -1) {
                        // reason=['string',ruleGroup['string'][irule],content,danmu]
                        ffilted = true;
                        break
                    }
                }
            }
            if (ruleGroup['regexp'] && !ffilted) {
                for (let irule = 0; irule < ruleGroup['regexp'].length; irule += 1) {
                    if (content.match(ruleGroup['regexp'][irule])) {
                        // reason=['regexp',ruleGroup['regexp'][irule],content,danmu]

                        ffilted = true;
                        break
                    }
                }
            }


            if (ruleGroup['user'] && !ffilted) {
                for (let irule = 0; irule < ruleGroup['user'].length; irule += 1) {
                    if (ruleGroup['user'][irule] === danmu.midHash) {
                        // reason=['midHash',ruleGroup['user'][irule],content,danmu]
                        ffilted = true;
                        break
                    }
                }
            }
            if (!ffilted) {
                nldanmu.push(danmu)
            } else {
                // console.log(reason)
            }
        } catch (e) {
            console.log(e, danmu)
        }
    }
    self.postMessage(
        {ldanmu: nldanmu, time: e.data.time, cid: e.data.cid,index:e.data.index}
    )
}, false)`
            }

            // URL.createObjectURL
            window.URL = window.URL || window.webkitURL;

            // "Server response", used in all examples

            var blob;
            try {
                blob = new Blob([response], {type: 'application/javascript'});
            } catch (e) { // Backwards-compatibility
                window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
                blob = new BlobBuilder();
                blob.append(response);
                blob = blob.getBlob();
            }
            return URL.createObjectURL(blob)
        }

    }
}

async function testServer() {
    danmuServerDomain = 'http://152.32.146.234:400'
    if (!localStorage['danmakuServer'] || new Date().getTime() - JSON.parse(localStorage['danmakuServer'])['time'] > 86400000) {
        let res = await xhrGet(danmuServerDomain + '/testConnect')
        if (res == null) {
            danmuServerDomain = 'https://delflare505.win:800'
            res = await xhrGet(danmuServerDomain + '/testConnect')
        }
        if (res)
            bindAid = res.split(',')
        localStorage['danmakuServer'] = JSON.stringify({
            domain: danmuServerDomain,
            time: new Date().getTime(),
            bindAid: bindAid
        })
    } else {
        danmakuServer = JSON.parse(localStorage['danmakuServer'])
        danmuServerDomain = danmakuServer.domain
        bindAid = danmakuServer.bindAid
    }
}

window.testServer = testServer

async function xhrGet(url, timeout, header, retry, returnXhr = false) {
    console.log('Get', url)
    if (url.startsWith('https')) {
        let ajax = window.$.originalAjax
        if (!ajax) ajax = window.$.ajax
        return new Promise(async function (resolve) {
            try {
                ajax({
                    type: 'GET',
                    url: url,
                    timeout: timeout,
                    headers: header,
                    success: function (data, status, xhr) {
                        if (returnXhr) {
                            resolve(xhr)
                        } else {
                            resolve(xhr.responseText)
                        }
                    },
                    error: async function (xhr, status, error) {
                        if (!retry) retry = 0
                        console.log('XhrError=', retry, '/', xhr, error)
                        if (retry < 2) {
                            resolve(await xhrGet(url, timeout, header, retry + 1, returnXhr))
                        } else {
                            resolve(null)
                        }
                    }
                })

            } catch (e) {
                if (!retry) retry = 0
                console.log('XhrError=', retry, '/', e)
                if (retry < 2) {
                    return xhrGet(url, timeout, header, retry + 1, returnXhr)
                } else {
                    return null
                }
            }
        })
    } else {
        return new Promise(async function (resolve) {
            try {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: header,
                    onload: function (responseDetails) {
                        if (returnXhr) {
                            responseDetails.getResponseHeader = function () {
                                return responseDetails.responseHeaders.slice(
                                    responseDetails.responseHeaders.find('content-type: ') + 14,
                                    responseDetails.responseHeaders.find('date: ') - 1)
                            }
                            resolve(responseDetails)
                        } else {
                            resolve(responseDetails.responseText)
                        }
                    },
                    onerror: async function (responseDetails) {
                        if (!retry) retry = 0
                        console.log('XhrError=', retry, '/', responseDetails)
                        if (retry < 2) {
                            resolve(await xhrGet(url, timeout, header, retry + 1, returnXhr))
                        } else {
                            resolve(null)
                        }
                    }
                })
            } catch (e) {
                if (!retry) retry = 0
                console.log('XhrError=', retry, '/', e)
                if (retry < 2) {
                    return xhrGet(url, timeout, header, retry + 1, returnXhr)
                } else {
                    return null
                }
            }
        })


    }

}

async function xhrPost(option) {
    if (!option.mode) {
        option.mode = 'json'
    }
    let data = ''
    if (option.mode === 'json') {
        data = JSON.stringify(option.data)
    } else {
        // 'urlEncode'
        for (var x in option.data) {
            data += encodeURIComponent(x) + "=" + encodeURIComponent(option.data[x]) + '&';
        }
        data = data.slice(0, data.length - 1)
    }
    option.data = data
    option.method = 'POST'
    option.headers = {
        'Content-type': 'application/x-www-form-urlencoded'
    }
    return new Promise(function (resolve) {
        option.onload = function (responseDetails) {
            resolve(responseDetails.responseText)

        }
        option.onerror = async function (responseDetails) {
            if (!retry) retry = 0
            console.log('XhrError=', retry, '/', responseDetails)
            if (retry < 2) {
                resolve(await xhrGet(url, timeout, header, retry + 1, returnXhr))
            } else {
                resolve(null)
            }
        }
        GM_xmlhttpRequest(
            option
        )
    })
}

buildCrcFilter = async () => {
    //油猴脚本暂不支持uid过滤功能
}


let test = false
let version = '2.0'
let defaultConfig = {
    debug: false,
    danmuRate: 2.1,
    nicoDanmuRate: 1,
    loadNicoComment: true,
    loadNicoScript: true,
    translateNicoComment: true,
    translateThreshold: 1,
    replaceKatakana: true,
    ignoreBili: false,
    bindedCid: {},
    uidFilter: -1,
    filterRule: [
        {
            string: ['⎛', '[oh', '[前方', '走好'],
        }
    ],
    version: '2.0'
};
let danmuServerDomain, hasProxy, ldldanmu, bindAid, extensionSetting, crcFilter
console.log('test', test);


async function loadConfig() {
    function format(text, dict) {
        var result = text
        var lkey = text.match(/{(.*?)}/g)
        for (var i = 0; i < lkey.length; i++) {
            var key = lkey[i]
            result = result.replace(key, dict[key.slice(1, -1)])
        }
        return result
    }

    function help() {
        console.log('https://github.com/DeltaFlyerW/DF_DanmakuExtension')
        console.log('扩展现在的设置为')
        console.log(format('如对于弹幕池上限为3000的24分钟番剧\n' +
            '    danmuRate: {danmuRate}, 将加载3000*{danmuRate}条以上的B站弹幕\n' +
            '    uidFilter: {uidFilter}, 将过滤uid在{uidFilter}以上的弹幕\n' +
            '    nicoDanmuRate:  {nicoDanmuRate}, 将加载3000*{nicoDanmuRate}条的N站弹幕\n' +
            '    translateNicoComment: {translateNicoComment}, 翻译N站弹幕\n' +
            '    translateThreshold: {translateThreshold}, 长度在{translateThreshold}以下的N站弹幕将不会被翻译\n' +
            '    replaceKatakana: {replaceKatakana}, 将未翻译的N站弹幕中的片假名替换为罗马字', extensionSetting))
        console.log('如需修改设置,请按')
        console.log('editConfig("danmuRate",3)')
        console.log('的格式输入')
    }

    function initConfig() {
        extensionSetting = defaultConfig
    }

    // console.log(localStorage)
    extensionSetting = {};
    if (!test) {
        try {
            extensionSetting = JSON.parse(localStorage['extensionSetting'])
            for (let key of Object.keys(extensionSetting)) {
                if (defaultConfig[key] === undefined) {
                    delete extensionSetting[key]
                }
            }
            for (let key of Object.keys(defaultConfig)) {
                if (extensionSetting[key] === undefined) {
                    extensionSetting[key] = defaultConfig[key]
                }
            }
            localStorage['extensionSetting'] = JSON.stringify(extensionSetting)
        } catch (e) {
            console.log(e)
            initConfig()
            localStorage['extensionSetting'] = JSON.stringify(extensionSetting)
        }
    } else initConfig()
    hasProxy = false
    help()
    ldldanmu = [];
    buildCrcFilter().then((res) => {
        crcFilter = res
    })
}

loadConfig()

function editConfig(key, value) {
    if (!defaultConfig.hasOwnProperty(key)) {
        console.log('设置中不含有', key, '这一项')
        return '修改失败'
    }
    if (typeof defaultConfig[key] !== typeof value) {
        console.log(key, '项的类型应为', typeof defaultConfig[key], '如', defaultConfig[key])
        console.log('而将要修改的值为', value, ',其类型为', typeof value)
        return '修改失败'
    }
    if (key === 'uidFilter') {
        if (value > 100000000) {
            console.log('不推荐用户uid过滤大于一亿')
        }
    }
    extensionSetting[key] = value
    localStorage['extensionSetting'] = JSON.stringify(extensionSetting)
    if (key === 'uidFilter') {
        buildCrcFilter().then((res) => {
            crcFilter = res
        })
    }
    window.ldldanmu = []
    return '修改成功'
}


let [str, len, searchContent, searchPeriod, ignoreBili] = (function util() {
    Array.prototype.sortMultiParameter = function (parameters) {
        this.sort(function (a, b) {
            for (let p of parameters) {
                let reverse = 1
                if (p[0] === '!') {
                    reverse = -1
                    p = p.slice(1)
                }
                if (a[p] !== b[p]) {
                    return (a[p] > b[p] ? 1 : -1) * reverse
                }
            }
            return 0
        })
    }
    Array.prototype.append = Array.prototype.push


    String.prototype.join = function (array) {
        return array.join(this)
    }
    String.prototype.find = String.prototype.indexOf
    String.prototype.startswith = String.prototype.startsWith
    return [function str(object) {
        return object.toString()
    },
        function len(object) {
            return object.length
        },
        function searchContent(keyword) {
            let res = []
            for (let ldanmu of ldldanmu[ldldanmu.length - 1].ldanmu) {
                for (let danmu of ldanmu.ldanmu) {
                    if (danmu.content.indexOf(keyword) !== -1) {
                        console.log(danmu)
                        res.push(danmu)
                    }
                }
            }
            return res
        },
        function searchPeriod(start, end = 0) {
            let res = []
            if (start.toString().indexOf('.') !== -1) {
                let [min, sec] = start.toString().split('.')
                start = min * 60 + parseInt(sec)
            }
            if (end === 0) {
                end = start + 1
            }
            for (let ldanmu of ldldanmu[ldldanmu.length - 1].ldanmu) {
                for (let danmu of ldanmu.ldanmu) {
                    if (danmu.progress / 1000 >= start && danmu.progress / 1000 < end) {
                        console.log(danmu)
                        res.push(danmu)
                    }
                }
            }
            for (let danmu of ldldanmu[ldldanmu.length - 1].ldanmu) {
                if (danmu.progress / 1000 >= start && danmu.progress / 1000 < end) {
                    console.log(danmu)
                    res.push(danmu)
                }
            }
            return res
        },
        function ignoreBili() {
            console.log(editConfig('ignoreBili', !extensionSetting.ignoreBili))
        }
    ]
})();


let currentDanmu

let parseNicoServerResponse = function () {
    'use strict'

    function getStringWidth(str) {

        var realLength = 0;
        var len = str.length;
        var charCode = -1;

        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);

            if (charCode >= 0 && charCode <= 254) {
                // 0-255中的全角文字，依次对应下面的字符
                // ¢ , £ , § , ¨ , « , ¬ , ¯ , ° , ± , ´ , µ , ¶ , · , ¸ , » , × , ÷
                if (charCode === 162
                    || charCode === 163
                    || charCode === 167
                    || charCode === 168
                    || charCode === 171
                    || charCode === 172
                    || charCode === 175
                    || charCode === 176
                    || charCode === 177
                    || charCode === 180
                    || charCode === 181
                    || charCode === 182
                    || charCode === 183
                    || charCode === 184
                    || charCode === 187
                    || charCode === 215
                    || charCode === 247) {
                    realLength += 2;
                } else {
                    realLength += 1;
                }
            } else if (charCode >= 65377 && charCode <= 65439) {
                if (charCode === 65381) { // '･'该字符的长度为两个字节
                    realLength += 2;
                } else {
                    realLength += 1;
                }
            } else {
                realLength += 2;
            }
        }
        return realLength;
    }

    function resolveNicoDanmu(lNicoCommendObject, startIndex = 0, name = 'niconico') {
        let lNicoScript = []
        let lres = []
        for (let comment of lNicoCommendObject) {
            let content = comment['content']
            if (content.indexOf('@置換') !== -1) {
                let script = {
                    'nico': comment,
                    'type': 'replace',
                }
                let argv = content.split(' ')
                if (len(argv) < 3) {
                    continue
                }
                if (argv[1][0] === '"') {
                    argv[1] = argv[1].slice(1, argv[1].length - 1)
                    argv[2] = argv[2].slice(1, argv[2].length - 1)
                }
                script['src'] = argv[1]
                script['dest'] = argv[2]
                for (let option of argv.slice(3)) {
                    if (option === '全') {
                        script['replaceAll'] = true
                    } else if (option === '含む') {
                        script['includePoster'] = true
                    } else if (option === '完全一致') {
                        script['exactMatch'] = true
                    }
                }
                lNicoScript.push(script)
            } else {
                lres.push(comment)
            }
        }
        let ldanmu = []

        let dColor = {
            'red': 16711680,
            'pink': 16744576,
            'orange': 16763904,
            'yellow': 16776960,
            'green': 65280,
            'cyan': 65535,
            'blue': 255,
            'purple': 12583167,
            'black': 0,
            'niconicowhite': 13421721,
            'white2': 13421721,
            'truered': 13369395,
            'red2': 13369395,
            'pink2': 16724940,
            'passionorange': 16737792,
            'orange2': 16737792,
            'madyellow': 10066176,
            'yellow2': 10066176,
            'elementalgreen': 52326,
            'green2': 52326,
            'cyan2': 52428,
            'marineblue': 3381759,
            'blue2': 3381759,
            'nobleviolet': 6697932,
            'purple2': 6697932,
            'black2': 6710886
        }
        let dFontRatio = {
            30: 16,
            25: 26,
            20: 39,
            32.5: 9,
            27.5: 14,
            22.5: 21,
        }
        let lBasDanmu = []
        for (let i = 0; i < lres.length; i++) {
            let danmu = lres[i]
            try {
                let ctime = danmu['date'], progress = danmu['vpos'] * 10, content = danmu['content'],
                    command = danmu['mail'], isReplaced = false
                // if (progress > 600)
                //     progress -= 600 //http://nicowiki.com/elsecom.html#nakahyoji
                for (let script of lNicoScript) {
                    if (script['type'] === 'replace') {
                        if ((script['exactMatch'] && content === script['src']) || (!script['exactMatch'] && content.indexOf(script['src']) !== -1)) {
                            isReplaced = true
                            command = script['nico']['mail']
                            if (script['replaceAll']) {
                                content = script['dest']
                            } else {
                                content = content.replace(script['src'], script['dest'])
                            }
                        }
                    }
                }
                if (content.indexOf('03/20') !== -1) {
                    console.log(danmu)
                }
                let lcommand = null
                let danmuType = 1
                let fontSize = 25
                let color = 0xffffff
                let isBasDanmu = content.split("\n").length > 5;
                danmu.isRaw = false
                let duration = null
                if (command.length > 0) {
                    lcommand = JSON.parse('"' + command + '"').split(' ')
                    for (let command of lcommand) {
                        if (command.length < 2) {
                        } else if (command === 'raw' || command === 'owner') {
                            danmu.isRaw = true
                        } else if (command === 'ue')
                            danmuType = 5
                        else if (command === 'shita')
                            danmuType = 4
                        else if (command === 'big')
                            fontSize = 30
                        else if (command === 'small')
                            fontSize = 20
                        else if (dColor.hasOwnProperty(command))
                            color = dColor[command]
                        else if (command[0] === '#')
                            try {
                                color = parseInt(command.slice(1), 16)
                            } catch (e) {
                            }
                        else if (command[0] === "@") {
                            if (!isReplaced) {
                                duration = Number(command.slice(1))
                            }
                            isBasDanmu = true
                        } else if (command === 'migi' || command === 'hidari') {
                            isBasDanmu = true
                        }
                    }
                }
                if (danmuType === 1 && progress > 1000) {
                    progress -= 1000
                }
                danmu = {
                    nico: danmu,
                    color: color,
                    content: content,
                    ctime: ctime,
                    fontsize: fontSize,
                    id: i + startIndex,
                    idStr: (i + startIndex).toString(),
                    midHash: name,
                    mode: danmuType,
                    progress: progress,
                    weight: 10
                }
                if (isBasDanmu) {
                    danmu.nico.duration = duration
                    lBasDanmu.push(danmu)
                } else {
                    ldanmu.push(danmu)
                }
            } catch (e) {
                console.log(e)
            }
        }

        lBasDanmu.sortMultiParameter(['progress', 'mode', 'duration'])
        let rowCount = 0
        for (let i = 0; i < lBasDanmu.length; i++) {
            let danmu = lBasDanmu[i]
            try {
                let argv = {
                    "anchorX": "0.5",
                    "x": "100%",
                    "color": '0x' + danmu.color.toString(16),
                    "zIndex": i,
                    'bold': 0,
                }

                let fontSize = danmu.fontsize, danmuType = danmu.mode, color = danmu.color
                if ((Number(argv['color'].slice(2, 4)) + Number(argv['color'].slice(4, 6))
                    + Number(argv['color'].slice(6, 8))) < 40) {
                    argv['strokeWidth'] = 1
                    argv['strokeColor'] = '0x888888'
                }
                if (danmu.nico.mail.length > 0) {
                    let lcommand = JSON.parse('"' + danmu.nico.mail + '"').split(' ')
                    if (lcommand !== null) {
                        for (let i = 0; i < lcommand.length; i += 1) {
                            let command = lcommand[i];
                            if (command.length === 0) {
                            }
                                // else if (command === "mincho") {
                                //     argv["fontFamily"] = '"Yu Mincho"';
                                // } else if (command === "gothic") {
                                //     argv["fontFamily"] = '"Yu Gothic"';
                            // }
                            else if (command === "ender") {
                                fontSize += 2.5;
                            } else if (command === "invisible") {
                                argv["alpha"] = "0";
                            } else if (command === "migi") {
                                argv["anchorX"] = "1";
                            } else if (command === "hidari") {
                                argv["anchorX"] = "0";
                            }
                        }
                    }
                }
                let content = danmu.content.replace(/\t/g, '    ')
                if (content.indexOf('█') !== -1) {
                    argv.zIndex = 0
                }
                let rows = content.split('\n')
                argv['fontSize'] = (100 / (dFontRatio[fontSize] * 2)).toFixed(5) + '%'
                if (rows.length > 45) {
                    argv['fontSize'] = (100 / (rows.length * 2)).toFixed(5) + '%'
                    console.log('Unknown fontsize', rows.length, danmu)
                }
                if (danmu.mode === 1) {
                    if (danmu.nico.duration === null) {
                        danmu.nico.duration = 4
                    }
                    if (i > 0) {
                        let lastDanmu = lBasDanmu[i - 1]
                        if (rows.length < 5 && lastDanmu.mode === 1 && danmu.mode === 1
                            && (danmu.progress - lastDanmu.progress) < 1000) {
                            rowCount += lastDanmu.rows
                            content = '\n'.repeat(rowCount) + content
                        } else {
                            rowCount = 0
                        }
                    }
                    argv['anchorX'] = 0
                } else {
                    if (danmu.nico.duration === null) {
                        danmu.nico.duration = 3
                    }
                    argv["duration"] = danmu.nico.duration + 's';
                    if (danmu.mode === 5) {
                        argv["anchorY"] = "0";
                        argv["y"] = "0%";
                        argv["x"] = "50%";
                    } else if (danmu.mode === 4) {
                        argv["anchorY"] = "1";
                        argv["y"] = "100%";
                        argv["x"] = "50%";
                        argv["duration"] = danmu.nico.duration + 's';
                    }
                }
                argv['content'] = JSON.stringify(content)

                let basBody = ["def text c" + i + " {\n"];
                for (let key in argv) {
                    basBody.push(key + '=' + argv[key].toString() + '\n')
                }
                basBody.push("}\n");
                if (danmuType === 1) {
                    let danmuDuration = danmu.nico.duration
                    let maxWidth = 0
                    for (let row of rows) {
                        let length = getStringWidth(row)
                        if (length > maxWidth) maxWidth = length
                    }
                    maxWidth = maxWidth / dFontRatio[fontSize]
                    danmuDuration *= 2
                    basBody.push("set c" + i + " {x=" + ((-maxWidth * 50).toFixed(2)) + "%}" + danmuDuration.toFixed(4) + 's\n');
                }
                lBasDanmu[i] = {
                    rows: rows.length,
                    nico: [danmu],
                    color: color,
                    content: basBody.join(''),
                    ctime: danmu.ctime,
                    fontsize: fontSize,
                    id: i + startIndex,
                    idStr: i + startIndex.toString(),
                    midHash: 'niconico',
                    mode: danmu.mode,
                    progress: danmu.progress,
                    weight: 10
                }
            } catch
                (e) {
                console.log(e, danmu)
            }
        }
        let lastDanmu = null
        for (let i = 0; i < lBasDanmu.length; i++) {
            let danmu = lBasDanmu[i]
            danmu.mode = 9
            if (lastDanmu === null || danmu.progress !== lastDanmu.progress) {
                ldanmu.push(danmu)
                lastDanmu = danmu
            } else {
                ldanmu[ldanmu.length - 1].content += danmu.content
                ldanmu[ldanmu.length - 1].nico.push(danmu.nico[0])
            }
        }
        // if (extensionSetting.translateNicoComment) {
        //     ldanmu = await translateNico(ldanmu)
        // }
        ldanmu.nicoScript = lNicoScript
        return ldanmu
    }

    function katakana(danmu) {
        let ddkata = {
            'ウィ': 'wi', 'ウェ': 'we', 'キャ': 'kya', 'キュ': 'kyu', 'キョ': 'kyo', 'ギャ': 'gya', 'ギュ': 'gyu', 'ギョ': 'gyo',
            'シャ': 'sha', 'シュ': 'shu', 'ショ': 'sho', 'ジャ': 'ja', 'ジュ': 'ju', 'ジョ': 'jo', 'チャ': 'cha', 'チュ': 'chu',
            'チョ': 'cho', 'ヂャ': 'dha', 'ヂュ': 'dhu', 'ヂョ': 'dho', 'ニャ': 'nya', 'ニュ': 'nyu', 'ニョ': 'nyo', 'ヒャ': 'hya',
            'ヒュ': 'hyu', 'ヒョ': 'hyo', 'ビャ': 'bya', 'ビュ': 'byu', 'ビョ': 'byo', 'ピャ': 'pya', 'ピュ': 'pyu', 'ピョ': 'pyo',
            'ミャ': 'mya', 'ミュ': 'myu', 'ミョ': 'myo', 'リャ': 'rya', 'リュ': 'ryu', 'リョ': 'ryo', 'ヴャ': 'vya', 'ヴュ': 'vyu',
            'ヴョ': 'vyo',
        }
        let dskata = {
            'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o', 'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke',
            'コ': 'ko', 'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so', 'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu',
            'テ': 'te', 'ト': 'to', 'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no', 'ハ': 'ha', 'ヒ': 'hi',
            'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho', 'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo', 'ヤ': 'ya',
            'ユ': 'yu', 'ェ': 'e', 'ヨ': 'yo', 'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro', 'ワ': 'wa',
            'ヲ': 'wo', 'ン': 'n', 'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go', 'ザ': 'za', 'ジ': 'ji',
            'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo', 'ダ': 'da', 'ヂ': 'dji', 'ヅ': 'dzu', 'デ': 'de', 'ド': 'do', 'バ': 'ba',
            'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo', 'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po'
        }
        let tdanmu = []
        let ichar = -1
        while (ichar < danmu.length - 1) {
            ichar += 1
            let char = danmu[ichar]
            let word = danmu.slice(ichar, ichar + 2)
            if (ddkata.hasOwnProperty(word)) {
                tdanmu.push(ddkata[word])
                ichar += 1
                continue
            }
            if (char === 'っ' || char === 'ッ') {
                try {
                    let nextChar = danmu[ichar + 1]
                    if (dskata.hasOwnProperty(nextChar))
                        tdanmu.push(nextChar[word][0] + nextChar[word])
                    ichar += 1
                    continue
                } catch (e) {
                }
            }
            if (dskata.hasOwnProperty(char)) {
                tdanmu.push(dskata[char])
                continue
            }
            tdanmu.push(char)
        }
        return tdanmu.join('')

    }

    function replaceKatakana(ldanmu) {
        for (let idanmu = 0; idanmu < ldanmu.length; idanmu++) {
            if (ldanmu[idanmu].mode !== 9 && !ldanmu[idanmu].nico.isRaw && ldanmu[idanmu].content.indexOf('\n') === -1) {
                ldanmu[idanmu].content = katakana(ldanmu[idanmu].content)
            }
        }
        return ldanmu
    }

    return function (sdanmu, startIndex = 0, encrypt = false, name = 'niconico') {
        let ldanmu
        if (sdanmu[0] === '<') {
            ldanmu = sdanmu.split('</d><d p=');

            if (ldanmu.length === 1) {
                return []
            }
            let tdanmu = ldanmu[0];
            ldanmu[0] = ldanmu[0].slice(5)
            tdanmu = ldanmu[ldanmu.length - 1];
            ldanmu[ldanmu.length - 1] = tdanmu.slice(0, tdanmu.length - 4);
            for (let i = 0; i < ldanmu.length; i++) {
                let danmu = ldanmu[i]
                let pos = danmu.indexOf('>')
                let argv = danmu.substring(1, pos - 1).split(',')
                ldanmu[i] = {
                    color: Number(argv[3]),
                    content: xmlunEscape(danmu.slice(pos + 1)),
                    ctime: Number(argv[4]),
                    fontsize: Number(argv[2]),
                    id: Number(argv[5]),
                    idStr: argv[5],
                    midHash: name,
                    mode: Number(argv[1]),
                    progress: Math.round(Number(argv[0]) * 1000),
                    weight: 10
                }
            }
        } else {
            ldanmu = sdanmu.split('\n')
            // ldanmu = ldanmu.reverse()
            let lNicoCommendObject = []
            for (let i = 0; i < ldanmu.length; i++) {
                let args = ldanmu[i].split('""')
                let argv, command, content, fileArg

                if (args.length === 3) [argv, command, content] = args
                else [fileArg, argv, command, content] = args

                if (encrypt) {
                    content = content.replace(/([^\\]|^)((\\\\)*)\\x/g, '$1$2\\u')
                }

                let [vpos, date] = argv.split(',')

                let comment = {
                    date: date,
                    vpos: vpos,
                    mail: JSON.parse('"' + command + '"'),
                }
                try {
                    comment.content = JSON.parse('"' + content + '"')
                } catch (e) {
                    console.log(e, args)
                    comment.content = JSON.parse('"' + content.replace(/"/g, '\\"') + '"')
                }
                if (fileArg) {
                    let [no, user] = fileArg.split(',')
                    comment['no'] = no
                    comment['user'] = user
                }
                try {
                    lNicoCommendObject.push(comment)
                } catch (e) {
                    console.log(ldanmu[i], e)
                }

            }
            ldanmu = resolveNicoDanmu(lNicoCommendObject, startIndex, name)
        }
        if (extensionSetting.translateNicoComment && extensionSetting.replaceKatakana) {
            ldanmu = replaceKatakana((ldanmu))
        }
        return ldanmu
    }
}();

async function twitchChat(vid, startTime, cursor) {
    let url = danmuServerDomain + '/twitchChat?video_id=' + vid
    if (startTime) url += '&start_time=' + startTime
    if (cursor) url += '&cursor=' + cursor
    let xhrResponse = await xhrGet(url, null, null, 0, true)
    cursor = xhrResponse.getResponseHeader('content-type').slice(25)
    if (cursor.length === 0) cursor = null
    let lTwitchChat = parseNicoServerResponse(xhrResponse.responseText)
    return {ldanmu: lTwitchChat, cursor: cursor, startTime: startTime, vid: vid}
}

let danmuHookResponse = function () {
    let danmuFilter = function () {
        let lfilterWorker = []
        for (let i = 0; i < 8; i += 1) {
            let worker = new Worker(chrome.runtime.getURL("filterWorker.js"))
            lfilterWorker.push(worker)
        }

        return async function (ldanmu, filterRule = null, cid) {
            console.assert(cid !== undefined)
            if (filterRule === null) {
                filterRule = extensionSetting.filterRule
            }
            if (filterRule.length === 0) {
                return ldanmu
            }
            let uldanmu = [], olength = ldanmu.length

            // if (setting.uidFilter !== null) {
            //     let tldanmu = []
            //     for (let i = 0; i < ldanmu.length; i += 1) {
            //         if (crcFilter(ldanmu[i].midHash)) {
            //             uldanmu.push(ldanmu[i])
            //         } else tldanmu.push(ldanmu[i])
            //     }
            //     ldanmu = tldanmu
            // }

            for (let ruleGroup of filterRule) {

                if (!ruleGroup['hasTrigger']) {
                    let ndanmu = Math.floor(ldanmu.length / 8)
                    let nldanmu = [];
                    await new Promise((resolve) => {
                        let iprogress = 0
                        for (let i = 0; i < 8; i += 1) {
                            let worker = lfilterWorker[i], end
                            if (i !== 7) {
                                end = (i + 1) * ndanmu
                            } else {
                                end = ldanmu.length
                            }
                            // worker.postMessage({rule: ruleGroup, ldanmu: ldanmu.slice(i * ndanmu, end),})
                            // worker.onmessage = (event) => {
                            //     // console.log(event.data.ldanmu.length,nldanmu.length)
                            //     nldanmu = nldanmu.concat(event.data.ldanmu)
                            //     iprogress += 1
                            //     if (iprogress === 8) {
                            //         resolve()
                            //     }
                            // }

                            worker.postMessage({
                                rule: ruleGroup,
                                ldanmu: ldanmu.slice(i * ndanmu, end),
                                cid: cid,
                                index: i
                            })
                            let callback = (event) => {
                                // console.log(event.data.ldanmu.length,nldanmu.length)
                                if (event.data.cid === cid && event.data.index === i) {
                                    nldanmu = nldanmu.concat(event.data.ldanmu)
                                    iprogress += 1
                                    worker.removeEventListener('message', callback)
                                    if (iprogress === 8) {
                                        resolve()
                                    }
                                }
                            }
                            worker.addEventListener('message', callback)
                        }
                    })
                    ldanmu = nldanmu;
                } else {
                    // let nldanmu = [];
                    // let lastTriggeredPos = 0;
                    // let triggerCount = 0;
                    // let allCount = 0;
                    // let ftriggered = false;
                    // let tldanmu = [];
                    // for (danmu of ldanmu) {
                    //     let pos = getDanmuPos(danmu);
                    //     let content = getDanmuContent(danmu);
                    //     let ffilted = false
                    //     for (let rule of ruleGroup['lrule']) {
                    //         if (!ftriggered) {
                    //             allCount += 1;
                    //             if (rule['isTrigger'] === true && danmuMatch(content, rule)) {
                    //                 if (lastTriggeredPos === 0) {
                    //                     lastTriggeredPos = pos;
                    //                 } else {
                    //                     if (pos - lastTriggeredPos > 10) {
                    //                         nldanmu.concat(tldanmu);
                    //                         tldanmu = [];
                    //                         triggerCount = 0;
                    //                         allCount = 0;
                    //                         lastTriggeredPos = 0;
                    //                     }
                    //                 }
                    //                 tldanmu.push(danmu);
                    //                 triggerCount += 1;
                    //                 if (triggerCount > 20 && triggerCount / allCount > 0.3) {
                    //                     let ttldanmu = [];
                    //                     for (tdanmu of tldanmu) {
                    //                         pos = getDanmuPos(tdanmu);
                    //                         content = getDanmuContent(tdanmu);
                    //                         let ffilted = false;
                    //                         for (rule of ruleGroup['lrule']) {
                    //                             if (danmuMatch(content, rule)) {
                    //                                 ffilted = true;
                    //                                 break
                    //                             }
                    //                         }
                    //                         if (!ffilted) {
                    //                             ttldanmu.push(tdanmu)
                    //                         }
                    //
                    //                     }
                    //                     tldanmu = [];
                    //                     ftriggered = true
                    //                 }
                    //             }
                    //         } else {
                    //             if (pos - lastTriggeredPos > 10) {
                    //                 ftriggered = false;
                    //             }
                    //             for (rule of ruleGroup['lrule']) {
                    //                 if (danmuMatch(content, rule)) {
                    //                     ffilted = true;
                    //                     break
                    //                 }
                    //             }
                    //             if (!ffilted) {
                    //                 nldanmu.push(danmu)
                    //             }
                    //         }
                    //
                    //     }
                    // }
                    // ldanmu = nldanmu;
                }
            }
            // if (extensionSetting.uidFilter !== null) {
            //     let tldanmu = []
            //     for (let danmu of ldanmu) {
            //         if (crcFilter(getDanmuUserhash(danmu))) {
            //             tldanmu.push(danmu)
            //         }
            //     }
            //     ldanmu = tldanmu
            // }
            ldanmu = ldanmu.concat(uldanmu)
            // ldanmu=uldanmu
            console.log('Filter:', olength, '=>', ldanmu.length)

            return ldanmu
        }
    }();
    let nicoDanmu = function () {
        return async function (nicoid, startIndex = 0, ndanmu = 1000) {
            console.log('Found NicoID:' + nicoid)
            let url = danmuServerDomain + '/nico/?nicoid=' + nicoid + '&encrypt=1'
            if (extensionSetting.translateNicoComment) {
                url += '&translate=1'
            }
            if (extensionSetting.loadNicoScript) {
                url += '&raw=1'
            }
            url += '&niconum=' + ndanmu
            if (extensionSetting.translateThreshold) {
                url += '&translateThreshold=' + extensionSetting.translateThreshold
            }
            let nicodanmu = await xhrGet(url)
            if (nicodanmu === null) {
                return []
            }
            let ldanmu = parseNicoServerResponse(nicodanmu, 0, true)
            console.log('ndanmu:' + ldanmu.length + ' from niconico')
            return ldanmu
        }
    }();

    async function dmFengDanmaku(sn, startIndex = 0) {
        let sdanmu
        sdanmu = await xhrPost({
            mode: 'urlEncode',
            data: {'sn': parseInt(sn)},
            headers: {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            url: 'https://ani.gamer.com.tw/ajax/danmuGet.php'
        })
        if (sdanmu == null) return []

        let sizeDict = {
            1: 25,
            2: 36,
            0: 20
        }
        let positionDict = {
            0: 1,
            1: 4,
            2: 5
        }
        let ldanmu = []
        let count = startIndex
        for (let danmu of JSON.parse(sdanmu).reverse()) {
            if (!danmu["text"]) continue
            count += 1
            ldanmu.push(
                {
                    color: parseInt(danmu['color'].slice(1), 16),
                    content: danmu["text"],
                    ctime: 10,
                    fontsize: sizeDict[danmu["size"]],
                    id: count,
                    idStr: count.toString(),
                    midHash: 'bahamute',
                    mode: positionDict[danmu["position"]],
                    progress: Math.round(danmu["time"] * 100),
                    weight: 10
                }
            )
        }
        return ldanmu
    }

    function mergeDanmu(oldanmu, nldanmu) {
        if (oldanmu.idPool === undefined) {

            let idPool = new Set()
            for (let danmu of oldanmu) {
                try {
                    idPool.add(danmu.progress * danmu.content.length * parseInt(danmu.midHash, 16))

                } catch (e) {
                    console.log(danmu)
                    console.log(e)
                    throw e
                }
            }
            oldanmu.idPool = idPool
        }
        try {
            for (let danmu of nldanmu) {
                let ida = (danmu.progress ? danmu.progress : 1) * danmu.content.length * parseInt(danmu.midHash, 16)
                if (!oldanmu.idPool.has(ida)) {
                    if (!crcFilter || crcFilter(danmu.midHash)) {
                        oldanmu.push(danmu)
                        oldanmu.idPool.add(ida)
                    }
                }
            }
        } catch (e) {
            console.log()
        }

        return oldanmu
    }

    let [moreFiltedHistory, ldanmu_to_proto_seg] = (function () {
        !function (b) {
            "use strict";
            var r, u, t, n;
            r = {
                1: [function (t, n) {
                    n.exports = function (t, n) {
                        var i = Array(arguments.length - 1), e = 0, r = 2, s = !0;
                        for (; r < arguments.length;) i[e++] = arguments[r++];
                        return new Promise(function (r, u) {
                            i[e] = function (t) {
                                if (s) if (s = !1, t) u(t); else {
                                    for (var n = Array(arguments.length - 1), i = 0; i < n.length;) n[i++] = arguments[i];
                                    r.apply(null, n)
                                }
                            };
                            try {
                                t.apply(n || null, i)
                            } catch (t) {
                                s && (s = !1, u(t))
                            }
                        })
                    }
                }, {}], 2: [function (t, n, i) {
                    var r = i;
                    r.length = function (t) {
                        var n = t.length;
                        if (!n) return 0;
                        for (var i = 0; 1 < --n % 4 && "=" === t.charAt(n);) ++i;
                        return Math.ceil(3 * t.length) / 4 - i
                    };
                    for (var o = Array(64), f = Array(123), u = 0; u < 64;) f[o[u] = u < 26 ? u + 65 : u < 52 ? u + 71 : u < 62 ? u - 4 : u - 59 | 43] = u++;
                    r.encode = function (t, n, i) {
                        for (var r, u = null, e = [], s = 0, h = 0; n < i;) {
                            var f = t[n++];
                            switch (h) {
                                case 0:
                                    e[s++] = o[f >> 2], r = (3 & f) << 4, h = 1;
                                    break;
                                case 1:
                                    e[s++] = o[r | f >> 4], r = (15 & f) << 2, h = 2;
                                    break;
                                case 2:
                                    e[s++] = o[r | f >> 6], e[s++] = o[63 & f], h = 0
                            }
                            8191 < s && ((u || (u = [])).push(String.fromCharCode.apply(String, e)), s = 0)
                        }
                        return h && (e[s++] = o[r], e[s++] = 61, 1 === h && (e[s++] = 61)), u ? (s && u.push(String.fromCharCode.apply(String, e.slice(0, s))), u.join("")) : String.fromCharCode.apply(String, e.slice(0, s))
                    };
                    var c = "invalid encoding";
                    r.decode = function (t, n, i) {
                        for (var r, u = i, e = 0, s = 0; s < t.length;) {
                            var h = t.charCodeAt(s++);
                            if (61 === h && 1 < e) break;
                            if ((h = f[h]) === b) throw Error(c);
                            switch (e) {
                                case 0:
                                    r = h, e = 1;
                                    break;
                                case 1:
                                    n[i++] = r << 2 | (48 & h) >> 4, r = h, e = 2;
                                    break;
                                case 2:
                                    n[i++] = (15 & r) << 4 | (60 & h) >> 2, r = h, e = 3;
                                    break;
                                case 3:
                                    n[i++] = (3 & r) << 6 | h, e = 0
                            }
                        }
                        if (1 === e) throw Error(c);
                        return i - u
                    }, r.test = function (t) {
                        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(t)
                    }
                }, {}], 3: [function (t, n) {
                    function i() {
                        this.t = {}
                    }

                    (n.exports = i).prototype.on = function (t, n, i) {
                        return (this.t[t] || (this.t[t] = [])).push({fn: n, ctx: i || this}), this
                    }, i.prototype.off = function (t, n) {
                        if (t === b) this.t = {}; else if (n === b) this.t[t] = []; else for (var i = this.t[t], r = 0; r < i.length;) i[r].fn === n ? i.splice(r, 1) : ++r;
                        return this
                    }, i.prototype.emit = function (t) {
                        var n = this.t[t];
                        if (n) {
                            for (var i = [], r = 1; r < arguments.length;) i.push(arguments[r++]);
                            for (r = 0; r < n.length;) n[r].fn.apply(n[r++].ctx, i)
                        }
                        return this
                    }
                }, {}], 4: [function (t, n) {
                    function i(h) {
                        return "undefined" != typeof Float32Array ? function () {
                            var r = new Float32Array([-0]), u = new Uint8Array(r.buffer), t = 128 === u[3];

                            function n(t, n, i) {
                                r[0] = t, n[i] = u[0], n[i + 1] = u[1], n[i + 2] = u[2], n[i + 3] = u[3]
                            }

                            function i(t, n, i) {
                                r[0] = t, n[i] = u[3], n[i + 1] = u[2], n[i + 2] = u[1], n[i + 3] = u[0]
                            }

                            function e(t, n) {
                                return u[0] = t[n], u[1] = t[n + 1], u[2] = t[n + 2], u[3] = t[n + 3], r[0]
                            }

                            function s(t, n) {
                                return u[3] = t[n], u[2] = t[n + 1], u[1] = t[n + 2], u[0] = t[n + 3], r[0]
                            }

                            h.writeFloatLE = t ? n : i, h.writeFloatBE = t ? i : n, h.readFloatLE = t ? e : s, h.readFloatBE = t ? s : e
                        }() : function () {
                            function t(t, n, i, r) {
                                var u = n < 0 ? 1 : 0;
                                if (u && (n = -n), 0 === n) t(0 < 1 / n ? 0 : 2147483648, i, r); else if (isNaN(n)) t(2143289344, i, r); else if (3.4028234663852886e38 < n) t((u << 31 | 2139095040) >>> 0, i, r); else if (n < 1.1754943508222875e-38) t((u << 31 | Math.round(n / 1.401298464324817e-45)) >>> 0, i, r); else {
                                    var e = Math.floor(Math.log(n) / Math.LN2);
                                    t((u << 31 | e + 127 << 23 | 8388607 & Math.round(n * Math.pow(2, -e) * 8388608)) >>> 0, i, r)
                                }
                            }

                            function n(t, n, i) {
                                var r = t(n, i), u = 2 * (r >> 31) + 1, e = r >>> 23 & 255, s = 8388607 & r;
                                return 255 === e ? s ? NaN : u * (1 / 0) : 0 === e ? 1.401298464324817e-45 * u * s : u * Math.pow(2, e - 150) * (s + 8388608)
                            }

                            h.writeFloatLE = t.bind(null, r), h.writeFloatBE = t.bind(null, u), h.readFloatLE = n.bind(null, e), h.readFloatBE = n.bind(null, s)
                        }(), "undefined" != typeof Float64Array ? function () {
                            var r = new Float64Array([-0]), u = new Uint8Array(r.buffer), t = 128 === u[7];

                            function n(t, n, i) {
                                r[0] = t, n[i] = u[0], n[i + 1] = u[1], n[i + 2] = u[2], n[i + 3] = u[3], n[i + 4] = u[4], n[i + 5] = u[5], n[i + 6] = u[6], n[i + 7] = u[7]
                            }

                            function i(t, n, i) {
                                r[0] = t, n[i] = u[7], n[i + 1] = u[6], n[i + 2] = u[5], n[i + 3] = u[4], n[i + 4] = u[3], n[i + 5] = u[2], n[i + 6] = u[1], n[i + 7] = u[0]
                            }

                            function e(t, n) {
                                return u[0] = t[n], u[1] = t[n + 1], u[2] = t[n + 2], u[3] = t[n + 3], u[4] = t[n + 4], u[5] = t[n + 5], u[6] = t[n + 6], u[7] = t[n + 7], r[0]
                            }

                            function s(t, n) {
                                return u[7] = t[n], u[6] = t[n + 1], u[5] = t[n + 2], u[4] = t[n + 3], u[3] = t[n + 4], u[2] = t[n + 5], u[1] = t[n + 6], u[0] = t[n + 7], r[0]
                            }

                            h.writeDoubleLE = t ? n : i, h.writeDoubleBE = t ? i : n, h.readDoubleLE = t ? e : s, h.readDoubleBE = t ? s : e
                        }() : function () {
                            function t(t, n, i, r, u, e) {
                                var s = r < 0 ? 1 : 0;
                                if (s && (r = -r), 0 === r) t(0, u, e + n), t(0 < 1 / r ? 0 : 2147483648, u, e + i); else if (isNaN(r)) t(0, u, e + n), t(2146959360, u, e + i); else if (1.7976931348623157e308 < r) t(0, u, e + n), t((s << 31 | 2146435072) >>> 0, u, e + i); else {
                                    var h;
                                    if (r < 2.2250738585072014e-308) t((h = r / 5e-324) >>> 0, u, e + n), t((s << 31 | h / 4294967296) >>> 0, u, e + i); else {
                                        var f = Math.floor(Math.log(r) / Math.LN2);
                                        1024 === f && (f = 1023), t(4503599627370496 * (h = r * Math.pow(2, -f)) >>> 0, u, e + n), t((s << 31 | f + 1023 << 20 | 1048576 * h & 1048575) >>> 0, u, e + i)
                                    }
                                }
                            }

                            function n(t, n, i, r, u) {
                                var e = t(r, u + n), s = t(r, u + i), h = 2 * (s >> 31) + 1, f = s >>> 20 & 2047,
                                    o = 4294967296 * (1048575 & s) + e;
                                return 2047 === f ? o ? NaN : h * (1 / 0) : 0 === f ? 5e-324 * h * o : h * Math.pow(2, f - 1075) * (o + 4503599627370496)
                            }

                            h.writeDoubleLE = t.bind(null, r, 0, 4), h.writeDoubleBE = t.bind(null, u, 4, 0), h.readDoubleLE = n.bind(null, e, 0, 4), h.readDoubleBE = n.bind(null, s, 4, 0)
                        }(), h
                    }

                    function r(t, n, i) {
                        n[i] = 255 & t, n[i + 1] = t >>> 8 & 255, n[i + 2] = t >>> 16 & 255, n[i + 3] = t >>> 24
                    }

                    function u(t, n, i) {
                        n[i] = t >>> 24, n[i + 1] = t >>> 16 & 255, n[i + 2] = t >>> 8 & 255, n[i + 3] = 255 & t
                    }

                    function e(t, n) {
                        return (t[n] | t[n + 1] << 8 | t[n + 2] << 16 | t[n + 3] << 24) >>> 0
                    }

                    function s(t, n) {
                        return (t[n] << 24 | t[n + 1] << 16 | t[n + 2] << 8 | t[n + 3]) >>> 0
                    }

                    n.exports = i(i)
                }, {}], 5: [function (t, n, i) {
                    function r(t) {
                        try {
                            var n = eval("require")(t);
                            if (n && (n.length || Object.keys(n).length)) return n
                        } catch (t) {
                        }
                        return null
                    }

                    n.exports = r
                }, {}], 6: [function (t, n) {
                    n.exports = function (i, r, t) {
                        var u = t || 8192, e = u >>> 1, s = null, h = u;
                        return function (t) {
                            if (t < 1 || e < t) return i(t);
                            u < h + t && (s = i(u), h = 0);
                            var n = r.call(s, h, h += t);
                            return 7 & h && (h = 1 + (7 | h)), n
                        }
                    }
                }, {}], 7: [function (t, n, i) {
                    var r = i;
                    r.length = function (t) {
                        for (var n = 0, i = 0, r = 0; r < t.length; ++r) (i = t.charCodeAt(r)) < 128 ? n += 1 : i < 2048 ? n += 2 : 55296 == (64512 & i) && 56320 == (64512 & t.charCodeAt(r + 1)) ? (++r, n += 4) : n += 3;
                        return n
                    }, r.read = function (t, n, i) {
                        if (i - n < 1) return "";
                        for (var r, u = null, e = [], s = 0; n < i;) (r = t[n++]) < 128 ? e[s++] = r : 191 < r && r < 224 ? e[s++] = (31 & r) << 6 | 63 & t[n++] : 239 < r && r < 365 ? (r = ((7 & r) << 18 | (63 & t[n++]) << 12 | (63 & t[n++]) << 6 | 63 & t[n++]) - 65536, e[s++] = 55296 + (r >> 10), e[s++] = 56320 + (1023 & r)) : e[s++] = (15 & r) << 12 | (63 & t[n++]) << 6 | 63 & t[n++], 8191 < s && ((u || (u = [])).push(String.fromCharCode.apply(String, e)), s = 0);
                        return u ? (s && u.push(String.fromCharCode.apply(String, e.slice(0, s))), u.join("")) : String.fromCharCode.apply(String, e.slice(0, s))
                    }, r.write = function (t, n, i) {
                        for (var r, u, e = i, s = 0; s < t.length; ++s) (r = t.charCodeAt(s)) < 128 ? n[i++] = r : (r < 2048 ? n[i++] = r >> 6 | 192 : (55296 == (64512 & r) && 56320 == (64512 & (u = t.charCodeAt(s + 1))) ? (r = 65536 + ((1023 & r) << 10) + (1023 & u), ++s, n[i++] = r >> 18 | 240, n[i++] = r >> 12 & 63 | 128) : n[i++] = r >> 12 | 224, n[i++] = r >> 6 & 63 | 128), n[i++] = 63 & r | 128);
                        return i - e
                    }
                }, {}], 8: [function (t, n, i) {
                    var r = i;

                    function u() {
                        r.Reader.n(r.BufferReader), r.util.n()
                    }

                    r.build = "minimal", r.Writer = t(16), r.BufferWriter = t(17), r.Reader = t(9), r.BufferReader = t(10), r.util = t(15), r.rpc = t(12), r.roots = t(11), r.configure = u, r.Writer.n(r.BufferWriter), u()
                }, {10: 10, 11: 11, 12: 12, 15: 15, 16: 16, 17: 17, 9: 9}], 9: [function (t, n) {
                    n.exports = h;
                    var i, r = t(15), u = r.LongBits, e = r.utf8;

                    function s(t, n) {
                        return RangeError("index out of range: " + t.pos + " + " + (n || 1) + " > " + t.len)
                    }

                    function h(t) {
                        this.buf = t, this.pos = 0, this.len = t.length
                    }

                    var f, o = "undefined" != typeof Uint8Array ? function (t) {
                        if (t instanceof Uint8Array || Array.isArray(t)) return new h(t);
                        throw Error("illegal buffer")
                    } : function (t) {
                        if (Array.isArray(t)) return new h(t);
                        throw Error("illegal buffer")
                    };

                    function c() {
                        var t = new u(0, 0), n = 0;
                        if (!(4 < this.len - this.pos)) {
                            for (; n < 3; ++n) {
                                if (this.pos >= this.len) throw s(this);
                                if (t.lo = (t.lo | (127 & this.buf[this.pos]) << 7 * n) >>> 0, this.buf[this.pos++] < 128) return t
                            }
                            return t.lo = (t.lo | (127 & this.buf[this.pos++]) << 7 * n) >>> 0, t
                        }
                        for (; n < 4; ++n) if (t.lo = (t.lo | (127 & this.buf[this.pos]) << 7 * n) >>> 0, this.buf[this.pos++] < 128) return t;
                        if (t.lo = (t.lo | (127 & this.buf[this.pos]) << 28) >>> 0, t.hi = (t.hi | (127 & this.buf[this.pos]) >> 4) >>> 0, this.buf[this.pos++] < 128) return t;
                        if (n = 0, 4 < this.len - this.pos) {
                            for (; n < 5; ++n) if (t.hi = (t.hi | (127 & this.buf[this.pos]) << 7 * n + 3) >>> 0, this.buf[this.pos++] < 128) return t
                        } else for (; n < 5; ++n) {
                            if (this.pos >= this.len) throw s(this);
                            if (t.hi = (t.hi | (127 & this.buf[this.pos]) << 7 * n + 3) >>> 0, this.buf[this.pos++] < 128) return t
                        }
                        throw Error("invalid varint encoding")
                    }

                    function a(t, n) {
                        return (t[n - 4] | t[n - 3] << 8 | t[n - 2] << 16 | t[n - 1] << 24) >>> 0
                    }

                    function l() {
                        if (this.pos + 8 > this.len) throw s(this, 8);
                        return new u(a(this.buf, this.pos += 4), a(this.buf, this.pos += 4))
                    }

                    h.create = r.Buffer ? function (t) {
                        return (h.create = function (t) {
                            return r.Buffer.isBuffer(t) ? new i(t) : o(t)
                        })(t)
                    } : o, h.prototype.i = r.Array.prototype.subarray || r.Array.prototype.slice, h.prototype.uint32 = (f = 4294967295, function () {
                        if (f = (127 & this.buf[this.pos]) >>> 0, this.buf[this.pos++] < 128) return f;
                        if (f = (f | (127 & this.buf[this.pos]) << 7) >>> 0, this.buf[this.pos++] < 128) return f;
                        if (f = (f | (127 & this.buf[this.pos]) << 14) >>> 0, this.buf[this.pos++] < 128) return f;
                        if (f = (f | (127 & this.buf[this.pos]) << 21) >>> 0, this.buf[this.pos++] < 128) return f;
                        if (f = (f | (15 & this.buf[this.pos]) << 28) >>> 0, this.buf[this.pos++] < 128) return f;
                        if ((this.pos += 5) > this.len) throw this.pos = this.len, s(this, 10);
                        return f
                    }), h.prototype.int32 = function () {
                        return 0 | this.uint32()
                    }, h.prototype.sint32 = function () {
                        var t = this.uint32();
                        return t >>> 1 ^ -(1 & t) | 0
                    }, h.prototype.bool = function () {
                        return 0 !== this.uint32()
                    }, h.prototype.fixed32 = function () {
                        if (this.pos + 4 > this.len) throw s(this, 4);
                        return a(this.buf, this.pos += 4)
                    }, h.prototype.sfixed32 = function () {
                        if (this.pos + 4 > this.len) throw s(this, 4);
                        return 0 | a(this.buf, this.pos += 4)
                    }, h.prototype.float = function () {
                        if (this.pos + 4 > this.len) throw s(this, 4);
                        var t = r.float.readFloatLE(this.buf, this.pos);
                        return this.pos += 4, t
                    }, h.prototype.double = function () {
                        if (this.pos + 8 > this.len) throw s(this, 4);
                        var t = r.float.readDoubleLE(this.buf, this.pos);
                        return this.pos += 8, t
                    }, h.prototype.bytes = function () {
                        var t = this.uint32(), n = this.pos, i = this.pos + t;
                        if (i > this.len) throw s(this, t);
                        return this.pos += t, Array.isArray(this.buf) ? this.buf.slice(n, i) : n === i ? new this.buf.constructor(0) : this.i.call(this.buf, n, i)
                    }, h.prototype.string = function () {
                        var t = this.bytes();
                        return e.read(t, 0, t.length)
                    }, h.prototype.skip = function (t) {
                        if ("number" == typeof t) {
                            if (this.pos + t > this.len) throw s(this, t);
                            this.pos += t
                        } else do {
                            if (this.pos >= this.len) throw s(this)
                        } while (128 & this.buf[this.pos++]);
                        return this
                    }, h.prototype.skipType = function (t) {
                        switch (t) {
                            case 0:
                                this.skip();
                                break;
                            case 1:
                                this.skip(8);
                                break;
                            case 2:
                                this.skip(this.uint32());
                                break;
                            case 3:
                                for (; 4 != (t = 7 & this.uint32());) this.skipType(t);
                                break;
                            case 5:
                                this.skip(4);
                                break;
                            default:
                                throw Error("invalid wire type " + t + " at offset " + this.pos)
                        }
                        return this
                    }, h.n = function (t) {
                        i = t;
                        var n = r.Long ? "toLong" : "toNumber";
                        r.merge(h.prototype, {
                            int64: function () {
                                return c.call(this)[n](!1)
                            }, uint64: function () {
                                return c.call(this)[n](!0)
                            }, sint64: function () {
                                return c.call(this).zzDecode()[n](!1)
                            }, fixed64: function () {
                                return l.call(this)[n](!0)
                            }, sfixed64: function () {
                                return l.call(this)[n](!1)
                            }
                        })
                    }
                }, {15: 15}], 10: [function (t, n) {
                    n.exports = u;
                    var i = t(9);
                    (u.prototype = Object.create(i.prototype)).constructor = u;
                    var r = t(15);

                    function u(t) {
                        i.call(this, t)
                    }

                    r.Buffer && (u.prototype.i = r.Buffer.prototype.slice), u.prototype.string = function () {
                        var t = this.uint32();
                        return this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + t, this.len))
                    }
                }, {15: 15, 9: 9}], 11: [function (t, n) {
                    n.exports = {}
                }, {}], 12: [function (t, n, i) {
                    i.Service = t(13)
                }, {13: 13}], 13: [function (t, n) {
                    n.exports = i;
                    var h = t(15);

                    function i(t, n, i) {
                        if ("function" != typeof t) throw TypeError("rpcImpl must be a function");
                        h.EventEmitter.call(this), this.rpcImpl = t, this.requestDelimited = !!n, this.responseDelimited = !!i
                    }

                    ((i.prototype = Object.create(h.EventEmitter.prototype)).constructor = i).prototype.rpcCall = function t(i, n, r, u, e) {
                        if (!u) throw TypeError("request must be specified");
                        var s = this;
                        if (!e) return h.asPromise(t, s, i, n, r, u);
                        if (!s.rpcImpl) return setTimeout(function () {
                            e(Error("already ended"))
                        }, 0), b;
                        try {
                            return s.rpcImpl(i, n[s.requestDelimited ? "encodeDelimited" : "encode"](u).finish(), function (t, n) {
                                if (t) return s.emit("error", t, i), e(t);
                                if (null === n) return s.end(!0), b;
                                if (!(n instanceof r)) try {
                                    n = r[s.responseDelimited ? "decodeDelimited" : "decode"](n)
                                } catch (t) {
                                    return s.emit("error", t, i), e(t)
                                }
                                return s.emit("data", n, i), e(null, n)
                            })
                        } catch (t) {
                            return s.emit("error", t, i), setTimeout(function () {
                                e(t)
                            }, 0), b
                        }
                    }, i.prototype.end = function (t) {
                        return this.rpcImpl && (t || this.rpcImpl(null, null, null), this.rpcImpl = null, this.emit("end").off()), this
                    }
                }, {15: 15}], 14: [function (t, n) {
                    n.exports = u;
                    var i = t(15);

                    function u(t, n) {
                        this.lo = t >>> 0, this.hi = n >>> 0
                    }

                    var e = u.zero = new u(0, 0);
                    e.toNumber = function () {
                        return 0
                    }, e.zzEncode = e.zzDecode = function () {
                        return this
                    }, e.length = function () {
                        return 1
                    };
                    var r = u.zeroHash = "\0\0\0\0\0\0\0\0";
                    u.fromNumber = function (t) {
                        if (0 === t) return e;
                        var n = t < 0;
                        n && (t = -t);
                        var i = t >>> 0, r = (t - i) / 4294967296 >>> 0;
                        return n && (r = ~r >>> 0, i = ~i >>> 0, 4294967295 < ++i && (i = 0, 4294967295 < ++r && (r = 0))), new u(i, r)
                    }, u.from = function (t) {
                        if ("number" == typeof t) return u.fromNumber(t);
                        if (i.isString(t)) {
                            if (!i.Long) return u.fromNumber(parseInt(t, 10));
                            t = i.Long.fromString(t)
                        }
                        return t.low || t.high ? new u(t.low >>> 0, t.high >>> 0) : e
                    }, u.prototype.toNumber = function (t) {
                        if (!t && this.hi >>> 31) {
                            var n = 1 + ~this.lo >>> 0, i = ~this.hi >>> 0;
                            return n || (i = i + 1 >>> 0), -(n + 4294967296 * i)
                        }
                        return this.lo + 4294967296 * this.hi
                    }, u.prototype.toLong = function (t) {
                        return i.Long ? new i.Long(0 | this.lo, 0 | this.hi, !!t) : {
                            low: 0 | this.lo,
                            high: 0 | this.hi,
                            unsigned: !!t
                        }
                    };
                    var s = String.prototype.charCodeAt;
                    u.fromHash = function (t) {
                        return t === r ? e : new u((s.call(t, 0) | s.call(t, 1) << 8 | s.call(t, 2) << 16 | s.call(t, 3) << 24) >>> 0, (s.call(t, 4) | s.call(t, 5) << 8 | s.call(t, 6) << 16 | s.call(t, 7) << 24) >>> 0)
                    }, u.prototype.toHash = function () {
                        return String.fromCharCode(255 & this.lo, this.lo >>> 8 & 255, this.lo >>> 16 & 255, this.lo >>> 24, 255 & this.hi, this.hi >>> 8 & 255, this.hi >>> 16 & 255, this.hi >>> 24)
                    }, u.prototype.zzEncode = function () {
                        var t = this.hi >> 31;
                        return this.hi = ((this.hi << 1 | this.lo >>> 31) ^ t) >>> 0, this.lo = (this.lo << 1 ^ t) >>> 0, this
                    }, u.prototype.zzDecode = function () {
                        var t = -(1 & this.lo);
                        return this.lo = ((this.lo >>> 1 | this.hi << 31) ^ t) >>> 0, this.hi = (this.hi >>> 1 ^ t) >>> 0, this
                    }, u.prototype.length = function () {
                        var t = this.lo, n = (this.lo >>> 28 | this.hi << 4) >>> 0, i = this.hi >>> 24;
                        return 0 === i ? 0 === n ? t < 16384 ? t < 128 ? 1 : 2 : t < 2097152 ? 3 : 4 : n < 16384 ? n < 128 ? 5 : 6 : n < 2097152 ? 7 : 8 : i < 128 ? 9 : 10
                    }
                }, {15: 15}], 15: [function (t, n, i) {
                    var r = i;

                    function u(t, n, i) {
                        for (var r = Object.keys(n), u = 0; u < r.length; ++u) t[r[u]] !== b && i || (t[r[u]] = n[r[u]]);
                        return t
                    }

                    function e(t) {
                        function i(t, n) {
                            if (!(this instanceof i)) return new i(t, n);
                            Object.defineProperty(this, "message", {
                                get: function () {
                                    return t
                                }
                            }), Error.captureStackTrace ? Error.captureStackTrace(this, i) : Object.defineProperty(this, "stack", {value: Error().stack || ""}), n && u(this, n)
                        }

                        return (i.prototype = Object.create(Error.prototype)).constructor = i, Object.defineProperty(i.prototype, "name", {
                            get: function () {
                                return t
                            }
                        }), i.prototype.toString = function () {
                            return this.name + ": " + this.message
                        }, i
                    }

                    r.asPromise = t(1), r.base64 = t(2), r.EventEmitter = t(3), r.float = t(4), r.inquire = t(5), r.utf8 = t(7), r.pool = t(6), r.LongBits = t(14), r.global = "undefined" != typeof window && window || "undefined" != typeof global && global || "undefined" != typeof self && self || this, r.emptyArray = Object.freeze ? Object.freeze([]) : [], r.emptyObject = Object.freeze ? Object.freeze({}) : {}, r.isNode = !!(r.global.process && r.global.process.versions && r.global.process.versions.node), r.isInteger = Number.isInteger || function (t) {
                        return "number" == typeof t && isFinite(t) && Math.floor(t) === t
                    }, r.isString = function (t) {
                        return "string" == typeof t || t instanceof String
                    }, r.isObject = function (t) {
                        return t && "object" == typeof t
                    }, r.isset = r.isSet = function (t, n) {
                        var i = t[n];
                        return !(null == i || !t.hasOwnProperty(n)) && ("object" != typeof i || 0 < (Array.isArray(i) ? i.length : Object.keys(i).length))
                    }, r.Buffer = function () {
                        try {
                            var t = r.inquire("buffer").Buffer;
                            return t.prototype.utf8Write ? t : null
                        } catch (t) {
                            return null
                        }
                    }(), r.r = null, r.u = null, r.newBuffer = function (t) {
                        return "number" == typeof t ? r.Buffer ? r.u(t) : new r.Array(t) : r.Buffer ? r.r(t) : "undefined" == typeof Uint8Array ? t : new Uint8Array(t)
                    }, r.Array = "undefined" != typeof Uint8Array ? Uint8Array : Array, r.Long = r.global.dcodeIO && r.global.dcodeIO.Long || r.global.Long || r.inquire("long"), r.key2Re = /^true|false|0|1$/, r.key32Re = /^-?(?:0|[1-9][0-9]*)$/, r.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/, r.longToHash = function (t) {
                        return t ? r.LongBits.from(t).toHash() : r.LongBits.zeroHash
                    }, r.longFromHash = function (t, n) {
                        var i = r.LongBits.fromHash(t);
                        return r.Long ? r.Long.fromBits(i.lo, i.hi, n) : i.toNumber(!!n)
                    }, r.merge = u, r.lcFirst = function (t) {
                        return t.charAt(0).toLowerCase() + t.substring(1)
                    }, r.newError = e, r.ProtocolError = e("ProtocolError"), r.oneOfGetter = function (t) {
                        for (var i = {}, n = 0; n < t.length; ++n) i[t[n]] = 1;
                        return function () {
                            for (var t = Object.keys(this), n = t.length - 1; -1 < n; --n) if (1 === i[t[n]] && this[t[n]] !== b && null !== this[t[n]]) return t[n]
                        }
                    }, r.oneOfSetter = function (i) {
                        return function (t) {
                            for (var n = 0; n < i.length; ++n) i[n] !== t && delete this[i[n]]
                        }
                    }, r.toJSONOptions = {longs: String, enums: String, bytes: String, json: !0}, r.n = function () {
                        var i = r.Buffer;
                        i ? (r.r = i.from !== Uint8Array.from && i.from || function (t, n) {
                            return new i(t, n)
                        }, r.u = i.allocUnsafe || function (t) {
                            return new i(t)
                        }) : r.r = r.u = null
                    }
                }, {1: 1, 14: 14, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7}], 16: [function (t, n) {
                    n.exports = c;
                    var i, r = t(15), u = r.LongBits, e = r.base64, s = r.utf8;

                    function h(t, n, i) {
                        this.fn = t, this.len = n, this.next = b, this.val = i
                    }

                    function f() {
                    }

                    function o(t) {
                        this.head = t.head, this.tail = t.tail, this.len = t.len, this.next = t.states
                    }

                    function c() {
                        this.len = 0, this.head = new h(f, 0, 0), this.tail = this.head, this.states = null
                    }

                    function a(t, n, i) {
                        n[i] = 255 & t
                    }

                    function l(t, n) {
                        this.len = t, this.next = b, this.val = n
                    }

                    function v(t, n, i) {
                        for (; t.hi;) n[i++] = 127 & t.lo | 128, t.lo = (t.lo >>> 7 | t.hi << 25) >>> 0, t.hi >>>= 7;
                        for (; 127 < t.lo;) n[i++] = 127 & t.lo | 128, t.lo = t.lo >>> 7;
                        n[i++] = t.lo
                    }

                    function w(t, n, i) {
                        n[i] = 255 & t, n[i + 1] = t >>> 8 & 255, n[i + 2] = t >>> 16 & 255, n[i + 3] = t >>> 24
                    }

                    c.create = r.Buffer ? function () {
                        return (c.create = function () {
                            return new i
                        })()
                    } : function () {
                        return new c
                    }, c.alloc = function (t) {
                        return new r.Array(t)
                    }, r.Array !== Array && (c.alloc = r.pool(c.alloc, r.Array.prototype.subarray)), c.prototype.e = function (t, n, i) {
                        return this.tail = this.tail.next = new h(t, n, i), this.len += n, this
                    }, (l.prototype = Object.create(h.prototype)).fn = function (t, n, i) {
                        for (; 127 < t;) n[i++] = 127 & t | 128, t >>>= 7;
                        n[i] = t
                    }, c.prototype.uint32 = function (t) {
                        return this.len += (this.tail = this.tail.next = new l((t >>>= 0) < 128 ? 1 : t < 16384 ? 2 : t < 2097152 ? 3 : t < 268435456 ? 4 : 5, t)).len, this
                    }, c.prototype.int32 = function (t) {
                        return t < 0 ? this.e(v, 10, u.fromNumber(t)) : this.uint32(t)
                    }, c.prototype.sint32 = function (t) {
                        return this.uint32((t << 1 ^ t >> 31) >>> 0)
                    }, c.prototype.int64 = c.prototype.uint64 = function (t) {
                        var n = u.from(t);
                        return this.e(v, n.length(), n)
                    }, c.prototype.sint64 = function (t) {
                        var n = u.from(t).zzEncode();
                        return this.e(v, n.length(), n)
                    }, c.prototype.bool = function (t) {
                        return this.e(a, 1, t ? 1 : 0)
                    }, c.prototype.sfixed32 = c.prototype.fixed32 = function (t) {
                        return this.e(w, 4, t >>> 0)
                    }, c.prototype.sfixed64 = c.prototype.fixed64 = function (t) {
                        var n = u.from(t);
                        return this.e(w, 4, n.lo).e(w, 4, n.hi)
                    }, c.prototype.float = function (t) {
                        return this.e(r.float.writeFloatLE, 4, t)
                    }, c.prototype.double = function (t) {
                        return this.e(r.float.writeDoubleLE, 8, t)
                    };
                    var y = r.Array.prototype.set ? function (t, n, i) {
                        n.set(t, i)
                    } : function (t, n, i) {
                        for (var r = 0; r < t.length; ++r) n[i + r] = t[r]
                    };
                    c.prototype.bytes = function (t) {
                        var n = t.length >>> 0;
                        if (!n) return this.e(a, 1, 0);
                        if (r.isString(t)) {
                            var i = c.alloc(n = e.length(t));
                            e.decode(t, i, 0), t = i
                        }
                        return this.uint32(n).e(y, n, t)
                    }, c.prototype.string = function (t) {
                        var n = s.length(t);
                        return n ? this.uint32(n).e(s.write, n, t) : this.e(a, 1, 0)
                    }, c.prototype.fork = function () {
                        return this.states = new o(this), this.head = this.tail = new h(f, 0, 0), this.len = 0, this
                    }, c.prototype.reset = function () {
                        return this.states ? (this.head = this.states.head, this.tail = this.states.tail, this.len = this.states.len, this.states = this.states.next) : (this.head = this.tail = new h(f, 0, 0), this.len = 0), this
                    }, c.prototype.ldelim = function () {
                        var t = this.head, n = this.tail, i = this.len;
                        return this.reset().uint32(i), i && (this.tail.next = t.next, this.tail = n, this.len += i), this
                    }, c.prototype.finish = function () {
                        for (var t = this.head.next, n = this.constructor.alloc(this.len), i = 0; t;) t.fn(t.val, n, i), i += t.len, t = t.next;
                        return n
                    }, c.n = function (t) {
                        i = t
                    }
                }, {15: 15}], 17: [function (t, n) {
                    n.exports = e;
                    var i = t(16);
                    (e.prototype = Object.create(i.prototype)).constructor = e;
                    var r = t(15), u = r.Buffer;

                    function e() {
                        i.call(this)
                    }

                    e.alloc = function (t) {
                        return (e.alloc = r.u)(t)
                    };
                    var s = u && u.prototype instanceof Uint8Array && "set" === u.prototype.set.name ? function (t, n, i) {
                        n.set(t, i)
                    } : function (t, n, i) {
                        if (t.copy) t.copy(n, i, 0, t.length); else for (var r = 0; r < t.length;) n[i++] = t[r++]
                    };

                    function h(t, n, i) {
                        t.length < 40 ? r.utf8.write(t, n, i) : n.utf8Write(t, i)
                    }

                    e.prototype.bytes = function (t) {
                        r.isString(t) && (t = r.r(t, "base64"));
                        var n = t.length >>> 0;
                        return this.uint32(n), n && this.e(s, n, t), this
                    }, e.prototype.string = function (t) {
                        var n = u.byteLength(t);
                        return this.uint32(n), n && this.e(h, n, t), this
                    }
                }, {15: 15, 16: 16}]
            }, u = {}, t = [8], n = function t(n) {
                var i = u[n];
                return i || r[n][0].call(i = u[n] = {exports: {}}, t, i, i.exports), i.exports
            }(t[0]), n.util.global.protobuf = n, "function" == typeof define && define.amd && define(["long"], function (t) {
                return t && t.isLong && (n.util.Long = t, n.configure()), n
            }), "object" == typeof module && module && module.exports && (module.exports = n)
        }();
        (function ($protobuf) {
            "use strict";
            var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

            var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

            $root.bilibili = (function () {

                var bilibili = {};

                bilibili.community = (function () {

                    var community = {};

                    community.service = (function () {

                        var service = {};

                        service.dm = (function () {

                            var dm = {};

                            dm.v1 = (function () {

                                var v1 = {};

                                v1.DmSegMobileReply = (function () {

                                    function DmSegMobileReply(p) {
                                        this.elems = [];
                                        if (p)
                                            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                                if (p[ks[i]] != null)
                                                    this[ks[i]] = p[ks[i]];
                                    }

                                    DmSegMobileReply.prototype.elems = $util.emptyArray;
                                    DmSegMobileReply.prototype.state = 0;
                                    DmSegMobileReply.prototype.aiFlag = null;

                                    DmSegMobileReply.create = function create(properties) {
                                        return new DmSegMobileReply(properties);
                                    };

                                    DmSegMobileReply.encode = function encode(m, w) {
                                        if (!w)
                                            w = $Writer.create();
                                        if (m.elems != null && m.elems.length) {
                                            for (var i = 0; i < m.elems.length; ++i)
                                                $root.bilibili.community.service.dm.v1.DanmakuElem.encode(m.elems[i], w.uint32(10).fork()).ldelim();
                                        }
                                        if (m.state != null && Object.hasOwnProperty.call(m, "state"))
                                            w.uint32(16).int32(m.state);
                                        if (m.aiFlag != null && Object.hasOwnProperty.call(m, "aiFlag"))
                                            $root.bilibili.community.service.dm.v1.DanmakuAIFlag.encode(m.aiFlag, w.uint32(26).fork()).ldelim();
                                        return w;
                                    };

                                    DmSegMobileReply.decode = function decode(r, l) {
                                        if (!(r instanceof $Reader))
                                            r = $Reader.create(r);
                                        var c = l === undefined ? r.len : r.pos + l,
                                            m = new $root.bilibili.community.service.dm.v1.DmSegMobileReply();
                                        while (r.pos < c) {
                                            var t = r.uint32();
                                            switch (t >>> 3) {
                                                case 1:
                                                    if (!(m.elems && m.elems.length))
                                                        m.elems = [];
                                                    m.elems.push($root.bilibili.community.service.dm.v1.DanmakuElem.decode(r, r.uint32()));
                                                    break;
                                                case 2:
                                                    m.state = r.int32();
                                                    break;
                                                case 3:
                                                    m.aiFlag = $root.bilibili.community.service.dm.v1.DanmakuAIFlag.decode(r, r.uint32());
                                                    break;
                                                default:
                                                    r.skipType(t & 7);
                                                    break;
                                            }
                                        }
                                        return m;
                                    };

                                    return DmSegMobileReply;
                                })();

                                v1.DanmakuFlag = (function () {

                                    function DanmakuFlag(p) {
                                        if (p)
                                            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                                if (p[ks[i]] != null)
                                                    this[ks[i]] = p[ks[i]];
                                    }

                                    DanmakuFlag.prototype.dmid = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                    DanmakuFlag.prototype.flag = 0;

                                    DanmakuFlag.create = function create(properties) {
                                        return new DanmakuFlag(properties);
                                    };

                                    DanmakuFlag.encode = function encode(m, w) {
                                        if (!w)
                                            w = $Writer.create();
                                        if (m.dmid != null && Object.hasOwnProperty.call(m, "dmid"))
                                            w.uint32(8).int64(m.dmid);
                                        if (m.flag != null && Object.hasOwnProperty.call(m, "flag"))
                                            w.uint32(16).uint32(m.flag);
                                        return w;
                                    };

                                    DanmakuFlag.decode = function decode(r, l) {
                                        if (!(r instanceof $Reader))
                                            r = $Reader.create(r);
                                        var c = l === undefined ? r.len : r.pos + l,
                                            m = new $root.bilibili.community.service.dm.v1.DanmakuFlag();
                                        while (r.pos < c) {
                                            var t = r.uint32();
                                            switch (t >>> 3) {
                                                case 1:
                                                    m.dmid = r.int64();
                                                    break;
                                                case 2:
                                                    m.flag = r.uint32();
                                                    break;
                                                default:
                                                    r.skipType(t & 7);
                                                    break;
                                            }
                                        }
                                        return m;
                                    };

                                    return DanmakuFlag;
                                })();

                                v1.DanmakuAIFlag = (function () {

                                    function DanmakuAIFlag(p) {
                                        this.dmFlags = [];
                                        if (p)
                                            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                                if (p[ks[i]] != null)
                                                    this[ks[i]] = p[ks[i]];
                                    }

                                    DanmakuAIFlag.prototype.dmFlags = $util.emptyArray;

                                    DanmakuAIFlag.create = function create(properties) {
                                        return new DanmakuAIFlag(properties);
                                    };

                                    DanmakuAIFlag.encode = function encode(m, w) {
                                        if (!w)
                                            w = $Writer.create();
                                        if (m.dmFlags != null && m.dmFlags.length) {
                                            for (var i = 0; i < m.dmFlags.length; ++i)
                                                $root.bilibili.community.service.dm.v1.DanmakuFlag.encode(m.dmFlags[i], w.uint32(10).fork()).ldelim();
                                        }
                                        return w;
                                    };

                                    DanmakuAIFlag.decode = function decode(r, l) {
                                        if (!(r instanceof $Reader))
                                            r = $Reader.create(r);
                                        var c = l === undefined ? r.len : r.pos + l,
                                            m = new $root.bilibili.community.service.dm.v1.DanmakuAIFlag();
                                        while (r.pos < c) {
                                            var t = r.uint32();
                                            switch (t >>> 3) {
                                                case 1:
                                                    if (!(m.dmFlags && m.dmFlags.length))
                                                        m.dmFlags = [];
                                                    m.dmFlags.push($root.bilibili.community.service.dm.v1.DanmakuFlag.decode(r, r.uint32()));
                                                    break;
                                                default:
                                                    r.skipType(t & 7);
                                                    break;
                                            }
                                        }
                                        return m;
                                    };

                                    return DanmakuAIFlag;
                                })();

                                v1.DanmakuElem = (function () {

                                    function DanmakuElem(p) {
                                        if (p)
                                            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                                if (p[ks[i]] != null)
                                                    this[ks[i]] = p[ks[i]];
                                    }

                                    DanmakuElem.prototype.id = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                    DanmakuElem.prototype.progress = 0;
                                    DanmakuElem.prototype.mode = 0;
                                    DanmakuElem.prototype.fontsize = 0;
                                    DanmakuElem.prototype.color = 0;
                                    DanmakuElem.prototype.midHash = "";
                                    DanmakuElem.prototype.content = "";
                                    DanmakuElem.prototype.ctime = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
                                    DanmakuElem.prototype.weight = 0;
                                    DanmakuElem.prototype.action = "";
                                    DanmakuElem.prototype.pool = 0;
                                    DanmakuElem.prototype.idStr = "";
                                    DanmakuElem.prototype.attr = 0;
                                    DanmakuElem.prototype.animation = "";

                                    DanmakuElem.create = function create(properties) {
                                        return new DanmakuElem(properties);
                                    };

                                    DanmakuElem.encode = function encode(m, w) {
                                        if (!w)
                                            w = $Writer.create();
                                        if (m.id != null && Object.hasOwnProperty.call(m, "id"))
                                            w.uint32(8).int64(m.id);
                                        if (m.progress != null && Object.hasOwnProperty.call(m, "progress"))
                                            w.uint32(16).int32(m.progress);
                                        if (m.mode != null && Object.hasOwnProperty.call(m, "mode"))
                                            w.uint32(24).int32(m.mode);
                                        if (m.fontsize != null && Object.hasOwnProperty.call(m, "fontsize"))
                                            w.uint32(32).int32(m.fontsize);
                                        if (m.color != null && Object.hasOwnProperty.call(m, "color"))
                                            w.uint32(40).uint32(m.color);
                                        if (m.midHash != null && Object.hasOwnProperty.call(m, "midHash"))
                                            w.uint32(50).string(m.midHash);
                                        if (m.content != null && Object.hasOwnProperty.call(m, "content"))
                                            w.uint32(58).string(m.content);
                                        if (m.ctime != null && Object.hasOwnProperty.call(m, "ctime"))
                                            w.uint32(64).int64(m.ctime);
                                        if (m.weight != null && Object.hasOwnProperty.call(m, "weight"))
                                            w.uint32(72).int32(m.weight);
                                        if (m.action != null && Object.hasOwnProperty.call(m, "action"))
                                            w.uint32(82).string(m.action);
                                        if (m.pool != null && Object.hasOwnProperty.call(m, "pool"))
                                            w.uint32(88).int32(m.pool);
                                        if (m.idStr != null && Object.hasOwnProperty.call(m, "idStr"))
                                            w.uint32(98).string(m.idStr);
                                        if (m.attr != null && Object.hasOwnProperty.call(m, "attr"))
                                            w.uint32(104).int32(m.attr);
                                        if (m.animation != null && Object.hasOwnProperty.call(m, "animation"))
                                            w.uint32(178).string(m.animation);
                                        return w;
                                    };

                                    DanmakuElem.decode = function decode(r, l) {
                                        if (!(r instanceof $Reader))
                                            r = $Reader.create(r);
                                        var c = l === undefined ? r.len : r.pos + l,
                                            m = new $root.bilibili.community.service.dm.v1.DanmakuElem();
                                        while (r.pos < c) {
                                            var t = r.uint32();
                                            switch (t >>> 3) {
                                                case 1:
                                                    m.id = r.int64();
                                                    break;
                                                case 2:
                                                    m.progress = r.int32();
                                                    break;
                                                case 3:
                                                    m.mode = r.int32();
                                                    break;
                                                case 4:
                                                    m.fontsize = r.int32();
                                                    break;
                                                case 5:
                                                    m.color = r.uint32();
                                                    break;
                                                case 6:
                                                    m.midHash = r.string();
                                                    break;
                                                case 7:
                                                    m.content = r.string();
                                                    break;
                                                case 8:
                                                    m.ctime = r.int64();
                                                    break;
                                                case 9:
                                                    m.weight = r.int32();
                                                    break;
                                                case 10:
                                                    m.action = r.string();
                                                    break;
                                                case 11:
                                                    m.pool = r.int32();
                                                    break;
                                                case 12:
                                                    m.idStr = r.string();
                                                    break;
                                                case 13:
                                                    m.attr = r.int32();
                                                    break;
                                                case 22:
                                                    m.animation = r.string();
                                                    break;
                                                default:
                                                    r.skipType(t & 7);
                                                    break;
                                            }
                                        }
                                        return m;
                                    };

                                    return DanmakuElem;
                                })();

                                return v1;
                            })();

                            return dm;
                        })();

                        return service;
                    })();

                    return community;
                })();

                return bilibili;
            })();
        })(protobuf);
        var proto_seg = protobuf.roots.default.bilibili.community.service.dm.v1.DmSegMobileReply;
        var LOG_PROTO = false;

        function colorFilter(ldanmu) {
            let tldanmu = []
            for (let idanmu = 0; idanmu < ldanmu.length; idanmu += 1) {
                let ffilted = false

                for (let ruleGroup of extensionSetting.filterRule) {

                    if (ruleGroup['color']) {
                        for (let irule = 0; irule < ruleGroup['color'].length; irule += 1) {
                            if (ruleGroup['color'][irule] === ldanmu[idanmu].color) {
                                ffilted = true;
                                break
                            }
                        }
                    }
                    if (ffilted) {
                        break
                    }
                }
                if (!ffilted) {
                    tldanmu.push(ldanmu[idanmu])
                }
            }
            return tldanmu
        }

        function xmlunEscape(content) {
            return content.replace('；', ';')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '&')
                .replace(/&gt;/g, '&')
                .replace(/&apos;/g, '&')
                .replace(/&quot;/g, '&')
        }

        window.xml2danmu = (sdanmu, user = null) => {
            let ldanmu = sdanmu.split('</d><d p=');

            if (ldanmu.length === 1) {
                return []
            }
            let tdanmu = ldanmu[0];
            ldanmu[0] = tdanmu.slice(tdanmu.indexOf('<d p=') + 5, tdanmu.length);
            tdanmu = ldanmu[ldanmu.length - 1];
            ldanmu[ldanmu.length - 1] = tdanmu.slice(0, tdanmu.length - 8);
            for (let i = 0; i < ldanmu.length; i++) {
                let danmu = ldanmu[i]
                let argv = danmu.substring(1, danmu.indexOf('"', 2)).split(',')
                ldanmu[i] = {
                    color: Number(argv[3]),
                    content: xmlunEscape(danmu.slice(danmu.indexOf('>') + 1, danmu.length)),
                    ctime: Number(argv[4]),
                    fontsize: Number(argv[2]),
                    id: Number(argv[7]),
                    idStr: argv[7],
                    midHash: argv[6],
                    mode: Number(argv[1]),
                    progress: Math.round(Number(argv[0]) * 1000),
                    weight: 10
                }
            }
            return ldanmu
        }

        function getdate(date) {
            let month = Number(date.getMonth()) + 1;
            if (month < 10) {
                month = '0' + month
            }
            let sdate
            if (Number(date.getDate()) < 10) {
                sdate = '0' + date.getDate()
            } else {
                sdate = date.getDate()
            }
            return [date.getFullYear(), month, sdate].join('-')
        }


        function getMinDate(ldanmu) {
            let minDate = ldanmu[0].ctime
            for (let danmu of ldanmu) {
                if (minDate > danmu.ctime) {
                    minDate = danmu.ctime
                }
            }
            return minDate
        }

        window.danmakuDetail = async function (cid) {
            let [aldanmu, ndanmu] = await commentDanmaku(cid)
            aldanmu = []
            let duration = poolSize2Duration(ndanmu)
            let lastSegmentIndex = Math.floor(duration / 360) + 1
            mergeDanmu(aldanmu, await loadProtoDanmu("https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&date="
                + getdate(new Date()) + "&oid=" + cid.toString()))
            while (true) {
                let ldanmu = await loadProtoDanmu('https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid='
                    + cid + '&segment_index=' + lastSegmentIndex)
                if (!ldanmu) {
                    lastSegmentIndex -= 1
                } else {
                    mergeDanmu(aldanmu, ldanmu)
                    break
                }
            }
            let last = 0
            aldanmu.forEach(elem => {
                if (elem.progress > last) last = elem.progress
            })
            let latest = 0
            aldanmu.forEach(elem => {
                if (elem.ctime > latest) latest = elem.ctime
            })
            return [last, latest]
        }

        window.commentDanmaku = async function commentDanmaku(cid) {
            let url = 'https://comment.bilibili.com/' + cid + '.xml'
            let sdanmu = null
            while (sdanmu == null) {
                sdanmu = await xhrGet(url)
            }
            let ndanmu = Number(/<maxlimit>(.*?)</.exec(sdanmu)[1])
            if (ndanmu === 8000 && duration !== null) {
                ndanmu = parseInt((duration / 24 / 60) * 3000)
            }
            let ldanmu
            if (Number(/<state>(.*?)</.exec(sdanmu)[1]) === 0) {
                ldanmu = window.xml2danmu(sdanmu)
            }
            return [ldanmu, ndanmu]
        }

        async function allProtobufDanmu(cid, duration) {
            let segIndex = 0, aldanmu = []
            while (true) {
                segIndex += 1

                let tldanmu = await loadProtoDanmu('https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid='
                    + cid + '&segment_index=' + segIndex)
                // if (tldanmu.length === 0) {
                //     break
                // }

                tldanmu = colorFilter(tldanmu)
                tldanmu = await danmuFilter(tldanmu, null, cid)
                mergeDanmu(aldanmu, tldanmu)
                if (segIndex * 360 > duration) {
                    break
                }
            }
            return aldanmu
        }

        async function loadProtoDanmu(url, timeout = null, header = null, retry = 0) {
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true
            try {
                if (timeout !== null) {
                    xhr.timeout = timeout
                }

                xhr.open("get", url, true);
                xhr.responseType = 'arraybuffer';

                if (header !== null) {
                    for (let key in header) {
                        xhr.setRequestHeader(key, header[key])
                    }
                }

                xhr.send()

                return new Promise(
                    (resolve) => {
                        xhr.onreadystatechange = async () => {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    try {
                                        let lpdanmu = proto_seg.decode(new Uint8Array(xhr.response));
                                        lpdanmu.elems.forEach((e) => {
                                            if (!e.progress) e.progress = 0
                                        })
                                        resolve(lpdanmu.elems)
                                    } catch (e) {
                                        console.log(e)
                                        resolve([])
                                    }

                                } else if (xhr.status === 304) {
                                    resolve(null)
                                } else {
                                    console.log('XhrError=', retry, '/', xhr)
                                    if (retry < 3) {
                                        resolve(await loadProtoDanmu(url, timeout, header, retry + 1))
                                    } else {
                                        resolve(null)
                                    }
                                }
                            }
                        }
                    }
                )
            } catch (e) {
                console.log('XhrError=', retry, '/', xhr)
                if (retry < 3) {
                    return (await loadProtoDanmu(url, timeout, header, retry + 1))
                }
            }
        }

        return [
            async function moreFiltedHistory(cid, duration = null, existNdanmu = 0, expectedDanmuNum = 0) {
                let date = new Date();
                date.setTime(date.getTime() - 86400000)
                console.log('GetDanmuFor CID' + cid)
                let aldanmu = [], lfiltedDanmu = [], ldanmu = []
                let ndanmu, ondanmu
                [ldanmu, ondanmu] = await commentDanmaku(cid)
                ndanmu = ondanmu
                if (ndanmu === 8000 && duration !== null) {
                    ndanmu = parseInt((duration / 24 / 60) * 3000)
                }
                // if (ldanmu.length < ondanmu * 0.1) {
                //     return [ldanmu, ndanmu, ldanmu.length]
                // }
                let isStart = true
                let result = null
                while (true) {
                    let sdanmu = null
                    if (isStart || ldanmu.length >= Math.min(ondanmu, 5000) * 0.9) {
                        url = "https://api.bilibili.com/x/v2/dm/web/history/seg.so?type=1&date="
                            + getdate(date) + "&oid=" + cid.toString();
                        console.log('ndanmu:', aldanmu.length, '/', lfiltedDanmu.length, getdate(date), url);
                        sdanmu = loadProtoDanmu(url)
                    }
                    let oldanmu = colorFilter(ldanmu)
                    aldanmu = mergeDanmu(aldanmu, oldanmu)
                    lfiltedDanmu = mergeDanmu(lfiltedDanmu, await danmuFilter(oldanmu, null, cid))
                    if (!isStart && ldanmu.length < Math.min(ondanmu, 5000) * 0.9) {
                        result = [aldanmu, ondanmu, aldanmu.length]
                        break
                    }
                    if (!isStart && lfiltedDanmu.length > ndanmu * extensionSetting.danmuRate) {
                        result = [lfiltedDanmu, ondanmu, aldanmu.length]
                        break
                    }
                    ldanmu = await sdanmu
                    if (ldanmu.length >= Math.min(ondanmu, 5000) * 0.9) {
                        let firstdate = getMinDate(ldanmu) * 1000
                        if (date.getTime() - firstdate < 86400000)
                            firstdate = date.getTime() - 86400000;
                        date.setTime(firstdate);
                    }
                    if (isStart) {
                        isStart = false
                    }
                }
                if (expectedDanmuNum === -1 || result[2] === 0 || (result[2] < expectedDanmuNum && result[2] > Math.min(ndanmu, 5000))) {
                    mergeDanmu(ldanmu, await allProtobufDanmu(cid, duration))
                }
                return result
            },
            function ldanmu_to_proto_seg(ldanmu, segIndex) {
                let res = [];
                // if (ndanmu * extensionSetting.danmuRate > ldanmu.length) {
                //     ldanmu = mergeDanmu(ldanmu,
                //         await danmuFilter(await loadProtoDanmu('https://api.bilibili.com/x/v2/dm/web/seg.so?type=1&oid='
                //             + cid + '&segment_index=' + segIndex))
                //     )
                // }
                if (segIndex !== null) {
                    for (sdanmu of ldanmu) {
                        if (sdanmu.progress < segIndex * 360000 && sdanmu.progress >= (segIndex - 1) * 360000) {
                            res.push(sdanmu)
                        }
                    }
                } else res = ldanmu
                let res_uint8arr = proto_seg.encode(proto_seg.create({elems: res})).finish();
                if (LOG_PROTO) console.log("verbose proto:", dom, res, res_uint8arr);
                return [res_uint8arr, res.length, res]
            }
        ]
    })();

    async function getBiliVideoDuration(aid, cid, ipage = undefined) {
        let pagelist = JSON.parse(await xhrGet('https://api.bilibili.com/x/player/pagelist?aid=' + aid + '&jsonp=jsonp'))
        let tDuration = null
        for (let i = 0; i < pagelist.data.length; i++) {
            let page = pagelist.data[i]
            if (page.cid === parseInt(cid)) {
                tDuration = page.duration
                if (ipage === null) {
                    ipage = i
                }
            }
        }
        if (tDuration === null) {
            console.log('cid', cid, 'not in', pagelist)
        }
        if (ipage === undefined) {
            return tDuration
        } else {
            return [tDuration, ipage]
        }
    }

    function duration2poolSize(duration) {
        let lPoolSize = [
            [0, 100],
            [30, 300],
            [60, 500],
            [180, 1000],
            [600, 1500],
            [900, 3000],
            [1500, 4000],
            [2400, 6000],
            [3600, 8000],
        ]
        for (let i = 0; i < lPoolSize.length; i += 1) {
            if (duration > lPoolSize[lPoolSize.length - i - 1][0]) {
                return lPoolSize[lPoolSize.length - i - 1][1]
            }
        }
    }

    function poolSize2Duration(poolSize) {
        let lPoolSize = [
            [0, 100],
            [30, 300],
            [60, 500],
            [180, 1000],
            [600, 1500],
            [900, 3000],
            [1500, 4000],
            [2400, 6000],
            [3600, 8000],
        ]

        for (let i = 0; i < lPoolSize.length; i += 1) {
            if (poolSize === lPoolSize[i][1]) {
                return lPoolSize[i + 1][0]
            }
        }
    }

    let mergeServerDanmaku = function () {
        'use strict'

        let outsideFliter = [{
            regexp: [
                JSON.parse('"\u8fbd\u5b81|\u5409\u6797|\u9ed1\u9f99\u6c5f|\u6cb3\u5317|\u5c71\u897f|\u9655\u897f|\u7518\u8083|\u9752\u6d77|\u5c71\u4e1c|\u5b89\u5fbd|\u6c5f\u82cf|\u6d59\u6c5f|\u6cb3\u5357|\u6e56\u5317|\u6e56\u5357|\u6c5f\u897f|\u53f0\u6e7e|\u798f\u5efa|\u4e91\u5357|\u6d77\u5357|\u56db\u5ddd|\u8d35\u5dde|\u5e7f\u4e1c|\u5185\u8499\u53e4|\u65b0\u7586|\u5e7f\u897f|\u897f\u85cf|\u5b81\u590f|\u5317\u4eac|\u4e0a\u6d77|\u5929\u6d25|\u91cd\u5e86|\u9999\u6e2f|\u6fb3\u95e8|\u6df1\u5733|\u5e7f\u5dde|\u6210\u90fd|\u907c\u5be7|\u5409\u6797|\u9ed1\u9f8d\u6c5f|\u6cb3\u5317|\u5c71\u897f|\u965c\u897f|\u7518\u8085|\u9752\u6d77|\u5c71\u6771|\u5b89\u5fbd|\u6c5f\u8607|\u6d59\u6c5f|\u6cb3\u5357|\u6e56\u5317|\u6e56\u5357|\u6c5f\u897f|\u81fa\u7063|\u798f\u5efa|\u96f2\u5357|\u6d77\u5357|\u56db\u5ddd|\u8cb4\u5dde|\u5ee3\u6771|\u5167\u8499\u53e4|\u65b0\u7586|\u5ee3\u897f|\u897f\u85cf|\u5be7\u590f|\u5317\u4eac|\u4e0a\u6d77|\u5929\u6d25|\u91cd\u6176|\u9999\u6e2f|\u6fb3\u9580|\u6df1\u5733|\u5ee3\u5dde|\u6210\u90fd|\u9080\u8bf7\u7801|\u667a\u969c|\u98ce\u4e91|fengyun|\\\\.inf|KK44K|\u8d64\u58c1|\u54c8\u65e5|1819se|\u652f\u4ed8\u5b9d|alipay|\u517c\u804c|\u6700\u597d\u7684|\u8fd1\u5e73|\u4f1a\u6240|\u65e5\u72d7|\u65e5\u8d3c|\u9ed1\u6728\u8033|ktv08|\\\\.com|shabi|shabi|SHABI|ShaBi|nimabi|NIMABI|nima|CNM|CTM|caotama|CAOTAMA|\u64cd\u4ed6\u5988|UPshabi|UP\u50bb\u903c|\u5783\u573e|laji|\u4ec0\u4e48\u73a9\u610f|shabi|TMD|\u5403\u5c4e|ed2k|QQ\u7fa4|\u6263\u6263\u7fa4|\u798f\u5229\u7f51|\\\\.tk|\u9a6c\u8001\u5e08|Q\u7fa4|\u50bb\u903c|\u5fcd\u8005\u5802|\u4e1c\u4eac\u5965|\u50bbb|\u59dc\u6c0f\u96c6\u56e2|\u062f\u0631\u062f\u0634|http|\u53f0\u7063|\u81fa\u7063|\u0627\u0644\u064a\u0648\u0645!|\u0627\u0635\u062f\u0642\u0627\u0621|\u0633\u062c\u0644|\u0644\u0643\u062b\u064a\u0631|\u0643|\u50bb\u903c|\u50bbB|\u516b\u4e5d|\u516d\u56db|\u64cd\u4f60\u5988|\u767e\u6770|\u65e5\u672c\u662f\u4e2d\u56fd|\u5171\u4ea7\u515a|\u5171\u532a|\u652f\u90a3|\u53f0\u5df4\u5b50|sb|\u5e72\u4f60|\u9e21\u5df4|\u808f|\u6dd8\u5b9d|uid|\u529e\u8bc1|\u5ea6\u641c|\u5c3c\u739b|tao|\\\\.com|\\\\.cc|\\\\.us|\u6cd5\u8f6e|\u8349\u69b4|\u6700\u65b0\u5730\u5740|\\\\.tk|2b|2B|elove|\u0e2a\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47|\u9080\u8acb\u78bc|\u667a\u969c|\u98a8\u96f2|fengyun|\\\\.inf|KK44K|\u8d64\u58c1|\u54c8\u65e5|1819se|\u652f\u4ed8\u5bf6|alipay|\u517c\u8077|\u6700\u597d\u7684|\u8fd1\u5e73|\u6703\u6240|\u65e5\u72d7|\u65e5\u8cca|\u9ed1\u6728\u8033|ktv08|\\\\.com|shabi|shabi|SHABI|ShaBi|nimabi|NIMABI|nima|CNM|CTM|caotama|CAOTAMA|\u64cd\u4ed6\u5abd|UPshabi|UP\u50bb\u903c|\u5783\u573e|laji|\u4ec0\u9ebd\u73a9\u610f|shabi|TMD|\u5403\u5c4e|ed2k|QQ\u7fa4|\u6263\u6263\u7fa4|\u798f\u5229\u7db2|\\\\.tk|\u99ac\u8001\u5e2b|Q\u7fa4|\u50bb\u903c|\u5fcd\u8005\u5802|\u6771\u4eac\u5967|\u50bbb|\u59dc\u6c0f\u96c6\u5718|\u062f\u0631\u062f\u0634|http|\u81fa\u7063|\u81fa\u7063|\u0627\u0644\u064a\u0648\u0645!|\u0627\u0635\u062f\u0642\u0627\u0621|\u0633\u062c\u0644|\u0644\u0643\u062b\u064a\u0631|\u0643|\u50bb\u903c|\u50bbB|\u516b\u4e5d|\u516d\u56db|\u64cd\u4f60\u5abd|\u767e\u5091|\u65e5\u672c\u662f\u4e2d\u570b|\u5171\u7522\u9ee8|\u5171\u532a|\u652f\u90a3|\u81fa\u5df4\u5b50|sb|\u5e79\u4f60|\u96de\u5df4|\u808f|\u6dd8\u5bf6|uid|\u8fa6\u8b49|\u5ea6\u641c|\u5c3c\u746a|tao|\\\\.com|\\\\.cc|\\\\.us|\u6cd5\u8f2a|\u8349\u69b4|\u6700\u65b0\u5730\u5740|\\\\.tk|2b|2B|elove|\u0e2a\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47\u0e47|\u4e60\u8fd1\u5e73|\u5e73\u8fd1\u4e60|xjp|\u4e60\u592a\u5b50|\u4e60\u660e\u6cfd|\u8001\u4e60|\u6e29\u5bb6\u5b9d|\u6e29\u52a0\u5b9d|\u6e29x|\u6e29jia\u5b9d|\u6e29\u5b9d\u5b9d|\u6e29\u52a0\u9971|\u6e29\u52a0\u4fdd|\u5f20\u57f9\u8389|\u6e29\u4e91\u677e|\u6e29\u5982\u6625|\u6e29jb|\u80e1\u6e29|\u80e1x|\u80e1jt|\u80e1boss|\u80e1\u603b|\u80e1\u738b\u516b|hujintao|\u80e1jintao|\u80e1j\u6d9b|\u80e1\u60ca\u6d9b|\u80e1\u666f\u6d9b|\u80e1\u7d27\u638f|\u6e56\u7d27\u638f|\u80e1\u7d27\u5957|\u9526\u6d9b|hjt|\u80e1\u6d3e|\u80e1\u4e3b\u5e2d|\u5218\u6c38\u6e05|\u80e1\u6d77\u5cf0|\u80e1\u6d77\u6e05|\u6c5f\u6cfd\u6c11|\u6c11\u6cfd\u6c5f|\u6c5f\u80e1|\u6c5f\u54e5|\u6c5f\u4e3b\u5e2d|\u6c5f\u4e66\u8bb0|\u6c5f\u6d59\u95fd|\u6c5f\u6ca2\u6c11|\u6c5f\u6d59\u6c11|\u62e9\u6c11|\u5219\u6c11|\u8333\u6cfd\u6c11|zemin|ze\u6c11|\u8001\u6c5f|\u8001j|\u6c5fcore|\u6c5fx|\u6c5f\u6d3e|\u6c5fzm|jzm|\u6c5f\u620f\u5b50|\u6c5f\u86e4\u87c6|\u6c5f\u67d0\u67d0|\u6c5f\u8d3c|\u6c5f\u732a|\u6c5f\u6c0f\u96c6\u56e2|\u6c5f\u7ef5\u6052|\u6c5f\u7ef5\u5eb7|\u738b\u51b6\u576a|\u6c5f\u6cfd\u6167|\u9093\u5c0f\u5e73|\u5e73\u5c0f\u9093|xiao\u5e73|\u9093xp|\u9093\u6653\u5e73|\u9093\u6734\u65b9|\u9093\u6995|\u9093\u8d28\u65b9|\u6bdb\u6cfd\u4e1c|\u732b\u6cfd\u4e1c|\u732b\u5219\u4e1c|\u732b\u8d3c\u6d1e|\u6bdbzd|\u6bdbzx|z\u4e1c|ze\u4e1c|\u6cfdd|zedong|\u6bdb\u592a\u7956|\u6bdb\u76f8|\u4e3b\u5e2d\u753b\u50cf|\u6539\u9769\u5386\u7a0b|\u6731\u9555\u57fa|\u6731\u5bb9\u57fa|\u6731\u9555\u9e21|\u6731\u5bb9\u9e21|\u6731\u4e91\u6765|\u674e\u9e4f|\u674epeng|\u91cc\u9e4f|\u674e\u6708\u6708\u9e1f|\u674e\u5c0f\u9e4f|\u674e\u5c0f\u7433|\u534e\u4e3b\u5e2d|\u534e\u56fd|\u56fd\u950b|\u56fd\u5cf0|\u950b\u540c\u5fd7|\u767d\u6625\u793c|\u8584\u7199\u6765|\u8584\u4e00\u6ce2|\u8521\u8d74\u671d|\u8521\u6b66|\u66f9\u521a\u5ddd|\u5e38\u4e07\u5168|\u9648\u70b3\u5fb7|\u9648\u5fb7\u94ed|\u9648\u5efa\u56fd|\u9648\u826f\u5b87|\u9648\u7ecd\u57fa|\u9648\u540c\u6d77|\u9648\u81f3\u7acb|\u6234\u79c9\u56fd|\u4e01\u4e00\u5e73|\u8463\u5efa\u534e|\u675c\u5fb7\u5370|\u675c\u4e16\u6210|\u5085\u9510|\u90ed\u4f2f\u96c4|\u90ed\u91d1\u9f99|\u8d3a\u56fd\u5f3a|\u80e1\u6625\u534e|\u8000\u90a6|\u534e\u5efa\u654f|\u9ec4\u534e\u534e|\u9ec4\u4e3d\u6ee1|\u9ec4\u5174\u56fd|\u56de\u826f\u7389|\u8d3e\u5e86\u6797|\u8d3e\u5ef7\u5b89|\u9756\u5fd7\u8fdc|\u674e\u957f\u6625|\u674e\u6625\u57ce|\u674e\u5efa\u56fd|\u674e\u514b\u5f3a|\u674e\u5c9a\u6e05|\u674e\u6c9b\u7476|\u674e\u8363\u878d|\u674e\u745e\u73af|\u674e\u94c1\u6620|\u674e\u5148\u5ff5|\u674e\u5b66\u4e3e|\u674e\u6e90\u6f6e|\u6817\u667a|\u6881\u5149\u70c8|\u5ed6\u9521\u9f99|\u6797\u6811\u68ee|\u6797\u708e\u5fd7|\u6797\u5de6\u9e23|\u4ee4\u8ba1\u5212|\u67f3\u658c\u6770|\u5218\u5947\u8446|\u5218\u5c11\u5947|\u5218\u5ef6\u4e1c|\u5218\u4e91\u5c71|\u5218\u5fd7\u519b|\u9f99\u65b0\u6c11|\u8def\u752c\u7965|\u7f57\u7bad|\u5415\u7956\u5584|\u9a6c\u98da|\u9a6c\u607a|\u5b5f\u5efa\u67f1|\u6b27\u5e7f\u6e90|\u5f3a\u536b|\u6c88\u8dc3\u8dc3|\u5b8b\u5e73\u987a|\u7c9f\u620e\u751f|\u82cf\u6811\u6797|\u5b59\u5bb6\u6b63|\u94c1\u51dd|\u5c60\u5149\u7ecd|\u738b\u4e1c\u660e|\u6c6a\u4e1c\u5174|\u738b\u9e3f\u4e3e|\u738b\u6caa\u5b81|\u738b\u4e50\u6cc9|\u738b\u6d1b\u6797|\u738b\u5c90\u5c71|\u738b\u80dc\u4fca|\u738b\u592a\u534e|\u738b\u5b66\u519b|\u738b\u5146\u56fd|\u738b\u632f\u534e|\u5434\u90a6\u56fd|\u5434\u5b9a\u5bcc|\u5434\u5b98\u6b63|\u65e0\u5b98\u6b63|\u5434\u80dc\u5229|\u5434\u4eea|\u595a\u56fd\u534e|\u4e60\u4ef2\u52cb|\u5f90\u624d\u539a|\u8bb8\u5176\u4eae|\u5f90\u7ecd\u53f2|\u6768\u6d01\u7bea|\u53f6\u5251\u82f1|\u7531\u559c\u8d35|\u4e8e\u5e7c\u519b|\u4fde\u6b63\u58f0|\u8881\u7eaf\u6e05|\u66fe\u57f9\u708e|\u66fe\u5e86\u7ea2|\u66fe\u5baa\u6893|\u66fe\u836b\u6743|\u5f20\u5fb7\u6c5f|\u5f20\u5b9a\u53d1|\u5f20\u9ad8\u4e3d|\u5f20\u7acb\u660c|\u5f20\u8363\u5764|\u5f20\u5fd7\u56fd|\u8d75\u6d2a\u795d|\u7d2b\u9633|\u5468\u751f\u8d24|\u5468\u6c38\u5eb7|\u6731\u6d77\u4ed1|\u4e2d\u5357\u6d77|\u5927\u9646\u5f53\u5c40|\u4e2d\u56fd\u5f53\u5c40|\u5317\u4eac\u5f53\u5c40|\u5171\u4ea7\u515a|\u515a\u4ea7\u5171|\u5171\u8d2a\u515a|\u963f\u5171|\u4ea7\u515a\u5171|\u516c\u4ea7\u515a|\u5de5\u4ea7\u515a|\u5171c\u515a|\u5171x\u515a|\u5171\u94f2|\u4f9b\u4ea7|\u5171\u60e8|\u4f9b\u94f2\u515a|\u4f9b\u94f2\u8c20|\u4f9b\u94f2\u88c6|\u5171\u6b8b\u515a|\u5171\u6b8b\u4e3b\u4e49|\u5171\u4ea7\u4e3b\u4e49\u7684\u5e7d\u7075|\u62f1\u94f2|\u8001\u5171|\u4e2d\u5171|\u4e2d\u73d9|\u4e2dgong|gc\u515a|\u8d21\u6321|gong\u515a|g\u4ea7|\u72d7\u4ea7\u86cb|\u5171\u6b8b\u88c6|\u6076\u515a|\u90aa\u515a|\u5171\u4ea7\u4e13\u5236|\u5171\u4ea7\u738b\u671d|\u88c6\u4e2d\u592e|\u571f\u5171|\u571fg|\u5171\u72d7|g\u532a|\u5171\u532a|\u4ec7\u5171|\u653f\u5e9c|\u75c7\u8150|\u653f\u8150|\u653f\u4ed8|\u6b63\u5e9c|\u653f\u4fef|\u653ff|zhengfu|\u653fzhi|\u6321\u4e2d\u592e|\u6863\u4e2d\u592e|\u4e2d\u592e\u9886\u5bfc|\u4e2d\u56fdzf|\u4e2d\u592ezf|\u56fdwu\u9662|\u4e2d\u534e\u5e1d\u56fd|gong\u548c|\u5927\u9646\u5b98\u65b9|\u5317\u4eac\u653f\u6743|\u6c5f\u6cfd\u6c11|\u80e1\u9526\u6d9b|\u6e29\u5bb6\u5b9d|\u4e60\u8fd1\u5e73|\u4e60\u4ef2\u52cb|\u8d3a\u56fd\u5f3a|\u8d3a\u5b50\u73cd|\u5468\u6c38\u5eb7|\u674e\u957f\u6625|\u674e\u5fb7\u751f|\u738b\u5c90\u5c71|\u59da\u4f9d\u6797|\u56de\u826f\u7389|\u674e\u6e90\u6f6e|\u674e\u5e72\u6210|\u6234\u79c9\u56fd|\u9ec4\u9547|\u5218\u5ef6\u4e1c|\u5218\u745e\u9f99|\u4fde\u6b63\u58f0|\u9ec4\u656c|\u8584\u7199|\u8584\u4e00\u6ce2|\u5468\u5c0f\u5ddd|\u5468\u5efa\u5357|\u6e29\u4e91\u677e|\u5f90\u660e|\u6c5f\u6cfd\u6167|\u6c5f\u7ef5\u6052|\u6c5f\u7ef5\u5eb7|\u674e\u5c0f\u9e4f|\u674e\u9e4f|\u674e\u5c0f\u7433|\u6731\u4e91\u6765|\u6731\u5bb9\u57fa|\u6cd5\u8f6e\u529f|\u674e\u6d2a\u5fd7|\u65b0\u7586\u9a9a\u4e71|\u4e60\u8fd1\u5e73|\u4e60\u4ef2\u52cb|\u5341\u4e5d\u5927\u4fee\u5baa|\u4e60\u8fd1\u5e73\u8fde\u4efb|\u5baa\u6cd5\u4fee\u6b63\u6848|\u4efb\u671f\u9650\u5236|\u8150\u8d25\u4e2d\u56fd|\u4e09\u4e2a\u4ee3\u8868|\u793e\u4f1a\u4e3b\u4e49\u706d\u4ea1|\u6253\u5012\u4e2d\u56fd|\u6253\u5012\u5171\u4ea7\u515a|\u6253\u5012\u5171\u4ea7\u4e3b\u4e49|\u6253\u5012\u80e1\u9526\u6d9b|\u6253\u5012\u6c5f\u6cfd\u6c11|\u6253\u5012\u6c5f\u4e3b\u5e2d|\u6253\u5012\u7f57\u5e72|\u6253\u5012\u4e2d\u5171|\u62b5\u5236\u5171\u4ea7\u515a|\u62b5\u5236\u5171\u4ea7\u4e3b\u4e49|\u62b5\u5236\u80e1\u9526\u6d9b|\u62b5\u5236\u6c5f\u6cfd\u6c11|\u62b5\u5236\u6c5f\u4e3b\u5e2d|\u62b5\u5236\u674e\u9e4f|\u62b5\u5236\u7f57\u5e72|\u62b5\u5236\u6e29\u5bb6\u5b9d|\u62b5\u5236\u4e2d\u5171|\u62b5\u5236\u6731\ufffdF\u57fa|\u706d\u4ea1\u4e2d\u56fd|\u4ea1\u515a\u4ea1\u56fd|\u7c89\u788e\u56db\u4eba\u5e2e|\u6fc0\u6d41\u4e2d\u56fd|\u7279\u4f9b|\u7279\u8d21|\u7279\u5171|zf\u5927\u697c|\u6b83\u89c6|\u8d2a\u6c61\u8150\u8d25|\u5f3a\u5236\u62c6\u9664|\u5f62\u5f0f\u4e3b\u4e49|\u653f\u6cbb\u98ce\u6ce2|\u592a\u5b50\u515a|\u4e0a\u6d77\u5e2e|\u5317\u4eac\u5e2e|\u6e05\u534e\u5e2e|\u7ea2\u8272\u8d35\u65cf|\u6743\u8d35\u96c6\u56e2|\u6cb3\u87f9\u793e\u4f1a|\u559d\u8840\u793e\u4f1a|\u4e5d\u98ce|9\u98ce|\u5341\u4e03\u5927|\u53417\u5927|17da|\u4e5d\u5b66|9\u5b66|\u56db\u98ce|4\u98ce|\u53cc\u89c4|\u5357\u8857\u6751|\u6700\u6deb\u5b98\u5458|\u8b66\u532a|\u5b98\u532a|\u72ec\u592b\u6c11\u8d3c|\u5b98\u5546\u52fe\u7ed3|\u57ce\u7ba1\u66b4\u529b\u6267\u6cd5|\u5f3a\u5236\u6350\u6b3e|\u6bd2\u8c7a|\u4e00\u515a\u6267\u653f|\u4e00\u515a\u4e13\u5236|\u4e00\u515a\u4e13\u653f|\u4e13\u5236\u653f\u6743|\u5baa\u6cd5\u6cd5\u9662|\u80e1\u5e73|\u82cf\u6653\u5eb7|\u8d3a\u536b\u65b9|\u8c2d\u4f5c\u4eba|\u7126\u56fd\u6807|\u4e07\u6da6\u5357|\u5f20\u5fd7\u65b0|\u9ad8\u52e4\u8363|\u738b\u70b3\u7ae0|\u9ad8\u667a\u665f|\u53f8\u9a6c\u7490|\u5218\u6653\u7af9|\u5218\u5bbe\u96c1|\u9b4f\u4eac\u751f|\u5bfb\u627e\u6797\u662d\u7684\u7075\u9b42|\u522b\u68a6\u6210\u7070|\u8c01\u662f\u65b0\u4e2d\u56fd|\u8ba8\u4f10\u4e2d\u5ba3\u90e8|\u5f02\u8bae\u4eba\u58eb|\u6c11\u8fd0\u4eba\u58eb|\u542f\u8499\u6d3e|\u9009\u56fd\u5bb6\u4e3b\u5e2d|\u6c11\u4e00\u4e3b|min\u4e3b|\u6c11\u7af9|\u6c11\u73e0|\u6c11\u732a|chinesedemocracy|\u5927\u8d66\u56fd\u9645|\u56fd\u9645\u7279\u8d66|da\u9009|\u6295\u516c|\u516c\u5934|\u5baa\u653f|\u5e73\u53cd|\u515a\u7ae0|\u7ef4\u6743|\u661d\u7231\u5b97|\u5baa\u7ae0|08\u5baa|08xz|\u62bf\u4e3b|\u654f\u4e3b|\u4eba\u62f3|\u4eba\u6728\u53c8|\u4ebaquan|renquan|\u4e2d\u56fd\u4eba\u6743|\u4e2d\u56fd\u65b0\u6c11\u515a|\u7fa4\u4f53\u4e8b\u4ef6|\u7fa4\u4f53\u6027\u4e8b\u4ef6|\u4e0a\u4e2d\u592e|\u53bb\u4e2d\u592e|\u8ba8\u8bf4\u6cd5|\u8bf7\u613f|\u8bf7\u547d|\u516c\u5f00\u4fe1|\u8054\u540d\u4e0a\u4e66|\u4e07\u4eba\u5927\u7b7e\u540d|\u4e07\u4eba\u9a9a\u52a8|\u622a\u8bbf|\u4e0a\u8bbf|shangfang|\u4fe1\u8bbf|\u8bbf\u6c11|\u96c6\u5408|\u96c6\u4f1a|\u7ec4\u7ec7\u96c6\u4f53|\u9759\u5750|\u9759zuo|jing\u5750|\u793a\u5a01|\u793awei|\u6e38\u884c|you\u884c|\u6cb9\u884c|\u6e38xing|youxing|\u5b98\u903c\u6c11\u53cd|\u53cdparty|\u53cd\u5171|\u6297\u8bae|\u4ea2\u8bae|\u62b5\u5236|\u4f4e\u5236|\u5e95\u5236|di\u5236|\u62b5zhi|dizhi|boycott|\u8840\u4e66|\u711a\u70e7\u4e2d\u56fd\u56fd\u65d7|baoluan|\u6d41\u8840\u51b2\u7a81|\u51fa\u73b0\u66b4\u52a8|\u53d1\u751f\u66b4\u52a8|\u5f15\u8d77\u66b4\u52a8|baodong|\u706d\u5171|\u6740\u6bd9|\u7f62\u5de5|\u9738\u5de5|\u7f62\u8003|\u7f62\u9910|\u9738\u9910|\u7f62\u53c2|\u7f62\u996d|\u7f62\u5403|\u7f62\u98df|\u7f62\u8bfe|\u7f62ke|\u9738\u8bfe|ba\u8bfe|\u7f62\u6559|\u7f62\u5b66|\u7f62\u8fd0|\u7f51\u7279|\u7f51\u8bc4\u5458|\u7f51\u7edc\u8bc4\u8bba\u5458|\u4e94\u6bdb\u515a|\u4e94\u6bdb\u4eec|5\u6bdb\u515a|\u6212\u4e25|jieyan|jie\u4e25|\u6212yan|8\u7684\u5e73\u65b9\u4e8b\u4ef6|\u77e5\u905364|\u516b\u4e5d\u5e74|\u8d30\u62fe\u5e74|2o\u5e74|20\u548c\u8c10\u5e74|\u8d30\u62fe\u5468\u5e74|\u516d\u56db|\u516d\u6cb3\u87f9\u56db|\u516d\u767e\u5ea6\u56db|\u516d\u548c\u8c10\u56db|\u9646\u56db|\u9646\u8086|198964|5\u670835|89\u5e74\u6625\u590f\u4e4b\u4ea4|64\u60e8\u6848|64\u65f6\u671f|64\u8fd0\u52a8|4\u4e8b\u4ef6|\u56db\u4e8b\u4ef6|\u5317\u4eac\u98ce\u6ce2|\u5b66\u6f6e|\u5b66chao|xuechao|\u5b66\u767e\u5ea6\u6f6e|\u95e8\u5b89\u5929|\u5929\u6309\u95e8|\u5766\u514b\u538b\u5927\u5b66\u751f|\u6c11\u4e3b\u5973\u795e|\u5386\u53f2\u7684\u4f24\u53e3|\u9ad8\u81ea\u8054|\u5317\u9ad8\u8054|\u8840\u6d17\u4eac\u57ce|\u56db\u4e8c\u516d\u793e\u8bba|\u738b\u4e39|\u67f4\u73b2|\u6c88\u5f64|\u5c01\u4ece\u5fb7|\u738b\u8d85\u534e|\u738b\u7ef4\u6797|\u543e\u5c14\u5f00\u5e0c|\u543e\u5c14\u5f00\u897f|\u4faf\u5fb7\u5065|\u960e\u660e\u590d|\u65b9\u52b1\u4e4b|\u848b\u6377\u8fde|\u4e01\u5b50\u9716|\u8f9b\u704f\u5e74|\u848b\u5f66\u6c38|\u4e25\u5bb6\u5176|\u9648\u4e00\u54a8|\u4e2d\u534e\u5c40\u57df\u7f51|\u515a\u7684\u5589\u820c|\u4e92\u8054\u7f51\u5ba1\u67e5|\u5f53\u5c40\u4e25\u5bc6\u5c01\u9501|\u65b0\u95fb\u5c01\u9501|\u5c01\u9501\u6d88\u606f|\u7231\u56fd\u8005\u540c\u76df|\u5173\u95ed\u6240\u6709\u8bba\u575b|\u7f51\u7edc\u5c01\u9501|\u91d1\u76fe\u5de5\u7a0b|gfw|\u65e0\u754c\u6d4f\u89c8|\u65e0\u754c\u7f51\u7edc|\u81ea\u7531\u95e8|\u4f55\u6e05\u6d9f|\u4e2d\u56fd\u7684\u9677\u9631|\u6c6a\u5146\u94a7|\u8bb0\u8005\u65e0\u7586\u754c|\u5883\u5916\u5a92\u4f53|\u7ef4\u57fa\u767e\u79d1|\u7ebd\u7ea6\u65f6\u62a5|bbc\u4e2d\u6587\u7f51|\u534e\u76db\u987f\u90ae\u62a5|\u4e16\u754c\u65e5\u62a5|\u4e1c\u68ee\u65b0\u95fb\u7f51|\u4e1c\u68ee\u7535\u89c6|\u661f\u5c9b\u65e5\u62a5|wikipedia|youtube|googleblogger|\u7f8e\u56fd\u5e7f\u64ad\u516c\u53f8|\u82f1\u56fd\u91d1\u878d\u65f6\u62a5|\u81ea\u7531\u4e9a\u6d32|\u81ea\u7531\u65f6\u62a5|\u4e2d\u56fd\u65f6\u62a5|\u53cd\u5206\u88c2|\u5a01\u80c1\u8bba|\u5de6\u7ffc\u8054\u76df|\u9493\u9c7c\u5c9b|\u4fdd\u9493\u7ec4\u7ec7|\u4e3b\u6743|\u5f13\u5355|\u706b\u4e4d|\u6728\u4ed3|\u77f3\u8096|\u6838\u86cb|\u6b65qiang|bao\u70b8|\u7206zha|baozha|zha\u836f|zha\u5f39|\u70b8dan|\u70b8yao|zhadan|zhayao|hmtd|\u4e09\u785d\u57fa\u7532\u82ef|\u516d\u6c1f\u5316\u94c0|\u70b8\u836f\u914d\u65b9|\u5f39\u836f\u914d\u65b9|\u70b8\u5f39\u914d\u65b9|\u76ae\u7bb1\u70b8\u5f39|\u706b\u836f\u914d\u65b9|\u4eba\u4f53\u70b8\u5f39|\u4eba\u8089\u70b8\u5f39|\u89e3\u653e\u519b|\u5175\u529b\u90e8\u7f72|\u519b\u8f6c|\u519b\u4e8b\u793e|8341\u90e8\u961f|\u7b2c21\u96c6\u56e2\u519b|\u4e03\u5927\u519b\u533a|7\u5927\u519b\u533a|\u5317\u4eac\u519b\u533a|\u6c88\u9633\u519b\u533a|\u6d4e\u5357\u519b\u533a|\u6210\u90fd\u519b\u533a|\u5e7f\u5dde\u519b\u533a|\u5357\u4eac\u519b\u533a|\u5170\u5dde\u519b\u533a|\u989c\u8272\u9769\u547d|\u89c4\u6a21\u51b2\u7a81|\u5854\u5229\u73ed|\u57fa\u5730\u7ec4\u7ec7|\u6050\u6016\u5206\u5b50|\u6050\u6016\u4efd\u5b50|\u4e09\u80a1\u52bf\u529b|\u5370\u5c3c\u5c60\u534e|\u5370\u5c3c\u4e8b\u4ef6|\u848b\u516c\u7eaa\u5ff5\u6b4c|\u9a6c\u82f1\u4e5d|mayingjiu|\u674e\u5929\u7fbd|\u82cf\u8d1e\u660c|\u6797\u6587\u6f2a|\u9648\u6c34\u6241|\u9648s\u6241|\u9648\u968f\u4fbf|\u963f\u6241|a\u6241|\u544a\u5168\u56fd\u540c\u80de\u4e66|\u53f0\u767e\u5ea6\u6e7e|\u53f0\u5b8c|\u53f0wan|taiwan|\u53f0\u5f2f|\u6e7e\u53f0|\u53f0\u6e7e\u56fd|\u53f0\u6e7e\u5171\u548c\u56fd|\u53f0\u519b|\u53f0\u72ec|\u53f0\u6bd2|\u53f0du|taidu|twdl|\u4e00\u4e2d\u4e00\u53f0|\u6253\u53f0\u6e7e|\u4e24\u5cb8\u6218\u4e89|\u653b\u5360\u53f0\u6e7e|\u652f\u6301\u53f0\u6e7e|\u8fdb\u653b\u53f0\u6e7e|\u5360\u9886\u53f0\u6e7e|\u7edf\u4e00\u53f0\u6e7e|\u6536\u590d\u53f0\u6e7e|\u767b\u9646\u53f0\u6e7e|\u89e3\u653e\u53f0\u6e7e|\u89e3\u653etw|\u89e3\u51b3\u53f0\u6e7e|\u5149\u590d\u6c11\u56fd|\u53f0\u6e7e\u72ec\u7acb|\u53f0\u6e7e\u95ee\u9898|\u53f0\u6d77\u95ee\u9898|\u53f0\u6d77\u5371\u673a|\u53f0\u6d77\u7edf\u4e00|\u53f0\u6d77\u5927\u6218|\u53f0\u6d77\u6218\u4e89|\u53f0\u6d77\u5c40\u52bf|\u5165\u8054|\u5165\u8033\u5173|\u4e2d\u534e\u8054\u90a6|\u56fd\u6c11\u515a|x\u6c11\u515a|\u6c11\u8fdb\u515a|\u9752\u5929\u767d\u65e5|\u95f9\u72ec\u7acb|duli|fenlie|\u65e5\u672c\u4e07\u5c81|\u5c0f\u6cfd\u4e00\u90ce|\u52a3\u7b49\u6c11\u65cf|\u6c49\u4eba|\u6c49\u7ef4|\u7ef4\u6c49|\u7ef4\u543e|\u543e\u5c14|\u70ed\u6bd4\u5a05|\u4f0a\u529b\u54c8\u6728|\u7586\u72ec|\u4e1c\u7a81\u53a5\u65af\u5766\u89e3\u653e\u7ec4\u7ec7|\u4e1c\u7a81\u89e3\u653e\u7ec4\u7ec7|\u8499\u53e4\u5206\u88c2\u5206\u5b50|\u5217\u786e|\u963f\u65fa\u664b\u7f8e|\u85cf\u4eba|\u81e7\u4eba|zang\u4eba|\u85cf\u6c11|\u85cfm|\u8fbe\u8d56|\u8d56\u8fbe|dalai|\u54d2\u8d56|dl\u5587\u561b|\u4e39\u589e\u5609\u63aa|\u6253\u7838\u62a2|\u897f\u72ec|\u85cf\u72ec|\u846c\u72ec|\u81e7\u72ec|\u85cf\u6bd2|\u85cfdu|zangdu|\u652f\u6301zd|\u85cf\u66b4\u4e71|\u85cf\u9752\u4f1a|\u96ea\u5c71\u72ee\u5b50\u65d7|\u62c9\u8428|\u5566\u8428|\u5566\u6c99|\u5566\u6492|\u62c9sa|lasa|la\u8428|\u897f\u85cf|\u85cf\u897f|\u85cf\u6625\u9601|\u85cf\ufffd\u009a|\u85cf\u72ec|\u85cf\u72ec\u7acb|\u85cf\u5987\u4f1a|\u85cf\u9752\u4f1a|\u85cf\u5b57\u77f3|xizang|xi\u85cf|x\u85cf|\u897fz|tibet|\u5e0c\u846c|\u5e0c\u85cf|\u7852\u85cf|\u7a00\u85cf|\u897f\u810f|\u897f\u5958|\u897f\u846c|\u897f\u81e7|\u63f4\u85cf|bjork|\u738b\u5343\u6e90|\u5b89\u62c9|\u56de\u6559|\u56de\u65cf|\u56de\u56de|\u56de\u6c11|\u7a46\u65af\u6797|\u7a46\u7f55\u7a46\u5fb7|\u7a46\u7f55\u9ed8\u5fb7|\u9ed8\u7f55\u9ed8\u5fb7|\u4f0a\u65af\u5170|\u5723\u6218\u7ec4\u7ec7|\u6e05\u771f|\u6e05zhen|qingzhen|\u771f\u4e3b|\u963f\u62c9\u4f2f|\u9ad8\u4e3d\u68d2\u5b50|\u97e9\u56fd\u72d7|\u6ee1\u6d32\u7b2c\u4e09\u5e1d\u56fd|\u6ee1\u72d7|\u9791\u5b50|\u6c5f\u4e11\u95fb|\u6c5f\u5ae1\u7cfb|\u6c5f\u6bd2|\u6c5f\u72ec\u88c1|\u6c5f\u86e4\u87c6|\u6c5f\u6838\u5fc3|\u6c5f\u9ed1\u5fc3|\u6c5f\u80e1\u5185\u6597|\u6c5f\u7978\u5fc3|\u6c5f\u5bb6\u5e2e|\u6c5f\u7ef5\u6052|\u6c5f\u6d3e\u548c\u80e1\u6d3e|\u6c5f\u6d3e\u4eba\u9a6c|\u6c5f\u6cc9\u96c6\u56e2|\u6c5f\u4eba\u9a6c|\u6c5f\u4e09\u6761\u817f|\u6c5f\u6c0f\u96c6\u56e2|\u6c5f\u6c0f\u5bb6\u65cf|\u6c5f\u6c0f\u653f\u6cbb\u5c40|\u6c5f\u6c0f\u653f\u6cbb\u59d4\u5458|\u6c5f\u68b3\u5934|\u6c5f\u592a\u4e0a|\u6c5f\u620f\u5b50|\u6c5f\u7cfb\u4eba|\u6c5f\u7cfb\u4eba\u9a6c|\u6c5f\u5bb0\u6c11|\u6c5f\u8d3c|\u6c5f\u8d3c\u6c11|\u6c5f\u4e3b\u5e2d|\u9ebb\u679c\u4e38|\u9ebb\u5c06\u900f|\u9ebb\u9189\u5f39|\u9ebb\u9189\u72d7|\u9ebb\u9189\u67aa|\u9ebb\u9189\u0098\u008c|\u9ebb\u9189\u836f|\u53f0\u72ec|\u53f0\u6e7e|\u4e2d\u5171|\u8bc9\u6c42|\u64a4\u56de|\u70ae\u6253|\u5927\u5b57\u62a5|\u8fde\u519c|\u8fde\u4fac|\u5171\u6597|\u6b66\u6c49|\u80ba\u708e|\u5c0f\u7c89\u7ea2|\u7ef4\u5c3c|\u5bf9\u5cb8|\u4e2d\u56fd\u4eba|\u72ec\u7acb|\u7fd2\u8fd1\u5e73|\u5e73\u8fd1\u7fd2|xjp|\u7fd2\u592a\u5b50|\u7fd2\u660e\u6fa4|\u8001\u7fd2|\u6eab\u5bb6\u5bf6|\u6eab\u52a0\u5bf6|\u6eabx|\u6eabjia\u5bf6|\u6eab\u5bf6\u5bf6|\u6eab\u52a0\u98fd|\u6eab\u52a0\u4fdd|\u5f35\u57f9\u8389|\u6eab\u96f2\u9b06|\u6eab\u5982\u6625|\u6eabjb|\u80e1\u6eab|\u80e1x|\u80e1jt|\u80e1boss|\u80e1\u7e3d|\u80e1\u738b\u516b|hujintao|\u80e1jintao|\u80e1j\u6fe4|\u80e1\u9a5a\u6fe4|\u80e1\u666f\u6fe4|\u80e1\u7dca\u638f|\u6e56\u7dca\u638f|\u80e1\u7dca\u5957|\u9326\u6fe4|hjt|\u80e1\u6d3e|\u80e1\u4e3b\u5e2d|\u5289\u6c38\u6e05|\u80e1\u6d77\u5cf0|\u80e1\u6d77\u6e05|\u6c5f\u6fa4\u6c11|\u6c11\u6fa4\u6c5f|\u6c5f\u80e1|\u6c5f\u54e5|\u6c5f\u4e3b\u5e2d|\u6c5f\u66f8\u8a18|\u6c5f\u6d59\u95a9|\u6c5f\u6ca2\u6c11|\u6c5f\u6d59\u6c11|\u64c7\u6c11|\u5247\u6c11|\u8333\u6fa4\u6c11|zemin|ze\u6c11|\u8001\u6c5f|\u8001j|\u6c5fcore|\u6c5fx|\u6c5f\u6d3e|\u6c5fzm|jzm|\u6c5f\u6232\u5b50|\u6c5f\u86e4\u87c6|\u6c5f\u67d0\u67d0|\u6c5f\u8cca|\u6c5f\u8c6c|\u6c5f\u6c0f\u96c6\u5718|\u6c5f\u7dbf\u6046|\u6c5f\u7dbf\u5eb7|\u738b\u51b6\u576a|\u6c5f\u6fa4\u6167|\u9127\u5c0f\u5e73|\u5e73\u5c0f\u9127|xiao\u5e73|\u9127xp|\u9127\u66c9\u5e73|\u9127\u6a38\u65b9|\u9127\u6995|\u9127\u8cea\u65b9|\u6bdb\u6fa4\u6771|\u8c93\u6fa4\u6771|\u8c93\u5247\u6771|\u8c93\u8cca\u6d1e|\u6bdbzd|\u6bdbzx|z\u6771|ze\u6771|\u6fa4d|zedong|\u6bdb\u592a\u7956|\u6bdb\u76f8|\u4e3b\u5e2d\u756b\u50cf|\u6539\u9769\u6b77\u7a0b|\u6731\u9394\u57fa|\u6731\u5bb9\u57fa|\u6731\u9394\u96de|\u6731\u5bb9\u96de|\u6731\u96f2\u4f86|\u674e\u9d6c|\u674epeng|\u88e1\u9d6c|\u674e\u6708\u6708\u9ce5|\u674e\u5c0f\u9d6c|\u674e\u5c0f\u7433|\u83ef\u4e3b\u5e2d|\u83ef\u570b|\u570b\u92d2|\u570b\u5cf0|\u92d2\u540c\u5fd7|\u767d\u6625\u79ae|\u8584\u7199\u4f86|\u8584\u4e00\u6ce2|\u8521\u8d74\u671d|\u8521\u6b66|\u66f9\u525b\u5ddd|\u5e38\u842c\u5168|\u9673\u70b3\u5fb7|\u9673\u5fb7\u9298|\u9673\u5efa\u570b|\u9673\u826f\u5b87|\u9673\u7d39\u57fa|\u9673\u540c\u6d77|\u9673\u81f3\u7acb|\u6234\u79c9\u570b|\u4e01\u4e00\u5e73|\u8463\u5efa\u83ef|\u675c\u5fb7\u5370|\u675c\u4e16\u6210|\u5085\u92b3|\u90ed\u4f2f\u96c4|\u90ed\u91d1\u9f8d|\u8cc0\u570b\u5f37|\u80e1\u6625\u83ef|\u8000\u90a6|\u83ef\u5efa\u654f|\u9ec3\u83ef\u83ef|\u9ec3\u9e97\u6eff|\u9ec3\u8208\u570b|\u56de\u826f\u7389|\u8cc8\u6176\u6797|\u8cc8\u5ef7\u5b89|\u9756\u5fd7\u9060|\u674e\u9577\u6625|\u674e\u6625\u57ce|\u674e\u5efa\u570b|\u674e\u514b\u5f37|\u674e\u5d50\u6e05|\u674e\u6c9b\u7464|\u674e\u69ae\u878d|\u674e\u745e\u74b0|\u674e\u9435\u6620|\u674e\u5148\u5ff5|\u674e\u5b78\u8209|\u674e\u6e90\u6f6e|\u6144\u667a|\u6a11\u5149\u70c8|\u5ed6\u932b\u9f8d|\u6797\u6a39\u68ee|\u6797\u708e\u5fd7|\u6797\u5de6\u9cf4|\u4ee4\u8a08\u5283|\u67f3\u658c\u6770|\u5289\u5947\u8446|\u5289\u5c11\u5947|\u5289\u5ef6\u6771|\u5289\u96f2\u5c71|\u5289\u5fd7\u8ecd|\u9f8d\u65b0\u6c11|\u8def\u752c\u7965|\u7f85\u7bad|\u5442\u7956\u5584|\u99ac\u98c8|\u99ac\u6137|\u5b5f\u5efa\u67f1|\u6b50\u5ee3\u6e90|\u5f37\u885b|\u6c88\u8e8d\u8e8d|\u5b8b\u5e73\u9806|\u7c9f\u620e\u751f|\u8607\u6a39\u6797|\u5b6b\u5bb6\u6b63|\u9435\u51dd|\u5c60\u5149\u7d39|\u738b\u6771\u660e|\u6c6a\u6771\u8208|\u738b\u9d3b\u8209|\u738b\u6eec\u5be7|\u738b\u6a02\u6cc9|\u738b\u6d1b\u6797|\u738b\u5c90\u5c71|\u738b\u52dd\u4fca|\u738b\u592a\u83ef|\u738b\u5b78\u8ecd|\u738b\u5146\u570b|\u738b\u632f\u83ef|\u5433\u90a6\u570b|\u5433\u5b9a\u5bcc|\u5433\u5b98\u6b63|\u7121\u5b98\u6b63|\u5433\u52dd\u5229|\u5433\u5100|\u595a\u570b\u83ef|\u7fd2\u4ef2\u52f3|\u5f90\u624d\u539a|\u8a31\u5176\u4eae|\u5f90\u7d39\u53f2|\u694a\u6f54\u7bea|\u8449\u528d\u82f1|\u7531\u559c\u8cb4|\u4e8e\u5e7c\u8ecd|\u4fde\u6b63\u8072|\u8881\u7d14\u6e05|\u66fe\u57f9\u708e|\u66fe\u6176\u7d05|\u66fe\u61b2\u6893|\u66fe\u852d\u6b0a|\u5f35\u5fb7\u6c5f|\u5f35\u5b9a\u767c|\u5f35\u9ad8\u9e97|\u5f35\u7acb\u660c|\u5f35\u69ae\u5764|\u5f35\u5fd7\u570b|\u8d99\u6d2a\u795d|\u7d2b\u967d|\u5468\u751f\u8ce2|\u5468\u6c38\u5eb7|\u6731\u6d77\u4f96|\u4e2d\u5357\u6d77|\u5927\u9678\u7576\u5c40|\u4e2d\u570b\u7576\u5c40|\u5317\u4eac\u7576\u5c40|\u5171\u7522\u9ee8|\u9ee8\u7522\u5171|\u5171\u8caa\u9ee8|\u963f\u5171|\u7522\u9ee8\u5171|\u516c\u7522\u9ee8|\u5de5\u7522\u9ee8|\u5171c\u9ee8|\u5171x\u9ee8|\u5171\u5277|\u4f9b\u7522|\u5171\u6158|\u4f9b\u93df\u9ee8|\u4f9b\u93df\u8b9c|\u4f9b\u93df\u8960|\u5171\u6b98\u9ee8|\u5171\u6b98\u4e3b\u7fa9|\u5171\u7522\u4e3b\u7fa9\u7684\u5e7d\u9748|\u62f1\u93df|\u8001\u5171|\u4e2d\u5171|\u4e2d\u73d9|\u4e2dgong|gc\u9ee8|\u8ca2\u64cb|gong\u9ee8|g\u7522|\u72d7\u7522\u86cb|\u5171\u6b98\u8960|\u60e1\u9ee8|\u90aa\u9ee8|\u5171\u7522\u5c08\u5236|\u5171\u7522\u738b\u671d|\u8960\u4e2d\u592e|\u571f\u5171|\u571fg|\u5171\u72d7|g\u532a|\u5171\u532a|\u4ec7\u5171|\u653f\u5e9c|\u75c7\u8150|\u653f\u8150|\u653f\u4ed8|\u6b63\u5e9c|\u653f\u4fef|\u653ff|zhengfu|\u653fzhi|\u64cb\u4e2d\u592e|\u6a94\u4e2d\u592e|\u4e2d\u592e\u9818\u5c0e|\u4e2d\u570bzf|\u4e2d\u592ezf|\u570bwu\u9662|\u4e2d\u83ef\u5e1d\u570b|gong\u548c|\u5927\u9678\u5b98\u65b9|\u5317\u4eac\u653f\u6b0a|\u6c5f\u6fa4\u6c11|\u80e1\u9326\u6fe4|\u6eab\u5bb6\u5bf6|\u7fd2\u8fd1\u5e73|\u7fd2\u4ef2\u52f3|\u8cc0\u570b\u5f37|\u8cc0\u5b50\u73cd|\u5468\u6c38\u5eb7|\u674e\u9577\u6625|\u674e\u5fb7\u751f|\u738b\u5c90\u5c71|\u59da\u4f9d\u6797|\u56de\u826f\u7389|\u674e\u6e90\u6f6e|\u674e\u5e79\u6210|\u6234\u79c9\u570b|\u9ec3\u93ae|\u5289\u5ef6\u6771|\u5289\u745e\u9f8d|\u4fde\u6b63\u8072|\u9ec3\u656c|\u8584\u7199|\u8584\u4e00\u6ce2|\u5468\u5c0f\u5ddd|\u5468\u5efa\u5357|\u6eab\u96f2\u9b06|\u5f90\u660e|\u6c5f\u6fa4\u6167|\u6c5f\u7dbf\u6046|\u6c5f\u7dbf\u5eb7|\u674e\u5c0f\u9d6c|\u674e\u9d6c|\u674e\u5c0f\u7433|\u6731\u96f2\u4f86|\u6731\u5bb9\u57fa|\u6cd5\u8f2a\u529f|\u674e\u6d2a\u5fd7|\u65b0\u7586\u9a37\u4e82|\u7fd2\u8fd1\u5e73|\u7fd2\u4ef2\u52f3|\u5341\u4e5d\u5927\u4fee\u61b2|\u7fd2\u8fd1\u5e73\u9023\u4efb|\u61b2\u6cd5\u4fee\u6b63\u6848|\u4efb\u671f\u9650\u5236|\u8150\u6557\u4e2d\u570b|\u4e09\u500b\u4ee3\u8868|\u793e\u6703\u4e3b\u7fa9\u6ec5\u4ea1|\u6253\u5012\u4e2d\u570b|\u6253\u5012\u5171\u7522\u9ee8|\u6253\u5012\u5171\u7522\u4e3b\u7fa9|\u6253\u5012\u80e1\u9326\u6fe4|\u6253\u5012\u6c5f\u6fa4\u6c11|\u6253\u5012\u6c5f\u4e3b\u5e2d|\u6253\u5012\u7f85\u5e79|\u6253\u5012\u4e2d\u5171|\u62b5\u5236\u5171\u7522\u9ee8|\u62b5\u5236\u5171\u7522\u4e3b\u7fa9|\u62b5\u5236\u80e1\u9326\u6fe4|\u62b5\u5236\u6c5f\u6fa4\u6c11|\u62b5\u5236\u6c5f\u4e3b\u5e2d|\u62b5\u5236\u674e\u9d6c|\u62b5\u5236\u7f85\u5e79|\u62b5\u5236\u6eab\u5bb6\u5bf6|\u62b5\u5236\u4e2d\u5171|\u62b5\u5236\u6731\ufffdF\u57fa|\u6ec5\u4ea1\u4e2d\u570b|\u4ea1\u9ee8\u4ea1\u570b|\u7c89\u788e\u56db\u4eba\u5e6b|\u6fc0\u6d41\u4e2d\u570b|\u7279\u4f9b|\u7279\u8ca2|\u7279\u5171|zf\u5927\u6a13|\u6b83\u8996|\u8caa\u6c59\u8150\u6557|\u5f37\u5236\u62c6\u9664|\u5f62\u5f0f\u4e3b\u7fa9|\u653f\u6cbb\u98a8\u6ce2|\u592a\u5b50\u9ee8|\u4e0a\u6d77\u5e6b|\u5317\u4eac\u5e6b|\u6e05\u83ef\u5e6b|\u7d05\u8272\u8cb4\u65cf|\u6b0a\u8cb4\u96c6\u5718|\u6cb3\u87f9\u793e\u6703|\u559d\u8840\u793e\u6703|\u4e5d\u98a8|9\u98a8|\u5341\u4e03\u5927|\u53417\u5927|17da|\u4e5d\u5b78|9\u5b78|\u56db\u98a8|4\u98a8|\u96d9\u898f|\u5357\u8857\u6751|\u6700\u6deb\u5b98\u54e1|\u8b66\u532a|\u5b98\u532a|\u7368\u592b\u6c11\u8cca|\u5b98\u5546\u52fe\u7d50|\u57ce\u7ba1\u66b4\u529b\u57f7\u6cd5|\u5f37\u5236\u6350\u6b3e|\u6bd2\u8c7a|\u4e00\u9ee8\u57f7\u653f|\u4e00\u9ee8\u5c08\u5236|\u4e00\u9ee8\u5c08\u653f|\u5c08\u5236\u653f\u6b0a|\u61b2\u6cd5\u6cd5\u9662|\u80e1\u5e73|\u8607\u66c9\u5eb7|\u8cc0\u885b\u65b9|\u8b5a\u4f5c\u4eba|\u7126\u570b\u6a19|\u842c\u6f64\u5357|\u5f35\u5fd7\u65b0|\u9ad8\u52e4\u69ae|\u738b\u70b3\u7ae0|\u9ad8\u667a\u665f|\u53f8\u99ac\u7490|\u5289\u66c9\u7af9|\u5289\u8cd3\u96c1|\u9b4f\u4eac\u751f|\u5c0b\u627e\u6797\u662d\u7684\u9748\u9b42|\u5225\u5922\u6210\u7070|\u8ab0\u662f\u65b0\u4e2d\u570b|\u8a0e\u4f10\u4e2d\u5ba3\u90e8|\u7570\u8b70\u4eba\u58eb|\u6c11\u904b\u4eba\u58eb|\u555f\u8499\u6d3e|\u9078\u570b\u5bb6\u4e3b\u5e2d|\u6c11\u4e00\u4e3b|min\u4e3b|\u6c11\u7af9|\u6c11\u73e0|\u6c11\u8c6c|chinesedemocracy|\u5927\u8d66\u570b\u969b|\u570b\u969b\u7279\u8d66|da\u9078|\u6295\u516c|\u516c\u982d|\u61b2\u653f|\u5e73\u53cd|\u9ee8\u7ae0|\u7dad\u6b0a|\u661d\u611b\u5b97|\u61b2\u7ae0|08\u61b2|08xz|\u62bf\u4e3b|\u654f\u4e3b|\u4eba\u62f3|\u4eba\u6728\u53c8|\u4ebaquan|renquan|\u4e2d\u570b\u4eba\u6b0a|\u4e2d\u570b\u65b0\u6c11\u9ee8|\u7fa4\u9ad4\u4e8b\u4ef6|\u7fa4\u9ad4\u6027\u4e8b\u4ef6|\u4e0a\u4e2d\u592e|\u53bb\u4e2d\u592e|\u8a0e\u8aaa\u6cd5|\u8acb\u9858|\u8acb\u547d|\u516c\u958b\u4fe1|\u806f\u540d\u4e0a\u66f8|\u842c\u4eba\u5927\u7c3d\u540d|\u842c\u4eba\u9a37\u52d5|\u622a\u8a2a|\u4e0a\u8a2a|shangfang|\u4fe1\u8a2a|\u8a2a\u6c11|\u96c6\u5408|\u96c6\u6703|\u7d44\u7e54\u96c6\u9ad4|\u975c\u5750|\u975czuo|jing\u5750|\u793a\u5a01|\u793awei|\u904a\u884c|you\u884c|\u6cb9\u884c|\u904axing|youxing|\u5b98\u903c\u6c11\u53cd|\u53cdparty|\u53cd\u5171|\u6297\u8b70|\u4ea2\u8b70|\u62b5\u5236|\u4f4e\u5236|\u5e95\u5236|di\u5236|\u62b5zhi|dizhi|boycott|\u8840\u66f8|\u711a\u71d2\u4e2d\u570b\u570b\u65d7|baoluan|\u6d41\u8840\u885d\u7a81|\u51fa\u73fe\u66b4\u52d5|\u767c\u751f\u66b4\u52d5|\u5f15\u8d77\u66b4\u52d5|baodong|\u6ec5\u5171|\u6bba\u6583|\u7f77\u5de5|\u9738\u5de5|\u7f77\u8003|\u7f77\u9910|\u9738\u9910|\u7f77\u53c3|\u7f77\u98ef|\u7f77\u5403|\u7f77\u98df|\u7f77\u8ab2|\u7f77ke|\u9738\u8ab2|ba\u8ab2|\u7f77\u6559|\u7f77\u5b78|\u7f77\u904b|\u7db2\u7279|\u7db2\u8a55\u54e1|\u7db2\u7d61\u8a55\u8ad6\u54e1|\u4e94\u6bdb\u9ee8|\u4e94\u6bdb\u5011|5\u6bdb\u9ee8|\u6212\u56b4|jieyan|jie\u56b4|\u6212yan|8\u7684\u5e73\u65b9\u4e8b\u4ef6|\u77e5\u905364|\u516b\u4e5d\u5e74|\u8cb3\u62fe\u5e74|2o\u5e74|20\u548c\u8ae7\u5e74|\u8cb3\u62fe\u9031\u5e74|\u516d\u56db|\u516d\u6cb3\u87f9\u56db|\u516d\u767e\u5ea6\u56db|\u516d\u548c\u8ae7\u56db|\u9678\u56db|\u9678\u8086|198964|5\u670835|89\u5e74\u6625\u590f\u4e4b\u4ea4|64\u6158\u6848|64\u6642\u671f|64\u904b\u52d5|4\u4e8b\u4ef6|\u56db\u4e8b\u4ef6|\u5317\u4eac\u98a8\u6ce2|\u5b78\u6f6e|\u5b78chao|xuechao|\u5b78\u767e\u5ea6\u6f6e|\u9580\u5b89\u5929|\u5929\u6309\u9580|\u5766\u514b\u58d3\u5927\u5b78\u751f|\u6c11\u4e3b\u5973\u795e|\u6b77\u53f2\u7684\u50b7\u53e3|\u9ad8\u81ea\u806f|\u5317\u9ad8\u806f|\u8840\u6d17\u4eac\u57ce|\u56db\u4e8c\u516d\u793e\u8ad6|\u738b\u4e39|\u67f4\u73b2|\u6c88\u5f64|\u5c01\u5f9e\u5fb7|\u738b\u8d85\u83ef|\u738b\u7dad\u6797|\u543e\u723e\u958b\u5e0c|\u543e\u723e\u958b\u897f|\u4faf\u5fb7\u5065|\u95bb\u660e\u8986|\u65b9\u52f5\u4e4b|\u8523\u6377\u9023|\u4e01\u5b50\u9716|\u8f9b\u705d\u5e74|\u8523\u5f65\u6c38|\u56b4\u5bb6\u5176|\u9673\u4e00\u8aee|\u4e2d\u83ef\u5c40\u57df\u7db2|\u9ee8\u7684\u5589\u820c|\u4e92\u806f\u7db2\u5be9\u67e5|\u7576\u5c40\u56b4\u5bc6\u5c01\u9396|\u65b0\u805e\u5c01\u9396|\u5c01\u9396\u6d88\u606f|\u611b\u570b\u8005\u540c\u76df|\u95dc\u9589\u6240\u6709\u8ad6\u58c7|\u7db2\u7d61\u5c01\u9396|\u91d1\u76fe\u5de5\u7a0b|gfw|\u7121\u754c\u700f\u89bd|\u7121\u754c\u7db2\u7d61|\u81ea\u7531\u9580|\u4f55\u6e05\u6f23|\u4e2d\u570b\u7684\u9677\u9631|\u6c6a\u5146\u921e|\u8a18\u8005\u7121\u7586\u754c|\u5883\u5916\u5a92\u9ad4|\u7dad\u57fa\u767e\u79d1|\u7d10\u7d04\u6642\u5831|bbc\u4e2d\u6587\u7db2|\u83ef\u76db\u9813\u90f5\u5831|\u4e16\u754c\u65e5\u5831|\u6771\u68ee\u65b0\u805e\u7db2|\u6771\u68ee\u96fb\u8996|\u661f\u5cf6\u65e5\u5831|wikipedia|youtube|googleblogger|\u7f8e\u570b\u5ee3\u64ad\u516c\u53f8|\u82f1\u570b\u91d1\u878d\u6642\u5831|\u81ea\u7531\u4e9e\u6d32|\u81ea\u7531\u6642\u5831|\u4e2d\u570b\u6642\u5831|\u53cd\u5206\u88c2|\u5a01\u8105\u8ad6|\u5de6\u7ffc\u806f\u76df|\u91e3\u9b5a\u5cf6|\u4fdd\u91e3\u7d44\u7e54|\u4e3b\u6b0a|\u5f13\u55ae|\u706b\u4e4d|\u6728\u5009|\u77f3\u8096|\u6838\u86cb|\u6b65qiang|bao\u70b8|\u7206zha|baozha|zha\u85e5|zha\u5f48|\u70b8dan|\u70b8yao|zhadan|zhayao|hmtd|\u4e09\u785d\u57fa\u7532\u82ef|\u516d\u6c1f\u5316\u923e|\u70b8\u85e5\u914d\u65b9|\u5f48\u85e5\u914d\u65b9|\u70b8\u5f48\u914d\u65b9|\u76ae\u7bb1\u70b8\u5f48|\u706b\u85e5\u914d\u65b9|\u4eba\u9ad4\u70b8\u5f48|\u4eba\u8089\u70b8\u5f48|\u89e3\u653e\u8ecd|\u5175\u529b\u90e8\u7f72|\u8ecd\u8f49|\u8ecd\u4e8b\u793e|8341\u90e8\u968a|\u7b2c21\u96c6\u5718\u8ecd|\u4e03\u5927\u8ecd\u5340|7\u5927\u8ecd\u5340|\u5317\u4eac\u8ecd\u5340|\u700b\u967d\u8ecd\u5340|\u6fdf\u5357\u8ecd\u5340|\u6210\u90fd\u8ecd\u5340|\u5ee3\u5dde\u8ecd\u5340|\u5357\u4eac\u8ecd\u5340|\u862d\u5dde\u8ecd\u5340|\u984f\u8272\u9769\u547d|\u898f\u6a21\u885d\u7a81|\u5854\u5229\u73ed|\u57fa\u5730\u7d44\u7e54|\u6050\u6016\u5206\u5b50|\u6050\u6016\u4efd\u5b50|\u4e09\u80a1\u52e2\u529b|\u5370\u5c3c\u5c60\u83ef|\u5370\u5c3c\u4e8b\u4ef6|\u8523\u516c\u7d00\u5ff5\u6b4c|\u99ac\u82f1\u4e5d|mayingjiu|\u674e\u5929\u7fbd|\u8607\u8c9e\u660c|\u6797\u6587\u6f2a|\u9673\u6c34\u6241|\u9673s\u6241|\u9673\u96a8\u4fbf|\u963f\u6241|a\u6241|\u544a\u5168\u570b\u540c\u80de\u66f8|\u81fa\u767e\u5ea6\u7063|\u81fa\u5b8c|\u81fawan|taiwan|\u81fa\u5f4e|\u7063\u81fa|\u81fa\u7063\u570b|\u81fa\u7063\u5171\u548c\u570b|\u81fa\u8ecd|\u81fa\u7368|\u81fa\u6bd2|\u81fadu|taidu|twdl|\u4e00\u4e2d\u4e00\u81fa|\u6253\u81fa\u7063|\u5169\u5cb8\u6230\u722d|\u653b\u4f54\u81fa\u7063|\u652f\u6301\u81fa\u7063|\u9032\u653b\u81fa\u7063|\u4f54\u9818\u81fa\u7063|\u7d71\u4e00\u81fa\u7063|\u6536\u5fa9\u81fa\u7063|\u767b\u9678\u81fa\u7063|\u89e3\u653e\u81fa\u7063|\u89e3\u653etw|\u89e3\u6c7a\u81fa\u7063|\u5149\u5fa9\u6c11\u570b|\u81fa\u7063\u7368\u7acb|\u81fa\u7063\u554f\u984c|\u81fa\u6d77\u554f\u984c|\u81fa\u6d77\u5371\u6a5f|\u81fa\u6d77\u7d71\u4e00|\u81fa\u6d77\u5927\u6230|\u81fa\u6d77\u6230\u722d|\u81fa\u6d77\u5c40\u52e2|\u5165\u806f|\u5165\u8033\u95dc|\u4e2d\u83ef\u806f\u90a6|\u570b\u6c11\u9ee8|x\u6c11\u9ee8|\u6c11\u9032\u9ee8|\u9752\u5929\u767d\u65e5|\u9b27\u7368\u7acb|duli|fenlie|\u65e5\u672c\u842c\u6b72|\u5c0f\u6fa4\u4e00\u90ce|\u52a3\u7b49\u6c11\u65cf|\u6f22\u4eba|\u6f22\u7dad|\u7dad\u6f22|\u7dad\u543e|\u543e\u723e|\u71b1\u6bd4\u5a6d|\u4f0a\u529b\u54c8\u6728|\u7586\u7368|\u6771\u7a81\u53a5\u65af\u5766\u89e3\u653e\u7d44\u7e54|\u6771\u7a81\u89e3\u653e\u7d44\u7e54|\u8499\u53e4\u5206\u88c2\u5206\u5b50|\u5217\u78ba|\u963f\u65fa\u6649\u7f8e|\u85cf\u4eba|\u81e7\u4eba|zang\u4eba|\u85cf\u6c11|\u85cfm|\u9054\u8cf4|\u8cf4\u9054|dalai|\u5660\u8cf4|dl\u5587\u561b|\u4e39\u589e\u5609\u63aa|\u6253\u7838\u6436|\u897f\u7368|\u85cf\u7368|\u846c\u7368|\u81e7\u7368|\u85cf\u6bd2|\u85cfdu|zangdu|\u652f\u6301zd|\u85cf\u66b4\u4e82|\u85cf\u9752\u6703|\u96ea\u5c71\u7345\u5b50\u65d7|\u62c9\u85a9|\u5566\u85a9|\u5566\u6c99|\u5566\u6492|\u62c9sa|lasa|la\u85a9|\u897f\u85cf|\u85cf\u897f|\u85cf\u6625\u95a3|\u85cf\ufffd\u009a|\u85cf\u7368|\u85cf\u7368\u7acb|\u85cf\u5a66\u6703|\u85cf\u9752\u6703|\u85cf\u5b57\u77f3|xizang|xi\u85cf|x\u85cf|\u897fz|tibet|\u5e0c\u846c|\u5e0c\u85cf|\u7852\u85cf|\u7a00\u85cf|\u897f\u9ad2|\u897f\u5958|\u897f\u846c|\u897f\u81e7|\u63f4\u85cf|bjork|\u738b\u5343\u6e90|\u5b89\u62c9|\u56de\u6559|\u56de\u65cf|\u56de\u56de|\u56de\u6c11|\u7a46\u65af\u6797|\u7a46\u7f55\u7a46\u5fb7|\u7a46\u7f55\u9ed8\u5fb7|\u9ed8\u7f55\u9ed8\u5fb7|\u4f0a\u65af\u862d|\u8056\u6230\u7d44\u7e54|\u6e05\u771f|\u6e05zhen|qingzhen|\u771f\u4e3b|\u963f\u62c9\u4f2f|\u9ad8\u9e97\u68d2\u5b50|\u97d3\u570b\u72d7|\u6eff\u6d32\u7b2c\u4e09\u5e1d\u570b|\u6eff\u72d7|\u97c3\u5b50|\u6c5f\u919c\u805e|\u6c5f\u5ae1\u7cfb|\u6c5f\u6bd2|\u6c5f\u7368\u88c1|\u6c5f\u86e4\u87c6|\u6c5f\u6838\u5fc3|\u6c5f\u9ed1\u5fc3|\u6c5f\u80e1\u5167\u9b25|\u6c5f\u798d\u5fc3|\u6c5f\u5bb6\u5e6b|\u6c5f\u7dbf\u6046|\u6c5f\u6d3e\u548c\u80e1\u6d3e|\u6c5f\u6d3e\u4eba\u99ac|\u6c5f\u6cc9\u96c6\u5718|\u6c5f\u4eba\u99ac|\u6c5f\u4e09\u689d\u817f|\u6c5f\u6c0f\u96c6\u5718|\u6c5f\u6c0f\u5bb6\u65cf|\u6c5f\u6c0f\u653f\u6cbb\u5c40|\u6c5f\u6c0f\u653f\u6cbb\u59d4\u54e1|\u6c5f\u68b3\u982d|\u6c5f\u592a\u4e0a|\u6c5f\u6232\u5b50|\u6c5f\u7cfb\u4eba|\u6c5f\u7cfb\u4eba\u99ac|\u6c5f\u5bb0\u6c11|\u6c5f\u8cca|\u6c5f\u8cca\u6c11|\u6c5f\u4e3b\u5e2d|\u9ebb\u679c\u4e38|\u9ebb\u5c07\u900f|\u9ebb\u9189\u5f48|\u9ebb\u9189\u72d7|\u9ebb\u9189\u69cd|\u9ebb\u9189\u0098\u008c|\u9ebb\u9189\u85e5|\u81fa\u7368|\u81fa\u7063|\u4e2d\u5171|\u8a34\u6c42|\u64a4\u56de|\u70ae\u6253|\u5927\u5b57\u5831|\u9023\u8fb2|\u9023\u5102|\u5171\u9b25|\u6b66\u6f22|\u80ba\u708e|\u5c0f\u7c89\u7d05|\u7dad\u5c3c|\u5c0d\u5cb8|\u4e2d\u570b\u4eba|\u7368\u7acb|\u4e73\u83ef|\u4e73\u6ed1|\u4e73\u534e"')]
        }]


        window.applyOffset = function applyOffset(ldanmu, loffset, startOffset = null) {
            let ioffset = 0
            if (!startOffset) startOffset = 0
            ldanmu.sort(function (a, b) {
                return a.progress - b.progress
            })
            for (let idanmu = 0; idanmu < ldanmu.length; idanmu++) {
                if ((ioffset + 1) < loffset.length &&
                    (ldanmu[idanmu].progress / 1000 + loffset[ioffset].offset_seconds >= loffset[ioffset + 1].pos)
                ) {
                    ioffset += 1
                }
                ldanmu[idanmu].progress = Math.floor(ldanmu[idanmu].progress + loffset[ioffset].offset_seconds * 1000 + startOffset * 1000)
                if (ldanmu[idanmu].progress < 0) {
                    ldanmu[idanmu].progress = 50
                }
            }
            return ldanmu
        }

        window.applyTimedOffset = function applyTimedOffset(ldanmu, loffset, startOffset = null) {
            let ioffset = 0
            ldanmu.sort(function (a, b) {
                return a.ctime - b.ctime
            })
            for (let idanmu = 0; idanmu < ldanmu.length; idanmu++) {
                if ((ioffset + 1) < loffset.length &&
                    (ldanmu[idanmu].ctime >= loffset[ioffset + 1].timestamp)
                ) {
                    ioffset += 1
                }
                ldanmu[idanmu].progress = Math.floor(ldanmu[idanmu].progress + loffset[ioffset].offset_seconds * 1000)
                if (ldanmu[idanmu].progress < 0) {
                    ldanmu[idanmu].progress = 0
                }
            }
            return ldanmu
        }


        return async function (callback, cid, ssid, ipage, duration, ndanmu, setting = null, existDanmuNum = 0) {
            if (setting === null) {
                setting = extensionSetting
            }
            let url = danmuServerDomain + '/getBindInfo?ss=' + ssid + '&index=' + ipage + '&encrypt=1'
            if (setting.translateNicoComment) {
                url += '&translate=1'
            }
            if (setting.nicoDanmuRate) {
                url += '&niconum=' + Math.floor(ndanmu * setting.nicoDanmuRate)
            }
            if (setting.translateThreshold) {
                url += '&translateThreshold=' + setting.translateThreshold
            }
            let xhrResponse = await xhrGet(url, null, null, 0, true)
            let nicoDanmu = xhrResponse.responseText
            if (nicoDanmu === 'null') {
                return []
            }
            let ldanmu = []
            let lsn = JSON.parse(xhrResponse.getResponseHeader('content-type').slice(25))
            for (let i = 0; i < lsn.length; i++) {
                let cid = lsn[i], prefix
                if (typeof (cid) === 'string') {
                    let chatserver = null
                    if (cid.startsWith('sn')) {
                        chatserver = 'ani.gamer.com.tw'
                    } else if (cid.startsWith('so') || cid.startsWith('sm')) {
                        chatserver = 'nicovideo.jp'
                        prefix = cid.slice(0, 2)
                    } else if (cid.startsWith('ss')) {
                        chatserver = 'chat.bilibili.com'
                    } else {
                        continue
                    }
                    lsn[i] = {
                        chatserver: chatserver,
                        ss: parseInt(cid.slice(2))
                    }
                    if (prefix) lsn[i].prefix = prefix
                    let largv = cid.split('&')
                    for (let j = 1; j < largv.length; j += 1) {
                        let [key, value] = largv[j].split('=')
                        lsn[i][key] = value
                    }
                }
            }
            for (let snDict of lsn) {
                try {
                    let res, cid = null
                    if (snDict['chatserver'] === 'ani.gamer.com.tw') {
                        try {
                            cid = 'sn' + snDict['ss']
                            res = await dmFengDanmaku(snDict['ss'])
                            res = await danmuFilter(res, outsideFliter, cid)
                            if (snDict.startOffset && !extensionSetting.reverseStartOffset) {
                                res.forEach(function (danmu) {
                                    danmu.progress += snDict.startOffset * 1000
                                })
                            }
                            console.log('load sn' + snDict['ss'] + '(', res.length, ')')
                            if (snDict.offset) {
                                res = applyOffset(res, snDict.offset, snDict.startOffset)
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    } else if (snDict['chatserver'] === 'nicovideo.jp') {
                        cid = snDict.prefix + snDict['ss']
                        res = parseNicoServerResponse(nicoDanmu, ldanmu.length, true)
                        res = await danmuFilter(res, outsideFliter, cid)
                        if (snDict.startOffset && !extensionSetting.reverseStartOffset) {
                            res.forEach(function (danmu) {
                                danmu.progress += snDict.startOffset * 1000
                            })
                        }
                    } else if (snDict.chatserver === 'chat.bilibili.com') {
                        let data = JSON.parse(await xhrGet('https://api.bilibili.com/pgc/web/season/section?season_id=' + snDict.ss))
                        if (ipage > data.result.main_section.episodes.length - 1) continue
                        cid = data.result.main_section.episodes[ipage].cid
                        let aid = data.result.main_section.episodes[ipage].aid

                        if (snDict.hasOwnProperty('offset')) {
                            res = (await moreFiltedHistory(cid, duration, existDanmuNum + ldanmu.length, -1))[0]
                            if (snDict.offset === 'default') {
                                let tDuration = await getBiliVideoDuration(aid, cid)
                                res = applyOffset(res, [[0, duration - tDuration]])
                            } else if (snDict.offset === 'ignore') {
                            } else {
                                if (extensionSetting.reverseStartOffset) {
                                    extensionSetting.reverseStartOffset = snDict.startOffset
                                    snDict.startOffset = 0
                                }
                                res = applyOffset(res, snDict.offset, snDict.startOffset)
                            }
                        } else {
                            let tDuration = await getBiliVideoDuration(aid, cid)
                            if (Math.abs(duration - tDuration) < 3) {
                                res = (await moreFiltedHistory(cid, duration, 0, -1))[0]
                                if (extensionSetting.reverseStartOffset && extensionSetting.reverseStartOffset !== true) {
                                    res.forEach((danmu) => {
                                        danmu.progress -= extensionSetting.reverseStartOffset.offset * 1000
                                        if (danmu.progress < 0) danmu.progress = 0
                                    })
                                }
                            }
                        }
                        if (res && snDict.hasOwnProperty('timedOffset')) {
                            applyTimedOffset(res, snDict.timedOffset)
                        }
                    } else if (snDict['chatserver'] === 'this') {
                        ldanmu.timedOffset = snDict['timedOffset']
                        if (callback) {
                            callback(null, null, {
                                type: 'applyTimedOffset',
                                timedOffset: ldanmu.timedOffset
                            })
                            for (let dldanmu of window.ldldanmu) {
                                for (let ddanmu of dldanmu.ldanmu) {
                                    if (ddanmu.cid === cid) {
                                        applyTimedOffset(ldanmu, ldanmu.timedOffset)
                                    }
                                }
                            }
                        }
                    } else if (typeof (snDict) === 'string' && snDict[0] === 'c') {
                        cid = snDict.slice(1)
                        res = (await moreFiltedHistory(cid))[0]
                    } else if (snDict instanceof Array) {
                        for (let dcid of snDict[ipage]) {
                            ldanmu = ldanmu.concat((await moreFiltedHistory(dcid, duration))[0])
                        }
                    }
                    if (res) {
                        if (cid === null) cid = snDict.ss
                        ldanmu.push({cid: cid, ldanmu: res})
                        if (callback) callback({cid: cid, ldanmu: res})
                    }
                } catch (e) {
                    console.log('Error in', snDict, e)
                }
            }

            return ldanmu
        }
    }();

    let mergeDescDanmaku = function () {
        'use strict'

        let yuyuyu = {
            365987968: ["27840775&d=1212"],
            366008095: ["27860154&d=588"],
            366008243: ["27925827&d=627"],
            366008933: ["27975576&d=545"],
            366009465: ["31264610&d=984"],
            366008935: ["19940354&d=467", "35140082&d=467"],
            366008814: ["23567020&d=296", "34085817&d=296"],
            366008089: ["31656440&d=302"],
            366010017: ["20048078&d=1311", "35140107&d=1311"],
            366009502: ["30915370&d=261"],
            366009228: ["30915371&d=483"],
            366009539: ["30915372&d=400"],
            370556018: ["20479868&d=1618"],
            370561332: ["20668859&d=411"],
            370562758: ["34085819&d=407"],
            370560322: ["34085837&d=275"],
            370584514: ["20876728&d=1477"],
            370567817: ["21139437&d=271"],
            370575777: ["44768035&d=629"],
            370571511: ["44768048&d=370"],
            370589136: ["24691214&d=1543"],
            370575597: ["24837069&d=670"],
            370577202: ["52082216&d=519"],
            370576292: ["52082217&d=624"],
            370588637: ["25334865&d=1311"],
            370583360: ["25448399&d=591"],
            370583273: ["52082230&d=522"],
            370587569: ["52082257&d=643"],
            371138359: ["25649235&d=1673"],
            371124479: ["25861707&d=611"],
            371128932: ["54074045&d=549"],
            371147655: ["26016140&d=1499"],
            371127806: ["26077042&d=404"],
            371134263: ["54074051&d=676"],
            371134463: ["54074096&d=536"],
            371152870: ["26118958&d=1542"],
            371150331: ["26221887&d=641"],
            371145493: ["61561534&d=550"],
            371149153: ["61561541&d=566"],
            371159808: ["32367466&d=893", "32438163&d=893"],
            371155867: ["32438164&d=443"],
            371158970: ["61737734&d=666"],
            371158937: ["61737739&d=586"],
            371220206: ["32884777&d=1082", "32945997&d=1082"],
            371211550: ["32946010&d=500"],
            371214315: ["63041780&d=649"],
            371215794: ["63041782&d=702"],
            371223038: ["33506812&d=1109"],
            371220679: ["33771601&d=567"],
            371218747: ["63404024&d=544"],
            371229233: ["63404026&d=682"],
            371231532: ["34541799&d=890"],
            371228166: ["34708551&d=435"],
            371850821: ["35140084&d=951"],
            371848352: ["35290715&d=469"],
            371849747: ["35882768&d=793"],
            371850784: ["35882779&d=579"],
            371852442: ["39240438&d=843"],
            371852567: ["39259553&d=447"],
            371854558: ["39491237&d=899"],
            371854810: ["39433610&d=711"],
            371856197: ["40348013&d=831"],
            371856386: ["40348014&d=633"],
            371856234: ["45398417&d=723"],
            371857913: ["45398437&d=583"],
            371858638: ["47374375&d=785"],
            371857975: ["47374374&d=627"],
            371859725: ["48594522&d=706"],
            371859983: ["48620698&d=509"],
            372206540: ["55634358&d=772"],
            372202826: ["55634443&d=574"],
            372206010: ["57692507&d=831"],
            372208157: ["57692513&d=457"],
            372216925: ["57692543&d=759"],
            372219002: ["57692984&d=665"],
            372231339: ["68998472&d=851"],
            372226933: ["70299478&d=678"],
            372231912: ["73078883&d=809", "70299566&d=809"],
            372236711: ["70439113&d=637"],
            372246629: ["72144496&d=989"],
            372236935: ["72144432&d=501"],
            365826526: ["29354000&d=1329"],
            365874743: ["29830931&d=1413"],
            365905613: ["30177034&d=1635"],
            365905866: ["30477864&d=1495"],
            365922956: ["21164623&d=1549"],
            365923087: ["21521108&d=1792"],
            365970157: ["26805876&d=1664"],
            365970185: ["27132910&d=1842"],
            365970624: ["28058290&d=1566"],
            365971372: ["28279043&d=1556"],
            365971455: ["30177035&d=1597"],
            365972579: ["29354002&d=1382"],
            365974390: ["31526576&d=1863"],
            365975942: ["31899421&d=1910", "32056801&d=1910"],
            365976886: ["33129023&d=1397"],
            365977602: ["33688747&d=1321"],
            365977530: ["36384945&d=1274"],
            365977656: ["37835997&d=1552", "39706653&d=1203"],
            365977752: ["39082391&d=1354"],
            365978079: ["39706653&d=1203"],
            365978042: ["39503183&d=1116"],
            365978205: ["40681155&d=1216"],
            366003498: ["21754879&d=901", "37835983&d=901"],
            366003854: ["21940048&d=838"],
            366003485: ["22114651&d=1049"],
            366003823: ["22652858&d=1128"],
            366005058: ["26413969&d=1034"],
            366005344: ["26550587&d=1118"],
            366006484: ["28767635&d=1440"],
            366005196: ["30009321&d=900"],
            366004140: ["31014571&d=703"],
            366005397: ["34211222&d=955"],
            366005387: ["35824728&d=914"],
            377203240: ["41753456&d=1578"],
            377208240: ["41072029&d=1560"],
            377205167: ["44284335&d=1191"],
            377205223: ["45315070&d=1345"],
            377214861: ["48407277&d=1502"],
            377209007: ["48407274&d=1382"],
            377217627: ["50365593&d=1870"],
            377219529: ["50624685&d=1591"],
            377220481: ["55080304&d=1765", "55634356&d=1765"],
            377222845: ["55878860&d=1749"],
            377222748: ["60041183&d=1499"],
            377228103: ["60918450&d=1547"],
            377228600: ["65820249&d=1726"],
            377229345: ["65913134&d=1830"],
            377228565: ["75292330&d=1684"],
            377232080: ["76192562&d=1937"],
            377235605: ["76581343&d=1768"],
            377233494: ["77924074&d=1569"],
            377237306: ["78438967&d=2384"],
            377239175: ["78629728&d=2760"],
            377239025: ["82777548&d=2102"],
            377238484: ["83551905&d=2068"],
            377238454: ["87692283&d=1110"],
            377241759: ["93091931&d=1957"],
            377241755: ["94127748&d=1648"],
            377242089: ["96304642&d=1805"],
            377242387: ["97916200&d=2301"],
            377780106: ["78438897&d=1050"],
            377789885: ["79262072&d=1002"],
            377777511: ["84288918&d=1063"],
            377781780: ["95613038&d=1240"],
            377780230: ["37971672&d=826"],
            377799128: ["42460350&d=833"],
            377798674: ["45561413&d=739"],
            377799009: ["53343872&d=855"],
            377795396: ["56738474&d=1138"],
            377799342: ["57692612&d=891"],
            377797596: ["62806333&d=995"],
            377782761: ["73082924&d=1148"]
        }

        function applyMeanOffset(ldanmu, currentDuration, expectedDuration) {
            let rate = expectedDuration / currentDuration
            for (let idanmu = 0; idanmu < ldanmu.length; idanmu++) {
                ldanmu[idanmu].progress = Math.floor(ldanmu[idanmu].progress * rate)
            }
            return ldanmu
        }

        return async function mergeDescDanmaku(callback, aid, cid, ipage, duration, ndanmu, existDanmuNum, extraInfo) {
            try {
                let ldanmu = []
                if (bindAid && bindAid.indexOf(aid.toString()) !== -1) {
                    return mergeServerDanmaku(callback, cid, 'av' + aid, ipage, duration, ndanmu, null, existDanmuNum)
                }
                if (yuyuyu.hasOwnProperty(cid.toString())) {
                    for (let ocid of yuyuyu[cid.toString()]) {
                        let [cid, oDuration] = ocid.split('&d=')
                        oDuration = parseInt(oDuration)
                        let tldanmu = (await moreFiltedHistory(cid, 0))[0]
                        if (oDuration !== duration) {
                            tldanmu = applyMeanOffset(tldanmu, oDuration, duration)
                        }
                        ldanmu.push({cid: cid, ldanmu: tldanmu})
                        if (callback) callback({cid: cid, ldanmu: tldanmu})

                    }
                }
                if (extraInfo.hasOwnProperty('niconico')) {
                    let tldanmu = await nicoDanmu(extraInfo.niconico, 0, ndanmu)
                    ldanmu.push({cid: extraInfo.niconico, ldanmu: tldanmu})
                    if (callback) callback({cid: extraInfo.niconico, ldanmu: tldanmu})
                }
                if (extraInfo.hasOwnProperty('mid')) {
                    if (bindAid && bindAid.indexOf('mid_' + extraInfo.mid) !== -1) {
                        let result = JSON.parse(await xhrGet(danmuServerDomain + '/bindUserDanmaku?mid='
                            + extraInfo.mid + '&duration=' + duration + '&pubdate=' + extraInfo.pubdate))
                        if (/^sm\d+$/.exec(result[0].id)) {
                            let tldanmu = await nicoDanmu(result[0].id, 0, ndanmu)
                            applyOffset(tldanmu, [{progress: 0, offset_seconds: duration - result[0].duration}])
                            ldanmu.push({cid: result[0].id, ldanmu: tldanmu})
                            if (callback) callback({cid: result[0].id, ldanmu: tldanmu})
                        }
                    }
                }
                return ldanmu
            } catch (e) {
                console.log(e)
                for (let i = 0; i < ldldanmu; i++) {
                    if (ldldanmu[i]['cid'] === cid) {
                        ldldanmu.splice(i, 1)
                        break
                    }
                }
            }
        }
    }();
    window.downloadDanmaku = function () {
        function genxml(ldanmu, ndanmu, cid) {
            let head = '<?xml version="1.0" encoding="UTF-8"?><i><chatserver>chat.bilibili.com</chatserver><chatid>' + cid.toString() + '</chatid><mission>0</mission><maxlimit>' + ndanmu.toString() + '</maxlimit><state>0</state><real_name>0</real_name><source>DF</source>';
            return head + ldanmu.join('') + '</i>'
        }

        function danmuObject2XML(ldanmu) {
            for (let i = 0, length = ldanmu.length; i < length; i++) {
                let danmu = ldanmu[i]
                ldanmu[i] = `<d p="${danmu.progress / 1000},${danmu.mode},${danmu.fontsize},${danmu.color},${danmu.ctime},${0},${danmu.midHash},${danmu.idStr}">${htmlEscape(danmu.content)}</d>`
            }
            return ldanmu
        }

        function htmlEscape(text) {
            if (!text) return text
            text = text.replace(/[\x00-\x08\x0b-\x0c\x0e-\x1f]/g, ' ')
            return text.replace(/[<>"&]/g, function (match, pos, originalText) {
                switch (match) {
                    case "<":
                        return "&lt;";
                    case ">":
                        return "&gt;";
                    case "&":
                        return "&amp;";
                    case "\"":
                        return '"';
                }
            });
        }

        function downloadFile(fileName, content, type = 'text/plain;charset=utf-8') {
            let aLink = document.createElement('a');
            let blob
            if (typeof (content) == 'string')
                blob = new Blob([content], {'type': type})
            else blob = content
            aLink.download = fileName;
            let url = URL.createObjectURL(blob)
            aLink.href = url
            aLink.click()
            URL.revokeObjectURL(url)
        }

        return async function (cid, ndanmu = 6000, ret = false) {
            if (!danmuServerDomain) {
                await testServer()
            }
            let ldanmu
            if (cid.name) {
                let zip = new JSZip();
                let folder = zip.folder(cid.name)


                for (let sn of cid.lsn) {
                    let sdanmu = await window.downloadDanmaku(sn.sn, ndanmu, true)
                    folder.file(sn.name + ' ' + sdanmu.name, sdanmu.sdanmu)
                    await new Promise((resolve) => setTimeout(resolve, 500));
                }
                zip.generateAsync({
                    type: "blob", compression: "DEFLATE",
                    compressionOptions: {
                        level: 9
                    }
                })
                    .then(function (content) {
                        downloadFile(cid.name + ".zip", content);
                    });
                return
            } else if (cid.startsWith('ss')) {
                let zip = new JSZip();

                await testServer()
                let data = JSON.parse(await xhrGet('https://api.bilibili.com/pgc/web/season/section?season_id=' + cid.slice(2)))
                let episodeInfo = JSON.parse(await xhrGet('https://bangumi.bilibili.com/view/web_api/season?season_id=' + cid.slice(2)))
                let i = 0
                extensionSetting.translateNicoComment = true
                extensionSetting.translateThreshold = 1
                extensionSetting.nicoDanmuRate = 100
                extensionSetting.reverseStartOffset = true
                extensionSetting.notReturnProtobuf = true
                for (let episode of data.result.main_section.episodes) {
                    ldanmu = await danmuHookResponse(episode.cid, episode.aid, i, cid.slice(2))
                    let fileName
                    if (episode.index) {
                        fileName = episode.index + ' ' + episode.index_title + ' '
                    } else {
                        fileName = episode.title + ' ' + episode.long_title
                    }
                    console.log(fileName)
                    for (let tldanmu of ldanmu) {
                        tldanmu.cid = tldanmu.cid.toString()
                        if (tldanmu.cid.startsWith('so')) {
                            extensionSetting.translateNicoComment = false
                            let rawDanmu = await nicoDanmu(tldanmu.cid, 0, 1000000)

                            zip.file(fileName + ' ' + tldanmu.cid + '.raw.xml', genxml(danmuObject2XML(rawDanmu), 0, 0))
                            extensionSetting.translateNicoComment = true
                        }
                        zip.file(fileName + ' ' + tldanmu.cid + '.xml', genxml(danmuObject2XML(tldanmu.ldanmu), 0, 0))
                    }
                    i += 1
                }
                zip.generateAsync({
                    type: "blob", compression: "DEFLATE",
                    compressionOptions: {
                        level: 9
                    }
                })
                    .then(function (content) {
                        downloadFile(episodeInfo.result.title + ".zip", content);
                    });
                await loadConfig()
                return
            } else if (cid.startsWith('sn')) {
                ldanmu = await dmFengDanmaku(cid.slice(2))
            } else if (cid.startsWith('so') || cid.startsWith('sm')) {
                ldanmu = await nicoDanmu(cid, 0, ndanmu * extensionSetting.nicoDanmuRate)
            } else {
                ldanmu = (await moreFiltedHistory(cid))[0]
                cid = 'cid' + cid
            }
            if (!ret) {
                return downloadFile(cid + '.xml', genxml(danmuObject2XML(ldanmu), 0, 0))
            } else {
                return {name: cid + '.xml', sdanmu: genxml(danmuObject2XML(ldanmu), 0, 0)}
            }

        }
    }();
    window.previewDanmaku = function (xml, cid = null) {
        let dldanmu
        if (!cid) {
            dldanmu = ldldanmu[ldldanmu.length - 1]
        } else {
            for (let d of ldldanmu) {
                if (d.cid === cid) {
                    dldanmu = d
                }
            }
        }
        dldanmu.ldanmu = [{'cid': 0, ldanmu: xml2danmu(xml)}]
        dldanmu.timestamp = null
    }
    return async function (cid, aid, ipage, ssid, extraInfo, loadDanmu, sendResponseAsync) {
        let loadDanmakuCallback
        if (loadDanmu) {
            loadDanmakuCallback = function (ldanmu, twitch = false, raw = null) {
                if (raw) {
                    console.log('callback', raw, cid)
                    sendResponseAsync(raw)
                }
                console.log('callback', ldanmu, cid)
                for (let dldanmu of ldldanmu) {
                    if (dldanmu.cid === cid) {
                        dldanmu.ldanmu = dldanmu.ldanmu.concat(ldanmu)
                    }
                }
                if (!twitch) {
                    sendResponseAsync({type: 'load_danmaku', ldanmu: ldanmu.ldanmu, cid: cid, source: ldanmu.cid})
                } else {
                    ldanmu['type'] = 'load_twitch_chat'
                    ldanmu['cid'] = cid
                    sendResponseAsync(ldanmu)
                }
            }
        }
        if (loadDanmakuCallback && extraInfo.hasOwnProperty('twitch')) {
            twitchChat(extraInfo.twitch, 0, null)
                .then((result) => {
                    loadDanmakuCallback(result, true)
                })
        }
        let ldanmu = null, ndanmu = null
        for (let dldanmu of ldldanmu) {
            if (dldanmu['cid'] === cid) {
                if (!dldanmu.timestamp || new Date().getTime() - dldanmu.timestamp < 300000) {
                    ldanmu = dldanmu['ldanmu']
                    ndanmu = dldanmu['ndnamu']
                } else {
                    ldldanmu.pop(dldanmu)
                }
                break
            }
        }

        if (ldanmu === null) {
            if (ldldanmu.length > 10) {
                ldldanmu.shift()
            }
            ldldanmu.push({
                timestamp: new Date().getTime(),
                "aid": aid,
                'cid': cid,
                'ldanmu': null,
                'ndanmu': null
            })
            let duration = null
            if (aid) {
                [duration, ipage] = await getBiliVideoDuration(aid, cid, ipage)
            }
            if (!(ssid && extensionSetting.ignoreBili)) {
                let ret = await moreFiltedHistory(cid, duration, 0)
                ldanmu = [{'cid': cid, 'ldanmu': ret[0], 'ndanmu': ret[1]}]
                console.log('ndanmu:' + ret[0].length + ' from history')

                ndanmu = ret[1]
            } else {
                ndanmu = duration2poolSize(duration)
                ldanmu = []
            }

            let serverError = false, outsideDanmaku
            try {
                if (ssid) {
                    outsideDanmaku = mergeServerDanmaku(loadDanmakuCallback, cid, ssid, ipage, duration, ndanmu, null, ldanmu.length)
                } else {
                    outsideDanmaku = mergeDescDanmaku(loadDanmakuCallback, aid, cid, ipage, duration, ndanmu, ldanmu.length, extraInfo)
                }
                if (!loadDanmakuCallback) {
                    let nldanmu = await outsideDanmaku
                    if (nldanmu.timedOffset) {
                        ldanmu = window.applyTimedOffset(ldanmu, ldanmu.timedOffset)
                    }
                    ldanmu = ldanmu.concat(nldanmu)
                }
            } catch (e) {
                console.log(e)
                serverError = true
            }
            if (extensionSetting.reverseStartOffset && extensionSetting.reverseStartOffset !== true) {
                ldanmu[0].ldanmu.forEach((danmu) => {
                    danmu.progress -= extensionSetting.reverseStartOffset.offset * 1000
                    if (danmu.progress < 0) danmu.progress = 0
                })
            }

            if (ldldanmu.length > 10) {
                ldldanmu.shift()
            }

            for (let i = 0; i < ldldanmu.length; i += 1) {
                if (ldldanmu[i].cid === cid) {
                    if (!serverError) {
                        ldldanmu[i].ldanmu = ldanmu
                        ldldanmu[i].ndanmu = ndanmu
                    } else {
                        ldldanmu.splice(i, 1);
                    }
                }
            }
        }

        if (!extensionSetting.notReturnProtobuf) {
            let aldanmu = []
            for (let tldanmu of ldanmu) {
                if (extensionSetting.ignoreBili && len(ldanmu) > 1 && /^\d+$/.exec(tldanmu['cid'])) continue
                aldanmu = aldanmu.concat(tldanmu['ldanmu'])
            }
            ldanmu = aldanmu
            currentDanmu = ldanmu
            let res = ldanmu_to_proto_seg(ldanmu, null)
            console.log('cid:', cid, 'length', ldanmu.length)
            return [res[0], ldanmu.length]
        } else {
            return ldanmu
        }
    }
}();

let messageHistory = []

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
        'use strict'

        function sendResponseAsync(message) {
            if (!message || !message.type) {
                message = {
                    type: request.type + '_response',
                    content: message
                }
                if (request.timeStamp) {
                    message.timeStamp = request.timeStamp
                }
            }
            if (sender.tab) {
                chrome.tabs.sendMessage(sender.tab.id, message)
            } else {
                chrome.runtime.sendMessage(undefined, message)
            }
        }

        messageHistory.push([request, sender])
        if (request.type === "ajax_hook") {
            if (request.url.indexOf('.so') !== -1) {
                console.log(request.type, request);
                let [ldanmu, ndanmu] = await danmuHookResponse(request.cid, request.aid, request.ipage, request.ssid, request.extraInfo, request.loadDanmu, sendResponseAsync)
                return sendResponseAsync({
                    data: ldanmu,
                    type: request.type + '_response',
                    href: request.url,
                    ndanmu: ndanmu
                });
            } else {
                return sendResponseAsync({
                    data: null,
                    type: request.type + '_response',
                    arg: request.arg,
                });
            }
        } else if (request.type === 'twitch_chat') {
            return sendResponseAsync(await twitchChat(request.vid, request.startTime, request.cursor))
        } else if (request.type === "bindLocalDanmu") {
            bindPath(request)
            return sendResponseAsync()
        } else if (request.type === "getSetting") {
            if (!danmuServerDomain) {
                testServer()
            }
            return sendResponseAsync(extensionSetting)

        } else if (request.type === "editSetting") {
            editConfig(request.key, request.value)
            localStorage['extensionSetting'] = JSON.stringify(extensionSetting)
            return sendResponseAsync('success')
        } else if (request.type === "parse") {
            if (request.url.startsWith('server::')) {
                request.url = danmuServerDomain + request.url.slice(8)
            }
            return sendResponseAsync(await xhrGet(request.url))
        } else if (request.type === "biliplusDownloadDanmaku") {
            console.log(request)
            window.downloadDanmaku(request.cid)
            return sendResponseAsync()
        } else if (request.type === "bahamuteDownloadDanmaku") {
            console.log(request)
            window.downloadDanmaku(request)
            return sendResponseAsync()
        } else if (request.type === "currentAdjustVideoInfo") {
            console.log(request)
            return sendResponseAsync(window.currentAdjustVideoInfo)
        } else if (request.type === "danmakuDetail") {
            let [last, latest] = await window.danmakuDetail(request.cid)
            return sendResponseAsync({
                last: last,
                latest: latest
            })
        } else if (request.type === 'previewDanmaku') {
            console.log(request)
            previewDanmaku(request.content, request.cid)
        } else {
            if (request.type.endsWith('_response')) return
            console.log('unknown message', request)
        }

        return sendResponseAsync()
    }
);







'use strict'


if (document.head) {
    async function sleep(time) {
        await new Promise((resolve) => setTimeout(resolve, time));
    }

    let setting = postExtension('getSetting').then(function (e) {
        setting = e
    })

    function bv2av(str) {
        const table = [...'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF'];
        const s = [11, 10, 3, 8, 4, 6];
        const xor = 177451812;
        const add = 8728348608;
        let result = 0;
        let i = 0;
        while (i < 6) {
            result += table.indexOf(str[s[i]]) * 58 ** i;
            i += 1;
        }
        return result - add ^ xor
    }

    let lastHref = null
    let lastDesc = null
    let currentCid = null
    let cacheUrls = []

    async function getDescInfo(cid) {
        if (window.location.href === lastHref) {
            return lastDesc
        }

        let extraInfo = {}
        let desc = document.querySelector('div[class^="desc-info"]')
        if (desc !== null) {
            let info = desc.querySelector('span')
            if (info === null) {
                console.log('Desc not found')
            } else {
                let youtubeUrl = /\.youtube\.com\/watch\?[Vv]=([0-9a-zA-Z\-_]*)/.exec(info.innerText)
                if (youtubeUrl === null) {
                    youtubeUrl = /youtu\.be\/([_0-9a-zA-Z]*)/.exec(info.innerText)
                }
                if (youtubeUrl !== null) {
                    youtubeUrl = youtubeUrl[1]
                    console.log('Found YoutubeUrl:' + youtubeUrl)
                    extraInfo['youtube'] = youtubeUrl
                }
                let lnico = info.querySelectorAll('a[target=_blank][href^="//acg.tv/sm"]');
                let nico = lnico[0]
                let nicoinfo = null
                if (nico) {
                    nicoinfo = nico.getAttribute('href')
                    nicoinfo = /([sS][mM]\d+)/.exec(nicoinfo)
                    if (nicoinfo !== null) {
                        nicoinfo = nicoinfo[1]
                    }
                    for (let nico of lnico) {
                        let nicoinfo = nico.getAttribute('href')
                        nicoinfo = /([sS][mM]\d+)/.exec(nicoinfo)
                        nico.setAttribute('href', 'https://www.nicovideo.jp/watch/' + nicoinfo[1])
                    }
                }

                if (nicoinfo === null) {
                    nicoinfo = /([sS][mM]\d+)/.exec(info.innerText)
                    if (nicoinfo !== null) {
                        nicoinfo = nicoinfo[1]
                    }
                }
                if (nicoinfo !== null) {
                    nicoinfo = nicoinfo.toLowerCase()
                    console.log('Found NicoUrl:' + nicoinfo)
                    extraInfo['niconico'] = nicoinfo
                }
                let twitchVOD = /https:\/\/www.twitch.tv\/videos\/(\d+)/.exec(info.innerText)
                if (twitchVOD !== null) {
                    console.log('Found twitchVOD:' + twitchVOD[1])
                    extraInfo['twitch'] = twitchVOD[1]
                }
            }
            // }
        } else {
            console.log('Desc not found')
        }

        // console.log(playerInfo.textContent)


        let ssid, aid
        let ipage = null
        if (/play\/ss(\d+)/.exec(document.querySelector('script[type="application/ld+json"]').textContent)) {
            let seasonInfo
            if (cacheUrls['season']) {
                seasonInfo = JSON.parse(cacheUrls['season']['data'])
            }
            if (seasonInfo) {
                ssid = seasonInfo['result']['season_id']
                for (let i = 0; i < seasonInfo['result']['episodes'].length; i++) {
                    if (seasonInfo['result']['episodes'][i]['cid'] === parseInt(cid)) {
                        aid = seasonInfo['result']['episodes'][i]['aid']
                        ipage = i
                        break
                    }
                }
                if (ipage === null) {
                    debugger
                }
            } else {
                ssid = /play\/ss(\d+)/.exec(window.location.href)
                if (ssid) {
                    ssid = ssid[1]
                    let data = JSON.parse(await parse('https://api.bilibili.com/pgc/web/season/section?season_id=' + ssid))
                    extraInfo['firstAid'] = data['result']['main_section']['episodes'][0]['aid']
                    for (let i = 0; i < data.result.main_section.episodes.length; i++) {
                        if (data.result.main_section.episodes[i].cid === parseInt(cid)) {
                            aid = data.result.main_section.episodes[i].aid
                            ipage = i
                        }
                    }
                    if (ipage === null) {
                        debugger
                    }
                } else {
                    let epid = /\/ep(\d+)/.exec(window.location.href)
                    let data = await parse('https://bangumi.bilibili.com/view/web_api/season?ep_id=' + epid[1])
                    data = JSON.parse(data)
                    ssid = data['result']['season_id']
                    let episodes = data['result']['episodes']
                    if (episodes.length === 0) {
                        episodes = JSON.parse(await parse('https://api.bilibili.com/pgc/web/season/section?season_id=' + ssid)).result.main_section.episodes
                    }
                    extraInfo['firstAid'] = episodes[0]['aid']
                    for (let i = 0; i < episodes.length; i++) {
                        if (episodes[i]['cid'] === parseInt(cid)) {
                            aid = episodes[i]['aid']
                            ipage = i
                            break
                        }
                    }
                    if (ipage === null) {
                        debugger
                    }
                }
            }
        } else {
            aid = document.querySelector('meta[itemprop="url"]')
            aid = /(BV.*?)[\/?]/.exec(aid.getAttribute('content'))[1]
            aid = bv2av(aid)
            let videoInfo
            if (cacheUrls['view']) {
                videoInfo = JSON.parse(cacheUrls['view'].data).data
            } else {
                videoInfo = JSON.parse(await parse('https://api.bilibili.com/x/web-interface/view?aid=' + aid)).data
            }
            extraInfo.pubdate = videoInfo.pubdate
        }
        let mid = document.querySelector('*[id="v_upinfo"]')

        if (mid) {
            mid = mid.querySelector('a[href^="//space.bilibili.com"]').href
            mid = /com\/(\d+)/.exec(mid)[1]
            extraInfo.mid = mid
        }


        lastHref = window.location.href
        lastDesc = [aid, ssid, ipage, extraInfo]
        window.postMessage({type: 'descLoad', 'desc': lastDesc}, '*')
        return lastDesc
    }


    let skipCid = {}
    let episodeUrlToBeReplace = []
    chrome.runtime.onMessage.addListener(function (message) {
        if (message.cid === currentCid) {
            window.postMessage(message)
        }
    })

    window.addEventListener("message", async function (event) {
            if (event.source !== window) return;
            if (event.data.type) {
                if (event.data.type === "pakku_ajax_request") {
                    try {
                        let cid = /oid=(\d+)/.exec(event.data.arg)[1]
                        currentCid = cid
                        let segmentIndex = parseInt(/segment_index=(\d+)/.exec(event.data.arg)[1])
                        if (segmentIndex === 1) {
                            if (skipCid === cid) {
                                console.log('Ignore cid', skipCid)
                                window.postMessage({
                                    type: "pakku_ajax_response",
                                    arg: event.data.arg,
                                    resp: null
                                }, "*");
                                return
                            }
                            let res = await getDescInfo(cid)
                            let aid, ssid, ipage, extraInfo, expectedDanmuNum, ondanmu
                            [aid, ssid, ipage, extraInfo] = res
                            for (let xss of ['span[class="bilibili-player-video-info-danmaku-number"]',
                                'span[class="bpx-player-video-info-dm-number"]',
                                'div[class="bpx-player-video-info-dm"]',]) {
                                ondanmu = document.querySelector(xss)
                                if (ondanmu) {
                                    expectedDanmuNum = Number(/\d+/.exec(ondanmu.textContent)[0])
                                    break
                                }
                            }
                            let message = {
                                type: "ajax_hook",
                                url: event.data.arg,
                                aid: aid,
                                cid: cid,
                                href: window.location.href,
                                extraInfo: extraInfo,
                                ssid: ssid,
                                ipage: ipage,
                                expectedDanmuNum: expectedDanmuNum,
                                loadDanmu: event.data.loadDanmu
                            }
                            try {
                                message['block'] = JSON.parse(localStorage.bilibili_player_settings).block
                            } catch (e) {
                                console.log(e)
                            }
                            chrome.runtime.sendMessage(message);

                            await new Promise(resolve => {
                                function handle(resp, sender, sendResponse) {
                                    if (resp.type !== 'ajax_hook_response' || resp.href.slice(55) !== event.data.arg.slice(55))
                                        return;
                                    chrome.runtime.onMessage.removeListener(handle)
                                    if (resp.data !== null && resp.ndanmu !== null) {
                                        console.log('GotDanmuFromDFex', resp.ndanmu)
                                        if (skipCid !== cid) {
                                            if (ondanmu) {
                                                ondanmu.textContent = ondanmu.textContent.replace(/\d+/, resp.ndanmu)
                                            }
                                        }
                                        if (setting.debug) {
                                            let danmuSwitch = document.querySelector('div[class="bilibili-player-video-danmaku-switch bui bui-switch"]')
                                            console.log('danmuSwitch', danmuSwitch)
                                            if (danmuSwitch) {
                                                danmuSwitch.style.visibility = "hidden";
                                            }
                                        }
                                    }
                                    window.postMessage({
                                        type: "pakku_ajax_response",
                                        arg: event.data.arg,
                                        resp: resp
                                    }, "*");
                                    resolve()
                                }

                                chrome.runtime.onMessage.addListener(handle)

                            })
                        } else {
                            window.postMessage({
                                type: "pakku_ajax_response",
                                arg: event.data.arg,
                                resp: {data: new Uint8Array()}
                            }, "*");
                        }

                    } catch (e) {
                        console.log(e)
                        window.postMessage({
                            type: "pakku_ajax_response",
                            arg: event.data.arg,
                            resp: null
                        }, "*");
                        throw e
                    }


                } else if (event.data.type === 'cacheUrl') {
                    cacheUrls[event.data.urlType] = event.data
                } else if (event.data.type === 'queryDesc') {

                } else if (event.data.type === 'replaceEpisodeUrl') {
                    let info = JSON.parse(event.data.info)
                    for (let episode of episodeUrlToBeReplace) {
                        let bvid = episode[0], elem = episode[1]
                        for (let card of info['data']['cards']) {
                            if (card['desc']['bvid'] === bvid) {
                                elem.setAttribute('href', JSON.parse(card['card'])['redirect_url'])
                            }
                        }
                    }
                }
                if (event.data.source === 'DFex' && !event.data.type.endsWith('_response')) {
                    if (event.data.type === 'previewDanmaku') {
                        event.data.cid = lastDesc.cid
                    }
                    chrome.runtime.sendMessage(event.data);
                    let timeStamp = event.data.timeStamp
                    await new Promise(resolve => {
                        function handle(resp, sender, sendResponse) {
                            if (resp.type !== event.data.type + '_response' || resp.timeStamp !== timeStamp)
                                return;
                            chrome.runtime.onMessage.removeListener(handle)
                            window.postMessage(resp, "*");
                            resolve()
                        }

                        chrome.runtime.onMessage.addListener(handle)

                    })
                }
            }
        }
        ,
        false
    );
    if (window.location.href.indexOf('https://www.bilibili.com/bangumi') ||
        window.location.href.indexOf('https://www.bilibili.com/video')) {
    }
    {
        document.addEventListener("DOMNodeInserted", async (msg) => {
            if (msg.target.className) {
                if (msg.target.className === "comment-send ") {
                    if (document.querySelector('li[class^="youtube-comment"]')) {
                        return
                    }
                    if (!lastDesc) {
                        lastDesc = await new Promise((resolve) => {
                                let handle = (event) => {
                                    if (event.source === window && event.data
                                        && event.data.type === 'descLoad') {
                                        window.removeEventListener('message', handle)
                                        resolve(event.data.desc)
                                    }
                                }
                                window.addEventListener("message", handle, false);
                            }
                        )
                    }
                    if (lastDesc[3].youtube) {
                        postHook('replaceLoadPage', {'lastDesc': lastDesc})
                    }
                }
            }
        })
    }

    async function parse(url, json) {
        let res = await postExtension('parse', {url: url})
        if (json) {
            return JSON.parse(res)
        } else {
            return res
        }
    }

    async function postExtension(messageType, data) {
        let timeStamp = new Date().getTime();
        if (!data) data = {}
        if (messageType) data.type = messageType
        data.timeStamp = timeStamp
        data.source = 'DFex'
        chrome.runtime.sendMessage(data);
        return await new Promise(resolve => {
            function handle(resp, sender, sendResponse) {
                if (resp.type !== data.type + '_response' || resp.timeStamp !== timeStamp)
                    return;
                chrome.runtime.onMessage.removeListener(handle)
                resolve(resp.content)
            }

            chrome.runtime.onMessage.addListener(handle)
        })
    }

    async function postHook(messageType, data) {
        let timeStamp = new Date().getTime();
        data.type = messageType
        data.timeStamp = timeStamp
        data.source = 'DFex'
        window.postMessage(data, "*");
    }


    console.log('inject xhrhook')

    
}





(function () {
    'use strict'
    if (XMLHttpRequest.prototype.pakku_open) return;


    //postHook Listener
    window.addEventListener("message", function (event) {
            if (event.source !== window || !event.data || !event.data.type) return;
            // console.log(event.data)
            if (event.data.type === 'replaceLoadPage') {
                if (window.bbComment.prototype.originLoadPage) {
                    return;
                }
                eval('window.bbComment.prototype.originLoadPage=' + window.bbComment.prototype.loadPage.toString())
                if (!window.loadPage) {
                    window.loadPage = buildLoadPage(event.data.lastDesc)
                }
                window.bbComment.prototype.loadPage = function (i, e) {
                    if (!window.loadPage || window.loadPage(i, e)) {
                        this.originLoadPage(i, e)
                    }
                }
            }
            if (event.data.type && event.data.type === "pakku_ajax_response") callbacks[event.data.arg](event.data.resp);
            if (event.data.type && event.data.type === "load_danmaku" && event.origin !== 'https://message.bilibili.com') {
                loadDanmu(event.data.ldanmu)
            }
            if (event.data.type && event.data.type === "load_twitch_chat" && event.origin !== 'https://message.bilibili.com') {
                let lTwitchDanmu = event.data.ldanmu

                loadDanmu(event.data.ldanmu)
                let startTime = event.data.startTime
                if (!startTime) startTime = 0
                let twitchSegment = []
                twitchSegment.push({
                    start: startTime,
                    end: event.data.ldanmu[event.data.ldanmu.length - 1].progress / 1000,
                    cursor: event.data.cursor,
                    vid: event.data.vid
                })

                function appendTwitchChat(ldanmu) {
                    let tldanmu = []
                    ldanmu.forEach(function (t) {
                        for (let danmu of lTwitchDanmu) {
                            if (danmu.progress === t.progress && danmu.content === t.content) {
                                return
                            }
                        }
                        tldanmu.push(t)
                    })
                    lTwitchDanmu = lTwitchDanmu.concat(tldanmu)
                    loadDanmu(tldanmu)
                }

                window.closure.danmakuPlayer.bind('video_progress_update', async function (e, t) {
                    let currentTime = t.currentTime
                    let segFound = false
                    for (let seg of twitchSegment) {
                        if (currentTime > seg.start && currentTime < seg.end) {
                            segFound = true
                            if (currentTime + 10 > seg.end) {
                                if (!seg.cursor || seg.loading) continue
                                seg.loading = true
                                console.log('continue twitch seg', currentTime, seg)
                                let result = await postExtension('twitch_chat', seg)
                                seg.loading = false
                                seg.end = result.ldanmu[result.ldanmu.length - 1].progress / 1000
                                seg.cursor = result.cursor
                                appendTwitchChat(result.ldanmu)
                            }
                            break
                        }
                    }
                    if (!segFound) {
                        let seg = {
                            start: currentTime,
                            end: currentTime + 10,
                            vid: event.data.vid,
                            loading: true
                        }
                        twitchSegment.push(seg)
                        console.log('new twitch seg', currentTime)
                        let result = await postExtension('twitch_chat', {
                            startTime: parseInt(currentTime),
                            vid: event.data.vid
                        })
                        seg.loading = false
                        seg.cursor = result.cursor
                        if (result.cursor) {
                            seg.end = result.ldanmu[result.ldanmu.length - 1].progress / 1000
                        } else {
                            seg.end = NaN
                        }
                        seg.cursor = result.cursor
                        appendTwitchChat(result.ldanmu)
                    }
                })
            }
        }
        ,
        false
    );

    async function postExtension(messageType, data, hasCallback = true) {
        let timeStamp = new Date().getTime();
        if (!data) data = {}
        data.type = messageType
        data.timeStamp = timeStamp
        data.source = 'DFex'
        data.hasCallback = hasCallback
        window.postMessage(
            data
            , "*");
        if (hasCallback) {
            return await new Promise((resolve) => {
                    let handle = (event) => {
                        if (event.source === window && event.data
                            && event.data.type === messageType + '_response'
                            && event.data.timeStamp === timeStamp) {
                            window.removeEventListener('message', handle)
                            resolve(event.data.content)
                        }
                    }
                    window.addEventListener("message", handle, false);
                }
            )
        }
    }


    let callbacks = {};
    (function pakkuXhrHook() {
        // https://github.com/xmcp/pakku.js/blob/master/pakkujs/assets/xhr_hook.js
        XMLHttpRequest.prototype.pakku_open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            this.pakku_url = url;
            return this.pakku_open(method, url, async === undefined ? true : async, user, password);
        };
        XMLHttpRequest.prototype.pakku_addEventListener = XMLHttpRequest.prototype.addEventListener;
        XMLHttpRequest.prototype.addEventListener = function (name, callback) {
            if (name === "load") {
                this.pakku_load_callback = this.pakku_load_callback || [];
                this.pakku_load_callback.push(callback);
            }
            return this.pakku_addEventListener(name, callback);
        };
        XMLHttpRequest.prototype.pakku_send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = (function () {
            function uint8array_to_arraybuffer(array) {
                // https://stackoverflow.com/questions/37228285/uint8array-to-arraybuffer
                return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset);
            }

            function str_to_arraybuffer(str) {
                // https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
                let buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
                let bufView = new Uint16Array(buf);
                for (let i = 0, strLen = str.length; i < strLen; i++) {
                    bufView[i] = str.charCodeAt(i);
                }
                return buf;
            }

            function byte_object_to_arraybuffer(obj) {
                let ks = Object.keys(obj);
                let buf = new ArrayBuffer(ks.length);
                let bufView = new Uint8Array(buf);
                ks.forEach(function (i) {
                    bufView[i] = obj[i];
                });
                return buf;
            }

            function send_msg_proxy(arg, callback, type = "pakku_ajax_request") {
                callbacks[arg] = callback;
                window.postMessage({
                    type: type,
                    arg: arg,
                    loadDanmu: hasLoadDanmu()
                }, "*");
            }

            return function (arg) {
                if (
                    this.pakku_url.indexOf('seg.so') !== -1 && this.pakku_url.indexOf('segment_index') !== -1
                    && this.pakku_url.indexOf('data.bilibili.com') === -1
                ) {
                    // || this.pakku_url.indexOf('web-interface/view') !== -1) {
                    // injectUI()
                    let link = document.createElement("a");
                    link.href = this.pakku_url;
                    this.pakku_url = link.href;
                    let that = this;
                    if (this.pakku_load_callback || this.onreadystatechange !== null) {
                        send_msg_proxy(that.pakku_url, function (resp) {

                            if (!resp || !resp.data) return that.pakku_send(arg);
                            Object.defineProperty(that, "response", {
                                writable: true
                            });
                            Object.defineProperty(that, "responseText", {
                                writable: true
                            });
                            Object.defineProperty(that, "readyState", {
                                writable: true
                            });
                            Object.defineProperty(that, "status", {
                                writable: true
                            });
                            Object.defineProperty(that, "statusText", {
                                writable: true
                            });
                            Object.defineProperty(that, "responseURL", {
                                writable: true
                            });

                            if (that.responseType === 'arraybuffer') {
                                if (resp.data instanceof Uint8Array)
                                    that.response = uint8array_to_arraybuffer(resp.data);
                                else if (resp.data instanceof Object) // uint8arr object representation {0: ord, 1: ord, ...}
                                    that.response = byte_object_to_arraybuffer(resp.data);
                                else // maybe str
                                    that.response = str_to_arraybuffer(resp.data);
                                that.responseURL = 'file:'
                            } else {
                                that.response = that.responseText = resp.data;
                            }
                            // console.log(resp.data)
                            that.readyState = 4;
                            that.status = 200;
                            that.statusText = "Pakku OK";
                            console.log("pakku ajax: got tampered response for", that.pakku_url);
                            that.abort();
                            if (that.pakku_load_callback) {
                                for (let i = 0; i < that.pakku_load_callback.length; i++) that.pakku_load_callback[i].bind(that)();
                            }
                            if (that.onreadystatechange) {
                                that.onreadystatechange()
                            }
                        });
                    } else {
                        console.log("pakku ajax: ignoring request as no onload callback found", this.pakku_url);
                        return that.pakku_send(arg);
                    }
                } else {
                    let cacheUrlList = [{
                        type: 'season',
                        pattern: 'season?ep_id'
                    }, {
                        type: 'view',
                        pattern: 'view?aid='
                    }]
                    let url = this.pakku_url
                    for (let cache of cacheUrlList) {
                        if (this.pakku_url.indexOf(cache.pattern) !== -1) {
                            this.pakku_addEventListener('readystatechange', function (s) {
                                if (4 === s.target.readyState) {
                                    window.postMessage({
                                        type: 'cacheUrl',
                                        url: url,
                                        urlType: cache.type,
                                        data: s.target.responseText,
                                    }, "*");
                                }
                            })
                        }
                    }

                    return this.pakku_send(arg)
                }
            };
        })();
        return true
    })();

    (function closureExpose() {
        if (window.location.href.indexOf('https://www.bilibili.com/bangumi') === -1
            && window.location.href.indexOf('https://www.bilibili.com/video') === -1) {
            return;
        }
        try {
            if (window.top.closure && window.top.closure.danmakuPlayer) return;
        } catch (e) {
            console.log(e)
            return;
        }
        let widgetsJsonpString = null
        if (window.top.nanoWidgetsJsonp && !window.top.nanoWidgetsJsonp.pakku_push) {
            widgetsJsonpString = 'nanoWidgetsJsonp'
        }
        if (window.top.videoWidgetsJsonP && !window.top.videoWidgetsJsonP.pakku_push) {
            widgetsJsonpString = 'videoWidgetsJsonP'
        }
        if (!widgetsJsonpString) return
        let widgetsJsonp = eval('window.top.' + widgetsJsonpString)
        window.top.closure = {
            danmakuPlayer: null,
            danmukuScroll: null
        }
        widgetsJsonp.pakku_push = widgetsJsonp.push
        widgetsJsonp.push = function (obj) {
            for (let prop in obj[1]) {

                try {
                    if (!window.top.closure.danmakuPlayer) {

                        if (obj[1][prop].toString().indexOf('initDanmaku()') !== -1) {
                            console.log(prop, obj[1])
                            window.top.eval(`window.top.${widgetsJsonpString}[window.top.${widgetsJsonpString}.length-1][1][${prop}]=`

                                // eval('obj[1][prop]='
                                + obj[1][prop].toString().replace('initDanmaku()', 'initDanmaku();window.top.closure.danmakuPlayer=this,console.log(this,window.top)'))
                            loadDanmu = function (ldanmu) {
                                console.log('loadDanmu', ldanmu)
                                window.top.closure.danmakuPlayer.dmListStore.appendDm(ldanmu)
                                window.top.closure.danmakuPlayer.dmListStore.refresh()
                            }
                        }
                        if (obj[1][prop].toString().indexOf('firstPb') !== -1) {
                            console.log(prop, obj[1])
                            window.top.eval(`window.top.${widgetsJsonpString}[window.top.${widgetsJsonpString}.length-1][1][${prop}]=`

                                // eval('obj[1][prop]='
                                + obj[1][prop].toString().replace('this.allDM=', 'window.top.closure.danmakuPlayer=this.player,console.log(this,window.top),this.allDM='))
                            loadDanmu = function (ldanmu) {
                                console.log('loadDanmu', ldanmu)
                                window.top.closure.danmakuPlayer.danmaku.loadPb.appendDm(ldanmu)
                                try {
                                    window.top.closure.danmukuScroll.reLoad()
                                } catch (e) {
                                    console.log(e)
                                }
                            }
                        }
                    }
                    if (obj[1][prop].toString().indexOf('listMask.show())') !== -1) {
                        console.log(prop, obj[1], 'danmukuScroll')
                        window.top.eval(`window.top.${widgetsJsonpString}[window.top.${widgetsJsonpString}.length-1][1][${prop}]=`
                            + obj[1][prop].toString().replace('o=this.child;', 'o=this.child;' +
                                'if(!window.top.closure.danmukuScroll){window.top.closure.danmukuScroll=this,console.log(this,window.top);}'))
                    }
                } catch (e) {
                    console.log(e, window.top, window)
                }
                widgetsJsonp.pakku_push(obj)

            }
        }
        console.log(window.nanoWidgetsJsonp)
    })();

    let youtubeManager = {
        youtubeId: null,
        created: false,
        isEnd: false,
        context: null,
        ytcfg: null,
        showed: false,
        lastHref: window.location.href,
        commentList: []
    }

    function buildLoadPage(lastDesc,) {
        async function sleep(seconds) {
            await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
        }

        async function parse(url, json = false) {
            let res = await postExtension('parse', {url: url})
            while (!res) {
                await sleep(2)
                res = await postExtension('parse', {url: url})
            }
            if (json) {
                return JSON.parse(res)
            } else {
                return res
            }
        }

        if (youtubeManager.lastHref !== window.location.href) {
            youtubeManager = {
                youtubeId: null,
                created: false,
                isEnd: false,
                endpoint: null,
                ytcfg: null,
                showed: false,
                lastHref: window.location.href,
                commentList: []
            }
        }

        let createElement = function (sHtml) {
            // 创建一个可复用的包装元素
            let recycled = document.createElement('div'),
                // 创建标签简易匹配
                reg = /^<([a-zA-Z]+)(?=\s|\/>|>)[\s\S]*>$/,
                // 某些元素HTML标签必须插入特定的父标签内，才能产生合法元素
                // 另规避：ie7-某些元素innerHTML只读
                // 创建这些需要包装的父标签hash
                hash = {
                    'colgroup': 'table',
                    'col': 'colgroup',
                    'thead': 'table',
                    'tfoot': 'table',
                    'tbody': 'table',
                    'tr': 'tbody',
                    'th': 'tr',
                    'td': 'tr',
                    'optgroup': 'select',
                    'option': 'optgroup',
                    'legend': 'fieldset'
                };
            // 闭包重载方法（预定义变量避免重复创建，调用执行更快，成员私有化）
            createElement = function (sHtml) {
                // 若不包含标签，调用内置方法创建并返回元素
                if (!reg.test(sHtml)) {
                    return document.createElement(sHtml);
                }
                // hash中是否包含匹配的标签名
                let tagName = hash[RegExp.$1.toLowerCase()];
                // 若无，向包装元素innerHTML，创建/截取并返回元素
                if (!tagName) {
                    recycled.innerHTML = sHtml;
                    return recycled.removeChild(recycled.firstChild);
                }
                // 若匹配hash标签，迭代包装父标签，并保存迭代层次
                let deep = 0, element = recycled;
                do {
                    sHtml = '<' + tagName + '>' + sHtml + '</' + tagName + '>';
                    deep++;
                }
                while (tagName = hash[tagName]);
                element.innerHTML = sHtml;
                // 根据迭代层次截取被包装的子元素
                do {
                    element = element.removeChild(element.firstChild);
                }
                while (--deep > -1);
                // 最终返回需要创建的元素
                return element;
            }
            // 执行方法并返回结果
            return createElement(sHtml);
        }

        function format(text, dict) {
            let result = text
            let lkey = text.match(/{(.*?)}/g)


            for (let i = 0; i < lkey.length; i++) {
                let key = lkey[i]
                result = result.replace(key, dict[key.slice(1, -1)])
            }


            return result
        }

        function createReply(iComment, comment) {
            let lPos = comment.text.match(/\d+[:：]\d+[:：]*\d*/g)
            if (lPos !== null) {
                for (let i = 0; i < lPos.length; i++) {
                    let pos = lPos[i]
                    pos = pos.replace('：', ':')
                    pos = pos.split(':')
                    if (pos.length === 2) {
                        pos = parseInt(pos[0]) * 60 + parseInt(pos[1])
                        comment.text = comment.text.replace(lPos[i], '<a class="video-seek" data-p="-1" data-time="' + pos + '">' + lPos[i] + '</a>')
                    }
                    if (pos.length === 3) {
                        pos = parseInt(pos[0]) * 3600 + parseInt(pos[1]) * 60 + parseInt(pos[2])
                        comment.text = comment.text.replace(lPos[i], '<a class="video-seek" data-p="-1" data-time="' + pos + '">' + lPos[i] + '</a>')
                    }
                }
            }

            let shtml = format('<div class="list-item reply-wrap " data-id="0" data-index="' + iComment + '">\n' +
                '    <div class="user-face">\n' +
                '        <a href="https://www.youtube.com/channel/{channel}" target="_blank" data-usercard-mid="{channel}">\n' +
                '            <div class="bili-avatar">\n' +
                '                <img width="48" height="48" class="bili-avatar-img bili-avatar-face bili-avatar-img-radius"\n' +
                '                     src="{photo}"\n' +
                '                     alt="">\n' +
                '\n' +
                '\n' +
                '                <span class="bili-avatar-icon"></span>\n' +
                '            </div>\n' +
                '        </a>\n' +
                '    </div>\n' +
                '    <div class="con ">\n' +
                '        <div class="user">\n' +
                '            <a data-usercard-mid="{channel}" href="https://www.youtube.com/channel/{channel}"\n' +
                '               target="_blank" class="name"\n' +
                '               style="color">{author}\n' +
                '            </a>\n' +
                '\n' +
                '        </div>\n' +
                '        <p class="text">{text}</p>\n' +
                '        <div class="info">\n' +
                '            <span class="time">{time}</span>\n' +
                '            <span class="like ">\n' +
                '                <i></i>\n' +
                '                <span>{votes}</span>\n' +
                '            </span>\n' +
                '        </div>\n' +
                '        <div class="reply-box"></div>\n' +
                '        <div class="paging-box"></div>\n' +
                '    </div>\n' +
                '</div>', comment)

            return createElement(shtml)
        }

        async function renderPage() {
            if (youtubeManager.isEnd) {
                return true
            }
            let url = 'server::/youtube_comment?youtubeid=' + youtubeManager.youtubeId
            if (youtubeManager.endpoint) {
                url += '&context=' + encodeURIComponent(JSON.stringify([youtubeManager.endpoint, youtubeManager.ytcfg]))
            }
            let ret = await parse(
                url, true
            )
            console.log(ret)
            let dComment = ret[0]
            youtubeManager.endpoint = ret[1]
            if (ret[2]) youtubeManager.ytcfg = ret[2]
            youtubeManager.session_token = ret['session_token']
            let commentList = document.querySelector("#comment > div > div.comment > div > div.comment-list")

            for (let i = 0; i < dComment.length; i++) {
                let comment = dComment[i]
                let commentElement = createReply(i, comment)
                if (comment.hasOwnProperty('comment')) {
                    let replyButton = createElement('<div  class="view-more" ">共<b>' + comment.comment + '</b>条回复, <a class="btn-more" data-pid="0" data-fold="false">点击查看</a></div>')
                    replyButton.continuationEndpoint = comment.continuationEndpoint
                    commentElement.querySelector('div[class="reply-box"]').appendChild(replyButton)
                    replyButton.addEventListener('click', async (e) => {
                        if (replyButton.querySelector('a[class="btn-more"]').textContent !== '加载中...' && replyButton.style.display !== 'none') {
                            replyButton.querySelector('a[class="btn-more"]').textContent = '加载中...'
                        } else {
                            return
                        }
                        let url = 'server::/youtube_comment?youtubeid=' + youtubeManager.youtubeId
                        url += '&context=' + encodeURIComponent(JSON.stringify([replyButton.continuationEndpoint, youtubeManager.ytcfg]))
                        ret = await parse(
                            url, true
                        )
                        let dComment = ret[0]

                        for (let j = 0; j < dComment.length; j++) {
                            let commentElement = createReply(j, dComment[j]);
                            replyButton.parentElement.insertBefore(commentElement, replyButton)
                        }
                        replyButton.querySelector('b').textContent = (parseInt(replyButton.querySelector('b').textContent) - dComment.length).toString()
                        if (ret[1]) {
                            replyButton.childNodes[0].data = '更多'
                            replyButton.continuationEndpoint = ret[1]
                            replyButton.querySelector('a[class="btn-more"]').textContent = '点击加载'
                        } else {
                            replyButton.style.display = 'none'
                        }
                    })
                }
                commentList.appendChild(commentElement)
                youtubeManager.commentList.push(commentElement)
            }
            if (ret[1] == null) {
                youtubeManager.isEnd = true
            }
            return ret[1] == null;
        }

        function renderYoutubeButton() {
            youtubeManager.created = true
            console.log('加载油管评论', youtubeManager.youtubeId)
            let commentTitle = document.querySelector("#comment > div > div.comment > div > div.comment-header.clearfix > div.tabs-order > ul")
            let youtubeListItem = createElement('<li class="youtube-comment" style="display: list-item;">油管评论</li>')
            commentTitle.appendChild(youtubeListItem)
        }

        let youtubeId = lastDesc[3].youtube
        if (youtubeManager.created === false) {
            youtubeManager.youtubeId = youtubeId
            renderYoutubeButton()
        }
        return function (i, e) {

            if (!document.querySelector('li[class="youtube-comment on"]')) {
                youtubeManager.showed = false
                return true
            }
            let o = this;

            if (youtubeManager.showed !== true) {
                let commentList = document.querySelector("#comment > div > div.comment > div > div.comment-list")
                for (let i = commentList.childNodes.length - 1; i >= 0; i--) {
                    commentList.removeChild(commentList.childNodes[i]);
                }
                for (let i = 0; i < youtubeManager.commentList.length; i++) {
                    commentList.appendChild(youtubeManager.commentList[i])
                }
                youtubeManager.showed = true
            } else {
                if (o.loading
                ) return;
            }


            o.loading = !0
            let loadingState = document.querySelector("#comment > div > div.comment > div > div.loading-state")
            loadingState.innerHTML = '正在加载中...'

            renderPage()
                .then(function (e) {
                    e ? loadingState.innerHTML = "没有更多评论" : loadingState.innerHTML = ""
                })
                .catch(function (e) {
                    console.log(e)
                    o.loaded || o._showLoading('<span>加载失败，<a class="reload-comment">点击重试</a></span>')
                })
                .finally(function () {
                    o.loading = !1
                })
        }
    }

    let loadDanmu = null

    function hasLoadDanmu() {
        if (loadDanmu) {
            return true
        }
    }

    window.previewDanmaku = function (xml) {
        postExtension('previewDanmaku', {
            'content': xml,
        })
        console.log('添加成功,请刷新视频')
    }

    console.log("pakku ajax: hook set");
})();
