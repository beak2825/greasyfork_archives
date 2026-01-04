// ==UserScript==
// @name 推特短链接还原
// @version 0.0.4
// @author defycase
// @namespace defycase.kwo

// @description  将推特页面上的短链接（t.co）还原为目标链接，省去二次跳转,通过链接注释格式替换实现，无需逐一访问短链，资源开销极小,受技术原理限制，暂时对通过分享发出的推文（正文中无链接文本，以预览卡片形式呈现）的短链无效.目前已经支持的页面：• 时间线页• 推文详情页• 搜索页• 个人主页（包括个人简介中的链接）


// @license      MIT

// @match        https://twitter.com/*
// @grant window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/449314/%E6%8E%A8%E7%89%B9%E7%9F%AD%E9%93%BE%E6%8E%A5%E8%BF%98%E5%8E%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/449314/%E6%8E%A8%E7%89%B9%E7%9F%AD%E9%93%BE%E6%8E%A5%E8%BF%98%E5%8E%9F.meta.js
// ==/UserScript==

const addOb = () => {
  const targetNode = document.querySelector("div[data-testid='primaryColumn']");
  const config = { attributes: true, childList: true, subtree: true };
  const callback = function () {
    changeLink();
  };
  const observer = new MutationObserver(callback);
  // 监听primaryColumn元素变化，动态修改链接
  observer.observe(targetNode, config);
};
const changeLinkByDom = (list) => {
  list.forEach((adom) => {
    if (adom.getAttributeNode("href").value.indexOf("https://t.co/") == 0) {
      let link = adom.text;
      if (
        adom.querySelectorAll("span").length == 3 &&
        adom.text.charAt(adom.text.length - 1) == "…"
      ) {
        link = link.substr(0, link.length - 1);
      }
      adom.setAttribute("href", link);
    }
  });
};
const changeLink = () => {
    const selectList = ["div[data-testid='tweetText'] a",
    "div[data-testid='UserDescription'] a",
    "div[data-testid='UserCell'] a",
    "div[data-testid='UserProfileHeader_Items'] a"]
    selectList.forEach((fs)=>{
        changeLinkByDom(document.querySelectorAll(fs));
    })
};

setTimeout(() => {
  changeLink();
  addOb();
}, 888);
