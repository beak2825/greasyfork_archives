// ==UserScript==
// @name         移动端聚合搜索AI修改
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  edge移动端在搜索顶部显示聚合搜索引擎ai切换导航，自动隐藏,滑动关闭。
// @author       ai
// @include      *
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/535242/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2AI%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/535242/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2AI%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
// 基于油猴库制作
const punkDefaultMark = "Bing-Baidu-Google-duds-Quark-gpt-meta";
const punkAllSearchMark = "Bing-Baidu-Google-Zhihu-duds-meta-Quark-gpt-Yandex-Ecosia-DuckDuckGo-QwantLite-Swisscows";

const searchUrlMap = [
    {name: "必应", searchUrl: "https://www.bing.com/search?q=", searchkeyName: ["q"], matchUrl:/bing\.com.*?search\?q=?/g, mark:"Bing",},
    {name: "百度", searchUrl: "https://baidu.com/s?wd=", searchkeyName: ["wd",], matchUrl:/baidu\.com.*?wd=?/g, mark:"Baidu",},
    {name: "谷歌", searchUrl: "https://www.google.com/search?q=", searchkeyName: ["q"], matchUrl:/google\.com.*?search.*?q=/g, mark:"Google",},
    {name: "知乎", searchUrl: "https://www.zhihu.com/search?q=", searchkeyName: ["q"], matchUrl:/zhihu\.com\/search.*?q=/g, mark:"Zhihu",},
    {name: "度ds", searchUrl: "https://chat.baidu.com/search?word=", searchkeyName: ["word"], matchUrl:/chat\.baidu\.com\/search\?.*?word=/g, mark:"duds"},
    {name: "gpt", searchUrl: "https://chatgpt.com/?model=auto&q=", searchkeyName: ["q"], matchUrl: /chatgpt\.com\/.*[?&]q=/g, mark: "gpt"},
    {name: "夸克", searchUrl: "https://quark.sm.cn/s?q=", searchkeyName: ["q"], matchUrl:/sm\.cn.*?q=/g, mark:"Quark",},
    {name: "秘塔", searchUrl: "https://metaso.cn/?s=&q=", searchkeyName: ["q"], matchUrl:/metaso\.cn.*?q=/g, mark:"meta"},
    {name: "DuckDuckGo", searchUrl: "https://duckduckgo.com/?q=", searchkeyName: ["q"], matchUrl:/duckduckgo\.com.*?q=/g, mark:"DuckDuckGo",},
    {name: "Yandex", searchUrl: "https://yandex.com/search/touch/?text=", searchkeyName: ["text"], matchUrl:/((ya(ndex)?\.ru)|(yandex\.com)).*?text=/g, mark:"Yandex",},
    {name: "QwantLite", searchUrl: "https://lite.qwant.com/?q=", searchkeyName: ["q"], matchUrl:/lite\.qwant\.com.*?q=/g, mark:"QwantLite",},
    {name: "Swisscows", searchUrl: "https://swisscows.com/en/web?query=", searchkeyName: ["query"], matchUrl:/swisscows\.com.*?query=/g, mark:"Swisscows",},
    {name: "Ecosia", searchUrl: "https://www.ecosia.org/search?q=", searchkeyName: ["q"], matchUrl:/ecosia\.org.*?q=/g, mark:"Ecosia",},
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
            {name: "头条", searchUrl: "https://so.toutiao.com/search/?keyword="},
            {name: "YouTube", searchUrl: "https://www.youtube.com/results?search_query="},
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
            {name: "GitHub", searchUrl:"https://github.com/search?q="},
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

const css = `
    #punkjet-search-box {
        backdrop-filter: blur(6px);
        position: fixed;
        flex-direction: column;
        top: 0;
        left: 0;
        width: 100%;
        height: 35px;
        background-color: transparent !important;
        font-size: 15px;
        z-index: 9999999;
        justify-content: flex-end;
        transition: transform 0.3s ease;
        padding: 0;
        margin: 0;
    }

    #punkjet-search-box.header-hidden {
        transform: translateY(-100%) !important;
    }

    #punkjet-search-box.header-visible {
        transform: translateY(0) !important;
    }

    #punk-search-navi-box {
        display:-webkit-flex;
        display:flex;
        width: calc(100% - 4px);
        height:35px;
        padding-left: 4px;
    }

    #punk-search-jump-box {
        padding:8px;
        background-color:#FFFFFF !important;
        max-width:480px;
        float:right;
        max-height:calc(80vh);
        overflow:scroll;
        box-shadow:0px 0px 1px 0px #000000;
        -ms-overflow-style:none;
        scrollbar-width:none;
        transition: transform 0.2s ease, opacity 0.2s ease;
        overflow: visible;
    }

    #punk-search-jump-box::-webkit-scrollbar {
        display:none
    }

    #punk-search-app-box {
        flex:1;
        width:0;
        padding-left: 4px;
    }

    #punk-need-hide-box {
        flex:1;
        width:0;
        display:flex
    }

    #search-setting-box {
        flex:0 0 40px;
        text-align:center;
        margin:auto;
        background:url("data:image/svg+xml;utf8,%3Csvg width='48' height='48' xmlns='http://www.w3.org/2000/svg' fill='none'%3E%3Cg%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath id='svg_1' stroke-linejoin='round' stroke-width='4' stroke='%23444444' fill='none' d='m24,44c11.0457,0 20,-8.9543 20,-20c0,-11.0457 -8.9543,-20 -20,-20c-11.0457,0 -20,8.9543 -20,20c0,11.0457 8.9543,20 20,20z'/%3E%3Cline stroke='%23444444' stroke-linecap='round' stroke-linejoin='round' id='svg_10' y2='28.5' x2='33' y1='28.5' x1='14' stroke-width='4' fill='none'/%3E%3Cline stroke='%23444444' stroke-linecap='round' stroke-linejoin='round' id='svg_11' y2='20.5' x2='33' y1='20.5' x1='14' stroke-width='4' fill='none'/%3E%3Cline stroke-linecap='round' stroke-linejoin='round' id='svg_12' y2='14.5' x2='20' y1='19.5' x1='14' stroke-width='4' stroke='%23444444' fill='none'/%3E%3Cline stroke='%23444444' stroke-linecap='round' stroke-linejoin='round' id='svg_13' y2='34.5' x2='24' y1='28.5' x1='33' stroke-width='4' fill='none'/%3E%3C/g%3E%3C/svg%3E") no-repeat center;
        background-size:contain;
        width:100%;
        height:25px
    }

    #punk-search-app-box ul {
        margin:0;
        padding:0;
        overflow:hidden;
        overflow-x:auto;
        list-style:none;
        white-space:nowrap;
        height:35px
    }

    #punk-search-app-box ul::-webkit-scrollbar {
        display:none !important
    }

    #punk-search-app-box li {
        margin-left:0px;
        display:inline-block;
        border-radius:2px;
        vertical-align:middle
    }

    #punk-search-app-box ul li a {
        display:block;
        color:#666666 !important;
        padding:8px;
        text-decoration:none;
        font-weight:bold;
        font-size:15px !important;
        font-family:Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif
    }

    #punk-search-jump-box h1 {
        font-size:15px !important;
        color:#444444 !important;
        font-weight:bold;
        margin:7px 4px
    }

    #punk-search-jump-box ul {
        margin-left:0px;
        padding:0;
        overflow:hidden;
        overflow-x:auto;
        list-style:none
    }

    #punk-search-jump-box li {
        margin:4px;
        display:inline-block;
        vertical-align:middle;
        border-radius:2px;
        background-color:hsla(204,48%,14%,0.1) !important
    }

    #punk-search-jump-box a {
        display:block;
        color:#263238 !important;
        padding:3px;
        margin:2px;
        font-size:14px;
        text-decoration:none;
        font-family:Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif
    }

    .jump-sort-discription {
        margin:5px 4px
    }

    .punk-jump-sort-btn {
        background-color:#0026A69A;
        border:none;
        color:white;
        padding:8px 64px;
        text-align:center;
        text-decoration:none;
        display:inline-block;
        font-size:13px;
        margin:4px 5px;
        cursor:pointer;
        border-radius:4px;
        width:97%
    }

    body {
        margin-top:35px !important;
        position:relative !important
    }

    ._search-sticky-bar {
        top:34px !important
    }

    ._2Ldjm {
        top:34px !important;
    }

    #punk-tablist {
        height:65px;
        margin-top:20px
    }

    #punk-tablist li {
        float:left;
        height:18px;
        background-color:hsla(0,100%,100%,0) !important;
        color:#666666 !important;
        text-align:center;
        cursor:pointer;
        margin:4px 8px
    }

    #punk-tablist ul {
        height:39px
    }

    .punk-current {
        text-decoration:underline 3px #0026A69A;
        text-underline-offset:0.4em
    }

    .punk-current li {
        color:#0026A69A !important
    }

    .tab-content {
        margin-bottom:20px
    }
    .punk-slide-close-btn {
         background-color: #D66440; /* 背景，可替换为你想要的颜色 */
         border: none;
         color: white; /* 文字颜色保持白色 */
         padding: 8px 64px;
         text-align: center;
         text-decoration: none;
         display: inline-block;
         font-size: 13px;
         margin: 4px 5px;
         cursor: pointer;
         border-radius: 4px;
         width: 97%;
    }

`;

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
  let fragment = document.createDocumentFragment();
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

  // 添加任意方向滑动关闭功能
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  
  searchJumpBox.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    document.body.style.overflow = 'hidden';
    searchJumpBox.style.transition = 'none';
  }, { passive: true });
  
  searchJumpBox.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;
    
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    const opacity = 1 - Math.min(distance / 200, 0.8);
    
    searchJumpBox.style.transform = `translate(${diffX}px, ${diffY}px)`;
    searchJumpBox.style.opacity = opacity;
    
    e.preventDefault();
  }, { passive: false });
  
  searchJumpBox.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    document.body.style.overflow = '';
    
    const currentX = e.changedTouches[0].clientX;
    const currentY = e.changedTouches[0].clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY;
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    
    if (distance > 70) {
      const angle = Math.atan2(diffY, diffX);
      const endX = diffX * 2;
      const endY = diffY * 2;
      
      searchJumpBox.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      searchJumpBox.style.transform = `translate(${endX}px, ${endY}px)`;
      searchJumpBox.style.opacity = '0';
      
      setTimeout(() => {
        searchJumpBox.style.display = 'none';
        searchJumpBox.style.transition = '';
        searchJumpBox.style.transform = '';
        searchJumpBox.style.opacity = '';
      }, 300);
    } else {
      searchJumpBox.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
      searchJumpBox.style.transform = 'translate(0, 0)';
      searchJumpBox.style.opacity = '1';
      
      setTimeout(() => {
        searchJumpBox.style.transition = '';
      }, 200);
    }
  }, { passive: true });

  // 设置界面内容
  const searchAllBox = document.createElement("div");
  searchAllBox.id = "punk-search-all-app";
  searchJumpBox.appendChild(searchAllBox);

  let jumpAllSearchTitle = document.createElement("h1");
  jumpAllSearchTitle.innerText = "🧶全部搜索引擎";
  searchAllBox.appendChild(jumpAllSearchTitle);
  addSingleTab(searchAllBox, searchUrlMap);

  const punkTabList = document.createElement("div");
  punkTabList.id = "punk-tablist";

  let jumpSocialTitle = document.createElement("h1");
  jumpSocialTitle.innerText = "📲社交网络";
  punkTabList.appendChild(jumpSocialTitle);
  var ulListq = document.createElement('ul');
  punkTabList.appendChild(ulListq);
  let fragmentq = document.createDocumentFragment();
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
  let fragmentr = document.createDocumentFragment();
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
  jumpSortTitle.innerText = "🔢搜索引擎排序";
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
    let sss = prompt("请输入需要显示的引擎！\n格式举例：Quark-Zhihu-Toutiao-meta\n则导航为：夸克、知乎、头条、meta", GM_getValue("punk_setup_search") || punkDefaultMark);
    if (sss) {
      GM_setValue("punk_setup_search", sss);
      setTimeout(function(){location.reload();}, 200);
    }
  }

  let punkJumpClose = document.createElement("button");
  punkJumpClose.innerText = "滑动关闭界面";
  punkJumpClose.className = "punk-slide-close-btn"; // 使用新定义的类名
  searchJumpBox.appendChild(punkJumpClose);

  punkJumpClose.onclick = function () {
    searchJumpBox.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    searchJumpBox.style.transform = 'translateY(100%)';
    searchJumpBox.style.opacity = '0';
    
    setTimeout(() => {
        searchJumpBox.style.display = 'none';
        searchJumpBox.style.transition = '';
        searchJumpBox.style.transform = '';
        searchJumpBox.style.opacity = '';
    }, 300);
  }

}

