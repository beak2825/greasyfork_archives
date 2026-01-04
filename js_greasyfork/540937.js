// ==UserScript==
// @name         聚合搜索引擎切换导航[手机版][移动端]
// @namespace    http://tampermonkey.net/
// @version      20250627
// @description  在搜索顶部显示一个聚合搜索引擎切换导航，综合搜索引擎。专注手机网页搜索引擎切换，纯粹的搜索。SearchJumper、搜索跳转、聚合搜索、All Search、Punk Search、搜索切换、搜索酱。
// @author       PunkJet
// @include      *
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/540937/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%AF%BC%E8%88%AA%5B%E6%89%8B%E6%9C%BA%E7%89%88%5D%5B%E7%A7%BB%E5%8A%A8%E7%AB%AF%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/540937/%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%88%87%E6%8D%A2%E5%AF%BC%E8%88%AA%5B%E6%89%8B%E6%9C%BA%E7%89%88%5D%5B%E7%A7%BB%E5%8A%A8%E7%AB%AF%5D.meta.js
// ==/UserScript==

const punkDeafultMark = "Bing-Baidu-Google-360";
const punkAllSearchMark = "Bing-Baidu-Google-Zhihu-Fsou-360-Quark-Sougou-Toutiao-Yandex-Ecosia-DuckDuckGo-QwantLite-Swisscows";

const searchUrlMap = [
    {name: "必应", searchUrl: "https://www.bing.com/search?q=", searchkeyName: ["q"], matchUrl:/bing\.com.*?search\?q=?/g, mark:"Bing",},
    {name: "百度", searchUrl: "https://baidu.com/s?wd=", searchkeyName: ["wd", "word"], matchUrl:/baidu\.com.*?w(or)?d=?/g, mark:"Baidu",},
    {name: "谷歌", searchUrl: "https://www.google.com/search?q=", searchkeyName: ["q"], matchUrl:/google\.com.*?search.*?q=/g, mark:"Google",},
    {name: "知乎", searchUrl: "https://www.zhihu.com/search?q=", searchkeyName: ["q"], matchUrl:/zhihu\.com\/search.*?q=/g, mark:"Zhihu",},
    {name: "F搜", searchUrl: "https://fsoufsou.com/search?q=", searchkeyName: ["q"], matchUrl:/fsoufsou\.com\/.*?q=/g, mark:"Fsou",},
    {name: "360", searchUrl: "https://www.so.com/s?q=", searchkeyName: ["q"], matchUrl:/\.so\.com.*?q=/g, mark:"360",},
    {name: "夸克", searchUrl: "https://quark.sm.cn/s?q=", searchkeyName: ["q"], matchUrl:/sm\.cn.*?q=/g, mark:"Quark",},
    {name: "搜狗", searchUrl: "https://m.sogou.com/web/searchList.jsp?keyword=", searchkeyName: ["keyword"], matchUrl:/sogou\.com.*?keyword=/g, mark:"Sougou",},
    {name: "头条", searchUrl: "https://so.toutiao.com/search/?keyword=", searchkeyName: ["keyword"], matchUrl:/toutiao\.com.*?keyword=/g, mark:"Toutiao",},
    {name: "Yandex", searchUrl: "https://yandex.com/search/touch/?text=", searchkeyName: ["text"], matchUrl:/((ya(ndex)?\.ru)|(yandex\.com)).*?text=/g, mark:"Yandex",},
    {name: "DuckDuckGo", searchUrl: "https://duckduckgo.com/?q=", searchkeyName: ["q"], matchUrl:/duckduckgo\.com.*?q=/g, mark:"DuckDuckGo",},
    {name: "Ecosia", searchUrl: "https://www.ecosia.org/search?q=", searchkeyName: ["q"], matchUrl:/ecosia\.org.*?q=/g, mark:"Ecosia",},
    {name: "QwantLite", searchUrl: "https://lite.qwant.com/?q=", searchkeyName: ["q"], matchUrl:/lite\.qwant\.com.*?q=/g, mark:"QwantLite",},
    {name: "Swisscows", searchUrl: "https://swisscows.com/en/web?query=", searchkeyName: ["query"], matchUrl:/swisscows\.com.*?query=/g, mark:"Swisscows",}
];


