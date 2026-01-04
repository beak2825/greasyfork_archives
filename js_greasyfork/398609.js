// ==UserScript==
// @name          鱼比价
// @author	      Paranoid_AF
// @namespace     Paranoid_AF.djv
// @version  	  1.0
// @grant GM_xmlhttpRequest
// @description   提供 duozhuayu.com 的比价功能。
// @require https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @include       https://www.duozhuayu.com/*
// @connect book.douban.com
// @grant   GM_getValue
// @grant   GM_setValue
// @grant   GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/398609/%E9%B1%BC%E6%AF%94%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/398609/%E9%B1%BC%E6%AF%94%E4%BB%B7.meta.js
// ==/UserScript==


(function() {
  const processDetail = (params) => {
    setTimeout(()=>{
      getPriceInfo($(document));
    }, 100);
  }
  
  const getPriceInfo = (page) => {
    let redirLink = $(page).find(".outer-link")[0].href;
    let doubanLink = redirLink.split("=")[1];
    GM_xmlhttpRequest({
      method: "GET",
      url: doubanLink,
      onload: (e) => {
        let priceList = extractPriceList($.parseHTML(e.response));
        injectDetailPage(priceList);
      }
    });
  }

  const injectDetailPage = (priceList) => {
    let infoFirst = $(".info-row")[0];
    for(let i in priceList){
      let cloneNode = $(infoFirst).clone();
      let infoSubject = $(cloneNode).find("span");
      let infoPrice = $(cloneNode).find("dd");
      $(infoSubject).text(priceList[i].store+"价");
      $(cloneNode).find("dt").css("width", priceList[i].store.split("").length * 18);
      $(infoPrice).text(priceList[i].price);
      $(infoPrice).css("color", "#f23737");
      $(infoPrice).append(`&nbsp;<a href="${priceList[i].link}" target="_blank" rel="nofollow">查看 &raquo;</a>`);
      $(infoPrice).find("a").css("color", "rgb(24, 195, 170)");
      $(infoFirst.parentNode).prepend($(cloneNode));
    }
    if(priceList.length > 0){
      $(infoFirst.parentNode).prepend(`<span style="color: #f23737;">以下价格来自豆瓣读书，链接为豆瓣的返利链接，<b style="font-weight: 600">不是脚本作者的返利链接</b>!</span>`);
    }else{
      $(infoFirst.parentNode).prepend(`<span style="color: #f28181;">暂无其它商店的价格信息。</span>`);
    }
  }

  const extractPriceList = (page) => {
    let priceInfo = [];
    let priceSection = $(page).find(".bs.noline.more-after"); // New books prices for sure.
    if(priceSection.length > 0){
      priceSection = priceSection[priceSection.length - 1];
      let priceRaw = $(priceSection).children();
      for(let i=1; i<priceRaw.length; i++){
        if(priceRaw[i].className === "buylink-title second-hand"){
          break;
        }
        if(priceRaw[i].tagName.toLowerCase() === "li"){
          let infoList = $(priceRaw[i]).find("span");
          if(infoList.length > 0){
            priceInfo.push({
              store: infoList[0].textContent,
              price: infoList[1].textContent.replace(/[\\n\s]+/g, ' '),
              link: $(priceRaw[i]).find("a")[0].href
            });
          }
        }
      }
    }
    return priceInfo;
  }
  

  // CONSTANTS: Just to avoid stupid errors.
  const pageTypes = Object.freeze({
    DETAIL: {
      key: "djv_detail",
      handler: processDetail
    },
    CART: {
      key: "djv_cart",
      handler: null
    },
    OTHER: {
      key: "djv_other",
      handler: null
    }
  });

  // HOOK: Injects history.pushState, to listen for URL change issued by page. Found on https://stackoverflow.com/questions/10419898/is-there-a-callback-for-history-pushstate/10419974#10419974
  //       P.S. It's year 2020, and SPA are everywhere. However we still have to use a hack for this??
  var pushState = history.pushState;
  history.pushState = function () {
    if(arguments[2] !== undefined){
      handleUrlChange(arguments[2]);
    }
    pushState.apply(history, arguments);
  };

  // HOOK: Listen for URL change issued by user, mostly for navigating.
  window.onpopstate = (e) => {
    handleUrlChange(e.target.location.pathname);
  }

  $(document).ready(() => {
    setTimeout(() => {
      handleUrlChange(document.location.href);
    }, 1000);
  });

  // HANDLER: Handle URL changes.
  const handleUrlChange = (pathname) =>{
    pageInfo = getPageInfo(pathname);
    if(!!pageInfo.type.handler){
      pageInfo.type.handler(pageInfo.params);
    }
  }



  /*
    UTIL: Get page info from pathname.
    Return: {
      type: pageTypes.*,
      params: { }
    }
  */
  const getPageInfo = (pathname) => {
    let pathParts = pathname.split("/");
    let pageInfo = {
      type: pageTypes.OTHER,
      params: null
    }

    if(pathParts.length > 1){
      if(pathParts[pathParts.length - 1] === "cart"){
        pageInfo.type = pageTypes.CART;
      }
    }
    
    if(pathParts.length > 2){
      if(pathParts[pathParts.length - 2] === "books"){
        let bookId = pathParts[pathParts.length - 1];
        pageInfo.type = pageTypes.DETAIL;
        pageInfo.params = {
          id: bookId
        };
      }
    }

    return pageInfo;
  }
})();