// ==UserScript==
// @name 手机电脑辅助脚本
// @description 脚本功能目前有：给“解析脚本”添加自定义接口（需要配合jxb解析脚本--才有效果）。
// @author 江小白
// @version 1.5
// @include /^https?:\/\/(?:(?:www\.ixigua\.com\/|m\.ixigua\.com\/video\/)\d{10,}(?:\?id=\d{10,}|$)|(?:v(?:-wb)?|m)\.youku\.com\/.+?\/id_|\w+?\.wasu\.c.+?\/[pP]lay\/show\/id\/\d|www\.fun\.tv\/vplay\/g-|m\.fun\.tv\/mplay\/\?mid=|\w+?\.miguvideo\.com\/.+?\/detail\.html\?cid=\d|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/(?:cover|page)|.+?\/p\/topic)\/|(?:3g|m)\.v\.qq\.com|w(?:ww)?\.mgtv\.com\/[a-z]\/|www\.mgtv\.com\/act\/|m\.mgtv\.com\/b\/|www\.iqiyi\.com\/(?:[vw]_|kszt\/)|www\.iq\.com\/play\/|m\.iqiyi\.com\/(?:v_|$)|tw\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|m\.tv\.sohu\.com\/(?:u\/|v|phone_play_film\?aid=)|film\.sohu\.com\/album\/|www\.le\.com\/ptv\/vplay\/|m\.le\.com\/vplay_|[vm]\.pptv\.com\/show\/|(?:vip|m)\.1905\.com\/(?:m\/vod|play)\/|www\.ixigua\.com\/|(?:player|live)\.bilibili\.com\/|www\.bilibili\.com\/(?:(?:cheese|bangumi)\/play|blackboard|.*?video)\/|m\.bilibili\.com\/bangumi\/play\/|www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|m\.acfun\.cn\/v\/|.+?(?:\.m(?:3u8|p4)\?\w+?=|(?:search|jx|url|id|v|&[^\/]+?|_\w+?|\.html\?\w+?)[&#=\?]https?(?::\/\/|%3A%2F%2F)[^\/]+?\.(?:youku|fun|miguvideo|wasu|tudou|qq|mgtv|iqiyi|iq|sohu|le|pptv|1905|bilibili|acfun|ixigua)\.))/
// @grant none
// @noframes
// @run-at document-body
// ==/UserScript==

