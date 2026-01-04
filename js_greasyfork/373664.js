// ==UserScript==
// @name         AutoClickPagerize
// @version      1
// @namespace    http://xxyyzz.net/
// @description  just click more-load or next-page button
// @author       kuma
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373664/AutoClickPagerize.user.js
// @updateURL https://update.greasyfork.org/scripts/373664/AutoClickPagerize.meta.js
// ==/UserScript==

(function(){
  var SITEINFO=[
    {
      url:'^https?://jp\\.reuters\\.com/',
      nextElement:'//div[@class="more-load"]',
      exampleURL:'https://jp.reuters.com/theWire'
    },
    {
      url:'^https?://www3\\.nhk\\.or\\.jp/',
      nextElement:'//footer[@class="module--footer button-more"]/p',
      exampleURL:'https://www3.nhk.or.jp/news/catnew.html'
    },
    {
      url:'^https?://www\\.afpbb\\.com/',
      nextElement:'id("next-pager-latest")[not(@style="display: none;")]',
      exampleURL:'http://www.afpbb.com/list/latest'
    },
    {
      url:'^https?://dot\\.asahi\\.com/',
      nextElement:'id("js_foldedBtnReadmore")',
      exampleURL:'https://dot.asahi.com/dot/2018102400082.html'
    },
    {
      url:'^https?://duckduckgo\\.com/\\?q=',
      nextElement:'//a[@class="result--more__btn btn btn--full"]',
      exampleURL:'https://duckduckgo.com/?q=monkey&t=ffsb&ia=web'
    }
   ];
   function getInfo(){
     for (const info of SITEINFO) {
       if((new RegExp(info.url)).exec(document.URL))return info;
     }
    return false;
  }
  function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
  var info=getInfo();
  if(!info)return;
  console.log("--- debug ---");
  var clickonce=true;
  var scroll= function() {
    var nextel=getElementByXpath(info.nextElement);
    if(!nextel)return;
    if(nextel.getBoundingClientRect().top-window.innerHeight+nextel.offsetHeight>-50)return;
    if(!clickonce)return;
    clickonce=false;
    nextel.click();
    setTimeout(function(){clickonce=true;}, 1000);
  }
  window.addEventListener("scroll", scroll, false);
  scroll();
})();