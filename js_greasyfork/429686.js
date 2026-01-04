// ==UserScript==
// @name         自定义iframe的内容
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       WJX问卷星
// @match        */newwjx/design/sendqstart.aspx?activity=*
// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429686/%E8%87%AA%E5%AE%9A%E4%B9%89iframe%E7%9A%84%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/429686/%E8%87%AA%E5%AE%9A%E4%B9%89iframe%E7%9A%84%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    _$(function(){
        var iframestr = _$("#iframeid textarea").val();
        var newval = iframestr.split("src=")[0]+'style="width:100%" class="goldendata_jinyun" src='+iframestr.split("src=")[1];
        _$("#iframeid textarea").val(newval)
    })
})();