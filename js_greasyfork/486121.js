// ==UserScript==
// @name         问卷星自动答题
// @version      1.9
// @description 全自动填写问卷星的问卷，支持自定义填空答案，平均两三秒填写一份问卷，可多开几个标签同时刷
// @author       MeYangGe
// @match     *://www.wjx.cn/jq/*.aspx
// @match     *://www.wjx.cn/vj/*.aspx
// @match     *://www.wjx.cn/hj/*.aspx
// @match     *://www.wjx.cn/vm/*.aspx
// @match     *://*.wjx.cn/vm/*.aspx
// @match     *://*.wjx.cn/hj/*.aspx
// @match     *://*.wjx.cn/jq/*.aspx
// @match     *://*.wjx.cn/vj/*.aspx
// @match     *://www.wjx.cn/wjx/join/complete.aspx
// @match     *://*.wjx.cn/wjx/join/complete.aspx
// @match     *://www.wjx.top/jq/*.aspx
// @match     *://www.wjx.top/vj/*.aspx
// @match     *://www.wjx.top/hj/*.aspx
// @match     *://www.wjx.top/vm/*.aspx
// @match     *://*.wjx.top/wjx/join/complete.aspx
// @match     *://*.wjx.top/jq/*.aspx
// @match     *://*.wjx.top/vj/*.aspx
// @match     *://*.wjx.top/hj/*.aspx
// @match     *://*.wjx.top/vm/*.aspx
// @match     *://*.wjx.top/wjx/join/complete.aspx
// @match     *://www.wjx.com/jq/*.aspx
// @match     *://www.wjx.com/vj/*.aspx
// @match     *://www.wjx.com/hj/*.aspx
// @match     *://www.wjx.com/vm/*.aspx
// @match     *://www.wjx.com/wjx/join/complete.aspx
// @match     *://*.wjx.com/jq/*.aspx
// @match     *://*.wjx.com/vj/*.aspx
// @match     *://*.wjx.com/hj/*.aspx
// @match     *://*.wjx.com/vm/*.aspx
// @match     *://*.wjx.com/wjx/join/complete.aspx
// @match     *://*.wjx.*/**/*.*********
// @icon         https://image.wjx.com/images/logo.png
// @grant        none
// @namespace http://tampermonkey.net/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486121/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/486121/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  if (location.href === 'https://cdn.jsdelivr.net/') return
  var script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/gh/MeYangGe/AutoWenJuanXing@master/dist/app.bundle.js'
  document.body.appendChild(script)
})()