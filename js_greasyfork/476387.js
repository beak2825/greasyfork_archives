// ==UserScript==
// @name         含羞草
// @namespace    http://tampermonkey.net/
// @version      2.3.0
// @description  含羞草-解析脚本，永久导航http://www.Fi11.app 中转地址：http://www.pmeaqve.cn    遇到播放地址为旧播放地址或者无反应，请自行多刷新几次当前页面，重新播放即可
// @author       院长
// @match        *://*/play/video/*
// @match        *://*/live/*
// @match        *://h5.*.com/home
// @match        *://h5.*.cn/home
// @match        *://www.*.com/home
// @match        *://www.*.cn/home
// @match        *://h5.*.com/play/video/*
// @match        *://h5.*.cn/play/video/*
// @match        *://www.*.com/play/video/*
// @match        *://www.*.cn/play/video/*
// @include      /^.*?://.*?\.fi.*?\.com.*?$/
// @include      /^.*?://.*?\.hx.*?\.com.*?$/
// @include      /^.*?://.*?/play/video.*?$/
// @include      /^.*?://(www|h5)\..*?\.com/play/video/.*?$/
// @include      /^.*?://(www|h5)\..*?\.cn/play/video/.*?$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=3kjs.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.26.0/DPlayer.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/476387/%E5%90%AB%E7%BE%9E%E8%8D%89.user.js
// @updateURL https://update.greasyfork.org/scripts/476387/%E5%90%AB%E7%BE%9E%E8%8D%89.meta.js
// ==/UserScript==

//中转地址：http://www.zhongyouchuanmei.xyz
//含羞草永久导航：http://www.Fi11.tv http://fi11.com http://fi11.cn http://www.Fi11.live http://www.fi11av.com
//打开永久导航中的最新网址即可，若是脚本框架需要匹配域名，自行将导航中的最新网址填上即可
//遇到播放地址为旧播放地址或者无反应，请自行刷新当前页面，重新播放即可


/**********************************/

/*
含羞草-解析脚本
参考来源https://yaohuo.me/bbs-1210512.html

实现游客无限试用，无限获取真实播放地址

已兼容手机和电脑

*/
/**********************************/




// 权限认证标识
const TOKEN = 'hxc_1.0.0_token';
// 服务地址
//let baseUrl = location.origin;
let baseUrl = "https://ap988.hydzswyxgs.com";
// 视频试看地址
//const PRE_URL = baseUrl + '/api/videos/getPreUrl';
const PRE_URL = baseUrl + '/videos/getPreUrl';
// 手机免费视频地址
const PRE_URL_V2 = baseUrl + '/videos/v2/getUrl';
// 用户注册地址
//const REG_URL = baseUrl + '/api/login/userReg';
const REG_URL = baseUrl + '/login/userReg';
//获取cid地址
//const DETAIL_URL = baseUrl + '/api/gather/getDetail';
const DETAIL_URL = baseUrl + '/gather/getDetail';
var videoUrl = "";