const punkSocialMap = [
  {
      tabName:"日常",
      tabList:[
          {name: "知乎", searchUrl: "https://www.zhihu.com/search?q="},
          {name: "豆瓣", searchUrl: "https://m.douban.com/search/?query="},
          {name: "微博", searchUrl: "https://m.weibo.cn/search?containerid=100103&q="},
          {name: "哔哩哔哩", searchUrl: "https://m.bilibili.com/search?keyword="},
          {name: "维基百科", searchUrl: "https://zh.m.wikipedia.org/wiki/"},
          {name: "安娜的档案", searchUrl: "https://annas-archive.org/search?q="},
          {name: "Unsplash", searchUrl: "https://unsplash.com/s/photos/"},
          {name: "火山翻译", searchUrl: "https://translate.volcengine.com/mobile?text="},
          {name: "博客园", searchUrl: "https://zzk.cnblogs.com/s?w="},
      ],
  },
  {
      tabName:"娱乐",
      tabList:[
          {name: "知乎", searchUrl: "https://www.zhihu.com/search?q="},
          {name: "豆瓣", searchUrl: "https://m.douban.com/search/?query=",},
          {name: "微博", searchUrl: "https://m.weibo.cn/search?containerid=100103&q="},
          {name: "哔哩哔哩", searchUrl: "https://m.bilibili.com/search?keyword="},
          {name: "小红书", searchUrl: "https://m.sogou.com/web/xiaohongshu?keyword="},
          {name: "微信文章", searchUrl: "https://weixin.sogou.com/weixinwap?type=2&query="},
          {name: "推特", searchUrl: "https://mobile.twitter.com/search/"},
          {name: "豆瓣阅读", searchUrl: "https://read.douban.com/search?q="},
          {name: "Malavida", searchUrl: "https://www.malavida.com/en/android/s/"},
          {name: "ApkPure", searchUrl: "https://m.apkpure.com/search?q="},
          {name: "安娜的档案", searchUrl: "https://annas-archive.org/search?q="},
          {name: "人人影视", searchUrl: "https://www.renren.pro/search?wd="},
          {name: "豌豆Pro", searchUrl: "https://wandou.la/search/"},
      ],
  },
  {
      tabName:"开发",
      tabList:[
          {name: "开发者搜索", searchUrl: "https://kaifa.baidu.com/searchPage?wd="},
          {name: "GitHub", searchUrl: "https://github.com/search?q="},
          {name: "Gitee", searchUrl: "https://search.gitee.com/?q="},
          {name: "Stackoverflow", searchUrl: "https://stackoverflow.com/search?q="},
          {name: "GreasyFork", searchUrl: "https://greasyfork.org/scripts?q="},
          {name: "MDN", searchUrl: "https://developer.mozilla.org/search?q="},
          {name: "菜鸟教程", searchUrl: "https://www.runoob.com/?s="},
          {name: "掘金", searchUrl: "https://juejin.cn/search?query="},
          {name: "博客园", searchUrl: "https://zzk.cnblogs.com/s?w="},
      ],
    },
    {
        tabName:"网盘",
        tabList:[
            {name: "阿里云盘", searchUrl: "https://alipansou.com/search?k="},
            {name: "百度云盘", searchUrl: "https://xiongdipan.com/search?k="},
            {name: "夸克网盘", searchUrl: "https://aipanso.com/search?k="},
            {name: "罗马网盘", searchUrl: "https://www.luomapan.com/#/main/search?keyword="},
        ],
    },
    {
        tabName:"翻译",
        tabList:[
            {name: "有道词典", searchUrl: "https://youdao.com/m/result?word="},
            {name: "必应翻译", searchUrl: "https://cn.bing.com/dict/search?q="},
            {name: "百度翻译", searchUrl: "https://fanyi.baidu.com/#zh/en/"},
            {name: "谷歌翻译", searchUrl: "https://translate.google.com/?q="},
            {name: "火山翻译", searchUrl: "https://translate.volcengine.com/mobile?text="},
            {name: "DeepL翻译", searchUrl: "https://www.deepl.com/translator-mobile#zh/en/"},
        ],
    },
    {
        tabName:"图片",
        tabList:[
            {name: "谷歌搜图", searchUrl: "https://www.google.com.hk/search?tbm=isch&q="},
            {name: "必应搜图", searchUrl: "https://www.bing.com/images/search?q="},
            {name: "Flickr", searchUrl: "http://www.flickr.com/search/?q="},
            {name: "Pinterest", searchUrl: "https://www.pinterest.com/search/pins/?q="},
            {name: "Pixabay", searchUrl: "https://pixabay.com/zh/images/search/"},
            {name: "花瓣", searchUrl: "https://huaban.com/search/?q="},
            {name: "Unsplash", searchUrl: "https://unsplash.com/s/photos/"},
        ],
    },
];


