// ==UserScript==

// @name  Fanye
// @namespace   ScriptCat
// @description  翻页s .
// @version      220505.21
// @author       You
// @license MIT
// @run-at       document-start
// @match        *://*/*

// @include       *

// @exclude   *sina*
// @exclude   *pan*
// @exclude   *baidu*
// @exclude  *weather.com.*
// @exclude   *file:///android_asset/*
// @exclude   *bing.com*
// @exclude   *google*
// @exclude   *youtube*
// @exclude   *123.com*
// @exclude   *ysepan*
// @exclude   *jianguoyun*
// @exclude   *jd.com*

// @exclude    https://go.itab.link/#

// @grant       none




// @downloadURL https://update.greasyfork.org/scripts/540397/Fanye.user.js
// @updateURL https://update.greasyfork.org/scripts/540397/Fanye.meta.js
// ==/UserScript==

/*♥*/

! (function() {


/*🍎隐藏全屏翻页*/

{var ftotn=document.createElement("div");

ftotn.id="ftotnyd";

ftotn.innerHTML="";

ftotn.setAttribute("style","font-size:5px !important;color:#27618D;width:18px !important;height:40vh !important;line-height:50vh !important;text-align:center !important;background-color:rgba(250,250,250,0.125);box-shadow:inset 0px 0px 2px rgba(39,97,141,0.648);position:fixed !important;bottom:55vh !important;left:0px !important;z-index:9999999999 !important;border-radius:10px 10px 10px 10px !important;");

var ftotnyd1, ftotnyd2;

    document.addEventListener("touchstart",

    function(e) {

        ftotnyd1 = e.changedTouches[0].clientY

    });

    document.addEventListener("touchmove",

    function(e) {

       ftotnyd2 = e.changedTouches[0].clientY;

        if (ftotnyd2 - ftotnyd1 > 0) {

            document.getElementById("ftotnyd").style.display = "none"

        } else {

            document.getElementById("ftotnyd").style.display = "block"

        }

    });/*none♥block*/

ftotn.onclick=function (){window.scrollBy(0,window.innerHeight*0.95);};

document.getElementsByTagName("html").item(0).appendChild(ftotn);};

{

var fDtotn=document.createElement("div");

fDtotn.id="fDtotnyd";

fDtotn.innerHTML="";

fDtotn.setAttribute("style","font-size:5px !important;color:#27618D;width:18px !important;height:40vh !important;line-height:50vh !important;text-align:center !important;background-color:rgba(250,250,250,0.125);box-shadow:inset 0px 0px 2px rgba(39,97,141,0.648);position:fixed !important;bottom:55vh !important;right:0px !important;z-index:9999999999 !important;border-radius:10px 10px 10px 10px");

var fDtotnyd1, fDtotnyd2;

    document.addEventListener("touchstart",

    function(e) {

        fDtotnyd1 = e.changedTouches[0].clientY

    });

    document.addEventListener("touchmove",

    function(e) {

       fDtotnyd2 = e.changedTouches[0].clientY;

        if (fDtotnyd2 - fDtotnyd1 > 0) {

            document.getElementById("fDtotnyd").style.display = "none"

        } else {

            document.getElementById("fDtotnyd").style.display = "block"

        }

    });/*none♥block*/

fDtotn.onclick=function (){window.scrollBy(0,window.innerHeight*0.95);

};

document.getElementsByTagName("html").item(0).appendChild(fDtotn);

};

/*🍇翻页*/
{var totn=document.createElement("div");

totn.id="totnyd";

totn.innerHTML="";

totn.setAttribute("style","font-size:5px !important;color:#27618D;width:18px !important;height:50vh !important;line-height:50vh !important;text-align:center !important;background-color:rgba(250,250,250,0.2);box-shadow:inset 0px 0px 2px rgba(39,97,141,0.848);position:fixed !important;bottom:2vh !important;left:0px !important;z-index:9999999999 !important;border-radius:10px 10px 10px 10px !important;");

var totnyd1, totnyd2;

    document.addEventListener("touchstart",

    function(e) {

        totnyd1 = e.changedTouches[0].clientY

    });

    document.addEventListener("touchmove",

    function(e) {

       totnyd2 = e.changedTouches[0].clientY;

        if (totnyd2 - totnyd1 > 0) {

            document.getElementById("totnyd").style.display = "none"

        } else {

            document.getElementById("totnyd").style.display = "block"

        }

    });/*none♥block*/

totn.onclick=function (){window.scrollBy(0,window.innerHeight*0.565);};

document.getElementsByTagName("html").item(0).appendChild(totn);};

{

var Dtotn=document.createElement("div");

Dtotn.id="Dtotnyd";

Dtotn.innerHTML="";

Dtotn.setAttribute("style","font-size:5px !important;color:#27618D;width:18px !important;height:50vh !important;line-height:50vh !important;text-align:center !important;background-color:rgba(250,250,250,0.2);box-shadow:inset 0px 0px 2px rgba(39,97,141,0.848);position:fixed !important;bottom:2vh !important;right:0px !important;z-index:9999999999 !important;border-radius:10px 10px 10px 10px");

var Dtotnyd1, Dtotnyd2;

    document.addEventListener("touchstart",

    function(e) {

        Dtotnyd1 = e.changedTouches[0].clientY

    });

    document.addEventListener("touchmove",

    function(e) {

       Dtotnyd2 = e.changedTouches[0].clientY;

        if (Dtotnyd2 - Dtotnyd1 > 0) {

            document.getElementById("Dtotnyd").style.display = "none"

        } else {

            document.getElementById("Dtotnyd").style.display = "block"

        }

    });/*none♥block*/

Dtotn.onclick=function (){window.scrollBy(0,window.innerHeight*0.565);

};

document.getElementsByTagName("html").item(0).appendChild(Dtotn);

};

/*🍎顶底*/
{var uptotn=document.createElement("div");

uptotn.id="uptotnyd";

uptotn.innerHTML="ʚïɞ";

uptotn.setAttribute("style","font-size:15px !important;color:#27618D;width:18px !important;height:18px !important;line-height:18px !important;text-align:center !important;opacity:0.8;background-color:rgba(250,250,250,0.00125);box-shadow:inset 0px 0px 1px rgba(39,97,141,0.008);position:fixed !important;bottom:0vh !important;right:48px !important;z-index:9999999999 !important;border-radius:50px !important;");

var uptotnyd1, uptotnyd2;

    document.addEventListener("touchstart",

    function(e) {

        uptotnyd1 = e.changedTouches[0].clientY

    });

    document.addEventListener("touchmove",

    function(e) {

       uptotnyd2 = e.changedTouches[0].clientY;

        if (uptotnyd2 - uptotnyd1 > 0) {

            document.getElementById("uptotnyd").style.display = "none"

        } else {

            document.getElementById("uptotnyd").style.display = "block"

        }

    });/*none♥block*/

uptotn.onclick=function ()
/*
{window.location.reload();};
*/
/*
{window.open('ktllq://bookmarks', '_blank');};
*/
/*{window.open('i:1ffiles/book/0/00.html', '_blank');};*/



{window.scrollBy(0,window.innerHeight*-875);};

document.getElementsByTagName("html").item(0).appendChild(uptotn);};

{var ptotn=document.createElement("div");

ptotn.id="ptotnyd";

ptotn.innerHTML="ʚΐɞ";

ptotn.setAttribute("style","font-size:15px;color:#27618D;width:18px;height:18px;line-height:18px;text-align:center;opacity:0.8;background-color:rgba(250,250,250,0.00125);box-shadow:0px 0px 1px rgba(39,97,141,0.0008);position:fixed !important;bottom:0vh !important;right:25px !important;z-index:9999999999 !important;border-radius:50px !important;");

var ptotnyd1, ptotnyd2;

    document.addEventListener("touchstart",

    function(e) {

        ptotnyd1 = e.changedTouches[0].clientY

    });

    document.addEventListener("touchmove",

    function(e) {

      ptotnyd2 = e.changedTouches[0].clientY;

        if (ptotnyd2 - ptotnyd1 > 0) {

            document.getElementById("ptotnyd").style.display = "none"

        } else {

            document.getElementById("ptotnyd").style.display = "block"

        }

    });/*none♥block*/

ptotn.onclick=function ()
/*
{window.open('https://go.itab.link/#', '_blank');};
*/
/*
{window.close();};
*/
/*
{window.location.reload();};
*/

/*

{window.open('v://history', '_blank');};

*/

/*{window.open('i:1ffiles/book/0/00.html', '_blank');};*/


{window.scrollBy(0,window.innerHeight*567);};

document.getElementsByTagName("html").item(0).appendChild(ptotn);};

{var optotn=document.createElement("div");

optotn.id="optotnyd";

optotn.innerHTML="✗";

optotn.setAttribute("style","color:#27618D;font-weight: 400;font-size:18px;width:18px;height:18px;line-height:18px;text-align:center;opacity:0.8;background-color:rgba(0,0,0,0.0098);background-image:url('');background-position:center;background-repeat:no-repeat;background-size:20px 20px;background-color:rgba(0,0,0,0.0098125);box-shadow:0px 0px 1px rgba(39,97,141,0.0008);position:fixed !important;bottom:10px !important;right:85px !important;z-index:9999999999 !important;border-radius:50px !important;");

var optotnyd1, optotnyd2;

    document.addEventListener("touchstart",

    function(e) {

        optotnyd1 = e.changedTouches[0].clientY

    });

    document.addEventListener("touchmove",

    function(e) {

      optotnyd2 = e.changedTouches[0].clientY;

        if (optotnyd2 - optotnyd1 > 0) {

            document.getElementById("optotnyd").style.display =  "none" /*"none"*/

        } else {

            document.getElementById("optotnyd").style.display = "block"

        }

    });/*none♥block*/

optotn.onclick=function ()

/*

{window.location.reload();};

*/

/*

{window.open('x:sc', '_blank');};*/

/*

{window.open('https://go.itab.link/#', '_blank');};

*/

{window.close();};

/*

{window.open('file:///android_asset/files/book/0/0019.html', '_blank');};*/

/*

{window.scrollBy(0,window.innerHeight*0.765);};

*/

document.getElementsByTagName("html").item(0).appendChild(optotn);};

})();



