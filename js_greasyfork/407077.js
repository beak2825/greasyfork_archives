// ==UserScript==
// @name        Ctlr+鼠标右键复制选中内容
// @namespace   Ctrl Right copy
// @match       *://*/*
// @grant       GM_setClipboard
// @grant       GM_notification
// @version     1.2
// @author      -
// @description 2020/4/27 下午4:53:47
// @downloadURL https://update.greasyfork.org/scripts/407077/Ctlr%2B%E9%BC%A0%E6%A0%87%E5%8F%B3%E9%94%AE%E5%A4%8D%E5%88%B6%E9%80%89%E4%B8%AD%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/407077/Ctlr%2B%E9%BC%A0%E6%A0%87%E5%8F%B3%E9%94%AE%E5%A4%8D%E5%88%B6%E9%80%89%E4%B8%AD%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

document.oncontextmenu = (event) => {
  if(event.ctrlKey){
    event.preventDefault();
    const selectText = window.getSelection().toString().replace(/\n+/g, '\n\n');
    if (selectText.length) {
      GM_setClipboard(selectText);
      GM_notification({
        text: selectText,
        title: '复制到如下内容：',
        timeout: 2000,
      })
    }
  }
};