function getKeywords() {
  let keywords = "";
  for (let urlItem of searchUrlMap) {
    if (window.location.href.match(urlItem.matchUrl) != null) {
      for (let keyItem of urlItem.searchkeyName) {
        if ( window.location.href.indexOf(keyItem) >= 0 ) {
          let url = new URL(window.location.href);
          keywords = url.searchParams.get(keyItem);
          return keywords;
        }
      }
    }
  }
  return keywords;
}


function addOpenSearchBox() {
  const oDivtemp = document.createElement("div");
  oDivtemp.id = "punk-search-open-box";
  oDivtemp.style.display = "none";
  document.getElementById("punkjet-search-box").after(oDivtemp);
}


function addTabfunction() {
  var tab_list = document.querySelector('#punk-tablist');
  var lis = tab_list.querySelectorAll('li');
  var items = document.querySelectorAll('.punk-item');

  for (var i = 0; i < lis.length; i++) {
    lis[i].setAttribute('index', i);
    lis[i].onclick = function () {
      for (var i = 0; i < lis.length; i++) {
        lis[i].className = '';
      }
      this.className = 'punk-current';
      var index = this.getAttribute('index');
      for (i = 0; i < items.length; i++) {
        items[i].style.display = 'none';
      }
      items[index].style.display = 'block';
    }
  }
}


function addSingleTab(node, tabList) {
  var ulList = document.createElement('ul');
  node.appendChild(ulList);
  let fragment = document.createDocumentFragment();//创建一个文档碎片，减少DOM渲染次数
  for (let index = 0; index < tabList.length; index++) {
    let liItem = document.createElement('li');
    liItem.innerHTML = `<a href='' id="punk-url-a" url='${tabList[index].searchUrl}'>${tabList[index].name}</a>`;
    fragment.appendChild(liItem);
  }
  ulList.appendChild(fragment);
  return node;
}


