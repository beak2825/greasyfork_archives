// ==UserScript==
// @name        中国图书网小保姆
// @namespace   XGScripts
// @author      XG.Ley
// @license     GPL v3
// @description 中图网助手，可以查看豆瓣评分
// @include     http://www.bookschina.com/*.htm
// @version     0.0.6
// @grant       GM_xmlhttpRequest
// @esversion   6
// @downloadURL https://update.greasyfork.org/scripts/29890/%E4%B8%AD%E5%9B%BD%E5%9B%BE%E4%B9%A6%E7%BD%91%E5%B0%8F%E4%BF%9D%E5%A7%86.user.js
// @updateURL https://update.greasyfork.org/scripts/29890/%E4%B8%AD%E5%9B%BD%E5%9B%BE%E4%B9%A6%E7%BD%91%E5%B0%8F%E4%BF%9D%E5%A7%86.meta.js
// ==/UserScript==

// 请求
const simpleFetch = url => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "get",
      url,
      onload: resolve,
      onerror: reject
    });
  });
};

// 一些辅助函数
const helper = {
  // pageISBN :: Document -> String
  pageISBN: doc => {
    // 图书详情页，得到isbn信息
    let container = doc.getElementById("copyrightInfor");
    let isbn = container.querySelector("ul li");
    return isbn.textContent.slice(5).trim();
  },
  
  // doubanBook :: String -> Promise Object
  doubanBook: isbn => {
    console.log(isbn);
    // 去豆瓣请求图书信息
    return simpleFetch(`https://api.douban.com/v2/book/isbn/${isbn}`)
     .then(res => res.responseText)
     .then(JSON.parse)
     .then(res => {
      if (res.code) {
        return Promise.reject(res);
      }
      return res;
     })
    ;
  },
  
  // createRate :: Object -> Node
  createRateView: res => {
    const { rating } = res;
    const score = rating.average;
    // 根据得分，创建得分元素
    let view = document.createElement("div");
    view.setAttribute("class", "startWrap");
    view.innerHTML = `<span>豆瓣评分：</span><em>${score}分</em>`;
    
    for (let i = Number(rating.average); i > 0; --i) {
     let star = document.createElement("i");
      if (1 > i) {
        star.classList.add("half");
      }
      else {
        star.classList.add("one");
      }
      
      view.appendChild(star);
    }
    
    for (let i = 10 - Math.ceil(rating.average); i > 0; --i) {
      let star = document.createElement("i");
      view.appendChild(star);
    }
    
    let extra = document.createElement("a");
    extra.setAttribute("class", "orangeline");
    extra.setAttribute("href", res.alt);
    extra.setAttribute("target", "_blank");
    extra.textContent = `已有${rating.numRaters}人评分`
    
    view.appendChild(extra);
    
    return view;
  }
};

(function main() {
  // 主函数
  Promise.resolve(document)
   .then(helper.pageISBN)
   .then(helper.doubanBook)
   .then(res => {
     let view = helper.createRateView(res);
     let review = document.querySelector(".padLeft10");
    
     review.appendChild(view);
   })
   .catch(console.error)
  ;
})();