/*
* @name: 划词菜单(搜索+翻译+转到)
* @Author: 酷安@达蒙山
* @version: 200418.22
* @description: 划词搜索、划词翻译、网址跳转
* @include: *
*/

!(function() {
//注入css使所有内容可复制，两者均可单独使用
var n = document.createElement("style");
n.type = "text/css";
n.innerHTML = "*{user-select: auto!important;}";
document.body.appendChild(n);
//注入js使所有内容可复制，两者均可单独使用
let ys = document.getElementsByTagName('*');
for (var i=0;i<ys.length;i++) {
ys[i].style.userSelect='auto';
};
})();



/*📍*/

!function() {

/*搜索引擎和翻译接口，请按相同格式修改*/
var ssyq = [


{
name: "必应",
url: "https://www.bing.com/search?q="
},

{
name: "duck",
url: "https://duckduckgo.com/?t=h_&q="
},
{
name: "有道",
url: "https://m.youdao.com/translate?type=AUTO&inputtext="
}

],
hcTimer,
ljurl,
text;

function hccdyc() {
clearTimeout(hcTimer);
hcTimer = setTimeout(hccd, 750);
if (document.getElementById("zdan")) {
document.getElementById("zdan").parentNode.removeChild(document.getElementById("zdan"));
}
}
function hccd() {
text = window.getSelection().toString().trim();

text ? (document.getElementById("hckj").style.display = "block", zdcd()) : document.getElementById("hckj").style.display = "none";

}

function tzurl(a, b) {
b = b || text;
ljurl = a + b;
window.open(ljurl);
}

function zdcd() {
var zdurl = text.match(/(https?:\/\/(\w[\w-]*\.)+[A-Za-z]{2,4}(?!\w)(:\d+)?(\/([\x21-\x7e]*[\w\/=])?)?|(\w[\w-]*\.)+(com|cn|org|net|info|tv|cc|gov|edu)(?!\w)(:\d+)?(\/([\x21-\x7e]*[\w\/=])?)?)/i)[0];

if (zdurl) {
var tzlj = document.createElement("span");
tzlj.id = "zdan";
tzlj.innerHTML = "\u8f6c\u5230";
tzlj.addEventListener("click",
function() {

zdurl.indexOf("http") < 0 ? tzurl("https://", zdurl) : tzurl("", zdurl);

});
document.getElementById("hckj").appendChild(tzlj);
}
}

if (!document.getElementById("cdkj")) {
var cddiv = document.createElement("div");
cddiv.id = "cdkj";
cddiv.style.cssText = "display:block!important;width:100%;position:fixed;bottom:45vw;z-index:9999999999;text-align:center;margin:2px auto;padding:0px;-webkit-tap-highlight-color:rgba(0,0,0,0);";
document.body.appendChild(cddiv);
var cdstyle = document.createElement("style");
cdstyle.type = "text/css";
cdstyle.innerHTML = "#cdkj span{display:inline-block;background:#6a6a6a;color:#fff;font-size:15px;line-height:15px;margin:2px;padding:1px;border:1px solid #c5c5c5;border-radius:5px;}";
document.body.appendChild(cdstyle);
}
var hcdiv = document.createElement("div");
hcdiv.id = "hckj";
hcdiv.style.cssText = "display:none";
document.getElementById("cdkj").appendChild(hcdiv);

for (var i = 0; i < ssyq.length; i++) {
var jksp = document.createElement("span");
jksp.innerHTML = ssyq[i].name;
jksp.setAttribute("jkdz", ssyq[i].url);
jksp.onclick = function() {
tzurl(this.getAttribute("jkdz"));
};
document.getElementById("hckj").appendChild(jksp);
}

document.addEventListener("selectionchange", hccdyc);

} ();


