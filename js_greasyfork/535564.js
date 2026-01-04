// ==UserScript==
// @name         javlibrary enhancement
// @name:zh      javlibrary 图书馆网站增强
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  javlibrary网站 增强内容包括：预览视频、在线播放、下载链接、预览图补全 etc.
// @author       https://greasyfork.org/zh-CN/users/25283
// @match        https://www.javlibrary.com/*
// @icon         https://www.javlibrary.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      cc3001.dmm.co.jp
// @connect      pics.dmm.co.jp
// @connect      www.dmm.com
// @connect      sukebei.nyaa.si
// @connect      missav.ws
// @connect      av-wiki.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535564/javlibrary%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/535564/javlibrary%20enhancement.meta.js
// ==/UserScript==
//在前人的基础上修改，增强内容包括：
//  1、首页热门影片预览图高度固定，在高分显示器上预览图太小了，放大画面的话就会显示不全，修改热门影片列表高度为自动。(建议在4K显示器放大画面设为175%或200%)
//  2、在影片页面封面图下方添加预览视频，预览不求人。为了减少流量，预览使用的是小尺寸的视频，如果你想看大尺寸的，点视频上方的预览清晰度链接，或者右键保存也行。
//  3、添加M3u8流媒体在线观看链接(如果有的话)。检测支持M3u8的播放器插件，如未安装则提醒，解决在线观看M3u8流媒体的难题。检测M3u8的代码使用的是"JavLibrary MissAV 早知道"插件的
//  4、如果图书馆的预览截图缺失，尝试重新补足 示例：REBD-669 和 ABF-226，切换插件开关可以看到效果。
//  5、如果你有下片时收藏封面图和预览图和预览视频的习惯，可以在浏览器扩展商店安装Chrono下载器插件，然后在预览图下方链接，右键可以批量保存预览图，省却你一张一张点的麻烦。
//  6、直接显示Sukebei.nyaa.si的搜索结果，在页内就可以直接下载影片。
//  7、将左侧导航栏和顶部Logo隐藏，并增加5项分类标签，方便直达特殊分类。
//本插件专注四项核心需求：预览视频、在线播放、下载链接、预览图补全，页面干净清爽，秒杀其他一堆乱七八糟功能搞得页面混乱不堪的脚本，请试着关闭其他脚本感受一下。
//尽量少修改页面元素，可以最大限度与其他脚本兼容。有疑问请站内私讯 Warma
//document.querySelector("div.col-md-3.info > ul").textContent.replaceAll(" ","").replaceAll("\n"," ")    //https://www.javbus.com/MGTD-052
//document.querySelector("#avatar-waterfall").textContent.replaceAll(" ","").replaceAll("\n"," ")
//document.querySelector("#sample-image-block")   //https://www.dmm.co.jp/rental/ppr/-/detail/=/cid=h_1711mgtd052r/
//document.querySelector("article > section > dl > dd:nth-child(8)").textContent      https://av-wiki.net/hrsm-106/
//document.getElementsByClassName("fa fa-tag")[0].parentNode.textContent      https://av-wiki.net/huntc-001/


