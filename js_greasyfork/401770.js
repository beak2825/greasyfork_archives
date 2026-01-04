// ==UserScript==
// @name         码云点击更新page按钮
// @namespace    https://xyw.baklib.com/
// @version      0.1.1
// @description  为啥码云还要手动去点更新的???
// @author       Silencer
// @match        *://gitee.com/*/pages
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401770/%E7%A0%81%E4%BA%91%E7%82%B9%E5%87%BB%E6%9B%B4%E6%96%B0page%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/401770/%E7%A0%81%E4%BA%91%E7%82%B9%E5%87%BB%E6%9B%B4%E6%96%B0page%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

onload = () => {
  $.ajax({
    url: location.href + "/rebuild",
    type: 'POST',
    data: {
      branch: $('#branch').val(),
      build_directory: $('#build_directory').val(),
      domain: $('#domain').val(),
      force_https: false
    }
  })
}