// ==UserScript==
// @name 🐾页面自动拼接
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  滚动页面接近底部时自动拼接下一页; 适用于 谷歌/百度, 其他各类需要手动点击"下一页/下一章/下一篇"按钮的网站
// @author       You
// @include      *

// @exclude   file:///*
// @grant        none
// @run-at       document-body

// ==/UserScript==

!(function() {
  'use strict';
  if ( window !== window.top ) return;

  // 加载设置
  var __pageJoiningOption = {
    loading:false,
    text:/^\s*(next\s*page|下一[页章节篇])\s*(\>{0,2}|\→?|\》?)\s*$/i,
    elem:'a',
    // selector:'',
  }
  var wheel = {
    timer:null,
    delay:300,
    thresold:500
  }

  var top = window.frames[0] || window;
  var html = top.document.documentElement;
  var lastFrameWrapper = top.document;
  var loadingWrapper = (function(e) {
    var div = document.createElement('div');
    div.setAttribute('style', 'position:fixed; right:42px; bottom:11px; padding:5px 5px; font-size:15px; line-height:1; color:#4cade7; background:rgba(39,97,141,0.0008); border-radius:4px; opacity:0; transition-duration:300ms;');
    div.textContent = '~';
    return div;
  })();
  top.document.body.appendChild(loadingWrapper);

  // 优先获取页面配置, 其次默认配置
  setTimeout(()=>{
    __pageJoiningOption = window.__pageJoiningOption || __pageJoiningOption;
    top.addEventListener('scroll', windowScroll);
  }, 200);

  // 滚动事件
  var scrollY = 0;
  function windowScroll(e) {
    clearTimeout(wheel.timer);
    if ( e.delta < 0 ) return;
    scrollY = html.scrollTop;
    wheel.timer = setTimeout(()=>{
      if ( html.clientHeight + scrollY + wheel.thresold>=html.scrollHeight ) joinPage();
    }, wheel.delay)
  };


  function joinPage() {
    if ( __pageJoiningOption.loading ) return;
    __pageJoiningOption.loading = true;
    loadingWrapper.style.opacity = 1;

    var linkAddress = '';
    if ( __pageJoiningOption.selector ) {
      linkAddress = lastFrameWrapper.querySelector(__pageJoiningOption.selector).getAttribute('href')
    }
    else if ( __pageJoiningOption.text ) {
      var links = lastFrameWrapper.querySelectorAll(`${__pageJoiningOption.elem||'a'}`), link;
      for (var i=links.length-1; i!==0; i--) {
        link = links[i];
        if ( !link.getAttribute('href') ) continue;
        if ( !__pageJoiningOption.text.test(link.textContent) ) continue;
        linkAddress = link.getAttribute('href');
        break;
      };
    }

    if ( !linkAddress ) {
      __pageJoiningOption.loading = false;
      loadingWrapper.style.opacity = 0;
      return;
    }

    var iframe = document.createElement('iframe');
    iframe.setAttribute('style', `position:fixed; width:0; height:0; overflow:hidden; opacity:0;`);
    iframe.src = linkAddress;
    top.document.body.appendChild(iframe);

    iframe.onload = function() {
      var w = getLastWindow();
      var wd = w.document;
      var td = top.document;
      var wrapper = td.createElement('div');
      wrapper.id = top.document.body.id + ' iframe-wrapper'
      wrapper.className = td.body.className;
      wrapper.innerHTML = wd.body.innerHTML;
      lastFrameWrapper = wrapper;
      iframe.onload = null;
      td.body.removeChild(iframe);
      td.body.appendChild(wrapper);
      html.scrollTo(html.scrollLeft, scrollY);

      setTimeout(()=>{
        loadingWrapper.style.opacity = 0;
        __pageJoiningOption.loading = false;
      },10);

    }
  }

  function getLastWindow() {
    var frames = top.frames;
    return frames[frames.length-1] || top
  }

  window.getLastWindow = getLastWindow;
})();