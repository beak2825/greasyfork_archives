// ==UserScript==
// @name 猫源辅助解析实验班
// @description 把( 猫影视源 && 残影源 && 搜视源 && Free源 && 猴子脚本源 && 解析网站源 && js接口源 && 解析接口源)改造成 解析辅助脚本（爬虫功能只支持安装有（猴子插件）的浏览器 && 不支持订阅经过转换的 短链接 地址源）。
// @author 江小白
// @version 虎年养老版本1
// @homepage https://ceo30.coding.net/p/ceo30/d/ceo30/git/raw/master/222.user.js
// @include /^https?:\/\/(?:(?:www\.ixigua\.com\/|m\.ixigua\.com\/video\/)\d{10,}(?:\?id=\d{10,}|$)|(?:v(?:-wb)?|m)\.youku\.com\/.+?\/id_|www\.wasu\.cn\/[pP]lay\/show\/id\/\d|www\.miguvideo\.com\/.+?\/detail\.html\?cid=\d|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/(?:cover|page)|.+?\/p\/topic)\/|(?:3g|m)\.v\.qq\.com|w(?:ww)?\.mgtv\.com\/[a-z]\/|www\.mgtv\.com\/act\/|m\.mgtv\.com\/b\/|www\.iqiyi\.com\/(?:[vw]_|kszt\/)|m\.iqiyi\.com\/(?:v_|$)|tw\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|m\.tv\.sohu\.com\/(?:u\/|v|phone_play_film\?aid=)|film\.sohu\.com\/album\/|www\.le\.com\/ptv\/vplay\/|m\.le\.com\/vplay_|[vm]\.pptv\.com\/show\/|(?:vip|m)\.1905\.com\/(?:m\/vod|play)\/|www\.ixigua\.com\/|(?:player|live)\.bilibili\.com\/|www\.bilibili\.com\/(?:(?:cheese|bangumi)\/play|blackboard|.*?video)\/|m\.bilibili\.com\/bangumi\/play\/|www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|m\.acfun\.cn\/v\/|.+?(?:\.m(?:3u8|p4)\?\w+?=|(?:search|jx|url|id|v|&[^\/]+?|_\w+?|\.html\?\w+?)[&#=\?]https?(?::\/\/|%3A%2F%2F)[^\/]+?\.(?:youku|miguvideo|wasu|tudou|qq|mgtv|iqiyi|sohu|le|pptv|1905|bilibili|acfun|ixigua)\.))/
// @noframes
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @run-at document-body
// @namespace https://greasyfork.org/users/675587
// @downloadURL https://update.greasyfork.org/scripts/441907/%E7%8C%AB%E6%BA%90%E8%BE%85%E5%8A%A9%E8%A7%A3%E6%9E%90%E5%AE%9E%E9%AA%8C%E7%8F%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/441907/%E7%8C%AB%E6%BA%90%E8%BE%85%E5%8A%A9%E8%A7%A3%E6%9E%90%E5%AE%9E%E9%AA%8C%E7%8F%AD.meta.js
// ==/UserScript==


