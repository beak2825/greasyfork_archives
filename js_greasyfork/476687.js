// ==UserScript==
// @name 脚本接口
// @description 脚本功能目前有：给“解析脚本”添加自定义接口（需要配合jxb解析脚本--才有效果）。
// @description:en 2023-03-24
// @version 20240411
// @author 江小白
// @include /^https?:\/\/(?:(?:www\.ixigua\.com\/|m\.ixigua\.com\/video\/)\d{10,}(?:\?id=\d{10,}|$)|(?:v(?:-wb)?|m)\.youku\.com\/.+?\/id_|\w+?\.wasu\.c.+?\/[pP]lay\/show\/id\/\d|www\.fun\.tv\/vplay\/g-|m\.fun\.tv\/mplay\/\?mid=|\w+?\.miguvideo\.com\/.+?\/detail\.html\?cid=\d|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/(?:cover|page)|.+?\/p\/topic)\/|(?:3g|m)\.v\.qq\.com|w(?:ww)?\.mgtv\.com\/[a-z]\/|www\.mgtv\.com\/act\/|m\.mgtv\.com\/b\/|www\.iqiyi\.com\/(?:[vw]_|kszt\/)|www\.iq\.com\/play\/|m\.iqiyi\.com\/(?:v_|$)|tw\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|m\.tv\.sohu\.com\/(?:u\/|v|phone_play_film\?aid=)|film\.sohu\.com\/album\/|www\.le\.com\/ptv\/vplay\/|m\.le\.com\/vplay_|[vm]\.pptv\.com\/show\/|(?:[^\/]+?\.)?1905\.com\/(?:m|.*?play)\/|www\.ixigua\.com\/|(?:player|live)\.bilibili\.com\/|www\.bilibili\.com\/(?:(?:cheese|bangumi)\/play|blackboard|.*?video)\/|m\.bilibili\.com\/bangumi\/play\/|www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|m\.acfun\.cn\/v\/|.+?(?:\.m(?:3u8|p4)\?\w+?=|(?:search|jx|url|rul|id|v|&[^\/]+?|_\w+?|\.html\?\w+?)[&#=\?]https?(?::\/\/|%3A%2F%2F)[^\/]+?\.(?:youku|fun|miguvideo|wasu|tudou|qq|mgtv|iqiyi|iq|sohu|le|pptv|1905|bilibili|acfun|ixigua)\.))/
// @grant none
// @noframes
// @run-at document-body
// @namespace https://greasyfork.org/users/831932
// @downloadURL https://update.greasyfork.org/scripts/476687/%E8%84%9A%E6%9C%AC%E6%8E%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/476687/%E8%84%9A%E6%9C%AC%E6%8E%A5%E5%8F%A3.meta.js
// ==/UserScript==