(function(){'use strict';if(self!=top){return false;}else{if(!document.querySelector("\u6c5f\u5c0f\u767d\u81ea\u5b9a\u4e49\u63a5\u53e3")){document.head.appendChild(document.createElement("\u6c5f\u5c0f\u767d\u81ea\u5b9a\u4e49\u63a5\u53e3"));if(location.href.match(/^https?:\/\/(?:(?:www\.ixigua\.com\/|m\.ixigua\.com\/video\/)\d{10,}(?:\?id=\d{10,}|$)|(?:v(?:-wb)?|m)\.youku\.com\/.+?\/id_|\w+?\.wasu\.c.+?\/[pP]lay\/show\/id\/\d|www\.fun\.tv\/vplay\/g-|m\.fun\.tv\/mplay\/\?mid=|\w+?\.miguvideo\.com\/.+?\/detail\.html\?cid=\d|[^\/]+?\.tudou\.com\/(?:v\/|.+?\/id_)|v\.qq\.com\/(?:x\/(?:cover|page)|.+?\/p\/topic)\/|(?:3g|m)\.v\.qq\.com|w(?:ww)?\.mgtv\.com\/[a-z]\/|www\.mgtv\.com\/act\/|m\.mgtv\.com\/b\/|www\.iqiyi\.com\/(?:[vw]_|kszt\/)|www\.iq\.com\/play\/|m\.iqiyi\.com\/(?:v_|$)|tw\.iqiyi\.com\/v_|tv\.sohu\.com\/v\/|m\.tv\.sohu\.com\/(?:u\/|v|phone_play_film\?aid=)|film\.sohu\.com\/album\/|www\.le\.com\/ptv\/vplay\/|m\.le\.com\/vplay_|[vm]\.pptv\.com\/show\/|(?:vip|m)\.1905\.com\/(?:m\/vod|play)\/|www\.ixigua\.com\/|(?:player|live)\.bilibili\.com\/|www\.bilibili\.com\/(?:(?:cheese|bangumi)\/play|blackboard|.*?video)\/|m\.bilibili\.com\/bangumi\/play\/|www\.acfun\.cn\/(?:.+?\/ac|bangumi\/)|m\.acfun\.cn\/v\/|.+?(?:\.m(?:3u8|p4)\?\w+?=|(?:search|jx|url|id|v|&[^\/]+?|_\w+?|\.html\?\w+?)[&#=\?]https?(?::\/\/|%3A%2F%2F)[^\/]+?\.(?:youku|fun|miguvideo|wasu|tudou|qq|mgtv|iqiyi|iq|sohu|le|pptv|1905|bilibili|acfun|ixigua)\.))/)){
/* ** 自定义修改 Josn 全局播放器地址 （必须是 https 类型）** */
let 电脑json全局播放器="https://auete.com/api/dp.php?url=";
let 手机json全局播放器="https://auete.com/api/dp.php?url=";
/* ********填入想屏蔽的接口名称，屏蔽多个用 | 隔开********** */
let 全局自定义屏蔽接口=/百域阁/i;
/* ****************************************************** */
localStorage.setItem('电脑Json全局播放器',电脑json全局播放器);localStorage.setItem('手机Json全局播放器',手机json全局播放器);if(location.host.match(/(?:youku|fun|miguvideo|wasu|tudou|qq|mgtv|iqiyi|iq|sohu|le|pptv|1905|bilibili|acfun|ixigua)/)){function 自动点击(zdya,zdyb){try{if(location.host.match(zdya)){sessionStorage.setItem('自定义点击接口',JSON.stringify(zdyb.split("|")));}}catch(e){}};
/* *******填入想自动点击的接口名称，多个接口用 | 隔开******* */
//写法例子：           自动点击('qq','腾讯|高天|扶风|牛逼|虾米|布米米');

/* ****************************************** */let zdyjkb=[
/* **************** 自定义添加接口 ************************* */
//       {name:"自动点击",vip:"自动点击",jxb:"原",jj:"1",diy:"burlywood",j:"电脑",sj:"0",title:"根据 自定义设置 的 解析接口数组，进行 自动点击接口"},
//       {name:"PAR",url:"https://jx.parwix.com:4433/player/?url="},

{name:"插件",url:"chrome-extension://odmcmemhohlknciifpnlidadbdoeoghc/play.html#",vip:"播放器",diy:"#0077ff"},
{name:"在线",url:"https://auete.com/api/dp.php?url=",vip:"播放器",diy:"#0077ff"},
{name:"稳定",url:"https://ldy.jx.cn/wp-api/ifrty.php?isDp=0&vid=",vip:"播放器",diy:"#0077ff"},
{name:"之家",url:"https://jx.zxzj.vip/dplayer.php/?url=",vip:"播放器",diy:"#0077ff"},
{name:"淘剧",url:"https://m3u8.ap2p.cn/?url=",vip:"播放器",diy:"#0077ff"},
{name:"默认",url:"https://auete.com/api/dp.php?url=",vip:"播放器",diy:"#0077ff"},

//{name:"一个",url:"http://1.117.152.239:39000/?url=",vip:"爬虫接口"},
//{name:"呦呦",url:"https://pan.bilnn.com/api/v3/file/sourcejump/J4y2GYtz/TQuaTlu1NMUXIXs2WIu_LxZ4aU8k5vlOBbFPslh0JT4*?电脑透明",vip:"爬虫接口",diy:"透明"},
{name:"哟哟",url:"https://pan.bilnn.cn/api/v3/file/sourcejump/J4y2GYtz/TQuaTlu1NMUXIXs2WIu_LxZ4aU8k5vlOBbFPslh0JT4*",vip:"爬虫接口",diy:"#CCFFCC"},
{name:"迷弟TB",url:"https://lmwbxsj.nos-eastchina1.126.net/tb.json",vip:"爬虫接口",diy:"#CCFFCC"},
//{name:"迷弟TB",url:"https://lmwbxsj.nos-eastchina1.126.net/tb.json?电脑透明",vip:"爬虫接口",diy:"透明"},
{name:"自用",url:"http://wp.anxwl.cn/down.php/b9ef0959511d85d1b492ae1241b3278a.txt",vip:"爬虫接口",diy:"#CCFFCC"},
{name:"直播",url:"https://greasyfork.org/scripts/452379-%E8%AE%A2%E9%98%85/code/%E8%AE%A2%E9%98%85.js?version=1100261",vip:"爬虫接口",diy:"#CCFFCC"},

//{name:"央视",url:"https://pan.bilnn.com/api/v3/file/sourcejump/xn47dXce/oVXQdSbZ5Fwdrb-ZVk_s-QHFBzcN5670rz-8KHVnRe0*",vip:"爬虫接口",diy:"#CCFFCC",gx:"1"},
//{name:"卫视",url:"https://pan.bilnn.com/api/v3/file/sourcejump/vXY1q1iq/1m7a4gV0uwaki5GL0w-xDtzIWAh9t2nDsSLpsgQgxWg*",vip:"爬虫接口",diy:"#fddd82",gx:"1"},

//{name:"九久",url:"http://42.193.18.62:9999/analysis.php?v=",jxb:"原",ds:"5",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99",lx:"1"},
//{name:"猫影视",url:"https://lmwbxsj.nos-eastchina1.126.net/js.json",vip:"爬虫接口",diy:"#CCFFCC",gx:"1"},
//{name:"解析",url:"https://gitea.com/y36369999/9/raw/branch/9/line_config.json",vip:"爬虫接口",diy:"#CCFFCC"},
//{name:"TVbox",url:"https://gitea.com/Yoursmile/TVBox/raw/branch/main/XC.json",vip:"爬虫接口"},
//{name:"168",url:"http://168.qxzm.cc/user/owe.php?app=20220925&account=qqwens&password=123456&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99",lx:"1"},
//{name:"168",url:"http://168.qxzm.cc/user/owe.php?app=10000&account=qqwens&password=123456&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99",lx:"1"},
{name:"白一",url:"http://168.qxzm.cc/user/owe.php?url=",wb:"&app=10000&account=XCDH521&password=mnbvcxz..",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"白二",url:"http://ej.myyhl.top/owe.php?app=10000&account=jonmy&password=YTt031022&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99",lx:"1"},
{name:"白三",url:"http://106.55.103.73:8085/jiexi.php?app=10000&account=19990602&password=19990602&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"白四",url:"http://jsb.feifan12.xyz/yz12345678/jx.php?app=10000&account=gujgj152&password=gjyuhjhh&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99",lx:"1"},
{name:"真牛",url:"http://123.56.222.84:4433/analysis.php?app=10035&account=QY920&password=GJDY211&url=",json:"1",vip:"强制跳转",zd:"1",qp:"1",jj:"1",jy:"1",diy:"#33CC99"},
//{name:"168",url:"http://168.qxzm.cc/user/owe.php?url=",wb:"&app=10000&account=20220925&password=123456",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"aqua"},
{name:"255",url:"https://jx.255tv.cn/api/?key=J0rVG2AVM6o0hBLFp5&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"轰炸东京",url:"https://t20.cdn2020.com/video/m3u8/2022/09/17/ea9b8eef/index.m3u8#",vip:"强制弹小窗",diy:"#f15495",gx:"1"},
//{name:"成人1",url:"https://siwazywcdn2.com:5278/zhongwenzimu/Iy5TK6VM/index.m3u8#",vip:"强制弹小窗",diy:"#f15495",gx:"1"},
//{name:"成人2",url:"https://siwazywcdn2.com:5278/zhongwenzimu/KScQZzPC/index.m3u8#",vip:"强制弹小窗",diy:"#f15495",gx:"1"},
//{name:"苏州4K频道",url:"http://liveshowbak2.kan0512.com/ksz-norecord/csztv4k_4k.m3u8#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
//{name:"财经频道",url:"rtmp://xinl-live.maxtv.cn/live/zb#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
//{name:"凤凰卫视",url:"http://113.64.147.73:808/hls/32/index.m3u8?times=0#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
//{name:"凤凰咨询",url:"http://113.64.147.73:808/hls/33/index.m3u8?times=0#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
//{name:"互动新闻",url:"http://98.142.138.122:1632/zhiboyuandakaTV/ViuTv21367.m3u8#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
//{name:"翡翠台",url:"http://113.64.147.73:808/hls/36/index.m3u8?times=0#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
//{name:"翡翠台备",url:"http://98.142.138.122:1639/zhiboyuandakaTV/tvbjade83675.m3u8#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
//{name:"明珠台",url:"http://113.64.147.73:808/hls/37/index.m3u8?times=0#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
//{name:"J2",url:"http://pull-rtmp-l6.ixigua.com/live/a5ab039093ee3d202331ad0b330fd490.flv#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
//{name:"FOX",url:"https://ds.hbbkqy.cn/live/sd-1-3743309.m3u8#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
//{name:"东森电影",url:"http://113.64.147.73:808/hls/58/index.m3u8?times=0#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
//{name:"私人影院",url:"http://113.64.147.73:808/hls/57/index.m3u8?times=0#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
//{name:"动作影院",url:"http://113.64.147.73:808/hls/56/index.m3u8?times=0#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
{name:"动作影院",url:"http://txtest-xp2p.p2p.huya.com/src/1199561277675-1199561277675-5434860597135015936-2399122678806-10057-A-0-1.xs#",vip:"强制弹小窗",diy:"#CCCCFF",gx:"1"},
[
//{name:"九久",url:"http://42.193.18.62:9999/analysis.php?v=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99",lx:"1"},
{name:"扶风",url:"https://vip.byteamone.cn/api/?key=QQXFJsIjsh6n06dHtn&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99",lx:"1"},
{name:"二零",url:"https://www.1920lgzy.top/json.php?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"九五",url:"https://jx.295yun.vip/api/?key=YoS44VPIeUesnPX11m&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"土狗",url:"http://tgjx.itcker.com/api/?key=u7eWwiakUR1L6KS4sj&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"融普",url:"https://vip.rongxingvr.top/api/?key=CwQXkIXGfaUNGVomez&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99",lx:"1"},
{name:"融普",url:"https://svip.rongxingvr.top/api/rxm3u8.php?key=mFSOwyoFkgkMP3FDsu&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99",lx:"1"},
{name:"融高",url:"https://jisu.rongxingvr.top/api/?key=Ft1rjUpKda9tXID4OG&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99",lx:"1"},
//{name:"左岸",url:"http://110.42.2.115:880/analysis/json/?uid=2283&my=bgnpxAEIKLSTW13469&url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"左岸",url:"http://110.42.2.115:880/analysis/json/?uid=2100&my=cqrtwyACDGLOXY0249&mgtv=app&url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"左岸",url:"http://110.42.2.115:880/analysis/json/?uid=2316&my=eghlpxyEJLUXZ02369&url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"残影",url:"https://svip.cygc.xyz/api/?key=mC091EyCqt5MK86jeZ&url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"乐豆",url:"http://43.249.192.227:7879/api/?key=DVIrNgX1QOnSQvAgGg&url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"泽南",url:"https://svip.znjson.com/api/?key=gX8j9IPvoQ5mFmlIzu&url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"屌丝",url:"http://www.zjds.cc/jx/dnm111.php?url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"影视",url:"http://json.ysys.asia/home/api?type=ys&uid=885430&key=kmoqruvCEHKLMNPVY8&url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"255",url:"https://jx.255tv.cn/api/?key=4SB5VFIdgHVlQFWsb6&url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"天蚕",url:"https://jf.tcysvip.cn/json1/json.php?url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"555",url:"https://json.555jiexi.com.ytlngy.com/?url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"免费",url:"https://json.freejson.xyz/hongtu.php?url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"定存",url:"http://66.json.dv9.cc:666/?url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"王牌",url:"http://rxjx.kuanjv.com/allm3u8.php?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"可米",url:"http://www.kmysw.cn/json/?url=",jxb:"原",json:"1",jj:"1",zd:"1",qp:"1",diy:"#33CC99",lx:"1"},
{name:"假江",url:"http://211.99.99.236:4567/jhjson/ceshi.php?url=",jxb:"原",json:"1",jj:"1",zd:"1",qp:"1",diy:"#33CC99",lx:"1"},
{name:"醉人",url:"http://www.zruiry.com/json.php?url=",jxb:"原",json:"1",jj:"1",zd:"1",qp:"1",diy:"#33CC99",lx:"1"},
//{name:"达人",url:"https://playmv.vip/?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"尘烟",url:"https://vip.cyu0.cn/home/api?type=ys&uid=1542727&key=ejkltxzADJLNOPTWY5&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"北雁",url:"https://svip.beiyan.cc:4433/api/?key=may7qJyCzEvicn8AkV&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"本条",url:"https://rx.bt5v.com/json/jsonindex.php/?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"端木",url:"http://jx.mx91.top/jx/rx.php?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"刚刚",url:"https://play.fuqizhishi.com/xiaobai/API.php?appkey=ganggang&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"刚刚",url:"https://play.fuqizhishi.com/jx/API.php?appkey=xiaobai888&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"刚刚",url:"https://play.fuqizhishi.com/juhe/API.php?appkey=caijijuhe220902&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"人人",url:"https://svip.renrenmi.cc:2222/api/?type=ys&key=Piv4COHmhA0Cim0iTs&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"自建",url:"http://124.220.153.4/jx/dl.php?url=",json:"1",ua:"Dart/2.15 (dart:io)",diy:"#33CC99"},
{name:"飞机",url:"https://app.fjkkk.cn/toujiexisi.php?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"狮子",url:"https://play.shzpin.com/BYGA/API.php?appkey=RYUEYRYUIYREIREGH&url=",jxb:"原",json:"1",re:"https://www.nulltm.com/",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"达人",url:"http://jx.vipmv.co/json.php?token=123457&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"爱酷",url:"https://cache.json.icu/home/api?type=ys&uid=4598869&key=chqrsuCEHILNPTU689&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"高科",url:"http://newjiexi.gotka.top/keyu3.php?url=",jxb:"原",json:"1",ua:"okhttp/4.1.0",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"老板",url:"http://ck.laobandq.com/3515240842.php?pltfrom=1100&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"极速",url:"https://www.jsyb.cc/tg/json.php?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"无尽",url:"https://cdnbdyun.wjjjjjj.cc/4as6d54as56d46q5w4e521534215411aqd21wqs56d1q56d4/d1b23d1bd5g4fgwt4w64w6e5r52134132234/pdakl456q45143512435612435641256e41161a23s1da/?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"佩恩",url:"http://81.69.23.108:7788/json.php?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"猫咪",url:"http://api.xiaomaomi.tv/home/api?type=ys&uid=8132785&key=adfgmoDFIJLMSVYZ68&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"思古",url:"http://vip.gbxy.net.cn/api/?key=XhXeY0CEElTqbd9i4m&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"米咔",url:"http://bfq.blssv.com/bfq/mika.php?&tm=1662637745089&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"红影",url:"https://jxx.hylyy.com/index.php?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"饭后",url:"https://vip.d8bi.cn/api/?uid=10002&key=OS0dUqBJzyToAItLvj&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"椰子",url:"https://jx.gbxy.net.cn/API.php?url=",jxb:"原",json:"1",zd:"1",qp:"1",diy:"#33CC99"},
{name:"蓝酷",url:"http://123.57.56.94:9931/ak/?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"胖虎",url:"http://godto.cf/asxcdf1d.php?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"茶语",url:"http://cy.myjx.work/home/api?type=ys&uid=582290&key=acdhjkmrstxzBHRUV9&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"快看",url:"http://43.138.186.2:8867/api/?key=TG@muzi22&url=",jxb:"原",json:"1",ua:"Dart/2.17 (dart:io)",vip:"强制弹小窗",zd:"1",qp:"1",jy:"1",jj:"1",diy:"#33CC99"},
//{name:"快看",url:"http://jx.nbjs.cf/api/?key=TG@muzi22&url=",jxb:"原",json:"1",ua:"Dart/2.17 (dart:io)",vip:"强制弹小窗",zd:"1",qp:"1",jy:"1",jj:"1",diy:"#33CC99"},
//{name:"快看",url:"http://43.138.186.2:8867/jx.php?url=",jxb:"原",json:"1",ua:"Dart/2.17 (dart:io)",vip:"强制弹小窗",zd:"1",qp:"1",jy:"1",jj:"1",diy:"#33CC99"},
//{name:"293",url:"http://lanlan.ckflv.cn/?url=",jxb:"原",json:"1",vip:"强制弹小窗",zd:"1",qp:"1",jj:"1",jy:"1",diy:"#33CC99"},
//{name:"293",url:"http://api.ckflv.cn/?url=",jxb:"原",json:"1",vip:"强制弹小窗",zd:"1",qp:"1",jj:"1",jy:"1",diy:"#33CC99"},
{name:"293",url:"http://123.57.56.94:9931/lanlan/?url=",jxb:"原",json:"1",vip:"强制跳转",zd:"1",qp:"1",jj:"1",jy:"1",diy:"#33CC99"},
{name:"直链",url:"http://122.114.157.13:2089/rx.php?url=",jxb:"原",vip:"强制弹小窗",zd:"1",qp:"1",jj:"1",jy:"1",diy:"#33CC99"},
//{name:"你好",url:"https://json.lihaoyun.top/dd/rxvr.php?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"吐丝",url:"https://json.tothis.pw/?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
//{name:"牛逼",url:"https://182.61.23.42:4399/home/api?type=json&uid=27&key=fhpsuvADEIKPRTX189&url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"星一",url:"https://xygbk.top/zby/jx/json.php?url=",jxb:"原",json:"1",zd:"1",qp:"1",diy:"#33CC99"},
//{name:"飘逸",url:"http://81.69.23.108:4433/json.php?url=",jxb:"原",json:"1",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},
{name:"跑马",url:"https://jxxx.polizu.cn/index.php?url=",jxb:"原",json:"1",ua:"Dart/2.14 (dart:io)",zd:"1",qp:"1",jj:"1",diy:"#33CC99"},

{name:"氢视频",url:"http://h1080p.com/addons/dp/player/dp.php?url=",jxb:"原",json:"1",zd:"1",qp:"1",diy:"#33CC99;",re:"http://h1080p.com/",ds:"99"},

//{name:"CCTV4K",url:"http://liveop.cctv.cn/hls/4KHD/playlist.m3u8?",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV1",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000001000021973/1.m3u8?Contentid=1000000001000021973&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV2",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000001000012442/1.m3u8?Contentid=1000000001000012442&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV3",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000001000011218/1.m3u8?Contentid=1000000001000011218&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV4",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000002000031664/1.m3u8?Contentid=1000000002000031664&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV5",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000001000004794/1.m3u8?Contentid=1000000001000004794&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV5+",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000001000020505/1.m3u8?Contentid=1000000001000020505&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV6",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000001000016466/1.m3u8?Contentid=1000000001000016466&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV7",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000001000017218/1.m3u8?Contentid=1000000001000017218&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV8",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000001000003736/1.m3u8?Contentid=1000000001000003736&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV9",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000001000014583/1.m3u8?Contentid=1000000001000014583&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV10",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000001000026367/1.m3u8?Contentid=1000000001000026367&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV11",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000002000019789/1.m3u8?Contentid=1000000002000019789&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV12",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000001000001640/1.m3u8?Contentid=1000000001000001640&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV13",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000002000021303/1.m3u8?Contentid=1000000002000021303&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV14",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000001000008170/1.m3u8?Contentid=1000000001000008170&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV15",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000002000008163/1.m3u8?Contentid=1000000002000008163&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV16",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000006000233002/1.m3u8?Contentid=1000000006000233002&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
//{name:"CCTV17",url:"http://cache.ott.fifalive.itv.cmvideo.cn:80/1000000005000056836/1.m3u8?Contentid=1000000005000056836&livemode=1&stbId=3&channel-id=ystenlive#",vip:"强制跳转",diy:"#33CC99",gx:"1"},
]
];localStorage.setItem('江小白自定义接口',JSON.stringify(zdyjkb));let zdyjkpbobj=setInterval(function(){try{if(document.querySelector("ul#httpsvipul>li:last-of-type")){const zdyjkpb=document.querySelectorAll('ul#httpsvipul>li');for(let zdyjkpbi=0;zdyjkpbi<zdyjkpb.length;zdyjkpbi++){const zdyjkpbmsa=zdyjkpb[zdyjkpbi].querySelectorAll('a4');for(let zdyjkpbia=0;zdyjkpbia<zdyjkpbmsa.length;zdyjkpbia++){if(zdyjkpbmsa[zdyjkpbia].innerText.match(全局自定义屏蔽接口)){zdyjkpb[zdyjkpbi].setAttribute('style','display:none!important');}};};clearInterval(zdyjkpbobj);}else{}}catch(e){clearInterval(zdyjkpbobj);}},1234);}}}else{return false;}}})();