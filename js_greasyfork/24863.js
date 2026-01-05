// ==UserScript==
// @name            简书 Markdown 预览同步滚动
// @name:en         Jianshu MD AUTO Scroll
// @namespace       https://github.com/BlindingDark/JianshuMDAutoScroll
// @include         *://www.jianshu.com/writer*
// @version         1.3
// @description:en  jianshu Markdown preview AUTO scroll
// @description     给简书的在线 Markdown 编辑器增加输入预览同步滚动的功能
// @author          BlindingDark
// @grant           none
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/24863/%E7%AE%80%E4%B9%A6%20Markdown%20%E9%A2%84%E8%A7%88%E5%90%8C%E6%AD%A5%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/24863/%E7%AE%80%E4%B9%A6%20Markdown%20%E9%A2%84%E8%A7%88%E5%90%8C%E6%AD%A5%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var spSwitchMain; // 切换的那个按钮所在的窗体
  var txtMain;      // 输入框
  var spPreview;    // 预览框

  const SWITCH_FEATURE   = 'a.fa.fa-columns';
  const EXPAND_FEATURE   = 'a.fa.fa-expand';
  const COMPRESS_FEATURE = 'a.fa.fa-compress';

  function getInput() {
    return $('#arthur-editor');
  }

  function getPreview() {
    return getInput().closest("div").parent().next();
  }

  function scrollEvent(){
    txtMain = getInput()[0];
    spPreview = getPreview()[0];

    if(txtMain == undefined) {
      return;
    }
    if(spPreview == undefined) {
      return;
    }

    let mainFlag = false; // 抵消两个滚动事件之间互相触发
    let preFlag = false; // 如果两个 flag 都为 true，证明是反弹过来的事件引起的

    function scrolling(who){
      if(who == 'pre'){
        preFlag = true;
        if (mainFlag === true){ // 抵消两个滚动事件之间互相触发
          mainFlag = false;
          preFlag = false;
          return;
        }
        txtMain.scrollTop = Math.round((spPreview.scrollTop + spPreview.clientHeight) * txtMain.scrollHeight  / spPreview.scrollHeight - txtMain.clientHeight);
        return;
      }
      if(who == 'main'){
        mainFlag = true;
        if (preFlag === true){ // 抵消两个滚动事件之间互相触发
          mainFlag = false;
          preFlag = false;
          return;
        }
        spPreview.scrollTop = Math.round((txtMain.scrollTop + txtMain.clientHeight) * spPreview.scrollHeight / txtMain.scrollHeight - spPreview.clientHeight);
        return;
      }
    }

    function mainOnscroll(){
      scrolling('main');
    }

    function preOnscroll(){
      scrolling('pre');
    }

    getInput().on('scroll', () => mainOnscroll());
    getPreview().on('scroll', () => preOnscroll());
  }

  function cycle() {
    scrollEvent();
    $(EXPAND_FEATURE).on('click', scrollEvent);
    $(COMPRESS_FEATURE).on('click', scrollEvent);
    $(SWITCH_FEATURE).on("click", scrollEvent);

    window.setTimeout(cycle, 1000);
  }

  cycle();
})();
