// ==UserScript==
// @name        滚动条
// @namespace  https://greasyfork.org/zh-CN/users/954189
// @version      2.1.2
// @description  为网页添加滚动条。找不到原作者。年久失修，修修补补再上岗，顺便改了很多不合理的地方。
// @author       ？？？
// @run-at       document-end
// @license      MIT
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/463266/%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/463266/%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==


function createScrollBar() {
  let isScrollBar;
  let whereScroll;
  let clearScrollBar;
  const clientHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;

  isScrollBar = document.getElementById('theScrollBar');

  if (isScrollBar) {
    isScrollBar.parentNode.removeChild(isScrollBar);
  };

  const theScrollBar = document.createElement("div");
  theScrollBar.id = "theScrollBar";
  theScrollBar.innerHTML = "▲<br>▼";

  theScrollBar.addEventListener("touchstart",function (e) {
    e.stopPropagation();
    e.preventDefault();
    if (clearScrollBar) {
      clearTimeout(clearScrollBar);
    };
    return startY = e.changedTouches[0].clientY - parseFloat(this.style.top);
  },true);

  theScrollBar.addEventListener("touchmove", function(e) {
    e.stopPropagation();
    e.preventDefault();
    if (clearScrollBar) {
      clearTimeout(clearScrollBar);
    };
    endY = e.changedTouches[0].clientY;
    const theTop = endY - startY;
    this.style.top = theTop + "px";
    const thePageTop = theTop * (document.documentElement.scrollHeight - document.documentElement.clientHeight) / (document.documentElement.clientHeight - this.offsetHeight);
    window.scrollTo(0, thePageTop);
    whereScroll = window.requestAnimationFrame(updateScrollBarPosition);
  }, true);

  theScrollBar.addEventListener("touchend",function (e) {
    e.stopPropagation();
    e.preventDefault();
    clearScrollBar = setTimeout(function () {
      if (whereScroll) {
        clearInterval(whereScroll);
      };
      setTimeout(function() {
         scrollBar.style.display = "none";
      }, 200);
      scrollBar.style.opacity = "0";
    },1800);
    return clearScrollBar;
  },true);

  theScrollBar.setAttribute("style","font-size:2vw ;width:7vw ;line-height:6vw ;text-align:center ;background-color:rgba(255,255,255) ;opacity: 0.8 ;box-shadow:0px 1px 5px rgba(0,0,0,0.2) ;color:#000 ;position:fixed ;top:" + scrollTop + "px;right:1vw ;z-index:999999 ;transition: opacity 0.2s ease-in-out;transform: translateZ(0);border-radius:1vw ");
  theScrollBar.style.display = 'none';
  document.body.appendChild(theScrollBar);

  window.onscroll = function() {
    if (clearScrollBar) {
      clearTimeout(clearScrollBar);
    }
    clearScrollBar = setTimeout(function() {
      const scrollBar = document.getElementById('theScrollBar');
      setTimeout(function() {
         scrollBar.style.display = "none";
      }, 200);
      scrollBar.style.opacity = "0";
    }, 1800);
  }

  function updateScrollBarPosition() {
    const scrollBar = document.getElementById('theScrollBar');
    const nowScrollTop = document.documentElement.scrollTop;
    const scrollBarHeight = scrollBar.offsetHeight;
    const maxTop = document.documentElement.clientHeight - scrollBarHeight;
    const theTop = ( nowScrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight) ) * maxTop;
    scrollBar.style.top = theTop + "px";
    whereScroll = window.requestAnimationFrame(updateScrollBarPosition);
  }

  document.ontouchmove = function () {
    if ( clearScrollBar ) {
      clearTimeout(clearScrollBar);
    };
    const scrollBar = document.getElementById('theScrollBar');
    if (document.body.scrollHeight < 2 * window.innerHeight) {
      setTimeout(function() {
         scrollBar.style.display = "none";
      }, 200);
      scrollBar.style.opacity = "0";
    }
    else {
      setTimeout(function() {
         scrollBar.style.display = "block";
      }, 200);
      scrollBar.style.opacity = "0.8";
    }
    if (!whereScroll) {
      whereScroll = requestAnimationFrame(updateScrollBarPosition);
    };
  };

  document.ontouchstart = function () {
   if (whereScroll) {
     cancelAnimationFrame(whereScroll);
   };
   whereScroll = requestAnimationFrame(updateScrollBarPosition);
  };
};

createScrollBar();