// 参数加密
function Encrypt(word) {
    let keyStr = 'B77A9FF7F323B5404902102257503C2F';
    const key = CryptoJS.enc.Utf8.parse(keyStr);
    const iv = CryptoJS.enc.Utf8.parse(keyStr);
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

// 请求封装
const fetchData = async (url, body) => {
    const Z = new Date;
    //console.log("服务器系统时间戳",parseInt(Z.getTime() / 1e3) + Z.getTimezoneOffset() * 60)
    return fetch(url, {
        method: 'post',
        body: JSON.stringify({
            endata: Encrypt(JSON.stringify(body)),
            ents:Encrypt(parseInt(Z.getTime() / 1e3) + Z.getTimezoneOffset() * 60),
        }),
        headers: {
            // 携带认证头
            auth: localStorage.getItem(TOKEN)?.replace(/"/g, ''),
            'Content-Type': 'application/json'
        }
    });
};






// 去除限制
const setValue = async () => {
    let isDetail = location.href.includes('play/video');
    if (isDetail) {
        //判断是h5还是电脑,或者是合集视频
        let videoId = location.href.match(/.+\/h5\..+\/play\/video\/(\d+)\/.+/)||location.href.match(/.+\/www\..+\/play\/video\/(\d+)\/.+/);
        if(!videoId){
            videoId = location.href.match(/.+\/play\/video\/(\d+)/)[1];
            //电脑
            //console.log("电脑")
            var preInfo = localStorage.getItem("preInfo");
            if(preInfo){
                preInfo = JSON.parse(preInfo)
                preInfo.count = 0;
                preInfo = JSON.stringify(preInfo)
                localStorage.setItem("preInfo", preInfo);
            }

            //await setElement("pc",videoId);
            //console.log("最后的视频url：" + videoUrl)

            videoId = getVideoId()
            //用于判定当前页面的videoId是否变化
            if (window.videoId == videoId) {
                return
            }
            await pc()
        }else{
            //手机
            //console.log(`-----------判断是手机：${videoId}`);
            let isCid = location.href.match(/.+\/h5\..+\/play\/video\/(\d+)\/1?videoId=.+/)||location.href.match(/.+\/www\..+\/play\/video\/(\d+)\/1?videoId=.+/);
            videoId = videoId[1];
            //合集视频
            if(isCid){
                //console.log(`-----------判断是isCid：${isCid}`);
                let url_list = isCid[0].split('1?videoId=');
                //带了videoId=后缀
                if(url_list.length>1){
                    videoId = url_list[1];
                    //console.log(`-----------videoId：${videoId}`);
                }else{
                    //console.log(`-----------isCid：${videoId}`);
                    videoId = await isListId(isCid[1]);
                }
            }
            //console.log(videoId)
            var tryPlayNum = localStorage.getItem("tryPlayNum");
            if(tryPlayNum){
                tryPlayNum = JSON.parse(tryPlayNum)
                tryPlayNum.num = 0;
                tryPlayNum = JSON.stringify(tryPlayNum)
                localStorage.setItem("tryPlayNum", tryPlayNum);
            }
            //await setElement("mobile",videoId);
            //新增判断合集
            if (!(window.location.href.endsWith("0") || window.location.href.endsWith("1")|| location.href.match(/.+1?videoId=/))) {
                return
            }
            //console.log("执行到这来了========================")
            videoId = await getVideoId();
            if (window.videoId == videoId) {
                return
            }
            //console.log("执行手机操作========================")
            await mobile()
        }

        //console.log("最后的视频ID：" + videoId);
        var videoId_File = localStorage.getItem("videoId");
        //console.log("===========================")
        if(videoId_File && videoId_File === videoId){
            //console.log("----------------------------")
            return
        }
        localStorage.setItem("videoId", videoId);
    }


}


function importJS(src) {
    let script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
}

//导包
function importLib() {
    importJS("https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js")
    importJS("https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js")
    importJS("https://cdn.bootcdn.net/ajax/libs/dplayer/1.26.0/DPlayer.min.js")
    importJS("https://cdn.bootcdn.net/ajax/libs/hls.js/1.1.5/hls.min.js")
}

//判断是否为合集,返回第一集
async function isListId(cid){
     let json = await fetchData(DETAIL_URL, {
        gatherId: Number(cid)
    }).then(response => {
        return response.json();
    });
    return json.data.info.videos[0].id;
}


//获取视频id
async function getVideoId() {
    //console.log("匹配视频id")
    let url = window.location.href;
    let url_list = url.split('0?cid=');
    let videoId = 0;
    if(url_list.length<2){
        //手机模式，普通视频
        if (url.endsWith("0")) {
            let urlSplited = url.split("play/video")
            urlSplited = urlSplited[1].split("/")
            videoId = urlSplited[1]
            //console.log("匹配普通视频id:"+videoId)
            return parseInt(videoId);
        }
        //匹配手机模式合集
        if (url.endsWith("/1")) {
            let urlSplited = url.split("play/video")
            urlSplited = urlSplited[1].split("/")
            //console.log("匹配手机模式合集cid:"+urlSplited[1])
            videoId = await isListId(urlSplited[1])
            //console.log("videoId:"+videoId)
            return parseInt(videoId);
        }
        if(url.match(/.+1?videoId=/)){
            videoId = url.split('1?videoId=')[1];
            return parseInt(videoId);
        }
        //通用视频
        let urlSplited = url.split("/");
        videoId = urlSplited[urlSplited.length - 1];
    }else{
        //电脑模式合集
        videoId = await isListId(url_list[1])
        //console.log("电脑模式合集cid:"+videoId)
    }

    return parseInt(videoId);
}


//获取视频链接（区分手机和电脑）
async function getVideoUrl(type,videoId){
    //很重要,区分是否当前页的id
    window.videoId = videoId
    //删除参数
    var waibubofan = "#waibubofan";
    var shipindizhi = "#shipindizhi";
    var delete_waibubofan = document.querySelectorAll(waibubofan);
    var delete_shipindizhi = document.querySelectorAll(shipindizhi);
    //先删除按键
    if(delete_waibubofan){
        for(let i=0;i<delete_waibubofan.length;i++){
            //console.log(`删除外部播放按键：${i}`)
            delete_waibubofan[i].remove()
        }
    }
    if(delete_shipindizhi){
        for(let i=0;i<delete_shipindizhi.length;i++){
            //console.log(`删除视频地址按键：${i}`)
            delete_shipindizhi[i].remove()
        }
    }

    //设置按钮
    let selectorParam = ".el-divider.el-divider--horizontal";
    if(type == "mobile"){
        selectorParam = ".tendency-row";

    }
    let json =await fetchData(PRE_URL, {
        videoId: Number(videoId)
    }).then(response => {
        return response.json();
    });
    const isSuccess = !!json.data.url;
    let el = document.querySelector(selectorParam);
    let a = document.createElement('a');
    a.style =
        'display:block;font-size:18px;padding:12px;color:#1890ff;';
    a.text = isSuccess ? '视频地址' : '获取失败';
    a.target = "_blank";
    a.id = "shipindizhi";
    if (isSuccess) {
        let parseUrl = json.data.url.replace(/start=\d+&end=\d+/, '').replace("?&sign", '?sign');
        a.href = parseUrl;
        // 获取ts切片
        let m3u8Str = await fetch(parseUrl).then(async res => {
            let m3u8Str = await res.text();
            return m3u8Str
        });
        // 提取第一条记录
        let tsUrl = m3u8Str.split('\n').find(item => {
            return /^[^#]/.test(item);
        });
        // 拼接
        //const linkUrl =
              'https://m3u8play.com/?play=' +
              new URL(parseUrl).origin +
              tsUrl;
        //新增地址
        const linkUrl = 'https://m3u8play.com/?play=' + encodeURI(parseUrl);
        //videoUrl = new URL(parseUrl).origin + tsUrl;
        //新增地址
        videoUrl = parseUrl;
        let external = document.createElement('a');
        external.style =
            'display:block;font-size:18px;padding:12px;color:#1890ff;';
        external.text = '外部播放';
        external.href = linkUrl;
        external.target = "_blank";
        external.id = "waibubofan";
        if(el){
            el.parentNode.insertBefore(external, el);
        }
        
    }else{
        //获取失败直接返回
        return;
    }
    if(el){
        el.parentNode.insertBefore(a, el);
    }

    
    return videoUrl;
}


//电脑播放
function play(playerUrl, pic, container, playType) {
    container.style.zIndex = 99999
    var videoObject = {
        container: '#v_prism', //容器的ID或className
        // live: true,//指定为直播
        //seek: 'cookie',//指定跳转到cookie记录的时间，使用该属性必需配置属性cookie
        cookie: 'abcdefg',//cookie名称,请在同一域中保持唯一
        plug: 'hls.js',//使用hls.js插件播放m3u8
        video: playerUrl//视频地址
    }
    window.ck = new ckplayer(videoObject);
    //window.ck.volume(0.5);//修改音量为0.5
    window.ck.volume(1);
    window.ck.play()
}

//手机播放
function mobilePlay(playerUrl, pic, container, playType) {
    container.style.zIndex = 99999
    window.dp = new DPlayer({
        container: container,                                              // 可选，player元素
        autoplay: false,                                                   // 可选，自动播放视频，不支持移动浏览器
        theme: '#FADFA3',                                                  // 可选，主题颜色，默认: #b7daff
        loop: true,                                                        // 可选，循环播放音乐，默认：true
        lang: 'zh',                                                        // 可选，语言，`zh'用于中文，`en'用于英语，默认：Navigator language
        screenshot: true,                                                  // 可选，启用截图功能，默认值：false，注意：如果设置为true，视频和视频截图必须启用跨域
        hotkey: true,                                                      // 可选，绑定热键，包括左右键和空格，默认值：true
        preload: 'auto',                                                   // 可选，预加载的方式可以是'none''metadata''auto'，默认值：'auto'
        video: {                                                           // 必需，视频信息
            url: playerUrl,                                                // 必填，视频网址
            pic: pic,                                                      // 可选，视频截图
            thumbnails: pic
        }
    });
}


async function pc() {
     if (window.location.href.endsWith("home")) {
        return
    }
    let videoId = await getVideoId();
    //let videoUrl = await getVideoUrl(videoId)
    let videoUrl = await getVideoUrl("pc",videoId)
    if (videoUrl == null) {
        return
    }
    let pic = document.querySelector(".el-image.overflow-hidden > img")
    if (pic) {
        pic = pic.getAttribute("src")
    }
    let container = document.querySelector("#v_prism")
    let playType = 'live'
    let elem = document.querySelector(".vip-mask")
    if (elem) {
            elem.remove()
    }
    
    elem = document.querySelector(".el-image.overflow-hidden")
    if (elem) {
        elem.remove()
    }
    elem = document.querySelector(".top-0.left-0.w-full.h-full.overflow-hidden")
    if (elem) {
        elem.remove()
    }
    elem = document.querySelector(".vip-mask > div")
    if (elem) {
        elem.remove()
    }

    elem = document.querySelector(".absolute.bg-overlay")
    if (elem) {
        elem.remove()
    }
    //console.log(`-----------执行播放电脑视频事件-------------`);
    //console.log(`-----------视频地址：${videoUrl}`);
    play(videoUrl, pic, container, playType)
    //await setElement("pc",videoId);
}

async function mobile() {
    if (!(window.location.href.endsWith("0") || window.location.href.endsWith("1")|| location.href.match(/.+1?videoId=/))) {
        return
    }
    let videoId = await getVideoId()
    //let videoUrl = await getVideoUrl(videoId)
    let videoUrl = await getVideoUrl("mobile",videoId)
    console.log(`-----------视频地址：${videoUrl}`);
    if (videoUrl == null) {
        return
    }

    let pic = document.querySelector(".pub-video-poster")
    if (pic) {
        pic = pic.getAttribute("src")
    }
    //container = document.querySelector(".van-sticky")
    let container = document.querySelector("#video1")
    let playType = 'live'
    //document.querySelector(".try-detail-video").remove()
    mobilePlay(videoUrl, pic, container, playType)
    //await setElement("mobile",videoId);
}


async function main() {
    //console.log(`-----------启动-------------`);
    /**********************************/
    // hook: 拦截路由地址变化
    const _historyWrap = function (type) {
        const orig = history[type];
        const e = new Event(type);
        return function () {
            const rv = orig.apply(this, arguments);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    // 监听路由操作
    ['pushState', 'replaceState'].forEach(method => {
        history[method] = _historyWrap(method);
        window.addEventListener(method, () => {
            //console.log('当前URL为：', document.location.href);
            setValue();
        });
    });

    window.addEventListener('popstate', function(event) {
        //console.log('当前URL为：', document.location.href);
        //setValue();
    });
    /**********************************/
    importLib()
}


main()

window.onload = function() {
     let elem = document.querySelector(".vip-mask")
    if (elem) {
            elem.remove()
    }
 };