(function(){'use strict';if(self!=top){return false;}else{if(!document.querySelector("\u6c5f\u5c0f\u767d\u732b\u6e90\u63a5\u53e3")){document.head.appendChild(document.createElement("\u6c5f\u5c0f\u767d\u732b\u6e90\u63a5\u53e3"));if(location.href.match(/^https?:\/\/(?:(?:www\.ixigua\.com\/|m\.ixigua\.com\/video\/)\d{10,}(?:\?id=\d{10,}|$)|(?:v(?:-wb)?|m)\.youku\.com\/.+?\/id_|www\.wasu\.cn\/[pP]lay\/show\/id\/\d|www\.miguvideo\.com\/.+?\/detail\.html\?cid=\d|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/(?:cover|page)|.+?\/p\/topic)\/|(?:3g|m)\.v\.qq\.com|w(?:ww)?\.mgtv\.com\/[a-z]\/|www\.mgtv\.com\/act\/|m\.mgtv\.com\/b\/|www\.iqiyi\.com\/(?:[vw]_|kszt\/)|m\.iqiyi\.com\/(?:v_|$)|tw\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|m\.tv\.sohu\.com\/(?:u\/|v|phone_play_film\?aid=)|film\.sohu\.com\/album\/|www\.le\.com\/ptv\/vplay\/|m\.le\.com\/vplay_|[vm]\.pptv\.com\/show\/|(?:vip|m)\.1905\.com\/(?:m\/vod|play)\/|www\.ixigua\.com\/|(?:player|live)\.bilibili\.com\/|www\.bilibili\.com\/(?:(?:cheese|bangumi)\/play|blackboard|.*?video)\/|m\.bilibili\.com\/bangumi\/play\/|www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|m\.acfun\.cn\/v\/|.+?(?:\.m(?:3u8|p4)\?\w+?=|(?:search|jx|url|id|v|&[^\/]+?|_\w+?|\.html\?\w+?)[&#=\?]https?(?::\/\/|%3A%2F%2F)[^\/]+?\.(?:youku|miguvideo|wasu|tudou|qq|mgtv|iqiyi|sohu|le|pptv|1905|bilibili|acfun|ixigua)\.))/)){try{
/* ** 自定义修改 Josn 全局播放器地址 （必须是 https 类型）** */
let 电脑json全局播放器="https://api.ldjx.cc/wp-api/ifr.php?isDp=0&vid=";
let 手机json全局播放器="https://api.ldjx.cc/wp-api/ifr.php?isDp=0&vid=";
let 内置爬虫默认源地址="https://gitee.com/realyoyodadada/freed/raw/master/maoo.json";
/* *********填入想屏蔽的接口，屏蔽多个用 | 隔开************ */
let 全局自定义屏蔽接口=/(?:百域阁|无名)/i;
let 禁止爬虫的接口名称="全民解析|无名小站|视觉|月亮|高途|奈菲|(?:Json|瓜瓜)?免嗅|7k|m1907|Preference|.*?六神.*?|米侠|待添加";
let 禁止爬虫的接口域名关键字="xmflv|qianfreecloud|quanming|(?:youyitv|jiubojx|91jxs|7cyd|tv920|vodjx)\.|Demo";
/* ***************************************************** */
localStorage.setItem('电脑Json全局播放器',电脑json全局播放器);localStorage.setItem('手机Json全局播放器',手机json全局播放器);if(location.host.match(/(?:youku|miguvideo|wasu|tudou|qq|mgtv|iqiyi|sohu|le|pptv|1905|bilibili|acfun|ixigua)/)){function 自动点击(zdya,zdyb){try{if(!JSON.stringify(JSON.parse(localStorage.getItem('江小白自定义接口'))).match(/{[^}]*?vip\s*?(?:["']?\s*?)?:\s*?["']\s*?自动点击[^}]+?}\s*?,?/)){if(location.host.match(zdya)){sessionStorage.setItem('自定义点击接口',JSON.stringify(zdyb.split("|")));}}}catch(e){}};try{if(!JSON.stringify(JSON.parse(localStorage.getItem('江小白自定义接口'))).match(/{[^}]*?vip\s*?(?:["']?\s*?)?:\s*?["']\s*?自动点击[^}]+?}\s*?,?/)){
/* ********填入想自动点击的接口名称，多个接口用 | 隔开****** */
//写法例子：  自动点击('qq','腾讯|高天|扶风|牛逼|虾米|布米米');




/* ***************************** */}}catch(e){}let zdyjkb=[
/* *************** 以下自定义添加接口 ******************** */
//{name:"接口名称",url:"接口地址"},
{name:"淘影j",url:"https://www.vodjx.top/api/?key=XSQzk8KFK1I7FfPK5X&url=",json:"222",jj:"1",title:"此为json" }, 
{name:"淘影j",url:"https://svip.zny91.com/api/?key=Ch5ISkIKwp7nySjHwG&url=",json:"222",jj:"1",title:"此为json" },  
{name:"️json4",url:"https://www.vodjx.top/api/?key=XSQzk8KFK117FfPK5X8&urI=",json:"1",title:"此为json"},
{name:"json",url:"https://www.vodjx.top/api/?key=XSQzk8KFK117FfPK5X8&urI=",bfq:"https://api.jx.yh0523.cn/api/pgjx-1/dp.php?url=",json:"1",jj:"1",title:"此为json"},
{name:"json1",url:"https://json.xiongmiao888.cn/?url="},
{name:"测试1",url:"https://www.ddayh.com/jiexi/?url="},
{name:"测试2",url:"https://m.kuo2.cn/?url="},
{name:"爱解析",url:"https://jiexi.t7g.cn/?url="},
{name:"117",url:"https://1.api.80tvs.cn/?url="},
{name:"118",url:"https://1.bodada.cc/m3u8.php?url="},
{name:"119",url:"https://9kjx.com/?url="},
{name:"120",url:"https://aikan-tv.com/qy.php?url="},
{name:"121",url:"https://aikan-tv.com/tong.php?url="},
{name:"122",url:"https://ak.vipsli.com/ak/index.php?url="},
{name:"123",url:"https://api.52jiexi.top/?url="},
{name:"124",url:"https://api.78sy.cn/?url="},
{name:"125",url:"https://api.8bjx.cn/?url="},
{name:"126",url:"https://api.927jx.com/vip/?url="},
{name:"127",url:"https://api.baiyug.vip/index.php?url="},
{name:"128",url:"https://api.bbbbbb.me/jx/?url="},
{name:"129",url:"https://api.flvsp.com/?url="},
{name:"130",url:"https://api.jhdyw.vip/?url="},
{name:"131",url:"https://api.jhys.top/?url="},
{name:"132",url:"https://api.lhh.la/vip/?url="},
{name:"133",url:"https://api.lnwu.net/?url="},
{name:"134",url:"https://api.pangujiexi.com/player.php?url="},
{name:"135",url:"https://api.sigujx.com/?url="},
{name:"136",url:"https://api.sigujx.com/jx/?url="},
{name:"137",url:"https://api.smq1.com/?url="},
{name:"138",url:"https://api.steak517.top/?url="},
{name:"139",url:"https://api.sumingys.com/index.php?url="},
{name:"140",url:"https://api.tv920.com/vip/?url="},
{name:"141",url:"https://api.xumiaojx.com/index/?url="},
{name:"142",url:"https://api.xxctzy.com/leduoplayer/index.php?type=urlencode&url="},
{name:"143",url:"https://api.yueliangjx.com/?url="},
{name:"144",url:"https://buaon.xyz/?url="},
{name:"145",url:"https://cdn.yangju.vip/k/?url="},
{name:"146",url:"https://cdn.zyc888.top/?url="},
{name:"147",url:"https://chenluo2.chenluo.org/chenluocs1/?url="},
{name:"148",url:"https://cn.bjbanshan.cn/jx.php?url="},
{name:"149",url:"https://danmu.8old.cn/vip/?url="},
{name:"151",url:"https://dmjx.m3u8.tv/?url="},
{name:"154",url:"https://jiexi.8b5q.cn/player/jx.php?url="},
{name:"156",url:"https://jiexi.cjt521.com/?url="},
{name:"157",url:"https://jiexi.us/?url="},
{name:"158",url:"https://jiexi8.com/vip/index.php?url="},
{name:"159",url:"https://jqaaa.com/jx.php?url="},
{name:"160",url:"https://jsap.attakids.com/?url="},
{name:"161",url:"https://jx.000180.top/jx/?url="},
{name:"162",url:"https://jx.0135790.xyz/?url="},
{name:"163",url:"https://jx.0135790.xyz/dao/?url="},
{name:"164",url:"https://jx.116kan.com/?url="},
{name:"165",url:"https://jx.18mv.club/18mv.php?url="},
{name:"166",url:"https://jx.19jx.vip/?url="},
{name:"167",url:"https://jx.1ff1.cn/?url="},
{name:"168",url:"https://jx.4080jx.cc/?url="},
{name:"169",url:"https://jx.4kdv.com/?url="},
{name:"170",url:"https://jx.598110.com/index.php?url="},
{name:"171",url:"https://jx.618g.com/?url="},
{name:"172",url:"https://jx.973973.xyz/?url="},
{name:"173",url:"https://jx.ap2p.cn/?url="},
{name:"174",url:"https://jx.bwcxy.com/?v="},
{name:"175",url:"https://jx.dj6u.com/?url="},
{name:"176",url:"https://jx.dy-jx.com/?url="},
{name:"177",url:"https://jx.ejiafarm.com/dy.php?url="},
{name:"178",url:"https://jx.elwtc.com/vip/?url="},
{name:"179",url:"https://jx.ergan.top/?url="},
{name:"180",url:"https://jx.f41.cc/?url="},
{name:"181",url:"https://jx.fo97.cn/?url="},
{name:"182",url:"https://jx.hezeshi.net/ce/jlexi.php?url="},
{name:"183",url:"https://jx.idc126.net/jx/?url="},
{name:"184",url:"https://jx.ivito.cn/?url="},
{name:"185",url:"https://jx.jiubojx.com/vip.php?url="},
{name:"186",url:"https://jx.jjlrc.com/player/?url="},
{name:"187",url:"https://jx.kingtail.xyz/?url="},
{name:"188",url:"https://jx.km58.top/jx/?url="},
{name:"189",url:"https://jx.kt111.top/jx/mf/?url="},
{name:"190",url:"https://jx.lfeifei.cn/?url="},
{name:"191",url:"https://jx.m3u8.tv/jiexi/?url="},
{name:"192",url:"https://jx.mmkv.cn/tv.php?url="},
{name:"193",url:"https://jx.mw0.cc/?url="},
{name:"194",url:"https://jx.ns360.cn//qq/zonh2.php?url="},
{name:"195",url:"https://jx.quanmingjiexi.com/?url="},
{name:"196",url:"https://jx.rdhk.net/?v="},
{name:"197",url:"https://jx.wfy4.com/?url="},
{name:"198",url:"https://jx.wslmf.com/?url="},
{name:"199",url:"https://jx.wzslw.cn/?url="},
{name:"200",url:"https://jx.yimo520.com/?url="},
{name:"201",url:"https://jx.youyitv.com/?url="},
{name:"203",url:"https://jx13.omiys.com/?url="},
{name:"204",url:"https://lecurl.cn/?url="},
{name:"205",url:"https://m2090.com/?url="},
{name:"208",url:"https://okjx.cc/?url="},
{name:"211",url:"https://qian.wkfile.com/m3u8.php?url="},
{name:"221",url:"https://www.1717yun.com/jx/ty.php?url="},
{name:"222",url:"https://www.2692222.com/?url="},
{name:"223",url:"https://www.2ajx.com/vip.php?url="},
{name:"224",url:"https://www.33tn.cn/?url="},
{name:"227",url:"https://www.8090g.cn/?url="},
{name:"228",url:"https://www.91jxs.com/jiexi/?url="},
{name:"229",url:"https://www.administratorw.com/video.php?url="},
{name:"230",url:"https://www.ckmov.vip/api.php?url="},
{name:"231",url:"https://www.h8jx.com/jiexi.php?url="},
{name:"232",url:"https://www.hyxuanit.com/jx/?url="},
{name:"236",url:"https://www.kpezp.cn/jlexi.php?url="},
{name:"239",url:"https://www.nxflv.com/?url="},
{name:"240",url:"https://www.playm3u8.cn/jiexi.php?url="},
{name:"241",url:"https://www.qianyicp.com/jiexi/index.php?url="},
{name:"243",url:"https://www.xymav.com/?url="},
{name:"245",url:"https://z1.m1907.cn/?jx="},
{name:"253",url:"https://www.wocao.xyz/index.php?url="},
{name:"254",url:"https://660e.com/?url="},
{name:"283",url:"https://api.653520.top/vip/?url="},
{name:"289",url:"https://jx.iztyy.com/svip/?url="},
{name:"314",url:"https://www.kpezp.cn/jlexi.php?url="},
{name:"321",url:"https://cdn.yangju.vip/k/?url="},
{name:"328",url:"https://z1.m1907.cn/?jx="},
{name:"349",url:"https://jx.ivito.cn/?url="},
{name:"670",url:"https://video.isyour.love/Search/SearchJx?t=1632044144000&id="},
{name:"674",url:"https://jiexi.cjt521.com/?url="},
{name:"675",url:"https://wy.cjt521.com/?url="},
{name:"676",url:"https://jiexi2.cjt521.com/m3u8/?url="},
{name:"677",url:"https://jx.19jx.vip/?url="},
{name:"680",url:"https://jsap.ahfuqi.net/?url="},
{name:"685",url:"https://jiexi.us/?url="},
{name:"687",url:"https://jiexi.8b5q.cn/player/jx.php?url="},
{name:"698",url:"https://api.yatongle.com/?url="},
{name:"700",url:"https://api.qianhaijishi.net/?url="},
{name:"702",url:"https://api.leduotv.com/wp-api/ifr.php?vid="},
{name:"706",url:"https://api.1dior.cn/analysis/123/index.php?uid=1428&my=afkruDFIYZ&url="},
{name:"636",url:"https://vip.laobandq.com/jiexi.php?url="},
{name:"637",url:"https://vip.mpos.ren/v/?url="},
{name:"638",url:"https://vip.parwix.com:4433/player/?url="},
{name:"640",url:"https://www.1717yun.com/jx/ty.php?url="},
{name:"641",url:"https://www.33tn.cn/?url="},
{name:"643",url:"https://www.8090g.cn/?url="},
{name:"645",url:"https://www.ckmov.com/?url="},
{name:"646",url:"https://www.ckmov.vip/api.php?url="},
{name:"647",url:"https://www.ckplayer.vip/jiexi/?url="},
{name:"649",url:"https://www.gai4.com/?url="},
{name:"653",url:"https://www.ikukk.com/?ac=0&url="},
{name:"654",url:"https://www.ikukk.com/?ac=1&url="},
{name:"655",url:"https://www.ikukk.com/?ac=2&url="},
{name:"658",url:"https://www.kpezp.cn/jlexi.php?url="},
{name:"659",url:"https://www.nxflv.com/?url="},
{name:"660",url:"https://www.pangujiexi.cc/jiexi.php?url="},
{name:"661",url:"https://www.playm3u8.cn/jiexi.php?url="},
{name:"662",url:"https://www.qianyicp.com/jiexi/index.php?url="},
{name:"666",url:"https://z1.m1907.cn/?jx="},
{name:"667",url:"https://jx.xmflv.com/?url="},
{name:"573",url:"https://api.jiexi.la/?url="},
{name:"574",url:"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid="},
{name:"581",url:"https://api.vodjx.top/?url="},
{name:"582",url:"https://api.yueliangjx.com/?url="},
{name:"583",url:"https://bd.bdjxfw.com/?url="},
{name:"4kan",url:"https://v.ojbkjx.com/?url=",vip:"&next=//www.4kan.tv",jj:"1"},
{name:"589",url:"https://go.yh0523.cn/y.cy?url="},
{name:"591",url:"https://jiexi.janan.net/jiexi/?url="},
{name:"594",url:"https://jx.116kan.com/?url="},
{name:"598",url:"https://jx.618g.com/?url="},
{name:"600",url:"https://jx.99yyw.com/99/?url="},
{name:"601",url:"https://jx.ap2p.cn/?url="},
{name:"604",url:"https://jx.ergan.top/?url="},
{name:"607",url:"https://jx.ivito.cn/?url="},
{name:"608",url:"https://jx.lache.me/cc/?url="},
{name:"609",url:"https://jx.m3u8.tv/jiexi/?url="},
{name:"610",url:"https://jx.mw0.cc/?url="},
{name:"613",url:"https://jx.rdhk.net/?v="},
{name:"618",url:"https://jx.xiaolangyun.com/?url="},
{name:"620",url:"https://jx.yingxiangbao.cn/vip.php?url="},
{name:"624",url:"https://okjx.cc/?url="},
{name:"632",url:"https://vip.bljiex.com/?v="},
{name:"633",url:"https://vip.cjys.top/?url="},
{name:"561",url:"https://17kyun.com/api.php?url="},
{name:"562",url:"https://660e.com/?url="},
{name:"564",url:"https://api.0xu.cc/?url="},
{name:"501",url:"https://jx.jiubojx.com/vip.php?url="},
{name:"365",url:"https://www.sonimei.cn/?url="},
{name:"369",url:"http://api.tvznn.cn//svip//?url="},
{name:"15",url:"http://www.wmxz.wang/video.php?url="},
{name:"43",url:"http://api.xdiaosi.com/?url="},
{name:"44",url:"http://api.xfsub.com/index.php?url="},
{name:"47",url:"http://api.yueliangjx.com/?url="},
{name:"54",url:"http://bf.0135790.xyz/player/?url="},
{name:"110",url:"http://www.sfsft.com/admin.php?url="},
{name:"101",url:"http://www.2692222.com/?url="},
{name:"103",url:"http://www.2ajx.com/vip.php?url="},
{name:"105",url:"http://www.82190555.com/index/qqvod.php?url="},
{name:"112",url:"http://www.zuijuba.com/dp/?url="},
{name:"263",url:"http://17kyun.com/api.php?url="},
{name:"266",url:"http://czjx8.com/?url="},
{name:"267",url:"http://tv.wandhi.com/go.html?url="},
{name:"268",url:"http://okjx.cc/?url="},
{name:"275",url:"http://jx.52a.ink/?url="}, 
{name:"290",url:"http://jx.iztyy.com/svip/?url="},
{name:"316",url:"http://www.33tn.cn/?url="},
{name:"341",url:"http://www.1717yun.com/jx/ty.php?url="},
{name:"348",url:"http://www.wmxz.wang/video.php?url="},
{name:"354",url:"http://511xy.cc/jx?url="},
{name:"355",url:"http://www.82190555.com/video.php?url="},
{name:"356",url:"http://api.lexinys.com//vip//?url=%22"},
{name:"357",url:"http://jx.wfxzzx.cn/?url-="},
{name:"360",url:"http://z1.m1907.cn/?jx="},
{name:"15",url:"http://www.wmxz.wang/video.php?url="},
{name:"43",url:"http://api.xdiaosi.com/?url="},
{name:"44",url:"http://api.xfsub.com/index.php?url="},
{name:"47",url:"http://api.yueliangjx.com/?url="},
{name:"54",url:"http://bf.0135790.xyz/player/?url="},
{name:"110",url:"http://www.sfsft.com/admin.php?url="},
{name:"101",url:"http://www.2692222.com/?url="},
{name:"103",url:"http://www.2ajx.com/vip.php?url="},
{name:"105",url:"http://www.82190555.com/index/qqvod.php?url="},
{name:"112",url:"http://www.zuijuba.com/dp/?url="},  
{name:"668",url:"http://www.qianyicp.com/jiexi/index.php?url="},
{name:"669",url:"http://egwang186.gitee.io/?url="},
{name:"709",url:"http://www.wocao.xyz/index.php?url="},
{name:"710",url:"http://www.wanxun.vip/jiexi/?url="},
{name:"711",url:"http://www.pangujiexi.com/jiexi/?url="},
{name:"714",url:"http://www.jx4k.com/k.php?url="},
{name:"716",url:"http://www.ikukk.com/?url="},
{name:"717",url:"http://www.freeget.org/jx.php?url="},
{name:"719",url:"http://vip.wandhi.com/?v="},
{name:"722",url:"http://jx.xiaolangyun.com/?url="},
{name:"723",url:"http://jx.x-99.cn/api.php?id="},
{name:"724",url:"http://jx.sujx.top/jiexi.php/?url="},
{name:"725",url:"http://jx.rdhk.net/?v="},
{name:"726",url:"http://jx.quanmingjiexi.com/?url="},
{name:"729",url:"http://jx.ivito.cn/?url="},
{name:"730",url:"http://jx.hao-zsj.cn/vip/?url="},
{name:"731",url:"http://jx.973973.xyz/?url="},
{name:"kuai",url:"http://api.jhdyw.vip/?url="},
{name:"kuai1",url:"http://api.13tv.top/jiexi/?url="},
{name:"542",url:"http://okjx.cc/?url="},
{name:"544",url:"http://vip.kubear.cn/player.php?url="},
{name:"546",url:"http://www.97zxkan.com/jiexi/97zxkanapi.php?url="},
{name:"551",url:"http://www.bavei.com/vip3/?url="},
{name:"552",url:"http://www.sfsft.com/admin.php?url="},
{name:"554",url:"http://www.wmxz.wang/video.php?url="},
{name:"510",url:"http://api.bbbbbb.me/vip/?url="},
{name:"511",url:"http://api.bbbbbb.me/yun/?url="},
{name:"512",url:"http://api.lequgirl.com/?url="},
{name:"513",url:"http://api.nepian.com/ckparse/?url="},
{name:"514",url:"http://api.uuyingshi.com/?url="},
{name:"515",url:"http://api.wlzhan.com/sudu/?url="},
{name:"516",url:"http://api.xiuyao.me/jx/?url="},
{name:"517",url:"http://api.zihu.tv/zihuyun/ie.php?url="},
{name:"518",url:"http://app.baiyug.cn:2019/vip/index.php?url="},
{name:"519",url:"http://beaacc.com/api.php?url="},
{name:"520",url:"http://dm.nitian.info/?url="},
{name:"521",url:"http://dp.nitian.info/?url="},
{name:"522",url:"http://dy.ijvba.com/yznew/index.php?url="},
{name:"523",url:"http://dy.jiuli8.com/jiuli8/?url="},
{name:"524",url:"http://dy.jiuli8.com/yunparse/index.php?url="},
{name:"525",url:"http://jiexi.071811.cc/jx.php?url="},
{name:"526",url:"http://jqaaa.com/jx.php?url="},
{name:"527",url:"http://jx.598110.com/?url="},
{name:"528",url:"http://jx.598110.com/duo/index.php?url="},
{name:"529",url:"http://jx.598110.com/index.php?url="},
{name:"530",url:"http://jx.598110.com/zuida.php?url="},
{name:"503",url:"http://60jx.com/?url="},
{name:"504",url:"http://admin.vodjx.top/json.php?url="},
{name:"505",url:"http://admin.vodjx.top/json2.php?url="},





/* ***** 以下是爬虫功能，只支持安装（猴子插件）的浏览器 **** */
];try{let pbjk='{[^\{\}]*?"?\s*?(?:name\s*?"?[^\{\}]*?"\s*?(?:'+禁止爬虫的接口名称+')\s*?|url\s*?"?\s*?:\s*?"\s*?https?:\/\/[^\/]*?(?:'+禁止爬虫的接口域名关键字+')[^\/]*?\/[^"]*?)"[^\{\}]*?}\s*?,?';let mmdydz,mddy,mmdykg;mddy=GM_getValue("订阅源地址")==null||GM_getValue("订阅源地址")==undefined||GM_getValue("订阅源地址")=="";mmdykg=GM_getValue("猫源订阅开关")==null||GM_getValue("猫源订阅开关")==undefined||GM_getValue("猫源订阅开关")=="";if(mddy){mmdydz=内置爬虫默认源地址;}else{mmdydz=GM_getValue("订阅源地址");}let ceo;ceo=/ceo30\./;try{if(mmdykg){GM_registerMenuCommand("关闭---订阅源功能",function(){GM_setValue("猫源订阅开关","关闭");alert("已经关闭--订阅源功能");location.reload();},false);GM_registerMenuCommand("输入---订阅源地址",function(){javascript:(function(){let q=""+(window.getSelection?window.getSelection():document.getSelection?document.getSelection():document.selection.createRange().text);if(!q){if(mddy){q=prompt("输入订阅源链接地址:","");}else{q=prompt("输入订阅源链接地址:\n"+GM_getValue("订阅源地址"),"");}}if(q!=null){if(!q.match(/:\/\//)){setTimeout(function(){if(q.match(/^\s*?$/)){GM_setValue("订阅源地址",内置爬虫默认源地址);alert("订阅源地址\n已经自动为你恢复默认");location.reload();}else{alert("订阅源地址不合法");}},456);}else{if(q.match(ceo)){alert("\u8bf7\u8ba2\u9605\u5176\u4ed6\u6e90\u000a\n\u6b64\u6e90\u88ab\u4f5c\u8005\u7981\u6b62\u722c\u866b\u000a");}else{GM_xmlhttpRequest({url:q,onload:function(xmla){let xml=xmla.status;if(xml==200||xml=='200'){let xmlc=xmla.responseText.replace(/&\s*?nbsp\s*?;/ig,"").replace(/&\s*?[gl]t\s*?;/ig,"").replace(/\\\\\\/g,"").replace(/\\[a-tv-z]/g,"").replace(/(?:\\|\\\\\\)\//g,"/").replace(/\\"/g,"\"");if(!!xmlc){try{if(xmlc.match(/"[^\{\}]*?parses[^\{\}]*?"/i)){GM_setValue("订阅源地址",q);alert("猫影视源\n订阅源地址是：\n"+q);location.reload();}else if(xmlc.match(/解析：[^：]*?结束/m)){GM_setValue("订阅源地址",q);alert("残影源\n订阅地址是：\n"+q);location.reload();}else if(xmlc.match(/"\s*?analysisApi\s*?"\s*?:\s*?{\s*?"[^"]+?"\s*?:\s*?{[^}]*?"\s*?api\s*?"\s*?:\s*?"\s*?https?:\/\//i)){GM_setValue("订阅源地址",q);alert("搜视源\n订阅地址是：\n"+q);location.reload();}else if(xmlc.match(/"\s*?data\s*?"\s*?:\s*?[\s*?{[\S\s]*?"\s*?name\s*?"[\S\s]+?"\s*?url\s*?"\s*?:\s*?"\s*?https?:\/\//i)&&!xmlc.match(/\/\/\s*?=\s*?=\s*?UserScript\s*?=\s*?=/i)){GM_setValue("订阅源地址",q);alert("FreeD源\n订阅地址是：\n"+q);location.reload();}else if(xmlc.match(/=\s*?\[[^\]]*?name\s*?(?:["']?\s*?)?:\s*?["'][^"']+?["'][^}]*?,\s*?[^:]+?\s*?(?:["']?\s*?)?:\s*?["']\s*?https?:\/\/[^"']+?["']/i)){GM_setValue("订阅源地址",q);alert("猴子脚本源\n订阅地址是：\n"+q);location.reload();}else if(xmlc.match(/<select[^>]*?>[^<>]*?<option [^>]*?value\s*?=\s*?["']\s*?(?:(?:(?:https?:)?\/\/[^"']+?[\?=#]|aHR0c[^"']+?)\s*?)?["']/i)){GM_setValue("订阅源地址",q);alert("解析网站源\n订阅地址是：\n"+q);location.reload();}else if(xmlc.match(/[=:]\s*?\[\s*?{[^[^}]*?(?:url(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]+?(?:name|title)|(?:name|title)(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]+?url)(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]*?}\s*?,?/i)){GM_setValue("订阅源地址",q);alert("js接口源\n订阅地址是：\n"+q);location.reload();}else if(xmlc.match(/[=:]\s*?\[\s*?{[^[^}]*?(?:url(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]+?(?:name|title)|(?:name|title)(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]+?url)(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]*?}\s*?,?/i)){GM_setValue("订阅源地址",q);alert("js接口源\n订阅地址是：\n"+q);location.reload();}else if(xmlc.match(/(?<=<(?!a)[^>]+?>\s*?)<a [^>]*?(?:class|id|href)\s*?=\s*?["'](?:[^\(]+?\(['']?)?\s*?https?:\/\/[^"']+?[#\?=]\s*?["'][^>]*?>(?:<li [^>]+?>)?[\S\s]*?<\/a>(?=\s*?<\/)/i)&&!xmlc.match(/<option [^>]*?value\s*?=\s*?["']\s*?aHR0c[^"']*?["'][^>]*?>[^<]*?<\/option>/i)){GM_setValue("订阅源地址",q);alert("解析接口源\n订阅地址是：\n"+q);location.reload();}else{alert("订阅源地址不合法");}}catch(e){alert("订阅源地址不合法");}}}}});}}}})();},false);}else{GM_registerMenuCommand("开启--订阅源功能",function(){GM_deleteValue('猫源订阅开关');alert("已经开启--订阅源功能");location.reload();},false);}}catch(e){}try{if(mmdykg){if(!mmdydz.match(ceo)){GM_xmlhttpRequest({url:mmdydz,onload:function(axmla){try{let axml=axmla.status,mmaa=/\s*?parses\s*?"\s*?:\s*?(\[[\S\s]+?\])\s*?,\s*?["'][^"']+?"\s*?:\s*?\[/i,mmaaa=/"\s*?parses\s*?"\s*?:[^\]]+?并发[\S\s]+?"\s*?parses\s*?"\s*?:\s*?(\[[^\]]+?])/i,mmaaaa=/\s*?parses\s*?"\s*?:\s*?(\[[\S\s]+?\])\s*?,/i,mmbb=/{\s*?"\s*?name\s*?"\s*?:\s*?"\s*?Preference\s*?"[^\}]+?"\s*?url\s*?"\s*?:\s*?"([^"\}]+?)"\s*?}\s*?,?/i,mmcc=/解析：([^：]*?)结束/m,mmdd=/"\s*?analysisApi\s*?"\s*?:\s*?({[\S\s]+?})\s*?}\s*?,\s*?"/im,mmee=/"\s*?data\s*?"\s*?:\s*?([[\S\s]+?}\s*?])/i,mmff=/=\s*?\[([^\]]*?name\s*?(?:["']?\s*?)?:\s*?["'][^"']+?["'][^}]*?,\s*?[^:]+?\s*?(?:["']?\s*?)?:\s*?["']\s*?https?:\/\/[\S\s]+?)]\s*?;?/i,mmgg=/=\s*?\[[^\]]*?name\s*?(?:["']?\s*?)?:\s*?["'][^"']+?["'][^}]*?,\s*?[^:]+?\s*?(?:["']?\s*?)?:\s*?["'][\S\s]+?=\s*?\[([^\]]*?name\s*?(?:["']?\s*?)?:\s*?["'][^"']+?["'][^}]*?,\s*?[^:]+?\s*?(?:["']?\s*?)?:\s*?["']\s*?https?:\/\/[\S\s]+?)]\s*?;?/i,mmhh=/\}\s*?;?\s*?((?:\/[\S\s]+?\n)?\s*?自动点击\([\S\s]+?\)\s*?;?)\s*?(?:\/(?![^\/]+?其他)[^\/]|(?:var|let|const)\s)/i,mmii=/<select[^>]*?>[^<>]*?\s*?(<option value\s*?=\s*?["']\s*?(?:https?:)?\/\/[^"']+?[\?=#]["'][\S\s]+?)\s*?<\/(?:div|select)>/i,mmiii=/<select[^>]*?>[\S\s]*?\s*?(<option value\s*?=\s*?["']\s*?aHR0c[^"']+?["'][\S\s]+?)\s*?<\/(?:div|select)>/i,mmll=/[=:]\s*?(\[\s*?{[^[^}]*?(?:url(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]+?(?:name|title)|(?:name|title)(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]+?url)(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]*?}\s*?,?[\S\s]+?}\s*?,?)(?:(?<=\}\s*?,?)\s*?\/\/[^\n]+?\n|\s*?\/\s*?\*[^\/]+?\*\s*?\/\s*?(?:\n)?)?\s*?]/i,mmjj=/(?<=<(?!a)[^>]+?>\s*?)(<a [^>]*?(?:class|id|href)\s*?=\s*?["'](?:[^\(]+?\(['']?)?\s*?https?:\/\/[^"']+?[#\?=]\s*?["'][^>]*?>(?:<li [^>]+?>)?[\S\s]*?<\/a>)(?=\s*?<\/)/i;let sza,aza,mma,mmb,amma,bmmb;try{if(axml==200||axml=='200'){try{let axmlc=axmla.responseText.replace(/&\s*?nbsp\s*?;/ig,"").replace(/&\s*?[gl]t\s*?;/ig,"").replace(/\\\\\\/g,"").replace(/\\[a-tv-z]/g,"").replace(/(?:\\|\\\\\\)\//g,"/").replace(/\\"/g,"\"");try{if(!!axmlc){try{if(axmlc.match(mmaa)||axmlc.match(mmaaaa)){try{try{if(axmlc.match(mmaaa)){mma=axmlc.match(mmaaa)[1];}else if(axmlc.match(mmaa)){mma=axmlc.match(mmaa)[1];}else{mma=axmlc.match(mmaaaa)[1];}}catch(e){mma=axmlc.match(mmaa)[1];}amma=mma
/* ***************( 猫影视源 )**改造接口***************** */
.replace(/{[^}]*?["']?\s*?url(?:\s*?["'])?\s*?:\s*?["']\s*?Demo\s*?["'][^}]*?}\s*?,?/mg,'\n')
.replace(/{[^\{\}]*?"\s*?url\s*?"\s*?:\s*?"Parallel\s*?"[^\{\}]*?}(\s*?,?)/img,'{name:"Json并发",vip:"Json并发",jxb:"原",zd:"1",qp:"1",jj:"1",diy:"cyan",title:"随机-获取 Json接口 数据"}$1')
.replace(/{[^\{\}]*?"\s*?url\s*?"\s*?:\s*?"Sequence\s*?"[^\{\}]*?}(\s*?,?)/img,'{name:"Json轮询",vip:"Json轮询",jxb:"原",zd:"1",qp:"1",jj:"1",diy:"cyan",title:"依序-获取 Json接口 数据"}$1')
.replace(/{[^\{\}]*?"\s*?url\s*?"\s*?:\s*?"Preference\s*?"[^\{\}]*?}(\s*?,?)/img,'{name:"自动点击",vip:"自动点击",jxb:"原",zd:"1",qp:"1",jj:"1",diy:"cyan",j:"电脑",sj:"0",title:"根据 自定义设置 的 解析接口数组，进行 自动点击接口"}$1')
.replace(/"\s*?type\s*?"\s*?:\s*?1([^\{\}]*?,)?/img,'jxb:"原",ds:"5",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99",lx:"1",title:"来自爬虫"$1')
.replace(/"\s*?type\s*?"\s*?:\s*?0([^\{\}]*?,)?/img,'jxb:"原",zd:"1",qp:"1",jj:"1",diy:"yellow",kj:"1",sj:"0",title:"来自爬虫"$1')
.replace(/({(?![^}]*?"\s*?type\s*?")\s*?"\s*?name\s*?"\s*?:\s*?"([^"]+?)"\s*?,\s*?"\s*?url\s*?":\s*?"https:\/\/[^"]+?"\s*?)}/img,'$1,jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",title:"来自爬虫"}')
.replace(/({(?![^}]*?"\s*?type\s*?")\s*?"\s*?name\s*?"\s*?:\s*?"([^"]+?)"\s*?,\s*?"\s*?url\s*?":\s*?"http:\/\/[^"]+?"\s*?)}/img,'$1,jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",sj:"0",title:"来自爬虫"}')
.replace(/\[\s*?"\s*?name\s*?"\s*?:\s*?"\s*?([^"]+?)\s*?"[^}]*?"\s*?url\s*?"\s*?:\s*?"\s*?(https:\/\/[^"]+?)\s*?"[^}]*?}/img,'[{name:"$1",url:"$2",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",title:"来自爬虫"}')
.replace(/\[\s*?"\s*?name\s*?"\s*?:\s*?"\s*?([^"]+?)\s*?"[^}]*?"\s*?url\s*?"\s*?:\s*?"\s*?(http:\/\/[^"]+?)\s*?"[^}]*?}/img,'[{name:"$1",url:"$2",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",sj:"0"},title:"来自爬虫"')
.replace(/,(?:\s*?["'])?\s*?ext(?:\s*?["'])?\s*?:\s*?{(?:\s*?["'])?\s*?flag(?:\s*?["'])?\s*?:\s*?\[[^\]]*?\]\s*?,?/mg,'},')
.replace(/["']\s*?[a-z]\s*?["']\s*?:\s*?(?:[^"']+?|["'][^}]+?["'])(?:,|(?=}))/mg,'')
/* ***************************************************** */
.replace(/(}\s*?,?)\s*?\/\/{[^}]*?}\s*?,?/mg,'$1').replace(/(?:{\s*?){1,}{/mg,'{').replace(/(?:}\s*?,?){1,}\s*?}\s?,\s*?{/mg,'{').replace(/\}\s*?(?:,\s*?)?#[^\n]*?\n\s*?/mg,'},\n').replace(/\s*?\/\s*?\*[^\/]+?\*\s*?\/\s*?(?:\n)?/mg,'\n').replace(/(?:}\s*?,\s*?){1,}}\s*?,/mg,'},').replace(/}\s*?,\s*?}{1,}/mg,'},').replace(/(["'])\s*?({\s*?(?:["']\s*?)?name)/mg,'$1},$2').replace(/(?:,\s*?){1,},/mg,',').replace(new RegExp(pbjk,'img'),'');try{if(mma.match(mmbb)){try{if(!mma.match(/\/\/\s*?{/)){if(mma.match(/\|\|/)){mmb=mma.match(mmbb)[1].replace(/\$\$/g,'|');
/* ************( 猫影视源 )**瓜瓜优选改造**************** */
if(mmb.match(/qq#/ig)){eval(自动点击('qq',mmb.replace(/^(?:[^\]]*?)?qq#([^\]]+?)(?:\|\|[^\]]*)$/i,'$1')));}
else if(mmb.match(/mg#/ig)){eval(自动点击('mgtv',mmb.replace(/^(?:[^\]]*?)?mg#([^\]]+?)(?:\|\|[^\]]*)$/i,'$1')));}
else if(mmb.match(/qy#/ig)){eval(自动点击('iqiyi',mmb.replace(/^(?:[^\]]*?)?qy#([^\]]+?)(?:\|\|[^\]]*)$/i,'$1')));}
else if(mmb.match(/yk#/ig)){eval(自动点击('youku',mmb.replace(/^(?:[^\]]*?)?yk#([^\]]+?)(?:\|\|[^\]]*)$/i,'$1')));}
else if(mmb.match(/bl#/ig)){eval(自动点击('bilibili',mmb.replace(/^(?:[^\]]*?)?bl#([^\]]+?)(?:\|\|[^\]]*)$/i,'$1')));}
else if(mmb.match(/le#/ig)){eval(自动点击('le',mmb.replace(/^(?:[^\]]*?)?le#([^\]]+?)(?:\|\|[^\]]*)$/i,'$1')));}
else if(mmb.match(/pp#/ig)){eval(自动点击('pptv',mmb.replace(/^(?:[^\]]*?)?pp#([^\]]+?)(?:\|\|[^\]]*)$/i,'$1')));}
else if(mmb.match(/sh#/ig)){eval(自动点击('sohu',mmb.replace(/^(?:[^\]]*?)?sh#([^\]]+?)(?:\|\|[^\]]*)$/i,'$1')));}
else if(mmb.match(/xg#/ig)){eval(自动点击('xigua',mmb.replace(/^(?:[^\]]*?)?xg#([^\]]+?)(?:\|\|[^\]]*)$/i,'$1')));}
else if(mmb.match(/migu#/ig)){eval(自动点击('migu',mmb.replace(/^(?:[^\]]*?)?migu#([^\]]+?)(?:\|\|[^\]]*)$/i,'$1')));}
else if(mmb.match(/1905#/ig)){eval(自动点击('1905',mmb.replace(/^(?:[^\]]*?)?1905#([^\]]+?)(?:\|\|[^\]]*)$/i,'$1')));}
else if(mmb.match(/ac#/ig)){eval(自动点击('acfun',mmb.replace(/^(?:[^\]]*?)?ac#([^\]]+?)(?:\|\|[^\]]*)$/i,'$1')));}
/* ***************************************************** */
}}}catch(e){}}}catch(e){}let sza="aza="+amma+";";eval(sza);localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb.concat(aza)));}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}else if(axmlc.match(mmcc)){try{mma=axmlc.match(mmcc)[1];amma=mma.replace(/\n/g,'[').replace(/\[\s*?$/g,']')
/* ***************( 残影源 )**改造接口******************* */
.replace(/\[\s*?([^,]+?)[,，]\s*?(https?:\/\/[^\]]+?)\s*?\[/mg,'{name:"$1",url:"$2",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",sj:"0",title:"来自爬虫"},[')
.replace(/\[\s*?([^,]+?)[,，]\s*?(https?:\/\/[^\{]+?)\s*?{/mg,'{name:"$1",url:"$2",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",sj:"0",title:"来自爬虫"},{')
.replace(/},\s*?\[\s*?([^,]+?),\s*?(https?:\/\/[^\]]+?)\s*?\]/mg,'},{name:"$1",url:"$2",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",sj:"0",title:"来自爬虫"},]')
.replace(/{name:"([^"]+?)",url:"([^\[}]+?)\s*?\[/mg,'{name:"$1",url:"$2",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",sj:"0",title:"来自爬虫"},{')
.replace(/},\s*?{\s*?([^,]+?)\s*?,\s*?(https?:\/\/[^"]+?)"/mg,'},{name:"$1",url:"$2"')
/* ***************************************************** */
.replace(/^\s*?{name:/g,'[{name:').replace(/(}\s*?,?)\s*?\/\/{[^}]*?}\s*?,?/mg,'$1').replace(/(?:{\s*?){1,}{/mg,'{').replace(/(?:}\s*?,?){1,}\s*?}\s?,\s*?{/mg,'{').replace(/(?:}\s*?,\s*?){1,}}\s*?,/mg,'},').replace(/(?:,\s*?){1,},/mg,',').replace(new RegExp(pbjk,'img'),'');let sza="aza="+amma+";";eval(sza);localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb.concat(aza)));}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}else if(axmlc.match(mmdd)){try{mma=axmlc.match(mmdd)[1];amma=mma.replace(/"\s*?support\s*?"\s*?:\s*?\[[^\]]*?\]\s*?,?/img,'')
/* ***************( 搜视源 )**改造接口******************* */
.replace(/"([^"]+?)"\s*?:\s*?{\s*?"\s*?api\s*?"\s*?:\s*?"\s*?(https:\/\/[^"]*?)"[^}]*?}/img,'{name:"$1",url:"$2",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",title:"来自爬虫"}')
.replace(/"([^"]+?)"\s*?:\s*?{\s*?"\s*?api\s*?"\s*?:\s*?"\s*?(http:\/\/[^"]*?)"[^}]*?}/img,'{name:"$1",url:"$2",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",sj:"0",title:"来自爬虫"}')
/* ***************************************************** */
.replace(/{\s*?{/img,'{').replace(/(?:}\s*?,?){1,}\s*?}\s?,\s*?{/mg,'{').replace(/(?:}\s*?,\s*?){1,}}\s*?,/mg,'},').replace(/(?:,\s*?){1,},/mg,',').replace(new RegExp(pbjk,'img'),'');let sza="aza=["+amma+"];";eval(sza);localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb.concat(aza)));}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}else if(axmlc.match(/"\s*?data\s*?"\s*?:\s*?[\s*?{[\S\s]*?"\s*?name\s*?"[\S\s]+?"\s*?url\s*?"\s*?:\s*?"\s*?https?:\/\//i)&&!axmlc.match(/\/\/\s*?=\s*?=\s*?UserScript\s*?=\s*?=/i)&&!axmlc.match(/[=:]\s*?\[\s*?{[^[^}]*?(?:url(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]+?(?:name|title)|(?:name|title)(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]+?url)(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]*?}\s*?,?/i)){try{mma=axmlc.match(mmee)[1];amma=mma
/* ***************( Free源 )**改造接口******************* */
.replace(/{[^}]*?"\s*?name\s*?"\s*?:\s*?"\s*?([^"]+?)\s*?"[^}]+?"\s*?url\s*?"\s*?:\s*?"\s*?(https:\/\/[^}]+?)"[^}]*?}/img,'{name:"$1",url:"$2",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",title:"来自爬虫"}')
.replace(/{[^}]*?"\s*?name\s*?"\s*?:\s*?"\s*?([^"]+?)\s*?"[^}]+?"\s*?url\s*?"\s*?:\s*?"\s*?(http:\/\/[^}]+?)"[^}]*?}/img,'{name:"$1",url:"$2",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",sj:"0",title:"来自爬虫"}')
/* ***************************************************** */
.replace(/(}\s*?,?)\s*?\/\/{[^}]*?}\s*?,?/mg,'$1').replace(/(?:{\s*?){1,}{/mg,'{').replace(/(?:}\s*?,?){1,}\s*?}\s?,\s*?{/mg,'{').replace(/(?:}\s*?,\s*?){1,}}\s*?,/mg,'},').replace(/(?:,\s*?){1,},/mg,',').replace(new RegExp(pbjk,'img'),'');let sza="aza="+amma+";";eval(sza);localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb.concat(aza)));}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}else if(axmlc.match(/=\s*?\[[^\]]*?name\s*?(?:["']?\s*?)?:\s*?["'][^"']+?["'][^}]*?,\s*?[^:]+?\s*?(?:["']?\s*?)?:\s*?["']\s*?https?:\/\/[^"']+?["']/i)){try{try{if(axmlc.match(mmgg)){mma=axmlc.match(mmgg)[1];}else{mma=axmlc.match(mmff)[1];}}catch(e){mma=axmlc.match(mmff)[1];}amma=mma
/* ***************( 猴子脚本源 )**改造接口**************** */
.replace(/{(?![^}]*?url["']?\s*?:)name["']?\s*?:\s*?["']\s*?([^"']*?)\s*?["']\s*?,[^:]+?\s*?:\s*?["']\s*?((?:aHR0cHM|https(?::\/\/|%3A%2F%2F))[^"'']+?)["'][^}]*?}/img,'{name:"$1",url:"$2",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",title:"来自爬虫"}')
.replace(/{(?![^}]*?url["']?\s*?:)name["']?\s*?:\s*?["']\s*?([^"']*?)\s*?["']\s*?,[^:]+?\s*?:\s*?["']\s*?((?:aHR0cDo|http(?::\/\/|%3A%2F%2F))[^"'']+?)["'][^}]*?}/img,'{name:"$1",url:"$2",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",sj:"0",title:"来自爬虫"}')
.replace(/\s*?\/\s*?\*[^\/]+?\*\s*?\/\s*?(?:\n)?/mg,'\n')
.replace(/\s*?\/\/[^{]*\s*?{[^}]*?vip\s*?(?:["']?\s*?)?:\s*?["']\s*?自动点击[^}]+?}\s*?,?/mg,'\n')
/* ***************************************************** */
.replace(/(}\s*?,?)\s*?\/\/{[^}]*?}\s*?,?/mg,'$1').replace(/(?:{\s*?){1,}{/mg,'{').replace(/(?:}\s*?,?){1,}\s*?}\s?,\s*?{/mg,'{').replace(/(?:}\s*?,\s*?){1,}}\s*?,/mg,'},').replace(/(?:,\s*?){1,},/mg,',').replace(new RegExp(pbjk,'img'),'');let sza="aza=["+amma+"];";eval(sza);localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb.concat(aza)));}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}try{if(axmlc.match(mmhh)&&amma.match(/{[^}]*?vip\s*?(?:["']?\s*?)?:\s*?["']\s*?自动点击[^}]+?}\s*?,?/)){try{mmb=axmlc.match(mmhh)[1];bmmb=mmb
/* *************( 猴子脚本源 )**自动点击改造************** */
.replace(/\s*?\/\s*?\*[^\/]+?\*\s*?\/\s*?(?:\n)?/mg,'\n')
/* ***************************************************** */
eval(bmmb);}catch(e){}}}catch(e){}}else if(axmlc.match(/<select[^>]*?>[^<>]*?<option [^>]*?value\s*?=\s*?["']\s*?(?:(?:(?:https?:)?\/\/[^"']+?[\?=#]|aHR0c[^"']+?)\s*?)?["']/i)){try{if(axmlc.match(mmii)){mma=axmlc.match(mmii)[1];amma=mma
/* ***************( 解析网站源-A )**改造接口************** */
.replace(/<\/option>[\S\s]*?<option/img,'</option>\n<option')
.replace(/<(?![^>]*?value\s*?=)option[^>]*?>[^<>]+?<\/option>/img,'')
.replace(/<option [^>]*?value\s*?=\s*?["']?\s*?https?\/[^"']+?["'][^>]*?>[^<>]+?<\/option>/img,'')
.replace(/<option [^>]*?value\s*?=\s*?["']?\s*?(\/\/[^"']+?)\s*?["'][^>]*?>\s*?([^<>]+?)\s*?<\/option>/img,'{name:"$2",url:"http:$1",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",title:"来自爬虫"},')
.replace(/<option [^>]*?value\s*?=\s*?["']?\s*?(https?:\/\/[^"']+?)\s*?["'][^>]*?>\s*?([^<>]+?)\s*?<\/option>/img,'{name:"$2",url:"$1",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",title:"来自爬虫"},')
.replace(/(name|url|tite)\s*?:*?["']\s*?\s+?([^\s]+?)["']/img,'$1:"$2"')
.replace(/<option[^>]*?>[^<]*?<\/option>/mg,'},').replace(/}\s*?,\s*?<\w+?>/mg,'},').replace(/(}\s*?,?)\s*?\/\/{[^}]*?}\s*?,?/mg,'$1').replace(/(?:{\s*?){1,}{/mg,'{').replace(/(?:}\s*?,?){1,}\s*?}\s?,\s*?{/mg,'{').replace(/(?:}\s*?,\s*?){1,}}\s*?,/mg,'},').replace(/(?:,\s*?){1,},/mg,',').replace(new RegExp(pbjk,'img'),'');}else{mma=axmlc.match(mmiii)[1];amma=mma
/* ***************( 解析网站源-B )**改造接口************** */
.replace(/<option [^>]*?value\s*?=\s*?["']\s*?((?:aHR0cHM|https(?::\/\/|%3A%2F%2F))[^"']+?)\s*?["'][^>]*?>\s*?([^<]+?)\s*?<\/option>/img,'{name:"$2",url:"$1",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",title:"来自爬虫"},')
.replace(/<option [^>]*?value\s*?=\s*?["']\s*?((?:aHR0cDo|http(?::\/\/|%3A%2F%2F))[^"']+?)\s*?["'][^>]*?>\s*?([^<]+?)\s*?<\/option>/img,'{name:"$2",url:"$1",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",sj:"0",title:"来自爬虫"},')
/* ***************************************************** */
}let sza="aza=["+amma+"];";eval(sza);localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb.concat(aza)));}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}else if(axmlc.match(/[=:]\s*?\[\s*?{[^[^}]*?(?:url(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]+?(?:name|title)|(?:name|title)(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]+?url)(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]*?}\s*?,?/i)&&!axmlc.match(/"[^\{\}]*?parses[^\{\}]*?"/i)){try{mma=axmlc.match(mmll)[1];amma=mma.replace(/\[\s*?{/mg,'{')
/* *****************( js接口源 )**改造接口*************** */
.replace(/{[^[^}]*?url(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]+?(?:name|title)(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]*?}\s*?(,)?/img,'{name:"$2",url:"$1",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",title:"来自爬虫"}$3')
.replace(/{[^[^}]*?(?:name|title)(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]*?url(?:\s*?["'])?\s*?:\s*?["']\s*?([^"']+?)\s*?["'][^}]*?}\s*?(,)?/img,'{name:"$1",url:"$2",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",title:"来自爬虫"}$3')
/* ***************************************************** */
.replace(/(}\s*?,?)\s*?\/\/{[^}]*?}\s*?,?/mg,'$1').replace(/(?:{\s*?){1,}{/mg,'{').replace(/(?:}\s*?,?){1,}\s*?}\s?,\s*?{/mg,'{').replace(/(?:,\s*?){1,},/mg,',').replace(new RegExp(pbjk,'img'),'');let sza="aza=["+amma+"];";eval(sza);localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb.concat(aza)));}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}else if(axmlc.match(/(?<=<(?!a)[^>]+?>\s*?)<a [^>]*?(?:class|id|href)\s*?=\s*?["'](?:[^\(]+?\(['']?)?\s*?https?:\/\/[^"']+?[#\?=]\s*?["'][^>]*?>(?:<li [^>]+?>)?[\S\s]*?<\/a>(?=\s*?<\/)/i)&&!xmlc.match(/<option [^>]*?value\s*?=\s*?["']\s*?aHR0c[^"']*?["'][^>]*?>[^<]*?<\/option>/i)){try{mma=axmlc.match(mmjj)[1];amma=mma
/* ****************( 解析接口源 )**改造接口*************** */
.replace(/<a [^>]*?(?:class|id|href)\s*?=\s*?["'](?:[^\(]+?\(['']?)?\s*?(https?:\/\/[^"']+?[#\?=])(?:[^"']+?|\s*?)["'][^>]*?>(?:<\w+? [^>]+?>)?\s*?([^<]+?)\s*?(?:<\/\w+?>\s*?)?<\/a>/img,'{name:"$2",url:"$1",jxb:"原",zd:"1",qp:"1",jj:"1",kj:"1",title:"来自爬虫"},')
/* ***************************************************** */
.replace(/(}\s*?,?)\s*?\/\/{[^}]*?}\s*?,?/mg,'$1').replace(/(?:{\s*?){1,}{/mg,'{').replace(/(?:}\s*?,?){1,}\s*?}\s?,\s*?{/mg,'{').replace(/(?:,\s*?){1,},/mg,',').replace(/(?:}\s*?,\s*?){1,}}\s*?,/mg,'},').replace(new RegExp(pbjk,'img'),'');let sza="aza=["+amma+"];";eval(sza);localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb.concat(aza)));}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}
/* ***************************************************** */
}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}else{localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}else{localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}});}else{alert("\u8bf7\u8ba2\u9605\u5176\u4ed6\u6e90\u000a\n\u6b64\u6e90\u88ab\u4f5c\u8005\u7981\u6b62\u722c\u866b\u000a");}}else{localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}}catch(e){localStorage.setItem('江小白猫源接口',JSON.stringify(zdyjkb));}try{let zdyjkpbobj=setInterval(()=>{try{if(document.querySelector("ul#httpsvipul>li:last-of-type")){const zdyjkpb=document.querySelectorAll('ul#httpsvipul>li');for(let zdyjkpbi=0;zdyjkpbi<zdyjkpb.length;zdyjkpbi++){const zdyjkpbmsa=zdyjkpb[zdyjkpbi].querySelectorAll('a4');for(let zdyjkpbia=0;zdyjkpbia<zdyjkpbmsa.length;zdyjkpbia++){if(zdyjkpbmsa[zdyjkpbia].innerText.match(全局自定义屏蔽接口)){zdyjkpb[zdyjkpbi].setAttribute('style','display:none!important');}};};clearInterval(zdyjkpbobj);}else{}}catch(e){clearInterval(zdyjkpbobj);}},1432.1);}catch(e){}}}catch(e){return false;}}}else{return false;}}})();