// ==UserScript==
// @name         ! 豆瓣电影 + 百度网盘 |!' IMDB + Magnet |!' 各大视频网站 +
// @name:zh-CN   ! 豆瓣电影 + 百度网盘 |!' 各大视频网站 +
// @name:en      ! IMDB + Magnet
// @version      4.6
// @description:en         Show magnet and pan.baidu.com in movie detail page .
// @description:zh-CN   找资源不用打开一堆新标签,有的话会直接播放 |!'  当破解VIP会员电视剧失败?没准有网盘和磁力种子在分享呢.兼容黄岩Style.
// @author       WuChaolong
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAS1BMVEX////ycnLyampuu25muGby8nLy8mrl5eXk5OT8DAz8/AzPz8/z8zONvY3Nzc3d3d3b29v/AAAMnAwAmQD//wDMzMz19SmIu4j///+ks1oiAAAAEXRSTlMAwMfg5cDHgIj+/vD7/v7AxxKKtKIAAAABYktHRACIBR1IAAAACW9GRnMAAAEtAAABagBZv0KIAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4gERCw82Bupv1AAAAAl2cEFnAAADGgAABGMAz64W0QAAAItJREFUaN7t2UkKgEAQBEF13Pfd///UQ4n0YQRBBIXMYzEaD+ggIPpZYaRCO7pYObMlqUrswyxX2TVQDKqw4zip0WzlrEr7sFpUBQAAAAAAAAAAAHBWr6p+C/D+CwAAAAAAAAAA4BnQbKp5C2iP71oAAAAAAAAAAID/AN6Ddderzmze2/SNgzXRJ9sBPp3K24JPMHQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDEtMTdUMTk6MTQ6NDIrMDg6MDBqGWm5AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTAxLTE3VDE5OjE0OjQyKzA4OjAwG0TRBQAAAABJRU5ErkJggg==

// @match        *://movie.douban.com/subject/*

// @match        *://*.imdb.com/title/*
// @match        *://*.imdb.com/name/*
// @match        *://m.douban.com/movie/subject/*


// @match    *://*.iqiyi.com/*
// @match    *://*.youku.com/*
// @match    *://*.le.com/*
// @match    *://*.letv.com/*
// @match    *://v.qq.com/*
// @match    *://*.tudou.com/*
// @match    *://*.mgtv.com/*
// @match    *://film.sohu.com/*
// @match    *://tv.sohu.com/*
// @match    *://*.acfun.cn/v/*
// @match    *://*.bilibili.com/*
// @match    *://vip.1905.com/play/*
// @match    *://*.pptv.com/*
// @match    *://v.yinyuetai.com/video/*
// @match    *://v.yinyuetai.com/playlist/*
// @match    *://*.fun.tv/vplay/*
// @match    *://*.wasu.cn/Play/show/*
// @match    *://*.56.com/*


// @match    *://www.youtube.com/*

// @grant    GM_openInTab
// @run-at      document-end
// @namespace undefined
// @description 找资源不用打开一堆新标签,有的话会直接播放 |!' Show magnet and pan.baidu.com in movie detail page |!' 当破解VIP会员电视剧失败?没准有网盘和磁力种子在分享呢.兼容黄岩Style.
// @downloadURL https://update.greasyfork.org/scripts/37192/%21%20%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20%2B%20%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20%7C%21%27%20IMDB%20%2B%20Magnet%20%7C%21%27%20%E5%90%84%E5%A4%A7%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/37192/%21%20%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%20%2B%20%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20%7C%21%27%20IMDB%20%2B%20Magnet%20%7C%21%27%20%E5%90%84%E5%A4%A7%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%20%2B.meta.js
// ==/UserScript==

