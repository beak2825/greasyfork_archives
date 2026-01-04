// ==UserScript==
// @name 🌟Super_preloader_6.5G
// @namespace    https://github.com/ywzhaiqi
// @description  预读+翻页..全加速你的浏览体验...
// @author       ywzhaiqi && NLF(原作者)
// @version      6.5.0
// @homepageURL  https://greasyfork.org/scripts/293-super-preloaderplus-one

// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand

// @include      *
// @exclude      http*://mail.google.com/*
// @exclude      http*://maps.google*
// @exclude      http*://www.google.com/reader*
// @exclude      http*://www.google.com/calendar*
// @exclude      https://docs.google.com/*
// @exclude      http*://app.yinxiang.com/*
// @exclude      http*://www.dropbox.com/*
// @exclude      http*://www.toodledo.com/*
// @exclude      http://cloud.feedly.com/*
// @exclude      http://weibo.com/*
// @exclude      http://w.qq.com/*
// @exclude      http://web2.qq.com/*
// @exclude      http://openapi.qzone.qq.com/*
// @exclude      http://*cloud.vip.xunlei.com/*
// @exclude      http*://www.wumii.com/*
// @exclude      http://pan.baidu.com/*
// @exclude      http://yun.baidu.com/*
// @exclude      http://www.cnbeta.com/*
// @exclude      http://www.youku.com/
// @exclude      http://v.youku.com/*
// @exclude      http://www.iqiyi.com/*
// @exclude      http://www.duokan.com/reader/*
// @downloadURL https://update.greasyfork.org/scripts/540368/%F0%9F%8C%9FSuper_preloader_65G.user.js
// @updateURL https://update.greasyfork.org/scripts/540368/%F0%9F%8C%9FSuper_preloader_65G.meta.js
// ==/UserScript==

