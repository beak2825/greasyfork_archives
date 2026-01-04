// ==UserScript==
// @name         Better ZhiHu
// @version      1.1
// @description  Better ZhiHu view
// @author       Aiello Chan
// @namespace aiellochan.com
// @match           *://www.zhihu.com/question/*
// @match			*://www.zhihu.com/search*
// @match			*://www.zhihu.com/hot
// @match			*://www.zhihu.com/follow
// @match			*://www.zhihu.com/
// @match           *://www.zhihu.com/signin*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410433/Better%20ZhiHu.user.js
// @updateURL https://update.greasyfork.org/scripts/410433/Better%20ZhiHu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const styleNode = document.createElement("style")

    setTimeout(function(){document.title = "知乎"}, 3e3)

    let cssFix = ""
    cssFix += ".Question-mainColumn{width:auto;}" // 答案页全宽
    cssFix += "header,.Question-sideColumn--sticky{display:none !important;}" // 去掉浮动头部
    cssFix += 'html{overflow:auto !important;} .Modal-backdrop,.signFlowModal{display:none !important;}' // 干掉登陆提示

    styleNode.innerText = cssFix
    document.body.append(styleNode)
})();