function addJumpSearchBox(){
  const searchJumpBox = document.createElement("div");
  searchJumpBox.id = "punk-search-jump-box";
  searchJumpBox.style.display = "none";
  document.getElementById("punkjet-search-box").appendChild(searchJumpBox);

  const searchAllBox = document.createElement("div");
  searchAllBox.id = "punk-search-all-app";
  searchJumpBox.appendChild(searchAllBox);

  let jumpAllSearchTitle = document.createElement("h1");
  jumpAllSearchTitle.innerText = "✰全部搜索引擎";
  searchAllBox.appendChild(jumpAllSearchTitle);
  addSingleTab(searchAllBox, searchUrlMap);

  const punkTabList = document.createElement("div");
  punkTabList.id = "punk-tablist";

  let jumpSocialTitle = document.createElement("h1");
  jumpSocialTitle.innerText = "@社交网络";
  punkTabList.appendChild(jumpSocialTitle);
  var ulListq = document.createElement('ul');
  punkTabList.appendChild(ulListq);
  let fragmentq = document.createDocumentFragment();//创建一个文档碎片，减少DOM渲染次数
  for (let index = 0; index < punkSocialMap.length; index++) {
    let liItemq = document.createElement('li');
    if (index == 0) {
      liItemq.className = "punk-current";
    }
    liItemq.innerText = punkSocialMap[index].tabName;
    fragmentq.appendChild(liItemq);
  }
  ulListq.appendChild(fragmentq);
  searchJumpBox.appendChild(punkTabList);

  const punkTabListcontent = document.createElement("div");
  punkTabListcontent.className = "tab-content";
  let fragmentr = document.createDocumentFragment();//创建一个文档碎片，减少DOM渲染次数
  for (let index = 0; index < punkSocialMap.length; index++) {
    let liItemr = document.createElement('div');
    liItemr.className = "punk-item";
    if (index == 0) {
        liItemr.style.display = `block`;
    } else {
        liItemr.style.display = `none`;
    }
    liItemr = addSingleTab(liItemr, punkSocialMap[index].tabList);
    fragmentr.appendChild(liItemr);
  }
  punkTabListcontent.appendChild(fragmentr);
  searchJumpBox.appendChild(punkTabListcontent);

  let jumpSortTitle = document.createElement("h1");
  jumpSortTitle.innerText = "■搜索引擎排序";
  searchJumpBox.appendChild(jumpSortTitle);

  let jumpSortDesc = document.createElement("div");
  jumpSortDesc.className = "jump-sort-discription";
  searchJumpBox.appendChild(jumpSortDesc);
  jumpSortDesc.innerHTML = `<a style="color:#666666 !important">说明：除搜索引擎，其他站只跳转无导航<br>支持的格式：${punkAllSearchMark}</a>`;
  let punkJumpButton = document.createElement("button");

  punkJumpButton.innerText = "点击输入排序";
  punkJumpButton.className = "punk-jump-sort-btn";
  searchJumpBox.appendChild(punkJumpButton);

  punkJumpButton.onclick = function () {
    let sss = prompt("请输入需要显示的引擎！\n格式举例：Quark-Zhihu-Toutiao-360\n则导航为：夸克、知乎、头条、360", GM_getValue("punk_setup_search") || punkDeafultMark);
    if (sss) {
      GM_setValue("punk_setup_search", sss);
      setTimeout(function(){location.reload();}, 200);
    }
    //console.log("用户设置:" + GM_getValue("punk_setup_search"));
  }

  let punkJumpClose = document.createElement("button");
  punkJumpClose.innerText = "收起";
  punkJumpClose.className = "punk-jump-sort-btn";
  searchJumpBox.appendChild(punkJumpClose);

  punkJumpClose.onclick = function () {
    document.getElementById("punk-search-jump-box").style.display = `none`;
  }
}


function punkSearchClickFunction(){
  let btnPunkOpen = document.querySelector("#punk-search-open-box");
  btnPunkOpen.onclick = function () {
    var x = document.getElementById("punkjet-search-box");
    if (x.style.display == "none") {
      x.style.display = "block";
      document.getElementsByTagName('body')[0].style = "margin-top: 35px !important;";
      btnPunkOpen.style.display = "none";
    } else {
      x.style.display = "none";
      document.getElementsByTagName('body')[0].style = "margin-top: 0px !important;";
    }
    document.getElementsByClassName('_search-sticky-bar')[0].style.setProperty('top', '34px', 'important');
  }

  let btnSet = document.querySelector("#search-setting-box");
  btnSet.onclick = function () {
    var punkjump = document.getElementById("punk-search-jump-box");
    if (punkjump.style.display === "none") {
      punkjump.style.display = "block";
    } else {
      punkjump.style.display = `none`;
    }
  }

  let btnClose = document.querySelector("#search-close-box");
  btnClose.onclick = function () {
    var x = document.getElementById("punk-search-open-box");
    if (x.style.display === "none") {
      x.style.display = "block";
    }
    document.querySelector("#punkjet-search-box").style.display = `none`;
    document.getElementsByTagName('body')[0].style = "margin-top: 0px !important;";
    document.getElementsByClassName('_search-sticky-bar')[0].style.setProperty('top', '0px', 'important');
  }
}

