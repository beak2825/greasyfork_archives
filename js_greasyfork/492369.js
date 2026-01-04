// ==UserScript==
// @name         海角社区-VIP视频观看，支持PC与手机端
// @namespace    http://tampermonkey.net/
// @version      2.2.2
// @description  最新解析接口，快速稳定，可观看钻石视频
// @author       chuvh360
// @license      MIT
// @match       https://haijiao.com/*
// @match       https://tools.thatwind.com/tool*
// @match        https://*/post/details*
// @icon         https://hjbc30.top/images/common/project/favicon.ico
// @run-at      document-start
// @grant       unsafeWindow
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @connect      *
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://unpkg.com/layui@2.8.18/dist/layui.js
// @resource     layuicss https://unpkg.com/layui@2.8.18/dist/css/layui.css
// @charset		 UTF-8
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492369/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA-VIP%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%EF%BC%8C%E6%94%AF%E6%8C%81PC%E4%B8%8E%E6%89%8B%E6%9C%BA%E7%AB%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/492369/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA-VIP%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%EF%BC%8C%E6%94%AF%E6%8C%81PC%E4%B8%8E%E6%89%8B%E6%9C%BA%E7%AB%AF.meta.js
// ==/UserScript==


(function () {
    'use strict';

    var $ = unsafeWindow.jQuery;     
    GM_addStyle (GM_getResourceText ("layuicss") );
    let magicVideoHost = "https://ip.hjcfcf.com";
    let baseUrl = "https://1256161784-g530cbmrf5-gz.scf.tencentcs.com";
    let checkStep = 50;
    function decode(s) {
        return atob(atob(atob(s)));
    }

    function encode(s) {
        return btoa(btoa(btoa(s)));
    }

    function jencode(s) {
        return encode(JSON.stringify(s, `utf-8`));
    }
    async function setV(k, v) {
        if (IsIOS()) {
          window.localStorage.setItem(k, v);
        } else {
          await GM_setValue(k, v);
        }
      }
    async function getV(k) {
        if (IsIOS()) {
            return window.localStorage.getItem(k) || "";
        } else {
            return await GM_getValue(k,null) || "";
        }
    }
    async function delV(k) {
        if (IsIOS()) {
            return window.localStorage.removeItem(k) || "";
        } else {
            return await GM_deleteValue(k) || "";
        }
    }
    async function play(blob_url,videoUrl) {
        console.log("url=" + blob_url)
        let playpos = ''
        if (IsPhone()) {
            if(IsIOS){
                $('.sell-btn').empty()
                $('.sell-btn').append(`
                    <video id="video" controls  width="100%"  >
                        <source src="${videoUrl}" type="application/x-mpegURL">
                    </video>
                `)
            }else{
                playpos = '.sell-btn'
                let videoInfo = document.querySelector(playpos)
                videoInfo.innerHTML = '<video id="video" controls autoplay width="100%"></video>'
                var video = document.getElementById('video');
                var hls = new Hls();
                hls.attachMedia(video);
                hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                    hls.loadSource(blob_url);
                    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                        console.log("manifest loaded, found " + data.levels.length + " quality level");
                    });
                });
            }
        }
        else {
            playpos = '.sell-btn'
            window.dp = new DPlayer({
                element: document.querySelector(playpos),
                autoplay: false,
                theme: '#FADFA3',
                loop: true,
                lang: 'zh',
                screenshot: true,
                hotkey: true,
                preload: 'auto',
                video: {
                    url: blob_url,
                    type: 'hls'
                }
            })
        }
    }
    async function videoParse(preview_url,code,topicId,preview_m3u8_content,videoLength) {
        if(code == ''){
            layer.msg('请输入邀请码', {icon: 2})
            return
        }
        layer.msg('开始解析,请稍后', {icon: 1})
        // 增加验证
        let preview_m3u8_data = parseM3u8Content(preview_m3u8_content);
        let key = preview_m3u8_data['key'];
        console.log("key",key);
        if(key.indexOf("http") == -1){
            let preview_url_split = preview_url.split("/")
            preview_url_split[preview_url_split.length-1] = key;
            preview_m3u8_data['key'] = preview_url_split.join("/"); 
        }
        let firstTsUrl = replaceMagicHost(preview_m3u8_data['ts_files'][0],magicVideoHost);
        let lastShardNum = videoLength - 1;
        let realShardNum = await getLastShardNum(firstTsUrl, lastShardNum);
        let totalShardCount = realShardNum + 1;
        let parse_url = baseUrl + "/parse_plus" + "?" + "code=" + code + "&topicId=" + topicId + "&videoLength=" + videoLength + "&shardNum=" + totalShardCount +  "&key=" + encodeURIComponent(preview_m3u8_data["key"]) + "&iv=" + preview_m3u8_data["iv"] + "&m=" + preview_m3u8_data["method"] + "&tsUrl=" + encodeURIComponent(preview_m3u8_data['ts_files'][0]) ;
        try {
            console.log("parse_url",parse_url)
            let result = await httpGet(parse_url);
            console.log("result",result);
            await processParseResult(JSON.parse(result),code); 
        } catch (error) {
            console.error("Error",error)
        }
    }

    async function processParseResult(res,code){
        // console.log("res",JSON.stringify(res));
        if(res.code == 1001){
            layer.msg('无效的邀请码', {icon: 2})
            delV("hj_invit_code")
            return
        }else if(res.code == 200){
            setV("hj_invit_code",code)
            layer.msg('解析成功,请点击播放', {icon: 1})
            let videoUrl = baseUrl + "/video/" + res.data.videoId;
            console.log("videoUrl", videoUrl)
            let m3u8_content = await httpGet(videoUrl);
            console.log("m3u8_content", m3u8_content);
            var blob = new Blob([m3u8_content], { type: 'text/plain' });
            let blob_url = URL.createObjectURL(blob)
            console.log("blob_url", blob_url)
            play(blob_url,videoUrl)
        }else{
            layer.msg('解析失败,请重试', {icon: 2})
            return;
        }
    }
    function parseM3u8Content(content) {
        let result = {};
        let splitLines = content.split("\n");
        let urls = [];
        for (let line of splitLines) {
            if (line.startsWith("#EXT-X-KEY")) {
                let keyItems = line.split(",");
                for (let item of keyItems) {
                    let value = item.split("=", 2)[1];
                    // console.log("value",value);
                    if (item.includes("METHOD")) {
                        result['method'] = value;
                        continue;
                    }
                    if (item.includes("URI")) {
                        result['key'] = value.replace(new RegExp("\"","gm"),"");
                        continue;
                    }
                    if (item.includes("IV")) {
                        result['iv'] = value;
                    }
                }
            }
            if (line.startsWith("https://") || line.startsWith("http://")) {
                urls.push(line);
            }
        }
        result['ts_files'] = urls;
        return result;
    }
    function replaceMagicHost(url, magicHost) {
        if(url.endsWith(".ts")){
            return url;
        }
        let tsUrlPath = new URL(url).pathname;
        console.log(tsUrlPath);
        return magicHost + tsUrlPath;
    }

    async function isShardTsUrlOk(firstTsUrl, shardNum) {
        let tsUrl = firstTsUrl.replace("i0.ts", `i${shardNum}.ts`);
        console.log("check tsUrl", tsUrl);
        if(IsPhone()){
            const response = await fetch(tsUrl, { method: 'HEAD', mode: 'cors'});
            console.log("phone check response", response);
            return response.ok;
        }else{
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "HEAD",
                    url: tsUrl,
                    onload: function(response) {
                        console.log("check response", response);
                        resolve(response.status === 200);
                    },
                    onerror: function(error) {
                        console.error(error)
                        reject(false);
                    }
                });
            });
        }
    }

    async function httpGet(url) {
        if(IsPhone()){
            const response = await fetch(url);
            let res = await response.text();
            return res;
        }   
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    console.log("get response", response);
                    resolve(response.responseText);
                },
                onerror: function(error) {
                    console.error("Error:", error);
                    reject(error);
                }
            });
        });        
    }


    async function getStepCheckShardNum(firstTsUrl, lastShardNum, step) {
        let stepCheckShard = lastShardNum;
        while (true) {
            console.log("stepCheckShard:", stepCheckShard);
            let ok = false;
            try{
                ok = await isShardTsUrlOk(firstTsUrl, stepCheckShard)
            }catch(error){
                console.error(error)
                ok = false;    
            }
            console.log("getStepCheckShardNum isShardTsUrlOk",ok)
            if (!ok) {
                stepCheckShard -= step;
            } else {
                break;
            }
        }
        return stepCheckShard;
    }

    async function binarySearchShardNum(firstTsUrl, start, end) {
        while (true) {
            let checkShard = start + Math.floor((end - start) / 2);
            console.log("binarySearchShardNum:", checkShard);
            let ok = false;
            try{
                ok = await isShardTsUrlOk(firstTsUrl, checkShard)
            }catch(error){
                console.error(error) 
                ok = false;     
            }
            console.log("binarySearchShardNum isShardTsUrlOk",ok)
            if (ok) {
                start = checkShard;
            } else {
                end = checkShard;
            }
            console.log("start",start)
            console.log("end",end)
            if (start + 1 === end) {
                return start;
            }
        }
    }

    async function getLastShardNum(firstTsUrl, lastShardNum) {
        let stepCheckShard = await getStepCheckShardNum(firstTsUrl, lastShardNum, parseInt(checkStep));
        if (stepCheckShard < lastShardNum) {
            let shardNum = await binarySearchShardNum(firstTsUrl, stepCheckShard, stepCheckShard + parseInt(checkStep));
            return shardNum;
        } else {
            return lastShardNum;
        }
    }

    function replace_exist_img(body) {
        let content = body.content;
        let attachments = body.attachments;
        let all_img = {};
        let has_video = -1;
        for (var i = 0; i < attachments.length; i++) {
            var atta = attachments[i];
            if (atta.category === 'images') {
                all_img[atta.id] = atta.remoteUrl;
            }
            if (atta.category === 'video') {
                has_video = i;
                return [body, undefined, has_video];
            }
        }
        let re_img = /<img src=\"https:\/\/[\w\.\/]+?\/images\/.*?\" data-id=\"(\d+)\".*?\/>/g;
        for (let e of content.matchAll(re_img)) {
            let id = parseInt(e[1]);
            if (id in all_img) {
                delete all_img[id];
            }
        }
        body.content = content;
        return [body, all_img, has_video];
    }


    async function replace_m3u8(body, has_video) {
        // await delV("hj_invit_code")
        let topicId = body.topicId;
        let attachments = body.attachments;
        let vidx = has_video;
        if (vidx < 0) {
            return [body, undefined];
        }
        if (body.sale === null || body.sale.money_type == 0) {
            return [body, attachments[vidx]];
        }
        let url = attachments[vidx].remoteUrl;
        let videoLength = attachments[vidx].video_time_length;
        console.log("topicId", topicId)
        console.log("url", url)
        console.log("videoLength", videoLength)
        if(url.indexOf("/api/address") > -1){
            url = "https://" + window.location.hostname  + url;
        }
        console.log("url",url);
        let preview_m3u8_content = await httpGet(url);
        // console.log("preview_m3u8_content",preview_m3u8_content);
        if(preview_m3u8_content.indexOf("IV=") >= 0){
            const hj_invit_code = await getV("hj_invit_code");
            console.log("hj_invit_code",hj_invit_code);
            if(hj_invit_code){
                console.log("start videoParse");
                videoParse(url,hj_invit_code,topicId,preview_m3u8_content,videoLength); 
            }else{
                console.log("start get qqQun");
                let contact_url = baseUrl + "/contact";
                let qQun = await httpGet(contact_url); 
                console.log("qq群:",qQun)
                layer.prompt({
                    formType: 0,
                    value: '',
                    title: '加QQ群:【' + qQun + '】获取邀请码',
                  }, function(value, index, elem){
                    videoParse(url,value,topicId,preview_m3u8_content,videoLength);    
                    layer.close(index);
                  });
            }
        }
        return [body, attachments[vidx]]; 
    }

    function remove_vip(body) {
        body.node.vipLimit = 0;
        let attachments = body.attachments;
        let image_urls = [];
        let video_urls = ``;
        let has_video = -1;
        for (var i = 0; i < attachments.length; i++) {
            var atta = attachments[i];
            if (atta.category === 'images') {
                image_urls.push(`<img src="${atta.remoteUrl}" data-id="${atta.id}"/>`)
            }
            if (atta.category === 'video') {
                has_video = i;
            }
        }
        console.log("has_video",has_video);
        let images = image_urls.join();
        if (has_video >= 0) {
            console.log("replace_m3u8 in remove_vip");
            let [nbody, v] = replace_m3u8(body, has_video);
            body = nbody;
            video_urls = `<video src="${v.remoteUrl}" data-id="${v.id}"/></video>`
        }
        let content = body.content.replace(/\[[图片视频]+\]?/, ``);
        content = body.content.replace(/此处内容售价.*?您还没有购买，请购买后查看！/, ``);
        content = '<html><head></head><body>' + content + '<br/>' + images + '<br/>' + video_urls + '<br/></body></html>';
        body.content = content;
        return body;
    }
    function modify_data(data) {
        let body = data;
        if(typeof data === 'string'){
          body = JSON.parse(decode(data));
        }
        // console.log("body",body);
        if (body.node.vipLimit != 0) {
            body = remove_vip(body);
            return jencode(body);
        }
        let [nbody, rest_img, has_video] = replace_exist_img(body);
        body = nbody;
        // console.log("has_video",has_video);
        if (body.content.includes(`[/sell]`)) {
            return jencode(body);
        }
        if ('sale' in body && body.sale !== null) {
            body.sale.is_buy = true;
            body.sale.buy_index = parseInt(Math.random() * (5000 - 1000 + 1) + 1000, 10);
        }
        if (has_video >= 0) {
            console.log("replace_m3u8 in modify_data");
            let [nbody, v] = replace_m3u8(body, has_video);
            return jencode(nbody);
        }
        let img_elements = []
        for (const [id, src] of Object.entries(rest_img)) {
            img_elements.push(`<img src="${src}" data-id="${id}"/>`);
        }
        let selled_img = `[sell]` + img_elements.join() + `[/sell]`;
        let ncontent = body.content.replace(/<span class=\"sell-btn\".*<\/span>/, selled_img);
        body.content = ncontent;
        return jencode(body);
    }


    function IsPhone() {
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
            navigator.userAgent.toLowerCase()
          );
    }

    function IsIOS(){
        return /(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase());
    }
    const originOpen = XMLHttpRequest.prototype.open;
    const re_topic = /\/api\/topic\/\d+/;
    XMLHttpRequest.prototype.open = function (_, url) {
        // 拦截topic
        if (re_topic.test(url)) {
            const xhr = this;
            const getter = Object.getOwnPropertyDescriptor(
                XMLHttpRequest.prototype,
                "response"
            ).get;
            Object.defineProperty(xhr, "responseText", {
                get: () => {
                    let result = getter.call(xhr);
                    try {
                        let res = JSON.parse(result, `utf-8`);
                        console.log("res",res)
                        // 这里修改data
                        res.data = modify_data(res.data)
                        return JSON.stringify(res, `utf-8`);
                    } catch (e) {
                        console.log('发生异常! 解析失败!');
                        console.log(e);
                        return result;
                    }
                },
            });
        }
        originOpen.apply(this, arguments);
    };
})();
