// ==UserScript==
// @name        알리익스프레스 달러, 한화 병기 수정용
// @description 알리에서 달러로 설정했을 때 한화도 같이 표시해줌
// @match       *://*.aliexpress.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @version     1.1
// @author      KENAI
// @license     Beerware
// @namespace   https://greasyfork.org/users/943376
// @downloadURL https://update.greasyfork.org/scripts/461794/%EC%95%8C%EB%A6%AC%EC%9D%B5%EC%8A%A4%ED%94%84%EB%A0%88%EC%8A%A4%20%EB%8B%AC%EB%9F%AC%2C%20%ED%95%9C%ED%99%94%20%EB%B3%91%EA%B8%B0%20%EC%88%98%EC%A0%95%EC%9A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/461794/%EC%95%8C%EB%A6%AC%EC%9D%B5%EC%8A%A4%ED%94%84%EB%A0%88%EC%8A%A4%20%EB%8B%AC%EB%9F%AC%2C%20%ED%95%9C%ED%99%94%20%EB%B3%91%EA%B8%B0%20%EC%88%98%EC%A0%95%EC%9A%A9.meta.js
// ==/UserScript==

try{
  function dollarToWonWithText(d){
    return ` (￦` + Math.round( Number(d)*ex ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + `)`
  }
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
      })
      .catch((error) => {
        console.error('클립보드에 복사 실패: ', error);
      });
  }
  function isDateChanged(){
    const storedDate = new Date(GM_getValue("dateCheck", "1999-09-01").replaceAll(`"`, ``)).toDateString();
    return storedDate !== new Date().toDateString();
  }

  function setExchangeRate(){
    const newEx = (window.prompt('환율 설정 (0:자동)', setRate)*1 )??setRate;
    if(newEx != setRate ) {
      GM_setValue('setRate', newEx);
      location.reload();
    }
  }
  GM_registerMenuCommand("환율 설정", ()=>{setExchangeRate()});

  let setRate = GM_getValue('setRate', 0);
  let ex = 0;

  if(setRate == 0){
    ex = GM_getValue('lastEx', 1300);

    if(isDateChanged()){
      GM_xmlhttpRequest({
        url: `https://www.google.com/finance/quote/USD-KRW`,
        method: "GET",
        onload: function(response){
          ex = response.responseText.split(`data-last-price="`)[1].split(`"`)[0];
          GM_setValue('lastEx', ex);
          console.log("환율 업데이트: " +ex)
        }
      });
      GM_setValue("dateCheck", JSON.stringify(new Date()));
    }
  } else {
    ex = setRate;
  }
  console.log("환율: " +ex);

  function whenReady() {
    return new Promise((resolve) => {
      function completed() {
        document.removeEventListener('DOMContentLoaded', completed);
        window.removeEventListener('load', completed);
        resolve();
      }
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', completed);
        window.addEventListener('load', completed);
      }
    });
  }

  whenReady().then(() => {
    GM_addStyle(`
      #wrap {min-width: 760px}
      .uniform-banner-box-price {display: inline-block}
      .uniform-banner-box-discounts {display: block}
      ._2WtFn {display: block}
      ._1fMek {display: block}
      ._3-9d7 {display: block}
    `);

    const url = location.href;

    //스토어에서 가격 낮은순, 무배 빨리
    if(url.includes(`/store/`)){
      const storId = pageConfig?.storeId??url.split(`?`)[0].split(`/`).pop().split(`.html`)[0];
      console.log(url.split(`?`)[0].split(`/`).pop().split(`html`)[0])
      //const topMenu = document.getElementById(`5893108`).nextSibling.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild;
      //console.log(topMenu)
      GM_registerMenuCommand("가격 낮은순, 무배", ()=>{
        location.href = `https://ko.aliexpress.com/store/all-wholesale-products/`+storId+`.html?isFreeShip=y&SortType=price_asc`
      });
    }

    //아이템 페이지 주소 간략화 버튼 추가
    if(url.includes('.aliexpress.com/item/')) {
      //const match = url.match(/((?:https?:)?\/\/(?:\w+\.)?aliexpress\.com\/(?:store\/product\/[^\/]+\/[0-9_]+|item\/(?:[^\/]+\/)?[0-9_]+)\.html)(\?[^#\r\n]+)?(#.+)?/i)
      const match = url.match(/([^\?#\r\n]+)(\?[^#\r\n]+)(#.+)?/i)
      const sourceType = match[2].match(/sourceType=\d+/)
      const shortenUrl = match[1] + (sourceType?('?'+sourceType):"") + (match[3]??'')
      //window.history.replaceState(history.state, document.title, shortenUrl)
      const here = document.getElementsByClassName(`product-reviewer`)[0]
      const btn = here.appendChild(document.createElement('button'))
      btn.textContent = " 링크 복사 "
      btn.addEventListener('click', ()=>{copyToClipboard(url)})
      const btn2 = here.appendChild(document.createElement('button'))
      btn2.textContent = " 간소화 복사 "
      btn2.addEventListener('click', ()=>{copyToClipboard(shortenUrl)})
      btn2.style.marginLeft = '5px';
    }

    function change(orig){
      orig.forEach(s =>{
        let h = s.innerHTML;
        if(h == `US $`) {
          const n = s.parentElement.innerText.split(`$`)[1].replaceAll(/\n/g, "");
          s.parentElement.lastChild.innerText += dollarToWonWithText(n)
          s.innerHTML = `$`
        } else if(s.className == `uniform-banner-box-price`){
          const n = s.innerText.split(`$`)[1]
          let a = document.getElementById("a121")
          if(!a){
            a = document.createElement('span')
            a.id = "a121"
            a.style.color = "white"
          }
          a.textContent = dollarToWonWithText(n)
          s.after(a)
        } else if(s.className == `pl-order-toal-container__item-content`){
          const n = s.innerText.split(`$`)[1]
          let a = document.getElementById("a122")
          if(!a){
            a = document.createElement('span')
            a.id = "a122"
            a.style.color = "black"
          }
          a.textContent = dollarToWonWithText(n)
          s.after(a)
        } else {
          let l = h.split('<')[0].trim().match(/US \$\d+[\.]?[\d]*/g)??h.split('<')[0].trim().match(/US\$\d+[\.]?[\d]*/g)
          if(l == null) return
          l.forEach(p => {
            const n = p.split(`$`)[1];
            h = h.replace(p, `$`+ n + dollarToWonWithText(n) );
          });
          s.innerHTML = h.replaceAll(`US $`,`$`).replaceAll(`US$`,`$`);
          s.style.display = 'block'
        }
      })
    }

    function check(node){
      let h = node.innerHTML;
      let t = node.textContent;
      if(t.match(/US \$\d[\.\d]+/g)){

        let l = h.split('<')[0].trim().match(/US \$\d[\.\d]+/g)
        if (l != null){
          l.forEach()
        } else {
          node.children.map(c => check(c))
        }
        return true
      } else {
        return false
      }
    }

    const option = {attributes: true, childList: true, characterData: true, subtree: true};
    const observer = new MutationObserver( mutations => {
      observer.disconnect()
      change(Array.from(document.all))
      //change(Array.from(mutations).map(m=>m.target))
      observer.observe(document, option)
    });
    observer.observe(document, option);

    //change(Array.from(document.all))
    //
    // 스토어 페이지

  });
} catch(e){

}