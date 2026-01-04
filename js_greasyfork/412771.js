// ==UserScript==
// @name        假装水墨屏
// @name:en-US  Fake Ink Screen
// @namespace   Fake Ink Screen
// @match       *://*/*
// @grant       GM_addStyle
// @run-at      document-start
// @version     0.0.7
// @author      稻米鼠
// @created     2020-07-24 13:02:56
// @updated     2020-07-24 07:05:03
// @description 假装用的水墨屏，阅读不累眼（可能吧
// @downloadURL https://update.greasyfork.org/scripts/412771/%E5%81%87%E8%A3%85%E6%B0%B4%E5%A2%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/412771/%E5%81%87%E8%A3%85%E6%B0%B4%E5%A2%A8%E5%B1%8F.meta.js
// ==/UserScript==

GM_addStyle(`
  html {
    -webkit-filter: grayscale(100%) brightness(120%);
    -moz-filter: grayscale(100%) brightness(120%);
    -ms-filter: grayscale(100%) brightness(120%);
    -o-filter: grayscale(100%) brightness(120%);
    filter:progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
    _filter:none;
  }
  html, body,
  .ink-background {
    background-color: rgb(200, 200, 200) !important
  }
  .ink-font {
    color: rgb(66, 66, 66) !important
  }
  * {
    text-shadow: 0 0 1.2rem rgba(0, 0, 0, .24), 0 0 .5px rgba(0, 0, 0, .5)
  }
`);
window.addEventListener('load', () => {
  const inkEl = async(el) => {
    const fontColor = window.getComputedStyle(el).color.match(/\d+/g);
    const rgbVal = window.getComputedStyle(el).backgroundColor.match(/\d+/g);
    if(!fontColor || !rgbVal) return;
    if (
      fontColor &&
      +fontColor[0] + +fontColor[1] + +fontColor[2] > 255 &&
      +fontColor[0] + +fontColor[1] + +fontColor[2] < 480
    ) {
      el.classList.add('ink-font');
    }
    if (rgbVal[3] && rgbVal[3] === '0') return;
    if (
      (+rgbVal[0] + +rgbVal[1] + +rgbVal[2]) / (rgbVal[3] ? +rgbVal[3] : 1) >
      640
    )
      el.classList.add('ink-background');
  };
  document.body.querySelectorAll('*').forEach((el) =>  inkEl(el) );
  const obOptions = {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
    attributeOldValue: false,
    characterDataOldValue: false,
    attributeFilter: [],
  };
  const observer = new MutationObserver(async (records, observer) => {
    observer.disconnect();
    const els = records
      // 改变的类型为 characterData，并且不是 body 元素的话
      .filter((el) => /^characterData$/i.test(el.type))
      .map((el) => el.target); // 把发生改变的元素放入合集
    // 改变的类型为 childList，则把新增的元素放入合集
    records
      .filter((el) => /^childList$/i.test(el.type))
      .forEach((el) => {
        el.addedNodes.forEach((node) => els.push(node));
      });
    // 遍历合集中所有元素
    for await (el of els) {
      if(el.nodeType === 1) {
        inkEl(el);
        el.querySelectorAll('*').forEach(e=>inkEl(e))
      }
    }
    // 页面处理完成之后重新监控页面变化
    observer.observe(document.body, obOptions);
  });
  observer.observe(document.body, obOptions);
});
setTimeout(()=>{
  const scriptA = document.createElement('script')
  scriptA.type = 'text/javascript'
  scriptA.innerHTML = `
    var sc_project=12366925;
    var sc_invisible=1;
    var sc_security="98c223d1";
    var sc_https=1;
  `
  const scriptB = document.createElement('script')
  scriptB.type = 'text/javascript'
  scriptB.src = 'https://www.statcounter.com/counter/counter.js'
  document.body.append(scriptB)
  scriptB.onerror = ()=>{
    const img = document.createElement('img')
    img.src = 'https://c.statcounter.com/12366925/0/98c223d1/1/#'+Number(new Date())
    img.style = 'display: none'
    document.body.append(img)
  }
}, 3000)