(function(){'use strict';if(self!=top){return false;}else{if(!document.querySelector("\u6c5f\u5c0f\u767d\u81ea\u5b9a\u4e49\u63a5\u53e3")){document.head.appendChild(document.createElement("\u6c5f\u5c0f\u767d\u81ea\u5b9a\u4e49\u63a5\u53e3"));if(location.href.match(/^https?:\/\/(?:(?:www\.ixigua\.com\/|m\.ixigua\.com\/video\/)\d{10,}(?:\?id=\d{10,}|$)|(?:v(?:-wb)?|m)\.youku\.com\/.+?\/id_|\w+?\.wasu\.c.+?\/[pP]lay\/show\/id\/\d|www\.fun\.tv\/vplay\/g-|m\.fun\.tv\/mplay\/\?mid=|\w+?\.miguvideo\.com\/.+?\/detail\.html\?cid=\d|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/(?:cover|page)|.+?\/p\/topic)\/|(?:3g|m)\.v\.qq\.com|w(?:ww)?\.mgtv\.com\/[a-z]\/|www\.mgtv\.com\/act\/|m\.mgtv\.com\/b\/|www\.iqiyi\.com\/(?:[vw]_|kszt\/)|www\.iq\.com\/play\/|m\.iqiyi\.com\/(?:v_|$)|tw\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|m\.tv\.sohu\.com\/(?:u\/|v|phone_play_film\?aid=)|film\.sohu\.com\/album\/|www\.le\.com\/ptv\/vplay\/|m\.le\.com\/vplay_|[vm]\.pptv\.com\/show\/|(?:[^\/]+?\.)?1905\.com\/(?:m|.*?play)\/|www\.ixigua\.com\/|(?:player|live)\.bilibili\.com\/|www\.bilibili\.com\/(?:(?:cheese|bangumi)\/play|blackboard|.*?video)\/|m\.bilibili\.com\/bangumi\/play\/|www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|m\.acfun\.cn\/v\/|.+?(?:\.m(?:3u8|p4)\?\w+?=|(?:search|jx|url|rul|id|v|&[^\/]+?|_\w+?|\.html\?\w+?)[&#=\?]https?(?::\/\/|%3A%2F%2F)[^\/]+?\.(?:youku|fun|miguvideo|wasu|tudou|qq|mgtv|iqiyi|iq|sohu|le|pptv|1905|bilibili|acfun|ixigua)\.))/)){
/* ** 自定义修改 Josn 全局播放器地址 （必须是 https 类型）** */
let 电脑json全局播放器="";
let 手机json全局播放器="https://www.tpvod.com/player.html?uri=";
/* ********填入想屏蔽的接口名称，屏蔽多个用 | 隔开********** */
let 全局自定义屏蔽接口=/百域阁/i;
/* ****************************************************** */
localStorage.setItem('电脑Json全局播放器',电脑json全局播放器);localStorage.setItem('手机Json全局播放器',手机json全局播放器);if(location.host.match(/(?:youku|fun|miguvideo|wasu|tudou|qq|mgtv|iqiyi|iq|sohu|le|pptv|1905|bilibili|acfun|ixigua)/)){let zdyjkb;try{zdyjkb=[
/* **************** 自定义添加接口 ************************* */

{name:"八号",url:"https://api.52wyb.com/index/?url=",diy:"#4969C7",json:"1",zd:"1",title:"/mgtv1080直解APP和网页不限速,防盗接口，需要 猫HD 修改来源,见大群群文件"},
//tvbox写法
//{"name":"[八号]","type":0,"url":"https://api.52wyb.com/index/?url=","ext":{"header":{"referer":"http://www.8hyyb.com/","User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.163 Safari/535.1"}}},
//{name:"壁纸",url:"http://124.71.8.170:3389/json.php?url=|http://124.71.8.170:3389/json.php?cat_ext=cGFyc2Vz&url=",json:"1",jjj:"bilibili",zd:"1",qp:"1",diy:"#4969C7",title:"/B站720直解修复中,其他平台防盗了"},
{name:"觅影",url:"http://39.104.230.177:1111/api/?key=wD2olCBAAP0ZIZXL7n&url=",json:"1",zd:"1",qp:"1",diy:"#4969C7",title:"B站直解。别外传，别截图"},
{name:"追忆",url:"http://115.231.220.36:8801/jx/tvbox/zyapp.php?url=",json:"1",zd:"1",qp:"1",diy:"#4969C7",title:"360浏览器请关闭挖矿保护"},
//{name:"熙嗷",url:"https://dm.mnvia.xyz/?url=",diy:"#4969C7",zd:"1",http:"1",title:"浏览器加--disable-web-security --allow-running-insecure-content这两个启动参数/优酷直解APP不限速建议APP嗅探用"},
{name:"鱼家",url:"http://json.84jia.com/home/api?type=ys&uid=23631356&key=aelmqruvwGHJMNOPST&url=|http://json.84jia.com/home/api?type=ys&uid=8096440&key=cepwyzACGJPQSTVX04&url=|http://json.84jia.com/home/api?type=ys&uid=162970&key=bghjkmnrszEGIMNRW4&url=|http://jx.meowtv.cn/?url=",json:"1",zd:"1",qp:"1",diy:"#4969C7",title:"uid=162970大佬买的"},
{name:"爱酷",url:"https://jx.xiaofengtv.com/json/?url=|http://42.157.129.139:7788/json/aiku.php?url={ua:Lavf/58.12.100}|https://cache.json.icu/5555.php?url=|https://api.json.icu/api/?key=f082e735eaa8e9f3bfa58d43ebebb6cf&url=|https://api.json.icu/api/?key=ca874f2179e68cc78b6f0d1c8addb58e&url=|https://api.json.icu/api/?key=d74e64c006816563904326dca0e9f7bd&url=|https://api.json.icu/api/?key=3dc7f0a58ae22d892d4f4a4514065a1e&url=|https://douban.armytea.com/json.php?url=|https://jx.armytea.com/jh/API.php?appkey=2232260759123&url=|https://api.json.icu/api/?key=811820edf0b6414f05a648bc0e0ba1e5&url=|https://api.json.icu/api/?key=cebaa8d3da1540559d397891ec522e0e&url=",json:"1",zd:"1",qp:"1",diy:"#4969C7",title:"key=811820edf0b6414f05a648bc0e0ba1e5大佬买的,key=cebaa8d3da1540559d397891ec522e0e飞云的爱酷无限点"},
{name:"左岸",url:"http://110.42.2.247:880/analysis/json/?uid=2334&my=fhloqstzDIKLMORTZ9&url=|http://116.196.99.168/akys.php/?url=|http://106.14.14.200:8956/jx.php?url=",json:"1",zd:"1",qp:"1",diy:"#4969C7"},
{name:"麒麟",url:"http://116.196.99.168/ql.php/?v=|https://api.qljson.xyz/api/?key=10cad8dd1137da2e4ee4c7522501483b&url=",json:"1",zd:"1",qp:"1",diy:"#4969C7",title:"对接阳途"},
//{name:"小月",url:"http://json.xjrtv.cn:8089/home/api?type=ys&uid=2969118&key=ahjmrsvzDEMQSTY079&url=",json:"1",zd:"1",qp:"1",diy:"#4969C7",title:"修复中奇艺直解暂时掉会员,真奇艺1080直解,久久抓的,加载稍慢，可缓冲几分钟在开始看，别外传，别截图"},
{name:"初恋",url:"https://json.oorl.cn/api/?key=3eTcv0kRcMoRzTloll&url=|https://json.oorl.cn/api/?key=RLdYwbPtVKxum234dg&url=|https://json.oorl.cn/api/?key=RLdYwbPtVKxum234dg&url=|https://json.oorl.cn/api/?key=ZgZ1YQKHzfyRlGBv3D&url=|http://jxxcc-cc.dianshia.top:8821/api/?key=UAOfSBFIaFI3IvLi8r&url=|http://jxxcc-cc.dianshia.top:8821/api/?key=UAOfSBFIaFI3IvLi8r&url=",json:"1",zd:"1",qp:"1",diy:"#4969C7"},
{name:"茶语",url:"http://authi.cnlav.cn/home/api?type=ys&uid=335819&key=fjnotCDEGJKLPRV458&url=|http://authi.cnlav.cn/home/api?type=ys&uid=6712384&key=cjtvACEGILMRVWY678&url=|http://authi.cnlav.cn/home/api?type=ys&uid=763289&key=acfmnpqxyDGHILUVWX&url=",json:"1",zd:"1",qp:"1",diy:"#4969C7"},//http://authi.cnlav.cn/home/api?type=ys&uid=3159853&key=bhopuvwxzHLPRUWY89&url=无点暂存|
{name:"晓城",url:"https://svip.cygc.xyz/api/?key=a92A1mlWR57tSlxCjW&url=|https://bfq.cddys.me/meitianhuan/API.php?url=",json:"1",zd:"1",qp:"1",diy:"#4969C7"},
{name:"久云",url:"http://jx.jjtv.bf/gf.php?url=|http://119.91.123.253:2345/Api/yun.php?url={ua:okhttp/3.12.0}",json:"1",zd:"1",qp:"1",diy:"#4969C7",title:"貌似对接人人迷"},
//{name:"播放器模板",url:"",json:"1",bfq:document.domain.replace(document.domain,match=>{if(/qq/.test(match)){return "potplayer://";}else{return "";}}),jjj:"qq",zd:"1",qp:"1",diy:"#4969C7",title:"别外传，别截图,暂时失效"},
{name:"乱对",url:"http://jx.xn--od1aq39b.net:8899/api/?key=tR0o4wExzSqFIKCSMs&url=|http://42.51.20.205:1988/api/xg/?key=FWpBWTghnH0YrhzEEm&url=|http://djx.dmzsp.com:88/?url=|http://jx.jjtv.bf/gf1.php?url=|https://json.bbbzd.cn/api/?key=c7da96d160aa81a738954a525644a171&url=|https://jxjson.icu/434684601.php?url=|http://116.196.99.168/369.php?v=|http://116.196.99.168/%E7%88%B1%E9%85%B7.php?url=|http://116.196.99.168/12.php?v=|http://116.196.99.168/52154878.php?v=|https://vip.liuliyun.vip:8686//api/?key=9CMB6wpsuGf5J9Ovsf&url=|http://103.97.176.52:18888/Vplay/json.php?url=|http://jx.miguotv.net/api/?key=b66d3090f68142a0ab126a1e3412ba55&url=|https://api.huohua.vip/api/?key=fgCAAhE9NpNfNvu4VT&url=|https://api.huohua.vip/api/?key=Y5mrHE7CaQRzUOVKZc&url=|http://122.228.84.103:7777/api/?key=ewHDw89rbnX76D75ff&url=|https://svip.kumyun.cn:1213/home/api?type=ys&cc=mp4&uid=3537010&key=abjkmrvCDEGKOPWZ56&url=|http://cl.ruifeng.lol/api/?key=G7ONc3o0i2P1eyM96P&url=|http://cl.ruifeng.lol/api/?key=bRMYcfNy5tQnLEhlxY&url=|http://vip.xiaomaomi.tv/api.php?key=adfmoswDHIJNOPWY23&url=|http://jx.miguotv.net/api/?key=b66d3090f68142a0ab126a1e3412ba55&url=",json:"1",zd:"1",qp:"1",diy:"#4969C7"},
{name:"涂成",url:"https://110.42.2.98:22222/api/?key=VP2wLtl213gmAOrkaA&url=|https://110.42.2.98:22222/api/?key=NQk7InG1Kn7SaXOVY2&url=|https://110.42.2.98:22222/api/?key=QxR68LYoItCdbTOVgM&url=|http://42.157.129.144:2323/CH/caihong_1993138546.php?url=",json:"1",jxb:"原",zd:"1",qp:"1",diy:"#4969C7"},
{name:"晨光",url:"https://www.cgdyw.net/jiexi/jiekou-1/api.php{json:2}|https://www.cgdyw.net/jiexi/jiekou-2/api.php{json:2}|https://www.cgdyw.net/jiexi/jiekou-3/api.php{json:2}|https://www.cgdyw.net/jiexi/jiekou-4/api.php{json:2}",json:"1",jxb:"原",zd:"1",qp:"1",diy:"#4969C7"},
{name:"提议",url:"https://t1.qlplayer.cyou/player/analysis.php?v=",json:"1",zd:"1",qp:"1",rc4:"https://t1.qlplayer.cyou/qilinplayerapi/js/setting.js",diy:"#4969C7",title:"提取播放数据，当成假Json"},
{name:"一溜",url:"http://111.180.191.20:1616/player/analysis.php?v=",json:"1",zd:"1",qp:"1",rc4:"http://111.180.191.20:1616/mizhiplayerapi/js/setting.js",diy:"#4969C7",title:"提取播放数据，当成假Json"},
{name:"好看",url:"https://free.haokantv.cyou/player/analysis.php?v=",json:"1",zd:"1",qp:"1",rc4:"https://free.haokantv.cyou/qilinplayerapi/js/setting.js",diy:"#4969C7",title:"提取播放数据，当成假Json"},
{name:"虾米",url:"http://116.196.99.168/77.php/?v=|http://appto.tvhh.eu.org:91/jx/xmflv/?v=",json:"1",zd:"1",qp:"1",diy:"#4969C7",title:"虾米转json,不要频繁请求,一分钟十次"},
{name:"度搜",url:"https://www.xinjufang.com/?s=",vip:"强制搜索",j:"电脑",diy:"#4969C7",title:"部分网络访问不了，自测，百度搜索"},//安装https://update.greasyfork.org/scripts/457392/BD%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8.user.js
{name:"百度",url:"https://ysxjjkl.souyisou.top/?search=%s",vip:"强制搜索",j:"电脑",title:"百度搜索，失效较多",diy:"#4969C7"},//安装https://update.greasyfork.org/scripts/457392/BD%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8.user.js
{name:"阿里",url:"https://www.alipansou.com/search?k=%s&s=0&t=-1",vip:"强制搜索",j:"电脑",diy:"#4969C7",title:"阿里搜索"},//安装https://update.greasyfork.org/scripts/458626/阿里云盘助手.user.js
//{name:"飞云",url:"http://tvcms.xcqq.vip:660/api.php/app/",json:"3",hc:"0",zd:"1",qp:"1",diy:"cyan",cjdiy:"#33CC99",sj:"0",px:"1",cjlx:"Feiyun-(?!\\d{10,})",cjjx:"https://daina.hk/api/?key=c8150f1f14ebd5ecda200faecb238b67&url="},
//{name:"飞云",url:"http://154.9.226.202:96/api.php/app",json:"3",diy:"cyan",cjdiy:"#33CC99",cjjx:"https://daina.hk/api/?key=16d8883cfbfc0b8a7d7221c83806dc70&url="},
{name:"蚂蚁",url:"http://122.228.84.103:5822/api.php/app",json:"3",diy:"cyan",cjdiy:"#33CC99",cjjx:"https://103.146.230.202/home/api?type=ys&uid=2704478&key=gknqvADGLTWY012567&url="},//http://121.62.61.51:6888/api/?key=6tzgEyyvR0xdXQml1H&url=
//{name:"苍蓝",url:"http://www.kuloo.xyz/ruifenglb_api.php/v1.vod",json:"3",diy:"cyan",cjdiy:"#33CC99",cjjx:"https://cl.ruifeng.lol/api/?key=GCnpaqEVapC3JNB3eq&url="},//部分视频有广告
{name:"量子",url:"http://cj.lziapi.com/api.php/provide/vod/from/lzm3u8",json:"3",diy:"cyan",cjdiy:"#33CC99",过滤广告:"http://djx.dmzsp.com:88/ms-lz.php?url="},//https://cache.238238.xyz/lz.php?url=
{name:"非凡",url:"http://ffzy2.tv/api.php/provide/vod/from/ffm3u8",json:"3",diy:"cyan",cjdiy:"#33CC99",过滤广告:"http://djx.dmzsp.com:88/ms-ff.php?url="},//https://cache.238238.xyz/lz.php?url=
//{name:"乐视",url:"https://leshiapi.com/api.php/provide/vod/",json:"3",diy:"cyan",cjdiy:"#33CC99",过滤广告:"https://jiexi.miguo.pro/json.php?url="},//https://cache.238238.xyz/lz.php?url=
{name:"暴风",url:"https://bfzy.tv/api.php/provide/vod/",json:"3",diy:"cyan",cjdiy:"#33CC99"},//https://cache.238238.xyz/lz.php?url=
//{name:"量子",url:"https://cj.lziapi.com/api.php/provide/vod/from/lzm3u8",json:"3",hc:"0",zd:"1",qp:"1",diy:"tan",cjdiy:"#33CC99",sj:"0",px:"1",sj:"0",cjzd:"2",目标:"vod_down_url"},
{name:"资源站综合",url:"https://v.ikanbot.com/search?q=",vip:"强制搜索",j:"电脑",diy:"#4969C7"},

//{name:"对爱酷",url:"http://103.205.253.191:7733/400.php?app=10094&account=99999999999&password=99999999999&url=",json:"1",zd:"1",qp:"1",diy:"#4969C7",title:"异地验证，限设备",headers:"{\"X-Forwarded-For\":\"114.114.114.114\"}"},
//{name:"对蚂蚁",url:"http://103.205.253.191:7733/300.php?app=10094&account=99999999999&password=99999999999&url=",json:"1",zd:"1",qp:"1",diy:"#4969C7",title:"异地验证，限设备",headers:"{\"X-Forwarded-For\":\"114.114.114.114\"}"},
//{name:"叮当",url:"http://qy.akys.xyz:8894/vplay/2api_config_2.php",json:"2",zd:"1",qp:"1",diy:"#4969C7",headers:"{\"X-Forwarded-For\":\"125.86.10.72\"}"},
//{name:"叮当",url:"http://qy.akys.xyz:8894/vplay/?url=",zd:"1",qp:"1",diy:"#4969C7",headers:"{\"X-Forwarded-For\":\"随机IP\"}",title:"日限20点"},
//自号{name:"初恋",url:"http://jxxcc-cc.dianshia.top:8821/api/?key=cQsmBDaEWqtuJJq5wQ&url=",json:"1",zd:"1",qp:"1",diy:"#4969C7"},


/* ******************************************************* */
];if(JSON.stringify(zdyjkb).match(/(?<!(?:\*|\/\/)\s*?)[\}\[]\s*?(?:,\s*?)?(?:NaN|null|undefined)/i)){localStorage.setItem('江小白自定义接口','[]');alert('111辅助脚本\n\n请自行检测《自定义添加接口》出错的地方');}else{localStorage.setItem('江小白自定义接口',JSON.stringify(zdyjkb));}}catch(e){localStorage.setItem('江小白自定义接口','[]');alert('111辅助脚本\n\n《自定义添加接口》有问题:\n\n'+e);}let zdyjkpbobj=setInterval(function(){try{if(document.querySelector("ul#httpsvipul>li:last-of-type")){const zdyjkpb=document.querySelectorAll('ul#httpsvipul>li');for(let zdyjkpbi=0;zdyjkpbi<zdyjkpb.length;zdyjkpbi++){const zdyjkpbmsa=zdyjkpb[zdyjkpbi].querySelectorAll('a4');for(let zdyjkpbia=0;zdyjkpbia<zdyjkpbmsa.length;zdyjkpbia++){if(zdyjkpbmsa[zdyjkpbia].innerText.match(全局自定义屏蔽接口)){zdyjkpb[zdyjkpbi].setAttribute('style','display:none!important');}};};clearInterval(zdyjkpbobj);}else{}}catch(e){clearInterval(zdyjkpbobj);}},1234);}}}else{return false;}}})();