(function () {
    'use strict';
const gmFetch = (url, { method, headers, anonymous } = {}) => new Promise((onload, onerror) => {GM_xmlhttpRequest({ url, method, headers, anonymous, onload, onerror })})
const parseHTML = (str) => {const tmp = document.implementation.createHTMLDocument();tmp.body.innerHTML = str; return tmp;}
//const check = async (src) => (await gmFetch(src, { method: 'HEAD' })).status === 200

function mainpage(){ // 优化首页显示效果
try{
    var leftmenu = document.querySelector("#leftmenu");
    var rightcolumn = document.querySelector("#rightcolumn");
    // 左边导航菜单增加几项分类
    const node = document.querySelector("#leftmenu > div > ul > li:nth-child(3)");
//console.log("node",node);
    node.insertAdjacentHTML('afterend', '<li><a href="vl_genre.php?g=aazq" style="color:red">漫改作品</a></li>')
    node.insertAdjacentHTML('afterend', '<li><a href="vl_genre.php?g=anbq" style="color:red">高品质VR</a></li>')
    node.insertAdjacentHTML('afterend', '<li><a href="vl_genre.php?g=aaua" style="color:red">新发行VR</a></li>')
    node.insertAdjacentHTML('afterend', '<li><a href="vl_genre.php?g=a5gq" style="color:red">介绍影片</a></li>')
    node.insertAdjacentHTML('afterend', '<li><a href="vl_genre.php?g=my" style = "color:red">新人亮相</a></li>')

    leftmenu.style.display='none'; // 隐藏左侧导航栏
//    document.querySelector("#toplogo").style.display='none'; // 隐藏LOGO
    rightcolumn.style.margin='0px 10px 10px 0px';
    var boxtitle = document.querySelector("#rightcolumn > div.boxtitle");
    if (!boxtitle) {const $position = document.querySelector("#video_title");
        const html = `<div class="boxtitle"><a onclick="leftmenu.style.display='inline-block';rightcolumn.style.margin='0px 10px 10px 180px';return false;"> &gt;&gt;&gt;<b style="color:red">显示</b>&lt;&lt;&lt; </a>左边导航菜单</div>`
        $position.insertAdjacentHTML('beforebegin', html);}
    else{boxtitle.innerHTML += '<a onclick="leftmenu.style.display=\'inline-block\';rightcolumn.style.margin=\'0px 10px 10px 180px\';return false;"> &gt;&gt;&gt;<b style="color:red">显示</b>&lt;&lt;&lt; </a>左边导航菜单';}
    var category = document.querySelector("#leftmenu > div > div.category");
    category.innerHTML += '<a onclick="leftmenu.style.display=\'none\';rightcolumn.style.margin=\'0px 10px 10px 0px\';return false;">　　　&gt;&gt;&gt;<b style="color:red">隐藏</b>&lt;&lt;&lt; </a>';
//console.log("boxtitle",boxtitle);

    document.querySelector("#rightcolumn > div.videothumblist").style.height = '100%'; // 首页热门影片高度自动调整
    document.querySelector("#leftmenu > div > ul:nth-child(2) > li:nth-child(2)").remove();
//    document.querySelector("head > style").innerHTML += ' .videothumblist .videos .video{display:inline-flex;height:auto} .videothumblist .videos .video .title{height:auto}'
    document.body.insertAdjacentHTML('afterend', '<style>.videothumblist .videos .video{display:inline-flex !important;height:auto !important} .videothumblist .videos .video .title{height:auto !important} </style>')

    // 删除首页底部的一长串介绍文字
    var elements = document.getElementsByClassName("about");
    var array = Array.from(elements); array.forEach(function (element) {element.remove();});
    return;
}catch (error) {console.error("首页效果错误",error);};
}mainpage()

try{ // 优化影片详情页显示效果
    var video_jacket_img = document.querySelector("#video_jacket_img"); if (!video_jacket_img) return;
//console.log("video_jacket_img",video_jacket_img);
    var imgpath = video_jacket_img.src.replace("so/","/").split('/')[6]; var imgpath1 = imgpath.substr(0,1); var imgpath3 = imgpath.length>5 ? imgpath.substr(0,3):imgpath.substr(0,2)+"0"; //例子：BeFree系列 bf728
    var imgpathrest = imgpath.substr(0,imgpath.length-3); var imgpathnum = imgpath.substr(imgpath.length-3,3); var imgpath00 = imgpathrest+'00'+imgpathnum
//console.log(imgpath, imgpath1, imgpath3, imgpathrest, imgpathnum,imgpath00)
    var avid = document.querySelector("head > meta[name=keywords]").content.split(", "); // 两种格式的番号：SONE-001，sone001 使用avid[0],avid[1]选择，未来扩展功能备用。
//console.log(avid)
    const $stylesheet = document.querySelector("head > link[rel=stylesheet]")
    const html = '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" type="text/css" rel="stylesheet">'
    $stylesheet.insertAdjacentHTML('afterend', html);
    document.querySelector("#video_id > table > tbody > tr > td.header").innerHTML += '<a href=\"https://123av.com/ja/search?keyword='+avid[0]+'\" title=\"搜索123AV\" target=\"sukebei\"><i class="fa fa-search"></i></a>'
    document.querySelector("#video_date > table > tbody > tr > td.header").innerHTML += '<a href=\"https://sukebei.nyaa.si/?q='+avid[0]+'\" title=\"搜索Sukebei\" target=\"sukebei\"><i class="fa fa-search"></i></a>'
    document.querySelector("#video_label > table > tbody > tr > td.header").innerHTML += '<a href=\"https://av-wiki.net/'+avid[0]+'/\" title=\"搜索AV-Wiki\" target=\"sukebei\"><i class="fa fa-search"></i></a>'
    document.querySelector("#video_maker > table > tbody > tr > td.header").innerHTML += '<a href=\"https://supjav.com/zh/?s='+avid[0]+'\" title=\"搜索SupJav\" target=\"sukebei\"><i class="fa fa-search"></i></a>'
    document.querySelector("#video_length > table > tbody > tr > td.header").innerHTML += '<a href=\"https://missav.ws/search/'+avid[0]+'\" title=\"搜索MissAV\" target=\"sukebei\"><i class="fa fa-search"></i></a>'
    document.querySelector("#video_director > table > tbody > tr > td.header").innerHTML += '<a href=\"https://www.javbus.com/'+avid[0]+'\" title=\"搜索JavBus\" target=\"sukebei\"><i class="fa fa-search"></i></a>'
    //const $position = document.querySelector("#video_favorite_edit");if (!$position) return;
    const $position = document.querySelector("#rightcolumn > hr");if (!$position) return;

    try{
    var imgjacket_tag = document.querySelectorAll('#rightcolumn > div.previewthumbs > a ');
    if (imgjacket_tag.length == 0) { // 如果预览图缺失，尝试补足 示例：REBD-937 和 ABF-226
        var thumbsrc = '';
        var thumbsrc00 = 'https://pics.dmm.co.jp/digital/video/'+imgpath00+'/'+imgpath00+'jp-1.jpg';
//      var thumbsrc00 = 'https://pics.dmm.co.jp/digital/video/h_346rebd00937/h_346rebd00937jp-1.jpg' 例子
//      var thumbsrc00 = 'https://pics.dmm.co.jp/digital/video/118abf226/118abf226jp-1.jpg' 例子
    const race = (promises) => {
        const newPromises = promises.map((p) => new Promise((resolve, reject) => p.then((v) => v && resolve(v), reject)));
        newPromises.push(Promise.all(promises).then(() => false));
        return Promise.race(newPromises)}
    const preview = async() => {
		const vpdm = async() => {var video1 = 'https://pics.dmm.co.jp/digital/video/'+imgpath+'/'+imgpath+'-1.jpg';
            try {
                const check = async (src) => (await gmFetch(src, { method: 'HEAD' })).status === 200
                if (await check(video1)) {return imgpath};} catch (error) {}
		}

        const vpdmm = async() => {var video2 = 'https://pics.dmm.co.jp/digital/video/'+imgpath00+'/'+imgpath00+'-1.jpg';
            try {
                const check = async (src) => (await gmFetch(src, { method: 'HEAD' })).status === 200
                if (await check(video2)) {return imgpath00};} catch (error) {}
        }

        let src = await race([vpdmm(), vpdm()])
        if (src){
        for (let i=1;i<=20;i++){ // 这里偷懒未做判断，直接显示20个预览图，所以有可能会有无效的预览图
                var thumbssrc ='https://pics.dmm.co.jp/digital/video/'+src+'/'+src+'jp-'+i+'.jpg'
                var thumbssrc2='https://pics.dmm.co.jp/digital/video/'+src+'/'+src+'-'+i+'.jpg'
                thumbsrc += '<a href="'+thumbssrc+'"><img width="120" height="90" border="0" src="'+thumbssrc2+'" ></a>';
            };
        try{document.querySelector("#rightcolumn > div.previewthumbs").remove();}catch (error) {}
        const html =`<div class="previewthumbs" style="display:block; margin:10px auto;"></div>`
        const $position = document.querySelector("#rightcolumn > div.socialmedia");
        $position.insertAdjacentHTML('afterend', html);
        document.querySelector("#rightcolumn > div.previewthumbs").innerHTML = thumbsrc;
        // 创建批量保存预览图的链接
        imgjacket_tag = document.querySelectorAll('#rightcolumn > div.previewthumbs > a');
        var imghref = 'https://pics.dmm.co.jp/digital/video/'+src+'/'+src+'jp-[1:20].jpg';
        const html1 =`<br> <a href=${imghref} onclick="return false;"> [右键用Chrono插件的菜单(链接另存为...)批量保存缩略图]</a> [预览补足]`;
        $position.insertAdjacentHTML('beforebegin', html1);
        document.querySelector("#rightcolumn > div.socialmedia").remove(); // 删除社交网站图标栏
    }}
    preview();
    }//待扩展
    else { // 创建批量保存预览图的链接
    var imghref = imgjacket_tag[imgjacket_tag.length-1].getAttribute('href'); imghref = imghref.replace('jp-','jp-[1:'); imghref = imghref.replace('.jpg','].jpg');
    const html =`<br> <a href=${imghref} onclick="return false;"> [右键用Chrono插件的菜单(链接另存为...)批量保存缩略图]</a>`;
    $position.insertAdjacentHTML('beforebegin', html);
    document.querySelector("#rightcolumn > div.socialmedia").remove(); // 删除社交网站图标栏
    }
    }catch (error) {console.error("预览补足错误",error);}

function detectExtension() { // 检测支持M3u8格式的播放器插件
    let img = new Image();
    img.src = "chrome-extension://eakdijdofmnclopcffkkgmndadhbjgka/icon128.png";
    img.onload = function () {
//        console.log("插件已存在");
    };
    img.onerror = function () {
        console.log("未找到插件");
        $position.insertAdjacentHTML('afterend', '<a href=https://chromewebstore.google.com/detail/eakdijdofmnclopcffkkgmndadhbjgka target=_blank><b style="color:red">未找到插件，点击安装M3u8在线播放插件</b></a> ');
    };
}

async function actress() {
    try{ console.log('actress')
        var cast = document.querySelector("#video_cast > table > tbody > tr > td.text");
        if(cast.childNodes.length == 0){
//          cast.innerHTML = '<iframe src="https://av-wiki.net/'+avid[0]+'/" width="200" height="100" scrolling="yes" allow="autoplay; fullscreen;" style="border:0;" id="av-wiki" name="av-wiki"></iframe>';
//  const actress3 = eval(actress1.responseText);
//console.log(actress1)
//  const actress2 = parseHTML(actress1.responseText);
//console.log(actress2)

        }
    }catch (error) {}

}

async function sukibeilinks() {
console.log("Sukibei")
try{ // 显示Sukebei的搜索结果磁力链
  const $position = document.querySelector("#videoimages");
console.log("position",$position)
  const res = await gmFetch(`https://sukebei.nyaa.si/?q=${avid[0]}`, {method: 'GET', anonymous: true, headers: {'Accept':'text/html,application/xhtml+xml,application/xml', 'User-Agent': 'Android'},});
  const sukebei = parseHTML(res.responseText).querySelector("body > div > div > table");
//console.log(sukebei)
  if (sukebei){
  var tds = sukebei.querySelectorAll("body > div > div > table > tbody > tr > td:nth-child(1)")
  var array = Array.from(tds);
  array.forEach(element => {element.remove();});
  sukebei.querySelector("body > div > div > table > thead > tr > th").remove()
  tds = sukebei.querySelectorAll("body > div > div > table > tbody > tr > td:nth-child(1) > a")
  array = Array.from(tds);
  array.forEach(element => {
      element.removeAttribute("href");
      element.innerHTML = element.innerHTML.toString().replace("中文","<b style='color:red;'>中文</b>");
      element.innerHTML = element.innerHTML.toString().replace("FHDC","FHDC<b style='color:red;'>中文字幕</b>");
  });
  tds = sukebei.querySelectorAll("body > div > div > table > tbody > tr > td:nth-child(2)")
  array = Array.from(tds);
  array.forEach(element => {element.innerHTML = element.innerHTML.toString().replace('/download', 'https://sukebei.nyaa.si/download');});
  $position.insertAdjacentHTML('beforebegin', "<table border='1'>"+sukebei.innerHTML+'</table><br>');
  }
}catch (error) {console.error("Sukebei搜索结果错误",error);}
}

try { // 尝试获取预览视频，使用iframe而不使用video是想要整合预览视频和在线播放M3u8在同一个页面框中，概念测试成功了，还没着手整合。 400*225
    const html = '<div id="video_webplayer" style="display:none;"><iframe src="" srcdoc="" width="576" height="324" scrolling="no" allow="autoplay; fullscreen;" style="border:0;" id="WebPlayer" name="WebPlayer"></iframe></div>'
        $position.insertAdjacentHTML('afterend', html);
    const race = (promises) => {
        const newPromises = promises.map((p) => new Promise((resolve, reject) => p.then((v) => v && resolve(v), reject)));
        newPromises.push(Promise.all(promises).then(() => false));
        return Promise.race(newPromises)}
    const preview = async() => {
		const vpdm = async() => {var video1 = 'https://cc3001.dmm.co.jp/litevideo/freepv/'+imgpath1+'/'+imgpath3+'/'+imgpath+'/'+imgpath+'_mhb_w.mp4'
console.log('vpdm',video1);
            try {
                const check = async (src) => (await gmFetch(src, { method: 'HEAD' })).status === 200
                if (await check(video1)) {return video1};} catch (error) {console.error(error);}
		}

        const vpdmm = async() => {var video2 = 'https://cc3001.dmm.co.jp/litevideo/freepv/'+imgpath1+'/'+imgpath3+'/'+imgpath00+'/'+imgpath00+'_mhb_w.mp4'
console.log('vpdmm',video2);
            try {
                const check = async (src) => (await gmFetch(src, { method: 'HEAD' })).status === 200
                if (await check(video2)) {return video2};} catch (error) {console.error(error);}
        }

        let src = await race([vpdmm(), vpdm()])
//console.log(src);
        if (src) document.querySelector("#video_webplayer").style.display = 'block';
            const dm = src.replace('mhb', 'dm') // 为了减少流量，预览默认使用的是小尺寸的视频，如果你想看大尺寸的，点视频上方的预览清晰度链接，或者右键保存也行。
            const mmb = src.replace('mhb', 'mmb')
            const hmb = src.replace('mhb', 'hmb')
            const hhb = src.replace('mhb', 'hhb')
            const MissAVcn = ""
            const MissAVcnT = "" //中文字幕
            const MissAVai = ""
            const MissAVaiT = "" //AI消码
            const MissAV = ""
            const MissAVT = "" //无字幕

            // 这句会静音自动播放，但是换清晰度后只有点视频的播放按钮才能控制
            document.querySelector("#WebPlayer").srcdoc = '<video controls="1" autoplay="1" muted name="media" width=100% height=100%><source src="'+mmb+'" type="video/mp4"></video>';
//            document.querySelector("#WebPlayer").src = dm; // 这句默认不会自动播放，但点击视频任何部分都可以控制
//        <a onclick='document.querySelector("#WebPlayer").width=160; document.querySelector("#WebPlayer").height=90;'  target="WebPlayer">1x</a>
//        <a onclick='document.querySelector("#WebPlayer").width=320; document.querySelector("#WebPlayer").height=180;'  target="WebPlayer">2x</a>
        const html = `预览清晰度:
        <a href=${mmb} onclick='document.querySelector("#WebPlayer").width=432; document.querySelector("#WebPlayer").height=243;' target="WebPlayer">432p</a>
        <a href=${src} onclick='document.querySelector("#WebPlayer").width=576; document.querySelector("#WebPlayer").height=324;' target="WebPlayer">576p</a>
        <a href=${hmb} onclick='document.querySelector("#WebPlayer").width=720; document.querySelector("#WebPlayer").height=405;' target="WebPlayer">720p</a>
        <a href=${hhb} onclick='document.querySelector("#WebPlayer").width=1152;document.querySelector("#WebPlayer").height=648;' target="WebPlayer">1080p</a> 　　　缩放画面(16:9)：
        <a onclick='document.querySelector("#WebPlayer").width=480; document.querySelector("#WebPlayer").height=270;'  target="WebPlayer">3x</a>
        <a onclick='document.querySelector("#WebPlayer").width=640; document.querySelector("#WebPlayer").height=360;'  target="WebPlayer">4x</a>
        <a onclick='document.querySelector("#WebPlayer").width=800; document.querySelector("#WebPlayer").height=450;'  target="WebPlayer">5x</a>
        <a onclick='document.querySelector("#WebPlayer").width=960; document.querySelector("#WebPlayer").height=540;'  target="WebPlayer">6x</a>
        <a onclick='document.querySelector("#WebPlayer").width=1280;document.querySelector("#WebPlayer").height=720;'  target="WebPlayer">8x</a>
        <a onclick='document.querySelector("#WebPlayer").width=1440;document.querySelector("#WebPlayer").height=810;'  target="WebPlayer">9x</a>
        <a onclick='document.querySelector("#WebPlayer").width=1600;document.querySelector("#WebPlayer").height=900;'  target="WebPlayer">10x</a>
        <a onclick='document.querySelector("#WebPlayer").width=1920;document.querySelector("#WebPlayer").height=1080;' target="WebPlayer">12x</a> 　　　` // 缩放画面配合在线播放使用，现阶段无大用。
// 　　　完整视频在线看:
//         <a onclick=\'document.getElementById("WebPlayer").src = \"${MissAVcn}\"; document.querySelector("#WebPlayer").width=852;document.querySelector("#WebPlayer").height=480;\' target="WebPlayer">${MissAVcnT}</a>
//         <a onclick=\'document.getElementById("WebPlayer").src = \"${MissAVai}\"; document.querySelector("#WebPlayer").width=852;document.querySelector("#WebPlayer").height=480;\' target="WebPlayer">${MissAVaiT}</a>
//         <a onclick=\'document.getElementById("WebPlayer").src = \"${MissAV}\";   document.querySelector("#WebPlayer").width=852;document.querySelector("#WebPlayer").height=480;\' target="WebPlayer">${MissAVT}</a>
        //const $position = document.querySelector('#video_favorite_edit');if (!$position) return;
        const $position = document.querySelector("#rightcolumn > hr");if (!$position) return;
        $position.insertAdjacentHTML('afterend', html)
        detectExtension()
    }
    preview()
} catch (error) {console.error("预览视频错误",error);}

//actress()
sukibeilinks()

}catch (error) {console.error(error);}


function M3u8() { // 获取在线观看的M3u8链接 thanks to https://sleazyfork.org/zh-CN/scripts/507734-javlibrary-missav-%E6%97%A9%E7%9F%A5%E9%81%93
    'use strict';
    // 常量定义
    const MISSAV_BASE_URL = 'https://missav.ws';
    const LINK_TYPES = {
        UNCENSORED: 'uncensored-leak',
        CHINESE: 'chinese-subtitle',
        REGULAR: ''
    };
    const COLORS = { // 无用但保留，将来移做他用
        UNCENSORED: 'green',
        CHINESE: 'orange',
        REGULAR: 'blue',
        M3U8: 'purple'
    };

    // 工具函数
    function extractLinks(responseText, avid) {
        const patterns = {
            uncensored: new RegExp(`<a[^>]*href="(${MISSAV_BASE_URL}/[^"]*${avid}-${LINK_TYPES.UNCENSORED})"[^>]*>`, 'i'),
            regular: new RegExp(`<a[^>]*href="(${MISSAV_BASE_URL}/(?:[a-z0-9]+/)?${avid})"[^>]*alt="${avid}"[^>]*>`, 'i'),
            chinese: new RegExp(`<a[^>]*href="(${MISSAV_BASE_URL}/[^"]*${avid}-${LINK_TYPES.CHINESE})"[^>]*>`, 'i'),
        };

        return {
            uncensored: responseText.match(patterns.uncensored)?.[1],
            regular: responseText.match(patterns.regular)?.[1],
            chinese: responseText.match(patterns.chinese)?.[1],
        };
    }

    async function processVideoLinks(links) {
        // 处理各种类型的链接
        const processLink = async (link, type, color) => {
        //const $position = document.querySelector('#video_favorite_edit');if (!$position) return;
        const $position = document.querySelector("#rightcolumn > hr");if (!$position) return;
            if (link) {

                // 获取并处理M3U8链接
                try {
                    const response = await new Promise((resolve, reject) => {GM_xmlhttpRequest({method: 'GET',url: link,onload: resolve,onerror: reject});});

                    if (response.status === 200) {
                        const evalLine = response.responseText
                            .split('\n')
                            .find(line => line.trim().startsWith('eval(function('));

                        if (evalLine) {
                            const decodedResult = new Function('return ' + evalLine.trim())();
//console.log("----------------decodedResult()",type,decodedResult)
                            if (typeof decodedResult === 'string' && decodedResult.endsWith('.m3u8')) {

                                const html = `<a href=${decodedResult} onclick='document.querySelector("#WebPlayer").width=432; document.querySelector("#WebPlayer").height=243;return false;' target="WebPlayer"> ${type} </a>`
                                $position.insertAdjacentHTML('afterend', html)
                            }
                        }
                    }
                } catch (error) {console.error('处理M3U8地址时出错:', error);}
            }
        };

        // 按顺序处理所有类型的链接

        await processLink(links.regular, '[有码] 　　　', COLORS.REGULAR);
        await processLink(links.uncensored, '[AI无码]', COLORS.UNCENSORED);
        await processLink(links.chinese, '[中文字幕]', COLORS.CHINESE);
        //const $position = document.querySelector('#video_favorite_edit');if (!$position) return;
        const $position = document.querySelector("#rightcolumn > hr");if (!$position) return;
        const html = ` M3u8<a href="${links.regular}" style="color:black" target="_blank">在线观看</a>链接: `
        $position.insertAdjacentHTML('afterend', html)

    }

    async function checkVideoAvailability(avid) {
        try {
            const response = await new Promise((resolve, reject) => {GM_xmlhttpRequest({method:'GET', url:"https://missav.ws/search/"+avid, onload:resolve, onerror:reject});});

            if (response.status !== 200) throw new Error(`HTTP错误: ${response.status}`);

            const isAvailable = response.responseText.includes("event: 'videoSearch'");
            const links = extractLinks(response.responseText, avid);

             if (isAvailable) {
                 await processVideoLinks(links);
             }
        } catch (error) {}
    }

    function displayMissAVLink() {
        const avid = document.querySelector("head > meta[name=keywords]").content.split(",")[0]
        checkVideoAvailability(avid);
    }

    // 等待页面加载完成后执行
//    window.addEventListener('load', displayMissAVLink);
    displayMissAVLink();
}

M3u8();
})();