(function() {

// 主要用于 chrome 原生下检查更新，也可用于手动检查更新
var scriptInfo = {
version: '6.5.0',
updateTime: '2015/1/10',
homepageURL: 'https://greasyfork.or/scripts/293-super-preloaderplus-one',
downloadUrl: 'https://greasyfork.or/scripts/293-super-preloaderplus-one/code/Super_preloaderPlus_one.user.js',
metaUrl: 'https://greasyfork.or/scripts/293-super-preloaderplus-one/code/Super_preloaderPlus_one.meta.js',
};


//----------------------------------
// rule.js

if (window.name === 'mynovelreader-iframe') {
return;
}

// 如果是取出下一页使用的iframe window
if (window.name === 'superpreloader-iframe') { // 搜狗,iframe里面怎么不加载js啊?
// 去掉了原版的另一种方法，因为新版本 chrome 已经支持。旧版本 chrome iframe里面 无法访问window.parent,返回undefined

var domloaded = function (){  // 滚动到底部,针对,某些使用滚动事件加载图片的网站.
window.scroll(window.scrollX, 99999);
window.parent.postMessage('superpreloader-iframe:DOMLoaded', '*');
};
if(window.opera){
document.addEventListener('DOMContentLoaded', domloaded, false);
} else {
domloaded();
}

return;
}


// GM 兼容

gmCompatible();

/////////////////////设置(请注意开关的缩进关系..子开关一般在父开关为true的时候才会生效.)//////////////////////
var prefs={
floatWindow: true,       // 显示悬浮窗
FW_position: 1,         // 1:出现在左上角;2:出现在右上角;3：出现在右下角;4：出现在左下角;
FW_offset: [5, 5],    // 5,28偏离版边的垂直和水平方向的数值..(单位:像素)★
FW_RAS: true,           // 点击悬浮窗上的保存按钮..立即刷新页面;
pauseA: true,            // 快速停止自动翻页(当前模式为翻页模式的时候生效.);
Pbutton: [0, 0, 0],     // 需要按住的键.....0: 不按住任何键;1: shift鍵;2: ctrl鍵; 3: alt鍵;(同时按3个键.就填 1 2 3)(一个都不按.就填 0 0 0)
mouseA: false,           // 按住鼠标左键..否则.双击;
Atimeout: 200,      // 按住左键时..延时.多少生效..(单位:毫秒);
stop_ipage: true,       // 如果在连续翻页过程中暂停.重新启用后.不在继续..连续翻页..

Aplus: true,             // 自动翻页模式的时候..提前预读好一页..就是翻完第1页,立马预读第2页,翻完第2页,立马预读第3页..(大幅加快翻页快感-_-!!)(建议开启)..
sepP: true,              // 翻页模式下.分隔符.在使用上滚一页或下滚一页的时候是否保持相对位置..
sepT: true,              // 翻页模式下.分隔符.在使用上滚一页或下滚一页的时候使用动画过渡..
s_method: 3,            // 动画方式 0-10 一种11种动画效果..自己试试吧
s_ease: 2,              // 淡入淡出效果 0：淡入 1：淡出 2：淡入淡出
s_FPS: 60,              // 帧速.(单位:帧/秒)
s_duration: 333,        // 动画持续时长.(单位:毫秒);
someValue: '',           // 显示在翻页导航最右边的一个小句子..-_-!!..Powered by Super_preloader 隐藏了
DisableI: true,          // 只在顶层窗口加载JS..提升性能..如果开启了这项,那么DIExclude数组有效,里面的网页即使不在顶层窗口也会加载....
arrowKeyPage: true,      // 允许使用 左右方向键 翻页..
sepStartN: 2,            // 翻页导航上的,从几开始计数.(貌似有人在意这个,所以弄个开关出来,反正简单.-_-!!)

// 新增或修改的
forceTargetWindow: GM_getValue('forceTargetWindow', false),  // 下一页的链接设置成在新标签页打*
debug: GM_getValue('debug', false),
enableHistory: GM_getValue('enableHistory', false),    // ❤️把下一页链接添加到历史记录
autoGetPreLink: false,   // 一开始不自动查找上一页链接，改为调用时再查找
excludes: GM_getValue('excludes', ''),
custom_siteinfo: GM_getValue('custom_siteinfo', '[]'),
lazyImgSrc: 'zoomfile|file|original|load-src|_src|imgsrc|real_src|src2|data-lazyload-src|data-ks-lazyload|data-lazyload|data-src|data-original|data-thumb|data-imageurl|data-defer-src|data-placeholder',
};

// 黑名单,网站正则..
var blackList=[
// 例子
// 'http://*.douban.com/*',
];

blackList = blackList.concat(prefs.excludes.split(/[\n\r]+/).map(function(line) {
return line.trim();
}));


//在以下网站上允许在非顶层窗口上加载JS..比如猫扑之类的框架集网页.
var DIExclude = [
['猫扑帖子', true, /http:\/\/dzh\.mop\.com\/[a-z]{3,6}\/\d{8}\/.*\.shtml$/i],
['铁血社区', true, /^http:\/\/bbs\.tiexue\.net\/.*\.html$/i],
['铁血社区-2', true, /^http:\/\/bbs\.qichelian\.com\/bbsqcl\.php\?fid/i],
// 像 http://so.baiduyun.me/ 内嵌的百度、Google 框架
['百度网盘搜索引擎-百度', true, /^https?:\/\/www\.baidu\.com\/baidu/i],
['百度网盘搜索引擎-Google', true, /^https?:\/\/74\.125\.128\.147\/custom/i],
];

// 页面不刷新的站点
var HashchangeSites = [
{ url: /^https?:\/\/(www|encrypted)\.google(stable)?\..{2,9}\/(webhp|#|$|\?)/, timer: 2000, mutationSelector: '#main' },
// 运营商可能会在 #wd= 前面添加 ?tn=07084049_pg
{ url: /^https?:\/\/www\.baidu\.com\/($|#wd=)/, timer: 1000, mutationSelector: '#wrapper_wrapper' },
{ url: /^https?:\/\/www\.newsmth\.net/, timer: 1000 },
];

//////////////////////////---------------规则-------////////////////
//翻页所要的站点信息.
//高级规则的一些默认设置..如果你不知道是什么..请务必不要修改(删除)它.此修改会影响到所有高级规则...
var SITEINFO_D={
enable: true,               // 启用
useiframe: GM_getValue('SITEINFO_D.useiframe') || true,           // (预读)是否使用iframe..★
viewcontent: false,         // 查看预读的内容,显示在页面的最下方.
autopager: {
enable: true,           // 启用自动翻页...
force_enable: GM_getValue('SITEINFO_D.autopager.force_enable') || true,  //默认启用强制拼接&★
manualA: false,         // 手动翻页.▲♦️
useiframe: false,       // (翻页)是否使用iframe..
iloaded: false,     // 是否在iframe完全load后操作..否则在DOM完成后操作
itimeout: 0,        // 延时多少毫秒后,在操作..
newIframe: false,
remain: 3,              // 剩余页面的高度..是显示高度的 remain 倍开始翻页..
maxpage: 9,            // 最多翻多少页..
ipages: [true, 1],     // 立即翻页▲,第一项是控制是否在js加载的时候立即翻第二项(必须小于maxpage)的页数,比如[true,3].就是说JS加载后.立即翻3页.
separator: false,        // @#显示翻页导航..(推荐显示.)
separatorReal: true,  // 显示真实的页数
}
};

//高优先级规则,第一个是教程.
var SITEINFO=[
{name: 'Google搜索',                                                                                                                               //站点名字...(可选)
url: '^https?://(?:(?:www|encrypted)\\.google(?:stable)?\\..{2,9}|wen\\.lu)/(?:webhp|search|#|$|\\?)',   // 站点正则...(~~必须~~)
//url:'wildc;http://www.google.com.hk/search*',
siteExample:'http://www.google.com',                                                                                                //站点实例...(可选)
enable:true,                                                                                                                                            //启用.(总开关)(可选)
useiframe:false,                                                                                                                                        //是否用iframe预读...(可选)
viewcontent:false,

nextLink: 'id("pnnext") | id("navbar navcnt nav")//td[span]/following-sibling::td[1]/a | id("nn")/parent::a',                                                                                                                           //查看预读的内容,显示在页面的最下方.(可选)
// nextLink:'auto;',
//nextLink:'//table[@id="nav"]/descendant::a[last()][parent::td[@class="b"]]',              //下一页链接 xpath 或者 CSS选择器 或者 函数返回值(此函数必须使用第一个传入的参数作为document对象) (~~必选~~)
//nextLink:'css;table#nav>tbody>tr>td.b:last-child>a',
//nextLink:function(D,W){return D.evaluate('//table[@id="nav"]/descendant::a[last()][parent::td[@class="b"]]',D,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;},
// 新增 Array 的格式，依次查找

// preLink:'auto;',
preLink: '//a[@id="pnprev"]',
//preLink:'//table[@id="nav"]/descendant::a[1][parent::td[@class="b"]]',            //上一页链接 xpath 或者 CSS选择器 或者 函数返回值 (可选)
autopager:{
enable:true ,                                                                                               //启用(自动翻页)(可选)
useiframe:false,                                                                                        //是否使用iframe翻页(可选)
iloaded:false,                                                                                      //是否在iframe完全load之后操作..否则在DOM完成后操作.
itimeout:0,                                                                                             //延时多少毫秒后,在操作..
newIframe: false,  // 下一页使用新的 iframe，能解决按钮无法点击的问题
pageElement: '//div[@id="ires"]',                                          //主体内容 xpath 或 CSS选择器 或函数返回值(~~必须~~)
// pageElement:'css;div#ires',
//pageElement:function(doc,win){return doc.getElementById('ires')},
//filter:'//li[@class="g"]',                                                                        //(此项功能未完成)xpath 或 CSS选择器从匹配到的节点里面过滤掉符合的节点.
remain: 1/3,                                                                                                 //剩余页面的高度..是显示高度的 remain 倍开始翻页(可选)
relatedObj: ['css;div#navcnt','bottom'],                                                         //以这个元素当做最底的元素,计算页面总高度的计算.(可选)
replaceE: '//div[@id="navcnt"]',                 //需要替换的部分 xpat h或 CSS选择器 一般是页面的本来的翻页导航(可选);
//replaceE:'css;div#navcnt',
ipages: [true,1],                               //♥3立即翻页,第一项是控制是否在js加载的时候立即翻第二项(必须小于maxpage)的页数,比如[true,3].就是说JS加载后.立即翻3页.(可选)
separator: true,                                 //是否显示翻页导航(可选)
separatorReal: true,
maxpage: 9,                                     //最多翻页数量(可选)
manualA: false,                                  //是否使用手动翻页.▲
HT_insert: ['//div[@id="res"]',2],               //插入方式此项为一个数组: [节点xpath或CSS选择器,插入方式(1：插入到给定节点之前;2：附加到给定节点的里面;)](可选);
//HT_insert:['css;div#res',2],
lazyImgSrc: 'imgsrc',
// 新增的自定义样式。下面这个是调整 Google 下一页可能出现的图片排列问题。
stylish: 'hr.rgsep{display:none;}' +
'.rg_meta{display:none}.bili{display:inline-block;margin:0 6px 6px 0;overflow:hidden;position:relative;vertical-align:top}._HG{margin-bottom:2px;margin-right:2px}',
documentFilter: function(doc){
// 修正下一页的图片
var x = doc.evaluate('//script/text()[contains(self::text(), "data:image/")]', doc, null, 9, null).singleNodeValue;
if (x) {
try {
new Function('document, window, google', x.nodeValue)(doc, unsafeWindow, unsafeWindow.google);
} catch (e) {}
}

// 修正可能出现的 小箭头更多按钮 排版不正确的情况（2014-7-29）
var oClassName = window.document.querySelector('#ires .ab_button').className;
[].forEach.call(doc.querySelectorAll('#ires .ab_button'), function(elem){
if (elem.className != oClassName)
elem.className = oClassName;
});
},
filter: function() {  // 在添加内容到页面后运行

},
startFilter: function(win, doc) {  // 只作用一次
// 移除 Google 重定向
var script = doc.createElement('script');
script.type = 'text/javascript';
script.textContent = '\
Object.defineProperty(window, "rwt", {\
configurable: false,\
enumerable: true,\
get: function () {\
return function() {};\
},\
});\
';
doc.documentElement.appendChild(script);
doc.documentElement.removeChild(script);

// 移动相关搜索到第一页
var brs = doc.getElementById('brs'),
ins = doc.getElementById('ires');
if (brs && ins) {
ins.appendChild(brs);
}
}
}
},
{name: '百度搜索',
// 由于 Super_preloader 默认去掉了 # 后面部分
// url: "^https?://www\\.baidu\\.com/(s|baidu|#wd=)",
url: "^https?://www\\.baidu\\.com/",
enable:true,
nextLink:'//div[@id="page"]/a[contains(text(),"下一页")][@href]',
preLink:'//div[@id="page"]/a[contains(text(),"上一页")][@href]',
autopager: {
pageElement: 'css;div#content_left > *',
HT_insert:['css;div#content_left',2],
replaceE: 'css;#page',
stylish: '.autopagerize_page_info, div.sp-separator {margin-bottom: 10px !important;}',
startFilter: function(win) {
// 设置百度搜索类型为 s?wd=
try {
win.document.cookie = "ISSW=1";
} catch (ex) {}
}
}
},
{name: '百度搜索 - baidulocal',
url: '^https?://www\\.baidu\\.com/s.*&tn=baidulocal',
nextLink: '//a[font[text()="下一页"]]',
pageElement: '//table[@width="100%" and @border="0"]/tbody/tr/td/ol',
exampleUrl: 'http://www.baidu.com/s?wd=firefox&rsv_spt=1&issp=1&rsv_bp=0&ie=utf-8&tn=baidulocal&inputT=1364',
},
{name: '搜狗搜索',
url:/^https?:\/\/www\.sogou\.com\/(?:web|sogou)/i,
siteExample:'http://www.sogou.com',
enable:true,
nextLink:'//div[@id="pagebar_container"]/a[@id="sogou_next"]',
autopager:{
pageElement:'//div[@class="results"]',
replaceE: 'id("pagebar_container")'
}
},
{name: 'Bing网页搜索',
url:/bing\.com\/search\?q=/i,
siteExample:'bing.com/search?q=',
nextLink:'//nav[@aria-label="navigation"]/descendant::a[last()][@class="sb_pagN"]',
autopager:{
pageElement: '//ol[@id="b_results"]/li[@class="b_algo"]',
replaceE: '//nav[@aria-label="navigation"]'
}
},
// =============== baidu 其它 ===========
{name: '百度贴吧列表',
url: /^http:\/\/tieba\.baidu\.(cn|com)\/f/i,
nextLink: '//div[@class="pager clearfix"]/descendant::a[@class="next"]',
preLink: '//div[@class="pager clearfix"]/descendant::a[@class="pre"]',
autopager: {
enable: true,
pageElement: '//ul[@id="thread_list"]/li',
replaceE: 'css;#frs_list_pager',
useiframe: true,
// newIframe: true,
iloaded: true,
// lazyImgSrc: "bpic",
}
},
{name: '百度贴吧帖子',
url:/^http:\/\/tieba\.baidu\.com\/p/i,
siteExample:'http://tieba.baidu.com/p/918674650',
nextLink:'//ul[@class="l_posts_num"]/descendant::a[text()="下一页"]',
preLink:'//ul[@class="l_posts_num"]/descendant::a[text()="上一页"]',
autopager:{
enable: true,
pageElement: "id('j_p_postlist')",  // "css;.l_post"
replaceE: "css;.l_posts_num > .l_pager",
useiframe: true,
// newIframe: true,
iloaded: true
// filter: function(pages){
//     var pb = unsafeWindow.pb;
//     pb.ForumListV3.initial();
// }
}
},
{name: '百度吧内搜索',
url: /^http:\/\/tieba\.baidu\.com\/f\/search/i,
siteExample: 'http://tieba.baidu.com/f/search/',
nextLink: 'auto;',
pageElement: 'css;.s_post'
},
{name: '百度新闻搜索',
url: '^http://news\\.baidu\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/ns',
nextLink: 'id("page")/a[text()="下一页>"]',
pageElement: 'id("content_left")',
},
{name: '百度知道',
url:/^https?:\/\/zhidao\.baidu\.com\/search\?/i,
siteExample:'http://zhidao.baidu.com/search?pn=0&&rn=10&word=%BD%AD%C4%CFstyle',
nextLink:'auto;',
pageElement:'css;#wgt-list',
},
{name: '百度空间',
url: '^http://hi\\.baidu\\.com',
nextLink: 'id("pagerBar")/div/a[@class="next"]',
autopager: {
useiframe: true,
pageElement: '//div[@class="mod-realcontent mod-cs-contentblock"]',
},
exampleUrl: 'http://hi.baidu.com/gelida',
},
{name: '百度文库搜索',
url: /^http:\/\/wenku\.baidu\.com\/search\?/i,
exampleUrl: 'http://wenku.baidu.com/search?word=firefox&lm=0&od=0&fr=top_home',
nextLink: '//div[@class="page-content"]/a[@class="next"]',
autopager: {
pageElement: '//div[@class="search-result"]',
}
},

// ================ news、Reading ===========================
{name: '新浪新闻',
url: /^http:\/\/[a-z]+\.sina\.com\.cn\//i,
exampleUrl: 'http://news.sina.com.cn/c/sd/2013-11-08/165728658916.shtml',
nextLink: '//p[@class="page"]/a[text()="下一页"]',
autopager: {
pageElement: '//div[@id="artibody"]',
relatedObj: true,
}
},
{name: '搜狐新闻',
url: /^http:\/\/news\.sohu\.com\/.*\.shtml/i,
exampleUrl: 'http://news.sohu.com/20120901/n352071543.shtml',
nextLink: 'auto;',
autopager: {
pageElement: 'id("contentText")',
}
},
{name: '新华网新闻页面',
url:/http:\/\/news\.xinhuanet\.com\/.+\/\d+-/i,
siteExample:'http://news.xinhuanet.com/politics/2010-07/19/c_12347755.htm',
nextLink:'//div[@id="div_currpage"]/a[text()="下一页"]',
autopager:{
remain:2,
pageElement:'//table[@id="myTable"] | id("content")'
}
},
{name: '腾讯网-大成网,新闻',
url: /^http:\/\/[a-z]+\.qq\.com\/.*\.htm/i,
exampleUrl: 'http://cd.qq.com/a/20131119/002713.htm',
nextLink: 'id("ArtPLink")/ul/li/a[text()="下一页"]',
autopager: {
pageElement: 'id("Cnt-Main-Article-QQ")',
relatedObj: true,
replaceE: "css;#ArtPLink"
}
},
// ========================= video =====================
{name: '爱奇艺',
url: /^http:\/\/(list|so)\.iqiyi\.com\//i,
nextLink: '//div[@class="page"]/a[text()="下一页"]',
autopager: {
pageElement: '//div[@class="list_content"]/div[@class="list0"] | //div[@class="s_main"]/descendant::div[@class="mod_sideright clearfix"]/ul',
}
},

{name: '搜狐视频',
url: /^http:\/\/so\.tv\.sohu\.com\/list/i,
exampleUrl: 'http://so.tv.sohu.com/list_p1169_p2_u4E16_u754C_u676F_p3_p4_p5_p6_p7_p8_p9_p10_p11.html',
nextLink: '//div[@class="page"]/a[@class="next"]',
autopager: {
pageElement: 'id("contentList")/div[@class="column-bd clear"]/ul[@class="cfix"]',
replaceE: 'id("contentList")/div[@class="page"]',
}
},
{name: 'bilibili',
"url": "^http://(www\\.bilibili\\.tv/search|space\\.bilibili\\.tv/)",
"nextLink": "//div[@class=\"pagelistbox\"]/a[@class=\"nextPage\"]|//ul[@class=\"page\"]/li[@class=\"current\"]/following-sibling::li[1]/a",
"pageElement": "//div[@class=\"searchlist\"]/ul[@class=\"search_result\"]/li|//div[@class=\"main_list\"]/ul/li"
},

// ====================== shopping、生活 ===========================
{name: '淘宝搜索',
url: '^http://(?:list|s|search[^.]*)\\.taobao\\.com/search',
nextLink: '//a[@class="page-next"]',
autopager: {
pageElement: '//div[@class="tb-content"]',
lazyImgSrc: 'data-lazyload-src|data-ks-lazyload',
}
},
{name: "淘宝",
url: /^http:\/\/(?!bbs).*\.taobao\.com\//i,
nextLink: 'auto;',
autopager: {
pageElement: '//div[@id="J_ShopSearchResult"]/div/div[contains(@class, "shop-hesper-bd")] | id("J_ItemListsContainer")/ul[@class="item-lists"]',
lazyImgSrc: 'data-lazyload-src|data-ks-lazyload',
}
},
{name: '天猫 - 搜索',
url: '^http://list\\.tmall\\.com//?search_product\\.htm\\?',
nextLink: '//a[@class="ui-page-next" and (text()="下一页>>")]',
autopager: {
pageElement: '//div[@id="J_ItemList"]',
relatedObj: true,
replaceE: '//div[@class="ui-page-wrap"]',
lazyImgSrc: 'data-lazyload-src|data-ks-lazyload',
},
},
{name: '店内搜索页-淘宝网',
url: /^http:\/\/[^.]+\.taobao\.com\/search\.htm\?/i,
exampleUrl: 'http://jiaqibaihou.taobao.com/search.htm?spm=a1z10.3.w4002-1381691988.18.GgWBry&mid=w-1381691988-0&search=y&keyword=%BC%AA%C1%D0&pageNo=1',
nextLink: '//a[(text()="下一页")][not(@class="disable")]',
autopager: {
pageElement: '//div[@id="J_ShopSearchResult"]/div/div[contains(@class, "shop-hesper-bd")]',
lazyImgSrc: 'data-lazyload-src|data-ks-lazyload',
}
},

{name: '京东商城',
url: /^http:\/\/.*\.jd\.com\//i,
exampleUrl: 'http://list.jd.com/670-686-690-0-0-0-0-0-0-0-1-1-1-1-18-1574-29455-0.html',
nextLink: 'auto;',
autopager: {
pageElement: 'id("plist")',
useiframe: true,
lazyImgSrc: 'data-lazyload',
}
},

{name: '亚马逊',
url: /^http:\/\/www\.amazon\.cn\/gp\/search\//i,
nextLink: 'auto;',
autopager: {
pageElement: 'id("mainResults") | id("btfResults")',
}
},
{name: '易迅网',
url: /^http:\/\/searchex\.yixun\.com\//i,
exampleUrl: 'http://searchex.yixun.com/705798t706810-1001-/?YTAG=3.706810246020',
nextLink: '//div[@class="sort_page_num"]/a[@title="下一页"]',
autopager: {
pageElement: '//UL[@id="itemList"]',
lazyImgSrc: 'init_src'
}
},

{name: '机锋网',
url: /^http:\/\/www\.gfan\.com\/review\/\w+\.html/,
exampleUrl: 'http://www.gfan.com/review/2014091557751.html',
nextLink: 'auto;',
autopager: {
pageElement: '//div[@class="news-content"]',
relatedObj: true
}
},

// ========================= 知识、阅读 ============================
{name: '豆瓣-书影音评论',
url: '^http://.*\\.douban\\.com/subject',
nextLink: '//div[@class="paginator"]/span[@class="next"]/a[contains(text(),"后页>")]',
autopager: {
pageElement: '//ul[contains(@class,"topic-reply")] | //div[@class="article"]/table | //div[@id="comments" or @class="post-comments"]'
}
},
{name: '我的小组话题 - 豆瓣',
url: /^http:\/\/www\.douban\.com\/group\//i,
exampleUrl: 'http://www.douban.com/group/',
nextLink: '//div[@class="paginator"]/span[@class="next"]/a[text()="后页>"]',
autopager: {
pageElement: 'id("content")/div/div[@class="article"]',
}
},

{name: '知乎',
url: /^http:\/\/www\.zhihu\.com\/collection/i,
exampleUrl: 'http://www.zhihu.com/collection/19561986',
nextLink: 'auto;',
autopager: {
pageElement: 'id("zh-list-answer-wrap")/div[@class="zm-item"]',
useiframe: true,
newIframe: true
}
},

{name: '知乎日报',
url: '^http://zhihudaily\\.jd-app\\.com/',
nextLink: '//h3/a[text()="<<< 前一天"]',
autopager: {
pageElement: 'css;body > *',
separatorReal: false,
},
exampleUrl: 'http://zhihudaily.jd-app.com/',
},

// ========================= bbs、blog ======================
{name: '天涯论坛_帖子列表',
url: '^http://bbs\\.tianya\\.cn/list',
nextLink: '//a[text()="下一页"]',
pageElement: '//div[@class="mt5"]',
},
{name: '天涯论坛帖子',
url:/http:\/\/bbs\.tianya\.cn\/.+\.shtml/i,
siteExample:'http://bbs.tianya.cn/post-feeling-2792523-1.shtml',
nextLink:'//div[@class="atl-pages"]/descendant::a[text()="下页"][@href]',
autopager:{
useiframe:true,
pageElement:'//div[@class="atl-main"]',
lazyImgSrc: 'original',
filter: function(pages){
var see_only_uname = unsafeWindow.see_only_uname;
var setOnlyUser = unsafeWindow.setOnlyUser;
if(see_only_uname){
setOnlyUser(see_only_uname);
}
}
}
},
{name: 'Firefox中文社区 - 帖子',
url: '^https?://www\\.firefox\\.net\\.cn/read',
nextLink: '//div[@class="pages"]/a[contains(text(), "下一页")]',
autopager: {
pageElement: 'id("J_posts_list")/*',
useiframe: true,
newIframe: true
}
},
{name: 'Mozilla Addons - 用户信息',
url: /^https:\/\/addons\.mozilla\.org\/zh-CN\/[^\/]+\/user\//i,
exampleUrl: 'https://addons.mozilla.org/zh-CN/firefox/user/Vasiliy_Temnikov/',
nextLink: '//p[@class="rel"]/a[@class="button next"]',
autopager: {
pageElement: 'id("my-addons")',
relatedObj: true,
}
},
{name: 'Mozilla Addons',
url: /^https?:\/\/addons\.mozilla\.org\/[^\/]+\/firefox/i,
siteExample: 'https://addons.mozilla.org/zh-CN/firefox/',
nextLink: '//p[@class="rel"]/a[@class="button next"][@href] | //ol[@class="pagination"]/li/a[@rel="next"][@href]',
autopager: {

pageElement: '//div[@id="pjax-results" or @class="separated-listing"]/div[@class="items"] | //section[@class="primary"]/div/div[@class="items"] | //ul[@class="personas-grid"] | //div[@id="my-addons"] | //div[@id="reviews"]',
relatedObj: true,
replaceE: 'css;.paginator'
}
},
{name: '搜索 | Mozilla 技术支持',
url: '^https://support\\.mozilla\\.org/zh-CN/search\\?',
exampleUrl: 'https://support.mozilla.org/zh-CN/search?esab=a&product=firefox&q=%E7%BE%A4%E7%BB%84',
nextLink: '//a[@class="btn-page btn-page-next" and contains(text(),"下一个")]',
autopager: {
pageElement: '//div[@id="search-results"]/div[@class="grid_9"]/div[@class="content-box"]',
}
},
{name: 'Discuz X2.5修复',
url:/^http?:\/\/(bbs.gfan|bbs.xda|bbs.weiphone|bbs.feng|www.weiqitv|www.diypda|f.ppxclub|bbs.sd001|bbs.itiankong)\.(com|cn)/i,
nextLink:'auto;',
autopager:{
pageElement:'//div[@id="threadlist"] | //div[@id="postlist"]',
replaceE: '//div[@class="pg"][child::a[@class="nxt"]]',
}
},

{name: 'Discuz 页面跳转修复',
url:/^http:\/\/(bbs.pcbeta|bbs.besgold|www.pt80)\.(com|net)/i,
nextLink:'//div[@class="pg"]/descendant::a[@class="nxt"]',
autopager:{
pageElement:'//div[@id="postlist"] | //form[@id="moderate"]',
replaceE: '//div[@class="pg"][child::a[@class="nxt"]]',
}
},

{name: '55188论坛',
url:/http:\/\/www\.55188\.com/i,
siteExample:'http://www.55188.com/forum-8-1.html',
nextLink:'auto;',
autopager:{
pageElement:'//div[@class="mainbox threadlist"] | //div[@class="mainbox viewthread"]',
}
},
{name: 'PCHOME 社区',
url:/http:\/\/club\.pchome\.net/i,
siteExample:'http://club.pchome.net/forum_1_15.html#',
nextLink:'auto;',
autopager:{
pageElement:'//form[@id="mytopics"] | //div[@id="weibo_app"]',
}
},
{name: 'pconline',
url: '^http://[a-z]+\\.pconline\\.com\\.cn/',
nextLink: '//div[contains(@class, "pconline_page") or contains(@class, "pager")]/a[@class="next"]',
autopager: {
pageElement: '//div[@id="article"]//div[@class="content"] | //ul[@id="ulHoverPic"] | //table[@class="posts"] | id("post_list") | id("topicList")',
relatedObj: true,
replaceE: 'css;.pconline_page',
},
exampleUrl: 'http://diy.pconline.com.cn/377/3774616.html',
},
// === 壁纸、素材、icon
{name: '桌酷壁纸',
url: /^http:\/\/www\.zhuoku\.com\/.*\.htm/i,
exampleUrl: 'http://www.zhuoku.com/zhuomianbizhi/computer-kuan/20140107052306.htm',
nextLink: '//div[@class="turn"]/a[text()="下一页"]',
autopager: {
pageElement: 'id("liebiao")',
}
},
{name: '统一壁纸站',
url: '^http://www\\.3987\\.com/desk/wall/*',
nextLink: '//a[@hidefocus="true" and @target="_self" and @title="下一页"]',
pageElement: 'id("Article")/div[@class="big-pic"]',
exampleUrl: 'http://www.3987.com/desk/wall/31420.html',
},

{name: '昵图网',
url: /^http:\/\/[a-z]+\.nipic\.com\//i,
exampleUrl: 'http://soso.nipic.com/search.aspx?t=tk&q=%B7%E2%C3%E6',
nextLink: 'auto;',
autopager: {
pageElement: 'id("bd") | //ul[@class="search-result-box clearfix"] | //center/table[@width="900" and @cellspacing="0" and @cellpadding="0" and @border="0"]',
lazyImgSrc: "data-original",
stylish: '.lazy { display: block; }'
}
},
{name: 'easyicon.net',
url: '^http://www\\.easyicon\\.net/iconsearch/',
nextLink: '//div[@class="pages_all"]/a[text()="下一页>"]',
pageElement: 'id("result_right_layout")',
exampleUrl: 'http://www.easyicon.net/iconsearch/feed/&color=black',
},
{name: 'iconarchive',
url: '^http://www\\.iconarchive\\.com/search\\?q=*',
nextLink: '//div[@class="pagination"]/a[@class="next"]',
pageElement: 'id("layout-search-content")',
exampleUrl: 'http://www.iconarchive.com/search?q=pin',
},
{name: 'Find Icons',
url: '^http://findicons\\.com/search/',
nextLink: '//div[@class="pages"]/a[contains(text(), "Next") or contains(text(), "下一页")]',
pageElement: 'id("search_con")/div[@class="icon_list icon_list_165"]',
exampleUrl: 'http://findicons.com/search/earth',
},

// ========================= software ================================
{name: '小众软件',
url: 'http://www\\.appinn\\.com/',
nextLink: '//a[@class="nextpostslink"]',
pageElement: '//div[@id="spost"]',
},
{name: '善用佳软',
url: /^http:\/\/xbeta\.info\/page\//i,
exampleUrl: 'http://xbeta.info/page/2',
nextLink: '//div[@class="wp-pagenavi"]/a[@class="nextpostslink"]',
autopager: {
pageElement: 'id("entries-in")/div[@class="post"]',
replaceE: "css;#entries-in > .wp-pagenavi"
}
},
{name: '异次元软件世界',
url: /^http:\/\/www\.iplaysoft\.com\//i,
exampleUrl: 'http://www.iplaysoft.com/tag/%E5%90%8C%E6%AD%A5',
nextLink: '//span[@class="pagenavi_c"]/a[text()="下一页"]',
autopager: {
pageElement: 'id("postlist")/div[@class="entry"]',
replaceE: '//div[@class="pagenavi"]/span[@class="pagenavi_c"]'
}
},
{name: 'PlayNext - 低调的异次元',
url: '^http://www\\.playnext\\.cn/',
nextLink: '//div[@class="pagenavi"]/a[contains(text(), "下一页")]',
pageElement: '//div[@id="container"]/div[@class="content"]/div[@class="post-list"]',
},
{name: 'iPc.me - 与你分享互联网的精彩！',
url: '^http://www\\.ipc\\.me/',
nextLink: '//div[@class="pagenavi"]/a[contains(text(), "下一页")]',
pageElement: 'id("posts-list")',
},
{name: '独木成林',
url: '^http://www\\.guofs\\.com/',
nextLink: '//a[@class="nextpostslink"]',
pageElement: 'id("content")',
exampleUrl: 'http://www.guofs.com/',
},

{name: '绿色下载吧',
url: /^http:\/\/www\.xiazaiba\.com\//,
exampleUrl: 'http://www.xiazaiba.com/newsoft.html',
nextLink: '//div[@class="page-num" or @class="ylmf-page"]/a[@class="nextprev"]',
autopager: {
pageElement: 'id("j_soft_list") | //ul[@class="list-soft list-soft-title j-hover"]',
}
},

// ========================= dev =================================
{name: 'User Scripts',
url: /^https?:\/\/userscripts\.org/i,
nextLink: 'auto;',
autopager: {
pageElement: 'id("review-list") | //tr[starts-with(@id, "scripts-")] | //tr[starts-with(@id, "posts-")]',
replaceE: '//div[@class="pagination"]'
}
},
{name: 'User scripts on Greasy Fork',
url: /^https:\/\/greasyfork\.org/i,
nextLink: '//a[@rel="next"]',
autopager: {
pageElement: 'id("browse-script-list") | id("Content")/ul',
}
},
{name: 'User Styles',
url: /^https?:\/\/(?:forum\.)?userstyles\.org\//i,
nextLink: ['//a[@class="Next" and text()="›"]', 'auto;'],
autopager: {
pageElement: '//article[starts-with(@class,"style-brief")] | id("Content")/ul[@class="DataList Discussions"]',
replaceE: 'css;.pagination'
}
},
// ========================= novel =============================
{name: '起点文学',
url:/^http:\/\/(www|read)\.(qidian|qdmm|qdwenxue)\.com\/BookReader\/\d+,\d+/i,
siteExample:'http://www.qidian.com/BookReader/1545376,27301383.aspx',
useiframe:true,
nextLink:'//a[@id="NextLink"]',
autopager:{
enable:true,
useiframe:true,
pageElement:'//div[@id="maincontent"]/div[@class="booktitle"] | //div[@id="maincontent"]/div[@id="content"]'
}
},
{name: '17k',
url:/^http:\/\/(mm.17k|www.17k)\.com\/chapter\/.+\.html/i,
siteExample:'http://www.17k.com/chapter/143095/3714822.html',
nextLink:'//div[@class="read_bottom"]/descendant::a[text()="下一章"]',
autopager:{
pageElement:'//div[@class="readAreaBox"]'
}
},
{name: '纵横书库',
url:/^http:\/\/book\.zongheng\.com\/chapter\/.+\.html/i,
siteExample:'http://book.zongheng.com/chapter/239553/4380340.html',
nextLink:'//div[@class="tc quickkey"]/descendant::a[text()="下一章"]',
autopager:{
pageElement:'//div[@class="readcon"]'
}
},
{name: '纵横女生',
url:/^http:\/\/www\.mmzh\.com\/chapter\/.+\.html/i,
siteExample:'http://www.mmzh.com/chapter/182074/3287355.html',
nextLink:'//div[@class="tc key"]/descendant::a[text()="下一章"]',
autopager:{
pageElement:'//div[@class="book_con"]'
}
},
{name: '玄幻小说网',
url:/^http:\/\/www\.xhxsw\.com\/books\/.+\.htm/i,
siteExample:'http://www.xhxsw.com/books/1063/1063066/10579171.htm',
nextLink:'//div[@id="footlink"]/descendant::a[text()="下一页"]',
autopager:{
pageElement:'//div[@id="content"]'
}
},

{name: '顶点小说',
url: '^http://www\\.23us\\.com/html/.+\\.html',
siteExample: 'http://www.23us.com/html/26/26627/16952316.html',
nextLink: ' //dd[@id="footlink"]/descendant::a[text()="下一页"]',
pageElement: 'id("amain")/dl/dd/h1 | id("contents")'
},
{name: '快眼文学网',
url:/^http:\/\/www\.kywxw\.com\/.+\.html/i,
siteExample:'http://www.kywxw.com/0/12/3792643.html',
nextLink:'//div[@id="thumb"]/descendant::a[text()="下一章"]',
autopager:{
useiframe:true,
pageElement:'//div[@id="content"]'
}
},
{name: '就爱文学',
url:/^http:\/\/www\.92wx\.org\/html\/.+\.html/i,
siteExample:'http://www.92wx.org/html/0/807/220709.html',
nextLink:'//div[@id="page_bar"]/descendant::a[text()="下一章"]',
autopager:{
pageElement:'//div[@id="chapter_content"]'
}
},
{name: '天天中文',
url:/^http:\/\/www\.360118\.com\/html\/.+\.html/i,
siteExample:'http://www.360118.com/html/21/21951/5416831.html',
nextLink:'//div[@id="FootLink"]/descendant::a[text()="下一页（快捷键→）"]',
autopager:{
pageElement:'//div[@id="content"]'
}
},
{name: '六九中文',
url:/^http:\/\/www\.69zw\.com\/xiaoshuo\/.+\.html/i,
siteExample:'http://www.69zw.com/xiaoshuo/21/21943/4461482.html',
nextLink:'//div[@class="chapter_Turnpage"]/descendant::a[text()="下一章"]',
autopager:{
pageElement:'//div[@class="novel_content"]'
}
},
{name: '华夏书库',
url:/^http:\/\/www\.hxsk\.net\/files\/article\/html\/.+\.html/i,
siteExample:'http://www.hxsk.net/files/article/html/67/67509/12704488.html',
nextLink:'//td[@class="link_14"]/descendant::a[text()="下一页"]',
autopager:{
pageElement:'//table[@class="border_l_r"]'
}
},
{name: '书路/3K',
url:/^http:\/\/www\.(shuluxs|kkkxs)\.com\/files\/article\/html\/.+\.html/i,
siteExample:'http://www.shuluxs.com/files/article/html/22/22306/8727879.html',
nextLink:'auto;',
autopager:{
pageElement:'//div[@id="content"]'
}
},
{name: '书山路',
url:/^http:\/\/www\.shu36\.com\/book\/.+\.html/i,
siteExample:'http://www.shu36.com/book/0/1/3.html',
nextLink:'auto;',
autopager:{
pageElement:'//div[@id="content"]'
}
},
{name: '落秋',
url:/^http:\/\/www\.luoqiu\.com\/html\/.+\.html/i,
siteExample:'http://www.luoqiu.com/html/18/18505/1385765.html',
nextLink:'//div[@id="bgdiv"]/descendant::a[text()="下一页"]',
autopager:{
pageElement:'//table[@class="border_l_r"]',
}
},
{name: '君子网',
url:/^http:\/\/www\.junziwang\.com\/.+\.html/i,
siteExample:'http://www.junziwang.com/0/155/25137.html',
nextLink:'//div[@id="footlink"]/descendant::a[text()="下一页"]',
autopager:{
pageElement:'//div[@id="content"]'
}
},
{name: '哈罗小说网',
url:/^http:\/\/www\.hellodba\.net\/files\/article\/html\/.+\.html/i,
siteExample:'http://www.hellodba.net/files/article/html/0/46/21565.html',
nextLink:'//div[@class="papgbutton"]/descendant::a[text()="下一章"]',
autopager:{
pageElement:'//div[@id="htmlContent"]'
}
},
{name: '百书楼',
url:/^http:\/\/baishulou\.com\/read\/.+\.html/i,
siteExample:'http://baishulou.com/read/10/10647/2536085.html',
nextLink:'//a[text()="下一页(快捷键:→)"][@href]',
autopager:{
pageElement:'//div[@id="content"]'
}
},
{name: '万书楼',
url:/^http:\/\/www\.wanshulou\.com\/xiaoshuo\/.+\.shtml/i,
siteExample:'http://www.wanshulou.com/xiaoshuo/29/29091/2062593.shtml',
nextLink:'//div[@id="LinkMenu"]/descendant::a[text()="下一章"]',
autopager:{
pageElement:'//div[@id="BookText"]'
}
},
{name: '万卷书屋',
url:/^http:\/\/www\.wjsw\.com\/html\/.+\.shtml/i,
siteExample:'http://www.wjsw.com/html/35/35404/2887335.shtml',
nextLink:'//div[@id="bookreadbottom"]/descendant::a[text()="下一章"]',
autopager:{
pageElement:'//div[@id="maincontent"]'
}
},
{name: '书书网',
url:/^http:\/\/www\.shushuw\.cn\/shu\/.+\.html/i,
siteExample:'http://www.shushuw.cn/shu/28560/4509794.html',
nextLink:'//div[@align="center"]/a[text()="下页"][@href]',
autopager:{
pageElement:'//div[@class="cendiv"]'
}
},

{name: '青帝文学网',
url:/^http:\/\/www\.qingdi\.com\/files\/article\/html\/.+\.html/i,
siteExample:'http://www.qingdi.com/files/article/html/0/27/13314.html',
nextLink:'//div[@class="readerFooterPage"]/descendant::a[text()="下一页"]',
autopager:{
useiframe:true,
pageElement:'//div[@class="readerTitle"]'
}
},
{name: '笔下文学',
url:/^http:\/\/www\.bxwx\.org\/b\/.+\.html/i,
siteExample:'http://www.bxwx.org/b/56/56907/9020932.html',
nextLink:'//div[@id="footlink"]/descendant::a[text()="下一页[→]"]',
autopager:{
useiframe:true,
pageElement:'//div[@id="content"]'
}
},
{name: '笔趣阁',
url:/^http:\/\/www\.biquge\.com\/.+\.html/i,
siteExample:'http://www.biquge.com/0_67/471472.html',
nextLink:'//div[@class="bottem2"]/descendant::a[text()="下一章"]',
autopager:{
pageElement:'//div[@id="content"]'
}
},
{name: '小说客栈',
url:/^http:\/\/www\.xskz\.com\/xiaoshuo\/.+\.shtml/i,
siteExample:'http://www.xskz.com/xiaoshuo/29/29091/2062593.shtml',
nextLink:'//div[@id="LinkMenu"]/descendant::a[text()="下一章"]',
autopager:{
pageElement:'//div[@id="BookText"]'
}
},
{name: '翠微居',
url:/^http:\/\/www\.cuiweiju\.com\/html\/.+\.html/i,
siteExample:'http://www.cuiweiju.com/html/124/124362/6468025.html',
nextLink:'//p[@class="cz_bar"]/descendant::a[text()="下一章 》"]',
autopager:{
pageElement:'//div[@class="book_wrap"]'
}
},
{name: '在线书吧',
url:/^http:\/\/www\.bookba\.net\/Html\/Book\/.+\.html/i,
siteExample:'http://www.bookba.net/Html/Book/15/15995/2030251.html',
nextLink:'//td[@id="thumb"]/descendant::a[text()="下一章"]',
autopager:{
useiframe:true,
pageElement:'//div[@id="content"]'
}
},
{name: '文学迷',
url:/^http:\/\/www\.wenxuemi\.net\/files\/article\/html\/.+\.html/i,
siteExample:'http://www.wenxuemi.net/files/article/html/10/10884/4852125.html',
nextLink:'//div[@id="footlink"]/descendant::a[text()="下一页"]',
autopager:{
pageElement:'//div[@id="content"]'
}
},
{name: '爱尚文学网',
url:/^http:\/\/www\.kenshu\.cc\/files\/article\/html\/.+\.html/i,
siteExample:'http://www.kenshu.cc/files/article/html/5/5379/6389640.html',
nextLink:'//dd[@id="footlink"]/descendant::a[text()="下一页"]',
autopager:{
pageElement:'//div[@class="bdsub"]'
}
},
{name: 'E品中文网',
url:/^http:\/\/www\.epzw\.com\/files\/article\/html\/.+\.html/i,
siteExample:'http://www.epzw.com/files/article/html/50/50244/3271485.html',
nextLink:'//div[@id="link"]/descendant::a[text()="下一页"]',
autopager:{
pageElement:'//div[@id="content"]'
}
},
{name: '大家读书院',
url:/^http:\/\/www\.dajiadu\.net\/files\/article\/html\/.+\.html/i,
siteExample:'http://www.dajiadu.net/files/article/html/14/14436/3337407.html',
nextLink:'//div[@id="footlink"]/descendant::a[text()="下一页"]',
autopager:{
pageElement:'//div[@id="center"]'
}
},
{name: '北京爱书',
url:/^http:\/\/www\.bj-ibook\.cn\/book\/.+\.htm/i,
siteExample:'http://www.bj-ibook.cn/book/17/t10409k/12.htm',
nextLink:'//div[@class="zhtop"]/a[text()="下一页（快捷键→）"][@href]',
autopager:{
useiframe:true,
pageElement:'//div[@id="bmsy_content"]'
}
},
{name: '小说570',
url:/^http:\/\/www\.xiaoshuo570\.com/i,
siteExample:'http://www.xiaoshuo570.com/11/11844/2678383.html',
nextLink:'//div[@id="thumb"]/a[text()="下一页"][@href]',
autopager:{
useiframe:true,
pageElement:'//div[@class="fonts_big"]',
}
},
{name: '看书',
url:/^http:\/\/www\.kanshu\.com\/files\/article\/html\/.+\.html/i,
siteExample:'http://www.kanshu.com/files/article/html/30997/935806.html',
nextLink:'//div[@class="yd_linebot"]/descendant::a[text()="下一章"]',
autopager:{
pageElement:'//table[@class="yd_table"]'
}
},
{name: '全本小说网',
url:/^http:\/\/www\.quanben\.com\/xiaoshuo\/.+\.html/i,
siteExample:'http://www.quanben.com/xiaoshuo/10/10412/2095098.html',
autopager:{
pageElement:'//div[@id="content"]'
}
},

{name: '89文学',
url:/^http:\/\/89wx\.com\/.+\.htm/i,
siteExample:'http://89wx.com/html/book/70/70732/6641331.htm',
nextLink:'//dd[@id="footlink"]/descendant::a[text()="下一页"]',
autopager:{
pageElement:'//dd[@id="contents"]'
}
},
{name: '极速小说网',
url:/^http:\/\/www\.186s\.cn\/files\/article\/html\/.+\.html/i,
siteExample:'http://www.186s.cn/files/article/html/0/304/4528937.html',
nextLink:'//div[@id="footlink"]/descendant::a[text()="下一页"]',
autopager:{
pageElement:'//div[@id="content"]'
}
},
{name: '手打8',
url:/^http:\/\/shouda8\.com\/.+\.html/i,
siteExample:'http://shouda8.com/zhangyuxingchen/85649.html',
nextLink:'//div[@id="papgbutton"]/descendant::a[text()="下一章（快捷键 →）"]',
autopager:{
pageElement:'//div[@id="content"]'
}
},
{name: '闪文书库',
url:/^http:\/\/read\.shanwen\.com\/.+\.html/i,
siteExample:'http://read.shanwen.com/14/14616/1011063.html',
nextLink:'//td[@class="tb0"]/descendant::a[text()="下一页"]',
autopager:{
pageElement:'//div[@id="content"]'
}
},
{name: 'PaiTxt',
url:/^http:\/\/paitxt\.com\/.+\.html/i,
siteExample:'http://paitxt.com/24/24596/4507312.html',
nextLink:'//div[@class="book_middle_text_next"]/descendant::a[text()="下一章(快捷键:→)"]',
autopager:{
pageElement:'//div[@id="booktext"]'
}
},
{name: '好书楼',
url:/^http:\/\/www\.haoshulou\.com\/.+\.html/i,
siteExample:'http://www.haoshulou.com/Hao/6/60238.html',
nextLink:'//div[@class="movenext"]/descendant::a[text()="下一章"]',
autopager:{
pageElement:'//div[@id="booktext"]'
}
},
{name: 'BookLink.Me:最有爱的小说搜索引擎',
url: '^http://booklink\\.me/',
nextLink: '//a[text()="下一页"] | //a[font[text()="下一页"]]',
pageElement: '//table[@width="100%"][@cellspacing="0"][@cellpadding="2"]',
scroll_only: true
},


//-================ 手机网站 ========================
{name: '手机百度百科',
url: /^http:\/\/wapbaike\.baidu\.com\//i,
exampleUrl: 'http://wapbaike.baidu.com/goodlist?uid=F381CCCD6FD2F58151EFFB4A63BFA4FF&ssid=0&pu=sz%401321_1004&bd_page_type=1&from=844b&st=4&step=2&net=1&bk_fr=bk_more_glist',
nextLink: '//div[@class="pages"]/a[text()="下一页"] | //div[@class="page"]/p[@class="next"]/a[text()="下页"] | //table[@class="table next"]//a[text()="下页"] | //a[@class="m-rm-5" and text()="余下全文"]',
autopager: {
pageElement: '//div[@class="bd"] | //div[@class="list"] | id("lemma-content")',
separatorReal: false,
replaceE: 'css;.page > .p-num'
}
},
{name: '手机豆瓣',
url: /^http:\/\/m\.douban\.com\/.*/i,
exampleUrl: 'http://m.douban.com/book/subject/1088065/reviews?session=c0ea1419',
nextLink: '//div[@class="pg" or @class="paginator"]/a[text()="下一页"]',
autopager: {
pageElement: 'id("bd")/div[@class="itm"] | //div[@class="bd"]/div[@class="list"]',
separatorReal: false
}
},
{name: '手机新浪新闻',
url: /^http:\/\/[a-z]+\.sina\.cn\/\?sa=/i,
exampleUrl: 'http://news.sina.cn/?sa=t124d10608655v71&pos=108&vt=4&clicktime=1386267238910&userid=user138626723891024077253801575993',
nextLink: 'id("j_loadingBtn")',
autopager: {
pageElement: 'id("j_articleContent")',
relatedObj: true
}
},

// ============== google 其它======================
{name: "Google Bookmarks",
"url": "^https?://www\\.google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/bookmarks/",
"nextLink": "//div[contains(concat(\" \", @class, \" \"), \" kd-buttonbar \")]//tr/td[last()-1 or last]/a[img[contains(@src,\"right.png\")]]",
"pageElement": "id(\"search\")"
},
{name: "Google Code List",
url: "^https?://code\\.google\\.com/[pr]/(?:[^/]+/){2}list",
nextLink: "id(\"colcontrol\")//div[contains(concat(\" \", @class, \" \"), \" pagination \")]/a[contains(., \"›\")]",
pageElement: "id(\"resultstable\")//tr"
},
{
"url": "^https?://code\\.google\\.com/hosting/search\\?",
"nextLink": "id(\"serp\")/following::a[contains(., \"Next\")][1]",
"pageElement": "id(\"serp\")/*"
},
{
"url": "^http://[^.]+\\.google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/codesearch",
"nextLink": "(id(\"navbar\")//td[@class=\"b\"]/a)[last()]",
"pageElement": "//*[self::div[@class=\"h\"] or self::pre[@class=\"j\"] or self::div[@class=\"f\"]]",
"insertBefore": "id(\"navbar\")"
},
{
"url": "^https?://groups\\.google(?:\\.[^./]{2,3}){1,2}/groups/search",
"nextLink": "id(\"navbar\")//td[last()][@class=\"b\"]/a",
"pageElement": "id(\"res\")/*[self::div or self::br]"
},
{
"url": "^http://scholar\\.google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/scholar",
"nextLink": "//div[contains(concat(\" \", @class, \" \"), \" n \")]/table/tbody/tr/td[last()]/a|id(\"gs_n\")//table/tbody/tr/td[span and b]/following-sibling::td/a",
"pageElement": "//form[@name=\"gs\"]/following-sibling::node()[ following::div[contains(concat(\" \", @class, \" \"), \" n \")] ]|id(\"gs_ccl\")/div[@class=\"gs_r\"]"
},
{
"url": "^http://(?:[^.]+\\.)?google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/news",
"nextLink": "id(\"end-next\")/..",
"pageElement": "id(\"search-stories story-articles\")"
},
{
"url": "^https?://www\\.google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/history/",
"nextLink": "//td[@class=\"bl\"][last()-1]/a|//div[@class=\"nn\"]/parent::a",
"pageElement": "//table[@class=\"res\"]"
},
{
"url": "^http://www\\.google\\.[^./]{2,3}(?:\\.[^./]{2,3})?/logos/",
"nextLink": "//div[@class=\"base-nav\"]//a[contains(., \"«\")]",
"pageElement": "id(\"doodles\")|//div[contains(concat(\" \", @class, \" \"), \" title \")]"
},
{
"url": "^http://books\\.google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/books",
"nextLink": "id(\"navbar\")//span[@class=\"navlink\"]/parent::a",
"pageElement": "id(\"main_content\")/*"
},
{
"url": "^https?://appengine\\.google\\.com/datastore/explorer\\?.",
"nextLink": "id(\"ae-datastore-explorer\")//a[@class=\"ae-paginate-next\"]",
"pageElement": "id(\"ae-datastore-explorer-entities\")"
},
{
"url": "^https?://(?:[^/]+\\.)?google(?:\\.\\w{2,3}){1,2}/movies",
"nextLink": "id(\"pnnext\")|id(\"navbar navcnt nav\")//td[span]/following-sibling::td[1]/a|id(\"nn\")/parent::a",
"pageElement": "id(\"movie_results\")/*"
},
{
"url": "^https://chrome\\.google\\.com/webstore/(?:list|search)",
"nextLink": "//table[@class=\"paginator\"]//td[last()]/a",
"pageElement": "//div[@class=\"mod-fullpage\"]/div[@class=\"mod-body\"]"
},
{
"url": "^http://www\\.google\\.com/intl/ja/googlebooks/chrome/",
"nextLink": "id(\"info\")/p[contains(concat(\" \",@class,\" \"),\"nav\")]/a[img[@src=\"images/arrowright.gif\"]]",
"pageElement": "id(\"page\")/div[a[img] or img]"
},
{
"url": "^http://desktop\\.google\\.(?:[^.]{2,3}\\.)?[^./]{2,3}/",
"nextLink": "id(\"content\")/table[@class=\"header\"]//a[contains(., \"»\")]",
"pageElement": "id(\"content\")/*[(self::table and @class=\"gadget\") or (self::br and @style=\"clear: both;\")]"
},
{
"url": "^http://sketchup\\.google\\.com/3dwarehouse/search\\?",
"nextLink": "//div[@class=\"pager_next\"]/parent::a",
"pageElement": "//div[@class=\"searchresult\"]/ancestor::tr[1]"
},
{
"url": "^https://www\\.google\\.com/a/cpanel/[^/]+/",
"nextLink": "//tr//ul[@class=\"inlinelist\"]//a[contains(text(),\"›\")]",
"pageElement": "id(\"list\")"
},
{
"url": "^http://www\\.google\\.com/support/forum/",
"nextLink": "//div[@class=\"wppkrootCSS\"]/a[contains(text(), \">\")]",
"pageElement": "//table[@class=\"lctCSS\"]"
},
{
"url": "^http://www\\.google\\.com/products\\?",
"nextLink": "id(\"nn\")/parent::a",
"pageElement": "id(\"results\")|id(\"results\")/following-sibling::p[@class=\"clear\"]"
},
{
"url": "^http://www\\.google\\.com/reviews/t",
"nextLink": "//a[contains(text(), \"Next\")]",
"pageElement": "id(\"allresults\")/table",
"insertBefore": "//div[contains(concat(\" \", normalize-space(@class), \" \"), \" t_ftr \")]"
},
{
"url": "^http://www\\.google\\.com/cse\\?cx=",
"nextLink": "//div[@class='gsc-cursor-page gsc-cursor-current-page']/following-sibling::node()[1]",
"pageElement": "//div[@class='gsc-webResult gsc-result']",
"insertBefore": "//div[@class='gsc-cursor-box gs-bidi-start-align']"
},
{
"url": "^http://www\\.google(?:\\.[^./]{2,3}){1,2}/m\\?.",
"nextLink": "//*[starts-with(text(), \"Next page\") or starts-with(text(), \"次のページ\")]",
"pageElement": "id(\"universal\")/div[not(@*)]",
"insertBefore": "id(\"universal\")/*[@class][last()]"
},
{
"url": "^http://followfinder\\.googlelabs\\.com/search",
"nextLink": "//td[@class=\"more\"]//a[last()]",
"pageElement": "//table//tr[//div]"
},
{
"url": "^http://www\\.googlelabs\\.com/",
"nextLink": "id(\"nav\")//td[@class=\"cur\"]/following-sibling::td[1]/a",
"pageElement": "id(\"nav\")/preceding-sibling::ul"
},

// ========================= github ================================
{name: "github mix",
"url": "^https?://github\\.com/(?:dashboard|(?:timeline|[^/]+/[^/]+/(?:comments|network/feed)))",
"nextLink": "//a[@hotkey=\"l\"]|//div[contains(concat(\" \",@class,\" \"),\" pagination \")]/a",
"pageElement": "//div[@class=\"news\"]/div[contains(@class, \"alert\")]"
},
{name: "github 搜索",
url: "^https?://github\\.com/search",
nextLink: "//div[@class='pagination']/a[@rel='next']",
autopager: {
pageElement: "id('code_search_results issue_search_results')|//div[@class='sort-bar']/following-sibling::*[following-sibling::span[@class='search-foot-note']]",
insertBefore: "//div[@class='pagination']",
stylish: 'li.repo-list-item { text-align: left; }'
}
},
{
"url": "^https?://gist\\.github\\.com/",
"nextLink": "//div[contains(concat(\" \", @class, \" \"), \" pagination \")]/a[contains(text(),\"Older\")]",
"pageElement": "//div[contains(concat(\" \", @class, \" \"), \" gist-item \")]"
},
// 有点小问题，需要刷新下才有用
{
"url": "^https?://github\\.com/(?:changelog|[^/]+/[^/]+/commits)",
"nextLink": "//a[contains(text(), \"Older\")]",
"pageElement": "//*[starts-with(@class,\"commit-group\")]"
},
{
"url": "^https?://github\\.com/[^/]+/[^/]+/watchers",
"nextLink": "//div[@class=\"pagination\"]/span[@class=\"current\"]/following-sibling::a",
"pageElement": "id(\"watchers\")"
},
{
"url": "^https?://github\\.com/[^/]+/following",
"nextLink": "//a[hotkey='l']",
"pageElement": "id(\"watchers\")"
},
{
"url": "^http://learn\\.github\\.com/p/",
"nextLink": "//a[contains(text(), \"next\")]",
"pageElement": "//div[@class=\"container\"]/div[@id=\"welcome\" or @class=\"content\"]"
},
{
"url": "^http://github\\.com/blog",
"nextLink": "//div[contains(concat(\" \",@class,\" \"),\" pagination \")]/a[contains(text(),\"Next\")]",
"pageElement": "id(\"posts\")/div[contains(concat(\" \",@class,\" \"),\" list \")]/ul/li"
},

// ========= 很少用的 ================
{name: 'bookcool-小说合集',
url: '^http://www\\.bookcool\\.com/.*\\.htm',
nextLink: '//div[@id="object1"]/descendant::a[last()][@href]',
pageElement: '//div[@align="center"]/table[@width !="100%"]',
},
{name: 'Hachiya Makoto',
url: '^http://g\\.e-hentai\\.org/s/.*$',
nextLink: '//img[@src="http://ehgt.org/g/n.png"]/..',
pageElement: '//body/div[@class="sni"]',
exampleUrl: 'http://g.e-hentai.org/s/2221a78fe2/592744-3',
useiframe: true
},
];

//统配规则..用来灭掉一些DZ.或者phpwind论坛系统..此组规则..优先级自动降为最低..
var SITEINFO_TP=[
{name: 'Discuz 论坛 - 搜索',
url: '^https?://bbs\\.[a-z]+\\.cn/search\\.php\\?mod=forum',
preLink: '//div[@class="pages" or @class="pg"]/descendant::a[@class="prev"][@href]',
nextLink: '//div[@class="pages" or @class="pg"]/descendant::a[@class="next" or @class="nxt"][@href]',
autopager: {
pageElement:'//div[@id="threadlist"]',
replaceE: '//div[@class="pg"][child::a[@class="nxt"]]'
}
},
{name: "Discuz 论坛 - 导读",
url: /^https?:\/\/(?:bbs|u)\.[^\/]+\/(?:forum\.php\?mod=guide|home\.php\?mod=space)/i,
preLink: '//div[@class="pages" or @class="pg"]/descendant::a[@class="prev"][@href]',
nextLink: '//div[@class="pages" or @class="pg"]/descendant::a[@class="next" or @class="nxt"][@href]',
autopager: {
pageElement: "//div[@id='postlist'] | //form[@method='post'][@name] | //div[@id='threadlist']/div[@class='bm_c'] | //div[@class='xld xlda']",
replaceE: '//div[@class="pg"][child::a[@class="nxt"]]'
}
},
{name: 'Discuz论坛列表',
url:/^https?:\/\/(?:www\.[^\/]+\/|[^\/]+\/(?:bbs\/)?)(?:2b\/)?(?:(?:forum)|(?:showforum)|(?:viewforum)|(?:forumdisplay))+/i,
preLink:'//div[@class="pages" or @class="pg"]/descendant::a[@class="prev"][@href]',
nextLink:'//div[@class="pages" or @class="pg"]/descendant::a[@class="next" or @class="nxt"][@href] | //div[@class="p_bar"]/a[@class="p_curpage"]/following-sibling::a[@class="p_num"]',
autopager:{
pageElement:'//form[@method="post"][@name] | //div[@id="postlist"]',
replaceE: '//div[@class="pages" or @class="pg"][child::a[@class="next" or @class="nxt"][@href]]',
lazyImgSrc: 'file|pagespeed_lsc_url'
}
},
{name: 'Discuz论坛帖子',
url:/https?:\/\/(?:www\.[^\/]+\/|[^\/]+\/(?:bbs\/)?)(?:2b\/)?(?:(?:thread)|(?:viewthread)|(?:showtopic)|(?:viewtopic))+/i,
preLink:'//div[@class="pages" or @class="pg"]/descendant::a[@class="prev"][@href]',
nextLink:'//div[@class="pages" or @class="pg"]/descendant::a[@class="next" or @class="nxt"][@href] | //div[@class="p_bar"]/descendant::a[text()="››"]',
autopager:{
pageElement:'//div[@id="postlist"] | //form[@method="post"][@name]',
replaceE: '//div[@class="pages" or @class="pg"][child::a[@class="next" or @class="nxt"][@href]]',
lazyImgSrc: 'zoomfile',
stylish: '.mbbs_code{font-family:Monaco,Consolas,"Lucida Console","Courier New",serif;font-size:12px;line-height:1.8em;list-style-type:decimal-leading-zero;padding-left:10px;background:none repeat scroll 0 0 #f7f7f7;color:#666;border:1px solid #ccc;overflow:hidden;padding:10px 0 5px 10px}',
filter: function(pages){
// 回复后插入到最后一页
var replays = document.querySelectorAll("#postlistreply");
if(replays.length > 1){
var first = replays[0];
first.parentNode.removeChild(first);
}

// 在卡饭论坛如果不存在，会提示，所以默认禁用
// var SyntaxHighlighter = unsafeWindow.SyntaxHighlighter;
// if (SyntaxHighlighter && SyntaxHighlighter.highlight) {
//     SyntaxHighlighter.highlight();
// }
},
documentFilter: function(doc) {
// 卡饭论坛的下一页代码区域可能无法着色，所以手动修改并添加样式
var pres = doc.querySelectorAll('pre[class^="brush:"]');
[].forEach.call(pres, function(pre){
pre.classList.add('mbbs_code');
});
}
}
},
{name: 'phpWind论坛列表',
url:/^https?:\/\/(?:www\.[^\/]+\/|[^\/]+\/(?:bbs\/)?)?thread/i,
preLink:'//div[starts-with(@class,"pages")]/b[1]/preceding-sibling::a[1][not(@class)][@href] | //div[starts-with(@class,"pages")]/ul[1]/li[b]/preceding-sibling::li/a[1][not(@class)][@href]',
nextLink:'//div[starts-with(@class,"pages")]/b[1]/following-sibling::a[1][not(@class)] | //div[starts-with(@class,"pages")]/ul[1]/li[b]/following-sibling::li/a[1][not(@class)]',
autopager:{
pageElement:'//div[@class="t z"] | //div[@class="z"] | //div[@id="ajaxtable"]',
}
},
{name: 'phpWind论坛帖子',
url:/^https?:\/\/(?:www\.[^\/]+\/|[^\/]+\/(?:bbs\/)?)?read/i,
preLink:'//div[starts-with(@class,"pages")]/b[1]/preceding-sibling::a[1][not(@class)][@href] | //div[starts-with(@class,"pages")]/ul[1]/li[b]/preceding-sibling::li/a[1][not(@class)][@href]',
nextLink:'//div[starts-with(@class,"pages")]/b[1]/following-sibling::a[1][not(@class)] | //div[starts-with(@class,"pages")]/ul[1]/li[b]/following-sibling::li/a[1][not(@class)]',
autopager:{
pageElement:'//div[@class="t5"] | //div[@class="read_t"] | //div[@id="pw_content"]',
}
},
{name: 'phpBB列表',
url:/^https?:\/\/[^\/]+(\/[a-z,0-9]+)?\/viewforum/i,
siteExample:'http://www.firefox.net.cn/forum/viewforum.php?f=4',
nextLink:'auto;',
autopager:{
pageElement:'(//div[@id="page-body"]/div[@class="forumbg"]|//table[@class="forumline"]|//table[@class="tablebg"])',
//replaceE:'//fildset[@class="display-options")]',
remain:1/3,
}
},
{name: 'phpBB帖子',
url:/^https?:\/\/[^\/]+(\/[a-z,0-9]+)?\/viewtopic/i,
siteExample:'http://www.firefox.net.cn/forum/viewtopic.php?t=34339',
nextLink:'auto;',
autopager:{
//pageElement:'//div[@id="page-body"]',
pageElement:'(//div[@id="page-body"]/div[contains(@class,"post")]|//table[@class="forumline"]|//table[@class="tablebg"])',
//replaceE:"//fildset[@class='display-options']",
}
},
{name: 'phpBB Search',
url: /^https?:\/\/forum\.[^\/]+\/search\.php/i,
exampleUrl: 'http://forum.everedit.net/search.php?keywords=%E5%A4%A7%E7%BA%B2',
nextLink: 'auto;',
autopager: {
pageElement: 'id("page-body")/div[starts-with(@class, "search post")]',
replaceE: 'id("page-body")/ul[@class="linklist"]'
}
},
];

//兼容 oautopager的规则放在这里,此规则组..优先级最低(比统配规则还低)..
//所以说尽量不要放规则在这个组里面.
var SITEINFO_comp=[
{name: 'discuz论坛通用搜索',
url: '^http://[^/]+/f/(?:discuz|search)',
nextLink: 'auto;',
pageElement: 'id("result-items")',
},
{name: 'View forum - 通用',
url: '^https?://.+?/viewforum\\.php\\?',
nextLink: '//span[@class="gensmall"]/b/b/following-sibling::a[1] | (//table/tbody/tr/td[@class="nav"])[last()]/b[last()]/following-sibling::a[1]  | //div[@class="pagination"]/span/strong/following-sibling::a[1] | //a[text()="Next"]',
pageElement: '//ul[contains(concat(" ",@class," ")," topics ")]|//form[table/@class="forumline"]',
},
{name: 'wiki 通用',
url: '.\\?(?:.+&)?search=',
nextLink: '//a[@class="mw-nextlink"]',
pageElement: '//ul[@class="mw-search-results"]',
},
{name: '通用 Forum 规则1',
url: '^https?://.*((showthread\\.php\\?)|(forum|thread))',
nextLink: '//a[@rel="next"]',
pageElement: '//div[@id="posts"]|//ol[@id="posts"]/li',
separatorReal: false
},
{name: '通用 Forum 规则2',
url: '^https?://[^?#]+?/showthread\\.php\\?',
nextLink: '//tr[@valign="top"]//div[@class="pagenav"]//a[contains(text(), ">")]',
pageElement: '(//div[@class="pagenav"])[1]|//div[@id="posts"]/node()',
separatorReal: false
},
{name: '通用 Forum 规则3',
url: '^https?://.*((forumdisplay\\.php\\?)|forum)',
nextLink: '//a[@rel="next" or (text()=">")]',
pageElement: '//tbody[starts-with(@id,"threadbits_forum_")]/tr[td[contains(@id,"td_threadtitle")] and not(td/div/text()[contains(.,"Sticky:")])]|//ol[@id="threads" and @class="threads"]/li',
separatorReal: false
},
{name: 'PHPWind 5.3.0 / 6.0.0 / 6.3.2 / 7.0.0 / 7.5.0 - View Thread',
url: '^https?://.+/read\\.php\\?.*tid((=[0-9]+.*)|(-[0-9]+.*\\.html?))$',
nextLink: 'auto;',
pageElement: '//form[@name="delatc"]',
exampleUrl: 'http://www.yydzh.com/read.php?tid=1584013',
},
];

//分页导航的6个图标:
var sep_icons={
top:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ  bWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp  bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6  eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEz  NDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo  dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw  dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv  IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS  ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD  cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlE  PSJ4bXAuaWlkOjM3NkQ2MTFFOTUyNjExREZBNkRGOEVGQ0JDNkM0RDU3IiB4bXBNTTpEb2N1bWVu  dElEPSJ4bXAuZGlkOjM3NkQ2MTFGOTUyNjExREZBNkRGOEVGQ0JDNkM0RDU3Ij4gPHhtcE1NOkRl  cml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Mzc2RDYxMUM5NTI2MTFERkE2REY4  RUZDQkM2QzRENTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Mzc2RDYxMUQ5NTI2MTFERkE2  REY4RUZDQkM2QzRENTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1l  dGE+IDw/eHBhY2tldCBlbmQ9InIiPz7bso/VAAACxElEQVR42rSUS0iUURTH//d+j9EppSRtCjEi  w0EhjR6kIyUpWilFpbUTei1auMoellAQZFSbVrkQilplhZC9IKyNQg8CXVQKZigaOgojNdg3j++7  nTtjAzPqTI50Zu7ce+ec87vnnPtgQghIcZ3VxiGwGksRhomemwGHHKqRPwl6+ujFJXHvPLwWCUyN  VT7qvZ4UtK7oQtQ8CizLUlt4fr4U6ctmExPyZ478LelcMMNIa3vL2nkrR7KnvEaR/auuZ2akeHMt  f0SGsSvFSuk5rWOzs2RvXm6+zRJBDAx+8fUNfHjZfSNwMJ4fj6ekk9KU49hYuaXAZfs4/BzvhztR  6Nxmy85aXyl1SYFdjVrViuWrmqtLj9h7R18jKPwImD6CP0V5cY09fdnKZmmzKDA55Kqqrb2u4oR9  yNOHXz4PVEWDbtPhNSfR7+lGze46u6bp7dL2n8BkmMY4umrLj6XNCA8mfn4PQ3UdNgJzGzA28xnT  1giqdh4I2UqfuGAyYGTYUbH90JrMDAcbmuqFwlWCaiGoxQwomoCmc3z1vEV6RgrbUVTmkD7Sd+GI  GVo25Ra7tjp3af3ud1C5Dk3VQ9FazI+gYkAlqKqzUP/J3Yn8vAI9N8dZIn2jUJG3olE7nJ214cGp  /U2pMnVTmLCsIN4M3UMAXrj9g1B0AUXloAixb90Z0gtYpoBh+PD4xf2ZqemJ+p5bgSdRF4SMG0bd  31Ivt50MzxUYV463pchF3L/HaE5QjVNj4JzuocJw++5Vw/SLlFmEXTKojwbTgS+LqbfgZGmKAAzL  S+Xg4ARTCc5VFhpLKEXIFn1B5E5OG+PUy4wkDCGorDHj8R+lBGAGI+iN2t3QIowlfO3ig+kjb1v4  9aI2u1lBv0Xj+GA1nlKel+q8BnANdBrCdZVNBiwXSRY8eam1PjNBxlMLZpvo2UxWOP6T/BFgAOBe  8h+hfm64AAAAAElFTkSuQmCC',
bottom:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ  bWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp  bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6  eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEz  NDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo  dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw  dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv  IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS  ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD  cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlE  PSJ4bXAuaWlkOjg2RjU3NUQzOTUyNjExREY4M0U4RDZGQThBMjcwMEIzIiB4bXBNTTpEb2N1bWVu  dElEPSJ4bXAuZGlkOjg2RjU3NUQ0OTUyNjExREY4M0U4RDZGQThBMjcwMEIzIj4gPHhtcE1NOkRl  cml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODZGNTc1RDE5NTI2MTFERjgzRThE  NkZBOEEyNzAwQjMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODZGNTc1RDI5NTI2MTFERjgz  RThENkZBOEEyNzAwQjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1l  dGE+IDw/eHBhY2tldCBlbmQ9InIiPz6bp+ZPAAAC0UlEQVR42rRVXUhUQRT+5t67uzdZwwX/0FKS  CCMiwcwi6QfpwcAgKHvzpR6EoKeQpIcIJCOCIB8SooIgKK2gssBwQ0PXsB8s8KdSIhFzXbHS2vbe  ufdOM3fd1mx3zRUPezgzzDnfnP3mm7mEMYaVMAkrZEq8hZ0nHQEe0hepD3RfpJlLAhagtcfPgBBA  sGWZzHbT4JEC2e4NON1UnbHkjoURiaDdf8kGpCELOncaMkF0FceKG5PnmPBVxSlBkom9iehemEN2  gYEt7/CEasLCiQKpihuLqSkhMLMAQ+ecCl5NMQ9vkqZm82glVkVZrSMy7uC5uyMT2UlCnFvV0CxY  Fps7PN6t5IZMHLB4MpER4uph86jr5GFP1wUKZd7GjelpWSWH9lenqKpL8KoyDmbolt25afBoEnic  uTBMand89uh1VeboYn71YcOvscmRxliquDf13V/i9T06sWtH+aqu8VuwJO2P3ITMUuUMPiagBoX3  w02oDje2rq3AE9/t0Fhg5LLAiM0xQ93w6JBv4H2/XpxZaXcrOBZRMVVIzAld1zmwDsPSUZi5Ha+G  Oum74Z5uUZvo8MQ/PPiir2NiZjrENnr2gnJQkxIOqkLTdA5MYVoGCtKLEJieYO2997+Imr9kE0cV  szyxvO35g9k0KQ+5KZtgaZgD1W0+s1avQwrx4K73hp0rav6VmxB9xKM2TKle1fqsJVjoKYObc6tr  YdBUlwcFni1oab8WNAytSuRGb1QUJ5GO22Z+fq339rQGS/MP2LdNIU4UrdmHx13NwW8/pupFTlJv  BbeGsclP294OvawoXV/pkoiC1/3d2ujEx6di7X+fzc/ccxaoREiN9A32Ijsn/Dq+GfCJmkruNAbe  OPf8MHD0LPNqqurivEbiFyav5shmOd7709TckBeTCsJvQ0vf+aS+GIeLTiXmeGFC8p+mqMz8V+6c  y1oWGoE/MvwtwABuklC1izbNcAAAAABJRU5ErkJggg==',
pre:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ  bWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp  bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6  eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEz  NDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo  dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw  dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv  IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS  ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD  cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlE  PSJ4bXAuaWlkOkUzRDUyNEQ5OTBFMjExREZCMjNFRjQzNkMwMjdFNUMwIiB4bXBNTTpEb2N1bWVu  dElEPSJ4bXAuZGlkOkUzRDUyNERBOTBFMjExREZCMjNFRjQzNkMwMjdFNUMwIj4gPHhtcE1NOkRl  cml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTNENTI0RDc5MEUyMTFERkIyM0VG  NDM2QzAyN0U1QzAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTNENTI0RDg5MEUyMTFERkIy  M0VGNDM2QzAyN0U1QzAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1l  dGE+IDw/eHBhY2tldCBlbmQ9InIiPz6I8cyJAAAC20lEQVR42tRVW0hUURTd+5xz550PVMwcUksJ  JY2wrMHpoxQzQrFRxF5iGn1EERGEZCBI9OFPUR9ZkNRX0a9fkeBPEhFBP1mDFj0xdVTSqXnce8/p  3Gtjvh+IH53LZu6Bc9dZe+2196AQAtZjEVinxWIv3stsqXM3ATG+16E1iVbBVwUsOC525pI7dfNp  gRApDnxulvvrq5KCoFgoKhLjktsOeWud5d7qhHhX0lnPBaVqVcA6J3Njp9224ZGvtMHhD7yE/vFe  UlN+PM0V52jPr6WFKwbmTJ0ZbsZYt6+k0RkIfYLByX74HvTDYLSP1FQe25KYpTzYtJel25LQ1A+T  ERcFtgenw8U47anaX5+AFh0+BN6AwizAKAX/2HPQ7OPEV+HLzSyGu1YH2JOyFSICQmi6RhYEThkx  g6oO1lXuqctIS0kn74deACOKGZwIQCn62/GnkJaZggdLDpdlVyo3RgdU0yU4x7nTu8EsasQdT36Z  Jz9nt9L3oxcoMqASFOQvF5p0HKDOBbwaeUJ2FBTQosI9ddtPWq4Z30vGuCCwEORiXkbRiZJdR6zv  JFMBXILSKXAkQlWjgmuyFrqA4K/f0PO1E0u9B5w52zaecleQRkZm9wHGWvpoe17oTFWLjVKZtkTQ  JcNu/0NQ9bAIa5M4HBkAq5MKi41gdW6L5A1E6MgnJkbVjse3hz6+Dp379ox3zWuQL8P9tqv3GqbS  YBhua+qUEER6maIajchUZQZRQwyZi4bYeqs59DMobPKI1UrRHZcB5+Wn84FN/WPW04RsNDSl0KSn  VflwWSNNFo8LRF0Thoa2gfucLNvScxdKKkalDdbGnbLluRrhhArCNVUnBNcw3fCv7xVqMc8a40eL  cIxGVHkhrn1s2hWXwdkQybAP6sYNywAvOSv3ba2VM0OTOqswGR4DlUdiXjL4rxB4NvehKx31qf+2  YmZtwXQo4siSMv53f03rBvxHgAEAqLoqsgGSMo4AAAAASUVORK5CYII=',
next:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ  bWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp  bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6  eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEz  NDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo  dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw  dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv  IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS  ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD  cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlE  PSJ4bXAuaWlkOkY3M0ZDRTgzOTBFMjExREZCNjlFQUY1QUIyNjQ1NzE3IiB4bXBNTTpEb2N1bWVu  dElEPSJ4bXAuZGlkOkY3M0ZDRTg0OTBFMjExREZCNjlFQUY1QUIyNjQ1NzE3Ij4gPHhtcE1NOkRl  cml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjczRkNFODE5MEUyMTFERkI2OUVB  RjVBQjI2NDU3MTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjczRkNFODI5MEUyMTFERkI2  OUVBRjVBQjI2NDU3MTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1l  dGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Q0swTAAAC50lEQVR42tRVXUhUQRQ+M/dnd0sN/1gtAimW  LXsoiAixFyGIHnqNioioh36ghyh6sCAijAgiIoLowSRMBG1b1n5s0XxRtiyRlIpQ1M1sKxV1XffH  e2emM+u6qG11EXzoXM6de2fOfPeb8x3OJUIIWAmjsEKmzj+UndeWrv0kAgoJWTglT0cW0vqB96L5  144bxu/Ac5sWWeHpQxfT0xq1QbY9D1SqgUJVHHWovHfE+U/GU5Mc1uQoi1cFgYbua8mPErxK8reC  Q8sGm+qACtdh6zmejnLEEGlXCC4TTAiGSeiYEVm+eGMRDhxBpes2DVQbFWQuihtsdu4gFiopY1WM  T0tgEKqmCFUnVEuCCypTwgWXdwTnloH96CylIsdtcUUloNspqDpFdAoaXhKQcYZBAqhK4ql4sVT9  tHjhINzZsN3uPnngjDMnJ18jinAQEFy3KXIQzBBE023ImOEbJ5L51eM1dooVwpgB971V8YyMgy/M  5wMfYlcantaNJ8yI8H+7LXzDVRSrSlAFiKJRITVk3ERQA9r6auF10AfRRBjqW+7Ghsf6KzMCm9yU  Q3Xf5+8PWtpfzVSsPyayVq8CioSRFGiaTpAruplMBc7CZmcZtL57kvgY7KzFvbcyAquKKoLeJPil  zq439e97etiOwv1coURWnqAE0ZOgBkjw0qJy6O17awR6/YHiQXZq7ZCRWTyptOpUIBQQtN9nnH3Z  +swfGhoVW3L3yBQTygmeykj6JmQaGh3hzYH6oBY196VE/2NV8FQj4IkoxIY64ISnyfNJjeVyd94u  MBkDw5yFjQXbQMwq4G17OGlSVoHxESt1LBaMIxODxtFGX91AsV7K12W5oTjbBQWOEvC0Vs+Yprkb  Y74ut212RcLRC43Nj0Ku3HLuLtgJnpaaaCw+fRDXui21zb+YdyoyXtrc/vgcdg3bRHjsMurZZLkf  L7XQXgahdOrhevnoFxeWxxTKcNNKEyL/3a9pxYB/CTAALMFZuEnI1jsAAAAASUVORK5CYII=',
next_gray:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ  bWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp  bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6  eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEz  NDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo  dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw  dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv  IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS  ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD  cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlE  PSJ4bXAuaWlkOjg1RDA5RjFGOTUyMjExREZCMkM4QUZEOEY4Qzg2MDREIiB4bXBNTTpEb2N1bWVu  dElEPSJ4bXAuZGlkOjg1RDA5RjIwOTUyMjExREZCMkM4QUZEOEY4Qzg2MDREIj4gPHhtcE1NOkRl  cml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODVEMDlGMUQ5NTIyMTFERkIyQzhB  RkQ4RjhDODYwNEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODVEMDlGMUU5NTIyMTFERkIy  QzhBRkQ4RjhDODYwNEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1l  dGE+IDw/eHBhY2tldCBlbmQ9InIiPz62tt8rAAACiUlEQVR42tRVS6tSURTe5/hWFAderhoIKqmI  U2eCBg2a9AOaBQ4iZxE0yCCcNYkGDYWaNEh8ICQpoYg4CJQIFA0chKGpBb7A9+Oc1jp4LnK12+GC  gxYs1j7stb79rcfeh2JZlpxCaHIiEfMLj8dzee836NlVwRRF/QKj57+LxeIh8BE5CwQChC+VRCIh  arWaiEQiTsViMQkGg+f/ZDyfz4lcLj9wiEajF2uz2UwUCgWRyWTE5/MJr/FqteIY8gqporI7SxaL  xfWbt1wuL4ClUimWgAMGYdbrNecjZJKOTgWCYzzUkYV60mh53/2MhAJ/At1iLLIDXWCTsGkATGGz  aJomDMOQ7XbLAcP+YufP62HzRqPRa5PJZPf7/edarVYC6SvwAADGOrAARmHTABgwWQqBQ6GQHA/f  bDYkHA4vjjJuNBofO51OKB6P96FJbDabZVOpFA2BLDBFxlhr7gBknM/nSalUIrPZjEQikXm73X56  FBhPBXnTbDbfFgqFqdfrZVUqFZc+KjIHthRfCmyow+EguVxuWavV3kHsq6PAyKher+PyWblcfl+p  VLZut5tBUMwdU0ZQJIDW6XSSarW6/gwyGAwe9vv94xcEa6bRaIhSqaRhrB4B0A24aXdcLhcFKXM1  RVA8AJn2ej0mnU7/gNm/u2v6X6cCJ4Hazeu81Wo9SCaT3yATxm63c+njHFssFo4x7I3A9xboRMgc  s3v2J6R3PxaLfdfr9YzRaCQGg4HodDqSSCSmwP42+LSv+2x+mUwmTwCoa7PZGFAEnU2n03uw91XQ  s3mFJMfjsTOTyTyGtWw4HD4H+0Hwe3xZrFbr/ueLbrd7Exo4hvVLIY8Q9d/9mk4G/EeAAQCBEkva  rHrRPgAAAABJRU5ErkJggg==',
pre_gray:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJ  bWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdp  bj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6  eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEz  NDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJo  dHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlw  dGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAv  IiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RS  ZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpD  cmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlE  PSJ4bXAuaWlkOjc0MTI5MDY4OTUyMjExREZCODVDREYyM0U0QjMzQkQzIiB4bXBNTTpEb2N1bWVu  dElEPSJ4bXAuZGlkOjc0MTI5MDY5OTUyMjExREZCODVDREYyM0U0QjMzQkQzIj4gPHhtcE1NOkRl  cml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzQxMjkwNjY5NTIyMTFERkI4NUNE  RjIzRTRCMzNCRDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzQxMjkwNjc5NTIyMTFERkI4  NUNERjIzRTRCMzNCRDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1l  dGE+IDw/eHBhY2tldCBlbmQ9InIiPz5D2F5XAAACZklEQVR42tSVz6sSURTH7x0VJxX8CampSQtF  /AESConiQkhdlKKCLdr0YxW0iDaBSBLZok3tol27/oC3TcS14EpEBV24UOO5EETLn9M5g4KoPXu9  XHTgMNc7537me7/3zEg5jiOnCIacKISbQSAQuKjuI6VULhAInhSLxdWlFKMlv8mXer3+qU6nu79c  Ll/9KyvuKZXKN9FoVBqJRBRyufyZz+eLXxXslkqlXxOJhKTZbBJIBsY6mUz23uFw3P5bsEEoFH4D  kHQwGJBer0e63S7p9/tMKpW6pVarv5hMphsSiYRi8eZ6EDybzTYpg5/FeDyuYBiGtNttIhKJCBwc  aTQaZLFYMHDPZjQaP8P8NY1Gw0wmEw7nD4LH4zGmQCwWn4GnN7VaLVOv13kgqCfQFZhctVolcJg0  HA7ftdlsH2BHfJfg/YNglUqF+ekOhNPpFNVqNYKKEYpX6AhcTFerFSmXy4zL5RJ4PJ4Hbrf7La4H  xfQgGNa8sNvtD0OhkBiVYquhWoRCcvP5nEMoJu6uVCrRYDAoNZvNj6xW62MUcPAFMRgM79LpNIsF  Xq+XBxQKBYQjlIIifgzKaSwWw+0z8HCaTCbVw+HwtcViOW+1Wmd74E6nw2azWX4MgJ+5XI5F30At  nU6n/IM220VgPp//AfNYI4Yag0KheA639sHoxmYAqjiEohXo7RrKHx5CcQ6CrVQqzNFvxW6su2D7  tFfrllrtttalX+kNFPt47SlBv7Hfd9vrjxVvB8uyZOu7jX5cDez3+3mPMUejEard281R8E7h90wm  c/3IRs4vtPG/+2s6GfiXAAMAq3cXTADTBMIAAAAASUVORK5CYII=',
};

//悬浮窗的状态颜色.
var FWKG_color={
loading:'#8B00E8',    // 读取中状态
prefetcher:'#5564AF', // 预读状态
autopager:'#038B00',  // 翻页状态
Apause:'#B7B700',     // 翻页状态(暂停).
Astop:'#A00000',      // 翻页状态(停止)(翻页完成,或者被异常停止.)(无法再开启)
dot:'#00FF05',        // 读取完后,会显示一个小点,那么小点的颜色.
};

//当没有找到规则的时候,进入自动搜索模式.
//在没有高级规则的网站上.的一些设置..
var autoMatch={
keyMatch:true,              //是否启用关键字匹配
cases:false,            //关键字区分大小写....
digitalCheck:true,      //对数字连接进行检测,从中找出下一页的链接
pfwordl:{               //关键字前面的字符限定.
previous:{          //上一页关键字前面的字符,例如 "上一页" 要匹配 "[上一页" ,那么prefix要的设置要不小于1,并且character要包含字符 "["
enable:true,
maxPrefix:3,
character:[' ','　','[','［','<','＜','‹','«','<<','『','「','【','(','←']
},
next:{//下一页关键字前面的字符
enable:true,
maxPrefix:2,
character:[' ','　','[','［','『','「','【','(']
}
},
sfwordl:{               //关键字后面的字符限定.
previous:{          //上一页关键字后面的字符
enable:true,
maxSubfix:2,
character:[' ','　',']','］','』','」','】',')']
},
next:{              //下一页关键字后面的字符
enable:true,
maxSubfix:3,
character:[' ','　',']','］','>','﹥','›','»','>>','』','」','】',')','→']
}
},
useiframe: GM_getValue('SITEINFO_D.useiframe') || false,            //(预读)是否使用iframe..
viewcontent: false,          //查看预读的内容,显示在页面的最下方.
FA: {                       //强制拼接 选项 功能设置.
enable:true,           //默认启用 强制拼接
manualA: false,          //手动翻页♦️.
useiframe:false,        //(翻页)是否使用iframe..
iloaded:false,      //(只在opera有效)如果使用iframe翻页..是否在iframe完全load后操作..否则在DOM完成后操作
itimeout:0,         //当使用iframe翻页时在完成后继续等待多少毫秒后,在操作..
remain:2,               //剩余页面的高度..是显示高度的 remain 倍开始翻页..
maxpage:9,             //最多翻多少页..
ipages:[true,1],       //立即翻页,第一项是控制是否在js加载的时候立即翻第二项(必须小于maxpage)的页数,比如[true,3].就是说JS加载后.立即翻3页.
separator:true,         //显示翻页导航..(推荐显示.)..
}
};

//上一页关键字
var prePageKey=[
'上一页', '上一頁', '上1页', '上1頁', '上页', '上頁',
'翻上頁', '翻上页',
'上一张', '上一張', '上一幅', '上一章', '上一节', '上一節', '上一篇',
'前一页', '前一頁',
'后退', '後退', '上篇',
'previous', 'previous Page', '前へ', '前のページ'
];

//下一页关键字
var nextPageKey=[
'下一页', '下一頁', '下1页', '下1頁', '下页', '下頁',
'翻页', '翻頁', '翻下頁', '翻下页',
'下一张', '下一張', '下一幅', '下一章', '下一节', '下一節', '下一篇',
'后一页', '後一頁',
'前进', '下篇', '后页', '往后',
'Next', 'Next Page', '次へ', '次のページ'
];

// 出在自动翻页信息附加显示真实相对页面信息，一般能智能识别出来。如果还有站点不能识别，可以把地址的特征字符串加到下面
// 最好不要乱加，一些不规律的站点显示出来的数字也没有意义
var REALPAGE_SITE_PATTERN = ['search?', 'search_', 'forum', 'thread'];


//------------------------下面的不要管他-----------------
///////////////////////////////////////////////////////////////////


//----------------------------------
// 主要用于 chrome 原生下检查更新，也可用于手动检查更新
var scriptInfo = {
version: '6.5.0',
updateTime: '2015/1/10',
homepageURL: 'https://greasyfork.org/scripts/293-super-preloaderplus-one',
downloadUrl: 'https://greasyfork.org/scripts/293-super-preloaderplus-one/code/Super_preloaderPlus_one.user.js',
metaUrl: 'https://greasyfork.org/scripts/293-super-preloaderplus-one/code/Super_preloaderPlus_one.meta.js',
};

var setup = function(){
var d = document;
var on = function(node, e, f) {
node.addEventListener(e, f, false);
};

var $ = function(s) { return d.getElementById('sp-prefs-'+s); };
if($('setup')) return;

var styleNode = GM_addStyle('\
#sp-prefs-setup { position:fixed;z-index:2147483647;top:30px;right:60px;padding:20px 30px;background:#eee;width:500px;border:1px solid black; }\
#sp-prefs-setup * { color:black;text-align:left;line-height:normal;font-size:12px; }\
#sp-prefs-setup a { color:black;text-decoration:underline; }\
#sp-prefs-setup div { text-align:center;font-weight:bold;font-size:14px; }\
#sp-prefs-setup ul { margin:15px 0 15px 0;padding:0;list-style:none;background:#eee;border:0; }\
#sp-prefs-setup input, #sp-prefs-setup select { border:1px solid gray;padding:2px;background:white; }\
#sp-prefs-setup li { margin:0;padding:6px 0;vertical-align:middle;background:#eee;border:0 }\
#sp-prefs-setup button { width:150px;margin:0 10px;text-align:center;}\
#sp-prefs-setup textarea { width:98%; height:60px; margin:3px 0; }\
#sp-prefs-setup b { font-weight: bold; font-family: "微软雅黑", sans-serif; }\
#sp-prefs-setup button:disabled { color: graytext; }\
');

var div = d.createElement('div');
div.id = 'sp-prefs-setup';
d.body.appendChild(div);
div.innerHTML = '\
<div>Super_preloaderPlus_one 设置</div>\
<ul>\
<li>当前版本为 <b>' + scriptInfo.version + ' </b>，上次更新时间为 <b>'+ scriptInfo.updateTime + '</b>\
<a id="sp-prefs-homepageURL" target="_blank" href="' + scriptInfo.homepageURL + '"/>脚本主页</a>\
</li>\
<li><input type="checkbox" id="sp-prefs-debug" /> 调试模式</li>\
<li><input type="checkbox" id="sp-prefs-dblclick_pause" /> 鼠标双击暂停翻页（默认为 Ctrl + 长按左键）</li>\
<li><input type="checkbox" id="sp-prefs-enableHistory" /> 添加下一页到历史记录</li>\
<li title="下一页的链接设置成在新标签页打开"><input type="checkbox" id="sp-prefs-forceTargetWindow" /> 新标签打开链接</li>\
<li><input type="checkbox" id="sp-prefs-SITEINFO_D-useiframe" /> 在预读模式下，默认启用 iframe 方式</li>\
<li><input type="checkbox" id="sp-prefs-SITEINFO_D-a_enable" /> 默认启用自动翻页 </li>\
<li><input type="checkbox" id="sp-prefs-SITEINFO_D-a_force_enable" /> 自动翻页默认启用强制拼接</li>\
<li>自定义排除列表：\
<div><textarea id="sp-prefs-excludes" placeholder="自定义排除列表，支持通配符。\n例如：http://*.douban.com/*"></textarea></div>\
</li>\
<li>自定义站点规则：\
<div><textarea id="sp-prefs-custom_siteinfo" placeholder="自定义站点规则"></textarea></div>\
</li>\
</ul>\
<div><button id="sp-prefs-ok">确定</button><button id="sp-prefs-cancel">取消</button></div>';
div = null;

var close = function() {
if (styleNode) {
styleNode.parentNode.removeChild(styleNode);
}
var div = $('setup');
div.parentNode.removeChild(div);
};

on($('ok'), 'click', function(){
GM_setValue('enableHistory', prefs.enableHistory = !!$('enableHistory').checked);
GM_setValue('forceTargetWindow', prefs.forceTargetWindow = !!$('forceTargetWindow').checked);
GM_setValue('SITEINFO_D.useiframe', SITEINFO_D.useiframe = !!$('SITEINFO_D-useiframe').checked);
GM_setValue('SITEINFO_D.autopager.enable', SITEINFO_D.autopager.enable = !!$('SITEINFO_D-a_enable').checked);
GM_setValue('SITEINFO_D.autopager.force_enable', SITEINFO_D.autopager.force_enable = !!$('SITEINFO_D-a_force_enable').checked);

GM_setValue('debug', xbug = !!$('debug').checked);
debug = xbug ? console.log.bind(console) : function() {};

GM_setValue('dblclick_pause', $('dblclick_pause').checked);
GM_setValue('excludes', prefs.excludes = $('excludes').value);
GM_setValue('custom_siteinfo', prefs.custom_siteinfo = $('custom_siteinfo').value);

SP.loadSetting();

close();
});

on($('cancel'), 'click', close);

$('debug').checked = xbug;
$('enableHistory').checked = prefs.enableHistory;
$('forceTargetWindow').checked = prefs.forceTargetWindow;
$('dblclick_pause').checked = GM_getValue('dblclick_pause') || false;
$('SITEINFO_D-useiframe').checked = SITEINFO_D.useiframe;
$('SITEINFO_D-a_enable').checked = SITEINFO_D.autopager.enable;
$('SITEINFO_D-a_force_enable').checked = SITEINFO_D.autopager.force_enable;
$('excludes').value = prefs.excludes;
$('custom_siteinfo').value = prefs.custom_siteinfo;

};

var isUpdating = true;
function checkUpdate(button) {
if (isUpdating) {
return;
}

button.innerHTML = '正在更新中...';
button.disabled = 'disabled';

var reset = function() {
isUpdating = false;
button.innerHTML = '马上更新';
button.disabled = '';
};

GM_xmlhttpRequest({
method: "GET",
url: scriptInfo.metaUrl,
onload: function(response) {
var txt = response.responseText;
var curVersion = scriptInfo.version;
var latestVersion = txt.match(/@\s*version\s*([\d\.]+)\s*/i);
if (latestVersion) {
latestVersion = latestVersion[1];
} else {
alert('解析版本号错误');
return;
}

//对比版本号
var needUpdate;
var latestVersions = latestVersion.split('.');
var lVLength = latestVersions.length;
var currentVersion = curVersion.split('.');
var cVLength = currentVersion.length;
var lV_x;
var cV_x;
for (var i = 0; i < lVLength; i++) {
lV_x = Number(latestVersions[i]);
cV_x = (i >= cVLength) ? 0 : Number(currentVersion[i]);
if (lV_x > cV_x) {
needUpdate = true;
break;
} else if (lV_x < cV_x) {
break;
}
}

if (needUpdate) {
alert('本脚本从版本 ' + scriptInfo.version + '  更新到了版本 ' + latestVersion + '.\n请点击脚本主页进行安装');
document.getElementById("sp-prefs-homepageURL").boxShadow = '0 0 2px 2px #FF5555';
}

reset();
}
});

setTimeout(reset, 30 * 1000);
}


//----------------------------------
// main.js

//------------------------下面的不要管他-----------------
///////////////////////////////////////////////////////////////////

var xbug = prefs.debug || GM_getValue("debug") || false;
var C = console;
var debug = xbug ? console.log.bind(console) : function() {};

// 变量
var isHashchangeSite = false,
hashchangeTimer = 0;

var SP = {
init: function() {
if(document.body.getAttribute("name") === "MyNovelReader"){
return;
}

this.loadSetting();

GM_registerMenuCommand('Super_preloaderPlus_one 设置', setup);

// 查找是否是页面不刷新的站点
var locationHref = location.href;
var hashSite = _.find(HashchangeSites, function(x){ return toRE(x.url).test(locationHref); });
if (hashSite) {
isHashchangeSite = true;
hashchangeTimer = hashSite.timer;
debug('当前是页面不刷新的站点', hashSite);
setTimeout(function() {
init(window, document);
}, hashchangeTimer);
} else {
init(window, document);
}

// 分辨率 高度 > 宽度 的是手机
if(window.screen.height > window.screen.width){
GM_addStyle('div.sp-separator { min-width:auto !important; }');
}
},
loadSetting: function(){
var a_enable = GM_getValue('SITEINFO_D.autopager.enable');
if (a_enable !== undefined) {
SITEINFO_D.autopager.enable = a_enable;
}

var loadDblclickPause = function(reload){
var dblclickPause = GM_getValue('dblclick_pause', prefs.dblclick_pause);
if (dblclickPause) {
prefs.mouseA = false;
prefs.Pbutton = [0, 0, 0];
}

if (reload) location.reload();
};

var loadCustomSiteInfo = function() {
var infos;
try {
infos = new Function('', 'return ' + prefs.custom_siteinfo)();
}catch(e) {
console.error('自定义站点规则错误', prefs.custom_siteinfo);
// alert('自定义站点规则错误');
}

if (_.isArray(infos)) {
SITEINFO = infos.concat(SITEINFO);
}
};

loadDblclickPause();

loadCustomSiteInfo();
},
};


function init(window, document) {
var startTime = new Date();

var nullFn = function() {}; //空函数.
var url = document.location.href.replace(/#.*$/, ''); //url 去掉hash
var cplink = url;  // 翻上来的最近的页面的url;
var domain = document.domain; //取得域名.
var domain_port = url.match(/https?:\/\/([^\/]+)/)[1]; //端口和域名,用来验证是否跨域.

// 新加的，以示区别
var remove = [];  // 需要移除的事件

debug('----------------------------------------------------');

//悬浮窗
var floatWO = {
updateColor: nullFn,
loadedIcon: nullFn,
CmodeIcon: nullFn,
};

function floatWindow() {
GM_addStyle('\
#sp-fw-container {\
z-index:999999!important;\
text-align:left!important;\
}\
#sp-fw-container * {\
font-size:13px!important;\
color:black!important;\
float:none!important;\
}\
#sp-fw-main-head{\
position:relative!important;\
top:0!important;\
left:0!important;\
}\
#sp-fw-span-info{\
position:absolute!important;\
right:1px!important;\
top:0!important;\
font-size:10px!important;\
line-height:10px!important;\
background:none!important;\
font-style:italic!important;\
color:#5a5a5a!important;\
text-shadow:white 0px 1px 1px!important;\
}\
#sp-fw-container input {\
vertical-align:middle!important;\
display:inline-block!important;\
outline:none!important;\
height: auto !important;\
padding: 0px !important;\
margin-bottom: 0px !important;\
}\
#sp-fw-container input[type="number"] {\
width:50px!important;\
text-align:left!important;\
}\
#sp-fw-container input[type="checkbox"] {\
border:1px solid #B4B4B4!important;\
padding:1px!important;\
margin:3px!important;\
width:13px!important;\
height:13px!important;\
background:none!important;\
cursor:pointer!important;\
visibility: visible !important;\
position: static !important;\
}\
#sp-fw-container input[type="button"] {\
border:1px solid #ccc!important;\
cursor:pointer!important;\
background:none!important;\
width:auto!important;\
height:auto!important;\
}\
#sp-fw-container li {\
list-style:none!important;\
margin:3px 0!important;\
border:none!important;\
float:none!important;\
}\
#sp-fw-container fieldset {\
border:2px groove #ccc!important;\
-moz-border-radius:3px!important;\
border-radius:3px!important;\
padding:4px 9px 6px 9px!important;\
margin:2px!important;\
display:block!important;\
width:auto!important;\
height:auto!important;\
}\
#sp-fw-container legend {\
line-height: 20px !important;\
margin-bottom: 0px !important;\
}\
#sp-fw-container fieldset>ul {\
padding:0!important;\
margin:0!important;\
}\
#sp-fw-container ul#sp-fw-a_useiframe-extend{\
padding-left:40px!important;\
}\
#sp-fw-rect {\
position:relative!important;\
top:0!important;\
left:0!important;\
float:right!important;\
height:10px!important;\
width:10px!important;\
padding:0!important;\
margin:0!important;\
-moz-border-radius:3px!important;\
border-radius:3px!important;\
border:1px solid white!important;\
-webkit-box-shadow:inset 0 5px 0 rgba(255,255,255,0.3), 0 0 3px rgba(0,0,0,0.8)!important;\
-moz-box-shadow:inset 0 5px 0 rgba(255,255,255,0.3), 0 0 3px rgba(0,0,0,0.8)!important;\
box-shadow:inset 0 5px 0 rgba(255,255,255,0.3), 0 0 3px rgba(0,0,0,0.8)!important;\
opacity:0.8!important;\
}\
#sp-fw-dot,\
#sp-fw-cur-mode {\
position:absolute!important;\
z-index:9999!important;\
width:5px!important;\
height:5px!important;\
padding:0!important;\
-moz-border-radius:3px!important;\
border-radius:3px!important;\
border:1px solid white!important;\
opacity:1!important;\
-webkit-box-shadow:inset 0 -2px 1px rgba(0,0,0,0.3),inset 0 2px 1px rgba(255,255,255,0.3), 0px 1px 2px rgba(0,0,0,0.9)!important;\
-moz-box-shadow:inset 0 -2px 1px rgba(0,0,0,0.3),inset 0 2px 1px rgba(255,255,255,0.3), 0px 1px 2px rgba(0,0,0,0.9)!important;\
box-shadow:inset 0 -2px 1px rgba(0,0,0,0.3),inset 0 2px 1px rgba(255,255,255,0.3), 0px 1px 2px rgba(0,0,0,0.9)!important;\
}\
#sp-fw-dot{\
right:-3px!important;\
top:-3px!important;\
}\
#sp-fw-cur-mode{\
left:-3px!important;\
top:-3px!important;\
width:6px!important;\
height:6px!important;\
}\
#sp-fw-content{\
padding:0!important;\
margin:5px 5px 0 0!important;\
-moz-border-radius:3px!important;\
border-radius:3px!important;\
border:1px solid #A0A0A0!important;\
-webkit-box-shadow:-2px 2px 5px rgba(0,0,0,0.3)!important;\
-moz-box-shadow:-2px 2px 5px rgba(0,0,0,0.3)!important;\
box-shadow:-2px 2px 5px rgba(0,0,0,0.3)!important;\
}\
#sp-fw-main {\
padding:5px!important;\
border:1px solid white!important;\
-moz-border-radius:3px!important;\
border-radius:3px!important;\
background-color:#F2F2F7!important;\
background: -moz-linear-gradient(top, #FCFCFC, #F2F2F7 100%)!important;\
background: -webkit-gradient(linear, 0 0, 0 100%, from(#FCFCFC), to(#F2F2F7))!important;\
}\
#sp-fw-foot{\
position:relative!important;\
left:0!important;\
right:0!important;\
min-height:20px!important;\
}\
#sp-fw-savebutton{\
position:absolute!important;\
top:0!important;\
right:2px!important;\
}\
#sp-fw-container .sp-fw-spanbutton{\
border:1px solid #ccc!important;\
-moz-border-radius:3px!important;\
border-radius:3px!important;\
padding:2px 3px!important;\
cursor:pointer!important;\
background-color:#F9F9F9!important;\
-webkit-box-shadow:inset 0 10px 5px white!important;\
-moz-box-shadow:inset 0 10px 5px white!important;\
box-shadow:inset 0 10px 5px white!important;\
}\
');

var div = document.createElement('div');
div.id = 'sp-fw-container';
div.innerHTML = '\
<div id="sp-fw-rect" style="background-color:#000;">\
<div id="sp-fw-dot" style="display:none;"></div>\
<div id="sp-fw-cur-mode" style="display:none;"></div>\
</div>\
<div id="sp-fw-content" style="display:none;">\
<div id="sp-fw-main">\
<div id="sp-fw-main-head">\
<input type="checkbox" title="使用翻页模式,否则使用预读模式" id="sp-fw-a_enable" name="sp-fw-a_enable"/>使用翻页模式\
<span id="sp-fw-span-info">Super_preloader</span>\
</div>\
<fieldset>\
<legend title="预读模式的相关设置" >预读设置</legend>\
<ul>\
<li>\
<input type="checkbox" title="使用iframe预先载入好下一页到缓存,否则使用xhr请求下一页源码,取出所有的图片进行预读" id="sp-fw-useiframe" name="sp-fw-useiframe"/>使用iframe方式\
</li>\
<li>\
<input type="checkbox" title="查看预读的内容,将其显示在页面的底部,看看预读了些什么." id="sp-fw-viewcontent" name="sp-fw-viewcontent"/>查看预读的内容\
</li>\
</ul>\
</fieldset>\
<fieldset id="sp-fw-autopager-field" style="display:block;">\
<legend title="自动翻页模式的相关设置">翻页设置</legend>\
<ul>\
<li>\
<input type="checkbox" title="使用iframe方式进行翻页,否则使用xhr方式翻页,可以解决某些网页xhr方式无法翻页的问题,如果xhr翻页正常的话,就不要勾这项吧." id="sp-fw-a_useiframe" name="sp-fw-a_useiframe"/>使用iframe方式</input>\
<input type="checkbox" title="每个下一页都用新的iframe，可以解决下一页图片或按钮点击的问题" id="sp-fw-a_newIframe" name="sp-fw-a_newIframe">新iframe</input>\
<ul id="sp-fw-a_useiframe-extend">\
<li>\
<input type="checkbox" title="等待iframe完全载入后(发生load事件),将内容取出,否则在DOM完成后,就直接取出来..(勾上后,会比较慢,但是可能会解决一些问题.)" id="sp-fw-a_iloaded" name="sp-fw-a_iloaded" />等待iframe完全载入\
</li>\
<li>\
<input type="number"  min="0" title="在可以从iframe取数据的时候,继续等待设定的毫秒才开始取出数据(此项为特殊网页准备,如果正常,请设置为0)" id="sp-fw-a_itimeout" name="sp-fw-a_itimeout"/>ms延时取出\
</li>\
</ul>\
</li>\
<li>\
<input type="checkbox" id="sp-fw-a_manualA" name="sp-fw-a_manualA" title="不会自动拼接上来,会出现一个类似翻页导航的的图形,点击翻页(在论坛的帖子内容页面,可以考虑勾选此项,从而不影响你的回帖)"/>手动模式\
</li>\
<li>\
剩余<input type="number" min="0" id="sp-fw-a_remain" name="sp-fw-a_remain" title="当剩余的页面的高度是浏览器可见窗口高度的几倍开始翻页"/>倍页面高度触发\
</li>\
<li>\
最多翻<input type="number" min="0" id="sp-fw-a_maxpage" name="sp-fw-a_maxpage" title="最多翻页数量,当达到这个翻页数量的时候,自动翻页停止." />页\
</li>\
<li>\
<input type="checkbox" id="sp-fw-a_separator" name="sp-fw-a_separator" title="分割页面主要内容的导航条,可以进行页面主要内容之间的快速跳转定位等."/>显示翻页导航\
</li>\
<li>\
<input type="checkbox" title="将下一页的body部分内容整个拼接上来.(当需翻页的网站没有高级规则时,该项强制勾选,无法取消.)" id="sp-fw-a_force" name="sp-fw-a_force"/>强制拼接\
</li>\
<li>\
<input type="checkbox" id="sp-fw-a_ipages_0" name="sp-fw-a_ipages_0" title="在JS加载后,立即连续翻后面设定的页数"/>启用 \
立即翻<input type="number" min="1" id="sp-fw-a_ipages_1" name="sp-fw-a_ipages_1" title="连续翻页的数量" />页\
<input type="button" value="开始" title="现在立即开始连续翻页" id="sp-fw-a_starti" />\
</li>\
</ul>\
</fieldset>\
<div id="sp-fw-foot">\
<input type="checkbox" id="sp-fw-enable" title="总开关,启用js,否则禁用." name="sp-fw-enable"/>启用\
<span id="sp-fw-setup" class="sp-fw-spanbutton" title="打开设置窗口">设置</span>\
<span id="sp-fw-savebutton" class="sp-fw-spanbutton" title="保存设置">保存</span>\
</div>\
</div>\
</div>\
';
document.body.appendChild(div);

function $(id) {
return document.getElementById(id);
}

var rect = $('sp-fw-rect'); //悬浮窗的小正方形,用颜色描述当前的状态.
var spanel = $('sp-fw-content'); //设置面板.

var spanelc = {
show: function() {
spanel.style.display = 'block';
},
hide: function() {
spanel.style.display = 'none';
},
};
var rectt1, rectt2;
//设置面板显隐
rect.addEventListener('mouseover', function(e) {
rectt1 = setTimeout(spanelc.show, 100);
}, false);
rect.addEventListener('mouseout', function(e) {
clearTimeout(rectt1);
}, false);

div.addEventListener('mouseover', function(e) {
clearTimeout(rectt2);
}, false);

div.addEventListener('mouseout', function(e) {
if (e.relatedTarget && e.relatedTarget.disabled) return; //for firefox and chrome
rectt2 = setTimeout(spanelc.hide, 288);
}, false);

var dot = $('sp-fw-dot'); //载入完成后,显示的小点
dot.style.backgroundColor = FWKG_color.dot;

var cur_mode = $('sp-fw-cur-mode'); //当载入状态时,用来描述当前是翻页模式,还是预读模式.
cur_mode.style.backgroundColor = SSS.a_enable ? FWKG_color.autopager : FWKG_color.prefetcher;

var a_enable = $('sp-fw-a_enable'); //启用翻页模式
var autopager_field = $('sp-fw-autopager-field'); //翻页设置区域

//预读设置
var useiframe = $('sp-fw-useiframe');
var viewcontent = $('sp-fw-viewcontent');

//翻页设置
var a_useiframe = $('sp-fw-a_useiframe');
var a_iloaded = $('sp-fw-a_iloaded');
var a_itimeout = $('sp-fw-a_itimeout');
var a_manualA = $('sp-fw-a_manualA');
var a_remain = $('sp-fw-a_remain');
var a_maxpage = $('sp-fw-a_maxpage');
var a_separator = $('sp-fw-a_separator');
var a_ipages_0 = $('sp-fw-a_ipages_0');
var a_ipages_1 = $('sp-fw-a_ipages_1');
var a_force = $('sp-fw-a_force');

// newIframe 输入框的点击
var a_newIframe = $('sp-fw-a_newIframe');
a_newIframe.addEventListener('click', function(){
a_useiframe.checked = a_newIframe.checked;
}, false);

var a_starti = $('sp-fw-a_starti'); //开始立即翻页
a_starti.addEventListener('click', function() {
if (this.disabled) return;
var value = Number(a_ipages_1.value);
if (isNaN(value) || value <= 0) {
value = SSS.a_ipages[1];
a_ipages_1.value = value;
}
autoPO.startipages(value);
}, false);

//总开关
var enable = $('sp-fw-enable');
$('sp-fw-setup').addEventListener('click', setup, false);

// 保存设置按钮.
var savebutton = $('sp-fw-savebutton');
savebutton.addEventListener('click', function(e) {
var value = {
Rurl: SSS.Rurl,
useiframe: gl(useiframe),
viewcontent: gl(viewcontent),
enable: gl(enable),
};

function gl(obj) {
return (obj.type == 'checkbox' ? obj.checked : obj.value);
}
if (SSS.a_enable !== undefined) {
value.a_enable = gl(a_enable);
value.a_useiframe = gl(a_useiframe);
value.a_newIframe = gl(a_newIframe);
value.a_iloaded = gl(a_iloaded);
value.a_manualA = gl(a_manualA);
value.a_force = gl(a_force);
var t_a_itimeout = Number(gl(a_itimeout));
value.a_itimeout = isNaN(t_a_itimeout) ? SSS.a_itimeout : (t_a_itimeout >= 0 ? t_a_itimeout : 0);
var t_a_remain = Number(gl(a_remain));
value.a_remain = isNaN(t_a_remain) ? SSS.a_remain : Number(t_a_remain.toFixed(2));
var t_a_maxpage = Number(gl(a_maxpage));
value.a_maxpage = isNaN(t_a_maxpage) ? SSS.a_maxpage : (t_a_maxpage >= 1 ? t_a_maxpage : 1);
var t_a_ipages_1 = Number(gl(a_ipages_1));
value.a_ipages = [gl(a_ipages_0), (isNaN(t_a_ipages_1) ? SSS.a_ipages[1] : (t_a_ipages_1 >= 1 ? t_a_ipages_1 : 1))];
value.a_separator = gl(a_separator);
}
//alert(xToString(value));
SSS.savedValue[SSS.sedValueIndex] = value;
//alert(xToString(SSS.savedValue));
saveValue('spfwset', xToString(SSS.savedValue));
if ((e.shiftKey ? !prefs.FW_RAS : prefs.FW_RAS)) { //按住shift键,执行反向操作.
setTimeout(function(){
location.reload();
}, 1);
}
}, false);

function ll(obj, value) {
if (obj.type == 'checkbox') {
obj.checked = value;
} else {
obj.value = value;
}
}

//载入翻页设置.
if (SSS.a_enable === undefined) { //未定义翻页功能.
a_enable.disabled = true;
autopager_field.style.display = 'none';
} else {
ll(a_enable, SSS.a_enable);
ll(a_useiframe, SSS.a_useiframe);
ll(a_newIframe, SSS.a_newIframe);
ll(a_iloaded, SSS.a_iloaded);
ll(a_itimeout, SSS.a_itimeout);
ll(a_manualA, SSS.a_manualA);
ll(a_force, SSS.a_force);
ll(a_remain, SSS.a_remain);
ll(a_maxpage, SSS.a_maxpage);
ll(a_separator, SSS.a_separator);
ll(a_ipages_0, SSS.a_ipages[0]);
ll(a_ipages_1, SSS.a_ipages[1]);
}

if (!SSS.a_enable) { //当前不是翻页模式,禁用立即翻页按钮.
a_starti.disabled = true;
}

if (!SSS.hasRule) { //如果没有高级规则,那么此项不允许操作.
a_force.disabled = true;
}

//载入预读设置.
ll(useiframe, SSS.useiframe);
ll(viewcontent, SSS.viewcontent);

//总开关
ll(enable, SSS.enable);

var FWKG_state = {
loading: '读取中状态',
prefetcher: '预读状态',
autopager: '翻页状态',
Apause: '翻页状态(暂停)',
Astop: '翻页状态(停止)(翻页完成,或者被异常停止)(无法再开启)',
dot: '读取完后',
};

floatWO = {
updateColor: function(state) {
rect.style.backgroundColor = FWKG_color[state];
rect.setAttribute("title", FWKG_state[state]);
},
loadedIcon: function(command) {
dot.style.display = command == 'show' ? 'block' : 'none';
},
CmodeIcon: function(command) {
cur_mode.style.display = command == 'show' ? 'block' : 'none';
},
};


var vertical = parseInt(prefs.FW_offset[0], 10);
var horiz = parseInt(prefs.FW_offset[1], 10);
var FW_position = prefs.FW_position;

// 非opera用fixed定位.
div.style.position = 'fixed';
switch (FW_position) {
case 1:
div.style.top = vertical + 'px';
div.style.left = horiz + 'px';
break;
case 2:
div.style.top = vertical + 'px';
div.style.right = horiz + 'px';
break;
case 3:
div.style.bottom = vertical + 'px';
div.style.right = horiz + 'px';
break;
case 4:
div.style.bottom = vertical + 'px';
div.style.left = horiz + 'px';
break;
default:
break;
}
}

function sp_transition(start, end) {
var TweenF = sp_transition.TweenF;
if (!TweenF) {
TweenF = Tween[TweenM[prefs.s_method]];
TweenF = TweenF[TweenEase[prefs.s_ease]] || TweenF;
sp_transition.TweenF = TweenF;
}
var frameSpeed = 1000 / prefs.s_FPS;
var t = 0; //次数,开始
var b = start; //开始
var c = end - start; //结束
var d = Math.ceil(prefs.s_duration / frameSpeed); //次数,结束

var x = window.scrollX;

function transition() {
var y = Math.ceil(TweenF(t, b, c, d));
//alert(y);
window.scroll(x, y);
if (t < d) {
t++;
setTimeout(transition, frameSpeed);
}
}
transition();
}

function sepHandler(e) {
e.stopPropagation();
var div = this;
//alert(div);
var target = e.target;
//alert(target);

function getRelativeDiv(which) {
var id = div.id;
id = id.replace(/(sp-separator-)(.+)/, function(a, b, c) {
return b + String((Number(c) + (which == 'pre' ? -1 : 1)));
});
//alert(id);
return (id ? document.getElementById(id) : null);
}

function scrollIt(a, b) {
//a=a!==undefined? a : window.scrollY;
if (prefs.sepT) {
sp_transition(a, b);
} else {
window.scroll(window.scrollX, b);
}
}

var o_scrollY, divS;

switch (target.className) {
case 'sp-sp-gotop':
scrollIt(window.scrollY, 0);
break;
case 'sp-sp-gopre':
var prediv = getRelativeDiv('pre');
if (!prediv) return;
o_scrollY = window.scrollY;
var preDS = prediv.getBoundingClientRect().top;
if (prefs.sepP) {
divS = div.getBoundingClientRect().top;
preDS = o_scrollY - (divS - preDS);
} else {
preDS += o_scrollY - 6;
}
scrollIt(o_scrollY, preDS);
break;
case 'sp-sp-gonext':
var nextdiv = getRelativeDiv('next');
if (!nextdiv) return;
o_scrollY = window.scrollY;
var nextDS = nextdiv.getBoundingClientRect().top;
if (prefs.sepP) {
divS = div.getBoundingClientRect().top;
nextDS = o_scrollY + (-divS + nextDS);
} else {
nextDS += o_scrollY - 6;
}
scrollIt(o_scrollY, nextDS);
break;
case 'sp-sp-gobottom':
scrollIt(window.scrollY, Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
break;
default:
break;
}
}

//autopager
var autoPO = {
startipages: nullFn,
};
var hashchangeAdded = false;

function autopager(SSS, floatWO) {
//return;
//更新悬浮窗的颜色.
floatWO.updateColor('autopager');

//获取插入位置节点.
var insertPoint;
var pageElement;
var insertMode;
if (SSS.a_HT_insert) {
insertPoint = getElement(SSS.a_HT_insert[0]);
insertMode = SSS.a_HT_insert[1];
} else {
pageElement = getAllElements(SSS.a_pageElement);
if (pageElement.length > 0) {
var pELast = pageElement[pageElement.length - 1];
insertPoint = pELast.nextSibling ? pELast.nextSibling : pELast.parentNode.appendChild(document.createTextNode(' '));
}
}

if (insertPoint) {
debug('验证是否能找到插入位置节点:成功,', insertPoint);
} else {
C.error('验证是否能找到插入位置节点:失败', (SSS.a_HT_insert ? SSS.a_HT_insert[0] : ''), 'JS执行终止');
floatWO.updateColor('Astop');
return;
}

if (pageElement === undefined) {
pageElement = getAllElements(SSS.a_pageElement);
}
if (pageElement.length > 0) {
debug('验证是否能找到主要元素:成功,', pageElement);
} else {
C.error('验证是否能找到主要元素:失败,', SSS.a_pageElement, 'JS执行终止');
floatWO.updateColor('Astop');
return;
}

if (SSS.a_stylish) {  // 插入自定义样式
GM_addStyle(SSS.a_stylish, 'Super_preloader-style');
}

var insertPointP;
if (insertMode != 2) {
insertPointP = insertPoint.parentNode;
}

var addIntoDoc;
if (insertMode == 2) {
addIntoDoc = function(obj) {
return insertPoint.appendChild(obj);
};
} else {
addIntoDoc = function(obj) {
return insertPointP.insertBefore(obj, insertPoint);
};
}

var doc, win;

function XHRLoaded(req) {
var str = req.responseText;
doc = win = createDocumentByString(str);

if (!doc) {
C.error('文档对象创建失败');
removeL();
return;
}
floatWO.updateColor('autopager');
floatWO.CmodeIcon('hide');
floatWO.loadedIcon('show');
working = false;
scroll();
}

function removeL(isRemoveAddPage) {
debug('移除各种事件监听');
floatWO.updateColor('Astop');
var _remove = remove;
for (var i = 0, ii = _remove.length; i < ii; i++) {
_remove[i]();
}

if (isRemoveAddPage) {
var separator = document.querySelector('.sp-separator');
if (separator) {
var insertBefore = insertPoint;
if (insertMode == 2) {
var l = insertPoint.children.length;
if (l > 0) {
insertBefore = insertPoint.children[l - 1];
}
}

var range = document.createRange();
range.setStartBefore(separator);
range.setEndBefore(insertBefore);
range.deleteContents();
range.detach();

if (insertMode == 2) {  // 还需要额外移除？
insertPoint.removeChild(insertBefore);
}
}
var style = document.getElementById("Super_preloader-style");
if (style)
style.parentNode.removeChild(style);
}
}
if (isHashchangeSite && !hashchangeAdded) {
window.addEventListener("hashchange", onhashChange, false);
hashchangeAdded = true;
debug('成功添加 hashchange 事件');
}

function onhashChange(event) {
debug("触发 Hashchang 事件");
removeL(true);

setTimeout(function(){
nextlink = getElement(SSS.nextLink || 'auto;');
nextlink = getFullHref(nextlink);
// preLink = getElement(SSS.preLink || 'auto;');
autopager(SSS, floatWO);
}, hashchangeTimer);
}

var iframe;
var messageR;

function iframeLoaded() {
var iframe = this;
//alert(this.contentDocument.body)
var body = iframe.contentDocument.body;
if (body && body.firstChild) {
setTimeout(function() {
doc = iframe.contentDocument;
removeScripts(doc);
win = iframe.contentWindow || doc;
floatWO.updateColor('autopager');
floatWO.CmodeIcon('hide');
floatWO.loadedIcon('show');
working = false;

scroll();
}, SSS.a_itimeout);
}
}

function iframeRquest(link) {
messageR = false;
if (SSS.a_newIframe || !iframe) {
var i = document.createElement('iframe');
iframe = i;
i.name = 'superpreloader-iframe';
i.width = '100%';
i.height = '0';
i.frameBorder = "0";
i.style.cssText = '\
margin:0!important;\
padding:0!important;\
visibility:hidden!important;\
';
i.src = link;
if (SSS.a_iloaded) {
i.addEventListener('load', iframeLoaded, false);
remove.push(function() {
i.removeEventListener('load', iframeLoaded, false);
});
} else {
var messagehandler = function (e) {
if (!messageR && e.data == 'superpreloader-iframe:DOMLoaded') {
messageR = true;
iframeLoaded.call(i);
if (SSS.a_newIframe) {
window.removeEventListener('message', messagehandler, false);
}
}
};
window.addEventListener('message', messagehandler, false);
remove.push(function() {
window.removeEventListener('message', messagehandler, false);
});
}
document.body.appendChild(i);
} else {
iframe.src = link;
iframe.contentDocument.location.replace(link);
}
}

var working;

function doRequest() {
working = true;
floatWO.updateColor('loading');
floatWO.CmodeIcon('show');

debug('获取下一页' + (SSS.a_useiframe ? '(iframe方式)': ''), nextlink);
if (SSS.a_useiframe) {
iframeRquest(nextlink);
} else {
GM_xmlhttpRequest({
method: "GET",
url: nextlink,
overrideMimeType: 'text/html; charset=' + document.characterSet,
onload: XHRLoaded
});
}
}

var ipagesmode = SSS.a_ipages[0];
var ipagesnumber = SSS.a_ipages[1];
var scrollDo = nullFn;
var afterInsertDo = nullFn;
if (prefs.Aplus) {
afterInsertDo = doRequest;
doRequest();
} else {
scrollDo = doRequest;
if (ipagesmode) doRequest();
}

var manualDiv;

function manualAdiv() {
if (!manualDiv) {
GM_addStyle('\
#sp-sp-manualdiv{\
line-height:1.6!important;\
opacity:1!important;\
position:relative!important;\
float:none!important;\
top:0!important;\
left:0!important;\
z-index: 1000!important;\
min-width:366px!important;\
width:auto!important;\
text-align:center!important;\
font-size:14px!important;\
padding:3px 0!important;\
margin:5px 10px 8px;\
clear:both!important;\
border-top:1px solid #ccc!important;\
border-bottom:1px solid #ccc!important;\
-moz-border-radius:30px!important;\
border-radius:30px!important;\
background-color:#F5F5F5!important;\
-moz-box-shadow:inset 0 10px 16px #fff,0 2px 3px rgba(0,0,0,0.1);\
-webkit-box-shadow:inset 0 10px 16px #fff,0 2px 3px rgba(0,0,0,0.1);\
box-shadow:inset 0 10px 16px #fff,0 2px 3px rgba(0,0,0,0.1);\
}\
.sp-sp-md-span{\
font-weight:bold!important;\
margin:0 5px!important;\
}\
#sp-sp-md-number{\
width:50px!important;\
vertical-align:middle!important;\
display:inline-block!important;\
text-align:left!important;\
}\
#sp-sp-md-imgnext{\
padding:0!important;\
margin:0 0 0 5px!important;\
vertical-align:middle!important;\
display:inline-block!important;\
}\
#sp-sp-manualdiv:hover{\
cursor:pointer;\
}\
#sp-sp-md-someinfo{\
position:absolute!important;\
right:16px!important;\
bottom:1px!important;\
font-size:10px!important;\
text-shadow:white 0 1px 0!important;\
color:#5A5A5A!important;\
font-style:italic!important;\
z-index:-1!important;\
background:none!important;\
}\
');

var div = $C('div', { id: 'sp-sp-manualdiv' });
manualDiv = div;
var span = $C('span', { class: 'sp-sp-md-span' }, '下');
div.appendChild(span);

var input = $C('input', {
type: 'number',
value: 1,
min: 1,
title: '输入你想要拼接的页数(必须>=1),然后按回车.',
id: 'sp-sp-md-number'
});

var getInputValue = function () {
var value = Number(input.value);
if (isNaN(value) || value < 1) {
value = 1;
input.value = 1;
}
return value;
};

var spage = function () {
if (doc) {
var value = getInputValue();
//alert(value);
ipagesmode = true;
ipagesnumber = value + paged;
insertedIntoDoc();
}
};
input.addEventListener('keyup', function(e) {
//alert(e.keyCode);
if (e.keyCode == 13) { //回车
spage();
}
}, false);
div.appendChild(input);
div.appendChild($C('span', { className: 'sp-sp-md-span' }, '页'));
div.appendChild($C('img', {id: 'sp-sp-md-imgnext', src: _sep_icons.next}));
div.appendChild($C('span', { id: 'sp-sp-md-someinfo' }, prefs.someValue));
document.body.appendChild(div);
div.addEventListener('click', function(e) {
if (e.target.id == 'sp-sp-md-number') return;
spage();
}, false);
}
addIntoDoc(manualDiv);
manualDiv.style.display = 'block';
}

function beforeInsertIntoDoc() {
working = true;
if (SSS.a_manualA && !ipagesmode) { //显示手动翻页触发条.
manualAdiv();
} else { //直接拼接.
insertedIntoDoc();
}
}


var sepStyle;
var goNextImg = [false];
var sNumber = prefs.sepStartN;
var _sep_icons = sep_icons;
var curNumber = sNumber;

function createSep(lastUrl, currentUrl, nextUrl) {
var div = document.createElement('div');
if (SSS.a_separator) {
if (!sepStyle) {
sepStyle = GM_addStyle('\
div.sp-separator{\
line-height:1.6!important;\
opacity:1!important;\
position:relative!important;\
float:none!important;\
top:0!important;\
left:0!important;\
min-width:366px;\
width:auto;\
text-align:center!important;\
font-size:14px!important;\
display:block!important;\
padding:3px 0!important;\
margin:5px 10px 8px;\
clear:both!important;\
border-top:1px solid #ccc!important;\
border-bottom:1px solid #ccc!important;\
-moz-border-radius:30px!important;\
border-radius:30px!important;\
background-color:#F5F5F5!important;\
-moz-box-shadow:inset 0 16px 20px #fff,0 2px 3px rgba(0,0,0,0.1);\
-webkit-box-shadow:inset 0 16px 20px #fff,0 2px 3px rgba(0,0,0,0.1);\
box-shadow:inset 0 16px 20px #fff,0 2px 3px rgba(0,0,0,0.1);\
}\
div.sp-separator img{\
vertical-align:middle!important;\
cursor:pointer!important;\
padding:0!important;\
margin:0 5px!important;\
border:none!important;\
display:inline-block!important;\
float:none!important;\
width: auto;\
height: auto;\
}\
div.sp-separator a.sp-sp-nextlink{\
margin:0 20px 0 -6px!important;\
display:inline!important;\
text-shadow:#fff 0 1px 0!important;\
background:none!important;\
}\
div.sp-separator span.sp-span-someinfo{\
position:absolute!important;\
right:16px!important;\
bottom:1px!important;\
font-size:10px!important;\
text-shadow:white 0 1px 0!important;\
color:#5A5A5A!important;\
font-style:italic!important;\
z-index:-1!important;\
background:none!important;\
}\
');
}

div.className = 'sp-separator';
div.id = 'sp-separator-' + curNumber;
div.addEventListener('click', sepHandler, false);

var pageStr = '第 <span style="color:red!important;">' + curNumber + '</span> 页' +
( SSS.a_separatorReal ? getRalativePageStr(lastUrl, currentUrl, nextUrl) : '');
div.appendChild($C('a', {
class: 'sp-sp-nextlink',
href: currentUrl,
title: currentUrl
}, pageStr));

div.appendChild($C('img', {
src: _sep_icons.top,
class: 'sp-sp-gotop',
alt: '去到顶部',
title: '去到顶部'
}));

div.appendChild($C('img', {
src: curNumber == sNumber ? _sep_icons.pre_gray : _sep_icons.pre,
class: 'sp-sp-gopre',
title: '上滚一页'
}));

var i_next = $C('img', {
src: _sep_icons.next_gray,
class: 'sp-sp-gonext',
title: '下滚一页'
});

if (goNextImg.length == 2) {
goNextImg.shift();
}
goNextImg.push(i_next);
div.appendChild(i_next);

div.appendChild($C('img', {
src: _sep_icons.bottom,
class: 'sp-sp-gobottom',
alt: '去到底部',
title: '去到底部'
}));

div.appendChild($C('span', { class: 'sp-span-someinfo' }, prefs.someValue));
curNumber += 1;
} else {
div.style.cssText = '\
height:0!important;\
width:0!important;\
margin:0!important;\
padding:0!important;\
border:none!important;\
clear:both!important;\
display:block!important;\
visibility:hidden!important;\
';
}
return div;
}

var paged = 0;

function insertedIntoDoc() {
if (!doc) return;

if(SSS.a_documentFilter){
try{
SSS.a_documentFilter(doc, nextlink);
}catch(e){
C.error("执行 documentFilter 错误", e, SSS.a_documentFilter.toString());
}
}

var docTitle = getElementByCSS("title", doc).textContent;

removeScripts(doc);

var fragment = document.createDocumentFragment();
var pageElements = getAllElements(SSS.a_pageElement, false, doc, win);
var ii = pageElements.length;
if (ii <= 0) {
debug('获取下一页的主要内容失败', SSS.a_pageElement);
removeL();
return;
}

// 提前查找下一页链接，后面再赋值
var lastUrl = cplink;
cplink = nextlink;
var nl = getElement(SSS.nextLink, false, doc, win);
if (nl) {
nl = getFullHref(nl);
if (nl == nextlink) {
nextlink = null;
} else {
nextlink = nl;
}
} else {
nextlink = null;
}

var i, pe_x, pe_x_nn;
for (i = 0; i < ii; i++) {
pe_x = pageElements[i];
pe_x_nn = pe_x.nodeName;
if (pe_x_nn == 'BODY' || pe_x_nn == 'HTML' || pe_x_nn == 'SCRIPT') continue;
fragment.appendChild(pe_x);
}

if (SSS.filter && typeof(SSS.filter) == 'string') { //功能未完善.
//alert(SSS.filter);
var nodes = [];
try {
nodes = getAllElements(SSS.filter, fragment);
} catch (e) {}
var nodes_x;
for (i = nodes.length - 1; i >= 0; i--) {
nodes_x = nodes[i];
nodes_x.parentNode.removeChild(nodes_x);
}
}

// lazyImgSrc
if (SSS.lazyImgSrc) {
handleLazyImgSrc(SSS.lazyImgSrc, fragment);
}

var imgs;
if (!window.opera && SSS.a_useiframe && !SSS.a_iloaded) {
imgs = getAllElements('css;img[src]', fragment); //收集所有图片
}

// 处理下一页内容部分链接是否新标签页打开
if (prefs.forceTargetWindow) {
var arr = Array.prototype.slice.call(fragment.querySelectorAll('a[href]:not([href^="mailto:"]):not([href^="javascript:"]):not([href^="#"])'));
arr.forEach(function (elem){
elem.setAttribute('target', '_blank');
if (elem.getAttribute('onclick') == 'atarget(this)') {  // 卡饭论坛的控制是否在新标签页打开
elem.removeAttribute('onclick');
}
});
}

var sepdiv = createSep(lastUrl, cplink, nextlink);
if (pageElements[0] && pageElements[0].tagName == 'TR') {
var insertParent = insertPoint.parentNode;
var colNodes = getAllElements('child::tr[1]/child::*[self::td or self::th]', insertParent);
var colums = 0;
for (var x = 0, l = colNodes.length; x < l; x++) {
var col = colNodes[x].getAttribute('colspan');
colums += parseInt(col, 10) || 1;
}
var td = doc.createElement('td');
td.appendChild(sepdiv);
var tr = doc.createElement('tr');
td.setAttribute('colspan', colums);
tr.appendChild(td);
fragment.insertBefore(tr, fragment.firstChild);
} else {
fragment.insertBefore(sepdiv, fragment.firstChild);
}

addIntoDoc(fragment);

// filter
if (SSS.filter && typeof(SSS.filter) == 'function') {
try{
SSS.filter(pageElements);
debug("执行 filter(pages) 成功");
}catch(e){
C.error("执行 filter(pages) 错误", e, SSS.filter.toString());
}
}

if (imgs) { //非opera,在iframeDOM取出数据时需要重载图片.
setTimeout(function() {
var _imgs = imgs;
var i, ii, img;
for (i = 0, ii = _imgs.length; i < ii; i++) {
img = _imgs[i];
var src = img.src;
img.src = src;
}
}, 99);
}

if (SSS.a_replaceE) {
var oldE = getAllElements(SSS.a_replaceE);
var oldE_lt = oldE.length;
//alert(oldE_lt);
if (oldE_lt > 0) {
var newE = getAllElements(SSS.a_replaceE, false, doc, win);
var newE_lt = newE.length;
//alert(newE_lt);
if (newE_lt == oldE_lt) {  // 替换
var oldE_x, newE_x;
for (i = 0; i < newE_lt; i++) {
oldE_x = oldE[i];
newE_x = newE[i];
newE_x = doc.importNode(newE_x, true);
oldE_x.parentNode.replaceChild(newE_x, oldE_x);
}
}
}
}

paged += 1;
if (ipagesmode && paged >= ipagesnumber) {
ipagesmode = false;
}
floatWO.loadedIcon('hide');
if (manualDiv) {
manualDiv.style.display = 'none';
}
if (goNextImg[0]) goNextImg[0].src = _sep_icons.next;


var ev = document.createEvent('Event');
ev.initEvent('Super_preloaderPageLoaded', true, false);
document.dispatchEvent(ev);

if(prefs.enableHistory){
try {
window.history.pushState(null, docTitle, cplink);
} catch(e) {}
}

if (paged >= SSS.a_maxpage) {
debug('到达所设定的最大翻页数', SSS.a_maxpage);
notice('<b>状态</b>:' + '到达所设定的最大翻页数:<b style="color:red">' + SSS.a_maxpage + '</b>');
removeL();
return;
}
var delayiframe = function(fn) {
setTimeout(fn, 199);
};
if (nextlink) {
// debug('找到下一页链接:', nextlink);
doc = win = null;
if (ipagesmode) {
if (SSS.a_useiframe) { //延时点,firefox,太急会卡-_-!
delayiframe(doRequest);
} else {
doRequest();
}
} else {
working = false;
if (SSS.a_useiframe) {
delayiframe(afterInsertDo);
} else {
afterInsertDo();
}
}
} else {
debug('没有找到下一页链接', SSS.nextLink);
removeL();
return;
}
}

//返回,剩余高度是总高度的比值.
var relatedObj_0, relatedObj_1;
if (SSS.a_relatedObj) {
if (_.isArray(SSS.a_relatedObj)) {
relatedObj_0 = SSS.a_relatedObj[0];
relatedObj_1 = SSS.a_relatedObj[1];
} else {
relatedObj_0 = SSS.a_pageElement;
relatedObj_1 = 'bottom';
}
}

function getRemain() {
var scrolly = window.scrollY;
var WI = window.innerHeight;
var obj = getLastElement(relatedObj_0);
var scrollH = (obj && obj.nodeType == 1) ? (obj.getBoundingClientRect()[relatedObj_1] + scrolly) : Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
return (scrollH - scrolly - WI) / WI; //剩余高度于页面总高度的比例.
}

var pause = false;
if (prefs.pauseA) {
var Sbutton = ['target', 'shiftKey', 'ctrlKey', 'altKey'];
var ltype = prefs.mouseA ? 'mousedown' : 'dblclick';
var button_1 = Sbutton[prefs.Pbutton[0]];
var button_2 = Sbutton[prefs.Pbutton[1]];
var button_3 = Sbutton[prefs.Pbutton[2]];

var pauseIt = function () {
pause = !pause;
if (prefs.stop_ipage) ipagesmode = false;
if (pause) {
floatWO.updateColor('Apause');
notice('<b>状态</b>:' + '自动翻页<span style="color:red!important;"><b>暂停</b></span>.');
} else {
floatWO.updateColor('autopager');
floatWO.CmodeIcon('hide');
notice('<b>状态</b>:' + '自动翻页<span style="color:red!important;"><b>启用</b></span>.');
}
scroll();
};
var Sctimeout;

var clearPause = function () {
clearTimeout(Sctimeout);
document.removeEventListener('mouseup', arguments.callee, false);
};

var pausehandler = function (e) {
if (!SSS.a_manualA || ipagesmode || pause) {
if (e[button_1] && e[button_2] && e[button_3]) {
if (e.type == 'mousedown') {
document.addEventListener('mouseup', clearPause, false);
Sctimeout = setTimeout(pauseIt, prefs.Atimeout);
} else {
pauseIt();
}
}
}
};
document.addEventListener(ltype, pausehandler, false);
remove.push(function() {
document.removeEventListener(ltype, pausehandler, false);
});
}

function scroll() {
if (!pause && !working && (getRemain() <= SSS.a_remain || ipagesmode)) {
if (doc) { //有的话,就插入到文档.
beforeInsertIntoDoc();
} else { //否则就请求文档.
scrollDo();
}
}
}

var timeout;
function timeoutfn(){
clearTimeout(timeout);
timeout = setTimeout(scroll, 100);
}
window.addEventListener('scroll', timeoutfn, false);
remove.push(function() {
window.removeEventListener('scroll', timeoutfn, false);
});

autoPO = {
startipages: function(value) {
if (value > 0) {
ipagesmode = true;
ipagesnumber = value + paged;
notice('<b>状态</b>:' + '当前已翻页数量:<b>' + paged + '</b>,' + '连续翻页到第<b style="color:red!important;">' + ipagesnumber + '</b>页.');
if (SSS.a_manualA) insertedIntoDoc();
scroll();
}
},
};
}

//prefetcher
function prefetcher(SSS, floatWO) {
function cContainer() {
var div = document.createElement('div');
var div2 = div.cloneNode(false);
var hr = document.createElement('hr');
div.style.cssText = '\
margin:3px!important;\
padding:5px!important;\
border-radius:8px!important;\
-moz-border-radius:8px!important;\
border-bottom:1px solid #E30005!important;\
border-top:1px solid #E30005!important;\
background-color:#F5F5F5!important;\
float:none!important;\
';
div.title = '预读的内容';
div2.style.cssText = '\
text-align:left!important;\
color:red!important;\
font-size:13px!important;\
display:block!important;\
float:none!important;\
position:static!important;\
';
hr.style.cssText = '\
display:block!important;\
border:1px inset #000!important;\
';
div.appendChild(div2);
div.appendChild(hr);
document.body.appendChild(div);
return {
div: div,
div2: div2
};
}

floatWO.updateColor('prefetcher');

floatWO.updateColor('loading');
floatWO.CmodeIcon('show');

if (SSS.useiframe) {
var iframe = document.createElement('iframe');
iframe.name = 'superpreloader-iframe';
iframe.src = nextlink;
iframe.width = '100%';
iframe.height = '0';
iframe.frameBorder = "0";
iframe.style.cssText = '\
margin:0!important;\
padding:0!important;\
';
iframe.addEventListener('load', function() {
var body = this.contentDocument.body;
if (body && body.firstChild) {
floatWO.updateColor('prefetcher');
floatWO.CmodeIcon('hide');
floatWO.loadedIcon('show');
this.removeEventListener('load', arguments.callee, false);

if (SSS.lazyImgSrc) {
handleLazyImgSrc(SSS.lazyImgSrc, body);
}
}
}, false);
if (SSS.viewcontent) {
var container = cContainer();
container.div2.innerHTML = 'iframe全预读: ' + '<br />' + '预读网址: ' + '<b>' + nextlink + '</b>';
iframe.height = '300px';
container.div.appendChild(iframe);
} else {
document.body.appendChild(iframe);
}
} else {
GM_xmlhttpRequest({
method: "GET",
url: nextlink,
overrideMimeType: 'text/html; charset=' + document.characterSet,
onload: function(req) {
var str = req.responseText;
var doc = createDocumentByString(str);
if (!doc) {
C.error('文档对象创建失败!');
return;
}

if (SSS.lazyImgSrc) {
handleLazyImgSrc(SSS.lazyImgSrc, doc);
}

var images = doc.images;
var isl = images.length;
var img;
var iarray = [];
var i;
var existSRC = {};
var isrc;
for (i = isl - 1; i >= 0; i--) {
isrc = images[i].getAttribute('src');
if (!isrc || existSRC[isrc]) {
continue;
} else {
existSRC[isrc] = true;
}
img = document.createElement('img');
img.src = isrc;
iarray.push(img);
}
if (SSS.viewcontent) {
var containter = cContainer();
var div = containter.div;
i = iarray.length;
containter.div2.innerHTML = '预读取图片张数: ' + '<b>' + i + '</b>' + '<br />' + '预读网址: ' + '<b>' + nextlink + '</b>';
for (i -= 1; i >= 0; i--) {
div.appendChild(iarray[i]);
}
}
floatWO.updateColor('prefetcher');
floatWO.loadedIcon('show');
floatWO.CmodeIcon('hide');
}
});
}
}


//执行开始..///////////////////

// 分析黑名单
var blackList_re = new RegExp(blackList.map(wildcardToRegExpStr).join("|"));
if(blackList_re.test(url)){
debug('匹配黑名单，js执行终止');
return;
}

//是否在frame上加载..
if (prefs.DisableI && window.self != window.parent) {
var isReturn = !_.find(DIExclude, function(x){ return x[1] && x[2].test(url); });
if (isReturn) {
debug('url为:', url, '的页面为非顶层窗口,JS执行终止.');
return;
}
}
debug('url为:', url, 'JS加载成功');

//第一阶段..分析高级模式..
SITEINFO = SITEINFO.concat(SITEINFO_TP, SITEINFO_comp);

//重要的变量两枚.
var nextlink;
var prelink;
//===============

var SSS = {};

var findCurSiteInfo = function() {
var SII;
var SIIA;
var SIIAD = SITEINFO_D.autopager;
var Rurl;
var ii = SITEINFO.length;

debug('高级规则数量:', ii);

for (var i = 0; i < ii; i++) {
SII = SITEINFO[i];
Rurl = toRE(SII.url);
if (Rurl.test(url)) {
debug('找到匹配当前站点的规则:', SII, '是第', i + 1, '规则');

// 运行规则的 startFilter
if (SII.autopager && SII.autopager.startFilter) {
SII.autopager.startFilter(window, document);
debug('成功运行 startFilter');
}

nextlink = getElement(SII.nextLink || 'auto;');
if (!nextlink) {
debug('无法找到下一页链接,跳过规则:', SII, '继续查找其他规则');
continue;
}

if (SII.preLink && SII.preLink != 'auto;') { //如果设定了具体的preLink
prelink = getElement(SII.preLink);
} else {
if(prefs.autoGetPreLink){
getElement('auto;');
}
}

// alert(prelink);
SSS.hasRule = true;
SSS.Rurl = String(Rurl);
// alert(SSS.Rurl);
SSS.nextLink = SII.nextLink || 'auto;';
SSS.viewcontent = SII.viewcontent;
SSS.enable = (SII.enable === undefined) ? SITEINFO_D.enable : SII.enable;
SSS.useiframe = (SII.useiframe === undefined) ? SITEINFO_D.useiframe : SII.useiframe;
if (SII.pageElement) { //如果是Oautopager的规则..
if (!(SII.autopager instanceof Object)) SII.autopager = {};
SII.autopager.pageElement = SII.pageElement;
if (SII.insertBefore) SII.autopager.HT_insert = [SII.insertBefore, 1];
}

//自动翻页设置.
SIIA = SII.autopager;
if (SIIA) {
SSS.a_pageElement = SIIA.pageElement;
if (!SSS.a_pageElement) break;
SSS.a_manualA = (SIIA.manualA === undefined) ? SIIAD.manualA : SIIA.manualA;
SSS.a_enable = (SIIA.enable === undefined) ? SIIAD.enable : SIIA.enable;
SSS.a_useiframe = (SIIA.useiframe === undefined) ? SIIAD.useiframe : SIIA.useiframe;
SSS.a_newIframe = (SIIA.newIframe === undefined) ? SIIAD.newIframe : SIIA.newIframe;
SSS.a_iloaded = (SIIA.iloaded === undefined) ? SIIAD.iloaded : SIIA.iloaded;
SSS.a_itimeout = (SIIA.itimeout === undefined) ? SIIAD.itimeout : SIIA.itimeout;
//alert(SSS.a_itimeout);
SSS.a_remain = (SIIA.remain === undefined) ? SIIAD.remain : SIIA.remain;
SSS.a_maxpage = (SIIA.maxpage === undefined) ? SIIAD.maxpage : SIIA.maxpage;
SSS.a_separator = (SIIA.separator === undefined) ? SIIAD.separator : SIIA.separator;
SSS.a_separatorReal = (SIIA.separatorReal === undefined) ? SIIAD.separatorReal : SIIA.separatorReal;
SSS.a_replaceE = SIIA.replaceE;
SSS.a_HT_insert = SIIA.HT_insert;
SSS.a_relatedObj = SIIA.relatedObj;
SSS.a_ipages = (SIIA.ipages === undefined) ? SIIAD.ipages : SIIA.ipages;

// new
SSS.filter = SII.filter || SIIA.filter;  // 新增了函数的形式，原来的功能是移除 pageElement
SSS.a_documentFilter = SII.documentFilter || SIIA.documentFilter;
SSS.a_stylish = SII.stylish || SIIA.stylish;
SSS.lazyImgSrc = SIIA.lazyImgSrc;
}

// 检验是否存在内容
var pageElement = getElement(SSS.a_pageElement);
if (!pageElement) {
debug('无法找到内容,跳过规则:', SII, '继续查找其他规则');
continue;
}

break;
}
}

if (!SSS.hasRule) {
debug('未找到合适的高级规则,开始自动匹配.');
//自动搜索.
if (!autoMatch.keyMatch) {
debug('自动匹配功能被禁用了.');
} else {
nextlink = autoGetLink();
//alert(nextlink);
if (nextlink) { //强制模式.
var FA = autoMatch.FA;
SSS.Rurl = window.localStorage ? ('am:' + (url.match(/^https?:\/\/[^:]*\//i) || [])[0]) : 'am:automatch';
//alert(SSS.Rurl);
SSS.enable = true;
SSS.nextLink = 'auto;';
SSS.viewcontent = autoMatch.viewcontent;
SSS.useiframe = autoMatch.useiframe;
SSS.a_force = true;
SSS.a_manualA = FA.manualA;
// SSS.a_enable = FA.enable || false; //不能使a_enable的值==undefined...
SSS.a_enable = FA.enable || SITEINFO_D.autopager.force_enable; //不能使a_enable的值==undefined...
SSS.a_useiframe = FA.useiframe;
SSS.a_iloaded = FA.iloaded;
SSS.a_itimeout = FA.itimeout;
SSS.a_remain = FA.remain;
SSS.a_maxpage = FA.maxpage;
SSS.a_separator = FA.separator;
SSS.a_ipages = FA.ipages;
}
}
}

// 如果规则没 lazyImgSrc，设置默认值
if (!SSS.lazyImgSrc) {
SSS.lazyImgSrc = prefs.lazyImgSrc;
}

debug('搜索高级规则和自动匹配过程总耗时:', new Date() - startTime, '毫秒');
};

findCurSiteInfo();

//上下页都没有找到啊
if (!nextlink && !prelink) {
debug('未找到相关链接, JS执行停止. 共耗时' + (new Date() - startTime) + '毫秒');
return;
} else {
debug('上一页链接:', prelink);
debug('下一页链接:', nextlink);
nextlink = nextlink ? (nextlink.href || nextlink) : undefined;
prelink = prelink ? (prelink.href || prelink) : undefined;
}

var superPreloader = {
go: function() {
if (nextlink) window.location.href = nextlink;
},
back: function() {
if(!prelink) getElement('auto;');
if (prelink) window.location.href = prelink;
},
};

if (prefs.arrowKeyPage) {
debug('添加键盘左右方向键翻页监听.');
document.addEventListener('keyup', function(e) {
var tarNN = e.target.nodeName;
if (tarNN != 'BODY' && tarNN != 'HTML') return;
switch (e.keyCode) {
case 37:
superPreloader.back();
break;
case 39:
superPreloader.go();
break;
default:
break;
}
}, false);
}

// 监听下一页事件.
debug('添加鼠标手势翻页监听.');
document.addEventListener('superPreloader.go', function() {
superPreloader.go();
}, false);

// 监听下一页事件.
document.addEventListener('superPreloader.back', function() {
superPreloader.back();
}, false);

// 没找到下一页的链接
if (!nextlink) {
debug('下一页链接不存在,JS无法继续.');
debug('全部过程耗时:', new Date() - startTime, '毫秒');
return;
}

// 载入设置..
var loadLocalSetting = function() {
debug('加载设置');
var savedValue = getValue('spfwset');
if (savedValue) {
try {
savedValue = eval(savedValue);
} catch (e) {
saveValue('spfwset', ''); //有问题的设置,被手动修改过?,清除掉,不然下次还是要出错.
}
}
if (savedValue) {
SSS.savedValue = savedValue;
for (i = 0, ii = savedValue.length; i < ii; i++) {
savedValue_x = savedValue[i];
if (savedValue_x.Rurl == SSS.Rurl) {
for (var ix in savedValue_x) {
if (savedValue_x.hasOwnProperty(ix)) {
SSS[ix] = savedValue_x[ix]; //加载键值.
}
}
break;
}
}
//alert(i);
SSS.sedValueIndex = i;
} else {
SSS.savedValue = [];
SSS.sedValueIndex = 0;
}
};

loadLocalSetting();

if (!SSS.hasRule) {
SSS.a_force = true;
}

if (SSS.a_force) {
SSS.a_pageElement = '//body/*';
SSS.a_HT_insert = undefined;
SSS.a_relatedObj = undefined;
}

if (prefs.floatWindow) {
debug('创建悬浮窗');
floatWindow(SSS);
}

if (!SSS.enable) {
debug('本规则被关闭,脚本执行停止');
debug('全部过程耗时:', new Date() - startTime, '毫秒');
return;
}
debug('全部过程耗时:', new Date() - startTime, '毫秒');

// 预读或者翻页.
if (SSS.a_enable) {
debug('初始化,翻页模式.');
autopager(SSS, floatWO);
} else {
debug('初始化,预读模式.');
prefetcher(SSS, floatWO);
}

var docChecked;
function autoGetLink(doc, win) {
if (!autoMatch.keyMatch) return;
if (!parseKWRE.done) {
parseKWRE();
parseKWRE.done = true;
}

var startTime = new Date();
doc = doc || document;
win = win || window;

if (doc == document) { //当前文档,只检查一次.
//alert(nextlink);
if (docChecked) return nextlink;
docChecked = true;
}

var _prePageKey = prePageKey;
var _nextPageKey = nextPageKey;
var _nPKL = nextPageKey.length;
var _pPKL = prePageKey.length;
var _getFullHref = getFullHref;
var _getAllElementsByXpath = getAllElementsByXpath;
var _Number = Number;
var _domain_port = domain_port;
var alllinks = doc.links;
var alllinksl = alllinks.length;

var curLHref = cplink;
var _nextlink;
var _prelink;
if (!autoGetLink.checked) { //第一次检查
_nextlink = nextlink;
_prelink = prelink;
} else {
_prelink = true;
}

var DCEnable = autoMatch.digitalCheck;
var DCRE = /^\s*\D{0,1}(\d+)\D{0,1}\s*$/;

var i, a, ahref, atext, numtext;
var aP, initSD, searchD = 1,
preS1, preS2, searchedD, pSNText, preSS, nodeType;
var nextS1, nextS2, nSNText, nextSS;
var aimgs, j, jj, aimg_x, xbreak, k, keytext;

function finalCheck(a, type) {
var ahref = a.getAttribute('href'); //在chrome上当是非当前页面文档对象的时候直接用a.href访问,不返回href
if (ahref == '#') {
return null;
}
ahref = _getFullHref(ahref); //从相对路径获取完全的href;

//3个条件:http协议链接,非跳到当前页面的链接,非跨域
if (/^https?:/i.test(ahref) && ahref.replace(/#.*$/, '') != curLHref && ahref.match(/https?:\/\/([^\/]+)/)[1] == _domain_port) {
if (xbug) {
debug((type == 'pre' ? '上一页' : '下一页') + '匹配到的关键字为:', atext);
}
return a; //返回对象A
//return ahref;
}
}

if (xbug) {
debug('全文档链接数量:', alllinksl);
}

for (i = 0; i < alllinksl; i++) {
if (_nextlink && _prelink) break;
a = alllinks[i];
if (!a) continue; //undefined跳过
//links集合返回的本来就是包含href的a元素..所以不用检测
//if(!a.hasAttribute("href"))continue;
atext = a.textContent;
if (atext) {
if (DCEnable) {
numtext = atext.match(DCRE);
if (numtext) { //是不是纯数字
//debug(numtext);
numtext = numtext[1];
//alert(numtext);
aP = a;
initSD = 0;

if (!_nextlink) {
preS1 = a.previousSibling;
preS2 = a.previousElementSibling;


while (!(preS1 || preS2) && initSD < searchD) {
aP = aP.parentNode;
if (aP) {
preS1 = aP.previousSibling;
preS2 = aP.previousElementSibling;
}
initSD++;
//alert('initSD: '+initSD);
}
searchedD = initSD > 0 ? true : false;

if (preS1 || preS2) {
pSNText = preS1 ? preS1.textContent.match(DCRE) : '';
if (pSNText) {
preSS = preS1;
} else {
pSNText = preS2 ? preS2.textContent.match(DCRE) : '';
preSS = preS2;
}
//alert(previousS);
if (pSNText) {
pSNText = pSNText[1];
//debug(pSNText)
//alert(pSNText)
if (_Number(pSNText) == _Number(numtext) - 1) {
//alert(searchedD);
nodeType = preSS.nodeType;
//alert(nodeType);
if (nodeType == 3 || (nodeType == 1 && (searchedD ? _getAllElementsByXpath('./descendant-or-self::a[@href]', preSS, doc).snapshotLength === 0 : (!preSS.hasAttribute('href') || _getFullHref(preSS.getAttribute('href')) == curLHref)))) {
_nextlink = finalCheck(a, 'next');
//alert(_nextlink);
}
continue;
}
}
}
}

if (!_prelink) {
nextS1 = a.nextSibling;
nextS2 = a.nextElementSibling;

while (!(nextS1 || nextS2) && initSD < searchD) {
aP = aP.parentNode;
if (aP) {
nextS1 = a.nextSibling;
nextS2 = a.nextElementSibling;
}
initSD++;
//alert('initSD: '+initSD);
}
searchedD = initSD > 0 ? true : false;

if (nextS1 || nextS2) {
nSNText = nextS1 ? nextS1.textContent.match(DCRE) : '';
if (nSNText) {
nextSS = nextS1;
} else {
nSNText = nextS2 ? nextS2.textContent.match(DCRE) : '';
nextSS = nextS2;
}
//alert(nextS);
if (nSNText) {
nSNText = nSNText[1];
//alert(pSNText)
if (_Number(nSNText) == _Number(numtext) + 1) {
//alert(searchedD);
nodeType = nextSS.nodeType;
//alert(nodeType);
if (nodeType == 3 || (nodeType == 1 && (searchedD ? _getAllElementsByXpath('./descendant-or-self::a[@href]', nextSS, doc).snapshotLength === 0 : (!nextSS.hasAttribute("href") || _getFullHref(nextSS.getAttribute('href')) == curLHref)))) {
_prelink = finalCheck(a, 'pre');
//alert(_prelink);
}
}
}
}
}
continue;
}
}
} else {
atext = a.title;
}
if (!atext) {
aimgs = a.getElementsByTagName('img');
for (j = 0, jj = aimgs.length; j < jj; j++) {
aimg_x = aimgs[j];
atext = aimg_x.alt || aimg_x.title;
if (atext) break;
}
}
if (!atext) continue;
if (!_nextlink) {
xbreak = false;
for (k = 0; k < _nPKL; k++) {
keytext = _nextPageKey[k];
if (!(keytext.test(atext))) continue;
_nextlink = finalCheck(a, 'next');
xbreak = true;
break;
}
if (xbreak || _nextlink) continue;
}
if (!_prelink) {
for (k = 0; k < _pPKL; k++) {
keytext = _prePageKey[k];
if (!(keytext.test(atext))) continue;
_prelink = finalCheck(a, 'pre');
break;
}
}
}

debug('搜索链接数量:', i, '耗时:', new Date() - startTime, '毫秒');

if (!autoGetLink.checked) { //只在第一次检测的时候,抛出上一页链接.
prelink = _prelink;
autoGetLink.checked = true;
}

//alert(_nextlink);
return _nextlink;
}

function parseKWRE() {
function modifyPageKey(name, pageKey, pageKeyLength) {
function strMTE(str) {
return (str.replace(/\\/g, '\\\\')
.replace(/\+/g, '\\+')
.replace(/\./g, '\\.')
.replace(/\?/g, '\\?')
.replace(/\{/g, '\\{')
.replace(/\}/g, '\\}')
.replace(/\[/g, '\\[')
.replace(/\]/g, '\\]')
.replace(/\^/g, '\\^')
.replace(/\$/g, '\\$')
.replace(/\*/g, '\\*')
.replace(/\(/g, '\\(')
.replace(/\)/g, '\\)')
.replace(/\|/g, '\\|')
.replace(/\//g, '\\/'));
}

var pfwordl = autoMatch.pfwordl,
sfwordl = autoMatch.sfwordl;

var RE_enable_a = pfwordl[name].enable,
RE_maxPrefix = pfwordl[name].maxPrefix,
RE_character_a = pfwordl[name].character,
RE_enable_b = sfwordl[name].enable,
RE_maxSubfix = sfwordl[name].maxSubfix,
RE_character_b = sfwordl[name].character;
var plwords,
slwords,
rep;

plwords = RE_maxPrefix > 0 ? ('[' + (RE_enable_a ? strMTE(RE_character_a.join('')) : '.') + ']{0,' + RE_maxPrefix + '}') : '';
plwords = '^\\s*' + plwords;
//alert(plwords);
slwords = RE_maxSubfix > 0 ? ('[' + (RE_enable_b ? strMTE(RE_character_b.join('')) : '.') + ']{0,' + RE_maxSubfix + '}') : '';
slwords = slwords + '\\s*$';
//alert(slwords);
rep = prefs.cases ? '' : 'i';

for (var i = 0; i < pageKeyLength; i++) {
pageKey[i] = new RegExp(plwords + strMTE(pageKey[i]) + slwords, rep);
//alert(pageKey[i]);
}
return pageKey;
}

//转成正则.
prePageKey = modifyPageKey('previous', prePageKey, prePageKey.length);
nextPageKey = modifyPageKey('next', nextPageKey, nextPageKey.length);
}

// 地址栏递增处理函数.
function hrefInc(obj, doc, win) {
var _cplink = cplink;

function getHref(href) {
var mFails = obj.mFails;
if (!mFails) return href;
var str;
if (typeof mFails == 'string') {
str = mFails;
} else {
var fx;
var array = [];
var i, ii;
var mValue;
for (i = 0, ii = mFails.length; i < ii; i++) {
fx = mFails[i];
if (!fx) continue;
if (typeof fx == 'string') {
array.push(fx);
} else {
mValue = href.match(fx);
if (!mValue) return href;
array.push(mValue);
}
}
str = array.join('');
}
return str;
}
// alert(getHref(_cplink))

var sa = obj.startAfter;
var saType = typeof sa;
var index;

if (saType == 'string') {
index = _cplink.indexOf(sa);
if (index == -1) {
_cplink = getHref(_cplink);
index = _cplink.indexOf(sa);
if (index == -1) return;
//alert(index);
}
} else {
var tsa = _cplink.match(sa);
//alert(sa);
if (!tsa) {
_cplink = getHref(_cplink);
sa = (_cplink.match(sa) || [])[0];
if (!sa) return;
index = _cplink.indexOf(sa);
if (index == -1) return;
} else {
sa = tsa[0];
index = _cplink.indexOf(sa);
//alert(index)
//alert(tsa.index)
}
}

index += sa.length;
var max = obj.max === undefined ? 9999 : obj.max;
var min = obj.min === undefined ? 1 : obj.min;
var aStr = _cplink.slice(0, index);
var bStr = _cplink.slice(index);
var nbStr = bStr.replace(/^(\d+)(.*)$/, function(a, b, c) {
b = Number(b) + obj.inc;
if (b >= max || b < min) return a;
return b + c;
});
// alert(aStr+nbStr);
if (nbStr !== bStr) {
var ilresult;
try {
ilresult = obj.isLast(doc, unsafeWindow, _cplink);
} catch (e) {}
if (ilresult) return;
return aStr + nbStr;
}
}

// 获取单个元素,混合
function getElement(selector, contextNode, doc, win) {
var ret;
if (!selector) return ret;
doc = doc || document;
win = win || window;
contextNode = contextNode || doc;
var type = typeof selector;
if (type == 'string') {
if (selector.search(/^css;/i) === 0) {
ret = getElementByCSS(selector.slice(4), contextNode);
} else if (selector.toLowerCase() == 'auto;') {
ret = autoGetLink(doc, win);
} else {
ret = getElementByXpath(selector, contextNode, doc);
}
} else if (type == 'function') {
ret = selector(doc, win, cplink);
} else if (selector instanceof Array) {
for (var i = 0, l = selector.length; i < l; i++) {
ret = getElement(selector[i], contextNode, doc, win);
if (ret) {
break;
}
}
} else {
ret = hrefInc(selector, doc, win);
}
return ret;
}
}


// ====================  libs  ==============================

// 自造简化版 underscroe 库，仅 ECMAScript 5
var _ = (function(){

var nativeIsArray = Array.isArray;
var _ = function(obj){
if(obj instanceof _) return obj;
if(!(this instanceof _)) return new _(obj);
this._wrapped = obj;
};

var toString = Object.prototype.toString;

_.isArray = nativeIsArray || function(obj) {
return toString.call(obj) == '[object Array]';
};

['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'].forEach(function(name){
_['is' + name] = function(obj) {
return toString.call(obj) == '[object ' + name + ']';
};
});

// Return the first value which passes a truth test. Aliased as `detect`.
_.find = function(obj, iterator, context){
var result;
obj.some(function(value, index, array){
if(iterator.call(context, value, index, array)){
result = value;
return true;
}
});
return result;
};

return _;
})();

/* jshint ignore:start */
//动画库
var Tween = {
Linear: function(t, b, c, d) {
return c * t / d + b;
},
Quad: {
easeIn: function(t, b, c, d) {
return c * (t /= d) * t + b;
},
easeOut: function(t, b, c, d) {
return -c * (t /= d) * (t - 2) + b;
},
easeInOut: function(t, b, c, d) {
if ((t /= d / 2) < 1) return c / 2 * t * t + b;
return -c / 2 * ((--t) * (t - 2) - 1) + b;
}
},
Cubic: {
easeIn: function(t, b, c, d) {
return c * (t /= d) * t * t + b;
},
easeOut: function(t, b, c, d) {
return c * ((t = t / d - 1) * t * t + 1) + b;
},
easeInOut: function(t, b, c, d) {
if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
return c / 2 * ((t -= 2) * t * t + 2) + b;
}
},
Quart: {
easeIn: function(t, b, c, d) {
return c * (t /= d) * t * t * t + b;
},
easeOut: function(t, b, c, d) {
return -c * ((t = t / d - 1) * t * t * t - 1) + b;
},
easeInOut: function(t, b, c, d) {
if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
}
},
Quint: {
easeIn: function(t, b, c, d) {
return c * (t /= d) * t * t * t * t + b;
},
easeOut: function(t, b, c, d) {
return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
},
easeInOut: function(t, b, c, d) {
if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
}
},
Sine: {
easeIn: function(t, b, c, d) {
return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
},
easeOut: function(t, b, c, d) {
return c * Math.sin(t / d * (Math.PI / 2)) + b;
},
easeInOut: function(t, b, c, d) {
return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
}
},
Expo: {
easeIn: function(t, b, c, d) {
return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
},
easeOut: function(t, b, c, d) {
return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
},
easeInOut: function(t, b, c, d) {
if (t == 0) return b;
if (t == d) return b + c;
if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
}
},
Circ: {
easeIn: function(t, b, c, d) {
return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
},
easeOut: function(t, b, c, d) {
return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
},
easeInOut: function(t, b, c, d) {
if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
}
},
Elastic: {
easeIn: function(t, b, c, d, a, p) {
if (t == 0) return b;
if ((t /= d) == 1) return b + c;
if (!p) p = d * .3;
if (!a || a < Math.abs(c)) {
a = c;
var s = p / 4;
} else var s = p / (2 * Math.PI) * Math.asin(c / a);
return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
},
easeOut: function(t, b, c, d, a, p) {
if (t == 0) return b;
if ((t /= d) == 1) return b + c;
if (!p) p = d * .3;
if (!a || a < Math.abs(c)) {
a = c;
var s = p / 4;
} else var s = p / (2 * Math.PI) * Math.asin(c / a);
return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
},
easeInOut: function(t, b, c, d, a, p) {
if (t == 0) return b;
if ((t /= d / 2) == 2) return b + c;
if (!p) p = d * (.3 * 1.5);
if (!a || a < Math.abs(c)) {
a = c;
var s = p / 4;
} else var s = p / (2 * Math.PI) * Math.asin(c / a);
if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
}
},
Back: {
easeIn: function(t, b, c, d, s) {
if (s == undefined) s = 1.70158;
return c * (t /= d) * t * ((s + 1) * t - s) + b;
},
easeOut: function(t, b, c, d, s) {
if (s == undefined) s = 1.70158;
return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
},
easeInOut: function(t, b, c, d, s) {
if (s == undefined) s = 1.70158;
if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}
},
Bounce: {
easeIn: function(t, b, c, d) {
return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
},
easeOut: function(t, b, c, d) {
if ((t /= d) < (1 / 2.75)) {
return c * (7.5625 * t * t) + b;
} else if (t < (2 / 2.75)) {
return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
} else if (t < (2.5 / 2.75)) {
return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
} else {
return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
}
},
easeInOut: function(t, b, c, d) {
if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
}
}
};

var TweenM = [
'Linear',
'Quad',
'Cubic',
'Quart',
'Quint',
'Sine',
'Expo',
'Circ',
'Elastic',
'Back',
'Bounce',
];

var TweenEase = [
'easeIn',
'easeOut',
'easeInOut',
];
/* jshint ignore:end */


// ====================  functions  ==============================

function gmCompatible() {

GM_addStyle = function(css, id){
var s = document.createElement('style');
if (id) {
s.setAttribute(id, id);
}
s.setAttribute('type', 'text/css');
s.setAttribute('style', 'display: none !important;');
s.appendChild(document.createTextNode(css));
return (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(s);
};

if (typeof unsafeWindow == "undefined") unsafeWindow = window;
if (typeof GM_getValue != "undefined" && GM_getValue("a", "b") !== undefined) {
return;
}

GM_getValue = function(key, defaultValue) {
var value = window.localStorage.getItem(key);
if (value === null) value = defaultValue;
else if (value == 'true') value = true;
else if (value == 'false') value = false;
return value;
};
GM_setValue = function(key, value) {
window.localStorage.setItem(key, value);
};
GM_registerMenuCommand = function() {};

// chrome 原生支持
if (typeof GM_xmlhttpRequest == 'undefined') {
GM_xmlhttpRequest = function(opt) {
var req = new XMLHttpRequest();
req.open('GET', opt.url, true);
req.overrideMimeType(opt.overrideMimeType);
req.onreadystatechange = function (aEvt) {
if (req.readyState == 4) {
if (req.status == 200) {
opt.onload(req);
}
else {
opt.onerror();
}
}
};
req.send(null);
};
}
}

// By lastDream2013 略加修改，原版只能用于 Firefox
function getRalativePageStr(lastUrl, currentUrl, nextUrl) {
function getDigital(str) {
var num = str.replace(/^p/i, '');
return parseInt(num, 10);
}

var getRalativePageNumArray = function (lasturl, url) {
if (!lasturl || !url) {
return [0, 0];
}

var lasturlarray = lasturl.split(/-|\.|\&|\/|=|#|\?/),
urlarray = url.split(/-|\.|\&|\/|=|#|\?/),
url_info,
lasturl_info;
// 一些 url_info 为 p1,p2,p3 之类的
var handleInfo = function(s) {
if (s) {
return s.replace(/^p/, '');
}
return s;
};
while (urlarray.length !== 0) {
url_info = handleInfo(urlarray.pop());
lasturl_info = handleInfo(lasturlarray.pop());
if (url_info != lasturl_info) {
if (/[0-9]+/.test(url_info) && (url_info == "2" || /[0-9]+/.test(lasturl_info))) {
return [(parseInt(lasturl_info) || 1), parseInt(url_info)];
}
}
}
return [0, 0];
};

var ralativeOff;

//论坛和搜索引擎网页显示实际页面信息
var ralativePageNumarray = [];
if (nextUrl) {
ralativePageNumarray = getRalativePageNumArray(currentUrl, nextUrl);
} else {
ralativePageNumarray = getRalativePageNumArray(lastUrl, currentUrl);
ralativeOff = ralativePageNumarray[1] - ralativePageNumarray[0]; //用的上一页的相对信息比较的，要补充差值……
ralativePageNumarray[1] = ralativePageNumarray[1] + ralativeOff;
ralativePageNumarray[0] = ralativePageNumarray[0] + ralativeOff;
}

// console.log('[获取实际页数] ', '要比较的3个页数：',arguments, '，得到的差值:', ralativePageNumarray);
if (isNaN(ralativePageNumarray[0]) || isNaN(ralativePageNumarray[1])) {
return '';
}

var realPageSiteMatch = false;
ralativeOff = ralativePageNumarray[1] - ralativePageNumarray[0];
//上一页与下一页差值为1，并最大数值不超过10000(一般论坛也不会超过这么多页……)
if (ralativeOff === 1 && ralativePageNumarray[1] < 10000) {
realPageSiteMatch = true;
}

//上一页与下一页差值不为1，但上一页与下一页差值能被上一页与下一面所整除的，有规律的页面
if (!realPageSiteMatch && ralativeOff !== 1) {
if ((ralativePageNumarray[1] % ralativeOff) === 0 && (ralativePageNumarray[0] % ralativeOff) === 0) {
realPageSiteMatch = true;
}
}

if (!realPageSiteMatch) { //不满足以上条件，再根据地址特征来匹配
var sitePattern;
for (var i = 0, length = REALPAGE_SITE_PATTERN.length; i < length; i++) {
sitePattern = REALPAGE_SITE_PATTERN[i];
if (currentUrl.toLocaleLowerCase().indexOf(sitePattern) >= 0) {
realPageSiteMatch = true;
break;
}
}
}

var ralativePageStr;
if (realPageSiteMatch) { //如果匹配就显示实际网页信息
if (ralativePageNumarray[1] - ralativePageNumarray[0] > 1) { //一般是搜索引擎的第xx - xx项……
ralativePageStr = ' [ 实际：第 <font color="red">' + ralativePageNumarray[0] + ' - ' + ralativePageNumarray[1] + '</font> 项 ]';
} else if ((ralativePageNumarray[1] - ralativePageNumarray[0]) === 1) { //一般的翻页数，差值应该是1
ralativePageStr = ' [ 实际：第 <font color="red">' + ralativePageNumarray[0] + '</font> 页 ]';
} else if ((ralativePageNumarray[0] === 0 && ralativePageNumarray[1]) === 0) { //找不到的话……
ralativePageStr = ' [ <font color="red">实际网页结束</font> ]';
}
} else {
ralativePageStr = '';
}
return ralativePageStr || '';
}

function handleLazyImgSrc(rule, doc) {
var imgAttrs = rule.split('|');
imgAttrs.forEach(function(attr){
attr = attr.trim();
[].forEach.call(doc.querySelectorAll("img[" + attr + "]"), function(img){
var newSrc = img.getAttribute(attr);
if (newSrc && newSrc != img.src) {
img.setAttribute("src", newSrc);
img.removeAttribute(attr);
}
});
});
}

function removeScripts(node) {  // 移除元素的 script
var scripts = getAllElements('css;script', node);
var scripts_x;
for (i = scripts.length - 1; i >= 0; i--) {
scripts_x = scripts[i];
scripts_x.parentNode.removeChild(scripts_x);
}
}

var noticeDiv;
var noticeDivto;
var noticeDivto2;
function notice(html_txt) {
if (!noticeDiv) {
var div = document.createElement('div');
noticeDiv = div;
div.style.cssText = '\
position:fixed!important;\
z-index:2147483647!important;\
float:none!important;\
width:auto!important;\
height:auto!important;\
font-size:13px!important;\
padding:3px 20px 2px 5px!important;\
background-color:#7f8f9c!important;\
border:none!important;\
color:#000!important;\
text-align:left!important;\
left:0!important;\
bottom:0!important;\
opacity:0;\
-moz-border-radius:0 6px 0 0!important;\
border-radius:0 6px 0 0!important;\
-o-transition:opacity 0.3s ease-in-out;\
-webkit-transition:opacity 0.3s ease-in-out;\
-moz-transition:opacity 0.3s ease-in-out;\
';
document.body.appendChild(div);
}
clearTimeout(noticeDivto);
clearTimeout(noticeDivto2);
noticeDiv.innerHTML = html_txt;
noticeDiv.style.display = 'block';
noticeDiv.style.opacity = '0.96';
noticeDivto2 = setTimeout(function() {
noticeDiv.style.opacity = '0';
}, 1666);
noticeDivto = setTimeout(function() {
noticeDiv.style.display = 'none';
}, 2000);
}

function $C(type, atArr, inner, action, listen) {
var e = document.createElement(type);
for (var at in atArr) {
if (atArr.hasOwnProperty(at)) {
e.setAttribute(at, atArr[at]);
}
}
if (action && listen) {
e.addEventListener(action, listen, false);
}
if (inner) {
e.innerHTML = inner;
}
return e;
}

// css 获取单个元素
function getElementByCSS(css, contextNode) {
return (contextNode || document).querySelector(css);
}

// css 获取所有元素
function getAllElementsByCSS(css, contextNode) {
return (contextNode || document).querySelectorAll(css);
}

// xpath 获取单个元素
function getElementByXpath(xpath, contextNode, doc) {
doc = doc || document;
contextNode = contextNode || doc;
return doc.evaluate(xpath, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// xpath 获取多个元素.
function getAllElementsByXpath(xpath, contextNode, doc) {
doc = doc || document;
contextNode = contextNode || doc;
return doc.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
}

// 获取多个元素
function getAllElements(selector, contextNode, doc, win) {
var ret = [];
if (!selector) return ret;
var Eles;
doc = doc || document;
win = win || window;
contextNode = contextNode || doc;
if (typeof selector == 'string') {
if (selector.search(/^css;/i) === 0) {
Eles = getAllElementsByCSS(selector.slice(4), contextNode);
} else {
Eles = getAllElementsByXpath(selector, contextNode, doc);
}
} else {
Eles = selector(doc, win);
if (!Eles) return ret;
if (Eles.nodeType) { //单个元素.
ret[0] = Eles;
return ret;
}
}

function unique(array) { //数组去重并且保持数组顺序.
var i, ca, ca2, j;
for (i = 0; i < array.length; i++) {
ca = array[i];
for (j = i + 1; j < array.length; j++) {
ca2 = array[j];
if (ca2 == ca) {
array.splice(j, 1);
j--;
}
}
}
return array;
}

function makeArray(x) {
var ret = [];
var i, ii;
var x_x;
if (x.pop) { //普通的 array
for (i = 0, ii = x.length; i < ii; i++) {
x_x = x[i];
if (x_x) {
if (x_x.nodeType) { //普通类型,直接放进去.
ret.push(x_x);
} else {
ret = ret.concat(makeArray(x_x)); //嵌套的.
}
}
}
//alert(ret)
return unique(ret);
} else if (x.item) { //nodelist or HTMLcollection
i = x.length;
while (i) {
ret[--i] = x[i];
}
/*
for(i=0,ii=x.length;i<ii;i++){
ret.push(x[i]);
};
*/
return ret;
} else if (x.iterateNext) { //XPathResult
i = x.snapshotLength;
while (i) {
ret[--i] = x.snapshotItem(i);
}
/*
for(i=0,ii=x.snapshotLength;i<ii;i++){
ret.push(x.snapshotItem(i));
};
*/
return ret;
}
}

return makeArray(Eles);
}

// 获取最后一个元素.
function getLastElement(selector, contextNode, doc, win) {
var eles = getAllElements(selector, contextNode, doc, win);
var l = eles.length;
if (l > 0) {
return eles[l - 1];
}
}

function saveValue(key, value) {
localStorage.setItem(key, encodeURIComponent(value));
}

function getValue(key) {
var value = localStorage.getItem(key);
return value ? decodeURIComponent(value) : undefined;
}

function createDocumentByString(str) {  // string转为DOM
if (!str) {
C.error('没有找到要转成DOM的字符串');
return;
}
if (document.documentElement.nodeName != 'HTML') {
return new DOMParser().parseFromString(str, 'application/xhtml+xml');
}

var doc;
try {
// firefox and chrome 30+，Opera 12 会报错
doc = new DOMParser().parseFromString(str, 'text/html');
} catch (ex) {}

if (doc) {
return doc;
}

if (document.implementation.createHTMLDocument) {
doc = document.implementation.createHTMLDocument('superPreloader');
} else {
try {
doc = document.cloneNode(false);
doc.appendChild(doc.importNode(document.documentElement, false));
doc.documentElement.appendChild(doc.createElement('head'));
doc.documentElement.appendChild(doc.createElement('body'));
} catch (e) {}
}
if (!doc) return;
var range = document.createRange();
range.selectNodeContents(document.body);
var fragment = range.createContextualFragment(str);
doc.body.appendChild(fragment);
var headChildNames = {
TITLE: true,
META: true,
LINK: true,
STYLE: true,
BASE: true
};
var child;
var body = doc.body;
var bchilds = body.childNodes;
for (var i = bchilds.length - 1; i >= 0; i--) { //移除head的子元素
child = bchilds[i];
if (headChildNames[child.nodeName]) body.removeChild(child);
}
//alert(doc.documentElement.innerHTML);
//debug(doc);
//debug(doc.documentElement.innerHTML);
return doc;
}

// 从相对路径的a.href获取完全的href值.
function getFullHref(href) {
if (typeof href != 'string') href = href.getAttribute('href');
//alert(href);
//if(href.search(/^https?:/)==0)return href;//http打头,不一定就是完整的href;
var a = getFullHref.a;
if (!a) {
getFullHref.a = a = document.createElement('a');
}
a.href = href;
//alert(a.href);
return a.href;
}

// 任何转成字符串，存储，修改过
function xToString(x) {
function toStr(x) {
switch (typeof x) {
case 'undefined':
return Str(x);
case 'boolean':
return Str(x);
case 'number':
return Str(x);
case 'string':
return ('"' +
(x.replace(/(?:\r\n|\n|\r|\t|\\|")/g, function(a) {
var ret;
switch (a) { //转成字面量
case '\r\n':
ret = '\\r\\n';
break;
case '\n':
ret = '\\n';
break;
case '\r':
ret = '\\r';
break;
case '\t':
ret = '\\t';
break;
case '\\':
ret = '\\\\';
break;
case '"':
ret = '\\"';
break;
default:
break;
}
return ret;
})) + '"');
case 'function':
var fnStr = Str(x);
return fnStr.indexOf('native code') == -1 ? fnStr : 'function(){}';
case 'object':
//注,object的除了单纯{},其他的对象的属性会造成丢失..
if (x === null) {
return Str(x);
}
switch (x.constructor.name) {
case "Object":
var i;
var rStr = '';
for (i in x) {
if (!x.hasOwnProperty(i)) { //去掉原型链上的属性.
continue;
}
rStr += toStr(i) + ':' + toStr(x[i]) + ',';
}
return ('{' + rStr.replace(/,$/i, '') + '}');
case "Array":
var i;
var rStr = '';
for (i in x) {
if (!x.hasOwnProperty(i)) { //去掉原型链上的属性.
continue;
}
rStr += toStr(x[i]) + ',';
}
return '[' + rStr.replace(/,$/i, '') + ']';
case "String":
return toStr(Str(x));
case "RegExp":
return Str(x);
case "Number":
return Str(x);
case "Boolean":
return Str(x);
default:
//alert(x.constructor);//漏了什么类型么?
break;
}
default:
break;
}
}
var Str = String;
return toStr(x);
}

function toRE(obj) {
if (obj instanceof RegExp) {
return obj;
} else if (obj instanceof Array) {
return new RegExp(obj[0], obj[1]);
} else {
if (obj.search(/^wildc;/i) === 0) {
obj = wildcardToRegExpStr(obj.slice(6));
}
return new RegExp(obj);
}
}

function wildcardToRegExpStr(urlstr) {
if (urlstr.source) return urlstr.source;
var reg = urlstr.replace(/[()\[\]{}|+.,^$?\\]/g, "\\$&").replace(/\*+/g, function(str){
return str === "*" ? ".*" : "[^/]*";
});
return "^" + reg + "$";
}


SP.init();

})();