// ==UserScript==
// @name         自动抽取文章的标题|一键生成文章目录
// @name:en      Auto Extract Article Title|Generate article table of contents with one click
// @namespace    http://life666.top/
// @version      0.2
// @description  自动抽取文章的标题, 生成目录树, 可跳转, 可拖拽
// @description:en  Automatically extract the title of the article, generate table of content, jump, drag and drop
// @author       Nisus Liu
// @license      MIT
// @match        *://cuiqingcai.com/*
// @match        *://juejin.cn/*
// @match        *://*.zhihu.com/*
// @match        *://*.cnblogs.com/*
// @match        *://*.notion.so/*
// @match        *://segmentfault.com/*
// @match        *://*.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/limonte-sweetalert2/11.4.4/sweetalert2.all.min.js
// @require      https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/478014/%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%8F%96%E6%96%87%E7%AB%A0%E7%9A%84%E6%A0%87%E9%A2%98%7C%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%E6%96%87%E7%AB%A0%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/478014/%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%8F%96%E6%96%87%E7%AB%A0%E7%9A%84%E6%A0%87%E9%A2%98%7C%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%E6%96%87%E7%AB%A0%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==


(function () {
  'use strict';
  // Your code here...
  // console.log('[Auto Extract Article Title] script starting ...')
  // Swal.fire('傻子都会计算机')
  console.log(`[Auto Extract Article Title] ${document.domain}`)

  let $tmTocW = $("<div class='TM-AEAT-toc-w'></div>");
  let $tocTtn;
  let hasExtracted = false;
  $tocTtn = $('<button class="TM-AEAT-toc-btn">抽取标题</button>');
  $tocTtn.appendTo('body');
  $tocTtn.on('click', function () {
    if (!hasExtracted) {
      extractToc();
    } else {
      removeToc();
    }
  })

  const idGenerater = (() => {
    let id = 0;
    return function () {
      return ++id;
    }
  })()

  /**
   * 抽取标题, 生成 TOC
   */
  function extractToc() {
    // h1~h6
    let $headers = $(":header");
    // console.log($headers)
    let hs = []
    $headers.each((ix, ele) => hs.push(ele))
    // console.log(hs)
    let $tmToc = $("<div id='TM-AEAT-toc' class='TM-AEAT-toc'></div>");
    $tmTocW.appendTo("body");
    $tmTocW.append($tmToc);
    let tmpLvls = [0, 0, 0, 0, 0, 0]; // 支持6级标题
    hs.forEach(h => {
      // <p class="h2 TM-AEAT-toc-item"><span class="TM-AEAT-toc-item-seq">序号</span> 标题内容 </p>
      let hTitle = h.innerText;
      // 这里需要克隆节点, 否则就是'移动'的效果了
      // let tocH  = h.cloneNode(true);
      let tocHName = h.tagName.toLowerCase();
      let lvl = parseInt(tocHName.substring(1));
      let seq = '';
      if (lvl >= 1 && lvl <= 6) {
        tmpLvls[lvl - 1] += 1; // 当前级别的标题序号增 1
        // 当前层级及之前的序号拼接起来就是需要的序号
        seq = tmpLvls.slice(0, lvl).join('.');
      }

      let hId = h.getAttribute('id');
      if (hId == null) {
        hId = 'TM-AEAT-' + idGenerater();
        h.setAttribute('id', hId);
      }

      let $tocItem = $(`<p class="${tocHName} TM-AEAT-toc-item"><span class="TM-AEAT-toc-item-seq">${seq}</span><a href="#${hId}">${hTitle}</a></p>`);
      // $(tocH).addClass(`TM-AEAT-toc-header-${lvl}`);
      if (lvl > 1) {
        $tocItem.css("text-indent", `${lvl - 1}em`);
      }
      $tmToc.append($tocItem);
    })

    hasExtracted = true;
    $tocTtn.text('取消抽取');
    $tocTtn.addClass('extracted');

    listenDrag();
  }

  /**
   * 溢出 TOC
   */
  function removeToc() {
    $tmTocW.empty();
    $tmTocW.remove();
    $tocTtn.text('抽取标题');
    $tocTtn.removeClass('extracted');
    hasExtracted = false;
  }

  setCustomStyle();

  function listenDrag() {
    // 拖拽能力
    // 鼠标的当前位置
    let x = 0;
    let y = 0;

    // 找到要拖拽的元素
    const ele = document.getElementById('TM-AEAT-toc');

    // 处理鼠标按下事件
    // 用户拖拽时触发
    const mouseDownHandler = function (e) {
      // 获取到鼠标位置
      x = e.clientX;
      y = e.clientY;

      // 对document增加监听鼠标移动事件和鼠标松开事件
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
      // 鼠标移动的距离
      const dx = e.clientX - x;
      const dy = e.clientY - y;

      // 设置元素的位置
      ele.style.top = `${ele.offsetTop + dy}px`;
      ele.style.left = `${ele.offsetLeft + dx}px`;

      // 重新分配鼠标的坐标
      x = e.clientX;
      y = e.clientY;
    };

    const mouseUpHandler = function () {
      // 取消对document对象的事件监听
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    ele.addEventListener('mousedown', mouseDownHandler);
  }

  function setCustomStyle() {
    //获取 style 节点
    let domStyle = document.createElement('style');
    domStyle.type = 'text/css';
    domStyle.rel = 'stylesheet';
    //追加文本节点, 文本节点里内容就是 css 样式长字符串
    domStyle.appendChild(document.createTextNode(`
.TM-AEAT-toc-w {
  position:relative;
}
.TM-AEAT-toc {
  background: #e8f3ffcc;
  position: fixed;
  top: 40px;
  z-index: 10000;
  font-size: 16px;
  width: 20vw;
  border-radius: 0.3em;
  box-shadow: 0 0 10px #a2aab4cc;
}
.TM-AEAT-toc-btn {
  position: fixed;
  bottom: 40px;
  left: 20px;
  z-index: 20000;
  border: none;
  outline: none;
  background-color: red;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 50%;
  opacity:0.5;
}
.TM-AEAT-toc-item-seq {
  color: #ff7f7f;
  margin-right: .5em;
}
    `));
    let domHead = document.getElementsByTagName('head')[0];
    domHead.appendChild(domStyle);
  }


})();