;(function() {

init();
if(location.host=="www.youtube.com"){
  setInterval(init,1000);
}

function init(){
  var site = whatSite(location.host);
  var key = site.getKey();
  var element = site.createElement(key);
  if(!isExist()) {
    site.insert(element);
  }else{
    isExist().parentNode.replaceChild(element,isExist());
  }
}


function whatSite(host){
  var icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAS1BMVEX////ycnLyampuu25muGby8nLy8mrl5eXk5OT8DAz8/AzPz8/z8zONvY3Nzc3d3d3b29v/AAAMnAwAmQD//wDMzMz19SmIu4j///+ks1oiAAAAEXRSTlMAwMfg5cDHgIj+/vD7/v7AxxKKtKIAAAABYktHRACIBR1IAAAACW9GRnMAAAEtAAABagBZv0KIAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4gERCw82Bupv1AAAAAl2cEFnAAADGgAABGMAz64W0QAAAItJREFUaN7t2UkKgEAQBEF13Pfd///UQ4n0YQRBBIXMYzEaD+ggIPpZYaRCO7pYObMlqUrswyxX2TVQDKqw4zip0WzlrEr7sFpUBQAAAAAAAAAAAHBWr6p+C/D+CwAAAAAAAAAA4BnQbKp5C2iP71oAAAAAAAAAAID/AN6Ddderzmze2/SNgzXRJ9sBPp3K24JPMHQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDEtMTdUMTk6MTQ6NDIrMDg6MDBqGWm5AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTAxLTE3VDE5OjE0OjQyKzA4OjAwG0TRBQAAAABJRU5ErkJggg=="
  var sites = {
      'movie.douban.com':{
//       '127.0.0.1:8080':{
           insert:function(element){
              var aside = document.querySelector(".aside");
              aside.insertBefore(element, document.getElementById("subject-others-interests")||aside.firstElementChild);
           }
           ,createElement:createElementBy
           ,getKey:function(){
              var key = document.querySelector('meta[name="keywords"]').getAttribute('content');
              return key.split(",")[0];
           }
      }
      ,
      'm.douban.com':{
//       '127.0.0.1:8080':{
           insert:function(element){
              var aside = document.querySelector(".card");
              aside.insertBefore(element, aside.querySelector(".subject-intro")||aside.querySelector(".celebrity-intro"));
              
           }
           ,createElement:function(key){
              var url = getWuchaolongUrl(key);
              var text = key+" in pan.baidu sharing";
              var html = (dedent  `<section id="wuchaolong" style="margin-top: -20px;" class="subject-mark"><div class="mark-item"><a target="_blank" href="${url}" title="${text}"><img src="${icon}" style="max-width:1em;vertical-align: text-top;"/>${text}</a></div></section>`);
              return elementBy(html);
           }
           ,getKey:function(){
             return whatSite('movie.douban.com').getKey();
           }
      }
      ,
      'www.imdb.com':{
//       '127.0.0.1:8080':{
           insert:function(element){
              var aside = document.querySelector("#root");
              aside.classList.add("add-back2");
              aside.appendChild(element);
              window.onclick=function(e){
                var wrapper = document.querySelector("div#wrapper");
                if(e.target == wrapper){
                  if(element.classList.contains("hover")){
                    element.classList.remove("hover");
                    aside.classList.remove("back");
                  }else{
                    element.classList.add("hover");
                    aside.classList.add("back");
                    var a = document.querySelector('#wuchaolong [href="#wuchaolong"]');
                    a.click();
                  }
                }
              }
              if(location.hash=="#wuchaolong"){
                    document.querySelector("div#wrapper").click();

              }
           }
           ,createElement:createElementBy
      }
      ,
      'm.imdb.com':{
//       '127.0.0.1:8080':{
           insert:function(element){
              var aside = document.querySelector("#titleOverview");
              aside.insertBefore(element,aside.querySelector('[class="media"]+hr'));
              
           }
           ,createElement:function (key){
              var url = getWuchaolongUrl(key);
              var text = key+" in pan.baidu sharing";
              var html = (dedent  `<a id="wuchaolong" class="full-wl-button ribbonize" target="_blank" href="${url}" title="${text}">
                  <div class="wl-ribbon fullsize not-inWL">
                  <div class="container"><span style="
                      color: white;
                      padding-left: 17px;
                  ">${text}
                  </div>
                    </div>
                    <div class="wl-ribbon poster not-inWL" style="
                      background-image: url(https://wuchaolong.github.io/video/img/logo.png);
                      background-position: center;
                      background-size: 70% auto;
                  "></div></a>`);
              return elementBy(html);
            }
      }
      ,"黄盐host":{
//       ,'127.0.0.1:8080':{
            insert:function(element){
                try{
                  var aside = document.querySelector("#TMHYul");
                  aside.appendChild(element);
                }catch(e){
                  var div = this["createDiv"]();
                  div.querySelector("#TMHYul").appendChild(element);
                  document.body.appendChild(div);
//                   ajaxScript("https://raw.githubusercontent.com/woolition/greasyforks/master/hackVipVideosSet/破解VIP会员视频集合.user.js",function(script){
//                       try{eval(script);}catch(e){
//                         console.log(e);
//                       }
//                       whatSite('黄盐host').insert(element);
//                   });
                }
            }
            ,createElement:function (key){
              var url = getWuchaolongUrl(key);
              var text = key+" in pan.baidu sharing";
              var html = (dedent  `<li class="TM1" id="wuchaolong" onclick="window.open('${url}');" title="${text}"><span id="TMSet"><img width="100%" src="${icon}"/>
                  </span></li>`);
              return elementBy(html);
            }
            ,"createDiv":function(){
              var html = `<div><style>#TMHYul { position: fixed; top: 15em; left: 0; padding: 0; z-index: 999999; } .TM1 { opacity: 0.3; position: relative; padding-right: .5em; width: 1.5em; cursor: pointer; list-style: none; } .TM1:hover { opacity: 1; } .TM1 span { display: block; border-radius: 0 .3em .3em 0; background-color: #ffff00; border: 0; font: bold 1em "微软雅黑"!important; color: #ff0000; margin: 0; padding: 1em .3em; } </style> <ul id="TMHYul"></ul></div>`;
              return elementBy(html);
            }
            ,getKey:function(){
              return getKey(/-|_|电视剧|电影|《|》|第/);
            }
      }

   };
   
   var site = sites[host]||sites["黄盐host"];
   site.getKey = site.getKey || getKey;
   return site;


   function createElementBy(key){
      var url = getWuchaolongUrl(key);
      var config = {
        userLang:navigator.language || navigator.userLanguage
        ,string:function(text){
             return text[config.userLang]||text.default;
        }
        ,source:{
          "zh-CN":"资源"
          ,"default":"Resources"
        }
        ,more:{
          "zh-CN":"更多"
          ,"default":"More"
        }
      }
      var html = (dedent `<div id="wuchaolong"><a href="#wuchaolong"></a>
      <h2><i class="">${config.string(config.source)}</i>
<span class="pl"><a  href="${url}" target="_blank"><img src="${icon}" style="max-width:1em;vertical-align: middle;"/>${key}</a>
            </span>
      </h2>
      <iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"  scrolling="no" src="${url}"></iframe>
      <p class="wuchaolong-more">
      <span class="pl"><a href="${url}" target="_blank">${config.string(config.more)}</a></span>
       <link rel="stylesheet" href="https://wuchaolong.github.io/video/douban/greasyfork.css" />
           <!--<link rel="stylesheet" href="/video/douban/greasyfork.css" /> -->
      </div>
      `);
      return elementBy(html);
   }

}
function isExist(){
  return document.getElementById("wuchaolong");
}
function getKey(reg,t){
  try{
    var title = document.querySelector('meta[property="og:title"]').content
      ||document.querySelector('meta[name="keywords"]').content;
  }catch(e){
    title = document.title;
  }
  title = title.replace(/\【(.*?)\】/,"【】");
//   var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  var pattern = /[\`\~\!\@\#\$\^\&\*\(\)\=\|\{\}\'\:\;\'\,\\\\\[\\\\\]\.\<\>\/\?\~\！\@\#\￥\……\&\*\（\）\——\|\{\}\【\】\‘\；\：\”\“\'\。\，\、\？]/
  
  var value = getValue(title.split(pattern));
  value = reg?getValue(value.split(reg)):value;
  return value;
}
function getValue(array,index){
  var index = index || 0;
  try{
    var value = array[index];
    return value||getValue(array,index+1);
  }catch(e){
    return "";
  }
}
// function ajaxScript(sSrc, fOnload,error){
//         var sSrc = "https://charon-node.herokuapp.com/fetch?npm=node-fetch&api="+sSrc;
//         var request = new XMLHttpRequest();
//         request.open("get", sSrc);
//         request.send(null);
//         request.onload = fOnload;
//         request.onload = function(e) {
//             if (this.status == 200) {
//                     fOnload(this.response,error);
//             }else{
//               error();
//             }
//         };
//         request.onerror = error;
// }

function getWuchaolongUrl(key){
  return (dedent `https://wuchaolong.github.io/video/?search=${key}`);
//   return (dedent `http://127.0.0.1:8080/video/?search=${key}`);

}

function elementBy(html){
  var d = document.createElement('div');
  d.innerHTML = html;
  return d.childNodes[0];
}

function dedent(strings, ...values) {

  let result = '';
  for (let i = 0; i < strings.length; i++) {
      if(values&&values[i]){
        result += strings[i].replace(/\n\s+/g, '\n') + values[i];
      }else{
          result += strings[i].replace(/\n\s+/g, '\n');
      }
  }
  return result;
}

})()