function punkSearchClickFunction(){
  let btnSet = document.querySelector("#search-setting-box");
  btnSet.onclick = function () {
    var punkjump = document.getElementById("punk-search-jump-box");
    if (punkjump.style.display === "none") {
      punkjump.style.display = "block";
    } else {
      punkjump.style.display = `none`;
    }
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

  let fragment = document.createDocumentFragment();
  let showList = (GM_getValue("punk_setup_search") || punkDefaultMark).split('-');
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

  document.getElementsByTagName('head')[0].after(punkJetBox);
}

function injectStyle() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = css;
    document.getElementById("punkjet-search-box").appendChild(styleSheet);
}

function punkAddUrl(){
  setTimeout(function(){funcTouchStart();}, 200);
  window.addEventListener("touchstart", function() {setTimeout(function(){funcTouchStart();}, 550);});
  window.addEventListener("popstate", function() {setTimeout(function(){funcPopState();}, 100);});
  let aElement = document.querySelectorAll("#punk-url-a");
  for (let value of aElement) {
    value.addEventListener("click", function () { value.setAttribute("href", value.getAttribute("url") + getKeywords()); });
    value.addEventListener("contextmenu", function (){ value.setAttribute("href", value.getAttribute("url") + getKeywords()); });
  }
}

function funcTouchStart(state) {
  var myNodelist = document.querySelectorAll("*");
  for (var i = 0; i < myNodelist.length; i++) {
    let style = window.getComputedStyle(myNodelist[i], null);
    if (style.getPropertyValue("position") === "fixed") {
      if (style.getPropertyValue("z-index") != "9999999") {
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
  for (var i = 0; i < myNodelist.length; i++) {
    let style = window.getComputedStyle(myNodelist[i], null);
    if (style.getPropertyValue("position") != "fixed"){
      if (style.getPropertyValue("top") === "35px") {
        myNodelist[i].style.top = "0px";
      }
    }
  }
}

function initScrollDetection() {
    let lastScrollY = window.scrollY || document.documentElement.scrollTop;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY || document.documentElement.scrollTop;
                const searchBox = document.getElementById("punkjet-search-box");

                if (searchBox) {
                    if (currentScrollY > lastScrollY && currentScrollY > 50) {
                        searchBox.classList.add('header-hidden');
                        searchBox.classList.remove('header-visible');
                    } else {
                        searchBox.classList.remove('header-hidden');
                        searchBox.classList.add('header-visible');
                    }
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

(function () {
  "use strict";

  for (let index = 0; index < searchUrlMap.length; index++) {
    if (window.location.href.match(searchUrlMap[index].matchUrl) != null) {
      if (getKeywords() != null){
        if (!GM_getValue("punk_setup_search")) {
          GM_setValue("punk_setup_search", punkDefaultMark);
        }
        addSearchBox();
        addJumpSearchBox();
        punkSearchClickFunction();
        addTabfunction();
        injectStyle();
        punkAddUrl();
        initScrollDetection();
      }
    }
  }
})();


