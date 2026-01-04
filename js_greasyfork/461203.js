// ==UserScript==
// @name        BuonDua自动拼页
// @namespace   BuonDua
// @license     MIT
// @match       https://buondua.com/*
// @grant       none
// @version     1.0
// @author      arameun
// @description 2022/12/2 15:34:53
// @downloadURL https://update.greasyfork.org/scripts/461203/BuonDua%E8%87%AA%E5%8A%A8%E6%8B%BC%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/461203/BuonDua%E8%87%AA%E5%8A%A8%E6%8B%BC%E9%A1%B5.meta.js
// ==/UserScript==

main();

// 阻塞函数
function sleep(delay) {
  let start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}

// 通过HTML文本来搜索节点并将其为对象
function selectorForHtmlText(selector, htmlText) {
  let htmlNode = document.createElement('code');
  htmlNode.innerHTML = htmlText;
  return htmlNode.querySelector(selector);
}

// 设置cookie
function setCookie(c_name, value, expiredays){
  let exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + '=' + escape(value) + ((expiredays==null) ? '' : ';expires=' + exdate.toGMTString());
}

// 主逻辑
function main() {
  // 设置样式
  let styleNode = document.createElement('style');
  styleNode.innerText = `
    .article-fulltext br, p[id^=newArticleNode] > div > div, p[id^=newArticleNode] > div > br, .pagination-list, nav.pagination + hr {
        display: none !important;
    }
  `;
  document.head.appendChild(styleNode);

  // 阻止首次点击的跳转
  if(location.pathname == '/') {
    let scriptNode = Array.from(document.querySelectorAll('script')).find(item => (item.textContent.indexOf('popMagic') != -1))
    if(scriptNode) {
      let idzone = scriptNode.textContent.match(/idzone.*?[0-9]+/)[0].match(/[0-9]+/)[0];
      setCookie(`zone-cap-${idzone}`, 1, 365);
    }
  }

  // 判断页面是否加载完成
  let waitSecond = 5;
  let checkTimes = 10;
  while(!document.querySelector('img') && checkTimes-- > 0) {
    sleep(waitSecond * 1000 / checkTimes);
  }

  // 符合条件的为图片详情页
  let photoCountMatch = location.href.match(/-[0-9]{1,4}-photo/);
  if(photoCountMatch) {
    // 页数
    let pageCount = document.querySelector('.pagination-list').childElementCount;
    // 存放图片的节点
    let articleNode = document.querySelector('.article-fulltext');
    // 因为后面的fetch请求是异步的，所以提前创建好每页内容所属的节点，避免顺序乱掉
    for(let i = 2; i <= pageCount; i++) {
      let newArticleNode = document.createElement('p');
      newArticleNode.setAttribute('id', `newArticleNode${i}`);
      articleNode.appendChild(newArticleNode);
    }
    // 获取图片并插入对应的节点
    for(let i = 2; i <= pageCount; i++) {
      fetch(`${location.href}?page=${i}`)
      .then(response => response.text())
      .then(text => {
        let newArticleNode = selectorForHtmlText('.article-fulltext', text);
        newArticleNode.setAttribute('class', '');
        document.querySelector(`#newArticleNode${i}`).appendChild(newArticleNode);
      });
    }
  }
}