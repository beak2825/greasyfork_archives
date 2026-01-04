// ==UserScript==

// @name  下载必应网页上的图片

// @description  安装后首页右下角会出现下载标识
// @namespace   Violentmonkey Scripts
// @match       https://*.bing.com/
// @grant       none
// @version     0.7
// @author      Alvin
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/435337/%E4%B8%8B%E8%BD%BD%E5%BF%85%E5%BA%94%E7%BD%91%E9%A1%B5%E4%B8%8A%E7%9A%84%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/435337/%E4%B8%8B%E8%BD%BD%E5%BF%85%E5%BA%94%E7%BD%91%E9%A1%B5%E4%B8%8A%E7%9A%84%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
 
var parent = document.getElementById('sh_rdiv');
if (parent) {
  parent.innerHTML += '<a role="button" id="downBtn" title="Download image" aria-label="Download image" role="button" href="" h="ID=SERP,5054.1" style="cursor: pointer;"><div class="sc_light" style="visibility: visible;"><div id="sh_lt" class="hpcDown"></div></div></a>';
 
  var btn = document.getElementById('downBtn');
  btn.addEventListener('click', function() {
    var title = document.getElementById('sh_cp').title || (document.getElementById('musCardImageTitle').innerHTML + ' ' + document.getElementById('musCardCopyright').innerHTML);
    var bg = document.getElementById('bgDiv').style.backgroundImage;
    imgUrl = bg.slice(4, -1).replace(/"/g, "");
    btn.href = imgUrl;
    btn.download = title + '.jpg'
  }, false);
} else {
  var styleElem = document.head.appendChild(document.createElement("style"));
  styleElem.innerHTML = "#downBtn::after {display: none;} .footer {width: 96% !important; padding: 0 2% !important;}";
 
  setTimeout(function () {
    var parentEl = document.getElementsByClassName('headline')[0];
    var parent = document.createElement('div');
    var el = parentEl.appendChild(parent);
    el.innerHTML = '<a role="button" id="downBtn" title="Download image" aria-label="Download image" role="button" href="#" style="cursor: pointer; width: 2.5rem; height: 2.5rem; position: relative;"><svg class="downloadIcon" x="0px" y="0px" viewBox="0 0 22 22" enable-background="new 0 0 22 22" aria-hidden="true" role="presentation"><path d="M17.842 11.483l-6.671 6.725-6.671-6.725.967-.967 5.017 5.049v-15.565h1.375v15.565l5.017-5.049.966.967zm-12.859 10.517v-1.375h12.375v1.375h-12.375z"></path></svg></a>';
 
    var btn = document.getElementById('downBtn');
    btn.addEventListener('click', function() {
      var card = document.getElementsByClassName('musCardCont')[0]
      var title = card.getElementsByClassName('title')[0].innerText
      var copyright = card.getElementsByClassName('copyright')[0].innerText
      var bg = (document.getElementsByClassName('img_uhd')[0] || document.getElementsByClassName('img_cont')[0]).style.backgroundImage;
      imgUrl = bg.slice(4, -1).replace(/"/g, "");
      btn.href = imgUrl;
      btn.download = title + ' ' + copyright + '.jpg'
    }, false);
  }, 1000)
}