function addSearchBox() {
  const punkJetBox = document.createElement("div");
  punkJetBox.id = "punkjet-search-box";
  punkJetBox.style.display = "block";
  punkJetBox.style.fontSize = "15px";

  const searchBox = document.createElement("div");
  searchBox.id = "punk-search-navi-box";
  punkJetBox.appendChild(searchBox);

  const appBoxDiv = document.createElement("div");
  appBoxDiv.id = "punk-search-app-box";
  searchBox.appendChild(appBoxDiv);

  var ulList = document.createElement('ul');
  appBoxDiv.appendChild(ulList);

  let fragment = document.createDocumentFragment();//创建一个文档碎片，减少DOM渲染次数
  let showList = GM_getValue("punk_setup_search").split('-');
  for (let showListIndex = 0; showListIndex < showList.length; showListIndex++) {
    for (let index = 0; index < searchUrlMap.length; index++) {
      let item = searchUrlMap[index];
      if (item.mark == showList[showListIndex]) {
        let liItem = document.createElement('li');
        if (window.location.href.match(item.matchUrl) != null) {
          liItem.innerHTML = `<a href='' id="punk-url-a" style="color:#5C6BC0 !important" url='${item.searchUrl}'>${item.name}</a>`;
        } else {
          liItem.innerHTML = `<a href='' id="punk-url-a" url='${item.searchUrl}'>${item.name}</a>`;
        }
        fragment.appendChild(liItem);
        break;
      }
    }
  }
  ulList.appendChild(fragment);

  const setBoxDiv = document.createElement("div");
  setBoxDiv.id = "search-setting-box";
  setBoxDiv.innerHTML = `<span id="punkBtnSet"> </span>`;
  searchBox.appendChild(setBoxDiv);

  const closeBoxDiv = document.createElement("div");
  closeBoxDiv.id = "search-close-box";
  closeBoxDiv.innerHTML = `<span id="punkBtnClose"></span>`;
  searchBox.appendChild(closeBoxDiv);

  document.getElementsByTagName('head')[0].after(punkJetBox);
}


function funcTouchStart(state) {
  var myNodelist = document.querySelectorAll("*");
  //console.log("length is "+ myNodelist.length);
  for (var i = 0; i < myNodelist.length; i++) {
    let style = window.getComputedStyle(myNodelist[i], null);
    if (style.getPropertyValue("position") === "fixed") {
      if (style.getPropertyValue("z-index") != "9999999") {
        //console.log(myNodelist[i]);
        if (style.getPropertyValue("top") === "0px") {
          if (document.getElementById("punkjet-search-box").style.display == "block") {
            myNodelist[i].style.top = "35px";
          }
        } else if (style.getPropertyValue("top") === "35px") {
          if (document.getElementById("punkjet-search-box").style.display == "none") {
            myNodelist[i].style.top = "0px";
          }
        }
      }
    } else if ((style.getPropertyValue("top") === "35px")) {
      myNodelist[i].style.top = "0px";
    }
  }
}


function funcPopState() {
  var myNodelist = document.querySelectorAll("*");
  //console.log("length is "+ myNodelist.length);
  for (var i = 0; i < myNodelist.length; i++) {
    let style = window.getComputedStyle(myNodelist[i], null);
    if (style.getPropertyValue("position") != "fixed"){
      if (style.getPropertyValue("top") === "35px") {
        myNodelist[i].style.top = "0px";
      }
    }
  }
}


function punkAddUrl(){
  setTimeout(function(){funcTouchStart();}, 200); window.addEventListener("touchstart", function() {setTimeout(function(){funcTouchStart();}, 550);});
  window.addEventListener("popstate", function() {setTimeout(function(){funcPopState();}, 100);});
  let aElement = document.querySelectorAll("#punk-url-a");
  for (let value of aElement) {
    value.addEventListener("click", function () { value.setAttribute("href", value.getAttribute("url") + getKeywords()); });
    value.addEventListener("contextmenu", function (){ value.setAttribute("href", value.getAttribute("url") + getKeywords()); });
  }
}


