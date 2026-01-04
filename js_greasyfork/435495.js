// ==UserScript==
// @name            喜马拉雅专辑下载器
// @version         1.3.1
// @description     可能是你见过最丝滑的喜马拉雅下载器啦！登录后支持VIP音频下载，支持专辑批量下载，支持添加编号，链接导出、调用aria2等功能，直接下载M4A，MP3、MP4文件。
// @author          Priate
// @match           *://www.ximalaya.com/*
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           GM_setClipboard
// @grant           GM_download
// @icon            https://www.ximalaya.com/favicon.ico
// @require         https://registry.npmmirror.com/vue/2.7.16/files/dist/vue.min.js
// @require         https://registry.npmmirror.com/sweetalert/2.1.2/files/dist/sweetalert.min.js
// @require         https://registry.npmmirror.com/jquery/3.2.1/files/dist/jquery.min.js
// @require         https://greasyfork.org/scripts/435476-priatelib/code/PriateLib.js?version=1202493
// @require         https://registry.npmmirror.com/ajax-hook/2.0.3/files/dist/ajaxhook.min.js
// @require         https://registry.npmmirror.com/crypto-js/4.1.1/files/crypto-js.js
// @supportURL      https://greasyfork.org/zh-CN/scripts/435495/feedback
// @homepageURL     https://greasyfork.org/zh-CN/scripts/435495
// @contributionURL https://afdian.net/@cyberubbish
// @license         MIT
// @namespace       https://greasyfork.org/users/219866
// @downloadURL https://update.greasyfork.org/scripts/435495/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E4%B8%93%E8%BE%91%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/435495/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E4%B8%93%E8%BE%91%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initSetting() {
        var setting;
        if (!GM_getValue('priate_script_xmly_data')) {
            GM_setValue('priate_script_xmly_data', {
                // 多线程下载
                multithreading: false,
                left: 20,
                top: 100,
                manualMusicURL: null,
                quality: 1,
                showNumber: true,
                numberOffset: 0,
                pageSize: 30,
                aria2: "ws://127.0.0.1:16800/jsonrpc"
            })
        }
        setting = GM_getValue('priate_script_xmly_data')
        //后期添加内容
        if (!setting.quality) setting.quality = 1;
        // 暂时统一为高清音质
        setting.quality = 1
        if (setting.showNumber === null) setting.showNumber = true;
        if (!setting.numberOffset) setting.numberOffset = 0;
        if (!setting.pageSize) setting.pageSize = 30;
        if (!setting.aria2) setting.aria2 = "ws://127.0.0.1:16800/jsonrpc"
        GM_setValue('priate_script_xmly_data', setting)
    }

    // 手动获取音频地址功能
    function manualGetMusicURL() {
        let windowID = getRandStr("1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM", 100)

        function getRandStr(chs, len) {
            let str = "";
            while (len--) {
                str += chs[parseInt(Math.random() * chs.length)];
            }
            return str;
        }
        (function() {
            let playOriginal = HTMLAudioElement.prototype.play;

            function play() {
                let link = this.src;
                window.top.postMessage(Array("audioVideoCapturer", link, windowID, "link"), "*");
                return playOriginal.call(this);
            }
            HTMLAudioElement.prototype.play = play;
            HTMLAudioElement.prototype.play.toString = HTMLAudioElement.prototype.play.toString.bind(playOriginal);
        })();
        if (window.top == window) {
            window.addEventListener("message", function(event) {
                if (event.data[0] == "audioVideoCapturer") {
                    var setting = GM_getValue('priate_script_xmly_data')
                    setting.manualMusicURL = event.data[1]
                    GM_setValue('priate_script_xmly_data', setting)
                }
            });
        }
    }

    manualGetMusicURL()

    function injectDiv() {
        var priate_script_div = document.createElement("div")
        priate_script_div.innerHTML = `
<div id="priate_script_div">
<b style='font-size:30px; font-weight:300; margin: 10px 20px'>喜马拉雅专辑下载器</b>
<p id='priate_script_setting' style='margin: 0 0'>
❤️ by <a @click='openDonate' style='color:#337ab7'>Priate</a> |
v <a href="//greasyfork.org/zh-CN/scripts/435495" target="_blank" style='color:#ff6666'>{{version}}</a> |
音质 : <a @click='changeQuality' :style='"color:" + qualityColor'>{{qualityStr}}</a>
<br>
编号 : <a @click='switchShowNumber' :style='"color:" + (setting.showNumber ? "#00947e" : "#CC0F35")'> {{ setting.showNumber ? "开启" : "关闭"}} </a> -
<a @click='addNumberOffset' @contextmenu.prevent='subNumberOffset' :style='"color:" + (setting.showNumber ? "#3311AA" : "#CC0F35")'> {{ setting.numberOffset }} </a> |
数量 : <a @click='changePageSize' style='color:#3311AA'> {{ setting.pageSize }} </a> |
<a style='color:#ff6666' @click='clearMusicData'>❌</a>
</p>
<button v-show="!isDownloading" @click="loadMusic">{{filterData.length > 0 ? '重载数据' : '加载数据'}}</button>
<button id='readme' @click="downloadAllMusics" v-show="!isDownloading && (musicList.length > 0)">下载所选</button>
<button @click="exportAllMusicURL" v-show="!isDownloading && (musicList.length > 0)">导出数据 <b v-show="copyMusicURLProgress">{{copyMusicURLProgress}}%</b></button>
<button @click="cancelDownload" v-show="isDownloading">取消下载</button>
</br>
<table v-show="filterData.length > 0">
<thead><tr><th><a style='color:#337ab7' @click='selectAllMusic'>全选</a></th><th>标题</th><th>操作</th></tr></thead>
<tbody id="priate_script_table">
<tr v-for="(item, index) in filterData" :key="index">
<td><input class="checkMusicBox" v-model="musicList" :value='item' type="checkbox" :disabled="item.isDownloaded || isDownloading"></td>
<td><a @click="openMusicURL(item)" style='color:#337ab7'>{{item.title}}</a></td>
<td>
<a v-show="!item.isDownloading && !item.isDownloaded && !isDownloading" style='color:#993333' @click="downloadMusic(item)">下载</a>
<a v-show="isDownloading && !item.isDownloading && !item.isDownloaded" style='color:gray'>等待中</a>
<a v-show="item.isDownloading" style='color:#C01D07'>{{item.progress}}</a>
<a v-show="item.isDownloaded" style='color:#00947E'>已下载</a>
<a v-show="item.isFailued" style='color:red'>下载失败</a> |
<a :style="'color:' + (item.url ? '#00947E' : '#993333')" @click="copyMusic(item)">地址</a></td>
</tr>
</tbody>
</table>
</div>
`
        GM_addStyle(`
#priate_script_div{
font-size : 15px;
position: fixed;
background-color: rgb(240, 223, 175);
color : #660000;
text-align : center;
padding: 10px;
z-index : 9999;
border-radius : 20px;
border:2px solid #660000;
font-weight: 300;
-webkit-text-stroke: 0.5px;
text-stroke: 0.5px;
box-shadow: 5px 15px 15px rgba(0,0,0,0.4);
user-select : none;
-webkit-user-select : none;
-moz-user-select : none;
-ms-user-select:none;
}
#priate_script_div:hover{
box-shadow: 5px 15px 15px rgba(0,0,0,0.8);
transition: box-shadow 0.3s;
}
.priate_script_hide{
padding: 0 !important;
border:none !important;
}
a{
cursor : pointer;
text-decoration : none;
}
/*表格样式*/
#priate_script_div table{
text-align: center;
// border:2px solid #660000;
margin: 5px auto;
padding: 2px;
border-collapse: collapse;
display: block;
height : 400px;
overflow-y: scroll;
}
/*表格框样式*/
#priate_script_div td{
border:2px solid #660000;
padding: 8px 12px;
max-width : 300px;
word-wrap : break-word;
}
/*表头样式*/
#priate_script_div th{
border:2px solid #660000;
padding: 8px 12px;
font-weight: 300;
-webkit-text-stroke: 0.5px;
text-stroke: 0.5px;
}

/*脚本按钮样式*/
#priate_script_div button{
display: inline-block;
border-radius: 4px;
border: 1px solid #660000;
background-color: transparent;
color: #660000;
text-decoration: none;
padding: 5px 10px;
margin : 5px 10px;
font-weight: 300;
-webkit-text-stroke: 0.5px;
text-stroke: 0.5px;
}
/*脚本按钮悬浮样式*/
#priate_script_div button:hover{
cursor : pointer;
color: rgb(240, 223, 175);
background-color: #660000;
transition: background-color 0.2s;
}
/*设置区域 p 标签*/
#priate_script_setting{
user-select : none;
-webkit-user-select : none;
-moz-user-select : none;
-ms-user-select:none;
}
/*输入框样式*/
#priate_script_div textarea{
height : 50px;
width : 200px;
background-color: #fff;
border:1px solid #000000;
padding: 4px;
}
/*swal按钮*/
.swal-button--1{
background-color: #FFFAEB !important;
color: #946C00;
}
.swal-button--2{
background-color: #ebfffc !important;
color: #00947e;
}
.swal-button--3{
background-color: #ECF6FD !important;
color: #55ACEE;
}
.checkMusicBox{
transform: scale(1.7,1.7);
cursor: pointer;
}
`);
        document.querySelector("html").appendChild(priate_script_div)
        var setting = GM_getValue('priate_script_xmly_data')
        document.getElementById("priate_script_div").style.left = (setting.left || 20) + "px";
        document.getElementById("priate_script_div").style.top = (setting.top || 100) + "px";
    }

    function dragFunc(id) {
        var Drag = document.getElementById(id);
        var setting = GM_getValue('priate_script_xmly_data')
        Drag.onmousedown = function(event) {
            var ev = event || window.event;
            event.stopPropagation();
            var disX = ev.clientX - Drag.offsetLeft;
            var disY = ev.clientY - Drag.offsetTop;
            document.onmousemove = function(event) {
                var ev = event || window.event;
                setting.left = ev.clientX - disX
                Drag.style.left = setting.left + "px";
                setting.top = ev.clientY - disY
                Drag.style.top = setting.top + "px";
                Drag.style.cursor = "move";
                GM_setValue('priate_script_xmly_data', setting)
            };
        };
        Drag.onmouseup = function() {
            document.onmousemove = null;
            this.style.cursor = "default";
        };
    };
    // 初始化音质修改
    function initQuality() {
        ah.proxy({
            onRequest: (config, handler) => {
                handler.next(config);
            },
            onError: (err, handler) => {
                handler.next(err)
            },
            onResponse: (response, handler) => {
                const setting = GM_getValue('priate_script_xmly_data')
                // hook返回数据
                if (response.config.url.indexOf("mobile.ximalaya.com/mobile-playpage/track/v3/baseInfo") != -1) {
                    const setting = GM_getValue('priate_script_xmly_data')
                    const data = JSON.parse(response.response)
                    const playUrlList = data.trackInfo.playUrlList
                    var replaceUrl;
                    for (var num = 0; num < playUrlList.length; num++) {
                        var item = playUrlList[num]
                        if (item.qualityLevel == setting.quality) {
                            replaceUrl = item.url
                            break
                        }
                    }
                    replaceUrl && playUrlList.forEach((item) => {
                        item.url = replaceUrl
                    })
                    response.response = JSON.stringify(data)
                }
                // hook普通音频获取高品质，实际上只需删除获取到的src即可
                if (setting.quality == 2 && response.config.url.indexOf("www.ximalaya.com/revision/play/v1/audio") != -1) {
                    const setting = GM_getValue('priate_script_xmly_data')
                    var resp = JSON.parse(response.response)
                    var data = resp.data
                    delete data.src
                    response.response = JSON.stringify(resp)
                }
                handler.next(response)
            }
        })
        unsafeWindow.XMLHttpRequest = XMLHttpRequest
    }
    // 修改翻页大小
    function initPageSize() {
        const originFetch = fetch;
        const setting = GM_getValue('priate_script_xmly_data')
        window.unsafeWindow.fetch = (url, options) => {
            if (url.indexOf('/revision/album/v1/getTracksList') != -1) {
                url = url.replace('pageSize=30', `pageSize=${setting.pageSize}`)
            }
            return originFetch(url, options).then(async (response) => {
                return response;
            });
        };
    }
    //初始化脚本设置
    initSetting()
    //注入脚本div
    injectDiv()
    // 初始化音质修改
    initQuality()
    // 修改翻页大小
    initPageSize()

    // 第一种获取musicURL的方式，任意用户均可获得，不可获得VIP音频
    async function getSimpleMusicURL1(item) {
        var res = null
        if (item.url) {
            res = item.url
        } else {
            const timestamp = Date.parse(new Date());
            var url = `https://mobwsa.ximalaya.com/mobile-playpage/playpage/tabs/${item.id}/${timestamp}`
            $.ajax({
                type: 'get',
                url: url,
                async: false,
                dataType: "json",
                success: function(resp) {
                    if (resp.ret === 0) {
                        const setting = GM_getValue('priate_script_xmly_data')
                        const trackInfo = resp.data.playpage.trackInfo;
                        if (setting.quality == 0) {
                            res = trackInfo.playUrl32
                        } else if (setting.quality == 1) {
                            res = trackInfo.playUrl64
                        }
                        // res = res || trackInfo.downloadUrl
                    }
                }
            });
        }
        return res
    }
    // 第二种获取musicURL的方式，任意用户均可获得，不可获得VIP音频
    async function getSimpleMusicURL2(item) {
        var res = null
        if (item.url) {
            res = item.url
        } else {
            var url = `https://www.ximalaya.com/revision/play/v1/audio?id=${item.id}&ptype=1`
            $.ajax({
                type: 'get',
                url: url,
                async: false,
                dataType: "json",
                success: function(resp) {
                    if (resp.ret == 200) res = resp.data.src;
                }
            });
        }
        return res
    }

    //获取任意音频方法
    async function getAllMusicURL1(item) {
        var res = null
        var setting;
        if (item.url) {
            res = item.url
        } else {
            const all_li = document.querySelectorAll('.sound-list>ul li');
            for (var num = 0; num < all_li.length; num++) {
                var li = all_li[num]
                const item_a = li.querySelector('a');
                const id = item_a.href.split('/')[item_a.href.split('/').length - 1]
                if (id == item.id) {
                    li.querySelector('div.all-icon').click()
                    while (!res) {
                        await Sleep(1)
                        setting = GM_getValue('priate_script_xmly_data')
                        res = setting.manualMusicURL
                    }
                    setting.manualMusicURL = null
                    GM_setValue('priate_script_xmly_data', setting)
                    li.querySelector('div.all-icon').click()
                    break
                }
            }
        }
        if (!res && item.isSingle) {
            document.querySelector('div.play-btn').click()
            while (!res) {
                await Sleep(1)
                setting = GM_getValue('priate_script_xmly_data')
                res = setting.manualMusicURL
            }
            setting.manualMusicURL = null
            GM_setValue('priate_script_xmly_data', setting)
            document.querySelector('div.play-btn').click()
        }
        return res
    }
    // 通过解密数据的方式获取 URL
    async function getAllMusicURL2(item) {
        function decrypt(t) {
            return CryptoJS.AES.decrypt({
                ciphertext: CryptoJS.enc.Base64url.parse(t)
            }, CryptoJS.enc.Hex.parse('aaad3e4fd540b0f79dca95606e72bf93'), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }).toString(CryptoJS.enc.Utf8)
        }
        var res = null
        if (item.url) {
            res = item.url
        } else {
            const timestamp = Date.parse(new Date());
            var url = `https://www.ximalaya.com/mobile-playpage/track/v3/baseInfo/${timestamp}?device=web&trackId=${item.id}`
            $.ajax({
                type: 'get',
                url: url,
                async: false,
                dataType: "json",
                success: function(resp) {
                    try {
                        res = decrypt(resp.trackInfo.playUrlList[0].url)
                    } catch (e) {
                        console.log("解密错误")
                        res = null
                    }
                }
            });
        }
        return res
    }

    // 处理数据等逻辑
    var vm = new Vue({
        el: '#priate_script_div',
        data: {
            version: "1.3.1",
            copyMusicURLProgress: 0,
            setting: GM_getValue('priate_script_xmly_data'),
            data: [],
            musicList: [],
            isDownloading: false,
            cancelDownloadObj: null,
            stopDownload: false,
        },
        methods: {
            loadMusic() {
                const whiteList = ['sound', 'album']
                const type = location.pathname.split('/')[location.pathname.split('/').length - 2]
                if (whiteList.indexOf(type) < 0) {
                    swal("请先进入一个专辑页面并等待页面完全加载！", {
                        icon: "error",
                        buttons: false,
                        timer: 3000,
                    });
                    this.data = []
                    this.musicList = []
                    return
                }
                const all_li = document.querySelectorAll('.sound-list>ul li');
                var result = [];
                var _this = this
                all_li.forEach((item) => {
                    const item_a = item.querySelector('a');
                    const number = item.querySelector('span.num') ? parseInt(item.querySelector('span.num').innerText) : 0
                    const title = item_a.title.trim().replace(/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g, '').replace(/\./g, '-')
                    const music = {
                        id: item_a.href.split('/')[item_a.href.split('/').length - 1],
                        number,
                        title: _this.setting.showNumber ? `${number + _this.setting.numberOffset - 1}-${title}` : title,
                        isDownloading: false,
                        isDownloaded: false,
                        progress: 0,
                    }
                    result.push(music)
                })
                // 如果没有获取到数据,则判断为单个音频
                if (result.length == 0 && type == 'sound') {
                    const music = {
                        id: location.pathname.split('/')[location.pathname.split('/').length - 1],
                        title: document.querySelector('h1.title-wrapper').innerText,
                        isDownloading: false,
                        isDownloaded: false,
                        progress: 0,
                        isSingle: true
                    }
                    result.push(music)
                }

                // 如果仍未获取到数据
                if (result.length == 0) {
                    swal("未获取到数据，请进入一个专辑页面并等待页面完全加载！", {
                        icon: "error",
                        buttons: false,
                        timer: 3000,
                    });
                }

                this.data = result
                this.musicList = []
                this.data.forEach((item) => {
                    this.musicList.push(item)
                })
            },
            async getMusicURL(item) {
                var res = await getSimpleMusicURL1(item)
                res = res || await getSimpleMusicURL2(item)
                res = res || await getAllMusicURL2(item)
                res = res || await getAllMusicURL1(item)
                this.$set(item, 'url', res)
                return res
            },
            async openMusicURL(item) {
                item.url = item.url || await this.getMusicURL(item)
                window.open(item.url)
            },
            async downloadMusic(item) {
                //this.isDownloading = true
                item.isDownloading = true
                item.isFailued = false
                var _this = this
                const details = {
                    url: item.url || await this.getMusicURL(item),
                    name: item.title.trim().replace(/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g, '').replace(/\./g, '-'),
                    onload: function(e) {
                        _this.isDownloading = false
                        item.isDownloading = false
                        item.isDownloaded = true
                        _this.selectAllMusic()
                    },
                    onerror: function(e) {
                        _this.isDownloading = false
                        console.log(e)
                        item.isDownloading = false
                        if (e.error != 'aborted') item.isFailued = true
                    },
                    onprogress: function(d) {
                        item.progress = (Math.round(d.loaded / d.total * 10000) / 100.00) + "%";
                    }
                }
                this.cancelDownloadObj = GM_download(details)
            },
            // 顺序下载
            async sequenceDownload(index, data) {
                this.isDownloading = true
                const item = data[index]
                if (!item) {
                    this.isDownloading = false
                    this.selectAllMusic()
                    this.stopDownload = false
                    return;
                };
                if (item.isDownloading || item.isDownloaded || this.stopDownload) return this.sequenceDownload(index + 1, data);
                item.isDownloading = true
                item.isFailued = false
                const _this = this
                const details = {
                    url: item.url || await this.getMusicURL(item),
                    name: item.title.trim().replace(/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g, '').replace(/\./g, '-'),
                    onload: function(e) {
                        item.isDownloading = false
                        item.isDownloaded = true
                        _this.cancelDownloadObj = _this.sequenceDownload(index + 1, data)
                    },
                    onerror: function(e) {
                        console.log(e)
                        item.isDownloading = false
                        if (e.error != 'aborted') item.isFailued = true
                        _this.cancelDownloadObj = _this.sequenceDownload(index + 1, data)
                    },
                    onprogress: function(d) {
                        item.progress = (Math.round(d.loaded / d.total * 10000) / 100.00) + "%";
                    }
                }
                this.cancelDownloadObj = GM_download(details)
                return this.cancelDownloadObj
            },
            async copyMusic(item) {
                item.url = item.url || await this.getMusicURL(item)
                GM_setClipboard(item.url)
            },
            // 下载当前列表全部音频
            async downloadAllMusics() {
                await this.sequenceDownload(0, this.musicList)
            },
            async copyAllMusicURL() {
                this.copyMusicURLProgress = 0
                var res = []
                for (var num = 0; num < this.musicList.length; num++) {
                    var item = this.musicList[num];
                    const url = await this.getMusicURL(item)
                    await Sleep(0.01)
                    this.copyMusicURLProgress = Math.round((num + 1) / this.musicList.length * 10000) / 100.00;
                    res.push(url)
                }
                GM_setClipboard(res.join('\n'))
                swal("复制成功!", {
                    icon: "success",
                    buttons: false,
                    timer: 1000,
                });
                this.copyMusicURLProgress = 0
            },
            async csvAllMusicURL() {
                this.copyMusicURLProgress = 0
                var dir = document.querySelector('h1.title').innerText
                dir = dir || Date.parse(new Date()) / 1000
                // var res = ["url,subfolder,filename"]
                var res = []
                for (var num = 0; num < this.musicList.length; num++) {
                    var item = this.musicList[num];
                    const url = await this.getMusicURL(item)
                    await Sleep(0.01)
                    this.copyMusicURLProgress = Math.round((num + 1) / this.musicList.length * 10000) / 100.00;
                    res.push(`${item.number},${item.title.replaceAll(',','，')},${url},${dir}`)
                }
                GM_setClipboard(res.join('\n'))
                this.copyMusicURLProgress = 0

                function download(filename, text) {
                    var element = document.createElement('a');
                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                    element.setAttribute('download', filename);
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                }

                download(`${dir}.csv`, res.join('\n'));
                swal("下载 CSV 文件成功!", {
                    icon: "success",
                    buttons: false,
                    timer: 1000,
                });
            },
            async aria2AllMusicURL(wsurl) {
                this.setting.aria2 = wsurl
                GM_setValue('priate_script_xmly_data', this.setting)
                this.copyMusicURLProgress = 0
                const config = {
                    wsurl
                }
                var dir = document.querySelector('h1.title').innerText
                dir = dir || (Date.parse(new Date()) / 1000 + '')
                dir = dir.trim().replace(/\\|\/|\?|\？|\*|\"|\“|\”|\'|\‘|\’|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g, '').replace(/\./g, '-') + '/'
                for (var num = 0; num < this.musicList.length; num++) {
                    var item = this.musicList[num];
                    const url = await this.getMusicURL(item)
                    var ext = url.split('.')[url.split('.').length - 1]
                    ext = ext.toLowerCase()
                    if (ext != 'mp3' || ext != 'm4a') {
                        ext = 'mp3'
                    }
                    await Sleep(0.01)
                    this.copyMusicURLProgress = Math.round((num + 1) / this.musicList.length * 10000) / 100.00;
                    Aria2(url, dir + item.title + '.' + ext, config)
                }
                swal(`Aria2 任务下发成功！文件保存至 ${dir} ，请自行检查下载状态。`, {
                    icon: "success",
                    buttons: false,
                    timer: 5000,
                });
                this.copyMusicURLProgress = 0
            },
            async exportAllMusicURL() {
                var _this = this
                var swalField = document.createElement('input');
                swalField.setAttribute("placeholder", "Aria2 下载地址");
                swalField.setAttribute("value", this.setting.aria2);
                swalField.setAttribute("class", "swal-content__input");
                swal("URL : 仅复制选中音频的 URL，不附带文件名等信息。\n\nCSV : 下载包含专辑名、音频名、URL等信息的 CSV 文件，可用 EXCEL 编辑，便于自己实现批量下载。\n\nAria2 : 调用 Aria2 进行下载，请先在文本框中填写 RPC 地址，并在 RPC 服务端将授权密钥设置为空，默认为 Motrix 的 RPC 下载地址。", {
                    buttons: {
                        1: "URL",
                        2: "CSV",
                        3: "Aria2",
                    },
                    content: swalField,
                }).then(async (value) => {
                    const method = parseInt(value)
                    switch (method) {
                        case 1:
                            await _this.copyAllMusicURL();
                            break;
                        case 2:
                            await _this.csvAllMusicURL();
                            break;
                        case 3:
                            await _this.aria2AllMusicURL(swalField.value);
                            break;
                        default:
                            if (value) swal(`导出失败！导出方法 ${value} 不存在。`, {
                                icon: "error",
                                buttons: false,
                                timer: 3000,
                            });
                            break;
                    }
                })
            },
            selectAllMusic() {
                if (this.musicList.length == this.notDownloadedData.length) {
                    this.musicList = []
                } else {
                    this.musicList = []
                    this.data.forEach((item) => {
                        !item.isDownloaded && this.musicList.push(item)
                    })

                }
            },
            //取消下载功能
            cancelDownload() {
                this.stopDownload = true
                this.cancelDownloadObj.abort()
            },
            // 修改音质功能
            changeQuality() {
                const _this = this
                swal("由于喜马拉雅接口变动，此功能暂时不可用，目前统一为高清。", {
                    buttons: false,
                    timer: 3000,
                    // buttons: {
                    //  1: "标准",
                    //  2: "高清",
                    //  3: "超高(仅VIP)",
                    // },
                }).then((value) => {
                    var changeFlag = true
                    switch (value) {
                        case "1":
                            _this.setting.quality = 0;
                            break;
                        case "2":
                            _this.setting.quality = 1;
                            break;
                        case "3":
                            _this.setting.quality = 2;
                            break;
                        default:
                            changeFlag = false
                    }
                    _this.setting.quality = 1
                    GM_setValue('priate_script_xmly_data', _this.setting)
                    changeFlag && location.reload()
                });
            },
            // 切换是否显示编号功能
            switchShowNumber() {
                this.setting.showNumber = !this.setting.showNumber
                this.setting.numberOffset = 0
                GM_setValue('priate_script_xmly_data', this.setting)
                if (this.filterData.length > 0) {
                    this.loadMusic()
                }
            },
            // 增加编号偏移量
            addNumberOffset() {
                if (!this.setting.showNumber) swal("请先开启编号功能再设置编号偏移量！", {
                    buttons: false,
                    timer: 2000,
                })
                if (this.setting.showNumber) this.setting.numberOffset += 1

                GM_setValue('priate_script_xmly_data', this.setting)
                if (this.filterData.length > 0) {
                    this.loadMusic()
                }
            },
            // 减少编号偏移量
            subNumberOffset() {
                if (!this.setting.showNumber) swal("请先开启编号功能再设置编号偏移量！", {
                    buttons: false,
                    timer: 2000,
                })
                if (this.setting.showNumber) this.setting.numberOffset -= 1

                GM_setValue('priate_script_xmly_data', this.setting)
                if (this.filterData.length > 0) {
                    this.loadMusic()
                }
            },
            // 修改每页容量
            changePageSize() {
                const _this = this
                swal("请设置每页展示的音频数量，最小为 30 ，最大为 100。\n\n注意：此设置仅会改变每页展示数据，底部的分页导航不受影响，因此后面部分页面出现空白为正常现象。\n\n设置后将刷新页面。", {
                    content: {
                        element: "input",
                        attributes: {
                            placeholder: "每页展示的音频数量",
                            type: "number",
                            value: _this.setting.pageSize ? _this.setting.pageSize : 30
                        }
                    }
                }).then((value) => {
                    const number = parseInt(value)
                    if (number > 100 || number < 30) {
                        swal(`每页数量不得超过 100 或少于 30！`, {
                            icon: "error",
                            buttons: false,
                            timer: 4000,
                        });
                    } else {
                        _this.setting.pageSize = number || _this.setting.pageSize
                        GM_setValue('priate_script_xmly_data', _this.setting)
                        if (value) location.reload()
                    }
                });
            },
            clearMusicData() {
                if (this.data.length == 0) swal(`已经是最简形态了！`, {
                    buttons: false,
                    timer: 2000,
                });
                this.data = []
                this.musicList = []
            },
            openDonate() {
                showDonate()
            }
        },
        computed: {
            filterData() {
                if (this.isDownloading) {
                    return this.musicList
                } else {
                    return this.data
                }

            },
            notDownloadedData() {
                return this.data.filter((item) => {
                    return item.isDownloaded == false
                })
            },
            qualityStr() {
                var quality = (this.setting.quality >= 0 && this.setting.quality <= 2) ? this.setting.quality : 3
                const str = ["标准", "高清", "超高", "未知"]
                return str[quality]
            },
            qualityColor() {
                var quality = (this.setting.quality >= 0 && this.setting.quality <= 2) ? this.setting.quality : 3
                const color = ["#946C00", "#55ACEE", "#00947e", "#337ab7"]
                return color[quality]
            }
        },
        mounted() {}
    })
    //设置div可拖动
    dragFunc("priate_script_div");
})();