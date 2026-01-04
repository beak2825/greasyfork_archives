// ==UserScript==
// @name               x1080x-preview
// @license MIT
// @namespace    https://greasyfork.org/zh-CN/scripts/439204-x1080x-preview
// @version            8.0
// @description    显示影片预览图和预览影片
// @author             jasmine
// @match               https://*.x567x.me/forum.php?mod=viewthread&tid=*
// @match               https://*.x567x.me/home.php?mod=spacecp&ac=pm&from=script
// @match               https://x567x.me/forum.php?mod=viewthread&tid=*
// @match               https://x567x.me/home.php?mod=spacecp&ac=pm&from=script
// @match               https://*.x999x.me/forum.php?mod=viewthread&tid=*
// @match               https://*.x999x.me/home.php?mod=spacecp&ac=pm&from=script
// @match               https://x999x.me/forum.php?mod=viewthread&tid=*
// @match               https://x999x.me/home.php?mod=spacsecp&ac=pm&from=script
// @icon                   https://www.google.com/s2/favicons?domain=www.x999x.me
// @connect          javdb.com
// @connect          javbus.com
// @connect          ec.sod.co.jp
// @connect          cloudfront.net
// @connect          r18.com
// @connect          www.dmm.co.jp
// @connect          video.dmm.co.jp
// @connect          accounts.dmm.co.jp
// @connect          dahlia-av.jp
// @connect          cdn.faleno.net
// @connect          faleno.jp
// @connect          www.mgstage.com
// @connect          www.afesta.tv
// @connect          www.bing.com
// @require            https://lib.baomitu.com/jquery/3.5.1/jquery.min.js
// @resource         fancybox_css https://lib.baomitu.com/fancybox/3.5.7/jquery.fancybox.min.css
// @require            https://lib.baomitu.com/fancybox/3.5.7/jquery.fancybox.min.js
// @resource         videojs_css https://lib.baomitu.com/video.js/5.20.5/video-js.min.css
// @require            https://lib.baomitu.com/video.js/5.20.5/video.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/videojs-hotkeys/0.2.27/videojs.hotkeys.min.js
// @resource         videojs_resolution_switcher_css https://lib.baomitu.com/videojs-resolution-switcher/0.4.2/videojs-resolution-switcher.min.css
// @require            https://lib.baomitu.com/videojs-resolution-switcher/0.4.2/videojs-resolution-switcher.min.js
// @grant               GM_xmlhttpRequest
// @grant               GM_notification
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @grant               GM_getResourceText
// @grant               GM_addStyle
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_log
// @grant               GM_openInTab
// @grant               GM_info
// @downloadURL https://update.greasyfork.org/scripts/439204/x1080x-preview.user.js
// @updateURL https://update.greasyfork.org/scripts/439204/x1080x-preview.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 菜单列表
    var menu_ALL = [
        ['menu_showGallery', '显示预览图', '显示预览图', true],
        ['menu_quality', '画面优先', '画面优先', true],
        ['menu_jumpSOD', '视频跳转SOD', '视频跳转SOD', true],
        ['menu_offcial', '搜索官网', '搜索官网', true],
        ['menu_multi', '并发搜索', '并发搜索', false],
        ['menu_JavDB', '搜索JavDB', '搜索JavDB', false],
        ['menu_JavBus', '搜索JavBus', '搜索JavBus', false],
    ], menu_ID = [];
    for (let i=0;i<menu_ALL.length;i++){ // 如果读取到的值为 null 就写入默认值
        if (GM_getValue(menu_ALL[i][0]) == null) {
            GM_setValue(menu_ALL[i][0], menu_ALL[i][3])
        };
    }
    registerMenuCommand();

    // 注册脚本菜单
    function registerMenuCommand() {
        if (menu_ID.length > menu_ALL.length){ // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
            for (let i=0;i<menu_ID.length;i++){
                GM_unregisterMenuCommand(menu_ID[i]);
            }
        }
        for (let i=0;i<menu_ALL.length;i++){ // 循环注册脚本菜单
            menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
            menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3]?'✅':'❌'} ${menu_ALL[i][1]}`, function(){menu_switch(`${menu_ALL[i][3]}`,`${menu_ALL[i][0]}`,`${menu_ALL[i][2]}`)});
        }
        //         menu_ID[menu_ID.length] = GM_registerMenuCommand(`📥 导入FanzaCookies`, function () {
        //             let fanza_cookies = "";
        //             let cookies = prompt("请使用EditThisCookie导出Cookies后粘贴至此");
        //             try {
        //                 JSON.parse(cookies).forEach(item=>{
        //                     fanza_cookies += `${item.name}=${item.value};`
        //                 })
        //                 GM_setValue("FANZA_Cookies", fanza_cookies)
        //             } catch (error) {
        //                 console.error(error);
        //             }
        //         })
        menu_ID[menu_ID.length + 1] = GM_registerMenuCommand('💬 反馈 & 建议', function () {GM_openInTab(`https://${document.location.hostname}/home.php?mod=spacecp&ac=pm&from=script`, {active: true,insert: true,setParent: true});});
    }

    // 菜单开关
    function menu_switch(menu_status, Name, Tips) {
        if (menu_status == 'true'){
            GM_setValue(`${Name}`, false);
            GM_notification({text: `已关闭 [${Tips}] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function(){location.reload();}});
        }else{
            GM_setValue(`${Name}`, true);
            if (['menu_JavDB', 'menu_JavBus'].includes(Name)) {
                GM_setValue('menu_offcial', false)
            }
            GM_notification({text: `已开启 [${Tips}] 功能\n（点击刷新网页后生效）`, timeout: 3500, onclick: function(){location.reload();}});
        }
        registerMenuCommand(); // 重新注册脚本菜单
    };

    // 返回菜单值
    function menu_value(menuName) {
        for (let menu of menu_ALL) {
            if (menu[0] == menuName) {
                return menu[3]
            }
        }
    }

    // 日志记录
    function record_log(msg) {
        let log = GM_getValue("log");
        if (log !== "") {
            log = log + "\n"
        }
        GM_setValue("log", log + msg);
        GM_log(msg);
    }

    // 根据xpath查找 一个结果
    function _xO(path, obj) {
        return obj.evaluate(path, obj, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // 根据xpath查找 多个结果
    function _xM(path, obj) {
        var xresult = obj.evaluate(path, obj, null, XPathResult.ANY_TYPE, null);
        var xnodes = [];
        var xres;
        while (xres = xresult.iterateNext()) {
            xnodes.push(xres.textContent);
        }
        return xnodes;
    }

    // 通用请求
    function gmFetch(obj) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: obj.method || 'GET',
                // timeout in ms
                timeout: obj.timeout,
                url: obj.url,
                headers: obj.headers,
                cookie: obj.cookie,
                data: obj.data,
                revalidate: obj.revalidate ? true: false,
                nocache: obj.nocache ? true: false,
                onload: res => {
                    if (res.status >= 200 && res.status < 400 || res.finalUrl === "http://ec.sod.co.jp/prime/") {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                },
                onerror: reject,
                ontimeout: reject,
            });
        });
    }

    // 请求
    function fetch(url, headers={"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"}){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: url,
                method: "GET",
                headers: headers,
                //timeout: 5000,
                onload: function(r){
                    if (r.status === 200) {
                        resolve(r.responseText)
                    } else {
                        reject("status error: " + r.status)
                    }
                },
                onerror: function(e) {
                    reject('fetch error')
                },
                ontimeout: function(e) {
                    reject('fetch timeout')
                }
            });
        })
    }

    // 检查连接
    function checkURL(url, headers={"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"}){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: url,
                method: "HEAD",
                headers: headers,
                //timeout: 5000,
                onload: function(r){
                    if (r.status === 200) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                },
                onerror: function(e) {
                    resolve(false)
                },
                ontimeout: function(e) {
                    resolve(false)
                }
            });
        })
    }

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }
    // 格式化页面
    function parseResponse(html) {
        const parser = new DOMParser()
        const tree = parser.parseFromString(html, "text/html")
        return tree
    }

    // DMM获取大图
    function preview_src(src)
    {
        if (src.match(/(p[a-z]\.)jpg/)) {
            return src.replace(RegExp.$1, 'pl.');
        } else if (src.match(/consumer_game/)) {
            return src.replace('js-','-');
        } else if (src.match(/js\-([0-9]+)\.jpg$/)) {
            return src.replace('js-','jp-');
        } else if (src.match(/ts\-([0-9]+)\.jpg$/)) {
            return src.replace('ts-','tl-');
        } else if (src.match(/(\-[0-9]+\.)jpg$/)) {
            return src.replace(RegExp.$1, 'jp' + RegExp.$1);
        } else {
            return src.replace('-','jp-');
        }
    }

    function getBase64FromImage(url, onSuccess, onError) {
        var xhr = new XMLHttpRequest();

        xhr.responseType = "arraybuffer";
        xhr.open("GET", url);

        xhr.onload = function () {
            var base64, binary, bytes, mediaType;

            bytes = new Uint8Array(xhr.response);
            //NOTE String.fromCharCode.apply(String, ...
            //may cause "Maximum call stack size exceeded"
            binary = [].map.call(bytes, function (byte) {
                return String.fromCharCode(byte);
            }).join('');
            mediaType = xhr.getResponseHeader('content-type');
            base64 = [
                'data:',
                mediaType ? mediaType + ';':'',
                'base64,',
                btoa(binary)
            ].join('');
            onSuccess(base64);
        };
        xhr.onerror = onError;
        xhr.send();
    }

    // 插入预览图
    function insertImages(item) {
        let src;
        if (video_type === "sod" && ["sod", "javbus"].includes(source)) {
            src = URL.createObjectURL(item)
        } else {
            src = item
        }
        const a = document.createElement("a");
        const img = document.createElement("img");
        a.href = src;
        a.setAttribute("data-fancybox", "gallery");
        a.setAttribute("class", "x1080x-ga-box");
        img.setAttribute("class", "x1080x-auto-img");
        img.src = src;
        a.appendChild(img);
        gallery_div.appendChild(a);
    }

    //下载预览图
    //    async function downloadSODImages(gallery, headers) {
    //        for (let index = 0; index < gallery.length; index++) {
    //            try {
    //                await download(gallery[index], gallery[index], headers);
    //            }
    //            catch(e){
    //                record_log(e)
    //            }
    //        }
    //    }

    //访问预览图
    async function accessSODImages(gallery, headers) {
        for (let index = 0; index < gallery.length; index++) {
            try {
                await fetch(gallery[index], headers);
            }
            catch(e){
                record_log(e)
            }
        }
    }

    // 浏览器版本
    navigator.sayswho= (function(){
        let ua= navigator.userAgent;
        let tem;
        let M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    })();
    // 入口
    //const res = await fetch("https://www.dmm.co.jp/service/digitalapi/-/html5_player/=/cid=ssis279/mtype=AhRVShI_/service=litevideo/mode=/width=560/height=360/", {"accept-language": "ja-JP,ja;q=0.9"})
    //log(res);
    //const re = /const args = ({.+});$/gm;
    //const hits = [];
    //// Iterate hits
    //let match = null;
    //do {
    //    match = re.exec(res);
    //    if(match) {
    //        hits.push(match[1]);
    //    }
    //} while (match);
    //const obj = JSON.parse(hits[0])
    //record_log(obj["bitrates"]); // Prints [ '#with', '#hashtags' ]
    //return false
    // 意见反馈
    if (window.location.href.endsWith("from=script")) {
        //let log = GM_getValue("log")
        document.querySelector("#username").value = "jpyl0423"
        document.querySelector("#sendmessage").value = GM_getValue("log")
        return
    }

    // 基础div
    const node = _xO("//div[@class='t_fsz']/table/tbody", document);
    if (node == null || !menu_value("menu_showGallery")) {
        return;
    }

    // 封面
    let cover = document.querySelector("td[id^=postmessage] img").src
    if (!cover.match(/(dmm.co.jp|www.hxmmdd.com)/)) {
        return
    }

    // 预览容器
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const gallery_div = document.createElement("div")
    td.appendChild(gallery_div)
    tr.appendChild(td)
    gallery_div.setAttribute("class", "x1080x-gallery");
    const ga_inner = document.createElement('span');
    gallery_div.appendChild(ga_inner)
    node.appendChild(tr)
    // 播放容器
    const play_box = document.createElement("a");
    play_box.setAttribute("class", "x1080x-ga-box x1080x-play-box");
    play_box.setAttribute("data-fancybox", "");
    gallery_div.insertBefore(play_box, gallery_div.firstChild);
    // 视频封面
    const poster = document.createElement("img");
    poster.setAttribute("class", "x1080x-auto-img");
    poster.src = cover
    const span = document.createElement("span");
    span.setAttribute("class", "x1080x-preview");
    span.innerHTML = '預告片'
    const outer_span = document.createElement("span");
    outer_span.setAttribute("class", "x1080x-outer");
    outer_span.innerHTML = '外链'
    play_box.appendChild(span);
    play_box.appendChild(outer_span);
    play_box.appendChild(poster);
    // 播放器
    const video_player = document.createElement("video");
    video_player.setAttribute("id", "x1080x-player");
    video_player.setAttribute("class", "video-js  vjs-default-skin");
    play_box.append(video_player)
    const options = {
        controls: true,
        responsive: true,
        plugins: {
            videoJsResolutionSwitcher: {
                default: menu_value('menu_quality') ? `high`: `low`, // Default resolution [{Number}, 'low', 'high'],
                dynamicLabel: true
            }
        },
    };
    let player = videojs("x1080x-player", options, function(){});
    player.ready(function() {
        this.hotkeys({
            volumeStep: 0.1,
            seekStep: 5,
            enableModifiersForNumbers: false
        });
    });
    // 加载fancybox样式
    const fancybox_css = GM_getResourceText("fancybox_css");
    GM_addStyle(fancybox_css);
    // 加载video-js样式
    const videojs_css = GM_getResourceText("videojs_css");
    GM_addStyle(videojs_css);
    GM_addStyle(".video-js .vjs-progress-holder, .video-js .vjs-progress-holder .vjs-play-progress,.video-js .vjs-progress-holder .vjs-load-progress,.video-js .vjs-progress-holder .vjs-tooltip-progress-bar,.video-js .vjs-progress-holder .vjs-load-progress div{height:1.0em}");
    // 加载videojs-resolution-switcher样式
    const videojs_resolution_switcher_css = GM_getResourceText("videojs_resolution_switcher_css");
    GM_addStyle(videojs_resolution_switcher_css);
    // 自定义样式
    let btn_img = `PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1Mi4xICg2NzA0OCkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+YnRuLXBsYXk8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iYnRuLXBsYXkiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yNTYsMCBDMTE0Ljg0MzU0OSwwIDAsMTE0Ljg0MzU0OSAwLDI1NiBDMCwzOTcuMTU2NDUxIDExNC44NDM1NDksNTEyIDI1Niw1MTIgQzM5Ny4xNTY0NTEsNTEyIDUxMiwzOTcuMTU2NDUxIDUxMiwyNTYgQzUxMiwxMTQuODQzNTQ5IDM5Ny4xNTY0NTEsMCAyNTYsMCBaIiBpZD0iU2hhcGUiIGZpbGw9IiMwQTVFRTAiPjwvcGF0aD4KICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgiIGZpbGw9IiNGRkZGRkYiIHBvaW50cz0iMTkyIDM4My45OTcyODUgMTkyIDEyNy45OTkwOTUgMzg0IDI1NS45OTcyODUiPjwvcG9seWdvbj4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==`
    GM_addStyle(`
        .x1080x-gallery {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            margin-top: 10px;
            max-width: 95%;
        }
        .x1080x-ga-box {
            display: inline-block;
            width: 250px;
            height: auto;
            text-align: center;
            vertical-align: middle;
            overflow-x: hidden;
            text-overflow: ellipsis;
            font-size: .9rem;
            background-color: black;
            margin: 5px 5px 0px 0px;
            cursor: pointer;
        }
        .x1080x-ga-box .x1080x-auto-img {
            position: relative;
            height: 120px;
        }
        .x1080x-play-box {
            display: none;
            position: relative;
        }
        .x1080x-play-box span.x1080x-preview {
            font-size: .8rem;
            color: #fff;
            background-color: #fc8300;
            position: absolute;
            top: 4px;
            left: 4px;
            text-align: center;
            padding: 1px 2px;
            border-radius: 3px;
            z-index: 999;
        }
        .x1080x-play-box span.x1080x-outer {
            font-size: .8rem;
            color: #fff;
            background-color: #fc8300;
            position: absolute;
            top: 4px;
            right: 4px;
            text-align: center;
            padding: 1px 2px;
            border-radius: 3px;
            z-index: 999;
            display: none;
        }
        .x1080x-play-box:after {
            background: url("data:image/svg+xml;base64,${btn_img}") 50% no-repeat;
            background-color: rgba(0,0,0,.2);
            background-size: 40px 40px;
            bottom: 0;
            content: "";
            display: block;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
        }
        .x1080x-play-box:hover::after {
            background-color: rgba(33,156,239,0);;
        }
        #x1080x-player {
            display:none;
            position: absolute;
            width: 50%;
            height: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            overflow: hidden;
        }
    `);

    GM_setValue("log", "");

    let title_pattern = /\)([^\(\)].*)</g;
    let subject = document.querySelector("#thread_subject").innerText
    let video_type;
    if (subject.match(/\(SOD\)|\(SODVR\)/) && menu_value("menu_offcial")) {
        video_type = "sod"
    } else if ([subject.match(/\(Prestige\)|\(MAXING\)/), document.body.innerHTML.indexOf("Prestige") != -1].some((e)=>e) && menu_value("menu_offcial")) {
        video_type = "mgs"
    } else if (subject.match(/\(AfestaVR\)/) && menu_value("menu_offcial")) {
        video_type = "afesta"
    } else {
        video_type = "sod"
    }
    let is_vr = (subject.indexOf("【VR】") !== -1 || subject.indexOf("【8K VR】")!== -1) ? true: false
    let pid = cover.replace("pl.jpg", ".jpg").replace("plzm.jpg", ".jpg").split("/").slice(-1)[0].split(".")[0]
    let vid = subject.match(/\w+-\d+/)[0]
    // SOD影片有可能在DMM, 番号格式类似: 1mogi00030
    if (pid != vid && video_type == "sod") {
        video_type = "dmm"
    }

    if (menu_value("menu_offcial") && pid.startsWith(`1`) == false) {
        if (subject.match(/\(DAHLIA\)/)) {
            video_type = "dahlia"
            pid = pid.replace("-", "")
        }
        if (subject.match(/\(FALENO\)/) && document.body.innerHTML.indexOf("Prestige") === -1) {
            video_type = "faleno"
            pid = pid.replace("-", "")
        }
    }

    if (is_vr & video_type == "sod" & vid.startsWith('3') == false) {
        vid = `3${vid}`
    }

    if (pid.match(/\d{3}[A-Z]+-\d{3}/)) {
        video_type = "mgs"
    }

    // MXGS-1341
    const regex = /^MXGS-(\d{3,4})$/i;
    const match = vid.match(regex);
    if (match) {
        const numberPart = match[1];
        const paddedNumber = numberPart.padStart(5, '0');
        vid = `mxgs${paddedNumber}`;
        video_type = "dmm"
    }

    let multi_search = menu_value("menu_multi")
    record_log(`浏览器: ${navigator.sayswho}`)
    record_log(`插件版本: ${GM_info.script.version}`)
    record_log(`标题: ${subject}`)
    record_log(`地址: ${window.location.href}`)
    record_log(`番号: ${pid}`)
    record_log(`视频ID: ${vid}`)

    let source;
    let dmm = async() => {
        if (!multi_search && (video_type !== "dmm" && !(video_type == "sod" && pid.includes("-"))) || !menu_value("menu_offcial")) {
            record_log(`DMM Search: 跳过`)
            throw new Error('DMM Search: 跳过');
        }
        let search_id = pid
        if (pid.includes("-")) {
            search_id = pid.split("-").join("00").toLowerCase()
        }
        record_log(`DMM Search: ${search_id}`)
        let dmm_headers = {"accept-language": "ja-JP,ja;q=0.9"}
        let dmm_cookie = "age_check_done=1"
        //let dmm_cookie = GM_getValue("FANZA_Cookies") ? GM_getValue("FANZA_Cookies"): "age_check_done=1";
        //let search_request = {url: `https://www.dmm.co.jp/search/=/searchstr=${search_id}`, headers: dmm_headers, cookie: dmm_cookie}
        //let search_res = await gmFetch(search_request).catch(err => {record_log(err); return;})
        // let search_html = parseResponse(search_res.responseText)
        // let ele_detail = search_html.querySelector(`.tmb a[href*="${search_id}"][href^="https://www.dmm.co.jp"]`)
        //const pattern = `https:\/\/www\.dmm\.co\.jp\/[\\w\/\\-\\=]*cid=${search_id}`;
        //const regex = new RegExp(pattern, "g");
        //let ele_detail = regex.exec(search_res.responseText)
       //if (!ele_detail) {
       //    record_log(`DMM Search: 未找到`);
       //    throw new Error('DMM Search: 未找到');
       //}
        // let detail_url = ele_detail.getAttribute("href").split("?")[0]
        //let detail_url = ele_detail[0]
        //record_log(`DMM Search: 详情页 ${detail_url}`)
        // let cid_pattern = /cid=(.*?\w)\//
        // let cid = cid_pattern.exec(detail_url)[1]
        //let detail_request = {url: detail_url, headers: dmm_headers, cookie: dmm_cookie}
        //let detail_res = await gmFetch(detail_request).catch(err => {record_log(err); return;})
        //let detail_html = parseResponse(detail_res.responseText)
        // 预览图
        // let imgs = [...detail_html.querySelectorAll("#sample-image-block img")].map( item => item.getAttribute("src")).map( item => preview_src(item))
        // let imgs = [...detail_html.querySelectorAll(`div[class*="pt-0.5"] a`)].map( item => item.getAttribute("href")).map( item => preview_src(item))
        let dmm_api_request = {method: "POST", data: JSON.stringify({
            "query": "query ContentPageData($id: ID!, $isAv: Boolean!) {ppvContent(id: $id) {...ContentData}}\n fragment ContentData on PPVContent {id\n title\n packageImage {largeUrl}\n sampleImages {imageUrl largeImageUrl}\n ...AvAdditionalContentData @include(if: $isAv)}\n fragment AvAdditionalContentData on PPVContent {actresses {name}}",
            "operationName": "ContentPageData",
            "variables": {
                "id": search_id,
                "isAmateur": false,
                "isAnime": false,
                "isAv": true,
                "isCinema": false,
                "isLoggedIn": false,
                "isSP": false
            }
        }), url: `https://api.video.dmm.co.jp/graphql`, headers: {'Content-Type': "application/json"}, cookie: dmm_cookie}
        let dmm_api_res = await gmFetch(dmm_api_request).catch(err => {
            record_log(`DMM Search: 未找到`);
            throw new Error(`DMM Search: ${err}`)
        })
        let dmm_api_json = JSON.parse(dmm_api_res.responseText);
        let imgs = dmm_api_json.data.ppvContent.sampleImages.map(item => {
            if (item.largeImageUrl) {
                return item.largeImageUrl
            } else {
                return item.imageUrl
            }
        })
        imgs = imgs.filter(item => item !== null)
        // 预览视频
        let video = []
        if (is_vr) {
            let video_request = {url: `https://www.dmm.co.jp/digital/-/vr-sample-player/=/cid=${search_id}/`, headers: dmm_headers, cookie: dmm_cookie}
            let video_res = await gmFetch(video_request).catch(err => {record_log(err); return;});
            let video_pattern = /var sampleUrl = "(.*)";/g;
            let video_url = video_pattern.exec(video_res.responseText)[1]
            if (video_url !== '') {
                video.push({
                    src: video_url,
                    type: 'video/mp4',
                    label: `VR`,
                    res: `100`
                })
            }
        } else {
            // let video_request = {url: `https://www.dmm.co.jp/service/digitalapi/-/html5_player/=/cid=${cid}/mtype=AhRVShI_/service=litevideo/mode=/width=560/height=360/`, headers: dmm_headers, cookie: dmm_cookie};
            let video_request = {url: `https://www.dmm.co.jp/service/digitalapi/-/html5_player/=/cid=${search_id}`, headers: dmm_headers, cookie: dmm_cookie};
            const video_label = {300: "流畅", 1000: "清晰", 1500: "高清", 2000: "高清", 3000: "HD", "4K (2160p)": "4K", "4K (2160p60)": "4K", "FullHD (1080p)": "1080p", "FullHD (1080p60)": "1080p", "HD (720p)": "720p", "HD (720p60)": "720p","高画質 (576p)": "576p", "中画質 (432p)": "432p", "中画質 (288p)": "288p", "低画質 (144p)": "144p"}
            let video_res = await gmFetch(video_request).catch(err => {record_log(err); return;});
            let video_pattern = /(const args = |const params = )({.+});$/gm;
            if (video_res.responseText) {
                let bitrates = JSON.parse(video_pattern.exec(video_res.responseText)[2]).bitrates
                video = bitrates.map( function(item) {
                    return {
                        src: item.src,
                        type: 'video/mp4',
                        label: video_label[item.bitrate],
                        res: item.bitrate
                    }
                })
            }
        }
        return {imgs: imgs, video: video, source: "dmm"}
    }

    let dahlia = async() => {
        if (!multi_search && video_type !== "dahlia" || !menu_value("menu_offcial")) {
            record_log(`DAHLIA Search: 跳过`)
            throw new Error('DAHLIA Search: 跳过');
        }
        let dahlia_cookie = "max-age=0"
        let detail_url = `https://dahlia-av.jp/works/${pid}/`
        record_log(`DAHLIA Search: 详情页 ${detail_url}`)
        let detail_request = {url: detail_url, cookie: dahlia_cookie}
        let detail_res = await gmFetch(detail_request).catch(err => {record_log(err); return;})
        let detail_html = parseResponse(detail_res.responseText)
        // 预览图
        let imgs = [...detail_html.querySelectorAll(".box_works01_ga a")].map( item => item.getAttribute("href"))
        // 预览视频
        let video = []
        let video_url = detail_html.querySelector(".overoll_box .pop_sample").getAttribute("href");
        if (video_url !== '') {
            video.push({
                src: video_url,
                type: 'video/mp4',
                label: `DAHLIA`,
                res: `100`
            })
        }
        return {imgs: imgs, video: video, source: "dmm"}
    }

    let faleno = async() => {
        if (!multi_search && video_type !== "faleno" || !menu_value("menu_offcial")) {
            record_log(`FALENO Search: 跳过`)
            throw new Error('FALENO Search: 跳过');
        }
        let faleno_cookie = "modal=off"
        let detail_url = `https://faleno.jp/top/works/${pid}/`
        record_log(`FALENO Search: 详情页 ${detail_url}`)
        let detail_request = {url: detail_url, cookie: faleno_cookie}
        let detail_res = await gmFetch(detail_request).catch(err => {record_log(err); return;})
        let detail_html = parseResponse(detail_res.responseText)
        // 预览图
        let imgs = [...detail_html.querySelectorAll(".box_works01_ga a")].map( item => item.getAttribute("href"))
        // 预览视频
        let video = []
        let video_url = detail_html.querySelector(".pop_sample").getAttribute("href");
        if (video_url !== '') {
            video.push({
                src: video_url,
                type: 'video/mp4',
                label: `FALENO`,
                res: `100`
            })
        }
        return {imgs: imgs, video: video, source: "dmm"}
    }

    let mgstage = async() => {
        if (!multi_search && video_type !== "mgs" || !menu_value("menu_offcial")) {
            record_log(`MGSTAGE Search: 跳过`)
            throw new Error('MGSTAGE Search: 跳过');
        }
        record_log(`MGSTAGE Search: ${pid}`)
        let cookie = `adc=1`;
        let detail_request = {url: `https://www.mgstage.com/product/product_detail/${pid}/`, cookie: cookie}
        let detail_res = await gmFetch(detail_request).catch(err => {record_log(err); return;})
        let detail_html = parseResponse(detail_res.responseText)
        // 预览图
        let imgs = [...detail_html.querySelectorAll(".sample_image")].map( item => item.getAttribute("href"))
        // 预览视频
        let video = []
        let ele = detail_html.querySelector('div.detail_photo p.sample_movie_btn a:not([disabled])');
        if (ele) {
            let href = ele.getAttribute('href');
            let pid = href.split('/').pop();
            record_log(`MGSTAGE Search: 视频ID ${pid}`);
            let video_request = {url: `https://www.mgstage.com/sampleplayer/sampleRespons.php?pid=${pid}`, cookie: cookie}
            let video_res = await gmFetch(video_request).catch(err => {record_log(err); return;})
            let re = /https.*?ism/
            let json_obj = JSON.parse(video_res.responseText);
            let video_url = json_obj.url;
            video_url = re.exec(video_url)[0].replace('ism', 'mp4');
            video.push({
                src: video_url,
                type: 'video/mp4',
                label: `MGS`,
                res: `100`
            })
        }
        return {imgs: imgs, video: video, source: "mgs"}
    }
    let sod = async() => {
        if (!multi_search && video_type !== "sod" || !menu_value("menu_offcial")) {
            record_log(`SOD Search: 跳过`)
            throw new Error('SOD Search: 跳过');
        }
        record_log(`SOD Search: ${vid}`)
        let detail_request = {url: `https://ec.sod.co.jp/prime/videos/?id=${vid}`}
        let detail_res = await gmFetch(detail_request).catch(err => {record_log(err); return;})
        let detail_html = parseResponse(detail_res.responseText)
        let age_check = detail_html.querySelector(".pkg_age")
        if (age_check) {
            await gmFetch({url: `https://ec.sod.co.jp/prime/_ontime.php`}).catch(err => {record_log(err); return;})
            detail_res = await gmFetch(detail_request).catch(err => {record_log(err); return;})
            detail_html = parseResponse(detail_res.responseText)
        }
        // 预览图
        let imgs = [...detail_html.querySelectorAll(".img-gallery a")].map( item => item.getAttribute("href"))
        let imgs_blob = []
        await asyncForEach(imgs, async (img) => {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "get",
                    url: img,
                    headers: {"referer": `https://ec.sod.co.jp/prime/videos/?id=${vid}`},
                    responseType: "blob",
                    onload:  response => {resolve(response)},
                    onerror: response => {reject(response)},
                });
            });
            //console.log("response:", response);
            const {response: blob} = response;
            console.log(blob);
            imgs_blob.push(blob)
        })
        imgs = imgs_blob
        // 预览视频
        let video = []
        let ele_video = detail_html.querySelector(".videos_sampb a");
        if (ele_video) {
            let video_url = `https://ec.sod.co.jp/prime/videos/${ele_video.getAttribute('href')}`;
            video.push({
                src: video_url,
                type: 'video/mp4',
                label: `SOD`,
                res: `100`
            })
            let video_request = {url: video_url}
            let video_res = await gmFetch(video_request).catch(err => {record_log(err); return;})
            let video_html = parseResponse(video_res.responseText)
            let video_src = video_html.querySelector("#moviebox source").getAttribute("src")
            video.push({
                src: `${video_src}?from=script`,
                type: 'video/mp4',
                label: `SOD`,
                res: `100`
            })
        }
        return {imgs: imgs, video: video, source: "sod"}
    }

    let afesta = async() => {
        if (!multi_search && video_type !== "afesta" || !menu_value("menu_offcial")) {
            record_log(`Afesta Search: 跳过`)
            throw new Error('Afesta Search: 跳过');
        }
        record_log(`Afesta Search: ${pid}`)
        const params = new URLSearchParams();
        params.append("keyword", `${pid}`);
        params.append("header", "search");
        let search_request = {url: `https://www.afesta.tv/vr/search.php`, method: `POST`, data: `keyword=${pid}&header=search`, headers: {"Content-Type": "application/x-www-form-urlencoded"}}
        let search_res = await gmFetch(search_request).catch(err => {record_log(err); return;})
        let search_html = parseResponse(search_res.responseText)

        let ele_detail = Array.from(search_html.querySelectorAll('.faces-list a')).find(el => el.querySelector(`img`).getAttribute(`data-src`).indexOf(pid) != -1)
        if (!ele_detail) {
            record_log(`Afesta Search: 未找到`);
            throw new Error('Afesta Search: 未找到');
        }
        let detail_url = ele_detail.getAttribute("href")
        record_log(`Afesta Search: 详情页 ${detail_url}`)
        let detail_request = {url: detail_url}
        let detail_res = await gmFetch(detail_request).catch(err => {record_log(err); return;})
        let detail_html = parseResponse(detail_res.responseText)
        // 预览图
        let imgs = [...detail_html.querySelectorAll(`.thumbs-grid li a`)]
        .map( item => item.getAttribute("href"))
        .map( item => {
            if (!item.startsWith(`http`)) {
                return new URL(item, detail_url).href
            } else {
                return item
            }})
        // 预览视频
        let video = []
        return {imgs: imgs, video: video, source: "afesta"}
    }

    let javdb = async() => {
        if (!menu_value("menu_JavDB") || menu_value("menu_offcial")) {
            record_log(`JavDB Search: 跳过`)
            throw new Error('JavDB Search: 跳过');
        }
        record_log(`JavDB Search: ${vid}`)
        let cookie = `over18=1`;
        let search_request = {url: `https://javdb.com/search?q=${vid}&f=all`, cookie: cookie}
        let search_res = await gmFetch(search_request).catch(err => {record_log(err); return;})
        let search_html = parseResponse(search_res.responseText)
        let ele_detail = Array.from(search_html.querySelectorAll('.video-title strong')).find(el => el.textContent === vid)
        if (!ele_detail) {
            record_log(`JavDB Search: 未找到`);
            throw new Error('JavDB Search: 未找到');
        }
        let detail_url = `https://javdb.com${ele_detail.closest("a").getAttribute("href")}`
        let detail_request = {url: detail_url, cookie: cookie}
        let detail_res = await gmFetch(detail_request).catch(err => {record_log(err); return;})
        let detail_html = parseResponse(detail_res.responseText)
        // 预览图
        let imgs = [...detail_html.querySelectorAll(".preview-images a[class=tile-item]")].map( item => item.getAttribute("href"))
        // 预览视频
        let video = []
        let ele_video = detail_html.querySelector(".preview-video-container")
        if (ele_video) {
            let video_src = ele_video.nextElementSibling.querySelector("source").getAttribute("src")
            video.push({
                src: video_src,
                type: 'video/mp4',
                label: `JavDB`,
                res: `100`
            })
        }
        return {imgs: imgs, video: video, source: "javdb"}
    }

    let javbus = async() => {
        if (!menu_value("menu_JavBus") || menu_value("menu_offcial")) {
            record_log(`JavBus Search: 跳过`)
            throw new Error('JavBus Search: 跳过');
        }
        record_log(`JavBus Search: ${vid}`)
        let detail_request = {url: `https://www.javbus.com/${vid}`}
        let detail_res = await gmFetch(detail_request).catch(err => {record_log(err); return;})
        let detail_html = parseResponse(detail_res.responseText)
        // 预览图
        let imgs = [...detail_html.querySelectorAll("#sample-waterfall a")]
        .map( item => item.getAttribute("href"))
        .map(function(item) {
            if(item.startsWith("http")) {
                return item
            } else {
                video_type="sod"
                return `https://www.javbus.com${item}`
            }
        })
        if (video_type==="sod") {
            let imgs_blob = []
            await asyncForEach(imgs, async (img) => {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "get",
                        url: img,
                        headers: {"referer": `https://www.javbus.com/${vid}`},
                        responseType: "blob",
                        onload:  response => {resolve(response)},
                        onerror: response => {reject(response)},
                    });
                });
                //console.log("response:", response);
                const {response: blob} = response;
                imgs_blob.push(blob)
            })
            imgs = imgs_blob
        }
        // 预览视频
        let video = []
        return {imgs: imgs, video: video, source: "javbus"}
    }
    ga_inner.innerHTML = "正在搜索预览图..."
    Promise.allSettled([dmm(),dahlia(),faleno(),mgstage(),sod(),afesta(),javdb(),javbus()]).then(results=>{
        ga_inner.innerHTML = ""
        results.forEach(r => {
            if (r.status == "rejected" && r.reason.stack.indexOf("跳过") == -1) {
                record_log(`Error Reason: ${r.reason.stack}`)
            }
        })
        let p = results.find(result => result.status==="fulfilled")
        if (p) {
            source = p.value.source
            let imgs = p.value.imgs
            let video = p.value.video
            if (imgs.length !== 0) {
                imgs.forEach(insertImages)
            }
            if (video.length !==0) {
                play_box.setAttribute("style", "display:inline-block");
                if (source === "sod") {
                    if (menu_value("menu_jumpSOD")) {
                        video = video.slice(0,1)
                        outer_span.setAttribute("style", "display:block");
                    } else {
                        video = video.slice(1)
                        player.updateSrc(video)
                    }
                } else {
                    player.updateSrc(video)
                }

                // 点击弹出播放器
                play_box.onclick = function (e) {
                    e.preventDefault();
                    if (source === "sod" && menu_value("menu_jumpSOD")) {
                        GM_openInTab(video[0].src, {active : true})
                    } else {
                        video_player.setAttribute("style", "display:block");
                        $.fancybox.open({
                            src  : '#x1080x-player',
                            type : 'inline',
                            opts : {
                                smallBtn: false,
                                touch: false,
                                afterShow : function( instance, current ) {
                                    player.play();
                                },
                                afterClose : function( instance, current ) {
                                    player.pause();
                                }
                            }
                        });
                    }
                }
            }
            if (imgs.length === 0 && video.length === 0 ){
                gallery_div.style.display = "none"
            }
        }
    })
    //$.fancybox.defaults.loop = "true";
})();