function injectStyle() {
    const css = `#punkjet-search-box{position:fixed;flex-direction:column;top:0;left:0px;width:100%;height:35px;background-color:#FFFFFF !important;font-size:15px;z-index:9999999;justify-content:flex-end;}#punk-search-navi-box{display:-webkit-flex;display:flex;width:100%;height:35px}#punk-search-jump-box{padding:8px;background-color:#FFFFFF !important;max-width:480px;float:right;max-height:calc(80vh);overflow:scroll;box-shadow:0px 0px 1px 0px #000000;-ms-overflow-style:none;scrollbar-width:none;}#punk-search-jump-box::-webkit-scrollbar{display:none}#punk-search-app-box{flex:1;width:0}#punk-need-hide-box{flex:1;width:0;display:flex}#search-setting-box{flex:0 0 30px;text-align:center;margin:auto;background:url("data:image/svg+xml;utf8,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg' fill='none'%3E%3Cg%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath id='svg_1' stroke-linejoin='round' stroke-width='4' stroke='%23444444' fill='none' d='m24,44c11.0457,0 20,-8.9543 20,-20c0,-11.0457 -8.9543,-20 -20,-20c-11.0457,0 -20,8.9543 -20,20c0,11.0457 8.9543,20 20,20z'/%3E%3Cline stroke='%23444444' stroke-linecap='round' stroke-linejoin='round' id='svg_10' y2='28.5' x2='33' y1='28.5' x1='14' stroke-width='4' fill='none'/%3E%3Cline stroke='%23444444' stroke-linecap='round' stroke-linejoin='round' id='svg_11' y2='20.5' x2='33' y1='20.5' x1='14' stroke-width='4' fill='none'/%3E%3Cline stroke-linecap='round' stroke-linejoin='round' id='svg_12' y2='14.5' x2='20' y1='19.5' x1='14' stroke-width='4' stroke='%23444444' fill='none'/%3E%3Cline stroke='%23444444' stroke-linecap='round' stroke-linejoin='round' id='svg_13' y2='34.5' x2='24' y1='28.5' x1='33' stroke-width='4' fill='none'/%3E%3C/g%3E%3C/svg%3E") no-repeat center;background-size:contain;width:100%;height:18px}#search-close-box{flex:0 0 29px;text-align:center;margin:auto;background:url("data:image/svg+xml;utf8,%3Csvg width='18' height='18' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z' fill='none' stroke='%23444444' stroke-width='4' stroke-linejoin='round'/%3E%3Cpath d='M29.6567 18.3432L18.343 29.6569' stroke='%23444444' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M18.3433 18.3432L29.657 29.6569' stroke='%23444444' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat center;background-size:contain;width:100%;height:18px}#punk-search-app-box ul{margin:0;padding:0;overflow:hidden;overflow-x:auto;list-style:none;white-space:nowrap;height:35px}#punk-search-app-box ul::-webkit-scrollbar{display:none !important}#punk-search-app-box li{margin-left:0px;display:inline-block;border-radius:2px;vertical-align:middle}#punk-search-app-box ul li a{display:block;color:#666666 !important;padding:8px;text-decoration:none;font-weight:bold;font-size:15px !important;font-family:Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif}#punk-search-open-box{position:fixed;left:22px;bottom:64px;height:36px;width:36px;font-size:15px;text-align:center;padding:10px;border-radius:5px;z-index:9999998;background:url("data:image/svg+xml;utf8,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg' stroke='null' style='vector-effect:non-scaling-stroke;' fill='none'%3E%3Cg id='Layer_1'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath stroke='%23000' id='svg_5' d='m1.97999,23.9675l0,0c0,-12.42641 10.0537,-22.5 22.45556,-22.5l0,0c5.95558,0 11.66724,2.37053 15.87848,6.5901c4.21123,4.21957 6.57708,9.94253 6.57708,15.9099l0,0c0,12.4264 -10.05369,22.5 -22.45555,22.5l0,0c-12.40186,0 -22.45556,-10.07359 -22.45556,-22.5zm22.45556,-22.5l0,45m-22.45556,-22.5l44.91111,0' stroke-width='0' fill='%23005fbf'/%3E%3Cpath stroke='%23000' id='svg_7' d='m13.95011,18.65388l0,0l0,-0.00203l0,0.00203zm0.00073,-0.00203l4.2148,5.84978l-4.21553,5.84775l1.54978,2.15123l5.76532,-8l-5.76532,-8l-1.54905,2.15123zm7.46847,13.70285l10.5308,0l0,-3.03889l-10.5308,0l0,3.03889zm3.16603,-6.33312l7.36476,0l0,-3.03889l-7.36476,0l0,3.03889zm-3.16603,-9.37302l0,3.04091l10.5308,0l0,-3.04091l-10.5308,0z' stroke-width='0' fill='%23ffffff'/%3E%3Cpath id='svg_8' d='m135.44834,59.25124l0,0l0,-0.00001l0,0.00001zm0.00004,-0.00001l0.23416,0.02887l-0.2342,0.02886l0.0861,0.01062l0.3203,-0.03948l-0.3203,-0.03948l-0.08606,0.01062zm0.41492,0.06762l0.58504,0l0,-0.015l-0.58504,0l0,0.015zm0.17589,-0.03125l0.40915,0l0,-0.015l-0.40915,0l0,0.015zm-0.17589,-0.04625l0,0.01501l0.58504,0l0,-0.01501l-0.58504,0z' stroke-width='0' stroke='%23000' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E") no-repeat center;background-size:contain}#punk-search-open-box,::after,::before{box-sizing:initial !important}#punk-search-jump-box h1{font-size:15px !important;color:#444444 !important;font-weight:bold;margin:7px 4px}#punk-search-jump-box ul{margin-left:0px;padding:0;overflow:hidden;overflow-x:auto;list-style:none}#punk-search-jump-box li{margin:4px;display:inline-block;vertical-align:middle;border-radius:2px;background-color:hsla(204,48%,14%,0.1) !important}#punk-search-jump-box a{display:block;color:#263238 !important;padding:3px;margin:2px;font-size:14px;text-decoration:none;font-family:Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif}.jump-sort-discription{margin:5px 4px}.punk-jump-sort-btn{background-color:#0026A69A;border:none;color:white;padding:8px 64px;text-align:center;text-decoration:none;display:inline-block;font-size:13px;margin:4px 5px;cursor:pointer;border-radius:4px;width:97%}body{margin-top:35px !important;position:relative !important}._search-sticky-bar{top:34px !important}._2Ldjm{top:34px !important;}#punk-tablist{height:65px;margin-top:20px}#punk-tablist li{float:left;height:18px;background-color:hsla(0,100%,100%,0) !important;color:#666666 !important;text-align:center;cursor:pointer;margin:4px 8px}#punk-tablist ul{height:39px}.punk-current{text-decoration:underline 3px #0026A69A;text-underline-offset:0.4em}.punk-current li{color:#0026A69A !important}.tab-content{margin-bottom:20px} `
    const cssNode = document.createElement("style");
    cssNode.setAttribute("type", "text/css");;
    cssNode.appendChild(document.createTextNode(css));
    document.getElementById("punkjet-search-box").appendChild(cssNode);
}

(function () {
  "use strict";

  for (let index = 0; index < searchUrlMap.length; index++) {
    if (window.location.href.match(searchUrlMap[index].matchUrl) != null) {
      if (getKeywords() != null){
        if (!GM_getValue("punk_setup_search")) {
          GM_setValue("punk_setup_search", punkDeafultMark);
        }
        addSearchBox();
        addJumpSearchBox();
        addOpenSearchBox();
        punkSearchClickFunction();
        addTabfunction();
        injectStyle();
        punkAddUrl();
      }
    }
  }

})();